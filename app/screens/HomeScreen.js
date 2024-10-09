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
            <Image
                source={require('../../assets/HomeButton.png')}
                style={styles.homeButton}
                resizeMode="contain"
            />
            <TouchableOpacity
                onPress={() => {
                    console.log('game time!');
                    navigation.navigate('Game');
                }}
                style={[styles.touchableOpacity_gameButton, { padding: 10 }]}
            >
                <Image 
                    source={require('../../assets/GameButton.png')}
                    style={styles.gameButton}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    console.log('she need some milk!');
                    navigation.navigate('Contact');
                }}
                style={[styles.touchableOpacity_contactButton, { padding: 10 }]}
            >
                <Image 
                    source={require('../../assets/ContactButton.png')}
                    style={styles.contactButton}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
                <Text style={styles.themeButtonText}>
                    {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                </Text>
            </TouchableOpacity>

            <View style={styles.bottomPanel} />
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
    touchableOpacity_gameButton: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        zIndex: 2,
        backgroundColor: 'transparent',
    },
    touchableOpacity_contactButton: {
        position: 'absolute',
        bottom: 0,
        right: 40,
        zIndex: 2,
        backgroundColor: 'transparent',
    },
    logo: {
        width: 100, 
        height: 60,
        position: 'absolute',
        top: '5%',
        left: '38%',
    },
    homeButton: {
        width: 30,
        height: 30,
        position: 'absolute',
        bottom: 15,
        left: '47%',
        zIndex: 1,
    },
    gameButton: {
        width: 30,
        height: 30,
    },
    contactButton: {
        width: 30,
        height: 30,
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
    bottomPanel: {
        height: 58,
        width: '100%',
        backgroundColor: '#ffd13b',
        position: 'absolute',
        bottom: 0,
        zIndex: 0,
    },
});

export default Homescreen;