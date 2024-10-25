// GameScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { io } from 'socket.io-client';
import { BASE_URL } from '../config/config'; // Use centralized config

const { height } = Dimensions.get('window');
const socket = io(BASE_URL);

export default function GameScreen({ navigation }) {
    const [isGameAvailable, setIsGameAvailable] = useState(false);
    const [eventDetails, setEventDetails] = useState(null);
    const translateY = useSharedValue(height);  // Start the sliding panel off-screen

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    useEffect(() => {
        // Fetch the event details from the backend
        const fetchEvent = async () => {
            try {
                const response = await fetch(`${BASE_URL}/event`);
                if (!response.ok) {
                    throw new Error('Failed to fetch event details');
                }
                const eventData = await response.json();

                // Check if the event is still joinable
                if (eventData.isActive) {
                    setEventDetails(eventData);
                    setIsGameAvailable(true);  // Game is now available
                    console.log(`Fetched latest joinable event: ${eventData.name}`);
                } else {
                    setIsGameAvailable(false);
                    console.log('No available game found');
                }
            } catch (error) {
                console.log('Error fetching event:', error);
            }
        };

        fetchEvent(); // Fetch event on mount

        return () => {
            socket.off('event-available', (ameData) => {
                setEventDetails(gameData);
                setIsGameAvailable(true);
                console.log('Real-time event available: ${gameData.name}');
            });

            return () => {
                socket.off('event available');
            };
        };
    }, []);

    useEffect(() => {
        // Listen for new events being available
        socket.on('event-available', (game) => {
            setEventDetails(game);
            setIsGameAvailable(true);
            console.log(`Game available: ${game.name} ${game.description}`);
        });

        // Listen for events being marked as unavailable
        socket.on('event-unavailable', () => {
            console.log(`Game removed from available list`);
            setIsGameAvailable(false); // Mark as unavailable
        });

        return () => {
            socket.off('event-available');
            socket.off('event-unavailable');
        };
    }, [eventDetails]);

    const handleGesture = (event) => {
        const newY = event.nativeEvent.translationY + translateY.value;
        translateY.value = Math.min(newY, height);  // Ensure it doesn't go above the screen
    };

    const handleGestureEnd = () => {
        if (translateY.value > height / 2) {
            translateY.value = withSpring(height);  // Snap back down
        } else {
            translateY.value = withSpring(height / 2);  // Snap to halfway
        }
    };

    const handleJoinGame = async () => {
        // Retrieve the player's name from AsyncStorage
        console.log(eventDetails.startTime);

        try {
            const storedName = await AsyncStorage.getItem('user_name');
            const playerName = storedName || 'Anonymous'; // Default to 'Anonymous' if no name is found
    
            if (eventDetails && eventDetails.name && eventDetails.startTime) { // Ensure gameName and startTime are valid
                const joinEndTime = new Date(new Date(eventDetails.startTime).getTime()+10*1000).getTime(); // Use 30-minute timer
    
                // Check which game to navigate to
                if (eventDetails.name === 'Bounty Hunter') {
                    navigation.navigate('BountyHunter', { joinEndTime, gameName: eventDetails.name, playerName });
                } else if (eventDetails.name === 'Know Your Campus') {
                    navigation.navigate('KnowYourCampus', { joinEndTime, gameName: eventDetails.name, playerName });
                } else {
                    Alert.alert('Error', 'Unknown game event');
                    console.error('Unknown game name in eventDetails');
                }
            } else {
                Alert.alert('Error', 'No event available');
                console.error('Missing eventDetails or game name');
            }
        } catch (error) {
            console.error('Error retrieving player name or navigating:', error);
            Alert.alert('Error', 'Unable to retrieve player name or navigate to game.');
        }
    };
    


    return (
        <View style={styles.container}>
            {/* Map View */}
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

            {/* Open Game Panel Button */}
            <TouchableOpacity
                style={styles.openPanelButton}
                onPress={() => (translateY.value = withSpring(height / 2))}
            >
                <Text style={styles.openPanelText}>Open Game Panel</Text>
            </TouchableOpacity>

            {/* Sliding Panel for Game Details */}
            <PanGestureHandler onGestureEvent={handleGesture} onEnded={handleGestureEnd}>
                <Animated.View style={[styles.panel, animatedStyle]}>
                    <View style={styles.panelContent}>
                        <View style={styles.textContainer}>
                            <Text style={styles.panelTitle}>Available Games</Text>
                            {isGameAvailable && eventDetails ? (
                                <>
                                    <Text style={styles.panelSubTitle}>{eventDetails.name}</Text>
                                    <Text style={styles.panelDescription}>
                                        {eventDetails.description}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={handleJoinGame}  // Join game
                                    >
                                        <Text style={styles.buttonText}>Join Game</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <Text style={styles.panelDescription}>
                                    No games available yet.
                                </Text>
                            )}
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
    panelContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    textContainer: { flex: 1, marginRight: 10 },
    panelTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    panelSubTitle: { fontSize: 22, fontWeight: 'bold' },
    panelDescription: { fontSize: 13, color: '#333' },
    button: {
        backgroundColor: '#fc6a26',
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
        width: 130,
        marginTop: 45,
        alignSelf: 'flex-end',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        position: 'absolute',
    },
    buttonText: { color: '#fff', fontSize: 16 },
});
