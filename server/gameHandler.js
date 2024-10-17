// gameHandler.js

const games = {}; // Store game instances

module.exports = (io, socket, games) => {
    // Player joins a game
    socket.on('join-game', (gameId) => {
        const game = games.find((g) => g.id === gameId);
        if (!game) {
            console.log(`Game with ID ${gameId} does not exist`);
            return;
        }

        if (!game.players) {
            game.players = [];
        }

        game.players.push(socket.id);
        socket.join(gameId);
        console.log(`Player ${socket.id} joined game ${gameId}`);
        
        // Notify all players in the game
        socket.to(gameId).emit('player-joined', { id: socket.id, name: `Player ${game.players.length}`, isHider: game.players.length === 1 });

        if (game.players.length === 1) {
            // First player becomes the Hider
            const code = Math.floor(1000 + Math.random() * 9000); // Random 4-digit code
            socket.emit('code-assigned', code);
            game.code = code;
        }
    });

    // Handle player action: submitting code
    socket.on('submit-code', ({ playerName, submittedCode }) => {
        const game = games.find((g) => g.players.includes(socket.id));
        if (game) {
            if (parseInt(submittedCode) === game.code) {
                console.log(`${playerName} submitted the correct code!`);
                io.to(game.id).emit('code-correct', { playerName, points: 10 }); // Correct code submitted
            } else {
                console.log(`${playerName} submitted an incorrect code.`);
                io.to(game.id).emit('code-incorrect', { playerName }); // Incorrect code
            }
        }
    });

    // Handle player leaving the game
    socket.on('leave-game', (gameId) => {
        const game = games.find((g) => g.id === gameId);
        if (game) {
            game.players = game.players.filter(playerId => playerId !== socket.id);
            socket.leave(gameId);
            console.log(`Player ${socket.id} left game ${gameId}`);

            if (game.players.length === 0) {
                delete games[gameId];
                console.log(`Game ${gameId} has been deleted`);
            }
        }
    });
};
