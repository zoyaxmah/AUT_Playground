module.exports = (io, socket, games) => {
    socket.on('join-game', ({ gameName, name }) => {
        if (!gameName || !name) {
            console.error('Error: Missing gameName or playerName in join-game');
            return;
        }

        const game = games.find(g => g.name === gameName);
        if (!game) {
            return socket.emit('error', `Game with name ${gameName} does not exist.`);
        }

        if (!game.players) game.players = [];

        const existingPlayer = game.players.find(player => player.name === name);
        if (existingPlayer) {
            return socket.emit('error', 'Player is already in the game.');
        }

        game.players.push({ id: socket.id, name });
        socket.join(game.name);
    });

    

    // Handle disconnects
    socket.on('disconnect', () => {
        games.forEach(game => {
            const playerIndex = game.players.findIndex(player => player.id === socket.id);
            if (playerIndex !== -1) {
                const playerName = game.players[playerIndex].name;
                game.players.splice(playerIndex, 1);
                io.to(game.name).emit('player-left', { name: playerName });
            }
        });
    });
};
