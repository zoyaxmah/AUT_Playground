import * as Notifications from 'expo-notifications';

// Function - request notification permissions
export async function requestNotificationPermission() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    return finalStatus === 'granted';
}

// Combined functions to schedule all notifications (custom days, 30 minutes, 2 minutes, and 1 minute before the event)
export async function scheduleNotifications(eventDate, daysBefore = 5) {
    const now = new Date();
    console.log(`Current Time (Inside scheduleNotifications): ${now}`);

    // Calculate the time for X amount of days, 30 minutes, 2 minutes, and 1 minute before the event
    const daysBeforeNotification = new Date(eventDate.getTime() - daysBefore * 24 * 60 * 60 * 1000);
    const thirtyMinutesBefore = new Date(eventDate.getTime() - 30 * 60 * 1000);
    const twoMinutesBefore = new Date(eventDate.getTime() - 2 * 60 * 1000);
    const oneMinuteBefore = new Date(eventDate.getTime() - 1 * 60 * 1000);

    // Logging the calculated times for debugging
    console.log(`Scheduled ${daysBefore} Days Before: ${daysBeforeNotification}`);
    console.log(`Scheduled 30 Minutes Before: ${thirtyMinutesBefore}`);
    console.log(`Scheduled 2 Minutes Before: ${twoMinutesBefore}`);
    console.log(`Scheduled 1 Minute Before: ${oneMinuteBefore}`);

    // Schedule a notification X days before, if the time is valid
    if (daysBeforeNotification > now) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Game Reminder',
                body: `There will be a game in the next ${daysBefore} days! Be ready!`,
                data: { screen: 'Home' }
            },
            trigger: { date: daysBeforeNotification }
        });
        console.log(`Scheduled ${daysBefore} days before notification for ${daysBeforeNotification}`);
    } else {
        console.log(`The ${daysBefore}-day notification time is in the past, skipping.`);
    }

    // Schedule a notification 30 minutes before, if the time is valid
    if (thirtyMinutesBefore > now) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Game Reminder',
                body: 'The game starts in 30 minutes!',
                data: { screen: 'Home' }
            },
            trigger: { date: thirtyMinutesBefore }
        });
        console.log(`Scheduled 30 minutes before notification for ${thirtyMinutesBefore}`);
    } else {
        console.log("The 30-minute notification time is in the past, skipping.");
    }

    // Schedule a notification 2 minutes before, (if time is valid/correct)
    if (twoMinutesBefore > now) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Game Reminder',
                body: 'The game is starting in 2 minutes!',
                data: { screen: 'Home' }
            },
            trigger: { date: twoMinutesBefore }
        });
        console.log(`Scheduled 2 minutes before notification for ${twoMinutesBefore}`);
    } else {
        console.log("The 2-minute notification time is in the past, skipping.");
    }

    // Schedule a notification 1 minute before, if the time is valid
    if (oneMinuteBefore > now) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Game Reminder',
                body: 'The game is starting in 1 minute!',
                data: { screen: 'Home' }
            },
            trigger: { date: oneMinuteBefore }
        });
        console.log(`Scheduled 1 minute before notification for ${oneMinuteBefore}`);
    } else {
        console.log("The 1-minute notification time is in the past, skipping.");
    }
}

// Handle notification when app is opened (existing)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Handle what happens when a notification is tapped (navigates to HomeScreen)
export function handleNotificationResponse(navigation) {
    Notifications.addNotificationResponseReceivedListener(response => {
        const { screen } = response.notification.request.content.data;
        if (screen) {
            navigation.navigate(screen);  // Navigate to the Home screen
        }
    });
}