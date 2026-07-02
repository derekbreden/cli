import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// node_modules/make-vfs/dist/index.js
var require_dist = __commonJS((exports, module) => {
  var __create2 = Object.create;
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __getProtoOf2 = Object.getPrototypeOf;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __commonJS2 = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
  var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var require_old = __commonJS2({
    "node_modules/fs.realpath/old.js"(exports2) {
      var pathModule = __require("path");
      var isWindows = process.platform === "win32";
      var fs2 = __require("fs");
      var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
      function rethrow() {
        var callback;
        if (DEBUG) {
          var backtrace = new Error;
          callback = debugCallback;
        } else
          callback = missingCallback;
        return callback;
        function debugCallback(err) {
          if (err) {
            backtrace.message = err.message;
            err = backtrace;
            missingCallback(err);
          }
        }
        function missingCallback(err) {
          if (err) {
            if (process.throwDeprecation)
              throw err;
            else if (!process.noDeprecation) {
              var msg = "fs: missing callback " + (err.stack || err.message);
              if (process.traceDeprecation)
                console.trace(msg);
              else
                console.error(msg);
            }
          }
        }
      }
      function maybeCallback(cb) {
        return typeof cb === "function" ? cb : rethrow();
      }
      var normalize = pathModule.normalize;
      if (isWindows) {
        nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
      } else {
        nextPartRe = /(.*?)(?:[\/]+|$)/g;
      }
      var nextPartRe;
      if (isWindows) {
        splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
      } else {
        splitRootRe = /^[\/]*/;
      }
      var splitRootRe;
      exports2.realpathSync = function realpathSync(p, cache) {
        p = pathModule.resolve(p);
        if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
          return cache[p];
        }
        var original = p, seenLinks = {}, knownHard = {};
        var pos;
        var current;
        var base;
        var previous;
        start();
        function start() {
          var m = splitRootRe.exec(p);
          pos = m[0].length;
          current = m[0];
          base = m[0];
          previous = "";
          if (isWindows && !knownHard[base]) {
            fs2.lstatSync(base);
            knownHard[base] = true;
          }
        }
        while (pos < p.length) {
          nextPartRe.lastIndex = pos;
          var result = nextPartRe.exec(p);
          previous = current;
          current += result[0];
          base = previous + result[1];
          pos = nextPartRe.lastIndex;
          if (knownHard[base] || cache && cache[base] === base) {
            continue;
          }
          var resolvedLink;
          if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
            resolvedLink = cache[base];
          } else {
            var stat = fs2.lstatSync(base);
            if (!stat.isSymbolicLink()) {
              knownHard[base] = true;
              if (cache)
                cache[base] = base;
              continue;
            }
            var linkTarget = null;
            if (!isWindows) {
              var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
              if (seenLinks.hasOwnProperty(id)) {
                linkTarget = seenLinks[id];
              }
            }
            if (linkTarget === null) {
              fs2.statSync(base);
              linkTarget = fs2.readlinkSync(base);
            }
            resolvedLink = pathModule.resolve(previous, linkTarget);
            if (cache)
              cache[base] = resolvedLink;
            if (!isWindows)
              seenLinks[id] = linkTarget;
          }
          p = pathModule.resolve(resolvedLink, p.slice(pos));
          start();
        }
        if (cache)
          cache[original] = p;
        return p;
      };
      exports2.realpath = function realpath(p, cache, cb) {
        if (typeof cb !== "function") {
          cb = maybeCallback(cache);
          cache = null;
        }
        p = pathModule.resolve(p);
        if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
          return process.nextTick(cb.bind(null, null, cache[p]));
        }
        var original = p, seenLinks = {}, knownHard = {};
        var pos;
        var current;
        var base;
        var previous;
        start();
        function start() {
          var m = splitRootRe.exec(p);
          pos = m[0].length;
          current = m[0];
          base = m[0];
          previous = "";
          if (isWindows && !knownHard[base]) {
            fs2.lstat(base, function(err) {
              if (err)
                return cb(err);
              knownHard[base] = true;
              LOOP();
            });
          } else {
            process.nextTick(LOOP);
          }
        }
        function LOOP() {
          if (pos >= p.length) {
            if (cache)
              cache[original] = p;
            return cb(null, p);
          }
          nextPartRe.lastIndex = pos;
          var result = nextPartRe.exec(p);
          previous = current;
          current += result[0];
          base = previous + result[1];
          pos = nextPartRe.lastIndex;
          if (knownHard[base] || cache && cache[base] === base) {
            return process.nextTick(LOOP);
          }
          if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
            return gotResolvedLink(cache[base]);
          }
          return fs2.lstat(base, gotStat);
        }
        function gotStat(err, stat) {
          if (err)
            return cb(err);
          if (!stat.isSymbolicLink()) {
            knownHard[base] = true;
            if (cache)
              cache[base] = base;
            return process.nextTick(LOOP);
          }
          if (!isWindows) {
            var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
            if (seenLinks.hasOwnProperty(id)) {
              return gotTarget(null, seenLinks[id], base);
            }
          }
          fs2.stat(base, function(err2) {
            if (err2)
              return cb(err2);
            fs2.readlink(base, function(err3, target) {
              if (!isWindows)
                seenLinks[id] = target;
              gotTarget(err3, target);
            });
          });
        }
        function gotTarget(err, target, base2) {
          if (err)
            return cb(err);
          var resolvedLink = pathModule.resolve(previous, target);
          if (cache)
            cache[base2] = resolvedLink;
          gotResolvedLink(resolvedLink);
        }
        function gotResolvedLink(resolvedLink) {
          p = pathModule.resolve(resolvedLink, p.slice(pos));
          start();
        }
      };
    }
  });
  var require_fs = __commonJS2({
    "node_modules/fs.realpath/index.js"(exports2, module2) {
      module2.exports = realpath;
      realpath.realpath = realpath;
      realpath.sync = realpathSync;
      realpath.realpathSync = realpathSync;
      realpath.monkeypatch = monkeypatch;
      realpath.unmonkeypatch = unmonkeypatch;
      var fs2 = __require("fs");
      var origRealpath = fs2.realpath;
      var origRealpathSync = fs2.realpathSync;
      var version = process.version;
      var ok = /^v[0-5]\./.test(version);
      var old = require_old();
      function newError(er) {
        return er && er.syscall === "realpath" && (er.code === "ELOOP" || er.code === "ENOMEM" || er.code === "ENAMETOOLONG");
      }
      function realpath(p, cache, cb) {
        if (ok) {
          return origRealpath(p, cache, cb);
        }
        if (typeof cache === "function") {
          cb = cache;
          cache = null;
        }
        origRealpath(p, cache, function(er, result) {
          if (newError(er)) {
            old.realpath(p, cache, cb);
          } else {
            cb(er, result);
          }
        });
      }
      function realpathSync(p, cache) {
        if (ok) {
          return origRealpathSync(p, cache);
        }
        try {
          return origRealpathSync(p, cache);
        } catch (er) {
          if (newError(er)) {
            return old.realpathSync(p, cache);
          } else {
            throw er;
          }
        }
      }
      function monkeypatch() {
        fs2.realpath = realpath;
        fs2.realpathSync = realpathSync;
      }
      function unmonkeypatch() {
        fs2.realpath = origRealpath;
        fs2.realpathSync = origRealpathSync;
      }
    }
  });
  var require_path = __commonJS2({
    "node_modules/minimatch/lib/path.js"(exports2, module2) {
      var isWindows = typeof process === "object" && process && process.platform === "win32";
      module2.exports = isWindows ? { sep: "\\" } : { sep: "/" };
    }
  });
  var require_balanced_match = __commonJS2({
    "node_modules/balanced-match/index.js"(exports2, module2) {
      module2.exports = balanced;
      function balanced(a, b, str) {
        if (a instanceof RegExp)
          a = maybeMatch(a, str);
        if (b instanceof RegExp)
          b = maybeMatch(b, str);
        var r = range(a, b, str);
        return r && {
          start: r[0],
          end: r[1],
          pre: str.slice(0, r[0]),
          body: str.slice(r[0] + a.length, r[1]),
          post: str.slice(r[1] + b.length)
        };
      }
      function maybeMatch(reg, str) {
        var m = str.match(reg);
        return m ? m[0] : null;
      }
      balanced.range = range;
      function range(a, b, str) {
        var begs, beg, left, right, result;
        var ai = str.indexOf(a);
        var bi = str.indexOf(b, ai + 1);
        var i = ai;
        if (ai >= 0 && bi > 0) {
          if (a === b) {
            return [ai, bi];
          }
          begs = [];
          left = str.length;
          while (i >= 0 && !result) {
            if (i == ai) {
              begs.push(i);
              ai = str.indexOf(a, i + 1);
            } else if (begs.length == 1) {
              result = [begs.pop(), bi];
            } else {
              beg = begs.pop();
              if (beg < left) {
                left = beg;
                right = bi;
              }
              bi = str.indexOf(b, i + 1);
            }
            i = ai < bi && ai >= 0 ? ai : bi;
          }
          if (begs.length) {
            result = [left, right];
          }
        }
        return result;
      }
    }
  });
  var require_brace_expansion = __commonJS2({
    "node_modules/brace-expansion/index.js"(exports2, module2) {
      var balanced = require_balanced_match();
      module2.exports = expandTop;
      var escSlash = "\x00SLASH" + Math.random() + "\x00";
      var escOpen = "\x00OPEN" + Math.random() + "\x00";
      var escClose = "\x00CLOSE" + Math.random() + "\x00";
      var escComma = "\x00COMMA" + Math.random() + "\x00";
      var escPeriod = "\x00PERIOD" + Math.random() + "\x00";
      function numeric(str) {
        return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
      }
      function escapeBraces(str) {
        return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
      }
      function unescapeBraces(str) {
        return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
      }
      function parseCommaParts(str) {
        if (!str)
          return [""];
        var parts = [];
        var m = balanced("{", "}", str);
        if (!m)
          return str.split(",");
        var pre = m.pre;
        var body = m.body;
        var post = m.post;
        var p = pre.split(",");
        p[p.length - 1] += "{" + body + "}";
        var postParts = parseCommaParts(post);
        if (post.length) {
          p[p.length - 1] += postParts.shift();
          p.push.apply(p, postParts);
        }
        parts.push.apply(parts, p);
        return parts;
      }
      function expandTop(str) {
        if (!str)
          return [];
        if (str.substr(0, 2) === "{}") {
          str = "\\{\\}" + str.substr(2);
        }
        return expand(escapeBraces(str), true).map(unescapeBraces);
      }
      function embrace(str) {
        return "{" + str + "}";
      }
      function isPadded(el) {
        return /^-?0\d/.test(el);
      }
      function lte(i, y) {
        return i <= y;
      }
      function gte(i, y) {
        return i >= y;
      }
      function expand(str, isTop) {
        var expansions = [];
        var m = balanced("{", "}", str);
        if (!m)
          return [str];
        var pre = m.pre;
        var post = m.post.length ? expand(m.post, false) : [""];
        if (/\$$/.test(m.pre)) {
          for (var k = 0;k < post.length; k++) {
            var expansion = pre + "{" + m.body + "}" + post[k];
            expansions.push(expansion);
          }
        } else {
          var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
          var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
          var isSequence = isNumericSequence || isAlphaSequence;
          var isOptions = m.body.indexOf(",") >= 0;
          if (!isSequence && !isOptions) {
            if (m.post.match(/,.*\}/)) {
              str = m.pre + "{" + m.body + escClose + m.post;
              return expand(str);
            }
            return [str];
          }
          var n;
          if (isSequence) {
            n = m.body.split(/\.\./);
          } else {
            n = parseCommaParts(m.body);
            if (n.length === 1) {
              n = expand(n[0], false).map(embrace);
              if (n.length === 1) {
                return post.map(function(p) {
                  return m.pre + n[0] + p;
                });
              }
            }
          }
          var N;
          if (isSequence) {
            var x = numeric(n[0]);
            var y = numeric(n[1]);
            var width = Math.max(n[0].length, n[1].length);
            var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
            var test = lte;
            var reverse = y < x;
            if (reverse) {
              incr *= -1;
              test = gte;
            }
            var pad = n.some(isPadded);
            N = [];
            for (var i = x;test(i, y); i += incr) {
              var c;
              if (isAlphaSequence) {
                c = String.fromCharCode(i);
                if (c === "\\")
                  c = "";
              } else {
                c = String(i);
                if (pad) {
                  var need = width - c.length;
                  if (need > 0) {
                    var z = new Array(need + 1).join("0");
                    if (i < 0)
                      c = "-" + z + c.slice(1);
                    else
                      c = z + c;
                  }
                }
              }
              N.push(c);
            }
          } else {
            N = [];
            for (var j = 0;j < n.length; j++) {
              N.push.apply(N, expand(n[j], false));
            }
          }
          for (var j = 0;j < N.length; j++) {
            for (var k = 0;k < post.length; k++) {
              var expansion = pre + N[j] + post[k];
              if (!isTop || isSequence || expansion)
                expansions.push(expansion);
            }
          }
        }
        return expansions;
      }
    }
  });
  var require_minimatch = __commonJS2({
    "node_modules/minimatch/minimatch.js"(exports2, module2) {
      var minimatch = module2.exports = (p, pattern, options = {}) => {
        assertValidPattern(pattern);
        if (!options.nocomment && pattern.charAt(0) === "#") {
          return false;
        }
        return new Minimatch(pattern, options).match(p);
      };
      module2.exports = minimatch;
      var path2 = require_path();
      minimatch.sep = path2.sep;
      var GLOBSTAR = Symbol("globstar **");
      minimatch.GLOBSTAR = GLOBSTAR;
      var expand = require_brace_expansion();
      var plTypes = {
        "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
        "?": { open: "(?:", close: ")?" },
        "+": { open: "(?:", close: ")+" },
        "*": { open: "(?:", close: ")*" },
        "@": { open: "(?:", close: ")" }
      };
      var qmark = "[^/]";
      var star = qmark + "*?";
      var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
      var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
      var charSet = (s) => s.split("").reduce((set, c) => {
        set[c] = true;
        return set;
      }, {});
      var reSpecials = charSet("().*{}+?[]^$\\!");
      var addPatternStartSet = charSet("[.(");
      var slashSplit = /\/+/;
      minimatch.filter = (pattern, options = {}) => (p, i, list) => minimatch(p, pattern, options);
      var ext = (a, b = {}) => {
        const t = {};
        Object.keys(a).forEach((k) => t[k] = a[k]);
        Object.keys(b).forEach((k) => t[k] = b[k]);
        return t;
      };
      minimatch.defaults = (def) => {
        if (!def || typeof def !== "object" || !Object.keys(def).length) {
          return minimatch;
        }
        const orig = minimatch;
        const m = (p, pattern, options) => orig(p, pattern, ext(def, options));
        m.Minimatch = class Minimatch2 extends orig.Minimatch {
          constructor(pattern, options) {
            super(pattern, ext(def, options));
          }
        };
        m.Minimatch.defaults = (options) => orig.defaults(ext(def, options)).Minimatch;
        m.filter = (pattern, options) => orig.filter(pattern, ext(def, options));
        m.defaults = (options) => orig.defaults(ext(def, options));
        m.makeRe = (pattern, options) => orig.makeRe(pattern, ext(def, options));
        m.braceExpand = (pattern, options) => orig.braceExpand(pattern, ext(def, options));
        m.match = (list, pattern, options) => orig.match(list, pattern, ext(def, options));
        return m;
      };
      minimatch.braceExpand = (pattern, options) => braceExpand(pattern, options);
      var braceExpand = (pattern, options = {}) => {
        assertValidPattern(pattern);
        if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
          return [pattern];
        }
        return expand(pattern);
      };
      var MAX_PATTERN_LENGTH = 1024 * 64;
      var assertValidPattern = (pattern) => {
        if (typeof pattern !== "string") {
          throw new TypeError("invalid pattern");
        }
        if (pattern.length > MAX_PATTERN_LENGTH) {
          throw new TypeError("pattern is too long");
        }
      };
      var SUBPARSE = Symbol("subparse");
      minimatch.makeRe = (pattern, options) => new Minimatch(pattern, options || {}).makeRe();
      minimatch.match = (list, pattern, options = {}) => {
        const mm = new Minimatch(pattern, options);
        list = list.filter((f) => mm.match(f));
        if (mm.options.nonull && !list.length) {
          list.push(pattern);
        }
        return list;
      };
      var globUnescape = (s) => s.replace(/\\(.)/g, "$1");
      var charUnescape = (s) => s.replace(/\\([^-\]])/g, "$1");
      var regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      var braExpEscape = (s) => s.replace(/[[\]\\]/g, "\\$&");
      var Minimatch = class {
        constructor(pattern, options) {
          assertValidPattern(pattern);
          if (!options)
            options = {};
          this.options = options;
          this.set = [];
          this.pattern = pattern;
          this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
          if (this.windowsPathsNoEscape) {
            this.pattern = this.pattern.replace(/\\/g, "/");
          }
          this.regexp = null;
          this.negate = false;
          this.comment = false;
          this.empty = false;
          this.partial = !!options.partial;
          this.make();
        }
        debug() {}
        make() {
          const pattern = this.pattern;
          const options = this.options;
          if (!options.nocomment && pattern.charAt(0) === "#") {
            this.comment = true;
            return;
          }
          if (!pattern) {
            this.empty = true;
            return;
          }
          this.parseNegate();
          let set = this.globSet = this.braceExpand();
          if (options.debug)
            this.debug = (...args) => console.error(...args);
          this.debug(this.pattern, set);
          set = this.globParts = set.map((s) => s.split(slashSplit));
          this.debug(this.pattern, set);
          set = set.map((s, si, set2) => s.map(this.parse, this));
          this.debug(this.pattern, set);
          set = set.filter((s) => s.indexOf(false) === -1);
          this.debug(this.pattern, set);
          this.set = set;
        }
        parseNegate() {
          if (this.options.nonegate)
            return;
          const pattern = this.pattern;
          let negate = false;
          let negateOffset = 0;
          for (let i = 0;i < pattern.length && pattern.charAt(i) === "!"; i++) {
            negate = !negate;
            negateOffset++;
          }
          if (negateOffset)
            this.pattern = pattern.slice(negateOffset);
          this.negate = negate;
        }
        matchOne(file, pattern, partial) {
          var options = this.options;
          this.debug("matchOne", { this: this, file, pattern });
          this.debug("matchOne", file.length, pattern.length);
          for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length;fi < fl && pi < pl; fi++, pi++) {
            this.debug("matchOne loop");
            var p = pattern[pi];
            var f = file[fi];
            this.debug(pattern, p, f);
            if (p === false)
              return false;
            if (p === GLOBSTAR) {
              this.debug("GLOBSTAR", [pattern, p, f]);
              var fr = fi;
              var pr = pi + 1;
              if (pr === pl) {
                this.debug("** at the end");
                for (;fi < fl; fi++) {
                  if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
                    return false;
                }
                return true;
              }
              while (fr < fl) {
                var swallowee = file[fr];
                this.debug(`
globstar while`, file, fr, pattern, pr, swallowee);
                if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
                  this.debug("globstar found match!", fr, fl, swallowee);
                  return true;
                } else {
                  if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
                    this.debug("dot detected!", file, fr, pattern, pr);
                    break;
                  }
                  this.debug("globstar swallow a segment, and continue");
                  fr++;
                }
              }
              if (partial) {
                this.debug(`
>>> no match, partial?`, file, fr, pattern, pr);
                if (fr === fl)
                  return true;
              }
              return false;
            }
            var hit;
            if (typeof p === "string") {
              hit = f === p;
              this.debug("string match", p, f, hit);
            } else {
              hit = f.match(p);
              this.debug("pattern match", p, f, hit);
            }
            if (!hit)
              return false;
          }
          if (fi === fl && pi === pl) {
            return true;
          } else if (fi === fl) {
            return partial;
          } else if (pi === pl) {
            return fi === fl - 1 && file[fi] === "";
          }
          throw new Error("wtf?");
        }
        braceExpand() {
          return braceExpand(this.pattern, this.options);
        }
        parse(pattern, isSub) {
          assertValidPattern(pattern);
          const options = this.options;
          if (pattern === "**") {
            if (!options.noglobstar)
              return GLOBSTAR;
            else
              pattern = "*";
          }
          if (pattern === "")
            return "";
          let re = "";
          let hasMagic = !!options.nocase;
          let escaping = false;
          const patternListStack = [];
          const negativeLists = [];
          let stateChar;
          let inClass = false;
          let reClassStart = -1;
          let classStart = -1;
          let cs;
          let pl;
          let sp;
          const patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
          const clearStateChar = () => {
            if (stateChar) {
              switch (stateChar) {
                case "*":
                  re += star;
                  hasMagic = true;
                  break;
                case "?":
                  re += qmark;
                  hasMagic = true;
                  break;
                default:
                  re += "\\" + stateChar;
                  break;
              }
              this.debug("clearStateChar %j %j", stateChar, re);
              stateChar = false;
            }
          };
          for (let i = 0, c;i < pattern.length && (c = pattern.charAt(i)); i++) {
            this.debug("%s	%s %s %j", pattern, i, re, c);
            if (escaping) {
              if (c === "/") {
                return false;
              }
              if (reSpecials[c]) {
                re += "\\";
              }
              re += c;
              escaping = false;
              continue;
            }
            switch (c) {
              case "/": {
                return false;
              }
              case "\\":
                if (inClass && pattern.charAt(i + 1) === "-") {
                  re += c;
                  continue;
                }
                clearStateChar();
                escaping = true;
                continue;
              case "?":
              case "*":
              case "+":
              case "@":
              case "!":
                this.debug("%s\t%s %s %j <-- stateChar", pattern, i, re, c);
                if (inClass) {
                  this.debug("  in class");
                  if (c === "!" && i === classStart + 1)
                    c = "^";
                  re += c;
                  continue;
                }
                this.debug("call clearStateChar %j", stateChar);
                clearStateChar();
                stateChar = c;
                if (options.noext)
                  clearStateChar();
                continue;
              case "(":
                if (inClass) {
                  re += "(";
                  continue;
                }
                if (!stateChar) {
                  re += "\\(";
                  continue;
                }
                patternListStack.push({
                  type: stateChar,
                  start: i - 1,
                  reStart: re.length,
                  open: plTypes[stateChar].open,
                  close: plTypes[stateChar].close
                });
                re += stateChar === "!" ? "(?:(?!(?:" : "(?:";
                this.debug("plType %j %j", stateChar, re);
                stateChar = false;
                continue;
              case ")":
                if (inClass || !patternListStack.length) {
                  re += "\\)";
                  continue;
                }
                clearStateChar();
                hasMagic = true;
                pl = patternListStack.pop();
                re += pl.close;
                if (pl.type === "!") {
                  negativeLists.push(pl);
                }
                pl.reEnd = re.length;
                continue;
              case "|":
                if (inClass || !patternListStack.length) {
                  re += "\\|";
                  continue;
                }
                clearStateChar();
                re += "|";
                continue;
              case "[":
                clearStateChar();
                if (inClass) {
                  re += "\\" + c;
                  continue;
                }
                inClass = true;
                classStart = i;
                reClassStart = re.length;
                re += c;
                continue;
              case "]":
                if (i === classStart + 1 || !inClass) {
                  re += "\\" + c;
                  continue;
                }
                cs = pattern.substring(classStart + 1, i);
                try {
                  RegExp("[" + braExpEscape(charUnescape(cs)) + "]");
                  re += c;
                } catch (er) {
                  re = re.substring(0, reClassStart) + "(?:$.)";
                }
                hasMagic = true;
                inClass = false;
                continue;
              default:
                clearStateChar();
                if (reSpecials[c] && !(c === "^" && inClass)) {
                  re += "\\";
                }
                re += c;
                break;
            }
          }
          if (inClass) {
            cs = pattern.slice(classStart + 1);
            sp = this.parse(cs, SUBPARSE);
            re = re.substring(0, reClassStart) + "\\[" + sp[0];
            hasMagic = hasMagic || sp[1];
          }
          for (pl = patternListStack.pop();pl; pl = patternListStack.pop()) {
            let tail;
            tail = re.slice(pl.reStart + pl.open.length);
            this.debug("setting tail", re, pl);
            tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, (_, $1, $2) => {
              if (!$2) {
                $2 = "\\";
              }
              return $1 + $1 + $2 + "|";
            });
            this.debug(`tail=%j
   %s`, tail, tail, pl, re);
            const t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
            hasMagic = true;
            re = re.slice(0, pl.reStart) + t + "\\(" + tail;
          }
          clearStateChar();
          if (escaping) {
            re += "\\\\";
          }
          const addPatternStart = addPatternStartSet[re.charAt(0)];
          for (let n = negativeLists.length - 1;n > -1; n--) {
            const nl = negativeLists[n];
            const nlBefore = re.slice(0, nl.reStart);
            const nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
            let nlAfter = re.slice(nl.reEnd);
            const nlLast = re.slice(nl.reEnd - 8, nl.reEnd) + nlAfter;
            const openParensBefore = nlBefore.split("(").length - 1;
            let cleanAfter = nlAfter;
            for (let i = 0;i < openParensBefore; i++) {
              cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
            }
            nlAfter = cleanAfter;
            const dollar = nlAfter === "" && isSub !== SUBPARSE ? "$" : "";
            re = nlBefore + nlFirst + nlAfter + dollar + nlLast;
          }
          if (re !== "" && hasMagic) {
            re = "(?=.)" + re;
          }
          if (addPatternStart) {
            re = patternStart + re;
          }
          if (isSub === SUBPARSE) {
            return [re, hasMagic];
          }
          if (!hasMagic) {
            return globUnescape(pattern);
          }
          const flags = options.nocase ? "i" : "";
          try {
            return Object.assign(new RegExp("^" + re + "$", flags), {
              _glob: pattern,
              _src: re
            });
          } catch (er) {
            return new RegExp("$.");
          }
        }
        makeRe() {
          if (this.regexp || this.regexp === false)
            return this.regexp;
          const set = this.set;
          if (!set.length) {
            this.regexp = false;
            return this.regexp;
          }
          const options = this.options;
          const twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
          const flags = options.nocase ? "i" : "";
          let re = set.map((pattern) => {
            pattern = pattern.map((p) => typeof p === "string" ? regExpEscape(p) : p === GLOBSTAR ? GLOBSTAR : p._src).reduce((set2, p) => {
              if (!(set2[set2.length - 1] === GLOBSTAR && p === GLOBSTAR)) {
                set2.push(p);
              }
              return set2;
            }, []);
            pattern.forEach((p, i) => {
              if (p !== GLOBSTAR || pattern[i - 1] === GLOBSTAR) {
                return;
              }
              if (i === 0) {
                if (pattern.length > 1) {
                  pattern[i + 1] = "(?:\\/|" + twoStar + "\\/)?" + pattern[i + 1];
                } else {
                  pattern[i] = twoStar;
                }
              } else if (i === pattern.length - 1) {
                pattern[i - 1] += "(?:\\/|" + twoStar + ")?";
              } else {
                pattern[i - 1] += "(?:\\/|\\/" + twoStar + "\\/)" + pattern[i + 1];
                pattern[i + 1] = GLOBSTAR;
              }
            });
            return pattern.filter((p) => p !== GLOBSTAR).join("/");
          }).join("|");
          re = "^(?:" + re + ")$";
          if (this.negate)
            re = "^(?!" + re + ").*$";
          try {
            this.regexp = new RegExp(re, flags);
          } catch (ex) {
            this.regexp = false;
          }
          return this.regexp;
        }
        match(f, partial = this.partial) {
          this.debug("match", f, this.pattern);
          if (this.comment)
            return false;
          if (this.empty)
            return f === "";
          if (f === "/" && partial)
            return true;
          const options = this.options;
          if (path2.sep !== "/") {
            f = f.split(path2.sep).join("/");
          }
          f = f.split(slashSplit);
          this.debug(this.pattern, "split", f);
          const set = this.set;
          this.debug(this.pattern, "set", set);
          let filename;
          for (let i = f.length - 1;i >= 0; i--) {
            filename = f[i];
            if (filename)
              break;
          }
          for (let i = 0;i < set.length; i++) {
            const pattern = set[i];
            let file = f;
            if (options.matchBase && pattern.length === 1) {
              file = [filename];
            }
            const hit = this.matchOne(file, pattern, partial);
            if (hit) {
              if (options.flipNegate)
                return true;
              return !this.negate;
            }
          }
          if (options.flipNegate)
            return false;
          return this.negate;
        }
        static defaults(def) {
          return minimatch.defaults(def).Minimatch;
        }
      };
      minimatch.Minimatch = Minimatch;
    }
  });
  var require_inherits_browser = __commonJS2({
    "node_modules/inherits/inherits_browser.js"(exports2, module2) {
      if (typeof Object.create === "function") {
        module2.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
              constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
              }
            });
          }
        };
      } else {
        module2.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function() {};
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor;
            ctor.prototype.constructor = ctor;
          }
        };
      }
    }
  });
  var require_inherits = __commonJS2({
    "node_modules/inherits/inherits.js"(exports2, module2) {
      try {
        util = __require("util");
        if (typeof util.inherits !== "function")
          throw "";
        module2.exports = util.inherits;
      } catch (e) {
        module2.exports = require_inherits_browser();
      }
      var util;
    }
  });
  var require_common = __commonJS2({
    "node_modules/glob/common.js"(exports2) {
      exports2.setopts = setopts;
      exports2.ownProp = ownProp;
      exports2.makeAbs = makeAbs;
      exports2.finish = finish;
      exports2.mark = mark;
      exports2.isIgnored = isIgnored;
      exports2.childrenIgnored = childrenIgnored;
      function ownProp(obj, field) {
        return Object.prototype.hasOwnProperty.call(obj, field);
      }
      var fs2 = __require("fs");
      var path2 = __require("path");
      var minimatch = require_minimatch();
      var isAbsolute = __require("path").isAbsolute;
      var Minimatch = minimatch.Minimatch;
      function alphasort(a, b) {
        return a.localeCompare(b, "en");
      }
      function setupIgnores(self, options) {
        self.ignore = options.ignore || [];
        if (!Array.isArray(self.ignore))
          self.ignore = [self.ignore];
        if (self.ignore.length) {
          self.ignore = self.ignore.map(ignoreMap);
        }
      }
      function ignoreMap(pattern) {
        var gmatcher = null;
        if (pattern.slice(-3) === "/**") {
          var gpattern = pattern.replace(/(\/\*\*)+$/, "");
          gmatcher = new Minimatch(gpattern, { dot: true });
        }
        return {
          matcher: new Minimatch(pattern, { dot: true }),
          gmatcher
        };
      }
      function setopts(self, pattern, options) {
        if (!options)
          options = {};
        if (options.matchBase && pattern.indexOf("/") === -1) {
          if (options.noglobstar) {
            throw new Error("base matching requires globstar");
          }
          pattern = "**/" + pattern;
        }
        self.silent = !!options.silent;
        self.pattern = pattern;
        self.strict = options.strict !== false;
        self.realpath = !!options.realpath;
        self.realpathCache = options.realpathCache || /* @__PURE__ */ Object.create(null);
        self.follow = !!options.follow;
        self.dot = !!options.dot;
        self.mark = !!options.mark;
        self.nodir = !!options.nodir;
        if (self.nodir)
          self.mark = true;
        self.sync = !!options.sync;
        self.nounique = !!options.nounique;
        self.nonull = !!options.nonull;
        self.nosort = !!options.nosort;
        self.nocase = !!options.nocase;
        self.stat = !!options.stat;
        self.noprocess = !!options.noprocess;
        self.absolute = !!options.absolute;
        self.fs = options.fs || fs2;
        self.maxLength = options.maxLength || Infinity;
        self.cache = options.cache || /* @__PURE__ */ Object.create(null);
        self.statCache = options.statCache || /* @__PURE__ */ Object.create(null);
        self.symlinks = options.symlinks || /* @__PURE__ */ Object.create(null);
        setupIgnores(self, options);
        self.changedCwd = false;
        var cwd = process.cwd();
        if (!ownProp(options, "cwd"))
          self.cwd = path2.resolve(cwd);
        else {
          self.cwd = path2.resolve(options.cwd);
          self.changedCwd = self.cwd !== cwd;
        }
        self.root = options.root || path2.resolve(self.cwd, "/");
        self.root = path2.resolve(self.root);
        self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd);
        self.nomount = !!options.nomount;
        if (process.platform === "win32") {
          self.root = self.root.replace(/\\/g, "/");
          self.cwd = self.cwd.replace(/\\/g, "/");
          self.cwdAbs = self.cwdAbs.replace(/\\/g, "/");
        }
        options.nonegate = true;
        options.nocomment = true;
        options.allowWindowsEscape = true;
        self.minimatch = new Minimatch(pattern, options);
        self.options = self.minimatch.options;
      }
      function finish(self) {
        var nou = self.nounique;
        var all = nou ? [] : /* @__PURE__ */ Object.create(null);
        for (var i = 0, l = self.matches.length;i < l; i++) {
          var matches = self.matches[i];
          if (!matches || Object.keys(matches).length === 0) {
            if (self.nonull) {
              var literal = self.minimatch.globSet[i];
              if (nou)
                all.push(literal);
              else
                all[literal] = true;
            }
          } else {
            var m = Object.keys(matches);
            if (nou)
              all.push.apply(all, m);
            else
              m.forEach(function(m2) {
                all[m2] = true;
              });
          }
        }
        if (!nou)
          all = Object.keys(all);
        if (!self.nosort)
          all = all.sort(alphasort);
        if (self.mark) {
          for (var i = 0;i < all.length; i++) {
            all[i] = self._mark(all[i]);
          }
          if (self.nodir) {
            all = all.filter(function(e) {
              var notDir = !/\/$/.test(e);
              var c = self.cache[e] || self.cache[makeAbs(self, e)];
              if (notDir && c)
                notDir = c !== "DIR" && !Array.isArray(c);
              return notDir;
            });
          }
        }
        if (self.ignore.length)
          all = all.filter(function(m2) {
            return !isIgnored(self, m2);
          });
        self.found = all;
      }
      function mark(self, p) {
        var abs = makeAbs(self, p);
        var c = self.cache[abs];
        var m = p;
        if (c) {
          var isDir = c === "DIR" || Array.isArray(c);
          var slash = p.slice(-1) === "/";
          if (isDir && !slash)
            m += "/";
          else if (!isDir && slash)
            m = m.slice(0, -1);
          if (m !== p) {
            var mabs = makeAbs(self, m);
            self.statCache[mabs] = self.statCache[abs];
            self.cache[mabs] = self.cache[abs];
          }
        }
        return m;
      }
      function makeAbs(self, f) {
        var abs = f;
        if (f.charAt(0) === "/") {
          abs = path2.join(self.root, f);
        } else if (isAbsolute(f) || f === "") {
          abs = f;
        } else if (self.changedCwd) {
          abs = path2.resolve(self.cwd, f);
        } else {
          abs = path2.resolve(f);
        }
        if (process.platform === "win32")
          abs = abs.replace(/\\/g, "/");
        return abs;
      }
      function isIgnored(self, path3) {
        if (!self.ignore.length)
          return false;
        return self.ignore.some(function(item) {
          return item.matcher.match(path3) || !!(item.gmatcher && item.gmatcher.match(path3));
        });
      }
      function childrenIgnored(self, path3) {
        if (!self.ignore.length)
          return false;
        return self.ignore.some(function(item) {
          return !!(item.gmatcher && item.gmatcher.match(path3));
        });
      }
    }
  });
  var require_sync = __commonJS2({
    "node_modules/glob/sync.js"(exports2, module2) {
      module2.exports = globSync;
      globSync.GlobSync = GlobSync;
      var rp = require_fs();
      var minimatch = require_minimatch();
      var Minimatch = minimatch.Minimatch;
      var Glob = require_glob().Glob;
      var util = __require("util");
      var path2 = __require("path");
      var assert = __require("assert");
      var isAbsolute = __require("path").isAbsolute;
      var common = require_common();
      var setopts = common.setopts;
      var ownProp = common.ownProp;
      var childrenIgnored = common.childrenIgnored;
      var isIgnored = common.isIgnored;
      function globSync(pattern, options) {
        if (typeof options === "function" || arguments.length === 3)
          throw new TypeError(`callback provided to sync glob
See: https://github.com/isaacs/node-glob/issues/167`);
        return new GlobSync(pattern, options).found;
      }
      function GlobSync(pattern, options) {
        if (!pattern)
          throw new Error("must provide pattern");
        if (typeof options === "function" || arguments.length === 3)
          throw new TypeError(`callback provided to sync glob
See: https://github.com/isaacs/node-glob/issues/167`);
        if (!(this instanceof GlobSync))
          return new GlobSync(pattern, options);
        setopts(this, pattern, options);
        if (this.noprocess)
          return this;
        var n = this.minimatch.set.length;
        this.matches = new Array(n);
        for (var i = 0;i < n; i++) {
          this._process(this.minimatch.set[i], i, false);
        }
        this._finish();
      }
      GlobSync.prototype._finish = function() {
        assert.ok(this instanceof GlobSync);
        if (this.realpath) {
          var self = this;
          this.matches.forEach(function(matchset, index) {
            var set = self.matches[index] = /* @__PURE__ */ Object.create(null);
            for (var p in matchset) {
              try {
                p = self._makeAbs(p);
                var real = rp.realpathSync(p, self.realpathCache);
                set[real] = true;
              } catch (er) {
                if (er.syscall === "stat")
                  set[self._makeAbs(p)] = true;
                else
                  throw er;
              }
            }
          });
        }
        common.finish(this);
      };
      GlobSync.prototype._process = function(pattern, index, inGlobStar) {
        assert.ok(this instanceof GlobSync);
        var n = 0;
        while (typeof pattern[n] === "string") {
          n++;
        }
        var prefix;
        switch (n) {
          case pattern.length:
            this._processSimple(pattern.join("/"), index);
            return;
          case 0:
            prefix = null;
            break;
          default:
            prefix = pattern.slice(0, n).join("/");
            break;
        }
        var remain = pattern.slice(n);
        var read;
        if (prefix === null)
          read = ".";
        else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
          return typeof p === "string" ? p : "[*]";
        }).join("/"))) {
          if (!prefix || !isAbsolute(prefix))
            prefix = "/" + prefix;
          read = prefix;
        } else
          read = prefix;
        var abs = this._makeAbs(read);
        if (childrenIgnored(this, read))
          return;
        var isGlobStar = remain[0] === minimatch.GLOBSTAR;
        if (isGlobStar)
          this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
        else
          this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
      };
      GlobSync.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar) {
        var entries = this._readdir(abs, inGlobStar);
        if (!entries)
          return;
        var pn = remain[0];
        var negate = !!this.minimatch.negate;
        var rawGlob = pn._glob;
        var dotOk = this.dot || rawGlob.charAt(0) === ".";
        var matchedEntries = [];
        for (var i = 0;i < entries.length; i++) {
          var e = entries[i];
          if (e.charAt(0) !== "." || dotOk) {
            var m;
            if (negate && !prefix) {
              m = !e.match(pn);
            } else {
              m = e.match(pn);
            }
            if (m)
              matchedEntries.push(e);
          }
        }
        var len = matchedEntries.length;
        if (len === 0)
          return;
        if (remain.length === 1 && !this.mark && !this.stat) {
          if (!this.matches[index])
            this.matches[index] = /* @__PURE__ */ Object.create(null);
          for (var i = 0;i < len; i++) {
            var e = matchedEntries[i];
            if (prefix) {
              if (prefix.slice(-1) !== "/")
                e = prefix + "/" + e;
              else
                e = prefix + e;
            }
            if (e.charAt(0) === "/" && !this.nomount) {
              e = path2.join(this.root, e);
            }
            this._emitMatch(index, e);
          }
          return;
        }
        remain.shift();
        for (var i = 0;i < len; i++) {
          var e = matchedEntries[i];
          var newPattern;
          if (prefix)
            newPattern = [prefix, e];
          else
            newPattern = [e];
          this._process(newPattern.concat(remain), index, inGlobStar);
        }
      };
      GlobSync.prototype._emitMatch = function(index, e) {
        if (isIgnored(this, e))
          return;
        var abs = this._makeAbs(e);
        if (this.mark)
          e = this._mark(e);
        if (this.absolute) {
          e = abs;
        }
        if (this.matches[index][e])
          return;
        if (this.nodir) {
          var c = this.cache[abs];
          if (c === "DIR" || Array.isArray(c))
            return;
        }
        this.matches[index][e] = true;
        if (this.stat)
          this._stat(e);
      };
      GlobSync.prototype._readdirInGlobStar = function(abs) {
        if (this.follow)
          return this._readdir(abs, false);
        var entries;
        var lstat;
        var stat;
        try {
          lstat = this.fs.lstatSync(abs);
        } catch (er) {
          if (er.code === "ENOENT") {
            return null;
          }
        }
        var isSym = lstat && lstat.isSymbolicLink();
        this.symlinks[abs] = isSym;
        if (!isSym && lstat && !lstat.isDirectory())
          this.cache[abs] = "FILE";
        else
          entries = this._readdir(abs, false);
        return entries;
      };
      GlobSync.prototype._readdir = function(abs, inGlobStar) {
        var entries;
        if (inGlobStar && !ownProp(this.symlinks, abs))
          return this._readdirInGlobStar(abs);
        if (ownProp(this.cache, abs)) {
          var c = this.cache[abs];
          if (!c || c === "FILE")
            return null;
          if (Array.isArray(c))
            return c;
        }
        try {
          return this._readdirEntries(abs, this.fs.readdirSync(abs));
        } catch (er) {
          this._readdirError(abs, er);
          return null;
        }
      };
      GlobSync.prototype._readdirEntries = function(abs, entries) {
        if (!this.mark && !this.stat) {
          for (var i = 0;i < entries.length; i++) {
            var e = entries[i];
            if (abs === "/")
              e = abs + e;
            else
              e = abs + "/" + e;
            this.cache[e] = true;
          }
        }
        this.cache[abs] = entries;
        return entries;
      };
      GlobSync.prototype._readdirError = function(f, er) {
        switch (er.code) {
          case "ENOTSUP":
          case "ENOTDIR":
            var abs = this._makeAbs(f);
            this.cache[abs] = "FILE";
            if (abs === this.cwdAbs) {
              var error = new Error(er.code + " invalid cwd " + this.cwd);
              error.path = this.cwd;
              error.code = er.code;
              throw error;
            }
            break;
          case "ENOENT":
          case "ELOOP":
          case "ENAMETOOLONG":
          case "UNKNOWN":
            this.cache[this._makeAbs(f)] = false;
            break;
          default:
            this.cache[this._makeAbs(f)] = false;
            if (this.strict)
              throw er;
            if (!this.silent)
              console.error("glob error", er);
            break;
        }
      };
      GlobSync.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar) {
        var entries = this._readdir(abs, inGlobStar);
        if (!entries)
          return;
        var remainWithoutGlobStar = remain.slice(1);
        var gspref = prefix ? [prefix] : [];
        var noGlobStar = gspref.concat(remainWithoutGlobStar);
        this._process(noGlobStar, index, false);
        var len = entries.length;
        var isSym = this.symlinks[abs];
        if (isSym && inGlobStar)
          return;
        for (var i = 0;i < len; i++) {
          var e = entries[i];
          if (e.charAt(0) === "." && !this.dot)
            continue;
          var instead = gspref.concat(entries[i], remainWithoutGlobStar);
          this._process(instead, index, true);
          var below = gspref.concat(entries[i], remain);
          this._process(below, index, true);
        }
      };
      GlobSync.prototype._processSimple = function(prefix, index) {
        var exists = this._stat(prefix);
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        if (!exists)
          return;
        if (prefix && isAbsolute(prefix) && !this.nomount) {
          var trail = /[\/\\]$/.test(prefix);
          if (prefix.charAt(0) === "/") {
            prefix = path2.join(this.root, prefix);
          } else {
            prefix = path2.resolve(this.root, prefix);
            if (trail)
              prefix += "/";
          }
        }
        if (process.platform === "win32")
          prefix = prefix.replace(/\\/g, "/");
        this._emitMatch(index, prefix);
      };
      GlobSync.prototype._stat = function(f) {
        var abs = this._makeAbs(f);
        var needDir = f.slice(-1) === "/";
        if (f.length > this.maxLength)
          return false;
        if (!this.stat && ownProp(this.cache, abs)) {
          var c = this.cache[abs];
          if (Array.isArray(c))
            c = "DIR";
          if (!needDir || c === "DIR")
            return c;
          if (needDir && c === "FILE")
            return false;
        }
        var exists;
        var stat = this.statCache[abs];
        if (!stat) {
          var lstat;
          try {
            lstat = this.fs.lstatSync(abs);
          } catch (er) {
            if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
              this.statCache[abs] = false;
              return false;
            }
          }
          if (lstat && lstat.isSymbolicLink()) {
            try {
              stat = this.fs.statSync(abs);
            } catch (er) {
              stat = lstat;
            }
          } else {
            stat = lstat;
          }
        }
        this.statCache[abs] = stat;
        var c = true;
        if (stat)
          c = stat.isDirectory() ? "DIR" : "FILE";
        this.cache[abs] = this.cache[abs] || c;
        if (needDir && c === "FILE")
          return false;
        return c;
      };
      GlobSync.prototype._mark = function(p) {
        return common.mark(this, p);
      };
      GlobSync.prototype._makeAbs = function(f) {
        return common.makeAbs(this, f);
      };
    }
  });
  var require_wrappy = __commonJS2({
    "node_modules/wrappy/wrappy.js"(exports2, module2) {
      module2.exports = wrappy;
      function wrappy(fn, cb) {
        if (fn && cb)
          return wrappy(fn)(cb);
        if (typeof fn !== "function")
          throw new TypeError("need wrapper function");
        Object.keys(fn).forEach(function(k) {
          wrapper[k] = fn[k];
        });
        return wrapper;
        function wrapper() {
          var args = new Array(arguments.length);
          for (var i = 0;i < args.length; i++) {
            args[i] = arguments[i];
          }
          var ret = fn.apply(this, args);
          var cb2 = args[args.length - 1];
          if (typeof ret === "function" && ret !== cb2) {
            Object.keys(cb2).forEach(function(k) {
              ret[k] = cb2[k];
            });
          }
          return ret;
        }
      }
    }
  });
  var require_once = __commonJS2({
    "node_modules/once/once.js"(exports2, module2) {
      var wrappy = require_wrappy();
      module2.exports = wrappy(once);
      module2.exports.strict = wrappy(onceStrict);
      once.proto = once(function() {
        Object.defineProperty(Function.prototype, "once", {
          value: function() {
            return once(this);
          },
          configurable: true
        });
        Object.defineProperty(Function.prototype, "onceStrict", {
          value: function() {
            return onceStrict(this);
          },
          configurable: true
        });
      });
      function once(fn) {
        var f = function() {
          if (f.called)
            return f.value;
          f.called = true;
          return f.value = fn.apply(this, arguments);
        };
        f.called = false;
        return f;
      }
      function onceStrict(fn) {
        var f = function() {
          if (f.called)
            throw new Error(f.onceError);
          f.called = true;
          return f.value = fn.apply(this, arguments);
        };
        var name = fn.name || "Function wrapped with `once`";
        f.onceError = name + " shouldn't be called more than once";
        f.called = false;
        return f;
      }
    }
  });
  var require_inflight = __commonJS2({
    "node_modules/inflight/inflight.js"(exports2, module2) {
      var wrappy = require_wrappy();
      var reqs = /* @__PURE__ */ Object.create(null);
      var once = require_once();
      module2.exports = wrappy(inflight);
      function inflight(key, cb) {
        if (reqs[key]) {
          reqs[key].push(cb);
          return null;
        } else {
          reqs[key] = [cb];
          return makeres(key);
        }
      }
      function makeres(key) {
        return once(function RES() {
          var cbs = reqs[key];
          var len = cbs.length;
          var args = slice(arguments);
          try {
            for (var i = 0;i < len; i++) {
              cbs[i].apply(null, args);
            }
          } finally {
            if (cbs.length > len) {
              cbs.splice(0, len);
              process.nextTick(function() {
                RES.apply(null, args);
              });
            } else {
              delete reqs[key];
            }
          }
        });
      }
      function slice(args) {
        var length = args.length;
        var array = [];
        for (var i = 0;i < length; i++)
          array[i] = args[i];
        return array;
      }
    }
  });
  var require_glob = __commonJS2({
    "node_modules/glob/glob.js"(exports2, module2) {
      module2.exports = glob2;
      var rp = require_fs();
      var minimatch = require_minimatch();
      var Minimatch = minimatch.Minimatch;
      var inherits = require_inherits();
      var EE = __require("events").EventEmitter;
      var path2 = __require("path");
      var assert = __require("assert");
      var isAbsolute = __require("path").isAbsolute;
      var globSync = require_sync();
      var common = require_common();
      var setopts = common.setopts;
      var ownProp = common.ownProp;
      var inflight = require_inflight();
      var util = __require("util");
      var childrenIgnored = common.childrenIgnored;
      var isIgnored = common.isIgnored;
      var once = require_once();
      function glob2(pattern, options, cb) {
        if (typeof options === "function")
          cb = options, options = {};
        if (!options)
          options = {};
        if (options.sync) {
          if (cb)
            throw new TypeError("callback provided to sync glob");
          return globSync(pattern, options);
        }
        return new Glob(pattern, options, cb);
      }
      glob2.sync = globSync;
      var GlobSync = glob2.GlobSync = globSync.GlobSync;
      glob2.glob = glob2;
      function extend(origin, add) {
        if (add === null || typeof add !== "object") {
          return origin;
        }
        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
          origin[keys[i]] = add[keys[i]];
        }
        return origin;
      }
      glob2.hasMagic = function(pattern, options_) {
        var options = extend({}, options_);
        options.noprocess = true;
        var g = new Glob(pattern, options);
        var set = g.minimatch.set;
        if (!pattern)
          return false;
        if (set.length > 1)
          return true;
        for (var j = 0;j < set[0].length; j++) {
          if (typeof set[0][j] !== "string")
            return true;
        }
        return false;
      };
      glob2.Glob = Glob;
      inherits(Glob, EE);
      function Glob(pattern, options, cb) {
        if (typeof options === "function") {
          cb = options;
          options = null;
        }
        if (options && options.sync) {
          if (cb)
            throw new TypeError("callback provided to sync glob");
          return new GlobSync(pattern, options);
        }
        if (!(this instanceof Glob))
          return new Glob(pattern, options, cb);
        setopts(this, pattern, options);
        this._didRealPath = false;
        var n = this.minimatch.set.length;
        this.matches = new Array(n);
        if (typeof cb === "function") {
          cb = once(cb);
          this.on("error", cb);
          this.on("end", function(matches) {
            cb(null, matches);
          });
        }
        var self = this;
        this._processing = 0;
        this._emitQueue = [];
        this._processQueue = [];
        this.paused = false;
        if (this.noprocess)
          return this;
        if (n === 0)
          return done();
        var sync = true;
        for (var i = 0;i < n; i++) {
          this._process(this.minimatch.set[i], i, false, done);
        }
        sync = false;
        function done() {
          --self._processing;
          if (self._processing <= 0) {
            if (sync) {
              process.nextTick(function() {
                self._finish();
              });
            } else {
              self._finish();
            }
          }
        }
      }
      Glob.prototype._finish = function() {
        assert(this instanceof Glob);
        if (this.aborted)
          return;
        if (this.realpath && !this._didRealpath)
          return this._realpath();
        common.finish(this);
        this.emit("end", this.found);
      };
      Glob.prototype._realpath = function() {
        if (this._didRealpath)
          return;
        this._didRealpath = true;
        var n = this.matches.length;
        if (n === 0)
          return this._finish();
        var self = this;
        for (var i = 0;i < this.matches.length; i++)
          this._realpathSet(i, next);
        function next() {
          if (--n === 0)
            self._finish();
        }
      };
      Glob.prototype._realpathSet = function(index, cb) {
        var matchset = this.matches[index];
        if (!matchset)
          return cb();
        var found = Object.keys(matchset);
        var self = this;
        var n = found.length;
        if (n === 0)
          return cb();
        var set = this.matches[index] = /* @__PURE__ */ Object.create(null);
        found.forEach(function(p, i) {
          p = self._makeAbs(p);
          rp.realpath(p, self.realpathCache, function(er, real) {
            if (!er)
              set[real] = true;
            else if (er.syscall === "stat")
              set[p] = true;
            else
              self.emit("error", er);
            if (--n === 0) {
              self.matches[index] = set;
              cb();
            }
          });
        });
      };
      Glob.prototype._mark = function(p) {
        return common.mark(this, p);
      };
      Glob.prototype._makeAbs = function(f) {
        return common.makeAbs(this, f);
      };
      Glob.prototype.abort = function() {
        this.aborted = true;
        this.emit("abort");
      };
      Glob.prototype.pause = function() {
        if (!this.paused) {
          this.paused = true;
          this.emit("pause");
        }
      };
      Glob.prototype.resume = function() {
        if (this.paused) {
          this.emit("resume");
          this.paused = false;
          if (this._emitQueue.length) {
            var eq = this._emitQueue.slice(0);
            this._emitQueue.length = 0;
            for (var i = 0;i < eq.length; i++) {
              var e = eq[i];
              this._emitMatch(e[0], e[1]);
            }
          }
          if (this._processQueue.length) {
            var pq = this._processQueue.slice(0);
            this._processQueue.length = 0;
            for (var i = 0;i < pq.length; i++) {
              var p = pq[i];
              this._processing--;
              this._process(p[0], p[1], p[2], p[3]);
            }
          }
        }
      };
      Glob.prototype._process = function(pattern, index, inGlobStar, cb) {
        assert(this instanceof Glob);
        assert(typeof cb === "function");
        if (this.aborted)
          return;
        this._processing++;
        if (this.paused) {
          this._processQueue.push([pattern, index, inGlobStar, cb]);
          return;
        }
        var n = 0;
        while (typeof pattern[n] === "string") {
          n++;
        }
        var prefix;
        switch (n) {
          case pattern.length:
            this._processSimple(pattern.join("/"), index, cb);
            return;
          case 0:
            prefix = null;
            break;
          default:
            prefix = pattern.slice(0, n).join("/");
            break;
        }
        var remain = pattern.slice(n);
        var read;
        if (prefix === null)
          read = ".";
        else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
          return typeof p === "string" ? p : "[*]";
        }).join("/"))) {
          if (!prefix || !isAbsolute(prefix))
            prefix = "/" + prefix;
          read = prefix;
        } else
          read = prefix;
        var abs = this._makeAbs(read);
        if (childrenIgnored(this, read))
          return cb();
        var isGlobStar = remain[0] === minimatch.GLOBSTAR;
        if (isGlobStar)
          this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
        else
          this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
      };
      Glob.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar, cb) {
        var self = this;
        this._readdir(abs, inGlobStar, function(er, entries) {
          return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
        });
      };
      Glob.prototype._processReaddir2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
        if (!entries)
          return cb();
        var pn = remain[0];
        var negate = !!this.minimatch.negate;
        var rawGlob = pn._glob;
        var dotOk = this.dot || rawGlob.charAt(0) === ".";
        var matchedEntries = [];
        for (var i = 0;i < entries.length; i++) {
          var e = entries[i];
          if (e.charAt(0) !== "." || dotOk) {
            var m;
            if (negate && !prefix) {
              m = !e.match(pn);
            } else {
              m = e.match(pn);
            }
            if (m)
              matchedEntries.push(e);
          }
        }
        var len = matchedEntries.length;
        if (len === 0)
          return cb();
        if (remain.length === 1 && !this.mark && !this.stat) {
          if (!this.matches[index])
            this.matches[index] = /* @__PURE__ */ Object.create(null);
          for (var i = 0;i < len; i++) {
            var e = matchedEntries[i];
            if (prefix) {
              if (prefix !== "/")
                e = prefix + "/" + e;
              else
                e = prefix + e;
            }
            if (e.charAt(0) === "/" && !this.nomount) {
              e = path2.join(this.root, e);
            }
            this._emitMatch(index, e);
          }
          return cb();
        }
        remain.shift();
        for (var i = 0;i < len; i++) {
          var e = matchedEntries[i];
          var newPattern;
          if (prefix) {
            if (prefix !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          this._process([e].concat(remain), index, inGlobStar, cb);
        }
        cb();
      };
      Glob.prototype._emitMatch = function(index, e) {
        if (this.aborted)
          return;
        if (isIgnored(this, e))
          return;
        if (this.paused) {
          this._emitQueue.push([index, e]);
          return;
        }
        var abs = isAbsolute(e) ? e : this._makeAbs(e);
        if (this.mark)
          e = this._mark(e);
        if (this.absolute)
          e = abs;
        if (this.matches[index][e])
          return;
        if (this.nodir) {
          var c = this.cache[abs];
          if (c === "DIR" || Array.isArray(c))
            return;
        }
        this.matches[index][e] = true;
        var st = this.statCache[abs];
        if (st)
          this.emit("stat", e, st);
        this.emit("match", e);
      };
      Glob.prototype._readdirInGlobStar = function(abs, cb) {
        if (this.aborted)
          return;
        if (this.follow)
          return this._readdir(abs, false, cb);
        var lstatkey = "lstat\x00" + abs;
        var self = this;
        var lstatcb = inflight(lstatkey, lstatcb_);
        if (lstatcb)
          self.fs.lstat(abs, lstatcb);
        function lstatcb_(er, lstat) {
          if (er && er.code === "ENOENT")
            return cb();
          var isSym = lstat && lstat.isSymbolicLink();
          self.symlinks[abs] = isSym;
          if (!isSym && lstat && !lstat.isDirectory()) {
            self.cache[abs] = "FILE";
            cb();
          } else
            self._readdir(abs, false, cb);
        }
      };
      Glob.prototype._readdir = function(abs, inGlobStar, cb) {
        if (this.aborted)
          return;
        cb = inflight("readdir\x00" + abs + "\x00" + inGlobStar, cb);
        if (!cb)
          return;
        if (inGlobStar && !ownProp(this.symlinks, abs))
          return this._readdirInGlobStar(abs, cb);
        if (ownProp(this.cache, abs)) {
          var c = this.cache[abs];
          if (!c || c === "FILE")
            return cb();
          if (Array.isArray(c))
            return cb(null, c);
        }
        var self = this;
        self.fs.readdir(abs, readdirCb(this, abs, cb));
      };
      function readdirCb(self, abs, cb) {
        return function(er, entries) {
          if (er)
            self._readdirError(abs, er, cb);
          else
            self._readdirEntries(abs, entries, cb);
        };
      }
      Glob.prototype._readdirEntries = function(abs, entries, cb) {
        if (this.aborted)
          return;
        if (!this.mark && !this.stat) {
          for (var i = 0;i < entries.length; i++) {
            var e = entries[i];
            if (abs === "/")
              e = abs + e;
            else
              e = abs + "/" + e;
            this.cache[e] = true;
          }
        }
        this.cache[abs] = entries;
        return cb(null, entries);
      };
      Glob.prototype._readdirError = function(f, er, cb) {
        if (this.aborted)
          return;
        switch (er.code) {
          case "ENOTSUP":
          case "ENOTDIR":
            var abs = this._makeAbs(f);
            this.cache[abs] = "FILE";
            if (abs === this.cwdAbs) {
              var error = new Error(er.code + " invalid cwd " + this.cwd);
              error.path = this.cwd;
              error.code = er.code;
              this.emit("error", error);
              this.abort();
            }
            break;
          case "ENOENT":
          case "ELOOP":
          case "ENAMETOOLONG":
          case "UNKNOWN":
            this.cache[this._makeAbs(f)] = false;
            break;
          default:
            this.cache[this._makeAbs(f)] = false;
            if (this.strict) {
              this.emit("error", er);
              this.abort();
            }
            if (!this.silent)
              console.error("glob error", er);
            break;
        }
        return cb();
      };
      Glob.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar, cb) {
        var self = this;
        this._readdir(abs, inGlobStar, function(er, entries) {
          self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
        });
      };
      Glob.prototype._processGlobStar2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
        if (!entries)
          return cb();
        var remainWithoutGlobStar = remain.slice(1);
        var gspref = prefix ? [prefix] : [];
        var noGlobStar = gspref.concat(remainWithoutGlobStar);
        this._process(noGlobStar, index, false, cb);
        var isSym = this.symlinks[abs];
        var len = entries.length;
        if (isSym && inGlobStar)
          return cb();
        for (var i = 0;i < len; i++) {
          var e = entries[i];
          if (e.charAt(0) === "." && !this.dot)
            continue;
          var instead = gspref.concat(entries[i], remainWithoutGlobStar);
          this._process(instead, index, true, cb);
          var below = gspref.concat(entries[i], remain);
          this._process(below, index, true, cb);
        }
        cb();
      };
      Glob.prototype._processSimple = function(prefix, index, cb) {
        var self = this;
        this._stat(prefix, function(er, exists) {
          self._processSimple2(prefix, index, er, exists, cb);
        });
      };
      Glob.prototype._processSimple2 = function(prefix, index, er, exists, cb) {
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        if (!exists)
          return cb();
        if (prefix && isAbsolute(prefix) && !this.nomount) {
          var trail = /[\/\\]$/.test(prefix);
          if (prefix.charAt(0) === "/") {
            prefix = path2.join(this.root, prefix);
          } else {
            prefix = path2.resolve(this.root, prefix);
            if (trail)
              prefix += "/";
          }
        }
        if (process.platform === "win32")
          prefix = prefix.replace(/\\/g, "/");
        this._emitMatch(index, prefix);
        cb();
      };
      Glob.prototype._stat = function(f, cb) {
        var abs = this._makeAbs(f);
        var needDir = f.slice(-1) === "/";
        if (f.length > this.maxLength)
          return cb();
        if (!this.stat && ownProp(this.cache, abs)) {
          var c = this.cache[abs];
          if (Array.isArray(c))
            c = "DIR";
          if (!needDir || c === "DIR")
            return cb(null, c);
          if (needDir && c === "FILE")
            return cb();
        }
        var exists;
        var stat = this.statCache[abs];
        if (stat !== undefined) {
          if (stat === false)
            return cb(null, stat);
          else {
            var type = stat.isDirectory() ? "DIR" : "FILE";
            if (needDir && type === "FILE")
              return cb();
            else
              return cb(null, type, stat);
          }
        }
        var self = this;
        var statcb = inflight("stat\x00" + abs, lstatcb_);
        if (statcb)
          self.fs.lstat(abs, statcb);
        function lstatcb_(er, lstat) {
          if (lstat && lstat.isSymbolicLink()) {
            return self.fs.stat(abs, function(er2, stat2) {
              if (er2)
                self._stat2(f, abs, null, lstat, cb);
              else
                self._stat2(f, abs, er2, stat2, cb);
            });
          } else {
            self._stat2(f, abs, er, lstat, cb);
          }
        }
      };
      Glob.prototype._stat2 = function(f, abs, er, stat, cb) {
        if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
          this.statCache[abs] = false;
          return cb();
        }
        var needDir = f.slice(-1) === "/";
        this.statCache[abs] = stat;
        if (abs.slice(-1) === "/" && stat && !stat.isDirectory())
          return cb(null, false, stat);
        var c = true;
        if (stat)
          c = stat.isDirectory() ? "DIR" : "FILE";
        this.cache[abs] = this.cache[abs] || c;
        if (needDir && c === "FILE")
          return cb();
        return cb(null, c, stat);
      };
    }
  });
  var require_lib = __commonJS2({
    "node_modules/glob-promise/lib/index.js"(exports2, module2) {
      var glob2 = require_glob();
      var promise = function(pattern, options) {
        return new Promise((resolve, reject) => {
          glob2(pattern, options, (err, files) => err === null ? resolve(files) : reject(err));
        });
      };
      module2.exports = promise;
      module2.exports.glob = glob2;
      module2.exports.Glob = glob2.Glob;
      module2.exports.hasMagic = glob2.hasMagic;
      module2.exports.promise = promise;
      module2.exports.sync = glob2.sync;
    }
  });
  var src_exports = {};
  __export2(src_exports, {
    getMatchingFilePaths: () => getMatchingFilePaths,
    getVirtualFileSystemFromDirPath: () => getVirtualFileSystemFromDirPath,
    getVirtualFilesystemModuleFromDirPath: () => getVirtualFilesystemModuleFromDirPath
  });
  module.exports = __toCommonJS(src_exports);
  var import_glob_promise = __toESM2(require_lib());
  var import_path = __toESM2(__require("path"));
  var import_promises = __toESM2(__require("fs/promises"));
  var charsSafeToLeaveEncoded = "{}.,<>?/:'[]!@#$^&*() -_=+".split("");
  var replaceSafeEncodedChars = (s) => {
    for (const char of charsSafeToLeaveEncoded) {
      if (char === encodeURIComponent(char))
        continue;
      s = s.replace(new RegExp(encodeURIComponent(char), "g"), char);
    }
    return s;
  };
  function idsafe(s) {
    return "_" + s.replace(/[^a-zA-Z0-9]/g, "_");
  }
  var toPosixPath = (pathStr) => {
    if (!pathStr)
      return pathStr;
    pathStr = pathStr.replace(/^[A-Za-z]:/, "");
    return pathStr.split(import_path.default.sep).join("/");
  };
  var getMatchingFilePaths = async ({
    dirPath,
    extensions,
    fileMatchFn
  }) => {
    if (extensions && fileMatchFn)
      throw new Error(`Cannot provide extensions and fileMatchFn`);
    if (extensions) {
      fileMatchFn = (filename) => extensions.some((ext) => filename.endsWith(`.${ext}`));
    }
    if (!fileMatchFn)
      fileMatchFn = () => true;
    const files = await (0, import_glob_promise.default)("**/*", {
      cwd: dirPath,
      nodir: true,
      dot: true,
      absolute: false,
      windowsPathsNoEscape: true
    });
    return files.map((f) => toPosixPath(f)).filter((filename) => fileMatchFn(filename, import_path.default.join(dirPath, filename)));
  };
  var getVirtualFileSystemFromDirPath = async (opts) => {
    const { dirPath, contentFormat = "string" } = opts;
    const filePaths = await getMatchingFilePaths(opts);
    const vfs = {};
    for (const filePath of filePaths) {
      const fullPath = import_path.default.join(dirPath, filePath);
      const content = await import_promises.default.readFile(fullPath);
      const normalizedPath = toPosixPath(filePath);
      vfs[normalizedPath] = content.toString();
    }
    return vfs;
  };
  var getVirtualFilesystemModuleFromDirPath = async (opts) => {
    const vfs = await getVirtualFileSystemFromDirPath(opts);
    const cf = opts.contentFormat;
    switch (cf ?? "buffer") {
      case "buffer":
      case "string": {
        return `export default {
` + Object.entries(vfs).map(([filePath, content]) => cf === "buffer" ? `  "${toPosixPath(filePath)}": Buffer.from("${content.toString("base64")}", "base64")` : `  "${toPosixPath(filePath)}": decodeURIComponent("${replaceSafeEncodedChars(encodeURIComponent(content.toString()))}")`).join(`,
`) + `
}`;
      }
      case "require":
      case "import-default":
      case "import-star": {
        if (!opts.targetPath)
          throw new Error(`targetPath is required when using content-format of require,import-default,import-star`);
        const basePath = import_path.default.relative(import_path.default.dirname(opts.targetPath), opts.dirPath);
        let fps = Object.keys(vfs);
        if (opts.noImportExt) {
          fps = fps.map((fp) => fp.replace(/\.[^.]+$/, ""));
        }
        return `${fps.map((fp) => cf === "require" ? `const ${idsafe(fp)} = require("./${import_path.default.join(basePath, fp)}")` : cf === "import-default" ? `import ${idsafe(fp)} from "./${import_path.default.join(basePath, fp)}"` : `import * as ${idsafe(fp)} from "./${import_path.default.join(basePath, fp)}"`).join(`
`)}

export default {
` + fps.map((fp) => `  "${fp}": ${idsafe(fp)}`).join(`,
`) + `
}`;
      }
      case "arraybuffer": {
        throw new Error(`arraybuffer not yet implemented, contributions welcome`);
      }
      case "export-pathlist": {
        return `export default [
` + Object.keys(vfs).map((path2) => `  "${path2}"`).join(`,
`) + `
]`;
      }
      case "import-bunfile": {
        if (!opts.targetPath)
          throw new Error(`targetPath is required when using content-format of require,import-default,import-star`);
        const basePath = import_path.default.relative(import_path.default.dirname(opts.targetPath), opts.dirPath);
        let fps = Object.keys(vfs);
        return `${fps.map((fp) => `import ${idsafe(fp)} from "./${import_path.default.join(basePath, fp)}" with { type: "file" };`).join(`
`)}

import { file } from "bun";

export default {
` + fps.map((fp) => `  "${fp}": file(${idsafe(fp)})`).join(`,
`) + `
}`;
      }
    }
    throw new Error(`Unknown content format: ${cf}`);
  };
});

// node_modules/ajv/dist/compile/codegen/code.js
var require_code = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = undefined;

  class _CodeOrName {
  }
  exports._CodeOrName = _CodeOrName;
  exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;

  class Name extends _CodeOrName {
    constructor(s) {
      super();
      if (!exports.IDENTIFIER.test(s))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = s;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return false;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  exports.Name = Name;

  class _Code extends _CodeOrName {
    constructor(code) {
      super();
      this._items = typeof code === "string" ? [code] : code;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return false;
      const item = this._items[0];
      return item === "" || item === '""';
    }
    get str() {
      var _a;
      return (_a = this._str) !== null && _a !== undefined ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
    }
    get names() {
      var _a;
      return (_a = this._names) !== null && _a !== undefined ? _a : this._names = this._items.reduce((names, c) => {
        if (c instanceof Name)
          names[c.str] = (names[c.str] || 0) + 1;
        return names;
      }, {});
    }
  }
  exports._Code = _Code;
  exports.nil = new _Code("");
  function _(strs, ...args) {
    const code = [strs[0]];
    let i = 0;
    while (i < args.length) {
      addCodeArg(code, args[i]);
      code.push(strs[++i]);
    }
    return new _Code(code);
  }
  exports._ = _;
  var plus = new _Code("+");
  function str(strs, ...args) {
    const expr = [safeStringify(strs[0])];
    let i = 0;
    while (i < args.length) {
      expr.push(plus);
      addCodeArg(expr, args[i]);
      expr.push(plus, safeStringify(strs[++i]));
    }
    optimize(expr);
    return new _Code(expr);
  }
  exports.str = str;
  function addCodeArg(code, arg) {
    if (arg instanceof _Code)
      code.push(...arg._items);
    else if (arg instanceof Name)
      code.push(arg);
    else
      code.push(interpolate(arg));
  }
  exports.addCodeArg = addCodeArg;
  function optimize(expr) {
    let i = 1;
    while (i < expr.length - 1) {
      if (expr[i] === plus) {
        const res = mergeExprItems(expr[i - 1], expr[i + 1]);
        if (res !== undefined) {
          expr.splice(i - 1, 3, res);
          continue;
        }
        expr[i++] = "+";
      }
      i++;
    }
  }
  function mergeExprItems(a, b) {
    if (b === '""')
      return a;
    if (a === '""')
      return b;
    if (typeof a == "string") {
      if (b instanceof Name || a[a.length - 1] !== '"')
        return;
      if (typeof b != "string")
        return `${a.slice(0, -1)}${b}"`;
      if (b[0] === '"')
        return a.slice(0, -1) + b.slice(1);
      return;
    }
    if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
      return `"${a}${b.slice(1)}`;
    return;
  }
  function strConcat(c1, c2) {
    return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
  }
  exports.strConcat = strConcat;
  function interpolate(x) {
    return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
  }
  function stringify(x) {
    return new _Code(safeStringify(x));
  }
  exports.stringify = stringify;
  function safeStringify(x) {
    return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  exports.safeStringify = safeStringify;
  function getProperty2(key) {
    return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
  }
  exports.getProperty = getProperty2;
  function getEsmExportName(key) {
    if (typeof key == "string" && exports.IDENTIFIER.test(key)) {
      return new _Code(`${key}`);
    }
    throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
  }
  exports.getEsmExportName = getEsmExportName;
  function regexpCode(rx) {
    return new _Code(rx.toString());
  }
  exports.regexpCode = regexpCode;
});

// node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = undefined;
  var code_1 = require_code();

  class ValueError extends Error {
    constructor(name) {
      super(`CodeGen: "code" for ${name} not defined`);
      this.value = name.value;
    }
  }
  var UsedValueState;
  (function(UsedValueState2) {
    UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
    UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
  })(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
  exports.varKinds = {
    const: new code_1.Name("const"),
    let: new code_1.Name("let"),
    var: new code_1.Name("var")
  };

  class Scope {
    constructor({ prefixes, parent } = {}) {
      this._names = {};
      this._prefixes = prefixes;
      this._parent = parent;
    }
    toName(nameOrPrefix) {
      return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
    }
    name(prefix) {
      return new code_1.Name(this._newName(prefix));
    }
    _newName(prefix) {
      const ng = this._names[prefix] || this._nameGroup(prefix);
      return `${prefix}${ng.index++}`;
    }
    _nameGroup(prefix) {
      var _a, _b;
      if (((_b = (_a = this._parent) === null || _a === undefined ? undefined : _a._prefixes) === null || _b === undefined ? undefined : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) {
        throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
      }
      return this._names[prefix] = { prefix, index: 0 };
    }
  }
  exports.Scope = Scope;

  class ValueScopeName extends code_1.Name {
    constructor(prefix, nameStr) {
      super(nameStr);
      this.prefix = prefix;
    }
    setValue(value, { property, itemIndex }) {
      this.value = value;
      this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
    }
  }
  exports.ValueScopeName = ValueScopeName;
  var line = (0, code_1._)`\n`;

  class ValueScope extends Scope {
    constructor(opts) {
      super(opts);
      this._values = {};
      this._scope = opts.scope;
      this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
    }
    get() {
      return this._scope;
    }
    name(prefix) {
      return new ValueScopeName(prefix, this._newName(prefix));
    }
    value(nameOrPrefix, value) {
      var _a;
      if (value.ref === undefined)
        throw new Error("CodeGen: ref must be passed in value");
      const name = this.toName(nameOrPrefix);
      const { prefix } = name;
      const valueKey = (_a = value.key) !== null && _a !== undefined ? _a : value.ref;
      let vs = this._values[prefix];
      if (vs) {
        const _name = vs.get(valueKey);
        if (_name)
          return _name;
      } else {
        vs = this._values[prefix] = new Map;
      }
      vs.set(valueKey, name);
      const s = this._scope[prefix] || (this._scope[prefix] = []);
      const itemIndex = s.length;
      s[itemIndex] = value.ref;
      name.setValue(value, { property: prefix, itemIndex });
      return name;
    }
    getValue(prefix, keyOrRef) {
      const vs = this._values[prefix];
      if (!vs)
        return;
      return vs.get(keyOrRef);
    }
    scopeRefs(scopeName, values = this._values) {
      return this._reduceValues(values, (name) => {
        if (name.scopePath === undefined)
          throw new Error(`CodeGen: name "${name}" has no value`);
        return (0, code_1._)`${scopeName}${name.scopePath}`;
      });
    }
    scopeCode(values = this._values, usedValues, getCode) {
      return this._reduceValues(values, (name) => {
        if (name.value === undefined)
          throw new Error(`CodeGen: name "${name}" has no value`);
        return name.value.code;
      }, usedValues, getCode);
    }
    _reduceValues(values, valueCode, usedValues = {}, getCode) {
      let code = code_1.nil;
      for (const prefix in values) {
        const vs = values[prefix];
        if (!vs)
          continue;
        const nameSet = usedValues[prefix] = usedValues[prefix] || new Map;
        vs.forEach((name) => {
          if (nameSet.has(name))
            return;
          nameSet.set(name, UsedValueState.Started);
          let c = valueCode(name);
          if (c) {
            const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
            code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
          } else if (c = getCode === null || getCode === undefined ? undefined : getCode(name)) {
            code = (0, code_1._)`${code}${c}${this.opts._n}`;
          } else {
            throw new ValueError(name);
          }
          nameSet.set(name, UsedValueState.Completed);
        });
      }
      return code;
    }
  }
  exports.ValueScope = ValueScope;
});

// node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = undefined;
  var code_1 = require_code();
  var scope_1 = require_scope();
  var code_2 = require_code();
  Object.defineProperty(exports, "_", { enumerable: true, get: function() {
    return code_2._;
  } });
  Object.defineProperty(exports, "str", { enumerable: true, get: function() {
    return code_2.str;
  } });
  Object.defineProperty(exports, "strConcat", { enumerable: true, get: function() {
    return code_2.strConcat;
  } });
  Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
    return code_2.nil;
  } });
  Object.defineProperty(exports, "getProperty", { enumerable: true, get: function() {
    return code_2.getProperty;
  } });
  Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
    return code_2.stringify;
  } });
  Object.defineProperty(exports, "regexpCode", { enumerable: true, get: function() {
    return code_2.regexpCode;
  } });
  Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
    return code_2.Name;
  } });
  var scope_2 = require_scope();
  Object.defineProperty(exports, "Scope", { enumerable: true, get: function() {
    return scope_2.Scope;
  } });
  Object.defineProperty(exports, "ValueScope", { enumerable: true, get: function() {
    return scope_2.ValueScope;
  } });
  Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: function() {
    return scope_2.ValueScopeName;
  } });
  Object.defineProperty(exports, "varKinds", { enumerable: true, get: function() {
    return scope_2.varKinds;
  } });
  exports.operators = {
    GT: new code_1._Code(">"),
    GTE: new code_1._Code(">="),
    LT: new code_1._Code("<"),
    LTE: new code_1._Code("<="),
    EQ: new code_1._Code("==="),
    NEQ: new code_1._Code("!=="),
    NOT: new code_1._Code("!"),
    OR: new code_1._Code("||"),
    AND: new code_1._Code("&&"),
    ADD: new code_1._Code("+")
  };

  class Node {
    optimizeNodes() {
      return this;
    }
    optimizeNames(_names, _constants) {
      return this;
    }
  }

  class Def extends Node {
    constructor(varKind, name, rhs) {
      super();
      this.varKind = varKind;
      this.name = name;
      this.rhs = rhs;
    }
    render({ es5, _n }) {
      const varKind = es5 ? scope_1.varKinds.var : this.varKind;
      const rhs = this.rhs === undefined ? "" : ` = ${this.rhs}`;
      return `${varKind} ${this.name}${rhs};` + _n;
    }
    optimizeNames(names, constants) {
      if (!names[this.name.str])
        return;
      if (this.rhs)
        this.rhs = optimizeExpr(this.rhs, names, constants);
      return this;
    }
    get names() {
      return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
    }
  }

  class Assign extends Node {
    constructor(lhs, rhs, sideEffects) {
      super();
      this.lhs = lhs;
      this.rhs = rhs;
      this.sideEffects = sideEffects;
    }
    render({ _n }) {
      return `${this.lhs} = ${this.rhs};` + _n;
    }
    optimizeNames(names, constants) {
      if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
        return;
      this.rhs = optimizeExpr(this.rhs, names, constants);
      return this;
    }
    get names() {
      const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
      return addExprNames(names, this.rhs);
    }
  }

  class AssignOp extends Assign {
    constructor(lhs, op, rhs, sideEffects) {
      super(lhs, rhs, sideEffects);
      this.op = op;
    }
    render({ _n }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
    }
  }

  class Label extends Node {
    constructor(label) {
      super();
      this.label = label;
      this.names = {};
    }
    render({ _n }) {
      return `${this.label}:` + _n;
    }
  }

  class Break extends Node {
    constructor(label) {
      super();
      this.label = label;
      this.names = {};
    }
    render({ _n }) {
      const label = this.label ? ` ${this.label}` : "";
      return `break${label};` + _n;
    }
  }

  class Throw extends Node {
    constructor(error) {
      super();
      this.error = error;
    }
    render({ _n }) {
      return `throw ${this.error};` + _n;
    }
    get names() {
      return this.error.names;
    }
  }

  class AnyCode extends Node {
    constructor(code) {
      super();
      this.code = code;
    }
    render({ _n }) {
      return `${this.code};` + _n;
    }
    optimizeNodes() {
      return `${this.code}` ? this : undefined;
    }
    optimizeNames(names, constants) {
      this.code = optimizeExpr(this.code, names, constants);
      return this;
    }
    get names() {
      return this.code instanceof code_1._CodeOrName ? this.code.names : {};
    }
  }

  class ParentNode extends Node {
    constructor(nodes = []) {
      super();
      this.nodes = nodes;
    }
    render(opts) {
      return this.nodes.reduce((code, n) => code + n.render(opts), "");
    }
    optimizeNodes() {
      const { nodes } = this;
      let i = nodes.length;
      while (i--) {
        const n = nodes[i].optimizeNodes();
        if (Array.isArray(n))
          nodes.splice(i, 1, ...n);
        else if (n)
          nodes[i] = n;
        else
          nodes.splice(i, 1);
      }
      return nodes.length > 0 ? this : undefined;
    }
    optimizeNames(names, constants) {
      const { nodes } = this;
      let i = nodes.length;
      while (i--) {
        const n = nodes[i];
        if (n.optimizeNames(names, constants))
          continue;
        subtractNames(names, n.names);
        nodes.splice(i, 1);
      }
      return nodes.length > 0 ? this : undefined;
    }
    get names() {
      return this.nodes.reduce((names, n) => addNames(names, n.names), {});
    }
  }

  class BlockNode extends ParentNode {
    render(opts) {
      return "{" + opts._n + super.render(opts) + "}" + opts._n;
    }
  }

  class Root extends ParentNode {
  }

  class Else extends BlockNode {
  }
  Else.kind = "else";

  class If extends BlockNode {
    constructor(condition, nodes) {
      super(nodes);
      this.condition = condition;
    }
    render(opts) {
      let code = `if(${this.condition})` + super.render(opts);
      if (this.else)
        code += "else " + this.else.render(opts);
      return code;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const cond = this.condition;
      if (cond === true)
        return this.nodes;
      let e = this.else;
      if (e) {
        const ns = e.optimizeNodes();
        e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
      }
      if (e) {
        if (cond === false)
          return e instanceof If ? e : e.nodes;
        if (this.nodes.length)
          return this;
        return new If(not(cond), e instanceof If ? [e] : e.nodes);
      }
      if (cond === false || !this.nodes.length)
        return;
      return this;
    }
    optimizeNames(names, constants) {
      var _a;
      this.else = (_a = this.else) === null || _a === undefined ? undefined : _a.optimizeNames(names, constants);
      if (!(super.optimizeNames(names, constants) || this.else))
        return;
      this.condition = optimizeExpr(this.condition, names, constants);
      return this;
    }
    get names() {
      const names = super.names;
      addExprNames(names, this.condition);
      if (this.else)
        addNames(names, this.else.names);
      return names;
    }
  }
  If.kind = "if";

  class For extends BlockNode {
  }
  For.kind = "for";

  class ForLoop extends For {
    constructor(iteration) {
      super();
      this.iteration = iteration;
    }
    render(opts) {
      return `for(${this.iteration})` + super.render(opts);
    }
    optimizeNames(names, constants) {
      if (!super.optimizeNames(names, constants))
        return;
      this.iteration = optimizeExpr(this.iteration, names, constants);
      return this;
    }
    get names() {
      return addNames(super.names, this.iteration.names);
    }
  }

  class ForRange extends For {
    constructor(varKind, name, from, to) {
      super();
      this.varKind = varKind;
      this.name = name;
      this.from = from;
      this.to = to;
    }
    render(opts) {
      const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
      const { name, from, to } = this;
      return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
    }
    get names() {
      const names = addExprNames(super.names, this.from);
      return addExprNames(names, this.to);
    }
  }

  class ForIter extends For {
    constructor(loop, varKind, name, iterable) {
      super();
      this.loop = loop;
      this.varKind = varKind;
      this.name = name;
      this.iterable = iterable;
    }
    render(opts) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
    }
    optimizeNames(names, constants) {
      if (!super.optimizeNames(names, constants))
        return;
      this.iterable = optimizeExpr(this.iterable, names, constants);
      return this;
    }
    get names() {
      return addNames(super.names, this.iterable.names);
    }
  }

  class Func extends BlockNode {
    constructor(name, args, async) {
      super();
      this.name = name;
      this.args = args;
      this.async = async;
    }
    render(opts) {
      const _async = this.async ? "async " : "";
      return `${_async}function ${this.name}(${this.args})` + super.render(opts);
    }
  }
  Func.kind = "func";

  class Return extends ParentNode {
    render(opts) {
      return "return " + super.render(opts);
    }
  }
  Return.kind = "return";

  class Try extends BlockNode {
    render(opts) {
      let code = "try" + super.render(opts);
      if (this.catch)
        code += this.catch.render(opts);
      if (this.finally)
        code += this.finally.render(opts);
      return code;
    }
    optimizeNodes() {
      var _a, _b;
      super.optimizeNodes();
      (_a = this.catch) === null || _a === undefined || _a.optimizeNodes();
      (_b = this.finally) === null || _b === undefined || _b.optimizeNodes();
      return this;
    }
    optimizeNames(names, constants) {
      var _a, _b;
      super.optimizeNames(names, constants);
      (_a = this.catch) === null || _a === undefined || _a.optimizeNames(names, constants);
      (_b = this.finally) === null || _b === undefined || _b.optimizeNames(names, constants);
      return this;
    }
    get names() {
      const names = super.names;
      if (this.catch)
        addNames(names, this.catch.names);
      if (this.finally)
        addNames(names, this.finally.names);
      return names;
    }
  }

  class Catch extends BlockNode {
    constructor(error) {
      super();
      this.error = error;
    }
    render(opts) {
      return `catch(${this.error})` + super.render(opts);
    }
  }
  Catch.kind = "catch";

  class Finally extends BlockNode {
    render(opts) {
      return "finally" + super.render(opts);
    }
  }
  Finally.kind = "finally";

  class CodeGen {
    constructor(extScope, opts = {}) {
      this._values = {};
      this._blockStarts = [];
      this._constants = {};
      this.opts = { ...opts, _n: opts.lines ? `
` : "" };
      this._extScope = extScope;
      this._scope = new scope_1.Scope({ parent: extScope });
      this._nodes = [new Root];
    }
    toString() {
      return this._root.render(this.opts);
    }
    name(prefix) {
      return this._scope.name(prefix);
    }
    scopeName(prefix) {
      return this._extScope.name(prefix);
    }
    scopeValue(prefixOrName, value) {
      const name = this._extScope.value(prefixOrName, value);
      const vs = this._values[name.prefix] || (this._values[name.prefix] = new Set);
      vs.add(name);
      return name;
    }
    getScopeValue(prefix, keyOrRef) {
      return this._extScope.getValue(prefix, keyOrRef);
    }
    scopeRefs(scopeName) {
      return this._extScope.scopeRefs(scopeName, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(varKind, nameOrPrefix, rhs, constant) {
      const name = this._scope.toName(nameOrPrefix);
      if (rhs !== undefined && constant)
        this._constants[name.str] = rhs;
      this._leafNode(new Def(varKind, name, rhs));
      return name;
    }
    const(nameOrPrefix, rhs, _constant) {
      return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
    }
    let(nameOrPrefix, rhs, _constant) {
      return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
    }
    var(nameOrPrefix, rhs, _constant) {
      return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
    }
    assign(lhs, rhs, sideEffects) {
      return this._leafNode(new Assign(lhs, rhs, sideEffects));
    }
    add(lhs, rhs) {
      return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
    }
    code(c) {
      if (typeof c == "function")
        c();
      else if (c !== code_1.nil)
        this._leafNode(new AnyCode(c));
      return this;
    }
    object(...keyValues) {
      const code = ["{"];
      for (const [key, value] of keyValues) {
        if (code.length > 1)
          code.push(",");
        code.push(key);
        if (key !== value || this.opts.es5) {
          code.push(":");
          (0, code_1.addCodeArg)(code, value);
        }
      }
      code.push("}");
      return new code_1._Code(code);
    }
    if(condition, thenBody, elseBody) {
      this._blockNode(new If(condition));
      if (thenBody && elseBody) {
        this.code(thenBody).else().code(elseBody).endIf();
      } else if (thenBody) {
        this.code(thenBody).endIf();
      } else if (elseBody) {
        throw new Error('CodeGen: "else" body without "then" body');
      }
      return this;
    }
    elseIf(condition) {
      return this._elseNode(new If(condition));
    }
    else() {
      return this._elseNode(new Else);
    }
    endIf() {
      return this._endBlockNode(If, Else);
    }
    _for(node, forBody) {
      this._blockNode(node);
      if (forBody)
        this.code(forBody).endFor();
      return this;
    }
    for(iteration, forBody) {
      return this._for(new ForLoop(iteration), forBody);
    }
    forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
      const name = this._scope.toName(nameOrPrefix);
      return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
    }
    forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
      const name = this._scope.toName(nameOrPrefix);
      if (this.opts.es5) {
        const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
        return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
          this.var(name, (0, code_1._)`${arr}[${i}]`);
          forBody(name);
        });
      }
      return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
    }
    forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
      if (this.opts.ownProperties) {
        return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
      }
      const name = this._scope.toName(nameOrPrefix);
      return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
    }
    endFor() {
      return this._endBlockNode(For);
    }
    label(label) {
      return this._leafNode(new Label(label));
    }
    break(label) {
      return this._leafNode(new Break(label));
    }
    return(value) {
      const node = new Return;
      this._blockNode(node);
      this.code(value);
      if (node.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(Return);
    }
    try(tryBody, catchCode, finallyCode) {
      if (!catchCode && !finallyCode)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const node = new Try;
      this._blockNode(node);
      this.code(tryBody);
      if (catchCode) {
        const error = this.name("e");
        this._currNode = node.catch = new Catch(error);
        catchCode(error);
      }
      if (finallyCode) {
        this._currNode = node.finally = new Finally;
        this.code(finallyCode);
      }
      return this._endBlockNode(Catch, Finally);
    }
    throw(error) {
      return this._leafNode(new Throw(error));
    }
    block(body, nodeCount) {
      this._blockStarts.push(this._nodes.length);
      if (body)
        this.code(body).endBlock(nodeCount);
      return this;
    }
    endBlock(nodeCount) {
      const len = this._blockStarts.pop();
      if (len === undefined)
        throw new Error("CodeGen: not in self-balancing block");
      const toClose = this._nodes.length - len;
      if (toClose < 0 || nodeCount !== undefined && toClose !== nodeCount) {
        throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
      }
      this._nodes.length = len;
      return this;
    }
    func(name, args = code_1.nil, async, funcBody) {
      this._blockNode(new Func(name, args, async));
      if (funcBody)
        this.code(funcBody).endFunc();
      return this;
    }
    endFunc() {
      return this._endBlockNode(Func);
    }
    optimize(n = 1) {
      while (n-- > 0) {
        this._root.optimizeNodes();
        this._root.optimizeNames(this._root.names, this._constants);
      }
    }
    _leafNode(node) {
      this._currNode.nodes.push(node);
      return this;
    }
    _blockNode(node) {
      this._currNode.nodes.push(node);
      this._nodes.push(node);
    }
    _endBlockNode(N1, N2) {
      const n = this._currNode;
      if (n instanceof N1 || N2 && n instanceof N2) {
        this._nodes.pop();
        return this;
      }
      throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
    }
    _elseNode(node) {
      const n = this._currNode;
      if (!(n instanceof If)) {
        throw new Error('CodeGen: "else" without "if"');
      }
      this._currNode = n.else = node;
      return this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const ns = this._nodes;
      return ns[ns.length - 1];
    }
    set _currNode(node) {
      const ns = this._nodes;
      ns[ns.length - 1] = node;
    }
  }
  exports.CodeGen = CodeGen;
  function addNames(names, from) {
    for (const n in from)
      names[n] = (names[n] || 0) + (from[n] || 0);
    return names;
  }
  function addExprNames(names, from) {
    return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
  }
  function optimizeExpr(expr, names, constants) {
    if (expr instanceof code_1.Name)
      return replaceName(expr);
    if (!canOptimize(expr))
      return expr;
    return new code_1._Code(expr._items.reduce((items, c) => {
      if (c instanceof code_1.Name)
        c = replaceName(c);
      if (c instanceof code_1._Code)
        items.push(...c._items);
      else
        items.push(c);
      return items;
    }, []));
    function replaceName(n) {
      const c = constants[n.str];
      if (c === undefined || names[n.str] !== 1)
        return n;
      delete names[n.str];
      return c;
    }
    function canOptimize(e) {
      return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== undefined);
    }
  }
  function subtractNames(names, from) {
    for (const n in from)
      names[n] = (names[n] || 0) - (from[n] || 0);
  }
  function not(x) {
    return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
  }
  exports.not = not;
  var andCode = mappend(exports.operators.AND);
  function and(...args) {
    return args.reduce(andCode);
  }
  exports.and = and;
  var orCode = mappend(exports.operators.OR);
  function or(...args) {
    return args.reduce(orCode);
  }
  exports.or = or;
  function mappend(op) {
    return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
  }
  function par(x) {
    return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
  }
});

// node_modules/ajv/dist/compile/util.js
var require_util = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = undefined;
  var codegen_1 = require_codegen();
  var code_1 = require_code();
  function toHash(arr) {
    const hash = {};
    for (const item of arr)
      hash[item] = true;
    return hash;
  }
  exports.toHash = toHash;
  function alwaysValidSchema(it, schema) {
    if (typeof schema == "boolean")
      return schema;
    if (Object.keys(schema).length === 0)
      return true;
    checkUnknownRules(it, schema);
    return !schemaHasRules(schema, it.self.RULES.all);
  }
  exports.alwaysValidSchema = alwaysValidSchema;
  function checkUnknownRules(it, schema = it.schema) {
    const { opts, self } = it;
    if (!opts.strictSchema)
      return;
    if (typeof schema === "boolean")
      return;
    const rules = self.RULES.keywords;
    for (const key in schema) {
      if (!rules[key])
        checkStrictMode(it, `unknown keyword: "${key}"`);
    }
  }
  exports.checkUnknownRules = checkUnknownRules;
  function schemaHasRules(schema, rules) {
    if (typeof schema == "boolean")
      return !schema;
    for (const key in schema)
      if (rules[key])
        return true;
    return false;
  }
  exports.schemaHasRules = schemaHasRules;
  function schemaHasRulesButRef(schema, RULES) {
    if (typeof schema == "boolean")
      return !schema;
    for (const key in schema)
      if (key !== "$ref" && RULES.all[key])
        return true;
    return false;
  }
  exports.schemaHasRulesButRef = schemaHasRulesButRef;
  function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
    if (!$data) {
      if (typeof schema == "number" || typeof schema == "boolean")
        return schema;
      if (typeof schema == "string")
        return (0, codegen_1._)`${schema}`;
    }
    return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
  }
  exports.schemaRefOrVal = schemaRefOrVal;
  function unescapeFragment(str) {
    return unescapeJsonPointer(decodeURIComponent(str));
  }
  exports.unescapeFragment = unescapeFragment;
  function escapeFragment(str) {
    return encodeURIComponent(escapeJsonPointer(str));
  }
  exports.escapeFragment = escapeFragment;
  function escapeJsonPointer(str) {
    if (typeof str == "number")
      return `${str}`;
    return str.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  exports.escapeJsonPointer = escapeJsonPointer;
  function unescapeJsonPointer(str) {
    return str.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  exports.unescapeJsonPointer = unescapeJsonPointer;
  function eachItem(xs, f) {
    if (Array.isArray(xs)) {
      for (const x of xs)
        f(x);
    } else {
      f(xs);
    }
  }
  exports.eachItem = eachItem;
  function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
    return (gen, from, to, toName) => {
      const res = to === undefined ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
      return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
    };
  }
  exports.mergeEvaluated = {
    props: makeMergeEvaluated({
      mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
        gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
      }),
      mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
        if (from === true) {
          gen.assign(to, true);
        } else {
          gen.assign(to, (0, codegen_1._)`${to} || {}`);
          setEvaluated(gen, to, from);
        }
      }),
      mergeValues: (from, to) => from === true ? true : { ...from, ...to },
      resultToName: evaluatedPropsToName
    }),
    items: makeMergeEvaluated({
      mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
      mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
      mergeValues: (from, to) => from === true ? true : Math.max(from, to),
      resultToName: (gen, items) => gen.var("items", items)
    })
  };
  function evaluatedPropsToName(gen, ps) {
    if (ps === true)
      return gen.var("props", true);
    const props = gen.var("props", (0, codegen_1._)`{}`);
    if (ps !== undefined)
      setEvaluated(gen, props, ps);
    return props;
  }
  exports.evaluatedPropsToName = evaluatedPropsToName;
  function setEvaluated(gen, props, ps) {
    Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
  }
  exports.setEvaluated = setEvaluated;
  var snippets = {};
  function useFunc(gen, f) {
    return gen.scopeValue("func", {
      ref: f,
      code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
    });
  }
  exports.useFunc = useFunc;
  var Type;
  (function(Type2) {
    Type2[Type2["Num"] = 0] = "Num";
    Type2[Type2["Str"] = 1] = "Str";
  })(Type || (exports.Type = Type = {}));
  function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
    if (dataProp instanceof codegen_1.Name) {
      const isNumber = dataPropType === Type.Num;
      return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
  }
  exports.getErrorPath = getErrorPath;
  function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
    if (!mode)
      return;
    msg = `strict mode: ${msg}`;
    if (mode === true)
      throw new Error(msg);
    it.self.logger.warn(msg);
  }
  exports.checkStrictMode = checkStrictMode;
});

// node_modules/ajv/dist/compile/names.js
var require_names = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var names = {
    data: new codegen_1.Name("data"),
    valCxt: new codegen_1.Name("valCxt"),
    instancePath: new codegen_1.Name("instancePath"),
    parentData: new codegen_1.Name("parentData"),
    parentDataProperty: new codegen_1.Name("parentDataProperty"),
    rootData: new codegen_1.Name("rootData"),
    dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
    vErrors: new codegen_1.Name("vErrors"),
    errors: new codegen_1.Name("errors"),
    this: new codegen_1.Name("this"),
    self: new codegen_1.Name("self"),
    scope: new codegen_1.Name("scope"),
    json: new codegen_1.Name("json"),
    jsonPos: new codegen_1.Name("jsonPos"),
    jsonLen: new codegen_1.Name("jsonLen"),
    jsonPart: new codegen_1.Name("jsonPart")
  };
  exports.default = names;
});

// node_modules/ajv/dist/compile/errors.js
var require_errors = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = undefined;
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var names_1 = require_names();
  exports.keywordError = {
    message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
  };
  exports.keyword$DataError = {
    message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
  };
  function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
    const { it } = cxt;
    const { gen, compositeRule, allErrors } = it;
    const errObj = errorObjectCode(cxt, error, errorPaths);
    if (overrideAllErrors !== null && overrideAllErrors !== undefined ? overrideAllErrors : compositeRule || allErrors) {
      addError(gen, errObj);
    } else {
      returnErrors(it, (0, codegen_1._)`[${errObj}]`);
    }
  }
  exports.reportError = reportError;
  function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
    const { it } = cxt;
    const { gen, compositeRule, allErrors } = it;
    const errObj = errorObjectCode(cxt, error, errorPaths);
    addError(gen, errObj);
    if (!(compositeRule || allErrors)) {
      returnErrors(it, names_1.default.vErrors);
    }
  }
  exports.reportExtraError = reportExtraError;
  function resetErrorsCount(gen, errsCount) {
    gen.assign(names_1.default.errors, errsCount);
    gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
  }
  exports.resetErrorsCount = resetErrorsCount;
  function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
    if (errsCount === undefined)
      throw new Error("ajv implementation error");
    const err = gen.name("err");
    gen.forRange("i", errsCount, names_1.default.errors, (i) => {
      gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
      gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
      gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
      if (it.opts.verbose) {
        gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
        gen.assign((0, codegen_1._)`${err}.data`, data);
      }
    });
  }
  exports.extendErrors = extendErrors;
  function addError(gen, errObj) {
    const err = gen.const("err", errObj);
    gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
    gen.code((0, codegen_1._)`${names_1.default.errors}++`);
  }
  function returnErrors(it, errs) {
    const { gen, validateName, schemaEnv } = it;
    if (schemaEnv.$async) {
      gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
    } else {
      gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
      gen.return(false);
    }
  }
  var E = {
    keyword: new codegen_1.Name("keyword"),
    schemaPath: new codegen_1.Name("schemaPath"),
    params: new codegen_1.Name("params"),
    propertyName: new codegen_1.Name("propertyName"),
    message: new codegen_1.Name("message"),
    schema: new codegen_1.Name("schema"),
    parentSchema: new codegen_1.Name("parentSchema")
  };
  function errorObjectCode(cxt, error, errorPaths) {
    const { createErrors } = cxt.it;
    if (createErrors === false)
      return (0, codegen_1._)`{}`;
    return errorObject(cxt, error, errorPaths);
  }
  function errorObject(cxt, error, errorPaths = {}) {
    const { gen, it } = cxt;
    const keyValues = [
      errorInstancePath(it, errorPaths),
      errorSchemaPath(cxt, errorPaths)
    ];
    extraErrorProps(cxt, error, keyValues);
    return gen.object(...keyValues);
  }
  function errorInstancePath({ errorPath }, { instancePath }) {
    const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
    return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
  }
  function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
    let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
    if (schemaPath) {
      schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
    }
    return [E.schemaPath, schPath];
  }
  function extraErrorProps(cxt, { params, message }, keyValues) {
    const { keyword, data, schemaValue, it } = cxt;
    const { opts, propertyName, topSchemaRef, schemaPath } = it;
    keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
    if (opts.messages) {
      keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
    }
    if (opts.verbose) {
      keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
    }
    if (propertyName)
      keyValues.push([E.propertyName, propertyName]);
  }
});

// node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = undefined;
  var errors_1 = require_errors();
  var codegen_1 = require_codegen();
  var names_1 = require_names();
  var boolError = {
    message: "boolean schema is false"
  };
  function topBoolOrEmptySchema(it) {
    const { gen, schema, validateName } = it;
    if (schema === false) {
      falseSchemaError(it, false);
    } else if (typeof schema == "object" && schema.$async === true) {
      gen.return(names_1.default.data);
    } else {
      gen.assign((0, codegen_1._)`${validateName}.errors`, null);
      gen.return(true);
    }
  }
  exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
  function boolOrEmptySchema(it, valid) {
    const { gen, schema } = it;
    if (schema === false) {
      gen.var(valid, false);
      falseSchemaError(it);
    } else {
      gen.var(valid, true);
    }
  }
  exports.boolOrEmptySchema = boolOrEmptySchema;
  function falseSchemaError(it, overrideAllErrors) {
    const { gen, data } = it;
    const cxt = {
      gen,
      keyword: "false schema",
      data,
      schema: false,
      schemaCode: false,
      schemaValue: false,
      params: {},
      it
    };
    (0, errors_1.reportError)(cxt, boolError, undefined, overrideAllErrors);
  }
});

// node_modules/ajv/dist/compile/rules.js
var require_rules = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.getRules = exports.isJSONType = undefined;
  var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
  var jsonTypes = new Set(_jsonTypes);
  function isJSONType(x) {
    return typeof x == "string" && jsonTypes.has(x);
  }
  exports.isJSONType = isJSONType;
  function getRules() {
    const groups = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...groups, integer: true, boolean: true, null: true },
      rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  exports.getRules = getRules;
});

// node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = undefined;
  function schemaHasRulesForType({ schema, self }, type) {
    const group = self.RULES.types[type];
    return group && group !== true && shouldUseGroup(schema, group);
  }
  exports.schemaHasRulesForType = schemaHasRulesForType;
  function shouldUseGroup(schema, group) {
    return group.rules.some((rule) => shouldUseRule(schema, rule));
  }
  exports.shouldUseGroup = shouldUseGroup;
  function shouldUseRule(schema, rule) {
    var _a;
    return schema[rule.keyword] !== undefined || ((_a = rule.definition.implements) === null || _a === undefined ? undefined : _a.some((kwd) => schema[kwd] !== undefined));
  }
  exports.shouldUseRule = shouldUseRule;
});

// node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = undefined;
  var rules_1 = require_rules();
  var applicability_1 = require_applicability();
  var errors_1 = require_errors();
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var DataType;
  (function(DataType2) {
    DataType2[DataType2["Correct"] = 0] = "Correct";
    DataType2[DataType2["Wrong"] = 1] = "Wrong";
  })(DataType || (exports.DataType = DataType = {}));
  function getSchemaTypes(schema) {
    const types = getJSONTypes(schema.type);
    const hasNull = types.includes("null");
    if (hasNull) {
      if (schema.nullable === false)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!types.length && schema.nullable !== undefined) {
        throw new Error('"nullable" cannot be used without "type"');
      }
      if (schema.nullable === true)
        types.push("null");
    }
    return types;
  }
  exports.getSchemaTypes = getSchemaTypes;
  function getJSONTypes(ts) {
    const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
    if (types.every(rules_1.isJSONType))
      return types;
    throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
  }
  exports.getJSONTypes = getJSONTypes;
  function coerceAndCheckDataType(it, types) {
    const { gen, data, opts } = it;
    const coerceTo = coerceToTypes(types, opts.coerceTypes);
    const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
    if (checkTypes) {
      const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
      gen.if(wrongType, () => {
        if (coerceTo.length)
          coerceData(it, types, coerceTo);
        else
          reportTypeError(it);
      });
    }
    return checkTypes;
  }
  exports.coerceAndCheckDataType = coerceAndCheckDataType;
  var COERCIBLE = new Set(["string", "number", "integer", "boolean", "null"]);
  function coerceToTypes(types, coerceTypes) {
    return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
  }
  function coerceData(it, types, coerceTo) {
    const { gen, data, opts } = it;
    const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
    const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
    if (opts.coerceTypes === "array") {
      gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
    }
    gen.if((0, codegen_1._)`${coerced} !== undefined`);
    for (const t of coerceTo) {
      if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
        coerceSpecificType(t);
      }
    }
    gen.else();
    reportTypeError(it);
    gen.endIf();
    gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
      gen.assign(data, coerced);
      assignParentData(it, coerced);
    });
    function coerceSpecificType(t) {
      switch (t) {
        case "string":
          gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
          return;
        case "number":
          gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
          return;
        case "integer":
          gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
          return;
        case "boolean":
          gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
          return;
        case "null":
          gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
          gen.assign(coerced, null);
          return;
        case "array":
          gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
      }
    }
  }
  function assignParentData({ gen, parentData, parentDataProperty }, expr) {
    gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
  }
  function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
    const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
    let cond;
    switch (dataType) {
      case "null":
        return (0, codegen_1._)`${data} ${EQ} null`;
      case "array":
        cond = (0, codegen_1._)`Array.isArray(${data})`;
        break;
      case "object":
        cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
        break;
      case "integer":
        cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
        break;
      case "number":
        cond = numCond();
        break;
      default:
        return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
    }
    return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
    function numCond(_cond = codegen_1.nil) {
      return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
    }
  }
  exports.checkDataType = checkDataType;
  function checkDataTypes(dataTypes, data, strictNums, correct) {
    if (dataTypes.length === 1) {
      return checkDataType(dataTypes[0], data, strictNums, correct);
    }
    let cond;
    const types = (0, util_1.toHash)(dataTypes);
    if (types.array && types.object) {
      const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
      cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
      delete types.null;
      delete types.array;
      delete types.object;
    } else {
      cond = codegen_1.nil;
    }
    if (types.number)
      delete types.integer;
    for (const t in types)
      cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
    return cond;
  }
  exports.checkDataTypes = checkDataTypes;
  var typeError = {
    message: ({ schema }) => `must be ${schema}`,
    params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
  };
  function reportTypeError(it) {
    const cxt = getTypeErrorContext(it);
    (0, errors_1.reportError)(cxt, typeError);
  }
  exports.reportTypeError = reportTypeError;
  function getTypeErrorContext(it) {
    const { gen, data, schema } = it;
    const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
    return {
      gen,
      keyword: "type",
      data,
      schema: schema.type,
      schemaCode,
      schemaValue: schemaCode,
      parentSchema: schema,
      params: {},
      it
    };
  }
});

// node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.assignDefaults = undefined;
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  function assignDefaults(it, ty) {
    const { properties, items } = it.schema;
    if (ty === "object" && properties) {
      for (const key in properties) {
        assignDefault(it, key, properties[key].default);
      }
    } else if (ty === "array" && Array.isArray(items)) {
      items.forEach((sch, i) => assignDefault(it, i, sch.default));
    }
  }
  exports.assignDefaults = assignDefaults;
  function assignDefault(it, prop, defaultValue) {
    const { gen, compositeRule, data, opts } = it;
    if (defaultValue === undefined)
      return;
    const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
    if (compositeRule) {
      (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
      return;
    }
    let condition = (0, codegen_1._)`${childData} === undefined`;
    if (opts.useDefaults === "empty") {
      condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
    }
    gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
  }
});

// node_modules/ajv/dist/vocabularies/code.js
var require_code2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = undefined;
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var names_1 = require_names();
  var util_2 = require_util();
  function checkReportMissingProp(cxt, prop) {
    const { gen, data, it } = cxt;
    gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
      cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
      cxt.error();
    });
  }
  exports.checkReportMissingProp = checkReportMissingProp;
  function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
    return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
  }
  exports.checkMissingProp = checkMissingProp;
  function reportMissingProp(cxt, missing) {
    cxt.setParams({ missingProperty: missing }, true);
    cxt.error();
  }
  exports.reportMissingProp = reportMissingProp;
  function hasPropFunc(gen) {
    return gen.scopeValue("func", {
      ref: Object.prototype.hasOwnProperty,
      code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
    });
  }
  exports.hasPropFunc = hasPropFunc;
  function isOwnProperty(gen, data, property) {
    return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
  }
  exports.isOwnProperty = isOwnProperty;
  function propertyInData(gen, data, property, ownProperties) {
    const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
    return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
  }
  exports.propertyInData = propertyInData;
  function noPropertyInData(gen, data, property, ownProperties) {
    const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
    return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
  }
  exports.noPropertyInData = noPropertyInData;
  function allSchemaProperties(schemaMap) {
    return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
  }
  exports.allSchemaProperties = allSchemaProperties;
  function schemaProperties(it, schemaMap) {
    return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
  }
  exports.schemaProperties = schemaProperties;
  function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
    const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
    const valCxt = [
      [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
      [names_1.default.parentData, it.parentData],
      [names_1.default.parentDataProperty, it.parentDataProperty],
      [names_1.default.rootData, names_1.default.rootData]
    ];
    if (it.opts.dynamicRef)
      valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
    const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
    return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
  }
  exports.callValidateCode = callValidateCode;
  var newRegExp = (0, codegen_1._)`new RegExp`;
  function usePattern({ gen, it: { opts } }, pattern) {
    const u = opts.unicodeRegExp ? "u" : "";
    const { regExp } = opts.code;
    const rx = regExp(pattern, u);
    return gen.scopeValue("pattern", {
      key: rx.toString(),
      ref: rx,
      code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
    });
  }
  exports.usePattern = usePattern;
  function validateArray(cxt) {
    const { gen, data, keyword, it } = cxt;
    const valid = gen.name("valid");
    if (it.allErrors) {
      const validArr = gen.let("valid", true);
      validateItems(() => gen.assign(validArr, false));
      return validArr;
    }
    gen.var(valid, true);
    validateItems(() => gen.break());
    return valid;
    function validateItems(notValid) {
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      gen.forRange("i", 0, len, (i) => {
        cxt.subschema({
          keyword,
          dataProp: i,
          dataPropType: util_1.Type.Num
        }, valid);
        gen.if((0, codegen_1.not)(valid), notValid);
      });
    }
  }
  exports.validateArray = validateArray;
  function validateUnion(cxt) {
    const { gen, schema, keyword, it } = cxt;
    if (!Array.isArray(schema))
      throw new Error("ajv implementation error");
    const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
    if (alwaysValid && !it.opts.unevaluated)
      return;
    const valid = gen.let("valid", false);
    const schValid = gen.name("_valid");
    gen.block(() => schema.forEach((_sch, i) => {
      const schCxt = cxt.subschema({
        keyword,
        schemaProp: i,
        compositeRule: true
      }, schValid);
      gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
      const merged = cxt.mergeValidEvaluated(schCxt, schValid);
      if (!merged)
        gen.if((0, codegen_1.not)(valid));
    }));
    cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
  }
  exports.validateUnion = validateUnion;
});

// node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = undefined;
  var codegen_1 = require_codegen();
  var names_1 = require_names();
  var code_1 = require_code2();
  var errors_1 = require_errors();
  function macroKeywordCode(cxt, def) {
    const { gen, keyword, schema, parentSchema, it } = cxt;
    const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
    const schemaRef = useKeyword(gen, keyword, macroSchema);
    if (it.opts.validateSchema !== false)
      it.self.validateSchema(macroSchema, true);
    const valid = gen.name("valid");
    cxt.subschema({
      schema: macroSchema,
      schemaPath: codegen_1.nil,
      errSchemaPath: `${it.errSchemaPath}/${keyword}`,
      topSchemaRef: schemaRef,
      compositeRule: true
    }, valid);
    cxt.pass(valid, () => cxt.error(true));
  }
  exports.macroKeywordCode = macroKeywordCode;
  function funcKeywordCode(cxt, def) {
    var _a;
    const { gen, keyword, schema, parentSchema, $data, it } = cxt;
    checkAsyncKeyword(it, def);
    const validate = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
    const validateRef = useKeyword(gen, keyword, validate);
    const valid = gen.let("valid");
    cxt.block$data(valid, validateKeyword);
    cxt.ok((_a = def.valid) !== null && _a !== undefined ? _a : valid);
    function validateKeyword() {
      if (def.errors === false) {
        assignValid();
        if (def.modifying)
          modifyData(cxt);
        reportErrs(() => cxt.error());
      } else {
        const ruleErrs = def.async ? validateAsync() : validateSync();
        if (def.modifying)
          modifyData(cxt);
        reportErrs(() => addErrs(cxt, ruleErrs));
      }
    }
    function validateAsync() {
      const ruleErrs = gen.let("ruleErrs", null);
      gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
      return ruleErrs;
    }
    function validateSync() {
      const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
      gen.assign(validateErrs, null);
      assignValid(codegen_1.nil);
      return validateErrs;
    }
    function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
      const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
      const passSchema = !(("compile" in def) && !$data || def.schema === false);
      gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
    }
    function reportErrs(errors) {
      var _a2;
      gen.if((0, codegen_1.not)((_a2 = def.valid) !== null && _a2 !== undefined ? _a2 : valid), errors);
    }
  }
  exports.funcKeywordCode = funcKeywordCode;
  function modifyData(cxt) {
    const { gen, data, it } = cxt;
    gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
  }
  function addErrs(cxt, errs) {
    const { gen } = cxt;
    gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
      gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
      (0, errors_1.extendErrors)(cxt);
    }, () => cxt.error());
  }
  function checkAsyncKeyword({ schemaEnv }, def) {
    if (def.async && !schemaEnv.$async)
      throw new Error("async keyword in sync schema");
  }
  function useKeyword(gen, keyword, result) {
    if (result === undefined)
      throw new Error(`keyword "${keyword}" failed to compile`);
    return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
  }
  function validSchemaType(schema, schemaType, allowUndefined = false) {
    return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
  }
  exports.validSchemaType = validSchemaType;
  function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
    if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
      throw new Error("ajv implementation error");
    }
    const deps = def.dependencies;
    if (deps === null || deps === undefined ? undefined : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
      throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
    }
    if (def.validateSchema) {
      const valid = def.validateSchema(schema[keyword]);
      if (!valid) {
        const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
        if (opts.validateSchema === "log")
          self.logger.error(msg);
        else
          throw new Error(msg);
      }
    }
  }
  exports.validateKeywordUsage = validateKeywordUsage;
});

// node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = undefined;
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
    if (keyword !== undefined && schema !== undefined) {
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    }
    if (keyword !== undefined) {
      const sch = it.schema[keyword];
      return schemaProp === undefined ? {
        schema: sch,
        schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`
      } : {
        schema: sch[schemaProp],
        schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
        errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
      };
    }
    if (schema !== undefined) {
      if (schemaPath === undefined || errSchemaPath === undefined || topSchemaRef === undefined) {
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      }
      return {
        schema,
        schemaPath,
        topSchemaRef,
        errSchemaPath
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  exports.getSubschema = getSubschema;
  function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
    if (data !== undefined && dataProp !== undefined) {
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    }
    const { gen } = it;
    if (dataProp !== undefined) {
      const { errorPath, dataPathArr, opts } = it;
      const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
      dataContextProps(nextData);
      subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
      subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
      subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
    }
    if (data !== undefined) {
      const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
      dataContextProps(nextData);
      if (propertyName !== undefined)
        subschema.propertyName = propertyName;
    }
    if (dataTypes)
      subschema.dataTypes = dataTypes;
    function dataContextProps(_nextData) {
      subschema.data = _nextData;
      subschema.dataLevel = it.dataLevel + 1;
      subschema.dataTypes = [];
      it.definedProperties = new Set;
      subschema.parentData = it.data;
      subschema.dataNames = [...it.dataNames, _nextData];
    }
  }
  exports.extendSubschemaData = extendSubschemaData;
  function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
    if (compositeRule !== undefined)
      subschema.compositeRule = compositeRule;
    if (createErrors !== undefined)
      subschema.createErrors = createErrors;
    if (allErrors !== undefined)
      subschema.allErrors = allErrors;
    subschema.jtdDiscriminator = jtdDiscriminator;
    subschema.jtdMetadata = jtdMetadata;
  }
  exports.extendSubschemaMode = extendSubschemaMode;
});

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS((exports, module) => {
  module.exports = function equal(a, b) {
    if (a === b)
      return true;
    if (a && b && typeof a == "object" && typeof b == "object") {
      if (a.constructor !== b.constructor)
        return false;
      var length, i, keys;
      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length)
          return false;
        for (i = length;i-- !== 0; )
          if (!equal(a[i], b[i]))
            return false;
        return true;
      }
      if (a.constructor === RegExp)
        return a.source === b.source && a.flags === b.flags;
      if (a.valueOf !== Object.prototype.valueOf)
        return a.valueOf() === b.valueOf();
      if (a.toString !== Object.prototype.toString)
        return a.toString() === b.toString();
      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length)
        return false;
      for (i = length;i-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
          return false;
      for (i = length;i-- !== 0; ) {
        var key = keys[i];
        if (!equal(a[key], b[key]))
          return false;
      }
      return true;
    }
    return a !== a && b !== b;
  };
});

// node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = __commonJS((exports, module) => {
  var traverse = module.exports = function(schema, opts, cb) {
    if (typeof opts == "function") {
      cb = opts;
      opts = {};
    }
    cb = opts.cb || cb;
    var pre = typeof cb == "function" ? cb : cb.pre || function() {};
    var post = cb.post || function() {};
    _traverse(opts, pre, post, schema, "", schema);
  };
  traverse.keywords = {
    additionalItems: true,
    items: true,
    contains: true,
    additionalProperties: true,
    propertyNames: true,
    not: true,
    if: true,
    then: true,
    else: true
  };
  traverse.arrayKeywords = {
    items: true,
    allOf: true,
    anyOf: true,
    oneOf: true
  };
  traverse.propsKeywords = {
    $defs: true,
    definitions: true,
    properties: true,
    patternProperties: true,
    dependencies: true
  };
  traverse.skipKeywords = {
    default: true,
    enum: true,
    const: true,
    required: true,
    maximum: true,
    minimum: true,
    exclusiveMaximum: true,
    exclusiveMinimum: true,
    multipleOf: true,
    maxLength: true,
    minLength: true,
    pattern: true,
    format: true,
    maxItems: true,
    minItems: true,
    uniqueItems: true,
    maxProperties: true,
    minProperties: true
  };
  function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
    if (schema && typeof schema == "object" && !Array.isArray(schema)) {
      pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      for (var key in schema) {
        var sch = schema[key];
        if (Array.isArray(sch)) {
          if (key in traverse.arrayKeywords) {
            for (var i = 0;i < sch.length; i++)
              _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
          }
        } else if (key in traverse.propsKeywords) {
          if (sch && typeof sch == "object") {
            for (var prop in sch)
              _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
          }
        } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
          _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
        }
      }
      post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
    }
  }
  function escapeJsonPtr(str) {
    return str.replace(/~/g, "~0").replace(/\//g, "~1");
  }
});

// node_modules/ajv/dist/compile/resolve.js
var require_resolve = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = undefined;
  var util_1 = require_util();
  var equal = require_fast_deep_equal();
  var traverse = require_json_schema_traverse();
  var SIMPLE_INLINED = new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function inlineRef(schema, limit = true) {
    if (typeof schema == "boolean")
      return true;
    if (limit === true)
      return !hasRef(schema);
    if (!limit)
      return false;
    return countKeys(schema) <= limit;
  }
  exports.inlineRef = inlineRef;
  var REF_KEYWORDS = new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function hasRef(schema) {
    for (const key in schema) {
      if (REF_KEYWORDS.has(key))
        return true;
      const sch = schema[key];
      if (Array.isArray(sch) && sch.some(hasRef))
        return true;
      if (typeof sch == "object" && hasRef(sch))
        return true;
    }
    return false;
  }
  function countKeys(schema) {
    let count = 0;
    for (const key in schema) {
      if (key === "$ref")
        return Infinity;
      count++;
      if (SIMPLE_INLINED.has(key))
        continue;
      if (typeof schema[key] == "object") {
        (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
      }
      if (count === Infinity)
        return Infinity;
    }
    return count;
  }
  function getFullPath(resolver, id = "", normalize) {
    if (normalize !== false)
      id = normalizeId(id);
    const p = resolver.parse(id);
    return _getFullPath(resolver, p);
  }
  exports.getFullPath = getFullPath;
  function _getFullPath(resolver, p) {
    const serialized = resolver.serialize(p);
    return serialized.split("#")[0] + "#";
  }
  exports._getFullPath = _getFullPath;
  var TRAILING_SLASH_HASH = /#\/?$/;
  function normalizeId(id) {
    return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
  }
  exports.normalizeId = normalizeId;
  function resolveUrl(resolver, baseId, id) {
    id = normalizeId(id);
    return resolver.resolve(baseId, id);
  }
  exports.resolveUrl = resolveUrl;
  var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
  function getSchemaRefs(schema, baseId) {
    if (typeof schema == "boolean")
      return {};
    const { schemaId, uriResolver } = this.opts;
    const schId = normalizeId(schema[schemaId] || baseId);
    const baseIds = { "": schId };
    const pathPrefix = getFullPath(uriResolver, schId, false);
    const localRefs = {};
    const schemaRefs = new Set;
    traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
      if (parentJsonPtr === undefined)
        return;
      const fullPath = pathPrefix + jsonPtr;
      let innerBaseId = baseIds[parentJsonPtr];
      if (typeof sch[schemaId] == "string")
        innerBaseId = addRef.call(this, sch[schemaId]);
      addAnchor.call(this, sch.$anchor);
      addAnchor.call(this, sch.$dynamicAnchor);
      baseIds[jsonPtr] = innerBaseId;
      function addRef(ref) {
        const _resolve = this.opts.uriResolver.resolve;
        ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
        if (schemaRefs.has(ref))
          throw ambiguos(ref);
        schemaRefs.add(ref);
        let schOrRef = this.refs[ref];
        if (typeof schOrRef == "string")
          schOrRef = this.refs[schOrRef];
        if (typeof schOrRef == "object") {
          checkAmbiguosRef(sch, schOrRef.schema, ref);
        } else if (ref !== normalizeId(fullPath)) {
          if (ref[0] === "#") {
            checkAmbiguosRef(sch, localRefs[ref], ref);
            localRefs[ref] = sch;
          } else {
            this.refs[ref] = fullPath;
          }
        }
        return ref;
      }
      function addAnchor(anchor) {
        if (typeof anchor == "string") {
          if (!ANCHOR.test(anchor))
            throw new Error(`invalid anchor "${anchor}"`);
          addRef.call(this, `#${anchor}`);
        }
      }
    });
    return localRefs;
    function checkAmbiguosRef(sch1, sch2, ref) {
      if (sch2 !== undefined && !equal(sch1, sch2))
        throw ambiguos(ref);
    }
    function ambiguos(ref) {
      return new Error(`reference "${ref}" resolves to more than one schema`);
    }
  }
  exports.getSchemaRefs = getSchemaRefs;
});

// node_modules/ajv/dist/compile/validate/index.js
var require_validate = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.getData = exports.KeywordCxt = exports.validateFunctionCode = undefined;
  var boolSchema_1 = require_boolSchema();
  var dataType_1 = require_dataType();
  var applicability_1 = require_applicability();
  var dataType_2 = require_dataType();
  var defaults_1 = require_defaults();
  var keyword_1 = require_keyword();
  var subschema_1 = require_subschema();
  var codegen_1 = require_codegen();
  var names_1 = require_names();
  var resolve_1 = require_resolve();
  var util_1 = require_util();
  var errors_1 = require_errors();
  function validateFunctionCode(it) {
    if (isSchemaObj(it)) {
      checkKeywords(it);
      if (schemaCxtHasRules(it)) {
        topSchemaObjCode(it);
        return;
      }
    }
    validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
  }
  exports.validateFunctionCode = validateFunctionCode;
  function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
    if (opts.code.es5) {
      gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
        gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
        destructureValCxtES5(gen, opts);
        gen.code(body);
      });
    } else {
      gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
    }
  }
  function destructureValCxt(opts) {
    return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
  }
  function destructureValCxtES5(gen, opts) {
    gen.if(names_1.default.valCxt, () => {
      gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
      gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
      gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
      gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
      if (opts.dynamicRef)
        gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
    }, () => {
      gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
      gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
      gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
      gen.var(names_1.default.rootData, names_1.default.data);
      if (opts.dynamicRef)
        gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
    });
  }
  function topSchemaObjCode(it) {
    const { schema, opts, gen } = it;
    validateFunction(it, () => {
      if (opts.$comment && schema.$comment)
        commentKeyword(it);
      checkNoDefault(it);
      gen.let(names_1.default.vErrors, null);
      gen.let(names_1.default.errors, 0);
      if (opts.unevaluated)
        resetEvaluated(it);
      typeAndKeywords(it);
      returnResults(it);
    });
    return;
  }
  function resetEvaluated(it) {
    const { gen, validateName } = it;
    it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
    gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
    gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
  }
  function funcSourceUrl(schema, opts) {
    const schId = typeof schema == "object" && schema[opts.schemaId];
    return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
  }
  function subschemaCode(it, valid) {
    if (isSchemaObj(it)) {
      checkKeywords(it);
      if (schemaCxtHasRules(it)) {
        subSchemaObjCode(it, valid);
        return;
      }
    }
    (0, boolSchema_1.boolOrEmptySchema)(it, valid);
  }
  function schemaCxtHasRules({ schema, self }) {
    if (typeof schema == "boolean")
      return !schema;
    for (const key in schema)
      if (self.RULES.all[key])
        return true;
    return false;
  }
  function isSchemaObj(it) {
    return typeof it.schema != "boolean";
  }
  function subSchemaObjCode(it, valid) {
    const { schema, gen, opts } = it;
    if (opts.$comment && schema.$comment)
      commentKeyword(it);
    updateContext(it);
    checkAsyncSchema(it);
    const errsCount = gen.const("_errs", names_1.default.errors);
    typeAndKeywords(it, errsCount);
    gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
  }
  function checkKeywords(it) {
    (0, util_1.checkUnknownRules)(it);
    checkRefsAndKeywords(it);
  }
  function typeAndKeywords(it, errsCount) {
    if (it.opts.jtd)
      return schemaKeywords(it, [], false, errsCount);
    const types = (0, dataType_1.getSchemaTypes)(it.schema);
    const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
    schemaKeywords(it, types, !checkedTypes, errsCount);
  }
  function checkRefsAndKeywords(it) {
    const { schema, errSchemaPath, opts, self } = it;
    if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) {
      self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
    }
  }
  function checkNoDefault(it) {
    const { schema, opts } = it;
    if (schema.default !== undefined && opts.useDefaults && opts.strictSchema) {
      (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
    }
  }
  function updateContext(it) {
    const schId = it.schema[it.opts.schemaId];
    if (schId)
      it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
  }
  function checkAsyncSchema(it) {
    if (it.schema.$async && !it.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
    const msg = schema.$comment;
    if (opts.$comment === true) {
      gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
    } else if (typeof opts.$comment == "function") {
      const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
      const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
      gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
    }
  }
  function returnResults(it) {
    const { gen, schemaEnv, validateName, ValidationError, opts } = it;
    if (schemaEnv.$async) {
      gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
    } else {
      gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
      if (opts.unevaluated)
        assignEvaluated(it);
      gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
    }
  }
  function assignEvaluated({ gen, evaluated, props, items }) {
    if (props instanceof codegen_1.Name)
      gen.assign((0, codegen_1._)`${evaluated}.props`, props);
    if (items instanceof codegen_1.Name)
      gen.assign((0, codegen_1._)`${evaluated}.items`, items);
  }
  function schemaKeywords(it, types, typeErrors, errsCount) {
    const { gen, schema, data, allErrors, opts, self } = it;
    const { RULES } = self;
    if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
      gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
      return;
    }
    if (!opts.jtd)
      checkStrictTypes(it, types);
    gen.block(() => {
      for (const group of RULES.rules)
        groupKeywords(group);
      groupKeywords(RULES.post);
    });
    function groupKeywords(group) {
      if (!(0, applicability_1.shouldUseGroup)(schema, group))
        return;
      if (group.type) {
        gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
        iterateKeywords(it, group);
        if (types.length === 1 && types[0] === group.type && typeErrors) {
          gen.else();
          (0, dataType_2.reportTypeError)(it);
        }
        gen.endIf();
      } else {
        iterateKeywords(it, group);
      }
      if (!allErrors)
        gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
    }
  }
  function iterateKeywords(it, group) {
    const { gen, schema, opts: { useDefaults } } = it;
    if (useDefaults)
      (0, defaults_1.assignDefaults)(it, group.type);
    gen.block(() => {
      for (const rule of group.rules) {
        if ((0, applicability_1.shouldUseRule)(schema, rule)) {
          keywordCode(it, rule.keyword, rule.definition, group.type);
        }
      }
    });
  }
  function checkStrictTypes(it, types) {
    if (it.schemaEnv.meta || !it.opts.strictTypes)
      return;
    checkContextTypes(it, types);
    if (!it.opts.allowUnionTypes)
      checkMultipleTypes(it, types);
    checkKeywordTypes(it, it.dataTypes);
  }
  function checkContextTypes(it, types) {
    if (!types.length)
      return;
    if (!it.dataTypes.length) {
      it.dataTypes = types;
      return;
    }
    types.forEach((t) => {
      if (!includesType(it.dataTypes, t)) {
        strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
      }
    });
    narrowSchemaTypes(it, types);
  }
  function checkMultipleTypes(it, ts) {
    if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
      strictTypesError(it, "use allowUnionTypes to allow union type keyword");
    }
  }
  function checkKeywordTypes(it, ts) {
    const rules = it.self.RULES.all;
    for (const keyword in rules) {
      const rule = rules[keyword];
      if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
        const { type } = rule.definition;
        if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
          strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
        }
      }
    }
  }
  function hasApplicableType(schTs, kwdT) {
    return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
  }
  function includesType(ts, t) {
    return ts.includes(t) || t === "integer" && ts.includes("number");
  }
  function narrowSchemaTypes(it, withTypes) {
    const ts = [];
    for (const t of it.dataTypes) {
      if (includesType(withTypes, t))
        ts.push(t);
      else if (withTypes.includes("integer") && t === "number")
        ts.push("integer");
    }
    it.dataTypes = ts;
  }
  function strictTypesError(it, msg) {
    const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
    msg += ` at "${schemaPath}" (strictTypes)`;
    (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
  }

  class KeywordCxt {
    constructor(it, def, keyword) {
      (0, keyword_1.validateKeywordUsage)(it, def, keyword);
      this.gen = it.gen;
      this.allErrors = it.allErrors;
      this.keyword = keyword;
      this.data = it.data;
      this.schema = it.schema[keyword];
      this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
      this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
      this.schemaType = def.schemaType;
      this.parentSchema = it.schema;
      this.params = {};
      this.it = it;
      this.def = def;
      if (this.$data) {
        this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
      } else {
        this.schemaCode = this.schemaValue;
        if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
          throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
        }
      }
      if ("code" in def ? def.trackErrors : def.errors !== false) {
        this.errsCount = it.gen.const("_errs", names_1.default.errors);
      }
    }
    result(condition, successAction, failAction) {
      this.failResult((0, codegen_1.not)(condition), successAction, failAction);
    }
    failResult(condition, successAction, failAction) {
      this.gen.if(condition);
      if (failAction)
        failAction();
      else
        this.error();
      if (successAction) {
        this.gen.else();
        successAction();
        if (this.allErrors)
          this.gen.endIf();
      } else {
        if (this.allErrors)
          this.gen.endIf();
        else
          this.gen.else();
      }
    }
    pass(condition, failAction) {
      this.failResult((0, codegen_1.not)(condition), undefined, failAction);
    }
    fail(condition) {
      if (condition === undefined) {
        this.error();
        if (!this.allErrors)
          this.gen.if(false);
        return;
      }
      this.gen.if(condition);
      this.error();
      if (this.allErrors)
        this.gen.endIf();
      else
        this.gen.else();
    }
    fail$data(condition) {
      if (!this.$data)
        return this.fail(condition);
      const { schemaCode } = this;
      this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
    }
    error(append, errorParams, errorPaths) {
      if (errorParams) {
        this.setParams(errorParams);
        this._error(append, errorPaths);
        this.setParams({});
        return;
      }
      this._error(append, errorPaths);
    }
    _error(append, errorPaths) {
      (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
    }
    $dataError() {
      (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
    }
    reset() {
      if (this.errsCount === undefined)
        throw new Error('add "trackErrors" to keyword definition');
      (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(cond) {
      if (!this.allErrors)
        this.gen.if(cond);
    }
    setParams(obj, assign) {
      if (assign)
        Object.assign(this.params, obj);
      else
        this.params = obj;
    }
    block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
      this.gen.block(() => {
        this.check$data(valid, $dataValid);
        codeBlock();
      });
    }
    check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
      if (!this.$data)
        return;
      const { gen, schemaCode, schemaType, def } = this;
      gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
      if (valid !== codegen_1.nil)
        gen.assign(valid, true);
      if (schemaType.length || def.validateSchema) {
        gen.elseIf(this.invalid$data());
        this.$dataError();
        if (valid !== codegen_1.nil)
          gen.assign(valid, false);
      }
      gen.else();
    }
    invalid$data() {
      const { gen, schemaCode, schemaType, def, it } = this;
      return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
      function wrong$DataType() {
        if (schemaType.length) {
          if (!(schemaCode instanceof codegen_1.Name))
            throw new Error("ajv implementation error");
          const st = Array.isArray(schemaType) ? schemaType : [schemaType];
          return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
        }
        return codegen_1.nil;
      }
      function invalid$DataSchema() {
        if (def.validateSchema) {
          const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
          return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
        }
        return codegen_1.nil;
      }
    }
    subschema(appl, valid) {
      const subschema = (0, subschema_1.getSubschema)(this.it, appl);
      (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
      (0, subschema_1.extendSubschemaMode)(subschema, appl);
      const nextContext = { ...this.it, ...subschema, items: undefined, props: undefined };
      subschemaCode(nextContext, valid);
      return nextContext;
    }
    mergeEvaluated(schemaCxt, toName) {
      const { it, gen } = this;
      if (!it.opts.unevaluated)
        return;
      if (it.props !== true && schemaCxt.props !== undefined) {
        it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
      }
      if (it.items !== true && schemaCxt.items !== undefined) {
        it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
      }
    }
    mergeValidEvaluated(schemaCxt, valid) {
      const { it, gen } = this;
      if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
        gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
        return true;
      }
    }
  }
  exports.KeywordCxt = KeywordCxt;
  function keywordCode(it, keyword, def, ruleType) {
    const cxt = new KeywordCxt(it, def, keyword);
    if ("code" in def) {
      def.code(cxt, ruleType);
    } else if (cxt.$data && def.validate) {
      (0, keyword_1.funcKeywordCode)(cxt, def);
    } else if ("macro" in def) {
      (0, keyword_1.macroKeywordCode)(cxt, def);
    } else if (def.compile || def.validate) {
      (0, keyword_1.funcKeywordCode)(cxt, def);
    }
  }
  var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
  var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function getData($data, { dataLevel, dataNames, dataPathArr }) {
    let jsonPointer;
    let data;
    if ($data === "")
      return names_1.default.rootData;
    if ($data[0] === "/") {
      if (!JSON_POINTER.test($data))
        throw new Error(`Invalid JSON-pointer: ${$data}`);
      jsonPointer = $data;
      data = names_1.default.rootData;
    } else {
      const matches = RELATIVE_JSON_POINTER.exec($data);
      if (!matches)
        throw new Error(`Invalid JSON-pointer: ${$data}`);
      const up = +matches[1];
      jsonPointer = matches[2];
      if (jsonPointer === "#") {
        if (up >= dataLevel)
          throw new Error(errorMsg("property/index", up));
        return dataPathArr[dataLevel - up];
      }
      if (up > dataLevel)
        throw new Error(errorMsg("data", up));
      data = dataNames[dataLevel - up];
      if (!jsonPointer)
        return data;
    }
    let expr = data;
    const segments = jsonPointer.split("/");
    for (const segment of segments) {
      if (segment) {
        data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
        expr = (0, codegen_1._)`${expr} && ${data}`;
      }
    }
    return expr;
    function errorMsg(pointerType, up) {
      return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
    }
  }
  exports.getData = getData;
});

// node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });

  class ValidationError extends Error {
    constructor(errors) {
      super("validation failed");
      this.errors = errors;
      this.ajv = this.validation = true;
    }
  }
  exports.default = ValidationError;
});

// node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var resolve_1 = require_resolve();

  class MissingRefError extends Error {
    constructor(resolver, baseId, ref, msg) {
      super(msg || `can't resolve reference ${ref} from id ${baseId}`);
      this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
      this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
    }
  }
  exports.default = MissingRefError;
});

// node_modules/ajv/dist/compile/index.js
var require_compile = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = undefined;
  var codegen_1 = require_codegen();
  var validation_error_1 = require_validation_error();
  var names_1 = require_names();
  var resolve_1 = require_resolve();
  var util_1 = require_util();
  var validate_1 = require_validate();

  class SchemaEnv {
    constructor(env2) {
      var _a;
      this.refs = {};
      this.dynamicAnchors = {};
      let schema;
      if (typeof env2.schema == "object")
        schema = env2.schema;
      this.schema = env2.schema;
      this.schemaId = env2.schemaId;
      this.root = env2.root || this;
      this.baseId = (_a = env2.baseId) !== null && _a !== undefined ? _a : (0, resolve_1.normalizeId)(schema === null || schema === undefined ? undefined : schema[env2.schemaId || "$id"]);
      this.schemaPath = env2.schemaPath;
      this.localRefs = env2.localRefs;
      this.meta = env2.meta;
      this.$async = schema === null || schema === undefined ? undefined : schema.$async;
      this.refs = {};
    }
  }
  exports.SchemaEnv = SchemaEnv;
  function compileSchema(sch) {
    const _sch = getCompilingSchema.call(this, sch);
    if (_sch)
      return _sch;
    const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
    const { es5, lines } = this.opts.code;
    const { ownProperties } = this.opts;
    const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
    let _ValidationError;
    if (sch.$async) {
      _ValidationError = gen.scopeValue("Error", {
        ref: validation_error_1.default,
        code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
      });
    }
    const validateName = gen.scopeName("validate");
    sch.validateName = validateName;
    const schemaCxt = {
      gen,
      allErrors: this.opts.allErrors,
      data: names_1.default.data,
      parentData: names_1.default.parentData,
      parentDataProperty: names_1.default.parentDataProperty,
      dataNames: [names_1.default.data],
      dataPathArr: [codegen_1.nil],
      dataLevel: 0,
      dataTypes: [],
      definedProperties: new Set,
      topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
      validateName,
      ValidationError: _ValidationError,
      schema: sch.schema,
      schemaEnv: sch,
      rootId,
      baseId: sch.baseId || rootId,
      schemaPath: codegen_1.nil,
      errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, codegen_1._)`""`,
      opts: this.opts,
      self: this
    };
    let sourceCode;
    try {
      this._compilations.add(sch);
      (0, validate_1.validateFunctionCode)(schemaCxt);
      gen.optimize(this.opts.code.optimize);
      const validateCode = gen.toString();
      sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
      if (this.opts.code.process)
        sourceCode = this.opts.code.process(sourceCode, sch);
      const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
      const validate = makeValidate(this, this.scope.get());
      this.scope.value(validateName, { ref: validate });
      validate.errors = null;
      validate.schema = sch.schema;
      validate.schemaEnv = sch;
      if (sch.$async)
        validate.$async = true;
      if (this.opts.code.source === true) {
        validate.source = { validateName, validateCode, scopeValues: gen._values };
      }
      if (this.opts.unevaluated) {
        const { props, items } = schemaCxt;
        validate.evaluated = {
          props: props instanceof codegen_1.Name ? undefined : props,
          items: items instanceof codegen_1.Name ? undefined : items,
          dynamicProps: props instanceof codegen_1.Name,
          dynamicItems: items instanceof codegen_1.Name
        };
        if (validate.source)
          validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
      }
      sch.validate = validate;
      return sch;
    } catch (e) {
      delete sch.validate;
      delete sch.validateName;
      if (sourceCode)
        this.logger.error("Error compiling schema, function code:", sourceCode);
      throw e;
    } finally {
      this._compilations.delete(sch);
    }
  }
  exports.compileSchema = compileSchema;
  function resolveRef(root, baseId, ref) {
    var _a;
    ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
    const schOrFunc = root.refs[ref];
    if (schOrFunc)
      return schOrFunc;
    let _sch = resolve2.call(this, root, ref);
    if (_sch === undefined) {
      const schema = (_a = root.localRefs) === null || _a === undefined ? undefined : _a[ref];
      const { schemaId } = this.opts;
      if (schema)
        _sch = new SchemaEnv({ schema, schemaId, root, baseId });
    }
    if (_sch === undefined)
      return;
    return root.refs[ref] = inlineOrCompile.call(this, _sch);
  }
  exports.resolveRef = resolveRef;
  function inlineOrCompile(sch) {
    if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
      return sch.schema;
    return sch.validate ? sch : compileSchema.call(this, sch);
  }
  function getCompilingSchema(schEnv) {
    for (const sch of this._compilations) {
      if (sameSchemaEnv(sch, schEnv))
        return sch;
    }
  }
  exports.getCompilingSchema = getCompilingSchema;
  function sameSchemaEnv(s1, s2) {
    return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
  }
  function resolve2(root, ref) {
    let sch;
    while (typeof (sch = this.refs[ref]) == "string")
      ref = sch;
    return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
  }
  function resolveSchema(root, ref) {
    const p = this.opts.uriResolver.parse(ref);
    const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
    let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, undefined);
    if (Object.keys(root.schema).length > 0 && refPath === baseId) {
      return getJsonPointer.call(this, p, root);
    }
    const id = (0, resolve_1.normalizeId)(refPath);
    const schOrRef = this.refs[id] || this.schemas[id];
    if (typeof schOrRef == "string") {
      const sch = resolveSchema.call(this, root, schOrRef);
      if (typeof (sch === null || sch === undefined ? undefined : sch.schema) !== "object")
        return;
      return getJsonPointer.call(this, p, sch);
    }
    if (typeof (schOrRef === null || schOrRef === undefined ? undefined : schOrRef.schema) !== "object")
      return;
    if (!schOrRef.validate)
      compileSchema.call(this, schOrRef);
    if (id === (0, resolve_1.normalizeId)(ref)) {
      const { schema } = schOrRef;
      const { schemaId } = this.opts;
      const schId = schema[schemaId];
      if (schId)
        baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
      return new SchemaEnv({ schema, schemaId, root, baseId });
    }
    return getJsonPointer.call(this, p, schOrRef);
  }
  exports.resolveSchema = resolveSchema;
  var PREVENT_SCOPE_CHANGE = new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function getJsonPointer(parsedRef, { baseId, schema, root }) {
    var _a;
    if (((_a = parsedRef.fragment) === null || _a === undefined ? undefined : _a[0]) !== "/")
      return;
    for (const part of parsedRef.fragment.slice(1).split("/")) {
      if (typeof schema === "boolean")
        return;
      const partSchema = schema[(0, util_1.unescapeFragment)(part)];
      if (partSchema === undefined)
        return;
      schema = partSchema;
      const schId = typeof schema === "object" && schema[this.opts.schemaId];
      if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
        baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
      }
    }
    let env2;
    if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
      const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
      env2 = resolveSchema.call(this, root, $ref);
    }
    const { schemaId } = this.opts;
    env2 = env2 || new SchemaEnv({ schema, schemaId, root, baseId });
    if (env2.schema !== env2.root.schema)
      return env2;
    return;
  }
});

// node_modules/ajv/dist/refs/data.json
var require_data = __commonJS((exports, module) => {
  module.exports = {
    $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
    description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
    type: "object",
    required: ["$data"],
    properties: {
      $data: {
        type: "string",
        anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
      }
    },
    additionalProperties: false
  };
});

// node_modules/fast-uri/lib/utils.js
var require_utils = __commonJS((exports, module) => {
  var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
  var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
  var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
  var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
  var isPathCharacter = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
  function stringArrayToHexStripped(input) {
    let acc = "";
    let code = 0;
    let i = 0;
    for (i = 0;i < input.length; i++) {
      code = input[i].charCodeAt(0);
      if (code === 48) {
        continue;
      }
      if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
        return "";
      }
      acc += input[i];
      break;
    }
    for (i += 1;i < input.length; i++) {
      code = input[i].charCodeAt(0);
      if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
        return "";
      }
      acc += input[i];
    }
    return acc;
  }
  var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function consumeIsZone(buffer) {
    buffer.length = 0;
    return true;
  }
  function consumeHextets(buffer, address, output) {
    if (buffer.length) {
      const hex = stringArrayToHexStripped(buffer);
      if (hex !== "") {
        address.push(hex);
      } else {
        output.error = true;
        return false;
      }
      buffer.length = 0;
    }
    return true;
  }
  function getIPV6(input) {
    let tokenCount = 0;
    const output = { error: false, address: "", zone: "" };
    const address = [];
    const buffer = [];
    let endipv6Encountered = false;
    let endIpv6 = false;
    let consume = consumeHextets;
    for (let i = 0;i < input.length; i++) {
      const cursor = input[i];
      if (cursor === "[" || cursor === "]") {
        continue;
      }
      if (cursor === ":") {
        if (endipv6Encountered === true) {
          endIpv6 = true;
        }
        if (!consume(buffer, address, output)) {
          break;
        }
        if (++tokenCount > 7) {
          output.error = true;
          break;
        }
        if (i > 0 && input[i - 1] === ":") {
          endipv6Encountered = true;
        }
        address.push(":");
        continue;
      } else if (cursor === "%") {
        if (!consume(buffer, address, output)) {
          break;
        }
        consume = consumeIsZone;
      } else {
        buffer.push(cursor);
        continue;
      }
    }
    if (buffer.length) {
      if (consume === consumeIsZone) {
        output.zone = buffer.join("");
      } else if (endIpv6) {
        address.push(buffer.join(""));
      } else {
        address.push(stringArrayToHexStripped(buffer));
      }
    }
    output.address = address.join("");
    return output;
  }
  function normalizeIPv6(host) {
    if (findToken(host, ":") < 2) {
      return { host, isIPV6: false };
    }
    const ipv6 = getIPV6(host);
    if (!ipv6.error) {
      let newHost = ipv6.address;
      let escapedHost = ipv6.address;
      if (ipv6.zone) {
        newHost += "%" + ipv6.zone;
        escapedHost += "%25" + ipv6.zone;
      }
      return { host: newHost, isIPV6: true, escapedHost };
    } else {
      return { host, isIPV6: false };
    }
  }
  function findToken(str, token) {
    let ind = 0;
    for (let i = 0;i < str.length; i++) {
      if (str[i] === token)
        ind++;
    }
    return ind;
  }
  function removeDotSegments(path8) {
    let input = path8;
    const output = [];
    let nextSlash = -1;
    let len = 0;
    while (len = input.length) {
      if (len === 1) {
        if (input === ".") {
          break;
        } else if (input === "/") {
          output.push("/");
          break;
        } else {
          output.push(input);
          break;
        }
      } else if (len === 2) {
        if (input[0] === ".") {
          if (input[1] === ".") {
            break;
          } else if (input[1] === "/") {
            input = input.slice(2);
            continue;
          }
        } else if (input[0] === "/") {
          if (input[1] === "." || input[1] === "/") {
            output.push("/");
            break;
          }
        }
      } else if (len === 3) {
        if (input === "/..") {
          if (output.length !== 0) {
            output.pop();
          }
          output.push("/");
          break;
        }
      }
      if (input[0] === ".") {
        if (input[1] === ".") {
          if (input[2] === "/") {
            input = input.slice(3);
            continue;
          }
        } else if (input[1] === "/") {
          input = input.slice(2);
          continue;
        }
      } else if (input[0] === "/") {
        if (input[1] === ".") {
          if (input[2] === "/") {
            input = input.slice(2);
            continue;
          } else if (input[2] === ".") {
            if (input[3] === "/") {
              input = input.slice(3);
              if (output.length !== 0) {
                output.pop();
              }
              continue;
            }
          }
        }
      }
      if ((nextSlash = input.indexOf("/", 1)) === -1) {
        output.push(input);
        break;
      } else {
        output.push(input.slice(0, nextSlash));
        input = input.slice(nextSlash);
      }
    }
    return output.join("");
  }
  var HOST_DELIMS = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" };
  var HOST_DELIM_RE = /[@/?#:]/g;
  var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
  function reescapeHostDelimiters(host, isIP) {
    const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
    re.lastIndex = 0;
    return host.replace(re, (ch) => HOST_DELIMS[ch]);
  }
  function normalizePercentEncoding(input, decodeUnreserved = false) {
    if (input.indexOf("%") === -1) {
      return input;
    }
    let output = "";
    for (let i = 0;i < input.length; i++) {
      if (input[i] === "%" && i + 2 < input.length) {
        const hex = input.slice(i + 1, i + 3);
        if (isHexPair(hex)) {
          const normalizedHex = hex.toUpperCase();
          const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
          if (decodeUnreserved && isUnreserved(decoded)) {
            output += decoded;
          } else {
            output += "%" + normalizedHex;
          }
          i += 2;
          continue;
        }
      }
      output += input[i];
    }
    return output;
  }
  function normalizePathEncoding(input) {
    let output = "";
    for (let i = 0;i < input.length; i++) {
      if (input[i] === "%" && i + 2 < input.length) {
        const hex = input.slice(i + 1, i + 3);
        if (isHexPair(hex)) {
          const normalizedHex = hex.toUpperCase();
          const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
          if (decoded !== "." && isUnreserved(decoded)) {
            output += decoded;
          } else {
            output += "%" + normalizedHex;
          }
          i += 2;
          continue;
        }
      }
      if (isPathCharacter(input[i])) {
        output += input[i];
      } else {
        output += escape(input[i]);
      }
    }
    return output;
  }
  function escapePreservingEscapes(input) {
    let output = "";
    for (let i = 0;i < input.length; i++) {
      if (input[i] === "%" && i + 2 < input.length) {
        const hex = input.slice(i + 1, i + 3);
        if (isHexPair(hex)) {
          output += "%" + hex.toUpperCase();
          i += 2;
          continue;
        }
      }
      output += escape(input[i]);
    }
    return output;
  }
  function recomposeAuthority(component) {
    const uriTokens = [];
    if (component.userinfo !== undefined) {
      uriTokens.push(component.userinfo);
      uriTokens.push("@");
    }
    if (component.host !== undefined) {
      let host = unescape(component.host);
      if (!isIPv4(host)) {
        const ipV6res = normalizeIPv6(host);
        if (ipV6res.isIPV6 === true) {
          host = `[${ipV6res.escapedHost}]`;
        } else {
          host = reescapeHostDelimiters(host, false);
        }
      }
      uriTokens.push(host);
    }
    if (typeof component.port === "number" || typeof component.port === "string") {
      uriTokens.push(":");
      uriTokens.push(String(component.port));
    }
    return uriTokens.length ? uriTokens.join("") : undefined;
  }
  module.exports = {
    nonSimpleDomain,
    recomposeAuthority,
    reescapeHostDelimiters,
    normalizePercentEncoding,
    normalizePathEncoding,
    escapePreservingEscapes,
    removeDotSegments,
    isIPv4,
    isUUID,
    normalizeIPv6,
    stringArrayToHexStripped
  };
});

// node_modules/fast-uri/lib/schemes.js
var require_schemes = __commonJS((exports, module) => {
  var { isUUID } = require_utils();
  var URN_REG = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
  var supportedSchemeNames = [
    "http",
    "https",
    "ws",
    "wss",
    "urn",
    "urn:uuid"
  ];
  function isValidSchemeName(name) {
    return supportedSchemeNames.indexOf(name) !== -1;
  }
  function wsIsSecure(wsComponent) {
    if (wsComponent.secure === true) {
      return true;
    } else if (wsComponent.secure === false) {
      return false;
    } else if (wsComponent.scheme) {
      return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
    } else {
      return false;
    }
  }
  function httpParse(component) {
    if (!component.host) {
      component.error = component.error || "HTTP URIs must have a host.";
    }
    return component;
  }
  function httpSerialize(component) {
    const secure = String(component.scheme).toLowerCase() === "https";
    if (component.port === (secure ? 443 : 80) || component.port === "") {
      component.port = undefined;
    }
    if (!component.path) {
      component.path = "/";
    }
    return component;
  }
  function wsParse(wsComponent) {
    wsComponent.secure = wsIsSecure(wsComponent);
    wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
    wsComponent.path = undefined;
    wsComponent.query = undefined;
    return wsComponent;
  }
  function wsSerialize(wsComponent) {
    if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") {
      wsComponent.port = undefined;
    }
    if (typeof wsComponent.secure === "boolean") {
      wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
      wsComponent.secure = undefined;
    }
    if (wsComponent.resourceName) {
      const [path8, query] = wsComponent.resourceName.split("?");
      wsComponent.path = path8 && path8 !== "/" ? path8 : undefined;
      wsComponent.query = query;
      wsComponent.resourceName = undefined;
    }
    wsComponent.fragment = undefined;
    return wsComponent;
  }
  function urnParse(urnComponent, options) {
    if (!urnComponent.path) {
      urnComponent.error = "URN can not be parsed";
      return urnComponent;
    }
    const matches = urnComponent.path.match(URN_REG);
    if (matches) {
      const scheme = options.scheme || urnComponent.scheme || "urn";
      urnComponent.nid = matches[1].toLowerCase();
      urnComponent.nss = matches[2];
      const urnScheme = `${scheme}:${options.nid || urnComponent.nid}`;
      const schemeHandler = getSchemeHandler(urnScheme);
      urnComponent.path = undefined;
      if (schemeHandler) {
        urnComponent = schemeHandler.parse(urnComponent, options);
      }
    } else {
      urnComponent.error = urnComponent.error || "URN can not be parsed.";
    }
    return urnComponent;
  }
  function urnSerialize(urnComponent, options) {
    if (urnComponent.nid === undefined) {
      throw new Error("URN without nid cannot be serialized");
    }
    const scheme = options.scheme || urnComponent.scheme || "urn";
    const nid = urnComponent.nid.toLowerCase();
    const urnScheme = `${scheme}:${options.nid || nid}`;
    const schemeHandler = getSchemeHandler(urnScheme);
    if (schemeHandler) {
      urnComponent = schemeHandler.serialize(urnComponent, options);
    }
    const uriComponent = urnComponent;
    const nss = urnComponent.nss;
    uriComponent.path = `${nid || options.nid}:${nss}`;
    options.skipEscape = true;
    return uriComponent;
  }
  function urnuuidParse(urnComponent, options) {
    const uuidComponent = urnComponent;
    uuidComponent.uuid = uuidComponent.nss;
    uuidComponent.nss = undefined;
    if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) {
      uuidComponent.error = uuidComponent.error || "UUID is not valid.";
    }
    return uuidComponent;
  }
  function urnuuidSerialize(uuidComponent) {
    const urnComponent = uuidComponent;
    urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
    return urnComponent;
  }
  var http = {
    scheme: "http",
    domainHost: true,
    parse: httpParse,
    serialize: httpSerialize
  };
  var https = {
    scheme: "https",
    domainHost: http.domainHost,
    parse: httpParse,
    serialize: httpSerialize
  };
  var ws = {
    scheme: "ws",
    domainHost: true,
    parse: wsParse,
    serialize: wsSerialize
  };
  var wss = {
    scheme: "wss",
    domainHost: ws.domainHost,
    parse: ws.parse,
    serialize: ws.serialize
  };
  var urn = {
    scheme: "urn",
    parse: urnParse,
    serialize: urnSerialize,
    skipNormalize: true
  };
  var urnuuid = {
    scheme: "urn:uuid",
    parse: urnuuidParse,
    serialize: urnuuidSerialize,
    skipNormalize: true
  };
  var SCHEMES = {
    http,
    https,
    ws,
    wss,
    urn,
    "urn:uuid": urnuuid
  };
  Object.setPrototypeOf(SCHEMES, null);
  function getSchemeHandler(scheme) {
    return scheme && (SCHEMES[scheme] || SCHEMES[scheme.toLowerCase()]) || undefined;
  }
  module.exports = {
    wsIsSecure,
    SCHEMES,
    isValidSchemeName,
    getSchemeHandler
  };
});

// node_modules/fast-uri/index.js
var require_fast_uri = __commonJS((exports, module) => {
  var { normalizeIPv6, removeDotSegments, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, escapePreservingEscapes, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
  var { SCHEMES, getSchemeHandler } = require_schemes();
  function normalize(uri, options) {
    if (typeof uri === "string") {
      uri = normalizeString(uri, options);
    } else if (typeof uri === "object") {
      uri = parse(serialize(uri, options), options);
    }
    return uri;
  }
  function resolve2(baseURI, relativeURI, options) {
    const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
    const resolved = resolveComponent(parse(baseURI, schemelessOptions), parse(relativeURI, schemelessOptions), schemelessOptions, true);
    schemelessOptions.skipEscape = true;
    return serialize(resolved, schemelessOptions);
  }
  function resolveComponent(base, relative2, options, skipNormalization) {
    const target = {};
    if (!skipNormalization) {
      base = parse(serialize(base, options), options);
      relative2 = parse(serialize(relative2, options), options);
    }
    options = options || {};
    if (!options.tolerant && relative2.scheme) {
      target.scheme = relative2.scheme;
      target.userinfo = relative2.userinfo;
      target.host = relative2.host;
      target.port = relative2.port;
      target.path = removeDotSegments(relative2.path || "");
      target.query = relative2.query;
    } else {
      if (relative2.userinfo !== undefined || relative2.host !== undefined || relative2.port !== undefined) {
        target.userinfo = relative2.userinfo;
        target.host = relative2.host;
        target.port = relative2.port;
        target.path = removeDotSegments(relative2.path || "");
        target.query = relative2.query;
      } else {
        if (!relative2.path) {
          target.path = base.path;
          if (relative2.query !== undefined) {
            target.query = relative2.query;
          } else {
            target.query = base.query;
          }
        } else {
          if (relative2.path[0] === "/") {
            target.path = removeDotSegments(relative2.path);
          } else {
            if ((base.userinfo !== undefined || base.host !== undefined || base.port !== undefined) && !base.path) {
              target.path = "/" + relative2.path;
            } else if (!base.path) {
              target.path = relative2.path;
            } else {
              target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative2.path;
            }
            target.path = removeDotSegments(target.path);
          }
          target.query = relative2.query;
        }
        target.userinfo = base.userinfo;
        target.host = base.host;
        target.port = base.port;
      }
      target.scheme = base.scheme;
    }
    target.fragment = relative2.fragment;
    return target;
  }
  function equal(uriA, uriB, options) {
    const normalizedA = normalizeComparableURI(uriA, options);
    const normalizedB = normalizeComparableURI(uriB, options);
    return normalizedA !== undefined && normalizedB !== undefined && normalizedA.toLowerCase() === normalizedB.toLowerCase();
  }
  function serialize(cmpts, opts) {
    const component = {
      host: cmpts.host,
      scheme: cmpts.scheme,
      userinfo: cmpts.userinfo,
      port: cmpts.port,
      path: cmpts.path,
      query: cmpts.query,
      nid: cmpts.nid,
      nss: cmpts.nss,
      uuid: cmpts.uuid,
      fragment: cmpts.fragment,
      reference: cmpts.reference,
      resourceName: cmpts.resourceName,
      secure: cmpts.secure,
      error: ""
    };
    const options = Object.assign({}, opts);
    const uriTokens = [];
    const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
    if (schemeHandler && schemeHandler.serialize)
      schemeHandler.serialize(component, options);
    if (component.path !== undefined) {
      if (!options.skipEscape) {
        component.path = escapePreservingEscapes(component.path);
        if (component.scheme !== undefined) {
          component.path = component.path.split("%3A").join(":");
        }
      } else {
        component.path = normalizePercentEncoding(component.path);
      }
    }
    if (options.reference !== "suffix" && component.scheme) {
      uriTokens.push(component.scheme, ":");
    }
    const authority = recomposeAuthority(component);
    if (authority !== undefined) {
      if (options.reference !== "suffix") {
        uriTokens.push("//");
      }
      uriTokens.push(authority);
      if (component.path && component.path[0] !== "/") {
        uriTokens.push("/");
      }
    }
    if (component.path !== undefined) {
      let s = component.path;
      if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
        s = removeDotSegments(s);
      }
      if (authority === undefined && s[0] === "/" && s[1] === "/") {
        s = "/%2F" + s.slice(2);
      }
      uriTokens.push(s);
    }
    if (component.query !== undefined) {
      uriTokens.push("?", component.query);
    }
    if (component.fragment !== undefined) {
      uriTokens.push("#", component.fragment);
    }
    return uriTokens.join("");
  }
  var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function getParseError(parsed, matches) {
    if (matches[2] !== undefined && parsed.path && parsed.path[0] !== "/") {
      return 'URI path must start with "/" when authority is present.';
    }
    if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) {
      return "URI port is malformed.";
    }
    return;
  }
  function parseWithStatus(uri, opts) {
    const options = Object.assign({}, opts);
    const parsed = {
      scheme: undefined,
      userinfo: undefined,
      host: "",
      port: undefined,
      path: "",
      query: undefined,
      fragment: undefined
    };
    let malformedAuthorityOrPort = false;
    let isIP = false;
    if (options.reference === "suffix") {
      if (options.scheme) {
        uri = options.scheme + ":" + uri;
      } else {
        uri = "//" + uri;
      }
    }
    const matches = uri.match(URI_PARSE);
    if (matches) {
      parsed.scheme = matches[1];
      parsed.userinfo = matches[3];
      parsed.host = matches[4];
      parsed.port = parseInt(matches[5], 10);
      parsed.path = matches[6] || "";
      parsed.query = matches[7];
      parsed.fragment = matches[8];
      if (isNaN(parsed.port)) {
        parsed.port = matches[5];
      }
      const parseError = getParseError(parsed, matches);
      if (parseError !== undefined) {
        parsed.error = parsed.error || parseError;
        malformedAuthorityOrPort = true;
      }
      if (parsed.host) {
        const ipv4result = isIPv4(parsed.host);
        if (ipv4result === false) {
          const ipv6result = normalizeIPv6(parsed.host);
          parsed.host = ipv6result.host.toLowerCase();
          isIP = ipv6result.isIPV6;
        } else {
          isIP = true;
        }
      }
      if (parsed.scheme === undefined && parsed.userinfo === undefined && parsed.host === undefined && parsed.port === undefined && parsed.query === undefined && !parsed.path) {
        parsed.reference = "same-document";
      } else if (parsed.scheme === undefined) {
        parsed.reference = "relative";
      } else if (parsed.fragment === undefined) {
        parsed.reference = "absolute";
      } else {
        parsed.reference = "uri";
      }
      if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) {
        parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
      }
      const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
      if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
        if (parsed.host && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) {
          try {
            parsed.host = URL.domainToASCII(parsed.host.toLowerCase());
          } catch (e) {
            parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
          }
        }
      }
      if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
        if (uri.indexOf("%") !== -1) {
          if (parsed.scheme !== undefined) {
            parsed.scheme = unescape(parsed.scheme);
          }
          if (parsed.host !== undefined) {
            parsed.host = reescapeHostDelimiters(unescape(parsed.host), isIP);
          }
        }
        if (parsed.path) {
          parsed.path = normalizePathEncoding(parsed.path);
        }
        if (parsed.fragment) {
          try {
            parsed.fragment = encodeURI(decodeURIComponent(parsed.fragment));
          } catch {
            parsed.error = parsed.error || "URI malformed";
          }
        }
      }
      if (schemeHandler && schemeHandler.parse) {
        schemeHandler.parse(parsed, options);
      }
    } else {
      parsed.error = parsed.error || "URI can not be parsed.";
    }
    return { parsed, malformedAuthorityOrPort };
  }
  function parse(uri, opts) {
    return parseWithStatus(uri, opts).parsed;
  }
  function normalizeString(uri, opts) {
    return normalizeStringWithStatus(uri, opts).normalized;
  }
  function normalizeStringWithStatus(uri, opts) {
    const { parsed, malformedAuthorityOrPort } = parseWithStatus(uri, opts);
    return {
      normalized: malformedAuthorityOrPort ? uri : serialize(parsed, opts),
      malformedAuthorityOrPort
    };
  }
  function normalizeComparableURI(uri, opts) {
    if (typeof uri === "string") {
      const { normalized, malformedAuthorityOrPort } = normalizeStringWithStatus(uri, opts);
      return malformedAuthorityOrPort ? undefined : normalized;
    }
    if (typeof uri === "object") {
      return serialize(uri, opts);
    }
  }
  var fastUri = {
    SCHEMES,
    normalize,
    resolve: resolve2,
    resolveComponent,
    equal,
    serialize,
    parse
  };
  module.exports = fastUri;
  module.exports.default = fastUri;
  module.exports.fastUri = fastUri;
});

// node_modules/ajv/dist/runtime/uri.js
var require_uri = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var uri = require_fast_uri();
  uri.code = 'require("ajv/dist/runtime/uri").default';
  exports.default = uri;
});

// node_modules/ajv/dist/core.js
var require_core = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = undefined;
  var validate_1 = require_validate();
  Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
    return validate_1.KeywordCxt;
  } });
  var codegen_1 = require_codegen();
  Object.defineProperty(exports, "_", { enumerable: true, get: function() {
    return codegen_1._;
  } });
  Object.defineProperty(exports, "str", { enumerable: true, get: function() {
    return codegen_1.str;
  } });
  Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
    return codegen_1.stringify;
  } });
  Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
    return codegen_1.nil;
  } });
  Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
    return codegen_1.Name;
  } });
  Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
    return codegen_1.CodeGen;
  } });
  var validation_error_1 = require_validation_error();
  var ref_error_1 = require_ref_error();
  var rules_1 = require_rules();
  var compile_1 = require_compile();
  var codegen_2 = require_codegen();
  var resolve_1 = require_resolve();
  var dataType_1 = require_dataType();
  var util_1 = require_util();
  var $dataRefSchema = require_data();
  var uri_1 = require_uri();
  var defaultRegExp = (str, flags) => new RegExp(str, flags);
  defaultRegExp.code = "new RegExp";
  var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
  var EXT_SCOPE_NAMES = new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]);
  var removedOptions = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  };
  var deprecatedOptions = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  };
  var MAX_EXPRESSION = 200;
  function requiredOptions(o) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    const s = o.strict;
    const _optz = (_a = o.code) === null || _a === undefined ? undefined : _a.optimize;
    const optimize = _optz === true || _optz === undefined ? 1 : _optz || 0;
    const regExp = (_c = (_b = o.code) === null || _b === undefined ? undefined : _b.regExp) !== null && _c !== undefined ? _c : defaultRegExp;
    const uriResolver = (_d = o.uriResolver) !== null && _d !== undefined ? _d : uri_1.default;
    return {
      strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== undefined ? _e : s) !== null && _f !== undefined ? _f : true,
      strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== undefined ? _g : s) !== null && _h !== undefined ? _h : true,
      strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== undefined ? _j : s) !== null && _k !== undefined ? _k : "log",
      strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== undefined ? _l : s) !== null && _m !== undefined ? _m : "log",
      strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== undefined ? _o : s) !== null && _p !== undefined ? _p : false,
      code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
      loopRequired: (_q = o.loopRequired) !== null && _q !== undefined ? _q : MAX_EXPRESSION,
      loopEnum: (_r = o.loopEnum) !== null && _r !== undefined ? _r : MAX_EXPRESSION,
      meta: (_s = o.meta) !== null && _s !== undefined ? _s : true,
      messages: (_t = o.messages) !== null && _t !== undefined ? _t : true,
      inlineRefs: (_u = o.inlineRefs) !== null && _u !== undefined ? _u : true,
      schemaId: (_v = o.schemaId) !== null && _v !== undefined ? _v : "$id",
      addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== undefined ? _w : true,
      validateSchema: (_x = o.validateSchema) !== null && _x !== undefined ? _x : true,
      validateFormats: (_y = o.validateFormats) !== null && _y !== undefined ? _y : true,
      unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== undefined ? _z : true,
      int32range: (_0 = o.int32range) !== null && _0 !== undefined ? _0 : true,
      uriResolver
    };
  }

  class Ajv {
    constructor(opts = {}) {
      this.schemas = {};
      this.refs = {};
      this.formats = Object.create(null);
      this._compilations = new Set;
      this._loading = {};
      this._cache = new Map;
      opts = this.opts = { ...opts, ...requiredOptions(opts) };
      const { es5, lines } = this.opts.code;
      this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
      this.logger = getLogger(opts.logger);
      const formatOpt = opts.validateFormats;
      opts.validateFormats = false;
      this.RULES = (0, rules_1.getRules)();
      checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
      checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
      this._metaOpts = getMetaSchemaOptions.call(this);
      if (opts.formats)
        addInitialFormats.call(this);
      this._addVocabularies();
      this._addDefaultMetaSchema();
      if (opts.keywords)
        addInitialKeywords.call(this, opts.keywords);
      if (typeof opts.meta == "object")
        this.addMetaSchema(opts.meta);
      addInitialSchemas.call(this);
      opts.validateFormats = formatOpt;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data, meta, schemaId } = this.opts;
      let _dataRefSchema = $dataRefSchema;
      if (schemaId === "id") {
        _dataRefSchema = { ...$dataRefSchema };
        _dataRefSchema.id = _dataRefSchema.$id;
        delete _dataRefSchema.$id;
      }
      if (meta && $data)
        this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
    }
    defaultMeta() {
      const { meta, schemaId } = this.opts;
      return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : undefined;
    }
    validate(schemaKeyRef, data) {
      let v;
      if (typeof schemaKeyRef == "string") {
        v = this.getSchema(schemaKeyRef);
        if (!v)
          throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
      } else {
        v = this.compile(schemaKeyRef);
      }
      const valid = v(data);
      if (!("$async" in v))
        this.errors = v.errors;
      return valid;
    }
    compile(schema, _meta) {
      const sch = this._addSchema(schema, _meta);
      return sch.validate || this._compileSchemaEnv(sch);
    }
    compileAsync(schema, meta) {
      if (typeof this.opts.loadSchema != "function") {
        throw new Error("options.loadSchema should be a function");
      }
      const { loadSchema } = this.opts;
      return runCompileAsync.call(this, schema, meta);
      async function runCompileAsync(_schema, _meta) {
        await loadMetaSchema.call(this, _schema.$schema);
        const sch = this._addSchema(_schema, _meta);
        return sch.validate || _compileAsync.call(this, sch);
      }
      async function loadMetaSchema($ref) {
        if ($ref && !this.getSchema($ref)) {
          await runCompileAsync.call(this, { $ref }, true);
        }
      }
      async function _compileAsync(sch) {
        try {
          return this._compileSchemaEnv(sch);
        } catch (e) {
          if (!(e instanceof ref_error_1.default))
            throw e;
          checkLoaded.call(this, e);
          await loadMissingSchema.call(this, e.missingSchema);
          return _compileAsync.call(this, sch);
        }
      }
      function checkLoaded({ missingSchema: ref, missingRef }) {
        if (this.refs[ref]) {
          throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
        }
      }
      async function loadMissingSchema(ref) {
        const _schema = await _loadSchema.call(this, ref);
        if (!this.refs[ref])
          await loadMetaSchema.call(this, _schema.$schema);
        if (!this.refs[ref])
          this.addSchema(_schema, ref, meta);
      }
      async function _loadSchema(ref) {
        const p = this._loading[ref];
        if (p)
          return p;
        try {
          return await (this._loading[ref] = loadSchema(ref));
        } finally {
          delete this._loading[ref];
        }
      }
    }
    addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
      if (Array.isArray(schema)) {
        for (const sch of schema)
          this.addSchema(sch, undefined, _meta, _validateSchema);
        return this;
      }
      let id;
      if (typeof schema === "object") {
        const { schemaId } = this.opts;
        id = schema[schemaId];
        if (id !== undefined && typeof id != "string") {
          throw new Error(`schema ${schemaId} must be string`);
        }
      }
      key = (0, resolve_1.normalizeId)(key || id);
      this._checkUnique(key);
      this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
      return this;
    }
    addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
      this.addSchema(schema, key, true, _validateSchema);
      return this;
    }
    validateSchema(schema, throwOrLogError) {
      if (typeof schema == "boolean")
        return true;
      let $schema;
      $schema = schema.$schema;
      if ($schema !== undefined && typeof $schema != "string") {
        throw new Error("$schema must be a string");
      }
      $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
      if (!$schema) {
        this.logger.warn("meta-schema not available");
        this.errors = null;
        return true;
      }
      const valid = this.validate($schema, schema);
      if (!valid && throwOrLogError) {
        const message = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(message);
        else
          throw new Error(message);
      }
      return valid;
    }
    getSchema(keyRef) {
      let sch;
      while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
        keyRef = sch;
      if (sch === undefined) {
        const { schemaId } = this.opts;
        const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
        sch = compile_1.resolveSchema.call(this, root, keyRef);
        if (!sch)
          return;
        this.refs[keyRef] = sch;
      }
      return sch.validate || this._compileSchemaEnv(sch);
    }
    removeSchema(schemaKeyRef) {
      if (schemaKeyRef instanceof RegExp) {
        this._removeAllSchemas(this.schemas, schemaKeyRef);
        this._removeAllSchemas(this.refs, schemaKeyRef);
        return this;
      }
      switch (typeof schemaKeyRef) {
        case "undefined":
          this._removeAllSchemas(this.schemas);
          this._removeAllSchemas(this.refs);
          this._cache.clear();
          return this;
        case "string": {
          const sch = getSchEnv.call(this, schemaKeyRef);
          if (typeof sch == "object")
            this._cache.delete(sch.schema);
          delete this.schemas[schemaKeyRef];
          delete this.refs[schemaKeyRef];
          return this;
        }
        case "object": {
          const cacheKey = schemaKeyRef;
          this._cache.delete(cacheKey);
          let id = schemaKeyRef[this.opts.schemaId];
          if (id) {
            id = (0, resolve_1.normalizeId)(id);
            delete this.schemas[id];
            delete this.refs[id];
          }
          return this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    addVocabulary(definitions) {
      for (const def of definitions)
        this.addKeyword(def);
      return this;
    }
    addKeyword(kwdOrDef, def) {
      let keyword;
      if (typeof kwdOrDef == "string") {
        keyword = kwdOrDef;
        if (typeof def == "object") {
          this.logger.warn("these parameters are deprecated, see docs for addKeyword");
          def.keyword = keyword;
        }
      } else if (typeof kwdOrDef == "object" && def === undefined) {
        def = kwdOrDef;
        keyword = def.keyword;
        if (Array.isArray(keyword) && !keyword.length) {
          throw new Error("addKeywords: keyword must be string or non-empty array");
        }
      } else {
        throw new Error("invalid addKeywords parameters");
      }
      checkKeyword.call(this, keyword, def);
      if (!def) {
        (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
        return this;
      }
      keywordMetaschema.call(this, def);
      const definition = {
        ...def,
        type: (0, dataType_1.getJSONTypes)(def.type),
        schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
      };
      (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
      return this;
    }
    getKeyword(keyword) {
      const rule = this.RULES.all[keyword];
      return typeof rule == "object" ? rule.definition : !!rule;
    }
    removeKeyword(keyword) {
      const { RULES } = this;
      delete RULES.keywords[keyword];
      delete RULES.all[keyword];
      for (const group of RULES.rules) {
        const i = group.rules.findIndex((rule) => rule.keyword === keyword);
        if (i >= 0)
          group.rules.splice(i, 1);
      }
      return this;
    }
    addFormat(name, format) {
      if (typeof format == "string")
        format = new RegExp(format);
      this.formats[name] = format;
      return this;
    }
    errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
      if (!errors || errors.length === 0)
        return "No errors";
      return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
    }
    $dataMetaSchema(metaSchema, keywordsJsonPointers) {
      const rules = this.RULES.all;
      metaSchema = JSON.parse(JSON.stringify(metaSchema));
      for (const jsonPointer of keywordsJsonPointers) {
        const segments = jsonPointer.split("/").slice(1);
        let keywords = metaSchema;
        for (const seg of segments)
          keywords = keywords[seg];
        for (const key in rules) {
          const rule = rules[key];
          if (typeof rule != "object")
            continue;
          const { $data } = rule.definition;
          const schema = keywords[key];
          if ($data && schema)
            keywords[key] = schemaOrData(schema);
        }
      }
      return metaSchema;
    }
    _removeAllSchemas(schemas, regex) {
      for (const keyRef in schemas) {
        const sch = schemas[keyRef];
        if (!regex || regex.test(keyRef)) {
          if (typeof sch == "string") {
            delete schemas[keyRef];
          } else if (sch && !sch.meta) {
            this._cache.delete(sch.schema);
            delete schemas[keyRef];
          }
        }
      }
    }
    _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
      let id;
      const { schemaId } = this.opts;
      if (typeof schema == "object") {
        id = schema[schemaId];
      } else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        else if (typeof schema != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let sch = this._cache.get(schema);
      if (sch !== undefined)
        return sch;
      baseId = (0, resolve_1.normalizeId)(id || baseId);
      const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
      sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
      this._cache.set(sch.schema, sch);
      if (addSchema && !baseId.startsWith("#")) {
        if (baseId)
          this._checkUnique(baseId);
        this.refs[baseId] = sch;
      }
      if (validateSchema)
        this.validateSchema(schema, true);
      return sch;
    }
    _checkUnique(id) {
      if (this.schemas[id] || this.refs[id]) {
        throw new Error(`schema with key or id "${id}" already exists`);
      }
    }
    _compileSchemaEnv(sch) {
      if (sch.meta)
        this._compileMetaSchema(sch);
      else
        compile_1.compileSchema.call(this, sch);
      if (!sch.validate)
        throw new Error("ajv implementation error");
      return sch.validate;
    }
    _compileMetaSchema(sch) {
      const currentOpts = this.opts;
      this.opts = this._metaOpts;
      try {
        compile_1.compileSchema.call(this, sch);
      } finally {
        this.opts = currentOpts;
      }
    }
  }
  Ajv.ValidationError = validation_error_1.default;
  Ajv.MissingRefError = ref_error_1.default;
  exports.default = Ajv;
  function checkOptions(checkOpts, options, msg, log = "error") {
    for (const key in checkOpts) {
      const opt = key;
      if (opt in options)
        this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
    }
  }
  function getSchEnv(keyRef) {
    keyRef = (0, resolve_1.normalizeId)(keyRef);
    return this.schemas[keyRef] || this.refs[keyRef];
  }
  function addInitialSchemas() {
    const optsSchemas = this.opts.schemas;
    if (!optsSchemas)
      return;
    if (Array.isArray(optsSchemas))
      this.addSchema(optsSchemas);
    else
      for (const key in optsSchemas)
        this.addSchema(optsSchemas[key], key);
  }
  function addInitialFormats() {
    for (const name in this.opts.formats) {
      const format = this.opts.formats[name];
      if (format)
        this.addFormat(name, format);
    }
  }
  function addInitialKeywords(defs) {
    if (Array.isArray(defs)) {
      this.addVocabulary(defs);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const keyword in defs) {
      const def = defs[keyword];
      if (!def.keyword)
        def.keyword = keyword;
      this.addKeyword(def);
    }
  }
  function getMetaSchemaOptions() {
    const metaOpts = { ...this.opts };
    for (const opt of META_IGNORE_OPTIONS)
      delete metaOpts[opt];
    return metaOpts;
  }
  var noLogs = { log() {}, warn() {}, error() {} };
  function getLogger(logger) {
    if (logger === false)
      return noLogs;
    if (logger === undefined)
      return console;
    if (logger.log && logger.warn && logger.error)
      return logger;
    throw new Error("logger must implement log, warn and error methods");
  }
  var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
  function checkKeyword(keyword, def) {
    const { RULES } = this;
    (0, util_1.eachItem)(keyword, (kwd) => {
      if (RULES.keywords[kwd])
        throw new Error(`Keyword ${kwd} is already defined`);
      if (!KEYWORD_NAME.test(kwd))
        throw new Error(`Keyword ${kwd} has invalid name`);
    });
    if (!def)
      return;
    if (def.$data && !(("code" in def) || ("validate" in def))) {
      throw new Error('$data keyword must have "code" or "validate" function');
    }
  }
  function addRule(keyword, definition, dataType) {
    var _a;
    const post = definition === null || definition === undefined ? undefined : definition.post;
    if (dataType && post)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES } = this;
    let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
    if (!ruleGroup) {
      ruleGroup = { type: dataType, rules: [] };
      RULES.rules.push(ruleGroup);
    }
    RULES.keywords[keyword] = true;
    if (!definition)
      return;
    const rule = {
      keyword,
      definition: {
        ...definition,
        type: (0, dataType_1.getJSONTypes)(definition.type),
        schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
      }
    };
    if (definition.before)
      addBeforeRule.call(this, ruleGroup, rule, definition.before);
    else
      ruleGroup.rules.push(rule);
    RULES.all[keyword] = rule;
    (_a = definition.implements) === null || _a === undefined || _a.forEach((kwd) => this.addKeyword(kwd));
  }
  function addBeforeRule(ruleGroup, rule, before) {
    const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
    if (i >= 0) {
      ruleGroup.rules.splice(i, 0, rule);
    } else {
      ruleGroup.rules.push(rule);
      this.logger.warn(`rule ${before} is not defined`);
    }
  }
  function keywordMetaschema(def) {
    let { metaSchema } = def;
    if (metaSchema === undefined)
      return;
    if (def.$data && this.opts.$data)
      metaSchema = schemaOrData(metaSchema);
    def.validateSchema = this.compile(metaSchema, true);
  }
  var $dataRef = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function schemaOrData(schema) {
    return { anyOf: [schema, $dataRef] };
  }
});

// node_modules/ajv/dist/vocabularies/core/id.js
var require_id = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var def = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.callRef = exports.getValidate = undefined;
  var ref_error_1 = require_ref_error();
  var code_1 = require_code2();
  var codegen_1 = require_codegen();
  var names_1 = require_names();
  var compile_1 = require_compile();
  var util_1 = require_util();
  var def = {
    keyword: "$ref",
    schemaType: "string",
    code(cxt) {
      const { gen, schema: $ref, it } = cxt;
      const { baseId, schemaEnv: env2, validateName, opts, self } = it;
      const { root } = env2;
      if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
        return callRootRef();
      const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
      if (schOrEnv === undefined)
        throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
      if (schOrEnv instanceof compile_1.SchemaEnv)
        return callValidate(schOrEnv);
      return inlineRefSchema(schOrEnv);
      function callRootRef() {
        if (env2 === root)
          return callRef(cxt, validateName, env2, env2.$async);
        const rootName = gen.scopeValue("root", { ref: root });
        return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
      }
      function callValidate(sch) {
        const v = getValidate(cxt, sch);
        callRef(cxt, v, sch, sch.$async);
      }
      function inlineRefSchema(sch) {
        const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
        const valid = gen.name("valid");
        const schCxt = cxt.subschema({
          schema: sch,
          dataTypes: [],
          schemaPath: codegen_1.nil,
          topSchemaRef: schName,
          errSchemaPath: $ref
        }, valid);
        cxt.mergeEvaluated(schCxt);
        cxt.ok(valid);
      }
    }
  };
  function getValidate(cxt, sch) {
    const { gen } = cxt;
    return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
  }
  exports.getValidate = getValidate;
  function callRef(cxt, v, sch, $async) {
    const { gen, it } = cxt;
    const { allErrors, schemaEnv: env2, opts } = it;
    const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
    if ($async)
      callAsyncRef();
    else
      callSyncRef();
    function callAsyncRef() {
      if (!env2.$async)
        throw new Error("async schema referenced by sync schema");
      const valid = gen.let("valid");
      gen.try(() => {
        gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
        addEvaluatedFrom(v);
        if (!allErrors)
          gen.assign(valid, true);
      }, (e) => {
        gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
        addErrorsFrom(e);
        if (!allErrors)
          gen.assign(valid, false);
      });
      cxt.ok(valid);
    }
    function callSyncRef() {
      cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
    }
    function addErrorsFrom(source) {
      const errs = (0, codegen_1._)`${source}.errors`;
      gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
      gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
    }
    function addEvaluatedFrom(source) {
      var _a;
      if (!it.opts.unevaluated)
        return;
      const schEvaluated = (_a = sch === null || sch === undefined ? undefined : sch.validate) === null || _a === undefined ? undefined : _a.evaluated;
      if (it.props !== true) {
        if (schEvaluated && !schEvaluated.dynamicProps) {
          if (schEvaluated.props !== undefined) {
            it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
          }
        } else {
          const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
          it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
        }
      }
      if (it.items !== true) {
        if (schEvaluated && !schEvaluated.dynamicItems) {
          if (schEvaluated.items !== undefined) {
            it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
          }
        } else {
          const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
          it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
        }
      }
    }
  }
  exports.callRef = callRef;
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/core/index.js
var require_core2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var id_1 = require_id();
  var ref_1 = require_ref();
  var core = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    id_1.default,
    ref_1.default
  ];
  exports.default = core;
});

// node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var ops = codegen_1.operators;
  var KWDs = {
    maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
    minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
    exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
    exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
  };
  var error = {
    message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
    params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
  };
  var def = {
    keyword: Object.keys(KWDs),
    type: "number",
    schemaType: "number",
    $data: true,
    error,
    code(cxt) {
      const { keyword, data, schemaCode } = cxt;
      cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var error = {
    message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
    params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
  };
  var def = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: true,
    error,
    code(cxt) {
      const { gen, data, schemaCode, it } = cxt;
      const prec = it.opts.multipleOfPrecision;
      const res = gen.let("res");
      const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
      cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  function ucs2length(str) {
    const len = str.length;
    let length = 0;
    let pos = 0;
    let value;
    while (pos < len) {
      length++;
      value = str.charCodeAt(pos++);
      if (value >= 55296 && value <= 56319 && pos < len) {
        value = str.charCodeAt(pos);
        if ((value & 64512) === 56320)
          pos++;
      }
    }
    return length;
  }
  exports.default = ucs2length;
  ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
});

// node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var ucs2length_1 = require_ucs2length();
  var error = {
    message({ keyword, schemaCode }) {
      const comp = keyword === "maxLength" ? "more" : "fewer";
      return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
    },
    params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
  };
  var def = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: true,
    error,
    code(cxt) {
      const { keyword, data, schemaCode, it } = cxt;
      const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
      const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
      cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var code_1 = require_code2();
  var util_1 = require_util();
  var codegen_1 = require_codegen();
  var error = {
    message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
    params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
  };
  var def = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: true,
    error,
    code(cxt) {
      const { gen, data, $data, schema, schemaCode, it } = cxt;
      const u = it.opts.unicodeRegExp ? "u" : "";
      if ($data) {
        const { regExp } = it.opts.code;
        const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
        const valid = gen.let("valid");
        gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
        cxt.fail$data((0, codegen_1._)`!${valid}`);
      } else {
        const regExp = (0, code_1.usePattern)(cxt, schema);
        cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
      }
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var error = {
    message({ keyword, schemaCode }) {
      const comp = keyword === "maxProperties" ? "more" : "fewer";
      return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
    },
    params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
  };
  var def = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: true,
    error,
    code(cxt) {
      const { keyword, data, schemaCode } = cxt;
      const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
      cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var code_1 = require_code2();
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var error = {
    message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
    params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
  };
  var def = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: true,
    error,
    code(cxt) {
      const { gen, schema, schemaCode, data, $data, it } = cxt;
      const { opts } = it;
      if (!$data && schema.length === 0)
        return;
      const useLoop = schema.length >= opts.loopRequired;
      if (it.allErrors)
        allErrorsMode();
      else
        exitOnErrorMode();
      if (opts.strictRequired) {
        const props = cxt.parentSchema.properties;
        const { definedProperties } = cxt.it;
        for (const requiredKey of schema) {
          if ((props === null || props === undefined ? undefined : props[requiredKey]) === undefined && !definedProperties.has(requiredKey)) {
            const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
            const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
            (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
          }
        }
      }
      function allErrorsMode() {
        if (useLoop || $data) {
          cxt.block$data(codegen_1.nil, loopAllRequired);
        } else {
          for (const prop of schema) {
            (0, code_1.checkReportMissingProp)(cxt, prop);
          }
        }
      }
      function exitOnErrorMode() {
        const missing = gen.let("missing");
        if (useLoop || $data) {
          const valid = gen.let("valid", true);
          cxt.block$data(valid, () => loopUntilMissing(missing, valid));
          cxt.ok(valid);
        } else {
          gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
          (0, code_1.reportMissingProp)(cxt, missing);
          gen.else();
        }
      }
      function loopAllRequired() {
        gen.forOf("prop", schemaCode, (prop) => {
          cxt.setParams({ missingProperty: prop });
          gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
        });
      }
      function loopUntilMissing(missing, valid) {
        cxt.setParams({ missingProperty: missing });
        gen.forOf(missing, schemaCode, () => {
          gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error();
            gen.break();
          });
        }, codegen_1.nil);
      }
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var error = {
    message({ keyword, schemaCode }) {
      const comp = keyword === "maxItems" ? "more" : "fewer";
      return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
    },
    params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
  };
  var def = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: true,
    error,
    code(cxt) {
      const { keyword, data, schemaCode } = cxt;
      const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
      cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var equal = require_fast_deep_equal();
  equal.code = 'require("ajv/dist/runtime/equal").default';
  exports.default = equal;
});

// node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var dataType_1 = require_dataType();
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var equal_1 = require_equal();
  var error = {
    message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
    params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
  };
  var def = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: true,
    error,
    code(cxt) {
      const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
      if (!$data && !schema)
        return;
      const valid = gen.let("valid");
      const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
      cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
      cxt.ok(valid);
      function validateUniqueItems() {
        const i = gen.let("i", (0, codegen_1._)`${data}.length`);
        const j = gen.let("j");
        cxt.setParams({ i, j });
        gen.assign(valid, true);
        gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
      }
      function canOptimize() {
        return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
      }
      function loopN(i, j) {
        const item = gen.name("item");
        const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
        const indices = gen.const("indices", (0, codegen_1._)`{}`);
        gen.for((0, codegen_1._)`;${i}--;`, () => {
          gen.let(item, (0, codegen_1._)`${data}[${i}]`);
          gen.if(wrongType, (0, codegen_1._)`continue`);
          if (itemTypes.length > 1)
            gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
          gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
            gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
            cxt.error();
            gen.assign(valid, false).break();
          }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
        });
      }
      function loopN2(i, j) {
        const eql = (0, util_1.useFunc)(gen, equal_1.default);
        const outer = gen.name("outer");
        gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
          cxt.error();
          gen.assign(valid, false).break(outer);
        })));
      }
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var equal_1 = require_equal();
  var error = {
    message: "must be equal to constant",
    params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
  };
  var def = {
    keyword: "const",
    $data: true,
    error,
    code(cxt) {
      const { gen, data, $data, schemaCode, schema } = cxt;
      if ($data || schema && typeof schema == "object") {
        cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
      } else {
        cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
      }
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var equal_1 = require_equal();
  var error = {
    message: "must be equal to one of the allowed values",
    params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
  };
  var def = {
    keyword: "enum",
    schemaType: "array",
    $data: true,
    error,
    code(cxt) {
      const { gen, data, $data, schema, schemaCode, it } = cxt;
      if (!$data && schema.length === 0)
        throw new Error("enum must have non-empty array");
      const useLoop = schema.length >= it.opts.loopEnum;
      let eql;
      const getEql = () => eql !== null && eql !== undefined ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
      let valid;
      if (useLoop || $data) {
        valid = gen.let("valid");
        cxt.block$data(valid, loopEnum);
      } else {
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        const vSchema = gen.const("vSchema", schemaCode);
        valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
      }
      cxt.pass(valid);
      function loopEnum() {
        gen.assign(valid, false);
        gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
      }
      function equalCode(vSchema, i) {
        const sch = schema[i];
        return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
      }
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var limitNumber_1 = require_limitNumber();
  var multipleOf_1 = require_multipleOf();
  var limitLength_1 = require_limitLength();
  var pattern_1 = require_pattern();
  var limitProperties_1 = require_limitProperties();
  var required_1 = require_required();
  var limitItems_1 = require_limitItems();
  var uniqueItems_1 = require_uniqueItems();
  var const_1 = require_const();
  var enum_1 = require_enum();
  var validation = [
    limitNumber_1.default,
    multipleOf_1.default,
    limitLength_1.default,
    pattern_1.default,
    limitProperties_1.default,
    required_1.default,
    limitItems_1.default,
    uniqueItems_1.default,
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    const_1.default,
    enum_1.default
  ];
  exports.default = validation;
});

// node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.validateAdditionalItems = undefined;
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var error = {
    message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
    params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
  };
  var def = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error,
    code(cxt) {
      const { parentSchema, it } = cxt;
      const { items } = parentSchema;
      if (!Array.isArray(items)) {
        (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      validateAdditionalItems(cxt, items);
    }
  };
  function validateAdditionalItems(cxt, items) {
    const { gen, schema, data, keyword, it } = cxt;
    it.items = true;
    const len = gen.const("len", (0, codegen_1._)`${data}.length`);
    if (schema === false) {
      cxt.setParams({ len: items.length });
      cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
    } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
      const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
      gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
      cxt.ok(valid);
    }
    function validateItems(valid) {
      gen.forRange("i", items.length, len, (i) => {
        cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
        if (!it.allErrors)
          gen.if((0, codegen_1.not)(valid), () => gen.break());
      });
    }
  }
  exports.validateAdditionalItems = validateAdditionalItems;
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.validateTuple = undefined;
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var code_1 = require_code2();
  var def = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(cxt) {
      const { schema, it } = cxt;
      if (Array.isArray(schema))
        return validateTuple(cxt, "additionalItems", schema);
      it.items = true;
      if ((0, util_1.alwaysValidSchema)(it, schema))
        return;
      cxt.ok((0, code_1.validateArray)(cxt));
    }
  };
  function validateTuple(cxt, extraItems, schArr = cxt.schema) {
    const { gen, parentSchema, data, keyword, it } = cxt;
    checkStrictTuple(parentSchema);
    if (it.opts.unevaluated && schArr.length && it.items !== true) {
      it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
    }
    const valid = gen.name("valid");
    const len = gen.const("len", (0, codegen_1._)`${data}.length`);
    schArr.forEach((sch, i) => {
      if ((0, util_1.alwaysValidSchema)(it, sch))
        return;
      gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
        keyword,
        schemaProp: i,
        dataProp: i
      }, valid));
      cxt.ok(valid);
    });
    function checkStrictTuple(sch) {
      const { opts, errSchemaPath } = it;
      const l = schArr.length;
      const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
      if (opts.strictTuples && !fullTuple) {
        const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
        (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
      }
    }
  }
  exports.validateTuple = validateTuple;
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var items_1 = require_items();
  var def = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var code_1 = require_code2();
  var additionalItems_1 = require_additionalItems();
  var error = {
    message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
    params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
  };
  var def = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error,
    code(cxt) {
      const { schema, parentSchema, it } = cxt;
      const { prefixItems } = parentSchema;
      it.items = true;
      if ((0, util_1.alwaysValidSchema)(it, schema))
        return;
      if (prefixItems)
        (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
      else
        cxt.ok((0, code_1.validateArray)(cxt));
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var error = {
    message: ({ params: { min, max } }) => max === undefined ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
    params: ({ params: { min, max } }) => max === undefined ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
  };
  var def = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: true,
    error,
    code(cxt) {
      const { gen, schema, parentSchema, data, it } = cxt;
      let min;
      let max;
      const { minContains, maxContains } = parentSchema;
      if (it.opts.next) {
        min = minContains === undefined ? 1 : minContains;
        max = maxContains;
      } else {
        min = 1;
      }
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      cxt.setParams({ min, max });
      if (max === undefined && min === 0) {
        (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
        return;
      }
      if (max !== undefined && min > max) {
        (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
        cxt.fail();
        return;
      }
      if ((0, util_1.alwaysValidSchema)(it, schema)) {
        let cond = (0, codegen_1._)`${len} >= ${min}`;
        if (max !== undefined)
          cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
        cxt.pass(cond);
        return;
      }
      it.items = true;
      const valid = gen.name("valid");
      if (max === undefined && min === 1) {
        validateItems(valid, () => gen.if(valid, () => gen.break()));
      } else if (min === 0) {
        gen.let(valid, true);
        if (max !== undefined)
          gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
      } else {
        gen.let(valid, false);
        validateItemsWithCount();
      }
      cxt.result(valid, () => cxt.reset());
      function validateItemsWithCount() {
        const schValid = gen.name("_valid");
        const count = gen.let("count", 0);
        validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
      }
      function validateItems(_valid, block) {
        gen.forRange("i", 0, len, (i) => {
          cxt.subschema({
            keyword: "contains",
            dataProp: i,
            dataPropType: util_1.Type.Num,
            compositeRule: true
          }, _valid);
          block();
        });
      }
      function checkLimits(count) {
        gen.code((0, codegen_1._)`${count}++`);
        if (max === undefined) {
          gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
        } else {
          gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
          if (min === 1)
            gen.assign(valid, true);
          else
            gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
        }
      }
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = undefined;
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var code_1 = require_code2();
  exports.error = {
    message: ({ params: { property, depsCount, deps } }) => {
      const property_ies = depsCount === 1 ? "property" : "properties";
      return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
    },
    params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
  };
  var def = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: exports.error,
    code(cxt) {
      const [propDeps, schDeps] = splitDependencies(cxt);
      validatePropertyDeps(cxt, propDeps);
      validateSchemaDeps(cxt, schDeps);
    }
  };
  function splitDependencies({ schema }) {
    const propertyDeps = {};
    const schemaDeps = {};
    for (const key in schema) {
      if (key === "__proto__")
        continue;
      const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
      deps[key] = schema[key];
    }
    return [propertyDeps, schemaDeps];
  }
  function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
    const { gen, data, it } = cxt;
    if (Object.keys(propertyDeps).length === 0)
      return;
    const missing = gen.let("missing");
    for (const prop in propertyDeps) {
      const deps = propertyDeps[prop];
      if (deps.length === 0)
        continue;
      const hasProperty2 = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
      cxt.setParams({
        property: prop,
        depsCount: deps.length,
        deps: deps.join(", ")
      });
      if (it.allErrors) {
        gen.if(hasProperty2, () => {
          for (const depProp of deps) {
            (0, code_1.checkReportMissingProp)(cxt, depProp);
          }
        });
      } else {
        gen.if((0, codegen_1._)`${hasProperty2} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
        (0, code_1.reportMissingProp)(cxt, missing);
        gen.else();
      }
    }
  }
  exports.validatePropertyDeps = validatePropertyDeps;
  function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
    const { gen, data, keyword, it } = cxt;
    const valid = gen.name("valid");
    for (const prop in schemaDeps) {
      if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
        continue;
      gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties), () => {
        const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
        cxt.mergeValidEvaluated(schCxt, valid);
      }, () => gen.var(valid, true));
      cxt.ok(valid);
    }
  }
  exports.validateSchemaDeps = validateSchemaDeps;
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var error = {
    message: "property name must be valid",
    params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
  };
  var def = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error,
    code(cxt) {
      const { gen, schema, data, it } = cxt;
      if ((0, util_1.alwaysValidSchema)(it, schema))
        return;
      const valid = gen.name("valid");
      gen.forIn("key", data, (key) => {
        cxt.setParams({ propertyName: key });
        cxt.subschema({
          keyword: "propertyNames",
          data: key,
          dataTypes: ["string"],
          propertyName: key,
          compositeRule: true
        }, valid);
        gen.if((0, codegen_1.not)(valid), () => {
          cxt.error(true);
          if (!it.allErrors)
            gen.break();
        });
      });
      cxt.ok(valid);
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var code_1 = require_code2();
  var codegen_1 = require_codegen();
  var names_1 = require_names();
  var util_1 = require_util();
  var error = {
    message: "must NOT have additional properties",
    params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
  };
  var def = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: true,
    trackErrors: true,
    error,
    code(cxt) {
      const { gen, schema, parentSchema, data, errsCount, it } = cxt;
      if (!errsCount)
        throw new Error("ajv implementation error");
      const { allErrors, opts } = it;
      it.props = true;
      if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema))
        return;
      const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
      const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
      checkAdditionalProperties();
      cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
      function checkAdditionalProperties() {
        gen.forIn("key", data, (key) => {
          if (!props.length && !patProps.length)
            additionalPropertyCode(key);
          else
            gen.if(isAdditional(key), () => additionalPropertyCode(key));
        });
      }
      function isAdditional(key) {
        let definedProp;
        if (props.length > 8) {
          const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
          definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
        } else if (props.length) {
          definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
        } else {
          definedProp = codegen_1.nil;
        }
        if (patProps.length) {
          definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
        }
        return (0, codegen_1.not)(definedProp);
      }
      function deleteAdditional(key) {
        gen.code((0, codegen_1._)`delete ${data}[${key}]`);
      }
      function additionalPropertyCode(key) {
        if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
          deleteAdditional(key);
          return;
        }
        if (schema === false) {
          cxt.setParams({ additionalProperty: key });
          cxt.error();
          if (!allErrors)
            gen.break();
          return;
        }
        if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
          const valid = gen.name("valid");
          if (opts.removeAdditional === "failing") {
            applyAdditionalSchema(key, valid, false);
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.reset();
              deleteAdditional(key);
            });
          } else {
            applyAdditionalSchema(key, valid);
            if (!allErrors)
              gen.if((0, codegen_1.not)(valid), () => gen.break());
          }
        }
      }
      function applyAdditionalSchema(key, valid, errors) {
        const subschema = {
          keyword: "additionalProperties",
          dataProp: key,
          dataPropType: util_1.Type.Str
        };
        if (errors === false) {
          Object.assign(subschema, {
            compositeRule: true,
            createErrors: false,
            allErrors: false
          });
        }
        cxt.subschema(subschema, valid);
      }
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var validate_1 = require_validate();
  var code_1 = require_code2();
  var util_1 = require_util();
  var additionalProperties_1 = require_additionalProperties();
  var def = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(cxt) {
      const { gen, schema, parentSchema, data, it } = cxt;
      if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === undefined) {
        additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
      }
      const allProps = (0, code_1.allSchemaProperties)(schema);
      for (const prop of allProps) {
        it.definedProperties.add(prop);
      }
      if (it.opts.unevaluated && allProps.length && it.props !== true) {
        it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
      }
      const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
      if (properties.length === 0)
        return;
      const valid = gen.name("valid");
      for (const prop of properties) {
        if (hasDefault(prop)) {
          applyPropertySchema(prop);
        } else {
          gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
          applyPropertySchema(prop);
          if (!it.allErrors)
            gen.else().var(valid, true);
          gen.endIf();
        }
        cxt.it.definedProperties.add(prop);
        cxt.ok(valid);
      }
      function hasDefault(prop) {
        return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== undefined;
      }
      function applyPropertySchema(prop) {
        cxt.subschema({
          keyword: "properties",
          schemaProp: prop,
          dataProp: prop
        }, valid);
      }
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var code_1 = require_code2();
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var util_2 = require_util();
  var def = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(cxt) {
      const { gen, schema, data, parentSchema, it } = cxt;
      const { opts } = it;
      const patterns = (0, code_1.allSchemaProperties)(schema);
      const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
      if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
        return;
      }
      const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
      const valid = gen.name("valid");
      if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
        it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
      }
      const { props } = it;
      validatePatternProperties();
      function validatePatternProperties() {
        for (const pat of patterns) {
          if (checkProperties)
            checkMatchingProperties(pat);
          if (it.allErrors) {
            validateProperties(pat);
          } else {
            gen.var(valid, true);
            validateProperties(pat);
            gen.if(valid);
          }
        }
      }
      function checkMatchingProperties(pat) {
        for (const prop in checkProperties) {
          if (new RegExp(pat).test(prop)) {
            (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
          }
        }
      }
      function validateProperties(pat) {
        gen.forIn("key", data, (key) => {
          gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
            const alwaysValid = alwaysValidPatterns.includes(pat);
            if (!alwaysValid) {
              cxt.subschema({
                keyword: "patternProperties",
                schemaProp: pat,
                dataProp: key,
                dataPropType: util_2.Type.Str
              }, valid);
            }
            if (it.opts.unevaluated && props !== true) {
              gen.assign((0, codegen_1._)`${props}[${key}]`, true);
            } else if (!alwaysValid && !it.allErrors) {
              gen.if((0, codegen_1.not)(valid), () => gen.break());
            }
          });
        });
      }
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var util_1 = require_util();
  var def = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: true,
    code(cxt) {
      const { gen, schema, it } = cxt;
      if ((0, util_1.alwaysValidSchema)(it, schema)) {
        cxt.fail();
        return;
      }
      const valid = gen.name("valid");
      cxt.subschema({
        keyword: "not",
        compositeRule: true,
        createErrors: false,
        allErrors: false
      }, valid);
      cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
    },
    error: { message: "must NOT be valid" }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var code_1 = require_code2();
  var def = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: true,
    code: code_1.validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var error = {
    message: "must match exactly one schema in oneOf",
    params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
  };
  var def = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: true,
    error,
    code(cxt) {
      const { gen, schema, parentSchema, it } = cxt;
      if (!Array.isArray(schema))
        throw new Error("ajv implementation error");
      if (it.opts.discriminator && parentSchema.discriminator)
        return;
      const schArr = schema;
      const valid = gen.let("valid", false);
      const passing = gen.let("passing", null);
      const schValid = gen.name("_valid");
      cxt.setParams({ passing });
      gen.block(validateOneOf);
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
      function validateOneOf() {
        schArr.forEach((sch, i) => {
          let schCxt;
          if ((0, util_1.alwaysValidSchema)(it, sch)) {
            gen.var(schValid, true);
          } else {
            schCxt = cxt.subschema({
              keyword: "oneOf",
              schemaProp: i,
              compositeRule: true
            }, schValid);
          }
          if (i > 0) {
            gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
          }
          gen.if(schValid, () => {
            gen.assign(valid, true);
            gen.assign(passing, i);
            if (schCxt)
              cxt.mergeEvaluated(schCxt, codegen_1.Name);
          });
        });
      }
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var util_1 = require_util();
  var def = {
    keyword: "allOf",
    schemaType: "array",
    code(cxt) {
      const { gen, schema, it } = cxt;
      if (!Array.isArray(schema))
        throw new Error("ajv implementation error");
      const valid = gen.name("valid");
      schema.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
          return;
        const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
        cxt.ok(valid);
        cxt.mergeEvaluated(schCxt);
      });
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var error = {
    message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
    params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
  };
  var def = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: true,
    error,
    code(cxt) {
      const { gen, parentSchema, it } = cxt;
      if (parentSchema.then === undefined && parentSchema.else === undefined) {
        (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
      }
      const hasThen = hasSchema(it, "then");
      const hasElse = hasSchema(it, "else");
      if (!hasThen && !hasElse)
        return;
      const valid = gen.let("valid", true);
      const schValid = gen.name("_valid");
      validateIf();
      cxt.reset();
      if (hasThen && hasElse) {
        const ifClause = gen.let("ifClause");
        cxt.setParams({ ifClause });
        gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
      } else if (hasThen) {
        gen.if(schValid, validateClause("then"));
      } else {
        gen.if((0, codegen_1.not)(schValid), validateClause("else"));
      }
      cxt.pass(valid, () => cxt.error(true));
      function validateIf() {
        const schCxt = cxt.subschema({
          keyword: "if",
          compositeRule: true,
          createErrors: false,
          allErrors: false
        }, schValid);
        cxt.mergeEvaluated(schCxt);
      }
      function validateClause(keyword, ifClause) {
        return () => {
          const schCxt = cxt.subschema({ keyword }, schValid);
          gen.assign(valid, schValid);
          cxt.mergeValidEvaluated(schCxt, valid);
          if (ifClause)
            gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
          else
            cxt.setParams({ ifClause: keyword });
        };
      }
    }
  };
  function hasSchema(it, keyword) {
    const schema = it.schema[keyword];
    return schema !== undefined && !(0, util_1.alwaysValidSchema)(it, schema);
  }
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var util_1 = require_util();
  var def = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword, parentSchema, it }) {
      if (parentSchema.if === undefined)
        (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var additionalItems_1 = require_additionalItems();
  var prefixItems_1 = require_prefixItems();
  var items_1 = require_items();
  var items2020_1 = require_items2020();
  var contains_1 = require_contains();
  var dependencies_1 = require_dependencies();
  var propertyNames_1 = require_propertyNames();
  var additionalProperties_1 = require_additionalProperties();
  var properties_1 = require_properties();
  var patternProperties_1 = require_patternProperties();
  var not_1 = require_not();
  var anyOf_1 = require_anyOf();
  var oneOf_1 = require_oneOf();
  var allOf_1 = require_allOf();
  var if_1 = require_if();
  var thenElse_1 = require_thenElse();
  function getApplicator(draft2020 = false) {
    const applicator = [
      not_1.default,
      anyOf_1.default,
      oneOf_1.default,
      allOf_1.default,
      if_1.default,
      thenElse_1.default,
      propertyNames_1.default,
      additionalProperties_1.default,
      dependencies_1.default,
      properties_1.default,
      patternProperties_1.default
    ];
    if (draft2020)
      applicator.push(prefixItems_1.default, items2020_1.default);
    else
      applicator.push(additionalItems_1.default, items_1.default);
    applicator.push(contains_1.default);
    return applicator;
  }
  exports.default = getApplicator;
});

// node_modules/ajv/dist/vocabularies/dynamic/dynamicAnchor.js
var require_dynamicAnchor = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.dynamicAnchor = undefined;
  var codegen_1 = require_codegen();
  var names_1 = require_names();
  var compile_1 = require_compile();
  var ref_1 = require_ref();
  var def = {
    keyword: "$dynamicAnchor",
    schemaType: "string",
    code: (cxt) => dynamicAnchor(cxt, cxt.schema)
  };
  function dynamicAnchor(cxt, anchor) {
    const { gen, it } = cxt;
    it.schemaEnv.root.dynamicAnchors[anchor] = true;
    const v = (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`;
    const validate = it.errSchemaPath === "#" ? it.validateName : _getValidate(cxt);
    gen.if((0, codegen_1._)`!${v}`, () => gen.assign(v, validate));
  }
  exports.dynamicAnchor = dynamicAnchor;
  function _getValidate(cxt) {
    const { schemaEnv, schema, self } = cxt.it;
    const { root, baseId, localRefs, meta } = schemaEnv.root;
    const { schemaId } = self.opts;
    const sch = new compile_1.SchemaEnv({ schema, schemaId, root, baseId, localRefs, meta });
    compile_1.compileSchema.call(self, sch);
    return (0, ref_1.getValidate)(cxt, sch);
  }
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/dynamic/dynamicRef.js
var require_dynamicRef = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.dynamicRef = undefined;
  var codegen_1 = require_codegen();
  var names_1 = require_names();
  var ref_1 = require_ref();
  var def = {
    keyword: "$dynamicRef",
    schemaType: "string",
    code: (cxt) => dynamicRef(cxt, cxt.schema)
  };
  function dynamicRef(cxt, ref) {
    const { gen, keyword, it } = cxt;
    if (ref[0] !== "#")
      throw new Error(`"${keyword}" only supports hash fragment reference`);
    const anchor = ref.slice(1);
    if (it.allErrors) {
      _dynamicRef();
    } else {
      const valid = gen.let("valid", false);
      _dynamicRef(valid);
      cxt.ok(valid);
    }
    function _dynamicRef(valid) {
      if (it.schemaEnv.root.dynamicAnchors[anchor]) {
        const v = gen.let("_v", (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`);
        gen.if(v, _callRef(v, valid), _callRef(it.validateName, valid));
      } else {
        _callRef(it.validateName, valid)();
      }
    }
    function _callRef(validate, valid) {
      return valid ? () => gen.block(() => {
        (0, ref_1.callRef)(cxt, validate);
        gen.let(valid, true);
      }) : () => (0, ref_1.callRef)(cxt, validate);
    }
  }
  exports.dynamicRef = dynamicRef;
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/dynamic/recursiveAnchor.js
var require_recursiveAnchor = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var dynamicAnchor_1 = require_dynamicAnchor();
  var util_1 = require_util();
  var def = {
    keyword: "$recursiveAnchor",
    schemaType: "boolean",
    code(cxt) {
      if (cxt.schema)
        (0, dynamicAnchor_1.dynamicAnchor)(cxt, "");
      else
        (0, util_1.checkStrictMode)(cxt.it, "$recursiveAnchor: false is ignored");
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/dynamic/recursiveRef.js
var require_recursiveRef = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var dynamicRef_1 = require_dynamicRef();
  var def = {
    keyword: "$recursiveRef",
    schemaType: "string",
    code: (cxt) => (0, dynamicRef_1.dynamicRef)(cxt, cxt.schema)
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/dynamic/index.js
var require_dynamic = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var dynamicAnchor_1 = require_dynamicAnchor();
  var dynamicRef_1 = require_dynamicRef();
  var recursiveAnchor_1 = require_recursiveAnchor();
  var recursiveRef_1 = require_recursiveRef();
  var dynamic = [dynamicAnchor_1.default, dynamicRef_1.default, recursiveAnchor_1.default, recursiveRef_1.default];
  exports.default = dynamic;
});

// node_modules/ajv/dist/vocabularies/validation/dependentRequired.js
var require_dependentRequired = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var dependencies_1 = require_dependencies();
  var def = {
    keyword: "dependentRequired",
    type: "object",
    schemaType: "object",
    error: dependencies_1.error,
    code: (cxt) => (0, dependencies_1.validatePropertyDeps)(cxt)
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/applicator/dependentSchemas.js
var require_dependentSchemas = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var dependencies_1 = require_dependencies();
  var def = {
    keyword: "dependentSchemas",
    type: "object",
    schemaType: "object",
    code: (cxt) => (0, dependencies_1.validateSchemaDeps)(cxt)
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/validation/limitContains.js
var require_limitContains = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var util_1 = require_util();
  var def = {
    keyword: ["maxContains", "minContains"],
    type: "array",
    schemaType: "number",
    code({ keyword, parentSchema, it }) {
      if (parentSchema.contains === undefined) {
        (0, util_1.checkStrictMode)(it, `"${keyword}" without "contains" is ignored`);
      }
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/next.js
var require_next = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var dependentRequired_1 = require_dependentRequired();
  var dependentSchemas_1 = require_dependentSchemas();
  var limitContains_1 = require_limitContains();
  var next = [dependentRequired_1.default, dependentSchemas_1.default, limitContains_1.default];
  exports.default = next;
});

// node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedProperties.js
var require_unevaluatedProperties = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var names_1 = require_names();
  var error = {
    message: "must NOT have unevaluated properties",
    params: ({ params }) => (0, codegen_1._)`{unevaluatedProperty: ${params.unevaluatedProperty}}`
  };
  var def = {
    keyword: "unevaluatedProperties",
    type: "object",
    schemaType: ["boolean", "object"],
    trackErrors: true,
    error,
    code(cxt) {
      const { gen, schema, data, errsCount, it } = cxt;
      if (!errsCount)
        throw new Error("ajv implementation error");
      const { allErrors, props } = it;
      if (props instanceof codegen_1.Name) {
        gen.if((0, codegen_1._)`${props} !== true`, () => gen.forIn("key", data, (key) => gen.if(unevaluatedDynamic(props, key), () => unevaluatedPropCode(key))));
      } else if (props !== true) {
        gen.forIn("key", data, (key) => props === undefined ? unevaluatedPropCode(key) : gen.if(unevaluatedStatic(props, key), () => unevaluatedPropCode(key)));
      }
      it.props = true;
      cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
      function unevaluatedPropCode(key) {
        if (schema === false) {
          cxt.setParams({ unevaluatedProperty: key });
          cxt.error();
          if (!allErrors)
            gen.break();
          return;
        }
        if (!(0, util_1.alwaysValidSchema)(it, schema)) {
          const valid = gen.name("valid");
          cxt.subschema({
            keyword: "unevaluatedProperties",
            dataProp: key,
            dataPropType: util_1.Type.Str
          }, valid);
          if (!allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        }
      }
      function unevaluatedDynamic(evaluatedProps, key) {
        return (0, codegen_1._)`!${evaluatedProps} || !${evaluatedProps}[${key}]`;
      }
      function unevaluatedStatic(evaluatedProps, key) {
        const ps = [];
        for (const p in evaluatedProps) {
          if (evaluatedProps[p] === true)
            ps.push((0, codegen_1._)`${key} !== ${p}`);
        }
        return (0, codegen_1.and)(...ps);
      }
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedItems.js
var require_unevaluatedItems = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var util_1 = require_util();
  var error = {
    message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
    params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
  };
  var def = {
    keyword: "unevaluatedItems",
    type: "array",
    schemaType: ["boolean", "object"],
    error,
    code(cxt) {
      const { gen, schema, data, it } = cxt;
      const items = it.items || 0;
      if (items === true)
        return;
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      if (schema === false) {
        cxt.setParams({ len: items });
        cxt.fail((0, codegen_1._)`${len} > ${items}`);
      } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
        const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items}`);
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid, items));
        cxt.ok(valid);
      }
      it.items = true;
      function validateItems(valid, from) {
        gen.forRange("i", from, len, (i) => {
          cxt.subschema({ keyword: "unevaluatedItems", dataProp: i, dataPropType: util_1.Type.Num }, valid);
          if (!it.allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
      }
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/unevaluated/index.js
var require_unevaluated = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var unevaluatedProperties_1 = require_unevaluatedProperties();
  var unevaluatedItems_1 = require_unevaluatedItems();
  var unevaluated = [unevaluatedProperties_1.default, unevaluatedItems_1.default];
  exports.default = unevaluated;
});

// node_modules/ajv/dist/vocabularies/format/format.js
var require_format = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var error = {
    message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
    params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
  };
  var def = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: true,
    error,
    code(cxt, ruleType) {
      const { gen, data, $data, schema, schemaCode, it } = cxt;
      const { opts, errSchemaPath, schemaEnv, self } = it;
      if (!opts.validateFormats)
        return;
      if ($data)
        validate$DataFormat();
      else
        validateFormat();
      function validate$DataFormat() {
        const fmts = gen.scopeValue("formats", {
          ref: self.formats,
          code: opts.code.formats
        });
        const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
        const fType = gen.let("fType");
        const format = gen.let("format");
        gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
        cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
        function unknownFmt() {
          if (opts.strictSchema === false)
            return codegen_1.nil;
          return (0, codegen_1._)`${schemaCode} && !${format}`;
        }
        function invalidFmt() {
          const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
          const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
          return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
        }
      }
      function validateFormat() {
        const formatDef = self.formats[schema];
        if (!formatDef) {
          unknownFormat();
          return;
        }
        if (formatDef === true)
          return;
        const [fmtType, format, fmtRef] = getFormat(formatDef);
        if (fmtType === ruleType)
          cxt.pass(validCondition());
        function unknownFormat() {
          if (opts.strictSchema === false) {
            self.logger.warn(unknownMsg());
            return;
          }
          throw new Error(unknownMsg());
          function unknownMsg() {
            return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
          }
        }
        function getFormat(fmtDef) {
          const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : undefined;
          const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
          if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
            return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
          }
          return ["string", fmtDef, fmt];
        }
        function validCondition() {
          if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
            if (!schemaEnv.$async)
              throw new Error("async format in sync schema");
            return (0, codegen_1._)`await ${fmtRef}(${data})`;
          }
          return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
        }
      }
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/vocabularies/format/index.js
var require_format2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var format_1 = require_format();
  var format = [format_1.default];
  exports.default = format;
});

// node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.contentVocabulary = exports.metadataVocabulary = undefined;
  exports.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ];
  exports.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ];
});

// node_modules/ajv/dist/vocabularies/draft2020.js
var require_draft2020 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var core_1 = require_core2();
  var validation_1 = require_validation();
  var applicator_1 = require_applicator();
  var dynamic_1 = require_dynamic();
  var next_1 = require_next();
  var unevaluated_1 = require_unevaluated();
  var format_1 = require_format2();
  var metadata_1 = require_metadata();
  var draft2020Vocabularies = [
    dynamic_1.default,
    core_1.default,
    validation_1.default,
    (0, applicator_1.default)(true),
    format_1.default,
    metadata_1.metadataVocabulary,
    metadata_1.contentVocabulary,
    next_1.default,
    unevaluated_1.default
  ];
  exports.default = draft2020Vocabularies;
});

// node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.DiscrError = undefined;
  var DiscrError;
  (function(DiscrError2) {
    DiscrError2["Tag"] = "tag";
    DiscrError2["Mapping"] = "mapping";
  })(DiscrError || (exports.DiscrError = DiscrError = {}));
});

// node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var codegen_1 = require_codegen();
  var types_1 = require_types();
  var compile_1 = require_compile();
  var ref_error_1 = require_ref_error();
  var util_1 = require_util();
  var error = {
    message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
    params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
  };
  var def = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error,
    code(cxt) {
      const { gen, data, schema, parentSchema, it } = cxt;
      const { oneOf } = parentSchema;
      if (!it.opts.discriminator) {
        throw new Error("discriminator: requires discriminator option");
      }
      const tagName = schema.propertyName;
      if (typeof tagName != "string")
        throw new Error("discriminator: requires propertyName");
      if (schema.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!oneOf)
        throw new Error("discriminator: requires oneOf keyword");
      const valid = gen.let("valid", false);
      const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
      gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
      cxt.ok(valid);
      function validateMapping() {
        const mapping = getMapping();
        gen.if(false);
        for (const tagValue in mapping) {
          gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
          gen.assign(valid, applyTagSchema(mapping[tagValue]));
        }
        gen.else();
        cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
        gen.endIf();
      }
      function applyTagSchema(schemaProp) {
        const _valid = gen.name("valid");
        const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
        cxt.mergeEvaluated(schCxt, codegen_1.Name);
        return _valid;
      }
      function getMapping() {
        var _a;
        const oneOfMapping = {};
        const topRequired = hasRequired(parentSchema);
        let tagRequired = true;
        for (let i = 0;i < oneOf.length; i++) {
          let sch = oneOf[i];
          if ((sch === null || sch === undefined ? undefined : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
            const ref = sch.$ref;
            sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
            if (sch instanceof compile_1.SchemaEnv)
              sch = sch.schema;
            if (sch === undefined)
              throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
          }
          const propSch = (_a = sch === null || sch === undefined ? undefined : sch.properties) === null || _a === undefined ? undefined : _a[tagName];
          if (typeof propSch != "object") {
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
          }
          tagRequired = tagRequired && (topRequired || hasRequired(sch));
          addMappings(propSch, i);
        }
        if (!tagRequired)
          throw new Error(`discriminator: "${tagName}" must be required`);
        return oneOfMapping;
        function hasRequired({ required }) {
          return Array.isArray(required) && required.includes(tagName);
        }
        function addMappings(sch, i) {
          if (sch.const) {
            addMapping(sch.const, i);
          } else if (sch.enum) {
            for (const tagValue of sch.enum) {
              addMapping(tagValue, i);
            }
          } else {
            throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
          }
        }
        function addMapping(tagValue, i) {
          if (typeof tagValue != "string" || tagValue in oneOfMapping) {
            throw new Error(`discriminator: "${tagName}" values must be unique strings`);
          }
          oneOfMapping[tagValue] = i;
        }
      }
    }
  };
  exports.default = def;
});

// node_modules/ajv/dist/refs/json-schema-2020-12/schema.json
var require_schema = __commonJS((exports, module) => {
  module.exports = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://json-schema.org/draft/2020-12/schema",
    $vocabulary: {
      "https://json-schema.org/draft/2020-12/vocab/core": true,
      "https://json-schema.org/draft/2020-12/vocab/applicator": true,
      "https://json-schema.org/draft/2020-12/vocab/unevaluated": true,
      "https://json-schema.org/draft/2020-12/vocab/validation": true,
      "https://json-schema.org/draft/2020-12/vocab/meta-data": true,
      "https://json-schema.org/draft/2020-12/vocab/format-annotation": true,
      "https://json-schema.org/draft/2020-12/vocab/content": true
    },
    $dynamicAnchor: "meta",
    title: "Core and Validation specifications meta-schema",
    allOf: [
      { $ref: "meta/core" },
      { $ref: "meta/applicator" },
      { $ref: "meta/unevaluated" },
      { $ref: "meta/validation" },
      { $ref: "meta/meta-data" },
      { $ref: "meta/format-annotation" },
      { $ref: "meta/content" }
    ],
    type: ["object", "boolean"],
    $comment: "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.",
    properties: {
      definitions: {
        $comment: '"definitions" has been replaced by "$defs".',
        type: "object",
        additionalProperties: { $dynamicRef: "#meta" },
        deprecated: true,
        default: {}
      },
      dependencies: {
        $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
        type: "object",
        additionalProperties: {
          anyOf: [{ $dynamicRef: "#meta" }, { $ref: "meta/validation#/$defs/stringArray" }]
        },
        deprecated: true,
        default: {}
      },
      $recursiveAnchor: {
        $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
        $ref: "meta/core#/$defs/anchorString",
        deprecated: true
      },
      $recursiveRef: {
        $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
        $ref: "meta/core#/$defs/uriReferenceString",
        deprecated: true
      }
    }
  };
});

// node_modules/ajv/dist/refs/json-schema-2020-12/meta/applicator.json
var require_applicator2 = __commonJS((exports, module) => {
  module.exports = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://json-schema.org/draft/2020-12/meta/applicator",
    $vocabulary: {
      "https://json-schema.org/draft/2020-12/vocab/applicator": true
    },
    $dynamicAnchor: "meta",
    title: "Applicator vocabulary meta-schema",
    type: ["object", "boolean"],
    properties: {
      prefixItems: { $ref: "#/$defs/schemaArray" },
      items: { $dynamicRef: "#meta" },
      contains: { $dynamicRef: "#meta" },
      additionalProperties: { $dynamicRef: "#meta" },
      properties: {
        type: "object",
        additionalProperties: { $dynamicRef: "#meta" },
        default: {}
      },
      patternProperties: {
        type: "object",
        additionalProperties: { $dynamicRef: "#meta" },
        propertyNames: { format: "regex" },
        default: {}
      },
      dependentSchemas: {
        type: "object",
        additionalProperties: { $dynamicRef: "#meta" },
        default: {}
      },
      propertyNames: { $dynamicRef: "#meta" },
      if: { $dynamicRef: "#meta" },
      then: { $dynamicRef: "#meta" },
      else: { $dynamicRef: "#meta" },
      allOf: { $ref: "#/$defs/schemaArray" },
      anyOf: { $ref: "#/$defs/schemaArray" },
      oneOf: { $ref: "#/$defs/schemaArray" },
      not: { $dynamicRef: "#meta" }
    },
    $defs: {
      schemaArray: {
        type: "array",
        minItems: 1,
        items: { $dynamicRef: "#meta" }
      }
    }
  };
});

// node_modules/ajv/dist/refs/json-schema-2020-12/meta/unevaluated.json
var require_unevaluated2 = __commonJS((exports, module) => {
  module.exports = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://json-schema.org/draft/2020-12/meta/unevaluated",
    $vocabulary: {
      "https://json-schema.org/draft/2020-12/vocab/unevaluated": true
    },
    $dynamicAnchor: "meta",
    title: "Unevaluated applicator vocabulary meta-schema",
    type: ["object", "boolean"],
    properties: {
      unevaluatedItems: { $dynamicRef: "#meta" },
      unevaluatedProperties: { $dynamicRef: "#meta" }
    }
  };
});

// node_modules/ajv/dist/refs/json-schema-2020-12/meta/content.json
var require_content = __commonJS((exports, module) => {
  module.exports = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://json-schema.org/draft/2020-12/meta/content",
    $vocabulary: {
      "https://json-schema.org/draft/2020-12/vocab/content": true
    },
    $dynamicAnchor: "meta",
    title: "Content vocabulary meta-schema",
    type: ["object", "boolean"],
    properties: {
      contentEncoding: { type: "string" },
      contentMediaType: { type: "string" },
      contentSchema: { $dynamicRef: "#meta" }
    }
  };
});

// node_modules/ajv/dist/refs/json-schema-2020-12/meta/core.json
var require_core3 = __commonJS((exports, module) => {
  module.exports = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://json-schema.org/draft/2020-12/meta/core",
    $vocabulary: {
      "https://json-schema.org/draft/2020-12/vocab/core": true
    },
    $dynamicAnchor: "meta",
    title: "Core vocabulary meta-schema",
    type: ["object", "boolean"],
    properties: {
      $id: {
        $ref: "#/$defs/uriReferenceString",
        $comment: "Non-empty fragments not allowed.",
        pattern: "^[^#]*#?$"
      },
      $schema: { $ref: "#/$defs/uriString" },
      $ref: { $ref: "#/$defs/uriReferenceString" },
      $anchor: { $ref: "#/$defs/anchorString" },
      $dynamicRef: { $ref: "#/$defs/uriReferenceString" },
      $dynamicAnchor: { $ref: "#/$defs/anchorString" },
      $vocabulary: {
        type: "object",
        propertyNames: { $ref: "#/$defs/uriString" },
        additionalProperties: {
          type: "boolean"
        }
      },
      $comment: {
        type: "string"
      },
      $defs: {
        type: "object",
        additionalProperties: { $dynamicRef: "#meta" }
      }
    },
    $defs: {
      anchorString: {
        type: "string",
        pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
      },
      uriString: {
        type: "string",
        format: "uri"
      },
      uriReferenceString: {
        type: "string",
        format: "uri-reference"
      }
    }
  };
});

// node_modules/ajv/dist/refs/json-schema-2020-12/meta/format-annotation.json
var require_format_annotation = __commonJS((exports, module) => {
  module.exports = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://json-schema.org/draft/2020-12/meta/format-annotation",
    $vocabulary: {
      "https://json-schema.org/draft/2020-12/vocab/format-annotation": true
    },
    $dynamicAnchor: "meta",
    title: "Format vocabulary meta-schema for annotation results",
    type: ["object", "boolean"],
    properties: {
      format: { type: "string" }
    }
  };
});

// node_modules/ajv/dist/refs/json-schema-2020-12/meta/meta-data.json
var require_meta_data = __commonJS((exports, module) => {
  module.exports = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://json-schema.org/draft/2020-12/meta/meta-data",
    $vocabulary: {
      "https://json-schema.org/draft/2020-12/vocab/meta-data": true
    },
    $dynamicAnchor: "meta",
    title: "Meta-data vocabulary meta-schema",
    type: ["object", "boolean"],
    properties: {
      title: {
        type: "string"
      },
      description: {
        type: "string"
      },
      default: true,
      deprecated: {
        type: "boolean",
        default: false
      },
      readOnly: {
        type: "boolean",
        default: false
      },
      writeOnly: {
        type: "boolean",
        default: false
      },
      examples: {
        type: "array",
        items: true
      }
    }
  };
});

// node_modules/ajv/dist/refs/json-schema-2020-12/meta/validation.json
var require_validation2 = __commonJS((exports, module) => {
  module.exports = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://json-schema.org/draft/2020-12/meta/validation",
    $vocabulary: {
      "https://json-schema.org/draft/2020-12/vocab/validation": true
    },
    $dynamicAnchor: "meta",
    title: "Validation vocabulary meta-schema",
    type: ["object", "boolean"],
    properties: {
      type: {
        anyOf: [
          { $ref: "#/$defs/simpleTypes" },
          {
            type: "array",
            items: { $ref: "#/$defs/simpleTypes" },
            minItems: 1,
            uniqueItems: true
          }
        ]
      },
      const: true,
      enum: {
        type: "array",
        items: true
      },
      multipleOf: {
        type: "number",
        exclusiveMinimum: 0
      },
      maximum: {
        type: "number"
      },
      exclusiveMaximum: {
        type: "number"
      },
      minimum: {
        type: "number"
      },
      exclusiveMinimum: {
        type: "number"
      },
      maxLength: { $ref: "#/$defs/nonNegativeInteger" },
      minLength: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
      pattern: {
        type: "string",
        format: "regex"
      },
      maxItems: { $ref: "#/$defs/nonNegativeInteger" },
      minItems: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
      uniqueItems: {
        type: "boolean",
        default: false
      },
      maxContains: { $ref: "#/$defs/nonNegativeInteger" },
      minContains: {
        $ref: "#/$defs/nonNegativeInteger",
        default: 1
      },
      maxProperties: { $ref: "#/$defs/nonNegativeInteger" },
      minProperties: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
      required: { $ref: "#/$defs/stringArray" },
      dependentRequired: {
        type: "object",
        additionalProperties: {
          $ref: "#/$defs/stringArray"
        }
      }
    },
    $defs: {
      nonNegativeInteger: {
        type: "integer",
        minimum: 0
      },
      nonNegativeIntegerDefault0: {
        $ref: "#/$defs/nonNegativeInteger",
        default: 0
      },
      simpleTypes: {
        enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
      },
      stringArray: {
        type: "array",
        items: { type: "string" },
        uniqueItems: true,
        default: []
      }
    }
  };
});

// node_modules/ajv/dist/refs/json-schema-2020-12/index.js
var require_json_schema_2020_12 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var metaSchema = require_schema();
  var applicator = require_applicator2();
  var unevaluated = require_unevaluated2();
  var content = require_content();
  var core = require_core3();
  var format = require_format_annotation();
  var metadata = require_meta_data();
  var validation = require_validation2();
  var META_SUPPORT_DATA = ["/properties"];
  function addMetaSchema2020($data) {
    [
      metaSchema,
      applicator,
      unevaluated,
      content,
      core,
      with$data(this, format),
      metadata,
      with$data(this, validation)
    ].forEach((sch) => this.addMetaSchema(sch, undefined, false));
    return this;
    function with$data(ajv, sch) {
      return $data ? ajv.$dataMetaSchema(sch, META_SUPPORT_DATA) : sch;
    }
  }
  exports.default = addMetaSchema2020;
});

// node_modules/ajv/dist/2020.js
var require_2020 = __commonJS((exports, module) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv2020 = undefined;
  var core_1 = require_core();
  var draft2020_1 = require_draft2020();
  var discriminator_1 = require_discriminator();
  var json_schema_2020_12_1 = require_json_schema_2020_12();
  var META_SCHEMA_ID = "https://json-schema.org/draft/2020-12/schema";

  class Ajv2020 extends core_1.default {
    constructor(opts = {}) {
      super({
        ...opts,
        dynamicRef: true,
        next: true,
        unevaluated: true
      });
    }
    _addVocabularies() {
      super._addVocabularies();
      draft2020_1.default.forEach((v) => this.addVocabulary(v));
      if (this.opts.discriminator)
        this.addKeyword(discriminator_1.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data, meta } = this.opts;
      if (!meta)
        return;
      json_schema_2020_12_1.default.call(this, $data);
      this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : undefined);
    }
  }
  exports.Ajv2020 = Ajv2020;
  module.exports = exports = Ajv2020;
  module.exports.Ajv2020 = Ajv2020;
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.default = Ajv2020;
  var validate_1 = require_validate();
  Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
    return validate_1.KeywordCxt;
  } });
  var codegen_1 = require_codegen();
  Object.defineProperty(exports, "_", { enumerable: true, get: function() {
    return codegen_1._;
  } });
  Object.defineProperty(exports, "str", { enumerable: true, get: function() {
    return codegen_1.str;
  } });
  Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
    return codegen_1.stringify;
  } });
  Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
    return codegen_1.nil;
  } });
  Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
    return codegen_1.Name;
  } });
  Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
    return codegen_1.CodeGen;
  } });
  var validation_error_1 = require_validation_error();
  Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
    return validation_error_1.default;
  } });
  var ref_error_1 = require_ref_error();
  Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: function() {
    return ref_error_1.default;
  } });
});

// node_modules/ajv-formats/dist/formats.js
var require_formats = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.formatNames = exports.fastFormats = exports.fullFormats = undefined;
  function fmtDef(validate, compare) {
    return { validate, compare };
  }
  exports.fullFormats = {
    date: fmtDef(date, compareDate),
    time: fmtDef(getTime(true), compareTime),
    "date-time": fmtDef(getDateTime(true), compareDateTime),
    "iso-time": fmtDef(getTime(), compareIsoTime),
    "iso-date-time": fmtDef(getDateTime(), compareIsoDateTime),
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex,
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    byte,
    int32: { type: "number", validate: validateInt32 },
    int64: { type: "number", validate: validateInt64 },
    float: { type: "number", validate: validateNumber },
    double: { type: "number", validate: validateNumber },
    password: true,
    binary: true
  };
  exports.fastFormats = {
    ...exports.fullFormats,
    date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
    time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareTime),
    "date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
    "iso-time": fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoTime),
    "iso-date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoDateTime),
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  };
  exports.formatNames = Object.keys(exports.fullFormats);
  function isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }
  var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
  var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function date(str) {
    const matches = DATE.exec(str);
    if (!matches)
      return false;
    const year = +matches[1];
    const month = +matches[2];
    const day = +matches[3];
    return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
  }
  function compareDate(d1, d2) {
    if (!(d1 && d2))
      return;
    if (d1 > d2)
      return 1;
    if (d1 < d2)
      return -1;
    return 0;
  }
  var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function getTime(strictTimeZone) {
    return function time(str) {
      const matches = TIME.exec(str);
      if (!matches)
        return false;
      const hr = +matches[1];
      const min = +matches[2];
      const sec = +matches[3];
      const tz = matches[4];
      const tzSign = matches[5] === "-" ? -1 : 1;
      const tzH = +(matches[6] || 0);
      const tzM = +(matches[7] || 0);
      if (tzH > 23 || tzM > 59 || strictTimeZone && !tz)
        return false;
      if (hr <= 23 && min <= 59 && sec < 60)
        return true;
      const utcMin = min - tzM * tzSign;
      const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
      return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
    };
  }
  function compareTime(s1, s2) {
    if (!(s1 && s2))
      return;
    const t1 = new Date("2020-01-01T" + s1).valueOf();
    const t2 = new Date("2020-01-01T" + s2).valueOf();
    if (!(t1 && t2))
      return;
    return t1 - t2;
  }
  function compareIsoTime(t1, t2) {
    if (!(t1 && t2))
      return;
    const a1 = TIME.exec(t1);
    const a2 = TIME.exec(t2);
    if (!(a1 && a2))
      return;
    t1 = a1[1] + a1[2] + a1[3];
    t2 = a2[1] + a2[2] + a2[3];
    if (t1 > t2)
      return 1;
    if (t1 < t2)
      return -1;
    return 0;
  }
  var DATE_TIME_SEPARATOR = /t|\s/i;
  function getDateTime(strictTimeZone) {
    const time = getTime(strictTimeZone);
    return function date_time(str) {
      const dateTime = str.split(DATE_TIME_SEPARATOR);
      return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1]);
    };
  }
  function compareDateTime(dt1, dt2) {
    if (!(dt1 && dt2))
      return;
    const d1 = new Date(dt1).valueOf();
    const d2 = new Date(dt2).valueOf();
    if (!(d1 && d2))
      return;
    return d1 - d2;
  }
  function compareIsoDateTime(dt1, dt2) {
    if (!(dt1 && dt2))
      return;
    const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
    const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
    const res = compareDate(d1, d2);
    if (res === undefined)
      return;
    return res || compareTime(t1, t2);
  }
  var NOT_URI_FRAGMENT = /\/|:/;
  var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function uri(str) {
    return NOT_URI_FRAGMENT.test(str) && URI.test(str);
  }
  var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function byte(str) {
    BYTE.lastIndex = 0;
    return BYTE.test(str);
  }
  var MIN_INT32 = -(2 ** 31);
  var MAX_INT32 = 2 ** 31 - 1;
  function validateInt32(value) {
    return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
  }
  function validateInt64(value) {
    return Number.isInteger(value);
  }
  function validateNumber() {
    return true;
  }
  var Z_ANCHOR = /[^\\]\\Z/;
  function regex(str) {
    if (Z_ANCHOR.test(str))
      return false;
    try {
      new RegExp(str);
      return true;
    } catch (e) {
      return false;
    }
  }
});

// node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var core_1 = require_core2();
  var validation_1 = require_validation();
  var applicator_1 = require_applicator();
  var format_1 = require_format2();
  var metadata_1 = require_metadata();
  var draft7Vocabularies = [
    core_1.default,
    validation_1.default,
    (0, applicator_1.default)(),
    format_1.default,
    metadata_1.metadataVocabulary,
    metadata_1.contentVocabulary
  ];
  exports.default = draft7Vocabularies;
});

// node_modules/ajv/dist/refs/json-schema-draft-07.json
var require_json_schema_draft_07 = __commonJS((exports, module) => {
  module.exports = {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "http://json-schema.org/draft-07/schema#",
    title: "Core schema meta-schema",
    definitions: {
      schemaArray: {
        type: "array",
        minItems: 1,
        items: { $ref: "#" }
      },
      nonNegativeInteger: {
        type: "integer",
        minimum: 0
      },
      nonNegativeIntegerDefault0: {
        allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }]
      },
      simpleTypes: {
        enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
      },
      stringArray: {
        type: "array",
        items: { type: "string" },
        uniqueItems: true,
        default: []
      }
    },
    type: ["object", "boolean"],
    properties: {
      $id: {
        type: "string",
        format: "uri-reference"
      },
      $schema: {
        type: "string",
        format: "uri"
      },
      $ref: {
        type: "string",
        format: "uri-reference"
      },
      $comment: {
        type: "string"
      },
      title: {
        type: "string"
      },
      description: {
        type: "string"
      },
      default: true,
      readOnly: {
        type: "boolean",
        default: false
      },
      examples: {
        type: "array",
        items: true
      },
      multipleOf: {
        type: "number",
        exclusiveMinimum: 0
      },
      maximum: {
        type: "number"
      },
      exclusiveMaximum: {
        type: "number"
      },
      minimum: {
        type: "number"
      },
      exclusiveMinimum: {
        type: "number"
      },
      maxLength: { $ref: "#/definitions/nonNegativeInteger" },
      minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
      pattern: {
        type: "string",
        format: "regex"
      },
      additionalItems: { $ref: "#" },
      items: {
        anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
        default: true
      },
      maxItems: { $ref: "#/definitions/nonNegativeInteger" },
      minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
      uniqueItems: {
        type: "boolean",
        default: false
      },
      contains: { $ref: "#" },
      maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
      minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
      required: { $ref: "#/definitions/stringArray" },
      additionalProperties: { $ref: "#" },
      definitions: {
        type: "object",
        additionalProperties: { $ref: "#" },
        default: {}
      },
      properties: {
        type: "object",
        additionalProperties: { $ref: "#" },
        default: {}
      },
      patternProperties: {
        type: "object",
        additionalProperties: { $ref: "#" },
        propertyNames: { format: "regex" },
        default: {}
      },
      dependencies: {
        type: "object",
        additionalProperties: {
          anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
        }
      },
      propertyNames: { $ref: "#" },
      const: true,
      enum: {
        type: "array",
        items: true,
        minItems: 1,
        uniqueItems: true
      },
      type: {
        anyOf: [
          { $ref: "#/definitions/simpleTypes" },
          {
            type: "array",
            items: { $ref: "#/definitions/simpleTypes" },
            minItems: 1,
            uniqueItems: true
          }
        ]
      },
      format: { type: "string" },
      contentMediaType: { type: "string" },
      contentEncoding: { type: "string" },
      if: { $ref: "#" },
      then: { $ref: "#" },
      else: { $ref: "#" },
      allOf: { $ref: "#/definitions/schemaArray" },
      anyOf: { $ref: "#/definitions/schemaArray" },
      oneOf: { $ref: "#/definitions/schemaArray" },
      not: { $ref: "#" }
    },
    default: true
  };
});

// node_modules/ajv/dist/ajv.js
var require_ajv = __commonJS((exports, module) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = undefined;
  var core_1 = require_core();
  var draft7_1 = require_draft7();
  var discriminator_1 = require_discriminator();
  var draft7MetaSchema = require_json_schema_draft_07();
  var META_SUPPORT_DATA = ["/properties"];
  var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";

  class Ajv extends core_1.default {
    _addVocabularies() {
      super._addVocabularies();
      draft7_1.default.forEach((v) => this.addVocabulary(v));
      if (this.opts.discriminator)
        this.addKeyword(discriminator_1.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      if (!this.opts.meta)
        return;
      const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
      this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
      this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : undefined);
    }
  }
  exports.Ajv = Ajv;
  module.exports = exports = Ajv;
  module.exports.Ajv = Ajv;
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.default = Ajv;
  var validate_1 = require_validate();
  Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
    return validate_1.KeywordCxt;
  } });
  var codegen_1 = require_codegen();
  Object.defineProperty(exports, "_", { enumerable: true, get: function() {
    return codegen_1._;
  } });
  Object.defineProperty(exports, "str", { enumerable: true, get: function() {
    return codegen_1.str;
  } });
  Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
    return codegen_1.stringify;
  } });
  Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
    return codegen_1.nil;
  } });
  Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
    return codegen_1.Name;
  } });
  Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
    return codegen_1.CodeGen;
  } });
  var validation_error_1 = require_validation_error();
  Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
    return validation_error_1.default;
  } });
  var ref_error_1 = require_ref_error();
  Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: function() {
    return ref_error_1.default;
  } });
});

// node_modules/ajv-formats/dist/limit.js
var require_limit = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.formatLimitDefinition = undefined;
  var ajv_1 = require_ajv();
  var codegen_1 = require_codegen();
  var ops = codegen_1.operators;
  var KWDs = {
    formatMaximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
    formatMinimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
    formatExclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
  };
  var error = {
    message: ({ keyword, schemaCode }) => (0, codegen_1.str)`should be ${KWDs[keyword].okStr} ${schemaCode}`,
    params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
  };
  exports.formatLimitDefinition = {
    keyword: Object.keys(KWDs),
    type: "string",
    schemaType: "string",
    $data: true,
    error,
    code(cxt) {
      const { gen, data, schemaCode, keyword, it } = cxt;
      const { opts, self } = it;
      if (!opts.validateFormats)
        return;
      const fCxt = new ajv_1.KeywordCxt(it, self.RULES.all.format.definition, "format");
      if (fCxt.$data)
        validate$DataFormat();
      else
        validateFormat();
      function validate$DataFormat() {
        const fmts = gen.scopeValue("formats", {
          ref: self.formats,
          code: opts.code.formats
        });
        const fmt = gen.const("fmt", (0, codegen_1._)`${fmts}[${fCxt.schemaCode}]`);
        cxt.fail$data((0, codegen_1.or)((0, codegen_1._)`typeof ${fmt} != "object"`, (0, codegen_1._)`${fmt} instanceof RegExp`, (0, codegen_1._)`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
      }
      function validateFormat() {
        const format = fCxt.schema;
        const fmtDef = self.formats[format];
        if (!fmtDef || fmtDef === true)
          return;
        if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function") {
          throw new Error(`"${keyword}": format "${format}" does not define "compare" function`);
        }
        const fmt = gen.scopeValue("formats", {
          key: format,
          ref: fmtDef,
          code: opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(format)}` : undefined
        });
        cxt.fail$data(compareCode(fmt));
      }
      function compareCode(fmt) {
        return (0, codegen_1._)`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  var formatLimitPlugin = (ajv) => {
    ajv.addKeyword(exports.formatLimitDefinition);
    return ajv;
  };
  exports.default = formatLimitPlugin;
});

// node_modules/ajv-formats/dist/index.js
var require_dist2 = __commonJS((exports, module) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var formats_1 = require_formats();
  var limit_1 = require_limit();
  var codegen_1 = require_codegen();
  var fullName = new codegen_1.Name("fullFormats");
  var fastName = new codegen_1.Name("fastFormats");
  var formatsPlugin = (ajv, opts = { keywords: true }) => {
    if (Array.isArray(opts)) {
      addFormats(ajv, opts, formats_1.fullFormats, fullName);
      return ajv;
    }
    const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
    const list = opts.formats || formats_1.formatNames;
    addFormats(ajv, list, formats, exportName);
    if (opts.keywords)
      (0, limit_1.default)(ajv);
    return ajv;
  };
  formatsPlugin.get = (name, mode = "full") => {
    const formats = mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats;
    const f = formats[name];
    if (!f)
      throw new Error(`Unknown format "${name}"`);
    return f;
  };
  function addFormats(ajv, list, fs6, exportName) {
    var _a;
    var _b;
    (_a = (_b = ajv.opts.code).formats) !== null && _a !== undefined || (_b.formats = (0, codegen_1._)`require("ajv-formats/dist/formats").${exportName}`);
    for (const f of list)
      ajv.addFormat(f, fs6[f]);
  }
  module.exports = exports = formatsPlugin;
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.default = formatsPlugin;
});

// node_modules/semver/internal/constants.js
var require_constants = __commonJS((exports, module) => {
  var SEMVER_SPEC_VERSION = "2.0.0";
  var MAX_LENGTH = 256;
  var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
  var MAX_SAFE_COMPONENT_LENGTH = 16;
  var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
  var RELEASE_TYPES = [
    "major",
    "premajor",
    "minor",
    "preminor",
    "patch",
    "prepatch",
    "prerelease"
  ];
  module.exports = {
    MAX_LENGTH,
    MAX_SAFE_COMPONENT_LENGTH,
    MAX_SAFE_BUILD_LENGTH,
    MAX_SAFE_INTEGER,
    RELEASE_TYPES,
    SEMVER_SPEC_VERSION,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  };
});

// node_modules/semver/internal/debug.js
var require_debug = __commonJS((exports, module) => {
  var debug2 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {};
  module.exports = debug2;
});

// node_modules/semver/internal/re.js
var require_re = __commonJS((exports, module) => {
  var {
    MAX_SAFE_COMPONENT_LENGTH,
    MAX_SAFE_BUILD_LENGTH,
    MAX_LENGTH
  } = require_constants();
  var debug2 = require_debug();
  exports = module.exports = {};
  var re = exports.re = [];
  var safeRe = exports.safeRe = [];
  var src = exports.src = [];
  var safeSrc = exports.safeSrc = [];
  var t = exports.t = {};
  var R = 0;
  var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
  var safeRegexReplacements = [
    ["\\s", 1],
    ["\\d", MAX_LENGTH],
    [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
  ];
  var makeSafeRegex = (value) => {
    for (const [token, max] of safeRegexReplacements) {
      value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
    }
    return value;
  };
  var createToken = (name, value, isGlobal) => {
    const safe = makeSafeRegex(value);
    const index = R++;
    debug2(name, index, value);
    t[name] = index;
    src[index] = value;
    safeSrc[index] = safe;
    re[index] = new RegExp(value, isGlobal ? "g" : undefined);
    safeRe[index] = new RegExp(safe, isGlobal ? "g" : undefined);
  };
  createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
  createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
  createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
  createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})`);
  createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})`);
  createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
  createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
  createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
  createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
  createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
  createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
  createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
  createToken("FULL", `^${src[t.FULLPLAIN]}$`);
  createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
  createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
  createToken("GTLT", "((?:<|>)?=?)");
  createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
  createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
  createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?` + `)?)?`);
  createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?` + `)?)?`);
  createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
  createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
  createToken("COERCEPLAIN", `${"(^|[^\\d])" + "(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
  createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
  createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?` + `(?:${src[t.BUILD]})?` + `(?:$|[^\\d])`);
  createToken("COERCERTL", src[t.COERCE], true);
  createToken("COERCERTLFULL", src[t.COERCEFULL], true);
  createToken("LONETILDE", "(?:~>?)");
  createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
  exports.tildeTrimReplace = "$1~";
  createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
  createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
  createToken("LONECARET", "(?:\\^)");
  createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
  exports.caretTrimReplace = "$1^";
  createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
  createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
  createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
  createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
  createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
  exports.comparatorTrimReplace = "$1$2$3";
  createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAIN]})` + `\\s*$`);
  createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAINLOOSE]})` + `\\s*$`);
  createToken("STAR", "(<|>)?=?\\s*\\*");
  createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
  createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
});

// node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS((exports, module) => {
  var looseOption = Object.freeze({ loose: true });
  var emptyOpts = Object.freeze({});
  var parseOptions = (options) => {
    if (!options) {
      return emptyOpts;
    }
    if (typeof options !== "object") {
      return looseOption;
    }
    return options;
  };
  module.exports = parseOptions;
});

// node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS((exports, module) => {
  var numeric = /^[0-9]+$/;
  var compareIdentifiers = (a, b) => {
    if (typeof a === "number" && typeof b === "number") {
      return a === b ? 0 : a < b ? -1 : 1;
    }
    const anum = numeric.test(a);
    const bnum = numeric.test(b);
    if (anum && bnum) {
      a = +a;
      b = +b;
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
  };
  var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
  module.exports = {
    compareIdentifiers,
    rcompareIdentifiers
  };
});

// node_modules/semver/classes/semver.js
var require_semver = __commonJS((exports, module) => {
  var debug2 = require_debug();
  var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
  var { safeRe: re, t } = require_re();
  var parseOptions = require_parse_options();
  var { compareIdentifiers } = require_identifiers();
  var isPrereleaseIdentifier = (prerelease, identifier) => {
    const identifiers = identifier.split(".");
    if (identifiers.length > prerelease.length) {
      return false;
    }
    for (let i = 0;i < identifiers.length; i++) {
      if (compareIdentifiers(prerelease[i], identifiers[i]) !== 0) {
        return false;
      }
    }
    return true;
  };

  class SemVer {
    constructor(version, options) {
      options = parseOptions(options);
      if (version instanceof SemVer) {
        if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
          return version;
        } else {
          version = version.version;
        }
      } else if (typeof version !== "string") {
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
      }
      if (version.length > MAX_LENGTH) {
        throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
      }
      debug2("SemVer", version, options);
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
      if (!m) {
        throw new TypeError(`Invalid Version: ${version}`);
      }
      this.raw = version;
      this.major = +m[1];
      this.minor = +m[2];
      this.patch = +m[3];
      if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
        throw new TypeError("Invalid major version");
      }
      if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
        throw new TypeError("Invalid minor version");
      }
      if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
        throw new TypeError("Invalid patch version");
      }
      if (!m[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = m[4].split(".").map((id) => {
          if (/^[0-9]+$/.test(id)) {
            const num = +id;
            if (num >= 0 && num < MAX_SAFE_INTEGER) {
              return num;
            }
          }
          return id;
        });
      }
      this.build = m[5] ? m[5].split(".") : [];
      this.format();
    }
    format() {
      this.version = `${this.major}.${this.minor}.${this.patch}`;
      if (this.prerelease.length) {
        this.version += `-${this.prerelease.join(".")}`;
      }
      return this.version;
    }
    toString() {
      return this.version;
    }
    compare(other) {
      debug2("SemVer.compare", this.version, this.options, other);
      if (!(other instanceof SemVer)) {
        if (typeof other === "string" && other === this.version) {
          return 0;
        }
        other = new SemVer(other, this.options);
      }
      if (other.version === this.version) {
        return 0;
      }
      return this.compareMain(other) || this.comparePre(other);
    }
    compareMain(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      if (this.major < other.major) {
        return -1;
      }
      if (this.major > other.major) {
        return 1;
      }
      if (this.minor < other.minor) {
        return -1;
      }
      if (this.minor > other.minor) {
        return 1;
      }
      if (this.patch < other.patch) {
        return -1;
      }
      if (this.patch > other.patch) {
        return 1;
      }
      return 0;
    }
    comparePre(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      if (this.prerelease.length && !other.prerelease.length) {
        return -1;
      } else if (!this.prerelease.length && other.prerelease.length) {
        return 1;
      } else if (!this.prerelease.length && !other.prerelease.length) {
        return 0;
      }
      let i = 0;
      do {
        const a = this.prerelease[i];
        const b = other.prerelease[i];
        debug2("prerelease compare", i, a, b);
        if (a === undefined && b === undefined) {
          return 0;
        } else if (b === undefined) {
          return 1;
        } else if (a === undefined) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i);
    }
    compareBuild(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      let i = 0;
      do {
        const a = this.build[i];
        const b = other.build[i];
        debug2("build compare", i, a, b);
        if (a === undefined && b === undefined) {
          return 0;
        } else if (b === undefined) {
          return 1;
        } else if (a === undefined) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i);
    }
    inc(release, identifier, identifierBase) {
      if (release.startsWith("pre")) {
        if (!identifier && identifierBase === false) {
          throw new Error("invalid increment argument: identifier is empty");
        }
        if (identifier) {
          const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
          if (!match || match[1] !== identifier) {
            throw new Error(`invalid identifier: ${identifier}`);
          }
        }
      }
      switch (release) {
        case "premajor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc("pre", identifier, identifierBase);
          break;
        case "preminor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc("pre", identifier, identifierBase);
          break;
        case "prepatch":
          this.prerelease.length = 0;
          this.inc("patch", identifier, identifierBase);
          this.inc("pre", identifier, identifierBase);
          break;
        case "prerelease":
          if (this.prerelease.length === 0) {
            this.inc("patch", identifier, identifierBase);
          }
          this.inc("pre", identifier, identifierBase);
          break;
        case "release":
          if (this.prerelease.length === 0) {
            throw new Error(`version ${this.raw} is not a prerelease`);
          }
          this.prerelease.length = 0;
          break;
        case "major":
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
            this.major++;
          }
          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }
          this.patch = 0;
          this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0) {
            this.patch++;
          }
          this.prerelease = [];
          break;
        case "pre": {
          const base = Number(identifierBase) ? 1 : 0;
          if (this.prerelease.length === 0) {
            this.prerelease = [base];
          } else {
            let i = this.prerelease.length;
            while (--i >= 0) {
              if (typeof this.prerelease[i] === "number") {
                this.prerelease[i]++;
                i = -2;
              }
            }
            if (i === -1) {
              if (identifier === this.prerelease.join(".") && identifierBase === false) {
                throw new Error("invalid increment argument: identifier already exists");
              }
              this.prerelease.push(base);
            }
          }
          if (identifier) {
            let prerelease = [identifier, base];
            if (identifierBase === false) {
              prerelease = [identifier];
            }
            if (isPrereleaseIdentifier(this.prerelease, identifier)) {
              const prereleaseBase = this.prerelease[identifier.split(".").length];
              if (isNaN(prereleaseBase)) {
                this.prerelease = prerelease;
              }
            } else {
              this.prerelease = prerelease;
            }
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${release}`);
      }
      this.raw = this.format();
      if (this.build.length) {
        this.raw += `+${this.build.join(".")}`;
      }
      return this;
    }
  }
  module.exports = SemVer;
});

// node_modules/semver/functions/parse.js
var require_parse = __commonJS((exports, module) => {
  var SemVer = require_semver();
  var parse = (version, options, throwErrors = false) => {
    if (version instanceof SemVer) {
      return version;
    }
    try {
      return new SemVer(version, options);
    } catch (er) {
      if (!throwErrors) {
        return null;
      }
      throw er;
    }
  };
  module.exports = parse;
});

// node_modules/semver/functions/valid.js
var require_valid = __commonJS((exports, module) => {
  var parse = require_parse();
  var valid = (version, options) => {
    const v = parse(version, options);
    return v ? v.version : null;
  };
  module.exports = valid;
});

// node_modules/semver/functions/clean.js
var require_clean = __commonJS((exports, module) => {
  var parse = require_parse();
  var clean = (version, options) => {
    const s = parse(version.trim().replace(/^[=v]+/, ""), options);
    return s ? s.version : null;
  };
  module.exports = clean;
});

// node_modules/semver/functions/inc.js
var require_inc = __commonJS((exports, module) => {
  var SemVer = require_semver();
  var inc = (version, release, options, identifier, identifierBase) => {
    if (typeof options === "string") {
      identifierBase = identifier;
      identifier = options;
      options = undefined;
    }
    try {
      return new SemVer(version instanceof SemVer ? version.version : version, options).inc(release, identifier, identifierBase).version;
    } catch (er) {
      return null;
    }
  };
  module.exports = inc;
});

// node_modules/semver/functions/diff.js
var require_diff = __commonJS((exports, module) => {
  var parse = require_parse();
  var diff = (version1, version2) => {
    const v1 = parse(version1, null, true);
    const v2 = parse(version2, null, true);
    const comparison = v1.compare(v2);
    if (comparison === 0) {
      return null;
    }
    const v1Higher = comparison > 0;
    const highVersion = v1Higher ? v1 : v2;
    const lowVersion = v1Higher ? v2 : v1;
    const highHasPre = !!highVersion.prerelease.length;
    const lowHasPre = !!lowVersion.prerelease.length;
    if (lowHasPre && !highHasPre) {
      if (!lowVersion.patch && !lowVersion.minor) {
        return "major";
      }
      if (lowVersion.compareMain(highVersion) === 0) {
        if (lowVersion.minor && !lowVersion.patch) {
          return "minor";
        }
        return "patch";
      }
    }
    const prefix = highHasPre ? "pre" : "";
    if (v1.major !== v2.major) {
      return prefix + "major";
    }
    if (v1.minor !== v2.minor) {
      return prefix + "minor";
    }
    if (v1.patch !== v2.patch) {
      return prefix + "patch";
    }
    return "prerelease";
  };
  module.exports = diff;
});

// node_modules/semver/functions/major.js
var require_major = __commonJS((exports, module) => {
  var SemVer = require_semver();
  var major = (a, loose) => new SemVer(a, loose).major;
  module.exports = major;
});

// node_modules/semver/functions/minor.js
var require_minor = __commonJS((exports, module) => {
  var SemVer = require_semver();
  var minor = (a, loose) => new SemVer(a, loose).minor;
  module.exports = minor;
});

// node_modules/semver/functions/patch.js
var require_patch = __commonJS((exports, module) => {
  var SemVer = require_semver();
  var patch = (a, loose) => new SemVer(a, loose).patch;
  module.exports = patch;
});

// node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS((exports, module) => {
  var parse = require_parse();
  var prerelease = (version, options) => {
    const parsed = parse(version, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
  };
  module.exports = prerelease;
});

// node_modules/semver/functions/compare.js
var require_compare = __commonJS((exports, module) => {
  var SemVer = require_semver();
  var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
  module.exports = compare;
});

// node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS((exports, module) => {
  var compare = require_compare();
  var rcompare = (a, b, loose) => compare(b, a, loose);
  module.exports = rcompare;
});

// node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS((exports, module) => {
  var compare = require_compare();
  var compareLoose = (a, b) => compare(a, b, true);
  module.exports = compareLoose;
});

// node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS((exports, module) => {
  var SemVer = require_semver();
  var compareBuild = (a, b, loose) => {
    const versionA = new SemVer(a, loose);
    const versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
  };
  module.exports = compareBuild;
});

// node_modules/semver/functions/sort.js
var require_sort = __commonJS((exports, module) => {
  var compareBuild = require_compare_build();
  var sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
  module.exports = sort;
});

// node_modules/semver/functions/rsort.js
var require_rsort = __commonJS((exports, module) => {
  var compareBuild = require_compare_build();
  var rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
  module.exports = rsort;
});

// node_modules/semver/functions/gt.js
var require_gt = __commonJS((exports, module) => {
  var compare = require_compare();
  var gt = (a, b, loose) => compare(a, b, loose) > 0;
  module.exports = gt;
});

// node_modules/semver/functions/lt.js
var require_lt = __commonJS((exports, module) => {
  var compare = require_compare();
  var lt = (a, b, loose) => compare(a, b, loose) < 0;
  module.exports = lt;
});

// node_modules/semver/functions/eq.js
var require_eq = __commonJS((exports, module) => {
  var compare = require_compare();
  var eq = (a, b, loose) => compare(a, b, loose) === 0;
  module.exports = eq;
});

// node_modules/semver/functions/neq.js
var require_neq = __commonJS((exports, module) => {
  var compare = require_compare();
  var neq = (a, b, loose) => compare(a, b, loose) !== 0;
  module.exports = neq;
});

// node_modules/semver/functions/gte.js
var require_gte = __commonJS((exports, module) => {
  var compare = require_compare();
  var gte = (a, b, loose) => compare(a, b, loose) >= 0;
  module.exports = gte;
});

// node_modules/semver/functions/lte.js
var require_lte = __commonJS((exports, module) => {
  var compare = require_compare();
  var lte = (a, b, loose) => compare(a, b, loose) <= 0;
  module.exports = lte;
});

// node_modules/semver/functions/cmp.js
var require_cmp = __commonJS((exports, module) => {
  var eq = require_eq();
  var neq = require_neq();
  var gt = require_gt();
  var gte = require_gte();
  var lt = require_lt();
  var lte = require_lte();
  var cmp = (a, op, b, loose) => {
    switch (op) {
      case "===":
        if (typeof a === "object") {
          a = a.version;
        }
        if (typeof b === "object") {
          b = b.version;
        }
        return a === b;
      case "!==":
        if (typeof a === "object") {
          a = a.version;
        }
        if (typeof b === "object") {
          b = b.version;
        }
        return a !== b;
      case "":
      case "=":
      case "==":
        return eq(a, b, loose);
      case "!=":
        return neq(a, b, loose);
      case ">":
        return gt(a, b, loose);
      case ">=":
        return gte(a, b, loose);
      case "<":
        return lt(a, b, loose);
      case "<=":
        return lte(a, b, loose);
      default:
        throw new TypeError(`Invalid operator: ${op}`);
    }
  };
  module.exports = cmp;
});

// node_modules/semver/functions/coerce.js
var require_coerce = __commonJS((exports, module) => {
  var SemVer = require_semver();
  var parse = require_parse();
  var { safeRe: re, t } = require_re();
  var coerce = (version, options) => {
    if (version instanceof SemVer) {
      return version;
    }
    if (typeof version === "number") {
      version = String(version);
    }
    if (typeof version !== "string") {
      return null;
    }
    options = options || {};
    let match = null;
    if (!options.rtl) {
      match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
    } else {
      const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
      let next;
      while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
        if (!match || next.index + next[0].length !== match.index + match[0].length) {
          match = next;
        }
        coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
      }
      coerceRtlRegex.lastIndex = -1;
    }
    if (match === null) {
      return null;
    }
    const major = match[2];
    const minor = match[3] || "0";
    const patch = match[4] || "0";
    const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
    const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
    return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
  };
  module.exports = coerce;
});

// node_modules/semver/functions/truncate.js
var require_truncate = __commonJS((exports, module) => {
  var parse = require_parse();
  var constants = require_constants();
  var SemVer = require_semver();
  var truncate = (version, truncation, options) => {
    if (!constants.RELEASE_TYPES.includes(truncation)) {
      return null;
    }
    const clonedVersion = cloneInputVersion(version, options);
    return clonedVersion && doTruncation(clonedVersion, truncation);
  };
  var cloneInputVersion = (version, options) => {
    const versionStringToParse = version instanceof SemVer ? version.version : version;
    return parse(versionStringToParse, options);
  };
  var doTruncation = (version, truncation) => {
    if (isPrerelease(truncation)) {
      return version.version;
    }
    version.prerelease = [];
    switch (truncation) {
      case "major":
        version.minor = 0;
        version.patch = 0;
        break;
      case "minor":
        version.patch = 0;
        break;
    }
    return version.format();
  };
  var isPrerelease = (type) => {
    return type.startsWith("pre");
  };
  module.exports = truncate;
});

// node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS((exports, module) => {
  class LRUCache {
    constructor() {
      this.max = 1000;
      this.map = new Map;
    }
    get(key) {
      const value = this.map.get(key);
      if (value === undefined) {
        return;
      } else {
        this.map.delete(key);
        this.map.set(key, value);
        return value;
      }
    }
    delete(key) {
      return this.map.delete(key);
    }
    set(key, value) {
      const deleted = this.delete(key);
      if (!deleted && value !== undefined) {
        if (this.map.size >= this.max) {
          const firstKey = this.map.keys().next().value;
          this.delete(firstKey);
        }
        this.map.set(key, value);
      }
      return this;
    }
  }
  module.exports = LRUCache;
});

// node_modules/semver/classes/range.js
var require_range = __commonJS((exports, module) => {
  var SPACE_CHARACTERS = /\s+/g;

  class Range {
    constructor(range, options) {
      options = parseOptions(options);
      if (range instanceof Range) {
        if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
          return range;
        } else {
          return new Range(range.raw, options);
        }
      }
      if (range instanceof Comparator) {
        this.raw = range.value;
        this.set = [[range]];
        this.formatted = undefined;
        return this;
      }
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
      this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
      if (!this.set.length) {
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      }
      if (this.set.length > 1) {
        const first = this.set[0];
        this.set = this.set.filter((c) => !isNullSet(c[0]));
        if (this.set.length === 0) {
          this.set = [first];
        } else if (this.set.length > 1) {
          for (const c of this.set) {
            if (c.length === 1 && isAny(c[0])) {
              this.set = [c];
              break;
            }
          }
        }
      }
      this.formatted = undefined;
    }
    get range() {
      if (this.formatted === undefined) {
        this.formatted = "";
        for (let i = 0;i < this.set.length; i++) {
          if (i > 0) {
            this.formatted += "||";
          }
          const comps = this.set[i];
          for (let k = 0;k < comps.length; k++) {
            if (k > 0) {
              this.formatted += " ";
            }
            this.formatted += comps[k].toString().trim();
          }
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(range) {
      range = range.replace(BUILDSTRIPRE, "");
      const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
      const memoKey = memoOpts + ":" + range;
      const cached = cache.get(memoKey);
      if (cached) {
        return cached;
      }
      const loose = this.options.loose;
      const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
      range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
      debug2("hyphen replace", range);
      range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
      debug2("comparator trim", range);
      range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
      debug2("tilde trim", range);
      range = range.replace(re[t.CARETTRIM], caretTrimReplace);
      debug2("caret trim", range);
      let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
      if (loose) {
        rangeList = rangeList.filter((comp) => {
          debug2("loose invalid filter", comp, this.options);
          return !!comp.match(re[t.COMPARATORLOOSE]);
        });
      }
      debug2("range list", rangeList);
      const rangeMap = new Map;
      const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
      for (const comp of comparators) {
        if (isNullSet(comp)) {
          return [comp];
        }
        rangeMap.set(comp.value, comp);
      }
      if (rangeMap.size > 1 && rangeMap.has("")) {
        rangeMap.delete("");
      }
      const result = [...rangeMap.values()];
      cache.set(memoKey, result);
      return result;
    }
    intersects(range, options) {
      if (!(range instanceof Range)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some((thisComparators) => {
        return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
          return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
            return rangeComparators.every((rangeComparator) => {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    }
    test(version) {
      if (!version) {
        return false;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer(version, this.options);
        } catch (er) {
          return false;
        }
      }
      for (let i = 0;i < this.set.length; i++) {
        if (testSet(this.set[i], version, this.options)) {
          return true;
        }
      }
      return false;
    }
  }
  module.exports = Range;
  var LRU = require_lrucache();
  var cache = new LRU;
  var parseOptions = require_parse_options();
  var Comparator = require_comparator();
  var debug2 = require_debug();
  var SemVer = require_semver();
  var {
    safeRe: re,
    src,
    t,
    comparatorTrimReplace,
    tildeTrimReplace,
    caretTrimReplace
  } = require_re();
  var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
  var BUILDSTRIPRE = new RegExp(src[t.BUILD], "g");
  var isNullSet = (c) => c.value === "<0.0.0-0";
  var isAny = (c) => c.value === "";
  var isSatisfiable = (comparators, options) => {
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while (result && remainingComparators.length) {
      result = remainingComparators.every((otherComparator) => {
        return testComparator.intersects(otherComparator, options);
      });
      testComparator = remainingComparators.pop();
    }
    return result;
  };
  var parseComparator = (comp, options) => {
    comp = comp.replace(re[t.BUILD], "");
    debug2("comp", comp, options);
    comp = replaceCarets(comp, options);
    debug2("caret", comp);
    comp = replaceTildes(comp, options);
    debug2("tildes", comp);
    comp = replaceXRanges(comp, options);
    debug2("xrange", comp);
    comp = replaceStars(comp, options);
    debug2("stars", comp);
    return comp;
  };
  var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
  var invalidXRangeOrder = (M, m, p) => isX(M) && !isX(m) || isX(m) && p && !isX(p);
  var replaceTildes = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
  };
  var replaceTilde = (comp, options) => {
    const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
    const z = options.includePrerelease ? "-0" : "";
    return comp.replace(r, (_, M, m, p, pr) => {
      debug2("tilde", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
      } else if (pr) {
        debug2("replaceTilde pr", pr);
        ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
      } else {
        ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
      }
      debug2("tilde return", ret);
      return ret;
    });
  };
  var replaceCarets = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
  };
  var replaceCaret = (comp, options) => {
    debug2("caret", comp, options);
    const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
    const z = options.includePrerelease ? "-0" : "";
    return comp.replace(r, (_, M, m, p, pr) => {
      debug2("caret", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        if (M === "0") {
          ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
        }
      } else if (pr) {
        debug2("replaceCaret pr", pr);
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
        }
      } else {
        debug2("no pr");
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
        }
      }
      debug2("caret return", ret);
      return ret;
    });
  };
  var replaceXRanges = (comp, options) => {
    debug2("replaceXRanges", comp, options);
    return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
  };
  var replaceXRange = (comp, options) => {
    comp = comp.trim();
    const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
      debug2("xRange", comp, ret, gtlt, M, m, p, pr);
      if (invalidXRangeOrder(M, m, p)) {
        return comp;
      }
      const xM = isX(M);
      const xm = xM || isX(m);
      const xp = xm || isX(p);
      const anyX = xp;
      if (gtlt === "=" && anyX) {
        gtlt = "";
      }
      pr = options.includePrerelease ? "-0" : "";
      if (xM) {
        if (gtlt === ">" || gtlt === "<") {
          ret = "<0.0.0-0";
        } else {
          ret = "*";
        }
      } else if (gtlt && anyX) {
        if (xm) {
          m = 0;
        }
        p = 0;
        if (gtlt === ">") {
          gtlt = ">=";
          if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else {
            m = +m + 1;
            p = 0;
          }
        } else if (gtlt === "<=") {
          gtlt = "<";
          if (xm) {
            M = +M + 1;
          } else {
            m = +m + 1;
          }
        }
        if (gtlt === "<") {
          pr = "-0";
        }
        ret = `${gtlt + M}.${m}.${p}${pr}`;
      } else if (xm) {
        ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
      } else if (xp) {
        ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
      }
      debug2("xRange return", ret);
      return ret;
    });
  };
  var replaceStars = (comp, options) => {
    debug2("replaceStars", comp, options);
    return comp.trim().replace(re[t.STAR], "");
  };
  var replaceGTE0 = (comp, options) => {
    debug2("replaceGTE0", comp, options);
    return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
  };
  var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
    if (isX(fM)) {
      from = "";
    } else if (isX(fm)) {
      from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
    } else if (isX(fp)) {
      from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
    } else if (fpr) {
      from = `>=${from}`;
    } else {
      from = `>=${from}${incPr ? "-0" : ""}`;
    }
    if (isX(tM)) {
      to = "";
    } else if (isX(tm)) {
      to = `<${+tM + 1}.0.0-0`;
    } else if (isX(tp)) {
      to = `<${tM}.${+tm + 1}.0-0`;
    } else if (tpr) {
      to = `<=${tM}.${tm}.${tp}-${tpr}`;
    } else if (incPr) {
      to = `<${tM}.${tm}.${+tp + 1}-0`;
    } else {
      to = `<=${to}`;
    }
    return `${from} ${to}`.trim();
  };
  var testSet = (set, version, options) => {
    for (let i = 0;i < set.length; i++) {
      if (!set[i].test(version)) {
        return false;
      }
    }
    if (version.prerelease.length && !options.includePrerelease) {
      for (let i = 0;i < set.length; i++) {
        debug2(set[i].semver);
        if (set[i].semver === Comparator.ANY) {
          continue;
        }
        if (set[i].semver.prerelease.length > 0) {
          const allowed = set[i].semver;
          if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  };
});

// node_modules/semver/classes/comparator.js
var require_comparator = __commonJS((exports, module) => {
  var ANY = Symbol("SemVer ANY");

  class Comparator {
    static get ANY() {
      return ANY;
    }
    constructor(comp, options) {
      options = parseOptions(options);
      if (comp instanceof Comparator) {
        if (comp.loose === !!options.loose) {
          return comp;
        } else {
          comp = comp.value;
        }
      }
      comp = comp.trim().split(/\s+/).join(" ");
      debug2("comparator", comp, options);
      this.options = options;
      this.loose = !!options.loose;
      this.parse(comp);
      if (this.semver === ANY) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      debug2("comp", this);
    }
    parse(comp) {
      const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
      const m = comp.match(r);
      if (!m) {
        throw new TypeError(`Invalid comparator: ${comp}`);
      }
      this.operator = m[1] !== undefined ? m[1] : "";
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!m[2]) {
        this.semver = ANY;
      } else {
        this.semver = new SemVer(m[2], this.options.loose);
      }
    }
    toString() {
      return this.value;
    }
    test(version) {
      debug2("Comparator.test", version, this.options.loose);
      if (this.semver === ANY || version === ANY) {
        return true;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer(version, this.options);
        } catch (er) {
          return false;
        }
      }
      return cmp(version, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
      if (!(comp instanceof Comparator)) {
        throw new TypeError("a Comparator is required");
      }
      if (this.operator === "") {
        if (this.value === "") {
          return true;
        }
        return new Range(comp.value, options).test(this.value);
      } else if (comp.operator === "") {
        if (comp.value === "") {
          return true;
        }
        return new Range(this.value, options).test(comp.semver);
      }
      options = parseOptions(options);
      if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
        return false;
      }
      if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
        return false;
      }
      if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
        return true;
      }
      if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
        return true;
      }
      if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
        return true;
      }
      if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
        return true;
      }
      if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
        return true;
      }
      return false;
    }
  }
  module.exports = Comparator;
  var parseOptions = require_parse_options();
  var { safeRe: re, t } = require_re();
  var cmp = require_cmp();
  var debug2 = require_debug();
  var SemVer = require_semver();
  var Range = require_range();
});

// node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS((exports, module) => {
  var Range = require_range();
  var satisfies = (version, range, options) => {
    try {
      range = new Range(range, options);
    } catch (er) {
      return false;
    }
    return range.test(version);
  };
  module.exports = satisfies;
});

// node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS((exports, module) => {
  var Range = require_range();
  var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
  module.exports = toComparators;
});

// node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS((exports, module) => {
  var SemVer = require_semver();
  var Range = require_range();
  var maxSatisfying = (versions, range, options) => {
    let max = null;
    let maxSV = null;
    let rangeObj = null;
    try {
      rangeObj = new Range(range, options);
    } catch (er) {
      return null;
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        if (!max || maxSV.compare(v) === -1) {
          max = v;
          maxSV = new SemVer(max, options);
        }
      }
    });
    return max;
  };
  module.exports = maxSatisfying;
});

// node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS((exports, module) => {
  var SemVer = require_semver();
  var Range = require_range();
  var minSatisfying = (versions, range, options) => {
    let min = null;
    let minSV = null;
    let rangeObj = null;
    try {
      rangeObj = new Range(range, options);
    } catch (er) {
      return null;
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        if (!min || minSV.compare(v) === 1) {
          min = v;
          minSV = new SemVer(min, options);
        }
      }
    });
    return min;
  };
  module.exports = minSatisfying;
});

// node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS((exports, module) => {
  var SemVer = require_semver();
  var Range = require_range();
  var gt = require_gt();
  var minVersion = (range, loose) => {
    range = new Range(range, loose);
    let minver = new SemVer("0.0.0");
    if (range.test(minver)) {
      return minver;
    }
    minver = new SemVer("0.0.0-0");
    if (range.test(minver)) {
      return minver;
    }
    minver = null;
    for (let i = 0;i < range.set.length; ++i) {
      const comparators = range.set[i];
      let setMin = null;
      comparators.forEach((comparator) => {
        const compver = new SemVer(comparator.semver.version);
        switch (comparator.operator) {
          case ">":
            if (compver.prerelease.length === 0) {
              compver.patch++;
            } else {
              compver.prerelease.push(0);
            }
            compver.raw = compver.format();
          case "":
          case ">=":
            if (!setMin || gt(compver, setMin)) {
              setMin = compver;
            }
            break;
          case "<":
          case "<=":
            break;
          default:
            throw new Error(`Unexpected operation: ${comparator.operator}`);
        }
      });
      if (setMin && (!minver || gt(minver, setMin))) {
        minver = setMin;
      }
    }
    if (minver && range.test(minver)) {
      return minver;
    }
    return null;
  };
  module.exports = minVersion;
});

// node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS((exports, module) => {
  var Range = require_range();
  var validRange = (range, options) => {
    try {
      return new Range(range, options).range || "*";
    } catch (er) {
      return null;
    }
  };
  module.exports = validRange;
});

// node_modules/semver/ranges/outside.js
var require_outside = __commonJS((exports, module) => {
  var SemVer = require_semver();
  var Comparator = require_comparator();
  var { ANY } = Comparator;
  var Range = require_range();
  var satisfies = require_satisfies();
  var gt = require_gt();
  var lt = require_lt();
  var lte = require_lte();
  var gte = require_gte();
  var outside = (version, range, hilo, options) => {
    version = new SemVer(version, options);
    range = new Range(range, options);
    let gtfn, ltefn, ltfn, comp, ecomp;
    switch (hilo) {
      case ">":
        gtfn = gt;
        ltefn = lte;
        ltfn = lt;
        comp = ">";
        ecomp = ">=";
        break;
      case "<":
        gtfn = lt;
        ltefn = gte;
        ltfn = gt;
        comp = "<";
        ecomp = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (satisfies(version, range, options)) {
      return false;
    }
    for (let i = 0;i < range.set.length; ++i) {
      const comparators = range.set[i];
      let high = null;
      let low = null;
      comparators.forEach((comparator) => {
        if (comparator.semver === ANY) {
          comparator = new Comparator(">=0.0.0");
        }
        high = high || comparator;
        low = low || comparator;
        if (gtfn(comparator.semver, high.semver, options)) {
          high = comparator;
        } else if (ltfn(comparator.semver, low.semver, options)) {
          low = comparator;
        }
      });
      if (high.operator === comp || high.operator === ecomp) {
        return false;
      }
      if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
        return false;
      } else if (low.operator === ecomp && ltfn(version, low.semver)) {
        return false;
      }
    }
    return true;
  };
  module.exports = outside;
});

// node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS((exports, module) => {
  var outside = require_outside();
  var gtr = (version, range, options) => outside(version, range, ">", options);
  module.exports = gtr;
});

// node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS((exports, module) => {
  var outside = require_outside();
  var ltr = (version, range, options) => outside(version, range, "<", options);
  module.exports = ltr;
});

// node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS((exports, module) => {
  var Range = require_range();
  var intersects = (r1, r2, options) => {
    r1 = new Range(r1, options);
    r2 = new Range(r2, options);
    return r1.intersects(r2, options);
  };
  module.exports = intersects;
});

// node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS((exports, module) => {
  var satisfies = require_satisfies();
  var compare = require_compare();
  module.exports = (versions, range, options) => {
    const set = [];
    let first = null;
    let prev = null;
    const v = versions.sort((a, b) => compare(a, b, options));
    for (const version of v) {
      const included = satisfies(version, range, options);
      if (included) {
        prev = version;
        if (!first) {
          first = version;
        }
      } else {
        if (prev) {
          set.push([first, prev]);
        }
        prev = null;
        first = null;
      }
    }
    if (first) {
      set.push([first, null]);
    }
    const ranges = [];
    for (const [min, max] of set) {
      if (min === max) {
        ranges.push(min);
      } else if (!max && min === v[0]) {
        ranges.push("*");
      } else if (!max) {
        ranges.push(`>=${min}`);
      } else if (min === v[0]) {
        ranges.push(`<=${max}`);
      } else {
        ranges.push(`${min} - ${max}`);
      }
    }
    const simplified = ranges.join(" || ");
    const original = typeof range.raw === "string" ? range.raw : String(range);
    return simplified.length < original.length ? simplified : range;
  };
});

// node_modules/semver/ranges/subset.js
var require_subset = __commonJS((exports, module) => {
  var Range = require_range();
  var Comparator = require_comparator();
  var { ANY } = Comparator;
  var satisfies = require_satisfies();
  var compare = require_compare();
  var subset = (sub, dom, options = {}) => {
    if (sub === dom) {
      return true;
    }
    sub = new Range(sub, options);
    dom = new Range(dom, options);
    let sawNonNull = false;
    OUTER:
      for (const simpleSub of sub.set) {
        for (const simpleDom of dom.set) {
          const isSub = simpleSubset(simpleSub, simpleDom, options);
          sawNonNull = sawNonNull || isSub !== null;
          if (isSub) {
            continue OUTER;
          }
        }
        if (sawNonNull) {
          return false;
        }
      }
    return true;
  };
  var minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
  var minimumVersion = [new Comparator(">=0.0.0")];
  var simpleSubset = (sub, dom, options) => {
    if (sub === dom) {
      return true;
    }
    if (sub.length === 1 && sub[0].semver === ANY) {
      if (dom.length === 1 && dom[0].semver === ANY) {
        return true;
      } else if (options.includePrerelease) {
        sub = minimumVersionWithPreRelease;
      } else {
        sub = minimumVersion;
      }
    }
    if (dom.length === 1 && dom[0].semver === ANY) {
      if (options.includePrerelease) {
        return true;
      } else {
        dom = minimumVersion;
      }
    }
    const eqSet = new Set;
    let gt, lt;
    for (const c of sub) {
      if (c.operator === ">" || c.operator === ">=") {
        gt = higherGT(gt, c, options);
      } else if (c.operator === "<" || c.operator === "<=") {
        lt = lowerLT(lt, c, options);
      } else {
        eqSet.add(c.semver);
      }
    }
    if (eqSet.size > 1) {
      return null;
    }
    let gtltComp;
    if (gt && lt) {
      gtltComp = compare(gt.semver, lt.semver, options);
      if (gtltComp > 0) {
        return null;
      } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
        return null;
      }
    }
    for (const eq of eqSet) {
      if (gt && !satisfies(eq, String(gt), options)) {
        return null;
      }
      if (lt && !satisfies(eq, String(lt), options)) {
        return null;
      }
      for (const c of dom) {
        if (!satisfies(eq, String(c), options)) {
          return false;
        }
      }
      return true;
    }
    let higher, lower;
    let hasDomLT, hasDomGT;
    let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
    let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
    if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
      needDomLTPre = false;
    }
    for (const c of dom) {
      hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
      hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
      if (gt) {
        if (needDomGTPre) {
          if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
            needDomGTPre = false;
          }
        }
        if (c.operator === ">" || c.operator === ">=") {
          higher = higherGT(gt, c, options);
          if (higher === c && higher !== gt) {
            return false;
          }
        } else if (gt.operator === ">=" && !c.test(gt.semver)) {
          return false;
        }
      }
      if (lt) {
        if (needDomLTPre) {
          if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
            needDomLTPre = false;
          }
        }
        if (c.operator === "<" || c.operator === "<=") {
          lower = lowerLT(lt, c, options);
          if (lower === c && lower !== lt) {
            return false;
          }
        } else if (lt.operator === "<=" && !c.test(lt.semver)) {
          return false;
        }
      }
      if (!c.operator && (lt || gt) && gtltComp !== 0) {
        return false;
      }
    }
    if (gt && hasDomLT && !lt && gtltComp !== 0) {
      return false;
    }
    if (lt && hasDomGT && !gt && gtltComp !== 0) {
      return false;
    }
    if (needDomGTPre || needDomLTPre) {
      return false;
    }
    return true;
  };
  var higherGT = (a, b, options) => {
    if (!a) {
      return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
  };
  var lowerLT = (a, b, options) => {
    if (!a) {
      return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
  };
  module.exports = subset;
});

// node_modules/semver/index.js
var require_semver2 = __commonJS((exports, module) => {
  var internalRe = require_re();
  var constants = require_constants();
  var SemVer = require_semver();
  var identifiers = require_identifiers();
  var parse = require_parse();
  var valid = require_valid();
  var clean = require_clean();
  var inc = require_inc();
  var diff = require_diff();
  var major = require_major();
  var minor = require_minor();
  var patch = require_patch();
  var prerelease = require_prerelease();
  var compare = require_compare();
  var rcompare = require_rcompare();
  var compareLoose = require_compare_loose();
  var compareBuild = require_compare_build();
  var sort = require_sort();
  var rsort = require_rsort();
  var gt = require_gt();
  var lt = require_lt();
  var eq = require_eq();
  var neq = require_neq();
  var gte = require_gte();
  var lte = require_lte();
  var cmp = require_cmp();
  var coerce = require_coerce();
  var truncate = require_truncate();
  var Comparator = require_comparator();
  var Range = require_range();
  var satisfies = require_satisfies();
  var toComparators = require_to_comparators();
  var maxSatisfying = require_max_satisfying();
  var minSatisfying = require_min_satisfying();
  var minVersion = require_min_version();
  var validRange = require_valid2();
  var outside = require_outside();
  var gtr = require_gtr();
  var ltr = require_ltr();
  var intersects = require_intersects();
  var simplifyRange = require_simplify();
  var subset = require_subset();
  module.exports = {
    parse,
    valid,
    clean,
    inc,
    diff,
    major,
    minor,
    patch,
    prerelease,
    compare,
    rcompare,
    compareLoose,
    compareBuild,
    sort,
    rsort,
    gt,
    lt,
    eq,
    neq,
    gte,
    lte,
    cmp,
    coerce,
    truncate,
    Comparator,
    Range,
    satisfies,
    toComparators,
    maxSatisfying,
    minSatisfying,
    minVersion,
    validRange,
    outside,
    gtr,
    ltr,
    intersects,
    simplifyRange,
    subset,
    SemVer,
    re: internalRe.re,
    src: internalRe.src,
    tokens: internalRe.t,
    SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: constants.RELEASE_TYPES,
    compareIdentifiers: identifiers.compareIdentifiers,
    rcompareIdentifiers: identifiers.rcompareIdentifiers
  };
});

// cli/build/build.worker.ts
import { parentPort } from "node:worker_threads";

// cli/build/worker-build-handlers.ts
import fs10 from "node:fs";
import path14 from "node:path";

// lib/shared/circuit-json-diagnostics.ts
function analyzeCircuitJson(circuitJson) {
  const errors = [];
  const warnings = [];
  for (const item of circuitJson) {
    if (!item || typeof item !== "object")
      continue;
    const t = item.type;
    const hasErrorType = typeof item.error_type === "string";
    const hasWarningType = typeof item.warning_type === "string";
    const isTypedError = typeof t === "string" && t.endsWith("_error");
    const isTypedWarning = typeof t === "string" && t.endsWith("_warning");
    if (hasErrorType || isTypedError) {
      errors.push(item);
      continue;
    }
    if (hasWarningType || isTypedWarning) {
      warnings.push(item);
    }
  }
  return { errors, warnings };
}

// lib/shared/generate-circuit-json.tsx
import fs3 from "node:fs";
import path3 from "node:path";
import { pathToFileURL } from "node:url";
import Debug from "debug";

// lib/utils/abbreviate-stringify-object.ts
var abbreviateStringifyObject = (obj) => {
  if (obj === null || obj === undefined)
    return obj;
  if (typeof obj !== "object")
    return obj;
  return JSON.stringify(Object.fromEntries(Object.entries(obj).map(([k, v]) => {
    return [
      k,
      typeof v === "string" ? v.slice(0, 100) : typeof v === "object" && v !== null ? abbreviateStringifyObject(v) : v
    ];
  })));
};

// lib/shared/generate-circuit-json.tsx
var import_make_vfs = __toESM(require_dist(), 1);

// lib/shared/importFromUserLand.ts
import { createRequire as createRequire2 } from "node:module";
import fs from "node:fs";
import path from "node:path";
async function importFromUserLand(moduleName) {
  const userModulePath = path.join(process.cwd(), "node_modules", moduleName);
  if (fs.existsSync(userModulePath)) {
    const userRequire = createRequire2(path.join(process.cwd(), "noop.js"));
    try {
      const resolvedUserPath = userRequire.resolve(moduleName);
      return await import(resolvedUserPath);
    } catch (error) {
      if (error?.code !== "MODULE_NOT_FOUND") {
        throw error;
      }
    }
  }
  const cliRequire = createRequire2(import.meta.url);
  try {
    const resolvedCliPath = cliRequire.resolve(moduleName);
    return await import(resolvedCliPath);
  } catch (error) {
    if (error?.code !== "MODULE_NOT_FOUND") {
      throw error;
    }
  }
  return import(moduleName);
}

// lib/shared/register-static-asset-loaders.ts
import fs2 from "node:fs";
import path2 from "node:path";
var STATIC_ASSET_EXTENSIONS = [
  ".glb",
  ".gltf",
  ".obj",
  ".step",
  ".kicad_mod",
  ".kicad_pcb",
  ".kicad_pro",
  ".kicad_sch"
];
var staticAssetFilter = new RegExp(`(${STATIC_ASSET_EXTENSIONS.map((ext) => ext.replace(".", "\\.")).join("|")})$`, "i");
var registered = false;
var activePlatformConfig;
var TEXT_STATIC_ASSET_EXTENSIONS = new Set([
  ".json",
  ".txt",
  ".md",
  ".obj",
  ".kicad_mod",
  ".kicad_pcb",
  ".kicad_pro",
  ".kicad_sch"
]);
var readFileContentForStaticLoader = (filePath) => {
  const ext = path2.extname(filePath).toLowerCase();
  if (TEXT_STATIC_ASSET_EXTENSIONS.has(ext)) {
    return fs2.readFileSync(filePath, "utf-8");
  }
  const buffer = fs2.readFileSync(filePath);
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
};
var getStaticFileLoader = (filePath) => {
  const extWithDot = path2.extname(filePath).toLowerCase();
  const ext = extWithDot.replace(/^\./, "");
  return activePlatformConfig?.staticFileLoaderMap?.[ext] ?? activePlatformConfig?.staticFileLoaderMap?.[extWithDot];
};
var normalizeStaticFileLoaderResult = (result) => {
  if (result && typeof result === "object" && result.__esModule) {
    return result;
  }
  return {
    __esModule: true,
    default: result
  };
};
var getBaseUrlFromTsConfig = () => {
  const tsconfigPath = path2.join(process.cwd(), "tsconfig.json");
  try {
    if (!fs2.existsSync(tsconfigPath)) {
      return null;
    }
    const tsconfigContent = fs2.readFileSync(tsconfigPath, "utf-8");
    const tsconfig = JSON.parse(tsconfigContent);
    if (tsconfig.compilerOptions?.baseUrl) {
      return tsconfig.compilerOptions.baseUrl;
    }
  } catch {}
  return null;
};
var registerStaticAssetLoaders = (platformConfig) => {
  activePlatformConfig = platformConfig;
  if (registered)
    return;
  registered = true;
  if (typeof Bun !== "undefined" && typeof Bun.plugin === "function") {
    const baseUrl = getBaseUrlFromTsConfig();
    Bun.plugin({
      name: "tsci-static-assets",
      setup(build) {
        build.onLoad({ filter: staticAssetFilter }, async (args) => {
          const staticFileLoader = getStaticFileLoader(args.path);
          if (staticFileLoader) {
            const loaderExports = normalizeStaticFileLoaderResult(await staticFileLoader(readFileContentForStaticLoader(args.path)));
            return {
              exports: loaderExports,
              loader: "object"
            };
          }
          const baseDir = baseUrl ? path2.resolve(process.cwd(), baseUrl) : process.cwd();
          const relativePath = path2.relative(baseDir, args.path).split(path2.sep).join("/");
          const pathStr = `./${relativePath}`;
          return {
            exports: {
              __esModule: true,
              default: pathStr
            },
            loader: "object"
          };
        });
      }
    });
  }
};

// lib/shared/generate-circuit-json.tsx
import { jsxDEV } from "react/jsx-dev-runtime";
var debug = Debug("tsci:generate-circuit-json");
var ALLOWED_FILE_EXTENSIONS = [
  ".tsx",
  ".ts",
  ".jsx",
  ".js",
  ".json",
  ".txt",
  ".md",
  ".obj",
  ".kicad_mod",
  ".kicad_pcb",
  ".kicad_pro",
  ".kicad_sch"
];
async function generateCircuitJson({
  filePath,
  outputDir,
  outputFileName,
  saveToFile = false,
  platformConfig,
  injectedProps,
  onAsyncEffectStatus
}) {
  debug(`Generating circuit JSON for ${filePath}`);
  const React = await importFromUserLand("react");
  globalThis.React = React;
  registerStaticAssetLoaders(platformConfig);
  const userLandTscircuit = await importFromUserLand("tscircuit");
  const runner = new userLandTscircuit.RootCircuit({
    platform: platformConfig
  });
  const absoluteFilePath = path3.isAbsolute(filePath) ? filePath : path3.resolve(process.cwd(), filePath);
  const projectDir = path3.dirname(absoluteFilePath);
  const resolvedOutputDir = outputDir ?? projectDir;
  const relativeComponentPath = path3.relative(projectDir, absoluteFilePath);
  const baseFileName = outputFileName || path3.basename(absoluteFilePath).replace(/\.[^.]+$/, "");
  const outputPath = path3.join(resolvedOutputDir, `${baseFileName}.circuit.json`);
  debug(`Project directory: ${projectDir}`);
  debug(`Relative component path: ${relativeComponentPath}`);
  debug(`Output path: ${outputPath}`);
  const fsMap = {
    ...await import_make_vfs.getVirtualFileSystemFromDirPath({
      dirPath: projectDir,
      fileMatchFn: (filePath2) => {
        const normalizedFilePath = filePath2.replace(/\\/g, "/");
        if (normalizedFilePath.endsWith(".kicad_mod")) {
          return true;
        }
        if (normalizedFilePath.includes("node_modules/"))
          return false;
        if (normalizedFilePath.includes("dist/"))
          return false;
        if (normalizedFilePath.includes("build/"))
          return false;
        if (normalizedFilePath.match(/^\.[^/]/))
          return false;
        if (!ALLOWED_FILE_EXTENSIONS.includes(path3.extname(normalizedFilePath)))
          return false;
        return true;
      },
      contentFormat: "string"
    })
  };
  debug(`fsMap: ${abbreviateStringifyObject(fsMap)}`);
  const MainComponent = await import(pathToFileURL(absoluteFilePath).href);
  const Component = MainComponent.default || (Object.keys(MainComponent).find((k) => k[0] === k[0].toUpperCase()) !== undefined ? MainComponent[Object.keys(MainComponent).find((k) => k[0] === k[0].toUpperCase())] : undefined);
  if (!Component) {
    throw new Error(`No component found in "${absoluteFilePath}". Make sure you export a component.`);
  }
  runner.add(/* @__PURE__ */ jsxDEV(Component, {
    ...injectedProps ?? {}
  }, undefined, false, undefined, this));
  runner.render();
  const loggedAsyncEffectNames = new Set;
  while (!runner.isDoneRendering()) {
    for (const asyncEffect of runner.getRunningAsyncEffects()) {
      const asyncEffectName = asyncEffect.effectName;
      if (!asyncEffectName || loggedAsyncEffectNames.has(asyncEffectName)) {
        continue;
      }
      loggedAsyncEffectNames.add(asyncEffectName);
      onAsyncEffectStatus?.(asyncEffectName);
    }
    await new Promise((resolve2) => setTimeout(resolve2, 100));
    runner.render();
  }
  runner.emit("renderComplete");
  const circuitJson = await runner.getCircuitJson();
  if (saveToFile) {
    debug(`Saving circuit JSON to ${outputPath}`);
    fs3.writeFileSync(outputPath, JSON.stringify(circuitJson, null, 2));
  }
  return {
    circuitJson,
    outputPath,
    rootCircuit: runner
  };
}

// lib/shared/get-platform-config-with-cli-defaults.ts
import { createHash } from "node:crypto";
import fs4 from "node:fs";
import path4 from "node:path";
import { getPlatformConfig } from "@tscircuit/eval/platform-config";
function createLocalCacheEngine(cacheDir = path4.join(process.cwd(), ".tscircuit", "cache")) {
  return {
    getItem: (key) => {
      try {
        const hash = createHash("md5").update(key).digest("hex");
        const keyWithSafeCharacters = key.replace(/[^a-zA-Z0-9]/g, "_");
        const filePath = path4.join(cacheDir, `${keyWithSafeCharacters.slice(keyWithSafeCharacters.length - 10, keyWithSafeCharacters.length)}-${hash}.json`);
        return fs4.readFileSync(filePath, "utf-8");
      } catch {
        return null;
      }
    },
    setItem: (key, value) => {
      try {
        fs4.mkdirSync(cacheDir, { recursive: true });
        const hash = createHash("md5").update(key).digest("hex");
        const keyWithSafeCharacters = key.replace(/[^a-zA-Z0-9]/g, "_");
        const filePath = path4.join(cacheDir, `${keyWithSafeCharacters.slice(keyWithSafeCharacters.length - 10, keyWithSafeCharacters.length)}-${hash}.json`);
        fs4.writeFileSync(filePath, value);
      } catch {}
    }
  };
}
function getPlatformConfigWithCliDefaults(userConfig) {
  const basePlatformConfig = getPlatformConfig();
  const defaultConfig = {
    ...basePlatformConfig,
    localCacheEngine: createLocalCacheEngine(),
    footprintFileParserMap: {
      ...basePlatformConfig.footprintFileParserMap,
      kicad_mod: {
        loadFromUrl: async (url) => {
          let fetchUrl = url;
          if (url.startsWith("./") || url.startsWith("../")) {
            const absolutePath = path4.resolve(process.cwd(), url);
            fetchUrl = `file://${absolutePath}`;
          } else if (url.startsWith("/")) {
            if (fs4.existsSync(url)) {
              fetchUrl = `file://${url}`;
            } else {
              const relativePath = `.${url}`;
              const absolutePath = path4.resolve(process.cwd(), relativePath);
              if (fs4.existsSync(absolutePath)) {
                fetchUrl = `file://${absolutePath}`;
              } else {
                fetchUrl = `file://${url}`;
              }
            }
          }
          return basePlatformConfig.footprintFileParserMap.kicad_mod.loadFromUrl(fetchUrl);
        }
      }
    }
  };
  if (!userConfig) {
    return defaultConfig;
  }
  const mergedConfig = {
    ...defaultConfig,
    ...userConfig,
    footprintFileParserMap: {
      ...defaultConfig.footprintFileParserMap,
      ...userConfig.footprintFileParserMap
    }
  };
  if (defaultConfig.staticFileLoaderMap || userConfig.staticFileLoaderMap) {
    mergedConfig.staticFileLoaderMap = {
      ...defaultConfig.staticFileLoaderMap,
      ...userConfig.staticFileLoaderMap
    };
  }
  return mergedConfig;
}

// cli/build/drc-diagnostic-filter.ts
import {
  categorizeErrorOrWarning
} from "@tscircuit/circuit-json-util";
var EMPTY_IGNORE_COUNTS = () => ({
  netlist: 0,
  pin_specification: 0,
  placement: 0,
  routing: 0,
  unknown: 0
});
var normalizeCategory = (category) => category === "netlist" || category === "pin_specification" || category === "placement" || category === "routing" ? category : "unknown";
var categorizeIssue = (issue) => normalizeCategory(categorizeErrorOrWarning(issue));
var shouldIgnoreCategory = (category, ignoreOptions) => {
  switch (category) {
    case "netlist":
      return Boolean(ignoreOptions?.ignoreNetlistDrc);
    case "pin_specification":
      return Boolean(ignoreOptions?.ignorePinSpecificationDrc);
    case "placement":
      return Boolean(ignoreOptions?.ignorePlacementDrc);
    case "routing":
      return Boolean(ignoreOptions?.ignoreRoutingDrc);
    default:
      return false;
  }
};
var filterIssues = ({
  issues,
  ignoreOptions,
  ignoredByCategory
}) => {
  const kept = [];
  for (const issue of issues) {
    const category = categorizeIssue(issue);
    if (shouldIgnoreCategory(category, ignoreOptions)) {
      ignoredByCategory[category] += 1;
      continue;
    }
    kept.push(issue);
  }
  return kept;
};
var filterDiagnosticsByDrcCategory = ({
  errors,
  warnings,
  ignoreOptions
}) => {
  const ignoredByCategory = EMPTY_IGNORE_COUNTS();
  const filteredErrors = filterIssues({
    issues: errors,
    ignoreOptions,
    ignoredByCategory
  });
  const filteredWarnings = filterIssues({
    issues: warnings,
    ignoreOptions,
    ignoredByCategory
  });
  const ignoredCount = Object.values(ignoredByCategory).reduce((sum, count) => sum + count, 0);
  return {
    errors: filteredErrors,
    warnings: filteredWarnings,
    ignoredCount,
    ignoredByCategory
  };
};
var formatIgnoredDrcCounts = (counts) => [
  ["netlist", counts.netlist],
  ["pin_specification", counts.pin_specification],
  ["placement", counts.placement],
  ["routing", counts.routing],
  ["unknown", counts.unknown]
].filter(([, count]) => count > 0).map(([category, count]) => `${category}: ${count}`).join(", ");

// cli/build/image-format-selection.ts
var DEFAULT_IMAGE_FORMAT_SELECTION = {
  threeDPngs: true,
  pcbPngs: false,
  pcbSvgs: true,
  schematicSvgs: true,
  simulationSvgs: false,
  simulationSchematicSvgs: false
};
var EMPTY_IMAGE_FORMAT_SELECTION = {
  threeDPngs: false,
  pcbPngs: false,
  pcbSvgs: false,
  schematicSvgs: false,
  simulationSvgs: false,
  simulationSchematicSvgs: false
};
var hasAnyImageFormatSelected = (selection) => selection.threeDPngs || selection.pcbPngs || selection.pcbSvgs || selection.schematicSvgs || selection.simulationSvgs || selection.simulationSchematicSvgs;
var hasNewOutputFlags = (options) => Boolean(options?.pngs || options?.pcbPng || options?.svgs || options?.pcbSvgs || options?.simulationSvgs || options?.simulationSchematicSvgs || options?.schematicSvgs);
var hasEstablishedOutputFlags = (options) => Boolean(options?.["3d"] || options?.["3dPng"] || options?.pcbOnly || options?.schematicOnly);
var resolveImageFormatSelection = (options) => {
  const hasNewFlags = hasNewOutputFlags(options);
  const hasEstablishedFlags = hasEstablishedOutputFlags(options);
  const hasExplicitSelection = hasNewFlags || hasEstablishedFlags;
  if (!hasExplicitSelection) {
    return {
      selection: { ...DEFAULT_IMAGE_FORMAT_SELECTION },
      hasExplicitSelection: false
    };
  }
  if (!hasNewFlags && hasEstablishedFlags) {
    const selection2 = {
      threeDPngs: Boolean(options?.["3d"] || options?.["3dPng"]),
      pcbPngs: false,
      pcbSvgs: true,
      schematicSvgs: true,
      simulationSvgs: false,
      simulationSchematicSvgs: false
    };
    if (options?.pcbOnly && !options?.schematicOnly) {
      selection2.schematicSvgs = false;
    }
    if (options?.schematicOnly && !options?.pcbOnly) {
      selection2.pcbSvgs = false;
    }
    return { selection: selection2, hasExplicitSelection: true };
  }
  const selection = {
    ...EMPTY_IMAGE_FORMAT_SELECTION
  };
  if (options?.svgs) {
    selection.pcbSvgs = true;
    selection.schematicSvgs = true;
    selection.simulationSvgs = true;
    selection.simulationSchematicSvgs = true;
  }
  if (options?.pcbSvgs) {
    selection.pcbSvgs = true;
  }
  if (options?.pcbPng) {
    selection.pcbPngs = true;
  }
  if (options?.schematicSvgs) {
    selection.schematicSvgs = true;
  }
  if (options?.simulationSvgs) {
    selection.simulationSvgs = true;
  }
  if (options?.simulationSchematicSvgs) {
    selection.simulationSchematicSvgs = true;
  }
  if (options?.pngs || options?.["3d"] || options?.["3dPng"]) {
    selection.threeDPngs = true;
  }
  if (options?.pcbOnly && !options?.schematicOnly) {
    selection.schematicSvgs = false;
  }
  if (options?.schematicOnly && !options?.pcbOnly) {
    selection.pcbSvgs = false;
  }
  return { selection, hasExplicitSelection: true };
};

// cli/build/worker-output-generators.ts
import fs9 from "node:fs";
import path13 from "node:path";

// node_modules/circuit-json-to-3d-png/dist/index.js
function normalizeDir(dir) {
  const len = Math.sqrt(dir[0] ** 2 + dir[1] ** 2 + dir[2] ** 2);
  if (len === 0)
    return [0, 1, 0];
  return [dir[0] / len, dir[1] / len, dir[2] / len];
}
function distance(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}
function repositionCamera(cam, dir, distOverride) {
  const dist = distOverride ?? distance(cam.camPos, cam.lookAt);
  const [nx, ny, nz] = normalizeDir(dir);
  return {
    camPos: [
      cam.lookAt[0] + nx * dist,
      cam.lookAt[1] + ny * dist,
      cam.lookAt[2] + nz * dist
    ],
    lookAt: cam.lookAt,
    fov: cam.fov
  };
}
var CAMERA_PRESETS = {
  "top-down": (cam) => repositionCamera(cam, [0.00000001, 1, -0.001]),
  "top-down-ortho": (cam) => {
    const desiredFov = 3;
    const dir = [0.00000001, 1, -0.001];
    const origDist = distance(cam.camPos, cam.lookAt);
    const origFovRad = Math.max(cam.fov * Math.PI / 180, 0.01);
    const desiredFovRad = Math.max(desiredFov * Math.PI / 180, 0.01);
    const tanOrig = Math.tan(origFovRad / 2);
    const tanDesired = Math.max(Math.tan(desiredFovRad / 2), 0.0001);
    const distScale = Number.isFinite(tanOrig / tanDesired) && tanOrig > 0 ? tanOrig / tanDesired : 1;
    const newDist = origDist * distScale;
    const repositioned = repositionCamera(cam, dir, newDist);
    return { ...repositioned, fov: desiredFov };
  },
  "top-left-corner": (cam) => repositionCamera(cam, [0.7, 1.2, -0.8]),
  "top-left": (cam) => repositionCamera(cam, [1, 1.2, 0]),
  "top-right-corner": (cam) => repositionCamera(cam, [-0.7, 1.2, -0.8]),
  "top-right": (cam) => repositionCamera(cam, [-1, 1.2, 0]),
  "left-sideview": (cam) => repositionCamera(cam, [1, 0.05, 0]),
  "right-sideview": (cam) => repositionCamera(cam, [-1, 0.05, 0]),
  front: (cam) => repositionCamera(cam, [0, 0.05, -1]),
  "top-center-angled": (cam) => repositionCamera(cam, [0, 1, -1])
};
var CAMERA_PRESET_NAMES = Object.keys(CAMERA_PRESETS);
function applyCameraPreset(preset, cam) {
  if (!(preset in CAMERA_PRESETS)) {
    throw new Error(`Unknown camera preset "${preset}". Valid presets: ${CAMERA_PRESET_NAMES.join(", ")}`);
  }
  return CAMERA_PRESETS[preset](cam);
}
var viewToArrayBuffer = (view) => {
  const copy = new Uint8Array(view.byteLength);
  copy.set(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
  return copy.buffer;
};
var normalizeToArrayBuffer = async (value) => {
  if (value instanceof ArrayBuffer) {
    return value;
  }
  if (ArrayBuffer.isView(value)) {
    return viewToArrayBuffer(value);
  }
  if ("arrayBuffer" in value && typeof value.arrayBuffer === "function") {
    const result = value.arrayBuffer();
    return result instanceof Promise ? await result : result;
  }
  throw new Error("Expected ArrayBuffer, ArrayBufferView, or Buffer-compatible object");
};
var normalizeToUint8Array = (value) => {
  if (value instanceof Uint8Array) {
    return value;
  }
  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(viewToArrayBuffer(value));
  }
  throw new Error("Expected Uint8Array, ArrayBuffer, or ArrayBufferView");
};
var circuitJsonToGltfModulePromise = null;
var poppyGlModulePromise = null;
var loadCircuitJsonToGltf = async () => {
  circuitJsonToGltfModulePromise ??= import("circuit-json-to-gltf");
  return circuitJsonToGltfModulePromise;
};
var loadPoppyGl = async () => {
  poppyGlModulePromise ??= import("poppygl");
  return poppyGlModulePromise;
};
var modelUrlKeys = [
  "model_glb_url",
  "glb_model_url",
  "model_stl_url",
  "stl_model_url",
  "model_obj_url",
  "obj_model_url",
  "model_gltf_url",
  "gltf_model_url",
  "model_step_url",
  "step_model_url"
];
var hasUriScheme = (value) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value) && !/^[a-zA-Z]:[\\/]/.test(value);
var isWindowsAbsolutePath = (value) => /^[a-zA-Z]:[\\/]/.test(value);
var getDefaultBaseDir = () => {
  if (typeof process !== "undefined" && process && typeof process.cwd === "function") {
    return process.cwd();
  }
  return;
};
var toFileUrl = (value) => {
  const normalizedPath = value.replace(/\\/g, "/");
  const pathname = isWindowsAbsolutePath(value) ? `/${normalizedPath}` : normalizedPath;
  return new URL(`file://${encodeURI(pathname)}`).href;
};
var toDirectoryUrl = (value) => {
  if (hasUriScheme(value)) {
    return value.endsWith("/") ? value : `${value}/`;
  }
  const directoryPath = value.endsWith("/") || value.endsWith("\\") ? value : `${value}/`;
  return toFileUrl(directoryPath);
};
var normalizeModelUrls = (circuitJson, options = {}) => {
  const baseDir = options.modelPathBaseDir ?? getDefaultBaseDir();
  const hasModelPathBaseDir = options.modelPathBaseDir != null;
  const preserveRelativeModelUrls = Boolean(options.projectBaseUrl);
  return circuitJson.map((element) => {
    if (!element || typeof element !== "object")
      return element;
    const updated = { ...element };
    for (const key of modelUrlKeys) {
      const value = updated[key];
      if (!value)
        continue;
      if (hasUriScheme(value))
        continue;
      if (value.startsWith("/") && preserveRelativeModelUrls) {
        updated[key] = value;
      } else if (value.startsWith("/") || isWindowsAbsolutePath(value)) {
        updated[key] = toFileUrl(value);
      } else if (preserveRelativeModelUrls && !hasModelPathBaseDir) {
        updated[key] = value;
      } else if (!baseDir) {
        updated[key] = value;
      } else {
        updated[key] = new URL(value, toDirectoryUrl(baseDir)).href;
      }
    }
    return updated;
  });
};
var getRenderCamera = (circuitJson, defaultCamera, options = {}) => {
  if (options.camera) {
    return options.camera;
  }
  if (!options.cameraPreset) {
    return defaultCamera;
  }
  return applyCameraPreset(options.cameraPreset, defaultCamera);
};
var getConversionOptions = (format, options = {}) => ({
  format,
  ...options.projectBaseUrl ? { projectBaseUrl: options.projectBaseUrl } : {},
  ...options.authHeaders ? { authHeaders: options.authHeaders } : {},
  ...options.boardTextureResolution ? { boardTextureResolution: options.boardTextureResolution } : {}
});
var convertCircuitJsonTo3dGlb = async (circuitJson, options = {}) => {
  const normalizedCircuitJson = normalizeModelUrls(circuitJson, options);
  const { convertCircuitJsonToGltf } = await loadCircuitJsonToGltf();
  const glbBuffer = await convertCircuitJsonToGltf(normalizedCircuitJson, getConversionOptions("glb", options));
  return normalizeToUint8Array(await normalizeToArrayBuffer(glbBuffer));
};
var renderCircuitJsonTo3dPng = async (circuitJson, options = {}) => {
  const [{ getBestCameraPosition }, { renderGLTFToPNGFromGLB }] = await Promise.all([loadCircuitJsonToGltf(), loadPoppyGl()]);
  const glbBuffer = await convertCircuitJsonTo3dGlb(circuitJson, options);
  const glbArrayBuffer = await normalizeToArrayBuffer(glbBuffer);
  const defaultCamera = getBestCameraPosition(circuitJson);
  return renderGLTFToPNGFromGLB(glbArrayBuffer, getRenderCamera(circuitJson, defaultCamera, options));
};

// node_modules/circuit-json-to-step/node_modules/stepts/dist/index.js
var Entity = class {
  static parse(_a, _ctx) {
    throw new Error("not implemented");
  }
};
var eid = (n) => n;
var Ref = class {
  constructor(id) {
    this.id = id;
  }
  resolve(repo) {
    const e = repo.get(this.id);
    if (!e)
      throw new Error(`Unresolved #${this.id}`);
    return e;
  }
  toString() {
    return `#${this.id}`;
  }
};
var stepStr = (s) => `'${s.replace(/'/g, "''")}'`;
var fmtNum = (n) => Number.isInteger(n) ? `${n}.` : `${n}`;
var Repository = class {
  map = /* @__PURE__ */ new Map;
  order = [];
  maxId = 0;
  schema = "AP214";
  units = { length: "MM", angle: "RAD", solidAngle: "SR" };
  set(id, e) {
    if (!this.map.has(id)) {
      this.order.push(id);
      if (id > this.maxId)
        this.maxId = id;
    }
    this.map.set(id, e);
  }
  add(e) {
    this.maxId++;
    const id = eid(this.maxId);
    this.set(id, e);
    return new Ref(id);
  }
  get(id) {
    return this.map.get(id);
  }
  entries() {
    return this.order.map((id) => [id, this.map.get(id)]);
  }
  toPartFile(meta) {
    const now = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "-");
    const hdr = [
      "ISO-10303-21;",
      "HEADER;",
      `FILE_DESCRIPTION((${stepStr(meta.name)}),'2;1');`,
      `FILE_NAME(${stepStr(meta.name)},${stepStr(now)},(${stepStr(meta.author ?? "tscircuit")}),(${stepStr(meta.org ?? "tscircuit")}),${stepStr("generator")},${stepStr("")},${stepStr("")});`,
      `FILE_SCHEMA(('${this.schema === "AP214" ? "AUTOMOTIVE_DESIGN { 1 0 10303 214 1 1 1 1 }" : "AP242_MANAGED_MODEL_BASED_3D_ENGINEERING"}'));`,
      "ENDSEC;",
      "DATA;"
    ];
    const data = this.entries().map(([id, e]) => `#${id} = ${e.toStep(this)};`);
    const ftr = ["ENDSEC;", "END-ISO-10303-21;"];
    return [...hdr, ...data, ...ftr].join(`
`);
  }
};
var registry = /* @__PURE__ */ new Map;
function register(type, parser) {
  registry.set(type, parser);
}
function getParser(type) {
  return registry.get(type);
}
var Axis2Placement3D = class _Axis2Placement3D extends Entity {
  constructor(name, location, axis, refDirection) {
    super();
    this.name = name;
    this.location = location;
    this.axis = axis;
    this.refDirection = refDirection;
  }
  type = "AXIS2_PLACEMENT_3D";
  static parse(a, ctx) {
    const name = ctx.parseString(a[0]);
    const loc = ctx.parseRef(a[1]);
    const axis = a[2] !== "$" ? ctx.parseRef(a[2]) : undefined;
    const refd = a[3] !== "$" ? ctx.parseRef(a[3]) : undefined;
    return new _Axis2Placement3D(name, loc, axis, refd);
  }
  toStep() {
    const A = this.axis ? this.axis.toString() : "$";
    const R = this.refDirection ? this.refDirection.toString() : "$";
    return `AXIS2_PLACEMENT_3D(${stepStr(this.name)},${this.location},${A},${R})`;
  }
};
register("AXIS2_PLACEMENT_3D", Axis2Placement3D.parse.bind(Axis2Placement3D));
var CartesianPoint = class _CartesianPoint extends Entity {
  constructor(name, x, y, z) {
    super();
    this.name = name;
    this.x = x;
    this.y = y;
    this.z = z;
  }
  type = "CARTESIAN_POINT";
  static parse(a, ctx) {
    const name = ctx.parseString(a[0]);
    const coords = a[1].replace(/^\(|\)$/g, "").split(",").map(ctx.parseNumber);
    return new _CartesianPoint(name, coords[0], coords[1], coords[2] ?? 0);
  }
  toStep() {
    return `CARTESIAN_POINT(${stepStr(this.name)},(${fmtNum(this.x)},${fmtNum(this.y)},${fmtNum(this.z)}))`;
  }
};
register("CARTESIAN_POINT", CartesianPoint.parse.bind(CartesianPoint));
var Circle = class _Circle extends Entity {
  constructor(name, placement, radius) {
    super();
    this.name = name;
    this.placement = placement;
    this.radius = radius;
  }
  type = "CIRCLE";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const pl = ctx.parseRef(a[1]);
    const r = ctx.parseNumber(a[2]);
    return new _Circle(name, pl, r);
  }
  toStep() {
    return `CIRCLE(${this.name ? `'${this.name}'` : "''"},${this.placement},${fmtNum(this.radius)})`;
  }
};
register("CIRCLE", Circle.parse.bind(Circle));
var CylindricalSurface = class _CylindricalSurface extends Entity {
  constructor(name, position, radius) {
    super();
    this.name = name;
    this.position = position;
    this.radius = radius;
  }
  type = "CYLINDRICAL_SURFACE";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const position = ctx.parseRef(a[1]);
    const radius = ctx.parseNumber(a[2]);
    return new _CylindricalSurface(name, position, radius);
  }
  toStep() {
    return `CYLINDRICAL_SURFACE(${stepStr(this.name)},${this.position},${fmtNum(this.radius)})`;
  }
};
register("CYLINDRICAL_SURFACE", CylindricalSurface.parse.bind(CylindricalSurface));
var Direction = class _Direction extends Entity {
  constructor(name, dx, dy, dz) {
    super();
    this.name = name;
    this.dx = dx;
    this.dy = dy;
    this.dz = dz;
  }
  type = "DIRECTION";
  static parse(a, ctx) {
    const name = ctx.parseString(a[0]);
    const comps = a[1].replace(/^\(|\)$/g, "").split(",").map(ctx.parseNumber);
    return new _Direction(name, comps[0], comps[1], comps[2] ?? 0);
  }
  toStep() {
    return `DIRECTION(${stepStr(this.name)},(${fmtNum(this.dx)},${fmtNum(this.dy)},${fmtNum(this.dz)}))`;
  }
};
register("DIRECTION", Direction.parse.bind(Direction));
var Line = class _Line extends Entity {
  constructor(name, pnt, dir) {
    super();
    this.name = name;
    this.pnt = pnt;
    this.dir = dir;
  }
  type = "LINE";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const p = ctx.parseRef(a[1]);
    const vecTok = a[2];
    if (vecTok.startsWith("VECTOR(")) {
      throw new Error("Inline VECTOR in LINE is not supported - VECTOR should be a separate entity");
    }
    const vec = ctx.parseRef(vecTok);
    return new _Line(name, p, vec);
  }
  toStep() {
    return `LINE(${this.name ? `'${this.name}'` : "''"},${this.pnt},${this.dir})`;
  }
};
register("LINE", Line.parse.bind(Line));
var Plane = class _Plane extends Entity {
  constructor(name, placement) {
    super();
    this.name = name;
    this.placement = placement;
  }
  type = "PLANE";
  static parse(a, ctx) {
    return new _Plane(ctx.parseString(a[0]), ctx.parseRef(a[1]));
  }
  toStep() {
    return `PLANE(${stepStr(this.name)},${this.placement})`;
  }
};
register("PLANE", Plane.parse.bind(Plane));
var ToroidalSurface = class _ToroidalSurface extends Entity {
  constructor(name, position, majorRadius, minorRadius) {
    super();
    this.name = name;
    this.position = position;
    this.majorRadius = majorRadius;
    this.minorRadius = minorRadius;
  }
  type = "TOROIDAL_SURFACE";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const position = ctx.parseRef(a[1]);
    const majorRadius = ctx.parseNumber(a[2]);
    const minorRadius = ctx.parseNumber(a[3]);
    return new _ToroidalSurface(name, position, majorRadius, minorRadius);
  }
  toStep() {
    return `TOROIDAL_SURFACE(${stepStr(this.name)},${this.position},${fmtNum(this.majorRadius)},${fmtNum(this.minorRadius)})`;
  }
};
register("TOROIDAL_SURFACE", ToroidalSurface.parse.bind(ToroidalSurface));
var Vector = class _Vector extends Entity {
  constructor(name, orientation, magnitude) {
    super();
    this.name = name;
    this.orientation = orientation;
    this.magnitude = magnitude;
  }
  type = "VECTOR";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const orientation = ctx.parseRef(a[1]);
    const magnitude = ctx.parseNumber(a[2]);
    return new _Vector(name, orientation, magnitude);
  }
  toStep() {
    return `VECTOR(${stepStr(this.name)},${this.orientation},${fmtNum(this.magnitude)})`;
  }
};
register("VECTOR", Vector.parse.bind(Vector));
var Ellipse = class _Ellipse extends Entity {
  constructor(name, placement, semiAxis1, semiAxis2) {
    super();
    this.name = name;
    this.placement = placement;
    this.semiAxis1 = semiAxis1;
    this.semiAxis2 = semiAxis2;
  }
  type = "ELLIPSE";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const placement = ctx.parseRef(a[1]);
    const semiAxis1 = ctx.parseNumber(a[2]);
    const semiAxis2 = ctx.parseNumber(a[3]);
    return new _Ellipse(name, placement, semiAxis1, semiAxis2);
  }
  toStep() {
    return `ELLIPSE(${stepStr(this.name)},${this.placement},${fmtNum(this.semiAxis1)},${fmtNum(this.semiAxis2)})`;
  }
};
register("ELLIPSE", Ellipse.parse.bind(Ellipse));
var ConicalSurface = class _ConicalSurface extends Entity {
  constructor(name, position, radius, semiAngle) {
    super();
    this.name = name;
    this.position = position;
    this.radius = radius;
    this.semiAngle = semiAngle;
  }
  type = "CONICAL_SURFACE";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const position = ctx.parseRef(a[1]);
    const radius = ctx.parseNumber(a[2]);
    const semiAngle = ctx.parseNumber(a[3]);
    return new _ConicalSurface(name, position, radius, semiAngle);
  }
  toStep() {
    return `CONICAL_SURFACE(${stepStr(this.name)},${this.position},${fmtNum(this.radius)},${fmtNum(this.semiAngle)})`;
  }
};
register("CONICAL_SURFACE", ConicalSurface.parse.bind(ConicalSurface));
var SphericalSurface = class _SphericalSurface extends Entity {
  constructor(name, position, radius) {
    super();
    this.name = name;
    this.position = position;
    this.radius = radius;
  }
  type = "SPHERICAL_SURFACE";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const position = ctx.parseRef(a[1]);
    const radius = ctx.parseNumber(a[2]);
    return new _SphericalSurface(name, position, radius);
  }
  toStep() {
    return `SPHERICAL_SURFACE(${stepStr(this.name)},${this.position},${fmtNum(this.radius)})`;
  }
};
register("SPHERICAL_SURFACE", SphericalSurface.parse.bind(SphericalSurface));
var BSplineCurveWithKnots = class _BSplineCurveWithKnots extends Entity {
  constructor(name, degree, controlPointsList, curveForm, closedCurve, selfIntersect, knotMultiplicities, knots, knotSpec) {
    super();
    this.name = name;
    this.degree = degree;
    this.controlPointsList = controlPointsList;
    this.curveForm = curveForm;
    this.closedCurve = closedCurve;
    this.selfIntersect = selfIntersect;
    this.knotMultiplicities = knotMultiplicities;
    this.knots = knots;
    this.knotSpec = knotSpec;
  }
  type = "B_SPLINE_CURVE_WITH_KNOTS";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const degree = ctx.parseNumber(a[1]);
    const controlPoints = a[2].replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((tok) => ctx.parseRef(tok.trim()));
    const curveForm = a[3].trim();
    const closedCurve = a[4].trim() === ".T.";
    const selfIntersect = a[5].trim() === ".T.";
    const knotMults = a[6].replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((tok) => ctx.parseNumber(tok.trim()));
    const knots = a[7].replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((tok) => ctx.parseNumber(tok.trim()));
    const knotSpec = a[8].trim();
    return new _BSplineCurveWithKnots(name, degree, controlPoints, curveForm, closedCurve, selfIntersect, knotMults, knots, knotSpec);
  }
  toStep() {
    const cps = `(${this.controlPointsList.join(",")})`;
    const kms = `(${this.knotMultiplicities.map(fmtNum).join(",")})`;
    const ks = `(${this.knots.map(fmtNum).join(",")})`;
    const closed = this.closedCurve ? ".T." : ".F.";
    const self = this.selfIntersect ? ".T." : ".F.";
    return `B_SPLINE_CURVE_WITH_KNOTS(${stepStr(this.name)},${this.degree},${cps},${this.curveForm},${closed},${self},${kms},${ks},${this.knotSpec})`;
  }
};
register("B_SPLINE_CURVE_WITH_KNOTS", BSplineCurveWithKnots.parse.bind(BSplineCurveWithKnots));
var ColourRgb = class _ColourRgb extends Entity {
  constructor(name, r, g, b) {
    super();
    this.name = name;
    this.r = r;
    this.g = g;
    this.b = b;
  }
  type = "COLOUR_RGB";
  static parse(a, ctx) {
    return new _ColourRgb(ctx.parseString(a[0]), ctx.parseNumber(a[1]), ctx.parseNumber(a[2]), ctx.parseNumber(a[3]));
  }
  toStep() {
    return `COLOUR_RGB(${stepStr(this.name)},${this.r},${this.g},${this.b})`;
  }
};
register("COLOUR_RGB", ColourRgb.parse.bind(ColourRgb));
var FillAreaStyle = class _FillAreaStyle extends Entity {
  constructor(name, items) {
    super();
    this.name = name;
    this.items = items;
  }
  type = "FILL_AREA_STYLE";
  static parse(a, ctx) {
    const items = a[1].replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((tok) => ctx.parseRef(tok));
    return new _FillAreaStyle(a[0] === "$" ? "" : ctx.parseString(a[0]), items);
  }
  toStep() {
    return `FILL_AREA_STYLE(${stepStr(this.name)},(${this.items.join(",")}))`;
  }
};
register("FILL_AREA_STYLE", FillAreaStyle.parse.bind(FillAreaStyle));
var FillAreaStyleColour = class _FillAreaStyleColour extends Entity {
  constructor(name, colour) {
    super();
    this.name = name;
    this.colour = colour;
  }
  type = "FILL_AREA_STYLE_COLOUR";
  static parse(a, ctx) {
    return new _FillAreaStyleColour(ctx.parseString(a[0]), ctx.parseRef(a[1]));
  }
  toStep() {
    return `FILL_AREA_STYLE_COLOUR(${stepStr(this.name)},${this.colour})`;
  }
};
register("FILL_AREA_STYLE_COLOUR", FillAreaStyleColour.parse.bind(FillAreaStyleColour));
var MechanicalDesignGeometricPresentationRepresentation = class _MechanicalDesignGeometricPresentationRepresentation extends Entity {
  constructor(name, items, contextOfItems) {
    super();
    this.name = name;
    this.items = items;
    this.contextOfItems = contextOfItems;
  }
  type = "MECHANICAL_DESIGN_GEOMETRIC_PRESENTATION_REPRESENTATION";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const items = a[1].replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((tok) => ctx.parseRef(tok));
    const contextOfItems = ctx.parseRef(a[2]);
    return new _MechanicalDesignGeometricPresentationRepresentation(name, items, contextOfItems);
  }
  toStep() {
    return `MECHANICAL_DESIGN_GEOMETRIC_PRESENTATION_REPRESENTATION(${stepStr(this.name)},(${this.items.join(",")}),${this.contextOfItems})`;
  }
};
register("MECHANICAL_DESIGN_GEOMETRIC_PRESENTATION_REPRESENTATION", MechanicalDesignGeometricPresentationRepresentation.parse.bind(MechanicalDesignGeometricPresentationRepresentation));
var PresentationStyleAssignment = class _PresentationStyleAssignment extends Entity {
  constructor(items) {
    super();
    this.items = items;
  }
  type = "PRESENTATION_STYLE_ASSIGNMENT";
  static parse(a, ctx) {
    const list = a[0].replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((tok) => ctx.parseRef(tok));
    return new _PresentationStyleAssignment(list);
  }
  toStep() {
    return `PRESENTATION_STYLE_ASSIGNMENT((${this.items.join(",")}))`;
  }
};
register("PRESENTATION_STYLE_ASSIGNMENT", PresentationStyleAssignment.parse.bind(PresentationStyleAssignment));
var StyledItem = class _StyledItem extends Entity {
  constructor(name, styles, item) {
    super();
    this.name = name;
    this.styles = styles;
    this.item = item;
  }
  type = "STYLED_ITEM";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const styles = a[1].replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((tok) => ctx.parseRef(tok));
    const item = ctx.parseRef(a[2]);
    return new _StyledItem(name, styles, item);
  }
  toStep() {
    return `STYLED_ITEM(${stepStr(this.name)},(${this.styles.join(",")}),${this.item})`;
  }
};
register("STYLED_ITEM", StyledItem.parse.bind(StyledItem));
var SurfaceSideStyle = class _SurfaceSideStyle extends Entity {
  constructor(name, styles) {
    super();
    this.name = name;
    this.styles = styles;
  }
  type = "SURFACE_SIDE_STYLE";
  static parse(a, ctx) {
    const list = a[1].replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((tok) => ctx.parseRef(tok));
    return new _SurfaceSideStyle(a[0] === "$" ? "" : ctx.parseString(a[0]), list);
  }
  toStep() {
    return `SURFACE_SIDE_STYLE(${stepStr(this.name)},(${this.styles.join(",")}))`;
  }
};
register("SURFACE_SIDE_STYLE", SurfaceSideStyle.parse.bind(SurfaceSideStyle));
var SurfaceStyleFillArea = class _SurfaceStyleFillArea extends Entity {
  constructor(style) {
    super();
    this.style = style;
  }
  type = "SURFACE_STYLE_FILL_AREA";
  static parse(a, ctx) {
    return new _SurfaceStyleFillArea(ctx.parseRef(a[0]));
  }
  toStep() {
    return `SURFACE_STYLE_FILL_AREA(${this.style})`;
  }
};
register("SURFACE_STYLE_FILL_AREA", SurfaceStyleFillArea.parse.bind(SurfaceStyleFillArea));
var SurfaceStyleUsage = class _SurfaceStyleUsage extends Entity {
  constructor(side, style) {
    super();
    this.side = side;
    this.style = style;
  }
  type = "SURFACE_STYLE_USAGE";
  static parse(a, ctx) {
    return new _SurfaceStyleUsage(a[0].trim(), ctx.parseRef(a[1]));
  }
  toStep() {
    return `SURFACE_STYLE_USAGE(${this.side},${this.style})`;
  }
};
register("SURFACE_STYLE_USAGE", SurfaceStyleUsage.parse.bind(SurfaceStyleUsage));
var AdvancedBrepShapeRepresentation = class _AdvancedBrepShapeRepresentation extends Entity {
  constructor(name, items, context) {
    super();
    this.name = name;
    this.items = items;
    this.context = context;
  }
  type = "ADVANCED_BREP_SHAPE_REPRESENTATION";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const items = a[1].replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((tok) => ctx.parseRef(tok));
    const c = ctx.parseRef(a[2]);
    return new _AdvancedBrepShapeRepresentation(name, items, c);
  }
  toStep() {
    return `ADVANCED_BREP_SHAPE_REPRESENTATION(${stepStr(this.name)},(${this.items.join(",")}),${this.context})`;
  }
};
register("ADVANCED_BREP_SHAPE_REPRESENTATION", AdvancedBrepShapeRepresentation.parse.bind(AdvancedBrepShapeRepresentation));
var ApplicationContext = class _ApplicationContext extends Entity {
  constructor(application) {
    super();
    this.application = application;
  }
  type = "APPLICATION_CONTEXT";
  static parse(a, ctx) {
    const application = ctx.parseString(a[0]);
    return new _ApplicationContext(application);
  }
  toStep() {
    return `APPLICATION_CONTEXT(${stepStr(this.application)})`;
  }
};
register("APPLICATION_CONTEXT", ApplicationContext.parse.bind(ApplicationContext));
var ApplicationProtocolDefinition = class _ApplicationProtocolDefinition extends Entity {
  constructor(status, applicationInterpretedModelSchemaName, applicationProtocolYear, application) {
    super();
    this.status = status;
    this.applicationInterpretedModelSchemaName = applicationInterpretedModelSchemaName;
    this.applicationProtocolYear = applicationProtocolYear;
    this.application = application;
  }
  type = "APPLICATION_PROTOCOL_DEFINITION";
  static parse(a, ctx) {
    const status = ctx.parseString(a[0]);
    const schemaName = ctx.parseString(a[1]);
    const year = ctx.parseNumber(a[2]);
    const application = ctx.parseRef(a[3]);
    return new _ApplicationProtocolDefinition(status, schemaName, year, application);
  }
  toStep() {
    return `APPLICATION_PROTOCOL_DEFINITION(${stepStr(this.status)},${stepStr(this.applicationInterpretedModelSchemaName)},${this.applicationProtocolYear},${this.application})`;
  }
};
register("APPLICATION_PROTOCOL_DEFINITION", ApplicationProtocolDefinition.parse.bind(ApplicationProtocolDefinition));
var ContextDependentShapeRepresentation = class _ContextDependentShapeRepresentation extends Entity {
  constructor(representationRelation, representedProductRelation) {
    super();
    this.representationRelation = representationRelation;
    this.representedProductRelation = representedProductRelation;
  }
  type = "CONTEXT_DEPENDENT_SHAPE_REPRESENTATION";
  static parse(a, ctx) {
    const representationRelation = ctx.parseRef(a[0]);
    const representedProductRelation = ctx.parseRef(a[1]);
    return new _ContextDependentShapeRepresentation(representationRelation, representedProductRelation);
  }
  toStep() {
    return `CONTEXT_DEPENDENT_SHAPE_REPRESENTATION(${this.representationRelation},${this.representedProductRelation})`;
  }
};
register("CONTEXT_DEPENDENT_SHAPE_REPRESENTATION", ContextDependentShapeRepresentation.parse.bind(ContextDependentShapeRepresentation));
var ItemDefinedTransformation = class _ItemDefinedTransformation extends Entity {
  constructor(name, description, transformItem1, transformItem2) {
    super();
    this.name = name;
    this.description = description;
    this.transformItem1 = transformItem1;
    this.transformItem2 = transformItem2;
  }
  type = "ITEM_DEFINED_TRANSFORMATION";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const description = a[1] === "$" ? "" : ctx.parseString(a[1]);
    const item1 = ctx.parseRef(a[2]);
    const item2 = ctx.parseRef(a[3]);
    return new _ItemDefinedTransformation(name, description, item1, item2);
  }
  toStep() {
    return `ITEM_DEFINED_TRANSFORMATION(${stepStr(this.name)},${stepStr(this.description)},${this.transformItem1},${this.transformItem2})`;
  }
};
register("ITEM_DEFINED_TRANSFORMATION", ItemDefinedTransformation.parse.bind(ItemDefinedTransformation));
var NextAssemblyUsageOccurrence = class _NextAssemblyUsageOccurrence extends Entity {
  constructor(id, name, description, relatingProductDefinition, relatedProductDefinition, referenceDesignator) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.relatingProductDefinition = relatingProductDefinition;
    this.relatedProductDefinition = relatedProductDefinition;
    this.referenceDesignator = referenceDesignator;
  }
  type = "NEXT_ASSEMBLY_USAGE_OCCURRENCE";
  static parse(a, ctx) {
    const id = ctx.parseString(a[0]);
    const name = ctx.parseString(a[1]);
    const description = a[2] === "$" ? "" : ctx.parseString(a[2]);
    const relating = ctx.parseRef(a[3]);
    const related = ctx.parseRef(a[4]);
    const designator = a[5] === "$" ? "" : ctx.parseString(a[5]);
    return new _NextAssemblyUsageOccurrence(id, name, description, relating, related, designator);
  }
  toStep() {
    return `NEXT_ASSEMBLY_USAGE_OCCURRENCE(${stepStr(this.id)},${stepStr(this.name)},${this.description ? stepStr(this.description) : "$"},${this.relatingProductDefinition},${this.relatedProductDefinition},${this.referenceDesignator ? stepStr(this.referenceDesignator) : "$"})`;
  }
};
register("NEXT_ASSEMBLY_USAGE_OCCURRENCE", NextAssemblyUsageOccurrence.parse.bind(NextAssemblyUsageOccurrence));
var Product = class _Product extends Entity {
  constructor(name, id, description, frameOfReference) {
    super();
    this.name = name;
    this.id = id;
    this.description = description;
    this.frameOfReference = frameOfReference;
  }
  type = "PRODUCT";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const id = a[1] === "$" ? "" : ctx.parseString(a[1]);
    const description = a[2] === "$" ? "" : ctx.parseString(a[2]);
    const refs = a[3].replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((tok) => ctx.parseRef(tok.trim()));
    return new _Product(name, id, description, refs);
  }
  toStep() {
    return `PRODUCT(${stepStr(this.name)},${stepStr(this.id)},${stepStr(this.description)},(${this.frameOfReference.join(",")}))`;
  }
};
register("PRODUCT", Product.parse.bind(Product));
var ProductContext = class _ProductContext extends Entity {
  constructor(name, frameOfReference, disciplineType) {
    super();
    this.name = name;
    this.frameOfReference = frameOfReference;
    this.disciplineType = disciplineType;
  }
  type = "PRODUCT_CONTEXT";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const frameOfReference = ctx.parseRef(a[1]);
    const disciplineType = ctx.parseString(a[2]);
    return new _ProductContext(name, frameOfReference, disciplineType);
  }
  toStep() {
    return `PRODUCT_CONTEXT(${stepStr(this.name)},${this.frameOfReference},${stepStr(this.disciplineType)})`;
  }
};
register("PRODUCT_CONTEXT", ProductContext.parse.bind(ProductContext));
var ProductDefinition = class _ProductDefinition extends Entity {
  constructor(id, description, formation, frameOfReference) {
    super();
    this.id = id;
    this.description = description;
    this.formation = formation;
    this.frameOfReference = frameOfReference;
  }
  type = "PRODUCT_DEFINITION";
  static parse(a, ctx) {
    const id = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const description = a[1] === "$" ? "" : ctx.parseString(a[1]);
    const formation = ctx.parseRef(a[2]);
    const frameOfReference = ctx.parseRef(a[3]);
    return new _ProductDefinition(id, description, formation, frameOfReference);
  }
  toStep() {
    return `PRODUCT_DEFINITION(${stepStr(this.id)},${stepStr(this.description)},${this.formation},${this.frameOfReference})`;
  }
};
register("PRODUCT_DEFINITION", ProductDefinition.parse.bind(ProductDefinition));
var ProductDefinitionContext = class _ProductDefinitionContext extends Entity {
  constructor(name, frameOfReference, lifecycleStage) {
    super();
    this.name = name;
    this.frameOfReference = frameOfReference;
    this.lifecycleStage = lifecycleStage;
  }
  type = "PRODUCT_DEFINITION_CONTEXT";
  static parse(a, ctx) {
    const name = ctx.parseString(a[0]);
    const frameOfReference = ctx.parseRef(a[1]);
    const lifecycleStage = ctx.parseString(a[2]);
    return new _ProductDefinitionContext(name, frameOfReference, lifecycleStage);
  }
  toStep() {
    return `PRODUCT_DEFINITION_CONTEXT(${stepStr(this.name)},${this.frameOfReference},${stepStr(this.lifecycleStage)})`;
  }
};
register("PRODUCT_DEFINITION_CONTEXT", ProductDefinitionContext.parse.bind(ProductDefinitionContext));
var ProductDefinitionFormation = class _ProductDefinitionFormation extends Entity {
  constructor(id, description, ofProduct) {
    super();
    this.id = id;
    this.description = description;
    this.ofProduct = ofProduct;
  }
  type = "PRODUCT_DEFINITION_FORMATION";
  static parse(a, ctx) {
    const id = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const description = a[1] === "$" ? "" : ctx.parseString(a[1]);
    const ofProduct = ctx.parseRef(a[2]);
    return new _ProductDefinitionFormation(id, description, ofProduct);
  }
  toStep() {
    return `PRODUCT_DEFINITION_FORMATION(${stepStr(this.id)},${stepStr(this.description)},${this.ofProduct})`;
  }
};
register("PRODUCT_DEFINITION_FORMATION", ProductDefinitionFormation.parse.bind(ProductDefinitionFormation));
var ProductDefinitionShape = class _ProductDefinitionShape extends Entity {
  constructor(name, description, definition) {
    super();
    this.name = name;
    this.description = description;
    this.definition = definition;
  }
  type = "PRODUCT_DEFINITION_SHAPE";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const description = a[1] === "$" ? "" : ctx.parseString(a[1]);
    const definition = ctx.parseRef(a[2]);
    return new _ProductDefinitionShape(name, description, definition);
  }
  toStep() {
    return `PRODUCT_DEFINITION_SHAPE(${stepStr(this.name)},${stepStr(this.description)},${this.definition})`;
  }
};
register("PRODUCT_DEFINITION_SHAPE", ProductDefinitionShape.parse.bind(ProductDefinitionShape));
var ProductRelatedProductCategory = class _ProductRelatedProductCategory extends Entity {
  constructor(name, description, products) {
    super();
    this.name = name;
    this.description = description;
    this.products = products;
  }
  type = "PRODUCT_RELATED_PRODUCT_CATEGORY";
  static parse(a, ctx) {
    const name = ctx.parseString(a[0]);
    const description = a[1] === "$" ? "" : ctx.parseString(a[1]);
    const products = a[2].replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((tok) => ctx.parseRef(tok));
    return new _ProductRelatedProductCategory(name, description, products);
  }
  toStep() {
    return `PRODUCT_RELATED_PRODUCT_CATEGORY(${stepStr(this.name)},${this.description ? stepStr(this.description) : "$"},(${this.products.join(",")}))`;
  }
};
register("PRODUCT_RELATED_PRODUCT_CATEGORY", ProductRelatedProductCategory.parse.bind(ProductRelatedProductCategory));
var ShapeDefinitionRepresentation = class _ShapeDefinitionRepresentation extends Entity {
  constructor(definition, usedRepresentation) {
    super();
    this.definition = definition;
    this.usedRepresentation = usedRepresentation;
  }
  type = "SHAPE_DEFINITION_REPRESENTATION";
  static parse(a, ctx) {
    const definition = ctx.parseRef(a[0]);
    const usedRepresentation = ctx.parseRef(a[1]);
    return new _ShapeDefinitionRepresentation(definition, usedRepresentation);
  }
  toStep() {
    return `SHAPE_DEFINITION_REPRESENTATION(${this.definition},${this.usedRepresentation})`;
  }
};
register("SHAPE_DEFINITION_REPRESENTATION", ShapeDefinitionRepresentation.parse.bind(ShapeDefinitionRepresentation));
var ShapeRepresentation = class _ShapeRepresentation extends Entity {
  constructor(name, items, contextOfItems) {
    super();
    this.name = name;
    this.items = items;
    this.contextOfItems = contextOfItems;
  }
  type = "SHAPE_REPRESENTATION";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const items = a[1].replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((tok) => ctx.parseRef(tok));
    const contextOfItems = ctx.parseRef(a[2]);
    return new _ShapeRepresentation(name, items, contextOfItems);
  }
  toStep() {
    return `SHAPE_REPRESENTATION(${stepStr(this.name)},(${this.items.join(",")}),${this.contextOfItems})`;
  }
};
register("SHAPE_REPRESENTATION", ShapeRepresentation.parse.bind(ShapeRepresentation));
var AdvancedFace = class _AdvancedFace extends Entity {
  constructor(name, bounds, surface, sameSense) {
    super();
    this.name = name;
    this.bounds = bounds;
    this.surface = surface;
    this.sameSense = sameSense;
  }
  type = "ADVANCED_FACE";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const bounds = a[1].replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((tok) => ctx.parseRef(tok.trim()));
    const surf = ctx.parseRef(a[2]);
    const ss = a[3].trim() === ".T.";
    return new _AdvancedFace(name, bounds, surf, ss);
  }
  toStep() {
    return `ADVANCED_FACE(${this.name ? `'${this.name}'` : "''"},(${this.bounds.join(",")}),${this.surface},${this.sameSense ? ".T." : ".F."})`;
  }
};
register("ADVANCED_FACE", AdvancedFace.parse.bind(AdvancedFace));
var ClosedShell = class _ClosedShell extends Entity {
  constructor(name, faces) {
    super();
    this.name = name;
    this.faces = faces;
  }
  type = "CLOSED_SHELL";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const faces = a[1].replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((tok) => ctx.parseRef(tok.trim()));
    return new _ClosedShell(name, faces);
  }
  toStep() {
    return `CLOSED_SHELL(${this.name ? `'${this.name}'` : "''"},(${this.faces.join(",")}))`;
  }
};
register("CLOSED_SHELL", ClosedShell.parse.bind(ClosedShell));
var EdgeCurve = class _EdgeCurve extends Entity {
  constructor(name, start, end, curve, sameSense) {
    super();
    this.name = name;
    this.start = start;
    this.end = end;
    this.curve = curve;
    this.sameSense = sameSense;
  }
  type = "EDGE_CURVE";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const s = ctx.parseRef(a[1]);
    const e = ctx.parseRef(a[2]);
    const c = ctx.parseRef(a[3]);
    const same = a[4].trim() === ".T.";
    return new _EdgeCurve(name, s, e, c, same);
  }
  toStep() {
    return `EDGE_CURVE(${this.name ? `'${this.name}'` : "''"},${this.start},${this.end},${this.curve},${this.sameSense ? ".T." : ".F."})`;
  }
};
register("EDGE_CURVE", EdgeCurve.parse.bind(EdgeCurve));
var EdgeLoop = class _EdgeLoop extends Entity {
  constructor(name, edges) {
    super();
    this.name = name;
    this.edges = edges;
  }
  type = "EDGE_LOOP";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const list = a[1].replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((tok) => ctx.parseRef(tok));
    return new _EdgeLoop(name, list);
  }
  toStep() {
    return `EDGE_LOOP(${stepStr(this.name)},(${this.edges.join(",")}))`;
  }
};
register("EDGE_LOOP", EdgeLoop.parse.bind(EdgeLoop));
var FaceBound = class _FaceBound extends Entity {
  constructor(name, bound, sameSense) {
    super();
    this.name = name;
    this.bound = bound;
    this.sameSense = sameSense;
  }
  type = "FACE_BOUND";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    return new _FaceBound(name, ctx.parseRef(a[1]), a[2].trim() === ".T.");
  }
  toStep() {
    return `FACE_BOUND(${stepStr(this.name)},${this.bound},${this.sameSense ? ".T." : ".F."})`;
  }
};
register("FACE_BOUND", FaceBound.parse.bind(FaceBound));
var FaceOuterBound = class _FaceOuterBound extends Entity {
  constructor(name, bound, sameSense) {
    super();
    this.name = name;
    this.bound = bound;
    this.sameSense = sameSense;
  }
  type = "FACE_OUTER_BOUND";
  static parse(a, ctx) {
    return new _FaceOuterBound(ctx.parseString(a[0]), ctx.parseRef(a[1]), a[2].trim() === ".T.");
  }
  toStep() {
    return `FACE_OUTER_BOUND('${this.name}',${this.bound},${this.sameSense ? ".T." : ".F."})`;
  }
};
register("FACE_OUTER_BOUND", FaceOuterBound.parse.bind(FaceOuterBound));
var ManifoldSolidBrep = class _ManifoldSolidBrep extends Entity {
  constructor(name, outer) {
    super();
    this.name = name;
    this.outer = outer;
  }
  type = "MANIFOLD_SOLID_BREP";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    return new _ManifoldSolidBrep(name, ctx.parseRef(a[1]));
  }
  toStep() {
    return `MANIFOLD_SOLID_BREP(${stepStr(this.name)},${this.outer})`;
  }
};
register("MANIFOLD_SOLID_BREP", ManifoldSolidBrep.parse.bind(ManifoldSolidBrep));
var OrientedEdge = class _OrientedEdge extends Entity {
  constructor(name, edge, orientation) {
    super();
    this.name = name;
    this.edge = edge;
    this.orientation = orientation;
  }
  type = "ORIENTED_EDGE";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    const edge = ctx.parseRef(a[3]);
    const orient = a[4]?.trim?.() === ".T." || a[2]?.trim?.() === ".T.";
    return new _OrientedEdge(name, edge, orient);
  }
  toStep() {
    return `ORIENTED_EDGE(${stepStr(this.name)},*,*,${this.edge},${this.orientation ? ".T." : ".F."})`;
  }
};
register("ORIENTED_EDGE", OrientedEdge.parse.bind(OrientedEdge));
var VertexPoint = class _VertexPoint extends Entity {
  constructor(name, pnt) {
    super();
    this.name = name;
    this.pnt = pnt;
  }
  type = "VERTEX_POINT";
  static parse(a, ctx) {
    const name = a[0] === "$" ? "" : ctx.parseString(a[0]);
    return new _VertexPoint(name, ctx.parseRef(a[1]));
  }
  toStep() {
    return `VERTEX_POINT(${this.name ? `'${this.name}'` : "''"},${this.pnt})`;
  }
};
register("VERTEX_POINT", VertexPoint.parse.bind(VertexPoint));
var Unknown = class extends Entity {
  constructor(type, args) {
    super();
    this.type = type;
    this.args = args;
  }
  toStep() {
    if (this.args.length === 1 && this.args[0].startsWith("( ")) {
      const content = this.args[0].slice(2, -2).trim();
      const parts = content.split(/\s+(?=[A-Z_])/g);
      return `(
${parts.join(`
`)}
)`;
    }
    return `${this.type}(${this.args.join(",")})`;
  }
};
function tokenizeSTEP(data) {
  const entities = [];
  const dataStart = data.indexOf("DATA;");
  const dataEnd = data.indexOf("ENDSEC;", dataStart);
  if (dataStart === -1 || dataEnd === -1) {
    throw new Error("Could not find DATA section in STEP file");
  }
  const dataSection = data.substring(dataStart + 5, dataEnd);
  const entityPattern = /#(\d+)\s*=\s*/g;
  let match;
  const entityStarts = [];
  while ((match = entityPattern.exec(dataSection)) !== null) {
    entityStarts.push({
      index: match.index,
      id: parseInt(match[1], 10)
    });
  }
  for (let i = 0;i < entityStarts.length; i++) {
    const start = entityStarts[i];
    const nextStart = i + 1 < entityStarts.length ? entityStarts[i + 1].index : dataSection.length;
    const entityText = dataSection.substring(start.index, nextStart);
    const semiIndex = entityText.indexOf(";");
    if (semiIndex === -1) {
      throw new Error(`Could not find closing semicolon for entity #${start.id}`);
    }
    const fullEntity = entityText.substring(0, semiIndex + 1);
    if (fullEntity.match(/#\d+\s*=\s*\(/)) {
      const complexMatch = fullEntity.match(/#\d+\s*=\s*\(([\s\S]*)\);/);
      if (!complexMatch) {
        throw new Error(`Could not parse complex entity: ${fullEntity.substring(0, 100)}`);
      }
      entities.push({
        id: eid(start.id),
        type: "Unknown",
        args: [`( ${complexMatch[1].trim()} )`]
      });
    } else {
      const match2 = fullEntity.match(/#\d+\s*=\s*([A-Z0-9_]+)\s*\(([\s\S]*)\);/);
      if (!match2) {
        throw new Error(`Could not parse entity: ${fullEntity.substring(0, 100)}`);
      }
      const type = match2[1].trim();
      const argsBody = match2[2].trim();
      const args = splitArgs(argsBody);
      entities.push({ id: eid(start.id), type, args });
    }
  }
  return entities;
}
function splitArgs(s) {
  const out = [];
  let buf = "";
  let depth = 0;
  let inStr = false;
  for (let i = 0;i < s.length; i++) {
    const c = s[i];
    if (c === "'" && s[i - 1] !== "\\")
      inStr = !inStr;
    if (!inStr) {
      if (c === "(")
        depth++;
      if (c === ")")
        depth--;
      if (c === "," && depth === 0) {
        out.push(buf.trim());
        buf = "";
        continue;
      }
    }
    buf += c;
  }
  if (buf.trim())
    out.push(buf.trim());
  return out;
}
function parseRepository(data) {
  const repo = new Repository;
  const ctx = {
    repo,
    parseRef(_tok) {
      const n = +_tok.replace("#", "").trim();
      return new Ref(eid(n));
    },
    parseNumber(tok) {
      return Number(tok);
    },
    parseString(tok) {
      const m = tok.match(/^'(.*)'$/);
      if (!m)
        throw new Error(`Expected string: ${tok}`);
      return m[1].replace(/''/g, "'");
    }
  };
  for (const row of tokenizeSTEP(data)) {
    const parser = getParser(row.type);
    if (!parser) {
      repo.set(row.id, new Unknown(row.type, row.args));
      continue;
    }
    const entity = parser(row.args, ctx);
    repo.set(row.id, entity);
  }
  return repo;
}

// node_modules/circuit-json-to-step/dist/index.js
var getCircuitJsonToGltfModule = async () => {
  try {
    return await import("circuit-json-to-gltf");
  } catch (error) {
    const dynamicGlobal = globalThis.tscircuitDynamicModules?.["circuit-json-to-gltf"];
    if (dynamicGlobal)
      return dynamicGlobal;
    throw new Error('Unable to load "circuit-json-to-gltf" from import() or globalThis.tscircuitDynamicModules.', { cause: error });
  }
};
function createStyleCache() {
  return /* @__PURE__ */ new Map;
}
function createStyledItem(repo, options) {
  const { itemRef, rgb, styleCache, name = "color" } = options;
  const key = rgb.map((value) => value.toFixed(6)).join(",");
  let presStyle = styleCache.get(key);
  if (!presStyle) {
    const color = repo.add(new ColourRgb("", rgb[0], rgb[1], rgb[2]));
    const fillColor = repo.add(new FillAreaStyleColour("", color));
    const fillStyle = repo.add(new FillAreaStyle("", [fillColor]));
    const surfaceFill = repo.add(new SurfaceStyleFillArea(fillStyle));
    const surfaceSide = repo.add(new SurfaceSideStyle("", [surfaceFill]));
    const surfaceUsage = repo.add(new SurfaceStyleUsage(".BOTH.", surfaceSide));
    presStyle = repo.add(new PresentationStyleAssignment([surfaceUsage]));
    styleCache.set(key, presStyle);
  }
  return repo.add(new StyledItem(name, [presStyle], itemRef));
}
function createStyledItems(repo, options) {
  const { itemRefs, rgb, styleCache, name } = options;
  return itemRefs.map((itemRef) => createStyledItem(repo, { itemRef, rgb, styleCache, name }));
}
function rotatePoint3(point, rotation) {
  if (!rotation)
    return point;
  let { x, y, z } = point;
  if (rotation.x) {
    const cos = Math.cos(rotation.x);
    const sin = Math.sin(rotation.x);
    const nextY = y * cos - z * sin;
    const nextZ = y * sin + z * cos;
    y = nextY;
    z = nextZ;
  }
  if (rotation.y) {
    const cos = Math.cos(rotation.y);
    const sin = Math.sin(rotation.y);
    const nextX = x * cos + z * sin;
    const nextZ = -x * sin + z * cos;
    x = nextX;
    z = nextZ;
  }
  if (rotation.z) {
    const cos = Math.cos(rotation.z);
    const sin = Math.sin(rotation.z);
    const nextX = x * cos - y * sin;
    const nextY = x * sin + y * cos;
    x = nextX;
    y = nextY;
  }
  return { x, y, z };
}
function createVertex(repo, point) {
  return repo.add(new VertexPoint("", repo.add(new CartesianPoint("", point.x, point.y, point.z))));
}
function createEdge(repo, vStart, vEnd) {
  const pStart = vStart.resolve(repo).pnt.resolve(repo);
  const pEnd = vEnd.resolve(repo).pnt.resolve(repo);
  const dx = pEnd.x - pStart.x;
  const dy = pEnd.y - pStart.y;
  const dz = pEnd.z - pStart.z;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (length < 0.0000000001) {
    const dir2 = repo.add(new Direction("", 1, 0, 0));
    const vec2 = repo.add(new Vector("", dir2, 0.0000000001));
    const line2 = repo.add(new Line("", vStart.resolve(repo).pnt, vec2));
    return repo.add(new EdgeCurve("", vStart, vEnd, line2, true));
  }
  const dir = repo.add(new Direction("", dx / length, dy / length, dz / length));
  const vec = repo.add(new Vector("", dir, length));
  const line = repo.add(new Line("", vStart.resolve(repo).pnt, vec));
  return repo.add(new EdgeCurve("", vStart, vEnd, line, true));
}
function createFaceFromVertices(repo, vertices) {
  const edges = vertices.map((vertex, index) => createEdge(repo, vertex, vertices[(index + 1) % vertices.length]));
  const edgeLoop = repo.add(new EdgeLoop("", edges.map((edge) => repo.add(new OrientedEdge("", edge, true)))));
  const p1 = vertices[0].resolve(repo).pnt.resolve(repo);
  const p2 = vertices[1].resolve(repo).pnt.resolve(repo);
  const p3 = vertices[2].resolve(repo).pnt.resolve(repo);
  const ux = p2.x - p1.x;
  const uy = p2.y - p1.y;
  const uz = p2.z - p1.z;
  const vx = p3.x - p1.x;
  const vy = p3.y - p1.y;
  const vz = p3.z - p1.z;
  const nx = uy * vz - uz * vy;
  const ny = uz * vx - ux * vz;
  const nz = ux * vy - uy * vx;
  const normalLength = Math.sqrt(nx * nx + ny * ny + nz * nz);
  const normal = normalLength < 0.0000000001 ? repo.add(new Direction("", 0, 0, 1)) : repo.add(new Direction("", nx / normalLength, ny / normalLength, nz / normalLength));
  const refLength = Math.sqrt(ux * ux + uy * uy + uz * uz);
  const refDir = refLength < 0.0000000001 ? repo.add(new Direction("", 1, 0, 0)) : repo.add(new Direction("", ux / refLength, uy / refLength, uz / refLength));
  const placement = repo.add(new Axis2Placement3D("", vertices[0].resolve(repo).pnt, normal, refDir));
  const plane = repo.add(new Plane("", placement));
  return repo.add(new AdvancedFace("", [repo.add(new FaceOuterBound("", edgeLoop, true))], plane, true));
}
function createSceneBoxSolid(repo, box) {
  if (box.mesh?.triangles?.length) {
    return createSceneMeshSolid(repo, box);
  }
  const localBounds = box.mesh?.boundingBox ? {
    min: box.mesh.boundingBox.min,
    max: box.mesh.boundingBox.max
  } : {
    min: {
      x: -box.size.x / 2,
      y: -box.size.y / 2,
      z: -box.size.z / 2
    },
    max: {
      x: box.size.x / 2,
      y: box.size.y / 2,
      z: box.size.z / 2
    }
  };
  const corners = [
    { x: localBounds.min.x, y: localBounds.min.y, z: localBounds.min.z },
    { x: localBounds.max.x, y: localBounds.min.y, z: localBounds.min.z },
    { x: localBounds.max.x, y: localBounds.max.y, z: localBounds.min.z },
    { x: localBounds.min.x, y: localBounds.max.y, z: localBounds.min.z },
    { x: localBounds.min.x, y: localBounds.min.y, z: localBounds.max.z },
    { x: localBounds.max.x, y: localBounds.min.y, z: localBounds.max.z },
    { x: localBounds.max.x, y: localBounds.max.y, z: localBounds.max.z },
    { x: localBounds.min.x, y: localBounds.max.y, z: localBounds.max.z }
  ].map((corner) => {
    const rotated = rotatePoint3(corner, box.rotation);
    return {
      x: rotated.x + box.center.x,
      y: rotated.y + box.center.y,
      z: rotated.z + box.center.z
    };
  });
  const stepCorners = corners.map((corner) => ({
    x: corner.x,
    y: corner.z,
    z: corner.y
  }));
  const vertices = stepCorners.map((corner) => createVertex(repo, corner));
  const faces = [
    [vertices[0], vertices[1], vertices[2], vertices[3]],
    [vertices[4], vertices[7], vertices[6], vertices[5]],
    [vertices[0], vertices[4], vertices[5], vertices[1]],
    [vertices[1], vertices[5], vertices[6], vertices[2]],
    [vertices[2], vertices[6], vertices[7], vertices[3]],
    [vertices[3], vertices[7], vertices[4], vertices[0]]
  ].map((faceVertices) => createFaceFromVertices(repo, faceVertices));
  const shell = repo.add(new ClosedShell("", faces));
  return {
    solid: repo.add(new ManifoldSolidBrep(box.label ?? "Component", shell)),
    styledItems: [],
    usesIntrinsicFaceStyles: false,
    styleTargets: faces
  };
}
function createSceneMeshSolid(repo, box) {
  const styleCache = createStyleCache();
  const styledItems = [];
  const faces = box.mesh.triangles.map((triangle) => {
    const vertices = triangle.vertices.map((vertex) => {
      const rotated = rotatePoint3(vertex, box.rotation);
      const translated = {
        x: rotated.x + box.center.x,
        y: rotated.z + box.center.z,
        z: rotated.y + box.center.y
      };
      return createVertex(repo, translated);
    });
    const face = createFaceFromVertices(repo, vertices);
    const faceColor = normalizeTriangleColor(triangle.color);
    if (faceColor) {
      styledItems.push(createStyledItem(repo, {
        itemRef: face,
        rgb: faceColor,
        styleCache
      }));
    }
    return face;
  });
  const shell = repo.add(new ClosedShell("", faces));
  return {
    solid: repo.add(new ManifoldSolidBrep(box.label ?? "Component", shell)),
    styledItems,
    usesIntrinsicFaceStyles: faces.length > 0 && styledItems.length === faces.length,
    styleTargets: []
  };
}
function normalizeTriangleColor(color) {
  if (!Array.isArray(color) || color.length < 3)
    return null;
  const scale = color.some((value) => value > 1) ? 255 : 1;
  return [
    clampColorChannel(color[0] / scale),
    clampColorChannel(color[1] / scale),
    clampColorChannel(color[2] / scale)
  ];
}
function clampColorChannel(value) {
  return Math.max(0, Math.min(1, value));
}
async function generateComponentMeshes(options) {
  const {
    repo,
    circuitJson,
    boardThickness,
    includeExternalMeshes = false,
    excludeCadComponentIds,
    excludePcbComponentIds,
    pcbComponentIdsWithStepUrl
  } = options;
  const solids = [];
  try {
    const filteredCircuitJson = circuitJson.filter((element) => {
      if (element.type === "pcb_board")
        return false;
      if (element.type === "cad_component" && element.cad_component_id && excludeCadComponentIds?.has(element.cad_component_id)) {
        return false;
      }
      if (element.type === "pcb_component" && element.pcb_component_id && excludePcbComponentIds?.has(element.pcb_component_id)) {
        return false;
      }
      if (element.type === "cad_component" && element.model_step_url) {
        return false;
      }
      if (element.type === "cad_component" && element.pcb_component_id && pcbComponentIdsWithStepUrl?.has(element.pcb_component_id)) {
        return false;
      }
      return true;
    }).map((element) => {
      if (!includeExternalMeshes && element.type === "cad_component") {
        return {
          ...element,
          model_3mf_url: undefined,
          model_obj_url: undefined,
          model_stl_url: undefined,
          model_glb_url: undefined,
          model_gltf_url: undefined
        };
      }
      return element;
    });
    const { convertCircuitJsonTo3D } = await getCircuitJsonToGltfModule();
    const scene3d = await convertCircuitJsonTo3D(filteredCircuitJson, {
      boardThickness,
      renderBoardTextures: false
    });
    for (const box of scene3d.boxes) {
      solids.push(createSceneBoxSolid(repo, box));
    }
  } catch (error) {
    console.warn("Failed to generate component mesh:", error);
  }
  return solids;
}
var EXCLUDED_ENTITY_TYPES = /* @__PURE__ */ new Set([
  "APPLICATION_CONTEXT",
  "APPLICATION_PROTOCOL_DEFINITION",
  "PRODUCT",
  "PRODUCT_CONTEXT",
  "PRODUCT_DEFINITION",
  "PRODUCT_DEFINITION_FORMATION",
  "PRODUCT_DEFINITION_CONTEXT",
  "PRODUCT_DEFINITION_SHAPE",
  "SHAPE_DEFINITION_REPRESENTATION",
  "ADVANCED_BREP_SHAPE_REPRESENTATION",
  "PRODUCT_RELATED_PRODUCT_CATEGORY",
  "NEXT_ASSEMBLY_USAGE_OCCURRENCE",
  "CONTEXT_DEPENDENT_SHAPE_REPRESENTATION",
  "ITEM_DEFINED_TRANSFORMATION"
]);
function asVector3(value) {
  return {
    x: value?.x ?? 0,
    y: value?.y ?? 0,
    z: value?.z ?? 0
  };
}
function toRadians(rotation) {
  const factor = Math.PI / 180;
  return {
    x: rotation.x * factor,
    y: rotation.y * factor,
    z: rotation.z * factor
  };
}
function transformDirection(vector, rotation) {
  return rotateVector(vector, rotation);
}
function rotateVector(vector, rotation) {
  let [x, y, z] = vector;
  if (rotation.x !== 0) {
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;
    y = y1;
    z = z1;
  }
  if (rotation.y !== 0) {
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    x = x1;
    z = z1;
  }
  if (rotation.z !== 0) {
    const cosZ = Math.cos(rotation.z);
    const sinZ = Math.sin(rotation.z);
    const x1 = x * cosZ - y * sinZ;
    const y1 = x * sinZ + y * cosZ;
    x = x1;
    y = y1;
  }
  return [x, y, z];
}
async function readStepFile(modelUrl) {
  if (!/^https?:\/\//i.test(modelUrl)) {
    throw new Error(`Only HTTP(S) URLs are supported. For local files, read the file content and pass it directly. Received: ${modelUrl}`);
  }
  const globalFetch = globalThis.fetch;
  if (!globalFetch) {
    throw new Error("fetch is not available in this environment");
  }
  const res = await globalFetch(modelUrl);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  return await res.text();
}
async function mergeExternalStepModels(options) {
  const { repo, circuitJson, boardThickness, fsMap } = options;
  const cadComponents = circuitJson.filter((item) => item?.type === "cad_component" && typeof item.model_step_url === "string");
  const pcbComponentMap = /* @__PURE__ */ new Map;
  for (const item of circuitJson) {
    if (item?.type === "pcb_component" && item.pcb_component_id) {
      pcbComponentMap.set(item.pcb_component_id, item);
    }
  }
  const solids = [];
  const handledComponentIds = /* @__PURE__ */ new Set;
  const handledPcbComponentIds = /* @__PURE__ */ new Set;
  const importedModels = /* @__PURE__ */ new Map;
  for (const component of cadComponents) {
    const componentId = component.cad_component_id ?? "";
    const stepUrl = component.model_step_url;
    try {
      let importedModel = importedModels.get(stepUrl);
      if (!importedModel) {
        const stepText = fsMap?.[stepUrl] ?? await readStepFile(stepUrl);
        if (!stepText.trim()) {
          throw new Error("STEP file is empty");
        }
        importedModel = importStepModelOnce(repo, stepText, stepUrl);
        importedModels.set(stepUrl, importedModel);
      }
      const pcbComponent = component.pcb_component_id ? pcbComponentMap.get(component.pcb_component_id) : undefined;
      const layer = pcbComponent?.layer?.toLowerCase();
      const transform = {
        translation: asVector3(component.position),
        rotation: asVector3(component.rotation)
      };
      const componentSolids = createMappedStepModelInstance({
        repo,
        importedModel,
        transform,
        placement: {
          layer,
          boardThickness
        }
      });
      if (componentSolids.length > 0) {
        if (componentId) {
          handledComponentIds.add(componentId);
        }
        const pcbComponentId = component.pcb_component_id;
        if (pcbComponentId) {
          handledPcbComponentIds.add(pcbComponentId);
        }
      }
      solids.push(...componentSolids);
    } catch (error) {
      console.warn(`Failed to merge STEP model from ${stepUrl}:`, error);
    }
  }
  return { solids, handledComponentIds, handledPcbComponentIds };
}
var RepresentationMap = class extends Entity {
  constructor(mappingOrigin, mappedRepresentation) {
    super();
    this.mappingOrigin = mappingOrigin;
    this.mappedRepresentation = mappedRepresentation;
  }
  mappingOrigin;
  mappedRepresentation;
  type = "REPRESENTATION_MAP";
  toStep() {
    return `REPRESENTATION_MAP(${this.mappingOrigin},${this.mappedRepresentation})`;
  }
};
var MappedItem = class extends Entity {
  constructor(name, mappingSource, mappingTarget) {
    super();
    this.name = name;
    this.mappingSource = mappingSource;
    this.mappingTarget = mappingTarget;
  }
  name;
  mappingSource;
  mappingTarget;
  type = "MAPPED_ITEM";
  toStep() {
    return `MAPPED_ITEM(${stepStr(this.name)},${this.mappingSource},${this.mappingTarget})`;
  }
};
function importStepModelOnce(targetRepo, stepText, modelName) {
  const sourceRepo = parseRepository(stepText);
  let entries = sourceRepo.entries().map(([id, entity]) => [Number(id), entity]).filter(([, entity]) => !EXCLUDED_ENTITY_TYPES.has(entity.type));
  entries = pruneInvalidEntries(entries);
  const idMapping = allocateIds(targetRepo, entries);
  remapReferences(entries, idMapping);
  for (const [oldId, entity] of entries) {
    const mappedId = idMapping.get(oldId);
    if (mappedId === undefined)
      continue;
    targetRepo.set(eid(mappedId), entity);
  }
  const solids = [];
  for (const [oldId, entity] of entries) {
    if (entity instanceof ManifoldSolidBrep) {
      const mappedId = idMapping.get(oldId);
      if (mappedId !== undefined) {
        solids.push(new Ref(eid(mappedId)));
      }
    }
  }
  const originPoint = targetRepo.add(new CartesianPoint("", 0, 0, 0));
  const zDirection = targetRepo.add(new Direction("", 0, 0, 1));
  const xDirection = targetRepo.add(new Direction("", 1, 0, 0));
  const mappingOrigin = targetRepo.add(new Axis2Placement3D("", originPoint, zDirection, xDirection));
  const representation = targetRepo.add(new AdvancedBrepShapeRepresentation(modelName, solids, getGeomContext(targetRepo)));
  const representationMap = targetRepo.add(new RepresentationMap(mappingOrigin, representation));
  return { entries, representationMap };
}
function createMappedStepModelInstance({
  repo,
  importedModel,
  transform,
  placement
}) {
  adjustTransformForPlacement(importedModel.entries, transform, placement);
  const placementTarget = createPlacementTarget(repo, transform);
  const mappedItem = repo.add(new MappedItem("", importedModel.representationMap, placementTarget));
  return [mappedItem];
}
function createPlacementTarget(repo, transform) {
  const rotation = toRadians(transform.rotation);
  const [refX, refY, refZ] = transformDirection([1, 0, 0], rotation);
  const [axisX, axisY, axisZ] = transformDirection([0, 0, 1], rotation);
  const axis = repo.add(new Direction("", axisX, axisY, axisZ));
  const refDirection = repo.add(new Direction("", refX, refY, refZ));
  const origin = repo.add(new CartesianPoint("", transform.translation.x, transform.translation.y, transform.translation.z));
  return repo.add(new Axis2Placement3D("", origin, axis, refDirection));
}
function getGeomContext(repo) {
  for (const [id, entity] of repo.entries()) {
    if (entity.type === "GEOMETRIC_REPRESENTATION_CONTEXT") {
      return new Ref(id);
    }
    if (entity instanceof Unknown && entity.args.some((arg) => arg.includes("GEOMETRIC_REPRESENTATION_CONTEXT"))) {
      return new Ref(id);
    }
  }
  throw new Error("GEOMETRIC_REPRESENTATION_CONTEXT is missing");
}
function adjustTransformForPlacement(entries, transform, placement) {
  if (!placement)
    return;
  const points = [];
  for (const [, entity] of entries) {
    if (entity instanceof CartesianPoint) {
      points.push([entity.x, entity.y, entity.z]);
    }
  }
  if (!points.length)
    return;
  const rotationRadians = toRadians(transform.rotation);
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  for (const point of points) {
    const [x, y, z] = rotateVector(point, rotationRadians);
    if (x < minX)
      minX = x;
    if (y < minY)
      minY = y;
    if (z < minZ)
      minZ = z;
    if (x > maxX)
      maxX = x;
    if (y > maxY)
      maxY = y;
    if (z > maxZ)
      maxZ = z;
  }
  if (!Number.isFinite(minX))
    return;
  const center = {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
    z: (minZ + maxZ) / 2
  };
  const normalizedLayer = placement.layer?.toLowerCase() === "bottom" ? "bottom" : "top";
  const boardThickness = placement.boardThickness ?? 0;
  const targetX = transform.translation.x;
  const targetY = transform.translation.y;
  const targetZ = transform.translation.z;
  const THROUGH_HOLE_Z_TOLERANCE = 0.001;
  const isThroughHoleComponent = minZ < -THROUGH_HOLE_Z_TOLERANCE && maxZ > THROUGH_HOLE_Z_TOLERANCE;
  transform.translation.x = targetX - center.x;
  transform.translation.y = targetY - center.y;
  if (isThroughHoleComponent) {
    transform.translation.z = boardThickness / 2;
  }
  if (!isThroughHoleComponent && boardThickness > 0) {
    const halfThickness = boardThickness / 2;
    const offsetZ = targetZ;
    if (normalizedLayer === "bottom") {
      transform.translation.z = -maxZ + offsetZ;
      transform.rotation.x = normalizeDegrees(transform.rotation.x + 180);
    } else {
      transform.translation.z = halfThickness - minZ + offsetZ;
    }
  } else if (!isThroughHoleComponent) {
    transform.translation.z = targetZ - center.z;
  }
}
function normalizeDegrees(value) {
  const wrapped = value % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}
function pruneInvalidEntries(entries) {
  let remaining = entries.slice();
  let remainingIds = new Set(remaining.map(([id]) => id));
  let changed = true;
  while (changed) {
    changed = false;
    const toRemove = /* @__PURE__ */ new Set;
    for (const [entityId, entity] of remaining) {
      const refs = collectReferencedIds(entity);
      for (const refId of refs) {
        if (!remainingIds.has(refId)) {
          toRemove.add(entityId);
          break;
        }
      }
    }
    if (toRemove.size > 0) {
      changed = true;
      remaining = remaining.filter(([id]) => !toRemove.has(id));
      remainingIds = new Set(remaining.map(([id]) => id));
    }
  }
  return remaining;
}
function collectReferencedIds(entity) {
  const result = /* @__PURE__ */ new Set;
  collectReferencedIdsRecursive(entity, result, /* @__PURE__ */ new Set);
  return result;
}
function collectReferencedIdsRecursive(value, result, seen) {
  if (!value)
    return;
  if (value instanceof Ref) {
    result.add(Number(value.id));
    return;
  }
  if (value instanceof Unknown) {
    for (const arg of value.args) {
      arg.replace(/#(\d+)/g, (_, num) => {
        result.add(Number(num));
        return _;
      });
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectReferencedIdsRecursive(item, result, seen);
    }
    return;
  }
  if (typeof value === "object") {
    if (seen.has(value)) {
      return;
    }
    seen.add(value);
    for (const entry of Object.values(value)) {
      collectReferencedIdsRecursive(entry, result, seen);
    }
  }
}
function allocateIds(targetRepo, entries) {
  let nextId = getNextEntityId(targetRepo);
  const idMapping = /* @__PURE__ */ new Map;
  for (const [oldId] of entries) {
    idMapping.set(oldId, nextId);
    nextId += 1;
  }
  return idMapping;
}
function getNextEntityId(repo) {
  let maxId = 0;
  for (const [id] of repo.entries()) {
    const numericId = Number(id);
    if (numericId > maxId) {
      maxId = numericId;
    }
  }
  return maxId + 1;
}
function remapReferences(entries, idMapping) {
  for (const [, entity] of entries) {
    remapValue(entity, idMapping, /* @__PURE__ */ new Set);
  }
}
function remapValue(value, idMapping, seen) {
  if (!value)
    return;
  if (value instanceof Ref) {
    const mapped = idMapping.get(Number(value.id));
    if (mapped !== undefined) {
      value.id = eid(mapped);
    }
    return;
  }
  if (value instanceof Unknown) {
    value.args = value.args.map((arg) => arg.replace(/#(\d+)/g, (match, num) => {
      const mapped = idMapping.get(Number(num));
      return mapped !== undefined ? `#${mapped}` : match;
    }));
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      remapValue(item, idMapping, seen);
    }
    return;
  }
  if (typeof value === "object") {
    if (seen.has(value))
      return;
    seen.add(value);
    for (const key of Object.keys(value)) {
      remapValue(value[key], idMapping, seen);
    }
  }
}
function normalizeStepNumericExponents(stepText) {
  return stepText.replace(/(-?(?:\d+\.\d*|\.\d+|\d+))e([+-]?\d+)/g, (_match, mantissa, exponent) => `${mantissa}E${exponent}`);
}
var package_default = {
  name: "circuit-json-to-step",
  main: "dist/index.js",
  version: "0.0.35",
  type: "module",
  scripts: {
    "pull-reference": `git clone https://github.com/tscircuit/circuit-json.git && find circuit-json/tests -name '*.test.ts' -exec bash -c 'mv "$0" "\${0%.test.ts}.ts"' {} \\; && git clone https://github.com/tscircuit/stepts.git && find stepts/tests -name '*.test.ts' -exec bash -c 'mv "$0" "\${0%.test.ts}.ts"' {} \\;`,
    test: "bun test",
    "test:update-snapshots": "BUN_UPDATE_SNAPSHOTS=1 bun test",
    build: "tsup-node ./lib/index.ts --format esm --dts",
    format: "biome format --write .",
    "format:check": "biome format .",
    start: "bun site/index.html",
    "build:site": "bun build site/index.html --outdir=site-export"
  },
  devDependencies: {
    "@biomejs/biome": "^2.3.8",
    "circuit-to-svg": "^0.0.356",
    "@resvg/resvg-js": "^2.6.2",
    "@resvg/resvg-wasm": "^2.6.2",
    "@tscircuit/circuit-json-util": "^0.0.75",
    "@types/bun": "latest",
    "circuit-json": "^0.0.425",
    "looks-same": "^10.0.1",
    "occt-import-js": "^0.0.23",
    poppygl: "^0.0.24",
    tsup: "^8.5.0"
  },
  peerDependencies: {
    "@tscircuit/circuit-json-util": "*",
    typescript: "^5",
    "circuit-to-svg": "*"
  },
  dependencies: {
    "circuit-json-to-connectivity-map": "^0.0.22",
    "circuit-json-to-gltf": "^0.0.102",
    "schematic-symbols": "^0.0.202",
    stepts: "^0.0.4"
  }
};
var VERSION = package_default.version;
function getPillGeometry(hole) {
  const centerX = typeof hole.x === "number" ? hole.x : hole.x.value;
  const centerY = typeof hole.y === "number" ? hole.y : hole.y.value;
  const width = hole.hole_width;
  const height = hole.hole_height;
  const ccwRotation = hole.ccw_rotation ?? 0;
  const rotation = ccwRotation * Math.PI / 180;
  const isHorizontal = width >= height;
  const radius = Math.min(width, height) / 2;
  const straightHalfLength = Math.abs(width - height) / 2;
  return {
    centerX,
    centerY,
    width,
    height,
    rotation,
    radius,
    straightHalfLength,
    isHorizontal
  };
}
function rotatePoint(x, y, centerX, centerY, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = x - centerX;
  const dy = y - centerY;
  return {
    x: centerX + dx * cos - dy * sin,
    y: centerY + dx * sin + dy * cos
  };
}
function createVertexAt(repo, x, y, z) {
  return repo.add(new VertexPoint("", repo.add(new CartesianPoint("", x, y, z))));
}
function createVertexCache(repo, z) {
  const vertices = /* @__PURE__ */ new Map;
  const normalize = (value) => {
    const rounded = Number(value.toFixed(9));
    return Object.is(rounded, -0) ? 0 : rounded;
  };
  return (x, y) => {
    const key = `${normalize(x)},${normalize(y)},${normalize(z)}`;
    const existing = vertices.get(key);
    if (existing)
      return existing;
    const vertex = createVertexAt(repo, x, y, z);
    vertices.set(key, vertex);
    return vertex;
  };
}
function createLineEdge(repo, v1, v2) {
  const p1 = v1.resolve(repo).pnt.resolve(repo);
  const p2 = v2.resolve(repo).pnt.resolve(repo);
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (length < 0.0000000001) {
    const dir2 = repo.add(new Direction("", 1, 0, 0));
    const vec2 = repo.add(new Vector("", dir2, 0.0000000001));
    const line2 = repo.add(new Line("", v1.resolve(repo).pnt, vec2));
    return repo.add(new EdgeCurve("", v1, v2, line2, true));
  }
  const dir = repo.add(new Direction("", dx / length, dy / length, dz / length));
  const vec = repo.add(new Vector("", dir, length));
  const line = repo.add(new Line("", v1.resolve(repo).pnt, vec));
  return repo.add(new EdgeCurve("", v1, v2, line, true));
}
function createLineSegment(repo, start, end, getVertex) {
  const startVertex = getVertex(start.x, start.y);
  const endVertex = getVertex(end.x, end.y);
  return {
    kind: "line",
    edge: createLineEdge(repo, startVertex, endVertex),
    start: startVertex,
    end: endVertex
  };
}
function createArcSegment(repo, centerX, centerY, z, radius, startAngle, endAngle, rotation, centerX0, centerY0, getVertex) {
  const start = rotatePoint(centerX + radius * Math.cos(startAngle), centerY + radius * Math.sin(startAngle), centerX0, centerY0, rotation);
  const end = rotatePoint(centerX + radius * Math.cos(endAngle), centerY + radius * Math.sin(endAngle), centerX0, centerY0, rotation);
  const center = rotatePoint(centerX, centerY, centerX0, centerY0, rotation);
  const startVertex = getVertex(start.x, start.y);
  const endVertex = getVertex(end.x, end.y);
  const centerPoint = repo.add(new CartesianPoint("", center.x, center.y, z));
  const normalDir = repo.add(new Direction("", 0, 0, -1));
  const refDir = repo.add(new Direction("", Math.cos(rotation), Math.sin(rotation), 0));
  const placement = repo.add(new Axis2Placement3D("", centerPoint, normalDir, refDir));
  const circle = repo.add(new Circle("", placement, radius));
  return {
    kind: "arc",
    edge: repo.add(new EdgeCurve("", startVertex, endVertex, circle, false)),
    start: startVertex,
    end: endVertex,
    centerX,
    centerY,
    radius
  };
}
function createPillBoundarySegments(repo, hole, z) {
  const geom = getPillGeometry(hole);
  const {
    centerX,
    centerY,
    radius,
    straightHalfLength,
    rotation,
    isHorizontal
  } = geom;
  const capOffset = straightHalfLength;
  const getVertex = createVertexCache(repo, z);
  if (isHorizontal) {
    return [
      createArcSegment(repo, centerX + capOffset, centerY, z, radius, -Math.PI / 2, Math.PI / 2, rotation, centerX, centerY, getVertex),
      createLineSegment(repo, rotatePoint(centerX + capOffset, centerY - radius, centerX, centerY, rotation), rotatePoint(centerX - capOffset, centerY - radius, centerX, centerY, rotation), getVertex),
      createArcSegment(repo, centerX - capOffset, centerY, z, radius, Math.PI / 2, 3 * Math.PI / 2, rotation, centerX, centerY, getVertex),
      createLineSegment(repo, rotatePoint(centerX - capOffset, centerY + radius, centerX, centerY, rotation), rotatePoint(centerX + capOffset, centerY + radius, centerX, centerY, rotation), getVertex)
    ];
  }
  return [
    createArcSegment(repo, centerX, centerY - capOffset, z, radius, Math.PI, 0, rotation, centerX, centerY, getVertex),
    createLineSegment(repo, rotatePoint(centerX + radius, centerY - capOffset, centerX, centerY, rotation), rotatePoint(centerX + radius, centerY + capOffset, centerX, centerY, rotation), getVertex),
    createArcSegment(repo, centerX, centerY + capOffset, z, radius, 0, Math.PI, rotation, centerX, centerY, getVertex),
    createLineSegment(repo, rotatePoint(centerX - radius, centerY + capOffset, centerX, centerY, rotation), rotatePoint(centerX - radius, centerY - capOffset, centerX, centerY, rotation), getVertex)
  ];
}
function createLoopFromSegments(repo, segments, orientation) {
  return repo.add(new EdgeLoop("", segments.map((segment) => repo.add(new OrientedEdge("", segment.edge, orientation)))));
}
function createPillHoleGeometry(repo, hole, zMin, zMax, zDir) {
  const geom = getPillGeometry(hole);
  const bottomSegments = createPillBoundarySegments(repo, hole, zMin);
  const topSegments = createPillBoundarySegments(repo, hole, zMax);
  const bottomLoop = createLoopFromSegments(repo, bottomSegments, true);
  const topLoop = createLoopFromSegments(repo, topSegments, true);
  const wallFaces = [];
  const verticalEdges = /* @__PURE__ */ new Map;
  const getVerticalEdge = (bottomVertex, topVertex) => {
    const key = `${bottomVertex.id}:${topVertex.id}`;
    const existing = verticalEdges.get(key);
    if (existing)
      return existing;
    const edge = createLineEdge(repo, bottomVertex, topVertex);
    verticalEdges.set(key, edge);
    return edge;
  };
  for (let i = 0;i < bottomSegments.length; i++) {
    const bottomSegment = bottomSegments[i];
    const topSegment = topSegments[i];
    const startVertical = getVerticalEdge(bottomSegment.start, topSegment.start);
    const endVertical = getVerticalEdge(bottomSegment.end, topSegment.end);
    const loop = repo.add(new EdgeLoop("", [
      repo.add(new OrientedEdge("", bottomSegment.edge, true)),
      repo.add(new OrientedEdge("", endVertical, true)),
      repo.add(new OrientedEdge("", topSegment.edge, false)),
      repo.add(new OrientedEdge("", startVertical, false))
    ]));
    if (bottomSegment.kind === "arc") {
      const center = rotatePoint(bottomSegment.centerX, bottomSegment.centerY, geom.centerX, geom.centerY, geom.rotation);
      const bottomCenter = repo.add(new CartesianPoint("", center.x, center.y, zMin));
      const refDir2 = repo.add(new Direction("", Math.cos(geom.rotation), Math.sin(geom.rotation), 0));
      const cylinderPlacement = repo.add(new Axis2Placement3D("", bottomCenter, zDir, refDir2));
      const cylinderSurface = repo.add(new CylindricalSurface("", cylinderPlacement, bottomSegment.radius));
      wallFaces.push(repo.add(new AdvancedFace("", [repo.add(new FaceOuterBound("", loop, true))], cylinderSurface, false)));
      continue;
    }
    const startPoint = bottomSegment.start.resolve(repo).pnt.resolve(repo);
    const endPoint = bottomSegment.end.resolve(repo).pnt.resolve(repo);
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const edgeLength = Math.sqrt(dx * dx + dy * dy);
    const normalDir = repo.add(new Direction("", dy / edgeLength, -dx / edgeLength, 0));
    const refDir = repo.add(new Direction("", dx / edgeLength, dy / edgeLength, 0));
    const placement = repo.add(new Axis2Placement3D("", bottomSegment.start.resolve(repo).pnt, normalDir, refDir));
    const plane = repo.add(new Plane("", placement));
    wallFaces.push(repo.add(new AdvancedFace("", [repo.add(new FaceOuterBound("", loop, true))], plane, true)));
  }
  return { bottomLoop, topLoop, wallFaces };
}
async function circuitJsonToStep(circuitJson, options = {}) {
  const repo = new Repository;
  const pcbBoard = circuitJson.find((item) => item.type === "pcb_board");
  const holes = circuitJson.filter((item) => item.type === "pcb_hole" || item.type === "pcb_plated_hole");
  const boardWidth = options.boardWidth ?? pcbBoard?.width;
  const boardHeight = options.boardHeight ?? pcbBoard?.height;
  const boardThickness = options.boardThickness ?? pcbBoard?.thickness ?? 1.6;
  const productName = options.productName ?? "PCB";
  const boardCenterX = pcbBoard?.center?.x ?? 0;
  const boardCenterY = pcbBoard?.center?.y ?? 0;
  const halfBoardThickness = boardThickness / 2;
  if (!boardWidth || !boardHeight) {
    throw new Error("Board dimensions not found. Either provide boardWidth and boardHeight in options, or include a pcb_board in the circuit JSON with width and height properties.");
  }
  const appContext = repo.add(new ApplicationContext("core data for automotive mechanical design processes"));
  repo.add(new ApplicationProtocolDefinition("international standard", "automotive_design", 2010, appContext));
  const productContext = repo.add(new ProductContext("", appContext, "mechanical"));
  const productDescription = `Generated by circuit-json-to-step v${VERSION}`;
  const product = repo.add(new Product(productName, productName, productDescription, [productContext]));
  const productDefContext = repo.add(new ProductDefinitionContext("part definition", appContext, "design"));
  const productDefFormation = repo.add(new ProductDefinitionFormation("", "", product));
  const productDef = repo.add(new ProductDefinition("", "", productDefFormation, productDefContext));
  const productDefShape = repo.add(new ProductDefinitionShape("", "", productDef));
  const lengthUnit = repo.add(new Unknown("", [
    "( LENGTH_UNIT() NAMED_UNIT(*) SI_UNIT(.MILLI.,.METRE.) )"
  ]));
  const angleUnit = repo.add(new Unknown("", [
    "( NAMED_UNIT(*) PLANE_ANGLE_UNIT() SI_UNIT($,.RADIAN.) )"
  ]));
  const solidAngleUnit = repo.add(new Unknown("", [
    "( NAMED_UNIT(*) SI_UNIT($,.STERADIAN.) SOLID_ANGLE_UNIT() )"
  ]));
  const uncertainty = repo.add(new Unknown("UNCERTAINTY_MEASURE_WITH_UNIT", [
    `LENGTH_MEASURE(1.E-07)`,
    `${lengthUnit}`,
    `'distance_accuracy_value'`,
    `'Maximum Tolerance'`
  ]));
  const geomContext = repo.add(new Unknown("", [
    `( GEOMETRIC_REPRESENTATION_CONTEXT(3) GLOBAL_UNCERTAINTY_ASSIGNED_CONTEXT((${uncertainty})) GLOBAL_UNIT_ASSIGNED_CONTEXT((${lengthUnit},${angleUnit},${solidAngleUnit})) REPRESENTATION_CONTEXT('${productName}','3D') )`
  ]));
  const outline = pcbBoard?.outline;
  let bottomVertices;
  let topVertices;
  if (outline && Array.isArray(outline) && outline.length >= 3) {
    const cleanedOutline = [];
    for (let i = 0;i < outline.length; i++) {
      const current = outline[i];
      const next = outline[(i + 1) % outline.length];
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0.000001) {
        cleanedOutline.push(current);
      }
    }
    if (cleanedOutline.length < 3) {
      throw new Error(`Outline has too few unique vertices after removing duplicates (${cleanedOutline.length}). Need at least 3.`);
    }
    bottomVertices = cleanedOutline.map((point) => repo.add(new VertexPoint("", repo.add(new CartesianPoint("", point.x, point.y, -halfBoardThickness)))));
    topVertices = cleanedOutline.map((point) => repo.add(new VertexPoint("", repo.add(new CartesianPoint("", point.x, point.y, halfBoardThickness)))));
  } else {
    const halfWidth = boardWidth / 2;
    const halfHeight = boardHeight / 2;
    const corners = [
      [
        boardCenterX - halfWidth,
        boardCenterY - halfHeight,
        -halfBoardThickness
      ],
      [
        boardCenterX + halfWidth,
        boardCenterY - halfHeight,
        -halfBoardThickness
      ],
      [
        boardCenterX + halfWidth,
        boardCenterY + halfHeight,
        -halfBoardThickness
      ],
      [
        boardCenterX - halfWidth,
        boardCenterY + halfHeight,
        -halfBoardThickness
      ],
      [boardCenterX - halfWidth, boardCenterY - halfHeight, halfBoardThickness],
      [boardCenterX + halfWidth, boardCenterY - halfHeight, halfBoardThickness],
      [boardCenterX + halfWidth, boardCenterY + halfHeight, halfBoardThickness],
      [boardCenterX - halfWidth, boardCenterY + halfHeight, halfBoardThickness]
    ];
    const vertices = corners.map(([x, y, z]) => repo.add(new VertexPoint("", repo.add(new CartesianPoint("", x, y, z)))));
    bottomVertices = [vertices[0], vertices[1], vertices[2], vertices[3]];
    topVertices = [vertices[4], vertices[5], vertices[6], vertices[7]];
  }
  function createEdge2(v1, v2) {
    const p1 = v1.resolve(repo).pnt.resolve(repo);
    const p2 = v2.resolve(repo).pnt.resolve(repo);
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (length < 0.0000000001) {
      const dir2 = repo.add(new Direction("", 1, 0, 0));
      const vec2 = repo.add(new Vector("", dir2, 0.0000000001));
      const line2 = repo.add(new Line("", v1.resolve(repo).pnt, vec2));
      return repo.add(new EdgeCurve("", v1, v2, line2, true));
    }
    const dir = repo.add(new Direction("", dx / length, dy / length, dz / length));
    const vec = repo.add(new Vector("", dir, length));
    const line = repo.add(new Line("", v1.resolve(repo).pnt, vec));
    return repo.add(new EdgeCurve("", v1, v2, line, true));
  }
  const bottomEdges = [];
  const topEdges = [];
  const verticalEdges = [];
  for (let i = 0;i < bottomVertices.length; i++) {
    const v1 = bottomVertices[i];
    const v2 = bottomVertices[(i + 1) % bottomVertices.length];
    bottomEdges.push(createEdge2(v1, v2));
  }
  for (let i = 0;i < topVertices.length; i++) {
    const v1 = topVertices[i];
    const v2 = topVertices[(i + 1) % topVertices.length];
    topEdges.push(createEdge2(v1, v2));
  }
  for (let i = 0;i < bottomVertices.length; i++) {
    verticalEdges.push(createEdge2(bottomVertices[i], topVertices[i]));
  }
  const origin = repo.add(new CartesianPoint("", 0, 0, -halfBoardThickness));
  const xDir = repo.add(new Direction("", 1, 0, 0));
  const zDir = repo.add(new Direction("", 0, 0, 1));
  const bottomFrame = repo.add(new Axis2Placement3D("", origin, repo.add(new Direction("", 0, 0, -1)), xDir));
  const bottomPlane = repo.add(new Plane("", bottomFrame));
  const bottomLoop = repo.add(new EdgeLoop("", bottomEdges.map((edge) => repo.add(new OrientedEdge("", edge, true)))));
  const topOrigin = repo.add(new CartesianPoint("", 0, 0, halfBoardThickness));
  const topFrame = repo.add(new Axis2Placement3D("", topOrigin, zDir, xDir));
  const topPlane = repo.add(new Plane("", topFrame));
  const topLoop = repo.add(new EdgeLoop("", topEdges.map((edge) => repo.add(new OrientedEdge("", edge, false)))));
  function getHoleCoordinate(coordinate) {
    if (typeof coordinate === "number")
      return coordinate;
    return coordinate?.value ?? 0;
  }
  function createCircularHoleGeometry(hole) {
    const holeX = getHoleCoordinate(hole.x);
    const holeY = getHoleCoordinate(hole.y);
    const radius = (hole.hole_diameter ?? 0) / 2;
    const bottomHoleCenter = repo.add(new CartesianPoint("", holeX, holeY, -halfBoardThickness));
    const bottomHoleVertex = repo.add(new VertexPoint("", repo.add(new CartesianPoint("", holeX + radius, holeY, -halfBoardThickness))));
    const bottomHolePlacement = repo.add(new Axis2Placement3D("", bottomHoleCenter, repo.add(new Direction("", 0, 0, -1)), xDir));
    const bottomHoleCircle = repo.add(new Circle("", bottomHolePlacement, radius));
    const bottomHoleEdge = repo.add(new EdgeCurve("", bottomHoleVertex, bottomHoleVertex, bottomHoleCircle, true));
    const topHoleCenter = repo.add(new CartesianPoint("", holeX, holeY, halfBoardThickness));
    const topHoleVertex = repo.add(new VertexPoint("", repo.add(new CartesianPoint("", holeX + radius, holeY, halfBoardThickness))));
    const topHolePlacement = repo.add(new Axis2Placement3D("", topHoleCenter, zDir, xDir));
    const topHoleCircle = repo.add(new Circle("", topHolePlacement, radius));
    const topHoleEdge = repo.add(new EdgeCurve("", topHoleVertex, topHoleVertex, topHoleCircle, true));
    const bottomLoop2 = repo.add(new EdgeLoop("", [repo.add(new OrientedEdge("", bottomHoleEdge, false))]));
    const topLoop2 = repo.add(new EdgeLoop("", [repo.add(new OrientedEdge("", topHoleEdge, true))]));
    const wallLoop = repo.add(new EdgeLoop("", [
      repo.add(new OrientedEdge("", bottomHoleEdge, true)),
      repo.add(new OrientedEdge("", topHoleEdge, false))
    ]));
    const holeCylinderPlacement = repo.add(new Axis2Placement3D("", bottomHoleCenter, zDir, xDir));
    const holeCylinderSurface = repo.add(new CylindricalSurface("", holeCylinderPlacement, radius));
    const wallFace = repo.add(new AdvancedFace("", [repo.add(new FaceOuterBound("", wallLoop, true))], holeCylinderSurface, false));
    return { bottomLoop: bottomLoop2, topLoop: topLoop2, wallFaces: [wallFace] };
  }
  const sharedHoleGeometries = [];
  for (const hole of holes) {
    const holeShape = hole.hole_shape ?? hole.shape;
    if (holeShape === "circle") {
      sharedHoleGeometries.push(createCircularHoleGeometry(hole));
    } else if (holeShape === "rotated_pill" || holeShape === "pill") {
      sharedHoleGeometries.push(createPillHoleGeometry(repo, hole, -halfBoardThickness, halfBoardThickness, zDir));
    }
  }
  const bottomHoleLoops = [];
  const topHoleLoops = [];
  for (const holeGeometry of sharedHoleGeometries) {
    bottomHoleLoops.push(repo.add(new FaceBound("", holeGeometry.bottomLoop, true)));
    topHoleLoops.push(repo.add(new FaceBound("", holeGeometry.topLoop, true)));
  }
  const bottomFace = repo.add(new AdvancedFace("", [repo.add(new FaceOuterBound("", bottomLoop, true)), ...bottomHoleLoops], bottomPlane, true));
  const topFace = repo.add(new AdvancedFace("", [repo.add(new FaceOuterBound("", topLoop, true)), ...topHoleLoops], topPlane, true));
  const holeCylindricalFaces = [];
  for (const holeGeometry of sharedHoleGeometries) {
    holeCylindricalFaces.push(...holeGeometry.wallFaces);
  }
  const sideFaces = [];
  for (let i = 0;i < bottomEdges.length; i++) {
    const nextI = (i + 1) % bottomEdges.length;
    const bottomV1Pnt = bottomVertices[i].resolve(repo).pnt;
    const bottomV2Pnt = bottomVertices[nextI].resolve(repo).pnt;
    const bottomV1 = bottomV1Pnt.resolve(repo);
    const bottomV2 = bottomV2Pnt.resolve(repo);
    const edgeDir = {
      x: bottomV2.x - bottomV1.x,
      y: bottomV2.y - bottomV1.y,
      z: -halfBoardThickness
    };
    const normalDir = repo.add(new Direction("", edgeDir.y, -edgeDir.x, 0));
    const refDir = repo.add(new Direction("", edgeDir.x, edgeDir.y, 0));
    const sideFrame = repo.add(new Axis2Placement3D("", bottomV1Pnt, normalDir, refDir));
    const sidePlane = repo.add(new Plane("", sideFrame));
    const sideLoop = repo.add(new EdgeLoop("", [
      repo.add(new OrientedEdge("", bottomEdges[i], true)),
      repo.add(new OrientedEdge("", verticalEdges[nextI], true)),
      repo.add(new OrientedEdge("", topEdges[i], false)),
      repo.add(new OrientedEdge("", verticalEdges[i], false))
    ]));
    const sideFace = repo.add(new AdvancedFace("", [repo.add(new FaceOuterBound("", sideLoop, true))], sidePlane, true));
    sideFaces.push(sideFace);
  }
  const allFaces = [bottomFace, topFace, ...sideFaces, ...holeCylindricalFaces];
  const styleCache = createStyleCache();
  const boardStyledItems = createStyledItems(repo, {
    itemRefs: allFaces,
    rgb: [0.2, 0.6, 0.2],
    styleCache
  });
  const shell = repo.add(new ClosedShell("", allFaces));
  const solid = repo.add(new ManifoldSolidBrep(productName, shell));
  const allSolids = [solid];
  const componentStyledItems = [];
  const solidsWithIntrinsicFaceStyles = /* @__PURE__ */ new Set;
  let handledComponentIds = /* @__PURE__ */ new Set;
  let handledPcbComponentIds = /* @__PURE__ */ new Set;
  if (options.includeComponents && options.includeExternalMeshes) {
    const mergeResult = await mergeExternalStepModels({
      repo,
      circuitJson,
      boardThickness,
      fsMap: options.fsMap
    });
    handledComponentIds = mergeResult.handledComponentIds;
    handledPcbComponentIds = mergeResult.handledPcbComponentIds;
    allSolids.push(...mergeResult.solids);
    mergeResult.solids.forEach((solidRef) => {
      solidsWithIntrinsicFaceStyles.add(String(solidRef.id));
    });
  }
  if (options.includeComponents) {
    const pcbComponentIdsWithStepUrl = /* @__PURE__ */ new Set;
    for (const item of circuitJson) {
      if (item.type === "cad_component" && item.model_step_url && item.pcb_component_id) {
        pcbComponentIdsWithStepUrl.add(item.pcb_component_id);
      }
    }
    const hasComponentsNeedingMesh = circuitJson.some((item) => {
      if (item.type === "cad_component") {
        if (item.cad_component_id && handledComponentIds.has(item.cad_component_id)) {
          return false;
        }
        if (item.pcb_component_id && pcbComponentIdsWithStepUrl.has(item.pcb_component_id)) {
          return false;
        }
        return !item.model_step_url;
      }
      if (item.type === "pcb_component") {
        if (item.pcb_component_id && handledPcbComponentIds.has(item.pcb_component_id)) {
          return false;
        }
        if (item.pcb_component_id && pcbComponentIdsWithStepUrl.has(item.pcb_component_id)) {
          return false;
        }
        return true;
      }
      return false;
    });
    if (hasComponentsNeedingMesh) {
      const componentSolids = await generateComponentMeshes({
        repo,
        circuitJson,
        boardThickness,
        includeExternalMeshes: options.includeExternalMeshes,
        excludeCadComponentIds: handledComponentIds,
        excludePcbComponentIds: handledPcbComponentIds,
        pcbComponentIdsWithStepUrl
      });
      for (const componentSolid of componentSolids) {
        allSolids.push(componentSolid.solid);
        componentStyledItems.push(...componentSolid.styledItems);
        if (componentSolid.usesIntrinsicFaceStyles) {
          solidsWithIntrinsicFaceStyles.add(String(componentSolid.solid.id));
        } else if (componentSolid.styleTargets.length > 0) {
          componentStyledItems.push(...createStyledItems(repo, {
            itemRefs: componentSolid.styleTargets,
            rgb: [0.75, 0.75, 0.75],
            styleCache
          }));
          solidsWithIntrinsicFaceStyles.add(String(componentSolid.solid.id));
        }
      }
    }
  }
  const styledItems = [
    ...boardStyledItems,
    ...componentStyledItems
  ];
  allSolids.forEach((itemRef, index) => {
    const isBoard = index === 0;
    if (isBoard || solidsWithIntrinsicFaceStyles.has(String(itemRef.id))) {
      return;
    }
    const styledItem = createStyledItem(repo, {
      itemRef,
      rgb: [0.75, 0.75, 0.75],
      styleCache,
      name: ""
    });
    styledItems.push(styledItem);
  });
  repo.add(new MechanicalDesignGeometricPresentationRepresentation("", styledItems, geomContext));
  const hasMappedItems = allSolids.some((itemRef) => itemRef.resolve(repo).type === "MAPPED_ITEM");
  const shapeRep = repo.add(hasMappedItems ? new ShapeRepresentation(productName, allSolids, geomContext) : new AdvancedBrepShapeRepresentation(productName, allSolids, geomContext));
  repo.add(new ShapeDefinitionRepresentation(productDefShape, shapeRep));
  const stepText = repo.toPartFile({ name: productName });
  return normalizeStepNumericExponents(stepText);
}

// cli/build/worker-output-generators.ts
import { convertCircuitJsonToGltf } from "circuit-json-to-gltf";
import {
  convertCircuitJsonToPcbSvg,
  convertCircuitJsonToSchematicSvg
} from "circuit-to-svg";

// node_modules/conf/dist/source/index.js
import { isDeepStrictEqual } from "node:util";
import process7 from "node:process";
import fs6 from "node:fs";
import path8 from "node:path";
import crypto from "node:crypto";
import assert from "node:assert";

// node_modules/dot-prop/index.js
var isObject = (value) => {
  const type = typeof value;
  return value !== null && (type === "object" || type === "function");
};
var disallowedKeys = new Set([
  "__proto__",
  "prototype",
  "constructor"
]);
var digits = new Set("0123456789");
function getPathSegments(path5) {
  const parts = [];
  let currentSegment = "";
  let currentPart = "start";
  let isIgnoring = false;
  for (const character of path5) {
    switch (character) {
      case "\\": {
        if (currentPart === "index") {
          throw new Error("Invalid character in an index");
        }
        if (currentPart === "indexEnd") {
          throw new Error("Invalid character after an index");
        }
        if (isIgnoring) {
          currentSegment += character;
        }
        currentPart = "property";
        isIgnoring = !isIgnoring;
        break;
      }
      case ".": {
        if (currentPart === "index") {
          throw new Error("Invalid character in an index");
        }
        if (currentPart === "indexEnd") {
          currentPart = "property";
          break;
        }
        if (isIgnoring) {
          isIgnoring = false;
          currentSegment += character;
          break;
        }
        if (disallowedKeys.has(currentSegment)) {
          return [];
        }
        parts.push(currentSegment);
        currentSegment = "";
        currentPart = "property";
        break;
      }
      case "[": {
        if (currentPart === "index") {
          throw new Error("Invalid character in an index");
        }
        if (currentPart === "indexEnd") {
          currentPart = "index";
          break;
        }
        if (isIgnoring) {
          isIgnoring = false;
          currentSegment += character;
          break;
        }
        if (currentPart === "property") {
          if (disallowedKeys.has(currentSegment)) {
            return [];
          }
          parts.push(currentSegment);
          currentSegment = "";
        }
        currentPart = "index";
        break;
      }
      case "]": {
        if (currentPart === "index") {
          parts.push(Number.parseInt(currentSegment, 10));
          currentSegment = "";
          currentPart = "indexEnd";
          break;
        }
        if (currentPart === "indexEnd") {
          throw new Error("Invalid character after an index");
        }
      }
      default: {
        if (currentPart === "index" && !digits.has(character)) {
          throw new Error("Invalid character in an index");
        }
        if (currentPart === "indexEnd") {
          throw new Error("Invalid character after an index");
        }
        if (currentPart === "start") {
          currentPart = "property";
        }
        if (isIgnoring) {
          isIgnoring = false;
          currentSegment += "\\";
        }
        currentSegment += character;
      }
    }
  }
  if (isIgnoring) {
    currentSegment += "\\";
  }
  switch (currentPart) {
    case "property": {
      if (disallowedKeys.has(currentSegment)) {
        return [];
      }
      parts.push(currentSegment);
      break;
    }
    case "index": {
      throw new Error("Index was not closed");
    }
    case "start": {
      parts.push("");
      break;
    }
  }
  return parts;
}
function isStringIndex(object, key) {
  if (typeof key !== "number" && Array.isArray(object)) {
    const index = Number.parseInt(key, 10);
    return Number.isInteger(index) && object[index] === object[key];
  }
  return false;
}
function assertNotStringIndex(object, key) {
  if (isStringIndex(object, key)) {
    throw new Error("Cannot use string index");
  }
}
function getProperty(object, path5, value) {
  if (!isObject(object) || typeof path5 !== "string") {
    return value === undefined ? object : value;
  }
  const pathArray = getPathSegments(path5);
  if (pathArray.length === 0) {
    return value;
  }
  for (let index = 0;index < pathArray.length; index++) {
    const key = pathArray[index];
    if (isStringIndex(object, key)) {
      object = index === pathArray.length - 1 ? undefined : null;
    } else {
      object = object[key];
    }
    if (object === undefined || object === null) {
      if (index !== pathArray.length - 1) {
        return value;
      }
      break;
    }
  }
  return object === undefined ? value : object;
}
function setProperty(object, path5, value) {
  if (!isObject(object) || typeof path5 !== "string") {
    return object;
  }
  const root = object;
  const pathArray = getPathSegments(path5);
  for (let index = 0;index < pathArray.length; index++) {
    const key = pathArray[index];
    assertNotStringIndex(object, key);
    if (index === pathArray.length - 1) {
      object[key] = value;
    } else if (!isObject(object[key])) {
      object[key] = typeof pathArray[index + 1] === "number" ? [] : {};
    }
    object = object[key];
  }
  return root;
}
function deleteProperty(object, path5) {
  if (!isObject(object) || typeof path5 !== "string") {
    return false;
  }
  const pathArray = getPathSegments(path5);
  for (let index = 0;index < pathArray.length; index++) {
    const key = pathArray[index];
    assertNotStringIndex(object, key);
    if (index === pathArray.length - 1) {
      delete object[key];
      return true;
    }
    object = object[key];
    if (!isObject(object)) {
      return false;
    }
  }
}
function hasProperty(object, path5) {
  if (!isObject(object) || typeof path5 !== "string") {
    return false;
  }
  const pathArray = getPathSegments(path5);
  if (pathArray.length === 0) {
    return false;
  }
  for (const key of pathArray) {
    if (!isObject(object) || !(key in object) || isStringIndex(object, key)) {
      return false;
    }
    object = object[key];
  }
  return true;
}

// node_modules/env-paths/index.js
import path5 from "node:path";
import os from "node:os";
import process2 from "node:process";
var homedir = os.homedir();
var tmpdir = os.tmpdir();
var { env } = process2;
var macos = (name) => {
  const library = path5.join(homedir, "Library");
  return {
    data: path5.join(library, "Application Support", name),
    config: path5.join(library, "Preferences", name),
    cache: path5.join(library, "Caches", name),
    log: path5.join(library, "Logs", name),
    temp: path5.join(tmpdir, name)
  };
};
var windows = (name) => {
  const appData = env.APPDATA || path5.join(homedir, "AppData", "Roaming");
  const localAppData = env.LOCALAPPDATA || path5.join(homedir, "AppData", "Local");
  return {
    data: path5.join(localAppData, name, "Data"),
    config: path5.join(appData, name, "Config"),
    cache: path5.join(localAppData, name, "Cache"),
    log: path5.join(localAppData, name, "Log"),
    temp: path5.join(tmpdir, name)
  };
};
var linux = (name) => {
  const username = path5.basename(homedir);
  return {
    data: path5.join(env.XDG_DATA_HOME || path5.join(homedir, ".local", "share"), name),
    config: path5.join(env.XDG_CONFIG_HOME || path5.join(homedir, ".config"), name),
    cache: path5.join(env.XDG_CACHE_HOME || path5.join(homedir, ".cache"), name),
    log: path5.join(env.XDG_STATE_HOME || path5.join(homedir, ".local", "state"), name),
    temp: path5.join(tmpdir, username, name)
  };
};
function envPaths(name, { suffix = "nodejs" } = {}) {
  if (typeof name !== "string") {
    throw new TypeError(`Expected a string, got ${typeof name}`);
  }
  if (suffix) {
    name += `-${suffix}`;
  }
  if (process2.platform === "darwin") {
    return macos(name);
  }
  if (process2.platform === "win32") {
    return windows(name);
  }
  return linux(name);
}

// node_modules/atomically/dist/index.js
import path7 from "node:path";

// node_modules/stubborn-fs/dist/index.js
import fs5 from "node:fs";
import { promisify } from "node:util";

// node_modules/stubborn-utils/dist/attemptify_async.js
var attemptifyAsync = (fn, options) => {
  const { onError } = options;
  return function attemptified(...args) {
    return fn.apply(undefined, args).catch(onError);
  };
};
var attemptify_async_default = attemptifyAsync;

// node_modules/stubborn-utils/dist/attemptify_sync.js
var attemptifySync = (fn, options) => {
  const { onError } = options;
  return function attemptified(...args) {
    try {
      return fn.apply(undefined, args);
    } catch (error) {
      return onError(error);
    }
  };
};
var attemptify_sync_default = attemptifySync;

// node_modules/stubborn-utils/dist/constants.js
var RETRY_INTERVAL = 250;

// node_modules/stubborn-utils/dist/retryify_async.js
var retryifyAsync = (fn, options) => {
  const { isRetriable } = options;
  return function retryified(options2) {
    const { timeout } = options2;
    const interval = options2.interval ?? RETRY_INTERVAL;
    const timestamp = Date.now() + timeout;
    return function attempt(...args) {
      return fn.apply(undefined, args).catch((error) => {
        if (!isRetriable(error))
          throw error;
        if (Date.now() >= timestamp)
          throw error;
        const delay = Math.round(interval * Math.random());
        if (delay > 0) {
          const delayPromise = new Promise((resolve2) => setTimeout(resolve2, delay));
          return delayPromise.then(() => attempt.apply(undefined, args));
        } else {
          return attempt.apply(undefined, args);
        }
      });
    };
  };
};
var retryify_async_default = retryifyAsync;

// node_modules/stubborn-utils/dist/retryify_sync.js
var retryifySync = (fn, options) => {
  const { isRetriable } = options;
  return function retryified(options2) {
    const { timeout } = options2;
    const timestamp = Date.now() + timeout;
    return function attempt(...args) {
      while (true) {
        try {
          return fn.apply(undefined, args);
        } catch (error) {
          if (!isRetriable(error))
            throw error;
          if (Date.now() >= timestamp)
            throw error;
          continue;
        }
      }
    };
  };
};
var retryify_sync_default = retryifySync;

// node_modules/stubborn-fs/dist/constants.js
import process3 from "node:process";

// node_modules/stubborn-fs/dist/handlers.js
var Handlers = {
  isChangeErrorOk: (error) => {
    if (!Handlers.isNodeError(error))
      return false;
    const { code } = error;
    if (code === "ENOSYS")
      return true;
    if (!IS_USER_ROOT && (code === "EINVAL" || code === "EPERM"))
      return true;
    return false;
  },
  isNodeError: (error) => {
    return error instanceof Error;
  },
  isRetriableError: (error) => {
    if (!Handlers.isNodeError(error))
      return false;
    const { code } = error;
    if (code === "EMFILE" || code === "ENFILE" || code === "EAGAIN" || code === "EBUSY" || code === "EACCESS" || code === "EACCES" || code === "EACCS" || code === "EPERM")
      return true;
    return false;
  },
  onChangeError: (error) => {
    if (!Handlers.isNodeError(error))
      throw error;
    if (Handlers.isChangeErrorOk(error))
      return;
    throw error;
  }
};
var handlers_default = Handlers;

// node_modules/stubborn-fs/dist/constants.js
var ATTEMPTIFY_CHANGE_ERROR_OPTIONS = {
  onError: handlers_default.onChangeError
};
var ATTEMPTIFY_NOOP_OPTIONS = {
  onError: () => {
    return;
  }
};
var IS_USER_ROOT = process3.getuid ? !process3.getuid() : false;
var RETRYIFY_OPTIONS = {
  isRetriable: handlers_default.isRetriableError
};

// node_modules/stubborn-fs/dist/index.js
var FS = {
  attempt: {
    chmod: attemptify_async_default(promisify(fs5.chmod), ATTEMPTIFY_CHANGE_ERROR_OPTIONS),
    chown: attemptify_async_default(promisify(fs5.chown), ATTEMPTIFY_CHANGE_ERROR_OPTIONS),
    close: attemptify_async_default(promisify(fs5.close), ATTEMPTIFY_NOOP_OPTIONS),
    fsync: attemptify_async_default(promisify(fs5.fsync), ATTEMPTIFY_NOOP_OPTIONS),
    mkdir: attemptify_async_default(promisify(fs5.mkdir), ATTEMPTIFY_NOOP_OPTIONS),
    realpath: attemptify_async_default(promisify(fs5.realpath), ATTEMPTIFY_NOOP_OPTIONS),
    stat: attemptify_async_default(promisify(fs5.stat), ATTEMPTIFY_NOOP_OPTIONS),
    unlink: attemptify_async_default(promisify(fs5.unlink), ATTEMPTIFY_NOOP_OPTIONS),
    chmodSync: attemptify_sync_default(fs5.chmodSync, ATTEMPTIFY_CHANGE_ERROR_OPTIONS),
    chownSync: attemptify_sync_default(fs5.chownSync, ATTEMPTIFY_CHANGE_ERROR_OPTIONS),
    closeSync: attemptify_sync_default(fs5.closeSync, ATTEMPTIFY_NOOP_OPTIONS),
    existsSync: attemptify_sync_default(fs5.existsSync, ATTEMPTIFY_NOOP_OPTIONS),
    fsyncSync: attemptify_sync_default(fs5.fsync, ATTEMPTIFY_NOOP_OPTIONS),
    mkdirSync: attemptify_sync_default(fs5.mkdirSync, ATTEMPTIFY_NOOP_OPTIONS),
    realpathSync: attemptify_sync_default(fs5.realpathSync, ATTEMPTIFY_NOOP_OPTIONS),
    statSync: attemptify_sync_default(fs5.statSync, ATTEMPTIFY_NOOP_OPTIONS),
    unlinkSync: attemptify_sync_default(fs5.unlinkSync, ATTEMPTIFY_NOOP_OPTIONS)
  },
  retry: {
    close: retryify_async_default(promisify(fs5.close), RETRYIFY_OPTIONS),
    fsync: retryify_async_default(promisify(fs5.fsync), RETRYIFY_OPTIONS),
    open: retryify_async_default(promisify(fs5.open), RETRYIFY_OPTIONS),
    readFile: retryify_async_default(promisify(fs5.readFile), RETRYIFY_OPTIONS),
    rename: retryify_async_default(promisify(fs5.rename), RETRYIFY_OPTIONS),
    stat: retryify_async_default(promisify(fs5.stat), RETRYIFY_OPTIONS),
    write: retryify_async_default(promisify(fs5.write), RETRYIFY_OPTIONS),
    writeFile: retryify_async_default(promisify(fs5.writeFile), RETRYIFY_OPTIONS),
    closeSync: retryify_sync_default(fs5.closeSync, RETRYIFY_OPTIONS),
    fsyncSync: retryify_sync_default(fs5.fsyncSync, RETRYIFY_OPTIONS),
    openSync: retryify_sync_default(fs5.openSync, RETRYIFY_OPTIONS),
    readFileSync: retryify_sync_default(fs5.readFileSync, RETRYIFY_OPTIONS),
    renameSync: retryify_sync_default(fs5.renameSync, RETRYIFY_OPTIONS),
    statSync: retryify_sync_default(fs5.statSync, RETRYIFY_OPTIONS),
    writeSync: retryify_sync_default(fs5.writeSync, RETRYIFY_OPTIONS),
    writeFileSync: retryify_sync_default(fs5.writeFileSync, RETRYIFY_OPTIONS)
  }
};
var dist_default = FS;

// node_modules/atomically/dist/constants.js
import process4 from "node:process";
var DEFAULT_ENCODING = "utf8";
var DEFAULT_FILE_MODE = 438;
var DEFAULT_FOLDER_MODE = 511;
var DEFAULT_WRITE_OPTIONS = {};
var DEFAULT_USER_UID = process4.geteuid ? process4.geteuid() : -1;
var DEFAULT_USER_GID = process4.getegid ? process4.getegid() : -1;
var DEFAULT_TIMEOUT_SYNC = 1000;
var IS_POSIX = !!process4.getuid;
var IS_USER_ROOT2 = process4.getuid ? !process4.getuid() : false;
var LIMIT_BASENAME_LENGTH = 128;

// node_modules/atomically/dist/utils/lang.js
var isException = (value) => {
  return value instanceof Error && "code" in value;
};
var isString = (value) => {
  return typeof value === "string";
};
var isUndefined = (value) => {
  return value === undefined;
};

// node_modules/atomically/dist/utils/temp.js
import path6 from "node:path";

// node_modules/when-exit/dist/node/interceptor.js
import process6 from "node:process";

// node_modules/when-exit/dist/node/constants.js
import process5 from "node:process";
var IS_LINUX = process5.platform === "linux";
var IS_WINDOWS = process5.platform === "win32";

// node_modules/when-exit/dist/node/signals.js
var Signals = ["SIGHUP", "SIGINT", "SIGTERM"];
if (!IS_WINDOWS) {
  Signals.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
}
if (IS_LINUX) {
  Signals.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
}
var signals_default = Signals;

// node_modules/when-exit/dist/node/interceptor.js
class Interceptor {
  constructor() {
    this.callbacks = new Set;
    this.exited = false;
    this.exit = (signal) => {
      if (this.exited)
        return;
      this.exited = true;
      for (const callback of this.callbacks) {
        callback();
      }
      if (signal) {
        if (IS_WINDOWS && (signal !== "SIGINT" && signal !== "SIGTERM" && signal !== "SIGKILL")) {
          process6.kill(process6.pid, "SIGTERM");
        } else {
          process6.kill(process6.pid, signal);
        }
      }
    };
    this.hook = () => {
      process6.once("exit", () => this.exit());
      for (const signal of signals_default) {
        try {
          process6.once(signal, () => this.exit(signal));
        } catch {}
      }
    };
    this.register = (callback) => {
      this.callbacks.add(callback);
      return () => {
        this.callbacks.delete(callback);
      };
    };
    this.hook();
  }
}
var interceptor_default = new Interceptor;

// node_modules/when-exit/dist/node/index.js
var whenExit = interceptor_default.register;
var node_default = whenExit;

// node_modules/atomically/dist/utils/temp.js
var Temp = {
  store: {},
  create: (filePath) => {
    const randomness = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6);
    const timestamp = Date.now().toString().slice(-10);
    const prefix = "tmp-";
    const suffix = `.${prefix}${timestamp}${randomness}`;
    const tempPath = `${filePath}${suffix}`;
    return tempPath;
  },
  get: (filePath, creator, purge = true) => {
    const tempPath = Temp.truncate(creator(filePath));
    if (tempPath in Temp.store)
      return Temp.get(filePath, creator, purge);
    Temp.store[tempPath] = purge;
    const disposer = () => delete Temp.store[tempPath];
    return [tempPath, disposer];
  },
  purge: (filePath) => {
    if (!Temp.store[filePath])
      return;
    delete Temp.store[filePath];
    dist_default.attempt.unlink(filePath);
  },
  purgeSync: (filePath) => {
    if (!Temp.store[filePath])
      return;
    delete Temp.store[filePath];
    dist_default.attempt.unlinkSync(filePath);
  },
  purgeSyncAll: () => {
    for (const filePath in Temp.store) {
      Temp.purgeSync(filePath);
    }
  },
  truncate: (filePath) => {
    const basename = path6.basename(filePath);
    if (basename.length <= LIMIT_BASENAME_LENGTH)
      return filePath;
    const truncable = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(basename);
    if (!truncable)
      return filePath;
    const truncationLength = basename.length - LIMIT_BASENAME_LENGTH;
    return `${filePath.slice(0, -basename.length)}${truncable[1]}${truncable[2].slice(0, -truncationLength)}${truncable[3]}`;
  }
};
node_default(Temp.purgeSyncAll);
var temp_default = Temp;

// node_modules/atomically/dist/index.js
function writeFileSync(filePath, data, options = DEFAULT_WRITE_OPTIONS) {
  if (isString(options))
    return writeFileSync(filePath, data, { encoding: options });
  const timeout = options.timeout ?? DEFAULT_TIMEOUT_SYNC;
  const retryOptions = { timeout };
  let tempDisposer = null;
  let tempPath = null;
  let fd = null;
  try {
    const filePathReal = dist_default.attempt.realpathSync(filePath);
    const filePathExists = !!filePathReal;
    filePath = filePathReal || filePath;
    [tempPath, tempDisposer] = temp_default.get(filePath, options.tmpCreate || temp_default.create, !(options.tmpPurge === false));
    const useStatChown = IS_POSIX && isUndefined(options.chown);
    const useStatMode = isUndefined(options.mode);
    if (filePathExists && (useStatChown || useStatMode)) {
      const stats = dist_default.attempt.statSync(filePath);
      if (stats) {
        options = { ...options };
        if (useStatChown) {
          options.chown = { uid: stats.uid, gid: stats.gid };
        }
        if (useStatMode) {
          options.mode = stats.mode;
        }
      }
    }
    if (!filePathExists) {
      const parentPath = path7.dirname(filePath);
      dist_default.attempt.mkdirSync(parentPath, {
        mode: DEFAULT_FOLDER_MODE,
        recursive: true
      });
    }
    fd = dist_default.retry.openSync(retryOptions)(tempPath, "w", options.mode || DEFAULT_FILE_MODE);
    if (options.tmpCreated) {
      options.tmpCreated(tempPath);
    }
    if (isString(data)) {
      dist_default.retry.writeSync(retryOptions)(fd, data, 0, options.encoding || DEFAULT_ENCODING);
    } else if (!isUndefined(data)) {
      dist_default.retry.writeSync(retryOptions)(fd, data, 0, data.length, 0);
    }
    if (options.fsync !== false) {
      if (options.fsyncWait !== false) {
        dist_default.retry.fsyncSync(retryOptions)(fd);
      } else {
        dist_default.attempt.fsync(fd);
      }
    }
    dist_default.retry.closeSync(retryOptions)(fd);
    fd = null;
    if (options.chown && (options.chown.uid !== DEFAULT_USER_UID || options.chown.gid !== DEFAULT_USER_GID)) {
      dist_default.attempt.chownSync(tempPath, options.chown.uid, options.chown.gid);
    }
    if (options.mode && options.mode !== DEFAULT_FILE_MODE) {
      dist_default.attempt.chmodSync(tempPath, options.mode);
    }
    try {
      dist_default.retry.renameSync(retryOptions)(tempPath, filePath);
    } catch (error) {
      if (!isException(error))
        throw error;
      if (error.code !== "ENAMETOOLONG")
        throw error;
      dist_default.retry.renameSync(retryOptions)(tempPath, temp_default.truncate(filePath));
    }
    tempDisposer();
    tempPath = null;
  } finally {
    if (fd)
      dist_default.attempt.closeSync(fd);
    if (tempPath)
      temp_default.purge(tempPath);
  }
}

// node_modules/conf/dist/source/index.js
var import__2020 = __toESM(require_2020(), 1);
var import_ajv_formats = __toESM(require_dist2(), 1);

// node_modules/mimic-function/index.js
var copyProperty = (to, from, property, ignoreNonConfigurable) => {
  if (property === "length" || property === "prototype") {
    return;
  }
  if (property === "arguments" || property === "caller") {
    return;
  }
  const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
  const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
  if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
    return;
  }
  Object.defineProperty(to, property, fromDescriptor);
};
var canCopyProperty = function(toDescriptor, fromDescriptor) {
  return toDescriptor === undefined || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
};
var changePrototype = (to, from) => {
  const fromPrototype = Object.getPrototypeOf(from);
  if (fromPrototype === Object.getPrototypeOf(to)) {
    return;
  }
  Object.setPrototypeOf(to, fromPrototype);
};
var wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/
${fromBody}`;
var toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, "toString");
var toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name");
var changeToString = (to, from, name) => {
  const withName = name === "" ? "" : `with ${name.trim()}() `;
  const newToString = wrappedToString.bind(null, withName, from.toString());
  Object.defineProperty(newToString, "name", toStringName);
  const { writable, enumerable, configurable } = toStringDescriptor;
  Object.defineProperty(to, "toString", { value: newToString, writable, enumerable, configurable });
};
function mimicFunction(to, from, { ignoreNonConfigurable = false } = {}) {
  const { name } = to;
  for (const property of Reflect.ownKeys(from)) {
    copyProperty(to, from, property, ignoreNonConfigurable);
  }
  changePrototype(to, from);
  changeToString(to, from, name);
  return to;
}

// node_modules/debounce-fn/index.js
var debounceFunction = (inputFunction, options = {}) => {
  if (typeof inputFunction !== "function") {
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof inputFunction}\``);
  }
  const {
    wait = 0,
    maxWait = Number.POSITIVE_INFINITY,
    before = false,
    after = true
  } = options;
  if (wait < 0 || maxWait < 0) {
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  }
  if (!before && !after) {
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  }
  let timeout;
  let maxTimeout;
  let result;
  const debouncedFunction = function(...arguments_) {
    const context = this;
    const later = () => {
      timeout = undefined;
      if (maxTimeout) {
        clearTimeout(maxTimeout);
        maxTimeout = undefined;
      }
      if (after) {
        result = inputFunction.apply(context, arguments_);
      }
    };
    const maxLater = () => {
      maxTimeout = undefined;
      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }
      if (after) {
        result = inputFunction.apply(context, arguments_);
      }
    };
    const shouldCallNow = before && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (maxWait > 0 && maxWait !== Number.POSITIVE_INFINITY && !maxTimeout) {
      maxTimeout = setTimeout(maxLater, maxWait);
    }
    if (shouldCallNow) {
      result = inputFunction.apply(context, arguments_);
    }
    return result;
  };
  mimicFunction(debouncedFunction, inputFunction);
  debouncedFunction.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    if (maxTimeout) {
      clearTimeout(maxTimeout);
      maxTimeout = undefined;
    }
  };
  return debouncedFunction;
};
var debounce_fn_default = debounceFunction;

// node_modules/conf/dist/source/index.js
var import_semver = __toESM(require_semver2(), 1);

// node_modules/uint8array-extras/index.js
var objectToString = Object.prototype.toString;
var uint8ArrayStringified = "[object Uint8Array]";
var arrayBufferStringified = "[object ArrayBuffer]";
function isType(value, typeConstructor, typeStringified) {
  if (!value) {
    return false;
  }
  if (value.constructor === typeConstructor) {
    return true;
  }
  return objectToString.call(value) === typeStringified;
}
function isUint8Array(value) {
  return isType(value, Uint8Array, uint8ArrayStringified);
}
function isArrayBuffer(value) {
  return isType(value, ArrayBuffer, arrayBufferStringified);
}
function isUint8ArrayOrArrayBuffer(value) {
  return isUint8Array(value) || isArrayBuffer(value);
}
function assertUint8Array(value) {
  if (!isUint8Array(value)) {
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof value}\``);
  }
}
function assertUint8ArrayOrArrayBuffer(value) {
  if (!isUint8ArrayOrArrayBuffer(value)) {
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof value}\``);
  }
}
function concatUint8Arrays(arrays, totalLength) {
  if (arrays.length === 0) {
    return new Uint8Array(0);
  }
  totalLength ??= arrays.reduce((accumulator, currentValue) => accumulator + currentValue.length, 0);
  const returnValue = new Uint8Array(totalLength);
  let offset = 0;
  for (const array of arrays) {
    assertUint8Array(array);
    returnValue.set(array, offset);
    offset += array.length;
  }
  return returnValue;
}
var cachedDecoders = {
  utf8: new globalThis.TextDecoder("utf8")
};
function uint8ArrayToString(array, encoding = "utf8") {
  assertUint8ArrayOrArrayBuffer(array);
  cachedDecoders[encoding] ??= new globalThis.TextDecoder(encoding);
  return cachedDecoders[encoding].decode(array);
}
function assertString(value) {
  if (typeof value !== "string") {
    throw new TypeError(`Expected \`string\`, got \`${typeof value}\``);
  }
}
var cachedEncoder = new globalThis.TextEncoder;
function stringToUint8Array(string) {
  assertString(string);
  return cachedEncoder.encode(string);
}
var byteToHexLookupTable = Array.from({ length: 256 }, (_, index) => index.toString(16).padStart(2, "0"));

// node_modules/conf/dist/source/index.js
var ajvFormats = import_ajv_formats.default.default;
var encryptionAlgorithm = "aes-256-cbc";
var createPlainObject = () => Object.create(null);
var isExist = (data) => data !== undefined && data !== null;
var checkValueType = (key, value) => {
  const nonJsonTypes = new Set([
    "undefined",
    "symbol",
    "function"
  ]);
  const type = typeof value;
  if (nonJsonTypes.has(type)) {
    throw new TypeError(`Setting a value of type \`${type}\` for key \`${key}\` is not allowed as it's not supported by JSON`);
  }
};
var INTERNAL_KEY = "__internal__";
var MIGRATION_KEY = `${INTERNAL_KEY}.migrations.version`;

class Conf {
  path;
  events;
  #validator;
  #encryptionKey;
  #options;
  #defaultValues = {};
  constructor(partialOptions = {}) {
    const options = {
      configName: "config",
      fileExtension: "json",
      projectSuffix: "nodejs",
      clearInvalidConfig: false,
      accessPropertiesByDotNotation: true,
      configFileMode: 438,
      ...partialOptions
    };
    if (!options.cwd) {
      if (!options.projectName) {
        throw new Error("Please specify the `projectName` option.");
      }
      options.cwd = envPaths(options.projectName, { suffix: options.projectSuffix }).config;
    }
    this.#options = options;
    if (options.schema ?? options.ajvOptions ?? options.rootSchema) {
      if (options.schema && typeof options.schema !== "object") {
        throw new TypeError("The `schema` option must be an object.");
      }
      const ajv = new import__2020.Ajv2020({
        allErrors: true,
        useDefaults: true,
        ...options.ajvOptions
      });
      ajvFormats(ajv);
      const schema = {
        ...options.rootSchema,
        type: "object",
        properties: options.schema
      };
      this.#validator = ajv.compile(schema);
      for (const [key, value] of Object.entries(options.schema ?? {})) {
        if (value?.default) {
          this.#defaultValues[key] = value.default;
        }
      }
    }
    if (options.defaults) {
      this.#defaultValues = {
        ...this.#defaultValues,
        ...options.defaults
      };
    }
    if (options.serialize) {
      this._serialize = options.serialize;
    }
    if (options.deserialize) {
      this._deserialize = options.deserialize;
    }
    this.events = new EventTarget;
    this.#encryptionKey = options.encryptionKey;
    const fileExtension = options.fileExtension ? `.${options.fileExtension}` : "";
    this.path = path8.resolve(options.cwd, `${options.configName ?? "config"}${fileExtension}`);
    const fileStore = this.store;
    const store = Object.assign(createPlainObject(), options.defaults, fileStore);
    if (options.migrations) {
      if (!options.projectVersion) {
        throw new Error("Please specify the `projectVersion` option.");
      }
      this._migrate(options.migrations, options.projectVersion, options.beforeEachMigration);
    }
    this._validate(store);
    try {
      assert.deepEqual(fileStore, store);
    } catch {
      this.store = store;
    }
    if (options.watch) {
      this._watch();
    }
  }
  get(key, defaultValue) {
    if (this.#options.accessPropertiesByDotNotation) {
      return this._get(key, defaultValue);
    }
    const { store } = this;
    return key in store ? store[key] : defaultValue;
  }
  set(key, value) {
    if (typeof key !== "string" && typeof key !== "object") {
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof key}`);
    }
    if (typeof key !== "object" && value === undefined) {
      throw new TypeError("Use `delete()` to clear values");
    }
    if (this._containsReservedKey(key)) {
      throw new TypeError(`Please don't use the ${INTERNAL_KEY} key, as it's used to manage this module internal operations.`);
    }
    const { store } = this;
    const set = (key2, value2) => {
      checkValueType(key2, value2);
      if (this.#options.accessPropertiesByDotNotation) {
        setProperty(store, key2, value2);
      } else {
        store[key2] = value2;
      }
    };
    if (typeof key === "object") {
      const object = key;
      for (const [key2, value2] of Object.entries(object)) {
        set(key2, value2);
      }
    } else {
      set(key, value);
    }
    this.store = store;
  }
  has(key) {
    if (this.#options.accessPropertiesByDotNotation) {
      return hasProperty(this.store, key);
    }
    return key in this.store;
  }
  reset(...keys) {
    for (const key of keys) {
      if (isExist(this.#defaultValues[key])) {
        this.set(key, this.#defaultValues[key]);
      }
    }
  }
  delete(key) {
    const { store } = this;
    if (this.#options.accessPropertiesByDotNotation) {
      deleteProperty(store, key);
    } else {
      delete store[key];
    }
    this.store = store;
  }
  clear() {
    this.store = createPlainObject();
    for (const key of Object.keys(this.#defaultValues)) {
      this.reset(key);
    }
  }
  onDidChange(key, callback) {
    if (typeof key !== "string") {
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof key}`);
    }
    if (typeof callback !== "function") {
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof callback}`);
    }
    return this._handleChange(() => this.get(key), callback);
  }
  onDidAnyChange(callback) {
    if (typeof callback !== "function") {
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof callback}`);
    }
    return this._handleChange(() => this.store, callback);
  }
  get size() {
    return Object.keys(this.store).length;
  }
  get store() {
    try {
      const data = fs6.readFileSync(this.path, this.#encryptionKey ? null : "utf8");
      const dataString = this._encryptData(data);
      const deserializedData = this._deserialize(dataString);
      this._validate(deserializedData);
      return Object.assign(createPlainObject(), deserializedData);
    } catch (error) {
      if (error?.code === "ENOENT") {
        this._ensureDirectory();
        return createPlainObject();
      }
      if (this.#options.clearInvalidConfig && error.name === "SyntaxError") {
        return createPlainObject();
      }
      throw error;
    }
  }
  set store(value) {
    this._ensureDirectory();
    this._validate(value);
    this._write(value);
    this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [key, value] of Object.entries(this.store)) {
      yield [key, value];
    }
  }
  _encryptData(data) {
    if (!this.#encryptionKey) {
      return typeof data === "string" ? data : uint8ArrayToString(data);
    }
    try {
      const initializationVector = data.slice(0, 16);
      const password = crypto.pbkdf2Sync(this.#encryptionKey, initializationVector.toString(), 1e4, 32, "sha512");
      const decipher = crypto.createDecipheriv(encryptionAlgorithm, password, initializationVector);
      const slice = data.slice(17);
      const dataUpdate = typeof slice === "string" ? stringToUint8Array(slice) : slice;
      return uint8ArrayToString(concatUint8Arrays([decipher.update(dataUpdate), decipher.final()]));
    } catch {}
    return data.toString();
  }
  _handleChange(getter, callback) {
    let currentValue = getter();
    const onChange = () => {
      const oldValue = currentValue;
      const newValue = getter();
      if (isDeepStrictEqual(newValue, oldValue)) {
        return;
      }
      currentValue = newValue;
      callback.call(this, newValue, oldValue);
    };
    this.events.addEventListener("change", onChange);
    return () => {
      this.events.removeEventListener("change", onChange);
    };
  }
  _deserialize = (value) => JSON.parse(value);
  _serialize = (value) => JSON.stringify(value, undefined, "\t");
  _validate(data) {
    if (!this.#validator) {
      return;
    }
    const valid = this.#validator(data);
    if (valid || !this.#validator.errors) {
      return;
    }
    const errors = this.#validator.errors.map(({ instancePath, message = "" }) => `\`${instancePath.slice(1)}\` ${message}`);
    throw new Error("Config schema violation: " + errors.join("; "));
  }
  _ensureDirectory() {
    fs6.mkdirSync(path8.dirname(this.path), { recursive: true });
  }
  _write(value) {
    let data = this._serialize(value);
    if (this.#encryptionKey) {
      const initializationVector = crypto.randomBytes(16);
      const password = crypto.pbkdf2Sync(this.#encryptionKey, initializationVector.toString(), 1e4, 32, "sha512");
      const cipher = crypto.createCipheriv(encryptionAlgorithm, password, initializationVector);
      data = concatUint8Arrays([initializationVector, stringToUint8Array(":"), cipher.update(stringToUint8Array(data)), cipher.final()]);
    }
    if (process7.env.SNAP) {
      fs6.writeFileSync(this.path, data, { mode: this.#options.configFileMode });
    } else {
      try {
        writeFileSync(this.path, data, { mode: this.#options.configFileMode });
      } catch (error) {
        if (error?.code === "EXDEV") {
          fs6.writeFileSync(this.path, data, { mode: this.#options.configFileMode });
          return;
        }
        throw error;
      }
    }
  }
  _watch() {
    this._ensureDirectory();
    if (!fs6.existsSync(this.path)) {
      this._write(createPlainObject());
    }
    if (process7.platform === "win32") {
      fs6.watch(this.path, { persistent: false }, debounce_fn_default(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
    } else {
      fs6.watchFile(this.path, { persistent: false }, debounce_fn_default(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 5000 }));
    }
  }
  _migrate(migrations, versionToMigrate, beforeEachMigration) {
    let previousMigratedVersion = this._get(MIGRATION_KEY, "0.0.0");
    const newerVersions = Object.keys(migrations).filter((candidateVersion) => this._shouldPerformMigration(candidateVersion, previousMigratedVersion, versionToMigrate));
    let storeBackup = { ...this.store };
    for (const version of newerVersions) {
      try {
        if (beforeEachMigration) {
          beforeEachMigration(this, {
            fromVersion: previousMigratedVersion,
            toVersion: version,
            finalVersion: versionToMigrate,
            versions: newerVersions
          });
        }
        const migration = migrations[version];
        migration?.(this);
        this._set(MIGRATION_KEY, version);
        previousMigratedVersion = version;
        storeBackup = { ...this.store };
      } catch (error) {
        this.store = storeBackup;
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${error}`);
      }
    }
    if (this._isVersionInRangeFormat(previousMigratedVersion) || !import_semver.default.eq(previousMigratedVersion, versionToMigrate)) {
      this._set(MIGRATION_KEY, versionToMigrate);
    }
  }
  _containsReservedKey(key) {
    if (typeof key === "object") {
      const firsKey = Object.keys(key)[0];
      if (firsKey === INTERNAL_KEY) {
        return true;
      }
    }
    if (typeof key !== "string") {
      return false;
    }
    if (this.#options.accessPropertiesByDotNotation) {
      if (key.startsWith(`${INTERNAL_KEY}.`)) {
        return true;
      }
      return false;
    }
    return false;
  }
  _isVersionInRangeFormat(version) {
    return import_semver.default.clean(version) === null;
  }
  _shouldPerformMigration(candidateVersion, previousMigratedVersion, versionToMigrate) {
    if (this._isVersionInRangeFormat(candidateVersion)) {
      if (previousMigratedVersion !== "0.0.0" && import_semver.default.satisfies(previousMigratedVersion, candidateVersion)) {
        return false;
      }
      return import_semver.default.satisfies(versionToMigrate, candidateVersion);
    }
    if (import_semver.default.lte(candidateVersion, previousMigratedVersion)) {
      return false;
    }
    if (import_semver.default.gt(candidateVersion, versionToMigrate)) {
      return false;
    }
    return true;
  }
  _get(key, defaultValue) {
    return getProperty(this.store, key, defaultValue);
  }
  _set(key, value) {
    const { store } = this;
    setProperty(store, key, value);
    this.store = store;
  }
}

// node_modules/jwt-decode/build/esm/index.js
class InvalidTokenError extends Error {
}
InvalidTokenError.prototype.name = "InvalidTokenError";
function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, (m, p) => {
    let code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = "0" + code;
    }
    return "%" + code;
  }));
}
function base64UrlDecode(str) {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("base64 string is not of the correct length");
  }
  try {
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
}
function jwtDecode(token, options) {
  if (typeof token !== "string") {
    throw new InvalidTokenError("Invalid token specified: must be a string");
  }
  options || (options = {});
  const pos = options.header === true ? 0 : 1;
  const part = token.split(".")[pos];
  if (typeof part !== "string") {
    throw new InvalidTokenError(`Invalid token specified: missing part #${pos + 1}`);
  }
  let decoded;
  try {
    decoded = base64UrlDecode(part);
  } catch (e) {
    throw new InvalidTokenError(`Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`);
  }
  try {
    return JSON.parse(decoded);
  } catch (e) {
    throw new InvalidTokenError(`Invalid token specified: invalid json for part #${pos + 1} (${e.message})`);
  }
}

// lib/cli-config/index.ts
import fs8 from "node:fs";
import os3 from "node:os";
import path10 from "node:path";

// lib/shared/handle-registry-auth-error.ts
import fs7 from "node:fs";
import os2 from "node:os";
import path9 from "node:path";

// node_modules/kleur/index.mjs
var FORCE_COLOR;
var NODE_DISABLE_COLORS;
var NO_COLOR;
var TERM;
var isTTY = true;
if (typeof process !== "undefined") {
  ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
  isTTY = process.stdout && process.stdout.isTTY;
}
var $ = {
  enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== "dumb" && (FORCE_COLOR != null && FORCE_COLOR !== "0" || isTTY),
  reset: init(0, 0),
  bold: init(1, 22),
  dim: init(2, 22),
  italic: init(3, 23),
  underline: init(4, 24),
  inverse: init(7, 27),
  hidden: init(8, 28),
  strikethrough: init(9, 29),
  black: init(30, 39),
  red: init(31, 39),
  green: init(32, 39),
  yellow: init(33, 39),
  blue: init(34, 39),
  magenta: init(35, 39),
  cyan: init(36, 39),
  white: init(37, 39),
  gray: init(90, 39),
  grey: init(90, 39),
  bgBlack: init(40, 49),
  bgRed: init(41, 49),
  bgGreen: init(42, 49),
  bgYellow: init(43, 49),
  bgBlue: init(44, 49),
  bgMagenta: init(45, 49),
  bgCyan: init(46, 49),
  bgWhite: init(47, 49)
};
function run(arr, str) {
  let i = 0, tmp, beg = "", end = "";
  for (;i < arr.length; i++) {
    tmp = arr[i];
    beg += tmp.open;
    end += tmp.close;
    if (!!~str.indexOf(tmp.close)) {
      str = str.replace(tmp.rgx, tmp.close + tmp.open);
    }
  }
  return beg + str + end;
}
function chain(has, keys) {
  let ctx = { has, keys };
  ctx.reset = $.reset.bind(ctx);
  ctx.bold = $.bold.bind(ctx);
  ctx.dim = $.dim.bind(ctx);
  ctx.italic = $.italic.bind(ctx);
  ctx.underline = $.underline.bind(ctx);
  ctx.inverse = $.inverse.bind(ctx);
  ctx.hidden = $.hidden.bind(ctx);
  ctx.strikethrough = $.strikethrough.bind(ctx);
  ctx.black = $.black.bind(ctx);
  ctx.red = $.red.bind(ctx);
  ctx.green = $.green.bind(ctx);
  ctx.yellow = $.yellow.bind(ctx);
  ctx.blue = $.blue.bind(ctx);
  ctx.magenta = $.magenta.bind(ctx);
  ctx.cyan = $.cyan.bind(ctx);
  ctx.white = $.white.bind(ctx);
  ctx.gray = $.gray.bind(ctx);
  ctx.grey = $.grey.bind(ctx);
  ctx.bgBlack = $.bgBlack.bind(ctx);
  ctx.bgRed = $.bgRed.bind(ctx);
  ctx.bgGreen = $.bgGreen.bind(ctx);
  ctx.bgYellow = $.bgYellow.bind(ctx);
  ctx.bgBlue = $.bgBlue.bind(ctx);
  ctx.bgMagenta = $.bgMagenta.bind(ctx);
  ctx.bgCyan = $.bgCyan.bind(ctx);
  ctx.bgWhite = $.bgWhite.bind(ctx);
  return ctx;
}
function init(open, close) {
  let blk = {
    open: `\x1B[${open}m`,
    close: `\x1B[${close}m`,
    rgx: new RegExp(`\\x1b\\[${close}m`, "g")
  };
  return function(txt) {
    if (this !== undefined && this.has !== undefined) {
      !!~this.has.indexOf(open) || (this.has.push(open), this.keys.push(blk));
      return txt === undefined ? this : $.enabled ? run(this.keys, txt + "") : txt + "";
    }
    return txt === undefined ? chain([open], [blk]) : $.enabled ? run([blk], txt + "") : txt + "";
  };
}
var kleur_default = $;

// lib/shared/handle-registry-auth-error.ts
var AUTH_TOKEN_REGEX = /^\/\/npm\.tscircuit\.com\/:_authToken=(.+)$/m;
function isUnauthorizedError(error) {
  const output = [
    error instanceof Error ? error.message : "",
    error?.stderr?.toString?.() ?? "",
    error?.stdout?.toString?.() ?? ""
  ].join(`
`);
  const registryErrorMatch = output.match(/error:\s*(\{[\s\S]*?\})/i);
  if (registryErrorMatch) {
    const errorBody = registryErrorMatch[1];
    const errorCode = errorBody.match(/error_code\s*:\s*['"]?([^,'"}\s]+)/i)?.[1] ?? "";
    const message = errorBody.match(/message\s*:\s*['"]?([^'"}]+)/i)?.[1] ?? "";
    if (/unauth|token|auth/i.test(errorCode) || /unauth|token|auth/i.test(message)) {
      return true;
    }
  }
  return /\b(401|E401)\b/i.test(output) || /unauthorized/i.test(output);
}
function hasTsciAuthToken(npmrcPath) {
  if (!fs7.existsSync(npmrcPath))
    return false;
  const content = fs7.readFileSync(npmrcPath, "utf-8");
  return AUTH_TOKEN_REGEX.test(content);
}
function handleRegistryAuthError({
  error,
  projectDir
}) {
  if (!isUnauthorizedError(error))
    return;
  const npmrcPaths = [
    path9.join(projectDir, ".npmrc"),
    path9.join(os2.homedir(), ".npmrc")
  ];
  const hasToken = npmrcPaths.some(hasTsciAuthToken);
  if (hasToken) {
    console.warn(kleur_default.yellow("Your tscircuit session token appears to be missing or expired. Run `tsci auth setup-npmrc` to refresh it before retrying."));
  } else {
    console.warn(kleur_default.yellow("No tscircuit session token is loaded in your .npmrc files. Run `tsci auth setup-npmrc` to add one and retry the install."));
  }
}

// lib/cli-config/index.ts
var getCliConfig = (opts = {}) => {
  return new Conf({
    projectName: "tscircuit",
    cwd: opts.configDir || process.env.TSCIRCUIT_CONFIG_DIR || undefined
  });
};
var cliConfig = getCliConfig();
var getSessionToken = () => {
  return cliConfig.get("sessionToken");
};
var getSessionTokenFromNpmrc = () => {
  const npmrcPaths = [
    path10.join(process.cwd(), ".npmrc"),
    path10.join(os3.homedir(), ".npmrc")
  ];
  for (const npmrcPath of npmrcPaths) {
    if (!fs8.existsSync(npmrcPath))
      continue;
    const content = fs8.readFileSync(npmrcPath, "utf-8");
    const match = content.match(AUTH_TOKEN_REGEX);
    if (match?.[1]) {
      return match[1].trim();
    }
  }
  return;
};
var setSessionToken = (token) => {
  cliConfig.set("sessionToken", token);
  const decoded = jwtDecode(token);
  if (decoded.tscircuit_handle)
    cliConfig.set("tscircuitHandle", decoded.tscircuit_handle);
  if (decoded.account_id)
    cliConfig.set("accountId", decoded.account_id);
  if (decoded.session_id)
    cliConfig.set("sessionId", decoded.session_id);
};
var clearSession = () => {
  cliConfig.clear();
};
var getRegistryApiUrl = () => {
  return cliConfig.get("registryApiUrl") ?? "https://registry-api.tscircuit.com";
};

// lib/shared/get-circuit-json-to-gltf-options.ts
var getCircuitJsonToGltfOptions = ({
  format = "gltf"
}) => {
  const sessionToken = getSessionToken() ?? getSessionTokenFromNpmrc();
  return {
    format,
    projectBaseUrl: getRegistryApiUrl(),
    ...sessionToken ? { authHeaders: { Authorization: `Bearer ${sessionToken}` } } : {}
  };
};

// cli/build/convert-model-urls-to-file-urls.ts
import path11 from "node:path";
import { pathToFileURL as pathToFileURL2 } from "node:url";
var convertModelUrlsToFileUrls = (circuitJson) => {
  const modelUrlKeys2 = [
    "model_glb_url",
    "glb_model_url",
    "model_stl_url",
    "stl_model_url",
    "model_obj_url",
    "obj_model_url",
    "model_gltf_url",
    "gltf_model_url",
    "model_step_url",
    "step_model_url"
  ];
  return circuitJson.map((element) => {
    if (!element || typeof element !== "object")
      return element;
    const updated = { ...element };
    for (const key of modelUrlKeys2) {
      const value = updated[key];
      if (typeof value === "string" && value.length > 0) {
        if (value.match(/^[a-zA-Z]+:\/\//))
          continue;
        if (value.startsWith("/") || value.match(/^[a-zA-Z]:\\/)) {
          updated[key] = pathToFileURL2(value).href;
        } else if (value.startsWith(".")) {
          updated[key] = pathToFileURL2(path11.resolve(process.cwd(), value)).href;
        }
      }
    }
    return updated;
  });
};

// cli/build/worker-binary-utils.ts
var viewToArrayBuffer2 = (view) => {
  const copy = new Uint8Array(view.byteLength);
  copy.set(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
  return copy.buffer;
};
var normalizeToUint8Array2 = (value) => {
  if (value instanceof Uint8Array) {
    return value;
  }
  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(viewToArrayBuffer2(value));
  }
  throw new Error("Expected Uint8Array, ArrayBuffer, or ArrayBufferView for binary data");
};

// cli/build/svg-to-png.ts
import { Resvg } from "@resvg/resvg-js";
var convertSvgToPngBuffer = async (svg) => {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "original"
    }
  });
  return resvg.render().asPng();
};

// lib/shared/load-local-step-model-fs-map.ts
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path12 from "node:path";
var isRemoteUrl = (value) => /^https?:\/\//i.test(value);
async function loadLocalStepModelFsMap(circuitJson) {
  const fsMap = {};
  for (const element of circuitJson) {
    if (!element || typeof element !== "object")
      continue;
    const modelUrl = element.model_step_url;
    if (typeof modelUrl !== "string" || modelUrl.length === 0)
      continue;
    if (isRemoteUrl(modelUrl) || fsMap[modelUrl])
      continue;
    const localPath = path12.resolve(process.cwd(), modelUrl);
    if (!existsSync(localPath))
      continue;
    fsMap[modelUrl] = await readFile(localPath, "utf-8");
  }
  return fsMap;
}

// lib/shared/simulation-svg-assets.ts
import {
  convertCircuitJsonToSchematicSimulationSvg,
  convertCircuitJsonToSimulationGraphSvg,
  isSimulationExperiment,
  isSimulationTransientVoltageGraph
} from "circuit-to-svg";
var isSimulationTransientCurrentGraph = (element) => element.type === "simulation_transient_current_graph";
var getSimulationSvgInputs = (circuitJson) => {
  const simulationExperiment = circuitJson.find(isSimulationExperiment);
  if (!simulationExperiment)
    return;
  const simulationTransientCurrentGraphIds = circuitJson.filter((element) => isSimulationTransientCurrentGraph(element) && element.simulation_experiment_id === simulationExperiment.simulation_experiment_id).map((element) => element.simulation_transient_current_graph_id);
  const simulationTransientVoltageGraphIds = circuitJson.filter((element) => isSimulationTransientVoltageGraph(element) && element.simulation_experiment_id === simulationExperiment.simulation_experiment_id).map((element) => element.simulation_transient_voltage_graph_id);
  if (simulationTransientCurrentGraphIds.length === 0 && simulationTransientVoltageGraphIds.length === 0) {
    return;
  }
  return {
    simulation_experiment_id: simulationExperiment.simulation_experiment_id,
    simulation_transient_current_graph_ids: simulationTransientCurrentGraphIds,
    simulation_transient_voltage_graph_ids: simulationTransientVoltageGraphIds
  };
};
var getSimulationSvgAssetsFromCircuitJson = (circuitJson) => {
  const simulationSvgInputs = getSimulationSvgInputs(circuitJson);
  if (!simulationSvgInputs)
    return;
  return {
    simulationSvg: convertCircuitJsonToSimulationGraphSvg({
      circuitJson,
      ...simulationSvgInputs
    }),
    schematicSimulationSvg: convertCircuitJsonToSchematicSimulationSvg({
      circuitJson,
      ...simulationSvgInputs
    })
  };
};

// cli/build/worker-output-generators.ts
var writeSimulationSvgAssetsFromCircuitJson = (circuitJson, outputDir, imageFormats) => {
  if (!imageFormats.simulationSvgs && !imageFormats.simulationSchematicSvgs) {
    return false;
  }
  const simulationSvgAssets = getSimulationSvgAssetsFromCircuitJson(circuitJson);
  if (!simulationSvgAssets)
    return false;
  if (imageFormats.simulationSvgs) {
    fs9.writeFileSync(path13.join(outputDir, "simulation.svg"), simulationSvgAssets.simulationSvg, "utf-8");
  }
  if (imageFormats.simulationSchematicSvgs) {
    fs9.writeFileSync(path13.join(outputDir, "simulation-schematic.svg"), simulationSvgAssets.schematicSimulationSvg, "utf-8");
  }
  return true;
};
var writeGlbFromCircuitJson = async (circuitJson, glbOutputPath) => {
  const circuitJsonWithFileUrls = convertModelUrlsToFileUrls(circuitJson);
  const glbBuffer = await convertCircuitJsonToGltf(circuitJsonWithFileUrls, getCircuitJsonToGltfOptions({ format: "glb" }));
  const glbData = normalizeToUint8Array2(glbBuffer);
  fs9.mkdirSync(path13.dirname(glbOutputPath), { recursive: true });
  fs9.writeFileSync(glbOutputPath, Buffer.from(glbData));
};
var writeStepFromCircuitJson = async (circuitJson, stepOutputPath) => {
  const stepContent = await circuitJsonToStep(circuitJson, {
    includeComponents: true,
    includeExternalMeshes: true,
    fsMap: await loadLocalStepModelFsMap(circuitJson)
  });
  fs9.mkdirSync(path13.dirname(stepOutputPath), { recursive: true });
  fs9.writeFileSync(stepOutputPath, stepContent);
};
var writeImageAssetsFromCircuitJson = async (circuitJson, options) => {
  const { outputDir, imageFormats, pcbSnapshotSettings } = options;
  fs9.mkdirSync(outputDir, { recursive: true });
  if (imageFormats.pcbSvgs) {
    const pcbSvg = convertCircuitJsonToPcbSvg(circuitJson, pcbSnapshotSettings);
    fs9.writeFileSync(path13.join(outputDir, "pcb.svg"), pcbSvg, "utf-8");
  }
  if (imageFormats.pcbPngs) {
    const pcbSvg = convertCircuitJsonToPcbSvg(circuitJson, pcbSnapshotSettings);
    fs9.writeFileSync(path13.join(outputDir, "pcb.png"), await convertSvgToPngBuffer(pcbSvg));
  }
  if (imageFormats.schematicSvgs) {
    const schematicSvg = convertCircuitJsonToSchematicSvg(circuitJson);
    fs9.writeFileSync(path13.join(outputDir, "schematic.svg"), schematicSvg, "utf-8");
  }
  writeSimulationSvgAssetsFromCircuitJson(circuitJson, outputDir, imageFormats);
  if (imageFormats.threeDPngs) {
    const pngBuffer = await renderCircuitJsonTo3dPng(circuitJson);
    fs9.writeFileSync(path13.join(outputDir, "3d.png"), Buffer.from(pngBuffer));
  }
};

// cli/build/worker-build-handlers.ts
var loadCircuitJsonFromInputFile = (filePath) => {
  const parsed = JSON.parse(fs10.readFileSync(filePath, "utf-8"));
  return Array.isArray(parsed) ? parsed : [];
};
var handleBuildFile = async (filePath, outputPath, glbOutputPath, stepOutputPath, previewOutputDir, projectDir, options, workerLog, workerStatus) => {
  const errors = [];
  const warnings = [];
  const startedAt = options?.profile ? performance.now() : 0;
  try {
    process.chdir(projectDir);
    workerLog(`Generating circuit JSON for ${path14.relative(projectDir, filePath)}...`);
    await registerStaticAssetLoaders();
    const platformConfigWithCliDefaults = getPlatformConfigWithCliDefaults(options?.platformConfig);
    const normalizedInputPath = filePath.toLowerCase().replaceAll("\\", "/");
    const isPrebuiltCircuitJson = normalizedInputPath.endsWith(".circuit.json") || normalizedInputPath.endsWith("/circuit.json");
    const circuitJson = isPrebuiltCircuitJson ? loadCircuitJsonFromInputFile(filePath) : (await generateCircuitJson({
      filePath,
      platformConfig: platformConfigWithCliDefaults,
      injectedProps: options?.injectedProps,
      onAsyncEffectStatus: (asyncEffectName) => {
        workerStatus(`waiting on ${asyncEffectName}…`);
      }
    })).circuitJson;
    fs10.mkdirSync(path14.dirname(outputPath), { recursive: true });
    fs10.writeFileSync(outputPath, JSON.stringify(circuitJson, null, 2));
    workerLog(`Circuit JSON written to ${path14.relative(projectDir, outputPath)}`);
    const diagnostics = analyzeCircuitJson(circuitJson);
    const filteredDiagnostics = filterDiagnosticsByDrcCategory({
      errors: diagnostics.errors,
      warnings: diagnostics.warnings,
      ignoreOptions: options
    });
    if (!options?.ignoreWarnings) {
      for (const warn of filteredDiagnostics.warnings) {
        const msg = warn.message || JSON.stringify(warn);
        warnings.push(msg);
        workerLog(`Warning: ${msg}`);
      }
    }
    if (!options?.ignoreErrors) {
      for (const err of filteredDiagnostics.errors) {
        const msg = err.message || JSON.stringify(err);
        errors.push(msg);
        workerLog(`Error: ${msg}`);
      }
    }
    const hasErrors = filteredDiagnostics.errors.length > 0 && !options?.ignoreErrors;
    let glbOk;
    let glbError;
    let stepOk;
    let stepError;
    let previewOk;
    let previewError;
    if (glbOutputPath) {
      try {
        workerLog(`Converting ${path14.relative(projectDir, outputPath)} to GLB in same worker...`);
        await writeGlbFromCircuitJson(circuitJson, glbOutputPath);
        glbOk = true;
      } catch (err) {
        glbOk = false;
        glbError = err instanceof Error ? err.message : String(err);
        workerLog(`GLB conversion error: ${glbError}`);
      }
    }
    if (stepOutputPath) {
      try {
        workerLog(`Converting ${path14.relative(projectDir, outputPath)} to STEP in same worker...`);
        await writeStepFromCircuitJson(circuitJson, stepOutputPath);
        stepOk = true;
      } catch (err) {
        stepOk = false;
        stepError = err instanceof Error ? err.message : String(err);
        workerLog(`STEP conversion error: ${stepError}`);
      }
    }
    if (options?.generatePreviewAssets) {
      try {
        const resolvedPreviewOutputDir = previewOutputDir ?? path14.dirname(outputPath);
        workerLog(`Generating preview assets for ${path14.relative(projectDir, resolvedPreviewOutputDir)} in same worker...`);
        await writeImageAssetsFromCircuitJson(circuitJson, {
          outputDir: resolvedPreviewOutputDir,
          imageFormats: options?.imageFormats ?? DEFAULT_IMAGE_FORMAT_SELECTION,
          pcbSnapshotSettings: options?.pcbSnapshotSettings
        });
        previewOk = true;
      } catch (err) {
        previewOk = false;
        previewError = err instanceof Error ? err.message : String(err);
        workerLog(`Preview generation error: ${previewError}`);
      }
    }
    return {
      message_type: "build_completed",
      file_path: filePath,
      output_path: outputPath,
      circuit_json_path: outputPath,
      glb_output_path: glbOutputPath,
      step_output_path: stepOutputPath,
      preview_output_dir: previewOutputDir,
      glb_ok: glbOk,
      glb_error: glbError,
      step_ok: stepOk,
      step_error: stepError,
      preview_ok: previewOk,
      preview_error: previewError,
      ok: true,
      hasErrors,
      ignoredDrcCount: filteredDiagnostics.ignoredCount,
      ignoredDrcByCategory: filteredDiagnostics.ignoredByCategory,
      errors,
      warnings,
      durationMs: options?.profile ? performance.now() - startedAt : undefined
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    errors.push(errorMsg);
    workerLog(`Build error: ${errorMsg}`);
    return {
      message_type: "build_completed",
      file_path: filePath,
      output_path: outputPath,
      circuit_json_path: outputPath,
      glb_output_path: glbOutputPath,
      step_output_path: stepOutputPath,
      preview_output_dir: previewOutputDir,
      ok: false,
      hasErrors: true,
      isFatalError: {
        errorType: "circuit_generation_failed",
        message: errorMsg
      },
      errors,
      warnings,
      durationMs: options?.profile ? performance.now() - startedAt : undefined
    };
  } finally {
    workerStatus(null);
  }
};

// cli/build/build.worker.ts
if (!parentPort) {
  throw new Error("This file must be run as a worker thread");
}
var sendMessage = (message) => {
  parentPort.postMessage(message);
};
var workerLog = (...args) => {
  const line = args.map((arg) => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" ");
  sendMessage({
    message_type: "worker_log",
    log_lines: [line]
  });
};
var workerStatus = (statusLine) => {
  sendMessage({
    message_type: "worker_log",
    log_lines: [],
    status_line: statusLine
  });
};
parentPort.on("message", async (msg) => {
  if (msg.message_type === "build_file") {
    const result = await handleBuildFile(msg.file_path, msg.output_path, msg.glb_output_path, msg.step_output_path, msg.preview_output_dir, msg.project_dir, msg.options, workerLog, workerStatus);
    sendMessage(result);
  }
});
