const https = require('https');
const http = require('http');

exports.handler = async function(event) {
  const url = event.queryStringParameters && event.queryStringParameters.url;
  if (!url) return { statusCode: 400, body: 'Missing url parameter' };

  const decodedUrl = decodeURIComponent(url);

  return new Promise((resolve) => {
    const client = decodedUrl.startsWith('https') ? https : http;
    client.get(decodedUrl, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        client.get(res.headers.location, (res2) => {
          let data = '';
          res2.on('data', chunk => data += chunk);
          res2.on('end', () => resolve({
            statusCode: 200,
            headers: {
              'Content-Type': 'text/csv',
              'Access-Control-Allow-Origin': '*'
            },
            body: data
          }));
        }).on('error', e => resolve({ statusCode: 500, body: 'Redirect error: ' + e.message }));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: 200,
        headers: {
          'Content-Type': 'text/csv',
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
