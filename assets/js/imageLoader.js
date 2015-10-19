var ImageLoader = (function(){ 
  'use strict';
  function ImageLoader(fileElement, dropElement, loadcb, options) {
    this.cb = loadcb;
    this.width = 300;
    this.height = 30;

    if (options !== undefined) {
      this.width = options.width || this.width;
      this.height = options.height || this.height;
    }

    this.fileElement = fileElement;
    this.dropElement = dropElement;

    var dropElementObj = document.getElementById(this.dropElement);
    dropElementObj.style.width = this.width + "px";
    dropElementObj.style.height = this.height + "px";
    
    document.getElementById(this.fileElement).style.width = this.width + "px";
  }

  ImageLoader.prototype.loadFile = function (file) {
    var reader = new FileReader();

    if (!file.type.match('image.*')) {
      throw "File type not supported";
    } 

    reader.onload = (function () {
      return function (e) {
          return this.cb(e.target.result);
        };
      }(file)).bind(this);

      reader.readAsDataURL(file);
  };

  ImageLoader.prototype.handleFileChange = function(evt) {
    if (evt.target.files.length < 1) {
      return;
    }

    var file = evt.target.files[0];
    this.loadFile(file);
  };

  ImageLoader.prototype.handleDragOver = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  };

  ImageLoader.prototype.handleDropFile = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    // var captureId = evt.currentTarget.id;

    if (evt.dataTransfer.files.length < 1) {
      console.log('no file has been selected');
      return;
    }

    var file = evt.dataTransfer.files[0];

    this.loadFile(file);  
  };

  ImageLoader.prototype.init = function() {
    document.getElementById(this.fileElement).addEventListener('change', function(e) {
          this.handleFileChange(e);
      }.bind(this), false);

    if (this.dropElement !== "") {
      
      var dropZone = document.getElementById(this.dropElement);
      dropZone.addEventListener('dragover', function(e) {
          this.handleDragOver(e);
      }.bind(this), true);

      dropZone.addEventListener('drop', function(e) {
          this.handleDropFile(e);
      }.bind(this), true);
    }
  };

  ImageLoader.prototype.isSupported = function() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      return true;
    }
    
    return false;
  };

  return ImageLoader;
}());