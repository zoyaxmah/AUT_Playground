import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { io } from 'socket.io-client';

const { height } = Dimensions.get('window');
const socket = io('http://localhost:3000'); // Ensure correct backend connection

export default function BountyHunter() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [showSplash, setShowSplash] = useState(true);
    const navigation = useNavigation();

    const eventTime = new Date('2024-10-16T00:25:00+13:00').getTime(); // Replace with your event time

    // Helper function to format time in mm:ss
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const timeDiff = eventTime - now;

            if (timeDiff <= 0) {
                clearInterval(interval);
                setShowSplash(false);
                navigation.replace('BountyHunter2', { eventTime }); // Navigate directly to BHProgress
            } else {
                setTimeLeft(Math.ceil(timeDiff / 1000)); // Update countdown every second
            }
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [eventTime]);

    if (showSplash) {
        return (
            <View style={styles.splashContainer}>
                <Text style={styles.countdownText}>
                    Game starts in: {formatTime(timeLeft)}
                </Text>
                <Text style={styles.instructions}>
                    Find the Hider and scan their QR code to win!
                </Text>
            </View>
        );
    }

    return null; // No content after splash; navigates to BHProgress
}

const styles = StyleSheet.create({
    splashContainer: {
        flex: 1,
        backgroundColor: '#fc6a26',
        justifyContent: 'center',
        alignItems: 'center',
    },
    countdownText: {
        fontSize: 48,
        color: '#fff',
        marginBottom: 20,
    },
    instructions: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginHorizontal: 20,
    },
});
