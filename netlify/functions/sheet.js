exports.handler = async function(event) {
  const url = event.queryStringParameters && event.queryStringParameters.url;
  if (!url) return { statusCode: 400, body: 'Missing url parameter' };

  try {
    const response = await fetch(decodeURIComponent(url), {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/csv,text/plain,*/*'
      }
    });
    const text = await response.text();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Access-Control-Allow-Origin': '*'
      },
      body: text
    };
  } catch(e) {
    return { statusCode: 500, body: 'Error: ' + e.message };
  }
};
