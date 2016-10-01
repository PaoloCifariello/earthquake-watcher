import TectonicLayer from './TectonicLayer';
import MarkersLayer from './MarkersLayer';
import CircleLayer from './CircleLayer';
import HeatMapLayer from './HeatMapLayer';

import Fetcher from '../data/Fetcher';

export default class EarthquakeMap {
    constructor(zoom, center) {
        this._map = null;

        this._tectonicsLayer = null

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
        this.fetcher = new Fetcher();
    }

    initializeMap() {
        this._map = new google.maps.Map(document.getElementById('map'), {
            zoom: this._zoom,
            center: this._center,
            zoomControl: true,
            scaleControl: true,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        });

        this._tectonicsLayer = new TectonicLayer(this._map);

        this._layers.markersLayer = new MarkersLayer(this._map);
        this._layers.circleLayer = new CircleLayer(this._map);
        this._layers.heatMapLayer = new HeatMapLayer(this._map);

        this.setVisualizationType('markersLayer');

        /* refresh list when stop making changes */
        this._map.addListener('idle', () => this._refreshEarthquakesList());


        EQ.logger.debug('Adding legend to Map');
        let legend = $('#map-legend');
        this._map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend[0]);
        legend.show();
    }

    setData(data) {
        EQ.logger.info('Setting new data');
        EQ.logger.debug('Emptying data layers');
        $.each(this._layers, (i, layer) => {
            layer.empty();
        });

        /* need to take normalized data from Google Maps API to avoid 
        /* further steps during HeatMapCreation */
        EQ.logger.debug('Adding data to layers');
        let normalizedData = this._layers.markersLayer.addData(data);
        this._layers.circleLayer.addData(data);
        this._layers.heatMapLayer.addData(normalizedData);

        EQ.logger.debug('Storing new data');
        this._data = {};
        $.each(data.features, (i, earthquake) => {
            this._data[earthquake.id] = earthquake;
        })

        google.maps.event.trigger(this._map, 'idle');
    }

    setVisualizationType(visualizationType) {
        EQ.logger.debug('New visualization type', visualizationType);
        this._visualizationType = visualizationType;

        $.each(this._layers, (layerName, layer) => {
            if (layerName === visualizationType)
                layer.enable();
            else
                layer.disable();
        });

        /* set new legend */
        EQ.logger.debug('Setting new legend for', visualizationType);
        this._setLegend(visualizationType);
    }

    getVisibleEarthquakes() {
        let visibleEarthquakes = [];
        this._layers.markersLayer._layer.forEach((earthquake) => {
            let position = earthquake.getGeometry().get(),
                bounds = this._map.getBounds();
            if (bounds && bounds.contains(position)) visibleEarthquakes.push(earthquake);
        });

        return visibleEarthquakes;
    }

    refreshData() {
        EQ.logger.info('Refreshing data');
        this.fetcher
            .fetchData()
            .then((data) => {
                /* GeoJSON object, type: FeatureCollection */
                this.setData(data);
            });
    }

    _setLegend(visualizationType) {
        $('#map-legend .map-legend').hide();
        $('#' + visualizationType + '-map-legend').show();
    }

    /* called to refresh the list of eq.kes */
    _refreshEarthquakesList() {
        this._visibleEarthquakes = this.getVisibleEarthquakes();
        EQ.logger.debug('Found', this._visibleEarthquakes.length, 'visible earthquakes');

        this._visibleEarthquakes.sort((a, b) => {
            var aVal = parseFloat(a.getProperty('mag'));
            var bVal = parseFloat(b.getProperty('mag'));

            if (isNaN(bVal))
                bVal = -1;
            if (isNaN(aVal))
                aVal = -1;

            return bVal - aVal;
        });

        $('#earthquake-list').empty();

        $.each(this._visibleEarthquakes, (i, earthquake) => {
            let id = earthquake.getId();
            let listElement = this._getListElement({
                id: id,
                title: earthquake.getProperty('title'),
                position: earthquake.getGeometry().get(),
                index: i + 1,
                total: this._visibleEarthquakes.length,
                magnitude: earthquake.getProperty('mag'),
                tsunami: (earthquake.getProperty('tsunami') === 1) ? true : false,
                depth: this._data[id].geometry.coordinates[2], // depth in km
                date: moment(earthquake.getProperty('time')).format('D/M/YYYY HH:mm'),
                url: earthquake.getProperty('url'),
            });

            listElement.click(() => this.selectEarthquake(earthquake));
            $('#earthquake-list').append(listElement);
        });

        $('#earthquake-number-badge').html(this._visibleEarthquakes.length);
    }

    selectEarthquake(earthquake) {
        let id = earthquake.getId();

        if (this._selectedFeature) {
            let oldId = this._selectedFeature.getId();
            $('#' + oldId).removeClass("earthquake-list-item-selected");
        }

        let item = $('#' + id);
        item.addClass("earthquake-list-item-selected");

        this._selectedFeature = earthquake;

        $.each(this._layers, (layerName, layer) => layer.setSelected(this._selectedFeature.getId()));

        let container = $('#list-panel'),
            scrollTo = item;

        container.scrollTop(0);
        container.scrollTop(
            scrollTo.offset().top - container.offset().top
        );

        EQ.logger.debug('Selected earthquake', id);
    }

    convertCoordinates(latitude, longitude) {
        /** Latitude */
        let convertedLatitude = Math.abs(latitude),
            latitudeCardinal = ((latitude > 0) ? "N" : "S"),
            latitudeDegree = Math.floor(convertedLatitude);

        convertedLatitude = (convertedLatitude - latitudeDegree) * 60;
        let latitudePrimes = Math.floor(convertedLatitude);

        convertedLatitude = (convertedLatitude - latitudePrimes) * 60;
        let latitudeSeconds = Math.floor(convertedLatitude);

        /** Longitude */
        let convertedLongitude = Math.abs(longitude),
            LongitudeCardinal = ((longitude > 0) ? "E" : "W"),
            LongitudeDegree = Math.floor(convertedLongitude);

        convertedLongitude = (convertedLongitude - LongitudeDegree) * 60;
        let LongitudePrimes = Math.floor(convertedLongitude);

        convertedLongitude = (convertedLongitude - LongitudePrimes) * 60;
        let LongitudeSeconds = Math.floor(convertedLongitude);

        return latitudeDegree + '° ' + latitudePrimes + "' " + latitudeSeconds + '" ' + latitudeCardinal + ', ' +
            LongitudeDegree + '° ' + LongitudePrimes + "' " + LongitudeSeconds + '" ' + LongitudeCardinal;
    }

    _getListElement(options) {
        return $('<div id="' + options.id + '" class="list-group-item earthquake-list-item"> ' +
            '<div class="earthquake-list-item-content width-height-100">' +
            '<div class="earthquake-list-item-header width-height-100"><b>' + options.title + '</b></div>' +
            '<div class="earthquake-list-item-body width-height-100">' +
            (EQ.debug ? 'ID: ' + options.id + '<br>' : '') +
            'Position ' + this.convertCoordinates(options.position.lat(), options.position.lng()) + '<br>' +
            ($.isNumeric(options.magnitude) ? 'Magnitude ' + options.magnitude.toFixed(2) + '<br>' : '') +
            (options.tsunami ? 'Tsunami' + '<br>' : '') +
            'Depth ' + options.depth.toFixed(2) + ' km<br>' +
            'Date ' + options.date + '<br>' +
            '<a target="_blank" href="' + options.url + '">Details</a>' +
            '</div></div></div>'
        );
    }

}