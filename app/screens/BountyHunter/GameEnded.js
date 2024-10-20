import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GameEnded() {
    return (
        <View style={styles.container}>
            <Text style={styles.endText}>Game Ended {'\n'}Thank you for playing!</Text>
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
    endText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
