module.exports = (io, socket, games) => {
    // Handler for a player joining a game
    socket.on('join-game', ({ gameName, name }) => {
        if (!gameName || !name) {
            console.error(`Missing gameName or name. gameName: ${gameName}, name: ${name}`);
            socket.emit('error', 'Missing gameName or name.');
            return;
        }

        const game = games.find(g => g.name === gameName);
        if (!game) {
            console.error(`Game with name ${gameName} does not exist.`);
            socket.emit('error', `Game with name ${gameName} does not exist.`);
            return;
        }

        if (!game.players) {
            game.players = [];
        }

        // Check if the player is already in the game
        const existingPlayer = game.players.find(player => player.id === socket.id);
        if (existingPlayer) {
            console.log(`Player ${name} is already in the game with name ${gameName}`);
            socket.emit('error', 'Player is already in the game.');
            return;
        }

        // Add the new player to the game
        game.players.push({ id: socket.id, name });
        socket.join(game.name);

        console.log(`Player ${name} (${socket.id}) joined game ${game.name}`);

        const isHider = game.players.length === 1; // First player is the Hider
        const role = isHider ? 'Hider' : 'Hunter';

        // Emit to the player that just joined with their role
        socket.emit('player-joined', { id: socket.id, name, isHider });

        // Broadcast to other players that a new player has joined
        socket.to(game.name).emit('new-player', { id: socket.id, name, role });

        // Send the full list of players to the player who just joined
        socket.emit('player-list', game.players);

        // If the player is the Hider, assign and emit the code
        if (isHider) {
            const code = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit code
            game.code = code;
            socket.emit('code-assigned', { code });
            console.log(`Hider code assigned: ${code}`);
        }
    });

    // Handler for code submission by a Hunter
    socket.on('submit-code', ({ submittedCode }) => {
        if (!submittedCode) {
            socket.emit('error', 'No code provided.');
            return;
        }

        // Find the game this player is in
        const game = games.find(g => g.players.some(player => player.id === socket.id));
        if (!game) {
            socket.emit('error', 'Game not found for this player.');
            return;
        }

        // Check if the submitted code matches the Hider's code
        if (parseInt(submittedCode) === game.code) {
            io.to(game.name).emit('code-correct', { playerName: socket.id });
            console.log(`Player ${socket.id} submitted the correct code.`);
        } else {
            io.to(game.name).emit('code-incorrect', { playerName: socket.id });
            console.log(`Player ${socket.id} submitted the incorrect code.`);
        }
    });

    // Handler for when a player disconnects
    socket.on('disconnect', () => {
        games.forEach((game) => {
            const playerIndex = game.players.findIndex(player => player.id === socket.id);
            if (playerIndex !== -1) {
                const playerName = game.players[playerIndex].name;
                game.players.splice(playerIndex, 1); // Remove the player from the game

                console.log(`Player ${playerName} (${socket.id}) disconnected from game ${game.name}`);
                io.to(game.name).emit('player-left', { id: socket.id, name: playerName });
            }
        });
    });
};
