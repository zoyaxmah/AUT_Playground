import * as Notifications from 'expo-notifications';
import { io } from 'socket.io-client'; // Connect to backend

const socket = io('http://localhost:3000'); // Update with your backend URL

// Request notification permission
export async function requestNotificationPermission() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    return finalStatus === 'granted';
}

// Schedule notifications for the event
export async function scheduleNotifications(eventDate, daysBefore = 5) {
    const now = new Date();

    const daysBeforeNotification = new Date(eventDate.getTime() - daysBefore * 24 * 60 * 60 * 1000);
    const thirtyMinutesBefore = new Date(eventDate.getTime() - 30 * 60 * 1000);
    const twoMinutesBefore = new Date(eventDate.getTime() - 2 * 60 * 1000);
    const oneMinuteBefore = new Date(eventDate.getTime() - 1 * 60 * 1000);

    // console.log(`Scheduled ${daysBefore} Days Before: ${daysBeforeNotification}`);
    //console.log(`Scheduled 30 Minutes Before: ${thirtyMinutesBefore}`);
    // console.log(`Scheduled 2 Minutes Before: ${twoMinutesBefore}`);
    // console.log(`Scheduled 1 Minute Before: ${oneMinuteBefore}`);

    // Schedule notifications at appropriate times
    if (daysBeforeNotification > now) {
        await scheduleNotification('Game Reminder', `There will be a game in the next ${daysBefore} days! Be ready!`, daysBeforeNotification);
    }

    if (thirtyMinutesBefore > now) {
        await scheduleNotification('Game Reminder', 'The game starts in 30 minutes!', thirtyMinutesBefore);
    }

    if (twoMinutesBefore > now) {
        await scheduleNotification('Game Reminder', 'The game is starting in 2 minutes!', twoMinutesBefore);
    }

    if (oneMinuteBefore > now) {
        await scheduleNotification('Game Reminder', 'The game is starting in 1 minute!', oneMinuteBefore);
    }
}

// Helper function to schedule a notification
async function scheduleNotification(title, body, triggerDate) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: { screen: 'Home' }
        },
        trigger: { date: triggerDate }
    });
    // console.log(`Scheduled notification for ${triggerDate}`);
}

// Handle notification when app is opened
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Handle notification response to navigate to the appropriate screen
export function handleNotificationResponse(navigation) {
    Notifications.addNotificationResponseReceivedListener(response => {
        const { screen } = response.notification.request.content.data;
        if (screen) {
            navigation.navigate(screen);
        }
    });
}

// Listen for events from backend and schedule notifications accordingly
export function setupSocketListeners() {
    socket.on('event-available', async (event) => {
        console.log('Received event from server:', event);
        const eventDate = new Date(event.startTime);
        await scheduleNotifications(eventDate);
    });
}
