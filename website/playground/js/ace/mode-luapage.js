define("ace/mode/luapage",
       [
         "require", "exports", "module", "ace/lib/oop", "ace/mode/html",
         "ace/mode/lua", "ace/tokenizer", "ace/mode/luapage_highlight_rules"
       ],
       function(e, t, n) {
         var r = e("../lib/oop"), i = e("./html").Mode, s = e("./lua").Mode,
             o = e("../tokenizer").Tokenizer,
             u = e("./luapage_highlight_rules").LuaPageHighlightRules,
             a = function() {
               var e = new u;
               this.$tokenizer = new o((new u).getRules()),
               this.$embeds = e.getEmbeds(),
               this.createModeDelegates({"lua-" : s})
             };
         r.inherits(a, i), t.Mode = a
       }),
    define("ace/mode/html",
           [
             "require", "exports", "module", "ace/lib/oop", "ace/mode/text",
             "ace/mode/javascript", "ace/mode/css", "ace/tokenizer",
             "ace/mode/html_highlight_rules", "ace/mode/behaviour/html",
             "ace/mode/folding/html"
           ],
           function(e, t, n) {
             var r = e("../lib/oop"), i = e("./text").Mode,
                 s = e("./javascript").Mode, o = e("./css").Mode,
                 u = e("../tokenizer").Tokenizer,
                 a = e("./html_highlight_rules").HtmlHighlightRules,
                 f = e("./behaviour/html").HtmlBehaviour,
                 l = e("./folding/html").FoldMode, c = function() {
                   var e = new a;
                   this.$tokenizer = new u(e.getRules()),
                   this.$behaviour = new f, this.$embeds = e.getEmbeds(),
                   this.createModeDelegates({"js-" : s, "css-" : o}),
                   this.foldingRules = new l
                 };
             r.inherits(c, i), function() {
               this.blockComment = {start : "<!--", end : "-->"},
               this.getNextLineIndent = function(
                   e, t, n) { return this.$getIndent(t) },
               this.checkOutdent = function(e, t, n) { return !1 }
             }.call(c.prototype), t.Mode = c
           }),
    define(
        "ace/mode/javascript",
        [
          "require", "exports", "module", "ace/lib/oop", "ace/mode/text",
          "ace/tokenizer", "ace/mode/javascript_highlight_rules",
          "ace/mode/matching_brace_outdent", "ace/range",
          "ace/worker/worker_client", "ace/mode/behaviour/cstyle",
          "ace/mode/folding/cstyle"
        ],
        function(e, t, n) {
          var r = e("../lib/oop"), i = e("./text").Mode,
              s = e("../tokenizer").Tokenizer,
              o = e("./javascript_highlight_rules").JavaScriptHighlightRules,
              u = e("./matching_brace_outdent").MatchingBraceOutdent,
              a = e("../range").Range,
              f = e("../worker/worker_client").WorkerClient,
              l = e("./behaviour/cstyle").CstyleBehaviour,
              c = e("./folding/cstyle").FoldMode, h = function() {
                this.$tokenizer = new s((new o).getRules()),
                this.$outdent = new u, this.$behaviour = new l,
                this.foldingRules = new c
              };
          r.inherits(h, i), function() {
            this.lineCommentStart = "//",
            this.blockComment = {start : "/*", end : "*/"},
            this.getNextLineIndent =
                function(e, t, n) {
              var r = this.$getIndent(t),
                  i = this.$tokenizer.getLineTokens(t, e), s = i.tokens,
                  o = i.state;
              if (s.length && s[s.length - 1].type == "comment")
                return r;
              if (e == "start" || e == "no_regex") {
                var u = t.match(/^.*(?:\bcase\b.*\:|[\{\(\[])\s*$/);
                u && (r += n)
              } else if (e == "doc-start") {
                if (o == "start" || o == "no_regex")
                  return "";
                var u = t.match(/^\s*(\/?)\*/);
                u && (u[1] && (r += " "), r += "* ")
              }
              return r
            },
            this.checkOutdent = function(
                e, t, n) { return this.$outdent.checkOutdent(t, n) },
            this.autoOutdent = function(e, t,
                                        n) { this.$outdent.autoOutdent(t, n) },
            this.createWorker = function(e) {
              var t = new f([ "ace" ], "ace/mode/javascript_worker",
                            "JavaScriptWorker");
              return t.attachToDocument(e.getDocument()),
                     t.on("jslint", function(t) { e.setAnnotations(t.data) }),
                     t.on("terminate", function() { e.clearAnnotations() }), t
            }
          }.call(h.prototype), t.Mode = h
        }),
    define(
        "ace/mode/javascript_highlight_rules",
        [
          "require", "exports", "module", "ace/lib/oop",
          "ace/mode/doc_comment_highlight_rules",
          "ace/mode/text_highlight_rules"
        ],
        function(e, t, n) {
          var r = e("../lib/oop"),
              i = e("./doc_comment_highlight_rules").DocCommentHighlightRules,
              s = e("./text_highlight_rules").TextHighlightRules,
              o = function() {
                var e = this.createKeywordMapper({
                  "variable.language" :
                      "Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|Namespace|QName|XML|XMLList|ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt|JSON|Math|this|arguments|prototype|window|document",
                  keyword :
                      "const|yield|import|get|set|break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|debugger|__parent__|__count__|escape|unescape|with|__proto__|class|enum|extends|super|export|implements|private|public|interface|package|protected|static",
                  "storage.type" : "const|let|var|function",
                  "constant.language" : "null|Infinity|NaN|undefined",
                  "support.function" : "alert",
                  "constant.language.boolean" : "true|false"
                },
                                                 "identifier"),
                    t = "case|do|else|finally|in|instanceof|return|throw|try|typeof|yield|void",
                    n = "[a-zA-Z\\$_¡-￿][a-zA-Z\\d\\$_¡-￿]*\\b",
                    r = "\\\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|[0-2][0-7]{0,2}|3[0-6][0-7]?|37[0-7]?|[4-7][0-7]?|.)";
                this.$rules = {
                  no_regex : [
                    {token : "comment", regex : /\/\/.*$/},
                    i.getStartRule("doc-start"),
                    {token : "comment", regex : /\/\*/, next : "comment"},
                    {token : "string", regex : "'(?=.)", next : "qstring"},
                    {token : "string", regex : '"(?=.)', next : "qqstring"},
                    {token : "constant.numeric", regex : /0[xX][0-9a-fA-F]+\b/},
                    {
                      token : "constant.numeric",
                      regex : /[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/
                    },
                    {
                      token : [
                        "storage.type", "punctuation.operator",
                        "support.function", "punctuation.operator",
                        "entity.name.function", "text", "keyword.operator"
                      ],
                      regex : "(" + n + ")(\\.)(prototype)(\\.)(" + n +
                                  ")(\\s*)(=)",
                      next : "function_arguments"
                    },
                    {
                      token : [
                        "storage.type", "punctuation.operator",
                        "entity.name.function", "text", "keyword.operator",
                        "text", "storage.type", "text", "paren.lparen"
                      ],
                      regex : "(" + n + ")(\\.)(" + n +
                                  ")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                      next : "function_arguments"
                    },
                    {
                      token : [
                        "entity.name.function", "text", "keyword.operator",
                        "text", "storage.type", "text", "paren.lparen"
                      ],
                      regex : "(" + n + ")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                      next : "function_arguments"
                    },
                    {
                      token : [
                        "storage.type", "punctuation.operator",
                        "entity.name.function", "text", "keyword.operator",
                        "text", "storage.type", "text", "entity.name.function",
                        "text", "paren.lparen"
                      ],
                      regex :
                          "(" + n + ")(\\.)(" + n +
                              ")(\\s*)(=)(\\s*)(function)(\\s+)(\\w+)(\\s*)(\\()",
                      next : "function_arguments"
                    },
                    {
                      token : [
                        "storage.type", "text", "entity.name.function", "text",
                        "paren.lparen"
                      ],
                      regex : "(function)(\\s+)(" + n + ")(\\s*)(\\()",
                      next : "function_arguments"
                    },
                    {
                      token : [
                        "entity.name.function", "text", "punctuation.operator",
                        "text", "storage.type", "text", "paren.lparen"
                      ],
                      regex : "(" + n + ")(\\s*)(:)(\\s*)(function)(\\s*)(\\()",
                      next : "function_arguments"
                    },
                    {
                      token : [
                        "text", "text", "storage.type", "text", "paren.lparen"
                      ],
                      regex : "(:)(\\s*)(function)(\\s*)(\\()",
                      next : "function_arguments"
                    },
                    {
                      token : "keyword",
                      regex : "(?:" + t + ")\\b",
                      next : "start"
                    },
                    {
                      token : [ "punctuation.operator", "support.function" ],
                      regex :
                          /(\.)(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:opzzzz|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\b(?=\()/
                    },
                    {
                      token :
                          [ "punctuation.operator", "support.function.dom" ],
                      regex :
                          /(\.)(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName)|ById)|Attribute(?:Node)?)|blur)\b(?=\()/
                    },
                    {
                      token : [ "punctuation.operator", "support.constant" ],
                      regex :
                          /(\.)(s(?:ystemLanguage|cr(?:ipts|ollbars|een(?:X|Y|Top|Left))|t(?:yle(?:Sheets)?|atus(?:Text|bar)?)|ibling(?:Below|Above)|ource|uffixes|e(?:curity(?:Policy)?|l(?:ection|f)))|h(?:istory|ost(?:name)?|as(?:h|Focus))|y|X(?:MLDocument|SLDocument)|n(?:ext|ame(?:space(?:s|URI)|Prop))|M(?:IN_VALUE|AX_VALUE)|c(?:haracterSet|o(?:n(?:structor|trollers)|okieEnabled|lorDepth|mp(?:onents|lete))|urrent|puClass|l(?:i(?:p(?:boardData)?|entInformation)|osed|asses)|alle(?:e|r)|rypto)|t(?:o(?:olbar|p)|ext(?:Transform|Indent|Decoration|Align)|ags)|SQRT(?:1_2|2)|i(?:n(?:ner(?:Height|Width)|put)|ds|gnoreCase)|zIndex|o(?:scpu|n(?:readystatechange|Line)|uter(?:Height|Width)|p(?:sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(?:i(?:splay|alog(?:Height|Top|Width|Left|Arguments)|rectories)|e(?:scription|fault(?:Status|Ch(?:ecked|arset)|View)))|u(?:ser(?:Profile|Language|Agent)|n(?:iqueID|defined)|pdateInterval)|_content|p(?:ixelDepth|ort|ersonalbar|kcs11|l(?:ugins|atform)|a(?:thname|dding(?:Right|Bottom|Top|Left)|rent(?:Window|Layer)?|ge(?:X(?:Offset)?|Y(?:Offset)?))|r(?:o(?:to(?:col|type)|duct(?:Sub)?|mpter)|e(?:vious|fix)))|e(?:n(?:coding|abledPlugin)|x(?:ternal|pando)|mbeds)|v(?:isibility|endor(?:Sub)?|Linkcolor)|URLUnencoded|P(?:I|OSITIVE_INFINITY)|f(?:ilename|o(?:nt(?:Size|Family|Weight)|rmName)|rame(?:s|Element)|gColor)|E|whiteSpace|l(?:i(?:stStyleType|n(?:eHeight|kColor))|o(?:ca(?:tion(?:bar)?|lName)|wsrc)|e(?:ngth|ft(?:Context)?)|a(?:st(?:M(?:odified|atch)|Index|Paren)|yer(?:s|X)|nguage))|a(?:pp(?:MinorVersion|Name|Co(?:deName|re)|Version)|vail(?:Height|Top|Width|Left)|ll|r(?:ity|guments)|Linkcolor|bove)|r(?:ight(?:Context)?|e(?:sponse(?:XML|Text)|adyState))|global|x|m(?:imeTypes|ultiline|enubar|argin(?:Right|Bottom|Top|Left))|L(?:N(?:10|2)|OG(?:10E|2E))|b(?:o(?:ttom|rder(?:Width|RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(?:Color|Image)))\b/
                    },
                    {
                      token : [
                        "storage.type", "punctuation.operator",
                        "support.function.firebug"
                      ],
                      regex :
                          /(console)(\.)(warn|info|log|error|time|timeEnd|assert)\b/
                    },
                    {token : e, regex : n},
                    {
                      token : "keyword.operator",
                      regex :
                          /--|\+\+|[!$%&*+\-~]|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\|\||\?\:|\*=|%=|\+=|\-=|&=|\^=/,
                      next : "start"
                    },
                    {
                      token : "punctuation.operator",
                      regex : /\?|\:|\,|\;|\./,
                      next : "start"
                    },
                    {token : "paren.lparen", regex : /[\[({]/, next : "start"},
                    {token : "paren.rparen", regex : /[\])}]/},
                    {
                      token : "keyword.operator",
                      regex : /\/=?/,
                      next : "start"
                    },
                    {token : "comment", regex : /^#!.*$/}
                  ],
                  start : [
                    i.getStartRule("doc-start"), {
                      token : "comment",
                      regex : "\\/\\*",
                      next : "comment_regex_allowed"
                    },
                    {token : "comment", regex : "\\/\\/.*$", next : "start"},
                    {token : "string.regexp", regex : "\\/", next : "regex"},
                    {token : "text", regex : "\\s+|^$", next : "start"},
                    {token : "empty", regex : "", next : "no_regex"}
                  ],
                  regex : [
                    {
                      token : "regexp.keyword.operator",
                      regex : "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
                    },
                    {
                      token : "string.regexp",
                      regex : "/\\w*",
                      next : "no_regex"
                    },
                    {
                      token : "invalid",
                      regex : /\{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/
                    },
                    {
                      token : "constant.language.escape",
                      regex : /\(\?[:=!]|\)|\{\d+\b,?\d*\}|[+*]\?|[()$^+*?]/
                    },
                    {token : "constant.language.delimiter", regex : /\|/}, {
                      token : "constant.language.escape",
                      regex : /\[\^?/,
                      next : "regex_character_class"
                    },
                    {token : "empty", regex : "$", next : "no_regex"},
                    {defaultToken : "string.regexp"}
                  ],
                  regex_character_class : [
                    {
                      token : "regexp.keyword.operator",
                      regex : "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
                    },
                    {
                      token : "constant.language.escape",
                      regex : "]",
                      next : "regex"
                    },
                    {token : "constant.language.escape", regex : "-"},
                    {token : "empty", regex : "$", next : "no_regex"},
                    {defaultToken : "string.regexp.charachterclass"}
                  ],
                  function_arguments : [
                    {token : "variable.parameter", regex : n},
                    {token : "punctuation.operator", regex : "[, ]+"},
                    {token : "punctuation.operator", regex : "$"},
                    {token : "empty", regex : "", next : "no_regex"}
                  ],
                  comment_regex_allowed : [
                    {token : "comment", regex : "\\*\\/", next : "start"},
                    {defaultToken : "comment"}
                  ],
                  comment : [
                    {token : "comment", regex : "\\*\\/", next : "no_regex"},
                    {defaultToken : "comment"}
                  ],
                  qqstring : [
                    {token : "constant.language.escape", regex : r},
                    {token : "string", regex : "\\\\$", next : "qqstring"},
                    {token : "string", regex : '"|$', next : "no_regex"},
                    {defaultToken : "string"}
                  ],
                  qstring : [
                    {token : "constant.language.escape", regex : r},
                    {token : "string", regex : "\\\\$", next : "qstring"},
                    {token : "string", regex : "'|$", next : "no_regex"},
                    {defaultToken : "string"}
                  ]
                },
                this.embedRules(i, "doc-", [ i.getEndRule("no_regex") ])
              };
          r.inherits(o, s), t.JavaScriptHighlightRules = o
        }),
    define("ace/mode/doc_comment_highlight_rules",
           [
             "require", "exports", "module", "ace/lib/oop",
             "ace/mode/text_highlight_rules"
           ],
           function(e, t, n) {
             var r = e("../lib/oop"),
                 i = e("./text_highlight_rules").TextHighlightRules,
                 s = function() {
                   this.$rules = {
                     start : [
                       {token : "comment.doc.tag", regex : "@[\\w\\d_]+"},
                       {token : "comment.doc.tag", regex : "\\bTODO\\b"},
                       {defaultToken : "comment.doc"}
                     ]
                   }
                 };
             r.inherits(s, i), s.getStartRule = function(e) {
               return { token: "comment.doc", regex: "\\/\\*(?=\\*)", next: e }
             }, s.getEndRule = function(e) {
               return { token: "comment.doc", regex: "\\*\\/", next: e }
             }, t.DocCommentHighlightRules = s
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
                 if (!i)
                   return 0;
                 var s = i[1].length,
                     o = e.findMatchingBracket({row : t, column : s});
                 if (!o || o.row == t)
                   return 0;
                 var u = this.$getIndent(e.getLine(o.row));
                 e.replace(new r(t, 0, t, s - 1), u)
               }, this.$getIndent = function(e) { return e.match(/^\s*/)[0] }
             }).call(i.prototype),
                 t.MatchingBraceOutdent = i
           }),
    define(
        "ace/mode/behaviour/cstyle",
        [
          "require", "exports", "module", "ace/lib/oop", "ace/mode/behaviour",
          "ace/token_iterator", "ace/lib/lang"
        ],
        function(e, t, n) {
          var r = e("../../lib/oop"), i = e("../behaviour").Behaviour,
              s = e("../../token_iterator").TokenIterator,
              o = e("../../lib/lang"),
              u = [ "text", "paren.rparen", "punctuation.operator" ],
              a = [ "text", "paren.rparen", "punctuation.operator", "comment" ],
              f = 0, l = -1, c = "", h = 0, p = -1, d = "", v = "",
              m = function() {
                m.isSaneInsertion =
                    function(e, t) {
                  var n = e.getCursorPosition(), r = new s(t, n.row, n.column);
                  if (!this.$matchTokenType(r.getCurrentToken() || "text", u)) {
                    var i = new s(t, n.row, n.column + 1);
                    if (!this.$matchTokenType(i.getCurrentToken() || "text", u))
                      return !1
                  }
                  return r.stepForward(),
                         r.getCurrentTokenRow() !== n.row ||
                             this.$matchTokenType(r.getCurrentToken() || "text",
                                                  a)
                },
                m.$matchTokenType = function(
                    e, t) { return t.indexOf(e.type || e) > -1 },
                m.recordAutoInsert =
                    function(e, t, n) {
                  var r = e.getCursorPosition(), i = t.doc.getLine(r.row);
                  this.isAutoInsertedClosing(r, i, c[0]) || (f = 0),
                      l = r.row, c = n + i.substr(r.column), f++
                },
                m.recordMaybeInsert =
                    function(e, t, n) {
                  var r = e.getCursorPosition(), i = t.doc.getLine(r.row);
                  this.isMaybeInsertedClosing(r, i) || (h = 0),
                      p = r.row, d = i.substr(0, r.column) + n,
                      v = i.substr(r.column), h++
                },
                m.isAutoInsertedClosing =
                    function(e, t, n) {
                  return f > 0 && e.row === l && n === c[0] &&
                         t.substr(e.column) === c
                },
                m.isMaybeInsertedClosing =
                    function(e, t) {
                  return h > 0 && e.row === p && t.substr(e.column) === v &&
                         t.substr(0, e.column) == d
                },
                m.popAutoInsertedClosing = function() { c = c.substr(1), f-- },
                m.clearMaybeInsertedClosing = function() { h = 0, p = -1 },
                this.add(
                    "braces", "insertion",
                    function(e, t, n, r, i) {
                      var s = n.getCursorPosition(), u = r.doc.getLine(s.row);
                      if (i == "{") {
                        var a = n.getSelectionRange(),
                            f = r.doc.getTextRange(a);
                        if (f !== "" && f !== "{" &&
                            n.getWrapBehavioursEnabled())
                          return {text : "{" + f + "}", selection : !1};
                        if (m.isSaneInsertion(n, r))
                          return /[\]\}\)]/.test(u[s.column])
                                     ? (m.recordAutoInsert(n, r, "}"),
                                        {text : "{}", selection : [ 1, 1 ]})
                                     : (m.recordMaybeInsert(n, r, "{"),
                                        {text : "{", selection : [ 1, 1 ]})
                      } else if (i == "}") {
                        var l = u.substring(s.column, s.column + 1);
                        if (l == "}") {
                          var c = r.$findOpeningBracket(
                              "}", {column : s.column + 1, row : s.row});
                          if (c !== null && m.isAutoInsertedClosing(s, u, i))
                            return m.popAutoInsertedClosing(), {
                              text: "", selection: [ 1, 1 ]
                            }
                        }
                      } else if (i == "\n" || i == "\r\n") {
                        var p = "";
                        m.isMaybeInsertedClosing(s, u) &&
                            (p = o.stringRepeat("}", h),
                             m.clearMaybeInsertedClosing());
                        var l = u.substring(s.column, s.column + 1);
                        if (l == "}" || p !== "") {
                          var d = r.findMatchingBracket(
                              {row : s.row, column : s.column}, "}");
                          if (!d)
                            return null;
                          var v = this.getNextLineIndent(
                                  e, u.substring(0, s.column),
                                  r.getTabString()),
                              g = this.$getIndent(u);
                          return {
                            text: "\n" + v + "\n" + g + p,
                                selection: [ 1, v.length, 1, v.length ]
                          }
                        }
                      }
                    }),
                this.add("braces", "deletion",
                         function(e, t, n, r, i) {
                           var s = r.doc.getTextRange(i);
                           if (!i.isMultiLine() && s == "{") {
                             var o = r.doc.getLine(i.start.row),
                                 u = o.substring(i.end.column,
                                                 i.end.column + 1);
                             if (u == "}")
                               return i.end.column++, i;
                             h--
                           }
                         }),
                this.add(
                    "parens", "insertion",
                    function(e, t, n, r, i) {
                      if (i == "(") {
                        var s = n.getSelectionRange(),
                            o = r.doc.getTextRange(s);
                        if (o !== "" && n.getWrapBehavioursEnabled())
                          return {text : "(" + o + ")", selection : !1};
                        if (m.isSaneInsertion(n, r))
                          return m.recordAutoInsert(n, r, ")"), {
                            text: "()", selection: [ 1, 1 ]
                          }
                      } else if (i == ")") {
                        var u = n.getCursorPosition(), a = r.doc.getLine(u.row),
                            f = a.substring(u.column, u.column + 1);
                        if (f == ")") {
                          var l = r.$findOpeningBracket(
                              ")", {column : u.column + 1, row : u.row});
                          if (l !== null && m.isAutoInsertedClosing(u, a, i))
                            return m.popAutoInsertedClosing(), {
                              text: "", selection: [ 1, 1 ]
                            }
                        }
                      }
                    }),
                this.add("parens", "deletion",
                         function(e, t, n, r, i) {
                           var s = r.doc.getTextRange(i);
                           if (!i.isMultiLine() && s == "(") {
                             var o = r.doc.getLine(i.start.row),
                                 u = o.substring(i.start.column + 1,
                                                 i.start.column + 2);
                             if (u == ")")
                               return i.end.column++, i
                           }
                         }),
                this.add(
                    "brackets", "insertion",
                    function(e, t, n, r, i) {
                      if (i == "[") {
                        var s = n.getSelectionRange(),
                            o = r.doc.getTextRange(s);
                        if (o !== "" && n.getWrapBehavioursEnabled())
                          return {text : "[" + o + "]", selection : !1};
                        if (m.isSaneInsertion(n, r))
                          return m.recordAutoInsert(n, r, "]"), {
                            text: "[]", selection: [ 1, 1 ]
                          }
                      } else if (i == "]") {
                        var u = n.getCursorPosition(), a = r.doc.getLine(u.row),
                            f = a.substring(u.column, u.column + 1);
                        if (f == "]") {
                          var l = r.$findOpeningBracket(
                              "]", {column : u.column + 1, row : u.row});
                          if (l !== null && m.isAutoInsertedClosing(u, a, i))
                            return m.popAutoInsertedClosing(), {
                              text: "", selection: [ 1, 1 ]
                            }
                        }
                      }
                    }),
                this.add("brackets", "deletion",
                         function(e, t, n, r, i) {
                           var s = r.doc.getTextRange(i);
                           if (!i.isMultiLine() && s == "[") {
                             var o = r.doc.getLine(i.start.row),
                                 u = o.substring(i.start.column + 1,
                                                 i.start.column + 2);
                             if (u == "]")
                               return i.end.column++, i
                           }
                         }),
                this.add(
                    "string_dquotes", "insertion",
                    function(e, t, n, r, i) {
                      if (i == '"' || i == "'") {
                        var s = i, o = n.getSelectionRange(),
                            u = r.doc.getTextRange(o);
                        if (u !== "" && u !== "'" && u != '"' &&
                            n.getWrapBehavioursEnabled())
                          return {text : s + u + s, selection : !1};
                        var a = n.getCursorPosition(), f = r.doc.getLine(a.row),
                            l = f.substring(a.column - 1, a.column);
                        if (l == "\\")
                          return null;
                        var c = r.getTokens(o.start.row), h = 0, p, d = -1;
                        for (var v = 0; v < c.length; v++) {
                          p = c[v], p.type == "string"
                                        ? d = -1
                                        : d < 0 && (d = p.value.indexOf(s));
                          if (p.value.length + h > o.start.column)
                            break;
                          h += c[v].value.length
                        }
                        if (!p ||
                            d < 0 && p.type !== "comment" &&
                                (p.type !== "string" ||
                                 o.start.column !== p.value.length + h - 1 &&
                                     p.value.lastIndexOf(s) ===
                                         p.value.length - 1)) {
                          if (!m.isSaneInsertion(n, r))
                            return;
                          return { text: s + s, selection: [ 1, 1 ] }
                        }
                        if (p && p.type === "string") {
                          var g = f.substring(a.column, a.column + 1);
                          if (g == s)
                            return { text: "", selection: [ 1, 1 ] }
                        }
                      }
                    }),
                this.add("string_dquotes", "deletion", function(e, t, n, r, i) {
                  var s = r.doc.getTextRange(i);
                  if (!i.isMultiLine() && (s == '"' || s == "'")) {
                    var o = r.doc.getLine(i.start.row),
                        u = o.substring(i.start.column + 1, i.start.column + 2);
                    if (u == s)
                      return i.end.column++, i
                  }
                })
              };
          r.inherits(m, i), t.CstyleBehaviour = m
        }),
    define("ace/mode/folding/cstyle",
           [
             "require", "exports", "module", "ace/lib/oop", "ace/range",
             "ace/mode/folding/fold_mode"
           ],
           function(e, t, n) {
             var r = e("../../lib/oop"), i = e("../../range").Range,
                 s = e("./fold_mode").FoldMode, o = t.FoldMode = function(e) {
                   e && (this.foldingStartMarker =
                             new RegExp(this.foldingStartMarker.source.replace(
                                 /\|[^|]*?$/, "|" + e.start)),
                         this.foldingStopMarker =
                             new RegExp(this.foldingStopMarker.source.replace(
                                 /\|[^|]*?$/, "|" + e.end)))
                 };
             r.inherits(o, s), function() {
               this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/,
               this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/,
               this.getFoldWidgetRange = function(e, t, n) {
                 var r = e.getLine(n), i = r.match(this.foldingStartMarker);
                 if (i) {
                   var s = i.index;
                   return i[1] ? this.openingBracketBlock(e, i[1], n, s)
                               : e.getCommentFoldRange(n, s + i[0].length, 1)
                 }
                 if (t !== "markbeginend")
                   return;
                 var i = r.match(this.foldingStopMarker);
                 if (i) {
                   var s = i.index + i[0].length;
                   return i[1] ? this.closingBracketBlock(e, i[1], n, s)
                               : e.getCommentFoldRange(n, s, -1)
                 }
               }
             }.call(o.prototype)
           }),
    define(
        "ace/mode/css",
        [
          "require", "exports", "module", "ace/lib/oop", "ace/mode/text",
          "ace/tokenizer", "ace/mode/css_highlight_rules",
          "ace/mode/matching_brace_outdent", "ace/worker/worker_client",
          "ace/mode/behaviour/css", "ace/mode/folding/cstyle"
        ],
        function(e, t, n) {
          var r = e("../lib/oop"), i = e("./text").Mode,
              s = e("../tokenizer").Tokenizer,
              o = e("./css_highlight_rules").CssHighlightRules,
              u = e("./matching_brace_outdent").MatchingBraceOutdent,
              a = e("../worker/worker_client").WorkerClient,
              f = e("./behaviour/css").CssBehaviour,
              l = e("./folding/cstyle").FoldMode, c = function() {
                this.$tokenizer = new s((new o).getRules()),
                this.$outdent = new u, this.$behaviour = new f,
                this.foldingRules = new l
              };
          r.inherits(c, i), function() {
            this.foldingRules = "cStyle",
            this.blockComment = {start : "/*", end : "*/"},
            this.getNextLineIndent =
                function(e, t, n) {
              var r = this.$getIndent(t),
                  i = this.$tokenizer.getLineTokens(t, e).tokens;
              if (i.length && i[i.length - 1].type == "comment")
                return r;
              var s = t.match(/^.*\{\s*$/);
              return s && (r += n), r
            },
            this.checkOutdent = function(
                e, t, n) { return this.$outdent.checkOutdent(t, n) },
            this.autoOutdent = function(e, t,
                                        n) { this.$outdent.autoOutdent(t, n) },
            this.createWorker = function(e) {
              var t = new a([ "ace" ], "ace/mode/css_worker", "Worker");
              return t.attachToDocument(e.getDocument()),
                     t.on("csslint", function(t) { e.setAnnotations(t.data) }),
                     t.on("terminate", function() { e.clearAnnotations() }), t
            }
          }.call(c.prototype), t.Mode = c
        }),
    define("ace/mode/css_highlight_rules",
           [
             "require", "exports", "module", "ace/lib/oop", "ace/lib/lang",
             "ace/mode/text_highlight_rules"
           ],
           function(e, t, n) {
             var r = e("../lib/oop"), i = e("../lib/lang"),
                 s = e("./text_highlight_rules").TextHighlightRules,
                 o = t.supportType =
                     "animation-fill-mode|alignment-adjust|alignment-baseline|animation-delay|animation-direction|animation-duration|animation-iteration-count|animation-name|animation-play-state|animation-timing-function|animation|appearance|azimuth|backface-visibility|background-attachment|background-break|background-clip|background-color|background-image|background-origin|background-position|background-repeat|background-size|background|baseline-shift|binding|bleed|bookmark-label|bookmark-level|bookmark-state|bookmark-target|border-bottom|border-bottom-color|border-bottom-left-radius|border-bottom-right-radius|border-bottom-style|border-bottom-width|border-collapse|border-color|border-image|border-image-outset|border-image-repeat|border-image-slice|border-image-source|border-image-width|border-left|border-left-color|border-left-style|border-left-width|border-radius|border-right|border-right-color|border-right-style|border-right-width|border-spacing|border-style|border-top|border-top-color|border-top-left-radius|border-top-right-radius|border-top-style|border-top-width|border-width|border|bottom|box-align|box-decoration-break|box-direction|box-flex-group|box-flex|box-lines|box-ordinal-group|box-orient|box-pack|box-shadow|box-sizing|break-after|break-before|break-inside|caption-side|clear|clip|color-profile|color|column-count|column-fill|column-gap|column-rule|column-rule-color|column-rule-style|column-rule-width|column-span|column-width|columns|content|counter-increment|counter-reset|crop|cue-after|cue-before|cue|cursor|direction|display|dominant-baseline|drop-initial-after-adjust|drop-initial-after-align|drop-initial-before-adjust|drop-initial-before-align|drop-initial-size|drop-initial-value|elevation|empty-cells|fit|fit-position|float-offset|float|font-family|font-size|font-size-adjust|font-stretch|font-style|font-variant|font-weight|font|grid-columns|grid-rows|hanging-punctuation|height|hyphenate-after|hyphenate-before|hyphenate-character|hyphenate-lines|hyphenate-resource|hyphens|icon|image-orientation|image-rendering|image-resolution|inline-box-align|left|letter-spacing|line-height|line-stacking-ruby|line-stacking-shift|line-stacking-strategy|line-stacking|list-style-image|list-style-position|list-style-type|list-style|margin-bottom|margin-left|margin-right|margin-top|margin|mark-after|mark-before|mark|marks|marquee-direction|marquee-play-count|marquee-speed|marquee-style|max-height|max-width|min-height|min-width|move-to|nav-down|nav-index|nav-left|nav-right|nav-up|opacity|orphans|outline-color|outline-offset|outline-style|outline-width|outline|overflow-style|overflow-x|overflow-y|overflow|padding-bottom|padding-left|padding-right|padding-top|padding|page-break-after|page-break-before|page-break-inside|page-policy|page|pause-after|pause-before|pause|perspective-origin|perspective|phonemes|pitch-range|pitch|play-during|position|presentation-level|punctuation-trim|quotes|rendering-intent|resize|rest-after|rest-before|rest|richness|right|rotation-point|rotation|ruby-align|ruby-overhang|ruby-position|ruby-span|size|speak-header|speak-numeral|speak-punctuation|speak|speech-rate|stress|string-set|table-layout|target-name|target-new|target-position|target|text-align-last|text-align|text-decoration|text-emphasis|text-height|text-indent|text-justify|text-outline|text-shadow|text-transform|text-wrap|top|transform-origin|transform-style|transform|transition-delay|transition-duration|transition-property|transition-timing-function|transition|unicode-bidi|vertical-align|visibility|voice-balance|voice-duration|voice-family|voice-pitch-range|voice-pitch|voice-rate|voice-stress|voice-volume|volume|white-space-collapse|white-space|widows|width|word-break|word-spacing|word-wrap|z-index",
                 u = t.supportFunction = "rgb|rgba|url|attr|counter|counters",
                 a = t.supportConstant = "absolute|after-edge|after|all-scroll|all|alphabetic|always|antialiased|armenian|auto|avoid-column|avoid-page|avoid|balance|baseline|before-edge|before|below|bidi-override|block-line-height|block|bold|bolder|border-box|both|bottom|box|break-all|break-word|capitalize|caps-height|caption|center|central|char|circle|cjk-ideographic|clone|close-quote|col-resize|collapse|column|consider-shifts|contain|content-box|cover|crosshair|cubic-bezier|dashed|decimal-leading-zero|decimal|default|disabled|disc|disregard-shifts|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ease-in|ease-in-out|ease-out|ease|ellipsis|end|exclude-ruby|fill|fixed|georgian|glyphs|grid-height|groove|hand|hanging|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|icon|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|ideographic|inactive|include-ruby|inherit|initial|inline-block|inline-box|inline-line-height|inline-table|inline|inset|inside|inter-ideograph|inter-word|invert|italic|justify|katakana-iroha|katakana|keep-all|last|left|lighter|line-edge|line-through|line|linear|list-item|local|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|mathematical|max-height|max-size|medium|menu|message-box|middle|move|n-resize|ne-resize|newspaper|no-change|no-close-quote|no-drop|no-open-quote|no-repeat|none|normal|not-allowed|nowrap|nw-resize|oblique|open-quote|outset|outside|overline|padding-box|page|pointer|pre-line|pre-wrap|pre|preserve-3d|progress|relative|repeat-x|repeat-y|repeat|replaced|reset-size|ridge|right|round|row-resize|rtl|s-resize|scroll|se-resize|separate|slice|small-caps|small-caption|solid|space|square|start|static|status-bar|step-end|step-start|steps|stretch|strict|sub|super|sw-resize|table-caption|table-cell|table-column-group|table-column|table-footer-group|table-header-group|table-row-group|table-row|table|tb-rl|text-after-edge|text-before-edge|text-bottom|text-size|text-top|text|thick|thin|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|use-script|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|z-index|zero", f = t.supportConstantColor = "aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow",
                 l = t.supportConstantFonts =
                     "arial|century|comic|courier|garamond|georgia|helvetica|impact|lucida|symbol|system|tahoma|times|trebuchet|utopia|verdana|webdings|sans-serif|serif|monospace",
                 c = t.numRe = "\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))",
                 h = t.pseudoElements =
                     "(\\:+)\\b(after|before|first-letter|first-line|moz-selection|selection)\\b",
                 p = t.pseudoClasses =
                     "(:)\\b(active|checked|disabled|empty|enabled|first-child|first-of-type|focus|hover|indeterminate|invalid|last-child|last-of-type|link|not|nth-child|nth-last-child|nth-last-of-type|nth-of-type|only-child|only-of-type|required|root|target|valid|visited)\\b",
                 d = function() {
                   var e = this.createKeywordMapper({
                     "support.function" : u,
                     "support.constant" : a,
                     "support.type" : o,
                     "support.constant.color" : f,
                     "support.constant.fonts" : l
                   },
                                                    "text", !0),
                       t =
                           [
                             {
                               token : "comment",
                               regex : "\\/\\*",
                               next : "ruleset_comment"
                             },
                             {
                               token : "string",
                               regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                             },
                             {
                               token : "string",
                               regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
                             },
                             {
                               token : [ "constant.numeric", "keyword" ],
                               regex :
                                   "(" + c +
                                       ")(ch|cm|deg|em|ex|fr|gd|grad|Hz|in|kHz|mm|ms|pc|pt|px|rad|rem|s|turn|vh|vm|vw|%)"
                             },
                             {token : "constant.numeric", regex : c}, {
                               token : "constant.numeric",
                               regex : "#[a-f0-9]{6}"
                             },
                             {
                               token : "constant.numeric",
                               regex : "#[a-f0-9]{3}"
                             },
                             {
                               token : [
                                 "punctuation",
                                 "entity.other.attribute-name.pseudo-element.css"
                               ],
                               regex : h
                             },
                             {
                               token : [
                                 "punctuation",
                                 "entity.other.attribute-name.pseudo-class.css"
                               ],
                               regex : p
                             },
                             {
                               token : [
                                 "support.function", "string",
                                 "support.function"
                               ],
                               regex : "(url\\()(.*)(\\))"
                             },
                             {
                               token : e,
                               regex : "\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*"
                             },
                             {caseInsensitive : !0}
                           ],
                       n = i.copyArray(t);
                   n.unshift(
                       {token : "paren.rparen", regex : "\\}", next : "start"});
                   var r = i.copyArray(t);
                   r.unshift(
                       {token : "paren.rparen", regex : "\\}", next : "media"});
                   var s = [ {token : "comment", regex : ".+"} ],
                       d = i.copyArray(s);
                   d.unshift({
                     token : "comment",
                     regex : ".*?\\*\\/",
                     next : "start"
                   });
                   var v = i.copyArray(s);
                   v.unshift({
                     token : "comment",
                     regex : ".*?\\*\\/",
                     next : "media"
                   });
                   var m = i.copyArray(s);
                   m.unshift({
                     token : "comment",
                     regex : ".*?\\*\\/",
                     next : "ruleset"
                   }),
                       this.$rules = {
                         start : [
                           {
                             token : "comment",
                             regex : "\\/\\*",
                             next : "comment"
                           },
                           {
                             token : "paren.lparen",
                             regex : "\\{",
                             next : "ruleset"
                           },
                           {token : "string", regex : "@.*?{", next : "media"},
                           {token : "keyword", regex : "#[a-z0-9-_]+"},
                           {token : "variable", regex : "\\.[a-z0-9-_]+"},
                           {token : "string", regex : ":[a-z0-9-_]+"},
                           {token : "constant", regex : "[a-z0-9-_]+"},
                           {caseInsensitive : !0}
                         ],
                         media : [
                           {
                             token : "comment",
                             regex : "\\/\\*",
                             next : "media_comment"
                           },
                           {
                             token : "paren.lparen",
                             regex : "\\{",
                             next : "media_ruleset"
                           },
                           {token : "string", regex : "\\}", next : "start"},
                           {token : "keyword", regex : "#[a-z0-9-_]+"},
                           {token : "variable", regex : "\\.[a-z0-9-_]+"},
                           {token : "string", regex : ":[a-z0-9-_]+"},
                           {token : "constant", regex : "[a-z0-9-_]+"},
                           {caseInsensitive : !0}
                         ],
                         comment : d,
                         ruleset : n,
                         ruleset_comment : m,
                         media_ruleset : r,
                         media_comment : v
                       }
                 };
             r.inherits(d, s), t.CssHighlightRules = d
           }),
    define(
        "ace/mode/behaviour/css",
        [
          "require", "exports", "module", "ace/lib/oop", "ace/mode/behaviour",
          "ace/mode/behaviour/cstyle", "ace/token_iterator"
        ],
        function(e, t, n) {
          var r = e("../../lib/oop"), i = e("../behaviour").Behaviour,
              s = e("./cstyle").CstyleBehaviour,
              o = e("../../token_iterator").TokenIterator, u = function() {
                this.inherit(s),
                    this.add("colon", "insertion",
                             function(e, t, n, r, i) {
                               if (i === ":") {
                                 var s = n.getCursorPosition(),
                                     u = new o(r, s.row, s.column),
                                     a = u.getCurrentToken();
                                 a && a.value.match(/\s+/) &&
                                     (a = u.stepBackward());
                                 if (a && a.type === "support.type") {
                                   var f = r.doc.getLine(s.row),
                                       l = f.substring(s.column, s.column + 1);
                                   if (l === ":")
                                     return {text : "", selection : [ 1, 1 ]};
                                   if (!f.substring(s.column).match(/^\s*;/))
                                     return { text: ":;", selection: [ 1, 1 ] }
                                 }
                               }
                             }),
                    this.add("colon", "deletion",
                             function(e, t, n, r, i) {
                               var s = r.doc.getTextRange(i);
                               if (!i.isMultiLine() && s === ":") {
                                 var u = n.getCursorPosition(),
                                     a = new o(r, u.row, u.column),
                                     f = a.getCurrentToken();
                                 f && f.value.match(/\s+/) &&
                                     (f = a.stepBackward());
                                 if (f && f.type === "support.type") {
                                   var l = r.doc.getLine(i.start.row),
                                       c = l.substring(i.end.column,
                                                       i.end.column + 1);
                                   if (c === ";")
                                     return i.end.column++, i
                                 }
                               }
                             }),
                    this.add("semicolon", "insertion", function(e, t, n, r, i) {
                      if (i === ";") {
                        var s = n.getCursorPosition(), o = r.doc.getLine(s.row),
                            u = o.substring(s.column, s.column + 1);
                        if (u === ";")
                          return { text: "", selection: [ 1, 1 ] }
                      }
                    })
              };
          r.inherits(u, s), t.CssBehaviour = u
        }),
    define(
        "ace/mode/html_highlight_rules",
        [
          "require", "exports", "module", "ace/lib/oop", "ace/lib/lang",
          "ace/mode/css_highlight_rules", "ace/mode/javascript_highlight_rules",
          "ace/mode/xml_util", "ace/mode/text_highlight_rules"
        ],
        function(e, t, n) {
          var r = e("../lib/oop"), i = e("../lib/lang"),
              s = e("./css_highlight_rules").CssHighlightRules,
              o = e("./javascript_highlight_rules").JavaScriptHighlightRules,
              u = e("./xml_util"),
              a = e("./text_highlight_rules").TextHighlightRules,
              f = i.createMap({
                a : "anchor",
                button : "form",
                form : "form",
                img : "image",
                input : "form",
                label : "form",
                script : "script",
                select : "form",
                textarea : "form",
                style : "style",
                table : "table",
                tbody : "table",
                td : "table",
                tfoot : "table",
                th : "table",
                tr : "table"
              }),
              l = function() {
                this.$rules = {
                  start : [
                    {token : "text", regex : "<\\!\\[CDATA\\[", next : "cdata"},
                    {token : "xml-pe", regex : "<\\?.*?\\?>"},
                    {token : "comment", regex : "<\\!--", next : "comment"},
                    {token : "xml-pe", regex : "<\\!.*?>"}, {
                      token : "meta.tag",
                      regex : "<(?=script\\b)",
                      next : "script"
                    },
                    {
                      token : "meta.tag",
                      regex : "<(?=style\\b)",
                      next : "style"
                    },
                    {token : "meta.tag", regex : "<\\/?", next : "tag"},
                    {token : "text", regex : "\\s+"}, {
                      token : "constant.character.entity",
                      regex :
                          "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"
                    }
                  ],
                  cdata :
                      [ {token : "text", regex : "\\]\\]>", next : "start"} ],
                  comment : [
                    {token : "comment", regex : ".*?-->", next : "start"},
                    {defaultToken : "comment"}
                  ]
                },
                u.tag(this.$rules, "tag", "start", f),
                u.tag(this.$rules, "style", "css-start", f),
                u.tag(this.$rules, "script", "js-start", f),
                this.embedRules(o, "js-",
                                [
                                  {
                                    token : "comment",
                                    regex : "\\/\\/.*(?=<\\/script>)",
                                    next : "tag"
                                  },
                                  {
                                    token : "meta.tag",
                                    regex : "<\\/(?=script)",
                                    next : "tag"
                                  }
                                ]),
                this.embedRules(s, "css-", [
                  {token : "meta.tag", regex : "<\\/(?=style)", next : "tag"}
                ])
              };
          r.inherits(l, a), t.HtmlHighlightRules = l
        }),
    define(
        "ace/mode/xml_util", [ "require", "exports", "module" ],
        function(e, t, n) {
          function r(e) {
            return [
              {token : "string", regex : '"', next : e + "_qqstring"},
              {token : "string", regex : "'", next : e + "_qstring"}
            ]
          }
          function i(e, t) {
            return [
              {token : "string", regex : e, next : t}, {
                token : "constant.language.escape",
                regex :
                    "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"
              },
              {defaultToken : "string"}
            ]
          }
          t.tag = function(e, t, n, s) {
            e[t]=[{token:"text",regex:"\\s+"},{token:s?function(e){return s[e]?"meta.tag.tag-name."+s[e]:"meta.tag.tag-name"}:"meta.tag.tag-name",regex:"[-_a-zA-Z0-9:]+",next:t+"_embed_attribute_list"},{token:"empty",regex:"",next:t+"_embed_attribute_list"}],e[t+"_qstring"]=i("'",t+"_embed_attribute_list"),e[t+"_qqstring"]=i('"',t+"_embed_attribute_list"),e[t+"_embed_attribute_list"]=[{token:"meta.tag.r",regex:"/?>",next:n},{token:"keyword.operator",regex:"="},{token:"entity.other.attribute-name",regex:"[-_a-zA-Z0-9:]+"},{token:"constant.numeric",regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},{token:"text",regex:"\\s+"}].concat(r(t))
          }
        }),
    define("ace/mode/behaviour/html",
           [
             "require", "exports", "module", "ace/lib/oop",
             "ace/mode/behaviour/xml", "ace/mode/behaviour/cstyle",
             "ace/token_iterator"
           ],
           function(e, t, n) {
             function a(e, t) {
               var n = !0, r = e.type.split("."), i = t.split(".");
               return i.forEach(function(e) {
                 if (r.indexOf(e) == -1)
                   return n = !1, !1
               }),
                      n
             }
             var r = e("../../lib/oop"), i = e("../behaviour/xml").XmlBehaviour,
                 s = e("./cstyle").CstyleBehaviour,
                 o = e("../../token_iterator").TokenIterator,
                 u =
                     [
                       "area", "base", "br", "col", "command", "embed", "hr",
                       "img", "input", "keygen", "link", "meta", "param",
                       "source", "track", "wbr"
                     ],
                 f = function() {
                   this.inherit(i),
                       this.add(
                           "autoclosing", "insertion", function(e, t, n, r, i) {
                             if (i == ">") {
                               var s = n.getCursorPosition(),
                                   f = new o(r, s.row, s.column),
                                   l = f.getCurrentToken(), c = !1;
                               if (!l ||
                                   !a(l, "meta.tag") &&
                                       (!a(l, "text") || !l.value.match("/"))) {
                                 do
                                   l = f.stepBackward();
                                 while (l && (a(l, "string") ||
                                              a(l, "keyword.operator") ||
                                              a(l, "entity.attribute-name") ||
                                              a(l, "text")))
                               } else
                                 c = !0;
                               if (!l || !a(l, "meta.tag-name") ||
                                   f.stepBackward().value.match("/"))
                                 return;
                               var h = l.value;
                               if (c)
                                 var h = h.substring(0, s.column - l.start);
                               if (u.indexOf(h) !== -1)
                                 return;
                               return {
                                 text: "></" + h + ">", selection: [ 1, 1 ]
                               }
                             }
                           })
                 };
             r.inherits(f, i), t.HtmlBehaviour = f
           }),
    define(
        "ace/mode/behaviour/xml",
        [
          "require", "exports", "module", "ace/lib/oop", "ace/mode/behaviour",
          "ace/mode/behaviour/cstyle", "ace/token_iterator"
        ],
        function(e, t, n) {
          function u(e, t) {
            var n = !0, r = e.type.split("."), i = t.split(".");
            return i.forEach(function(e) {
              if (r.indexOf(e) == -1)
                return n = !1, !1
            }),
                   n
          }
          var r = e("../../lib/oop"), i = e("../behaviour").Behaviour,
              s = e("./cstyle").CstyleBehaviour,
              o = e("../../token_iterator").TokenIterator, a = function() {
                this.inherit(s, [ "string_dquotes" ]),
                    this.add("autoclosing", "insertion",
                             function(e, t, n, r, i) {
                               if (i == ">") {
                                 var s = n.getCursorPosition(),
                                     a = new o(r, s.row, s.column),
                                     f = a.getCurrentToken(), l = !1;
                                 if (!f || !u(f, "meta.tag") &&
                                               (!u(f, "text") ||
                                                !f.value.match("/"))) {
                                   do
                                     f = a.stepBackward();
                                   while (f && (u(f, "string") ||
                                                u(f, "keyword.operator") ||
                                                u(f, "entity.attribute-name") ||
                                                u(f, "text")))
                                 } else
                                   l = !0;
                                 if (!f || !u(f, "meta.tag-name") ||
                                     a.stepBackward().value.match("/"))
                                   return;
                                 var c = f.value;
                                 if (l)
                                   var c = c.substring(0, s.column - f.start);
                                 return {
                                   text: "></" + c + ">", selection: [ 1, 1 ]
                                 }
                               }
                             }),
                    this.add(
                        "autoindent", "insertion", function(e, t, n, r, i) {
                          if (i == "\n") {
                            var s = n.getCursorPosition(),
                                o = r.doc.getLine(s.row),
                                u = o.substring(s.column, s.column + 2);
                            if (u == "</") {
                              var a = this.$getIndent(r.doc.getLine(s.row)) +
                                      r.getTabString(),
                                  f = this.$getIndent(r.doc.getLine(s.row));
                              return {
                                text: "\n" + a + "\n" + f,
                                    selection: [ 1, a.length, 1, a.length ]
                              }
                            }
                          }
                        })
              };
          r.inherits(a, i), t.XmlBehaviour = a
        }),
    define("ace/mode/folding/html",
           [
             "require", "exports", "module", "ace/lib/oop",
             "ace/mode/folding/mixed", "ace/mode/folding/xml",
             "ace/mode/folding/cstyle"
           ],
           function(e, t, n) {
             var r = e("../../lib/oop"), i = e("./mixed").FoldMode,
                 s = e("./xml").FoldMode, o = e("./cstyle").FoldMode,
                 u = t.FoldMode = function() {
                   i.call(this, new s({
                            area : 1,
                            base : 1,
                            br : 1,
                            col : 1,
                            command : 1,
                            embed : 1,
                            hr : 1,
                            img : 1,
                            input : 1,
                            keygen : 1,
                            link : 1,
                            meta : 1,
                            param : 1,
                            source : 1,
                            track : 1,
                            wbr : 1,
                            li : 1,
                            dt : 1,
                            dd : 1,
                            p : 1,
                            rt : 1,
                            rp : 1,
                            optgroup : 1,
                            option : 1,
                            colgroup : 1,
                            td : 1,
                            th : 1
                          }),
                          {"js-" : new o, "css-" : new o})
                 };
             r.inherits(u, i)
           }),
    define("ace/mode/folding/mixed",
           [
             "require", "exports", "module", "ace/lib/oop",
             "ace/mode/folding/fold_mode"
           ],
           function(e, t, n) {
             var r = e("../../lib/oop"), i = e("./fold_mode").FoldMode,
                 s = t.FoldMode = function(
                     e, t) { this.defaultMode = e, this.subModes = t };
             r.inherits(s, i), function() {
               this.$getMode = function(e) {
                 for (var t in this.subModes)
                   if (e.indexOf(t) === 0)
                     return this.subModes[t];
                 return null
               }, this.$tryMode = function(e, t, n, r) {
                 var i = this.$getMode(e);
                 return i ? i.getFoldWidget(t, n, r) : ""
               }, this.getFoldWidget = function(e, t, n) {
                 return this.$tryMode(e.getState(n - 1), e, t, n) ||
                        this.$tryMode(e.getState(n), e, t, n) ||
                        this.defaultMode.getFoldWidget(e, t, n)
               }, this.getFoldWidgetRange = function(e, t, n) {
                 var r = this.$getMode(e.getState(n - 1));
                 if (!r || !r.getFoldWidget(e, t, n))
                   r = this.$getMode(e.getState(n));
                 if (!r || !r.getFoldWidget(e, t, n))
                   r = this.defaultMode;
                 return r.getFoldWidgetRange(e, t, n)
               }
             }.call(s.prototype)
           }),
    define("ace/mode/folding/xml",
           [
             "require", "exports", "module", "ace/lib/oop", "ace/lib/lang",
             "ace/range", "ace/mode/folding/fold_mode", "ace/token_iterator"
           ],
           function(e, t, n) {
             var r = e("../../lib/oop"), i = e("../../lib/lang"),
                 s = e("../../range").Range, o = e("./fold_mode").FoldMode,
                 u = e("../../token_iterator").TokenIterator,
                 a = t.FoldMode = function(e) {
                   o.call(this), this.voidElements = e || {}
                 };
             r.inherits(a, o), function() {
               this.getFoldWidget =
                   function(e, t, n) {
                 var r = this._getFirstTagInLine(e, n);
                 return r.closing
                            ? t == "markbeginend" ? "end" : ""
                            : !r.tagName ||
                                      this.voidElements[r.tagName.toLowerCase()]
                                  ? ""
                                  : r.selfClosing
                                        ? ""
                                        : r.value.indexOf("/" + r.tagName) !==
                                                  -1
                                              ? ""
                                              : "start"
               },
               this._getFirstTagInLine =
                   function(e, t) {
                 var n = e.getTokens(t), r = "";
                 for (var s = 0; s < n.length; s++) {
                   var o = n[s];
                   o.type.indexOf("meta.tag") === 0
                       ? r += o.value
                       : r += i.stringRepeat(" ", o.value.length)
                 }
                 return this._parseTag(r)
               },
               this.tagRe = /^(\s*)(<?(\/?)([-_a-zA-Z0-9:!]*)\s*(\/?)>?)/,
               this._parseTag = function(e) {
                 var t = this.tagRe.exec(e), n = this.tagRe.lastIndex || 0;
                 return this.tagRe.lastIndex = 0, {
                   value: e, match: t ? t[2] : "", closing: t ? !!t[3] : !1,
                       selfClosing: t ? !!t[5] || t[2] == "/>" : !1,
                       tagName: t ? t[4] : "",
                       column: t[1] ? n + t[1].length : n
                 }
               }, this._readTagForward = function(e) {
                 var t = e.getCurrentToken();
                 if (!t)
                   return null;
                 var n = "", r;
                 do
                   if (t.type.indexOf("meta.tag") === 0) {
                     if (!r)
                       var r = {
                         row : e.getCurrentTokenRow(),
                         column : e.getCurrentTokenColumn()
                       };
                     n += t.value;
                     if (n.indexOf(">") !== -1) {
                       var i = this._parseTag(n);
                       return i.start = r, i.end = {
                         row : e.getCurrentTokenRow(),
                         column : e.getCurrentTokenColumn() + t.value.length
                       },
                              e.stepForward(), i
                     }
                   }
                 while (t = e.stepForward());
                 return null
               }, this._readTagBackward = function(e) {
                 var t = e.getCurrentToken();
                 if (!t)
                   return null;
                 var n = "", r;
                 do
                   if (t.type.indexOf("meta.tag") === 0) {
                     r || (r = {
                       row : e.getCurrentTokenRow(),
                       column : e.getCurrentTokenColumn() + t.value.length
                     }),
                         n = t.value + n;
                     if (n.indexOf("<") !== -1) {
                       var i = this._parseTag(n);
                       return i.end = r, i.start = {
                         row : e.getCurrentTokenRow(),
                         column : e.getCurrentTokenColumn()
                       },
                              e.stepBackward(), i
                     }
                   }
                 while (t = e.stepBackward());
                 return null
               }, this._pop = function(e, t) {
                 while (e.length) {
                   var n = e[e.length - 1];
                   if (!t || n.tagName == t.tagName)
                     return e.pop();
                   if (this.voidElements[t.tagName])
                     return;
                   if (this.voidElements[n.tagName]) {
                     e.pop();
                     continue
                   }
                   return null
                 }
               }, this.getFoldWidgetRange = function(e, t, n) {
                 var r = this._getFirstTagInLine(e, n);
                 if (!r.match)
                   return null;
                 var i = r.closing || r.selfClosing, o = [], a;
                 if (!i) {
                   var f = new u(e, n, r.column),
                       l = {row : n, column : r.column + r.tagName.length + 2};
                   while (a = this._readTagForward(f)) {
                     if (a.selfClosing) {
                       if (!o.length)
                         return a.start.column += a.tagName.length + 2,
                                a.end.column -= 2, s.fromPoints(a.start, a.end);
                       continue
                     }
                     if (a.closing) {
                       this._pop(o, a);
                       if (o.length == 0)
                         return s.fromPoints(l, a.start)
                     } else
                       o.push(a)
                   }
                 } else {
                   var f = new u(e, n, r.column + r.match.length),
                       c = {row : n, column : r.column};
                   while (a = this._readTagBackward(f)) {
                     if (a.selfClosing) {
                       if (!o.length)
                         return a.start.column += a.tagName.length + 2,
                                a.end.column -= 2, s.fromPoints(a.start, a.end);
                       continue
                     }
                     if (!a.closing) {
                       this._pop(o, a);
                       if (o.length == 0)
                         return a.start.column += a.tagName.length + 2,
                                s.fromPoints(a.start, c)
                     } else
                       o.push(a)
                   }
                 }
               }
             }.call(a.prototype)
           }),
    define("ace/mode/lua",
           [
             "require", "exports", "module", "ace/lib/oop", "ace/mode/text",
             "ace/tokenizer", "ace/mode/lua_highlight_rules",
             "ace/mode/folding/lua", "ace/range"
           ],
           function(e, t, n) {
             var r = e("../lib/oop"), i = e("./text").Mode,
                 s = e("../tokenizer").Tokenizer,
                 o = e("./lua_highlight_rules").LuaHighlightRules,
                 u = e("./folding/lua").FoldMode, a = e("../range").Range,
                 f = function() {
                   this.$tokenizer = new s((new o).getRules()),
                   this.foldingRules = new u
                 };
             r.inherits(f, i), function() {
               function n(t) {
                 var n = 0;
                 for (var r = 0; r < t.length; r++) {
                   var i = t[r];
                   i.type == "keyword" ? i.value in e && (n += e[i.value])
                                       : i.type == "paren.lparen"
                                             ? n++
                                             : i.type == "paren.rparen" && n--
                 }
                 return n < 0 ? -1 : n > 0 ? 1 : 0
               }
               this.lineCommentStart = "--",
               this.blockComment = {start : "--[", end : "]--"};
               var e = {
                 "function" : 1,
                 then : 1,
                 "do" : 1,
                 "else" : 1,
                 elseif : 1,
                 repeat : 1,
                 end : -1,
                 until : -1
               },
                   t = [ "else", "elseif", "end", "until" ];
               this.getNextLineIndent = function(e, t, r) {
                 var i = this.$getIndent(t), s = 0,
                     o = this.$tokenizer.getLineTokens(t, e), u = o.tokens;
                 return e == "start" && (s = n(u)),
                        s > 0 ? i + r
                              : s < 0 && i.substr(i.length - r.length) == r &&
                                        !this.checkOutdent(e, t, "\n")
                                    ? i.substr(0, i.length - r.length)
                                    : i
               }, this.checkOutdent = function(e, n, r) {
                 if (r != "\n" && r != "\r" && r != "\r\n")
                   return !1;
                 if (n.match(/^\s*[\)\}\]]$/))
                   return !0;
                 var i = this.$tokenizer.getLineTokens(n.trim(), e).tokens;
                 return !i || !i.length ? !1
                                        : i[0].type == "keyword" &&
                                              t.indexOf(i[0].value) != -1
               }, this.autoOutdent = function(e, t, r) {
                 var i = t.getLine(r - 1), s = this.$getIndent(i).length,
                     o = this.$tokenizer.getLineTokens(i, "start").tokens,
                     u = t.getTabString().length, f = s + u * n(o),
                     l = this.$getIndent(t.getLine(r)).length;
                 if (l < f)
                   return;
                 t.outdentRows(new a(r, 0, r + 2, 0))
               }
             }.call(f.prototype), t.Mode = f
           }),
    define(
        "ace/mode/lua_highlight_rules",
        [
          "require", "exports", "module", "ace/lib/oop",
          "ace/mode/text_highlight_rules"
        ],
        function(e, t, n) {
          var r = e("../lib/oop"),
              i = e("./text_highlight_rules").TextHighlightRules,
              s = function() {
                var e = "break|do|else|elseif|end|for|function|if|in|local|repeat|return|then|until|while|or|and|not",
                    t = "true|false|nil|_G|_VERSION",
                    n = "string|xpcall|package|tostring|print|os|unpack|require|getfenv|setmetatable|next|assert|tonumber|io|rawequal|collectgarbage|getmetatable|module|rawset|math|debug|pcall|table|newproxy|type|coroutine|_G|select|gcinfo|pairs|rawget|loadstring|ipairs|_VERSION|dofile|setfenv|load|error|loadfile|sub|upper|len|gfind|rep|find|match|char|dump|gmatch|reverse|byte|format|gsub|lower|preload|loadlib|loaded|loaders|cpath|config|path|seeall|exit|setlocale|date|getenv|difftime|remove|time|clock|tmpname|rename|execute|lines|write|close|flush|open|output|type|read|stderr|stdin|input|stdout|popen|tmpfile|log|max|acos|huge|ldexp|pi|cos|tanh|pow|deg|tan|cosh|sinh|random|randomseed|frexp|ceil|floor|rad|abs|sqrt|modf|asin|min|mod|fmod|log10|atan2|exp|sin|atan|getupvalue|debug|sethook|getmetatable|gethook|setmetatable|setlocal|traceback|setfenv|getinfo|setupvalue|getlocal|getregistry|getfenv|setn|insert|getn|foreachi|maxn|foreach|concat|sort|remove|resume|yield|status|wrap|create|running|__add|__sub|__mod|__unm|__concat|__lt|__index|__call|__gc|__metatable|__mul|__div|__pow|__len|__eq|__le|__newindex|__tostring|__mode|__tonumber",
                    r = "string|package|os|io|math|debug|table|coroutine",
                    i = "", s = "setn|foreach|foreachi|gcinfo|log10|maxn",
                    o = this.createKeywordMapper({
                      keyword : e,
                      "support.function" : n,
                      "invalid.deprecated" : s,
                      "constant.library" : r,
                      "constant.language" : t,
                      "invalid.illegal" : i,
                      "variable.language" : "this"
                    },
                                                 "identifier"),
                    u = "(?:(?:[1-9]\\d*)|(?:0))", a = "(?:0[xX][\\dA-Fa-f]+)",
                    f = "(?:" + u + "|" + a + ")", l = "(?:\\.\\d+)",
                    c = "(?:\\d+)",
                    h = "(?:(?:" + c + "?" + l + ")|(?:" + c + "\\.))",
                    p = "(?:" + h + ")";
                this.$rules = {
                  start : [
                    {
                      stateName : "bracketedComment",
                      onMatch : function(e, t, n) {
                        return n.unshift(this.next, e.length, t), "comment"
                      },
                      regex : /\-\-\[=*\[/,
                      next : [
                        {
                          onMatch : function(e, t, n) {
                            return e.length == n[1] ? (n.shift(), n.shift(),
                                                       this.next = n.shift())
                                                    : this.next = "",
                                                      "comment"
                          },
                          regex : /(?:[^\\]|\\.)*?\]=*\]/,
                          next : "start"
                        },
                        {defaultToken : "comment"}
                      ]
                    },
                    {token : "comment", regex : "\\-\\-.*$"}, {
                      stateName : "bracketedString",
                      onMatch : function(e, t, n) {
                        return n.unshift(this.next, e.length, t), "comment"
                      },
                      regex : /\[=*\[/,
                      next : [
                        {
                          onMatch : function(e, t, n) {
                            return e.length == n[1] ? (n.shift(), n.shift(),
                                                       this.next = n.shift())
                                                    : this.next = "",
                                                      "comment"
                          },
                          regex : /(?:[^\\]|\\.)*?\]=*\]/,
                          next : "start"
                        },
                        {defaultToken : "comment"}
                      ]
                    },
                    {token : "string", regex : '"(?:[^\\\\]|\\\\.)*?"'},
                    {token : "string", regex : "'(?:[^\\\\]|\\\\.)*?'"},
                    {token : "constant.numeric", regex : p},
                    {token : "constant.numeric", regex : f + "\\b"},
                    {token : o, regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}, {
                      token : "keyword.operator",
                      regex :
                          "\\+|\\-|\\*|\\/|%|\\#|\\^|~|<|>|<=|=>|==|~=|=|\\:|\\.\\.\\.|\\.\\."
                    },
                    {token : "paren.lparen", regex : "[\\[\\(\\{]"},
                    {token : "paren.rparen", regex : "[\\]\\)\\}]"},
                    {token : "text", regex : "\\s+|\\w+"}
                  ]
                },
                this.normalizeRules()
              };
          r.inherits(s, i), t.LuaHighlightRules = s
        }),
    define(
        "ace/mode/folding/lua",
        [
          "require", "exports", "module", "ace/lib/oop",
          "ace/mode/folding/fold_mode", "ace/range", "ace/token_iterator"
        ],
        function(e, t, n) {
          var r = e("../../lib/oop"), i = e("./fold_mode").FoldMode,
              s = e("../../range").Range,
              o = e("../../token_iterator").TokenIterator,
              u = t.FoldMode = function() {};
          r.inherits(u, i), function() {
            this.foldingStartMarker =
                /\b(function|then|do|repeat)\b|{\s*$|(\[=*\[)/,
            this.foldingStopMarker = /\bend\b|^\s*}|\]=*\]/,
            this.getFoldWidget = function(e, t, n) {
              var r = e.getLine(n), i = this.foldingStartMarker.test(r),
                  s = this.foldingStopMarker.test(r);
              if (i && !s) {
                var o = r.match(this.foldingStartMarker);
                if (o[1] == "then" && /\belseif\b/.test(r))
                  return;
                if (o[1]) {
                  if (e.getTokenAt(n, o.index + 1).type === "keyword")
                    return "start"
                } else {
                  if (!o[2])
                    return "start";
                  var u = e.bgTokenizer.getState(n) || "";
                  if (u[0] == "bracketedComment" || u[0] == "bracketedString")
                    return "start"
                }
              }
              if (t != "markbeginend" || !s || i && s)
                return "";
              var o = r.match(this.foldingStopMarker);
              if (o[0] === "end") {
                if (e.getTokenAt(n, o.index + 1).type === "keyword")
                  return "end"
              } else {
                if (o[0][0] !== "]")
                  return "end";
                var u = e.bgTokenizer.getState(n - 1) || "";
                if (u[0] == "bracketedComment" || u[0] == "bracketedString")
                  return "end"
              }
            }, this.getFoldWidgetRange = function(e, t, n) {
              var r = e.doc.getLine(n), i = this.foldingStartMarker.exec(r);
              if (i)
                return i[1]
                           ? this.luaBlock(e, n, i.index + 1)
                           : i[2]
                                 ? e.getCommentFoldRange(n, i.index + 1)
                                 : this.openingBracketBlock(e, "{", n, i.index);
              var i = this.foldingStopMarker.exec(r);
              if (i)
                return i[0] === "end" &&
                               e.getTokenAt(n, i.index + 1).type === "keyword"
                           ? this.luaBlock(e, n, i.index + 1)
                           : i[0][0] === "]"
                                 ? e.getCommentFoldRange(n, i.index + 1)
                                 : this.closingBracketBlock(
                                       e, "}", n, i.index + i[0].length)
            }, this.luaBlock = function(e, t, n) {
              var r = new o(e, t, n), i = {
                "function" : 1,
                "do" : 1,
                then : 1,
                elseif : -1,
                end : -1,
                repeat : 1,
                until : -1
              },
                  u = r.getCurrentToken();
              if (!u || u.type != "keyword")
                return;
              var a = u.value, f = [ a ], l = i[a];
              if (!l)
                return;
              var c = l === -1 ? r.getCurrentTokenColumn()
                               : e.getLine(t).length,
                  h = t;
              r.step = l === -1 ? r.stepBackward : r.stepForward;
              while (u = r.step()) {
                if (u.type !== "keyword")
                  continue;
                var p = l * i[u.value];
                if (p > 0)
                  f.unshift(u.value);
                else if (p <= 0) {
                  f.shift();
                  if (!f.length && u.value != "elseif")
                    break;
                  p === 0 && f.unshift(u.value)
                }
              }
              var t = r.getCurrentTokenRow();
              return l === -1 ? new s(t, e.getLine(t).length, h, c)
                              : new s(h, c, t, r.getCurrentTokenColumn())
            }
          }.call(u.prototype)
        }),
    define("ace/mode/luapage_highlight_rules",
           [
             "require", "exports", "module", "ace/lib/oop",
             "ace/mode/html_highlight_rules", "ace/mode/lua_highlight_rules"
           ],
           function(e, t, n) {
             var r = e("../lib/oop"),
                 i = e("./html_highlight_rules").HtmlHighlightRules,
                 s = e("./lua_highlight_rules").LuaHighlightRules,
                 o = function() {
                   this.$rules = (new i).getRules();
                   for (var e in this.$rules)
                     this.$rules[e].unshift({
                       token : "keyword",
                       regex : "<\\%\\=?",
                       next : "lua-start"
                     },
                                            {
                                              token : "keyword",
                                              regex : "<\\?lua\\=?",
                                              next : "lua-start"
                                            });
                   this.embedRules(s, "lua-", [
                     {token : "keyword", regex : "\\%>", next : "start"},
                     {token : "keyword", regex : "\\?>", next : "start"}
                   ])
                 };
             r.inherits(o, i), t.LuaPageHighlightRules = o
           })