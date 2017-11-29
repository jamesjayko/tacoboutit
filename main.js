// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infowindow;

function initMap() {
  var irvine = { lat: 33.6846, lng: -117.8265 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: irvine,
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

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(
    {
      location: irvine,
      radius: 1000,
      type: ["restaurant"]
    },
    callback
  );
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: "images/taco_marker.png"
  });

  google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}
