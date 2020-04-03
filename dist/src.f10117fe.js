// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/reflect-metadata/Reflect.js":[function(require,module,exports) {
var global = arguments[3];
var process = require("process");
/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;

(function (Reflect) {
  // Metadata Proposal
  // https://rbuckton.github.io/reflect-metadata/
  (function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : Function("return this;")();
    var exporter = makeExporter(Reflect);

    if (typeof root.Reflect === "undefined") {
      root.Reflect = Reflect;
    } else {
      exporter = makeExporter(root.Reflect, exporter);
    }

    factory(exporter);

    function makeExporter(target, previous) {
      return function (key, value) {
        if (typeof target[key] !== "function") {
          Object.defineProperty(target, key, {
            configurable: true,
            writable: true,
            value: value
          });
        }

        if (previous) previous(key, value);
      };
    }
  })(function (exporter) {
    var hasOwn = Object.prototype.hasOwnProperty; // feature test for Symbol support

    var supportsSymbol = typeof Symbol === "function";
    var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
    var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
    var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support

    var supportsProto = {
      __proto__: []
    } instanceof Array; // feature test for __proto__ support

    var downLevel = !supportsCreate && !supportsProto;
    var HashMap = {
      // create an object in dictionary mode (a.k.a. "slow" mode in v8)
      create: supportsCreate ? function () {
        return MakeDictionary(Object.create(null));
      } : supportsProto ? function () {
        return MakeDictionary({
          __proto__: null
        });
      } : function () {
        return MakeDictionary({});
      },
      has: downLevel ? function (map, key) {
        return hasOwn.call(map, key);
      } : function (map, key) {
        return key in map;
      },
      get: downLevel ? function (map, key) {
        return hasOwn.call(map, key) ? map[key] : undefined;
      } : function (map, key) {
        return map[key];
      }
    }; // Load global or shim versions of Map, Set, and WeakMap

    var functionPrototype = Object.getPrototypeOf(Function);
    var usePolyfill = typeof process === "object" && process.env && undefined === "true";

    var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();

    var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();

    var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill(); // [[Metadata]] internal slot
    // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots


    var Metadata = new _WeakMap();
    /**
     * Applies a set of decorators to a property of a target object.
     * @param decorators An array of decorators.
     * @param target The target object.
     * @param propertyKey (Optional) The property key to decorate.
     * @param attributes (Optional) The property descriptor for the target key.
     * @remarks Decorators are applied in reverse order.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     Example = Reflect.decorate(decoratorsArray, Example);
     *
     *     // property (on constructor)
     *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
     *
     *     // property (on prototype)
     *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
     *
     *     // method (on constructor)
     *     Object.defineProperty(Example, "staticMethod",
     *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
     *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
     *
     *     // method (on prototype)
     *     Object.defineProperty(Example.prototype, "method",
     *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
     *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
     *
     */

    function decorate(decorators, target, propertyKey, attributes) {
      if (!IsUndefined(propertyKey)) {
        if (!IsArray(decorators)) throw new TypeError();
        if (!IsObject(target)) throw new TypeError();
        if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes)) throw new TypeError();
        if (IsNull(attributes)) attributes = undefined;
        propertyKey = ToPropertyKey(propertyKey);
        return DecorateProperty(decorators, target, propertyKey, attributes);
      } else {
        if (!IsArray(decorators)) throw new TypeError();
        if (!IsConstructor(target)) throw new TypeError();
        return DecorateConstructor(decorators, target);
      }
    }

    exporter("decorate", decorate); // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
    // https://rbuckton.github.io/reflect-metadata/#reflect.metadata

    /**
     * A default metadata decorator factory that can be used on a class, class member, or parameter.
     * @param metadataKey The key for the metadata entry.
     * @param metadataValue The value for the metadata entry.
     * @returns A decorator function.
     * @remarks
     * If `metadataKey` is already defined for the target and target key, the
     * metadataValue for that key will be overwritten.
     * @example
     *
     *     // constructor
     *     @Reflect.metadata(key, value)
     *     class Example {
     *     }
     *
     *     // property (on constructor, TypeScript only)
     *     class Example {
     *         @Reflect.metadata(key, value)
     *         static staticProperty;
     *     }
     *
     *     // property (on prototype, TypeScript only)
     *     class Example {
     *         @Reflect.metadata(key, value)
     *         property;
     *     }
     *
     *     // method (on constructor)
     *     class Example {
     *         @Reflect.metadata(key, value)
     *         static staticMethod() { }
     *     }
     *
     *     // method (on prototype)
     *     class Example {
     *         @Reflect.metadata(key, value)
     *         method() { }
     *     }
     *
     */

    function metadata(metadataKey, metadataValue) {
      function decorator(target, propertyKey) {
        if (!IsObject(target)) throw new TypeError();
        if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey)) throw new TypeError();
        OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
      }

      return decorator;
    }

    exporter("metadata", metadata);
    /**
     * Define a unique metadata entry on the target.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param metadataValue A value that contains attached metadata.
     * @param target The target object on which to define metadata.
     * @param propertyKey (Optional) The property key for the target.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     Reflect.defineMetadata("custom:annotation", options, Example);
     *
     *     // property (on constructor)
     *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
     *
     *     // property (on prototype)
     *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
     *
     *     // method (on constructor)
     *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
     *
     *     // method (on prototype)
     *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
     *
     *     // decorator factory as metadata-producing annotation.
     *     function MyAnnotation(options): Decorator {
     *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
     *     }
     *
     */

    function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }

    exporter("defineMetadata", defineMetadata);
    /**
     * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.hasMetadata("custom:annotation", Example);
     *
     *     // property (on constructor)
     *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
     *
     */

    function hasMetadata(metadataKey, target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }

    exporter("hasMetadata", hasMetadata);
    /**
     * Gets a value indicating whether the target object has the provided metadata key defined.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
     *
     *     // property (on constructor)
     *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
     *
     */

    function hasOwnMetadata(metadataKey, target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }

    exporter("hasOwnMetadata", hasOwnMetadata);
    /**
     * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.getMetadata("custom:annotation", Example);
     *
     *     // property (on constructor)
     *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
     *
     */

    function getMetadata(metadataKey, target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }

    exporter("getMetadata", getMetadata);
    /**
     * Gets the metadata value for the provided metadata key on the target object.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.getOwnMetadata("custom:annotation", Example);
     *
     *     // property (on constructor)
     *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
     *
     */

    function getOwnMetadata(metadataKey, target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }

    exporter("getOwnMetadata", getOwnMetadata);
    /**
     * Gets the metadata keys defined on the target object or its prototype chain.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns An array of unique metadata keys.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.getMetadataKeys(Example);
     *
     *     // property (on constructor)
     *     result = Reflect.getMetadataKeys(Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.getMetadataKeys(Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.getMetadataKeys(Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.getMetadataKeys(Example.prototype, "method");
     *
     */

    function getMetadataKeys(target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryMetadataKeys(target, propertyKey);
    }

    exporter("getMetadataKeys", getMetadataKeys);
    /**
     * Gets the unique metadata keys defined on the target object.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns An array of unique metadata keys.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.getOwnMetadataKeys(Example);
     *
     *     // property (on constructor)
     *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
     *
     */

    function getOwnMetadataKeys(target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryOwnMetadataKeys(target, propertyKey);
    }

    exporter("getOwnMetadataKeys", getOwnMetadataKeys);
    /**
     * Deletes the metadata entry from the target object with the provided key.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns `true` if the metadata entry was found and deleted; otherwise, false.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.deleteMetadata("custom:annotation", Example);
     *
     *     // property (on constructor)
     *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
     *
     */

    function deleteMetadata(metadataKey, target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      var metadataMap = GetOrCreateMetadataMap(target, propertyKey,
      /*Create*/
      false);
      if (IsUndefined(metadataMap)) return false;
      if (!metadataMap.delete(metadataKey)) return false;
      if (metadataMap.size > 0) return true;
      var targetMetadata = Metadata.get(target);
      targetMetadata.delete(propertyKey);
      if (targetMetadata.size > 0) return true;
      Metadata.delete(target);
      return true;
    }

    exporter("deleteMetadata", deleteMetadata);

    function DecorateConstructor(decorators, target) {
      for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        var decorated = decorator(target);

        if (!IsUndefined(decorated) && !IsNull(decorated)) {
          if (!IsConstructor(decorated)) throw new TypeError();
          target = decorated;
        }
      }

      return target;
    }

    function DecorateProperty(decorators, target, propertyKey, descriptor) {
      for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        var decorated = decorator(target, propertyKey, descriptor);

        if (!IsUndefined(decorated) && !IsNull(decorated)) {
          if (!IsObject(decorated)) throw new TypeError();
          descriptor = decorated;
        }
      }

      return descriptor;
    }

    function GetOrCreateMetadataMap(O, P, Create) {
      var targetMetadata = Metadata.get(O);

      if (IsUndefined(targetMetadata)) {
        if (!Create) return undefined;
        targetMetadata = new _Map();
        Metadata.set(O, targetMetadata);
      }

      var metadataMap = targetMetadata.get(P);

      if (IsUndefined(metadataMap)) {
        if (!Create) return undefined;
        metadataMap = new _Map();
        targetMetadata.set(P, metadataMap);
      }

      return metadataMap;
    } // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata


    function OrdinaryHasMetadata(MetadataKey, O, P) {
      var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
      if (hasOwn) return true;
      var parent = OrdinaryGetPrototypeOf(O);
      if (!IsNull(parent)) return OrdinaryHasMetadata(MetadataKey, parent, P);
      return false;
    } // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata


    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
      var metadataMap = GetOrCreateMetadataMap(O, P,
      /*Create*/
      false);
      if (IsUndefined(metadataMap)) return false;
      return ToBoolean(metadataMap.has(MetadataKey));
    } // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata


    function OrdinaryGetMetadata(MetadataKey, O, P) {
      var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
      if (hasOwn) return OrdinaryGetOwnMetadata(MetadataKey, O, P);
      var parent = OrdinaryGetPrototypeOf(O);
      if (!IsNull(parent)) return OrdinaryGetMetadata(MetadataKey, parent, P);
      return undefined;
    } // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata


    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
      var metadataMap = GetOrCreateMetadataMap(O, P,
      /*Create*/
      false);
      if (IsUndefined(metadataMap)) return undefined;
      return metadataMap.get(MetadataKey);
    } // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata


    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
      var metadataMap = GetOrCreateMetadataMap(O, P,
      /*Create*/
      true);
      metadataMap.set(MetadataKey, MetadataValue);
    } // 3.1.6.1 OrdinaryMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys


    function OrdinaryMetadataKeys(O, P) {
      var ownKeys = OrdinaryOwnMetadataKeys(O, P);
      var parent = OrdinaryGetPrototypeOf(O);
      if (parent === null) return ownKeys;
      var parentKeys = OrdinaryMetadataKeys(parent, P);
      if (parentKeys.length <= 0) return ownKeys;
      if (ownKeys.length <= 0) return parentKeys;
      var set = new _Set();
      var keys = [];

      for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
        var key = ownKeys_1[_i];
        var hasKey = set.has(key);

        if (!hasKey) {
          set.add(key);
          keys.push(key);
        }
      }

      for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
        var key = parentKeys_1[_a];
        var hasKey = set.has(key);

        if (!hasKey) {
          set.add(key);
          keys.push(key);
        }
      }

      return keys;
    } // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys


    function OrdinaryOwnMetadataKeys(O, P) {
      var keys = [];
      var metadataMap = GetOrCreateMetadataMap(O, P,
      /*Create*/
      false);
      if (IsUndefined(metadataMap)) return keys;
      var keysObj = metadataMap.keys();
      var iterator = GetIterator(keysObj);
      var k = 0;

      while (true) {
        var next = IteratorStep(iterator);

        if (!next) {
          keys.length = k;
          return keys;
        }

        var nextValue = IteratorValue(next);

        try {
          keys[k] = nextValue;
        } catch (e) {
          try {
            IteratorClose(iterator);
          } finally {
            throw e;
          }
        }

        k++;
      }
    } // 6 ECMAScript Data Typ0es and Values
    // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values


    function Type(x) {
      if (x === null) return 1
      /* Null */
      ;

      switch (typeof x) {
        case "undefined":
          return 0
          /* Undefined */
          ;

        case "boolean":
          return 2
          /* Boolean */
          ;

        case "string":
          return 3
          /* String */
          ;

        case "symbol":
          return 4
          /* Symbol */
          ;

        case "number":
          return 5
          /* Number */
          ;

        case "object":
          return x === null ? 1
          /* Null */
          : 6
          /* Object */
          ;

        default:
          return 6
          /* Object */
          ;
      }
    } // 6.1.1 The Undefined Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type


    function IsUndefined(x) {
      return x === undefined;
    } // 6.1.2 The Null Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type


    function IsNull(x) {
      return x === null;
    } // 6.1.5 The Symbol Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type


    function IsSymbol(x) {
      return typeof x === "symbol";
    } // 6.1.7 The Object Type
    // https://tc39.github.io/ecma262/#sec-object-type


    function IsObject(x) {
      return typeof x === "object" ? x !== null : typeof x === "function";
    } // 7.1 Type Conversion
    // https://tc39.github.io/ecma262/#sec-type-conversion
    // 7.1.1 ToPrimitive(input [, PreferredType])
    // https://tc39.github.io/ecma262/#sec-toprimitive


    function ToPrimitive(input, PreferredType) {
      switch (Type(input)) {
        case 0
        /* Undefined */
        :
          return input;

        case 1
        /* Null */
        :
          return input;

        case 2
        /* Boolean */
        :
          return input;

        case 3
        /* String */
        :
          return input;

        case 4
        /* Symbol */
        :
          return input;

        case 5
        /* Number */
        :
          return input;
      }

      var hint = PreferredType === 3
      /* String */
      ? "string" : PreferredType === 5
      /* Number */
      ? "number" : "default";
      var exoticToPrim = GetMethod(input, toPrimitiveSymbol);

      if (exoticToPrim !== undefined) {
        var result = exoticToPrim.call(input, hint);
        if (IsObject(result)) throw new TypeError();
        return result;
      }

      return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
    } // 7.1.1.1 OrdinaryToPrimitive(O, hint)
    // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive


    function OrdinaryToPrimitive(O, hint) {
      if (hint === "string") {
        var toString_1 = O.toString;

        if (IsCallable(toString_1)) {
          var result = toString_1.call(O);
          if (!IsObject(result)) return result;
        }

        var valueOf = O.valueOf;

        if (IsCallable(valueOf)) {
          var result = valueOf.call(O);
          if (!IsObject(result)) return result;
        }
      } else {
        var valueOf = O.valueOf;

        if (IsCallable(valueOf)) {
          var result = valueOf.call(O);
          if (!IsObject(result)) return result;
        }

        var toString_2 = O.toString;

        if (IsCallable(toString_2)) {
          var result = toString_2.call(O);
          if (!IsObject(result)) return result;
        }
      }

      throw new TypeError();
    } // 7.1.2 ToBoolean(argument)
    // https://tc39.github.io/ecma262/2016/#sec-toboolean


    function ToBoolean(argument) {
      return !!argument;
    } // 7.1.12 ToString(argument)
    // https://tc39.github.io/ecma262/#sec-tostring


    function ToString(argument) {
      return "" + argument;
    } // 7.1.14 ToPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-topropertykey


    function ToPropertyKey(argument) {
      var key = ToPrimitive(argument, 3
      /* String */
      );
      if (IsSymbol(key)) return key;
      return ToString(key);
    } // 7.2 Testing and Comparison Operations
    // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
    // 7.2.2 IsArray(argument)
    // https://tc39.github.io/ecma262/#sec-isarray


    function IsArray(argument) {
      return Array.isArray ? Array.isArray(argument) : argument instanceof Object ? argument instanceof Array : Object.prototype.toString.call(argument) === "[object Array]";
    } // 7.2.3 IsCallable(argument)
    // https://tc39.github.io/ecma262/#sec-iscallable


    function IsCallable(argument) {
      // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
      return typeof argument === "function";
    } // 7.2.4 IsConstructor(argument)
    // https://tc39.github.io/ecma262/#sec-isconstructor


    function IsConstructor(argument) {
      // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
      return typeof argument === "function";
    } // 7.2.7 IsPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-ispropertykey


    function IsPropertyKey(argument) {
      switch (Type(argument)) {
        case 3
        /* String */
        :
          return true;

        case 4
        /* Symbol */
        :
          return true;

        default:
          return false;
      }
    } // 7.3 Operations on Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-objects
    // 7.3.9 GetMethod(V, P)
    // https://tc39.github.io/ecma262/#sec-getmethod


    function GetMethod(V, P) {
      var func = V[P];
      if (func === undefined || func === null) return undefined;
      if (!IsCallable(func)) throw new TypeError();
      return func;
    } // 7.4 Operations on Iterator Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects


    function GetIterator(obj) {
      var method = GetMethod(obj, iteratorSymbol);
      if (!IsCallable(method)) throw new TypeError(); // from Call

      var iterator = method.call(obj);
      if (!IsObject(iterator)) throw new TypeError();
      return iterator;
    } // 7.4.4 IteratorValue(iterResult)
    // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue


    function IteratorValue(iterResult) {
      return iterResult.value;
    } // 7.4.5 IteratorStep(iterator)
    // https://tc39.github.io/ecma262/#sec-iteratorstep


    function IteratorStep(iterator) {
      var result = iterator.next();
      return result.done ? false : result;
    } // 7.4.6 IteratorClose(iterator, completion)
    // https://tc39.github.io/ecma262/#sec-iteratorclose


    function IteratorClose(iterator) {
      var f = iterator["return"];
      if (f) f.call(iterator);
    } // 9.1 Ordinary Object Internal Methods and Internal Slots
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
    // 9.1.1.1 OrdinaryGetPrototypeOf(O)
    // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof


    function OrdinaryGetPrototypeOf(O) {
      var proto = Object.getPrototypeOf(O);
      if (typeof O !== "function" || O === functionPrototype) return proto; // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
      // Try to determine the superclass constructor. Compatible implementations
      // must either set __proto__ on a subclass constructor to the superclass constructor,
      // or ensure each class has a valid `constructor` property on its prototype that
      // points back to the constructor.
      // If this is not the same as Function.[[Prototype]], then this is definately inherited.
      // This is the case when in ES6 or when using __proto__ in a compatible browser.

      if (proto !== functionPrototype) return proto; // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.

      var prototype = O.prototype;
      var prototypeProto = prototype && Object.getPrototypeOf(prototype);
      if (prototypeProto == null || prototypeProto === Object.prototype) return proto; // If the constructor was not a function, then we cannot determine the heritage.

      var constructor = prototypeProto.constructor;
      if (typeof constructor !== "function") return proto; // If we have some kind of self-reference, then we cannot determine the heritage.

      if (constructor === O) return proto; // we have a pretty good guess at the heritage.

      return constructor;
    } // naive Map shim


    function CreateMapPolyfill() {
      var cacheSentinel = {};
      var arraySentinel = [];

      var MapIterator =
      /** @class */
      function () {
        function MapIterator(keys, values, selector) {
          this._index = 0;
          this._keys = keys;
          this._values = values;
          this._selector = selector;
        }

        MapIterator.prototype["@@iterator"] = function () {
          return this;
        };

        MapIterator.prototype[iteratorSymbol] = function () {
          return this;
        };

        MapIterator.prototype.next = function () {
          var index = this._index;

          if (index >= 0 && index < this._keys.length) {
            var result = this._selector(this._keys[index], this._values[index]);

            if (index + 1 >= this._keys.length) {
              this._index = -1;
              this._keys = arraySentinel;
              this._values = arraySentinel;
            } else {
              this._index++;
            }

            return {
              value: result,
              done: false
            };
          }

          return {
            value: undefined,
            done: true
          };
        };

        MapIterator.prototype.throw = function (error) {
          if (this._index >= 0) {
            this._index = -1;
            this._keys = arraySentinel;
            this._values = arraySentinel;
          }

          throw error;
        };

        MapIterator.prototype.return = function (value) {
          if (this._index >= 0) {
            this._index = -1;
            this._keys = arraySentinel;
            this._values = arraySentinel;
          }

          return {
            value: value,
            done: true
          };
        };

        return MapIterator;
      }();

      return (
        /** @class */
        function () {
          function Map() {
            this._keys = [];
            this._values = [];
            this._cacheKey = cacheSentinel;
            this._cacheIndex = -2;
          }

          Object.defineProperty(Map.prototype, "size", {
            get: function () {
              return this._keys.length;
            },
            enumerable: true,
            configurable: true
          });

          Map.prototype.has = function (key) {
            return this._find(key,
            /*insert*/
            false) >= 0;
          };

          Map.prototype.get = function (key) {
            var index = this._find(key,
            /*insert*/
            false);

            return index >= 0 ? this._values[index] : undefined;
          };

          Map.prototype.set = function (key, value) {
            var index = this._find(key,
            /*insert*/
            true);

            this._values[index] = value;
            return this;
          };

          Map.prototype.delete = function (key) {
            var index = this._find(key,
            /*insert*/
            false);

            if (index >= 0) {
              var size = this._keys.length;

              for (var i = index + 1; i < size; i++) {
                this._keys[i - 1] = this._keys[i];
                this._values[i - 1] = this._values[i];
              }

              this._keys.length--;
              this._values.length--;

              if (key === this._cacheKey) {
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
              }

              return true;
            }

            return false;
          };

          Map.prototype.clear = function () {
            this._keys.length = 0;
            this._values.length = 0;
            this._cacheKey = cacheSentinel;
            this._cacheIndex = -2;
          };

          Map.prototype.keys = function () {
            return new MapIterator(this._keys, this._values, getKey);
          };

          Map.prototype.values = function () {
            return new MapIterator(this._keys, this._values, getValue);
          };

          Map.prototype.entries = function () {
            return new MapIterator(this._keys, this._values, getEntry);
          };

          Map.prototype["@@iterator"] = function () {
            return this.entries();
          };

          Map.prototype[iteratorSymbol] = function () {
            return this.entries();
          };

          Map.prototype._find = function (key, insert) {
            if (this._cacheKey !== key) {
              this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
            }

            if (this._cacheIndex < 0 && insert) {
              this._cacheIndex = this._keys.length;

              this._keys.push(key);

              this._values.push(undefined);
            }

            return this._cacheIndex;
          };

          return Map;
        }()
      );

      function getKey(key, _) {
        return key;
      }

      function getValue(_, value) {
        return value;
      }

      function getEntry(key, value) {
        return [key, value];
      }
    } // naive Set shim


    function CreateSetPolyfill() {
      return (
        /** @class */
        function () {
          function Set() {
            this._map = new _Map();
          }

          Object.defineProperty(Set.prototype, "size", {
            get: function () {
              return this._map.size;
            },
            enumerable: true,
            configurable: true
          });

          Set.prototype.has = function (value) {
            return this._map.has(value);
          };

          Set.prototype.add = function (value) {
            return this._map.set(value, value), this;
          };

          Set.prototype.delete = function (value) {
            return this._map.delete(value);
          };

          Set.prototype.clear = function () {
            this._map.clear();
          };

          Set.prototype.keys = function () {
            return this._map.keys();
          };

          Set.prototype.values = function () {
            return this._map.values();
          };

          Set.prototype.entries = function () {
            return this._map.entries();
          };

          Set.prototype["@@iterator"] = function () {
            return this.keys();
          };

          Set.prototype[iteratorSymbol] = function () {
            return this.keys();
          };

          return Set;
        }()
      );
    } // naive WeakMap shim


    function CreateWeakMapPolyfill() {
      var UUID_SIZE = 16;
      var keys = HashMap.create();
      var rootKey = CreateUniqueKey();
      return (
        /** @class */
        function () {
          function WeakMap() {
            this._key = CreateUniqueKey();
          }

          WeakMap.prototype.has = function (target) {
            var table = GetOrCreateWeakMapTable(target,
            /*create*/
            false);
            return table !== undefined ? HashMap.has(table, this._key) : false;
          };

          WeakMap.prototype.get = function (target) {
            var table = GetOrCreateWeakMapTable(target,
            /*create*/
            false);
            return table !== undefined ? HashMap.get(table, this._key) : undefined;
          };

          WeakMap.prototype.set = function (target, value) {
            var table = GetOrCreateWeakMapTable(target,
            /*create*/
            true);
            table[this._key] = value;
            return this;
          };

          WeakMap.prototype.delete = function (target) {
            var table = GetOrCreateWeakMapTable(target,
            /*create*/
            false);
            return table !== undefined ? delete table[this._key] : false;
          };

          WeakMap.prototype.clear = function () {
            // NOTE: not a real clear, just makes the previous data unreachable
            this._key = CreateUniqueKey();
          };

          return WeakMap;
        }()
      );

      function CreateUniqueKey() {
        var key;

        do key = "@@WeakMap@@" + CreateUUID(); while (HashMap.has(keys, key));

        keys[key] = true;
        return key;
      }

      function GetOrCreateWeakMapTable(target, create) {
        if (!hasOwn.call(target, rootKey)) {
          if (!create) return undefined;
          Object.defineProperty(target, rootKey, {
            value: HashMap.create()
          });
        }

        return target[rootKey];
      }

      function FillRandomBytes(buffer, size) {
        for (var i = 0; i < size; ++i) buffer[i] = Math.random() * 0xff | 0;

        return buffer;
      }

      function GenRandomBytes(size) {
        if (typeof Uint8Array === "function") {
          if (typeof crypto !== "undefined") return crypto.getRandomValues(new Uint8Array(size));
          if (typeof msCrypto !== "undefined") return msCrypto.getRandomValues(new Uint8Array(size));
          return FillRandomBytes(new Uint8Array(size), size);
        }

        return FillRandomBytes(new Array(size), size);
      }

      function CreateUUID() {
        var data = GenRandomBytes(UUID_SIZE); // mark as random - RFC 4122 § 4.4

        data[6] = data[6] & 0x4f | 0x40;
        data[8] = data[8] & 0xbf | 0x80;
        var result = "";

        for (var offset = 0; offset < UUID_SIZE; ++offset) {
          var byte = data[offset];
          if (offset === 4 || offset === 6 || offset === 8) result += "-";
          if (byte < 16) result += "0";
          result += byte.toString(16).toLowerCase();
        }

        return result;
      }
    } // uses a heuristic used by v8 and chakra to force an object into dictionary mode.


    function MakeDictionary(obj) {
      obj.__ = undefined;
      delete obj.__;
      return obj;
    }
  });
})(Reflect || (Reflect = {}));
},{"process":"node_modules/process/browser.js"}],"node_modules/tsyringe/dist/esm5/types/lifecycle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var Lifecycle;

