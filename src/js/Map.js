class Map {
    constructor(zoom, center) {
        this._map = null;

        /* map layers */
        this._tectonicsLayer = null;
        this._markersLayer = null;
        this._circleLayer = null;
        this._heatMapLayer = null;

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

        this._tectonicsLayer = new TectonicLayer(this._map);
        this._markersLayer = new MarkersLayer(this._map);
        this._circleLayer = new CircleLayer(this._map);
        this._heatMapLayer = new HeatMapLayer(this._map);
        this.setVisualizationType('markers');
    }

    setData(data) {
        this._markersLayer.empty();
        this._circleLayer.empty();
        this._heatMapLayer.empty();

        /* need to take normalized data from Google Maps API to avoid 
        /* further steps during HeatMapCreation */
        let normalizedData = this._markersLayer.addData(data);
        this._circleLayer.addData(data);
        this._heatMapLayer.addData(normalizedData);

        google.maps.event.trigger(this._map, 'bounds_changed');
    }

    setVisualizationType(visualizationType) {
        this._visualizationType = visualizationType;
        switch (this._visualizationType) {
        case "markers":
            this._heatMapLayer.disable();
            this._circleLayer.disable();
            this._markersLayer.enable();
            break;
        case "circle":
            this._heatMapLayer.disable();
            this._markersLayer.disable();
            this._circleLayer.enable();
            break;
        case "heatmap":
            this._markersLayer.disable();
            this._circleLayer.disable();
            this._heatMapLayer.enable();
            break;
        }
    }

    getVisibleEarthquakes() {
        let visibleEarthquakes = [];
        this._markersLayer._layer.forEach((earthquake) => {
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