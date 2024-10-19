import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { io } from 'socket.io-client';
import { BASE_URL } from '../../config/config'; // Use centralized config

const socket = io(BASE_URL);

export default function BountyHunter2({ route, navigation }) {
    // Add a fallback for when gameName and playerName are not passed correctly
    const gameName = route?.params?.gameName;
    const playerName = route?.params?.playerName; // Get player name from the route params

    // State variables
    const [role, setRole] = useState(''); // Player's role: Hider or Hunter
    const [code, setCode] = useState(''); // Hider's generated code (received from the server)
    const [inputCode, setInputCode] = useState(''); // Hunter's entered code
    const [players, setPlayers] = useState([]); // List of connected players
    const [points, setPoints] = useState(0); // Hunter's points

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

    return (
        <View style={styles.container}>
            <Text style={styles.roleText}>Role: {role || 'Assigning...'}</Text>

            {role === 'Hider' ? (
                <Text style={styles.hiderText}>
                    You are the Hider! Share this code with the Hunters: <Text style={styles.codeText}>{code}</Text>
                </Text>
            ) : role === 'Hunter' ? (
                <View style={styles.inputContainer}>
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
            ) : (
                <Text>Waiting for role assignment...</Text>
            )}

            <Text style={styles.pointsText}>Points: {points}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fc6a26',
    },
    roleText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    hiderText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    codeText: {
        fontWeight: 'bold',
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginRight: 20,
        padding: 10,
        width: 150,
        textAlign: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    submitButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    pointsText: {
        marginTop: 30,
        fontSize: 18,
        color: '#fff',
    },
});
