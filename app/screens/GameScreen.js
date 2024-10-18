import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { io } from 'socket.io-client';

const { height } = Dimensions.get('window');
const socket = io('http://172.29.46.86:3000'); // Use your machine's local IP address

const GameScreen = ({ navigation }) => {
    const [isGameAvailable, setIsGameAvailable] = useState(false);
    const [eventDetails, setEventDetails] = useState(null);
    const translateY = useSharedValue(height); // Start panel off-screen

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    useEffect(() => {
        // Listen for event availability
        socket.on('event-available', (event) => {
            console.log('Event received:', event);
            setEventDetails(event);
            setIsGameAvailable(true); // Show the game when available
        });

        return () => {
            socket.off('event-available'); // Cleanup on unmount
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

    const handleJoinGame = () => {
        navigation.navigate('BountyHunter', { eventDetails });
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
                    description="Here is where the action happens!"
                />
            </MapView>

            {/* Open Game Panel Button */}
            <TouchableOpacity
                style={styles.openPanelButton}
                onPress={() => (translateY.value = withSpring(height / 2))}
            >
                <Text style={styles.openPanelText}>Open Game Panel</Text>
            </TouchableOpacity>

            {/* Custom Sliding Panel */}
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
                                        onPress={handleJoinGame} // Join game
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
};

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

export default GameScreen;
