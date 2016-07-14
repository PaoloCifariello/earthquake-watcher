class Map {
    constructor(zoom, center) {
        this._map = null;
        this._tectonicsLayer = null;
        this._zoom = zoom;
        this._visualizationType = "markers";
        /* initial center point */
        this._center = center;
        /* markers on the map */
        this._markers = [];
        /* earthquake list */
        this._data = [];
        this._selectedFeature = null;
        this._currentLabel = null;
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
    }

    setData(data) {
        let dataLayer = this._map.data;
        dataLayer.forEach((feature) => {
            dataLayer.remove(feature);
        });
        this._data = dataLayer.addGeoJson(data);
        this._initializeHeatMap();
        this.setVisualizationType('markers');
        google.maps.event.trigger(this._map, 'bounds_changed');
    }

    setVisualizationType(visualizationType) {
        this._visualizationType = visualizationType;
        switch (this._visualizationType) {
        case "markers":
            this._heatmap.setMap(null);
            this._map.data.setStyle(this._getMarkersStyle());
            this._map.data.setMap(this._map);
            break;
        case "circle":
            this._heatmap.setMap(null);
            this._map.data.setStyle(this._getCircleStyle());
            this._map.data.setMap(this._map);
            break;
        case "heatmap":
            this._map.data.setMap(null);
            this._heatmap.setMap(this._map);
            break;
        }
    }
    getVisibleEarthquakes() {
        let visibleEarthquakes = [];
        this._map.data.forEach((earthquake) => {
            let position = earthquake.getGeometry().get(),
                bounds = this._map.getBounds();
            if (bounds && bounds.contains(position)) visibleEarthquakes.push(earthquake);
        });
        return visibleEarthquakes;
    }

    on(eventName, fn) {
        this._map.addListener(eventName, fn);
    }

    _initializeHeatMap() {
        let heatmapData = [];
        this._map.data.forEach((earthquake) => {
            let position = earthquake.getGeometry().get(),
                magnitude = earthquake.getProperty('mag');
            heatmapData.push({
                location: position,
                weight: Math.pow(2, magnitude)
            });
        });

        this._heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            dissipating: false,
            map: null
        });
    }
    _getMarkersStyle() {
        return (feature) => {
            if (map._selectedFeature && feature == map._selectedFeature) return {
                icon: '/src/assets/selected-feature.png'
            };
        };
    }

    /* set circle style map visualization */
    _getCircleStyle() {
        return (feature) => {
            var magnitude = feature.getProperty('mag');
            return {
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: 'red',
                    fillOpacity: .2,
                    scale: Math.pow(2, magnitude) / 2,
                    strokeColor: 'white',
                    strokeWeight: .5
                },
                scale: magnitude
            };
        };
    }
}