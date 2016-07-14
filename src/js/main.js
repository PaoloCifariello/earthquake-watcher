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
    map.on('bounds_changed', refreshEarthquakesList);
    map.refreshData();

    /* Date range picker */
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
            map.fetcher
                .set('starttime', picker.startDate.format('YYYY-MM-DD'))
                .set('endtime', picker.endDate.format('YYYY-MM-DD'));
            map.refreshData();
        });
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
    $("#magnitude-range")
        .slider({})
        .on('slideStop', (evt) => {
            map.fetcher
                .set('minmagnitude', evt.value[0])
                .set('maxmagnitude', evt.value[1]);
            map.refreshData();

        });
});


/* called to refresh the list of eq.kes */
function refreshEarthquakesList() {
    let visibleEarthquakes = map.getVisibleEarthquakes();
    $('#list-panel').empty();
    $.each(visibleEarthquakes, (i, earthquake) => {
        let listElement = getListElement(earthquake);
        listElement.click(() => {
            let dataLayer = map._map.data;

            map._selectedFeature = earthquake;
            dataLayer.revertStyle();
            dataLayer.overrideStyle(earthquake, {
                icon: '/src/assets/selected-feature.png'
            });
        });
        $('#list-panel').append(listElement);
    });
}