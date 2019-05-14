const mapAsParamToParserFunction = new Map([
  ['json', 'json'],
  ['text', 'text'],
  ['blob', 'blob'],
  ['arrayBuffer', 'arrayBuffer'],
  ['buffer', 'buffer'], // node-fetch (non-spec api)
]);

function resolveAsParam(as) {
  if (typeof as === 'string') {
    return mapAsParamToParserFunction.get(as) || null;
  }
  return null;
}

function resolveContentType(contentType) {
  const ct = contentType || '';
  if (ct.indexOf('application/json') > -1) {
    return 'json';
  } if (ct.indexOf('application/ld+json') > -1) {
    return 'json';
  } if (ct.indexOf('text/') > -1) {
    return 'text';
  } if (ct.indexOf('image/') > -1) {
    return 'blob';
  } if (ct.indexOf('audio/') > -1) {
    return 'arrayBuffer';
  } if (ct.indexOf('video/') > -1) {
    return 'arrayBuffer';
  } if (ct.indexOf('application/octet-stream') > -1) {
    return 'arrayBuffer';
  } if (ct.indexOf('application/zip') > -1) {
    return 'arrayBuffer';
  } if (ct.indexOf('application/ogg') > -1) {
    return 'arrayBuffer';
  } if (ct.indexOf('application/pdf') > -1) {
    return 'arrayBuffer';
  }
  return null;
}

const defaultParserFunctionName = 'text';

function resolveParserFunctionName(response, requestOptions) {
  const contentType = response.headers['content-type'];
  let res = null;

  /* istanbul ignore else  */
  if (response.status >= 200 && response.status < 300) {
    const as = requestOptions && resolveAsParam(requestOptions.as);

    if (as) {
      res = as;
    } else {
      res = resolveContentType(contentType);
    }
  } else if (response.status >= 400 && response.status < 600) {
    res = resolveContentType(contentType);
  }

  return res || defaultParserFunctionName;
}


const bodyParser = () => ({
  name: 'bodyParser',
  onOptions: options => [{ shouldParseBody: true }, options],
  onReturn: (promise, { options }) => promise.then((response) => {
    const { shouldParseBody } = options;

    if (
      shouldParseBody === true
        || (typeof shouldParseBody === 'function' && shouldParseBody(response, options))
    ) {
      const parserFunctionName = resolveParserFunctionName(response, options);
      return response[parserFunctionName]();
    }

    return response;
  }),
});

export default bodyParser;