(function (Lifecycle) {
  Lifecycle[Lifecycle["Transient"] = 0] = "Transient";
  Lifecycle[Lifecycle["Singleton"] = 1] = "Singleton";
  Lifecycle[Lifecycle["ResolutionScoped"] = 2] = "ResolutionScoped";
  Lifecycle[Lifecycle["ContainerScoped"] = 3] = "ContainerScoped";
})(Lifecycle || (Lifecycle = {}));

var _default = Lifecycle;
exports.default = _default;
},{}],"node_modules/tsyringe/dist/esm5/types/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Lifecycle", {
  enumerable: true,
  get: function () {
    return _lifecycle.default;
  }
});

var _lifecycle = _interopRequireDefault(require("./lifecycle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./lifecycle":"node_modules/tsyringe/dist/esm5/types/lifecycle.js"}],"node_modules/tslib/tslib.es6.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__extends = __extends;
exports.__rest = __rest;
exports.__decorate = __decorate;
exports.__param = __param;
exports.__metadata = __metadata;
exports.__awaiter = __awaiter;
exports.__generator = __generator;
exports.__exportStar = __exportStar;
exports.__values = __values;
exports.__read = __read;
exports.__spread = __spread;
exports.__spreadArrays = __spreadArrays;
exports.__await = __await;
exports.__asyncGenerator = __asyncGenerator;
exports.__asyncDelegator = __asyncDelegator;
exports.__asyncValues = __asyncValues;
exports.__makeTemplateObject = __makeTemplateObject;
exports.__importStar = __importStar;
exports.__importDefault = __importDefault;
exports.__classPrivateFieldGet = __classPrivateFieldGet;
exports.__classPrivateFieldSet = __classPrivateFieldSet;
exports.__assign = void 0;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function () {
  exports.__assign = __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

exports.__assign = __assign;

function __rest(s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
}

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}

