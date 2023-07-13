var express = require('express'),
  axios = require('axios'),
  bodyParser = require('body-parser');

const URL = require("url").URL;

const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return s.split("?");
  } catch (err) {
    return false;
  }
};

app = express();

var myLimit = typeof (process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({ limit: myLimit }));

app.all('*', async function(req, res, next) {

  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

  if (req.method === 'OPTIONS') {
    // CORS Preflight
    res.send();
  } else {
    const { url: targetUrl, ...otherParams } = req.query;
    const validUrlParts = stringIsAValidUrl(targetUrl);

    if (!validUrlParts) {
      res.status(500).send({ error: 'There is no valid url in the https://cors-proxy.teamcode1011101.repl.co request' });
      return;
    }

    let initialQuery = validUrlParts[1]
        ? validUrlParts[1]?.split('=')
        : '';

      if (Array.isArray(initialQuery)) {
        initialQuery = `${initialQuery[0]}=${encodeURIComponent(
          initialQuery[1],
        )}`;
      }
    
    const queries = Object.keys(otherParams).reduce((acc, curr) => {
      return acc += `${curr}=${encodeURIComponent(otherParams[curr])}&`
    },initialQuery ? initialQuery + '&' : initialQuery)

    const url = validUrlParts[0] + "?" + queries.slice(0, -1);

    try {
       console.log(url);
      const response = await axios({
        method: req.method,
        url,
        body: req.body,

      });


      return res.status(200).send(response.data);
    } catch (err) {
      console.log(err.message)
      return res.status(err?.response?.statusCode || 500).send(err.message)
    }


  }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log('Proxy server listening on port ' + app.get('port'));
});
