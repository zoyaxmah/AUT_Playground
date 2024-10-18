const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const moment = require('moment-timezone');
const gameHandler = require('./gameHandler');
const cors = require('cors'); // Import CORS

require('dotenv').config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for testing
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 3000;
let games = []; // Store all active games

// Enable CORS globally for all HTTP routes
app.use(cors()); // Add CORS middleware for HTTP requests
app.use(express.json()); // Middleware to parse JSON requests

// Endpoint to create a new game event
app.post('/create-event', (req, res) => {
    try {
        const { name, description, startTime } = req.body;

        if (!name || !description || !startTime) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const game = {
            id: games.length + 1,
            name,
            description,
            startTime: moment.tz(startTime, 'Pacific/Auckland').toISOString(),
        };

        games.push(game);
        console.log(`New game scheduled: ${game.name} at ${game.startTime}`);

        const eventTime = moment.tz(game.startTime, 'Pacific/Auckland');
        const currentTime = moment.tz('Pacific/Auckland');

        const delay = eventTime.diff(currentTime, 'seconds');

        if (delay > 0) {
            console.log(`Game will emit in: ${delay} seconds`);
            setTimeout(() => {
                io.emit('event-available', game);
            }, delay * 1000);
        } else {
            io.emit('event-available', game);
        }

        res.status(201).json(game);
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get the latest event details
app.get('/event', (req, res) => {
    if (games.length === 0) {
        return res.status(404).json({ error: 'No event found' });
    }

    // Respond with the latest game event in JSON format
    res.json(games[games.length - 1]);
});

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);
    gameHandler(io, socket, games); // Use gameHandler for game management

    // Handle player disconnect
    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://172.29.46.86:${PORT}`); // Use your IP address here
});
