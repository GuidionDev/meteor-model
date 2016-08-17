import {MeteorModel} from "@gdn/meteor-model";
import MeteorModelFixture from "./fixtures/meteor_model_fixture";
import {assert} from 'meteor/practicalmeteor:chai';

const meteorModelFixture = new MeteorModelFixture();
let modelInstance;

describe('MeteorModel', () => {
  describe(".constructor()", () => {
    xit("should set initial attributes containing a null id attribute?", (done) => {
      modelInstance = new MeteorModelFixture();

      assert.isDefined(modelInstance.id);
      assert.equal(modelInstance.id, null);
      done();
    });

    it("should set the default attributes", () => {
      modelInstance = new MeteorModelFixture();

      assert.isDefined(modelInstance._attrs);
      assert.deepEqual(modelInstance._attrs, {
        username: 'username-1',
        email: 'david@guidion.com',
        items: [{
          name: "Item 1",
          active: false
        }],
        active: false
      });
    });

    it("should merge the initial attributes on top of the default attributes", () => {
      modelInstance = new MeteorModelFixture({
        username: 'username-10001',
        items: [{
          name: "A different Item",
          active: true
        }],
      });

      assert.deepEqual(modelInstance._attrs, {
        username: 'username-10001',
        email: 'david@guidion.com',
        items: [{
          name: "A different Item",
          active: true
        }],
        active: false
      });

    });

    it("should have empty _errors", () => {
      assert.deepEqual(modelInstance._errors, {});
    });
  });

  describe('.isNew()', () => {
    it("should check wether the record is a new a record not persisted to the database", () => {
      modelInstance = new MeteorModelFixture();
      assert.equal(modelInstance.isNew(), true);
      modelInstance._attrs._id = 1001;
      assert.equal(modelInstance.isNew(), false);
    });
  });

  describe(".addValidationError()", () => {
    it("should add an error message to the errors object on an specific attribute name", () => {
      modelInstance = new MeteorModelFixture();
      assert.equal(modelInstance.addValidationError());
    });
  });

  describe(".validate()", () => {
    beforeEach(() => {
      modelInstance = new MeteorModelFixture();
    });

    it("should validate all the ValidationRules for every attribute and the global validators and build a list of errors", () => {
      modelInstance.validate();
      assert.deepEqual(modelInstance._errors, {
        username:  ["Invalid message"],
        items: ["Invalid message"],
        '_base': ["It's not valid"]
      });
    });
  });

  describe(".isValid()", () => {
    it("should check if the model attributes are valid by looking into the _errors field", () => {
      modelInstance = new MeteorModelFixture();
      modelInstance._errors = {
        name:  ["Invalid message 1", "Super invalid"],
        items: ["Invalid message"]
      };
      assert.equal(modelInstance.isValid(), false);
      modelInstance._errors = {};
      assert.equal(modelInstance.isValid(), true);
    });
  });

  describe(".validateAttr()", () => {
    it("should validate a specific attribute using its ValidationRules and update the _errors field with the invalid messages", () => {
      modelInstance = new MeteorModelFixture();
      modelInstance._errors = {
        name: ["Invalid message 1", "Super invalid"],
        // Note that errors for "items" is not there
      };
      modelInstance.validateAttr("items");
      // Note that the _errors object should only be modified at the specific attribute
      assert.deepEqual(modelInstance._errors, {
        name:  ["Invalid message 1", "Super invalid"],
        items: ["Invalid message"]
      });
    });
  });

  describe(".isValidAttr()", () => {
    it("should check if a model attribute is valid by looking into the _errors field", () => {
      modelInstance = new MeteorModelFixture();
      modelInstance._errors = {
        name: ["Invalid message 1", "Super invalid"],
        items: ["Invalid message"]
      };
      assert.equal(modelInstance.isValidAttr("name"), false);
      assert.equal(modelInstance.isValidAttr("email"), true);
      assert.equal(modelInstance.isValidAttr("items"), false);
      assert.equal(modelInstance.isValidAttr("active"), true);
    });
  });

  describe('.hasChanged()', () => {
    xit("it should check wether the record has been changed since the last sync", () => {

    });
  });

  describe('.hasAttrChanged()', () => {
    xit("it should check wether a specific attribute on a record has been changed since the last sync", () => {

    });
  });

  describe('.addAttrItem()', () => {
    it("should add an item to an list attribute", () => {
      modelInstance = new MeteorModelFixture();
      modelInstance.addAttrItem("items", {
        name: "A New Item",
        active: true
      });
      assert.deepEqual(modelInstance.items, [
        {
          name: "Item 1",
          active: false
        },
        {
          name: "A New Item",
          active: true
        }
      ]);
    });
  });

  describe(".save()", () => {
    xit("should call the right Meteor method", () => {

    });

    xit("should return a Promise", () => {

    });
  });

  describe(".fetch()", () => {
    xit("should return a Promise", () => {

    });

    xit("should fetch the attributes by calling the right Meteor method", () => {

    });
  });

  describe('.subscribe()', () => {
    xit("should subscribe for the Meteor resource publication", () => {

    });
  });

  describe(".destroy()", () => {
    xit("should return a Promise", () => {

    });

    xit("should call the right Meteor method", () => {

    });
  });

  describe("#fetchIndex()", () => {
    xit("should return a Promise", () => {

    });

    xit("should resolve the Promise with an array of instances of the ModelEntities with the attribute values retrieved from Meteor", () => {

    });
  });

  describe("#fetchOne()", () => {
    xit("should return a Promise", () => {

    });

    xit("should resolve the Promise with an instance of the MeteorModel with the attribute values retrieved from Meteor", () => {

    });
  });
});
