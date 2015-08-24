module.exports = function (grunt) {
    'use strict';


    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-bower-task');
  
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jslint: {
            client: {
                src: ['assets/js/*.js'],
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
            files: ['assets/js/*.js'],
            options: {
                jshintrc: true
            }
        },
        watch: {
            scripts: {
                files: ['assets/js/*.js', 'assets/sass/*.scss'],
                tasks: ['default']
            }
        },
        sass: {                              
            dist: {                           
                files: [{
                    expand: true,
                    cwd: 'assets/sass',
                    src: ['**/*.scss'],
                    dest: 'assets/css',
                    ext: '.css'
                }]
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: './assets/lib',
                    install: true,
                    cleanTargetDir: false,
                    layout: 'byType'
                }
            }
        }
    });

    grunt.registerTask('default', ['jslint', 'jshint', 'sass', 'bower:install']);

    grunt.event.on('watch', function(action, filepath) {
        //grunt.log.write(filepath);
    });
};
