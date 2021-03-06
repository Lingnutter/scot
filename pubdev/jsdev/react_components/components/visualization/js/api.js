// Generated by CoffeeScript 1.11.1
(function() {
  var API, Http, Result, ResultPromise, Utils, ref,
    hasProp = {}.hasOwnProperty;

  Http = require('./http');

  ref = require('./result'), Result = ref.Result, ResultPromise = ref.ResultPromise;

  Utils = require('./utils');

  API = {
    fetch: function(url) {
      return Http.asyncjson("GET", url).map(function(r) {
        if ('queryRecordCount' in r) {
          return r.records;
        } else {
          return r;
        }
      });
    },
    stringify: function(data) {
      switch (false) {
        case !((typeof data) === "string"):
          return data;
        case !((typeof data) === 'number'):
          return data;
        case !Utils.isArray(data):
          return escape(JSON.stringify(data));
        case !Utils.isObject(data):
          return escape(JSON.stringify(data));
        default:
          return escape(JSON.stringify(data));
      }
    },
    paramstr: function(params) {
      var flattened, p, s, v, val;
      flattened = [];
      for (p in params) {
        if (!hasProp.call(params, p)) continue;
        v = params[p];
        if (Utils.isArray(v)) {
          flattened = flattened.concat((function() {
            var i, len, results;
            results = [];
            for (i = 0, len = v.length; i < len; i++) {
              val = v[i];
              results.push(p + '=' + (API.stringify(val)));
            }
            return results;
          })());
        } else {
          flattened.push(p + '=' + (API.stringify(v)));
        }
      }
      s = flattened.join('&');
      if (s !== '') {
        return '?' + s;
      } else {
        return s;
      }
    },
    url: function(path, params) {
      var url;
      url = window.location.origin + path;
      if ('id' in params) {
        url += '/' + params.id;
        delete params.id;
        if ('sub' in params) {
          url += '/' + params.sub;
          delete params.sub;
        }
      }
      if ('sub' in params) {
        throw "{sub: " + params.sub + "} provided without an 'id' in API call to " + path;
      }
      return url + (this.paramstr(params));
    },
    entry: function(params) {
      return this.fetch(this.url('/scot/api/v2/entry', params));
    },
    entity: function(params) {
      return this.fetch(this.url('/scot/api/v2/entity', params));
    },
    alertgroup: function(params) {
      return this.fetch(this.url('/scot/api/v2/alertgroup', params));
    },
    alert: function(params) {
      return this.fetch(this.url("/scot/api/v2/alert", params));
    },
    event: function(params) {
      return this.fetch(this.url("/scot/api/v2/event", params));
    },
    tag: function(params) {
      return this.fetch(this.url("/scot/api/v2/tag", params));
    },
    commands: {
      server: function(argv, data, ctx) {
        if (argv.length < 1) {
          return Result.err("server: you must provide a URL to use for the default API server");
        }
        window.API.server = argv[0];
        return Result.wrap(window.API.server);
      },
      help__api: (function(_this) {
        return function() {
          return "SCOT API endpoint helpers\n\nThe API module offers helpers to make it easy to query the\nvarious endpoints of the SCOT API. Each command has its\nown help defined, so look there for more details if you\nneed them. All API commands have a few properties in\ncommon though:\n\n    1. You specify the URL parameters as a javascript\n    object on the command line (or as the sole argument to\n    the function if you're calling it from user code).\n\n    2. There are two special parameters that behave\n    slightly differently: 'id', and 'sub'. 'id' allows you\n    to specify which specific object you're interested in,\n    and 'sub' allows you to get items that are referenced\n    by the parent object. For example, you can query the\n    entity endpoint without id or sub, and you'll get a\n    list of entries. If you add the id, you'll get the\n    single entry with that id. If you add sub: 'entity',\n    you'll get the list of entities associated with that\n    entry. This pattern applies to all API endpoints.\n\nAll API functions are available from within your pipeline\nfunctions under the API namespace (e.g. API.entity).\n\nPROMISES\n\nIf you use the API endpoints from inside user code (for\nexample mapping the entry helper over a list of ids from\nsome other source), be aware that these endpoints are\nasynchronous and thus return ResultPromise instances. If\nyou want to turn a list of ResultPromise instances into a\nlist of actual instances, use the wait command (see 'help\nwait' for more on that one).";
        };
      })(this),
      help__entry: function() {
        return "entry [params]\n\nQuery the /scot/api/v2/entry API endpoint. params is an\noptional object with name/value pairs that will be turned\ninto parameters in a GET URL. If you specify an 'id' in\nthe params, the path will be changed to\n/scot/api/v2/entry/<id>. You can also supply the 'sub' key\nin the params, which should be the name of a thing that is\nreferenced by the entry (for example: sub: 'entity' to get\nthe entities associated with the entry). If you provide\nsub, you must also provide an id.\n\nYou can access this from a pipeline function under the\nname API.entry.\n\nExample:\n    $ entry id:10987,limit:2\n    [ {id:...},{id:...}]\n\n    $ entry id:10987,sub:'entity',limit:1\n    [{id:...}]\n    \n    In the first example, the actual API endpoint queried is\n    '/scot/api/v2/entry/10987?limit=2'\n\n    In the second example, the endpoint is\n    '/scot/api/v2/entry/10987/entity?limit=1'";
      },
      entry: function(argv, data, ctx) {
        return Utils.parsevalue(argv.join(' '), ctx).map(function(p) {
          return API.entry(p);
        }).map_err(function(e) {
          return Result.err('entry: ' + e);
        });
      },
      help__alertgroup: function() {
        return "alertgroup [params]\n\nQuery the /scot/api/v2/alertgroup API endpoint. params is an\noptional object with name/value pairs that will be turned\ninto parameters in a GET URL. If you specify an 'id' in\nthe params, the path will be changed to\n/scot/api/v2/alertgroup/<id>. You can also supply the 'sub' key\nin the params, which should be the name of a thing that is\nreferenced by the alertgroup (for example: sub: 'alert' to get\nthe alerts associated with the alertgroup). If you provide\nsub, you must also provide an id.\n\nYou can access this from a pipeline function under the\nname API.alertgroup.\n\nExample:\n    $ alertgroup id:10987,limit:2\n    [ {id:...},{id:...}]\n\n    $ alertgroup id:10987,sub:'alert',limit:1\n    [{id:...}]\n    \n    In the first example, the actual API endpoint queried is\n    '/scot/api/v2/alertgroup/10987?limit=2'\n\n    In the second example, the endpoint is\n    '/scot/api/v2/alertgroup/10987/alert?limit=1'";
      },
      alertgroup: function(argv, data, ctx) {
        return Utils.parsevalue(argv.join(' '), ctx).map(function(p) {
          return API.alertgroup(p);
        }).map_err(function(e) {
          return Result.err('alertgroup: ' + e);
        });
      },
      help__entity: function() {
        return "entity [params]\n\nQuery the /scot/api/v2/entity API endpoint. params is an\noptional object with name/value pairs that will be turned\ninto parameters in a GET URL. If you specify an 'id' in\nthe params, the path will be changed to\n/scot/api/v2/entity/<id>. You can also supply the 'sub'\nkey in the params, which should be the name of a thing\nthat is referenced by the entity (for example: sub:\n'entry' to get the entries associated with the entity). If\nyou provide sub, you must also provide an id.\n\nYou can access this from a pipeline function under the\nname API.entity.\n\nExample:\n    $ entity id:10987,limit:2\n    [ {id:...},{id:...}]\n\n    $ entity id:10987,sub:'entry',limit:1\n    [{id:...}]\n    \n    In the first example, the actual API endpoint queried is\n    '/scot/api/v2/entity/10987?limit=2'\n\n    In the second example, the endpoint is\n    '/scot/api/v2/entity/10987/entry?limit=1'";
      },
      entity: function(argv, data, ctx) {
        return Utils.parsevalue(argv.join(' '), ctx).map(function(p) {
          return API.entity(p);
        }).map_err(function(e) {
          return Result.err('entity: ' + e);
        });
      },
      help__alert: function() {
        return "alert [params]\n\nQuery the /scot/api/v2/alert API endpoint. params is an\noptional object with name/value pairs that will be turned\ninto parameters in a GET URL. If you specify an 'id' in\nthe params, the path will be changed to\n/scot/api/v2/alert/<id>. You can also supply the 'sub' key\nin the params, which should be the name of a thing that is\nreferenced by the alert (for example: sub: 'entry' to get\nthe entries associated with the alert). If you provide\nsub, you must also provide an id.\n\nYou can access this from a pipeline function under the\nname API.alert.\n\nExample:\n    $ alert id:10987,limit:2\n    [ {id:...},{id:...}]\n\n    $ alert id:10987,sub:'entry',limit:1\n    [{id:...}]\n    \n    In the first example, the actual API endpoint queried is\n    '/scot/api/v2/alert/10987?limit=2'\n\n    In the second example, the endpoint is\n    '/scot/api/v2/alert/10987/entry?limit=1'";
      },
      alert: function(argv, data, ctx) {
        return Utils.parsevalue(argv.join(' '), ctx).map(function(p) {
          return API.alert(p);
        }).map_err(function(e) {
          return Result.err('alert: ' + e);
        });
      },
      help__event: function() {
        return "event [params]\n\nQuery the /scot/api/v2/event API endpoint. params is an\noptional object with name/value pairs that will be turned\ninto parameters in a GET URL. If you specify an 'id' in\nthe params, the path will be changed to\n/scot/api/v2/event/<id>. You can also supply the 'sub' key\nin the params, which should be the name of a thing that is\nreferenced by the event (for example: sub: 'entry' to get\nthe entries associated with the event). If you provide\nsub, you must also provide an id.\n\nYou can access this from a pipeline function under the\nname API.event.\n\nExample:\n    $ event id:10987,limit:2\n    [ {id:...},{id:...}]\n\n    $ event id:10987,sub:'entry',limit:1\n    [{id:...}]\n    \n    In the first example, the actual API endpoint queried is\n    '/scot/api/v2/event/10987?limit=2'\n\n    In the second example, the endpoint is\n    '/scot/api/v2/event/10987/entity?limit=1'";
      },
      event: function(argv, data, ctx) {
        return Utils.parsevalue(argv.join(' '), ctx).map(function(p) {
          return API.event(p);
        }).map_err(function(e) {
          return Result.err('event: ' + e);
        });
      },
      tag: function(argv, data, ctx) {
        return Utils.parsevalue(argv.join(' '), ctx).map(function(p) {
          return API.tag(p);
        }).map_err(function(e) {
          return Result.err('tag: ' + e);
        });
      }
    }
  };

  module.exports = API;

}).call(this);

//# sourceMappingURL=api.js.map
