class Fetcher {
    constructor() {
        this._url = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson";
    }
    
    fetchData(options) {
        let url = this._url;
        $.each(options, (key, value) => {
            url += '&' + key + '=' + value;
        });
        
        return $.getJSON(url);
    }
}