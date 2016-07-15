class TectonicLayer {
    constructor(map) {
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
                this._layer.addGeoJson(tectonics);
            });

        this._layer.setStyle(this._getTectonicsStyle());

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

    _refresh() {
        var map = this._layer.getMap();
        this._layer.setMap(null);
        this._layer.setMap(map);
    }

    _getTectonicsStyle() {
        return (feature) => {
            var color = feature.getProperty('color'),
                name = feature.getProperty('name');

            return {
                fillColor: color,
                fillOpacity: 0.1,
                strokeColor: color,
                strokeWeight: 1
            };
        }
    }
}