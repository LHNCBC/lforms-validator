'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    jshint: 'grunt-contrib-jshint',
    nsp: 'grunt-nsp',
    jasmine_nodejs: 'grunt-jasmine-nodejs'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: __dirname
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    nsp: {
      package: grunt.file.readJSON('./package.json'),
      shrinkwrap: grunt.file.readJSON('./npm-shrinkwrap.json')
    },

    jasmine_nodejs: {
      // task specific (default) options
      options: {
        specNameSuffix: "spec.js", // also accepts an array
        helperNameSuffix: "helper.js",
        useHelpers: false,
        stopOnFailure: false,
        // configure one or more built-in reporters
        reporters: {
          console: {
            colors: true,
            cleanStack: 1,       // (0|false)|(1|true)|2|3
            verbosity: 4,        // (0|false)|1|2|3|(4|true)
            listStyle: "indent", // "flat"|"indent"
            activity: false
          }
        },
        // add custom Jasmine reporter(s)
        customReporters: []
      },
      tests: {
        // target specific options
        options: {
          useHelpers: true
        },
        // spec files
        specs: [
          "test/unit/**"
        ],
        helpers: [
          "test/unit/**"
        ]
      }
    }
  });


  grunt.registerTask('test', [
    'nsp',
    'jasmine_nodejs'
  ]);

  grunt.registerTask('default', [
    'test'
  ]);
};
