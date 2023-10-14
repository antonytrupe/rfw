/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
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
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
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
    while(len) {
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
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
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

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 2 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(25)
var ieee754 = __webpack_require__(26)
var isArray = __webpack_require__(27)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.



/*<replacement>*/

var pna = __webpack_require__(6);
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = __webpack_require__(5);
util.inherits = __webpack_require__(2);
/*</replacement>*/

var Readable = __webpack_require__(13);
var Writable = __webpack_require__(17);

util.inherits(Duplex, Readable);

{
  // avoid scope creep, the keys array can then be collected
  var keys = objectKeys(Writable.prototype);
  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  pna.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  pna.nextTick(cb, err);
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3).Buffer))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = { nextTick: nextTick };
} else {
  module.exports = process
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(3)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process, Buffer) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof2(obj){if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof2=function _typeof2(obj){return typeof obj;};}else{_typeof2=function _typeof2(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};}return _typeof2(obj);}(function(global,factory){( false?"undefined":_typeof2(exports))==='object'&&typeof module!=='undefined'?factory(exports,__webpack_require__(9)): true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports,__webpack_require__(9)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):(global=global||self,factory(global.Client={},global.http));})(this,function(exports,http){'use strict';http=http&&http.hasOwnProperty('default')?http['default']:http;function _typeof(obj){if(typeof Symbol==="function"&&_typeof2(Symbol.iterator)==="symbol"){_typeof=function _typeof(obj){return _typeof2(obj);};}else{_typeof=function _typeof(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":_typeof2(obj);};}return _typeof(obj);}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}function _createClass(Constructor,protoProps,staticProps){if(protoProps)_defineProperties(Constructor.prototype,protoProps);if(staticProps)_defineProperties(Constructor,staticProps);return Constructor;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function");}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:true,configurable:true}});if(superClass)_setPrototypeOf(subClass,superClass);}function _getPrototypeOf(o){_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _setPrototypeOf(o,p){_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(o,p){o.__proto__=p;return o;};return _setPrototypeOf(o,p);}function _assertThisInitialized(self){if(self===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _possibleConstructorReturn(self,call){if(call&&(_typeof2(call)==="object"||typeof call==="function")){return call;}return _assertThisInitialized(self);}function _superPropBase(object,property){while(!Object.prototype.hasOwnProperty.call(object,property)){object=_getPrototypeOf(object);if(object===null)break;}return object;}function _get(target,property,receiver){if(typeof Reflect!=="undefined"&&Reflect.get){_get=Reflect.get;}else{_get=function _get(target,property,receiver){var base=_superPropBase(target,property);if(!base)return;var desc=Object.getOwnPropertyDescriptor(base,property);if(desc.get){return desc.get.call(receiver);}return desc.value;};}return _get(target,property,receiver||target);}/**
   * This class represents an instance of the game world,
   * where all data pertaining to the current state of the
   * world is saved.
   */var GameWorld=/*#__PURE__*/function(){/**
     * Constructor of the World instance
     */function GameWorld(){_classCallCheck(this,GameWorld);this.stepCount=0;this.objects={};this.playerCount=0;this.idCount=0;}/**
     * Gets a new, fresh and unused id that can be used for a new object
     * @return {Number} the new id
     */_createClass(GameWorld,[{key:"getNewId",value:function getNewId(){var possibleId=this.idCount;// find a free id
while(possibleId in this.objects){possibleId++;}this.idCount=possibleId+1;return possibleId;}/**
       * Returns all the game world objects which match a criteria
       * @param {Object} query The query object
       * @param {Object} [query.id] object id
       * @param {Object} [query.playerId] player id
       * @param {Class} [query.instanceType] matches whether `object instanceof instanceType`
       * @param {Array} [query.components] An array of component names
       * @param {Boolean} [query.returnSingle] Return the first object matched
       * @returns {Array | Object} All game objects which match all the query parameters, or the first match if returnSingle was specified
       */},{key:"queryObjects",value:function queryObjects(query){var queriedObjects=[];// todo this is currently a somewhat inefficient implementation for API testing purposes.
// It should be implemented with cached dictionaries like in nano-ecs
this.forEachObject(function(id,object){var conditions=[];// object id condition
conditions.push(!('id'in query)||query.id!==null&&object.id===query.id);// player id condition
conditions.push(!('playerId'in query)||query.playerId!==null&&object.playerId===query.playerId);// instance type conditio
conditions.push(!('instanceType'in query)||query.instanceType!==null&&object instanceof query.instanceType);// components conditions
if('components'in query){query.components.forEach(function(componentClass){conditions.push(object.hasComponent(componentClass));});}// all conditions are true, object is qualified for the query
if(conditions.every(function(value){return value;})){queriedObjects.push(object);if(query.returnSingle)return false;}});// return a single object or null
if(query.returnSingle){return queriedObjects.length>0?queriedObjects[0]:null;}return queriedObjects;}/**
       * Returns The first game object encountered which matches a criteria.
       * Syntactic sugar for {@link queryObject} with `returnSingle: true`
       * @param query See queryObjects
       * @returns {Object}
       */},{key:"queryObject",value:function queryObject(query){return this.queryObjects(Object.assign(query,{returnSingle:true}));}/**
       * Add an object to the game world
       * @param {Object} object object to add
       */},{key:"addObject",value:function addObject(object){this.objects[object.id]=object;}/**
       * Remove an object from the game world
       * @param {number} id id of the object to remove
       */},{key:"removeObject",value:function removeObject(id){delete this.objects[id];}/**
       * World object iterator.
       * Invoke callback(objId, obj) for each object
       *
       * @param {function} callback function receives id and object. If callback returns false, the iteration will cease
       */},{key:"forEachObject",value:function forEachObject(callback){var _arr=Object.keys(this.objects);for(var _i=0;_i<_arr.length;_i++){var id=_arr[_i];var returnValue=callback(id,this.objects[id]);// TODO: the key should be Number(id)
if(returnValue===false)break;}}}]);return GameWorld;}();var commonjsGlobal=typeof window!=='undefined'?window:typeof global!=='undefined'?global:typeof self!=='undefined'?self:{};function createCommonjsModule(fn,module){return module={exports:{}},fn(module,module.exports),module.exports;}function getCjsExportFromNamespace(n){return n&&n.default||n;}var isImplemented=function isImplemented(){var assign=Object.assign,obj;if(typeof assign!=="function")return false;obj={foo:"raz"};assign(obj,{bar:"dwa"},{trzy:"trzy"});return obj.foo+obj.bar+obj.trzy==="razdwatrzy";};var isImplemented$1=function isImplemented$1(){try{return true;}catch(e){return false;}};// eslint-disable-next-line no-empty-function
var noop=function noop(){};var _undefined=noop();// Support ES3 engines
var isValue=function isValue(val){return val!==_undefined&&val!==null;};var keys=Object.keys;var shim=function shim(object){return keys(isValue(object)?Object(object):object);};var keys$1=isImplemented$1()?Object.keys:shim;var validValue=function validValue(value){if(!isValue(value))throw new TypeError("Cannot use null or undefined");return value;};var max=Math.max;var shim$1=function shim$1(dest,src/*, …srcn*/){var error,i,length=max(arguments.length,2),assign;dest=Object(validValue(dest));assign=function assign(key){try{dest[key]=src[key];}catch(e){if(!error)error=e;}};for(i=1;i<length;++i){src=arguments[i];keys$1(src).forEach(assign);}if(error!==undefined)throw error;return dest;};var assign=isImplemented()?Object.assign:shim$1;var forEach=Array.prototype.forEach,create=Object.create;var process$1=function process$1(src,obj){var key;for(key in src){obj[key]=src[key];}};// eslint-disable-next-line no-unused-vars
var normalizeOptions=function normalizeOptions(opts1/*, …options*/){var result=create(null);forEach.call(arguments,function(options){if(!isValue(options))return;process$1(Object(options),result);});return result;};// Deprecated
var isCallable=function isCallable(obj){return typeof obj==="function";};var str="razdwatrzy";var isImplemented$2=function isImplemented$2(){if(typeof str.contains!=="function")return false;return str.contains("dwa")===true&&str.contains("foo")===false;};var indexOf=String.prototype.indexOf;var shim$2=function shim$2(searchString/*, position*/){return indexOf.call(this,searchString,arguments[1])>-1;};var contains=isImplemented$2()?String.prototype.contains:shim$2;var d_1=createCommonjsModule(function(module){var d;d=module.exports=function(dscr,value/*, options*/){var c,e,w,options,desc;if(arguments.length<2||typeof dscr!=='string'){options=value;value=dscr;dscr=null;}else{options=arguments[2];}if(dscr==null){c=w=true;e=false;}else{c=contains.call(dscr,'c');e=contains.call(dscr,'e');w=contains.call(dscr,'w');}desc={value:value,configurable:c,enumerable:e,writable:w};return!options?desc:assign(normalizeOptions(options),desc);};d.gs=function(dscr,get,set/*, options*/){var c,e,options,desc;if(typeof dscr!=='string'){options=set;set=get;get=dscr;dscr=null;}else{options=arguments[3];}if(get==null){get=undefined;}else if(!isCallable(get)){options=get;get=set=undefined;}else if(set==null){set=undefined;}else if(!isCallable(set)){options=set;set=undefined;}if(dscr==null){c=true;e=false;}else{c=contains.call(dscr,'c');e=contains.call(dscr,'e');}desc={get:get,set:set,configurable:c,enumerable:e};return!options?desc:assign(normalizeOptions(options),desc);};});var validCallable=function validCallable(fn){if(typeof fn!=="function")throw new TypeError(fn+" is not a function");return fn;};var eventEmitter=createCommonjsModule(function(module,exports){var apply=Function.prototype.apply,call=Function.prototype.call,create=Object.create,defineProperty=Object.defineProperty,defineProperties=Object.defineProperties,hasOwnProperty=Object.prototype.hasOwnProperty,descriptor={configurable:true,enumerable:false,writable:true},on,_once2,off,emit,methods,descriptors,base;on=function on(type,listener){var data;validCallable(listener);if(!hasOwnProperty.call(this,'__ee__')){data=descriptor.value=create(null);defineProperty(this,'__ee__',descriptor);descriptor.value=null;}else{data=this.__ee__;}if(!data[type])data[type]=listener;else if(_typeof2(data[type])==='object')data[type].push(listener);else data[type]=[data[type],listener];return this;};_once2=function once(type,listener){var _once,self;validCallable(listener);self=this;on.call(this,type,_once=function once(){off.call(self,type,_once);apply.call(listener,this,arguments);});_once.__eeOnceListener__=listener;return this;};off=function off(type,listener){var data,listeners,candidate,i;validCallable(listener);if(!hasOwnProperty.call(this,'__ee__'))return this;data=this.__ee__;if(!data[type])return this;listeners=data[type];if(_typeof2(listeners)==='object'){for(i=0;candidate=listeners[i];++i){if(candidate===listener||candidate.__eeOnceListener__===listener){if(listeners.length===2)data[type]=listeners[i?0:1];else listeners.splice(i,1);}}}else{if(listeners===listener||listeners.__eeOnceListener__===listener){delete data[type];}}return this;};emit=function emit(type){var i,l,listener,listeners,args;if(!hasOwnProperty.call(this,'__ee__'))return;listeners=this.__ee__[type];if(!listeners)return;if(_typeof2(listeners)==='object'){l=arguments.length;args=new Array(l-1);for(i=1;i<l;++i){args[i-1]=arguments[i];}listeners=listeners.slice();for(i=0;listener=listeners[i];++i){apply.call(listener,this,args);}}else{switch(arguments.length){case 1:call.call(listeners,this);break;case 2:call.call(listeners,this,arguments[1]);break;case 3:call.call(listeners,this,arguments[1],arguments[2]);break;default:l=arguments.length;args=new Array(l-1);for(i=1;i<l;++i){args[i-1]=arguments[i];}apply.call(listeners,this,args);}}};methods={on:on,once:_once2,off:off,emit:emit};descriptors={on:d_1(on),once:d_1(_once2),off:d_1(off),emit:d_1(emit)};base=defineProperties({},descriptors);module.exports=exports=function exports(o){return o==null?create(base):defineProperties(Object(o),descriptors);};exports.methods=methods;});var eventEmitter_1=eventEmitter.methods;// TODO: needs documentation
// I think the API could be simpler
//   - Timer.run(waitSteps, cb)
//   - Timer.repeat(waitSteps, count, cb) // count=null=>forever
//   - Timer.cancel(cb)
var Timer=/*#__PURE__*/function(){function Timer(){_classCallCheck(this,Timer);this.currentTime=0;this.isActive=false;this.idCounter=0;this.events={};}_createClass(Timer,[{key:"play",value:function play(){this.isActive=true;}},{key:"tick",value:function tick(){var event;var eventId;if(this.isActive){this.currentTime++;for(eventId in this.events){event=this.events[eventId];if(event){if(event.type=='repeat'){if((this.currentTime-event.startOffset)%event.time==0){event.callback.apply(event.thisContext,event.args);}}if(event.type=='single'){if((this.currentTime-event.startOffset)%event.time==0){event.callback.apply(event.thisContext,event.args);event.destroy();}}}}}}},{key:"destroyEvent",value:function destroyEvent(eventId){delete this.events[eventId];}},{key:"loop",value:function loop(time,callback){var timerEvent=new TimerEvent(this,TimerEvent.TYPES.repeat,time,callback);this.events[timerEvent.id]=timerEvent;return timerEvent;}},{key:"add",value:function add(time,callback,thisContext,args){var timerEvent=new TimerEvent(this,TimerEvent.TYPES.single,time,callback,thisContext,args);this.events[timerEvent.id]=timerEvent;return timerEvent;}// todo implement timer delete all events
},{key:"destroy",value:function destroy(id){delete this.events[id];}}]);return Timer;}();// timer event
var TimerEvent=function TimerEvent(timer,type,time,callback,thisContext,args){_classCallCheck(this,TimerEvent);this.id=++timer.idCounter;this.timer=timer;this.type=type;this.time=time;this.callback=callback;this.startOffset=timer.currentTime;this.thisContext=thisContext;this.args=args;this.destroy=function(){this.timer.destroy(this.id);};};TimerEvent.TYPES={repeat:'repeat',single:'single'};/**
   * Tracing Services.
   * Use the trace functions to trace game state.  Turn on tracing by
   * specifying the minimum trace level which should be recorded.  For
   * example, setting traceLevel to Trace.TRACE_INFO will cause info,
   * warn, and error traces to be recorded.
   */var Trace=/*#__PURE__*/function(){function Trace(options){_classCallCheck(this,Trace);this.options=Object.assign({traceLevel:this.TRACE_DEBUG},options);this.traceBuffer=[];this.step='initializing';// syntactic sugar functions
this.error=this.trace.bind(this,Trace.TRACE_ERROR);this.warn=this.trace.bind(this,Trace.TRACE_WARN);this.info=this.trace.bind(this,Trace.TRACE_INFO);this.debug=this.trace.bind(this,Trace.TRACE_DEBUG);this.trace=this.trace.bind(this,Trace.TRACE_ALL);}/**
     * Include all trace levels.
     * @memberof Trace
     * @member {Number} TRACE_ALL
     */_createClass(Trace,[{key:"trace",value:function trace(level,dataCB){// all traces must be functions which return strings
if(typeof dataCB!=='function'){throw new Error("Lance trace was called but instead of passing a function, it received a [".concat(_typeof(dataCB),"]"));}if(level<this.options.traceLevel)return;this.traceBuffer.push({data:dataCB(),level:level,step:this.step,time:new Date()});}},{key:"rotate",value:function rotate(){var buffer=this.traceBuffer;this.traceBuffer=[];return buffer;}},{key:"setStep",value:function setStep(s){this.step=s;}},{key:"length",get:function get(){return this.traceBuffer.length;}}],[{key:"TRACE_ALL",get:function get(){return 0;}/**
       * Include debug traces and higher.
       * @memberof Trace
       * @member {Number} TRACE_DEBUG
       */},{key:"TRACE_DEBUG",get:function get(){return 1;}/**
       * Include info traces and higher.
       * @memberof Trace
       * @member {Number} TRACE_INFO
       */},{key:"TRACE_INFO",get:function get(){return 2;}/**
       * Include warn traces and higher.
       * @memberof Trace
       * @member {Number} TRACE_WARN
       */},{key:"TRACE_WARN",get:function get(){return 3;}/**
       * Include error traces and higher.
       * @memberof Trace
       * @member {Number} TRACE_ERROR
       */},{key:"TRACE_ERROR",get:function get(){return 4;}/**
       * Disable all tracing.
       * @memberof Trace
       * @member {Number} TRACE_NONE
       */},{key:"TRACE_NONE",get:function get(){return 1000;}}]);return Trace;}();/**
   * The GameEngine contains the game logic.  Extend this class
   * to implement game mechanics.  The GameEngine derived
   * instance runs once on the server, where the final decisions
   * are always taken, and one instance will run on each client as well,
   * where the client emulates what it expects to be happening
   * on the server.
   *
   * The game engine's logic must listen to user inputs and
   * act on these inputs to change the game state.  For example,
   * the game engine listens to controller/keyboard inputs to infer
   * movement for the player/ship/first-person.  The game engine listens
   * to clicks, button-presses to infer firing, etc..
   *
   * Note that the game engine runs on both the server and on the
   * clients - but the server decisions always have the final say,
   * and therefore clients must resolve server updates which conflict
   * with client-side predictions.
   */var GameEngine=/*#__PURE__*/function(){/**
      * Create a game engine instance.  This needs to happen
      * once on the server, and once on each client.
      *
      * @param {Object} options - options object
      * @param {Number} options.traceLevel - the trace level from 0 to 5.  Lower value traces more.
      * @param {Number} options.delayInputCount - client side only.  Introduce an artificial delay on the client to better match the time it will occur on the server.  This value sets the number of steps the client will wait before applying the input locally
      */function GameEngine(options){_classCallCheck(this,GameEngine);// place the game engine in the LANCE globals
var isServerSide=typeof window==='undefined';var glob=isServerSide?global:window;glob.LANCE={gameEngine:this};// set options
var defaultOpts={GameWorld:GameWorld,traceLevel:Trace.TRACE_NONE};if(!isServerSide)defaultOpts.clientIDSpace=1000000;this.options=Object.assign(defaultOpts,options);/**
       * client's player ID, as a string. If running on the client, this is set at runtime by the clientEngine
       * @member {String}
       */this.playerId=NaN;// set up event emitting and interface
var eventEmitter$1=new eventEmitter();/**
       * Register a handler for an event
       *
       * @method on
       * @memberof GameEngine
       * @instance
       * @param {String} eventName - name of the event
       * @param {Function} eventHandler - handler function
       */this.on=eventEmitter$1.on;/**
       * Register a handler for an event, called just once (if at all)
       *
       * @method once
       * @memberof GameEngine
       * @instance
       * @param {String} eventName - name of the event
       * @param {Function} eventHandler - handler function
       */this.once=eventEmitter$1.once;/**
       * Remove a handler
       *
       * @method removeListener
       * @memberof GameEngine
       * @instance
       * @param {String} eventName - name of the event
       * @param {Function} eventHandler - handler function
       */this.removeListener=eventEmitter$1.off;this.off=eventEmitter$1.off;this.emit=eventEmitter$1.emit;// set up trace
this.trace=new Trace({traceLevel:this.options.traceLevel});}_createClass(GameEngine,[{key:"findLocalShadow",value:function findLocalShadow(serverObj){var _arr=Object.keys(this.world.objects);for(var _i=0;_i<_arr.length;_i++){var localId=_arr[_i];if(Number(localId)<this.options.clientIDSpace)continue;var localObj=this.world.objects[localId];if(localObj.hasOwnProperty('inputId')&&localObj.inputId===serverObj.inputId)return localObj;}return null;}},{key:"initWorld",value:function initWorld(worldSettings){this.world=new GameWorld();// on the client we have a different ID space
if(this.options.clientIDSpace){this.world.idCount=this.options.clientIDSpace;}/**
        * The worldSettings defines the game world constants, such
        * as width, height, depth, etc. such that all other classes
        * can reference these values.
        * @member {Object} worldSettings
        * @memberof GameEngine
        */this.worldSettings=Object.assign({},worldSettings);}/**
        * Start the game. This method runs on both server
        * and client. Extending the start method is useful
        * for setting up the game's worldSettings attribute,
        * and registering methods on the event handler.
        */},{key:"start",value:function start(){var _this=this;this.trace.info(function(){return'========== game engine started ==========';});this.initWorld();// create the default timer
this.timer=new Timer();this.timer.play();this.on('postStep',function(step,isReenact){if(!isReenact)_this.timer.tick();});this.emit('start',{timestamp:new Date().getTime()});}/**
        * Single game step.
        *
        * @param {Boolean} isReenact - is this step a re-enactment of the past.
        * @param {Number} t - the current time (optional)
        * @param {Number} dt - elapsed time since last step was called.  (optional)
        * @param {Boolean} physicsOnly - do a physics step only, no game logic
        */},{key:"step",value:function step(isReenact,t,dt,physicsOnly){var _this2=this;// physics-only step
if(physicsOnly){if(dt)dt/=1000;// physics engines work in seconds
this.physicsEngine.step(dt,objectFilter);return;}// emit preStep event
if(isReenact===undefined)throw new Error('game engine does not forward argument isReenact to super class');isReenact=Boolean(isReenact);var step=++this.world.stepCount;var clientIDSpace=this.options.clientIDSpace;this.emit('preStep',{step:step,isReenact:isReenact,dt:dt});// skip physics for shadow objects during re-enactment
function objectFilter(o){return!isReenact||o.id<clientIDSpace;}// physics step
if(this.physicsEngine&&!this.ignorePhysics){if(dt)dt/=1000;// physics engines work in seconds
this.physicsEngine.step(dt,objectFilter);}// for each object
// - apply incremental bending
// - refresh object positions after physics
this.world.forEachObject(function(id,o){if(typeof o.refreshFromPhysics==='function')o.refreshFromPhysics();_this2.trace.trace(function(){return"object[".concat(id,"] after ").concat(isReenact?'reenact':'step'," : ").concat(o.toString());});});// emit postStep event
this.emit('postStep',{step:step,isReenact:isReenact});}/**
       * Add object to the game world.
       * On the client side, the object may not be created, if the server copy
       * of this object is already in the game world.  This could happen when the client
       * is using delayed-input, and the RTT is very low.
       *
       * @param {Object} object - the object.
       * @return {Object} object - the final object.
       */},{key:"addObjectToWorld",value:function addObjectToWorld(object){// if we are asked to create a local shadow object
// the server copy may already have arrived.
if(Number(object.id)>=this.options.clientIDSpace){var serverCopyArrived=false;this.world.forEachObject(function(id,o){if(o.hasOwnProperty('inputId')&&o.inputId===object.inputId){serverCopyArrived=true;return false;}});if(serverCopyArrived){this.trace.info(function(){return"========== shadow object NOT added ".concat(object.toString()," ==========");});return null;}}this.world.addObject(object);// tell the object to join the game, by creating
// its corresponding physical entities and renderer entities.
if(typeof object.onAddToWorld==='function')object.onAddToWorld(this);this.emit('objectAdded',object);this.trace.info(function(){return"========== object added ".concat(object.toString()," ==========");});return object;}/**
       * Override this function to implement input handling.
       * This method will be called on the specific client where the
       * input was received, and will also be called on the server
       * when the input reaches the server.  The client does not call this
       * method directly, rather the client calls {@link ClientEngine#sendInput}
       * so that the input is sent to both server and client, and so that
       * the input is delayed artificially if so configured.
       *
       * The input is described by a short string, and is given an index.
       * The index is used internally to keep track of inputs which have already been applied
       * on the client during synchronization.  The input is also associated with
       * the ID of a player.
       *
       * @param {Object} inputDesc - input descriptor object
       * @param {String} inputDesc.input - describe the input (e.g. "up", "down", "fire")
       * @param {Number} inputDesc.messageIndex - input identifier
       * @param {Number} inputDesc.step - the step on which this input occurred
       * @param {Number} playerId - the player ID
       * @param {Boolean} isServer - indicate if this function is being called on the server side
       */},{key:"processInput",value:function processInput(inputDesc,playerId,isServer){this.trace.info(function(){return"game engine processing input[".concat(inputDesc.messageIndex,"] <").concat(inputDesc.input,"> from playerId ").concat(playerId);});}/**
       * Remove an object from the game world.
       *
       * @param {Object|String} objectId - the object or object ID
       */},{key:"removeObjectFromWorld",value:function removeObjectFromWorld(objectId){if(_typeof(objectId)==='object')objectId=objectId.id;var object=this.world.objects[objectId];if(!object){throw new Error("Game attempted to remove a game object which doesn't (or never did) exist, id=".concat(objectId));}this.trace.info(function(){return"========== destroying object ".concat(object.toString()," ==========");});if(typeof object.onRemoveFromWorld==='function')object.onRemoveFromWorld(this);this.emit('objectDestroyed',object);this.world.removeObject(objectId);}/**
       * Check if a given object is owned by the player on this client
       *
       * @param {Object} object the game object to check
       * @return {Boolean} true if the game object is owned by the player on this client
       */},{key:"isOwnedByPlayer",value:function isOwnedByPlayer(object){return object.playerId==this.playerId;}/**
       * Register Game Object Classes
       *
       * @example
       * registerClasses(serializer) {
       *   serializer.registerClass(require('../common/Paddle'));
       *   serializer.registerClass(require('../common/Ball'));
       * }
       *
       * @param {Serializer} serializer - the serializer
       */},{key:"registerClasses",value:function registerClasses(serializer){}/**
       * Decide whether the player game is over by returning an Object, need to be implemented
       *
       * @return {Object} truthful if the game is over for the player and the object is returned as GameOver data
       */},{key:"getPlayerGameOverResult",value:function getPlayerGameOverResult(){return null;}}]);return GameEngine;}();// The base Physics Engine class defines the expected interface
// for all physics engines
var PhysicsEngine=/*#__PURE__*/function(){function PhysicsEngine(options){_classCallCheck(this,PhysicsEngine);this.options=options;this.gameEngine=options.gameEngine;if(!options.gameEngine){console.warn('Physics engine initialized without gameEngine!');}}/**
     * A single Physics step.
     *
     * @param {Number} dt - time elapsed since last step
     * @param {Function} objectFilter - a test function which filters which objects should move
     */_createClass(PhysicsEngine,[{key:"step",value:function step(dt,objectFilter){}}]);return PhysicsEngine;}();/* global P2_ARRAY_TYPE */var Utils_1=Utils;/**
   * Misc utility functions
   * @class Utils
   * @constructor
   */function Utils(){}/**
   * Append the values in array b to the array a. See <a href="http://stackoverflow.com/questions/1374126/how-to-append-an-array-to-an-existing-javascript-array/1374131#1374131">this</a> for an explanation.
   * @method appendArray
   * @static
   * @param  {Array} a
   * @param  {Array} b
   */Utils.appendArray=function(a,b){if(b.length<150000){a.push.apply(a,b);}else{for(var i=0,len=b.length;i!==len;++i){a.push(b[i]);}}};/**
   * Garbage free Array.splice(). Does not allocate a new array.
   * @method splice
   * @static
   * @param  {Array} array
   * @param  {Number} index
   * @param  {Number} howmany
   */Utils.splice=function(array,index,howmany){howmany=howmany||1;for(var i=index,len=array.length-howmany;i<len;i++){array[i]=array[i+howmany];}array.length=len;};/**
   * The array type to use for internal numeric computations throughout the library. Float32Array is used if it is available, but falls back on Array. If you want to set array type manually, inject it via the global variable P2_ARRAY_TYPE. See example below.
   * @static
   * @property {function} ARRAY_TYPE
   * @example
   *     <script>
   *         <!-- Inject your preferred array type before loading p2.js -->
   *         P2_ARRAY_TYPE = Array;
   *     </script>
   *     <script src="p2.js"></script>
   */if(typeof P2_ARRAY_TYPE!=='undefined'){Utils.ARRAY_TYPE=P2_ARRAY_TYPE;}else if(typeof Float32Array!=='undefined'){Utils.ARRAY_TYPE=Float32Array;}else{Utils.ARRAY_TYPE=Array;}/**
   * Extend an object with the properties of another
   * @static
   * @method extend
   * @param  {object} a
   * @param  {object} b
   */Utils.extend=function(a,b){for(var key in b){a[key]=b[key];}};/**
   * Extend an options object with default values.
   * @static
   * @method defaults
   * @param  {object} options The options object. May be falsy: in this case, a new object is created and returned.
   * @param  {object} defaults An object containing default values.
   * @return {object} The modified options object.
   */Utils.defaults=function(options,defaults){options=options||{};for(var key in defaults){if(!(key in options)){options[key]=defaults[key];}}return options;};var vec2_1=createCommonjsModule(function(module){/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

  Redistribution and use in source and binary forms, with or without modification,
  are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this
      list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
  ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
  ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */ /**
   * The vec2 object from glMatrix, with some extensions and some removed methods. See http://glmatrix.net.
   * @class vec2
   */var vec2=module.exports={};/**
   * Make a cross product and only return the z component
   * @method crossLength
   * @static
   * @param  {Array} a
   * @param  {Array} b
   * @return {Number}
   */vec2.crossLength=function(a,b){return a[0]*b[1]-a[1]*b[0];};/**
   * Cross product between a vector and the Z component of a vector
   * @method crossVZ
   * @static
   * @param  {Array} out
   * @param  {Array} vec
   * @param  {Number} zcomp
   * @return {Number}
   */vec2.crossVZ=function(out,vec,zcomp){vec2.rotate(out,vec,-Math.PI/2);// Rotate according to the right hand rule
vec2.scale(out,out,zcomp);// Scale with z
return out;};/**
   * Cross product between a vector and the Z component of a vector
   * @method crossZV
   * @static
   * @param  {Array} out
   * @param  {Number} zcomp
   * @param  {Array} vec
   * @return {Number}
   */vec2.crossZV=function(out,zcomp,vec){vec2.rotate(out,vec,Math.PI/2);// Rotate according to the right hand rule
vec2.scale(out,out,zcomp);// Scale with z
return out;};/**
   * Rotate a vector by an angle
   * @method rotate
   * @static
   * @param  {Array} out
   * @param  {Array} a
   * @param  {Number} angle
   */vec2.rotate=function(out,a,angle){if(angle!==0){var c=Math.cos(angle),s=Math.sin(angle),x=a[0],y=a[1];out[0]=c*x-s*y;out[1]=s*x+c*y;}else{out[0]=a[0];out[1]=a[1];}};/**
   * Rotate a vector 90 degrees clockwise
   * @method rotate90cw
   * @static
   * @param  {Array} out
   * @param  {Array} a
   * @param  {Number} angle
   */vec2.rotate90cw=function(out,a){var x=a[0];var y=a[1];out[0]=y;out[1]=-x;};/**
   * Transform a point position to local frame.
   * @method toLocalFrame
   * @param  {Array} out
   * @param  {Array} worldPoint
   * @param  {Array} framePosition
   * @param  {Number} frameAngle
   */vec2.toLocalFrame=function(out,worldPoint,framePosition,frameAngle){vec2.copy(out,worldPoint);vec2.sub(out,out,framePosition);vec2.rotate(out,out,-frameAngle);};/**
   * Transform a point position to global frame.
   * @method toGlobalFrame
   * @param  {Array} out
   * @param  {Array} localPoint
   * @param  {Array} framePosition
   * @param  {Number} frameAngle
   */vec2.toGlobalFrame=function(out,localPoint,framePosition,frameAngle){vec2.copy(out,localPoint);vec2.rotate(out,out,frameAngle);vec2.add(out,out,framePosition);};/**
   * Transform a vector to local frame.
   * @method vectorToLocalFrame
   * @param  {Array} out
   * @param  {Array} worldVector
   * @param  {Number} frameAngle
   */vec2.vectorToLocalFrame=function(out,worldVector,frameAngle){vec2.rotate(out,worldVector,-frameAngle);};/**
   * Transform a point position to global frame.
   * @method toGlobalFrame
   * @param  {Array} out
   * @param  {Array} localVector
   * @param  {Number} frameAngle
   */vec2.vectorToGlobalFrame=function(out,localVector,frameAngle){vec2.rotate(out,localVector,frameAngle);};/**
   * Compute centroid of a triangle spanned by vectors a,b,c. See http://easycalculation.com/analytical/learn-centroid.php
   * @method centroid
   * @static
   * @param  {Array} out
   * @param  {Array} a
   * @param  {Array} b
   * @param  {Array} c
   * @return  {Array} The out object
   */vec2.centroid=function(out,a,b,c){vec2.add(out,a,b);vec2.add(out,out,c);vec2.scale(out,out,1/3);return out;};/**
   * Creates a new, empty vec2
   * @static
   * @method create
   * @return {Array} a new 2D vector
   */vec2.create=function(){var out=new Utils_1.ARRAY_TYPE(2);out[0]=0;out[1]=0;return out;};/**
   * Creates a new vec2 initialized with values from an existing vector
   * @static
   * @method clone
   * @param {Array} a vector to clone
   * @return {Array} a new 2D vector
   */vec2.clone=function(a){var out=new Utils_1.ARRAY_TYPE(2);out[0]=a[0];out[1]=a[1];return out;};/**
   * Creates a new vec2 initialized with the given values
   * @static
   * @method fromValues
   * @param {Number} x X component
   * @param {Number} y Y component
   * @return {Array} a new 2D vector
   */vec2.fromValues=function(x,y){var out=new Utils_1.ARRAY_TYPE(2);out[0]=x;out[1]=y;return out;};/**
   * Copy the values from one vec2 to another
   * @static
   * @method copy
   * @param {Array} out the receiving vector
   * @param {Array} a the source vector
   * @return {Array} out
   */vec2.copy=function(out,a){out[0]=a[0];out[1]=a[1];return out;};/**
   * Set the components of a vec2 to the given values
   * @static
   * @method set
   * @param {Array} out the receiving vector
   * @param {Number} x X component
   * @param {Number} y Y component
   * @return {Array} out
   */vec2.set=function(out,x,y){out[0]=x;out[1]=y;return out;};/**
   * Adds two vec2's
   * @static
   * @method add
   * @param {Array} out the receiving vector
   * @param {Array} a the first operand
   * @param {Array} b the second operand
   * @return {Array} out
   */vec2.add=function(out,a,b){out[0]=a[0]+b[0];out[1]=a[1]+b[1];return out;};/**
   * Subtracts two vec2's
   * @static
   * @method subtract
   * @param {Array} out the receiving vector
   * @param {Array} a the first operand
   * @param {Array} b the second operand
   * @return {Array} out
   */vec2.subtract=function(out,a,b){out[0]=a[0]-b[0];out[1]=a[1]-b[1];return out;};/**
   * Alias for vec2.subtract
   * @static
   * @method sub
   */vec2.sub=vec2.subtract;/**
   * Multiplies two vec2's
   * @static
   * @method multiply
   * @param {Array} out the receiving vector
   * @param {Array} a the first operand
   * @param {Array} b the second operand
   * @return {Array} out
   */vec2.multiply=function(out,a,b){out[0]=a[0]*b[0];out[1]=a[1]*b[1];return out;};/**
   * Alias for vec2.multiply
   * @static
   * @method mul
   */vec2.mul=vec2.multiply;/**
   * Divides two vec2's
   * @static
   * @method divide
   * @param {Array} out the receiving vector
   * @param {Array} a the first operand
   * @param {Array} b the second operand
   * @return {Array} out
   */vec2.divide=function(out,a,b){out[0]=a[0]/b[0];out[1]=a[1]/b[1];return out;};/**
   * Alias for vec2.divide
   * @static
   * @method div
   */vec2.div=vec2.divide;/**
   * Scales a vec2 by a scalar number
   * @static
   * @method scale
   * @param {Array} out the receiving vector
   * @param {Array} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @return {Array} out
   */vec2.scale=function(out,a,b){out[0]=a[0]*b;out[1]=a[1]*b;return out;};/**
   * Calculates the euclidian distance between two vec2's
   * @static
   * @method distance
   * @param {Array} a the first operand
   * @param {Array} b the second operand
   * @return {Number} distance between a and b
   */vec2.distance=function(a,b){var x=b[0]-a[0],y=b[1]-a[1];return Math.sqrt(x*x+y*y);};/**
   * Alias for vec2.distance
   * @static
   * @method dist
   */vec2.dist=vec2.distance;/**
   * Calculates the squared euclidian distance between two vec2's
   * @static
   * @method squaredDistance
   * @param {Array} a the first operand
   * @param {Array} b the second operand
   * @return {Number} squared distance between a and b
   */vec2.squaredDistance=function(a,b){var x=b[0]-a[0],y=b[1]-a[1];return x*x+y*y;};/**
   * Alias for vec2.squaredDistance
   * @static
   * @method sqrDist
   */vec2.sqrDist=vec2.squaredDistance;/**
   * Calculates the length of a vec2
   * @static
   * @method length
   * @param {Array} a vector to calculate length of
   * @return {Number} length of a
   */vec2.length=function(a){var x=a[0],y=a[1];return Math.sqrt(x*x+y*y);};/**
   * Alias for vec2.length
   * @method len
   * @static
   */vec2.len=vec2.length;/**
   * Calculates the squared length of a vec2
   * @static
   * @method squaredLength
   * @param {Array} a vector to calculate squared length of
   * @return {Number} squared length of a
   */vec2.squaredLength=function(a){var x=a[0],y=a[1];return x*x+y*y;};/**
   * Alias for vec2.squaredLength
   * @static
   * @method sqrLen
   */vec2.sqrLen=vec2.squaredLength;/**
   * Negates the components of a vec2
   * @static
   * @method negate
   * @param {Array} out the receiving vector
   * @param {Array} a vector to negate
   * @return {Array} out
   */vec2.negate=function(out,a){out[0]=-a[0];out[1]=-a[1];return out;};/**
   * Normalize a vec2
   * @static
   * @method normalize
   * @param {Array} out the receiving vector
   * @param {Array} a vector to normalize
   * @return {Array} out
   */vec2.normalize=function(out,a){var x=a[0],y=a[1];var len=x*x+y*y;if(len>0){//TODO: evaluate use of glm_invsqrt here?
len=1/Math.sqrt(len);out[0]=a[0]*len;out[1]=a[1]*len;}return out;};/**
   * Calculates the dot product of two vec2's
   * @static
   * @method dot
   * @param {Array} a the first operand
   * @param {Array} b the second operand
   * @return {Number} dot product of a and b
   */vec2.dot=function(a,b){return a[0]*b[0]+a[1]*b[1];};/**
   * Returns a string representation of a vector
   * @static
   * @method str
   * @param {Array} vec vector to represent as a string
   * @return {String} string representation of the vector
   */vec2.str=function(a){return'vec2('+a[0]+', '+a[1]+')';};/**
   * Linearly interpolate/mix two vectors.
   * @static
   * @method lerp
   * @param {Array} out
   * @param {Array} a First vector
   * @param {Array} b Second vector
   * @param {number} t Lerp factor
   */vec2.lerp=function(out,a,b,t){var ax=a[0],ay=a[1];out[0]=ax+t*(b[0]-ax);out[1]=ay+t*(b[1]-ay);return out;};/**
   * Reflect a vector along a normal.
   * @static
   * @method reflect
   * @param {Array} out
   * @param {Array} vector
   * @param {Array} normal
   */vec2.reflect=function(out,vector,normal){var dot=vector[0]*normal[0]+vector[1]*normal[1];out[0]=vector[0]-2*normal[0]*dot;out[1]=vector[1]-2*normal[1]*dot;};/**
   * Get the intersection point between two line segments.
   * @static
   * @method getLineSegmentsIntersection
   * @param  {Array} out
   * @param  {Array} p0
   * @param  {Array} p1
   * @param  {Array} p2
   * @param  {Array} p3
   * @return {boolean} True if there was an intersection, otherwise false.
   */vec2.getLineSegmentsIntersection=function(out,p0,p1,p2,p3){var t=vec2.getLineSegmentsIntersectionFraction(p0,p1,p2,p3);if(t<0){return false;}else{out[0]=p0[0]+t*(p1[0]-p0[0]);out[1]=p0[1]+t*(p1[1]-p0[1]);return true;}};/**
   * Get the intersection fraction between two line segments. If successful, the intersection is at p0 + t * (p1 - p0)
   * @static
   * @method getLineSegmentsIntersectionFraction
   * @param  {Array} p0
   * @param  {Array} p1
   * @param  {Array} p2
   * @param  {Array} p3
   * @return {number} A number between 0 and 1 if there was an intersection, otherwise -1.
   */vec2.getLineSegmentsIntersectionFraction=function(p0,p1,p2,p3){var s1_x=p1[0]-p0[0];var s1_y=p1[1]-p0[1];var s2_x=p3[0]-p2[0];var s2_y=p3[1]-p2[1];var s,t;s=(-s1_y*(p0[0]-p2[0])+s1_x*(p0[1]-p2[1]))/(-s2_x*s1_y+s1_x*s2_y);t=(s2_x*(p0[1]-p2[1])-s2_y*(p0[0]-p2[0]))/(-s2_x*s1_y+s1_x*s2_y);if(s>=0&&s<=1&&t>=0&&t<=1){// Collision detected
return t;}return-1;// No collision
};});var AABB_1=AABB;/**
   * Axis aligned bounding box class.
   * @class AABB
   * @constructor
   * @param {Object}  [options]
   * @param {Array}   [options.upperBound]
   * @param {Array}   [options.lowerBound]
   */function AABB(options){/**
       * The lower bound of the bounding box.
       * @property lowerBound
       * @type {Array}
       */this.lowerBound=vec2_1.create();if(options&&options.lowerBound){vec2_1.copy(this.lowerBound,options.lowerBound);}/**
       * The upper bound of the bounding box.
       * @property upperBound
       * @type {Array}
       */this.upperBound=vec2_1.create();if(options&&options.upperBound){vec2_1.copy(this.upperBound,options.upperBound);}}var tmp=vec2_1.create();/**
   * Set the AABB bounds from a set of points, transformed by the given position and angle.
   * @method setFromPoints
   * @param {Array} points An array of vec2's.
   * @param {Array} position
   * @param {number} angle
   * @param {number} skinSize Some margin to be added to the AABB.
   */AABB.prototype.setFromPoints=function(points,position,angle,skinSize){var l=this.lowerBound,u=this.upperBound;if(typeof angle!=="number"){angle=0;}// Set to the first point
if(angle!==0){vec2_1.rotate(l,points[0],angle);}else{vec2_1.copy(l,points[0]);}vec2_1.copy(u,l);// Compute cosines and sines just once
var cosAngle=Math.cos(angle),sinAngle=Math.sin(angle);for(var i=1;i<points.length;i++){var p=points[i];if(angle!==0){var x=p[0],y=p[1];tmp[0]=cosAngle*x-sinAngle*y;tmp[1]=sinAngle*x+cosAngle*y;p=tmp;}for(var j=0;j<2;j++){if(p[j]>u[j]){u[j]=p[j];}if(p[j]<l[j]){l[j]=p[j];}}}// Add offset
if(position){vec2_1.add(this.lowerBound,this.lowerBound,position);vec2_1.add(this.upperBound,this.upperBound,position);}if(skinSize){this.lowerBound[0]-=skinSize;this.lowerBound[1]-=skinSize;this.upperBound[0]+=skinSize;this.upperBound[1]+=skinSize;}};/**
   * Copy bounds from an AABB to this AABB
   * @method copy
   * @param  {AABB} aabb
   */AABB.prototype.copy=function(aabb){vec2_1.copy(this.lowerBound,aabb.lowerBound);vec2_1.copy(this.upperBound,aabb.upperBound);};/**
   * Extend this AABB so that it covers the given AABB too.
   * @method extend
   * @param  {AABB} aabb
   */AABB.prototype.extend=function(aabb){// Loop over x and y
var i=2;while(i--){// Extend lower bound
var l=aabb.lowerBound[i];if(this.lowerBound[i]>l){this.lowerBound[i]=l;}// Upper
var u=aabb.upperBound[i];if(this.upperBound[i]<u){this.upperBound[i]=u;}}};/**
   * Returns true if the given AABB overlaps this AABB.
   * @method overlaps
   * @param  {AABB} aabb
   * @return {Boolean}
   */AABB.prototype.overlaps=function(aabb){var l1=this.lowerBound,u1=this.upperBound,l2=aabb.lowerBound,u2=aabb.upperBound;//      l2        u2
//      |---------|
// |--------|
// l1       u1
return(l2[0]<=u1[0]&&u1[0]<=u2[0]||l1[0]<=u2[0]&&u2[0]<=u1[0])&&(l2[1]<=u1[1]&&u1[1]<=u2[1]||l1[1]<=u2[1]&&u2[1]<=u1[1]);};/**
   * @method containsPoint
   * @param  {Array} point
   * @return {boolean}
   */AABB.prototype.containsPoint=function(point){var l=this.lowerBound,u=this.upperBound;return l[0]<=point[0]&&point[0]<=u[0]&&l[1]<=point[1]&&point[1]<=u[1];};/**
   * Check if the AABB is hit by a ray.
   * @method overlapsRay
   * @param  {Ray} ray
   * @return {number} -1 if no hit, a number between 0 and 1 if hit.
   */AABB.prototype.overlapsRay=function(ray){// ray.direction is unit direction vector of ray
var dirFracX=1/ray.direction[0];var dirFracY=1/ray.direction[1];// this.lowerBound is the corner of AABB with minimal coordinates - left bottom, rt is maximal corner
var t1=(this.lowerBound[0]-ray.from[0])*dirFracX;var t2=(this.upperBound[0]-ray.from[0])*dirFracX;var t3=(this.lowerBound[1]-ray.from[1])*dirFracY;var t4=(this.upperBound[1]-ray.from[1])*dirFracY;var tmin=Math.max(Math.max(Math.min(t1,t2),Math.min(t3,t4)));var tmax=Math.min(Math.min(Math.max(t1,t2),Math.max(t3,t4)));// if tmax < 0, ray (line) is intersecting AABB, but whole AABB is behing us
if(tmax<0){//t = tmax;
return-1;}// if tmin > tmax, ray doesn't intersect AABB
if(tmin>tmax){//t = tmax;
return-1;}return tmin;};var Scalar_1=Scalar;/**
   * Scalar functions
   * @class Scalar
   */function Scalar(){}/**
   * Check if two scalars are equal
   * @static
   * @method eq
   * @param  {Number} a
   * @param  {Number} b
   * @param  {Number} [precision]
   * @return {Boolean}
   */Scalar.eq=function(a,b,precision){precision=precision||0;return Math.abs(a-b)<precision;};var Line_1=Line;/**
   * Container for line-related functions
   * @class Line
   */function Line(){}/**
   * Compute the intersection between two lines.
   * @static
   * @method lineInt
   * @param  {Array}  l1          Line vector 1
   * @param  {Array}  l2          Line vector 2
   * @param  {Number} precision   Precision to use when checking if the lines are parallel
   * @return {Array}              The intersection point.
   */Line.lineInt=function(l1,l2,precision){precision=precision||0;var i=[0,0];// point
var a1,b1,c1,a2,b2,c2,det;// scalars
a1=l1[1][1]-l1[0][1];b1=l1[0][0]-l1[1][0];c1=a1*l1[0][0]+b1*l1[0][1];a2=l2[1][1]-l2[0][1];b2=l2[0][0]-l2[1][0];c2=a2*l2[0][0]+b2*l2[0][1];det=a1*b2-a2*b1;if(!Scalar_1.eq(det,0,precision)){// lines are not parallel
i[0]=(b2*c1-b1*c2)/det;i[1]=(a1*c2-a2*c1)/det;}return i;};/**
   * Checks if two line segments intersects.
   * @method segmentsIntersect
   * @param {Array} p1 The start vertex of the first line segment.
   * @param {Array} p2 The end vertex of the first line segment.
   * @param {Array} q1 The start vertex of the second line segment.
   * @param {Array} q2 The end vertex of the second line segment.
   * @return {Boolean} True if the two line segments intersect
   */Line.segmentsIntersect=function(p1,p2,q1,q2){var dx=p2[0]-p1[0];var dy=p2[1]-p1[1];var da=q2[0]-q1[0];var db=q2[1]-q1[1];// segments are parallel
if(da*dy-db*dx==0)return false;var s=(dx*(q1[1]-p1[1])+dy*(p1[0]-q1[0]))/(da*dy-db*dx);var t=(da*(p1[1]-q1[1])+db*(q1[0]-p1[0]))/(db*dx-da*dy);return s>=0&&s<=1&&t>=0&&t<=1;};var Point_1=Point;/**
   * Point related functions
   * @class Point
   */function Point(){}/**
   * Get the area of a triangle spanned by the three given points. Note that the area will be negative if the points are not given in counter-clockwise order.
   * @static
   * @method area
   * @param  {Array} a
   * @param  {Array} b
   * @param  {Array} c
   * @return {Number}
   */Point.area=function(a,b,c){return(b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]);};Point.left=function(a,b,c){return Point.area(a,b,c)>0;};Point.leftOn=function(a,b,c){return Point.area(a,b,c)>=0;};Point.right=function(a,b,c){return Point.area(a,b,c)<0;};Point.rightOn=function(a,b,c){return Point.area(a,b,c)<=0;};var tmpPoint1=[],tmpPoint2=[];/**
   * Check if three points are collinear
   * @method collinear
   * @param  {Array} a
   * @param  {Array} b
   * @param  {Array} c
   * @param  {Number} [thresholdAngle=0] Threshold angle to use when comparing the vectors. The function will return true if the angle between the resulting vectors is less than this value. Use zero for max precision.
   * @return {Boolean}
   */Point.collinear=function(a,b,c,thresholdAngle){if(!thresholdAngle)return Point.area(a,b,c)==0;else{var ab=tmpPoint1,bc=tmpPoint2;ab[0]=b[0]-a[0];ab[1]=b[1]-a[1];bc[0]=c[0]-b[0];bc[1]=c[1]-b[1];var dot=ab[0]*bc[0]+ab[1]*bc[1],magA=Math.sqrt(ab[0]*ab[0]+ab[1]*ab[1]),magB=Math.sqrt(bc[0]*bc[0]+bc[1]*bc[1]),angle=Math.acos(dot/(magA*magB));return angle<thresholdAngle;}};Point.sqdist=function(a,b){var dx=b[0]-a[0];var dy=b[1]-a[1];return dx*dx+dy*dy;};var Polygon_1=Polygon;/**
   * Polygon class.
   * @class Polygon
   * @constructor
   */function Polygon(){/**
       * Vertices that this polygon consists of. An array of array of numbers, example: [[0,0],[1,0],..]
       * @property vertices
       * @type {Array}
       */this.vertices=[];}/**
   * Get a vertex at position i. It does not matter if i is out of bounds, this function will just cycle.
   * @method at
   * @param  {Number} i
   * @return {Array}
   */Polygon.prototype.at=function(i){var v=this.vertices,s=v.length;return v[i<0?i%s+s:i%s];};/**
   * Get first vertex
   * @method first
   * @return {Array}
   */Polygon.prototype.first=function(){return this.vertices[0];};/**
   * Get last vertex
   * @method last
   * @return {Array}
   */Polygon.prototype.last=function(){return this.vertices[this.vertices.length-1];};/**
   * Clear the polygon data
   * @method clear
   * @return {Array}
   */Polygon.prototype.clear=function(){this.vertices.length=0;};/**
   * Append points "from" to "to"-1 from an other polygon "poly" onto this one.
   * @method append
   * @param {Polygon} poly The polygon to get points from.
   * @param {Number}  from The vertex index in "poly".
   * @param {Number}  to The end vertex index in "poly". Note that this vertex is NOT included when appending.
   * @return {Array}
   */Polygon.prototype.append=function(poly,from,to){if(typeof from=="undefined")throw new Error("From is not given!");if(typeof to=="undefined")throw new Error("To is not given!");if(to-1<from)throw new Error("lol1");if(to>poly.vertices.length)throw new Error("lol2");if(from<0)throw new Error("lol3");for(var i=from;i<to;i++){this.vertices.push(poly.vertices[i]);}};/**
   * Make sure that the polygon vertices are ordered counter-clockwise.
   * @method makeCCW
   */Polygon.prototype.makeCCW=function(){var br=0,v=this.vertices;// find bottom right point
for(var i=1;i<this.vertices.length;++i){if(v[i][1]<v[br][1]||v[i][1]==v[br][1]&&v[i][0]>v[br][0]){br=i;}}// reverse poly if clockwise
if(!Point_1.left(this.at(br-1),this.at(br),this.at(br+1))){this.reverse();}};/**
   * Reverse the vertices in the polygon
   * @method reverse
   */Polygon.prototype.reverse=function(){var tmp=[];for(var i=0,N=this.vertices.length;i!==N;i++){tmp.push(this.vertices.pop());}this.vertices=tmp;};/**
   * Check if a point in the polygon is a reflex point
   * @method isReflex
   * @param  {Number}  i
   * @return {Boolean}
   */Polygon.prototype.isReflex=function(i){return Point_1.right(this.at(i-1),this.at(i),this.at(i+1));};var tmpLine1=[],tmpLine2=[];/**
   * Check if two vertices in the polygon can see each other
   * @method canSee
   * @param  {Number} a Vertex index 1
   * @param  {Number} b Vertex index 2
   * @return {Boolean}
   */Polygon.prototype.canSee=function(a,b){var p,dist,l1=tmpLine1,l2=tmpLine2;if(Point_1.leftOn(this.at(a+1),this.at(a),this.at(b))&&Point_1.rightOn(this.at(a-1),this.at(a),this.at(b))){return false;}dist=Point_1.sqdist(this.at(a),this.at(b));for(var i=0;i!==this.vertices.length;++i){// for each edge
if((i+1)%this.vertices.length===a||i===a)// ignore incident edges
continue;if(Point_1.leftOn(this.at(a),this.at(b),this.at(i+1))&&Point_1.rightOn(this.at(a),this.at(b),this.at(i))){// if diag intersects an edge
l1[0]=this.at(a);l1[1]=this.at(b);l2[0]=this.at(i);l2[1]=this.at(i+1);p=Line_1.lineInt(l1,l2);if(Point_1.sqdist(this.at(a),p)<dist){// if edge is blocking visibility to b
return false;}}}return true;};/**
   * Copy the polygon from vertex i to vertex j.
   * @method copy
   * @param  {Number} i
   * @param  {Number} j
   * @param  {Polygon} [targetPoly]   Optional target polygon to save in.
   * @return {Polygon}                The resulting copy.
   */Polygon.prototype.copy=function(i,j,targetPoly){var p=targetPoly||new Polygon();p.clear();if(i<j){// Insert all vertices from i to j
for(var k=i;k<=j;k++){p.vertices.push(this.vertices[k]);}}else{// Insert vertices 0 to j
for(var k=0;k<=j;k++){p.vertices.push(this.vertices[k]);}// Insert vertices i to end
for(var k=i;k<this.vertices.length;k++){p.vertices.push(this.vertices[k]);}}return p;};/**
   * Decomposes the polygon into convex pieces. Returns a list of edges [[p1,p2],[p2,p3],...] that cuts the polygon.
   * Note that this algorithm has complexity O(N^4) and will be very slow for polygons with many vertices.
   * @method getCutEdges
   * @return {Array}
   */Polygon.prototype.getCutEdges=function(){var min=[],tmp1=[],tmp2=[],tmpPoly=new Polygon();var nDiags=Number.MAX_VALUE;for(var i=0;i<this.vertices.length;++i){if(this.isReflex(i)){for(var j=0;j<this.vertices.length;++j){if(this.canSee(i,j)){tmp1=this.copy(i,j,tmpPoly).getCutEdges();tmp2=this.copy(j,i,tmpPoly).getCutEdges();for(var k=0;k<tmp2.length;k++){tmp1.push(tmp2[k]);}if(tmp1.length<nDiags){min=tmp1;nDiags=tmp1.length;min.push([this.at(i),this.at(j)]);}}}}}return min;};/**
   * Decomposes the polygon into one or more convex sub-Polygons.
   * @method decomp
   * @return {Array} An array or Polygon objects.
   */Polygon.prototype.decomp=function(){var edges=this.getCutEdges();if(edges.length>0)return this.slice(edges);else return[this];};/**
   * Slices the polygon given one or more cut edges. If given one, this function will return two polygons (false on failure). If many, an array of polygons.
   * @method slice
   * @param {Array} cutEdges A list of edges, as returned by .getCutEdges()
   * @return {Array}
   */Polygon.prototype.slice=function(cutEdges){if(cutEdges.length==0)return[this];if(cutEdges instanceof Array&&cutEdges.length&&cutEdges[0]instanceof Array&&cutEdges[0].length==2&&cutEdges[0][0]instanceof Array){var polys=[this];for(var i=0;i<cutEdges.length;i++){var cutEdge=cutEdges[i];// Cut all polys
for(var j=0;j<polys.length;j++){var poly=polys[j];var result=poly.slice(cutEdge);if(result){// Found poly! Cut and quit
polys.splice(j,1);polys.push(result[0],result[1]);break;}}}return polys;}else{// Was given one edge
var cutEdge=cutEdges;var i=this.vertices.indexOf(cutEdge[0]);var j=this.vertices.indexOf(cutEdge[1]);if(i!=-1&&j!=-1){return[this.copy(i,j),this.copy(j,i)];}else{return false;}}};/**
   * Checks that the line segments of this polygon do not intersect each other.
   * @method isSimple
   * @param  {Array} path An array of vertices e.g. [[0,0],[0,1],...]
   * @return {Boolean}
   * @todo Should it check all segments with all others?
   */Polygon.prototype.isSimple=function(){var path=this.vertices;// Check
for(var i=0;i<path.length-1;i++){for(var j=0;j<i-1;j++){if(Line_1.segmentsIntersect(path[i],path[i+1],path[j],path[j+1])){return false;}}}// Check the segment between the last and the first point to all others
for(var i=1;i<path.length-2;i++){if(Line_1.segmentsIntersect(path[0],path[path.length-1],path[i],path[i+1])){return false;}}return true;};function getIntersectionPoint(p1,p2,q1,q2,delta){delta=delta||0;var a1=p2[1]-p1[1];var b1=p1[0]-p2[0];var c1=a1*p1[0]+b1*p1[1];var a2=q2[1]-q1[1];var b2=q1[0]-q2[0];var c2=a2*q1[0]+b2*q1[1];var det=a1*b2-a2*b1;if(!Scalar_1.eq(det,0,delta))return[(b2*c1-b1*c2)/det,(a1*c2-a2*c1)/det];else return[0,0];}/**
   * Quickly decompose the Polygon into convex sub-polygons.
   * @method quickDecomp
   * @param  {Array} result
   * @param  {Array} [reflexVertices]
   * @param  {Array} [steinerPoints]
   * @param  {Number} [delta]
   * @param  {Number} [maxlevel]
   * @param  {Number} [level]
   * @return {Array}
   */Polygon.prototype.quickDecomp=function(result,reflexVertices,steinerPoints,delta,maxlevel,level){maxlevel=maxlevel||100;level=level||0;delta=delta||25;result=typeof result!="undefined"?result:[];reflexVertices=reflexVertices||[];steinerPoints=steinerPoints||[];var upperInt=[0,0],lowerInt=[0,0],p=[0,0];// Points
var upperDist=0,lowerDist=0,d=0,closestDist=0;// scalars
var upperIndex=0,lowerIndex=0,closestIndex=0;// Integers
var lowerPoly=new Polygon(),upperPoly=new Polygon();// polygons
var poly=this,v=this.vertices;if(v.length<3)return result;level++;if(level>maxlevel){console.warn("quickDecomp: max level ("+maxlevel+") reached.");return result;}for(var i=0;i<this.vertices.length;++i){if(poly.isReflex(i)){reflexVertices.push(poly.vertices[i]);upperDist=lowerDist=Number.MAX_VALUE;for(var j=0;j<this.vertices.length;++j){if(Point_1.left(poly.at(i-1),poly.at(i),poly.at(j))&&Point_1.rightOn(poly.at(i-1),poly.at(i),poly.at(j-1))){// if line intersects with an edge
p=getIntersectionPoint(poly.at(i-1),poly.at(i),poly.at(j),poly.at(j-1));// find the point of intersection
if(Point_1.right(poly.at(i+1),poly.at(i),p)){// make sure it's inside the poly
d=Point_1.sqdist(poly.vertices[i],p);if(d<lowerDist){// keep only the closest intersection
lowerDist=d;lowerInt=p;lowerIndex=j;}}}if(Point_1.left(poly.at(i+1),poly.at(i),poly.at(j+1))&&Point_1.rightOn(poly.at(i+1),poly.at(i),poly.at(j))){p=getIntersectionPoint(poly.at(i+1),poly.at(i),poly.at(j),poly.at(j+1));if(Point_1.left(poly.at(i-1),poly.at(i),p)){d=Point_1.sqdist(poly.vertices[i],p);if(d<upperDist){upperDist=d;upperInt=p;upperIndex=j;}}}}// if there are no vertices to connect to, choose a point in the middle
if(lowerIndex==(upperIndex+1)%this.vertices.length){//console.log("Case 1: Vertex("+i+"), lowerIndex("+lowerIndex+"), upperIndex("+upperIndex+"), poly.size("+this.vertices.length+")");
p[0]=(lowerInt[0]+upperInt[0])/2;p[1]=(lowerInt[1]+upperInt[1])/2;steinerPoints.push(p);if(i<upperIndex){//lowerPoly.insert(lowerPoly.end(), poly.begin() + i, poly.begin() + upperIndex + 1);
lowerPoly.append(poly,i,upperIndex+1);lowerPoly.vertices.push(p);upperPoly.vertices.push(p);if(lowerIndex!=0){//upperPoly.insert(upperPoly.end(), poly.begin() + lowerIndex, poly.end());
upperPoly.append(poly,lowerIndex,poly.vertices.length);}//upperPoly.insert(upperPoly.end(), poly.begin(), poly.begin() + i + 1);
upperPoly.append(poly,0,i+1);}else{if(i!=0){//lowerPoly.insert(lowerPoly.end(), poly.begin() + i, poly.end());
lowerPoly.append(poly,i,poly.vertices.length);}//lowerPoly.insert(lowerPoly.end(), poly.begin(), poly.begin() + upperIndex + 1);
lowerPoly.append(poly,0,upperIndex+1);lowerPoly.vertices.push(p);upperPoly.vertices.push(p);//upperPoly.insert(upperPoly.end(), poly.begin() + lowerIndex, poly.begin() + i + 1);
upperPoly.append(poly,lowerIndex,i+1);}}else{// connect to the closest point within the triangle
//console.log("Case 2: Vertex("+i+"), closestIndex("+closestIndex+"), poly.size("+this.vertices.length+")\n");
if(lowerIndex>upperIndex){upperIndex+=this.vertices.length;}closestDist=Number.MAX_VALUE;if(upperIndex<lowerIndex){return result;}for(var j=lowerIndex;j<=upperIndex;++j){if(Point_1.leftOn(poly.at(i-1),poly.at(i),poly.at(j))&&Point_1.rightOn(poly.at(i+1),poly.at(i),poly.at(j))){d=Point_1.sqdist(poly.at(i),poly.at(j));if(d<closestDist){closestDist=d;closestIndex=j%this.vertices.length;}}}if(i<closestIndex){lowerPoly.append(poly,i,closestIndex+1);if(closestIndex!=0){upperPoly.append(poly,closestIndex,v.length);}upperPoly.append(poly,0,i+1);}else{if(i!=0){lowerPoly.append(poly,i,v.length);}lowerPoly.append(poly,0,closestIndex+1);upperPoly.append(poly,closestIndex,i+1);}}// solve smallest poly first
if(lowerPoly.vertices.length<upperPoly.vertices.length){lowerPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);upperPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);}else{upperPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);lowerPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);}return result;}}result.push(this);return result;};/**
   * Remove collinear points in the polygon.
   * @method removeCollinearPoints
   * @param  {Number} [precision] The threshold angle to use when determining whether two edges are collinear. Use zero for finest precision.
   * @return {Number}           The number of points removed
   */Polygon.prototype.removeCollinearPoints=function(precision){var num=0;for(var i=this.vertices.length-1;this.vertices.length>3&&i>=0;--i){if(Point_1.collinear(this.at(i-1),this.at(i),this.at(i+1),precision)){// Remove the middle point
this.vertices.splice(i%this.vertices.length,1);i--;// Jump one point forward. Otherwise we may get a chain removal
num++;}}return num;};var src={Polygon:Polygon_1,Point:Point_1};var Shape_1=Shape;/**
   * Base class for shapes.
   * @class Shape
   * @constructor
   * @param {object} [options]
   * @param {array} [options.position]
   * @param {number} [options.angle=0]
   * @param {number} [options.collisionGroup=1]
   * @param {number} [options.collisionMask=1]
   * @param {boolean} [options.sensor=false]
   * @param {boolean} [options.collisionResponse=true]
   * @param {object} [options.type=0]
   */function Shape(options){options=options||{};/**
       * The body this shape is attached to. A shape can only be attached to a single body.
       * @property {Body} body
       */this.body=null;/**
       * Body-local position of the shape.
       * @property {Array} position
       */this.position=vec2_1.fromValues(0,0);if(options.position){vec2_1.copy(this.position,options.position);}/**
       * Body-local angle of the shape.
       * @property {number} angle
       */this.angle=options.angle||0;/**
       * The type of the shape. One of:
       *
       * * {{#crossLink "Shape/CIRCLE:property"}}Shape.CIRCLE{{/crossLink}}
       * * {{#crossLink "Shape/PARTICLE:property"}}Shape.PARTICLE{{/crossLink}}
       * * {{#crossLink "Shape/PLANE:property"}}Shape.PLANE{{/crossLink}}
       * * {{#crossLink "Shape/CONVEX:property"}}Shape.CONVEX{{/crossLink}}
       * * {{#crossLink "Shape/LINE:property"}}Shape.LINE{{/crossLink}}
       * * {{#crossLink "Shape/BOX:property"}}Shape.BOX{{/crossLink}}
       * * {{#crossLink "Shape/CAPSULE:property"}}Shape.CAPSULE{{/crossLink}}
       * * {{#crossLink "Shape/HEIGHTFIELD:property"}}Shape.HEIGHTFIELD{{/crossLink}}
       *
       * @property {number} type
       */this.type=options.type||0;/**
       * Shape object identifier.
       * @type {Number}
       * @property id
       */this.id=Shape.idCounter++;/**
       * Bounding circle radius of this shape
       * @property boundingRadius
       * @type {Number}
       */this.boundingRadius=0;/**
       * Collision group that this shape belongs to (bit mask). See <a href="http://www.aurelienribon.com/blog/2011/07/box2d-tutorial-collision-filtering/">this tutorial</a>.
       * @property collisionGroup
       * @type {Number}
       * @example
       *     // Setup bits for each available group
       *     var PLAYER = Math.pow(2,0),
       *         ENEMY =  Math.pow(2,1),
       *         GROUND = Math.pow(2,2)
       *
       *     // Put shapes into their groups
       *     player1Shape.collisionGroup = PLAYER;
       *     player2Shape.collisionGroup = PLAYER;
       *     enemyShape  .collisionGroup = ENEMY;
       *     groundShape .collisionGroup = GROUND;
       *
       *     // Assign groups that each shape collide with.
       *     // Note that the players can collide with ground and enemies, but not with other players.
       *     player1Shape.collisionMask = ENEMY | GROUND;
       *     player2Shape.collisionMask = ENEMY | GROUND;
       *     enemyShape  .collisionMask = PLAYER | GROUND;
       *     groundShape .collisionMask = PLAYER | ENEMY;
       *
       * @example
       *     // How collision check is done
       *     if(shapeA.collisionGroup & shapeB.collisionMask)!=0 && (shapeB.collisionGroup & shapeA.collisionMask)!=0){
       *         // The shapes will collide
       *     }
       */this.collisionGroup=options.collisionGroup!==undefined?options.collisionGroup:1;/**
       * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled. That means that this shape will move through other body shapes, but it will still trigger contact events, etc.
       * @property {Boolean} collisionResponse
       */this.collisionResponse=options.collisionResponse!==undefined?options.collisionResponse:true;/**
       * Collision mask of this shape. See .collisionGroup.
       * @property collisionMask
       * @type {Number}
       */this.collisionMask=options.collisionMask!==undefined?options.collisionMask:1;/**
       * Material to use in collisions for this Shape. If this is set to null, the world will use default material properties instead.
       * @property material
       * @type {Material}
       */this.material=options.material||null;/**
       * Area of this shape.
       * @property area
       * @type {Number}
       */this.area=0;/**
       * Set to true if you want this shape to be a sensor. A sensor does not generate contacts, but it still reports contact events. This is good if you want to know if a shape is overlapping another shape, without them generating contacts.
       * @property {Boolean} sensor
       */this.sensor=options.sensor!==undefined?options.sensor:false;if(this.type){this.updateBoundingRadius();}this.updateArea();}Shape.idCounter=0;/**
   * @static
   * @property {Number} CIRCLE
   */Shape.CIRCLE=1;/**
   * @static
   * @property {Number} PARTICLE
   */Shape.PARTICLE=2;/**
   * @static
   * @property {Number} PLANE
   */Shape.PLANE=4;/**
   * @static
   * @property {Number} CONVEX
   */Shape.CONVEX=8;/**
   * @static
   * @property {Number} LINE
   */Shape.LINE=16;/**
   * @static
   * @property {Number} BOX
   */Shape.BOX=32;Object.defineProperty(Shape,'RECTANGLE',{get:function get(){console.warn('Shape.RECTANGLE is deprecated, use Shape.BOX instead.');return Shape.BOX;}});/**
   * @static
   * @property {Number} CAPSULE
   */Shape.CAPSULE=64;/**
   * @static
   * @property {Number} HEIGHTFIELD
   */Shape.HEIGHTFIELD=128;/**
   * Should return the moment of inertia around the Z axis of the body given the total mass. See <a href="http://en.wikipedia.org/wiki/List_of_moments_of_inertia">Wikipedia's list of moments of inertia</a>.
   * @method computeMomentOfInertia
   * @param  {Number} mass
   * @return {Number} If the inertia is infinity or if the object simply isn't possible to rotate, return 0.
   */Shape.prototype.computeMomentOfInertia=function(mass){};/**
   * Returns the bounding circle radius of this shape.
   * @method updateBoundingRadius
   * @return {Number}
   */Shape.prototype.updateBoundingRadius=function(){};/**
   * Update the .area property of the shape.
   * @method updateArea
   */Shape.prototype.updateArea=function(){// To be implemented in all subclasses
};/**
   * Compute the world axis-aligned bounding box (AABB) of this shape.
   * @method computeAABB
   * @param  {AABB} out The resulting AABB.
   * @param  {Array} position World position of the shape.
   * @param  {Number} angle World angle of the shape.
   */Shape.prototype.computeAABB=function(out,position,angle){// To be implemented in each subclass
};/**
   * Perform raycasting on this shape.
   * @method raycast
   * @param  {RayResult} result Where to store the resulting data.
   * @param  {Ray} ray The Ray that you want to use for raycasting.
   * @param  {array} position World position of the shape (the .position property will be ignored).
   * @param  {number} angle World angle of the shape (the .angle property will be ignored).
   */Shape.prototype.raycast=function(result,ray,position,angle){// To be implemented in each subclass
};/*
          PolyK library
          url: http://polyk.ivank.net
          Released under MIT licence.

          Copyright (c) 2012 Ivan Kuckir

          Permission is hereby granted, free of charge, to any person
          obtaining a copy of this software and associated documentation
          files (the "Software"), to deal in the Software without
          restriction, including without limitation the rights to use,
          copy, modify, merge, publish, distribute, sublicense, and/or sell
          copies of the Software, and to permit persons to whom the
          Software is furnished to do so, subject to the following
          conditions:

          The above copyright notice and this permission notice shall be
          included in all copies or substantial portions of the Software.

          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
          OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
          NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
          HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
          WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
          FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
          OTHER DEALINGS IN THE SOFTWARE.
      */var PolyK={};/*
          Is Polygon self-intersecting?

          O(n^2)
      */ /*
      PolyK.IsSimple = function(p)
      {
          var n = p.length>>1;
          if(n<4) return true;
          var a1 = new PolyK._P(), a2 = new PolyK._P();
          var b1 = new PolyK._P(), b2 = new PolyK._P();
          var c = new PolyK._P();

          for(var i=0; i<n; i++)
          {
              a1.x = p[2*i  ];
              a1.y = p[2*i+1];
              if(i==n-1)  { a2.x = p[0    ];  a2.y = p[1    ]; }
              else        { a2.x = p[2*i+2];  a2.y = p[2*i+3]; }

              for(var j=0; j<n; j++)
              {
                  if(Math.abs(i-j) < 2) continue;
                  if(j==n-1 && i==0) continue;
                  if(i==n-1 && j==0) continue;

                  b1.x = p[2*j  ];
                  b1.y = p[2*j+1];
                  if(j==n-1)  { b2.x = p[0    ];  b2.y = p[1    ]; }
                  else        { b2.x = p[2*j+2];  b2.y = p[2*j+3]; }

                  if(PolyK._GetLineIntersection(a1,a2,b1,b2,c) != null) return false;
              }
          }
          return true;
      }

      PolyK.IsConvex = function(p)
      {
          if(p.length<6) return true;
          var l = p.length - 4;
          for(var i=0; i<l; i+=2)
              if(!PolyK._convex(p[i], p[i+1], p[i+2], p[i+3], p[i+4], p[i+5])) return false;
          if(!PolyK._convex(p[l  ], p[l+1], p[l+2], p[l+3], p[0], p[1])) return false;
          if(!PolyK._convex(p[l+2], p[l+3], p[0  ], p[1  ], p[2], p[3])) return false;
          return true;
      }
      */PolyK.GetArea=function(p){if(p.length<6)return 0;var l=p.length-2;var sum=0;for(var i=0;i<l;i+=2){sum+=(p[i+2]-p[i])*(p[i+1]+p[i+3]);}sum+=(p[0]-p[l])*(p[l+1]+p[1]);return-sum*0.5;};/*
      PolyK.GetAABB = function(p)
      {
          var minx = Infinity;
          var miny = Infinity;
          var maxx = -minx;
          var maxy = -miny;
          for(var i=0; i<p.length; i+=2)
          {
              minx = Math.min(minx, p[i  ]);
              maxx = Math.max(maxx, p[i  ]);
              miny = Math.min(miny, p[i+1]);
              maxy = Math.max(maxy, p[i+1]);
          }
          return {x:minx, y:miny, width:maxx-minx, height:maxy-miny};
      }
      */PolyK.Triangulate=function(p){var n=p.length>>1;if(n<3)return[];var tgs=[];var avl=[];for(var i=0;i<n;i++){avl.push(i);}var i=0;var al=n;while(al>3){var i0=avl[(i+0)%al];var i1=avl[(i+1)%al];var i2=avl[(i+2)%al];var ax=p[2*i0],ay=p[2*i0+1];var bx=p[2*i1],by=p[2*i1+1];var cx=p[2*i2],cy=p[2*i2+1];var earFound=false;if(PolyK._convex(ax,ay,bx,by,cx,cy)){earFound=true;for(var j=0;j<al;j++){var vi=avl[j];if(vi==i0||vi==i1||vi==i2)continue;if(PolyK._PointInTriangle(p[2*vi],p[2*vi+1],ax,ay,bx,by,cx,cy)){earFound=false;break;}}}if(earFound){tgs.push(i0,i1,i2);avl.splice((i+1)%al,1);al--;i=0;}else if(i++>3*al)break;// no convex angles :(
}tgs.push(avl[0],avl[1],avl[2]);return tgs;};/*
      PolyK.ContainsPoint = function(p, px, py)
      {
          var n = p.length>>1;
          var ax, ay, bx = p[2*n-2]-px, by = p[2*n-1]-py;
          var depth = 0;
          for(var i=0; i<n; i++)
          {
              ax = bx;  ay = by;
              bx = p[2*i  ] - px;
              by = p[2*i+1] - py;
              if(ay< 0 && by< 0) continue;    // both "up" or both "donw"
              if(ay>=0 && by>=0) continue;    // both "up" or both "donw"
              if(ax< 0 && bx< 0) continue;

              var lx = ax + (bx-ax)*(-ay)/(by-ay);
              if(lx>0) depth++;
          }
          return (depth & 1) == 1;
      }

      PolyK.Slice = function(p, ax, ay, bx, by)
      {
          if(PolyK.ContainsPoint(p, ax, ay) || PolyK.ContainsPoint(p, bx, by)) return [p.slice(0)];

          var a = new PolyK._P(ax, ay);
          var b = new PolyK._P(bx, by);
          var iscs = [];  // intersections
          var ps = [];    // points
          for(var i=0; i<p.length; i+=2) ps.push(new PolyK._P(p[i], p[i+1]));

          for(var i=0; i<ps.length; i++)
          {
              var isc = new PolyK._P(0,0);
              isc = PolyK._GetLineIntersection(a, b, ps[i], ps[(i+1)%ps.length], isc);

              if(isc)
              {
                  isc.flag = true;
                  iscs.push(isc);
                  ps.splice(i+1,0,isc);
                  i++;
              }
          }
          if(iscs.length == 0) return [p.slice(0)];
          var comp = function(u,v) {return PolyK._P.dist(a,u) - PolyK._P.dist(a,v); }
          iscs.sort(comp);

          var pgs = [];
          var dir = 0;
          while(iscs.length > 0)
          {
              var n = ps.length;
              var i0 = iscs[0];
              var i1 = iscs[1];
              var ind0 = ps.indexOf(i0);
              var ind1 = ps.indexOf(i1);
              var solved = false;

              if(PolyK._firstWithFlag(ps, ind0) == ind1) solved = true;
              else
              {
                  i0 = iscs[1];
                  i1 = iscs[0];
                  ind0 = ps.indexOf(i0);
                  ind1 = ps.indexOf(i1);
                  if(PolyK._firstWithFlag(ps, ind0) == ind1) solved = true;
              }
              if(solved)
              {
                  dir--;
                  var pgn = PolyK._getPoints(ps, ind0, ind1);
                  pgs.push(pgn);
                  ps = PolyK._getPoints(ps, ind1, ind0);
                  i0.flag = i1.flag = false;
                  iscs.splice(0,2);
                  if(iscs.length == 0) pgs.push(ps);
              }
              else { dir++; iscs.reverse(); }
              if(dir>1) break;
          }
          var result = [];
          for(var i=0; i<pgs.length; i++)
          {
              var pg = pgs[i];
              var npg = [];
              for(var j=0; j<pg.length; j++) npg.push(pg[j].x, pg[j].y);
              result.push(npg);
          }
          return result;
      }

      PolyK.Raycast = function(p, x, y, dx, dy, isc)
      {
          var l = p.length - 2;
          var tp = PolyK._tp;
          var a1 = tp[0], a2 = tp[1],
          b1 = tp[2], b2 = tp[3], c = tp[4];
          a1.x = x; a1.y = y;
          a2.x = x+dx; a2.y = y+dy;

          if(isc==null) isc = {dist:0, edge:0, norm:{x:0, y:0}, refl:{x:0, y:0}};
          isc.dist = Infinity;

          for(var i=0; i<l; i+=2)
          {
              b1.x = p[i  ];  b1.y = p[i+1];
              b2.x = p[i+2];  b2.y = p[i+3];
              var nisc = PolyK._RayLineIntersection(a1, a2, b1, b2, c);
              if(nisc) PolyK._updateISC(dx, dy, a1, b1, b2, c, i/2, isc);
          }
          b1.x = b2.x;  b1.y = b2.y;
          b2.x = p[0];  b2.y = p[1];
          var nisc = PolyK._RayLineIntersection(a1, a2, b1, b2, c);
          if(nisc) PolyK._updateISC(dx, dy, a1, b1, b2, c, p.length/2, isc);

          return (isc.dist != Infinity) ? isc : null;
      }

      PolyK.ClosestEdge = function(p, x, y, isc)
      {
          var l = p.length - 2;
          var tp = PolyK._tp;
          var a1 = tp[0],
          b1 = tp[2], b2 = tp[3], c = tp[4];
          a1.x = x; a1.y = y;

          if(isc==null) isc = {dist:0, edge:0, point:{x:0, y:0}, norm:{x:0, y:0}};
          isc.dist = Infinity;

          for(var i=0; i<l; i+=2)
          {
              b1.x = p[i  ];  b1.y = p[i+1];
              b2.x = p[i+2];  b2.y = p[i+3];
              PolyK._pointLineDist(a1, b1, b2, i>>1, isc);
          }
          b1.x = b2.x;  b1.y = b2.y;
          b2.x = p[0];  b2.y = p[1];
          PolyK._pointLineDist(a1, b1, b2, l>>1, isc);

          var idst = 1/isc.dist;
          isc.norm.x = (x-isc.point.x)*idst;
          isc.norm.y = (y-isc.point.y)*idst;
          return isc;
      }

      PolyK._pointLineDist = function(p, a, b, edge, isc)
      {
          var x = p.x, y = p.y, x1 = a.x, y1 = a.y, x2 = b.x, y2 = b.y;

          var A = x - x1;
          var B = y - y1;
          var C = x2 - x1;
          var D = y2 - y1;

          var dot = A * C + B * D;
          var len_sq = C * C + D * D;
          var param = dot / len_sq;

          var xx, yy;

          if (param < 0 || (x1 == x2 && y1 == y2)) {
              xx = x1;
              yy = y1;
          }
          else if (param > 1) {
              xx = x2;
              yy = y2;
          }
          else {
              xx = x1 + param * C;
              yy = y1 + param * D;
          }

          var dx = x - xx;
          var dy = y - yy;
          var dst = Math.sqrt(dx * dx + dy * dy);
          if(dst<isc.dist)
          {
              isc.dist = dst;
              isc.edge = edge;
              isc.point.x = xx;
              isc.point.y = yy;
          }
      }

      PolyK._updateISC = function(dx, dy, a1, b1, b2, c, edge, isc)
      {
          var nrl = PolyK._P.dist(a1, c);
          if(nrl<isc.dist)
          {
              var ibl = 1/PolyK._P.dist(b1, b2);
              var nx = -(b2.y-b1.y)*ibl;
              var ny =  (b2.x-b1.x)*ibl;
              var ddot = 2*(dx*nx+dy*ny);
              isc.dist = nrl;
              isc.norm.x = nx;
              isc.norm.y = ny;
              isc.refl.x = -ddot*nx+dx;
              isc.refl.y = -ddot*ny+dy;
              isc.edge = edge;
          }
      }

      PolyK._getPoints = function(ps, ind0, ind1)
      {
          var n = ps.length;
          var nps = [];
          if(ind1<ind0) ind1 += n;
          for(var i=ind0; i<= ind1; i++) nps.push(ps[i%n]);
          return nps;
      }

      PolyK._firstWithFlag = function(ps, ind)
      {
          var n = ps.length;
          while(true)
          {
              ind = (ind+1)%n;
              if(ps[ind].flag) return ind;
          }
      }
      */PolyK._PointInTriangle=function(px,py,ax,ay,bx,by,cx,cy){var v0x=cx-ax;var v0y=cy-ay;var v1x=bx-ax;var v1y=by-ay;var v2x=px-ax;var v2y=py-ay;var dot00=v0x*v0x+v0y*v0y;var dot01=v0x*v1x+v0y*v1y;var dot02=v0x*v2x+v0y*v2y;var dot11=v1x*v1x+v1y*v1y;var dot12=v1x*v2x+v1y*v2y;var invDenom=1/(dot00*dot11-dot01*dot01);var u=(dot11*dot02-dot01*dot12)*invDenom;var v=(dot00*dot12-dot01*dot02)*invDenom;// Check if point is in triangle
return u>=0&&v>=0&&u+v<1;};/*
      PolyK._RayLineIntersection = function(a1, a2, b1, b2, c)
      {
          var dax = (a1.x-a2.x), dbx = (b1.x-b2.x);
          var day = (a1.y-a2.y), dby = (b1.y-b2.y);

          var Den = dax*dby - day*dbx;
          if (Den == 0) return null;  // parallel

          var A = (a1.x * a2.y - a1.y * a2.x);
          var B = (b1.x * b2.y - b1.y * b2.x);

          var I = c;
          var iDen = 1/Den;
          I.x = ( A*dbx - dax*B ) * iDen;
          I.y = ( A*dby - day*B ) * iDen;

          if(!PolyK._InRect(I, b1, b2)) return null;
          if((day>0 && I.y>a1.y) || (day<0 && I.y<a1.y)) return null;
          if((dax>0 && I.x>a1.x) || (dax<0 && I.x<a1.x)) return null;
          return I;
      }

      PolyK._GetLineIntersection = function(a1, a2, b1, b2, c)
      {
          var dax = (a1.x-a2.x), dbx = (b1.x-b2.x);
          var day = (a1.y-a2.y), dby = (b1.y-b2.y);

          var Den = dax*dby - day*dbx;
          if (Den == 0) return null;  // parallel

          var A = (a1.x * a2.y - a1.y * a2.x);
          var B = (b1.x * b2.y - b1.y * b2.x);

          var I = c;
          I.x = ( A*dbx - dax*B ) / Den;
          I.y = ( A*dby - day*B ) / Den;

          if(PolyK._InRect(I, a1, a2) && PolyK._InRect(I, b1, b2)) return I;
          return null;
      }

      PolyK._InRect = function(a, b, c)
      {
          if  (b.x == c.x) return (a.y>=Math.min(b.y, c.y) && a.y<=Math.max(b.y, c.y));
          if  (b.y == c.y) return (a.x>=Math.min(b.x, c.x) && a.x<=Math.max(b.x, c.x));

          if(a.x >= Math.min(b.x, c.x) && a.x <= Math.max(b.x, c.x)
          && a.y >= Math.min(b.y, c.y) && a.y <= Math.max(b.y, c.y))
          return true;
          return false;
      }
      */PolyK._convex=function(ax,ay,bx,by,cx,cy){return(ay-by)*(cx-bx)+(bx-ax)*(cy-by)>=0;};/*
      PolyK._P = function(x,y)
      {
          this.x = x;
          this.y = y;
          this.flag = false;
      }
      PolyK._P.prototype.toString = function()
      {
          return "Point ["+this.x+", "+this.y+"]";
      }
      PolyK._P.dist = function(a,b)
      {
          var dx = b.x-a.x;
          var dy = b.y-a.y;
          return Math.sqrt(dx*dx + dy*dy);
      }

      PolyK._tp = [];
      for(var i=0; i<10; i++) PolyK._tp.push(new PolyK._P(0,0));
          */var polyk=PolyK;var Convex_1=Convex;/**
   * Convex shape class.
   * @class Convex
   * @constructor
   * @extends Shape
   * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
   * @param {Array} [options.vertices] An array of vertices that span this shape. Vertices are given in counter-clockwise (CCW) direction.
   * @param {Array} [options.axes] An array of unit length vectors, representing the symmetry axes in the convex.
   * @example
   *     // Create a box
   *     var vertices = [[-1,-1], [1,-1], [1,1], [-1,1]];
   *     var convexShape = new Convex({ vertices: vertices });
   *     body.addShape(convexShape);
   */function Convex(options){if(Array.isArray(arguments[0])){options={vertices:arguments[0],axes:arguments[1]};console.warn('The Convex constructor signature has changed. Please use the following format: new Convex({ vertices: [...], ... })');}options=options||{};/**
       * Vertices defined in the local frame.
       * @property vertices
       * @type {Array}
       */this.vertices=[];// Copy the verts
var vertices=options.vertices!==undefined?options.vertices:[];for(var i=0;i<vertices.length;i++){var v=vec2_1.create();vec2_1.copy(v,vertices[i]);this.vertices.push(v);}/**
       * Axes defined in the local frame.
       * @property axes
       * @type {Array}
       */this.axes=[];if(options.axes){// Copy the axes
for(var i=0;i<options.axes.length;i++){var axis=vec2_1.create();vec2_1.copy(axis,options.axes[i]);this.axes.push(axis);}}else{// Construct axes from the vertex data
for(var i=0;i<this.vertices.length;i++){// Get the world edge
var worldPoint0=this.vertices[i];var worldPoint1=this.vertices[(i+1)%this.vertices.length];var normal=vec2_1.create();vec2_1.sub(normal,worldPoint1,worldPoint0);// Get normal - just rotate 90 degrees since vertices are given in CCW
vec2_1.rotate90cw(normal,normal);vec2_1.normalize(normal,normal);this.axes.push(normal);}}/**
       * The center of mass of the Convex
       * @property centerOfMass
       * @type {Array}
       */this.centerOfMass=vec2_1.fromValues(0,0);/**
       * Triangulated version of this convex. The structure is Array of 3-Arrays, and each subarray contains 3 integers, referencing the vertices.
       * @property triangles
       * @type {Array}
       */this.triangles=[];if(this.vertices.length){this.updateTriangles();this.updateCenterOfMass();}/**
       * The bounding radius of the convex
       * @property boundingRadius
       * @type {Number}
       */this.boundingRadius=0;options.type=Shape_1.CONVEX;Shape_1.call(this,options);this.updateBoundingRadius();this.updateArea();if(this.area<0){throw new Error("Convex vertices must be given in conter-clockwise winding.");}}Convex.prototype=new Shape_1();Convex.prototype.constructor=Convex;var tmpVec1=vec2_1.create();var tmpVec2=vec2_1.create();/**
   * Project a Convex onto a world-oriented axis
   * @method projectOntoAxis
   * @static
   * @param  {Array} offset
   * @param  {Array} localAxis
   * @param  {Array} result
   */Convex.prototype.projectOntoLocalAxis=function(localAxis,result){var max=null,min=null,v,value,localAxis=tmpVec1;// Get projected position of all vertices
for(var i=0;i<this.vertices.length;i++){v=this.vertices[i];value=vec2_1.dot(v,localAxis);if(max===null||value>max){max=value;}if(min===null||value<min){min=value;}}if(min>max){var t=min;min=max;max=t;}vec2_1.set(result,min,max);};Convex.prototype.projectOntoWorldAxis=function(localAxis,shapeOffset,shapeAngle,result){var worldAxis=tmpVec2;this.projectOntoLocalAxis(localAxis,result);// Project the position of the body onto the axis - need to add this to the result
if(shapeAngle!==0){vec2_1.rotate(worldAxis,localAxis,shapeAngle);}else{worldAxis=localAxis;}var offset=vec2_1.dot(shapeOffset,worldAxis);vec2_1.set(result,result[0]+offset,result[1]+offset);};/**
   * Update the .triangles property
   * @method updateTriangles
   */Convex.prototype.updateTriangles=function(){this.triangles.length=0;// Rewrite on polyk notation, array of numbers
var polykVerts=[];for(var i=0;i<this.vertices.length;i++){var v=this.vertices[i];polykVerts.push(v[0],v[1]);}// Triangulate
var triangles=polyk.Triangulate(polykVerts);// Loop over all triangles, add their inertia contributions to I
for(var i=0;i<triangles.length;i+=3){var id1=triangles[i],id2=triangles[i+1],id3=triangles[i+2];// Add to triangles
this.triangles.push([id1,id2,id3]);}};var updateCenterOfMass_centroid=vec2_1.create(),updateCenterOfMass_centroid_times_mass=vec2_1.create(),updateCenterOfMass_a=vec2_1.create(),updateCenterOfMass_b=vec2_1.create(),updateCenterOfMass_c=vec2_1.create(),updateCenterOfMass_ac=vec2_1.create(),updateCenterOfMass_ca=vec2_1.create(),updateCenterOfMass_cb=vec2_1.create(),updateCenterOfMass_n=vec2_1.create();/**
   * Update the .centerOfMass property.
   * @method updateCenterOfMass
   */Convex.prototype.updateCenterOfMass=function(){var triangles=this.triangles,verts=this.vertices,cm=this.centerOfMass,centroid=updateCenterOfMass_centroid,a=updateCenterOfMass_a,b=updateCenterOfMass_b,c=updateCenterOfMass_c,centroid_times_mass=updateCenterOfMass_centroid_times_mass;vec2_1.set(cm,0,0);var totalArea=0;for(var i=0;i!==triangles.length;i++){var t=triangles[i],a=verts[t[0]],b=verts[t[1]],c=verts[t[2]];vec2_1.centroid(centroid,a,b,c);// Get mass for the triangle (density=1 in this case)
// http://math.stackexchange.com/questions/80198/area-of-triangle-via-vectors
var m=Convex.triangleArea(a,b,c);totalArea+=m;// Add to center of mass
vec2_1.scale(centroid_times_mass,centroid,m);vec2_1.add(cm,cm,centroid_times_mass);}vec2_1.scale(cm,cm,1/totalArea);};/**
   * Compute the mass moment of inertia of the Convex.
   * @method computeMomentOfInertia
   * @param  {Number} mass
   * @return {Number}
   * @see http://www.gamedev.net/topic/342822-moment-of-inertia-of-a-polygon-2d/
   */Convex.prototype.computeMomentOfInertia=function(mass){var denom=0.0,numer=0.0,N=this.vertices.length;for(var j=N-1,i=0;i<N;j=i,i++){var p0=this.vertices[j];var p1=this.vertices[i];var a=Math.abs(vec2_1.crossLength(p0,p1));var b=vec2_1.dot(p1,p1)+vec2_1.dot(p1,p0)+vec2_1.dot(p0,p0);denom+=a*b;numer+=a;}return mass/6.0*(denom/numer);};/**
   * Updates the .boundingRadius property
   * @method updateBoundingRadius
   */Convex.prototype.updateBoundingRadius=function(){var verts=this.vertices,r2=0;for(var i=0;i!==verts.length;i++){var l2=vec2_1.squaredLength(verts[i]);if(l2>r2){r2=l2;}}this.boundingRadius=Math.sqrt(r2);};/**
   * Get the area of the triangle spanned by the three points a, b, c. The area is positive if the points are given in counter-clockwise order, otherwise negative.
   * @static
   * @method triangleArea
   * @param {Array} a
   * @param {Array} b
   * @param {Array} c
   * @return {Number}
   */Convex.triangleArea=function(a,b,c){return((b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]))*0.5;};/**
   * Update the .area
   * @method updateArea
   */Convex.prototype.updateArea=function(){this.updateTriangles();this.area=0;var triangles=this.triangles,verts=this.vertices;for(var i=0;i!==triangles.length;i++){var t=triangles[i],a=verts[t[0]],b=verts[t[1]],c=verts[t[2]];// Get mass for the triangle (density=1 in this case)
var m=Convex.triangleArea(a,b,c);this.area+=m;}};/**
   * @method computeAABB
   * @param  {AABB}   out
   * @param  {Array}  position
   * @param  {Number} angle
   */Convex.prototype.computeAABB=function(out,position,angle){out.setFromPoints(this.vertices,position,angle,0);};var intersectConvex_rayStart=vec2_1.create();var intersectConvex_rayEnd=vec2_1.create();var intersectConvex_normal=vec2_1.create();/**
   * @method raycast
   * @param  {RaycastResult} result
   * @param  {Ray} ray
   * @param  {array} position
   * @param  {number} angle
   */Convex.prototype.raycast=function(result,ray,position,angle){var rayStart=intersectConvex_rayStart;var rayEnd=intersectConvex_rayEnd;var normal=intersectConvex_normal;var vertices=this.vertices;// Transform to local shape space
vec2_1.toLocalFrame(rayStart,ray.from,position,angle);vec2_1.toLocalFrame(rayEnd,ray.to,position,angle);var n=vertices.length;for(var i=0;i<n&&!result.shouldStop(ray);i++){var q1=vertices[i];var q2=vertices[(i+1)%n];var delta=vec2_1.getLineSegmentsIntersectionFraction(rayStart,rayEnd,q1,q2);if(delta>=0){vec2_1.sub(normal,q2,q1);vec2_1.rotate(normal,normal,-Math.PI/2+angle);vec2_1.normalize(normal,normal);ray.reportIntersection(result,delta,normal,i);}}};var Ray_1=Ray;/**
   * A line with a start and end point that is used to intersect shapes. For an example, see {{#crossLink "World/raycast:method"}}World.raycast{{/crossLink}}
   * @class Ray
   * @constructor
   * @param {object} [options]
   * @param {array} [options.from]
   * @param {array} [options.to]
   * @param {boolean} [options.checkCollisionResponse=true]
   * @param {boolean} [options.skipBackfaces=false]
   * @param {number} [options.collisionMask=-1]
   * @param {number} [options.collisionGroup=-1]
   * @param {number} [options.mode=Ray.ANY]
   * @param {number} [options.callback]
   */function Ray(options){options=options||{};/**
       * Ray start point.
       * @property {array} from
       */this.from=options.from?vec2_1.fromValues(options.from[0],options.from[1]):vec2_1.create();/**
       * Ray end point
       * @property {array} to
       */this.to=options.to?vec2_1.fromValues(options.to[0],options.to[1]):vec2_1.create();/**
       * Set to true if you want the Ray to take .collisionResponse flags into account on bodies and shapes.
       * @property {Boolean} checkCollisionResponse
       */this.checkCollisionResponse=options.checkCollisionResponse!==undefined?options.checkCollisionResponse:true;/**
       * If set to true, the ray skips any hits with normal.dot(rayDirection) < 0.
       * @property {Boolean} skipBackfaces
       */this.skipBackfaces=!!options.skipBackfaces;/**
       * @property {number} collisionMask
       * @default -1
       */this.collisionMask=options.collisionMask!==undefined?options.collisionMask:-1;/**
       * @property {number} collisionGroup
       * @default -1
       */this.collisionGroup=options.collisionGroup!==undefined?options.collisionGroup:-1;/**
       * The intersection mode. Should be {{#crossLink "Ray/ANY:property"}}Ray.ANY{{/crossLink}}, {{#crossLink "Ray/ALL:property"}}Ray.ALL{{/crossLink}} or {{#crossLink "Ray/CLOSEST:property"}}Ray.CLOSEST{{/crossLink}}.
       * @property {number} mode
       */this.mode=options.mode!==undefined?options.mode:Ray.ANY;/**
       * Current, user-provided result callback. Will be used if mode is Ray.ALL.
       * @property {Function} callback
       */this.callback=options.callback||function(result){};/**
       * @readOnly
       * @property {array} direction
       */this.direction=vec2_1.create();/**
       * Length of the ray
       * @readOnly
       * @property {number} length
       */this.length=1;this.update();}Ray.prototype.constructor=Ray;/**
   * This raycasting mode will make the Ray traverse through all intersection points and only return the closest one.
   * @static
   * @property {Number} CLOSEST
   */Ray.CLOSEST=1;/**
   * This raycasting mode will make the Ray stop when it finds the first intersection point.
   * @static
   * @property {Number} ANY
   */Ray.ANY=2;/**
   * This raycasting mode will traverse all intersection points and executes a callback for each one.
   * @static
   * @property {Number} ALL
   */Ray.ALL=4;/**
   * Should be called if you change the from or to point.
   * @method update
   */Ray.prototype.update=function(){// Update .direction and .length
var d=this.direction;vec2_1.sub(d,this.to,this.from);this.length=vec2_1.length(d);vec2_1.normalize(d,d);};/**
   * @method intersectBodies
   * @param {Array} bodies An array of Body objects.
   */Ray.prototype.intersectBodies=function(result,bodies){for(var i=0,l=bodies.length;!result.shouldStop(this)&&i<l;i++){var body=bodies[i];var aabb=body.getAABB();if(aabb.overlapsRay(this)>=0||aabb.containsPoint(this.from)){this.intersectBody(result,body);}}};var intersectBody_worldPosition=vec2_1.create();/**
   * Shoot a ray at a body, get back information about the hit.
   * @method intersectBody
   * @private
   * @param {Body} body
   */Ray.prototype.intersectBody=function(result,body){var checkCollisionResponse=this.checkCollisionResponse;if(checkCollisionResponse&&!body.collisionResponse){return;}var worldPosition=intersectBody_worldPosition;for(var i=0,N=body.shapes.length;i<N;i++){var shape=body.shapes[i];if(checkCollisionResponse&&!shape.collisionResponse){continue;// Skip
}if((this.collisionGroup&shape.collisionMask)===0||(shape.collisionGroup&this.collisionMask)===0){continue;}// Get world angle and position of the shape
vec2_1.rotate(worldPosition,shape.position,body.angle);vec2_1.add(worldPosition,worldPosition,body.position);var worldAngle=shape.angle+body.angle;this.intersectShape(result,shape,worldAngle,worldPosition,body);if(result.shouldStop(this)){break;}}};/**
   * @method intersectShape
   * @private
   * @param {Shape} shape
   * @param {number} angle
   * @param {array} position
   * @param {Body} body
   */Ray.prototype.intersectShape=function(result,shape,angle,position,body){var from=this.from;// Checking radius
var distance=distanceFromIntersectionSquared(from,this.direction,position);if(distance>shape.boundingRadius*shape.boundingRadius){return;}this._currentBody=body;this._currentShape=shape;shape.raycast(result,this,position,angle);this._currentBody=this._currentShape=null;};/**
   * Get the AABB of the ray.
   * @method getAABB
   * @param  {AABB} aabb
   */Ray.prototype.getAABB=function(result){var to=this.to;var from=this.from;vec2_1.set(result.lowerBound,Math.min(to[0],from[0]),Math.min(to[1],from[1]));vec2_1.set(result.upperBound,Math.max(to[0],from[0]),Math.max(to[1],from[1]));};var hitPointWorld=vec2_1.create();/**
   * @method reportIntersection
   * @private
   * @param  {number} fraction
   * @param  {array} normal
   * @param  {number} [faceIndex=-1]
   * @return {boolean} True if the intersections should continue
   */Ray.prototype.reportIntersection=function(result,fraction,normal,faceIndex){var from=this.from;var to=this.to;var shape=this._currentShape;var body=this._currentBody;// Skip back faces?
if(this.skipBackfaces&&vec2_1.dot(normal,this.direction)>0){return;}switch(this.mode){case Ray.ALL:result.set(normal,shape,body,fraction,faceIndex);this.callback(result);break;case Ray.CLOSEST:// Store if closer than current closest
if(fraction<result.fraction||!result.hasHit()){result.set(normal,shape,body,fraction,faceIndex);}break;case Ray.ANY:// Report and stop.
result.set(normal,shape,body,fraction,faceIndex);break;}};var v0=vec2_1.create(),intersect=vec2_1.create();function distanceFromIntersectionSquared(from,direction,position){// v0 is vector from from to position
vec2_1.sub(v0,position,from);var dot=vec2_1.dot(v0,direction);// intersect = direction * dot + from
vec2_1.scale(intersect,direction,dot);vec2_1.add(intersect,intersect,from);return vec2_1.squaredDistance(position,intersect);}var RaycastResult_1=RaycastResult;/**
   * Storage for Ray casting hit data.
   * @class RaycastResult
   * @constructor
   */function RaycastResult(){/**
  	 * The normal of the hit, oriented in world space.
  	 * @property {array} normal
  	 */this.normal=vec2_1.create();/**
  	 * The hit shape, or null.
  	 * @property {Shape} shape
  	 */this.shape=null;/**
  	 * The hit body, or null.
  	 * @property {Body} body
  	 */this.body=null;/**
  	 * The index of the hit triangle, if the hit shape was indexable.
  	 * @property {number} faceIndex
  	 * @default -1
  	 */this.faceIndex=-1;/**
  	 * Distance to the hit, as a fraction. 0 is at the "from" point, 1 is at the "to" point. Will be set to -1 if there was no hit yet.
  	 * @property {number} fraction
  	 * @default -1
  	 */this.fraction=-1;/**
  	 * If the ray should stop traversing.
  	 * @readonly
  	 * @property {Boolean} isStopped
  	 */this.isStopped=false;}/**
   * Reset all result data. Must be done before re-using the result object.
   * @method reset
   */RaycastResult.prototype.reset=function(){vec2_1.set(this.normal,0,0);this.shape=null;this.body=null;this.faceIndex=-1;this.fraction=-1;this.isStopped=false;};/**
   * Get the distance to the hit point.
   * @method getHitDistance
   * @param {Ray} ray
   */RaycastResult.prototype.getHitDistance=function(ray){return vec2_1.distance(ray.from,ray.to)*this.fraction;};/**
   * Returns true if the ray hit something since the last reset().
   * @method hasHit
   */RaycastResult.prototype.hasHit=function(){return this.fraction!==-1;};/**
   * Get world hit point.
   * @method getHitPoint
   * @param {array} out
   * @param {Ray} ray
   */RaycastResult.prototype.getHitPoint=function(out,ray){vec2_1.lerp(out,ray.from,ray.to,this.fraction);};/**
   * Can be called while iterating over hits to stop searching for hit points.
   * @method stop
   */RaycastResult.prototype.stop=function(){this.isStopped=true;};/**
   * @method shouldStop
   * @private
   * @param {Ray} ray
   * @return {boolean}
   */RaycastResult.prototype.shouldStop=function(ray){return this.isStopped||this.fraction!==-1&&ray.mode===Ray_1.ANY;};/**
   * @method set
   * @private
   * @param {array} normal
   * @param {Shape} shape
   * @param {Body} body
   * @param {number} fraction
   */RaycastResult.prototype.set=function(normal,shape,body,fraction,faceIndex){vec2_1.copy(this.normal,normal);this.shape=shape;this.body=body;this.fraction=fraction;this.faceIndex=faceIndex;};/**
   * Base class for objects that dispatches events.
   * @class EventEmitter
   * @constructor
   */var EventEmitter=function EventEmitter(){};var EventEmitter_1=EventEmitter;EventEmitter.prototype={constructor:EventEmitter,/**
       * Add an event listener
       * @method on
       * @param  {String} type
       * @param  {Function} listener
       * @return {EventEmitter} The self object, for chainability.
       */on:function on(type,listener,context){listener.context=context||this;if(this._listeners===undefined){this._listeners={};}var listeners=this._listeners;if(listeners[type]===undefined){listeners[type]=[];}if(listeners[type].indexOf(listener)===-1){listeners[type].push(listener);}return this;},/**
       * Check if an event listener is added
       * @method has
       * @param  {String} type
       * @param  {Function} listener
       * @return {Boolean}
       */has:function has(type,listener){if(this._listeners===undefined){return false;}var listeners=this._listeners;if(listener){if(listeners[type]!==undefined&&listeners[type].indexOf(listener)!==-1){return true;}}else{if(listeners[type]!==undefined){return true;}}return false;},/**
       * Remove an event listener
       * @method off
       * @param  {String} type
       * @param  {Function} listener
       * @return {EventEmitter} The self object, for chainability.
       */off:function off(type,listener){if(this._listeners===undefined){return this;}var listeners=this._listeners;var index=listeners[type].indexOf(listener);if(index!==-1){listeners[type].splice(index,1);}return this;},/**
       * Emit an event.
       * @method emit
       * @param  {Object} event
       * @param  {String} event.type
       * @return {EventEmitter} The self object, for chainability.
       */emit:function emit(event){if(this._listeners===undefined){return this;}var listeners=this._listeners;var listenerArray=listeners[event.type];if(listenerArray!==undefined){event.target=this;for(var i=0,l=listenerArray.length;i<l;i++){var listener=listenerArray[i];listener.call(listener.context,event);}}return this;}};var Body_1=Body;/**
   * A rigid body. Has got a center of mass, position, velocity and a number of
   * shapes that are used for collisions.
   *
   * @class Body
   * @constructor
   * @extends EventEmitter
   * @param {Object} [options]
   * @param {Array} [options.force]
   * @param {Array} [options.position]
   * @param {Array} [options.velocity]
   * @param {Boolean} [options.allowSleep]
   * @param {Boolean} [options.collisionResponse]
   * @param {Number} [options.angle=0]
   * @param {Number} [options.angularForce=0]
   * @param {Number} [options.angularVelocity=0]
   * @param {Number} [options.ccdIterations=10]
   * @param {Number} [options.ccdSpeedThreshold=-1]
   * @param {Number} [options.fixedRotation=false]
   * @param {Number} [options.gravityScale]
   * @param {Number} [options.id]
   * @param {Number} [options.mass=0] A number >= 0. If zero, the .type will be set to Body.STATIC.
   * @param {Number} [options.sleepSpeedLimit]
   * @param {Number} [options.sleepTimeLimit]
   *
   * @example
   *
   *     // Create a typical dynamic body
   *     var body = new Body({
   *         mass: 1,
   *         position: [0, 0],
   *         angle: 0,
   *         velocity: [0, 0],
   *         angularVelocity: 0
   *     });
   *
   *     // Add a circular shape to the body
   *     body.addShape(new Circle({ radius: 1 }));
   *
   *     // Add the body to the world
   *     world.addBody(body);
   */function Body(options){options=options||{};EventEmitter_1.call(this);/**
       * The body identifyer
       * @property id
       * @type {Number}
       */this.id=options.id||++Body._idCounter;/**
       * The world that this body is added to. This property is set to NULL if the body is not added to any world.
       * @property world
       * @type {World}
       */this.world=null;/**
       * The shapes of the body.
       *
       * @property shapes
       * @type {Array}
       */this.shapes=[];/**
       * The mass of the body.
       * @property mass
       * @type {number}
       */this.mass=options.mass||0;/**
       * The inverse mass of the body.
       * @property invMass
       * @type {number}
       */this.invMass=0;/**
       * The inertia of the body around the Z axis.
       * @property inertia
       * @type {number}
       */this.inertia=0;/**
       * The inverse inertia of the body.
       * @property invInertia
       * @type {number}
       */this.invInertia=0;this.invMassSolve=0;this.invInertiaSolve=0;/**
       * Set to true if you want to fix the rotation of the body.
       * @property fixedRotation
       * @type {Boolean}
       */this.fixedRotation=!!options.fixedRotation;/**
       * Set to true if you want to fix the body movement along the X axis. The body will still be able to move along Y.
       * @property {Boolean} fixedX
       */this.fixedX=!!options.fixedX;/**
       * Set to true if you want to fix the body movement along the Y axis. The body will still be able to move along X.
       * @property {Boolean} fixedY
       */this.fixedY=!!options.fixedY;/**
       * @private
       * @property {array} massMultiplier
       */this.massMultiplier=vec2_1.create();/**
       * The position of the body
       * @property position
       * @type {Array}
       */this.position=vec2_1.fromValues(0,0);if(options.position){vec2_1.copy(this.position,options.position);}/**
       * The interpolated position of the body. Use this for rendering.
       * @property interpolatedPosition
       * @type {Array}
       */this.interpolatedPosition=vec2_1.fromValues(0,0);/**
       * The interpolated angle of the body. Use this for rendering.
       * @property interpolatedAngle
       * @type {Number}
       */this.interpolatedAngle=0;/**
       * The previous position of the body.
       * @property previousPosition
       * @type {Array}
       */this.previousPosition=vec2_1.fromValues(0,0);/**
       * The previous angle of the body.
       * @property previousAngle
       * @type {Number}
       */this.previousAngle=0;/**
       * The current velocity of the body.
       * @property velocity
       * @type {Array}
       */this.velocity=vec2_1.fromValues(0,0);if(options.velocity){vec2_1.copy(this.velocity,options.velocity);}/**
       * Constraint velocity that was added to the body during the last step.
       * @property vlambda
       * @type {Array}
       */this.vlambda=vec2_1.fromValues(0,0);/**
       * Angular constraint velocity that was added to the body during last step.
       * @property wlambda
       * @type {Array}
       */this.wlambda=0;/**
       * The angle of the body, in radians.
       * @property angle
       * @type {number}
       * @example
       *     // The angle property is not normalized to the interval 0 to 2*pi, it can be any value.
       *     // If you need a value between 0 and 2*pi, use the following function to normalize it.
       *     function normalizeAngle(angle){
       *         angle = angle % (2*Math.PI);
       *         if(angle < 0){
       *             angle += (2*Math.PI);
       *         }
       *         return angle;
       *     }
       */this.angle=options.angle||0;/**
       * The angular velocity of the body, in radians per second.
       * @property angularVelocity
       * @type {number}
       */this.angularVelocity=options.angularVelocity||0;/**
       * The force acting on the body. Since the body force (and {{#crossLink "Body/angularForce:property"}}{{/crossLink}}) will be zeroed after each step, so you need to set the force before each step.
       * @property force
       * @type {Array}
       *
       * @example
       *     // This produces a forcefield of 1 Newton in the positive x direction.
       *     for(var i=0; i<numSteps; i++){
       *         body.force[0] = 1;
       *         world.step(1/60);
       *     }
       *
       * @example
       *     // This will apply a rotational force on the body
       *     for(var i=0; i<numSteps; i++){
       *         body.angularForce = -3;
       *         world.step(1/60);
       *     }
       */this.force=vec2_1.create();if(options.force){vec2_1.copy(this.force,options.force);}/**
       * The angular force acting on the body. See {{#crossLink "Body/force:property"}}{{/crossLink}}.
       * @property angularForce
       * @type {number}
       */this.angularForce=options.angularForce||0;/**
       * The linear damping acting on the body in the velocity direction. Should be a value between 0 and 1.
       * @property damping
       * @type {Number}
       * @default 0.1
       */this.damping=typeof options.damping==="number"?options.damping:0.1;/**
       * The angular force acting on the body. Should be a value between 0 and 1.
       * @property angularDamping
       * @type {Number}
       * @default 0.1
       */this.angularDamping=typeof options.angularDamping==="number"?options.angularDamping:0.1;/**
       * The type of motion this body has. Should be one of: {{#crossLink "Body/STATIC:property"}}Body.STATIC{{/crossLink}}, {{#crossLink "Body/DYNAMIC:property"}}Body.DYNAMIC{{/crossLink}} and {{#crossLink "Body/KINEMATIC:property"}}Body.KINEMATIC{{/crossLink}}.
       *
       * * Static bodies do not move, and they do not respond to forces or collision.
       * * Dynamic bodies body can move and respond to collisions and forces.
       * * Kinematic bodies only moves according to its .velocity, and does not respond to collisions or force.
       *
       * @property type
       * @type {number}
       *
       * @example
       *     // Bodies are static by default. Static bodies will never move.
       *     var body = new Body();
       *     console.log(body.type == Body.STATIC); // true
       *
       * @example
       *     // By setting the mass of a body to a nonzero number, the body
       *     // will become dynamic and will move and interact with other bodies.
       *     var dynamicBody = new Body({
       *         mass : 1
       *     });
       *     console.log(dynamicBody.type == Body.DYNAMIC); // true
       *
       * @example
       *     // Kinematic bodies will only move if you change their velocity.
       *     var kinematicBody = new Body({
       *         type: Body.KINEMATIC // Type can be set via the options object.
       *     });
       */this.type=Body.STATIC;if(typeof options.type!=='undefined'){this.type=options.type;}else if(!options.mass){this.type=Body.STATIC;}else{this.type=Body.DYNAMIC;}/**
       * Bounding circle radius.
       * @property boundingRadius
       * @type {Number}
       */this.boundingRadius=0;/**
       * Bounding box of this body.
       * @property aabb
       * @type {AABB}
       */this.aabb=new AABB_1();/**
       * Indicates if the AABB needs update. Update it with {{#crossLink "Body/updateAABB:method"}}.updateAABB(){{/crossLink}}.
       * @property aabbNeedsUpdate
       * @type {Boolean}
       * @see updateAABB
       *
       * @example
       *     // Force update the AABB
       *     body.aabbNeedsUpdate = true;
       *     body.updateAABB();
       *     console.log(body.aabbNeedsUpdate); // false
       */this.aabbNeedsUpdate=true;/**
       * If true, the body will automatically fall to sleep. Note that you need to enable sleeping in the {{#crossLink "World"}}{{/crossLink}} before anything will happen.
       * @property allowSleep
       * @type {Boolean}
       * @default true
       */this.allowSleep=options.allowSleep!==undefined?options.allowSleep:true;this.wantsToSleep=false;/**
       * One of {{#crossLink "Body/AWAKE:property"}}Body.AWAKE{{/crossLink}}, {{#crossLink "Body/SLEEPY:property"}}Body.SLEEPY{{/crossLink}} and {{#crossLink "Body/SLEEPING:property"}}Body.SLEEPING{{/crossLink}}.
       *
       * The body is initially Body.AWAKE. If its velocity norm is below .sleepSpeedLimit, the sleepState will become Body.SLEEPY. If the body continues to be Body.SLEEPY for .sleepTimeLimit seconds, it will fall asleep (Body.SLEEPY).
       *
       * @property sleepState
       * @type {Number}
       * @default Body.AWAKE
       */this.sleepState=Body.AWAKE;/**
       * If the speed (the norm of the velocity) is smaller than this value, the body is considered sleepy.
       * @property sleepSpeedLimit
       * @type {Number}
       * @default 0.2
       */this.sleepSpeedLimit=options.sleepSpeedLimit!==undefined?options.sleepSpeedLimit:0.2;/**
       * If the body has been sleepy for this sleepTimeLimit seconds, it is considered sleeping.
       * @property sleepTimeLimit
       * @type {Number}
       * @default 1
       */this.sleepTimeLimit=options.sleepTimeLimit!==undefined?options.sleepTimeLimit:1;/**
       * Gravity scaling factor. If you want the body to ignore gravity, set this to zero. If you want to reverse gravity, set it to -1.
       * @property {Number} gravityScale
       * @default 1
       */this.gravityScale=options.gravityScale!==undefined?options.gravityScale:1;/**
       * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled. That means that this body will move through other bodies, but it will still trigger contact events, etc.
       * @property {Boolean} collisionResponse
       */this.collisionResponse=options.collisionResponse!==undefined?options.collisionResponse:true;/**
       * How long the body has been sleeping.
       * @property {Number} idleTime
       */this.idleTime=0;/**
       * The last time when the body went to SLEEPY state.
       * @property {Number} timeLastSleepy
       * @private
       */this.timeLastSleepy=0;/**
       * If the body speed exceeds this threshold, CCD (continuous collision detection) will be enabled. Set it to a negative number to disable CCD completely for this body.
       * @property {number} ccdSpeedThreshold
       * @default -1
       */this.ccdSpeedThreshold=options.ccdSpeedThreshold!==undefined?options.ccdSpeedThreshold:-1;/**
       * The number of iterations that should be used when searching for the time of impact during CCD. A larger number will assure that there's a small penetration on CCD collision, but a small number will give more performance.
       * @property {number} ccdIterations
       * @default 10
       */this.ccdIterations=options.ccdIterations!==undefined?options.ccdIterations:10;this.concavePath=null;this._wakeUpAfterNarrowphase=false;this.updateMassProperties();}Body.prototype=new EventEmitter_1();Body.prototype.constructor=Body;Body._idCounter=0;/**
   * @private
   * @method updateSolveMassProperties
   */Body.prototype.updateSolveMassProperties=function(){if(this.sleepState===Body.SLEEPING||this.type===Body.KINEMATIC){this.invMassSolve=0;this.invInertiaSolve=0;}else{this.invMassSolve=this.invMass;this.invInertiaSolve=this.invInertia;}};/**
   * Set the total density of the body
   * @method setDensity
   * @param {number} density
   */Body.prototype.setDensity=function(density){var totalArea=this.getArea();this.mass=totalArea*density;this.updateMassProperties();};/**
   * Get the total area of all shapes in the body
   * @method getArea
   * @return {Number}
   */Body.prototype.getArea=function(){var totalArea=0;for(var i=0;i<this.shapes.length;i++){totalArea+=this.shapes[i].area;}return totalArea;};/**
   * Get the AABB from the body. The AABB is updated if necessary.
   * @method getAABB
   * @return {AABB} The AABB instance (this.aabb)
   */Body.prototype.getAABB=function(){if(this.aabbNeedsUpdate){this.updateAABB();}return this.aabb;};var shapeAABB=new AABB_1(),tmp$1=vec2_1.create();/**
   * Updates the AABB of the Body, and set .aabbNeedsUpdate = false.
   * @method updateAABB
   */Body.prototype.updateAABB=function(){var shapes=this.shapes,N=shapes.length,offset=tmp$1,bodyAngle=this.angle;for(var i=0;i!==N;i++){var shape=shapes[i],angle=shape.angle+bodyAngle;// Get shape world offset
vec2_1.rotate(offset,shape.position,bodyAngle);vec2_1.add(offset,offset,this.position);// Get shape AABB
shape.computeAABB(shapeAABB,offset,angle);if(i===0){this.aabb.copy(shapeAABB);}else{this.aabb.extend(shapeAABB);}}this.aabbNeedsUpdate=false;};/**
   * Update the bounding radius of the body (this.boundingRadius). Should be done if any of the shape dimensions or positions are changed.
   * @method updateBoundingRadius
   */Body.prototype.updateBoundingRadius=function(){var shapes=this.shapes,N=shapes.length,radius=0;for(var i=0;i!==N;i++){var shape=shapes[i],offset=vec2_1.length(shape.position),r=shape.boundingRadius;if(offset+r>radius){radius=offset+r;}}this.boundingRadius=radius;};/**
   * Add a shape to the body. You can pass a local transform when adding a shape,
   * so that the shape gets an offset and angle relative to the body center of mass.
   * Will automatically update the mass properties and bounding radius.
   *
   * @method addShape
   * @param  {Shape}              shape
   * @param  {Array} [offset] Local body offset of the shape.
   * @param  {Number}             [angle]  Local body angle.
   *
   * @example
   *     var body = new Body(),
   *         shape = new Circle({ radius: 1 });
   *
   *     // Add the shape to the body, positioned in the center
   *     body.addShape(shape);
   *
   *     // Add another shape to the body, positioned 1 unit length from the body center of mass along the local x-axis.
   *     body.addShape(shape,[1,0]);
   *
   *     // Add another shape to the body, positioned 1 unit length from the body center of mass along the local y-axis, and rotated 90 degrees CCW.
   *     body.addShape(shape,[0,1],Math.PI/2);
   */Body.prototype.addShape=function(shape,offset,angle){if(shape.body){throw new Error('A shape can only be added to one body.');}shape.body=this;// Copy the offset vector
if(offset){vec2_1.copy(shape.position,offset);}else{vec2_1.set(shape.position,0,0);}shape.angle=angle||0;this.shapes.push(shape);this.updateMassProperties();this.updateBoundingRadius();this.aabbNeedsUpdate=true;};/**
   * Remove a shape
   * @method removeShape
   * @param  {Shape} shape
   * @return {Boolean} True if the shape was found and removed, else false.
   */Body.prototype.removeShape=function(shape){var idx=this.shapes.indexOf(shape);if(idx!==-1){this.shapes.splice(idx,1);this.aabbNeedsUpdate=true;shape.body=null;return true;}else{return false;}};/**
   * Updates .inertia, .invMass, .invInertia for this Body. Should be called when
   * changing the structure or mass of the Body.
   *
   * @method updateMassProperties
   *
   * @example
   *     body.mass += 1;
   *     body.updateMassProperties();
   */Body.prototype.updateMassProperties=function(){if(this.type===Body.STATIC||this.type===Body.KINEMATIC){this.mass=Number.MAX_VALUE;this.invMass=0;this.inertia=Number.MAX_VALUE;this.invInertia=0;}else{var shapes=this.shapes,N=shapes.length,m=this.mass/N,I=0;if(!this.fixedRotation){for(var i=0;i<N;i++){var shape=shapes[i],r2=vec2_1.squaredLength(shape.position),Icm=shape.computeMomentOfInertia(m);I+=Icm+m*r2;}this.inertia=I;this.invInertia=I>0?1/I:0;}else{this.inertia=Number.MAX_VALUE;this.invInertia=0;}// Inverse mass properties are easy
this.invMass=1/this.mass;vec2_1.set(this.massMultiplier,this.fixedX?0:1,this.fixedY?0:1);}};var Body_applyForce_r=vec2_1.create();/**
   * Apply force to a point relative to the center of mass of the body. This could for example be a point on the RigidBody surface. Applying force this way will add to Body.force and Body.angularForce. If relativePoint is zero, the force will be applied directly on the center of mass, and the torque produced will be zero.
   * @method applyForce
   * @param {Array} force The force to add.
   * @param {Array} [relativePoint] A world point to apply the force on.
   */Body.prototype.applyForce=function(force,relativePoint){// Add linear force
vec2_1.add(this.force,this.force,force);if(relativePoint){// Compute produced rotational force
var rotForce=vec2_1.crossLength(relativePoint,force);// Add rotational force
this.angularForce+=rotForce;}};/**
   * Apply force to a body-local point.
   * @method applyForceLocal
   * @param  {Array} localForce The force vector to add, oriented in local body space.
   * @param  {Array} [localPoint] A point relative to the body in world space. If not given, it is set to zero and all of the impulse will be excerted on the center of mass.
   */var Body_applyForce_forceWorld=vec2_1.create();var Body_applyForce_pointWorld=vec2_1.create();var Body_applyForce_pointLocal=vec2_1.create();Body.prototype.applyForceLocal=function(localForce,localPoint){localPoint=localPoint||Body_applyForce_pointLocal;var worldForce=Body_applyForce_forceWorld;var worldPoint=Body_applyForce_pointWorld;this.vectorToWorldFrame(worldForce,localForce);this.vectorToWorldFrame(worldPoint,localPoint);this.applyForce(worldForce,worldPoint);};/**
   * Apply impulse to a point relative to the body. This could for example be a point on the Body surface. An impulse is a force added to a body during a short period of time (impulse = force * time). Impulses will be added to Body.velocity and Body.angularVelocity.
   * @method applyImpulse
   * @param  {Array} impulse The impulse vector to add, oriented in world space.
   * @param  {Array} [relativePoint] A point relative to the body in world space. If not given, it is set to zero and all of the impulse will be excerted on the center of mass.
   */var Body_applyImpulse_velo=vec2_1.create();Body.prototype.applyImpulse=function(impulseVector,relativePoint){if(this.type!==Body.DYNAMIC){return;}// Compute produced central impulse velocity
var velo=Body_applyImpulse_velo;vec2_1.scale(velo,impulseVector,this.invMass);vec2_1.multiply(velo,this.massMultiplier,velo);// Add linear impulse
vec2_1.add(this.velocity,velo,this.velocity);if(relativePoint){// Compute produced rotational impulse velocity
var rotVelo=vec2_1.crossLength(relativePoint,impulseVector);rotVelo*=this.invInertia;// Add rotational Impulse
this.angularVelocity+=rotVelo;}};/**
   * Apply impulse to a point relative to the body. This could for example be a point on the Body surface. An impulse is a force added to a body during a short period of time (impulse = force * time). Impulses will be added to Body.velocity and Body.angularVelocity.
   * @method applyImpulseLocal
   * @param  {Array} impulse The impulse vector to add, oriented in world space.
   * @param  {Array} [relativePoint] A point relative to the body in world space. If not given, it is set to zero and all of the impulse will be excerted on the center of mass.
   */var Body_applyImpulse_impulseWorld=vec2_1.create();var Body_applyImpulse_pointWorld=vec2_1.create();var Body_applyImpulse_pointLocal=vec2_1.create();Body.prototype.applyImpulseLocal=function(localImpulse,localPoint){localPoint=localPoint||Body_applyImpulse_pointLocal;var worldImpulse=Body_applyImpulse_impulseWorld;var worldPoint=Body_applyImpulse_pointWorld;this.vectorToWorldFrame(worldImpulse,localImpulse);this.vectorToWorldFrame(worldPoint,localPoint);this.applyImpulse(worldImpulse,worldPoint);};/**
   * Transform a world point to local body frame.
   * @method toLocalFrame
   * @param  {Array} out          The vector to store the result in
   * @param  {Array} worldPoint   The input world point
   */Body.prototype.toLocalFrame=function(out,worldPoint){vec2_1.toLocalFrame(out,worldPoint,this.position,this.angle);};/**
   * Transform a local point to world frame.
   * @method toWorldFrame
   * @param  {Array} out          The vector to store the result in
   * @param  {Array} localPoint   The input local point
   */Body.prototype.toWorldFrame=function(out,localPoint){vec2_1.toGlobalFrame(out,localPoint,this.position,this.angle);};/**
   * Transform a world point to local body frame.
   * @method vectorToLocalFrame
   * @param  {Array} out          The vector to store the result in
   * @param  {Array} worldVector  The input world vector
   */Body.prototype.vectorToLocalFrame=function(out,worldVector){vec2_1.vectorToLocalFrame(out,worldVector,this.angle);};/**
   * Transform a local point to world frame.
   * @method vectorToWorldFrame
   * @param  {Array} out          The vector to store the result in
   * @param  {Array} localVector  The input local vector
   */Body.prototype.vectorToWorldFrame=function(out,localVector){vec2_1.vectorToGlobalFrame(out,localVector,this.angle);};/**
   * Reads a polygon shape path, and assembles convex shapes from that and puts them at proper offset points.
   * @method fromPolygon
   * @param {Array} path An array of 2d vectors, e.g. [[0,0],[0,1],...] that resembles a concave or convex polygon. The shape must be simple and without holes.
   * @param {Object} [options]
   * @param {Boolean} [options.optimalDecomp=false]   Set to true if you need optimal decomposition. Warning: very slow for polygons with more than 10 vertices.
   * @param {Boolean} [options.skipSimpleCheck=false] Set to true if you already know that the path is not intersecting itself.
   * @param {Boolean|Number} [options.removeCollinearPoints=false] Set to a number (angle threshold value) to remove collinear points, or false to keep all points.
   * @return {Boolean} True on success, else false.
   */Body.prototype.fromPolygon=function(path,options){options=options||{};// Remove all shapes
for(var i=this.shapes.length;i>=0;--i){this.removeShape(this.shapes[i]);}var p=new src.Polygon();p.vertices=path;// Make it counter-clockwise
p.makeCCW();if(typeof options.removeCollinearPoints==="number"){p.removeCollinearPoints(options.removeCollinearPoints);}// Check if any line segment intersects the path itself
if(typeof options.skipSimpleCheck==="undefined"){if(!p.isSimple()){return false;}}// Save this path for later
this.concavePath=p.vertices.slice(0);for(var i=0;i<this.concavePath.length;i++){var v=[0,0];vec2_1.copy(v,this.concavePath[i]);this.concavePath[i]=v;}// Slow or fast decomp?
var convexes;if(options.optimalDecomp){convexes=p.decomp();}else{convexes=p.quickDecomp();}var cm=vec2_1.create();// Add convexes
for(var i=0;i!==convexes.length;i++){// Create convex
var c=new Convex_1({vertices:convexes[i].vertices});// Move all vertices so its center of mass is in the local center of the convex
for(var j=0;j!==c.vertices.length;j++){var v=c.vertices[j];vec2_1.sub(v,v,c.centerOfMass);}vec2_1.scale(cm,c.centerOfMass,1);c.updateTriangles();c.updateCenterOfMass();c.updateBoundingRadius();// Add the shape
this.addShape(c,cm);}this.adjustCenterOfMass();this.aabbNeedsUpdate=true;return true;};var adjustCenterOfMass_tmp1=vec2_1.fromValues(0,0),adjustCenterOfMass_tmp2=vec2_1.fromValues(0,0),adjustCenterOfMass_tmp3=vec2_1.fromValues(0,0),adjustCenterOfMass_tmp4=vec2_1.fromValues(0,0);/**
   * Moves the shape offsets so their center of mass becomes the body center of mass.
   * @method adjustCenterOfMass
   */Body.prototype.adjustCenterOfMass=function(){var offset_times_area=adjustCenterOfMass_tmp2,sum=adjustCenterOfMass_tmp3,cm=adjustCenterOfMass_tmp4,totalArea=0;vec2_1.set(sum,0,0);for(var i=0;i!==this.shapes.length;i++){var s=this.shapes[i];vec2_1.scale(offset_times_area,s.position,s.area);vec2_1.add(sum,sum,offset_times_area);totalArea+=s.area;}vec2_1.scale(cm,sum,1/totalArea);// Now move all shapes
for(var i=0;i!==this.shapes.length;i++){var s=this.shapes[i];vec2_1.sub(s.position,s.position,cm);}// Move the body position too
vec2_1.add(this.position,this.position,cm);// And concave path
for(var i=0;this.concavePath&&i<this.concavePath.length;i++){vec2_1.sub(this.concavePath[i],this.concavePath[i],cm);}this.updateMassProperties();this.updateBoundingRadius();};/**
   * Sets the force on the body to zero.
   * @method setZeroForce
   */Body.prototype.setZeroForce=function(){vec2_1.set(this.force,0.0,0.0);this.angularForce=0.0;};Body.prototype.resetConstraintVelocity=function(){var b=this,vlambda=b.vlambda;vec2_1.set(vlambda,0,0);b.wlambda=0;};Body.prototype.addConstraintVelocity=function(){var b=this,v=b.velocity;vec2_1.add(v,v,b.vlambda);b.angularVelocity+=b.wlambda;};/**
   * Apply damping, see <a href="http://code.google.com/p/bullet/issues/detail?id=74">this</a> for details.
   * @method applyDamping
   * @param  {number} dt Current time step
   */Body.prototype.applyDamping=function(dt){if(this.type===Body.DYNAMIC){// Only for dynamic bodies
var v=this.velocity;vec2_1.scale(v,v,Math.pow(1.0-this.damping,dt));this.angularVelocity*=Math.pow(1.0-this.angularDamping,dt);}};/**
   * Wake the body up. Normally you should not need this, as the body is automatically awoken at events such as collisions.
   * Sets the sleepState to {{#crossLink "Body/AWAKE:property"}}Body.AWAKE{{/crossLink}} and emits the wakeUp event if the body wasn't awake before.
   * @method wakeUp
   */Body.prototype.wakeUp=function(){var s=this.sleepState;this.sleepState=Body.AWAKE;this.idleTime=0;if(s!==Body.AWAKE){this.emit(Body.wakeUpEvent);}};/**
   * Force body sleep
   * @method sleep
   */Body.prototype.sleep=function(){this.sleepState=Body.SLEEPING;this.angularVelocity=0;this.angularForce=0;vec2_1.set(this.velocity,0,0);vec2_1.set(this.force,0,0);this.emit(Body.sleepEvent);};/**
   * Called every timestep to update internal sleep timer and change sleep state if needed.
   * @method sleepTick
   * @param {number} time The world time in seconds
   * @param {boolean} dontSleep
   * @param {number} dt
   */Body.prototype.sleepTick=function(time,dontSleep,dt){if(!this.allowSleep||this.type===Body.SLEEPING){return;}this.wantsToSleep=false;var sleepState=this.sleepState,speedSquared=vec2_1.squaredLength(this.velocity)+Math.pow(this.angularVelocity,2),speedLimitSquared=Math.pow(this.sleepSpeedLimit,2);// Add to idle time
if(speedSquared>=speedLimitSquared){this.idleTime=0;this.sleepState=Body.AWAKE;}else{this.idleTime+=dt;this.sleepState=Body.SLEEPY;}if(this.idleTime>this.sleepTimeLimit){if(!dontSleep){this.sleep();}else{this.wantsToSleep=true;}}};/**
   * Check if the body is overlapping another body. Note that this method only works if the body was added to a World and if at least one step was taken.
   * @method overlaps
   * @param  {Body} body
   * @return {boolean}
   */Body.prototype.overlaps=function(body){return this.world.overlapKeeper.bodiesAreOverlapping(this,body);};var integrate_fhMinv=vec2_1.create();var integrate_velodt=vec2_1.create();/**
   * Move the body forward in time given its current velocity.
   * @method integrate
   * @param  {Number} dt
   */Body.prototype.integrate=function(dt){var minv=this.invMass,f=this.force,pos=this.position,velo=this.velocity;// Save old position
vec2_1.copy(this.previousPosition,this.position);this.previousAngle=this.angle;// Velocity update
if(!this.fixedRotation){this.angularVelocity+=this.angularForce*this.invInertia*dt;}vec2_1.scale(integrate_fhMinv,f,dt*minv);vec2_1.multiply(integrate_fhMinv,this.massMultiplier,integrate_fhMinv);vec2_1.add(velo,integrate_fhMinv,velo);// CCD
if(!this.integrateToTimeOfImpact(dt)){// Regular position update
vec2_1.scale(integrate_velodt,velo,dt);vec2_1.add(pos,pos,integrate_velodt);if(!this.fixedRotation){this.angle+=this.angularVelocity*dt;}}this.aabbNeedsUpdate=true;};var result=new RaycastResult_1();var ray=new Ray_1({mode:Ray_1.ALL});var direction=vec2_1.create();var end=vec2_1.create();var startToEnd=vec2_1.create();var rememberPosition=vec2_1.create();Body.prototype.integrateToTimeOfImpact=function(dt){if(this.ccdSpeedThreshold<0||vec2_1.squaredLength(this.velocity)<Math.pow(this.ccdSpeedThreshold,2)){return false;}vec2_1.normalize(direction,this.velocity);vec2_1.scale(end,this.velocity,dt);vec2_1.add(end,end,this.position);vec2_1.sub(startToEnd,end,this.position);var startToEndAngle=this.angularVelocity*dt;var len=vec2_1.length(startToEnd);var timeOfImpact=1;var hit;var that=this;result.reset();ray.callback=function(result){if(result.body===that){return;}hit=result.body;result.getHitPoint(end,ray);vec2_1.sub(startToEnd,end,that.position);timeOfImpact=vec2_1.length(startToEnd)/len;result.stop();};vec2_1.copy(ray.from,this.position);vec2_1.copy(ray.to,end);ray.update();this.world.raycast(result,ray);if(!hit){return false;}var rememberAngle=this.angle;vec2_1.copy(rememberPosition,this.position);// Got a start and end point. Approximate time of impact using binary search
var iter=0;var tmin=0;var tmid=0;var tmax=timeOfImpact;while(tmax>=tmin&&iter<this.ccdIterations){iter++;// calculate the midpoint
tmid=(tmax-tmin)/2;// Move the body to that point
vec2_1.scale(integrate_velodt,startToEnd,timeOfImpact);vec2_1.add(this.position,rememberPosition,integrate_velodt);this.angle=rememberAngle+startToEndAngle*timeOfImpact;this.updateAABB();// check overlap
var overlaps=this.aabb.overlaps(hit.aabb)&&this.world.narrowphase.bodiesOverlap(this,hit);if(overlaps){// change min to search upper interval
tmin=tmid;}else{// change max to search lower interval
tmax=tmid;}}timeOfImpact=tmid;vec2_1.copy(this.position,rememberPosition);this.angle=rememberAngle;// move to TOI
vec2_1.scale(integrate_velodt,startToEnd,timeOfImpact);vec2_1.add(this.position,this.position,integrate_velodt);if(!this.fixedRotation){this.angle+=startToEndAngle*timeOfImpact;}return true;};/**
   * Get velocity of a point in the body.
   * @method getVelocityAtPoint
   * @param  {Array} result A vector to store the result in
   * @param  {Array} relativePoint A world oriented vector, indicating the position of the point to get the velocity from
   * @return {Array} The result vector
   */Body.prototype.getVelocityAtPoint=function(result,relativePoint){vec2_1.crossVZ(result,relativePoint,this.angularVelocity);vec2_1.subtract(result,this.velocity,result);return result;};/**
   * @event sleepy
   */Body.sleepyEvent={type:"sleepy"};/**
   * @event sleep
   */Body.sleepEvent={type:"sleep"};/**
   * @event wakeup
   */Body.wakeUpEvent={type:"wakeup"};/**
   * Dynamic body.
   * @property DYNAMIC
   * @type {Number}
   * @static
   */Body.DYNAMIC=1;/**
   * Static body.
   * @property STATIC
   * @type {Number}
   * @static
   */Body.STATIC=2;/**
   * Kinematic body.
   * @property KINEMATIC
   * @type {Number}
   * @static
   */Body.KINEMATIC=4;/**
   * @property AWAKE
   * @type {Number}
   * @static
   */Body.AWAKE=0;/**
   * @property SLEEPY
   * @type {Number}
   * @static
   */Body.SLEEPY=1;/**
   * @property SLEEPING
   * @type {Number}
   * @static
   */Body.SLEEPING=2;var Equation_1=Equation;/**
   * Base class for constraint equations.
   * @class Equation
   * @constructor
   * @param {Body} bodyA First body participating in the equation
   * @param {Body} bodyB Second body participating in the equation
   * @param {number} minForce Minimum force to apply. Default: -Number.MAX_VALUE
   * @param {number} maxForce Maximum force to apply. Default: Number.MAX_VALUE
   */function Equation(bodyA,bodyB,minForce,maxForce){/**
       * Minimum force to apply when solving.
       * @property minForce
       * @type {Number}
       */this.minForce=typeof minForce==="undefined"?-Number.MAX_VALUE:minForce;/**
       * Max force to apply when solving.
       * @property maxForce
       * @type {Number}
       */this.maxForce=typeof maxForce==="undefined"?Number.MAX_VALUE:maxForce;/**
       * First body participating in the constraint
       * @property bodyA
       * @type {Body}
       */this.bodyA=bodyA;/**
       * Second body participating in the constraint
       * @property bodyB
       * @type {Body}
       */this.bodyB=bodyB;/**
       * The stiffness of this equation. Typically chosen to a large number (~1e7), but can be chosen somewhat freely to get a stable simulation.
       * @property stiffness
       * @type {Number}
       */this.stiffness=Equation.DEFAULT_STIFFNESS;/**
       * The number of time steps needed to stabilize the constraint equation. Typically between 3 and 5 time steps.
       * @property relaxation
       * @type {Number}
       */this.relaxation=Equation.DEFAULT_RELAXATION;/**
       * The Jacobian entry of this equation. 6 numbers, 3 per body (x,y,angle).
       * @property G
       * @type {Array}
       */this.G=new Utils_1.ARRAY_TYPE(6);for(var i=0;i<6;i++){this.G[i]=0;}this.offset=0;this.a=0;this.b=0;this.epsilon=0;this.timeStep=1/60;/**
       * Indicates if stiffness or relaxation was changed.
       * @property {Boolean} needsUpdate
       */this.needsUpdate=true;/**
       * The resulting constraint multiplier from the last solve. This is mostly equivalent to the force produced by the constraint.
       * @property multiplier
       * @type {Number}
       */this.multiplier=0;/**
       * Relative velocity.
       * @property {Number} relativeVelocity
       */this.relativeVelocity=0;/**
       * Whether this equation is enabled or not. If true, it will be added to the solver.
       * @property {Boolean} enabled
       */this.enabled=true;}Equation.prototype.constructor=Equation;/**
   * The default stiffness when creating a new Equation.
   * @static
   * @property {Number} DEFAULT_STIFFNESS
   * @default 1e6
   */Equation.DEFAULT_STIFFNESS=1e6;/**
   * The default relaxation when creating a new Equation.
   * @static
   * @property {Number} DEFAULT_RELAXATION
   * @default 4
   */Equation.DEFAULT_RELAXATION=4;/**
   * Compute SPOOK parameters .a, .b and .epsilon according to the current parameters. See equations 9, 10 and 11 in the <a href="http://www8.cs.umu.se/kurser/5DV058/VT09/lectures/spooknotes.pdf">SPOOK notes</a>.
   * @method update
   */Equation.prototype.update=function(){var k=this.stiffness,d=this.relaxation,h=this.timeStep;this.a=4.0/(h*(1+4*d));this.b=4.0*d/(1+4*d);this.epsilon=4.0/(h*h*k*(1+4*d));this.needsUpdate=false;};/**
   * Multiply a jacobian entry with corresponding positions or velocities
   * @method gmult
   * @return {Number}
   */Equation.prototype.gmult=function(G,vi,wi,vj,wj){return G[0]*vi[0]+G[1]*vi[1]+G[2]*wi+G[3]*vj[0]+G[4]*vj[1]+G[5]*wj;};/**
   * Computes the RHS of the SPOOK equation
   * @method computeB
   * @return {Number}
   */Equation.prototype.computeB=function(a,b,h){var GW=this.computeGW();var Gq=this.computeGq();var GiMf=this.computeGiMf();return-Gq*a-GW*b-GiMf*h;};/**
   * Computes G\*q, where q are the generalized body coordinates
   * @method computeGq
   * @return {Number}
   */var qi=vec2_1.create(),qj=vec2_1.create();Equation.prototype.computeGq=function(){var G=this.G,bi=this.bodyA,bj=this.bodyB,xi=bi.position,xj=bj.position,ai=bi.angle,aj=bj.angle;return this.gmult(G,qi,ai,qj,aj)+this.offset;};/**
   * Computes G\*W, where W are the body velocities
   * @method computeGW
   * @return {Number}
   */Equation.prototype.computeGW=function(){var G=this.G,bi=this.bodyA,bj=this.bodyB,vi=bi.velocity,vj=bj.velocity,wi=bi.angularVelocity,wj=bj.angularVelocity;return this.gmult(G,vi,wi,vj,wj)+this.relativeVelocity;};/**
   * Computes G\*Wlambda, where W are the body velocities
   * @method computeGWlambda
   * @return {Number}
   */Equation.prototype.computeGWlambda=function(){var G=this.G,bi=this.bodyA,bj=this.bodyB,vi=bi.vlambda,vj=bj.vlambda,wi=bi.wlambda,wj=bj.wlambda;return this.gmult(G,vi,wi,vj,wj);};/**
   * Computes G\*inv(M)\*f, where M is the mass matrix with diagonal blocks for each body, and f are the forces on the bodies.
   * @method computeGiMf
   * @return {Number}
   */var iMfi=vec2_1.create(),iMfj=vec2_1.create();Equation.prototype.computeGiMf=function(){var bi=this.bodyA,bj=this.bodyB,fi=bi.force,ti=bi.angularForce,fj=bj.force,tj=bj.angularForce,invMassi=bi.invMassSolve,invMassj=bj.invMassSolve,invIi=bi.invInertiaSolve,invIj=bj.invInertiaSolve,G=this.G;vec2_1.scale(iMfi,fi,invMassi);vec2_1.multiply(iMfi,bi.massMultiplier,iMfi);vec2_1.scale(iMfj,fj,invMassj);vec2_1.multiply(iMfj,bj.massMultiplier,iMfj);return this.gmult(G,iMfi,ti*invIi,iMfj,tj*invIj);};/**
   * Computes G\*inv(M)\*G'
   * @method computeGiMGt
   * @return {Number}
   */Equation.prototype.computeGiMGt=function(){var bi=this.bodyA,bj=this.bodyB,invMassi=bi.invMassSolve,invMassj=bj.invMassSolve,invIi=bi.invInertiaSolve,invIj=bj.invInertiaSolve,G=this.G;return G[0]*G[0]*invMassi*bi.massMultiplier[0]+G[1]*G[1]*invMassi*bi.massMultiplier[1]+G[2]*G[2]*invIi+G[3]*G[3]*invMassj*bj.massMultiplier[0]+G[4]*G[4]*invMassj*bj.massMultiplier[1]+G[5]*G[5]*invIj;};var addToWlambda_temp=vec2_1.create(),addToWlambda_Gi=vec2_1.create(),addToWlambda_Gj=vec2_1.create(),addToWlambda_ri=vec2_1.create(),addToWlambda_rj=vec2_1.create(),addToWlambda_Mdiag=vec2_1.create();/**
   * Add constraint velocity to the bodies.
   * @method addToWlambda
   * @param {Number} deltalambda
   */Equation.prototype.addToWlambda=function(deltalambda){var bi=this.bodyA,bj=this.bodyB,temp=addToWlambda_temp,Gi=addToWlambda_Gi,Gj=addToWlambda_Gj,invMassi=bi.invMassSolve,invMassj=bj.invMassSolve,invIi=bi.invInertiaSolve,invIj=bj.invInertiaSolve,G=this.G;Gi[0]=G[0];Gi[1]=G[1];Gj[0]=G[3];Gj[1]=G[4];// Add to linear velocity
// v_lambda += inv(M) * delta_lamba * G
vec2_1.scale(temp,Gi,invMassi*deltalambda);vec2_1.multiply(temp,temp,bi.massMultiplier);vec2_1.add(bi.vlambda,bi.vlambda,temp);// This impulse is in the offset frame
// Also add contribution to angular
//bi.wlambda -= vec2.crossLength(temp,ri);
bi.wlambda+=invIi*G[2]*deltalambda;vec2_1.scale(temp,Gj,invMassj*deltalambda);vec2_1.multiply(temp,temp,bj.massMultiplier);vec2_1.add(bj.vlambda,bj.vlambda,temp);//bj.wlambda -= vec2.crossLength(temp,rj);
bj.wlambda+=invIj*G[5]*deltalambda;};/**
   * Compute the denominator part of the SPOOK equation: C = G\*inv(M)\*G' + eps
   * @method computeInvC
   * @param  {Number} eps
   * @return {Number}
   */Equation.prototype.computeInvC=function(eps){return 1.0/(this.computeGiMGt()+eps);};var AngleLockEquation_1=AngleLockEquation;/**
   * Locks the relative angle between two bodies. The constraint tries to keep the dot product between two vectors, local in each body, to zero. The local angle in body i is a parameter.
   *
   * @class AngleLockEquation
   * @constructor
   * @extends Equation
   * @param {Body} bodyA
   * @param {Body} bodyB
   * @param {Object} [options]
   * @param {Number} [options.angle] Angle to add to the local vector in body A.
   * @param {Number} [options.ratio] Gear ratio
   */function AngleLockEquation(bodyA,bodyB,options){options=options||{};Equation_1.call(this,bodyA,bodyB,-Number.MAX_VALUE,Number.MAX_VALUE);this.angle=options.angle||0;/**
       * The gear ratio.
       * @property {Number} ratio
       * @private
       * @see setRatio
       */this.ratio=typeof options.ratio==="number"?options.ratio:1;this.setRatio(this.ratio);}AngleLockEquation.prototype=new Equation_1();AngleLockEquation.prototype.constructor=AngleLockEquation;AngleLockEquation.prototype.computeGq=function(){return this.ratio*this.bodyA.angle-this.bodyB.angle+this.angle;};/**
   * Set the gear ratio for this equation
   * @method setRatio
   * @param {Number} ratio
   */AngleLockEquation.prototype.setRatio=function(ratio){var G=this.G;G[2]=ratio;G[5]=-1;this.ratio=ratio;};/**
   * Set the max force for the equation.
   * @method setMaxTorque
   * @param {Number} torque
   */AngleLockEquation.prototype.setMaxTorque=function(torque){this.maxForce=torque;this.minForce=-torque;};var Broadphase_1=Broadphase;/**
   * Base class for broadphase implementations.
   * @class Broadphase
   * @constructor
   */function Broadphase(type){this.type=type;/**
       * The resulting overlapping pairs. Will be filled with results during .getCollisionPairs().
       * @property result
       * @type {Array}
       */this.result=[];/**
       * The world to search for collision pairs in. To change it, use .setWorld()
       * @property world
       * @type {World}
       * @readOnly
       */this.world=null;/**
       * The bounding volume type to use in the broadphase algorithms. Should be set to Broadphase.AABB or Broadphase.BOUNDING_CIRCLE.
       * @property {Number} boundingVolumeType
       */this.boundingVolumeType=Broadphase.AABB;}/**
   * Axis aligned bounding box type.
   * @static
   * @property {Number} AABB
   */Broadphase.AABB=1;/**
   * Bounding circle type.
   * @static
   * @property {Number} BOUNDING_CIRCLE
   */Broadphase.BOUNDING_CIRCLE=2;/**
   * Set the world that we are searching for collision pairs in.
   * @method setWorld
   * @param  {World} world
   */Broadphase.prototype.setWorld=function(world){this.world=world;};/**
   * Get all potential intersecting body pairs.
   * @method getCollisionPairs
   * @param  {World} world The world to search in.
   * @return {Array} An array of the bodies, ordered in pairs. Example: A result of [a,b,c,d] means that the potential pairs are: (a,b), (c,d).
   */Broadphase.prototype.getCollisionPairs=function(world){};var dist=vec2_1.create();/**
   * Check whether the bounding radius of two bodies overlap.
   * @method  boundingRadiusCheck
   * @param  {Body} bodyA
   * @param  {Body} bodyB
   * @return {Boolean}
   */Broadphase.boundingRadiusCheck=function(bodyA,bodyB){vec2_1.sub(dist,bodyA.position,bodyB.position);var d2=vec2_1.squaredLength(dist),r=bodyA.boundingRadius+bodyB.boundingRadius;return d2<=r*r;};/**
   * Check whether the bounding radius of two bodies overlap.
   * @method  boundingRadiusCheck
   * @param  {Body} bodyA
   * @param  {Body} bodyB
   * @return {Boolean}
   */Broadphase.aabbCheck=function(bodyA,bodyB){return bodyA.getAABB().overlaps(bodyB.getAABB());};/**
   * Check whether the bounding radius of two bodies overlap.
   * @method  boundingRadiusCheck
   * @param  {Body} bodyA
   * @param  {Body} bodyB
   * @return {Boolean}
   */Broadphase.prototype.boundingVolumeCheck=function(bodyA,bodyB){var result;switch(this.boundingVolumeType){case Broadphase.BOUNDING_CIRCLE:result=Broadphase.boundingRadiusCheck(bodyA,bodyB);break;case Broadphase.AABB:result=Broadphase.aabbCheck(bodyA,bodyB);break;default:throw new Error('Bounding volume type not recognized: '+this.boundingVolumeType);}return result;};/**
   * Check whether two bodies are allowed to collide at all.
   * @method  canCollide
   * @param  {Body} bodyA
   * @param  {Body} bodyB
   * @return {Boolean}
   */Broadphase.canCollide=function(bodyA,bodyB){var KINEMATIC=Body_1.KINEMATIC;var STATIC=Body_1.STATIC;// Cannot collide static bodies
if(bodyA.type===STATIC&&bodyB.type===STATIC){return false;}// Cannot collide static vs kinematic bodies
if(bodyA.type===KINEMATIC&&bodyB.type===STATIC||bodyA.type===STATIC&&bodyB.type===KINEMATIC){return false;}// Cannot collide kinematic vs kinematic
if(bodyA.type===KINEMATIC&&bodyB.type===KINEMATIC){return false;}// Cannot collide both sleeping bodies
if(bodyA.sleepState===Body_1.SLEEPING&&bodyB.sleepState===Body_1.SLEEPING){return false;}// Cannot collide if one is static and the other is sleeping
if(bodyA.sleepState===Body_1.SLEEPING&&bodyB.type===STATIC||bodyB.sleepState===Body_1.SLEEPING&&bodyA.type===STATIC){return false;}return true;};Broadphase.NAIVE=1;Broadphase.SAP=2;var Capsule_1=Capsule;/**
   * Capsule shape class.
   * @class Capsule
   * @constructor
   * @extends Shape
   * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
   * @param {Number} [options.length=1] The distance between the end points
   * @param {Number} [options.radius=1] Radius of the capsule
   * @example
   *     var capsuleShape = new Capsule({
   *         length: 1,
   *         radius: 2
   *     });
   *     body.addShape(capsuleShape);
   */function Capsule(options){if(typeof arguments[0]==='number'&&typeof arguments[1]==='number'){options={length:arguments[0],radius:arguments[1]};console.warn('The Capsule constructor signature has changed. Please use the following format: new Capsule({ radius: 1, length: 1 })');}options=options||{};/**
       * The distance between the end points.
       * @property {Number} length
       */this.length=options.length||1;/**
       * The radius of the capsule.
       * @property {Number} radius
       */this.radius=options.radius||1;options.type=Shape_1.CAPSULE;Shape_1.call(this,options);}Capsule.prototype=new Shape_1();Capsule.prototype.constructor=Capsule;/**
   * Compute the mass moment of inertia of the Capsule.
   * @method conputeMomentOfInertia
   * @param  {Number} mass
   * @return {Number}
   * @todo
   */Capsule.prototype.computeMomentOfInertia=function(mass){// Approximate with rectangle
var r=this.radius,w=this.length+r,// 2*r is too much, 0 is too little
h=r*2;return mass*(h*h+w*w)/12;};/**
   * @method updateBoundingRadius
   */Capsule.prototype.updateBoundingRadius=function(){this.boundingRadius=this.radius+this.length/2;};/**
   * @method updateArea
   */Capsule.prototype.updateArea=function(){this.area=Math.PI*this.radius*this.radius+this.radius*2*this.length;};var r=vec2_1.create();/**
   * @method computeAABB
   * @param  {AABB}   out      The resulting AABB.
   * @param  {Array}  position
   * @param  {Number} angle
   */Capsule.prototype.computeAABB=function(out,position,angle){var radius=this.radius;// Compute center position of one of the the circles, world oriented, but with local offset
vec2_1.set(r,this.length/2,0);if(angle!==0){vec2_1.rotate(r,r,angle);}// Get bounds
vec2_1.set(out.upperBound,Math.max(r[0]+radius,-r[0]+radius),Math.max(r[1]+radius,-r[1]+radius));vec2_1.set(out.lowerBound,Math.min(r[0]-radius,-r[0]-radius),Math.min(r[1]-radius,-r[1]-radius));// Add offset
vec2_1.add(out.lowerBound,out.lowerBound,position);vec2_1.add(out.upperBound,out.upperBound,position);};var intersectCapsule_hitPointWorld=vec2_1.create();var intersectCapsule_normal=vec2_1.create();var intersectCapsule_l0=vec2_1.create();var intersectCapsule_l1=vec2_1.create();var intersectCapsule_unit_y=vec2_1.fromValues(0,1);/**
   * @method raycast
   * @param  {RaycastResult} result
   * @param  {Ray} ray
   * @param  {array} position
   * @param  {number} angle
   */Capsule.prototype.raycast=function(result,ray,position,angle){var from=ray.from;var to=ray.to;var direction=ray.direction;var hitPointWorld=intersectCapsule_hitPointWorld;var normal=intersectCapsule_normal;var l0=intersectCapsule_l0;var l1=intersectCapsule_l1;// The sides
var halfLen=this.length/2;for(var i=0;i<2;i++){// get start and end of the line
var y=this.radius*(i*2-1);vec2_1.set(l0,-halfLen,y);vec2_1.set(l1,halfLen,y);vec2_1.toGlobalFrame(l0,l0,position,angle);vec2_1.toGlobalFrame(l1,l1,position,angle);var delta=vec2_1.getLineSegmentsIntersectionFraction(from,to,l0,l1);if(delta>=0){vec2_1.rotate(normal,intersectCapsule_unit_y,angle);vec2_1.scale(normal,normal,i*2-1);ray.reportIntersection(result,delta,normal,-1);if(result.shouldStop(ray)){return;}}}// Circles
var diagonalLengthSquared=Math.pow(this.radius,2)+Math.pow(halfLen,2);for(var i=0;i<2;i++){vec2_1.set(l0,halfLen*(i*2-1),0);vec2_1.toGlobalFrame(l0,l0,position,angle);var a=Math.pow(to[0]-from[0],2)+Math.pow(to[1]-from[1],2);var b=2*((to[0]-from[0])*(from[0]-l0[0])+(to[1]-from[1])*(from[1]-l0[1]));var c=Math.pow(from[0]-l0[0],2)+Math.pow(from[1]-l0[1],2)-Math.pow(this.radius,2);var delta=Math.pow(b,2)-4*a*c;if(delta<0){// No intersection
continue;}else if(delta===0){// single intersection point
vec2_1.lerp(hitPointWorld,from,to,delta);if(vec2_1.squaredDistance(hitPointWorld,position)>diagonalLengthSquared){vec2_1.sub(normal,hitPointWorld,l0);vec2_1.normalize(normal,normal);ray.reportIntersection(result,delta,normal,-1);if(result.shouldStop(ray)){return;}}}else{var sqrtDelta=Math.sqrt(delta);var inv2a=1/(2*a);var d1=(-b-sqrtDelta)*inv2a;var d2=(-b+sqrtDelta)*inv2a;if(d1>=0&&d1<=1){vec2_1.lerp(hitPointWorld,from,to,d1);if(vec2_1.squaredDistance(hitPointWorld,position)>diagonalLengthSquared){vec2_1.sub(normal,hitPointWorld,l0);vec2_1.normalize(normal,normal);ray.reportIntersection(result,d1,normal,-1);if(result.shouldStop(ray)){return;}}}if(d2>=0&&d2<=1){vec2_1.lerp(hitPointWorld,from,to,d2);if(vec2_1.squaredDistance(hitPointWorld,position)>diagonalLengthSquared){vec2_1.sub(normal,hitPointWorld,l0);vec2_1.normalize(normal,normal);ray.reportIntersection(result,d2,normal,-1);if(result.shouldStop(ray)){return;}}}}}};var Circle_1=Circle;/**
   * Circle shape class.
   * @class Circle
   * @extends Shape
   * @constructor
   * @param {options} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
   * @param {number} [options.radius=1] The radius of this circle
   *
   * @example
   *     var circleShape = new Circle({ radius: 1 });
   *     body.addShape(circleShape);
   */function Circle(options){if(typeof arguments[0]==='number'){options={radius:arguments[0]};console.warn('The Circle constructor signature has changed. Please use the following format: new Circle({ radius: 1 })');}options=options||{};/**
       * The radius of the circle.
       * @property radius
       * @type {number}
       */this.radius=options.radius||1;options.type=Shape_1.CIRCLE;Shape_1.call(this,options);}Circle.prototype=new Shape_1();Circle.prototype.constructor=Circle;/**
   * @method computeMomentOfInertia
   * @param  {Number} mass
   * @return {Number}
   */Circle.prototype.computeMomentOfInertia=function(mass){var r=this.radius;return mass*r*r/2;};/**
   * @method updateBoundingRadius
   * @return {Number}
   */Circle.prototype.updateBoundingRadius=function(){this.boundingRadius=this.radius;};/**
   * @method updateArea
   * @return {Number}
   */Circle.prototype.updateArea=function(){this.area=Math.PI*this.radius*this.radius;};/**
   * @method computeAABB
   * @param  {AABB}   out      The resulting AABB.
   * @param  {Array}  position
   * @param  {Number} angle
   */Circle.prototype.computeAABB=function(out,position,angle){var r=this.radius;vec2_1.set(out.upperBound,r,r);vec2_1.set(out.lowerBound,-r,-r);if(position){vec2_1.add(out.lowerBound,out.lowerBound,position);vec2_1.add(out.upperBound,out.upperBound,position);}};var Ray_intersectSphere_intersectionPoint=vec2_1.create();var Ray_intersectSphere_normal=vec2_1.create();/**
   * @method raycast
   * @param  {RaycastResult} result
   * @param  {Ray} ray
   * @param  {array} position
   * @param  {number} angle
   */Circle.prototype.raycast=function(result,ray,position,angle){var from=ray.from,to=ray.to,r=this.radius;var a=Math.pow(to[0]-from[0],2)+Math.pow(to[1]-from[1],2);var b=2*((to[0]-from[0])*(from[0]-position[0])+(to[1]-from[1])*(from[1]-position[1]));var c=Math.pow(from[0]-position[0],2)+Math.pow(from[1]-position[1],2)-Math.pow(r,2);var delta=Math.pow(b,2)-4*a*c;var intersectionPoint=Ray_intersectSphere_intersectionPoint;var normal=Ray_intersectSphere_normal;if(delta<0){// No intersection
return;}else if(delta===0){// single intersection point
vec2_1.lerp(intersectionPoint,from,to,delta);vec2_1.sub(normal,intersectionPoint,position);vec2_1.normalize(normal,normal);ray.reportIntersection(result,delta,normal,-1);}else{var sqrtDelta=Math.sqrt(delta);var inv2a=1/(2*a);var d1=(-b-sqrtDelta)*inv2a;var d2=(-b+sqrtDelta)*inv2a;if(d1>=0&&d1<=1){vec2_1.lerp(intersectionPoint,from,to,d1);vec2_1.sub(normal,intersectionPoint,position);vec2_1.normalize(normal,normal);ray.reportIntersection(result,d1,normal,-1);if(result.shouldStop(ray)){return;}}if(d2>=0&&d2<=1){vec2_1.lerp(intersectionPoint,from,to,d2);vec2_1.sub(normal,intersectionPoint,position);vec2_1.normalize(normal,normal);ray.reportIntersection(result,d2,normal,-1);}}};var Constraint_1=Constraint;/**
   * Base constraint class.
   *
   * @class Constraint
   * @constructor
   * @author schteppe
   * @param {Body} bodyA
   * @param {Body} bodyB
   * @param {Number} type
   * @param {Object} [options]
   * @param {Object} [options.collideConnected=true]
   */function Constraint(bodyA,bodyB,type,options){/**
       * The type of constraint. May be one of Constraint.DISTANCE, Constraint.GEAR, Constraint.LOCK, Constraint.PRISMATIC or Constraint.REVOLUTE.
       * @property {number} type
       */this.type=type;options=Utils_1.defaults(options,{collideConnected:true,wakeUpBodies:true});/**
       * Equations to be solved in this constraint
       *
       * @property equations
       * @type {Array}
       */this.equations=[];/**
       * First body participating in the constraint.
       * @property bodyA
       * @type {Body}
       */this.bodyA=bodyA;/**
       * Second body participating in the constraint.
       * @property bodyB
       * @type {Body}
       */this.bodyB=bodyB;/**
       * Set to true if you want the connected bodies to collide.
       * @property collideConnected
       * @type {Boolean}
       * @default true
       */this.collideConnected=options.collideConnected;// Wake up bodies when connected
if(options.wakeUpBodies){if(bodyA){bodyA.wakeUp();}if(bodyB){bodyB.wakeUp();}}}/**
   * Updates the internal constraint parameters before solve.
   * @method update
   */Constraint.prototype.update=function(){throw new Error("method update() not implmemented in this Constraint subclass!");};/**
   * @static
   * @property {number} DISTANCE
   */Constraint.DISTANCE=1;/**
   * @static
   * @property {number} GEAR
   */Constraint.GEAR=2;/**
   * @static
   * @property {number} LOCK
   */Constraint.LOCK=3;/**
   * @static
   * @property {number} PRISMATIC
   */Constraint.PRISMATIC=4;/**
   * @static
   * @property {number} REVOLUTE
   */Constraint.REVOLUTE=5;/**
   * Set stiffness for this constraint.
   * @method setStiffness
   * @param {Number} stiffness
   */Constraint.prototype.setStiffness=function(stiffness){var eqs=this.equations;for(var i=0;i!==eqs.length;i++){var eq=eqs[i];eq.stiffness=stiffness;eq.needsUpdate=true;}};/**
   * Set relaxation for this constraint.
   * @method setRelaxation
   * @param {Number} relaxation
   */Constraint.prototype.setRelaxation=function(relaxation){var eqs=this.equations;for(var i=0;i!==eqs.length;i++){var eq=eqs[i];eq.relaxation=relaxation;eq.needsUpdate=true;}};var ContactEquation_1=ContactEquation;/**
   * Non-penetration constraint equation. Tries to make the contactPointA and contactPointB vectors coincide, while keeping the applied force repulsive.
   *
   * @class ContactEquation
   * @constructor
   * @extends Equation
   * @param {Body} bodyA
   * @param {Body} bodyB
   */function ContactEquation(bodyA,bodyB){Equation_1.call(this,bodyA,bodyB,0,Number.MAX_VALUE);/**
       * Vector from body i center of mass to the contact point.
       * @property contactPointA
       * @type {Array}
       */this.contactPointA=vec2_1.create();this.penetrationVec=vec2_1.create();/**
       * World-oriented vector from body A center of mass to the contact point.
       * @property contactPointB
       * @type {Array}
       */this.contactPointB=vec2_1.create();/**
       * The normal vector, pointing out of body i
       * @property normalA
       * @type {Array}
       */this.normalA=vec2_1.create();/**
       * The restitution to use (0=no bounciness, 1=max bounciness).
       * @property restitution
       * @type {Number}
       */this.restitution=0;/**
       * This property is set to true if this is the first impact between the bodies (not persistant contact).
       * @property firstImpact
       * @type {Boolean}
       * @readOnly
       */this.firstImpact=false;/**
       * The shape in body i that triggered this contact.
       * @property shapeA
       * @type {Shape}
       */this.shapeA=null;/**
       * The shape in body j that triggered this contact.
       * @property shapeB
       * @type {Shape}
       */this.shapeB=null;}ContactEquation.prototype=new Equation_1();ContactEquation.prototype.constructor=ContactEquation;ContactEquation.prototype.computeB=function(a,b,h){var bi=this.bodyA,bj=this.bodyB,ri=this.contactPointA,rj=this.contactPointB,xi=bi.position,xj=bj.position;var penetrationVec=this.penetrationVec,n=this.normalA,G=this.G;// Caluclate cross products
var rixn=vec2_1.crossLength(ri,n),rjxn=vec2_1.crossLength(rj,n);// G = [-n -rixn n rjxn]
G[0]=-n[0];G[1]=-n[1];G[2]=-rixn;G[3]=n[0];G[4]=n[1];G[5]=rjxn;// Calculate q = xj+rj -(xi+ri) i.e. the penetration vector
vec2_1.add(penetrationVec,xj,rj);vec2_1.sub(penetrationVec,penetrationVec,xi);vec2_1.sub(penetrationVec,penetrationVec,ri);// Compute iteration
var GW,Gq;if(this.firstImpact&&this.restitution!==0){Gq=0;GW=1/b*(1+this.restitution)*this.computeGW();}else{Gq=vec2_1.dot(n,penetrationVec)+this.offset;GW=this.computeGW();}var GiMf=this.computeGiMf();var B=-Gq*a-GW*b-h*GiMf;return B;};var vi=vec2_1.create();var vj=vec2_1.create();var relVel=vec2_1.create();/**
   * Get the relative velocity along the normal vector.
   * @return {number}
   */ContactEquation.prototype.getVelocityAlongNormal=function(){this.bodyA.getVelocityAtPoint(vi,this.contactPointA);this.bodyB.getVelocityAtPoint(vj,this.contactPointB);vec2_1.subtract(relVel,vi,vj);return vec2_1.dot(this.normalA,relVel);};var Pool_1=Pool;/**
   * @class Object pooling utility.
   */function Pool(options){options=options||{};/**
  	 * @property {Array} objects
  	 * @type {Array}
  	 */this.objects=[];if(options.size!==undefined){this.resize(options.size);}}/**
   * @method resize
   * @param {number} size
   * @return {Pool} Self, for chaining
   */Pool.prototype.resize=function(size){var objects=this.objects;while(objects.length>size){objects.pop();}while(objects.length<size){objects.push(this.create());}return this;};/**
   * Get an object from the pool or create a new instance.
   * @method get
   * @return {Object}
   */Pool.prototype.get=function(){var objects=this.objects;return objects.length?objects.pop():this.create();};/**
   * Clean up and put the object back into the pool for later use.
   * @method release
   * @param {Object} object
   * @return {Pool} Self for chaining
   */Pool.prototype.release=function(object){this.destroy(object);this.objects.push(object);return this;};var ContactEquationPool_1=ContactEquationPool;/**
   * @class
   */function ContactEquationPool(){Pool_1.apply(this,arguments);}ContactEquationPool.prototype=new Pool_1();ContactEquationPool.prototype.constructor=ContactEquationPool;/**
   * @method create
   * @return {ContactEquation}
   */ContactEquationPool.prototype.create=function(){return new ContactEquation_1();};/**
   * @method destroy
   * @param {ContactEquation} equation
   * @return {ContactEquationPool}
   */ContactEquationPool.prototype.destroy=function(equation){equation.bodyA=equation.bodyB=null;return this;};var Material_1=Material;/**
   * Defines a physics material.
   * @class Material
   * @constructor
   * @param {number} id Material identifier
   * @author schteppe
   */function Material(id){/**
       * The material identifier
       * @property id
       * @type {Number}
       */this.id=id||Material.idCounter++;}Material.idCounter=0;var ContactMaterial_1=ContactMaterial;/**
   * Defines what happens when two materials meet, such as what friction coefficient to use. You can also set other things such as restitution, surface velocity and constraint parameters.
   * @class ContactMaterial
   * @constructor
   * @param {Material} materialA
   * @param {Material} materialB
   * @param {Object}   [options]
   * @param {Number}   [options.friction=0.3]       Friction coefficient.
   * @param {Number}   [options.restitution=0]      Restitution coefficient aka "bounciness".
   * @param {Number}   [options.stiffness]          ContactEquation stiffness.
   * @param {Number}   [options.relaxation]         ContactEquation relaxation.
   * @param {Number}   [options.frictionStiffness]  FrictionEquation stiffness.
   * @param {Number}   [options.frictionRelaxation] FrictionEquation relaxation.
   * @param {Number}   [options.surfaceVelocity=0]  Surface velocity.
   * @author schteppe
   */function ContactMaterial(materialA,materialB,options){options=options||{};if(!(materialA instanceof Material_1)||!(materialB instanceof Material_1)){throw new Error("First two arguments must be Material instances.");}/**
       * The contact material identifier
       * @property id
       * @type {Number}
       */this.id=ContactMaterial.idCounter++;/**
       * First material participating in the contact material
       * @property materialA
       * @type {Material}
       */this.materialA=materialA;/**
       * Second material participating in the contact material
       * @property materialB
       * @type {Material}
       */this.materialB=materialB;/**
       * Friction coefficient to use in the contact of these two materials. Friction = 0 will make the involved objects super slippery, and friction = 1 will make it much less slippery. A friction coefficient larger than 1 will allow for very large friction forces, which can be convenient for preventing car tires not slip on the ground.
       * @property friction
       * @type {Number}
       * @default 0.3
       */this.friction=typeof options.friction!=="undefined"?Number(options.friction):0.3;/**
       * Restitution, or "bounciness" to use in the contact of these two materials. A restitution of 0 will make no bounce, while restitution=1 will approximately bounce back with the same velocity the object came with.
       * @property restitution
       * @type {Number}
       * @default 0
       */this.restitution=typeof options.restitution!=="undefined"?Number(options.restitution):0;/**
       * Hardness of the contact. Less stiffness will make the objects penetrate more, and will make the contact act more like a spring than a contact force. Default value is {{#crossLink "Equation/DEFAULT_STIFFNESS:property"}}Equation.DEFAULT_STIFFNESS{{/crossLink}}.
       * @property stiffness
       * @type {Number}
       */this.stiffness=typeof options.stiffness!=="undefined"?Number(options.stiffness):Equation_1.DEFAULT_STIFFNESS;/**
       * Relaxation of the resulting ContactEquation that this ContactMaterial generate. Default value is {{#crossLink "Equation/DEFAULT_RELAXATION:property"}}Equation.DEFAULT_RELAXATION{{/crossLink}}.
       * @property relaxation
       * @type {Number}
       */this.relaxation=typeof options.relaxation!=="undefined"?Number(options.relaxation):Equation_1.DEFAULT_RELAXATION;/**
       * Stiffness of the resulting friction force. For most cases, the value of this property should be a large number. I cannot think of any case where you would want less frictionStiffness. Default value is {{#crossLink "Equation/DEFAULT_STIFFNESS:property"}}Equation.DEFAULT_STIFFNESS{{/crossLink}}.
       * @property frictionStiffness
       * @type {Number}
       */this.frictionStiffness=typeof options.frictionStiffness!=="undefined"?Number(options.frictionStiffness):Equation_1.DEFAULT_STIFFNESS;/**
       * Relaxation of the resulting friction force. The default value should be good for most simulations. Default value is {{#crossLink "Equation/DEFAULT_RELAXATION:property"}}Equation.DEFAULT_RELAXATION{{/crossLink}}.
       * @property frictionRelaxation
       * @type {Number}
       */this.frictionRelaxation=typeof options.frictionRelaxation!=="undefined"?Number(options.frictionRelaxation):Equation_1.DEFAULT_RELAXATION;/**
       * Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.
       * @property {Number} surfaceVelocity
       * @default 0
       */this.surfaceVelocity=typeof options.surfaceVelocity!=="undefined"?Number(options.surfaceVelocity):0;/**
       * Offset to be set on ContactEquations. A positive value will make the bodies penetrate more into each other. Can be useful in scenes where contacts need to be more persistent, for example when stacking. Aka "cure for nervous contacts".
       * @property contactSkinSize
       * @type {Number}
       */this.contactSkinSize=0.005;}ContactMaterial.idCounter=0;var DistanceConstraint_1=DistanceConstraint;/**
   * Constraint that tries to keep the distance between two bodies constant.
   *
   * @class DistanceConstraint
   * @constructor
   * @author schteppe
   * @param {Body} bodyA
   * @param {Body} bodyB
   * @param {object} [options]
   * @param {number} [options.distance] The distance to keep between the anchor points. Defaults to the current distance between the bodies.
   * @param {Array} [options.localAnchorA] The anchor point for bodyA, defined locally in bodyA frame. Defaults to [0,0].
   * @param {Array} [options.localAnchorB] The anchor point for bodyB, defined locally in bodyB frame. Defaults to [0,0].
   * @param {object} [options.maxForce=Number.MAX_VALUE] Maximum force to apply.
   * @extends Constraint
   *
   * @example
   *     // If distance is not given as an option, then the current distance between the bodies is used.
   *     // In this example, the bodies will be constrained to have a distance of 2 between their centers.
   *     var bodyA = new Body({ mass: 1, position: [-1, 0] });
   *     var bodyB = new Body({ mass: 1, position: [1, 0] });
   *     var constraint = new DistanceConstraint(bodyA, bodyB);
   *     world.addConstraint(constraint);
   *
   * @example
   *     // Manually set the distance and anchors
   *     var constraint = new DistanceConstraint(bodyA, bodyB, {
   *         distance: 1,          // Distance to keep between the points
   *         localAnchorA: [1, 0], // Point on bodyA
   *         localAnchorB: [-1, 0] // Point on bodyB
   *     });
   *     world.addConstraint(constraint);
   */function DistanceConstraint(bodyA,bodyB,options){options=Utils_1.defaults(options,{localAnchorA:[0,0],localAnchorB:[0,0]});Constraint_1.call(this,bodyA,bodyB,Constraint_1.DISTANCE,options);/**
       * Local anchor in body A.
       * @property localAnchorA
       * @type {Array}
       */this.localAnchorA=vec2_1.fromValues(options.localAnchorA[0],options.localAnchorA[1]);/**
       * Local anchor in body B.
       * @property localAnchorB
       * @type {Array}
       */this.localAnchorB=vec2_1.fromValues(options.localAnchorB[0],options.localAnchorB[1]);var localAnchorA=this.localAnchorA;var localAnchorB=this.localAnchorB;/**
       * The distance to keep.
       * @property distance
       * @type {Number}
       */this.distance=0;if(typeof options.distance==='number'){this.distance=options.distance;}else{// Use the current world distance between the world anchor points.
var worldAnchorA=vec2_1.create(),worldAnchorB=vec2_1.create(),r=vec2_1.create();// Transform local anchors to world
vec2_1.rotate(worldAnchorA,localAnchorA,bodyA.angle);vec2_1.rotate(worldAnchorB,localAnchorB,bodyB.angle);vec2_1.add(r,bodyB.position,worldAnchorB);vec2_1.sub(r,r,worldAnchorA);vec2_1.sub(r,r,bodyA.position);this.distance=vec2_1.length(r);}var maxForce;if(typeof options.maxForce==="undefined"){maxForce=Number.MAX_VALUE;}else{maxForce=options.maxForce;}var normal=new Equation_1(bodyA,bodyB,-maxForce,maxForce);// Just in the normal direction
this.equations=[normal];/**
       * Max force to apply.
       * @property {number} maxForce
       */this.maxForce=maxForce;// g = (xi - xj).dot(n)
// dg/dt = (vi - vj).dot(n) = G*W = [n 0 -n 0] * [vi wi vj wj]'
// ...and if we were to include offset points:
// g =
//      (xj + rj - xi - ri).dot(n) - distance
//
// dg/dt =
//      (vj + wj x rj - vi - wi x ri).dot(n) =
//      { term 2 is near zero } =
//      [-n   -ri x n   n   rj x n] * [vi wi vj wj]' =
//      G * W
//
// => G = [-n -rixn n rjxn]
var r=vec2_1.create();var ri=vec2_1.create();// worldAnchorA
var rj=vec2_1.create();// worldAnchorB
var that=this;normal.computeGq=function(){var bodyA=this.bodyA,bodyB=this.bodyB,xi=bodyA.position,xj=bodyB.position;// Transform local anchors to world
vec2_1.rotate(ri,localAnchorA,bodyA.angle);vec2_1.rotate(rj,localAnchorB,bodyB.angle);vec2_1.add(r,xj,rj);vec2_1.sub(r,r,ri);vec2_1.sub(r,r,xi);//vec2.sub(r, bodyB.position, bodyA.position);
return vec2_1.length(r)-that.distance;};// Make the contact constraint bilateral
this.setMaxForce(maxForce);/**
       * If the upper limit is enabled or not.
       * @property {Boolean} upperLimitEnabled
       */this.upperLimitEnabled=false;/**
       * The upper constraint limit.
       * @property {number} upperLimit
       */this.upperLimit=1;/**
       * If the lower limit is enabled or not.
       * @property {Boolean} lowerLimitEnabled
       */this.lowerLimitEnabled=false;/**
       * The lower constraint limit.
       * @property {number} lowerLimit
       */this.lowerLimit=0;/**
       * Current constraint position. This is equal to the current distance between the world anchor points.
       * @property {number} position
       */this.position=0;}DistanceConstraint.prototype=new Constraint_1();DistanceConstraint.prototype.constructor=DistanceConstraint;/**
   * Update the constraint equations. Should be done if any of the bodies changed position, before solving.
   * @method update
   */var n=vec2_1.create();var ri=vec2_1.create();// worldAnchorA
var rj=vec2_1.create();// worldAnchorB
DistanceConstraint.prototype.update=function(){var normal=this.equations[0],bodyA=this.bodyA,bodyB=this.bodyB,distance=this.distance,xi=bodyA.position,xj=bodyB.position,normalEquation=this.equations[0],G=normal.G;// Transform local anchors to world
vec2_1.rotate(ri,this.localAnchorA,bodyA.angle);vec2_1.rotate(rj,this.localAnchorB,bodyB.angle);// Get world anchor points and normal
vec2_1.add(n,xj,rj);vec2_1.sub(n,n,ri);vec2_1.sub(n,n,xi);this.position=vec2_1.length(n);var violating=false;if(this.upperLimitEnabled){if(this.position>this.upperLimit){normalEquation.maxForce=0;normalEquation.minForce=-this.maxForce;this.distance=this.upperLimit;violating=true;}}if(this.lowerLimitEnabled){if(this.position<this.lowerLimit){normalEquation.maxForce=this.maxForce;normalEquation.minForce=0;this.distance=this.lowerLimit;violating=true;}}if((this.lowerLimitEnabled||this.upperLimitEnabled)&&!violating){// No constraint needed.
normalEquation.enabled=false;return;}normalEquation.enabled=true;vec2_1.normalize(n,n);// Caluclate cross products
var rixn=vec2_1.crossLength(ri,n),rjxn=vec2_1.crossLength(rj,n);// G = [-n -rixn n rjxn]
G[0]=-n[0];G[1]=-n[1];G[2]=-rixn;G[3]=n[0];G[4]=n[1];G[5]=rjxn;};/**
   * Set the max force to be used
   * @method setMaxForce
   * @param {Number} maxForce
   */DistanceConstraint.prototype.setMaxForce=function(maxForce){var normal=this.equations[0];normal.minForce=-maxForce;normal.maxForce=maxForce;};/**
   * Get the max force
   * @method getMaxForce
   * @return {Number}
   */DistanceConstraint.prototype.getMaxForce=function(){var normal=this.equations[0];return normal.maxForce;};var FrictionEquation_1=FrictionEquation;/**
   * Constrains the slipping in a contact along a tangent
   *
   * @class FrictionEquation
   * @constructor
   * @param {Body} bodyA
   * @param {Body} bodyB
   * @param {Number} slipForce
   * @extends Equation
   */function FrictionEquation(bodyA,bodyB,slipForce){Equation_1.call(this,bodyA,bodyB,-slipForce,slipForce);/**
       * Relative vector from center of body A to the contact point, world oriented.
       * @property contactPointA
       * @type {Array}
       */this.contactPointA=vec2_1.create();/**
       * Relative vector from center of body B to the contact point, world oriented.
       * @property contactPointB
       * @type {Array}
       */this.contactPointB=vec2_1.create();/**
       * Tangent vector that the friction force will act along. World oriented.
       * @property t
       * @type {Array}
       */this.t=vec2_1.create();/**
       * ContactEquations connected to this friction equation. The contact equations can be used to rescale the max force for the friction. If more than one contact equation is given, then the max force can be set to the average.
       * @property contactEquations
       * @type {ContactEquation}
       */this.contactEquations=[];/**
       * The shape in body i that triggered this friction.
       * @property shapeA
       * @type {Shape}
       * @todo Needed? The shape can be looked up via contactEquation.shapeA...
       */this.shapeA=null;/**
       * The shape in body j that triggered this friction.
       * @property shapeB
       * @type {Shape}
       * @todo Needed? The shape can be looked up via contactEquation.shapeB...
       */this.shapeB=null;/**
       * The friction coefficient to use.
       * @property frictionCoefficient
       * @type {Number}
       */this.frictionCoefficient=0.3;}FrictionEquation.prototype=new Equation_1();FrictionEquation.prototype.constructor=FrictionEquation;/**
   * Set the slipping condition for the constraint. The friction force cannot be
   * larger than this value.
   * @method setSlipForce
   * @param  {Number} slipForce
   */FrictionEquation.prototype.setSlipForce=function(slipForce){this.maxForce=slipForce;this.minForce=-slipForce;};/**
   * Get the max force for the constraint.
   * @method getSlipForce
   * @return {Number}
   */FrictionEquation.prototype.getSlipForce=function(){return this.maxForce;};FrictionEquation.prototype.computeB=function(a,b,h){var bi=this.bodyA,bj=this.bodyB,ri=this.contactPointA,rj=this.contactPointB,t=this.t,G=this.G;// G = [-t -rixt t rjxt]
// And remember, this is a pure velocity constraint, g is always zero!
G[0]=-t[0];G[1]=-t[1];G[2]=-vec2_1.crossLength(ri,t);G[3]=t[0];G[4]=t[1];G[5]=vec2_1.crossLength(rj,t);var GW=this.computeGW(),GiMf=this.computeGiMf();var B=/* - g * a  */-GW*b-h*GiMf;return B;};var FrictionEquationPool_1=FrictionEquationPool;/**
   * @class
   */function FrictionEquationPool(){Pool_1.apply(this,arguments);}FrictionEquationPool.prototype=new Pool_1();FrictionEquationPool.prototype.constructor=FrictionEquationPool;/**
   * @method create
   * @return {FrictionEquation}
   */FrictionEquationPool.prototype.create=function(){return new FrictionEquation_1();};/**
   * @method destroy
   * @param {FrictionEquation} equation
   * @return {FrictionEquationPool}
   */FrictionEquationPool.prototype.destroy=function(equation){equation.bodyA=equation.bodyB=null;return this;};var GearConstraint_1=GearConstraint;/**
   * Constrains the angle of two bodies to each other to be equal. If a gear ratio is not one, the angle of bodyA must be a multiple of the angle of bodyB.
   * @class GearConstraint
   * @constructor
   * @author schteppe
   * @param {Body}            bodyA
   * @param {Body}            bodyB
   * @param {Object}          [options]
   * @param {Number}          [options.angle=0] Relative angle between the bodies. Will be set to the current angle between the bodies (the gear ratio is accounted for).
   * @param {Number}          [options.ratio=1] Gear ratio.
   * @param {Number}          [options.maxTorque] Maximum torque to apply.
   * @extends Constraint
   *
   * @example
   *     var constraint = new GearConstraint(bodyA, bodyB);
   *     world.addConstraint(constraint);
   *
   * @example
   *     var constraint = new GearConstraint(bodyA, bodyB, {
   *         ratio: 2,
   *         maxTorque: 1000
   *     });
   *     world.addConstraint(constraint);
   */function GearConstraint(bodyA,bodyB,options){options=options||{};Constraint_1.call(this,bodyA,bodyB,Constraint_1.GEAR,options);/**
       * The gear ratio.
       * @property ratio
       * @type {Number}
       */this.ratio=options.ratio!==undefined?options.ratio:1;/**
       * The relative angle
       * @property angle
       * @type {Number}
       */this.angle=options.angle!==undefined?options.angle:bodyB.angle-this.ratio*bodyA.angle;// Send same parameters to the equation
options.angle=this.angle;options.ratio=this.ratio;this.equations=[new AngleLockEquation_1(bodyA,bodyB,options)];// Set max torque
if(options.maxTorque!==undefined){this.setMaxTorque(options.maxTorque);}}GearConstraint.prototype=new Constraint_1();GearConstraint.prototype.constructor=GearConstraint;GearConstraint.prototype.update=function(){var eq=this.equations[0];if(eq.ratio!==this.ratio){eq.setRatio(this.ratio);}eq.angle=this.angle;};/**
   * Set the max torque for the constraint.
   * @method setMaxTorque
   * @param {Number} torque
   */GearConstraint.prototype.setMaxTorque=function(torque){this.equations[0].setMaxTorque(torque);};/**
   * Get the max torque for the constraint.
   * @method getMaxTorque
   * @return {Number}
   */GearConstraint.prototype.getMaxTorque=function(torque){return this.equations[0].maxForce;};var Solver_1=Solver;/**
   * Base class for constraint solvers.
   * @class Solver
   * @constructor
   * @extends EventEmitter
   */function Solver(options,type){options=options||{};EventEmitter_1.call(this);this.type=type;/**
       * Current equations in the solver.
       *
       * @property equations
       * @type {Array}
       */this.equations=[];/**
       * Function that is used to sort all equations before each solve.
       * @property equationSortFunction
       * @type {function|boolean}
       */this.equationSortFunction=options.equationSortFunction||false;}Solver.prototype=new EventEmitter_1();Solver.prototype.constructor=Solver;/**
   * Method to be implemented in each subclass
   * @method solve
   * @param  {Number} dt
   * @param  {World} world
   */Solver.prototype.solve=function(dt,world){throw new Error("Solver.solve should be implemented by subclasses!");};var mockWorld={bodies:[]};/**
   * Solves all constraints in an island.
   * @method solveIsland
   * @param  {Number} dt
   * @param  {Island} island
   */Solver.prototype.solveIsland=function(dt,island){this.removeAllEquations();if(island.equations.length){// Add equations to solver
this.addEquations(island.equations);mockWorld.bodies.length=0;island.getBodies(mockWorld.bodies);// Solve
if(mockWorld.bodies.length){this.solve(dt,mockWorld);}}};/**
   * Sort all equations using the .equationSortFunction. Should be called by subclasses before solving.
   * @method sortEquations
   */Solver.prototype.sortEquations=function(){if(this.equationSortFunction){this.equations.sort(this.equationSortFunction);}};/**
   * Add an equation to be solved.
   *
   * @method addEquation
   * @param {Equation} eq
   */Solver.prototype.addEquation=function(eq){if(eq.enabled){this.equations.push(eq);}};/**
   * Add equations. Same as .addEquation, but this time the argument is an array of Equations
   *
   * @method addEquations
   * @param {Array} eqs
   */Solver.prototype.addEquations=function(eqs){//Utils.appendArray(this.equations,eqs);
for(var i=0,N=eqs.length;i!==N;i++){var eq=eqs[i];if(eq.enabled){this.equations.push(eq);}}};/**
   * Remove an equation.
   *
   * @method removeEquation
   * @param {Equation} eq
   */Solver.prototype.removeEquation=function(eq){var i=this.equations.indexOf(eq);if(i!==-1){this.equations.splice(i,1);}};/**
   * Remove all currently added equations.
   *
   * @method removeAllEquations
   */Solver.prototype.removeAllEquations=function(){this.equations.length=0;};Solver.GS=1;Solver.ISLAND=2;var GSSolver_1=GSSolver;/**
   * Iterative Gauss-Seidel constraint equation solver.
   *
   * @class GSSolver
   * @constructor
   * @extends Solver
   * @param {Object} [options]
   * @param {Number} [options.iterations=10]
   * @param {Number} [options.tolerance=0]
   */function GSSolver(options){Solver_1.call(this,options,Solver_1.GS);options=options||{};/**
       * The max number of iterations to do when solving. More gives better results, but is more expensive.
       * @property iterations
       * @type {Number}
       */this.iterations=options.iterations||10;/**
       * The error tolerance, per constraint. If the total error is below this limit, the solver will stop iterating. Set to zero for as good solution as possible, but to something larger than zero to make computations faster.
       * @property tolerance
       * @type {Number}
       * @default 1e-7
       */this.tolerance=options.tolerance||1e-7;this.arrayStep=30;this.lambda=new Utils_1.ARRAY_TYPE(this.arrayStep);this.Bs=new Utils_1.ARRAY_TYPE(this.arrayStep);this.invCs=new Utils_1.ARRAY_TYPE(this.arrayStep);/**
       * Set to true to set all right hand side terms to zero when solving. Can be handy for a few applications.
       * @property useZeroRHS
       * @type {Boolean}
       * @todo Remove, not used
       */this.useZeroRHS=false;/**
       * Number of solver iterations that are used to approximate normal forces used for friction (F_friction = mu * F_normal). These friction forces will override any other friction forces that are set. If you set frictionIterations = 0, then this feature will be disabled.
       *
       * Use only frictionIterations > 0 if the approximated normal force (F_normal = mass * gravity) is not good enough. Examples of where it can happen is in space games where gravity is zero, or in tall stacks where the normal force is large at bottom but small at top.
       *
       * @property frictionIterations
       * @type {Number}
       * @default 0
       */this.frictionIterations=options.frictionIterations!==undefined?0:options.frictionIterations;/**
       * The number of iterations that were made during the last solve. If .tolerance is zero, this value will always be equal to .iterations, but if .tolerance is larger than zero, and the solver can quit early, then this number will be somewhere between 1 and .iterations.
       * @property {Number} usedIterations
       */this.usedIterations=0;}GSSolver.prototype=new Solver_1();GSSolver.prototype.constructor=GSSolver;function setArrayZero(array){var l=array.length;while(l--){array[l]=+0.0;}}/**
   * Solve the system of equations
   * @method solve
   * @param  {Number}  h       Time step
   * @param  {World}   world    World to solve
   */GSSolver.prototype.solve=function(h,world){this.sortEquations();var iter=0,maxIter=this.iterations,maxFrictionIter=this.frictionIterations,equations=this.equations,Neq=equations.length,tolSquared=Math.pow(this.tolerance*Neq,2),bodies=world.bodies,Nbodies=world.bodies.length,add=vec2_1.add,set=vec2_1.set,useZeroRHS=this.useZeroRHS,lambda=this.lambda;this.usedIterations=0;if(Neq){for(var i=0;i!==Nbodies;i++){var b=bodies[i];// Update solve mass
b.updateSolveMassProperties();}}// Things that does not change during iteration can be computed once
if(lambda.length<Neq){lambda=this.lambda=new Utils_1.ARRAY_TYPE(Neq+this.arrayStep);this.Bs=new Utils_1.ARRAY_TYPE(Neq+this.arrayStep);this.invCs=new Utils_1.ARRAY_TYPE(Neq+this.arrayStep);}setArrayZero(lambda);var invCs=this.invCs,Bs=this.Bs,lambda=this.lambda;for(var i=0;i!==equations.length;i++){var c=equations[i];if(c.timeStep!==h||c.needsUpdate){c.timeStep=h;c.update();}Bs[i]=c.computeB(c.a,c.b,h);invCs[i]=c.computeInvC(c.epsilon);}var c,deltalambdaTot,i,j;if(Neq!==0){for(i=0;i!==Nbodies;i++){var b=bodies[i];// Reset vlambda
b.resetConstraintVelocity();}if(maxFrictionIter){// Iterate over contact equations to get normal forces
for(iter=0;iter!==maxFrictionIter;iter++){// Accumulate the total error for each iteration.
deltalambdaTot=0.0;for(j=0;j!==Neq;j++){c=equations[j];var deltalambda=GSSolver.iterateEquation(j,c,c.epsilon,Bs,invCs,lambda,useZeroRHS,h,iter);deltalambdaTot+=Math.abs(deltalambda);}this.usedIterations++;// If the total error is small enough - stop iterate
if(deltalambdaTot*deltalambdaTot<=tolSquared){break;}}GSSolver.updateMultipliers(equations,lambda,1/h);// Set computed friction force
for(j=0;j!==Neq;j++){var eq=equations[j];if(eq instanceof FrictionEquation_1){var f=0.0;for(var k=0;k!==eq.contactEquations.length;k++){f+=eq.contactEquations[k].multiplier;}f*=eq.frictionCoefficient/eq.contactEquations.length;eq.maxForce=f;eq.minForce=-f;}}}// Iterate over all equations
for(iter=0;iter!==maxIter;iter++){// Accumulate the total error for each iteration.
deltalambdaTot=0.0;for(j=0;j!==Neq;j++){c=equations[j];var deltalambda=GSSolver.iterateEquation(j,c,c.epsilon,Bs,invCs,lambda,useZeroRHS,h,iter);deltalambdaTot+=Math.abs(deltalambda);}this.usedIterations++;// If the total error is small enough - stop iterate
if(deltalambdaTot*deltalambdaTot<=tolSquared){break;}}// Add result to velocity
for(i=0;i!==Nbodies;i++){bodies[i].addConstraintVelocity();}GSSolver.updateMultipliers(equations,lambda,1/h);}};// Sets the .multiplier property of each equation
GSSolver.updateMultipliers=function(equations,lambda,invDt){// Set the .multiplier property of each equation
var l=equations.length;while(l--){equations[l].multiplier=lambda[l]*invDt;}};GSSolver.iterateEquation=function(j,eq,eps,Bs,invCs,lambda,useZeroRHS,dt,iter){// Compute iteration
var B=Bs[j],invC=invCs[j],lambdaj=lambda[j],GWlambda=eq.computeGWlambda();var maxForce=eq.maxForce,minForce=eq.minForce;if(useZeroRHS){B=0;}var deltalambda=invC*(B-GWlambda-eps*lambdaj);// Clamp if we are not within the min/max interval
var lambdaj_plus_deltalambda=lambdaj+deltalambda;if(lambdaj_plus_deltalambda<minForce*dt){deltalambda=minForce*dt-lambdaj;}else if(lambdaj_plus_deltalambda>maxForce*dt){deltalambda=maxForce*dt-lambdaj;}lambda[j]+=deltalambda;eq.addToWlambda(deltalambda);return deltalambda;};var Heightfield_1=Heightfield;/**
   * Heightfield shape class. Height data is given as an array. These data points are spread out evenly with a distance "elementWidth".
   * @class Heightfield
   * @extends Shape
   * @constructor
   * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
   * @param {array} [options.heights] An array of Y values that will be used to construct the terrain.
   * @param {Number} [options.minValue] Minimum value of the data points in the data array. Will be computed automatically if not given.
   * @param {Number} [options.maxValue] Maximum value.
   * @param {Number} [options.elementWidth=0.1] World spacing between the data points in X direction.
   *
   * @example
   *     // Generate some height data (y-values).
   *     var heights = [];
   *     for(var i = 0; i < 1000; i++){
   *         var y = 0.5 * Math.cos(0.2 * i);
   *         heights.push(y);
   *     }
   *
   *     // Create the heightfield shape
   *     var heightfieldShape = new Heightfield({
   *         heights: heights,
   *         elementWidth: 1 // Distance between the data points in X direction
   *     });
   *     var heightfieldBody = new Body();
   *     heightfieldBody.addShape(heightfieldShape);
   *     world.addBody(heightfieldBody);
   *
   * @todo Should use a scale property with X and Y direction instead of just elementWidth
   */function Heightfield(options){if(Array.isArray(arguments[0])){options={heights:arguments[0]};if(_typeof2(arguments[1])==='object'){for(var key in arguments[1]){options[key]=arguments[1][key];}}console.warn('The Heightfield constructor signature has changed. Please use the following format: new Heightfield({ heights: [...], ... })');}options=options||{};/**
       * An array of numbers, or height values, that are spread out along the x axis.
       * @property {array} heights
       */this.heights=options.heights?options.heights.slice(0):[];/**
       * Max value of the heights
       * @property {number} maxValue
       */this.maxValue=options.maxValue||null;/**
       * Max value of the heights
       * @property {number} minValue
       */this.minValue=options.minValue||null;/**
       * The width of each element
       * @property {number} elementWidth
       */this.elementWidth=options.elementWidth||0.1;if(options.maxValue===undefined||options.minValue===undefined){this.updateMaxMinValues();}options.type=Shape_1.HEIGHTFIELD;Shape_1.call(this,options);}Heightfield.prototype=new Shape_1();Heightfield.prototype.constructor=Heightfield;/**
   * Update the .minValue and the .maxValue
   * @method updateMaxMinValues
   */Heightfield.prototype.updateMaxMinValues=function(){var data=this.heights;var maxValue=data[0];var minValue=data[0];for(var i=0;i!==data.length;i++){var v=data[i];if(v>maxValue){maxValue=v;}if(v<minValue){minValue=v;}}this.maxValue=maxValue;this.minValue=minValue;};/**
   * @method computeMomentOfInertia
   * @param  {Number} mass
   * @return {Number}
   */Heightfield.prototype.computeMomentOfInertia=function(mass){return Number.MAX_VALUE;};Heightfield.prototype.updateBoundingRadius=function(){this.boundingRadius=Number.MAX_VALUE;};Heightfield.prototype.updateArea=function(){var data=this.heights,area=0;for(var i=0;i<data.length-1;i++){area+=(data[i]+data[i+1])/2*this.elementWidth;}this.area=area;};var points=[vec2_1.create(),vec2_1.create(),vec2_1.create(),vec2_1.create()];/**
   * @method computeAABB
   * @param  {AABB}   out      The resulting AABB.
   * @param  {Array}  position
   * @param  {Number} angle
   */Heightfield.prototype.computeAABB=function(out,position,angle){vec2_1.set(points[0],0,this.maxValue);vec2_1.set(points[1],this.elementWidth*this.heights.length,this.maxValue);vec2_1.set(points[2],this.elementWidth*this.heights.length,this.minValue);vec2_1.set(points[3],0,this.minValue);out.setFromPoints(points,position,angle);};/**
   * Get a line segment in the heightfield
   * @method getLineSegment
   * @param  {array} start Where to store the resulting start point
   * @param  {array} end Where to store the resulting end point
   * @param  {number} i
   */Heightfield.prototype.getLineSegment=function(start,end,i){var data=this.heights;var width=this.elementWidth;vec2_1.set(start,i*width,data[i]);vec2_1.set(end,(i+1)*width,data[i+1]);};Heightfield.prototype.getSegmentIndex=function(position){return Math.floor(position[0]/this.elementWidth);};Heightfield.prototype.getClampedSegmentIndex=function(position){var i=this.getSegmentIndex(position);i=Math.min(this.heights.length,Math.max(i,0));// clamp
return i;};var intersectHeightfield_hitPointWorld=vec2_1.create();var intersectHeightfield_worldNormal=vec2_1.create();var intersectHeightfield_l0=vec2_1.create();var intersectHeightfield_l1=vec2_1.create();var intersectHeightfield_localFrom=vec2_1.create();var intersectHeightfield_localTo=vec2_1.create();var intersectHeightfield_unit_y=vec2_1.fromValues(0,1);/**
   * @method raycast
   * @param  {RayResult} result
   * @param  {Ray} ray
   * @param  {array} position
   * @param  {number} angle
   */Heightfield.prototype.raycast=function(result,ray,position,angle){var from=ray.from;var to=ray.to;var direction=ray.direction;var worldNormal=intersectHeightfield_worldNormal;var l0=intersectHeightfield_l0;var l1=intersectHeightfield_l1;var localFrom=intersectHeightfield_localFrom;var localTo=intersectHeightfield_localTo;// get local ray start and end
vec2_1.toLocalFrame(localFrom,from,position,angle);vec2_1.toLocalFrame(localTo,to,position,angle);// Get the segment range
var i0=this.getClampedSegmentIndex(localFrom);var i1=this.getClampedSegmentIndex(localTo);if(i0>i1){var tmp=i0;i0=i1;i1=tmp;}// The segments
for(var i=0;i<this.heights.length-1;i++){this.getLineSegment(l0,l1,i);var t=vec2_1.getLineSegmentsIntersectionFraction(localFrom,localTo,l0,l1);if(t>=0){vec2_1.sub(worldNormal,l1,l0);vec2_1.rotate(worldNormal,worldNormal,angle+Math.PI/2);vec2_1.normalize(worldNormal,worldNormal);ray.reportIntersection(result,t,worldNormal,-1);if(result.shouldStop(ray)){return;}}}};var Line_1$1=Line$1;/**
   * Line shape class. The line shape is along the x direction, and stretches from [-length/2, 0] to [length/2,0].
   * @class Line
   * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
   * @param {Number} [options.length=1] The total length of the line
   * @extends Shape
   * @constructor
   */function Line$1(options){if(typeof arguments[0]==='number'){options={length:arguments[0]};console.warn('The Line constructor signature has changed. Please use the following format: new Line({ length: 1, ... })');}options=options||{};/**
       * Length of this line
       * @property {Number} length
       * @default 1
       */this.length=options.length||1;options.type=Shape_1.LINE;Shape_1.call(this,options);}Line$1.prototype=new Shape_1();Line$1.prototype.constructor=Line$1;Line$1.prototype.computeMomentOfInertia=function(mass){return mass*Math.pow(this.length,2)/12;};Line$1.prototype.updateBoundingRadius=function(){this.boundingRadius=this.length/2;};var points$1=[vec2_1.create(),vec2_1.create()];/**
   * @method computeAABB
   * @param  {AABB}   out      The resulting AABB.
   * @param  {Array}  position
   * @param  {Number} angle
   */Line$1.prototype.computeAABB=function(out,position,angle){var l2=this.length/2;vec2_1.set(points$1[0],-l2,0);vec2_1.set(points$1[1],l2,0);out.setFromPoints(points$1,position,angle,0);};var raycast_hitPoint=vec2_1.create();var raycast_normal=vec2_1.create();var raycast_l0=vec2_1.create();var raycast_l1=vec2_1.create();var raycast_unit_y=vec2_1.fromValues(0,1);/**
   * @method raycast
   * @param  {RaycastResult} result
   * @param  {Ray} ray
   * @param  {number} angle
   * @param  {array} position
   */Line$1.prototype.raycast=function(result,ray,position,angle){var from=ray.from;var to=ray.to;var l0=raycast_l0;var l1=raycast_l1;// get start and end of the line
var halfLen=this.length/2;vec2_1.set(l0,-halfLen,0);vec2_1.set(l1,halfLen,0);vec2_1.toGlobalFrame(l0,l0,position,angle);vec2_1.toGlobalFrame(l1,l1,position,angle);var fraction=vec2_1.getLineSegmentsIntersectionFraction(l0,l1,from,to);if(fraction>=0){var normal=raycast_normal;vec2_1.rotate(normal,raycast_unit_y,angle);// todo: this should depend on which side the ray comes from
ray.reportIntersection(result,fraction,normal,-1);}};var LockConstraint_1=LockConstraint;/**
   * Locks the relative position and rotation between two bodies.
   *
   * @class LockConstraint
   * @constructor
   * @author schteppe
   * @param {Body} bodyA
   * @param {Body} bodyB
   * @param {Object} [options]
   * @param {Array}  [options.localOffsetB] The offset of bodyB in bodyA's frame. If not given the offset is computed from current positions.
   * @param {number} [options.localAngleB] The angle of bodyB in bodyA's frame. If not given, the angle is computed from current angles.
   * @param {number} [options.maxForce]
   * @extends Constraint
   *
   * @example
   *     // Locks the relative position and rotation between bodyA and bodyB
   *     var constraint = new LockConstraint(bodyA, bodyB);
   *     world.addConstraint(constraint);
   */function LockConstraint(bodyA,bodyB,options){options=options||{};Constraint_1.call(this,bodyA,bodyB,Constraint_1.LOCK,options);var maxForce=typeof options.maxForce==="undefined"?Number.MAX_VALUE:options.maxForce;var localAngleB=options.localAngleB||0;// Use 3 equations:
// gx =   (xj - xi - l) * xhat = 0
// gy =   (xj - xi - l) * yhat = 0
// gr =   (xi - xj + r) * that = 0
//
// ...where:
//   l is the localOffsetB vector rotated to world in bodyA frame
//   r is the same vector but reversed and rotated from bodyB frame
//   xhat, yhat are world axis vectors
//   that is the tangent of r
//
// For the first two constraints, we get
// G*W = (vj - vi - ldot  ) * xhat
//     = (vj - vi - wi x l) * xhat
//
// Since (wi x l) * xhat = (l x xhat) * wi, we get
// G*W = [ -1   0   (-l x xhat)  1   0   0] * [vi wi vj wj]
//
// The last constraint gives
// GW = (vi - vj + wj x r) * that
//    = [  that   0  -that  (r x t) ]
var x=new Equation_1(bodyA,bodyB,-maxForce,maxForce),y=new Equation_1(bodyA,bodyB,-maxForce,maxForce),rot=new Equation_1(bodyA,bodyB,-maxForce,maxForce);var l=vec2_1.create(),g=vec2_1.create(),that=this;x.computeGq=function(){vec2_1.rotate(l,that.localOffsetB,bodyA.angle);vec2_1.sub(g,bodyB.position,bodyA.position);vec2_1.sub(g,g,l);return g[0];};y.computeGq=function(){vec2_1.rotate(l,that.localOffsetB,bodyA.angle);vec2_1.sub(g,bodyB.position,bodyA.position);vec2_1.sub(g,g,l);return g[1];};var r=vec2_1.create(),t=vec2_1.create();rot.computeGq=function(){vec2_1.rotate(r,that.localOffsetB,bodyB.angle-that.localAngleB);vec2_1.scale(r,r,-1);vec2_1.sub(g,bodyA.position,bodyB.position);vec2_1.add(g,g,r);vec2_1.rotate(t,r,-Math.PI/2);vec2_1.normalize(t,t);return vec2_1.dot(g,t);};/**
       * The offset of bodyB in bodyA's frame.
       * @property {Array} localOffsetB
       */this.localOffsetB=vec2_1.create();if(options.localOffsetB){vec2_1.copy(this.localOffsetB,options.localOffsetB);}else{// Construct from current positions
vec2_1.sub(this.localOffsetB,bodyB.position,bodyA.position);vec2_1.rotate(this.localOffsetB,this.localOffsetB,-bodyA.angle);}/**
       * The offset angle of bodyB in bodyA's frame.
       * @property {Number} localAngleB
       */this.localAngleB=0;if(typeof options.localAngleB==='number'){this.localAngleB=options.localAngleB;}else{// Construct
this.localAngleB=bodyB.angle-bodyA.angle;}this.equations.push(x,y,rot);this.setMaxForce(maxForce);}LockConstraint.prototype=new Constraint_1();LockConstraint.prototype.constructor=LockConstraint;/**
   * Set the maximum force to be applied.
   * @method setMaxForce
   * @param {Number} force
   */LockConstraint.prototype.setMaxForce=function(force){var eqs=this.equations;for(var i=0;i<this.equations.length;i++){eqs[i].maxForce=force;eqs[i].minForce=-force;}};/**
   * Get the max force.
   * @method getMaxForce
   * @return {Number}
   */LockConstraint.prototype.getMaxForce=function(){return this.equations[0].maxForce;};var l=vec2_1.create();var r$1=vec2_1.create();var t=vec2_1.create();var xAxis=vec2_1.fromValues(1,0);var yAxis=vec2_1.fromValues(0,1);LockConstraint.prototype.update=function(){var x=this.equations[0],y=this.equations[1],rot=this.equations[2],bodyA=this.bodyA,bodyB=this.bodyB;vec2_1.rotate(l,this.localOffsetB,bodyA.angle);vec2_1.rotate(r$1,this.localOffsetB,bodyB.angle-this.localAngleB);vec2_1.scale(r$1,r$1,-1);vec2_1.rotate(t,r$1,Math.PI/2);vec2_1.normalize(t,t);x.G[0]=-1;x.G[1]=0;x.G[2]=-vec2_1.crossLength(l,xAxis);x.G[3]=1;y.G[0]=0;y.G[1]=-1;y.G[2]=-vec2_1.crossLength(l,yAxis);y.G[4]=1;rot.G[0]=-t[0];rot.G[1]=-t[1];rot.G[3]=t[0];rot.G[4]=t[1];rot.G[5]=vec2_1.crossLength(r$1,t);};var TupleDictionary_1=TupleDictionary;/**
   * @class TupleDictionary
   * @constructor
   */function TupleDictionary(){/**
       * The data storage
       * @property data
       * @type {Object}
       */this.data={};/**
       * Keys that are currently used.
       * @property {Array} keys
       */this.keys=[];}/**
   * Generate a key given two integers
   * @method getKey
   * @param  {number} i
   * @param  {number} j
   * @return {string}
   */TupleDictionary.prototype.getKey=function(id1,id2){id1=id1|0;id2=id2|0;if((id1|0)===(id2|0)){return-1;}// valid for values < 2^16
return((id1|0)>(id2|0)?id1<<16|id2&0xFFFF:id2<<16|id1&0xFFFF)|0;};/**
   * @method getByKey
   * @param  {Number} key
   * @return {Object}
   */TupleDictionary.prototype.getByKey=function(key){key=key|0;return this.data[key];};/**
   * @method get
   * @param  {Number} i
   * @param  {Number} j
   * @return {Number}
   */TupleDictionary.prototype.get=function(i,j){return this.data[this.getKey(i,j)];};/**
   * Set a value.
   * @method set
   * @param  {Number} i
   * @param  {Number} j
   * @param {Number} value
   */TupleDictionary.prototype.set=function(i,j,value){if(!value){throw new Error("No data!");}var key=this.getKey(i,j);// Check if key already exists
if(!this.data[key]){this.keys.push(key);}this.data[key]=value;return key;};/**
   * Remove all data.
   * @method reset
   */TupleDictionary.prototype.reset=function(){var data=this.data,keys=this.keys;var l=keys.length;while(l--){delete data[keys[l]];}keys.length=0;};/**
   * Copy another TupleDictionary. Note that all data in this dictionary will be removed.
   * @method copy
   * @param {TupleDictionary} dict The TupleDictionary to copy into this one.
   */TupleDictionary.prototype.copy=function(dict){this.reset();Utils_1.appendArray(this.keys,dict.keys);var l=dict.keys.length;while(l--){var key=dict.keys[l];this.data[key]=dict.data[key];}};var Box_1=Box;/**
   * Box shape class.
   * @class Box
   * @constructor
   * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
   * @param {Number} [options.width=1] Total width of the box
   * @param {Number} [options.height=1] Total height of the box
   * @extends Convex
   */function Box(options){if(typeof arguments[0]==='number'&&typeof arguments[1]==='number'){options={width:arguments[0],height:arguments[1]};console.warn('The Rectangle has been renamed to Box and its constructor signature has changed. Please use the following format: new Box({ width: 1, height: 1, ... })');}options=options||{};/**
       * Total width of the box
       * @property width
       * @type {Number}
       */var width=this.width=options.width||1;/**
       * Total height of the box
       * @property height
       * @type {Number}
       */var height=this.height=options.height||1;var verts=[vec2_1.fromValues(-width/2,-height/2),vec2_1.fromValues(width/2,-height/2),vec2_1.fromValues(width/2,height/2),vec2_1.fromValues(-width/2,height/2)];var axes=[vec2_1.fromValues(1,0),vec2_1.fromValues(0,1)];options.vertices=verts;options.axes=axes;options.type=Shape_1.BOX;Convex_1.call(this,options);}Box.prototype=new Convex_1();Box.prototype.constructor=Box;/**
   * Compute moment of inertia
   * @method computeMomentOfInertia
   * @param  {Number} mass
   * @return {Number}
   */Box.prototype.computeMomentOfInertia=function(mass){var w=this.width,h=this.height;return mass*(h*h+w*w)/12;};/**
   * Update the bounding radius
   * @method updateBoundingRadius
   */Box.prototype.updateBoundingRadius=function(){var w=this.width,h=this.height;this.boundingRadius=Math.sqrt(w*w+h*h)/2;};var corner1=vec2_1.create(),corner2=vec2_1.create(),corner3=vec2_1.create(),corner4=vec2_1.create();/**
   * @method computeAABB
   * @param  {AABB}   out      The resulting AABB.
   * @param  {Array}  position
   * @param  {Number} angle
   */Box.prototype.computeAABB=function(out,position,angle){out.setFromPoints(this.vertices,position,angle,0);};Box.prototype.updateArea=function(){this.area=this.width*this.height;};var sub=vec2_1.sub,add=vec2_1.add,dot=vec2_1.dot;var Narrowphase_1=Narrowphase;// Temp things
var yAxis$1=vec2_1.fromValues(0,1);var tmp1=vec2_1.fromValues(0,0),tmp2=vec2_1.fromValues(0,0),tmp3=vec2_1.fromValues(0,0),tmp4=vec2_1.fromValues(0,0),tmp5=vec2_1.fromValues(0,0),tmp6=vec2_1.fromValues(0,0),tmp7=vec2_1.fromValues(0,0),tmp8=vec2_1.fromValues(0,0),tmp9=vec2_1.fromValues(0,0),tmp10=vec2_1.fromValues(0,0),tmp11=vec2_1.fromValues(0,0),tmp12=vec2_1.fromValues(0,0),tmp13=vec2_1.fromValues(0,0),tmp14=vec2_1.fromValues(0,0),tmp15=vec2_1.fromValues(0,0),tmp16=vec2_1.fromValues(0,0),tmp17=vec2_1.fromValues(0,0),tmp18=vec2_1.fromValues(0,0),tmpArray=[];/**
   * Narrowphase. Creates contacts and friction given shapes and transforms.
   * @class Narrowphase
   * @constructor
   */function Narrowphase(){/**
       * @property contactEquations
       * @type {Array}
       */this.contactEquations=[];/**
       * @property frictionEquations
       * @type {Array}
       */this.frictionEquations=[];/**
       * Whether to make friction equations in the upcoming contacts.
       * @property enableFriction
       * @type {Boolean}
       */this.enableFriction=true;/**
       * Whether to make equations enabled in upcoming contacts.
       * @property enabledEquations
       * @type {Boolean}
       */this.enabledEquations=true;/**
       * The friction slip force to use when creating friction equations.
       * @property slipForce
       * @type {Number}
       */this.slipForce=10.0;/**
       * The friction value to use in the upcoming friction equations.
       * @property frictionCoefficient
       * @type {Number}
       */this.frictionCoefficient=0.3;/**
       * Will be the .relativeVelocity in each produced FrictionEquation.
       * @property {Number} surfaceVelocity
       */this.surfaceVelocity=0;/**
       * Keeps track of the allocated ContactEquations.
       * @property {ContactEquationPool} contactEquationPool
       *
       * @example
       *
       *     // Allocate a few equations before starting the simulation.
       *     // This way, no contact objects need to be created on the fly in the game loop.
       *     world.narrowphase.contactEquationPool.resize(1024);
       *     world.narrowphase.frictionEquationPool.resize(1024);
       */this.contactEquationPool=new ContactEquationPool_1({size:32});/**
       * Keeps track of the allocated ContactEquations.
       * @property {FrictionEquationPool} frictionEquationPool
       */this.frictionEquationPool=new FrictionEquationPool_1({size:64});/**
       * The restitution value to use in the next contact equations.
       * @property restitution
       * @type {Number}
       */this.restitution=0;/**
       * The stiffness value to use in the next contact equations.
       * @property {Number} stiffness
       */this.stiffness=Equation_1.DEFAULT_STIFFNESS;/**
       * The stiffness value to use in the next contact equations.
       * @property {Number} stiffness
       */this.relaxation=Equation_1.DEFAULT_RELAXATION;/**
       * The stiffness value to use in the next friction equations.
       * @property frictionStiffness
       * @type {Number}
       */this.frictionStiffness=Equation_1.DEFAULT_STIFFNESS;/**
       * The relaxation value to use in the next friction equations.
       * @property frictionRelaxation
       * @type {Number}
       */this.frictionRelaxation=Equation_1.DEFAULT_RELAXATION;/**
       * Enable reduction of friction equations. If disabled, a box on a plane will generate 2 contact equations and 2 friction equations. If enabled, there will be only one friction equation. Same kind of simplifications are made  for all collision types.
       * @property enableFrictionReduction
       * @type {Boolean}
       * @deprecated This flag will be removed when the feature is stable enough.
       * @default true
       */this.enableFrictionReduction=true;/**
       * Keeps track of the colliding bodies last step.
       * @private
       * @property collidingBodiesLastStep
       * @type {TupleDictionary}
       */this.collidingBodiesLastStep=new TupleDictionary_1();/**
       * Contact skin size value to use in the next contact equations.
       * @property {Number} contactSkinSize
       * @default 0.01
       */this.contactSkinSize=0.01;}var bodiesOverlap_shapePositionA=vec2_1.create();var bodiesOverlap_shapePositionB=vec2_1.create();/**
   * @method bodiesOverlap
   * @param  {Body} bodyA
   * @param  {Body} bodyB
   * @return {Boolean}
   * @todo shape world transforms are wrong
   */Narrowphase.prototype.bodiesOverlap=function(bodyA,bodyB){var shapePositionA=bodiesOverlap_shapePositionA;var shapePositionB=bodiesOverlap_shapePositionB;// Loop over all shapes of bodyA
for(var k=0,Nshapesi=bodyA.shapes.length;k!==Nshapesi;k++){var shapeA=bodyA.shapes[k];bodyA.toWorldFrame(shapePositionA,shapeA.position);// All shapes of body j
for(var l=0,Nshapesj=bodyB.shapes.length;l!==Nshapesj;l++){var shapeB=bodyB.shapes[l];bodyB.toWorldFrame(shapePositionB,shapeB.position);if(this[shapeA.type|shapeB.type](bodyA,shapeA,shapePositionA,shapeA.angle+bodyA.angle,bodyB,shapeB,shapePositionB,shapeB.angle+bodyB.angle,true)){return true;}}}return false;};/**
   * Check if the bodies were in contact since the last reset().
   * @method collidedLastStep
   * @param  {Body} bodyA
   * @param  {Body} bodyB
   * @return {Boolean}
   */Narrowphase.prototype.collidedLastStep=function(bodyA,bodyB){var id1=bodyA.id|0,id2=bodyB.id|0;return!!this.collidingBodiesLastStep.get(id1,id2);};/**
   * Throws away the old equations and gets ready to create new
   * @method reset
   */Narrowphase.prototype.reset=function(){this.collidingBodiesLastStep.reset();var eqs=this.contactEquations;var l=eqs.length;while(l--){var eq=eqs[l],id1=eq.bodyA.id,id2=eq.bodyB.id;this.collidingBodiesLastStep.set(id1,id2,true);}var ce=this.contactEquations,fe=this.frictionEquations;for(var i=0;i<ce.length;i++){this.contactEquationPool.release(ce[i]);}for(var i=0;i<fe.length;i++){this.frictionEquationPool.release(fe[i]);}// Reset
this.contactEquations.length=this.frictionEquations.length=0;};/**
   * Creates a ContactEquation, either by reusing an existing object or creating a new one.
   * @method createContactEquation
   * @param  {Body} bodyA
   * @param  {Body} bodyB
   * @return {ContactEquation}
   */Narrowphase.prototype.createContactEquation=function(bodyA,bodyB,shapeA,shapeB){var c=this.contactEquationPool.get();c.bodyA=bodyA;c.bodyB=bodyB;c.shapeA=shapeA;c.shapeB=shapeB;c.restitution=this.restitution;c.firstImpact=!this.collidedLastStep(bodyA,bodyB);c.stiffness=this.stiffness;c.relaxation=this.relaxation;c.needsUpdate=true;c.enabled=this.enabledEquations;c.offset=this.contactSkinSize;return c;};/**
   * Creates a FrictionEquation, either by reusing an existing object or creating a new one.
   * @method createFrictionEquation
   * @param  {Body} bodyA
   * @param  {Body} bodyB
   * @return {FrictionEquation}
   */Narrowphase.prototype.createFrictionEquation=function(bodyA,bodyB,shapeA,shapeB){var c=this.frictionEquationPool.get();c.bodyA=bodyA;c.bodyB=bodyB;c.shapeA=shapeA;c.shapeB=shapeB;c.setSlipForce(this.slipForce);c.frictionCoefficient=this.frictionCoefficient;c.relativeVelocity=this.surfaceVelocity;c.enabled=this.enabledEquations;c.needsUpdate=true;c.stiffness=this.frictionStiffness;c.relaxation=this.frictionRelaxation;c.contactEquations.length=0;return c;};/**
   * Creates a FrictionEquation given the data in the ContactEquation. Uses same offset vectors ri and rj, but the tangent vector will be constructed from the collision normal.
   * @method createFrictionFromContact
   * @param  {ContactEquation} contactEquation
   * @return {FrictionEquation}
   */Narrowphase.prototype.createFrictionFromContact=function(c){var eq=this.createFrictionEquation(c.bodyA,c.bodyB,c.shapeA,c.shapeB);vec2_1.copy(eq.contactPointA,c.contactPointA);vec2_1.copy(eq.contactPointB,c.contactPointB);vec2_1.rotate90cw(eq.t,c.normalA);eq.contactEquations.push(c);return eq;};// Take the average N latest contact point on the plane.
Narrowphase.prototype.createFrictionFromAverage=function(numContacts){var c=this.contactEquations[this.contactEquations.length-1];var eq=this.createFrictionEquation(c.bodyA,c.bodyB,c.shapeA,c.shapeB);var bodyA=c.bodyA;var bodyB=c.bodyB;vec2_1.set(eq.contactPointA,0,0);vec2_1.set(eq.contactPointB,0,0);vec2_1.set(eq.t,0,0);for(var i=0;i!==numContacts;i++){c=this.contactEquations[this.contactEquations.length-1-i];if(c.bodyA===bodyA){vec2_1.add(eq.t,eq.t,c.normalA);vec2_1.add(eq.contactPointA,eq.contactPointA,c.contactPointA);vec2_1.add(eq.contactPointB,eq.contactPointB,c.contactPointB);}else{vec2_1.sub(eq.t,eq.t,c.normalA);vec2_1.add(eq.contactPointA,eq.contactPointA,c.contactPointB);vec2_1.add(eq.contactPointB,eq.contactPointB,c.contactPointA);}eq.contactEquations.push(c);}var invNumContacts=1/numContacts;vec2_1.scale(eq.contactPointA,eq.contactPointA,invNumContacts);vec2_1.scale(eq.contactPointB,eq.contactPointB,invNumContacts);vec2_1.normalize(eq.t,eq.t);vec2_1.rotate90cw(eq.t,eq.t);return eq;};/**
   * Convex/line narrowphase
   * @method convexLine
   * @param  {Body}       convexBody
   * @param  {Convex}     convexShape
   * @param  {Array}      convexOffset
   * @param  {Number}     convexAngle
   * @param  {Body}       lineBody
   * @param  {Line}       lineShape
   * @param  {Array}      lineOffset
   * @param  {Number}     lineAngle
   * @param {boolean}     justTest
   * @todo Implement me!
   */Narrowphase.prototype[Shape_1.LINE|Shape_1.CONVEX]=Narrowphase.prototype.convexLine=function(convexBody,convexShape,convexOffset,convexAngle,lineBody,lineShape,lineOffset,lineAngle,justTest){// TODO
if(justTest){return false;}else{return 0;}};/**
   * Line/box narrowphase
   * @method lineBox
   * @param  {Body}       lineBody
   * @param  {Line}       lineShape
   * @param  {Array}      lineOffset
   * @param  {Number}     lineAngle
   * @param  {Body}       boxBody
   * @param  {Box}  boxShape
   * @param  {Array}      boxOffset
   * @param  {Number}     boxAngle
   * @param  {Boolean}    justTest
   * @todo Implement me!
   */Narrowphase.prototype[Shape_1.LINE|Shape_1.BOX]=Narrowphase.prototype.lineBox=function(lineBody,lineShape,lineOffset,lineAngle,boxBody,boxShape,boxOffset,boxAngle,justTest){// TODO
if(justTest){return false;}else{return 0;}};function setConvexToCapsuleShapeMiddle(convexShape,capsuleShape){vec2_1.set(convexShape.vertices[0],-capsuleShape.length*0.5,-capsuleShape.radius);vec2_1.set(convexShape.vertices[1],capsuleShape.length*0.5,-capsuleShape.radius);vec2_1.set(convexShape.vertices[2],capsuleShape.length*0.5,capsuleShape.radius);vec2_1.set(convexShape.vertices[3],-capsuleShape.length*0.5,capsuleShape.radius);}var convexCapsule_tempRect=new Box_1({width:1,height:1}),convexCapsule_tempVec=vec2_1.create();/**
   * Convex/capsule narrowphase
   * @method convexCapsule
   * @param  {Body}       convexBody
   * @param  {Convex}     convexShape
   * @param  {Array}      convexPosition
   * @param  {Number}     convexAngle
   * @param  {Body}       capsuleBody
   * @param  {Capsule}    capsuleShape
   * @param  {Array}      capsulePosition
   * @param  {Number}     capsuleAngle
   */Narrowphase.prototype[Shape_1.CAPSULE|Shape_1.CONVEX]=Narrowphase.prototype[Shape_1.CAPSULE|Shape_1.BOX]=Narrowphase.prototype.convexCapsule=function(convexBody,convexShape,convexPosition,convexAngle,capsuleBody,capsuleShape,capsulePosition,capsuleAngle,justTest){// Check the circles
// Add offsets!
var circlePos=convexCapsule_tempVec;vec2_1.set(circlePos,capsuleShape.length/2,0);vec2_1.rotate(circlePos,circlePos,capsuleAngle);vec2_1.add(circlePos,circlePos,capsulePosition);var result1=this.circleConvex(capsuleBody,capsuleShape,circlePos,capsuleAngle,convexBody,convexShape,convexPosition,convexAngle,justTest,capsuleShape.radius);vec2_1.set(circlePos,-capsuleShape.length/2,0);vec2_1.rotate(circlePos,circlePos,capsuleAngle);vec2_1.add(circlePos,circlePos,capsulePosition);var result2=this.circleConvex(capsuleBody,capsuleShape,circlePos,capsuleAngle,convexBody,convexShape,convexPosition,convexAngle,justTest,capsuleShape.radius);if(justTest&&(result1||result2)){return true;}// Check center rect
var r=convexCapsule_tempRect;setConvexToCapsuleShapeMiddle(r,capsuleShape);var result=this.convexConvex(convexBody,convexShape,convexPosition,convexAngle,capsuleBody,r,capsulePosition,capsuleAngle,justTest);return result+result1+result2;};/**
   * Capsule/line narrowphase
   * @method lineCapsule
   * @param  {Body}       lineBody
   * @param  {Line}       lineShape
   * @param  {Array}      linePosition
   * @param  {Number}     lineAngle
   * @param  {Body}       capsuleBody
   * @param  {Capsule}    capsuleShape
   * @param  {Array}      capsulePosition
   * @param  {Number}     capsuleAngle
   * @todo Implement me!
   */Narrowphase.prototype[Shape_1.CAPSULE|Shape_1.LINE]=Narrowphase.prototype.lineCapsule=function(lineBody,lineShape,linePosition,lineAngle,capsuleBody,capsuleShape,capsulePosition,capsuleAngle,justTest){// TODO
if(justTest){return false;}else{return 0;}};var capsuleCapsule_tempVec1=vec2_1.create();var capsuleCapsule_tempVec2=vec2_1.create();var capsuleCapsule_tempRect1=new Box_1({width:1,height:1});/**
   * Capsule/capsule narrowphase
   * @method capsuleCapsule
   * @param  {Body}       bi
   * @param  {Capsule}    si
   * @param  {Array}      xi
   * @param  {Number}     ai
   * @param  {Body}       bj
   * @param  {Capsule}    sj
   * @param  {Array}      xj
   * @param  {Number}     aj
   */Narrowphase.prototype[Shape_1.CAPSULE|Shape_1.CAPSULE]=Narrowphase.prototype.capsuleCapsule=function(bi,si,xi,ai,bj,sj,xj,aj,justTest){var enableFrictionBefore;// Check the circles
// Add offsets!
var circlePosi=capsuleCapsule_tempVec1,circlePosj=capsuleCapsule_tempVec2;var numContacts=0;// Need 4 circle checks, between all
for(var i=0;i<2;i++){vec2_1.set(circlePosi,(i===0?-1:1)*si.length/2,0);vec2_1.rotate(circlePosi,circlePosi,ai);vec2_1.add(circlePosi,circlePosi,xi);for(var j=0;j<2;j++){vec2_1.set(circlePosj,(j===0?-1:1)*sj.length/2,0);vec2_1.rotate(circlePosj,circlePosj,aj);vec2_1.add(circlePosj,circlePosj,xj);// Temporarily turn off friction
if(this.enableFrictionReduction){enableFrictionBefore=this.enableFriction;this.enableFriction=false;}var result=this.circleCircle(bi,si,circlePosi,ai,bj,sj,circlePosj,aj,justTest,si.radius,sj.radius);if(this.enableFrictionReduction){this.enableFriction=enableFrictionBefore;}if(justTest&&result){return true;}numContacts+=result;}}if(this.enableFrictionReduction){// Temporarily turn off friction
enableFrictionBefore=this.enableFriction;this.enableFriction=false;}// Check circles against the center boxs
var rect=capsuleCapsule_tempRect1;setConvexToCapsuleShapeMiddle(rect,si);var result1=this.convexCapsule(bi,rect,xi,ai,bj,sj,xj,aj,justTest);if(this.enableFrictionReduction){this.enableFriction=enableFrictionBefore;}if(justTest&&result1){return true;}numContacts+=result1;if(this.enableFrictionReduction){// Temporarily turn off friction
var enableFrictionBefore=this.enableFriction;this.enableFriction=false;}setConvexToCapsuleShapeMiddle(rect,sj);var result2=this.convexCapsule(bj,rect,xj,aj,bi,si,xi,ai,justTest);if(this.enableFrictionReduction){this.enableFriction=enableFrictionBefore;}if(justTest&&result2){return true;}numContacts+=result2;if(this.enableFrictionReduction){if(numContacts&&this.enableFriction){this.frictionEquations.push(this.createFrictionFromAverage(numContacts));}}return numContacts;};/**
   * Line/line narrowphase
   * @method lineLine
   * @param  {Body}       bodyA
   * @param  {Line}       shapeA
   * @param  {Array}      positionA
   * @param  {Number}     angleA
   * @param  {Body}       bodyB
   * @param  {Line}       shapeB
   * @param  {Array}      positionB
   * @param  {Number}     angleB
   * @todo Implement me!
   */Narrowphase.prototype[Shape_1.LINE|Shape_1.LINE]=Narrowphase.prototype.lineLine=function(bodyA,shapeA,positionA,angleA,bodyB,shapeB,positionB,angleB,justTest){// TODO
if(justTest){return false;}else{return 0;}};/**
   * Plane/line Narrowphase
   * @method planeLine
   * @param  {Body}   planeBody
   * @param  {Plane}  planeShape
   * @param  {Array}  planeOffset
   * @param  {Number} planeAngle
   * @param  {Body}   lineBody
   * @param  {Line}   lineShape
   * @param  {Array}  lineOffset
   * @param  {Number} lineAngle
   */Narrowphase.prototype[Shape_1.PLANE|Shape_1.LINE]=Narrowphase.prototype.planeLine=function(planeBody,planeShape,planeOffset,planeAngle,lineBody,lineShape,lineOffset,lineAngle,justTest){var worldVertex0=tmp1,worldVertex1=tmp2,worldVertex01=tmp3,worldVertex11=tmp4,worldEdge=tmp5,worldEdgeUnit=tmp6,dist=tmp7,worldNormal=tmp8,worldTangent=tmp9,verts=tmpArray,numContacts=0;// Get start and end points
vec2_1.set(worldVertex0,-lineShape.length/2,0);vec2_1.set(worldVertex1,lineShape.length/2,0);// Not sure why we have to use worldVertex*1 here, but it won't work otherwise. Tired.
vec2_1.rotate(worldVertex01,worldVertex0,lineAngle);vec2_1.rotate(worldVertex11,worldVertex1,lineAngle);add(worldVertex01,worldVertex01,lineOffset);add(worldVertex11,worldVertex11,lineOffset);vec2_1.copy(worldVertex0,worldVertex01);vec2_1.copy(worldVertex1,worldVertex11);// Get vector along the line
sub(worldEdge,worldVertex1,worldVertex0);vec2_1.normalize(worldEdgeUnit,worldEdge);// Get tangent to the edge.
vec2_1.rotate90cw(worldTangent,worldEdgeUnit);vec2_1.rotate(worldNormal,yAxis$1,planeAngle);// Check line ends
verts[0]=worldVertex0;verts[1]=worldVertex1;for(var i=0;i<verts.length;i++){var v=verts[i];sub(dist,v,planeOffset);var d=dot(dist,worldNormal);if(d<0){if(justTest){return true;}var c=this.createContactEquation(planeBody,lineBody,planeShape,lineShape);numContacts++;vec2_1.copy(c.normalA,worldNormal);vec2_1.normalize(c.normalA,c.normalA);// distance vector along plane normal
vec2_1.scale(dist,worldNormal,d);// Vector from plane center to contact
sub(c.contactPointA,v,dist);sub(c.contactPointA,c.contactPointA,planeBody.position);// From line center to contact
sub(c.contactPointB,v,lineOffset);add(c.contactPointB,c.contactPointB,lineOffset);sub(c.contactPointB,c.contactPointB,lineBody.position);this.contactEquations.push(c);if(!this.enableFrictionReduction){if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}}}}if(justTest){return false;}if(!this.enableFrictionReduction){if(numContacts&&this.enableFriction){this.frictionEquations.push(this.createFrictionFromAverage(numContacts));}}return numContacts;};Narrowphase.prototype[Shape_1.PARTICLE|Shape_1.CAPSULE]=Narrowphase.prototype.particleCapsule=function(particleBody,particleShape,particlePosition,particleAngle,capsuleBody,capsuleShape,capsulePosition,capsuleAngle,justTest){return this.circleLine(particleBody,particleShape,particlePosition,particleAngle,capsuleBody,capsuleShape,capsulePosition,capsuleAngle,justTest,capsuleShape.radius,0);};/**
   * Circle/line Narrowphase
   * @method circleLine
   * @param  {Body} circleBody
   * @param  {Circle} circleShape
   * @param  {Array} circleOffset
   * @param  {Number} circleAngle
   * @param  {Body} lineBody
   * @param  {Line} lineShape
   * @param  {Array} lineOffset
   * @param  {Number} lineAngle
   * @param {Boolean} justTest If set to true, this function will return the result (intersection or not) without adding equations.
   * @param {Number} lineRadius Radius to add to the line. Can be used to test Capsules.
   * @param {Number} circleRadius If set, this value overrides the circle shape radius.
   */Narrowphase.prototype[Shape_1.CIRCLE|Shape_1.LINE]=Narrowphase.prototype.circleLine=function(circleBody,circleShape,circleOffset,circleAngle,lineBody,lineShape,lineOffset,lineAngle,justTest,lineRadius,circleRadius){var lineRadius=lineRadius||0,circleRadius=typeof circleRadius!=="undefined"?circleRadius:circleShape.radius,orthoDist=tmp1,lineToCircleOrthoUnit=tmp2,projectedPoint=tmp3,centerDist=tmp4,worldTangent=tmp5,worldEdge=tmp6,worldEdgeUnit=tmp7,worldVertex0=tmp8,worldVertex1=tmp9,worldVertex01=tmp10,worldVertex11=tmp11,dist=tmp12,lineToCircle=tmp13,lineEndToLineRadius=tmp14,verts=tmpArray;// Get start and end points
vec2_1.set(worldVertex0,-lineShape.length/2,0);vec2_1.set(worldVertex1,lineShape.length/2,0);// Not sure why we have to use worldVertex*1 here, but it won't work otherwise. Tired.
vec2_1.rotate(worldVertex01,worldVertex0,lineAngle);vec2_1.rotate(worldVertex11,worldVertex1,lineAngle);add(worldVertex01,worldVertex01,lineOffset);add(worldVertex11,worldVertex11,lineOffset);vec2_1.copy(worldVertex0,worldVertex01);vec2_1.copy(worldVertex1,worldVertex11);// Get vector along the line
sub(worldEdge,worldVertex1,worldVertex0);vec2_1.normalize(worldEdgeUnit,worldEdge);// Get tangent to the edge.
vec2_1.rotate90cw(worldTangent,worldEdgeUnit);// Check distance from the plane spanned by the edge vs the circle
sub(dist,circleOffset,worldVertex0);var d=dot(dist,worldTangent);// Distance from center of line to circle center
sub(centerDist,worldVertex0,lineOffset);sub(lineToCircle,circleOffset,lineOffset);var radiusSum=circleRadius+lineRadius;if(Math.abs(d)<radiusSum){// Now project the circle onto the edge
vec2_1.scale(orthoDist,worldTangent,d);sub(projectedPoint,circleOffset,orthoDist);// Add the missing line radius
vec2_1.scale(lineToCircleOrthoUnit,worldTangent,dot(worldTangent,lineToCircle));vec2_1.normalize(lineToCircleOrthoUnit,lineToCircleOrthoUnit);vec2_1.scale(lineToCircleOrthoUnit,lineToCircleOrthoUnit,lineRadius);add(projectedPoint,projectedPoint,lineToCircleOrthoUnit);// Check if the point is within the edge span
var pos=dot(worldEdgeUnit,projectedPoint);var pos0=dot(worldEdgeUnit,worldVertex0);var pos1=dot(worldEdgeUnit,worldVertex1);if(pos>pos0&&pos<pos1){// We got contact!
if(justTest){return true;}var c=this.createContactEquation(circleBody,lineBody,circleShape,lineShape);vec2_1.scale(c.normalA,orthoDist,-1);vec2_1.normalize(c.normalA,c.normalA);vec2_1.scale(c.contactPointA,c.normalA,circleRadius);add(c.contactPointA,c.contactPointA,circleOffset);sub(c.contactPointA,c.contactPointA,circleBody.position);sub(c.contactPointB,projectedPoint,lineOffset);add(c.contactPointB,c.contactPointB,lineOffset);sub(c.contactPointB,c.contactPointB,lineBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}return 1;}}// Add corner
verts[0]=worldVertex0;verts[1]=worldVertex1;for(var i=0;i<verts.length;i++){var v=verts[i];sub(dist,v,circleOffset);if(vec2_1.squaredLength(dist)<Math.pow(radiusSum,2)){if(justTest){return true;}var c=this.createContactEquation(circleBody,lineBody,circleShape,lineShape);vec2_1.copy(c.normalA,dist);vec2_1.normalize(c.normalA,c.normalA);// Vector from circle to contact point is the normal times the circle radius
vec2_1.scale(c.contactPointA,c.normalA,circleRadius);add(c.contactPointA,c.contactPointA,circleOffset);sub(c.contactPointA,c.contactPointA,circleBody.position);sub(c.contactPointB,v,lineOffset);vec2_1.scale(lineEndToLineRadius,c.normalA,-lineRadius);add(c.contactPointB,c.contactPointB,lineEndToLineRadius);add(c.contactPointB,c.contactPointB,lineOffset);sub(c.contactPointB,c.contactPointB,lineBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}return 1;}}return 0;};/**
   * Circle/capsule Narrowphase
   * @method circleCapsule
   * @param  {Body}   bi
   * @param  {Circle} si
   * @param  {Array}  xi
   * @param  {Number} ai
   * @param  {Body}   bj
   * @param  {Line}   sj
   * @param  {Array}  xj
   * @param  {Number} aj
   */Narrowphase.prototype[Shape_1.CIRCLE|Shape_1.CAPSULE]=Narrowphase.prototype.circleCapsule=function(bi,si,xi,ai,bj,sj,xj,aj,justTest){return this.circleLine(bi,si,xi,ai,bj,sj,xj,aj,justTest,sj.radius);};/**
   * Circle/convex Narrowphase.
   * @method circleConvex
   * @param  {Body} circleBody
   * @param  {Circle} circleShape
   * @param  {Array} circleOffset
   * @param  {Number} circleAngle
   * @param  {Body} convexBody
   * @param  {Convex} convexShape
   * @param  {Array} convexOffset
   * @param  {Number} convexAngle
   * @param  {Boolean} justTest
   * @param  {Number} circleRadius
   */Narrowphase.prototype[Shape_1.CIRCLE|Shape_1.CONVEX]=Narrowphase.prototype[Shape_1.CIRCLE|Shape_1.BOX]=Narrowphase.prototype.circleConvex=function(circleBody,circleShape,circleOffset,circleAngle,convexBody,convexShape,convexOffset,convexAngle,justTest,circleRadius){var circleRadius=typeof circleRadius==="number"?circleRadius:circleShape.radius;var worldVertex0=tmp1,worldVertex1=tmp2,worldEdge=tmp3,worldEdgeUnit=tmp4,worldNormal=tmp5,dist=tmp10,worldVertex=tmp11,closestEdgeProjectedPoint=tmp13,candidate=tmp14,candidateDist=tmp15,minCandidate=tmp16,found=false,minCandidateDistance=Number.MAX_VALUE;// New algorithm:
// 1. Check so center of circle is not inside the polygon. If it is, this wont work...
// 2. For each edge
// 2. 1. Get point on circle that is closest to the edge (scale normal with -radius)
// 2. 2. Check if point is inside.
var verts=convexShape.vertices;// Check all edges first
for(var i=0;i!==verts.length+1;i++){var v0=verts[i%verts.length],v1=verts[(i+1)%verts.length];vec2_1.rotate(worldVertex0,v0,convexAngle);vec2_1.rotate(worldVertex1,v1,convexAngle);add(worldVertex0,worldVertex0,convexOffset);add(worldVertex1,worldVertex1,convexOffset);sub(worldEdge,worldVertex1,worldVertex0);vec2_1.normalize(worldEdgeUnit,worldEdge);// Get tangent to the edge. Points out of the Convex
vec2_1.rotate90cw(worldNormal,worldEdgeUnit);// Get point on circle, closest to the polygon
vec2_1.scale(candidate,worldNormal,-circleShape.radius);add(candidate,candidate,circleOffset);if(pointInConvex(candidate,convexShape,convexOffset,convexAngle)){vec2_1.sub(candidateDist,worldVertex0,candidate);var candidateDistance=Math.abs(vec2_1.dot(candidateDist,worldNormal));if(candidateDistance<minCandidateDistance){vec2_1.copy(minCandidate,candidate);minCandidateDistance=candidateDistance;vec2_1.scale(closestEdgeProjectedPoint,worldNormal,candidateDistance);vec2_1.add(closestEdgeProjectedPoint,closestEdgeProjectedPoint,candidate);found=true;}}}if(found){if(justTest){return true;}var c=this.createContactEquation(circleBody,convexBody,circleShape,convexShape);vec2_1.sub(c.normalA,minCandidate,circleOffset);vec2_1.normalize(c.normalA,c.normalA);vec2_1.scale(c.contactPointA,c.normalA,circleRadius);add(c.contactPointA,c.contactPointA,circleOffset);sub(c.contactPointA,c.contactPointA,circleBody.position);sub(c.contactPointB,closestEdgeProjectedPoint,convexOffset);add(c.contactPointB,c.contactPointB,convexOffset);sub(c.contactPointB,c.contactPointB,convexBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}return 1;}// Check all vertices
if(circleRadius>0){for(var i=0;i<verts.length;i++){var localVertex=verts[i];vec2_1.rotate(worldVertex,localVertex,convexAngle);add(worldVertex,worldVertex,convexOffset);sub(dist,worldVertex,circleOffset);if(vec2_1.squaredLength(dist)<Math.pow(circleRadius,2)){if(justTest){return true;}var c=this.createContactEquation(circleBody,convexBody,circleShape,convexShape);vec2_1.copy(c.normalA,dist);vec2_1.normalize(c.normalA,c.normalA);// Vector from circle to contact point is the normal times the circle radius
vec2_1.scale(c.contactPointA,c.normalA,circleRadius);add(c.contactPointA,c.contactPointA,circleOffset);sub(c.contactPointA,c.contactPointA,circleBody.position);sub(c.contactPointB,worldVertex,convexOffset);add(c.contactPointB,c.contactPointB,convexOffset);sub(c.contactPointB,c.contactPointB,convexBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}return 1;}}}return 0;};var pic_worldVertex0=vec2_1.create(),pic_worldVertex1=vec2_1.create(),pic_r0=vec2_1.create(),pic_r1=vec2_1.create();/*
   * Check if a point is in a polygon
   */function pointInConvex(worldPoint,convexShape,convexOffset,convexAngle){var worldVertex0=pic_worldVertex0,worldVertex1=pic_worldVertex1,r0=pic_r0,r1=pic_r1,point=worldPoint,verts=convexShape.vertices,lastCross=null;for(var i=0;i!==verts.length+1;i++){var v0=verts[i%verts.length],v1=verts[(i+1)%verts.length];// Transform vertices to world
// @todo The point should be transformed to local coordinates in the convex, no need to transform each vertex
vec2_1.rotate(worldVertex0,v0,convexAngle);vec2_1.rotate(worldVertex1,v1,convexAngle);add(worldVertex0,worldVertex0,convexOffset);add(worldVertex1,worldVertex1,convexOffset);sub(r0,worldVertex0,point);sub(r1,worldVertex1,point);var cross=vec2_1.crossLength(r0,r1);if(lastCross===null){lastCross=cross;}// If we got a different sign of the distance vector, the point is out of the polygon
if(cross*lastCross<=0){return false;}lastCross=cross;}return true;}/**
   * Particle/convex Narrowphase
   * @method particleConvex
   * @param  {Body} particleBody
   * @param  {Particle} particleShape
   * @param  {Array} particleOffset
   * @param  {Number} particleAngle
   * @param  {Body} convexBody
   * @param  {Convex} convexShape
   * @param  {Array} convexOffset
   * @param  {Number} convexAngle
   * @param {Boolean} justTest
   * @todo use pointInConvex and code more similar to circleConvex
   * @todo don't transform each vertex, but transform the particle position to convex-local instead
   */Narrowphase.prototype[Shape_1.PARTICLE|Shape_1.CONVEX]=Narrowphase.prototype[Shape_1.PARTICLE|Shape_1.BOX]=Narrowphase.prototype.particleConvex=function(particleBody,particleShape,particleOffset,particleAngle,convexBody,convexShape,convexOffset,convexAngle,justTest){var worldVertex0=tmp1,worldVertex1=tmp2,worldEdge=tmp3,worldEdgeUnit=tmp4,worldTangent=tmp5,centerDist=tmp6,convexToparticle=tmp7,dist=tmp10,closestEdgeProjectedPoint=tmp13,candidateDist=tmp17,minEdgeNormal=tmp18,minCandidateDistance=Number.MAX_VALUE;var found=false,verts=convexShape.vertices;// Check if the particle is in the polygon at all
if(!pointInConvex(particleOffset,convexShape,convexOffset,convexAngle)){return 0;}if(justTest){return true;}for(var i=0;i!==verts.length+1;i++){var v0=verts[i%verts.length],v1=verts[(i+1)%verts.length];// Transform vertices to world
vec2_1.rotate(worldVertex0,v0,convexAngle);vec2_1.rotate(worldVertex1,v1,convexAngle);add(worldVertex0,worldVertex0,convexOffset);add(worldVertex1,worldVertex1,convexOffset);// Get world edge
sub(worldEdge,worldVertex1,worldVertex0);vec2_1.normalize(worldEdgeUnit,worldEdge);// Get tangent to the edge. Points out of the Convex
vec2_1.rotate90cw(worldTangent,worldEdgeUnit);// Check distance from the infinite line (spanned by the edge) to the particle
sub(dist,particleOffset,worldVertex0);var d=dot(dist,worldTangent);sub(centerDist,worldVertex0,convexOffset);sub(convexToparticle,particleOffset,convexOffset);vec2_1.sub(candidateDist,worldVertex0,particleOffset);var candidateDistance=Math.abs(vec2_1.dot(candidateDist,worldTangent));if(candidateDistance<minCandidateDistance){minCandidateDistance=candidateDistance;vec2_1.scale(closestEdgeProjectedPoint,worldTangent,candidateDistance);vec2_1.add(closestEdgeProjectedPoint,closestEdgeProjectedPoint,particleOffset);vec2_1.copy(minEdgeNormal,worldTangent);found=true;}}if(found){var c=this.createContactEquation(particleBody,convexBody,particleShape,convexShape);vec2_1.scale(c.normalA,minEdgeNormal,-1);vec2_1.normalize(c.normalA,c.normalA);// Particle has no extent to the contact point
vec2_1.set(c.contactPointA,0,0);add(c.contactPointA,c.contactPointA,particleOffset);sub(c.contactPointA,c.contactPointA,particleBody.position);// From convex center to point
sub(c.contactPointB,closestEdgeProjectedPoint,convexOffset);add(c.contactPointB,c.contactPointB,convexOffset);sub(c.contactPointB,c.contactPointB,convexBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}return 1;}return 0;};/**
   * Circle/circle Narrowphase
   * @method circleCircle
   * @param  {Body} bodyA
   * @param  {Circle} shapeA
   * @param  {Array} offsetA
   * @param  {Number} angleA
   * @param  {Body} bodyB
   * @param  {Circle} shapeB
   * @param  {Array} offsetB
   * @param  {Number} angleB
   * @param {Boolean} justTest
   * @param {Number} [radiusA] Optional radius to use for shapeA
   * @param {Number} [radiusB] Optional radius to use for shapeB
   */Narrowphase.prototype[Shape_1.CIRCLE]=Narrowphase.prototype.circleCircle=function(bodyA,shapeA,offsetA,angleA,bodyB,shapeB,offsetB,angleB,justTest,radiusA,radiusB){var dist=tmp1,radiusA=radiusA||shapeA.radius,radiusB=radiusB||shapeB.radius;sub(dist,offsetA,offsetB);var r=radiusA+radiusB;if(vec2_1.squaredLength(dist)>Math.pow(r,2)){return 0;}if(justTest){return true;}var c=this.createContactEquation(bodyA,bodyB,shapeA,shapeB);sub(c.normalA,offsetB,offsetA);vec2_1.normalize(c.normalA,c.normalA);vec2_1.scale(c.contactPointA,c.normalA,radiusA);vec2_1.scale(c.contactPointB,c.normalA,-radiusB);add(c.contactPointA,c.contactPointA,offsetA);sub(c.contactPointA,c.contactPointA,bodyA.position);add(c.contactPointB,c.contactPointB,offsetB);sub(c.contactPointB,c.contactPointB,bodyB.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}return 1;};/**
   * Plane/Convex Narrowphase
   * @method planeConvex
   * @param  {Body} planeBody
   * @param  {Plane} planeShape
   * @param  {Array} planeOffset
   * @param  {Number} planeAngle
   * @param  {Body} convexBody
   * @param  {Convex} convexShape
   * @param  {Array} convexOffset
   * @param  {Number} convexAngle
   * @param {Boolean} justTest
   */Narrowphase.prototype[Shape_1.PLANE|Shape_1.CONVEX]=Narrowphase.prototype[Shape_1.PLANE|Shape_1.BOX]=Narrowphase.prototype.planeConvex=function(planeBody,planeShape,planeOffset,planeAngle,convexBody,convexShape,convexOffset,convexAngle,justTest){var worldVertex=tmp1,worldNormal=tmp2,dist=tmp3;var numReported=0;vec2_1.rotate(worldNormal,yAxis$1,planeAngle);for(var i=0;i!==convexShape.vertices.length;i++){var v=convexShape.vertices[i];vec2_1.rotate(worldVertex,v,convexAngle);add(worldVertex,worldVertex,convexOffset);sub(dist,worldVertex,planeOffset);if(dot(dist,worldNormal)<=0){if(justTest){return true;}// Found vertex
numReported++;var c=this.createContactEquation(planeBody,convexBody,planeShape,convexShape);sub(dist,worldVertex,planeOffset);vec2_1.copy(c.normalA,worldNormal);var d=dot(dist,c.normalA);vec2_1.scale(dist,c.normalA,d);// rj is from convex center to contact
sub(c.contactPointB,worldVertex,convexBody.position);// ri is from plane center to contact
sub(c.contactPointA,worldVertex,dist);sub(c.contactPointA,c.contactPointA,planeBody.position);this.contactEquations.push(c);if(!this.enableFrictionReduction){if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}}}}if(this.enableFrictionReduction){if(this.enableFriction&&numReported){this.frictionEquations.push(this.createFrictionFromAverage(numReported));}}return numReported;};/**
   * Narrowphase for particle vs plane
   * @method particlePlane
   * @param  {Body}       particleBody
   * @param  {Particle}   particleShape
   * @param  {Array}      particleOffset
   * @param  {Number}     particleAngle
   * @param  {Body}       planeBody
   * @param  {Plane}      planeShape
   * @param  {Array}      planeOffset
   * @param  {Number}     planeAngle
   * @param {Boolean}     justTest
   */Narrowphase.prototype[Shape_1.PARTICLE|Shape_1.PLANE]=Narrowphase.prototype.particlePlane=function(particleBody,particleShape,particleOffset,particleAngle,planeBody,planeShape,planeOffset,planeAngle,justTest){var dist=tmp1,worldNormal=tmp2;planeAngle=planeAngle||0;sub(dist,particleOffset,planeOffset);vec2_1.rotate(worldNormal,yAxis$1,planeAngle);var d=dot(dist,worldNormal);if(d>0){return 0;}if(justTest){return true;}var c=this.createContactEquation(planeBody,particleBody,planeShape,particleShape);vec2_1.copy(c.normalA,worldNormal);vec2_1.scale(dist,c.normalA,d);// dist is now the distance vector in the normal direction
// ri is the particle position projected down onto the plane, from the plane center
sub(c.contactPointA,particleOffset,dist);sub(c.contactPointA,c.contactPointA,planeBody.position);// rj is from the body center to the particle center
sub(c.contactPointB,particleOffset,particleBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}return 1;};/**
   * Circle/Particle Narrowphase
   * @method circleParticle
   * @param  {Body} circleBody
   * @param  {Circle} circleShape
   * @param  {Array} circleOffset
   * @param  {Number} circleAngle
   * @param  {Body} particleBody
   * @param  {Particle} particleShape
   * @param  {Array} particleOffset
   * @param  {Number} particleAngle
   * @param  {Boolean} justTest
   */Narrowphase.prototype[Shape_1.CIRCLE|Shape_1.PARTICLE]=Narrowphase.prototype.circleParticle=function(circleBody,circleShape,circleOffset,circleAngle,particleBody,particleShape,particleOffset,particleAngle,justTest){var dist=tmp1;sub(dist,particleOffset,circleOffset);if(vec2_1.squaredLength(dist)>Math.pow(circleShape.radius,2)){return 0;}if(justTest){return true;}var c=this.createContactEquation(circleBody,particleBody,circleShape,particleShape);vec2_1.copy(c.normalA,dist);vec2_1.normalize(c.normalA,c.normalA);// Vector from circle to contact point is the normal times the circle radius
vec2_1.scale(c.contactPointA,c.normalA,circleShape.radius);add(c.contactPointA,c.contactPointA,circleOffset);sub(c.contactPointA,c.contactPointA,circleBody.position);// Vector from particle center to contact point is zero
sub(c.contactPointB,particleOffset,particleBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}return 1;};var planeCapsule_tmpCircle=new Circle_1({radius:1}),planeCapsule_tmp1=vec2_1.create(),planeCapsule_tmp2=vec2_1.create(),planeCapsule_tmp3=vec2_1.create();/**
   * @method planeCapsule
   * @param  {Body} planeBody
   * @param  {Circle} planeShape
   * @param  {Array} planeOffset
   * @param  {Number} planeAngle
   * @param  {Body} capsuleBody
   * @param  {Particle} capsuleShape
   * @param  {Array} capsuleOffset
   * @param  {Number} capsuleAngle
   * @param {Boolean} justTest
   */Narrowphase.prototype[Shape_1.PLANE|Shape_1.CAPSULE]=Narrowphase.prototype.planeCapsule=function(planeBody,planeShape,planeOffset,planeAngle,capsuleBody,capsuleShape,capsuleOffset,capsuleAngle,justTest){var end1=planeCapsule_tmp1,end2=planeCapsule_tmp2,circle=planeCapsule_tmpCircle;// Compute world end positions
vec2_1.set(end1,-capsuleShape.length/2,0);vec2_1.rotate(end1,end1,capsuleAngle);add(end1,end1,capsuleOffset);vec2_1.set(end2,capsuleShape.length/2,0);vec2_1.rotate(end2,end2,capsuleAngle);add(end2,end2,capsuleOffset);circle.radius=capsuleShape.radius;var enableFrictionBefore;// Temporarily turn off friction
if(this.enableFrictionReduction){enableFrictionBefore=this.enableFriction;this.enableFriction=false;}// Do Narrowphase as two circles
var numContacts1=this.circlePlane(capsuleBody,circle,end1,0,planeBody,planeShape,planeOffset,planeAngle,justTest),numContacts2=this.circlePlane(capsuleBody,circle,end2,0,planeBody,planeShape,planeOffset,planeAngle,justTest);// Restore friction
if(this.enableFrictionReduction){this.enableFriction=enableFrictionBefore;}if(justTest){return numContacts1||numContacts2;}else{var numTotal=numContacts1+numContacts2;if(this.enableFrictionReduction){if(numTotal){this.frictionEquations.push(this.createFrictionFromAverage(numTotal));}}return numTotal;}};/**
   * Creates ContactEquations and FrictionEquations for a collision.
   * @method circlePlane
   * @param  {Body}    bi     The first body that should be connected to the equations.
   * @param  {Circle}  si     The circle shape participating in the collision.
   * @param  {Array}   xi     Extra offset to take into account for the Shape, in addition to the one in circleBody.position. Will *not* be rotated by circleBody.angle (maybe it should, for sake of homogenity?). Set to null if none.
   * @param  {Body}    bj     The second body that should be connected to the equations.
   * @param  {Plane}   sj     The Plane shape that is participating
   * @param  {Array}   xj     Extra offset for the plane shape.
   * @param  {Number}  aj     Extra angle to apply to the plane
   */Narrowphase.prototype[Shape_1.CIRCLE|Shape_1.PLANE]=Narrowphase.prototype.circlePlane=function(bi,si,xi,ai,bj,sj,xj,aj,justTest){var circleBody=bi,circleShape=si,circleOffset=xi,// Offset from body center, rotated!
planeBody=bj,planeOffset=xj,planeAngle=aj;planeAngle=planeAngle||0;// Vector from plane to circle
var planeToCircle=tmp1,worldNormal=tmp2,temp=tmp3;sub(planeToCircle,circleOffset,planeOffset);// World plane normal
vec2_1.rotate(worldNormal,yAxis$1,planeAngle);// Normal direction distance
var d=dot(worldNormal,planeToCircle);if(d>circleShape.radius){return 0;// No overlap. Abort.
}if(justTest){return true;}// Create contact
var contact=this.createContactEquation(planeBody,circleBody,sj,si);// ni is the plane world normal
vec2_1.copy(contact.normalA,worldNormal);// rj is the vector from circle center to the contact point
vec2_1.scale(contact.contactPointB,contact.normalA,-circleShape.radius);add(contact.contactPointB,contact.contactPointB,circleOffset);sub(contact.contactPointB,contact.contactPointB,circleBody.position);// ri is the distance from plane center to contact.
vec2_1.scale(temp,contact.normalA,d);sub(contact.contactPointA,planeToCircle,temp);// Subtract normal distance vector from the distance vector
add(contact.contactPointA,contact.contactPointA,planeOffset);sub(contact.contactPointA,contact.contactPointA,planeBody.position);this.contactEquations.push(contact);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(contact));}return 1;};/**
   * Convex/convex Narrowphase.See <a href="http://www.altdevblogaday.com/2011/05/13/contact-generation-between-3d-convex-meshes/">this article</a> for more info.
   * @method convexConvex
   * @param  {Body} bi
   * @param  {Convex} si
   * @param  {Array} xi
   * @param  {Number} ai
   * @param  {Body} bj
   * @param  {Convex} sj
   * @param  {Array} xj
   * @param  {Number} aj
   */Narrowphase.prototype[Shape_1.CONVEX]=Narrowphase.prototype[Shape_1.CONVEX|Shape_1.BOX]=Narrowphase.prototype[Shape_1.BOX]=Narrowphase.prototype.convexConvex=function(bi,si,xi,ai,bj,sj,xj,aj,justTest,precision){var sepAxis=tmp1,worldPoint=tmp2,worldPoint0=tmp3,worldPoint1=tmp4,worldEdge=tmp5,penetrationVec=tmp7,dist=tmp8,worldNormal=tmp9,numContacts=0,precision=typeof precision==='number'?precision:0;var found=Narrowphase.findSeparatingAxis(si,xi,ai,sj,xj,aj,sepAxis);if(!found){return 0;}// Make sure the separating axis is directed from shape i to shape j
sub(dist,xj,xi);if(dot(sepAxis,dist)>0){vec2_1.scale(sepAxis,sepAxis,-1);}// Find edges with normals closest to the separating axis
var closestEdge1=Narrowphase.getClosestEdge(si,ai,sepAxis,true),// Flipped axis
closestEdge2=Narrowphase.getClosestEdge(sj,aj,sepAxis);if(closestEdge1===-1||closestEdge2===-1){return 0;}// Loop over the shapes
for(var k=0;k<2;k++){var closestEdgeA=closestEdge1,closestEdgeB=closestEdge2,shapeA=si,shapeB=sj,offsetA=xi,offsetB=xj,angleA=ai,angleB=aj,bodyA=bi,bodyB=bj;if(k===0){// Swap!
var tmp;tmp=closestEdgeA;closestEdgeA=closestEdgeB;closestEdgeB=tmp;tmp=shapeA;shapeA=shapeB;shapeB=tmp;tmp=offsetA;offsetA=offsetB;offsetB=tmp;tmp=angleA;angleA=angleB;angleB=tmp;tmp=bodyA;bodyA=bodyB;bodyB=tmp;}// Loop over 2 points in convex B
for(var j=closestEdgeB;j<closestEdgeB+2;j++){// Get world point
var v=shapeB.vertices[(j+shapeB.vertices.length)%shapeB.vertices.length];vec2_1.rotate(worldPoint,v,angleB);add(worldPoint,worldPoint,offsetB);var insideNumEdges=0;// Loop over the 3 closest edges in convex A
for(var i=closestEdgeA-1;i<closestEdgeA+2;i++){var v0=shapeA.vertices[(i+shapeA.vertices.length)%shapeA.vertices.length],v1=shapeA.vertices[(i+1+shapeA.vertices.length)%shapeA.vertices.length];// Construct the edge
vec2_1.rotate(worldPoint0,v0,angleA);vec2_1.rotate(worldPoint1,v1,angleA);add(worldPoint0,worldPoint0,offsetA);add(worldPoint1,worldPoint1,offsetA);sub(worldEdge,worldPoint1,worldPoint0);vec2_1.rotate90cw(worldNormal,worldEdge);// Normal points out of convex 1
vec2_1.normalize(worldNormal,worldNormal);sub(dist,worldPoint,worldPoint0);var d=dot(worldNormal,dist);if(i===closestEdgeA&&d<=precision||i!==closestEdgeA&&d<=0){insideNumEdges++;}}if(insideNumEdges>=3){if(justTest){return true;}// worldPoint was on the "inside" side of each of the 3 checked edges.
// Project it to the center edge and use the projection direction as normal
// Create contact
var c=this.createContactEquation(bodyA,bodyB,shapeA,shapeB);numContacts++;// Get center edge from body A
var v0=shapeA.vertices[closestEdgeA%shapeA.vertices.length],v1=shapeA.vertices[(closestEdgeA+1)%shapeA.vertices.length];// Construct the edge
vec2_1.rotate(worldPoint0,v0,angleA);vec2_1.rotate(worldPoint1,v1,angleA);add(worldPoint0,worldPoint0,offsetA);add(worldPoint1,worldPoint1,offsetA);sub(worldEdge,worldPoint1,worldPoint0);vec2_1.rotate90cw(c.normalA,worldEdge);// Normal points out of convex A
vec2_1.normalize(c.normalA,c.normalA);sub(dist,worldPoint,worldPoint0);// From edge point to the penetrating point
var d=dot(c.normalA,dist);// Penetration
vec2_1.scale(penetrationVec,c.normalA,d);// Vector penetration
sub(c.contactPointA,worldPoint,offsetA);sub(c.contactPointA,c.contactPointA,penetrationVec);add(c.contactPointA,c.contactPointA,offsetA);sub(c.contactPointA,c.contactPointA,bodyA.position);sub(c.contactPointB,worldPoint,offsetB);add(c.contactPointB,c.contactPointB,offsetB);sub(c.contactPointB,c.contactPointB,bodyB.position);this.contactEquations.push(c);// Todo reduce to 1 friction equation if we have 2 contact points
if(!this.enableFrictionReduction){if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}}}}}if(this.enableFrictionReduction){if(this.enableFriction&&numContacts){this.frictionEquations.push(this.createFrictionFromAverage(numContacts));}}return numContacts;};// .projectConvex is called by other functions, need local tmp vectors
var pcoa_tmp1=vec2_1.fromValues(0,0);/**
   * Project a Convex onto a world-oriented axis
   * @method projectConvexOntoAxis
   * @static
   * @param  {Convex} convexShape
   * @param  {Array} convexOffset
   * @param  {Number} convexAngle
   * @param  {Array} worldAxis
   * @param  {Array} result
   */Narrowphase.projectConvexOntoAxis=function(convexShape,convexOffset,convexAngle,worldAxis,result){var max=null,min=null,v,value,localAxis=pcoa_tmp1;// Convert the axis to local coords of the body
vec2_1.rotate(localAxis,worldAxis,-convexAngle);// Get projected position of all vertices
for(var i=0;i<convexShape.vertices.length;i++){v=convexShape.vertices[i];value=dot(v,localAxis);if(max===null||value>max){max=value;}if(min===null||value<min){min=value;}}if(min>max){var t=min;min=max;max=t;}// Project the position of the body onto the axis - need to add this to the result
var offset=dot(convexOffset,worldAxis);vec2_1.set(result,min+offset,max+offset);};// .findSeparatingAxis is called by other functions, need local tmp vectors
var fsa_tmp1=vec2_1.fromValues(0,0),fsa_tmp2=vec2_1.fromValues(0,0),fsa_tmp3=vec2_1.fromValues(0,0),fsa_tmp4=vec2_1.fromValues(0,0),fsa_tmp5=vec2_1.fromValues(0,0),fsa_tmp6=vec2_1.fromValues(0,0);/**
   * Find a separating axis between the shapes, that maximizes the separating distance between them.
   * @method findSeparatingAxis
   * @static
   * @param  {Convex}     c1
   * @param  {Array}      offset1
   * @param  {Number}     angle1
   * @param  {Convex}     c2
   * @param  {Array}      offset2
   * @param  {Number}     angle2
   * @param  {Array}      sepAxis     The resulting axis
   * @return {Boolean}                Whether the axis could be found.
   */Narrowphase.findSeparatingAxis=function(c1,offset1,angle1,c2,offset2,angle2,sepAxis){var maxDist=null,overlap=false,found=false,edge=fsa_tmp1,worldPoint0=fsa_tmp2,worldPoint1=fsa_tmp3,normal=fsa_tmp4,span1=fsa_tmp5,span2=fsa_tmp6;if(c1 instanceof Box_1&&c2 instanceof Box_1){for(var j=0;j!==2;j++){var c=c1,angle=angle1;if(j===1){c=c2;angle=angle2;}for(var i=0;i!==2;i++){// Get the world edge
if(i===0){vec2_1.set(normal,0,1);}else if(i===1){vec2_1.set(normal,1,0);}if(angle!==0){vec2_1.rotate(normal,normal,angle);}// Project hulls onto that normal
Narrowphase.projectConvexOntoAxis(c1,offset1,angle1,normal,span1);Narrowphase.projectConvexOntoAxis(c2,offset2,angle2,normal,span2);// Order by span position
var a=span1,b=span2;if(span1[0]>span2[0]){b=span1;a=span2;}// Get separating distance
var dist=b[0]-a[1];overlap=dist<=0;if(maxDist===null||dist>maxDist){vec2_1.copy(sepAxis,normal);maxDist=dist;found=overlap;}}}}else{for(var j=0;j!==2;j++){var c=c1,angle=angle1;if(j===1){c=c2;angle=angle2;}for(var i=0;i!==c.vertices.length;i++){// Get the world edge
vec2_1.rotate(worldPoint0,c.vertices[i],angle);vec2_1.rotate(worldPoint1,c.vertices[(i+1)%c.vertices.length],angle);sub(edge,worldPoint1,worldPoint0);// Get normal - just rotate 90 degrees since vertices are given in CCW
vec2_1.rotate90cw(normal,edge);vec2_1.normalize(normal,normal);// Project hulls onto that normal
Narrowphase.projectConvexOntoAxis(c1,offset1,angle1,normal,span1);Narrowphase.projectConvexOntoAxis(c2,offset2,angle2,normal,span2);// Order by span position
var a=span1,b=span2;if(span1[0]>span2[0]){b=span1;a=span2;}// Get separating distance
var dist=b[0]-a[1];overlap=dist<=0;if(maxDist===null||dist>maxDist){vec2_1.copy(sepAxis,normal);maxDist=dist;found=overlap;}}}}/*
      // Needs to be tested some more
      for(var j=0; j!==2; j++){
          var c = c1,
              angle = angle1;
          if(j===1){
              c = c2;
              angle = angle2;
          }

          for(var i=0; i!==c.axes.length; i++){

              var normal = c.axes[i];

              // Project hulls onto that normal
              Narrowphase.projectConvexOntoAxis(c1, offset1, angle1, normal, span1);
              Narrowphase.projectConvexOntoAxis(c2, offset2, angle2, normal, span2);

              // Order by span position
              var a=span1,
                  b=span2,
                  swapped = false;
              if(span1[0] > span2[0]){
                  b=span1;
                  a=span2;
                  swapped = true;
              }

              // Get separating distance
              var dist = b[0] - a[1];
              overlap = (dist <= Narrowphase.convexPrecision);

              if(maxDist===null || dist > maxDist){
                  vec2.copy(sepAxis, normal);
                  maxDist = dist;
                  found = overlap;
              }
          }
      }
      */return found;};// .getClosestEdge is called by other functions, need local tmp vectors
var gce_tmp1=vec2_1.fromValues(0,0),gce_tmp2=vec2_1.fromValues(0,0),gce_tmp3=vec2_1.fromValues(0,0);/**
   * Get the edge that has a normal closest to an axis.
   * @method getClosestEdge
   * @static
   * @param  {Convex}     c
   * @param  {Number}     angle
   * @param  {Array}      axis
   * @param  {Boolean}    flip
   * @return {Number}             Index of the edge that is closest. This index and the next spans the resulting edge. Returns -1 if failed.
   */Narrowphase.getClosestEdge=function(c,angle,axis,flip){var localAxis=gce_tmp1,edge=gce_tmp2,normal=gce_tmp3;// Convert the axis to local coords of the body
vec2_1.rotate(localAxis,axis,-angle);if(flip){vec2_1.scale(localAxis,localAxis,-1);}var closestEdge=-1,N=c.vertices.length,maxDot=-1;for(var i=0;i!==N;i++){// Get the edge
sub(edge,c.vertices[(i+1)%N],c.vertices[i%N]);// Get normal - just rotate 90 degrees since vertices are given in CCW
vec2_1.rotate90cw(normal,edge);vec2_1.normalize(normal,normal);var d=dot(normal,localAxis);if(closestEdge===-1||d>maxDot){closestEdge=i%N;maxDot=d;}}return closestEdge;};var circleHeightfield_candidate=vec2_1.create(),circleHeightfield_dist=vec2_1.create(),circleHeightfield_v0=vec2_1.create(),circleHeightfield_v1=vec2_1.create(),circleHeightfield_minCandidate=vec2_1.create(),circleHeightfield_worldNormal=vec2_1.create(),circleHeightfield_minCandidateNormal=vec2_1.create();/**
   * @method circleHeightfield
   * @param  {Body}           bi
   * @param  {Circle}         si
   * @param  {Array}          xi
   * @param  {Body}           bj
   * @param  {Heightfield}    sj
   * @param  {Array}          xj
   * @param  {Number}         aj
   */Narrowphase.prototype[Shape_1.CIRCLE|Shape_1.HEIGHTFIELD]=Narrowphase.prototype.circleHeightfield=function(circleBody,circleShape,circlePos,circleAngle,hfBody,hfShape,hfPos,hfAngle,justTest,radius){var data=hfShape.heights,radius=radius||circleShape.radius,w=hfShape.elementWidth,dist=circleHeightfield_dist,candidate=circleHeightfield_candidate,minCandidate=circleHeightfield_minCandidate,minCandidateNormal=circleHeightfield_minCandidateNormal,worldNormal=circleHeightfield_worldNormal,v0=circleHeightfield_v0,v1=circleHeightfield_v1;// Get the index of the points to test against
var idxA=Math.floor((circlePos[0]-radius-hfPos[0])/w),idxB=Math.ceil((circlePos[0]+radius-hfPos[0])/w);/*if(idxB < 0 || idxA >= data.length)
          return justTest ? false : 0;*/if(idxA<0){idxA=0;}if(idxB>=data.length){idxB=data.length-1;}// Get max and min
var max=data[idxA],min=data[idxB];for(var i=idxA;i<idxB;i++){if(data[i]<min){min=data[i];}if(data[i]>max){max=data[i];}}if(circlePos[1]-radius>max){return justTest?false:0;}/*
      if(circlePos[1]+radius < min){
          // Below the minimum point... We can just guess.
          // TODO
      }
      */ // 1. Check so center of circle is not inside the field. If it is, this wont work...
// 2. For each edge
// 2. 1. Get point on circle that is closest to the edge (scale normal with -radius)
// 2. 2. Check if point is inside.
var found=false;// Check all edges first
for(var i=idxA;i<idxB;i++){// Get points
vec2_1.set(v0,i*w,data[i]);vec2_1.set(v1,(i+1)*w,data[i+1]);vec2_1.add(v0,v0,hfPos);vec2_1.add(v1,v1,hfPos);// Get normal
vec2_1.sub(worldNormal,v1,v0);vec2_1.rotate(worldNormal,worldNormal,Math.PI/2);vec2_1.normalize(worldNormal,worldNormal);// Get point on circle, closest to the edge
vec2_1.scale(candidate,worldNormal,-radius);vec2_1.add(candidate,candidate,circlePos);// Distance from v0 to the candidate point
vec2_1.sub(dist,candidate,v0);// Check if it is in the element "stick"
var d=vec2_1.dot(dist,worldNormal);if(candidate[0]>=v0[0]&&candidate[0]<v1[0]&&d<=0){if(justTest){return true;}found=true;// Store the candidate point, projected to the edge
vec2_1.scale(dist,worldNormal,-d);vec2_1.add(minCandidate,candidate,dist);vec2_1.copy(minCandidateNormal,worldNormal);var c=this.createContactEquation(hfBody,circleBody,hfShape,circleShape);// Normal is out of the heightfield
vec2_1.copy(c.normalA,minCandidateNormal);// Vector from circle to heightfield
vec2_1.scale(c.contactPointB,c.normalA,-radius);add(c.contactPointB,c.contactPointB,circlePos);sub(c.contactPointB,c.contactPointB,circleBody.position);vec2_1.copy(c.contactPointA,minCandidate);vec2_1.sub(c.contactPointA,c.contactPointA,hfBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}}}// Check all vertices
found=false;if(radius>0){for(var i=idxA;i<=idxB;i++){// Get point
vec2_1.set(v0,i*w,data[i]);vec2_1.add(v0,v0,hfPos);vec2_1.sub(dist,circlePos,v0);if(vec2_1.squaredLength(dist)<Math.pow(radius,2)){if(justTest){return true;}found=true;var c=this.createContactEquation(hfBody,circleBody,hfShape,circleShape);// Construct normal - out of heightfield
vec2_1.copy(c.normalA,dist);vec2_1.normalize(c.normalA,c.normalA);vec2_1.scale(c.contactPointB,c.normalA,-radius);add(c.contactPointB,c.contactPointB,circlePos);sub(c.contactPointB,c.contactPointB,circleBody.position);sub(c.contactPointA,v0,hfPos);add(c.contactPointA,c.contactPointA,hfPos);sub(c.contactPointA,c.contactPointA,hfBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}}}}if(found){return 1;}return 0;};var convexHeightfield_v0=vec2_1.create(),convexHeightfield_v1=vec2_1.create(),convexHeightfield_tilePos=vec2_1.create(),convexHeightfield_tempConvexShape=new Convex_1({vertices:[vec2_1.create(),vec2_1.create(),vec2_1.create(),vec2_1.create()]});/**
   * @method circleHeightfield
   * @param  {Body}           bi
   * @param  {Circle}         si
   * @param  {Array}          xi
   * @param  {Body}           bj
   * @param  {Heightfield}    sj
   * @param  {Array}          xj
   * @param  {Number}         aj
   */Narrowphase.prototype[Shape_1.BOX|Shape_1.HEIGHTFIELD]=Narrowphase.prototype[Shape_1.CONVEX|Shape_1.HEIGHTFIELD]=Narrowphase.prototype.convexHeightfield=function(convexBody,convexShape,convexPos,convexAngle,hfBody,hfShape,hfPos,hfAngle,justTest){var data=hfShape.heights,w=hfShape.elementWidth,v0=convexHeightfield_v0,v1=convexHeightfield_v1,tilePos=convexHeightfield_tilePos,tileConvex=convexHeightfield_tempConvexShape;// Get the index of the points to test against
var idxA=Math.floor((convexBody.aabb.lowerBound[0]-hfPos[0])/w),idxB=Math.ceil((convexBody.aabb.upperBound[0]-hfPos[0])/w);if(idxA<0){idxA=0;}if(idxB>=data.length){idxB=data.length-1;}// Get max and min
var max=data[idxA],min=data[idxB];for(var i=idxA;i<idxB;i++){if(data[i]<min){min=data[i];}if(data[i]>max){max=data[i];}}if(convexBody.aabb.lowerBound[1]>max){return justTest?false:0;}var numContacts=0;// Loop over all edges
// TODO: If possible, construct a convex from several data points (need o check if the points make a convex shape)
for(var i=idxA;i<idxB;i++){// Get points
vec2_1.set(v0,i*w,data[i]);vec2_1.set(v1,(i+1)*w,data[i+1]);vec2_1.add(v0,v0,hfPos);vec2_1.add(v1,v1,hfPos);// Construct a convex
var tileHeight=100;// todo
vec2_1.set(tilePos,(v1[0]+v0[0])*0.5,(v1[1]+v0[1]-tileHeight)*0.5);vec2_1.sub(tileConvex.vertices[0],v1,tilePos);vec2_1.sub(tileConvex.vertices[1],v0,tilePos);vec2_1.copy(tileConvex.vertices[2],tileConvex.vertices[1]);vec2_1.copy(tileConvex.vertices[3],tileConvex.vertices[0]);tileConvex.vertices[2][1]-=tileHeight;tileConvex.vertices[3][1]-=tileHeight;// Do convex collision
numContacts+=this.convexConvex(convexBody,convexShape,convexPos,convexAngle,hfBody,tileConvex,tilePos,0,justTest);}return numContacts;};var Plane_1=Plane;/**
   * Plane shape class. The plane is facing in the Y direction.
   * @class Plane
   * @extends Shape
   * @constructor
   * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
   */function Plane(options){options=options||{};options.type=Shape_1.PLANE;Shape_1.call(this,options);}Plane.prototype=new Shape_1();Plane.prototype.constructor=Plane;/**
   * Compute moment of inertia
   * @method computeMomentOfInertia
   */Plane.prototype.computeMomentOfInertia=function(mass){return 0;// Plane is infinite. The inertia should therefore be infinty but by convention we set 0 here
};/**
   * Update the bounding radius
   * @method updateBoundingRadius
   */Plane.prototype.updateBoundingRadius=function(){this.boundingRadius=Number.MAX_VALUE;};/**
   * @method computeAABB
   * @param  {AABB}   out
   * @param  {Array}  position
   * @param  {Number} angle
   */Plane.prototype.computeAABB=function(out,position,angle){var a=angle%(2*Math.PI);var set=vec2_1.set;var max=1e7;var lowerBound=out.lowerBound;var upperBound=out.upperBound;// Set max bounds
set(lowerBound,-max,-max);set(upperBound,max,max);if(a===0){// y goes from -inf to 0
upperBound[1]=0;// set(lowerBound, -max, -max);
// set(upperBound,  max,  0);
}else if(a===Math.PI/2){// x goes from 0 to inf
lowerBound[0]=0;// set(lowerBound, 0, -max);
// set(upperBound,      max,  max);
}else if(a===Math.PI){// y goes from 0 to inf
lowerBound[1]=0;// set(lowerBound, -max, 0);
// set(upperBound,  max, max);
}else if(a===3*Math.PI/2){// x goes from -inf to 0
upperBound[0]=0;// set(lowerBound, -max,     -max);
// set(upperBound,  0,  max);
}};Plane.prototype.updateArea=function(){this.area=Number.MAX_VALUE;};var intersectPlane_planePointToFrom=vec2_1.create();var intersectPlane_dir_scaled_with_t=vec2_1.create();var intersectPlane_hitPoint=vec2_1.create();var intersectPlane_normal=vec2_1.create();var intersectPlane_len=vec2_1.create();/**
   * @method raycast
   * @param  {RayResult} result
   * @param  {Ray} ray
   * @param  {array} position
   * @param  {number} angle
   */Plane.prototype.raycast=function(result,ray,position,angle){var from=ray.from;var to=ray.to;var direction=ray.direction;var planePointToFrom=intersectPlane_planePointToFrom;var normal=intersectPlane_normal;var len=intersectPlane_len;// Get plane normal
vec2_1.set(normal,0,1);vec2_1.rotate(normal,normal,angle);vec2_1.sub(len,from,position);var planeToFrom=vec2_1.dot(len,normal);vec2_1.sub(len,to,position);var planeToTo=vec2_1.dot(len,normal);if(planeToFrom*planeToTo>0){// "from" and "to" are on the same side of the plane... bail out
return;}if(vec2_1.squaredDistance(from,to)<planeToFrom*planeToFrom){return;}var n_dot_dir=vec2_1.dot(normal,direction);vec2_1.sub(planePointToFrom,from,position);var t=-vec2_1.dot(normal,planePointToFrom)/n_dot_dir/ray.length;ray.reportIntersection(result,t,normal,-1);};var Particle_1=Particle;/**
   * Particle shape class.
   * @class Particle
   * @constructor
   * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
   * @extends Shape
   */function Particle(options){options=options||{};options.type=Shape_1.PARTICLE;Shape_1.call(this,options);}Particle.prototype=new Shape_1();Particle.prototype.constructor=Particle;Particle.prototype.computeMomentOfInertia=function(mass){return 0;// Can't rotate a particle
};Particle.prototype.updateBoundingRadius=function(){this.boundingRadius=0;};/**
   * @method computeAABB
   * @param  {AABB}   out
   * @param  {Array}  position
   * @param  {Number} angle
   */Particle.prototype.computeAABB=function(out,position,angle){vec2_1.copy(out.lowerBound,position);vec2_1.copy(out.upperBound,position);};var NaiveBroadphase_1=NaiveBroadphase;/**
   * Naive broadphase implementation. Does N^2 tests.
   *
   * @class NaiveBroadphase
   * @constructor
   * @extends Broadphase
   */function NaiveBroadphase(){Broadphase_1.call(this,Broadphase_1.NAIVE);}NaiveBroadphase.prototype=new Broadphase_1();NaiveBroadphase.prototype.constructor=NaiveBroadphase;/**
   * Get the colliding pairs
   * @method getCollisionPairs
   * @param  {World} world
   * @return {Array}
   */NaiveBroadphase.prototype.getCollisionPairs=function(world){var bodies=world.bodies,result=this.result;result.length=0;for(var i=0,Ncolliding=bodies.length;i!==Ncolliding;i++){var bi=bodies[i];for(var j=0;j<i;j++){var bj=bodies[j];if(Broadphase_1.canCollide(bi,bj)&&this.boundingVolumeCheck(bi,bj)){result.push(bi,bj);}}}return result;};/**
   * Returns all the bodies within an AABB.
   * @method aabbQuery
   * @param  {World} world
   * @param  {AABB} aabb
   * @param {array} result An array to store resulting bodies in.
   * @return {array}
   */NaiveBroadphase.prototype.aabbQuery=function(world,aabb,result){result=result||[];var bodies=world.bodies;for(var i=0;i<bodies.length;i++){var b=bodies[i];if(b.aabbNeedsUpdate){b.updateAABB();}if(b.aabb.overlaps(aabb)){result.push(b);}}return result;};var RotationalVelocityEquation_1=RotationalVelocityEquation;/**
   * Syncs rotational velocity of two bodies, or sets a relative velocity (motor).
   *
   * @class RotationalVelocityEquation
   * @constructor
   * @extends Equation
   * @param {Body} bodyA
   * @param {Body} bodyB
   */function RotationalVelocityEquation(bodyA,bodyB){Equation_1.call(this,bodyA,bodyB,-Number.MAX_VALUE,Number.MAX_VALUE);this.relativeVelocity=1;this.ratio=1;}RotationalVelocityEquation.prototype=new Equation_1();RotationalVelocityEquation.prototype.constructor=RotationalVelocityEquation;RotationalVelocityEquation.prototype.computeB=function(a,b,h){var G=this.G;G[2]=-1;G[5]=this.ratio;var GiMf=this.computeGiMf();var GW=this.computeGW();var B=-GW*b-h*GiMf;return B;};var RotationalLockEquation_1=RotationalLockEquation;/**
   * Locks the relative angle between two bodies. The constraint tries to keep the dot product between two vectors, local in each body, to zero. The local angle in body i is a parameter.
   *
   * @class RotationalLockEquation
   * @constructor
   * @extends Equation
   * @param {Body} bodyA
   * @param {Body} bodyB
   * @param {Object} [options]
   * @param {Number} [options.angle] Angle to add to the local vector in bodyA.
   */function RotationalLockEquation(bodyA,bodyB,options){options=options||{};Equation_1.call(this,bodyA,bodyB,-Number.MAX_VALUE,Number.MAX_VALUE);/**
       * @property {number} angle
       */this.angle=options.angle||0;var G=this.G;G[2]=1;G[5]=-1;}RotationalLockEquation.prototype=new Equation_1();RotationalLockEquation.prototype.constructor=RotationalLockEquation;var worldVectorA=vec2_1.create(),worldVectorB=vec2_1.create(),xAxis$1=vec2_1.fromValues(1,0),yAxis$2=vec2_1.fromValues(0,1);RotationalLockEquation.prototype.computeGq=function(){vec2_1.rotate(worldVectorA,xAxis$1,this.bodyA.angle+this.angle);vec2_1.rotate(worldVectorB,yAxis$2,this.bodyB.angle);return vec2_1.dot(worldVectorA,worldVectorB);};var RevoluteConstraint_1=RevoluteConstraint;var worldPivotA=vec2_1.create(),worldPivotB=vec2_1.create(),xAxis$2=vec2_1.fromValues(1,0),yAxis$3=vec2_1.fromValues(0,1),g=vec2_1.create();/**
   * Connects two bodies at given offset points, letting them rotate relative to each other around this point.
   * @class RevoluteConstraint
   * @constructor
   * @author schteppe
   * @param {Body}    bodyA
   * @param {Body}    bodyB
   * @param {Object}  [options]
   * @param {Array}   [options.worldPivot] A pivot point given in world coordinates. If specified, localPivotA and localPivotB are automatically computed from this value.
   * @param {Array}   [options.localPivotA] The point relative to the center of mass of bodyA which bodyA is constrained to.
   * @param {Array}   [options.localPivotB] See localPivotA.
   * @param {Number}  [options.maxForce] The maximum force that should be applied to constrain the bodies.
   * @extends Constraint
   *
   * @example
   *     // This will create a revolute constraint between two bodies with pivot point in between them.
   *     var bodyA = new Body({ mass: 1, position: [-1, 0] });
   *     var bodyB = new Body({ mass: 1, position: [1, 0] });
   *     var constraint = new RevoluteConstraint(bodyA, bodyB, {
   *         worldPivot: [0, 0]
   *     });
   *     world.addConstraint(constraint);
   *
   *     // Using body-local pivot points, the constraint could have been constructed like this:
   *     var constraint = new RevoluteConstraint(bodyA, bodyB, {
   *         localPivotA: [1, 0],
   *         localPivotB: [-1, 0]
   *     });
   */function RevoluteConstraint(bodyA,bodyB,options){options=options||{};Constraint_1.call(this,bodyA,bodyB,Constraint_1.REVOLUTE,options);var maxForce=this.maxForce=typeof options.maxForce!=="undefined"?options.maxForce:Number.MAX_VALUE;/**
       * @property {Array} pivotA
       */this.pivotA=vec2_1.create();/**
       * @property {Array} pivotB
       */this.pivotB=vec2_1.create();if(options.worldPivot){// Compute pivotA and pivotB
vec2_1.sub(this.pivotA,options.worldPivot,bodyA.position);vec2_1.sub(this.pivotB,options.worldPivot,bodyB.position);// Rotate to local coordinate system
vec2_1.rotate(this.pivotA,this.pivotA,-bodyA.angle);vec2_1.rotate(this.pivotB,this.pivotB,-bodyB.angle);}else{// Get pivotA and pivotB
vec2_1.copy(this.pivotA,options.localPivotA);vec2_1.copy(this.pivotB,options.localPivotB);}// Equations to be fed to the solver
var eqs=this.equations=[new Equation_1(bodyA,bodyB,-maxForce,maxForce),new Equation_1(bodyA,bodyB,-maxForce,maxForce)];var x=eqs[0];var y=eqs[1];var that=this;x.computeGq=function(){vec2_1.rotate(worldPivotA,that.pivotA,bodyA.angle);vec2_1.rotate(worldPivotB,that.pivotB,bodyB.angle);vec2_1.add(g,bodyB.position,worldPivotB);vec2_1.sub(g,g,bodyA.position);vec2_1.sub(g,g,worldPivotA);return vec2_1.dot(g,xAxis$2);};y.computeGq=function(){vec2_1.rotate(worldPivotA,that.pivotA,bodyA.angle);vec2_1.rotate(worldPivotB,that.pivotB,bodyB.angle);vec2_1.add(g,bodyB.position,worldPivotB);vec2_1.sub(g,g,bodyA.position);vec2_1.sub(g,g,worldPivotA);return vec2_1.dot(g,yAxis$3);};y.minForce=x.minForce=-maxForce;y.maxForce=x.maxForce=maxForce;this.motorEquation=new RotationalVelocityEquation_1(bodyA,bodyB);/**
       * Indicates whether the motor is enabled. Use .enableMotor() to enable the constraint motor.
       * @property {Boolean} motorEnabled
       * @readOnly
       */this.motorEnabled=false;/**
       * The constraint position.
       * @property angle
       * @type {Number}
       * @readOnly
       */this.angle=0;/**
       * Set to true to enable lower limit
       * @property lowerLimitEnabled
       * @type {Boolean}
       */this.lowerLimitEnabled=false;/**
       * Set to true to enable upper limit
       * @property upperLimitEnabled
       * @type {Boolean}
       */this.upperLimitEnabled=false;/**
       * The lower limit on the constraint angle.
       * @property lowerLimit
       * @type {Boolean}
       */this.lowerLimit=0;/**
       * The upper limit on the constraint angle.
       * @property upperLimit
       * @type {Boolean}
       */this.upperLimit=0;this.upperLimitEquation=new RotationalLockEquation_1(bodyA,bodyB);this.lowerLimitEquation=new RotationalLockEquation_1(bodyA,bodyB);this.upperLimitEquation.minForce=0;this.lowerLimitEquation.maxForce=0;}RevoluteConstraint.prototype=new Constraint_1();RevoluteConstraint.prototype.constructor=RevoluteConstraint;/**
   * Set the constraint angle limits.
   * @method setLimits
   * @param {number} lower Lower angle limit.
   * @param {number} upper Upper angle limit.
   */RevoluteConstraint.prototype.setLimits=function(lower,upper){if(typeof lower==='number'){this.lowerLimit=lower;this.lowerLimitEnabled=true;}else{this.lowerLimit=lower;this.lowerLimitEnabled=false;}if(typeof upper==='number'){this.upperLimit=upper;this.upperLimitEnabled=true;}else{this.upperLimit=upper;this.upperLimitEnabled=false;}};RevoluteConstraint.prototype.update=function(){var bodyA=this.bodyA,bodyB=this.bodyB,pivotA=this.pivotA,pivotB=this.pivotB,eqs=this.equations,normal=eqs[0],tangent=eqs[1],x=eqs[0],y=eqs[1],upperLimit=this.upperLimit,lowerLimit=this.lowerLimit,upperLimitEquation=this.upperLimitEquation,lowerLimitEquation=this.lowerLimitEquation;var relAngle=this.angle=bodyB.angle-bodyA.angle;if(this.upperLimitEnabled&&relAngle>upperLimit){upperLimitEquation.angle=upperLimit;if(eqs.indexOf(upperLimitEquation)===-1){eqs.push(upperLimitEquation);}}else{var idx=eqs.indexOf(upperLimitEquation);if(idx!==-1){eqs.splice(idx,1);}}if(this.lowerLimitEnabled&&relAngle<lowerLimit){lowerLimitEquation.angle=lowerLimit;if(eqs.indexOf(lowerLimitEquation)===-1){eqs.push(lowerLimitEquation);}}else{var idx=eqs.indexOf(lowerLimitEquation);if(idx!==-1){eqs.splice(idx,1);}}/*

      The constraint violation is

          g = xj + rj - xi - ri

      ...where xi and xj are the body positions and ri and rj world-oriented offset vectors. Differentiate:

          gdot = vj + wj x rj - vi - wi x ri

      We split this into x and y directions. (let x and y be unit vectors along the respective axes)

          gdot * x = ( vj + wj x rj - vi - wi x ri ) * x
                   = ( vj*x + (wj x rj)*x -vi*x -(wi x ri)*x
                   = ( vj*x + (rj x x)*wj -vi*x -(ri x x)*wi
                   = [ -x   -(ri x x)   x   (rj x x)] * [vi wi vj wj]
                   = G*W

      ...and similar for y. We have then identified the jacobian entries for x and y directions:

          Gx = [ x   (rj x x)   -x   -(ri x x)]
          Gy = [ y   (rj x y)   -y   -(ri x y)]

       */vec2_1.rotate(worldPivotA,pivotA,bodyA.angle);vec2_1.rotate(worldPivotB,pivotB,bodyB.angle);// todo: these are a bit sparse. We could save some computations on making custom eq.computeGW functions, etc
x.G[0]=-1;x.G[1]=0;x.G[2]=-vec2_1.crossLength(worldPivotA,xAxis$2);x.G[3]=1;x.G[4]=0;x.G[5]=vec2_1.crossLength(worldPivotB,xAxis$2);y.G[0]=0;y.G[1]=-1;y.G[2]=-vec2_1.crossLength(worldPivotA,yAxis$3);y.G[3]=0;y.G[4]=1;y.G[5]=vec2_1.crossLength(worldPivotB,yAxis$3);};/**
   * Enable the rotational motor
   * @method enableMotor
   */RevoluteConstraint.prototype.enableMotor=function(){if(this.motorEnabled){return;}this.equations.push(this.motorEquation);this.motorEnabled=true;};/**
   * Disable the rotational motor
   * @method disableMotor
   */RevoluteConstraint.prototype.disableMotor=function(){if(!this.motorEnabled){return;}var i=this.equations.indexOf(this.motorEquation);this.equations.splice(i,1);this.motorEnabled=false;};/**
   * Check if the motor is enabled.
   * @method motorIsEnabled
   * @deprecated use property motorEnabled instead.
   * @return {Boolean}
   */RevoluteConstraint.prototype.motorIsEnabled=function(){return!!this.motorEnabled;};/**
   * Set the speed of the rotational constraint motor
   * @method setMotorSpeed
   * @param  {Number} speed
   */RevoluteConstraint.prototype.setMotorSpeed=function(speed){if(!this.motorEnabled){return;}var i=this.equations.indexOf(this.motorEquation);this.equations[i].relativeVelocity=speed;};/**
   * Get the speed of the rotational constraint motor
   * @method getMotorSpeed
   * @return {Number} The current speed, or false if the motor is not enabled.
   */RevoluteConstraint.prototype.getMotorSpeed=function(){if(!this.motorEnabled){return false;}return this.motorEquation.relativeVelocity;};var PrismaticConstraint_1=PrismaticConstraint;/**
   * Constraint that only allows bodies to move along a line, relative to each other. See <a href="http://www.iforce2d.net/b2dtut/joints-prismatic">this tutorial</a>. Also called "slider constraint".
   *
   * @class PrismaticConstraint
   * @constructor
   * @extends Constraint
   * @author schteppe
   * @param {Body}    bodyA
   * @param {Body}    bodyB
   * @param {Object}  [options]
   * @param {Number}  [options.maxForce]                Max force to be applied by the constraint
   * @param {Array}   [options.localAnchorA]            Body A's anchor point, defined in its own local frame.
   * @param {Array}   [options.localAnchorB]            Body B's anchor point, defined in its own local frame.
   * @param {Array}   [options.localAxisA]              An axis, defined in body A frame, that body B's anchor point may slide along.
   * @param {Boolean} [options.disableRotationalLock]   If set to true, bodyB will be free to rotate around its anchor point.
   * @param {Number}  [options.upperLimit]
   * @param {Number}  [options.lowerLimit]
   * @todo Ability to create using only a point and a worldAxis
   */function PrismaticConstraint(bodyA,bodyB,options){options=options||{};Constraint_1.call(this,bodyA,bodyB,Constraint_1.PRISMATIC,options);// Get anchors
var localAnchorA=vec2_1.fromValues(0,0),localAxisA=vec2_1.fromValues(1,0),localAnchorB=vec2_1.fromValues(0,0);if(options.localAnchorA){vec2_1.copy(localAnchorA,options.localAnchorA);}if(options.localAxisA){vec2_1.copy(localAxisA,options.localAxisA);}if(options.localAnchorB){vec2_1.copy(localAnchorB,options.localAnchorB);}/**
       * @property localAnchorA
       * @type {Array}
       */this.localAnchorA=localAnchorA;/**
       * @property localAnchorB
       * @type {Array}
       */this.localAnchorB=localAnchorB;/**
       * @property localAxisA
       * @type {Array}
       */this.localAxisA=localAxisA;/*

      The constraint violation for the common axis point is

          g = ( xj + rj - xi - ri ) * t   :=  gg*t

      where r are body-local anchor points, and t is a tangent to the constraint axis defined in body i frame.

          gdot =  ( vj + wj x rj - vi - wi x ri ) * t + ( xj + rj - xi - ri ) * ( wi x t )

      Note the use of the chain rule. Now we identify the jacobian

          G*W = [ -t      -ri x t + t x gg     t    rj x t ] * [vi wi vj wj]

      The rotational part is just a rotation lock.

       */var maxForce=this.maxForce=typeof options.maxForce!=="undefined"?options.maxForce:Number.MAX_VALUE;// Translational part
var trans=new Equation_1(bodyA,bodyB,-maxForce,maxForce);var ri=new vec2_1.create(),rj=new vec2_1.create(),gg=new vec2_1.create(),t=new vec2_1.create();trans.computeGq=function(){// g = ( xj + rj - xi - ri ) * t
return vec2_1.dot(gg,t);};trans.updateJacobian=function(){var G=this.G,xi=bodyA.position,xj=bodyB.position;vec2_1.rotate(ri,localAnchorA,bodyA.angle);vec2_1.rotate(rj,localAnchorB,bodyB.angle);vec2_1.add(gg,xj,rj);vec2_1.sub(gg,gg,xi);vec2_1.sub(gg,gg,ri);vec2_1.rotate(t,localAxisA,bodyA.angle+Math.PI/2);G[0]=-t[0];G[1]=-t[1];G[2]=-vec2_1.crossLength(ri,t)+vec2_1.crossLength(t,gg);G[3]=t[0];G[4]=t[1];G[5]=vec2_1.crossLength(rj,t);};this.equations.push(trans);// Rotational part
if(!options.disableRotationalLock){var rot=new RotationalLockEquation_1(bodyA,bodyB,-maxForce,maxForce);this.equations.push(rot);}/**
       * The position of anchor A relative to anchor B, along the constraint axis.
       * @property position
       * @type {Number}
       */this.position=0;// Is this one used at all?
this.velocity=0;/**
       * Set to true to enable lower limit.
       * @property lowerLimitEnabled
       * @type {Boolean}
       */this.lowerLimitEnabled=typeof options.lowerLimit!=="undefined"?true:false;/**
       * Set to true to enable upper limit.
       * @property upperLimitEnabled
       * @type {Boolean}
       */this.upperLimitEnabled=typeof options.upperLimit!=="undefined"?true:false;/**
       * Lower constraint limit. The constraint position is forced to be larger than this value.
       * @property lowerLimit
       * @type {Number}
       */this.lowerLimit=typeof options.lowerLimit!=="undefined"?options.lowerLimit:0;/**
       * Upper constraint limit. The constraint position is forced to be smaller than this value.
       * @property upperLimit
       * @type {Number}
       */this.upperLimit=typeof options.upperLimit!=="undefined"?options.upperLimit:1;// Equations used for limits
this.upperLimitEquation=new ContactEquation_1(bodyA,bodyB);this.lowerLimitEquation=new ContactEquation_1(bodyA,bodyB);// Set max/min forces
this.upperLimitEquation.minForce=this.lowerLimitEquation.minForce=0;this.upperLimitEquation.maxForce=this.lowerLimitEquation.maxForce=maxForce;/**
       * Equation used for the motor.
       * @property motorEquation
       * @type {Equation}
       */this.motorEquation=new Equation_1(bodyA,bodyB);/**
       * The current motor state. Enable or disable the motor using .enableMotor
       * @property motorEnabled
       * @type {Boolean}
       */this.motorEnabled=false;/**
       * Set the target speed for the motor.
       * @property motorSpeed
       * @type {Number}
       */this.motorSpeed=0;var that=this;var motorEquation=this.motorEquation;var old=motorEquation.computeGW;motorEquation.computeGq=function(){return 0;};motorEquation.computeGW=function(){var G=this.G,bi=this.bodyA,bj=this.bodyB,vi=bi.velocity,vj=bj.velocity,wi=bi.angularVelocity,wj=bj.angularVelocity;return this.gmult(G,vi,wi,vj,wj)+that.motorSpeed;};}PrismaticConstraint.prototype=new Constraint_1();PrismaticConstraint.prototype.constructor=PrismaticConstraint;var worldAxisA=vec2_1.create(),worldAnchorA=vec2_1.create(),worldAnchorB=vec2_1.create(),orientedAnchorA=vec2_1.create(),orientedAnchorB=vec2_1.create(),tmp$2=vec2_1.create();/**
   * Update the constraint equations. Should be done if any of the bodies changed position, before solving.
   * @method update
   */PrismaticConstraint.prototype.update=function(){var eqs=this.equations,trans=eqs[0],upperLimit=this.upperLimit,lowerLimit=this.lowerLimit,upperLimitEquation=this.upperLimitEquation,lowerLimitEquation=this.lowerLimitEquation,bodyA=this.bodyA,bodyB=this.bodyB,localAxisA=this.localAxisA,localAnchorA=this.localAnchorA,localAnchorB=this.localAnchorB;trans.updateJacobian();// Transform local things to world
vec2_1.rotate(worldAxisA,localAxisA,bodyA.angle);vec2_1.rotate(orientedAnchorA,localAnchorA,bodyA.angle);vec2_1.add(worldAnchorA,orientedAnchorA,bodyA.position);vec2_1.rotate(orientedAnchorB,localAnchorB,bodyB.angle);vec2_1.add(worldAnchorB,orientedAnchorB,bodyB.position);var relPosition=this.position=vec2_1.dot(worldAnchorB,worldAxisA)-vec2_1.dot(worldAnchorA,worldAxisA);// Motor
if(this.motorEnabled){// G = [ a     a x ri   -a   -a x rj ]
var G=this.motorEquation.G;G[0]=worldAxisA[0];G[1]=worldAxisA[1];G[2]=vec2_1.crossLength(worldAxisA,orientedAnchorB);G[3]=-worldAxisA[0];G[4]=-worldAxisA[1];G[5]=-vec2_1.crossLength(worldAxisA,orientedAnchorA);}/*
          Limits strategy:
          Add contact equation, with normal along the constraint axis.
          min/maxForce is set so the constraint is repulsive in the correct direction.
          Some offset is added to either equation.contactPointA or .contactPointB to get the correct upper/lower limit.

                   ^
                   |
        upperLimit x
                   |    ------
           anchorB x<---|  B |
                   |    |    |
          ------   |    ------
          |    |   |
          |  A |-->x anchorA
          ------   |
                   x lowerLimit
                   |
                  axis
       */if(this.upperLimitEnabled&&relPosition>upperLimit){// Update contact constraint normal, etc
vec2_1.scale(upperLimitEquation.normalA,worldAxisA,-1);vec2_1.sub(upperLimitEquation.contactPointA,worldAnchorA,bodyA.position);vec2_1.sub(upperLimitEquation.contactPointB,worldAnchorB,bodyB.position);vec2_1.scale(tmp$2,worldAxisA,upperLimit);vec2_1.add(upperLimitEquation.contactPointA,upperLimitEquation.contactPointA,tmp$2);if(eqs.indexOf(upperLimitEquation)===-1){eqs.push(upperLimitEquation);}}else{var idx=eqs.indexOf(upperLimitEquation);if(idx!==-1){eqs.splice(idx,1);}}if(this.lowerLimitEnabled&&relPosition<lowerLimit){// Update contact constraint normal, etc
vec2_1.scale(lowerLimitEquation.normalA,worldAxisA,1);vec2_1.sub(lowerLimitEquation.contactPointA,worldAnchorA,bodyA.position);vec2_1.sub(lowerLimitEquation.contactPointB,worldAnchorB,bodyB.position);vec2_1.scale(tmp$2,worldAxisA,lowerLimit);vec2_1.sub(lowerLimitEquation.contactPointB,lowerLimitEquation.contactPointB,tmp$2);if(eqs.indexOf(lowerLimitEquation)===-1){eqs.push(lowerLimitEquation);}}else{var idx=eqs.indexOf(lowerLimitEquation);if(idx!==-1){eqs.splice(idx,1);}}};/**
   * Enable the motor
   * @method enableMotor
   */PrismaticConstraint.prototype.enableMotor=function(){if(this.motorEnabled){return;}this.equations.push(this.motorEquation);this.motorEnabled=true;};/**
   * Disable the rotational motor
   * @method disableMotor
   */PrismaticConstraint.prototype.disableMotor=function(){if(!this.motorEnabled){return;}var i=this.equations.indexOf(this.motorEquation);this.equations.splice(i,1);this.motorEnabled=false;};/**
   * Set the constraint limits.
   * @method setLimits
   * @param {number} lower Lower limit.
   * @param {number} upper Upper limit.
   */PrismaticConstraint.prototype.setLimits=function(lower,upper){if(typeof lower==='number'){this.lowerLimit=lower;this.lowerLimitEnabled=true;}else{this.lowerLimit=lower;this.lowerLimitEnabled=false;}if(typeof upper==='number'){this.upperLimit=upper;this.upperLimitEnabled=true;}else{this.upperLimit=upper;this.upperLimitEnabled=false;}};var SAPBroadphase_1=SAPBroadphase;/**
   * Sweep and prune broadphase along one axis.
   *
   * @class SAPBroadphase
   * @constructor
   * @extends Broadphase
   */function SAPBroadphase(){Broadphase_1.call(this,Broadphase_1.SAP);/**
       * List of bodies currently in the broadphase.
       * @property axisList
       * @type {Array}
       */this.axisList=[];/**
       * The axis to sort along. 0 means x-axis and 1 y-axis. If your bodies are more spread out over the X axis, set axisIndex to 0, and you will gain some performance.
       * @property axisIndex
       * @type {Number}
       */this.axisIndex=0;var that=this;this._addBodyHandler=function(e){that.axisList.push(e.body);};this._removeBodyHandler=function(e){// Remove from list
var idx=that.axisList.indexOf(e.body);if(idx!==-1){that.axisList.splice(idx,1);}};}SAPBroadphase.prototype=new Broadphase_1();SAPBroadphase.prototype.constructor=SAPBroadphase;/**
   * Change the world
   * @method setWorld
   * @param {World} world
   */SAPBroadphase.prototype.setWorld=function(world){// Clear the old axis array
this.axisList.length=0;// Add all bodies from the new world
Utils_1.appendArray(this.axisList,world.bodies);// Remove old handlers, if any
world.off("addBody",this._addBodyHandler).off("removeBody",this._removeBodyHandler);// Add handlers to update the list of bodies.
world.on("addBody",this._addBodyHandler).on("removeBody",this._removeBodyHandler);this.world=world;};/**
   * Sorts bodies along an axis.
   * @method sortAxisList
   * @param {Array} a
   * @param {number} axisIndex
   * @return {Array}
   */SAPBroadphase.sortAxisList=function(a,axisIndex){axisIndex=axisIndex|0;for(var i=1,l=a.length;i<l;i++){var v=a[i];for(var j=i-1;j>=0;j--){if(a[j].aabb.lowerBound[axisIndex]<=v.aabb.lowerBound[axisIndex]){break;}a[j+1]=a[j];}a[j+1]=v;}return a;};SAPBroadphase.prototype.sortList=function(){var bodies=this.axisList,axisIndex=this.axisIndex;// Sort the lists
SAPBroadphase.sortAxisList(bodies,axisIndex);};/**
   * Get the colliding pairs
   * @method getCollisionPairs
   * @param  {World} world
   * @return {Array}
   */SAPBroadphase.prototype.getCollisionPairs=function(world){var bodies=this.axisList,result=this.result,axisIndex=this.axisIndex;result.length=0;// Update all AABBs if needed
var l=bodies.length;while(l--){var b=bodies[l];if(b.aabbNeedsUpdate){b.updateAABB();}}// Sort the lists
this.sortList();// Look through the X list
for(var i=0,N=bodies.length|0;i!==N;i++){var bi=bodies[i];for(var j=i+1;j<N;j++){var bj=bodies[j];// Bounds overlap?
var overlaps=bj.aabb.lowerBound[axisIndex]<=bi.aabb.upperBound[axisIndex];if(!overlaps){break;}if(Broadphase_1.canCollide(bi,bj)&&this.boundingVolumeCheck(bi,bj)){result.push(bi,bj);}}}return result;};/**
   * Returns all the bodies within an AABB.
   * @method aabbQuery
   * @param  {World} world
   * @param  {AABB} aabb
   * @param {array} result An array to store resulting bodies in.
   * @return {array}
   */SAPBroadphase.prototype.aabbQuery=function(world,aabb,result){result=result||[];this.sortList();var axisIndex=this.axisIndex;var axis='x';if(axisIndex===1){axis='y';}if(axisIndex===2){axis='z';}var axisList=this.axisList;var lower=aabb.lowerBound[axis];var upper=aabb.upperBound[axis];for(var i=0;i<axisList.length;i++){var b=axisList[i];if(b.aabbNeedsUpdate){b.updateAABB();}if(b.aabb.overlaps(aabb)){result.push(b);}}return result;};var Spring_1=Spring;/**
   * A spring, connecting two bodies. The Spring explicitly adds force and angularForce to the bodies and does therefore not put load on the constraint solver.
   *
   * @class Spring
   * @constructor
   * @param {Body} bodyA
   * @param {Body} bodyB
   * @param {Object} [options]
   * @param {number} [options.stiffness=100]  Spring constant (see Hookes Law). A number >= 0.
   * @param {number} [options.damping=1]      A number >= 0. Default: 1
   * @param {Array}  [options.localAnchorA]   Where to hook the spring to body A, in local body coordinates. Defaults to the body center.
   * @param {Array}  [options.localAnchorB]
   * @param {Array}  [options.worldAnchorA]   Where to hook the spring to body A, in world coordinates. Overrides the option "localAnchorA" if given.
   * @param {Array}  [options.worldAnchorB]
   */function Spring(bodyA,bodyB,options){options=Utils_1.defaults(options,{stiffness:100,damping:1});/**
       * Stiffness of the spring.
       * @property stiffness
       * @type {number}
       */this.stiffness=options.stiffness;/**
       * Damping of the spring.
       * @property damping
       * @type {number}
       */this.damping=options.damping;/**
       * First connected body.
       * @property bodyA
       * @type {Body}
       */this.bodyA=bodyA;/**
       * Second connected body.
       * @property bodyB
       * @type {Body}
       */this.bodyB=bodyB;}/**
   * Apply the spring force to the connected bodies.
   * @method applyForce
   */Spring.prototype.applyForce=function(){// To be implemented by subclasses
};var TopDownVehicle_1=TopDownVehicle;/**
   * @class TopDownVehicle
   * @constructor
   * @param {Body} chassisBody A dynamic body, already added to the world.
   * @param {Object} [options]
   *
   * @example
   *
   *     // Create a dynamic body for the chassis
   *     var chassisBody = new Body({
   *         mass: 1
   *     });
   *     var boxShape = new Box({ width: 0.5, height: 1 });
   *     chassisBody.addShape(boxShape);
   *     world.addBody(chassisBody);
   *
   *     // Create the vehicle
   *     var vehicle = new TopDownVehicle(chassisBody);
   *
   *     // Add one front wheel and one back wheel - we don't actually need four :)
   *     var frontWheel = vehicle.addWheel({
   *         localPosition: [0, 0.5] // front
   *     });
   *     frontWheel.setSideFriction(4);
   *
   *     // Back wheel
   *     var backWheel = vehicle.addWheel({
   *         localPosition: [0, -0.5] // back
   *     });
   *     backWheel.setSideFriction(3); // Less side friction on back wheel makes it easier to drift
   *     vehicle.addToWorld(world);
   *
   *     // Steer value zero means straight forward. Positive is left and negative right.
   *     frontWheel.steerValue = Math.PI / 16;
   *
   *     // Engine force forward
   *     backWheel.engineForce = 10;
   *     backWheel.setBrakeForce(0);
   */function TopDownVehicle(chassisBody,options){options=options||{};/**
       * @property {Body} chassisBody
       */this.chassisBody=chassisBody;/**
       * @property {Array} wheels
       */this.wheels=[];// A dummy body to constrain the chassis to
this.groundBody=new Body_1({mass:0});this.world=null;var that=this;this.preStepCallback=function(){that.update();};}/**
   * @method addToWorld
   * @param {World} world
   */TopDownVehicle.prototype.addToWorld=function(world){this.world=world;world.addBody(this.groundBody);world.on('preStep',this.preStepCallback);for(var i=0;i<this.wheels.length;i++){var wheel=this.wheels[i];world.addConstraint(wheel);}};/**
   * @method removeFromWorld
   * @param {World} world
   */TopDownVehicle.prototype.removeFromWorld=function(){var world=this.world;world.removeBody(this.groundBody);world.off('preStep',this.preStepCallback);for(var i=0;i<this.wheels.length;i++){var wheel=this.wheels[i];world.removeConstraint(wheel);}this.world=null;};/**
   * @method addWheel
   * @param {object} [wheelOptions]
   * @return {WheelConstraint}
   */TopDownVehicle.prototype.addWheel=function(wheelOptions){var wheel=new WheelConstraint(this,wheelOptions);this.wheels.push(wheel);return wheel;};/**
   * @method update
   */TopDownVehicle.prototype.update=function(){for(var i=0;i<this.wheels.length;i++){this.wheels[i].update();}};/**
   * @class WheelConstraint
   * @constructor
   * @extends {Constraint}
   * @param {Vehicle} vehicle
   * @param {object} [options]
   * @param {Array} [options.localForwardVector]The local wheel forward vector in local body space. Default is zero.
   * @param {Array} [options.localPosition] The local position of the wheen in the chassis body. Default is zero - the center of the body.
   * @param {Array} [options.sideFriction=5] The max friction force in the sideways direction.
   */function WheelConstraint(vehicle,options){options=options||{};this.vehicle=vehicle;this.forwardEquation=new FrictionEquation_1(vehicle.chassisBody,vehicle.groundBody);this.sideEquation=new FrictionEquation_1(vehicle.chassisBody,vehicle.groundBody);/**
       * @property {number} steerValue
       */this.steerValue=0;/**
       * @property {number} engineForce
       */this.engineForce=0;this.setSideFriction(options.sideFriction!==undefined?options.sideFriction:5);/**
       * @property {Array} localForwardVector
       */this.localForwardVector=vec2_1.fromValues(0,1);if(options.localForwardVector){vec2_1.copy(this.localForwardVector,options.localForwardVector);}/**
       * @property {Array} localPosition
       */this.localPosition=vec2_1.fromValues(0,0);if(options.localPosition){vec2_1.copy(this.localPosition,options.localPosition);}Constraint_1.apply(this,vehicle.chassisBody,vehicle.groundBody);this.equations.push(this.forwardEquation,this.sideEquation);this.setBrakeForce(0);}WheelConstraint.prototype=new Constraint_1();/**
   * @method setForwardFriction
   */WheelConstraint.prototype.setBrakeForce=function(force){this.forwardEquation.setSlipForce(force);};/**
   * @method setSideFriction
   */WheelConstraint.prototype.setSideFriction=function(force){this.sideEquation.setSlipForce(force);};var worldVelocity=vec2_1.create();var relativePoint=vec2_1.create();/**
   * @method getSpeed
   */WheelConstraint.prototype.getSpeed=function(){this.vehicle.chassisBody.vectorToWorldFrame(relativePoint,this.localForwardVector);this.vehicle.chassisBody.getVelocityAtPoint(worldVelocity,relativePoint);return vec2_1.dot(worldVelocity,relativePoint);};var tmpVec=vec2_1.create();/**
   * @method update
   */WheelConstraint.prototype.update=function(){// Directional
this.vehicle.chassisBody.vectorToWorldFrame(this.forwardEquation.t,this.localForwardVector);vec2_1.rotate(this.sideEquation.t,this.localForwardVector,Math.PI/2);this.vehicle.chassisBody.vectorToWorldFrame(this.sideEquation.t,this.sideEquation.t);vec2_1.rotate(this.forwardEquation.t,this.forwardEquation.t,this.steerValue);vec2_1.rotate(this.sideEquation.t,this.sideEquation.t,this.steerValue);// Attachment point
this.vehicle.chassisBody.toWorldFrame(this.forwardEquation.contactPointB,this.localPosition);vec2_1.copy(this.sideEquation.contactPointB,this.forwardEquation.contactPointB);this.vehicle.chassisBody.vectorToWorldFrame(this.forwardEquation.contactPointA,this.localPosition);vec2_1.copy(this.sideEquation.contactPointA,this.forwardEquation.contactPointA);// Add engine force
vec2_1.normalize(tmpVec,this.forwardEquation.t);vec2_1.scale(tmpVec,tmpVec,this.engineForce);this.vehicle.chassisBody.applyForce(tmpVec,this.forwardEquation.contactPointA);};var LinearSpring_1=LinearSpring;/**
   * A spring, connecting two bodies.
   *
   * The Spring explicitly adds force and angularForce to the bodies.
   *
   * @class LinearSpring
   * @extends Spring
   * @constructor
   * @param {Body} bodyA
   * @param {Body} bodyB
   * @param {Object} [options]
   * @param {number} [options.restLength]   A number > 0. Default is the current distance between the world anchor points.
   * @param {number} [options.stiffness=100]  Spring constant (see Hookes Law). A number >= 0.
   * @param {number} [options.damping=1]      A number >= 0. Default: 1
   * @param {Array}  [options.worldAnchorA]   Where to hook the spring to body A, in world coordinates. Overrides the option "localAnchorA" if given.
   * @param {Array}  [options.worldAnchorB]
   * @param {Array}  [options.localAnchorA]   Where to hook the spring to body A, in local body coordinates. Defaults to the body center.
   * @param {Array}  [options.localAnchorB]
   */function LinearSpring(bodyA,bodyB,options){options=options||{};Spring_1.call(this,bodyA,bodyB,options);/**
       * Anchor for bodyA in local bodyA coordinates.
       * @property localAnchorA
       * @type {Array}
       */this.localAnchorA=vec2_1.fromValues(0,0);/**
       * Anchor for bodyB in local bodyB coordinates.
       * @property localAnchorB
       * @type {Array}
       */this.localAnchorB=vec2_1.fromValues(0,0);if(options.localAnchorA){vec2_1.copy(this.localAnchorA,options.localAnchorA);}if(options.localAnchorB){vec2_1.copy(this.localAnchorB,options.localAnchorB);}if(options.worldAnchorA){this.setWorldAnchorA(options.worldAnchorA);}if(options.worldAnchorB){this.setWorldAnchorB(options.worldAnchorB);}var worldAnchorA=vec2_1.create();var worldAnchorB=vec2_1.create();this.getWorldAnchorA(worldAnchorA);this.getWorldAnchorB(worldAnchorB);var worldDistance=vec2_1.distance(worldAnchorA,worldAnchorB);/**
       * Rest length of the spring.
       * @property restLength
       * @type {number}
       */this.restLength=typeof options.restLength==="number"?options.restLength:worldDistance;}LinearSpring.prototype=new Spring_1();LinearSpring.prototype.constructor=LinearSpring;/**
   * Set the anchor point on body A, using world coordinates.
   * @method setWorldAnchorA
   * @param {Array} worldAnchorA
   */LinearSpring.prototype.setWorldAnchorA=function(worldAnchorA){this.bodyA.toLocalFrame(this.localAnchorA,worldAnchorA);};/**
   * Set the anchor point on body B, using world coordinates.
   * @method setWorldAnchorB
   * @param {Array} worldAnchorB
   */LinearSpring.prototype.setWorldAnchorB=function(worldAnchorB){this.bodyB.toLocalFrame(this.localAnchorB,worldAnchorB);};/**
   * Get the anchor point on body A, in world coordinates.
   * @method getWorldAnchorA
   * @param {Array} result The vector to store the result in.
   */LinearSpring.prototype.getWorldAnchorA=function(result){this.bodyA.toWorldFrame(result,this.localAnchorA);};/**
   * Get the anchor point on body B, in world coordinates.
   * @method getWorldAnchorB
   * @param {Array} result The vector to store the result in.
   */LinearSpring.prototype.getWorldAnchorB=function(result){this.bodyB.toWorldFrame(result,this.localAnchorB);};var applyForce_r=vec2_1.create(),applyForce_r_unit=vec2_1.create(),applyForce_u=vec2_1.create(),applyForce_f=vec2_1.create(),applyForce_worldAnchorA=vec2_1.create(),applyForce_worldAnchorB=vec2_1.create(),applyForce_ri=vec2_1.create(),applyForce_rj=vec2_1.create(),applyForce_tmp=vec2_1.create();/**
   * Apply the spring force to the connected bodies.
   * @method applyForce
   */LinearSpring.prototype.applyForce=function(){var k=this.stiffness,d=this.damping,l=this.restLength,bodyA=this.bodyA,bodyB=this.bodyB,r=applyForce_r,r_unit=applyForce_r_unit,u=applyForce_u,f=applyForce_f,tmp=applyForce_tmp;var worldAnchorA=applyForce_worldAnchorA,worldAnchorB=applyForce_worldAnchorB,ri=applyForce_ri,rj=applyForce_rj;// Get world anchors
this.getWorldAnchorA(worldAnchorA);this.getWorldAnchorB(worldAnchorB);// Get offset points
vec2_1.sub(ri,worldAnchorA,bodyA.position);vec2_1.sub(rj,worldAnchorB,bodyB.position);// Compute distance vector between world anchor points
vec2_1.sub(r,worldAnchorB,worldAnchorA);var rlen=vec2_1.len(r);vec2_1.normalize(r_unit,r);//console.log(rlen)
//console.log("A",vec2.str(worldAnchorA),"B",vec2.str(worldAnchorB))
// Compute relative velocity of the anchor points, u
vec2_1.sub(u,bodyB.velocity,bodyA.velocity);vec2_1.crossZV(tmp,bodyB.angularVelocity,rj);vec2_1.add(u,u,tmp);vec2_1.crossZV(tmp,bodyA.angularVelocity,ri);vec2_1.sub(u,u,tmp);// F = - k * ( x - L ) - D * ( u )
vec2_1.scale(f,r_unit,-k*(rlen-l)-d*vec2_1.dot(u,r_unit));// Add forces to bodies
vec2_1.sub(bodyA.force,bodyA.force,f);vec2_1.add(bodyB.force,bodyB.force,f);// Angular force
var ri_x_f=vec2_1.crossLength(ri,f);var rj_x_f=vec2_1.crossLength(rj,f);bodyA.angularForce-=ri_x_f;bodyB.angularForce+=rj_x_f;};var RotationalSpring_1=RotationalSpring;/**
   * A rotational spring, connecting two bodies rotation. This spring explicitly adds angularForce (torque) to the bodies.
   *
   * The spring can be combined with a {{#crossLink "RevoluteConstraint"}}{{/crossLink}} to make, for example, a mouse trap.
   *
   * @class RotationalSpring
   * @extends Spring
   * @constructor
   * @param {Body} bodyA
   * @param {Body} bodyB
   * @param {Object} [options]
   * @param {number} [options.restAngle] The relative angle of bodies at which the spring is at rest. If not given, it's set to the current relative angle between the bodies.
   * @param {number} [options.stiffness=100] Spring constant (see Hookes Law). A number >= 0.
   * @param {number} [options.damping=1] A number >= 0.
   */function RotationalSpring(bodyA,bodyB,options){options=options||{};Spring_1.call(this,bodyA,bodyB,options);/**
       * Rest angle of the spring.
       * @property restAngle
       * @type {number}
       */this.restAngle=typeof options.restAngle==="number"?options.restAngle:bodyB.angle-bodyA.angle;}RotationalSpring.prototype=new Spring_1();RotationalSpring.prototype.constructor=RotationalSpring;/**
   * Apply the spring force to the connected bodies.
   * @method applyForce
   */RotationalSpring.prototype.applyForce=function(){var k=this.stiffness,d=this.damping,l=this.restAngle,bodyA=this.bodyA,bodyB=this.bodyB,x=bodyB.angle-bodyA.angle,u=bodyB.angularVelocity-bodyA.angularVelocity;var torque=-k*(x-l)-d*u*0;bodyA.angularForce-=torque;bodyB.angularForce+=torque;};var _args=[["p2@0.7.1","/mnt/c/work/git/temp/lance"]];var _from="p2@0.7.1";var _id="p2@0.7.1";var _inBundle=false;var _integrity="sha1-JfJHTZvDptMUCh2iamfJ4RislUM=";var _location="/p2";var _phantomChildren={};var _requested={type:"version",registry:true,raw:"p2@0.7.1",name:"p2",escapedName:"p2",rawSpec:"0.7.1",saveSpec:null,fetchSpec:"0.7.1"};var _requiredBy=["/"];var _resolved="https://registry.npmjs.org/p2/-/p2-0.7.1.tgz";var _spec="0.7.1";var _where="/mnt/c/work/git/temp/lance";var author={name:"Stefan Hedman",email:"schteppe@gmail.com",url:"http://steffe.se"};var bugs={url:"https://github.com/schteppe/p2.js/issues"};var dependencies={"poly-decomp":"0.1.1"};var description="A JavaScript 2D physics engine.";var devDependencies={grunt:"^0.4.5","grunt-browserify":"~2.0.1","grunt-contrib-concat":"^0.4.0","grunt-contrib-jshint":"^0.11.2","grunt-contrib-nodeunit":"^0.4.1","grunt-contrib-uglify":"~0.4.0","grunt-contrib-watch":"~0.5.0"};var engines={node:"*"};var homepage="https://github.com/schteppe/p2.js#readme";var keywords=["p2.js","p2","physics","engine","2d"];var licenses=[{type:"MIT"}];var main="./src/p2.js";var name="p2";var repository={type:"git",url:"git+https://github.com/schteppe/p2.js.git"};var version="0.7.1";var _package={_args:_args,_from:_from,_id:_id,_inBundle:_inBundle,_integrity:_integrity,_location:_location,_phantomChildren:_phantomChildren,_requested:_requested,_requiredBy:_requiredBy,_resolved:_resolved,_spec:_spec,_where:_where,author:author,bugs:bugs,dependencies:dependencies,description:description,devDependencies:devDependencies,engines:engines,homepage:homepage,keywords:keywords,licenses:licenses,main:main,name:name,repository:repository,version:version};var _package$1=/*#__PURE__*/Object.freeze({_args:_args,_from:_from,_id:_id,_inBundle:_inBundle,_integrity:_integrity,_location:_location,_phantomChildren:_phantomChildren,_requested:_requested,_requiredBy:_requiredBy,_resolved:_resolved,_spec:_spec,_where:_where,author:author,bugs:bugs,dependencies:dependencies,description:description,devDependencies:devDependencies,engines:engines,homepage:homepage,keywords:keywords,licenses:licenses,main:main,name:name,repository:repository,version:version,default:_package});var OverlapKeeperRecord_1=OverlapKeeperRecord;/**
   * Overlap data container for the OverlapKeeper
   * @class OverlapKeeperRecord
   * @constructor
   * @param {Body} bodyA
   * @param {Shape} shapeA
   * @param {Body} bodyB
   * @param {Shape} shapeB
   */function OverlapKeeperRecord(bodyA,shapeA,bodyB,shapeB){/**
       * @property {Shape} shapeA
       */this.shapeA=shapeA;/**
       * @property {Shape} shapeB
       */this.shapeB=shapeB;/**
       * @property {Body} bodyA
       */this.bodyA=bodyA;/**
       * @property {Body} bodyB
       */this.bodyB=bodyB;}/**
   * Set the data for the record
   * @method set
   * @param {Body} bodyA
   * @param {Shape} shapeA
   * @param {Body} bodyB
   * @param {Shape} shapeB
   */OverlapKeeperRecord.prototype.set=function(bodyA,shapeA,bodyB,shapeB){OverlapKeeperRecord.call(this,bodyA,shapeA,bodyB,shapeB);};var OverlapKeeperRecordPool_1=OverlapKeeperRecordPool;/**
   * @class
   */function OverlapKeeperRecordPool(){Pool_1.apply(this,arguments);}OverlapKeeperRecordPool.prototype=new Pool_1();OverlapKeeperRecordPool.prototype.constructor=OverlapKeeperRecordPool;/**
   * @method create
   * @return {OverlapKeeperRecord}
   */OverlapKeeperRecordPool.prototype.create=function(){return new OverlapKeeperRecord_1();};/**
   * @method destroy
   * @param {OverlapKeeperRecord} record
   * @return {OverlapKeeperRecordPool}
   */OverlapKeeperRecordPool.prototype.destroy=function(record){record.bodyA=record.bodyB=record.shapeA=record.shapeB=null;return this;};var OverlapKeeper_1=OverlapKeeper;/**
   * Keeps track of overlaps in the current state and the last step state.
   * @class OverlapKeeper
   * @constructor
   */function OverlapKeeper(){this.overlappingShapesLastState=new TupleDictionary_1();this.overlappingShapesCurrentState=new TupleDictionary_1();this.recordPool=new OverlapKeeperRecordPool_1({size:16});this.tmpDict=new TupleDictionary_1();this.tmpArray1=[];}/**
   * Ticks one step forward in time. This will move the current overlap state to the "old" overlap state, and create a new one as current.
   * @method tick
   */OverlapKeeper.prototype.tick=function(){var last=this.overlappingShapesLastState;var current=this.overlappingShapesCurrentState;// Save old objects into pool
var l=last.keys.length;while(l--){var key=last.keys[l];var lastObject=last.getByKey(key);var currentObject=current.getByKey(key);if(lastObject){// The record is only used in the "last" dict, and will be removed. We might as well pool it.
this.recordPool.release(lastObject);}}// Clear last object
last.reset();// Transfer from new object to old
last.copy(current);// Clear current object
current.reset();};/**
   * @method setOverlapping
   * @param {Body} bodyA
   * @param {Body} shapeA
   * @param {Body} bodyB
   * @param {Body} shapeB
   */OverlapKeeper.prototype.setOverlapping=function(bodyA,shapeA,bodyB,shapeB){var last=this.overlappingShapesLastState;var current=this.overlappingShapesCurrentState;// Store current contact state
if(!current.get(shapeA.id,shapeB.id)){var data=this.recordPool.get();data.set(bodyA,shapeA,bodyB,shapeB);current.set(shapeA.id,shapeB.id,data);}};OverlapKeeper.prototype.getNewOverlaps=function(result){return this.getDiff(this.overlappingShapesLastState,this.overlappingShapesCurrentState,result);};OverlapKeeper.prototype.getEndOverlaps=function(result){return this.getDiff(this.overlappingShapesCurrentState,this.overlappingShapesLastState,result);};/**
   * Checks if two bodies are currently overlapping.
   * @method bodiesAreOverlapping
   * @param  {Body} bodyA
   * @param  {Body} bodyB
   * @return {boolean}
   */OverlapKeeper.prototype.bodiesAreOverlapping=function(bodyA,bodyB){var current=this.overlappingShapesCurrentState;var l=current.keys.length;while(l--){var key=current.keys[l];var data=current.data[key];if(data.bodyA===bodyA&&data.bodyB===bodyB||data.bodyA===bodyB&&data.bodyB===bodyA){return true;}}return false;};OverlapKeeper.prototype.getDiff=function(dictA,dictB,result){var result=result||[];var last=dictA;var current=dictB;result.length=0;var l=current.keys.length;while(l--){var key=current.keys[l];var data=current.data[key];if(!data){throw new Error('Key '+key+' had no data!');}var lastData=last.data[key];if(!lastData){// Not overlapping in last state, but in current.
result.push(data);}}return result;};OverlapKeeper.prototype.isNewOverlap=function(shapeA,shapeB){var idA=shapeA.id|0,idB=shapeB.id|0;var last=this.overlappingShapesLastState;var current=this.overlappingShapesCurrentState;// Not in last but in new
return!!!last.get(idA,idB)&&!!current.get(idA,idB);};OverlapKeeper.prototype.getNewBodyOverlaps=function(result){this.tmpArray1.length=0;var overlaps=this.getNewOverlaps(this.tmpArray1);return this.getBodyDiff(overlaps,result);};OverlapKeeper.prototype.getEndBodyOverlaps=function(result){this.tmpArray1.length=0;var overlaps=this.getEndOverlaps(this.tmpArray1);return this.getBodyDiff(overlaps,result);};OverlapKeeper.prototype.getBodyDiff=function(overlaps,result){result=result||[];var accumulator=this.tmpDict;var l=overlaps.length;while(l--){var data=overlaps[l];// Since we use body id's for the accumulator, these will be a subset of the original one
accumulator.set(data.bodyA.id|0,data.bodyB.id|0,data);}l=accumulator.keys.length;while(l--){var data=accumulator.getByKey(accumulator.keys[l]);if(data){result.push(data.bodyA,data.bodyB);}}accumulator.reset();return result;};var Island_1=Island;/**
   * An island of bodies connected with equations.
   * @class Island
   * @constructor
   */function Island(){/**
       * Current equations in this island.
       * @property equations
       * @type {Array}
       */this.equations=[];/**
       * Current bodies in this island.
       * @property bodies
       * @type {Array}
       */this.bodies=[];}/**
   * Clean this island from bodies and equations.
   * @method reset
   */Island.prototype.reset=function(){this.equations.length=this.bodies.length=0;};var bodyIds=[];/**
   * Get all unique bodies in this island.
   * @method getBodies
   * @return {Array} An array of Body
   */Island.prototype.getBodies=function(result){var bodies=result||[],eqs=this.equations;bodyIds.length=0;for(var i=0;i!==eqs.length;i++){var eq=eqs[i];if(bodyIds.indexOf(eq.bodyA.id)===-1){bodies.push(eq.bodyA);bodyIds.push(eq.bodyA.id);}if(bodyIds.indexOf(eq.bodyB.id)===-1){bodies.push(eq.bodyB);bodyIds.push(eq.bodyB.id);}}return bodies;};/**
   * Check if the entire island wants to sleep.
   * @method wantsToSleep
   * @return {Boolean}
   */Island.prototype.wantsToSleep=function(){for(var i=0;i<this.bodies.length;i++){var b=this.bodies[i];if(b.type===Body_1.DYNAMIC&&!b.wantsToSleep){return false;}}return true;};/**
   * Make all bodies in the island sleep.
   * @method sleep
   */Island.prototype.sleep=function(){for(var i=0;i<this.bodies.length;i++){var b=this.bodies[i];b.sleep();}return true;};var IslandNode_1=IslandNode;/**
   * Holds a body and keeps track of some additional properties needed for graph traversal.
   * @class IslandNode
   * @constructor
   * @param {Body} body
   */function IslandNode(body){/**
  	 * The body that is contained in this node.
  	 * @property {Body} body
  	 */this.body=body;/**
       * Neighboring IslandNodes
       * @property {Array} neighbors
       */this.neighbors=[];/**
       * Equations connected to this node.
       * @property {Array} equations
       */this.equations=[];/**
       * If this node was visiting during the graph traversal.
       * @property visited
       * @type {Boolean}
       */this.visited=false;}/**
   * Clean this node from bodies and equations.
   * @method reset
   */IslandNode.prototype.reset=function(){this.equations.length=0;this.neighbors.length=0;this.visited=false;this.body=null;};var IslandNodePool_1=IslandNodePool;/**
   * @class
   */function IslandNodePool(){Pool_1.apply(this,arguments);}IslandNodePool.prototype=new Pool_1();IslandNodePool.prototype.constructor=IslandNodePool;/**
   * @method create
   * @return {IslandNode}
   */IslandNodePool.prototype.create=function(){return new IslandNode_1();};/**
   * @method destroy
   * @param {IslandNode} node
   * @return {IslandNodePool}
   */IslandNodePool.prototype.destroy=function(node){node.reset();return this;};var IslandPool_1=IslandPool;/**
   * @class
   */function IslandPool(){Pool_1.apply(this,arguments);}IslandPool.prototype=new Pool_1();IslandPool.prototype.constructor=IslandPool;/**
   * @method create
   * @return {Island}
   */IslandPool.prototype.create=function(){return new Island_1();};/**
   * @method destroy
   * @param {Island} island
   * @return {IslandPool}
   */IslandPool.prototype.destroy=function(island){island.reset();return this;};var IslandManager_1=IslandManager;/**
   * Splits the system of bodies and equations into independent islands
   *
   * @class IslandManager
   * @constructor
   * @param {Object} [options]
   * @extends Solver
   */function IslandManager(options){/**
       * @property nodePool
       * @type {IslandNodePool}
       */this.nodePool=new IslandNodePool_1({size:16});/**
       * @property islandPool
       * @type {IslandPool}
       */this.islandPool=new IslandPool_1({size:8});/**
       * The equations to split. Manually fill this array before running .split().
       * @property {Array} equations
       */this.equations=[];/**
       * The resulting {{#crossLink "Island"}}{{/crossLink}}s.
       * @property {Array} islands
       */this.islands=[];/**
       * The resulting graph nodes.
       * @property {Array} nodes
       */this.nodes=[];/**
       * The node queue, used when traversing the graph of nodes.
       * @private
       * @property {Array} queue
       */this.queue=[];}/**
   * Get an unvisited node from a list of nodes.
   * @static
   * @method getUnvisitedNode
   * @param  {Array} nodes
   * @return {IslandNode|boolean} The node if found, else false.
   */IslandManager.getUnvisitedNode=function(nodes){var Nnodes=nodes.length;for(var i=0;i!==Nnodes;i++){var node=nodes[i];if(!node.visited&&node.body.type===Body_1.DYNAMIC){return node;}}return false;};/**
   * Visit a node.
   * @method visit
   * @param  {IslandNode} node
   * @param  {Array} bds
   * @param  {Array} eqs
   */IslandManager.prototype.visit=function(node,bds,eqs){bds.push(node.body);var Neqs=node.equations.length;for(var i=0;i!==Neqs;i++){var eq=node.equations[i];if(eqs.indexOf(eq)===-1){// Already added?
eqs.push(eq);}}};/**
   * Runs the search algorithm, starting at a root node. The resulting bodies and equations will be stored in the provided arrays.
   * @method bfs
   * @param  {IslandNode} root The node to start from
   * @param  {Array} bds  An array to append resulting Bodies to.
   * @param  {Array} eqs  An array to append resulting Equations to.
   */IslandManager.prototype.bfs=function(root,bds,eqs){// Reset the visit queue
var queue=this.queue;queue.length=0;// Add root node to queue
queue.push(root);root.visited=true;this.visit(root,bds,eqs);// Process all queued nodes
while(queue.length){// Get next node in the queue
var node=queue.pop();// Visit unvisited neighboring nodes
var child;while(child=IslandManager.getUnvisitedNode(node.neighbors)){child.visited=true;this.visit(child,bds,eqs);// Only visit the children of this node if it's dynamic
if(child.body.type===Body_1.DYNAMIC){queue.push(child);}}}};/**
   * Split the world into independent islands. The result is stored in .islands.
   * @method split
   * @param  {World} world
   * @return {Array} The generated islands
   */IslandManager.prototype.split=function(world){var bodies=world.bodies,nodes=this.nodes,equations=this.equations;// Move old nodes to the node pool
while(nodes.length){this.nodePool.release(nodes.pop());}// Create needed nodes, reuse if possible
for(var i=0;i!==bodies.length;i++){var node=this.nodePool.get();node.body=bodies[i];nodes.push(node);// if(this.nodePool.length){
//     var node = this.nodePool.pop();
//     node.reset();
//     node.body = bodies[i];
//     nodes.push(node);
// } else {
//     nodes.push(new IslandNode(bodies[i]));
// }
}// Add connectivity data. Each equation connects 2 bodies.
for(var k=0;k!==equations.length;k++){var eq=equations[k],i=bodies.indexOf(eq.bodyA),j=bodies.indexOf(eq.bodyB),ni=nodes[i],nj=nodes[j];ni.neighbors.push(nj);nj.neighbors.push(ni);ni.equations.push(eq);nj.equations.push(eq);}// Move old islands to the island pool
var islands=this.islands;for(var i=0;i<islands.length;i++){this.islandPool.release(islands[i]);}islands.length=0;// Get islands
var child;while(child=IslandManager.getUnvisitedNode(nodes)){// Create new island
var island=this.islandPool.get();// Get all equations and bodies in this island
this.bfs(child,island.bodies,island.equations);islands.push(island);}return islands;};var require$$43=getCjsExportFromNamespace(_package$1);var World_1=World;/**
   * The dynamics world, where all bodies and constraints live.
   *
   * @class World
   * @constructor
   * @param {Object} [options]
   * @param {Solver} [options.solver] Defaults to GSSolver.
   * @param {Array} [options.gravity] Defaults to y=-9.78.
   * @param {Broadphase} [options.broadphase] Defaults to SAPBroadphase
   * @param {Boolean} [options.islandSplit=true]
   * @extends EventEmitter
   *
   * @example
   *     var world = new World({
   *         gravity: [0, -10],
   *         broadphase: new SAPBroadphase()
   *     });
   *     world.addBody(new Body());
   */function World(options){EventEmitter_1.apply(this);options=options||{};/**
       * All springs in the world. To add a spring to the world, use {{#crossLink "World/addSpring:method"}}{{/crossLink}}.
       *
       * @property springs
       * @type {Array}
       */this.springs=[];/**
       * All bodies in the world. To add a body to the world, use {{#crossLink "World/addBody:method"}}{{/crossLink}}.
       * @property {Array} bodies
       */this.bodies=[];/**
       * Disabled body collision pairs. See {{#crossLink "World/disableBodyCollision:method"}}.
       * @private
       * @property {Array} disabledBodyCollisionPairs
       */this.disabledBodyCollisionPairs=[];/**
       * The solver used to satisfy constraints and contacts. Default is {{#crossLink "GSSolver"}}{{/crossLink}}.
       * @property {Solver} solver
       */this.solver=options.solver||new GSSolver_1();/**
       * The narrowphase to use to generate contacts.
       *
       * @property narrowphase
       * @type {Narrowphase}
       */this.narrowphase=new Narrowphase_1(this);/**
       * The island manager of this world.
       * @property {IslandManager} islandManager
       */this.islandManager=new IslandManager_1();/**
       * Gravity in the world. This is applied on all bodies in the beginning of each step().
       *
       * @property gravity
       * @type {Array}
       */this.gravity=vec2_1.fromValues(0,-9.78);if(options.gravity){vec2_1.copy(this.gravity,options.gravity);}/**
       * Gravity to use when approximating the friction max force (mu*mass*gravity).
       * @property {Number} frictionGravity
       */this.frictionGravity=vec2_1.length(this.gravity)||10;/**
       * Set to true if you want .frictionGravity to be automatically set to the length of .gravity.
       * @property {Boolean} useWorldGravityAsFrictionGravity
       * @default true
       */this.useWorldGravityAsFrictionGravity=true;/**
       * If the length of .gravity is zero, and .useWorldGravityAsFrictionGravity=true, then switch to using .frictionGravity for friction instead. This fallback is useful for gravityless games.
       * @property {Boolean} useFrictionGravityOnZeroGravity
       * @default true
       */this.useFrictionGravityOnZeroGravity=true;/**
       * The broadphase algorithm to use.
       *
       * @property broadphase
       * @type {Broadphase}
       */this.broadphase=options.broadphase||new SAPBroadphase_1();this.broadphase.setWorld(this);/**
       * User-added constraints.
       *
       * @property constraints
       * @type {Array}
       */this.constraints=[];/**
       * Dummy default material in the world, used in .defaultContactMaterial
       * @property {Material} defaultMaterial
       */this.defaultMaterial=new Material_1();/**
       * The default contact material to use, if no contact material was set for the colliding materials.
       * @property {ContactMaterial} defaultContactMaterial
       */this.defaultContactMaterial=new ContactMaterial_1(this.defaultMaterial,this.defaultMaterial);/**
       * For keeping track of what time step size we used last step
       * @property lastTimeStep
       * @type {Number}
       */this.lastTimeStep=1/60;/**
       * Enable to automatically apply spring forces each step.
       * @property applySpringForces
       * @type {Boolean}
       * @default true
       */this.applySpringForces=true;/**
       * Enable to automatically apply body damping each step.
       * @property applyDamping
       * @type {Boolean}
       * @default true
       */this.applyDamping=true;/**
       * Enable to automatically apply gravity each step.
       * @property applyGravity
       * @type {Boolean}
       * @default true
       */this.applyGravity=true;/**
       * Enable/disable constraint solving in each step.
       * @property solveConstraints
       * @type {Boolean}
       * @default true
       */this.solveConstraints=true;/**
       * The ContactMaterials added to the World.
       * @property contactMaterials
       * @type {Array}
       */this.contactMaterials=[];/**
       * World time.
       * @property time
       * @type {Number}
       */this.time=0.0;this.accumulator=0;/**
       * Is true during step().
       * @property {Boolean} stepping
       */this.stepping=false;/**
       * Bodies that are scheduled to be removed at the end of the step.
       * @property {Array} bodiesToBeRemoved
       * @private
       */this.bodiesToBeRemoved=[];/**
       * Whether to enable island splitting. Island splitting can be an advantage for both precision and performance. See {{#crossLink "IslandManager"}}{{/crossLink}}.
       * @property {Boolean} islandSplit
       * @default true
       */this.islandSplit=typeof options.islandSplit!=="undefined"?!!options.islandSplit:true;/**
       * Set to true if you want to the world to emit the "impact" event. Turning this off could improve performance.
       * @property emitImpactEvent
       * @type {Boolean}
       * @default true
       */this.emitImpactEvent=true;// Id counters
this._constraintIdCounter=0;this._bodyIdCounter=0;/**
       * Fired after the step().
       * @event postStep
       */this.postStepEvent={type:"postStep"};/**
       * Fired when a body is added to the world.
       * @event addBody
       * @param {Body} body
       */this.addBodyEvent={type:"addBody",body:null};/**
       * Fired when a body is removed from the world.
       * @event removeBody
       * @param {Body} body
       */this.removeBodyEvent={type:"removeBody",body:null};/**
       * Fired when a spring is added to the world.
       * @event addSpring
       * @param {Spring} spring
       */this.addSpringEvent={type:"addSpring",spring:null};/**
       * Fired when a first contact is created between two bodies. This event is fired after the step has been done.
       * @event impact
       * @param {Body} bodyA
       * @param {Body} bodyB
       */this.impactEvent={type:"impact",bodyA:null,bodyB:null,shapeA:null,shapeB:null,contactEquation:null};/**
       * Fired after the Broadphase has collected collision pairs in the world.
       * Inside the event handler, you can modify the pairs array as you like, to
       * prevent collisions between objects that you don't want.
       * @event postBroadphase
       * @param {Array} pairs An array of collision pairs. If this array is [body1,body2,body3,body4], then the body pairs 1,2 and 3,4 would advance to narrowphase.
       */this.postBroadphaseEvent={type:"postBroadphase",pairs:null};/**
       * How to deactivate bodies during simulation. Possible modes are: {{#crossLink "World/NO_SLEEPING:property"}}World.NO_SLEEPING{{/crossLink}}, {{#crossLink "World/BODY_SLEEPING:property"}}World.BODY_SLEEPING{{/crossLink}} and {{#crossLink "World/ISLAND_SLEEPING:property"}}World.ISLAND_SLEEPING{{/crossLink}}.
       * If sleeping is enabled, you might need to {{#crossLink "Body/wakeUp:method"}}wake up{{/crossLink}} the bodies if they fall asleep when they shouldn't. If you want to enable sleeping in the world, but want to disable it for a particular body, see {{#crossLink "Body/allowSleep:property"}}Body.allowSleep{{/crossLink}}.
       * @property sleepMode
       * @type {number}
       * @default World.NO_SLEEPING
       */this.sleepMode=World.NO_SLEEPING;/**
       * Fired when two shapes starts start to overlap. Fired in the narrowphase, during step.
       * @event beginContact
       * @param {Shape} shapeA
       * @param {Shape} shapeB
       * @param {Body}  bodyA
       * @param {Body}  bodyB
       * @param {Array} contactEquations
       */this.beginContactEvent={type:"beginContact",shapeA:null,shapeB:null,bodyA:null,bodyB:null,contactEquations:[]};/**
       * Fired when two shapes stop overlapping, after the narrowphase (during step).
       * @event endContact
       * @param {Shape} shapeA
       * @param {Shape} shapeB
       * @param {Body}  bodyA
       * @param {Body}  bodyB
       */this.endContactEvent={type:"endContact",shapeA:null,shapeB:null,bodyA:null,bodyB:null};/**
       * Fired just before equations are added to the solver to be solved. Can be used to control what equations goes into the solver.
       * @event preSolve
       * @param {Array} contactEquations  An array of contacts to be solved.
       * @param {Array} frictionEquations An array of friction equations to be solved.
       */this.preSolveEvent={type:"preSolve",contactEquations:null,frictionEquations:null};// For keeping track of overlapping shapes
this.overlappingShapesLastState={keys:[]};this.overlappingShapesCurrentState={keys:[]};/**
       * @property {OverlapKeeper} overlapKeeper
       */this.overlapKeeper=new OverlapKeeper_1();}World.prototype=new Object(EventEmitter_1.prototype);World.prototype.constructor=World;/**
   * Never deactivate bodies.
   * @static
   * @property {number} NO_SLEEPING
   */World.NO_SLEEPING=1;/**
   * Deactivate individual bodies if they are sleepy.
   * @static
   * @property {number} BODY_SLEEPING
   */World.BODY_SLEEPING=2;/**
   * Deactivates bodies that are in contact, if all of them are sleepy. Note that you must enable {{#crossLink "World/islandSplit:property"}}.islandSplit{{/crossLink}} for this to work.
   * @static
   * @property {number} ISLAND_SLEEPING
   */World.ISLAND_SLEEPING=4;/**
   * Add a constraint to the simulation.
   *
   * @method addConstraint
   * @param {Constraint} constraint
   * @example
   *     var constraint = new LockConstraint(bodyA, bodyB);
   *     world.addConstraint(constraint);
   */World.prototype.addConstraint=function(constraint){this.constraints.push(constraint);};/**
   * Add a ContactMaterial to the simulation.
   * @method addContactMaterial
   * @param {ContactMaterial} contactMaterial
   */World.prototype.addContactMaterial=function(contactMaterial){this.contactMaterials.push(contactMaterial);};/**
   * Removes a contact material
   *
   * @method removeContactMaterial
   * @param {ContactMaterial} cm
   */World.prototype.removeContactMaterial=function(cm){var idx=this.contactMaterials.indexOf(cm);if(idx!==-1){Utils_1.splice(this.contactMaterials,idx,1);}};/**
   * Get a contact material given two materials
   * @method getContactMaterial
   * @param {Material} materialA
   * @param {Material} materialB
   * @return {ContactMaterial} The matching ContactMaterial, or false on fail.
   * @todo Use faster hash map to lookup from material id's
   */World.prototype.getContactMaterial=function(materialA,materialB){var cmats=this.contactMaterials;for(var i=0,N=cmats.length;i!==N;i++){var cm=cmats[i];if(cm.materialA.id===materialA.id&&cm.materialB.id===materialB.id||cm.materialA.id===materialB.id&&cm.materialB.id===materialA.id){return cm;}}return false;};/**
   * Removes a constraint
   *
   * @method removeConstraint
   * @param {Constraint} constraint
   */World.prototype.removeConstraint=function(constraint){var idx=this.constraints.indexOf(constraint);if(idx!==-1){Utils_1.splice(this.constraints,idx,1);}};var step_r=vec2_1.create(),step_runit=vec2_1.create(),step_u=vec2_1.create(),step_f=vec2_1.create(),step_fhMinv=vec2_1.create(),step_velodt=vec2_1.create(),step_mg=vec2_1.create(),xiw=vec2_1.fromValues(0,0),xjw=vec2_1.fromValues(0,0),zero=vec2_1.fromValues(0,0),interpvelo=vec2_1.fromValues(0,0);/**
   * Step the physics world forward in time.
   *
   * There are two modes. The simple mode is fixed timestepping without interpolation. In this case you only use the first argument. The second case uses interpolation. In that you also provide the time since the function was last used, as well as the maximum fixed timesteps to take.
   *
   * @method step
   * @param {Number} dt                       The fixed time step size to use.
   * @param {Number} [timeSinceLastCalled=0]  The time elapsed since the function was last called.
   * @param {Number} [maxSubSteps=10]         Maximum number of fixed steps to take per function call.
   *
   * @example
   *     // Simple fixed timestepping without interpolation
   *     var fixedTimeStep = 1 / 60;
   *     var world = new World();
   *     var body = new Body({ mass: 1 });
   *     world.addBody(body);
   *
   *     function animate(){
   *         requestAnimationFrame(animate);
   *         world.step(fixedTimeStep);
   *         renderBody(body.position, body.angle);
   *     }
   *
   *     // Start animation loop
   *     requestAnimationFrame(animate);
   *
   * @example
   *     // Fixed timestepping with interpolation
   *     var maxSubSteps = 10;
   *     var lastTimeSeconds;
   *
   *     function animate(t){
   *         requestAnimationFrame(animate);
   *         timeSeconds = t / 1000;
   *         lastTimeSeconds = lastTimeSeconds || timeSeconds;
   *
   *         deltaTime = timeSeconds - lastTimeSeconds;
   *         world.step(fixedTimeStep, deltaTime, maxSubSteps);
   *
   *         renderBody(body.interpolatedPosition, body.interpolatedAngle);
   *     }
   *
   *     // Start animation loop
   *     requestAnimationFrame(animate);
   *
   * @see http://bulletphysics.org/mediawiki-1.5.8/index.php/Stepping_The_World
   */World.prototype.step=function(dt,timeSinceLastCalled,maxSubSteps){maxSubSteps=maxSubSteps||10;timeSinceLastCalled=timeSinceLastCalled||0;if(timeSinceLastCalled===0){// Fixed, simple stepping
this.internalStep(dt);// Increment time
this.time+=dt;}else{this.accumulator+=timeSinceLastCalled;var substeps=0;while(this.accumulator>=dt&&substeps<maxSubSteps){// Do fixed steps to catch up
this.internalStep(dt);this.time+=dt;this.accumulator-=dt;substeps++;}var t=this.accumulator%dt/dt;for(var j=0;j!==this.bodies.length;j++){var b=this.bodies[j];vec2_1.lerp(b.interpolatedPosition,b.previousPosition,b.position,t);b.interpolatedAngle=b.previousAngle+t*(b.angle-b.previousAngle);}}};var endOverlaps=[];/**
   * Make a fixed step.
   * @method internalStep
   * @param  {number} dt
   * @private
   */World.prototype.internalStep=function(dt){this.stepping=true;var Nsprings=this.springs.length,springs=this.springs,bodies=this.bodies,g=this.gravity,solver=this.solver,Nbodies=this.bodies.length,broadphase=this.broadphase,np=this.narrowphase,constraints=this.constraints,mg=step_mg,scale=vec2_1.scale,add=vec2_1.add,rotate=vec2_1.rotate,islandManager=this.islandManager;this.overlapKeeper.tick();this.lastTimeStep=dt;// Update approximate friction gravity.
if(this.useWorldGravityAsFrictionGravity){var gravityLen=vec2_1.length(this.gravity);if(!(gravityLen===0&&this.useFrictionGravityOnZeroGravity)){// Nonzero gravity. Use it.
this.frictionGravity=gravityLen;}}// Add gravity to bodies
if(this.applyGravity){for(var i=0;i!==Nbodies;i++){var b=bodies[i],fi=b.force;if(b.type!==Body_1.DYNAMIC||b.sleepState===Body_1.SLEEPING){continue;}vec2_1.scale(mg,g,b.mass*b.gravityScale);// F=m*g
add(fi,fi,mg);}}// Add spring forces
if(this.applySpringForces){for(var i=0;i!==Nsprings;i++){var s=springs[i];s.applyForce();}}if(this.applyDamping){for(var i=0;i!==Nbodies;i++){var b=bodies[i];if(b.type===Body_1.DYNAMIC){b.applyDamping(dt);}}}// Broadphase
var result=broadphase.getCollisionPairs(this);// Remove ignored collision pairs
var ignoredPairs=this.disabledBodyCollisionPairs;for(var i=ignoredPairs.length-2;i>=0;i-=2){for(var j=result.length-2;j>=0;j-=2){if(ignoredPairs[i]===result[j]&&ignoredPairs[i+1]===result[j+1]||ignoredPairs[i+1]===result[j]&&ignoredPairs[i]===result[j+1]){result.splice(j,2);}}}// Remove constrained pairs with collideConnected == false
var Nconstraints=constraints.length;for(i=0;i!==Nconstraints;i++){var c=constraints[i];if(!c.collideConnected){for(var j=result.length-2;j>=0;j-=2){if(c.bodyA===result[j]&&c.bodyB===result[j+1]||c.bodyB===result[j]&&c.bodyA===result[j+1]){result.splice(j,2);}}}}// postBroadphase event
this.postBroadphaseEvent.pairs=result;this.emit(this.postBroadphaseEvent);this.postBroadphaseEvent.pairs=null;// Narrowphase
np.reset(this);for(var i=0,Nresults=result.length;i!==Nresults;i+=2){var bi=result[i],bj=result[i+1];// Loop over all shapes of body i
for(var k=0,Nshapesi=bi.shapes.length;k!==Nshapesi;k++){var si=bi.shapes[k],xi=si.position,ai=si.angle;// All shapes of body j
for(var l=0,Nshapesj=bj.shapes.length;l!==Nshapesj;l++){var sj=bj.shapes[l],xj=sj.position,aj=sj.angle;var cm=this.defaultContactMaterial;if(si.material&&sj.material){var tmp=this.getContactMaterial(si.material,sj.material);if(tmp){cm=tmp;}}this.runNarrowphase(np,bi,si,xi,ai,bj,sj,xj,aj,cm,this.frictionGravity);}}}// Wake up bodies
for(var i=0;i!==Nbodies;i++){var body=bodies[i];if(body._wakeUpAfterNarrowphase){body.wakeUp();body._wakeUpAfterNarrowphase=false;}}// Emit end overlap events
if(this.has('endContact')){this.overlapKeeper.getEndOverlaps(endOverlaps);var e=this.endContactEvent;var l=endOverlaps.length;while(l--){var data=endOverlaps[l];e.shapeA=data.shapeA;e.shapeB=data.shapeB;e.bodyA=data.bodyA;e.bodyB=data.bodyB;this.emit(e);}endOverlaps.length=0;}var preSolveEvent=this.preSolveEvent;preSolveEvent.contactEquations=np.contactEquations;preSolveEvent.frictionEquations=np.frictionEquations;this.emit(preSolveEvent);preSolveEvent.contactEquations=preSolveEvent.frictionEquations=null;// update constraint equations
var Nconstraints=constraints.length;for(i=0;i!==Nconstraints;i++){constraints[i].update();}if(np.contactEquations.length||np.frictionEquations.length||Nconstraints){if(this.islandSplit){// Split into islands
islandManager.equations.length=0;Utils_1.appendArray(islandManager.equations,np.contactEquations);Utils_1.appendArray(islandManager.equations,np.frictionEquations);for(i=0;i!==Nconstraints;i++){Utils_1.appendArray(islandManager.equations,constraints[i].equations);}islandManager.split(this);for(var i=0;i!==islandManager.islands.length;i++){var island=islandManager.islands[i];if(island.equations.length){solver.solveIsland(dt,island);}}}else{// Add contact equations to solver
solver.addEquations(np.contactEquations);solver.addEquations(np.frictionEquations);// Add user-defined constraint equations
for(i=0;i!==Nconstraints;i++){solver.addEquations(constraints[i].equations);}if(this.solveConstraints){solver.solve(dt,this);}solver.removeAllEquations();}}// Step forward
for(var i=0;i!==Nbodies;i++){var body=bodies[i];// if(body.sleepState !== Body.SLEEPING && body.type !== Body.STATIC){
body.integrate(dt);// }
}// Reset force
for(var i=0;i!==Nbodies;i++){bodies[i].setZeroForce();}// Emit impact event
if(this.emitImpactEvent&&this.has('impact')){var ev=this.impactEvent;for(var i=0;i!==np.contactEquations.length;i++){var eq=np.contactEquations[i];if(eq.firstImpact){ev.bodyA=eq.bodyA;ev.bodyB=eq.bodyB;ev.shapeA=eq.shapeA;ev.shapeB=eq.shapeB;ev.contactEquation=eq;this.emit(ev);}}}// Sleeping update
if(this.sleepMode===World.BODY_SLEEPING){for(i=0;i!==Nbodies;i++){bodies[i].sleepTick(this.time,false,dt);}}else if(this.sleepMode===World.ISLAND_SLEEPING&&this.islandSplit){// Tell all bodies to sleep tick but dont sleep yet
for(i=0;i!==Nbodies;i++){bodies[i].sleepTick(this.time,true,dt);}// Sleep islands
for(var i=0;i<this.islandManager.islands.length;i++){var island=this.islandManager.islands[i];if(island.wantsToSleep()){island.sleep();}}}this.stepping=false;// Remove bodies that are scheduled for removal
var bodiesToBeRemoved=this.bodiesToBeRemoved;for(var i=0;i!==bodiesToBeRemoved.length;i++){this.removeBody(bodiesToBeRemoved[i]);}bodiesToBeRemoved.length=0;this.emit(this.postStepEvent);};/**
   * Runs narrowphase for the shape pair i and j.
   * @method runNarrowphase
   * @param  {Narrowphase} np
   * @param  {Body} bi
   * @param  {Shape} si
   * @param  {Array} xi
   * @param  {Number} ai
   * @param  {Body} bj
   * @param  {Shape} sj
   * @param  {Array} xj
   * @param  {Number} aj
   * @param  {Number} mu
   */World.prototype.runNarrowphase=function(np,bi,si,xi,ai,bj,sj,xj,aj,cm,glen){// Check collision groups and masks
if(!((si.collisionGroup&sj.collisionMask)!==0&&(sj.collisionGroup&si.collisionMask)!==0)){return;}// Get world position and angle of each shape
vec2_1.rotate(xiw,xi,bi.angle);vec2_1.rotate(xjw,xj,bj.angle);vec2_1.add(xiw,xiw,bi.position);vec2_1.add(xjw,xjw,bj.position);var aiw=ai+bi.angle;var ajw=aj+bj.angle;np.enableFriction=cm.friction>0;np.frictionCoefficient=cm.friction;var reducedMass;if(bi.type===Body_1.STATIC||bi.type===Body_1.KINEMATIC){reducedMass=bj.mass;}else if(bj.type===Body_1.STATIC||bj.type===Body_1.KINEMATIC){reducedMass=bi.mass;}else{reducedMass=bi.mass*bj.mass/(bi.mass+bj.mass);}np.slipForce=cm.friction*glen*reducedMass;np.restitution=cm.restitution;np.surfaceVelocity=cm.surfaceVelocity;np.frictionStiffness=cm.frictionStiffness;np.frictionRelaxation=cm.frictionRelaxation;np.stiffness=cm.stiffness;np.relaxation=cm.relaxation;np.contactSkinSize=cm.contactSkinSize;np.enabledEquations=bi.collisionResponse&&bj.collisionResponse&&si.collisionResponse&&sj.collisionResponse;var resolver=np[si.type|sj.type],numContacts=0;if(resolver){var sensor=si.sensor||sj.sensor;var numFrictionBefore=np.frictionEquations.length;if(si.type<sj.type){numContacts=resolver.call(np,bi,si,xiw,aiw,bj,sj,xjw,ajw,sensor);}else{numContacts=resolver.call(np,bj,sj,xjw,ajw,bi,si,xiw,aiw,sensor);}var numFrictionEquations=np.frictionEquations.length-numFrictionBefore;if(numContacts){if(bi.allowSleep&&bi.type===Body_1.DYNAMIC&&bi.sleepState===Body_1.SLEEPING&&bj.sleepState===Body_1.AWAKE&&bj.type!==Body_1.STATIC){var speedSquaredB=vec2_1.squaredLength(bj.velocity)+Math.pow(bj.angularVelocity,2);var speedLimitSquaredB=Math.pow(bj.sleepSpeedLimit,2);if(speedSquaredB>=speedLimitSquaredB*2){bi._wakeUpAfterNarrowphase=true;}}if(bj.allowSleep&&bj.type===Body_1.DYNAMIC&&bj.sleepState===Body_1.SLEEPING&&bi.sleepState===Body_1.AWAKE&&bi.type!==Body_1.STATIC){var speedSquaredA=vec2_1.squaredLength(bi.velocity)+Math.pow(bi.angularVelocity,2);var speedLimitSquaredA=Math.pow(bi.sleepSpeedLimit,2);if(speedSquaredA>=speedLimitSquaredA*2){bj._wakeUpAfterNarrowphase=true;}}this.overlapKeeper.setOverlapping(bi,si,bj,sj);if(this.has('beginContact')&&this.overlapKeeper.isNewOverlap(si,sj)){// Report new shape overlap
var e=this.beginContactEvent;e.shapeA=si;e.shapeB=sj;e.bodyA=bi;e.bodyB=bj;// Reset contact equations
e.contactEquations.length=0;if(typeof numContacts==="number"){for(var i=np.contactEquations.length-numContacts;i<np.contactEquations.length;i++){e.contactEquations.push(np.contactEquations[i]);}}this.emit(e);}// divide the max friction force by the number of contacts
if(typeof numContacts==="number"&&numFrictionEquations>1){// Why divide by 1?
for(var i=np.frictionEquations.length-numFrictionEquations;i<np.frictionEquations.length;i++){var f=np.frictionEquations[i];f.setSlipForce(f.getSlipForce()/numFrictionEquations);}}}}};/**
   * Add a spring to the simulation
   *
   * @method addSpring
   * @param {Spring} spring
   */World.prototype.addSpring=function(spring){this.springs.push(spring);var evt=this.addSpringEvent;evt.spring=spring;this.emit(evt);evt.spring=null;};/**
   * Remove a spring
   *
   * @method removeSpring
   * @param {Spring} spring
   */World.prototype.removeSpring=function(spring){var idx=this.springs.indexOf(spring);if(idx!==-1){Utils_1.splice(this.springs,idx,1);}};/**
   * Add a body to the simulation
   *
   * @method addBody
   * @param {Body} body
   *
   * @example
   *     var world = new World(),
   *         body = new Body();
   *     world.addBody(body);
   * @todo What if this is done during step?
   */World.prototype.addBody=function(body){if(this.bodies.indexOf(body)===-1){this.bodies.push(body);body.world=this;var evt=this.addBodyEvent;evt.body=body;this.emit(evt);evt.body=null;}};/**
   * Remove a body from the simulation. If this method is called during step(), the body removal is scheduled to after the step.
   *
   * @method removeBody
   * @param {Body} body
   */World.prototype.removeBody=function(body){if(this.stepping){this.bodiesToBeRemoved.push(body);}else{body.world=null;var idx=this.bodies.indexOf(body);if(idx!==-1){Utils_1.splice(this.bodies,idx,1);this.removeBodyEvent.body=body;body.resetConstraintVelocity();this.emit(this.removeBodyEvent);this.removeBodyEvent.body=null;}}};/**
   * Get a body by its id.
   * @method getBodyById
   * @param {number} id
   * @return {Body} The body, or false if it was not found.
   */World.prototype.getBodyById=function(id){var bodies=this.bodies;for(var i=0;i<bodies.length;i++){var b=bodies[i];if(b.id===id){return b;}}return false;};/**
   * Disable collision between two bodies
   * @method disableBodyCollision
   * @param {Body} bodyA
   * @param {Body} bodyB
   */World.prototype.disableBodyCollision=function(bodyA,bodyB){this.disabledBodyCollisionPairs.push(bodyA,bodyB);};/**
   * Enable collisions between the given two bodies
   * @method enableBodyCollision
   * @param {Body} bodyA
   * @param {Body} bodyB
   */World.prototype.enableBodyCollision=function(bodyA,bodyB){var pairs=this.disabledBodyCollisionPairs;for(var i=0;i<pairs.length;i+=2){if(pairs[i]===bodyA&&pairs[i+1]===bodyB||pairs[i+1]===bodyA&&pairs[i]===bodyB){pairs.splice(i,2);return;}}};/**
   * Resets the World, removes all bodies, constraints and springs.
   *
   * @method clear
   */World.prototype.clear=function(){this.time=0;// Remove all solver equations
if(this.solver&&this.solver.equations.length){this.solver.removeAllEquations();}// Remove all constraints
var cs=this.constraints;for(var i=cs.length-1;i>=0;i--){this.removeConstraint(cs[i]);}// Remove all bodies
var bodies=this.bodies;for(var i=bodies.length-1;i>=0;i--){this.removeBody(bodies[i]);}// Remove all springs
var springs=this.springs;for(var i=springs.length-1;i>=0;i--){this.removeSpring(springs[i]);}// Remove all contact materials
var cms=this.contactMaterials;for(var i=cms.length-1;i>=0;i--){this.removeContactMaterial(cms[i]);}World.apply(this);};var hitTest_tmp1=vec2_1.create(),hitTest_zero=vec2_1.fromValues(0,0),hitTest_tmp2=vec2_1.fromValues(0,0);/**
   * Test if a world point overlaps bodies
   * @method hitTest
   * @param  {Array}  worldPoint  Point to use for intersection tests
   * @param  {Array}  bodies      A list of objects to check for intersection
   * @param  {Number} precision   Used for matching against particles and lines. Adds some margin to these infinitesimal objects.
   * @return {Array}              Array of bodies that overlap the point
   * @todo Should use an api similar to the raycast function
   * @todo Should probably implement a .containsPoint method for all shapes. Would be more efficient
   * @todo Should use the broadphase
   */World.prototype.hitTest=function(worldPoint,bodies,precision){precision=precision||0;// Create a dummy particle body with a particle shape to test against the bodies
var pb=new Body_1({position:worldPoint}),ps=new Particle_1(),px=worldPoint,pa=0,x=hitTest_tmp1,tmp=hitTest_tmp2;pb.addShape(ps);var n=this.narrowphase,result=[];// Check bodies
for(var i=0,N=bodies.length;i!==N;i++){var b=bodies[i];for(var j=0,NS=b.shapes.length;j!==NS;j++){var s=b.shapes[j];// Get shape world position + angle
vec2_1.rotate(x,s.position,b.angle);vec2_1.add(x,x,b.position);var a=s.angle+b.angle;if(s instanceof Circle_1&&n.circleParticle(b,s,x,a,pb,ps,px,pa,true)||s instanceof Convex_1&&n.particleConvex(pb,ps,px,pa,b,s,x,a,true)||s instanceof Plane_1&&n.particlePlane(pb,ps,px,pa,b,s,x,a,true)||s instanceof Capsule_1&&n.particleCapsule(pb,ps,px,pa,b,s,x,a,true)||s instanceof Particle_1&&vec2_1.squaredLength(vec2_1.sub(tmp,x,worldPoint))<precision*precision){result.push(b);}}}return result;};/**
   * Set the stiffness for all equations and contact materials.
   * @method setGlobalStiffness
   * @param {Number} stiffness
   */World.prototype.setGlobalStiffness=function(stiffness){// Set for all constraints
var constraints=this.constraints;for(var i=0;i!==constraints.length;i++){var c=constraints[i];for(var j=0;j!==c.equations.length;j++){var eq=c.equations[j];eq.stiffness=stiffness;eq.needsUpdate=true;}}// Set for all contact materials
var contactMaterials=this.contactMaterials;for(var i=0;i!==contactMaterials.length;i++){var c=contactMaterials[i];c.stiffness=c.frictionStiffness=stiffness;}// Set for default contact material
var c=this.defaultContactMaterial;c.stiffness=c.frictionStiffness=stiffness;};/**
   * Set the relaxation for all equations and contact materials.
   * @method setGlobalRelaxation
   * @param {Number} relaxation
   */World.prototype.setGlobalRelaxation=function(relaxation){// Set for all constraints
for(var i=0;i!==this.constraints.length;i++){var c=this.constraints[i];for(var j=0;j!==c.equations.length;j++){var eq=c.equations[j];eq.relaxation=relaxation;eq.needsUpdate=true;}}// Set for all contact materials
for(var i=0;i!==this.contactMaterials.length;i++){var c=this.contactMaterials[i];c.relaxation=c.frictionRelaxation=relaxation;}// Set for default contact material
var c=this.defaultContactMaterial;c.relaxation=c.frictionRelaxation=relaxation;};var tmpAABB=new AABB_1();var tmpArray$1=[];/**
   * Ray cast against all bodies in the world.
   * @method raycast
   * @param  {RaycastResult} result
   * @param  {Ray} ray
   * @return {boolean} True if any body was hit.
   *
   * @example
   *     var ray = new Ray({
   *         mode: Ray.CLOSEST, // or ANY
   *         from: [0, 0],
   *         to: [10, 0],
   *     });
   *     var result = new RaycastResult();
   *     world.raycast(result, ray);
   *
   *     // Get the hit point
   *     var hitPoint = vec2.create();
   *     result.getHitPoint(hitPoint, ray);
   *     console.log('Hit point: ', hitPoint[0], hitPoint[1], ' at distance ' + result.getHitDistance(ray));
   *
   * @example
   *     var ray = new Ray({
   *         mode: Ray.ALL,
   *         from: [0, 0],
   *         to: [10, 0],
   *         callback: function(result){
   *
   *             // Print some info about the hit
   *             console.log('Hit body and shape: ', result.body, result.shape);
   *
   *             // Get the hit point
   *             var hitPoint = vec2.create();
   *             result.getHitPoint(hitPoint, ray);
   *             console.log('Hit point: ', hitPoint[0], hitPoint[1], ' at distance ' + result.getHitDistance(ray));
   *
   *             // If you are happy with the hits you got this far, you can stop the traversal here:
   *             result.stop();
   *         }
   *     });
   *     var result = new RaycastResult();
   *     world.raycast(result, ray);
   */World.prototype.raycast=function(result,ray){// Get all bodies within the ray AABB
ray.getAABB(tmpAABB);this.broadphase.aabbQuery(this,tmpAABB,tmpArray$1);ray.intersectBodies(result,tmpArray$1);tmpArray$1.length=0;return result.hasHit();};var p2_1=createCommonjsModule(function(module){// Export p2 classes
var p2=module.exports={AABB:AABB_1,AngleLockEquation:AngleLockEquation_1,Body:Body_1,Broadphase:Broadphase_1,Capsule:Capsule_1,Circle:Circle_1,Constraint:Constraint_1,ContactEquation:ContactEquation_1,ContactEquationPool:ContactEquationPool_1,ContactMaterial:ContactMaterial_1,Convex:Convex_1,DistanceConstraint:DistanceConstraint_1,Equation:Equation_1,EventEmitter:EventEmitter_1,FrictionEquation:FrictionEquation_1,FrictionEquationPool:FrictionEquationPool_1,GearConstraint:GearConstraint_1,GSSolver:GSSolver_1,Heightfield:Heightfield_1,Line:Line_1$1,LockConstraint:LockConstraint_1,Material:Material_1,Narrowphase:Narrowphase_1,NaiveBroadphase:NaiveBroadphase_1,Particle:Particle_1,Plane:Plane_1,Pool:Pool_1,RevoluteConstraint:RevoluteConstraint_1,PrismaticConstraint:PrismaticConstraint_1,Ray:Ray_1,RaycastResult:RaycastResult_1,Box:Box_1,RotationalVelocityEquation:RotationalVelocityEquation_1,SAPBroadphase:SAPBroadphase_1,Shape:Shape_1,Solver:Solver_1,Spring:Spring_1,TopDownVehicle:TopDownVehicle_1,LinearSpring:LinearSpring_1,RotationalSpring:RotationalSpring_1,Utils:Utils_1,World:World_1,vec2:vec2_1,version:require$$43.version};Object.defineProperty(p2,'Rectangle',{get:function get(){console.warn('The Rectangle class has been renamed to Box.');return this.Box;}});});var p2_2=p2_1.AABB;var p2_3=p2_1.AngleLockEquation;var p2_4=p2_1.Body;var p2_5=p2_1.Broadphase;var p2_6=p2_1.Capsule;var p2_7=p2_1.Circle;var p2_8=p2_1.Constraint;var p2_9=p2_1.ContactEquation;var p2_10=p2_1.ContactEquationPool;var p2_11=p2_1.ContactMaterial;var p2_12=p2_1.Convex;var p2_13=p2_1.DistanceConstraint;var p2_14=p2_1.Equation;var p2_15=p2_1.EventEmitter;var p2_16=p2_1.FrictionEquation;var p2_17=p2_1.FrictionEquationPool;var p2_18=p2_1.GearConstraint;var p2_19=p2_1.GSSolver;var p2_20=p2_1.Heightfield;var p2_21=p2_1.Line;var p2_22=p2_1.LockConstraint;var p2_23=p2_1.Material;var p2_24=p2_1.Narrowphase;var p2_25=p2_1.NaiveBroadphase;var p2_26=p2_1.Particle;var p2_27=p2_1.Plane;var p2_28=p2_1.Pool;var p2_29=p2_1.RevoluteConstraint;var p2_30=p2_1.PrismaticConstraint;var p2_31=p2_1.Ray;var p2_32=p2_1.RaycastResult;var p2_33=p2_1.Box;var p2_34=p2_1.RotationalVelocityEquation;var p2_35=p2_1.SAPBroadphase;var p2_36=p2_1.Shape;var p2_37=p2_1.Solver;var p2_38=p2_1.Spring;var p2_39=p2_1.TopDownVehicle;var p2_40=p2_1.LinearSpring;var p2_41=p2_1.RotationalSpring;var p2_42=p2_1.Utils;var p2_43=p2_1.World;var p2_44=p2_1.vec2;var p2_45=p2_1.version;/**
   * CannonPhysicsEngine is a three-dimensional lightweight physics engine
   */var P2PhysicsEngine=/*#__PURE__*/function(_PhysicsEngine){_inherits(P2PhysicsEngine,_PhysicsEngine);function P2PhysicsEngine(options){var _this;_classCallCheck(this,P2PhysicsEngine);_this=_possibleConstructorReturn(this,_getPrototypeOf(P2PhysicsEngine).call(this,options));_this.options.dt=_this.options.dt||1/60;_this.world=new p2_1.World({gravity:[0,0]});_this.p2=p2_1;return _this;}// entry point for a single step of the Simple Physics
_createClass(P2PhysicsEngine,[{key:"step",value:function step(dt,objectFilter){this.world.step(dt||this.options.dt);}// add a circle
},{key:"addCircle",value:function addCircle(radius,mass){// create a body, add shape, add to world
var body=new p2_1.Body({mass:mass,position:[0,0]});body.addShape(new p2_1.Circle({radius:radius}));this.world.addBody(body);return body;}},{key:"addBox",value:function addBox(width,height,mass){// create a body, add shape, add to world
var body=new p2_1.Body({mass:mass,position:[0,0]});body.addShape(new p2_1.Box({width:width,height:height}));this.world.addBody(body);return body;}},{key:"removeObject",value:function removeObject(obj){this.world.removeBody(obj);}}]);return P2PhysicsEngine;}(PhysicsEngine);var Utils$1=/*#__PURE__*/function(){function Utils(){_classCallCheck(this,Utils);}_createClass(Utils,null,[{key:"hashStr",value:function hashStr(str,bits){var hash=5381;var i=str.length;bits=bits?bits:8;while(i){hash=hash*33^str.charCodeAt(--i);}hash=hash>>>0;hash=hash%(Math.pow(2,bits)-1);// JavaScript does bitwise operations (like XOR, above) on 32-bit signed
// integers. Since we want the results to be always positive, convert the
// signed int to an unsigned by doing an unsigned bitshift. */
return hash;}},{key:"arrayBuffersEqual",value:function arrayBuffersEqual(buf1,buf2){if(buf1.byteLength!==buf2.byteLength)return false;var dv1=new Int8Array(buf1);var dv2=new Int8Array(buf2);for(var i=0;i!==buf1.byteLength;i++){if(dv1[i]!==dv2[i])return false;}return true;}},{key:"httpGetPromise",value:function httpGetPromise(url){return new Promise(function(resolve,reject){var req=new XMLHttpRequest();req.open('GET',url,true);req.onload=function(){if(req.status>=200&&req.status<400)resolve(JSON.parse(req.responseText));else reject();};req.onerror=function(){};req.send();});}}]);return Utils;}();/**
   * The BaseTypes class defines the base types used in lance.
   * These are the types which can be used to define an object's netscheme attributes,
   * which can be serialized by lance.
   * @example
   *     static get netScheme() {
   *       return {
   *             strength: { type: BaseTypes.TYPES.FLOAT32 },
   *             shield: { type: BaseTypes.TYPES.INT8 },
   *             name: { type: BaseTypes.TYPES.STRING },
   *             backpack: { type: BaseTypes.TYPES.CLASSINSTANCE },
   *             coins: {
   *                 type: BaseTypes.TYPES.LIST,
   *                 itemType: BaseTypes.TYPES.UINT8
   *             }
   *         };
   *     }
   */var BaseTypes=function BaseTypes(){_classCallCheck(this,BaseTypes);};/**
   * @type {object}
   * @property {string} FLOAT32 Seriablizable float
   * @property {string} INT32 Seriablizable 32-bit integer
   * @property {string} INT16 Seriablizable 16-bit integer
   * @property {string} INT8 Seriablizable 8-bit integer
   * @property {string} UINT8 Seriablizable unsigned 8-bit integer
   * @property {string} STRING Seriablizable string
   * @property {string} CLASSINSTANCE Seriablizable class. Make sure you register all the classes included in this way.
   * @property {string} LIST Seriablizable list.  In the netScheme definition, if an attribute is defined as a list, the itemType should also be defined.
   */BaseTypes.TYPES={/**
     * Seriablizable float
     * @alias TYPES.FLOAT32
     * @memberof! BaseTypes#
     */FLOAT32:'FLOAT32',/**
     * Seriablizable 32-bit int
     * @alias TYPES.INT32
     * @memberof! BaseTypes#
     */INT32:'INT32',/**
     * Seriablizable 16-bit int
     * @alias TYPES.INT16
     * @memberof! BaseTypes#
     */INT16:'INT16',/**
     * Seriablizable 8-bit int
     * @alias TYPES.INT8
     * @memberof! BaseTypes#
     */INT8:'INT8',/**
     * Seriablizable unsigned 8-bit int
     * @alias TYPES.UINT8
     * @memberof! BaseTypes#
     */UINT8:'UINT8',/**
     * Seriablizable string
     * @alias TYPES.STRING
     * @memberof! BaseTypes#
     */STRING:'STRING',/**
     * Seriablizable class.  Make sure you registered the classes included in this way.
     * @alias TYPES.CLASSINSTANCE
     * @memberof! BaseTypes#
     */CLASSINSTANCE:'CLASSINSTANCE',/**
     * Seriablizable list.
     * @alias TYPES.LIST
     * @memberof! BaseTypes#
     */LIST:'LIST'};var Serializable=/*#__PURE__*/function(){function Serializable(){_classCallCheck(this,Serializable);}_createClass(Serializable,[{key:"serialize",/**
       *  Class can be serialized using either:
       * - a class based netScheme
       * - an instance based netScheme
       * - completely dynamically (not implemented yet)
       *
       * @param {Object} serializer - Serializer instance
       * @param {Object} [options] - Options object
       * @param {Object} options.dataBuffer [optional] - Data buffer to write to. If null a new data buffer will be created
       * @param {Number} options.bufferOffset [optional] - The buffer data offset to start writing at. Default: 0
       * @param {String} options.dry [optional] - Does not actually write to the buffer (useful to gather serializeable size)
       * @return {Object} the serialized object.  Contains attributes: dataBuffer - buffer which contains the serialized data;  bufferOffset - offset where the serialized data starts.
       */value:function serialize(serializer,options){options=Object.assign({bufferOffset:0},options);var netScheme;var dataBuffer;var dataView;var classId=0;var bufferOffset=options.bufferOffset;var localBufferOffset=0;// used for counting the bufferOffset
// instance classId
if(this.classId){classId=this.classId;}else{classId=Utils$1.hashStr(this.constructor.name);}// instance netScheme
if(this.netScheme){netScheme=this.netScheme;}else if(this.constructor.netScheme){netScheme=this.constructor.netScheme;}else{// todo define behaviour when a netScheme is undefined
console.warn('no netScheme defined! This will result in awful performance');}// TODO: currently we serialize every node twice, once to calculate the size
//       of the buffers and once to write them out.  This can be reduced to
//       a single pass by starting with a large (and static) ArrayBuffer and
//       recursively building it up.
// buffer has one Uint8Array for class id, then payload
if(options.dataBuffer==null&&options.dry!=true){var bufferSize=this.serialize(serializer,{dry:true}).bufferOffset;dataBuffer=new ArrayBuffer(bufferSize);}else{dataBuffer=options.dataBuffer;}if(options.dry!=true){dataView=new DataView(dataBuffer);// first set the id of the class, so that the deserializer can fetch information about it
dataView.setUint8(bufferOffset+localBufferOffset,classId);}// advance the offset counter
localBufferOffset+=Uint8Array.BYTES_PER_ELEMENT;if(netScheme){var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=Object.keys(netScheme).sort()[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var property=_step.value;// write the property to buffer
if(options.dry!=true){serializer.writeDataView(dataView,this[property],bufferOffset+localBufferOffset,netScheme[property]);}if(netScheme[property].type===BaseTypes.TYPES.STRING){// derive the size of the string
localBufferOffset+=Uint16Array.BYTES_PER_ELEMENT;if(this[property]!==null&&this[property]!==undefined)localBufferOffset+=this[property].length*Uint16Array.BYTES_PER_ELEMENT;}else if(netScheme[property].type===BaseTypes.TYPES.CLASSINSTANCE){// derive the size of the included class
var objectInstanceBufferOffset=this[property].serialize(serializer,{dry:true}).bufferOffset;localBufferOffset+=objectInstanceBufferOffset;}else if(netScheme[property].type===BaseTypes.TYPES.LIST){// derive the size of the list
// list starts with number of elements
localBufferOffset+=Uint16Array.BYTES_PER_ELEMENT;var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=this[property][Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var item=_step2.value;// todo inelegant, currently doesn't support list of lists
if(netScheme[property].itemType===BaseTypes.TYPES.CLASSINSTANCE){var listBufferOffset=item.serialize(serializer,{dry:true}).bufferOffset;localBufferOffset+=listBufferOffset;}else if(netScheme[property].itemType===BaseTypes.TYPES.STRING){// size includes string length plus double-byte characters
localBufferOffset+=Uint16Array.BYTES_PER_ELEMENT*(1+item.length);}else{localBufferOffset+=serializer.getTypeByteSize(netScheme[property].itemType);}}}catch(err){_didIteratorError2=true;_iteratorError2=err;}finally{try{if(!_iteratorNormalCompletion2&&_iterator2.return!=null){_iterator2.return();}}finally{if(_didIteratorError2){throw _iteratorError2;}}}}else{// advance offset
localBufferOffset+=serializer.getTypeByteSize(netScheme[property].type);}}}catch(err){_didIteratorError=true;_iteratorError=err;}finally{try{if(!_iteratorNormalCompletion&&_iterator.return!=null){_iterator.return();}}finally{if(_didIteratorError){throw _iteratorError;}}}}return{dataBuffer:dataBuffer,bufferOffset:localBufferOffset};}// build a clone of this object with pruned strings (if necessary)
},{key:"prunedStringsClone",value:function prunedStringsClone(serializer,prevObject){var _this=this;if(!prevObject)return this;prevObject=serializer.deserialize(prevObject).obj;// get list of string properties which changed
var netScheme=this.constructor.netScheme;var isString=function isString(p){return netScheme[p].type===BaseTypes.TYPES.STRING;};var hasChanged=function hasChanged(p){return prevObject[p]!==_this[p];};var changedStrings=Object.keys(netScheme).filter(isString).filter(hasChanged);if(changedStrings.length==0)return this;// build a clone with pruned strings
var prunedCopy=new this.constructor(null,{id:null});var _arr=Object.keys(netScheme);for(var _i=0;_i<_arr.length;_i++){var p=_arr[_i];prunedCopy[p]=changedStrings.indexOf(p)<0?this[p]:null;}return prunedCopy;}},{key:"syncTo",value:function syncTo(other){var netScheme=this.constructor.netScheme;var _arr2=Object.keys(netScheme);for(var _i2=0;_i2<_arr2.length;_i2++){var p=_arr2[_i2];// ignore classes and lists
if(netScheme[p].type===BaseTypes.TYPES.LIST||netScheme[p].type===BaseTypes.TYPES.CLASSINSTANCE)continue;// strings might be pruned
if(netScheme[p].type===BaseTypes.TYPES.STRING){if(typeof other[p]==='string')this[p]=other[p];continue;}// all other values are copied
this[p]=other[p];}}}]);return Serializable;}();/**
   * A TwoVector is a geometric object which is completely described
   * by two values.
   */var TwoVector=/*#__PURE__*/function(_Serializable){_inherits(TwoVector,_Serializable);_createClass(TwoVector,null,[{key:"netScheme",get:function get(){return{x:{type:BaseTypes.TYPES.FLOAT32},y:{type:BaseTypes.TYPES.FLOAT32}};}/**
      * Creates an instance of a TwoVector.
      * @param {Number} x - first value
      * @param {Number} y - second value
      * @return {TwoVector} v - the new TwoVector
      */}]);function TwoVector(x,y){var _this;_classCallCheck(this,TwoVector);_this=_possibleConstructorReturn(this,_getPrototypeOf(TwoVector).call(this));_this.x=x;_this.y=y;return _possibleConstructorReturn(_this,_assertThisInitialized(_this));}/**
     * Formatted textual description of the TwoVector.
     * @return {String} description
     */_createClass(TwoVector,[{key:"toString",value:function toString(){function round3(x){return Math.round(x*1000)/1000;}return"[".concat(round3(this.x),", ").concat(round3(this.y),"]");}/**
       * Set TwoVector values
       *
       * @param {Number} x x-value
       * @param {Number} y y-value
       * @return {TwoVector} returns self
       */},{key:"set",value:function set(x,y){this.x=x;this.y=y;return this;}},{key:"multiply",value:function multiply(other){this.x*=other.x;this.y*=other.y;return this;}/**
       * Multiply this TwoVector by a scalar
       *
       * @param {Number} s the scale
       * @return {TwoVector} returns self
       */},{key:"multiplyScalar",value:function multiplyScalar(s){this.x*=s;this.y*=s;return this;}/**
       * Add other vector to this vector
       *
       * @param {TwoVector} other the other vector
       * @return {TwoVector} returns self
       */},{key:"add",value:function add(other){this.x+=other.x;this.y+=other.y;return this;}/**
       * Subtract other vector to this vector
       *
       * @param {TwoVector} other the other vector
       * @return {TwoVector} returns self
       */},{key:"subtract",value:function subtract(other){this.x-=other.x;this.y-=other.y;return this;}/**
       * Get vector length
       *
       * @return {Number} length of this vector
       */},{key:"length",value:function length(){return Math.sqrt(this.x*this.x+this.y*this.y);}/**
       * Normalize this vector, in-place
       *
       * @return {TwoVector} returns self
       */},{key:"normalize",value:function normalize(){this.multiplyScalar(1/this.length());return this;}/**
       * Copy values from another TwoVector into this TwoVector
       *
       * @param {TwoVector} sourceObj the other vector
       * @return {TwoVector} returns self
       */},{key:"copy",value:function copy(sourceObj){this.x=sourceObj.x;this.y=sourceObj.y;return this;}/**
       * Create a clone of this vector
       *
       * @return {TwoVector} returns clone
       */},{key:"clone",value:function clone(){return new TwoVector(this.x,this.y);}/**
       * Apply in-place lerp (linear interpolation) to this TwoVector
       * towards another TwoVector
       * @param {TwoVector} target the target vector
       * @param {Number} p The percentage to interpolate
       * @return {TwoVector} returns self
       */},{key:"lerp",value:function lerp(target,p){this.x+=(target.x-this.x)*p;this.y+=(target.y-this.y)*p;return this;}/**
       * Get bending Delta Vector
       * towards another TwoVector
       * @param {TwoVector} target the target vector
       * @param {Object} options bending options
       * @param {Number} options.increments number of increments
       * @param {Number} options.percent The percentage to bend
       * @param {Number} options.min No less than this value
       * @param {Number} options.max No more than this value
       * @return {TwoVector} returns new Incremental Vector
       */},{key:"getBendingDelta",value:function getBendingDelta(target,options){var increment=target.clone();increment.subtract(this);increment.multiplyScalar(options.percent);// check for max case
if(typeof options.max==='number'&&increment.length()>options.max||typeof options.min==='number'&&increment.length()<options.min){return new TwoVector(0,0);}// divide into increments
increment.multiplyScalar(1/options.increments);return increment;}}]);return TwoVector;}(Serializable);// Hierarchical Spatial Hash Grid: HSHG
// source: https://gist.github.com/kirbysayshi/1760774
// ---------------------------------------------------------------------
// GLOBAL FUNCTIONS
// ---------------------------------------------------------------------
/**
   * Updates every object's position in the grid, but only if
   * the hash value for that object has changed.
   * This method DOES NOT take into account object expansion or
   * contraction, just position, and does not attempt to change
   * the grid the object is currently in; it only (possibly) changes
   * the cell.
   *
   * If the object has significantly changed in size, the best bet is to
   * call removeObject() and addObject() sequentially, outside of the
   * normal update cycle of HSHG.
   *
   * @return  void   desc
   */function update_RECOMPUTE(){var i,obj,grid,meta,objAABB,newObjHash;// for each object
for(i=0;i<this._globalObjects.length;i++){obj=this._globalObjects[i];meta=obj.HSHG;grid=meta.grid;// recompute hash
objAABB=obj.getAABB();newObjHash=grid.toHash(objAABB.min[0],objAABB.min[1]);if(newObjHash!==meta.hash){// grid position has changed, update!
grid.removeObject(obj);grid.addObject(obj,newObjHash);}}}// not implemented yet :)
function update_REMOVEALL(){}function testAABBOverlap(objA,objB){var a=objA.getAABB(),b=objB.getAABB();// if(a.min[0] > b.max[0] || a.min[1] > b.max[1] || a.min[2] > b.max[2]
// || a.max[0] < b.min[0] || a.max[1] < b.min[1] || a.max[2] < b.min[2]){
if(a.min[0]>b.max[0]||a.min[1]>b.max[1]||a.max[0]<b.min[0]||a.max[1]<b.min[1]){return false;}return true;}function getLongestAABBEdge(min,max){return Math.max(Math.abs(max[0]-min[0]),Math.abs(max[1]-min[1])// ,Math.abs(max[2] - min[2])
);}// ---------------------------------------------------------------------
// ENTITIES
// ---------------------------------------------------------------------
function HSHG(){this.MAX_OBJECT_CELL_DENSITY=1/8;// objects / cells
this.INITIAL_GRID_LENGTH=256;// 16x16
this.HIERARCHY_FACTOR=2;this.HIERARCHY_FACTOR_SQRT=Math.SQRT2;this.UPDATE_METHOD=update_RECOMPUTE;// or update_REMOVEALL
this._grids=[];this._globalObjects=[];}// HSHG.prototype.init = function(){
//	this._grids = [];
//	this._globalObjects = [];
// }
HSHG.prototype.addObject=function(obj){var x,i,cellSize,objAABB=obj.getAABB(),objSize=getLongestAABBEdge(objAABB.min,objAABB.max),oneGrid,newGrid;// for HSHG metadata
obj.HSHG={globalObjectsIndex:this._globalObjects.length};// add to global object array
this._globalObjects.push(obj);if(this._grids.length==0){// no grids exist yet
cellSize=objSize*this.HIERARCHY_FACTOR_SQRT;newGrid=new Grid(cellSize,this.INITIAL_GRID_LENGTH,this);newGrid.initCells();newGrid.addObject(obj);this._grids.push(newGrid);}else{x=0;// grids are sorted by cellSize, smallest to largest
for(i=0;i<this._grids.length;i++){oneGrid=this._grids[i];x=oneGrid.cellSize;if(objSize<x){x/=this.HIERARCHY_FACTOR;if(objSize<x){// find appropriate size
while(objSize<x){x/=this.HIERARCHY_FACTOR;}newGrid=new Grid(x*this.HIERARCHY_FACTOR,this.INITIAL_GRID_LENGTH,this);newGrid.initCells();// assign obj to grid
newGrid.addObject(obj);// insert grid into list of grids directly before oneGrid
this._grids.splice(i,0,newGrid);}else{// insert obj into grid oneGrid
oneGrid.addObject(obj);}return;}}while(objSize>=x){x*=this.HIERARCHY_FACTOR;}newGrid=new Grid(x,this.INITIAL_GRID_LENGTH,this);newGrid.initCells();// insert obj into grid
newGrid.addObject(obj);// add newGrid as last element in grid list
this._grids.push(newGrid);}};HSHG.prototype.removeObject=function(obj){var meta=obj.HSHG,globalObjectsIndex,replacementObj;if(meta===undefined){throw Error(obj+' was not in the HSHG.');return;}// remove object from global object list
globalObjectsIndex=meta.globalObjectsIndex;if(globalObjectsIndex===this._globalObjects.length-1){this._globalObjects.pop();}else{replacementObj=this._globalObjects.pop();replacementObj.HSHG.globalObjectsIndex=globalObjectsIndex;this._globalObjects[globalObjectsIndex]=replacementObj;}meta.grid.removeObject(obj);// remove meta data
delete obj.HSHG;};HSHG.prototype.update=function(){this.UPDATE_METHOD.call(this);};HSHG.prototype.queryForCollisionPairs=function(broadOverlapTestCallback){var i,j,k,l,c,grid,cell,objA,objB,offset,adjacentCell,biggerGrid,objAAABB,objAHashInBiggerGrid,possibleCollisions=[];// default broad test to internal aabb overlap test
var broadOverlapTest=broadOverlapTestCallback||testAABBOverlap;// for all grids ordered by cell size ASC
for(i=0;i<this._grids.length;i++){grid=this._grids[i];// for each cell of the grid that is occupied
for(j=0;j<grid.occupiedCells.length;j++){cell=grid.occupiedCells[j];// collide all objects within the occupied cell
for(k=0;k<cell.objectContainer.length;k++){objA=cell.objectContainer[k];for(l=k+1;l<cell.objectContainer.length;l++){objB=cell.objectContainer[l];if(broadOverlapTest(objA,objB)===true){possibleCollisions.push([objA,objB]);}}}// for the first half of all adjacent cells (offset 4 is the current cell)
for(c=0;c<4;c++){offset=cell.neighborOffsetArray[c];// if(offset === null) { continue; }
adjacentCell=grid.allCells[cell.allCellsIndex+offset];// collide all objects in cell with adjacent cell
for(k=0;k<cell.objectContainer.length;k++){objA=cell.objectContainer[k];for(l=0;l<adjacentCell.objectContainer.length;l++){objB=adjacentCell.objectContainer[l];if(broadOverlapTest(objA,objB)===true){possibleCollisions.push([objA,objB]);}}}}}// forall objects that are stored in this grid
for(j=0;j<grid.allObjects.length;j++){objA=grid.allObjects[j];objAAABB=objA.getAABB();// for all grids with cellsize larger than grid
for(k=i+1;k<this._grids.length;k++){biggerGrid=this._grids[k];objAHashInBiggerGrid=biggerGrid.toHash(objAAABB.min[0],objAAABB.min[1]);cell=biggerGrid.allCells[objAHashInBiggerGrid];// check objA against every object in all cells in offset array of cell
// for all adjacent cells...
for(c=0;c<cell.neighborOffsetArray.length;c++){offset=cell.neighborOffsetArray[c];// if(offset === null) { continue; }
adjacentCell=biggerGrid.allCells[cell.allCellsIndex+offset];// for all objects in the adjacent cell...
for(l=0;l<adjacentCell.objectContainer.length;l++){objB=adjacentCell.objectContainer[l];// test against object A
if(broadOverlapTest(objA,objB)===true){possibleCollisions.push([objA,objB]);}}}}}}// return list of object pairs
return possibleCollisions;};HSHG.update_RECOMPUTE=update_RECOMPUTE;HSHG.update_REMOVEALL=update_REMOVEALL;/**
   * Grid
   *
   * @constructor
   * @param    int cellSize  the pixel size of each cell of the grid
   * @param    int cellCount  the total number of cells for the grid (width x height)
   * @param    HSHG parentHierarchy    the HSHG to which this grid belongs
   * @return  void
   */function Grid(cellSize,cellCount,parentHierarchy){this.cellSize=cellSize;this.inverseCellSize=1/cellSize;this.rowColumnCount=~~Math.sqrt(cellCount);this.xyHashMask=this.rowColumnCount-1;this.occupiedCells=[];this.allCells=Array(this.rowColumnCount*this.rowColumnCount);this.allObjects=[];this.sharedInnerOffsets=[];this._parentHierarchy=parentHierarchy||null;}Grid.prototype.initCells=function(){// TODO: inner/unique offset rows 0 and 2 may need to be
// swapped due to +y being "down" vs "up"
var i,gridLength=this.allCells.length,x,y,wh=this.rowColumnCount,isOnRightEdge,isOnLeftEdge,isOnTopEdge,isOnBottomEdge,innerOffsets=[// y+ down offsets
// -1 + -wh, -wh, -wh + 1,
// -1, 0, 1,
// wh - 1, wh, wh + 1
// y+ up offsets
wh-1,wh,wh+1,-1,0,1,-1+-wh,-wh,-wh+1],leftOffset,rightOffset,topOffset,bottomOffset,uniqueOffsets=[],cell;this.sharedInnerOffsets=innerOffsets;// init all cells, creating offset arrays as needed
for(i=0;i<gridLength;i++){cell=new Cell();// compute row (y) and column (x) for an index
y=~~(i/this.rowColumnCount);x=~~(i-y*this.rowColumnCount);// reset / init
isOnRightEdge=false;isOnLeftEdge=false;isOnTopEdge=false;isOnBottomEdge=false;// right or left edge cell
if((x+1)%this.rowColumnCount==0){isOnRightEdge=true;}else if(x%this.rowColumnCount==0){isOnLeftEdge=true;}// top or bottom edge cell
if((y+1)%this.rowColumnCount==0){isOnTopEdge=true;}else if(y%this.rowColumnCount==0){isOnBottomEdge=true;}// if cell is edge cell, use unique offsets, otherwise use inner offsets
if(isOnRightEdge||isOnLeftEdge||isOnTopEdge||isOnBottomEdge){// figure out cardinal offsets first
rightOffset=isOnRightEdge===true?-wh+1:1;leftOffset=isOnLeftEdge===true?wh-1:-1;topOffset=isOnTopEdge===true?-gridLength+wh:wh;bottomOffset=isOnBottomEdge===true?gridLength-wh:-wh;// diagonals are composites of the cardinals
uniqueOffsets=[// y+ down offset
// leftOffset + bottomOffset, bottomOffset, rightOffset + bottomOffset,
// leftOffset, 0, rightOffset,
// leftOffset + topOffset, topOffset, rightOffset + topOffset
// y+ up offset
leftOffset+topOffset,topOffset,rightOffset+topOffset,leftOffset,0,rightOffset,leftOffset+bottomOffset,bottomOffset,rightOffset+bottomOffset];cell.neighborOffsetArray=uniqueOffsets;}else{cell.neighborOffsetArray=this.sharedInnerOffsets;}cell.allCellsIndex=i;this.allCells[i]=cell;}};Grid.prototype.toHash=function(x,y,z){var i,xHash,yHash;if(x<0){i=-x*this.inverseCellSize;xHash=this.rowColumnCount-1-(~~i&this.xyHashMask);}else{i=x*this.inverseCellSize;xHash=~~i&this.xyHashMask;}if(y<0){i=-y*this.inverseCellSize;yHash=this.rowColumnCount-1-(~~i&this.xyHashMask);}else{i=y*this.inverseCellSize;yHash=~~i&this.xyHashMask;}// if(z < 0){
//	i = (-z) * this.inverseCellSize;
//	zHash = this.rowColumnCount - 1 - ( ~~i & this.xyHashMask );
// } else {
//	i = z * this.inverseCellSize;
//	zHash = ~~i & this.xyHashMask;
// }
return xHash+yHash*this.rowColumnCount;// + zHash * this.rowColumnCount * this.rowColumnCount;
};Grid.prototype.addObject=function(obj,hash){var objAABB,objHash,targetCell;// technically, passing this in this should save some computational effort when updating objects
if(hash!==undefined){objHash=hash;}else{objAABB=obj.getAABB();objHash=this.toHash(objAABB.min[0],objAABB.min[1]);}targetCell=this.allCells[objHash];if(targetCell.objectContainer.length===0){// insert this cell into occupied cells list
targetCell.occupiedCellsIndex=this.occupiedCells.length;this.occupiedCells.push(targetCell);}// add meta data to obj, for fast update/removal
obj.HSHG.objectContainerIndex=targetCell.objectContainer.length;obj.HSHG.hash=objHash;obj.HSHG.grid=this;obj.HSHG.allGridObjectsIndex=this.allObjects.length;// add obj to cell
targetCell.objectContainer.push(obj);// we can assume that the targetCell is already a member of the occupied list
// add to grid-global object list
this.allObjects.push(obj);// do test for grid density
if(this.allObjects.length/this.allCells.length>this._parentHierarchy.MAX_OBJECT_CELL_DENSITY){// grid must be increased in size
this.expandGrid();}};Grid.prototype.removeObject=function(obj){var meta=obj.HSHG,hash,containerIndex,allGridObjectsIndex,cell,replacementCell,replacementObj;hash=meta.hash;containerIndex=meta.objectContainerIndex;allGridObjectsIndex=meta.allGridObjectsIndex;cell=this.allCells[hash];// remove object from cell object container
if(cell.objectContainer.length===1){// this is the last object in the cell, so reset it
cell.objectContainer.length=0;// remove cell from occupied list
if(cell.occupiedCellsIndex===this.occupiedCells.length-1){// special case if the cell is the newest in the list
this.occupiedCells.pop();}else{replacementCell=this.occupiedCells.pop();replacementCell.occupiedCellsIndex=cell.occupiedCellsIndex;this.occupiedCells[cell.occupiedCellsIndex]=replacementCell;}cell.occupiedCellsIndex=null;}else{// there is more than one object in the container
if(containerIndex===cell.objectContainer.length-1){// special case if the obj is the newest in the container
cell.objectContainer.pop();}else{replacementObj=cell.objectContainer.pop();replacementObj.HSHG.objectContainerIndex=containerIndex;cell.objectContainer[containerIndex]=replacementObj;}}// remove object from grid object list
if(allGridObjectsIndex===this.allObjects.length-1){this.allObjects.pop();}else{replacementObj=this.allObjects.pop();replacementObj.HSHG.allGridObjectsIndex=allGridObjectsIndex;this.allObjects[allGridObjectsIndex]=replacementObj;}};Grid.prototype.expandGrid=function(){var i,currentCellCount=this.allCells.length,currentRowColumnCount=this.rowColumnCount,currentXYHashMask=this.xyHashMask,newCellCount=currentCellCount*4,// double each dimension
newRowColumnCount=~~Math.sqrt(newCellCount),newXYHashMask=newRowColumnCount-1,allObjects=this.allObjects.slice(0);// remove all objects
for(i=0;i<allObjects.length;i++){this.removeObject(allObjects[i]);}// reset grid values, set new grid to be 4x larger than last
this.rowColumnCount=newRowColumnCount;this.allCells=Array(this.rowColumnCount*this.rowColumnCount);this.xyHashMask=newXYHashMask;// initialize new cells
this.initCells();// re-add all objects to grid
for(i=0;i<allObjects.length;i++){this.addObject(allObjects[i]);}};/**
   * A cell of the grid
   *
   * @constructor
   * @return  void   desc
   */function Cell(){this.objectContainer=[];this.neighborOffsetArray;this.occupiedCellsIndex=null;this.allCellsIndex=null;}// ---------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------
HSHG._private={Grid:Grid,Cell:Cell,testAABBOverlap:testAABBOverlap,getLongestAABBEdge:getLongestAABBEdge};// uses this implementation https://gist.github.com/kirbysayshi/1760774
var HSHGCollisionDetection=/*#__PURE__*/function(){function HSHGCollisionDetection(options){_classCallCheck(this,HSHGCollisionDetection);this.options=Object.assign({COLLISION_DISTANCE:28},options);}_createClass(HSHGCollisionDetection,[{key:"init",value:function init(options){var _this=this;this.gameEngine=options.gameEngine;this.grid=new HSHG();this.previousCollisionPairs={};this.stepCollidingPairs={};this.gameEngine.on('objectAdded',function(obj){// add the gameEngine obj the the spatial grid
_this.grid.addObject(obj);});this.gameEngine.on('objectDestroyed',function(obj){// add the gameEngine obj the the spatial grid
_this.grid.removeObject(obj);});}},{key:"detect",value:function detect(){this.grid.update();this.stepCollidingPairs=this.grid.queryForCollisionPairs().reduce(function(accumulator,currentValue,i){var pairId=getArrayPairId(currentValue);accumulator[pairId]={o1:currentValue[0],o2:currentValue[1]};return accumulator;},{});var _arr=Object.keys(this.previousCollisionPairs);for(var _i=0;_i<_arr.length;_i++){var pairId=_arr[_i];var pairObj=this.previousCollisionPairs[pairId];// existed in previous pairs, but not during this step: this pair stopped colliding
if(pairId in this.stepCollidingPairs===false){this.gameEngine.emit('collisionStop',pairObj);}}var _arr2=Object.keys(this.stepCollidingPairs);for(var _i2=0;_i2<_arr2.length;_i2++){var _pairId=_arr2[_i2];var _pairObj=this.stepCollidingPairs[_pairId];// didn't exist in previous pairs, but exists now: this is a new colliding pair
if(_pairId in this.previousCollisionPairs===false){this.gameEngine.emit('collisionStart',_pairObj);}}this.previousCollisionPairs=this.stepCollidingPairs;}/**
       * checks wheter two objects are currently colliding
       * @param {Object} o1 first object
       * @param {Object} o2 second object
       * @return {boolean} are the two objects colliding?
       */},{key:"areObjectsColliding",value:function areObjectsColliding(o1,o2){return getArrayPairId([o1,o2])in this.stepCollidingPairs;}}]);return HSHGCollisionDetection;}();function getArrayPairId(arrayPair){// make sure to get the same id regardless of object order
var sortedArrayPair=arrayPair.slice(0).sort();return sortedArrayPair[0].id+'-'+sortedArrayPair[1].id;}var differenceVector=new TwoVector();// The collision detection of SimplePhysicsEngine is a brute-force approach
var BruteForceCollisionDetection=/*#__PURE__*/function(){function BruteForceCollisionDetection(options){_classCallCheck(this,BruteForceCollisionDetection);this.options=Object.assign({autoResolve:true},options);this.collisionPairs={};}_createClass(BruteForceCollisionDetection,[{key:"init",value:function init(options){this.gameEngine=options.gameEngine;}},{key:"findCollision",value:function findCollision(o1,o2){// static objects don't collide
if(o1.isStatic&&o2.isStatic)return false;// allow a collision checker function
if(typeof o1.collidesWith==='function'){if(!o1.collidesWith(o2))return false;}// radius-based collision
if(this.options.collisionDistance){differenceVector.copy(o1.position).subtract(o2.position);return differenceVector.length()<this.options.collisionDistance;}// check for no-collision first
var o1Box=getBox(o1);var o2Box=getBox(o2);if(o1Box.xMin>o2Box.xMax||o1Box.yMin>o2Box.yMax||o2Box.xMin>o1Box.xMax||o2Box.yMin>o1Box.yMax)return false;if(!this.options.autoResolve)return true;// need to auto-resolve
var shiftY1=o2Box.yMax-o1Box.yMin;var shiftY2=o1Box.yMax-o2Box.yMin;var shiftX1=o2Box.xMax-o1Box.xMin;var shiftX2=o1Box.xMax-o2Box.xMin;var smallestYShift=Math.min(Math.abs(shiftY1),Math.abs(shiftY2));var smallestXShift=Math.min(Math.abs(shiftX1),Math.abs(shiftX2));// choose to apply the smallest shift which solves the collision
if(smallestYShift<smallestXShift){if(o1Box.yMin>o2Box.yMin&&o1Box.yMin<o2Box.yMax){if(o2.isStatic)o1.position.y+=shiftY1;else if(o1.isStatic)o2.position.y-=shiftY1;else{o1.position.y+=shiftY1/2;o2.position.y-=shiftY1/2;}}else if(o1Box.yMax>o2Box.yMin&&o1Box.yMax<o2Box.yMax){if(o2.isStatic)o1.position.y-=shiftY2;else if(o1.isStatic)o2.position.y+=shiftY2;else{o1.position.y-=shiftY2/2;o2.position.y+=shiftY2/2;}}o1.velocity.y=0;o2.velocity.y=0;}else{if(o1Box.xMin>o2Box.xMin&&o1Box.xMin<o2Box.xMax){if(o2.isStatic)o1.position.x+=shiftX1;else if(o1.isStatic)o2.position.x-=shiftX1;else{o1.position.x+=shiftX1/2;o2.position.x-=shiftX1/2;}}else if(o1Box.xMax>o2Box.xMin&&o1Box.xMax<o2Box.xMax){if(o2.isStatic)o1.position.x-=shiftX2;else if(o1.isStatic)o2.position.x+=shiftX2;else{o1.position.x-=shiftX2/2;o2.position.x+=shiftX2/2;}}o1.velocity.x=0;o2.velocity.x=0;}return true;}// check if pair (id1, id2) have collided
},{key:"checkPair",value:function checkPair(id1,id2){var objects=this.gameEngine.world.objects;var o1=objects[id1];var o2=objects[id2];// make sure that objects actually exist. might have been destroyed
if(!o1||!o2)return;var pairId=[id1,id2].join(',');if(this.findCollision(o1,o2)){if(!(pairId in this.collisionPairs)){this.collisionPairs[pairId]=true;this.gameEngine.emit('collisionStart',{o1:o1,o2:o2});}}else if(pairId in this.collisionPairs){this.gameEngine.emit('collisionStop',{o1:o1,o2:o2});delete this.collisionPairs[pairId];}}// detect by checking all pairs
},{key:"detect",value:function detect(){var objects=this.gameEngine.world.objects;var keys=Object.keys(objects);// delete non existant object pairs
for(var pairId in this.collisionPairs){if(this.collisionPairs.hasOwnProperty(pairId))if(keys.indexOf(pairId.split(',')[0])===-1||keys.indexOf(pairId.split(',')[1])===-1)delete this.collisionPairs[pairId];}// check all pairs
for(var _i=0;_i<keys.length;_i++){var k1=keys[_i];for(var _i2=0;_i2<keys.length;_i2++){var k2=keys[_i2];if(k2>k1)this.checkPair(k1,k2);}}}}]);return BruteForceCollisionDetection;}();// get bounding box of object o
function getBox(o){return{xMin:o.position.x,xMax:o.position.x+o.width,yMin:o.position.y,yMax:o.position.y+o.height};}var dv=new TwoVector();var dx=new TwoVector();/**
   * SimplePhysicsEngine is a pseudo-physics engine which works with
   * objects of class DynamicObject.
   * The Simple Physics Engine is a "fake" physics engine, which is more
   * appropriate for arcade games, and it is sometimes referred to as "arcade"
   * physics. For example if a character is standing at the edge of a platform,
   * with only one foot on the platform, it won't fall over. This is a desired
   * game behaviour in platformer games.
   */var SimplePhysicsEngine=/*#__PURE__*/function(_PhysicsEngine){_inherits(SimplePhysicsEngine,_PhysicsEngine);/**
    * Creates an instance of the Simple Physics Engine.
    * @param {Object} options - physics options
    * @param {Object} options.collisions - collision options
    * @param {String} options.collisions.type - can be set to "HSHG" or "bruteForce".  Default is Brute-Force collision detection.
    * @param {Number} options.collisions.collisionDistance - for brute force, this can be set for a simple distance-based (radius) collision detection.
    * @param {Boolean} options.collisions.autoResolve - for brute force collision, colliding objects should be moved apart
    * @param {TwoVector} options.gravity - TwoVector instance which describes gravity, which will be added to the velocity of all objects at every step.  For example TwoVector(0, -0.01)
    */function SimplePhysicsEngine(options){var _this;_classCallCheck(this,SimplePhysicsEngine);_this=_possibleConstructorReturn(this,_getPrototypeOf(SimplePhysicsEngine).call(this,options));// todo does this mean both modules always get loaded?
if(options.collisions&&options.collisions.type==='HSHG'){_this.collisionDetection=new HSHGCollisionDetection(options.collisions);}else{_this.collisionDetection=new BruteForceCollisionDetection(options.collisions);}/**
       * The actor's name.
       * @memberof SimplePhysicsEngine
       * @member {TwoVector} gravity affecting all objects
       */_this.gravity=new TwoVector(0,0);if(options.gravity)_this.gravity.copy(options.gravity);var collisionOptions=Object.assign({gameEngine:_this.gameEngine},options.collisionOptions);_this.collisionDetection.init(collisionOptions);return _this;}// a single object advances, based on:
// isRotatingRight, isRotatingLeft, isAccelerating, current velocity
// wrap-around the world if necessary
_createClass(SimplePhysicsEngine,[{key:"objectStep",value:function objectStep(o,dt){// calculate factor
if(dt===0)return;if(dt)dt/=1/60;else dt=1;// TODO: worldsettings is a hack.  Find all places which use it in all games
// and come up with a better solution.  for example an option sent to the physics Engine
// with a "worldWrap:true" options
// replace with a "worldBounds" parameter to the PhysicsEngine constructor
var worldSettings=this.gameEngine.worldSettings;// TODO: remove this code in version 4: these attributes are deprecated
if(o.isRotatingRight){o.angle+=o.rotationSpeed;}if(o.isRotatingLeft){o.angle-=o.rotationSpeed;}// TODO: remove this code in version 4: these attributes are deprecated
if(o.angle>=360){o.angle-=360;}if(o.angle<0){o.angle+=360;}// TODO: remove this code in version 4: these attributes are deprecated
if(o.isAccelerating){var rad=o.angle*(Math.PI/180);dv.set(Math.cos(rad),Math.sin(rad)).multiplyScalar(o.acceleration).multiplyScalar(dt);o.velocity.add(dv);}// apply gravity
if(!o.isStatic)o.velocity.add(this.gravity);var velMagnitude=o.velocity.length();if(o.maxSpeed!==null&&velMagnitude>o.maxSpeed){o.velocity.multiplyScalar(o.maxSpeed/velMagnitude);}o.isAccelerating=false;o.isRotatingLeft=false;o.isRotatingRight=false;dx.copy(o.velocity).multiplyScalar(dt);o.position.add(dx);o.velocity.multiply(o.friction);// wrap around the world edges
if(worldSettings.worldWrap){if(o.position.x>=worldSettings.width){o.position.x-=worldSettings.width;}if(o.position.y>=worldSettings.height){o.position.y-=worldSettings.height;}if(o.position.x<0){o.position.x+=worldSettings.width;}if(o.position.y<0){o.position.y+=worldSettings.height;}}}// entry point for a single step of the Simple Physics
},{key:"step",value:function step(dt,objectFilter){// each object should advance
var objects=this.gameEngine.world.objects;var _arr=Object.keys(objects);for(var _i=0;_i<_arr.length;_i++){var objId=_arr[_i];// shadow objects are not re-enacted
var ob=objects[objId];if(!objectFilter(ob))continue;// run the object step
this.objectStep(ob,dt);}// emit event on collision
this.collisionDetection.detect(this.gameEngine);}}]);return SimplePhysicsEngine;}(PhysicsEngine);/**
   * GameObject is the base class of all game objects.
   * It is created only for the purpose of clearly defining the game
   * object interface.
   * Game developers will use one of the subclasses such as DynamicObject,
   * or PhysicalObject.
   */var GameObject=/*#__PURE__*/function(_Serializable){_inherits(GameObject,_Serializable);_createClass(GameObject,null,[{key:"netScheme",get:function get(){return{id:{type:BaseTypes.TYPES.INT32}};}/**
      * Creates an instance of a game object.
      * @param {GameEngine} gameEngine - the gameEngine this object will be used in
      * @param {Object} options - options for instantiation of the GameObject
      * @param {Number} id - if set, the new instantiated object will be set to this id instead of being generated a new one. Use with caution!
      */}]);function GameObject(gameEngine,options){var _this;_classCallCheck(this,GameObject);_this=_possibleConstructorReturn(this,_getPrototypeOf(GameObject).call(this));/**
       * The gameEngine this object will be used in
       * @member {GameEngine}
       */_this.gameEngine=gameEngine;/**
      * ID of this object's instance.
      * There are three cases of instance creation which can occur:
      * 1. In the normal case, the constructor is asked to assign an ID which is unique
      * across the entire game world, including the server and all the clients.
      * 2. In extrapolation mode, the client may have an object instance which does not
      * yet exist on the server, these objects are known as shadow objects.  Their IDs must
      * be allocated from a different range.
      * 3. Also, temporary objects are created on the client side each time a sync is received.
      * These are used for interpolation purposes and as bending targets of position, velocity,
      * angular velocity, and orientation.  In this case the id will be set to null.
      * @member {Number}
      */_this.id=null;if(options&&'id'in options)_this.id=options.id;else if(_this.gameEngine)_this.id=_this.gameEngine.world.getNewId();_this.components={};return _this;}/**
     * Called after the object is added to to the game world.
     * This is the right place to add renderer sub-objects, physics sub-objects
     * and any other resources that should be created
     * @param {GameEngine} gameEngine the game engine
     */_createClass(GameObject,[{key:"onAddToWorld",value:function onAddToWorld(gameEngine){}/**
       * Called after the object is removed from game-world.
       * This is where renderer sub-objects and any other resources should be freed
       * @param {GameEngine} gameEngine the game engine
       */},{key:"onRemoveFromWorld",value:function onRemoveFromWorld(gameEngine){}/**
       * Formatted textual description of the game object.
       * @return {String} description - a string description
       */},{key:"toString",value:function toString(){return"game-object[".concat(this.id,"]");}/**
       * Formatted textual description of the game object's current bending properties.
       * @return {String} description - a string description
       */},{key:"bendingToString",value:function bendingToString(){return'no bending';}},{key:"saveState",value:function saveState(other){this.savedCopy=new this.constructor(this.gameEngine,{id:null});this.savedCopy.syncTo(other?other:this);}/**
       * Bending is defined as the amount of error correction that will be applied
       * on the client side to a given object's physical attributes, incrementally,
       * by the time the next server broadcast is expected to arrive.
       *
       * When this percentage is 0.0, the client always ignores the server object's value.
       * When this percentage is 1.0, the server object's attributes will be applied in full.
       *
       * The GameObject bending attribute is implemented as a getter, and can provide
       * distinct values for position, velocity, angle, and angularVelocity.
       * And in each case, you can also provide overrides for local objects,
       * these attributes will be called, respectively, positionLocal, velocityLocal,
       * angleLocal, angularVelocityLocal.
       *
       * @example
       * get bending() {
       *   return {
       *     position: { percent: 1.0, min: 0.0 },
       *     velocity: { percent: 0.0, min: 0.0 },
       *     angularVelocity: { percent: 0.0 },
       *     angleLocal: { percent: 1.0 }
       *   }
       * };
       *
       * @memberof GameObject
       * @member {Object} bending
       */},{key:"bendToCurrentState",// TODO:
// rather than pass worldSettings on each bend, they could
// be passed in on the constructor just once.
value:function bendToCurrentState(bending,worldSettings,isLocal,bendingIncrements){if(this.savedCopy){this.bendToCurrent(this.savedCopy,bending,worldSettings,isLocal,bendingIncrements);}this.savedCopy=null;}},{key:"bendToCurrent",value:function bendToCurrent(original,bending,worldSettings,isLocal,bendingIncrements){}/**
       * synchronize this object to the state of an other object, by copying all the netscheme variables.
       * This is used by the synchronizer to create temporary objects, and must be implemented by all sub-classes as well.
       * @param {GameObject} other the other object to synchronize to
       */},{key:"syncTo",value:function syncTo(other){_get(_getPrototypeOf(GameObject.prototype),"syncTo",this).call(this,other);}// copy physical attributes to physics sub-object
},{key:"refreshToPhysics",value:function refreshToPhysics(){}// copy physical attributes from physics sub-object
},{key:"refreshFromPhysics",value:function refreshFromPhysics(){}// apply a single bending increment
},{key:"applyIncrementalBending",value:function applyIncrementalBending(){}// clean up resources
},{key:"destroy",value:function destroy(){}},{key:"addComponent",value:function addComponent(componentInstance){componentInstance.parentObject=this;this.components[componentInstance.constructor.name]=componentInstance;// a gameEngine might not exist if this class is instantiated by the serializer
if(this.gameEngine){this.gameEngine.emit('componentAdded',this,componentInstance);}}},{key:"removeComponent",value:function removeComponent(componentName){// todo cleanup of the component ?
delete this.components[componentName];// a gameEngine might not exist if this class is instantiated by the serializer
if(this.gameEngine){this.gameEngine.emit('componentRemoved',this,componentName);}}/**
       * Check whether this game object has a certain component
       * @param {Object} componentClass the comp
       * @return {Boolean} true if the gameObject contains this component
       */},{key:"hasComponent",value:function hasComponent(componentClass){return componentClass.name in this.components;}},{key:"getComponent",value:function getComponent(componentClass){return this.components[componentClass.name];}},{key:"bending",get:function get(){return{position:{percent:1.0,min:0.0},velocity:{percent:0.0,min:0.0},angularVelocity:{percent:0.0},angleLocal:{percent:1.0}};}}]);return GameObject;}(Serializable);var MathUtils=/*#__PURE__*/function(){function MathUtils(){_classCallCheck(this,MathUtils);}_createClass(MathUtils,null,[{key:"interpolate",// interpolate from start to end, advancing "percent" of the way
value:function interpolate(start,end,percent){return(end-start)*percent+start;}// interpolate from start to end, advancing "percent" of the way
//
// returns just the delta. i.e. the value that must be added to the start value
},{key:"interpolateDelta",value:function interpolateDelta(start,end,percent){return(end-start)*percent;}// interpolate from start to end, advancing "percent" of the way
// and noting that the dimension wraps around {x >= wrapMin, x < wrapMax}
//
// returns just the delta. i.e. the value that must be added to the start value
},{key:"interpolateDeltaWithWrapping",value:function interpolateDeltaWithWrapping(start,end,percent,wrapMin,wrapMax){var wrapTest=wrapMax-wrapMin;if(start-end>wrapTest/2)end+=wrapTest;else if(end-start>wrapTest/2)start+=wrapTest;if(Math.abs(start-end)>wrapTest/3){console.log('wrap interpolation is close to limit.  Not sure which edge to wrap to.');}return(end-start)*percent;}},{key:"interpolateWithWrapping",value:function interpolateWithWrapping(start,end,percent,wrapMin,wrapMax){var interpolatedVal=start+this.interpolateDeltaWithWrapping(start,end,percent,wrapMin,wrapMax);var wrapLength=wrapMax-wrapMin;if(interpolatedVal>=wrapLength)interpolatedVal-=wrapLength;if(interpolatedVal<0)interpolatedVal+=wrapLength;return interpolatedVal;}}]);return MathUtils;}();/**
   * DynamicObject is the base class of the game's objects, for games which
   * rely on SimplePhysicsEngine.  It defines the
   * base object which can move around in the game world.  The
   * extensions of this object (the subclasses)
   * will be periodically synchronized from the server to every client.
   *
   * The dynamic objects have pseudo-physical properties, which
   * allow the client to extrapolate the position
   * of dynamic objects in-between server updates.
   */var DynamicObject=/*#__PURE__*/function(_GameObject){_inherits(DynamicObject,_GameObject);_createClass(DynamicObject,null,[{key:"netScheme",/**
      * The netScheme is a dictionary of attributes in this game
      * object.  The attributes listed in the netScheme are those exact
      * attributes which will be serialized and sent from the server
      * to each client on every server update.
      * The netScheme member is implemented as a getter.
      *
      * You may choose not to implement this method, in which
      * case your object only transmits the default attributes
      * which are already part of {@link DynamicObject}.
      * But if you choose to add more attributes, make sure
      * the return value includes the netScheme of the super class.
      *
      * @memberof DynamicObject
      * @member {Object} netScheme
      * @example
      *     static get netScheme() {
      *       return Object.assign({
      *           mojo: { type: BaseTypes.TYPES.UINT8 },
      *         }, super.netScheme);
      *     }
      */get:function get(){return Object.assign({playerId:{type:BaseTypes.TYPES.INT16},position:{type:BaseTypes.TYPES.CLASSINSTANCE},width:{type:BaseTypes.TYPES.INT16},height:{type:BaseTypes.TYPES.INT16},isStatic:{type:BaseTypes.TYPES.UINT8},velocity:{type:BaseTypes.TYPES.CLASSINSTANCE},angle:{type:BaseTypes.TYPES.FLOAT32}},_get(_getPrototypeOf(DynamicObject),"netScheme",this));}/**
      * Creates an instance of a dynamic object.
      * NOTE: all subclasses of this class must comply with this constructor signature.
      *       This is required because the engine will create temporary instances when
      *       syncs arrive on the clients.
      * @param {GameEngine} gameEngine - the gameEngine this object will be used in
      * @param {Object} options - options for the new object. See {@link GameObject}
      * @param {Object} props - properties to be set in the new object
      * @param {TwoVector} props.position - position vector
      * @param {TwoVector} props.velocity - velocity vector
      * @param {Number} props.height - object height
      * @param {Number} props.width - object width
      */}]);function DynamicObject(gameEngine,options,props){var _this;_classCallCheck(this,DynamicObject);_this=_possibleConstructorReturn(this,_getPrototypeOf(DynamicObject).call(this,gameEngine,options));/**
      * ID of player who created this object
      * @member {Number}
      */_this.playerId=props&&props.playerId?props.playerId:0;_this.bendingIncrements=0;_this.position=new TwoVector(0,0);_this.velocity=new TwoVector(0,0);/**
       * Object width for collision detection purposes. Default is 1
       * @member {Number}
       */_this.width=props&&props.width?props.width:1;/**
       * Object height for collision detection purposes. Default is 1
       * @member {Number}
       */_this.height=props&&props.height?props.height:1;/**
       * Determine if the object is static (i.e. it never moves, like a wall). The value 0 implies the object is dynamic.  Default is 0 (dynamic).
       * @member {Number}
       */_this.isStatic=props&&props.isStatic?props.isStatic:0;/**
       * The friction coefficient. Velocity is multiplied by this for each step. Default is (1,1)
       * @member {TwoVector}
       */_this.friction=new TwoVector(1,1);/**
      * playerId
      * @member {Number}
      */if(props&&props.playerId)_this.playerId=props.playerId;/**
      * position
      * @member {TwoVector}
      */if(props&&props.position)_this.position.copy(props.position);/**
      * velocity
      * @member {TwoVector}
      */if(props&&props.velocity)_this.velocity.copy(props.velocity);/**
      * object orientation angle in degrees
      * @member {Number}
      */_this.angle=90;/**
      * @deprecated since version 3.0.8
      * should rotate left by {@link DynamicObject#rotationSpeed} on next step
      * @member {Boolean}
      */_this.isRotatingLeft=false;/**
      * @deprecated since version 3.0.8
      * should rotate right by {@link DynamicObject#rotationSpeed} on next step
      * @member {Boolean}
      */_this.isRotatingRight=false;/**
      * @deprecated since version 3.0.8
      * should accelerate by {@link DynamicObject#acceleration} on next step
      * @member {Boolean}
      */_this.isAccelerating=false;/**
      * @deprecated since version 3.0.8
      * angle rotation per step
      * @member {Number}
      */_this.rotationSpeed=2.5;/**
      * @deprecated since version 3.0.8
      * acceleration per step
      * @member {Number}
      */_this.acceleration=0.1;_this.deceleration=0.99;return _this;}// convenience getters
_createClass(DynamicObject,[{key:"toString",/**
       * Formatted textual description of the dynamic object.
       * The output of this method is used to describe each instance in the traces,
       * which significantly helps in debugging.
       *
       * @return {String} description - a string describing the DynamicObject
       */value:function toString(){function round3(x){return Math.round(x*1000)/1000;}return"".concat(this.constructor.name,"[").concat(this.id,"] player").concat(this.playerId," Pos=").concat(this.position," Vel=").concat(this.velocity," angle").concat(round3(this.angle));}/**
       * Each object class can define its own bending overrides.
       * return an object which can include attributes: position, velocity,
       * and angle.  In each case, you can specify a min value, max
       * value, and a percent value.
       *
       * @return {Object} bending - an object with bending paramters
       */},{key:"turnRight",/**
      * turn object clock-wise
      * @param {Number} deltaAngle - the angle to turn, in degrees
      * @return {DynamicObject} return this object
      */value:function turnRight(deltaAngle){this.angle+=deltaAngle;if(this.angle>=360){this.angle-=360;}if(this.angle<0){this.angle+=360;}return this;}/**
      * turn object counter-clock-wise
      * @param {Number} deltaAngle - the angle to turn, in degrees
      * @return {DynamicObject} return this object
      */},{key:"turnLeft",value:function turnLeft(deltaAngle){return this.turnRight(-deltaAngle);}/**
      * accelerate along the direction that the object is facing
      * @param {Number} acceleration - the acceleration
      * @return {DynamicObject} return this object
      */},{key:"accelerate",value:function accelerate(acceleration){var rad=this.angle*(Math.PI/180);var dv=new TwoVector(Math.cos(rad),Math.sin(rad));dv.multiplyScalar(acceleration);this.velocity.add(dv);return this;}/**
       * Formatted textual description of the game object's current bending properties.
       * @return {String} description - a string description
       */},{key:"bendingToString",value:function bendingToString(){if(this.bendingIncrements)return"\u0394Pos=".concat(this.bendingPositionDelta," \u0394Vel=").concat(this.bendingVelocityDelta," \u0394Angle=").concat(this.bendingAngleDelta," increments=").concat(this.bendingIncrements);return'no bending';}/**
      * The maximum velocity allowed.  If returns null then ignored.
      * @memberof DynamicObject
      * @member {Number} maxSpeed
      */},{key:"syncTo",/**
      * Copy the netscheme variables from another DynamicObject
      * This is used by the synchronizer to create temporary objects, and must be implemented by all sub-classes as well.
      * @param {DynamicObject} other DynamicObject
      */value:function syncTo(other){_get(_getPrototypeOf(DynamicObject.prototype),"syncTo",this).call(this,other);this.position.copy(other.position);this.velocity.copy(other.velocity);this.width=other.width;this.height=other.height;this.bendingAngle=other.bendingAngle;this.rotationSpeed=other.rotationSpeed;this.acceleration=other.acceleration;this.deceleration=other.deceleration;}},{key:"bendToCurrent",value:function bendToCurrent(original,percent,worldSettings,isLocal,increments){var bending={increments:increments,percent:percent};// if the object has defined a bending multiples for this object, use them
var positionBending=Object.assign({},bending,this.bending.position);var velocityBending=Object.assign({},bending,this.bending.velocity);var angleBending=Object.assign({},bending,this.bending.angle);if(isLocal){Object.assign(positionBending,this.bending.positionLocal);Object.assign(velocityBending,this.bending.velocityLocal);Object.assign(angleBending,this.bending.angleLocal);}// get the incremental delta position & velocity
this.incrementScale=percent/increments;this.bendingPositionDelta=original.position.getBendingDelta(this.position,positionBending);this.bendingVelocityDelta=original.velocity.getBendingDelta(this.velocity,velocityBending);this.bendingAngleDelta=MathUtils.interpolateDeltaWithWrapping(original.angle,this.angle,angleBending.percent,0,360)/increments;this.bendingTarget=new this.constructor();this.bendingTarget.syncTo(this);// revert to original
this.position.copy(original.position);this.velocity.copy(original.velocity);this.angle=original.angle;// keep parameters
this.bendingIncrements=increments;this.bendingOptions=bending;}},{key:"applyIncrementalBending",value:function applyIncrementalBending(stepDesc){if(this.bendingIncrements===0)return;var timeFactor=1;if(stepDesc&&stepDesc.dt)timeFactor=stepDesc.dt/(1000/60);var posDelta=this.bendingPositionDelta.clone().multiplyScalar(timeFactor);var velDelta=this.bendingVelocityDelta.clone().multiplyScalar(timeFactor);this.position.add(posDelta);this.velocity.add(velDelta);this.angle+=this.bendingAngleDelta*timeFactor;this.bendingIncrements--;}},{key:"getAABB",value:function getAABB(){// todo take rotation into account
// registration point is in the middle
return{min:[this.x-this.width/2,this.y-this.height/2],max:[this.x+this.width/2,this.y+this.height/2]};}/**
      * Determine if this object will collide with another object.
      * Only applicable on "bruteForce" physics engine.
      * @param {DynamicObject} other DynamicObject
      * @return {Boolean} true if the two objects collide
      */},{key:"collidesWith",value:function collidesWith(other){return true;}},{key:"x",get:function get(){return this.position.x;}},{key:"y",get:function get(){return this.position.y;}},{key:"bending",get:function get(){return{// example:
// position: { percent: 0.8, min: 0.0, max: 4.0 },
// velocity: { percent: 0.4, min: 0.0 },
// angleLocal: { percent: 0.0 }
};}},{key:"maxSpeed",get:function get(){return null;}}]);return DynamicObject;}(GameObject);/**
   * The PhysicalObject2D is the base class for physical game objects in 2D Physics
   */var PhysicalObject2D=/*#__PURE__*/function(_GameObject){_inherits(PhysicalObject2D,_GameObject);_createClass(PhysicalObject2D,null,[{key:"netScheme",/**
      * The netScheme is a dictionary of attributes in this game
      * object.  The attributes listed in the netScheme are those exact
      * attributes which will be serialized and sent from the server
      * to each client on every server update.
      * The netScheme member is implemented as a getter.
      *
      * You may choose not to implement this method, in which
      * case your object only transmits the default attributes
      * which are already part of {@link PhysicalObject2D}.
      * But if you choose to add more attributes, make sure
      * the return value includes the netScheme of the super class.
      *
      * @memberof PhysicalObject2D
      * @member {Object} netScheme
      * @example
      *     static get netScheme() {
      *       return Object.assign({
      *           mojo: { type: BaseTypes.TYPES.UINT8 },
      *         }, super.netScheme);
      *     }
      */get:function get(){return Object.assign({playerId:{type:BaseTypes.TYPES.INT16},mass:{type:BaseTypes.TYPES.FLOAT32},position:{type:BaseTypes.TYPES.CLASSINSTANCE},angle:{type:BaseTypes.TYPES.FLOAT32},velocity:{type:BaseTypes.TYPES.CLASSINSTANCE},angularVelocity:{type:BaseTypes.TYPES.FLOAT32}},_get(_getPrototypeOf(PhysicalObject2D),"netScheme",this));}/**
      * Creates an instance of a physical object.
      * Override to provide starting values for position, velocity, angle and angular velocity.
      * NOTE: all subclasses of this class must comply with this constructor signature.
      *       This is required because the engine will create temporary instances when
      *       syncs arrive on the clients.
      * @param {GameEngine} gameEngine - the gameEngine this object will be used in
      * @param {Object} options - options for the new object. See {@link GameObject}
      * @param {Object} props - properties to be set in the new object
      * @param {TwoVector} props.position - position vector
      * @param {TwoVector} props.velocity - velocity vector
      * @param {Number} props.angle - orientation angle
      * @param {Number} props.mass - the mass
      * @param {Number} props.angularVelocity - angular velocity
      */}]);function PhysicalObject2D(gameEngine,options,props){var _this;_classCallCheck(this,PhysicalObject2D);_this=_possibleConstructorReturn(this,_getPrototypeOf(PhysicalObject2D).call(this,gameEngine,options));_this.playerId=0;_this.bendingIncrements=0;// set default position, velocity and quaternion
_this.position=new TwoVector(0,0);_this.velocity=new TwoVector(0,0);_this.angle=0;_this.angularVelocity=0;_this.mass=0;// use values if provided
props=props||{};if(props.playerId)_this.playerId=props.playerId;if(props.position)_this.position.copy(props.position);if(props.velocity)_this.velocity.copy(props.velocity);if(props.angle)_this.angle=props.angle;if(props.angularVelocity)_this.angularVelocity=props.angularVelocity;if(props.mass)_this.mass=props.mass;_this.class=PhysicalObject2D;return _this;}/**
     * Called after the object is added to to the game world.
     * This is the right place to add renderer sub-objects, physics sub-objects
     * and any other resources that should be created
     */_createClass(PhysicalObject2D,[{key:"onAddToWorld",value:function onAddToWorld(){}/**
       * Formatted textual description of the dynamic object.
       * The output of this method is used to describe each instance in the traces,
       * which significantly helps in debugging.
       *
       * @return {String} description - a string describing the PhysicalObject2D
       */},{key:"toString",value:function toString(){var p=this.position.toString();var v=this.velocity.toString();var a=this.angle;var av=this.angularVelocity;return"phyObj2D[".concat(this.id,"] player").concat(this.playerId," Pos=").concat(p," Vel=").concat(v," Ang=").concat(a," AVel=").concat(av);}/**
       * Each object class can define its own bending overrides.
       * return an object which can include attributes: position, velocity,
       * angle, and angularVelocity.  In each case, you can specify a min value, max
       * value, and a percent value.
       *
       * @return {Object} bending - an object with bending paramters
       */},{key:"bendingToString",// display object's physical attributes as a string
// for debugging purposes mostly
value:function bendingToString(){if(this.bendingIncrements)return"\u0394Pos=".concat(this.bendingPositionDelta," \u0394Vel=").concat(this.bendingVelocityDelta," \u0394Angle=").concat(this.bendingAngleDelta," increments=").concat(this.bendingIncrements);return'no bending';}// derive and save the bending increment parameters:
// - bendingPositionDelta
// - bendingVelocityDelta
// - bendingAVDelta
// - bendingAngleDelta
// these can later be used to "bend" incrementally from the state described
// by "original" to the state described by "self"
},{key:"bendToCurrent",value:function bendToCurrent(original,percent,worldSettings,isLocal,increments){var bending={increments:increments,percent:percent};// if the object has defined a bending multiples for this object, use them
var positionBending=Object.assign({},bending,this.bending.position);var velocityBending=Object.assign({},bending,this.bending.velocity);var angleBending=Object.assign({},bending,this.bending.angle);var avBending=Object.assign({},bending,this.bending.angularVelocity);// check for local object overrides to bendingTarget
if(isLocal){Object.assign(positionBending,this.bending.positionLocal);Object.assign(velocityBending,this.bending.velocityLocal);Object.assign(angleBending,this.bending.angleLocal);Object.assign(avBending,this.bending.angularVelocityLocal);}// get the incremental delta position & velocity
this.incrementScale=percent/increments;this.bendingPositionDelta=original.position.getBendingDelta(this.position,positionBending);this.bendingVelocityDelta=original.velocity.getBendingDelta(this.velocity,velocityBending);// get the incremental angular-velocity
this.bendingAVDelta=(this.angularVelocity-original.angularVelocity)*this.incrementScale*avBending.percent;// get the incremental angle correction
this.bendingAngleDelta=MathUtils.interpolateDeltaWithWrapping(original.angle,this.angle,angleBending.percent,0,2*Math.PI)/increments;this.bendingTarget=new this.constructor();this.bendingTarget.syncTo(this);// revert to original
this.position.copy(original.position);this.angle=original.angle;this.angularVelocity=original.angularVelocity;this.velocity.copy(original.velocity);this.bendingIncrements=increments;this.bendingOptions=bending;this.refreshToPhysics();}},{key:"syncTo",value:function syncTo(other,options){_get(_getPrototypeOf(PhysicalObject2D.prototype),"syncTo",this).call(this,other);this.position.copy(other.position);this.angle=other.angle;this.angularVelocity=other.angularVelocity;if(!options||!options.keepVelocity){this.velocity.copy(other.velocity);}if(this.physicsObj)this.refreshToPhysics();}// update position, angle, angular velocity, and velocity from new physical state.
},{key:"refreshFromPhysics",value:function refreshFromPhysics(){this.copyVector(this.physicsObj.position,this.position);this.copyVector(this.physicsObj.velocity,this.velocity);this.angle=this.physicsObj.angle;this.angularVelocity=this.physicsObj.angularVelocity;}// generic vector copy.  We need this because different
// physics engines have different implementations.
// TODO: Better implementation: the physics engine implementor
// should define copyFromLanceVector and copyToLanceVector
},{key:"copyVector",value:function copyVector(source,target){var sourceVec=source;if(typeof source[0]==='number'&&typeof source[1]==='number')sourceVec={x:source[0],y:source[1]};if(typeof target.copy==='function'){target.copy(sourceVec);}else if(target instanceof Float32Array){target[0]=sourceVec.x;target[1]=sourceVec.y;}else{target.x=sourceVec.x;target.y=sourceVec.y;}}// update position, angle, angular velocity, and velocity from new game state.
},{key:"refreshToPhysics",value:function refreshToPhysics(){this.copyVector(this.position,this.physicsObj.position);this.copyVector(this.velocity,this.physicsObj.velocity);this.physicsObj.angle=this.angle;this.physicsObj.angularVelocity=this.angularVelocity;}// apply one increment of bending
},{key:"applyIncrementalBending",value:function applyIncrementalBending(stepDesc){if(this.bendingIncrements===0)return;var timeFactor=1;if(stepDesc&&stepDesc.dt)timeFactor=stepDesc.dt/(1000/60);var posDelta=this.bendingPositionDelta.clone().multiplyScalar(timeFactor);var velDelta=this.bendingVelocityDelta.clone().multiplyScalar(timeFactor);this.position.add(posDelta);this.velocity.add(velDelta);this.angularVelocity+=this.bendingAVDelta*timeFactor;this.angle+=this.bendingAngleDelta*timeFactor;this.bendingIncrements--;}// interpolate implementation
},{key:"interpolate",value:function interpolate(nextObj,percent){// slerp to target position
this.position.lerp(nextObj.position,percent);this.angle=MathUtils.interpolateDeltaWithWrapping(this.angle,nextObj.angle,percent,0,2*Math.PI);}},{key:"bending",get:function get(){return{// example:
// position: { percent: 0.8, min: 0.0, max: 4.0 },
// velocity: { percent: 0.4, min: 0.0 },
// angularVelocity: { percent: 0.0 },
// angleLocal: { percent: 0.0 }
};}}]);return PhysicalObject2D;}(GameObject);/**
   * A ThreeVector is a geometric object which is completely described
   * by three values.
   */var ThreeVector=/*#__PURE__*/function(_Serializable){_inherits(ThreeVector,_Serializable);_createClass(ThreeVector,null,[{key:"netScheme",get:function get(){return{x:{type:BaseTypes.TYPES.FLOAT32},y:{type:BaseTypes.TYPES.FLOAT32},z:{type:BaseTypes.TYPES.FLOAT32}};}/**
      * Creates an instance of a ThreeVector.
      * @param {Number} x - first value
      * @param {Number} y - second value
      * @param {Number} z - second value
      * @return {ThreeVector} v - the new ThreeVector
      */}]);function ThreeVector(x,y,z){var _this;_classCallCheck(this,ThreeVector);_this=_possibleConstructorReturn(this,_getPrototypeOf(ThreeVector).call(this));_this.x=x;_this.y=y;_this.z=z;return _possibleConstructorReturn(_this,_assertThisInitialized(_this));}/**
     * Formatted textual description of the ThreeVector.
     * @return {String} description
     */_createClass(ThreeVector,[{key:"toString",value:function toString(){function round3(x){return Math.round(x*1000)/1000;}return"[".concat(round3(this.x),", ").concat(round3(this.y),", ").concat(round3(this.z),"]");}/**
       * Multiply this ThreeVector by a scalar
       *
       * @param {Number} s the scale
       * @return {ThreeVector} returns self
       */},{key:"multiplyScalar",value:function multiplyScalar(s){this.x*=s;this.y*=s;this.z*=s;return this;}/**
       * Get vector length
       *
       * @return {Number} length of this vector
       */},{key:"length",value:function length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);}/**
       * Add other vector to this vector
       *
       * @param {ThreeVector} other the other vector
       * @return {ThreeVector} returns self
       */},{key:"add",value:function add(other){this.x+=other.x;this.y+=other.y;this.z+=other.z;return this;}/**
       * Subtract other vector from this vector
       *
       * @param {ThreeVector} other the other vector
       * @return {ThreeVector} returns self
       */},{key:"subtract",value:function subtract(other){this.x-=other.x;this.y-=other.y;this.z-=other.z;return this;}/**
       * Normalize this vector, in-place
       *
       * @return {ThreeVector} returns self
       */},{key:"normalize",value:function normalize(){this.multiplyScalar(1/this.length());return this;}/**
       * Copy values from another ThreeVector into this ThreeVector
       *
       * @param {ThreeVector} sourceObj the other vector
       * @return {ThreeVector} returns self
       */},{key:"copy",value:function copy(sourceObj){this.x=sourceObj.x;this.y=sourceObj.y;this.z=sourceObj.z;return this;}/**
       * Set ThreeVector values
       *
       * @param {Number} x x-value
       * @param {Number} y y-value
       * @param {Number} z z-value
       * @return {ThreeVector} returns self
       */},{key:"set",value:function set(x,y,z){this.x=x;this.y=y;this.z=z;return this;}/**
       * Create a clone of this vector
       *
       * @return {ThreeVector} returns clone
       */},{key:"clone",value:function clone(){return new ThreeVector(this.x,this.y,this.z);}/**
       * Apply in-place lerp (linear interpolation) to this ThreeVector
       * towards another ThreeVector
       * @param {ThreeVector} target the target vector
       * @param {Number} p The percentage to interpolate
       * @return {ThreeVector} returns self
       */},{key:"lerp",value:function lerp(target,p){this.x+=(target.x-this.x)*p;this.y+=(target.y-this.y)*p;this.z+=(target.z-this.z)*p;return this;}/**
       * Get bending Delta Vector
       * towards another ThreeVector
       * @param {ThreeVector} target the target vector
       * @param {Object} options bending options
       * @param {Number} options.increments number of increments
       * @param {Number} options.percent The percentage to bend
       * @param {Number} options.min No less than this value
       * @param {Number} options.max No more than this value
       * @return {ThreeVector} returns new Incremental Vector
       */},{key:"getBendingDelta",value:function getBendingDelta(target,options){var increment=target.clone();increment.subtract(this);increment.multiplyScalar(options.percent);// check for max case
if(options.max&&increment.length()>options.max||options.max&&increment.length()<options.min){return new ThreeVector(0,0,0);}// divide into increments
increment.multiplyScalar(1/options.increments);return increment;}}]);return ThreeVector;}(Serializable);var MAX_DEL_THETA=0.2;/**
   * A Quaternion is a geometric object which can be used to
   * represent a three-dimensional rotation.
   */var Quaternion=/*#__PURE__*/function(_Serializable){_inherits(Quaternion,_Serializable);_createClass(Quaternion,null,[{key:"netScheme",get:function get(){return{w:{type:BaseTypes.TYPES.FLOAT32},x:{type:BaseTypes.TYPES.FLOAT32},y:{type:BaseTypes.TYPES.FLOAT32},z:{type:BaseTypes.TYPES.FLOAT32}};}/**
      * Creates an instance of a Quaternion.
      * @param {Number} w - first value
      * @param {Number} x - second value
      * @param {Number} y - third value
      * @param {Number} z - fourth value
      * @return {Quaternion} v - the new Quaternion
      */}]);function Quaternion(w,x,y,z){var _this;_classCallCheck(this,Quaternion);_this=_possibleConstructorReturn(this,_getPrototypeOf(Quaternion).call(this));_this.w=w;_this.x=x;_this.y=y;_this.z=z;return _possibleConstructorReturn(_this,_assertThisInitialized(_this));}/**
     * Formatted textual description of the Quaternion.
     * @return {String} description
     */_createClass(Quaternion,[{key:"toString",value:function toString(){function round3(x){return Math.round(x*1000)/1000;}{var axisAngle=this.toAxisAngle();return"[".concat(round3(axisAngle.angle),",").concat(axisAngle.axis.toString(),"]");}return"[".concat(round3(this.w),", ").concat(round3(this.x),", ").concat(round3(this.y),", ").concat(round3(this.z),"]");}/**
       * copy values from another quaternion into this quaternion
       *
       * @param {Quaternion} sourceObj the quaternion to copy from
       * @return {Quaternion} returns self
       */},{key:"copy",value:function copy(sourceObj){this.set(sourceObj.w,sourceObj.x,sourceObj.y,sourceObj.z);return this;}/**
       * set quaternion values
       *
       * @param {Number} w w-value
       * @param {Number} x x-value
       * @param {Number} y y-value
       * @param {Number} z z-value
       * @return {Quaternion} returns self
       */},{key:"set",value:function set(w,x,y,z){this.w=w;this.x=x;this.y=y;this.z=z;return this;}/**
       * return an axis-angle representation of this quaternion
       *
       * @return {Object} contains two attributes: axis (ThreeVector) and angle.
       */},{key:"toAxisAngle",value:function toAxisAngle(){// assuming quaternion normalised then w is less than 1, so term always positive.
var axis=new ThreeVector(1,0,0);this.normalize();var angle=2*Math.acos(this.w);var s=Math.sqrt(1-this.w*this.w);if(s>0.001){var divS=1/s;axis.x=this.x*divS;axis.y=this.y*divS;axis.z=this.z*divS;}if(s>Math.PI){s-=2*Math.PI;}return{axis:axis,angle:angle};}},{key:"normalize",value:function normalize(){var l=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);if(l===0){this.x=0;this.y=0;this.z=0;this.w=0;}else{l=1/l;this.x*=l;this.y*=l;this.z*=l;this.w*=l;}return this;}/**
       * set the values of this quaternion from an axis/angle representation
       *
       * @param {ThreeVector} axis The axis
       * @param {Number} angle angle in radians
       * @return {Quaternion} returns self
       */},{key:"setFromAxisAngle",value:function setFromAxisAngle(axis,angle){if(angle<0)angle+=Math.PI*2;var halfAngle=angle*0.5;var s=Math.sin(halfAngle);this.x=axis.x*s;this.y=axis.y*s;this.z=axis.z*s;this.w=Math.cos(halfAngle);return this;}/**
       * conjugate the quaternion, in-place
       *
       * @return {Quaternion} returns self
       */},{key:"conjugate",value:function conjugate(){this.x*=-1;this.y*=-1;this.z*=-1;return this;}/* eslint-disable */ /**
       * multiply this quaternion by another, in-place
       *
       * @param {Quaternion} other The other quaternion
       * @return {Quaternion} returns self
       */},{key:"multiply",value:function multiply(other){var aw=this.w,ax=this.x,ay=this.y,az=this.z;var bw=other.w,bx=other.x,by=other.y,bz=other.z;this.x=ax*bw+aw*bx+ay*bz-az*by;this.y=ay*bw+aw*by+az*bx-ax*bz;this.z=az*bw+aw*bz+ax*by-ay*bx;this.w=aw*bw-ax*bx-ay*by-az*bz;return this;}/* eslint-enable */ /* eslint-disable */ /**
       * Apply in-place slerp (spherical linear interpolation) to this quaternion,
       * towards another quaternion.
       *
       * @param {Quaternion} target The target quaternion
       * @param {Number} bending The percentage to interpolate
       * @return {Quaternion} returns self
       */},{key:"slerp",value:function slerp(target,bending){if(bending<=0)return this;if(bending>=1)return this.copy(target);var aw=this.w,ax=this.x,ay=this.y,az=this.z;var bw=target.w,bx=target.x,by=target.y,bz=target.z;var cosHalfTheta=aw*bw+ax*bx+ay*by+az*bz;if(cosHalfTheta<0){this.set(-bw,-bx,-by,-bz);cosHalfTheta=-cosHalfTheta;}else{this.copy(target);}if(cosHalfTheta>=1.0){this.set(aw,ax,ay,az);return this;}var sqrSinHalfTheta=1.0-cosHalfTheta*cosHalfTheta;if(sqrSinHalfTheta<Number.EPSILON){var s=1-bending;this.set(s*aw+bending*this.w,s*ax+bending*this.x,s*ay+bending*this.y,s*az+bending*this.z);return this.normalize();}var sinHalfTheta=Math.sqrt(sqrSinHalfTheta);var halfTheta=Math.atan2(sinHalfTheta,cosHalfTheta);var delTheta=bending*halfTheta;if(Math.abs(delTheta)>MAX_DEL_THETA)delTheta=MAX_DEL_THETA*Math.sign(delTheta);var ratioA=Math.sin(halfTheta-delTheta)/sinHalfTheta;var ratioB=Math.sin(delTheta)/sinHalfTheta;this.set(aw*ratioA+this.w*ratioB,ax*ratioA+this.x*ratioB,ay*ratioA+this.y*ratioB,az*ratioA+this.z*ratioB);return this;}/* eslint-enable */}]);return Quaternion;}(Serializable);/**
   * The PhysicalObject3D is the base class for physical game objects
   */var PhysicalObject3D=/*#__PURE__*/function(_GameObject){_inherits(PhysicalObject3D,_GameObject);_createClass(PhysicalObject3D,null,[{key:"netScheme",/**
      * The netScheme is a dictionary of attributes in this game
      * object.  The attributes listed in the netScheme are those exact
      * attributes which will be serialized and sent from the server
      * to each client on every server update.
      * The netScheme member is implemented as a getter.
      *
      * You may choose not to implement this method, in which
      * case your object only transmits the default attributes
      * which are already part of {@link PhysicalObject3D}.
      * But if you choose to add more attributes, make sure
      * the return value includes the netScheme of the super class.
      *
      * @memberof PhysicalObject3D
      * @member {Object} netScheme
      * @example
      *     static get netScheme() {
      *       return Object.assign({
      *           mojo: { type: BaseTypes.TYPES.UINT8 },
      *         }, super.netScheme);
      *     }
      */get:function get(){return Object.assign({playerId:{type:BaseTypes.TYPES.INT16},position:{type:BaseTypes.TYPES.CLASSINSTANCE},quaternion:{type:BaseTypes.TYPES.CLASSINSTANCE},velocity:{type:BaseTypes.TYPES.CLASSINSTANCE},angularVelocity:{type:BaseTypes.TYPES.CLASSINSTANCE}},_get(_getPrototypeOf(PhysicalObject3D),"netScheme",this));}/**
      * Creates an instance of a physical object.
      * Override to provide starting values for position, velocity, quaternion and angular velocity.
      * NOTE: all subclasses of this class must comply with this constructor signature.
      *       This is required because the engine will create temporary instances when
      *       syncs arrive on the clients.
      * @param {GameEngine} gameEngine - the gameEngine this object will be used in
      * @param {Object} options - options for the new object. See {@link GameObject}
      * @param {Object} props - properties to be set in the new object
      * @param {ThreeVector} props.position - position vector
      * @param {ThreeVector} props.velocity - velocity vector
      * @param {Quaternion} props.quaternion - orientation quaternion
      * @param {ThreeVector} props.angularVelocity - 3-vector representation of angular velocity
      */}]);function PhysicalObject3D(gameEngine,options,props){var _this;_classCallCheck(this,PhysicalObject3D);_this=_possibleConstructorReturn(this,_getPrototypeOf(PhysicalObject3D).call(this,gameEngine,options));_this.playerId=0;_this.bendingIncrements=0;// set default position, velocity and quaternion
_this.position=new ThreeVector(0,0,0);_this.velocity=new ThreeVector(0,0,0);_this.quaternion=new Quaternion(1,0,0,0);_this.angularVelocity=new ThreeVector(0,0,0);// use values if provided
props=props||{};if(props.position)_this.position.copy(props.position);if(props.velocity)_this.velocity.copy(props.velocity);if(props.quaternion)_this.quaternion.copy(props.quaternion);if(props.angularVelocity)_this.angularVelocity.copy(props.angularVelocity);_this.class=PhysicalObject3D;return _this;}/**
     * Formatted textual description of the dynamic object.
     * The output of this method is used to describe each instance in the traces,
     * which significantly helps in debugging.
     *
     * @return {String} description - a string describing the PhysicalObject3D
     */_createClass(PhysicalObject3D,[{key:"toString",value:function toString(){var p=this.position.toString();var v=this.velocity.toString();var q=this.quaternion.toString();var a=this.angularVelocity.toString();return"phyObj[".concat(this.id,"] player").concat(this.playerId," Pos").concat(p," Vel").concat(v," Dir").concat(q," AVel").concat(a);}// display object's physical attributes as a string
// for debugging purposes mostly
},{key:"bendingToString",value:function bendingToString(){if(this.bendingOptions)return"bend=".concat(this.bendingOptions.percent," deltaPos=").concat(this.bendingPositionDelta," deltaVel=").concat(this.bendingVelocityDelta," deltaQuat=").concat(this.bendingQuaternionDelta);return'no bending';}// derive and save the bending increment parameters:
// - bendingPositionDelta
// - bendingAVDelta
// - bendingQuaternionDelta
// these can later be used to "bend" incrementally from the state described
// by "original" to the state described by "self"
},{key:"bendToCurrent",value:function bendToCurrent(original,percent,worldSettings,isLocal,increments){var bending={increments:increments,percent:percent};// if the object has defined a bending multiples for this object, use them
var positionBending=Object.assign({},bending,this.bending.position);var velocityBending=Object.assign({},bending,this.bending.velocity);// check for local object overrides to bendingTarget
if(isLocal){Object.assign(positionBending,this.bending.positionLocal);Object.assign(velocityBending,this.bending.velocityLocal);}// get the incremental delta position & velocity
this.incrementScale=percent/increments;this.bendingPositionDelta=original.position.getBendingDelta(this.position,positionBending);this.bendingVelocityDelta=original.velocity.getBendingDelta(this.velocity,velocityBending);this.bendingAVDelta=new ThreeVector(0,0,0);// get the incremental quaternion rotation
this.bendingQuaternionDelta=new Quaternion().copy(original.quaternion).conjugate();this.bendingQuaternionDelta.multiply(this.quaternion);var axisAngle=this.bendingQuaternionDelta.toAxisAngle();axisAngle.angle*=this.incrementScale;this.bendingQuaternionDelta.setFromAxisAngle(axisAngle.axis,axisAngle.angle);this.bendingTarget=new this.constructor();this.bendingTarget.syncTo(this);this.position.copy(original.position);this.quaternion.copy(original.quaternion);this.angularVelocity.copy(original.angularVelocity);this.bendingIncrements=increments;this.bendingOptions=bending;this.refreshToPhysics();}},{key:"syncTo",value:function syncTo(other,options){_get(_getPrototypeOf(PhysicalObject3D.prototype),"syncTo",this).call(this,other);this.position.copy(other.position);this.quaternion.copy(other.quaternion);this.angularVelocity.copy(other.angularVelocity);if(!options||!options.keepVelocity){this.velocity.copy(other.velocity);}if(this.physicsObj)this.refreshToPhysics();}// update position, quaternion, and velocity from new physical state.
},{key:"refreshFromPhysics",value:function refreshFromPhysics(){this.position.copy(this.physicsObj.position);this.quaternion.copy(this.physicsObj.quaternion);this.velocity.copy(this.physicsObj.velocity);this.angularVelocity.copy(this.physicsObj.angularVelocity);}// update position, quaternion, and velocity from new game state.
},{key:"refreshToPhysics",value:function refreshToPhysics(){this.physicsObj.position.copy(this.position);this.physicsObj.quaternion.copy(this.quaternion);this.physicsObj.velocity.copy(this.velocity);this.physicsObj.angularVelocity.copy(this.angularVelocity);}// apply one increment of bending
},{key:"applyIncrementalBending",value:function applyIncrementalBending(stepDesc){if(this.bendingIncrements===0)return;if(stepDesc&&stepDesc.dt){var timeFactor=stepDesc.dt/(1000/60);// TODO: use clone() below.  it's cleaner
var posDelta=new ThreeVector().copy(this.bendingPositionDelta).multiplyScalar(timeFactor);var avDelta=new ThreeVector().copy(this.bendingAVDelta).multiplyScalar(timeFactor);this.position.add(posDelta);this.angularVelocity.add(avDelta);// one approach to orientation bending is slerp:
this.quaternion.slerp(this.bendingTarget.quaternion,this.incrementScale*timeFactor*0.8);}else{this.position.add(this.bendingPositionDelta);this.angularVelocity.add(this.bendingAVDelta);this.quaternion.slerp(this.bendingTarget.quaternion,this.incrementScale);}// alternative: fixed delta-quaternion correction
// TODO: adjust quaternion bending to dt timefactor precision
// this.quaternion.multiply(this.bendingQuaternionDelta);
this.bendingIncrements--;}// interpolate implementation
},{key:"interpolate",value:function interpolate(nextObj,percent){// slerp to target position
this.position.lerp(nextObj.position,percent);this.quaternion.slerp(nextObj.quaternion,percent);}}]);return PhysicalObject3D;}(GameObject);var lib={Trace:Trace};/**
   * Parses an URI
   *
   * @author Steven Levithan <stevenlevithan.com> (MIT license)
   * @api private
   */var re=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;var parts=['source','protocol','authority','userInfo','user','password','host','port','relative','path','directory','file','query','anchor'];var parseuri=function parseuri(str){var src=str,b=str.indexOf('['),e=str.indexOf(']');if(b!=-1&&e!=-1){str=str.substring(0,b)+str.substring(b,e).replace(/:/g,';')+str.substring(e,str.length);}var m=re.exec(str||''),uri={},i=14;while(i--){uri[parts[i]]=m[i]||'';}if(b!=-1&&e!=-1){uri.source=src;uri.host=uri.host.substring(1,uri.host.length-1).replace(/;/g,':');uri.authority=uri.authority.replace('[','').replace(']','').replace(/;/g,':');uri.ipv6uri=true;}return uri;};/**
   * Helpers.
   */var s=1000;var m=s*60;var h=m*60;var d=h*24;var y=d*365.25;/**
   * Parse or format the given `val`.
   *
   * Options:
   *
   *  - `long` verbose formatting [false]
   *
   * @param {String|Number} val
   * @param {Object} [options]
   * @throws {Error} throw an error if val is not a non-empty string or a number
   * @return {String|Number}
   * @api public
   */var ms=function ms(val,options){options=options||{};var type=_typeof2(val);if(type==='string'&&val.length>0){return parse(val);}else if(type==='number'&&isNaN(val)===false){return options.long?fmtLong(val):fmtShort(val);}throw new Error('val is not a non-empty string or a valid number. val='+JSON.stringify(val));};/**
   * Parse the given `str` and return milliseconds.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */function parse(str){str=String(str);if(str.length>100){return;}var match=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);if(!match){return;}var n=parseFloat(match[1]);var type=(match[2]||'ms').toLowerCase();switch(type){case'years':case'year':case'yrs':case'yr':case'y':return n*y;case'days':case'day':case'd':return n*d;case'hours':case'hour':case'hrs':case'hr':case'h':return n*h;case'minutes':case'minute':case'mins':case'min':case'm':return n*m;case'seconds':case'second':case'secs':case'sec':case's':return n*s;case'milliseconds':case'millisecond':case'msecs':case'msec':case'ms':return n;default:return undefined;}}/**
   * Short format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */function fmtShort(ms){if(ms>=d){return Math.round(ms/d)+'d';}if(ms>=h){return Math.round(ms/h)+'h';}if(ms>=m){return Math.round(ms/m)+'m';}if(ms>=s){return Math.round(ms/s)+'s';}return ms+'ms';}/**
   * Long format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */function fmtLong(ms){return plural(ms,d,'day')||plural(ms,h,'hour')||plural(ms,m,'minute')||plural(ms,s,'second')||ms+' ms';}/**
   * Pluralization helper.
   */function plural(ms,n,name){if(ms<n){return;}if(ms<n*1.5){return Math.floor(ms/n)+' '+name;}return Math.ceil(ms/n)+' '+name+'s';}var debug=createCommonjsModule(function(module,exports){/**
   * This is the common logic for both the Node.js and web browser
   * implementations of `debug()`.
   *
   * Expose `debug()` as the module.
   */exports=module.exports=createDebug.debug=createDebug['default']=createDebug;exports.coerce=coerce;exports.disable=disable;exports.enable=enable;exports.enabled=enabled;exports.humanize=ms;/**
   * Active `debug` instances.
   */exports.instances=[];/**
   * The currently active debug mode names, and names to skip.
   */exports.names=[];exports.skips=[];/**
   * Map of special "%n" handling functions, for the debug "format" argument.
   *
   * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
   */exports.formatters={};/**
   * Select a color.
   * @param {String} namespace
   * @return {Number}
   * @api private
   */function selectColor(namespace){var hash=0,i;for(i in namespace){hash=(hash<<5)-hash+namespace.charCodeAt(i);hash|=0;// Convert to 32bit integer
}return exports.colors[Math.abs(hash)%exports.colors.length];}/**
   * Create a debugger with the given `namespace`.
   *
   * @param {String} namespace
   * @return {Function}
   * @api public
   */function createDebug(namespace){var prevTime;function debug(){// disabled?
if(!debug.enabled)return;var self=debug;// set `diff` timestamp
var curr=+new Date();var ms=curr-(prevTime||curr);self.diff=ms;self.prev=prevTime;self.curr=curr;prevTime=curr;// turn the `arguments` into a proper Array
var args=new Array(arguments.length);for(var i=0;i<args.length;i++){args[i]=arguments[i];}args[0]=exports.coerce(args[0]);if('string'!==typeof args[0]){// anything else let's inspect with %O
args.unshift('%O');}// apply any `formatters` transformations
var index=0;args[0]=args[0].replace(/%([a-zA-Z%])/g,function(match,format){// if we encounter an escaped % then don't increase the array index
if(match==='%%')return match;index++;var formatter=exports.formatters[format];if('function'===typeof formatter){var val=args[index];match=formatter.call(self,val);// now we need to remove `args[index]` since it's inlined in the `format`
args.splice(index,1);index--;}return match;});// apply env-specific formatting (colors, etc.)
exports.formatArgs.call(self,args);var logFn=debug.log||exports.log||console.log.bind(console);logFn.apply(self,args);}debug.namespace=namespace;debug.enabled=exports.enabled(namespace);debug.useColors=exports.useColors();debug.color=selectColor(namespace);debug.destroy=destroy;// env-specific initialization logic for debug instances
if('function'===typeof exports.init){exports.init(debug);}exports.instances.push(debug);return debug;}function destroy(){var index=exports.instances.indexOf(this);if(index!==-1){exports.instances.splice(index,1);return true;}else{return false;}}/**
   * Enables a debug mode by namespaces. This can include modes
   * separated by a colon and wildcards.
   *
   * @param {String} namespaces
   * @api public
   */function enable(namespaces){exports.save(namespaces);exports.names=[];exports.skips=[];var i;var split=(typeof namespaces==='string'?namespaces:'').split(/[\s,]+/);var len=split.length;for(i=0;i<len;i++){if(!split[i])continue;// ignore empty strings
namespaces=split[i].replace(/\*/g,'.*?');if(namespaces[0]==='-'){exports.skips.push(new RegExp('^'+namespaces.substr(1)+'$'));}else{exports.names.push(new RegExp('^'+namespaces+'$'));}}for(i=0;i<exports.instances.length;i++){var instance=exports.instances[i];instance.enabled=exports.enabled(instance.namespace);}}/**
   * Disable debug output.
   *
   * @api public
   */function disable(){exports.enable('');}/**
   * Returns true if the given mode name is enabled, false otherwise.
   *
   * @param {String} name
   * @return {Boolean}
   * @api public
   */function enabled(name){if(name[name.length-1]==='*'){return true;}var i,len;for(i=0,len=exports.skips.length;i<len;i++){if(exports.skips[i].test(name)){return false;}}for(i=0,len=exports.names.length;i<len;i++){if(exports.names[i].test(name)){return true;}}return false;}/**
   * Coerce `val`.
   *
   * @param {Mixed} val
   * @return {Mixed}
   * @api private
   */function coerce(val){if(val instanceof Error)return val.stack||val.message;return val;}});var debug_1=debug.coerce;var debug_2=debug.disable;var debug_3=debug.enable;var debug_4=debug.enabled;var debug_5=debug.humanize;var debug_6=debug.instances;var debug_7=debug.names;var debug_8=debug.skips;var debug_9=debug.formatters;var browser=createCommonjsModule(function(module,exports){/**
   * This is the web browser implementation of `debug()`.
   *
   * Expose `debug()` as the module.
   */exports=module.exports=debug;exports.log=log;exports.formatArgs=formatArgs;exports.save=save;exports.load=load;exports.useColors=useColors;exports.storage='undefined'!=typeof chrome&&'undefined'!=typeof chrome.storage?chrome.storage.local:localstorage();/**
   * Colors.
   */exports.colors=['#0000CC','#0000FF','#0033CC','#0033FF','#0066CC','#0066FF','#0099CC','#0099FF','#00CC00','#00CC33','#00CC66','#00CC99','#00CCCC','#00CCFF','#3300CC','#3300FF','#3333CC','#3333FF','#3366CC','#3366FF','#3399CC','#3399FF','#33CC00','#33CC33','#33CC66','#33CC99','#33CCCC','#33CCFF','#6600CC','#6600FF','#6633CC','#6633FF','#66CC00','#66CC33','#9900CC','#9900FF','#9933CC','#9933FF','#99CC00','#99CC33','#CC0000','#CC0033','#CC0066','#CC0099','#CC00CC','#CC00FF','#CC3300','#CC3333','#CC3366','#CC3399','#CC33CC','#CC33FF','#CC6600','#CC6633','#CC9900','#CC9933','#CCCC00','#CCCC33','#FF0000','#FF0033','#FF0066','#FF0099','#FF00CC','#FF00FF','#FF3300','#FF3333','#FF3366','#FF3399','#FF33CC','#FF33FF','#FF6600','#FF6633','#FF9900','#FF9933','#FFCC00','#FFCC33'];/**
   * Currently only WebKit-based Web Inspectors, Firefox >= v31,
   * and the Firebug extension (any Firefox version) are known
   * to support "%c" CSS customizations.
   *
   * TODO: add a `localStorage` variable to explicitly enable/disable colors
   */function useColors(){// NB: In an Electron preload script, document will be defined but not fully
// initialized. Since we know we're in Chrome, we'll just detect this case
// explicitly
if(typeof window!=='undefined'&&window.process&&window.process.type==='renderer'){return true;}// Internet Explorer and Edge do not support colors.
if(typeof navigator!=='undefined'&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)){return false;}// is webkit? http://stackoverflow.com/a/16459606/376773
// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
return typeof document!=='undefined'&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||// is firebug? http://stackoverflow.com/a/398120/376773
typeof window!=='undefined'&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||// is firefox >= v31?
// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
typeof navigator!=='undefined'&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||// double check webkit in userAgent just in case we are in a worker
typeof navigator!=='undefined'&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);}/**
   * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
   */exports.formatters.j=function(v){try{return JSON.stringify(v);}catch(err){return'[UnexpectedJSONParseError]: '+err.message;}};/**
   * Colorize log arguments if enabled.
   *
   * @api public
   */function formatArgs(args){var useColors=this.useColors;args[0]=(useColors?'%c':'')+this.namespace+(useColors?' %c':' ')+args[0]+(useColors?'%c ':' ')+'+'+exports.humanize(this.diff);if(!useColors)return;var c='color: '+this.color;args.splice(1,0,c,'color: inherit');// the final "%c" is somewhat tricky, because there could be other
// arguments passed either before or after the %c, so we need to
// figure out the correct index to insert the CSS into
var index=0;var lastC=0;args[0].replace(/%[a-zA-Z%]/g,function(match){if('%%'===match)return;index++;if('%c'===match){// we only are interested in the *last* %c
// (the user may have provided their own)
lastC=index;}});args.splice(lastC,0,c);}/**
   * Invokes `console.log()` when available.
   * No-op when `console.log` is not a "function".
   *
   * @api public
   */function log(){// this hackery is required for IE8/9, where
// the `console.log` function doesn't have 'apply'
return'object'===(typeof console==="undefined"?"undefined":_typeof2(console))&&console.log&&Function.prototype.apply.call(console.log,console,arguments);}/**
   * Save `namespaces`.
   *
   * @param {String} namespaces
   * @api private
   */function save(namespaces){try{if(null==namespaces){exports.storage.removeItem('debug');}else{exports.storage.debug=namespaces;}}catch(e){}}/**
   * Load `namespaces`.
   *
   * @return {String} returns the previously persisted debug modes
   * @api private
   */function load(){var r;try{r=exports.storage.debug;}catch(e){}// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
if(!r&&typeof process!=='undefined'&&'env'in process){r=process.env.DEBUG;}return r;}/**
   * Enable namespaces listed in `localStorage.debug` initially.
   */exports.enable(load());/**
   * Localstorage attempts to return the localstorage.
   *
   * This is necessary because safari throws
   * when a user disables cookies/localstorage
   * and you attempt to access it.
   *
   * @return {LocalStorage}
   * @api private
   */function localstorage(){try{return window.localStorage;}catch(e){}}});var browser_1=browser.log;var browser_2=browser.formatArgs;var browser_3=browser.save;var browser_4=browser.load;var browser_5=browser.useColors;var browser_6=browser.storage;var browser_7=browser.colors;/**
   * Module dependencies.
   */var debug$1=browser('socket.io-client:url');/**
   * Module exports.
   */var url_1=url;/**
   * URL parser.
   *
   * @param {String} url
   * @param {Object} An object meant to mimic window.location.
   *                 Defaults to window.location.
   * @api public
   */function url(uri,loc){var obj=uri;// default to window.location
loc=loc||commonjsGlobal.location;if(null==uri)uri=loc.protocol+'//'+loc.host;// relative path support
if('string'===typeof uri){if('/'===uri.charAt(0)){if('/'===uri.charAt(1)){uri=loc.protocol+uri;}else{uri=loc.host+uri;}}if(!/^(https?|wss?):\/\//.test(uri)){debug$1('protocol-less url %s',uri);if('undefined'!==typeof loc){uri=loc.protocol+'//'+uri;}else{uri='https://'+uri;}}// parse
debug$1('parse %s',uri);obj=parseuri(uri);}// make sure we treat `localhost:80` and `localhost` equally
if(!obj.port){if(/^(http|ws)$/.test(obj.protocol)){obj.port='80';}else if(/^(http|ws)s$/.test(obj.protocol)){obj.port='443';}}obj.path=obj.path||'/';var ipv6=obj.host.indexOf(':')!==-1;var host=ipv6?'['+obj.host+']':obj.host;// define unique id
obj.id=obj.protocol+'://'+host+':'+obj.port;// define href
obj.href=obj.protocol+'://'+host+(loc&&loc.port===obj.port?'':':'+obj.port);return obj;}var debug$2=createCommonjsModule(function(module,exports){/**
   * This is the common logic for both the Node.js and web browser
   * implementations of `debug()`.
   *
   * Expose `debug()` as the module.
   */exports=module.exports=createDebug.debug=createDebug['default']=createDebug;exports.coerce=coerce;exports.disable=disable;exports.enable=enable;exports.enabled=enabled;exports.humanize=ms;/**
   * Active `debug` instances.
   */exports.instances=[];/**
   * The currently active debug mode names, and names to skip.
   */exports.names=[];exports.skips=[];/**
   * Map of special "%n" handling functions, for the debug "format" argument.
   *
   * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
   */exports.formatters={};/**
   * Select a color.
   * @param {String} namespace
   * @return {Number}
   * @api private
   */function selectColor(namespace){var hash=0,i;for(i in namespace){hash=(hash<<5)-hash+namespace.charCodeAt(i);hash|=0;// Convert to 32bit integer
}return exports.colors[Math.abs(hash)%exports.colors.length];}/**
   * Create a debugger with the given `namespace`.
   *
   * @param {String} namespace
   * @return {Function}
   * @api public
   */function createDebug(namespace){var prevTime;function debug(){// disabled?
if(!debug.enabled)return;var self=debug;// set `diff` timestamp
var curr=+new Date();var ms=curr-(prevTime||curr);self.diff=ms;self.prev=prevTime;self.curr=curr;prevTime=curr;// turn the `arguments` into a proper Array
var args=new Array(arguments.length);for(var i=0;i<args.length;i++){args[i]=arguments[i];}args[0]=exports.coerce(args[0]);if('string'!==typeof args[0]){// anything else let's inspect with %O
args.unshift('%O');}// apply any `formatters` transformations
var index=0;args[0]=args[0].replace(/%([a-zA-Z%])/g,function(match,format){// if we encounter an escaped % then don't increase the array index
if(match==='%%')return match;index++;var formatter=exports.formatters[format];if('function'===typeof formatter){var val=args[index];match=formatter.call(self,val);// now we need to remove `args[index]` since it's inlined in the `format`
args.splice(index,1);index--;}return match;});// apply env-specific formatting (colors, etc.)
exports.formatArgs.call(self,args);var logFn=debug.log||exports.log||console.log.bind(console);logFn.apply(self,args);}debug.namespace=namespace;debug.enabled=exports.enabled(namespace);debug.useColors=exports.useColors();debug.color=selectColor(namespace);debug.destroy=destroy;// env-specific initialization logic for debug instances
if('function'===typeof exports.init){exports.init(debug);}exports.instances.push(debug);return debug;}function destroy(){var index=exports.instances.indexOf(this);if(index!==-1){exports.instances.splice(index,1);return true;}else{return false;}}/**
   * Enables a debug mode by namespaces. This can include modes
   * separated by a colon and wildcards.
   *
   * @param {String} namespaces
   * @api public
   */function enable(namespaces){exports.save(namespaces);exports.names=[];exports.skips=[];var i;var split=(typeof namespaces==='string'?namespaces:'').split(/[\s,]+/);var len=split.length;for(i=0;i<len;i++){if(!split[i])continue;// ignore empty strings
namespaces=split[i].replace(/\*/g,'.*?');if(namespaces[0]==='-'){exports.skips.push(new RegExp('^'+namespaces.substr(1)+'$'));}else{exports.names.push(new RegExp('^'+namespaces+'$'));}}for(i=0;i<exports.instances.length;i++){var instance=exports.instances[i];instance.enabled=exports.enabled(instance.namespace);}}/**
   * Disable debug output.
   *
   * @api public
   */function disable(){exports.enable('');}/**
   * Returns true if the given mode name is enabled, false otherwise.
   *
   * @param {String} name
   * @return {Boolean}
   * @api public
   */function enabled(name){if(name[name.length-1]==='*'){return true;}var i,len;for(i=0,len=exports.skips.length;i<len;i++){if(exports.skips[i].test(name)){return false;}}for(i=0,len=exports.names.length;i<len;i++){if(exports.names[i].test(name)){return true;}}return false;}/**
   * Coerce `val`.
   *
   * @param {Mixed} val
   * @return {Mixed}
   * @api private
   */function coerce(val){if(val instanceof Error)return val.stack||val.message;return val;}});var debug_1$1=debug$2.coerce;var debug_2$1=debug$2.disable;var debug_3$1=debug$2.enable;var debug_4$1=debug$2.enabled;var debug_5$1=debug$2.humanize;var debug_6$1=debug$2.instances;var debug_7$1=debug$2.names;var debug_8$1=debug$2.skips;var debug_9$1=debug$2.formatters;var browser$1=createCommonjsModule(function(module,exports){/**
   * This is the web browser implementation of `debug()`.
   *
   * Expose `debug()` as the module.
   */exports=module.exports=debug$2;exports.log=log;exports.formatArgs=formatArgs;exports.save=save;exports.load=load;exports.useColors=useColors;exports.storage='undefined'!=typeof chrome&&'undefined'!=typeof chrome.storage?chrome.storage.local:localstorage();/**
   * Colors.
   */exports.colors=['#0000CC','#0000FF','#0033CC','#0033FF','#0066CC','#0066FF','#0099CC','#0099FF','#00CC00','#00CC33','#00CC66','#00CC99','#00CCCC','#00CCFF','#3300CC','#3300FF','#3333CC','#3333FF','#3366CC','#3366FF','#3399CC','#3399FF','#33CC00','#33CC33','#33CC66','#33CC99','#33CCCC','#33CCFF','#6600CC','#6600FF','#6633CC','#6633FF','#66CC00','#66CC33','#9900CC','#9900FF','#9933CC','#9933FF','#99CC00','#99CC33','#CC0000','#CC0033','#CC0066','#CC0099','#CC00CC','#CC00FF','#CC3300','#CC3333','#CC3366','#CC3399','#CC33CC','#CC33FF','#CC6600','#CC6633','#CC9900','#CC9933','#CCCC00','#CCCC33','#FF0000','#FF0033','#FF0066','#FF0099','#FF00CC','#FF00FF','#FF3300','#FF3333','#FF3366','#FF3399','#FF33CC','#FF33FF','#FF6600','#FF6633','#FF9900','#FF9933','#FFCC00','#FFCC33'];/**
   * Currently only WebKit-based Web Inspectors, Firefox >= v31,
   * and the Firebug extension (any Firefox version) are known
   * to support "%c" CSS customizations.
   *
   * TODO: add a `localStorage` variable to explicitly enable/disable colors
   */function useColors(){// NB: In an Electron preload script, document will be defined but not fully
// initialized. Since we know we're in Chrome, we'll just detect this case
// explicitly
if(typeof window!=='undefined'&&window.process&&window.process.type==='renderer'){return true;}// Internet Explorer and Edge do not support colors.
if(typeof navigator!=='undefined'&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)){return false;}// is webkit? http://stackoverflow.com/a/16459606/376773
// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
return typeof document!=='undefined'&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||// is firebug? http://stackoverflow.com/a/398120/376773
typeof window!=='undefined'&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||// is firefox >= v31?
// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
typeof navigator!=='undefined'&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||// double check webkit in userAgent just in case we are in a worker
typeof navigator!=='undefined'&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);}/**
   * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
   */exports.formatters.j=function(v){try{return JSON.stringify(v);}catch(err){return'[UnexpectedJSONParseError]: '+err.message;}};/**
   * Colorize log arguments if enabled.
   *
   * @api public
   */function formatArgs(args){var useColors=this.useColors;args[0]=(useColors?'%c':'')+this.namespace+(useColors?' %c':' ')+args[0]+(useColors?'%c ':' ')+'+'+exports.humanize(this.diff);if(!useColors)return;var c='color: '+this.color;args.splice(1,0,c,'color: inherit');// the final "%c" is somewhat tricky, because there could be other
// arguments passed either before or after the %c, so we need to
// figure out the correct index to insert the CSS into
var index=0;var lastC=0;args[0].replace(/%[a-zA-Z%]/g,function(match){if('%%'===match)return;index++;if('%c'===match){// we only are interested in the *last* %c
// (the user may have provided their own)
lastC=index;}});args.splice(lastC,0,c);}/**
   * Invokes `console.log()` when available.
   * No-op when `console.log` is not a "function".
   *
   * @api public
   */function log(){// this hackery is required for IE8/9, where
// the `console.log` function doesn't have 'apply'
return'object'===(typeof console==="undefined"?"undefined":_typeof2(console))&&console.log&&Function.prototype.apply.call(console.log,console,arguments);}/**
   * Save `namespaces`.
   *
   * @param {String} namespaces
   * @api private
   */function save(namespaces){try{if(null==namespaces){exports.storage.removeItem('debug');}else{exports.storage.debug=namespaces;}}catch(e){}}/**
   * Load `namespaces`.
   *
   * @return {String} returns the previously persisted debug modes
   * @api private
   */function load(){var r;try{r=exports.storage.debug;}catch(e){}// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
if(!r&&typeof process!=='undefined'&&'env'in process){r=process.env.DEBUG;}return r;}/**
   * Enable namespaces listed in `localStorage.debug` initially.
   */exports.enable(load());/**
   * Localstorage attempts to return the localstorage.
   *
   * This is necessary because safari throws
   * when a user disables cookies/localstorage
   * and you attempt to access it.
   *
   * @return {LocalStorage}
   * @api private
   */function localstorage(){try{return window.localStorage;}catch(e){}}});var browser_1$1=browser$1.log;var browser_2$1=browser$1.formatArgs;var browser_3$1=browser$1.save;var browser_4$1=browser$1.load;var browser_5$1=browser$1.useColors;var browser_6$1=browser$1.storage;var browser_7$1=browser$1.colors;var componentEmitter=createCommonjsModule(function(module){/**
   * Expose `Emitter`.
   */{module.exports=Emitter;}/**
   * Initialize a new `Emitter`.
   *
   * @api public
   */function Emitter(obj){if(obj)return mixin(obj);}/**
   * Mixin the emitter properties.
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */function mixin(obj){for(var key in Emitter.prototype){obj[key]=Emitter.prototype[key];}return obj;}/**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */Emitter.prototype.on=Emitter.prototype.addEventListener=function(event,fn){this._callbacks=this._callbacks||{};(this._callbacks['$'+event]=this._callbacks['$'+event]||[]).push(fn);return this;};/**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */Emitter.prototype.once=function(event,fn){function on(){this.off(event,on);fn.apply(this,arguments);}on.fn=fn;this.on(event,on);return this;};/**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */Emitter.prototype.off=Emitter.prototype.removeListener=Emitter.prototype.removeAllListeners=Emitter.prototype.removeEventListener=function(event,fn){this._callbacks=this._callbacks||{};// all
if(0==arguments.length){this._callbacks={};return this;}// specific event
var callbacks=this._callbacks['$'+event];if(!callbacks)return this;// remove all handlers
if(1==arguments.length){delete this._callbacks['$'+event];return this;}// remove specific handler
var cb;for(var i=0;i<callbacks.length;i++){cb=callbacks[i];if(cb===fn||cb.fn===fn){callbacks.splice(i,1);break;}}return this;};/**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   * @return {Emitter}
   */Emitter.prototype.emit=function(event){this._callbacks=this._callbacks||{};var args=[].slice.call(arguments,1),callbacks=this._callbacks['$'+event];if(callbacks){callbacks=callbacks.slice(0);for(var i=0,len=callbacks.length;i<len;++i){callbacks[i].apply(this,args);}}return this;};/**
   * Return array of callbacks for `event`.
   *
   * @param {String} event
   * @return {Array}
   * @api public
   */Emitter.prototype.listeners=function(event){this._callbacks=this._callbacks||{};return this._callbacks['$'+event]||[];};/**
   * Check if this emitter has `event` handlers.
   *
   * @param {String} event
   * @return {Boolean}
   * @api public
   */Emitter.prototype.hasListeners=function(event){return!!this.listeners(event).length;};});var toString={}.toString;var isarray=Array.isArray||function(arr){return toString.call(arr)=='[object Array]';};var isBuffer=isBuf;var withNativeBuffer=typeof commonjsGlobal.Buffer==='function'&&typeof commonjsGlobal.Buffer.isBuffer==='function';var withNativeArrayBuffer=typeof commonjsGlobal.ArrayBuffer==='function';var isView=function(){if(withNativeArrayBuffer&&typeof commonjsGlobal.ArrayBuffer.isView==='function'){return commonjsGlobal.ArrayBuffer.isView;}else{return function(obj){return obj.buffer instanceof commonjsGlobal.ArrayBuffer;};}}();/**
   * Returns true if obj is a buffer or an arraybuffer.
   *
   * @api private
   */function isBuf(obj){return withNativeBuffer&&commonjsGlobal.Buffer.isBuffer(obj)||withNativeArrayBuffer&&(obj instanceof commonjsGlobal.ArrayBuffer||isView(obj));}/*global Blob,File*/ /**
   * Module requirements
   */var toString$1=Object.prototype.toString;var withNativeBlob=typeof commonjsGlobal.Blob==='function'||toString$1.call(commonjsGlobal.Blob)==='[object BlobConstructor]';var withNativeFile=typeof commonjsGlobal.File==='function'||toString$1.call(commonjsGlobal.File)==='[object FileConstructor]';/**
   * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
   * Anything with blobs or files should be fed through removeBlobs before coming
   * here.
   *
   * @param {Object} packet - socket.io event packet
   * @return {Object} with deconstructed packet and list of buffers
   * @api public
   */var deconstructPacket=function deconstructPacket(packet){var buffers=[];var packetData=packet.data;var pack=packet;pack.data=_deconstructPacket(packetData,buffers);pack.attachments=buffers.length;// number of binary 'attachments'
return{packet:pack,buffers:buffers};};function _deconstructPacket(data,buffers){if(!data)return data;if(isBuffer(data)){var placeholder={_placeholder:true,num:buffers.length};buffers.push(data);return placeholder;}else if(isarray(data)){var newData=new Array(data.length);for(var i=0;i<data.length;i++){newData[i]=_deconstructPacket(data[i],buffers);}return newData;}else if(_typeof2(data)==='object'&&!(data instanceof Date)){var newData={};for(var key in data){newData[key]=_deconstructPacket(data[key],buffers);}return newData;}return data;}/**
   * Reconstructs a binary packet from its placeholder packet and buffers
   *
   * @param {Object} packet - event packet with placeholders
   * @param {Array} buffers - binary buffers to put in placeholder positions
   * @return {Object} reconstructed packet
   * @api public
   */var reconstructPacket=function reconstructPacket(packet,buffers){packet.data=_reconstructPacket(packet.data,buffers);packet.attachments=undefined;// no longer useful
return packet;};function _reconstructPacket(data,buffers){if(!data)return data;if(data&&data._placeholder){return buffers[data.num];// appropriate buffer (should be natural order anyway)
}else if(isarray(data)){for(var i=0;i<data.length;i++){data[i]=_reconstructPacket(data[i],buffers);}}else if(_typeof2(data)==='object'){for(var key in data){data[key]=_reconstructPacket(data[key],buffers);}}return data;}/**
   * Asynchronously removes Blobs or Files from data via
   * FileReader's readAsArrayBuffer method. Used before encoding
   * data as msgpack. Calls callback with the blobless data.
   *
   * @param {Object} data
   * @param {Function} callback
   * @api private
   */var removeBlobs=function removeBlobs(data,callback){function _removeBlobs(obj,curKey,containingObject){if(!obj)return obj;// convert any blob
if(withNativeBlob&&obj instanceof Blob||withNativeFile&&obj instanceof File){pendingBlobs++;// async filereader
var fileReader=new FileReader();fileReader.onload=function(){// this.result == arraybuffer
if(containingObject){containingObject[curKey]=this.result;}else{bloblessData=this.result;}// if nothing pending its callback time
if(! --pendingBlobs){callback(bloblessData);}};fileReader.readAsArrayBuffer(obj);// blob -> arraybuffer
}else if(isarray(obj)){// handle array
for(var i=0;i<obj.length;i++){_removeBlobs(obj[i],i,obj);}}else if(_typeof2(obj)==='object'&&!isBuffer(obj)){// and object
for(var key in obj){_removeBlobs(obj[key],key,obj);}}}var pendingBlobs=0;var bloblessData=data;_removeBlobs(bloblessData);if(!pendingBlobs){callback(bloblessData);}};var binary={deconstructPacket:deconstructPacket,reconstructPacket:reconstructPacket,removeBlobs:removeBlobs};var socket_ioParser=createCommonjsModule(function(module,exports){/**
   * Module dependencies.
   */var debug=browser$1('socket.io-parser');/**
   * Protocol version.
   *
   * @api public
   */exports.protocol=4;/**
   * Packet types.
   *
   * @api public
   */exports.types=['CONNECT','DISCONNECT','EVENT','ACK','ERROR','BINARY_EVENT','BINARY_ACK'];/**
   * Packet type `connect`.
   *
   * @api public
   */exports.CONNECT=0;/**
   * Packet type `disconnect`.
   *
   * @api public
   */exports.DISCONNECT=1;/**
   * Packet type `event`.
   *
   * @api public
   */exports.EVENT=2;/**
   * Packet type `ack`.
   *
   * @api public
   */exports.ACK=3;/**
   * Packet type `error`.
   *
   * @api public
   */exports.ERROR=4;/**
   * Packet type 'binary event'
   *
   * @api public
   */exports.BINARY_EVENT=5;/**
   * Packet type `binary ack`. For acks with binary arguments.
   *
   * @api public
   */exports.BINARY_ACK=6;/**
   * Encoder constructor.
   *
   * @api public
   */exports.Encoder=Encoder;/**
   * Decoder constructor.
   *
   * @api public
   */exports.Decoder=Decoder;/**
   * A socket.io Encoder instance
   *
   * @api public
   */function Encoder(){}var ERROR_PACKET=exports.ERROR+'"encode error"';/**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   * @param {Function} callback - function to handle encodings (likely engine.write)
   * @return Calls callback with Array of encodings
   * @api public
   */Encoder.prototype.encode=function(obj,callback){debug('encoding packet %j',obj);if(exports.BINARY_EVENT===obj.type||exports.BINARY_ACK===obj.type){encodeAsBinary(obj,callback);}else{var encoding=encodeAsString(obj);callback([encoding]);}};/**
   * Encode packet as string.
   *
   * @param {Object} packet
   * @return {String} encoded
   * @api private
   */function encodeAsString(obj){// first is type
var str=''+obj.type;// attachments if we have them
if(exports.BINARY_EVENT===obj.type||exports.BINARY_ACK===obj.type){str+=obj.attachments+'-';}// if we have a namespace other than `/`
// we append it followed by a comma `,`
if(obj.nsp&&'/'!==obj.nsp){str+=obj.nsp+',';}// immediately followed by the id
if(null!=obj.id){str+=obj.id;}// json data
if(null!=obj.data){var payload=tryStringify(obj.data);if(payload!==false){str+=payload;}else{return ERROR_PACKET;}}debug('encoded %j as %s',obj,str);return str;}function tryStringify(str){try{return JSON.stringify(str);}catch(e){return false;}}/**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   *
   * @param {Object} packet
   * @return {Buffer} encoded
   * @api private
   */function encodeAsBinary(obj,callback){function writeEncoding(bloblessData){var deconstruction=binary.deconstructPacket(bloblessData);var pack=encodeAsString(deconstruction.packet);var buffers=deconstruction.buffers;buffers.unshift(pack);// add packet info to beginning of data list
callback(buffers);// write all the buffers
}binary.removeBlobs(obj,writeEncoding);}/**
   * A socket.io Decoder instance
   *
   * @return {Object} decoder
   * @api public
   */function Decoder(){this.reconstructor=null;}/**
   * Mix in `Emitter` with Decoder.
   */componentEmitter(Decoder.prototype);/**
   * Decodes an ecoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   * @return {Object} packet
   * @api public
   */Decoder.prototype.add=function(obj){var packet;if(typeof obj==='string'){packet=decodeString(obj);if(exports.BINARY_EVENT===packet.type||exports.BINARY_ACK===packet.type){// binary packet's json
this.reconstructor=new BinaryReconstructor(packet);// no attachments, labeled binary but no binary data to follow
if(this.reconstructor.reconPack.attachments===0){this.emit('decoded',packet);}}else{// non-binary full packet
this.emit('decoded',packet);}}else if(isBuffer(obj)||obj.base64){// raw binary data
if(!this.reconstructor){throw new Error('got binary data when not reconstructing a packet');}else{packet=this.reconstructor.takeBinaryData(obj);if(packet){// received final buffer
this.reconstructor=null;this.emit('decoded',packet);}}}else{throw new Error('Unknown type: '+obj);}};/**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   * @api private
   */function decodeString(str){var i=0;// look up type
var p={type:Number(str.charAt(0))};if(null==exports.types[p.type]){return error('unknown packet type '+p.type);}// look up attachments if type binary
if(exports.BINARY_EVENT===p.type||exports.BINARY_ACK===p.type){var buf='';while(str.charAt(++i)!=='-'){buf+=str.charAt(i);if(i==str.length)break;}if(buf!=Number(buf)||str.charAt(i)!=='-'){throw new Error('Illegal attachments');}p.attachments=Number(buf);}// look up namespace (if any)
if('/'===str.charAt(i+1)){p.nsp='';while(++i){var c=str.charAt(i);if(','===c)break;p.nsp+=c;if(i===str.length)break;}}else{p.nsp='/';}// look up id
var next=str.charAt(i+1);if(''!==next&&Number(next)==next){p.id='';while(++i){var c=str.charAt(i);if(null==c||Number(c)!=c){--i;break;}p.id+=str.charAt(i);if(i===str.length)break;}p.id=Number(p.id);}// look up json data
if(str.charAt(++i)){var payload=tryParse(str.substr(i));var isPayloadValid=payload!==false&&(p.type===exports.ERROR||isarray(payload));if(isPayloadValid){p.data=payload;}else{return error('invalid payload');}}debug('decoded %s as %j',str,p);return p;}function tryParse(str){try{return JSON.parse(str);}catch(e){return false;}}/**
   * Deallocates a parser's resources
   *
   * @api public
   */Decoder.prototype.destroy=function(){if(this.reconstructor){this.reconstructor.finishedReconstruction();}};/**
   * A manager of a binary event's 'buffer sequence'. Should
   * be constructed whenever a packet of type BINARY_EVENT is
   * decoded.
   *
   * @param {Object} packet
   * @return {BinaryReconstructor} initialized reconstructor
   * @api private
   */function BinaryReconstructor(packet){this.reconPack=packet;this.buffers=[];}/**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   * @api private
   */BinaryReconstructor.prototype.takeBinaryData=function(binData){this.buffers.push(binData);if(this.buffers.length===this.reconPack.attachments){// done with buffer list
var packet=binary.reconstructPacket(this.reconPack,this.buffers);this.finishedReconstruction();return packet;}return null;};/**
   * Cleans up binary packet reconstruction variables.
   *
   * @api private
   */BinaryReconstructor.prototype.finishedReconstruction=function(){this.reconPack=null;this.buffers=[];};function error(msg){return{type:exports.ERROR,data:'parser error: '+msg};}});var socket_ioParser_1=socket_ioParser.protocol;var socket_ioParser_2=socket_ioParser.types;var socket_ioParser_3=socket_ioParser.CONNECT;var socket_ioParser_4=socket_ioParser.DISCONNECT;var socket_ioParser_5=socket_ioParser.EVENT;var socket_ioParser_6=socket_ioParser.ACK;var socket_ioParser_7=socket_ioParser.ERROR;var socket_ioParser_8=socket_ioParser.BINARY_EVENT;var socket_ioParser_9=socket_ioParser.BINARY_ACK;var socket_ioParser_10=socket_ioParser.Encoder;var socket_ioParser_11=socket_ioParser.Decoder;var hasCors=createCommonjsModule(function(module){/**
   * Module exports.
   *
   * Logic borrowed from Modernizr:
   *
   *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
   */try{module.exports=typeof XMLHttpRequest!=='undefined'&&'withCredentials'in new XMLHttpRequest();}catch(err){// if XMLHttp support is disabled in IE then it will throw
// when trying to create
module.exports=false;}});// browser shim for xmlhttprequest module
var xmlhttprequest=function xmlhttprequest(opts){var xdomain=opts.xdomain;// scheme must be same when usign XDomainRequest
// http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
var xscheme=opts.xscheme;// XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
// https://github.com/Automattic/engine.io-client/pull/217
var enablesXDR=opts.enablesXDR;// XMLHttpRequest can be disabled on IE
try{if('undefined'!==typeof XMLHttpRequest&&(!xdomain||hasCors)){return new XMLHttpRequest();}}catch(e){}// Use XDomainRequest for IE8 if enablesXDR is true
// because loading bar keeps flashing when using jsonp-polling
// https://github.com/yujiosaka/socke.io-ie8-loading-example
try{if('undefined'!==typeof XDomainRequest&&!xscheme&&enablesXDR){return new XDomainRequest();}}catch(e){}if(!xdomain){try{return new commonjsGlobal[['Active'].concat('Object').join('X')]('Microsoft.XMLHTTP');}catch(e){}}};/**
   * Gets the keys for an object.
   *
   * @return {Array} keys
   * @api private
   */var keys$2=Object.keys||function keys(obj){var arr=[];var has=Object.prototype.hasOwnProperty;for(var i in obj){if(has.call(obj,i)){arr.push(i);}}return arr;};var toString$2={}.toString;var isarray$1=Array.isArray||function(arr){return toString$2.call(arr)=='[object Array]';};/* global Blob File */ /*
   * Module requirements.
   */var toString$3=Object.prototype.toString;var withNativeBlob$1=typeof Blob==='function'||typeof Blob!=='undefined'&&toString$3.call(Blob)==='[object BlobConstructor]';var withNativeFile$1=typeof File==='function'||typeof File!=='undefined'&&toString$3.call(File)==='[object FileConstructor]';/**
   * Module exports.
   */var hasBinary2=hasBinary;/**
   * Checks for binary data.
   *
   * Supports Buffer, ArrayBuffer, Blob and File.
   *
   * @param {Object} anything
   * @api public
   */function hasBinary(obj){if(!obj||_typeof2(obj)!=='object'){return false;}if(isarray$1(obj)){for(var i=0,l=obj.length;i<l;i++){if(hasBinary(obj[i])){return true;}}return false;}if(typeof Buffer==='function'&&Buffer.isBuffer&&Buffer.isBuffer(obj)||typeof ArrayBuffer==='function'&&obj instanceof ArrayBuffer||withNativeBlob$1&&obj instanceof Blob||withNativeFile$1&&obj instanceof File){return true;}// see: https://github.com/Automattic/has-binary/pull/4
if(obj.toJSON&&typeof obj.toJSON==='function'&&arguments.length===1){return hasBinary(obj.toJSON(),true);}for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)&&hasBinary(obj[key])){return true;}}return false;}/**
   * An abstraction for slicing an arraybuffer even when
   * ArrayBuffer.prototype.slice is not supported
   *
   * @api public
   */var arraybuffer_slice=function arraybuffer_slice(arraybuffer,start,end){var bytes=arraybuffer.byteLength;start=start||0;end=end||bytes;if(arraybuffer.slice){return arraybuffer.slice(start,end);}if(start<0){start+=bytes;}if(end<0){end+=bytes;}if(end>bytes){end=bytes;}if(start>=bytes||start>=end||bytes===0){return new ArrayBuffer(0);}var abv=new Uint8Array(arraybuffer);var result=new Uint8Array(end-start);for(var i=start,ii=0;i<end;i++,ii++){result[ii]=abv[i];}return result.buffer;};var after_1=after;function after(count,callback,err_cb){var bail=false;err_cb=err_cb||noop$1;proxy.count=count;return count===0?callback():proxy;function proxy(err,result){if(proxy.count<=0){throw new Error('after called too many times');}--proxy.count;// after first error, rest are passed to err_cb
if(err){bail=true;callback(err);// future error callbacks will go to error handler
callback=err_cb;}else if(proxy.count===0&&!bail){callback(null,result);}}}function noop$1(){}var utf8=createCommonjsModule(function(module,exports){(function(root){// Detect free variables `exports`
var freeExports=exports;// Detect free variable `module`
var freeModule=module&&module.exports==freeExports&&module;// Detect free variable `global`, from Node.js or Browserified code,
// and use it as `root`
var freeGlobal=_typeof2(commonjsGlobal)=='object'&&commonjsGlobal;if(freeGlobal.global===freeGlobal||freeGlobal.window===freeGlobal){root=freeGlobal;}/*--------------------------------------------------------------------------*/var stringFromCharCode=String.fromCharCode;// Taken from https://mths.be/punycode
function ucs2decode(string){var output=[];var counter=0;var length=string.length;var value;var extra;while(counter<length){value=string.charCodeAt(counter++);if(value>=0xD800&&value<=0xDBFF&&counter<length){// high surrogate, and there is a next character
extra=string.charCodeAt(counter++);if((extra&0xFC00)==0xDC00){// low surrogate
output.push(((value&0x3FF)<<10)+(extra&0x3FF)+0x10000);}else{// unmatched surrogate; only append this code unit, in case the next
// code unit is the high surrogate of a surrogate pair
output.push(value);counter--;}}else{output.push(value);}}return output;}// Taken from https://mths.be/punycode
function ucs2encode(array){var length=array.length;var index=-1;var value;var output='';while(++index<length){value=array[index];if(value>0xFFFF){value-=0x10000;output+=stringFromCharCode(value>>>10&0x3FF|0xD800);value=0xDC00|value&0x3FF;}output+=stringFromCharCode(value);}return output;}function checkScalarValue(codePoint,strict){if(codePoint>=0xD800&&codePoint<=0xDFFF){if(strict){throw Error('Lone surrogate U+'+codePoint.toString(16).toUpperCase()+' is not a scalar value');}return false;}return true;}/*--------------------------------------------------------------------------*/function createByte(codePoint,shift){return stringFromCharCode(codePoint>>shift&0x3F|0x80);}function encodeCodePoint(codePoint,strict){if((codePoint&0xFFFFFF80)==0){// 1-byte sequence
return stringFromCharCode(codePoint);}var symbol='';if((codePoint&0xFFFFF800)==0){// 2-byte sequence
symbol=stringFromCharCode(codePoint>>6&0x1F|0xC0);}else if((codePoint&0xFFFF0000)==0){// 3-byte sequence
if(!checkScalarValue(codePoint,strict)){codePoint=0xFFFD;}symbol=stringFromCharCode(codePoint>>12&0x0F|0xE0);symbol+=createByte(codePoint,6);}else if((codePoint&0xFFE00000)==0){// 4-byte sequence
symbol=stringFromCharCode(codePoint>>18&0x07|0xF0);symbol+=createByte(codePoint,12);symbol+=createByte(codePoint,6);}symbol+=stringFromCharCode(codePoint&0x3F|0x80);return symbol;}function utf8encode(string,opts){opts=opts||{};var strict=false!==opts.strict;var codePoints=ucs2decode(string);var length=codePoints.length;var index=-1;var codePoint;var byteString='';while(++index<length){codePoint=codePoints[index];byteString+=encodeCodePoint(codePoint,strict);}return byteString;}/*--------------------------------------------------------------------------*/function readContinuationByte(){if(byteIndex>=byteCount){throw Error('Invalid byte index');}var continuationByte=byteArray[byteIndex]&0xFF;byteIndex++;if((continuationByte&0xC0)==0x80){return continuationByte&0x3F;}// If we end up here, it’s not a continuation byte
throw Error('Invalid continuation byte');}function decodeSymbol(strict){var byte1;var byte2;var byte3;var byte4;var codePoint;if(byteIndex>byteCount){throw Error('Invalid byte index');}if(byteIndex==byteCount){return false;}// Read first byte
byte1=byteArray[byteIndex]&0xFF;byteIndex++;// 1-byte sequence (no continuation bytes)
if((byte1&0x80)==0){return byte1;}// 2-byte sequence
if((byte1&0xE0)==0xC0){byte2=readContinuationByte();codePoint=(byte1&0x1F)<<6|byte2;if(codePoint>=0x80){return codePoint;}else{throw Error('Invalid continuation byte');}}// 3-byte sequence (may include unpaired surrogates)
if((byte1&0xF0)==0xE0){byte2=readContinuationByte();byte3=readContinuationByte();codePoint=(byte1&0x0F)<<12|byte2<<6|byte3;if(codePoint>=0x0800){return checkScalarValue(codePoint,strict)?codePoint:0xFFFD;}else{throw Error('Invalid continuation byte');}}// 4-byte sequence
if((byte1&0xF8)==0xF0){byte2=readContinuationByte();byte3=readContinuationByte();byte4=readContinuationByte();codePoint=(byte1&0x07)<<0x12|byte2<<0x0C|byte3<<0x06|byte4;if(codePoint>=0x010000&&codePoint<=0x10FFFF){return codePoint;}}throw Error('Invalid UTF-8 detected');}var byteArray;var byteCount;var byteIndex;function utf8decode(byteString,opts){opts=opts||{};var strict=false!==opts.strict;byteArray=ucs2decode(byteString);byteCount=byteArray.length;byteIndex=0;var codePoints=[];var tmp;while((tmp=decodeSymbol(strict))!==false){codePoints.push(tmp);}return ucs2encode(codePoints);}/*--------------------------------------------------------------------------*/var utf8={'version':'2.1.2','encode':utf8encode,'decode':utf8decode};// Some AMD build optimizers, like r.js, check for specific condition patterns
// like the following:
if(freeExports&&!freeExports.nodeType){if(freeModule){// in Node.js or RingoJS v0.8.0+
freeModule.exports=utf8;}else{// in Narwhal or RingoJS v0.7.0-
var object={};var hasOwnProperty=object.hasOwnProperty;for(var key in utf8){hasOwnProperty.call(utf8,key)&&(freeExports[key]=utf8[key]);}}}else{// in Rhino or a web browser
root.utf8=utf8;}})(commonjsGlobal);});var base64Arraybuffer=createCommonjsModule(function(module,exports){/*
   * base64-arraybuffer
   * https://github.com/niklasvh/base64-arraybuffer
   *
   * Copyright (c) 2012 Niklas von Hertzen
   * Licensed under the MIT license.
   */(function(){var chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";// Use a lookup table to find the index.
var lookup=new Uint8Array(256);for(var i=0;i<chars.length;i++){lookup[chars.charCodeAt(i)]=i;}exports.encode=function(arraybuffer){var bytes=new Uint8Array(arraybuffer),i,len=bytes.length,base64="";for(i=0;i<len;i+=3){base64+=chars[bytes[i]>>2];base64+=chars[(bytes[i]&3)<<4|bytes[i+1]>>4];base64+=chars[(bytes[i+1]&15)<<2|bytes[i+2]>>6];base64+=chars[bytes[i+2]&63];}if(len%3===2){base64=base64.substring(0,base64.length-1)+"=";}else if(len%3===1){base64=base64.substring(0,base64.length-2)+"==";}return base64;};exports.decode=function(base64){var bufferLength=base64.length*0.75,len=base64.length,i,p=0,encoded1,encoded2,encoded3,encoded4;if(base64[base64.length-1]==="="){bufferLength--;if(base64[base64.length-2]==="="){bufferLength--;}}var arraybuffer=new ArrayBuffer(bufferLength),bytes=new Uint8Array(arraybuffer);for(i=0;i<len;i+=4){encoded1=lookup[base64.charCodeAt(i)];encoded2=lookup[base64.charCodeAt(i+1)];encoded3=lookup[base64.charCodeAt(i+2)];encoded4=lookup[base64.charCodeAt(i+3)];bytes[p++]=encoded1<<2|encoded2>>4;bytes[p++]=(encoded2&15)<<4|encoded3>>2;bytes[p++]=(encoded3&3)<<6|encoded4&63;}return arraybuffer;};})();});var base64Arraybuffer_1=base64Arraybuffer.encode;var base64Arraybuffer_2=base64Arraybuffer.decode;/**
   * Create a blob builder even when vendor prefixes exist
   */var BlobBuilder=commonjsGlobal.BlobBuilder||commonjsGlobal.WebKitBlobBuilder||commonjsGlobal.MSBlobBuilder||commonjsGlobal.MozBlobBuilder;/**
   * Check if Blob constructor is supported
   */var blobSupported=function(){try{var a=new Blob(['hi']);return a.size===2;}catch(e){return false;}}();/**
   * Check if Blob constructor supports ArrayBufferViews
   * Fails in Safari 6, so we need to map to ArrayBuffers there.
   */var blobSupportsArrayBufferView=blobSupported&&function(){try{var b=new Blob([new Uint8Array([1,2])]);return b.size===2;}catch(e){return false;}}();/**
   * Check if BlobBuilder is supported
   */var blobBuilderSupported=BlobBuilder&&BlobBuilder.prototype.append&&BlobBuilder.prototype.getBlob;/**
   * Helper function that maps ArrayBufferViews to ArrayBuffers
   * Used by BlobBuilder constructor and old browsers that didn't
   * support it in the Blob constructor.
   */function mapArrayBufferViews(ary){for(var i=0;i<ary.length;i++){var chunk=ary[i];if(chunk.buffer instanceof ArrayBuffer){var buf=chunk.buffer;// if this is a subarray, make a copy so we only
// include the subarray region from the underlying buffer
if(chunk.byteLength!==buf.byteLength){var copy=new Uint8Array(chunk.byteLength);copy.set(new Uint8Array(buf,chunk.byteOffset,chunk.byteLength));buf=copy.buffer;}ary[i]=buf;}}}function BlobBuilderConstructor(ary,options){options=options||{};var bb=new BlobBuilder();mapArrayBufferViews(ary);for(var i=0;i<ary.length;i++){bb.append(ary[i]);}return options.type?bb.getBlob(options.type):bb.getBlob();}function BlobConstructor(ary,options){mapArrayBufferViews(ary);return new Blob(ary,options||{});}var blob=function(){if(blobSupported){return blobSupportsArrayBufferView?commonjsGlobal.Blob:BlobConstructor;}else if(blobBuilderSupported){return BlobBuilderConstructor;}else{return undefined;}}();var browser$2=createCommonjsModule(function(module,exports){/**
   * Module dependencies.
   */var base64encoder;if(commonjsGlobal&&commonjsGlobal.ArrayBuffer){base64encoder=base64Arraybuffer;}/**
   * Check if we are running an android browser. That requires us to use
   * ArrayBuffer with polling transports...
   *
   * http://ghinda.net/jpeg-blob-ajax-android/
   */var isAndroid=typeof navigator!=='undefined'&&/Android/i.test(navigator.userAgent);/**
   * Check if we are running in PhantomJS.
   * Uploading a Blob with PhantomJS does not work correctly, as reported here:
   * https://github.com/ariya/phantomjs/issues/11395
   * @type boolean
   */var isPhantomJS=typeof navigator!=='undefined'&&/PhantomJS/i.test(navigator.userAgent);/**
   * When true, avoids using Blobs to encode payloads.
   * @type boolean
   */var dontSendBlobs=isAndroid||isPhantomJS;/**
   * Current protocol version.
   */exports.protocol=3;/**
   * Packet types.
   */var packets=exports.packets={open:0// non-ws
,close:1// non-ws
,ping:2,pong:3,message:4,upgrade:5,noop:6};var packetslist=keys$2(packets);/**
   * Premade error packet.
   */var err={type:'error',data:'parser error'};/**
   * Create a blob api even for blob builder when vendor prefixes exist
   */ /**
   * Encodes a packet.
   *
   *     <packet type id> [ <data> ]
   *
   * Example:
   *
   *     5hello world
   *     3
   *     4
   *
   * Binary is encoded in an identical principle
   *
   * @api private
   */exports.encodePacket=function(packet,supportsBinary,utf8encode,callback){if(typeof supportsBinary==='function'){callback=supportsBinary;supportsBinary=false;}if(typeof utf8encode==='function'){callback=utf8encode;utf8encode=null;}var data=packet.data===undefined?undefined:packet.data.buffer||packet.data;if(commonjsGlobal.ArrayBuffer&&data instanceof ArrayBuffer){return encodeArrayBuffer(packet,supportsBinary,callback);}else if(blob&&data instanceof commonjsGlobal.Blob){return encodeBlob(packet,supportsBinary,callback);}// might be an object with { base64: true, data: dataAsBase64String }
if(data&&data.base64){return encodeBase64Object(packet,callback);}// Sending data as a utf-8 string
var encoded=packets[packet.type];// data fragment is optional
if(undefined!==packet.data){encoded+=utf8encode?utf8.encode(String(packet.data),{strict:false}):String(packet.data);}return callback(''+encoded);};function encodeBase64Object(packet,callback){// packet data is an object { base64: true, data: dataAsBase64String }
var message='b'+exports.packets[packet.type]+packet.data.data;return callback(message);}/**
   * Encode packet helpers for binary types
   */function encodeArrayBuffer(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback);}var data=packet.data;var contentArray=new Uint8Array(data);var resultBuffer=new Uint8Array(1+data.byteLength);resultBuffer[0]=packets[packet.type];for(var i=0;i<contentArray.length;i++){resultBuffer[i+1]=contentArray[i];}return callback(resultBuffer.buffer);}function encodeBlobAsArrayBuffer(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback);}var fr=new FileReader();fr.onload=function(){packet.data=fr.result;exports.encodePacket(packet,supportsBinary,true,callback);};return fr.readAsArrayBuffer(packet.data);}function encodeBlob(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback);}if(dontSendBlobs){return encodeBlobAsArrayBuffer(packet,supportsBinary,callback);}var length=new Uint8Array(1);length[0]=packets[packet.type];var blob$1=new blob([length.buffer,packet.data]);return callback(blob$1);}/**
   * Encodes a packet with binary data in a base64 string
   *
   * @param {Object} packet, has `type` and `data`
   * @return {String} base64 encoded message
   */exports.encodeBase64Packet=function(packet,callback){var message='b'+exports.packets[packet.type];if(blob&&packet.data instanceof commonjsGlobal.Blob){var fr=new FileReader();fr.onload=function(){var b64=fr.result.split(',')[1];callback(message+b64);};return fr.readAsDataURL(packet.data);}var b64data;try{b64data=String.fromCharCode.apply(null,new Uint8Array(packet.data));}catch(e){// iPhone Safari doesn't let you apply with typed arrays
var typed=new Uint8Array(packet.data);var basic=new Array(typed.length);for(var i=0;i<typed.length;i++){basic[i]=typed[i];}b64data=String.fromCharCode.apply(null,basic);}message+=commonjsGlobal.btoa(b64data);return callback(message);};/**
   * Decodes a packet. Changes format to Blob if requested.
   *
   * @return {Object} with `type` and `data` (if any)
   * @api private
   */exports.decodePacket=function(data,binaryType,utf8decode){if(data===undefined){return err;}// String data
if(typeof data==='string'){if(data.charAt(0)==='b'){return exports.decodeBase64Packet(data.substr(1),binaryType);}if(utf8decode){data=tryDecode(data);if(data===false){return err;}}var type=data.charAt(0);if(Number(type)!=type||!packetslist[type]){return err;}if(data.length>1){return{type:packetslist[type],data:data.substring(1)};}else{return{type:packetslist[type]};}}var asArray=new Uint8Array(data);var type=asArray[0];var rest=arraybuffer_slice(data,1);if(blob&&binaryType==='blob'){rest=new blob([rest]);}return{type:packetslist[type],data:rest};};function tryDecode(data){try{data=utf8.decode(data,{strict:false});}catch(e){return false;}return data;}/**
   * Decodes a packet encoded in a base64 string
   *
   * @param {String} base64 encoded message
   * @return {Object} with `type` and `data` (if any)
   */exports.decodeBase64Packet=function(msg,binaryType){var type=packetslist[msg.charAt(0)];if(!base64encoder){return{type:type,data:{base64:true,data:msg.substr(1)}};}var data=base64encoder.decode(msg.substr(1));if(binaryType==='blob'&&blob){data=new blob([data]);}return{type:type,data:data};};/**
   * Encodes multiple messages (payload).
   *
   *     <length>:data
   *
   * Example:
   *
   *     11:hello world2:hi
   *
   * If any contents are binary, they will be encoded as base64 strings. Base64
   * encoded strings are marked with a b before the length specifier
   *
   * @param {Array} packets
   * @api private
   */exports.encodePayload=function(packets,supportsBinary,callback){if(typeof supportsBinary==='function'){callback=supportsBinary;supportsBinary=null;}var isBinary=hasBinary2(packets);if(supportsBinary&&isBinary){if(blob&&!dontSendBlobs){return exports.encodePayloadAsBlob(packets,callback);}return exports.encodePayloadAsArrayBuffer(packets,callback);}if(!packets.length){return callback('0:');}function setLengthHeader(message){return message.length+':'+message;}function encodeOne(packet,doneCallback){exports.encodePacket(packet,!isBinary?false:supportsBinary,false,function(message){doneCallback(null,setLengthHeader(message));});}map(packets,encodeOne,function(err,results){return callback(results.join(''));});};/**
   * Async array map using after
   */function map(ary,each,done){var result=new Array(ary.length);var next=after_1(ary.length,done);var eachWithIndex=function eachWithIndex(i,el,cb){each(el,function(error,msg){result[i]=msg;cb(error,result);});};for(var i=0;i<ary.length;i++){eachWithIndex(i,ary[i],next);}}/*
   * Decodes data when a payload is maybe expected. Possible binary contents are
   * decoded from their base64 representation
   *
   * @param {String} data, callback method
   * @api public
   */exports.decodePayload=function(data,binaryType,callback){if(typeof data!=='string'){return exports.decodePayloadAsBinary(data,binaryType,callback);}if(typeof binaryType==='function'){callback=binaryType;binaryType=null;}var packet;if(data===''){// parser error - ignoring payload
return callback(err,0,1);}var length='',n,msg;for(var i=0,l=data.length;i<l;i++){var chr=data.charAt(i);if(chr!==':'){length+=chr;continue;}if(length===''||length!=(n=Number(length))){// parser error - ignoring payload
return callback(err,0,1);}msg=data.substr(i+1,n);if(length!=msg.length){// parser error - ignoring payload
return callback(err,0,1);}if(msg.length){packet=exports.decodePacket(msg,binaryType,false);if(err.type===packet.type&&err.data===packet.data){// parser error in individual packet - ignoring payload
return callback(err,0,1);}var ret=callback(packet,i+n,l);if(false===ret)return;}// advance cursor
i+=n;length='';}if(length!==''){// parser error - ignoring payload
return callback(err,0,1);}};/**
   * Encodes multiple messages (payload) as binary.
   *
   * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
   * 255><data>
   *
   * Example:
   * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
   *
   * @param {Array} packets
   * @return {ArrayBuffer} encoded payload
   * @api private
   */exports.encodePayloadAsArrayBuffer=function(packets,callback){if(!packets.length){return callback(new ArrayBuffer(0));}function encodeOne(packet,doneCallback){exports.encodePacket(packet,true,true,function(data){return doneCallback(null,data);});}map(packets,encodeOne,function(err,encodedPackets){var totalLength=encodedPackets.reduce(function(acc,p){var len;if(typeof p==='string'){len=p.length;}else{len=p.byteLength;}return acc+len.toString().length+len+2;// string/binary identifier + separator = 2
},0);var resultArray=new Uint8Array(totalLength);var bufferIndex=0;encodedPackets.forEach(function(p){var isString=typeof p==='string';var ab=p;if(isString){var view=new Uint8Array(p.length);for(var i=0;i<p.length;i++){view[i]=p.charCodeAt(i);}ab=view.buffer;}if(isString){// not true binary
resultArray[bufferIndex++]=0;}else{// true binary
resultArray[bufferIndex++]=1;}var lenStr=ab.byteLength.toString();for(var i=0;i<lenStr.length;i++){resultArray[bufferIndex++]=parseInt(lenStr[i]);}resultArray[bufferIndex++]=255;var view=new Uint8Array(ab);for(var i=0;i<view.length;i++){resultArray[bufferIndex++]=view[i];}});return callback(resultArray.buffer);});};/**
   * Encode as Blob
   */exports.encodePayloadAsBlob=function(packets,callback){function encodeOne(packet,doneCallback){exports.encodePacket(packet,true,true,function(encoded){var binaryIdentifier=new Uint8Array(1);binaryIdentifier[0]=1;if(typeof encoded==='string'){var view=new Uint8Array(encoded.length);for(var i=0;i<encoded.length;i++){view[i]=encoded.charCodeAt(i);}encoded=view.buffer;binaryIdentifier[0]=0;}var len=encoded instanceof ArrayBuffer?encoded.byteLength:encoded.size;var lenStr=len.toString();var lengthAry=new Uint8Array(lenStr.length+1);for(var i=0;i<lenStr.length;i++){lengthAry[i]=parseInt(lenStr[i]);}lengthAry[lenStr.length]=255;if(blob){var blob$1=new blob([binaryIdentifier.buffer,lengthAry.buffer,encoded]);doneCallback(null,blob$1);}});}map(packets,encodeOne,function(err,results){return callback(new blob(results));});};/*
   * Decodes data when a payload is maybe expected. Strings are decoded by
   * interpreting each byte as a key code for entries marked to start with 0. See
   * description of encodePayloadAsBinary
   *
   * @param {ArrayBuffer} data, callback method
   * @api public
   */exports.decodePayloadAsBinary=function(data,binaryType,callback){if(typeof binaryType==='function'){callback=binaryType;binaryType=null;}var bufferTail=data;var buffers=[];while(bufferTail.byteLength>0){var tailArray=new Uint8Array(bufferTail);var isString=tailArray[0]===0;var msgLength='';for(var i=1;;i++){if(tailArray[i]===255)break;// 310 = char length of Number.MAX_VALUE
if(msgLength.length>310){return callback(err,0,1);}msgLength+=tailArray[i];}bufferTail=arraybuffer_slice(bufferTail,2+msgLength.length);msgLength=parseInt(msgLength);var msg=arraybuffer_slice(bufferTail,0,msgLength);if(isString){try{msg=String.fromCharCode.apply(null,new Uint8Array(msg));}catch(e){// iPhone Safari doesn't let you apply to typed arrays
var typed=new Uint8Array(msg);msg='';for(var i=0;i<typed.length;i++){msg+=String.fromCharCode(typed[i]);}}}buffers.push(msg);bufferTail=arraybuffer_slice(bufferTail,msgLength);}var total=buffers.length;buffers.forEach(function(buffer,i){callback(exports.decodePacket(buffer,binaryType,true),i,total);});};});var browser_1$2=browser$2.protocol;var browser_2$2=browser$2.packets;var browser_3$2=browser$2.encodePacket;var browser_4$2=browser$2.encodeBase64Packet;var browser_5$2=browser$2.decodePacket;var browser_6$2=browser$2.decodeBase64Packet;var browser_7$2=browser$2.encodePayload;var browser_8=browser$2.decodePayload;var browser_9=browser$2.encodePayloadAsArrayBuffer;var browser_10=browser$2.encodePayloadAsBlob;var browser_11=browser$2.decodePayloadAsBinary;/**
   * Module dependencies.
   */ /**
   * Module exports.
   */var transport=Transport;/**
   * Transport abstract constructor.
   *
   * @param {Object} options.
   * @api private
   */function Transport(opts){this.path=opts.path;this.hostname=opts.hostname;this.port=opts.port;this.secure=opts.secure;this.query=opts.query;this.timestampParam=opts.timestampParam;this.timestampRequests=opts.timestampRequests;this.readyState='';this.agent=opts.agent||false;this.socket=opts.socket;this.enablesXDR=opts.enablesXDR;// SSL options for Node.js client
this.pfx=opts.pfx;this.key=opts.key;this.passphrase=opts.passphrase;this.cert=opts.cert;this.ca=opts.ca;this.ciphers=opts.ciphers;this.rejectUnauthorized=opts.rejectUnauthorized;this.forceNode=opts.forceNode;// other options for Node.js client
this.extraHeaders=opts.extraHeaders;this.localAddress=opts.localAddress;}/**
   * Mix in `Emitter`.
   */componentEmitter(Transport.prototype);/**
   * Emits an error.
   *
   * @param {String} str
   * @return {Transport} for chaining
   * @api public
   */Transport.prototype.onError=function(msg,desc){var err=new Error(msg);err.type='TransportError';err.description=desc;this.emit('error',err);return this;};/**
   * Opens the transport.
   *
   * @api public
   */Transport.prototype.open=function(){if('closed'===this.readyState||''===this.readyState){this.readyState='opening';this.doOpen();}return this;};/**
   * Closes the transport.
   *
   * @api private
   */Transport.prototype.close=function(){if('opening'===this.readyState||'open'===this.readyState){this.doClose();this.onClose();}return this;};/**
   * Sends multiple packets.
   *
   * @param {Array} packets
   * @api private
   */Transport.prototype.send=function(packets){if('open'===this.readyState){this.write(packets);}else{throw new Error('Transport not open');}};/**
   * Called upon open
   *
   * @api private
   */Transport.prototype.onOpen=function(){this.readyState='open';this.writable=true;this.emit('open');};/**
   * Called with data.
   *
   * @param {String} data
   * @api private
   */Transport.prototype.onData=function(data){var packet=browser$2.decodePacket(data,this.socket.binaryType);this.onPacket(packet);};/**
   * Called with a decoded packet.
   */Transport.prototype.onPacket=function(packet){this.emit('packet',packet);};/**
   * Called upon close.
   *
   * @api private
   */Transport.prototype.onClose=function(){this.readyState='closed';this.emit('close');};/**
   * Compiles a querystring
   * Returns string representation of the object
   *
   * @param {Object}
   * @api private
   */var encode=function encode(obj){var str='';for(var i in obj){if(obj.hasOwnProperty(i)){if(str.length)str+='&';str+=encodeURIComponent(i)+'='+encodeURIComponent(obj[i]);}}return str;};/**
   * Parses a simple querystring into an object
   *
   * @param {String} qs
   * @api private
   */var decode=function decode(qs){var qry={};var pairs=qs.split('&');for(var i=0,l=pairs.length;i<l;i++){var pair=pairs[i].split('=');qry[decodeURIComponent(pair[0])]=decodeURIComponent(pair[1]);}return qry;};var parseqs={encode:encode,decode:decode};var componentInherit=function componentInherit(a,b){var fn=function fn(){};fn.prototype=b.prototype;a.prototype=new fn();a.prototype.constructor=a;};var alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''),length=64,map={},seed=0,i=0,prev;/**
   * Return a string representing the specified number.
   *
   * @param {Number} num The number to convert.
   * @returns {String} The string representation of the number.
   * @api public
   */function encode$1(num){var encoded='';do{encoded=alphabet[num%length]+encoded;num=Math.floor(num/length);}while(num>0);return encoded;}/**
   * Return the integer value specified by the given string.
   *
   * @param {String} str The string to convert.
   * @returns {Number} The integer value represented by the string.
   * @api public
   */function decode$1(str){var decoded=0;for(i=0;i<str.length;i++){decoded=decoded*length+map[str.charAt(i)];}return decoded;}/**
   * Yeast: A tiny growing id generator.
   *
   * @returns {String} A unique id.
   * @api public
   */function yeast(){var now=encode$1(+new Date());if(now!==prev)return seed=0,prev=now;return now+'.'+encode$1(seed++);}//
// Map each character to its index.
//
for(;i<length;i++){map[alphabet[i]]=i;}//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode=encode$1;yeast.decode=decode$1;var yeast_1=yeast;var debug$3=createCommonjsModule(function(module,exports){/**
   * This is the common logic for both the Node.js and web browser
   * implementations of `debug()`.
   *
   * Expose `debug()` as the module.
   */exports=module.exports=createDebug.debug=createDebug['default']=createDebug;exports.coerce=coerce;exports.disable=disable;exports.enable=enable;exports.enabled=enabled;exports.humanize=ms;/**
   * Active `debug` instances.
   */exports.instances=[];/**
   * The currently active debug mode names, and names to skip.
   */exports.names=[];exports.skips=[];/**
   * Map of special "%n" handling functions, for the debug "format" argument.
   *
   * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
   */exports.formatters={};/**
   * Select a color.
   * @param {String} namespace
   * @return {Number}
   * @api private
   */function selectColor(namespace){var hash=0,i;for(i in namespace){hash=(hash<<5)-hash+namespace.charCodeAt(i);hash|=0;// Convert to 32bit integer
}return exports.colors[Math.abs(hash)%exports.colors.length];}/**
   * Create a debugger with the given `namespace`.
   *
   * @param {String} namespace
   * @return {Function}
   * @api public
   */function createDebug(namespace){var prevTime;function debug(){// disabled?
if(!debug.enabled)return;var self=debug;// set `diff` timestamp
var curr=+new Date();var ms=curr-(prevTime||curr);self.diff=ms;self.prev=prevTime;self.curr=curr;prevTime=curr;// turn the `arguments` into a proper Array
var args=new Array(arguments.length);for(var i=0;i<args.length;i++){args[i]=arguments[i];}args[0]=exports.coerce(args[0]);if('string'!==typeof args[0]){// anything else let's inspect with %O
args.unshift('%O');}// apply any `formatters` transformations
var index=0;args[0]=args[0].replace(/%([a-zA-Z%])/g,function(match,format){// if we encounter an escaped % then don't increase the array index
if(match==='%%')return match;index++;var formatter=exports.formatters[format];if('function'===typeof formatter){var val=args[index];match=formatter.call(self,val);// now we need to remove `args[index]` since it's inlined in the `format`
args.splice(index,1);index--;}return match;});// apply env-specific formatting (colors, etc.)
exports.formatArgs.call(self,args);var logFn=debug.log||exports.log||console.log.bind(console);logFn.apply(self,args);}debug.namespace=namespace;debug.enabled=exports.enabled(namespace);debug.useColors=exports.useColors();debug.color=selectColor(namespace);debug.destroy=destroy;// env-specific initialization logic for debug instances
if('function'===typeof exports.init){exports.init(debug);}exports.instances.push(debug);return debug;}function destroy(){var index=exports.instances.indexOf(this);if(index!==-1){exports.instances.splice(index,1);return true;}else{return false;}}/**
   * Enables a debug mode by namespaces. This can include modes
   * separated by a colon and wildcards.
   *
   * @param {String} namespaces
   * @api public
   */function enable(namespaces){exports.save(namespaces);exports.names=[];exports.skips=[];var i;var split=(typeof namespaces==='string'?namespaces:'').split(/[\s,]+/);var len=split.length;for(i=0;i<len;i++){if(!split[i])continue;// ignore empty strings
namespaces=split[i].replace(/\*/g,'.*?');if(namespaces[0]==='-'){exports.skips.push(new RegExp('^'+namespaces.substr(1)+'$'));}else{exports.names.push(new RegExp('^'+namespaces+'$'));}}for(i=0;i<exports.instances.length;i++){var instance=exports.instances[i];instance.enabled=exports.enabled(instance.namespace);}}/**
   * Disable debug output.
   *
   * @api public
   */function disable(){exports.enable('');}/**
   * Returns true if the given mode name is enabled, false otherwise.
   *
   * @param {String} name
   * @return {Boolean}
   * @api public
   */function enabled(name){if(name[name.length-1]==='*'){return true;}var i,len;for(i=0,len=exports.skips.length;i<len;i++){if(exports.skips[i].test(name)){return false;}}for(i=0,len=exports.names.length;i<len;i++){if(exports.names[i].test(name)){return true;}}return false;}/**
   * Coerce `val`.
   *
   * @param {Mixed} val
   * @return {Mixed}
   * @api private
   */function coerce(val){if(val instanceof Error)return val.stack||val.message;return val;}});var debug_1$2=debug$3.coerce;var debug_2$2=debug$3.disable;var debug_3$2=debug$3.enable;var debug_4$2=debug$3.enabled;var debug_5$2=debug$3.humanize;var debug_6$2=debug$3.instances;var debug_7$2=debug$3.names;var debug_8$2=debug$3.skips;var debug_9$2=debug$3.formatters;var browser$3=createCommonjsModule(function(module,exports){/**
   * This is the web browser implementation of `debug()`.
   *
   * Expose `debug()` as the module.
   */exports=module.exports=debug$3;exports.log=log;exports.formatArgs=formatArgs;exports.save=save;exports.load=load;exports.useColors=useColors;exports.storage='undefined'!=typeof chrome&&'undefined'!=typeof chrome.storage?chrome.storage.local:localstorage();/**
   * Colors.
   */exports.colors=['#0000CC','#0000FF','#0033CC','#0033FF','#0066CC','#0066FF','#0099CC','#0099FF','#00CC00','#00CC33','#00CC66','#00CC99','#00CCCC','#00CCFF','#3300CC','#3300FF','#3333CC','#3333FF','#3366CC','#3366FF','#3399CC','#3399FF','#33CC00','#33CC33','#33CC66','#33CC99','#33CCCC','#33CCFF','#6600CC','#6600FF','#6633CC','#6633FF','#66CC00','#66CC33','#9900CC','#9900FF','#9933CC','#9933FF','#99CC00','#99CC33','#CC0000','#CC0033','#CC0066','#CC0099','#CC00CC','#CC00FF','#CC3300','#CC3333','#CC3366','#CC3399','#CC33CC','#CC33FF','#CC6600','#CC6633','#CC9900','#CC9933','#CCCC00','#CCCC33','#FF0000','#FF0033','#FF0066','#FF0099','#FF00CC','#FF00FF','#FF3300','#FF3333','#FF3366','#FF3399','#FF33CC','#FF33FF','#FF6600','#FF6633','#FF9900','#FF9933','#FFCC00','#FFCC33'];/**
   * Currently only WebKit-based Web Inspectors, Firefox >= v31,
   * and the Firebug extension (any Firefox version) are known
   * to support "%c" CSS customizations.
   *
   * TODO: add a `localStorage` variable to explicitly enable/disable colors
   */function useColors(){// NB: In an Electron preload script, document will be defined but not fully
// initialized. Since we know we're in Chrome, we'll just detect this case
// explicitly
if(typeof window!=='undefined'&&window.process&&window.process.type==='renderer'){return true;}// Internet Explorer and Edge do not support colors.
if(typeof navigator!=='undefined'&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)){return false;}// is webkit? http://stackoverflow.com/a/16459606/376773
// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
return typeof document!=='undefined'&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||// is firebug? http://stackoverflow.com/a/398120/376773
typeof window!=='undefined'&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||// is firefox >= v31?
// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
typeof navigator!=='undefined'&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||// double check webkit in userAgent just in case we are in a worker
typeof navigator!=='undefined'&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);}/**
   * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
   */exports.formatters.j=function(v){try{return JSON.stringify(v);}catch(err){return'[UnexpectedJSONParseError]: '+err.message;}};/**
   * Colorize log arguments if enabled.
   *
   * @api public
   */function formatArgs(args){var useColors=this.useColors;args[0]=(useColors?'%c':'')+this.namespace+(useColors?' %c':' ')+args[0]+(useColors?'%c ':' ')+'+'+exports.humanize(this.diff);if(!useColors)return;var c='color: '+this.color;args.splice(1,0,c,'color: inherit');// the final "%c" is somewhat tricky, because there could be other
// arguments passed either before or after the %c, so we need to
// figure out the correct index to insert the CSS into
var index=0;var lastC=0;args[0].replace(/%[a-zA-Z%]/g,function(match){if('%%'===match)return;index++;if('%c'===match){// we only are interested in the *last* %c
// (the user may have provided their own)
lastC=index;}});args.splice(lastC,0,c);}/**
   * Invokes `console.log()` when available.
   * No-op when `console.log` is not a "function".
   *
   * @api public
   */function log(){// this hackery is required for IE8/9, where
// the `console.log` function doesn't have 'apply'
return'object'===(typeof console==="undefined"?"undefined":_typeof2(console))&&console.log&&Function.prototype.apply.call(console.log,console,arguments);}/**
   * Save `namespaces`.
   *
   * @param {String} namespaces
   * @api private
   */function save(namespaces){try{if(null==namespaces){exports.storage.removeItem('debug');}else{exports.storage.debug=namespaces;}}catch(e){}}/**
   * Load `namespaces`.
   *
   * @return {String} returns the previously persisted debug modes
   * @api private
   */function load(){var r;try{r=exports.storage.debug;}catch(e){}// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
if(!r&&typeof process!=='undefined'&&'env'in process){r=process.env.DEBUG;}return r;}/**
   * Enable namespaces listed in `localStorage.debug` initially.
   */exports.enable(load());/**
   * Localstorage attempts to return the localstorage.
   *
   * This is necessary because safari throws
   * when a user disables cookies/localstorage
   * and you attempt to access it.
   *
   * @return {LocalStorage}
   * @api private
   */function localstorage(){try{return window.localStorage;}catch(e){}}});var browser_1$3=browser$3.log;var browser_2$3=browser$3.formatArgs;var browser_3$3=browser$3.save;var browser_4$3=browser$3.load;var browser_5$3=browser$3.useColors;var browser_6$3=browser$3.storage;var browser_7$3=browser$3.colors;/**
   * Module dependencies.
   */var debug$4=browser$3('engine.io-client:polling');/**
   * Module exports.
   */var polling=Polling;/**
   * Is XHR2 supported?
   */var hasXHR2=function(){var XMLHttpRequest=xmlhttprequest;var xhr=new XMLHttpRequest({xdomain:false});return null!=xhr.responseType;}();/**
   * Polling interface.
   *
   * @param {Object} opts
   * @api private
   */function Polling(opts){var forceBase64=opts&&opts.forceBase64;if(!hasXHR2||forceBase64){this.supportsBinary=false;}transport.call(this,opts);}/**
   * Inherits from Transport.
   */componentInherit(Polling,transport);/**
   * Transport name.
   */Polling.prototype.name='polling';/**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @api private
   */Polling.prototype.doOpen=function(){this.poll();};/**
   * Pauses polling.
   *
   * @param {Function} callback upon buffers are flushed and transport is paused
   * @api private
   */Polling.prototype.pause=function(onPause){var self=this;this.readyState='pausing';function pause(){debug$4('paused');self.readyState='paused';onPause();}if(this.polling||!this.writable){var total=0;if(this.polling){debug$4('we are currently polling - waiting to pause');total++;this.once('pollComplete',function(){debug$4('pre-pause polling complete');--total||pause();});}if(!this.writable){debug$4('we are currently writing - waiting to pause');total++;this.once('drain',function(){debug$4('pre-pause writing complete');--total||pause();});}}else{pause();}};/**
   * Starts polling cycle.
   *
   * @api public
   */Polling.prototype.poll=function(){debug$4('polling');this.polling=true;this.doPoll();this.emit('poll');};/**
   * Overloads onData to detect payloads.
   *
   * @api private
   */Polling.prototype.onData=function(data){var self=this;debug$4('polling got data %s',data);var callback=function callback(packet,index,total){// if its the first message we consider the transport open
if('opening'===self.readyState){self.onOpen();}// if its a close packet, we close the ongoing requests
if('close'===packet.type){self.onClose();return false;}// otherwise bypass onData and handle the message
self.onPacket(packet);};// decode payload
browser$2.decodePayload(data,this.socket.binaryType,callback);// if an event did not trigger closing
if('closed'!==this.readyState){// if we got data we're not polling
this.polling=false;this.emit('pollComplete');if('open'===this.readyState){this.poll();}else{debug$4('ignoring poll - transport state "%s"',this.readyState);}}};/**
   * For polling, send a close packet.
   *
   * @api private
   */Polling.prototype.doClose=function(){var self=this;function close(){debug$4('writing close packet');self.write([{type:'close'}]);}if('open'===this.readyState){debug$4('transport open - closing');close();}else{// in case we're trying to close while
// handshaking is in progress (GH-164)
debug$4('transport not open - deferring close');this.once('open',close);}};/**
   * Writes a packets payload.
   *
   * @param {Array} data packets
   * @param {Function} drain callback
   * @api private
   */Polling.prototype.write=function(packets){var self=this;this.writable=false;var callbackfn=function callbackfn(){self.writable=true;self.emit('drain');};browser$2.encodePayload(packets,this.supportsBinary,function(data){self.doWrite(data,callbackfn);});};/**
   * Generates uri for connection.
   *
   * @api private
   */Polling.prototype.uri=function(){var query=this.query||{};var schema=this.secure?'https':'http';var port='';// cache busting is forced
if(false!==this.timestampRequests){query[this.timestampParam]=yeast_1();}if(!this.supportsBinary&&!query.sid){query.b64=1;}query=parseqs.encode(query);// avoid port if default for schema
if(this.port&&('https'===schema&&Number(this.port)!==443||'http'===schema&&Number(this.port)!==80)){port=':'+this.port;}// prepend ? to query
if(query.length){query='?'+query;}var ipv6=this.hostname.indexOf(':')!==-1;return schema+'://'+(ipv6?'['+this.hostname+']':this.hostname)+port+this.path+query;};/**
   * Module requirements.
   */var debug$5=browser$3('engine.io-client:polling-xhr');/**
   * Module exports.
   */var pollingXhr=XHR;var Request_1=Request;/**
   * Empty function
   */function empty(){}/**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @api public
   */function XHR(opts){polling.call(this,opts);this.requestTimeout=opts.requestTimeout;this.extraHeaders=opts.extraHeaders;if(commonjsGlobal.location){var isSSL='https:'===location.protocol;var port=location.port;// some user agents have empty `location.port`
if(!port){port=isSSL?443:80;}this.xd=opts.hostname!==commonjsGlobal.location.hostname||port!==opts.port;this.xs=opts.secure!==isSSL;}}/**
   * Inherits from Polling.
   */componentInherit(XHR,polling);/**
   * XHR supports binary
   */XHR.prototype.supportsBinary=true;/**
   * Creates a request.
   *
   * @param {String} method
   * @api private
   */XHR.prototype.request=function(opts){opts=opts||{};opts.uri=this.uri();opts.xd=this.xd;opts.xs=this.xs;opts.agent=this.agent||false;opts.supportsBinary=this.supportsBinary;opts.enablesXDR=this.enablesXDR;// SSL options for Node.js client
opts.pfx=this.pfx;opts.key=this.key;opts.passphrase=this.passphrase;opts.cert=this.cert;opts.ca=this.ca;opts.ciphers=this.ciphers;opts.rejectUnauthorized=this.rejectUnauthorized;opts.requestTimeout=this.requestTimeout;// other options for Node.js client
opts.extraHeaders=this.extraHeaders;return new Request(opts);};/**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @api private
   */XHR.prototype.doWrite=function(data,fn){var isBinary=typeof data!=='string'&&data!==undefined;var req=this.request({method:'POST',data:data,isBinary:isBinary});var self=this;req.on('success',fn);req.on('error',function(err){self.onError('xhr post error',err);});this.sendXhr=req;};/**
   * Starts a poll cycle.
   *
   * @api private
   */XHR.prototype.doPoll=function(){debug$5('xhr poll');var req=this.request();var self=this;req.on('data',function(data){self.onData(data);});req.on('error',function(err){self.onError('xhr poll error',err);});this.pollXhr=req;};/**
   * Request constructor
   *
   * @param {Object} options
   * @api public
   */function Request(opts){this.method=opts.method||'GET';this.uri=opts.uri;this.xd=!!opts.xd;this.xs=!!opts.xs;this.async=false!==opts.async;this.data=undefined!==opts.data?opts.data:null;this.agent=opts.agent;this.isBinary=opts.isBinary;this.supportsBinary=opts.supportsBinary;this.enablesXDR=opts.enablesXDR;this.requestTimeout=opts.requestTimeout;// SSL options for Node.js client
this.pfx=opts.pfx;this.key=opts.key;this.passphrase=opts.passphrase;this.cert=opts.cert;this.ca=opts.ca;this.ciphers=opts.ciphers;this.rejectUnauthorized=opts.rejectUnauthorized;// other options for Node.js client
this.extraHeaders=opts.extraHeaders;this.create();}/**
   * Mix in `Emitter`.
   */componentEmitter(Request.prototype);/**
   * Creates the XHR object and sends the request.
   *
   * @api private
   */Request.prototype.create=function(){var opts={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};// SSL options for Node.js client
opts.pfx=this.pfx;opts.key=this.key;opts.passphrase=this.passphrase;opts.cert=this.cert;opts.ca=this.ca;opts.ciphers=this.ciphers;opts.rejectUnauthorized=this.rejectUnauthorized;var xhr=this.xhr=new xmlhttprequest(opts);var self=this;try{debug$5('xhr open %s: %s',this.method,this.uri);xhr.open(this.method,this.uri,this.async);try{if(this.extraHeaders){xhr.setDisableHeaderCheck&&xhr.setDisableHeaderCheck(true);for(var i in this.extraHeaders){if(this.extraHeaders.hasOwnProperty(i)){xhr.setRequestHeader(i,this.extraHeaders[i]);}}}}catch(e){}if('POST'===this.method){try{if(this.isBinary){xhr.setRequestHeader('Content-type','application/octet-stream');}else{xhr.setRequestHeader('Content-type','text/plain;charset=UTF-8');}}catch(e){}}try{xhr.setRequestHeader('Accept','*/*');}catch(e){}// ie6 check
if('withCredentials'in xhr){xhr.withCredentials=true;}if(this.requestTimeout){xhr.timeout=this.requestTimeout;}if(this.hasXDR()){xhr.onload=function(){self.onLoad();};xhr.onerror=function(){self.onError(xhr.responseText);};}else{xhr.onreadystatechange=function(){if(xhr.readyState===2){try{var contentType=xhr.getResponseHeader('Content-Type');if(self.supportsBinary&&contentType==='application/octet-stream'){xhr.responseType='arraybuffer';}}catch(e){}}if(4!==xhr.readyState)return;if(200===xhr.status||1223===xhr.status){self.onLoad();}else{// make sure the `error` event handler that's user-set
// does not throw in the same tick and gets caught here
setTimeout(function(){self.onError(xhr.status);},0);}};}debug$5('xhr data %s',this.data);xhr.send(this.data);}catch(e){// Need to defer since .create() is called directly fhrom the constructor
// and thus the 'error' event can only be only bound *after* this exception
// occurs.  Therefore, also, we cannot throw here at all.
setTimeout(function(){self.onError(e);},0);return;}if(commonjsGlobal.document){this.index=Request.requestsCount++;Request.requests[this.index]=this;}};/**
   * Called upon successful response.
   *
   * @api private
   */Request.prototype.onSuccess=function(){this.emit('success');this.cleanup();};/**
   * Called if we have data.
   *
   * @api private
   */Request.prototype.onData=function(data){this.emit('data',data);this.onSuccess();};/**
   * Called upon error.
   *
   * @api private
   */Request.prototype.onError=function(err){this.emit('error',err);this.cleanup(true);};/**
   * Cleans up house.
   *
   * @api private
   */Request.prototype.cleanup=function(fromError){if('undefined'===typeof this.xhr||null===this.xhr){return;}// xmlhttprequest
if(this.hasXDR()){this.xhr.onload=this.xhr.onerror=empty;}else{this.xhr.onreadystatechange=empty;}if(fromError){try{this.xhr.abort();}catch(e){}}if(commonjsGlobal.document){delete Request.requests[this.index];}this.xhr=null;};/**
   * Called upon load.
   *
   * @api private
   */Request.prototype.onLoad=function(){var data;try{var contentType;try{contentType=this.xhr.getResponseHeader('Content-Type');}catch(e){}if(contentType==='application/octet-stream'){data=this.xhr.response||this.xhr.responseText;}else{data=this.xhr.responseText;}}catch(e){this.onError(e);}if(null!=data){this.onData(data);}};/**
   * Check if it has XDomainRequest.
   *
   * @api private
   */Request.prototype.hasXDR=function(){return'undefined'!==typeof commonjsGlobal.XDomainRequest&&!this.xs&&this.enablesXDR;};/**
   * Aborts the request.
   *
   * @api public
   */Request.prototype.abort=function(){this.cleanup();};/**
   * Aborts pending requests when unloading the window. This is needed to prevent
   * memory leaks (e.g. when using IE) and to ensure that no spurious error is
   * emitted.
   */Request.requestsCount=0;Request.requests={};if(commonjsGlobal.document){if(commonjsGlobal.attachEvent){commonjsGlobal.attachEvent('onunload',unloadHandler);}else if(commonjsGlobal.addEventListener){commonjsGlobal.addEventListener('beforeunload',unloadHandler,false);}}function unloadHandler(){for(var i in Request.requests){if(Request.requests.hasOwnProperty(i)){Request.requests[i].abort();}}}pollingXhr.Request=Request_1;/**
   * Module requirements.
   */ /**
   * Module exports.
   */var pollingJsonp=JSONPPolling;/**
   * Cached regular expressions.
   */var rNewline=/\n/g;var rEscapedNewline=/\\n/g;/**
   * Global JSONP callbacks.
   */var callbacks;/**
   * Noop.
   */function empty$1(){}/**
   * JSONP Polling constructor.
   *
   * @param {Object} opts.
   * @api public
   */function JSONPPolling(opts){polling.call(this,opts);this.query=this.query||{};// define global callbacks array if not present
// we do this here (lazily) to avoid unneeded global pollution
if(!callbacks){// we need to consider multiple engines in the same page
if(!commonjsGlobal.___eio)commonjsGlobal.___eio=[];callbacks=commonjsGlobal.___eio;}// callback identifier
this.index=callbacks.length;// add callback to jsonp global
var self=this;callbacks.push(function(msg){self.onData(msg);});// append to query string
this.query.j=this.index;// prevent spurious errors from being emitted when the window is unloaded
if(commonjsGlobal.document&&commonjsGlobal.addEventListener){commonjsGlobal.addEventListener('beforeunload',function(){if(self.script)self.script.onerror=empty$1;},false);}}/**
   * Inherits from Polling.
   */componentInherit(JSONPPolling,polling);/*
   * JSONP only supports binary as base64 encoded strings
   */JSONPPolling.prototype.supportsBinary=false;/**
   * Closes the socket.
   *
   * @api private
   */JSONPPolling.prototype.doClose=function(){if(this.script){this.script.parentNode.removeChild(this.script);this.script=null;}if(this.form){this.form.parentNode.removeChild(this.form);this.form=null;this.iframe=null;}polling.prototype.doClose.call(this);};/**
   * Starts a poll cycle.
   *
   * @api private
   */JSONPPolling.prototype.doPoll=function(){var self=this;var script=document.createElement('script');if(this.script){this.script.parentNode.removeChild(this.script);this.script=null;}script.async=true;script.src=this.uri();script.onerror=function(e){self.onError('jsonp poll error',e);};var insertAt=document.getElementsByTagName('script')[0];if(insertAt){insertAt.parentNode.insertBefore(script,insertAt);}else{(document.head||document.body).appendChild(script);}this.script=script;var isUAgecko='undefined'!==typeof navigator&&/gecko/i.test(navigator.userAgent);if(isUAgecko){setTimeout(function(){var iframe=document.createElement('iframe');document.body.appendChild(iframe);document.body.removeChild(iframe);},100);}};/**
   * Writes with a hidden iframe.
   *
   * @param {String} data to send
   * @param {Function} called upon flush.
   * @api private
   */JSONPPolling.prototype.doWrite=function(data,fn){var self=this;if(!this.form){var form=document.createElement('form');var area=document.createElement('textarea');var id=this.iframeId='eio_iframe_'+this.index;var iframe;form.className='socketio';form.style.position='absolute';form.style.top='-1000px';form.style.left='-1000px';form.target=id;form.method='POST';form.setAttribute('accept-charset','utf-8');area.name='d';form.appendChild(area);document.body.appendChild(form);this.form=form;this.area=area;}this.form.action=this.uri();function complete(){initIframe();fn();}function initIframe(){if(self.iframe){try{self.form.removeChild(self.iframe);}catch(e){self.onError('jsonp polling iframe removal error',e);}}try{// ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
var html='<iframe src="javascript:0" name="'+self.iframeId+'">';iframe=document.createElement(html);}catch(e){iframe=document.createElement('iframe');iframe.name=self.iframeId;iframe.src='javascript:0';}iframe.id=self.iframeId;self.form.appendChild(iframe);self.iframe=iframe;}initIframe();// escape \n to prevent it from being converted into \r\n by some UAs
// double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
data=data.replace(rEscapedNewline,'\\\n');this.area.value=data.replace(rNewline,'\\n');try{this.form.submit();}catch(e){}if(this.iframe.attachEvent){this.iframe.onreadystatechange=function(){if(self.iframe.readyState==='complete'){complete();}};}else{this.iframe.onload=complete;}};var require$$1={};/**
   * Module dependencies.
   */var debug$6=browser$3('engine.io-client:websocket');var BrowserWebSocket=commonjsGlobal.WebSocket||commonjsGlobal.MozWebSocket;var NodeWebSocket;if(typeof window==='undefined'){try{NodeWebSocket=require$$1;}catch(e){}}/**
   * Get either the `WebSocket` or `MozWebSocket` globals
   * in the browser or try to resolve WebSocket-compatible
   * interface exposed by `ws` for Node-like environment.
   */var WebSocket=BrowserWebSocket;if(!WebSocket&&typeof window==='undefined'){WebSocket=NodeWebSocket;}/**
   * Module exports.
   */var websocket=WS;/**
   * WebSocket transport constructor.
   *
   * @api {Object} connection options
   * @api public
   */function WS(opts){var forceBase64=opts&&opts.forceBase64;if(forceBase64){this.supportsBinary=false;}this.perMessageDeflate=opts.perMessageDeflate;this.usingBrowserWebSocket=BrowserWebSocket&&!opts.forceNode;this.protocols=opts.protocols;if(!this.usingBrowserWebSocket){WebSocket=NodeWebSocket;}transport.call(this,opts);}/**
   * Inherits from Transport.
   */componentInherit(WS,transport);/**
   * Transport name.
   *
   * @api public
   */WS.prototype.name='websocket';/*
   * WebSockets support binary
   */WS.prototype.supportsBinary=true;/**
   * Opens socket.
   *
   * @api private
   */WS.prototype.doOpen=function(){if(!this.check()){// let probe timeout
return;}var uri=this.uri();var protocols=this.protocols;var opts={agent:this.agent,perMessageDeflate:this.perMessageDeflate};// SSL options for Node.js client
opts.pfx=this.pfx;opts.key=this.key;opts.passphrase=this.passphrase;opts.cert=this.cert;opts.ca=this.ca;opts.ciphers=this.ciphers;opts.rejectUnauthorized=this.rejectUnauthorized;if(this.extraHeaders){opts.headers=this.extraHeaders;}if(this.localAddress){opts.localAddress=this.localAddress;}try{this.ws=this.usingBrowserWebSocket?protocols?new WebSocket(uri,protocols):new WebSocket(uri):new WebSocket(uri,protocols,opts);}catch(err){return this.emit('error',err);}if(this.ws.binaryType===undefined){this.supportsBinary=false;}if(this.ws.supports&&this.ws.supports.binary){this.supportsBinary=true;this.ws.binaryType='nodebuffer';}else{this.ws.binaryType='arraybuffer';}this.addEventListeners();};/**
   * Adds event listeners to the socket
   *
   * @api private
   */WS.prototype.addEventListeners=function(){var self=this;this.ws.onopen=function(){self.onOpen();};this.ws.onclose=function(){self.onClose();};this.ws.onmessage=function(ev){self.onData(ev.data);};this.ws.onerror=function(e){self.onError('websocket error',e);};};/**
   * Writes data to socket.
   *
   * @param {Array} array of packets.
   * @api private
   */WS.prototype.write=function(packets){var self=this;this.writable=false;// encodePacket efficient as it uses WS framing
// no need for encodePayload
var total=packets.length;for(var i=0,l=total;i<l;i++){(function(packet){browser$2.encodePacket(packet,self.supportsBinary,function(data){if(!self.usingBrowserWebSocket){// always create a new object (GH-437)
var opts={};if(packet.options){opts.compress=packet.options.compress;}if(self.perMessageDeflate){var len='string'===typeof data?commonjsGlobal.Buffer.byteLength(data):data.length;if(len<self.perMessageDeflate.threshold){opts.compress=false;}}}// Sometimes the websocket has already been closed but the browser didn't
// have a chance of informing us about it yet, in that case send will
// throw an error
try{if(self.usingBrowserWebSocket){// TypeError is thrown when passing the second argument on Safari
self.ws.send(data);}else{self.ws.send(data,opts);}}catch(e){debug$6('websocket closed before onclose event');}--total||done();});})(packets[i]);}function done(){self.emit('flush');// fake drain
// defer to next tick to allow Socket to clear writeBuffer
setTimeout(function(){self.writable=true;self.emit('drain');},0);}};/**
   * Called upon close
   *
   * @api private
   */WS.prototype.onClose=function(){transport.prototype.onClose.call(this);};/**
   * Closes socket.
   *
   * @api private
   */WS.prototype.doClose=function(){if(typeof this.ws!=='undefined'){this.ws.close();}};/**
   * Generates uri for connection.
   *
   * @api private
   */WS.prototype.uri=function(){var query=this.query||{};var schema=this.secure?'wss':'ws';var port='';// avoid port if default for schema
if(this.port&&('wss'===schema&&Number(this.port)!==443||'ws'===schema&&Number(this.port)!==80)){port=':'+this.port;}// append timestamp to URI
if(this.timestampRequests){query[this.timestampParam]=yeast_1();}// communicate binary support capabilities
if(!this.supportsBinary){query.b64=1;}query=parseqs.encode(query);// prepend ? to query
if(query.length){query='?'+query;}var ipv6=this.hostname.indexOf(':')!==-1;return schema+'://'+(ipv6?'['+this.hostname+']':this.hostname)+port+this.path+query;};/**
   * Feature detection for WebSocket.
   *
   * @return {Boolean} whether this transport is available.
   * @api public
   */WS.prototype.check=function(){return!!WebSocket&&!('__initialize'in WebSocket&&this.name===WS.prototype.name);};/**
   * Module dependencies
   */ /**
   * Export transports.
   */var polling_1=polling$1;var websocket_1=websocket;/**
   * Polling transport polymorphic constructor.
   * Decides on xhr vs jsonp based on feature detection.
   *
   * @api private
   */function polling$1(opts){var xhr;var xd=false;var xs=false;var jsonp=false!==opts.jsonp;if(commonjsGlobal.location){var isSSL='https:'===location.protocol;var port=location.port;// some user agents have empty `location.port`
if(!port){port=isSSL?443:80;}xd=opts.hostname!==location.hostname||port!==opts.port;xs=opts.secure!==isSSL;}opts.xdomain=xd;opts.xscheme=xs;xhr=new xmlhttprequest(opts);if('open'in xhr&&!opts.forceJSONP){return new pollingXhr(opts);}else{if(!jsonp)throw new Error('JSONP disabled');return new pollingJsonp(opts);}}var transports={polling:polling_1,websocket:websocket_1};var indexOf$1=[].indexOf;var indexof=function indexof(arr,obj){if(indexOf$1)return arr.indexOf(obj);for(var i=0;i<arr.length;++i){if(arr[i]===obj)return i;}return-1;};/**
   * Module dependencies.
   */var debug$7=browser$3('engine.io-client:socket');/**
   * Module exports.
   */var socket=Socket;/**
   * Socket constructor.
   *
   * @param {String|Object} uri or options
   * @param {Object} options
   * @api public
   */function Socket(uri,opts){if(!(this instanceof Socket))return new Socket(uri,opts);opts=opts||{};if(uri&&'object'===_typeof2(uri)){opts=uri;uri=null;}if(uri){uri=parseuri(uri);opts.hostname=uri.host;opts.secure=uri.protocol==='https'||uri.protocol==='wss';opts.port=uri.port;if(uri.query)opts.query=uri.query;}else if(opts.host){opts.hostname=parseuri(opts.host).host;}this.secure=null!=opts.secure?opts.secure:commonjsGlobal.location&&'https:'===location.protocol;if(opts.hostname&&!opts.port){// if no port is specified manually, use the protocol default
opts.port=this.secure?'443':'80';}this.agent=opts.agent||false;this.hostname=opts.hostname||(commonjsGlobal.location?location.hostname:'localhost');this.port=opts.port||(commonjsGlobal.location&&location.port?location.port:this.secure?443:80);this.query=opts.query||{};if('string'===typeof this.query)this.query=parseqs.decode(this.query);this.upgrade=false!==opts.upgrade;this.path=(opts.path||'/engine.io').replace(/\/$/,'')+'/';this.forceJSONP=!!opts.forceJSONP;this.jsonp=false!==opts.jsonp;this.forceBase64=!!opts.forceBase64;this.enablesXDR=!!opts.enablesXDR;this.timestampParam=opts.timestampParam||'t';this.timestampRequests=opts.timestampRequests;this.transports=opts.transports||['polling','websocket'];this.transportOptions=opts.transportOptions||{};this.readyState='';this.writeBuffer=[];this.prevBufferLen=0;this.policyPort=opts.policyPort||843;this.rememberUpgrade=opts.rememberUpgrade||false;this.binaryType=null;this.onlyBinaryUpgrades=opts.onlyBinaryUpgrades;this.perMessageDeflate=false!==opts.perMessageDeflate?opts.perMessageDeflate||{}:false;if(true===this.perMessageDeflate)this.perMessageDeflate={};if(this.perMessageDeflate&&null==this.perMessageDeflate.threshold){this.perMessageDeflate.threshold=1024;}// SSL options for Node.js client
this.pfx=opts.pfx||null;this.key=opts.key||null;this.passphrase=opts.passphrase||null;this.cert=opts.cert||null;this.ca=opts.ca||null;this.ciphers=opts.ciphers||null;this.rejectUnauthorized=opts.rejectUnauthorized===undefined?true:opts.rejectUnauthorized;this.forceNode=!!opts.forceNode;// other options for Node.js client
var freeGlobal=_typeof2(commonjsGlobal)==='object'&&commonjsGlobal;if(freeGlobal.global===freeGlobal){if(opts.extraHeaders&&Object.keys(opts.extraHeaders).length>0){this.extraHeaders=opts.extraHeaders;}if(opts.localAddress){this.localAddress=opts.localAddress;}}// set on handshake
this.id=null;this.upgrades=null;this.pingInterval=null;this.pingTimeout=null;// set on heartbeat
this.pingIntervalTimer=null;this.pingTimeoutTimer=null;this.open();}Socket.priorWebsocketSuccess=false;/**
   * Mix in `Emitter`.
   */componentEmitter(Socket.prototype);/**
   * Protocol version.
   *
   * @api public
   */Socket.protocol=browser$2.protocol;// this is an int
/**
   * Expose deps for legacy compatibility
   * and standalone browser access.
   */Socket.Socket=Socket;Socket.Transport=transport;Socket.transports=transports;Socket.parser=browser$2;/**
   * Creates transport of the given type.
   *
   * @param {String} transport name
   * @return {Transport}
   * @api private
   */Socket.prototype.createTransport=function(name){debug$7('creating transport "%s"',name);var query=clone(this.query);// append engine.io protocol identifier
query.EIO=browser$2.protocol;// transport name
query.transport=name;// per-transport options
var options=this.transportOptions[name]||{};// session id if we already have one
if(this.id)query.sid=this.id;var transport=new transports[name]({query:query,socket:this,agent:options.agent||this.agent,hostname:options.hostname||this.hostname,port:options.port||this.port,secure:options.secure||this.secure,path:options.path||this.path,forceJSONP:options.forceJSONP||this.forceJSONP,jsonp:options.jsonp||this.jsonp,forceBase64:options.forceBase64||this.forceBase64,enablesXDR:options.enablesXDR||this.enablesXDR,timestampRequests:options.timestampRequests||this.timestampRequests,timestampParam:options.timestampParam||this.timestampParam,policyPort:options.policyPort||this.policyPort,pfx:options.pfx||this.pfx,key:options.key||this.key,passphrase:options.passphrase||this.passphrase,cert:options.cert||this.cert,ca:options.ca||this.ca,ciphers:options.ciphers||this.ciphers,rejectUnauthorized:options.rejectUnauthorized||this.rejectUnauthorized,perMessageDeflate:options.perMessageDeflate||this.perMessageDeflate,extraHeaders:options.extraHeaders||this.extraHeaders,forceNode:options.forceNode||this.forceNode,localAddress:options.localAddress||this.localAddress,requestTimeout:options.requestTimeout||this.requestTimeout,protocols:options.protocols||void 0});return transport;};function clone(obj){var o={};for(var i in obj){if(obj.hasOwnProperty(i)){o[i]=obj[i];}}return o;}/**
   * Initializes transport to use and starts probe.
   *
   * @api private
   */Socket.prototype.open=function(){var transport;if(this.rememberUpgrade&&Socket.priorWebsocketSuccess&&this.transports.indexOf('websocket')!==-1){transport='websocket';}else if(0===this.transports.length){// Emit error on next tick so it can be listened to
var self=this;setTimeout(function(){self.emit('error','No transports available');},0);return;}else{transport=this.transports[0];}this.readyState='opening';// Retry with the next transport if the transport is disabled (jsonp: false)
try{transport=this.createTransport(transport);}catch(e){this.transports.shift();this.open();return;}transport.open();this.setTransport(transport);};/**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @api private
   */Socket.prototype.setTransport=function(transport){debug$7('setting transport %s',transport.name);var self=this;if(this.transport){debug$7('clearing existing transport %s',this.transport.name);this.transport.removeAllListeners();}// set up transport
this.transport=transport;// set up transport listeners
transport.on('drain',function(){self.onDrain();}).on('packet',function(packet){self.onPacket(packet);}).on('error',function(e){self.onError(e);}).on('close',function(){self.onClose('transport close');});};/**
   * Probes a transport.
   *
   * @param {String} transport name
   * @api private
   */Socket.prototype.probe=function(name){debug$7('probing transport "%s"',name);var transport=this.createTransport(name,{probe:1});var failed=false;var self=this;Socket.priorWebsocketSuccess=false;function onTransportOpen(){if(self.onlyBinaryUpgrades){var upgradeLosesBinary=!this.supportsBinary&&self.transport.supportsBinary;failed=failed||upgradeLosesBinary;}if(failed)return;debug$7('probe transport "%s" opened',name);transport.send([{type:'ping',data:'probe'}]);transport.once('packet',function(msg){if(failed)return;if('pong'===msg.type&&'probe'===msg.data){debug$7('probe transport "%s" pong',name);self.upgrading=true;self.emit('upgrading',transport);if(!transport)return;Socket.priorWebsocketSuccess='websocket'===transport.name;debug$7('pausing current transport "%s"',self.transport.name);self.transport.pause(function(){if(failed)return;if('closed'===self.readyState)return;debug$7('changing transport and sending upgrade packet');cleanup();self.setTransport(transport);transport.send([{type:'upgrade'}]);self.emit('upgrade',transport);transport=null;self.upgrading=false;self.flush();});}else{debug$7('probe transport "%s" failed',name);var err=new Error('probe error');err.transport=transport.name;self.emit('upgradeError',err);}});}function freezeTransport(){if(failed)return;// Any callback called by transport should be ignored since now
failed=true;cleanup();transport.close();transport=null;}// Handle any error that happens while probing
function onerror(err){var error=new Error('probe error: '+err);error.transport=transport.name;freezeTransport();debug$7('probe transport "%s" failed because of error: %s',name,err);self.emit('upgradeError',error);}function onTransportClose(){onerror('transport closed');}// When the socket is closed while we're probing
function onclose(){onerror('socket closed');}// When the socket is upgraded while we're probing
function onupgrade(to){if(transport&&to.name!==transport.name){debug$7('"%s" works - aborting "%s"',to.name,transport.name);freezeTransport();}}// Remove all listeners on the transport and on self
function cleanup(){transport.removeListener('open',onTransportOpen);transport.removeListener('error',onerror);transport.removeListener('close',onTransportClose);self.removeListener('close',onclose);self.removeListener('upgrading',onupgrade);}transport.once('open',onTransportOpen);transport.once('error',onerror);transport.once('close',onTransportClose);this.once('close',onclose);this.once('upgrading',onupgrade);transport.open();};/**
   * Called when connection is deemed open.
   *
   * @api public
   */Socket.prototype.onOpen=function(){debug$7('socket open');this.readyState='open';Socket.priorWebsocketSuccess='websocket'===this.transport.name;this.emit('open');this.flush();// we check for `readyState` in case an `open`
// listener already closed the socket
if('open'===this.readyState&&this.upgrade&&this.transport.pause){debug$7('starting upgrade probes');for(var i=0,l=this.upgrades.length;i<l;i++){this.probe(this.upgrades[i]);}}};/**
   * Handles a packet.
   *
   * @api private
   */Socket.prototype.onPacket=function(packet){if('opening'===this.readyState||'open'===this.readyState||'closing'===this.readyState){debug$7('socket receive: type "%s", data "%s"',packet.type,packet.data);this.emit('packet',packet);// Socket is live - any packet counts
this.emit('heartbeat');switch(packet.type){case'open':this.onHandshake(JSON.parse(packet.data));break;case'pong':this.setPing();this.emit('pong');break;case'error':var err=new Error('server error');err.code=packet.data;this.onError(err);break;case'message':this.emit('data',packet.data);this.emit('message',packet.data);break;}}else{debug$7('packet received with socket readyState "%s"',this.readyState);}};/**
   * Called upon handshake completion.
   *
   * @param {Object} handshake obj
   * @api private
   */Socket.prototype.onHandshake=function(data){this.emit('handshake',data);this.id=data.sid;this.transport.query.sid=data.sid;this.upgrades=this.filterUpgrades(data.upgrades);this.pingInterval=data.pingInterval;this.pingTimeout=data.pingTimeout;this.onOpen();// In case open handler closes socket
if('closed'===this.readyState)return;this.setPing();// Prolong liveness of socket on heartbeat
this.removeListener('heartbeat',this.onHeartbeat);this.on('heartbeat',this.onHeartbeat);};/**
   * Resets ping timeout.
   *
   * @api private
   */Socket.prototype.onHeartbeat=function(timeout){clearTimeout(this.pingTimeoutTimer);var self=this;self.pingTimeoutTimer=setTimeout(function(){if('closed'===self.readyState)return;self.onClose('ping timeout');},timeout||self.pingInterval+self.pingTimeout);};/**
   * Pings server every `this.pingInterval` and expects response
   * within `this.pingTimeout` or closes connection.
   *
   * @api private
   */Socket.prototype.setPing=function(){var self=this;clearTimeout(self.pingIntervalTimer);self.pingIntervalTimer=setTimeout(function(){debug$7('writing ping packet - expecting pong within %sms',self.pingTimeout);self.ping();self.onHeartbeat(self.pingTimeout);},self.pingInterval);};/**
  * Sends a ping packet.
  *
  * @api private
  */Socket.prototype.ping=function(){var self=this;this.sendPacket('ping',function(){self.emit('ping');});};/**
   * Called on `drain` event
   *
   * @api private
   */Socket.prototype.onDrain=function(){this.writeBuffer.splice(0,this.prevBufferLen);// setting prevBufferLen = 0 is very important
// for example, when upgrading, upgrade packet is sent over,
// and a nonzero prevBufferLen could cause problems on `drain`
this.prevBufferLen=0;if(0===this.writeBuffer.length){this.emit('drain');}else{this.flush();}};/**
   * Flush write buffers.
   *
   * @api private
   */Socket.prototype.flush=function(){if('closed'!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){debug$7('flushing %d packets in socket',this.writeBuffer.length);this.transport.send(this.writeBuffer);// keep track of current length of writeBuffer
// splice writeBuffer and callbackBuffer on `drain`
this.prevBufferLen=this.writeBuffer.length;this.emit('flush');}};/**
   * Sends a message.
   *
   * @param {String} message.
   * @param {Function} callback function.
   * @param {Object} options.
   * @return {Socket} for chaining.
   * @api public
   */Socket.prototype.write=Socket.prototype.send=function(msg,options,fn){this.sendPacket('message',msg,options,fn);return this;};/**
   * Sends a packet.
   *
   * @param {String} packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} callback function.
   * @api private
   */Socket.prototype.sendPacket=function(type,data,options,fn){if('function'===typeof data){fn=data;data=undefined;}if('function'===typeof options){fn=options;options=null;}if('closing'===this.readyState||'closed'===this.readyState){return;}options=options||{};options.compress=false!==options.compress;var packet={type:type,data:data,options:options};this.emit('packetCreate',packet);this.writeBuffer.push(packet);if(fn)this.once('flush',fn);this.flush();};/**
   * Closes the connection.
   *
   * @api private
   */Socket.prototype.close=function(){if('opening'===this.readyState||'open'===this.readyState){this.readyState='closing';var self=this;if(this.writeBuffer.length){this.once('drain',function(){if(this.upgrading){waitForUpgrade();}else{close();}});}else if(this.upgrading){waitForUpgrade();}else{close();}}function close(){self.onClose('forced close');debug$7('socket closing - telling transport to close');self.transport.close();}function cleanupAndClose(){self.removeListener('upgrade',cleanupAndClose);self.removeListener('upgradeError',cleanupAndClose);close();}function waitForUpgrade(){// wait for upgrade to finish since we can't send packets while pausing a transport
self.once('upgrade',cleanupAndClose);self.once('upgradeError',cleanupAndClose);}return this;};/**
   * Called upon transport error
   *
   * @api private
   */Socket.prototype.onError=function(err){debug$7('socket error %j',err);Socket.priorWebsocketSuccess=false;this.emit('error',err);this.onClose('transport error',err);};/**
   * Called upon transport close.
   *
   * @api private
   */Socket.prototype.onClose=function(reason,desc){if('opening'===this.readyState||'open'===this.readyState||'closing'===this.readyState){debug$7('socket close with reason: "%s"',reason);var self=this;// clear timers
clearTimeout(this.pingIntervalTimer);clearTimeout(this.pingTimeoutTimer);// stop event from firing again for transport
this.transport.removeAllListeners('close');// ensure transport won't stay open
this.transport.close();// ignore further transport communication
this.transport.removeAllListeners();// set ready state
this.readyState='closed';// clear session id
this.id=null;// emit close event
this.emit('close',reason,desc);// clean buffers after, so users can still
// grab the buffers on `close` event
self.writeBuffer=[];self.prevBufferLen=0;}};/**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} server upgrades
   * @api private
   *
   */Socket.prototype.filterUpgrades=function(upgrades){var filteredUpgrades=[];for(var i=0,j=upgrades.length;i<j;i++){if(~indexof(this.transports,upgrades[i]))filteredUpgrades.push(upgrades[i]);}return filteredUpgrades;};var lib$1=socket;/**
   * Exports parser
   *
   * @api public
   *
   */var parser=browser$2;lib$1.parser=parser;var toArray_1=toArray;function toArray(list,index){var array=[];index=index||0;for(var i=index||0;i<list.length;i++){array[i-index]=list[i];}return array;}/**
   * Module exports.
   */var on_1=on;/**
   * Helper for subscriptions.
   *
   * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
   * @param {String} event name
   * @param {Function} callback
   * @api public
   */function on(obj,ev,fn){obj.on(ev,fn);return{destroy:function destroy(){obj.removeListener(ev,fn);}};}/**
   * Slice reference.
   */var slice=[].slice;/**
   * Bind `obj` to `fn`.
   *
   * @param {Object} obj
   * @param {Function|String} fn or string
   * @return {Function}
   * @api public
   */var componentBind=function componentBind(obj,fn){if('string'==typeof fn)fn=obj[fn];if('function'!=typeof fn)throw new Error('bind() requires a function');var args=slice.call(arguments,2);return function(){return fn.apply(obj,args.concat(slice.call(arguments)));};};var socket$1=createCommonjsModule(function(module,exports){/**
   * Module dependencies.
   */var debug=browser('socket.io-client:socket');/**
   * Module exports.
   */module.exports=exports=Socket;/**
   * Internal events (blacklisted).
   * These events can't be emitted by the user.
   *
   * @api private
   */var events={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1};/**
   * Shortcut to `Emitter#emit`.
   */var emit=componentEmitter.prototype.emit;/**
   * `Socket` constructor.
   *
   * @api public
   */function Socket(io,nsp,opts){this.io=io;this.nsp=nsp;this.json=this;// compat
this.ids=0;this.acks={};this.receiveBuffer=[];this.sendBuffer=[];this.connected=false;this.disconnected=true;this.flags={};if(opts&&opts.query){this.query=opts.query;}if(this.io.autoConnect)this.open();}/**
   * Mix in `Emitter`.
   */componentEmitter(Socket.prototype);/**
   * Subscribe to open, close and packet events
   *
   * @api private
   */Socket.prototype.subEvents=function(){if(this.subs)return;var io=this.io;this.subs=[on_1(io,'open',componentBind(this,'onopen')),on_1(io,'packet',componentBind(this,'onpacket')),on_1(io,'close',componentBind(this,'onclose'))];};/**
   * "Opens" the socket.
   *
   * @api public
   */Socket.prototype.open=Socket.prototype.connect=function(){if(this.connected)return this;this.subEvents();this.io.open();// ensure open
if('open'===this.io.readyState)this.onopen();this.emit('connecting');return this;};/**
   * Sends a `message` event.
   *
   * @return {Socket} self
   * @api public
   */Socket.prototype.send=function(){var args=toArray_1(arguments);args.unshift('message');this.emit.apply(this,args);return this;};/**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @param {String} event name
   * @return {Socket} self
   * @api public
   */Socket.prototype.emit=function(ev){if(events.hasOwnProperty(ev)){emit.apply(this,arguments);return this;}var args=toArray_1(arguments);var packet={type:(this.flags.binary!==undefined?this.flags.binary:hasBinary2(args))?socket_ioParser.BINARY_EVENT:socket_ioParser.EVENT,data:args};packet.options={};packet.options.compress=!this.flags||false!==this.flags.compress;// event ack callback
if('function'===typeof args[args.length-1]){debug('emitting packet with ack id %d',this.ids);this.acks[this.ids]=args.pop();packet.id=this.ids++;}if(this.connected){this.packet(packet);}else{this.sendBuffer.push(packet);}this.flags={};return this;};/**
   * Sends a packet.
   *
   * @param {Object} packet
   * @api private
   */Socket.prototype.packet=function(packet){packet.nsp=this.nsp;this.io.packet(packet);};/**
   * Called upon engine `open`.
   *
   * @api private
   */Socket.prototype.onopen=function(){debug('transport is open - connecting');// write connect packet if necessary
if('/'!==this.nsp){if(this.query){var query=_typeof2(this.query)==='object'?parseqs.encode(this.query):this.query;debug('sending connect packet with query %s',query);this.packet({type:socket_ioParser.CONNECT,query:query});}else{this.packet({type:socket_ioParser.CONNECT});}}};/**
   * Called upon engine `close`.
   *
   * @param {String} reason
   * @api private
   */Socket.prototype.onclose=function(reason){debug('close (%s)',reason);this.connected=false;this.disconnected=true;delete this.id;this.emit('disconnect',reason);};/**
   * Called with socket packet.
   *
   * @param {Object} packet
   * @api private
   */Socket.prototype.onpacket=function(packet){var sameNamespace=packet.nsp===this.nsp;var rootNamespaceError=packet.type===socket_ioParser.ERROR&&packet.nsp==='/';if(!sameNamespace&&!rootNamespaceError)return;switch(packet.type){case socket_ioParser.CONNECT:this.onconnect();break;case socket_ioParser.EVENT:this.onevent(packet);break;case socket_ioParser.BINARY_EVENT:this.onevent(packet);break;case socket_ioParser.ACK:this.onack(packet);break;case socket_ioParser.BINARY_ACK:this.onack(packet);break;case socket_ioParser.DISCONNECT:this.ondisconnect();break;case socket_ioParser.ERROR:this.emit('error',packet.data);break;}};/**
   * Called upon a server event.
   *
   * @param {Object} packet
   * @api private
   */Socket.prototype.onevent=function(packet){var args=packet.data||[];debug('emitting event %j',args);if(null!=packet.id){debug('attaching ack callback to event');args.push(this.ack(packet.id));}if(this.connected){emit.apply(this,args);}else{this.receiveBuffer.push(args);}};/**
   * Produces an ack callback to emit with an event.
   *
   * @api private
   */Socket.prototype.ack=function(id){var self=this;var sent=false;return function(){// prevent double callbacks
if(sent)return;sent=true;var args=toArray_1(arguments);debug('sending ack %j',args);self.packet({type:hasBinary2(args)?socket_ioParser.BINARY_ACK:socket_ioParser.ACK,id:id,data:args});};};/**
   * Called upon a server acknowlegement.
   *
   * @param {Object} packet
   * @api private
   */Socket.prototype.onack=function(packet){var ack=this.acks[packet.id];if('function'===typeof ack){debug('calling ack %s with %j',packet.id,packet.data);ack.apply(this,packet.data);delete this.acks[packet.id];}else{debug('bad ack %s',packet.id);}};/**
   * Called upon server connect.
   *
   * @api private
   */Socket.prototype.onconnect=function(){this.connected=true;this.disconnected=false;this.emit('connect');this.emitBuffered();};/**
   * Emit buffered events (received and emitted).
   *
   * @api private
   */Socket.prototype.emitBuffered=function(){var i;for(i=0;i<this.receiveBuffer.length;i++){emit.apply(this,this.receiveBuffer[i]);}this.receiveBuffer=[];for(i=0;i<this.sendBuffer.length;i++){this.packet(this.sendBuffer[i]);}this.sendBuffer=[];};/**
   * Called upon server disconnect.
   *
   * @api private
   */Socket.prototype.ondisconnect=function(){debug('server disconnect (%s)',this.nsp);this.destroy();this.onclose('io server disconnect');};/**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @api private.
   */Socket.prototype.destroy=function(){if(this.subs){// clean subscriptions to avoid reconnections
for(var i=0;i<this.subs.length;i++){this.subs[i].destroy();}this.subs=null;}this.io.destroy(this);};/**
   * Disconnects the socket manually.
   *
   * @return {Socket} self
   * @api public
   */Socket.prototype.close=Socket.prototype.disconnect=function(){if(this.connected){debug('performing disconnect (%s)',this.nsp);this.packet({type:socket_ioParser.DISCONNECT});}// remove socket from pool
this.destroy();if(this.connected){// fire events
this.onclose('io client disconnect');}return this;};/**
   * Sets the compress flag.
   *
   * @param {Boolean} if `true`, compresses the sending data
   * @return {Socket} self
   * @api public
   */Socket.prototype.compress=function(compress){this.flags.compress=compress;return this;};/**
   * Sets the binary flag
   *
   * @param {Boolean} whether the emitted data contains binary
   * @return {Socket} self
   * @api public
   */Socket.prototype.binary=function(binary){this.flags.binary=binary;return this;};});/**
   * Expose `Backoff`.
   */var backo2=Backoff;/**
   * Initialize backoff timer with `opts`.
   *
   * - `min` initial timeout in milliseconds [100]
   * - `max` max timeout [10000]
   * - `jitter` [0]
   * - `factor` [2]
   *
   * @param {Object} opts
   * @api public
   */function Backoff(opts){opts=opts||{};this.ms=opts.min||100;this.max=opts.max||10000;this.factor=opts.factor||2;this.jitter=opts.jitter>0&&opts.jitter<=1?opts.jitter:0;this.attempts=0;}/**
   * Return the backoff duration.
   *
   * @return {Number}
   * @api public
   */Backoff.prototype.duration=function(){var ms=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var rand=Math.random();var deviation=Math.floor(rand*this.jitter*ms);ms=(Math.floor(rand*10)&1)==0?ms-deviation:ms+deviation;}return Math.min(ms,this.max)|0;};/**
   * Reset the number of attempts.
   *
   * @api public
   */Backoff.prototype.reset=function(){this.attempts=0;};/**
   * Set the minimum duration
   *
   * @api public
   */Backoff.prototype.setMin=function(min){this.ms=min;};/**
   * Set the maximum duration
   *
   * @api public
   */Backoff.prototype.setMax=function(max){this.max=max;};/**
   * Set the jitter
   *
   * @api public
   */Backoff.prototype.setJitter=function(jitter){this.jitter=jitter;};/**
   * Module dependencies.
   */var debug$8=browser('socket.io-client:manager');/**
   * IE6+ hasOwnProperty
   */var has=Object.prototype.hasOwnProperty;/**
   * Module exports
   */var manager=Manager;/**
   * `Manager` constructor.
   *
   * @param {String} engine instance or engine uri/opts
   * @param {Object} options
   * @api public
   */function Manager(uri,opts){if(!(this instanceof Manager))return new Manager(uri,opts);if(uri&&'object'===_typeof2(uri)){opts=uri;uri=undefined;}opts=opts||{};opts.path=opts.path||'/socket.io';this.nsps={};this.subs=[];this.opts=opts;this.reconnection(opts.reconnection!==false);this.reconnectionAttempts(opts.reconnectionAttempts||Infinity);this.reconnectionDelay(opts.reconnectionDelay||1000);this.reconnectionDelayMax(opts.reconnectionDelayMax||5000);this.randomizationFactor(opts.randomizationFactor||0.5);this.backoff=new backo2({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()});this.timeout(null==opts.timeout?20000:opts.timeout);this.readyState='closed';this.uri=uri;this.connecting=[];this.lastPing=null;this.encoding=false;this.packetBuffer=[];var _parser=opts.parser||socket_ioParser;this.encoder=new _parser.Encoder();this.decoder=new _parser.Decoder();this.autoConnect=opts.autoConnect!==false;if(this.autoConnect)this.open();}/**
   * Propagate given event to sockets and emit on `this`
   *
   * @api private
   */Manager.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var nsp in this.nsps){if(has.call(this.nsps,nsp)){this.nsps[nsp].emit.apply(this.nsps[nsp],arguments);}}};/**
   * Update `socket.id` of all sockets
   *
   * @api private
   */Manager.prototype.updateSocketIds=function(){for(var nsp in this.nsps){if(has.call(this.nsps,nsp)){this.nsps[nsp].id=this.generateId(nsp);}}};/**
   * generate `socket.id` for the given `nsp`
   *
   * @param {String} nsp
   * @return {String}
   * @api private
   */Manager.prototype.generateId=function(nsp){return(nsp==='/'?'':nsp+'#')+this.engine.id;};/**
   * Mix in `Emitter`.
   */componentEmitter(Manager.prototype);/**
   * Sets the `reconnection` config.
   *
   * @param {Boolean} true/false if it should automatically reconnect
   * @return {Manager} self or value
   * @api public
   */Manager.prototype.reconnection=function(v){if(!arguments.length)return this._reconnection;this._reconnection=!!v;return this;};/**
   * Sets the reconnection attempts config.
   *
   * @param {Number} max reconnection attempts before giving up
   * @return {Manager} self or value
   * @api public
   */Manager.prototype.reconnectionAttempts=function(v){if(!arguments.length)return this._reconnectionAttempts;this._reconnectionAttempts=v;return this;};/**
   * Sets the delay between reconnections.
   *
   * @param {Number} delay
   * @return {Manager} self or value
   * @api public
   */Manager.prototype.reconnectionDelay=function(v){if(!arguments.length)return this._reconnectionDelay;this._reconnectionDelay=v;this.backoff&&this.backoff.setMin(v);return this;};Manager.prototype.randomizationFactor=function(v){if(!arguments.length)return this._randomizationFactor;this._randomizationFactor=v;this.backoff&&this.backoff.setJitter(v);return this;};/**
   * Sets the maximum delay between reconnections.
   *
   * @param {Number} delay
   * @return {Manager} self or value
   * @api public
   */Manager.prototype.reconnectionDelayMax=function(v){if(!arguments.length)return this._reconnectionDelayMax;this._reconnectionDelayMax=v;this.backoff&&this.backoff.setMax(v);return this;};/**
   * Sets the connection timeout. `false` to disable
   *
   * @return {Manager} self or value
   * @api public
   */Manager.prototype.timeout=function(v){if(!arguments.length)return this._timeout;this._timeout=v;return this;};/**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @api private
   */Manager.prototype.maybeReconnectOnOpen=function(){// Only try to reconnect if it's the first time we're connecting
if(!this.reconnecting&&this._reconnection&&this.backoff.attempts===0){// keeps reconnection from firing twice for the same reconnection loop
this.reconnect();}};/**
   * Sets the current transport `socket`.
   *
   * @param {Function} optional, callback
   * @return {Manager} self
   * @api public
   */Manager.prototype.open=Manager.prototype.connect=function(fn,opts){debug$8('readyState %s',this.readyState);if(~this.readyState.indexOf('open'))return this;debug$8('opening %s',this.uri);this.engine=lib$1(this.uri,this.opts);var socket=this.engine;var self=this;this.readyState='opening';this.skipReconnect=false;// emit `open`
var openSub=on_1(socket,'open',function(){self.onopen();fn&&fn();});// emit `connect_error`
var errorSub=on_1(socket,'error',function(data){debug$8('connect_error');self.cleanup();self.readyState='closed';self.emitAll('connect_error',data);if(fn){var err=new Error('Connection error');err.data=data;fn(err);}else{// Only do this if there is no fn to handle the error
self.maybeReconnectOnOpen();}});// emit `connect_timeout`
if(false!==this._timeout){var timeout=this._timeout;debug$8('connect attempt will timeout after %d',timeout);// set timer
var timer=setTimeout(function(){debug$8('connect attempt timed out after %d',timeout);openSub.destroy();socket.close();socket.emit('error','timeout');self.emitAll('connect_timeout',timeout);},timeout);this.subs.push({destroy:function destroy(){clearTimeout(timer);}});}this.subs.push(openSub);this.subs.push(errorSub);return this;};/**
   * Called upon transport open.
   *
   * @api private
   */Manager.prototype.onopen=function(){debug$8('open');// clear old subs
this.cleanup();// mark as open
this.readyState='open';this.emit('open');// add new subs
var socket=this.engine;this.subs.push(on_1(socket,'data',componentBind(this,'ondata')));this.subs.push(on_1(socket,'ping',componentBind(this,'onping')));this.subs.push(on_1(socket,'pong',componentBind(this,'onpong')));this.subs.push(on_1(socket,'error',componentBind(this,'onerror')));this.subs.push(on_1(socket,'close',componentBind(this,'onclose')));this.subs.push(on_1(this.decoder,'decoded',componentBind(this,'ondecoded')));};/**
   * Called upon a ping.
   *
   * @api private
   */Manager.prototype.onping=function(){this.lastPing=new Date();this.emitAll('ping');};/**
   * Called upon a packet.
   *
   * @api private
   */Manager.prototype.onpong=function(){this.emitAll('pong',new Date()-this.lastPing);};/**
   * Called with data.
   *
   * @api private
   */Manager.prototype.ondata=function(data){this.decoder.add(data);};/**
   * Called when parser fully decodes a packet.
   *
   * @api private
   */Manager.prototype.ondecoded=function(packet){this.emit('packet',packet);};/**
   * Called upon socket error.
   *
   * @api private
   */Manager.prototype.onerror=function(err){debug$8('error',err);this.emitAll('error',err);};/**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @api public
   */Manager.prototype.socket=function(nsp,opts){var socket=this.nsps[nsp];if(!socket){socket=new socket$1(this,nsp,opts);this.nsps[nsp]=socket;var self=this;socket.on('connecting',onConnecting);socket.on('connect',function(){socket.id=self.generateId(nsp);});if(this.autoConnect){// manually call here since connecting event is fired before listening
onConnecting();}}function onConnecting(){if(!~indexof(self.connecting,socket)){self.connecting.push(socket);}}return socket;};/**
   * Called upon a socket close.
   *
   * @param {Socket} socket
   */Manager.prototype.destroy=function(socket){var index=indexof(this.connecting,socket);if(~index)this.connecting.splice(index,1);if(this.connecting.length)return;this.close();};/**
   * Writes a packet.
   *
   * @param {Object} packet
   * @api private
   */Manager.prototype.packet=function(packet){debug$8('writing packet %j',packet);var self=this;if(packet.query&&packet.type===0)packet.nsp+='?'+packet.query;if(!self.encoding){// encode, then write to engine with result
self.encoding=true;this.encoder.encode(packet,function(encodedPackets){for(var i=0;i<encodedPackets.length;i++){self.engine.write(encodedPackets[i],packet.options);}self.encoding=false;self.processPacketQueue();});}else{// add packet to the queue
self.packetBuffer.push(packet);}};/**
   * If packet buffer is non-empty, begins encoding the
   * next packet in line.
   *
   * @api private
   */Manager.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var pack=this.packetBuffer.shift();this.packet(pack);}};/**
   * Clean up transport subscriptions and packet buffer.
   *
   * @api private
   */Manager.prototype.cleanup=function(){debug$8('cleanup');var subsLength=this.subs.length;for(var i=0;i<subsLength;i++){var sub=this.subs.shift();sub.destroy();}this.packetBuffer=[];this.encoding=false;this.lastPing=null;this.decoder.destroy();};/**
   * Close the current socket.
   *
   * @api private
   */Manager.prototype.close=Manager.prototype.disconnect=function(){debug$8('disconnect');this.skipReconnect=true;this.reconnecting=false;if('opening'===this.readyState){// `onclose` will not fire because
// an open event never happened
this.cleanup();}this.backoff.reset();this.readyState='closed';if(this.engine)this.engine.close();};/**
   * Called upon engine close.
   *
   * @api private
   */Manager.prototype.onclose=function(reason){debug$8('onclose');this.cleanup();this.backoff.reset();this.readyState='closed';this.emit('close',reason);if(this._reconnection&&!this.skipReconnect){this.reconnect();}};/**
   * Attempt a reconnection.
   *
   * @api private
   */Manager.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var self=this;if(this.backoff.attempts>=this._reconnectionAttempts){debug$8('reconnect failed');this.backoff.reset();this.emitAll('reconnect_failed');this.reconnecting=false;}else{var delay=this.backoff.duration();debug$8('will wait %dms before reconnect attempt',delay);this.reconnecting=true;var timer=setTimeout(function(){if(self.skipReconnect)return;debug$8('attempting reconnect');self.emitAll('reconnect_attempt',self.backoff.attempts);self.emitAll('reconnecting',self.backoff.attempts);// check again for the case socket closed in above events
if(self.skipReconnect)return;self.open(function(err){if(err){debug$8('reconnect attempt error');self.reconnecting=false;self.reconnect();self.emitAll('reconnect_error',err.data);}else{debug$8('reconnect success');self.onreconnect();}});},delay);this.subs.push({destroy:function destroy(){clearTimeout(timer);}});}};/**
   * Called upon successful reconnect.
   *
   * @api private
   */Manager.prototype.onreconnect=function(){var attempt=this.backoff.attempts;this.reconnecting=false;this.backoff.reset();this.updateSocketIds();this.emitAll('reconnect',attempt);};var lib$2=createCommonjsModule(function(module,exports){/**
   * Module dependencies.
   */var debug=browser('socket.io-client');/**
   * Module exports.
   */module.exports=exports=lookup;/**
   * Managers cache.
   */var cache=exports.managers={};/**
   * Looks up an existing `Manager` for multiplexing.
   * If the user summons:
   *
   *   `io('http://localhost/a');`
   *   `io('http://localhost/b');`
   *
   * We reuse the existing instance based on same scheme/port/host,
   * and we initialize sockets for each namespace.
   *
   * @api public
   */function lookup(uri,opts){if(_typeof2(uri)==='object'){opts=uri;uri=undefined;}opts=opts||{};var parsed=url_1(uri);var source=parsed.source;var id=parsed.id;var path=parsed.path;var sameNamespace=cache[id]&&path in cache[id].nsps;var newConnection=opts.forceNew||opts['force new connection']||false===opts.multiplex||sameNamespace;var io;if(newConnection){debug('ignoring socket cache for %s',source);io=manager(source,opts);}else{if(!cache[id]){debug('new io instance for %s',source);cache[id]=manager(source,opts);}io=cache[id];}if(parsed.query&&!opts.query){opts.query=parsed.query;}return io.socket(parsed.path,opts);}/**
   * Protocol version.
   *
   * @api public
   */exports.protocol=socket_ioParser.protocol;/**
   * `connect`.
   *
   * @param {String} uri
   * @api public
   */exports.connect=lookup;/**
   * Expose constructors for standalone build.
   *
   * @api public
   */exports.Manager=manager;exports.Socket=socket$1;});var lib_1=lib$2.managers;var lib_2=lib$2.protocol;var lib_3=lib$2.connect;var lib_4=lib$2.Manager;var lib_5=lib$2.Socket;var SIXTY_PER_SEC=1000/60;var LOOP_SLOW_THRESH=0.3;var LOOP_SLOW_COUNT=10;/**
   * Scheduler class
   *
   */var Scheduler=/*#__PURE__*/function(){/**
     * schedule a function to be called
     *
     * @param {Object} options the options
     * @param {Function} options.tick the function to be called
     * @param {Number} options.period number of milliseconds between each invocation, not including the function's execution time
     * @param {Number} options.delay number of milliseconds to add when delaying or hurrying the execution
     */function Scheduler(options){_classCallCheck(this,Scheduler);this.options=Object.assign({tick:null,period:SIXTY_PER_SEC,delay:SIXTY_PER_SEC/3},options);this.nextExecTime=null;this.requestedDelay=0;this.delayCounter=0;// mixin for EventEmitter
var eventEmitter$1=new eventEmitter();this.on=eventEmitter$1.on;this.once=eventEmitter$1.once;this.removeListener=eventEmitter$1.removeListener;this.emit=eventEmitter$1.emit;}// in same cases, setTimeout is ignored by the browser,
// this is known to happen during the first 100ms of a touch event
// on android chrome.  Double-check the game loop using requestAnimationFrame
_createClass(Scheduler,[{key:"nextTickChecker",value:function nextTickChecker(){var currentTime=new Date().getTime();if(currentTime>this.nextExecTime){this.delayCounter++;this.callTick();this.nextExecTime=currentTime+this.options.stepPeriod;}window.requestAnimationFrame(this.nextTickChecker.bind(this));}},{key:"nextTick",value:function nextTick(){var stepStartTime=new Date().getTime();if(stepStartTime>this.nextExecTime+this.options.period*LOOP_SLOW_THRESH){this.delayCounter++;}else this.delayCounter=0;this.callTick();this.nextExecTime=stepStartTime+this.options.period+this.requestedDelay;this.requestedDelay=0;setTimeout(this.nextTick.bind(this),this.nextExecTime-new Date().getTime());}},{key:"callTick",value:function callTick(){if(this.delayCounter>=LOOP_SLOW_COUNT){this.emit('loopRunningSlow');this.delayCounter=0;}this.options.tick();}/**
       * start the schedule
       * @return {Scheduler} returns this scheduler instance
       */},{key:"start",value:function start(){setTimeout(this.nextTick.bind(this));if((typeof window==="undefined"?"undefined":_typeof(window))==='object'&&typeof window.requestAnimationFrame==='function')window.requestAnimationFrame(this.nextTickChecker.bind(this));return this;}/**
       * delay next execution
       */},{key:"delayTick",value:function delayTick(){this.requestedDelay+=this.options.delay;}/**
       * hurry the next execution
       */},{key:"hurryTick",value:function hurryTick(){this.requestedDelay-=this.options.delay;}}]);return Scheduler;}();var SyncStrategy=/*#__PURE__*/function(){function SyncStrategy(clientEngine,inputOptions){_classCallCheck(this,SyncStrategy);this.clientEngine=clientEngine;this.gameEngine=clientEngine.gameEngine;this.options=Object.assign({},inputOptions);this.gameEngine.on('client__postStep',this.syncStep.bind(this));this.gameEngine.on('client__syncReceived',this.collectSync.bind(this));this.requiredSyncs=[];this.SYNC_APPLIED='SYNC_APPLIED';this.STEP_DRIFT_THRESHOLDS={onServerSync:{MAX_LEAD:1,MAX_LAG:3},// max step lead/lag allowed after every server sync
onEveryStep:{MAX_LEAD:7,MAX_LAG:8},// max step lead/lag allowed at every step
clientReset:20// if we are behind this many steps, just reset the step counter
};}// collect a sync and its events
// maintain a "lastSync" member which describes the last sync we received from
// the server.  the lastSync object contains:
//  - syncObjects: all events in the sync indexed by the id of the object involved
//  - syncSteps: all events in the sync indexed by the step on which they occurred
//  - objCount
//  - eventCount
//  - stepCount
_createClass(SyncStrategy,[{key:"collectSync",value:function collectSync(e){// on first connect we need to wait for a full world update
if(this.needFirstSync){if(!e.fullUpdate)return;}else{// TODO: there is a problem below in the case where the client is 10 steps behind the server,
// and the syncs that arrive are always in the future and never get processed.  To address this
// we may need to store more than one sync.
// ignore syncs which are older than the latest
if(this.lastSync&&this.lastSync.stepCount&&this.lastSync.stepCount>e.stepCount)return;}// before we overwrite the last sync, check if it was a required sync
// syncs that create or delete objects are saved because they must be applied.
if(this.lastSync&&this.lastSync.required){this.requiredSyncs.push(this.lastSync);}// build new sync object
var lastSync=this.lastSync={stepCount:e.stepCount,fullUpdate:e.fullUpdate,syncObjects:{},syncSteps:{}};e.syncEvents.forEach(function(sEvent){// keep a reference of events by object id
if(sEvent.objectInstance){var objectId=sEvent.objectInstance.id;if(!lastSync.syncObjects[objectId])lastSync.syncObjects[objectId]=[];lastSync.syncObjects[objectId].push(sEvent);}// keep a reference of events by step
var stepCount=sEvent.stepCount;var eventName=sEvent.eventName;if(eventName==='objectDestroy'||eventName==='objectCreate')lastSync.required=true;if(!lastSync.syncSteps[stepCount])lastSync.syncSteps[stepCount]={};if(!lastSync.syncSteps[stepCount][eventName])lastSync.syncSteps[stepCount][eventName]=[];lastSync.syncSteps[stepCount][eventName].push(sEvent);});var eventCount=e.syncEvents.length;var objCount=Object.keys(lastSync.syncObjects).length;var stepCount=Object.keys(lastSync.syncSteps).length;this.gameEngine.trace.debug(function(){return"sync contains ".concat(objCount," objects ").concat(eventCount," events ").concat(stepCount," steps");});}// add an object to our world
},{key:"addNewObject",value:function addNewObject(objId,newObj,options){var curObj=new newObj.constructor(this.gameEngine,{id:objId});// enforce object implementations of syncTo
if(!curObj.__proto__.hasOwnProperty('syncTo')){throw"GameObject of type ".concat(curObj.class," does not implement the syncTo() method, which must copy the netscheme");}curObj.syncTo(newObj);this.gameEngine.addObjectToWorld(curObj);if(this.clientEngine.options.verbose)console.log("adding new object ".concat(curObj));return curObj;}// sync to step, by applying bending, and applying the latest sync
},{key:"syncStep",value:function syncStep(stepDesc){var _this=this;// apply incremental bending
this.gameEngine.world.forEachObject(function(id,o){if(typeof o.applyIncrementalBending==='function'){o.applyIncrementalBending(stepDesc);o.refreshToPhysics();}});// apply all pending required syncs
var _loop=function _loop(){var requiredStep=_this.requiredSyncs[0].stepCount;// if we haven't reached the corresponding step, it's too soon to apply syncs
if(requiredStep>_this.gameEngine.world.stepCount)return{v:void 0};_this.gameEngine.trace.trace(function(){return"applying a required sync ".concat(requiredStep);});_this.applySync(_this.requiredSyncs.shift(),true);};while(this.requiredSyncs.length){var _ret=_loop();if(_typeof(_ret)==="object")return _ret.v;}// apply the sync and delete it on success
if(this.lastSync){var rc=this.applySync(this.lastSync,false);if(rc===this.SYNC_APPLIED)this.lastSync=null;}}}]);return SyncStrategy;}();var defaults={clientStepHold:6,localObjBending:1.0,// amount of bending towards position of sync object
remoteObjBending:1.0,// amount of bending towards position of sync object
bendingIncrements:6,// the bending should be applied increments (how many steps for entire bend)
reflect:false};var InterpolateStrategy=/*#__PURE__*/function(_SyncStrategy){_inherits(InterpolateStrategy,_SyncStrategy);function InterpolateStrategy(clientEngine,inputOptions){var _this;_classCallCheck(this,InterpolateStrategy);var options=Object.assign({},defaults,inputOptions);_this=_possibleConstructorReturn(this,_getPrototypeOf(InterpolateStrategy).call(this,clientEngine,options));_this.gameEngine.ignoreInputs=true;// client side engine ignores inputs
_this.gameEngine.ignorePhysics=true;// client side engine ignores physics
_this.STEP_DRIFT_THRESHOLDS={onServerSync:{MAX_LEAD:-8,MAX_LAG:16},// max step lead/lag allowed after every server sync
onEveryStep:{MAX_LEAD:-4,MAX_LAG:24},// max step lead/lag allowed at every step
clientReset:40// if we are behind this many steps, just reset the step counter
};return _this;}// apply a new sync
_createClass(InterpolateStrategy,[{key:"applySync",value:function applySync(sync,required){var _this2=this;// if sync is in the past we cannot interpolate to it
if(!required&&sync.stepCount<=this.gameEngine.world.stepCount){return this.SYNC_APPLIED;}this.gameEngine.trace.debug(function(){return'interpolate applying sync';});//
//    scan all the objects in the sync
//
// 1. if the object exists locally, sync to the server object
// 2. if the object is new, just create it
//
this.needFirstSync=false;var world=this.gameEngine.world;var _arr=Object.keys(sync.syncObjects);var _loop=function _loop(){var ids=_arr[_i];// TODO: we are currently taking only the first event out of
// the events that may have arrived for this object
var ev=sync.syncObjects[ids][0];var curObj=world.objects[ev.objectInstance.id];if(curObj){// case 1: this object already exists locally
_this2.gameEngine.trace.trace(function(){return"object before syncTo: ".concat(curObj.toString());});curObj.saveState();curObj.syncTo(ev.objectInstance);_this2.gameEngine.trace.trace(function(){return"object after syncTo: ".concat(curObj.toString()," synced to step[").concat(ev.stepCount,"]");});}else{// case 2: object does not exist.  create it now
_this2.addNewObject(ev.objectInstance.id,ev.objectInstance);}};for(var _i=0;_i<_arr.length;_i++){_loop();}//
// bend back to original state
//
var _arr2=Object.keys(world.objects);var _loop2=function _loop2(){var objId=_arr2[_i2];var obj=world.objects[objId];var isLocal=obj.playerId==_this2.gameEngine.playerId;// eslint-disable-line eqeqeq
var bending=isLocal?_this2.options.localObjBending:_this2.options.remoteObjBending;obj.bendToCurrentState(bending,_this2.gameEngine.worldSettings,isLocal,_this2.options.bendingIncrements);if(typeof obj.refreshRenderObject==='function')obj.refreshRenderObject();_this2.gameEngine.trace.trace(function(){return"object[".concat(objId,"] ").concat(obj.bendingToString());});};for(var _i2=0;_i2<_arr2.length;_i2++){_loop2();}// destroy objects
// TODO: use world.forEachObject((id, ob) => {});
// TODO: identical code is in InterpolateStrategy
var _arr3=Object.keys(world.objects);var _loop3=function _loop3(){var objId=_arr3[_i3];var objEvents=sync.syncObjects[objId];// if this was a full sync, and we did not get a corresponding object,
// remove the local object
if(sync.fullUpdate&&!objEvents&&objId<_this2.gameEngine.options.clientIDSpace){_this2.gameEngine.removeObjectFromWorld(objId);return"continue";}if(!objEvents||objId>=_this2.gameEngine.options.clientIDSpace)return"continue";// if we got an objectDestroy event, destroy the object
objEvents.forEach(function(e){if(e.eventName==='objectDestroy')_this2.gameEngine.removeObjectFromWorld(objId);});};for(var _i3=0;_i3<_arr3.length;_i3++){var _ret=_loop3();if(_ret==="continue")continue;}return this.SYNC_APPLIED;}}]);return InterpolateStrategy;}(SyncStrategy);var defaults$1={syncsBufferLength:5,maxReEnactSteps:60,// maximum number of steps to re-enact
RTTEstimate:2,// estimate the RTT as two steps (for updateRate=6, that's 200ms)
extrapolate:2,// player performs method "X" which means extrapolate to match server time. that 100 + (0..100)
localObjBending:0.1,// amount of bending towards position of sync object
remoteObjBending:0.6,// amount of bending towards position of sync object
bendingIncrements:10// the bending should be applied increments (how many steps for entire bend)
};var ExtrapolateStrategy=/*#__PURE__*/function(_SyncStrategy){_inherits(ExtrapolateStrategy,_SyncStrategy);function ExtrapolateStrategy(clientEngine,inputOptions){var _this;_classCallCheck(this,ExtrapolateStrategy);var options=Object.assign({},defaults$1,inputOptions);_this=_possibleConstructorReturn(this,_getPrototypeOf(ExtrapolateStrategy).call(this,clientEngine,options));_this.lastSync=null;_this.needFirstSync=true;_this.recentInputs={};_this.gameEngine.on('client__processInput',_this.clientInputSave.bind(_assertThisInitialized(_this)));_this.STEP_DRIFT_THRESHOLDS={onServerSync:{MAX_LEAD:2,MAX_LAG:3},// max step lead/lag allowed after every server sync
onEveryStep:{MAX_LEAD:7,MAX_LAG:4},// max step lead/lag allowed at every step
clientReset:40// if we are behind this many steps, just reset the step counter
};return _this;}// keep a buffer of inputs so that we can replay them on extrapolation
_createClass(ExtrapolateStrategy,[{key:"clientInputSave",value:function clientInputSave(inputEvent){// if no inputs have been stored for this step, create an array
if(!this.recentInputs[inputEvent.input.step]){this.recentInputs[inputEvent.input.step]=[];}this.recentInputs[inputEvent.input.step].push(inputEvent.input);}// clean up the input buffer
},{key:"cleanRecentInputs",value:function cleanRecentInputs(lastServerStep){var _arr=Object.keys(this.recentInputs);for(var _i=0;_i<_arr.length;_i++){var input=_arr[_i];if(this.recentInputs[input][0].step<=lastServerStep){delete this.recentInputs[input];}}}// apply a new sync
},{key:"applySync",value:function applySync(sync,required){var _this2=this;// if sync is in the future, we are not ready to apply yet.
if(!required&&sync.stepCount>this.gameEngine.world.stepCount){return null;}this.gameEngine.trace.debug(function(){return'extrapolate applying sync';});//
//    scan all the objects in the sync
//
// 1. if the object has a local shadow, adopt the server object,
//    and destroy the shadow
//
// 2. if the object exists locally, sync to the server object,
//    later we will re-enact the missing steps and then bend to
//    the current position
//
// 3. if the object is new, just create it
//
this.needFirstSync=false;var world=this.gameEngine.world;var serverStep=sync.stepCount;var _arr2=Object.keys(sync.syncObjects);var _loop=function _loop(){var ids=_arr2[_i2];// TODO: we are currently taking only the first event out of
// the events that may have arrived for this object
var ev=sync.syncObjects[ids][0];var curObj=world.objects[ev.objectInstance.id];var localShadowObj=_this2.gameEngine.findLocalShadow(ev.objectInstance);if(localShadowObj){// case 1: this object has a local shadow object on the client
_this2.gameEngine.trace.debug(function(){return"object ".concat(ev.objectInstance.id," replacing local shadow ").concat(localShadowObj.id);});if(!world.objects.hasOwnProperty(ev.objectInstance.id)){var newObj=_this2.addNewObject(ev.objectInstance.id,ev.objectInstance,{visible:false});newObj.saveState(localShadowObj);}_this2.gameEngine.removeObjectFromWorld(localShadowObj.id);}else if(curObj){// case 2: this object already exists locally
_this2.gameEngine.trace.trace(function(){return"object before syncTo: ".concat(curObj.toString());});curObj.saveState();curObj.syncTo(ev.objectInstance);_this2.gameEngine.trace.trace(function(){return"object after syncTo: ".concat(curObj.toString()," synced to step[").concat(ev.stepCount,"]");});}else{// case 3: object does not exist.  create it now
_this2.addNewObject(ev.objectInstance.id,ev.objectInstance);}};for(var _i2=0;_i2<_arr2.length;_i2++){_loop();}//
// reenact the steps that we want to extrapolate forwards
//
this.gameEngine.trace.debug(function(){return"extrapolate re-enacting steps from [".concat(serverStep,"] to [").concat(world.stepCount,"]");});if(serverStep<world.stepCount-this.options.maxReEnactSteps){serverStep=world.stepCount-this.options.maxReEnactSteps;this.gameEngine.trace.info(function(){return"too many steps to re-enact.  Starting from [".concat(serverStep,"] to [").concat(world.stepCount,"]");});}var clientStep=world.stepCount;for(world.stepCount=serverStep;world.stepCount<clientStep;){if(this.recentInputs[world.stepCount]){this.recentInputs[world.stepCount].forEach(function(inputDesc){// only movement inputs are re-enacted
if(!inputDesc.options||!inputDesc.options.movement)return;_this2.gameEngine.trace.trace(function(){return"extrapolate re-enacting movement input[".concat(inputDesc.messageIndex,"]: ").concat(inputDesc.input);});_this2.gameEngine.processInput(inputDesc,_this2.gameEngine.playerId);});}// run the game engine step in "reenact" mode
this.gameEngine.step(true);}this.cleanRecentInputs(serverStep);//
// bend back to original state
//
var _arr3=Object.keys(world.objects);var _loop2=function _loop2(){var objId=_arr3[_i3];// shadow objects are not bent
if(objId>=_this2.gameEngine.options.clientIDSpace)return"continue";// TODO: using == instead of === because of string/number mismatch
//       These values should always be strings (which contain a number)
//       Reminder: the reason we use a string is that these
//       values are sometimes used as object keys
var obj=world.objects[objId];var isLocal=obj.playerId==_this2.gameEngine.playerId;// eslint-disable-line eqeqeq
var bending=isLocal?_this2.options.localObjBending:_this2.options.remoteObjBending;obj.bendToCurrentState(bending,_this2.gameEngine.worldSettings,isLocal,_this2.options.bendingIncrements);if(typeof obj.refreshRenderObject==='function')obj.refreshRenderObject();_this2.gameEngine.trace.trace(function(){return"object[".concat(objId,"] ").concat(obj.bendingToString());});};for(var _i3=0;_i3<_arr3.length;_i3++){var _ret=_loop2();if(_ret==="continue")continue;}// trace object state after sync
var _arr4=Object.keys(world.objects);var _loop3=function _loop3(){var objId=_arr4[_i4];_this2.gameEngine.trace.trace(function(){return"object after extrapolate replay: ".concat(world.objects[objId].toString());});};for(var _i4=0;_i4<_arr4.length;_i4++){_loop3();}// destroy objects
// TODO: use world.forEachObject((id, ob) => {});
// TODO: identical code is in InterpolateStrategy
var _arr5=Object.keys(world.objects);var _loop4=function _loop4(){var objId=_arr5[_i5];var objEvents=sync.syncObjects[objId];// if this was a full sync, and we did not get a corresponding object,
// remove the local object
if(sync.fullUpdate&&!objEvents&&objId<_this2.gameEngine.options.clientIDSpace){_this2.gameEngine.removeObjectFromWorld(objId);return"continue";}if(!objEvents||objId>=_this2.gameEngine.options.clientIDSpace)return"continue";// if we got an objectDestroy event, destroy the object
objEvents.forEach(function(e){if(e.eventName==='objectDestroy')_this2.gameEngine.removeObjectFromWorld(objId);});};for(var _i5=0;_i5<_arr5.length;_i5++){var _ret2=_loop4();if(_ret2==="continue")continue;}return this.SYNC_APPLIED;}}]);return ExtrapolateStrategy;}(SyncStrategy);var defaults$2={worldBufferLength:60,clientStepLag:0};var FrameSyncStrategy=/*#__PURE__*/function(_SyncStrategy){_inherits(FrameSyncStrategy,_SyncStrategy);function FrameSyncStrategy(clientEngine,inputOptions){var _this;_classCallCheck(this,FrameSyncStrategy);_this=_possibleConstructorReturn(this,_getPrototypeOf(FrameSyncStrategy).call(this,clientEngine,inputOptions));_this.options=Object.assign(defaults$2,inputOptions);_this.gameEngine=_this.clientEngine.gameEngine;_this.gameEngine.on('postStep',_this.frameSync.bind(_assertThisInitialized(_this)));_this.gameEngine.on('client__syncReceived',_this.keepSnapshot.bind(_assertThisInitialized(_this)));return _this;}// keep snapshot if it's the most recent we've seen
_createClass(FrameSyncStrategy,[{key:"keepSnapshot",value:function keepSnapshot(e){if(!this.latestSnapshot||e.snapshot.stepCount>this.latestSnapshot.stepCount){this.latestSnapshot=e.snapshot;}}/**
       * Perform client-side interpolation.
       */},{key:"frameSync",value:function frameSync(){var world=this.gameEngine.world;var nextWorld=this.latestSnapshot;// see if we need to sync
// TODO: might as well exit this function now if (nextWorld.step == world.step)
if(!nextWorld){return;}// create new objects, interpolate existing objects
for(var objId in nextWorld.objects){if(nextWorld.objects.hasOwnProperty(objId)){var curObj=null;var nextObj=nextWorld.objects[objId];// if the object is new, add it
if(!world.objects.hasOwnProperty(objId)){curObj=new nextObj.constructor();curObj.copyFrom(nextObj);world.objects[objId]=curObj;curObj.init({velX:nextObj.velX,velY:nextObj.velY,velZ:nextObj.velZ});curObj.initRenderObject(this.gameEngine.renderer);// if this game keeps a physics engine on the client side,
// we need to update it as well
if(this.gameEngine.physicsEngine){curObj.initPhysicsObject(this.gameEngine.physicsEngine);}}else{curObj=world.objects[objId];curObj.copy(nextObj);}// update render sub-object
curObj.updateRenderObject();}}}}]);return FrameSyncStrategy;}(SyncStrategy);var strategies={extrapolate:ExtrapolateStrategy,interpolate:InterpolateStrategy,frameSync:FrameSyncStrategy};var Synchronizer=// create a synchronizer instance
function Synchronizer(clientEngine,options){_classCallCheck(this,Synchronizer);this.clientEngine=clientEngine;this.options=options||{};if(!strategies.hasOwnProperty(this.options.sync)){throw new Error("ERROR: unknown synchronzation strategy ".concat(this.options.sync));}this.syncStrategy=new strategies[this.options.sync](this.clientEngine,this.options);};var MAX_UINT_16=0xFFFF;/**
   * The Serializer is responsible for serializing the game world and its
   * objects on the server, before they are sent to each client.  On the client side the
   * Serializer deserializes these objects.
   *
   */var Serializer=/*#__PURE__*/function(){function Serializer(){_classCallCheck(this,Serializer);this.registeredClasses={};this.customTypes={};this.registerClass(TwoVector);this.registerClass(ThreeVector);this.registerClass(Quaternion);}/**
     * Adds a custom primitive to the serializer instance.
     * This will enable you to use it in an object's netScheme
     * @param customType
     */ // TODO: the function below is not used, and it is not clear what that
// first argument is supposed to be
_createClass(Serializer,[{key:"addCustomType",value:function addCustomType(customType){this.customTypes[customType.type]=customType;}/**
       * Checks if type can be assigned by value.
       * @param {String} type Type to Checks
       * @return {Boolean} True if type can be assigned
       */},{key:"registerClass",/**
       * Registers a new class with the serializer, so it may be deserialized later
       * @param {Function} classObj reference to the class (not an instance!)
       * @param {String} classId Unit specifying a class ID
       */value:function registerClass(classObj,classId){// if no classId is specified, hash one from the class name
classId=classId?classId:Utils$1.hashStr(classObj.name);if(this.registeredClasses[classId]){console.error("Serializer: accidental override of classId ".concat(classId," when registering class"),classObj);}this.registeredClasses[classId]=classObj;}},{key:"deserialize",value:function deserialize(dataBuffer,byteOffset){byteOffset=byteOffset?byteOffset:0;var localByteOffset=0;var dataView=new DataView(dataBuffer);var objectClassId=dataView.getUint8(byteOffset+localByteOffset);// todo if classId is 0 - take care of dynamic serialization.
var objectClass=this.registeredClasses[objectClassId];if(objectClass==null){console.error('Serializer: Found a class which was not registered.  Please use serializer.registerClass() to register all serialized classes.');}localByteOffset+=Uint8Array.BYTES_PER_ELEMENT;// advance the byteOffset after the classId
// create de-referenced instance of the class. gameEngine and id will be 'tacked on' later at the sync strategies
var obj=new objectClass(null,{id:null});var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=Object.keys(objectClass.netScheme).sort()[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var property=_step.value;var read=this.readDataView(dataView,byteOffset+localByteOffset,objectClass.netScheme[property]);obj[property]=read.data;localByteOffset+=read.bufferSize;}}catch(err){_didIteratorError=true;_iteratorError=err;}finally{try{if(!_iteratorNormalCompletion&&_iterator.return!=null){_iterator.return();}}finally{if(_didIteratorError){throw _iteratorError;}}}return{obj:obj,byteOffset:localByteOffset};}},{key:"writeDataView",value:function writeDataView(dataView,value,bufferOffset,netSchemProp){if(netSchemProp.type===BaseTypes.TYPES.FLOAT32){dataView.setFloat32(bufferOffset,value);}else if(netSchemProp.type===BaseTypes.TYPES.INT32){dataView.setInt32(bufferOffset,value);}else if(netSchemProp.type===BaseTypes.TYPES.INT16){dataView.setInt16(bufferOffset,value);}else if(netSchemProp.type===BaseTypes.TYPES.INT8){dataView.setInt8(bufferOffset,value);}else if(netSchemProp.type===BaseTypes.TYPES.UINT8){dataView.setUint8(bufferOffset,value);}else if(netSchemProp.type===BaseTypes.TYPES.STRING){//   MAX_UINT_16 is a reserved (length) value which indicates string hasn't changed
if(value===null){dataView.setUint16(bufferOffset,MAX_UINT_16);}else{var strLen=value.length;dataView.setUint16(bufferOffset,strLen);var localBufferOffset=2;for(var i=0;i<strLen;i++){dataView.setUint16(bufferOffset+localBufferOffset+i*2,value.charCodeAt(i));}}}else if(netSchemProp.type===BaseTypes.TYPES.CLASSINSTANCE){value.serialize(this,{dataBuffer:dataView.buffer,bufferOffset:bufferOffset});}else if(netSchemProp.type===BaseTypes.TYPES.LIST){var _localBufferOffset=0;// a list is comprised of the number of items followed by the items
dataView.setUint16(bufferOffset+_localBufferOffset,value.length);_localBufferOffset+=Uint16Array.BYTES_PER_ELEMENT;var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=value[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var item=_step2.value;// TODO: inelegant, currently doesn't support list of lists
if(netSchemProp.itemType===BaseTypes.TYPES.CLASSINSTANCE){var serializedObj=item.serialize(this,{dataBuffer:dataView.buffer,bufferOffset:bufferOffset+_localBufferOffset});_localBufferOffset+=serializedObj.bufferOffset;}else if(netSchemProp.itemType===BaseTypes.TYPES.STRING){//   MAX_UINT_16 is a reserved (length) value which indicates string hasn't changed
if(item===null){dataView.setUint16(bufferOffset+_localBufferOffset,MAX_UINT_16);_localBufferOffset+=Uint16Array.BYTES_PER_ELEMENT;}else{var _strLen=item.length;dataView.setUint16(bufferOffset+_localBufferOffset,_strLen);_localBufferOffset+=Uint16Array.BYTES_PER_ELEMENT;for(var _i=0;_i<_strLen;_i++){dataView.setUint16(bufferOffset+_localBufferOffset+_i*2,item.charCodeAt(_i));}_localBufferOffset+=Uint16Array.BYTES_PER_ELEMENT*_strLen;}}else{this.writeDataView(dataView,item,bufferOffset+_localBufferOffset,{type:netSchemProp.itemType});_localBufferOffset+=this.getTypeByteSize(netSchemProp.itemType);}}}catch(err){_didIteratorError2=true;_iteratorError2=err;}finally{try{if(!_iteratorNormalCompletion2&&_iterator2.return!=null){_iterator2.return();}}finally{if(_didIteratorError2){throw _iteratorError2;}}}}else if(this.customTypes[netSchemProp.type]){// this is a custom data property which needs to define its own write method
this.customTypes[netSchemProp.type].writeDataView(dataView,value,bufferOffset);}else{console.error("No custom property ".concat(netSchemProp.type," found!"));}}},{key:"readDataView",value:function readDataView(dataView,bufferOffset,netSchemProp){var data,bufferSize;if(netSchemProp.type===BaseTypes.TYPES.FLOAT32){data=dataView.getFloat32(bufferOffset);bufferSize=this.getTypeByteSize(netSchemProp.type);}else if(netSchemProp.type===BaseTypes.TYPES.INT32){data=dataView.getInt32(bufferOffset);bufferSize=this.getTypeByteSize(netSchemProp.type);}else if(netSchemProp.type===BaseTypes.TYPES.INT16){data=dataView.getInt16(bufferOffset);bufferSize=this.getTypeByteSize(netSchemProp.type);}else if(netSchemProp.type===BaseTypes.TYPES.INT8){data=dataView.getInt8(bufferOffset);bufferSize=this.getTypeByteSize(netSchemProp.type);}else if(netSchemProp.type===BaseTypes.TYPES.UINT8){data=dataView.getUint8(bufferOffset);bufferSize=this.getTypeByteSize(netSchemProp.type);}else if(netSchemProp.type===BaseTypes.TYPES.STRING){var length=dataView.getUint16(bufferOffset);var localBufferOffset=Uint16Array.BYTES_PER_ELEMENT;bufferSize=localBufferOffset;if(length===MAX_UINT_16){data=null;}else{var a=[];for(var i=0;i<length;i++){a[i]=dataView.getUint16(bufferOffset+localBufferOffset+i*2);}data=String.fromCharCode.apply(null,a);bufferSize+=length*Uint16Array.BYTES_PER_ELEMENT;}}else if(netSchemProp.type===BaseTypes.TYPES.CLASSINSTANCE){var deserializeData=this.deserialize(dataView.buffer,bufferOffset);data=deserializeData.obj;bufferSize=deserializeData.byteOffset;}else if(netSchemProp.type===BaseTypes.TYPES.LIST){var _localBufferOffset2=0;var items=[];var itemCount=dataView.getUint16(bufferOffset+_localBufferOffset2);_localBufferOffset2+=Uint16Array.BYTES_PER_ELEMENT;for(var x=0;x<itemCount;x++){var read=this.readDataView(dataView,bufferOffset+_localBufferOffset2,{type:netSchemProp.itemType});items.push(read.data);_localBufferOffset2+=read.bufferSize;}data=items;bufferSize=_localBufferOffset2;}else if(this.customTypes[netSchemProp.type]!=null){// this is a custom data property which needs to define its own read method
data=this.customTypes[netSchemProp.type].readDataView(dataView,bufferOffset);}else{console.error("No custom property ".concat(netSchemProp.type," found!"));}return{data:data,bufferSize:bufferSize};}},{key:"getTypeByteSize",value:function getTypeByteSize(type){switch(type){case BaseTypes.TYPES.FLOAT32:{return Float32Array.BYTES_PER_ELEMENT;}case BaseTypes.TYPES.INT32:{return Int32Array.BYTES_PER_ELEMENT;}case BaseTypes.TYPES.INT16:{return Int16Array.BYTES_PER_ELEMENT;}case BaseTypes.TYPES.INT8:{return Int8Array.BYTES_PER_ELEMENT;}case BaseTypes.TYPES.UINT8:{return Uint8Array.BYTES_PER_ELEMENT;}// not one of the basic properties
default:{if(type===undefined){throw'netScheme property declared without type attribute!';}else if(this.customTypes[type]===null){throw"netScheme property ".concat(type," undefined! Did you forget to add it to the serializer?");}else{return this.customTypes[type].BYTES_PER_ELEMENT;}}}}}],[{key:"typeCanAssign",value:function typeCanAssign(type){return type!==BaseTypes.TYPES.CLASSINSTANCE&&type!==BaseTypes.TYPES.LIST;}}]);return Serializer;}();/**
   * Measures network performance between the client and the server
   * Represents both the client and server portions of NetworkMonitor
   */var NetworkMonitor=/*#__PURE__*/function(){function NetworkMonitor(server){_classCallCheck(this,NetworkMonitor);// server-side keep game name
if(server){this.server=server;this.gameName=Object.getPrototypeOf(server.gameEngine).constructor.name;}// mixin for EventEmitter
var eventEmitter$1=new eventEmitter();this.on=eventEmitter$1.on;this.once=eventEmitter$1.once;this.removeListener=eventEmitter$1.removeListener;this.emit=eventEmitter$1.emit;}// client
_createClass(NetworkMonitor,[{key:"registerClient",value:function registerClient(clientEngine){this.queryIdCounter=0;this.RTTQueries={};this.movingRTTAverage=0;this.movingRTTAverageFrame=[];this.movingFPSAverageSize=clientEngine.options.healthCheckRTTSample;this.clientEngine=clientEngine;clientEngine.socket.on('RTTResponse',this.onReceivedRTTQuery.bind(this));setInterval(this.sendRTTQuery.bind(this),clientEngine.options.healthCheckInterval);}},{key:"sendRTTQuery",value:function sendRTTQuery(){// todo implement cleanup of older timestamp
this.RTTQueries[this.queryIdCounter]=new Date().getTime();this.clientEngine.socket.emit('RTTQuery',this.queryIdCounter);this.queryIdCounter++;}},{key:"onReceivedRTTQuery",value:function onReceivedRTTQuery(queryId){var RTT=new Date().getTime()-this.RTTQueries[queryId];this.movingRTTAverageFrame.push(RTT);if(this.movingRTTAverageFrame.length>this.movingFPSAverageSize){this.movingRTTAverageFrame.shift();}this.movingRTTAverage=this.movingRTTAverageFrame.reduce(function(a,b){return a+b;})/this.movingRTTAverageFrame.length;this.emit('RTTUpdate',{RTT:RTT,RTTAverage:this.movingRTTAverage});}// server
},{key:"registerPlayerOnServer",value:function registerPlayerOnServer(socket){socket.on('RTTQuery',this.respondToRTTQuery.bind(this,socket));if(this.server&&this.server.options.countConnections){http.get("http://ping.games-eu.lance.gg:2000/".concat(this.gameName)).on('error',function(){});}}},{key:"respondToRTTQuery",value:function respondToRTTQuery(socket,queryId){socket.emit('RTTResponse',queryId);}}]);return NetworkMonitor;}();var NetworkedEventFactory=/*#__PURE__*/function(){function NetworkedEventFactory(serializer,eventName,options){_classCallCheck(this,NetworkedEventFactory);options=Object.assign({},options);this.seriazlier=serializer;this.options=options;this.eventName=eventName;this.netScheme=options.netScheme;}/**
     * Creates a new networkedEvent
     * @param {Object} payload an object representing the payload to be transferred over the wire
     * @return {Serializable} the new networkedEvent object
     */_createClass(NetworkedEventFactory,[{key:"create",value:function create(payload){var networkedEvent=new Serializable();networkedEvent.classId=Utils$1.hashStr(this.eventName);if(this.netScheme){networkedEvent.netScheme=Object.assign({},this.netScheme);// copy properties from the networkedEvent instance to its ad-hoc netsScheme
var _arr=Object.keys(this.netScheme);for(var _i=0;_i<_arr.length;_i++){var property=_arr[_i];networkedEvent[property]=payload[property];}}return networkedEvent;}}]);return NetworkedEventFactory;}();/**
   * Defines a collection of NetworkEvents to be transmitted over the wire
   */var NetworkedEventCollection=/*#__PURE__*/function(_Serializable){_inherits(NetworkedEventCollection,_Serializable);_createClass(NetworkedEventCollection,null,[{key:"netScheme",get:function get(){return{events:{type:BaseTypes.TYPES.LIST,itemType:BaseTypes.TYPES.CLASSINSTANCE}};}}]);function NetworkedEventCollection(events){var _this;_classCallCheck(this,NetworkedEventCollection);_this=_possibleConstructorReturn(this,_getPrototypeOf(NetworkedEventCollection).call(this));_this.events=events||[];return _this;}return NetworkedEventCollection;}(Serializable);var NetworkTransmitter=/*#__PURE__*/function(){function NetworkTransmitter(serializer){_classCallCheck(this,NetworkTransmitter);this.serializer=serializer;this.registeredEvents=[];this.serializer.registerClass(NetworkedEventCollection);this.registerNetworkedEventFactory('objectUpdate',{netScheme:{stepCount:{type:BaseTypes.TYPES.INT32},objectInstance:{type:BaseTypes.TYPES.CLASSINSTANCE}}});this.registerNetworkedEventFactory('objectCreate',{netScheme:{stepCount:{type:BaseTypes.TYPES.INT32},objectInstance:{type:BaseTypes.TYPES.CLASSINSTANCE}}});this.registerNetworkedEventFactory('objectDestroy',{netScheme:{stepCount:{type:BaseTypes.TYPES.INT32},objectInstance:{type:BaseTypes.TYPES.CLASSINSTANCE}}});this.registerNetworkedEventFactory('syncHeader',{netScheme:{stepCount:{type:BaseTypes.TYPES.INT32},fullUpdate:{type:BaseTypes.TYPES.UINT8}}});this.networkedEventCollection=new NetworkedEventCollection();}_createClass(NetworkTransmitter,[{key:"registerNetworkedEventFactory",value:function registerNetworkedEventFactory(eventName,options){options=Object.assign({},options);var classHash=Utils$1.hashStr(eventName);var networkedEventPrototype=function networkedEventPrototype(){};networkedEventPrototype.prototype.classId=classHash;networkedEventPrototype.prototype.eventName=eventName;networkedEventPrototype.netScheme=options.netScheme;this.serializer.registerClass(networkedEventPrototype,classHash);this.registeredEvents[eventName]=new NetworkedEventFactory(this.serializer,eventName,options);}},{key:"addNetworkedEvent",value:function addNetworkedEvent(eventName,payload){if(!this.registeredEvents[eventName]){console.error("NetworkTransmitter: no such event ".concat(eventName));return null;}var stagedNetworkedEvent=this.registeredEvents[eventName].create(payload);this.networkedEventCollection.events.push(stagedNetworkedEvent);return stagedNetworkedEvent;}},{key:"serializePayload",value:function serializePayload(){if(this.networkedEventCollection.events.length===0)return null;var dataBuffer=this.networkedEventCollection.serialize(this.serializer);return dataBuffer;}},{key:"deserializePayload",value:function deserializePayload(payload){return this.serializer.deserialize(payload.dataBuffer).obj;}},{key:"clearPayload",value:function clearPayload(){this.networkedEventCollection.events=[];}}]);return NetworkTransmitter;}();// or better yet, it should be configurable in the GameEngine instead of ServerEngine+ClientEngine
var GAME_UPS=60;// default number of game steps per second
var STEP_DELAY_MSEC=12;// if forward drift detected, delay next execution by this amount
var STEP_HURRY_MSEC=8;// if backward drift detected, hurry next execution by this amount
/**
   * The client engine is the singleton which manages the client-side
   * process, starting the game engine, listening to network messages,
   * starting client steps, and handling world updates which arrive from
   * the server.
   */var ClientEngine=/*#__PURE__*/function(){/**
      * Create a client engine instance.
      *
      * @param {GameEngine} gameEngine - a game engine
      * @param {Object} inputOptions - options object
      * @param {Boolean} inputOptions.verbose - print logs to console
      * @param {Boolean} inputOptions.autoConnect - if true, the client will automatically attempt connect to server.
      * @param {Boolean} inputOptions.standaloneMode - if true, the client will never try to connect to a server
      * @param {Number} inputOptions.delayInputCount - if set, inputs will be delayed by this many steps before they are actually applied on the client.
      * @param {Number} inputOptions.healthCheckInterval - health check message interval (millisec). Default is 1000.
      * @param {Number} inputOptions.healthCheckRTTSample - health check RTT calculation sample size. Default is 10.
      * @param {Object} inputOptions.syncOptions - an object describing the synchronization method. If not set, will be set to extrapolate, with local object bending set to 0.0 and remote object bending set to 0.6. If the query-string parameter "sync" is defined, then that value is passed to this object's sync attribute.
      * @param {String} inputOptions.scheduler - When set to "render-schedule" the game step scheduling is controlled by the renderer and step time is variable.  When set to "fixed" the game step is run independently with a fixed step time. Default is "render-schedule".
      * @param {String} inputOptions.syncOptions.sync - chosen sync option, can be interpolate, extrapolate, or frameSync
      * @param {Number} inputOptions.syncOptions.localObjBending - amount (0 to 1.0) of bending towards original client position, after each sync, for local objects
      * @param {Number} inputOptions.syncOptions.remoteObjBending - amount (0 to 1.0) of bending towards original client position, after each sync, for remote objects
      * @param {String} inputOptions.serverURL - Socket server url
      * @param {Renderer} Renderer - the Renderer class constructor
      */function ClientEngine(gameEngine,inputOptions,Renderer){_classCallCheck(this,ClientEngine);this.options=Object.assign({autoConnect:true,healthCheckInterval:1000,healthCheckRTTSample:10,stepPeriod:1000/GAME_UPS,scheduler:'render-schedule',serverURL:null},inputOptions);/**
       * reference to serializer
       * @member {Serializer}
       */this.serializer=new Serializer();/**
       * reference to game engine
       * @member {GameEngine}
       */this.gameEngine=gameEngine;this.gameEngine.registerClasses(this.serializer);this.networkTransmitter=new NetworkTransmitter(this.serializer);this.networkMonitor=new NetworkMonitor();this.inboundMessages=[];this.outboundMessages=[];// create the renderer
this.renderer=this.gameEngine.renderer=new Renderer(gameEngine,this);// step scheduler
this.scheduler=null;this.lastStepTime=0;this.correction=0;if(this.options.standaloneMode!==true){this.configureSynchronization();}// create a buffer of delayed inputs (fifo)
if(inputOptions&&inputOptions.delayInputCount){this.delayedInputs=[];for(var i=0;i<inputOptions.delayInputCount;i++){this.delayedInputs[i]=[];}}this.gameEngine.emit('client__init');}// configure the Synchronizer singleton
_createClass(ClientEngine,[{key:"configureSynchronization",value:function configureSynchronization(){// the reflect syncronizer is just interpolate strategy,
// configured to show server syncs
var syncOptions=this.options.syncOptions;if(syncOptions.sync==='reflect'){syncOptions.sync='interpolate';syncOptions.reflect=true;}this.synchronizer=new Synchronizer(this,syncOptions);}/**
       * Makes a connection to the game server.  Extend this method if you want to add additional
       * logic on every connection. Call the super-class connect first, and return a promise which
       * executes when the super-class promise completes.
       *
       * @param {Object} [options] additional socket.io options
       * @return {Promise} Resolved when the connection is made to the server
       */},{key:"connect",value:function connect(){var _this=this;var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var connectSocket=function connectSocket(matchMakerAnswer){return new Promise(function(resolve,reject){if(matchMakerAnswer.status!=='ok')reject('matchMaker failed status: '+matchMakerAnswer.status);if(_this.options.verbose)console.log("connecting to game server ".concat(matchMakerAnswer.serverURL));_this.socket=lib$2(matchMakerAnswer.serverURL,options);_this.networkMonitor.registerClient(_this);_this.socket.once('connect',function(){if(_this.options.verbose)console.log('connection made');resolve();});_this.socket.once('error',function(error){reject(error);});_this.socket.on('playerJoined',function(playerData){_this.gameEngine.playerId=playerData.playerId;_this.messageIndex=Number(_this.gameEngine.playerId)*10000;});_this.socket.on('worldUpdate',function(worldData){_this.inboundMessages.push(worldData);});_this.socket.on('roomUpdate',function(roomData){_this.gameEngine.emit('client__roomUpdate',roomData);});});};var matchmaker=Promise.resolve({serverURL:this.options.serverURL,status:'ok'});if(this.options.matchmaker)matchmaker=Utils$1.httpGetPromise(this.options.matchmaker);return matchmaker.then(connectSocket);}/**
       * Start the client engine, setting up the game loop, rendering loop and renderer.
       *
       * @return {Promise} Resolves once the Renderer has been initialized, and the game is
       * ready to connect
       */},{key:"start",value:function start(){var _this2=this;this.stopped=false;this.resolved=false;// initialize the renderer
// the render loop waits for next animation frame
if(!this.renderer)alert('ERROR: game has not defined a renderer');var renderLoop=function renderLoop(timestamp){if(_this2.stopped){_this2.renderer.stop();return;}_this2.lastTimestamp=_this2.lastTimestamp||timestamp;_this2.renderer.draw(timestamp,timestamp-_this2.lastTimestamp);_this2.lastTimestamp=timestamp;window.requestAnimationFrame(renderLoop);};return this.renderer.init().then(function(){_this2.gameEngine.start();if(_this2.options.scheduler==='fixed'){// schedule and start the game loop
_this2.scheduler=new Scheduler({period:_this2.options.stepPeriod,tick:_this2.step.bind(_this2),delay:STEP_DELAY_MSEC});_this2.scheduler.start();}if(typeof window!=='undefined')window.requestAnimationFrame(renderLoop);if(_this2.options.autoConnect&&_this2.options.standaloneMode!==true){return _this2.connect().catch(function(error){_this2.stopped=true;throw error;});}}).then(function(){return new Promise(function(resolve,reject){_this2.resolveGame=resolve;if(_this2.socket){_this2.socket.on('disconnect',function(){if(!_this2.resolved&&!_this2.stopped){if(_this2.options.verbose)console.log('disconnected by server...');_this2.stopped=true;reject();}});}});});}/**
       * Disconnect from game server
       */},{key:"disconnect",value:function disconnect(){if(!this.stopped){this.socket.disconnect();this.stopped=true;}}// check if client step is too far ahead (leading) or too far
// behing (lagging) the server step
},{key:"checkDrift",value:function checkDrift(checkType){if(!this.gameEngine.highestServerStep)return;var thresholds=this.synchronizer.syncStrategy.STEP_DRIFT_THRESHOLDS;var maxLead=thresholds[checkType].MAX_LEAD;var maxLag=thresholds[checkType].MAX_LAG;var clientStep=this.gameEngine.world.stepCount;var serverStep=this.gameEngine.highestServerStep;if(clientStep>serverStep+maxLead){this.gameEngine.trace.warn(function(){return"step drift ".concat(checkType,". [").concat(clientStep," > ").concat(serverStep," + ").concat(maxLead,"] Client is ahead of server.  Delaying next step.");});if(this.scheduler)this.scheduler.delayTick();this.lastStepTime+=STEP_DELAY_MSEC;this.correction+=STEP_DELAY_MSEC;}else if(serverStep>clientStep+maxLag){this.gameEngine.trace.warn(function(){return"step drift ".concat(checkType,". [").concat(serverStep," > ").concat(clientStep," + ").concat(maxLag,"] Client is behind server.  Hurrying next step.");});if(this.scheduler)this.scheduler.hurryTick();this.lastStepTime-=STEP_HURRY_MSEC;this.correction-=STEP_HURRY_MSEC;}}// execute a single game step.  This is normally called by the Renderer
// at each draw event.
},{key:"step",value:function step(t,dt,physicsOnly){if(!this.resolved){var result=this.gameEngine.getPlayerGameOverResult();if(result){this.resolved=true;this.resolveGame(result);// simulation can continue...
// call disconnect to quit
}}// physics only case
if(physicsOnly){this.gameEngine.step(false,t,dt,physicsOnly);return;}// first update the trace state
this.gameEngine.trace.setStep(this.gameEngine.world.stepCount+1);// skip one step if requested
if(this.skipOneStep===true){this.skipOneStep=false;return;}this.gameEngine.emit('client__preStep');while(this.inboundMessages.length>0){this.handleInboundMessage(this.inboundMessages.pop());this.checkDrift('onServerSync');}// check for server/client step drift without update
this.checkDrift('onEveryStep');// perform game engine step
if(this.options.standaloneMode!==true){this.handleOutboundInput();}this.applyDelayedInputs();this.gameEngine.step(false,t,dt);this.gameEngine.emit('client__postStep',{dt:dt});if(this.options.standaloneMode!==true&&this.gameEngine.trace.length&&this.socket){// socket might not have been initialized at this point
this.socket.emit('trace',JSON.stringify(this.gameEngine.trace.rotate()));}}// apply a user input on the client side
},{key:"doInputLocal",value:function doInputLocal(message){// some synchronization strategies (interpolate) ignore inputs on client side
if(this.gameEngine.ignoreInputs){return;}var inputEvent={input:message.data,playerId:this.gameEngine.playerId};this.gameEngine.emit('client__processInput',inputEvent);this.gameEngine.emit('processInput',inputEvent);this.gameEngine.processInput(message.data,this.gameEngine.playerId,false);}// apply user inputs which have been queued in order to create
// an artificial delay
},{key:"applyDelayedInputs",value:function applyDelayedInputs(){if(!this.delayedInputs){return;}var that=this;var delayed=this.delayedInputs.shift();if(delayed&&delayed.length){delayed.forEach(that.doInputLocal.bind(that));}this.delayedInputs.push([]);}/**
       * This function should be called by the client whenever a user input
       * occurs.  This function will emit the input event,
       * forward the input to the client's game engine (with a delay if
       * so configured) and will transmit the input to the server as well.
       *
       * This function can be called by the extended client engine class,
       * typically at the beginning of client-side step processing (see event client__preStep)
       *
       * @param {String} input - string representing the input
       * @param {Object} inputOptions - options for the input
       */},{key:"sendInput",value:function sendInput(input,inputOptions){var _this3=this;var inputEvent={command:'move',data:{messageIndex:this.messageIndex,step:this.gameEngine.world.stepCount,input:input,options:inputOptions}};this.gameEngine.trace.info(function(){return"USER INPUT[".concat(_this3.messageIndex,"]: ").concat(input," ").concat(inputOptions?JSON.stringify(inputOptions):'{}');});// if we delay input application on client, then queue it
// otherwise apply it now
if(this.delayedInputs){this.delayedInputs[this.delayedInputs.length-1].push(inputEvent);}else{this.doInputLocal(inputEvent);}if(this.options.standaloneMode!==true){this.outboundMessages.push(inputEvent);}this.messageIndex++;}// handle a message that has been received from the server
},{key:"handleInboundMessage",value:function handleInboundMessage(syncData){var _this4=this;var syncEvents=this.networkTransmitter.deserializePayload(syncData).events;var syncHeader=syncEvents.find(function(e){return e.eventName==='syncHeader';});// emit that a snapshot has been received
if(!this.gameEngine.highestServerStep||syncHeader.stepCount>this.gameEngine.highestServerStep)this.gameEngine.highestServerStep=syncHeader.stepCount;this.gameEngine.emit('client__syncReceived',{syncEvents:syncEvents,stepCount:syncHeader.stepCount,fullUpdate:syncHeader.fullUpdate});this.gameEngine.trace.info(function(){return"========== inbound world update ".concat(syncHeader.stepCount," ==========");});// finally update the stepCount
if(syncHeader.stepCount>this.gameEngine.world.stepCount+this.synchronizer.syncStrategy.STEP_DRIFT_THRESHOLDS.clientReset){this.gameEngine.trace.info(function(){return"========== world step count updated from ".concat(_this4.gameEngine.world.stepCount," to  ").concat(syncHeader.stepCount," ==========");});this.gameEngine.emit('client__stepReset',{oldStep:this.gameEngine.world.stepCount,newStep:syncHeader.stepCount});this.gameEngine.world.stepCount=syncHeader.stepCount;}}// emit an input to the authoritative server
},{key:"handleOutboundInput",value:function handleOutboundInput(){for(var x=0;x<this.outboundMessages.length;x++){this.socket.emit(this.outboundMessages[x].command,this.outboundMessages[x].data);}this.outboundMessages=[];}}]);return ClientEngine;}();// based on http://keycode.info/
// keyboard handling
var keyCodeTable={3:'break',8:'backspace',// backspace / delete
9:'tab',12:'clear',13:'enter',16:'shift',17:'ctrl',18:'alt',19:'pause/break',20:'caps lock',27:'escape',28:'conversion',29:'non-conversion',32:'space',33:'page up',34:'page down',35:'end',36:'home',37:'left',38:'up',39:'right',40:'down',41:'select',42:'print',43:'execute',44:'Print Screen',45:'insert',46:'delete',48:'0',49:'1',50:'2',51:'3',52:'4',53:'5',54:'6',55:'7',56:'8',57:'9',58:':',59:'semicolon (firefox), equals',60:'<',61:'equals (firefox)',63:'ß',64:'@',65:'a',66:'b',67:'c',68:'d',69:'e',70:'f',71:'g',72:'h',73:'i',74:'j',75:'k',76:'l',77:'m',78:'n',79:'o',80:'p',81:'q',82:'r',83:'s',84:'t',85:'u',86:'v',87:'w',88:'x',89:'y',90:'z',91:'Windows Key / Left ⌘ / Chromebook Search key',92:'right window key',93:'Windows Menu / Right ⌘',96:'numpad 0',97:'numpad 1',98:'numpad 2',99:'numpad 3',100:'numpad 4',101:'numpad 5',102:'numpad 6',103:'numpad 7',104:'numpad 8',105:'numpad 9',106:'multiply',107:'add',108:'numpad period (firefox)',109:'subtract',110:'decimal point',111:'divide',112:'f1',113:'f2',114:'f3',115:'f4',116:'f5',117:'f6',118:'f7',119:'f8',120:'f9',121:'f10',122:'f11',123:'f12',124:'f13',125:'f14',126:'f15',127:'f16',128:'f17',129:'f18',130:'f19',131:'f20',132:'f21',133:'f22',134:'f23',135:'f24',144:'num lock',145:'scroll lock',160:'^',161:'!',163:'#',164:'$',165:'ù',166:'page backward',167:'page forward',169:'closing paren (AZERTY)',170:'*',171:'~ + * key',173:'minus (firefox), mute/unmute',174:'decrease volume level',175:'increase volume level',176:'next',177:'previous',178:'stop',179:'play/pause',180:'e-mail',181:'mute/unmute (firefox)',182:'decrease volume level (firefox)',183:'increase volume level (firefox)',186:'semi-colon / ñ',187:'equal sign',188:'comma',189:'dash',190:'period',191:'forward slash / ç',192:'grave accent / ñ / æ',193:'?, / or °',194:'numpad period (chrome)',219:'open bracket',220:'back slash',221:'close bracket / å',222:'single quote / ø',223:'`',224:'left or right ⌘ key (firefox)',225:'altgr',226:'< /git >',230:'GNOME Compose Key',231:'ç',233:'XF86Forward',234:'XF86Back',240:'alphanumeric',242:'hiragana/katakana',243:'half-width/full-width',244:'kanji',255:'toggle touchpad'};/**
   * This class allows easy usage of device keyboard controls
   */var KeyboardControls=/*#__PURE__*/function(){function KeyboardControls(clientEngine){var _this=this;_classCallCheck(this,KeyboardControls);this.clientEngine=clientEngine;this.gameEngine=clientEngine.gameEngine;this.setupListeners();// keep a reference for key press state
this.keyState={};// a list of bound keys and their corresponding actions
this.boundKeys={};this.gameEngine.on('client__preStep',function(){var _arr=Object.keys(_this.boundKeys);for(var _i=0;_i<_arr.length;_i++){var keyName=_arr[_i];if(_this.keyState[keyName]&&_this.keyState[keyName].isDown){// handle repeat press
if(_this.boundKeys[keyName].options.repeat||_this.keyState[keyName].count==0){// todo movement is probably redundant
_this.clientEngine.sendInput(_this.boundKeys[keyName].actionName,{movement:true});_this.keyState[keyName].count++;}}}});}_createClass(KeyboardControls,[{key:"setupListeners",value:function setupListeners(){var _this2=this;document.addEventListener('keydown',function(e){_this2.onKeyChange(e,true);});document.addEventListener('keyup',function(e){_this2.onKeyChange(e,false);});}},{key:"bindKey",value:function bindKey(keys,actionName,options){var _this3=this;if(!Array.isArray(keys))keys=[keys];var keyOptions=Object.assign({repeat:false},options);keys.forEach(function(keyName){_this3.boundKeys[keyName]={actionName:actionName,options:keyOptions};});}// todo implement unbindKey
},{key:"onKeyChange",value:function onKeyChange(e,isDown){e=e||window.event;var keyName=keyCodeTable[e.keyCode];if(keyName&&this.boundKeys[keyName]){if(this.keyState[keyName]==null){this.keyState[keyName]={count:0};}this.keyState[keyName].isDown=isDown;// key up, reset press count
if(!isDown)this.keyState[keyName].count=0;// keep reference to the last key pressed to avoid duplicates
this.lastKeyPressed=isDown?e.keyCode:null;// this.renderer.onKeyChange({ keyName, isDown });
e.preventDefault();}}}]);return KeyboardControls;}();var singleton=null;var TIME_RESET_THRESHOLD=100;/**
   * The Renderer is the component which must *draw* the game on the client.
   * It will be instantiated once on each client, and must implement the draw
   * method.  The draw method will be invoked on every iteration of the browser's
   * render loop.
   */var Renderer=/*#__PURE__*/function(){_createClass(Renderer,null,[{key:"getInstance",value:function getInstance(){return singleton;}/**
      * Constructor of the Renderer singleton.
      * @param {GameEngine} gameEngine - Reference to the GameEngine instance.
      * @param {ClientEngine} clientEngine - Reference to the ClientEngine instance.
      */}]);function Renderer(gameEngine,clientEngine){var _this=this;_classCallCheck(this,Renderer);this.gameEngine=gameEngine;this.clientEngine=clientEngine;this.gameEngine.on('client__stepReset',function(){_this.doReset=true;});gameEngine.on('objectAdded',this.addObject.bind(this));gameEngine.on('objectDestroyed',this.removeObject.bind(this));// the singleton renderer has been created
singleton=this;}/**
     * Initialize the renderer.
     * @return {Promise} Resolves when renderer is ready.
    */_createClass(Renderer,[{key:"init",value:function init(){if(typeof window==='undefined'||!document){console.log('renderer invoked on server side.');}this.gameEngine.emit('client__rendererReady');return Promise.resolve();// eslint-disable-line new-cap
}},{key:"reportSlowFrameRate",value:function reportSlowFrameRate(){this.gameEngine.emit('client__slowFrameRate');}/**
       * The main draw function.  This method is called at high frequency,
       * at the rate of the render loop.  Typically this is 60Hz, in WebVR 90Hz.
       * If the client engine has been configured to render-schedule, then this
       * method must call the clientEngine's step method.
       *
       * @param {Number} t - current time (only required in render-schedule mode)
       * @param {Number} dt - time elapsed since last draw
       */},{key:"draw",value:function draw(t,dt){this.gameEngine.emit('client__draw');if(this.clientEngine.options.scheduler==='render-schedule')this.runClientStep(t);}/**
       * The main draw function.  This method is called at high frequency,
       * at the rate of the render loop.  Typically this is 60Hz, in WebVR 90Hz.
       *
       * @param {Number} t - current time
       * @param {Number} dt - time elapsed since last draw
       */},{key:"runClientStep",value:function runClientStep(t){var p=this.clientEngine.options.stepPeriod;var dt=0;// reset step time if we passed a threshold
if(this.doReset||t>this.clientEngine.lastStepTime+TIME_RESET_THRESHOLD){this.doReset=false;this.clientEngine.lastStepTime=t-p/2;this.clientEngine.correction=p/2;}// catch-up missed steps
while(t>this.clientEngine.lastStepTime+p){this.clientEngine.step(this.clientEngine.lastStepTime+p,p+this.clientEngine.correction);this.clientEngine.lastStepTime+=p;this.clientEngine.correction=0;}// if not ready for a real step yet, return
// this might happen after catch up above
if(t<this.clientEngine.lastStepTime){dt=t-this.clientEngine.lastStepTime+this.clientEngine.correction;if(dt<0)dt=0;this.clientEngine.correction=this.clientEngine.lastStepTime-t;this.clientEngine.step(t,dt,true);return;}// render-controlled step
dt=t-this.clientEngine.lastStepTime+this.clientEngine.correction;this.clientEngine.lastStepTime+=p;this.clientEngine.correction=this.clientEngine.lastStepTime-t;this.clientEngine.step(t,dt);}/**
       * Handle the addition of a new object to the world.
       * @param {Object} obj - The object to be added.
       */},{key:"addObject",value:function addObject(obj){}/**
       * Handle the removal of an old object from the world.
       * @param {Object} obj - The object to be removed.
       */},{key:"removeObject",value:function removeObject(obj){}/**
       * Called when clientEngine has stopped, time to clean up
       */},{key:"stop",value:function stop(){}}]);return Renderer;}();exports.GameEngine=GameEngine;exports.GameWorld=GameWorld;exports.P2PhysicsEngine=P2PhysicsEngine;exports.SimplePhysicsEngine=SimplePhysicsEngine;exports.BaseTypes=BaseTypes;exports.TwoVector=TwoVector;exports.DynamicObject=DynamicObject;exports.PhysicalObject2D=PhysicalObject2D;exports.PhysicalObject3D=PhysicalObject3D;exports.Lib=lib;exports.ClientEngine=ClientEngine;exports.KeyboardControls=KeyboardControls;exports.Renderer=Renderer;Object.defineProperty(exports,'__esModule',{value:true});});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(3).Buffer))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var ClientRequest = __webpack_require__(28)
var response = __webpack_require__(11)
var extend = __webpack_require__(38)
var statusCodes = __webpack_require__(39)
var url = __webpack_require__(40)

var http = exports

http.request = function (opts, cb) {
	if (typeof opts === 'string')
		opts = url.parse(opts)
	else
		opts = extend(opts)

	// Normally, the page is loaded from http or https, so not specifying a protocol
	// will result in a (valid) protocol-relative url. However, this won't work if
	// the protocol is something else, like 'file:'
	var defaultProtocol = global.location.protocol.search(/^https?:$/) === -1 ? 'http:' : ''

	var protocol = opts.protocol || defaultProtocol
	var host = opts.hostname || opts.host
	var port = opts.port
	var path = opts.path || '/'

	// Necessary for IPv6 addresses
	if (host && host.indexOf(':') !== -1)
		host = '[' + host + ']'

	// This may be a relative url. The browser should always be able to interpret it correctly.
	opts.url = (host ? (protocol + '//' + host) : '') + (port ? ':' + port : '') + path
	opts.method = (opts.method || 'GET').toUpperCase()
	opts.headers = opts.headers || {}

	// Also valid opts.auth, opts.mode

	var req = new ClientRequest(opts)
	if (cb)
		req.on('response', cb)
	return req
}

http.get = function get (opts, cb) {
	var req = http.request(opts, cb)
	req.end()
	return req
}

http.ClientRequest = ClientRequest
http.IncomingMessage = response.IncomingMessage

http.Agent = function () {}
http.Agent.defaultMaxSockets = 4

http.globalAgent = new http.Agent()

http.STATUS_CODES = statusCodes

http.METHODS = [
	'CHECKOUT',
	'CONNECT',
	'COPY',
	'DELETE',
	'GET',
	'HEAD',
	'LOCK',
	'M-SEARCH',
	'MERGE',
	'MKACTIVITY',
	'MKCOL',
	'MOVE',
	'NOTIFY',
	'OPTIONS',
	'PATCH',
	'POST',
	'PROPFIND',
	'PROPPATCH',
	'PURGE',
	'PUT',
	'REPORT',
	'SEARCH',
	'SUBSCRIBE',
	'TRACE',
	'UNLOCK',
	'UNSUBSCRIBE'
]
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {exports.fetch = isFunction(global.fetch) && isFunction(global.ReadableStream)

exports.writableStream = isFunction(global.WritableStream)

exports.abortController = isFunction(global.AbortController)

exports.blobConstructor = false
try {
	new Blob([new ArrayBuffer(1)])
	exports.blobConstructor = true
} catch (e) {}

// The xhr request to example.com may violate some restrictive CSP configurations,
// so if we're running in a browser that supports `fetch`, avoid calling getXHR()
// and assume support for certain features below.
var xhr
function getXHR () {
	// Cache the xhr value
	if (xhr !== undefined) return xhr

	if (global.XMLHttpRequest) {
		xhr = new global.XMLHttpRequest()
		// If XDomainRequest is available (ie only, where xhr might not work
		// cross domain), use the page location. Otherwise use example.com
		// Note: this doesn't actually make an http request.
		try {
			xhr.open('GET', global.XDomainRequest ? '/' : 'https://example.com')
		} catch(e) {
			xhr = null
		}
	} else {
		// Service workers don't have XHR
		xhr = null
	}
	return xhr
}

function checkTypeSupport (type) {
	var xhr = getXHR()
	if (!xhr) return false
	try {
		xhr.responseType = type
		return xhr.responseType === type
	} catch (e) {}
	return false
}

// For some strange reason, Safari 7.0 reports typeof global.ArrayBuffer === 'object'.
// Safari 7.1 appears to have fixed this bug.
var haveArrayBuffer = typeof global.ArrayBuffer !== 'undefined'
var haveSlice = haveArrayBuffer && isFunction(global.ArrayBuffer.prototype.slice)

// If fetch is supported, then arraybuffer will be supported too. Skip calling
// checkTypeSupport(), since that calls getXHR().
exports.arraybuffer = exports.fetch || (haveArrayBuffer && checkTypeSupport('arraybuffer'))

// These next two tests unavoidably show warnings in Chrome. Since fetch will always
// be used if it's available, just return false for these to avoid the warnings.
exports.msstream = !exports.fetch && haveSlice && checkTypeSupport('ms-stream')
exports.mozchunkedarraybuffer = !exports.fetch && haveArrayBuffer &&
	checkTypeSupport('moz-chunked-arraybuffer')

// If fetch is supported, then overrideMimeType will be supported too. Skip calling
// getXHR().
exports.overrideMimeType = exports.fetch || (getXHR() ? isFunction(getXHR().overrideMimeType) : false)

exports.vbArray = isFunction(global.VBArray)

function isFunction (value) {
	return typeof value === 'function'
}

xhr = null // Help gc

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, Buffer, global) {var capability = __webpack_require__(10)
var inherits = __webpack_require__(2)
var stream = __webpack_require__(12)

var rStates = exports.readyStates = {
	UNSENT: 0,
	OPENED: 1,
	HEADERS_RECEIVED: 2,
	LOADING: 3,
	DONE: 4
}

var IncomingMessage = exports.IncomingMessage = function (xhr, response, mode, fetchTimer) {
	var self = this
	stream.Readable.call(self)

	self._mode = mode
	self.headers = {}
	self.rawHeaders = []
	self.trailers = {}
	self.rawTrailers = []

	// Fake the 'close' event, but only once 'end' fires
	self.on('end', function () {
		// The nextTick is necessary to prevent the 'request' module from causing an infinite loop
		process.nextTick(function () {
			self.emit('close')
		})
	})

	if (mode === 'fetch') {
		self._fetchResponse = response

		self.url = response.url
		self.statusCode = response.status
		self.statusMessage = response.statusText
		
		response.headers.forEach(function (header, key){
			self.headers[key.toLowerCase()] = header
			self.rawHeaders.push(key, header)
		})

		if (capability.writableStream) {
			var writable = new WritableStream({
				write: function (chunk) {
					return new Promise(function (resolve, reject) {
						if (self._destroyed) {
							reject()
						} else if(self.push(new Buffer(chunk))) {
							resolve()
						} else {
							self._resumeFetch = resolve
						}
					})
				},
				close: function () {
					global.clearTimeout(fetchTimer)
					if (!self._destroyed)
						self.push(null)
				},
				abort: function (err) {
					if (!self._destroyed)
						self.emit('error', err)
				}
			})

			try {
				response.body.pipeTo(writable).catch(function (err) {
					global.clearTimeout(fetchTimer)
					if (!self._destroyed)
						self.emit('error', err)
				})
				return
			} catch (e) {} // pipeTo method isn't defined. Can't find a better way to feature test this
		}
		// fallback for when writableStream or pipeTo aren't available
		var reader = response.body.getReader()
		function read () {
			reader.read().then(function (result) {
				if (self._destroyed)
					return
				if (result.done) {
					global.clearTimeout(fetchTimer)
					self.push(null)
					return
				}
				self.push(new Buffer(result.value))
				read()
			}).catch(function (err) {
				global.clearTimeout(fetchTimer)
				if (!self._destroyed)
					self.emit('error', err)
			})
		}
		read()
	} else {
		self._xhr = xhr
		self._pos = 0

		self.url = xhr.responseURL
		self.statusCode = xhr.status
		self.statusMessage = xhr.statusText
		var headers = xhr.getAllResponseHeaders().split(/\r?\n/)
		headers.forEach(function (header) {
			var matches = header.match(/^([^:]+):\s*(.*)/)
			if (matches) {
				var key = matches[1].toLowerCase()
				if (key === 'set-cookie') {
					if (self.headers[key] === undefined) {
						self.headers[key] = []
					}
					self.headers[key].push(matches[2])
				} else if (self.headers[key] !== undefined) {
					self.headers[key] += ', ' + matches[2]
				} else {
					self.headers[key] = matches[2]
				}
				self.rawHeaders.push(matches[1], matches[2])
			}
		})

		self._charset = 'x-user-defined'
		if (!capability.overrideMimeType) {
			var mimeType = self.rawHeaders['mime-type']
			if (mimeType) {
				var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/)
				if (charsetMatch) {
					self._charset = charsetMatch[1].toLowerCase()
				}
			}
			if (!self._charset)
				self._charset = 'utf-8' // best guess
		}
	}
}

inherits(IncomingMessage, stream.Readable)

IncomingMessage.prototype._read = function () {
	var self = this

	var resolve = self._resumeFetch
	if (resolve) {
		self._resumeFetch = null
		resolve()
	}
}

IncomingMessage.prototype._onXHRProgress = function () {
	var self = this

	var xhr = self._xhr

	var response = null
	switch (self._mode) {
		case 'text:vbarray': // For IE9
			if (xhr.readyState !== rStates.DONE)
				break
			try {
				// This fails in IE8
				response = new global.VBArray(xhr.responseBody).toArray()
			} catch (e) {}
			if (response !== null) {
				self.push(new Buffer(response))
				break
			}
			// Falls through in IE8	
		case 'text':
			try { // This will fail when readyState = 3 in IE9. Switch mode and wait for readyState = 4
				response = xhr.responseText
			} catch (e) {
				self._mode = 'text:vbarray'
				break
			}
			if (response.length > self._pos) {
				var newData = response.substr(self._pos)
				if (self._charset === 'x-user-defined') {
					var buffer = new Buffer(newData.length)
					for (var i = 0; i < newData.length; i++)
						buffer[i] = newData.charCodeAt(i) & 0xff

					self.push(buffer)
				} else {
					self.push(newData, self._charset)
				}
				self._pos = response.length
			}
			break
		case 'arraybuffer':
			if (xhr.readyState !== rStates.DONE || !xhr.response)
				break
			response = xhr.response
			self.push(new Buffer(new Uint8Array(response)))
			break
		case 'moz-chunked-arraybuffer': // take whole
			response = xhr.response
			if (xhr.readyState !== rStates.LOADING || !response)
				break
			self.push(new Buffer(new Uint8Array(response)))
			break
		case 'ms-stream':
			response = xhr.response
			if (xhr.readyState !== rStates.LOADING)
				break
			var reader = new global.MSStreamReader()
			reader.onprogress = function () {
				if (reader.result.byteLength > self._pos) {
					self.push(new Buffer(new Uint8Array(reader.result.slice(self._pos))))
					self._pos = reader.result.byteLength
				}
			}
			reader.onload = function () {
				self.push(null)
			}
			// reader.onerror = ??? // TODO: this
			reader.readAsArrayBuffer(response)
			break
	}

	// The ms-stream case handles end separately in reader.onload()
	if (self._xhr.readyState === rStates.DONE && self._mode !== 'ms-stream') {
		self.push(null)
	}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(3).Buffer, __webpack_require__(0)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13);
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(17);
exports.Duplex = __webpack_require__(4);
exports.Transform = __webpack_require__(19);
exports.PassThrough = __webpack_require__(36);


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



/*<replacement>*/

var pna = __webpack_require__(6);
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = __webpack_require__(29);
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = __webpack_require__(14).EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(15);
/*</replacement>*/

/*<replacement>*/

var Buffer = __webpack_require__(7).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(5);
util.inherits = __webpack_require__(2);
/*</replacement>*/

/*<replacement>*/
var debugUtil = __webpack_require__(30);
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = __webpack_require__(31);
var destroyImpl = __webpack_require__(16);
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

  // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream) {
  Duplex = Duplex || __webpack_require__(4);

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var readableHwm = options.readableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = __webpack_require__(18).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __webpack_require__(4);

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = __webpack_require__(18).StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) pna.nextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    pna.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) pna.nextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        pna.nextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    pna.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;

  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  this._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._readableState.highWaterMark;
  }
});

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    pna.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = $getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(14).EventEmitter;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*<replacement>*/

var pna = __webpack_require__(6);
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      pna.nextTick(emitErrorNT, this, err);
    }
    return this;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      pna.nextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });

  return this;
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, setImmediate, global) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.



/*<replacement>*/

var pna = __webpack_require__(6);
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = __webpack_require__(5);
util.inherits = __webpack_require__(2);
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: __webpack_require__(35)
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(15);
/*</replacement>*/

/*<replacement>*/

var Buffer = __webpack_require__(7).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

var destroyImpl = __webpack_require__(16);

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(4);

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var writableHwm = options.writableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || __webpack_require__(4);

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  pna.nextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    pna.nextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    pna.nextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    pna.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      pna.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) pna.nextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(33).setImmediate, __webpack_require__(0)))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



/*<replacement>*/

var Buffer = __webpack_require__(7).Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.



module.exports = Transform;

var Duplex = __webpack_require__(4);

/*<replacement>*/
var util = __webpack_require__(5);
util.inherits = __webpack_require__(2);
/*</replacement>*/

util.inherits(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return this.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);

  cb(er);

  var rs = this._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  };

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function') {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this2 = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this2.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');

  if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_query_string__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_query_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_query_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_Game__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lance_gg__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lance_gg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lance_gg__);



var qsOptions = __WEBPACK_IMPORTED_MODULE_0_query_string___default.a.parse(location.search); // default options, overwritten by query-string options
// is sent to both game engine and client engine

var defaults = {
  traceLevel: __WEBPACK_IMPORTED_MODULE_2_lance_gg__["Lib"].Trace.TRACE_NONE,
  delayInputCount: 3,
  scheduler: 'render-schedule',
  syncOptions: {
    sync: qsOptions.sync || 'extrapolate',
    remoteObjBending: 0.8,
    bendingIncrements: 6
  }
};
var options = Object.assign(defaults, qsOptions); // create a client engine and a game engine

var gameEngine = new __WEBPACK_IMPORTED_MODULE_1__common_Game__["a" /* default */](options);
var clientEngine = new __WEBPACK_IMPORTED_MODULE_2_lance_gg__["ClientEngine"](gameEngine, options, __WEBPACK_IMPORTED_MODULE_2_lance_gg__["Renderer"]);
document.addEventListener('DOMContentLoaded', function (e) {
  clientEngine.start();
});

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strictUriEncode = __webpack_require__(22);
var objectAssign = __webpack_require__(23);

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

exports.extract = function (str) {
	return str.split('?')[1] || '';
};

exports.parse = function (str, opts) {
	opts = objectAssign({arrayFormat: 'none'}, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		formatter(decodeURIComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
};

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Game; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lance_gg__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lance_gg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lance_gg__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }


var PADDING = 20;
var WIDTH = 400;
var HEIGHT = 400;
var PADDLE_WIDTH = 10;
var PADDLE_HEIGHT = 50; // A paddle has a health attribute

var Paddle =
/*#__PURE__*/
function (_DynamicObject) {
  _inherits(Paddle, _DynamicObject);

  function Paddle(gameEngine, options, props) {
    var _this;

    _classCallCheck(this, Paddle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Paddle).call(this, gameEngine, options, props));
    _this.health = 0;
    return _this;
  }

  _createClass(Paddle, [{
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(Paddle.prototype), "syncTo", this).call(this, other);

      this.health = other.health;
    }
  }], [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        health: {
          type: __WEBPACK_IMPORTED_MODULE_0_lance_gg__["BaseTypes"].TYPES.INT16
        }
      }, _get(_getPrototypeOf(Paddle), "netScheme", this));
    }
  }]);

  return Paddle;
}(__WEBPACK_IMPORTED_MODULE_0_lance_gg__["DynamicObject"]); // a game object to represent the ball


var Ball =
/*#__PURE__*/
function (_DynamicObject2) {
  _inherits(Ball, _DynamicObject2);

  function Ball(gameEngine, options, props) {
    _classCallCheck(this, Ball);

    return _possibleConstructorReturn(this, _getPrototypeOf(Ball).call(this, gameEngine, options, props));
  } // avoid gradual synchronization of velocity


  _createClass(Ball, [{
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(Ball.prototype), "syncTo", this).call(this, other);
    }
  }, {
    key: "bending",
    get: function get() {
      return {
        velocity: {
          percent: 0.0
        }
      };
    }
  }]);

  return Ball;
}(__WEBPACK_IMPORTED_MODULE_0_lance_gg__["DynamicObject"]);

var Game =
/*#__PURE__*/
function (_GameEngine) {
  _inherits(Game, _GameEngine);

  function Game(options) {
    var _this2;

    _classCallCheck(this, Game);

    console.log('constructor');
    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Game).call(this, options));
    _this2.physicsEngine = new __WEBPACK_IMPORTED_MODULE_0_lance_gg__["SimplePhysicsEngine"]({
      gameEngine: _assertThisInitialized(_this2)
    }); // common code

    _this2.on('postStep', _this2.gameLogic.bind(_assertThisInitialized(_this2))); // server-only code


    _this2.on('server__init', _this2.serverSideInit.bind(_assertThisInitialized(_this2)));

    _this2.on('server__playerJoined', _this2.serverSidePlayerJoined.bind(_assertThisInitialized(_this2)));

    _this2.on('server__playerDisconnected', _this2.serverSidePlayerDisconnected.bind(_assertThisInitialized(_this2))); // client-only code


    _this2.on('client__rendererReady', _this2.clientSideInit.bind(_assertThisInitialized(_this2)));

    _this2.on('client__draw', _this2.clientSideDraw.bind(_assertThisInitialized(_this2)));

    return _this2;
  }

  _createClass(Game, [{
    key: "registerClasses",
    value: function registerClasses(serializer) {
      serializer.registerClass(Paddle);
      serializer.registerClass(Ball);
    }
  }, {
    key: "gameLogic",
    value: function gameLogic() {
      var paddles = this.world.queryObjects({
        instanceType: Paddle
      });
      var ball = this.world.queryObject({
        instanceType: Ball
      });
      if (!ball || paddles.length !== 2) return; // CHECK LEFT EDGE:

      if (ball.position.x <= PADDING + PADDLE_WIDTH && ball.position.y >= paddles[0].y && ball.position.y <= paddles[0].position.y + PADDLE_HEIGHT && ball.velocity.x < 0) {
        // ball moving left hit player 1 paddle
        ball.velocity.x *= -1;
        ball.position.x = PADDING + PADDLE_WIDTH + 1;
      } else if (ball.position.x <= 0) {
        // ball hit left wall
        ball.velocity.x *= -1;
        ball.position.x = 0;
        console.log("player 2 scored");
        paddles[0].health--;
      } // CHECK RIGHT EDGE:


      if (ball.position.x >= WIDTH - PADDING - PADDLE_WIDTH && ball.position.y >= paddles[1].position.y && ball.position.y <= paddles[1].position.y + PADDLE_HEIGHT && ball.velocity.x > 0) {
        // ball moving right hits player 2 paddle
        ball.velocity.x *= -1;
        ball.position.x = WIDTH - PADDING - PADDLE_WIDTH - 1;
      } else if (ball.position.x >= WIDTH) {
        // ball hit right wall
        ball.velocity.x *= -1;
        ball.position.x = WIDTH - 1;
        console.log("player 1 scored");
        paddles[1].health--;
      } // ball hits top or bottom edge


      if (ball.position.y <= 0) {
        ball.position.y = 1;
        ball.velocity.y *= -1;
      } else if (ball.position.y >= HEIGHT) {
        ball.position.y = HEIGHT - 1;
        ball.velocity.y *= -1;
      }
    }
  }, {
    key: "processInput",
    value: function processInput(inputData, playerId) {
      _get(_getPrototypeOf(Game.prototype), "processInput", this).call(this, inputData, playerId); // get the player paddle tied to the player socket


      var playerPaddle = this.world.queryObject({
        playerId: playerId
      });

      if (playerPaddle) {
        if (inputData.input === 'up') {
          playerPaddle.position.y -= 5;
        } else if (inputData.input === 'down') {
          playerPaddle.position.y += 5;
        }
      }
    } //
    // SERVER ONLY CODE
    //

  }, {
    key: "serverSideInit",
    value: function serverSideInit() {
      // create the paddles and the ball
      this.addObjectToWorld(new Paddle(this, null, {
        playerID: 0,
        position: new __WEBPACK_IMPORTED_MODULE_0_lance_gg__["TwoVector"](PADDING, 0)
      }));
      this.addObjectToWorld(new Paddle(this, null, {
        playerID: 0,
        position: new __WEBPACK_IMPORTED_MODULE_0_lance_gg__["TwoVector"](WIDTH - PADDING, 0)
      }));
      this.addObjectToWorld(new Ball(this, null, {
        position: new __WEBPACK_IMPORTED_MODULE_0_lance_gg__["TwoVector"](WIDTH / 2, HEIGHT / 2),
        velocity: new __WEBPACK_IMPORTED_MODULE_0_lance_gg__["TwoVector"](2, 2)
      }));
    } // attach newly connected player to next available paddle

  }, {
    key: "serverSidePlayerJoined",
    value: function serverSidePlayerJoined(ev) {
      console.log('player connected');
      var paddles = this.world.queryObjects({
        instanceType: Paddle
      });

      if (paddles[0].playerId === 0) {
        paddles[0].playerId = ev.playerId;
      } else if (paddles[1].playerId === 0) {
        paddles[1].playerId = ev.playerId;
      }
    }
  }, {
    key: "serverSidePlayerDisconnected",
    value: function serverSidePlayerDisconnected(ev) {
      var paddles = this.world.queryObjects({
        instanceType: Paddle
      });

      if (paddles[0].playerId === ev.playerId) {
        paddles[0].playerId = 0;
      } else if (paddles[1].playerId === ev.playerId) {
        paddles[1].playerId = 0;
      }
    } //
    // CLIENT ONLY CODE
    //

  }, {
    key: "clientSideInit",
    value: function clientSideInit() {
      this.controls = new __WEBPACK_IMPORTED_MODULE_0_lance_gg__["KeyboardControls"](this.renderer.clientEngine);
      this.controls.bindKey('up', 'up', {
        repeat: true
      });
      this.controls.bindKey('down', 'down', {
        repeat: true
      });
    }
  }, {
    key: "clientSideDraw",
    value: function clientSideDraw() {
      function updateEl(el, obj) {
        var health = obj.health > 0 ? obj.health : 15;
        el.style.top = obj.position.y + 10 + 'px';
        el.style.left = obj.position.x + 'px';
        el.style.background = "#ff".concat(health.toString(16), "f").concat(health.toString(16), "f");
      }

      var paddles = this.world.queryObjects({
        instanceType: Paddle
      });
      var ball = this.world.queryObject({
        instanceType: Ball
      });
      if (!ball || paddles.length !== 2) return;
      updateEl(document.querySelector('.ball'), ball);
      updateEl(document.querySelector('.paddle1'), paddles[0]);
      updateEl(document.querySelector('.paddle2'), paddles[1]);
    }
  }]);

  return Game;
}(__WEBPACK_IMPORTED_MODULE_0_lance_gg__["GameEngine"]);



/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),
/* 26 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 27 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer, global, process) {var capability = __webpack_require__(10)
var inherits = __webpack_require__(2)
var response = __webpack_require__(11)
var stream = __webpack_require__(12)
var toArrayBuffer = __webpack_require__(37)

var IncomingMessage = response.IncomingMessage
var rStates = response.readyStates

function decideMode (preferBinary, useFetch) {
	if (capability.fetch && useFetch) {
		return 'fetch'
	} else if (capability.mozchunkedarraybuffer) {
		return 'moz-chunked-arraybuffer'
	} else if (capability.msstream) {
		return 'ms-stream'
	} else if (capability.arraybuffer && preferBinary) {
		return 'arraybuffer'
	} else if (capability.vbArray && preferBinary) {
		return 'text:vbarray'
	} else {
		return 'text'
	}
}

var ClientRequest = module.exports = function (opts) {
	var self = this
	stream.Writable.call(self)

	self._opts = opts
	self._body = []
	self._headers = {}
	if (opts.auth)
		self.setHeader('Authorization', 'Basic ' + new Buffer(opts.auth).toString('base64'))
	Object.keys(opts.headers).forEach(function (name) {
		self.setHeader(name, opts.headers[name])
	})

	var preferBinary
	var useFetch = true
	if (opts.mode === 'disable-fetch' || ('requestTimeout' in opts && !capability.abortController)) {
		// If the use of XHR should be preferred. Not typically needed.
		useFetch = false
		preferBinary = true
	} else if (opts.mode === 'prefer-streaming') {
		// If streaming is a high priority but binary compatibility and
		// the accuracy of the 'content-type' header aren't
		preferBinary = false
	} else if (opts.mode === 'allow-wrong-content-type') {
		// If streaming is more important than preserving the 'content-type' header
		preferBinary = !capability.overrideMimeType
	} else if (!opts.mode || opts.mode === 'default' || opts.mode === 'prefer-fast') {
		// Use binary if text streaming may corrupt data or the content-type header, or for speed
		preferBinary = true
	} else {
		throw new Error('Invalid value for opts.mode')
	}
	self._mode = decideMode(preferBinary, useFetch)
	self._fetchTimer = null

	self.on('finish', function () {
		self._onFinish()
	})
}

inherits(ClientRequest, stream.Writable)

ClientRequest.prototype.setHeader = function (name, value) {
	var self = this
	var lowerName = name.toLowerCase()
	// This check is not necessary, but it prevents warnings from browsers about setting unsafe
	// headers. To be honest I'm not entirely sure hiding these warnings is a good thing, but
	// http-browserify did it, so I will too.
	if (unsafeHeaders.indexOf(lowerName) !== -1)
		return

	self._headers[lowerName] = {
		name: name,
		value: value
	}
}

ClientRequest.prototype.getHeader = function (name) {
	var header = this._headers[name.toLowerCase()]
	if (header)
		return header.value
	return null
}

ClientRequest.prototype.removeHeader = function (name) {
	var self = this
	delete self._headers[name.toLowerCase()]
}

ClientRequest.prototype._onFinish = function () {
	var self = this

	if (self._destroyed)
		return
	var opts = self._opts

	var headersObj = self._headers
	var body = null
	if (opts.method !== 'GET' && opts.method !== 'HEAD') {
		if (capability.arraybuffer) {
			body = toArrayBuffer(Buffer.concat(self._body))
		} else if (capability.blobConstructor) {
			body = new global.Blob(self._body.map(function (buffer) {
				return toArrayBuffer(buffer)
			}), {
				type: (headersObj['content-type'] || {}).value || ''
			})
		} else {
			// get utf8 string
			body = Buffer.concat(self._body).toString()
		}
	}

	// create flattened list of headers
	var headersList = []
	Object.keys(headersObj).forEach(function (keyName) {
		var name = headersObj[keyName].name
		var value = headersObj[keyName].value
		if (Array.isArray(value)) {
			value.forEach(function (v) {
				headersList.push([name, v])
			})
		} else {
			headersList.push([name, value])
		}
	})

	if (self._mode === 'fetch') {
		var signal = null
		var fetchTimer = null
		if (capability.abortController) {
			var controller = new AbortController()
			signal = controller.signal
			self._fetchAbortController = controller

			if ('requestTimeout' in opts && opts.requestTimeout !== 0) {
				self._fetchTimer = global.setTimeout(function () {
					self.emit('requestTimeout')
					if (self._fetchAbortController)
						self._fetchAbortController.abort()
				}, opts.requestTimeout)
			}
		}

		global.fetch(self._opts.url, {
			method: self._opts.method,
			headers: headersList,
			body: body || undefined,
			mode: 'cors',
			credentials: opts.withCredentials ? 'include' : 'same-origin',
			signal: signal
		}).then(function (response) {
			self._fetchResponse = response
			self._connect()
		}, function (reason) {
			global.clearTimeout(self._fetchTimer)
			if (!self._destroyed)
				self.emit('error', reason)
		})
	} else {
		var xhr = self._xhr = new global.XMLHttpRequest()
		try {
			xhr.open(self._opts.method, self._opts.url, true)
		} catch (err) {
			process.nextTick(function () {
				self.emit('error', err)
			})
			return
		}

		// Can't set responseType on really old browsers
		if ('responseType' in xhr)
			xhr.responseType = self._mode.split(':')[0]

		if ('withCredentials' in xhr)
			xhr.withCredentials = !!opts.withCredentials

		if (self._mode === 'text' && 'overrideMimeType' in xhr)
			xhr.overrideMimeType('text/plain; charset=x-user-defined')

		if ('requestTimeout' in opts) {
			xhr.timeout = opts.requestTimeout
			xhr.ontimeout = function () {
				self.emit('requestTimeout')
			}
		}

		headersList.forEach(function (header) {
			xhr.setRequestHeader(header[0], header[1])
		})

		self._response = null
		xhr.onreadystatechange = function () {
			switch (xhr.readyState) {
				case rStates.LOADING:
				case rStates.DONE:
					self._onXHRProgress()
					break
			}
		}
		// Necessary for streaming in Firefox, since xhr.response is ONLY defined
		// in onprogress, not in onreadystatechange with xhr.readyState = 3
		if (self._mode === 'moz-chunked-arraybuffer') {
			xhr.onprogress = function () {
				self._onXHRProgress()
			}
		}

		xhr.onerror = function () {
			if (self._destroyed)
				return
			self.emit('error', new Error('XHR error'))
		}

		try {
			xhr.send(body)
		} catch (err) {
			process.nextTick(function () {
				self.emit('error', err)
			})
			return
		}
	}
}

/**
 * Checks if xhr.status is readable and non-zero, indicating no error.
 * Even though the spec says it should be available in readyState 3,
 * accessing it throws an exception in IE8
 */
function statusValid (xhr) {
	try {
		var status = xhr.status
		return (status !== null && status !== 0)
	} catch (e) {
		return false
	}
}

ClientRequest.prototype._onXHRProgress = function () {
	var self = this

	if (!statusValid(self._xhr) || self._destroyed)
		return

	if (!self._response)
		self._connect()

	self._response._onXHRProgress()
}

ClientRequest.prototype._connect = function () {
	var self = this

	if (self._destroyed)
		return

	self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode, self._fetchTimer)
	self._response.on('error', function(err) {
		self.emit('error', err)
	})

	self.emit('response', self._response)
}

ClientRequest.prototype._write = function (chunk, encoding, cb) {
	var self = this

	self._body.push(chunk)
	cb()
}

ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function () {
	var self = this
	self._destroyed = true
	global.clearTimeout(self._fetchTimer)
	if (self._response)
		self._response._destroyed = true
	if (self._xhr)
		self._xhr.abort()
	else if (self._fetchAbortController)
		self._fetchAbortController.abort()
}

ClientRequest.prototype.end = function (data, encoding, cb) {
	var self = this
	if (typeof data === 'function') {
		cb = data
		data = undefined
	}

	stream.Writable.prototype.end.call(self, data, encoding, cb)
}

ClientRequest.prototype.flushHeaders = function () {}
ClientRequest.prototype.setTimeout = function () {}
ClientRequest.prototype.setNoDelay = function () {}
ClientRequest.prototype.setSocketKeepAlive = function () {}

// Taken from http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader%28%29-method
var unsafeHeaders = [
	'accept-charset',
	'accept-encoding',
	'access-control-request-headers',
	'access-control-request-method',
	'connection',
	'content-length',
	'cookie',
	'cookie2',
	'date',
	'dnt',
	'expect',
	'host',
	'keep-alive',
	'origin',
	'referer',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade',
	'via'
]

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3).Buffer, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 29 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = __webpack_require__(7).Buffer;
var util = __webpack_require__(32);

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();

if (util && util.inspect && util.inspect.custom) {
  module.exports.prototype[util.inspect.custom] = function () {
    var obj = util.inspect({ length: this.length });
    return this.constructor.name + ' ' + obj;
  };
}

/***/ }),
/* 32 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(34);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.



module.exports = PassThrough;

var Transform = __webpack_require__(19);

/*<replacement>*/
var util = __webpack_require__(5);
util.inherits = __webpack_require__(2);
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(3).Buffer

module.exports = function (buf) {
	// If the buffer is backed by a Uint8Array, a faster version will work
	if (buf instanceof Uint8Array) {
		// If the buffer isn't a subarray, return the underlying ArrayBuffer
		if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
			return buf.buffer
		} else if (typeof buf.buffer.slice === 'function') {
			// Otherwise we need to get a proper copy
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
		}
	}

	if (Buffer.isBuffer(buf)) {
		// This is the slow version that will work with any Buffer
		// implementation (even in old browsers)
		var arrayCopy = new Uint8Array(buf.length)
		var len = buf.length
		for (var i = 0; i < len; i++) {
			arrayCopy[i] = buf[i]
		}
		return arrayCopy.buffer
	} else {
		throw new Error('Argument must be a Buffer')
	}
}


/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}


/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = {
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non-Authoritative Information",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content",
  "207": "Multi-Status",
  "208": "Already Reported",
  "226": "IM Used",
  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": "Found",
  "303": "See Other",
  "304": "Not Modified",
  "305": "Use Proxy",
  "307": "Temporary Redirect",
  "308": "Permanent Redirect",
  "400": "Bad Request",
  "401": "Unauthorized",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed",
  "413": "Payload Too Large",
  "414": "URI Too Long",
  "415": "Unsupported Media Type",
  "416": "Range Not Satisfiable",
  "417": "Expectation Failed",
  "418": "I'm a teapot",
  "421": "Misdirected Request",
  "422": "Unprocessable Entity",
  "423": "Locked",
  "424": "Failed Dependency",
  "425": "Unordered Collection",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "431": "Request Header Fields Too Large",
  "451": "Unavailable For Legal Reasons",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "506": "Variant Also Negotiates",
  "507": "Insufficient Storage",
  "508": "Loop Detected",
  "509": "Bandwidth Limit Exceeded",
  "510": "Not Extended",
  "511": "Network Authentication Required"
}


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(41);
var util = __webpack_require__(43);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(44);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			return punycode;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(42)(module), __webpack_require__(0)))

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(45);
exports.encode = exports.stringify = __webpack_require__(46);


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map