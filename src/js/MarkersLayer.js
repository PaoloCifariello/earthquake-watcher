class MarkersLayer {
    constructor(map) {
        this._map = map;
        this._layer = new google.maps.Data({
            //url: 'http://dl.dropboxusercontent.com/s/pjlm3uqdczmc5c5/tectonics.kml?dl=0'
            map: null
        });
        this._initialize();
    }

    _initialize() {
        this._layer.setStyle(this._getMarkersStyle());
    }

    _getMarkersStyle() {
        return (feature) => {
            if (map._selectedFeature && feature == map._selectedFeature) return {
                icon: '/src/assets/selected-feature.png'
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