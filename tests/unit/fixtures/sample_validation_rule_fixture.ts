import {ValidationRule} from "@gdn/meteor-model";

export class SampleValidationRuleFixture extends ValidationRule {
  private conditions:Array<Function> = [
    () => {
      return true;
    },
    () => {
      return true;
    }
  ]
}

export class SampleValidationRuleFixture2 extends ValidationRule {
  private conditions:Array<Function> = [
    () => {
      return true;
    },
    () => {
      this.addInvalidMessage("Invalid message");
      return false;
    }
  ]
}

export class SampleGlobalValidationRuleFixture extends ValidationRule {
  private conditions:Array<Function> = [
    () => { return true; },
    () => { this.addInvalidMessage('Invalid field');
    return false;}
  ]
}
