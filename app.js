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

        this._url = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=earthquake&orderby=magnitude";
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvZGF0YS9GZXRjaGVyLmpzIiwic3JjL2pzL2RhdGEvUHJveHkuanMiLCJzcmMvanMvZ3JhcGgvR3JhcGhNYW5hZ2VyLmpzIiwic3JjL2pzL21haW4uanMiLCJzcmMvanMvbWFwL0NpcmNsZUxheWVyLmpzIiwic3JjL2pzL21hcC9FYXJ0aHF1YWtlTWFwLmpzIiwic3JjL2pzL21hcC9IZWF0TWFwTGF5ZXIuanMiLCJzcmMvanMvbWFwL01hcmtlcnNMYXllci5qcyIsInNyYy9qcy9tYXAvVGVjdG9uaWNMYXllci5qcyIsInNyYy9qcy91dGlsL0xvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7OztxQkNBa0IsU0FBUzs7OztJQUVOLE9BQU87QUFDYixhQURNLE9BQU8sR0FDVjs4QkFERyxPQUFPOztBQUVwQixZQUFJLENBQUMsTUFBTSxHQUFHLHdCQUFXLENBQUM7QUFDMUIsWUFBSSxDQUFDLFFBQVEsR0FBRztBQUNaLHFCQUFTLEVBQUUsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUN4QyxtQkFBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztTQUN4RCxDQUFDOztBQUVGLFlBQUksQ0FBQyxJQUFJLEdBQUcsdUdBQXVHLENBQUM7S0FDdkg7O2lCQVRnQixPQUFPOztlQVdmLHFCQUFHO0FBQ1IsY0FBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25ELGdCQUFJLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDM0Isb0JBQVEsRUFBRSxDQUFDLEtBQUs7QUFDaEIscUJBQUssTUFBTTtBQUNQO0FBQ0ksdUNBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdB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LGNBQUMsT0FBTyxFQUFjO0FBQ3RCLGdCQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFDMUIsT0FBTzs7K0NBRkUsT0FBTztBQUFQLHVCQUFPOzs7QUFJcEIsZ0JBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2dCQUM3QixRQUFRLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVyRCxtQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUN0RDs7O2VBRVUscUJBQUMsVUFBVSxFQUFFO0FBQ3BCLGdCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3pDLG1CQUFPLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ3JDOzs7YUEzQmtCLGVBQUc7QUFDbEIsbUJBQU87QUFDSCxxQkFBSyxFQUFFLENBQUM7QUFDUixvQkFBSSxFQUFFLENBQUM7QUFDUCxvQkFBSSxFQUFFLENBQUM7QUFDUCxxQkFBSyxFQUFFLENBQUM7YUFDWCxDQUFDO1NBQ0w7OztXQTVCZ0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUHJveHkgZnJvbSAnLi9Qcm94eSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZldGNoZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9wcm94eSA9IG5ldyBQcm94eSgpO1xuICAgICAgICB0aGlzLl9vcHRpb25zID0ge1xuICAgICAgICAgICAgc3RhcnR0aW1lOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQnKSxcbiAgICAgICAgICAgIGVuZHRpbWU6IG1vbWVudCgpLmFkZCgxLCAnZGF5cycpLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fdXJsID0gXCJodHRwOi8vZWFydGhxdWFrZS51c2dzLmdvdi9mZHNud3MvZXZlbnQvMS9xdWVyeT9mb3JtYXQ9Z2VvanNvbiZldmVudHR5cGU9ZWFydGhxdWFrZSZvcmRlcmJ5PW1hZ25pdHVkZVwiO1xuICAgIH1cblxuICAgIGZldGNoRGF0YSgpIHtcbiAgICAgICAgRVEubG9nZ2VyLmluZm8oJ0ZldGNoaW5nIG5ldyBkYXRhIGZyb20nLCBFUS5wcm94eSk7XG4gICAgICAgIGxldCBwcm9taXNlVG9SZXR1cm4gPSBudWxsO1xuICAgICAgICBzd2l0Y2ggKEVRLnByb3h5KSB7XG4gICAgICAgIGNhc2UgJ3Rlc3QnOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHByb21pc2VUb1JldHVybiA9IHRoaXMuX3Byb3h5LmdldFRlc3REYXRhKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIGNhc2UgJ3JlYWwnOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICQoJyNsb2FkaW5nLXdpbmRvdycpLnNob3coKTtcbiAgICAgICAgICAgICAgICBwcm9taXNlVG9SZXR1cm4gPSB0aGlzLl9nZXRGcm9tQVBJKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2VtcHR5JzpcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwcm9taXNlVG9SZXR1cm4gPSB0aGlzLl9wcm94eS5nZXRFbXB0eURhdGEoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcm9taXNlVG9SZXR1cm47XG4gICAgfVxuXG4gICAgc2V0KGRhdGFLZXksIGRhdGEpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9uc1tkYXRhS2V5XSA9IGRhdGE7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9nZXRGcm9tQVBJKCkge1xuICAgICAgICBsZXQgdXJsID0gdGhpcy5fdXJsO1xuICAgICAgICAkLmVhY2godGhpcy5fb3B0aW9ucywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgIHVybCArPSAnJicgKyBrZXkgKyAnPScgKyB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiAkLmdldEpTT04odXJsKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAkKCcjbG9hZGluZy13aW5kb3cnKS5oaWRlKCk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb3h5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fZGF0YSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2VtcHR5RGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0VGVzdERhdGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhID9cbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuX2RhdGEpO1xuICAgICAgICAgICAgfSkgOlxuICAgICAgICAgICAgJC5nZXRKU09OKCdhc3NldHMvcHJveHktZGF0YS5qc29uJykudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0RW1wdHlEYXRhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZW1wdHlEYXRhID9cbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuX2VtcHR5RGF0YSk7XG4gICAgICAgICAgICB9KSA6XG4gICAgICAgICAgICAkLmdldEpTT04oJ2Fzc2V0cy9wcm94eS1lbXB0eWRhdGEuanNvbicpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbXB0eURhdGEgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYXBoTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgZHJhd0dyYXBoKHZpc2libGVFYXJ0aHF1YWtlcykge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuX25vcm1hbGl6ZURhdGEodmlzaWJsZUVhcnRocXVha2VzKTtcbiAgICAgICAgJCgnI2NoYXJ0LXN2ZycpLmVtcHR5KCk7XG5cbiAgICAgICAgbnYuYWRkR3JhcGgoKCkgPT4ge1xuICAgICAgICAgICAgRVEubG9nZ2VyLmluZm8oJ0NyZWF0aW5nIG5ldyBncmFwaCcpO1xuICAgICAgICAgICAgdmFyIGNoYXJ0ID0gbnYubW9kZWxzLnNjYXR0ZXJDaGFydCgpXG4gICAgICAgICAgICAgICAgLnVzZVZvcm9ub2kodHJ1ZSlcbiAgICAgICAgICAgICAgICAuY29sb3IoZDMuc2NhbGUuY2F0ZWdvcnkxMCgpLnJhbmdlKCkpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDMwMClcblxuICAgICAgICAgICAgY2hhcnQuc2NhdHRlci5wb2ludERvbWFpbihbMCwgMTBdKTtcblxuICAgICAgICAgICAgY2hhcnQubm9EYXRhKFwiTm8gZGF0YSB0byBkaXNwbGF5XCIpO1xuICAgICAgICAgICAgY2hhcnQudG9vbHRpcC5jb250ZW50R2VuZXJhdG9yKChkYXRhKSA9PiB0aGlzLl9nZXRUb29sdGlwKGRhdGEpKTtcbiAgICAgICAgICAgIC8vY2hhcnQuZGlzcGF0Y2gub24oJ3JlbmRlckVuZCcsIGZ1bmN0aW9uICgpIHt9KTtcblxuICAgICAgICAgICAgRVEubG9nZ2VyLmRlYnVnKCdBeGlzIGNvbmZpZ3VyYXRpb24nKTtcbiAgICAgICAgICAgIC8qIFggYXhpcyAqL1xuICAgICAgICAgICAgY2hhcnQuc2hvd1hBeGlzKHRydWUpO1xuICAgICAgICAgICAgY2hhcnQueEF4aXMudGlja0Zvcm1hdChmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQudW5peChkKS5mb3JtYXQoJ0RELU1NLCBISDpNTScpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNoYXJ0LnhBeGlzLnNob3dNYXhNaW4oZmFsc2UpO1xuICAgICAgICAgICAgbGV0IGRhdGVSYW5nZVBpY2tlciA9ICQoJyNyZXBvcnRyYW5nZScpLmRhdGEoJ2RhdGVyYW5nZXBpY2tlcicpLFxuICAgICAgICAgICAgICAgIHN0YXJ0RGF0ZSA9IG1vbWVudChkYXRlUmFuZ2VQaWNrZXIuc3RhcnREYXRlKS51bml4KCksXG4gICAgICAgICAgICAgICAgZW5kRGF0ZSA9IG1vbWVudChkYXRlUmFuZ2VQaWNrZXIuZW5kRGF0ZSkudW5peCgpO1xuXG4gICAgICAgICAgICBjaGFydC5mb3JjZVgoW3N0YXJ0RGF0ZSwgZW5kRGF0ZV0pO1xuXG4gICAgICAgICAgICAvKiBZIGF4aXMgKi9cbiAgICAgICAgICAgIGNoYXJ0LmZvcmNlWShbMCwgMTBdKTtcbiAgICAgICAgICAgIGNoYXJ0LnlBeGlzLnRpY2tGb3JtYXQoZDMuZm9ybWF0KCcuMDJmJykpO1xuXG4gICAgICAgICAgICBkMy5zZWxlY3QoJyNjaGFydC1zdmcnKVxuICAgICAgICAgICAgICAgIC5kYXR1bShkYXRhKVxuICAgICAgICAgICAgICAgIC5jYWxsKGNoYXJ0KTtcblxuICAgICAgICAgICAgbnYudXRpbHMud2luZG93UmVzaXplKGNoYXJ0LnVwZGF0ZSk7XG5cbiAgICAgICAgICAgIGNoYXJ0LmRpc3BhdGNoLm9uKCdzdGF0ZUNoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgKCdOZXcgU3RhdGU6JywgSlNPTi5zdHJpbmdpZnkoZSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2NoYXJ0ID0gY2hhcnQ7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuX2NoYXJ0LnVwZGF0ZSwgNTAwKTtcblxuICAgICAgICAgICAgRVEubG9nZ2VyLmluZm8oJ05ldyBncmFwaCBjcmVhdGVkJyk7XG4gICAgICAgICAgICByZXR1cm4gY2hhcnQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9nZXRUb29sdGlwKGRhdGEpIHtcbiAgICAgICAgbGV0IGVhcnRocXVha2UgPSBkYXRhLnBvaW50LmVhcnRocXVha2UsXG4gICAgICAgICAgICB0aXRsZSA9IGVhcnRocXVha2UuZ2V0UHJvcGVydHkoJ3RpdGxlJyksXG4gICAgICAgICAgICBkYXRlID0gbW9tZW50KGVhcnRocXVha2UuZ2V0UHJvcGVydHkoJ3RpbWUnKSkuZm9ybWF0KCdELU0tWVlZWSBISDptbScpLFxuICAgICAgICAgICAgcG9pbnQgPSBlYXJ0aHF1YWtlLmdldEdlb21ldHJ5KCkuZ2V0KCksXG4gICAgICAgICAgICBsYXRpdHVkZSA9IHBvaW50LmxhdCgpLFxuICAgICAgICAgICAgbG9uZ2l0dWRlID0gcG9pbnQubG5nKCksXG4gICAgICAgICAgICBtYWduaXR1ZGUgPSBlYXJ0aHF1YWtlLmdldFByb3BlcnR5KCdtYWcnKSxcbiAgICAgICAgICAgIHBsYXRlID0gZGF0YS5zZXJpZXNbMF0ua2V5O1xuXG4gICAgICAgIGxldCB0b29sdGlwID0gJCgnPGRpdj48Yj4nICsgdGl0bGUgKyAnPC9iPjxicj4nICtcbiAgICAgICAgICAgIHBsYXRlICsgJzwvYnI+JyArXG4gICAgICAgICAgICAnUG9zaXRpb246ICcgKyBFUS5tYXAuY29udmVydENvb3JkaW5hdGVzKGxhdGl0dWRlLCBsb25naXR1ZGUpICsgJzxicj4nICtcbiAgICAgICAgICAgICdNYWduaXR1ZGU6ICcgKyBtYWduaXR1ZGUgKyAnPGJyPicgK1xuICAgICAgICAgICAgJ0RhdGU6ICcgKyBkYXRlICsgJzxicj48L2Rpdj4nKTtcblxuXG4gICAgICAgIEVRLmxvZ2dlci5kZWJ1ZygnVG9vbHRpcCBmb3InLCBlYXJ0aHF1YWtlLmdldElkKCkpO1xuICAgICAgICByZXR1cm4gdG9vbHRpcC5odG1sKCk7XG4gICAgfVxuXG4gICAgX25vcm1hbGl6ZURhdGEodmlzaWJsZUVhcnRocXVha2VzKSB7XG4gICAgICAgIHZhciBwbGF0ZXNEYXRhID0ge30sXG4gICAgICAgICAgICByYW5kb20gPSBkMy5yYW5kb20ubm9ybWFsKCk7XG5cbiAgICAgICAgRVEubG9nZ2VyLmRlYnVnKCdOb3JtYWxpemluZycsIHZpc2libGVFYXJ0aHF1YWtlcy5sZW5ndGgsICdkYXRhJyk7XG4gICAgICAgICQuZWFjaCh2aXNpYmxlRWFydGhxdWFrZXMsIChpLCBlYXJ0aHF1YWtlKSA9PiB7XG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBlYXJ0aHF1YWtlLmdldEdlb21ldHJ5KCkuZ2V0KCksXG4gICAgICAgICAgICAgICAgcGxhdGVzID0gRVEubWFwLl90ZWN0b25pY3NMYXllci5nZXRQbGF0ZUJ5UG9pbnQocG9pbnQpLFxuICAgICAgICAgICAgICAgIHBsYXRlSWRlbnRpZmllciA9IHBsYXRlcy5pbnNpZGVbMF0gfHwgcGxhdGVzLm5lYXJbMF0sXG4gICAgICAgICAgICAgICAgbWFnbml0dWRlID0gZWFydGhxdWFrZS5nZXRQcm9wZXJ0eSgnbWFnJykgfHwgMCxcbiAgICAgICAgICAgICAgICB0aW1lID0gbW9tZW50KGVhcnRocXVha2UuZ2V0UHJvcGVydHkoJ3RpbWUnKSkudW5peCgpLFxuICAgICAgICAgICAgICAgIHBsYXRlRWFydGhxdWFrZXMgPSBwbGF0ZXNEYXRhW3BsYXRlSWRlbnRpZmllcl0gfHwgW107XG5cbiAgICAgICAgICAgIHBsYXRlRWFydGhxdWFrZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgeDogdGltZSxcbiAgICAgICAgICAgICAgICB5OiBtYWduaXR1ZGUsXG4gICAgICAgICAgICAgICAgc2l6ZTogbWFnbml0dWRlLCAvL0NvbmZpZ3VyZSB0aGUgc2l6ZSBvZiBlYWNoIHNjYXR0ZXIgcG9pbnRcbiAgICAgICAgICAgICAgICBzaGFwZTogXCJjaXJjbGVcIiwgLy9Db25maWd1cmUgdGhlIHNoYXBlIG9mIGVhY2ggc2NhdHRlciBwb2ludC5cbiAgICAgICAgICAgICAgICBlYXJ0aHF1YWtlOiBlYXJ0aHF1YWtlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcGxhdGVzRGF0YVtwbGF0ZUlkZW50aWZpZXJdID0gcGxhdGVFYXJ0aHF1YWtlcztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGRhdGEgPSBbXTtcblxuICAgICAgICAkLmVhY2gocGxhdGVzRGF0YSwgKHBsYXRlTmFtZSwgcGxhdGVWYWx1ZXMpID0+IHtcbiAgICAgICAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAga2V5OiBwbGF0ZU5hbWUsXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBwbGF0ZVZhbHVlc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBFUS5sb2dnZXIuZGVidWcodmlzaWJsZUVhcnRocXVha2VzLmxlbmd0aCwgJ2RhdGEgbm9ybWFsaXplZCcpO1xuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbn0iLCJpbXBvcnQgRWFydGhxdWFrZU1hcCBmcm9tICcuL21hcC9FYXJ0aHF1YWtlTWFwJztcbmltcG9ydCBHcmFwaE1hbmFnZXIgZnJvbSAnLi9ncmFwaC9HcmFwaE1hbmFnZXInO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL3V0aWwvTG9nZ2VyJztcblxud2luZG93LkVRID0ge1xuICAgIC8qIEluaXRpYWxpemF0aW9uIGZ1bmN0aW9uICovXG4gICAgaW5pdGlhbGl6ZTogX2luaXRpYWxpemUsXG4gICAgLyogU2hvd3MgZGVidWcgaW5mb3JtYXRpb24gKi9cbiAgICBkZWJ1ZzogZmFsc2UsXG4gICAgLyogQWxsb3dzIHRvIGNob29zZSBkYXRhIHNvdXJjZVxuICAgICAqXG4gICAgICogJ2VtcHR5JyAtPiBubyBkYXRhIGZvdW5kIGZvciBlYWNoIGZpbHRlciBvcHRpb24gc3BlY2lmaWVkLCBcbiAgICAgKiAndGVzdCcgLT4gdGVzdCBkYXRhLCBzYW1lIGRhdGEgaXMgcmV0dXJuZWQgZm9yIGVhY2ggZmlsdGVyIG9wdGlvbiBzcGVjaWZpZWQsIFxuICAgICAqICdyZWFsJyAtPiByZWFsIGRhdGEsIGRhdGEgcmV0dXJuZWQgYXJlIHJlYWwgb25lc1xuICAgICAqL1xuICAgIHByb3h5OiAncmVhbCcsXG4gICAgLyogV2lsbCBjb250YWluIG1haW4gb2JqZWN0cyAqL1xuICAgIG1hcDogbnVsbCxcbiAgICBncmFwaE1hbmFnZXI6IG5ldyBHcmFwaE1hbmFnZXIoKSxcbiAgICAvKiBTaW1wbGUgY29uZmlndXJhYmxlIGxvZ2dlciwgYWJsZSB0byBzaG93IGNvbnNvbGUgbWVzc2FnZXMgZGVwZW5kaW5nIG9uIExvZ0xldmVsIHNwZWNpZmllZCAqL1xuICAgIGxvZ2dlcjogbmV3IExvZ2dlcihMb2dnZXIuTG9nTGV2ZWwuZGVidWcpXG59O1xuXG4vKiBpbml0aWFsaXphdGlvbiB3aGVuIEdtYXBzIGlzIGxvYWRlZCAqL1xuLyogaW5pdGlhbGl6YXRpb24gY2FuIHN0YXJ0IHdoZW4gRyBtYXBzIEFQSSBhbmQgZG9jdW1lbnQgYXJlIGZ1bGx5IGxvYWRlZCAqL1xuZnVuY3Rpb24gX2luaXRpYWxpemUoKSB7XG4gICAgJChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLyogSW5pdGlhbGl6ZSBNYXAgb2JqZWN0ICovXG4gICAgICAgIGxldCB6b29tID0gMixcbiAgICAgICAgICAgIGNlbnRlciA9IHtcbiAgICAgICAgICAgICAgICBsYXQ6IDQxLjg1MCxcbiAgICAgICAgICAgICAgICBsbmc6IC04Ny42NTBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgRVEubG9nZ2VyLmRlYnVnKCdNYXAgaW5pdGlhbGl6YXRpb24nKTtcbiAgICAgICAgRVEubWFwID0gbmV3IEVhcnRocXVha2VNYXAoem9vbSwgY2VudGVyKTtcbiAgICAgICAgRVEubWFwLmluaXRpYWxpemVNYXAoKTtcblxuICAgICAgICAvKiBmaXJzdCB0aW1lIGRhdGEgZmV0Y2ggKi9cbiAgICAgICAgRVEubWFwLnJlZnJlc2hEYXRhKCk7XG5cbiAgICAgICAgRVEubG9nZ2VyLmRlYnVnKCdFUSBpbml0aWFsaXplZCcsIEVRLmRlYnVnID8gJyBpbiBkZXYgbW9kZScgOiB1bmRlZmluZWQpO1xuICAgICAgICBFUS5sb2dnZXIuZGVidWcoJ1Zpc3VhbGl6YXRpb24gdHlwZSBpbml0aWFsaXphdGlvbicpO1xuICAgICAgICAvKiBzZXQgaGFuZGxlciBmb3IgdmlzdWFsaXphdGlvbiB0eXBlIC0+IGxpc3QgKi9cbiAgICAgICAgJCgnZGl2I3JhZGlvLW9wdGlvbnMgaW5wdXQnKS5jaGFuZ2UoKCkgPT4gRVEubWFwLnNldFZpc3VhbGl6YXRpb25UeXBlKCQoJ2RpdiNyYWRpby1vcHRpb25zIGlucHV0OmNoZWNrZWQnKS52YWwoKSkpO1xuXG4gICAgICAgIEVRLmxvZ2dlci5kZWJ1ZygnTWFnbml0dWRlIHJhbmdlIGluaXRpYWxpemF0aW9uJyk7XG4gICAgICAgIC8qIHNsaWRlciBpbml0aWFsaXphdGlvbiAqL1xuICAgICAgICAkKFwiI21hZ25pdHVkZS1yYW5nZVwiKVxuICAgICAgICAgICAgLnNsaWRlcih7fSlcbiAgICAgICAgICAgIC5vbignc2xpZGVTdG9wJywgKGV2dCkgPT4ge1xuICAgICAgICAgICAgICAgIEVRLmxvZ2dlci5pbmZvKCdOZXcgbWFnbml0dWRlIHJhbmdlJywgZXZ0LnZhbHVlWzBdLCAnLScsIGV2dC52YWx1ZVsxXSk7XG4gICAgICAgICAgICAgICAgRVEubWFwLmZldGNoZXJcbiAgICAgICAgICAgICAgICAgICAgLnNldCgnbWlubWFnbml0dWRlJywgZXZ0LnZhbHVlWzBdKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KCdtYXhtYWduaXR1ZGUnLCBldnQudmFsdWVbMV0pO1xuICAgICAgICAgICAgICAgIEVRLm1hcC5yZWZyZXNoRGF0YSgpO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAvKiBEYXRlIHJhbmdlIHBpY2tlciBpbml0aWFsaXphdGlvbiAqL1xuICAgICAgICBmdW5jdGlvbiBjYihzdGFydCwgZW5kKSB7XG4gICAgICAgICAgICAkKCcjcmVwb3J0cmFuZ2Ugc3BhbicpLmh0bWwoc3RhcnQuZm9ybWF0KCdEIE1NTU0sIFlZWVknKSArICcgLSAnICsgZW5kLmZvcm1hdCgnRCBNTU1NLCBZWVlZJykpO1xuICAgICAgICB9XG4gICAgICAgIGNiKG1vbWVudCgpLCBtb21lbnQoKSk7XG4gICAgICAgIC8qIERhdGUgcmFuZ2UgcGlja2VyIGluaXRpYWxpemF0aW9uICovXG4gICAgICAgICQoJyNyZXBvcnRyYW5nZScpLmRhdGVyYW5nZXBpY2tlcih7XG4gICAgICAgICAgICByYW5nZXM6IHtcbiAgICAgICAgICAgICAgICAnVG9kYXknOiBbbW9tZW50KCksIG1vbWVudCgpXSxcbiAgICAgICAgICAgICAgICAnWWVzdGVyZGF5JzogW21vbWVudCgpLnN1YnRyYWN0KDEsICdkYXlzJyksIG1vbWVudCgpLnN1YnRyYWN0KDEsICdkYXlzJyldLFxuICAgICAgICAgICAgICAgICdMYXN0IDcgRGF5cyc6IFttb21lbnQoKS5zdWJ0cmFjdCg3LCAnZGF5cycpLCBtb21lbnQoKV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgY2IpO1xuXG4gICAgICAgIC8qIGNhbGxiYWNrIHdoZW4gZGF0ZSByYW5nZSBjaGFuZ2VzICovXG4gICAgICAgICQoJyNyZXBvcnRyYW5nZScpLm9uKCdhcHBseS5kYXRlcmFuZ2VwaWNrZXInLCBmdW5jdGlvbiAoZXYsIHBpY2tlcikge1xuICAgICAgICAgICAgRVEubG9nZ2VyLmluZm8oJ05ldyBkYXRlIHJhbmdlJywgcGlja2VyLnN0YXJ0RGF0ZSwgJy0nLCBwaWNrZXIuZW5kRGF0ZSk7XG4gICAgICAgICAgICBFUS5tYXAuZmV0Y2hlclxuICAgICAgICAgICAgICAgIC5zZXQoJ3N0YXJ0dGltZScsIHBpY2tlci5zdGFydERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykgKyAnIDAwOjAwOjAwJylcbiAgICAgICAgICAgICAgICAuc2V0KCdlbmR0aW1lJywgcGlja2VyLmVuZERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykgKyAnIDIzOjU5OjU5Jyk7XG4gICAgICAgICAgICBFUS5tYXAucmVmcmVzaERhdGEoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyogZ3JhcGggbWFuYWdlciBpbml0aWFsaXphdGlvbiAqL1xuICAgICAgICAkKCcjc2hvdy10aW1lbGluZScpLmNsaWNrKCgpID0+IEVRLmdyYXBoTWFuYWdlci5kcmF3R3JhcGgoRVEubWFwLl92aXNpYmxlRWFydGhxdWFrZXMpKTtcblxuICAgICAgICAvKiBoZWF0bWFwIGxlZ2VuZCB0b29sdGlwICovXG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG4gICAgfSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2lyY2xlTGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICB0aGlzLl9tYXAgPSBtYXA7XG4gICAgICAgIHRoaXMuX2xheWVyID0gbmV3IGdvb2dsZS5tYXBzLkRhdGEoe1xuICAgICAgICAgICAgbWFwOiBtYXBcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpemUoKTtcbiAgICB9XG5cbiAgICBfaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5fbGF5ZXIuc2V0U3R5bGUoKGVhcnRocXVha2UpID0+IHRoaXMuX2dldENpcmNsZVN0eWxlKGVhcnRocXVha2UpKTtcbiAgICAgICAgdGhpcy5fcGFsZXR0ZVNjYWxlID0gZDMuc2NhbGUucXVhbnRpemUoKVxuICAgICAgICAgICAgLmRvbWFpbihbMCwgMTBdKVxuICAgICAgICAgICAgLnJhbmdlKGNvbG9yYnJld2VyLllsT3JSZFs2XSk7XG4gICAgfVxuXG4gICAgYWRkRGF0YShkYXRhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sYXllci5hZGRHZW9Kc29uKGRhdGEpO1xuICAgIH1cblxuXG4gICAgc2V0U2VsZWN0ZWQoZWFydGhxdWFrZUlkKSB7fVxuXG4gICAgZW1wdHkoKSB7XG4gICAgICAgIGxldCBkYXRhTGF5ZXIgPSB0aGlzLl9sYXllcjtcbiAgICAgICAgZGF0YUxheWVyLmZvckVhY2goKGZlYXR1cmUpID0+IHtcbiAgICAgICAgICAgIGRhdGFMYXllci5yZW1vdmUoZmVhdHVyZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGVuYWJsZSgpIHtcbiAgICAgICAgdGhpcy5fbGF5ZXIuc2V0TWFwKHRoaXMuX21hcCk7XG4gICAgfVxuXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgICAgdGhpcy5fbGF5ZXIuc2V0TWFwKG51bGwpO1xuICAgIH1cblxuICAgIC8qIHNldCBjaXJjbGUgc3R5bGUgbWFwIHZpc3VhbGl6YXRpb24gKi9cbiAgICBfZ2V0Q2lyY2xlU3R5bGUoZmVhdHVyZSkge1xuICAgICAgICBsZXQgbWFnbml0dWRlID0gZmVhdHVyZS5nZXRQcm9wZXJ0eSgnbWFnJyksXG4gICAgICAgICAgICBjb2xvciA9IHRoaXMuX3BhbGV0dGVTY2FsZShtYWduaXR1ZGUpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpY29uOiB7XG4gICAgICAgICAgICAgICAgcGF0aDogZ29vZ2xlLm1hcHMuU3ltYm9sUGF0aC5DSVJDTEUsXG4gICAgICAgICAgICAgICAgc3Ryb2tlV2VpZ2h0OiAxLFxuICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiAnYmxhY2snLFxuICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogY29sb3IsXG4gICAgICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDAuOSxcbiAgICAgICAgICAgICAgICBzY2FsZTogbWFnbml0dWRlICogMlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHpJbmRleDogTWF0aC5mbG9vcihtYWduaXR1ZGUgKiAxMClcbiAgICAgICAgfTtcbiAgICB9XG59IiwiaW1wb3J0IFRlY3RvbmljTGF5ZXIgZnJvbSAnLi9UZWN0b25pY0xheWVyJztcbmltcG9ydCBNYXJrZXJzTGF5ZXIgZnJvbSAnLi9NYXJrZXJzTGF5ZXInO1xuaW1wb3J0IENpcmNsZUxheWVyIGZyb20gJy4vQ2lyY2xlTGF5ZXInO1xuaW1wb3J0IEhlYXRNYXBMYXllciBmcm9tICcuL0hlYXRNYXBMYXllcic7XG5cbmltcG9ydCBGZXRjaGVyIGZyb20gJy4uL2RhdGEvRmV0Y2hlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVhcnRocXVha2VNYXAge1xuICAgIGNvbnN0cnVjdG9yKHpvb20sIGNlbnRlcikge1xuICAgICAgICB0aGlzLl9tYXAgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuX3RlY3Rvbmljc0xheWVyID0gbnVsbFxuXG4gICAgICAgIC8qIG1hcCBsYXllcnMgKi9cbiAgICAgICAgdGhpcy5fbGF5ZXJzID0ge1xuICAgICAgICAgICAgbWFya2Vyc0xheWVyOiBudWxsLFxuICAgICAgICAgICAgY2lyY2xlTGF5ZXI6IG51bGwsXG4gICAgICAgICAgICBoZWF0TWFwTGF5ZXI6IG51bGxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgICAgIHRoaXMuX3Zpc2libGVFYXJ0aHF1YWtlcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuX3pvb20gPSB6b29tO1xuICAgICAgICB0aGlzLl92aXN1YWxpemF0aW9uVHlwZSA9IFwibWFya2Vyc1wiO1xuICAgICAgICAvKiBpbml0aWFsIGNlbnRlciBwb2ludCAqL1xuICAgICAgICB0aGlzLl9jZW50ZXIgPSBjZW50ZXI7XG5cbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRGZWF0dXJlID0gbnVsbDtcbiAgICAgICAgdGhpcy5mZXRjaGVyID0gbmV3IEZldGNoZXIoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplTWFwKCkge1xuICAgICAgICB0aGlzLl9tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xuICAgICAgICAgICAgem9vbTogdGhpcy5fem9vbSxcbiAgICAgICAgICAgIGNlbnRlcjogdGhpcy5fY2VudGVyLFxuICAgICAgICAgICAgem9vbUNvbnRyb2w6IHRydWUsXG4gICAgICAgICAgICBzY2FsZUNvbnRyb2w6IHRydWUsXG4gICAgICAgICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2UsXG4gICAgICAgICAgICBtYXBUeXBlSWQ6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZC5URVJSQUlOXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3RlY3Rvbmljc0xheWVyID0gbmV3IFRlY3RvbmljTGF5ZXIodGhpcy5fbWFwKTtcblxuICAgICAgICB0aGlzLl9sYXllcnMubWFya2Vyc0xheWVyID0gbmV3IE1hcmtlcnNMYXllcih0aGlzLl9tYXApO1xuICAgICAgICB0aGlzLl9sYXllcnMuY2lyY2xlTGF5ZXIgPSBuZXcgQ2lyY2xlTGF5ZXIodGhpcy5fbWFwKTtcbiAgICAgICAgdGhpcy5fbGF5ZXJzLmhlYXRNYXBMYXllciA9IG5ldyBIZWF0TWFwTGF5ZXIodGhpcy5fbWFwKTtcblxuICAgICAgICB0aGlzLnNldFZpc3VhbGl6YXRpb25UeXBlKCdtYXJrZXJzTGF5ZXInKTtcblxuICAgICAgICAvKiByZWZyZXNoIGxpc3Qgd2hlbiBzdG9wIG1ha2luZyBjaGFuZ2VzICovXG4gICAgICAgIHRoaXMuX21hcC5hZGRMaXN0ZW5lcignaWRsZScsICgpID0+IHRoaXMuX3JlZnJlc2hFYXJ0aHF1YWtlc0xpc3QoKSk7XG5cblxuICAgICAgICBFUS5sb2dnZXIuZGVidWcoJ0FkZGluZyBsZWdlbmQgdG8gTWFwJyk7XG4gICAgICAgIGxldCBsZWdlbmQgPSAkKCcjbWFwLWxlZ2VuZCcpO1xuICAgICAgICB0aGlzLl9tYXAuY29udHJvbHNbZ29vZ2xlLm1hcHMuQ29udHJvbFBvc2l0aW9uLlJJR0hUX1RPUF0ucHVzaChsZWdlbmRbMF0pO1xuICAgICAgICBsZWdlbmQuc2hvdygpO1xuICAgIH1cblxuICAgIHNldERhdGEoZGF0YSkge1xuICAgICAgICBFUS5sb2dnZXIuaW5mbygnU2V0dGluZyBuZXcgZGF0YScpO1xuICAgICAgICBFUS5sb2dnZXIuZGVidWcoJ0VtcHR5aW5nIGRhdGEgbGF5ZXJzJyk7XG4gICAgICAgICQuZWFjaCh0aGlzLl9sYXllcnMsIChpLCBsYXllcikgPT4ge1xuICAgICAgICAgICAgbGF5ZXIuZW1wdHkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyogbmVlZCB0byB0YWtlIG5vcm1hbGl6ZWQgZGF0YSBmcm9tIEdvb2dsZSBNYXBzIEFQSSB0byBhdm9pZCBcbiAgICAgICAgLyogZnVydGhlciBzdGVwcyBkdXJpbmcgSGVhdE1hcENyZWF0aW9uICovXG4gICAgICAgIEVRLmxvZ2dlci5kZWJ1ZygnQWRkaW5nIGRhdGEgdG8gbGF5ZXJzJyk7XG4gICAgICAgIGxldCBub3JtYWxpemVkRGF0YSA9IHRoaXMuX2xheWVycy5tYXJrZXJzTGF5ZXIuYWRkRGF0YShkYXRhKTtcbiAgICAgICAgdGhpcy5fbGF5ZXJzLmNpcmNsZUxheWVyLmFkZERhdGEoZGF0YSk7XG4gICAgICAgIHRoaXMuX2xheWVycy5oZWF0TWFwTGF5ZXIuYWRkRGF0YShub3JtYWxpemVkRGF0YSk7XG5cbiAgICAgICAgRVEubG9nZ2VyLmRlYnVnKCdTdG9yaW5nIG5ldyBkYXRhJyk7XG4gICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgICAgICAgJC5lYWNoKGRhdGEuZmVhdHVyZXMsIChpLCBlYXJ0aHF1YWtlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhW2VhcnRocXVha2UuaWRdID0gZWFydGhxdWFrZTtcbiAgICAgICAgfSlcblxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKHRoaXMuX21hcCwgJ2lkbGUnKTtcbiAgICB9XG5cbiAgICBzZXRWaXN1YWxpemF0aW9uVHlwZSh2aXN1YWxpemF0aW9uVHlwZSkge1xuICAgICAgICBFUS5sb2dnZXIuZGVidWcoJ05ldyB2aXN1YWxpemF0aW9uIHR5cGUnLCB2aXN1YWxpemF0aW9uVHlwZSk7XG4gICAgICAgIHRoaXMuX3Zpc3VhbGl6YXRpb25UeXBlID0gdmlzdWFsaXphdGlvblR5cGU7XG5cbiAgICAgICAgJC5lYWNoKHRoaXMuX2xheWVycywgKGxheWVyTmFtZSwgbGF5ZXIpID0+IHtcbiAgICAgICAgICAgIGlmIChsYXllck5hbWUgPT09IHZpc3VhbGl6YXRpb25UeXBlKVxuICAgICAgICAgICAgICAgIGxheWVyLmVuYWJsZSgpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGxheWVyLmRpc2FibGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyogc2V0IG5ldyBsZWdlbmQgKi9cbiAgICAgICAgRVEubG9nZ2VyLmRlYnVnKCdTZXR0aW5nIG5ldyBsZWdlbmQgZm9yJywgdmlzdWFsaXphdGlvblR5cGUpO1xuICAgICAgICB0aGlzLl9zZXRMZWdlbmQodmlzdWFsaXphdGlvblR5cGUpO1xuICAgIH1cblxuICAgIGdldFZpc2libGVFYXJ0aHF1YWtlcygpIHtcbiAgICAgICAgbGV0IHZpc2libGVFYXJ0aHF1YWtlcyA9IFtdO1xuICAgICAgICB0aGlzLl9sYXllcnMubWFya2Vyc0xheWVyLl9sYXllci5mb3JFYWNoKChlYXJ0aHF1YWtlKSA9PiB7XG4gICAgICAgICAgICBsZXQgcG9zaXRpb24gPSBlYXJ0aHF1YWtlLmdldEdlb21ldHJ5KCkuZ2V0KCksXG4gICAgICAgICAgICAgICAgYm91bmRzID0gdGhpcy5fbWFwLmdldEJvdW5kcygpO1xuICAgICAgICAgICAgaWYgKGJvdW5kcyAmJiBib3VuZHMuY29udGFpbnMocG9zaXRpb24pKSB2aXNpYmxlRWFydGhxdWFrZXMucHVzaChlYXJ0aHF1YWtlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHZpc2libGVFYXJ0aHF1YWtlcztcbiAgICB9XG5cbiAgICByZWZyZXNoRGF0YSgpIHtcbiAgICAgICAgRVEubG9nZ2VyLmluZm8oJ1JlZnJlc2hpbmcgZGF0YScpO1xuICAgICAgICB0aGlzLmZldGNoZXJcbiAgICAgICAgICAgIC5mZXRjaERhdGEoKVxuICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAvKiBHZW9KU09OIG9iamVjdCwgdHlwZTogRmVhdHVyZUNvbGxlY3Rpb24gKi9cbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfc2V0TGVnZW5kKHZpc3VhbGl6YXRpb25UeXBlKSB7XG4gICAgICAgICQoJyNtYXAtbGVnZW5kIC5tYXAtbGVnZW5kJykuaGlkZSgpO1xuICAgICAgICAkKCcjJyArIHZpc3VhbGl6YXRpb25UeXBlICsgJy1tYXAtbGVnZW5kJykuc2hvdygpO1xuICAgIH1cblxuICAgIC8qIGNhbGxlZCB0byByZWZyZXNoIHRoZSBsaXN0IG9mIGVxLmtlcyAqL1xuICAgIF9yZWZyZXNoRWFydGhxdWFrZXNMaXN0KCkge1xuICAgICAgICB0aGlzLl92aXNpYmxlRWFydGhxdWFrZXMgPSB0aGlzLmdldFZpc2libGVFYXJ0aHF1YWtlcygpO1xuICAgICAgICBFUS5sb2dnZXIuZGVidWcoJ0ZvdW5kJywgdGhpcy5fdmlzaWJsZUVhcnRocXVha2VzLmxlbmd0aCwgJ3Zpc2libGUgZWFydGhxdWFrZXMnKTtcblxuICAgICAgICB0aGlzLl92aXNpYmxlRWFydGhxdWFrZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgdmFyIGFWYWwgPSBwYXJzZUZsb2F0KGEuZ2V0UHJvcGVydHkoJ21hZycpKTtcbiAgICAgICAgICAgIHZhciBiVmFsID0gcGFyc2VGbG9hdChiLmdldFByb3BlcnR5KCdtYWcnKSk7XG5cbiAgICAgICAgICAgIGlmIChpc05hTihiVmFsKSlcbiAgICAgICAgICAgICAgICBiVmFsID0gLTE7XG4gICAgICAgICAgICBpZiAoaXNOYU4oYVZhbCkpXG4gICAgICAgICAgICAgICAgYVZhbCA9IC0xO1xuXG4gICAgICAgICAgICByZXR1cm4gYlZhbCAtIGFWYWw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJyNlYXJ0aHF1YWtlLWxpc3QnKS5lbXB0eSgpO1xuXG4gICAgICAgICQuZWFjaCh0aGlzLl92aXNpYmxlRWFydGhxdWFrZXMsIChpLCBlYXJ0aHF1YWtlKSA9PiB7XG4gICAgICAgICAgICBsZXQgaWQgPSBlYXJ0aHF1YWtlLmdldElkKCk7XG4gICAgICAgICAgICBsZXQgbGlzdEVsZW1lbnQgPSB0aGlzLl9nZXRMaXN0RWxlbWVudCh7XG4gICAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBlYXJ0aHF1YWtlLmdldFByb3BlcnR5KCd0aXRsZScpLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBlYXJ0aHF1YWtlLmdldEdlb21ldHJ5KCkuZ2V0KCksXG4gICAgICAgICAgICAgICAgaW5kZXg6IGkgKyAxLFxuICAgICAgICAgICAgICAgIHRvdGFsOiB0aGlzLl92aXNpYmxlRWFydGhxdWFrZXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIG1hZ25pdHVkZTogZWFydGhxdWFrZS5nZXRQcm9wZXJ0eSgnbWFnJyksXG4gICAgICAgICAgICAgICAgdHN1bmFtaTogKGVhcnRocXVha2UuZ2V0UHJvcGVydHkoJ3RzdW5hbWknKSA9PT0gMSkgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGVwdGg6IHRoaXMuX2RhdGFbaWRdLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzJdLCAvLyBkZXB0aCBpbiBrbVxuICAgICAgICAgICAgICAgIGRhdGU6IG1vbWVudChlYXJ0aHF1YWtlLmdldFByb3BlcnR5KCd0aW1lJykpLmZvcm1hdCgnRC9NL1lZWVkgSEg6bW0nKSxcbiAgICAgICAgICAgICAgICB1cmw6IGVhcnRocXVha2UuZ2V0UHJvcGVydHkoJ3VybCcpLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxpc3RFbGVtZW50LmNsaWNrKCgpID0+IHRoaXMuc2VsZWN0RWFydGhxdWFrZShlYXJ0aHF1YWtlKSk7XG4gICAgICAgICAgICAkKCcjZWFydGhxdWFrZS1saXN0JykuYXBwZW5kKGxpc3RFbGVtZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnI2VhcnRocXVha2UtbnVtYmVyLWJhZGdlJykuaHRtbCh0aGlzLl92aXNpYmxlRWFydGhxdWFrZXMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBzZWxlY3RFYXJ0aHF1YWtlKGVhcnRocXVha2UpIHtcbiAgICAgICAgbGV0IGlkID0gZWFydGhxdWFrZS5nZXRJZCgpO1xuXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZEZlYXR1cmUpIHtcbiAgICAgICAgICAgIGxldCBvbGRJZCA9IHRoaXMuX3NlbGVjdGVkRmVhdHVyZS5nZXRJZCgpO1xuICAgICAgICAgICAgJCgnIycgKyBvbGRJZCkucmVtb3ZlQ2xhc3MoXCJlYXJ0aHF1YWtlLWxpc3QtaXRlbS1zZWxlY3RlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpdGVtID0gJCgnIycgKyBpZCk7XG4gICAgICAgIGl0ZW0uYWRkQ2xhc3MoXCJlYXJ0aHF1YWtlLWxpc3QtaXRlbS1zZWxlY3RlZFwiKTtcblxuICAgICAgICB0aGlzLl9zZWxlY3RlZEZlYXR1cmUgPSBlYXJ0aHF1YWtlO1xuXG4gICAgICAgICQuZWFjaCh0aGlzLl9sYXllcnMsIChsYXllck5hbWUsIGxheWVyKSA9PiBsYXllci5zZXRTZWxlY3RlZCh0aGlzLl9zZWxlY3RlZEZlYXR1cmUuZ2V0SWQoKSkpO1xuXG4gICAgICAgIGxldCBjb250YWluZXIgPSAkKCcjbGlzdC1wYW5lbCcpLFxuICAgICAgICAgICAgc2Nyb2xsVG8gPSBpdGVtO1xuXG4gICAgICAgIGNvbnRhaW5lci5zY3JvbGxUb3AoMCk7XG4gICAgICAgIGNvbnRhaW5lci5zY3JvbGxUb3AoXG4gICAgICAgICAgICBzY3JvbGxUby5vZmZzZXQoKS50b3AgLSBjb250YWluZXIub2Zmc2V0KCkudG9wXG4gICAgICAgICk7XG5cbiAgICAgICAgRVEubG9nZ2VyLmRlYnVnKCdTZWxlY3RlZCBlYXJ0aHF1YWtlJywgaWQpO1xuICAgIH1cblxuICAgIGNvbnZlcnRDb29yZGluYXRlcyhsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gICAgICAgIC8qKiBMYXRpdHVkZSAqL1xuICAgICAgICBsZXQgY29udmVydGVkTGF0aXR1ZGUgPSBNYXRoLmFicyhsYXRpdHVkZSksXG4gICAgICAgICAgICBsYXRpdHVkZUNhcmRpbmFsID0gKChsYXRpdHVkZSA+IDApID8gXCJOXCIgOiBcIlNcIiksXG4gICAgICAgICAgICBsYXRpdHVkZURlZ3JlZSA9IE1hdGguZmxvb3IoY29udmVydGVkTGF0aXR1ZGUpO1xuXG4gICAgICAgIGNvbnZlcnRlZExhdGl0dWRlID0gKGNvbnZlcnRlZExhdGl0dWRlIC0gbGF0aXR1ZGVEZWdyZWUpICogNjA7XG4gICAgICAgIGxldCBsYXRpdHVkZVByaW1lcyA9IE1hdGguZmxvb3IoY29udmVydGVkTGF0aXR1ZGUpO1xuXG4gICAgICAgIGNvbnZlcnRlZExhdGl0dWRlID0gKGNvbnZlcnRlZExhdGl0dWRlIC0gbGF0aXR1ZGVQcmltZXMpICogNjA7XG4gICAgICAgIGxldCBsYXRpdHVkZVNlY29uZHMgPSBNYXRoLmZsb29yKGNvbnZlcnRlZExhdGl0dWRlKTtcblxuICAgICAgICAvKiogTG9uZ2l0dWRlICovXG4gICAgICAgIGxldCBjb252ZXJ0ZWRMb25naXR1ZGUgPSBNYXRoLmFicyhsb25naXR1ZGUpLFxuICAgICAgICAgICAgTG9uZ2l0dWRlQ2FyZGluYWwgPSAoKGxvbmdpdHVkZSA+IDApID8gXCJFXCIgOiBcIldcIiksXG4gICAgICAgICAgICBMb25naXR1ZGVEZWdyZWUgPSBNYXRoLmZsb29yKGNvbnZlcnRlZExvbmdpdHVkZSk7XG5cbiAgICAgICAgY29udmVydGVkTG9uZ2l0dWRlID0gKGNvbnZlcnRlZExvbmdpdHVkZSAtIExvbmdpdHVkZURlZ3JlZSkgKiA2MDtcbiAgICAgICAgbGV0IExvbmdpdHVkZVByaW1lcyA9IE1hdGguZmxvb3IoY29udmVydGVkTG9uZ2l0dWRlKTtcblxuICAgICAgICBjb252ZXJ0ZWRMb25naXR1ZGUgPSAoY29udmVydGVkTG9uZ2l0dWRlIC0gTG9uZ2l0dWRlUHJpbWVzKSAqIDYwO1xuICAgICAgICBsZXQgTG9uZ2l0dWRlU2Vjb25kcyA9IE1hdGguZmxvb3IoY29udmVydGVkTG9uZ2l0dWRlKTtcblxuICAgICAgICByZXR1cm4gbGF0aXR1ZGVEZWdyZWUgKyAnwrAgJyArIGxhdGl0dWRlUHJpbWVzICsgXCInIFwiICsgbGF0aXR1ZGVTZWNvbmRzICsgJ1wiICcgKyBsYXRpdHVkZUNhcmRpbmFsICsgJywgJyArXG4gICAgICAgICAgICBMb25naXR1ZGVEZWdyZWUgKyAnwrAgJyArIExvbmdpdHVkZVByaW1lcyArIFwiJyBcIiArIExvbmdpdHVkZVNlY29uZHMgKyAnXCIgJyArIExvbmdpdHVkZUNhcmRpbmFsO1xuICAgIH1cblxuICAgIF9nZXRMaXN0RWxlbWVudChvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiAkKCc8ZGl2IGlkPVwiJyArIG9wdGlvbnMuaWQgKyAnXCIgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gZWFydGhxdWFrZS1saXN0LWl0ZW1cIj4gJyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImVhcnRocXVha2UtbGlzdC1pdGVtLWNvbnRlbnQgd2lkdGgtaGVpZ2h0LTEwMFwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJlYXJ0aHF1YWtlLWxpc3QtaXRlbS1oZWFkZXIgd2lkdGgtaGVpZ2h0LTEwMFwiPjxiPicgKyBvcHRpb25zLnRpdGxlICsgJzwvYj48L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZWFydGhxdWFrZS1saXN0LWl0ZW0tYm9keSB3aWR0aC1oZWlnaHQtMTAwXCI+JyArXG4gICAgICAgICAgICAoRVEuZGVidWcgPyAnSUQ6ICcgKyBvcHRpb25zLmlkICsgJzxicj4nIDogJycpICtcbiAgICAgICAgICAgICdQb3NpdGlvbiAnICsgdGhpcy5jb252ZXJ0Q29vcmRpbmF0ZXMob3B0aW9ucy5wb3NpdGlvbi5sYXQoKSwgb3B0aW9ucy5wb3NpdGlvbi5sbmcoKSkgKyAnPGJyPicgK1xuICAgICAgICAgICAgKCQuaXNOdW1lcmljKG9wdGlvbnMubWFnbml0dWRlKSA/ICdNYWduaXR1ZGUgJyArIG9wdGlvbnMubWFnbml0dWRlLnRvRml4ZWQoMikgKyAnPGJyPicgOiAnJykgK1xuICAgICAgICAgICAgKG9wdGlvbnMudHN1bmFtaSA/ICdUc3VuYW1pJyArICc8YnI+JyA6ICcnKSArXG4gICAgICAgICAgICAnRGVwdGggJyArIG9wdGlvbnMuZGVwdGgudG9GaXhlZCgyKSArICcga208YnI+JyArXG4gICAgICAgICAgICAnRGF0ZSAnICsgb3B0aW9ucy5kYXRlICsgJzxicj4nICtcbiAgICAgICAgICAgICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArIG9wdGlvbnMudXJsICsgJ1wiPkRldGFpbHM8L2E+JyArXG4gICAgICAgICAgICAnPC9kaXY+PC9kaXY+PC9kaXY+J1xuICAgICAgICApO1xuICAgIH1cblxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYXRNYXBMYXllciB7XG4gICAgY29uc3RydWN0b3IobWFwKSB7XG4gICAgICAgIHRoaXMuX21hcCA9IG1hcDtcbiAgICAgICAgdGhpcy5fbGF5ZXIgPSBuZXcgZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXIoe1xuICAgICAgICAgICAgZGlzc2lwYXRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgb3BhY2l0eTogMC42LFxuICAgICAgICAgICAgbWFwOiBudWxsLFxuICAgICAgICAgICAgZ3JhZGllbnQ6IFsncmdiYSgwLCAyNTUsIDI1NSwgMCknXS5jb25jYXQoY29sb3JicmV3ZXIuWWxPclJkWzZdKVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9pbml0aWFsaXplKCk7XG4gICAgfVxuXG4gICAgX2luaXRpYWxpemUoKSB7fVxuXG4gICAgYWRkRGF0YShkYXRhKSB7XG4gICAgICAgIGxldCBoZWF0bWFwRGF0YSA9IFtdO1xuICAgICAgICBkYXRhLmZvckVhY2goKGVhcnRocXVha2UpID0+IHtcbiAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IGVhcnRocXVha2UuZ2V0R2VvbWV0cnkoKS5nZXQoKSxcbiAgICAgICAgICAgICAgICBtYWduaXR1ZGUgPSBlYXJ0aHF1YWtlLmdldFByb3BlcnR5KCdtYWcnKTtcbiAgICAgICAgICAgIGhlYXRtYXBEYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IE1hdGgucG93KDIsIG1hZ25pdHVkZSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgZGF0YUFycmF5ID0gbmV3IGdvb2dsZS5tYXBzLk1WQ0FycmF5KGhlYXRtYXBEYXRhKTtcbiAgICAgICAgdGhpcy5fbGF5ZXIuc2V0KCdkYXRhJywgZGF0YUFycmF5KTtcbiAgICB9XG5cbiAgICBzZXRTZWxlY3RlZChlYXJ0aHF1YWtlKSB7fVxuICAgIFxuICAgIGVtcHR5KCkge1xuICAgICAgICBsZXQgZGF0YUFycmF5ID0gbmV3IGdvb2dsZS5tYXBzLk1WQ0FycmF5KFtdKTtcbiAgICAgICAgdGhpcy5fbGF5ZXIuc2V0KCdkYXRhJywgZGF0YUFycmF5KTtcbiAgICB9XG5cbiAgICBlbmFibGUoKSB7XG4gICAgICAgIHRoaXMuX2xheWVyLnNldE1hcCh0aGlzLl9tYXApO1xuICAgIH1cbiAgICBkaXNhYmxlKCkge1xuICAgICAgICB0aGlzLl9sYXllci5zZXRNYXAobnVsbCk7XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmtlcnNMYXllciB7XG4gICAgY29uc3RydWN0b3IobWFwKSB7XG4gICAgICAgIHRoaXMuX21hcCA9IG1hcDtcbiAgICAgICAgdGhpcy5fbGF5ZXIgPSBuZXcgZ29vZ2xlLm1hcHMuRGF0YSh7XG4gICAgICAgICAgICBtYXA6IG51bGxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpemUoKTtcbiAgICB9XG5cbiAgICBfaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5fbGF5ZXIuc2V0U3R5bGUoKGVhcnRocXVha2UpID0+IHRoaXMuX2dldE1hcmtlcnNTdHlsZShlYXJ0aHF1YWtlKSk7XG4gICAgICAgIHRoaXMuX2xheWVyLmFkZExpc3RlbmVyKCdjbGljaycsIChlYXJ0aHF1YWtlKSA9PiB7XG4gICAgICAgICAgICBFUS5tYXAuc2VsZWN0RWFydGhxdWFrZShlYXJ0aHF1YWtlLmZlYXR1cmUpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFkZERhdGEoZGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGF5ZXIuYWRkR2VvSnNvbihkYXRhKTtcbiAgICB9XG5cbiAgICBzZXRTZWxlY3RlZChlYXJ0aHF1YWtlSWQpIHtcbiAgICAgICAgbGV0IGVhcnRocXVha2UgPSB0aGlzLl9sYXllci5nZXRGZWF0dXJlQnlJZChlYXJ0aHF1YWtlSWQpO1xuXG4gICAgICAgIHRoaXMuX2xheWVyLnJldmVydFN0eWxlKCk7XG4gICAgICAgIHRoaXMuX2xheWVyLm92ZXJyaWRlU3R5bGUoZWFydGhxdWFrZSwge1xuICAgICAgICAgICAgaWNvbjogJ2Fzc2V0cy9zZWxlY3RlZC1mZWF0dXJlLnBuZycsXG4gICAgICAgICAgICB6SW5kZXg6IDUwMFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBlbXB0eSgpIHtcbiAgICAgICAgbGV0IGRhdGFMYXllciA9IHRoaXMuX2xheWVyO1xuICAgICAgICBkYXRhTGF5ZXIuZm9yRWFjaCgoZmVhdHVyZSkgPT4ge1xuICAgICAgICAgICAgZGF0YUxheWVyLnJlbW92ZShmZWF0dXJlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZW5hYmxlKCkge1xuICAgICAgICB0aGlzLl9sYXllci5zZXRNYXAodGhpcy5fbWFwKTtcbiAgICB9XG4gICAgZGlzYWJsZSgpIHtcbiAgICAgICAgdGhpcy5fbGF5ZXIuc2V0TWFwKG51bGwpO1xuICAgIH1cblxuICAgIF9nZXRNYXJrZXJzU3R5bGUoZmVhdHVyZSkge1xuICAgICAgICBsZXQgbWFnbml0dWRlID0gZmVhdHVyZS5nZXRQcm9wZXJ0eSgnbWFnJyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB6SW5kZXg6IE1hdGguZmxvb3IobWFnbml0dWRlICogMTApXG4gICAgICAgIH07XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlY3RvbmljTGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICB0aGlzLl9wb2x5Z29ucyA9IFtdO1xuICAgICAgICB0aGlzLl9sYXllciA9IG5ldyBnb29nbGUubWFwcy5EYXRhKHtcbiAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9jdXJyZW50TGFiZWwgPSBudWxsO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplKCk7XG4gICAgfVxuXG4gICAgX2luaXRpYWxpemUoKSB7XG4gICAgICAgICQuZ2V0SlNPTihcImFzc2V0cy90ZWN0b25pY3MtcGxhdGUuanNvblwiKVxuICAgICAgICAgICAgLnRoZW4oKHRlY3RvbmljcykgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0ZWN0b25pY3NEYXRhID0gdGhpcy5fbGF5ZXIuYWRkR2VvSnNvbih0ZWN0b25pY3MpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NyZXRlUG9seWdvbnModGVjdG9uaWNzRGF0YSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9sYXllci5zZXRTdHlsZSh0aGlzLl9nZXRUZWN0b25pY3NTdHlsZSk7XG5cbiAgICAgICAgdGhpcy5fbGF5ZXIuYWRkTGlzdGVuZXIoJ21vdXNlb3ZlcicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudExhYmVsID0gZXZlbnQuZmVhdHVyZS5nZXRQcm9wZXJ0eSgnbmFtZScpO1xuICAgICAgICAgICAgJCgnI3BsYXRlLXRvb2x0aXAnKS5odG1sKHRoaXMuX2N1cnJlbnRMYWJlbCk7XG4gICAgICAgICAgICB0aGlzLl9sYXllci5yZXZlcnRTdHlsZSgpO1xuICAgICAgICAgICAgdGhpcy5fbGF5ZXIub3ZlcnJpZGVTdHlsZShldmVudC5mZWF0dXJlLCB7XG4gICAgICAgICAgICAgICAgc3Ryb2tlV2VpZ2h0OiAyLjUsXG4gICAgICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDAuMTVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9sYXllci5hZGRMaXN0ZW5lcignbW91c2VvdXQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRMYWJlbCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9sYXllci5yZXZlcnRTdHlsZSgpO1xuICAgICAgICAgICAgJCgnI3BsYXRlLXRvb2x0aXAnKS5odG1sKFwiXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50KS5tb3VzZW1vdmUoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudExhYmVsKVxuICAgICAgICAgICAgICAgICQoJyNwbGF0ZS10b29sdGlwJykub2Zmc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogZXZlbnQucGFnZVggLSA3NSxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBldmVudC5wYWdlWSArIDMwXG4gICAgICAgICAgICAgICAgfSkuc2hvdygpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICQoJyNwbGF0ZS10b29sdGlwJykuaGlkZSgpO1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9jcmV0ZVBvbHlnb25zKHRlY3Rvbmljc0RhdGEpIHtcbiAgICAgICAgJC5lYWNoKHRlY3Rvbmljc0RhdGEsIChpLCB0ZWN0b25pYykgPT4ge1xuICAgICAgICAgICAgbGV0IHRHZW9tZXRyeSA9IHRlY3RvbmljLmdldEdlb21ldHJ5KCksXG4gICAgICAgICAgICAgICAgcG9pbnRzID0gW107XG5cbiAgICAgICAgICAgIHRHZW9tZXRyeS5mb3JFYWNoTGF0TG5nKChwdCkgPT4ge1xuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKHB0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgcGxhdGVQb2x5Z29uID0gbmV3IGdvb2dsZS5tYXBzLlBvbHlnb24oe1xuICAgICAgICAgICAgICAgIHBhdGhzOiBwb2ludHNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcGxhdGVQb2x5Z29uLnNldCgnX19uYW1lJywgdGVjdG9uaWMuZ2V0UHJvcGVydHkoJ25hbWUnKSk7XG4gICAgICAgICAgICAvL3BsYXRlUG9seWdvbi5uYW1lID0gdGVjdG9uaWMuZ2V0UHJvcGVydHkoJycpXG4gICAgICAgICAgICB0aGlzLl9wb2x5Z29ucy5wdXNoKHBsYXRlUG9seWdvbik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9yZWZyZXNoKCkge1xuICAgICAgICB2YXIgbWFwID0gdGhpcy5fbGF5ZXIuZ2V0TWFwKCk7XG4gICAgICAgIHRoaXMuX2xheWVyLnNldE1hcChudWxsKTtcbiAgICAgICAgdGhpcy5fbGF5ZXIuc2V0TWFwKG1hcCk7XG4gICAgfVxuXG4gICAgX2dldFRlY3Rvbmljc1N0eWxlKGZlYXR1cmUpIHtcbiAgICAgICAgdmFyIGNvbG9yID0gZmVhdHVyZS5nZXRQcm9wZXJ0eSgnY29sb3InKSxcbiAgICAgICAgICAgIG5hbWUgPSBmZWF0dXJlLmdldFByb3BlcnR5KCduYW1lJyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZpbGxDb2xvcjogY29sb3IsXG4gICAgICAgICAgICBmaWxsT3BhY2l0eTogMC4xLFxuICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IGNvbG9yLFxuICAgICAgICAgICAgc3Ryb2tlV2VpZ2h0OiAxXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0UGxhdGVCeVBvaW50KGVhcnRocXVha2VQb3NpdGlvbikge1xuICAgICAgICBsZXQgcGxhdGVEYXRhID0ge1xuICAgICAgICAgICAgaW5zaWRlOiBbXSxcbiAgICAgICAgICAgIG5lYXI6IFtdLFxuICAgICAgICAgICAgYWxsOiBbXSxcbiAgICAgICAgfTtcblxuICAgICAgICAkLmVhY2godGhpcy5fcG9seWdvbnMsIChpLCBwbGF0ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGdvb2dsZS5tYXBzLmdlb21ldHJ5LnBvbHkuY29udGFpbnNMb2NhdGlvbihlYXJ0aHF1YWtlUG9zaXRpb24sIHBsYXRlKSkge1xuICAgICAgICAgICAgICAgIHBsYXRlRGF0YS5pbnNpZGUucHVzaChwbGF0ZS5nZXQoJ19fbmFtZScpKTtcbiAgICAgICAgICAgICAgICBwbGF0ZURhdGEuYWxsLnB1c2gocGxhdGUuZ2V0KCdfX25hbWUnKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGdvb2dsZS5tYXBzLmdlb21ldHJ5LnBvbHkuaXNMb2NhdGlvbk9uRWRnZShlYXJ0aHF1YWtlUG9zaXRpb24sIHBsYXRlLCAxMGUtMSkpIHtcbiAgICAgICAgICAgICAgICBwbGF0ZURhdGEubmVhci5wdXNoKHBsYXRlLmdldCgnX19uYW1lJykpO1xuICAgICAgICAgICAgICAgIHBsYXRlRGF0YS5hbGwucHVzaChwbGF0ZS5nZXQoJ19fbmFtZScpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGxhdGVEYXRhLmFsbC5zb3J0KCk7XG4gICAgICAgIHJldHVybiBwbGF0ZURhdGE7XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2dlciB7XG4gICAgY29uc3RydWN0b3IobG9nTGV2ZWwpIHtcbiAgICAgICAgdGhpcy5fbG9nTGV2ZWwgPSBsb2dMZXZlbDtcbiAgICAgICAgdGhpcy5Mb2dMZXZlbCA9IExvZ2dlci5Mb2dMZXZlbDtcblxuICAgICAgICB0aGlzLl9zdHlsZXMgPSB7XG4gICAgICAgICAgICBlcnJvcjogJ2NvbG9yOiB5ZWxsb3c7IGJhY2tncm91bmQ6ICNGRjQwNDAnLFxuICAgICAgICAgICAgd2FybjogJ2NvbG9yOiAjRkY0MDQwOyBiYWNrZ3JvdW5kOiAjZWVkNDgyJyxcbiAgICAgICAgICAgIGluZm86ICdjb2xvcjogYmx1ZScsXG4gICAgICAgICAgICBkZWJ1ZzogJ2NvbG9yOiBncmVlbidcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9qb2luU3ltYm9sID0gJyAnO1xuXG4gICAgICAgICQuZWFjaCh0aGlzLkxvZ0xldmVsLCAobG9nTGV2ZWwpID0+IHtcbiAgICAgICAgICAgIHRoaXNbbG9nTGV2ZWxdID0gKCguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nKGxvZ0xldmVsLCAuLi5hcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IExvZ0xldmVsKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZXJyb3I6IDEsXG4gICAgICAgICAgICB3YXJuOiAyLFxuICAgICAgICAgICAgaW5mbzogMyxcbiAgICAgICAgICAgIGRlYnVnOiA0XG4gICAgICAgIH07XG4gICAgfSAgXG5cbiAgICBzZXRMb2dMZXZlbChsb2dMZXZlbCkge1xuICAgICAgICBpZiAoJC5pc051bWVyaWMobG9nTGV2ZWwpICYmIGxvZ0xldmVsID4gLTEpXG4gICAgICAgICAgICB0aGlzLl9sb2dMZXZlbCA9IGxvZ0xldmVsO1xuICAgIH1cblxuICAgIF9sb2cobG9nVHlwZSwgLi4ubXNnTGlzdCkge1xuICAgICAgICBpZiAoIXRoaXMuX2lzTG9nZ2FibGUobG9nVHlwZSkpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgbGV0IHN0eWxlID0gdGhpcy5fc3R5bGVzW2xvZ1R5cGVdLFxuICAgICAgICAgICAgZmluYWxNc2cgPSBcIiVjXCIgKyBtc2dMaXN0LmpvaW4odGhpcy5fam9pblN5bWJvbCk7XG5cbiAgICAgICAgY29uc29sZVtsb2dUeXBlXS5hcHBseShjb25zb2xlLCBbZmluYWxNc2csIHN0eWxlXSk7XG4gICAgfVxuXG4gICAgX2lzTG9nZ2FibGUobG9nTGV2ZWxJZCkge1xuICAgICAgICBsZXQgbG9nTGV2ZWwgPSB0aGlzLkxvZ0xldmVsW2xvZ0xldmVsSWRdO1xuICAgICAgICByZXR1cm4gbG9nTGV2ZWwgPD0gdGhpcy5fbG9nTGV2ZWw7XG4gICAgfVxufSJdfQ==