function __exportStar(m, exports) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}

function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
}

function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
}

;

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i;

  function verb(n) {
    if (g[n]) i[n] = function (v) {
      return new Promise(function (a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }

  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }

  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }

  function fulfill(value) {
    resume("next", value);
  }

  function reject(value) {
    resume("throw", value);
  }

  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function () {
    return this;
  }, i;

  function verb(n, f) {
    i[n] = o[n] ? function (v) {
      return (p = !p) ? {
        value: __await(o[n](v)),
        done: n === "return"
      } : f ? f(v) : v;
    } : f;
  }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
      i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);

  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }

  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
}

;

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result.default = mod;
  return result;
}

function __importDefault(mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
}

function __classPrivateFieldGet(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }

  privateMap.set(receiver, value);
  return value;
}
},{}],"node_modules/tsyringe/dist/esm5/reflection-helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParamInfo = getParamInfo;
exports.defineInjectionTokenMetadata = defineInjectionTokenMetadata;
exports.INJECTION_TOKEN_METADATA_KEY = void 0;
var INJECTION_TOKEN_METADATA_KEY = "injectionTokens";
exports.INJECTION_TOKEN_METADATA_KEY = INJECTION_TOKEN_METADATA_KEY;

function getParamInfo(target) {
  var params = Reflect.getMetadata("design:paramtypes", target) || [];
  var injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
  Object.keys(injectionTokens).forEach(function (key) {
    params[+key] = injectionTokens[key];
  });
  return params;
}

