import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../firebaseConfig.js';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');
    const [totalPoints, setTotalPoints] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    const loadProfile = async () => {
        try {
            const user = auth.currentUser;
            if (user) setEmail(user.email);

            const storedName = await AsyncStorage.getItem('user_name');
            const storedUsername = await AsyncStorage.getItem('user_username');
            const storedBio = await AsyncStorage.getItem('user_bio');
            const storedPoints = await AsyncStorage.getItem('user_points');

            if (storedName) setName(storedName);
            if (storedUsername) setUsername(storedUsername);
            if (storedBio) setBio(storedBio);
            if (storedPoints) setTotalPoints(Number(storedPoints) || 0);
        } catch (error) {
            Alert.alert('Error', 'Failed to load profile.');
            console.error('Error loading profile:', error);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadProfile();
        }, [])
    );

    const saveProfile = async () => {
        try {
            await AsyncStorage.setItem('user_name', name);
            await AsyncStorage.setItem('user_username', username);
            await AsyncStorage.setItem('user_bio', bio);
            await AsyncStorage.setItem('user_points', totalPoints.toString());

            setIsEditing(false);
            Alert.alert('Success', 'Profile updated!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save profile.');
            console.error('Error saving profile:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profile</Text>

            {isEditing ? (
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
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Enter your username"
                        placeholderTextColor="#ccc"
                    />
                    <TextInput
                        style={styles.input}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Enter your bio"
                        placeholderTextColor="#ccc"
                    />
                    <Button title="Save" onPress={saveProfile} />
                </>
            ) : (
                <>
                    <View style={styles.profileBox}>
                        <Text style={styles.profileLabel}>Email: {email}</Text>
                        <Text style={styles.profileLabel}>Name: {name || 'N/A'}</Text>
                        <Text style={styles.profileLabel}>Username: {username || 'N/A'}</Text>
                        <Text style={styles.profileLabel}>Bio: {bio || 'N/A'}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(true)}
                    >
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </>
            )}

            <Text style={styles.walletHeader}>Wallet</Text>
            <View style={styles.walletContainer}>
                <Text style={styles.rewardsHeader}>Total Points: {totalPoints}</Text>
                <Text style={styles.rewardsHeader}>Available Rewards:</Text>
                <View style={styles.rewardItem}>
                    <Text style={styles.rewardText}>50 Points - 10% coupon for Mojo Coffee!</Text>
                </View>
                <View style={styles.rewardItem}>
                    <Text style={styles.rewardText}>150 Points - Free Sub at Subway!</Text>
                </View>
                <View style={styles.rewardItem}>
                    <Text style={styles.rewardText}>500 Points - 2024 Ball Ticket!!</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.redeemButton}
                onPress={() => {}}
            >
                <Text style={styles.redeemButtonText}>Redeem Rewards</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: 20, 
        backgroundColor: '#fc6a26' 
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 20
    },
    input: {
        backgroundColor: '#fff', 
        color: '#333', 
        padding: 10, 
        marginBottom: 16, 
        borderRadius: 8, 
        borderColor: '#ccc', 
        borderWidth: 1
    },
    profileBox: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#000',
        marginBottom: 20
    },
    profileLabel: {
        color: '#ffd13b',
        fontSize: 16,
        marginBottom: 6
    },
    editButton: { 
        marginTop: 10, 
        backgroundColor: '#ffd13b', 
        padding: 10, 
        borderRadius: 5 
    },
    editButtonText: { 
        color: '#000', 
        fontSize: 16, 
        fontWeight: 'bold', 
        textAlign: 'center' 
    },
    walletHeader: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    walletContainer: { 
        marginTop: 10, 
        padding: 15, 
        backgroundColor: '#000', 
        borderRadius: 10,
        borderColor: '#ffd13b',
        borderWidth: 1
    },
    rewardsHeader: { 
        color: '#ffd13b', 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    rewardItem: { 
        padding: 10, 
        backgroundColor: '#ffd13b', 
        borderRadius: 5, 
        marginVertical: 5 
    },
    rewardText: { 
        fontSize: 14, 
        color: '#333' 
    },
    redeemButton: { 
        marginTop: 20, 
        backgroundColor: '#ffd13b', 
        padding: 10, 
        borderRadius: 5 
    },
    redeemButtonText: { 
        color: '#000', 
        fontSize: 16, 
        fontWeight: 'bold', 
        textAlign: 'center' 
    },
});

export default ProfileScreen;
