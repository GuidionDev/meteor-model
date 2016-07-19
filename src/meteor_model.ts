import {ValidationRule} from './validation';

/**
 * Implements a base class on top of we implement our models.
 * It works in the server and in the browser.
 */
export class MeteorModel {
  public _id:number
  private transport = "Meteor";
  private _attrs: Object
  private _errors: Object
  private validationRules: Object
  public static COLLECTION_NAME = null
  public static METEOR_METHOD_RESOURCE_NAME = null

  constructor(initialAttributes:Object = {}) {
    this._attrs = { id: null };
    this._errors = {};

    // Extend with defaults first
    _.extend(this._attrs, this.defaults());
    // Extend with initialization attributes too
    _.extend(this._attrs, initialAttributes);
  }

  get errors() { return this._errors; }
  public getAttrErrors(attributeName:string) {
    return (this._errors[attributeName] ? this._errors[attributeName] : []);
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
    return (!this._id);
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
    this.beforeValidation();

    // Reset errors
    this['_errors'] = {};

    let attrNames = Object.keys(this._attrs);

    /*
      Model attributes:
      _attrs: {
        email: '',
        age: 0
      }

      Model validation rules:
      validationRules: {
        email: [
          new RequiredValidator,
          new LengthValidator({ min: 1, max: 100 })
        ],
        age: [
          new RequiredValidator
        ]
      }

      // Errors after validation
      _errors: {
        email: [
          '"" is required',
          '"" is not a valid email'
        ],
        age: ['required']
      }
    */

    let matchAllValidations = true;

    console.log('I have this validation rules: ', this.validationRules);

    for (let i = 0; i < attrNames.length; i++) {
      if (this.validationRules[attrNames[i]]) {
        if (!this.validateAttr(attrNames[i])) {
          matchAllValidations = false;
        }
      }
    }

    console.log('errors after validation: ', this._errors);

    this.afterValidation();
    return matchAllValidations;
  }

  /**
   * Validates a model attribute according to its ValidationRules
   */
  public validateAttr(attributeName:string) {
    let matchAllValidations = true;

    for (let i = 0; i < this.validationRules[attributeName].length; i++) {
      let validationRule = this.validationRules[attributeName][i];
      // Check if entity is valid and collect all validation errors if any
      if (!validationRule.isValid(/* TODO: pass previous value */ null, this.attr(attributeName))) {
        // Add the validator message to the MeteorModel
        this.addValidationError(attributeName, validationRule.getInvalidMessage());
        matchAllValidations = false;
      }
    }

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
   * Checks weather an attribute value is valid
   */
  public isValidAttr(attributeName:string) : boolean {
    return (this.getAttrErrors(attributeName).length === 0 ? true : false);
  }

  /**
   * Retrieves or sets attributes
   */
  public attr(key?:string, value?:string): Object|any {
    if (!key) {
      // Return all attributes as an Object
      return this._attrs;
    } else {
      if (typeof(value) === "undefined") {
        // Returns a specific attribute value
        return this._attrs[key];
      } else {
        // Sets a specific attribute
        this._attrs[key] = value;
      }
    }
  }

  /**
   * Removes an attribute value from the model attributes
   */
  public removeAttr(key:string) : void {
    this.attr(key, null);
  }

  /**
   * Adds an item to an attribute list and saves it if specified
   */
  public addAttrItem(collectionAttrName:string, attrValue:any, sync:boolean = false) : void {
    this['_attrs'][collectionAttrName].push(attrValue);
    if (sync) { this.save(); }
  }

  /**
   * Removes an item from the attribute list
   */
  public removeAttrItem(attrCollectionName:string, index:number, sync:boolean = false) : void {
    this['_attrs'][attrCollectionName].splice(index, 1);
    if (sync) { this.save(); }
  }

  /**
   * Saves the model entity
   */
  public save() : Promise<MeteorModel>|MeteorModel {
    this.beforeSave();
    if (Meteor.isServer) {
      console.log('Running .save() in the backend');
      if (this.isNew()) {
        return Mongo.Collection.get(this['COLLECTION_NAME']).insert(this.attr());
      } else {
        return Mongo.Collection.get(this['COLLECTION_NAME']).update({_id: this._id}, this.attr());
      }
    } else {
      console.log('Running .save() in the frontend');
      return new Promise((resolve, reject) => {
        Meteor.call(this['METEOR_METHOD_RESOURCE_NAME'] + '.save', this.attr(), (error, result) => {
          if (error) {
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
   * It fetches de data from the server
   */
  public fetch() : Promise<MeteorModel>|MeteorModel {
    if (Meteor.isClient) {
      console.log("Running .fetch() in the client");
      if (Meteor.isServer) {
        return Mongo.Collection.get(this['COLLECTION_NAME']).find({_id: this._id}, (err, cursor) => {
          if (!err && cursor) {
            console.log('cursor: ', cursor);
            this._attrs = cursor;
          }
        });
      } else {

      }
    }
  }


  /**
   * Subscribes for the resource collection using a specific query
   */
  public static subscribe(query: Object = {}, onReadyCallback:Function = () => {}) : void {
    console.log('Subscribing to : ', this['COLLECTION_NAME'] + '.read_collection');
    Meteor.subscribe(this['COLLECTION_NAME'] + '.read_collection', () => {
      return [query];
    }, {
      onReady: onReadyCallback
    });
  }


  /**
   * Destroys an entity
   */
  public destroy() : Promise|MeteorModel {
    this.beforeDestroy();
    if (Meteor.isServer) {
      console.log('Running .destroy() in the backend');
      return Mongo.Collection.get(this['COLLECTION_NAME']).remove({ _id: this._id });
    } else {
      return new Promise((resolve, reject) => {
        console.log('Running .destroy() in the frontend');
        Meteor.call(this['COLLECTION_NAME'] + '.remove', this, (error, result) => {
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
   * Retrieves a collection of model instances
   */
  public static fetchIndex(query: Object = {}) : Promise<Array<MeteorModel>>|Array<MeteorModel> {
    let self = this;

    // In the server it will call the real Mongo.
    // In the frontend it will call a fake Mongo object (Meteor)
    if (Meteor.isServer) {
      console.log('Running #fetchIndex() in the backend with this query: ', query);
      // In the backend we return data only
      return Mongo.Collection.get(this['COLLECTION_NAME']).find(query);
    } else {
      console.log('Running #fetchIndex() in the frontend with this query: ', query);
      // However, in the frontend we return an instance of the model containing the data and its methods
      return Mongo.Collection.get(this['COLLECTION_NAME']).find(query, { transform: (doc) => {
        return this.buildFromMongoDoc(doc);
      }});
    }
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
      console.log('Running #fetchOne() in the frontend from this id: ', id);
    }

    return Mongo.Collection.get(this['COLLECTION_NAME']).findOne({_id: id}, { transform: (doc) => {
      return this.buildFromMongoDoc(doc);
    }});
  }

  /**
   * Builds a model instance from a Mongo document
   */
  public static buildFromMongoDoc(doc:Object) {
    const attrs = {};
    _.extend(attrs, doc['profile']);
    return (new this(attrs));
  }
}
