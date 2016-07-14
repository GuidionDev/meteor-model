import { assert } from 'meteor/practicalmeteor:chai';
import {ValidationRule} from "./validation";

describe("ValidationRule", () => {
  describe('.constructor()', () => {
    xit("should assign the value and validator params within the instance", () => {
      let validationRule = new ValidationRule('whatever value', { a: 1001, b: /.*guidion/ });
      assert.isDefined(validationRule['value']);
      assert.equals(validationRule['value'], 'whatever value');
      assert.isDefined(validationRule['params']);
      assert.equals(validationRule['params'], { a: 1001, b: /.*guidion/ });
    });

    describe('.isValid()', () => {
      it("should validate every condition setted up under 'conditions' attribute", () => {

      });
    });

    describe('.addInvalidMessage()', () => {
      it("should add a message to the invalid messages", () => {

      });
    });

    describe('.addCondition()', () => {
      it("should add a condition to the ValidationRule conditions", () => {

      });
    });

    describe('.removeCondition()', () => {
      it("should remove a condition from the ValidationRule conditions", () => {

      });
    });
  });
});
