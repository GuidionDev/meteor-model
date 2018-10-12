/**
 * Represents a validation rule
 */
export class ValidationRule<T extends any> implements IValidationRule {
  protected conditions: Array<Function> = [];
  public fromValue:any;
  public toValue:any
  public params:Object
  private _invalidMessage = "Invalid";

  constructor(params?:T) {    
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
   * Adds an invalid message to the ValidationRule
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

  isValid(fromValue:any, toValue:any);
}
