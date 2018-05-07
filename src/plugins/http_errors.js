import { createInternalServerError } from './../internal_server_error';
import { createBadRequestError } from './../bad_request_error';

const httpErrors = () => ({
  name: 'httpErrors',
  onReturn: promise =>
    promise.then((response) => {
      if (response.isBadRequest) {
        throw createBadRequestError(response);
      } else if (response.isServerError) {
        throw createInternalServerError(response);
      } else {
        return response;
      }
    }),
});

export default httpErrors;
