import React, {useState} from 'react';
import { View, 
    StyleSheet,
    TouchableOpacity, 
    Text,
    TextInput,
    Image,
    Button,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';

function WelcomeScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); 

    
    const handleLogin = async () => {
        setErrorMessage('');

        if (!username || !password) {
            setErrorMessage('Please enter both email and password.');
            eturn;
        }

        try {
            // Firebase Authentication with email and password using modular import
            await signInWithEmailAndPassword(auth, username, password);
            console.log('Logged in successfully!');
            navigation.navigate('Home');
        } catch (error) {
            setErrorMessage('Invalid email or password.');
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
                    placeholder="Username"
                    value={username}
                    onChangeText={text => setUsername(text)}
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

            <Button 
                style={styles.loginButton}
                title="Login"
                onPress={handleLogin}
            />
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
    background:{
        flex: 1,
        backgroundColor: "#fc6a26",
        justifyContent:'center',
        alignItems: 'center',
    },
    loginButton: {
        width: 150,
        height: 50,
        backgroundColor: "#faaf52",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#d95e00',
        fontSize: 18,
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
    loginButton: {
        height: 20,
        width: 100,
        backgroundColor: 'orange',
    
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
        color: 'red',  // Set the color for error messages
        marginBottom: 10,
    }
});

export default WelcomeScreen;