"use strict";
var practicalmeteor_chai_1 = require('meteor/practicalmeteor:chai');
var meteor_model_1 = require("meteor-model");
var sample_validation_rule_fixture_1 = require("./fixtures/sample_validation_rule_fixture");
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
        it("should return true when all the ValidationRule conditions return true", function () {
            var sampleValidationRuleFixture = new sample_validation_rule_fixture_1.SampleValidationRuleFixture();
            practicalmeteor_chai_1.assert.equal(sampleValidationRuleFixture.isValid(), true);
        });
        it("should return false when at least one of the ValidationRule conditions return false", function () {
            var sampleValidationRuleFixture2 = new sample_validation_rule_fixture_1.SampleValidationRuleFixture2();
            practicalmeteor_chai_1.assert.equal(sampleValidationRuleFixture2.isValid(), false);
        });
    });
    describe('.addInvalidMessage()', function () {
        it("should add a message to the invalid messages", function () {
            practicalmeteor_chai_1.assert.equal(validationRule._invalidMessage, "");
            validationRule.addInvalidMessage("A new invalid message describing the error");
            practicalmeteor_chai_1.assert.equal(validationRule._invalidMessage, "A new invalid message describing the error");
        });
    });
});
