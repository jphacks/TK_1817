var panning;

$(document).on('turbolinks:load', function () {
    var $playerCanvas = $('#player');
    var context;
    var source;
    var currentPeriod   // ms
    var beats;

    var goalTime = frParseDate(params['time']).getTime();
    var lastDist, lastTime;

    var panner;

    function frParseDate(str) {
        var date = new Date();
        var isPm = (str.substr(0, 2) == "pm");
        var hour = Number(str.substr(3, 2));
        var minute = Number(str.substr(8, 2));
        if (isPm) { hour += 12; }
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute);
    }

    function sendRequest(userId) {
        var currentTime = Date.now();
        var currentDist = getRemainingLength();

        $.ajax({
            type: 'GET',
            url: '/play_v2',
            dataType: 'json',
            data: {
                'user_id': userId,
                'remain_dist': currentDist,
                'limit_time': goalTime - currentTime,
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
        if (beats != null) clearInterval(beats);

        beats = setInterval(function () {
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
        if (source != null) source.stop();

        source = context.createBufferSource();

        // Load musicfile
        var request = new XMLHttpRequest();
        request.open('GET', 'musics/' + musicSrc, true);
        request.responseType = 'arraybuffer';

        var gain = context.createGain();
        panner = context.createStereoPanner();
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

        // When music ended, next music will play
        source.onended = function () {
            sendRequest(1);
        }

        request.send();
    }

    panning = function (value) {
        panner.pan.setTargetAtTime(value, context.currentTime, 0.2);
        panner.pan.setTargetAtTime(0.0, context.currentTime + 5.0, 0.5);
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

    setTimeout(function () {
        sendRequest(1);
    }, 500);

    $('#nextButton').on('click', function () {
        source.stop();
    });

    $('#leftPan').on('click', function () {
        panning(-1.0);
    });

    $('#rightPan').on('click', function () {
        panning(1.0);
    });

});