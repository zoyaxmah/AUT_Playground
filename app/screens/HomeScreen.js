import REact, {useState} from 'react';
import { View, 
    StyleSheet,
    TouchableOpacity,
    Text,
    TextInput,
    Image,
    Button,
} from 'react-native';

function Homescreen({ Navigation}) {
    const [isDarkMode, setIsDarkMode] = useState(false);  // State to manage theme

    // Function to toggle between light and dark mode
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <View style={isDarkMode ? styles.darkBackground : styles.lightBackground}>
            <View style={styles.bottomPanel}>
                <Image
                    source={require('../PlaygroundLogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            
            {/* Button to toggle theme */}
            <TouchableOpacity style={styles.button} onPress={toggleTheme}>
                <Text style={styles.buttonText}>{isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    lightBackground: {
        flex: 1,
        backgroundColor: "#fc6a26",  // Light mode background
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkBackground: {
        flex: 1,
        backgroundColor: "#333",  // Dark mode background
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100, 
        height: 60,
        marginBottom: 1450,
    },
    bottomPanel: {
        height: 70,
        width: '100%',
        backgroundColor: '#ffd13b',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -740,
    },
    button: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: '#ffd13b',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default Homescreen;