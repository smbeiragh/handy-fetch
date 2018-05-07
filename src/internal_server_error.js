const statusToString = {
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway TimeOut',
};

function InternalServerError(response) {
  this.getResponse = function getResponse() {
    return response;
  };
}

InternalServerError.prototype = Object.assign(InternalServerError.prototype, {
  toString() {
    const response = this.getResponse();
    const readableName = statusToString[response.status];
    if (readableName) {
      return `InternalServerError [${response.status} - ${readableName}]`;
    }
    return `InternalServerError [${response.status}]`;
  },
  isInternalServerError() {
    const response = this.getResponse();
    return response.status === 500;
  },
  isBadGateway() {
    const response = this.getResponse();
    return response.status === 502;
  },
  isServiceUnavailable() {
    const response = this.getResponse();
    return response.status === 503;
  },
  isGatewayTimeOut() {
    const response = this.getResponse();
    return response.status === 504;
  },
});

export function createInternalServerError(response) {
  return new InternalServerError(response);
}

export function isInternalServerError(obj) {
  return obj instanceof InternalServerError;
}
