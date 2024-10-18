import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../app/screens/HomeScreen';
import ContactScreen from '../app/screens/ContactScreen';
import GameScreen from '../app/screens/GameScreen';
import BountyHunter from '../app/screens/BountyHunter/BountyHunter';
import BountyHunter2 from '../app/screens/BountyHunter/BountyHunter2';
import WelcomeScreen from '../app/screens/WelcomeScreen';
import ProfileScreen from '../app/screens/ProfileScreen.js';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


// Ensure that only `Screen` components are inside the `Stack.Navigator`
function GameStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GameScreen" component={GameScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="BountyHunter" component={BountyHunter} />
      <Stack.Screen name="BountyHunter2" component={BountyHunter2} />
    </Stack.Navigator>
  );
}

// Ensure that only `Screen` components are inside the `Tab.Navigator`
export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Game"
        component={GameStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
