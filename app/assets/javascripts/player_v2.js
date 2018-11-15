$(document).on('turbolinks:load', function () {

    function sendRequest(userId, remainDist, limitTime, recentDist, recentSteps) {
        $.ajax({
            type: 'GET',
            url: '/play_v2',
            dataType: 'json',
            data: {
                'user_id': userId,
                'remain_dist': remainDist,
                'limit_time': limitTime,
                'recent_dist': recentDist,
                'recent_steps': recentSteps
            }
        }).done(function (data, status, xhr) {
            // done
        }).fail(function (xhr, status, error) {
            console.log("Request: " + status + " Error detected.");
        });
    }

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

        var source = context.createBufferSource();

        // Load musicfile
        var request = new XMLHttpRequest();
        request.open('GET', 'musics/Fluttering.mp3', true);
        request.responseType = 'arraybuffer';

        var gain = context.createGain();
        var panner = context.createStereoPanner();
        // panner.pan.value = 0.8;
        source.connect(gain);

        // Decode asynchronously
        request.onload = function () {
            context.decodeAudioData(request.response, function (buffer) {
                source.buffer = buffer;
                source.connect(panner);
                panner.connect(context.destination);
                source.start(0);
            });
        }
        request.send();
    }

    sendRequest(0, 10000, 100, 5000, 140);
    initPlayerCanvas($('#player'));
    initPlayer();

});