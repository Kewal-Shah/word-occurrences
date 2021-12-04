const request = require('request');
const fs = require('fs')
const createPromise = require('./createPromise');

const API_KEY = "dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9";
request.get('http://norvig.com/big.txt', function (error, response, body) {

    if (!error && response.statusCode == 200) {
        var dictionary = {};
        data = body.replace(/\r?\n|\r/g, " ");;
        data = data.split(" ");
        
        for (var i = 0; i < data.length ; i++) {
            data[i] = data[i].replace(/[^a-zA-Z0-9]/g, '');
            // can try with length > 0
            if (data[i].length > 3 && isNaN(data[i])) {
                const words = Object.keys(dictionary);
                if (words.indexOf(data[i]) !== -1) {
                    dictionary[data[i]] = parseInt(dictionary[data[i]]) + 1;
                } else {
                    dictionary[data[i]] = 1;
                }
            }
        }
        

        const sortedDictionary = Object.fromEntries(
            Object.entries(dictionary).sort(([, a], [, b]) => b - a)
        );
        //console.log(sortedDictionary);
        const keys = Object.keys(sortedDictionary);
        // console.log(keys);
        const top10Words = [];
        const arrayOfPromises = [];
        for (var i = 0; i < 10; i++) {
            console.log(sortedDictionary[keys[i]], keys[i]);
            arrayOfPromises.push(createPromise(API_KEY, keys[i]));
        }
        Promise.all(arrayOfPromises).then(values => {
            for (var i = 0; i < values.length; i++) {
                if (values[i].def.length > 0) {
                    const wordDetails = {};
                    const text = values[i].def[0].text;
                    wordDetails['word'] = text;
                    wordDetails['output'] = {};
                    wordDetails['output']['count'] = sortedDictionary[text];
                    wordDetails['output']['pos'] = values[i].def[0].pos;
                    wordDetails['output']['synonyms'] = [];
                    const translations = values[i].def[0].tr;
                    for (var j = 0; j < translations.length; j++) {
                        const synonyms = translations[j].syn || [];
                        for (var k = 0; k < synonyms.length; k++) {
                            wordDetails['output']['synonyms'].push(synonyms[k].text);
                        }
                    }
                    const textDetails = JSON.stringify(wordDetails);
                    top10Words.push(textDetails);
                }
            }
            // console.log(top10Words.length);
            console.log(top10Words);
        });

    }
});