const https = require('https');
const http = require('http');

exports.handler = async function(event) {
  const url = event.queryStringParameters && event.queryStringParameters.url;
  if (!url) return { statusCode: 400, body: 'Missing url parameter' };

  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: 200,
        headers: {
          'Content-Type': 'text/calendar',
          'Access-Control-Allow-Origin': '*'
        },
        body: data
      }));
    }).on('error', (e) => resolve({
      statusCode: 500,
      body: 'Fetch error: ' + e.message
    }));
  });
};
