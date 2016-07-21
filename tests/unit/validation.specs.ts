import { assert } from 'meteor/practicalmeteor:chai';
import {ValidationRule} from "meteor-model";
import {SampleValidationRuleFixture, SampleValidationRuleFixture2} from "./fixtures/sample_validation_rule_fixture";

describe("ValidationRule", () => {
  let validationRule;

  beforeEach(() => {
    validationRule = new ValidationRule({ firstParamName: 'whatever value', secondParamName: { a: 1001, b: /.*guidion/ }});
  });

  describe('.constructor()', () => {
    it("should assign the value and validator params within the instance", () => {
      assert.isDefined(validationRule['params']);
      assert.deepEqual(validationRule['params'], { firstParamName: 'whatever value', secondParamName: { a: 1001, b: /.*guidion/ }});
    });

    it("should initialize the _invalidMessage as empty", () => {
      assert.equal(validationRule._invalidMessage, "");
    });
  });

  describe('.isValid()', () => {
    it("should assign the original and final values within the instance", () => {
      validationRule.isValid("original value", "new value");
      assert.isDefined(validationRule['fromValue']);
      assert.equal(validationRule['fromValue'], "original value");
      assert.isDefined(validationRule['toValue']);
      assert.equal(validationRule['toValue'], "new value");
    });
    it("should return true when all the ValidationRule conditions return true", () => {
      const sampleValidationRuleFixture = new SampleValidationRuleFixture();
      assert.equal(sampleValidationRuleFixture.isValid(), true);
    });
    it("should return false when at least one of the ValidationRule conditions return false", () => {
      const sampleValidationRuleFixture2 = new SampleValidationRuleFixture2();
      assert.equal(sampleValidationRuleFixture2.isValid(), false);
    });
  });

  describe('.addInvalidMessage()', () => {
    it("should add a message to the invalid messages", () => {
      assert.equal(validationRule._invalidMessage, "");
      validationRule.addInvalidMessage("A new invalid message describing the error");
      assert.equal(validationRule._invalidMessage, "A new invalid message describing the error");
    });
  });
});
