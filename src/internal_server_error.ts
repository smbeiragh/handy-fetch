import {IHttpResponse, IInternalServerError} from "./types";
import {Interface} from "readline";

const statusToString = {
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway TimeOut',
};

interface IInternalServerErrorConstructor {
  new(response: IHttpResponse): IInternalServerError;
}

const InternalServerError = function InternalServerError(this: IInternalServerError, response: IHttpResponse) {
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
} as any as IInternalServerErrorConstructor;

InternalServerError.prototype = Object.create(
  Error.prototype,
  {
    name: {
      writable: false,
      configurable: false,
      value: 'InternalServerError'
    }
  }
);

InternalServerError.prototype.constructor = InternalServerError;

InternalServerError.prototype = Object.assign(InternalServerError.prototype, {
  toReadableString(this: IInternalServerError) {
    const response = this.getResponse();
    const readableName = statusToString[response.status as keyof typeof statusToString];
    if (readableName) {
      return `InternalServerError [${response.status} - ${readableName}]`;
    }
    return `InternalServerError [${response.status}]`;
  },
  isInternalServerError(this: IInternalServerError) {
    const response = this.getResponse();
    return response.status === 500;
  },
  isBadGateway(this: IInternalServerError) {
    const response = this.getResponse();
    return response.status === 502;
  },
  isServiceUnavailable(this: IInternalServerError) {
    const response = this.getResponse();
    return response.status === 503;
  },
  isGatewayTimeOut(this: IInternalServerError) {
    const response = this.getResponse();
    return response.status === 504;
  },
});

export function createInternalServerError(response: IHttpResponse): IInternalServerError {
  return new InternalServerError(response) as IInternalServerError;
}

export function isInternalServerError(obj: any): boolean {
  return obj instanceof InternalServerError;
}
