import {ValidationRule} from '../validation'

export class RegExpValidator extends ValidationRule {
  protected conditions:Array<Function> = [
    () => {
      let match:Boolean = true;
      if (!this.toValue || !this.toValue.match || !this.toValue.match(this.params['rule'])) {
        match = false;
      }
      return match;
    }
  ]
}