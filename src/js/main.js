$(function () {
    window.EQ = {
        /* Shows debug information */
        debug: false,
        /* Allows to choose data source
         *
         * 'empty' -> no data found for each filter option specified, 
         * 'test' -> test data, same data is returned for each filter option specified, 
         * 'real' -> real data, data returned are real ones
         */
        proxy: 'real',
        /* Will contain main objects */
        map: null,
        graphManager: new GraphManager(),
        /* Simple configurable logger, able to show console messages depending on LogLevel specified */
        logger: new Logger(Logger.LogLevel.debug)
    };

    EQ.logger.debug('EQ initialized', EQ.debug ? 'in dev mode' : undefined);
    EQ.logger.debug('Visualization type initialization');
    /* set handler for visualization type -> list */
    $('div#radio-options input').change(() => EQ.map.setVisualizationType($('div#radio-options input:checked').val()));

    EQ.logger.debug('Magnitude range initialization');
    /* slider initialization */
    $("#magnitude-range")
        .slider({})
        .on('slideStop', (evt) => {
            EQ.logger.info('New magnitude range', evt.value[0], '-', evt.value[1]);
            EQ.map.fetcher
                .set('minmagnitude', evt.value[0])
                .set('maxmagnitude', evt.value[1]);
            EQ.map.refreshData();
        });


    /* Date range picker initialization */
    function cb(start, end) {
        $('#reportrange span').html(start.format('D MMMM, YYYY') + ' - ' + end.format('D MMMM, YYYY'));
    }
    cb(moment(), moment());
    /* Date range picker initialization */
    $('#reportrange').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(7, 'days'), moment()]
        }
    }, cb);

    /* callback when date range changes */
    $('#reportrange').on('apply.daterangepicker', function (ev, picker) {
        EQ.logger.info('New date range', picker.startDate, '-', picker.endDate);
        EQ.map.fetcher
            .set('starttime', picker.startDate.format('YYYY-MM-DD') + ' 00:00:00')
            .set('endtime', picker.endDate.format('YYYY-MM-DD') + ' 23:59:59');
        EQ.map.refreshData();
    });

    $('#show-timeline').click(() => EQ.graphManager.drawGraph(EQ.map._visibleEarthquakes));

    /* heatmap legend tooltip */
    $('[data-toggle="tooltip"]').tooltip();
});

/* initialization when Gmaps is loaded */
function initMap() {
    /* Initialize Map object */
    let zoom = 2,
        center = {
            lat: 41.850,
            lng: -87.650
        };

    EQ.logger.debug('Map initialization');
    EQ.map = new EarthquakeMap(zoom, center);
    EQ.map.initializeMap();

    /* first time fetch */
    EQ.map.refreshData();

}