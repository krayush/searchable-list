import axios from 'axios';
const apiEndPoints = {

};

const dummyAPIEndPoints = {
    "fetchUserData": "externalResources/test.json"
};

function getBaseUrl() {
    return "/";
}

class DataService {
    request(config, isDummyAPI) {
        var instance = axios.create({
            baseURL: getBaseUrl(isDummyAPI),
            headers: config.headers
        });
        return instance.request(config);
    }
    // urlData is for the url to parse
    // For sending body data, we need to add config.data
    post(url, urlData, config) {
        var isDummyAPI = false;
        config.headers = Object.assign({
            "Content-Type": "application/json",
        }, config.headers || {});
        if(!apiEndPoints[url] && dummyAPIEndPoints[url]) {
            console.log("Note: Hitting Dummy API in production");
            isDummyAPI = true;
        }
        config.url = eval('`' + (apiEndPoints[url] || dummyAPIEndPoints[url] || url) + '`');
        config.method = "post";
        return this.request(config, isDummyAPI);
    }

    delete(url, urlData, config) {
        var isDummyAPI = false;
        config.headers = Object.assign({
            "Content-Type": "application/json",
        }, config.headers || {});
        if(!apiEndPoints[url] && dummyAPIEndPoints[url]) {
            isDummyAPI = true;
        }
        config.url = eval('`' + (apiEndPoints[url] || dummyAPIEndPoints[url] || url) + '`');
        config.method = "delete";
        return this.request(config, isDummyAPI);
    }

    // data is for the url to parse
    // for query params, pass in config.data
    get(url, urlData, config) {
        var isDummyAPI = false;
        config.headers = Object.assign({
            'Content-Type': 'application/json',
        }, config.headers || {});
        if(!apiEndPoints[url] && dummyAPIEndPoints[url]) {
            isDummyAPI = true;
        }
        config.url = eval('`' + (apiEndPoints[url] || dummyAPIEndPoints[url] || url) + '`');
        config.method = "get";
        return this.request(config, isDummyAPI);
    }
}

const dataService = new DataService();
export { dataService, apiEndPoints, dummyAPIEndPoints };
