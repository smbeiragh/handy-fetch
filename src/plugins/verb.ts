import {IPluginFactory} from "../types";

const methodFactory = (method: string): IPluginFactory => ({mergeOptions}) => ({
  name: method,
  onOptions: (options) => mergeOptions(options, { method }),
});

const verb = {
  get: methodFactory('get'),
  post: methodFactory('post'),
  put: methodFactory('put'),
  patch: methodFactory('patch'),
  delete: methodFactory('delete'),
  head: methodFactory('head'),
};

export default verb;
