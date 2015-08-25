var imagePreview = (function () {
    'use strict';
    var elementCollection = [];

  function getcaptureIdByFileTarget(targetId) {
    var previewElementId = '';
    elementCollection.forEach(function (item) {
      if (item.fileElement === targetId) {
        previewElementId = item.dropElement;
      }
    }); 
 
    return previewElementId;
  }

  /**
   * Add styling to the elements
   * @param {string} fileElement
   * @param {string} dropElement
   * @param {object} options
   */
  var initializeElements = function(fileElement, dropElement, options) {
      var width = "300px";
      var height = "30px";

      if (options !== undefined) {
        width = options.width || width;
        height = options.height || height;
        console.log(width);
        console.log(height);
      }

      var dropElementObj = document.getElementById(dropElement);
      dropElementObj.style.width = width;
      dropElementObj.style.height = height;

      document.getElementById(fileElement).style.width = width;

      // create and add canvas to the drop zone
      var editCanvas = document.createElement("canvas");
      editCanvas.setAttribute("id", dropElement + "_canvas");
      editCanvas.setAttribute("width", width);
      editCanvas.setAttribute("height", height);
      dropElementObj.insertBefore(editCanvas, null);
  };

  function loadFile(file, dropElementId) {
    //var previewContainer = document.getElementById(previewElementId),
    var reader = new FileReader();

    if (!file.type.match('image.*')) {
      throw "File type not supported";
    } 

    var ctx = document.getElementById(dropElementId + "_canvas").getContext('2d'); 
 
    reader.onload = (function () {
      return function (e) {
          var img = new Image();
          img.onload = function() {
            ctx.drawImage(img, 0 , 0);
          };

          img.src = e.target.result;
        };
      }(file));

      reader.readAsDataURL(file);
    }

    function handleFileChange(evt) {
      var captureId = getcaptureIdByFileTarget(evt.target.id);
      
      if (evt.target.files.length < 1) {
        return;
      }

      var file = evt.target.files[0];
      loadFile(file, captureId);
    }

    function handleDropFile(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      var captureId = evt.currentTarget.id;

      if (evt.dataTransfer.files.length < 1) {
        console.log('no file has been selected');
        return;
      }

      var file = evt.dataTransfer.files[0];

      loadFile(file, captureId);
    }
    
    function handleDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy';
    }

    function isSupported() {
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        return true;
      }
      return false;
    }

    function registerPreviewContainer(fileElement, dropElement, options) {
      elementCollection.push({ "fileElement": fileElement, "dropElement": dropElement });
      document.getElementById(fileElement).addEventListener('change', handleFileChange, false);

      if (dropElement !== "") {
        var dropZone = document.getElementById(dropElement);
        dropZone.addEventListener('dragover', handleDragOver, true);
        dropZone.addEventListener('drop', handleDropFile, true);
      }
      
      // Init the stylong for elements
      initializeElements(fileElement, dropElement, options);
    }

    return {
      supported: isSupported,
      register: registerPreviewContainer
    };

  }());
