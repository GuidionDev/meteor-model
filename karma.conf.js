process.env.PHANTOMJS_BIN = './node_modules/phantomjs-prebuilt/bin/phantomjs';

// Karma configuration
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    frameworks: ['jasmine'],

    // files && patterns to load in the browser
    files: [
      // Dependencies
      { pattern: 'node_modules/es6-promise/dist/es6-promise.min.js', included: true },
      { pattern: 'node_modules/karma-requirejs/lib/index.js', included: true },


      // Meteor model
      { pattern: 'src-js/src/meteor_model.js', included: true },
      { pattern: 'src-js/src/validation.js', included: true },

      // Test data
      { pattern: 'src-js/specs/fixtures/meteor_model_fixture.js', included: true },
      { pattern: 'src-js/specs/fixtures/sample_validation_rule_fixture.js', included: true },

      // Specs
      { pattern: 'src-js/specs/meteor_model_specs.js', included: true },
    ],


    // list of files to exclude
    exclude: [

    ],

    client: {
      captureConsole: true,
      mocha: {
        bail: false
      }
    },

    // test results reporter to use
    // 'dots', 'progress', 'html'
    reporters: ['mocha'],// , 'html'],
    // jasmine html report at: url/debug.html

    // web server port
    port: 9876,

    usePolling: true,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
