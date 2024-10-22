import * as Notifications from 'expo-notifications';
import { io } from 'socket.io-client';
import { BASE_URL } from './app/config/config';

const socket = io(BASE_URL);

export async function requestNotificationPermission() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    return finalStatus === 'granted';
}

export async function scheduleNotifications(eventDate) {
    // Schedule notifications based on the event date if necessary.
    // Adjust this function to handle event-based notifications.
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export function handleNotificationResponse(navigation) {
    Notifications.addNotificationResponseReceivedListener(response => {
        const { screen } = response.notification.request.content.data;
        if (screen) {
            navigation.navigate(screen);
        }
    });
}

export function setupSocketListeners() {
    socket.on('event-available', async (event) => {
        const eventDate = new Date(event.startTime);
        await scheduleNotifications(eventDate);
    });
}
