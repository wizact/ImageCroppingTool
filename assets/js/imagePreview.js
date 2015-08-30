var imageDragState = false;
var activeElementToMove = "";
var prevX = 0, prevY = 0;
var deltaX = 0, deltaY = 0;

var handleMouseUp = function() {
    'use strict';
    imageDragState = false;
  };

var handleMouseMove = function(e) {
    'use strict';
    if (imageDragState) {
        deltaX = e.pageX - prevX;
        deltaY = e.pageY - prevY;

        var panel = document.getElementById(activeElementToMove);

        panel.style.left = panel.offsetLeft + deltaX + "px";
        panel.style.top = panel.offsetTop + deltaY + "px";

        prevX = e.pageX;
        prevY = e.pageY;
    }
  };

document.addEventListener('mousemove', handleMouseMove, false);
document.addEventListener('mouseup', handleMouseUp, false);

function ImagePreview(previewElement, options) {
    'use strict';
    // Drop zone size
    this.width = 300;
    this.height = 30;

    // Preview image size
    this.previewWidth = 300;
    this.previewHeight = 30;

    if (options !== undefined) {
        this.width = options.width || this.width;
        this.height = options.height || this.height;
    }

    if (options !== undefined) {
        this.previewWidth = options.previewWidth || this.previewWidth;
        this.previewHeight = options.previewHeight || this.previewHeight;
    }

    this.previewElement = previewElement;

    var previewElementObj = document.getElementById(this.previewElement);
    previewElementObj.style.width = this.width + "px";
    previewElementObj.style.height = this.height + "px";

    // create and add canvas to the drop zone
    // var editCanvas = document.createElement("canvas");
    // editCanvas.setAttribute("id", this.previewElement + "_canvas");
    // editCanvas.setAttribute("width", this.width + "px");
    // editCanvas.setAttribute("height", this.height + "px");
    // previewElementObj.insertBefore(editCanvas, null);
}

var handleMouseDown = function(e) {
    'use strict';
    imageDragState = true;
    activeElementToMove = e.currentTarget.id;
    prevX = e.pageX;
    prevY = e.pageY;
};

ImagePreview.prototype.load = function(imageData) {
    'use strict';
    // var ctx = document.getElementById(this.previewElement + "_canvas").getContext('2d'); 

    var img = new Image();
    img.setAttribute("id", this.previewElement + "_img");
    img.setAttribute("class", "imgToResize");
    img.setAttribute("draggable", "false");

    var resizeContainer = document.createElement("div");
    resizeContainer.setAttribute("id", this.previewElement + "_resizeContainer");
    resizeContainer.setAttribute("class", "containerToResize");
    resizeContainer.setAttribute("draggable", "false");    

    img.onload = function() {
        var imgWidth = img.width,
            imgHeight = img.height,
            newWidth = this.previewWidth,
            newHeight = this.previewHeight,
            ratio = 1;

        if (imgWidth > imgHeight) {
            ratio = imgWidth / this.previewWidth;
        }  else {
            ratio = imgHeight / this.previewHeight;
        }

        newHeight = imgHeight / ratio;
        newWidth = imgWidth / ratio;

        img.setAttribute("width",  100 + "%");
        img.setAttribute("height", 100 + "%");

        // default size of image after load
        resizeContainer.style.width = newWidth + "px";
        resizeContainer.style.height = newHeight + "px";

        // Move the preview to the center of the drop zone
        resizeContainer.style.left = Math.floor((this.width / 2) - (newWidth /2)) + "px";
        resizeContainer.style.top = Math.floor((this.height / 2) - (newHeight /2)) + "px";
        
        
        // ctx.drawImage(img, 0 , 0, newWidth, newHeight);
        document.getElementById(this.previewElement).insertBefore(resizeContainer, null);
        document.getElementById(this.previewElement + '_resizeContainer').insertBefore(img, null);
        resizeContainer.addEventListener('mousedown', handleMouseDown, false);
    }.bind(this);

    img.src = imageData;
};