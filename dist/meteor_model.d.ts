/**
 * Implements a base class on top of we implement our models.
 * It works in the server and in the browser.
 */
export declare class MeteorModel {
    private transport;
    protected _attrs: Object;
    private _errors;
    private validationRules;
    static COLLECTION_NAME: string;
    constructor(initialAttributes?: Object);
    errors: Object;
    getAttrErrors(attributeName: string): any;
    id: any;
    /**
     * Callbacks for before and after Create and save
     */
    private beforeCreate();
    private afterCreate();
    private beforeValidation();
    private afterValidation();
    private beforeSave();
    private afterSave();
    private beforeUpdate();
    private afterUpdate();
    private beforeDestroy();
    private afterDestroy();
    defaults(): void;
    /**
     * Checks wether the MeteorModel instance is a new record
     */
    isNew(): boolean;
    /**
     * Adds a validation error on a specific attribute
     */
    private addValidationError(attributeName, errorMessage);
    /**
     * Validates the model according to its ValidationRules
     */
    validate(): boolean;
    /**
     * Checks if the model is a valid model according to its ValidationRules
     */
    isValid(): boolean;
    /**
     * Validates a model attribute according to its ValidationRules
     */
    validateAttr(attributeName: string): boolean;
    /**
     * Checks weather an attribute value is valid
     */
    isValidAttr(attributeName: string): boolean;
    /**
     * Checks wether the model has attributes changed since the last sync
     */
    hasChanged(): boolean;
    /**
     * Checks wether a model attribute has changed since the last sync
     */
    hasAttrChanged(attrName: string): boolean;
    /**
     * Adds an item to an attribute list and saves it if specified
     */
    addAttrItem(collectionAttrName: string, attrValue: any, sync?: boolean): void;
    /**
     * Removes an item from the attribute list
     */
    removeAttrItem(attrCollectionName: string, index: number, sync?: boolean): void;
    /**
     * Saves the model entity
     */
    save(): Promise<MeteorModel> | MeteorModel;
    /**
     * It fetches de data from the server
     */
    fetch(): Promise<MeteorModel> | MeteorModel;
    /**
     * Destroys an entity
     */
    destroy(): Promise | MeteorModel;
    /**
     * Subscribes for the resource collection using a specific query
     */
    static getPublicationName(collection: boolean): string;
    /**
     * Retrieves a collection of model instances
     */
    static fetchIndex(query?: Object, options?: Object): Promise<Array<MeteorModel>> | Array<MeteorModel>;
    /**
     * Retrieves a single MeteorModel instance
     */
    static fetchOne(id: string): Promise<MeteorModel> | MeteorModel;
}
