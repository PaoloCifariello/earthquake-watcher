class MarkersLayer {
    constructor(map) {
        this._map = map;
        this._layer = new google.maps.Data({
            map: null
        });
        this._initialize();
    }

    _initialize() {
        this._layer.setStyle((earthquake) => this._getMarkersStyle(earthquake));
        this._layer.addListener('click', (earthquake) => {
            EQ.map.selectEarthquake(earthquake.feature);
        })
    }

    addData(data) {
        return this._layer.addGeoJson(data);
    }

    setSelected(earthquakeId) {
        let earthquake = this._layer.getFeatureById(earthquakeId);

        this._layer.revertStyle();
        this._layer.overrideStyle(earthquake, {
            icon: '/src/assets/selected-feature.png',
            zIndex: 500
        });
    }

    setLegend(element) {}

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

    _getMarkersStyle(feature) {
        let magnitude = feature.getProperty('mag');
        return {
            zIndex: Math.floor(magnitude * 10)
        };
    }
}