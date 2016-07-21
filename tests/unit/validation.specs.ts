import { assert } from 'meteor/practicalmeteor:chai';
import {ValidationRule, LengthValidator, RegExpValidator, EmailValidator, RequiredValidator, AllowedValueSwitch} from "meteor-model";
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

describe("LengthValidator", () => {
  let lengthValidator = new LengthValidator({ min: 5, max: 100 });
  let value;

  describe("when the value to validate is of a type Array", () => {
    beforeEach(() => {
      value = [];
    });
    describe("when the value is below the minimum", () => {
      it("should validate that the number of the destination Array value is between the minimum and the maxium", () => {
        value = [1,2];
        assert.equal(lengthValidator.isValid(null, value), false);
      });
    });
    describe("when the value is between the minimum and the maximum", () => {
      it("should validate that the number of the destination Array value is between the minimum and the maxium", () => {
        value = [1,2,3,4,5];
        assert.equal(lengthValidator.isValid(null, value), true);
      });
    });
    describe("when the value is higher than the maximum", () => {
      it("should validate that the number of the destination Array value is higher than the maximum", () => {
        for (let i = 1; i <= 105; i++) {
          value.push(i);
        }
        assert.equal(lengthValidator.isValid(null, value), false);
      });
    });
  });

  describe("when the value to validate is of a type String", () => {
    describe("when the value is below the minimum", () => {
      it("should validate that the size of the destination string value is between the minimum and the maxium", () => {
        value = "ab";
        assert.equal(lengthValidator.isValid(null, value), false);
      });
    });
    describe("when the value is between the minimum and the maximum", () => {
      it("should validate that the size of the destination string value is between the minimum and the maximum", () => {
        value = "abcde";
        assert.equal(lengthValidator.isValid(null, value), true);
      });
    });
    describe("when the value is higher than the maximum", () => {
      it("should validate that the size of the destination string value is higher than the maximum", () => {
        for (let i = 1; i <= 105; i++) {
          value += i;
        }
        assert.equal(lengthValidator.isValid(null, value), false);
      });
    });
  });
});

describe("RegExpValidator", () => {
  xit("should validate that the destination value match with a specific RegExp", () => {

  });
});

describe("RegExpValidator", () => {
  xit("should validate that the destination value is an email", () => {

  });
});

describe("EmailValidator", () => {
  xit("should validate that the destination value is an email", () => {

  });
});

describe("RequiredValidator", () => {
  xit("should validate that the destination value has a value", () => {

  });
});

describe("AllowedValueSwitch", () => {
  xit("should validate that a value can be changed to a specific list of values", () => {

  });
});
