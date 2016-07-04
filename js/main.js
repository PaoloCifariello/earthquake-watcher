var currentData = [];
var markers = [];

function initMap() {
    let zoom = 2
        , center = {
            lat: 41.850
            , lng: -87.650
        };
    window.map = new Map(zoom, center);
    map.initializeMap();
    map.on('bounds_changed', () => {
        let visibleEarthquakes = map.getVisibleEarthquakes();
        $('#list-panel').empty();
        $.each(visibleEarthquakes, (i, earthquake) => {
            let listElement = getListElement(earthquake);
            listElement.click(() => {
                let position = earthquake.getGeometry().get();
                map._selectedFeature = earthquake;
                map.refresh();
            });
            $('#list-panel').append(listElement);
        });
    });
    $(function () {
        function cb(start, end) {
            $('#reportrange span').html(start.format('D MMMM, YYYY') + ' - ' + end.format('D MMMM, YYYY'));
        }
        cb(moment(), moment());
        $('#reportrange').daterangepicker({
            ranges: {
                'Today': [moment(), moment()]
                , 'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')]
                , 'Last 7 Days': [moment().subtract(6, 'days'), moment()]
                , 'Last 30 Days': [moment().subtract(29, 'days'), moment()]
                , 'This Month': [moment().startOf('month'), moment().endOf('month')]
                , 'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);
        $('#reportrange').on('apply.daterangepicker', function (ev, picker) {
            fetcher.fetchData({
                starttime: picker.startDate.format('YYYY-MM-DD')
                , endtime: picker.endDate.format('YYYY-MM-DD')
            }).then((data) => {
                /* GeoJSON object, type: FeatureCollection */
                map.setData(data);
            });
        });
    });
    // Set mouseover event for each feature.
    //    map.data.addListener('mouseover', function(event) {
    //        console.log(event);
    //    });
    //    
    //    fetchEarthquakes();
    window.fetcher = new Fetcher(); //new Proxy());
    fetcher.fetchData({
        starttime: '2016-01-01'
        , endtime: '2016-01-02'
    }).then((data) => {
        /* GeoJSON object, type: FeatureCollection */
        map.setData(data);
    });
}

function getListElement(earthquake) {
    return $('<a href="#" class="list-group-item"> ' + earthquake.getId() + '<br>Magnitude ' + earthquake.getProperty('mag') + '</a>');
}
$(function () {
    $('div#radio-options input').change(() => {
        let visualizationType = $('div#radio-options input:checked').val();
        map.setVisualizationType(visualizationType);
    });
});