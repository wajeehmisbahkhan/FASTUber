// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map;
function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 24.8607, lng: 67.0011},
    zoom: 16,
    disableDefaultUI: true
});

//HTML5 geolocation + Cordova Plugin
navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    map.setCenter(pos);

    //User
    var userMarker = new google.maps.Marker({
        position: pos,
        map: map
    });
    //Drivers near you
    var driverMarkers = [];
    //TODO: Pull from server
    driverMarkers.push(new google.maps.Marker({
        position: {lat: pos.lat + 0.001, lng: pos.lng + 0.001},
        map: map,
        icon: './img/driver_icon.png'
    }));
    driverMarkers.push(new google.maps.Marker({
        position: {lat: pos.lat - 0.001, lng: pos.lng - 0.001},
        map: map,
        icon: './img/driver_icon.png'
    }));

    //Add info window on each driver marker
    for (var i = 0; i < driverMarkers.length; i++) {
        //TODO: Pull info from server
        var infoWindow = new google.maps.InfoWindow({
            content: '<h4>Captain Mohsin</h4>'
                    + '<p>I only pickup freshies ;)</p>'
                    + '<a href="#">See profile</a>'
        });
        driverMarkers[i].addListener('click', function () {
            infoWindow.open(map, this);
        });
    }

}, function(error) {
    showError(error.code, error.message);
});

}