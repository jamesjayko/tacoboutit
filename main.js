var model = {
    map: null,
    infoWindow: null,
    resultsArr: null,
    searchLocation: null,
}

var view = {
        initMap: function() {
            model.map = new google.maps.Map(document.getElementById('map'), {
                center: model.searchLocation,
                zoom: 15
            });

            model.infoWindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(model.map);
            service.nearbySearch({
                location: model.searchLocation,
                radius: 1000,
                keyword: ['taco'],
                type: ['restaurant'],
            }, view.callback);
        },
        callback: function(results, status) {
            model.resultsArr = results;
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    view.createMarker(results[i]);
                }
            }
        },
        createMarker: function createMarker(place) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: model.map,
                position: place.geometry.location
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(place.name);
                infowindow.open(model.map, this);
            });
        }
}


var controller = {
        getLocation: function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(controller.showPosition);
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        },
        showPosition: function showPosition(position) {
            model.searchLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
            console.log(model.searchLocation);
            view.initMap();
}

};

controller.getLocation();