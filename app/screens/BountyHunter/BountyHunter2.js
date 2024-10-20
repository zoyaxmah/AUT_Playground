import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { io } from 'socket.io-client';
import { BASE_URL } from '../../config/config'; // Use centralized config

const { height } = Dimensions.get('window');
const socket = io(BASE_URL);

export default function BountyHunter2({ route, navigation }) {
    // Get gameName and playerName from route params
    const gameName = route?.params?.gameName;
    const playerName = route?.params?.playerName;

    // State variables
    const [role, setRole] = useState(''); // Player's role: Hider or Hunter
    const [code, setCode] = useState(''); // Hider's generated code (received from the server)
    const [inputCode, setInputCode] = useState(''); // Hunter's entered code
    const [players, setPlayers] = useState([]); // List of connected players
    const [points, setPoints] = useState(0); // Hunter's points
    const [timeLeft, setTimeLeft] = useState(120); // Countdown timer in seconds (2 minutes)

    // For sliding panel (start off-screen initially)
    const translateY = useSharedValue(height); // Start the sliding panel completely off-screen
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    // Countdown timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    navigation.replace('GameEnded'); // Navigate to the Game Ended screen
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    }, [navigation]);

    // Function to format time in mm:ss
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    useEffect(() => {
        if (!gameName || !playerName) {
            console.error('gameName or playerName is undefined! Returning to previous screen.');
            Alert.alert('Error', 'Game name or player name is missing. Returning to the main screen.');
            navigation.goBack(); // Return to the previous screen if gameName or playerName is missing
            return;
        }

        // Emit player joining event with player name and gameName
        console.log('Emitting join-game event for player:', playerName, 'with gameName:', gameName);
        socket.emit('join-game', { gameName, name: playerName });

        // Listen for player joined event and role assignment
        socket.on('player-joined', (newPlayer) => {
            console.log('Received player-joined event:', newPlayer);

            if (!newPlayer) {
                console.error('No newPlayer data received!');
                return;
            }

            setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
            console.log('New player data:', newPlayer);

            // Assign the role based on the Hider status (first player to join is the Hider)
            if (newPlayer.isHider) {
                console.log('Player is the Hider');
                setRole('Hider');
            } else {
                console.log('Player is a Hunter');
                setRole('Hunter');
            }
        });

        // Listen for the assigned code for the Hider
        socket.on('code-assigned', ({ code }) => {
            console.log('Code assigned by server:', code);
            setCode(code);  // Update the state with the code received from the server
        });

        // Cleanup event listeners on unmount
        return () => {
            socket.off('player-joined');
            socket.off('code-assigned');
        };
    }, [gameName, playerName]);

    // Handle code submission by Hunter
    const handleCodeSubmit = () => {
        if (inputCode.trim() === '') {
            Alert.alert('Error', 'Please enter a valid code!');
            return;
        }

        // Emit the code submission event
        socket.emit('submit-code', { playerName, submittedCode: inputCode });
        setInputCode(''); // Clear the input field
    };

    // Listen for the result of code submission
    useEffect(() => {
        // Handle correct code submission
        socket.on('code-correct', ({ playerName, points }) => {
            Alert.alert('Correct Code!', `${playerName} earned ${points} points!`);
            setPoints((prevPoints) => prevPoints + points); // Update points for the current player
        });

        // Handle incorrect code submission
        socket.on('code-incorrect', ({ playerName }) => {
            Alert.alert('Incorrect Code', `${playerName} entered the wrong code.`);
        });

        return () => {
            socket.off('code-correct');
            socket.off('code-incorrect');
        };
    }, []);

    // Handle gesture for sliding panel
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

    // Handle the panel slide up with a button press
    const showPanel = () => {
        translateY.value = withSpring(height / 2); // Bring the panel up to halfway when button is pressed
    };

    return (
        <View style={styles.container}>
            {/* Map View */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -36.853500246993384,
                    longitude: 174.766484575191,
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.0021,
                }}
            >
                <Marker
                    coordinate={{ latitude: -36.853500246993384, longitude: 174.766484575191 }}
                    title="My Location"
                    description="This is where the action happens!"
                />
            </MapView>

            {/* Timer display */}
            <Text style={styles.timerText}>Game Time Left: {formatTime(timeLeft)}</Text>

            {/* Button to slide the panel up */}
            <TouchableOpacity style={styles.showPanelButton} onPress={showPanel}>
                <Text style={styles.showPanelText}>Show Panel</Text>
            </TouchableOpacity>

            {/* Sliding Panel */}
            <PanGestureHandler onGestureEvent={handleGesture} onEnded={handleGestureEnd}>
                <Animated.View style={[styles.panel, animatedStyle]}>
                    <View style={styles.panelContent}>
                        <View style={styles.textContainer}>
                            <Text style={styles.roleText}>Role: {role || 'Assigning...'}</Text>

                            {role === 'Hider' ? (
                                <Text style={styles.hiderText}>
                                    Try not to get caught & earn points!{'\n\n'}
                                    Share this code with the Hunters if they find you:
                                    {'\n\n'}
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
        fontweight: 500,
        lineheight: 1,
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
