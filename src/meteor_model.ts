import {ValidationRule} from './validation';
import {BaseModel} from './base_model';

/**
 * Implements a base class on top of we implement our models.
 * It works in the server and in the browser.
 */
export class MeteorModel extends BaseModel {
  private transport = "Meteor";
  public static COLLECTION: any
  public static COLLECTION_NAME = 'default'

  constructor(initialAttributes:Object) { super(initialAttributes); }

  get id() : any {
    return this._attrs._id;
  }

  /**
   * Callbacks for before and after Create and save
   */
  private beforeCreate() { }
  private afterCreate() { }

  // Callbacks to run before and after saving the record
  private beforeSave() { }
  private afterSave() {}

  // Callsbacks to run before and after updating the record
  private beforeUpdate() { }
  private afterUpdate() { }

  // Callbacks to run before and after destroying the record
  private beforeDestroy() { }
  private afterDestroy() { }

  /**
   * Checks whether the MeteorModel instance is a new record
   */
  public isNew() : boolean {
    return (!this.id);
  }

  /**
   * Saves the model entity
   */
  public save() : Mongo.Cursor<MeteorModel> | Promise<any> {
    this.beforeSave();
    if (Meteor.isServer) {
      console.log(' + Running .save() in the backend', this._attrs);
      if (this.isNew()) {
        const id = this.constructor['COLLECTION'].insert(this._attrs);
        return this._attrs._id = id;
      } else {
        return this.constructor['COLLECTION'].update({_id: this.id}, this._attrs);
      }
    } else {
      console.log(' + Running .save() in the frontend', this.constructor['COLLECTION_NAME']);
      return new Promise((resolve, reject) => {
        Meteor.call(this.constructor['COLLECTION_NAME'] + '.save', this.toOriginJSON(), (error, result) => {
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
   * Returns the JSON expected by the Meteor endpoints.
   * Override it in your extended classes when you need to process a different JSON structure
   */
  public toOriginJSON() : Object {
    return this['_attrs'];
  }

  /**
   * Destroys an entity
   */
  public destroy() : Mongo.Cursor<MeteorModel> | any {
    this.beforeDestroy();
    if (Meteor.isServer) {
      console.log(' + Running .destroy() in the backend');
      return this.constructor['COLLECTION'].remove({ _id: this.id });
    } else {
      let promise = new Promise((resolve, reject) => {
        console.log(' + Running .destroy() in the frontend');
        Meteor.call(this.constructor['COLLECTION_NAME'] + '.remove', this.id, (error, result) => {
          if (error) {
            reject(Error(error));
          } else {
            resolve(result);
            this.afterDestroy();
          }
        });
      });
      return promise;
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
  public static fetchCursor(query: Object = {}, options: any = {}) : Mongo.Cursor<MeteorModel> {
    let self = this;
    options.transform = (doc) => {
        return (new this(doc));
    }
    // In the server it will call the real Mongo.
    // In the frontend it will call a fake Mongo object (Meteor)
    if (Meteor.isServer) {
      console.log(' + Running #fetchCursor() in the backend with this query: ', query);
    } else {
      console.log(' + Running #fetchCursor() in the frontend with this query: ', query);
    }
    return this.COLLECTION.find(query, options);
  }

  /**
   * Retrieves a single MeteorModel instance
   */
  public static fetchOne(id: string) : MeteorModel | any {
    const self = this;
    // In the server it will call the real Mongo.
    // In the frontend it will call a fake Mongo object (Meteor)
    if (Meteor.isServer) {
      console.log(' + Running #fetchOne() in the backend from this id: ', id);
    } else {
      console.log(' + Running #fetchOne() in the frontend from this ID: ', id);
    }
    let doc = this.COLLECTION.findOne(id);
    return doc ? (new this(doc)) : undefined;
  }
}
