import {IHttpResponse, THeaders, RESPONSE_INTERNALS as INTERNALS } from "./types";

interface HttpResponseConstructor {
  new(options: { status: number, statusText: string, url: string, headers: THeaders, response: Response, requestOptions: any}): IHttpResponse;
}

const HttpResponse = function HttpResponse(
  this: IHttpResponse,
  { status, statusText, url, headers, response, requestOptions }:
    { status: number, statusText: string, url: string, headers: THeaders, response: Response, requestOptions: any}
) {
  this[INTERNALS] = {
    status,
    statusText,
    url,
    headers,
    body: null,
    response,
    requestOptions,
  };

  /* istanbul ignore else  */
  if (this.nativeResponse.buffer) {
    this.buffer = () => this.nativeResponse.buffer()
      .then((buffer: Buffer) => {
        this[INTERNALS].body = buffer;
        return this;
      });
  }
} as any as HttpResponseConstructor;

// TODO: Add all methods && props of native response

HttpResponse.prototype = {
  get body() {
    return (this as IHttpResponse)[INTERNALS].body;
  },

  get bodyUsed() {
    return (this as IHttpResponse).bodyUsed;
  },

  get url() {
    return (this as IHttpResponse)[INTERNALS].url;
  },

  get status() {
    return (this as IHttpResponse)[INTERNALS].status;
  },

  get statusText() {
    return (this as IHttpResponse)[INTERNALS].statusText;
  },

  get ok() {
    return (this as IHttpResponse)[INTERNALS].response.ok;
  },

  get isOk() {
    return (this as IHttpResponse).ok;
  },

  get isBadRequest() {
    const { status } = (this as IHttpResponse);
    return status >= 400 && status < 500;
  },

  get isServerError() {
    return (this as IHttpResponse).status >= 500;
  },

  get headers() {
    return (this as IHttpResponse).headers;
  },

  get nativeResponse() {
    return (this as IHttpResponse)[INTERNALS].response;
  },

  json(this: IHttpResponse) {
    return this.nativeResponse.json()
      .then((body: any) => {
        this[INTERNALS].body = body;
        return this;
      });
  },

  text(this: IHttpResponse) {
    return this.nativeResponse.text()
      .then((body: string) => {
        this[INTERNALS].body = body;
        return this;
      });
  },

  blob(this: IHttpResponse) {
    return this.nativeResponse.blob()
      .then((body: Blob) => {
        this[INTERNALS].body = body;
        return this;
      });
  },

  arrayBuffer(this: IHttpResponse) {
    return this.nativeResponse.arrayBuffer()
      .then((body: ArrayBuffer) => {
        this[INTERNALS].body = body;
        return this;
      });
  },
};

function purifyHeaders(headers: Headers): THeaders {
  const res: THeaders = {};
  headers.forEach((value, key) => {
    res[key] = headers.get(key) || "";
  });
  return res;
}

function createResponse(response: Response, requestOptions: any): IHttpResponse {
  const options = {
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    headers: purifyHeaders(response.headers),
    response,
    requestOptions,
  };

  return new HttpResponse(options) as IHttpResponse;
}

export { createResponse };

export function isHttpResponse(obj: any): boolean {
  return obj instanceof HttpResponse;
}
