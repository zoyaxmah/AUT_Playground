import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { BASE_URL } from '../../config/config';

const { height } = Dimensions.get('window');
const socket = io(BASE_URL);

export default function BountyHunter2({ route, navigation }) {
    const gameName = route?.params?.gameName;
    const [username, setUsername] = useState(route?.params?.playerName || ''); // Retrieve username from route params
    const [role, setRole] = useState(''); // Player's role: Hider or Hunter
    const [code, setCode] = useState(''); // Hider's generated code (received from the server)
    const [inputCode, setInputCode] = useState(''); // Hunter's entered code
    const [points, setPoints] = useState(0); // Hunter's points
    const [timeLeft, setTimeLeft] = useState(120); // Countdown timer in seconds
    const [hiderFoundCount, setHiderFoundCount] = useState(0); // Track how many Hunters found the Hider

    // Sliding panel setup
    const translateY = useSharedValue(height); // Start the sliding panel completely off-screen
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    // Function to format time in mm:ss format
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // Load the player's username from AsyncStorage
    useEffect(() => {
        const loadUsername = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('user_username');
                console.log('Retrieved username from AsyncStorage:', storedUsername);  // Log the username
                if (storedUsername) {
                    setUsername(storedUsername);
                } else {
                    Alert.alert('Error', 'Username not found. Returning to the main screen.');
                    navigation.goBack();
                }
            } catch (error) {
                console.error('Error loading username:', error);
                Alert.alert('Error', 'Failed to load username.');
            }
        };

        // Only load username if it's not already set
        if (!username) {
            loadUsername();
        }
    }, [username, navigation]);

    useEffect(() => {
        if (!gameName || !username) {
            console.error('gameName or username is undefined! Returning to previous screen.');
            Alert.alert('Error', 'Game name or username is missing. Returning to the main screen.');
            navigation.goBack();
            return;
        }

        // Emit player joining event with username and gameName
        console.log('Emitting join-game event for player:', username, 'with gameName:', gameName);
        socket.emit('join-game', { gameName, name: username });

        // Handle player joining and role assignment
        socket.on('player-joined', (newPlayer) => {
            console.log('New player data:', newPlayer);
            if (newPlayer.isHider) {
                setRole('Hider');
            } else {
                setRole('Hunter');
            }
        });

        // Handle code assignment to the Hider
        socket.on('code-assigned', ({ code }) => {
            setCode(code);
        });

        // Handle correct and incorrect code submission
        socket.on('code-correct', ({ playerName }) => {
            console.log(`Player ${playerName} found the Hider!`);
            handleHunterSuccess(playerName);
        });

        socket.on('code-incorrect', ({ playerName }) => {
            if (playerName === username) {
                console.log(`You entered the wrong code.`);
                Alert.alert('Incorrect Code', `Sorry, you entered the wrong code.`);
            }
        });

        return () => {
            socket.off('player-joined');
            socket.off('code-assigned');
            socket.off('code-correct');
            socket.off('code-incorrect');
        };
    }, [gameName, username]);

    // Countdown timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setTimeLeft(0); // Ensure the state is set first
                    endGame(); // Trigger endGame function once time runs out
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    }, []);

    const handleHunterSuccess = (winningPlayerName) => {
        const newFoundCount = hiderFoundCount + 1;
        setHiderFoundCount(newFoundCount);

        let earnedPoints = 25; // Default points for anyone after the first 3
        if (newFoundCount === 1) earnedPoints = 100;
        else if (newFoundCount === 2) earnedPoints = 75;
        else if (newFoundCount === 3) earnedPoints = 50;

        // Check if the current player's name matches the winning player's name
        if (winningPlayerName === username) {
            updatePoints(earnedPoints);
            Alert.alert('Congratulations!', 'Correct Code Entered! You earned points.', [
                { text: 'OK', onPress: () => navigation.replace('GameEnded', { earnedPoints }) },
            ]);
        }
    };

    const updatePoints = async (earnedPoints) => {
        try {
            const storedPoints = await AsyncStorage.getItem('user_points');
            const updatedPoints = (parseInt(storedPoints) || 0) + earnedPoints;
            setPoints(updatedPoints);
            await AsyncStorage.setItem('user_points', updatedPoints.toString());
        } catch (error) {
            console.error('Error updating points:', error);
        }
    };

    const handleCodeSubmit = () => {
        if (inputCode.trim() === '') {
            Alert.alert('Error', 'Please enter a valid code!');
            return;
        }

        // Emit the code submission event
        socket.emit('submit-code', { playerName: username, submittedCode: inputCode });
        setInputCode(''); // Clear the input field
    };

    const endGame = async () => {
        if (role === 'Hider' && hiderFoundCount === 0) {
            updatePoints(100); // Hider earns 100 points if not found
        } else if (role === 'Hunter' && hiderFoundCount === 0) {
            updatePoints(15); // Hunters earn 15 points for participating
        }

        // Delay the navigation slightly to ensure state update before navigation
        setTimeout(() => {
            navigation.replace('GameEnded', { earnedPoints: points });
        }, 100);
    };

    const handleGesture = (event) => {
        const newY = event.nativeEvent.translationY + translateY.value;
        translateY.value = Math.min(newY, height); // Ensure it doesn't go above the screen
    };

    const handleGestureEnd = () => {
        if (translateY.value > height / 2) {
            translateY.value = withSpring(height); // Snap back down
        } else {
            translateY.value = withSpring(height / 2); // Snap to halfway height
        }
    };

    const showPanel = () => {
        translateY.value = withSpring(height / 2); // Bring the panel up to halfway when button is pressed
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -36.853395,
                    longitude: 174.767024,
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.0021,
                }}
            >
                <Marker
                    coordinate={{ latitude: -36.853395, longitude: 174.767024 }}
                    title="My Location"
                    description="This is where the action happens!"
                />
            </MapView>

            <Text style={styles.timerText}>Game Time Left: {formatTime(timeLeft)}</Text>

            <TouchableOpacity style={styles.showPanelButton} onPress={showPanel}>
                <Text style={styles.showPanelText}>Show Panel</Text>
            </TouchableOpacity>

            <PanGestureHandler onGestureEvent={handleGesture} onEnded={handleGestureEnd}>
                <Animated.View style={[styles.panel, animatedStyle]}>
                    <View style={styles.panelContent}>
                        <View style={styles.textContainer}>
                            <Text style={styles.roleText}>Role: {role || 'Assigning...'}</Text>

                            {role === 'Hider' ? (
                                <Text style={styles.hiderText}>
                                    Try not to get caught & earn points!{'\n\n'}
                                    Share this code with the Hunters if they find you:
                                    {'\n\n\n'}
                                    <Text style={styles.codeText}>{code}</Text>
                                </Text>
                            ) : role === 'Hunter' ? (
                                <>
                                    <Text style={styles.hunterText}>
                                        Find the Hider and get their code to earn points.
                                    </Text>
                                    <View style={styles.rowContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter Hider's Code"
                                            value={inputCode}
                                            onChangeText={setInputCode}
                                            keyboardType="number-pad"
                                        />
                                        <TouchableOpacity style={styles.submitButton} onPress={handleCodeSubmit}>
                                            <Text style={styles.buttonText}>Submit Code</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                <Text>Waiting for role assignment...</Text>
                            )}

                            <Text style={styles.pointsText}>Points: {points}</Text>
                        </View>
                    </View>
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { ...StyleSheet.absoluteFillObject },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
        position: 'absolute',
        top: 60,
        color: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        left: '50%',
        transform: [{ translateX: -90 }],
    },
    showPanelButton: {
        position: 'absolute',
        bottom: 100,
        left: '50%',
        transform: [{ translateX: -75 }],
        backgroundColor: '#fc6a26',
        padding: 10,
        width: 150,
        alignItems: 'center',
        borderRadius: 10,
    },
    showPanelText: {
        color: '#fff',
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
    panel: {
        position: 'absolute',
        bottom: 0,
        height: height,
        width: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    panelContent: { justifyContent: 'center', alignItems: 'center' },
    textContainer: { alignItems: 'center', marginRight: 10 },
    roleText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    hiderText: { fontSize: 17, color: '#333', textAlign: 'center', marginBottom: 20 },
    hunterText: { fontSize: 17, color: '#333', textAlign: 'center', marginBottom: 20 },
    codeText: {
        fontWeight: 'bold',
        color: '#fc6a26',
        fontSize: 30,
        textAlign: 'center',
        paddingVertical: 10,
        backgroundColor: '#f4f4f4',
        borderRadius: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        width: 150,
        textAlign: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        marginRight: 20,
        fontSize: 15,
    },
    submitButton: {
        backgroundColor: '#fc6a26',
        padding: 15,
        borderRadius: 15,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    pointsText: { marginTop: 30, fontSize: 18, color: '#333' },
});
