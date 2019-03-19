$(document).ready(function () {
    const container = document.getElementById('game-container');

    // Empty container before adding new elements
    container.innerHTML = '';

    const socket = io();

    // Emit event to tell the server that a new player has joined
    socket.emit('new-player', {});

    // Make the game variable global so it can be accessed by the inspector window for debugging purposes
    game = null;

    socket.on('game-config', (config) => {

        if (game) {
            console.log(`Game config already received`);
        } else {
            game = Game.create(socket, container, config);

            // Begin game loop
            game.animate();
        }

    });

});