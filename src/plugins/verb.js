const methodFactory = method => () => ({
  name: method,
  onOptions: options => [options, { method }],
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
