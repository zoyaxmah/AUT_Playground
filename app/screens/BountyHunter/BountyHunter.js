import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications'; // Import notifications
import { io } from 'socket.io-client';
import { BASE_URL } from '../../config/config'; // Use centralized config

const socket = io(BASE_URL);

export default function BountyHunter({ route }) {
    const [timeLeft, setTimeLeft] = useState(300); // Default to 5 minutes (300 seconds)
    const [joinEndTime, setJoinEndTime] = useState(null);
    const [hasNotifiedTwoMinutes, setHasNotifiedTwoMinutes] = useState(false); // Track 2-minute notification
    const [hasNotifiedOneMinute, setHasNotifiedOneMinute] = useState(false); // Track 1-minute notification
    const navigation = useNavigation();

    const { playerName, gameName } = route.params; // Retrieve gameName and playerName from route params

    useEffect(() => {
        // Ensure joinEndTime is passed through route params
        if (route.params && route.params.joinEndTime) {
            const endTime = new Date(route.params.joinEndTime).getTime();
            setJoinEndTime(endTime);
        } else {
            Alert.alert('Error', 'Join end time not found. Please try again.');
        }
    }, [route.params]);

    useEffect(() => {
        if (!joinEndTime) return; // Wait until joinEndTime is set

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const timeDiff = joinEndTime - now;

            if (timeDiff <= 0) {
                clearInterval(interval);
                // Pass both gameName and playerName when navigating to BountyHunter2
                navigation.replace('BountyHunter2', { gameName: gameName, playerName: playerName });
            } else {
                setTimeLeft(Math.ceil(timeDiff / 1000)); // Update the countdown in seconds

                // Trigger notifications based on countdown
                if (timeLeft <= 120 && !hasNotifiedTwoMinutes) {
                    sendNotification('Join Game Now!', '2 minutes left to join the game!');
                    setHasNotifiedTwoMinutes(true); // Mark 2-minute notification as sent
                }

                if (timeLeft <= 60 && !hasNotifiedOneMinute) {
                    sendNotification('Join Game Now!', '1 minute left to join the game!');
                    setHasNotifiedOneMinute(true); // Mark 1-minute notification as sent
                }
            }
        }, 1000);

        return () => clearInterval(interval); // Cleanup the interval on unmount
    }, [joinEndTime, timeLeft]);

    // Helper function to format time in mm:ss
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // Function to trigger notification
    const sendNotification = async (title, body) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data: { screen: 'Home' }, // Customize based on your app navigation
            },
            trigger: null, // Trigger immediately
        });
    };

    if (!joinEndTime) {
        // If joinEndTime hasn't been set, show a loading indicator
        return (
            <View style={styles.container}>
                <Text style={styles.countdownText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.countdownText}>Game starts in: {formatTime(timeLeft)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fc6a26', fontWeight: 'bold' },
    countdownText: { fontSize: 35, color: '#fff', fontWeight: 'bold' },
});
