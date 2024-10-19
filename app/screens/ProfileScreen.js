import React, { useState, useEffect } from 'react'; // Import React hooks
import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    TextInput,
    Button,
    StyleSheet
} from 'react-native'; // Import React Native components
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for local storage
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

const auth = getAuth(); // Initialize Firebase Authentication

const ProfileScreen = () => {
    // State variables for profile information
    const [name, setName] = useState(''); // Stores user's name
    const [bio, setBio] = useState(''); // Stores user's bio
    const [email, setEmail] = useState(''); // Stores user's email from Firebase
    const [tokens, setTokens] = useState(0); // Stores user's tokens
    const [isEditing, setIsEditing] = useState(false); // Tracks if the user is in edit mode

    // useEffect to load profile data on component mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                // Fetch the currently logged-in user from Firebase Auth
                const user = auth.currentUser;
                if (user) setEmail(user.email); // Set email from Firebase if available

                // Retrieve stored profile data from AsyncStorage
                const storedName = await AsyncStorage.getItem('user_name');
                const storedBio = await AsyncStorage.getItem('user_bio');
                const storedTokens = await AsyncStorage.getItem('user_tokens');

                // Set state variables with retrieved data, if available
                if (storedName) setName(storedName);
                if (storedBio) setBio(storedBio);
                if (storedTokens) setTokens(parseInt(storedTokens) || 0);
            } catch (error) {
                Alert.alert('Error', 'Failed to load profile.'); // Error handling
                console.error('Error loading profile:', error);
            }
        };

        loadProfile(); // Load profile data when the component mounts
    }, []); // Empty dependency array ensures this runs only once

    // Function to save profile changes to AsyncStorage
    const saveProfile = async () => {
        try {
            // Save name, bio, and tokens to AsyncStorage
            await AsyncStorage.setItem('user_name', name);
            await AsyncStorage.setItem('user_bio', bio);
            await AsyncStorage.setItem('user_tokens', tokens.toString());

            setIsEditing(false); // Exit edit mode
            Alert.alert('Success', 'Profile updated!'); // Success alert
        } catch (error) {
            Alert.alert('Error', 'Failed to save profile.'); // Error handling
            console.error('Error saving profile:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Display Email */}
            <Text style={styles.label}>Email: {email}</Text>

            {isEditing ? (
                // Edit Mode: Show input fields for name and bio with a Save button
                <>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        placeholderTextColor="#ccc"
                    />
                    <TextInput
                        style={styles.input}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Enter a short bio"
                        placeholderTextColor="#ccc"
                    />
                    <Button title="Save" onPress={saveProfile} />
                </>
            ) : (
                // View Mode: Display name and bio with an Edit button
                <>
                    <Text style={styles.label}>Name: {name || 'N/A'}</Text>
                    <Text style={styles.label}>Bio: {bio || 'N/A'}</Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(true)}
                    >
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Wallet System */}
            <View style={styles.walletContainer}>
                <Text style={styles.label}>Tokens: {tokens}</Text>
                <Text style={styles.rewardsHeader}>Available Rewards:</Text>
                <View style={styles.rewardItem}>
                    <Text style={styles.rewardText}>10 Tokens - Unlock Exclusive Avatar</Text>
                </View>
                <View style={styles.rewardItem}>
                    <Text style={styles.rewardText}>20 Tokens - Get 5 Extra Lives</Text>
                </View>
                <View style={styles.rewardItem}>
                    <Text style={styles.rewardText}>50 Tokens - VIP Status for a Week</Text>
                </View>
            </View>
        </View>
    );
};

// Styles for the ProfileScreen components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fc6a26', // Background color
    },
    label: {
        color: 'white', // White text color
        fontSize: 18, // Font size for labels
        marginBottom: 8, // Spacing between labels
    },
    input: {
        backgroundColor: '#1f1f1f', // Dark input background
        color: 'white', // White input text
        padding: 10, // Padding inside the input
        marginBottom: 16, // Spacing between inputs
        borderRadius: 5, // Rounded corners
        borderColor: '#555', // Border color
        borderWidth: 1, // Border width
    },
    editButton: {
        marginTop: 10, // Space above the button
        backgroundColor: '#ffd13b', // Button background color
        padding: 10, // Padding inside the button
        borderRadius: 5, // Rounded corners
    },
    editButtonText: {
        color: '#000', // Button text color
        fontSize: 16, // Font size for button text
        fontWeight: 'bold', // Bold text
        textAlign: 'center', // Center align text
    },
    walletContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#fff', // White background for wallet
        borderRadius: 10,
    },
    rewardsHeader: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    rewardItem: {
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginVertical: 5,
    },
    rewardText: {
        fontSize: 14,
        color: '#333',
    },
});

export default ProfileScreen;

