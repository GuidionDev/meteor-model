var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var meteor_model_1 = require("meteor-model");
var SampleValidationRuleFixture = (function (_super) {
    __extends(SampleValidationRuleFixture, _super);
    function SampleValidationRuleFixture() {
        _super.apply(this, arguments);
        this.conditions = [
            function () {
                return true;
            },
            function () {
                return true;
            }
        ];
    }
    return SampleValidationRuleFixture;
})(meteor_model_1.ValidationRule);
exports.SampleValidationRuleFixture = SampleValidationRuleFixture;
var SampleValidationRuleFixture2 = (function (_super) {
    __extends(SampleValidationRuleFixture2, _super);
    function SampleValidationRuleFixture2() {
        var _this = this;
        _super.apply(this, arguments);
        this.conditions = [
            function () {
                return true;
            },
            function () {
                _this.addInvalidMessage("Invalid message");
                return false;
            }
        ];
    }
    return SampleValidationRuleFixture2;
})(meteor_model_1.ValidationRule);
exports.SampleValidationRuleFixture2 = SampleValidationRuleFixture2;
