"no use strict";
(function(e) {
if (typeof e.window != "undefined" && e.document)
  return;
e.console = {
  log : function() {
    var e = Array.prototype.slice.call(arguments, 0);
    postMessage({type : "log", data : e})
  },
  error : function() {
    var e = Array.prototype.slice.call(arguments, 0);
    postMessage({type : "log", data : e})
  }
},
    e.window = e, e.ace = e, e.normalizeModule = function(e, t) {
      if (t.indexOf("!") !== -1) {
        var n = t.split("!");
        return normalizeModule(e, n[0]) + "!" + normalizeModule(e, n[1])
      }
      if (t.charAt(0) == ".") {
        var r = e.split("/").slice(0, -1).join("/");
        t = r + "/" + t;
        while (t.indexOf(".") !== -1 && i != t) {
          var i = t;
          t = t.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "")
        }
      }
      return t
    }, e.require = function(e, t) {
      if (!t.charAt)
        throw new Error(
            "worker.js require() accepts only (parentId, id) as arguments");
      t = normalizeModule(e, t);
      var n = require.modules[t];
      if (n)
        return n.initialized ||
                   (n.initialized = !0, n.exports = n.factory().exports),
               n.exports;
      var r = t.split("/");
      r[0] = require.tlns[r[0]] || r[0];
      var i = r.join("/") + ".js";
      return require.id = t, importScripts(i), require(e, t)
    }, require.modules = {}, require.tlns = {}, e.define = function(e, t, n) {
      arguments.length == 2
          ? (n = t, typeof e != "string" && (t = e, e = require.id))
          : arguments.length == 1 && (n = e, e = require.id);
      if (e.indexOf("text!") === 0)
        return;
      var r = function(t, n) { return require(e, t, n) };
      require.modules[e] = {
        factory : function() {
          var e = {exports : {}}, t = n(r, e.exports, e);
          return t && (e.exports = t), e
        }
      }
    }, e.initBaseUrls = function(t) {
      require.tlns = t
    }, e.initSender = function() {
      var t = require(null, "ace/lib/event_emitter").EventEmitter,
          n = require(null, "ace/lib/oop"), r = function() {};
      return function() {
        n.implement(this, t),
            this.callback = function(
                e, t) { postMessage({type : "call", id : t, data : e}) },
            this.emit = function(
                e, t) { postMessage({type : "event", name : e, data : t}) }
      }.call(r.prototype),
             new r
    }, e.main = null, e.sender = null, e.onmessage = function(e) {
      var t = e.data;
      if (t.command) {
        if (!main[t.command])
          throw new Error("Unknown command:" + t.command);
        main[t.command].apply(main, t.args)
      } else if (t.init) {
        initBaseUrls(t.tlns), require(null, "ace/lib/fixoldbrowsers"),
            sender = initSender();
        var n = require(null, t.module)[t.classname];
        main = new n(sender)
      } else
        t.event && sender && sender._emit(t.event, t.data)
    }
})(this),
    define(
        "ace/lib/fixoldbrowsers",
        [
          "require", "exports", "module", "ace/lib/regexp", "ace/lib/es5-shim"
        ],
        function(e, t, n) { e("./regexp"), e("./es5-shim") }),
    define("ace/lib/regexp", [ "require", "exports", "module" ],
           function(e, t, n) {
function r(e) {
  return (e.global ? "g" : "") + (e.ignoreCase ? "i" : "") +
         (e.multiline ? "m" : "") + (e.extended ? "x" : "") +
         (e.sticky ? "y" : "")
}
function i(e, t, n) {
  if (Array.prototype.indexOf)
    return e.indexOf(t, n);
  for (var r = n || 0; r < e.length; r++)
    if (e[r] === t)
      return r;
  return -1
}
var s = {
  exec : RegExp.prototype.exec,
  test : RegExp.prototype.test,
  match : String.prototype.match,
  replace : String.prototype.replace,
  split : String.prototype.split
},
    o = s.exec.call(/()??/, "")[1] === undefined, u = function() {
      var e = /^/g;
      return s.test.call(e, ""), !e.lastIndex
    }();
if (u && o)
  return;
RegExp.prototype.exec = function(e) {
  var t = s.exec.apply(this, arguments), n, a;
  if (typeof e == "string" && t) {
    !o && t.length > 1 && i(t, "") > -1 &&
        (a = RegExp(this.source, s.replace.call(r(this), "g", "")),
         s.replace.call(e.slice(t.index), a, function() {
           for (var e = 1; e < arguments.length - 2; e++)
             arguments[e] === undefined && (t[e] = undefined)
         }));
    if (this._xregexp && this._xregexp.captureNames)
      for (var f = 1; f < t.length; f++)
        n = this._xregexp.captureNames[f - 1], n && (t[n] = t[f]);
    !u && this.global && !t[0].length && this.lastIndex > t.index &&
        this.lastIndex--
  }
  return t
}, u || (RegExp.prototype.test = function(e) {
     var t = s.exec.call(this, e);
     return t && this.global && !t[0].length && this.lastIndex > t.index &&
                this.lastIndex--,
            !!t
   })
           }),
    define("ace/lib/es5-shim", [ "require", "exports", "module" ],
           function(e, t, n) {
function r() {}
function i(e) {
  try {
    return Object.defineProperty(e, "sentinel", {}), "sentinel" in e
  } catch (t) {
  }
}
function s(e) {
  return e = +e,
         e !== e ? e = 0
                 : e !== 0 && e !== 1 / 0 && e !== -1 / 0 &&
                       (e = (e > 0 || -1) * Math.floor(Math.abs(e))),
         e
}
function o(e) {
  var t = typeof e;
  return e === null || t === "undefined" || t === "boolean" || t === "number" ||
         t === "string"
}
function u(e) {
  var t, n, r;
  if (o(e))
    return e;
  n = e.valueOf;
  if (typeof n == "function") {
    t = n.call(e);
    if (o(t))
      return t
  }
  r = e.toString;
  if (typeof r == "function") {
    t = r.call(e);
    if (o(t))
      return t
  }
  throw new TypeError
}
Function.prototype.bind || (Function.prototype.bind = function(e) {
  var t = this;
  if (typeof t != "function")
    throw new TypeError("Function.prototype.bind called on incompatible " + t);
  var n = c.call(arguments, 1), i = function() {
    if (this instanceof i) {
      var r = t.apply(this, n.concat(c.call(arguments)));
      return Object(r) === r ? r : this
    }
    return t.apply(e, n.concat(c.call(arguments)))
  };
  return t.prototype && (r.prototype = t.prototype, i.prototype = new r,
                         r.prototype = null),
         i
});
var a = Function.prototype.call, f = Array.prototype, l = Object.prototype,
    c = f.slice, h = a.bind(l.toString), p = a.bind(l.hasOwnProperty), d, v, m,
    g, y;
if (y = p(l, "__defineGetter__"))
  d = a.bind(l.__defineGetter__), v = a.bind(l.__defineSetter__),
  m = a.bind(l.__lookupGetter__), g = a.bind(l.__lookupSetter__);
if ([ 1, 2 ].splice(0).length != 2)
  if (!function() {
        function e(e) {
          var t = new Array(e + 2);
          return t[0] = t[1] = 0, t
        }
        var t = [], n;
        t.splice.apply(t, e(20)), t.splice.apply(t, e(26)),
            n = t.length, t.splice(5, 0, "XXX"), n + 1 == t.length;
        if (n + 1 == t.length)
          return !0
      }())
    Array.prototype.splice = function(e, t) {
      var n = this.length;
      e > 0 ? e > n && (e = n)
            : e == void 0 ? e = 0 : e < 0 && (e = Math.max(n + e, 0)),
                            e + t < n || (t = n - e);
      var r = this.slice(e, e + t), i = c.call(arguments, 2), s = i.length;
      if (e === n)
        s && this.push.apply(this, i);
      else {
        var o = Math.min(t, n - e), u = e + o, a = u + s - o, f = n - u,
            l = n - o;
        if (a < u)
          for (var h = 0; h < f; ++h)
            this[a + h] = this[u + h];
        else if (a > u)
          for (h = f; h--;)
            this[a + h] = this[u + h];
        if (s && e === l)
          this.length = l, this.push.apply(this, i);
        else {
          this.length = l + s;
          for (h = 0; h < s; ++h)
            this[e + h] = i[h]
        }
      }
      return r
    };
  else {
    var b = Array.prototype.splice;
    Array.prototype.splice = function(e, t) {
      return arguments.length ? b.apply(this,
                                        [
                                          e === void 0 ? 0 : e,
                                          t === void 0 ? this.length - e : t
                                        ].concat(c.call(arguments, 2)))
                              : []
    }
  }
Array.isArray ||
    (Array.isArray = function(e) { return h(e) == "[object Array]" });
var w = Object("a"), E = w[0] != "a" || !(0 in w);
Array.prototype.forEach ||
    (Array.prototype.forEach =
         function(e) {
           var t = F(this),
               n = E && h(this) == "[object String]" ? this.split("") : t,
               r = arguments[1], i = -1, s = n.length >>> 0;
           if (h(e) != "[object Function]")
             throw new TypeError;
           while (++i < s)
             i in n && e.call(r, n[i], i, t)
         }),
    Array.prototype.map ||
        (Array.prototype.map =
             function(e) {
               var t = F(this),
                   n = E && h(this) == "[object String]" ? this.split("") : t,
                   r = n.length >>> 0, i = Array(r), s = arguments[1];
               if (h(e) != "[object Function]")
                 throw new TypeError(e + " is not a function");
               for (var o = 0; o < r; o++)
                 o in n && (i[o] = e.call(s, n[o], o, t));
               return i
             }),
    Array.prototype.filter ||
        (Array.prototype.filter =
             function(e) {
               var t = F(this),
                   n = E && h(this) == "[object String]" ? this.split("") : t,
                   r = n.length >>> 0, i = [], s, o = arguments[1];
               if (h(e) != "[object Function]")
                 throw new TypeError(e + " is not a function");
               for (var u = 0; u < r; u++)
                 u in n && (s = n[u], e.call(o, s, u, t) && i.push(s));
               return i
             }),
    Array.prototype.every ||
        (Array.prototype.every =
             function(e) {
               var t = F(this),
                   n = E && h(this) == "[object String]" ? this.split("") : t,
                   r = n.length >>> 0, i = arguments[1];
               if (h(e) != "[object Function]")
                 throw new TypeError(e + " is not a function");
               for (var s = 0; s < r; s++)
                 if (s in n && !e.call(i, n[s], s, t))
                   return !1;
               return !0
             }),
    Array.prototype.some ||
        (Array.prototype.some =
             function(e) {
               var t = F(this),
                   n = E && h(this) == "[object String]" ? this.split("") : t,
                   r = n.length >>> 0, i = arguments[1];
               if (h(e) != "[object Function]")
                 throw new TypeError(e + " is not a function");
               for (var s = 0; s < r; s++)
                 if (s in n && e.call(i, n[s], s, t))
                   return !0;
               return !1
             }),
    Array.prototype.reduce ||
        (Array.prototype.reduce =
             function(e) {
               var t = F(this),
                   n = E && h(this) == "[object String]" ? this.split("") : t,
                   r = n.length >>> 0;
               if (h(e) != "[object Function]")
                 throw new TypeError(e + " is not a function");
               if (!r && arguments.length == 1)
                 throw new TypeError(
                     "reduce of empty array with no initial value");
               var i = 0, s;
               if (arguments.length >= 2)
                 s = arguments[1];
               else
                 do {
                   if (i in n) {
                     s = n[i++];
                     break
                   }
                   if (++i >= r)
                     throw new TypeError(
                         "reduce of empty array with no initial value")
                 } while (!0);
               for (; i < r; i++)
                 i in n && (s = e.call(void 0, s, n[i], i, t));
               return s
             }),
    Array.prototype.reduceRight || (Array.prototype.reduceRight = function(e) {
      var t = F(this),
          n = E && h(this) == "[object String]" ? this.split("") : t,
          r = n.length >>> 0;
      if (h(e) != "[object Function]")
        throw new TypeError(e + " is not a function");
      if (!r && arguments.length == 1)
        throw new TypeError("reduceRight of empty array with no initial value");
      var i, s = r - 1;
      if (arguments.length >= 2)
        i = arguments[1];
      else
        do {
          if (s in n) {
            i = n[s--];
            break
          }
          if (--s < 0)
            throw new TypeError(
                "reduceRight of empty array with no initial value")
        } while (!0);
      do
        s in this && (i = e.call(void 0, i, n[s], s, t));
      while (s--);
      return i
    });
if (!Array.prototype.indexOf || [ 0, 1 ].indexOf(1, 2) != -1)
  Array.prototype.indexOf = function(e) {
    var t = E && h(this) == "[object String]" ? this.split("") : F(this),
        n = t.length >>> 0;
    if (!n)
      return -1;
    var r = 0;
    arguments.length > 1 && (r = s(arguments[1])),
        r = r >= 0 ? r : Math.max(0, n + r);
    for (; r < n; r++)
      if (r in t && t[r] === e)
        return r;
    return -1
  };
if (!Array.prototype.lastIndexOf || [ 0, 1 ].lastIndexOf(0, -3) != -1)
  Array.prototype.lastIndexOf = function(e) {
    var t = E && h(this) == "[object String]" ? this.split("") : F(this),
        n = t.length >>> 0;
    if (!n)
      return -1;
    var r = n - 1;
    arguments.length > 1 && (r = Math.min(r, s(arguments[1]))),
        r = r >= 0 ? r : n - Math.abs(r);
    for (; r >= 0; r--)
      if (r in t && e === t[r])
        return r;
    return -1
  };
Object.getPrototypeOf || (Object.getPrototypeOf = function(e) {
  return e.__proto__ || (e.constructor ? e.constructor.prototype : l)
});
if (!Object.getOwnPropertyDescriptor) {
  var S = "Object.getOwnPropertyDescriptor called on a non-object: ";
  Object.getOwnPropertyDescriptor = function(e, t) {
    if (typeof e != "object" && typeof e != "function" || e === null)
      throw new TypeError(S + e);
    if (!p(e, t))
      return;
    var n, r, i;
    n = {enumerable : !0, configurable : !0};
    if (y) {
      var s = e.__proto__;
      e.__proto__ = l;
      var r = m(e, t), i = g(e, t);
      e.__proto__ = s;
      if (r || i)
        return r && (n.get = r), i && (n.set = i), n
    }
    return n.value = e[t], n
  }
}
Object.getOwnPropertyNames ||
    (Object.getOwnPropertyNames = function(e) { return Object.keys(e) });
if (!Object.create) {
  var x;
  Object.prototype.__proto__ === null ? x = function() {
    return { __proto__: null }
  } : x = function() {
    var e = {};
    for (var t in e)
      e[t] = null;
    return e.constructor = e.hasOwnProperty = e.propertyIsEnumerable =
               e.isPrototypeOf = e.toLocaleString = e.toString = e.valueOf =
                   e.__proto__ = null,
           e
  }, Object.create = function(e, t) {
    var n;
    if (e === null)
      n = x();
    else {
      if (typeof e != "object")
        throw new TypeError("typeof prototype[" + typeof e + "] != 'object'");
      var r = function() {};
      r.prototype = e, n = new r, n.__proto__ = e
    }
    return t !== void 0 && Object.defineProperties(n, t), n
  }
}
if (Object.defineProperty) {
  var T = i({}),
      N = typeof document == "undefined" || i(document.createElement("div"));
  if (!T || !N)
    var C = Object.defineProperty
}
if (!Object.defineProperty || C) {
  var k = "Property description must be an object: ",
      L = "Object.defineProperty called on non-object: ",
      A = "getters & setters can not be defined on this javascript engine";
  Object.defineProperty = function(e, t, n) {
    if (typeof e != "object" && typeof e != "function" || e === null)
      throw new TypeError(L + e);
    if (typeof n != "object" && typeof n != "function" || n === null)
      throw new TypeError(k + n);
    if (C)
      try {
        return C.call(Object, e, t, n)
      } catch (r) {
      }
    if (p(n, "value"))
      if (y && (m(e, t) || g(e, t))) {
        var i = e.__proto__;
        e.__proto__ = l, delete e[t], e[t] = n.value, e.__proto__ = i
      } else
        e[t] = n.value;
    else {
      if (!y)
        throw new TypeError(A);
      p(n, "get") && d(e, t, n.get), p(n, "set") && v(e, t, n.set)
    }
    return e
  }
}
Object.defineProperties ||
    (Object.defineProperties =
         function(e, t) {
           for (var n in t)
             p(t, n) && Object.defineProperty(e, n, t[n]);
           return e
         }),
    Object.seal || (Object.seal = function(e) { return e }),
    Object.freeze || (Object.freeze = function(e) { return e });
try {
  Object.freeze(function() {})
} catch (O) {
  Object.freeze = function(
      e) { return function(t) { return typeof t == "function" ? t : e(t) } }(
      Object.freeze)
}
Object.preventExtensions ||
    (Object.preventExtensions = function(e) { return e }),
    Object.isSealed || (Object.isSealed = function(e) { return !1 }),
    Object.isFrozen || (Object.isFrozen = function(e) { return !1 }),
    Object.isExtensible || (Object.isExtensible = function(e) {
      if (Object(e) === e)
        throw new TypeError;
      var t = "";
      while (p(e, t))
        t += "?";
      e[t] = !0;
      var n = p(e, t);
      return delete e[t], n
    });
if (!Object.keys) {
  var M = !0,
      _ =
          [
            "toString", "toLocaleString", "valueOf", "hasOwnProperty",
            "isPrototypeOf", "propertyIsEnumerable", "constructor"
          ],
      D = _.length;
  for (var P in {toString : null})
    M = !1;
  Object.keys = function I(e) {
    if (typeof e != "object" && typeof e != "function" || e === null)
      throw new TypeError("Object.keys called on a non-object");
    var I = [];
    for (var t in e)
      p(e, t) && I.push(t);
    if (M)
      for (var n = 0, r = D; n < r; n++) {
        var i = _[n];
        p(e, i) && I.push(i)
      }
    return I
  }
}
Date.now || (Date.now = function() { return (new Date).getTime() });
var H =
    "	\n\f\r   ᠎             　\u2028\u2029﻿";
if (!String.prototype.trim || H.trim()) {
  H = "[" + H + "]";
  var B = new RegExp("^" + H + H + "*"), j = new RegExp(H + H + "*$");
  String.prototype.trim =
      function() { return String(this).replace(B, "").replace(j, "") }
}
var F = function(e) {
  if (e == null)
    throw new TypeError("can't convert " + e + " to object");
  return Object(e)
}
           }),
    define("ace/lib/event_emitter", [ "require", "exports", "module" ],
           function(e, t, n) {
var r = {}, i = function() { this.propagationStopped = !0 },
    s = function() { this.defaultPrevented = !0 };
r._emit = r._dispatchEvent = function(e, t) {
  this._eventRegistry || (this._eventRegistry = {}),
      this._defaultHandlers || (this._defaultHandlers = {});
  var n = this._eventRegistry[e] || [], r = this._defaultHandlers[e];
  if (!n.length && !r)
    return;
  if (typeof t != "object" || !t)
    t = {};
  t.type || (t.type = e), t.stopPropagation || (t.stopPropagation = i),
      t.preventDefault || (t.preventDefault = s), t.target || (t.target = this);
  for (var o = 0; o < n.length; o++) {
    n[o](t);
    if (t.propagationStopped)
      break
  }
  if (r && !t.defaultPrevented)
    return r(t)
}, r._signal = function(e, t) {
  var n = (this._eventRegistry || {})[e];
  if (!n)
    return;
  for (var r = 0; r < n.length; r++)
    n[r](t)
}, r.once = function(e, t) {
  var n = this, r = function() {
    fun && fun.apply(null, arguments), n.removeEventListener(event, r)
  };
  this.addEventListener(event, r)
}, r.setDefaultHandler = function(e, t) {
  this._defaultHandlers = this._defaultHandlers || {};
  if (this._defaultHandlers[e])
    throw new Error("The default handler for '" + e + "' is already set");
  this._defaultHandlers[e] = t
}, r.on = r.addEventListener = function(e, t, n) {
  this._eventRegistry = this._eventRegistry || {};
  var r = this._eventRegistry[e];
  return r || (r = this._eventRegistry[e] = []),
         r.indexOf(t) == -1 && r[n ? "unshift" : "push"](t), t
}, r.removeListener = r.removeEventListener = function(e, t) {
  this._eventRegistry = this._eventRegistry || {};
  var n = this._eventRegistry[e];
  if (!n)
    return;
  var r = n.indexOf(t);
  r !== -1 && n.splice(r, 1)
}, r.removeAllListeners = function(e) {
  this._eventRegistry && (this._eventRegistry[e] = [])
}, t.EventEmitter = r
           }),
    define("ace/lib/oop", [ "require", "exports", "module" ],
           function(e, t, n) {
t.inherits = function() {
  var e = function() {};
  return function(t, n) {
    e.prototype = n.prototype, t.super_ = n.prototype, t.prototype = new e,
    t.prototype.constructor = t
  }
}(), t.mixin = function(e, t) {
  for (var n in t)
    e[n] = t[n]
}, t.implement = function(e, n) { t.mixin(e, n) }
           }),
    define("ace/mode/javascript_worker",
           [
             "require", "exports", "module", "ace/lib/oop", "ace/worker/mirror",
             "ace/mode/javascript/jshint"
           ],
           function(require, exports, module) {
function startRegex(e) { return RegExp("^(" + e.join("|") + ")") }
var oop = require("../lib/oop"), Mirror = require("../worker/mirror").Mirror,
    lint = require("./javascript/jshint").JSHINT,
    disabledWarningsRe =
        startRegex([ "Bad for in variable '(.+)'.", 'Missing "use strict"' ]),
    errorsRe = startRegex([
      "Unexpected", "Expected ", "Confusing (plus|minus)",
      "\\{a\\} unterminated regular expression", "Unclosed ", "Unmatched ",
      "Unbegun comment", "Bad invocation", "Missing space after",
      "Missing operator at"
    ]),
    infoRe = startRegex([
      "Expected an assignment", "Bad escapement of EOL", "Unexpected comma",
      "Unexpected space", "Missing radix parameter.",
      "A leading decimal point can",
      "\\['{a}'\\] is better written in dot notation.",
      "'{a}' used out of scope"
    ]),
    JavaScriptWorker = exports.JavaScriptWorker = function(
        e) { Mirror.call(this, e), this.setTimeout(500), this.setOptions() };
oop.inherits(JavaScriptWorker, Mirror), function() {
  this.setOptions = function(e) {
    this.options = e || {
      es5 : !0,
      esnext : !0,
      devel : !0,
      browser : !0,
      node : !0,
      laxcomma : !0,
      laxbreak : !0,
      lastsemic : !0,
      onevar : !1,
      passfail : !1,
      maxerr : 100,
      expr : !0,
      multistr : !0,
      globalstrict : !0
    },
    this.doc.getValue() && this.deferredUpdate.schedule(100)
  }, this.changeOptions = function(e) {
    oop.mixin(this.options, e),
        this.doc.getValue() && this.deferredUpdate.schedule(100)
  }, this.isValidJS = function(str) {
    try {
      eval("throw 0;" + str)
    } catch (e) {
      if (e === 0)
        return !0
    }
    return !1
  }, this.onUpdate = function() {
    var e = this.doc.getValue();
    e = e.replace(/^#!.*\n/, "\n");
    if (!e) {
      this.sender.emit("jslint", []);
      return
    }
    var t = [], n = this.isValidJS(e) ? "warning" : "error";
    lint(e, this.options);
    var r = lint.errors, i = !1;
    for (var s = 0; s < r.length; s++) {
      var o = r[s];
      if (!o)
        continue;
      var u = o.raw, a = "warning";
      if (u == "Missing semicolon.") {
        var f = o.evidence.substr(o.character);
        f = f.charAt(f.search(/\S/)),
        n == "error" && f && /[\w\d{(['"]/.test(f)
            ? (o.reason = 'Missing ";" before statement', a = "error")
            : a = "info"
      } else {
        if (disabledWarningsRe.test(u))
          continue;
        infoRe.test(u) ? a = "info"
                       : errorsRe.test(u)
                             ? (i = !0, a = n)
                             : u == "'{a}' is not defined."
                                   ? a = "warning"
                                   : u == "'{a}' is defined but never used." &&
                                         (a = "info")
      }
      t.push({
        row : o.line - 1,
        column : o.character - 1,
        text : o.reason,
        type : a,
        raw : u
      }),
          i
    }
    this.sender.emit("jslint", t)
  }
}.call(JavaScriptWorker.prototype)
           }),
    define("ace/worker/mirror",
           [ "require", "exports", "module", "ace/document", "ace/lib/lang" ],
           function(e, t, n) {
var r = e("../document").Document, i = e("../lib/lang"),
    s = t.Mirror = function(e) {
      this.sender = e;
      var t = this.doc = new r(""),
          n = this.deferredUpdate = i.delayedCall(this.onUpdate.bind(this)),
          s = this;
      e.on("change",
           function(e) { t.applyDeltas([ e.data ]), n.schedule(s.$timeout) })
    };
(function() {
this.$timeout = 500,
    this.setTimeout = function(e) { this.$timeout = e },
    this.setValue =
        function(e) {
      this.doc.setValue(e), this.deferredUpdate.schedule(this.$timeout)
    },
    this.getValue = function(
        e) { this.sender.callback(this.doc.getValue(), e) },
    this.onUpdate = function() {}
}).call(s.prototype)
           }),
    define("ace/document",
           [
             "require", "exports", "module", "ace/lib/oop",
             "ace/lib/event_emitter", "ace/range", "ace/anchor"
           ],
           function(e, t, n) {
var r = e("./lib/oop"), i = e("./lib/event_emitter").EventEmitter,
    s = e("./range").Range, o = e("./anchor").Anchor, u = function(e) {
      this.$lines = [],
      e.length == 0 ? this.$lines = [ "" ]
                    : Array.isArray(e) ? this.insertLines(0, e)
                                       : this.insert({row : 0, column : 0}, e)
    };
(function() {
r.implement(this, i),
    this.setValue =
        function(e) {
      var t = this.getLength();
      this.remove(new s(0, 0, t, this.getLine(t - 1).length)),
          this.insert({row : 0, column : 0}, e)
    },
    this.getValue =
        function() {
      return this.getAllLines().join(this.getNewLineCharacter())
    },
    this.createAnchor = function(e, t) { return new o(this, e, t) },
    "aaa".split(/a/).length == 0
        ? this.$split = function(
              e) { return e.replace(/\r\n|\r/g, "\n").split("\n") }
        : this.$split = function(e) { return e.split(/\r\n|\r|\n/) },
    this.$detectNewLine =
        function(e) {
      var t = e.match(/^.*?(\r\n|\r|\n)/m);
      t ? this.$autoNewLine = t[1] : this.$autoNewLine = "\n"
    },
    this.getNewLineCharacter =
        function() {
      switch (this.$newLineMode) {
      case "windows":
        return "\r\n";
      case "unix":
        return "\n";
      default:
        return this.$autoNewLine
      }
    },
    this.$autoNewLine = "\n", this.$newLineMode = "auto",
    this.setNewLineMode =
        function(e) {
      if (this.$newLineMode === e)
        return;
      this.$newLineMode = e
    },
    this.getNewLineMode = function() { return this.$newLineMode },
    this.isNewLine = function(
        e) { return e == "\r\n" || e == "\r" || e == "\n" },
    this.getLine = function(e) { return this.$lines[e] || "" },
    this.getLines = function(e, t) { return this.$lines.slice(e, t + 1) },
    this.getAllLines = function() { return this.getLines(0, this.getLength()) },
    this.getLength = function() { return this.$lines.length },
    this.getTextRange = function(e) {
      if (e.start.row == e.end.row)
        return this.$lines[e.start.row].substring(e.start.column, e.end.column);
      var t = this.getLines(e.start.row + 1, e.end.row - 1);
      return t.unshift(
                 (this.$lines[e.start.row] || "").substring(e.start.column)),
             t.push((this.$lines[e.end.row] || "").substring(0, e.end.column)),
             t.join(this.getNewLineCharacter())
    }, this.$clipPosition = function(e) {
      var t = this.getLength();
      return e.row >= t && (e.row = Math.max(0, t - 1),
                            e.column = this.getLine(t - 1).length),
             e
    }, this.insert = function(e, t) {
      if (!t || t.length === 0)
        return e;
      e = this.$clipPosition(e),
      this.getLength() <= 1 && this.$detectNewLine(t);
      var n = this.$split(t), r = n.splice(0, 1)[0],
          i = n.length == 0 ? null : n.splice(n.length - 1, 1)[0];
      return e = this.insertInLine(e, r),
             i !== null &&
                 (e = this.insertNewLine(e), e = this.insertLines(e.row, n),
                  e = this.insertInLine(e, i || "")),
             e
    }, this.insertLines = function(e, t) {
      if (t.length == 0)
        return {row : e, column : 0};
      if (t.length > 65535) {
        var n = this.insertLines(e, t.slice(65535));
        t = t.slice(0, 65535)
      }
      var r = [ e, 0 ];
      r.push.apply(r, t), this.$lines.splice.apply(this.$lines, r);
      var i = new s(e, 0, e + t.length, 0),
          o = {action : "insertLines", range : i, lines : t};
      return this._emit("change", {data : o}), n || i.end
    }, this.insertNewLine = function(e) {
      e = this.$clipPosition(e);
      var t = this.$lines[e.row] || "";
      this.$lines[e.row] = t.substring(0, e.column),
      this.$lines.splice(e.row + 1, 0, t.substring(e.column, t.length));
      var n = {row : e.row + 1, column : 0}, r = {
        action : "insertText",
        range : s.fromPoints(e, n),
        text : this.getNewLineCharacter()
      };
      return this._emit("change", {data : r}), n
    }, this.insertInLine = function(e, t) {
      if (t.length == 0)
        return e;
      var n = this.$lines[e.row] || "";
      this.$lines[e.row] = n.substring(0, e.column) + t + n.substring(e.column);
      var r = {row : e.row, column : e.column + t.length},
          i = {action : "insertText", range : s.fromPoints(e, r), text : t};
      return this._emit("change", {data : i}), r
    }, this.remove = function(e) {
      e.start = this.$clipPosition(e.start), e.end = this.$clipPosition(e.end);
      if (e.isEmpty())
        return e.start;
      var t = e.start.row, n = e.end.row;
      if (e.isMultiLine()) {
        var r = e.start.column == 0 ? t : t + 1, i = n - 1;
        e.end.column > 0 && this.removeInLine(n, 0, e.end.column),
            i >= r && this.removeLines(r, i),
            r != t &&
                (this.removeInLine(t, e.start.column, this.getLine(t).length),
                 this.removeNewLine(e.start.row))
      } else
        this.removeInLine(t, e.start.column, e.end.column);
      return e.start
    }, this.removeInLine = function(e, t, n) {
      if (t == n)
        return;
      var r = new s(e, t, e, n), i = this.getLine(e), o = i.substring(t, n),
          u = i.substring(0, t) + i.substring(n, i.length);
      this.$lines.splice(e, 1, u);
      var a = {action : "removeText", range : r, text : o};
      return this._emit("change", {data : a}), r.start
    }, this.removeLines = function(e, t) {
      var n = new s(e, 0, t + 1, 0), r = this.$lines.splice(e, t - e + 1), i = {
        action : "removeLines",
        range : n,
        nl : this.getNewLineCharacter(),
        lines : r
      };
      return this._emit("change", {data : i}), r
    }, this.removeNewLine = function(e) {
      var t = this.getLine(e), n = this.getLine(e + 1),
          r = new s(e, t.length, e + 1, 0), i = t + n;
      this.$lines.splice(e, 2, i);
      var o = {
        action : "removeText",
        range : r,
        text : this.getNewLineCharacter()
      };
      this._emit("change", {data : o})
    }, this.replace = function(e, t) {
      if (t.length == 0 && e.isEmpty())
        return e.start;
      if (t == this.getTextRange(e))
        return e.end;
      this.remove(e);
      if (t)
        var n = this.insert(e.start, t);
      else
        n = e.start;
      return n
    }, this.applyDeltas = function(e) {
      for (var t = 0; t < e.length; t++) {
        var n = e[t], r = s.fromPoints(n.range.start, n.range.end);
        n.action == "insertLines"
            ? this.insertLines(r.start.row, n.lines)
            : n.action == "insertText"
                  ? this.insert(r.start, n.text)
                  : n.action == "removeLines"
                        ? this.removeLines(r.start.row, r.end.row - 1)
                        : n.action == "removeText" && this.remove(r)
      }
    }, this.revertDeltas = function(e) {
      for (var t = e.length - 1; t >= 0; t--) {
        var n = e[t], r = s.fromPoints(n.range.start, n.range.end);
        n.action == "insertLines"
            ? this.removeLines(r.start.row, r.end.row - 1)
            : n.action == "insertText"
                  ? this.remove(r)
                  : n.action == "removeLines"
                        ? this.insertLines(r.start.row, n.lines)
                        : n.action == "removeText" &&
                              this.insert(r.start, n.text)
      }
    }, this.indexToPosition = function(e, t) {
      var n = this.$lines || this.getAllLines(),
          r = this.getNewLineCharacter().length;
      for (var i = t || 0, s = n.length; i < s; i++) {
        e -= n[i].length + r;
        if (e < 0)
          return { row: i, column: e + n[i].length + r }
      }
      return { row: s - 1, column: n[s - 1].length }
    }, this.positionToIndex = function(e, t) {
      var n = this.$lines || this.getAllLines(),
          r = this.getNewLineCharacter().length, i = 0,
          s = Math.min(e.row, n.length);
      for (var o = t || 0; o < s; ++o)
        i += n[o].length;
      return i + r * o + e.column
    }
}).call(u.prototype),
    t.Document = u
           }),
    define("ace/range", [ "require", "exports", "module" ],
           function(e, t, n) {
var r = function(e, t) { return e.row - t.row || e.column - t.column },
    i = function(e, t, n, r) {
      this.start = {row : e, column : t}, this.end = {row : n, column : r}
    };
(function() {
this.isEqual = function(e) {
  return this.start.row === e.start.row && this.end.row === e.end.row &&
         this.start.column === e.start.column &&
         this.end.column === e.end.column
}, this.toString = function() {
  return "Range: [" + this.start.row + "/" + this.start.column + "] -> [" +
         this.end.row + "/" + this.end.column + "]"
}, this.contains = function(e, t) {
  return this.compare(e, t) == 0
}, this.compareRange = function(e) {
  var t, n = e.end, r = e.start;
  return t = this.compare(n.row, n.column),
         t == 1
             ? (t = this.compare(r.row, r.column), t == 1 ? 2 : t == 0 ? 1 : 0)
             : t == -1 ? -2
                       : (t = this.compare(r.row, r.column),
                          t == -1 ? -1 : t == 1 ? 42 : 0)
}, this.comparePoint = function(e) {
  return this.compare(e.row, e.column)
}, this.containsRange = function(e) {
  return this.comparePoint(e.start) == 0 && this.comparePoint(e.end) == 0
}, this.intersects = function(e) {
  var t = this.compareRange(e);
  return t == -1 || t == 0 || t == 1
}, this.isEnd = function(e, t) {
  return this.end.row == e && this.end.column == t
}, this.isStart = function(e, t) {
  return this.start.row == e && this.start.column == t
}, this.setStart = function(e, t) {
  typeof e == "object" ? (this.start.column = e.column, this.start.row = e.row)
                       : (this.start.row = e, this.start.column = t)
}, this.setEnd = function(e, t) {
  typeof e == "object" ? (this.end.column = e.column, this.end.row = e.row)
                       : (this.end.row = e, this.end.column = t)
}, this.inside = function(e, t) {
  return this.compare(e, t) == 0
             ? this.isEnd(e, t) || this.isStart(e, t) ? !1 : !0
             : !1
}, this.insideStart = function(e, t) {
  return this.compare(e, t) == 0 ? this.isEnd(e, t) ? !1 : !0 : !1
}, this.insideEnd = function(e, t) {
  return this.compare(e, t) == 0 ? this.isStart(e, t) ? !1 : !0 : !1
}, this.compare = function(e, t) {
  return !this.isMultiLine() && e === this.start.row
             ? t < this.start.column ? -1 : t > this.end.column ? 1 : 0
             : e < this.start.row
                   ? -1
                   : e > this.end.row ? 1
                                      : this.start.row === e
                                            ? t >= this.start.column ? 0 : -1
                                            : this.end.row === e
                                                  ? t <= this.end.column ? 0 : 1
                                                  : 0
}, this.compareStart = function(e, t) {
  return this.start.row == e && this.start.column == t ? -1 : this.compare(e, t)
}, this.compareEnd = function(e, t) {
  return this.end.row == e && this.end.column == t ? 1 : this.compare(e, t)
}, this.compareInside = function(e, t) {
  return this.end.row == e && this.end.column == t
             ? 1
             : this.start.row == e && this.start.column == t
                   ? -1
                   : this.compare(e, t)
}, this.clipRows = function(e, t) {
  if (this.end.row > t)
    var n = {row : t + 1, column : 0};
  else if (this.end.row < e)
    var n = {row : e, column : 0};
  if (this.start.row > t)
    var r = {row : t + 1, column : 0};
  else if (this.start.row < e)
    var r = {row : e, column : 0};
  return i.fromPoints(r || this.start, n || this.end)
}, this.extend = function(e, t) {
  var n = this.compare(e, t);
  if (n == 0)
    return this;
  if (n == -1)
    var r = {row : e, column : t};
  else
    var s = {row : e, column : t};
  return i.fromPoints(r || this.start, s || this.end)
}, this.isEmpty = function() {
  return this.start.row === this.end.row &&
         this.start.column === this.end.column
}, this.isMultiLine = function() {
  return this.start.row !== this.end.row
}, this.clone = function() {
  return i.fromPoints(this.start, this.end)
}, this.collapseRows = function() {
  return this.end.column == 0
             ? new i(this.start.row, 0,
                     Math.max(this.start.row, this.end.row - 1), 0)
             : new i(this.start.row, 0, this.end.row, 0)
}, this.toScreenRange = function(e) {
  var t = e.documentToScreenPosition(this.start),
      n = e.documentToScreenPosition(this.end);
  return new i(t.row, t.column, n.row, n.column)
}, this.moveBy = function(e, t) {
  this.start.row += e, this.start.column += t, this.end.row += e,
      this.end.column += t
}
}).call(i.prototype),
    i.fromPoints = function(
        e, t) { return new i(e.row, e.column, t.row, t.column) },
    i.comparePoints = r, t.Range = i
           }),
    define(
        "ace/anchor",
        [
          "require", "exports", "module", "ace/lib/oop", "ace/lib/event_emitter"
        ],
        function(e, t, n) {
var r = e("./lib/oop"), i = e("./lib/event_emitter").EventEmitter,
    s = t.Anchor = function(e, t, n) {
      this.document = e,
      typeof n == "undefined" ? this.setPosition(t.row, t.column)
                              : this.setPosition(t, n),
      this.$onChange = this.onChange.bind(this), e.on("change", this.$onChange)
    };
(function() {
r.implement(this, i),
    this.getPosition =
        function() {
      return this.$clipPositionToDocument(this.row, this.column)
    },
    this.getDocument = function() { return this.document },
    this.onChange = function(e) {
      var t = e.data, n = t.range;
      if (n.start.row == n.end.row && n.start.row != this.row)
        return;
      if (n.start.row > this.row)
        return;
      if (n.start.row == this.row && n.start.column > this.column)
        return;
      var r = this.row, i = this.column;
      t.action === "insertText"
          ? n.start.row === r &&n.start.column <= i
                ? n.start.row === n.end.row
                      ? i += n.end.column - n.start.column
                      : (i -= n.start.column, r += n.end.row - n.start.row)
                : n.start.row !== n.end.row && n.start.row < r &&
                      (r += n.end.row - n.start.row)
          : t.action === "insertLines"
                ? n.start.row <= r && (r += n.end.row - n.start.row)
                : t.action == "removeText"
                      ? n.start.row == r &&n.start.column < i
                            ? n.end.column >= i
                                  ? i = n.start.column
                                  : i = Math.max(
                                        0, i - (n.end.column - n.start.column))
                            : n.start.row !== n.end.row && n.start.row < r
                                  ? (n.end.row == r &&
                                         (i = Math.max(0, i - n.end.column) +
                                              n.start.column),
                                     r -= n.end.row - n.start.row)
                                  : n.end.row == r &&
                                        (r -= n.end.row - n.start.row,
                                         i = Math.max(0, i - n.end.column) +
                                             n.start.column)
                      : t.action == "removeLines" && n.start.row <= r &&
                            (n.end.row <= r ? r -= n.end.row - n.start.row
                                            : (r = n.start.row, i = 0)),
                                    this.setPosition(r, i, !0)
    }, this.setPosition = function(e, t, n) {
      var r;
      n ? r = {row : e, column : t} : r = this.$clipPositionToDocument(e, t);
      if (this.row == r.row && this.column == r.column)
        return;
      var i = {row : this.row, column : this.column};
      this.row = r.row, this.column = r.column,
      this._emit("change", {old : i, value : r})
    }, this.detach = function() {
      this.document.removeEventListener("change", this.$onChange)
    }, this.$clipPositionToDocument = function(e, t) {
      var n = {};
      return e >= this.document.getLength()
                 ? (n.row = Math.max(0, this.document.getLength() - 1),
                    n.column = this.document.getLine(n.row).length)
                 : e < 0 ? (n.row = 0, n.column = 0)
                         : (n.row = e, n.column = Math.min(
                                           this.document.getLine(n.row).length,
                                           Math.max(0, t))),
             t < 0 && (n.column = 0), n
    }
}).call(s.prototype)
        }),
    define("ace/lib/lang", [ "require", "exports", "module" ],
           function(e, t, n) {
t.stringReverse = function(e) { return e.split("").reverse().join("") },
    t.stringRepeat = function(e, t) {
      var n = "";
      while (t > 0) {
        t&1 && (n += e);
        if (t >>= 1)
          e += e
      }
      return n
    };
var r = /^\s\s*/, i = /\s\s*$/;
t.stringTrimLeft = function(e) { return e.replace(r, "") },
    t.stringTrimRight = function(e) { return e.replace(i, "") },
    t.copyObject = function(e) {
      var t = {};
      for (var n in e)
        t[n] = e[n];
      return t
    }, t.copyArray = function(e) {
      var t = [];
      for (var n = 0, r = e.length; n < r; n++)
        e[n] && typeof e[n] == "object" ? t[n] = this.copyObject(e[n])
                                        : t[n] = e[n];
      return t
    }, t.deepCopy = function(e) {
      if (typeof e != "object")
        return e;
      var t = e.constructor();
      for (var n in e)
        typeof e[n] == "object" ? t[n] = this.deepCopy(e[n]) : t[n] = e[n];
      return t
    }, t.arrayToMap = function(e) {
      var t = {};
      for (var n = 0; n < e.length; n++)
        t[e[n]] = 1;
      return t
    }, t.createMap = function(e) {
      var t = Object.create(null);
      for (var n in e)
        t[n] = e[n];
      return t
    }, t.arrayRemove = function(e, t) {
      for (var n = 0; n <= e.length; n++)
        t === e[n] && e.splice(n, 1)
    }, t.escapeRegExp = function(e) {
      return e.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
    }, t.escapeHTML = function(e) {
      return e.replace(/&/g, "&#38;")
          .replace(/"/g, "&#34;")
          .replace(/'/g, "&#39;")
          .replace(/</g, "&#60;")
    }, t.getMatchOffsets = function(e, t) {
      var n = [];
      return e.replace(t, function(e) {
        n.push({offset : arguments[arguments.length - 2], length : e.length})
      }), n
    }, t.deferredCall = function(e) {
      var t = null, n = function() { t = null, e() },
          r = function(e) { return r.cancel(), t = setTimeout(n, e || 0), r };
      return r.schedule = r,
             r.call = function() { return this.cancel(), e(), r },
             r.cancel = function() { return clearTimeout(t), t = null, r }, r
    }, t.delayedCall = function(e, t) {
      var n = null, r = function() { n = null, e() },
          i = function(e) { n && clearTimeout(n), n = setTimeout(r, e || t) };
      return i.delay = i,
             i.schedule = function(
                 e) { n == null && (n = setTimeout(r, e || 0)) },
             i.call = function() { this.cancel(), e() },
             i.cancel = function() { n && clearTimeout(n), n = null },
             i.isPending = function() { return n }, i
    }
           }),
    define("ace/mode/javascript/jshint", [ "require", "exports", "module" ],
           function(e, t, n) {
var r = function() {
  function e() {}
  function t(e, t) { return Object.prototype.hasOwnProperty.call(e, t) }
  function n(e, t) {
    ht[e] === undefined && ct[e] === undefined &&
        d("Bad option: '" + e + "'.", t)
  }
  function i(e) {
    return Object.prototype.toString.call(e) === "[object String]"
  }
  function s(e) { return e >= "a" && e <= "z￿" || e >= "A" && e <= "Z￿" }
  function o(e) { return e >= "0" && e <= "9" }
  function u(e, t) { return e ? !e.identifier || e.value !== t ? !1 : !0 : !1 }
  function a(e, t) {
    return e.replace(/\{([^{}]*)\}/g, function(e, n) {
      var r = t[n];
      return typeof r == "string" || typeof r == "number" ? r : e
    })
  }
  function f(e, n) {
    var i;
    for (i in n)
      t(n, i) && !t(r.blacklist, i) && (e[i] = n[i])
  }
  function l() {
    Object.keys(r.blacklist).forEach(function(e) { delete Ft[e] })
  }
  function c() {
    jt.couch && f(Ft, mt), jt.rhino && f(Ft, zt), jt.prototypejs && f(Ft, Rt),
        jt.node && (f(Ft, Ht), jt.globalstrict = !0), jt.devel && f(Ft, yt),
        jt.dojo && f(Ft, bt), jt.browser && f(Ft, vt),
        jt.nonstandard && f(Ft, $t), jt.jquery && f(Ft, Lt),
        jt.mootools && f(Ft, Dt), jt.worker && f(Ft, nn), jt.wsh && f(Ft, rn),
        jt.esnext && en(),
        jt.globalstrict && jt.strict !== !1 && (jt.strict = !0),
        jt.yui && f(Ft, sn)
  }
  function h(e, t, n) {
    var r = Math.floor(t / At.length * 100);
    throw {
      name: "JSHintError", line: t, character: n,
          message: e + " (" + r + "% scanned).", raw: e
    }
  }
  function p(e, t, n, i) { return r.undefs.push([ e, t, n, i ]) }
  function d(e, t, n, i, s, o) {
    var u, f, l;
    return t = t || Pt, t.id === "(end)" && (t = Gt), f = t.line || 0,
           u = t.from || 0, l = {
             id : "(error)",
             raw : e,
             evidence : At[f - 1] || "",
             line : f,
             character : u,
             scope : r.scope,
             a : n,
             b : i,
             c : s,
             d : o
           },
           l.reason = a(e, l), r.errors.push(l),
           jt.passfail && h("Stopping. ", f, u), tn += 1,
           tn >= jt.maxerr && h("Too many errors.", f, u), l
  }
  function v(e, t, n, r, i, s, o) {
    return d(e, {line : t, from : n}, r, i, s, o)
  }
  function m(e, t, n, r, i, s) { d(e, t, n, r, i, s) }
  function g(e, t, n, r, i, s, o) {
    return m(e, {line : t, from : n}, r, i, s, o)
  }
  function y(e, t) {
    var n;
    return n = {id : "(internal)", elem : e, value : t}, r.internals.push(n), n
  }
  function b(e, n, r) {
    e === "hasOwnProperty" && d("'hasOwnProperty' is a really bad name."),
        n === "exception" && t(wt["(context)"], e) && wt[e] !== !0 &&
            !jt.node && d("Value of '{a}' may be overwritten in IE.", Pt, e),
        t(wt, e) && !wt["(global)"] &&
            (wt[e] === !0
                 ? jt.latedef &&
                       d("'{a}' was used before it was defined.", Pt, e)
                 : !jt.shadow && n !== "exception" &&
                       d("'{a}' is already defined.", Pt, e)),
        wt[e] = n, r && (wt["(tokens)"][e] = r),
        wt["(global)"]
            ? (xt[e] = wt,
               t(Tt, e) &&
                   (jt.latedef &&
                        d("'{a}' was used before it was defined.", Pt, e),
                    delete Tt[e]))
            : Wt[e] = wt
  }
  function w() {
    var e = Pt, i = e.value, s = jt.quotmark, o = {}, u, a, h, p, d, v, g;
    switch (i) {
    case "*/":
      m("Unbegun comment.");
      break;
    case "/*members":
    case "/*member":
      i = "/*members", _t || (_t = {}), a = _t, jt.quotmark = !1;
      break;
    case "/*jshint":
    case "/*jslint":
      a = jt, h = ct;
      break;
    case "/*global":
      a = o;
      break;
    default:
      m("What?")
    }
    p = vn.token();
    for (;;) {
      g = !1;
      var y;
      for (;;) {
        if (p.type === "special" && p.value === "*/") {
          y = !0;
          break
        }
        if (p.id !== "(endline)" && p.id !== ",")
          break;
        p = vn.token()
      }
      if (y)
        break;
      i === "/*global" && p.value === "-" && (g = !0, p = vn.token()),
          p.type !== "(string)" && p.type !== "(identifier)" &&
              i !== "/*members" && m("Bad option.", p),
          v = vn.token();
      if (v.id === ":") {
        v = vn.token(),
        a === _t && m("Expected '{a}' and instead saw '{b}'.", p, "*/", ":"),
        i === "/*jshint" && n(p.value, p);
        var b = [
          "maxstatements", "maxparams", "maxdepth", "maxcomplexity", "maxerr",
          "maxlen", "indent"
        ];
        if (b.indexOf(p.value) > -1 && (i === "/*jshint" || i === "/*jslint"))
          u = +v.value,
          (typeof u != "number" || !isFinite(u) || u <= 0 ||
           Math.floor(u) !== u) &&
              m("Expected a small integer and instead saw '{a}'.", v, v.value),
          p.value === "indent" && (a.white = !0), a[p.value] = u;
        else if (p.value === "validthis")
          wt["(global)"]
              ? m("Option 'validthis' can't be used in a global scope.")
              : v.value === "true" || v.value === "false"
                    ? a[p.value] = v.value === "true"
                    : m("Bad option value.", v);
        else if (p.value === "quotmark" && i === "/*jshint")
          switch (v.value) {
          case "true":
            a.quotmark = !0;
            break;
          case "false":
            a.quotmark = !1;
            break;
          case "double":
          case "single":
            a.quotmark = v.value;
            break;
          default:
            m("Bad option value.", v)
          }
        else
          v.value === "true" || v.value === "false"
              ? (i === "/*jslint"
                     ? (d = dt[p.value] || p.value, a[d] = v.value === "true",
                        pt[d] !== undefined && (a[d] = !a[d]))
                     : a[p.value] = v.value === "true",
                 p.value === "newcap" && (a["(explicitNewcap)"] = !0))
              : m("Bad option value.", v);
        p = vn.token()
      } else
        (i === "/*jshint" || i === "/*jslint") && m("Missing option value.", p),
            a[p.value] = !1,
            i === "/*global" && g === !0 &&
                (r.blacklist[p.value] = p.value, l()),
            p = v
    }
    i === "/*members" && (jt.quotmark = s), f(Ft, o);
    for (var w in o)
      t(o, w) && (gt[w] = e);
    h && c()
  }
  function E(e) {
    var t = e || 0, n = 0, r;
    while (n <= t)
      r = Ot[n], r || (r = Ot[n] = vn.token()), n += 1;
    return r
  }
  function S(e, t) {
    switch (Gt.id) {
    case "(number)":
      Pt.id === "." &&
          d("A dot following a number can be confused with a decimal point.",
            Gt);
      break;
    case "-":
      (Pt.id === "-" || Pt.id === "--") && d("Confusing minusses.");
      break;
    case "+":
      (Pt.id === "+" || Pt.id === "++") && d("Confusing plusses.")
    }
    if (Gt.type === "(string)" || Gt.identifier)
      ft = Gt.value;
    e && Pt.id !== e &&
        (t ? Pt.id === "(end)"
                 ? d("Unmatched '{a}'.", t, t.id)
                 : d("Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.",
                     Pt, e, t.id, t.line, Pt.value)
           : (Pt.type !== "(identifier)" || Pt.value !== e) &&
                 d("Expected '{a}' and instead saw '{b}'.", Pt, e, Pt.value)),
        qt = Gt, Gt = Pt;
    for (;;) {
      Pt = Ot.shift() || vn.token();
      if (Pt.id === "(end)" || Pt.id === "(error)")
        return;
      if (Pt.type === "special")
        w();
      else if (Pt.id !== "(endline)")
        break
    }
  }
  function x(e, t) {
    var n, r = !1, i = !1;
    Pt.id === "(end)" && m("Unexpected early end of program.", Gt), S(),
        t && (ft = "anonymous", wt["(verb)"] = Gt.value);
    if (t === !0 && Gt.fud)
      n = Gt.fud();
    else {
      if (Gt.nud)
        n = Gt.nud();
      else {
        if (Pt.type === "(number)" && Gt.id === ".")
          return d("A leading decimal point can be confused with a dot: '.{a}'.",
                   Gt, Pt.value),
                 S(), Gt;
        m("Expected an identifier and instead saw '{a}'.", Gt, Gt.id)
      }
      while (e < Pt.lbp)
        r = Gt.value === "Array", i = Gt.value === "Object",
        n && (n.value || n.first && n.first.value) &&
            (n.value !== "new" ||
             n.first && n.first.value && n.first.value === ".") &&
            (r = !1, n.value !== Gt.value && (i = !1)),
        S(),
        r && Gt.id === "(" && Pt.id === ")" &&
            d("Use the array literal notation [].", Gt),
        i && Gt.id === "(" && Pt.id === ")" &&
            d("Use the object literal notation {}.", Gt),
        Gt.led ? n = Gt.led(n)
               : m("Expected an operator and instead saw '{a}'.", Gt, Gt.id)
    }
    return n
  }
  function T(e, t) {
    e = e || Gt, t = t || Pt,
    jt.white && e.character !== t.from && e.line === t.line &&
        (e.from += e.character - e.from,
         d("Unexpected space after '{a}'.", e, e.value))
  }
  function N(e, t) {
    e = e || Gt, t = t || Pt,
    jt.white && (e.character !== t.from || e.line !== t.line) &&
        d("Unexpected space before '{a}'.", t, t.value)
  }
  function C(e, t) {
    e = e || Gt, t = t || Pt,
    jt.white && !e.comment && e.line === t.line && T(e, t)
  }
  function k(e, t) {
    if (jt.white) {
      e = e || Gt, t = t || Pt;
      if (e.value === ";" && t.value === ";")
        return;
      e.line === t.line && e.character === t.from &&
          (e.from += e.character - e.from,
           d("Missing space after '{a}'.", e, e.value))
    }
  }
  function L(e, t) {
    e = e || Gt, t = t || Pt,
    !jt.laxbreak && e.line !== t.line
        ? d("Bad line breaking before '{a}'.", t, t.id)
        : jt.white && (e = e || Gt, t = t || Pt,
                       e.character === t.from &&
                           (e.from += e.character - e.from,
                            d("Missing space after '{a}'.", e, e.value)))
  }
  function A(e) {
    var t;
    jt.white && Pt.id !== "(end)" &&
        (t = Ct + (e || 0),
         Pt.from !== t &&
             d("Expected '{a}' to have an indentation at {b} instead at {c}.",
               Pt, Pt.value, t, Pt.from))
  }
  function O(e) {
    e = e || Gt,
    e.line !== Pt.line && d("Line breaking error '{a}'.", e, e.value)
  }
  function M() {
    Gt.line !== Pt.line
        ? jt.laxcomma ||
              (M.first &&
                   (d("Comma warnings can be turned off with 'laxcomma'"),
                    M.first = !1),
               d("Bad line breaking before '{a}'.", Gt, Pt.id))
        : !Gt.comment && Gt.character !== Pt.from && jt.white &&
              (Gt.from += Gt.character - Gt.from,
               d("Unexpected space after '{a}'.", Gt, Gt.value)),
        S(","), k(Gt, Pt)
  }
  function _(e, t) {
    var n = Kt[e];
    if (!n || typeof n != "object")
      Kt[e] = n = {id : e, lbp : t, value : e};
    return n
  }
  function D(e) { return _(e, 0) }
  function P(e, t) {
    var n = D(e);
    return n.identifier = n.reserved = !0, n.fud = t, n
  }
  function H(e, t) {
    var n = P(e, t);
    return n.block = !0, n
  }
  function B(e) {
    var t = e.id.charAt(0);
    if (t >= "a" && t <= "z" || t >= "A" && t <= "Z")
      e.identifier = e.reserved = !0;
    return e
  }
  function j(e, t) {
    var n = _(e, 150);
    return B(n), n.nud = typeof t == "function" ? t : function() {
      this.right = x(150), this.arity = "unary";
      if (this.id === "++" || this.id === "--")
        jt.plusplus ? d("Unexpected use of '{a}'.", this, this.id)
                    : (!this.right.identifier || this.right.reserved) &&
                          this.right.id !== "." && this.right.id !== "[" &&
                          d("Bad operand.", this);
      return this
    }, n
  }
  function F(e, t) {
    var n = D(e);
    return n.type = e, n.nud = t, n
  }
  function I(e, t) {
    var n = F(e, t);
    return n.identifier = n.reserved = !0, n
  }
  function q(e, t) {
    return I(e, function() { return typeof t == "function" && t(this), this })
  }
  function R(e, t, n, r) {
    var i = _(e, n);
    return B(i), i.led = function(i) {
      return r || (L(qt, Gt), k(Gt, Pt)),
             e === "in" && i.id === "!" && d("Confusing use of '{a}'.", i, "!"),
             typeof t == "function" ? t(i, this)
                                    : (this.left = i, this.right = x(n), this)
    }, i
  }
  function U(e, t) {
    var n = _(e, 100);
    return n.led = function(e) {
      L(qt, Gt), k(Gt, Pt);
      var n = x(100);
      return u(e, "NaN") || u(n, "NaN")
                 ? d("Use the isNaN function to compare with NaN.", this)
                 : t && t.apply(this, [ e, n ]),
             e.id === "!" && d("Confusing use of '{a}'.", e, "!"),
             n.id === "!" && d("Confusing use of '{a}'.", n, "!"),
             this.left = e, this.right = n, this
    }, n
  }
  function z(e) {
    return e && (e.type === "(number)" && +e.value === 0 ||
                 e.type === "(string)" && e.value === "" ||
                 e.type === "null" && !jt.eqnull || e.type === "true" ||
                 e.type === "false" || e.type === "undefined")
  }
  function W(e) {
    return _(e, 20).exps = !0, R(e, function(e, t) {
             t.left = e,
             Ft[e.value] === !1 && Wt[e.value]["(global)"] === !0
                 ? d("Read only.", e)
                 : e["function"] && d("'{a}' is a function.", e, e.value);
             if (e) {
               jt.esnext && wt[e.value] === "const" &&
                   d("Attempting to override '{a}' which is a constant", e,
                     e.value);
               if (e.id === "." || e.id === "[")
                 return (!e.left || e.left.value === "arguments") &&
                            d("Bad assignment.", t),
                        t.right = x(19), t;
               if (e.identifier && !e.reserved)
                 return wt[e.value] === "exception" &&
                            d("Do not assign to the exception parameter.", e),
                        t.right = x(19), t;
               e === Kt["function"] &&
                   d("Expected an identifier in an assignment and instead saw a function invocation.",
                     Gt)
             }
             m("Bad assignment.", t)
           }, 20)
  }
  function X(e, t, n) {
    var r = _(e, n);
    return B(r), r.led = typeof t == "function" ? t : function(e) {
      return jt.bitwise && d("Unexpected use of '{a}'.", this, this.id),
             this.left = e, this.right = x(n), this
    }, r
  }
  function V(e) {
    return _(e, 20).exps = !0, R(e, function(e, t) {
             jt.bitwise && d("Unexpected use of '{a}'.", t, t.id), k(qt, Gt),
                 k(Gt, Pt);
             if (e)
               return e.id === "." || e.id === "[" ||
                              e.identifier && !e.reserved
                          ? (x(19), t)
                          : (e === Kt["function"] &&
                                 d("Expected an identifier in an assignment, and instead saw a function invocation.",
                                   Gt),
                             t);
             m("Bad assignment.", t)
           }, 20)
  }
  function $(e) {
    var t = _(e, 150);
    return t.led = function(e) {
      return jt.plusplus ? d("Unexpected use of '{a}'.", this, this.id)
                         : (!e.identifier || e.reserved) && e.id !== "." &&
                               e.id !== "[" && d("Bad operand.", this),
             this.left = e, this
    }, t
  }
  function J(e) {
    if (Pt.identifier)
      return S(),
             Gt.reserved && !jt.es5 && (!e || Gt.value !== "undefined") &&
                 d("Expected an identifier and instead saw '{a}' (a reserved word).",
                   Gt, Gt.id),
             Gt.value
  }
  function K(e) {
    var t = J(e);
    if (t)
      return t;
    Gt.id === "function" && Pt.id === "("
        ? d("Missing name in function declaration.")
        : m("Expected an identifier and instead saw '{a}'.", Pt, Pt.value)
  }
  function Q(e) {
    var t = 0, n;
    if (Pt.id !== ";" || Bt)
      return;
    for (;;) {
      n = E(t);
      if (n.reach)
        return;
      if (n.id !== "(endline)") {
        if (n.id === "function") {
          if (!jt.latedef)
            break;
          d("Inner functions should be listed at the top of the outer function.",
            n);
          break
        }
        d("Unreachable '{a}' after '{b}'.", n, n.value, e);
        break
      }
      t += 1
    }
  }
  function G(e) {
    var t = Ct, n, r = Wt, i = Pt;
    if (i.id === ";") {
      S(";");
      return
    }
    i.identifier && !i.reserved && E().id === ":" &&
        (S(), S(":"), Wt = Object.create(r), b(i.value, "label"),
         !Pt.labelled && Pt.value !== "{" &&
             d("Label '{a}' on {b} statement.", Pt, i.value, Pt.value),
         pn.test(i.value + ":") &&
             d("Label '{a}' looks like a javascript url.", i, i.value),
         Pt.label = i.value, i = Pt);
    if (i.id === "{") {
      et(!0, !0);
      return
    }
    e || A(), n = x(0, !0);
    if (!i.block) {
      !jt.expr && (!n || !n.exps)
          ? d("Expected an assignment or function call and instead saw an expression.",
              Gt)
          : jt.nonew && n.id === "(" && n.left.id === "new" &&
                d("Do not use 'new' for side effects.", i);
      if (Pt.id === ",")
        return M();
      Pt.id !== ";"
          ? jt.asi || (!jt.lastsemic || Pt.id !== "}" || Pt.line !== Gt.line) &&
                          v("Missing semicolon.", Gt.line, Gt.character)
          : (T(Gt, Pt), S(";"), k(Gt, Pt))
    }
    return Ct = t, Wt = r, n
  }
  function Y(e) {
    var t = [], n;
    while (!Pt.reach && Pt.id !== "(end)")
      Pt.id === ";"
          ? (n = E(), (!n || n.id !== "(") && d("Unnecessary semicolon."),
             S(";"))
          : t.push(G(e === Pt.line));
    return t
  }
  function Z() {
    var e, t, n;
    for (;;) {
      if (Pt.id === "(string)") {
        t = E(0);
        if (t.id === "(endline)") {
          e = 1;
          do
            n = E(e), e += 1;
          while (n.id === "(endline)");
          if (n.id !== ";") {
            if (n.id !== "(string)" && n.id !== "(number)" &&
                n.id !== "(regexp)" && n.identifier !== !0 && n.id !== "}")
              break;
            d("Missing semicolon.", Pt)
          } else
            t = n
        } else if (t.id === "}")
          d("Missing semicolon.", t);
        else if (t.id !== ";")
          break;
        A(), S(),
            Jt[Gt.value] && d('Unnecessary directive "{a}".', Gt, Gt.value),
            Gt.value === "use strict" &&
                (jt["(explicitNewcap)"] || (jt.newcap = !0), jt.undef = !0),
            Jt[Gt.value] = !0, t.id === ";" && S(";");
        continue
      }
      break
    }
  }
  function et(e, n, r) {
    var i, s = Nt, o = Ct, u, a = Wt, f, l, c;
    Nt = e;
    if (!e || !jt.funcscope)
      Wt = Object.create(Wt);
    k(Gt, Pt), f = Pt;
    var h = wt["(metrics)"];
    h.nestedBlockDepth += 1, h.verifyMaxNestedBlockDepthPerFunction();
    if (Pt.id === "{") {
      S("{"), l = Gt.line;
      if (Pt.id !== "}") {
        Ct += jt.indent;
        while (!e && Pt.from > Ct)
          Ct += jt.indent;
        if (r) {
          u = {};
          for (c in Jt)
            t(Jt, c) && (u[c] = Jt[c]);
          Z(), jt.strict && wt["(context)"]["(global)"] && !u["use strict"] &&
                   !Jt["use strict"] && d('Missing "use strict" statement.')
        }
        i = Y(l), h.statementCount += i.length, r && (Jt = u), Ct -= jt.indent,
        l !== Pt.line && A()
      } else
        l !== Pt.line && A();
      S("}", f), Ct = o
    } else
      e ? ((!n || jt.curly) &&
               d("Expected '{a}' and instead saw '{b}'.", Pt, "{", Pt.value),
           Bt = !0, Ct += jt.indent, i = [ G(Pt.line === Gt.line) ],
           Ct -= jt.indent, Bt = !1)
        : m("Expected '{a}' and instead saw '{b}'.", Pt, "{", Pt.value);
    wt["(verb)"] = null;
    if (!e || !jt.funcscope)
      Wt = a;
    return Nt = s,
           e && jt.noempty && (!i || i.length === 0) && d("Empty block."),
           h.nestedBlockDepth -= 1, i
  }
  function tt(e) {
    _t && typeof _t[e] != "boolean" && d("Unexpected /*member '{a}'.", Gt, e),
        typeof Mt[e] == "number" ? Mt[e] += 1 : Mt[e] = 1
  }
  function nt(e) {
    var t = e.value, n = e.line, r = Tt[t];
    typeof r == "function" && (r = !1),
        r ? r[r.length - 1] !== n && r.push(n) : (r = [ n ], Tt[t] = r)
  }
  function rt() {
    var e = J(!0);
    return e || (Pt.id === "(string)"
                     ? (e = Pt.value, S())
                     : Pt.id === "(number)" && (e = Pt.value.toString(), S())),
           e
  }
  function it() {
    var e = Pt, t = [], n;
    S("("), C();
    if (Pt.id === ")") {
      S(")");
      return
    }
    for (;;) {
      n = K(!0), t.push(n), b(n, "unused", Gt);
      if (Pt.id !== ",")
        return S(")", e), C(qt, Gt), t;
      M()
    }
  }
  function st(e, t) {
    var n, r = jt, i = Wt;
    return jt = Object.create(jt), Wt = Object.create(Wt), wt = {
      "(name)" : e || '"' + ft + '"',
      "(line)" : Pt.line,
      "(character)" : Pt.character,
      "(context)" : wt,
      "(breakage)" : 0,
      "(loopage)" : 0,
      "(metrics)" : ot(Pt),
      "(scope)" : Wt,
      "(statement)" : t,
      "(tokens)" : {}
    },
           n = wt, Gt.funct = wt, St.push(wt), e && b(e, "function"),
           wt["(params)"] = it(),
           wt["(metrics)"].verifyMaxParametersPerFunction(wt["(params)"]),
           et(!1, !1, !0), wt["(metrics)"].verifyMaxStatementsPerFunction(),
           wt["(metrics)"].verifyMaxComplexityPerFunction(), Wt = i, jt = r,
           wt["(last)"] = Gt.line, wt["(lastcharacter)"] = Gt.character,
           wt = wt["(context)"], n
  }
  function ot(e) {
    return {
      statementCount: 0, nestedBlockDepth: -1, ComplexityCount: 1,
          verifyMaxStatementsPerFunction: function() {
            if (jt.maxstatements && this.statementCount > jt.maxstatements) {
              var t = "Too many statements per function (" +
                      this.statementCount + ").";
              d(t, e)
            }
          }, verifyMaxParametersPerFunction: function(t) {
            t = t || [];
            if (jt.maxparams && t.length > jt.maxparams) {
              var n = "Too many parameters per function (" + t.length + ").";
              d(n, e)
            }
          }, verifyMaxNestedBlockDepthPerFunction: function() {
            if (jt.maxdepth && this.nestedBlockDepth > 0 &&
                this.nestedBlockDepth === jt.maxdepth + 1) {
              var e = "Blocks are nested too deeply (" + this.nestedBlockDepth +
                      ").";
              d(e)
            }
          }, verifyMaxComplexityPerFunction: function() {
            var t = jt.maxcomplexity, n = this.ComplexityCount;
            if (t && n > t) {
              var r =
                  "Cyclomatic complexity is too high per function (" + n + ").";
              d(r, e)
            }
          }
    }
  }
  function ut() { wt["(metrics)"].ComplexityCount += 1 }
  function at() {
    function e() {
      var e = {}, t = Pt;
      S("{");
      if (Pt.id !== "}")
        for (;;) {
          if (Pt.id === "(end)")
            m("Missing '}' to match '{' from line {a}.", Pt, t.line);
          else {
            if (Pt.id === "}") {
              d("Unexpected comma.", Gt);
              break
            }
            Pt.id === ","
                ? m("Unexpected comma.", Pt)
                : Pt.id !== "(string)" &&
                      d("Expected a string and instead saw {a}.", Pt, Pt.value)
          }
          e[Pt.value] === !0
              ? d("Duplicate key '{a}'.", Pt, Pt.value)
              : Pt.value === "__proto__" && !jt.proto ||
                        Pt.value === "__iterator__" && !jt.iterator
                    ? d("The '{a}' key may produce unexpected results.", Pt,
                        Pt.value)
                    : e[Pt.value] = !0,
                      S(), S(":"), at();
          if (Pt.id !== ",")
            break;
          S(",")
        }
      S("}")
    }
    function t() {
      var e = Pt;
      S("[");
      if (Pt.id !== "]")
        for (;;) {
          if (Pt.id === "(end)")
            m("Missing ']' to match '[' from line {a}.", Pt, e.line);
          else {
            if (Pt.id === "]") {
              d("Unexpected comma.", Gt);
              break
            }
            Pt.id === "," && m("Unexpected comma.", Pt)
          }
          at();
          if (Pt.id !== ",")
            break;
          S(",")
        }
      S("]")
    }
    switch (Pt.id) {
    case "{":
      e();
      break;
    case "[":
      t();
      break;
    case "true":
    case "false":
    case "null":
    case "(number)":
    case "(string)":
      S();
      break;
    case "-":
      S("-"), Gt.character !== Pt.from && d("Unexpected space after '-'.", Gt),
          T(Gt, Pt), S("(number)");
      break;
    default:
      m("Expected a JSON value.", Pt)
    }
  }
  var ft,
      lt = {
        "<" : !0,
        "<=" : !0,
        "==" : !0,
        "===" : !0,
        "!==" : !0,
        "!=" : !0,
        ">" : !0,
        ">=" : !0,
        "+" : !0,
        "-" : !0,
        "*" : !0,
        "/" : !0,
        "%" : !0
      },
      ct = {
        asi : !0,
        bitwise : !0,
        boss : !0,
        browser : !0,
        camelcase : !0,
        couch : !0,
        curly : !0,
        debug : !0,
        devel : !0,
        dojo : !0,
        eqeqeq : !0,
        eqnull : !0,
        es5 : !0,
        esnext : !0,
        evil : !0,
        expr : !0,
        forin : !0,
        funcscope : !0,
        globalstrict : !0,
        immed : !0,
        iterator : !0,
        jquery : !0,
        lastsemic : !0,
        latedef : !0,
        laxbreak : !0,
        laxcomma : !0,
        loopfunc : !0,
        mootools : !0,
        multistr : !0,
        newcap : !0,
        noarg : !0,
        node : !0,
        noempty : !0,
        nonew : !0,
        nonstandard : !0,
        nomen : !0,
        onevar : !0,
        onecase : !0,
        passfail : !0,
        plusplus : !0,
        proto : !0,
        prototypejs : !0,
        regexdash : !0,
        regexp : !0,
        rhino : !0,
        undef : !0,
        unused : !0,
        scripturl : !0,
        shadow : !0,
        smarttabs : !0,
        strict : !0,
        sub : !0,
        supernew : !0,
        trailing : !0,
        validthis : !0,
        withstmt : !0,
        white : !0,
        worker : !0,
        wsh : !0,
        yui : !0
      },
      ht = {
        maxlen : !1,
        indent : !1,
        maxerr : !1,
        predef : !1,
        quotmark : !1,
        scope : !1,
        maxstatements : !1,
        maxdepth : !1,
        maxparams : !1,
        maxcomplexity : !1
      },
      pt = {
        bitwise : !0,
        forin : !0,
        newcap : !0,
        nomen : !0,
        plusplus : !0,
        regexp : !0,
        undef : !0,
        white : !0,
        eqeqeq : !0,
        onevar : !0
      },
      dt = {eqeq : "eqeqeq", vars : "onevar", windows : "wsh"}, vt = {
        ArrayBuffer : !1,
        ArrayBufferView : !1,
        Audio : !1,
        Blob : !1,
        addEventListener : !1,
        applicationCache : !1,
        atob : !1,
        blur : !1,
        btoa : !1,
        clearInterval : !1,
        clearTimeout : !1,
        close : !1,
        closed : !1,
        DataView : !1,
        DOMParser : !1,
        defaultStatus : !1,
        document : !1,
        event : !1,
        FileReader : !1,
        Float32Array : !1,
        Float64Array : !1,
        FormData : !1,
        focus : !1,
        frames : !1,
        getComputedStyle : !1,
        HTMLElement : !1,
        HTMLAnchorElement : !1,
        HTMLBaseElement : !1,
        HTMLBlockquoteElement : !1,
        HTMLBodyElement : !1,
        HTMLBRElement : !1,
        HTMLButtonElement : !1,
        HTMLCanvasElement : !1,
        HTMLDirectoryElement : !1,
        HTMLDivElement : !1,
        HTMLDListElement : !1,
        HTMLFieldSetElement : !1,
        HTMLFontElement : !1,
        HTMLFormElement : !1,
        HTMLFrameElement : !1,
        HTMLFrameSetElement : !1,
        HTMLHeadElement : !1,
        HTMLHeadingElement : !1,
        HTMLHRElement : !1,
        HTMLHtmlElement : !1,
        HTMLIFrameElement : !1,
        HTMLImageElement : !1,
        HTMLInputElement : !1,
        HTMLIsIndexElement : !1,
        HTMLLabelElement : !1,
        HTMLLayerElement : !1,
        HTMLLegendElement : !1,
        HTMLLIElement : !1,
        HTMLLinkElement : !1,
        HTMLMapElement : !1,
        HTMLMenuElement : !1,
        HTMLMetaElement : !1,
        HTMLModElement : !1,
        HTMLObjectElement : !1,
        HTMLOListElement : !1,
        HTMLOptGroupElement : !1,
        HTMLOptionElement : !1,
        HTMLParagraphElement : !1,
        HTMLParamElement : !1,
        HTMLPreElement : !1,
        HTMLQuoteElement : !1,
        HTMLScriptElement : !1,
        HTMLSelectElement : !1,
        HTMLStyleElement : !1,
        HTMLTableCaptionElement : !1,
        HTMLTableCellElement : !1,
        HTMLTableColElement : !1,
        HTMLTableElement : !1,
        HTMLTableRowElement : !1,
        HTMLTableSectionElement : !1,
        HTMLTextAreaElement : !1,
        HTMLTitleElement : !1,
        HTMLUListElement : !1,
        HTMLVideoElement : !1,
        history : !1,
        Int16Array : !1,
        Int32Array : !1,
        Int8Array : !1,
        Image : !1,
        length : !1,
        localStorage : !1,
        location : !1,
        MessageChannel : !1,
        MessageEvent : !1,
        MessagePort : !1,
        moveBy : !1,
        moveTo : !1,
        MutationObserver : !1,
        name : !1,
        Node : !1,
        NodeFilter : !1,
        navigator : !1,
        onbeforeunload : !0,
        onblur : !0,
        onerror : !0,
        onfocus : !0,
        onload : !0,
        onresize : !0,
        onunload : !0,
        open : !1,
        openDatabase : !1,
        opener : !1,
        Option : !1,
        parent : !1,
        print : !1,
        removeEventListener : !1,
        resizeBy : !1,
        resizeTo : !1,
        screen : !1,
        scroll : !1,
        scrollBy : !1,
        scrollTo : !1,
        sessionStorage : !1,
        setInterval : !1,
        setTimeout : !1,
        SharedWorker : !1,
        status : !1,
        top : !1,
        Uint16Array : !1,
        Uint32Array : !1,
        Uint8Array : !1,
        WebSocket : !1,
        window : !1,
        Worker : !1,
        XMLHttpRequest : !1,
        XMLSerializer : !1,
        XPathEvaluator : !1,
        XPathException : !1,
        XPathExpression : !1,
        XPathNamespace : !1,
        XPathNSResolver : !1,
        XPathResult : !1
      },
      mt = {
        require : !1,
        respond : !1,
        getRow : !1,
        emit : !1,
        send : !1,
        start : !1,
        sum : !1,
        log : !1,
        exports : !1,
        module : !1,
        provides : !1
      },
      gt, yt = {
        alert : !1,
        confirm : !1,
        console : !1,
        Debug : !1,
        opera : !1,
        prompt : !1
      },
      bt = {dojo : !1, dijit : !1, dojox : !1, define : !1, require : !1}, wt,
      Et =
          [
            "closure", "exception", "global", "label", "outer", "unused", "var"
          ],
      St, xt, Tt, Nt, Ct, kt, Lt = {$ : !1, jQuery : !1}, At, Ot, Mt, _t, Dt = {
        $ : !1,
        $$ : !1,
        Asset : !1,
        Browser : !1,
        Chain : !1,
        Class : !1,
        Color : !1,
        Cookie : !1,
        Core : !1,
        Document : !1,
        DomReady : !1,
        DOMEvent : !1,
        DOMReady : !1,
        Drag : !1,
        Element : !1,
        Elements : !1,
        Event : !1,
        Events : !1,
        Fx : !1,
        Group : !1,
        Hash : !1,
        HtmlTable : !1,
        Iframe : !1,
        IframeShim : !1,
        InputValidator : !1,
        instanceOf : !1,
        Keyboard : !1,
        Locale : !1,
        Mask : !1,
        MooTools : !1,
        Native : !1,
        Options : !1,
        OverText : !1,
        Request : !1,
        Scroller : !1,
        Slick : !1,
        Slider : !1,
        Sortables : !1,
        Spinner : !1,
        Swiff : !1,
        Tips : !1,
        Type : !1,
        typeOf : !1,
        URI : !1,
        Window : !1
      },
      Pt, Ht = {
        __filename : !1,
        __dirname : !1,
        Buffer : !1,
        console : !1,
        exports : !0,
        GLOBAL : !1,
        global : !1,
        module : !1,
        process : !1,
        require : !1,
        setTimeout : !1,
        clearTimeout : !1,
        setInterval : !1,
        clearInterval : !1
      },
      Bt, jt, Ft, It, qt, Rt = {
        $ : !1,
        $$ : !1,
        $A : !1,
        $F : !1,
        $H : !1,
        $R : !1,
        $break : !1,
        $continue : !1,
        $w : !1,
        Abstract : !1,
        Ajax : !1,
        Class : !1,
        Enumerable : !1,
        Element : !1,
        Event : !1,
        Field : !1,
        Form : !1,
        Hash : !1,
        Insertion : !1,
        ObjectRange : !1,
        PeriodicalExecuter : !1,
        Position : !1,
        Prototype : !1,
        Selector : !1,
        Template : !1,
        Toggle : !1,
        Try : !1,
        Autocompleter : !1,
        Builder : !1,
        Control : !1,
        Draggable : !1,
        Draggables : !1,
        Droppables : !1,
        Effect : !1,
        Sortable : !1,
        SortableObserver : !1,
        Sound : !1,
        Scriptaculous : !1
      },
      Ut, zt = {
        defineClass : !1,
        deserialize : !1,
        gc : !1,
        help : !1,
        importPackage : !1,
        java : !1,
        load : !1,
        loadClass : !1,
        print : !1,
        quit : !1,
        readFile : !1,
        readUrl : !1,
        runCommand : !1,
        seal : !1,
        serialize : !1,
        spawn : !1,
        sync : !1,
        toint32 : !1,
        version : !1
      },
      Wt, Xt, Vt = {
        Array : !1,
        Boolean : !1,
        Date : !1,
        decodeURI : !1,
        decodeURIComponent : !1,
        encodeURI : !1,
        encodeURIComponent : !1,
        Error : !1,
        eval : !1,
        EvalError : !1,
        Function : !1,
        hasOwnProperty : !1,
        isFinite : !1,
        isNaN : !1,
        JSON : !1,
        Map : !1,
        Math : !1,
        NaN : !1,
        Number : !1,
        Object : !1,
        parseInt : !1,
        parseFloat : !1,
        RangeError : !1,
        ReferenceError : !1,
        RegExp : !1,
        Set : !1,
        String : !1,
        SyntaxError : !1,
        TypeError : !1,
        URIError : !1,
        WeakMap : !1
      },
      $t = {escape : !1, unescape : !1}, Jt, Kt = {}, Qt, Gt, Yt, Zt, en, tn,
      nn = {importScripts : !0, postMessage : !0, self : !0}, rn = {
        ActiveXObject : !0,
        Enumerator : !0,
        GetObject : !0,
        ScriptEngine : !0,
        ScriptEngineBuildVersion : !0,
        ScriptEngineMajorVersion : !0,
        ScriptEngineMinorVersion : !0,
        VBArray : !0,
        WSH : !0,
        WScript : !0,
        XDomainRequest : !0
      },
      sn = {YUI : !1, Y : !1, YUI_config : !1}, on, un, an, fn, ln, cn, hn, pn,
      dn;
  (function() {
    on = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i,
    un =
        /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/,
    an =
        /^\s*([(){}\[.,:;'"~\?\]#@]|==?=?|\/=(?!(\S*\/[gim]?))|\/(\*(jshint|jslint|members?|global)?|\/)?|\*[\/=]?|\+(?:=|\++)?|-(?:=|-+)?|%=?|&[&=]?|\|[|=]?|>>?>?=?|<([\/=!]|\!(\[|--)?|<=?)?|\^=?|\!=?=?|[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+([xX][0-9a-fA-F]+|\.[0-9]*)?([eE][+\-]?[0-9]+)?)/,
    fn =
        /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/,
    ln =
        /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    cn = /\*\//, hn = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/,
    pn = /^(?:javascript|jscript|ecmascript|vbscript|mocha|livescript)\s*:/i,
    dn = /^\s*\/\*\s*falls\sthrough\s*\*\/\s*$/
  })(),
      typeof Array.isArray != "function" &&
          (Array.isArray =
               function(e) {
                 return Object.prototype.toString.apply(e) === "[object Array]"
               }),
      Array.prototype.forEach || (Array.prototype.forEach =
                                      function(e, t) {
                                        var n = this.length;
                                        for (var r = 0; r < n; r++)
                                          e.call(t || this, this[r], r, this)
                                      }),
      Array.prototype.indexOf || (Array.prototype.indexOf = function(e) {
        if (this === null || this === undefined)
          throw new TypeError;
        var t = new Object(this), n = t.length >>> 0;
        if (n === 0)
          return -1;
        var r = 0;
        arguments.length > 0 &&
            (r = Number(arguments[1]),
             r != r ? r = 0
                    : r !== 0 && r != Infinity && r != -Infinity &&
                          (r = (r > 0 || -1) * Math.floor(Math.abs(r))));
        if (r >= n)
          return -1;
        var i = r >= 0 ? r : Math.max(n - Math.abs(r), 0);
        for (; i < n; i++)
          if (i in t && t[i] === e)
            return i;
        return -1
      }), typeof Object.create != "function" && (Object.create = function(t) {
            return e.prototype = t, new e
          }), typeof Object.keys != "function" && (Object.keys = function(e) {
                var n = [], r;
                for (r in e)
                  t(e, r) && n.push(r);
                return n
              });
  var vn = function() {
    function e() {
      var e, t, n;
      return u >= At.length
                 ? !1
                 : (r = 1, a = At[u], u += 1,
                    jt.smarttabs
                        ? (t = a.match(/(\/\/)? \t/), e = t && !t[1] ? 0 : -1)
                        : e = a.search(/ \t|\t [^\*]/),
                    e >= 0 && v("Mixed spaces and tabs.", u, e + 1),
                    a = a.replace(/\t/g, Qt), e = a.search(un),
                    e >= 0 && v("Unsafe character.", u, e),
                    jt.maxlen && jt.maxlen < a.length &&
                        v("Line too long.", u, a.length),
                    n = jt.trailing && a.match(/^(.*?)\s+$/),
                    n && !/^\s+$/.test(a) &&
                        v("Trailing whitespace.", u, n[1].length + 1),
                    !0)
    }
    function n(e, n) {
      function s(e) {
        if (!jt.proto && e === "__proto__") {
          v("The '{a}' property is deprecated.", u, i, e);
          return
        }
        if (!jt.iterator && e === "__iterator__") {
          v("'{a}' is only available in JavaScript 1.7.", u, i, e);
          return
        }
        var t = /^(_+.*|.*_+)$/.test(e);
        if (jt.nomen && t && e !== "_") {
          if (jt.node && Gt.id !== "." && /^(__dirname|__filename)$/.test(e))
            return;
          v("Unexpected {a} in '{b}'.", u, i, "dangling '_'", e);
          return
        }
        jt.camelcase && e.replace(/^_+/, "").indexOf("_") > -1 &&
            !e.match(/^[A-Z0-9_]*$/) &&
            v("Identifier '{a}' is not in camel case.", u, i, n)
      }
      var o, a;
      return e === "(color)" || e === "(range)"
                 ? a = {type : e}
                 : e === "(punctuator)" || e === "(identifier)" && t(Kt, n)
                       ? a = Kt[n] || Kt["(error)"]
                       : a = Kt[e],
                   a = Object.create(a),
                   (e === "(string)" || e === "(range)") && !jt.scripturl &&
                       pn.test(n) && v("Script URL.", u, i),
                   e === "(identifier)" && (a.identifier = !0, s(n)),
                   a.value = n, a.line = u, a.character = r, a.from = i,
                   o = a.id,
                   o !== "(endline)" &&
                       (It = o && ("(,=:[!&|?{};".indexOf(
                                       o.charAt(o.length - 1)) >= 0 ||
                                   o === "return" || o === "case")),
                   a
    }
    var r, i, u, a;
    return {
      init: function(t) {
        typeof t == "string"
            ? At = t.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n")
            : At = t,
              At[0] && At[0].substr(0, 2) === "#!" && (At[0] = ""), u = 0, e(),
              i = 1
      }, range: function(e, t) {
        var s, o = "";
        i = r, a.charAt(0) !== e && g("Expected '{a}' and instead saw '{b}'.",
                                      u, r, e, a.charAt(0));
        for (;;) {
          a = a.slice(1), r += 1, s = a.charAt(0);
          switch (s) {
          case "":
            g("Missing '{a}'.", u, r, s);
            break;
          case t:
            return a = a.slice(1), r += 1, n("(range)", o);
          case "\\":
            v("Unexpected '{a}'.", u, r, s)
          }
          o += s
        }
      }, token: function() {
        function t(e) {
          var t = e.exec(a), n;
          if (t)
            return w = t[0].length, n = t[1], c = n.charAt(0), a = a.substr(w),
                   i = r + w - n.length, r += w, n
        }
        function f(t) {
          function s(e) {
            var t = parseInt(a.substr(f + 1, e), 16);
            f += e,
                t >= 32 && t <= 126 && t !== 34 && t !== 92 && t !== 39 &&
                    v("Unnecessary escapement.", u, r),
                r += e, o = String.fromCharCode(t)
          }
          var o, f, l = "", c = !1;
          kt && t !== '"' && v("Strings must use doublequote.", u, r),
              jt.quotmark &&
                  (jt.quotmark === "single" && t !== "'"
                       ? v("Strings must use singlequote.", u, r)
                       : jt.quotmark === "double" && t !== '"'
                             ? v("Strings must use doublequote.", u, r)
                             : jt.quotmark === !0 &&
                                   (Ut = Ut || t,
                                    Ut !== t &&
                                        v("Mixed double and single quotes.", u,
                                          r))),
              f = 0;
          e: for (;;) {
            while (f >= a.length) {
              f = 0;
              var h = u, p = i;
              if (!e()) {
                g("Unclosed string.", h, p);
                break e
              }
              c ? c = !1 : v("Unclosed string.", h, p)
            }
            o = a.charAt(f);
            if (o === t)
              return r += 1, a = a.substr(f + 1), n("(string)", l, t);
            if (o < " ") {
              if (o === "\n" || o === "\r")
                break;
              v("Control character in string: {a}.", u, r + f, a.slice(0, f))
            } else if (o === "\\") {
              f += 1, r += 1, o = a.charAt(f), C = a.charAt(f + 1);
              switch (o) {
              case "\\":
              case '"':
              case "/":
                break;
              case "'":
                kt && v("Avoid \\'.", u, r);
                break;
              case "b":
                o = "\b";
                break;
              case "f":
                o = "\f";
                break;
              case "n":
                o = "\n";
                break;
              case "r":
                o = "\r";
                break;
              case "t":
                o = "	";
                break;
              case "0":
                o = "\0",
                C >= 0 && C <= 7 && Jt["use strict"] &&
                    v("Octal literals are not allowed in strict mode.", u, r);
                break;
              case "u":
                s(4);
                break;
              case "v":
                kt && v("Avoid \\v.", u, r), o = "";
                break;
              case "x":
                kt && v("Avoid \\x-.", u, r), s(2);
                break;
              case "":
                c = !0;
                if (jt.multistr) {
                  kt && v("Avoid EOL escapement.", u, r), o = "", r -= 1;
                  break
                }
                v("Bad escapement of EOL. Use option multistr if needed.", u,
                  r);
                break;
              case "!":
                if (a.charAt(f - 2) === "<")
                  break;
              default:
                v("Bad escapement.", u, r)
              }
            }
            l += o, r += 1, f += 1
          }
        }
        var l, c, p, d, m, y, b, w, E, S, x, T, N, C;
        for (;;) {
          if (!a)
            return n(e() ? "(endline)" : "(end)", "");
          x = t(an);
          if (!x) {
            x = "", c = "";
            while (a && a < "!")
              a = a.substr(1);
            a && (g("Unexpected '{a}'.", u, r, a.substr(0, 1)), a = "")
          } else {
            if (s(c) || c === "_" || c === "$")
              return n("(identifier)", x);
            if (o(c))
              return isFinite(Number(x)) || v("Bad number '{a}'.", u, r, x),
                     s(a.substr(0, 1)) &&
                         v("Missing space after '{a}'.", u, r, x),
                     c === "0" &&
                         (d = x.substr(1, 1),
                          o(d) ? Gt.id !== "." &&
                                     v("Don't use extra leading zeros '{a}'.",
                                       u, r, x)
                               : kt && (d === "x" || d === "X") &&
                                     v("Avoid 0x-. '{a}'.", u, r, x)),
                     x.substr(x.length - 1) === "." &&
                         v("A trailing decimal point can be confused with a dot '{a}'.",
                           u, r, x),
                     n("(number)", x);
            switch (x) {
            case '"':
            case "'":
              return f(x);
            case "//":
              a = "", Gt.comment = !0;
              break;
            case "/*":
              for (;;) {
                b = a.search(cn);
                if (b >= 0)
                  break;
                e() || g("Unclosed comment.", u, r)
              }
              a = a.substr(b + 2), Gt.comment = !0;
              break;
            case "/*members":
            case "/*member":
            case "/*jshint":
            case "/*jslint":
            case "/*global":
            case "*/":
              return {
                value : x,
                type : "special",
                line : u,
                character : r,
                from : i
              };
            case "":
              break;
            case "/":
              a.charAt(0) === "=" &&
                  g("A regular expression literal can be confused with '/='.",
                    u, i);
              if (It) {
                m = 0, p = 0, w = 0;
                for (;;) {
                  l = !0, c = a.charAt(w), w += 1;
                  switch (c) {
                  case "":
                    return g("Unclosed regular expression.", u, i),
                           h("Stopping.", u, i);
                  case "/":
                    m > 0 && v("{a} unterminated regular expression group(s).",
                               u, i + w, m),
                        c = a.substr(0, w - 1), S = {g : !0, i : !0, m : !0};
                    while (S[a.charAt(w)] === !0)
                      S[a.charAt(w)] = !1, w += 1;
                    return r += w, a = a.substr(w), S = a.charAt(0),
                                   (S === "/" || S === "*") &&
                                       g("Confusing regular expression.", u, i),
                                   n("(regexp)", c);
                  case "\\":
                    c = a.charAt(w),
                    c < " "
                        ? v("Unexpected control character in regular expression.",
                            u, i + w)
                        : c === "<" &&
                              v("Unexpected escaped character '{a}' in regular expression.",
                                u, i + w, c),
                    w += 1;
                    break;
                  case "(":
                    m += 1, l = !1;
                    if (a.charAt(w) === "?") {
                      w += 1;
                      switch (a.charAt(w)) {
                      case ":":
                      case "=":
                      case "!":
                        w += 1;
                        break;
                      default:
                        v("Expected '{a}' and instead saw '{b}'.", u, i + w,
                          ":", a.charAt(w))
                      }
                    } else
                      p += 1;
                    break;
                  case "|":
                    l = !1;
                    break;
                  case ")":
                    m === 0 ? v("Unescaped '{a}'.", u, i + w, ")") : m -= 1;
                    break;
                  case " ":
                    S = 1;
                    while (a.charAt(w) === " ")
                      w += 1, S += 1;
                    S > 1 &&
                        v("Spaces are hard to count. Use {{a}}.", u, i + w, S);
                    break;
                  case "[":
                    c = a.charAt(w),
                    c === "^" &&
                        (w += 1, a.charAt(w) === "]" &&
                                     g("Unescaped '{a}'.", u, i + w, "^")),
                    c === "]" && v("Empty class.", u, i + w - 1), T = !1,
                    N = !1;
                    e: do {
                      c = a.charAt(w), w += 1;
                      switch (c) {
                      case "[":
                      case "^":
                        v("Unescaped '{a}'.", u, i + w, c), N ? N = !1 : T = !0;
                        break;
                      case "-":
                        T && !N ? (T = !1, N = !0)
                                : N ? N = !1
                                    : a.charAt(w) === "]"
                                          ? N = !0
                                          : (jt.regexdash !==
                                                     (w === 2 ||
                                                      w === 3 && a.charAt(1) ===
                                                                     "^") &&
                                                 v("Unescaped '{a}'.", u,
                                                   i + w - 1, "-"),
                                             T = !0);
                        break;
                      case "]":
                        N && !jt.regexdash &&
                            v("Unescaped '{a}'.", u, i + w - 1, "-");
                        break e;
                      case "\\":
                        c = a.charAt(w),
                        c < " "
                            ? v("Unexpected control character in regular expression.",
                                u, i + w)
                            : c === "<" &&
                                  v("Unexpected escaped character '{a}' in regular expression.",
                                    u, i + w, c),
                        w += 1,
                        /[wsd]/i.test(c)
                            ? (N && (v("Unescaped '{a}'.", u, i + w, "-"),
                                     N = !1),
                               T = !1)
                            : N ? N = !1 : T = !0;
                        break;
                      case "/":
                        v("Unescaped '{a}'.", u, i + w - 1, "/"),
                            N ? N = !1 : T = !0;
                        break;
                      case "<":
                        N ? N = !1 : T = !0;
                        break;
                      default:
                        N ? N = !1 : T = !0
                      }
                    }
                    while (c)
                      ;
                    break;
                  case ".":
                    jt.regexp && v("Insecure '{a}'.", u, i + w, c);
                    break;
                  case "]":
                  case "?":
                  case "{":
                  case "}":
                  case "+":
                  case "*":
                    v("Unescaped '{a}'.", u, i + w, c)
                  }
                  if (l)
                    switch (a.charAt(w)) {
                    case "?":
                    case "+":
                    case "*":
                      w += 1, a.charAt(w) === "?" && (w += 1);
                      break;
                    case "{":
                      w += 1, c = a.charAt(w);
                      if (c < "0" || c > "9") {
                        v("Expected a number and instead saw '{a}'.", u, i + w,
                          c);
                        break
                      }
                      w += 1, E = +c;
                      for (;;) {
                        c = a.charAt(w);
                        if (c < "0" || c > "9")
                          break;
                        w += 1, E = +c + E * 10
                      }
                      y = E;
                      if (c === ",") {
                        w += 1, y = Infinity, c = a.charAt(w);
                        if (c >= "0" && c <= "9") {
                          w += 1, y = +c;
                          for (;;) {
                            c = a.charAt(w);
                            if (c < "0" || c > "9")
                              break;
                            w += 1, y = +c + y * 10
                          }
                        }
                      }
                      a.charAt(w) !== "}"
                          ? v("Expected '{a}' and instead saw '{b}'.", u, i + w,
                              "}", c)
                          : w += 1,
                          a.charAt(w) === "?" && (w += 1),
                          E > y && v("'{a}' should not be greater than '{b}'.",
                                     u, i + w, E, y)
                    }
                }
                return c = a.substr(0, w - 1), r += w, a = a.substr(w),
                       n("(regexp)", c)
              }
              return n("(punctuator)", x);
            case "#":
              return n("(punctuator)", x);
            default:
              return n("(punctuator)", x)
            }
          }
        }
      }
    }
  }();
  F("(number)", function() { return this }),
      F("(string)", function() { return this }),
      Kt["(identifier)"] = {
        type : "(identifier)",
        lbp : 0,
        identifier : !0,
        nud : function() {
          var e = this.value, t = Wt[e], n;
          typeof t == "function"
              ? t = undefined
              : typeof t == "boolean" &&
                    (n = wt, wt = St[0], b(e, "var"), t = wt, wt = n);
          if (wt === t)
            switch (wt[e]) {
            case "unused":
              wt[e] = "var";
              break;
            case "unction":
              wt[e] = "function", this["function"] = !0;
              break;
            case "function":
              this["function"] = !0;
              break;
            case "label":
              d("'{a}' is a statement label.", Gt, e)
            }
          else if (wt["(global)"])
            jt.undef && typeof Ft[e] != "boolean" &&
                (ft !== "typeof" && ft !== "delete" ||
                 Pt && (Pt.value === "." || Pt.value === "[")) &&
                p(wt, "'{a}' is not defined.", Gt, e),
                nt(Gt);
          else
            switch (wt[e]) {
            case "closure":
            case "function":
            case "var":
            case "unused":
              d("'{a}' used out of scope.", Gt, e);
              break;
            case "label":
              d("'{a}' is a statement label.", Gt, e);
              break;
            case "outer":
            case "global":
              break;
            default:
              if (t === !0)
                wt[e] = !0;
              else if (t === null)
                d("'{a}' is not allowed.", Gt, e), nt(Gt);
              else if (typeof t != "object")
                jt.undef &&
                    (ft !== "typeof" && ft !== "delete" ||
                     Pt && (Pt.value === "." || Pt.value === "[")) &&
                    p(wt, "'{a}' is not defined.", Gt, e),
                    wt[e] = !0, nt(Gt);
              else
                switch (t[e]) {
                case "function":
                case "unction":
                  this["function"] = !0, t[e] = "closure",
                  wt[e] = t["(global)"] ? "global" : "outer";
                  break;
                case "var":
                case "unused":
                  t[e] = "closure", wt[e] = t["(global)"] ? "global" : "outer";
                  break;
                case "closure":
                  wt[e] = t["(global)"] ? "global" : "outer";
                  break;
                case "label":
                  d("'{a}' is a statement label.", Gt, e)
                }
            }
          return this
        },
        led : function() {
          m("Expected an operator and instead saw '{a}'.", Pt, Pt.value)
        }
      },
      F("(regexp)", function() { return this }), D("(endline)"), D("(begin)"),
      D("(end)").reach = !0, D("</").reach = !0, D("<!"), D("<!--"), D("-->"),
      D("(error)").reach = !0, D("}").reach = !0, D(")"), D("]"),
      D('"').reach = !0, D("'").reach = !0, D(";"), D(":").reach = !0, D(","),
      D("#"), D("@"), I("else"), I("case").reach = !0, I("catch"),
      I("default").reach = !0, I("finally"),
      q("arguments",
        function(e) {
          Jt["use strict"] && wt["(global)"] && d("Strict violation.", e)
        }),
      q("eval"), q("false"), q("Infinity"), q("null"),
      q("this",
        function(e) {
          Jt["use strict"] && !jt.validthis &&
              (wt["(statement)"] && wt["(name)"].charAt(0) > "Z" ||
               wt["(global)"]) &&
              d("Possible strict violation.", e)
        }),
      q("true"), q("undefined"), W("=", "assign", 20), W("+=", "assignadd", 20),
      W("-=", "assignsub", 20), W("*=", "assignmult", 20),
      W("/=", "assigndiv", 20).nud =
          function() {
        m("A regular expression literal can be confused with '/='.")
      },
      W("%=", "assignmod", 20), V("&=", "assignbitand", 20),
      V("|=", "assignbitor", 20), V("^=", "assignbitxor", 20),
      V("<<=", "assignshiftleft", 20), V(">>=", "assignshiftright", 20),
      V(">>>=", "assignshiftrightunsigned", 20),
      R("?",
        function(e, t) {
          return t.left = e, t.right = x(10), S(":"), t["else"] = x(10), t
        },
        30),
      R("||", "or", 40), R("&&", "and", 50), X("|", "bitor", 70),
      X("^", "bitxor", 80), X("&", "bitand", 90),
      U("==",
        function(e, t) {
          var n = jt.eqnull && (e.value === "null" || t.value === "null");
          return !n && jt.eqeqeq
                     ? d("Expected '{a}' and instead saw '{b}'.", this,
                         "===", "==")
                     : z(e) ? d("Use '{a}' to compare with '{b}'.", this,
                                "===", e.value)
                            : z(t) && d("Use '{a}' to compare with '{b}'.",
                                        this, "===", t.value),
                 this
        }),
      U("==="),
      U("!=",
        function(e, t) {
          var n = jt.eqnull && (e.value === "null" || t.value === "null");
          return !n && jt.eqeqeq
                     ? d("Expected '{a}' and instead saw '{b}'.", this,
                         "!==", "!=")
                     : z(e) ? d("Use '{a}' to compare with '{b}'.", this,
                                "!==", e.value)
                            : z(t) && d("Use '{a}' to compare with '{b}'.",
                                        this, "!==", t.value),
                 this
        }),
      U("!=="), U("<"), U(">"), U("<="), U(">="), X("<<", "shiftleft", 120),
      X(">>", "shiftright", 120), X(">>>", "shiftrightunsigned", 120),
      R("in", "in", 120), R("instanceof", "instanceof", 120),
      R("+",
        function(e, t) {
          var n = x(130);
          return e && n && e.id === "(string)" && n.id === "(string)"
                     ? (e.value += n.value, e.character = n.character,
                        !jt.scripturl && pn.test(e.value) &&
                            d("JavaScript URL.", e),
                        e)
                     : (t.left = e, t.right = n, t)
        },
        130),
      j("+", "num"),
      j("+++",
        function() {
          return d("Confusing pluses."), this.right = x(150),
                                         this.arity = "unary", this
        }),
      R("+++",
        function(e) {
          return d("Confusing pluses."), this.left = e, this.right = x(130),
                                         this
        },
        130),
      R("-", "sub", 130), j("-", "neg"),
      j("---",
        function() {
          return d("Confusing minuses."), this.right = x(150),
                                          this.arity = "unary", this
        }),
      R("---",
        function(e) {
          return d("Confusing minuses."), this.left = e, this.right = x(130),
                                          this
        },
        130),
      R("*", "mult", 140), R("/", "div", 140), R("%", "mod", 140),
      $("++", "postinc"), j("++", "preinc"), Kt["++"].exps = !0,
      $("--", "postdec"), j("--", "predec"), Kt["--"].exps = !0,
      j("delete",
        function() {
          var e = x(0);
          return (!e || e.id !== "." && e.id !== "[") &&
                     d("Variables should not be deleted."),
                 this.first = e, this
        }).exps = !0,
      j("~",
        function() {
          return jt.bitwise && d("Unexpected '{a}'.", this, "~"), x(150), this
        }),
      j("!",
        function() {
          return this.right = x(150), this.arity = "unary",
                 lt[this.right.id] === !0 &&
                     d("Confusing use of '{a}'.", this, "!"),
                 this
        }),
      j("typeof", "typeof"),
      j("new",
        function() {
          var e = x(155), n;
          if (e && e.id !== "function")
            if (e.identifier) {
              e["new"] = !0;
              switch (e.value) {
              case "Number":
              case "String":
              case "Boolean":
              case "Math":
              case "JSON":
                d("Do not use {a} as a constructor.", qt, e.value);
                break;
              case "Function":
                jt.evil || d("The Function constructor is eval.");
                break;
              case "Date":
              case "RegExp":
                break;
              default:
                e.id !== "function" &&
                    (n = e.value.substr(0, 1),
                     jt.newcap && (n < "A" || n > "Z") && !t(xt, e.value) &&
                         d("A constructor name should start with an uppercase letter.",
                           Gt))
              }
            } else
              e.id !== "." && e.id !== "[" && e.id !== "(" &&
                  d("Bad constructor.", Gt);
          else
            jt.supernew || d("Weird construction. Delete 'new'.", this);
          return T(Gt, Pt),
                 Pt.id !== "(" && !jt.supernew &&
                     d("Missing '()' invoking a constructor.", Gt, Gt.value),
                 this.first = e, this
        }),
      Kt["new"].exps = !0, j("void").exps = !0,
      R(".",
        function(e, t) {
          T(qt, Gt), N();
          var n = K();
          return typeof n == "string" && tt(n),
                 t.left = e, t.right = n,
                 !e || e.value !== "arguments" ||
                         n !== "callee" && n !== "caller"
                     ? !jt.evil && e && e.value === "document" &&
                           (n === "write" || n === "writeln") &&
                           d("document.write can be a form of eval.", e)
                     : jt.noarg ? d("Avoid arguments.{a}.", e, n)
                                : Jt["use strict"] && m("Strict violation."),
                 !jt.evil && (n === "eval" || n === "execScript") &&
                     d("eval is evil."),
                 t
        },
        160, !0),
      R("(", function(e, t) {
        qt.id !== "}" && qt.id !== ")" && N(qt, Gt), C(),
            jt.immed && !e.immed && e.id === "function" &&
                d("Wrap an immediate function invocation in parentheses to assist the reader in understanding that the expression is the result of a function, and not the function itself.");
        var n = 0, r = [];
        e && e.type === "(identifier)" &&
            e.value.match(/^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/) &&
            "Number String Boolean Date Object".indexOf(e.value) === -1 &&
            (e.value === "Math"
                 ? d("Math is not a function.", e)
                 : jt.newcap &&
                       d("Missing 'new' prefix when invoking a constructor.",
                         e));
        if (Pt.id !== ")")
          for (;;) {
            r[r.length] = x(10), n += 1;
            if (Pt.id !== ",")
              break;
            M()
          }
        return S(")"), C(qt, Gt),
               typeof e == "object" &&
                   (e.value === "parseInt" && n === 1 &&
                        d("Missing radix parameter.", Gt),
                    jt.evil ||
                        (e.value === "eval" || e.value === "Function" ||
                                 e.value === "execScript"
                             ? (d("eval is evil.", e),
                                r[0] && [ 0 ].id === "(string)" &&
                                    y(e, r[0].value))
                             : !r[0] || r[0].id !== "(string)" ||
                                       e.value !== "setTimeout" &&
                                           e.value !== "setInterval"
                                   ? r[0] && r[0].id === "(string)" &&
                                         e.value === "." &&
                                         e.left.value === "window" &&
                                         (e.right === "setTimeout" ||
                                          e.right === "setInterval") &&
                                         (d("Implied eval is evil. Pass a function instead of a string.",
                                            e),
                                          y(e, r[0].value))
                                   : (d("Implied eval is evil. Pass a function instead of a string.",
                                        e),
                                      y(e, r[0].value))),
                    !e.identifier && e.id !== "." && e.id !== "[" &&
                        e.id !== "(" && e.id !== "&&" && e.id !== "||" &&
                        e.id !== "?" && d("Bad invocation.", e)),
               t.left = e, t
      }, 155, !0).exps = !0, j("(", function() {
        C(), Pt.id === "function" && (Pt.immed = !0);
        var e = x(0);
        return S(")", this), C(qt, Gt),
               jt.immed && e.id === "function" && Pt.id !== "(" &&
                   (Pt.id !== "." ||
                    E().value !== "call" && E().value !== "apply") &&
                   d("Do not wrap function literals in parens unless they are to be immediately invoked.",
                     this),
               e
      }), R("[", function(e, t) {
        N(qt, Gt), C();
        var n = x(0), r;
        return n && n.type === "(string)" &&
                   (!jt.evil &&
                        (n.value === "eval" || n.value === "execScript") &&
                        d("eval is evil.", t),
                    tt(n.value),
                    !jt.sub && hn.test(n.value) &&
                        (r = Kt[n.value],
                         (!r || !r.reserved) &&
                             d("['{a}'] is better written in dot notation.", qt,
                               n.value))),
               S("]", t), C(qt, Gt), t.left = e, t.right = n, t
      }, 160, !0), j("[", function() {
        var e = Gt.line !== Pt.line;
        this.first = [],
        e && (Ct += jt.indent, Pt.from === Ct + jt.indent && (Ct += jt.indent));
        while (Pt.id !== "(end)") {
          while (Pt.id === ",")
            jt.es5 || d("Extra comma."), S(",");
          if (Pt.id === "]")
            break;
          e && Gt.line !== Pt.line && A(), this.first.push(x(10));
          if (Pt.id !== ",")
            break;
          M();
          if (Pt.id === "]" && !jt.es5) {
            d("Extra comma.", Gt);
            break
          }
        }
        return e && (Ct -= jt.indent, A()), S("]", this), this
      }, 160), function(e) {
        e.nud = function() {
          function e(e, n) {
            f[e] && t(f, e) ? d("Duplicate member '{a}'.", Pt, o)
                            : f[e] = {},
                              f[e].basic = !0, f[e].basicToken = n
          }
          function n(e, n) {
            f[e] && t(f, e) ? (f[e].basic || f[e].setter) &&
                                  d("Duplicate member '{a}'.", Pt, o)
                            : f[e] = {},
                              f[e].setter = !0, f[e].setterToken = n
          }
          function r(e) {
            f[e] && t(f, e) ? (f[e].basic || f[e].getter) &&
                                  d("Duplicate member '{a}'.", Pt, o)
                            : f[e] = {},
                              f[e].getter = !0, f[e].getterToken = Gt
          }
          var i, s, o, u, a, f = {};
          i = Gt.line !== Pt.line,
          i && (Ct += jt.indent,
                Pt.from === Ct + jt.indent && (Ct += jt.indent));
          for (;;) {
            if (Pt.id === "}")
              break;
            i && A();
            if (Pt.value === "get" && E().id !== ":")
              S("get"), jt.es5 || m("get/set are ES5 features."),
                  o = rt(), o || m("Missing property name."), r(o), a = Pt,
                  T(Gt, Pt), s = st(), u = s["(params)"],
                  u && d("Unexpected parameter '{a}' in get {b} function.", a,
                         u[0], o),
                  T(Gt, Pt);
            else if (Pt.value === "set" && E().id !== ":")
              S("set"), jt.es5 || m("get/set are ES5 features."),
                  o = rt(), o || m("Missing property name."), n(o, Pt), a = Pt,
                  T(Gt, Pt), s = st(), u = s["(params)"],
                  (!u || u.length !== 1) &&
                      d("Expected a single parameter in set {a} function.", a,
                        o);
            else {
              o = rt(), e(o, Pt);
              if (typeof o != "string")
                break;
              S(":"), k(Gt, Pt), x(10)
            }
            tt(o);
            if (Pt.id !== ",")
              break;
            M(), Pt.id === ","
                     ? d("Extra comma.", Gt)
                     : Pt.id === "}" && !jt.es5 && d("Extra comma.", Gt)
          }
          i && (Ct -= jt.indent, A()), S("}", this);
          if (jt.es5)
            for (var l in f)
              t(f, l) && f[l].setter && !f[l].getter &&
                  d("Setter is defined without getter.", f[l].setterToken);
          return this
        }, e.fud = function() {
          m("Expected to see a statement and instead saw a block.", Gt)
        }
      }(D("{")), en = function() {
        var e = P("const", function(e) {
          var t, n, r;
          this.first = [];
          for (;;) {
            k(Gt, Pt), t = K(),
                       wt[t] === "const" &&
                           d("const '" + t + "' has already been declared"),
                       wt["(global)"] && Ft[t] === !1 &&
                           d("Redefinition of '{a}'.", Gt, t),
                       b(t, "const");
            if (e)
              break;
            n = Gt, this.first.push(Gt),
            Pt.id !== "=" &&
                d("const '{a}' is initialized to 'undefined'.", Gt, t),
            Pt.id === "=" &&
                (k(Gt, Pt), S("="), k(Gt, Pt),
                 Pt.id === "undefined" &&
                     d("It is not necessary to initialize '{a}' to 'undefined'.",
                       Gt, t),
                 E(0).id === "=" && Pt.identifier &&
                     m("Constant {a} was not declared correctly.", Pt,
                       Pt.value),
                 r = x(0), n.first = r);
            if (Pt.id !== ",")
              break;
            M()
          }
          return this
        });
        e.exps = !0
      };
  var mn = P("var", function(e) {
    var t, n, r;
    wt["(onevar)"] && jt.onevar ? d("Too many var statements.")
                                : wt["(global)"] || (wt["(onevar)"] = !0),
        this.first = [];
    for (;;) {
      k(Gt, Pt),
          t = K(),
          jt.esnext && wt[t] === "const" &&
              d("const '" + t + "' has already been declared"),
          wt["(global)"] && Ft[t] === !1 && d("Redefinition of '{a}'.", Gt, t),
          b(t, "unused", Gt);
      if (e)
        break;
      n = Gt, this.first.push(Gt),
      Pt.id === "=" &&
          (k(Gt, Pt), S("="), k(Gt, Pt),
           Pt.id === "undefined" &&
               d("It is not necessary to initialize '{a}' to 'undefined'.", Gt,
                 t),
           E(0).id === "=" && Pt.identifier &&
               m("Variable {a} was not declared correctly.", Pt, Pt.value),
           r = x(0), n.first = r);
      if (Pt.id !== ",")
        break;
      M()
    }
    return this
  });
  mn.exps = !0,
  H("function",
    function() {
      Nt &&
          d("Function declarations should not be placed in blocks. Use a function expression or move the statement to the top of the outer function.",
            Gt);
      var e = K();
      return jt.esnext && wt[e] === "const" &&
                 d("const '" + e + "' has already been declared"),
             T(Gt, Pt), b(e, "unction", Gt), st(e, {statement : !0}),
             Pt.id === "(" && Pt.line === Gt.line &&
                 m("Function declarations are not invocable. Wrap the whole function invocation in parens."),
             this
    }),
  j("function",
    function() {
      var e = J();
      return e ? T(Gt, Pt) : k(Gt, Pt), st(e),
             !jt.loopfunc && wt["(loopage)"] &&
                 d("Don't make functions within a loop."),
             this
    }),
  H("if",
    function() {
      var e = Pt;
      return ut(), S("("), k(this, e), C(), x(20),
             Pt.id === "=" &&
                 (jt.boss || d("Assignment in conditional expression"), S("="),
                  x(20)),
             S(")", e), C(qt, Gt), et(!0, !0),
             Pt.id === "else" &&
                 (k(Gt, Pt), S("else"),
                  Pt.id === "if" || Pt.id === "switch" ? G(!0) : et(!0, !0)),
             this
    }),
  H("try",
    function() {
      function e() {
        var e = Wt, t;
        S("catch"), k(Gt, Pt), S("("),
            Wt = Object.create(e), t = Pt.value,
            Pt.type !== "(identifier)" &&
                (t = null,
                 d("Expected an identifier and instead saw '{a}'.", Pt, t)),
            S(), S(")"), wt = {
              "(name)" : "(catch)",
              "(line)" : Pt.line,
              "(character)" : Pt.character,
              "(context)" : wt,
              "(breakage)" : wt["(breakage)"],
              "(loopage)" : wt["(loopage)"],
              "(scope)" : Wt,
              "(statement)" : !1,
              "(metrics)" : ot(Pt),
              "(catch)" : !0,
              "(tokens)" : {}
            },
            t && b(t, "exception"), Gt.funct = wt, St.push(wt), et(!1), Wt = e,
            wt["(last)"] = Gt.line, wt["(lastcharacter)"] = Gt.character,
            wt = wt["(context)"]
      }
      var t;
      et(!1), Pt.id === "catch" && (ut(), e(), t = !0);
      if (Pt.id === "finally") {
        S("finally"), et(!1);
        return
      }
      return t || m("Expected '{a}' and instead saw '{b}'.", Pt, "catch",
                    Pt.value),
             this
    }),
  H("while",
    function() {
      var e = Pt;
      return wt["(breakage)"] += 1, wt["(loopage)"] += 1, ut(), S("("),
             k(this, e), C(), x(20),
             Pt.id === "=" &&
                 (jt.boss || d("Assignment in conditional expression"), S("="),
                  x(20)),
             S(")", e), C(qt, Gt), et(!0, !0), wt["(breakage)"] -= 1,
             wt["(loopage)"] -= 1, this
    }).labelled = !0,
  H("with",
    function() {
      var e = Pt;
      return Jt["use strict"] ? m("'with' is not allowed in strict mode.", Gt)
                              : jt.withstmt || d("Don't use 'with'.", Gt),
             S("("), k(this, e), C(), x(0), S(")", e), C(qt, Gt), et(!0, !0),
             this
    }),
  H("switch",
    function() {
      var e = Pt, t = !1;
      wt["(breakage)"] += 1, S("("), k(this, e), C(),
          this.condition = x(20), S(")", e), C(qt, Gt), k(Gt, Pt), e = Pt,
          S("{"), k(Gt, Pt), Ct += jt.indent, this.cases = [];
      for (;;)
        switch (Pt.id) {
        case "case":
          switch (wt["(verb)"]) {
          case "break":
          case "case":
          case "continue":
          case "return":
          case "switch":
          case "throw":
            break;
          default:
            dn.test(At[Pt.line - 2]) ||
                d("Expected a 'break' statement before 'case'.", Gt)
          }
          A(-jt.indent), S("case"), this.cases.push(x(20)), ut(),
              t = !0, S(":"), wt["(verb)"] = "case";
          break;
        case "default":
          switch (wt["(verb)"]) {
          case "break":
          case "continue":
          case "return":
          case "throw":
            break;
          default:
            dn.test(At[Pt.line - 2]) ||
                d("Expected a 'break' statement before 'default'.", Gt)
          }
          A(-jt.indent), S("default"), t = !0, S(":");
          break;
        case "}":
          Ct -= jt.indent, A(), S("}", e);
          if (this.cases.length === 1 || this.condition.id === "true" ||
              this.condition.id === "false")
            jt.onecase || d("This 'switch' should be an 'if'.", this);
          wt["(breakage)"] -= 1, wt["(verb)"] = undefined;
          return;
        case "(end)":
          m("Missing '{a}'.", Pt, "}");
          return;
        default:
          if (t)
            switch (Gt.id) {
            case ",":
              m("Each value should have its own case label.");
              return;
            case ":":
              t = !1, Y();
              break;
            default:
              m("Missing ':' on a case clause.", Gt);
              return
            }
          else {
            if (Gt.id !== ":") {
              m("Expected '{a}' and instead saw '{b}'.", Pt, "case", Pt.value);
              return
            }
            S(":"), m("Unexpected '{a}'.", Gt, ":"), Y()
          }
        }
    }).labelled = !0,
  P("debugger",
    function() {
      return jt.debug || d("All 'debugger' statements should be removed."), this
    }).exps = !0,
  function() {
    var e = P("do", function() {
      wt["(breakage)"] += 1, wt["(loopage)"] += 1, ut(), this.first = et(!0),
                                                         S("while");
      var e = Pt;
      return k(Gt, e), S("("), C(), x(20),
             Pt.id === "=" &&
                 (jt.boss || d("Assignment in conditional expression"), S("="),
                  x(20)),
             S(")", e), C(qt, Gt), wt["(breakage)"] -= 1, wt["(loopage)"] -= 1,
             this
    });
    e.labelled = !0, e.exps = !0
  }(),
  H("for",
    function() {
      var e, t = Pt;
      wt["(breakage)"] += 1, wt["(loopage)"] += 1, ut(), S("("), k(this, t),
          C();
      if (E(Pt.id === "var" ? 1 : 0).id === "in") {
        if (Pt.id === "var")
          S("var"), mn.fud.call(mn, !0);
        else {
          switch (wt[Pt.value]) {
          case "unused":
            wt[Pt.value] = "var";
            break;
          case "var":
            break;
          default:
            d("Bad for in variable '{a}'.", Pt, Pt.value)
          }
          S()
        }
        return S("in"), x(20), S(")", t),
               e = et(!0, !0),
               jt.forin && e &&
                   (e.length > 1 || typeof e[0] != "object" ||
                    e[0].value !== "if") &&
                   d("The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype.",
                     this),
               wt["(breakage)"] -= 1, wt["(loopage)"] -= 1, this
      }
      if (Pt.id !== ";")
        if (Pt.id === "var")
          S("var"), mn.fud.call(mn);
        else
          for (;;) {
            x(0, "for");
            if (Pt.id !== ",")
              break;
            M()
          }
      O(Gt), S(";"),
          Pt.id !== ";" &&
              (x(20), Pt.id === "=" &&
                          (jt.boss || d("Assignment in conditional expression"),
                           S("="), x(20))),
          O(Gt), S(";"),
          Pt.id === ";" &&
              m("Expected '{a}' and instead saw '{b}'.", Pt, ")", ";");
      if (Pt.id !== ")")
        for (;;) {
          x(0, "for");
          if (Pt.id !== ",")
            break;
          M()
        }
      return S(")", t), C(qt, Gt), et(!0, !0), wt["(breakage)"] -= 1,
             wt["(loopage)"] -= 1, this
    }).labelled = !0,
  P("break",
    function() {
      var e = Pt.value;
      return wt["(breakage)"] === 0 && d("Unexpected '{a}'.", Pt, this.value),
             jt.asi || O(this),
             Pt.id !== ";" && Gt.line === Pt.line &&
                 (wt[e] !== "label"
                      ? d("'{a}' is not a statement label.", Pt, e)
                      : Wt[e] !== wt && d("'{a}' is out of scope.", Pt, e),
                  this.first = Pt, S()),
             Q("break"), this
    }).exps = !0,
  P("continue",
    function() {
      var e = Pt.value;
      return wt["(breakage)"] === 0 && d("Unexpected '{a}'.", Pt, this.value),
             jt.asi || O(this),
             Pt.id !== ";"
                 ? Gt.line === Pt.line &&
                       (wt[e] !== "label"
                            ? d("'{a}' is not a statement label.", Pt, e)
                            : Wt[e] !== wt &&
                                  d("'{a}' is out of scope.", Pt, e),
                        this.first = Pt, S())
                 : wt["(loopage)"] || d("Unexpected '{a}'.", Pt, this.value),
             Q("continue"), this
    }).exps = !0,
  P("return",
    function() {
      return this.line === Pt.line
                 ? (Pt.id === "(regexp)" &&
                        d("Wrap the /regexp/ literal in parens to disambiguate the slash operator."),
                    Pt.id !== ";" && !Pt.reach &&
                        (k(Gt, Pt),
                         E().value === "=" && !jt.boss &&
                             v("Did you mean to return a conditional instead of an assignment?",
                               Gt.line, Gt.character + 1),
                         this.first = x(0)))
                 : jt.asi || O(this),
             Q("return"), this
    }).exps = !0,
  P("throw",
    function() {
      return O(this), k(Gt, Pt), this.first = x(20), Q("throw"), this
    }).exps = !0,
  I("class"), I("const"), I("enum"), I("export"), I("extends"), I("import"),
  I("super"), I("let"), I("yield"), I("implements"), I("interface"),
  I("package"), I("private"), I("protected"), I("public"), I("static");
  var gn = function(e, s, o) {
    var u, a, l, h, p, m = {};
    s &&s.scope ? r.scope = s.scope
                : (r.errors = [], r.undefs = [], r.internals = [],
                   r.blacklist = {}, r.scope = "(main)"),
                  Ft = Object.create(Vt), gt = Object.create(null),
                  f(Ft, o || {});
    if (s) {
      u = s.predef,
      u && (!Array.isArray(u) && typeof u == "object" && (u = Object.keys(u)),
            u.forEach(function(e) {
              var t;
              e[0] === "-" ? (t = e.slice(1), r.blacklist[t] = t) : Ft[e] = !0
            })),
      p = Object.keys(s);
      for (h = 0; h < p.length; h++)
        m[p[h]] = s[p[h]],
        p[h] === "newcap" && s[p[h]] === !1 && (m["(explicitNewcap)"] = !0),
        p[h] === "indent" && (m.white = !0)
    }
    jt = m, jt.indent = jt.indent || 4, jt.maxerr = jt.maxerr || 50, Qt = "";
    for (a = 0; a < jt.indent; a += 1)
      Qt += " ";
    Ct = 1, xt = Object.create(Ft), Wt = xt, wt = {
      "(global)" : !0,
      "(name)" : "(global)",
      "(scope)" : Wt,
      "(breakage)" : 0,
      "(loopage)" : 0,
      "(tokens)" : {},
      "(metrics)" : ot(Pt)
    },
    St = [ wt ], Zt = [], Xt = null, Mt = {}, _t = null, Tt = {}, Nt = !1,
    Ot = [], kt = !1, tn = 0, At = [], Yt = [];
    if (!i(e) && !Array.isArray(e))
      return g("Input is neither a string nor an array of strings.", 0), !1;
    if (i(e) && /^\s*$/g.test(e))
      return g("Input is an empty string.", 0), !1;
    if (e.length === 0)
      return g("Input is an empty array.", 0), !1;
    vn.init(e), It = !0, Jt = {}, qt = Gt = Pt = Kt["(begin)"];
    for (var y in s)
      t(s, y) && n(y, Gt);
    c(), f(Ft, o || {}), M.first = !0, Ut = undefined;
    try {
      S();
      switch (Pt.id) {
      case "{":
      case "[":
        jt.laxbreak = !0, kt = !0, at();
        break;
      default:
        Z(),
            Jt["use strict"] && !jt.globalstrict &&
                d('Use the function form of "use strict".', qt),
            Y()
      }
      S(Pt && Pt.value !== "." ? "(end)" : undefined);
      var b = function(e, t) {
        do {
          if (typeof t[e] == "string")
            return t[e] === "unused" ? t[e] = "var"
                                     : t[e] === "unction" && (t[e] = "closure"),
                                       !0;
          t = t["(context)"]
        } while (t);
        return !1
      }, w = function(e, t) {
        if (!Tt[e])
          return;
        var n = [];
        for (var r = 0; r < Tt[e].length; r += 1)
          Tt[e][r] !== t && n.push(Tt[e][r]);
        n.length === 0 ? delete Tt[e] : Tt[e] = n
      }, E = function(e, t) {
        var n = t.line, r = t.character;
        jt.unused && v("'{a}' is defined but never used.", n, r, e),
            Yt.push({name : e, line : n, character : r})
      }, x = function(e, t) {
        var n = e[t], r = e["(tokens)"][t];
        if (t.charAt(0) === "(")
          return;
        if (n !== "unused" && n !== "unction")
          return;
        if (e["(params)"] && e["(params)"].indexOf(t) !== -1)
          return;
        E(t, r)
      };
      for (a = 0; a < r.undefs.length; a += 1)
        l = r.undefs[a].slice(0),
        b(l[2].value, l[0]) ? w(l[2].value, l[2].line) : d.apply(d, l.slice(1));
      St.forEach(function(e) {
        for (var n in e)
          t(e, n) && x(e, n);
        if (!e["(params)"])
          return;
        var r = e["(params)"].slice(), i = r.pop(), s;
        while (i) {
          s = e[i];
          if (i === "undefined")
            return;
          if (s !== "unused" && s !== "unction")
            return;
          E(i, e["(tokens)"][i]), i = r.pop()
        }
      });
      for (var T in gt)
        t(gt, T) && !t(xt, T) && E(T, gt[T])
    } catch (N) {
      if (N) {
        var C = Pt || {};
        r.errors.push({
          raw : N.raw,
          reason : N.message,
          line : N.line || C.line,
          character : N.character || C.from
        },
                      null)
      }
    }
    if (r.scope === "(main)") {
      s = s || {};
      for (a = 0; a < r.internals.length; a += 1)
        l = r.internals[a], s.scope = l.elem, gn(l.value, s, o)
    }
    return r.errors.length === 0
  };
  return gn.data = function() {
    var e = {functions : [], options : jt}, n = [], r = [], i, s, o, u, a, f;
    gn.errors.length && (e.errors = gn.errors), kt && (e.json = !0);
    for (a in Tt)
      t(Tt, a) && n.push({name : a, line : Tt[a]});
    n.length > 0 && (e.implieds = n), Zt.length > 0 && (e.urls = Zt),
        f = Object.keys(Wt), f.length > 0 && (e.globals = f);
    for (o = 1; o < St.length; o += 1) {
      s = St[o], i = {};
      for (u = 0; u < Et.length; u += 1)
        i[Et[u]] = [];
      for (u = 0; u < Et.length; u += 1)
        i[Et[u]].length === 0 && delete i[Et[u]];
      i.name = s["(name)"], i.param = s["(params)"], i.line = s["(line)"],
      i.character = s["(character)"], i.last = s["(last)"],
      i.lastcharacter = s["(lastcharacter)"], e.functions.push(i)
    }
    Yt.length > 0 && (e.unused = Yt), r = [];
    for (a in Mt)
      if (typeof Mt[a] == "number") {
        e.member = Mt;
        break
      }
    return e
  }, gn.jshint = gn, gn
}();
typeof t == "object" && t && (t.JSHINT = r)
           })