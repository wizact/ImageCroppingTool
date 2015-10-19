module.exports = function (grunt) {
    'use strict';


    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
  
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
                        "module",
                        "Image"
                    ]
                }
            }
        },
        jshint: {
            ignores: [],
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
        },
        uglify: {
            options: {
           banner: 
                '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */ \r'
            },
            my_target: {
                files: {
                    'dist/assets/js/imagebundle.min.js': [
                        'assets/js/imageLoader.js',
                        'assets/js/imagePreview.js'
                    ]
                }
            }
        },
        cssmin: {
          target: {
            files: [{
              expand: true,
              cwd: 'assets/css',
              src: ['*.css', '!*.min.css'],
              dest: 'dist/assets/css',
              ext: '.min.css'
            }]
          }
        }
    });

    grunt.registerTask('default', ['jslint', 'jshint', 'sass', 'bower:install', 'uglify', 'cssmin']);

    grunt.event.on('watch', function(action, filepath) {
        //grunt.log.write(filepath);
    });
};
