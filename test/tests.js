"use strict";

/*jshint node:true */
/*global describe, it, afterEach, beforeEach*/

require("should");
const select = require("../dist/index.js").select();

function getNonChainProperties(object) {
  function isNotChainMethod(name) {
    // remove initial _
    return (
      ["exclude", "include", "always", "noId"].indexOf(name.substring(1)) ===
        -1 || typeof object[name] !== "function"
    );
  }

  return Object.keys(object).filter(isNotChainMethod);
}

describe("include", function () {
  var projection;
  beforeEach(function () {
    projection = select.include(["email", "name"]);
  });
  it("should only have values", function () {
    getNonChainProperties(projection).length.should.equal(2);
  });
  it("should set values to true", function () {
    projection.name.should.equal(true);
    projection.email.should.equal(true);
  });
});

describe("exclude", function () {
  var projection;
  beforeEach(function () {
    projection = select.exclude(["email", "name"]);
  });
  it("should only have values", function () {
    getNonChainProperties(projection).length.should.equal(2);
  });
  it("should set values to false", function () {
    projection.name.should.equal(false);
    projection.email.should.equal(false);
  });
});

describe("noId", function () {
  var projection;
  beforeEach(function () {
    projection = select.noId();
  });
  it("should only have _id value", function () {
    getNonChainProperties(projection).length.should.equal(1);
  });
  it("should set _id to false", function () {
    projection._id.should.equal(false);
  });
});

describe("chaining", function () {
  describe("noId then exclude", function () {
    var projection;
    beforeEach(function () {
      projection = select.noId()._exclude(["email", "children.name"]);
    });
    it("should only have _id and excluded values", function () {
      getNonChainProperties(projection).length.should.equal(3);
    });
    it("should set all values to false", function () {
      projection._id.should.equal(false);
      projection.email.should.equal(false);
      projection["children.name"].should.equal(false);
    });
  });

  describe("noId then include", function () {
    var projection;
    beforeEach(function () {
      projection = select.noId()._include(["email", "children.name"]);
    });
    it("should only have _id and excluded values", function () {
      getNonChainProperties(projection).length.should.equal(3);
    });
    it("should set _id to false other values to true", function () {
      projection._id.should.equal(false);
      projection.email.should.equal(true);
      projection["children.name"].should.equal(true);
    });
  });

  describe("include then noId", function () {
    var projection;
    beforeEach(function () {
      projection = select.include(["email", "children.name"])._noId();
    });
    it("should only have _id and excluded values", function () {
      getNonChainProperties(projection).length.should.equal(3);
    });
    it("should set _id to false other values to true", function () {
      projection._id.should.equal(false);
      projection.email.should.equal(true);
      projection["children.name"].should.equal(true);
    });
  });

  describe("include then noId", function () {
    var projection;
    beforeEach(function () {
      projection = select.include(["email", "children.name"])._noId();
    });
    it("should only have _id and included values", function () {
      getNonChainProperties(projection).length.should.equal(3);
    });
    it("should set _id to false other values to true", function () {
      projection._id.should.equal(false);
      projection.email.should.equal(true);
      projection["children.name"].should.equal(true);
    });
  });

  describe("exclude then noId", function () {
    var projection;
    beforeEach(function () {
      projection = select.exclude(["email", "children.name"])._noId();
    });
    it("should only have _id and excluded values", function () {
      getNonChainProperties(projection).length.should.equal(3);
    });
    it("should set all values to false", function () {
      projection._id.should.equal(false);
      projection.email.should.equal(false);
      projection["children.name"].should.equal(false);
    });
  });

  describe("exclude then exclude", function () {
    var projection;
    beforeEach(function () {
      projection = select.exclude(["email"])._exclude(["name"]);
    });
    it("should only have excluded values", function () {
      getNonChainProperties(projection).length.should.equal(2);
    });
    it("should set all values to false", function () {
      projection.email.should.equal(false);
      projection.name.should.equal(false);
    });
  });

  describe("exclude then exclude with array projection", function () {
    var projection;
    beforeEach(function () {
      projection = select
        .exclude(["children"])
        ._exclude(["children.name", "countries.capital"]);
    });
    it("should only have excluded values", function () {
      getNonChainProperties(projection).length.should.equal(2);
    });
    it("should set all values to false", function () {
      projection.children.should.equal(false);
      projection["countries.capital"].should.equal(false);
    });
  });

  describe("exclude with array projection then exclude", function () {
    var projection;
    beforeEach(function () {
      projection = select
        .exclude(["children.name", "countries.capital"])
        ._exclude(["children"]);
    });
    it("should only have excluded values", function () {
      getNonChainProperties(projection).length.should.equal(2);
    });
    it("should set all values to false", function () {
      projection.children.should.equal(false);
      projection["countries.capital"].should.equal(false);
    });
  });

  describe("include then include", function () {
    var projection;
    beforeEach(function () {
      projection = select.include(["email"])._include(["name"]);
    });
    it("should only have included values", function () {
      getNonChainProperties(projection).length.should.equal(2);
    });
    it("should set all values to false", function () {
      projection.email.should.equal(true);
      projection.name.should.equal(true);
    });
  });
});