function defineInjectionTokenMetadata(data) {
  return function (target, _propertyKey, parameterIndex) {
    var injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
    injectionTokens[parameterIndex] = data;
    Reflect.defineMetadata(INJECTION_TOKEN_METADATA_KEY, injectionTokens, target);
  };
}
},{}],"node_modules/tsyringe/dist/esm5/providers/class-provider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isClassProvider = isClassProvider;

function isClassProvider(provider) {
  return !!provider.useClass;
}
},{}],"node_modules/tsyringe/dist/esm5/providers/factory-provider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFactoryProvider = isFactoryProvider;

function isFactoryProvider(provider) {
  return !!provider.useFactory;
}
},{}],"node_modules/tsyringe/dist/esm5/providers/injection-token.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNormalToken = isNormalToken;
exports.isTokenDescriptor = isTokenDescriptor;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isNormalToken(token) {
  return typeof token === "string" || _typeof(token) === "symbol";
}

function isTokenDescriptor(descriptor) {
  return _typeof(descriptor) === "object" && "token" in descriptor && "multiple" in descriptor;
}
},{}],"node_modules/tsyringe/dist/esm5/providers/token-provider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTokenProvider = isTokenProvider;

function isTokenProvider(provider) {
  return !!provider.useToken;
}
},{}],"node_modules/tsyringe/dist/esm5/providers/value-provider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValueProvider = isValueProvider;

function isValueProvider(provider) {
  return provider.useValue != undefined;
}
},{}],"node_modules/tsyringe/dist/esm5/providers/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "isClassProvider", {
  enumerable: true,
  get: function () {
    return _classProvider.isClassProvider;
  }
});
Object.defineProperty(exports, "isFactoryProvider", {
  enumerable: true,
  get: function () {
    return _factoryProvider.isFactoryProvider;
  }
});
Object.defineProperty(exports, "isNormalToken", {
  enumerable: true,
  get: function () {
    return _injectionToken.isNormalToken;
  }
});
Object.defineProperty(exports, "isTokenProvider", {
  enumerable: true,
  get: function () {
    return _tokenProvider.isTokenProvider;
  }
});
Object.defineProperty(exports, "isValueProvider", {
  enumerable: true,
  get: function () {
    return _valueProvider.isValueProvider;
  }
});

var _classProvider = require("./class-provider");

var _factoryProvider = require("./factory-provider");

var _injectionToken = require("./injection-token");

var _tokenProvider = require("./token-provider");

