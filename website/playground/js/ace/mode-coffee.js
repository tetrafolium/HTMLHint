define(
    "ace/mode/coffee",
    [
      "require", "exports", "module", "ace/tokenizer",
      "ace/mode/coffee_highlight_rules", "ace/mode/matching_brace_outdent",
      "ace/mode/folding/coffee", "ace/range", "ace/mode/text",
      "ace/worker/worker_client", "ace/lib/oop"
    ],
    function(e, t, n) {
      function c() {
        this.$tokenizer = new r((new i).getRules()), this.$outdent = new s,
        this.foldingRules = new o
      }
      var r = e("../tokenizer").Tokenizer,
          i = e("./coffee_highlight_rules").CoffeeHighlightRules,
          s = e("./matching_brace_outdent").MatchingBraceOutdent,
          o = e("./folding/coffee").FoldMode, u = e("../range").Range,
          a = e("./text").Mode, f = e("../worker/worker_client").WorkerClient,
          l = e("../lib/oop");
      l.inherits(c, a), function() {
        var e = /(?:[({[=:]|[-=]>|\b(?:else|switch|try|catch(?:\s*[$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)?|finally))\s*$/,
            t = /^(\s*)#/, n = /^\s*###(?!#)/, r = /^\s*/;
        this.getNextLineIndent =
            function(t, n, r) {
          var i = this.$getIndent(n),
              s = this.$tokenizer.getLineTokens(n, t).tokens;
          return (!s.length || s[s.length - 1].type !== "comment") &&
                     t === "start" && e.test(n) && (i += r),
                 i
        },
        this.toggleCommentLines =
            function(e, i, s, o) {
          console.log("toggle");
          var a = new u(0, 0, 0, 0);
          for (var f = s; f <= o; ++f) {
            var l = i.getLine(f);
            if (n.test(l)) {
              continue;
            }
            t.test(l) ? l = l.replace(t, "$1") : l = l.replace(r, "$&#"),
                        a.end.row = a.start.row = f,
                        a.end.column = l.length + 1, i.replace(a, l)
          }
        },
        this.checkOutdent = function(
            e, t, n) { return this.$outdent.checkOutdent(t, n) },
        this.autoOutdent = function(e, t,
                                    n) { this.$outdent.autoOutdent(t, n) },
        this.createWorker = function(e) {
          var t = new f([ "ace" ], "ace/mode/coffee_worker", "Worker");
          return t.attachToDocument(e.getDocument()),
                 t.on("error", function(t) { e.setAnnotations([ t.data ]) }),
                 t.on("ok", function(t) { e.clearAnnotations() }), t
        }
      }.call(c.prototype), t.Mode = c
    }),
    define(
        "ace/mode/coffee_highlight_rules",
        [
          "require", "exports", "module", "ace/lib/oop",
          "ace/mode/text_highlight_rules"
        ],
        function(e, t, n) {
          function s() {
            var e = "[$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*",
                t = "this|throw|then|try|typeof|super|switch|return|break|by|continue|catch|class|in|instanceof|is|isnt|if|else|extends|for|forown|finally|function|while|when|new|no|not|delete|debugger|do|loop|of|off|or|on|unless|until|and|yes",
                n = "true|false|null|undefined|NaN|Infinity",
                r = "case|const|default|function|var|void|with|enum|export|implements|interface|let|package|private|protected|public|static|yield|__hasProp|slice|bind|indexOf",
                i = "Array|Boolean|Date|Function|Number|Object|RegExp|ReferenceError|String|Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|SyntaxError|TypeError|URIError|ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray",
                s = "Math|JSON|isNaN|isFinite|parseInt|parseFloat|encodeURI|encodeURIComponent|decodeURI|decodeURIComponent|String|",
                o = "window|arguments|prototype|document",
                u = this.createKeywordMapper({
                  keyword : t,
                  "constant.language" : n,
                  "invalid.illegal" : r,
                  "language.support.class" : i,
                  "language.support.function" : s,
                  "variable.language" : o
                },
                                             "identifier"),
                a = {
                  token : [
                    "paren.lparen", "variable.parameter", "paren.rparen",
                    "text", "storage.type"
                  ],
                  regex :
                      /(?:(\()((?:"[^")]*?"|'[^')]*?'|\/[^\/)]*?\/|[^()\"'\/])*?)(\))(\s*))?([\-=]>)/
                          .source
                },
                f = /\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|[0-2][0-7]{0,2}|3[0-6][0-7]?|37[0-7]?|[4-7][0-7]?|.)/;
            this.$rules = {
              start : [
                {
                  token : "constant.numeric",
                  regex :
                      "(?:0x[\\da-fA-F]+|(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:[eE][+-]?\\d+)?)"
                },
                {
                  stateName : "qdoc",
                  token : "string",
                  regex : "'''",
                  next : [
                    {token : "string", regex : "'''", next : "start"},
                    {token : "constant.language.escape", regex : f},
                    {defaultToken : "string"}
                  ]
                },
                {
                  stateName : "qqdoc",
                  token : "string",
                  regex : '"""',
                  next : [
                    {token : "string", regex : '"""', next : "start"},
                    {token : "constant.language.escape", regex : f},
                    {defaultToken : "string"}
                  ]
                },
                {
                  stateName : "qstring",
                  token : "string",
                  regex : "'",
                  next : [
                    {token : "string", regex : "'", next : "start"},
                    {token : "constant.language.escape", regex : f},
                    {defaultToken : "string"}
                  ]
                },
                {
                  stateName : "qqstring",
                  token : "string.start",
                  regex : '"',
                  next : [
                    {token : "string.end", regex : '"', next : "start"},
                    {token : "constant.language.escape", regex : f},
                    {defaultToken : "string"}
                  ]
                },
                {
                  stateName : "js",
                  token : "string",
                  regex : "`",
                  next : [
                    {token : "string", regex : "`", next : "start"},
                    {token : "constant.language.escape", regex : f},
                    {defaultToken : "string"}
                  ]
                },
                {token : "string.regex", regex : "///", next : "heregex"},
                {
                  token : "string.regex",
                  regex :
                      /(?:\/(?![\s=])[^[\/\n\\]*(?:(?:\\[\s\S]|\[[^\]\n\\]*(?:\\[\s\S][^\]\n\\]*)*])[^[\/\n\\]*)*\/)(?:[imgy]{0,4})(?!\w)/
                },
                {token : "comment", regex : "###(?!#)", next : "comment"},
                {token : "comment", regex : "#.*"},
                {
                  token : [ "punctuation.operator", "text", "identifier" ],
                  regex : "(\\.)(\\s*)(" + r + ")"
                },
                {token : "punctuation.operator", regex : "\\."},
                {
                  token : [
                    "keyword", "text", "language.support.class", "text",
                    "keyword", "text", "language.support.class"
                  ],
                  regex : "(class)(\\s+)(" + e + ")(?:(\\s+)(extends)(\\s+)(" +
                              e + "))?"
                },
                {
                  token : [
                    "entity.name.function", "text", "keyword.operator", "text"
                  ].concat(a.token),
                  regex : "(" + e + ")(\\s*)([=:])(\\s*)" + a.regex
                },
                a,
                {token : "variable", regex : "@(?:" + e + ")?"},
                {token : u, regex : e},
                {token : "punctuation.operator", regex : "\\,|\\."},
                {token : "storage.type", regex : "[\\-=]>"},
                {
                  token : "keyword.operator",
                  regex :
                      "(?:[-+*/%<>&|^!?=]=|>>>=?|\\-\\-|\\+\\+|::|&&=|\\|\\|=|<<=|>>=|\\?\\.|\\.{2,3}|[!*+-=><])"
                },
                {token : "paren.lparen", regex : "[({[]"},
                {token : "paren.rparen", regex : "[\\]})]"},
                {token : "text", regex : "\\s+"}
              ],
              heregex : [
                {
                  token : "string.regex",
                  regex : ".*?///[imgy]{0,4}",
                  next : "start"
                },
                {token : "comment.regex", regex : "\\s+(?:#.*)?"},
                {token : "string.regex", regex : "\\S+"}
              ],
              comment : [
                {token : "comment", regex : "###", next : "start"},
                {defaultToken : "comment"}
              ]
            },
            this.normalizeRules()
          }
          var r = e("../lib/oop"),
              i = e("./text_highlight_rules").TextHighlightRules;
          r.inherits(s, i), t.CoffeeHighlightRules = s
        }),
    define("ace/mode/matching_brace_outdent",
           [ "require", "exports", "module", "ace/range" ],
           function(e, t, n) {
             var r = e("../range").Range, i = function() {};
             (function() {
               this.checkOutdent = function(
                   e, t) { return /^\s+$/.test(e) ? /^\s*\}/.test(t) : !1 },
               this.autoOutdent = function(e, t) {
                 var n = e.getLine(t), i = n.match(/^(\s*\})/);
                 if (!i) {
                   return 0;
                 }
                 var s = i[1].length,
                     o = e.findMatchingBracket({row : t, column : s});
                 if (!o || o.row == t) {
                   return 0;
                 }
                 var u = this.$getIndent(e.getLine(o.row));
                 e.replace(new r(t, 0, t, s - 1), u)
               }, this.$getIndent = function(e) { return e.match(/^\s*/)[0] }
             }).call(i.prototype),
                 t.MatchingBraceOutdent = i
           }),
    define(
        "ace/mode/folding/coffee",
        [
          "require", "exports", "module", "ace/lib/oop",
          "ace/mode/folding/fold_mode", "ace/range"
        ],
        function(e, t, n) {
          var r = e("../../lib/oop"), i = e("./fold_mode").FoldMode,
              s = e("../../range").Range, o = t.FoldMode = function() {};
          r.inherits(o, i), function() {
            this.getFoldWidgetRange = function(e, t, n) {
              var r = this.indentationBlock(e, n);
              if (r) {
                return r;
              }
              var i = /\S/, o = e.getLine(n), u = o.search(i);
              if (u == -1 || o[u] != "#") {
                return;
              }
              var a = o.length, f = e.getLength(), l = n, c = n;
              while (++n < f) {
                o = e.getLine(n);
                var h = o.search(i);
                if (h == -1) {
                  continue;
                }
                if (o[h] != "#") {
                  break;
                }
                c = n
              }
              if (c > l) {
                var p = e.getLine(c).length;
                return new s(l, a, c, p)
              }
            }, this.getFoldWidget = function(e, t, n) {
              var r = e.getLine(n), i = r.search(/\S/), s = e.getLine(n + 1),
                  o = e.getLine(n - 1), u = o.search(/\S/), a = s.search(/\S/);
              if (i == -1) {
                return e.foldWidgets[n - 1] = u != -1 && u < a ? "start" : "",
                                         "";
              }
              if (u == -1) {
                if (i == a && r[i] == "#" && s[i] == "#") {
                  return e.foldWidgets[n - 1] = "", e.foldWidgets[n + 1] = "",
                                           "start"
              } } else if (u == i && r[i] == "#" && o[i] == "#" 
                  && e.getLine(n - 2).search(/\S/) == -1
              ) {
                return e.foldWidgets[n - 1] = "start",
                                         e.foldWidgets[n + 1] = "", "";
              }
              return u != -1 && u < i ? e.foldWidgets[n - 1] = "start"
                                      : e.foldWidgets[n - 1] = "",
                                                          i < a ? "start" : ""
            }
          }.call(o.prototype)
        })