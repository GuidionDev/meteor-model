"use strict";
var meteor_model_fixture_1 = require("./fixtures/meteor_model_fixture");
var practicalmeteor_chai_1 = require('meteor/practicalmeteor:chai');
var meteorModelFixture = new meteor_model_fixture_1.default();
var modelInstance;
describe('MeteorModel', function () {
    describe(".constructor()", function () {
        it("should set initial attributes containing a null id attribute", function (done) {
            modelInstance = new meteor_model_fixture_1.default();
            practicalmeteor_chai_1.assert.isDefined(modelInstance._attrs['id']);
            practicalmeteor_chai_1.assert.equal(modelInstance._attrs['id'], null);
            done();
        });
        it("should set the default attributes", function () {
            modelInstance = new meteor_model_fixture_1.default();
            practicalmeteor_chai_1.assert.isDefined(modelInstance._attrs);
            practicalmeteor_chai_1.assert.deepEqual(modelInstance._attrs, {
                id: null,
                username: 'username-1',
                email: 'david@guidion.com',
                items: [{
                        name: "Item 1",
                        active: false
                    }],
                active: false
            });
        });
        it("should merge the initial attributes on top of the default attributes", function () {
            modelInstance = new meteor_model_fixture_1.default({
                username: 'username-10001',
                items: [{
                        name: "A different Item",
                        active: true
                    }],
            });
            practicalmeteor_chai_1.assert.deepEqual(modelInstance._attrs, {
                id: null,
                username: 'username-10001',
                email: 'david@guidion.com',
                items: [{
                        name: "A different Item",
                        active: true
                    }],
                active: false
            });
        });
    });
    describe('.isNew()', function () {
        it("should check wether the record is a new a record not persisted to the database", function () {
            modelInstance = new meteor_model_fixture_1.default();
            practicalmeteor_chai_1.assert.equal(modelInstance.isNew(), true);
            modelInstance._id = 1001;
            practicalmeteor_chai_1.assert.equal(modelInstance.isNew(), false);
        });
    });
    describe(".addValidationError()", function () {
        it("should add an error message to the errors object on an specific attribute name", function () {
            modelInstance = new meteor_model_fixture_1.default();
            practicalmeteor_chai_1.assert.equal(modelInstance.addValidationError());
        });
    });
    describe(".validate()", function () {
        it("should validate all the ValidationRules for every attribute and build a list of errors for every invalid attribute", function () {
            modelInstance = new meteor_model_fixture_1.default();
            practicalmeteor_chai_1.assert.deepEqual(modelInstance._errors, {});
            modelInstance.validate();
            practicalmeteor_chai_1.assert.deepEqual(modelInstance._errors, {
                username: ["Invalid message"],
                items: ["Invalid message"]
            });
        });
    });
    describe(".isValid()", function () {
        it("should check if the model attributes are valid by looking into the _errors field", function () {
            modelInstance = new meteor_model_fixture_1.default();
            modelInstance._errors = {
                name: ["Invalid message 1", "Super invalid"],
                items: ["Invalid message"]
            };
            practicalmeteor_chai_1.assert.equal(modelInstance.isValid(), false);
            modelInstance._errors = {};
            practicalmeteor_chai_1.assert.equal(modelInstance.isValid(), true);
        });
    });
    describe(".validateAttr()", function () {
        it("should validate a specific attribute using its ValidationRules and update the _errors field with the invalid messages", function () {
            modelInstance = new meteor_model_fixture_1.default();
            modelInstance._errors = {
                name: ["Invalid message 1", "Super invalid"],
            };
            modelInstance.validateAttr("items");
            practicalmeteor_chai_1.assert.deepEqual(modelInstance._errors, {
                name: ["Invalid message 1", "Super invalid"],
                items: ["Invalid message"]
            });
        });
    });
    describe(".isValidAttr()", function () {
        it("should check if a model attribute is valid by looking into the _errors field", function () {
            modelInstance = new meteor_model_fixture_1.default();
            modelInstance._errors = {
                name: ["Invalid message 1", "Super invalid"],
                items: ["Invalid message"]
            };
            practicalmeteor_chai_1.assert.equal(modelInstance.isValidAttr("name"), false);
            practicalmeteor_chai_1.assert.equal(modelInstance.isValidAttr("email"), true);
            practicalmeteor_chai_1.assert.equal(modelInstance.isValidAttr("items"), false);
            practicalmeteor_chai_1.assert.equal(modelInstance.isValidAttr("active"), true);
        });
    });
    describe('.hasChanged()', function () {
        it("it should check wether the record has been changed since the last sync", function () {
        });
    });
    describe('.hasAttrChanged()', function () {
        it("it should check wether a specific attribute on a record has been changed since the last sync", function () {
        });
    });
    describe(".attr()", function () {
        describe("when no parameters are provided", function () {
            it("should retrieve all attributes", function () {
                modelInstance = new meteor_model_fixture_1.default();
                practicalmeteor_chai_1.assert.deepEqual(modelInstance.attr(), {
                    id: null,
                    username: 'username-1',
                    email: 'david@guidion.com',
                    items: [{
                            name: "Item 1",
                            active: false
                        }],
                    active: false
                });
            });
        });
        describe("when parameters are provided", function () {
            describe("when only the attribute name is provided", function () {
                it("should retrieve the attribute value for the attribute name provided", function () {
                    modelInstance = new meteor_model_fixture_1.default();
                    practicalmeteor_chai_1.assert.deepEqual(modelInstance.attr("items"), [{
                            name: "Item 1",
                            active: false
                        }]);
                });
            });
            describe("when both attribute name and attribute value is provided", function () {
                it("should set the attribute value provided for the attribute name provided", function () {
                    modelInstance = new meteor_model_fixture_1.default();
                    modelInstance.attr("items", [{ name: "A different item", active: false }]);
                    practicalmeteor_chai_1.assert.deepEqual(modelInstance._attrs, {
                        id: null,
                        username: 'username-1',
                        email: 'david@guidion.com',
                        items: [{
                                name: "A different item",
                                active: false
                            }],
                        active: false
                    });
                });
            });
        });
    });
    describe('.removeAttr()', function () {
        it("should set to null a specific attribute", function () {
            modelInstance = new meteor_model_fixture_1.default();
            modelInstance.removeAttr("email");
            practicalmeteor_chai_1.assert.equal(modelInstance._attrs["email"], null);
        });
    });
    describe('.addAttrItem()', function () {
        it("should add an item to an list attribute", function () {
            modelInstance = new meteor_model_fixture_1.default();
            modelInstance.addAttrItem("items", {
                name: "A New Item",
                active: true
            });
            practicalmeteor_chai_1.assert.deepEqual(modelInstance._attrs["items"], [
                {
                    name: "Item 1",
                    active: false
                },
                {
                    name: "A New Item",
                    active: true
                }
            ]);
        });
    });
    describe('.removeAttrItem()', function () {
        it("should remove an item in a specific index from a list attribute", function () {
            modelInstance = new meteor_model_fixture_1.default();
            modelInstance.removeAttrItem("items", 0);
            practicalmeteor_chai_1.assert.deepEqual(modelInstance._attrs["items"], []);
        });
    });
    describe(".save()", function () {
        xit("should call the right Meteor method", function () {
        });
        xit("should return a Promise", function () {
        });
    });
    describe(".fetch()", function () {
        xit("should return a Promise", function () {
        });
        xit("should fetch the attributes by calling the right Meteor method", function () {
        });
    });
    describe('.subscribe()', function () {
        xit("should subscribe for the Meteor resource publication", function () {
        });
    });
    describe(".destroy()", function () {
        xit("should return a Promise", function () {
        });
        xit("should call the right Meteor method", function () {
        });
    });
    describe("#fetchIndex()", function () {
        xit("should return a Promise", function () {
        });
        xit("should resolve the Promise with an array of instances of the ModelEntities with the attribute values retrieved from Meteor", function () {
        });
    });
    describe("#fetchOne()", function () {
        xit("should return a Promise", function () {
        });
        xit("should resolve the Promise with an instance of the MeteorModel with the attribute values retrieved from Meteor", function () {
        });
    });
});
