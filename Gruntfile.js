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
    app: require('./bower.json').appPath || __dirname
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    nsp: {
      package: grunt.file.readJSON('./package.json'),
      shrinkwrap: grunt.file.readJSON('./npm-shrinkwrap.json')
    },


    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all']
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
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
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      }
    }
  });


  grunt.registerTask('test', [
    'nsp',
    'jasmine_nodejs'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test'
  ]);
};
