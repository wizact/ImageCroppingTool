module.exports = function (grunt) {
    'use strict';


    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-http-server');
  
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
                files: [
                'assets/js/*.js', 
                'assets/sass/*.scss',
                'html/*.html'],
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
                build: {
                    files: {
                        'dist/build/assets/js/imagebundle.min.js': 
                        [
                            'dist/build/temp/assets/js/imageLoader.js',
                            'dist/build/temp/assets/js/imagePreview.js'
                        ],
                        'dist/build/assets/js/jquery.min.js': 
                        [
                            'dist/build/temp/assets/lib/jquery/jquery.js'
                        ]
                }
            }
        },
        cssmin: {
          build: {
            files: [{
              expand: true,
              cwd: 'dist/build/temp/assets/css',
              src: ['*.css', '!*.min.css'],
              dest: 'dist/build/assets/css',
              ext: '.min.css'
            }]
          }
        },
        htmlmin: {                                     
          build: {                                      
            options: {                                 
              removeComments: true,
              collapseWhitespace: true
            },
            files: [{ 
              expand: true,
              cwd: 'dist/build/temp/html/',
              src: ['**/*.html'],                                  
              dest: 'dist/build/'
            }]
          }
        },
        processhtml: {
            build: {
                options: {
                  process: true,
                  data: {
                    title: 'My app',
                    message: 'This is production distribution'
                  }
                },
                files: {
                  'dist/build/temp/html/file.html': ['html/file.html']
                }
            }
        },
        clean: {
            build: {
                src: [ 'dist/build/**' ]
            },
            temp: {
                src: [ 'dist/build/temp/**' ]  
            }
        },
        copy: {
            build: {
                files: [
                    { 
                        expand: true, 
                        src: 
                        [
                            'assets/**/*.js',
                            'assets/**/*.css'
                        ], 
                        dest: 'dist/build/temp/'
                    }
                ]
            }
        },
        'http-server': {
           'build': {
               root: './dist/build/',
               port: 8282,
               host: "0.0.0.0",
               showDir : true,
               autoIndex: true,
               ext: "html",
               runInBackground: false,
               openBrowser : false
            },
            'dev': {
               root: './',
               port: 8383,
               host: "0.0.0.0",
               showDir : true,
               autoIndex: true,
               ext: "html",
               runInBackground: false,
               openBrowser : false
            }
        }
    });

    grunt.registerTask('default', ['jslint', 'jshint', 'sass', 'bower:install']);
    grunt.registerTask('build', ['clean:build', 'copy:build', 'processhtml:build', 'uglify:build', 'cssmin:build', 'htmlmin:build', 'clean:temp']);
    
    grunt.registerTask('rebuild', ['default', 'build', 'http-server:build']);

    grunt.event.on('watch', function(action, filepath) {
        //grunt.log.write(filepath);
    });
};
