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
            <Text style={styles.label}>Email: {email}</Text>

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
                    <Text style={styles.label}>Name: {name || 'N/A'}</Text>
                    <Text style={styles.label}>Username: {username || 'N/A'}</Text>
                    <Text style={styles.label}>Bio: {bio || 'N/A'}</Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(true)}
                    >
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </>
            )}

            <View style={styles.walletContainer}>
                <Text style={styles.rewardsHeader}>Total Points: {totalPoints}</Text>
                <Text style={styles.rewardsHeader}>Available Rewards:</Text>
                <View style={styles.rewardItem}>
                    <Text style={styles.rewardText}>100 Points - Unlock Exclusive Avatar</Text>
                </View>
                <View style={styles.rewardItem}>
                    <Text style={styles.rewardText}>200 Points - Get 5 Extra Lives</Text>
                </View>
                <View style={styles.rewardItem}>
                    <Text style={styles.rewardText}>500 Points - VIP Status for a Week</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fc6a26' },
    label: { color: 'white', fontSize: 18, marginBottom: 8 },
    input: {
        backgroundColor: '#1f1f1f', color: 'white', padding: 10, marginBottom: 16, borderRadius: 5, borderColor: '#555', borderWidth: 1,
    },
    editButton: { marginTop: 10, backgroundColor: '#ffd13b', padding: 10, borderRadius: 5 },
    editButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    walletContainer: { marginTop: 20, padding: 15, backgroundColor: '#fff', borderRadius: 10 },
    rewardsHeader: { color: '#333', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    rewardItem: { padding: 10, backgroundColor: '#e0e0e0', borderRadius: 5, marginVertical: 5 },
    rewardText: { fontSize: 14, color: '#333' },
});

export default ProfileScreen;
