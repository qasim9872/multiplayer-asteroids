$(document).ready(function () {
    const container = document.getElementById('game-container');

    // Empty container before adding new elements
    container.innerHTML = '';

    const socket = io();

    const emitMethod = socket.emit;
    // Wrap the socket emit function using a timeout to introduce artificial delay
    socket.emit = function () {
        var args = Array.from(arguments);
        setTimeout(() => {
            emitMethod.apply(this, args);
        }, 0);
    }

    // Input.applyEventHandlers(canvas);

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