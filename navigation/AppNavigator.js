import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../app/screens/WelcomeScreen';
import HomeScreen from '../app/screens/HomeScreen';
import GameScreen from '../app/screens/GameScreen';
import ContactScreen from '../app/screens/ContactScreen';

const Stack = createStackNavigator();

function AppNavigator(){
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen 
                name="Home" 
                component={HomeScreen}
                options={{ headerShown: false}} />
                <Stack.Screen 
                name="Game" 
                component={GameScreen}
                options={{ headerShown: false}}  />
                <Stack.Screen
                name="Contact"
                component={ContactScreen}
                options={{ headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;