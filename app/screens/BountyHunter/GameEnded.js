import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GameEnded({ route }) {
    const earnedPoints = route?.params?.earnedPoints || 0;

    return (
        <View style={styles.container}>
            <Text style={styles.endText}>
                Game Ended {'\n'}
                Thank you for playing! {'\n\n'}
                You earned: {earnedPoints} points!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fc6a26' },
    endText: { fontSize: 24, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});
