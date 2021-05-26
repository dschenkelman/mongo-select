/*jshint node:true */

type Projection = { [key: string]: boolean };

const considerAlways = <T extends ChainedMongoSelect>(
  projection: T,
  value: boolean
) => {
  for (const name of Object.keys(MongoSelect.must)) {
    if (MongoSelect.must[name]) {
      if (projection[name] === false) {
        delete projection[name];
      } else if (value) {
        (<Projection>projection)[name] = true;
      }
    } else {
      if (!projection[name] && !value) {
        (<Projection>projection)[name] = false;
      } else {
        delete projection[name];
      }
    }
  }

  return projection;
};

const considerArrays = <T extends ChainedMongoSelect>(projection: T) => {
  const arrayFields = Object.keys(projection).filter(
    (field) => field.indexOf(".") !== -1
  );

  for (const field of arrayFields) {
    const arrayField = field.substring(0, field.indexOf("."));

    if (projection[arrayField] === false) {
      delete projection[field];
    }
  }

  return projection;
};

const getNonChainProperties = <T extends ChainedMongoSelect>(object: T) => {
  return Object.keys(object).filter(
    (name) =>
      ["exclude", "include", "always", "noId"].indexOf(name.substring(1)) ===
        -1 || typeof object[name] !== "function"
  );
};

const setFields = <T extends ChainedMongoSelect>(
  fields: string[],
  value: boolean,
  existing: T
) => {
  for (const field of fields) {
    (<Projection>existing)[field] = value;
  }

  return considerArrays(considerAlways(existing, value));
};

abstract class ChainedMongoSelect {
  [key: string]: any;

  _always() {
    for (const property of getNonChainProperties(this)) {
      MongoSelect.must[property] = this[property];
    }
  }

  _noId() {
    return setFields(["_id"], false, this);
  }
}

class IncludeMongoSelect extends ChainedMongoSelect {
  _include(fields: string[]) {
    return setFields(fields, true, this);
  }
}

class ExcludeMongoSelect extends ChainedMongoSelect {
  _exclude(fields: string[]) {
    return setFields(fields, false, this);
  }
}

class NoIDMongoSelect extends ChainedMongoSelect {
  _include(fields: string[]) {
    const projection = new IncludeMongoSelect();
    projection._id = false;
    return setFields(fields, true, projection);
  }

  _exclude(fields: string[]) {
    const projection = new ExcludeMongoSelect();
    projection._id = false;
    return setFields(fields, false, projection);
  }
}

class MongoSelect {
  static must: Projection = {};

  include(fields: string[]) {
    return setFields(fields, true, new IncludeMongoSelect());
  }

  exclude(fields: string[]) {
    return setFields(fields, false, new ExcludeMongoSelect());
  }

  noId() {
    return setFields(["_id"], false, new NoIDMongoSelect());
  }

  clear() {
    MongoSelect.must = {};
  }
}

export const select = () => new MongoSelect();
