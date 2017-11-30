$(document).ready( initializeApp );

function initializeApp(){
    // controller.getLocation();
}

//====================================================//
//==================== MODEL =========================//
//====================================================//


var model = {
    currentTaco: null,
    map: null,
    infoWindow: null,
    resultsArr: null,
    searchLocation: null,
    setCurrentTaco: function(data){
        this.currentTaco = data;
    },
    factorTacoRecipe: function(recipe){
        var recipeArray = recipe.split('/n');
        console.log(recipeArray);
    },
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
    changeRecipeModalHeader: function(headerText){
        $('.recipeName h2').text(headerText);
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
    createTacoRecipe: function(){
        var getTacoOptions = {
            dataType: 'json',
                method: 'get',
                data: {

            },
            url: 'http://taco-randomizer.herokuapp.com/random/?full-taco=true',
        };

        $.ajax(getTacoOptions).then( controller.tacoDataObtained.bind(model) )
    },
    tacoDataObtained: function(data){
        model.setCurrentTaco(data);
        model.factorTacoRecipe(data.recipe);

        view.changeRecipeModalHeader(data.name);

        let tacoRecipe = data.recipe;
        console.log(tacoRecipe)
    }
};






