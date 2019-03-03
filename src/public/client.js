$(document).ready(function () {
    const canvas = $('canvas');
    const socket = io();

    Game.create(socket, canvas);
})