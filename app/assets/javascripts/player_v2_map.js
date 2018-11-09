$(document).on('turbolinks:load', function () {

    var map;    // Map used mainly
    var currentPos; // Current position (refreshed every 10 seconds)

    // Notice when geolocation not supported
    if (!navigator.geolocation){
        console.log("Geolocation not supported.");
        return;
    }
    
    // Initialize map
    initMap();

    // Set distination
    refreshPlace();

    // Refresh map each 10 seconds
    setInterval(function(){
        
    },10000);

    function initMap() {
        // Google Mapsに書き出し
        map = new google.maps.Map( document.getElementById( 'map' ) , {
            zoom: 15    // ズーム値
        });
    }

    function refreshPlace() {
        var output = document.getElementById("result");
        
        function success(position) {
            var latitude  = position.coords.latitude;//緯度
            var longitude = position.coords.longitude;//経度
            output.innerHTML = '<p>緯度 ' + latitude + '° <br>経度 ' + longitude + '°</p>';
            // 位置情報
            currentPos = new google.maps.LatLng( latitude , longitude ) ;
            console.log("Place refreshed");
            
            // マーカーの新規出力
            new google.maps.Marker( {
                map: map ,
                position: currentPos ,
            });
            map.panTo(currentPos);

            setDist();
        };
        function error() {
            //エラーの場合
            output.innerHTML = "座標位置を取得できません";
        };
        navigator.geolocation.getCurrentPosition(success, error);//成功と失敗を判断
    };

    function setDist(){
        var directionsDisplay = new google.maps.DirectionsRenderer({
            map: map, // 描画先の地図
            draggable: true, // ドラッグ可
            preserveViewport: true // centerの座標、ズームレベルで表示
        });
        var directionsService = new google.maps.DirectionsService();
        directionsDisplay.setMap(map);

        var request = {
            origin: currentPos, // スタート地点
            destination: new google.maps.LatLng(35.712408, 139.776188), // ゴール地点
            travelMode: google.maps.DirectionsTravelMode.WALKING, // 移動手段
        };
        directionsService.route(request, function(response,status) {
            if (status === google.maps.DirectionsStatus.OK) {
                new google.maps.DirectionsRenderer({
                    map: map,
                    directions: response,
                    suppressMarkers: true // デフォルトのマーカーを削除
                });

                console.log(response.routes[0].legs[0].steps);
            }
        });
    }
});
