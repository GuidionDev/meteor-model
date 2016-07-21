var practicalmeteor_chai_1 = require('meteor/practicalmeteor:chai');
var meteor_model_1 = require("meteor-model");
describe("ValidationRule", function () {
    describe('.constructor()', function () {
        xit("should assign the value and validator params within the instance", function () {
            var validationRule = new meteor_model_1.ValidationRule('whatever value', { a: 1001, b: /.*guidion/ });
            practicalmeteor_chai_1.assert.isDefined(validationRule['value']);
            practicalmeteor_chai_1.assert.equals(validationRule['value'], 'whatever value');
            practicalmeteor_chai_1.assert.isDefined(validationRule['params']);
            practicalmeteor_chai_1.assert.equals(validationRule['params'], { a: 1001, b: /.*guidion/ });
        });
        describe('.isValid()', function () {
            it("should validate every condition setted up under 'conditions' attribute", function () {
            });
        });
        describe('.addInvalidMessage()', function () {
            it("should add a message to the invalid messages", function () {
            });
        });
        describe('.addCondition()', function () {
            it("should add a condition to the ValidationRule conditions", function () {
            });
        });
        describe('.removeCondition()', function () {
            it("should remove a condition from the ValidationRule conditions", function () {
            });
        });
    });
});
