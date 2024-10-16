const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const moment = require('moment-timezone'); // Ensure moment-timezone is installed

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for testing
        methods: ['GET', 'POST'],
    },
});

const PORT = 3000;
let events = [];

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to create a new event
app.post('/create-event', (req, res) => {
    try {
        const { name, description, startTime } = req.body;

        if (!name || !description || !startTime) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const event = {
            id: events.length + 1,
            name,
            description,
            startTime: moment.tz(startTime, 'Pacific/Auckland').toISOString(),
        };

        events.push(event);
        console.log(`New event scheduled: ${event.name} at ${event.startTime}`);

        const eventTime = moment.tz(event.startTime, 'Pacific/Auckland');
        const currentTime = moment.tz('Pacific/Auckland');

        const delay = eventTime.diff(currentTime, 'seconds');

        if (delay > 0) {
            console.log(`Event will emit in: ${delay} seconds`);
            setTimeout(() => {
                io.emit('event-available', event);
            }, delay * 1000);
        } else {
            io.emit('event-available', event);
        }

        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    // Handle player joining
    socket.on('player-joined', (player) => {
        console.log(`${player.name} joined!`);
        io.emit('player-joined', player);
    });

    // Handle player movement
    socket.on('player-move', (location) => {
        if (location && location.latitude && location.longitude) {
            console.log('Player moved:', location);
            io.emit('player-move', location);
        } else {
            console.error('Invalid location data received.');
        }
    });

    // Handle player disconnect
    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);
    });

    // Handle code submission
    socket.on('submit-code', ({ playerName, submittedCode }) => {
        console.log(`${playerName} submitted code: ${submittedCode}`);
        // Emit response result back to client
    });
    

    // Handle setting code by Hider
    socket.on('set-code', (code) => {
        console.log('Hider set the code:', code);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
