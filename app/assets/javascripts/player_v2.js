$(document).on('turbolinks:load', function () {
    $('#player').drawImage({
        source: 'images/note.png',
        x: 400, y: 400,
        width: 400, height: 400
    });
});