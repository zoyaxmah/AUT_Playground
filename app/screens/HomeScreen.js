import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

function HomeScreen({ navigation }) {
    return (
        <View style={styles.background}>
            <View style={styles.bottomPanel}>
                <Image
                    source={require('../PlaygroundLogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Contact Button at the bottom */}
            <TouchableOpacity
                style={styles.contactButton}
                onPress={() => navigation.navigate('Contact')}
            >
                <Text style={styles.buttonText}>Contact Us</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#fc6a26",
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 60,
        marginBottom: 1450, // Keep the existing layout unchanged
    },
    bottomPanel: {
        height: 70,
        width: '100%',
        backgroundColor: '#ffd13b',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -740, // Keep the existing layout unchanged
    },
    contactButton: {
        position: 'absolute',
        bottom: 20, // Place it near the bottom of the screen
        alignItems: 'right',
        backgroundColor: '#faaf52',
        padding: 15,
        borderRadius: 5,
        width: '20%',
    },
    buttonText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default HomeScreen;
