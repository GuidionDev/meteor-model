![travis build](https://travis-ci.com/GuidionDev/meteor-model.svg?token=bMu85Urom9SKygWhZ7dr&branch=master)

## meteor-model

Implements a basic functionality to build Meteor models that hold business logic, validation and data persistance.

### Functionality

##### 1. Assign default attributes
##### 2. Validate records according to its validation rules
##### 3. Generate error messages for every invalid attributes
##### 4. Persist data through a Meteor endpoint (when used in the browser)
##### 5. Persist data through Mongo (when used in Node)

### Continuous integration

##### 1. Compile Typescript in real time
##### `tsc -w`

##### 2. Run the tests in real time
##### `meteor test --driver-package=practicalmeteor:mocha`

### Generate documentation

`typedoc --out docs src/meteor_model --target ES6 --ignoreCompilerErrors`

### Link meteor-model into global npm packages path

##### 1. `cd tests; sudo npm link`
