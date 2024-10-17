import React, { useState } from 'react';
import { View, 
    StyleSheet, 
    TextInput, 
    Button,
    Image, 
    Text, 
    Alert 
} from 'react-native';
import { 
    getAuth, 
    createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';

function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'All fields are required.');
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
        } else if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long.');
        } else if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match!');
        } else {
            try {
                // Firebase Authentication to create a new user with modular import
                await createUserWithEmailAndPassword(auth, email, password);
                console.log('Account created successfully!');
                Alert.alert('Success', 'Account created successfully! Please log in.');
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