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

// cli/snapshot/snapshot.worker.ts
import { parentPort } from "node:worker_threads";

// lib/shared/process-snapshot-file.ts
import fs6 from "node:fs";
import path5 from "node:path";

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

// lib/shared/process-snapshot-file.ts
import {
  convertCircuitJsonToPcbSvg,
  convertCircuitJsonToSchematicSvg
} from "circuit-to-svg";

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

// lib/shared/compare-images.ts
import looksSame from "@tscircuit/image-utils/looks-same";
import fs5 from "node:fs/promises";
var compareAndCreateDiff = async (buffer1, buffer2, diffPath, createDiff = true) => {
  const b1 = Buffer.from(buffer1);
  const b2 = Buffer.from(buffer2);
  const { equal } = await looksSame(b1, b2, {
    strict: false,
    tolerance: 2
  });
  if (!equal && createDiff) {
    if (diffPath.endsWith(".png")) {
      const diffBuffer = await looksSame.createDiff({
        reference: b1,
        current: b2,
        highlightColor: "#ff00ff",
        tolerance: 2
      });
      await fs5.writeFile(diffPath, diffBuffer);
    } else {
      await fs5.writeFile(diffPath, buffer2);
    }
  }
  return { equal };
};

// lib/shared/is-circuit-json-file.ts
var isCircuitJsonFile = (filePath) => {
  const normalizedPath = filePath.toLowerCase().replaceAll("\\", "/");
  return normalizedPath.endsWith(".circuit.json") || normalizedPath.endsWith("/circuit.json");
};

