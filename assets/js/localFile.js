function ImagePreview(fileElement, dropElement, options) {
  'use strict';
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

  // create and add canvas to the drop zone
  var editCanvas = document.createElement("canvas");
  editCanvas.setAttribute("id", this.dropElement + "_canvas");
  editCanvas.setAttribute("width", this.width + "px");
  editCanvas.setAttribute("height", this.height + "px");
  dropElementObj.insertBefore(editCanvas, null);
}

ImagePreview.prototype.loadFile = function (file, dropElementId) {
  'use strict';
  var reader = new FileReader();

  if (!file.type.match('image.*')) {
    throw "File type not supported";
  } 

  var ctx = document.getElementById(dropElementId + "_canvas").getContext('2d'); 

  reader.onload = (function () {
    return function (e) {
        var img = new Image();
        img.onload = function() {

          var imgWidth = img.width,
              imgHeight = img.height,
              newWidth = this.width,
              newHeight = this.height,
              ratio = 1;

          if (imgWidth > imgHeight) {
            ratio = imgWidth / this.width;
          }  else {
            ratio = imgHeight / this.height;
          }

          newHeight = imgHeight / ratio;
          newWidth = imgWidth / ratio;

          console.log("%s => %s", imgWidth, newWidth);
          console.log("%s => %s", imgHeight, newHeight);
          console.log(ratio);

          ctx.drawImage(img, 0 , 0, newWidth, newHeight);
        }.bind(this);

        img.src = e.target.result;
      };
    }(file)).bind(this);

    reader.readAsDataURL(file);
};

ImagePreview.prototype.handleFileChange = function(evt) {
  'use strict';
  var captureId = this.dropElement;
  console.log(ImagePreview.prototype);
  if (evt.target.files.length < 1) {
    return;
  }

  var file = evt.target.files[0];
  this.loadFile(file, captureId);
};

ImagePreview.prototype.handleDragOver = function(evt) {
  'use strict';
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy';
};

ImagePreview.prototype.handleDropFile = function(evt) {
  'use strict';
  evt.stopPropagation();
  evt.preventDefault();

  var captureId = evt.currentTarget.id;

  if (evt.dataTransfer.files.length < 1) {
    console.log('no file has been selected');
    return;
  }

  var file = evt.dataTransfer.files[0];

  this.loadFile(file, captureId);  
};

ImagePreview.prototype.registerPreviewContainer = function() {
  'use strict';
  
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

ImagePreview.prototype.isSupported = function() {
  'use strict';
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    return true;
  }
  
  return false;
};