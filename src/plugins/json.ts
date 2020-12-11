import {IPluginFactory, IFetchOptions} from "../types";

const json: IPluginFactory = ({mergeOptions}) => ({
  name: 'json',
  onOptions: (options :IFetchOptions) => {
    const method = (options.method || '').toUpperCase();
    if (options.body && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
      const opt: IFetchOptions = { headers: { 'Content-Type': 'application/json' } };
      opt.body = JSON.stringify(options.body);
      return mergeOptions(options, opt);
    }
    return options;
  },
});

const asJson: IPluginFactory = ({mergeOptions}) => ({
  name: 'asJson',
  onOptions: (options: IFetchOptions) => mergeOptions(options, { shouldParseBody: false, headers: { Accept: 'application/json' } }),
  onReturn: (promise: Promise<any>) => promise.then((response) => response.json()),
});

export { json, asJson };
