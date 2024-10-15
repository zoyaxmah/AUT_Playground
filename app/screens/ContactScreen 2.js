import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

function ContactScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Contact Us</Text>
            <Text style={styles.message}>
                For any inquiries, issues, or feedback, please feel free to contact us at the email address below.
                Our team will aim to respond within 2-5 business days, although in many cases, we are able to respond
                sooner. We value your input and look forward to assisting you with any concerns or questions you may have.
            </Text>
            <Text style={styles.email}>qpg1900@autuni.ac.nz</Text>
            {/* "Back Home" Button */}
            <Button
                title="Back Home"
                onPress={() => navigation.navigate('Home')} // Navigates back to the Home screen
                color="orange" // Button text color
            />
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'white',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: 'white',
    },
    email: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: 'white',
    },
});

export default ContactScreen;