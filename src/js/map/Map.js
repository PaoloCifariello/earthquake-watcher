class Map {
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

        this.tectonicsLayer = new TectonicLayer(this._map);

        this._layers.markersLayer = new MarkersLayer(this._map);
        this._layers.circleLayer = new CircleLayer(this._map);
        this._layers.heatMapLayer = new HeatMapLayer(this._map);

        this.setVisualizationType('markersLayer');

        /* refresh list when bounds change, also set handler for green marker */
        this._map.addListener('bounds_changed', () => this._refreshEarthquakesList());
    }

    setData(data) {
        $.each(this._layers, (i, layer) => {
            layer.empty();
        });

        /* need to take normalized data from Google Maps API to avoid 
        /* further steps during HeatMapCreation */
        let normalizedData = this._layers.markersLayer.addData(data);
        this._layers.circleLayer.addData(data);
        this._layers.heatMapLayer.addData(normalizedData);

        this._data = {};
        $.each(data.features, (i, earthquake) => {
            this._data[earthquake.id] = earthquake;
        })

        google.maps.event.trigger(this._map, 'bounds_changed');
    }

    setVisualizationType(visualizationType) {
        this._visualizationType = visualizationType;

        $.each(this._layers, (layerName, layer) => {
            if (layerName === visualizationType)
                layer.enable();
            else
                layer.disable();
        });
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
        this.fetcher
            .fetchData()
            .then((data) => {
                /* GeoJSON object, type: FeatureCollection */
                this.setData(data);
            });
    }

    /* called to refresh the list of eq.kes */
    _refreshEarthquakesList() {
        let visibleEarthquakes = this.getVisibleEarthquakes();
        visibleEarthquakes.sort((a, b) => {
            return parseFloat(b.getProperty('mag')) - parseFloat(a.getProperty('mag'));
        });

        $('#earthquake-list').empty();

        $.each(visibleEarthquakes, (i, earthquake) => {
            let id = earthquake.getId();
            let listElement = this._getListElement({
                title: earthquake.getProperty('title'),
                id: id,
                magnitude: earthquake.getProperty('mag'),
                depth: this._data[id].geometry.coordinates[2], // depth in km
                date: moment.unix(earthquake.getProperty('time') / 1000).format('DD-MM-DD hh:mm')
            });

            listElement.click(() => {
                this._selectedFeature = earthquake;

                $.each(this._layers, (layerName, layer) => layer.setSelected(this._selectedFeature.getId()));
            });

            $('#earthquake-list').append(listElement);
        });
    }

    _getListElement(options) {
        return $('<a href="#" class="list-group-item"> ' +
            '<b>' + options.title + '</b><br>' +
            (EQ.debug ? options.id + '<br>' : '') +
            'Magnitude ' + options.magnitude + '<br>' +
            'Depth ' + options.depth + '<br>' +
            'Date ' + options.date
        );
    }

}