var _valueProvider = require("./value-provider");
},{"./class-provider":"node_modules/tsyringe/dist/esm5/providers/class-provider.js","./factory-provider":"node_modules/tsyringe/dist/esm5/providers/factory-provider.js","./injection-token":"node_modules/tsyringe/dist/esm5/providers/injection-token.js","./token-provider":"node_modules/tsyringe/dist/esm5/providers/token-provider.js","./value-provider":"node_modules/tsyringe/dist/esm5/providers/value-provider.js"}],"node_modules/tsyringe/dist/esm5/providers/provider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isProvider = isProvider;

var _classProvider = require("./class-provider");

var _valueProvider = require("./value-provider");

var _tokenProvider = require("./token-provider");

var _factoryProvider = require("./factory-provider");

function isProvider(provider) {
  return (0, _classProvider.isClassProvider)(provider) || (0, _valueProvider.isValueProvider)(provider) || (0, _tokenProvider.isTokenProvider)(provider) || (0, _factoryProvider.isFactoryProvider)(provider);
}
},{"./class-provider":"node_modules/tsyringe/dist/esm5/providers/class-provider.js","./value-provider":"node_modules/tsyringe/dist/esm5/providers/value-provider.js","./token-provider":"node_modules/tsyringe/dist/esm5/providers/token-provider.js","./factory-provider":"node_modules/tsyringe/dist/esm5/providers/factory-provider.js"}],"node_modules/tsyringe/dist/esm5/registry.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Registry = function () {
  function Registry() {
    this._registryMap = new Map();
  }

  Registry.prototype.entries = function () {
    return this._registryMap.entries();
  };

  Registry.prototype.getAll = function (key) {
    this.ensure(key);
    return this._registryMap.get(key);
  };

  Registry.prototype.get = function (key) {
    this.ensure(key);

    var value = this._registryMap.get(key);

    return value[value.length - 1] || null;
  };

  Registry.prototype.set = function (key, value) {
    this.ensure(key);

    this._registryMap.get(key).push(value);
  };

  Registry.prototype.setAll = function (key, value) {
    this._registryMap.set(key, value);
  };

  Registry.prototype.has = function (key) {
    this.ensure(key);
    return this._registryMap.get(key).length > 0;
  };

  Registry.prototype.clear = function () {
    this._registryMap.clear();
  };

  Registry.prototype.ensure = function (key) {
    if (!this._registryMap.has(key)) {
      this._registryMap.set(key, []);
    }
  };

  return Registry;
}();

var _default = Registry;
exports.default = _default;
},{}],"node_modules/tsyringe/dist/esm5/resolution-context.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var ResolutionContext = function () {
  function ResolutionContext() {
    this.scopedResolutions = new Map();
  }

  return ResolutionContext;
}();

var _default = ResolutionContext;
exports.default = _default;
},{}],"node_modules/tsyringe/dist/esm5/error-helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatErrorCtor = formatErrorCtor;

var _tslib = require("tslib");

function formatDependency(params, idx) {
  if (params === null) {
    return "at position #" + idx;
  }

  var argName = params.split(",")[idx].trim();
  return "\"" + argName + "\" at position #" + idx;
}

function composeErrorMessage(msg, e, indent) {
  if (indent === void 0) {
    indent = "    ";
  }

  return (0, _tslib.__spread)([msg], e.message.split("\n").map(function (l) {
    return indent + l;
  })).join("\n");
}

function formatErrorCtor(ctor, paramIdx, error) {
  var _a = (0, _tslib.__read)(ctor.toString().match(/constructor\(([\w, ]+)\)/) || [], 2),
      _b = _a[1],
      params = _b === void 0 ? null : _b;

  var dep = formatDependency(params, paramIdx);
  return composeErrorMessage("Cannot inject the dependency " + dep + " of \"" + ctor.name + "\" constructor. Reason:", error);
}
},{"tslib":"node_modules/tslib/tslib.es6.js"}],"node_modules/tsyringe/dist/esm5/dependency-container.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.instance = exports.typeInfo = void 0;

var _tslib = require("tslib");

var _providers = require("./providers");

var _provider = require("./providers/provider");

var _injectionToken = require("./providers/injection-token");

var _registry = _interopRequireDefault(require("./registry"));

var _lifecycle = _interopRequireDefault(require("./types/lifecycle"));

var _resolutionContext = _interopRequireDefault(require("./resolution-context"));

