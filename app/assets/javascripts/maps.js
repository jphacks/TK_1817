var map, infoWindow, pos;
var post_makers = [];
var style = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }]
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }]
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }]
    }];
var styles = {
    default: style,
    hide: style.concat([
        {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }]
        },
        {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }]
        }
    ])
};

function initMap() {
    console.log('Debug');

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 35.5709605, lng: 139.63446 },
        zoom: 20,
        styles: styles['default'],
    });

    map.addListener('click', function (e) {
        getClickLatLng(e.latLng, map, directionsService, directionsDisplay);
    });

    directionsDisplay.setMap(map);
    //directionsDisplay.setPanel(document.getElementById('right-panel'));
    infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            console.log('lat: ', position.coords.latitude);
            console.log('lng: ', position.coords.longitude);

            document.getElementById('start_pos').value = [
                position.coords.latitude,
                position.coords.longitude,
            ]

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }

    new AutocompleteDirectionsHandler(map, pos);

    var button = document.getElementById("button");
    button.addEventListener('click', function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay, 'search');
    });

    var styleControl = document.getElementById('style-selector-control');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(styleControl);

    document.getElementById('hide-poi').addEventListener('click', function () {
        map.setOptions({ styles: styles['hide'] });
    });

    document.getElementById('show-poi').addEventListener('click', function () {
        map.setOptions({ styles: styles['default'] });
    });
}

function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'WALKING';

    var originInput = document.getElementById('start');
    var waypointInput = document.getElementById('waypoint');
    var destinationInput = document.getElementById('end');
    var buttonInput = document.getElementById('button');

    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(map);

    var originAutocomplete = new google.maps.places.Autocomplete(
        originInput, { placeIdOnly: true });
    var originAutocomplete = new google.maps.places.Autocomplete(
        waypointInput, { placeIdOnly: true });
    var destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, { placeIdOnly: true });

    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(originAutocomplete, 'WAYPOINT');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

    //this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
    //this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(waypointInput);
    //this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
    //this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(buttonInput);
}

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (autocomplete, mode) {
    var me = this;
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
        }
        if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
        } else {
            me.destinationPlaceId = place.place_id;
            document.getElementById('end_').value = document.getElementById('end').value;
            console.log("end_:", document.getElementById('end_').value);
        }
        me.route();
    });
};

AutocompleteDirectionsHandler.prototype.route = function () {
    if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
    }
    var me = this;

    this.directionsService.route({
        origin: { 'placeId': this.originPlaceId },
        destination: { 'placeId': this.destinationPlaceId },
        travelMode: this.travelMode
    }, function (response, status) {
        if (status === 'OK') {
            me.directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
};

function calculateAndDisplayRoute(directionsService, directionsDisplay, mode) {
    var start;
    var end;

    if (!document.getElementById('start').value) {
        start = document.getElementById('start_pos').value;
        console.log('Start pos!');
    } else {
        start = document.getElementById('start').value;
        console.log('Start!');
    }

    if (mode == 'search') {
        end = document.getElementById('end').value;
        console.log('End!');
    } else {
        end = document.getElementById('end_pos').value;
        console.log('End pos!');
    }

    console.log('Start:', start);
    console.log('End:', end);

    directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'WALKING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);

            var distance = 0
            var route = response.routes[0];
            var summaryPanel = document.getElementById('directions-panel');
            summaryPanel.innerHTML = '';

            distance = route.legs[0].distance.value;

            //summaryPanel.innerHTML += '<b>Route</b><br>';
            //summaryPanel.innerHTML += route.legs[0].start_address + ' to ';
            //summaryPanel.innerHTML += route.legs[route.legs.length - 1].end_address + '<br>';
            summaryPanel.innerHTML += '目的地まで: ' + String(parseFloat(distance / 1000, 2)) + ' km!<br><br>';
            console.log("Start:" + route.legs[0].start_address);
            console.log("End:" + route.legs[route.legs.length - 1].end_address);

            document.getElementById('distance').value = parseFloat(distance, 2);
            console.log("distance set:" + parseFloat(distance, 2));
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function getClickLatLng(lat_lng, map, directionsService, directionsDisplay) {
    document.getElementById('lat').value = lat_lng.lat();
    document.getElementById('lng').value = lat_lng.lng();
    document.getElementById('end_pos').value = [
        lat_lng.lat(),
        lat_lng.lng()
    ];
    document.getElementById('end_').value = document.getElementById('end_pos').value


    var marker = new google.maps.Marker({
        position: lat_lng,
        map: map
    });

    if (post_makers.length != 0) {
        post_makers[0].setMap(null)
        post_makers.pop()
    }
    post_makers.push(marker);

    console.log('pos:', document.getElementById('end_pos').value)
    console.log('lat:', lat_lng.lat())
    console.log('lng:', lat_lng.lng())

    map.panTo(lat_lng);

    calculateAndDisplayRoute(directionsService, directionsDisplay, "click")
}