const INTERNALS = Symbol('Handy Fetch Response Internals');

function HttpResponse({
  status, statusText, url, headers, response, requestOptions,
}) {
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
      .then((buffer) => {
        this[INTERNALS].body = buffer;
        return this;
      });
  }
}

HttpResponse.prototype = {
  get body() {
    return this[INTERNALS].body;
  },

  get bodyUsed() {
    return this.nativeResponse.bodyUsed;
  },

  get url() {
    return this[INTERNALS].url;
  },

  get status() {
    return this[INTERNALS].status;
  },

  get statusText() {
    return this[INTERNALS].statusText;
  },

  get ok() {
    return this[INTERNALS].response.ok;
  },

  get isOk() {
    return this.ok;
  },

  get isBadRequest() {
    const { status } = this;
    return status >= 400 && status < 500;
  },

  get isServerError() {
    return this.status >= 500;
  },

  get headers() {
    return this[INTERNALS].headers;
  },

  get nativeResponse() {
    return this[INTERNALS].response;
  },

  json() {
    return this.nativeResponse.json()
      .then((body) => {
        this[INTERNALS].body = body;
        return this;
      });
  },

  text() {
    return this.nativeResponse.text()
      .then((body) => {
        this[INTERNALS].body = body;
        return this;
      });
  },

  blob() {
    return this.nativeResponse.blob()
      .then((body) => {
        this[INTERNALS].body = body;
        return this;
      });
  },

  arrayBuffer() {
    return this.nativeResponse.arrayBuffer()
      .then((body) => {
        this[INTERNALS].body = body;
        return this;
      });
  },
};

function purifyHeaders(headers) {
  const res = {};
  headers.forEach((value, key) => {
    res[key] = headers.get(key);
  });
  return res;
}

function createResponse(response, requestOptions) {
  const options = {
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    headers: purifyHeaders(response.headers),
    response,
    requestOptions,
  };

  return new HttpResponse(options);
}

export { createResponse };

export function isHttpResponse(obj) {
  return obj instanceof HttpResponse;
}
