const statusToString = {
  400: 'General Bad Request',
  401: 'Unauthorized',
  403: 'Access Forbidden',
  404: 'Not Found',
  422: 'Unprocessable Entity',
};

function BadRequestError(response) {
  this.getResponse = function getResponse() {
    return response;
  };
}

BadRequestError.prototype = Object.assign(BadRequestError.prototype, {
  toString() {
    const response = this.getResponse();
    const readableName = statusToString[response.status];
    if (readableName) {
      return `BadRequestError [${response.status} - ${readableName}]`;
    }
    return `BadRequestError [${response.status}]`;
  },
  isBadRequest() {
    const response = this.getResponse();
    return response.status === 400;
  },
  isUnauthorized() {
    const response = this.getResponse();
    return response.status === 401;
  },
  isForbidden() {
    const response = this.getResponse();
    return response.status === 403;
  },
  isNotFound() {
    const response = this.getResponse();
    return response.status === 404;
  },
  isUnprocessableEntity() {
    const response = this.getResponse();
    return response.status === 422;
  },
});

export function createBadRequestError(response) {
  return new BadRequestError(response);
}

export function isBadRequestError(obj) {
  return obj instanceof BadRequestError;
}
