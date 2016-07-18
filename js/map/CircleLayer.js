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
        this._layer.setStyle((earthquake) => this._getCircleStyle(earthquake));
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
            }
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

    _interpolateHsl(min, max, val) {
        let color = [];
        for (var i = 0; i < 3; i++) {
            // Calculate color based on the fraction.
            color[i] = parseInt((max[i] - min[i]) * val + min[i]);
        }

        return 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
    }

    /* set circle style map visualization */
    _getCircleStyle(feature) {
        let minHSL = [0, 0, 255],
            minMag = -1.0,
            maxHSL = [255, 0, 0],
            maxMag = 6.0,

            magnitude = feature.getProperty('mag');

        // fraction represents where the value sits between the min and max
        let fraction = (Math.min(magnitude, maxMag) - minMag) / (maxMag - minMag),
            color = this._interpolateHsl(minHSL, maxHSL, fraction);

        return {
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                strokeWeight: 0.5,
                strokeColor: 'black',
                fillColor: color,
                fillOpacity: 0.6,
                // while an exponent would technically be correct, quadratic looks nicer
                scale: Math.log(magnitude) * magnitude * 4
                    //                scale: Math.pow(2, magnitude)
            },
            zIndex: Math.floor(magnitude * 10)
        };
    }
}