import { assert } from 'meteor/practicalmeteor:chai';
import {ValidationRule} from "meteor-model";

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
    it("should validate every condition setted up under 'conditions' attribute", () => {

    });
  });

  describe('.addInvalidMessage()', () => {
    xit("should add a message to the invalid messages", () => {

    });
  });

  describe('.addCondition()', () => {
    xit("should add a condition to the ValidationRule conditions", () => {

    });
  });

  describe('.removeCondition()', () => {
    xit("should remove a condition from the ValidationRule conditions", () => {

    });
  });
});
