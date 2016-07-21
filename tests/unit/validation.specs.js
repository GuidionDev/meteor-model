"use strict";
var practicalmeteor_chai_1 = require('meteor/practicalmeteor:chai');
var meteor_model_1 = require("meteor-model");
describe("ValidationRule", function () {
    var validationRule;
    beforeEach(function () {
        validationRule = new meteor_model_1.ValidationRule({ firstParamName: 'whatever value', secondParamName: { a: 1001, b: /.*guidion/ } });
    });
    describe('.constructor()', function () {
        it("should assign the value and validator params within the instance", function () {
            practicalmeteor_chai_1.assert.isDefined(validationRule['params']);
            practicalmeteor_chai_1.assert.deepEqual(validationRule['params'], { firstParamName: 'whatever value', secondParamName: { a: 1001, b: /.*guidion/ } });
        });
        it("should initialize the _invalidMessage as empty", function () {
            practicalmeteor_chai_1.assert.equal(validationRule._invalidMessage, "");
        });
    });
    describe('.isValid()', function () {
        it("should assign the original and final values within the instance", function () {
            validationRule.isValid("original value", "new value");
            practicalmeteor_chai_1.assert.isDefined(validationRule['fromValue']);
            practicalmeteor_chai_1.assert.equal(validationRule['fromValue'], "original value");
            practicalmeteor_chai_1.assert.isDefined(validationRule['toValue']);
            practicalmeteor_chai_1.assert.equal(validationRule['toValue'], "new value");
        });
        it("should validate every condition setted up under 'conditions' attribute", function () {
        });
    });
    describe('.addInvalidMessage()', function () {
        xit("should add a message to the invalid messages", function () {
        });
    });
    describe('.addCondition()', function () {
        xit("should add a condition to the ValidationRule conditions", function () {
        });
    });
    describe('.removeCondition()', function () {
        xit("should remove a condition from the ValidationRule conditions", function () {
        });
    });
});
