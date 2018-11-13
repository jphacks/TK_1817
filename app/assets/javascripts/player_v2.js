$(document).on('turbolinks:load', function () {
    $player_canvas = $('#player');

    function beats($canvas, layer, period) {
        setInterval(function () {
            $canvas.setLayer(layer, {
                width: 500, height: 500
            });
            $canvas.animateLayer(layer, {
                width: 400, height: 400
            }, period * 0.9);

            arcLayerName = 'arc_' + Math.round(Math.random() * 10000);
            $canvas.drawArc({
                layer: true,
                name: arcLayerName,
                x: 400, y: 400,
                strokeStyle: 'rgb(121, 168, 45)',
                radius: 50,
                strokeWidth: 10
            });
            $canvas.animateLayer(arcLayerName, {
                radius: 400,
                strokeStyle: 'rgba(121, 168, 45, 0)'
            }, period * 4);
        }, period, function () {
            $canvas.removeLayer(arcLayerName);
        });

    }

    $player_canvas.drawImage({
        layer: true,
        name: 'note',
        source: 'images/note.png',
        x: 400, y: 400,
        width: 400, height: 400
    });
    beats($player_canvas, 'note', 500);
});