var _errorHelpers = require("./error-helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeInfo = new Map();
exports.typeInfo = typeInfo;

var InternalDependencyContainer = function () {
  function InternalDependencyContainer(parent) {
    this.parent = parent;
    this._registry = new _registry.default();
  }

  InternalDependencyContainer.prototype.register = function (token, providerOrConstructor, options) {
    if (options === void 0) {
      options = {
        lifecycle: _lifecycle.default.Transient
      };
    }

    var provider;

    if (!(0, _provider.isProvider)(providerOrConstructor)) {
      provider = {
        useClass: providerOrConstructor
      };
    } else {
      provider = providerOrConstructor;
    }

    if (options.lifecycle === _lifecycle.default.Singleton || options.lifecycle == _lifecycle.default.ContainerScoped || options.lifecycle == _lifecycle.default.ResolutionScoped) {
      if ((0, _providers.isValueProvider)(provider) || (0, _providers.isFactoryProvider)(provider)) {
        throw new Error("Cannot use lifecycle \"" + _lifecycle.default[options.lifecycle] + "\" with ValueProviders or FactoryProviders");
      }
    }

    this._registry.set(token, {
      provider: provider,
      options: options
    });

    return this;
  };

  InternalDependencyContainer.prototype.registerType = function (from, to) {
    if ((0, _providers.isNormalToken)(to)) {
      return this.register(from, {
        useToken: to
      });
    }

    return this.register(from, {
      useClass: to
    });
  };

  InternalDependencyContainer.prototype.registerInstance = function (token, instance) {
    return this.register(token, {
      useValue: instance
    });
  };

  InternalDependencyContainer.prototype.registerSingleton = function (from, to) {
    if ((0, _providers.isNormalToken)(from)) {
      if ((0, _providers.isNormalToken)(to)) {
        return this.register(from, {
          useToken: to
        }, {
          lifecycle: _lifecycle.default.Singleton
        });
      } else if (to) {
        return this.register(from, {
          useClass: to
        }, {
          lifecycle: _lifecycle.default.Singleton
        });
      }

      throw new Error('Cannot register a type name as a singleton without a "to" token');
    }

    var useClass = from;

    if (to && !(0, _providers.isNormalToken)(to)) {
      useClass = to;
    }

    return this.register(from, {
      useClass: useClass
    }, {
      lifecycle: _lifecycle.default.Singleton
    });
  };

  InternalDependencyContainer.prototype.resolve = function (token, context) {
    if (context === void 0) {
      context = new _resolutionContext.default();
    }

    var registration = this.getRegistration(token);

    if (!registration && (0, _providers.isNormalToken)(token)) {
      throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
    }

    if (registration) {
      return this.resolveRegistration(registration, context);
    }

    return this.construct(token, context);
  };

  InternalDependencyContainer.prototype.resolveRegistration = function (registration, context) {
    if (registration.options.lifecycle === _lifecycle.default.ResolutionScoped && context.scopedResolutions.has(registration)) {
      return context.scopedResolutions.get(registration);
    }

    var isSingleton = registration.options.lifecycle === _lifecycle.default.Singleton;
    var isContainerScoped = registration.options.lifecycle === _lifecycle.default.ContainerScoped;
    var returnInstance = isSingleton || isContainerScoped;
    var resolved;

    if ((0, _providers.isValueProvider)(registration.provider)) {
      resolved = registration.provider.useValue;
    } else if ((0, _providers.isTokenProvider)(registration.provider)) {
      resolved = returnInstance ? registration.instance || (registration.instance = this.resolve(registration.provider.useToken, context)) : this.resolve(registration.provider.useToken, context);
    } else if ((0, _providers.isClassProvider)(registration.provider)) {
      resolved = returnInstance ? registration.instance || (registration.instance = this.construct(registration.provider.useClass, context)) : this.construct(registration.provider.useClass, context);
    } else if ((0, _providers.isFactoryProvider)(registration.provider)) {
      resolved = registration.provider.useFactory(this);
    } else {
      resolved = this.construct(registration.provider, context);
    }

    if (registration.options.lifecycle === _lifecycle.default.ResolutionScoped) {
      context.scopedResolutions.set(registration, resolved);
    }

    return resolved;
  };

  InternalDependencyContainer.prototype.resolveAll = function (token, context) {
    var _this = this;

    if (context === void 0) {
      context = new _resolutionContext.default();
    }

    var registrations = this.getAllRegistrations(token);

    if (!registrations && (0, _providers.isNormalToken)(token)) {
      throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
    }

    if (registrations) {
      return registrations.map(function (item) {
        return _this.resolveRegistration(item, context);
      });
    }

    return [this.construct(token, context)];
  };

  InternalDependencyContainer.prototype.isRegistered = function (token, recursive) {
    if (recursive === void 0) {
      recursive = false;
    }

    return this._registry.has(token) || recursive && (this.parent || false) && this.parent.isRegistered(token, true);
  };

  InternalDependencyContainer.prototype.reset = function () {
    this._registry.clear();
  };

  InternalDependencyContainer.prototype.createChildContainer = function () {
    var e_1, _a;

    var childContainer = new InternalDependencyContainer(this);

    try {
      for (var _b = (0, _tslib.__values)(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = (0, _tslib.__read)(_c.value, 2),
            token = _d[0],
            registrations = _d[1];

        if (registrations.some(function (_a) {
          var options = _a.options;
          return options.lifecycle === _lifecycle.default.ContainerScoped;
        })) {
          childContainer._registry.setAll(token, registrations.map(function (registration) {
            if (registration.options.lifecycle === _lifecycle.default.ContainerScoped) {
              return {
                provider: registration.provider,
                options: registration.options
              };
            }

            return registration;
          }));
        }
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }

    return childContainer;
  };

  InternalDependencyContainer.prototype.getRegistration = function (token) {
    if (this.isRegistered(token)) {
      return this._registry.get(token);
    }

    if (this.parent) {
      return this.parent.getRegistration(token);
    }

    return null;
  };

  InternalDependencyContainer.prototype.getAllRegistrations = function (token) {
    if (this.isRegistered(token)) {
      return this._registry.getAll(token);
    }

    if (this.parent) {
      return this.parent.getAllRegistrations(token);
    }

    return null;
  };

  InternalDependencyContainer.prototype.construct = function (ctor, context) {
    if (typeof ctor === "undefined") {
      throw new Error("Attempted to construct an undefined constructor. Could mean a circular dependency problem.");
    }

    if (ctor.length === 0) {
      return new ctor();
    }

    var paramInfo = typeInfo.get(ctor);

    if (!paramInfo || paramInfo.length === 0) {
      throw new Error("TypeInfo not known for \"" + ctor.name + "\"");
    }

    var params = paramInfo.map(this.resolveParams(context, ctor));
    return new (ctor.bind.apply(ctor, (0, _tslib.__spread)([void 0], params)))();
  };

  InternalDependencyContainer.prototype.resolveParams = function (context, ctor) {
    var _this = this;

    return function (param, idx) {
      try {
        if ((0, _injectionToken.isTokenDescriptor)(param)) {
          return param.multiple ? _this.resolveAll(param.token) : _this.resolve(param.token, context);
        }

        return _this.resolve(param, context);
      } catch (e) {
        throw new Error((0, _errorHelpers.formatErrorCtor)(ctor, idx, e));
      }
    };
  };

  return InternalDependencyContainer;
}();

var instance = new InternalDependencyContainer();
exports.instance = instance;
var _default = instance;
exports.default = _default;
},{"tslib":"node_modules/tslib/tslib.es6.js","./providers":"node_modules/tsyringe/dist/esm5/providers/index.js","./providers/provider":"node_modules/tsyringe/dist/esm5/providers/provider.js","./providers/injection-token":"node_modules/tsyringe/dist/esm5/providers/injection-token.js","./registry":"node_modules/tsyringe/dist/esm5/registry.js","./types/lifecycle":"node_modules/tsyringe/dist/esm5/types/lifecycle.js","./resolution-context":"node_modules/tsyringe/dist/esm5/resolution-context.js","./error-helpers":"node_modules/tsyringe/dist/esm5/error-helpers.js"}],"node_modules/tsyringe/dist/esm5/decorators/auto-injectable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tslib = require("tslib");

var _reflectionHelpers = require("../reflection-helpers");

var _dependencyContainer = require("../dependency-container");

var _injectionToken = require("../providers/injection-token");

var _errorHelpers = require("../error-helpers");

function autoInjectable() {
  return function (target) {
    var paramInfo = (0, _reflectionHelpers.getParamInfo)(target);
    return function (_super) {
      (0, _tslib.__extends)(class_1, _super);

      function class_1() {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        return _super.apply(this, (0, _tslib.__spread)(args.concat(paramInfo.slice(args.length).map(function (type, index) {
          try {
            if ((0, _injectionToken.isTokenDescriptor)(type)) {
              return type.multiple ? _dependencyContainer.instance.resolveAll(type.token) : _dependencyContainer.instance.resolve(type.token);
            }

            return _dependencyContainer.instance.resolve(type);
          } catch (e) {
            var argIndex = index + args.length;
            throw new Error((0, _errorHelpers.formatErrorCtor)(target, argIndex, e));
          }
        })))) || this;
      }

      return class_1;
    }(target);
  };
}

var _default = autoInjectable;
exports.default = _default;
},{"tslib":"node_modules/tslib/tslib.es6.js","../reflection-helpers":"node_modules/tsyringe/dist/esm5/reflection-helpers.js","../dependency-container":"node_modules/tsyringe/dist/esm5/dependency-container.js","../providers/injection-token":"node_modules/tsyringe/dist/esm5/providers/injection-token.js","../error-helpers":"node_modules/tsyringe/dist/esm5/error-helpers.js"}],"node_modules/tsyringe/dist/esm5/decorators/inject.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reflectionHelpers = require("../reflection-helpers");

function inject(token) {
  return (0, _reflectionHelpers.defineInjectionTokenMetadata)(token);
}

var _default = inject;
exports.default = _default;
},{"../reflection-helpers":"node_modules/tsyringe/dist/esm5/reflection-helpers.js"}],"node_modules/tsyringe/dist/esm5/decorators/injectable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reflectionHelpers = require("../reflection-helpers");

var _dependencyContainer = require("../dependency-container");

function injectable() {
  return function (target) {
    _dependencyContainer.typeInfo.set(target, (0, _reflectionHelpers.getParamInfo)(target));
  };
}

var _default = injectable;
exports.default = _default;
},{"../reflection-helpers":"node_modules/tsyringe/dist/esm5/reflection-helpers.js","../dependency-container":"node_modules/tsyringe/dist/esm5/dependency-container.js"}],"node_modules/tsyringe/dist/esm5/decorators/registry.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tslib = require("tslib");

var _dependencyContainer = require("../dependency-container");

function registry(registrations) {
  if (registrations === void 0) {
    registrations = [];
  }

  return function (target) {
    registrations.forEach(function (_a) {
      var token = _a.token,
          options = _a.options,
          provider = (0, _tslib.__rest)(_a, ["token", "options"]);
      return _dependencyContainer.instance.register(token, provider, options);
    });
    return target;
  };
}

var _default = registry;
exports.default = _default;
},{"tslib":"node_modules/tslib/tslib.es6.js","../dependency-container":"node_modules/tsyringe/dist/esm5/dependency-container.js"}],"node_modules/tsyringe/dist/esm5/decorators/singleton.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _injectable = _interopRequireDefault(require("./injectable"));

var _dependencyContainer = require("../dependency-container");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function singleton() {
  return function (target) {
    (0, _injectable.default)()(target);

    _dependencyContainer.instance.registerSingleton(target);
  };
}

var _default = singleton;
exports.default = _default;
},{"./injectable":"node_modules/tsyringe/dist/esm5/decorators/injectable.js","../dependency-container":"node_modules/tsyringe/dist/esm5/dependency-container.js"}],"node_modules/tsyringe/dist/esm5/decorators/inject-all.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reflectionHelpers = require("../reflection-helpers");

function injectAll(token) {
  var data = {
    token: token,
    multiple: true
  };
  return (0, _reflectionHelpers.defineInjectionTokenMetadata)(data);
}

