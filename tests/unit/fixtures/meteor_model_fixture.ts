/// <reference path="../../../src/meteor_model.ts" />

import {MeteorModel, ValidationRule} from "@gdn/meteor-model";
import {SampleValidationRuleFixture, SampleValidationRuleFixture2} from "./sample_validation_rule_fixture";

export default class MeteorModelFixture extends MeteorModel {
  public static COLLECTION_NAME = "collection";
  public static COLLECTION = {update: () => {},
                              insert: () => {},
                              find: (query, options) => {},
                              findOne: (id) => {}};

  constructor(initialAttributes:Object) { super(initialAttributes); }

  get items(){
    return this._attrs.items;
  }

  get email(){
    return this._attrs.email;
  }

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
    '_base':    [
      () => { return true; },
      () => { this.addValidationError('_base', "It's not valid"); return false; }
    ],
    'username': [new SampleValidationRuleFixture(), new SampleValidationRuleFixture2()],
    'email':    [new SampleValidationRuleFixture()],
    'items':    [new SampleValidationRuleFixture2()],
    'active':   []
  }
}
