class CircleLayer {
    constructor(map) {
        this._map = map;
        this._layer = new google.maps.Data({
            //url: 'http://dl.dropboxusercontent.com/s/pjlm3uqdczmc5c5/tectonics.kml?dl=0'
            map: map
        });
        this._initialize();
    }

    _initialize() {
        this._layer.setStyle(this._getCircleStyle());
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

    addData(data) {
        return this._layer.addGeoJson(data);
    }

    empty() {
        let dataLayer = this._layer;
        dataLayer.forEach((feature) => {
            dataLayer.remove(feature);
        });
    }

    enable() {
        this._layer.setMap(this._map);
    }

    disable() {
        this._layer.setMap(null);
    }
}