class Fetcher {
    constructor() {
        this._proxy = new Proxy();
        this._options = {
            starttime: moment().format('YYYY-MM-DD'),
            endtime: moment().add(1, 'days').format('YYYY-MM-DD')
        };

        this._url = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=earthquake&orderby=magnitude";
    }

    fetchData() {
        let promiseToReturn = null;
        switch (EQ.proxy) {
        case 'test':
            promiseToReturn = this._proxy.getData();
            break;
        case 'real':
            promiseToReturn = this._getFromAPI();
            break;
        case 'empty':
        default:
            promiseToReturn = this._proxy.getEmptyData();
            break;
        }

        return promiseToReturn;
    }

    set(dataKey, data) {
        this._options[dataKey] = data;
        return this;
    }

    _getFromAPI() {
        let url = this._url;
        $.each(this._options, (key, value) => {
            url += '&' + key + '=' + value;
        });
        return $.getJSON(url);
    }
}