import MeteorModel from "../src/meteor_model";
import MeteorModelFixture from "./fixtures/meteor_model_fixture";
import {assert} from 'meteor/practicalmeteor:chai';

declare var describe: any;
declare var it: any;
declare var xit: any;

const meteorModelFixture = new MeteorModelFixture();
let modelInstance;

describe('MeteorModel', () => {
  describe(".constructor()", () => {
    it("should set initial attributes containing a null id attribute", (done) => {
      modelInstance = new MeteorModelFixture();

      assert.isDefined(modelInstance._attrs['id']);
      assert.equal(modelInstance._attrs['id'], null);
      done();
    });

    it("should set the default attributes", () => {
      modelInstance = new MeteorModelFixture();

      assert.isDefined(modelInstance._attrs);
      assert.equal(modelInstance._attrs, {
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

      assert.equal(modelInstance._attrs, {
        username: 'username-10001',
        email: 'david@guidion.com',
        items: [{
          name: "A different Item",
          active: true
        }],
        active: false
      });
    });
  });

  describe('.isNew()', () => {
    it("should check wether the record is a new a record not persisted to the database", () => {
      modelInstance = new MeteorModelFixture();
      assert.equal(modelInstance.isNew(), true);
      modelInstance._attrs['id'] = 1001;
      assert.equal(modelInstance.isNew(), false);
    });
  });

  describe(".addValidationError()", () => {
    it("should add an error message to the errors object on an specific attribute name", () => {

    });
  });

  describe(".validate()", () => {
    it("should validate all the ValidationRules for every attribute", () => {

    });
  });

  describe(".isValid()", () => {
    xit("should validate all ValidationRules at once", () => {

    });

    xit("it should collect all errors of each field organized by attribute name", () => {

    });
  });

  describe(".validateAttr()", () => {

  });

  describe(".isValidAttr()", () => {
    xit("should validate all ValidationRules in a specific attribute", () => {

    });

    xit("should add every error message from an invalid ValidationRule to the errors Object", () => {

    });
  });

  describe(".attr()", () => {
    describe("when no parameters are provided", () => {
      xit("should retrieve all attributes", () => {

      });
    });

    describe("when parameters are provided", () => {
      describe("when only an attribute name is provided", () => {
        xit("should retrieve the attribute value for the attribute name provided", () => {

        });
      });
      describe("when both attribute name and attribute value is provided", () => {
        xit("should set the attribute value provided for the attribute name provided", () => {

        });
      });
    });
  });

  describe('.removeAttr()', () => {
    it("should set to null a specific attribute", () => {

    });
  });

  describe('.addAttrItem()', () => {
    it("should add an item to an list attribute", () => {

    });
  });

  describe('.removeAttrItem()', () => {
    it("should remove an item in a specific index from a list attribute", () => {

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
