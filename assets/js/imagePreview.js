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
    this.width = 300;
    this.height = 30;

    if (options !== undefined) {
        this.width = options.width || this.width;
        this.height = options.height || this.height;
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
    //var ctx = document.getElementById(this.previewElement + "_canvas").getContext('2d'); 

    var img = new Image();
    img.setAttribute("id", "img1");
    img.setAttribute("class", "imgToResize");
    
    // default size of image after load
    //img.setAttribute("width",  "100px");
    //img.setAttribute("height", "100px");

    img.onload = function() {
        
        /*
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
        */
        document.getElementById(this.previewElement).insertBefore(img, null);


        //var col = document.getElementById('#img1');

        img.addEventListener('mousedown', handleMouseDown, false);
    }.bind(this);

    img.src = imageData;
};