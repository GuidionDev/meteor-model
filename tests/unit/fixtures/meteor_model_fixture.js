"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var meteor_model_1 = require("meteor-model");
var sample_validation_rule_fixture_1 = require("./sample_validation_rule_fixture");
var MeteorModelFixture = (function (_super) {
    __extends(MeteorModelFixture, _super);
    function MeteorModelFixture(initialAttributes) {
        _super.call(this, initialAttributes);
        this.validationRules = {
            'username': [new sample_validation_rule_fixture_1.SampleValidationRuleFixture(), new sample_validation_rule_fixture_1.SampleValidationRuleFixture2()],
            'email': [new sample_validation_rule_fixture_1.SampleValidationRuleFixture()],
            'items': [new sample_validation_rule_fixture_1.SampleValidationRuleFixture2()],
            'active': []
        };
    }
    MeteorModelFixture.prototype.defaults = function () {
        return {
            username: 'username-1',
            email: 'david@guidion.com',
            items: [{
                    name: "Item 1",
                    active: false
                }],
            active: false
        };
    };
    MeteorModelFixture.COLLECTION_NAME = "collection";
    MeteorModelFixture.METEOR_METHOD_PREFIX = "collection";
    return MeteorModelFixture;
}(meteor_model_1.MeteorModel));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MeteorModelFixture;
