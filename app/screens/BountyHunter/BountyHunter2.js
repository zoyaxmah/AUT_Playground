// Import statements remain the same
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
    const [username, setUsername] = useState(route?.params?.playerName || '');
    const [role, setRole] = useState(''); // Player's role: Hider or Hunter
    const [code, setCode] = useState(''); // Hider's generated code
    const [inputCode, setInputCode] = useState(''); // Hunter's entered code
    const [points, setPoints] = useState(0); // Player's points
    const [timeLeft, setTimeLeft] = useState(60); // Countdown timer in seconds
    const [hiderFound, setHiderFound] = useState(false); // New state: track if Hider was found

    let finalPoints = 0;

    const translateY = useSharedValue(height);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    useEffect(() => {
        const loadUsername = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('user_username');
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

        if (!username) {
            loadUsername();
        }
    }, [username, navigation]);

    useEffect(() => {
        if (!gameName || !username) {
            Alert.alert('Error', 'Game name or username is missing. Returning to the main screen.');
            navigation.goBack();
            return;
        }

        socket.emit('join-game', { gameName, name: username });

        socket.on('player-joined', ({ isHider }) => {
            setRole(isHider ? 'Hider' : 'Hunter');
        });

        socket.on('code-assigned', ({ code }) => {
            setCode(code);
        });

        socket.on('code-correct', ({ playerName }) => {
            handleHunterSuccess(playerName);
        });

        socket.on('code-incorrect', ({ playerName }) => {
            if (playerName === username) {
                Alert.alert('Incorrect Code', 'You entered the wrong code.');
            }
        });

        return () => {
            socket.off('player-joined');
            socket.off('code-assigned');
            socket.off('code-correct');
            socket.off('code-incorrect');
        };
    }, [gameName, username]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setTimeLeft(0);
                    setTimeout(() => {
                        if (role) {
                            endGame(); // Trigger endGame function once time runs out
                        }
                    }, 300);

                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [role]);

    const handleHunterSuccess = (winningPlayerName) => {
        const earnedPoints = 50;
        if (winningPlayerName === username) {
            console.log('Hunter found the Hider:', username, 'earned 50 points');
            updatePoints(earnedPoints);
            Alert.alert('Congratulations!', 'You found the Hider! You earned 50 points.', [
                { text: 'OK', onPress: () => navigation.replace('GameEnded', { earnedPoints }) },
            ]);
        }
        setHiderFound(true); // Mark that the Hider was found
    };

    const handleHunterLoss = () => {
        const earnedPoints = 25;
        updatePoints(earnedPoints);
        Alert.alert('Game Over', 'You did not find the Hider. You earned 25 points.', [
            { text: 'OK', onPress: () => navigation.replace('GameEnded', { earnedPoints }) },
        ]);
    };

    const handleHiderPoints = async () => {
        const earnedPoints = 50; // Always assign 50 points if Hider was found
        await updatePoints(earnedPoints);
        Alert.alert('Game Over', 'You were found by a Hunter. You earned 50 points.', [
            { text: 'OK', onPress: () => navigation.replace('GameEnded', { earnedPoints }) },
        ]);
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
        socket.emit('submit-code', { playerName: username, submittedCode: inputCode });
        setInputCode(''); // Clear the input field
    };

    const endGame = async () => {
        if (role === 'Hider') {
            await handleHiderPoints(); // Handle points for the Hider
        } else if (role === 'Hunter') {
            if (hiderFound) {
                navigation.replace('GameEnded', { earnedPoints: points });
            } else {
                handleHunterLoss(); // Ensure Hunters who didn't submit a code get 25 points and navigate to GameEnded
            }
        }
    };

    const handleGesture = (event) => {
        const newY = event.nativeEvent.translationY + translateY.value;
        translateY.value = Math.min(newY, height);
    };

    const handleGestureEnd = () => {
        translateY.value = withSpring(height);
    };

    const showPanel = () => {
        translateY.value = withSpring(height / 2);
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
