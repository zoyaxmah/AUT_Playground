import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { io } from 'socket.io-client';

const { height } = Dimensions.get('window');
const socket = io('http://192.168.1.65:3000'); // Use your machine's local IP address

export default function BountyHunter() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [showSplash, setShowSplash] = useState(true);
    const [eventTime, setEventTime] = useState(null); // State to store fetched event time
    const navigation = useNavigation();

    // Helper function to format time in mm:ss
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // Fetch the event time from the backend
    const fetchEventTime = async () => {
        try {
            const response = await fetch('http://192.168.1.65:3000/event'); // Use correct IP

            if (!response.ok) {
                throw new Error('Failed to fetch event details');
            }

            const eventData = await response.json();

            if (eventData && eventData.startTime) {
                const fetchedEventTime = new Date(eventData.startTime).getTime();
                setEventTime(fetchedEventTime); // Set event time
            } else {
                throw new Error('Invalid event data');
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to fetch event details.');
            console.error('Error fetching event:', error);
        }
    };


    useEffect(() => {
        fetchEventTime(); // Fetch event time on component mount
    }, []);

    useEffect(() => {
        if (!eventTime) return; // Only run if eventTime is set

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const timeDiff = eventTime - now;

            if (timeDiff <= 0) {
                clearInterval(interval);
                setShowSplash(false);
                navigation.replace('BountyHunter2', { eventTime }); // Navigate directly to BountyHunter2
            } else {
                setTimeLeft(Math.ceil(timeDiff / 1000)); // Update countdown every second
            }
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [eventTime]); // Depend on eventTime to start the countdown

    if (!eventTime) {
        // If eventTime hasn't been fetched yet, show a loading indicator
        return (
            <View style={styles.splashContainer}>
                <Text style={styles.countdownText}>Loading event...</Text>
            </View>
        );
    }

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

    return null; // No content after splash; navigates to BountyHunter2
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
