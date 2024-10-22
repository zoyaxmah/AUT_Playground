import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Import an icon library

function Homescreen({ navigation }) {
    const [isDarkMode, setIsDarkMode] = useState(false);  // State to manage theme
    const [username, setUsername] = useState('');  // State to store username

    

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const upcomingEvents = [
        { id: 2, title: 'Upcoming Bounty Hunter!', date: 'Nov 1, 2024', description: 'Test ur seeking abilities with your peers and win some awards!' },
        { id: 3, title: 'Rock....Paper...And More Assignments?!', date: 'Nov 5, 2024', description: 'Feeling the pressure of the assignments? Take some steam off with the tournament of the sememster!' },
        { id: 4, title: 'Money Crisis?!', description: 'See what coupons and discounts are available this week' },
        { id: 5, title: 'Ball??', description: 'We have partnered with this years Ball, so challenge ur peers to win some tokens to reddem Ball tickets!!'}
    ];

    return (
        <View style={isDarkMode ? styles.darkBackground : styles.lightBackground}>
            <View style={styles.header}>
                {/* Profile Button */}
                <TouchableOpacity 
                    style={styles.profileButton} 
                    onPress={() => navigation.navigate('Profile')}  // Navigate to the Profile tab
                >
                    <Text style={styles.profileButtonText}>Profile</Text>
                </TouchableOpacity>

                {/* Logo */}
                <Image
                    source={require('../../assets/PlaygroundLogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* Dark Mode Button */}
                <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
                    <Text style={styles.themeButtonText}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</Text>
                </TouchableOpacity>
            </View>

            {/* Welcome message with username */}
            <Text style={isDarkMode ? styles.darkWelcomeText : styles.lightWelcomeText}>
                Welcome!
            </Text>

            {/* Scrollable content for the feed */}
            <ScrollView contentContainerStyle={styles.feedContainer}>
                
                {/* "Feeling Bored?" Button */}
                <TouchableOpacity 
                    style={styles.feelingBoredBox} 
                    onPress={() => navigation.navigate('Games')}  // Navigate to the GameScreen
                >
                    <View style={styles.feelingBoredContent}>
                        <Text style={styles.feelingBoredTitle}>Feeling Bored?</Text>
                        <Text style={styles.feelingBoredDescription}>Join a game!</Text>
                    </View>
                    {/* Add an arrow icon */}
                    <Ionicons name="arrow-forward" size={24} color="black" />
                </TouchableOpacity>

                {/* Render upcoming events */}
                {upcomingEvents.map((event) => (
                    <View key={event.id} style={isDarkMode ? styles.darkEventBox : styles.lightEventBox}>
                        <Text style={isDarkMode ? styles.darkEventTitle : styles.lightEventTitle}>{event.title}</Text>
                        <Text style={isDarkMode ? styles.darkEventDate : styles.lightEventDate}>{event.date}</Text>
                        <Text style={isDarkMode ? styles.darkEventDescription : styles.lightEventDescription}>{event.description}</Text>
                    </View>
                ))}

                {/* Rewards Button */}
                <TouchableOpacity 
                    style={styles.rewardsBox} 
                    onPress={() => navigation.navigate('Profile')}  // Navigate to Profile Screen
                >
                    <View style={styles.rewardsContent}>
                        <Text style={styles.rewardsTitle}>Rewards</Text>
                        <Text style={styles.rewardsDescription}>Check out your rewards!</Text>
                    </View>
                    {/* Add an arrow icon */}
                    <Ionicons name="arrow-forward" size={24} color="black" />
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    lightBackground: {
        flex: 1,
        backgroundColor: "#fc6a26",
    },
    darkBackground: {
        flex: 1,
        backgroundColor: "#333",  // Dark mode background
    },
    header: {
        flexDirection: 'row',  // Align items horizontally
        justifyContent: 'space-between',  // Distribute space between elements
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 60,
    },
    profileButton: {
        backgroundColor: '#ffd13b',
        padding: 10,
        borderRadius: 5,
    },
    profileButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logo: {
        width: 100,
        height: 60,
    },
    themeButton: {
        backgroundColor: '#ffd13b',
        padding: 10,
        borderRadius: 5,
    },
    themeButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    lightWelcomeText: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
        marginVertical: 20,
        fontWeight: 'bold',
    },
    darkWelcomeText: {
        fontSize: 24,
        color: '#ffd13b',  // Yellow text for dark mode
        textAlign: 'center',
        marginVertical: 20,
        fontWeight: 'bold',
    },
    feedContainer: {
        paddingHorizontal: 20,
        paddingBottom: 50,   // Ensure there's space to scroll to the bottom
    },
    
    /* Specific styles for the "Feeling Bored?" button */
    feelingBoredBox: {
        backgroundColor: '#ffd13b',  // Use a different color for the "Feeling Bored?" button
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    feelingBoredContent: {
        flexDirection: 'column',
    },
    feelingBoredTitle: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    feelingBoredDescription: {
        color: '#000',
        fontSize: 14,
    },

    /* Rewards button styles */
    rewardsBox: {
        backgroundColor: '#ffd13b',  
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rewardsContent: {
        flexDirection: 'column',
    },
    rewardsTitle: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    rewardsDescription: {
        color: '#000',
        fontSize: 14,
    },

    /* Keep the original styles for the other boxes */
    lightEventBox: {
        backgroundColor: '#000',  // Black background for light mode
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    darkEventBox: {
        backgroundColor: '#555',  // Darker background for dark mode
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    lightEventTitle: {
        color: '#fff',  // White text for light mode
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    darkEventTitle: {
        color: '#ffd13b',  // Yellow text for dark mode
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    lightEventDate: {
        color: '#ffd13b',  // Yellow date for light mode
        fontSize: 14,
        marginBottom: 5,
    },
    darkEventDate: {
        color: '#fff',  // White date for dark mode
        fontSize: 14,
        marginBottom: 5,
    },
    lightEventDescription: {
        color: '#fff',  // White description for light mode
        fontSize: 14,
        textAlign: 'center',
    },
    darkEventDescription: {
        color: '#ccc',  // Light grey description for dark mode
        fontSize: 14,
        textAlign: 'center',
    },
});

export default Homescreen;








