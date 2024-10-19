const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const moment = require('moment-timezone');
const gameHandler = require('./gameHandler');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 3000;
let games = [];
let activeGames = []; // Track active games that are in progress

app.use(cors());
app.use(express.json());

// Create a new event (game)
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
            players: []  // Initialize an empty players array for this game
        };

        games.push(game);

        console.log(`New game scheduled: ${game.name} at ${game.startTime} with name: ${game.name}`);

        const eventTime = moment.tz(game.startTime, 'Pacific/Auckland');
        const currentTime = moment.tz('Pacific/Auckland');
        const delay = eventTime.diff(currentTime, 'seconds');

        // Schedule when the game becomes available
        if (delay > 0) {
            setTimeout(() => {
                io.emit('event-available', game);
                activeGames.push(game); // Add game to active games when it becomes available
                console.log(`Game available: ${game.name}`);
            }, delay * 1000);

            // Schedule removal from available list after 5 minutes
            setTimeout(() => {
                // Emit game-unavailable event but don't fully remove from activeGames for ongoing users
                io.emit('event-unavailable', game.name);
                games = games.filter(g => g.name !== game.name); // Remove from available games list only
                console.log(`Game removed from available list: ${game.name}`);
            }, (delay + 5 * 60) * 1000);
        } else {
            io.emit('event-available', game);
            activeGames.push(game); // Add to active games immediately if available
            console.log(`Game available immediately: ${game.name}`);
        }

        res.status(201).json(game);
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch the latest available game
app.get('/event', (req, res) => {
    if (games.length === 0) {
        console.log('No available game found');
        return res.status(404).json({ error: 'No event found' });
    }
    const latestGame = games[games.length - 1];
    console.log(`Fetched latest joinable event: ${latestGame.name}`);
    res.json(latestGame);
});

// Endpoint to fetch active games for players who joined
app.get('/active-games', (req, res) => {
    if (activeGames.length === 0) {
        console.log('No active game found');
        return res.status(404).json({ error: 'No active game found' });
    }
    console.log(`Fetched active games: ${activeGames.length} game(s) active`);
    res.json(activeGames);
});

io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);
    gameHandler(io, socket, activeGames); // Pass active games to game handler

    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://192.168.1.65:${PORT}`);
});
