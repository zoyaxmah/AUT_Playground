import React, {useState} from 'react';
import { View, 
    StyleSheet,
    TouchableOpacity, 
    Text,
    TextInput,
    Image,
    Button,
} from 'react-native';

function WelcomeScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
            <TouchableOpacity 
                style={styles.loginButton} 
                title="Login"
                onPress={() => {
                    console.log('Logged in!');
                    navigation.navigate('Home');
                }}
            >
                <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
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
        width: 110,
        height: 40,
        backgroundColor: "#ffd13b",
        position: "absolute",
        bottom: "30%",
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
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
    }
});

export default WelcomeScreen;