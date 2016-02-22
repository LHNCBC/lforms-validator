// Generated on 2014-10-20 using generator-angular 0.9.8
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    connect: 'grunt-contrib-connect',
    jasmine: 'grunt-contrib-jasmine',
    jshint: 'grunt-contrib-jshint',
    nsp: 'grunt-nsp',
    protractor: 'grunt-protractor-runner',
    wiredep: 'grunt-wiredep'
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
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
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
        port: 9040,
        // Change this to '0.0.0.0' to access the server from outside.
        //hostname: 'localhost',
        hostname: '0.0.0.0',
        livereload: 35750
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
              serveStatic('test/protractor'),
              serveStatic(appConfig.app),
              connect().use(require('morgan')('combined'))
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            var serveStatic = require('serve-static');
            return [
              serveStatic('test/protractor'),
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

    jasmine : {
      src : 'lforms-converter.js',
      options : {
        specs : 'test/unit/**/*.spec.js',
        vendor: [
          'bower_components/oboe/dist/oboe-browser.js',
          'bower_components/traverse/traverse.js',
          'bower_components/lodash/lodash.js'
        ],
        helpers: 'test/unit/**/*.fixtures.js'
      }
    },

    protractor: {
      options: {
        configFile: './test/protractor/conf.js' // Default config file
        // If keepAlive it true, grunt test finishes with the statement "Done,
        // without errors" even when there are errors.
        //keepAlive: true // If false, the grunt process stops when the test fails.
      },
      all: {}   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
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
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/test/protractor/index.html'],
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

  grunt.registerTask('setTestPort', 'Read test port from protractor config file', function() {
    var protractorConfig = require(grunt.config.get('protractor.options.configFile'));
    var urlParts = require('url').parse(protractorConfig.config.baseUrl);
    var port = parseInt(urlParts.port);
    grunt.config.set('connect.test.options.port', port);
  });

  grunt.registerTask('test', [
    'nsp',
    'wiredep',
    'jasmine',
    'setTestPort',
    'connect:test',
    'protractor'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test'
  ]);
};
