import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function KnowYourCampus({ route }) {
    const [timeLeft, setTimeLeft] = useState(60); // Timer set to 1 minute (60 seconds)
    const [joinEndTime, setJoinEndTime] = useState(null);
    const [hasNotifiedThirtySeconds, setHasNotifiedThirtySeconds] = useState(false);
    const [hasNotifiedTenSeconds, setHasNotifiedTenSeconds] = useState(false); // Corrected from "OneMinute" to "TenSeconds"
    const [username, setUsername] = useState(''); // Load the username
    const navigation = useNavigation();
    const { gameName } = route.params; // Retrieve gameName from route params

    // Load the username from AsyncStorage
    useEffect(() => {
        const loadUsername = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('user_username');
                if (storedUsername) {
                    setUsername(storedUsername);
                    console.log('Username loaded:', storedUsername); // Logging for debug
                } else {
                    Alert.alert('Error', 'Username not found. Returning to the main screen.');
                    navigation.goBack();
                }
            } catch (error) {
                console.error('Error loading username:', error);
                Alert.alert('Error', 'Failed to load username.');
            }
        };
        loadUsername();
    }, []);

    // Set the joinEndTime from route params
    useEffect(() => {
        if (route.params && route.params.joinEndTime) {
            const endTime = new Date(route.params.joinEndTime).getTime();
            setJoinEndTime(endTime);
        } else {
            Alert.alert('Error', 'Join end time not found. Please try again.');
        }
    }, [route.params]);

    // Timer and navigation to KnowYourCampus
    useEffect(() => {
        if (!joinEndTime || !username) return; // Wait until joinEndTime and username are set

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const timeDiff = joinEndTime - now;

            if (timeDiff <= 0) {
                clearInterval(interval);
                if (!gameName || !username) {
                    console.error('gameName or username is undefined! Returning to previous screen.');
                    navigation.goBack();
                    return;
                }

                // Pass both gameName and username when navigating to KnowYourCampus2
                console.log('Navigating to KnowYourCampus2 with:', { gameName, username });
                navigation.replace('KnowYourCampus2', { gameName: gameName, playerName: username });
            } else {
                setTimeLeft(Math.ceil(timeDiff / 1000));

                // Trigger notifications based on the current time difference
                if (timeDiff <= 30000 && !hasNotifiedThirtySeconds) {
                    sendNotification('Join Game Now!', '30 seconds left to join the game!');
                    setHasNotifiedThirtySeconds(true);
                }
                if (timeDiff <= 10000 && !hasNotifiedTenSeconds) {
                    sendNotification('Join Game Now!', '10 seconds left to join the game!');
                    setHasNotifiedTenSeconds(true);
                }
            }
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [joinEndTime, username, gameName, hasNotifiedThirtySeconds, hasNotifiedTenSeconds]);

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
                data: { screen: 'Home' },
            },
            trigger: null, // Trigger immediately
        });
    };

    if (!joinEndTime) {
        return (
            <View style={styles.container}>
                <Text style={styles.countdownText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.countdownText}>Game starts in: {formatTime(timeLeft)}</Text>

            <Text style={styles.locationText}>
                Ensure you are in <Text style={styles.boldText}>{'\n'}Hikuwai Plaza</Text> to play the game!
            </Text>

            <View style={styles.instructionsContainer}>
                <Text style={styles.instructionText}>
                    <Text style={styles.boldText}>Instructions:</Text>
                </Text>

                <Text style={styles.instructionText}>
                    Answer the questions about your campus!
                </Text>

                <Text style={styles.instructionText}>
                    Each correct answer gets you 5 points to redeem!
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fc6a26' },
    countdownText: { fontSize: 35, color: '#fff', fontWeight: 'bold' },
    locationText: { fontSize: 18, color: '#fff', marginTop: 10, textAlign: 'center' },
    boldText: { fontWeight: 'bold' },
    instructionsContainer: { marginTop: 20, paddingHorizontal: 20 },
    instructionText: { fontSize: 18, color: '#fff', marginBottom: 10, textAlign: 'center' },
});
