import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Image, Button, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase auth function
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage for local storage
import { auth } from '../../firebaseConfig.js'; // Firebase auth instance

function WelcomeScreen({ navigation }) {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        setErrorMessage('');

        if (!usernameOrEmail || !password) {
            setErrorMessage('Please enter both username/email and password.');
            return;
        }

        try {
            let email = usernameOrEmail;

            // Check if it's a username, and get the associated email
            if (!usernameOrEmail.includes('@')) {
                const storedEmail = await AsyncStorage.getItem('user_email');
                const storedUsername = await AsyncStorage.getItem('user_username');
                if (storedUsername === usernameOrEmail) {
                    email = storedEmail;
                } else {
                    throw new Error('Username not found');
                }
            }

            await signInWithEmailAndPassword(auth, email, password);
            console.log('Logged in successfully!');

            navigation.navigate('TabNavigate');
        } catch (error) {
            setErrorMessage('Invalid username/email or password.');
            console.error('Login error:', error.message);
        }
    };

    return (
        <View style={styles.background}>
            <Image
                source={require('../../assets/PlaygroundLogo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Username or Email"
                    value={usernameOrEmail}
                    onChangeText={text => setUsernameOrEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
            </View>

            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <Button title="Login" onPress={handleLogin} />

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

const styles = StyleSheet.create({
    background: { flex: 1, backgroundColor: "#fc6a26", justifyContent: 'center', alignItems: 'center' },
    inputContainer: { width: 250, marginBottom: 20, paddingHorizontal: 20 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginBottom: 10, paddingHorizontal: 10, backgroundColor: 'white' },
    logo: { width: 120, height: 80, marginBottom: 20 },
    signupContainer: { marginTop: 20, alignItems: 'center' },
    signupText: { fontSize: 14, color: '#fff' },
    signupLink: { color: '#000000', fontWeight: 'bold' },
    errorText: { color: 'red', marginBottom: 10 },
});

export default WelcomeScreen;
