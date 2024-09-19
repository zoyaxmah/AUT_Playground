import React, {useState} from 'react';
import { View, 
    StyleSheet,
    TouchableOpacity, 
    Text,
    TextInput,
    Image,
    Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function WelcomeScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); 

    // Function to get stored credentials
    const getStoredCredentials = async () => {
        try {
            const storedEmail = await AsyncStorage.getItem('userEmail');
            const storedPassword = await AsyncStorage.getItem('userPassword');
            return { storedEmail, storedPassword };
        } catch (error) {
            setErrorMessage('Error retrieving stored credentials.');
        }
        return null;
    };

    const handleLogin = async () => {
        // Clear any previous error message
        setErrorMessage('');

        // Check if both fields are filled
        if (!username || !password) {
            setErrorMessage('Please enter both email and password.');
            return;
        }
        console.log("Login button pressed");
        const credentials = await getStoredCredentials();

        if (!credentials) {
            setErrorMessage('No stored credentials found.');
            return;
        }

        const { storedEmail, storedPassword } = credentials;
        console.log("Entered Password:", password);

        if (username === storedEmail && password === storedPassword) {
            console.log('Logged in successfully!');
            navigation.navigate('Home');
        } else {
            setErrorMessage('Invalid email or password.');
        }
        
    };

    return (
        
        <View style={styles.background}>
            <Image
                source={require('../PlaygroundLogo.png')}
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