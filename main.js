$(document).ready( initializeApp );

function initializeApp(){
    // controller.getLocation();
    view.initiateClickHandlers();
    controller.getLocation();
}

//====================================================//
//==================== MODEL =========================//
//====================================================//



var model = {
    currentTaco: null,
    i: 0,
    map: null,
    infoWindow: null,
    resultsArr: null,
    searchLocation: null,
    service: null,

    setCurrentTaco: function(data){
        this.currentTaco = data;
    },
    factorTacoRecipe: function(recipe){
        var recipeArray = recipe.split('/n');
        console.log(recipeArray);
    },
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
    },
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
    loc: null,
    geocode: function() {
        $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + model.loc + '&key=AIzaSyDmBiq2uv9zLd2A1G5KwCbSaUYhMwO6mJg',
            method: 'get',
            dataType: 'json',
            success: function (success) {
                model.searchLocation = success.results[0].geometry.location;
                console.log(model.searchLocation);
                view.initMap();
            },
            error: function (error) {
                console.log(error);
            },
        })

    },
    handleZipcodeInput: function() {
        model.loc = $('#zipcodeSearch').val();
        model.geocode();
    }


};





//====================================================//
//===================== VIEW =========================//
//====================================================//


var view = {
    initiateClickHandlers: function(){
        $(".makeBtn").on('click', this.showRecipeModal );
        $(".findBtn").on('click', this.showSearchModal );
        $(".recipeModalReturn").on('click', this.hideRecipeModal );
        $(".searchModalReturn").on('click', this.hideSearchModal );
        $('.recipeModalGetNew').on('click', controller.createTacoRecipe.bind( controller ) );
        $('.zipcodeBtn').on('click', model.handleZipcodeInput)

    },
    showRecipeModal: function() {
        $(".recipeModalContainer").css("top", "0");
    },
    hideRecipeModal: function() {
        $(".recipeModalContainer").attr("style", "top: -100");
    },
    showSearchModal: function() {
        $(".searchModalContainer").css("top", "0");
    },
    hideSearchModal: function() {
        $(".searchModalContainer").attr("style", "top: -100");
    },
    initMap: function() {
        // model.searchLocation = {lat: 33.6509, lng: -117.7441};
        model.map = new google.maps.Map(document.getElementById('map'), {
            center: model.searchLocation,
            zoom: 15,
            // styles: [
            //     {
            //         featureType: "poi",
            //         elementType: "labels",
            //         stylers: [{ visibility: "off" }]
            //     },
            //     {
            //         featureType: "water",
            //         elementType: "geometry",
            //         stylers: [{ color: "#84C94B" }]
            //     },
            //     {
            //         featureType: "landscape",
            //         elementType: "geometry",
            //         stylers: [{ color: "#F4D16C" }]
            //     },
            //     {
            //         featureType: "road",
            //         elementType: "geometry",
            //         stylers: [{ color: "#AA6C2B" }]
            //     },
            //     {
            //         featureType: "transit",
            //         elementType: "geometry",
            //         stylers: [{ color: "#EE6C4B" }]
            //     },
            //     {
            //         featureType: "poi",
            //         elementType: "geometry",
            //         stylers: [{ color: "#F4D16C" }]
            //     }
            // ]
        });

        model.infoWindow = new google.maps.InfoWindow();
        model.service = new google.maps.places.PlacesService(model.map);
        model.service.nearbySearch({
            location: model.searchLocation,
            radius: 1000,
            keyword: ('taco+mexican'),
            type: ('restaurant'),
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
            icon: "images/taco_purp_marker.png",
            class: 'marker',
        });

        google.maps.event.addListener(marker, 'click', function() {
            model.infoWindow.setContent(place.name);
            model.infoWindow.open(model.map, this);
        });
    },
    changeRecipeModalHeader: function(headerText) {
        $('.recipeName h2').text(headerText);
    },
    appendImg: function(ele, imgLink) {
        ele.attr('src', imgLink);
    },
    changeRecipeModalText: function(text){
        $('.recipeText').text(text);
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
    },
    createTacoRecipe: function(){
        var getTacoOptions = {
            dataType: 'json',
            method: 'get',
            data: {

            },
            url: 'http://taco-randomizer.herokuapp.com/random/?full-taco=true',
        };

        $.ajax(getTacoOptions).then( controller.tacoDataObtained.bind(this) )
    },

    tacoDataObtained: function(data) {
        model.setCurrentTaco(data);
        let tacoName = this.getSpecificTacoName(data.name);

        view.changeRecipeModalHeader(tacoName);
        model.imgAPICall(tacoName, $('img'));
        view.changeRecipeModalText(data.recipe);
    },

    getSpecificTacoName: function(longName){
        let endPoint = longName.indexOf(',');
        if (endPoint === -1){
            return longName;
        }
        let shortName = longName.substr(0, endPoint) + ' Tacos';
        return shortName;
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