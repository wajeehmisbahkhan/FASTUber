// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow;
function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 24.8607, lng: 67.0011},
    zoom: 12
});
infoWindow = new google.maps.InfoWindow;

// Try HTML5 geolocation.
navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    infoWindow.setPosition(pos);
    infoWindow.setContent('You are here.');
    infoWindow.open(map);
    map.setCenter(pos);
}, function(error) {
    showError(error.code, error.message);
    handleLocationError(infoWindow, map.getCenter());
});
}

function handleLocationError(infoWindow, pos) {
infoWindow.setPosition(pos);
infoWindow.setContent('Error: The Geolocation service failed.');
infoWindow.open(map);
}