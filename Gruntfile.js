'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt);

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

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/**/{,*/}*.js'],
        tasks: ['newer:jshint:test']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9060,
        // Change this to '0.0.0.0' to access the server from outside.
        //hostname: 'localhost',
        hostname: '0.0.0.0',
        livereload: 35760
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            var serveStatic = require('serve-static');
            return [
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              serveStatic('./test'),
              serveStatic(appConfig.app),
              connect().use(require('morgan')('combined'))
            ];
          }
        }
      },
      test: {
        options: {
          port: 9061,
          middleware: function (connect) {
            var serveStatic = require('serve-static');
            return [
              serveStatic('./test'),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              serveStatic(appConfig.app)
            ];
          }
        }
      }
    },
    
    jasmine: {
      validator: {
        src: 'validator.js',
        options: {
          specs: 'test/unit/*.spec.js',
          helpers: 'test/helpers/*.helper.js',
          host: 'http://localhost:9061',
          keepRunner: true,
          template: 'test/spec-runner-tmpl.html',
          outfile: 'test/index.html'
        }
      }
    },

    jasmine_nodejs: {
      // task specific (default) options
      options: {
        specNameSuffix: ".spec.js", // also accepts an array
        helperNameSuffix: ".helper.js",
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
          "test/helpers/**"
        ]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/test/spec-runner-tmpl.html'],
        devDependencies: true
      }
    }



  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function () {
    grunt.task.run([
      'wiredep',
      'connect:livereload',
      'watch'
    ]);
  });


  grunt.registerTask('test', [
    'nsp',
    'wiredep',
    'jasmine_nodejs',
    'connect:test',
    'jasmine'
  ]);

  grunt.registerTask('default', [
    'test'
  ]);
};