// lib/shared/process-snapshot-file.ts
var processSnapshotFile = async ({
  file,
  projectDir,
  snapshotsDirName,
  update,
  threeD,
  pcbOnly,
  schematicOnly,
  simulationOnly,
  forceUpdate,
  platformConfig,
  pcbSnapshotSettings,
  createDiff,
  cameraPreset,
  pcbLayer
}) => {
  const relativeFilePath = path5.relative(projectDir, file);
  const successPaths = [];
  const warningMessages = [];
  const mismatches = [];
  let didUpdate = false;
  let circuitJson;
  let pcbSvg;
  let schSvg;
  let simulationSvgAssets;
  try {
    if (isCircuitJsonFile(file)) {
      const parsed = JSON.parse(fs6.readFileSync(file, "utf-8"));
      circuitJson = Array.isArray(parsed) ? parsed : [];
    } else {
      const platformConfigWithCliDefaults = getPlatformConfigWithCliDefaults(platformConfig);
      const result = await generateCircuitJson({
        filePath: file,
        platformConfig: platformConfigWithCliDefaults
      });
      circuitJson = result.circuitJson;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      didUpdate: false,
      successPaths,
      warningMessages,
      mismatches,
      errorMessage: kleur_default.red(`
❌ Failed to generate circuit JSON for ${relativeFilePath}:
`) + kleur_default.red(`   ${errorMessage}
`)
    };
  }
  if (!simulationOnly) {
    try {
      pcbSvg = convertCircuitJsonToPcbSvg(circuitJson, {
        ...pcbSnapshotSettings,
        layer: pcbLayer
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        ok: false,
        didUpdate: false,
        successPaths,
        warningMessages,
        mismatches,
        errorMessage: kleur_default.red(`
❌ Failed to generate PCB SVG for ${relativeFilePath}:
`) + kleur_default.red(`   ${errorMessage}
`)
      };
    }
    try {
      schSvg = convertCircuitJsonToSchematicSvg(circuitJson);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        ok: false,
        didUpdate: false,
        successPaths,
        warningMessages,
        mismatches,
        errorMessage: kleur_default.red(`
❌ Failed to generate schematic SVG for ${relativeFilePath}:
`) + kleur_default.red(`   ${errorMessage}
`)
      };
    }
  }
  try {
    simulationSvgAssets = getSimulationSvgAssetsFromCircuitJson(circuitJson);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      didUpdate: false,
      successPaths,
      warningMessages,
      mismatches,
      errorMessage: kleur_default.red(`
❌ Failed to generate simulation SVGs for ${relativeFilePath}:
`) + kleur_default.red(`   ${errorMessage}
`)
    };
  }
  let png3d = null;
  if (threeD && !simulationOnly) {
    try {
      png3d = await renderCircuitJsonTo3dPng(circuitJson, { cameraPreset });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("No pcb_board found in circuit JSON")) {
        const fileDir = path5.dirname(file);
        const relativeDir = path5.relative(projectDir, fileDir);
        const snapDir2 = snapshotsDirName ? path5.join(projectDir, snapshotsDirName, relativeDir) : path5.join(fileDir, "__snapshots__");
        const base2 = path5.basename(file).replace(/\.[^.]+$/, "");
        const snap3dPath = path5.join(snapDir2, `${base2}-3d.snap.png`);
        const existing3dSnapshot = fs6.existsSync(snap3dPath);
        if (existing3dSnapshot) {
          return {
            ok: false,
            didUpdate: false,
            successPaths,
            warningMessages,
            mismatches,
            errorMessage: kleur_default.red(`
❌ Failed to generate 3D snapshot for ${relativeFilePath}:
`) + kleur_default.red(`   No pcb_board found in circuit JSON
`) + kleur_default.red(`   Existing snapshot: ${path5.relative(projectDir, snap3dPath)}
`)
          };
        }
        warningMessages.push(kleur_default.red(`⚠️  Skipping 3D snapshot for ${relativeFilePath}:`) + kleur_default.red(` No pcb_board found in circuit JSON`));
        png3d = null;
      } else {
        return {
          ok: false,
          didUpdate: false,
          successPaths,
          warningMessages,
          mismatches,
          errorMessage: kleur_default.red(`
❌ Failed to generate 3D snapshot for ${relativeFilePath}:
`) + kleur_default.red(`   ${errorMessage}
`)
        };
      }
    }
  }
  const snapDir = snapshotsDirName ? path5.join(projectDir, snapshotsDirName, path5.relative(projectDir, path5.dirname(file))) : path5.join(path5.dirname(file), "__snapshots__");
  fs6.mkdirSync(snapDir, { recursive: true });
  const base = path5.basename(file).replace(/\.[^.]+$/, "");
  const snapshots = [];
  if (!simulationOnly && (pcbOnly || !schematicOnly)) {
    let pcbSnapshotType = "pcb";
    if (pcbLayer) {
      pcbSnapshotType = pcbLayer;
    }
    snapshots.push({
      type: pcbSnapshotType,
      content: pcbSvg,
      isBinary: false
    });
  }
  if (!simulationOnly && (schematicOnly || !pcbOnly)) {
    snapshots.push({ type: "schematic", content: schSvg, isBinary: false });
  }
  if (threeD && png3d) {
    snapshots.push({ type: "3d", content: png3d, isBinary: true });
  }
  if ((simulationOnly || !pcbOnly && !schematicOnly) && simulationSvgAssets) {
    snapshots.push({
      type: "simulation",
      content: simulationSvgAssets.simulationSvg,
      isBinary: false
    });
    snapshots.push({
      type: "schematic-simulation",
      content: simulationSvgAssets.schematicSimulationSvg,
      isBinary: false
    });
  }
  for (const snapshot of snapshots) {
    const { type } = snapshot;
    const is3d = type === "3d";
    const snapPath = path5.join(snapDir, `${base}-${type}.snap.${is3d ? "png" : "svg"}`);
    const existing = fs6.existsSync(snapPath);
    const newContentBuffer = snapshot.isBinary ? snapshot.content : Buffer.from(snapshot.content, "utf8");
    const newContentForFile = snapshot.content;
    if (!existing) {
      fs6.writeFileSync(snapPath, newContentForFile);
      successPaths.push(path5.relative(projectDir, snapPath));
      didUpdate = true;
      continue;
    }
    const oldContentBuffer = fs6.readFileSync(snapPath);
    let equal;
    let diffPath;
    if (createDiff) {
      diffPath = snapPath.replace(is3d ? ".snap.png" : ".snap.svg", is3d ? ".diff.png" : ".diff.svg");
      const comparison = await compareAndCreateDiff(oldContentBuffer, newContentBuffer, diffPath, true);
      equal = comparison.equal;
    } else {
      equal = oldContentBuffer.equals(newContentBuffer);
    }
    if (update) {
      if (!forceUpdate && equal) {
        successPaths.push(path5.relative(projectDir, snapPath));
      } else {
        fs6.writeFileSync(snapPath, newContentForFile);
        successPaths.push(path5.relative(projectDir, snapPath));
        didUpdate = true;
      }
    } else if (!equal) {
      mismatches.push(diffPath ? `${snapPath} (diff: ${diffPath})` : snapPath);
    } else {
      successPaths.push(path5.relative(projectDir, snapPath));
    }
  }
  return {
    ok: true,
    didUpdate,
    successPaths,
    warningMessages,
    mismatches
  };
};

// lib/project-config/index.ts
import * as fs7 from "node:fs";
import * as path6 from "node:path";
import { pathToFileURL as pathToFileURL2 } from "node:url";

