import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function ContactScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Contact Us</Text>
            
            {/* Box containing the description and email */}
            <View style={styles.box}>
                <Text style={styles.message}>
                    For any inquiries, issues, or feedback, please feel free to contact us at the email address below.
                    Our team will aim to respond within 2-5 business days, although in many cases, we are able to respond
                    sooner. We value your input and look forward to assisting you with any concerns or questions you may have.
                </Text>
                <Text style={styles.email}>qpg1900@autuni.ac.nz</Text>
            </View>

            {/* "Back Home" Button - customized */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Home')} // Navigates back to the Home screen
            >
                <Text style={styles.buttonText}>Back Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fc6a26',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'black',
    },
    box: {
        backgroundColor: '#000',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#fff',
    },
    email: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffd13b',
    },
    button: {
        backgroundColor: '#ffd13b',  
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',  
    },
    buttonText: {
        color: '#000',  
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ContactScreen;
