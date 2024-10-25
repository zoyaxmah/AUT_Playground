import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GameEnded2({ route }) {
    const correctAnswers = route?.params?.correctAnswers || 0;
    const pointTot = correctAnswers * 5; // Multiply by 5 for total points

    return (
        <View style={styles.container}>
            <Text style={styles.endText}>
                Game Ended {'\n'}
                Thank you for playing! {'\n\n'}
                You earned: {pointTot} points!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fc6a26' },
    endText: { fontSize: 24, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});
