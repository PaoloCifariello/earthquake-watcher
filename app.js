(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Proxy = require('./Proxy');

var _Proxy2 = _interopRequireDefault(_Proxy);

var Fetcher = (function () {
    function Fetcher() {
        _classCallCheck(this, Fetcher);

        this._proxy = new _Proxy2['default']();
        this._options = {
            starttime: moment().format('YYYY-MM-DD'),
            endtime: moment().add(1, 'days').format('YYYY-MM-DD')
        };

        this._url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=earthquake&orderby=magnitude";
    }

    _createClass(Fetcher, [{
        key: 'fetchData',
        value: function fetchData() {
            EQ.logger.info('Fetching new data from', EQ.proxy);
            var promiseToReturn = null;
            switch (EQ.proxy) {
                case 'test':
                    {
                        promiseToReturn = this._proxy.getTestData();
                        break;
                    }
                case 'real':
                    {
                        $('#loading-window').show();
                        promiseToReturn = this._getFromAPI();
                        break;
                    }
                case 'empty':
                default:
                    {
                        promiseToReturn = this._proxy.getEmptyData();
                        break;
                    }
            }

            return promiseToReturn;
        }
    }, {
        key: 'set',
        value: function set(dataKey, data) {
            this._options[dataKey] = data;
            return this;
        }
    }, {
        key: '_getFromAPI',
        value: function _getFromAPI() {
            var url = this._url;
            $.each(this._options, function (key, value) {
                url += '&' + key + '=' + value;
            });
            return $.getJSON(url).then(function (data) {
                $('#loading-window').hide();
                return data;
            });
        }
    }]);

    return Fetcher;
})();

exports['default'] = Fetcher;
module.exports = exports['default'];

},{"./Proxy":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Proxy = (function () {
    function Proxy() {
        _classCallCheck(this, Proxy);

        this._data = null;
        this._emptyData = null;
    }

    _createClass(Proxy, [{
        key: 'getTestData',
        value: function getTestData() {
            var _this = this;

            return this._data ? new Promise(function (resolve, reject) {
                resolve(_this._data);
            }) : $.getJSON('assets/proxy-data.json').then(function (data) {
                _this._data = data;
                return data;
            });
        }
    }, {
        key: 'getEmptyData',
        value: function getEmptyData() {
            var _this2 = this;

            return this._emptyData ? new Promise(function (resolve, reject) {
                resolve(_this2._emptyData);
            }) : $.getJSON('assets/proxy-emptydata.json').then(function (data) {
                _this2._emptyData = data;
                return data;
            });
        }
    }]);

    return Proxy;
})();

exports['default'] = Proxy;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var GraphManager = (function () {
    function GraphManager() {
        _classCallCheck(this, GraphManager);
    }

    _createClass(GraphManager, [{
        key: 'drawGraph',
        value: function drawGraph(visibleEarthquakes) {
            var _this = this;

            var data = this._normalizeData(visibleEarthquakes);
            $('#chart-svg').empty();

            nv.addGraph(function () {
                EQ.logger.info('Creating new graph');
                var chart = nv.models.scatterChart().useVoronoi(true).color(d3.scale.category10().range()).duration(300);

                chart.scatter.pointDomain([0, 10]);

                chart.noData("No data to display");
                chart.tooltip.contentGenerator(function (data) {
                    return _this._getTooltip(data);
                });
                //chart.dispatch.on('renderEnd', function () {});

                EQ.logger.debug('Axis configuration');
                /* X axis */
                chart.showXAxis(true);
                chart.xAxis.tickFormat(function (d) {
                    return moment.unix(d).format('DD-MM, HH:MM');
                });
                chart.xAxis.showMaxMin(false);
                var dateRangePicker = $('#reportrange').data('daterangepicker'),
                    startDate = moment(dateRangePicker.startDate).unix(),
                    endDate = moment(dateRangePicker.endDate).unix();

                chart.forceX([startDate, endDate]);

                /* Y axis */
                chart.forceY([0, 10]);
                chart.yAxis.tickFormat(d3.format('.02f'));

                d3.select('#chart-svg').datum(data).call(chart);

                nv.utils.windowResize(chart.update);

                chart.dispatch.on('stateChange', function (e) {
                    'New State:', JSON.stringify(e);
                });

                _this._chart = chart;
                setTimeout(_this._chart.update, 500);

                EQ.logger.info('New graph created');
                return chart;
            });
        }
    }, {
        key: '_getTooltip',
        value: function _getTooltip(data) {
            var earthquake = data.point.earthquake,
                title = earthquake.getProperty('title'),
                date = moment(earthquake.getProperty('time')).format('D-M-YYYY HH:mm'),
                point = earthquake.getGeometry().get(),
                latitude = point.lat(),
                longitude = point.lng(),
                magnitude = earthquake.getProperty('mag'),
                plate = data.series[0].key;

            var tooltip = $('<div><b>' + title + '</b><br>' + plate + '</br>' + 'Position: ' + EQ.map.convertCoordinates(latitude, longitude) + '<br>' + 'Magnitude: ' + magnitude + '<br>' + 'Date: ' + date + '<br></div>');

            EQ.logger.debug('Tooltip for', earthquake.getId());
            return tooltip.html();
        }
    }, {
        key: '_normalizeData',
        value: function _normalizeData(visibleEarthquakes) {
            var platesData = {},
                random = d3.random.normal();

            EQ.logger.debug('Normalizing', visibleEarthquakes.length, 'data');
            $.each(visibleEarthquakes, function (i, earthquake) {
                var point = earthquake.getGeometry().get(),
                    plates = EQ.map._tectonicsLayer.getPlateByPoint(point),
                    plateIdentifier = plates.inside[0] || plates.near[0],
                    magnitude = earthquake.getProperty('mag') || 0,
                    time = moment(earthquake.getProperty('time')).unix(),
                    plateEarthquakes = platesData[plateIdentifier] || [];

                plateEarthquakes.push({
                    x: time,
                    y: magnitude,
                    size: magnitude, //Configure the size of each scatter point
                    shape: "circle", //Configure the shape of each scatter point.
                    earthquake: earthquake
                });

                platesData[plateIdentifier] = plateEarthquakes;
            });

            var data = [];

            $.each(platesData, function (plateName, plateValues) {
                data.push({
                    key: plateName,
                    values: plateValues
                });
            });
            EQ.logger.debug(visibleEarthquakes.length, 'data normalized');

            return data;
        }
    }]);

    return GraphManager;
})();

exports['default'] = GraphManager;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mapEarthquakeMap = require('./map/EarthquakeMap');

var _mapEarthquakeMap2 = _interopRequireDefault(_mapEarthquakeMap);

var _graphGraphManager = require('./graph/GraphManager');

var _graphGraphManager2 = _interopRequireDefault(_graphGraphManager);

var _utilLogger = require('./util/Logger');

var _utilLogger2 = _interopRequireDefault(_utilLogger);

window.EQ = {
    /* Initialization function */
    initialize: _initialize,
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
    graphManager: new _graphGraphManager2['default'](),
    /* Simple configurable logger, able to show console messages depending on LogLevel specified */
    logger: new _utilLogger2['default'](_utilLogger2['default'].LogLevel.debug)
};

/* initialization when Gmaps is loaded */
/* initialization can start when G maps API and document are fully loaded */
function _initialize() {
    $(function () {

        /* Initialize Map object */
        var zoom = 2,
            center = {
            lat: 41.850,
            lng: -87.650
        };

        EQ.logger.debug('Map initialization');
        EQ.map = new _mapEarthquakeMap2['default'](zoom, center);
        EQ.map.initializeMap();

        /* first time data fetch */
        EQ.map.refreshData();

        EQ.logger.debug('EQ initialized', EQ.debug ? ' in dev mode' : undefined);
        EQ.logger.debug('Visualization type initialization');
        /* set handler for visualization type -> list */
        $('div#radio-options input').change(function () {
            return EQ.map.setVisualizationType($('div#radio-options input:checked').val());
        });

        EQ.logger.debug('Magnitude range initialization');
        /* slider initialization */
        $("#magnitude-range").slider({}).on('slideStop', function (evt) {
            EQ.logger.info('New magnitude range', evt.value[0], '-', evt.value[1]);
            EQ.map.fetcher.set('minmagnitude', evt.value[0]).set('maxmagnitude', evt.value[1]);
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
            EQ.map.fetcher.set('starttime', picker.startDate.format('YYYY-MM-DD') + ' 00:00:00').set('endtime', picker.endDate.format('YYYY-MM-DD') + ' 23:59:59');
            EQ.map.refreshData();
        });

        /* graph manager initialization */
        $('#show-timeline').click(function () {
            return EQ.graphManager.drawGraph(EQ.map._visibleEarthquakes);
        });

        /* heatmap legend tooltip */
        $('[data-toggle="tooltip"]').tooltip();
    });
}

},{"./graph/GraphManager":3,"./map/EarthquakeMap":6,"./util/Logger":10}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CircleLayer = (function () {
    function CircleLayer(map) {
        _classCallCheck(this, CircleLayer);

        this._map = map;
        this._layer = new google.maps.Data({
            map: map
        });
        this._initialize();
    }

    _createClass(CircleLayer, [{
        key: '_initialize',
        value: function _initialize() {
            var _this = this;

            this._layer.setStyle(function (earthquake) {
                return _this._getCircleStyle(earthquake);
            });
            this._paletteScale = d3.scale.quantize().domain([0, 10]).range(colorbrewer.YlOrRd[6]);
        }
    }, {
        key: 'addData',
        value: function addData(data) {
            return this._layer.addGeoJson(data);
        }
    }, {
        key: 'setSelected',
        value: function setSelected(earthquakeId) {}
    }, {
        key: 'empty',
        value: function empty() {
            var dataLayer = this._layer;
            dataLayer.forEach(function (feature) {
                dataLayer.remove(feature);
            });
        }
    }, {
        key: 'enable',
        value: function enable() {
            this._layer.setMap(this._map);
        }
    }, {
        key: 'disable',
        value: function disable() {
            this._layer.setMap(null);
        }

        /* set circle style map visualization */
    }, {
        key: '_getCircleStyle',
        value: function _getCircleStyle(feature) {
            var magnitude = feature.getProperty('mag'),
                color = this._paletteScale(magnitude);

            return {
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    strokeWeight: 1,
                    strokeColor: 'black',
                    fillColor: color,
                    fillOpacity: 0.9,
                    scale: magnitude * 2
                },
                zIndex: Math.floor(magnitude * 10)
            };
        }
    }]);

    return CircleLayer;
})();

exports['default'] = CircleLayer;
module.exports = exports['default'];

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _TectonicLayer = require('./TectonicLayer');

var _TectonicLayer2 = _interopRequireDefault(_TectonicLayer);

var _MarkersLayer = require('./MarkersLayer');

var _MarkersLayer2 = _interopRequireDefault(_MarkersLayer);

var _CircleLayer = require('./CircleLayer');

var _CircleLayer2 = _interopRequireDefault(_CircleLayer);

var _HeatMapLayer = require('./HeatMapLayer');

var _HeatMapLayer2 = _interopRequireDefault(_HeatMapLayer);

var _dataFetcher = require('../data/Fetcher');

var _dataFetcher2 = _interopRequireDefault(_dataFetcher);

var EarthquakeMap = (function () {
    function EarthquakeMap(zoom, center) {
        _classCallCheck(this, EarthquakeMap);

        this._map = null;

        this._tectonicsLayer = null;

        /* map layers */
        this._layers = {
            markersLayer: null,
            circleLayer: null,
            heatMapLayer: null
        };

        this._data = {};
        this._visibleEarthquakes = [];

        this._zoom = zoom;
        this._visualizationType = "markers";
        /* initial center point */
        this._center = center;

        this._selectedFeature = null;
        this.fetcher = new _dataFetcher2['default']();
    }

    _createClass(EarthquakeMap, [{
        key: 'initializeMap',
        value: function initializeMap() {
            var _this = this;

            this._map = new google.maps.Map(document.getElementById('map'), {
                zoom: this._zoom,
                center: this._center,
                zoomControl: true,
                scaleControl: true,
                streetViewControl: false,
                mapTypeId: google.maps.MapTypeId.TERRAIN
            });

            this._tectonicsLayer = new _TectonicLayer2['default'](this._map);

            this._layers.markersLayer = new _MarkersLayer2['default'](this._map);
            this._layers.circleLayer = new _CircleLayer2['default'](this._map);
            this._layers.heatMapLayer = new _HeatMapLayer2['default'](this._map);

            this.setVisualizationType('markersLayer');

            /* refresh list when stop making changes */
            this._map.addListener('idle', function () {
                return _this._refreshEarthquakesList();
            });

            EQ.logger.debug('Adding legend to Map');
            var legend = $('#map-legend');
            this._map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend[0]);
            legend.show();
        }
    }, {
        key: 'setData',
        value: function setData(data) {
            var _this2 = this;

            EQ.logger.info('Setting new data');
            EQ.logger.debug('Emptying data layers');
            $.each(this._layers, function (i, layer) {
                layer.empty();
            });

            /* need to take normalized data from Google Maps API to avoid 
            /* further steps during HeatMapCreation */
            EQ.logger.debug('Adding data to layers');
            var normalizedData = this._layers.markersLayer.addData(data);
            this._layers.circleLayer.addData(data);
            this._layers.heatMapLayer.addData(normalizedData);

            EQ.logger.debug('Storing new data');
            this._data = {};
            $.each(data.features, function (i, earthquake) {
                _this2._data[earthquake.id] = earthquake;
            });

            google.maps.event.trigger(this._map, 'idle');
        }
    }, {
        key: 'setVisualizationType',
        value: function setVisualizationType(visualizationType) {
            EQ.logger.debug('New visualization type', visualizationType);
            this._visualizationType = visualizationType;

            $.each(this._layers, function (layerName, layer) {
                if (layerName === visualizationType) layer.enable();else layer.disable();
            });

            /* set new legend */
            EQ.logger.debug('Setting new legend for', visualizationType);
            this._setLegend(visualizationType);
        }
    }, {
        key: 'getVisibleEarthquakes',
        value: function getVisibleEarthquakes() {
            var _this3 = this;

            var visibleEarthquakes = [];
            this._layers.markersLayer._layer.forEach(function (earthquake) {
                var position = earthquake.getGeometry().get(),
                    bounds = _this3._map.getBounds();
                if (bounds && bounds.contains(position)) visibleEarthquakes.push(earthquake);
            });

            return visibleEarthquakes;
        }
    }, {
        key: 'refreshData',
        value: function refreshData() {
            var _this4 = this;

            EQ.logger.info('Refreshing data');
            this.fetcher.fetchData().then(function (data) {
                /* GeoJSON object, type: FeatureCollection */
                _this4.setData(data);
            });
        }
    }, {
        key: '_setLegend',
        value: function _setLegend(visualizationType) {
            $('#map-legend .map-legend').hide();
            $('#' + visualizationType + '-map-legend').show();
        }

        /* called to refresh the list of eq.kes */
    }, {
        key: '_refreshEarthquakesList',
        value: function _refreshEarthquakesList() {
            var _this5 = this;

            this._visibleEarthquakes = this.getVisibleEarthquakes();
            EQ.logger.debug('Found', this._visibleEarthquakes.length, 'visible earthquakes');

            this._visibleEarthquakes.sort(function (a, b) {
                var aVal = parseFloat(a.getProperty('mag'));
                var bVal = parseFloat(b.getProperty('mag'));

                if (isNaN(bVal)) bVal = -1;
                if (isNaN(aVal)) aVal = -1;

                return bVal - aVal;
            });

            $('#earthquake-list').empty();

            $.each(this._visibleEarthquakes, function (i, earthquake) {
                var id = earthquake.getId();
                var listElement = _this5._getListElement({
                    id: id,
                    title: earthquake.getProperty('title'),
                    position: earthquake.getGeometry().get(),
                    index: i + 1,
                    total: _this5._visibleEarthquakes.length,
                    magnitude: earthquake.getProperty('mag'),
                    tsunami: earthquake.getProperty('tsunami') === 1 ? true : false,
                    depth: _this5._data[id].geometry.coordinates[2], // depth in km
                    date: moment(earthquake.getProperty('time')).format('D/M/YYYY HH:mm'),
                    url: earthquake.getProperty('url')
                });

                listElement.click(function () {
                    return _this5.selectEarthquake(earthquake);
                });
                $('#earthquake-list').append(listElement);
            });

            $('#earthquake-number-badge').html(this._visibleEarthquakes.length);
        }
    }, {
        key: 'selectEarthquake',
        value: function selectEarthquake(earthquake) {
            var _this6 = this;

            var id = earthquake.getId();

            if (this._selectedFeature) {
                var oldId = this._selectedFeature.getId();
                $('#' + oldId).removeClass("earthquake-list-item-selected");
            }

            var item = $('#' + id);
            item.addClass("earthquake-list-item-selected");

            this._selectedFeature = earthquake;

            $.each(this._layers, function (layerName, layer) {
                return layer.setSelected(_this6._selectedFeature.getId());
            });

            var container = $('#list-panel'),
                scrollTo = item;

            container.scrollTop(0);
            container.scrollTop(scrollTo.offset().top - container.offset().top);

            EQ.logger.debug('Selected earthquake', id);
        }
    }, {
        key: 'convertCoordinates',
        value: function convertCoordinates(latitude, longitude) {
            /** Latitude */
            var convertedLatitude = Math.abs(latitude),
                latitudeCardinal = latitude > 0 ? "N" : "S",
                latitudeDegree = Math.floor(convertedLatitude);

            convertedLatitude = (convertedLatitude - latitudeDegree) * 60;
            var latitudePrimes = Math.floor(convertedLatitude);

            convertedLatitude = (convertedLatitude - latitudePrimes) * 60;
            var latitudeSeconds = Math.floor(convertedLatitude);

            /** Longitude */
            var convertedLongitude = Math.abs(longitude),
                LongitudeCardinal = longitude > 0 ? "E" : "W",
                LongitudeDegree = Math.floor(convertedLongitude);

            convertedLongitude = (convertedLongitude - LongitudeDegree) * 60;
            var LongitudePrimes = Math.floor(convertedLongitude);

            convertedLongitude = (convertedLongitude - LongitudePrimes) * 60;
            var LongitudeSeconds = Math.floor(convertedLongitude);

            return latitudeDegree + '° ' + latitudePrimes + "' " + latitudeSeconds + '" ' + latitudeCardinal + ', ' + LongitudeDegree + '° ' + LongitudePrimes + "' " + LongitudeSeconds + '" ' + LongitudeCardinal;
        }
    }, {
        key: '_getListElement',
        value: function _getListElement(options) {
            return $('<div id="' + options.id + '" class="list-group-item earthquake-list-item"> ' + '<div class="earthquake-list-item-content width-height-100">' + '<div class="earthquake-list-item-header width-height-100"><b>' + options.title + '</b></div>' + '<div class="earthquake-list-item-body width-height-100">' + (EQ.debug ? 'ID: ' + options.id + '<br>' : '') + 'Position ' + this.convertCoordinates(options.position.lat(), options.position.lng()) + '<br>' + ($.isNumeric(options.magnitude) ? 'Magnitude ' + options.magnitude.toFixed(2) + '<br>' : '') + (options.tsunami ? 'Tsunami' + '<br>' : '') + 'Depth ' + options.depth.toFixed(2) + ' km<br>' + 'Date ' + options.date + '<br>' + '<a target="_blank" href="' + options.url + '">Details</a>' + '</div></div></div>');
        }
    }]);

    return EarthquakeMap;
})();