var _default = injectAll;
exports.default = _default;
},{"../reflection-helpers":"node_modules/tsyringe/dist/esm5/reflection-helpers.js"}],"node_modules/tsyringe/dist/esm5/decorators/scoped.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scoped;

var _injectable = _interopRequireDefault(require("./injectable"));

var _dependencyContainer = require("../dependency-container");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scoped(lifecycle, token) {
  return function (target) {
    (0, _injectable.default)()(target);

    _dependencyContainer.instance.register(token || target, target, {
      lifecycle: lifecycle
    });
  };
}
},{"./injectable":"node_modules/tsyringe/dist/esm5/decorators/injectable.js","../dependency-container":"node_modules/tsyringe/dist/esm5/dependency-container.js"}],"node_modules/tsyringe/dist/esm5/decorators/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "autoInjectable", {
  enumerable: true,
  get: function () {
    return _autoInjectable.default;
  }
});
Object.defineProperty(exports, "inject", {
  enumerable: true,
  get: function () {
    return _inject.default;
  }
});
Object.defineProperty(exports, "injectable", {
  enumerable: true,
  get: function () {
    return _injectable.default;
  }
});
Object.defineProperty(exports, "registry", {
  enumerable: true,
  get: function () {
    return _registry.default;
  }
});
Object.defineProperty(exports, "singleton", {
  enumerable: true,
  get: function () {
    return _singleton.default;
  }
});
Object.defineProperty(exports, "injectAll", {
  enumerable: true,
  get: function () {
    return _injectAll.default;
  }
});
Object.defineProperty(exports, "scoped", {
  enumerable: true,
  get: function () {
    return _scoped.default;
  }
});

var _autoInjectable = _interopRequireDefault(require("./auto-injectable"));

var _inject = _interopRequireDefault(require("./inject"));

var _injectable = _interopRequireDefault(require("./injectable"));

var _registry = _interopRequireDefault(require("./registry"));

var _singleton = _interopRequireDefault(require("./singleton"));

var _injectAll = _interopRequireDefault(require("./inject-all"));

var _scoped = _interopRequireDefault(require("./scoped"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./auto-injectable":"node_modules/tsyringe/dist/esm5/decorators/auto-injectable.js","./inject":"node_modules/tsyringe/dist/esm5/decorators/inject.js","./injectable":"node_modules/tsyringe/dist/esm5/decorators/injectable.js","./registry":"node_modules/tsyringe/dist/esm5/decorators/registry.js","./singleton":"node_modules/tsyringe/dist/esm5/decorators/singleton.js","./inject-all":"node_modules/tsyringe/dist/esm5/decorators/inject-all.js","./scoped":"node_modules/tsyringe/dist/esm5/decorators/scoped.js"}],"node_modules/tsyringe/dist/esm5/factories/instance-caching-factory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = instanceCachingFactory;

function instanceCachingFactory(factoryFunc) {
  var instance;
  return function (dependencyContainer) {
    if (instance == undefined) {
      instance = factoryFunc(dependencyContainer);
    }

    return instance;
  };
}
},{}],"node_modules/tsyringe/dist/esm5/factories/predicate-aware-class-factory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = predicateAwareClassFactory;

function predicateAwareClassFactory(predicate, trueConstructor, falseConstructor, useCaching) {
  if (useCaching === void 0) {
    useCaching = true;
  }

  var instance;
  var previousPredicate;
  return function (dependencyContainer) {
    var currentPredicate = predicate(dependencyContainer);

    if (!useCaching || previousPredicate !== currentPredicate) {
      if (previousPredicate = currentPredicate) {
        instance = dependencyContainer.resolve(trueConstructor);
      } else {
        instance = dependencyContainer.resolve(falseConstructor);
      }
    }

    return instance;
  };
}
},{}],"node_modules/tsyringe/dist/esm5/factories/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "instanceCachingFactory", {
  enumerable: true,
  get: function () {
    return _instanceCachingFactory.default;
  }
});
Object.defineProperty(exports, "predicateAwareClassFactory", {
  enumerable: true,
  get: function () {
    return _predicateAwareClassFactory.default;
  }
});

var _instanceCachingFactory = _interopRequireDefault(require("./instance-caching-factory"));

var _predicateAwareClassFactory = _interopRequireDefault(require("./predicate-aware-class-factory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./instance-caching-factory":"node_modules/tsyringe/dist/esm5/factories/instance-caching-factory.js","./predicate-aware-class-factory":"node_modules/tsyringe/dist/esm5/factories/predicate-aware-class-factory.js"}],"node_modules/tsyringe/dist/esm5/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Lifecycle: true,
  container: true
};
Object.defineProperty(exports, "Lifecycle", {
  enumerable: true,
  get: function () {
    return _types.Lifecycle;
  }
});
Object.defineProperty(exports, "container", {
  enumerable: true,
  get: function () {
    return _dependencyContainer.instance;
  }
});

var _types = require("./types");

var _decorators = require("./decorators");

Object.keys(_decorators).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _decorators[key];
    }
  });
});

var _factories = require("./factories");

Object.keys(_factories).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _factories[key];
    }
  });
});

var _providers = require("./providers");

Object.keys(_providers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _providers[key];
    }
  });
});

var _dependencyContainer = require("./dependency-container");

if (typeof Reflect === "undefined" || !Reflect.getMetadata) {
  throw new Error("tsyringe requires a reflect polyfill. Please add 'import \"reflect-metadata\"' to the top of your entry point.");
}
},{"./types":"node_modules/tsyringe/dist/esm5/types/index.js","./decorators":"node_modules/tsyringe/dist/esm5/decorators/index.js","./factories":"node_modules/tsyringe/dist/esm5/factories/index.js","./providers":"node_modules/tsyringe/dist/esm5/providers/index.js","./dependency-container":"node_modules/tsyringe/dist/esm5/dependency-container.js"}],"node_modules/uuid/dist/esm-browser/rng.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rng;
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
// find the complete implementation of crypto (msCrypto) on IE11.
var getRandomValues = typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != 'undefined' && typeof msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto);
var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

function rng() {
  if (!getRandomValues) {
    throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
  }

  return getRandomValues(rnds8);
}
},{}],"node_modules/uuid/dist/esm-browser/bytesToUuid.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex; // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4

  return [bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]]].join('');
}

var _default = bytesToUuid;
exports.default = _default;
},{}],"node_modules/uuid/dist/esm-browser/v1.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(require("./rng.js"));

var _bytesToUuid = _interopRequireDefault(require("./bytesToUuid.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : (0, _bytesToUuid.default)(b);
}

var _default = v1;
exports.default = _default;
},{"./rng.js":"node_modules/uuid/dist/esm-browser/rng.js","./bytesToUuid.js":"node_modules/uuid/dist/esm-browser/bytesToUuid.js"}],"node_modules/uuid/dist/esm-browser/v35.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.URL = exports.DNS = void 0;

var _bytesToUuid = _interopRequireDefault(require("./bytesToUuid.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function uuidToBytes(uuid) {
  // Note: We assume we're being passed a valid uuid string
  var bytes = [];
  uuid.replace(/[a-fA-F0-9]{2}/g, function (hex) {
    bytes.push(parseInt(hex, 16));
  });
  return bytes;
}

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  var bytes = new Array(str.length);

  for (var i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }

  return bytes;
}

