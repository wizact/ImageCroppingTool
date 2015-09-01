var imageDragState = false;
var imageResizeState = false;
var activeElementToMove = '';
var prevX = 0, prevY = 0;
var deltaX = 0, deltaY = 0;

var resizeState = {
    type: '',
    activeElementToResize: '',
    width: 0, height: 0,
    top: 0, left: 0,
    prevX: 0, prevY: 0,
    deltaX: 0, deltaY: 0
};

var handleMouseUp = function() {
    'use strict';
    imageDragState = false;
    imageResizeState = false;
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
    } else if (imageResizeState && resizeState.activeElementToResize !== '') {
        
        var resizePanel = document.getElementById(resizeState.activeElementToResize);
        
        var computedWidth = parseInt(window.getComputedStyle(resizePanel, null).getPropertyValue('width'), 10);
        var computedHeight = parseInt(window.getComputedStyle(resizePanel, null).getPropertyValue('height'), 10);
        var computedTop = parseInt(window.getComputedStyle(resizePanel, null).getPropertyValue('top'), 10);
        var computedLeft = parseInt(window.getComputedStyle(resizePanel, null).getPropertyValue('left'), 10);

        switch (resizeState.type) {
            case 'se':
                resizeState.deltaX = e.pageX - resizeState.prevX;
                resizeState.deltaY = e.pageY - resizeState.prevY;

                resizePanel.style.width = computedWidth +  resizeState.deltaX + "px";
                resizePanel.style.height = computedHeight + resizeState.deltaY + "px";

                resizeState.prevX = e.pageX;
                resizeState.prevY = e.pageY;
            break;
            case 'ne':
                resizeState.deltaX = e.pageX - resizeState.prevX;
                resizeState.deltaY = e.pageY - resizeState.prevY;
                
                resizePanel.style.height = computedHeight - resizeState.deltaY + "px";
                resizePanel.style.width = computedWidth +  resizeState.deltaX + "px";
                resizePanel.style.top = computedTop + resizeState.deltaY + "px";

                resizeState.prevX = e.pageX;
                resizeState.prevY = e.pageY;
            break;
            case 'nw':
                resizeState.deltaX = e.pageX - resizeState.prevX;
                resizeState.deltaY = e.pageY - resizeState.prevY;

                resizePanel.style.left = computedLeft + resizeState.deltaX + "px";
                resizePanel.style.height = computedHeight - resizeState.deltaY + "px";
                resizePanel.style.width = computedWidth -  resizeState.deltaX + "px";
                resizePanel.style.top = computedTop + resizeState.deltaY + "px";

                resizeState.prevX = e.pageX;
                resizeState.prevY = e.pageY;
            break;
            case 'sw':
                resizeState.deltaX = e.pageX - resizeState.prevX;
                resizeState.deltaY = e.pageY - resizeState.prevY;

                resizePanel.style.left = computedLeft + resizeState.deltaX + "px";
                resizePanel.style.height = computedHeight + resizeState.deltaY + "px";
                resizePanel.style.width = computedWidth -  resizeState.deltaX + "px";
                
                resizeState.prevX = e.pageX;
                resizeState.prevY = e.pageY;
            break;
        } 
                
        
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

    // create and add canvas to the drop zone
    // var editCanvas = document.createElement("canvas");
    // editCanvas.setAttribute("id", this.previewElement + "_canvas");
    // editCanvas.setAttribute("width", this.width + "px");
    // editCanvas.setAttribute("height", this.height + "px");
    // previewElementObj.insertBefore(editCanvas, null);
}

var handleMoveMouseDown = function(e) {
    'use strict';
    imageDragState = true;
    activeElementToMove = e.currentTarget.id;
    prevX = e.pageX;
    prevY = e.pageY;
};

var handleResizeMouseDown = function(e) {
    'use strict';
    e.stopPropagation();
    e.preventDefault();
    imageResizeState = true;
    
    var handleTarget = e.target;
    resizeState.width = handleTarget.offsetWidth;
    resizeState.height = handleTarget.offsetHeight;
    resizeState.top = handleTarget.offsetTop;
    resizeState.left = handleTarget.offsetLeft;
    resizeState.prevX = e.pageX;
    resizeState.prevY = e.pageY;
    resizeState.activeElementToResize = handleTarget.parentElement.id;
    
    var handleBarElementNames = handleTarget.id.split('_');

    resizeState.type = handleBarElementNames[handleBarElementNames.length > 0 ? handleBarElementNames.length - 1 : 0];
};

ImagePreview.prototype.preparePreview = function() {
    'use strict';

    // clearing previously creating resize elemnent
    var existingElement = document.getElementById(this.previewElement + '_resizeContainer');
    if (existingElement !== null) {
        existingElement.remove();
    }

    // configuring the preview element
    var previewElementObj = document.getElementById(this.previewElement);
    previewElementObj.style.width = this.width + "px";
    previewElementObj.style.height = this.height + "px";
};

ImagePreview.prototype.createHandleBars = function(elementName, className) {
    'use strict';
    var handleBar = document.createElement('span');
    handleBar.setAttribute('class', className);
    handleBar.setAttribute('id', this.previewElement + "_" + elementName);

    return handleBar;
};

ImagePreview.prototype.load = function(imageData) {
    'use strict';
    // var ctx = document.getElementById(this.previewElement + "_canvas").getContext('2d'); 

    this.preparePreview();
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
        
        resizeContainer.insertBefore(img, null);
        
        var nwHandle = this.createHandleBars('nw', 'resize-handle resize-handle-nw');
        var neHandle = this.createHandleBars('ne', 'resize-handle resize-handle-ne');
        var swHandle = this.createHandleBars('sw', 'resize-handle resize-handle-sw');
        var seHandle = this.createHandleBars('se', 'resize-handle resize-handle-se');

        resizeContainer.insertBefore(nwHandle, img);
        resizeContainer.insertBefore(neHandle, img);
        resizeContainer.insertBefore(swHandle, img);
        resizeContainer.insertBefore(seHandle, img);
    

        resizeContainer.addEventListener('mousedown', handleMoveMouseDown, false);
        
        nwHandle.addEventListener('mousedown', handleResizeMouseDown, false);
        neHandle.addEventListener('mousedown', handleResizeMouseDown, false);
        swHandle.addEventListener('mousedown', handleResizeMouseDown, false);
        seHandle.addEventListener('mousedown', handleResizeMouseDown, false);
    }.bind(this);

    img.src = imageData;
};