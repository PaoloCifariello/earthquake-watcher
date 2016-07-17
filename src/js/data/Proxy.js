class Proxy {
    constructor() {
        this._data = null;
        this._emptyData = null;
    }

    getData() {
        return this._data ?
            new Promise((resolve, reject) => {
                resolve(this._data);
            }) :
            $.getJSON('/src/assets/proxy-data.json');
    }

    getEmptyData() {
        return this._emptyData ?
            new Promise((resolve, reject) => {
                resolve(this._emptyData);
            }) :
            $.getJSON('/src/assets/proxy-emptydata.json');
    }
}