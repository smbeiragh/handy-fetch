import {IPluginFactory, IFetchOptions, IHttpResponse} from "../types";

const mapAsParamToParserFunction = new Map<string, TParserName>([
  ['json', 'json'],
  ['text', 'text'],
  ['blob', 'blob'],
  ['arrayBuffer', 'arrayBuffer'],
  ['buffer', 'buffer'], // node-fetch (non-spec api)
]);

function resolveAsParam(as?: string | null): TParserName | null {
  if (typeof as === 'string') {
    return mapAsParamToParserFunction.get(as) || null;
  }
  return null;
}

type TParserName = keyof IHttpResponse;

function resolveContentType(contentType: string): TParserName | null {
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

const defaultParserFunctionName: TParserName = 'text';

function resolveParserFunctionName(response: IHttpResponse, requestOptions: IFetchOptions): TParserName  {
  const contentType = 'content-type' in response.headers ? response.headers['content-type'] : '';
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

  return (typeof res !== "undefined" && res !== null) ? res : defaultParserFunctionName;
}

const bodyParser: IPluginFactory = ({mergeOptions}) => ({
  name: 'bodyParser',
  onOptions: (options) => mergeOptions({ shouldParseBody: true }, options),
  onReturn: (promise: Promise<IHttpResponse>, { options }) => promise.then((response) => {
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
