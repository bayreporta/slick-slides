// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {

  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  grunt.initConfig({

    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),

    // configure jshint to validate js files -----------------------------------
    jshint: {
      files: 'src/**/*.js',
      options: {
        globals:{
          jQuery:true,
          console:true,
          module:true
        },
        reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
      }
    },

    // configure uglify to minify js files -------------------------------------
    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'dist/scripts/slick-slides.min.js': ['src/**/*.js']
        }
      }
    },

    // configure compass for css preprocesser -------------------------------------
    compass: {
      dist: {
        options: {
            sassDir: 'src/sass',
            cssDir: 'dist/css',
            environment: 'production',
            outputStyle: 'compressed'
        }
      }
    },

    // automate tasks -----------------------------------------------------
    watch: {
        files: ['src/**/*.js', 'src/**/*.scss'],
        tasks: ['uglify', 'jshint', 'compass']
    }


  });

  // ===========================================================================
  // LOAD GRUNT PLUGINS ========================================================
  // ===========================================================================
  // we can only load these if they are in our package.json
  // make sure you have run npm install so our app can find these
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint','compass', 'watch']);
};
