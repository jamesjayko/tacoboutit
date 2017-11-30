$(document).ready(initializeApp);


function initializeApp() {
    view.initiateClickHandlers();
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

    setCurrentTaco: function(data) {
        this.currentTaco = data;
    },
    imgAPICall: function(query, ele) {
        var ajaxOptions = {
            url: "https://www.googleapis.com/customsearch/v1",
            method: "GET",
            dataType: "JSON",
            data: {
                q: query,
                cx: "000707611873255015719:e0z9hyzysu4",
                searchType: "image",
                key: "AIzaSyBQWFoSuCzyIqJj0Kiyc_QEgPUcucNhImM"
            },
            error: function(data) {
                console.log(data);
            }
        };

        $.ajax(ajaxOptions).then(controller.tacoFilter.bind(null, ele));
    },
    getPlaceDetails: function() {
        var first = true;
        function scrapePlaceDetails() {
            model.service.getDetails(
                {
                    placeId: model.resultsArr[model.i].place_id,
                },
                function(place, status) {
                    console.log(place);
                    model.resultsArr[model.i].simonsData = place;
                    if (model.i === model.resultsArr.length - 1) {
                        clearInterval(int);
                        view.initList();
                    }
                }
            );
        }
        var int = setInterval(function() {
            model.i++;
            if (first) {
                first = false;
                model.i = 0;
                scrapePlaceDetails();
            } else if (model.i > model.resultsArr.length - 1) {
                model.i = 0;

            } else {
                scrapePlaceDetails();
            }
        }, 500);
    },
    loc: null,
    searchRadius: 1200,
    geocode: function() {
        $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + model.loc + '&key=AIzaSyDmBiq2uv9zLd2A1G5KwCbSaUYhMwO6mJg',
            method: 'get',
            cache: false,
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
        if ($('#searchRadiusInput').val() !== '') {
            model.searchRadius = Number($('#searchRadiusInput').val());
        }
        if ($('#zipcodeSearch').val() !== '') {
            model.loc = $('#zipcodeSearch').val();
            model.geocode();
        } else {
            view.initMap()
        }
        $('.placesList  div').remove();
    }


};


//====================================================//
//===================== VIEW =========================//
//====================================================//

var view = {
    initiateClickHandlers: function () {
        $(".makeBtn").on("click", this.showRecipeModal);
        $(".findBtn").on("click", controller.loadSearchTacoModal.bind(controller));
        $(".recipeModalReturn").on("click", this.hideRecipeModal);
        $(".searchModalReturn").on("click", this.hideSearchModal);
        $(".recipeModalGetNew").on("click", controller.createTacoRecipe.bind(controller));
        $('.zipcodeBtn').on('click', model.handleZipcodeInput);
    },
    showRecipeModal: function () {
        $(".recipeModalContainer").css("top", "0");
    },
    hideRecipeModal: function () {
        $(".recipeModalContainer").attr("style", "top: -100");
    },
    showSearchModal: function () {
        $(".searchModalContainer").css("top", "0");
    },
    hideSearchModal: function () {
        $(".searchModalContainer").attr("style", "top: -100");
    },
    initMap: function () {
        // model.searchLocation = {lat: 33.6509, lng: -117.7441};
        model.map = new google.maps.Map(document.getElementById('map'), {
            center: model.searchLocation,
            zoom: 12,
            gestureHandling: 'greedy'
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
            radius: model.searchRadius,
            keyword: ('taco+mexican'),
            type: ('restaurant'),
        }, view.callback);
    },
    callback: function (results, status) {
        model.resultsArr = results;
        model.getPlaceDetails();
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
            class: "marker"
        });

        google.maps.event.addListener(marker, "click", function () {
            model.infoWindow.setContent(place.name);
            model.infoWindow.open(model.map, this);
        });
    },
    changeRecipeModalHeader: function (headerText) {
        $(".recipeName h2").text(headerText);
    },
    appendImg: function (ele, imgLink) {
        ele.attr("src", imgLink);
    },
    changeRecipeModalText: function (text) {
        $(".recipeText").html(text);
    },
    initList: function () {
        console.log(model.resultsArr);
        for (var i = 0; i < model.resultsArr.length; i++) {
            var elementsList = [];

            var newDiv = $('<div>').addClass('listItem');

            if (model.resultsArr[i].hasOwnProperty('photos')) {
                var imgContainer = $('<div>').addClass('imgContainer');
                var img = $('<img>').attr('src', model.resultsArr[i].photos[0].getUrl({
                    'maxWidth': 100,
                    'maxHeight': 100
                })).addClass('image');
                imgContainer.append(img);
                elementsList.push(imgContainer)
            }

            var name = $('<h2>').text(model.resultsArr[i].name).addClass('name');
            elementsList.push(name);

            if (model.resultsArr[i].hasOwnProperty('rating')) {
                var rating = $('<div>').text(model.resultsArr[i].rating).addClass('rating');
                elementsList.push(rating)
            }

            if (model.resultsArr[i].simonsData.hasOwnProperty('formatted_phone_number')) {
                var phoneNumber = $('<h4>').text(model.resultsArr[i].simonsData.formatted_phone_number).addClass('phoneNumber');
                elementsList.push(phoneNumber);
            }

            if (model.resultsArr[i].hasOwnProperty('opening_hours')) {
                if (model.resultsArr[i].opening_hours.open_now) {
                    var insert = 'Open';
                } else {
                    var insert = 'Closed';
                }
                var openQuery = $('<h4>').text(insert).addClass(insert.toLowerCase());
                elementsList.push(openQuery)
            }
            if (elementsList.length > 1) {
                $(newDiv).append(elementsList);
                $('.placesList').append(newDiv);
            }

        }
    },
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
        model.searchLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        view.initMap();
    },
    createTacoRecipe: function() {
        var getTacoOptions = {
            dataType: "json",
            method: "get",
            url: "http://taco-randomizer.herokuapp.com/random/?full-taco=true"
        };

        $.ajax(getTacoOptions).then(controller.tacoDataObtained.bind(this));
    },
    createTacoRecipe: function(){
        var getTacoOptions = {
            dataType: 'json',
            method: 'get',
            url: 'http://taco-randomizer.herokuapp.com/random/?full-taco=true',
        };

        $.ajax(getTacoOptions).then( controller.tacoDataObtained.bind(this) )
    },

    tacoDataObtained: function(data) {
        model.setCurrentTaco(data);
        let tacoName = this.getSpecificTacoName(data.name);
        let gleanedRecipe = data.recipe.replace(/[#*-=]|\./g,'');
        gleanedRecipe = gleanedRecipe.split('\n');

        view.changeRecipeModalHeader(tacoName);
        // model.imgAPICall(tacoName, $("img"));
        view.changeRecipeModalText(gleanedRecipe);
    },

    getSpecificTacoName: function(longName) {
        let endPoint = longName.indexOf(",");
        if (endPoint === -1) {
            return longName;
        }
        let shortName = longName.substr(0, endPoint) + " Tacos";
        return shortName;
    },

    tacoFilter: function(ele, data) {
        var qArray = data.items;

        for (var qI = 0; qI < qArray.length; qI++) {
            if (qArray[qI].title.indexOf("aco") !== -1) {
                view.appendImg(ele, qArray[qI].link);
                return qArray[qI].link;
            }
        }
    },

    loadSearchTacoModal: function(){
        this.getLocation();
        view.showSearchModal();
    }
};