var currentData = [];
var markers = [];

function initMap() {
    let zoom = 2,
        center = {lat: 41.850, lng: -87.650};
    
    window.map = new Map(zoom, center);
    map.initializeMap();
    
    // Set mouseover event for each feature.
//    map.data.addListener('mouseover', function(event) {
//        console.log(event);
//    });
//    
//    fetchEarthquakes();
    let fetcher = new Fetcher();
    
    fetcher.fetchData({
        starttime: '2016-01-01',
        endtime: '2016-01-02'
    }).then((data) => {
        /* GeoJSON object, type: FeatureCollection */
        map.setData(data);
    });
}

$(function() {
    $('div#radio-options input').change(() => {
        let visualizationType = $('div#radio-options input:checked').val();
        map.setVisualizationType(visualizationType);
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
    });
}

function addEarthquakeToMap(earthquake) {

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