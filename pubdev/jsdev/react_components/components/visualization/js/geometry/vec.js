// Generated by CoffeeScript 1.11.1
(function() {
  var Vec;

  Vec = (function() {
    function Vec(coords) {
      this.coords = coords.slice(0);
    }

    Vec.prototype.add = function(other) {
      var i;
      return new Vec((function() {
        var j, ref, results;
        results = [];
        for (i = j = 0, ref = this.coords.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          results.push((other.nth(i)) + (this.nth(i)));
        }
        return results;
      }).call(this));
    };

    Vec.prototype.sub = function(other) {
      var i;
      return new Vec((function() {
        var j, ref, results;
        results = [];
        for (i = j = 0, ref = this.coords.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          results.push((this.nth(i)) - (other.nth(i)));
        }
        return results;
      }).call(this));
    };

    Vec.prototype.dot = function(other) {
      var i;
      return ((function() {
        var j, ref, results;
        results = [];
        for (i = j = 0, ref = this.coords.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          results.push((this.nth(i)) * (other.nth(i)));
        }
        return results;
      }).call(this)).reduce(function(a, b) {
        return a + b;
      });
    };

    Vec.prototype.norm = function() {
      return this.dot(this);
    };

    Vec.prototype.normalize = function() {
      return this.scale(1.0 / (this.norm()));
    };

    Vec.prototype.scale = function(f) {
      var x;
      return new Vec((function() {
        var j, len, ref, results;
        ref = this.coords;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          x = ref[j];
          results.push(f * x);
        }
        return results;
      }).call(this));
    };

    Vec.prototype.x = function() {
      return this.nth(0);
    };

    Vec.prototype.y = function() {
      return this.nth(1);
    };

    Vec.prototype.z = function() {
      return this.nth(2);
    };

    Vec.prototype.w = function() {
      return this.nth(3);
    };

    Vec.prototype.dim = function() {
      return this.coords.length;
    };

    Vec.prototype.nth = function(n) {
      if (n >= this.coords.length) {
        throw "Error: out of bounds access on vector";
      } else {
        return this.coords[n];
      }
    };

    Vec.prototype.cross2 = function(other) {
      return ((this.nth(1)) * (other.nth(0))) - ((this.nth(0)) * (other.nth(1)));
    };

    Vec.prototype.eq = function(other) {
      var i, j, ref;
      for (i = j = 0, ref = this.coords.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        if (!feq(this.nth(i), other.nth(i))) {
          return false;
        }
      }
      return true;
    };

    Vec.prototype.edgetest = function(edge) {
      var anchor, result, test;
      anchor = edge.p2.sub(edge.p1);
      test = this.sub(edge.p1);
      result = anchor.cross2(test);
      switch (false) {
        case !flt(result, 0):
          return -1;
        case !fgt(result, 0):
          return 1;
        case !feq(result, 0):
          return 0;
      }
    };

    Vec.prototype.leftof = function(edge) {
      return (this.edgetest(edge)) < 0;
    };

    Vec.prototype.rightof = function(edge) {
      return (this.edgetest(edge)) > 0;
    };

    Vec.prototype.colinear = function(edge) {
      return (this.edgetest(edge)) === 0;
    };

    return Vec;

  })();

  module.exports = Vec;

}).call(this);

//# sourceMappingURL=vec.js.map
