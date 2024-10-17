import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';

function Homescreen({ navigation }) {
    const [isDarkMode, setIsDarkMode] = useState(false);  // State to manage theme

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <View style={isDarkMode ? styles.darkBackground : styles.lightBackground}>
            <Image
                source={require('../../assets/PlaygroundLogo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
                <Text style={styles.themeButtonText}>
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    lightBackground: {
        flex: 1,
        backgroundColor: "#fc6a26",
    },
    darkBackground: {
        flex: 1,
        backgroundColor: "#333",  // Dark mode background
    },
    logo: {
        width: 100, 
        height: 60,
        position: 'absolute',
        top: '5%',
        left: '38%',
    },
    themeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: '#ffd13b',
        padding: 10,
        borderRadius: 5,
    },
    themeButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Homescreen;
