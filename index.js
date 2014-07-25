var _ = require('underscore');

/**
  * gets the value of objects based on text (dot syntax)
  *
  * @param {String} field - dictionary key
  * @param {Object} data - dictionary object
**/
var getObjValue = function(field, data) {
  return _.reduce(field.split("."), function(obj, f) {
    if(obj) return obj[f];
  }, data);
};

/**
  * sets the value of objects based on text (dot syntax)
  *
  * @param {String} field - key for data object
  * @param {Object} data - mongoose data object
  * @param {Object|String|Number} value - value for key
**/
var setObjValue = function(data, field, value) {
  var fieldArr = field.split('.');
  return _.reduce(fieldArr, function(o, f, i) {
    if(i == fieldArr.length-1) {
      o[f] = value;
    } else {
      if(!o[f]) o[f] = {};
    }
    return o[f];
  }, data);
};

/**
  * A Mongoose plugin method to update documents-
  * only updates the fields that are contained within the object passed in the parameter
  *
  * @param {Object} data - object containing fields with updated values
  * @param {Function} done - callback object after save is complete
**/
var updateDocument = function(data, done) {
  var doc = this;
  for(var field in doc.constructor.schema.paths) {
    if((field !== '_id') && (field !== '__v')) {
      var new_value = getObjValue(field, data);
      if(new_value !== undefined) {
        setObjValue(doc, field, new_value);
      }
    }
  };

  if(done) return doc.save(done);
  else return doc;
};

module.exports = function(schema) {
  schema.methods.leanUpdate = updateDocument;
};
