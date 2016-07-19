import {MeteorModel, ValidationRule} from "meteor-model";
import {SampleValidationRuleFixture, SampleValidationRuleFixture2} from "./sample_validation_rule_fixture";

/// <reference path="meteor-model.d.ts" />
export default class MeteorModelFixture extends MeteorModel {
  public static COLLECTION_NAME = "collection";
  public static METEOR_METHOD_PREFIX = "collection";

  public defaults() {
    return {
      username: 'username-1',
      email: 'david@guidion.com',
      items: [{
        name: "Item 1",
        active: false
      }],
      active: false
    };
  }

  private validationRules = {
    'name':     [new SampleValidationRuleFixture(), new SampleValidationRuleFixture2()],
    'email':    [new SampleValidationRuleFixture()],
    'items':    [new SampleValidationRuleFixture2()],
    'active':   []
  }
}
