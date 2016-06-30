class Fetcher {
    constructor(proxy) {
        this._proxy = proxy || null;
        this._url = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson";
    }
    
    fetchData(options) {
        let promiseToReturn = null;
        
        if (this._proxy) {
            promiseToReturn = new Promise((resolve, reject) => {
                resolve(this._proxy.getData());
            });
        } else {
            let url = this._url;
            $.each(options, (key, value) => {
                url += '&' + key + '=' + value;
            });

            promiseToReturn = $.getJSON(url);    
        }
        
        return promiseToReturn;
    }
}