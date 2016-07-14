class Fetcher {

    constructor(proxy) {
        this._proxy = proxy || null;
        this._options = {
            starttime: moment().format('YYYY-MM-DD'),
            endtime: moment().add(1, 'days').format('YYYY-MM-DD')
        };

        this._url = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=earthquake&orderby=magnitude";
    }

    fetchData() {
        let promiseToReturn = null;
        if (this._proxy) {
            promiseToReturn = new Promise((resolve, reject) => {
                resolve(this._proxy.getData());
            });
        } else {
            let url = this._url;
            $.each(this._options, (key, value) => {
                url += '&' + key + '=' + value;
            });
            promiseToReturn = $.getJSON(url);
        }
        return promiseToReturn;
    }

    set(dataKey, data) {
        this._options[dataKey] = data;
        return this;
    }
}