// lib/project-config/project-config-schema.ts
import { z } from "zod";
var pcbSnapshotSettingsSchema = z.object({
  showCourtyards: z.boolean().optional(),
  showPcbNotes: z.boolean().optional(),
  showFabricationNotes: z.boolean().optional()
});
var projectConfigSchema = z.object({
  mainEntrypoint: z.string().optional(),
  libraryEntrypoint: z.string().optional(),
  previewComponentPath: z.string().optional(),
  siteDefaultComponentPath: z.string().optional(),
  ignoredFiles: z.array(z.string()).optional(),
  includeBoardFiles: z.array(z.string()).optional(),
  snapshotsDir: z.string().optional(),
  pcbSnapshotSettings: pcbSnapshotSettingsSchema.optional(),
  prebuildCommand: z.string().optional(),
  buildCommand: z.string().optional(),
  kicadProjectEntrypointPath: z.string().optional(),
  kicadLibraryEntrypointPath: z.string().optional(),
  kicadLibraryName: z.string().optional(),
  alwaysUseLatestTscircuitOnCloud: z.boolean().optional(),
  build: z.object({
    circuitJson: z.boolean().optional(),
    kicadProject: z.boolean().optional(),
    kicadLibrary: z.boolean().optional(),
    kicadPcm: z.boolean().optional(),
    previewImages: z.boolean().optional(),
    glbs: z.boolean().optional(),
    step: z.boolean().optional(),
    workerTimeoutMs: z.number().int().positive().optional(),
    routingDisabled: z.boolean().optional(),
    typescriptLibrary: z.boolean().optional()
  }).optional()
});

