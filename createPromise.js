const request = require('request');

const createPromise = (API_KEY, key) => {
    const options = {
        url: 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup',
        headers: {
            key: API_KEY,
            text: key,
            lang: 'en-en'
        }
    };
    return new Promise(function(resolve, reject) {
        request.get({ url: options.url, qs: options.headers },function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
            } else{
                reject("Error");
            }
        });
    });
    
    
};

module.exports = createPromise;