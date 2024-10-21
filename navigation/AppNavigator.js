import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../app/screens/HomeScreen';
import ContactScreen from '../app/screens/ContactScreen';
import GameScreen from '../app/screens/GameScreen';
import BountyHunter from '../app/screens/BountyHunter/BountyHunter';
import BountyHunter2 from '../app/screens/BountyHunter/BountyHunter2';
import WelcomeScreen from '../app/screens/WelcomeScreen';
import ProfileScreen from '../app/screens/ProfileScreen';
import GameEnded from '../app/screens/BountyHunter/GameEnded';
import SignUpScreen from '../app/screens/SignUpScreen'; 

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


// Auth stack for sign-up and welcome screens
function AuthStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
    </Stack.Navigator>
  );
}

// Game stack for all game-related screens
function GameStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GameScreen" component={GameScreen} />
      <Stack.Screen name="BountyHunter" component={BountyHunter} />
      <Stack.Screen name="BountyHunter2" component={BountyHunter2} />
      <Stack.Screen name="GameEnded" component={GameEnded} />
    </Stack.Navigator>
  );
}

// Main App Navigator including Tab Navigation and Authentication Stack
export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Games"
        component={GameStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
