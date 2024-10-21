import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

function ProfileScreen() {
    // Mock user data
    const [email] = useState('shreyas@example.com');  // User's email
    const [name, setName] = useState('Shreyas');
    const [bio, setBio] = useState('Loves gaming and coding.');

    const [isEditing, setIsEditing] = useState(false);  // Editing state

    // Toggle editing mode
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    // Mock rewards data
    const rewards = [
        { id: 1, title: '10% Off your next coffee!', cost: 25 },
        { id: 2, title: 'Free Sushi!', cost: 100 },
        { id: 3, title: 'Ball 2024 Ticket!!!', cost: 250 }
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            
            {/* Profile Heading */}
            <Text style={styles.sectionHeading}>Profile</Text>

            {/* User Profile Details */}
            <View style={styles.profileBox}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.info}>{email}</Text>

                <Text style={styles.label}>Name:</Text>
                {isEditing ? (
                    <TextInput 
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                ) : (
                    <Text style={styles.info}>{name}</Text>
                )}

                <Text style={styles.label}>Bio:</Text>
                {isEditing ? (
                    <TextInput 
                        style={styles.input}
                        value={bio}
                        onChangeText={setBio}
                    />
                ) : (
                    <Text style={styles.info}>{bio}</Text>
                )}

                {/* Edit button */}
                <TouchableOpacity style={styles.editButton} onPress={handleEditToggle}>
                    <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
                </TouchableOpacity>
            </View>

            {/* Rewards Heading */}
            <Text style={styles.sectionHeading}>Rewards</Text>

            {/* Rewards Available */}
            <View style={styles.rewardsBox}>
                {rewards.map(reward => (
                    <View key={reward.id} style={styles.rewardItem}>
                        <Text style={styles.rewardText}>{reward.title}</Text>
                        <Text style={styles.rewardCost}>{reward.cost} Tokens</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 50,
        paddingTop: 70,
        flexGrow: 1,
        backgroundColor: '#fc6a26',  // Same as the light mode of other pages
    },
    sectionHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',  // Black heading color
        marginBottom: 10,
    },
    profileBox: {
        backgroundColor: '#000',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        elevation: 3,  // For shadow on Android
        shadowColor: '#000',  // For shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#ffd13b',
    },
    info: {
        fontSize: 16,
        marginBottom: 15,
        color: '#fff',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 15,
        fontSize: 16,
        paddingBottom: 5,
    },
    editButton: {
        backgroundColor: '#ffd13b',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    rewardsBox: {
        backgroundColor: '#000',
        borderRadius: 15,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    rewardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    rewardText: {
        fontSize: 16,
        color: '#fff',
    },
    rewardCost: {
        fontSize: 16,
        color: '#FFA500',
    },
});

export default ProfileScreen;


