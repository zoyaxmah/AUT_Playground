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
const socket = io('http://127.0.0.1.x.x:3000'); // Replace with your IP

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
    const [role, setRole] = useState(''); // Store the player's role
    const [players, setPlayers] = useState([]); // Track connected players
    const [code, setCode] = useState(''); // Store the Hider's code
    const [inputCode, setInputCode] = useState(''); // Store Hunter's input
    const [points, setPoints] = useState(0); // Track Hunter's points

    const translateY = useSharedValue(height); // Start the panel off-screen

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    // Assign roles and generate code when a player connects
    useEffect(() => {
        console.log('Waiting for player to join...');

        socket.on('player-joined', (newPlayer) => {
            console.log('New Player Joined:', newPlayer);
            Alert.alert('New Player', `${newPlayer.name} joined!`);

            setPlayers((prevPlayers) => {
                const updatedPlayers = [...prevPlayers, newPlayer];
                console.log('Updated Players:', updatedPlayers);

                // Assign the role based on the number of players
                const newRole = updatedPlayers.length === 1 ? 'Hider' : 'Hunter';
                console.log(`Assigned Role: ${newRole}`);

                setRole(newRole); // Update the role state

                // Generate a code for the Hider
                if (newRole === 'Hider') {
                    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
                    setCode(generatedCode); // Store the generated code
                    socket.emit('set-code', generatedCode); // Send code to backend
                    Alert.alert('Your Code', `Share this code with the Hunters: ${generatedCode}`);
                }

                return updatedPlayers; // Return the updated players array
            });
        });

        // Cleanup to prevent multiple event listeners
        return () => {
            console.log('Cleaning up socket listeners...');
            socket.off('player-joined');
        };
    }, []);

    const handleGesture = (event) => {
        const newY = event.nativeEvent.translationY + translateY.value;
        translateY.value = Math.min(newY, height); // Ensure it doesn’t go above the screen
    };

    const handleGestureEnd = () => {
        if (translateY.value > height / 2) {
            translateY.value = withSpring(height); // Snap back down
        } else {
            translateY.value = withSpring(height / 2); // Snap to halfway
        }
    };

    // Submit the input code and synchronize with the backend
    const handleCodeSubmit = () => {
        socket.emit('submit-code', { playerName: 'Hunter1', submittedCode: inputCode });
        setInputCode(''); // Clear the input field
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

            {/* Open Panel Button */}
            <TouchableOpacity
                style={styles.openPanelButton}
                onPress={() => (translateY.value = withSpring(height / 2))}
            >
                <Text style={styles.openPanelText}>Open Panel</Text>
            </TouchableOpacity>

            {/* Custom Sliding Panel */}
            <PanGestureHandler onGestureEvent={handleGesture} onEnded={handleGestureEnd}>
                <Animated.View style={[styles.panel, animatedStyle]}>
                    <View style={styles.panelContent}>
                        <Text style={styles.panelTitle}>{`Role: ${role || 'Assigning...'}`}</Text>

                        {/* Task Description */}
                        {role === 'Hider' ? (
                            <Text style={styles.panelDescription}>
                                Hide! Try not to let anyone find you within the play area.
                                {'\n\n'}
                                Here is your 4-digit code for the Hunters if you are found:
                                <Text style={styles.codeText}> {code}</Text>
                            </Text>
                        ) : (
                            <Text style={styles.panelDescription}>
                                Your task: Find the Hider and enter the code to win!
                            </Text>
                        )}

                        {/* Hunter's Code Input */}
                        {role === 'Hunter' && (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Code"
                                    value={inputCode}
                                    onChangeText={setInputCode}
                                    keyboardType="number-pad"
                                    maxLength={4}
                                />
                                <TouchableOpacity style={styles.submitButton} onPress={handleCodeSubmit}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                                <Text style={styles.pointsText}>Points: {points}</Text>
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
    panelContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    panelTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    panelDescription: { fontSize: 18, color: '#333', textAlign: 'center' },
    codeText: { fontWeight: 'bold', color: '#fc6a26' },
    inputContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginRight: 10,
        padding: 5,
        width: 100,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#fc6a26',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: { color: '#fff' },
    pointsText: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
});
