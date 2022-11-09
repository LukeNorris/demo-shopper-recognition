const queryStringToJSON = (queryString) => {
    if(queryString.indexOf('?') > -1){
      queryString = queryString.split('?')[1];
    }
    var pairs = queryString.split('&');
    var result = {};
    pairs.forEach(function(pair) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1] || '');
    });
    return result;
  }

  export {
    queryStringToJSON
  }