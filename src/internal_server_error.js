const statusToString = {
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway TimeOut',
};

function InternalServerError(response) {
  Error.call(this);
  Object.defineProperties(this, {
    getResponse: {
      value: function getResponse() {
        return response;
      },
      enumerable: false,
      writable: true,
      configurable: true,
    },
    message: {
      get: () => this.toReadableString(),
      configurable: true,
    },
  });

  /* istanbul ignore else  */
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    Object.defineProperty(this, 'stack', {
      value: (new Error()).stack,
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }
}

InternalServerError.prototype = Object.create(Error.prototype);
InternalServerError.prototype.constructor = InternalServerError;
InternalServerError.prototype.name = 'InternalServerError';

InternalServerError.prototype = Object.assign(InternalServerError.prototype, {
  toReadableString() {
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
