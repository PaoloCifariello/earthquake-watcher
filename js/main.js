/* initialization when Gmaps is loaded */
function initMap() {
    /* Initialize Map object */
    let zoom = 2,
        center = {
            lat: 41.850,
            lng: -87.650
        };
    window.map = new Map(zoom, center);
    map.initializeMap();
    /* refresh list when bounds change, also set handler for green marker */
    map.on('bounds_changed', () => {
        let visibleEarthquakes = map.getVisibleEarthquakes();
        $('#list-panel').empty();
        $.each(visibleEarthquakes, (i, earthquake) => {
            let listElement = getListElement(earthquake);
            listElement.click(() => {
                let position = earthquake.getGeometry().get(),
                    dataLayer = map._map.data;

                map._selectedFeature = earthquake;
                dataLayer.revertStyle();
                dataLayer.overrideStyle(earthquake, {
                    icon: '/src/assets/selected-feature.png'
                });
            });
            $('#list-panel').append(listElement);
        });
    });
    /*  */
    $(function () {
        function cb(start, end) {
            $('#reportrange span').html(start.format('D MMMM, YYYY') + ' - ' + end.format('D MMMM, YYYY'));
        }
        cb(moment(), moment());
        /* Date range picker initialization */
        $('#reportrange').daterangepicker({
            ranges: {
                'Today': [moment(), moment().add(1, 'days')],
                'Yesterday': [moment().subtract(1, 'days'), moment()],
                'Last 7 Days': [moment().subtract(7, 'days'), moment()]
            }
        }, cb);
        /* callback when date range changes */
        $('#reportrange').on('apply.daterangepicker', function (ev, picker) {
            fetcher.fetchData({
                starttime: picker.startDate.format('YYYY-MM-DD'),
                endtime: picker.endDate.format('YYYY-MM-DD')
            }).then((data) => {
                /* GeoJSON object, type: FeatureCollection */
                map.setData(data);
            });
        });
    });
    /* initialize fetcher and fetch starting data */
    window.fetcher = new Fetcher(); //new Proxy()); //new Proxy());
    fetcher.fetchData({
        starttime: moment().format('YYYY-MM-DD'),
        endtime: moment().add(1, 'days').format('YYYY-MM-DD')
    }).then((data) => {
        /* GeoJSON object, type: FeatureCollection */
        map.setData(data);
    });
}


/* earthquake info for list */
function getListElement(earthquake) {
    return $('<a href="#" class="list-group-item"> ' + earthquake.getId() + '<br>Magnitude ' + earthquake.getProperty('mag') + '<br>Date ' + moment.unix(earthquake.getProperty('time') / 1000).format('DD-MM-DD') + '</a>');
}

/* set handler for visualization type -> list */
$(function () {
    $('div#radio-options input').change(() => {
        let visualizationType = $('div#radio-options input:checked').val();
        map.setVisualizationType(visualizationType);
    });
});

/* SLIDER initialization */
$(function () {
    $("#magnitude-range").slider({});
});