module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jslint: {
        client: {
            src: ['File/*.js'],
            exclude: [],
            directives: {
                browser: true,
                white: true,
                vars: true,
                predef: [
                    "angular",
                    "$",
                    "document",
                    "FileReader",
                    "console",
                    "window",
                    "module"
                ]
            }
        }
    },
    jshint: {
        files: ['File/*.js'],
        options: {
            jshintrc: true
        }
    }
  });

  
  grunt.registerTask('default', ['jslint', 'jshint']);
};