var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  var generateUUID = function generateUUID(value, namespace, buf, offset) {
    var off = buf && offset || 0;
    if (typeof value == 'string') value = stringToBytes(value);
    if (typeof namespace == 'string') namespace = uuidToBytes(namespace);
    if (!Array.isArray(value)) throw TypeError('value must be an array of bytes');
    if (!Array.isArray(namespace) || namespace.length !== 16) throw TypeError('namespace must be uuid string or an Array of 16 byte values'); // Per 4.3

    var bytes = hashfunc(namespace.concat(value));
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      for (var idx = 0; idx < 16; ++idx) {
        buf[off + idx] = bytes[idx];
      }
    }

    return buf || (0, _bytesToUuid.default)(bytes);
  }; // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name;
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}
},{"./bytesToUuid.js":"node_modules/uuid/dist/esm-browser/bytesToUuid.js"}],"node_modules/uuid/dist/esm-browser/md5.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes == 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Array(msg.length);

    for (var i = 0; i < msg.length; i++) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  var i;
  var x;
  var output = [];
  var length32 = input.length * 32;
  var hexTab = '0123456789abcdef';
  var hex;

  for (i = 0; i < length32; i += 8) {
    x = input[i >> 5] >>> i % 32 & 0xff;
    hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[(len + 64 >>> 9 << 4) + 14] = len;
  var i;
  var olda;
  var oldb;
  var oldc;
  var oldd;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (i = 0; i < x.length; i += 16) {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  var i;
  var output = [];
  output[(input.length >> 2) - 1] = undefined;

  for (i = 0; i < output.length; i += 1) {
    output[i] = 0;
  }

  var length8 = input.length * 8;

  for (i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

var _default = md5;
exports.default = _default;
},{}],"node_modules/uuid/dist/esm-browser/v3.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("./v35.js"));

var _md = _interopRequireDefault(require("./md5.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports.default = _default;
},{"./v35.js":"node_modules/uuid/dist/esm-browser/v35.js","./md5.js":"node_modules/uuid/dist/esm-browser/md5.js"}],"node_modules/uuid/dist/esm-browser/v4.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(require("./rng.js"));

var _bytesToUuid = _interopRequireDefault(require("./bytesToUuid.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof options == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }

  options = options || {};

  var rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || (0, _bytesToUuid.default)(rnds);
}

var _default = v4;
exports.default = _default;
},{"./rng.js":"node_modules/uuid/dist/esm-browser/rng.js","./bytesToUuid.js":"node_modules/uuid/dist/esm-browser/bytesToUuid.js"}],"node_modules/uuid/dist/esm-browser/sha1.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes == 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Array(msg.length);

    for (var i = 0; i < msg.length; i++) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  bytes.push(0x80);
  var l = bytes.length / 4 + 2;
  var N = Math.ceil(l / 16);
  var M = new Array(N);

  for (var i = 0; i < N; i++) {
    M[i] = new Array(16);

    for (var j = 0; j < 16; j++) {
      M[i][j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
    }
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (var i = 0; i < N; i++) {
    var W = new Array(80);

    for (var t = 0; t < 16; t++) {
      W[t] = M[i][t];
    }

    for (var t = 16; t < 80; t++) {
      W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
    }

    var a = H[0];
    var b = H[1];
    var c = H[2];
    var d = H[3];
    var e = H[4];

    for (var t = 0; t < 80; t++) {
      var s = Math.floor(t / 20);
      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

var _default = sha1;
exports.default = _default;
},{}],"node_modules/uuid/dist/esm-browser/v5.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("./v35.js"));

var _sha = _interopRequireDefault(require("./sha1.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports.default = _default;
},{"./v35.js":"node_modules/uuid/dist/esm-browser/v35.js","./sha1.js":"node_modules/uuid/dist/esm-browser/sha1.js"}],"node_modules/uuid/dist/esm-browser/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "v1", {
  enumerable: true,
  get: function () {
    return _v.default;
  }
});
Object.defineProperty(exports, "v3", {
  enumerable: true,
  get: function () {
    return _v2.default;
  }
});
Object.defineProperty(exports, "v4", {
  enumerable: true,
  get: function () {
    return _v3.default;
  }
});
Object.defineProperty(exports, "v5", {
  enumerable: true,
  get: function () {
    return _v4.default;
  }
});

var _v = _interopRequireDefault(require("./v1.js"));

var _v2 = _interopRequireDefault(require("./v3.js"));

var _v3 = _interopRequireDefault(require("./v4.js"));

var _v4 = _interopRequireDefault(require("./v5.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./v1.js":"node_modules/uuid/dist/esm-browser/v1.js","./v3.js":"node_modules/uuid/dist/esm-browser/v3.js","./v4.js":"node_modules/uuid/dist/esm-browser/v4.js","./v5.js":"node_modules/uuid/dist/esm-browser/v5.js"}],"src/repositories/Repository.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var uuid_1 = require("uuid");

var Repository =
/** @class */
function () {
  function Repository() {
    this._context = {};
  }

  Repository.prototype.adicionar = function (obj) {
    obj.id = uuid_1.v4();
    this._context[obj.id] = obj;
    return obj;
  };

  Repository.prototype.listar = function () {
    var _this = this;

    return Object.keys(this._context).map(function (key) {
      return _this._context[key];
    });
  };

  Repository.prototype.editar = function (id, obj) {
    var novo = __assign(__assign({}, this.obterPorId(id)), obj);

    this._context[id] = novo;
    return novo;
  };

  Repository.prototype.obterPorId = function (id) {
    return this._context[id];
  };

  Repository.prototype.remover = function (key) {
    if (this._context[key]) {
      delete this._context[key];
      return true;
    }

    return false;
  };

  return Repository;
}();

exports.Repository = Repository;
},{"uuid":"node_modules/uuid/dist/esm-browser/index.js"}],"src/repositories/PessoaRepository.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Repository_1 = require("./Repository");

var PessoaRepository =
/** @class */
function (_super) {
  __extends(PessoaRepository, _super);

  function PessoaRepository() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return PessoaRepository;
}(Repository_1.Repository);

exports.PessoaRepository = PessoaRepository;
},{"./Repository":"src/repositories/Repository.ts"}],"src/services/PessoaService.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param = this && this.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("reflect-metadata");

var tsyringe_1 = require("tsyringe");

var PessoaService =
/** @class */
function () {
  function PessoaService(_repository) {
    this._repository = _repository;
  }

  PessoaService.prototype.adicionar = function (obj) {
    return this._repository.adicionar(obj);
  };

  PessoaService.prototype.listar = function () {
    return this._repository.listar();
  };

  PessoaService.prototype.editar = function (id, obj) {
    return this._repository.editar(id, obj);
  };

  PessoaService.prototype.obterPorId = function (id) {
    return this._repository.obterPorId(id);
  };

  PessoaService.prototype.remover = function (key) {
    return this._repository.remover(key);
  };

  var _a;

  PessoaService = __decorate([tsyringe_1.injectable(), __param(0, tsyringe_1.inject('IPessoaRepository')), __metadata("design:paramtypes", [typeof (_a = typeof IPessoaRepository !== "undefined" && IPessoaRepository) === "function" ? _a : Object])], PessoaService);
  return PessoaService;
}();

exports.PessoaService = PessoaService;
},{"reflect-metadata":"node_modules/reflect-metadata/Reflect.js","tsyringe":"node_modules/tsyringe/dist/esm5/index.js"}],"src/ioc/UoW.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param = this && this.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("reflect-metadata");

var tsyringe_1 = require("tsyringe");

var PessoaRepository_1 = require("../repositories/PessoaRepository");

var PessoaService_1 = require("../services/PessoaService");

var UoW =
/** @class */
function () {
  function UoW(pessoa) {
    this.pessoa = pessoa;
  }

  var _a;

  UoW = __decorate([tsyringe_1.registry([{
    token: 'IPessoaRepository',
    useFactory: tsyringe_1.instanceCachingFactory(function (c) {
      return c.resolve(PessoaRepository_1.PessoaRepository);
    })
  }, {
    token: 'IPessoaService',
    useClass: PessoaService_1.PessoaService
  }]), tsyringe_1.autoInjectable(), __param(0, tsyringe_1.inject('IPessoaService')), __metadata("design:paramtypes", [typeof (_a = typeof IPessoaService !== "undefined" && IPessoaService) === "function" ? _a : Object])], UoW);
  return UoW;
}();

exports.UoW = UoW;
},{"reflect-metadata":"node_modules/reflect-metadata/Reflect.js","tsyringe":"node_modules/tsyringe/dist/esm5/index.js","../repositories/PessoaRepository":"src/repositories/PessoaRepository.ts","../services/PessoaService":"src/services/PessoaService.ts"}],"src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("reflect-metadata");

var UoW_1 = require("./ioc/UoW");

for (var i = 0; i < 3; i++) {
  var instance = new UoW_1.UoW();

  if (instance.pessoa) {
    instance.pessoa.adicionar({
      email: 'email@teste',
      nome: 'willian'
    });
  }

  console.log(instance);
}
},{"reflect-metadata":"node_modules/reflect-metadata/Reflect.js","./ioc/UoW":"src/ioc/UoW.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52802" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map