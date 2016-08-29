"use strict";
var MeteorModel = (function () {
    function MeteorModel(initialAttributes) {
        if (initialAttributes === void 0) { initialAttributes = {}; }
        this.transport = "Meteor";
        this._attrs = {};
        this._prevAttrs = {};
        this._errors = {};
        _.extend(this._attrs, this.defaults());
        var initialAttributesKeys = Object.keys(initialAttributes);
        for (var i = 0; i < initialAttributesKeys.length; i++) {
            this._attrs[initialAttributesKeys[i]] = initialAttributes[initialAttributesKeys[i]];
        }
        Object.assign(this._prevAttrs, this._attrs);
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
    MeteorModel.prototype.beforeCreate = function () { };
    MeteorModel.prototype.afterCreate = function () { };
    MeteorModel.prototype.beforeValidation = function () { };
    MeteorModel.prototype.afterValidation = function () { };
    MeteorModel.prototype.beforeSave = function () { };
    MeteorModel.prototype.afterSave = function () { };
    MeteorModel.prototype.beforeUpdate = function () { };
    MeteorModel.prototype.afterUpdate = function () { };
    MeteorModel.prototype.beforeDestroy = function () { };
    MeteorModel.prototype.afterDestroy = function () { };
    MeteorModel.prototype.defaults = function () {
        return {};
    };
    MeteorModel.prototype.isNew = function () {
        return (!this.id);
    };
    MeteorModel.prototype.addValidationError = function (attributeName, errorMessage) {
        if (!this._errors[attributeName]) {
            this._errors[attributeName] = [];
        }
        this._errors[attributeName].push(errorMessage);
    };
    MeteorModel.prototype.validate = function () {
        console.log(' + Validating record!');
        this.beforeValidation();
        this._errors = {};
        var attrNames = Object.keys(this._attrs), matchAllValidations = true;
        for (var i = 0; i < attrNames.length; i++) {
            if (this.validationRules[attrNames[i]]) {
                if (!this.validateAttr(attrNames[i])) {
                    matchAllValidations = false;
                }
            }
        }
        if (this.validationRules['_base'] && this.validationRules['_base'].length > 0) {
            for (var i = 0; i < this.validationRules['_base'].length; i++) {
                if (!this.validationRules['_base'][i]()) {
                    matchAllValidations = false;
                }
            }
        }
        this.afterValidation();
        return matchAllValidations;
    };
    MeteorModel.prototype.isValid = function () {
        var invalidAttrs = Object.keys(this['_errors']);
        return (invalidAttrs.length === 0 ? true : false);
    };
    MeteorModel.prototype.validateAttr = function (attributeName) {
        var matchAllValidations = true, validationRule;
        for (var i = 0; i < this.validationRules[attributeName].length; i++) {
            validationRule = this.validationRules[attributeName][i];
            if (!validationRule.isValid(this._prevAttrs[attributeName], this._attrs[attributeName])) {
                this.addValidationError(attributeName, validationRule._invalidMessage);
                matchAllValidations = false;
            }
        }
        return matchAllValidations;
    };
    MeteorModel.prototype.isValidAttr = function (attributeName) {
        return (this.getAttrErrors(attributeName).length === 0 ? true : false);
    };
    MeteorModel.prototype.hasChanged = function () {
        var attrName, prevAttrName, attrNames = Object.keys(this._attrs), prevAttrNames = Object.keys(this._prevAttrs);
        if (attrNames.length !== prevAttrNames.length) {
            return true;
        }
        for (var _i = 0, prevAttrNames_1 = prevAttrNames; _i < prevAttrNames_1.length; _i++) {
            prevAttrName = prevAttrNames_1[_i];
            if (this._prevAttrs[prevAttrName] !== this._attrs[prevAttrName]) {
                return true;
            }
        }
        return false;
    };
    MeteorModel.prototype.hasAttrChanged = function (attrName) {
        return (this._attrs[attrName] !== this._prevAttrs[attrName]);
    };
    MeteorModel.prototype.save = function () {
        var _this = this;
        this.beforeSave();
        if (Meteor.isServer) {
            console.log(' + Running .save() in the backend', this._attrs);
            if (this.isNew()) {
                return this.constructor['COLLECTION'].insert(this._attrs);
            }
            else {
                return this.constructor['COLLECTION'].update({ _id: this.id }, this._attrs);
            }
        }
        else {
            console.log(' + Running .save() in the frontend', this.constructor['COLLECTION_NAME']);
            return new Promise(function (resolve, reject) {
                Meteor.call(_this.constructor['COLLECTION_NAME'] + '.save', _this.toOriginJSON(), function (error, result) {
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
    MeteorModel.prototype.toOriginJSON = function () {
        return this['_attrs'];
    };
    MeteorModel.prototype.destroy = function () {
        var _this = this;
        this.beforeDestroy();
        if (Meteor.isServer) {
            console.log(' + Running .destroy() in the backend');
            return this.constructor['COLLECTION'].remove({ _id: this.id });
        }
        else {
            var promise = new Promise(function (resolve, reject) {
                console.log(' + Running .destroy() in the frontend');
                Meteor.call(_this.constructor['COLLECTION_NAME'] + '.remove', _this.id, function (error, result) {
                    if (error) {
                        reject(Error(error));
                    }
                    else {
                        resolve(result);
                        _this.afterDestroy();
                    }
                });
            });
            return promise;
        }
    };
    MeteorModel.getPublicationName = function (collection) {
        return (this.COLLECTION_NAME + '.read_' + (collection ? 'collection' : 'one'));
    };
    MeteorModel.fetchCursor = function (query, options) {
        var _this = this;
        if (query === void 0) { query = {}; }
        if (options === void 0) { options = {}; }
        var self = this;
        options.transform = function (doc) {
            return (new _this(doc));
        };
        if (Meteor.isServer) {
            console.log(' + Running #fetchCursor() in the backend with this query: ', query);
        }
        else {
            console.log(' + Running #fetchCursor() in the frontend with this query: ', query);
        }
        return this.COLLECTION.find(query, options);
    };
    MeteorModel.fetchOne = function (id) {
        var self = this;
        if (Meteor.isServer) {
            console.log(' + Running #fetchOne() in the backend from this id: ', id);
        }
        else {
            console.log(' + Running #fetchOne() in the frontend from this ID: ', id);
        }
        var doc = this.COLLECTION.findOne(id);
        return doc ? (new this(doc)) : undefined;
    };
    MeteorModel.COLLECTION_NAME = 'default';
    return MeteorModel;
}());
exports.MeteorModel = MeteorModel;
