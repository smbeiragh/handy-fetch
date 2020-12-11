import {IBadRequestError, IHttpResponse} from "./types";

const statusToString = {
  400: 'General Bad Request',
  401: 'Unauthorized',
  403: 'Access Forbidden',
  404: 'Not Found',
  422: 'Unprocessable Entity',
};

interface IBadRequestErrorConstructor {
  new(response: IHttpResponse): IBadRequestError;
}

const BadRequestError = function BadRequestError(this: IBadRequestError ,response: IHttpResponse) {
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
} as any as IBadRequestErrorConstructor;

BadRequestError.prototype = Object.create(
  Error.prototype,
  {
    name: {
      writable: false,
      configurable: false,
      value: 'BadRequestError'
    }
  }
);

BadRequestError.prototype.constructor = BadRequestError;

BadRequestError.prototype = Object.assign(BadRequestError.prototype, {
  toReadableString(this: IBadRequestError) {
    const response = this.getResponse();
    const readableName = statusToString[response.status as keyof typeof statusToString];
    if (readableName) {
      return `BadRequestError [${response.status} - ${readableName}]`;
    }
    return `BadRequestError [${response.status}]`;
  },
  isBadRequest(this: IBadRequestError) {
    const response = this.getResponse();
    return response.status === 400;
  },
  isUnauthorized(this: IBadRequestError) {
    const response = this.getResponse();
    return response.status === 401;
  },
  isForbidden(this: IBadRequestError) {
    const response = this.getResponse();
    return response.status === 403;
  },
  isNotFound(this: IBadRequestError) {
    const response = this.getResponse();
    return response.status === 404;
  },
  isUnprocessableEntity(this: IBadRequestError) {
    const response = this.getResponse();
    return response.status === 422;
  },
});

export function createBadRequestError(response: IHttpResponse): IBadRequestError {
  return new BadRequestError(response) as IBadRequestError;
}

export function isBadRequestError(obj: any): boolean {
  return obj instanceof BadRequestError;
}
