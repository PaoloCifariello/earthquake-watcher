class Map {
    constructor(zoom, center) {
        this._map = null;
        this._zoom = zoom;
        this._visualizationType = "markers";
        /* initial center point */
        this._center = center;
        /* markers on the map */
        this._markers = [];
        /* earthquake list */
        this._data = [];
    }
    
    initializeMap() {
        this._map = new google.maps.Map(document.getElementById('map'), {
            zoom: this._zoom,
            center: this._center,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        });
    }

    setData(data) {
        this._data = data.features;
        this._map.data.addGeoJson(data);
        this._initializeHeatMap();
        
//        $.each(data.features, (i, earthquake) => {
//            let coordinates = earthquake.geometry.coordinates,
//                latLng = new google.maps.LatLng(coordinates[1],coordinates[0]),
//                marker = this._createMarker(latLng);
//            this._markers.push(marker);
//        });
    }
    
    on(eventName, fn) {
        this._map.addListener(eventName, fn);
    }
    
    setVisualizationType(visualizationType) {
        this._visualizationType = visualizationType;
        
        switch (this._visualizationType) {
            case "markers":
                this._heatmap.setMap(null);
                this._map.data.setStyle(null);
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
        $.each(this._data, (i, earthquake) => {
            let coords = earthquake.geometry.coordinates,
                position = new google.maps.LatLng(coords[1], coords[0]);
            
            if (this._map.getBounds().contains(position))
                visibleEarthquakes.push(earthquake);
        });
        
        return visibleEarthquakes;
    }
    
    _initializeHeatMap() {
        let heatmapData = [];
        
        $.each(this._data, (i, earthquake) => {
            let coords = earthquake.geometry.coordinates,
                latLng = new google.maps.LatLng(coords[1], coords[0]),
                magnitude = earthquake.properties.mag;
            
            heatmapData.push({
                location: latLng,
                weight: Math.pow(2, magnitude)
            });
        });
        
        this._heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            dissipating: false,
            map: null
        });
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
    
    _createMarker(position) {
        let marker = new google.maps.Marker({
            position: position,
            map: null
        });
            
        marker.addListener('click', function() {
            debugger;
            //infowindow.open(marker.get('map'), marker);
        });
        
        return marker;
    }
}