exports['default'] = EarthquakeMap;
module.exports = exports['default'];

},{"../data/Fetcher":1,"./CircleLayer":5,"./HeatMapLayer":7,"./MarkersLayer":8,"./TectonicLayer":9}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var HeatMapLayer = (function () {
    function HeatMapLayer(map) {
        _classCallCheck(this, HeatMapLayer);

        this._map = map;
        this._layer = new google.maps.visualization.HeatmapLayer({
            dissipating: false,
            opacity: 0.6,
            map: null,
            gradient: ['rgba(0, 255, 255, 0)'].concat(colorbrewer.YlOrRd[6])
        });

        this._initialize();
    }

    _createClass(HeatMapLayer, [{
        key: '_initialize',
        value: function _initialize() {}
    }, {
        key: 'addData',
        value: function addData(data) {
            var heatmapData = [];
            data.forEach(function (earthquake) {
                var position = earthquake.getGeometry().get(),
                    magnitude = earthquake.getProperty('mag');
                heatmapData.push({
                    location: position,
                    weight: Math.pow(2, magnitude)
                });
            });

            var dataArray = new google.maps.MVCArray(heatmapData);
            this._layer.set('data', dataArray);
        }
    }, {
        key: 'setSelected',
        value: function setSelected(earthquake) {}
    }, {
        key: 'empty',
        value: function empty() {
            var dataArray = new google.maps.MVCArray([]);
            this._layer.set('data', dataArray);
        }
    }, {
        key: 'enable',
        value: function enable() {
            this._layer.setMap(this._map);
        }
    }, {
        key: 'disable',
        value: function disable() {
            this._layer.setMap(null);
        }
    }]);

    return HeatMapLayer;
})();

exports['default'] = HeatMapLayer;
module.exports = exports['default'];

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MarkersLayer = (function () {
    function MarkersLayer(map) {
        _classCallCheck(this, MarkersLayer);

        this._map = map;
        this._layer = new google.maps.Data({
            map: null
        });
        this._initialize();
    }

    _createClass(MarkersLayer, [{
        key: '_initialize',
        value: function _initialize() {
            var _this = this;

            this._layer.setStyle(function (earthquake) {
                return _this._getMarkersStyle(earthquake);
            });
            this._layer.addListener('click', function (earthquake) {
                EQ.map.selectEarthquake(earthquake.feature);
            });
        }
    }, {
        key: 'addData',
        value: function addData(data) {
            return this._layer.addGeoJson(data);
        }
    }, {
        key: 'setSelected',
        value: function setSelected(earthquakeId) {
            var earthquake = this._layer.getFeatureById(earthquakeId);

            this._layer.revertStyle();
            this._layer.overrideStyle(earthquake, {
                icon: 'assets/selected-feature.png',
                zIndex: 500
            });
        }
    }, {
        key: 'empty',
        value: function empty() {
            var dataLayer = this._layer;
            dataLayer.forEach(function (feature) {
                dataLayer.remove(feature);
            });
        }
    }, {
        key: 'enable',
        value: function enable() {
            this._layer.setMap(this._map);
        }
    }, {
        key: 'disable',
        value: function disable() {
            this._layer.setMap(null);
        }
    }, {
        key: '_getMarkersStyle',
        value: function _getMarkersStyle(feature) {
            var magnitude = feature.getProperty('mag');
            return {
                zIndex: Math.floor(magnitude * 10)
            };
        }
    }]);

    return MarkersLayer;
})();

exports['default'] = MarkersLayer;
module.exports = exports['default'];

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TectonicLayer = (function () {
    function TectonicLayer(map) {
        _classCallCheck(this, TectonicLayer);

        this._polygons = [];
        this._layer = new google.maps.Data({
            map: map
        });
        this._currentLabel = null;
        this._initialize();
    }

    _createClass(TectonicLayer, [{
        key: '_initialize',
        value: function _initialize() {
            var _this = this;

            $.getJSON("assets/tectonics-plate.json").then(function (tectonics) {
                var tectonicsData = _this._layer.addGeoJson(tectonics);
                _this._cretePolygons(tectonicsData);
            });

            this._layer.setStyle(this._getTectonicsStyle);

            this._layer.addListener('mouseover', function (event) {
                _this._currentLabel = event.feature.getProperty('name');
                $('#plate-tooltip').html(_this._currentLabel);
                _this._layer.revertStyle();
                _this._layer.overrideStyle(event.feature, {
                    strokeWeight: 2.5,
                    fillOpacity: 0.15
                });
            });

            this._layer.addListener('mouseout', function (event) {
                _this._currentLabel = null;
                _this._layer.revertStyle();
                $('#plate-tooltip').html("");
            });

            $(document).mousemove(function (event) {
                if (_this._currentLabel) $('#plate-tooltip').offset({
                    left: event.pageX - 75,
                    top: event.pageY + 30
                }).show();else $('#plate-tooltip').hide();
            });
        }
    }, {
        key: '_cretePolygons',
        value: function _cretePolygons(tectonicsData) {
            var _this2 = this;

            $.each(tectonicsData, function (i, tectonic) {
                var tGeometry = tectonic.getGeometry(),
                    points = [];

                tGeometry.forEachLatLng(function (pt) {
                    points.push(pt);
                });

                var platePolygon = new google.maps.Polygon({
                    paths: points
                });
                platePolygon.set('__name', tectonic.getProperty('name'));
                //platePolygon.name = tectonic.getProperty('')
                _this2._polygons.push(platePolygon);
            });
        }
    }, {
        key: '_refresh',
        value: function _refresh() {
            var map = this._layer.getMap();
            this._layer.setMap(null);
            this._layer.setMap(map);
        }
    }, {
        key: '_getTectonicsStyle',
        value: function _getTectonicsStyle(feature) {
            var color = feature.getProperty('color'),
                name = feature.getProperty('name');

            return {
                fillColor: color,
                fillOpacity: 0.1,
                strokeColor: color,
                strokeWeight: 1
            };
        }
    }, {
        key: 'getPlateByPoint',
        value: function getPlateByPoint(earthquakePosition) {
            var plateData = {
                inside: [],
                near: [],
                all: []
            };

            $.each(this._polygons, function (i, plate) {
                if (google.maps.geometry.poly.containsLocation(earthquakePosition, plate)) {
                    plateData.inside.push(plate.get('__name'));
                    plateData.all.push(plate.get('__name'));
                } else if (google.maps.geometry.poly.isLocationOnEdge(earthquakePosition, plate, 10e-1)) {
                    plateData.near.push(plate.get('__name'));
                    plateData.all.push(plate.get('__name'));
                }
            });

            plateData.all.sort();
            return plateData;
        }
    }]);

    return TectonicLayer;
})();

exports['default'] = TectonicLayer;
module.exports = exports['default'];

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Logger = (function () {
    function Logger(logLevel) {
        var _this = this;

        _classCallCheck(this, Logger);

        this._logLevel = logLevel;
        this.LogLevel = Logger.LogLevel;

        this._styles = {
            error: 'color: yellow; background: #FF4040',
            warn: 'color: #FF4040; background: #eed482',
            info: 'color: blue',
            debug: 'color: green'
        };

        this._joinSymbol = ' ';

        $.each(this.LogLevel, function (logLevel) {
            _this[logLevel] = function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                _this._log.apply(_this, [logLevel].concat(args));
            };
        });
    }

    _createClass(Logger, [{
        key: 'setLogLevel',
        value: function setLogLevel(logLevel) {
            if ($.isNumeric(logLevel) && logLevel > -1) this._logLevel = logLevel;
        }
    }, {
        key: '_log',
        value: function _log(logType) {
            if (!this._isLoggable(logType)) return;

            for (var _len2 = arguments.length, msgList = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                msgList[_key2 - 1] = arguments[_key2];
            }

            var style = this._styles[logType],
                finalMsg = "%c" + msgList.join(this._joinSymbol);

            console[logType].apply(console, [finalMsg, style]);
        }
    }, {
        key: '_isLoggable',
        value: function _isLoggable(logLevelId) {
            var logLevel = this.LogLevel[logLevelId];
            return logLevel <= this._logLevel;
        }
    }], [{
        key: 'LogLevel',
        get: function get() {
            return {
                error: 1,
                warn: 2,
                info: 3,
                debug: 4
            };
        }
    }]);

    return Logger;
})();

