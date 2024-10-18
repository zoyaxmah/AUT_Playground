import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    TextInput,
    Image,
    Button,
    Alert
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase auth function
import { auth } from '../../firebaseConfig.js'; // Firebase auth instance

function WelcomeScreen({ navigation }) {
    // State variables to manage user inputs, errors, and stored Gamer ID
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Function to handle user login
    const handleLogin = async () => {
        // Reset error message at the start
        setErrorMessage('');

        // Validate if both username and password are entered
        if (!username || !password) {
            setErrorMessage('Please enter both email and password.');
            return;
        }

        try {
            // Firebase Authentication with email and password
            await signInWithEmailAndPassword(auth, username, password);
            console.log('Logged in successfully!');


            // Navigate to the main app (Tab Navigation) on successful login
            navigation.navigate('TabNavigate');
        } catch (error) {
            // Set error message for invalid login
            setErrorMessage('Invalid email or password.');
            console.error('Login error:', error.message);
        }
    };

    return (
        <View style={styles.background}>
            {/* App Logo */}
            <Image
                source={require('../../assets/PlaygroundLogo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* User Input Fields */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={username}
                    onChangeText={text => setUsername(text)}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
            </View>

            {/* Error Message Display */}
            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            {/* Login Button */}
            <Button
                title="Login"
                onPress={handleLogin}
            />

            {/* Signup Link */}
            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>
                    Don't have an account?{' '}
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.signupLink}>Sign Up!</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        </View>
    );
}

// Styles for the Welcome Screen components
const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#fc6a26",
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: 250,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    logo: {
        width: 120,
        height: 80,
        marginBottom: 20,
    },
    signupContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    signupText: {
        fontSize: 14,
        color: '#fff',
    },
    signupLink: {
        color: '#000000',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default WelcomeScreen;
