import merge from './merge_options';

const INTERNALS = Symbol('Handy Fetch - Fetcher Internals');
const CHAIN_INTERNALS = Symbol('Handy Fetch - Chain Info');
const RESERVED_NAMES = ['use', 'alias', 'clone'];

function applyFilter({
  filter, value, extras, plugins, each,
}) {
  let val = value;
  for (let i = 0, l = plugins.length; i < l; i += 1) {
    const theFilter = plugins[i][filter];
    if (theFilter) {
      val = theFilter(val, extras);
      if (typeof each === 'function') {
        val = each(val);
      }
    }
  }
  return val;
}

function preProcessChain(chainInfo, plugins) {
  const result = [...chainInfo];
  let i = 0;
  let l = result.length;
  while (i < l) {
    const name = result[i].method;
    const { getChain } = plugins[name];
    if (getChain) {
      const chain = getChain();
      const newChainInfo = chain ? chain[CHAIN_INTERNALS].chainInfo : chain;
      if (newChainInfo) {
        result.splice(i, 1, ...(name === 'default' ? newChainInfo : newChainInfo.slice(1)));
        l = result.length;
      }
      if (newChainInfo === null || (newChainInfo.length && newChainInfo[0].method === name)) {
        i += 1;
      }
    } else {
      i += 1;
    }
  }
  return result;
}

function eachOption(options) {
  if (options instanceof Array) {
    return merge(...options);
  }
  return options;
}

function applyPlugins(url, options, defaultOptions, fetcher, plugins) {
  const opt = applyFilter({
    filter: 'onOptions', value: options, extras: { defaultOptions }, plugins, each: eachOption,
  });

  return applyFilter({
    filter: 'onReturn',
    value: fetcher(url, opt),
    extras: { options: opt, defaultOptions },
    plugins,
  });
}

function getApplicablePlugins(chainInfo, plugins) {
  const applicablePlugins = [];
  for (let i = 0, l = chainInfo.length; i < l; i += 1) {
    applicablePlugins.push(plugins[chainInfo[i].method]);
  }
  return applicablePlugins;
}

function checkReservedNames(name) {
  if (RESERVED_NAMES.indexOf(name) > -1) {
    throw new Error(`'${name}' is a reserved name`);
  }
}

function checkNameAvailability(chain, name, replace) {
  if (name in chain) {
    if (!replace) {
      throw new Error(`${name} already exists`);
    } else {
      replace();
    }
  }
}

function enqueuePlugin(name, chainInfo) {
  chainInfo.push({ method: name });
  return chainInfo;
}

function chainClone(shallow) {
  const { chainInfo, fetch } = this[CHAIN_INTERNALS];
  // clone as soon as possible
  const clonedChainInfo = [...chainInfo];
  if (shallow) {
    return {
      [CHAIN_INTERNALS]: {
        get chainInfo() { return clonedChainInfo; },
      },
    };
  }
  /* eslint-disable-next-line no-use-before-define */
  return createChain(fetch, fetch[INTERNALS].defaultOptions, chainInfo);
}

function defineHelpers(chain, helpers, fetcher, defaultOptions) {
  for (let i = 0, l = helpers.length; i < l; i += 1) {
    const name = helpers[i];
    Object.defineProperty(chain, name, {
      configurable: true,
      get() {
        /* eslint-disable-next-line no-use-before-define */
        return createChain(
          fetcher,
          defaultOptions,
          enqueuePlugin(name, [...chain[CHAIN_INTERNALS].chainInfo]),
        );
      },
    });
  }
}

function chainUse(plugin, { name, replace } = {}) {
  const chain = this;
  const { fetch } = chain[CHAIN_INTERNALS];
  const { plugins, pluginsList, defaultOptions } = fetch[INTERNALS];
  const thePlugin = plugin({ fetch: chain });
  const theName = name || thePlugin.name;

  checkReservedNames(theName);
  checkNameAvailability(
    chain,
    theName,
    replace && (() => pluginsList.splice(pluginsList.indexOf(theName), 1)),
  );

  plugins[theName] = thePlugin;
  pluginsList.push(theName);

  if (thePlugin.helper !== false) {
    defineHelpers(
      chain,
      [theName],
      fetch,
      defaultOptions,
    );
  }

  return chain;
}

function chainAlias(alias, targetChain, replace) {
  const clonedTargetChain = targetChain.clone(true);
  this.use(() => ({
    name: alias,
    getChain: () => clonedTargetChain,
  }), { replace });
  return this;
}

function createChain(fetch, defaultOptions, chainInfo = []) {
  const iChainInfo = [...chainInfo];
  const hasInternals = (INTERNALS in fetch);
  // wrap fetch to avoid modifying arguments
  const theFetch = hasInternals ? fetch : (url, options) => fetch(url, options);

  const { plugins, pluginsList } = hasInternals
    ? fetch[INTERNALS]
    : theFetch[INTERNALS] = { plugins: {}, pluginsList: [], defaultOptions };

  const chain = (url, options) => {
    const pChainInfo = preProcessChain(iChainInfo, plugins);
    const applicablePlugins = getApplicablePlugins(pChainInfo, plugins);
    return applyPlugins(url, options, defaultOptions, fetch, applicablePlugins);
  };

  chain[CHAIN_INTERNALS] = {
    get chainInfo() { return iChainInfo; },
    get fetch() { return theFetch; },
  };

  chain.clone = chainClone;
  chain.use = chainUse;
  chain.alias = chainAlias;

  if (iChainInfo.length === 0) {
    enqueuePlugin('default', iChainInfo);
  }

  if (!('default' in plugins)) {
    chain.alias('default', chain);
  }

  defineHelpers(
    chain,
    pluginsList.filter((name) => plugins[name].helper !== false),
    fetch,
    defaultOptions,
  );

  return chain;
}

const createFetcher = (fetch, defaultOptions) => createChain(fetch, defaultOptions);

export default createFetcher;
