$(document).ready(function () {
    const canvas = document.getElementById('canvas');
    const socket = io();

    Input.applyEventHandlers(canvas);
    const game = Game.create(socket, canvas);

    // Emit event to tell the server that a new player has joined
    socket.emit('new-player', {});

    // Begin game loop
    game.animate();
});