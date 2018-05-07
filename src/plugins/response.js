import { createResponse } from './../response';

const response = () => ({
  name: 'response',
  onReturn: (promise, { options }) =>
    promise.then(orgResponse => createResponse(orgResponse, options)),
});

export default response;
