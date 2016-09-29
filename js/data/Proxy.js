class Proxy {
    constructor() {
        this._data = null;
        this._emptyData = null;
    }

    getTestData() {
        return this._data ?
            new Promise((resolve, reject) => {
                resolve(this._data);
            }) :
            $.getJSON('/src/assets/proxy-data.json').then((data) => {
                this._data = data;
                return data;
            });
    }

    getEmptyData() {
        return this._emptyData ?
            new Promise((resolve, reject) => {
                resolve(this._emptyData);
            }) :
            $.getJSON('/src/assets/proxy-emptydata.json').then((data) => {
                this._emptyData = data;
                return data;
            });
    }
}