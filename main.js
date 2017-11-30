$(document).ready( initializeApp );

function initializeApp(){
    // controller.getLocation();
}

//====================================================//
//==================== MODEL =========================//
//====================================================//


var model = {
    map: null,
    infoWindow: null,
    resultsArr: null,
    searchLocation: null,

    imgAPICall: function(query, ele) {
        var ajaxOptions = {
            url: 'https://www.googleapis.com/customsearch/v1',
            method: "GET",
            dataType: "JSON",
            data: {
                q: query,
                cx: '000707611873255015719:e0z9hyzysu4',
                searchType: 'image',
                key: 'AIzaSyBQWFoSuCzyIqJj0Kiyc_QEgPUcucNhImM'
            },
            error: function(data) {
                console.log(data);
            }
        };

    $.ajax(ajaxOptions).then(controller.tacoFilter.bind(null, ele))
    }


};


//====================================================//
//===================== VIEW =========================//
//====================================================//


var view = {
    initMap: function() {
        model.map = new google.maps.Map(document.getElementById('map'), {
            center: model.searchLocation,
            zoom: 15,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#84C94B" }]
                },
                {
                    featureType: "landscape",
                    elementType: "geometry",
                    stylers: [{ color: "#F4D16C" }]
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#AA6C2B" }]
                },
                {
                    featureType: "transit",
                    elementType: "geometry",
                    stylers: [{ color: "#EE6C4B" }]
                },
                {
                    featureType: "poi",
                    elementType: "geometry",
                    stylers: [{ color: "#F4D16C" }]
                }
            ]
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
            position: place.geometry.location,
            icon: "images/taco_marker.png"
        });

        google.maps.event.addListener(marker, 'click', function() {
            model.infoWindow.setContent(place.name);
            model.infoWindow.open(model.map, this);
        });
    },

    appendImg: function(ele, imgLink) {
        ele.attr('src', imgLink);
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
        console.log(model.searchLocation);
        view.initMap();
    },

    tacoFilter: function(ele, data) {
        var qArray = data.items;

        for(var qI = 0; qI < qArray.length; qI++) {

            if(qArray[qI].title.indexOf("aco") !== -1) {
                view.appendImg(ele, qArray[qI].link);
                return qArray[qI].link;
            }
        }
    }
};






