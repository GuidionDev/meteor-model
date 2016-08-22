import {ValidationRule} from './validation';

/**
 * Implements a base class on top of we implement our models.
 * It works in the server and in the browser.
 */
export class MeteorModel {
  private transport = "Meteor";
  protected _attrs: any
  protected _prevAttrs: Object
  private _errors: Object
  private validationRules: Object
  public static COLLECTION: any
  public static COLLECTION_NAME = 'default'

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

  get errors() { return this._errors; }
  public getAttrErrors(attributeName:string) {
    return (this._errors[attributeName] ? this._errors[attributeName] : []);
  }

  get id(){
    return this._attrs._id;
  }

  /**
   * Callbacks for before and after Create and save
   */
  private beforeCreate() { }
  private afterCreate() { }

  // Callbacks to run before and after the record validation
  private beforeValidation() {}
  private afterValidation() {}

  // Callbacks to run before and after save the record
  private beforeSave() { }
  private afterSave() {}

  // Callsbacks to run before and after updating the record
  private beforeUpdate() { }
  private afterUpdate() { }

  // Callbacks to run before and after destroying the record
  private beforeDestroy() { }
  private afterDestroy() { }

  public defaults() {
    // TODO: Implement it when extending
    // return {
    //   'name' : 'Chuck Norris',
    //   'active' : true
    // }
  }

  /**
   * Checks wether the MeteorModel instance is a new record
   */
  public isNew() {
    return (!this.id);
  }

  /**
   * Adds a validation error on a specific attribute
   */
  private addValidationError(attributeName:string, errorMessage:string) {
    if (!this._errors[attributeName]) {
      this._errors[attributeName] = [];
    }
    this._errors[attributeName].push(errorMessage);
  }


  /**
   * Validates the model according to its ValidationRules
   */
  public validate() {
    console.log('validation the record!');
    this.beforeValidation();

    // Reset errors
    this._errors = {};

    let attrNames = Object.keys(this._attrs);
    console.log('attribute names: ', attrNames);

    let matchAllValidations = true;

    console.log('I have this validation rules: ', this.validationRules);

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
  public isValid() {
    let invalidAttrs = Object.keys(this['_errors']);
    return (invalidAttrs.length === 0 ? true : false);
  }

  /**
   * Validates a model attribute according to its ValidationRules
   */
  public validateAttr(attributeName:string) {
    let matchAllValidations = true;
    for (let i = 0; i < this.validationRules[attributeName].length; i++) {
      let validationRule = this.validationRules[attributeName][i];
      console.log('checking validation rule for attr: ', attributeName);
      // Check if entity is valid and collect all validation errors if any
      if (!validationRule.isValid(/* TODO: pass previous value */ null, this._attrs[attributeName])) {
        // Add the validator message to the MeteorModel
        this.addValidationError(attributeName, validationRule._invalidMessage);
        matchAllValidations = false;
      }
    }

    return matchAllValidations;
  }

  /**
   * Checks weather an attribute value is valid
   */
  public isValidAttr(attributeName:string) : boolean {
    return (this.getAttrErrors(attributeName).length === 0 ? true : false);
  }

  /**
   * Checks wether the model has attributes changed since the last sync
   */
  public hasChanged():boolean {
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
   * Checks wether a model attribute has changed since the last sync
   */
  public hasAttrChanged(attrName:string):boolean {
    return (this._attrs[attrName] !== this._prevAttrs[attrName]);
  }

  /**
   * Saves the model entity
   */
  public save() : Promise<MeteorModel>|MeteorModel {
    this.beforeSave();
    if (Meteor.isServer) {
      console.log('Running .save() in the backend', this._attrs);
      if (this.isNew()) {
        return this.constructor['COLLECTION'].insert(this._attrs);
      } else {
        return this.constructor['COLLECTION'].update({_id: this.id}, this._attrs);
      }
    } else {
      console.log('Running .save() in the frontend', this.constructor['COLLECTION_NAME']);
      return new Promise((resolve, reject) => {
        Meteor.call(this.constructor['COLLECTION_NAME'] + '.save', this._attrs, (error, result) => {
          if (error) {
            console.log(error);
            reject(Error(error));
          } else {
            this.afterSave();
            resolve(result);
          }
        });
      });
    }
  }

  /**
   * Returns
   */
  public toString() {
    let finalAttrs = this['_attrs']; finalAttrs['_id'] = this['_id'];
    return finalAttrs;
  }

  /**
   * Destroys an entity
   */
  public destroy() : Promise<string>|MeteorModel {
    this.beforeDestroy();
    if (Meteor.isServer) {
      console.log('Running .destroy() in the backend');
      return this.constructor['COLLECTION'].remove({ _id: this.id });
    } else {
      return new Promise((resolve, reject) => {
        console.log('Running .destroy() in the frontend');
        Meteor.call(this.constructor['COLLECTION_NAME'] + '.remove', this, (error, result) => {
          if (error) {
            reject(Error(error));
          } else {
            resolve(result);
            this.afterDestroy();
          }
        });
      });
    }
  }

  /**
   * Subscribes for the resource collection using a specific query
   */
  public static getPublicationName(collection:boolean) : string {
    return (this.COLLECTION_NAME + '.read_' +(collection ? 'collection' : 'one'));
  }

  /**
   * Retrieves a cursor to a collection of model instances
   */
  public static fetchCursor(query: Object = {}, options: any = {}) : Promise<Array<MeteorModel>>|Array<MeteorModel> {
    let self = this;
    options.transform = (doc) => {
        return (new this(doc));
    }
    // In the server it will call the real Mongo.
    // In the frontend it will call a fake Mongo object (Meteor)
    if (Meteor.isServer) {
      console.log('Running #fetchCursor() in the backend with this query: ', query);
    } else {
      console.log('Running #fetchCursor() in the frontend with this query: ', query);
    }
    return this.COLLECTION.find(query, options);
  }

  /**
   * Retrieves a single MeteorModel instance
   */
  public static fetchOne(id: string) : Promise<MeteorModel>|MeteorModel {
    const self = this;
    // In the server it will call the real Mongo.
    // In the frontend it will call a fake Mongo object (Meteor)
    if (Meteor.isServer) {
      console.log('Running #fetchOne() in the backend from this id: ', id);
    } else {
      console.log('Running #fetchOne() in the frontend from this ID: ', id);
    }
    let doc = this.COLLECTION.findOne(id);
    return doc ? (new this(doc)) : undefined;
  }
}
