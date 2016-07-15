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

    addData(data) {
        return this._layer.addGeoJson(data);
    }


    setSelected(earthquakeId) {
        let earthquake = this._layer.getFeatureById(earthquakeId),
            magnitude = earthquake.getProperty('mag');

        this._layer.revertStyle();
        this._layer.overrideStyle(earthquake, {
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: 'green',
                fillOpacity: .9,
                scale: Math.pow(2, magnitude),
                strokeColor: 'black',
                strokeWeight: 2
            },
            scale: magnitude
        });
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

    /* set circle style map visualization */
    _getCircleStyle() {
        return (feature) => {
            var magnitude = feature.getProperty('mag');
            return {
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: 'red',
                    fillOpacity: .6,
                    scale: Math.pow(2, magnitude),
                    strokeColor: 'black',
                    strokeWeight: .5
                },
                scale: magnitude
            };
        };
    }
}