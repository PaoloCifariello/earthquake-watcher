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
            }) : $.getJSON('/assets/proxy-data.json').then(function (data) {
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
            }) : $.getJSON('/assets/proxy-emptydata.json').then(function (data) {
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
                icon: '/assets/selected-feature.png',
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

            $.getJSON("/assets/tectonics-plate.json").then(function (tectonics) {
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvZGF0YS9GZXRjaGVyLmpzIiwic3JjL2pzL2RhdGEvUHJveHkuanMiLCJzcmMvanMvZ3JhcGgvR3JhcGhNYW5hZ2VyLmpzIiwic3JjL2pzL21haW4uanMiLCJzcmMvanMvbWFwL0NpcmNsZUxheWVyLmpzIiwic3JjL2pzL21hcC9FYXJ0aHF1YWtlTWFwLmpzIiwic3JjL2pzL21hcC9IZWF0TWFwTGF5ZXIuanMiLCJzcmMvanMvbWFwL01hcmtlcnNMYXllci5qcyIsInNyYy9qcy9tYXAvVGVjdG9uaWNMYXllci5qcyIsInNyYy9qcy91dGlsL0xvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7OztxQkNBa0IsU0FBUzs7OztJQUVOLE9BQU87QUFDYixhQURNLE9BQU8sR0FDVjs4QkFERyxPQUFPOztBQUVwQixZQUFJLENBQUMsTUFBTSxHQUFHLHdCQUFXLENBQUM7QUFDMUIsWUFBSSxDQUFDLFFBQVEsR0FBRztBQUNaLHFCQUFTLEVBQUUsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUN4QyxtQkFBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztTQUN4RCxDQUFDOztBQUVGLFlBQUksQ0FBQyxJQUFJLEdBQUcsdUdBQXVHLENBQUM7S0FDdkg7O2lCQVRnQixPQUFPOztlQVdmLHFCQUFHO0FBQ1IsY0FBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25ELGdCQUFJLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDM0Isb0JBQVEsRUFBRSxDQUFDLEtBQUs7QUFDaEIscUJBQUssTUFBTTtBQUNQO0FBQ0ksdUNBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdB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LGNBQUMsT0FBTyxFQUFjO0FBQ3RCLGdCQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFDMUIsT0FBTzs7K0NBRkUsT0FBTztBQUFQLHVCQUFPOzs7QUFJcEIsZ0JBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2dCQUM3QixRQUFRLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVyRCxtQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUN0RDs7O2VBRVUscUJBQUMsVUFBVSxFQUFFO0FBQ3BCLGdCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3pDLG1CQUFPLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ3JDOzs7YUEzQmtCLGVBQUc7QUFDbEIsbUJBQU87QUFDSCxxQkFBSyxFQUFFLENBQUM7QUFDUixvQkFBSSxFQUFFLENBQUM7QUFDUCxvQkFBSSxFQUFFLENBQUM7QUFDUCxxQkFBSyxFQUFFLENBQUM7YUFDWCxDQUFDO1NBQ0w7OztXQTVCZ0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUHJveHkgZnJvbSAnLi9Qcm94eSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZldGNoZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9wcm94eSA9IG5ldyBQcm94eSgpO1xuICAgICAgICB0aGlzLl9vcHRpb25zID0ge1xuICAgICAgICAgICAgc3RhcnR0aW1lOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQnKSxcbiAgICAgICAgICAgIGVuZHRpbWU6IG1vbWVudCgpLmFkZCgxLCAnZGF5cycpLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fdXJsID0gXCJodHRwOi8vZWFydGhxdWFrZS51c2dzLmdvdi9mZHNud3MvZXZlbnQvMS9xdWVyeT9mb3JtYXQ9Z2VvanNvbiZldmVudHR5cGU9ZWFydGhxdWFrZSZvcmRlcmJ5PW1hZ25pdHVkZVwiO1xuICAgIH1cblxuICAgIGZldGNoRGF0YSgpIHtcbiAgICAgICAgRVEubG9nZ2VyLmluZm8oJ0ZldGNoaW5nIG5ldyBkYXRhIGZyb20nLCBFUS5wcm94eSk7XG4gICAgICAgIGxldCBwcm9taXNlVG9SZXR1cm4gPSBudWxsO1xuICAgICAgICBzd2l0Y2ggKEVRLnByb3h5KSB7XG4gICAgICAgIGNhc2UgJ3Rlc3QnOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHByb21pc2VUb1JldHVybiA9IHRoaXMuX3Byb3h5LmdldFRlc3REYXRhKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIGNhc2UgJ3JlYWwnOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICQoJyNsb2FkaW5nLXdpbmRvdycpLnNob3coKTtcbiAgICAgICAgICAgICAgICBwcm9taXNlVG9SZXR1cm4gPSB0aGlzLl9nZXRGcm9tQVBJKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2VtcHR5JzpcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwcm9taXNlVG9SZXR1cm4gPSB0aGlzLl9wcm94eS5nZXRFbXB0eURhdGEoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcm9taXNlVG9SZXR1cm47XG4gICAgfVxuXG4gICAgc2V0KGRhdGFLZXksIGRhdGEpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9uc1tkYXRhS2V5XSA9IGRhdGE7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9nZXRGcm9tQVBJKCkge1xuICAgICAgICBsZXQgdXJsID0gdGhpcy5fdXJsO1xuICAgICAgICAkLmVhY2godGhpcy5fb3B0aW9ucywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgIHVybCArPSAnJicgKyBrZXkgKyAnPScgKyB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiAkLmdldEpTT04odXJsKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAkKCcjbG9hZGluZy13aW5kb3cnKS5oaWRlKCk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb3h5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fZGF0YSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2VtcHR5RGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0VGVzdERhdGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhID9cbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuX2RhdGEpO1xuICAgICAgICAgICAgfSkgOlxuICAgICAgICAgICAgJC5nZXRKU09OKCcvYXNzZXRzL3Byb3h5LWRhdGEuanNvbicpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEVtcHR5RGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VtcHR5RGF0YSA/XG4gICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLl9lbXB0eURhdGEpO1xuICAgICAgICAgICAgfSkgOlxuICAgICAgICAgICAgJC5nZXRKU09OKCcvYXNzZXRzL3Byb3h5LWVtcHR5ZGF0YS5qc29uJykudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VtcHR5RGF0YSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JhcGhNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBkcmF3R3JhcGgodmlzaWJsZUVhcnRocXVha2VzKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5fbm9ybWFsaXplRGF0YSh2aXNpYmxlRWFydGhxdWFrZXMpO1xuICAgICAgICAkKCcjY2hhcnQtc3ZnJykuZW1wdHkoKTtcblxuICAgICAgICBudi5hZGRHcmFwaCgoKSA9PiB7XG4gICAgICAgICAgICBFUS5sb2dnZXIuaW5mbygnQ3JlYXRpbmcgbmV3IGdyYXBoJyk7XG4gICAgICAgICAgICB2YXIgY2hhcnQgPSBudi5tb2RlbHMuc2NhdHRlckNoYXJ0KClcbiAgICAgICAgICAgICAgICAudXNlVm9yb25vaSh0cnVlKVxuICAgICAgICAgICAgICAgIC5jb2xvcihkMy5zY2FsZS5jYXRlZ29yeTEwKCkucmFuZ2UoKSlcbiAgICAgICAgICAgICAgICAuZHVyYXRpb24oMzAwKVxuXG4gICAgICAgICAgICBjaGFydC5zY2F0dGVyLnBvaW50RG9tYWluKFswLCAxMF0pO1xuXG4gICAgICAgICAgICBjaGFydC5ub0RhdGEoXCJObyBkYXRhIHRvIGRpc3BsYXlcIik7XG4gICAgICAgICAgICBjaGFydC50b29sdGlwLmNvbnRlbnRHZW5lcmF0b3IoKGRhdGEpID0+IHRoaXMuX2dldFRvb2x0aXAoZGF0YSkpO1xuICAgICAgICAgICAgLy9jaGFydC5kaXNwYXRjaC5vbigncmVuZGVyRW5kJywgZnVuY3Rpb24gKCkge30pO1xuXG4gICAgICAgICAgICBFUS5sb2dnZXIuZGVidWcoJ0F4aXMgY29uZmlndXJhdGlvbicpO1xuICAgICAgICAgICAgLyogWCBheGlzICovXG4gICAgICAgICAgICBjaGFydC5zaG93WEF4aXModHJ1ZSk7XG4gICAgICAgICAgICBjaGFydC54QXhpcy50aWNrRm9ybWF0KGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vbWVudC51bml4KGQpLmZvcm1hdCgnREQtTU0sIEhIOk1NJylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2hhcnQueEF4aXMuc2hvd01heE1pbihmYWxzZSk7XG4gICAgICAgICAgICBsZXQgZGF0ZVJhbmdlUGlja2VyID0gJCgnI3JlcG9ydHJhbmdlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJyksXG4gICAgICAgICAgICAgICAgc3RhcnREYXRlID0gbW9tZW50KGRhdGVSYW5nZVBpY2tlci5zdGFydERhdGUpLnVuaXgoKSxcbiAgICAgICAgICAgICAgICBlbmREYXRlID0gbW9tZW50KGRhdGVSYW5nZVBpY2tlci5lbmREYXRlKS51bml4KCk7XG5cbiAgICAgICAgICAgIGNoYXJ0LmZvcmNlWChbc3RhcnREYXRlLCBlbmREYXRlXSk7XG5cbiAgICAgICAgICAgIC8qIFkgYXhpcyAqL1xuICAgICAgICAgICAgY2hhcnQuZm9yY2VZKFswLCAxMF0pO1xuICAgICAgICAgICAgY2hhcnQueUF4aXMudGlja0Zvcm1hdChkMy5mb3JtYXQoJy4wMmYnKSk7XG5cbiAgICAgICAgICAgIGQzLnNlbGVjdCgnI2NoYXJ0LXN2ZycpXG4gICAgICAgICAgICAgICAgLmRhdHVtKGRhdGEpXG4gICAgICAgICAgICAgICAgLmNhbGwoY2hhcnQpO1xuXG4gICAgICAgICAgICBudi51dGlscy53aW5kb3dSZXNpemUoY2hhcnQudXBkYXRlKTtcblxuICAgICAgICAgICAgY2hhcnQuZGlzcGF0Y2gub24oJ3N0YXRlQ2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAoJ05ldyBTdGF0ZTonLCBKU09OLnN0cmluZ2lmeShlKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5fY2hhcnQgPSBjaGFydDtcbiAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5fY2hhcnQudXBkYXRlLCA1MDApO1xuXG4gICAgICAgICAgICBFUS5sb2dnZXIuaW5mbygnTmV3IGdyYXBoIGNyZWF0ZWQnKTtcbiAgICAgICAgICAgIHJldHVybiBjaGFydDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2dldFRvb2x0aXAoZGF0YSkge1xuICAgICAgICBsZXQgZWFydGhxdWFrZSA9IGRhdGEucG9pbnQuZWFydGhxdWFrZSxcbiAgICAgICAgICAgIHRpdGxlID0gZWFydGhxdWFrZS5nZXRQcm9wZXJ0eSgndGl0bGUnKSxcbiAgICAgICAgICAgIGRhdGUgPSBtb21lbnQoZWFydGhxdWFrZS5nZXRQcm9wZXJ0eSgndGltZScpKS5mb3JtYXQoJ0QtTS1ZWVlZIEhIOm1tJyksXG4gICAgICAgICAgICBwb2ludCA9IGVhcnRocXVha2UuZ2V0R2VvbWV0cnkoKS5nZXQoKSxcbiAgICAgICAgICAgIGxhdGl0dWRlID0gcG9pbnQubGF0KCksXG4gICAgICAgICAgICBsb25naXR1ZGUgPSBwb2ludC5sbmcoKSxcbiAgICAgICAgICAgIG1hZ25pdHVkZSA9IGVhcnRocXVha2UuZ2V0UHJvcGVydHkoJ21hZycpLFxuICAgICAgICAgICAgcGxhdGUgPSBkYXRhLnNlcmllc1swXS5rZXk7XG5cbiAgICAgICAgbGV0IHRvb2x0aXAgPSAkKCc8ZGl2PjxiPicgKyB0aXRsZSArICc8L2I+PGJyPicgK1xuICAgICAgICAgICAgcGxhdGUgKyAnPC9icj4nICtcbiAgICAgICAgICAgICdQb3NpdGlvbjogJyArIEVRLm1hcC5jb252ZXJ0Q29vcmRpbmF0ZXMobGF0aXR1ZGUsIGxvbmdpdHVkZSkgKyAnPGJyPicgK1xuICAgICAgICAgICAgJ01hZ25pdHVkZTogJyArIG1hZ25pdHVkZSArICc8YnI+JyArXG4gICAgICAgICAgICAnRGF0ZTogJyArIGRhdGUgKyAnPGJyPjwvZGl2PicpO1xuXG5cbiAgICAgICAgRVEubG9nZ2VyLmRlYnVnKCdUb29sdGlwIGZvcicsIGVhcnRocXVha2UuZ2V0SWQoKSk7XG4gICAgICAgIHJldHVybiB0b29sdGlwLmh0bWwoKTtcbiAgICB9XG5cbiAgICBfbm9ybWFsaXplRGF0YSh2aXNpYmxlRWFydGhxdWFrZXMpIHtcbiAgICAgICAgdmFyIHBsYXRlc0RhdGEgPSB7fSxcbiAgICAgICAgICAgIHJhbmRvbSA9IGQzLnJhbmRvbS5ub3JtYWwoKTtcblxuICAgICAgICBFUS5sb2dnZXIuZGVidWcoJ05vcm1hbGl6aW5nJywgdmlzaWJsZUVhcnRocXVha2VzLmxlbmd0aCwgJ2RhdGEnKTtcbiAgICAgICAgJC5lYWNoKHZpc2libGVFYXJ0aHF1YWtlcywgKGksIGVhcnRocXVha2UpID0+IHtcbiAgICAgICAgICAgIGxldCBwb2ludCA9IGVhcnRocXVha2UuZ2V0R2VvbWV0cnkoKS5nZXQoKSxcbiAgICAgICAgICAgICAgICBwbGF0ZXMgPSBFUS5tYXAuX3RlY3Rvbmljc0xheWVyLmdldFBsYXRlQnlQb2ludChwb2ludCksXG4gICAgICAgICAgICAgICAgcGxhdGVJZGVudGlmaWVyID0gcGxhdGVzLmluc2lkZVswXSB8fCBwbGF0ZXMubmVhclswXSxcbiAgICAgICAgICAgICAgICBtYWduaXR1ZGUgPSBlYXJ0aHF1YWtlLmdldFByb3BlcnR5KCdtYWcnKSB8fCAwLFxuICAgICAgICAgICAgICAgIHRpbWUgPSBtb21lbnQoZWFydGhxdWFrZS5nZXRQcm9wZXJ0eSgndGltZScpKS51bml4KCksXG4gICAgICAgICAgICAgICAgcGxhdGVFYXJ0aHF1YWtlcyA9IHBsYXRlc0RhdGFbcGxhdGVJZGVudGlmaWVyXSB8fCBbXTtcblxuICAgICAgICAgICAgcGxhdGVFYXJ0aHF1YWtlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICB4OiB0aW1lLFxuICAgICAgICAgICAgICAgIHk6IG1hZ25pdHVkZSxcbiAgICAgICAgICAgICAgICBzaXplOiBtYWduaXR1ZGUsIC8vQ29uZmlndXJlIHRoZSBzaXplIG9mIGVhY2ggc2NhdHRlciBwb2ludFxuICAgICAgICAgICAgICAgIHNoYXBlOiBcImNpcmNsZVwiLCAvL0NvbmZpZ3VyZSB0aGUgc2hhcGUgb2YgZWFjaCBzY2F0dGVyIHBvaW50LlxuICAgICAgICAgICAgICAgIGVhcnRocXVha2U6IGVhcnRocXVha2VcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwbGF0ZXNEYXRhW3BsYXRlSWRlbnRpZmllcl0gPSBwbGF0ZUVhcnRocXVha2VzO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgZGF0YSA9IFtdO1xuXG4gICAgICAgICQuZWFjaChwbGF0ZXNEYXRhLCAocGxhdGVOYW1lLCBwbGF0ZVZhbHVlcykgPT4ge1xuICAgICAgICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICBrZXk6IHBsYXRlTmFtZSxcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IHBsYXRlVmFsdWVzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIEVRLmxvZ2dlci5kZWJ1Zyh2aXNpYmxlRWFydGhxdWFrZXMubGVuZ3RoLCAnZGF0YSBub3JtYWxpemVkJyk7XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxufSIsImltcG9ydCBFYXJ0aHF1YWtlTWFwIGZyb20gJy4vbWFwL0VhcnRocXVha2VNYXAnO1xuaW1wb3J0IEdyYXBoTWFuYWdlciBmcm9tICcuL2dyYXBoL0dyYXBoTWFuYWdlcic7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vdXRpbC9Mb2dnZXInO1xuXG53aW5kb3cuRVEgPSB7XG4gICAgLyogSW5pdGlhbGl6YXRpb24gZnVuY3Rpb24gKi9cbiAgICBpbml0aWFsaXplOiBfaW5pdGlhbGl6ZSxcbiAgICAvKiBTaG93cyBkZWJ1ZyBpbmZvcm1hdGlvbiAqL1xuICAgIGRlYnVnOiBmYWxzZSxcbiAgICAvKiBBbGxvd3MgdG8gY2hvb3NlIGRhdGEgc291cmNlXG4gICAgICpcbiAgICAgKiAnZW1wdHknIC0+IG5vIGRhdGEgZm91bmQgZm9yIGVhY2ggZmlsdGVyIG9wdGlvbiBzcGVjaWZpZWQsIFxuICAgICAqICd0ZXN0JyAtPiB0ZXN0IGRhdGEsIHNhbWUgZGF0YSBpcyByZXR1cm5lZCBmb3IgZWFjaCBmaWx0ZXIgb3B0aW9uIHNwZWNpZmllZCwgXG4gICAgICogJ3JlYWwnIC0+IHJlYWwgZGF0YSwgZGF0YSByZXR1cm5lZCBhcmUgcmVhbCBvbmVzXG4gICAgICovXG4gICAgcHJveHk6ICdyZWFsJyxcbiAgICAvKiBXaWxsIGNvbnRhaW4gbWFpbiBvYmplY3RzICovXG4gICAgbWFwOiBudWxsLFxuICAgIGdyYXBoTWFuYWdlcjogbmV3IEdyYXBoTWFuYWdlcigpLFxuICAgIC8qIFNpbXBsZSBjb25maWd1cmFibGUgbG9nZ2VyLCBhYmxlIHRvIHNob3cgY29uc29sZSBtZXNzYWdlcyBkZXBlbmRpbmcgb24gTG9nTGV2ZWwgc3BlY2lmaWVkICovXG4gICAgbG9nZ2VyOiBuZXcgTG9nZ2VyKExvZ2dlci5Mb2dMZXZlbC5kZWJ1Zylcbn07XG5cbi8qIGluaXRpYWxpemF0aW9uIHdoZW4gR21hcHMgaXMgbG9hZGVkICovXG4vKiBpbml0aWFsaXphdGlvbiBjYW4gc3RhcnQgd2hlbiBHIG1hcHMgQVBJIGFuZCBkb2N1bWVudCBhcmUgZnVsbHkgbG9hZGVkICovXG5mdW5jdGlvbiBfaW5pdGlhbGl6ZSgpIHtcbiAgICAkKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvKiBJbml0aWFsaXplIE1hcCBvYmplY3QgKi9cbiAgICAgICAgbGV0IHpvb20gPSAyLFxuICAgICAgICAgICAgY2VudGVyID0ge1xuICAgICAgICAgICAgICAgIGxhdDogNDEuODUwLFxuICAgICAgICAgICAgICAgIGxuZzogLTg3LjY1MFxuICAgICAgICAgICAgfTtcblxuICAgICAgICBFUS5sb2dnZXIuZGVidWcoJ01hcCBpbml0aWFsaXphdGlvbicpO1xuICAgICAgICBFUS5tYXAgPSBuZXcgRWFydGhxdWFrZU1hcCh6b29tLCBjZW50ZXIpO1xuICAgICAgICBFUS5tYXAuaW5pdGlhbGl6ZU1hcCgpO1xuXG4gICAgICAgIC8qIGZpcnN0IHRpbWUgZGF0YSBmZXRjaCAqL1xuICAgICAgICBFUS5tYXAucmVmcmVzaERhdGEoKTtcblxuICAgICAgICBFUS5sb2dnZXIuZGVidWcoJ0VRIGluaXRpYWxpemVkJywgRVEuZGVidWcgPyAnIGluIGRldiBtb2RlJyA6IHVuZGVmaW5lZCk7XG4gICAgICAgIEVRLmxvZ2dlci5kZWJ1ZygnVmlzdWFsaXphdGlvbiB0eXBlIGluaXRpYWxpemF0aW9uJyk7XG4gICAgICAgIC8qIHNldCBoYW5kbGVyIGZvciB2aXN1YWxpemF0aW9uIHR5cGUgLT4gbGlzdCAqL1xuICAgICAgICAkKCdkaXYjcmFkaW8tb3B0aW9ucyBpbnB1dCcpLmNoYW5nZSgoKSA9PiBFUS5tYXAuc2V0VmlzdWFsaXphdGlvblR5cGUoJCgnZGl2I3JhZGlvLW9wdGlvbnMgaW5wdXQ6Y2hlY2tlZCcpLnZhbCgpKSk7XG5cbiAgICAgICAgRVEubG9nZ2VyLmRlYnVnKCdNYWduaXR1ZGUgcmFuZ2UgaW5pdGlhbGl6YXRpb24nKTtcbiAgICAgICAgLyogc2xpZGVyIGluaXRpYWxpemF0aW9uICovXG4gICAgICAgICQoXCIjbWFnbml0dWRlLXJhbmdlXCIpXG4gICAgICAgICAgICAuc2xpZGVyKHt9KVxuICAgICAgICAgICAgLm9uKCdzbGlkZVN0b3AnLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgRVEubG9nZ2VyLmluZm8oJ05ldyBtYWduaXR1ZGUgcmFuZ2UnLCBldnQudmFsdWVbMF0sICctJywgZXZ0LnZhbHVlWzFdKTtcbiAgICAgICAgICAgICAgICBFUS5tYXAuZmV0Y2hlclxuICAgICAgICAgICAgICAgICAgICAuc2V0KCdtaW5tYWduaXR1ZGUnLCBldnQudmFsdWVbMF0pXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoJ21heG1hZ25pdHVkZScsIGV2dC52YWx1ZVsxXSk7XG4gICAgICAgICAgICAgICAgRVEubWFwLnJlZnJlc2hEYXRhKCk7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgIC8qIERhdGUgcmFuZ2UgcGlja2VyIGluaXRpYWxpemF0aW9uICovXG4gICAgICAgIGZ1bmN0aW9uIGNiKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgICAgICQoJyNyZXBvcnRyYW5nZSBzcGFuJykuaHRtbChzdGFydC5mb3JtYXQoJ0QgTU1NTSwgWVlZWScpICsgJyAtICcgKyBlbmQuZm9ybWF0KCdEIE1NTU0sIFlZWVknKSk7XG4gICAgICAgIH1cbiAgICAgICAgY2IobW9tZW50KCksIG1vbWVudCgpKTtcbiAgICAgICAgLyogRGF0ZSByYW5nZSBwaWNrZXIgaW5pdGlhbGl6YXRpb24gKi9cbiAgICAgICAgJCgnI3JlcG9ydHJhbmdlJykuZGF0ZXJhbmdlcGlja2VyKHtcbiAgICAgICAgICAgIHJhbmdlczoge1xuICAgICAgICAgICAgICAgICdUb2RheSc6IFttb21lbnQoKSwgbW9tZW50KCldLFxuICAgICAgICAgICAgICAgICdZZXN0ZXJkYXknOiBbbW9tZW50KCkuc3VidHJhY3QoMSwgJ2RheXMnKSwgbW9tZW50KCkuc3VidHJhY3QoMSwgJ2RheXMnKV0sXG4gICAgICAgICAgICAgICAgJ0xhc3QgNyBEYXlzJzogW21vbWVudCgpLnN1YnRyYWN0KDcsICdkYXlzJyksIG1vbWVudCgpXVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBjYik7XG5cbiAgICAgICAgLyogY2FsbGJhY2sgd2hlbiBkYXRlIHJhbmdlIGNoYW5nZXMgKi9cbiAgICAgICAgJCgnI3JlcG9ydHJhbmdlJykub24oJ2FwcGx5LmRhdGVyYW5nZXBpY2tlcicsIGZ1bmN0aW9uIChldiwgcGlja2VyKSB7XG4gICAgICAgICAgICBFUS5sb2dnZXIuaW5mbygnTmV3IGRhdGUgcmFuZ2UnLCBwaWNrZXIuc3RhcnREYXRlLCAnLScsIHBpY2tlci5lbmREYXRlKTtcbiAgICAgICAgICAgIEVRLm1hcC5mZXRjaGVyXG4gICAgICAgICAgICAgICAgLnNldCgnc3RhcnR0aW1lJywgcGlja2VyLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSArICcgMDA6MDA6MDAnKVxuICAgICAgICAgICAgICAgIC5zZXQoJ2VuZHRpbWUnLCBwaWNrZXIuZW5kRGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSArICcgMjM6NTk6NTknKTtcbiAgICAgICAgICAgIEVRLm1hcC5yZWZyZXNoRGF0YSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKiBncmFwaCBtYW5hZ2VyIGluaXRpYWxpemF0aW9uICovXG4gICAgICAgICQoJyNzaG93LXRpbWVsaW5lJykuY2xpY2soKCkgPT4gRVEuZ3JhcGhNYW5hZ2VyLmRyYXdHcmFwaChFUS5tYXAuX3Zpc2libGVFYXJ0aHF1YWtlcykpO1xuXG4gICAgICAgIC8qIGhlYXRtYXAgbGVnZW5kIHRvb2x0aXAgKi9cbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICB9KTtcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDaXJjbGVMYXllciB7XG4gICAgY29uc3RydWN0b3IobWFwKSB7XG4gICAgICAgIHRoaXMuX21hcCA9IG1hcDtcbiAgICAgICAgdGhpcy5fbGF5ZXIgPSBuZXcgZ29vZ2xlLm1hcHMuRGF0YSh7XG4gICAgICAgICAgICBtYXA6IG1hcFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSgpO1xuICAgIH1cblxuICAgIF9pbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLl9sYXllci5zZXRTdHlsZSgoZWFydGhxdWFrZSkgPT4gdGhpcy5fZ2V0Q2lyY2xlU3R5bGUoZWFydGhxdWFrZSkpO1xuICAgICAgICB0aGlzLl9wYWxldHRlU2NhbGUgPSBkMy5zY2FsZS5xdWFudGl6ZSgpXG4gICAgICAgICAgICAuZG9tYWluKFswLCAxMF0pXG4gICAgICAgICAgICAucmFuZ2UoY29sb3JicmV3ZXIuWWxPclJkWzZdKTtcbiAgICB9XG5cbiAgICBhZGREYXRhKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xheWVyLmFkZEdlb0pzb24oZGF0YSk7XG4gICAgfVxuXG5cbiAgICBzZXRTZWxlY3RlZChlYXJ0aHF1YWtlSWQpIHt9XG5cbiAgICBlbXB0eSgpIHtcbiAgICAgICAgbGV0IGRhdGFMYXllciA9IHRoaXMuX2xheWVyO1xuICAgICAgICBkYXRhTGF5ZXIuZm9yRWFjaCgoZmVhdHVyZSkgPT4ge1xuICAgICAgICAgICAgZGF0YUxheWVyLnJlbW92ZShmZWF0dXJlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZW5hYmxlKCkge1xuICAgICAgICB0aGlzLl9sYXllci5zZXRNYXAodGhpcy5fbWFwKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlKCkge1xuICAgICAgICB0aGlzLl9sYXllci5zZXRNYXAobnVsbCk7XG4gICAgfVxuXG4gICAgLyogc2V0IGNpcmNsZSBzdHlsZSBtYXAgdmlzdWFsaXphdGlvbiAqL1xuICAgIF9nZXRDaXJjbGVTdHlsZShmZWF0dXJlKSB7XG4gICAgICAgIGxldCBtYWduaXR1ZGUgPSBmZWF0dXJlLmdldFByb3BlcnR5KCdtYWcnKSxcbiAgICAgICAgICAgIGNvbG9yID0gdGhpcy5fcGFsZXR0ZVNjYWxlKG1hZ25pdHVkZSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGljb246IHtcbiAgICAgICAgICAgICAgICBwYXRoOiBnb29nbGUubWFwcy5TeW1ib2xQYXRoLkNJUkNMRSxcbiAgICAgICAgICAgICAgICBzdHJva2VXZWlnaHQ6IDEsXG4gICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6ICdibGFjaycsXG4gICAgICAgICAgICAgICAgZmlsbENvbG9yOiBjb2xvcixcbiAgICAgICAgICAgICAgICBmaWxsT3BhY2l0eTogMC45LFxuICAgICAgICAgICAgICAgIHNjYWxlOiBtYWduaXR1ZGUgKiAyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgekluZGV4OiBNYXRoLmZsb29yKG1hZ25pdHVkZSAqIDEwKVxuICAgICAgICB9O1xuICAgIH1cbn0iLCJpbXBvcnQgVGVjdG9uaWNMYXllciBmcm9tICcuL1RlY3RvbmljTGF5ZXInO1xuaW1wb3J0IE1hcmtlcnNMYXllciBmcm9tICcuL01hcmtlcnNMYXllcic7XG5pbXBvcnQgQ2lyY2xlTGF5ZXIgZnJvbSAnLi9DaXJjbGVMYXllcic7XG5pbXBvcnQgSGVhdE1hcExheWVyIGZyb20gJy4vSGVhdE1hcExheWVyJztcblxuaW1wb3J0IEZldGNoZXIgZnJvbSAnLi4vZGF0YS9GZXRjaGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFydGhxdWFrZU1hcCB7XG4gICAgY29uc3RydWN0b3Ioem9vbSwgY2VudGVyKSB7XG4gICAgICAgIHRoaXMuX21hcCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fdGVjdG9uaWNzTGF5ZXIgPSBudWxsXG5cbiAgICAgICAgLyogbWFwIGxheWVycyAqL1xuICAgICAgICB0aGlzLl9sYXllcnMgPSB7XG4gICAgICAgICAgICBtYXJrZXJzTGF5ZXI6IG51bGwsXG4gICAgICAgICAgICBjaXJjbGVMYXllcjogbnVsbCxcbiAgICAgICAgICAgIGhlYXRNYXBMYXllcjogbnVsbFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgICAgICAgdGhpcy5fdmlzaWJsZUVhcnRocXVha2VzID0gW107XG5cbiAgICAgICAgdGhpcy5fem9vbSA9IHpvb207XG4gICAgICAgIHRoaXMuX3Zpc3VhbGl6YXRpb25UeXBlID0gXCJtYXJrZXJzXCI7XG4gICAgICAgIC8qIGluaXRpYWwgY2VudGVyIHBvaW50ICovXG4gICAgICAgIHRoaXMuX2NlbnRlciA9IGNlbnRlcjtcblxuICAgICAgICB0aGlzLl9zZWxlY3RlZEZlYXR1cmUgPSBudWxsO1xuICAgICAgICB0aGlzLmZldGNoZXIgPSBuZXcgRmV0Y2hlcigpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVNYXAoKSB7XG4gICAgICAgIHRoaXMuX21hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICAgICAgICB6b29tOiB0aGlzLl96b29tLFxuICAgICAgICAgICAgY2VudGVyOiB0aGlzLl9jZW50ZXIsXG4gICAgICAgICAgICB6b29tQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgICAgIHNjYWxlQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZSxcbiAgICAgICAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlRFUlJBSU5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fdGVjdG9uaWNzTGF5ZXIgPSBuZXcgVGVjdG9uaWNMYXllcih0aGlzLl9tYXApO1xuXG4gICAgICAgIHRoaXMuX2xheWVycy5tYXJrZXJzTGF5ZXIgPSBuZXcgTWFya2Vyc0xheWVyKHRoaXMuX21hcCk7XG4gICAgICAgIHRoaXMuX2xheWVycy5jaXJjbGVMYXllciA9IG5ldyBDaXJjbGVMYXllcih0aGlzLl9tYXApO1xuICAgICAgICB0aGlzLl9sYXllcnMuaGVhdE1hcExheWVyID0gbmV3IEhlYXRNYXBMYXllcih0aGlzLl9tYXApO1xuXG4gICAgICAgIHRoaXMuc2V0VmlzdWFsaXphdGlvblR5cGUoJ21hcmtlcnNMYXllcicpO1xuXG4gICAgICAgIC8qIHJlZnJlc2ggbGlzdCB3aGVuIHN0b3AgbWFraW5nIGNoYW5nZXMgKi9cbiAgICAgICAgdGhpcy5fbWFwLmFkZExpc3RlbmVyKCdpZGxlJywgKCkgPT4gdGhpcy5fcmVmcmVzaEVhcnRocXVha2VzTGlzdCgpKTtcblxuXG4gICAgICAgIEVRLmxvZ2dlci5kZWJ1ZygnQWRkaW5nIGxlZ2VuZCB0byBNYXAnKTtcbiAgICAgICAgbGV0IGxlZ2VuZCA9ICQoJyNtYXAtbGVnZW5kJyk7XG4gICAgICAgIHRoaXMuX21hcC5jb250cm9sc1tnb29nbGUubWFwcy5Db250cm9sUG9zaXRpb24uUklHSFRfVE9QXS5wdXNoKGxlZ2VuZFswXSk7XG4gICAgICAgIGxlZ2VuZC5zaG93KCk7XG4gICAgfVxuXG4gICAgc2V0RGF0YShkYXRhKSB7XG4gICAgICAgIEVRLmxvZ2dlci5pbmZvKCdTZXR0aW5nIG5ldyBkYXRhJyk7XG4gICAgICAgIEVRLmxvZ2dlci5kZWJ1ZygnRW1wdHlpbmcgZGF0YSBsYXllcnMnKTtcbiAgICAgICAgJC5lYWNoKHRoaXMuX2xheWVycywgKGksIGxheWVyKSA9PiB7XG4gICAgICAgICAgICBsYXllci5lbXB0eSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKiBuZWVkIHRvIHRha2Ugbm9ybWFsaXplZCBkYXRhIGZyb20gR29vZ2xlIE1hcHMgQVBJIHRvIGF2b2lkIFxuICAgICAgICAvKiBmdXJ0aGVyIHN0ZXBzIGR1cmluZyBIZWF0TWFwQ3JlYXRpb24gKi9cbiAgICAgICAgRVEubG9nZ2VyLmRlYnVnKCdBZGRpbmcgZGF0YSB0byBsYXllcnMnKTtcbiAgICAgICAgbGV0IG5vcm1hbGl6ZWREYXRhID0gdGhpcy5fbGF5ZXJzLm1hcmtlcnNMYXllci5hZGREYXRhKGRhdGEpO1xuICAgICAgICB0aGlzLl9sYXllcnMuY2lyY2xlTGF5ZXIuYWRkRGF0YShkYXRhKTtcbiAgICAgICAgdGhpcy5fbGF5ZXJzLmhlYXRNYXBMYXllci5hZGREYXRhKG5vcm1hbGl6ZWREYXRhKTtcblxuICAgICAgICBFUS5sb2dnZXIuZGVidWcoJ1N0b3JpbmcgbmV3IGRhdGEnKTtcbiAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgICAgICAkLmVhY2goZGF0YS5mZWF0dXJlcywgKGksIGVhcnRocXVha2UpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFbZWFydGhxdWFrZS5pZF0gPSBlYXJ0aHF1YWtlO1xuICAgICAgICB9KVxuXG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIodGhpcy5fbWFwLCAnaWRsZScpO1xuICAgIH1cblxuICAgIHNldFZpc3VhbGl6YXRpb25UeXBlKHZpc3VhbGl6YXRpb25UeXBlKSB7XG4gICAgICAgIEVRLmxvZ2dlci5kZWJ1ZygnTmV3IHZpc3VhbGl6YXRpb24gdHlwZScsIHZpc3VhbGl6YXRpb25UeXBlKTtcbiAgICAgICAgdGhpcy5fdmlzdWFsaXphdGlvblR5cGUgPSB2aXN1YWxpemF0aW9uVHlwZTtcblxuICAgICAgICAkLmVhY2godGhpcy5fbGF5ZXJzLCAobGF5ZXJOYW1lLCBsYXllcikgPT4ge1xuICAgICAgICAgICAgaWYgKGxheWVyTmFtZSA9PT0gdmlzdWFsaXphdGlvblR5cGUpXG4gICAgICAgICAgICAgICAgbGF5ZXIuZW5hYmxlKCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbGF5ZXIuZGlzYWJsZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKiBzZXQgbmV3IGxlZ2VuZCAqL1xuICAgICAgICBFUS5sb2dnZXIuZGVidWcoJ1NldHRpbmcgbmV3IGxlZ2VuZCBmb3InLCB2aXN1YWxpemF0aW9uVHlwZSk7XG4gICAgICAgIHRoaXMuX3NldExlZ2VuZCh2aXN1YWxpemF0aW9uVHlwZSk7XG4gICAgfVxuXG4gICAgZ2V0VmlzaWJsZUVhcnRocXVha2VzKCkge1xuICAgICAgICBsZXQgdmlzaWJsZUVhcnRocXVha2VzID0gW107XG4gICAgICAgIHRoaXMuX2xheWVycy5tYXJrZXJzTGF5ZXIuX2xheWVyLmZvckVhY2goKGVhcnRocXVha2UpID0+IHtcbiAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IGVhcnRocXVha2UuZ2V0R2VvbWV0cnkoKS5nZXQoKSxcbiAgICAgICAgICAgICAgICBib3VuZHMgPSB0aGlzLl9tYXAuZ2V0Qm91bmRzKCk7XG4gICAgICAgICAgICBpZiAoYm91bmRzICYmIGJvdW5kcy5jb250YWlucyhwb3NpdGlvbikpIHZpc2libGVFYXJ0aHF1YWtlcy5wdXNoKGVhcnRocXVha2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdmlzaWJsZUVhcnRocXVha2VzO1xuICAgIH1cblxuICAgIHJlZnJlc2hEYXRhKCkge1xuICAgICAgICBFUS5sb2dnZXIuaW5mbygnUmVmcmVzaGluZyBkYXRhJyk7XG4gICAgICAgIHRoaXMuZmV0Y2hlclxuICAgICAgICAgICAgLmZldGNoRGF0YSgpXG4gICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIC8qIEdlb0pTT04gb2JqZWN0LCB0eXBlOiBGZWF0dXJlQ29sbGVjdGlvbiAqL1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YShkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9zZXRMZWdlbmQodmlzdWFsaXphdGlvblR5cGUpIHtcbiAgICAgICAgJCgnI21hcC1sZWdlbmQgLm1hcC1sZWdlbmQnKS5oaWRlKCk7XG4gICAgICAgICQoJyMnICsgdmlzdWFsaXphdGlvblR5cGUgKyAnLW1hcC1sZWdlbmQnKS5zaG93KCk7XG4gICAgfVxuXG4gICAgLyogY2FsbGVkIHRvIHJlZnJlc2ggdGhlIGxpc3Qgb2YgZXEua2VzICovXG4gICAgX3JlZnJlc2hFYXJ0aHF1YWtlc0xpc3QoKSB7XG4gICAgICAgIHRoaXMuX3Zpc2libGVFYXJ0aHF1YWtlcyA9IHRoaXMuZ2V0VmlzaWJsZUVhcnRocXVha2VzKCk7XG4gICAgICAgIEVRLmxvZ2dlci5kZWJ1ZygnRm91bmQnLCB0aGlzLl92aXNpYmxlRWFydGhxdWFrZXMubGVuZ3RoLCAndmlzaWJsZSBlYXJ0aHF1YWtlcycpO1xuXG4gICAgICAgIHRoaXMuX3Zpc2libGVFYXJ0aHF1YWtlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICB2YXIgYVZhbCA9IHBhcnNlRmxvYXQoYS5nZXRQcm9wZXJ0eSgnbWFnJykpO1xuICAgICAgICAgICAgdmFyIGJWYWwgPSBwYXJzZUZsb2F0KGIuZ2V0UHJvcGVydHkoJ21hZycpKTtcblxuICAgICAgICAgICAgaWYgKGlzTmFOKGJWYWwpKVxuICAgICAgICAgICAgICAgIGJWYWwgPSAtMTtcbiAgICAgICAgICAgIGlmIChpc05hTihhVmFsKSlcbiAgICAgICAgICAgICAgICBhVmFsID0gLTE7XG5cbiAgICAgICAgICAgIHJldHVybiBiVmFsIC0gYVZhbDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnI2VhcnRocXVha2UtbGlzdCcpLmVtcHR5KCk7XG5cbiAgICAgICAgJC5lYWNoKHRoaXMuX3Zpc2libGVFYXJ0aHF1YWtlcywgKGksIGVhcnRocXVha2UpID0+IHtcbiAgICAgICAgICAgIGxldCBpZCA9IGVhcnRocXVha2UuZ2V0SWQoKTtcbiAgICAgICAgICAgIGxldCBsaXN0RWxlbWVudCA9IHRoaXMuX2dldExpc3RFbGVtZW50KHtcbiAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgdGl0bGU6IGVhcnRocXVha2UuZ2V0UHJvcGVydHkoJ3RpdGxlJyksXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGVhcnRocXVha2UuZ2V0R2VvbWV0cnkoKS5nZXQoKSxcbiAgICAgICAgICAgICAgICBpbmRleDogaSArIDEsXG4gICAgICAgICAgICAgICAgdG90YWw6IHRoaXMuX3Zpc2libGVFYXJ0aHF1YWtlcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgbWFnbml0dWRlOiBlYXJ0aHF1YWtlLmdldFByb3BlcnR5KCdtYWcnKSxcbiAgICAgICAgICAgICAgICB0c3VuYW1pOiAoZWFydGhxdWFrZS5nZXRQcm9wZXJ0eSgndHN1bmFtaScpID09PSAxKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkZXB0aDogdGhpcy5fZGF0YVtpZF0uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMl0sIC8vIGRlcHRoIGluIGttXG4gICAgICAgICAgICAgICAgZGF0ZTogbW9tZW50KGVhcnRocXVha2UuZ2V0UHJvcGVydHkoJ3RpbWUnKSkuZm9ybWF0KCdEL00vWVlZWSBISDptbScpLFxuICAgICAgICAgICAgICAgIHVybDogZWFydGhxdWFrZS5nZXRQcm9wZXJ0eSgndXJsJyksXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGlzdEVsZW1lbnQuY2xpY2soKCkgPT4gdGhpcy5zZWxlY3RFYXJ0aHF1YWtlKGVhcnRocXVha2UpKTtcbiAgICAgICAgICAgICQoJyNlYXJ0aHF1YWtlLWxpc3QnKS5hcHBlbmQobGlzdEVsZW1lbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcjZWFydGhxdWFrZS1udW1iZXItYmFkZ2UnKS5odG1sKHRoaXMuX3Zpc2libGVFYXJ0aHF1YWtlcy5sZW5ndGgpO1xuICAgIH1cblxuICAgIHNlbGVjdEVhcnRocXVha2UoZWFydGhxdWFrZSkge1xuICAgICAgICBsZXQgaWQgPSBlYXJ0aHF1YWtlLmdldElkKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkRmVhdHVyZSkge1xuICAgICAgICAgICAgbGV0IG9sZElkID0gdGhpcy5fc2VsZWN0ZWRGZWF0dXJlLmdldElkKCk7XG4gICAgICAgICAgICAkKCcjJyArIG9sZElkKS5yZW1vdmVDbGFzcyhcImVhcnRocXVha2UtbGlzdC1pdGVtLXNlbGVjdGVkXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGl0ZW0gPSAkKCcjJyArIGlkKTtcbiAgICAgICAgaXRlbS5hZGRDbGFzcyhcImVhcnRocXVha2UtbGlzdC1pdGVtLXNlbGVjdGVkXCIpO1xuXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkRmVhdHVyZSA9IGVhcnRocXVha2U7XG5cbiAgICAgICAgJC5lYWNoKHRoaXMuX2xheWVycywgKGxheWVyTmFtZSwgbGF5ZXIpID0+IGxheWVyLnNldFNlbGVjdGVkKHRoaXMuX3NlbGVjdGVkRmVhdHVyZS5nZXRJZCgpKSk7XG5cbiAgICAgICAgbGV0IGNvbnRhaW5lciA9ICQoJyNsaXN0LXBhbmVsJyksXG4gICAgICAgICAgICBzY3JvbGxUbyA9IGl0ZW07XG5cbiAgICAgICAgY29udGFpbmVyLnNjcm9sbFRvcCgwKTtcbiAgICAgICAgY29udGFpbmVyLnNjcm9sbFRvcChcbiAgICAgICAgICAgIHNjcm9sbFRvLm9mZnNldCgpLnRvcCAtIGNvbnRhaW5lci5vZmZzZXQoKS50b3BcbiAgICAgICAgKTtcblxuICAgICAgICBFUS5sb2dnZXIuZGVidWcoJ1NlbGVjdGVkIGVhcnRocXVha2UnLCBpZCk7XG4gICAgfVxuXG4gICAgY29udmVydENvb3JkaW5hdGVzKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgICAgICAgLyoqIExhdGl0dWRlICovXG4gICAgICAgIGxldCBjb252ZXJ0ZWRMYXRpdHVkZSA9IE1hdGguYWJzKGxhdGl0dWRlKSxcbiAgICAgICAgICAgIGxhdGl0dWRlQ2FyZGluYWwgPSAoKGxhdGl0dWRlID4gMCkgPyBcIk5cIiA6IFwiU1wiKSxcbiAgICAgICAgICAgIGxhdGl0dWRlRGVncmVlID0gTWF0aC5mbG9vcihjb252ZXJ0ZWRMYXRpdHVkZSk7XG5cbiAgICAgICAgY29udmVydGVkTGF0aXR1ZGUgPSAoY29udmVydGVkTGF0aXR1ZGUgLSBsYXRpdHVkZURlZ3JlZSkgKiA2MDtcbiAgICAgICAgbGV0IGxhdGl0dWRlUHJpbWVzID0gTWF0aC5mbG9vcihjb252ZXJ0ZWRMYXRpdHVkZSk7XG5cbiAgICAgICAgY29udmVydGVkTGF0aXR1ZGUgPSAoY29udmVydGVkTGF0aXR1ZGUgLSBsYXRpdHVkZVByaW1lcykgKiA2MDtcbiAgICAgICAgbGV0IGxhdGl0dWRlU2Vjb25kcyA9IE1hdGguZmxvb3IoY29udmVydGVkTGF0aXR1ZGUpO1xuXG4gICAgICAgIC8qKiBMb25naXR1ZGUgKi9cbiAgICAgICAgbGV0IGNvbnZlcnRlZExvbmdpdHVkZSA9IE1hdGguYWJzKGxvbmdpdHVkZSksXG4gICAgICAgICAgICBMb25naXR1ZGVDYXJkaW5hbCA9ICgobG9uZ2l0dWRlID4gMCkgPyBcIkVcIiA6IFwiV1wiKSxcbiAgICAgICAgICAgIExvbmdpdHVkZURlZ3JlZSA9IE1hdGguZmxvb3IoY29udmVydGVkTG9uZ2l0dWRlKTtcblxuICAgICAgICBjb252ZXJ0ZWRMb25naXR1ZGUgPSAoY29udmVydGVkTG9uZ2l0dWRlIC0gTG9uZ2l0dWRlRGVncmVlKSAqIDYwO1xuICAgICAgICBsZXQgTG9uZ2l0dWRlUHJpbWVzID0gTWF0aC5mbG9vcihjb252ZXJ0ZWRMb25naXR1ZGUpO1xuXG4gICAgICAgIGNvbnZlcnRlZExvbmdpdHVkZSA9IChjb252ZXJ0ZWRMb25naXR1ZGUgLSBMb25naXR1ZGVQcmltZXMpICogNjA7XG4gICAgICAgIGxldCBMb25naXR1ZGVTZWNvbmRzID0gTWF0aC5mbG9vcihjb252ZXJ0ZWRMb25naXR1ZGUpO1xuXG4gICAgICAgIHJldHVybiBsYXRpdHVkZURlZ3JlZSArICfCsCAnICsgbGF0aXR1ZGVQcmltZXMgKyBcIicgXCIgKyBsYXRpdHVkZVNlY29uZHMgKyAnXCIgJyArIGxhdGl0dWRlQ2FyZGluYWwgKyAnLCAnICtcbiAgICAgICAgICAgIExvbmdpdHVkZURlZ3JlZSArICfCsCAnICsgTG9uZ2l0dWRlUHJpbWVzICsgXCInIFwiICsgTG9uZ2l0dWRlU2Vjb25kcyArICdcIiAnICsgTG9uZ2l0dWRlQ2FyZGluYWw7XG4gICAgfVxuXG4gICAgX2dldExpc3RFbGVtZW50KG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuICQoJzxkaXYgaWQ9XCInICsgb3B0aW9ucy5pZCArICdcIiBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBlYXJ0aHF1YWtlLWxpc3QtaXRlbVwiPiAnICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZWFydGhxdWFrZS1saXN0LWl0ZW0tY29udGVudCB3aWR0aC1oZWlnaHQtMTAwXCI+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImVhcnRocXVha2UtbGlzdC1pdGVtLWhlYWRlciB3aWR0aC1oZWlnaHQtMTAwXCI+PGI+JyArIG9wdGlvbnMudGl0bGUgKyAnPC9iPjwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJlYXJ0aHF1YWtlLWxpc3QtaXRlbS1ib2R5IHdpZHRoLWhlaWdodC0xMDBcIj4nICtcbiAgICAgICAgICAgIChFUS5kZWJ1ZyA/ICdJRDogJyArIG9wdGlvbnMuaWQgKyAnPGJyPicgOiAnJykgK1xuICAgICAgICAgICAgJ1Bvc2l0aW9uICcgKyB0aGlzLmNvbnZlcnRDb29yZGluYXRlcyhvcHRpb25zLnBvc2l0aW9uLmxhdCgpLCBvcHRpb25zLnBvc2l0aW9uLmxuZygpKSArICc8YnI+JyArXG4gICAgICAgICAgICAoJC5pc051bWVyaWMob3B0aW9ucy5tYWduaXR1ZGUpID8gJ01hZ25pdHVkZSAnICsgb3B0aW9ucy5tYWduaXR1ZGUudG9GaXhlZCgyKSArICc8YnI+JyA6ICcnKSArXG4gICAgICAgICAgICAob3B0aW9ucy50c3VuYW1pID8gJ1RzdW5hbWknICsgJzxicj4nIDogJycpICtcbiAgICAgICAgICAgICdEZXB0aCAnICsgb3B0aW9ucy5kZXB0aC50b0ZpeGVkKDIpICsgJyBrbTxicj4nICtcbiAgICAgICAgICAgICdEYXRlICcgKyBvcHRpb25zLmRhdGUgKyAnPGJyPicgK1xuICAgICAgICAgICAgJzxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICsgb3B0aW9ucy51cmwgKyAnXCI+RGV0YWlsczwvYT4nICtcbiAgICAgICAgICAgICc8L2Rpdj48L2Rpdj48L2Rpdj4nXG4gICAgICAgICk7XG4gICAgfVxuXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhdE1hcExheWVyIHtcbiAgICBjb25zdHJ1Y3RvcihtYXApIHtcbiAgICAgICAgdGhpcy5fbWFwID0gbWFwO1xuICAgICAgICB0aGlzLl9sYXllciA9IG5ldyBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllcih7XG4gICAgICAgICAgICBkaXNzaXBhdGluZzogZmFsc2UsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjYsXG4gICAgICAgICAgICBtYXA6IG51bGwsXG4gICAgICAgICAgICBncmFkaWVudDogWydyZ2JhKDAsIDI1NSwgMjU1LCAwKSddLmNvbmNhdChjb2xvcmJyZXdlci5ZbE9yUmRbNl0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2luaXRpYWxpemUoKTtcbiAgICB9XG5cbiAgICBfaW5pdGlhbGl6ZSgpIHt9XG5cbiAgICBhZGREYXRhKGRhdGEpIHtcbiAgICAgICAgbGV0IGhlYXRtYXBEYXRhID0gW107XG4gICAgICAgIGRhdGEuZm9yRWFjaCgoZWFydGhxdWFrZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gZWFydGhxdWFrZS5nZXRHZW9tZXRyeSgpLmdldCgpLFxuICAgICAgICAgICAgICAgIG1hZ25pdHVkZSA9IGVhcnRocXVha2UuZ2V0UHJvcGVydHkoJ21hZycpO1xuICAgICAgICAgICAgaGVhdG1hcERhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgbG9jYXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgICAgIHdlaWdodDogTWF0aC5wb3coMiwgbWFnbml0dWRlKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBkYXRhQXJyYXkgPSBuZXcgZ29vZ2xlLm1hcHMuTVZDQXJyYXkoaGVhdG1hcERhdGEpO1xuICAgICAgICB0aGlzLl9sYXllci5zZXQoJ2RhdGEnLCBkYXRhQXJyYXkpO1xuICAgIH1cblxuICAgIHNldFNlbGVjdGVkKGVhcnRocXVha2UpIHt9XG4gICAgXG4gICAgZW1wdHkoKSB7XG4gICAgICAgIGxldCBkYXRhQXJyYXkgPSBuZXcgZ29vZ2xlLm1hcHMuTVZDQXJyYXkoW10pO1xuICAgICAgICB0aGlzLl9sYXllci5zZXQoJ2RhdGEnLCBkYXRhQXJyYXkpO1xuICAgIH1cblxuICAgIGVuYWJsZSgpIHtcbiAgICAgICAgdGhpcy5fbGF5ZXIuc2V0TWFwKHRoaXMuX21hcCk7XG4gICAgfVxuICAgIGRpc2FibGUoKSB7XG4gICAgICAgIHRoaXMuX2xheWVyLnNldE1hcChudWxsKTtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFya2Vyc0xheWVyIHtcbiAgICBjb25zdHJ1Y3RvcihtYXApIHtcbiAgICAgICAgdGhpcy5fbWFwID0gbWFwO1xuICAgICAgICB0aGlzLl9sYXllciA9IG5ldyBnb29nbGUubWFwcy5EYXRhKHtcbiAgICAgICAgICAgIG1hcDogbnVsbFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSgpO1xuICAgIH1cblxuICAgIF9pbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLl9sYXllci5zZXRTdHlsZSgoZWFydGhxdWFrZSkgPT4gdGhpcy5fZ2V0TWFya2Vyc1N0eWxlKGVhcnRocXVha2UpKTtcbiAgICAgICAgdGhpcy5fbGF5ZXIuYWRkTGlzdGVuZXIoJ2NsaWNrJywgKGVhcnRocXVha2UpID0+IHtcbiAgICAgICAgICAgIEVRLm1hcC5zZWxlY3RFYXJ0aHF1YWtlKGVhcnRocXVha2UuZmVhdHVyZSk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYWRkRGF0YShkYXRhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sYXllci5hZGRHZW9Kc29uKGRhdGEpO1xuICAgIH1cblxuICAgIHNldFNlbGVjdGVkKGVhcnRocXVha2VJZCkge1xuICAgICAgICBsZXQgZWFydGhxdWFrZSA9IHRoaXMuX2xheWVyLmdldEZlYXR1cmVCeUlkKGVhcnRocXVha2VJZCk7XG5cbiAgICAgICAgdGhpcy5fbGF5ZXIucmV2ZXJ0U3R5bGUoKTtcbiAgICAgICAgdGhpcy5fbGF5ZXIub3ZlcnJpZGVTdHlsZShlYXJ0aHF1YWtlLCB7XG4gICAgICAgICAgICBpY29uOiAnL2Fzc2V0cy9zZWxlY3RlZC1mZWF0dXJlLnBuZycsXG4gICAgICAgICAgICB6SW5kZXg6IDUwMFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBlbXB0eSgpIHtcbiAgICAgICAgbGV0IGRhdGFMYXllciA9IHRoaXMuX2xheWVyO1xuICAgICAgICBkYXRhTGF5ZXIuZm9yRWFjaCgoZmVhdHVyZSkgPT4ge1xuICAgICAgICAgICAgZGF0YUxheWVyLnJlbW92ZShmZWF0dXJlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZW5hYmxlKCkge1xuICAgICAgICB0aGlzLl9sYXllci5zZXRNYXAodGhpcy5fbWFwKTtcbiAgICB9XG4gICAgZGlzYWJsZSgpIHtcbiAgICAgICAgdGhpcy5fbGF5ZXIuc2V0TWFwKG51bGwpO1xuICAgIH1cblxuICAgIF9nZXRNYXJrZXJzU3R5bGUoZmVhdHVyZSkge1xuICAgICAgICBsZXQgbWFnbml0dWRlID0gZmVhdHVyZS5nZXRQcm9wZXJ0eSgnbWFnJyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB6SW5kZXg6IE1hdGguZmxvb3IobWFnbml0dWRlICogMTApXG4gICAgICAgIH07XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlY3RvbmljTGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICB0aGlzLl9wb2x5Z29ucyA9IFtdO1xuICAgICAgICB0aGlzLl9sYXllciA9IG5ldyBnb29nbGUubWFwcy5EYXRhKHtcbiAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9jdXJyZW50TGFiZWwgPSBudWxsO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplKCk7XG4gICAgfVxuXG4gICAgX2luaXRpYWxpemUoKSB7XG4gICAgICAgICQuZ2V0SlNPTihcIi9hc3NldHMvdGVjdG9uaWNzLXBsYXRlLmpzb25cIilcbiAgICAgICAgICAgIC50aGVuKCh0ZWN0b25pY3MpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdGVjdG9uaWNzRGF0YSA9IHRoaXMuX2xheWVyLmFkZEdlb0pzb24odGVjdG9uaWNzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jcmV0ZVBvbHlnb25zKHRlY3Rvbmljc0RhdGEpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fbGF5ZXIuc2V0U3R5bGUodGhpcy5fZ2V0VGVjdG9uaWNzU3R5bGUpO1xuXG4gICAgICAgIHRoaXMuX2xheWVyLmFkZExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRMYWJlbCA9IGV2ZW50LmZlYXR1cmUuZ2V0UHJvcGVydHkoJ25hbWUnKTtcbiAgICAgICAgICAgICQoJyNwbGF0ZS10b29sdGlwJykuaHRtbCh0aGlzLl9jdXJyZW50TGFiZWwpO1xuICAgICAgICAgICAgdGhpcy5fbGF5ZXIucmV2ZXJ0U3R5bGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2xheWVyLm92ZXJyaWRlU3R5bGUoZXZlbnQuZmVhdHVyZSwge1xuICAgICAgICAgICAgICAgIHN0cm9rZVdlaWdodDogMi41LFxuICAgICAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLjE1XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fbGF5ZXIuYWRkTGlzdGVuZXIoJ21vdXNlb3V0JywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50TGFiZWwgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fbGF5ZXIucmV2ZXJ0U3R5bGUoKTtcbiAgICAgICAgICAgICQoJyNwbGF0ZS10b29sdGlwJykuaHRtbChcIlwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkubW91c2Vtb3ZlKChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRMYWJlbClcbiAgICAgICAgICAgICAgICAkKCcjcGxhdGUtdG9vbHRpcCcpLm9mZnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGV2ZW50LnBhZ2VYIC0gNzUsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogZXZlbnQucGFnZVkgKyAzMFxuICAgICAgICAgICAgICAgIH0pLnNob3coKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAkKCcjcGxhdGUtdG9vbHRpcCcpLmhpZGUoKTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfY3JldGVQb2x5Z29ucyh0ZWN0b25pY3NEYXRhKSB7XG4gICAgICAgICQuZWFjaCh0ZWN0b25pY3NEYXRhLCAoaSwgdGVjdG9uaWMpID0+IHtcbiAgICAgICAgICAgIGxldCB0R2VvbWV0cnkgPSB0ZWN0b25pYy5nZXRHZW9tZXRyeSgpLFxuICAgICAgICAgICAgICAgIHBvaW50cyA9IFtdO1xuXG4gICAgICAgICAgICB0R2VvbWV0cnkuZm9yRWFjaExhdExuZygocHQpID0+IHtcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChwdCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IHBsYXRlUG9seWdvbiA9IG5ldyBnb29nbGUubWFwcy5Qb2x5Z29uKHtcbiAgICAgICAgICAgICAgICBwYXRoczogcG9pbnRzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHBsYXRlUG9seWdvbi5zZXQoJ19fbmFtZScsIHRlY3RvbmljLmdldFByb3BlcnR5KCduYW1lJykpO1xuICAgICAgICAgICAgLy9wbGF0ZVBvbHlnb24ubmFtZSA9IHRlY3RvbmljLmdldFByb3BlcnR5KCcnKVxuICAgICAgICAgICAgdGhpcy5fcG9seWdvbnMucHVzaChwbGF0ZVBvbHlnb24pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfcmVmcmVzaCgpIHtcbiAgICAgICAgdmFyIG1hcCA9IHRoaXMuX2xheWVyLmdldE1hcCgpO1xuICAgICAgICB0aGlzLl9sYXllci5zZXRNYXAobnVsbCk7XG4gICAgICAgIHRoaXMuX2xheWVyLnNldE1hcChtYXApO1xuICAgIH1cblxuICAgIF9nZXRUZWN0b25pY3NTdHlsZShmZWF0dXJlKSB7XG4gICAgICAgIHZhciBjb2xvciA9IGZlYXR1cmUuZ2V0UHJvcGVydHkoJ2NvbG9yJyksXG4gICAgICAgICAgICBuYW1lID0gZmVhdHVyZS5nZXRQcm9wZXJ0eSgnbmFtZScpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmaWxsQ29sb3I6IGNvbG9yLFxuICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDAuMSxcbiAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBjb2xvcixcbiAgICAgICAgICAgIHN0cm9rZVdlaWdodDogMVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldFBsYXRlQnlQb2ludChlYXJ0aHF1YWtlUG9zaXRpb24pIHtcbiAgICAgICAgbGV0IHBsYXRlRGF0YSA9IHtcbiAgICAgICAgICAgIGluc2lkZTogW10sXG4gICAgICAgICAgICBuZWFyOiBbXSxcbiAgICAgICAgICAgIGFsbDogW10sXG4gICAgICAgIH07XG5cbiAgICAgICAgJC5lYWNoKHRoaXMuX3BvbHlnb25zLCAoaSwgcGxhdGUpID0+IHtcbiAgICAgICAgICAgIGlmIChnb29nbGUubWFwcy5nZW9tZXRyeS5wb2x5LmNvbnRhaW5zTG9jYXRpb24oZWFydGhxdWFrZVBvc2l0aW9uLCBwbGF0ZSkpIHtcbiAgICAgICAgICAgICAgICBwbGF0ZURhdGEuaW5zaWRlLnB1c2gocGxhdGUuZ2V0KCdfX25hbWUnKSk7XG4gICAgICAgICAgICAgICAgcGxhdGVEYXRhLmFsbC5wdXNoKHBsYXRlLmdldCgnX19uYW1lJykpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChnb29nbGUubWFwcy5nZW9tZXRyeS5wb2x5LmlzTG9jYXRpb25PbkVkZ2UoZWFydGhxdWFrZVBvc2l0aW9uLCBwbGF0ZSwgMTBlLTEpKSB7XG4gICAgICAgICAgICAgICAgcGxhdGVEYXRhLm5lYXIucHVzaChwbGF0ZS5nZXQoJ19fbmFtZScpKTtcbiAgICAgICAgICAgICAgICBwbGF0ZURhdGEuYWxsLnB1c2gocGxhdGUuZ2V0KCdfX25hbWUnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBsYXRlRGF0YS5hbGwuc29ydCgpO1xuICAgICAgICByZXR1cm4gcGxhdGVEYXRhO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dnZXIge1xuICAgIGNvbnN0cnVjdG9yKGxvZ0xldmVsKSB7XG4gICAgICAgIHRoaXMuX2xvZ0xldmVsID0gbG9nTGV2ZWw7XG4gICAgICAgIHRoaXMuTG9nTGV2ZWwgPSBMb2dnZXIuTG9nTGV2ZWw7XG5cbiAgICAgICAgdGhpcy5fc3R5bGVzID0ge1xuICAgICAgICAgICAgZXJyb3I6ICdjb2xvcjogeWVsbG93OyBiYWNrZ3JvdW5kOiAjRkY0MDQwJyxcbiAgICAgICAgICAgIHdhcm46ICdjb2xvcjogI0ZGNDA0MDsgYmFja2dyb3VuZDogI2VlZDQ4MicsXG4gICAgICAgICAgICBpbmZvOiAnY29sb3I6IGJsdWUnLFxuICAgICAgICAgICAgZGVidWc6ICdjb2xvcjogZ3JlZW4nXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fam9pblN5bWJvbCA9ICcgJztcblxuICAgICAgICAkLmVhY2godGhpcy5Mb2dMZXZlbCwgKGxvZ0xldmVsKSA9PiB7XG4gICAgICAgICAgICB0aGlzW2xvZ0xldmVsXSA9ICgoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZyhsb2dMZXZlbCwgLi4uYXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBMb2dMZXZlbCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVycm9yOiAxLFxuICAgICAgICAgICAgd2FybjogMixcbiAgICAgICAgICAgIGluZm86IDMsXG4gICAgICAgICAgICBkZWJ1ZzogNFxuICAgICAgICB9O1xuICAgIH0gIFxuXG4gICAgc2V0TG9nTGV2ZWwobG9nTGV2ZWwpIHtcbiAgICAgICAgaWYgKCQuaXNOdW1lcmljKGxvZ0xldmVsKSAmJiBsb2dMZXZlbCA+IC0xKVxuICAgICAgICAgICAgdGhpcy5fbG9nTGV2ZWwgPSBsb2dMZXZlbDtcbiAgICB9XG5cbiAgICBfbG9nKGxvZ1R5cGUsIC4uLm1zZ0xpc3QpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pc0xvZ2dhYmxlKGxvZ1R5cGUpKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGxldCBzdHlsZSA9IHRoaXMuX3N0eWxlc1tsb2dUeXBlXSxcbiAgICAgICAgICAgIGZpbmFsTXNnID0gXCIlY1wiICsgbXNnTGlzdC5qb2luKHRoaXMuX2pvaW5TeW1ib2wpO1xuXG4gICAgICAgIGNvbnNvbGVbbG9nVHlwZV0uYXBwbHkoY29uc29sZSwgW2ZpbmFsTXNnLCBzdHlsZV0pO1xuICAgIH1cblxuICAgIF9pc0xvZ2dhYmxlKGxvZ0xldmVsSWQpIHtcbiAgICAgICAgbGV0IGxvZ0xldmVsID0gdGhpcy5Mb2dMZXZlbFtsb2dMZXZlbElkXTtcbiAgICAgICAgcmV0dXJuIGxvZ0xldmVsIDw9IHRoaXMuX2xvZ0xldmVsO1xuICAgIH1cbn0iXX0=
