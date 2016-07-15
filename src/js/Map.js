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

        this._zoom = zoom;
        this._visualizationType = "markers";
        /* initial center point */
        this._center = center;

        this._selectedFeature = null;
        this.fetcher = new Fetcher(); //new Proxy()); //new Proxy());
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

    on(eventName, fn) {
        this._map.addListener(eventName, fn);
    }

    refreshData() {
        this.fetcher
            .fetchData()
            .then((data) => {
                /* GeoJSON object, type: FeatureCollection */
                this.setData(data);
            });
    }

}