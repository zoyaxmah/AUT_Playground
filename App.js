import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { requestNotificationPermission, scheduleNotifications, handleNotificationResponse } from './NotificationHandler';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator } from '@react-navigation/stack';
import TabNavigation from './navigation/AppNavigator';
import WelcomeScreen from './app/screens/WelcomeScreen';
import SignUpScreen from './app/screens/SignUpScreen';

const Stack = createStackNavigator();

export default function App({ navigation }) {
  useEffect(() => {
    // A Function to initialize notifications
    async function initNotifications() {
      // Log the current system time to help with debugging
      const now = new Date();
      console.log(`Current Time: ${now}`);

      // Request notification permissions (user can change this later in settings )
      const granted = await requestNotificationPermission();
      if (!granted) {
        console.log('Notification permission not granted');
        return;
      }

      // TESTING: Set a game 5 minutes in the future for testing
      const eventDate = new Date(new Date().getTime() + 5 * 60 * 1000);  // 5 minutes from now
      console.log(`Event Date (Scheduled): ${eventDate}`);

      // Schedule all notifications (custom days!!! 30 minutes, 2 minutes, and 1 minute before the event)
      await scheduleNotifications(eventDate, 5);  // You can change the number of days here
    }

    initNotifications();

    // If the notification gets tapped 

    handleNotificationResponse(navigation);
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
          name="Login"
          component={WelcomeScreen}
          options={{headerShown:false}}  />

          <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{headerShown:false}}  />

          <Stack.Screen 
          name="TabNavigate"
          component={TabNavigation}
          options={{headerShown:false}}  />
        </Stack.Navigator>
        
      </NavigationContainer>
    </>
  );
}