import {ValidationRule} from './validation';

/**
 * Implements a base class on top of we implement our models.
 * It works in the server and in the browser.
 */
export class BaseModel {
  protected _attrs: any
  protected _prevAttrs: Object
  private _errors: Object
  private validationRules: Object

  constructor(initialAttributes:Object = {}) {

    this._attrs = {};
    this._prevAttrs = {};
    this._errors = {};

    // Extend with defaults first
    _.extend(this._attrs, this.defaults());

    // Merge with initialization attributes too
    const initialAttributesKeys = Object.keys(initialAttributes);
    for (let i = 0; i < initialAttributesKeys.length; i++) {
      this._attrs[initialAttributesKeys[i]] = initialAttributes[initialAttributesKeys[i]];
    }

    // On initialization, the prev attributes are the initial attributes
    Object.assign(this._prevAttrs, this._attrs);
  }

  get errors() : Object { return this._errors; }
  public getAttrErrors(attributeName:string) : any[] {
    return (this._errors[attributeName] ? this._errors[attributeName] : []);
  }

  // Callbacks to run before and after the record validation
  private beforeValidation() {}
  private afterValidation() {}

  // NOTE: Implement it when extending
  /**
   * Sets the default values for the attributes when a new instance is created
   */
  public defaults() : Object {
    return {};
    // Sample:
    //
    // return {
    //   'name' : 'Chuck Norris',
    //   'active' : true
    // }
  }
  
  protected addUniqueValueToArray(collectionName:string, attrValue:any) : boolean {
    if (this._attrs[collectionName].indexOf(attrValue) < 0) {
      this._attrs[collectionName].push(attrValue);
      return true;
      }
    return false;
  }

  protected removeValueFromArray(collectionName:string, attrValue) : boolean {
    let index = this._attrs[collectionName].indexOf(attrValue);
    if ( index >= 0) {
        this._attrs[collectionName].splice(index, 1);
        return true;
    }
    return false;
  }

  /**
   * Adds a validation error on a specific attribute
   */
  private addValidationError(attributeName:string, errorMessage:string) : void {
    if (!this._errors[attributeName]) {
      this._errors[attributeName] = [];
    }
    this._errors[attributeName].push(errorMessage);
  }

  /**
   * Validates the model according to its ValidationRules
   */
  public validate() : boolean {
    console.log(' + validating the document');
    this.beforeValidation();

    if(!this.validationRules){
      throw new Error("No validation rules defined!");
    }
    // Reset errors
    this._errors = {};

    let attrNames = Object.keys(this._attrs),
        matchAllValidations = true;

    // Validate every ValidationRule in every attribute
    for (let i = 0; i < attrNames.length; i++) {
      if (this.validationRules[attrNames[i]]) {
        if (!this.validateAttr(attrNames[i])) {
          matchAllValidations = false;
        }
      }
    }

    // Validate all custom ValidationRules
    if (this.validationRules['_base'] && this.validationRules['_base'].length > 0) {
      for (let i = 0; i < this.validationRules['_base'].length; i++) {
        if (!this.validationRules['_base'][i]()) {
          matchAllValidations = false;
        }
      }
    }

    this.afterValidation();
    return matchAllValidations;
  }

  /**
   * Checks if the model is a valid model according to its ValidationRules
   */
  public isValid() : boolean {
    let invalidAttrs = Object.keys(this['_errors']);
    return (invalidAttrs.length === 0 ? true : false);
  }

  /**
   * Validates a model attribute according to its ValidationRules
   */
  public validateAttr(attributeName:string) : boolean {
    let matchAllValidations = true,
        validationRule;
    for (let i = 0; i < this.validationRules[attributeName].length; i++) {
      validationRule = this.validationRules[attributeName][i];

      // Check if entity is valid and collect all validation errors if any
      if (!validationRule.isValid(this._prevAttrs[attributeName], this._attrs[attributeName])) {
        // Add the validator message to the MeteorModel
        this.addValidationError(attributeName, validationRule._invalidMessage);
        matchAllValidations = false;
      }
    }

    return matchAllValidations;
  }

  /**
   * Checks whether an attribute value is valid
   */
  public isValidAttr(attributeName:string) : boolean {
    return (this.getAttrErrors(attributeName).length === 0 ? true : false);
  }

  /**
   * Checks whether the model has attributes changed since the last sync
   */
  public hasChanged() : boolean {
    let attrName, prevAttrName,
        attrNames = Object.keys(this._attrs),
        prevAttrNames = Object.keys(this._prevAttrs);

    if (attrNames.length !== prevAttrNames.length) {
      return true;
    }

    for (prevAttrName of prevAttrNames) {
      if (this._prevAttrs[prevAttrName] !== this._attrs[prevAttrName]) {
        return true;
      }
    }

    return false;
  }

  /**
   * Checks whether a model attribute has changed since the last sync
   */
  public hasAttrChanged(attrName:string) : boolean {
    return (this._attrs[attrName] !== this._prevAttrs[attrName]);
  }

  /**
   * Returns the JSON expected by the Meteor endpoints.
   * Override it in your extended classes when you need to process a different JSON structure
   */
  public toOriginJSON() : Object {
    return this['_attrs'];
  }
}
