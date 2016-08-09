"use strict";
/**
 * Implements a base class on top of we implement our models.
 * It works in the server and in the browser.
 */
var MeteorModel = (function () {
    //public static METEOR_METHOD_RESOURCE_NAME = null
    function MeteorModel(initialAttributes) {
        if (initialAttributes === void 0) { initialAttributes = {}; }
        this.transport = "Meteor";
        this._attrs = {};
        this._errors = {};
        // Extend with defaults first
        _.extend(this._attrs, this.defaults());
        // Merge with initialization attributes too
        var initialAttributesKeys = Object.keys(initialAttributes);
        for (var i = 0; i < initialAttributesKeys.length; i++) {
            this._attrs[initialAttributesKeys[i]] = initialAttributes[initialAttributesKeys[i]];
        }
    }
    Object.defineProperty(MeteorModel.prototype, "errors", {
        get: function () { return this._errors; },
        enumerable: true,
        configurable: true
    });
    MeteorModel.prototype.getAttrErrors = function (attributeName) {
        return (this._errors[attributeName] ? this._errors[attributeName] : []);
    };
    Object.defineProperty(MeteorModel.prototype, "id", {
        get: function () {
            return this._attrs._id;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Callbacks for before and after Create and save
     */
    MeteorModel.prototype.beforeCreate = function () { };
    MeteorModel.prototype.afterCreate = function () { };
    // Callbacks to run before and after the record validation
    MeteorModel.prototype.beforeValidation = function () { };
    MeteorModel.prototype.afterValidation = function () { };
    // Callbacks to run before and after save the record
    MeteorModel.prototype.beforeSave = function () { };
    MeteorModel.prototype.afterSave = function () { };
    // Callsbacks to run before and after updating the record
    MeteorModel.prototype.beforeUpdate = function () { };
    MeteorModel.prototype.afterUpdate = function () { };
    // Callbacks to run before and after destroying the record
    MeteorModel.prototype.beforeDestroy = function () { };
    MeteorModel.prototype.afterDestroy = function () { };
    MeteorModel.prototype.defaults = function () {
        // TODO: Implement it when extending
        // return {
        //   'name' : 'Chuck Norris',
        //   'active' : true
        // }
    };
    /**
     * Checks wether the MeteorModel instance is a new record
     */
    MeteorModel.prototype.isNew = function () {
        return (!this.id);
    };
    /**
     * Adds a validation error on a specific attribute
     */
    MeteorModel.prototype.addValidationError = function (attributeName, errorMessage) {
        if (!this._errors[attributeName]) {
            this._errors[attributeName] = [];
        }
        this._errors[attributeName].push(errorMessage);
    };
    /**
     * Validates the model according to its ValidationRules
     */
    MeteorModel.prototype.validate = function () {
        console.log('validation the record!');
        this.beforeValidation();
        // Reset errors
        this._errors = {};
        var attrNames = Object.keys(this._attrs);
        console.log('attribute names: ', attrNames);
        /*
          Model attributes:
          _attrs: {
            email: '',
            age: 0
          }
    
          Model validation rules:
          validationRules: {
            email: [
              new RequiredValidator,
              new LengthValidator({ min: 1, max: 100 })
            ],
            age: [
              new RequiredValidator
            ]
          }
    
          // Errors after validation
          _errors: {
            email: [
              '"" is required',
              '"" is not a valid email'
            ],
            age: ['required']
          }
        */
        var matchAllValidations = true;
        console.log('I have this validation rules: ', this.validationRules);
        for (var i = 0; i < attrNames.length; i++) {
            if (this.validationRules[attrNames[i]]) {
                if (!this.validateAttr(attrNames[i])) {
                    matchAllValidations = false;
                }
            }
        }
        console.log('errors after validation: ', this._errors);
        this.afterValidation();
        return matchAllValidations;
    };
    /**
     * Checks if the model is a valid model according to its ValidationRules
     */
    MeteorModel.prototype.isValid = function () {
        var invalidAttrs = Object.keys(this['_errors']);
        return (invalidAttrs.length === 0 ? true : false);
    };
    /**
     * Validates a model attribute according to its ValidationRules
     */
    MeteorModel.prototype.validateAttr = function (attributeName) {
        var matchAllValidations = true;
        for (var i = 0; i < this.validationRules[attributeName].length; i++) {
            var validationRule = this.validationRules[attributeName][i];
            console.log('checking validation rule for attr: ', attributeName);
            // Check if entity is valid and collect all validation errors if any
            if (!validationRule.isValid(/* TODO: pass previous value */ null, this._attrs[attributeName])) {
                // Add the validator message to the MeteorModel
                this.addValidationError(attributeName, validationRule._invalidMessage);
                matchAllValidations = false;
            }
        }
        return matchAllValidations;
    };
    /**
     * Checks weather an attribute value is valid
     */
    MeteorModel.prototype.isValidAttr = function (attributeName) {
        return (this.getAttrErrors(attributeName).length === 0 ? true : false);
    };
    /**
     * Checks wether the model has attributes changed since the last sync
     */
    MeteorModel.prototype.hasChanged = function () {
        // TODO: Implement
        return false;
    };
    /**
     * Checks wether a model attribute has changed since the last sync
     */
    MeteorModel.prototype.hasAttrChanged = function (attrName) {
        // TODO: Implement
        return false;
    };
    /**
     * Adds an item to an attribute list and saves it if specified
     */
    MeteorModel.prototype.addAttrItem = function (collectionAttrName, attrValue, sync) {
        if (sync === void 0) { sync = false; }
        this._attrs[collectionAttrName].push(attrValue);
        if (sync) {
            this.save();
        }
    };
    /**
     * Removes an item from the attribute list
     */
    MeteorModel.prototype.removeAttrItem = function (attrCollectionName, index, sync) {
        if (sync === void 0) { sync = false; }
        this._attrs[attrCollectionName].splice(index, 1);
        if (sync) {
            this.save();
        }
    };
    /**
     * Saves the model entity
     */
    MeteorModel.prototype.save = function () {
        var _this = this;
        this.beforeSave();
        if (Meteor.isServer) {
            console.log('Running .save() in the backend', this._attrs);
            if (this.isNew()) {
                return Mongo.Collection.get(this.constructor['COLLECTION_NAME']).insert(this._attrs);
            }
            else {
                return Mongo.Collection.get(this.constructor['COLLECTION_NAME']).update({ _id: this.id }, this._attrs);
            }
        }
        else {
            console.log('Running .save() in the frontend', this.constructor['COLLECTION_NAME']);
            return new Promise(function (resolve, reject) {
                Meteor.call(_this.constructor['COLLECTION_NAME'] + '.save', _this._attrs, function (error, result) {
                    if (error) {
                        console.log(error);
                        reject(Error(error));
                    }
                    else {
                        _this.afterSave();
                        resolve(result);
                    }
                });
            });
        }
    };
    /**
     * It fetches de data from the server
     */
    MeteorModel.prototype.fetch = function () {
        var _this = this;
        if (Meteor.isClient) {
            console.log("Running .fetch() in the client");
            if (Meteor.isServer) {
                return Mongo.Collection.get(this.constructor['COLLECTION_NAME']).find({ _id: this.id }, function (err, cursor) {
                    if (!err && cursor) {
                        console.log('cursor: ', cursor);
                        _this._attrs = cursor;
                    }
                });
            }
            else {
            }
        }
    };
    /**
     * Destroys an entity
     */
    MeteorModel.prototype.destroy = function () {
        var _this = this;
        this.beforeDestroy();
        if (Meteor.isServer) {
            console.log('Running .destroy() in the backend');
            return Mongo.Collection.get(this.constructor['COLLECTION_NAME']).remove({ _id: this.id });
        }
        else {
            return new Promise(function (resolve, reject) {
                console.log('Running .destroy() in the frontend');
                Meteor.call(_this.constructor['COLLECTION_NAME'] + '.remove', _this, function (error, result) {
                    if (error) {
                        reject(Error(error));
                    }
                    else {
                        resolve(result);
                        _this.afterDestroy();
                    }
                });
            });
        }
    };
    /**
     * Subscribes for the resource collection using a specific query
     */
    MeteorModel.getPublicationName = function (collection) {
        return (this['COLLECTION_NAME'] + '.read_' + (collection ? 'collection' : 'one'));
    };
    /**
     * Retrieves a collection of model instances
     */
    MeteorModel.fetchIndex = function (query, options) {
        var _this = this;
        if (query === void 0) { query = {}; }
        if (options === void 0) { options = {}; }
        var self = this;
        options.transform = function (doc) {
            return (new _this(doc));
        };
        // In the server it will call the real Mongo.
        // In the frontend it will call a fake Mongo object (Meteor)
        if (Meteor.isServer) {
            console.log('Running #fetchIndex() in the backend with this query: ', query, options);
            // In the backend we return data only
            return Mongo.Collection.get(this['COLLECTION_NAME']).find(query, options);
        }
        else {
            console.log('Running #fetchIndex() in the frontend with this query: ', query);
            // However, in the frontend we return an instance of the model containing the data and its methods
            return Mongo.Collection.get(this['COLLECTION_NAME']).find(query, options);
        }
    };
    /**
     * Retrieves a single MeteorModel instance
     */
    MeteorModel.fetchOne = function (id) {
        var self = this;
        // In the server it will call the real Mongo.
        // In the frontend it will call a fake Mongo object (Meteor)
        if (Meteor.isServer) {
            console.log('Running #fetchOne() in the backend from this id: ', id);
        }
        else {
            console.log('Running #fetchOne() in the frontend from this ID: ', id);
        }
        var doc = Mongo.Collection.get(this['COLLECTION_NAME']).findOne(id);
        return (new this(doc));
    };
    MeteorModel.COLLECTION_NAME = 'default';
    return MeteorModel;
}());
exports.MeteorModel = MeteorModel;
