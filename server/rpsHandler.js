module.exports = (io, socket, games) => {
    // When a player joins, assign a unique code
    socket.on('join-game', ({ name }) => {
        if (!name) {
            console.error('Missing player name.');
            socket.emit('error', 'Missing player name.');
            return;
        }

        // Generate a unique code for the player
        const playerCode = Math.floor(1000 + Math.random() * 9000); // 4-digit code
        const player = {
            id: socket.id,
            name,
            code: playerCode,
            room: null  // Room will be assigned when they join another player's room
        };

        console.log(`Player ${name} (${socket.id}) joined with code ${playerCode}`);

        // Emit the player's unique code
        socket.emit('code-assigned', { code: playerCode });

        // Store the player in a temporary "waiting" state
        games.push(player);

        // Send the player list (just the player for now)
        socket.emit('player-list', games);
    });

    // Handler for when a player encounters another and inputs their code to join their room
    socket.on('input-code', ({ inputCode }) => {
        if (!inputCode) {
            socket.emit('error', 'No code provided.');
            return;
        }

        // Find the game/player with the matching code
        const otherPlayer = games.find(g => g.code === parseInt(inputCode));

        if (!otherPlayer) {
            socket.emit('error', 'No player found with that code.');
            return;
        }

        // Check if the other player already has a room, if not create a room
        if (!otherPlayer.room) {
            const roomName = `room-${otherPlayer.code}-${socket.id}`;
            otherPlayer.room = roomName;
            socket.join(roomName);
            otherPlayer.room = roomName;
            console.log(`Created new room: ${roomName}`);
            socket.emit('room-joined', { room: roomName });
        } else {
            // Join the existing room
            socket.join(otherPlayer.room);
            socket.emit('room-joined', { room: otherPlayer.room });
            console.log(`${socket.id} joined room ${otherPlayer.room}`);
        }

        // Notify both players that the room is ready
        io.to(otherPlayer.room).emit('game-start', { room: otherPlayer.room, players: [socket.id, otherPlayer.id] });
    });

    // Keep the disconnect event
    socket.on('disconnect', () => {
        games.forEach((game) => {
            if (game.id === socket.id) {
                console.log(`Player ${game.name} (${socket.id}) disconnected`);
                games = games.filter(g => g.id !== socket.id);  // Remove player from games list
                io.to(game.room).emit('player-left', { id: socket.id, name: game.name });
            }
        });
    });
};
