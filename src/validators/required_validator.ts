import {ValidationRule} from '../validation'

export class RequiredValidator extends ValidationRule {
  protected conditions:Array<Function> = [
    () => {
      let match:Boolean = true;
      if (typeof(this.toValue) === "undefined") {
        match = false;
        this.addInvalidMessage("A value is required and was not provided");
      }
      return match;
    }
  ]
}