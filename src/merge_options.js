function isHeaderObject(obj) {
  return (
    typeof obj === 'object' &&
    typeof obj.append === 'function' &&
    typeof obj.delete === 'function' &&
    typeof obj.entries === 'function' &&
    typeof obj.forEach === 'function' &&
    typeof obj.get === 'function' &&
    typeof obj.has === 'function' &&
    typeof obj.keys === 'function' &&
    typeof obj.set === 'function' &&
    typeof obj.values === 'function'
  );
}

function getRaw(headers) {
  if (isHeaderObject(headers)) {
    const raw = {};
    const process = (value, key) => {
      if (!(key in raw)) {
        if (value.indexOf(',') > -1) {
          value.split(',').forEach(eachValue => process(eachValue, key));
        } else {
          raw[key] = value;
        }
      } else {
        const oldValue = raw[key];
        if (Array.isArray(oldValue)) {
          oldValue.push(value);
        } else {
          raw[key] = [oldValue, value];
        }
      }
    };
    headers.forEach(process);
    return raw;
  } else if (typeof headers === 'object') {
    const raw = {};
    const keys = Object.keys(headers);
    keys.forEach((key) => {
      const rawValue = headers[key];
      const value = Array.isArray(rawValue) ? rawValue : rawValue.split(',');
      raw[key] = value.length <= 1 ? value[0].trim() : value.map(v => v.trim());
    });
    return raw;
  }
  return null;
}

function mergeHeaders(headers1, headers2) {
  const rawHeaders1 = getRaw(headers1);
  const rawHeaders2 = getRaw(headers2);
  const res = {};

  if (!rawHeaders1 || !rawHeaders2) {
    return rawHeaders1 || rawHeaders2;
  }

  const keys = Object.keys(rawHeaders1);

  keys.forEach((key) => {
    const value = rawHeaders1[key];
    res[key] = Array.isArray(value) ? [...value] : value;
  });

  const keys2 = Object.keys(rawHeaders2);

  keys2.forEach((key) => {
    const value = rawHeaders2[key];
    res[key] = Array.isArray(value) ? [...value] : value;
  });

  return res;
}

export default function mergeOptions(...args) {
  let res = {};

  args.forEach((arg) => {
    /* istanbul ignore else  */
    if (arg) {
      const currentRes = Object.assign({}, res, arg);
      if (arg.headers) {
        currentRes.headers = mergeHeaders(res.headers, arg.headers);
      }
      res = currentRes;
    }
  });

  return res;
}
