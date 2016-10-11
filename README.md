![travis build](https://travis-ci.com/GuidionDev/meteor-model.svg?token=bMu85Urom9SKygWhZ7dr&branch=master)

## meteor-model

Implements a basic functionality to build Meteor models that hold business logic, validation and data persistance. It's built to work in combination with typescript.

### Functionality

##### 1. Assign default attributes
##### 2. Validate records according to its validation rules
##### 3. Generate error messages for every invalid attributes
##### 4. Persist data through a Meteor endpoint (when used in the browser)
##### 5. Persist data through Mongo (when used in Node)

### Using it in your project

##### 1. npm install --save @gdn/meteor-model
##### 2. Extend from either meteorModel or baseModel
###### Use BaseModel if you just need validation and no persistance, MeteorModel contains both.
##### 3. Make sure to set the COLLECTION and COLLECTION_NAME fields with your mongo collection and it's name.
###### If you use Meteor model on the front-end, for example to save, it will try to use a meteor method called COLLECTION_NAME.save 
##### 4. Create (typescript) properties to expose the attributes stored and retrieved by meteorModel
##### 5. (Optional) Use validation rules, or create your own to validate user input either server side or client side(or both)
