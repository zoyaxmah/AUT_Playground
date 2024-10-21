import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Image, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { auth, db } from '../../firebaseConfig.js'; // Import Firebase auth and Firestore
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase auth function
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'; // Firestore for querying and adding data

function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState(''); // New name state
    const [username, setUsername] = useState(''); // New username state

    const handleSignUp = async () => {
        if (!email || !password || !confirmPassword || !name || !username) {
            Alert.alert('Error', 'All fields are required.');
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
        } else if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long.');
        } else if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match!');
        } else {
            try {
                // Step 1: Check if the username already exists in Firestore
                const usernamesCollection = collection(db, 'usernames');
                const q = query(usernamesCollection, where('username', '==', username));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Username already exists, alert the user
                    Alert.alert('Error', 'Username already taken. Please choose another one.');
                    return;
                }

                // Step 2: If the username is unique, proceed with sign-up
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Step 3: Store email, name, and username locally in AsyncStorage
                await AsyncStorage.setItem('user_email', email);
                await AsyncStorage.setItem('user_name', name);
                await AsyncStorage.setItem('user_username', username);

                // Step 4: Add the username to Firestore to prevent future duplicates
                await addDoc(usernamesCollection, { username });

                console.log('Account created successfully!');
                Alert.alert('Success', 'Account created successfully!');

                navigation.navigate('Welcome');
            } catch (error) {
                Alert.alert('Error', error.message);
                console.error('Sign-up error:', error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/PlaygroundLogo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>Create an Account</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={text => setName(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={text => setUsername(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Create Password"
                secureTextEntry={true}
                value={password}
                onChangeText={text => setPassword(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
            />

            <Button
                title="Sign Up"
                onPress={handleSignUp}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fc6a26",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '80%',
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
});

export default SignUpScreen;
