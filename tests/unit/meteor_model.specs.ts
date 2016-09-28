import {MeteorModel} from "@gdn/meteor-model";
import MeteorModelFixture from "./fixtures/meteor_model_fixture";
import { chai, assert, expect } from 'meteor/practicalmeteor:chai';
import { spies } from 'meteor/practicalmeteor:sinon';

const meteorModelFixture = new MeteorModelFixture({});
let modelInstance;

describe('MeteorModel', () => {
  describe(".constructor()", () => {
    it("should set the default attributes", () => {
      modelInstance = new MeteorModelFixture({});

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

    it("should set the previous attributes", () => {
      modelInstance = new MeteorModelFixture({
        username: 'username-10001',
        items: [{
          name: "A different Item",
          active: true
        }],
      });

      assert.deepEqual(modelInstance._prevAttrs, {
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
      modelInstance = new MeteorModelFixture({});
      assert.equal(modelInstance.isNew(), true);
      modelInstance._attrs._id = 1001;
      assert.equal(modelInstance.isNew(), false);
    });
  });

  describe(".addValidationError()", () => {
    it("should add an error message to the errors object on an specific attribute name", () => {
      modelInstance = new MeteorModelFixture({});
      assert.equal(modelInstance.addValidationError());
    });
  });

  describe(".validate()", () => {
    beforeEach(() => {
      modelInstance = new MeteorModelFixture({});
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
      modelInstance = new MeteorModelFixture({});
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
      modelInstance = new MeteorModelFixture({});
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
      modelInstance = new MeteorModelFixture({});
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
    it("it should check wether the record has been changed since the last sync or from instantiation", () => {
      modelInstance = new MeteorModelFixture({ name: "My Original Name" });
      assert.equal(modelInstance.hasChanged(), false);
      modelInstance._attrs = { id: null, name: "Chuck Norris" };
      modelInstance._prevAttrs = { id: null };
      assert.equal(modelInstance.hasChanged(), true);
    });
  });

  describe('.hasAttrChanged()', () => {
    it("it should check wether a specific attribute on a record has been changed since the last sync or from instantiation", () => {
      modelInstance = new MeteorModelFixture({ name: "My Original Name" });
      assert.equal(modelInstance.hasAttrChanged('name'), false);
      modelInstance._attrs['name'] = 'My New Name';
      assert.equal(modelInstance.hasAttrChanged('name'), true);
    });
  });

  describe(".save()", () => {
    if (Meteor.isClient) {
      let mockMeteor = (done) => {
        Meteor.__call = Meteor.call;
        Meteor.call = function(name) {
          if (name === 'collection.save') { done(); return "saved"; }
          return Meteor.__call.apply(this, arguments);
        }
      }

      describe("on the client", () => {
        it("should call the right Meteor method", (done) => {
          mockMeteor(done);
          modelInstance = new MeteorModelFixture({ name: "My Original Name" });
          spies.create('collectionSaveSpy', Meteor, 'call');
          modelInstance.save();
          expect(spies.collectionSaveSpy).to.have.been.calledWith('collection.save');
          spies.restoreAll();
        });
      });
    } else {
      describe("on the server", () => {
        describe("with no id(new)", () => {
          it("should try to insert a new record in mongo", () => {
            modelInstance = new MeteorModelFixture({ name: "My Original Name" });
            spies.create('insertMongoMethodSpy', modelInstance.constructor["COLLECTION"], 'insert');
            modelInstance.save();
            expect(spies.insertMongoMethodSpy).to.have.been.calledWith(modelInstance._attrs);
            spies.restoreAll();
          });
        });
        describe("with an id(existing)", () => {
          it("should try to update an existing record in mongo", () => {
            modelInstance = new MeteorModelFixture({ name: "My Original Name" });
            modelInstance._attrs._id = '123456789';
            spies.create('updateMongoMethodSpy', modelInstance.constructor["COLLECTION"], 'update');
            modelInstance.save();
            expect(spies.updateMongoMethodSpy).to.have.been.calledWith({ _id: '123456789' }, modelInstance._attrs);
            spies.restoreAll();
          });
        });
      });
    }
  });

  describe(".destroy()", () => {
    if(Meteor.isClient) {
      describe("on the client", () => {
        let mockMeteor = (done) => {
          Meteor.__call = Meteor.call;
          Meteor.call = function(name) {
            if (name === 'collection.remove') { done(); return "destroyed"; }
            return Meteor.__call.apply(this, arguments);
          }
        }

        it("should call the right Meteor method", (done) => {
          mockMeteor(done);
          modelInstance = new MeteorModelFixture({ name: "My Original Name" });
          spies.create('collectionDestroySpy', Meteor, 'call');
          modelInstance.destroy();
          expect(spies.collectionDestroySpy).to.have.been.calledWith('collection.remove');
          spies.restoreAll();
        });
      });
    } else {
      describe("on the server", () => {
        it("should remove the record using the Mongo api", () => {
          modelInstance = new MeteorModelFixture({ name: "My Original Name" });
          modelInstance['_attrs']['_id'] = 1001;
          let removeMongoMethodSpy = spies.create('removeMongoMethodSpy', modelInstance.constructor["COLLECTION"], 'remove');
          modelInstance.destroy();
          expect(spies.removeMongoMethodSpy).to.have.been.calledWith({ _id: 1001 });
          spies.restoreAll();
        });
      });
    }
  });

  describe("#fetchCursor()", () => {
    let email, result;
    beforeEach(() => {
      email = 'test@test.nl';
      MeteorModelFixture.COLLECTION.find = (query, options) => {
        return options.transform({email: email})
      };
    });

    it("should return an instance of the model entity", () => {
      var result = MeteorModelFixture.findCursor();
      assert.equal(result.constructor.name, MeteorModelFixture.name);
      assert.equal(result.email, email);
    });
  });

  describe("#fetchOne()", () => {
    let invalidId, email;
    beforeEach(() => {
      invalidId = '1', email = 'test@test.nl';
      // Mock findOne
      MeteorModelFixture.COLLECTION.findOne = (id) => {
        if (id === invalidId) {
          return undefined;
        }
        return {email: email}
      };
    });

    describe("when the record exists in the Mongo collection", () => {
      it("an instance of the model entity", () => {
        var result = MeteorModelFixture.fetchOne('12345');
        assert.equal(result.constructor.name, MeteorModelFixture.name);
        assert.equal(result.email, email);
      });
    });

    describe("when the record doesn't exist in the Mongo collection", () => {
      it("should return undefined", () => {
        var result = MeteorModelFixture.fetchOne(invalidId);
        assert.isUndefined(result);
      });
    });
  });
});
