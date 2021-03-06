// Generated by CoffeeScript 1.11.1
(function() {
  var Forcegraph, Result, Utils,
    hasProp = {}.hasOwnProperty;

  Result = require('./result').Result;

  Utils = require('./utils');

  Forcegraph = (function() {
    Forcegraph.commands = {
      help__forcegraph: function() {
        return "forcegraph [naming proc]\n\nforcegraph produces a nodes-and-links graph from the data\nprovided. It expects either an object with a key for each\nnode (kind of, see below), or a list of links. If you\nspecify the naming proc, it will be called on each node to\nprovide a unique name for the node (this is how a node is\nrecognized across multiple links). If you have complex\nobjects, provide a name function that reduces them to\nsomething simple that can work as the key in a javascript\nobject. By default, the entire node will just be turned\ninto a string.\n\nThe object works like an association list. You give the\nnode name as the key, and a list of nodes it connects with\nas the value. The list of nodes can either be just a\nsimple flat list of link specifiers (see below), or an\nobject with your own metadata and a member named 'links'\nwith the list of link specifiers.\n\nThe list format simply specifies the graph by calling out\neach link.  To use this, just pass in a flat list with all\nof the links given as link specifiers. Node names will be\ncollected from the link endpoints automatically. If you\nneed to draw a node with no links, just pass in a link\nspecifier with an endpoint missing.\n\nLink specifiers are either just a pair of node names, or\nan object with a 'from' and 'to' field in addition to\nwhatever metadata you want to add. If you use the object\nformat for specifying nodes, you can leave out the 'from'\nfield for the link specifiers as it will be taken from the\nnode name being processed instead.\n\nExamples:\n  $ [['foo','bar'],['bar',bla'],['foo','bla']] \\ forcegraph\n\n  $ {foo: ['bar','bla'], bar: ['bla']} \\ forcegraph\n\n  $ [{from: 'foo', to: 'bar', counter:97},\n     {from: 'foo',to:'bla', counter:8},\n     {from: 'bar',to:'bla',counter:1000}] \\ forcegraph\n\n  $ {foo: {links: [{to: 'bar', counter: 97}\n                   {to: 'bla', counter: 8}]\n           coolness: 0},\n     bar: {links: [{to: 'bla', counter: 1000}]\n           coolness: 99},\n     bla: {links: [],\n           coolness: 22}} \\ forcegraph\n           \nAll three examples produce the same graph with three nodes\nconnected by three links in a triangle.\n\nThe input will be passed through this command so you can\npipe other commands after it if needed";
      },
      forcegraph: function(argv, d, ctx) {
        var chart;
        chart = new Forcegraph(argv, d, ctx);
        chart.render("#revl-vizbox");
        return Result.wrap(d);
      }
    };

    function Forcegraph(argv, data, ctx) {
      this.graph = {
        links: [],
        nodes: {}
      };
      this.maxdata = void 0;
      this.namer = function(n) {
        return n;
      };
      if (argv.length > 0) {
        Utils.parsefunction(argv.join(' '), ctx).map((function(_this) {
          return function(proc) {
            return _this.namer = proc;
          };
        })(this)).map_err(e)(function() {
          throw e;
        });
      }
      this.pairs = [];
      this.ingest(data);
      window.fg = this;
    }

    Forcegraph.prototype.ingest = function(data) {
      var d, i, len, results;
      this.graph = {
        links: {},
        nodes: {}
      };
      if (Utils.isArray(data)) {
        results = [];
        for (i = 0, len = data.length; i < len; i++) {
          d = data[i];
          results.push(this.ingest_link(d));
        }
        return results;
      }
    };

    Forcegraph.prototype.ingest_link = function(link, insrc) {
      var base, base1, clone, data, l, src, to;
      if (insrc == null) {
        insrc = void 0;
      }
      if (Utils.isArray(link)) {
        clone = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = link.length; i < len; i++) {
            l = link[i];
            results.push(l);
          }
          return results;
        })();
        src = void 0;
        if (clone.length > 1 && (typeof clone[1] !== "object")) {
          src = clone.shift();
        }
        to = '' + clone.shift();
        if (src == null) {
          src = '' + insrc;
        }
        data = clone.shift() || null;
        this.ensure_node(to);
        this.ensure_node(src);
        if ((base = this.graph.links)[src] == null) {
          base[src] = {};
        }
        return (base1 = this.graph.links[src])[to] != null ? base1[to] : base1[to] = data;
      }
    };

    Forcegraph.prototype.ensure_node = function(node) {
      var base, name;
      if (!node) {
        return;
      }
      return (base = this.graph.nodes)[name = '' + (this.namer(node))] != null ? base[name] : base[name] = {
        id: '' + (this.namer(node)),
        data: {}
      };
    };

    Forcegraph.prototype.links = function() {
      var ref, ref1, result, src, to;
      result = [];
      ref = this.graph.links;
      for (src in ref) {
        if (!hasProp.call(ref, src)) continue;
        ref1 = this.graph.links[src];
        for (to in ref1) {
          if (!hasProp.call(ref1, to)) continue;
          result.push({
            source: src,
            target: to,
            data: this.graph.links[src][to]
          });
        }
      }
      return result;
    };

    Forcegraph.prototype.render = function(target) {
      var height, link, links, margin, node, nodes, simulation, svg, width;
      svg = d3.select(target).html("").append("svg").attr("class", "viz");
      margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
      };
      width = +document.querySelector(target).offsetWidth - margin.left - margin.right;
      height = +document.querySelector(target).offsetHeight - margin.top - margin.bottom;
      nodes = (Object.keys(this.graph.nodes)).map((function(_this) {
        return function(n) {
          return _this.graph.nodes[n];
        };
      })(this));
      links = this.links();
      window.fgraph = {
        nodes: nodes,
        links: links
      };
      console.log(JSON.stringify(nodes));
      console.log(JSON.stringify(links));
      simulation = d3.forceSimulation().force("link", d3.forceLink().id(function(d) {
        return d.id;
      })).force("charge", d3.forceManyBody()).force("center", d3.forceCenter(width / 2, height / 2));
      link = svg.append("g").attr("class", "forcegraph-links").selectAll("line").data(links).enter().append("line").attr("stroke-width", 2);
      node = svg.append("g").attr("class", "forcegraph-nodes").selectAll("circle").data(nodes).enter().append("circle").attr("r", 5).attr("fill", Utils.pickColor(1));
      node.append("title").text(function(d) {
        return d.id;
      });
      simulation.nodes(nodes).on("tick", function() {
        link.attr("x1", function(d) {
          return d.source.x;
        }).attr("y1", function(d) {
          return d.source.y;
        }).attr("x2", function(d) {
          return d.target.x;
        }).attr("y2", function(d) {
          return d.target.y;
        });
        return node.attr("cx", function(d) {
          return d.x;
        }).attr("cy", function(d) {
          return d.y;
        });
      });
      return simulation.force("link").links(links);
    };

    return Forcegraph;

  })();

  module.exports = Forcegraph;

}).call(this);

//# sourceMappingURL=forcegraph.js.map
