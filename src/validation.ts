/**
 * Represents a validation rule
 */
export class ValidationRule implements IValidationRule {
  protected conditions: Array<Function> = [];
  public fromValue:any;
  public toValue:any
  public params:Object
  private _invalidMessage = "Invalid";

  constructor(params?:any) {
    this.params = params;
    this._invalidMessage = "";
  }

  /**
   * Retrieves the invalid message for the ValidationRule
   */
  get invalidMessage(): string {
    return this._invalidMessage;
  }

  /**
   * Checks if the ValidationRule is valid
   */
  public isValid(fromValue:any, toValue:any): Boolean {
    this.fromValue = fromValue;
    this.toValue = toValue;

    // Reset the invalid message
    this._invalidMessage = '';

    for(let i=0; i < this.conditions.length; i++) {
      if (this.conditions[i]() === false) {
        return false;
      }
    }
    return true;
  }

  /**
   * Ads an invalid message to the ValidationRule
   */
  public addInvalidMessage(message:String) {
    this._invalidMessage += message;
  }
}

/**
 * ValidationRule implementation
 */
export interface IValidationRule {
  params: any;
  // conditions: Array<Function|any>;
  invalidMessage: String;

  validate();
}

// ----[ Our validators ]------------------------------------------------------

/**
 * LengthValidator
 */
interface LengthValidatorParams { min: number, max: number }
export class LengthValidator extends ValidationRule {
  protected conditions:Array<Function> = [
    () => {
      let match:Boolean = true;

      if (this.toValue.length < this.params['min']) {
        match = false;
        this.addInvalidMessage(this.toValue + " is shorter than " + this.params['min']);
      }
      if (this.toValue.length > this.params['max']) {
        match = false;
        this.addInvalidMessage(this.toValue + " is longer than " + this.params['max']);
      }

      return match;
    }
  ]
}

/**
 * RegExpValidator
 */
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

/**
 * EmailValidator
 */
export class EmailValidator extends ValidationRule {
  protected conditions:Array<Function> = [
    // Check for email regexp...
    () => {
      let match:Boolean = true;
      const regExpValidator = new RegExpValidator({ rule: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i });
      if (!regExpValidator.isValid(this.fromValue, this.toValue)) {
        this.addInvalidMessage(this.toValue + ' is not a valid email address');
        match = false;
      }
      return match;
    }
  ]
}


/**
 * RequiredValidator
 */
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

export class AllowedValueSwitchValidator extends ValidationRule {
    // Sample of value changes declaration:
    // { matches: [
    //     { from: "open", to: ["scheduled", "canceled", "closed"] }
    // ]}

  protected conditions:Array<Function> = [
    () => {
      let match:Boolean = false;

      if (this.params && this.params['matches'] && this.params['matches'].length) {
        for (let i = 0; i < this.params['matches'].length; i++) {
          const rule = this.params['matches'][i];
          if (rule['from'] && rule['to'] && rule['to'].length) {
            // Origin value matched
            if (rule['from'] === this.fromValue) {
              // Check that the destination value also matches
              for (let i2 = 0; i2 < rule['to'].length; i2++) {
                if (!match) {
                  if (this.toValue === rule['to'][i2] && !match) {
                    match = true;
                  }
                }
              }
            } else {
              match = false;
            }
          }
        }
      }
      if (!match) {
        this.addInvalidMessage(this.fromValue + " cannot change to '" + this.toValue + "'");
      }

      return match;
    }
  ]
}
