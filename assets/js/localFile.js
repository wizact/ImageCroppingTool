var imagePreview = (function () {
    'use strict';
    var elementCollection = [];

    function getPreviewElementByFileTarget(targetId) {
    var previewElementId = '';
    elementCollection.forEach(function (item) {
      if (item.fileElement === targetId) {
        previewElementId = item.previewElement;
      }
    }); 
 
    return previewElementId;
  }

  function getDropElementByFileTarget(targetId) {
    var previewElementId = '';
    elementCollection.forEach(function (item) {
      if (item.dropElement === targetId) {
        previewElementId = item.previewElement;
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

      document.getElementById(dropElement).style.width = width;
      document.getElementById(dropElement).style.height = height;

      document.getElementById(fileElement).style.width = width;
  };

  function loadFile(file, previewElementId) {
    var previewContainer = document.getElementById(previewElementId),
    reader = new FileReader();

    if (!file.type.match('image.*')) {
      throw "File type not supported";
    }

    reader.onload = (function () {
      return function (e) {
        var previewItem = previewContainer.getElementsByTagName("span");
        if (previewItem !== undefined &&
          previewItem.length > 0) {
            previewItem[0].remove();
          }

          previewItem = document.createElement('span');
          previewItem.innerHTML = '<img src="' + e.target.result + '" /><br>';
          previewContainer.insertBefore(previewItem, null);
        };
      }(file));

      reader.readAsDataURL(file);
    }

    function handleFileChange(evt) {

      var previewElementId = getPreviewElementByFileTarget(evt.target.id);

      if (!previewElementId || previewElementId === "") {
        return;
      }

      if (evt.target.files.length < 1) {
        return;
      }

      var file = evt.target.files[0];
      loadFile(file, previewElementId);
    }

    function handleDropFile(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      var previewElementId = getDropElementByFileTarget(evt.currentTarget.id);

      if (!previewElementId || previewElementId === "") {
        return;
      }

      if (evt.dataTransfer.files.length < 1) {
        console.log('no file has been selected');
        return;
      }

      var file = evt.dataTransfer.files[0];

      loadFile(file, previewElementId);
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

    function registerPreviewContainer(fileElement, dropElement, previewElement, options) {
      elementCollection.push({ "fileElement": fileElement, "dropElement": dropElement, "previewElement": previewElement});
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