exports['default'] = Logger;
module.exports = exports['default'];

},{}]},{},[4])


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvZGF0YS9GZXRjaGVyLmpzIiwic3JjL2pzL2RhdGEvUHJveHkuanMiLCJzcmMvanMvZ3JhcGgvR3JhcGhNYW5hZ2VyLmpzIiwic3JjL2pzL21haW4uanMiLCJzcmMvanMvbWFwL0NpcmNsZUxheWVyLmpzIiwic3JjL2pzL21hcC9FYXJ0aHF1YWtlTWFwLmpzIiwic3JjL2pzL21hcC9IZWF0TWFwTGF5ZXIuanMiLCJzcmMvanMvbWFwL01hcmtlcnNMYXllci5qcyIsInNyYy9qcy9tYXAvVGVjdG9uaWNMYXllci5qcyIsInNyYy9qcy91dGlsL0xvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7OztxQkNBa0IsU0FBUzs7OztJQUVOLE9BQU87QUFDYixhQURNLE9BQU8sR0FDVjs4QkFERyxPQUFPOztBQUVwQixZQUFJLENBQUMsTUFBTSxHQUFHLHdCQUFXLENBQUM7QUFDMUIsWUFBSSxDQUFDLFFBQVEsR0FBRztBQUNaLHFCQUFTLEVBQUUsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUN4QyxtQkFBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztTQUN4RCxDQUFDOztBQUVGLFlBQUksQ0FBQyxJQUFJLEdBQUcsd0dBQXdHLENBQUM7S0FDeEg7O2lCQVRnQixPQUFPOztlQVdmLHFCQUFHO0FBQ1IsY0FBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25ELGdCQUFJLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDM0Isb0JBQVEsRUFBRSxDQUFDLEtBQUs7QUFDaEIscUJBQUssTUFBTTtBQUNQO0FBQ0ksdUNBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzVDLDhCQUFNO3FCQUNUO0FBQUEsQUFDTCxxQkFBSyxNQUFNO0FBQ1A7QUFDSSx5QkFBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDNUIsdUNBQWUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDckMsOEJBQU07cUJBQ1Q7QUFBQSxBQUNMLHFCQUFLLE9BQU8sQ0FBQztBQUNiO0FBQ0k7QUFDSSx1Q0FBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDN0MsOEJBQU07cUJBQ1Q7QUFBQSxhQUNKOztBQUVELG1CQUFPLGVBQWUsQ0FBQztTQUMxQjs7O2VBRUUsYUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQ2YsZ0JBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzlCLG1CQUFPLElBQUksQ0FBQztTQUNmOzs7ZUFFVSx1QkFBRztBQUNWLGdCQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3BCLGFBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUs7QUFDbEMsbUJBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUM7YUFDbEMsQ0FBQyxDQUFDO0FBQ0gsbUJBQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDakMsaUJBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzVCLHVCQUFPLElBQUksQ0FBQzthQUNmLENBQUMsQ0FBQztTQUNOOzs7V0FuRGdCLE9BQU87OztxQkFBUCxPQUFPOzs7Ozs7Ozs7Ozs7OztJQ0ZQLEtBQUs7QUFDWCxhQURNLEtBQUssR0FDUjs4QkFERyxLQUFLOztBQUVsQixZQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixZQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztLQUMxQjs7aUJBSmdCLEtBQUs7O2VBTVgsdUJBQUc7OztBQUNWLG1CQUFPLElBQUksQ0FBQyxLQUFLLEdBQ2IsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQzdCLHVCQUFPLENBQUMsTUFBSyxLQUFLLENBQUMsQ0FBQzthQUN2QixDQUFDLEdBQ0YsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSztBQUMvQyxzQkFBSyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLHVCQUFPLElBQUksQ0FBQzthQUNmLENBQUMsQ0FBQztTQUNWOzs7ZUFFVyx3QkFBRzs7O0FBQ1gsbUJBQU8sSUFBSSxDQUFDLFVBQVUsR0FDbEIsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQzdCLHVCQUFPLENBQUMsT0FBSyxVQUFVLENBQUMsQ0FBQzthQUM1QixDQUFDLEdBQ0YsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSztBQUNwRCx1QkFBSyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLHVCQUFPLElBQUksQ0FBQzthQUNmLENBQUMsQ0FBQztTQUNWOzs7V0ExQmdCLEtBQUs7OztxQkFBTCxLQUFLOzs7Ozs7Ozs7Ozs7OztJQ0FMLFlBQVk7QUFDbEIsYUFETSxZQUFZLEdBQ2Y7OEJBREcsWUFBWTtLQUNiOztpQkFEQyxZQUFZOztlQUdwQixtQkFBQyxrQkFBa0IsRUFBRTs7O0FBQzFCLGdCQUFJLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDbkQsYUFBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUV4QixjQUFFLENBQUMsUUFBUSxDQUFDLFlBQU07QUFDZCxrQkFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNyQyxvQkFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FDL0IsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUNoQixLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUNwQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7O0FBRWxCLHFCQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVuQyxxQkFBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ25DLHFCQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFVBQUMsSUFBSTsyQkFBSyxNQUFLLFdBQVcsQ0FBQyxJQUFJLENBQUM7aUJBQUEsQ0FBQyxDQUFDOzs7QUFHakUsa0JBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7O0FBRXRDLHFCQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RCLHFCQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUNoQywyQkFBTyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQTtpQkFDL0MsQ0FBQyxDQUFDO0FBQ0gscUJBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlCLG9CQUFJLGVBQWUsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO29CQUMzRCxTQUFTLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUU7b0JBQ3BELE9BQU8sR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVyRCxxQkFBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDOzs7QUFHbkMscUJBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0QixxQkFBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztBQUUxQyxrQkFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FDbEIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUNYLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFakIsa0JBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFcEMscUJBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsRUFBRTtBQUMxQyxBQUFDLGdDQUFZLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBRTtpQkFDckMsQ0FBQyxDQUFDOztBQUVILHNCQUFLLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDcEIsMEJBQVUsQ0FBQyxNQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRXBDLGtCQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3BDLHVCQUFPLEtBQUssQ0FBQzthQUNoQixDQUFDLENBQUM7U0FDTjs7O2VBRVUscUJBQUMsSUFBSSxFQUFFO0FBQ2QsZ0JBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVTtnQkFDbEMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO2dCQUN2QyxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ3RFLEtBQUssR0FBRyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFO2dCQUN0QyxRQUFRLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRTtnQkFDdEIsU0FBUyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUU7Z0JBQ3ZCLFNBQVMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztnQkFDekMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDOztBQUUvQixnQkFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFVBQVUsR0FBRyxLQUFLLEdBQUcsVUFBVSxHQUMzQyxLQUFLLEdBQUcsT0FBTyxHQUNmLFlBQVksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsR0FBRyxNQUFNLEdBQ3RFLGFBQWEsR0FBRyxTQUFTLEdBQUcsTUFBTSxHQUNsQyxRQUFRLEdBQUcsSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDOztBQUdwQyxjQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDbkQsbUJBQU8sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3pCOzs7ZUFFYSx3QkFBQyxrQkFBa0IsRUFBRTtBQUMvQixnQkFBSSxVQUFVLEdBQUcsRUFBRTtnQkFDZixNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFaEMsY0FBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsRSxhQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLFVBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBSztBQUMxQyxvQkFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRTtvQkFDdEMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUM7b0JBQ3RELGVBQWUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNwRCxTQUFTLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO29CQUM5QyxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7b0JBQ3BELGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRXpELGdDQUFnQixDQUFDLElBQUksQ0FBQztBQUNsQixxQkFBQyxFQUFFLElBQUk7QUFDUCxxQkFBQyxFQUFFLFNBQVM7QUFDWix3QkFBSSxFQUFFLFNBQVM7QUFDZix5QkFBSyxFQUFFLFFBQVE7QUFDZiw4QkFBVSxFQUFFLFVBQVU7aUJBQ3pCLENBQUMsQ0FBQzs7QUFFSCwwQkFBVSxDQUFDLGVBQWUsQ0FBQyxHQUFHLGdCQUFnQixDQUFDO2FBQ2xELENBQUMsQ0FBQzs7QUFFSCxnQkFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDOztBQUVkLGFBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQUMsU0FBUyxFQUFFLFdBQVcsRUFBSztBQUMzQyxvQkFBSSxDQUFDLElBQUksQ0FBQztBQUNOLHVCQUFHLEVBQUUsU0FBUztBQUNkLDBCQUFNLEVBQUUsV0FBVztpQkFDdEIsQ0FBQyxDQUFDO2FBQ04sQ0FBQyxDQUFDO0FBQ0gsY0FBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLGlCQUFpQixDQUFDLENBQUM7O0FBRTlELG1CQUFPLElBQUksQ0FBQztTQUNmOzs7V0EvR2dCLFlBQVk7OztxQkFBWixZQUFZOzs7Ozs7OztnQ0NBUCxxQkFBcUI7Ozs7aUNBQ3RCLHNCQUFzQjs7OzswQkFDNUIsZUFBZTs7OztBQUVsQyxNQUFNLENBQUMsRUFBRSxHQUFHOztBQUVSLGNBQVUsRUFBRSxXQUFXOztBQUV2QixTQUFLLEVBQUUsS0FBSzs7Ozs7OztBQU9aLFNBQUssRUFBRSxNQUFNOztBQUViLE9BQUcsRUFBRSxJQUFJO0FBQ1QsZ0JBQVksRUFBRSxvQ0FBa0I7O0FBRWhDLFVBQU0sRUFBRSw0QkFBVyx3QkFBTyxRQUFRLENBQUMsS0FBSyxDQUFDO0NBQzVDLENBQUM7Ozs7QUFJRixTQUFTLFdBQVcsR0FBRztBQUNuQixLQUFDLENBQUMsWUFBWTs7O0FBR1YsWUFBSSxJQUFJLEdBQUcsQ0FBQztZQUNSLE1BQU0sR0FBRztBQUNMLGVBQUcsRUFBRSxNQUFNO0FBQ1gsZUFBRyxFQUFFLENBQUMsTUFBTTtTQUNmLENBQUM7O0FBRU4sVUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN0QyxVQUFFLENBQUMsR0FBRyxHQUFHLGtDQUFrQixJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDekMsVUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7O0FBR3ZCLFVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7O0FBRXJCLFVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxLQUFLLEdBQUcsY0FBYyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBQ3pFLFVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7O0FBRXJELFNBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQzttQkFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQUEsQ0FBQyxDQUFDOztBQUVuSCxVQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDOztBQUVsRCxTQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FDaEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUNWLEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFBQyxHQUFHLEVBQUs7QUFDdEIsY0FBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZFLGNBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUNULEdBQUcsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNqQyxHQUFHLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QyxjQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3hCLENBQUMsQ0FBQzs7O0FBSVAsaUJBQVMsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7QUFDcEIsYUFBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztTQUNsRztBQUNELFVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDOztBQUV2QixTQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsZUFBZSxDQUFDO0FBQzlCLGtCQUFNLEVBQUU7QUFDSix1QkFBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDN0IsMkJBQVcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN6RSw2QkFBYSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQzthQUMxRDtTQUNKLEVBQUUsRUFBRSxDQUFDLENBQUM7OztBQUdQLFNBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsdUJBQXVCLEVBQUUsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFO0FBQ2hFLGNBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4RSxjQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FDVCxHQUFHLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUNyRSxHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZFLGNBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDeEIsQ0FBQyxDQUFDOzs7QUFHSCxTQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxLQUFLLENBQUM7bUJBQU0sRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQztTQUFBLENBQUMsQ0FBQzs7O0FBR3ZGLFNBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzFDLENBQUMsQ0FBQztDQUNOOzs7Ozs7Ozs7Ozs7O0lDekZvQixXQUFXO0FBQ2pCLGFBRE0sV0FBVyxDQUNoQixHQUFHLEVBQUU7OEJBREEsV0FBVzs7QUFFeEIsWUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7QUFDaEIsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQy9CLGVBQUcsRUFBRSxHQUFHO1NBQ1gsQ0FBQyxDQUFDO0FBQ0gsWUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ3RCOztpQkFQZ0IsV0FBVzs7ZUFTakIsdUJBQUc7OztBQUNWLGdCQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFDLFVBQVU7dUJBQUssTUFBSyxlQUFlLENBQUMsVUFBVSxDQUFDO2FBQUEsQ0FBQyxDQUFDO0FBQ3ZFLGdCQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQ25DLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUNmLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckM7OztlQUVNLGlCQUFDLElBQUksRUFBRTtBQUNWLG1CQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3ZDOzs7ZUFHVSxxQkFBQyxZQUFZLEVBQUUsRUFBRTs7O2VBRXZCLGlCQUFHO0FBQ0osZ0JBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDNUIscUJBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDM0IseUJBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDN0IsQ0FBQyxDQUFDO1NBQ047OztlQUVLLGtCQUFHO0FBQ0wsZ0JBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNqQzs7O2VBRU0sbUJBQUc7QUFDTixnQkFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUI7Ozs7O2VBR2MseUJBQUMsT0FBTyxFQUFFO0FBQ3JCLGdCQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztnQkFDdEMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRTFDLG1CQUFPO0FBQ0gsb0JBQUksRUFBRTtBQUNGLHdCQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTTtBQUNuQyxnQ0FBWSxFQUFFLENBQUM7QUFDZiwrQkFBVyxFQUFFLE9BQU87QUFDcEIsNkJBQVMsRUFBRSxLQUFLO0FBQ2hCLCtCQUFXLEVBQUUsR0FBRztBQUNoQix5QkFBSyxFQUFFLFNBQVMsR0FBRyxDQUFDO2lCQUN2QjtBQUNELHNCQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO2FBQ3JDLENBQUM7U0FDTDs7O1dBdERnQixXQUFXOzs7cUJBQVgsV0FBVzs7Ozs7Ozs7Ozs7Ozs7Ozs2QkNBTixpQkFBaUI7Ozs7NEJBQ2xCLGdCQUFnQjs7OzsyQkFDakIsZUFBZTs7Ozs0QkFDZCxnQkFBZ0I7Ozs7MkJBRXJCLGlCQUFpQjs7OztJQUVoQixhQUFhO0FBQ25CLGFBRE0sYUFBYSxDQUNsQixJQUFJLEVBQUUsTUFBTSxFQUFFOzhCQURULGFBQWE7O0FBRTFCLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVqQixZQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQTs7O0FBRzNCLFlBQUksQ0FBQyxPQUFPLEdBQUc7QUFDWCx3QkFBWSxFQUFFLElBQUk7QUFDbEIsdUJBQVcsRUFBRSxJQUFJO0FBQ2pCLHdCQUFZLEVBQUUsSUFBSTtTQUNyQixDQUFDOztBQUVGLFlBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFlBQUksQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7O0FBRTlCLFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFlBQUksQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLENBQUM7O0FBRXBDLFlBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOztBQUV0QixZQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFlBQUksQ0FBQyxPQUFPLEdBQUcsOEJBQWEsQ0FBQztLQUNoQzs7aUJBdkJnQixhQUFhOztlQXlCakIseUJBQUc7OztBQUNaLGdCQUFJLENBQUMsSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUM1RCxvQkFBSSxFQUFFLElBQUksQ0FBQyxLQUFLO0FBQ2hCLHNCQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU87QUFDcEIsMkJBQVcsRUFBRSxJQUFJO0FBQ2pCLDRCQUFZLEVBQUUsSUFBSTtBQUNsQixpQ0FBaUIsRUFBRSxLQUFLO0FBQ3hCLHlCQUFTLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTzthQUMzQyxDQUFDLENBQUM7O0FBRUgsZ0JBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWtCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFcEQsZ0JBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLDhCQUFpQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEQsZ0JBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLDZCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEQsZ0JBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLDhCQUFpQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXhELGdCQUFJLENBQUMsb0JBQW9CLENBQUMsY0FBYyxDQUFDLENBQUM7OztBQUcxQyxnQkFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO3VCQUFNLE1BQUssdUJBQXVCLEVBQUU7YUFBQSxDQUFDLENBQUM7O0FBR3BFLGNBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDeEMsZ0JBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM5QixnQkFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFFLGtCQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDakI7OztlQUVNLGlCQUFDLElBQUksRUFBRTs7O0FBQ1YsY0FBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNuQyxjQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3hDLGFBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFDLENBQUMsRUFBRSxLQUFLLEVBQUs7QUFDL0IscUJBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNqQixDQUFDLENBQUM7Ozs7QUFJSCxjQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3pDLGdCQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0QsZ0JBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QyxnQkFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUVsRCxjQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3BDLGdCQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNoQixhQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBQyxDQUFDLEVBQUUsVUFBVSxFQUFLO0FBQ3JDLHVCQUFLLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDO2FBQzFDLENBQUMsQ0FBQTs7QUFFRixrQkFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDaEQ7OztlQUVtQiw4QkFBQyxpQkFBaUIsRUFBRTtBQUNwQyxjQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBQzdELGdCQUFJLENBQUMsa0JBQWtCLEdBQUcsaUJBQWlCLENBQUM7O0FBRTVDLGFBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUs7QUFDdkMsb0JBQUksU0FBUyxLQUFLLGlCQUFpQixFQUMvQixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsS0FFZixLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDdkIsQ0FBQyxDQUFDOzs7QUFHSCxjQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBQzdELGdCQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDdEM7OztlQUVvQixpQ0FBRzs7O0FBQ3BCLGdCQUFJLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztBQUM1QixnQkFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFVBQVUsRUFBSztBQUNyRCxvQkFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRTtvQkFDekMsTUFBTSxHQUFHLE9BQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ25DLG9CQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNoRixDQUFDLENBQUM7O0FBRUgsbUJBQU8sa0JBQWtCLENBQUM7U0FDN0I7OztlQUVVLHVCQUFHOzs7QUFDVixjQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ2xDLGdCQUFJLENBQUMsT0FBTyxDQUNQLFNBQVMsRUFBRSxDQUNYLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSzs7QUFFWix1QkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDdEIsQ0FBQyxDQUFDO1NBQ1Y7OztlQUVTLG9CQUFDLGlCQUFpQixFQUFFO0FBQzFCLGFBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3BDLGFBQUMsQ0FBQyxHQUFHLEdBQUcsaUJBQWlCLEdBQUcsYUFBYSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDckQ7Ozs7O2VBR3NCLG1DQUFHOzs7QUFDdEIsZ0JBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUN4RCxjQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxDQUFDOztBQUVqRixnQkFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUs7QUFDcEMsb0JBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDNUMsb0JBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRTVDLG9CQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFDWCxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDZCxvQkFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQ1gsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUVkLHVCQUFPLElBQUksR0FBRyxJQUFJLENBQUM7YUFDdEIsQ0FBQyxDQUFDOztBQUVILGFBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUU5QixhQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxVQUFDLENBQUMsRUFBRSxVQUFVLEVBQUs7QUFDaEQsb0JBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QixvQkFBSSxXQUFXLEdBQUcsT0FBSyxlQUFlLENBQUM7QUFDbkMsc0JBQUUsRUFBRSxFQUFFO0FBQ04seUJBQUssRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztBQUN0Qyw0QkFBUSxFQUFFLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUU7QUFDeEMseUJBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQztBQUNaLHlCQUFLLEVBQUUsT0FBSyxtQkFBbUIsQ0FBQyxNQUFNO0FBQ3RDLDZCQUFTLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7QUFDeEMsMkJBQU8sRUFBRSxBQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFJLElBQUksR0FBRyxLQUFLO0FBQ2pFLHlCQUFLLEVBQUUsT0FBSyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDN0Msd0JBQUksRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztBQUNyRSx1QkFBRyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO2lCQUNyQyxDQUFDLENBQUM7O0FBRUgsMkJBQVcsQ0FBQyxLQUFLLENBQUM7MkJBQU0sT0FBSyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7aUJBQUEsQ0FBQyxDQUFDO0FBQzNELGlCQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDN0MsQ0FBQyxDQUFDOztBQUVILGFBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkU7OztlQUVlLDBCQUFDLFVBQVUsRUFBRTs7O0FBQ3pCLGdCQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRTVCLGdCQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtBQUN2QixvQkFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzFDLGlCQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2FBQy9EOztBQUVELGdCQUFJLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZCLGdCQUFJLENBQUMsUUFBUSxDQUFDLCtCQUErQixDQUFDLENBQUM7O0FBRS9DLGdCQUFJLENBQUMsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDOztBQUVuQyxhQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBQyxTQUFTLEVBQUUsS0FBSzt1QkFBSyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQUssZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7YUFBQSxDQUFDLENBQUM7O0FBRTdGLGdCQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDO2dCQUM1QixRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVwQixxQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixxQkFBUyxDQUFDLFNBQVMsQ0FDZixRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQ2pELENBQUM7O0FBRUYsY0FBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDOUM7OztlQUVpQiw0QkFBQyxRQUFRLEVBQUUsU0FBUyxFQUFFOztBQUVwQyxnQkFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDdEMsZ0JBQWdCLEdBQUksQUFBQyxRQUFRLEdBQUcsQ0FBQyxHQUFJLEdBQUcsR0FBRyxHQUFHLEFBQUM7Z0JBQy9DLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0FBRW5ELDZCQUFpQixHQUFHLENBQUMsaUJBQWlCLEdBQUcsY0FBYyxDQUFBLEdBQUksRUFBRSxDQUFDO0FBQzlELGdCQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0FBRW5ELDZCQUFpQixHQUFHLENBQUMsaUJBQWlCLEdBQUcsY0FBYyxDQUFBLEdBQUksRUFBRSxDQUFDO0FBQzlELGdCQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7OztBQUdwRCxnQkFBSSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztnQkFDeEMsaUJBQWlCLEdBQUksQUFBQyxTQUFTLEdBQUcsQ0FBQyxHQUFJLEdBQUcsR0FBRyxHQUFHLEFBQUM7Z0JBQ2pELGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRXJELDhCQUFrQixHQUFHLENBQUMsa0JBQWtCLEdBQUcsZUFBZSxDQUFBLEdBQUksRUFBRSxDQUFDO0FBQ2pFLGdCQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRXJELDhCQUFrQixHQUFHLENBQUMsa0JBQWtCLEdBQUcsZUFBZSxDQUFBLEdBQUksRUFBRSxDQUFDO0FBQ2pFLGdCQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7QUFFdEQsbUJBQU8sY0FBYyxHQUFHLElBQUksR0FBRyxjQUFjLEdBQUcsSUFBSSxHQUFHLGVBQWUsR0FBRyxJQUFJLEdBQUcsZ0JBQWdCLEdBQUcsSUFBSSxHQUNuRyxlQUFlLEdBQUcsSUFBSSxHQUFHLGVBQWUsR0FBRyxJQUFJLEdBQUcsZ0JBQWdCLEdBQUcsSUFBSSxHQUFHLGlCQUFpQixDQUFDO1NBQ3JHOzs7ZUFFYyx5QkFBQyxPQUFPLEVBQUU7QUFDckIsbUJBQU8sQ0FBQyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsRUFBRSxHQUFHLGtEQUFrRCxHQUNsRiw2REFBNkQsR0FDN0QsK0RBQStELEdBQUcsT0FBTyxDQUFDLEtBQUssR0FBRyxZQUFZLEdBQzlGLDBEQUEwRCxJQUN6RCxFQUFFLENBQUMsS0FBSyxHQUFHLE1BQU0sR0FBRyxPQUFPLENBQUMsRUFBRSxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUEsQUFBQyxHQUM5QyxXQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLE1BQU0sSUFDN0YsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsWUFBWSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUEsQUFBQyxJQUMzRixPQUFPLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxNQUFNLEdBQUcsRUFBRSxDQUFBLEFBQUMsR0FDM0MsUUFBUSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FDL0MsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxHQUMvQiwyQkFBMkIsR0FBRyxPQUFPLENBQUMsR0FBRyxHQUFHLGVBQWUsR0FDM0Qsb0JBQW9CLENBQ3ZCLENBQUM7U0FDTDs7O1dBbE9nQixhQUFhOzs7cUJBQWIsYUFBYTs7Ozs7Ozs7Ozs7Ozs7SUNQYixZQUFZO0FBQ2xCLGFBRE0sWUFBWSxDQUNqQixHQUFHLEVBQUU7OEJBREEsWUFBWTs7QUFFekIsWUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7QUFDaEIsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQztBQUNyRCx1QkFBVyxFQUFFLEtBQUs7QUFDbEIsbUJBQU8sRUFBRSxHQUFHO0FBQ1osZUFBRyxFQUFFLElBQUk7QUFDVCxvQkFBUSxFQUFFLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuRSxDQUFDLENBQUM7O0FBRUgsWUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ3RCOztpQkFYZ0IsWUFBWTs7ZUFhbEIsdUJBQUcsRUFBRTs7O2VBRVQsaUJBQUMsSUFBSSxFQUFFO0FBQ1YsZ0JBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUNyQixnQkFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFVBQVUsRUFBSztBQUN6QixvQkFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRTtvQkFDekMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUMsMkJBQVcsQ0FBQyxJQUFJLENBQUM7QUFDYiw0QkFBUSxFQUFFLFFBQVE7QUFDbEIsMEJBQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUM7aUJBQ2pDLENBQUMsQ0FBQzthQUNOLENBQUMsQ0FBQzs7QUFFSCxnQkFBSSxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN0RCxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3RDOzs7ZUFFVSxxQkFBQyxVQUFVLEVBQUUsRUFBRTs7O2VBRXJCLGlCQUFHO0FBQ0osZ0JBQUksU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0MsZ0JBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztTQUN0Qzs7O2VBRUssa0JBQUc7QUFDTCxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pDOzs7ZUFDTSxtQkFBRztBQUNOLGdCQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1Qjs7O1dBMUNnQixZQUFZOzs7cUJBQVosWUFBWTs7Ozs7Ozs7Ozs7Ozs7SUNBWixZQUFZO0FBQ2xCLGFBRE0sWUFBWSxDQUNqQixHQUFHLEVBQUU7OEJBREEsWUFBWTs7QUFFekIsWUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7QUFDaEIsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQy9CLGVBQUcsRUFBRSxJQUFJO1NBQ1osQ0FBQyxDQUFDO0FBQ0gsWUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ3RCOztpQkFQZ0IsWUFBWTs7ZUFTbEIsdUJBQUc7OztBQUNWLGdCQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFDLFVBQVU7dUJBQUssTUFBSyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7YUFBQSxDQUFDLENBQUM7QUFDeEUsZ0JBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxVQUFDLFVBQVUsRUFBSztBQUM3QyxrQkFBRSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDL0MsQ0FBQyxDQUFBO1NBQ0w7OztlQUVNLGlCQUFDLElBQUksRUFBRTtBQUNWLG1CQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3ZDOzs7ZUFFVSxxQkFBQyxZQUFZLEVBQUU7QUFDdEIsZ0JBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUxRCxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUMxQixnQkFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFO0FBQ2xDLG9CQUFJLEVBQUUsNkJBQTZCO0FBQ25DLHNCQUFNLEVBQUUsR0FBRzthQUNkLENBQUMsQ0FBQztTQUNOOzs7ZUFFSSxpQkFBRztBQUNKLGdCQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzVCLHFCQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQzNCLHlCQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzdCLENBQUMsQ0FBQztTQUNOOzs7ZUFFSyxrQkFBRztBQUNMLGdCQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakM7OztlQUNNLG1CQUFHO0FBQ04sZ0JBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCOzs7ZUFFZSwwQkFBQyxPQUFPLEVBQUU7QUFDdEIsZ0JBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0MsbUJBQU87QUFDSCxzQkFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzthQUNyQyxDQUFDO1NBQ0w7OztXQWpEZ0IsWUFBWTs7O3FCQUFaLFlBQVk7Ozs7Ozs7Ozs7Ozs7O0lDQVosYUFBYTtBQUNuQixhQURNLGFBQWEsQ0FDbEIsR0FBRyxFQUFFOzhCQURBLGFBQWE7O0FBRTFCLFlBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFlBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUMvQixlQUFHLEVBQUUsR0FBRztTQUNYLENBQUMsQ0FBQztBQUNILFlBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFlBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUN0Qjs7aUJBUmdCLGFBQWE7O2VBVW5CLHVCQUFHOzs7QUFDVixhQUFDLENBQUMsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQ25DLElBQUksQ0FBQyxVQUFDLFNBQVMsRUFBSztBQUNqQixvQkFBSSxhQUFhLEdBQUcsTUFBSyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RELHNCQUFLLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUN0QyxDQUFDLENBQUM7O0FBRVAsZ0JBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUU5QyxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQzVDLHNCQUFLLGFBQWEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RCxpQkFBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQUssYUFBYSxDQUFDLENBQUM7QUFDN0Msc0JBQUssTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzFCLHNCQUFLLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUNyQyxnQ0FBWSxFQUFFLEdBQUc7QUFDakIsK0JBQVcsRUFBRSxJQUFJO2lCQUNwQixDQUFDLENBQUM7YUFDTixDQUFDLENBQUM7O0FBRUgsZ0JBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxVQUFDLEtBQUssRUFBSztBQUMzQyxzQkFBSyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLHNCQUFLLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUMxQixpQkFBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ2hDLENBQUMsQ0FBQzs7QUFFSCxhQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQzdCLG9CQUFJLE1BQUssYUFBYSxFQUNsQixDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDdkIsd0JBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUU7QUFDdEIsdUJBQUcsRUFBRSxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUU7aUJBQ3hCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUVWLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2FBRWxDLENBQUMsQ0FBQztTQUNOOzs7ZUFFYSx3QkFBQyxhQUFhLEVBQUU7OztBQUMxQixhQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxVQUFDLENBQUMsRUFBRSxRQUFRLEVBQUs7QUFDbkMsb0JBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUU7b0JBQ2xDLE1BQU0sR0FBRyxFQUFFLENBQUM7O0FBRWhCLHlCQUFTLENBQUMsYUFBYSxDQUFDLFVBQUMsRUFBRSxFQUFLO0FBQzVCLDBCQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUNuQixDQUFDLENBQUM7O0FBRUgsb0JBQUksWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDdkMseUJBQUssRUFBRSxNQUFNO2lCQUNoQixDQUFDLENBQUM7QUFDSCw0QkFBWSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztBQUV6RCx1QkFBSyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3JDLENBQUMsQ0FBQztTQUNOOzs7ZUFFTyxvQkFBRztBQUNQLGdCQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQy9CLGdCQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixnQkFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDM0I7OztlQUVpQiw0QkFBQyxPQUFPLEVBQUU7QUFDeEIsZ0JBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO2dCQUNwQyxJQUFJLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFdkMsbUJBQU87QUFDSCx5QkFBUyxFQUFFLEtBQUs7QUFDaEIsMkJBQVcsRUFBRSxHQUFHO0FBQ2hCLDJCQUFXLEVBQUUsS0FBSztBQUNsQiw0QkFBWSxFQUFFLENBQUM7YUFDbEIsQ0FBQztTQUNMOzs7ZUFFYyx5QkFBQyxrQkFBa0IsRUFBRTtBQUNoQyxnQkFBSSxTQUFTLEdBQUc7QUFDWixzQkFBTSxFQUFFLEVBQUU7QUFDVixvQkFBSSxFQUFFLEVBQUU7QUFDUixtQkFBRyxFQUFFLEVBQUU7YUFDVixDQUFDOztBQUVGLGFBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFDLENBQUMsRUFBRSxLQUFLLEVBQUs7QUFDakMsb0JBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxFQUFFO0FBQ3ZFLDZCQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDM0MsNkJBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztpQkFDM0MsTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDckYsNkJBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUN6Qyw2QkFBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2lCQUMzQzthQUNKLENBQUMsQ0FBQzs7QUFFSCxxQkFBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNyQixtQkFBTyxTQUFTLENBQUM7U0FDcEI7OztXQXRHZ0IsYUFBYTs7O3FCQUFiLGFBQWE7Ozs7Ozs7Ozs7Ozs7O0lDQWIsTUFBTTtBQUNaLGFBRE0sTUFBTSxDQUNYLFFBQVEsRUFBRTs7OzhCQURMLE1BQU07O0FBRW5CLFlBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQzFCLFlBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQzs7QUFFaEMsWUFBSSxDQUFDLE9BQU8sR0FBRztBQUNYLGlCQUFLLEVBQUUsb0NBQW9DO0FBQzNDLGdCQUFJLEVBQUUscUNBQXFDO0FBQzNDLGdCQUFJLEVBQUUsYUFBYTtBQUNuQixpQkFBSyxFQUFFLGNBQWM7U0FDeEIsQ0FBQzs7QUFFRixZQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQzs7QUFFdkIsU0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsUUFBUSxFQUFLO0FBQ2hDLGtCQUFLLFFBQVEsQ0FBQyxHQUFJLFlBQWE7a0RBQVQsSUFBSTtBQUFKLHdCQUFJOzs7QUFDdEIsc0JBQUssSUFBSSxNQUFBLFNBQUMsUUFBUSxTQUFLLElBQUksRUFBQyxDQUFDO2FBQ2hDLEFBQUMsQ0FBQztTQUNOLENBQUMsQ0FBQztLQUNOOztpQkFuQmdCLE1BQU07O2VBOEJaLHFCQUFDLFFBQVEsRUFBRTtBQUNsQixnQkFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7U0FDakM7OztlQUVHLGNBQUMsT0FBTyxFQUFjO0FBQ3RCLGdCQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFDMUIsT0FBTzs7K0NBRkUsT0FBTztBQUFQLHVCQUFPOzs7QUFJcEIsZ0JBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2dCQUM3QixRQUFRLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVyRCxtQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUN0RDs7O2VBRVUscUJBQUMsVUFBVSxFQUFFO0FBQ3BCLGdCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3pDLG1CQUFPLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ3JDOzs7YUEzQmtCLGVBQUc7QUFDbEIsbUJBQU87QUFDSCxxQkFBSyxFQUFFLENBQUM7QUFDUixvQkFBSSxFQUFFLENBQUM7QUFDUCxvQkFBSSxFQUFFLENBQUM7QUFDUCxxQkFBSyxFQUFFLENBQUM7YUFDWCxDQUFDO1NBQ0w7OztXQTVCZ0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUHJveHkgZnJvbSAnLi9Qcm94eSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZldGNoZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9wcm94eSA9IG5ldyBQcm94eSgpO1xuICAgICAgICB0aGlzLl9vcHRpb25zID0ge1xuICAgICAgICAgICAgc3RhcnR0aW1lOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQnKSxcbiAgICAgICAgICAgIGVuZHRpbWU6IG1vbWVudCgpLmFkZCgxLCAnZGF5cycpLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fdXJsID0gXCJodHRwczovL2VhcnRocXVha2UudXNncy5nb3YvZmRzbndzL2V2ZW50LzEvcXVlcnk/Zm9ybWF0PWdlb2pzb24mZXZlbnR0eXBlPWVhcnRocXVha2Umb3JkZXJieT1tYWduaXR1ZGVcIjtcbiAgICB9XG5cbiAgICBmZXRjaERhdGEoKSB7XG4gICAgICAgIEVRLmxvZ2dlci5pbmZvKCdGZXRjaGluZyBuZXcgZGF0YSBmcm9tJywgRVEucHJveHkpO1xuICAgICAgICBsZXQgcHJvbWlzZVRvUmV0dXJuID0gbnVsbDtcbiAgICAgICAgc3dpdGNoIChFUS5wcm94eSkge1xuICAgICAgICBjYXNlICd0ZXN0JzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwcm9taXNlVG9SZXR1cm4gPSB0aGlzLl9wcm94eS5nZXRUZXN0RGF0YSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICBjYXNlICdyZWFsJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkKCcjbG9hZGluZy13aW5kb3cnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgcHJvbWlzZVRvUmV0dXJuID0gdGhpcy5fZ2V0RnJvbUFQSSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICBjYXNlICdlbXB0eSc6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcHJvbWlzZVRvUmV0dXJuID0gdGhpcy5fcHJveHkuZ2V0RW1wdHlEYXRhKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJvbWlzZVRvUmV0dXJuO1xuICAgIH1cblxuICAgIHNldChkYXRhS2V5LCBkYXRhKSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnNbZGF0YUtleV0gPSBkYXRhO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfZ2V0RnJvbUFQSSgpIHtcbiAgICAgICAgbGV0IHVybCA9IHRoaXMuX3VybDtcbiAgICAgICAgJC5lYWNoKHRoaXMuX29wdGlvbnMsIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB1cmwgKz0gJyYnICsga2V5ICsgJz0nICsgdmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gJC5nZXRKU09OKHVybCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgJCgnI2xvYWRpbmctd2luZG93JykuaGlkZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBQcm94eSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2RhdGEgPSBudWxsO1xuICAgICAgICB0aGlzLl9lbXB0eURhdGEgPSBudWxsO1xuICAgIH1cblxuICAgIGdldFRlc3REYXRhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YSA/XG4gICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLl9kYXRhKTtcbiAgICAgICAgICAgIH0pIDpcbiAgICAgICAgICAgICQuZ2V0SlNPTignYXNzZXRzL3Byb3h5LWRhdGEuanNvbicpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEVtcHR5RGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VtcHR5RGF0YSA/XG4gICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLl9lbXB0eURhdGEpO1xuICAgICAgICAgICAgfSkgOlxuICAgICAgICAgICAgJC5nZXRKU09OKCdhc3NldHMvcHJveHktZW1wdHlkYXRhLmpzb24nKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZW1wdHlEYXRhID0gZGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFwaE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge31cblxuICAgIGRyYXdHcmFwaCh2aXNpYmxlRWFydGhxdWFrZXMpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLl9ub3JtYWxpemVEYXRhKHZpc2libGVFYXJ0aHF1YWtlcyk7XG4gICAgICAgICQoJyNjaGFydC1zdmcnKS5lbXB0eSgpO1xuXG4gICAgICAgIG52LmFkZEdyYXBoKCgpID0+IHtcbiAgICAgICAgICAgIEVRLmxvZ2dlci5pbmZvKCdDcmVhdGluZyBuZXcgZ3JhcGgnKTtcbiAgICAgICAgICAgIHZhciBjaGFydCA9IG52Lm1vZGVscy5zY2F0dGVyQ2hhcnQoKVxuICAgICAgICAgICAgICAgIC51c2VWb3Jvbm9pKHRydWUpXG4gICAgICAgICAgICAgICAgLmNvbG9yKGQzLnNjYWxlLmNhdGVnb3J5MTAoKS5yYW5nZSgpKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbigzMDApXG5cbiAgICAgICAgICAgIGNoYXJ0LnNjYXR0ZXIucG9pbnREb21haW4oWzAsIDEwXSk7XG5cbiAgICAgICAgICAgIGNoYXJ0Lm5vRGF0YShcIk5vIGRhdGEgdG8gZGlzcGxheVwiKTtcbiAgICAgICAgICAgIGNoYXJ0LnRvb2x0aXAuY29udGVudEdlbmVyYXRvcigoZGF0YSkgPT4gdGhpcy5fZ2V0VG9vbHRpcChkYXRhKSk7XG4gICAgICAgICAgICAvL2NoYXJ0LmRpc3BhdGNoLm9uKCdyZW5kZXJFbmQnLCBmdW5jdGlvbiAoKSB7fSk7XG5cbiAgICAgICAgICAgIEVRLmxvZ2dlci5kZWJ1ZygnQXhpcyBjb25maWd1cmF0aW9uJyk7XG4gICAgICAgICAgICAvKiBYIGF4aXMgKi9cbiAgICAgICAgICAgIGNoYXJ0LnNob3dYQXhpcyh0cnVlKTtcbiAgICAgICAgICAgIGNoYXJ0LnhBeGlzLnRpY2tGb3JtYXQoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50LnVuaXgoZCkuZm9ybWF0KCdERC1NTSwgSEg6TU0nKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjaGFydC54QXhpcy5zaG93TWF4TWluKGZhbHNlKTtcbiAgICAgICAgICAgIGxldCBkYXRlUmFuZ2VQaWNrZXIgPSAkKCcjcmVwb3J0cmFuZ2UnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKSxcbiAgICAgICAgICAgICAgICBzdGFydERhdGUgPSBtb21lbnQoZGF0ZVJhbmdlUGlja2VyLnN0YXJ0RGF0ZSkudW5peCgpLFxuICAgICAgICAgICAgICAgIGVuZERhdGUgPSBtb21lbnQoZGF0ZVJhbmdlUGlja2VyLmVuZERhdGUpLnVuaXgoKTtcblxuICAgICAgICAgICAgY2hhcnQuZm9yY2VYKFtzdGFydERhdGUsIGVuZERhdGVdKTtcblxuICAgICAgICAgICAgLyogWSBheGlzICovXG4gICAgICAgICAgICBjaGFydC5mb3JjZVkoWzAsIDEwXSk7XG4gICAgICAgICAgICBjaGFydC55QXhpcy50aWNrRm9ybWF0KGQzLmZvcm1hdCgnLjAyZicpKTtcblxuICAgICAgICAgICAgZDMuc2VsZWN0KCcjY2hhcnQtc3ZnJylcbiAgICAgICAgICAgICAgICAuZGF0dW0oZGF0YSlcbiAgICAgICAgICAgICAgICAuY2FsbChjaGFydCk7XG5cbiAgICAgICAgICAgIG52LnV0aWxzLndpbmRvd1Jlc2l6ZShjaGFydC51cGRhdGUpO1xuXG4gICAgICAgICAgICBjaGFydC5kaXNwYXRjaC5vbignc3RhdGVDaGFuZ2UnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICgnTmV3IFN0YXRlOicsIEpTT04uc3RyaW5naWZ5KGUpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLl9jaGFydCA9IGNoYXJ0O1xuICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLl9jaGFydC51cGRhdGUsIDUwMCk7XG5cbiAgICAgICAgICAgIEVRLmxvZ2dlci5pbmZvKCdOZXcgZ3JhcGggY3JlYXRlZCcpO1xuICAgICAgICAgICAgcmV0dXJuIGNoYXJ0O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfZ2V0VG9vbHRpcChkYXRhKSB7XG4gICAgICAgIGxldCBlYXJ0aHF1YWtlID0gZGF0YS5wb2ludC5lYXJ0aHF1YWtlLFxuICAgICAgICAgICAgdGl0bGUgPSBlYXJ0aHF1YWtlLmdldFByb3BlcnR5KCd0aXRsZScpLFxuICAgICAgICAgICAgZGF0ZSA9IG1vbWVudChlYXJ0aHF1YWtlLmdldFByb3BlcnR5KCd0aW1lJykpLmZvcm1hdCgnRC1NLVlZWVkgSEg6bW0nKSxcbiAgICAgICAgICAgIHBvaW50ID0gZWFydGhxdWFrZS5nZXRHZW9tZXRyeSgpLmdldCgpLFxuICAgICAgICAgICAgbGF0aXR1ZGUgPSBwb2ludC5sYXQoKSxcbiAgICAgICAgICAgIGxvbmdpdHVkZSA9IHBvaW50LmxuZygpLFxuICAgICAgICAgICAgbWFnbml0dWRlID0gZWFydGhxdWFrZS5nZXRQcm9wZXJ0eSgnbWFnJyksXG4gICAgICAgICAgICBwbGF0ZSA9IGRhdGEuc2VyaWVzWzBdLmtleTtcblxuICAgICAgICBsZXQgdG9vbHRpcCA9ICQoJzxkaXY+PGI+JyArIHRpdGxlICsgJzwvYj48YnI+JyArXG4gICAgICAgICAgICBwbGF0ZSArICc8L2JyPicgK1xuICAgICAgICAgICAgJ1Bvc2l0aW9uOiAnICsgRVEubWFwLmNvbnZlcnRDb29yZGluYXRlcyhsYXRpdHVkZSwgbG9uZ2l0dWRlKSArICc8YnI+JyArXG4gICAgICAgICAgICAnTWFnbml0dWRlOiAnICsgbWFnbml0dWRlICsgJzxicj4nICtcbiAgICAgICAgICAgICdEYXRlOiAnICsgZGF0ZSArICc8YnI+PC9kaXY+Jyk7XG5cblxuICAgICAgICBFUS5sb2dnZXIuZGVidWcoJ1Rvb2x0aXAgZm9yJywgZWFydGhxdWFrZS5nZXRJZCgpKTtcbiAgICAgICAgcmV0dXJuIHRvb2x0aXAuaHRtbCgpO1xuICAgIH1cblxuICAgIF9ub3JtYWxpemVEYXRhKHZpc2libGVFYXJ0aHF1YWtlcykge1xuICAgICAgICB2YXIgcGxhdGVzRGF0YSA9IHt9LFxuICAgICAgICAgICAgcmFuZG9tID0gZDMucmFuZG9tLm5vcm1hbCgpO1xuXG4gICAgICAgIEVRLmxvZ2dlci5kZWJ1ZygnTm9ybWFsaXppbmcnLCB2aXNpYmxlRWFydGhxdWFrZXMubGVuZ3RoLCAnZGF0YScpO1xuICAgICAgICAkLmVhY2godmlzaWJsZUVhcnRocXVha2VzLCAoaSwgZWFydGhxdWFrZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHBvaW50ID0gZWFydGhxdWFrZS5nZXRHZW9tZXRyeSgpLmdldCgpLFxuICAgICAgICAgICAgICAgIHBsYXRlcyA9IEVRLm1hcC5fdGVjdG9uaWNzTGF5ZXIuZ2V0UGxhdGVCeVBvaW50KHBvaW50KSxcbiAgICAgICAgICAgICAgICBwbGF0ZUlkZW50aWZpZXIgPSBwbGF0ZXMuaW5zaWRlWzBdIHx8IHBsYXRlcy5uZWFyWzBdLFxuICAgICAgICAgICAgICAgIG1hZ25pdHVkZSA9IGVhcnRocXVha2UuZ2V0UHJvcGVydHkoJ21hZycpIHx8IDAsXG4gICAgICAgICAgICAgICAgdGltZSA9IG1vbWVudChlYXJ0aHF1YWtlLmdldFByb3BlcnR5KCd0aW1lJykpLnVuaXgoKSxcbiAgICAgICAgICAgICAgICBwbGF0ZUVhcnRocXVha2VzID0gcGxhdGVzRGF0YVtwbGF0ZUlkZW50aWZpZXJdIHx8IFtdO1xuXG4gICAgICAgICAgICBwbGF0ZUVhcnRocXVha2VzLnB1c2goe1xuICAgICAgICAgICAgICAgIHg6IHRpbWUsXG4gICAgICAgICAgICAgICAgeTogbWFnbml0dWRlLFxuICAgICAgICAgICAgICAgIHNpemU6IG1hZ25pdHVkZSwgLy9Db25maWd1cmUgdGhlIHNpemUgb2YgZWFjaCBzY2F0dGVyIHBvaW50XG4gICAgICAgICAgICAgICAgc2hhcGU6IFwiY2lyY2xlXCIsIC8vQ29uZmlndXJlIHRoZSBzaGFwZSBvZiBlYWNoIHNjYXR0ZXIgcG9pbnQuXG4gICAgICAgICAgICAgICAgZWFydGhxdWFrZTogZWFydGhxdWFrZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHBsYXRlc0RhdGFbcGxhdGVJZGVudGlmaWVyXSA9IHBsYXRlRWFydGhxdWFrZXM7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBkYXRhID0gW107XG5cbiAgICAgICAgJC5lYWNoKHBsYXRlc0RhdGEsIChwbGF0ZU5hbWUsIHBsYXRlVmFsdWVzKSA9PiB7XG4gICAgICAgICAgICBkYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgIGtleTogcGxhdGVOYW1lLFxuICAgICAgICAgICAgICAgIHZhbHVlczogcGxhdGVWYWx1ZXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgRVEubG9nZ2VyLmRlYnVnKHZpc2libGVFYXJ0aHF1YWtlcy5sZW5ndGgsICdkYXRhIG5vcm1hbGl6ZWQnKTtcblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG59IiwiaW1wb3J0IEVhcnRocXVha2VNYXAgZnJvbSAnLi9tYXAvRWFydGhxdWFrZU1hcCc7XG5pbXBvcnQgR3JhcGhNYW5hZ2VyIGZyb20gJy4vZ3JhcGgvR3JhcGhNYW5hZ2VyJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi91dGlsL0xvZ2dlcic7XG5cbndpbmRvdy5FUSA9IHtcbiAgICAvKiBJbml0aWFsaXphdGlvbiBmdW5jdGlvbiAqL1xuICAgIGluaXRpYWxpemU6IF9pbml0aWFsaXplLFxuICAgIC8qIFNob3dzIGRlYnVnIGluZm9ybWF0aW9uICovXG4gICAgZGVidWc6IGZhbHNlLFxuICAgIC8qIEFsbG93cyB0byBjaG9vc2UgZGF0YSBzb3VyY2VcbiAgICAgKlxuICAgICAqICdlbXB0eScgLT4gbm8gZGF0YSBmb3VuZCBmb3IgZWFjaCBmaWx0ZXIgb3B0aW9uIHNwZWNpZmllZCwgXG4gICAgICogJ3Rlc3QnIC0+IHRlc3QgZGF0YSwgc2FtZSBkYXRhIGlzIHJldHVybmVkIGZvciBlYWNoIGZpbHRlciBvcHRpb24gc3BlY2lmaWVkLCBcbiAgICAgKiAncmVhbCcgLT4gcmVhbCBkYXRhLCBkYXRhIHJldHVybmVkIGFyZSByZWFsIG9uZXNcbiAgICAgKi9cbiAgICBwcm94eTogJ3JlYWwnLFxuICAgIC8qIFdpbGwgY29udGFpbiBtYWluIG9iamVjdHMgKi9cbiAgICBtYXA6IG51bGwsXG4gICAgZ3JhcGhNYW5hZ2VyOiBuZXcgR3JhcGhNYW5hZ2VyKCksXG4gICAgLyogU2ltcGxlIGNvbmZpZ3VyYWJsZSBsb2dnZXIsIGFibGUgdG8gc2hvdyBjb25zb2xlIG1lc3NhZ2VzIGRlcGVuZGluZyBvbiBMb2dMZXZlbCBzcGVjaWZpZWQgKi9cbiAgICBsb2dnZXI6IG5ldyBMb2dnZXIoTG9nZ2VyLkxvZ0xldmVsLmRlYnVnKVxufTtcblxuLyogaW5pdGlhbGl6YXRpb24gd2hlbiBHbWFwcyBpcyBsb2FkZWQgKi9cbi8qIGluaXRpYWxpemF0aW9uIGNhbiBzdGFydCB3aGVuIEcgbWFwcyBBUEkgYW5kIGRvY3VtZW50IGFyZSBmdWxseSBsb2FkZWQgKi9cbmZ1bmN0aW9uIF9pbml0aWFsaXplKCkge1xuICAgICQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8qIEluaXRpYWxpemUgTWFwIG9iamVjdCAqL1xuICAgICAgICBsZXQgem9vbSA9IDIsXG4gICAgICAgICAgICBjZW50ZXIgPSB7XG4gICAgICAgICAgICAgICAgbGF0OiA0MS44NTAsXG4gICAgICAgICAgICAgICAgbG5nOiAtODcuNjUwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIEVRLmxvZ2dlci5kZWJ1ZygnTWFwIGluaXRpYWxpemF0aW9uJyk7XG4gICAgICAgIEVRLm1hcCA9IG5ldyBFYXJ0aHF1YWtlTWFwKHpvb20sIGNlbnRlcik7XG4gICAgICAgIEVRLm1hcC5pbml0aWFsaXplTWFwKCk7XG5cbiAgICAgICAgLyogZmlyc3QgdGltZSBkYXRhIGZldGNoICovXG4gICAgICAgIEVRLm1hcC5yZWZyZXNoRGF0YSgpO1xuXG4gICAgICAgIEVRLmxvZ2dlci5kZWJ1ZygnRVEgaW5pdGlhbGl6ZWQnLCBFUS5kZWJ1ZyA/ICcgaW4gZGV2IG1vZGUnIDogdW5kZWZpbmVkKTtcbiAgICAgICAgRVEubG9nZ2VyLmRlYnVnKCdWaXN1YWxpemF0aW9uIHR5cGUgaW5pdGlhbGl6YXRpb24nKTtcbiAgICAgICAgLyogc2V0IGhhbmRsZXIgZm9yIHZpc3VhbGl6YXRpb24gdHlwZSAtPiBsaXN0ICovXG4gICAgICAgICQoJ2RpdiNyYWRpby1vcHRpb25zIGlucHV0JykuY2hhbmdlKCgpID0+IEVRLm1hcC5zZXRWaXN1YWxpemF0aW9uVHlwZSgkKCdkaXYjcmFkaW8tb3B0aW9ucyBpbnB1dDpjaGVja2VkJykudmFsKCkpKTtcblxuICAgICAgICBFUS5sb2dnZXIuZGVidWcoJ01hZ25pdHVkZSByYW5nZSBpbml0aWFsaXphdGlvbicpO1xuICAgICAgICAvKiBzbGlkZXIgaW5pdGlhbGl6YXRpb24gKi9cbiAgICAgICAgJChcIiNtYWduaXR1ZGUtcmFuZ2VcIilcbiAgICAgICAgICAgIC5zbGlkZXIoe30pXG4gICAgICAgICAgICAub24oJ3NsaWRlU3RvcCcsIChldnQpID0+IHtcbiAgICAgICAgICAgICAgICBFUS5sb2dnZXIuaW5mbygnTmV3IG1hZ25pdHVkZSByYW5nZScsIGV2dC52YWx1ZVswXSwgJy0nLCBldnQudmFsdWVbMV0pO1xuICAgICAgICAgICAgICAgIEVRLm1hcC5mZXRjaGVyXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoJ21pbm1hZ25pdHVkZScsIGV2dC52YWx1ZVswXSlcbiAgICAgICAgICAgICAgICAgICAgLnNldCgnbWF4bWFnbml0dWRlJywgZXZ0LnZhbHVlWzFdKTtcbiAgICAgICAgICAgICAgICBFUS5tYXAucmVmcmVzaERhdGEoKTtcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgLyogRGF0ZSByYW5nZSBwaWNrZXIgaW5pdGlhbGl6YXRpb24gKi9cbiAgICAgICAgZnVuY3Rpb24gY2Ioc3RhcnQsIGVuZCkge1xuICAgICAgICAgICAgJCgnI3JlcG9ydHJhbmdlIHNwYW4nKS5odG1sKHN0YXJ0LmZvcm1hdCgnRCBNTU1NLCBZWVlZJykgKyAnIC0gJyArIGVuZC5mb3JtYXQoJ0QgTU1NTSwgWVlZWScpKTtcbiAgICAgICAgfVxuICAgICAgICBjYihtb21lbnQoKSwgbW9tZW50KCkpO1xuICAgICAgICAvKiBEYXRlIHJhbmdlIHBpY2tlciBpbml0aWFsaXphdGlvbiAqL1xuICAgICAgICAkKCcjcmVwb3J0cmFuZ2UnKS5kYXRlcmFuZ2VwaWNrZXIoe1xuICAgICAgICAgICAgcmFuZ2VzOiB7XG4gICAgICAgICAgICAgICAgJ1RvZGF5JzogW21vbWVudCgpLCBtb21lbnQoKV0sXG4gICAgICAgICAgICAgICAgJ1llc3RlcmRheSc6IFttb21lbnQoKS5zdWJ0cmFjdCgxLCAnZGF5cycpLCBtb21lbnQoKS5zdWJ0cmFjdCgxLCAnZGF5cycpXSxcbiAgICAgICAgICAgICAgICAnTGFzdCA3IERheXMnOiBbbW9tZW50KCkuc3VidHJhY3QoNywgJ2RheXMnKSwgbW9tZW50KCldXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGNiKTtcblxuICAgICAgICAvKiBjYWxsYmFjayB3aGVuIGRhdGUgcmFuZ2UgY2hhbmdlcyAqL1xuICAgICAgICAkKCcjcmVwb3J0cmFuZ2UnKS5vbignYXBwbHkuZGF0ZXJhbmdlcGlja2VyJywgZnVuY3Rpb24gKGV2LCBwaWNrZXIpIHtcbiAgICAgICAgICAgIEVRLmxvZ2dlci5pbmZvKCdOZXcgZGF0ZSByYW5nZScsIHBpY2tlci5zdGFydERhdGUsICctJywgcGlja2VyLmVuZERhdGUpO1xuICAgICAgICAgICAgRVEubWFwLmZldGNoZXJcbiAgICAgICAgICAgICAgICAuc2V0KCdzdGFydHRpbWUnLCBwaWNrZXIuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpICsgJyAwMDowMDowMCcpXG4gICAgICAgICAgICAgICAgLnNldCgnZW5kdGltZScsIHBpY2tlci5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpICsgJyAyMzo1OTo1OScpO1xuICAgICAgICAgICAgRVEubWFwLnJlZnJlc2hEYXRhKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qIGdyYXBoIG1hbmFnZXIgaW5pdGlhbGl6YXRpb24gKi9cbiAgICAgICAgJCgnI3Nob3ctdGltZWxpbmUnKS5jbGljaygoKSA9PiBFUS5ncmFwaE1hbmFnZXIuZHJhd0dyYXBoKEVRLm1hcC5fdmlzaWJsZUVhcnRocXVha2VzKSk7XG5cbiAgICAgICAgLyogaGVhdG1hcCBsZWdlbmQgdG9vbHRpcCAqL1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgIH0pO1xufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENpcmNsZUxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcihtYXApIHtcbiAgICAgICAgdGhpcy5fbWFwID0gbWFwO1xuICAgICAgICB0aGlzLl9sYXllciA9IG5ldyBnb29nbGUubWFwcy5EYXRhKHtcbiAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplKCk7XG4gICAgfVxuXG4gICAgX2luaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMuX2xheWVyLnNldFN0eWxlKChlYXJ0aHF1YWtlKSA9PiB0aGlzLl9nZXRDaXJjbGVTdHlsZShlYXJ0aHF1YWtlKSk7XG4gICAgICAgIHRoaXMuX3BhbGV0dGVTY2FsZSA9IGQzLnNjYWxlLnF1YW50aXplKClcbiAgICAgICAgICAgIC5kb21haW4oWzAsIDEwXSlcbiAgICAgICAgICAgIC5yYW5nZShjb2xvcmJyZXdlci5ZbE9yUmRbNl0pO1xuICAgIH1cblxuICAgIGFkZERhdGEoZGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGF5ZXIuYWRkR2VvSnNvbihkYXRhKTtcbiAgICB9XG5cblxuICAgIHNldFNlbGVjdGVkKGVhcnRocXVha2VJZCkge31cblxuICAgIGVtcHR5KCkge1xuICAgICAgICBsZXQgZGF0YUxheWVyID0gdGhpcy5fbGF5ZXI7XG4gICAgICAgIGRhdGFMYXllci5mb3JFYWNoKChmZWF0dXJlKSA9PiB7XG4gICAgICAgICAgICBkYXRhTGF5ZXIucmVtb3ZlKGZlYXR1cmUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBlbmFibGUoKSB7XG4gICAgICAgIHRoaXMuX2xheWVyLnNldE1hcCh0aGlzLl9tYXApO1xuICAgIH1cblxuICAgIGRpc2FibGUoKSB7XG4gICAgICAgIHRoaXMuX2xheWVyLnNldE1hcChudWxsKTtcbiAgICB9XG5cbiAgICAvKiBzZXQgY2lyY2xlIHN0eWxlIG1hcCB2aXN1YWxpemF0aW9uICovXG4gICAgX2dldENpcmNsZVN0eWxlKGZlYXR1cmUpIHtcbiAgICAgICAgbGV0IG1hZ25pdHVkZSA9IGZlYXR1cmUuZ2V0UHJvcGVydHkoJ21hZycpLFxuICAgICAgICAgICAgY29sb3IgPSB0aGlzLl9wYWxldHRlU2NhbGUobWFnbml0dWRlKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWNvbjoge1xuICAgICAgICAgICAgICAgIHBhdGg6IGdvb2dsZS5tYXBzLlN5bWJvbFBhdGguQ0lSQ0xFLFxuICAgICAgICAgICAgICAgIHN0cm9rZVdlaWdodDogMSxcbiAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IGNvbG9yLFxuICAgICAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLjksXG4gICAgICAgICAgICAgICAgc2NhbGU6IG1hZ25pdHVkZSAqIDJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB6SW5kZXg6IE1hdGguZmxvb3IobWFnbml0dWRlICogMTApXG4gICAgICAgIH07XG4gICAgfVxufSIsImltcG9ydCBUZWN0b25pY0xheWVyIGZyb20gJy4vVGVjdG9uaWNMYXllcic7XG5pbXBvcnQgTWFya2Vyc0xheWVyIGZyb20gJy4vTWFya2Vyc0xheWVyJztcbmltcG9ydCBDaXJjbGVMYXllciBmcm9tICcuL0NpcmNsZUxheWVyJztcbmltcG9ydCBIZWF0TWFwTGF5ZXIgZnJvbSAnLi9IZWF0TWFwTGF5ZXInO1xuXG5pbXBvcnQgRmV0Y2hlciBmcm9tICcuLi9kYXRhL0ZldGNoZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYXJ0aHF1YWtlTWFwIHtcbiAgICBjb25zdHJ1Y3Rvcih6b29tLCBjZW50ZXIpIHtcbiAgICAgICAgdGhpcy5fbWFwID0gbnVsbDtcblxuICAgICAgICB0aGlzLl90ZWN0b25pY3NMYXllciA9IG51bGxcblxuICAgICAgICAvKiBtYXAgbGF5ZXJzICovXG4gICAgICAgIHRoaXMuX2xheWVycyA9IHtcbiAgICAgICAgICAgIG1hcmtlcnNMYXllcjogbnVsbCxcbiAgICAgICAgICAgIGNpcmNsZUxheWVyOiBudWxsLFxuICAgICAgICAgICAgaGVhdE1hcExheWVyOiBudWxsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgICAgICB0aGlzLl92aXNpYmxlRWFydGhxdWFrZXMgPSBbXTtcblxuICAgICAgICB0aGlzLl96b29tID0gem9vbTtcbiAgICAgICAgdGhpcy5fdmlzdWFsaXphdGlvblR5cGUgPSBcIm1hcmtlcnNcIjtcbiAgICAgICAgLyogaW5pdGlhbCBjZW50ZXIgcG9pbnQgKi9cbiAgICAgICAgdGhpcy5fY2VudGVyID0gY2VudGVyO1xuXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkRmVhdHVyZSA9IG51bGw7XG4gICAgICAgIHRoaXMuZmV0Y2hlciA9IG5ldyBGZXRjaGVyKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZU1hcCgpIHtcbiAgICAgICAgdGhpcy5fbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyksIHtcbiAgICAgICAgICAgIHpvb206IHRoaXMuX3pvb20sXG4gICAgICAgICAgICBjZW50ZXI6IHRoaXMuX2NlbnRlcixcbiAgICAgICAgICAgIHpvb21Db250cm9sOiB0cnVlLFxuICAgICAgICAgICAgc2NhbGVDb250cm9sOiB0cnVlLFxuICAgICAgICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxuICAgICAgICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuVEVSUkFJTlxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl90ZWN0b25pY3NMYXllciA9IG5ldyBUZWN0b25pY0xheWVyKHRoaXMuX21hcCk7XG5cbiAgICAgICAgdGhpcy5fbGF5ZXJzLm1hcmtlcnNMYXllciA9IG5ldyBNYXJrZXJzTGF5ZXIodGhpcy5fbWFwKTtcbiAgICAgICAgdGhpcy5fbGF5ZXJzLmNpcmNsZUxheWVyID0gbmV3IENpcmNsZUxheWVyKHRoaXMuX21hcCk7XG4gICAgICAgIHRoaXMuX2xheWVycy5oZWF0TWFwTGF5ZXIgPSBuZXcgSGVhdE1hcExheWVyKHRoaXMuX21hcCk7XG5cbiAgICAgICAgdGhpcy5zZXRWaXN1YWxpemF0aW9uVHlwZSgnbWFya2Vyc0xheWVyJyk7XG5cbiAgICAgICAgLyogcmVmcmVzaCBsaXN0IHdoZW4gc3RvcCBtYWtpbmcgY2hhbmdlcyAqL1xuICAgICAgICB0aGlzLl9tYXAuYWRkTGlzdGVuZXIoJ2lkbGUnLCAoKSA9PiB0aGlzLl9yZWZyZXNoRWFydGhxdWFrZXNMaXN0KCkpO1xuXG5cbiAgICAgICAgRVEubG9nZ2VyLmRlYnVnKCdBZGRpbmcgbGVnZW5kIHRvIE1hcCcpO1xuICAgICAgICBsZXQgbGVnZW5kID0gJCgnI21hcC1sZWdlbmQnKTtcbiAgICAgICAgdGhpcy5fbWFwLmNvbnRyb2xzW2dvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5SSUdIVF9UT1BdLnB1c2gobGVnZW5kWzBdKTtcbiAgICAgICAgbGVnZW5kLnNob3coKTtcbiAgICB9XG5cbiAgICBzZXREYXRhKGRhdGEpIHtcbiAgICAgICAgRVEubG9nZ2VyLmluZm8oJ1NldHRpbmcgbmV3IGRhdGEnKTtcbiAgICAgICAgRVEubG9nZ2VyLmRlYnVnKCdFbXB0eWluZyBkYXRhIGxheWVycycpO1xuICAgICAgICAkLmVhY2godGhpcy5fbGF5ZXJzLCAoaSwgbGF5ZXIpID0+IHtcbiAgICAgICAgICAgIGxheWVyLmVtcHR5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qIG5lZWQgdG8gdGFrZSBub3JtYWxpemVkIGRhdGEgZnJvbSBHb29nbGUgTWFwcyBBUEkgdG8gYXZvaWQgXG4gICAgICAgIC8qIGZ1cnRoZXIgc3RlcHMgZHVyaW5nIEhlYXRNYXBDcmVhdGlvbiAqL1xuICAgICAgICBFUS5sb2dnZXIuZGVidWcoJ0FkZGluZyBkYXRhIHRvIGxheWVycycpO1xuICAgICAgICBsZXQgbm9ybWFsaXplZERhdGEgPSB0aGlzLl9sYXllcnMubWFya2Vyc0xheWVyLmFkZERhdGEoZGF0YSk7XG4gICAgICAgIHRoaXMuX2xheWVycy5jaXJjbGVMYXllci5hZGREYXRhKGRhdGEpO1xuICAgICAgICB0aGlzLl9sYXllcnMuaGVhdE1hcExheWVyLmFkZERhdGEobm9ybWFsaXplZERhdGEpO1xuXG4gICAgICAgIEVRLmxvZ2dlci5kZWJ1ZygnU3RvcmluZyBuZXcgZGF0YScpO1xuICAgICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgICAgICQuZWFjaChkYXRhLmZlYXR1cmVzLCAoaSwgZWFydGhxdWFrZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fZGF0YVtlYXJ0aHF1YWtlLmlkXSA9IGVhcnRocXVha2U7XG4gICAgICAgIH0pXG5cbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcih0aGlzLl9tYXAsICdpZGxlJyk7XG4gICAgfVxuXG4gICAgc2V0VmlzdWFsaXphdGlvblR5cGUodmlzdWFsaXphdGlvblR5cGUpIHtcbiAgICAgICAgRVEubG9nZ2VyLmRlYnVnKCdOZXcgdmlzdWFsaXphdGlvbiB0eXBlJywgdmlzdWFsaXphdGlvblR5cGUpO1xuICAgICAgICB0aGlzLl92aXN1YWxpemF0aW9uVHlwZSA9IHZpc3VhbGl6YXRpb25UeXBlO1xuXG4gICAgICAgICQuZWFjaCh0aGlzLl9sYXllcnMsIChsYXllck5hbWUsIGxheWVyKSA9PiB7XG4gICAgICAgICAgICBpZiAobGF5ZXJOYW1lID09PSB2aXN1YWxpemF0aW9uVHlwZSlcbiAgICAgICAgICAgICAgICBsYXllci5lbmFibGUoKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBsYXllci5kaXNhYmxlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qIHNldCBuZXcgbGVnZW5kICovXG4gICAgICAgIEVRLmxvZ2dlci5kZWJ1ZygnU2V0dGluZyBuZXcgbGVnZW5kIGZvcicsIHZpc3VhbGl6YXRpb25UeXBlKTtcbiAgICAgICAgdGhpcy5fc2V0TGVnZW5kKHZpc3VhbGl6YXRpb25UeXBlKTtcbiAgICB9XG5cbiAgICBnZXRWaXNpYmxlRWFydGhxdWFrZXMoKSB7XG4gICAgICAgIGxldCB2aXNpYmxlRWFydGhxdWFrZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fbGF5ZXJzLm1hcmtlcnNMYXllci5fbGF5ZXIuZm9yRWFjaCgoZWFydGhxdWFrZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gZWFydGhxdWFrZS5nZXRHZW9tZXRyeSgpLmdldCgpLFxuICAgICAgICAgICAgICAgIGJvdW5kcyA9IHRoaXMuX21hcC5nZXRCb3VuZHMoKTtcbiAgICAgICAgICAgIGlmIChib3VuZHMgJiYgYm91bmRzLmNvbnRhaW5zKHBvc2l0aW9uKSkgdmlzaWJsZUVhcnRocXVha2VzLnB1c2goZWFydGhxdWFrZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB2aXNpYmxlRWFydGhxdWFrZXM7XG4gICAgfVxuXG4gICAgcmVmcmVzaERhdGEoKSB7XG4gICAgICAgIEVRLmxvZ2dlci5pbmZvKCdSZWZyZXNoaW5nIGRhdGEnKTtcbiAgICAgICAgdGhpcy5mZXRjaGVyXG4gICAgICAgICAgICAuZmV0Y2hEYXRhKClcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgLyogR2VvSlNPTiBvYmplY3QsIHR5cGU6IEZlYXR1cmVDb2xsZWN0aW9uICovXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhKGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3NldExlZ2VuZCh2aXN1YWxpemF0aW9uVHlwZSkge1xuICAgICAgICAkKCcjbWFwLWxlZ2VuZCAubWFwLWxlZ2VuZCcpLmhpZGUoKTtcbiAgICAgICAgJCgnIycgKyB2aXN1YWxpemF0aW9uVHlwZSArICctbWFwLWxlZ2VuZCcpLnNob3coKTtcbiAgICB9XG5cbiAgICAvKiBjYWxsZWQgdG8gcmVmcmVzaCB0aGUgbGlzdCBvZiBlcS5rZXMgKi9cbiAgICBfcmVmcmVzaEVhcnRocXVha2VzTGlzdCgpIHtcbiAgICAgICAgdGhpcy5fdmlzaWJsZUVhcnRocXVha2VzID0gdGhpcy5nZXRWaXNpYmxlRWFydGhxdWFrZXMoKTtcbiAgICAgICAgRVEubG9nZ2VyLmRlYnVnKCdGb3VuZCcsIHRoaXMuX3Zpc2libGVFYXJ0aHF1YWtlcy5sZW5ndGgsICd2aXNpYmxlIGVhcnRocXVha2VzJyk7XG5cbiAgICAgICAgdGhpcy5fdmlzaWJsZUVhcnRocXVha2VzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIHZhciBhVmFsID0gcGFyc2VGbG9hdChhLmdldFByb3BlcnR5KCdtYWcnKSk7XG4gICAgICAgICAgICB2YXIgYlZhbCA9IHBhcnNlRmxvYXQoYi5nZXRQcm9wZXJ0eSgnbWFnJykpO1xuXG4gICAgICAgICAgICBpZiAoaXNOYU4oYlZhbCkpXG4gICAgICAgICAgICAgICAgYlZhbCA9IC0xO1xuICAgICAgICAgICAgaWYgKGlzTmFOKGFWYWwpKVxuICAgICAgICAgICAgICAgIGFWYWwgPSAtMTtcblxuICAgICAgICAgICAgcmV0dXJuIGJWYWwgLSBhVmFsO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcjZWFydGhxdWFrZS1saXN0JykuZW1wdHkoKTtcblxuICAgICAgICAkLmVhY2godGhpcy5fdmlzaWJsZUVhcnRocXVha2VzLCAoaSwgZWFydGhxdWFrZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGlkID0gZWFydGhxdWFrZS5nZXRJZCgpO1xuICAgICAgICAgICAgbGV0IGxpc3RFbGVtZW50ID0gdGhpcy5fZ2V0TGlzdEVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICB0aXRsZTogZWFydGhxdWFrZS5nZXRQcm9wZXJ0eSgndGl0bGUnKSxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogZWFydGhxdWFrZS5nZXRHZW9tZXRyeSgpLmdldCgpLFxuICAgICAgICAgICAgICAgIGluZGV4OiBpICsgMSxcbiAgICAgICAgICAgICAgICB0b3RhbDogdGhpcy5fdmlzaWJsZUVhcnRocXVha2VzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBtYWduaXR1ZGU6IGVhcnRocXVha2UuZ2V0UHJvcGVydHkoJ21hZycpLFxuICAgICAgICAgICAgICAgIHRzdW5hbWk6IChlYXJ0aHF1YWtlLmdldFByb3BlcnR5KCd0c3VuYW1pJykgPT09IDEpID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRlcHRoOiB0aGlzLl9kYXRhW2lkXS5nZW9tZXRyeS5jb29yZGluYXRlc1syXSwgLy8gZGVwdGggaW4ga21cbiAgICAgICAgICAgICAgICBkYXRlOiBtb21lbnQoZWFydGhxdWFrZS5nZXRQcm9wZXJ0eSgndGltZScpKS5mb3JtYXQoJ0QvTS9ZWVlZIEhIOm1tJyksXG4gICAgICAgICAgICAgICAgdXJsOiBlYXJ0aHF1YWtlLmdldFByb3BlcnR5KCd1cmwnKSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsaXN0RWxlbWVudC5jbGljaygoKSA9PiB0aGlzLnNlbGVjdEVhcnRocXVha2UoZWFydGhxdWFrZSkpO1xuICAgICAgICAgICAgJCgnI2VhcnRocXVha2UtbGlzdCcpLmFwcGVuZChsaXN0RWxlbWVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJyNlYXJ0aHF1YWtlLW51bWJlci1iYWRnZScpLmh0bWwodGhpcy5fdmlzaWJsZUVhcnRocXVha2VzLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgc2VsZWN0RWFydGhxdWFrZShlYXJ0aHF1YWtlKSB7XG4gICAgICAgIGxldCBpZCA9IGVhcnRocXVha2UuZ2V0SWQoKTtcblxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0ZWRGZWF0dXJlKSB7XG4gICAgICAgICAgICBsZXQgb2xkSWQgPSB0aGlzLl9zZWxlY3RlZEZlYXR1cmUuZ2V0SWQoKTtcbiAgICAgICAgICAgICQoJyMnICsgb2xkSWQpLnJlbW92ZUNsYXNzKFwiZWFydGhxdWFrZS1saXN0LWl0ZW0tc2VsZWN0ZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaXRlbSA9ICQoJyMnICsgaWQpO1xuICAgICAgICBpdGVtLmFkZENsYXNzKFwiZWFydGhxdWFrZS1saXN0LWl0ZW0tc2VsZWN0ZWRcIik7XG5cbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRGZWF0dXJlID0gZWFydGhxdWFrZTtcblxuICAgICAgICAkLmVhY2godGhpcy5fbGF5ZXJzLCAobGF5ZXJOYW1lLCBsYXllcikgPT4gbGF5ZXIuc2V0U2VsZWN0ZWQodGhpcy5fc2VsZWN0ZWRGZWF0dXJlLmdldElkKCkpKTtcblxuICAgICAgICBsZXQgY29udGFpbmVyID0gJCgnI2xpc3QtcGFuZWwnKSxcbiAgICAgICAgICAgIHNjcm9sbFRvID0gaXRlbTtcblxuICAgICAgICBjb250YWluZXIuc2Nyb2xsVG9wKDApO1xuICAgICAgICBjb250YWluZXIuc2Nyb2xsVG9wKFxuICAgICAgICAgICAgc2Nyb2xsVG8ub2Zmc2V0KCkudG9wIC0gY29udGFpbmVyLm9mZnNldCgpLnRvcFxuICAgICAgICApO1xuXG4gICAgICAgIEVRLmxvZ2dlci5kZWJ1ZygnU2VsZWN0ZWQgZWFydGhxdWFrZScsIGlkKTtcbiAgICB9XG5cbiAgICBjb252ZXJ0Q29vcmRpbmF0ZXMobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICAgICAgICAvKiogTGF0aXR1ZGUgKi9cbiAgICAgICAgbGV0IGNvbnZlcnRlZExhdGl0dWRlID0gTWF0aC5hYnMobGF0aXR1ZGUpLFxuICAgICAgICAgICAgbGF0aXR1ZGVDYXJkaW5hbCA9ICgobGF0aXR1ZGUgPiAwKSA/IFwiTlwiIDogXCJTXCIpLFxuICAgICAgICAgICAgbGF0aXR1ZGVEZWdyZWUgPSBNYXRoLmZsb29yKGNvbnZlcnRlZExhdGl0dWRlKTtcblxuICAgICAgICBjb252ZXJ0ZWRMYXRpdHVkZSA9IChjb252ZXJ0ZWRMYXRpdHVkZSAtIGxhdGl0dWRlRGVncmVlKSAqIDYwO1xuICAgICAgICBsZXQgbGF0aXR1ZGVQcmltZXMgPSBNYXRoLmZsb29yKGNvbnZlcnRlZExhdGl0dWRlKTtcblxuICAgICAgICBjb252ZXJ0ZWRMYXRpdHVkZSA9IChjb252ZXJ0ZWRMYXRpdHVkZSAtIGxhdGl0dWRlUHJpbWVzKSAqIDYwO1xuICAgICAgICBsZXQgbGF0aXR1ZGVTZWNvbmRzID0gTWF0aC5mbG9vcihjb252ZXJ0ZWRMYXRpdHVkZSk7XG5cbiAgICAgICAgLyoqIExvbmdpdHVkZSAqL1xuICAgICAgICBsZXQgY29udmVydGVkTG9uZ2l0dWRlID0gTWF0aC5hYnMobG9uZ2l0dWRlKSxcbiAgICAgICAgICAgIExvbmdpdHVkZUNhcmRpbmFsID0gKChsb25naXR1ZGUgPiAwKSA/IFwiRVwiIDogXCJXXCIpLFxuICAgICAgICAgICAgTG9uZ2l0dWRlRGVncmVlID0gTWF0aC5mbG9vcihjb252ZXJ0ZWRMb25naXR1ZGUpO1xuXG4gICAgICAgIGNvbnZlcnRlZExvbmdpdHVkZSA9IChjb252ZXJ0ZWRMb25naXR1ZGUgLSBMb25naXR1ZGVEZWdyZWUpICogNjA7XG4gICAgICAgIGxldCBMb25naXR1ZGVQcmltZXMgPSBNYXRoLmZsb29yKGNvbnZlcnRlZExvbmdpdHVkZSk7XG5cbiAgICAgICAgY29udmVydGVkTG9uZ2l0dWRlID0gKGNvbnZlcnRlZExvbmdpdHVkZSAtIExvbmdpdHVkZVByaW1lcykgKiA2MDtcbiAgICAgICAgbGV0IExvbmdpdHVkZVNlY29uZHMgPSBNYXRoLmZsb29yKGNvbnZlcnRlZExvbmdpdHVkZSk7XG5cbiAgICAgICAgcmV0dXJuIGxhdGl0dWRlRGVncmVlICsgJ8KwICcgKyBsYXRpdHVkZVByaW1lcyArIFwiJyBcIiArIGxhdGl0dWRlU2Vjb25kcyArICdcIiAnICsgbGF0aXR1ZGVDYXJkaW5hbCArICcsICcgK1xuICAgICAgICAgICAgTG9uZ2l0dWRlRGVncmVlICsgJ8KwICcgKyBMb25naXR1ZGVQcmltZXMgKyBcIicgXCIgKyBMb25naXR1ZGVTZWNvbmRzICsgJ1wiICcgKyBMb25naXR1ZGVDYXJkaW5hbDtcbiAgICB9XG5cbiAgICBfZ2V0TGlzdEVsZW1lbnQob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gJCgnPGRpdiBpZD1cIicgKyBvcHRpb25zLmlkICsgJ1wiIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGVhcnRocXVha2UtbGlzdC1pdGVtXCI+ICcgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJlYXJ0aHF1YWtlLWxpc3QtaXRlbS1jb250ZW50IHdpZHRoLWhlaWdodC0xMDBcIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZWFydGhxdWFrZS1saXN0LWl0ZW0taGVhZGVyIHdpZHRoLWhlaWdodC0xMDBcIj48Yj4nICsgb3B0aW9ucy50aXRsZSArICc8L2I+PC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImVhcnRocXVha2UtbGlzdC1pdGVtLWJvZHkgd2lkdGgtaGVpZ2h0LTEwMFwiPicgK1xuICAgICAgICAgICAgKEVRLmRlYnVnID8gJ0lEOiAnICsgb3B0aW9ucy5pZCArICc8YnI+JyA6ICcnKSArXG4gICAgICAgICAgICAnUG9zaXRpb24gJyArIHRoaXMuY29udmVydENvb3JkaW5hdGVzKG9wdGlvbnMucG9zaXRpb24ubGF0KCksIG9wdGlvbnMucG9zaXRpb24ubG5nKCkpICsgJzxicj4nICtcbiAgICAgICAgICAgICgkLmlzTnVtZXJpYyhvcHRpb25zLm1hZ25pdHVkZSkgPyAnTWFnbml0dWRlICcgKyBvcHRpb25zLm1hZ25pdHVkZS50b0ZpeGVkKDIpICsgJzxicj4nIDogJycpICtcbiAgICAgICAgICAgIChvcHRpb25zLnRzdW5hbWkgPyAnVHN1bmFtaScgKyAnPGJyPicgOiAnJykgK1xuICAgICAgICAgICAgJ0RlcHRoICcgKyBvcHRpb25zLmRlcHRoLnRvRml4ZWQoMikgKyAnIGttPGJyPicgK1xuICAgICAgICAgICAgJ0RhdGUgJyArIG9wdGlvbnMuZGF0ZSArICc8YnI+JyArXG4gICAgICAgICAgICAnPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicgKyBvcHRpb25zLnVybCArICdcIj5EZXRhaWxzPC9hPicgK1xuICAgICAgICAgICAgJzwvZGl2PjwvZGl2PjwvZGl2PidcbiAgICAgICAgKTtcbiAgICB9XG5cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBIZWF0TWFwTGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICB0aGlzLl9tYXAgPSBtYXA7XG4gICAgICAgIHRoaXMuX2xheWVyID0gbmV3IGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyKHtcbiAgICAgICAgICAgIGRpc3NpcGF0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNixcbiAgICAgICAgICAgIG1hcDogbnVsbCxcbiAgICAgICAgICAgIGdyYWRpZW50OiBbJ3JnYmEoMCwgMjU1LCAyNTUsIDApJ10uY29uY2F0KGNvbG9yYnJld2VyLllsT3JSZFs2XSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSgpO1xuICAgIH1cblxuICAgIF9pbml0aWFsaXplKCkge31cblxuICAgIGFkZERhdGEoZGF0YSkge1xuICAgICAgICBsZXQgaGVhdG1hcERhdGEgPSBbXTtcbiAgICAgICAgZGF0YS5mb3JFYWNoKChlYXJ0aHF1YWtlKSA9PiB7XG4gICAgICAgICAgICBsZXQgcG9zaXRpb24gPSBlYXJ0aHF1YWtlLmdldEdlb21ldHJ5KCkuZ2V0KCksXG4gICAgICAgICAgICAgICAgbWFnbml0dWRlID0gZWFydGhxdWFrZS5nZXRQcm9wZXJ0eSgnbWFnJyk7XG4gICAgICAgICAgICBoZWF0bWFwRGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiBNYXRoLnBvdygyLCBtYWduaXR1ZGUpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGRhdGFBcnJheSA9IG5ldyBnb29nbGUubWFwcy5NVkNBcnJheShoZWF0bWFwRGF0YSk7XG4gICAgICAgIHRoaXMuX2xheWVyLnNldCgnZGF0YScsIGRhdGFBcnJheSk7XG4gICAgfVxuXG4gICAgc2V0U2VsZWN0ZWQoZWFydGhxdWFrZSkge31cbiAgICBcbiAgICBlbXB0eSgpIHtcbiAgICAgICAgbGV0IGRhdGFBcnJheSA9IG5ldyBnb29nbGUubWFwcy5NVkNBcnJheShbXSk7XG4gICAgICAgIHRoaXMuX2xheWVyLnNldCgnZGF0YScsIGRhdGFBcnJheSk7XG4gICAgfVxuXG4gICAgZW5hYmxlKCkge1xuICAgICAgICB0aGlzLl9sYXllci5zZXRNYXAodGhpcy5fbWFwKTtcbiAgICB9XG4gICAgZGlzYWJsZSgpIHtcbiAgICAgICAgdGhpcy5fbGF5ZXIuc2V0TWFwKG51bGwpO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBNYXJrZXJzTGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICB0aGlzLl9tYXAgPSBtYXA7XG4gICAgICAgIHRoaXMuX2xheWVyID0gbmV3IGdvb2dsZS5tYXBzLkRhdGEoe1xuICAgICAgICAgICAgbWFwOiBudWxsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplKCk7XG4gICAgfVxuXG4gICAgX2luaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMuX2xheWVyLnNldFN0eWxlKChlYXJ0aHF1YWtlKSA9PiB0aGlzLl9nZXRNYXJrZXJzU3R5bGUoZWFydGhxdWFrZSkpO1xuICAgICAgICB0aGlzLl9sYXllci5hZGRMaXN0ZW5lcignY2xpY2snLCAoZWFydGhxdWFrZSkgPT4ge1xuICAgICAgICAgICAgRVEubWFwLnNlbGVjdEVhcnRocXVha2UoZWFydGhxdWFrZS5mZWF0dXJlKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhZGREYXRhKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xheWVyLmFkZEdlb0pzb24oZGF0YSk7XG4gICAgfVxuXG4gICAgc2V0U2VsZWN0ZWQoZWFydGhxdWFrZUlkKSB7XG4gICAgICAgIGxldCBlYXJ0aHF1YWtlID0gdGhpcy5fbGF5ZXIuZ2V0RmVhdHVyZUJ5SWQoZWFydGhxdWFrZUlkKTtcblxuICAgICAgICB0aGlzLl9sYXllci5yZXZlcnRTdHlsZSgpO1xuICAgICAgICB0aGlzLl9sYXllci5vdmVycmlkZVN0eWxlKGVhcnRocXVha2UsIHtcbiAgICAgICAgICAgIGljb246ICdhc3NldHMvc2VsZWN0ZWQtZmVhdHVyZS5wbmcnLFxuICAgICAgICAgICAgekluZGV4OiA1MDBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZW1wdHkoKSB7XG4gICAgICAgIGxldCBkYXRhTGF5ZXIgPSB0aGlzLl9sYXllcjtcbiAgICAgICAgZGF0YUxheWVyLmZvckVhY2goKGZlYXR1cmUpID0+IHtcbiAgICAgICAgICAgIGRhdGFMYXllci5yZW1vdmUoZmVhdHVyZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGVuYWJsZSgpIHtcbiAgICAgICAgdGhpcy5fbGF5ZXIuc2V0TWFwKHRoaXMuX21hcCk7XG4gICAgfVxuICAgIGRpc2FibGUoKSB7XG4gICAgICAgIHRoaXMuX2xheWVyLnNldE1hcChudWxsKTtcbiAgICB9XG5cbiAgICBfZ2V0TWFya2Vyc1N0eWxlKGZlYXR1cmUpIHtcbiAgICAgICAgbGV0IG1hZ25pdHVkZSA9IGZlYXR1cmUuZ2V0UHJvcGVydHkoJ21hZycpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgekluZGV4OiBNYXRoLmZsb29yKG1hZ25pdHVkZSAqIDEwKVxuICAgICAgICB9O1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBUZWN0b25pY0xheWVyIHtcbiAgICBjb25zdHJ1Y3RvcihtYXApIHtcbiAgICAgICAgdGhpcy5fcG9seWdvbnMgPSBbXTtcbiAgICAgICAgdGhpcy5fbGF5ZXIgPSBuZXcgZ29vZ2xlLm1hcHMuRGF0YSh7XG4gICAgICAgICAgICBtYXA6IG1hcFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fY3VycmVudExhYmVsID0gbnVsbDtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSgpO1xuICAgIH1cblxuICAgIF9pbml0aWFsaXplKCkge1xuICAgICAgICAkLmdldEpTT04oXCJhc3NldHMvdGVjdG9uaWNzLXBsYXRlLmpzb25cIilcbiAgICAgICAgICAgIC50aGVuKCh0ZWN0b25pY3MpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdGVjdG9uaWNzRGF0YSA9IHRoaXMuX2xheWVyLmFkZEdlb0pzb24odGVjdG9uaWNzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jcmV0ZVBvbHlnb25zKHRlY3Rvbmljc0RhdGEpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fbGF5ZXIuc2V0U3R5bGUodGhpcy5fZ2V0VGVjdG9uaWNzU3R5bGUpO1xuXG4gICAgICAgIHRoaXMuX2xheWVyLmFkZExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRMYWJlbCA9IGV2ZW50LmZlYXR1cmUuZ2V0UHJvcGVydHkoJ25hbWUnKTtcbiAgICAgICAgICAgICQoJyNwbGF0ZS10b29sdGlwJykuaHRtbCh0aGlzLl9jdXJyZW50TGFiZWwpO1xuICAgICAgICAgICAgdGhpcy5fbGF5ZXIucmV2ZXJ0U3R5bGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2xheWVyLm92ZXJyaWRlU3R5bGUoZXZlbnQuZmVhdHVyZSwge1xuICAgICAgICAgICAgICAgIHN0cm9rZVdlaWdodDogMi41LFxuICAgICAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLjE1XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fbGF5ZXIuYWRkTGlzdGVuZXIoJ21vdXNlb3V0JywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50TGFiZWwgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fbGF5ZXIucmV2ZXJ0U3R5bGUoKTtcbiAgICAgICAgICAgICQoJyNwbGF0ZS10b29sdGlwJykuaHRtbChcIlwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkubW91c2Vtb3ZlKChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRMYWJlbClcbiAgICAgICAgICAgICAgICAkKCcjcGxhdGUtdG9vbHRpcCcpLm9mZnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGV2ZW50LnBhZ2VYIC0gNzUsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogZXZlbnQucGFnZVkgKyAzMFxuICAgICAgICAgICAgICAgIH0pLnNob3coKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAkKCcjcGxhdGUtdG9vbHRpcCcpLmhpZGUoKTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfY3JldGVQb2x5Z29ucyh0ZWN0b25pY3NEYXRhKSB7XG4gICAgICAgICQuZWFjaCh0ZWN0b25pY3NEYXRhLCAoaSwgdGVjdG9uaWMpID0+IHtcbiAgICAgICAgICAgIGxldCB0R2VvbWV0cnkgPSB0ZWN0b25pYy5nZXRHZW9tZXRyeSgpLFxuICAgICAgICAgICAgICAgIHBvaW50cyA9IFtdO1xuXG4gICAgICAgICAgICB0R2VvbWV0cnkuZm9yRWFjaExhdExuZygocHQpID0+IHtcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChwdCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IHBsYXRlUG9seWdvbiA9IG5ldyBnb29nbGUubWFwcy5Qb2x5Z29uKHtcbiAgICAgICAgICAgICAgICBwYXRoczogcG9pbnRzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHBsYXRlUG9seWdvbi5zZXQoJ19fbmFtZScsIHRlY3RvbmljLmdldFByb3BlcnR5KCduYW1lJykpO1xuICAgICAgICAgICAgLy9wbGF0ZVBvbHlnb24ubmFtZSA9IHRlY3RvbmljLmdldFByb3BlcnR5KCcnKVxuICAgICAgICAgICAgdGhpcy5fcG9seWdvbnMucHVzaChwbGF0ZVBvbHlnb24pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfcmVmcmVzaCgpIHtcbiAgICAgICAgdmFyIG1hcCA9IHRoaXMuX2xheWVyLmdldE1hcCgpO1xuICAgICAgICB0aGlzLl9sYXllci5zZXRNYXAobnVsbCk7XG4gICAgICAgIHRoaXMuX2xheWVyLnNldE1hcChtYXApO1xuICAgIH1cblxuICAgIF9nZXRUZWN0b25pY3NTdHlsZShmZWF0dXJlKSB7XG4gICAgICAgIHZhciBjb2xvciA9IGZlYXR1cmUuZ2V0UHJvcGVydHkoJ2NvbG9yJyksXG4gICAgICAgICAgICBuYW1lID0gZmVhdHVyZS5nZXRQcm9wZXJ0eSgnbmFtZScpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmaWxsQ29sb3I6IGNvbG9yLFxuICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDAuMSxcbiAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBjb2xvcixcbiAgICAgICAgICAgIHN0cm9rZVdlaWdodDogMVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldFBsYXRlQnlQb2ludChlYXJ0aHF1YWtlUG9zaXRpb24pIHtcbiAgICAgICAgbGV0IHBsYXRlRGF0YSA9IHtcbiAgICAgICAgICAgIGluc2lkZTogW10sXG4gICAgICAgICAgICBuZWFyOiBbXSxcbiAgICAgICAgICAgIGFsbDogW10sXG4gICAgICAgIH07XG5cbiAgICAgICAgJC5lYWNoKHRoaXMuX3BvbHlnb25zLCAoaSwgcGxhdGUpID0+IHtcbiAgICAgICAgICAgIGlmIChnb29nbGUubWFwcy5nZW9tZXRyeS5wb2x5LmNvbnRhaW5zTG9jYXRpb24oZWFydGhxdWFrZVBvc2l0aW9uLCBwbGF0ZSkpIHtcbiAgICAgICAgICAgICAgICBwbGF0ZURhdGEuaW5zaWRlLnB1c2gocGxhdGUuZ2V0KCdfX25hbWUnKSk7XG4gICAgICAgICAgICAgICAgcGxhdGVEYXRhLmFsbC5wdXNoKHBsYXRlLmdldCgnX19uYW1lJykpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChnb29nbGUubWFwcy5nZW9tZXRyeS5wb2x5LmlzTG9jYXRpb25PbkVkZ2UoZWFydGhxdWFrZVBvc2l0aW9uLCBwbGF0ZSwgMTBlLTEpKSB7XG4gICAgICAgICAgICAgICAgcGxhdGVEYXRhLm5lYXIucHVzaChwbGF0ZS5nZXQoJ19fbmFtZScpKTtcbiAgICAgICAgICAgICAgICBwbGF0ZURhdGEuYWxsLnB1c2gocGxhdGUuZ2V0KCdfX25hbWUnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBsYXRlRGF0YS5hbGwuc29ydCgpO1xuICAgICAgICByZXR1cm4gcGxhdGVEYXRhO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dnZXIge1xuICAgIGNvbnN0cnVjdG9yKGxvZ0xldmVsKSB7XG4gICAgICAgIHRoaXMuX2xvZ0xldmVsID0gbG9nTGV2ZWw7XG4gICAgICAgIHRoaXMuTG9nTGV2ZWwgPSBMb2dnZXIuTG9nTGV2ZWw7XG5cbiAgICAgICAgdGhpcy5fc3R5bGVzID0ge1xuICAgICAgICAgICAgZXJyb3I6ICdjb2xvcjogeWVsbG93OyBiYWNrZ3JvdW5kOiAjRkY0MDQwJyxcbiAgICAgICAgICAgIHdhcm46ICdjb2xvcjogI0ZGNDA0MDsgYmFja2dyb3VuZDogI2VlZDQ4MicsXG4gICAgICAgICAgICBpbmZvOiAnY29sb3I6IGJsdWUnLFxuICAgICAgICAgICAgZGVidWc6ICdjb2xvcjogZ3JlZW4nXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fam9pblN5bWJvbCA9ICcgJztcblxuICAgICAgICAkLmVhY2godGhpcy5Mb2dMZXZlbCwgKGxvZ0xldmVsKSA9PiB7XG4gICAgICAgICAgICB0aGlzW2xvZ0xldmVsXSA9ICgoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZyhsb2dMZXZlbCwgLi4uYXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBMb2dMZXZlbCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVycm9yOiAxLFxuICAgICAgICAgICAgd2FybjogMixcbiAgICAgICAgICAgIGluZm86IDMsXG4gICAgICAgICAgICBkZWJ1ZzogNFxuICAgICAgICB9O1xuICAgIH0gIFxuXG4gICAgc2V0TG9nTGV2ZWwobG9nTGV2ZWwpIHtcbiAgICAgICAgaWYgKCQuaXNOdW1lcmljKGxvZ0xldmVsKSAmJiBsb2dMZXZlbCA+IC0xKVxuICAgICAgICAgICAgdGhpcy5fbG9nTGV2ZWwgPSBsb2dMZXZlbDtcbiAgICB9XG5cbiAgICBfbG9nKGxvZ1R5cGUsIC4uLm1zZ0xpc3QpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pc0xvZ2dhYmxlKGxvZ1R5cGUpKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGxldCBzdHlsZSA9IHRoaXMuX3N0eWxlc1tsb2dUeXBlXSxcbiAgICAgICAgICAgIGZpbmFsTXNnID0gXCIlY1wiICsgbXNnTGlzdC5qb2luKHRoaXMuX2pvaW5TeW1ib2wpO1xuXG4gICAgICAgIGNvbnNvbGVbbG9nVHlwZV0uYXBwbHkoY29uc29sZSwgW2ZpbmFsTXNnLCBzdHlsZV0pO1xuICAgIH1cblxuICAgIF9pc0xvZ2dhYmxlKGxvZ0xldmVsSWQpIHtcbiAgICAgICAgbGV0IGxvZ0xldmVsID0gdGhpcy5Mb2dMZXZlbFtsb2dMZXZlbElkXTtcbiAgICAgICAgcmV0dXJuIGxvZ0xldmVsIDw9IHRoaXMuX2xvZ0xldmVsO1xuICAgIH1cbn0iXX0=
