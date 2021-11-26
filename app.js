var request = require('request');
request.get('http://norvig.com/big.txt', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(response);
        console.log(body);
        var csv = body;
        // Continue with your processing here.
    }
});