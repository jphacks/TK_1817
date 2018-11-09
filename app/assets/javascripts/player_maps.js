window.addEventListener('DOMContentLoaded', function() {
    var map, infoWindow, pos;
    end = document.getElementById('end_').value;
    time = document.getElementById('time').value;
    playlist = document.getElementById('playlist_id').value;
    
    function initMap() {
        console.log("INIT MAP")
        var directionsService = new google.maps.DirectionsService();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                document.getElementById('lat').value = position.coords.latitude;
                document.getElementById('lng').value = position.coords.longitude;
                
                console.log('lat: ', position.coords.latitude);
                console.log('lng: ', position.coords.longitude);

                calculateAndDisplayRoute(directionsService, pos);

            }, function () {
                handleLocationError(true);
            });
        } else {
            handleLocationError(false);
        }
    }

    function calculateAndDisplayRoute(directionsService, address) {
        console.log('address: ', address)
        console.log('end:', end);

        directionsService.route({
            origin: pos,
            destination: end,
            travelMode: 'WALKING'
        }, function (response, status) {
            if (status === 'OK') {
                distance = 0;
                dist = distance;
                var route = response.routes[0]; 
                distance = route.legs[0].distance.value;
                document.getElementById('distance').value = distance;
                
                console.log('destination', end)
                console.log('Distance: ', String(distance))

                console.log("Start:" + route.legs[0].start_address)
                console.log("End:" + route.legs[route.legs.length - 1].end_address)
                console.log("distance set:" + parseFloat(distance, 2))
        }
        });
    }

    function handleLocationError(browserHasGeolocation) {
        console.log("Error")
    }
})