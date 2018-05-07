import createFetcher from './fetcher';
import { isBadRequestError } from './bad_request_error';
import { isInternalServerError } from './internal_server_error';
import { isHttpResponse } from './response';
import catchers from './cathers';
import { json, asJson } from './plugins/json';
import response from './plugins/response';
import httpErrors from './plugins/http_errors';
import optionsPlugin from './plugins/options';
import bodyParser from './plugins/body_parser';
import verb from './plugins/verb';

const getGlobalFetch = () => (typeof fetch !== 'undefined' ? fetch : null);

function createHandyFetch({ fetch = getGlobalFetch(), defaultOptions = {} } = {}) {
  const fetcher = createFetcher((url, options) => {
    const fetchModule = fetch || fetcher.fetch || getGlobalFetch();
    return fetchModule(url, options);
  }, defaultOptions);

  // TODO: add additional helper methods
  fetcher.use(optionsPlugin);
  fetcher.use(response);
  fetcher.use(bodyParser);
  fetcher.use(httpErrors);
  fetcher.use(json);
  fetcher.use(asJson);
  fetcher.use(verb.get);
  fetcher.use(verb.post);
  fetcher.use(verb.put);
  fetcher.use(verb.patch);
  fetcher.use(verb.delete);
  fetcher.use(verb.head);

  fetcher.alias('base', fetcher.options.response.bodyParser.httpErrors, true);
  fetcher.alias('default', fetcher.base, true);

  return fetcher;
}

const defaultFetch = createHandyFetch();

export {
  createHandyFetch,
  defaultFetch as fetch,
  catchers,
  isHttpResponse,
  isBadRequestError,
  isInternalServerError,
};
