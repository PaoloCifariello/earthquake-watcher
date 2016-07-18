class GraphManager {
    constructor() {}

    _updateScales() {
        this._xScale = d3.scale.linear()
            .domain([0, 20])
            .range([20, 780]);

        this._yScale = d3.scale.linear()
            .domain([0, 20])
            .range([600, 100]);
    }

    drawGraph(visibleEarthquakes) {
        let data = this._normalizeData(visibleEarthquakes);
        $('#chart-svg').empty();

        nv.addGraph(() => {
            var chart = nv.models.scatterChart()
                .useVoronoi(true)
                .color(d3.scale.category10().range())
                .duration(300);

            chart.noData("No data to display");
            chart.tooltip.contentGenerator(this._getTooltip);
            //chart.dispatch.on('renderEnd', function () {});

            /* X axis */
            chart.showXAxis(true);
            chart.xAxis.tickFormat(function (d) {
                return d3.time.format('%d-%m, %H:%M:%S')(new Date(d));
            });
            chart.xAxis.showMaxMin(false);

            /* Y axis */
            chart.forceY([-1, 10]);
            chart.yAxis.tickFormat(d3.format('.02f'));

            d3.select('#chart-svg')
                .datum(data)
                .call(chart);

            nv.utils.windowResize(chart.update);

            chart.dispatch.on('stateChange', function (e) {
                ('New State:', JSON.stringify(e));
            });

            this._chart = chart;
            setTimeout(this._chart.update, 500);
            return chart;
        });
    }

    _getTooltip(data) {
        console.log(data);
        let earthquake = data.point.earthquake,
            title = earthquake.getProperty('title'),
            date = moment(earthquake.getProperty('time')).format('D-M-YYYY HH:mm'),
            point = earthquake.getGeometry().get(),
            latitude = point.lat(),
            longitude = point.lng(),
            magnitude = earthquake.getProperty('mag'),
            plate = data.series[0].key;

        let tooltip = $('<div><b>' + title + '</b><br>' +
            plate + '</br>' +
            'Position: (' + latitude + ', ' + longitude + ')<br>' +
            'Magnitude: ' + magnitude + '<br>' +
            'Date: ' + date + '<br></div>');


        return tooltip.html();
    }

    _normalizeData(visibleEarthquakes) {
        var platesData = {},
            random = d3.random.normal();



        $.each(visibleEarthquakes, (i, earthquake) => {
            let point = earthquake.getGeometry().get(),
                plates = EQ.map._tectonicsLayer.getPlateByPoint(point),
                plateIdentifier = plates.inside[0] || plates.near[0],
                magnitude = earthquake.getProperty('mag'),
                time = earthquake.getProperty('time'),
                plateEarthquakes = platesData[plateIdentifier] || [];

            plateEarthquakes.push({
                x: time,
                y: magnitude,
                size: Math.pow(2, magnitude), //Configure the size of each scatter point
                shape: "circle", //Configure the shape of each scatter point.
                earthquake: earthquake
            });

            platesData[plateIdentifier] = plateEarthquakes;
        });

        let data = [];

        $.each(platesData, (plateName, plateValues) => {
            data.push({
                key: plateName,
                values: plateValues
            });
        });

        return data;
    }
}