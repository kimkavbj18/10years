/*
 * $Id: base64.js,v 2.15 2014/04/05 12:58:57 dankogai Exp dankogai $
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */

(function(global) {
    'use strict';
    // existing version for noConflict()
    var _Base64 = global.Base64;
    var version = "2.3.2";
    // if node.js, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
        try {
            buffer = require('buffer').Buffer;
        } catch (err) {}
    }
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                   + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                   + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var btoa = global.btoa ? function(b) {
        return global.btoa(b);
    } : function(b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = buffer ?
        buffer.from && buffer.from !== Uint8Array.from ? function (u) {
            return (u.constructor === buffer.constructor ? u : buffer.from(u))
                .toString('base64')
        }
        :  function (u) {
            return (u.constructor === buffer.constructor ? u : new  buffer(u))
                .toString('base64')
        }
        : function (u) { return btoa(utob(u)) }
    ;
    var encode = function(u, urisafe) {
        return !urisafe
            ? _encode(String(u))
            : _encode(String(u)).replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function(u) { return encode(u, true) };
    // decoder stuff
    var re_btou = new RegExp([
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}'
    ].join('|'), 'g');
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var atob = global.atob ? function(a) {
        return global.atob(a);
    } : function(a){
        return a.replace(/[\s\S]{1,4}/g, cb_decode);
    };
    var _decode = buffer ?
        buffer.from && buffer.from !== Uint8Array.from ? function(a) {
            return (a.constructor === buffer.constructor
                    ? a : buffer.from(a, 'base64')).toString();
        }
        : function(a) {
            return (a.constructor === buffer.constructor
                    ? a : new buffer(a, 'base64')).toString();
        }
        : function(a) { return btou(atob(a)) };
    var decode = function(a){
        return _decode(
            String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) { // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    }
    else if (typeof define === 'function' && define.amd) {		
        // AMD. Register as an anonymous module.	
        define([], function(){ return global.Base64 });
    }
    // that's it!
})(   typeof self   !== 'undefined' ? self
    : typeof window !== 'undefined' ? window
    : typeof global !== 'undefined' ? global
    : this
);
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

/*global LiveHelpSettings, jQuery, _, CryptoJS, marked, Cookies, Intercom, Base64*/

if (typeof LiveHelpSettings !== 'undefined' && typeof Chatstack === 'undefined') {
  var Chatstack = LiveHelpSettings;
}
Chatstack._ = _.noConflict();
Chatstack.Base64 = Base64.noConflict();
Chatstack.iframe = function () {
  try {
    return parent.self !== window.top;
  } catch (e) {
    return true;
  }
};
Chatstack.events = jQuery({});

// Stardevelop Pty Ltd - Copyright 2003-2018 - chatstack.com
(function (window, document, prefix, config, _, $, undefined) {
  'use strict';

  var module = false; // eslint-disable-line no-unused-vars
  var define = false; // eslint-disable-line no-unused-vars

  // Third Party Libraries

  Chatstack.cookies = Cookies.noConflict();

  var protocol = ('https:' === document.location.protocol ? 'https://' : 'http://'),
    directoryPath = '/livehelp/',
    apiPath = '/livehelp/',
    apiEndpoint = {
      home: 'index.php',
      settings: 'settings.php',
      offline: 'offline.php',
      security: 'security.php',
      image: 'image.php',
      chat: 'chat.php',
      call: 'call.php',
      signout: 'logout.php',
      messages: 'messages.php',
      send: 'send.php',
      email: 'email.php',
      rating: 'rate.php',
      feedback: 'feedback.php'
    },
    server = (typeof config !== 'undefined') ? config.server : document.location.host + document.location.pathname.substring(0, document.location.pathname.indexOf(directoryPath)),
    selector = '#' + prefix,
    language = navigator.language || navigator.userLanguage,
    opts = {
      protocol: protocol,
      server: protocol + server + directoryPath,
      domain: document.location.hostname.replace('www.', ''),
      department: '',
      template: 'default',
      sprite: true,
      locale: language.toLowerCase(),
      embedded: true,
      initiate: true,
      initiateDelay: 0,
      fonts: true,
      session: '',
      security: '',
      popup: false,
      visitorTracking: true,
      visitorRefresh: 15 * 1000,
      plugin: '',
      name: '',
      custom: '',
      email: '',
      connecting: false,
      connected: false,
      hideOffline: false,
      chatBubbles: false,
      messageBubbles: true,
      personalised: false,
      offline: false,
      accepted: false,
      promptPrechatDelay: 250,
      theme: 'green',
      feedback: false,
      feedbackDelay: -1,
      layout: 'tab',
      hidden: false,
      cookie: { localStorage: false },
      disabled: false,
      operator: false
    },
    message = 0,
    messageSound = false,
    newMessages = 0,
    currentlyTyping = 0,
    title = '',
    titleTimer,
    operator = '',
    popup,
    popupPosition = { left: 0, top: 0 },
    size = '',
    visitorTimer,
    visitorTimeout = false,
    visitorInitialised = 0,
    loadTime = $.now(),
    pageTime,
    exists = (config.account !== undefined && config.account.length === 36),
    cookie = { name: (exists ? 'LiveHelp-' + config.account : prefix + 'Session') },
    cookies = { session: Chatstack.cookies.get(cookie.name) },
    settings = { user: 'Guest', departments: [], visitorTracking: true, locale: 'en', language: { copyright: 'Copyright &copy; ' +  new Date().getFullYear(), online: 'Online', offline: 'Offline', brb: 'Be Right Back', away: 'Away', contactus: 'Contact Us' } },
    storage = { store: false, data: { tabOpen: false, operatorDetailsOpen: false, soundEnabled: true, notificationEnabled: true, chatEnded: false, department: '', messages: 0, lastMessage: 0, feedbackOpen: true } },
    plugins = {},
    websockets = false,
    tabs = [],
    master = true,
    signup = false,
    images = {},
    animationPrefix = 'chatstack-',
    namespace = 'chatstack',
    container = false,
    app = false,
    launcher = false,
    chatbutton = false;

  // jQuery Document Reset
  $.defaultRoot = $(document);

  var withScope = function(scope$) {
    return function(selector) {
      return scope$.find(selector);
    }
  }

  var $parent = withScope($.defaultRoot);

  function Storage() {
    this.store = $.initNamespaceStorage(prefix + 'Guest').localStorage;

    this.get = function (key) {
      return this.store.get(key);
    };
    this.set = function (key, value) {
      return this.store.set(key, value);
    };
    this.isSet = function (key) {
      return this.store.isSet(key);
    };
  }

  $.fn.extend({
    animateCss: function (animationName) {
      var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      var deferred = $.Deferred();
      this.addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName);
        deferred.resolve();
      });
      return deferred.promise();
    }
  });

  // Initialise Storage
  storage.store = new Storage();

  if (Chatstack.cookie !== undefined && Chatstack.cookie.localStorage) {
    cookies.session = (storage.store.get(cookie.name) !== null) ? storage.store.get(cookie.name) : undefined;
  }

  // Date.now Shim
  if (!Date.now) {
    Date.now = function () { return new Date().getTime(); };
  }

  // Button Events
  $(document).on('click', '.' + prefix + 'Button', function () {
    openLiveHelp($(this), false, false, false, true);
    return false;
  });

  $(document).on('click', '.' + prefix + 'CallButton', function () {
    openLiveHelp($(this), '', apiEndpoint.call);
    return false;
  });

  $(document).on('click', '.' + prefix + 'OfflineButton', function () {
    openEmbeddedOffline();
    return false;
  });

  $.preloadImages = function () {
    for (var i = 0; i < arguments.length; i++) {
      $('<img>').attr('src', arguments[i]);
    }
  };

  // Javascript API Events
  function updateStatusMode(status) {
    var oldStatus = Chatstack.statusMode;
    Chatstack.statusMode = status;
    if (oldStatus !== status) {
      var data = { status: status };
      Chatstack.events.trigger('StatusModeChanged', data);
    }
  }

  function updateChatState(state, user) {
    var oldState = Chatstack.chatState;
    Chatstack.chatState = state;
    if (oldState !== state) {
      var data = { state: state };
      if (user) {
        data.user = user;
      }
      Chatstack.events.trigger('ChatStateChanged', data);
    }
  }

  function updateInitiateChatState(state, message, image) {
    var oldState = Chatstack.initiateChatState;
    
    switch (state) {
      case 0:
        state = 'idle';
        break;
      case -1:
        state = 'waiting';
        break;
      case -2:
        state = 'accepted';
        break;
      case -3:
        state = 'declined';
        break;
    }
    Chatstack.initiateChatState = state;
    if (oldState !== state) {
      var data = { state: state };
      if (message) { data.message = message; }
      if (image) { data.image = image; }
      Chatstack.events.trigger('InitiateChatStateChanged', data);
    }
  }

  function overrideSettings() {
    // Update Settings
    if (typeof config !== 'undefined') {
      opts = $.extend(opts, config);
    }

    if (opts.cookie !== undefined && typeof opts.cookie.expires === 'number') {
      cookie.expires = opts.cookie.expires;
    }

    if (opts.account !== undefined && opts.account.length === 36) {
      $.each(apiEndpoint, function (key, value) {
        if (value.indexOf(opts.account) < 0) {
          if (value.indexOf('api/') > -1) {
            apiEndpoint[key] = value.replace('api/', 'api/' + opts.account + '/');
          } else {
            apiEndpoint[key] = opts.account + '/' + value;
          }
        }
      });
    }

    // Override Server
    if (opts.server.indexOf('http://') === -1 && opts.server.indexOf('https://') === -1) {
      opts.server = opts.protocol + opts.server;
    } else {
      opts.server = opts.protocol + server;
    }
  }

  // Override Settings
  overrideSettings();

  // Intercom Events
  var intercom = Intercom.getInstance(),
    unique = { origin: intercom.origin, timer: false, master: true, time: new Date().getTime() },
    index = _.sortedIndex(tabs, unique, 'time');

  function close() {
    intercom.emit('close', { origin: intercom.origin, master: master });
    opts.visitorTracking = false;
    return void 0;
  }

  if (typeof window !== 'undefined' && window !== null) {
    if (window.addEventListener) {
      window.addEventListener('beforeunload', close);
    } else if (window.attachEvent) {
      window.attachEvent('onbeforeunload', close);
    }
  }

  intercom.on('ready', function (data) {
    if (data.origin !== intercom.origin) {
      opts.visitorTracking = false;
      master = false;

      var tab = _.findWhere(tabs, { origin: data.origin });
      if (tab === undefined) {
        _.each(tabs, function (element) { element.master = false; });

        var element = { origin: data.origin, timer: false, master: true, time: data.time },
          index = _.sortedIndex(tabs, element, 'time');

        tabs.splice(index, 0, element);
      } else {
        if (tab.timer !== false) {
          window.clearTimeout(tab.timer);
          tab.timer = false;
        }
        tab.master = true;
      }
    }
  });

  function updateTab(data) {
    var tab = _.findWhere(tabs, { origin: data.origin });
    if (tab === undefined) {
      var element = { origin: data.origin, timer: false, master: data.master, time: data.time },
        index = _.sortedIndex(tabs, element, 'time');

      tabs.splice(index, 0, element);
    } else {
      if (tab.timer !== false) {
        window.clearTimeout(tab.timer);
        tab.timer = false;
      }
      tab.master = data.master;
      tab.time = data.time;
    }
  }

  intercom.on('ping', function (data) {
    if (data.origin !== intercom.origin) {
      updateTab(data);
      intercom.emit('pong', { origin: intercom.origin, master: master, time: unique.time });
    }
  });

  intercom.on('pong', function (data) {
    if (data.origin !== intercom.origin) {
      updateTab(data);
    }
  });

  intercom.on('master', function (data) {
    if (data.origin === intercom.origin) {
      var tab = _.findWhere(tabs, { origin: data.origin });
      if (tab !== undefined) {
        tab.master = true;
      }
      opts.visitorTracking = true;
      master = true;
    }
  });

  intercom.on('close', function (data) {
    if (data.origin !== intercom.origin) {
      tabs = _.reject(tabs, function (value) { return value.origin === data.origin; });

      if (tabs.length > 0) {
        if (data.master) {
          var available = _.where(tabs, { master: false }),
            tab = available[available.length - 1];

          if (tab !== undefined) {
            intercom.emit('master', { origin: tab.origin });
          }
        }
      }
    }
  });

  var ping = _.throttle(function () {

    // Ping
    if (master) {
      intercom.emit('ping', { origin: intercom.origin, master: master });
    }

    // Ping Timeouts
    $.each(tabs, function (key, data) {
      var tab = _.findWhere(tabs, { origin: data.origin });
      if (tab.timer === false && data.origin !== intercom.origin) {
        tab.timer = window.setTimeout(function () {
          tabs = _.reject(tabs, function (value) { return value.origin === data.origin; });
          tab.timer = false;
        }, 15000);
      }
    });

  }, 7500);

  tabs.splice(index, 0, unique);
  intercom.emit('ready', unique);

  (function send() {
    if (master) {
      ping();
    }

    var last = tabs[tabs.length - 1];
    if (unique.time < last.time && master === true) {
      opts.visitorTracking = false;
      master = false;
    }

    if (tabs.length === 1 && last.origin === unique.origin && !master) {
      opts.visitorTracking = true;
      master = true;
    }

    window.setTimeout(send, 7500);
  })();

  var updateSession = _.once(function (session) {
    cookies.session = session;
    if (opts.cookie.localStorage) {
      storage.store.set(cookie.name, session);
    } else {
      Chatstack.cookies.set(cookie.name, session, { domain: opts.domain, expires: cookie.expires });
    }
  });

  var storageEvent = _.once(function () {
    // Embedded Chat / Local Storage
    $(window).on('storage', function () {
      loadStorage();
    });
  });

  // Setup Placeholder

  function updateSettings(override, initialise, success) {
    var data = { time: $.now() };

    // Session
    if (cookies.session !== undefined && cookies.session.length > 0) {
      data.session = cookies.session;
    } else if (opts.session) {
      data.session = opts.session;
    }

    // Override Language
    if (config !== undefined && config.locale !== undefined) {
      data.language = config.locale.toLowerCase();
    }

    // Override Template
    if (config !== undefined && config.template !== undefined) {
      data.template = config.template;
    }

    // Popup
    if (opts.popup) {
      if (visitorInitialised === 0) {
        data.popup = true;
        visitorInitialised = 1;
      } else {
        return;
      }
    }

    clearTimeout(visitorTimer);

    pageTime = $.now() - loadTime;
    if ((pageTime > 90 * 60 * 1000) || (visitorInitialised > 0 && override === undefined && ((websockets === false && master === false) || (plugins.websockets !== undefined && websockets === true)))) {
      visitorTimeout = true;
    } else {
      visitorTimeout = false;
    }

    if (opts.visitorTracking && !visitorTimeout) {

      // TODO Add Timezone Support
      var title = $(document).attr('title').substring(0, 150),
        timezone = getTimezone(); // eslint-disable-line no-unused-vars

      if (settings.initiate && settings.initiate.status && settings.initiate.status.length > 0) {
        data.initiate = settings.initiate.status;
      }

      if (opts.department && opts.department.length > 0) {
        data.department = opts.department;
      }

      if (opts.useragent && opts.useragent.length) {
        data.useragent = opts.useragent;
      }

      // Track Visitor
      if (visitorInitialised === 0 || initialise !== undefined) {
        var location = (opts.url !== undefined) ? opts.url : document.location.href;
        data = $.extend(data, { title: title, url: location, width: window.screen.width, height: window.screen.height });

        if (document.referrer && document.referrer.length) {
          $.extend(data, { referrer: document.referrer });
        }

        /* TODO: Fix Server Override
        if (settings.monitoring.server !== undefined) {
          url = settings.monitoring.server + apiPath + apiEndpoint.settings + '?callback=?';
        }
        */

        visitorInitialised = 1;
      }

      // Plugin / Integration
      var plugin = opts.plugin;
      if (plugin.length > 0) {
        var name = opts.name,
          email = opts.email;

        if (email !== undefined && email.length > 0) {
          data = $.extend(data, { plugin: plugin, custom: email });
        }
        if (name !== undefined && name.length > 0) {
          data.name = name;
        }
      } else if (opts.name !== undefined && opts.name.length > 0 && opts.email !== undefined && opts.email.length > 0) {
        data = $.extend(data, { plugin: 'Internal', custom: opts.email, name: opts.name });
      }

      // Web Sockets
      if (plugins.websockets !== undefined && plugins.websockets.state !== undefined && plugins.websockets.state.length > 0) {
        data = $.extend(data, { websockets: plugins.websockets.state });
      }

    }

    if (opts.popup || (opts.visitorTracking && !visitorTimeout)) {

      // JSON
      data = $.toJSON(data);

      $.ajax({
        url: opts.server + apiPath + apiEndpoint.settings,
        data: { data: Chatstack.Base64.encode(data) },
        success: function (data) {

          // Update Server Settings
          if (data.settings && data.update) {
            settings = data.settings;
          } else {
            settings.initiate = data.settings.initiate;
            settings.departments = data.departments;
            settings.channel = data.settings.channel;
            settings.connected = data.settings.connected;
          }

          if (!data.error && !opts.disabled) {
            // Connected
            opts.connected = settings.connected;

            // Popup
            if (opts.popup && !opts.connected && settings.status !== 'Offline' && !settings.loginDetails) {
              opts.connected = true;
              if (opts.connecting) {
                opts.connecting = false;
              }
            }

            // Javascript API
            if (opts.connected) {

              // Setup Sounds
              if (!messageSound) {
                messageSound = new Chatstack.buzz.sound(opts.server + directoryPath + 'sounds/New Message', {
                  formats: ['ogg', 'mp3', 'wav'],
                  volume: 100
                });
              }

              updateChatState('connected');
            } else {
              updateChatState('waiting');
            }
          }

          // Initiate Chat
          var initiate = (!data.error && data.settings.initiate && data.settings.initiate.enabled && !data.settings.initiate.delay && !opts.connected);

          var heads = false;
          if (opts.embedded !== false) {
            if (data.html && data.html.app.length) {
              // Container
              container = $parent('#' + namespace + '-container');

              var appframe = $parent('.' + namespace + '-app-frame');
              if (appframe.length) {
                var appdoc = appframe.contents();
                var appbody = appdoc.find('body');
                appbody.attr('id', namespace + '-app-frame-body').addClass(namespace + '-app-frame-body');
                heads = appdoc.find('head');
                if (appbody.length) {
                  app = $(data.html.app).appendTo(appbody);
                  container = container.add(appbody.find('#' + namespace + '-container'));
                }
              }
            }

            // Button Frame
            var buttonframe = $parent('.' + namespace + '-launcher-frame');
            if (buttonframe.length && data.html && data.html.button.length) {
              var buttondoc = buttonframe.contents();
              var buttonbody = buttondoc.find('body');

              // Button HTML Body
              $(data.html.button).appendTo(buttonbody);
              chatbutton = buttondoc.find('.' + namespace + '-launcher');

              launcher = buttondoc.find('#' + namespace + '-container');
              container = container.add(launcher);

              // Localise Chat Button
              var text = localeStatusMode(settings.status);
              chatbutton.attr('title', text);

              // Button HTML Head
              heads = heads.add(buttondoc.find('head'));
              $('<base target="_parent">').appendTo(heads);

              // Fonts
              if (opts.fonts && settings.fonts) {
                settings.fonts = settings.fonts.replace(/\.\.\/\.\.\/\.\.\//g, opts.server + '/livehelp/');
                var fonts = '<style type="text/css">' + settings.fonts + '</style>';
                $(fonts).appendTo(heads);
              }

              // Styles
              var embeddedstyles = false || settings.styles;
              if (embeddedstyles.length > 0) {
                // Fix Paths
                embeddedstyles = embeddedstyles.replace(/\.\.\/\.\.\/\.\.\//g, opts.server + '/livehelp/');
                var styles = '<style type="text/css">' + embeddedstyles + '</style>';
                $(styles).appendTo(heads);
              }

            }

            // Switch Popup Window
            if (opts.popup && opts.connected) {
              showSignedIn();
            }

            // Storage Event
            storageEvent();
          }

          if (!data.error) {

            // Override Visitor Tracking
            if (settings.monitoring) {
              opts.visitorTracking = (opts.visitorTracking && !settings.monitoring.enabled) ? false : settings.monitoring.enabled;
              opts.visitorRefresh = (settings.monitoring.refresh !== undefined) ? settings.monitoring.refresh * 1000 : 15 * 1000;
            }

            // Feedback
            if (settings.status !== 'Online') {
              if (opts.feedbackDelay > 0) {
                checkFeedback();
              } else {
                var throttled = _.throttle(checkFeedback, 100);
                $(window).scroll(throttled);
              }
            }

            if (!opts.introduction && settings.introduction) {
              opts.introduction = settings.introduction;
            }

            if (settings.initiate.delay > 0) {
              opts.initiateDelay = settings.initiate.delay * 1000;
            }

          }

          // Feedback
          if (opts.feedback && settings.status !== 'Online' && app !== false && !storage.store.get('feedback')) {

            // Feedback UI
            app.addClass('feedback');

            if (!opts.connected) {
              displayInitiateChat(true, true);
            }

            // Feedback Placeholder

          }

          if (!data.error) {
            if (opts.embedded !== false) {
              if (data.error || (opts.feedback && data.status !== 'Online' && !storage.store.get('feedback'))) {
                setupChat();

                app.addClass('signup-collapsed');
                if (typeof initSetup === 'function') {
                  initSetup(embed, data); // eslint-disable-line no-undef
                }

                if (!opts.connected) {
                  setOffline('Offline');
                }
              }
            }

            // Update Session
            var session = false;
            if (opts.popup && opts.session.length > 0) {
              session = opts.session;
            } else if (data.session.length > 0) {
              session = data.session;
            }
            updateSession(session);

            // Override Language
            if (opts.language !== undefined && !$.isEmptyObject(opts.language)) {
              settings.language = $.extend(settings.language, opts.language);
            }

            // Change Status
            if (data.status !== undefined && data.status.length > 0) {
              changeStatus(data.status, data.departments);
            }

            // Initiate Chat
            if (initiate) {
              if ((data.settings.initiate.avatar || (data.settings.initiate.image && data.settings.initiate.image.length)) && data.settings.initiate.message && data.settings.initiate.message.length > 0) {
                var image = data.settings.initiate.image;
                if ((image.indexOf('https://') === -1 && image.indexOf('data:image/png;base64,') === -1)) {
                  image = 'https://secure.gravatar.com/avatar/' + data.settings.initiate.avatar + '?s=120&r=g&d=404';
                }
                displayInitiateChat(true, false, data.settings.initiate.message, image);
              } else {
                displayInitiateChat(true);
              }
            }

            // Connecting
            if (data.chat !== undefined && data.chat > 0) {
              $(document).trigger(prefix + '.Connecting', data).trigger(prefix + '.Connected', data);
            }

            // Override Sprite
            opts.sprite = (opts.template === 'default' && opts.sprite === false) ? true : opts.sprite;

            // Override Redirection URL
            if (opts.offlineRedirect && opts.offlineRedirect.length) {
              settings.offlineRedirect = opts.offlineRedirect;
            }

            // Offline Email Redirection
            if (settings.offlineRedirect !== '') {
              if (/^(?:^[-!#$%&'*+\\./0-9=?A-Z^_`a-z{|}~]+@[-!#$%&'*+\\/0-9=?A-Z^_`a-z{|}~]+\.[-!#$%&'*+\\./0-9=?A-Z^_`a-z{|}~]+$)$/i.test(settings.offlineRedirect)) {
                settings.offlineRedirect = 'mailto:' + settings.offlineRedirect;
              }
            }

            if (opts.personalised) {
              var op = settings.embeddedinitiate;
              if (op.id > 0) {
                // Operator Details
                showOperatorDetails(op.id, op.name, op.department, op.avatar);
              }
            }

            // Settings Updated
            $(document).trigger(prefix + '.SettingsUpdated', { session: session, settings: settings, visitor: data.visitor });

            // Initiate Chat
            if (settings.initiate.enabled && !opts.connected) {
              var message = settings.initiate.message || false;
              if (opts.initiateDelay > 0) {
                displayInitiateChat(false, false, message);
              } else {
                displayInitiateChat(true, false, message);
              }
            }

            // Smilies
            if (settings.smilies) {
              app.find('.smilies.icon').show();
            } else {
              app.find('.smilies.icon').hide();
            }

            // Update Window Size
            updateChatWindowSize();

            // Departments
            updateDepartments(settings.departments);

            // Callback
            if (success) {
              success();
            }

            // Login Details
            if (settings.user.length > 0) {
              app.find('.name.input').val(settings.user);
            }
            if (settings.email !== false && settings.email.length > 0) {
              app.find('.email.input').val(settings.email);
            }
            if (settings.department.length > 0) {
              app.find('.department.input').val(settings.department);
            }
          }

          if (visitorInitialised === 0) {
            visitorInitialised = 1;
          }

          visitorTimer = window.setTimeout(updateSettings, opts.visitorRefresh);

        },
        error: function (xhr) {
          if(xhr.status === 403) {
            // Session Authentication Error
            cookies.session = '';
            updateSettings();
          } else {
            visitorTimer = window.setTimeout(updateSettings, opts.visitorRefresh);
          }
        },
        dataType: 'jsonp',
        cache: false,
        xhrFields: { withCredentials: true }
      });
    } else {
      visitorTimer = window.setTimeout(updateSettings, opts.visitorRefresh);
    }
  }

  var throttledUpdateSettings = _.throttle(updateSettings, opts.visitorRefresh),
    updateSettingsInitalise = _.once(updateSettings);

  function updateDepartments(departments) {
    var department = app.find('.department.input'),
      options = '';

    if (departments && settings.departments) {
      departments = settings.departments;
    }

    if (departments.length > 0) {
      // Remove Departments
      var existing = department.find('option');
      $.each(existing, function (key, value) {
        value = $(this).val();
        if (value.length > 0 && $.inArray(value, departments) < 0) {
          app.find('.department.input option[value="' + value + '"]').remove();
        }
      });

      // Add Departments
      var total = 0,
        name = false;

      $.each(departments, function (index, value) {
        if (opts.departments === undefined || (opts.departments !== undefined && opts.departments.length > 0 && $.inArray(value, opts.departments) > -1)) {
          if (!department.find('option[value="' + value + '"]').length) {
            name = (settings.language.departments[value] !== undefined) ? settings.language.departments[value] : value;
            options += '<option value="' + value + '">' + name + '</option>';
          }
          total = total + 1;
        }
      });

      if (total > 0) {
        if (options.length > 0) {
          if (!department.find('option[value=""]').length) {
            options = '<option value=""></option>' + options;
          }
          department.append(options);
        }

        if (!opts.department.length) {
          app.find('.department.label').show();
        }
      } else {
        app.find('.department.label').hide();
      }

    } else {
      app.find('.department.label').hide();
    }
  }

  /*
  function ignoreDrag(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    if (e.dataTransfer !== undefined) {
      e.dataTransfer.dropEffect = 'copy';
    }
    return false;
  }

  function acceptDrop(e) {
    ignoreDrag(e.originalEvent);
    var dt = e.originalEvent.dataTransfer,
      files = dt.files;

    if (dt.files.length > 0) {
      var file = dt.files[0];
    }
  }
  */

  // Update Window Size
  function updateChatWindowSize() {
    popupPosition.left = (window.screen.width - settings.popupSize.width) / 2;
    popupPosition.top = (window.screen.height - settings.popupSize.height) / 2;
    size = 'height=' + settings.popupSize.height + ',width=' + settings.popupSize.width + ',top=' + popupPosition.top + ',left=' + popupPosition.left + ',resizable=1,toolbar=0,menubar=0';
  }

  function showNotification() {
    if (storage.data.notificationEnabled) {
      if (newMessages > 0) {
        var text = (newMessages > 99) ? '...' : newMessages;
        app.find('.notification span').text(text);
      }
      if (messageSound && storage.data.soundEnabled && storage.data.notificationEnabled) {
        messageSound.play();
      }
    }
  }

  function updateStorage() {
    storage.store.set(prefix, storage.data);
  }

  function hideNotification() {
    if (newMessages > 0) {
      newMessages = 0;
    }
    updateStorage();
    app.find('.notification').fadeOut(250);
  }

  var loadSprite = _.once(function () {
    if (opts.sprite) {
      $('<img />').load(function () {
        // Add CSS
        var head = app.closest('html').find('head');
        $('<link href="' + opts.server + directoryPath + 'templates/' + opts.template + '/styles/sprite.min.css" rel="stylesheet" type="text/css"/>').appendTo(head);
      }).attr('src', opts.server + directoryPath + 'images/Sprite.png');
    }
  });

  function openTab(callback, override) {

    // Check Blocked Chat
    if (settings.blocked !== undefined && settings.blocked !== 0) {
      blockChat();
    }

    if ((app.is('.closed') || app.is('.hidden') || opts.popup) && opts.embedded === true) {

      // Load Sprites
      if (opts.sprite === true) {
        loadSprite();
      }

      newMessages = 0;
      hideNotification();
      initDepartments();

      // Guest Details
      if (!settings.loginDetails && !override) {
        // Initiate Chat
        initInitiateChat(true);
        if (!settings.initiate.enabled || !opts.connected) {
          openInitiateChatTab();
          return;
        }
      } else {

        $parent('.' + namespace + '-initiate-chat').fadeOut(150);

        var css = 'opened';
        var remove = 'closed';
        if (opts.disabled) {
          css += ' hidden';
        } else {
          app.show();
          remove += ' hidden';
        }

        app.add(container).removeClass(remove).addClass(css);
        resizeChatTab();

        css = 'launcher-enabled';
        if (opts.disabled) {
          css += ' hidden';
        }
        chatbutton.add(container).removeClass('launcher-disabled').addClass(css);
        $parent('body').addClass(prefix + 'Opened');

        storage.data.tabOpen = true;
        updateStorage();
      }

      app.find(selector + 'CloseButton').removeClass('expand').addClass('collapse');

      container.addClass('opened');
      chatbutton.find('.icon').addClass('close');

      if (callback) {
        callback();
      }
    }
  }

  function closeTab(override, complete) {
    if (app.is('.signup') || opts.popup) {
      return;
    }

    app.find('.smilies.icon').close();
    if (app.is('.opened')) {
      resizeChatTab();

      var style = (!app.is('.tab') || (!opts.popup && (opts.hidden || opts.disabled))) ? 'hidden' : 'closed';
      app.add(container).removeClass('opened').addClass(style);
      $parent('body').removeClass(prefix + 'Opened');

      storage.data.tabOpen = false;
      updateStorage();
    }

    if (complete) {
      complete.call();
    }

    var show = true;
    var offlineOpened = $parent('.' + namespace + '-initiate-chat').is('.offline.opened');
    if (app.is('.offline') && opts.layout !== 'tab') {
      app.addClass('hidden');

      // Embedded Offline Email
      initInitiateChat(false, settings.language.offlinemessagedescription);
      if (storage.data.offlineOpen && !offlineOpened) {
        toggleOfflineChat();
        offlineOpened = true;
      }

    } else if (settings.status !== 'Online' && !opts.connected) {
      show = false;
    }
    if (opts.disabled || opts.hidden || app.is('.feedback') || (settings.initiate.enabled && !settings.initiate.delay && settings.status === 'Online' && !opts.connected && !override)) {
      show = false;
    }
    chatbutton.add(container).removeClass((show) ? 'launcher-disabled' : 'launcher-enabled').addClass((show) ? 'launcher-enabled' : 'launcher-disabled');
    app.find(selector + 'CloseButton').removeClass('collapse').addClass('expand');

    if (!offlineOpened) {
      container.removeClass('opened').addClass('closed');
      chatbutton.find('.icon').removeClass('close');
    }

    // Decline Initiate Chat
    /*
    if (app.attr('data-opened')) {
      updateInitiateStatus(-3); // Declined
    }
    */

    // Initiate Chat
    if (settings.initiate.enabled && !opts.connected) {
      if (opts.initiateDelay > 0) {
        displayInitiateChat(false);
      } else {
        displayInitiateChat(true);
      }
    }

  }

  function hideOperatorDetails() {
    var body = $parent('.body'),
      top = parseInt(body.css('top'), 10);

    if (top === 86) {
      body.animate({ top: 36 }, 500, 'swing', function () {
        app.find('.collapse.button').removeClass('Collapse').addClass('Expand').attr('title', settings.language.expand);
      });
      app.addClass('no-op');
    }
    if (storage.data.operatorDetailsOpen) {
      storage.data.operatorDetailsOpen = false;
      updateStorage();
    }
  }

  var addBubbleStyles = _.once(function () {
    var bubblestyles = '';
    if (bubblestyles.length > 0) {
      var styles = '<style type="text/css">' + bubblestyles + '</style>';
      $(styles).appendTo(document.head);
    }
  });

  function operatorImageURL(id, size) {
    var url = opts.server + apiPath + apiEndpoint.image,
      image = url + '?' + $.param({ id: id, size: size, round: '' });

    return image;
  }

  function operatorImage(id, name, department, avatarselector, hash, api) {
    var size = 120,
      image = operatorImageURL(id, 120);

    var updateImage = function (id, name, department, image, api) {
      return function () {
        var key = CryptoJS.SHA1(id.toString()).toString();
        images[key] = image;
        $(avatarselector + ', .messages .avatar.' + key + ', ' + '.' + namespace + '-initiate-chat:not(.feedback) .operator.photo').css({ 'background-image': 'url("' + image + '")', 'background-repeat': 'no-repeat' });

        // Javascript API
        if (api) {
          var user = { id: id, name: name, department: department, image: image };
          updateChatState('connected', user);
        }
      };
    };

    if (hash && hash.length > 0) {
      var gravatar = 'https://secure.gravatar.com/avatar/' + hash + '?s=' + size + '&r=g&d=404';
      $('<img />').one('error', updateImage(id, name, department, image, api)).one('load', updateImage(id, name, department, gravatar, api)).attr('src', gravatar);
    }
  }

  function showOperatorDetails(id, name, depmnt, hash, connected) {

    if (id && name && name.length > 0 && opts.connected) {

      // Update Typing
      app.find('.typing span').text(name + ' ' + settings.language.istyping);

      // Operator Details
      if (!app.find('.operator.container').is(':visible')) {

        app.addClass('connected');

        if (!storage.data.operatorDetailsOpen) {
          storage.data.operatorDetailsOpen = true;
          updateStorage();
        }

        if (depmnt !== undefined && depmnt.length > 0) {
          var departments = depmnt.split(';');
          $.each(departments, function (key, value) {
            if ($.trim(value) === $.trim(opts.department)) {
              depmnt = $.trim(value);
              return;
            }
          });
        }

        var department = (depmnt !== undefined) ? depmnt : storage.data.department;
        if (opts.chatBubbles) {

          app.find('.' + prefix + 'Operator').show();
          app.find('.status.text').css('left', '70px');

          addBubbleStyles();

          // Operator Image
          operatorImage(id, name, depmnt, '.operator.container .image, .messages .InitiateChat .avatar', hash, true);

          app.find('.collapse.button').hide();

          if (opts.colors !== undefined) {
            if (opts.chatBubbles !== false && opts.colors.image !== undefined && opts.colors.image.border !== undefined) {
              app.css('border', opts.colors.image.border);
            }
          }
        } else {

          if (opts.operator) {
            id = opts.operator.id;
            name = opts.operator.firstname;
            hash = opts.operator.hash;
          }

          // Operator Image
          operatorImage(id, name, depmnt, '.operator.container .image, .messages .InitiateChat .avatar', hash, true);

          var operator = app.find('.operator.container');
          operator.find('.name').text(name);
          if (connected) {
            name = settings.language.chattingwith + ' ' + name;
          }
          var messages = app.find('.messages');
          var initiate = messages.find('.InitiateChat');
          var element = false;
          if (initiate.length) {
            element = initiate;
          } else {
            element = messages.find('.flex.left').first();
          }

          if (element) {
            element.find('.name').text(name).show();
          }
          operator.find('.department').text(department);
          operator.show();
        }

        var top = parseInt(app.find('.body').css('top'), 10);
        if (top === 36) {
          app.find('.body').animate({ top: 86 }, 500, 'swing', function () {
            app.find('.collapse.button').removeClass('Expand').addClass('Collapse').attr('title', settings.language.collapse);
          });
        }
      }
    }

  }

  function autoCollapseOperatorDetails() {
    var scroll = app.find('.scroll'),
      body = app.find('.body'),
      top = parseInt(body.css('top'), 10);

    if (top === 86) {
      if (scroll.get(0).scrollHeight > scroll.height()) {
        app.find('.collapse.button').click();
      }
    }
  }

  function toggleSound() {
    var css = (storage.data.soundEnabled) ? '' : 'off',
      button = app.find('.sound.icon');

    if (button.length > 0) {
      button.removeClass('off').addClass(css);
    }
  }

  var initialiseTab = _.once(function () {
    if (app.length && (app.is('.signup') || opts.popup) && (settings.status === 'Online' || opts.connected)) {
      openTab(false, false);
      return;
    }

    if (storage.data !== undefined && storage.data.tabOpen !== undefined && storage.data.tabOpen === true && (settings.status === 'Online' || opts.connected)) {
      openTab(false, false);
    } else {
      closeTab();
    }
  });

  function initStorage() {
    var data = storage.store.get(prefix);
    if (data !== undefined) {
      storage.data = data;
    }
  }

  function loadStorage() {
    var data = storage.store.get(prefix),
      initiate = $parent('.' + namespace + '-initiate-chat').is(':visible');

    if (data !== undefined) {
      storage.data = data;
      if (app.length && !initiate && opts.connected || opts.popup) {
        initialiseTab();
      }
      if (storage.data.soundEnabled !== undefined) {
        toggleSound();
      } else {
        storage.data.soundEnabled = true;
      }
      if (!opts.connected) {
        if (storage.data.operatorDetailsOpen !== undefined && storage.data.operatorDetailsOpen) {
          showOperatorDetails();
        } else {
          hideOperatorDetails();
        }
      }
    } else {
      if (app.length) {
        initialiseTab();
      }
    }
  }

  var clickImage = function (id) {
    return function () {
      $parent('.flex[data-id=' + id + '] .fancybox').click();
    };
  };

  function scrollBottom() {
    var scroll = app.find('.scroll');
    if (scroll) {
      scroll.scrollTo(scroll.find('.end'));
    }
  }

  var displayImage = function (id) {
    return function () {
      var output = '',
        avatar = app.find('.flex.left .avatar'),
        bubble = app.find('.flex.left .message.bubble'),
        width = app.find('.messages').width() - avatar.width() - parseInt(avatar.css('margin-left'), 10) - parseInt(avatar.css('margin-right'), 10) - parseInt(bubble.css('margin-left'), 10) - parseInt(bubble.css('margin-right'), 10),
        displayWidth = width - 50,
        margin = [25, 25, 25, 25];

      if (this.width > displayWidth) {
        var aspect = displayWidth / this.width,
          displayHeight = (this.height * aspect) + 10;

        output = '<div class="' + prefix + 'Image" style="position:relative; max-width:' + this.width + 'px; max-height:' + this.height + 'px; height:' + displayHeight + 'px; min-width: 200px"><div style="position:absolute; top:0px;"><a href="' + this.src + '" class="fancybox"><img src="' + this.src + '" alt="Received Image" style="width:100%; max-width:' + this.width + 'px; max-height:' + this.height + 'px"></a></div><div class="image zoom"><div class="icon"></div></div>';
      } else {
        output = '<img src="' + this.src + '" alt="Received Image" style="max-width:' + this.width + 'px; margin:5px">';
      }
      app.find('.flex[data-id=' + id + '] .message').addClass('image').append(output);
      output = '';
      scrollBottom();
      if (!opts.popup) {
        margin = [25, 405, 25, 25];
      }
      app.find('.flex[data-id=' + id + '] .fancybox').fancybox({ openEffect: 'elastic', openEasing: 'swing', closeEffect: 'elastic', closeEasing: 'swing', margin: margin });
      app.find('.flex[data-id=' + id + '] .image.zoom').click(clickImage(id));
      if (messageSound && storage.data.soundEnabled && storage.data.notificationEnabled) {
        messageSound.play();
      }
      window.focus();
    };
  };

  function htmlSmilies(message) {

    function replaceSmilie(subject, smilie) {
      if (subject.match(smilie.regex)) {
        return replaceSmilie(subject.replace(smilie.regex, ' <span title="' + smilie.css + '" class="sprite ' + smilie.css + ' Small Smilie"></span> '), smilie);
      } else {
        return subject;
      }
    }

    if (settings.smilies) {
      var smilies = [
          { regex: /^<p>:D<\/p>$|^<p>:D | :D | :D<\/p>$/g, css: 'Laugh' },
          { regex: /^<p>:\)<\/p>$|^<p>:\) | :\) | :\)<\/p>$/g, css: 'Smile' },
          { regex: /^<p>:\(<\/p>$|^<p>:\( | :\( | :\(<\/p>$/g, css: 'Sad' },
          { regex: /^<p>\$\)<\/p>$|^<p>\$\) | \$\) | \$\)<\/p>$/g, css: 'Money' },
          { regex: /^<p>&gt;:O<\/p>$|^<p>&gt;:O |^>:O | &gt;:O | >:O | &gt;:O$| >:O<\/p>$/g, css: 'Angry' },
          { regex: /^<p>:P<\/p>$|^<p>:P | :P | :P<\/p>$/g, css: 'Impish' },
          { regex: /^<p>:\\<\/p>$|^<p>:\\ | :\\ | :\\<\/p>$/g, css: 'Sweat' },
          { regex: /^<p>8\)<\/p>$|^<p>8\) | 8\) | 8\)<\/p>$/g, css: 'Cool' },
          { regex: /^<p>&gt;:L<\/p>$|^<p>&gt;:L |^>:L | &gt;:L | >:L | &gt;:L$| >:L<\/p>$/g, css: 'Frown' },
          { regex: /^<p>;\)<\/p>$|^<p>;\) | ;\) | ;\)<\/p>$/g, css: 'Wink' },
          { regex: /^<p>:O<\/p>$|^<p>:O | :O | :O<\/p>$/g, css: 'Surprise' },
          { regex: /^<p>8-\)<\/p>$|^<p>8-\) | 8-\) | 8-\)<\/p>$/g, css: 'Woo' },
          { regex: /^<p>8-O<\/p>$|^<p>8-O | 8-O | 8-O<\/p>$/g, css: 'Shock' },
          { regex: /^<p>xD<\/p>$|^<p>xD | xD | xD<\/p>$/g, css: 'Hysterical' },
          { regex: /^<p>:-\*<\/p>$|^<p>:-\* | :-\* | :-\*<\/p>$/g, css: 'Kissed' },
          { regex: /^<p>:S<\/p>$|^<p>:S | :S | :S<\/p>$/g, css: 'Dizzy' },
          { regex: /^<p>\+O\)<\/p>$|^<p>\+O\) | \+O\) | \+O\)<\/p>$/g, css: 'Celebrate' },
          { regex: /^<p>&lt;3<\/p>$|^<p><3$|^&lt;3|^<3 | &lt;3|<3 | &lt;3<\/p>$| <3$/g, css: 'Adore' },
          { regex: /^<p>zzZ<\/p>$|^<p>zzZ | zzZ | zzZ<\/p>$/g, css: 'Sleep' },
          { regex: /^<p>:X<\/p>$|^<p>:X | :X | :X<\/p>$/g, css: 'Stop' },
          { regex: /^<p>X-\(<\/p>$|^<p>X-\( | X-\( | X-\(<\/p>$/g, css: 'Tired' }
        ];

      for (var i = 0; i < smilies.length; i++) {
        var smilie = smilies[i];
        message = $.trim(message);
        message = replaceSmilie(message, smilie);
      }
    }
    return $.trim(message);
  }

  function openPUSH(message) {
    if (opts.embedded) {
      var body = $parent('body');
      if (exists.length) {
        exists.attr('src', message);
      } else {
        $.featherlight(body, {
          iframe: message,
          iframeMaxWidth: 'calc(95% - 300px)',
          iframeWidth: '100%',
          iframeHeight: '100%',
          onResize: function () {
            $parent('.chatstack-featherlight-inner').css('height', $parent('.chatstack-featherlight-content').height());
          },
          beforeOpen: function () {
            body.css('overflow', 'hidden');
          },
          beforeClose: function () {
            body.css('overflow', 'auto');
          }
        });
      }
    } else {
      var parent = window.opener;
      if (parent) {
        parent.location.href = message;
        parent.focus();
      }
    }
  }

  function replaceMessageContent(content) {

    // Email and Links
    content = content.replace(/([a-z0-9][a-z0-9_.-]{0,}[a-z0-9]@[a-z0-9][a-z0-9_.-]{0,}[a-z0-9][.][a-z0-9]{2,4})/g, '<a href="mailto:$1" class="message-email">$1</a>');
    content = content.replace(/((?:(?:http(?:s?))|(?:ftp)):\/\/[^\s|<|>|'|"]*)/g, '<a href="$1" target="_blank" class="message-link">$1</a>');

    // Markdown Renderer
    var renderer = new marked.Renderer();
    renderer.list = function(body) {
      return body;
    };
    renderer.listitem = function(text) {
      return text;
    };

    // Markdown
    marked.setOptions({
      renderer: renderer,
      gfm: false,
      tables: false,
      smartLists: false
    });
    content = marked(content);

    // Smilies
    if (settings.smilies) {
      content = htmlSmilies(content);
    }

    return content;
  }

  var consecutive = false;

  function display(message) {
    var output = '',
      messages = app.find('.messages'),
      content = false,
      exists = false,
      datetime = message.timestamp || message.datetime;

    var name = message.username;
    if (message.firstname !== undefined && message.firstname.length > 0) {
      name = message.firstname;
    }

    if (!isNaN(parseInt(message.id, 10)) && app.find('.flex[data-id=' + message.id + ']').length > 0) {
      exists = true;
    } else {
      $(document).trigger(prefix + '.message.contentRead', { message: message.id });
    }

    if (messages && message.content !== null && !storage.data.chatEnded && !exists) {
      var alignment = 'left',
        color = 'received',
        rtl = '';

      if (message.id === -1 && opts.initiate) {
        initInitiateChat(false, message.content);
        return false;
      } else if (message.id === -2) {
        app.find('.waiting, .connecting').fadeOut(250);
        if (storage.data.operatorDetailsOpen !== undefined && storage.data.operatorDetailsOpen) {
          showOperatorDetails();
        }
        if (queued !== undefined && queued.length > 0 && settings.loginDetails !== 0) {
          sendMessage(queued[0]);
          queued = [];
        }
        return false;
      }

      if (message.align === 2) {
        alignment = 'center';
      } else if (message.align === 3) {
        alignment = 'right';
      }
      if (message.status === 0) {
        color = 'sent';
      }
      if (!storage.data.chatEnded && !opts.chatBubbles) {
        app.find('.collapse.button').fadeIn(250);
      }

      if (settings.rtl === true) {
        rtl = '; text-align: right';
      }

      if (datetime === undefined) {
        datetime = message.id;
      }

      var style = 'message ' + color,
        flex = 'flex',
        margin = 15,
        avatar = '',
        avatarstyle = '';

      if (message.id < -1) {
        flex += ' left none';
      }

      if (opts.messageBubbles && message.id >= -1) {
        style = 'message bubble ' + color + ' ';
        margin = 0;
        if (message.status === 1 || message.status === 2 || message.status === 3 || message.status === 7 || message.status === 8) {
          style += 'left';
          flex += ' left';
        } else {
          style += 'right';
          flex += ' right';
        }

        if (message.from && !consecutive || message.alert) {
          var url = false;
          var key = CryptoJS.SHA1(message.from.toString()).toString();
          if (images[key]) {
            url = images[key];
          } else if (message.status === 1 && message.from) {
            url = operatorImageURL(message.from, 120);
            images[key] = url;
          }

          if (url) {
            avatar = 'background-image: url(' + url + ')';
          }
          avatarstyle = ' ' + key;
        } else {
          style += ' noarrow';
        }

      }

      var operatorname = '';
      if (message.id >= -1 && message.status > 0 && message.status !== 5) {
        if (!consecutive || message.alert) {
          flex += ' grouped';
          if (message.alert) {
            name = message.alert;
          }
          operatorname = '<div class="name">' + name + '</div>';
        }
        consecutive = true;
      } else {
        consecutive = false;
      }

      var hash = '';
      if (message.status === 8) {
        style += ' joined';
        hash = message.hash;
      }

      if (opts.connected && !app.find('.prechat').is(':visible')) {
        showSignedIn();
      }

      output += '<div class="' + flex + '" data-id="' + message.id + '" data-datetime="' + datetime + '" data-name="' + name + '"><div class="avatar' + avatarstyle + '" style="' + avatar + '"></div>' + operatorname + '<div class="' + style + '" data-hash="' + hash + '" style="' + rtl + '">';
      if (message.status === 0 || message.status === 1 || message.status === 2 || message.status === 7 || message.status === 8) { // Operator, Link, Mobile Device Messages, Operator Joined

        if (app.find('.messages .message.joined[data-hash="' + hash + '"]').length) {
          return '';
        }

        if (name !== undefined && typeof name === 'string' && name.length > 0) {
          if (!opts.messageBubbles) {
            output += name + ' ' + settings.language.says + ':<br/>';
          }

          if (message.status > 0) {
            operator = name;
          }
        }

        // Check RTL Language
        if (alignment === 'left' && settings.rtl === true) {
          alignment = 'right';
        }

        content = replaceMessageContent(message.content);

        var regEx = /^.*((youtu.be\/)|(v\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/i,
        match = regEx.exec(content),
        width = messages.width();
        if (match !== null && match.length > 6) {
          var videoid = match[6];
          alignment = 'left';
          if (message.status === 2) {
            var size = { width: 260, height: 195 },
            css = 'message-video fancybox.iframe',
            path = 'embed/',
            target = 'self';
            if (opts.popup) {
              size = { width: 480, height: 360 };
              css = 'message-video-popup';
              path = 'watch?v=';
              target = 'blank';
            }
            content = '<a href="http://www.youtube.com/' + path + videoid + '" target="_' + target + '" class="' + css + '"><div style="position:relative; height:' + size.height + 'px; margin:5px"><div class="' + prefix + 'VideoZoom noresize" style="position:absolute; opacity:0.5; top:0px; z-index:150; background:url(' + opts.server + directoryPath + 'images/Play.png) center center no-repeat; max-width:' + size.width + 'px; width:' + size.width + 'px; height:' + size.height + 'px"></div><div style="position:absolute; top:0px;"><img src="http://img.youtube.com/vi/' + videoid + '/0.jpg" alt="YouTube Video" class="noresize" style="width:' + size.width + 'px; max-width:' + width + 'px"></div></div></a>';
          } else {
            content = content.replace(/((?:(?:http(?:s?))|(?:ftp)):\/\/[^\s|<|>|'|"]*)/g, '<a href="$1" target="_blank" class="message-link fancybox.iframe">$1</a>');
            content = htmlSmilies(content);
            content = '<div style="text-align: ' + alignment + '; margin-left: ' + margin + 'px">' + content + '</div>';
          }
          output += content;
        } else {
          output += '<div style="text-align: ' + alignment + '; margin-left: ' + margin + 'px">' + content + '</div>';
        }
      } else if (message.status === 3) { // Image
        content = message.content.replace(/((?:(?:http(?:s?))):\/\/[^\s|<|>|'|"]*)/g, '<img src="$1" alt="Received Image">');
        var result = content.match(/((?:(?:http(?:s?))):\/\/[^\s|<|>|'|"]*)/g);
        if (result) {
          $('<img />').load(displayImage(message.id)).attr('src', result);
        } else {
          output += content;
        }
      } else if (message.status === 4) { // PUSH
        openPUSH(message.content);
        output += '<div style="margin-top:5px">' + settings.language.pushedurl + ', <a href="' + message.content + '" target="_blank" class="message">' + message.content + '</a> ' + settings.language.opennewwindow + '</div>';
      } else if (message.status === 5) { // JavaScript
        /*jshint -W054 */
        try {
          (new Function(message.content))(message);
        } catch (e) {
          console.log('JavaScript Command Error: ' + e);
          console.log(message.content);
        }
        output = '';

      } else if (message.status === 6) { // File Transfer
        output += settings.language.sentfile + ' <a href="' + message.content + '" target="' + namespace + '-download">' + settings.language.startdownloading + '</a> ' + settings.language.rightclicksave;
      }

      if (output.length) {
        output += '</div></div>';
      }

      app.find('.waiting, .connecting').fadeOut(250);

      if (settings.offlineEmail && app.find(selector + 'Continue').length > 0) {
        app.find(selector + 'Continue').hide();
      }
    }
    return output;
  }

  function showTitleNotification() {
    var state = false;

    function updateTitle() {
      var newTitle = state ? title : operator + ' messaged you';
      $(document).attr('title', newTitle);
      state = !state;
    }

    if (titleTimer === null) {
      titleTimer = window.setInterval(updateTitle, 2000);
    }
  }

  function hideTitleNotification() {
    window.clearInterval(titleTimer);
    titleTimer = null;
    if (title.length > 0) {
      $(document).attr('title', title);
    }
  }

  function updateTypingStatus(data) {
    var typing = (data.typing && data.typing.status) ? data.typing.status : false,
      obj = app.find('.typing');
    if (typing) {
      // Update Name
      if (data.typing && data.typing.name) {
        app.find('.typing span').text(data.typing.name + ' ' + settings.language.istyping);
      }
      obj.show();
    } else {
      obj.hide();
    }
  }

  var messagesInitalised = false;

  function outputMessages(messages) {

    // Output Messages
    var html = '',
      lastMessage = false,
      margin = [25, 25, 25, 25];

    $.each(messages, function (index, message) {
      var content = display(message);
      if (content) {
        html += content;
      }

      lastMessage = message;
      if (message.status > 0) {
        newMessages++;
      }
    });

    if (html.length > 0) {
      if (!storage.data.chatEnded && !opts.chatBubbles) {
        app.find('.collapse.button').fadeIn(250);
      }
      app.find('.messages').append(html);

      // First Message
      var element = app.find('.messages .flex.left').first();
      if (element.length && opts.operator.firstname) {
        var first = app.find('.messages .flex.left, ' + '.messages .flex.initiate').first();
        if (first.length) {
          var name = first.find('.name');
          var chatting = element.data('name');
          if (chatting.length) {
            name.text(settings.language.chattingwith + ' ' + chatting).show();
          }
        }
      }

      // Select Last
      var last = '.messages .flex.left.grouped';
      $(last + '.last').removeClass('last');
      $(last + ':last').addClass('last');

      // Sort Messages
      app.find('.messages .flex:not(.initiate), .messages ' + selector + 'Continue').sort(function (a, b) {
        a = parseInt($(a).data('datetime'), 10);
        b = parseInt($(b).data('datetime'), 10);
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      }).appendTo('.messages');

      autoCollapseOperatorDetails();

      if (!opts.popup) {
        margin = [25, 405, 25, 25];
      }

      app.find('.message-link, .message-video').fancybox({ openEffect: 'elastic', openEasing: 'swing', closeEffect: 'elastic', closeEasing: 'swing', margin: margin });
      app.find('.' + prefix + 'VideoZoom').hover(function () {
        $(this).fadeTo(250, 1.0);
      }, function () {
        $(this).fadeTo(250, 0.75);
      });

      scrollBottom();

      if (!window.isActive && message > 0) {
        showTitleNotification();
      }

      if (lastMessage !== false && lastMessage.id > storage.data.lastMessage) {
        if (!storage.data.chatEnded && app.is('.closed')) {
          if (newMessages > 0) {
            showNotification();
          }
        } else {
          newMessages = 0;
          if (messageSound && !storage.data.chatEnded && storage.data.soundEnabled && (opts.popup || storage.data.notificationEnabled)) {
            messageSound.play();
          }
        }
      }
    }

    if (lastMessage !== false) {
      if (lastMessage.id > 0) {
        message = lastMessage.id;
      }

      // Show Last Message Alert
      if (lastMessage.status > 0 && lastMessage.status !== 4 && lastMessage.status !== 5) {
        showMessageAlert(lastMessage.content);
      }

      // Store Last Message
      if (lastMessage.id > storage.data.lastMessage) {
        storage.data.lastMessage = lastMessage.id;
        updateStorage();
      }
    }
  }

  function updateMessages() {

    if (storage.data.chatEnded) {
      window.setTimeout(updateMessages, 1500);
      return;
    }

    if (opts.connected && settings.language !== undefined) {
      var data = { TIME: $.now(), LANGUAGE: settings.locale, MESSAGE: message };

      if (currentlyTyping === 1) {
        data.TYPING = currentlyTyping;
      }

      // Cookies
      if (cookies.session !== undefined && cookies.session.length > 0) {
        data = $.extend(data, { SESSION: cookies.session });

        if (messagesInitalised === false) {
          $(document).trigger(prefix + '.UpdatingMessages', settings);

          // Popup
          if (opts.popup) {
            data = $.extend(data, { OVERRIDE: true });
          }
        }

        if (opts.operator.id > 0) {
          data = $.extend(data, { OPERATOR: opts.operator.id });
        }

      }

      $.jsonp({ url: opts.server + apiPath + apiEndpoint.messages + '?callback=?',
        data: $.param(data),
        success: function (data) {
          messagesInitalised = true;
          if (data !== null && data !== '') {
            if (data.messages !== undefined && data.messages.length > 0 && app.find('.messages').length) {
              outputMessages(data.messages);
            }
            updateTypingStatus(data);
          } else {
            updateTypingStatus(false);
          }

          if (websockets === false) {
            window.setTimeout(updateMessages, 1500);
          }
        },
        error: function () {
          if (websockets === false) {
            window.setTimeout(updateMessages, 1500);
          }
        }
      });

      if (promptEmail) {
        promptEmail();
      }

    } else {
      if (messagesInitalised === false && websockets === false) {
        window.setTimeout(updateMessages, 1500);
      }
    }
  }

  // Update Messages
  updateMessages();

  function showSignedIn() {
    app.find('.prechat').hide();
    app.find('.chatting').show();
    if (!app.find('.messages .flex.left, .messages .flex.right').length) {
      app.find('.waiting').show();
    }
    app.find('.body').css('background-color', '#fff');
    app.find('.message.container').animate({ bottom: 0 }, 500);

    if (app.is(':hidden')) {
      app.find('.waiting, .connecting').hide();
      app.fadeIn(50);
      loadStorage();
    }
  }

  function showChat() {
    if (!storage.data.chatEnded) {

      // Connecting
      if (opts.connected) {
        showConnecting();
      }

      if (app.find('.prechat').is(':visible')) {
        // Load Sprites
        if (opts.sprite) {
          $('<img />').load(function () {
            // Add CSS
            var head = app.closest('html').find('head');
            $('<link href="' + opts.server + directoryPath + 'templates/' + opts.template + '/styles/sprite.min.css" rel="stylesheet" type="text/css"/>').appendTo(head);

            // Connecting
            showSignedIn();

          }).attr('src', opts.server + directoryPath + 'images/Sprite.png');
        } else {
          showSignedIn();
        }
      } else {
        var opened = storage.data.tabOpen,
          newState = (opened) ? 'opened' : 'closed',
          oldState = (opened) ? 'closed hidden' : 'opened';

        if (!opts.popup && ((opts.hidden && newState === 'closed') || opts.disabled)) {
          newState = 'hidden';
        }

        if (opts.disabled) {
          oldState = oldState.replace(' hidden', '');
        }

        if (opts.popup && (settings.status === 'Online' || opts.connected)) {
          oldState = 'closed';
          newState = 'opened';
        }

        app.add(container).removeClass(oldState).addClass(newState).attr('data-opened', ((opened) ? true : false));
        if (app.is('.tab')) {
          app.show();
        }

        storage.data.tabOpen = ((opened) ? true : false);
        updateStorage();
      }
    }
  }

  function showRating() {
    var selector = '.rating.parent',
      rating = [{ css: 'good', title: 'Good', rating: 3 }, { css: 'poor', title: 'Poor', rating: 1 }];

    if (!app.find(selector).length) {

      rating.sort(function () { return (Math.round(Math.random()) - 0.5); });

      /*jshint multistr: true */
      var ratingHtml = '<div class="rating parent">' + settings.language.rateyourexperience + ':<br/> \
    <div class="rating container"> \
      <div class="rating ' + rating[0].css + '" title="' + rating[0].title + '" data-rating="' + rating[0].rating + '"></div> \
      <div class="rating neutral" title="Neutral" data-rating="2"></div> \
      <div class="rating ' + rating[1].css + '" title="' + rating[1].title + '" data-rating="' + rating[1].rating + '"></div> \
    </div> \
  </div>';

      app.find('.scroll .end').prepend(ratingHtml);

      // Rating Events
      rating = app.find(selector);
      rating.find('.rating').click(function () {
        var selector = $(this),
          score = $(this).attr('data-rating'),
          data = { RATING: score };

        selector.parent().find('.rating[data-rating!=" + score + "]').addClass('deselected');
        selector.removeClass('deselected');

        if (cookies.session !== undefined && cookies.session.length > 0) {
          data = $.extend(data, { SESSION: cookies.session });
        }
        $.ajax({ url: opts.server + apiPath + apiEndpoint.rating, data: $.param(data), dataType: 'jsonp', cache: false, xhrFields: { withCredentials: true } });
      });

      scrollBottom();
    } else {
      var container = app.find('.rating.parent');
      if (container.is(':visible')) {
        container.hide();
      } else {
        container.show();
        app.find('.scroll').scrollTo(container);
      }
    }
  }

  function updateImageTitle() {
    $parent('.' + prefix + 'Status').each(function () {

      // Title / Alt Attributes
      var status = settings.status;
      if (status === 'BRB') {
        status = 'Be Right Back';
      }
      $(this).attr('title', 'Live Chat - ' + status).attr('alt', 'Live Chat - ' + status);
    });
  }

  function resizeChatTab() {
    // Adjust Styles
    var text = app.find('.status.text'),
      close = app.find(selector + 'CloseButton'),
      tab = app.find('.tab'),
      width = text.position().left + text.width() + close.width() + 30;

    if (app.is('.closed') && text.width() > 0) {
      tab.css('width', width + 2 + 'px');
      app.css('width', width + 'px');
    } else {
      app.css('width', '');
      tab.css('width', '100%');
    }
  }

  function updateStatusText(status) {
    status = localeStatusMode(status);
    app.find('.status.text').text(status);
    if (app.is('.closed') || app.is('.hidden')) {
      resizeChatTab();
    }

    if (status === settings.language.online && opts.personalised) {
      var op = settings.embeddedinitiate;
      if (op.id > 0) {
        showOperatorDetails(op.id, op.name, op.department, op.avatar);
        return;
      }
    }
  }

  function localeStatusMode(status) {
    switch (status) {
      case 'Offline':
        return settings.language.contactus;
      case 'Online':
        return settings.language.online;
      case 'BRB':
        return settings.language.brb;
      case 'Away':
        return settings.language.away;
    }
  }

  function setOffline(status) {
    updateStatusText(status);
    if (settings.loginDetails !== 0) {
      app.find('.operator.container .image').hide();
    }
    app.find('.CloseButton').fadeOut(250);
    app.addClass('offline');

    // Close Tab
    closeTab();
  }

  // Change Status Image
  var settingsRefreshed = false;
  function changeStatus(status, departments) {
    var invite = $parent('.' + prefix + 'Invite'),
      bubble = $parent('.' + namespace + '-initiate-chat'),
      initiate = bubble.is(':visible');

    function updateEmbeddedStatus() {
      invite.show();
      if (opts.embedded === true && app.length > 0) {
        updateStatusText('Online');
        app.find('.CloseButton').fadeIn(250);
        if (!initiate && (!settings.initiate.enabled || !opts.initiateDelay)) {
          var css = 'offline';
          if (!opts.disabled && !opts.hidden && !opts.popup && app.is('.tab')) {
            css = ' hidden';
          }
          app.removeClass(css).addClass('online');
          if (opts.connected) {
            showChat();
          }
        } else if (!initiate && settings.initiate.enabled && opts.initiateDelay > 0) {
          chatbutton.add(container).removeClass('launcher-disabled').addClass('launcher-enabled');
        }
      }
      if (bubble.is('.feedback.rating')) {
        bubble.hide().removeClass('feedback rating');
        app.removeClass('feedback');
      }
    }

    // Update Departments
    updateDepartments(departments);

    if (status === 'Online' && (opts.offline || (departments !== false && opts.embedded && !app.find('.department.input option').length) || (departments !== false && settings.departments.length > 0 && opts.department.length > 0 && $.inArray(opts.department, settings.departments) < 0))) {
      status = 'Offline';
    }

    $parent('.' + prefix + 'TextStatus').each(function () {
      var text = localeStatusMode(status);
      $(this).text(text).attr('title', text);
    });

    // Javascript API
    updateStatusMode(status.toLowerCase());

    if (status === 'Online') {
      if (!settingsRefreshed && departments === undefined && settings.status !== '' && settings.status !== status) {
        updateSettings(function () {
            updateEmbeddedStatus();
          }
        );
        settingsRefreshed = true;

        var css = 'launcher-enabled';
        if (opts.disabled) {
          css += ' hidden';
        }
        chatbutton.add(container).removeClass('launcher-disabled').addClass(css);

      } else {
        updateEmbeddedStatus();
      }
    } else {
      settingsRefreshed = false;
      if (opts.connected) {
        invite.hide();
      }

      // Initiate Bubble
      if (!app.is('.feedback') && !bubble.is('.message') && !app.is('.offline')) {
        bubble.css('bottom', -bubble.outerHeight()).hide();
      }

      if (app.length > 0) {
        if (opts.connected) {
          updateEmbeddedStatus();
        } else {
          if (opts.hideOffline === true) {
            app.addClass('hidden');
          }
        }
      }

      if (status !== 'Online' && opts.hideOffline !== true && opts.connected === false && settings.offlineEmail) {
        setOffline(status);
      }

      if (!app.is('.connected') && opts.hideOffline === true) {
        chatbutton.add(container).removeClass('launcher-disabled').addClass('launcher-disabled');
      }

      // Initiate Chat
      if (status !== 'Online' && $parent(selector + 'InitiateChat').is(':visible')) {
        $parent(selector + 'InitiateChat').fadeOut();
      }
    }

    if (settings.status !== '' && settings.status !== status) {

      // jQuery Status Mode Trigger
      $(document).trigger(prefix + '.StatusModeChanged', [status]);

      // Update Status
      settings.status = status;

      $parent('.' + prefix + 'Status').each(function () {
        // Update Status Image
        var image = settings.images[status.toLowerCase()];
        if (image !== undefined) {
          $(this).attr('src', image);
        } else {
          $(this).attr('src', settings.images.offline);
        }

        // Title / Alt Attributes
        updateImageTitle();
      });

    }
  }

  function getTimezone() {
    var datetime = new Date();
    if (datetime) {
      return datetime.getTimezoneOffset();
    } else {
      return '';
    }
  }

  function updateInitiateStatus(status, message, image) {
    // Update Initiate Chat Status
    if (settings.initiate && settings.initiate.status !== status) {
      settings.initiate.status = status;
      if (visitorInitialised > 0) {
        visitorTimeout = false;

        status = status || 0;
        if (status === -2 || status === -3) {
          $parent(selector + 'InitiateChat').fadeOut(250);
        }

        // Javascript API
        updateInitiateChatState(status, message, image);

        updateSettings(true);
      }
    }
  }

  function toggleInitiateInputs(hide, overrideMessage) {
    if (app.length) {
      app.find('.prechat').hide();
      app.find('.chatting').show();
      app.find('.body').css('background-color', '#fff');
      app.find('.message.container').animate({ bottom: 0 }, 500);

      // Override Content
      var content = opts.introduction;
      if (overrideMessage) {
        content = overrideMessage;
      }

      if (!opts.popup && content && !app.find('.scroll .initiate.chat').length) {
        /*jshint multistr: true */
        var html = '<div class="initiate chat"> \
        <div class="flex initiate"> \
        <div class="name"></div> \
        <div class="avatar"></div> \
        <div class="' + ((opts.messageBubbles) ? 'message bubble left' : 'message') + '" data-id="-1"> \
          <div style="color: #000">' + content + '</div> \
        </div></div> \
        </div>';
        var messages = app.find('.messages');
        $(html).appendTo(messages);
      }

      app.find('.waiting').hide();

      var op = settings.embeddedinitiate;
      if (op.id > 0 && !opts.accepted) {
        showOperatorDetails(op.id, op.name, op.department, op.avatar, !hide);
      }

    }
  }

  function openInitiateChatTab() {
    var textarea = app.find('.message.textarea');

    toggleInitiateInputs();

    var css = 'closed';
    if (opts.disabled) {
      css += ' hidden';
    }
    if (!opts.popup) {
      app.add(container).removeClass('opened').addClass(css);
    }
    $parent('body').removeClass(prefix + 'Opened');

    storage.data.operatorDetailsOpen = true;
    updateStorage();

    openTab(function () {
      setTimeout(function () {
        textarea.focus();
      }, 500);
    }, true);

    updateInitiateStatus(-1);
    app.attr('data-initiate', true);
    app.attr('data-opened', true);
  }

  function sendFeedback() {
    var initiate = $parent('.' + namespace + '-initiate-chat'),
      email = initiate.find('input'),
      input = initiate.find('textarea'),
      text = initiate.find('.text.content'),
      question = initiate.attr('data-question'),
      score = parseInt($parent('.rating.container .rating:not(.deselected)').attr('data-rating'), 10),
      data = {
        QUESTION: question,
        EMAIL: email.val(),
        MESSAGE: input.val(),
        SCORE: score,
        SESSION: cookies.session,
        JSON: true
      };

    $.ajax({ url: opts.server + apiPath + apiEndpoint.feedback,
      data: $.param(data),
      success: function (data) {
        // Process JSON Errors / Result
        if (data.result && data.result === true) {
          text.text('Thanks for the feedback!');
          initiate.find('.feedback input, .feedback textarea').hide();

          var height = $parent('.' + namespace + '-initiate-chat .bubble').outerHeight() + 25 + 'px';
          initiate.animate({ 'height': height }, 250, 'swing');

          storage.store.set('feedback', true);
        }
      },
      dataType: 'jsonp',
      cache: false,
      xhrFields: { withCredentials: true }
    });
  }

  function closeFeedback(permanent) {
    var initiate = $parent('.' + namespace + '-initiate-chat'),
      collapsed = (initiate.attr('data-collapsed') === 'true'),
      height = initiate.css('height'),
      size = '65px',
      close = initiate.find('.close');

    if (!collapsed) {
      height = '-' + height;
      close.hide();
    } else {
      height = 10;
      size = initiate.find('.bubble').outerHeight() + 25 + 'px';
      close.show();
    }

    if (permanent && settings.status !== 'Online') {
      app.add(container).removeClass('feedback').addClass('offline hidden');
      initiate.removeClass('feedback rating opened').addClass('offline').css('height', '');
      initiate.find('.message.bubble').css('bottom', '');
      chatbutton.add(container).removeClass('launcher-disabled').addClass('launcher-enabled');
      storage.store.set('feedback', true);

      // Reset Initiate Chat
      initiate.find('.text.content').text(settings.language.offlinemessagedescription);
    } else {
      initiate.animate({ 'bottom': height }, 250, 'swing');
      initiate.attr('data-collapsed', !collapsed).animate({ 'height': size }, 250, 'swing');

      if (!collapsed) {
        initiate.removeClass('opened').hide();
        container.removeClass('initiate-opened');

        if (!app.is('.tab')) {
          chatbutton.add(container).removeClass('launcher-disabled').addClass('launcher-enabled');
        } else {
          app.removeClass('hidden').addClass('show').show();
        }
      }

      storage.data.feedbackOpen = collapsed;
    }

    updateStorage();
  }

  var closeInitiateChat = function (closing) {
    return function (e) {
      var initiate = $parent('.' + namespace + '-initiate-chat');
      var offline = initiate.is('.offline');
      var message = initiate.is('.message');

      if (closing) {
        if (e) {
          e.stopPropagation();
        }
        if (!offline && !message) {
          updateInitiateStatus(-3); // Declined
        }
      }

      if (offline && closing) {
        toggleOfflineChat();
        return;
      } else if (app.is('.feedback') || closing) {
        closeFeedback();
        return;
      }

      if (offline) {
        return;
      }

      if (opts.embedded) {
        initiate.fadeOut(150, function () {
          openInitiateChatTab();
          initiate.removeClass('opened');
          container.removeClass('initiate-opened');
        });
      } else {
        initiate.fadeOut(150);
        openLiveHelp();
        updateInitiateStatus(-1); // Opened
      }
    };
  };

  function openInitiateChat(initiate) {

    if (app.is('.opened')) {
      return;
    }

    // Initiate Chat Bubble
    initiate.find('.bubble, .feedback').on('click', function (e) {
      if (app.is('.feedback')) {
        e.preventDefault();
        return false;
      }
    });

    initiate.find('a').on('click', function (e) {
      e.stopPropagation();
    });

    // Setup Initiate Chat and Animate
    initiate.on('click', closeInitiateChat(false));
    initiate.find('.close').on('click', closeInitiateChat(true));

    initiate.find('.feedback textarea').on('keypress', function (event) {
      if (event.which === 13) {
        sendFeedback();
        return false;
      } else {
        return true;
      }
    });

    initiate.find('.brand').on('click', function (e) {
      e.stopPropagation();
    });

    // Message Alert
    var message = initiate.is('.message');
    if (message) {
      initiate.show();
    }

    var parent = $parent('.' + namespace + '-initiate-chat'),
      bubble = parent.find('.bubble'),
      bubbleBottom = 10,
      bottom = -(bubble.height() + parseInt(bubble.css('margin-top'), 10) + parseInt(bubble.css('margin-bottom'), 10) + parseInt(parent.css('padding-top'), 10) + parseInt(parent.css('padding-bottom'), 10) + bubbleBottom),
      height = parent.find('.bubble').outerHeight() + 25 + 'px',
      collapsed = (initiate.attr('data-collapsed') === 'true');

    if (!storage.data.feedbackOpen && settings.status !== 'Online' && !message) {
      bubbleBottom = '-' + (parseInt(initiate.find('.bubble').outerHeight(), 10) + parseInt(initiate.find('.bubble').css('margin-top'), 10)) + 'px';
      height = initiate.css('height') + 'px';
      collapsed = true;

      if (!initiate.is('.offline')) {
        initiate.find('.close').hide();
      } else {
        bubbleBottom = 0;
      }
    }

    if (opts.layout !== 'tab' && initiate.is('.offline')) {
      height = 'auto';
    }

    initiate.find('.bubble').animate({ 'bottom': bubbleBottom }, 250, 'swing');
    initiate.attr('data-collapsed', collapsed).animate({ 'height': height }, 250, 'swing');

    if (opts.connected) {
      if (message) {
        bottom = 0;
        initiate.show();
      } else {
        initiate.hide();
      }
      initiate.css('bottom', bottom);
    } else if (!storage.data.offlineOpen) {
      initiate.hide();
    }

    if (!initiate.is('.offline') && (!opts.connected || message)) {
      chatbutton.add(container).removeClass('launcher-enabled').addClass('launcher-disabled');
      initiate.addClass('opened').show();
      container.addClass('initiate-opened');
    }

  }

  function showMessageAlert(message) {

    if (message.length > 150) {
      message = message.substr(0, 150) + '...';
    }

    var initiate = $parent('.' + namespace + '-initiate-chat');
    initiate.find('.message.bubble .text').text(message);
    initiate.find('.close').show();
    initiate.removeClass('feedback').addClass('message');

    if (!app.is('.opened')) {
      app.removeClass('feedback').addClass('hidden');
    }

    openInitiateChat(initiate);
  }

  function updateInitiateChatImage(initiate, feedback, image) {
    // Gravatar
    var url = 'url(\'' + image + '\')';
    $('<img />').one('error', function () {
      $(this).remove();
      url = 'url(\'' + opts.server + apiPath + apiEndpoint.image + '?size=150&round=true\')';
      initiate.find('.operator.photo').css('background-image', url);
      app.find('.InitiateChat .avatar').css('background-image', url);
      if (!feedback) {
        openInitiateChat(initiate);
      }
    }).one('load', function () {
      $(this).remove();
      initiate.find('.operator.photo').css('background-image', url);
      app.find('.InitiateChat .avatar').css('background-image', url);
      if (!feedback) {
        openInitiateChat(initiate);
      }
    }).attr('src', image);
  }

  function toggleOfflineSendButton(force) {
    var label = chatbutton.find('.label');
    if ((!$parent('.email.input').val().length && !$parent('.message.input').val().length) || force) {
      label.text('');
      label.removeClass('send');
      chatbutton.removeClass('send');
      chatbutton.find('.icon').addClass('close');
    } else {
      chatbutton.find('.icon').removeClass('close');
      chatbutton.addClass('send');
      label.text(settings.language.send);
      label.addClass('send');
    }
  }

  function initInitiateChat(hide, overrideMessage, overrideImage) {

    toggleInitiateInputs(hide, overrideMessage);

    var initiate = $parent('.' + namespace + '-initiate-chat'),
      content = opts.introduction,
      collapsed = (initiate.attr('data-collapsed') === 'true'),
      image = false;

    if (!initiate.length) {

      var operator = settings.embeddedinitiate,
        copyright = (settings.language.copyright.length) ? ' copyright' : '';

      if (operator.id > 0) {
        image = 'https://secure.gravatar.com/avatar/' + operator.avatar + '?s=150&r=g&d=404';
      }

      if (settings.images.initiatechat !== undefined && settings.images.initiatechat.length > 0) {
        image = settings.images.initiatechat;
      }

      // Override image
      if (overrideImage) {
        image = overrideImage;
      }

      // Override Content
      if (overrideMessage) {
        content = overrideMessage;
      }

      // Feedback
      if ($.isArray(opts.feedback) && opts.feedback.length > 0 && settings.status !== 'Online') {
        opts.feedback.sort(function () { return (Math.round(Math.random()) - 0.5); });
        content = opts.feedback[0];
      }

      var rating = [{ css: 'good', title: 'Good', rating: 3 }, { css: 'poor', title: 'Poor', rating: 1 }];
      rating.sort(function () { return (Math.round(Math.random()) - 0.5); });

      var offline = '';
      if (app.is('.offline')) {
        offline = 'offline';
      }

      /*jshint multistr: true */
      var html = '<div class="' + namespace + '-initiate-chat ' + offline + '" data-collapsed="false"> \
<div class="message bubble right' + copyright + '"> \
<div class="top border"></div> \
<div class="intro">' + settings.language.feedbackintroduction + '</div> \
<div class="text content">' + content + '</div> \
<div class="feedback"> \
  <input class="email input" type="text" tabindex="100" placeholder="' + settings.language.enteryourfeedbackemail + '"/> \
  <textarea class="message input" type="text" tabindex="200" placeholder="' + settings.language.enteryourfeedback + '"></textarea> \
  <div class="needsupport hidden">' + settings.language.needsupport + '  <a href="#" target="_blank">' + settings.language.clickhere + '</a></div> \
  <div class="rating container"> \
    <div class="rating ' + rating[0].css + '" title="' + rating[0].title + '" data-rating="' + rating[0].rating + '"></div> \
    <div class="rating neutral" title="Neutral" data-rating="2"></div> \
    <div class="rating ' + rating[1].css + '" title="' + rating[1].title + '" data-rating="' + rating[1].rating + '"></div> \
  </div> \
</div> \
<div class="offline"> \
  <form method="post" id="OfflineMessageForm"> \
    <div> \
      <input class="name input" type="text" autocomplete="name" tabindex="100" placeholder="' + settings.language.enteryourofflinename + '"/> \
      <div class="name error sprite TickSmall" title="Name Required" class=""></div> \
    </div> \
    <div> \
      <input class="email input" type="text" autocomplete="email" tabindex="200" placeholder="' + settings.language.enteryourofflineemail + '"/> \
      <div class="email error sprite TickSmall" title="Email Required"></div> \
    </div> \
    <input class="website input" type="text" autocomplete="none" tabindex="300"/> \
    <div> \
      <textarea class="message input" type="text" tabindex="300" placeholder="' + settings.language.enteryourofflinemessage + '"></textarea> \
      <div class="message error sprite TickSmall" title="Message Required"></div> \
    </div> \
  </form> \
</div> \
<a href="https://www.chatstack.com" target="_blank" class="brand"><div></div></a> \
</div> \
<div class="operator photo"></div> \
<div class="operator badge">1</div> \
<div class="close" title="' + settings.language.close + '"><span class="icon">&#10005;</span><span class="text">' + settings.language.close + '</span></div> \
</div>';

      var parent = container.not(launcher).not(app);
      initiate = $(html).appendTo(parent);

      // Offline Widget Events
      $parent('.' + namespace + '-initiate-chat').find('.email.input, .message.input').on('change keyup input focus blur', function () {
        toggleOfflineSendButton();
      });

      var feedback = false;
      if (app.is('.feedback')) {
        initiate.addClass('feedback rating');
        feedback = true;

        if (settings.images.feedback !== undefined && settings.images.feedback.length > 0) {
          image = settings.images.feedback;
        }

        var supportaddress = false;
        if (settings.supportaddress.length > 0 && (settings.supportaddress.indexOf('https://') !== -1 || settings.supportaddress.indexOf('http://') !== -1)) {
          var support = initiate.find('.needsupport');

          supportaddress = true;
          support.find('a').attr('href', settings.supportaddress);
          support.removeClass('hidden');
        }

        rating = $parent('.rating.container');
        rating.find('.rating').click(function () {
          var element = $(this),
            type = 'neutral',
            text = 'How can we improve?',
            score = parseInt($(this).attr('data-rating'), 10);

          switch (score) {
            case 1:
              type = 'poor';
              text = 'Sorry to hear that.  Please let us know how we can improve.';
              break;
            case 3:
              type = 'good';
              text = 'That\'s great!  Please let us know if you have any feedback.';
              break;
          }

          element.parent().find('.rating[data-rating!=" + score + "]').addClass('deselected');
          element.removeClass('deselected');
          initiate.removeClass('rating').addClass(type);

          var height = '223px';
          if (supportaddress) {
            height = '241px';
          }
          initiate.css('height', height);

          element = initiate.find('.text.content');
          initiate.attr('data-question', element.text());
          initiate.find('.text.content').text(text);
        });

      } else {
        initiate.removeClass('feedback');

        // Javascript API
        if (hide) {
          updateInitiateStatus(-1, content, image); // Opened
        }
      }

      $(document).trigger(prefix + '.InitiateChatLoaded');

      // Initiate Chat Image
      updateInitiateChatImage(initiate, feedback, image);

      if (hide && !opts.popup) {
        app.add(container).removeClass('opened').addClass('closed hidden');
        $parent('body').removeClass(prefix + 'Opened');
      }
    } else {

      // Override Content
      if (overrideMessage) {
        content = overrideMessage;
      }

      var element = initiate.find('.text.content');
      if (!initiate.is('.sent') && !initiate.is('.feedback') && element.text() !== content) {
        element.text(content);
      }

      // Override image
      if (overrideImage) {
        image = overrideImage;
        updateInitiateChatImage(initiate, false, overrideImage);
      }

      if (opts.embedded && !chatbutton.is(':visible') && collapsed) {
        initiate.fadeIn(150, function () {
          initiate.addClass('opened');
        });
      }

      // Javascript API
      if (hide) {
        updateInitiateStatus(-1, content, image); // Opened
      }

    }

  }

  var showFeedback = _.once(function () {
    var initiate = $parent('.' + namespace + '-initiate-chat');
    openInitiateChat(initiate);
  });

  function checkFeedback() {
    var s = $(window).scrollTop(),
      d = $(document).height(),
      c = $(window).height();

    var scrollPercent = (s / (d - c)) * 100,
      initiate = $parent('.' + namespace + '-initiate-chat');

    if (opts.feedbackDelay > 0) {
      setTimeout(showFeedback, opts.feedbackDelay * 1000);
    } else {
      if (scrollPercent > 50 && initiate.is('.feedback')) {
        showFeedback();
      }
    }

  }

  function displayInitiateChat(overrideDelay, overrideStatus, overrideMessage, overrideImage) {

    function showInitiateChat(overrideStatus) {

      if (opts.initiate && (settings.status !== undefined && settings.status === 'Online' || overrideStatus !== undefined)) {
        if (settings.embeddedinitiate !== undefined && settings.embeddedinitiate != null) {
          // Embedded Initiate Chat
          if ((app.is('.closed') || app.is('.hidden')) && opts.visitorTracking && !$.data(app, 'initiate') && settings.initiate.status !== -3) {
            initInitiateChat(true, overrideMessage, overrideImage);
          }
        }
      }
    }

    if (opts.initiateDelay > 0 && !overrideDelay) {
      setTimeout(showInitiateChat, opts.initiateDelay);
    } else {
      showInitiateChat(overrideStatus, overrideMessage, overrideImage);
    }
  }


  // Mouse Activity
  var debouncedMouseActivity = _.debounce(function () {
    loadTime = $.now();
  }, 500);

  $(document).on('mousemove', debouncedMouseActivity);

  // Get URL Parameter
  function getParameterByName(url, name) {
    name = name.replace(/(\[|\])/g, '\\$1');
    var ex = '[\\?&]' + name + '=([^&#]*)',
      regex = new RegExp(ex),
      results = regex.exec(url);

    if (results === null) {
      return '';
    } else {
      return decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
  }

  function offlineComplete() {
    var id = 'Offline';
    $parent('.' + prefix + id + 'Form').hide();
    $parent('.' + prefix + id + 'Sent').show();
    if (opts.embedded) {
      $parent('.' + prefix + id + 'PoweredBy').css('right', '150px');
    }
    $parent(selector + id + 'Heading').html(settings.language.thankyoumessagesent).fadeIn(250);
    $(document).trigger('LiveHelp.ContactComplete');
  }

  function offlineSend(callback) {
    var id = 'Offline',
      offline = '#' + prefix + id,
      form = $parent('#' + id + 'MessageForm'),
      name = form.find('.name.input'),
      email = form.find('.email.input'),
      message = form.find('.message.input'),
      captcha = form.find('.securitycode.input');

    // Input
    name = (name.length > 0) ? name.val() : '';
    email = (email.length > 0) ? email.val() : '';
    message = (message.length > 0) ? message.val() : '';

    var data = { NAME: name, EMAIL: email, MESSAGE: message, JSON: '' };
    if (opts.security.length > 0) {
      $.extend(data, { SECURITY: captcha.val() });
    }
    if (cookies.session !== undefined && cookies.session.length > 0) {
      $.extend(data, { SESSION: cookies.session });
    }
    if (opts.template !== undefined && opts.template.length > 0) {
      $.extend(data, { TEMPLATE: opts.template });
    }

    $.ajax({ url: opts.server + apiPath + apiEndpoint.offline,
      data: $.param(data),
      dataType: 'jsonp',
      cache: false,
      xhrFields: { withCredentials: true }
    }).done(function (data) {

      // Enable Offline Button
      var button = $(offline + 'Button');
      if (button.length) {
        button.removeAttr('disabled');
      }

      // Process JSON Errors / Result
      var success = false;
      if (data.result !== undefined && data.result === true) {
        offlineComplete();
        success = true;
      } else {
        if (data.type !== undefined) {
          if (data.type === 'EMAIL') {
            $parent('.email.error').removeClass('TickSmall').addClass('CrossSmall').fadeIn(250);
          }
          if (data.type === 'CAPTCHA') {
            $parent('.securitycode.error').removeClass('TickSmall').addClass('CrossSmall').fadeIn(250);
          }
        }
        if (data.error !== undefined && data.error.length > 0) {
          $parent(offline + 'Description').hide();
          $parent(offline + 'Error span').html('Error: ' + data.error).parent().fadeIn(250);
        } else {
          $parent(offline + 'Error').fadeIn(250);
          $parent(offline + 'Heading').text(settings.language.offlineerrortitle);
          $parent(offline + 'Description').hide();
        }
      }

      if (callback) {
        callback(success);
      }
    });
  }

  function validateResult(id, result) {
    if (result) {
      $(id).removeClass('CrossSmall').addClass('TickSmall').fadeIn(250);
      return true;
    } else {
      $(id).removeClass('TickSmall').addClass('CrossSmall').fadeIn(250);
      return false;
    }
  }

  function validateField(obj, id) {
    var value = (obj instanceof $) ? obj.val() : $(obj).val(),
      result = ($.trim(value) === '');

    return validateResult(id, !result);
  }

  function validateTelephone(obj, id) {
    var value = (obj instanceof $) ? obj.val() : $(obj).val(),
      result = ($.trim(value).length > 0 && /^[\d| |-|.]{3,}$/.test(value));

    return validateResult(id, result);
  }

  function validateEmail(obj, id) {
    var elem = (obj instanceof $) ? obj : $(obj),
      value = elem.val(),
      verify = elem.attr('data-verify'),
      result = (/^[-!#$%&'*+\\./0-9=?A-Z^_`a-z{|}~]+@[-!#$%&'*+\\/0-9=?A-Z^_`a-z{|}~]+\.[-!#$%&'*+\\./0-9=?A-Z^_`a-z{|}~]+$/i.test(value)) && ((verify !== undefined && verify.length > 0 && verify === CryptoJS.SHA1(value).toString()) || !value.length || verify === undefined);

    return validateResult(id, result);
  }

  function validateSecurity(obj, id, complete) {
    var field = (obj instanceof $) ? obj : $(obj),
    errorClass = 'CrossSmall',
    successClass = 'TickSmall',
    value = field.val(),
    data = { SECURITY: opts.security, CODE: value, JSON: '', EMBED: '' },
    validate = opts.security.substring(16, 56);

    function ajaxValidation() {
      $.ajax({ url: opts.server + apiPath + apiEndpoint.security,
        data: $.param(data),
        success: function (data) {
          var error = '';
          if (data.result !== undefined) {
            // Process JSON Errors / Result
            if (data.result === true) {
              $(id).removeClass(errorClass).addClass(successClass).fadeIn(250);
              if (complete) {
                complete();
              }
            } else {
              error = 'CAPTCHA';
            }

          } else {
            error = 'CAPTCHA';
          }

          // Error Handling
          if (error.length > 0) {
            $(id).removeClass(successClass).addClass(errorClass).fadeIn(250);
          }
        },
        dataType: 'jsonp',
        cache: false,
        xhrFields: { withCredentials: true }
      });
    }

    if (field.length > 0) {
      if (value.length !== 5) {
        if (value.length > 5) {
          field.val(value.substring(0, 5));
        }
        $(id).removeClass(successClass).addClass(errorClass).fadeIn(250);
        return false;
      } else {

        if (validate.length === 40) {
          // Validate Security Code
          if (validate === CryptoJS.SHA1(value.toUpperCase()).toString()) {
            $(id).removeClass(errorClass).addClass(successClass).fadeIn(250);
            if (complete) {
              complete();
            }
            return true;
          } else {
            return false;
          }
        } else {
          ajaxValidation(complete);
        }
      }
    } else {
      if (complete) {
        complete();
      }
      return true;
    }
  }

  function validateForm(form, callback) {
    var name = form.find('.name.input'),
      telephone = form.find('.telephone.input');

    if (name.length && !validateField(name, '.name.error')) {
      return;
    } else if (!validateEmail(form.find('.email.input'), '.email.error')) {
      return;
    } else if (!validateField(form.find('.message.input'), '.message.error')) {
      return;
    }
    if (telephone.length && !validateField(telephone, '.telephone.error')) {
      return;
    }
    validateSecurity(form.find('.securitycode.input'), '.securitycode.error', function () {
      callback.call();
    });
  }

  function validateOfflineForm() {
    var form = $parent('#OfflineMessageForm');
    validateForm(form, offlineSend);
  }

  var updateSecuritySession = _.once(function (session) {
    if (opts.cookie.localStorage) {
      storage.store.set(cookie.name, session);
    } else {
      Chatstack.cookies.set(cookie.name, session, { domain: opts.domain, expires: cookie.expires });
    }
  });

  function resetSecurityCode(selector, form) {
    if (cookies.session !== null) {
      updateSecuritySession(cookies.session);
    }
    form.find('.securitycode.input').val('');

    $.ajax({ url: opts.server + apiPath + apiEndpoint.security,
      data: { RESET: '', JSON: '' },
      success: function (json) {
        if (json.captcha !== undefined) {
          opts.security = json.captcha;
          var data = '';
          if (opts.security.length > 0) {
            data = '&' + $.param($.extend(data, { SECURITY: encodeURIComponent(opts.security), RESET: '', EMBED: '' }));
          }
          $parent('.securitycode.image').attr('src', opts.server + apiPath + apiEndpoint.security + '?' + $.now() + data);
        }
      },
      dataType: 'jsonp',
      cache: false,
      xhrFields: { withCredentials: true }
    });
    $parent('.securitycode.error').fadeOut(250);
  }

  function initInputEvents(id, selector, form) {

    $parent(selector + 'Button, ' + selector + 'CloseButton').hover(function () {
      $(this).toggleClass(id + 'Button ' + id + 'ButtonHover');
    }, function () {
      $(this).toggleClass(id + 'Button ' + id + 'ButtonHover');
    });

    $parent('.securitycode.refresh').click(function () {
      resetSecurityCode(selector, form);
    });

    if ($(form).length && id === 'Offline') {

      $parent(selector + 'Button').click(function () {
        validateOfflineForm();
        $(this).attr('disabled', 'disabled');
      });

      $parent(selector + 'CloseButton').click(function () {
        $.fancybox.close();
      });
    } else {
      app.find(selector + 'CloseButton, .logo, .status.text').click(function () {
        if (settings.status === 'Online' || opts.connected) {
          if ($(this).is('.expand')) {
            openTab(false, false);
          } else {
            closeTab(true);
          }
        } else {
          openLiveHelp();
        }
      });
    }


    $parent('.blocked.close.button').click(function () {
      if (opts.embedded) {
        closeTab();
      } else if (opts.popup) {
        window.close();
      }
    });

    form.find('.name.input').on('keydown blur', function () {
      validateField(this, '.name.error');
    });

    form.find('.email.input').on('keydown blur', function () {
      validateEmail(this, '.email.error');
    });

    form.find('.message.input').on('keydown blur', function () {
      validateField(this, '.message.error');
    });

    form.find('.country.input').on('keydown blur', function () {
      validateField(this, '.country.error');
    });

    form.find('.telephone.input').on('keydown blur', function () {
      validateTelephone(this, '.telephone.error');
    });

    form.find('.securitycode.input').on('keydown', function () {
      if ($(this).val().length > 5) {
        $(this).val($(this).val().substring(0, 5));
      }
    }).on('keyup', function () {
      validateSecurity(this, '.securitycode.error');
    });
  }

  function initOfflineEvents() {
    var id = 'Offline',
      selector = '#' + prefix + id,
      form = $parent('#' + id + 'MessageForm');

    initInputEvents(id, selector, form);
    loadSprite();
  }

  // Callback Placeholder

  function openEmbeddedOffline(data) {

    if (cookies.session !== undefined && cookies.session.length > 0) {
      data = $.extend(data, { SESSION: cookies.session });
    } else {
      if (!signup) {
        return;
      }
    }

    // Language
    data = $.extend(data, { LANGUAGE: settings.locale });

    $.fancybox.showLoading();

    data = $.extend(data, { SERVER: opts.server + directoryPath, JSON: '', RESET: '', EMBED: '', TEMPLATE: opts.template });
    $.jsonp({ url: opts.server + apiPath + apiEndpoint.offline + '?callback=?&' + $.param(data),
      data: $.param(data),
      success: function (data) {
        if (data.captcha) {
          opts.security = data.captcha;
        }
        if (data.html) {
          $.fancybox.open({ content: data.html, type: 'html', fitToView: true, closeClick: false, nextClick: false, arrows: false, mouseWheel: false, keys: null, helpers: { overlay: { css: { cursor: 'auto' }, closeClick: false }, title: null }, padding: 0, minWidth: 300, width:840, height:551, beforeShow: updateSettings, afterShow: initOfflineEvents });
        }
      }
    });
  }

  // Live Help Popup Window
  function openLiveHelp(obj, department, location, data, override) {
    var template = '',
      callback = false,
      status = settings.status,
      feedback = app.is('.feedback'),
      button = (obj) ? obj.is('.' + prefix + 'Button') : false;

    if (button && feedback) {
      closeFeedback(true);
    }

    if (feedback && !override) {
      if (app.is('.closed') || app.is('.hidden')) {
        openTab(false, false);
      } else {
        closeTab();
      }
      return;
    }

    if (cookies.session !== undefined && cookies.session.length > 0) {
      data = $.extend(data, { SESSION: cookies.session });
    } else {
      if (app.is('.signup-collapsed')) {
        signup = true;
        data = $.extend(data, { LANGUAGE: 'en', TIME: $.now() });
        openEmbeddedOffline(data);
      }
      return;
    }

    if (obj !== undefined && settings.templates.length > 0) {
      var css = obj.attr('class');
      if (css !== undefined) {
        template = css.split(' ')[1];
        if (template === undefined || $.inArray(template, settings.templates) < 0) {
          template = '';
        }
      }

      var src = obj.children('img.' + prefix + 'Status').attr('src');
      department = getParameterByName(src, 'DEPARTMENT');
    }

    // Override Template
    if (opts.template !== undefined && opts.template.length > 0) {
      template = opts.template;
    }

    // Language
    data = $.extend(data, { LANGUAGE: settings.locale, TIME: $.now() });

    // Callback
    if (obj !== undefined && obj.attr('class') !== undefined && obj.attr('class').indexOf('LiveHelpCallButton') !== -1) {
      callback = true;
    }

    if (opts.embedded && !callback) {

      // Department
      if (opts.department.length > 0) {
        department = opts.department;
      }

      if (status === 'Online' || opts.connected) {
        if (app.is('.closed') || app.is('.hidden')) {
          openTab(false, true);
        }
      } else {

        if (settings.offlineRedirect !== '') {
          document.location = settings.offlineRedirect;
        } else if (settings.offlineEmail !== 0) {
          if (opts.layout !== 'tab') {
            toggleOfflineChat();
          } else {
            openEmbeddedOffline(data);
          }
        }

      }
      return false;
    }

    // Department / Template
    if (department !== undefined && department !== '') {
      if ($.inArray(department, settings.departments) === -1) {
        status = 'Offline';
      }
      data = $.extend(data, { DEPARTMENT: department });
    }
    if (template !== undefined && template !== '') {
      data = $.extend(data, { TEMPLATE: template });
    }

    // Location
    if (!location && !opts.embedded) {
      location = apiEndpoint.home;
    }

    if (status === 'Online') {

      // Name
      if (opts.name !== '') {
        data = $.extend(data, { NAME: opts.name });
      }

      // Email
      if (opts.email !== '') {
        data = $.extend(data, { EMAIL: opts.email });
      }

      // Open Popup Window
      popup = window.open(opts.server + apiPath + location + '?' + $.param(data), prefix, size);

      if (popup) {
        try {
          popup.opener = window;
        } catch (e) {
          // console.log(e);
        }
      }

    } else {

      if (settings.offlineEmail === 0) {
        if (settings.offlineRedirect !== '') {
          document.location = settings.offlineRedirect;
        }
      } else {
        popup = window.open(opts.server + apiPath + apiEndpoint.offline + '?' + $.param(data), prefix, size);
      }
      return false;
    }

  }

  // Connecting
  function showConnecting() {
    // Hide Sign In / Input Fields
    app.find('.prechat .details, .prechat .inputs').hide();

    // Add and Show Connecting
    var connecting = app.find('.connecting'),
      progress = connecting.find('.connecting .container'),
      messages = app.find('.messages .message[data-id!=-1]').length,
      initiate = app.attr('data-initiate') === 'true';

    if (progress.length > 0) {
      if (!progress.find('img').length) {
        progress.prepend('<img src="' + opts.server + directoryPath + 'images/ProgressRing.gif" style="opacity: 0.5"/>');
      }
    }
    if (!initiate && !messages) {
      connecting.show();
    }
  }

  function startChat(validate) {
    var name = app.find('.name.input'),
      department = app.find('.department.input'),
      email = app.find('.email.input'),
      question = app.find('.question.input'),
      other = app.find('.other.input'),
      inputs = app.find('.prechat .inputs'),
      connecting = app.find('.connecting'),
      deferred = $.Deferred();

    if (app.find('.feedback').length) {
      deferred.resolve();
      return deferred.promise();
    }

    var overrideValidation = (validate !== undefined && validate === false) ? true : false;

    // Signup Placeholder

    // Connecting
    opts.connecting = true;
    if (opts.connected) {
      showConnecting();
    }

    // Department
    if (opts.department.length > 0) {
      department.val(opts.department);
    }
    if (department.length > 0 && department.val() !== null) {
      storage.data.department = department.val();
      updateStorage();
    }

    if (settings.requireGuestDetails && !overrideValidation) {
      var errors = { name: true, email: true, department: true };

      errors.name = validateField(name, '.name.error');
      if (settings.loginEmail) {
        errors.email = validateEmail(email, '.email.error');
      }

      if (settings.departments.length > 0) {
        var collapsed = department.data('collapsed');

        errors.department = validateField(department, '.department.error');
        if (!collapsed) {
          department.data('collapsed', true);
          department.animate({ width: department.width() - 35 }, 250);
        }
      }

      if (!errors.name || !errors.email || !errors.department) {
        connecting.hide();
        inputs.show();
        deferred.resolve();
        return deferred.promise();
      }
    }

    // Input
    name = (name.length > 0) ? name.val() : '';
    department = (department.length > 0 && department.val() !== null) ? department.val() : '';
    email = (email.length > 0) ? email.val() : '';
    other = (other.length > 0) ? other.val() : '';
    question = (question.length > 0) ? question.val() : '';

    // Name
    if (name.length > 0) {
      settings.user = name;
    }

    var data = { NAME: name, EMAIL: email, DEPARTMENT: department, QUESTION: question, OTHER: other, SERVER: document.location.host, JSON: '' };
    if (cookies.session !== null) {
      data = $.extend(data, { SESSION: cookies.session });
    }

    $.ajax({ url: opts.server + apiPath + apiEndpoint.chat,
      data: $.param(data),
      success: function (data) {
        // Process JSON Errors / Chat ID
        if (data.error === undefined) {
          if (data.session !== undefined && data.session.length > 0) {

            // Connecting Event
            $(document).trigger(prefix + '.Connecting', data);

            // Update Settings
            updateSettings();

            app.find('.message.textarea').removeAttr('disabled');
            storage.data.chatEnded = false;
            updateStorage();

            settings.email = data.email;

            if (settings.user.length > 0) {
              settings.user = data.user;
            }
            if (cookies.session !== null) {
              cookies.session = data.session;
              if (opts.cookie.localStorage) {
                storage.store.set(cookie.name, cookies.session);
              } else {
                Chatstack.cookies.set(cookie.name, cookies.session, { domain: opts.domain, expires: cookie.expires });
              }
            }

            if (queued.length > 0 && !settings.loginDetails) {
              sendMessage(queued[0], function () {
                promptPrechatEmail();
                showChat();
              });
              queued = [];
            } else {
              promptPrechatEmail();
              showChat();
            }

            deferred.resolve();

            if (opts.popup) {
              app.find('.prechat .inputs').hide();
              app.find(selector + 'Chat').fadeIn(250);
            }

            if (!opts.disabled) {
              opts.connected = true;
              if (opts.connecting) {
                opts.connecting = false;
              }

              // Javascript API
              updateChatState('waiting');
            }
          } else {
            deferred.resolve();
          }

          if (data.status && data.status === 'Offline') {
            closeTab();
            if (opts.hideOffline === true) {
              app.fadeOut(250).css('z-index', '10000000');
            } else {
              app.fadeIn(250).css('z-index', '5000');
              updateStatusText('Offline');
            }
            app.find('.CloseButton').fadeOut(250);
          }

          promptEmail();

        } else {
          opts.connected = false;
        }
      },
      dataType: 'jsonp',
      cache: false,
      xhrFields: { withCredentials: true }
    });

    return deferred.promise();

  }

  function disconnectChat() {
    opts.connected = false;

    // Javascript API
    updateChatState('disconnected');

    storage.data.chatEnded = true;
    storage.data.department = '';
    storage.data.lastMessage = 0;
    updateStorage();
    message = 0;

    $.ajax({ url: opts.server + apiPath + apiEndpoint.signout,
      data: { SESSION: encodeURIComponent(cookies.session) },
      cache: false,
      xhrFields: { withCredentials: true },
      success: function () {
        if (opts.popup) {
          window.close();
        }
        $(document).trigger(prefix + '.Disconnect');
      },
      error: function (jqXHR, textStatus) {
        console.log(textStatus);
      }
    });
    $.fancybox.close();
  }

  function updateTyping(status) {
    if (status === true) {
      status = 1;
    } else {
      status = 0;
    }
    if (status !== currentlyTyping) {
      currentlyTyping = status;
      $(document).trigger(prefix + '.UpdateTyping', { typing: currentlyTyping });
    }
  }

  function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#039;'
    };

    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
  }

  function removeHTML(text) {
    text = escapeHtml(text);
    return text;
  }

  var displaySentMessage = function (msg, callback) {
    return function (data) {
      if (data && data.length) {
        if (data.id && !app.find('.flex[data-id=' + data.id + ']').length) {

          var css = 'message',
            margin = 15;

          if (opts.messageBubbles) {
            css += ' bubble right';
            margin = 0;
          }

          if (!data.datetime) {
            data.datetime = (Date.now() / 1000 | 0);
          }

          var html = '<div class="flex right" data-id="' + data.id + '" data-datetime="' + data.datetime + '"><div class="' + css + '" align="left">',
            username = (settings.user.length > 0) ? settings.user : 'Guest';

          if (!opts.messageBubbles) {
            html += removeHTML(username) + ' ' + settings.language.says + ':<br/>';
          }

          var content = removeHTML(msg);
          if (content.length) {
            consecutive = false;

            content = replaceMessageContent(content);
            html += '<div style="margin: 0 0 0 ' + margin + 'px">' + content + '</div></div></div>';
            app.find('.messages').append(html);

            autoCollapseOperatorDetails();
            scrollBottom();
          }

          if (callback) {
            callback();
          }

        }
      }
    };
  };

  function sendMessage(message, callback) {
    var data = { MESSAGE: message },
      url = opts.server + apiPath + apiEndpoint.send,
      obj = app.find('.message.textarea');

    if (cookies.session !== undefined && cookies.session.length > 0) {
      data = $.extend(data, { SESSION: cookies.session });
      if (message === 0) {
        $.ajax({ url: url, data: $.param(data), dataType: 'jsonp', cache: false, xhrFields: { withCredentials: true } });
      } else {
        data.JSON = '';
        $.ajax({ url: url, data: $.param(data), success: displaySentMessage(message, callback), dataType: 'jsonp', cache: false, xhrFields: { withCredentials: true } });
        updateTyping(false);
      }
      obj.val('');
      storage.store.set('message', '');
    }
  }

  var queued = [];
  function processForm() {
    var obj = app.find('.message.textarea'),
      message = obj.val(),
      initiate = app.attr('data-initiate') === 'true';

    if (!opts.connected) {
      startChat(false).done(function () {
        if (initiate && message.length) {
          sendMessage(message);
        }
      });
      if (!initiate && message.length) {
        queued.push(message);
        obj.val('');
        storage.store.set('message', '');
      }
      return false;
    }

    if (message.length) {
      sendMessage(message);
    }
    return false;
  }

  function toggleOfflineChat(force) {
    var initiate = $parent('.' + namespace + '-initiate-chat');

    if (initiate.is('.opened') || force) {
      // Close Offline Chat
      initiate.animateCss(animationPrefix + 'slideOutRight').done(function () {
        initiate.removeClass('opened sent').hide();
        toggleOfflineSendButton(true);
      });
      chatbutton.find('.icon').animateCss(animationPrefix + 'fadeOut').done(function () {
        container.removeClass('opened').addClass('closed');
        chatbutton.find('.icon').removeClass('close');
      });
      storage.data.offlineOpen = false;
    } else {

      // Offline Redirect
      if (settings.offlineRedirect !== '') {
        document.location = settings.offlineRedirect;
        return;
      }

      // Open Offline Chat
      initiate.addClass('opened').show().animateCss(animationPrefix + 'bounceInRight');
      container.removeClass('hidden').addClass('opened');
      chatbutton.find('.icon').addClass('close').animateCss(animationPrefix + 'fadeIn');
      storage.data.offlineOpen = true;

      // Adjust Send button
      toggleOfflineSendButton();
    }
    updateStorage();
  }

  // Embedded Events
  function initEmbeddedEvents() {
    if (app.length > 0) {

      var offlineMessaging = (opts.layout !== 'tab' && settings.status === 'Offline');
      if (offlineMessaging) {
        initOfflineEvents();
      }

      app.find('.tab, .status.text, .operator.container .image, .' + prefix + 'Operator, .' + prefix + 'Button').add(chatbutton).click(function (e) {
        opts.embedded = true;
        if (settings.status === 'Online' || opts.connected) {
          if (app.is('.closed') || app.is('.hidden')) {
            if (!storage.data.notificationEnabled) {
              storage.data.notificationEnabled = true;
            }
            var override = (!settings.loginDetails) ? false : true;
            openTab(false, override);
          } else {
            closeTab(true);
          }
          updateStorage();
        } else if (offlineMessaging) {
          if (chatbutton.is('.send')) {
            // Send Offline Email
            var form = $parent('#OfflineMessageForm');
            validateForm(form, function () {
              offlineSend(function (success) {
                if (success) {
                  // Sent
                  var initiate = $parent('.' + namespace + '-initiate-chat');
                  initiate.addClass('sent');
                  initiate.find('input, textarea').val('');
                  initiate.find('.text.content').text(settings.language.thankyoumessagesent);
                  initiate.find('.sprite.error').removeClass('CrossSmall TickSmall');

                  // Hiden Send Button
                  toggleOfflineSendButton(true);
                } else {
                  // Retry
                  var label = chatbutton.find('.label');
                  label.text(settings.language.retry);
                }
              });
            });
          } else {
            // Offline Chat
            toggleOfflineChat();
          }
        } else {
          openLiveHelp();
        }
        e.stopPropagation();
      });

      app.find('.status.text, .operator.container .image, .' + prefix + 'CloseButton').hover(function () {
        $(this).parent().find('.tab').addClass('hover');
      }, function () {
        $(this).parent().find('.tab').removeClass('hover');
      });

      app.find(selector + 'CloseButton, .logo, .status.text').click(function () {
        if (settings.status === 'Online' || opts.connected) {
          if ($(this).is('.expand')) {
            openTab(false, false);
          } else {
            closeTab(true);
          }
        } else {
          openLiveHelp();
        }
      });

      app.find('.blocked.close.button').click(function () {
        closeTab();
      });

      app.find('.collapse.button').click(function () {
        var top = parseInt(app.find('.body').css('top'), 10);
        if (top === 86) {
          hideOperatorDetails();
        } else {
          showOperatorDetails();
        }
      });

    }
  }

  function blockChat() {
    // Block Chat
    opts.connected = false;

    // Javascript API
    updateChatState('disconnected');

    storage.data.chatEnded = true;
    storage.data.department = '';
    storage.data.lastMessage = 0;
    updateStorage();
    message = 0;

    app.find('.chatting, .prechat .inputs, .collapse.button, .toolbar, .prechat .details, .connecting').fadeOut();
    app.find('.prechat, .blocked.details').fadeIn();
    app.find('.message.textarea').attr('disabled', 'disabled');
    app.find('.closed-chat').show();

    var blocked = app.find('#BlockedChat');
    blocked.fadeIn();
    if (!blocked.find('img').length) {
      blocked.prepend('<img src="' + opts.server + directoryPath + 'images/Block.png"/>');
    }
  }

  function initChatEvents() {

    // Connected / Disconnect
    $(document).on(prefix + '.Connected', function (event, id, firstname, department, hash, channel) { // eslint-disable-line no-unused-vars
      opts.accepted = true;
      opts.operator = { id: id, firstname: firstname, department: department, hash: hash };
      showOperatorDetails(id, firstname, department, hash, true, true);
    }).on(prefix + '.Disconnect', function () {
      opts.connected = false;

      // Javascript API
      updateChatState('disconnected');

      storage.data.chatEnded = true;
      storage.data.department = '';
      storage.data.lastMessage = 0;
      updateStorage();
      app.removeClass('connected').addClass('completed');
      app.find('.message.textarea').attr('disabled', 'disabled');
      if (app.find('.chatting').is(':visible') || opts.popup) {
        showRating();
      }
      $.ajax({ url: opts.server + apiPath + apiEndpoint.signout,
        data: { SESSION: encodeURIComponent(cookies.session) },
        dataType: 'jsonp',
        cache: false,
        xhrFields: { withCredentials: true }
      });
    }).on(prefix + '.BlockChat', function () {
      blockChat();
    });

    $(document).on('click', '.closed-chat a', function () {
      var input = app.find('.message.container');
      if (!settings.loginDetails) {
        app.find('.body').css('background-color', '#fff');
        input.animate({ bottom: 0 }, 500);
      } else {
        app.find('.connecting').hide();
        app.find('.body').css('background-color', '#f9f6f6');
        app.find('.prechat, .prechat .inputs').show();
        app.find('.chatting').hide();
        input.find('.smilies.icon, .typing').show();
        input.css({ bottom: '-100px' });
      }

      if (app.is('.completed')) {
        app.removeClass('completed');
      }
      input.find('textarea').removeAttr('disabled').show();
      app.find('.rating.container, .closed-chat').hide();
    });

    // Toolbar
    app.find('.toolbar div').hover(function () {
      $(this).fadeTo(200, 1.0);
    }, function () {
      $(this).fadeTo(200, 0.5);
    });

    // Sound Button
    app.find('.sound.icon').click(function () {
      if (storage.data.soundEnabled) {
        storage.data.soundEnabled = false;
      } else {
        storage.data.soundEnabled = true;
      }
      updateStorage();
      toggleSound();
    });

    // Disconnect Button
    app.find('.toolbar .disconnect').on('click', function () {
      app.find('.disconnect.dialog').addClass('active');
    });

    // Feedback Button
    app.on('click', '.toolbar .rating', function () {
      $(this).toggleClass('selected');
      showRating();
    });

    // Connect Button
    app.on('click', '.connect.button', function () {
      if (!opts.connecting) {
        startChat().done(function () {
          opts.connecting = false;
        });
      }
    });

    // Disconnect Dialog
    var disconnect = app.find('.disconnect.dialog');
    disconnect.find('.button.cancel').click(function () {
      disconnect.removeClass('active');
    });

    disconnect.find('.button.success').click(function () {
      disconnectChat();
    });

    app.find('.smilies.icon').click(function (e) {
      var doc = app.closest('html');
      $(this).bubbletip(doc.find('.smilies.tooltip'), { calculateOnShow: true }, doc).open();
      if (e.stopPropagation) {
        e.stopPropagation();
      }
    });

    var connecting = app.find('.connecting');
    var ua = navigator.userAgent;
    var iOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    var android = ua.toLowerCase().indexOf('android') > -1;
    var mobile = iOS || android;

    function adjustChatSize() {
      if (mobile && window.screen.width < 450) {
        var height = 350;
        if (iOS && window.screen.height < 670) {
          height = 290;
        }
        app.css({
          top: 'auto',
          height: height + 'px'
        });
        connecting.css({
          'margin-top': '60px'
        });
        scrollBottom();
      }
    }

    function resetChatSize() {
      if (mobile && window.screen.width < 450) {
        var height = '100%';
        if (opts.layout !== 'tab') {
          height = 'calc(100% - 20px)';
        }
        app.css({
          top: '0',
          height: height
        });
        connecting.css({
          'margin-top': '100px'
        });
      }
    }

    var textarea = app.find('.message.textarea');
    textarea.keypress(function (event) {
      if (!$(this).val().length) {
        updateTyping(false);
      } else {
        updateTyping(true);
      }
      if (event.which === 13) {
        processForm();
        return false;
      } else {
        return true;
      }
    }).blur(function () {
      updateTyping(false);
      resetChatSize();
      $(document).off('scroll.message.textarea');
    }).focus(function () {
      app.find('.smilies.icon').close();
      hideNotification();
      hideTitleNotification();
      adjustChatSize();
    });

    app.click(function () {
      app.find('.smilies.icon').close();
    });

    textarea.keyup(function () {
      var text = $(textarea).val();
      storage.store.set('message', text);
    });
    textarea.val(storage.store.get('message', ''));

    app.find('.smilies.tooltip span').click(function () {
      var smilie = $(this).attr('class').replace('sprite ', ''),
        val = $(textarea).val(),
        text = '';

      switch (smilie) {
        case 'Laugh':
          text = ':D';
          break;
        case 'Smile':
          text = ':)';
          break;
        case 'Sad':
          text = ':(';
          break;
        case 'Money':
          text = '$)';
          break;
        case 'Impish':
          text = ':P';
          break;
        case 'Sweat':
          text = ':\\';
          break;
        case 'Cool':
          text = '8)';
          break;
        case 'Frown':
          text = '>:L';
          break;
        case 'Wink':
          text = ';)';
          break;
        case 'Surprise':
          text = ':O';
          break;
        case 'Woo':
          text = '8-)';
          break;
        case 'Tired':
          text = 'X-(';
          break;
        case 'Shock':
          text = '8-O';
          break;
        case 'Hysterical':
          text = 'xD';
          break;
        case 'Kissed':
          text = ':-*';
          break;
        case 'Dizzy':
          text = ':S';
          break;
        case 'Celebrate':
          text = '+O)';
          break;
        case 'Angry':
          text = '>:O';
          break;
        case 'Adore':
          text = '<3';
          break;
        case 'Sleep':
          text = 'zzZ';
          break;
        case 'Stop':
          text = ':X';
          break;
      }
      app.find('.message.textarea').val(val + text);
    });
  }

  function initDepartments() {
    app.find('.department.input').each(function () {
      var attribute = 'collapsed';
      if ($(this).data(attribute) === undefined) {
        $(this).data(attribute, false);
      }
    });
  }

  function initSignInEvents() {
    // Sign In Events
    if (settings.requireGuestDetails) {

      app.find('.name.input').on('keydown blur', function () {
        validateField(this, '.name.error');
      });

      if (settings.loginEmail) {
        app.find('.email.input').on('keydown blur', function () {
          validateEmail(this, '.email.error');
        });
      }

      if (settings.departments.length > 0) {
        app.find('.department.input').on('keydown keyup blur change', function () {
          var obj = $(this),
            collapsed = obj.data('collapsed');

          validateField(obj, '.department.error');
          if (!collapsed) {
            obj.animate({ width: obj.width() - 35 }, 250);
            obj.data('collapsed', true);
          }
        });
      }
    }

    if (!settings.loginEmail) {
      app.find('.email.input').hide();
      app.find('.prechat .inputs .email.label').hide();
    }

    if (!settings.loginQuestion) {
      app.find('.question.input').hide();
      app.find('.prechat .inputs .QuestionLabel').hide();
    }

  }

  function initPopupEvents() {

    $(document).ready(function () {
      initDepartments();
      if (opts.connected) {
        app.find('.prechat .inputs').hide();
        app.find(selector + 'Chat').fadeIn(250);
        startChat();
      }
    });

    initSignInEvents();
    initOfflineEvents();

    if (typeof initCallEvents === 'function') {
      initCallEvents(); // eslint-disable-line no-undef
    }

    var id = (document.location.pathname.indexOf(directoryPath + apiEndpoint.call) > -1) ? 'Call' : 'Offline',
      selector = '#' + prefix + id,
      form = app.find('#' + id + 'MessageForm');

    resetSecurityCode(selector, form);
  }

  // Title Notification Events
  window.isActive = true;

  $(window).focus(function () {
    this.isActive = true;
    hideTitleNotification();
  });

  $(window).blur(function () {
    this.isActive = false;
  });

  if (Chatstack.iframe()) {
    opts.disabled = true;
  }

  // Update Settings
  updateSettingsInitalise();

  var setupChat = _.once(function() {

    // Image Title
    updateImageTitle();

    // Popup Events
    if (opts.popup) {
      initPopupEvents();
    }

    // jQuery Status Mode Trigger
    $(document).trigger(prefix + '.StatusModeChanged', settings.status);

    // Embedded Chat
    if (app.length && opts.embedded === true) {

      // Fonts
      if (opts.fonts && settings.fonts) {
        settings.fonts = settings.fonts.replace(/\.\.\/\.\.\/\.\.\//g, opts.server + '/livehelp/');
        var fonts = '<style type="text/css">' + settings.fonts + '</style>';
        $(fonts).appendTo(document.head);
      }

      // Styles
      var embeddedstyles = false || settings.styles;
      if (embeddedstyles.length > 0) {
        // Fix Paths
        embeddedstyles = embeddedstyles.replace(/\.\.\/\.\.\/\.\.\//g, opts.server + '/livehelp/');
        var styles = '<style type="text/css">' + embeddedstyles + '</style>';
        $(styles).appendTo(document.head);
      }

      // Chat Layout
      if (app) {
        if (settings.layout) {
          opts.layout = settings.layout;
        }

        $parent('#' + namespace + '-container').addClass(namespace + '-container app parent');
        if (opts.layout.length) {
          app.add(container).addClass(opts.layout);

          // Logo
          if (settings.images.logo && settings.images.logo.length) {
            var logo = app.find('.logo');
            $('<img src="' + settings.images.logo + '" alt="' + settings.name + '" title="' + settings.name + '"/>').appendTo(logo);
            app.add(container).addClass('logo');
          }

          // Campaign
          if (opts.popup && settings.campaign.image && settings.campaign.image.length) {
            var campaign = app.find('.campaign');
            $('<a href="' + settings.campaign.link + '" target="_blank"><img src="' + settings.campaign.image + '" border="0" class="image"/></a>').appendTo(campaign);
            app.find('.scroll').addClass('campaign');
          }
        }

        if (!opts.popup && (opts.hidden || opts.disabled)) {
          app.addClass('hidden').removeClass('closed');
        }

        if (opts.popup) {
          var elements = app.add(container);
          if (settings.status === 'Online' || opts.connected) {
            elements.addClass('opened').removeClass('closed');
          } else {
            elements.addClass('hidden');
          }
        }

        var debounceResizeHeight = -1;

        var debounceResizeScroll = _.debounce(function () {
          var height = app.height();
          if (debounceResizeHeight !== height) {
            debounceResizeHeight = height;
            scrollBottom();
          }

          height = $(this).height();
          var width = $(this).width();
          console.log('window resize event', width, height);
          if (width < 767) {
            console.log('mobile class added');
            container.addClass('mobile');
          } else {
            container.removeClass('mobile');
          }
        }, 250);

        // Resizing
        var parent = (window.parent) ? window.parent : window;
        $(parent).on('resize', debounceResizeScroll);
      }

      // Placeholders
      app.find('input, textarea').placeholder();

      var themes = {
        'default': { tab: '#dddedf', theme: 'dark' },
        'green': { tab: '#26c281', theme: 'light' },
        'turquoise': { tab: '#31cbbb', theme: 'light' },
        'blue': { tab: '#3498db', theme: 'light' },
        'purple': { tab: '#8e44ad', theme: 'light' },
        'pink': { tab: '#db0a5b', theme: 'light' },
        'orange': { tab: '#f5ab35', theme: 'light' }
      };

      if (settings.theme) {
        opts.theme = settings.theme;
        app.addClass(opts.theme);
      }

      // Set Theme Options
      if (opts.theme !== 'light' && opts.theme !== 'dark' && themes[opts.theme] !== undefined) {
        var themeoptions = themes[opts.theme];
        chatbutton.css('background-color', themeoptions.tab);
        opts.theme = themeoptions.theme;
      }

      // Set Light / Dark Theme
      if (opts.theme !== undefined && opts.theme === 'light') {
        app.find(selector + 'CloseButton, .status.text').add(chatbutton).addClass('light');
      }

      // Chat Button Image
      if (settings.images.button) {
        var buttoncss = 'image-custom';

        if (settings.images.button.indexOf('http://') > -1 || settings.images.button.indexOf('https://') > -1) {
          chatbutton.css('background-image', 'url("' + settings.images.button + '")');
        } else {
          buttoncss = 'image-' + settings.images.button;
        }

        if (opts.layout !== 'tab') {
          buttoncss += ' docked';
        }
        chatbutton.add(container).addClass(buttoncss);
      }

      if (opts.colors) {
        if (opts.colors.tab && opts.colors.tab.normal) {
          elements = app.find('.tab').add(chatbutton);
          elements.css('background-color', opts.colors.tab.normal);
          if (opts.colors.tab.hover) {
            elements.hover(function () {
              $(this).css('background-color', opts.colors.tab.hover);
            }, function () {
              $(this).css('background-color', opts.colors.tab.normal);
            });
          }
        }
      }

      // Language
      $.each(settings.language, function (key, value) {
        var element = app.find('[data-lang-key="' + key + '"]');
        if (element.length > 0) {
          element.text(value);
        }
      });

      // Events
      initStorage();
      initEmbeddedEvents();
      initSignInEvents();
      initChatEvents();

      var op = settings.embeddedinitiate;
      if (op !== undefined && op.id > 0 && op.photo) {
        opts.chatBubbles = true;
      }

      if (opts.chatBubbles) {

        if (op.id > 0) {
          showOperatorDetails(op.id, op.name, op.department, op.avatar);
        }

        var operator = app.find('.operator.container');
        app.find('.status.text').css('left', '70px');
        operator.find('.image').show();
        operator.show();
      }

      // Popup Windows Button
      app.find('.toolbar .maximise').click(function () {
        opts.embedded = false;
        closeTab(false, function () {
          storage.data.notificationEnabled = false;
          updateStorage();
        });
        openLiveHelp($(this));
      });

      // Load Storage
      loadStorage();

      // Departments
      updateDepartments(settings.departments);

      // Online
      if (cookies.session !== undefined && cookies.session.length > 0) {
        if (settings.status === 'Online') {
          if (opts.connected) {
            if (storage.data.tabOpen) {
              openTab(false, false);
            }
          } else {
            var initiate = $parent('.' + namespace + '-initiate-chat').is(':visible');

            if (app.is(':hidden')) {
              app.find('.waiting').hide();
              if (!initiate && (!settings.initiate.enabled || !opts.initiateDelay)) {
                if (app.is('.tab')) {
                  app.fadeIn(50);
                }

                var css = 'launcher-enabled';
                if (opts.disabled) {
                  css += ' hidden';
                }
                chatbutton.add(container).removeClass('launcher-disabled').addClass(css);
              }
              loadStorage();
            }
          }
        } else {
          if (opts.connected && storage.data.tabOpen) {
            openTab(false, false);
          }
        }
      }

      // Login Details
      var name = app.find('.name.input'),
        email = app.find('.email.input'),
        inputs = app.find('.prechat').find('input, textarea');
      if (opts.name && opts.name.length > 0) {
        name.val(opts.name);
        if (settings.requireGuestDetails) {
          validateField(name, '.name.error');
        }
      }
      if (opts.email && opts.email.length > 0) {
        email.val(opts.email);
        if (settings.requireGuestDetails) {
          validateEmail(email, '.email.error');
        }
      }
      if (!settings.requireGuestDetails) {
        inputs.css('width', '100%');
      }

      // Auto Load / Connected
      if (opts.connected) {
        showChat();
      }

      // Update Status
      if (settings.status !== undefined && settings.status.length > 0) {
        changeStatus(settings.status, settings.departments);
      }

      // Update Settings
      overrideSettings();

    }
  });

  $(document).on(prefix + '.SettingsUpdated', function () {
    setupChat();
  });

  $(document).on(prefix + '.StatusModeUpdated', function (event, data) {
    settings.departments = data.departments;
    changeStatus(data.status, settings.departments);
  });

  $(document).on(prefix + '.WebSocketStateChanged', function (event, data) {
    websockets = data.connected;
    if (plugins.websockets !== undefined && plugins.websockets.enabled === true) {
      if ((plugins.websockets.state !== 'established' && data.state === 'established') || (plugins.websockets.state !== 'error' && data.state === 'error')) {
        plugins.websockets.state = data.state;
        updateSettingsInitalise();
      }
    } else {
      throttledUpdateSettings();
    }
  });

  $(document).on(prefix + '.UpdateMessages', function (event, data) {
    if (data !== undefined) {
      if (data.status === undefined) {
        data.status = 0;
      } else if (data.status > 0) {
        promptEmail();
      }
    }
    opts.accepted = true;
    updateMessages();
  });

  function showEmailPrompt(text) {
    var elem = $parent(selector + 'Continue'),
      messages = $parent('.messages');

    if (settings.email === false) {
      if (text !== false) {
        elem.find('.' + prefix.toLowerCase() + '-continue-text').text(text);
      }
    } else {
      elem.find('.' + prefix.toLowerCase() + '-continue-text').text('Hmm looks like there was no response.  We will reply via email shortly.');
      elem.find('.message.input').hide();
      if (settings.email !== undefined) {
        elem.find('.status').text('We will contact you at ' + settings.email).show();
      }
    }

    if (!messages.find(selector + 'Continue').length) {
      $(elem).appendTo(messages).show().attr('data-datetime', (Date.now() / 1000 | 0));
      scrollBottom();
    }
  }

  var promptEmail = _.debounce(function () {
    showEmailPrompt(false);
  }, 90000);

  var promptPrechatEmail = _.debounce(function () {
    if (!opts.accepted) {
      showEmailPrompt(false);
    }
  }, opts.promptPrechatDelay);

  $(document).on(prefix + '.MessageReceived', function (event, data) {
    // Default Alignment and Status
    if (data.align === undefined) {
      data.align = 1;
    }
    if (data.status === undefined) {
      data.status = 0;
    }

    if (data.status > 0) {
      promptEmail();
    }
    outputMessages([data]);
  });

  // Document Ready
  $(document).ready(function () {

    // Document Ready Placeholder

    // Title
    title = $(document).attr('title');

    // Javascript API
    updateChatState('idle');
    updateInitiateStatus(); // Idle

    // Insert Web Fonts
    if (opts.fonts) {
      var css = '<link href="' + opts.protocol + 'fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css"/>';
      $(css).appendTo('head');
    }

    // Title Notification Event
    $(this).click(function () {
      hideTitleNotification();
    });

    if (settings !== undefined && settings.status !== undefined) {
      setupChat();
    }

    // Override Settings
    overrideSettings();

    // Open Live Help Event
    $(document).on('LiveHelp.OpenLiveHelp', function () {
      openLiveHelp();
    });

    // Open Initiate Chat Tab
    $(document).on('LiveHelp.OpenInitiateChatTab', function () {
      openInitiateChatTab();
    });

    // Hash Change Event
    if ('onhashchange' in window) {
      $(window).on('hashchange', function () {
        updateSettings(true, true);
      });
    }

    // Javascript API
    Chatstack.openChat = function () {
      openLiveHelp();
    };

    Chatstack.closeChat = function () {
      closeTab();
    };

    Chatstack.disconnectChat = function () {
      if (Chatstack.chatState === 'connected') {
        disconnectChat();
      }
    };

    Chatstack.openInitiateChat = function (message) {
      if (message) {
        opts.introduction = message;
      }
      $(document).one(prefix + '.SettingsUpdated', function () {
        displayInitiateChat(false, true, message);
      });
    };

    Chatstack.closeInitiateChat = function () {
      closeInitiateChat(true)();
    };

    // Ready Events
    if (Chatstack.e && Chatstack.e.length > 0) {
      for (var i = 0; i < Chatstack.e.length; i++) {
        Chatstack.e[i]();
      }
    }

  });

  // Enterprise Placeholder

})(this, parent.document || document, 'LiveHelp', Chatstack, Chatstack._, jQuery);
