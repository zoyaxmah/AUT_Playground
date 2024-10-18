import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Alert,
    TextInput,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { io } from 'socket.io-client';

const { height } = Dimensions.get('window');
const socket = io('http://172.29.46.86:3000'); // Use your machine's local IP address

/**
 * BountyHunter2 is a React Native component that provides a MapView with a sliding
 * panel for players to interact with. The component assigns a role (Hider or Hunter)
 * to the player and provides a code for the Hider to share with Hunters. The Hunter
 * can submit the code to earn points.
 *
 * Props:
 * - navigation: The navigation object from React Navigation.
 *
 * State:
 * - role: The player's role (Hider or Hunter).
 * - players: The list of connected players.
 * - code: The code generated for the Hider.
 * - inputCode: The code input by the Hunter.
 * - points: The Hunter's points.
 */
export default function BountyHunter2({ navigation }) {
    const [role, setRole] = useState(''); // Player's role: Hider or Hunter
    const [players, setPlayers] = useState([]); // List of connected players
    const [code, setCode] = useState(''); // Hider's generated code
    const [inputCode, setInputCode] = useState(''); // Hunter's entered code
    const [points, setPoints] = useState(0); // Hunter's points
    const [canJoinGame, setCanJoinGame] = useState(false); // Controls "Join Game" button visibility
    const [countdown, setCountdown] = useState(0); // Countdown timer for game start

    const translateY = useSharedValue(height); // Controls panel sliding animation

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    // Handle player joining and role assignment
    useEffect(() => {
        console.log('Waiting for player to join...');
        socket.emit('join-game', { name: 'Player1' }); // Emit player joining event

        // Handle player joined event
        socket.on('player-joined', (newPlayer) => {
            console.log('New Player Joined:', newPlayer);
            Alert.alert('New Player', `${newPlayer.name} joined!`);

            setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);

            // Assign role based on the Hider status
            if (newPlayer.isHider) {
                setRole('Hider');
                socket.on('code-assigned', (assignedCode) => {
                    console.log('Received code:', assignedCode);
                    setCode(assignedCode);
                    Alert.alert('Your Code', `Share this code with Hunters: ${assignedCode}`);
                });
            } else {
                setRole('Hunter');
            }
        });

        // Handle joinable event (5 minutes before the game starts)
        socket.on('joinable', (data) => {
            Alert.alert('Game Available', data.message);
            setCanJoinGame(true); // Show "Join Game" button

            // Start countdown timer for the remaining time before the game starts
            const eventTime = new Date(data.event.startTime).getTime();
            const now = new Date().getTime();
            const timeRemaining = (eventTime - now) / 1000; // In seconds

            // Update the countdown every second
            const timer = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown <= 0) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
            setCountdown(timeRemaining); // Set initial countdown value
        });

        // Handle correct code submission
        socket.on('code-correct', ({ playerName, points }) => {
            Alert.alert('Correct Code!', `${playerName} earned ${points} points!`);
            setPoints((prevPoints) => prevPoints + points);
        });

        // Handle incorrect code submission
        socket.on('code-incorrect', ({ playerName }) => {
            Alert.alert('Incorrect Code', `${playerName} entered the wrong code.`);
        });

        return () => {
            socket.off('player-joined');
            socket.off('code-assigned');
            socket.off('code-correct');
            socket.off('code-incorrect');
            socket.off('joinable');
        };
    }, []);

    // Handle panel sliding gestures
    const handleGesture = (event) => {
        translateY.value = Math.min(event.nativeEvent.translationY + translateY.value, height);
    };

    const handleGestureEnd = () => {
        translateY.value = withSpring(translateY.value > height / 2 ? height : height / 2);
    };

    // Handle code submission
    const handleCodeSubmit = () => {
        if (inputCode.trim() === '') {
            Alert.alert('Error', 'Please enter a valid code!'); // Prevent empty submissions
            return;
        }

        socket.emit('submit-code', { playerName: 'Hunter1', submittedCode: inputCode });
        setInputCode(''); // Clear the input field
    };

    // Handle join game button press
    const handleJoinGame = () => {
        Alert.alert('You joined the game!');
        navigation.navigate('BountyHunter'); // Navigate to the game screen
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -36.8535,
                    longitude: 174.7664,
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.0021,
                }}
            >
                <Marker
                    coordinate={{ latitude: -36.8535, longitude: 174.7664 }}
                    title="My Location"
                    description="This is where the action happens!"
                />
            </MapView>

            {/* Show Join Game button 5 minutes before the game starts */}
            {canJoinGame && (
                <View style={styles.joinContainer}>
                    <Text style={styles.countdownText}>
                        Time left to join: {Math.floor(countdown / 60)}m {Math.floor(countdown % 60)}s
                    </Text>
                    <TouchableOpacity style={styles.joinButton} onPress={handleJoinGame}>
                        <Text style={styles.joinButtonText}>Join Game</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Open Panel Button */}
            <TouchableOpacity
                style={styles.openPanelButton}
                onPress={() => (translateY.value = withSpring(height / 2))}
            >
                <Text style={styles.openPanelText}>Open Panel</Text>
            </TouchableOpacity>

            {/* Sliding Panel */}
            <PanGestureHandler onGestureEvent={handleGesture} onEnded={handleGestureEnd}>
                <Animated.View style={[styles.panel, animatedStyle]}>
                    <View style={styles.panelContent}>
                        <Text style={styles.panelTitle}>{`Role: ${role || 'Assigning...'}`}</Text>

                        {role === 'Hider' ? (
                            <Text style={styles.panelDescription}>
                                Hide and avoid being found! Your code:
                                <Text style={styles.codeText}> {code}</Text>
                            </Text>
                        ) : (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Code"
                                    value={inputCode}
                                    onChangeText={setInputCode}
                                    keyboardType="number-pad"
                                />
                                <TouchableOpacity style={styles.submitButton} onPress={handleCodeSubmit}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { ...StyleSheet.absoluteFillObject },
    openPanelButton: {
        position: 'absolute',
        bottom: 100,
        left: '50%',
        transform: [{ translateX: -75 }],
        backgroundColor: '#fc6a26',
        padding: 10,
        width: 150,
        alignItems: 'center',
    },
    openPanelText: { color: '#fff', fontWeight: 'bold' },
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
    panelContent: { alignItems: 'center' },
    panelTitle: { fontSize: 24, fontWeight: 'bold' },
    panelDescription: { fontSize: 18 },
    codeText: { fontWeight: 'bold', color: '#fc6a26' },
    inputContainer: { marginTop: 20, flexDirection: 'row', alignItems: 'center' },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginRight: 20,
        padding: 10,
        width: 150,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#fc6a26',
        padding: 15,
        borderRadius: 20,
    },
    buttonText: { color: '#fff', fontSize: 20 },
    pointsText: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
    joinContainer: {
        position: 'absolute',
        bottom: 100,
        left: '50%',
        transform: [{ translateX: -75 }],
        alignItems: 'center',
    },
    countdownText: {
        color: '#000',
        fontSize: 18,
        marginBottom: 10,
    },
    joinButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 10,
        width: 150,
        alignItems: 'center',
    },
    joinButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
