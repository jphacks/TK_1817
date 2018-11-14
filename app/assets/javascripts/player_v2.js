$(document).on('turbolinks:load', function () {

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

    function initPlayerCanvas($canvas) {
        $canvas.drawImage({
            layer: true,
            name: 'note',
            source: 'images/note.png',
            x: 400, y: 400,
            width: 400, height: 400
        });
        beats($canvas, 'note', 500);
    }

    function initPlayer() {
        var context;

        // Init context
        try {
            // Fix up for prefixing
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            context = new AudioContext();
        }
        catch (e) {
            console.log('Web Audio API is not supported in this browser');
        }

        // Load musicfile
        var request = new XMLHttpRequest();
        request.open('GET', 'musics/Fluttering.mp3', true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = function () {
            context.decodeAudioData(request.response, function (buffer) {
                var source = context.createBufferSource();
                source.buffer = buffer;
                source.connect(context.destination);
                source.start(0);
            });
        }
        request.send();
    }

    initPlayerCanvas($('#player'));
    initPlayer();

});