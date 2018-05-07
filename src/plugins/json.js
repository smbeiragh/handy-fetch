const json = () => ({
  name: 'json',
  onOptions: (options) => {
    const method = (options.method || '').toUpperCase();
    if (options.body && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
      const opt = { headers: { 'Content-Type': 'application/json' } };
      opt.body = JSON.stringify(options.body);
      return [options, opt];
    }
    return options;
  },
});

const asJson = () => ({
  name: 'asJson',
  onOptions: options => ([options, { shouldParseBody: false, headers: { Accept: 'application/json' } }]),
  onReturn: promise => promise.then(response => response.json()),
});

export { json, asJson };
