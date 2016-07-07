module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      files: [
        './src-js/**/*.js'
      ],
      tasks: ['karma']
    },

    //  Karma runner (BDD)
    // ------------------------------------------------------------------------
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  // grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-karma');
  // grunt.loadNpmTasks('grunt-ts');

  grunt.registerTask('default', [/*'ts', */ 'concat', 'uglify']);
};
