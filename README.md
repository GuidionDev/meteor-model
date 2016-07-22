## meteor-model

Implements a basic functionality to build Meteor models that hold business logic, validation and data persistance.

### Functionality

##### 1. Assign default attributes
##### 2. Validate records according to its validation rules
##### 3. Generate error messages for every invalid attributes
##### 4. Subscribe to a Meteor publication
##### 5. Persist data through a Meteor endpoint (when used in the browser)
##### 6. Persist data through Mongo (when used in Node)

### Continuous integration

##### 1. Compile Typescript in real time
###### 1.1 `cd tests; sudo npm link`
###### 1.2 `tsc -w`
##### 2. Run the tests in real time
##### `meteor test --driver-package=practicalmeteor:mocha`

### Generate documentation

`typedoc --out docs src/meteor_model --target ES6 --ignoreCompilerErrors`

### TO-DO

##### 1. (Completed) Make tests run
##### 2. (Started) Write meteor-model unit tests
##### 3. (Completed) Write ValidationRule tests
##### 4. (Completed) Write LengthValidator tests
##### 5. (Pending) Write RegExpValidator tests
##### 6. (Completed) Write EmailValidator tests
##### 7. (Completed) Write RequiredValidator tests
