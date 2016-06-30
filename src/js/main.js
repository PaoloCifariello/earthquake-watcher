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