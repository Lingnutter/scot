// Generated by CoffeeScript 1.11.1
(function() {
  var Result, Strings, Utils;

  Utils = require('./utils');

  Result = require('./result').Result;

  Strings = {
    pat: {
      ip: /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/,
      hostname: /([a-zA-Z0-9_\-]\.)+[a-zA-Z0-9_\-]+/,
      unixtime: /1[0-9]{9}\.[0-9]{6}/,
      hms: /([0-9]{2}):([0-9]{2}):([0-9]{2})/,
      timedate: /(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ([0-9]+) ([0-9]+):([0-9+):([0-9]+) ([0-9]+)/,
      email: /[^ ]+@([a-zA-Z0-9_\-]+\.)+[a-zA-Z0-9_\-]+/
    },
    pick: function(rx, str) {
      var match, re, result;
      re = new RegExp(rx.source, 'g');
      result = [];
      match = null;
      while ((match = re.exec(str))) {
        result.push(match);
      }
      return result;
    },
    commands: {
      help__pick: function() {
        return "pick <regex>\n\nScan the piped in string for instances of regex, and\nreturn a list of all matches. Each element of the list\nwill be the full match object from the regex match, so you\ncan access the index and the input from each match.\n\nThis function is also available inside your pipeline\nfunctions under the name Strings.pick. If you call it\ndirectly, pass the regular expression as the first\nargument and the string to pick from as the second\nargument\n\nExample:\n    $ \"abcdefghi\" \\ pick /[a-z]{3}\n    [[\"abc\",index:0,input:\"abcdefghi\"],\n     [\"def\",index:3,input:\"abcdefghi\"],\n     [\"ghi\",index:6,input:\"abcdefghi\"]]\n\n    $ [\"abc\",\"def\",\"ghi\"] \\ (s)->Strings.pick /[a-z]{2}/, s\n    [[\"ab\",index:0,input:\"abc\"],[\"de\",index:0,input:\"def\"],[\"gh\",index:0,input\"ghi\"]]";
      },
      pick: function(argv, d, ctx) {
        return (Utils.parsevalue(argv[0], ctx)).map(function(re) {
          if (!re instanceof RegExp) {
            return Result.err("Please supply a regular expression on the command line");
          }
          return Result.wrap(Strings.pick(re, d));
        }).map_err(function(e) {
          return Result.err("pick: " + e);
        });
      }
    }
  };

  module.exports = Strings;

}).call(this);

//# sourceMappingURL=strings.js.map
