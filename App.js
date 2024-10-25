import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { requestNotificationPermission, scheduleNotifications, handleNotificationResponse } from './NotificationHandler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigation from './navigation/AppNavigator';
import WelcomeScreen from './app/screens/WelcomeScreen';
import SignUpScreen from './app/screens/SignUpScreen';
import { io } from 'socket.io-client'; // Import Socket.io client
import { LogBox } from 'react-native';

const Stack = createStackNavigator();
const socket = io('http://localhost:3000'); // Ensure the server is running
LogBox.ignoreLogs(['The action \'NAVIGATE\' with payload']);

export default function App() {
  useEffect(() => {
    async function initNotifications() {
      const now = new Date();
      console.log(`Current Time: ${now}`);

      // Request notification permissions
      const granted = await requestNotificationPermission();
      if (!granted) {
        console.log('Notification permission not granted');
        return;
      }

      // Test: Schedule a game 5 minutes from now
      const eventDate = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes later
      console.log(`Event Date (Scheduled): ${eventDate}`);

      // Schedule notifications (with a reminder X days before and 30, 2, and 1 minute before the event)
      await scheduleNotifications(eventDate, 5);
    }

    initNotifications();

    // Handle notification tap responses
    handleNotificationResponse();

    // Listen for events emitted by the backend
    socket.on('event-available', (event) => {
      console.log('Event received:', event);
      scheduleNotifications(new Date(event.startTime), 5); // Sync event with notification schedule
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.off('event-available');
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TabNavigate"
            component={TabNavigation}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
