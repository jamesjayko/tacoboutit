$(document).ready( initializeApp );

function initializeApp(){
    controller.getLocation();
}

//====================================================//
//==================== MODEL =========================//
//====================================================//


var model = {
    i: 0,
    map: null,
    infoWindow: null,
    resultsArr: null,
    searchLocation: null,
    service: null,
    getPlaceDetails: function() {
        var first = true;
        function scrapePlaceDetails() {
            model.service.getDetails({
                placeId: model.resultsArr[model.i].place_id,
            }, function(place, status) {
                model.resultsArr[model.i].simonsData = place;
                model.i++;
            });
        }
        var int = setInterval(function() {
            if (first) {
                first = false;
                scrapePlaceDetails();
            }
            else if (model.i > model.resultsArr.length - 1) {
                model.i = 0;
                clearInterval(int);
                view.initList();
            }
            else {
                scrapePlaceDetails();
            }
        }, 300);
    },
}






//====================================================//
//===================== VIEW =========================//
//====================================================//


var view = {
    initMap: function() {
        model.searchLocation = {lat: 33.6509, lng: -117.7441},
        model.map = new google.maps.Map(document.getElementById('map'), {
            center: model.searchLocation,
            zoom: 15,
        //     styles: [
        //         {
        //             featureType: "poi",
        //             elementType: "labels",
        //             stylers: [{ visibility: "off" }]
        //         },
        //         {
        //             featureType: "water",
        //             elementType: "geometry",
        //             stylers: [{ color: "#84C94B" }]
        //         },
        //         {
        //             featureType: "landscape",
        //             elementType: "geometry",
        //             stylers: [{ color: "#F4D16C" }]
        //         },
        //         {
        //             featureType: "road",
        //             elementType: "geometry",
        //             stylers: [{ color: "#AA6C2B" }]
        //         },
        //         {
        //             featureType: "transit",
        //             elementType: "geometry",
        //             stylers: [{ color: "#EE6C4B" }]
        //         },
        //         {
        //             featureType: "poi",
        //             elementType: "geometry",
        //             stylers: [{ color: "#F4D16C" }]
        //         }
        //     ]
        });

        model.infoWindow = new google.maps.InfoWindow();
        model.service = new google.maps.places.PlacesService(model.map);
        model.service.nearbySearch({
            location: model.searchLocation,
            radius: 1000,
            keyword: ['taco + restaurant'],
            // type: ['restaurant'],
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
            position: place.geometry.location,
            icon: "images/taco_marker.png",
            class: 'marker',
        });

        google.maps.event.addListener(marker, 'click', function() {
            model.infoWindow.setContent(place.name);
            model.infoWindow.open(model.map, this);
        });
    },
    initList: function() {
        for (var i=0; i<model.resultsArr.length; i++) {
            var newDiv = $('<div>').addClass('listItem');
            var imgContainer = $('<div>').addClass('imgContainer');
            if (model.resultsArr[i].hasOwnProperty('photos')) {
                var img = $('<img>').attr('src', model.resultsArr[i].simonsData.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})).addClass('image');
            } else {
                var img = $('<img>').attr('src', '#');
            }
            var name = $('<h2>').text(model.resultsArr[i].name).addClass('name');
            if (model.resultsArr[i].hasOwnProperty('rating')) {
                var rating = $('<div>').text(model.resultsArr[i].rating).addClass('rating');
            } else {
                var rating = $('<div>').text('not available').addClass('rating');
            }
            var phoneNumber = $('<h4>').text(model.resultsArr[i].simonsData.formatted_phone_number).addClass('phoneNumber');
            if (model.resultsArr[i].hasOwnProperty('opening_hours')) {
                if (model.resultsArr[i].opening_hours.open_now) {
                    var insert = 'Open';
                } else {
                    var insert = 'Closed';
                }
                var openQuery = $('<h4>').text(insert).addClass(insert.toLowerCase());
            }
            else {
                var openQuery = $('<h4>').text('not available');
            }
            var infoBtn = $('<button>').text('more info').addClass('infoBtn');
            $(imgContainer).append(img)
            $(newDiv).append(imgContainer, name, rating, phoneNumber, openQuery, infoBtn);
            $('.placesList').append(newDiv);
        }
    }
};


//====================================================//
//==================== CONTROLLER ====================//
//====================================================//


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
        view.initMap();
    }
};






