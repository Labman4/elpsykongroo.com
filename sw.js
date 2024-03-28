try {
  self["workbox:core:7.0.0"] && _();
} catch {
}
const Ut = {
  "invalid-value": ({ paramName: t, validValueDescription: e, value: n }) => {
    if (!t || !e)
      throw new Error("Unexpected input to 'invalid-value' error.");
    return `The '${t}' parameter was given a value with an unexpected value. ${e} Received a value of ${JSON.stringify(n)}.`;
  },
  "not-an-array": ({ moduleName: t, className: e, funcName: n, paramName: r }) => {
    if (!t || !e || !n || !r)
      throw new Error("Unexpected input to 'not-an-array' error.");
    return `The parameter '${r}' passed into '${t}.${e}.${n}()' must be an array.`;
  },
  "incorrect-type": ({ expectedType: t, paramName: e, moduleName: n, className: r, funcName: o }) => {
    if (!t || !e || !n || !o)
      throw new Error("Unexpected input to 'incorrect-type' error.");
    const s = r ? `${r}.` : "";
    return `The parameter '${e}' passed into '${n}.${s}${o}()' must be of type ${t}.`;
  },
  "incorrect-class": ({ expectedClassName: t, paramName: e, moduleName: n, className: r, funcName: o, isReturnValueProblem: s }) => {
    if (!t || !n || !o)
      throw new Error("Unexpected input to 'incorrect-class' error.");
    const a = r ? `${r}.` : "";
    return s ? `The return value from '${n}.${a}${o}()' must be an instance of class ${t}.` : `The parameter '${e}' passed into '${n}.${a}${o}()' must be an instance of class ${t}.`;
  },
  "missing-a-method": ({ expectedMethod: t, paramName: e, moduleName: n, className: r, funcName: o }) => {
    if (!t || !e || !n || !r || !o)
      throw new Error("Unexpected input to 'missing-a-method' error.");
    return `${n}.${r}.${o}() expected the '${e}' parameter to expose a '${t}' method.`;
  },
  "add-to-cache-list-unexpected-type": ({ entry: t }) => `An unexpected entry was passed to 'workbox-precaching.PrecacheController.addToCacheList()' The entry '${JSON.stringify(t)}' isn't supported. You must supply an array of strings with one or more characters, objects with a url property or Request objects.`,
  "add-to-cache-list-conflicting-entries": ({ firstEntry: t, secondEntry: e }) => {
    if (!t || !e)
      throw new Error("Unexpected input to 'add-to-cache-list-duplicate-entries' error.");
    return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${t} but different revision details. Workbox is unable to cache and version the asset correctly. Please remove one of the entries.`;
  },
  "plugin-error-request-will-fetch": ({ thrownErrorMessage: t }) => {
    if (!t)
      throw new Error("Unexpected input to 'plugin-error-request-will-fetch', error.");
    return `An error was thrown by a plugins 'requestWillFetch()' method. The thrown error message was: '${t}'.`;
  },
  "invalid-cache-name": ({ cacheNameId: t, value: e }) => {
    if (!t)
      throw new Error("Expected a 'cacheNameId' for error 'invalid-cache-name'");
    return `You must provide a name containing at least one character for setCacheDetails({${t}: '...'}). Received a value of '${JSON.stringify(e)}'`;
  },
  "unregister-route-but-not-found-with-method": ({ method: t }) => {
    if (!t)
      throw new Error("Unexpected input to 'unregister-route-but-not-found-with-method' error.");
    return `The route you're trying to unregister was not  previously registered for the method type '${t}'.`;
  },
  "unregister-route-route-not-registered": () => "The route you're trying to unregister was not previously registered.",
  "queue-replay-failed": ({ name: t }) => `Replaying the background sync queue '${t}' failed.`,
  "duplicate-queue-name": ({ name: t }) => `The Queue name '${t}' is already being used. All instances of backgroundSync.Queue must be given unique names.`,
  "expired-test-without-max-age": ({ methodName: t, paramName: e }) => `The '${t}()' method can only be used when the '${e}' is used in the constructor.`,
  "unsupported-route-type": ({ moduleName: t, className: e, funcName: n, paramName: r }) => `The supplied '${r}' parameter was an unsupported type. Please check the docs for ${t}.${e}.${n} for valid input types.`,
  "not-array-of-class": ({ value: t, expectedClass: e, moduleName: n, className: r, funcName: o, paramName: s }) => `The supplied '${s}' parameter must be an array of '${e}' objects. Received '${JSON.stringify(t)},'. Please check the call to ${n}.${r}.${o}() to fix the issue.`,
  "max-entries-or-age-required": ({ moduleName: t, className: e, funcName: n }) => `You must define either config.maxEntries or config.maxAgeSecondsin ${t}.${e}.${n}`,
  "statuses-or-headers-required": ({ moduleName: t, className: e, funcName: n }) => `You must define either config.statuses or config.headersin ${t}.${e}.${n}`,
  "invalid-string": ({ moduleName: t, funcName: e, paramName: n }) => {
    if (!n || !t || !e)
      throw new Error("Unexpected input to 'invalid-string' error.");
    return `When using strings, the '${n}' parameter must start with 'http' (for cross-origin matches) or '/' (for same-origin matches). Please see the docs for ${t}.${e}() for more info.`;
  },
  "channel-name-required": () => "You must provide a channelName to construct a BroadcastCacheUpdate instance.",
  "invalid-responses-are-same-args": () => "The arguments passed into responsesAreSame() appear to be invalid. Please ensure valid Responses are used.",
  "expire-custom-caches-only": () => "You must provide a 'cacheName' property when using the expiration plugin with a runtime caching strategy.",
  "unit-must-be-bytes": ({ normalizedRangeHeader: t }) => {
    if (!t)
      throw new Error("Unexpected input to 'unit-must-be-bytes' error.");
    return `The 'unit' portion of the Range header must be set to 'bytes'. The Range header provided was "${t}"`;
  },
  "single-range-only": ({ normalizedRangeHeader: t }) => {
    if (!t)
      throw new Error("Unexpected input to 'single-range-only' error.");
    return `Multiple ranges are not supported. Please use a  single start value, and optional end value. The Range header provided was "${t}"`;
  },
  "invalid-range-values": ({ normalizedRangeHeader: t }) => {
    if (!t)
      throw new Error("Unexpected input to 'invalid-range-values' error.");
    return `The Range header is missing both start and end values. At least one of those values is needed. The Range header provided was "${t}"`;
  },
  "no-range-header": () => "No Range header was found in the Request provided.",
  "range-not-satisfiable": ({ size: t, start: e, end: n }) => `The start (${e}) and end (${n}) values in the Range are not satisfiable by the cached response, which is ${t} bytes.`,
  "attempt-to-cache-non-get-request": ({ url: t, method: e }) => `Unable to cache '${t}' because it is a '${e}' request and only 'GET' requests can be cached.`,
  "cache-put-with-no-response": ({ url: t }) => `There was an attempt to cache '${t}' but the response was not defined.`,
  "no-response": ({ url: t, error: e }) => {
    let n = `The strategy could not generate a response for '${t}'.`;
    return e && (n += ` The underlying error is ${e}.`), n;
  },
  "bad-precaching-response": ({ url: t, status: e }) => `The precaching request for '${t}' failed` + (e ? ` with an HTTP status of ${e}.` : "."),
  "non-precached-url": ({ url: t }) => `createHandlerBoundToURL('${t}') was called, but that URL is not precached. Please pass in a URL that is precached instead.`,
  "add-to-cache-list-conflicting-integrities": ({ url: t }) => `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${t} with different integrity values. Please remove one of them.`,
  "missing-precache-entry": ({ cacheName: t, url: e }) => `Unable to find a precached response in ${t} for ${e}.`,
  "cross-origin-copy-response": ({ origin: t }) => `workbox-core.copyResponse() can only be used with same-origin responses. It was passed a response with origin ${t}.`,
  "opaque-streams-source": ({ type: t }) => {
    const e = `One of the workbox-streams sources resulted in an '${t}' response.`;
    return t === "opaqueredirect" ? `${e} Please do not use a navigation request that results in a redirect as a source.` : `${e} Please ensure your sources are CORS-enabled.`;
  }
}, Vt = (t, ...e) => {
  let n = t;
  return e.length > 0 && (n += ` :: ${JSON.stringify(e)}`), n;
}, jt = (t, e = {}) => {
  const n = Ut[t];
  if (!n)
    throw new Error(`Unable to find message for code '${t}'.`);
  return n(e);
}, Ft = {}.NODE_ENV === "production" ? Vt : jt;
class p extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(e, n) {
    const r = Ft(e, n);
    super(r), this.name = e, this.details = n;
  }
}
const Ht = (t, e) => {
  if (!Array.isArray(t))
    throw new p("not-an-array", e);
}, Kt = (t, e, n) => {
  if (typeof t[e] !== "function")
    throw n.expectedMethod = e, new p("missing-a-method", n);
}, qt = (t, e, n) => {
  if (typeof t !== e)
    throw n.expectedType = e, new p("incorrect-type", n);
}, Wt = (t, e, n) => {
  if (!(t instanceof e))
    throw n.expectedClassName = e.name, new p("incorrect-class", n);
}, Gt = (t, e, n) => {
  if (!e.includes(t))
    throw n.validValueDescription = `Valid values are ${JSON.stringify(e)}.`, new p("invalid-value", n);
}, zt = (t, e, n) => {
  const r = new p("not-array-of-class", n);
  if (!Array.isArray(t))
    throw r;
  for (const o of t)
    if (!(o instanceof e))
      throw r;
}, b = {}.NODE_ENV === "production" ? null : {
  hasMethod: Kt,
  isArray: Ht,
  isInstance: Wt,
  isOneOf: Gt,
  isType: qt,
  isArrayOfClass: zt
}, C = {
  googleAnalytics: "googleAnalytics",
  precache: "precache-v2",
  prefix: "workbox",
  runtime: "runtime",
  suffix: typeof registration < "u" ? registration.scope : ""
}, re = (t) => [C.prefix, t, C.suffix].filter((e) => e && e.length > 0).join("-"), Jt = (t) => {
  for (const e of Object.keys(C))
    t(e);
}, Y = {
  updateDetails: (t) => {
    Jt((e) => {
      typeof t[e] == "string" && (C[e] = t[e]);
    });
  },
  getGoogleAnalyticsName: (t) => t || re(C.googleAnalytics),
  getPrecacheName: (t) => t || re(C.precache),
  getPrefix: () => C.prefix,
  getRuntimeName: (t) => t || re(C.runtime),
  getSuffix: () => C.suffix
}, u = {}.NODE_ENV === "production" ? null : (() => {
  "__WB_DISABLE_DEV_LOGS" in globalThis || (self.__WB_DISABLE_DEV_LOGS = !1);
  let t = !1;
  const e = {
    debug: "#7f8c8d",
    log: "#2ecc71",
    warn: "#f39c12",
    error: "#c0392b",
    groupCollapsed: "#3498db",
    groupEnd: null
    // No colored prefix on groupEnd
  }, n = function(s, a) {
    if (self.__WB_DISABLE_DEV_LOGS)
      return;
    if (s === "groupCollapsed" && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      console[s](...a);
      return;
    }
    const i = [
      `background: ${e[s]}`,
      "border-radius: 0.5em",
      "color: white",
      "font-weight: bold",
      "padding: 2px 0.5em"
    ], c = t ? [] : ["%cworkbox", i.join(";")];
    console[s](...c, ...a), s === "groupCollapsed" && (t = !0), s === "groupEnd" && (t = !1);
  }, r = {}, o = Object.keys(e);
  for (const s of o) {
    const a = s;
    r[a] = (...i) => {
      n(a, i);
    };
  }
  return r;
})();
function Be(t, e) {
  const n = e();
  return t.waitUntil(n), n;
}
try {
  self["workbox:precaching:7.0.0"] && _();
} catch {
}
const Yt = "__WB_REVISION__";
function Xt(t) {
  if (!t)
    throw new p("add-to-cache-list-unexpected-type", { entry: t });
  if (typeof t == "string") {
    const s = new URL(t, location.href);
    return {
      cacheKey: s.href,
      url: s.href
    };
  }
  const { revision: e, url: n } = t;
  if (!n)
    throw new p("add-to-cache-list-unexpected-type", { entry: t });
  if (!e) {
    const s = new URL(n, location.href);
    return {
      cacheKey: s.href,
      url: s.href
    };
  }
  const r = new URL(n, location.href), o = new URL(n, location.href);
  return r.searchParams.set(Yt, e), {
    cacheKey: r.href,
    url: o.href
  };
}
class Qt {
  constructor() {
    this.updatedURLs = [], this.notUpdatedURLs = [], this.handlerWillStart = async ({ request: e, state: n }) => {
      n && (n.originalRequest = e);
    }, this.cachedResponseWillBeUsed = async ({ event: e, state: n, cachedResponse: r }) => {
      if (e.type === "install" && n && n.originalRequest && n.originalRequest instanceof Request) {
        const o = n.originalRequest.url;
        r ? this.notUpdatedURLs.push(o) : this.updatedURLs.push(o);
      }
      return r;
    };
  }
}
class Zt {
  constructor({ precacheController: e }) {
    this.cacheKeyWillBeUsed = async ({ request: n, params: r }) => {
      const o = (r == null ? void 0 : r.cacheKey) || this._precacheController.getCacheKeyForURL(n.url);
      return o ? new Request(o, { headers: n.headers }) : n;
    }, this._precacheController = e;
  }
}
const en = (t, e) => {
  u.groupCollapsed(t);
  for (const n of e)
    u.log(n);
  u.groupEnd();
};
function tn(t) {
  const e = t.length;
  e > 0 && (u.groupCollapsed(`During precaching cleanup, ${e} cached request${e === 1 ? " was" : "s were"} deleted.`), en("Deleted Cache Requests", t), u.groupEnd());
}
function Ue(t, e) {
  if (e.length !== 0) {
    u.groupCollapsed(t);
    for (const n of e)
      u.log(n);
    u.groupEnd();
  }
}
function nn(t, e) {
  const n = t.length, r = e.length;
  if (n || r) {
    let o = `Precaching ${n} file${n === 1 ? "" : "s"}.`;
    r > 0 && (o += ` ${r} file${r === 1 ? " is" : "s are"} already cached.`), u.groupCollapsed(o), Ue("View newly precached URLs.", t), Ue("View previously precached URLs.", e), u.groupEnd();
  }
}
let U;
function rn() {
  if (U === void 0) {
    const t = new Response("");
    if ("body" in t)
      try {
        new Response(t.body), U = !0;
      } catch {
        U = !1;
      }
    U = !1;
  }
  return U;
}
async function on(t, e) {
  let n = null;
  if (t.url && (n = new URL(t.url).origin), n !== self.location.origin)
    throw new p("cross-origin-copy-response", { origin: n });
  const r = t.clone(), o = {
    headers: new Headers(r.headers),
    status: r.status,
    statusText: r.statusText
  }, s = e ? e(o) : o, a = rn() ? r.body : await r.blob();
  return new Response(a, s);
}
const g = (t) => new URL(String(t), location.href).href.replace(new RegExp(`^${location.origin}`), "");
function Ve(t, e) {
  const n = new URL(t);
  for (const r of e)
    n.searchParams.delete(r);
  return n.href;
}
async function sn(t, e, n, r) {
  const o = Ve(e.url, n);
  if (e.url === o)
    return t.match(e, r);
  const s = Object.assign(Object.assign({}, r), { ignoreSearch: !0 }), a = await t.keys(e, s);
  for (const i of a) {
    const c = Ve(i.url, n);
    if (o === c)
      return t.match(i, r);
  }
}
let an = class {
  /**
   * Creates a promise and exposes its resolve and reject functions as methods.
   */
  constructor() {
    this.promise = new Promise((e, n) => {
      this.resolve = e, this.reject = n;
    });
  }
};
const je = /* @__PURE__ */ new Set();
async function cn() {
  ({}).NODE_ENV !== "production" && u.log(`About to run ${je.size} callbacks to clean up caches.`);
  for (const t of je)
    await t(), {}.NODE_ENV !== "production" && u.log(t, "is complete.");
  ({}).NODE_ENV !== "production" && u.log("Finished running callbacks.");
}
function un(t) {
  return new Promise((e) => setTimeout(e, t));
}
try {
  self["workbox:strategies:7.0.0"] && _();
} catch {
}
function K(t) {
  return typeof t == "string" ? new Request(t) : t;
}
class ln {
  /**
   * Creates a new instance associated with the passed strategy and event
   * that's handling the request.
   *
   * The constructor also initializes the state that will be passed to each of
   * the plugins handling this request.
   *
   * @param {workbox-strategies.Strategy} strategy
   * @param {Object} options
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params] The return value from the
   *     {@link workbox-routing~matchCallback} (if applicable).
   */
  constructor(e, n) {
    this._cacheKeys = {}, {}.NODE_ENV !== "production" && b.isInstance(n.event, ExtendableEvent, {
      moduleName: "workbox-strategies",
      className: "StrategyHandler",
      funcName: "constructor",
      paramName: "options.event"
    }), Object.assign(this, n), this.event = n.event, this._strategy = e, this._handlerDeferred = new an(), this._extendLifetimePromises = [], this._plugins = [...e.plugins], this._pluginStateMap = /* @__PURE__ */ new Map();
    for (const r of this._plugins)
      this._pluginStateMap.set(r, {});
    this.event.waitUntil(this._handlerDeferred.promise);
  }
  /**
   * Fetches a given request (and invokes any applicable plugin callback
   * methods) using the `fetchOptions` (for non-navigation requests) and
   * `plugins` defined on the `Strategy` object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - `requestWillFetch()`
   * - `fetchDidSucceed()`
   * - `fetchDidFail()`
   *
   * @param {Request|string} input The URL or request to fetch.
   * @return {Promise<Response>}
   */
  async fetch(e) {
    const { event: n } = this;
    let r = K(e);
    if (r.mode === "navigate" && n instanceof FetchEvent && n.preloadResponse) {
      const a = await n.preloadResponse;
      if (a)
        return {}.NODE_ENV !== "production" && u.log(`Using a preloaded navigation response for '${g(r.url)}'`), a;
    }
    const o = this.hasCallback("fetchDidFail") ? r.clone() : null;
    try {
      for (const a of this.iterateCallbacks("requestWillFetch"))
        r = await a({ request: r.clone(), event: n });
    } catch (a) {
      if (a instanceof Error)
        throw new p("plugin-error-request-will-fetch", {
          thrownErrorMessage: a.message
        });
    }
    const s = r.clone();
    try {
      let a;
      a = await fetch(r, r.mode === "navigate" ? void 0 : this._strategy.fetchOptions), {}.NODE_ENV !== "production" && u.debug(`Network request for '${g(r.url)}' returned a response with status '${a.status}'.`);
      for (const i of this.iterateCallbacks("fetchDidSucceed"))
        a = await i({
          event: n,
          request: s,
          response: a
        });
      return a;
    } catch (a) {
      throw {}.NODE_ENV !== "production" && u.log(`Network request for '${g(r.url)}' threw an error.`, a), o && await this.runCallbacks("fetchDidFail", {
        error: a,
        event: n,
        originalRequest: o.clone(),
        request: s.clone()
      }), a;
    }
  }
  /**
   * Calls `this.fetch()` and (in the background) runs `this.cachePut()` on
   * the response generated by `this.fetch()`.
   *
   * The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
   * so you do not have to manually call `waitUntil()` on the event.
   *
   * @param {Request|string} input The request or URL to fetch and cache.
   * @return {Promise<Response>}
   */
  async fetchAndCachePut(e) {
    const n = await this.fetch(e), r = n.clone();
    return this.waitUntil(this.cachePut(e, r)), n;
  }
  /**
   * Matches a request from the cache (and invokes any applicable plugin
   * callback methods) using the `cacheName`, `matchOptions`, and `plugins`
   * defined on the strategy object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - cacheKeyWillByUsed()
   * - cachedResponseWillByUsed()
   *
   * @param {Request|string} key The Request or URL to use as the cache key.
   * @return {Promise<Response|undefined>} A matching response, if found.
   */
  async cacheMatch(e) {
    const n = K(e);
    let r;
    const { cacheName: o, matchOptions: s } = this._strategy, a = await this.getCacheKey(n, "read"), i = Object.assign(Object.assign({}, s), { cacheName: o });
    r = await caches.match(a, i), {}.NODE_ENV !== "production" && (r ? u.debug(`Found a cached response in '${o}'.`) : u.debug(`No cached response found in '${o}'.`));
    for (const c of this.iterateCallbacks("cachedResponseWillBeUsed"))
      r = await c({
        cacheName: o,
        matchOptions: s,
        cachedResponse: r,
        request: a,
        event: this.event
      }) || void 0;
    return r;
  }
  /**
   * Puts a request/response pair in the cache (and invokes any applicable
   * plugin callback methods) using the `cacheName` and `plugins` defined on
   * the strategy object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - cacheKeyWillByUsed()
   * - cacheWillUpdate()
   * - cacheDidUpdate()
   *
   * @param {Request|string} key The request or URL to use as the cache key.
   * @param {Response} response The response to cache.
   * @return {Promise<boolean>} `false` if a cacheWillUpdate caused the response
   * not be cached, and `true` otherwise.
   */
  async cachePut(e, n) {
    const r = K(e);
    await un(0);
    const o = await this.getCacheKey(r, "write");
    if ({}.NODE_ENV !== "production") {
      if (o.method && o.method !== "GET")
        throw new p("attempt-to-cache-non-get-request", {
          url: g(o.url),
          method: o.method
        });
      const d = n.headers.get("Vary");
      d && u.debug(`The response for ${g(o.url)} has a 'Vary: ${d}' header. Consider setting the {ignoreVary: true} option on your strategy to ensure cache matching and deletion works as expected.`);
    }
    if (!n)
      throw {}.NODE_ENV !== "production" && u.error(`Cannot cache non-existent response for '${g(o.url)}'.`), new p("cache-put-with-no-response", {
        url: g(o.url)
      });
    const s = await this._ensureResponseSafeToCache(n);
    if (!s)
      return {}.NODE_ENV !== "production" && u.debug(`Response '${g(o.url)}' will not be cached.`, s), !1;
    const { cacheName: a, matchOptions: i } = this._strategy, c = await self.caches.open(a), h = this.hasCallback("cacheDidUpdate"), l = h ? await sn(
      // TODO(philipwalton): the `__WB_REVISION__` param is a precaching
      // feature. Consider into ways to only add this behavior if using
      // precaching.
      c,
      o.clone(),
      ["__WB_REVISION__"],
      i
    ) : null;
    ({}).NODE_ENV !== "production" && u.debug(`Updating the '${a}' cache with a new Response for ${g(o.url)}.`);
    try {
      await c.put(o, h ? s.clone() : s);
    } catch (d) {
      if (d instanceof Error)
        throw d.name === "QuotaExceededError" && await cn(), d;
    }
    for (const d of this.iterateCallbacks("cacheDidUpdate"))
      await d({
        cacheName: a,
        oldResponse: l,
        newResponse: s.clone(),
        request: o,
        event: this.event
      });
    return !0;
  }
  /**
   * Checks the list of plugins for the `cacheKeyWillBeUsed` callback, and
   * executes any of those callbacks found in sequence. The final `Request`
   * object returned by the last plugin is treated as the cache key for cache
   * reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
   * been registered, the passed request is returned unmodified
   *
   * @param {Request} request
   * @param {string} mode
   * @return {Promise<Request>}
   */
  async getCacheKey(e, n) {
    const r = `${e.url} | ${n}`;
    if (!this._cacheKeys[r]) {
      let o = e;
      for (const s of this.iterateCallbacks("cacheKeyWillBeUsed"))
        o = K(await s({
          mode: n,
          request: o,
          event: this.event,
          // params has a type any can't change right now.
          params: this.params
          // eslint-disable-line
        }));
      this._cacheKeys[r] = o;
    }
    return this._cacheKeys[r];
  }
  /**
   * Returns true if the strategy has at least one plugin with the given
   * callback.
   *
   * @param {string} name The name of the callback to check for.
   * @return {boolean}
   */
  hasCallback(e) {
    for (const n of this._strategy.plugins)
      if (e in n)
        return !0;
    return !1;
  }
  /**
   * Runs all plugin callbacks matching the given name, in order, passing the
   * given param object (merged ith the current plugin state) as the only
   * argument.
   *
   * Note: since this method runs all plugins, it's not suitable for cases
   * where the return value of a callback needs to be applied prior to calling
   * the next callback. See
   * {@link workbox-strategies.StrategyHandler#iterateCallbacks}
   * below for how to handle that case.
   *
   * @param {string} name The name of the callback to run within each plugin.
   * @param {Object} param The object to pass as the first (and only) param
   *     when executing each callback. This object will be merged with the
   *     current plugin state prior to callback execution.
   */
  async runCallbacks(e, n) {
    for (const r of this.iterateCallbacks(e))
      await r(n);
  }
  /**
   * Accepts a callback and returns an iterable of matching plugin callbacks,
   * where each callback is wrapped with the current handler state (i.e. when
   * you call each callback, whatever object parameter you pass it will
   * be merged with the plugin's current state).
   *
   * @param {string} name The name fo the callback to run
   * @return {Array<Function>}
   */
  *iterateCallbacks(e) {
    for (const n of this._strategy.plugins)
      if (typeof n[e] == "function") {
        const r = this._pluginStateMap.get(n);
        yield (s) => {
          const a = Object.assign(Object.assign({}, s), { state: r });
          return n[e](a);
        };
      }
  }
  /**
   * Adds a promise to the
   * [extend lifetime promises]{@link https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises}
   * of the event event associated with the request being handled (usually a
   * `FetchEvent`).
   *
   * Note: you can await
   * {@link workbox-strategies.StrategyHandler~doneWaiting}
   * to know when all added promises have settled.
   *
   * @param {Promise} promise A promise to add to the extend lifetime promises
   *     of the event that triggered the request.
   */
  waitUntil(e) {
    return this._extendLifetimePromises.push(e), e;
  }
  /**
   * Returns a promise that resolves once all promises passed to
   * {@link workbox-strategies.StrategyHandler~waitUntil}
   * have settled.
   *
   * Note: any work done after `doneWaiting()` settles should be manually
   * passed to an event's `waitUntil()` method (not this handler's
   * `waitUntil()` method), otherwise the service worker thread my be killed
   * prior to your work completing.
   */
  async doneWaiting() {
    let e;
    for (; e = this._extendLifetimePromises.shift(); )
      await e;
  }
  /**
   * Stops running the strategy and immediately resolves any pending
   * `waitUntil()` promises.
   */
  destroy() {
    this._handlerDeferred.resolve(null);
  }
  /**
   * This method will call cacheWillUpdate on the available plugins (or use
   * status === 200) to determine if the Response is safe and valid to cache.
   *
   * @param {Request} options.request
   * @param {Response} options.response
   * @return {Promise<Response|undefined>}
   *
   * @private
   */
  async _ensureResponseSafeToCache(e) {
    let n = e, r = !1;
    for (const o of this.iterateCallbacks("cacheWillUpdate"))
      if (n = await o({
        request: this.request,
        response: n,
        event: this.event
      }) || void 0, r = !0, !n)
        break;
    return r || (n && n.status !== 200 && (n = void 0), {}.NODE_ENV !== "production" && n && n.status !== 200 && (n.status === 0 ? u.warn(`The response for '${this.request.url}' is an opaque response. The caching strategy that you're using will not cache opaque responses by default.`) : u.debug(`The response for '${this.request.url}' returned a status code of '${e.status}' and won't be cached as a result.`))), n;
  }
}
class hn {
  /**
   * Creates a new instance of the strategy and sets all documented option
   * properties as public instance properties.
   *
   * Note: if a custom strategy class extends the base Strategy class and does
   * not need more than these properties, it does not need to define its own
   * constructor.
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to the cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {Object} [options.matchOptions] The
   * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
   * for any `cache.match()` or `cache.put()` calls made by this strategy.
   */
  constructor(e = {}) {
    this.cacheName = Y.getRuntimeName(e.cacheName), this.plugins = e.plugins || [], this.fetchOptions = e.fetchOptions, this.matchOptions = e.matchOptions;
  }
  /**
   * Perform a request strategy and returns a `Promise` that will resolve with
   * a `Response`, invoking all relevant plugin callbacks.
   *
   * When a strategy instance is registered with a Workbox
   * {@link workbox-routing.Route}, this method is automatically
   * called when the route matches.
   *
   * Alternatively, this method can be used in a standalone `FetchEvent`
   * listener by passing it to `event.respondWith()`.
   *
   * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
   *     properties listed below.
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params]
   */
  handle(e) {
    const [n] = this.handleAll(e);
    return n;
  }
  /**
   * Similar to {@link workbox-strategies.Strategy~handle}, but
   * instead of just returning a `Promise` that resolves to a `Response` it
   * it will return an tuple of `[response, done]` promises, where the former
   * (`response`) is equivalent to what `handle()` returns, and the latter is a
   * Promise that will resolve once any promises that were added to
   * `event.waitUntil()` as part of performing the strategy have completed.
   *
   * You can await the `done` promise to ensure any extra work performed by
   * the strategy (usually caching responses) completes successfully.
   *
   * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
   *     properties listed below.
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params]
   * @return {Array<Promise>} A tuple of [response, done]
   *     promises that can be used to determine when the response resolves as
   *     well as when the handler has completed all its work.
   */
  handleAll(e) {
    e instanceof FetchEvent && (e = {
      event: e,
      request: e.request
    });
    const n = e.event, r = typeof e.request == "string" ? new Request(e.request) : e.request, o = "params" in e ? e.params : void 0, s = new ln(this, { event: n, request: r, params: o }), a = this._getResponse(s, r, n), i = this._awaitComplete(a, s, r, n);
    return [a, i];
  }
  async _getResponse(e, n, r) {
    await e.runCallbacks("handlerWillStart", { event: r, request: n });
    let o;
    try {
      if (o = await this._handle(n, e), !o || o.type === "error")
        throw new p("no-response", { url: n.url });
    } catch (s) {
      if (s instanceof Error) {
        for (const a of e.iterateCallbacks("handlerDidError"))
          if (o = await a({ error: s, event: r, request: n }), o)
            break;
      }
      if (o)
        ({}).NODE_ENV !== "production" && u.log(`While responding to '${g(n.url)}', an ${s instanceof Error ? s.toString() : ""} error occurred. Using a fallback response provided by a handlerDidError plugin.`);
      else
        throw s;
    }
    for (const s of e.iterateCallbacks("handlerWillRespond"))
      o = await s({ event: r, request: n, response: o });
    return o;
  }
  async _awaitComplete(e, n, r, o) {
    let s, a;
    try {
      s = await e;
    } catch {
    }
    try {
      await n.runCallbacks("handlerDidRespond", {
        event: o,
        request: r,
        response: s
      }), await n.doneWaiting();
    } catch (i) {
      i instanceof Error && (a = i);
    }
    if (await n.runCallbacks("handlerDidComplete", {
      event: o,
      request: r,
      response: s,
      error: a
    }), n.destroy(), a)
      throw a;
  }
}
class I extends hn {
  /**
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to the cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] {@link https://developers.google.com/web/tools/workbox/guides/using-plugins|Plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
   * of all fetch() requests made by this strategy.
   * @param {Object} [options.matchOptions] The
   * {@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions|CacheQueryOptions}
   * for any `cache.match()` or `cache.put()` calls made by this strategy.
   * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
   * get the response from the network if there's a precache miss.
   */
  constructor(e = {}) {
    e.cacheName = Y.getPrecacheName(e.cacheName), super(e), this._fallbackToNetwork = e.fallbackToNetwork !== !1, this.plugins.push(I.copyRedirectedCacheableResponsesPlugin);
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(e, n) {
    const r = await n.cacheMatch(e);
    return r || (n.event && n.event.type === "install" ? await this._handleInstall(e, n) : await this._handleFetch(e, n));
  }
  async _handleFetch(e, n) {
    let r;
    const o = n.params || {};
    if (this._fallbackToNetwork) {
      ({}).NODE_ENV !== "production" && u.warn(`The precached response for ${g(e.url)} in ${this.cacheName} was not found. Falling back to the network.`);
      const s = o.integrity, a = e.integrity, i = !a || a === s;
      if (r = await n.fetch(new Request(e, {
        integrity: e.mode !== "no-cors" ? a || s : void 0
      })), s && i && e.mode !== "no-cors") {
        this._useDefaultCacheabilityPluginIfNeeded();
        const c = await n.cachePut(e, r.clone());
        ({}).NODE_ENV !== "production" && c && u.log(`A response for ${g(e.url)} was used to "repair" the precache.`);
      }
    } else
      throw new p("missing-precache-entry", {
        cacheName: this.cacheName,
        url: e.url
      });
    if ({}.NODE_ENV !== "production") {
      const s = o.cacheKey || await n.getCacheKey(e, "read");
      u.groupCollapsed("Precaching is responding to: " + g(e.url)), u.log(`Serving the precached url: ${g(s instanceof Request ? s.url : s)}`), u.groupCollapsed("View request details here."), u.log(e), u.groupEnd(), u.groupCollapsed("View response details here."), u.log(r), u.groupEnd(), u.groupEnd();
    }
    return r;
  }
  async _handleInstall(e, n) {
    this._useDefaultCacheabilityPluginIfNeeded();
    const r = await n.fetch(e);
    if (!await n.cachePut(e, r.clone()))
      throw new p("bad-precaching-response", {
        url: e.url,
        status: r.status
      });
    return r;
  }
  /**
   * This method is complex, as there a number of things to account for:
   *
   * The `plugins` array can be set at construction, and/or it might be added to
   * to at any time before the strategy is used.
   *
   * At the time the strategy is used (i.e. during an `install` event), there
   * needs to be at least one plugin that implements `cacheWillUpdate` in the
   * array, other than `copyRedirectedCacheableResponsesPlugin`.
   *
   * - If this method is called and there are no suitable `cacheWillUpdate`
   * plugins, we need to add `defaultPrecacheCacheabilityPlugin`.
   *
   * - If this method is called and there is exactly one `cacheWillUpdate`, then
   * we don't have to do anything (this might be a previously added
   * `defaultPrecacheCacheabilityPlugin`, or it might be a custom plugin).
   *
   * - If this method is called and there is more than one `cacheWillUpdate`,
   * then we need to check if one is `defaultPrecacheCacheabilityPlugin`. If so,
   * we need to remove it. (This situation is unlikely, but it could happen if
   * the strategy is used multiple times, the first without a `cacheWillUpdate`,
   * and then later on after manually adding a custom `cacheWillUpdate`.)
   *
   * See https://github.com/GoogleChrome/workbox/issues/2737 for more context.
   *
   * @private
   */
  _useDefaultCacheabilityPluginIfNeeded() {
    let e = null, n = 0;
    for (const [r, o] of this.plugins.entries())
      o !== I.copyRedirectedCacheableResponsesPlugin && (o === I.defaultPrecacheCacheabilityPlugin && (e = r), o.cacheWillUpdate && n++);
    n === 0 ? this.plugins.push(I.defaultPrecacheCacheabilityPlugin) : n > 1 && e !== null && this.plugins.splice(e, 1);
  }
}
I.defaultPrecacheCacheabilityPlugin = {
  async cacheWillUpdate({ response: t }) {
    return !t || t.status >= 400 ? null : t;
  }
};
I.copyRedirectedCacheableResponsesPlugin = {
  async cacheWillUpdate({ response: t }) {
    return t.redirected ? await on(t) : t;
  }
};
class dn {
  /**
   * Create a new PrecacheController.
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] The cache to use for precaching.
   * @param {string} [options.plugins] Plugins to use when precaching as well
   * as responding to fetch events for precached assets.
   * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
   * get the response from the network if there's a precache miss.
   */
  constructor({ cacheName: e, plugins: n = [], fallbackToNetwork: r = !0 } = {}) {
    this._urlsToCacheKeys = /* @__PURE__ */ new Map(), this._urlsToCacheModes = /* @__PURE__ */ new Map(), this._cacheKeysToIntegrities = /* @__PURE__ */ new Map(), this._strategy = new I({
      cacheName: Y.getPrecacheName(e),
      plugins: [
        ...n,
        new Zt({ precacheController: this })
      ],
      fallbackToNetwork: r
    }), this.install = this.install.bind(this), this.activate = this.activate.bind(this);
  }
  /**
   * @type {workbox-precaching.PrecacheStrategy} The strategy created by this controller and
   * used to cache assets and respond to fetch events.
   */
  get strategy() {
    return this._strategy;
  }
  /**
   * Adds items to the precache list, removing any duplicates and
   * stores the files in the
   * {@link workbox-core.cacheNames|"precache cache"} when the service
   * worker installs.
   *
   * This method can be called multiple times.
   *
   * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
   */
  precache(e) {
    this.addToCacheList(e), this._installAndActiveListenersAdded || (self.addEventListener("install", this.install), self.addEventListener("activate", this.activate), this._installAndActiveListenersAdded = !0);
  }
  /**
   * This method will add items to the precache list, removing duplicates
   * and ensuring the information is valid.
   *
   * @param {Array<workbox-precaching.PrecacheController.PrecacheEntry|string>} entries
   *     Array of entries to precache.
   */
  addToCacheList(e) {
    ({}).NODE_ENV !== "production" && b.isArray(e, {
      moduleName: "workbox-precaching",
      className: "PrecacheController",
      funcName: "addToCacheList",
      paramName: "entries"
    });
    const n = [];
    for (const r of e) {
      typeof r == "string" ? n.push(r) : r && r.revision === void 0 && n.push(r.url);
      const { cacheKey: o, url: s } = Xt(r), a = typeof r != "string" && r.revision ? "reload" : "default";
      if (this._urlsToCacheKeys.has(s) && this._urlsToCacheKeys.get(s) !== o)
        throw new p("add-to-cache-list-conflicting-entries", {
          firstEntry: this._urlsToCacheKeys.get(s),
          secondEntry: o
        });
      if (typeof r != "string" && r.integrity) {
        if (this._cacheKeysToIntegrities.has(o) && this._cacheKeysToIntegrities.get(o) !== r.integrity)
          throw new p("add-to-cache-list-conflicting-integrities", {
            url: s
          });
        this._cacheKeysToIntegrities.set(o, r.integrity);
      }
      if (this._urlsToCacheKeys.set(s, o), this._urlsToCacheModes.set(s, a), n.length > 0) {
        const i = `Workbox is precaching URLs without revision info: ${n.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
        ({}).NODE_ENV === "production" ? console.warn(i) : u.warn(i);
      }
    }
  }
  /**
   * Precaches new and updated assets. Call this method from the service worker
   * install event.
   *
   * Note: this method calls `event.waitUntil()` for you, so you do not need
   * to call it yourself in your event handlers.
   *
   * @param {ExtendableEvent} event
   * @return {Promise<workbox-precaching.InstallResult>}
   */
  install(e) {
    return Be(e, async () => {
      const n = new Qt();
      this.strategy.plugins.push(n);
      for (const [s, a] of this._urlsToCacheKeys) {
        const i = this._cacheKeysToIntegrities.get(a), c = this._urlsToCacheModes.get(s), h = new Request(s, {
          integrity: i,
          cache: c,
          credentials: "same-origin"
        });
        await Promise.all(this.strategy.handleAll({
          params: { cacheKey: a },
          request: h,
          event: e
        }));
      }
      const { updatedURLs: r, notUpdatedURLs: o } = n;
      return {}.NODE_ENV !== "production" && nn(r, o), { updatedURLs: r, notUpdatedURLs: o };
    });
  }
  /**
   * Deletes assets that are no longer present in the current precache manifest.
   * Call this method from the service worker activate event.
   *
   * Note: this method calls `event.waitUntil()` for you, so you do not need
   * to call it yourself in your event handlers.
   *
   * @param {ExtendableEvent} event
   * @return {Promise<workbox-precaching.CleanupResult>}
   */
  activate(e) {
    return Be(e, async () => {
      const n = await self.caches.open(this.strategy.cacheName), r = await n.keys(), o = new Set(this._urlsToCacheKeys.values()), s = [];
      for (const a of r)
        o.has(a.url) || (await n.delete(a), s.push(a.url));
      return {}.NODE_ENV !== "production" && tn(s), { deletedURLs: s };
    });
  }
  /**
   * Returns a mapping of a precached URL to the corresponding cache key, taking
   * into account the revision information for the URL.
   *
   * @return {Map<string, string>} A URL to cache key mapping.
   */
  getURLsToCacheKeys() {
    return this._urlsToCacheKeys;
  }
  /**
   * Returns a list of all the URLs that have been precached by the current
   * service worker.
   *
   * @return {Array<string>} The precached URLs.
   */
  getCachedURLs() {
    return [...this._urlsToCacheKeys.keys()];
  }
  /**
   * Returns the cache key used for storing a given URL. If that URL is
   * unversioned, like `/index.html', then the cache key will be the original
   * URL with a search parameter appended to it.
   *
   * @param {string} url A URL whose cache key you want to look up.
   * @return {string} The versioned URL that corresponds to a cache key
   * for the original URL, or undefined if that URL isn't precached.
   */
  getCacheKeyForURL(e) {
    const n = new URL(e, location.href);
    return this._urlsToCacheKeys.get(n.href);
  }
  /**
   * @param {string} url A cache key whose SRI you want to look up.
   * @return {string} The subresource integrity associated with the cache key,
   * or undefined if it's not set.
   */
  getIntegrityForCacheKey(e) {
    return this._cacheKeysToIntegrities.get(e);
  }
  /**
   * This acts as a drop-in replacement for
   * [`cache.match()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
   * with the following differences:
   *
   * - It knows what the name of the precache is, and only checks in that cache.
   * - It allows you to pass in an "original" URL without versioning parameters,
   * and it will automatically look up the correct cache key for the currently
   * active revision of that URL.
   *
   * E.g., `matchPrecache('index.html')` will find the correct precached
   * response for the currently active service worker, even if the actual cache
   * key is `'/index.html?__WB_REVISION__=1234abcd'`.
   *
   * @param {string|Request} request The key (without revisioning parameters)
   * to look up in the precache.
   * @return {Promise<Response|undefined>}
   */
  async matchPrecache(e) {
    const n = e instanceof Request ? e.url : e, r = this.getCacheKeyForURL(n);
    if (r)
      return (await self.caches.open(this.strategy.cacheName)).match(r);
  }
  /**
   * Returns a function that looks up `url` in the precache (taking into
   * account revision information), and returns the corresponding `Response`.
   *
   * @param {string} url The precached URL which will be used to lookup the
   * `Response`.
   * @return {workbox-routing~handlerCallback}
   */
  createHandlerBoundToURL(e) {
    const n = this.getCacheKeyForURL(e);
    if (!n)
      throw new p("non-precached-url", { url: e });
    return (r) => (r.request = new Request(e), r.params = Object.assign({ cacheKey: n }, r.params), this.strategy.handle(r));
  }
}
let oe;
const et = () => (oe || (oe = new dn()), oe);
try {
  self["workbox:routing:7.0.0"] && _();
} catch {
}
const tt = "GET", fn = [
  "DELETE",
  "GET",
  "HEAD",
  "PATCH",
  "POST",
  "PUT"
], q = (t) => t && typeof t == "object" ? ({}.NODE_ENV !== "production" && b.hasMethod(t, "handle", {
  moduleName: "workbox-routing",
  className: "Route",
  funcName: "constructor",
  paramName: "handler"
}), t) : ({}.NODE_ENV !== "production" && b.isType(t, "function", {
  moduleName: "workbox-routing",
  className: "Route",
  funcName: "constructor",
  paramName: "handler"
}), { handle: t });
class j {
  /**
   * Constructor for Route class.
   *
   * @param {workbox-routing~matchCallback} match
   * A callback function that determines whether the route matches a given
   * `fetch` event by returning a non-falsy value.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(e, n, r = tt) {
    ({}).NODE_ENV !== "production" && (b.isType(e, "function", {
      moduleName: "workbox-routing",
      className: "Route",
      funcName: "constructor",
      paramName: "match"
    }), r && b.isOneOf(r, fn, { paramName: "method" })), this.handler = q(n), this.match = e, this.method = r;
  }
  /**
   *
   * @param {workbox-routing-handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response
   */
  setCatchHandler(e) {
    this.catchHandler = q(e);
  }
}
class pn extends j {
  /**
   * If the regular expression contains
   * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
   * the captured values will be passed to the
   * {@link workbox-routing~handlerCallback} `params`
   * argument.
   *
   * @param {RegExp} regExp The regular expression to match against URLs.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(e, n, r) {
    ({}).NODE_ENV !== "production" && b.isInstance(e, RegExp, {
      moduleName: "workbox-routing",
      className: "RegExpRoute",
      funcName: "constructor",
      paramName: "pattern"
    });
    const o = ({ url: s }) => {
      const a = e.exec(s.href);
      if (a) {
        if (s.origin !== location.origin && a.index !== 0) {
          ({}).NODE_ENV !== "production" && u.debug(`The regular expression '${e.toString()}' only partially matched against the cross-origin URL '${s.toString()}'. RegExpRoute's will only handle cross-origin requests if they match the entire URL.`);
          return;
        }
        return a.slice(1);
      }
    };
    super(o, n, r);
  }
}
class gn {
  /**
   * Initializes a new Router.
   */
  constructor() {
    this._routes = /* @__PURE__ */ new Map(), this._defaultHandlerMap = /* @__PURE__ */ new Map();
  }
  /**
   * @return {Map<string, Array<workbox-routing.Route>>} routes A `Map` of HTTP
   * method name ('GET', etc.) to an array of all the corresponding `Route`
   * instances that are registered.
   */
  get routes() {
    return this._routes;
  }
  /**
   * Adds a fetch event listener to respond to events when a route matches
   * the event's request.
   */
  addFetchListener() {
    self.addEventListener("fetch", (e) => {
      const { request: n } = e, r = this.handleRequest({ request: n, event: e });
      r && e.respondWith(r);
    });
  }
  /**
   * Adds a message event listener for URLs to cache from the window.
   * This is useful to cache resources loaded on the page prior to when the
   * service worker started controlling it.
   *
   * The format of the message data sent from the window should be as follows.
   * Where the `urlsToCache` array may consist of URL strings or an array of
   * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
   *
   * ```
   * {
   *   type: 'CACHE_URLS',
   *   payload: {
   *     urlsToCache: [
   *       './script1.js',
   *       './script2.js',
   *       ['./script3.js', {mode: 'no-cors'}],
   *     ],
   *   },
   * }
   * ```
   */
  addCacheListener() {
    self.addEventListener("message", (e) => {
      if (e.data && e.data.type === "CACHE_URLS") {
        const { payload: n } = e.data;
        ({}).NODE_ENV !== "production" && u.debug("Caching URLs from the window", n.urlsToCache);
        const r = Promise.all(n.urlsToCache.map((o) => {
          typeof o == "string" && (o = [o]);
          const s = new Request(...o);
          return this.handleRequest({ request: s, event: e });
        }));
        e.waitUntil(r), e.ports && e.ports[0] && r.then(() => e.ports[0].postMessage(!0));
      }
    });
  }
  /**
   * Apply the routing rules to a FetchEvent object to get a Response from an
   * appropriate Route's handler.
   *
   * @param {Object} options
   * @param {Request} options.request The request to handle.
   * @param {ExtendableEvent} options.event The event that triggered the
   *     request.
   * @return {Promise<Response>|undefined} A promise is returned if a
   *     registered route can handle the request. If there is no matching
   *     route and there's no `defaultHandler`, `undefined` is returned.
   */
  handleRequest({ request: e, event: n }) {
    ({}).NODE_ENV !== "production" && b.isInstance(e, Request, {
      moduleName: "workbox-routing",
      className: "Router",
      funcName: "handleRequest",
      paramName: "options.request"
    });
    const r = new URL(e.url, location.href);
    if (!r.protocol.startsWith("http")) {
      ({}).NODE_ENV !== "production" && u.debug("Workbox Router only supports URLs that start with 'http'.");
      return;
    }
    const o = r.origin === location.origin, { params: s, route: a } = this.findMatchingRoute({
      event: n,
      request: e,
      sameOrigin: o,
      url: r
    });
    let i = a && a.handler;
    const c = [];
    ({}).NODE_ENV !== "production" && i && (c.push(["Found a route to handle this request:", a]), s && c.push([
      "Passing the following params to the route's handler:",
      s
    ]));
    const h = e.method;
    if (!i && this._defaultHandlerMap.has(h) && ({}.NODE_ENV !== "production" && c.push(`Failed to find a matching route. Falling back to the default handler for ${h}.`), i = this._defaultHandlerMap.get(h)), !i) {
      ({}).NODE_ENV !== "production" && u.debug(`No route found for: ${g(r)}`);
      return;
    }
    ({}).NODE_ENV !== "production" && (u.groupCollapsed(`Router is responding to: ${g(r)}`), c.forEach((m) => {
      Array.isArray(m) ? u.log(...m) : u.log(m);
    }), u.groupEnd());
    let l;
    try {
      l = i.handle({ url: r, request: e, event: n, params: s });
    } catch (m) {
      l = Promise.reject(m);
    }
    const d = a && a.catchHandler;
    return l instanceof Promise && (this._catchHandler || d) && (l = l.catch(async (m) => {
      if (d) {
        ({}).NODE_ENV !== "production" && (u.groupCollapsed(`Error thrown when responding to:  ${g(r)}. Falling back to route's Catch Handler.`), u.error("Error thrown by:", a), u.error(m), u.groupEnd());
        try {
          return await d.handle({ url: r, request: e, event: n, params: s });
        } catch (w) {
          w instanceof Error && (m = w);
        }
      }
      if (this._catchHandler)
        return {}.NODE_ENV !== "production" && (u.groupCollapsed(`Error thrown when responding to:  ${g(r)}. Falling back to global Catch Handler.`), u.error("Error thrown by:", a), u.error(m), u.groupEnd()), this._catchHandler.handle({ url: r, request: e, event: n });
      throw m;
    })), l;
  }
  /**
   * Checks a request and URL (and optionally an event) against the list of
   * registered routes, and if there's a match, returns the corresponding
   * route along with any params generated by the match.
   *
   * @param {Object} options
   * @param {URL} options.url
   * @param {boolean} options.sameOrigin The result of comparing `url.origin`
   *     against the current origin.
   * @param {Request} options.request The request to match.
   * @param {Event} options.event The corresponding event.
   * @return {Object} An object with `route` and `params` properties.
   *     They are populated if a matching route was found or `undefined`
   *     otherwise.
   */
  findMatchingRoute({ url: e, sameOrigin: n, request: r, event: o }) {
    const s = this._routes.get(r.method) || [];
    for (const a of s) {
      let i;
      const c = a.match({ url: e, sameOrigin: n, request: r, event: o });
      if (c)
        return {}.NODE_ENV !== "production" && c instanceof Promise && u.warn(`While routing ${g(e)}, an async matchCallback function was used. Please convert the following route to use a synchronous matchCallback function:`, a), i = c, (Array.isArray(i) && i.length === 0 || c.constructor === Object && // eslint-disable-line
        Object.keys(c).length === 0 || typeof c == "boolean") && (i = void 0), { route: a, params: i };
    }
    return {};
  }
  /**
   * Define a default `handler` that's called when no routes explicitly
   * match the incoming request.
   *
   * Each HTTP method ('GET', 'POST', etc.) gets its own default handler.
   *
   * Without a default handler, unmatched requests will go against the
   * network as if there were no service worker present.
   *
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to associate with this
   * default handler. Each method has its own default.
   */
  setDefaultHandler(e, n = tt) {
    this._defaultHandlerMap.set(n, q(e));
  }
  /**
   * If a Route throws an error while handling a request, this `handler`
   * will be called and given a chance to provide a response.
   *
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   */
  setCatchHandler(e) {
    this._catchHandler = q(e);
  }
  /**
   * Registers a route with the router.
   *
   * @param {workbox-routing.Route} route The route to register.
   */
  registerRoute(e) {
    ({}).NODE_ENV !== "production" && (b.isType(e, "object", {
      moduleName: "workbox-routing",
      className: "Router",
      funcName: "registerRoute",
      paramName: "route"
    }), b.hasMethod(e, "match", {
      moduleName: "workbox-routing",
      className: "Router",
      funcName: "registerRoute",
      paramName: "route"
    }), b.isType(e.handler, "object", {
      moduleName: "workbox-routing",
      className: "Router",
      funcName: "registerRoute",
      paramName: "route"
    }), b.hasMethod(e.handler, "handle", {
      moduleName: "workbox-routing",
      className: "Router",
      funcName: "registerRoute",
      paramName: "route.handler"
    }), b.isType(e.method, "string", {
      moduleName: "workbox-routing",
      className: "Router",
      funcName: "registerRoute",
      paramName: "route.method"
    })), this._routes.has(e.method) || this._routes.set(e.method, []), this._routes.get(e.method).push(e);
  }
  /**
   * Unregisters a route with the router.
   *
   * @param {workbox-routing.Route} route The route to unregister.
   */
  unregisterRoute(e) {
    if (!this._routes.has(e.method))
      throw new p("unregister-route-but-not-found-with-method", {
        method: e.method
      });
    const n = this._routes.get(e.method).indexOf(e);
    if (n > -1)
      this._routes.get(e.method).splice(n, 1);
    else
      throw new p("unregister-route-route-not-registered");
  }
}
let V;
const mn = () => (V || (V = new gn(), V.addFetchListener(), V.addCacheListener()), V);
function wn(t, e, n) {
  let r;
  if (typeof t == "string") {
    const s = new URL(t, location.href);
    if ({}.NODE_ENV !== "production") {
      if (!(t.startsWith("/") || t.startsWith("http")))
        throw new p("invalid-string", {
          moduleName: "workbox-routing",
          funcName: "registerRoute",
          paramName: "capture"
        });
      const i = t.startsWith("http") ? s.pathname : t, c = "[*:?+]";
      new RegExp(`${c}`).exec(i) && u.debug(`The '$capture' parameter contains an Express-style wildcard character (${c}). Strings are now always interpreted as exact matches; use a RegExp for partial or wildcard matches.`);
    }
    const a = ({ url: i }) => ({}.NODE_ENV !== "production" && i.pathname === s.pathname && i.origin !== s.origin && u.debug(`${t} only partially matches the cross-origin URL ${i.toString()}. This route will only handle cross-origin requests if they match the entire URL.`), i.href === s.href);
    r = new j(a, e, n);
  } else if (t instanceof RegExp)
    r = new pn(t, e, n);
  else if (typeof t == "function")
    r = new j(t, e, n);
  else if (t instanceof j)
    r = t;
  else
    throw new p("unsupported-route-type", {
      moduleName: "workbox-routing",
      funcName: "registerRoute",
      paramName: "capture"
    });
  return mn().registerRoute(r), r;
}
function bn(t, e = []) {
  for (const n of [...t.searchParams.keys()])
    e.some((r) => r.test(n)) && t.searchParams.delete(n);
  return t;
}
function* yn(t, { ignoreURLParametersMatching: e = [/^utm_/, /^fbclid$/], directoryIndex: n = "index.html", cleanURLs: r = !0, urlManipulation: o } = {}) {
  const s = new URL(t, location.href);
  s.hash = "", yield s.href;
  const a = bn(s, e);
  if (yield a.href, n && a.pathname.endsWith("/")) {
    const i = new URL(a.href);
    i.pathname += n, yield i.href;
  }
  if (r) {
    const i = new URL(a.href);
    i.pathname += ".html", yield i.href;
  }
  if (o) {
    const i = o({ url: s });
    for (const c of i)
      yield c.href;
  }
}
class En extends j {
  /**
   * @param {PrecacheController} precacheController A `PrecacheController`
   * instance used to both match requests and respond to fetch events.
   * @param {Object} [options] Options to control how requests are matched
   * against the list of precached URLs.
   * @param {string} [options.directoryIndex=index.html] The `directoryIndex` will
   * check cache entries for a URLs ending with '/' to see if there is a hit when
   * appending the `directoryIndex` value.
   * @param {Array<RegExp>} [options.ignoreURLParametersMatching=[/^utm_/, /^fbclid$/]] An
   * array of regex's to remove search params when looking for a cache match.
   * @param {boolean} [options.cleanURLs=true] The `cleanURLs` option will
   * check the cache for the URL with a `.html` added to the end of the end.
   * @param {workbox-precaching~urlManipulation} [options.urlManipulation]
   * This is a function that should take a URL and return an array of
   * alternative URLs that should be checked for precache matches.
   */
  constructor(e, n) {
    const r = ({ request: o }) => {
      const s = e.getURLsToCacheKeys();
      for (const a of yn(o.url, n)) {
        const i = s.get(a);
        if (i) {
          const c = e.getIntegrityForCacheKey(i);
          return { cacheKey: i, integrity: c };
        }
      }
      ({}).NODE_ENV !== "production" && u.debug("Precaching did not find a match for " + g(o.url));
    };
    super(r, e.strategy);
  }
}
function _n(t) {
  const e = et(), n = new En(e, t);
  wn(n);
}
const vn = "-precache-", Cn = async (t, e = vn) => {
  const r = (await self.caches.keys()).filter((o) => o.includes(e) && o.includes(self.registration.scope) && o !== t);
  return await Promise.all(r.map((o) => self.caches.delete(o))), r;
};
function Tn() {
  self.addEventListener("activate", (t) => {
    const e = Y.getPrecacheName();
    t.waitUntil(Cn(e).then((n) => {
      ({}).NODE_ENV !== "production" && n.length > 0 && u.log("The following out-of-date precaches were cleaned up automatically:", n);
    }));
  });
}
function In(t) {
  et().precache(t);
}
function Sn(t, e) {
  In(t), _n(e);
}
function Rn() {
  self.addEventListener("activate", () => self.clients.claim());
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const nt = function(t) {
  const e = [];
  let n = 0;
  for (let r = 0; r < t.length; r++) {
    let o = t.charCodeAt(r);
    o < 128 ? e[n++] = o : o < 2048 ? (e[n++] = o >> 6 | 192, e[n++] = o & 63 | 128) : (o & 64512) === 55296 && r + 1 < t.length && (t.charCodeAt(r + 1) & 64512) === 56320 ? (o = 65536 + ((o & 1023) << 10) + (t.charCodeAt(++r) & 1023), e[n++] = o >> 18 | 240, e[n++] = o >> 12 & 63 | 128, e[n++] = o >> 6 & 63 | 128, e[n++] = o & 63 | 128) : (e[n++] = o >> 12 | 224, e[n++] = o >> 6 & 63 | 128, e[n++] = o & 63 | 128);
  }
  return e;
}, Nn = function(t) {
  const e = [];
  let n = 0, r = 0;
  for (; n < t.length; ) {
    const o = t[n++];
    if (o < 128)
      e[r++] = String.fromCharCode(o);
    else if (o > 191 && o < 224) {
      const s = t[n++];
      e[r++] = String.fromCharCode((o & 31) << 6 | s & 63);
    } else if (o > 239 && o < 365) {
      const s = t[n++], a = t[n++], i = t[n++], c = ((o & 7) << 18 | (s & 63) << 12 | (a & 63) << 6 | i & 63) - 65536;
      e[r++] = String.fromCharCode(55296 + (c >> 10)), e[r++] = String.fromCharCode(56320 + (c & 1023));
    } else {
      const s = t[n++], a = t[n++];
      e[r++] = String.fromCharCode((o & 15) << 12 | (s & 63) << 6 | a & 63);
    }
  }
  return e.join("");
}, rt = {
  /**
   * Maps bytes to characters.
   */
  byteToCharMap_: null,
  /**
   * Maps characters to bytes.
   */
  charToByteMap_: null,
  /**
   * Maps bytes to websafe characters.
   * @private
   */
  byteToCharMapWebSafe_: null,
  /**
   * Maps websafe characters to bytes.
   * @private
   */
  charToByteMapWebSafe_: null,
  /**
   * Our default alphabet, shared between
   * ENCODED_VALS and ENCODED_VALS_WEBSAFE
   */
  ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  /**
   * Our default alphabet. Value 64 (=) is special; it means "nothing."
   */
  get ENCODED_VALS() {
    return this.ENCODED_VALS_BASE + "+/=";
  },
  /**
   * Our websafe alphabet.
   */
  get ENCODED_VALS_WEBSAFE() {
    return this.ENCODED_VALS_BASE + "-_.";
  },
  /**
   * Whether this browser supports the atob and btoa functions. This extension
   * started at Mozilla but is now implemented by many browsers. We use the
   * ASSUME_* variables to avoid pulling in the full useragent detection library
   * but still allowing the standard per-browser compilations.
   *
   */
  HAS_NATIVE_SUPPORT: typeof atob == "function",
  /**
   * Base64-encode an array of bytes.
   *
   * @param input An array of bytes (numbers with
   *     value in [0, 255]) to encode.
   * @param webSafe Boolean indicating we should use the
   *     alternative alphabet.
   * @return The base64 encoded string.
   */
  encodeByteArray(t, e) {
    if (!Array.isArray(t))
      throw Error("encodeByteArray takes an array as a parameter");
    this.init_();
    const n = e ? this.byteToCharMapWebSafe_ : this.byteToCharMap_, r = [];
    for (let o = 0; o < t.length; o += 3) {
      const s = t[o], a = o + 1 < t.length, i = a ? t[o + 1] : 0, c = o + 2 < t.length, h = c ? t[o + 2] : 0, l = s >> 2, d = (s & 3) << 4 | i >> 4;
      let m = (i & 15) << 2 | h >> 6, w = h & 63;
      c || (w = 64, a || (m = 64)), r.push(n[l], n[d], n[m], n[w]);
    }
    return r.join("");
  },
  /**
   * Base64-encode a string.
   *
   * @param input A string to encode.
   * @param webSafe If true, we should use the
   *     alternative alphabet.
   * @return The base64 encoded string.
   */
  encodeString(t, e) {
    return this.HAS_NATIVE_SUPPORT && !e ? btoa(t) : this.encodeByteArray(nt(t), e);
  },
  /**
   * Base64-decode a string.
   *
   * @param input to decode.
   * @param webSafe True if we should use the
   *     alternative alphabet.
   * @return string representing the decoded value.
   */
  decodeString(t, e) {
    return this.HAS_NATIVE_SUPPORT && !e ? atob(t) : Nn(this.decodeStringToByteArray(t, e));
  },
  /**
   * Base64-decode a string.
   *
   * In base-64 decoding, groups of four characters are converted into three
   * bytes.  If the encoder did not apply padding, the input length may not
   * be a multiple of 4.
   *
   * In this case, the last group will have fewer than 4 characters, and
   * padding will be inferred.  If the group has one or two characters, it decodes
   * to one byte.  If the group has three characters, it decodes to two bytes.
   *
   * @param input Input to decode.
   * @param webSafe True if we should use the web-safe alphabet.
   * @return bytes representing the decoded value.
   */
  decodeStringToByteArray(t, e) {
    this.init_();
    const n = e ? this.charToByteMapWebSafe_ : this.charToByteMap_, r = [];
    for (let o = 0; o < t.length; ) {
      const s = n[t.charAt(o++)], i = o < t.length ? n[t.charAt(o)] : 0;
      ++o;
      const h = o < t.length ? n[t.charAt(o)] : 64;
      ++o;
      const d = o < t.length ? n[t.charAt(o)] : 64;
      if (++o, s == null || i == null || h == null || d == null)
        throw new Dn();
      const m = s << 2 | i >> 4;
      if (r.push(m), h !== 64) {
        const w = i << 4 & 240 | h >> 2;
        if (r.push(w), d !== 64) {
          const E = h << 6 & 192 | d;
          r.push(E);
        }
      }
    }
    return r;
  },
  /**
   * Lazy static initialization function. Called before
   * accessing any of the static map variables.
   * @private
   */
  init_() {
    if (!this.byteToCharMap_) {
      this.byteToCharMap_ = {}, this.charToByteMap_ = {}, this.byteToCharMapWebSafe_ = {}, this.charToByteMapWebSafe_ = {};
      for (let t = 0; t < this.ENCODED_VALS.length; t++)
        this.byteToCharMap_[t] = this.ENCODED_VALS.charAt(t), this.charToByteMap_[this.byteToCharMap_[t]] = t, this.byteToCharMapWebSafe_[t] = this.ENCODED_VALS_WEBSAFE.charAt(t), this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]] = t, t >= this.ENCODED_VALS_BASE.length && (this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)] = t, this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)] = t);
    }
  }
};
class Dn extends Error {
  constructor() {
    super(...arguments), this.name = "DecodeBase64StringError";
  }
}
const kn = function(t) {
  const e = nt(t);
  return rt.encodeByteArray(e, !0);
}, ot = function(t) {
  return kn(t).replace(/\./g, "");
}, An = function(t) {
  try {
    return rt.decodeString(t, !0);
  } catch (e) {
    console.error("base64Decode failed: ", e);
  }
  return null;
};
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function On() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unable to locate global object.");
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const $n = () => On().__FIREBASE_DEFAULTS__, Ln = () => {
  if (typeof process > "u" || typeof {} > "u")
    return;
  const t = {}.__FIREBASE_DEFAULTS__;
  if (t)
    return JSON.parse(t);
}, Pn = () => {
  if (typeof document > "u")
    return;
  let t;
  try {
    t = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
  } catch {
    return;
  }
  const e = t && An(t[1]);
  return e && JSON.parse(e);
}, xn = () => {
  try {
    return $n() || Ln() || Pn();
  } catch (t) {
    console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);
    return;
  }
}, st = () => {
  var t;
  return (t = xn()) === null || t === void 0 ? void 0 : t.config;
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Mn {
  constructor() {
    this.reject = () => {
    }, this.resolve = () => {
    }, this.promise = new Promise((e, n) => {
      this.resolve = e, this.reject = n;
    });
  }
  /**
   * Our API internals are not promiseified and cannot because our callback APIs have subtle expectations around
   * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
   * and returns a node-style callback which will resolve or reject the Deferred's promise.
   */
  wrapCallback(e) {
    return (n, r) => {
      n ? this.reject(n) : this.resolve(r), typeof e == "function" && (this.promise.catch(() => {
      }), e.length === 1 ? e(n) : e(n, r));
    };
  }
}
function at() {
  try {
    return typeof indexedDB == "object";
  } catch {
    return !1;
  }
}
function it() {
  return new Promise((t, e) => {
    try {
      let n = !0;
      const r = "validate-browser-context-for-indexeddb-analytics-module", o = self.indexedDB.open(r);
      o.onsuccess = () => {
        o.result.close(), n || self.indexedDB.deleteDatabase(r), t(!0);
      }, o.onupgradeneeded = () => {
        n = !1;
      }, o.onerror = () => {
        var s;
        e(((s = o.error) === null || s === void 0 ? void 0 : s.message) || "");
      };
    } catch (n) {
      e(n);
    }
  });
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Bn = "FirebaseError";
class B extends Error {
  constructor(e, n, r) {
    super(n), this.code = e, this.customData = r, this.name = Bn, Object.setPrototypeOf(this, B.prototype), Error.captureStackTrace && Error.captureStackTrace(this, X.prototype.create);
  }
}
class X {
  constructor(e, n, r) {
    this.service = e, this.serviceName = n, this.errors = r;
  }
  create(e, ...n) {
    const r = n[0] || {}, o = `${this.service}/${e}`, s = this.errors[e], a = s ? Un(s, r) : "Error", i = `${this.serviceName}: ${a} (${o}).`;
    return new B(o, i, r);
  }
}
function Un(t, e) {
  return t.replace(Vn, (n, r) => {
    const o = e[r];
    return o != null ? String(o) : `<${r}?>`;
  });
}
const Vn = /\{\$([^}]+)}/g;
function ge(t, e) {
  if (t === e)
    return !0;
  const n = Object.keys(t), r = Object.keys(e);
  for (const o of n) {
    if (!r.includes(o))
      return !1;
    const s = t[o], a = e[o];
    if (Fe(s) && Fe(a)) {
      if (!ge(s, a))
        return !1;
    } else if (s !== a)
      return !1;
  }
  for (const o of r)
    if (!n.includes(o))
      return !1;
  return !0;
}
function Fe(t) {
  return t !== null && typeof t == "object";
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ct(t) {
  return t && t._delegate ? t._delegate : t;
}
class D {
  /**
   *
   * @param name The public service name, e.g. app, auth, firestore, database
   * @param instanceFactory Service factory responsible for creating the public interface
   * @param type whether the service provided by the component is public or private
   */
  constructor(e, n, r) {
    this.name = e, this.instanceFactory = n, this.type = r, this.multipleInstances = !1, this.serviceProps = {}, this.instantiationMode = "LAZY", this.onInstanceCreated = null;
  }
  setInstantiationMode(e) {
    return this.instantiationMode = e, this;
  }
  setMultipleInstances(e) {
    return this.multipleInstances = e, this;
  }
  setServiceProps(e) {
    return this.serviceProps = e, this;
  }
  setInstanceCreatedCallback(e) {
    return this.onInstanceCreated = e, this;
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const R = "[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class jn {
  constructor(e, n) {
    this.name = e, this.container = n, this.component = null, this.instances = /* @__PURE__ */ new Map(), this.instancesDeferred = /* @__PURE__ */ new Map(), this.instancesOptions = /* @__PURE__ */ new Map(), this.onInitCallbacks = /* @__PURE__ */ new Map();
  }
  /**
   * @param identifier A provider can provide mulitple instances of a service
   * if this.component.multipleInstances is true.
   */
  get(e) {
    const n = this.normalizeInstanceIdentifier(e);
    if (!this.instancesDeferred.has(n)) {
      const r = new Mn();
      if (this.instancesDeferred.set(n, r), this.isInitialized(n) || this.shouldAutoInitialize())
        try {
          const o = this.getOrInitializeService({
            instanceIdentifier: n
          });
          o && r.resolve(o);
        } catch {
        }
    }
    return this.instancesDeferred.get(n).promise;
  }
  getImmediate(e) {
    var n;
    const r = this.normalizeInstanceIdentifier(e == null ? void 0 : e.identifier), o = (n = e == null ? void 0 : e.optional) !== null && n !== void 0 ? n : !1;
    if (this.isInitialized(r) || this.shouldAutoInitialize())
      try {
        return this.getOrInitializeService({
          instanceIdentifier: r
        });
      } catch (s) {
        if (o)
          return null;
        throw s;
      }
    else {
      if (o)
        return null;
      throw Error(`Service ${this.name} is not available`);
    }
  }
  getComponent() {
    return this.component;
  }
  setComponent(e) {
    if (e.name !== this.name)
      throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);
    if (this.component)
      throw Error(`Component for ${this.name} has already been provided`);
    if (this.component = e, !!this.shouldAutoInitialize()) {
      if (Hn(e))
        try {
          this.getOrInitializeService({ instanceIdentifier: R });
        } catch {
        }
      for (const [n, r] of this.instancesDeferred.entries()) {
        const o = this.normalizeInstanceIdentifier(n);
        try {
          const s = this.getOrInitializeService({
            instanceIdentifier: o
          });
          r.resolve(s);
        } catch {
        }
      }
    }
  }
  clearInstance(e = R) {
    this.instancesDeferred.delete(e), this.instancesOptions.delete(e), this.instances.delete(e);
  }
  // app.delete() will call this method on every provider to delete the services
  // TODO: should we mark the provider as deleted?
  async delete() {
    const e = Array.from(this.instances.values());
    await Promise.all([
      ...e.filter((n) => "INTERNAL" in n).map((n) => n.INTERNAL.delete()),
      ...e.filter((n) => "_delete" in n).map((n) => n._delete())
    ]);
  }
  isComponentSet() {
    return this.component != null;
  }
  isInitialized(e = R) {
    return this.instances.has(e);
  }
  getOptions(e = R) {
    return this.instancesOptions.get(e) || {};
  }
  initialize(e = {}) {
    const { options: n = {} } = e, r = this.normalizeInstanceIdentifier(e.instanceIdentifier);
    if (this.isInitialized(r))
      throw Error(`${this.name}(${r}) has already been initialized`);
    if (!this.isComponentSet())
      throw Error(`Component ${this.name} has not been registered yet`);
    const o = this.getOrInitializeService({
      instanceIdentifier: r,
      options: n
    });
    for (const [s, a] of this.instancesDeferred.entries()) {
      const i = this.normalizeInstanceIdentifier(s);
      r === i && a.resolve(o);
    }
    return o;
  }
  /**
   *
   * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
   * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
   *
   * @param identifier An optional instance identifier
   * @returns a function to unregister the callback
   */
  onInit(e, n) {
    var r;
    const o = this.normalizeInstanceIdentifier(n), s = (r = this.onInitCallbacks.get(o)) !== null && r !== void 0 ? r : /* @__PURE__ */ new Set();
    s.add(e), this.onInitCallbacks.set(o, s);
    const a = this.instances.get(o);
    return a && e(a, o), () => {
      s.delete(e);
    };
  }
  /**
   * Invoke onInit callbacks synchronously
   * @param instance the service instance`
   */
  invokeOnInitCallbacks(e, n) {
    const r = this.onInitCallbacks.get(n);
    if (r)
      for (const o of r)
        try {
          o(e, n);
        } catch {
        }
  }
  getOrInitializeService({ instanceIdentifier: e, options: n = {} }) {
    let r = this.instances.get(e);
    if (!r && this.component && (r = this.component.instanceFactory(this.container, {
      instanceIdentifier: Fn(e),
      options: n
    }), this.instances.set(e, r), this.instancesOptions.set(e, n), this.invokeOnInitCallbacks(r, e), this.component.onInstanceCreated))
      try {
        this.component.onInstanceCreated(this.container, e, r);
      } catch {
      }
    return r || null;
  }
  normalizeInstanceIdentifier(e = R) {
    return this.component ? this.component.multipleInstances ? e : R : e;
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== "EXPLICIT";
  }
}
function Fn(t) {
  return t === R ? void 0 : t;
}
function Hn(t) {
  return t.instantiationMode === "EAGER";
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Kn {
  constructor(e) {
    this.name = e, this.providers = /* @__PURE__ */ new Map();
  }
  /**
   *
   * @param component Component being added
   * @param overwrite When a component with the same name has already been registered,
   * if overwrite is true: overwrite the existing component with the new component and create a new
   * provider with the new component. It can be useful in tests where you want to use different mocks
   * for different tests.
   * if overwrite is false: throw an exception
   */
  addComponent(e) {
    const n = this.getProvider(e.name);
    if (n.isComponentSet())
      throw new Error(`Component ${e.name} has already been registered with ${this.name}`);
    n.setComponent(e);
  }
  addOrOverwriteComponent(e) {
    this.getProvider(e.name).isComponentSet() && this.providers.delete(e.name), this.addComponent(e);
  }
  /**
   * getProvider provides a type safe interface where it can only be called with a field name
   * present in NameServiceMapping interface.
   *
   * Firebase SDKs providing services should extend NameServiceMapping interface to register
   * themselves.
   */
  getProvider(e) {
    if (this.providers.has(e))
      return this.providers.get(e);
    const n = new jn(e, this);
    return this.providers.set(e, n), n;
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var f;
(function(t) {
  t[t.DEBUG = 0] = "DEBUG", t[t.VERBOSE = 1] = "VERBOSE", t[t.INFO = 2] = "INFO", t[t.WARN = 3] = "WARN", t[t.ERROR = 4] = "ERROR", t[t.SILENT = 5] = "SILENT";
})(f || (f = {}));
const qn = {
  debug: f.DEBUG,
  verbose: f.VERBOSE,
  info: f.INFO,
  warn: f.WARN,
  error: f.ERROR,
  silent: f.SILENT
}, Wn = f.INFO, Gn = {
  [f.DEBUG]: "log",
  [f.VERBOSE]: "log",
  [f.INFO]: "info",
  [f.WARN]: "warn",
  [f.ERROR]: "error"
}, zn = (t, e, ...n) => {
  if (e < t.logLevel)
    return;
  const r = (/* @__PURE__ */ new Date()).toISOString(), o = Gn[e];
  if (o)
    console[o](`[${r}]  ${t.name}:`, ...n);
  else
    throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`);
};
class Jn {
  /**
   * Gives you an instance of a Logger to capture messages according to
   * Firebase's logging scheme.
   *
   * @param name The name that the logs will be associated with
   */
  constructor(e) {
    this.name = e, this._logLevel = Wn, this._logHandler = zn, this._userLogHandler = null;
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(e) {
    if (!(e in f))
      throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
    this._logLevel = e;
  }
  // Workaround for setter/getter having to be the same type.
  setLogLevel(e) {
    this._logLevel = typeof e == "string" ? qn[e] : e;
  }
  get logHandler() {
    return this._logHandler;
  }
  set logHandler(e) {
    if (typeof e != "function")
      throw new TypeError("Value assigned to `logHandler` must be a function");
    this._logHandler = e;
  }
  get userLogHandler() {
    return this._userLogHandler;
  }
  set userLogHandler(e) {
    this._userLogHandler = e;
  }
  /**
   * The functions below are all based on the `console` interface
   */
  debug(...e) {
    this._userLogHandler && this._userLogHandler(this, f.DEBUG, ...e), this._logHandler(this, f.DEBUG, ...e);
  }
  log(...e) {
    this._userLogHandler && this._userLogHandler(this, f.VERBOSE, ...e), this._logHandler(this, f.VERBOSE, ...e);
  }
  info(...e) {
    this._userLogHandler && this._userLogHandler(this, f.INFO, ...e), this._logHandler(this, f.INFO, ...e);
  }
  warn(...e) {
    this._userLogHandler && this._userLogHandler(this, f.WARN, ...e), this._logHandler(this, f.WARN, ...e);
  }
  error(...e) {
    this._userLogHandler && this._userLogHandler(this, f.ERROR, ...e), this._logHandler(this, f.ERROR, ...e);
  }
}
const Yn = (t, e) => e.some((n) => t instanceof n);
let He, Ke;
function Xn() {
  return He || (He = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function Qn() {
  return Ke || (Ke = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const ut = /* @__PURE__ */ new WeakMap(), me = /* @__PURE__ */ new WeakMap(), lt = /* @__PURE__ */ new WeakMap(), se = /* @__PURE__ */ new WeakMap(), Ce = /* @__PURE__ */ new WeakMap();
function Zn(t) {
  const e = new Promise((n, r) => {
    const o = () => {
      t.removeEventListener("success", s), t.removeEventListener("error", a);
    }, s = () => {
      n(T(t.result)), o();
    }, a = () => {
      r(t.error), o();
    };
    t.addEventListener("success", s), t.addEventListener("error", a);
  });
  return e.then((n) => {
    n instanceof IDBCursor && ut.set(n, t);
  }).catch(() => {
  }), Ce.set(e, t), e;
}
function er(t) {
  if (me.has(t))
    return;
  const e = new Promise((n, r) => {
    const o = () => {
      t.removeEventListener("complete", s), t.removeEventListener("error", a), t.removeEventListener("abort", a);
    }, s = () => {
      n(), o();
    }, a = () => {
      r(t.error || new DOMException("AbortError", "AbortError")), o();
    };
    t.addEventListener("complete", s), t.addEventListener("error", a), t.addEventListener("abort", a);
  });
  me.set(t, e);
}
let we = {
  get(t, e, n) {
    if (t instanceof IDBTransaction) {
      if (e === "done")
        return me.get(t);
      if (e === "objectStoreNames")
        return t.objectStoreNames || lt.get(t);
      if (e === "store")
        return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0]);
    }
    return T(t[e]);
  },
  set(t, e, n) {
    return t[e] = n, !0;
  },
  has(t, e) {
    return t instanceof IDBTransaction && (e === "done" || e === "store") ? !0 : e in t;
  }
};
function tr(t) {
  we = t(we);
}
function nr(t) {
  return t === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype) ? function(e, ...n) {
    const r = t.call(ae(this), e, ...n);
    return lt.set(r, e.sort ? e.sort() : [e]), T(r);
  } : Qn().includes(t) ? function(...e) {
    return t.apply(ae(this), e), T(ut.get(this));
  } : function(...e) {
    return T(t.apply(ae(this), e));
  };
}
function rr(t) {
  return typeof t == "function" ? nr(t) : (t instanceof IDBTransaction && er(t), Yn(t, Xn()) ? new Proxy(t, we) : t);
}
function T(t) {
  if (t instanceof IDBRequest)
    return Zn(t);
  if (se.has(t))
    return se.get(t);
  const e = rr(t);
  return e !== t && (se.set(t, e), Ce.set(e, t)), e;
}
const ae = (t) => Ce.get(t);
function Q(t, e, { blocked: n, upgrade: r, blocking: o, terminated: s } = {}) {
  const a = indexedDB.open(t, e), i = T(a);
  return r && a.addEventListener("upgradeneeded", (c) => {
    r(T(a.result), c.oldVersion, c.newVersion, T(a.transaction), c);
  }), n && a.addEventListener("blocked", (c) => n(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    c.oldVersion,
    c.newVersion,
    c
  )), i.then((c) => {
    s && c.addEventListener("close", () => s()), o && c.addEventListener("versionchange", (h) => o(h.oldVersion, h.newVersion, h));
  }).catch(() => {
  }), i;
}
function ie(t, { blocked: e } = {}) {
  const n = indexedDB.deleteDatabase(t);
  return e && n.addEventListener("blocked", (r) => e(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    r.oldVersion,
    r
  )), T(n).then(() => {
  });
}
const or = ["get", "getKey", "getAll", "getAllKeys", "count"], sr = ["put", "add", "delete", "clear"], ce = /* @__PURE__ */ new Map();
function qe(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == "string"))
    return;
  if (ce.get(e))
    return ce.get(e);
  const n = e.replace(/FromIndex$/, ""), r = e !== n, o = sr.includes(n);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(n in (r ? IDBIndex : IDBObjectStore).prototype) || !(o || or.includes(n))
  )
    return;
  const s = async function(a, ...i) {
    const c = this.transaction(a, o ? "readwrite" : "readonly");
    let h = c.store;
    return r && (h = h.index(i.shift())), (await Promise.all([
      h[n](...i),
      o && c.done
    ]))[0];
  };
  return ce.set(e, s), s;
}
tr((t) => ({
  ...t,
  get: (e, n, r) => qe(e, n) || t.get(e, n, r),
  has: (e, n) => !!qe(e, n) || t.has(e, n)
}));
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ar {
  constructor(e) {
    this.container = e;
  }
  // In initial implementation, this will be called by installations on
  // auth token refresh, and installations will send this string.
  getPlatformInfoString() {
    return this.container.getProviders().map((n) => {
      if (ir(n)) {
        const r = n.getImmediate();
        return `${r.library}/${r.version}`;
      } else
        return null;
    }).filter((n) => n).join(" ");
  }
}
function ir(t) {
  const e = t.getComponent();
  return (e == null ? void 0 : e.type) === "VERSION";
}
const be = "@firebase/app", We = "0.9.29";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const k = new Jn("@firebase/app"), cr = "@firebase/app-compat", ur = "@firebase/analytics-compat", lr = "@firebase/analytics", hr = "@firebase/app-check-compat", dr = "@firebase/app-check", fr = "@firebase/auth", pr = "@firebase/auth-compat", gr = "@firebase/database", mr = "@firebase/database-compat", wr = "@firebase/functions", br = "@firebase/functions-compat", yr = "@firebase/installations", Er = "@firebase/installations-compat", _r = "@firebase/messaging", vr = "@firebase/messaging-compat", Cr = "@firebase/performance", Tr = "@firebase/performance-compat", Ir = "@firebase/remote-config", Sr = "@firebase/remote-config-compat", Rr = "@firebase/storage", Nr = "@firebase/storage-compat", Dr = "@firebase/firestore", kr = "@firebase/firestore-compat", Ar = "firebase";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ye = "[DEFAULT]", Or = {
  [be]: "fire-core",
  [cr]: "fire-core-compat",
  [lr]: "fire-analytics",
  [ur]: "fire-analytics-compat",
  [dr]: "fire-app-check",
  [hr]: "fire-app-check-compat",
  [fr]: "fire-auth",
  [pr]: "fire-auth-compat",
  [gr]: "fire-rtdb",
  [mr]: "fire-rtdb-compat",
  [wr]: "fire-fn",
  [br]: "fire-fn-compat",
  [yr]: "fire-iid",
  [Er]: "fire-iid-compat",
  [_r]: "fire-fcm",
  [vr]: "fire-fcm-compat",
  [Cr]: "fire-perf",
  [Tr]: "fire-perf-compat",
  [Ir]: "fire-rc",
  [Sr]: "fire-rc-compat",
  [Rr]: "fire-gcs",
  [Nr]: "fire-gcs-compat",
  [Dr]: "fire-fst",
  [kr]: "fire-fst-compat",
  "fire-js": "fire-js",
  [Ar]: "fire-js-all"
};
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const W = /* @__PURE__ */ new Map(), Ee = /* @__PURE__ */ new Map();
function $r(t, e) {
  try {
    t.container.addComponent(e);
  } catch (n) {
    k.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`, n);
  }
}
function M(t) {
  const e = t.name;
  if (Ee.has(e))
    return k.debug(`There were multiple attempts to register component ${e}.`), !1;
  Ee.set(e, t);
  for (const n of W.values())
    $r(n, t);
  return !0;
}
function Te(t, e) {
  const n = t.container.getProvider("heartbeat").getImmediate({ optional: !0 });
  return n && n.triggerHeartbeat(), t.container.getProvider(e);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Lr = {
  "no-app": "No Firebase App '{$appName}' has been created - call initializeApp() first",
  "bad-app-name": "Illegal App name: '{$appName}",
  "duplicate-app": "Firebase App named '{$appName}' already exists with different options or config",
  "app-deleted": "Firebase App named '{$appName}' already deleted",
  "no-options": "Need to provide options, when not being deployed to hosting via source.",
  "invalid-app-argument": "firebase.{$appName}() takes either no argument or a Firebase App instance.",
  "invalid-log-argument": "First argument to `onLog` must be null or a function.",
  "idb-open": "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
  "idb-get": "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
  "idb-set": "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
  "idb-delete": "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."
}, S = new X("app", "Firebase", Lr);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Pr {
  constructor(e, n, r) {
    this._isDeleted = !1, this._options = Object.assign({}, e), this._config = Object.assign({}, n), this._name = n.name, this._automaticDataCollectionEnabled = n.automaticDataCollectionEnabled, this._container = r, this.container.addComponent(new D(
      "app",
      () => this,
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ));
  }
  get automaticDataCollectionEnabled() {
    return this.checkDestroyed(), this._automaticDataCollectionEnabled;
  }
  set automaticDataCollectionEnabled(e) {
    this.checkDestroyed(), this._automaticDataCollectionEnabled = e;
  }
  get name() {
    return this.checkDestroyed(), this._name;
  }
  get options() {
    return this.checkDestroyed(), this._options;
  }
  get config() {
    return this.checkDestroyed(), this._config;
  }
  get container() {
    return this._container;
  }
  get isDeleted() {
    return this._isDeleted;
  }
  set isDeleted(e) {
    this._isDeleted = e;
  }
  /**
   * This function will throw an Error if the App has already been deleted -
   * use before performing API actions on the App.
   */
  checkDestroyed() {
    if (this.isDeleted)
      throw S.create("app-deleted", { appName: this._name });
  }
}
function ht(t, e = {}) {
  let n = t;
  typeof e != "object" && (e = { name: e });
  const r = Object.assign({ name: ye, automaticDataCollectionEnabled: !1 }, e), o = r.name;
  if (typeof o != "string" || !o)
    throw S.create("bad-app-name", {
      appName: String(o)
    });
  if (n || (n = st()), !n)
    throw S.create(
      "no-options"
      /* AppError.NO_OPTIONS */
    );
  const s = W.get(o);
  if (s) {
    if (ge(n, s.options) && ge(r, s.config))
      return s;
    throw S.create("duplicate-app", { appName: o });
  }
  const a = new Kn(o);
  for (const c of Ee.values())
    a.addComponent(c);
  const i = new Pr(n, r, a);
  return W.set(o, i), i;
}
function xr(t = ye) {
  const e = W.get(t);
  if (!e && t === ye && st())
    return ht();
  if (!e)
    throw S.create("no-app", { appName: t });
  return e;
}
function x(t, e, n) {
  var r;
  let o = (r = Or[t]) !== null && r !== void 0 ? r : t;
  n && (o += `-${n}`);
  const s = o.match(/\s|\//), a = e.match(/\s|\//);
  if (s || a) {
    const i = [
      `Unable to register library "${o}" with version "${e}":`
    ];
    s && i.push(`library name "${o}" contains illegal characters (whitespace or "/")`), s && a && i.push("and"), a && i.push(`version name "${e}" contains illegal characters (whitespace or "/")`), k.warn(i.join(" "));
    return;
  }
  M(new D(
    `${o}-version`,
    () => ({ library: o, version: e }),
    "VERSION"
    /* ComponentType.VERSION */
  ));
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Mr = "firebase-heartbeat-database", Br = 1, F = "firebase-heartbeat-store";
let ue = null;
function dt() {
  return ue || (ue = Q(Mr, Br, {
    upgrade: (t, e) => {
      switch (e) {
        case 0:
          try {
            t.createObjectStore(F);
          } catch (n) {
            console.warn(n);
          }
      }
    }
  }).catch((t) => {
    throw S.create("idb-open", {
      originalErrorMessage: t.message
    });
  })), ue;
}
async function Ur(t) {
  try {
    const n = (await dt()).transaction(F), r = await n.objectStore(F).get(ft(t));
    return await n.done, r;
  } catch (e) {
    if (e instanceof B)
      k.warn(e.message);
    else {
      const n = S.create("idb-get", {
        originalErrorMessage: e == null ? void 0 : e.message
      });
      k.warn(n.message);
    }
  }
}
async function Ge(t, e) {
  try {
    const r = (await dt()).transaction(F, "readwrite");
    await r.objectStore(F).put(e, ft(t)), await r.done;
  } catch (n) {
    if (n instanceof B)
      k.warn(n.message);
    else {
      const r = S.create("idb-set", {
        originalErrorMessage: n == null ? void 0 : n.message
      });
      k.warn(r.message);
    }
  }
}
function ft(t) {
  return `${t.name}!${t.options.appId}`;
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Vr = 1024, jr = 30 * 24 * 60 * 60 * 1e3;
class Fr {
  constructor(e) {
    this.container = e, this._heartbeatsCache = null;
    const n = this.container.getProvider("app").getImmediate();
    this._storage = new Kr(n), this._heartbeatsCachePromise = this._storage.read().then((r) => (this._heartbeatsCache = r, r));
  }
  /**
   * Called to report a heartbeat. The function will generate
   * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
   * to IndexedDB.
   * Note that we only store one heartbeat per day. So if a heartbeat for today is
   * already logged, subsequent calls to this function in the same day will be ignored.
   */
  async triggerHeartbeat() {
    var e, n;
    const o = this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(), s = ze();
    if (!(((e = this._heartbeatsCache) === null || e === void 0 ? void 0 : e.heartbeats) == null && (this._heartbeatsCache = await this._heartbeatsCachePromise, ((n = this._heartbeatsCache) === null || n === void 0 ? void 0 : n.heartbeats) == null)) && !(this._heartbeatsCache.lastSentHeartbeatDate === s || this._heartbeatsCache.heartbeats.some((a) => a.date === s)))
      return this._heartbeatsCache.heartbeats.push({ date: s, agent: o }), this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter((a) => {
        const i = new Date(a.date).valueOf();
        return Date.now() - i <= jr;
      }), this._storage.overwrite(this._heartbeatsCache);
  }
  /**
   * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
   * It also clears all heartbeats from memory as well as in IndexedDB.
   *
   * NOTE: Consuming product SDKs should not send the header if this method
   * returns an empty string.
   */
  async getHeartbeatsHeader() {
    var e;
    if (this._heartbeatsCache === null && await this._heartbeatsCachePromise, ((e = this._heartbeatsCache) === null || e === void 0 ? void 0 : e.heartbeats) == null || this._heartbeatsCache.heartbeats.length === 0)
      return "";
    const n = ze(), { heartbeatsToSend: r, unsentEntries: o } = Hr(this._heartbeatsCache.heartbeats), s = ot(JSON.stringify({ version: 2, heartbeats: r }));
    return this._heartbeatsCache.lastSentHeartbeatDate = n, o.length > 0 ? (this._heartbeatsCache.heartbeats = o, await this._storage.overwrite(this._heartbeatsCache)) : (this._heartbeatsCache.heartbeats = [], this._storage.overwrite(this._heartbeatsCache)), s;
  }
}
function ze() {
  return (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
}
function Hr(t, e = Vr) {
  const n = [];
  let r = t.slice();
  for (const o of t) {
    const s = n.find((a) => a.agent === o.agent);
    if (s) {
      if (s.dates.push(o.date), Je(n) > e) {
        s.dates.pop();
        break;
      }
    } else if (n.push({
      agent: o.agent,
      dates: [o.date]
    }), Je(n) > e) {
      n.pop();
      break;
    }
    r = r.slice(1);
  }
  return {
    heartbeatsToSend: n,
    unsentEntries: r
  };
}
class Kr {
  constructor(e) {
    this.app = e, this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
  }
  async runIndexedDBEnvironmentCheck() {
    return at() ? it().then(() => !0).catch(() => !1) : !1;
  }
  /**
   * Read all heartbeats.
   */
  async read() {
    if (await this._canUseIndexedDBPromise) {
      const n = await Ur(this.app);
      return n != null && n.heartbeats ? n : { heartbeats: [] };
    } else
      return { heartbeats: [] };
  }
  // overwrite the storage with the provided heartbeats
  async overwrite(e) {
    var n;
    if (await this._canUseIndexedDBPromise) {
      const o = await this.read();
      return Ge(this.app, {
        lastSentHeartbeatDate: (n = e.lastSentHeartbeatDate) !== null && n !== void 0 ? n : o.lastSentHeartbeatDate,
        heartbeats: e.heartbeats
      });
    } else
      return;
  }
  // add heartbeats
  async add(e) {
    var n;
    if (await this._canUseIndexedDBPromise) {
      const o = await this.read();
      return Ge(this.app, {
        lastSentHeartbeatDate: (n = e.lastSentHeartbeatDate) !== null && n !== void 0 ? n : o.lastSentHeartbeatDate,
        heartbeats: [
          ...o.heartbeats,
          ...e.heartbeats
        ]
      });
    } else
      return;
  }
}
function Je(t) {
  return ot(
    // heartbeatsCache wrapper properties
    JSON.stringify({ version: 2, heartbeats: t })
  ).length;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function qr(t) {
  M(new D(
    "platform-logger",
    (e) => new ar(e),
    "PRIVATE"
    /* ComponentType.PRIVATE */
  )), M(new D(
    "heartbeat",
    (e) => new Fr(e),
    "PRIVATE"
    /* ComponentType.PRIVATE */
  )), x(be, We, t), x(be, We, "esm2017"), x("fire-js", "");
}
qr("");
var Wr = "firebase", Gr = "10.9.0";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
x(Wr, Gr, "app");
const pt = "@firebase/installations", Ie = "0.6.5";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const gt = 1e4, mt = `w:${Ie}`, wt = "FIS_v2", zr = "https://firebaseinstallations.googleapis.com/v1", Jr = 60 * 60 * 1e3, Yr = "installations", Xr = "Installations";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Qr = {
  "missing-app-config-values": 'Missing App configuration value: "{$valueName}"',
  "not-registered": "Firebase Installation is not registered.",
  "installation-not-found": "Firebase Installation not found.",
  "request-failed": '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
  "app-offline": "Could not process request. Application offline.",
  "delete-pending-registration": "Can't delete installation while there is a pending registration request."
}, A = new X(Yr, Xr, Qr);
function bt(t) {
  return t instanceof B && t.code.includes(
    "request-failed"
    /* ErrorCode.REQUEST_FAILED */
  );
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function yt({ projectId: t }) {
  return `${zr}/projects/${t}/installations`;
}
function Et(t) {
  return {
    token: t.token,
    requestStatus: 2,
    expiresIn: eo(t.expiresIn),
    creationTime: Date.now()
  };
}
async function _t(t, e) {
  const r = (await e.json()).error;
  return A.create("request-failed", {
    requestName: t,
    serverCode: r.code,
    serverMessage: r.message,
    serverStatus: r.status
  });
}
function vt({ apiKey: t }) {
  return new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-goog-api-key": t
  });
}
function Zr(t, { refreshToken: e }) {
  const n = vt(t);
  return n.append("Authorization", to(e)), n;
}
async function Ct(t) {
  const e = await t();
  return e.status >= 500 && e.status < 600 ? t() : e;
}
function eo(t) {
  return Number(t.replace("s", "000"));
}
function to(t) {
  return `${wt} ${t}`;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function no({ appConfig: t, heartbeatServiceProvider: e }, { fid: n }) {
  const r = yt(t), o = vt(t), s = e.getImmediate({
    optional: !0
  });
  if (s) {
    const h = await s.getHeartbeatsHeader();
    h && o.append("x-firebase-client", h);
  }
  const a = {
    fid: n,
    authVersion: wt,
    appId: t.appId,
    sdkVersion: mt
  }, i = {
    method: "POST",
    headers: o,
    body: JSON.stringify(a)
  }, c = await Ct(() => fetch(r, i));
  if (c.ok) {
    const h = await c.json();
    return {
      fid: h.fid || n,
      registrationStatus: 2,
      refreshToken: h.refreshToken,
      authToken: Et(h.authToken)
    };
  } else
    throw await _t("Create Installation", c);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Tt(t) {
  return new Promise((e) => {
    setTimeout(e, t);
  });
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ro(t) {
  return btoa(String.fromCharCode(...t)).replace(/\+/g, "-").replace(/\//g, "_");
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const oo = /^[cdef][\w-]{21}$/, _e = "";
function so() {
  try {
    const t = new Uint8Array(17);
    (self.crypto || self.msCrypto).getRandomValues(t), t[0] = 112 + t[0] % 16;
    const n = ao(t);
    return oo.test(n) ? n : _e;
  } catch {
    return _e;
  }
}
function ao(t) {
  return ro(t).substr(0, 22);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Z(t) {
  return `${t.appName}!${t.appId}`;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const It = /* @__PURE__ */ new Map();
function St(t, e) {
  const n = Z(t);
  Rt(n, e), io(n, e);
}
function Rt(t, e) {
  const n = It.get(t);
  if (n)
    for (const r of n)
      r(e);
}
function io(t, e) {
  const n = co();
  n && n.postMessage({ key: t, fid: e }), uo();
}
let N = null;
function co() {
  return !N && "BroadcastChannel" in self && (N = new BroadcastChannel("[Firebase] FID Change"), N.onmessage = (t) => {
    Rt(t.data.key, t.data.fid);
  }), N;
}
function uo() {
  It.size === 0 && N && (N.close(), N = null);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const lo = "firebase-installations-database", ho = 1, O = "firebase-installations-store";
let le = null;
function Se() {
  return le || (le = Q(lo, ho, {
    upgrade: (t, e) => {
      switch (e) {
        case 0:
          t.createObjectStore(O);
      }
    }
  })), le;
}
async function G(t, e) {
  const n = Z(t), o = (await Se()).transaction(O, "readwrite"), s = o.objectStore(O), a = await s.get(n);
  return await s.put(e, n), await o.done, (!a || a.fid !== e.fid) && St(t, e.fid), e;
}
async function Nt(t) {
  const e = Z(t), r = (await Se()).transaction(O, "readwrite");
  await r.objectStore(O).delete(e), await r.done;
}
async function ee(t, e) {
  const n = Z(t), o = (await Se()).transaction(O, "readwrite"), s = o.objectStore(O), a = await s.get(n), i = e(a);
  return i === void 0 ? await s.delete(n) : await s.put(i, n), await o.done, i && (!a || a.fid !== i.fid) && St(t, i.fid), i;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Re(t) {
  let e;
  const n = await ee(t.appConfig, (r) => {
    const o = fo(r), s = po(t, o);
    return e = s.registrationPromise, s.installationEntry;
  });
  return n.fid === _e ? { installationEntry: await e } : {
    installationEntry: n,
    registrationPromise: e
  };
}
function fo(t) {
  const e = t || {
    fid: so(),
    registrationStatus: 0
    /* RequestStatus.NOT_STARTED */
  };
  return Dt(e);
}
function po(t, e) {
  if (e.registrationStatus === 0) {
    if (!navigator.onLine) {
      const o = Promise.reject(A.create(
        "app-offline"
        /* ErrorCode.APP_OFFLINE */
      ));
      return {
        installationEntry: e,
        registrationPromise: o
      };
    }
    const n = {
      fid: e.fid,
      registrationStatus: 1,
      registrationTime: Date.now()
    }, r = go(t, n);
    return { installationEntry: n, registrationPromise: r };
  } else
    return e.registrationStatus === 1 ? {
      installationEntry: e,
      registrationPromise: mo(t)
    } : { installationEntry: e };
}
async function go(t, e) {
  try {
    const n = await no(t, e);
    return G(t.appConfig, n);
  } catch (n) {
    throw bt(n) && n.customData.serverCode === 409 ? await Nt(t.appConfig) : await G(t.appConfig, {
      fid: e.fid,
      registrationStatus: 0
      /* RequestStatus.NOT_STARTED */
    }), n;
  }
}
async function mo(t) {
  let e = await Ye(t.appConfig);
  for (; e.registrationStatus === 1; )
    await Tt(100), e = await Ye(t.appConfig);
  if (e.registrationStatus === 0) {
    const { installationEntry: n, registrationPromise: r } = await Re(t);
    return r || n;
  }
  return e;
}
function Ye(t) {
  return ee(t, (e) => {
    if (!e)
      throw A.create(
        "installation-not-found"
        /* ErrorCode.INSTALLATION_NOT_FOUND */
      );
    return Dt(e);
  });
}
function Dt(t) {
  return wo(t) ? {
    fid: t.fid,
    registrationStatus: 0
    /* RequestStatus.NOT_STARTED */
  } : t;
}
function wo(t) {
  return t.registrationStatus === 1 && t.registrationTime + gt < Date.now();
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function bo({ appConfig: t, heartbeatServiceProvider: e }, n) {
  const r = yo(t, n), o = Zr(t, n), s = e.getImmediate({
    optional: !0
  });
  if (s) {
    const h = await s.getHeartbeatsHeader();
    h && o.append("x-firebase-client", h);
  }
  const a = {
    installation: {
      sdkVersion: mt,
      appId: t.appId
    }
  }, i = {
    method: "POST",
    headers: o,
    body: JSON.stringify(a)
  }, c = await Ct(() => fetch(r, i));
  if (c.ok) {
    const h = await c.json();
    return Et(h);
  } else
    throw await _t("Generate Auth Token", c);
}
function yo(t, { fid: e }) {
  return `${yt(t)}/${e}/authTokens:generate`;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Ne(t, e = !1) {
  let n;
  const r = await ee(t.appConfig, (s) => {
    if (!kt(s))
      throw A.create(
        "not-registered"
        /* ErrorCode.NOT_REGISTERED */
      );
    const a = s.authToken;
    if (!e && vo(a))
      return s;
    if (a.requestStatus === 1)
      return n = Eo(t, e), s;
    {
      if (!navigator.onLine)
        throw A.create(
          "app-offline"
          /* ErrorCode.APP_OFFLINE */
        );
      const i = To(s);
      return n = _o(t, i), i;
    }
  });
  return n ? await n : r.authToken;
}
async function Eo(t, e) {
  let n = await Xe(t.appConfig);
  for (; n.authToken.requestStatus === 1; )
    await Tt(100), n = await Xe(t.appConfig);
  const r = n.authToken;
  return r.requestStatus === 0 ? Ne(t, e) : r;
}
function Xe(t) {
  return ee(t, (e) => {
    if (!kt(e))
      throw A.create(
        "not-registered"
        /* ErrorCode.NOT_REGISTERED */
      );
    const n = e.authToken;
    return Io(n) ? Object.assign(Object.assign({}, e), { authToken: {
      requestStatus: 0
      /* RequestStatus.NOT_STARTED */
    } }) : e;
  });
}
async function _o(t, e) {
  try {
    const n = await bo(t, e), r = Object.assign(Object.assign({}, e), { authToken: n });
    return await G(t.appConfig, r), n;
  } catch (n) {
    if (bt(n) && (n.customData.serverCode === 401 || n.customData.serverCode === 404))
      await Nt(t.appConfig);
    else {
      const r = Object.assign(Object.assign({}, e), { authToken: {
        requestStatus: 0
        /* RequestStatus.NOT_STARTED */
      } });
      await G(t.appConfig, r);
    }
    throw n;
  }
}
function kt(t) {
  return t !== void 0 && t.registrationStatus === 2;
}
function vo(t) {
  return t.requestStatus === 2 && !Co(t);
}
function Co(t) {
  const e = Date.now();
  return e < t.creationTime || t.creationTime + t.expiresIn < e + Jr;
}
function To(t) {
  const e = {
    requestStatus: 1,
    requestTime: Date.now()
  };
  return Object.assign(Object.assign({}, t), { authToken: e });
}
function Io(t) {
  return t.requestStatus === 1 && t.requestTime + gt < Date.now();
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function So(t) {
  const e = t, { installationEntry: n, registrationPromise: r } = await Re(e);
  return r ? r.catch(console.error) : Ne(e).catch(console.error), n.fid;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Ro(t, e = !1) {
  const n = t;
  return await No(n), (await Ne(n, e)).token;
}
async function No(t) {
  const { registrationPromise: e } = await Re(t);
  e && await e;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Do(t) {
  if (!t || !t.options)
    throw he("App Configuration");
  if (!t.name)
    throw he("App Name");
  const e = [
    "projectId",
    "apiKey",
    "appId"
  ];
  for (const n of e)
    if (!t.options[n])
      throw he(n);
  return {
    appName: t.name,
    projectId: t.options.projectId,
    apiKey: t.options.apiKey,
    appId: t.options.appId
  };
}
function he(t) {
  return A.create("missing-app-config-values", {
    valueName: t
  });
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const At = "installations", ko = "installations-internal", Ao = (t) => {
  const e = t.getProvider("app").getImmediate(), n = Do(e), r = Te(e, "heartbeat");
  return {
    app: e,
    appConfig: n,
    heartbeatServiceProvider: r,
    _delete: () => Promise.resolve()
  };
}, Oo = (t) => {
  const e = t.getProvider("app").getImmediate(), n = Te(e, At).getImmediate();
  return {
    getId: () => So(n),
    getToken: (o) => Ro(n, o)
  };
};
function $o() {
  M(new D(
    At,
    Ao,
    "PUBLIC"
    /* ComponentType.PUBLIC */
  )), M(new D(
    ko,
    Oo,
    "PRIVATE"
    /* ComponentType.PRIVATE */
  ));
}
$o();
x(pt, Ie);
x(pt, Ie, "esm2017");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ot = "BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4", Lo = "https://fcmregistrations.googleapis.com/v1", $t = "FCM_MSG", Po = "google.c.a.c_id", xo = 3, Mo = 1;
var z;
(function(t) {
  t[t.DATA_MESSAGE = 1] = "DATA_MESSAGE", t[t.DISPLAY_NOTIFICATION = 3] = "DISPLAY_NOTIFICATION";
})(z || (z = {}));
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
var J;
(function(t) {
  t.PUSH_RECEIVED = "push-received", t.NOTIFICATION_CLICKED = "notification-clicked";
})(J || (J = {}));
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function v(t) {
  const e = new Uint8Array(t);
  return btoa(String.fromCharCode(...e)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function Bo(t) {
  const e = "=".repeat((4 - t.length % 4) % 4), n = (t + e).replace(/\-/g, "+").replace(/_/g, "/"), r = atob(n), o = new Uint8Array(r.length);
  for (let s = 0; s < r.length; ++s)
    o[s] = r.charCodeAt(s);
  return o;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const de = "fcm_token_details_db", Uo = 5, Qe = "fcm_token_object_Store";
async function Vo(t) {
  if ("databases" in indexedDB && !(await indexedDB.databases()).map((s) => s.name).includes(de))
    return null;
  let e = null;
  return (await Q(de, Uo, {
    upgrade: async (r, o, s, a) => {
      var i;
      if (o < 2 || !r.objectStoreNames.contains(Qe))
        return;
      const c = a.objectStore(Qe), h = await c.index("fcmSenderId").get(t);
      if (await c.clear(), !!h) {
        if (o === 2) {
          const l = h;
          if (!l.auth || !l.p256dh || !l.endpoint)
            return;
          e = {
            token: l.fcmToken,
            createTime: (i = l.createTime) !== null && i !== void 0 ? i : Date.now(),
            subscriptionOptions: {
              auth: l.auth,
              p256dh: l.p256dh,
              endpoint: l.endpoint,
              swScope: l.swScope,
              vapidKey: typeof l.vapidKey == "string" ? l.vapidKey : v(l.vapidKey)
            }
          };
        } else if (o === 3) {
          const l = h;
          e = {
            token: l.fcmToken,
            createTime: l.createTime,
            subscriptionOptions: {
              auth: v(l.auth),
              p256dh: v(l.p256dh),
              endpoint: l.endpoint,
              swScope: l.swScope,
              vapidKey: v(l.vapidKey)
            }
          };
        } else if (o === 4) {
          const l = h;
          e = {
            token: l.fcmToken,
            createTime: l.createTime,
            subscriptionOptions: {
              auth: v(l.auth),
              p256dh: v(l.p256dh),
              endpoint: l.endpoint,
              swScope: l.swScope,
              vapidKey: v(l.vapidKey)
            }
          };
        }
      }
    }
  })).close(), await ie(de), await ie("fcm_vapid_details_db"), await ie("undefined"), jo(e) ? e : null;
}
function jo(t) {
  if (!t || !t.subscriptionOptions)
    return !1;
  const { subscriptionOptions: e } = t;
  return typeof t.createTime == "number" && t.createTime > 0 && typeof t.token == "string" && t.token.length > 0 && typeof e.auth == "string" && e.auth.length > 0 && typeof e.p256dh == "string" && e.p256dh.length > 0 && typeof e.endpoint == "string" && e.endpoint.length > 0 && typeof e.swScope == "string" && e.swScope.length > 0 && typeof e.vapidKey == "string" && e.vapidKey.length > 0;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Fo = "firebase-messaging-database", Ho = 1, $ = "firebase-messaging-store";
let fe = null;
function De() {
  return fe || (fe = Q(Fo, Ho, {
    upgrade: (t, e) => {
      switch (e) {
        case 0:
          t.createObjectStore($);
      }
    }
  })), fe;
}
async function ke(t) {
  const e = Oe(t), r = await (await De()).transaction($).objectStore($).get(e);
  if (r)
    return r;
  {
    const o = await Vo(t.appConfig.senderId);
    if (o)
      return await Ae(t, o), o;
  }
}
async function Ae(t, e) {
  const n = Oe(t), o = (await De()).transaction($, "readwrite");
  return await o.objectStore($).put(e, n), await o.done, e;
}
async function Ko(t) {
  const e = Oe(t), r = (await De()).transaction($, "readwrite");
  await r.objectStore($).delete(e), await r.done;
}
function Oe({ appConfig: t }) {
  return t.appId;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const qo = {
  "missing-app-config-values": 'Missing App configuration value: "{$valueName}"',
  "only-available-in-window": "This method is available in a Window context.",
  "only-available-in-sw": "This method is available in a service worker context.",
  "permission-default": "The notification permission was not granted and dismissed instead.",
  "permission-blocked": "The notification permission was not granted and blocked instead.",
  "unsupported-browser": "This browser doesn't support the API's required to use the Firebase SDK.",
  "indexed-db-unsupported": "This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",
  "failed-service-worker-registration": "We are unable to register the default service worker. {$browserErrorMessage}",
  "token-subscribe-failed": "A problem occurred while subscribing the user to FCM: {$errorInfo}",
  "token-subscribe-no-token": "FCM returned no token when subscribing the user to push.",
  "token-unsubscribe-failed": "A problem occurred while unsubscribing the user from FCM: {$errorInfo}",
  "token-update-failed": "A problem occurred while updating the user from FCM: {$errorInfo}",
  "token-update-no-token": "FCM returned no token when updating the user to push.",
  "use-sw-after-get-token": "The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.",
  "invalid-sw-registration": "The input to useServiceWorker() must be a ServiceWorkerRegistration.",
  "invalid-bg-handler": "The input to setBackgroundMessageHandler() must be a function.",
  "invalid-vapid-key": "The public VAPID key must be a string.",
  "use-vapid-key-after-get-token": "The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."
}, y = new X("messaging", "Messaging", qo);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Wo(t, e) {
  const n = await Le(t), r = Pt(e), o = {
    method: "POST",
    headers: n,
    body: JSON.stringify(r)
  };
  let s;
  try {
    s = await (await fetch($e(t.appConfig), o)).json();
  } catch (a) {
    throw y.create("token-subscribe-failed", {
      errorInfo: a == null ? void 0 : a.toString()
    });
  }
  if (s.error) {
    const a = s.error.message;
    throw y.create("token-subscribe-failed", {
      errorInfo: a
    });
  }
  if (!s.token)
    throw y.create(
      "token-subscribe-no-token"
      /* ErrorCode.TOKEN_SUBSCRIBE_NO_TOKEN */
    );
  return s.token;
}
async function Go(t, e) {
  const n = await Le(t), r = Pt(e.subscriptionOptions), o = {
    method: "PATCH",
    headers: n,
    body: JSON.stringify(r)
  };
  let s;
  try {
    s = await (await fetch(`${$e(t.appConfig)}/${e.token}`, o)).json();
  } catch (a) {
    throw y.create("token-update-failed", {
      errorInfo: a == null ? void 0 : a.toString()
    });
  }
  if (s.error) {
    const a = s.error.message;
    throw y.create("token-update-failed", {
      errorInfo: a
    });
  }
  if (!s.token)
    throw y.create(
      "token-update-no-token"
      /* ErrorCode.TOKEN_UPDATE_NO_TOKEN */
    );
  return s.token;
}
async function Lt(t, e) {
  const r = {
    method: "DELETE",
    headers: await Le(t)
  };
  try {
    const s = await (await fetch(`${$e(t.appConfig)}/${e}`, r)).json();
    if (s.error) {
      const a = s.error.message;
      throw y.create("token-unsubscribe-failed", {
        errorInfo: a
      });
    }
  } catch (o) {
    throw y.create("token-unsubscribe-failed", {
      errorInfo: o == null ? void 0 : o.toString()
    });
  }
}
function $e({ projectId: t }) {
  return `${Lo}/projects/${t}/registrations`;
}
async function Le({ appConfig: t, installations: e }) {
  const n = await e.getToken();
  return new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-goog-api-key": t.apiKey,
    "x-goog-firebase-installations-auth": `FIS ${n}`
  });
}
function Pt({ p256dh: t, auth: e, endpoint: n, vapidKey: r }) {
  const o = {
    web: {
      endpoint: n,
      auth: e,
      p256dh: t
    }
  };
  return r !== Ot && (o.web.applicationPubKey = r), o;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const zo = 7 * 24 * 60 * 60 * 1e3;
async function Jo(t) {
  const e = await Xo(t.swRegistration, t.vapidKey), n = {
    vapidKey: t.vapidKey,
    swScope: t.swRegistration.scope,
    endpoint: e.endpoint,
    auth: v(e.getKey("auth")),
    p256dh: v(e.getKey("p256dh"))
  }, r = await ke(t.firebaseDependencies);
  if (r) {
    if (Qo(r.subscriptionOptions, n))
      return Date.now() >= r.createTime + zo ? Yo(t, {
        token: r.token,
        createTime: Date.now(),
        subscriptionOptions: n
      }) : r.token;
    try {
      await Lt(t.firebaseDependencies, r.token);
    } catch (o) {
      console.warn(o);
    }
    return Ze(t.firebaseDependencies, n);
  } else
    return Ze(t.firebaseDependencies, n);
}
async function ve(t) {
  const e = await ke(t.firebaseDependencies);
  e && (await Lt(t.firebaseDependencies, e.token), await Ko(t.firebaseDependencies));
  const n = await t.swRegistration.pushManager.getSubscription();
  return n ? n.unsubscribe() : !0;
}
async function Yo(t, e) {
  try {
    const n = await Go(t.firebaseDependencies, e), r = Object.assign(Object.assign({}, e), { token: n, createTime: Date.now() });
    return await Ae(t.firebaseDependencies, r), n;
  } catch (n) {
    throw await ve(t), n;
  }
}
async function Ze(t, e) {
  const r = {
    token: await Wo(t, e),
    createTime: Date.now(),
    subscriptionOptions: e
  };
  return await Ae(t, r), r.token;
}
async function Xo(t, e) {
  const n = await t.pushManager.getSubscription();
  return n || t.pushManager.subscribe({
    userVisibleOnly: !0,
    // Chrome <= 75 doesn't support base64-encoded VAPID key. For backward compatibility, VAPID key
    // submitted to pushManager#subscribe must be of type Uint8Array.
    applicationServerKey: Bo(e)
  });
}
function Qo(t, e) {
  const n = e.vapidKey === t.vapidKey, r = e.endpoint === t.endpoint, o = e.auth === t.auth, s = e.p256dh === t.p256dh;
  return n && r && o && s;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Zo(t) {
  const e = {
    from: t.from,
    // eslint-disable-next-line camelcase
    collapseKey: t.collapse_key,
    // eslint-disable-next-line camelcase
    messageId: t.fcmMessageId
  };
  return es(e, t), ts(e, t), ns(e, t), e;
}
function es(t, e) {
  if (!e.notification)
    return;
  t.notification = {};
  const n = e.notification.title;
  n && (t.notification.title = n);
  const r = e.notification.body;
  r && (t.notification.body = r);
  const o = e.notification.image;
  o && (t.notification.image = o);
  const s = e.notification.icon;
  s && (t.notification.icon = s);
}
function ts(t, e) {
  e.data && (t.data = e.data);
}
function ns(t, e) {
  var n, r, o, s, a;
  if (!e.fcmOptions && !(!((n = e.notification) === null || n === void 0) && n.click_action))
    return;
  t.fcmOptions = {};
  const i = (o = (r = e.fcmOptions) === null || r === void 0 ? void 0 : r.link) !== null && o !== void 0 ? o : (s = e.notification) === null || s === void 0 ? void 0 : s.click_action;
  i && (t.fcmOptions.link = i);
  const c = (a = e.fcmOptions) === null || a === void 0 ? void 0 : a.analytics_label;
  c && (t.fcmOptions.analyticsLabel = c);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function rs(t) {
  return typeof t == "object" && !!t && Po in t;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function os(t) {
  return new Promise((e) => {
    setTimeout(e, t);
  });
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
xt("hts/frbslgigp.ogepscmv/ieo/eaylg", "tp:/ieaeogn-agolai.o/1frlglgc/o");
xt("AzSCbw63g1R0nCw85jG8", "Iaya3yLKwmgvh7cF0q4");
async function ss(t, e) {
  const n = as(e, await t.firebaseDependencies.installations.getId());
  is(t, n, e.productId);
}
function as(t, e) {
  var n, r;
  const o = {};
  return t.from && (o.project_number = t.from), t.fcmMessageId && (o.message_id = t.fcmMessageId), o.instance_id = e, t.notification ? o.message_type = z.DISPLAY_NOTIFICATION.toString() : o.message_type = z.DATA_MESSAGE.toString(), o.sdk_platform = xo.toString(), o.package_name = self.origin.replace(/(^\w+:|^)\/\//, ""), t.collapse_key && (o.collapse_key = t.collapse_key), o.event = Mo.toString(), !((n = t.fcmOptions) === null || n === void 0) && n.analytics_label && (o.analytics_label = (r = t.fcmOptions) === null || r === void 0 ? void 0 : r.analytics_label), o;
}
function is(t, e, n) {
  const r = {};
  r.event_time_ms = Math.floor(Date.now()).toString(), r.source_extension_json_proto3 = JSON.stringify(e), n && (r.compliance_data = cs(n)), t.logEvents.push(r);
}
function cs(t) {
  return {
    privacy_context: {
      prequest: {
        origin_associated_product_id: t
      }
    }
  };
}
function xt(t, e) {
  const n = [];
  for (let r = 0; r < t.length; r++)
    n.push(t.charAt(r)), r < e.length && n.push(e.charAt(r));
  return n.join("");
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function us(t, e) {
  var n, r;
  const { newSubscription: o } = t;
  if (!o) {
    await ve(e);
    return;
  }
  const s = await ke(e.firebaseDependencies);
  await ve(e), e.vapidKey = (r = (n = s == null ? void 0 : s.subscriptionOptions) === null || n === void 0 ? void 0 : n.vapidKey) !== null && r !== void 0 ? r : Ot, await Jo(e);
}
async function ls(t, e) {
  const n = fs(t);
  if (!n)
    return;
  e.deliveryMetricsExportedToBigQueryEnabled && await ss(e, n);
  const r = await Mt();
  if (gs(r))
    return ms(r, n);
  if (n.notification && await ws(ds(n)), !!e && e.onBackgroundMessageHandler) {
    const o = Zo(n);
    typeof e.onBackgroundMessageHandler == "function" ? await e.onBackgroundMessageHandler(o) : e.onBackgroundMessageHandler.next(o);
  }
}
async function hs(t) {
  var e, n;
  const r = (n = (e = t.notification) === null || e === void 0 ? void 0 : e.data) === null || n === void 0 ? void 0 : n[$t];
  if (r) {
    if (t.action)
      return;
  } else
    return;
  t.stopImmediatePropagation(), t.notification.close();
  const o = bs(r);
  if (!o)
    return;
  const s = new URL(o, self.location.href), a = new URL(self.location.origin);
  if (s.host !== a.host)
    return;
  let i = await ps(s);
  if (i ? i = await i.focus() : (i = await self.clients.openWindow(o), await os(3e3)), !!i)
    return r.messageType = J.NOTIFICATION_CLICKED, r.isFirebaseMessaging = !0, i.postMessage(r);
}
function ds(t) {
  const e = Object.assign({}, t.notification);
  return e.data = {
    [$t]: t
  }, e;
}
function fs({ data: t }) {
  if (!t)
    return null;
  try {
    return t.json();
  } catch {
    return null;
  }
}
async function ps(t) {
  const e = await Mt();
  for (const n of e) {
    const r = new URL(n.url, self.location.href);
    if (t.host === r.host)
      return n;
  }
  return null;
}
function gs(t) {
  return t.some((e) => e.visibilityState === "visible" && // Ignore chrome-extension clients as that matches the background pages of extensions, which
  // are always considered visible for some reason.
  !e.url.startsWith("chrome-extension://"));
}
function ms(t, e) {
  e.isFirebaseMessaging = !0, e.messageType = J.PUSH_RECEIVED;
  for (const n of t)
    n.postMessage(e);
}
function Mt() {
  return self.clients.matchAll({
    type: "window",
    includeUncontrolled: !0
    // TS doesn't know that "type: 'window'" means it'll return WindowClient[]
  });
}
function ws(t) {
  var e;
  const { actions: n } = t, { maxActions: r } = Notification;
  return n && r && n.length > r && console.warn(`This browser only supports ${r} actions. The remaining actions will not be displayed.`), self.registration.showNotification(
    /* title= */
    (e = t.title) !== null && e !== void 0 ? e : "",
    t
  );
}
function bs(t) {
  var e, n, r;
  const o = (n = (e = t.fcmOptions) === null || e === void 0 ? void 0 : e.link) !== null && n !== void 0 ? n : (r = t.notification) === null || r === void 0 ? void 0 : r.click_action;
  return o || (rs(t.data) ? self.location.origin : null);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ys(t) {
  if (!t || !t.options)
    throw pe("App Configuration Object");
  if (!t.name)
    throw pe("App Name");
  const e = [
    "projectId",
    "apiKey",
    "appId",
    "messagingSenderId"
  ], { options: n } = t;
  for (const r of e)
    if (!n[r])
      throw pe(r);
  return {
    appName: t.name,
    projectId: n.projectId,
    apiKey: n.apiKey,
    appId: n.appId,
    senderId: n.messagingSenderId
  };
}
function pe(t) {
  return y.create("missing-app-config-values", {
    valueName: t
  });
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Es {
  constructor(e, n, r) {
    this.deliveryMetricsExportedToBigQueryEnabled = !1, this.onBackgroundMessageHandler = null, this.onMessageHandler = null, this.logEvents = [], this.isLogServiceStarted = !1;
    const o = ys(e);
    this.firebaseDependencies = {
      app: e,
      appConfig: o,
      installations: n,
      analyticsProvider: r
    };
  }
  _delete() {
    return Promise.resolve();
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const _s = (t) => {
  const e = new Es(t.getProvider("app").getImmediate(), t.getProvider("installations-internal").getImmediate(), t.getProvider("analytics-internal"));
  return self.addEventListener("push", (n) => {
    n.waitUntil(ls(n, e));
  }), self.addEventListener("pushsubscriptionchange", (n) => {
    n.waitUntil(us(n, e));
  }), self.addEventListener("notificationclick", (n) => {
    n.waitUntil(hs(n));
  }), e;
};
function vs() {
  M(new D(
    "messaging-sw",
    _s,
    "PUBLIC"
    /* ComponentType.PUBLIC */
  ));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Cs() {
  return at() && await it() && "PushManager" in self && "Notification" in self && ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification") && PushSubscription.prototype.hasOwnProperty("getKey");
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Ts(t, e) {
  if (self.document !== void 0)
    throw y.create(
      "only-available-in-sw"
      /* ErrorCode.AVAILABLE_IN_SW */
    );
  return t.onBackgroundMessageHandler = e, () => {
    t.onBackgroundMessageHandler = null;
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Is(t = xr()) {
  return Cs().then((e) => {
    if (!e)
      throw y.create(
        "unsupported-browser"
        /* ErrorCode.UNSUPPORTED_BROWSER */
      );
  }, (e) => {
    throw y.create(
      "indexed-db-unsupported"
      /* ErrorCode.INDEXED_DB_UNSUPPORTED */
    );
  }), Te(ct(t), "messaging-sw").getImmediate();
}
function Ss(t, e) {
  return t = ct(t), Ts(t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
vs();
Sn([{"revision":null,"url":"assets/Harbor-17dd4081.js"},{"revision":null,"url":"assets/index-9d4f1a09.css"},{"revision":null,"url":"assets/Kafka-23dfd173.js"},{"revision":null,"url":"assets/Kibana-373362a0.js"},{"revision":null,"url":"assets/Kubernetes-76875445.js"},{"revision":"bd7d971f4f74201ec4cb5253e6db8746","url":"index.html"},{"revision":"615154b21d18141b388b64d08da82118","url":"manifest.webmanifest"}]);
Tn();
const Rs = {
  apiKey: "AIzaSyCRthXUaRcPNWmYYq3NokfWVBRzm8uC09U",
  authDomain: "elpsykonngroo.firebaseapp.com",
  projectId: "elpsykonngroo",
  storageBucket: "elpsykonngroo.appspot.com",
  messagingSenderId: "1035237568740",
  appId: "1:1035237568740:web:75eb3c160355379a97bcf1"
}, Ns = ht(Rs), Ds = Is(Ns);
self.skipWaiting();
Rn();
self.addEventListener("fetch", (t) => {
  if (t.request.url.includes("&X-Amz-Expires")) {
    const r = t.request.headers.get("Range");
    let o;
    o || (o = new Request(t.request)), t.respondWith(
      fetch(o, { mode: "cors", credentials: "same-origin" }).then(async (s) => {
        const i = new URL(t.request.url).pathname.slice(1).split("/")[1], c = await Bt("s3", 1, ["s3", "aes"]), h = await Os(c, "aes", "key-" + decodeURIComponent(i), "readwrite", "");
        if (!h || !s.body || typeof s.body.getReader != "function")
          return s;
        {
          let l = new Uint8Array(0);
          const d = s.body.getReader();
          let m = s.headers.get("ETag"), w = new Uint8Array(5242908), E = 0;
          async function Pe() {
            const te = w.subarray(0, E), ne = await As(te, h, decodeURIComponent(i), "AES-GCM");
            l = ks(l, new Uint8Array(ne)), w.fill(0), E = 0;
          }
          let L = new Headers();
          L.set("Connection", "keep-alive"), L.set("Content-Type", "binary/octet-stream");
          const xe = async ({ done: te, value: ne }) => {
            if (te) {
              E >= 0 && await Pe();
              return;
            }
            const P = new Uint8Array(ne);
            let H = w.byteLength - E;
            return P.byteLength <= H ? (w.set(P, E), E += P.byteLength) : (w.set(P.subarray(0, H), E), E = w.byteLength, await Pe(), w.set(P.subarray(H), 0), E = P.byteLength - H), d.read().then(xe);
          };
          let Me;
          return await d.read().then(xe), r ? (L.set("Content-Length", l.length), L.set("ETag", m), Me = 200) : L.set("Content-Length", l.length), console.log(l), new Response(l, {
            status: Me,
            statusText: s.statusText,
            headers: L
          });
        }
      }).catch((s) => (console.error("Fetch error:", s), new Response(null, { status: 500, statusText: "Internal Server Error" })))
    );
  }
});
function ks(t, e) {
  const n = new Uint8Array(t.length + e.length);
  return n.set(t, 0), n.set(e, t.length), n;
}
async function As(t, e, n, r) {
  let o;
  r == "AES-GCM" ? (o = t.slice(0, 12), t = t.slice(12, t.length)) : (o = t.slice(0, 16), t = t.slice(16, t.length));
  let s = {
    name: r,
    iv: o
  }, a;
  try {
    a = await crypto.subtle.decrypt(
      s,
      e,
      t
    );
  } catch (i) {
    console.log(i);
    const c = await Bt("s3", 1, ["s3", "aes"]);
    return await $s(c, "aes", "key-" + n, "readwrite"), new Uint8Array(0);
  }
  return a;
}
function Bt(t, e, n) {
  return new Promise((r, o) => {
    var s;
    e != "" ? s = indexedDB.open(t, e) : s = indexedDB.open(t), s.onsuccess = function(a) {
      const i = s.result;
      r(i);
    }, s.onupgradeneeded = function(a) {
      const i = s.result;
      for (let c of n)
        i.objectStoreNames.contains(c) || i.createObjectStore(c);
    }, s.onerror = function(a) {
      const i = s.error;
      o(i);
    };
  });
}
function Os(t, e, n, r, o) {
  return (r == "" || r == null) && (r = "readwrite"), new Promise((s, a) => {
    const c = t.transaction(e, r).objectStore(e);
    var h;
    o == "all" ? h = c.getAll() : h = c.get(n), h.onsuccess = function(l) {
      const d = h.result;
      s(d);
    }, h.onerror = function(l) {
      const d = h.error;
      a(d);
    };
  });
}
function $s(t, e, n, r) {
  return (r == "" || r == null) && (r = "readwrite"), new Promise((o, s) => {
    const c = t.transaction(e, r).objectStore(e).delete(n);
    c.onsuccess = function(h) {
      const l = c.result;
      o(l);
    }, c.onerror = function(h) {
      const l = c.error;
      s(l);
    };
  });
}
Ss(Ds, (t) => {
  Notification.permission !== "granted" ? Notification.requestPermission().then((e) => {
    e === "granted" && console.log(1);
  }) : (console.log(2), self.clients.matchAll().then((e) => {
    e.forEach((n) => {
      n.postMessage("message");
    });
  }));
});
