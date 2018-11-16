$(document).on('turbolinks:load', function () {
    var $playerCanvas = $('#player');
    var context;
    var currentPeriod   // ms

    var params = [];
    var goalTime;
    var lastDist, lastTime;

    function sendRequest(userId, limitTime) {
        var currentTime = Date.now();
        var currentDist = getRemainingLength();

        $.ajax({
            type: 'GET',
            url: '/play_v2',
            dataType: 'json',
            data: {
                'user_id': userId,
                'remain_dist': currentTime,
                'limit_time': limitTime,
                'recent_dist': lastDist - currentDist,
                'recent_steps': (currentTime - lastTime) / currentPeriod
            }
        }).done(function (data, status, xhr) {
            // done
            initPlayerCanvas($playerCanvas, data['tempo']);
            initPlayer(data['music_src']);

            lastTime = currentTime;
            lastDist = currentDist;
        }).fail(function (xhr, status, error) {
            console.log("Request: " + status + " Error detected.");
        });
    }

    function setBeats($canvas, layer, period) {
        bearts = setInterval(function () {
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

        currentPeriod = period;
    }

    function initPlayerCanvas($canvas, bpm) {
        $canvas.drawImage({
            layer: true,
            name: 'note',
            source: 'images/note.png',
            x: 400, y: 400,
            width: 400, height: 400
        });
        setBeats($canvas, 'note', 60000.0 / bpm);
    }

    function initPlayer(musicSrc) {

        var source = context.createBufferSource();

        // Load musicfile
        var request = new XMLHttpRequest();
        request.open('GET', 'musics/' + musicSrc, true);
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

    // Init context
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
    }
    catch (e) {
        console.log('Web Audio API is not supported in this browser');
    }

    // Getting params
    // (ref: https://www.tam-tam.co.jp/tipsnote/javascript/post9911.html )
    var urlParam = location.search.substring(1);

    if (urlParam) {
        var param = urlParam.split('&');

        for (i = 0; i < param.length; i++) {
            var paramItem = param[i].split('=');
            params[paramItem[0]] = paramItem[1];
        }
    }

    console.log(params);

    sendRequest(1, 10000);

});