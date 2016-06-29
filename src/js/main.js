var key = "AIzaSyA8ZRDLlXMbLuF_N9xBekj2lUQjUSeX4p8";
var map;
var currentData = [];
var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: {lat: 41.850, lng: -87.650},
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });
    
    // Set mouseover event for each feature.
//    map.data.addListener('mouseover', function(event) {
//        console.log(event);
//    });
//    
//    fetchEarthquakes();
}

$(function() {
    $('#show-markers-option').change(function() {
        let mapToSet = null;
        if ($(event.target).prop('checked'))
            mapToSet = map;
        
        $.each(markers, (i, marker) => {
            marker.setMap(mapToSet);
        });
    });
});

function fetchEarthquakes() {
    var dataPromise = $.getJSON( "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2016-01-01&endtime=2016-01-02");
    dataPromise.then(function(data) {
//                var heatmapData = [];
//    for (var i = 0; i < results.features.length; i++) {
//      var coords = results.features[i].geometry.coordinates;
//      var latLng = new google.maps.LatLng(coords[1], coords[0]);
//      var magnitude = results.features[i].properties.mag;
//      var weightedLoc = {
//        location: latLng,
//        weight: Math.pow(2, magnitude)
//      };
//      heatmapData.push(weightedLoc);
//    }
//    var heatmap = new google.maps.visualization.HeatmapLayer({
//      data: heatmapData,
//      dissipating: false,
//      map: map
//    });
        $.each(data.features, function(i, earthquake) {
            addEarthquakeToMap(earthquake);
        });
    });
}

function addEarthquakeToMap(earthquake) {
    let coordinates = earthquake.geometry.coordinates,
        latLng = new google.maps.LatLng(coordinates[1],coordinates[0]);
    
    var marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
    marker.addListener('click', function() {
        debugger;
        //infowindow.open(marker.get('map'), marker);
    });
    markers.push(marker);
    
    

//    var cityCircle = new google.maps.Circle({
//      strokeColor: '#FF0000',
//      strokeOpacity: 0.8,
//      strokeWeight: 2,
//      fillColor: '#FF0000',
//      fillOpacity: 0.35,
//      map: map,
//      center: citymap[city].center,
//      radius: Math.sqrt(citymap[city].population) * 100
//    });
}