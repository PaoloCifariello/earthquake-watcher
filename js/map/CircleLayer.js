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
        this._layer.addListener('click', (earthquake) => {
            EQ.map.selectEarthquake(earthquake.feature);
        });
        this._paletteScale = d3.scale.quantize()
            .domain([0, 10])
            .range(colorbrewer.YlOrRd[6]);
    }

    addData(data) {
        return this._layer.addGeoJson(data);
    }


    setSelected(earthquakeId) {
        let earthquake = this._layer.getFeatureById(earthquakeId),
            magnitude = earthquake.getProperty('mag'),
            color = this._paletteScale(magnitude);

        this._layer.revertStyle();
        this._layer.overrideStyle(earthquake, {
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                strokeWeight: 2,
                strokeColor: 'black',
                fillColor: color,
                fillOpacity: .9,
                scale: magnitude * 2
            },
            zIndex: 500
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
    _getCircleStyle(feature) {
        let magnitude = feature.getProperty('mag'),
            color = this._paletteScale(magnitude);

        return {
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                strokeWeight: 0.5,
                strokeColor: 'black',
                fillColor: color,
                fillOpacity: 0.6,
                scale: magnitude * 2
            },
            zIndex: Math.floor(magnitude * 10)
        };
    }
}