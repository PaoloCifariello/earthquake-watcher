class TectonicLayer {
    constructor(map) {
        this._polygons = [];
        this._layer = new google.maps.Data({
            //url: 'http://dl.dropboxusercontent.com/s/pjlm3uqdczmc5c5/tectonics.kml?dl=0'
            map: map
        });
        this._currentLabel = null;
        this._initialize();
    }

    _initialize() {
        $.getJSON("assets/tectonics-plate.json")
            .then((tectonics) => {
                let tectonicsData = this._layer.addGeoJson(tectonics);
                this._cretePolygons(tectonicsData);
            });

        this._layer.setStyle(this._getTectonicsStyle);

        this._layer.addListener('mouseover', (event) => {
            this._currentLabel = event.feature.getProperty('name');
            $('#plate-tooltip').html(this._currentLabel);
            this._layer.revertStyle();
            this._layer.overrideStyle(event.feature, {
                strokeWeight: 3,
                fillOpacity: 0.2
            });
        });

        this._layer.addListener('mouseout', (event) => {
            this._currentLabel = null;
            this._layer.revertStyle();
            $('#plate-tooltip').html("");
        });

        $(document).mousemove((event) => {
            if (this._currentLabel)
                $('#plate-tooltip').offset({
                    left: event.pageX - 75,
                    top: event.pageY + 30
                }).show();
            else
                $('#plate-tooltip').hide();

        });
    }

    _cretePolygons(tectonicsData) {
        $.each(tectonicsData, (i, tectonic) => {
            let tGeometry = tectonic.getGeometry(),
                points = [];

            tGeometry.forEachLatLng((pt) => {
                points.push(pt);
            });

            let platePolygon = new google.maps.Polygon({
                paths: points
            });
            platePolygon.set('__name', tectonic.getProperty('name'));
            //platePolygon.name = tectonic.getProperty('')
            this._polygons.push(platePolygon);
        });
    }

    _refresh() {
        var map = this._layer.getMap();
        this._layer.setMap(null);
        this._layer.setMap(map);
    }

    _getTectonicsStyle(feature) {
        var color = feature.getProperty('color'),
            name = feature.getProperty('name');

        return {
            fillColor: color,
            fillOpacity: 0.1,
            strokeColor: color,
            strokeWeight: 1
        };
    }

    getPlateByPoint(earthquakePosition) {
        let plateData = {
            inside: [],
            near: [],
            all: [],
        };

        $.each(this._polygons, (i, plate) => {
            if (google.maps.geometry.poly.containsLocation(earthquakePosition, plate)) {
                plateData.inside.push(plate.get('__name'));
                plateData.all.push(plate.get('__name'));
            } else if (google.maps.geometry.poly.isLocationOnEdge(earthquakePosition, plate, 10e-1)) {
                plateData.near.push(plate.get('__name'));
                plateData.all.push(plate.get('__name'));
            }
        });

        plateData.all.sort();
        return plateData;
    }
}