// lib/project-config/index.ts
var CONFIG_FILENAME = "tscircuit.config.json";
var CONFIG_MODULE_FILENAMES = [
  "tscircuit.config.ts",
  "tscircuit.config.js"
];
var ENV_FILENAMES = [".env", ".env.local"];
var CONFIG_SCHEMA_URL = "https://cdn.jsdelivr.net/npm/@tscircuit/cli/types/tscircuit.config.schema.json";
var DEFAULT_BOARD_FILE_PATTERNS = [
  "**/*.board.tsx",
  "**/*.circuit.tsx",
  "**/*.circuit.json"
];
var parseProjectConfigObject = (config) => {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("tscircuit config must export an object");
  }
  const { platformConfig, ...serializableConfig } = config;
  const parsedConfig = projectConfigSchema.parse(serializableConfig);
  if (platformConfig === undefined) {
    return parsedConfig;
  }
  return {
    ...parsedConfig,
    platformConfig
  };
};
var stripWrappingQuotes = (value) => {
  if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1);
  }
  return value;
};
var loadProjectEnv = (projectDir) => {
  const initialEnvKeys = new Set(Object.keys(process.env));
  for (const envFileName of ENV_FILENAMES) {
    const envPath = path6.join(projectDir, envFileName);
    if (!fs7.existsSync(envPath))
      continue;
    const envContent = fs7.readFileSync(envPath, "utf8");
    for (const rawLine of envContent.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#"))
        continue;
      const lineWithoutExport = line.startsWith("export ") ? line.slice("export ".length) : line;
      const separatorIndex = lineWithoutExport.indexOf("=");
      if (separatorIndex <= 0)
        continue;
      const key = lineWithoutExport.slice(0, separatorIndex).trim();
      if (!key || initialEnvKeys.has(key))
        continue;
      const value = stripWrappingQuotes(lineWithoutExport.slice(separatorIndex + 1).trim());
      process.env[key] = value;
    }
  }
};
var loadProjectConfigSync = (projectDir = process.cwd()) => {
  const configPath = path6.join(projectDir, CONFIG_FILENAME);
  if (!fs7.existsSync(configPath)) {
    return null;
  }
  try {
    const configContent = fs7.readFileSync(configPath, "utf8");
    const parsedConfig = JSON.parse(configContent);
    return projectConfigSchema.parse(parsedConfig);
  } catch (error) {
    console.error(`Error loading tscircuit config: ${error}`);
    return null;
  }
};
var loadProjectConfigModule = async (projectDir) => {
  loadProjectEnv(projectDir);
  for (const configFileName of CONFIG_MODULE_FILENAMES) {
    const configPath = path6.join(projectDir, configFileName);
    if (!fs7.existsSync(configPath))
      continue;
    try {
      const moduleUrl = pathToFileURL2(configPath);
      const stat = fs7.statSync(configPath);
      moduleUrl.searchParams.set("tsci", String(stat.mtimeMs));
      const importedModule = await import(moduleUrl.href);
      const exportedConfig = importedModule.default ?? importedModule.config ?? importedModule;
      return parseProjectConfigObject(exportedConfig);
    } catch (error) {
      console.error(`Error loading ${configFileName}: ${error}`);
      return null;
    }
  }
  return null;
};
var loadRuntimeProjectConfig = async (projectDir = process.cwd()) => {
  const jsonConfig = loadProjectConfigSync(projectDir);
  const moduleConfig = await loadProjectConfigModule(projectDir);
  if (!jsonConfig && !moduleConfig) {
    return null;
  }
  return {
    ...jsonConfig ?? {},
    ...moduleConfig ?? {},
    build: {
      ...jsonConfig?.build,
      ...moduleConfig?.build
    },
    pcbSnapshotSettings: {
      ...jsonConfig?.pcbSnapshotSettings,
      ...moduleConfig?.pcbSnapshotSettings
    }
  };
};
var loadProjectConfig = (projectDir = process.cwd()) => {
  return loadProjectConfigSync(projectDir);
};
var getBoardFilePatterns = (projectDir = process.cwd()) => {
  const config = loadProjectConfigSync(projectDir);
  const patterns = config?.includeBoardFiles?.filter((pattern) => pattern.trim());
  if (patterns && patterns.length > 0) {
    return patterns;
  }
  return DEFAULT_BOARD_FILE_PATTERNS;
};
var getSnapshotsDir = (projectDir = process.cwd()) => {
  const config = loadProjectConfigSync(projectDir);
  return config?.snapshotsDir;
};
var saveProjectConfig = (config, projectDir = process.cwd()) => {
  const configPath = path6.join(projectDir, CONFIG_FILENAME);
  try {
    const configWithSchema = {
      $schema: CONFIG_SCHEMA_URL,
      ...config ?? {}
    };
    fs7.writeFileSync(configPath, JSON.stringify(configWithSchema, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving tscircuit config: ${error}`);
    return false;
  }
};

// lib/shared/platform-config-utils.ts
var mergePlatformConfigs = (...configs) => {
  const definedConfigs = configs.filter(Boolean);
  if (definedConfigs.length === 0) {
    return;
  }
  return definedConfigs.reduce((mergedConfig, config) => {
    return {
      ...mergedConfig,
      ...config,
      footprintLibraryMap: {
        ...mergedConfig.footprintLibraryMap,
        ...config.footprintLibraryMap
      },
      footprintFileParserMap: {
        ...mergedConfig.footprintFileParserMap,
        ...config.footprintFileParserMap
      },
      staticFileLoaderMap: {
        ...mergedConfig.staticFileLoaderMap,
        ...config.staticFileLoaderMap
      },
      autorouterMap: {
        ...mergedConfig.autorouterMap,
        ...config.autorouterMap
      },
      spiceEngineMap: {
        ...mergedConfig.spiceEngineMap,
        ...config.spiceEngineMap
      }
    };
  }, {});
};

// cli/snapshot/worker-snapshot-handlers.ts
var handleSnapshotFile = async (filePath, projectDir, snapshotsDirName, options) => {
  process.chdir(projectDir);
  await registerStaticAssetLoaders();
  const projectConfig = await loadRuntimeProjectConfig(projectDir);
  const platformConfig = mergePlatformConfigs(projectConfig?.platformConfig, options.platformConfig);
  const result = await processSnapshotFile({
    file: filePath,
    projectDir,
    snapshotsDirName,
    update: options.update,
    threeD: options.threeD,
    pcbOnly: options.pcbOnly,
    schematicOnly: options.schematicOnly,
    simulationOnly: options.simulationOnly,
    forceUpdate: options.forceUpdate,
    platformConfig,
    pcbSnapshotSettings: options.pcbSnapshotSettings,
    createDiff: options.createDiff,
    cameraPreset: options.cameraPreset,
    pcbLayer: options.pcbLayer
  });
  return {
    message_type: "snapshot_completed",
    file_path: filePath,
    result
  };
};

// cli/snapshot/snapshot.worker.ts
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
parentPort.on("message", async (msg) => {
  if (msg.message_type === "snapshot_file") {
    try {
      const result = await handleSnapshotFile(msg.file_path, msg.project_dir, msg.snapshots_dir_name, msg.options);
      sendMessage(result);
    } catch (error) {
      workerLog(`Worker failed while snapshotting ${msg.file_path}:`, error instanceof Error ? error.message : String(error));
      sendMessage({
        message_type: "snapshot_completed",
        file_path: msg.file_path,
        result: {
          ok: false,
          didUpdate: false,
          successPaths: [],
          warningMessages: [],
          mismatches: [],
          errorMessage: error instanceof Error ? error.message : String(error)
        }
      });
    }
  }
});
