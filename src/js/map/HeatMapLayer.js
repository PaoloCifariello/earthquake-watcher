export default class HeatMapLayer {
    constructor(map) {
        this._map = map;
        this._layer = new google.maps.visualization.HeatmapLayer({
            dissipating: false,
            opacity: 0.6,
            map: null,
            gradient: ['rgba(0, 255, 255, 0)'].concat(colorbrewer.YlOrRd[6])
        });

        this._initialize();
    }

    _initialize() {}

    addData(data) {
        let heatmapData = [];
        data.forEach((earthquake) => {
            let position = earthquake.getGeometry().get(),
                magnitude = earthquake.getProperty('mag');
            heatmapData.push({
                location: position,
                weight: Math.pow(2, magnitude)
            });
        });

        let dataArray = new google.maps.MVCArray(heatmapData);
        this._layer.set('data', dataArray);
    }

    setSelected(earthquake) {}
    
    empty() {
        let dataArray = new google.maps.MVCArray([]);
        this._layer.set('data', dataArray);
    }

    enable() {
        this._layer.setMap(this._map);
    }
    disable() {
        this._layer.setMap(null);
    }
}