class Proxy {
    getData() {
        return data;
    }
    getEmptyData() {
        return emptyData;
    }
}

let emptyData = {
    "type": "FeatureCollection",
    "metadata": {
        "generated": 1467295593000,
        "url": "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2016-01-01&endtime=2016-01-02",
        "title": "USGS Earthquakes",
        "status": 200,
        "api": "1.5.2",
        "count": 253
    },
    "features": []
};

let data = {
    "type": "FeatureCollection",
    "metadata": {
        "generated": 1467295593000,
        "url": "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2016-01-01&endtime=2016-01-02",
        "title": "USGS Earthquakes",
        "status": 200,
        "api": "1.5.2",
        "count": 253
    },
    "features": [{
            "type": "Feature",
            "properties": {
                "mag": 2.2,
                "place": "47km NE of Nikolski, Alaska",
                "time": 1451692324000,
                "updated": 1452036507860,
                "tz": -540,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/ak12383570",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ak12383570&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 74,
                "net": "ak",
                "code": "12383570",
                "ids": ",ak12383570,",
                "sources": ",ak,",
                "types": ",general-link,geoserve,nearby-cities,origin,tectonic-summary,",
                "nst": null,
                "dmin": null,
                "rms": 0.65,
                "gap": null,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 2.2 - 47km NE of Nikolski, Alaska"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-168.3619, 53.237, 12.1]
            },
            "id": "ak12383570"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 0.6,
                "place": "2km S of Devore, CA",
                "time": 1451691683670,
                "updated": 1459286400331,
                "tz": -480,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/ci37509488",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ci37509488&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 6,
                "net": "ci",
                "code": "37509488",
                "ids": ",ci37509488,",
                "sources": ",ci,",
                "types": ",cap,general-link,geoserve,nearby-cities,origin,phase-data,scitech-link,",
                "nst": 17,
                "dmin": 0.07017,
                "rms": 0.21,
                "gap": 62,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 0.6 - 2km S of Devore, CA"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-117.4028333, 34.2031667, 2.99]
            },
            "id": "ci37509488"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 4.3,
                "place": "23km E of Bandar-e Lengeh, Iran",
                "time": 1451690249490,
                "updated": 1459202972040,
                "tz": 210,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/us10004ddg",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us10004ddg&format=geojson",
                "felt": 0,
                "cdi": 1,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 284,
                "net": "us",
                "code": "10004ddg",
                "ids": ",us10004ddg,",
                "sources": ",us,",
                "types": ",dyfi,geoserve,nearby-cities,origin,phase-data,tectonic-summary,",
                "nst": null,
                "dmin": 1.891,
                "rms": 0.54,
                "gap": 107,
                "magType": "mb",
                "type": "earthquake",
                "title": "M 4.3 - 23km E of Bandar-e Lengeh, Iran"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [55.1188, 26.5711, 10]
            },
            "id": "us10004ddg"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 3.2,
                "place": "10km NNE of Guthrie, Oklahoma",
                "time": 1451690158850,
                "updated": 1459202972040,
                "tz": -360,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/us10004asf",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us10004asf&format=geojson",
                "felt": 5,
                "cdi": 2.2,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 159,
                "net": "us",
                "code": "10004asf",
                "ids": ",us10004asf,",
                "sources": ",us,",
                "types": ",dyfi,general-link,geoserve,impact-text,nearby-cities,origin,phase-data,tectonic-summary,",
                "nst": null,
                "dmin": 0.177,
                "rms": 0.43,
                "gap": 65,
                "magType": "mb_lg",
                "type": "earthquake",
                "title": "M 3.2 - 10km NNE of Guthrie, Oklahoma"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-97.4016, 35.9688, 5]
            },
            "id": "us10004asf"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 3.4,
                "place": "105km SSW of Chernabura Island, Alaska",
                "time": 1451690013210,
                "updated": 1459202972040,
                "tz": -660,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/us10004bmy",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us10004bmy&format=geojson",
                "felt": 0,
                "cdi": 1,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 178,
                "net": "us",
                "code": "10004bmy",
                "ids": ",ak12439432,us10004bmy,",
                "sources": ",ak,us,",
                "types": ",dyfi,general-link,geoserve,nearby-cities,origin,phase-data,tectonic-summary,",
                "nst": null,
                "dmin": 0.977,
                "rms": 0.54,
                "gap": 251,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 3.4 - 105km SSW of Chernabura Island, Alaska"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-160.2874, 53.9447, 33.66]
            },
            "id": "us10004bmy"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 4.6,
                "place": "156km NNW of Tanahmerah, Indonesia",
                "time": 1451689673810,
                "updated": 1459202972040,
                "tz": 540,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/us10004ddf",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us10004ddf&format=geojson",
                "felt": 0,
                "cdi": 1,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 326,
                "net": "us",
                "code": "10004ddf",
                "ids": ",us10004ddf,",
                "sources": ",us,",
                "types": ",dyfi,geoserve,nearby-cities,origin,phase-data,tectonic-summary,",
                "nst": null,
                "dmin": 2.348,
                "rms": 1.13,
                "gap": 103,
                "magType": "mb",
                "type": "earthquake",
                "title": "M 4.6 - 156km NNW of Tanahmerah, Indonesia"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [139.8842, -4.7301, 15.32]
            },
            "id": "us10004ddf"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 5,
                "place": "48km W of Ndoi Island, Fiji",
                "time": 1451689492280,
                "updated": 1463165816000,
                "tz": -720,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/us10004asd",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us10004asd&format=geojson",
                "felt": 0,
                "cdi": 1,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 385,
                "net": "us",
                "code": "10004asd",
                "ids": ",us10004asd,gcmt20160101230452,",
                "sources": ",us,gcmt,",
                "types": ",cap,dyfi,geoserve,moment-tensor,nearby-cities,origin,phase-data,tectonic-summary,",
                "nst": null,
                "dmin": 3.85,
                "rms": 0.83,
                "gap": 91,
                "magType": "mb",
                "type": "earthquake",
                "title": "M 5.0 - 48km W of Ndoi Island, Fiji"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-179.1565, -20.5653, 642.75]
            },
            "id": "us10004asd"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 1.05,
                "place": "16km NE of Three Forks, Montana",
                "time": 1451689455380,
                "updated": 1451923194210,
                "tz": -420,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/mb80118319",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=mb80118319&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 17,
                "net": "mb",
                "code": "80118319",
                "ids": ",mb80118319,",
                "sources": ",mb,",
                "types": ",cap,general-link,geoserve,nearby-cities,origin,phase-data,",
                "nst": 7,
                "dmin": 0.199,
                "rms": 0.1,
                "gap": 159,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 1.1 - 16km NE of Three Forks, Montana"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-111.4053333, 46.0053333, 5.84]
            },
            "id": "mb80118319"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 1.6,
                "place": "69km ESE of Lakeview, Oregon",
                "time": 1451688940445,
                "updated": 1451737661594,
                "tz": -480,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/nn00525082",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=nn00525082&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 39,
                "net": "nn",
                "code": "00525082",
                "ids": ",nn00525082,",
                "sources": ",nn,",
                "types": ",cap,general-link,general-link,geoserve,nearby-cities,origin,phase-data,",
                "nst": 6,
                "dmin": 0.153,
                "rms": 0.1605,
                "gap": 207.1,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 1.6 - 69km ESE of Lakeview, Oregon"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-119.6086, 41.8871, 6.9]
            },
            "id": "nn00525082"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 3.1,
                "place": "8km NNE of Guthrie, Oklahoma",
                "time": 1451688026600,
                "updated": 1459202972040,
                "tz": -360,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/us10004as8",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us10004as8&format=geojson",
                "felt": 5,
                "cdi": 2.7,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 149,
                "net": "us",
                "code": "10004as8",
                "ids": ",us10004as8,",
                "sources": ",us,",
                "types": ",cap,dyfi,general-link,geoserve,impact-text,nearby-cities,origin,phase-data,tectonic-summary,",
                "nst": null,
                "dmin": null,
                "rms": 0.29,
                "gap": 65,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 3.1 - 8km NNE of Guthrie, Oklahoma"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-97.3969, 35.9533, 6.886]
            },
            "id": "us10004as8"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 2.45,
                "place": "12km NNW of Coso Junction, CA",
                "time": 1451687953790,
                "updated": 1459286549690,
                "tz": -480,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/ci37509480",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ci37509480&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 92,
                "net": "ci",
                "code": "37509480",
                "ids": ",ci37509480,",
                "sources": ",ci,",
                "types": ",cap,focal-mechanism,general-link,geoserve,nearby-cities,origin,phase-data,scitech-link,",
                "nst": 29,
                "dmin": 0.1593,
                "rms": 0.13,
                "gap": 71,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 2.5 - 12km NNW of Coso Junction, CA"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-117.9835, 36.1483333, 1.35]
            },
            "id": "ci37509480"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 4,
                "place": "74km SE of Chignik Lake, Alaska",
                "time": 1451687812220,
                "updated": 1459202972040,
                "tz": -660,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/us10004bn0",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us10004bn0&format=geojson",
                "felt": 0,
                "cdi": 1,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 246,
                "net": "us",
                "code": "10004bn0",
                "ids": ",ak12382624,us10004bn0,",
                "sources": ",ak,us,",
                "types": ",dyfi,general-link,geoserve,nearby-cities,origin,phase-data,tectonic-summary,",
                "nst": null,
                "dmin": 0.601,
                "rms": 0.99,
                "gap": 119,
                "magType": "mb",
                "type": "earthquake",
                "title": "M 4.0 - 74km SE of Chignik Lake, Alaska"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-157.9431, 55.7628, 52.71]
            },
            "id": "us10004bn0"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 0.3,
                "place": "34km SE of Hawthorne, Nevada",
                "time": 1451687773066,
                "updated": 1451735272076,
                "tz": -480,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/nn00525078",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=nn00525078&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 1,
                "net": "nn",
                "code": "00525078",
                "ids": ",nn00525078,",
                "sources": ",nn,",
                "types": ",cap,general-link,geoserve,nearby-cities,origin,phase-data,",
                "nst": 5,
                "dmin": 0.107,
                "rms": 0.0266,
                "gap": 200.58,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 0.3 - 34km SE of Hawthorne, Nevada"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-118.3768, 38.287, 7.8]
            },
            "id": "nn00525078"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 1.4,
                "place": "36km S of Cantwell, Alaska",
                "time": 1451687394000,
                "updated": 1452036510142,
                "tz": -540,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/ak12382599",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ak12382599&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 30,
                "net": "ak",
                "code": "12382599",
                "ids": ",ak12382599,",
                "sources": ",ak,",
                "types": ",general-link,geoserve,nearby-cities,origin,tectonic-summary,",
                "nst": null,
                "dmin": null,
                "rms": 0.5,
                "gap": null,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 1.4 - 36km S of Cantwell, Alaska"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-149.076, 63.0651, 73.8]
            },
            "id": "ak12382599"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 0.58,
                "place": "4km ENE of Magna, Utah",
                "time": 1451687271270,
                "updated": 1452020698250,
                "tz": -420,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/uu60134752",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=uu60134752&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 5,
                "net": "uu",
                "code": "60134752",
                "ids": ",uu60134752,",
                "sources": ",uu,",
                "types": ",general-link,geoserve,nearby-cities,origin,phase-data,tectonic-summary,",
                "nst": 7,
                "dmin": 0.092,
                "rms": 0.09,
                "gap": 99,
                "magType": "md",
                "type": "earthquake",
                "title": "M 0.6 - 4km ENE of Magna, Utah"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-112.0581667, 40.731, 0.12]
            },
            "id": "uu60134752"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 1.58,
                "place": "4km WNW of Dublin, California",
                "time": 1451686753580,
                "updated": 1452572344741,
                "tz": -480,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/nc72572440",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=nc72572440&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 38,
                "net": "nc",
                "code": "72572440",
                "ids": ",nc72572440,",
                "sources": ",nc,",
                "types": ",general-link,geoserve,nearby-cities,origin,phase-data,scitech-link,",
                "nst": 38,
                "dmin": 0.0682,
                "rms": 0.08,
                "gap": 44,
                "magType": "md",
                "type": "earthquake",
                "title": "M 1.6 - 4km WNW of Dublin, California"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-121.981, 37.7226667, 8.94]
            },
            "id": "nc72572440"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 0.95,
                "place": "17km NE of Three Forks, Montana",
                "time": 1451686636760,
                "updated": 1451945324380,
                "tz": -420,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/mb80118459",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=mb80118459&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 14,
                "net": "mb",
                "code": "80118459",
                "ids": ",mb80118459,",
                "sources": ",mb,",
                "types": ",cap,general-link,geoserve,nearby-cities,origin,phase-data,",
                "nst": 7,
                "dmin": 0.194,
                "rms": 0.03,
                "gap": 156,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 1.0 - 17km NE of Three Forks, Montana"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-111.4076667, 46.0135, 8.16]
            },
            "id": "mb80118459"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 1.2,
                "place": "90km NE of Cape Yakataga, Alaska",
                "time": 1451686321000,
                "updated": 1452215117868,
                "tz": -540,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/ak12382576",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ak12382576&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 22,
                "net": "ak",
                "code": "12382576",
                "ids": ",ak12382576,",
                "sources": ",ak,",
                "types": ",general-link,geoserve,nearby-cities,origin,tectonic-summary,",
                "nst": null,
                "dmin": null,
                "rms": 0.36,
                "gap": null,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 1.2 - 90km NE of Cape Yakataga, Alaska"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-141.2047, 60.611, 8]
            },
            "id": "ak12382576"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 0.63,
                "place": "7km WNW of Lolo, Montana",
                "time": 1451686310340,
                "updated": 1451954804450,
                "tz": -420,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/mb80118529",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=mb80118529&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 6,
                "net": "mb",
                "code": "80118529",
                "ids": ",mb80118529,",
                "sources": ",mb,",
                "types": ",general-link,geoserve,nearby-cities,origin,phase-data,",
                "nst": 14,
                "dmin": 0.444,
                "rms": 0.21,
                "gap": 166,
                "magType": "md",
                "type": "earthquake",
                "title": "M 0.6 - 7km WNW of Lolo, Montana"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-114.1701667, 46.7818333, 2.17]
            },
            "id": "mb80118529"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 3,
                "place": "7km ENE of Edmond, Oklahoma",
                "time": 1451686084700,
                "updated": 1459202972040,
                "tz": -360,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/us10004as5",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us10004as5&format=geojson",
                "felt": 4,
                "cdi": 3.4,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 140,
                "net": "us",
                "code": "10004as5",
                "ids": ",us10004as5,",
                "sources": ",us,",
                "types": ",dyfi,general-link,geoserve,impact-text,nearby-cities,origin,phase-data,tectonic-summary,",
                "nst": null,
                "dmin": null,
                "rms": 0.6,
                "gap": 53,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 3.0 - 7km ENE of Edmond, Oklahoma"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-97.3992, 35.6661, 6.696]
            },
            "id": "us10004as5"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 1.7,
                "place": "71km N of Nikiski, Alaska",
                "time": 1451685575000,
                "updated": 1452036506504,
                "tz": -540,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/ak12439428",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ak12439428&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 44,
                "net": "ak",
                "code": "12439428",
                "ids": ",ak12439428,",
                "sources": ",ak,",
                "types": ",general-link,geoserve,nearby-cities,origin,tectonic-summary,",
                "nst": null,
                "dmin": null,
                "rms": 0.55,
                "gap": null,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 1.7 - 71km N of Nikiski, Alaska"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-151.3169, 61.3331, 67.2]
            },
            "id": "ak12439428"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 4.9,
                "place": "132km SW of Dadali, Solomon Islands",
                "time": 1451684980090,
                "updated": 1463165815000,
                "tz": 660,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/us10004as0",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us10004as0&format=geojson",
                "felt": 0,
                "cdi": 1,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 369,
                "net": "us",
                "code": "10004as0",
                "ids": ",us10004as0,gcmt20160101214940,",
                "sources": ",us,gcmt,",
                "types": ",cap,dyfi,geoserve,moment-tensor,nearby-cities,origin,phase-data,tectonic-summary,",
                "nst": null,
                "dmin": 1.669,
                "rms": 0.78,
                "gap": 49,
                "magType": "mb",
                "type": "earthquake",
                "title": "M 4.9 - 132km SW of Dadali, Solomon Islands"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [158.3119, -9.0125, 14.82]
            },
            "id": "us10004as0"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 2.8,
                "place": "77km N of Brenas, Puerto Rico",
                "time": 1451684958000,
                "updated": 1459202972040,
                "tz": -240,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/pr16001006",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=pr16001006&format=geojson",
                "felt": 0,
                "cdi": 1,
                "mmi": null,
                "alert": null,
                "status": "REVIEWED",
                "tsunami": 0,
                "sig": 121,
                "net": "pr",
                "code": "16001006",
                "ids": ",pr16001006,us10004as6,",
                "sources": ",pr,us,",
                "types": ",cap,dyfi,geoserve,nearby-cities,origin,phase-data,tectonic-summary,",
                "nst": 12,
                "dmin": 0.68990614,
                "rms": 0.18,
                "gap": 262.8,
                "magType": "Md",
                "type": "earthquake",
                "title": "M 2.8 - 77km N of Brenas, Puerto Rico"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-66.408, 19.1611, 22]
            },
            "id": "pr16001006"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 0.86,
                "place": "7km NW of The Geysers, California",
                "time": 1451684947330,
                "updated": 1451685045190,
                "tz": -480,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/nc72572435",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=nc72572435&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "automatic",
                "tsunami": 0,
                "sig": 11,
                "net": "nc",
                "code": "72572435",
                "ids": ",nc72572435,",
                "sources": ",nc,",
                "types": ",general-link,geoserve,nearby-cities,origin,phase-data,",
                "nst": 15,
                "dmin": 0.006709,
                "rms": 0.02,
                "gap": 53,
                "magType": "md",
                "type": "earthquake",
                "title": "M 0.9 - 7km NW of The Geysers, California"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-122.8264999, 38.8223343, 2.27]
            },
            "id": "nc72572435"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 1.8,
                "place": "71km ESE of Lakeview, Oregon",
                "time": 1451684638512,
                "updated": 1451687676058,
                "tz": -480,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/nn00524999",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=nn00524999&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 50,
                "net": "nn",
                "code": "00524999",
                "ids": ",nn00524999,",
                "sources": ",nn,",
                "types": ",cap,general-link,general-link,geoserve,nearby-cities,origin,phase-data,",
                "nst": 6,
                "dmin": 0.17,
                "rms": 0.1782,
                "gap": 210.07,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 1.8 - 71km ESE of Lakeview, Oregon"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-119.6133, 41.8511, 8.6]
            },
            "id": "nn00524999"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 1.7,
                "place": "10km S of Willow, Alaska",
                "time": 1451683977000,
                "updated": 1452036514193,
                "tz": -540,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/ak12381653",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ak12381653&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 44,
                "net": "ak",
                "code": "12381653",
                "ids": ",ak12381653,",
                "sources": ",ak,",
                "types": ",general-link,geoserve,nearby-cities,origin,tectonic-summary,",
                "nst": null,
                "dmin": null,
                "rms": 0.6,
                "gap": null,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 1.7 - 10km S of Willow, Alaska"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-150.0509, 61.6528, 39.1]
            },
            "id": "ak12381653"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 0.64,
                "place": "15km NE of Little Lake, CA",
                "time": 1451683763940,
                "updated": 1459287605376,
                "tz": -480,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/ci37509472",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ci37509472&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 6,
                "net": "ci",
                "code": "37509472",
                "ids": ",ci37509472,",
                "sources": ",ci,",
                "types": ",cap,general-link,geoserve,nearby-cities,origin,phase-data,scitech-link,",
                "nst": 11,
                "dmin": 0.007011,
                "rms": 0.05,
                "gap": 99,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 0.6 - 15km NE of Little Lake, CA"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-117.7723333, 36.0211667, 1.9]
            },
            "id": "ci37509472"
        }, {
            "type": "Feature",
            "properties": {
                "mag": 1,
                "place": "17km NE of Spanish Springs, Nevada",
                "time": 1451682461610,
                "updated": 1451684538958,
                "tz": -480,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/nn00524992",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=nn00524992&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 15,
                "net": "nn",
                "code": "00524992",
                "ids": ",nn00524992,",
                "sources": ",nn,",
                "types": ",cap,general-link,geoserve,nearby-cities,origin,phase-data,",
                "nst": 7,
                "dmin": 0.131,
                "rms": 0.1413,
                "gap": 156.58,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 1.0 - 17km NE of Spanish Springs, Nevada"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-119.5464, 39.7524, 2.9]
            },
            "id": "nn00524992"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 0.41,
                "place": "17km NE of Three Forks, Montana",
                "time": 1451682159380,
                "updated": 1451955065830,
                "tz": -420,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/mb80118534",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=mb80118534&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 3,
                "net": "mb",
                "code": "80118534",
                "ids": ",mb80118534,",
                "sources": ",mb,",
                "types": ",general-link,geoserve,nearby-cities,origin,phase-data,",
                "nst": 6,
                "dmin": 0.196,
                "rms": 0.04,
                "gap": 156,
                "magType": "md",
                "type": "earthquake",
                "title": "M 0.4 - 17km NE of Three Forks, Montana"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-111.4083333, 46.0118333, 5.89]
            },
            "id": "mb80118534"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 0.22,
                "place": "5km W of Cobb, California",
                "time": 1451682139640,
                "updated": 1452193448317,
                "tz": -480,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/nc72572425",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=nc72572425&format=geojson",
                "felt": 2,
                "cdi": 3.1,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 1,
                "net": "nc",
                "code": "72572425",
                "ids": ",nc72572425,",
                "sources": ",nc,",
                "types": ",dyfi,general-link,geoserve,nearby-cities,origin,phase-data,scitech-link,",
                "nst": 18,
                "dmin": 0.005835,
                "rms": 0.06,
                "gap": 41,
                "magType": "md",
                "type": "earthquake",
                "title": "M 0.2 - 5km W of Cobb, California"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-122.7853333, 38.8178333, 2.05]
            },
            "id": "nc72572425"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 1.2,
                "place": "108km NW of Talkeetna, Alaska",
                "time": 1451682136000,
                "updated": 1452036518931,
                "tz": -540,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/ak12381608",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ak12381608&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 22,
                "net": "ak",
                "code": "12381608",
                "ids": ",ak12381608,",
                "sources": ",ak,",
                "types": ",general-link,geoserve,nearby-cities,origin,tectonic-summary,",
                "nst": null,
                "dmin": null,
                "rms": 0.79,
                "gap": null,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 1.2 - 108km NW of Talkeetna, Alaska"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-151.5006, 63.0638, 8.7]
            },
            "id": "ak12381608"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 2.2,
                "place": "70km ESE of Lakeview, Oregon",
                "time": 1451681977056,
                "updated": 1451684165106,
                "tz": -480,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/nn00524991",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=nn00524991&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 74,
                "net": "nn",
                "code": "00524991",
                "ids": ",nn00524991,",
                "sources": ",nn,",
                "types": ",cap,general-link,general-link,geoserve,nearby-cities,origin,phase-data,",
                "nst": 6,
                "dmin": 0.165,
                "rms": 0.2003,
                "gap": 209.33,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 2.2 - 70km ESE of Lakeview, Oregon"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-119.6128, 41.8599, 8.9]
            },
            "id": "nn00524991"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 0.69,
                "place": "2km E of Berkeley, California",
                "time": 1451681866710,
                "updated": 1452105127680,
                "tz": -480,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/nc72572420",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=nc72572420&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 7,
                "net": "nc",
                "code": "72572420",
                "ids": ",nc72572420,",
                "sources": ",nc,",
                "types": ",general-link,geoserve,nearby-cities,origin,phase-data,tectonic-summary,",
                "nst": 21,
                "dmin": 0.006763,
                "rms": 0.04,
                "gap": 46,
                "magType": "md",
                "type": "earthquake",
                "title": "M 0.7 - 2km E of Berkeley, California"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-122.2473333, 37.869, 8.65]
            },
            "id": "nc72572420"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 2.7,
                "place": "79km NE of Kodiak, Alaska",
                "time": 1451681498000,
                "updated": 1459202972040,
                "tz": -600,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/ak12380708",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ak12380708&format=geojson",
                "felt": 0,
                "cdi": 1,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 112,
                "net": "ak",
                "code": "12380708",
                "ids": ",ak12380708,us10004art,",
                "sources": ",ak,us,",
                "types": ",cap,dyfi,general-link,geoserve,nearby-cities,origin,phase-data,tectonic-summary,",
                "nst": null,
                "dmin": null,
                "rms": 0.65,
                "gap": null,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 2.7 - 79km NE of Kodiak, Alaska"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-151.3528, 58.2292, 32.2]
            },
            "id": "ak12380708"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 0.56,
                "place": "8km W of Cobb, California",
                "time": 1451681455450,
                "updated": 1451681550230,
                "tz": -480,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/nc72572415",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=nc72572415&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "automatic",
                "tsunami": 0,
                "sig": 5,
                "net": "nc",
                "code": "72572415",
                "ids": ",nc72572415,",
                "sources": ",nc,",
                "types": ",general-link,geoserve,nearby-cities,origin,phase-data,",
                "nst": 7,
                "dmin": 0.01249,
                "rms": 0.07,
                "gap": 159,
                "magType": "md",
                "type": "earthquake",
                "title": "M 0.6 - 8km W of Cobb, California"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-122.8178329, 38.8343315, 1.59]
            },
            "id": "nc72572415"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 0.84,
                "place": "30km SSE of Virginia City, Montana",
                "time": 1451680477530,
                "updated": 1451945907990,
                "tz": -420,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/mb80118464",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=mb80118464&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 11,
                "net": "mb",
                "code": "80118464",
                "ids": ",mb80118464,",
                "sources": ",mb,",
                "types": ",general-link,geoserve,nearby-cities,origin,phase-data,",
                "nst": 8,
                "dmin": 0.245,
                "rms": 0.16,
                "gap": 104,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 0.8 - 30km SSE of Virginia City, Montana"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-111.8481667, 45.0291667, 5.86]
            },
            "id": "mb80118464"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 0.68,
                "place": "6km SSW of Devore, CA",
                "time": 1451680169600,
                "updated": 1459286967019,
                "tz": -480,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/ci37509456",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ci37509456&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 7,
                "net": "ci",
                "code": "37509456",
                "ids": ",ci37509456,",
                "sources": ",ci,",
                "types": ",cap,general-link,geoserve,nearby-cities,origin,phase-data,scitech-link,",
                "nst": 15,
                "dmin": 0.09964,
                "rms": 0.12,
                "gap": 78,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 0.7 - 6km SSW of Devore, CA"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-117.4205, 34.1713333, 2.79]
            },
            "id": "ci37509456"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 3.4,
                "place": "6km S of Guthrie, Oklahoma",
                "time": 1451680087600,
                "updated": 1459202972040,
                "tz": -360,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/us10004ark",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us10004ark&format=geojson",
                "felt": 22,
                "cdi": 4.5,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 188,
                "net": "us",
                "code": "10004ark",
                "ids": ",us10004ark,",
                "sources": ",us,",
                "types": ",cap,dyfi,general-link,geoserve,impact-text,nearby-cities,origin,phase-data,tectonic-summary,",
                "nst": null,
                "dmin": null,
                "rms": 0.59,
                "gap": 68,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 3.4 - 6km S of Guthrie, Oklahoma"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-97.4362, 35.8209, 5.632]
            },
            "id": "us10004ark"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 0.85,
                "place": "5km SSW of Devore, CA",
                "time": 1451607170650,
                "updated": 1459287162781,
                "tz": -480,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/ci37509232",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ci37509232&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 11,
                "net": "ci",
                "code": "37509232",
                "ids": ",ci37509232,",
                "sources": ",ci,",
                "types": ",general-link,geoserve,nearby-cities,origin,phase-data,scitech-link,",
                "nst": 31,
                "dmin": 0.08449,
                "rms": 0.16,
                "gap": 57,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 0.9 - 5km SSW of Devore, CA"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-117.4161667, 34.1821667, 7.38]
            },
            "id": "ci37509232"
        }
        , {
            "type": "Feature",
            "properties": {
                "mag": 1.2,
                "place": "22km NNE of Badger, Alaska",
                "time": 1451607076000,
                "updated": 1452036153596,
                "tz": -540,
                "url": "http://earthquake.usgs.gov/earthquakes/eventpage/ak12368055",
                "detail": "http://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ak12368055&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 22,
                "net": "ak",
                "code": "12368055",
                "ids": ",ak12368055,",
                "sources": ",ak,",
                "types": ",general-link,geoserve,nearby-cities,origin,",
                "nst": null,
                "dmin": null,
                "rms": 0.27,
                "gap": null,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 1.2 - 22km NNE of Badger, Alaska"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-147.3342, 64.9859, 0]
            },
            "id": "ak12368055"
        }],
    "bbox": [-179.4803, -50.5575, -0.48, 166.8215, 68.2349, 642.75]
};