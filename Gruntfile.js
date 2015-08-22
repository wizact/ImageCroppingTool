module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-watch');

  
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
        },
        watch: {
            scripts: {
                files: ['File/*.js'],
                tasks: ['default']
            }
        }
    });

    grunt.registerTask('default', ['jslint', 'jshint']);
    
    grunt.event.on('watch', function(action, filepath) {
        // grunt.log.write(action);
    });
};
