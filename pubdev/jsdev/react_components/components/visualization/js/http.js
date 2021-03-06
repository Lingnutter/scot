// Generated by CoffeeScript 1.11.1
(function() {
  var Http, Result, ResultPromise, Utils, ref;

  Utils = require('./utils');

  ref = require('./result'), Result = ref.Result, ResultPromise = ref.ResultPromise;

  Http = {
    asyncjson: function(method, url, data) {
      var ret, rq;
      rq = new XMLHttpRequest();
      rq.open(method, url, true);
      ret = new ResultPromise();
      rq.onreadystatechange = function() {
        var ref1;
        if (this.readyState === 4) {
          if ((200 <= (ref1 = rq.status) && ref1 < 400)) {
            data = JSON.parse(rq.responseText);
            return ret.fulfill(data);
          } else {
            return ret.fail(rq.statusText);
          }
        }
      };
      rq.send(null);
      return ret;
    },
    syncjson: function(method, url, data) {
      var ref1, rq;
      rq = new XMLHttpRequest();
      rq.open(method, url, false);
      if (data) {
        rq.setRequestHeader("Content-Type", "text/plain");
        rq.send(JSON.stringify(data));
      } else {
        rq.send(null);
      }
      if ((200 <= (ref1 = rq.status) && ref1 < 400)) {
        console.log(JSON.stringify(rq));
        data = JSON.parse(rq.responseText);
        return Result.wrap(data);
      } else {
        return Result.err(rq.statusText);
      }
    },
    commands: {
      help__get_s: function() {
        return "get_s <URL>\n\n*Synchronously* fetch JSON data from the given URL using\nthe HTTP GET method. If you have data in the pipeline\ngoing in, it will be sent to the server as the request\nbody in JSON format.\n\nThis command operates in synchronous mode, which means\nyour browser will stop until the request completes. For an\ninteractive command line, this typically isn't a problem,\nbut if your request might take a long time and you want do\nuse the browser for other things in the mean time, use the\nplain 'get' command instead.\n\nExample:\n    $ get_s 'http://foo.com/jsonstuff' \\ (item)->item.name\n\nThe example fetches a list of somethings from foo.com and\nextracts the name field of each one, returning a list of\nnames.";
      },
      get_s: function(argv, d, ctx) {
        return (Utils.parsevalue(argv[0], ctx)).map_err(function(e) {
          return Result.err("You must provide a valid URL on the command line");
        }).map(function(url) {
          return Http.syncjson("GET", url, d);
        }).map_err(function(e) {
          return Result.err("get: " + e);
        });
      },
      help__get: function() {
        return "get <URL>\n\nThis is the asynchronous version of the HTTP GET\nmethod. Use it to fetch JSON formatted data from a remote\nserver. The data will be automatically parsed into\njavascript objects compatible with the command pipeline.\n\nThis command operates in asynchronous mode, which means\nthat you should be able to interact with your browser\nwhile the request is waiting to be fulfilled. The command\nline will still wait until the request is fulfilled and\nfinish running the remaining pipeline at that time.\n\n Example:\n    $ get_s 'http://foo.com/jsonstuff' \\ (item)->item.name\n\nThe example fetches a list of somethings from foo.com and\nextracts the name field of each one, returning a list of\nnames.";
      },
      get: function(argv, d, ctx) {
        return (Utils.parsevalue(argv[0], ctx)).map_err(function(e) {
          return Result.err("You must provide a valid URL on the command line");
        }).map(function(url) {
          return Http.asyncjson("GET", url, d);
        }).map_err(function(e) {
          return Result.err("get: " + e);
        });
      },
      help__put: function() {
        return "put <URL>\n\nSend data to the server using the HTTP PUT method. Data\ncan be embedded in the URL or it can be provided from the\npipeline. Any data coming in to the put command on the\npipeline will be sent to the server as the request body.\n\nExample:\n    $ {superbling: true} \\ put \"http://bling-o-meter.com/myaccount/set\"\n\nThe example sets superbling on your account.";
      },
      put: function(argv, d, ctx) {
        return (Utils.parsevalue(argv[0], ctx)).map_err(function(e) {
          return Result.err("You must provide a valid URL on the command line");
        }).map(function(url) {
          return Http.asyncjson("PUT", url, d);
        }).map_err(function(e) {
          return Result.err("put: " + e);
        });
      }
    }
  };

  module.exports = Http;

}).call(this);

//# sourceMappingURL=http.js.map