describe("always", function () {
  describe("excluding", function () {
    beforeEach(function () {
      select.clear();
      select.exclude(["name", "email"])._always();
    });

    it("should add excluded fields to future exclusions", function () {
      var projection = select.exclude(["children.name"])._noId();
      projection._id.should.equal(false);
      projection.name.should.equal(false);
      projection.email.should.equal(false);
      projection["children.name"].should.equal(false);
    });

    it("should remove excluded fields from future inclusions", function () {
      var projection = select.include(["children.name", "name", "email"]);
      (typeof projection.name === "undefined").should.equal(true);
      (typeof projection.email === "undefined").should.equal(true);
      projection["children.name"].should.equal(true);
    });

    it("should not add excluded fields to be excluded in future inclusions", function () {
      var projection = select.include(["children.name"]);
      (typeof projection.name === "undefined").should.equal(true);
      (typeof projection.email === "undefined").should.equal(true);
      projection["children.name"].should.equal(true);
    });

    it("should allow for future empty exclusions", function () {
      var projection = select.exclude([]);
      projection.name.should.equal(false);
      projection.email.should.equal(false);
    });

    describe("with array projection", function () {
      beforeEach(function () {
        select.clear();
        select
          .exclude(["children.name", "children", "countries.capital", "name"])
          ._always();
      });

      it("should only exclude top level array field with empty exclusion", function () {
        var projection = select.exclude([]);
        projection.children.should.equal(false);
        projection.name.should.equal(false);
        projection["countries.capital"].should.equal(false);
        getNonChainProperties(projection).length.should.equal(3);
      });

      it("should only exclude top level array field with non-empty exclusion", function () {
        var projection = select.exclude([
          "children.age",
          "countries.population",
          "email",
        ]);
        projection.children.should.equal(false);
        projection.email.should.equal(false);
        projection.name.should.equal(false);
        projection["countries.capital"].should.equal(false);
        projection["countries.population"].should.equal(false);
        getNonChainProperties(projection).length.should.equal(5);
      });
    });
  });
  describe("including", function () {
    beforeEach(function () {
      select.clear();
      select.include(["name", "email"])._always();
    });

    it("should add included fields to future inclusions", function () {
      var projection = select.include(["children.name"])._noId();
      projection._id.should.equal(false);
      projection.name.should.equal(true);
      projection.email.should.equal(true);
      projection["children.name"].should.equal(true);
    });

    it("should remove included fields from future exclusions", function () {
      var projection = select.exclude(["children.name", "name", "email"]);
      (typeof projection.name === "undefined").should.equal(true);
      (typeof projection.email === "undefined").should.equal(true);
      projection["children.name"].should.equal(false);
    });

    it("should not add included fields to be included in future exclusions", function () {
      var projection = select.exclude(["children.name"]);
      (typeof projection.name === "undefined").should.equal(true);
      (typeof projection.email === "undefined").should.equal(true);
      projection["children.name"].should.equal(false);
    });

    it("should allow for future empty inclusions", function () {
      var projection = select.include([]);
      projection.name.should.equal(true);
      projection.email.should.equal(true);
    });
  });
});
