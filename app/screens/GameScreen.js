import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, ScrollView } from 'react-native';

function GameScreen() {
    const [timeLeft, setTimeLeft] = useState(80); // 80 seconds for demo
    const [alertShown, setAlertShown] = useState(false); // Track if alert has been shown

    useEffect(() => {
        // Start the timer
        const intervalId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (timeLeft === 60 && !alertShown) {
            // Show alert when there is 1 minute left
            Alert.alert('Time Alert', '1 minute left!');
            setAlertShown(true); // Ensure alert only shows once
        }

        if (timeLeft <= 0) {
            // Clear interval when time reaches 0
            setTimeLeft(0); // To prevent negative time
        }
    }, [timeLeft, alertShown]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
                <View style={styles.bottomPanel} />
                <Text style={styles.gameTitle}>
                    Mix and Match
                </Text>
                <Text style={styles.instructionsBody}>
                    You will be assigned a random team{'\n'}
                    shape that consists of the other players.{'\n'}
                    For your team to win you must be{'\n'}
                    the first to complete your team!{'\n'}
                    Good luck, everyone!
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "#fc6a26",
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%', // Ensures full height scroll
    },
    timer: {
        fontSize: 48,
        color: '#fff',
        position: 'absolute',
        top: '15%',
    },
    gameTitle: {
        position: 'absolute',
        color: "#fff",
        top: '30%',
        fontSize: 30,
    },
    instructionsBody:{
        textAlign: 'center',
        position: 'absolute',
        color: '#fff',
        top: '40%',
        fontSize: 20,
    },
    bottomPanel: {
        height: 58,
        width: '100%',
        backgroundColor: '#ffd13b',
        position: 'absolute',
        bottom: 0,
    },
});

export default GameScreen;