// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'client/bower_components/es5-shim/es5-shim.js',
      'client/bower_components/jquery/dist/jquery.js',
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/bower_components/angular-cookies/angular-cookies.js',
      'client/bower_components/angular-simple-logger/dist/angular-simple-logger.js',
      'client/bower_components/lodash/dist/lodash.compat.js',
      'client/bower_components/angular-google-maps/dist/angular-google-maps.js',
      'client/bower_components/angular-recaptcha/release/angular-recaptcha.js',
      'client/bower_components/angular-resource/angular-resource.js',
      'client/bower_components/angular-sanitize/angular-sanitize.js',
      'client/bower_components/angular-socialshare/dist/angular-socialshare.min.js',
      'client/bower_components/angular-ui-router/release/angular-ui-router.js',
      'client/bower_components/bootstrap/dist/js/bootstrap.js',
      'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/affix.js',
      'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/alert.js',
      'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/button.js',
      'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/carousel.js',
      'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/collapse.js',
      'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/dropdown.js',
      'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tab.js',
      'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/transition.js',
      'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/scrollspy.js',
      'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/modal.js',
      'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tooltip.js',
      'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/popover.js',
      'client/bower_components/json3/lib/json3.js',
      'client/bower_components/ng-file-upload/ng-file-upload.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/bower_components/angular-scenario/angular-scenario.js',
      // endbower
      'client/app/app.js',
      'client/app/app.coffee',
      'client/app/**/*.js',
      'client/app/**/*.coffee',
      'client/components/**/*.js',
      'client/components/**/*.coffee',
      'client/app/**/*.jade',
      'client/components/**/*.jade',
      'client/app/**/*.html',
      'client/components/**/*.html'
    ],

    preprocessors: {
      '**/*.jade': 'ng-jade2js',
      '**/*.html': 'html2js',
      '**/*.coffee': 'coffee',
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    ngJade2JsPreprocessor: {
      stripPrefix: 'client/'
    },



    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
