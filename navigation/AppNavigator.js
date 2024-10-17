import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from '../app/screens/WelcomeScreen.js'
import HomeScreen from '../app/screens/HomeScreen.js'
import GameScreen from '../app/screens/GameScreen.js'
import ContactScreen from '../app/screens/ContactScreen.js'

const Tab = createBottomTabNavigator();

export default function TabNavigation(){
  return (
    <Tab.Navigator>

      <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{headerShown:false}} />

      <Tab.Screen
      name="Game"
      component={GameScreen}
      options={{headerShown:false}}  />

      <Tab.Screen
      name="Contact"
      component={ContactScreen}
      options={{headerShown:false}}  />
      
    </Tab.Navigator>
  );
}