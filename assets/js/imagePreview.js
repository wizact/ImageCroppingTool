var canvasEventModule = (function() {
'use strict';
var moveState = {
    imageMoveState: false,
    activeElementToMove: '',
    prevX: 0, prevY: 0,
    deltaX: 0, deltaY: 0
};

var resizeState = {
    imageResizeState: false,
    type: '',
    activeElementToResize: '',
    prevX: 0, prevY: 0,
    deltaX: 0, deltaY: 0
};

var isHandleBar = function(elementType) {
    return  elementType === 'se' || elementType === 'ne' || 
            elementType === 'nw' || elementType === 'sw';
};

var handleMouseUp = function() {
    moveState.imageMoveState = false;
    resizeState.imageResizeState = false;
};

var handleMouseMove = function(e) {
    
    if (moveState.imageMoveState) {
        moveState.deltaX = e.pageX - moveState.prevX;
        moveState.deltaY = e.pageY - moveState.prevY;

        var panel = document.getElementById(moveState.activeElementToMove);

        panel.style.left = panel.offsetLeft + moveState.deltaX + "px";
        panel.style.top = panel.offsetTop + moveState.deltaY + "px";

        moveState.prevX = e.pageX;
        moveState.prevY = e.pageY;
    } else if (resizeState.imageResizeState && resizeState.activeElementToResize !== '') {
        
        var resizePanel = document.getElementById(resizeState.activeElementToResize);
        
        var computedWidth = parseInt(window.getComputedStyle(resizePanel, null).getPropertyValue('width'), 10);
        var computedHeight = parseInt(window.getComputedStyle(resizePanel, null).getPropertyValue('height'), 10);
        var computedTop = parseInt(window.getComputedStyle(resizePanel, null).getPropertyValue('top'), 10);
        var computedLeft = parseInt(window.getComputedStyle(resizePanel, null).getPropertyValue('left'), 10);

        if (isHandleBar(resizeState.type)) {

            var scaledRatio = computedWidth / computedHeight;

            resizeState.deltaX = e.pageX - resizeState.prevX;
            resizeState.deltaY = e.pageY - resizeState.prevY;

            if (e.shiftKey && 
                (resizeState.type === "se" || resizeState.type === "nw")) {
                resizeState.deltaX = scaledRatio * resizeState.deltaY;
            }

            if (e.shiftKey && 
                (resizeState.type === "ne" || resizeState.type === "sw")) {
                resizeState.deltaX = -1 * scaledRatio * resizeState.deltaY;
            }
        }

        switch (resizeState.type) {
            case 'se':
                resizePanel.style.width = computedWidth +  resizeState.deltaX + "px";
                resizePanel.style.height = computedHeight + resizeState.deltaY + "px";

                resizeState.prevX = e.pageX;
                resizeState.prevY = e.pageY;
            break;
            case 'ne':
                resizePanel.style.height = computedHeight - resizeState.deltaY + "px";
                resizePanel.style.width = computedWidth +  resizeState.deltaX + "px";
                resizePanel.style.top = computedTop + resizeState.deltaY + "px";
            break;
            case 'nw':
                resizePanel.style.left = computedLeft + resizeState.deltaX + "px";
                resizePanel.style.height = computedHeight - resizeState.deltaY + "px";
                resizePanel.style.width = computedWidth -  resizeState.deltaX + "px";
                resizePanel.style.top = computedTop + resizeState.deltaY + "px";
            break;
            case 'sw':
                resizePanel.style.left = computedLeft + resizeState.deltaX + "px";
                resizePanel.style.height = computedHeight + resizeState.deltaY + "px";
                resizePanel.style.width = computedWidth -  resizeState.deltaX + "px";
            break;
        } 

        if (isHandleBar(resizeState.type)) {
            resizeState.prevX = e.pageX;
            resizeState.prevY = e.pageY;
        }
    }
  };

  return {
    handleMouseUp: handleMouseUp,
    handleMouseMove: handleMouseMove,
    moveState: moveState,
    resizeState: resizeState
  };

}());

document.addEventListener('mousemove', canvasEventModule.handleMouseMove, false);
document.addEventListener('mouseup', canvasEventModule.handleMouseUp, false);

function ImagePreview(previewElement, options) {
    'use strict';
    // Drop zone size & Preview image size
    this.width = this.previewWidth = 300;
    this.height = this.previewHeight = 30;

    // set default view finder size
    this.viewFinderWidth = this.width / 2;
    this.viewFinderHeight = this.height / 2;

    if (options !== undefined) {
        this.width = options.width || this.width;
        this.height = options.height || this.height;

        this.viewFinderWidth = options.viewFinderWidth || this.width / 2;
        this.viewFinderHeight = options.viewFinderHeight || this.height / 2;

        this.previewWidth = options.previewWidth || this.previewWidth;
        this.previewHeight = options.previewHeight || this.previewHeight;
    } else {
        this.viewFinderWidth = this.width / 2;
        this.viewFinderHeight = this.height / 2;
    }

    this.previewElement = previewElement;

    // create and add canvas to the drop zone
    // var editCanvas = document.createElement("canvas");
    // editCanvas.setAttribute("id", this.previewElement + "_canvas");
    // editCanvas.setAttribute("width", this.width + "px");
    // editCanvas.setAttribute("height", this.height + "px");
    // previewElementObj.insertBefore(editCanvas, null);
}

ImagePreview.prototype.handleMoveMouseDown = function(e) {
    'use strict';
    canvasEventModule.moveState.imageMoveState = true;
    canvasEventModule.moveState.activeElementToMove = e.currentTarget.id;
    canvasEventModule.moveState.prevX = e.pageX;
    canvasEventModule.moveState.prevY = e.pageY;
};

ImagePreview.prototype.handleResizeMouseDown = function(e) {
    'use strict';
    e.stopPropagation();
    e.preventDefault();
    
    var handleTarget = e.target;
    canvasEventModule.resizeState.imageResizeState = true; 
    canvasEventModule.resizeState.prevX = e.pageX;
    canvasEventModule.resizeState.prevY = e.pageY;
    canvasEventModule.resizeState.activeElementToResize = handleTarget.parentElement.id;
    
    var handleBarElementNames = handleTarget.id.split('_');

    canvasEventModule.resizeState.type = handleBarElementNames[handleBarElementNames.length > 0 ? handleBarElementNames.length - 1 : 0];
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

ImagePreview.prototype.prepareViewFinder = function() {
    'use strict';
    var viewFinderElement = document.createElement("div");
    viewFinderElement.setAttribute("id", this.previewElement + "_viewFinder");
    viewFinderElement.setAttribute("class", "viewFinder");
    viewFinderElement.setAttribute("draggable", "false"); 

    viewFinderElement.style.width = this.viewFinderWidth + 'px';
    viewFinderElement.style.height = this.viewFinderHeight + 'px';

    viewFinderElement.style.left = Math.floor((this.width / 2) - (this.viewFinderWidth /2)) + "px";
    viewFinderElement.style.top = Math.floor((this.height / 2) - (this.viewFinderHeight /2)) + "px";

    document.getElementById(this.previewElement).insertBefore(viewFinderElement, null);
};

ImagePreview.prototype.load = function(imageData) {
    'use strict';
    // var ctx = document.getElementById(this.previewElement + "_canvas").getContext('2d'); 
    this.prepareViewFinder();
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
    

        resizeContainer.addEventListener('mousedown', this.handleMoveMouseDown, false);
        
        nwHandle.addEventListener('mousedown', this.handleResizeMouseDown, false);
        neHandle.addEventListener('mousedown', this.handleResizeMouseDown, false);
        swHandle.addEventListener('mousedown', this.handleResizeMouseDown, false);
        seHandle.addEventListener('mousedown', this.handleResizeMouseDown, false);
    }.bind(this);

    img.src = imageData;
};

ImagePreview.prototype.findImagePositionType = function(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2) {
    'use strict';

    if (x_image_1 <= x_view_1 && x_image_2 <= x_view_2 && y_image_1 <= y_view_1 && y_image_2 <= y_view_2) { return 1; }
    if (x_image_1 <= x_view_1 && x_image_2 <= x_view_2 && y_image_1 <= y_view_1 && y_image_2 > y_view_2)  { return 2; }
    if (x_image_1 <= x_view_1 && x_image_2 <= x_view_2 && y_image_1 > y_view_1 && y_image_2 <= y_view_2)  { return 3; }
    if (x_image_1 <= x_view_1 && x_image_2 <= x_view_2 && y_image_1 > y_view_1 && y_image_2 > y_view_2)  { return 4; }

    if (x_image_1 <= x_view_1 && x_image_2 > x_view_2 && y_image_1 <= y_view_1 && y_image_2 <= y_view_2) { return 5; }
    if (x_image_1 <= x_view_1 && x_image_2 > x_view_2 && y_image_1 <= y_view_1 && y_image_2 > y_view_2)  { return 6; }
    if (x_image_1 <= x_view_1 && x_image_2 > x_view_2 && y_image_1 > y_view_1 && y_image_2 <= y_view_2)  { return 7; }
    if (x_image_1 <= x_view_1 && x_image_2 > x_view_2 && y_image_1 > y_view_1 && y_image_2 > y_view_2)  { return 8; }

    if (x_image_1 > x_view_1 && x_image_2 <= x_view_2 && y_image_1 <= y_view_1 && y_image_2 <= y_view_2) { return 9; }
    if (x_image_1 > x_view_1 && x_image_2 <= x_view_2 && y_image_1 <= y_view_1 && y_image_2 > y_view_2) { return 10; }
    if (x_image_1 > x_view_1 && x_image_2 <= x_view_2 && y_image_1 > y_view_1 && y_image_2 <= y_view_2) { return 11; }
    if (x_image_1 > x_view_1 && x_image_2 <= x_view_2 && y_image_1 > y_view_1 && y_image_2 > y_view_2) { return 12; }

    if (x_image_1 > x_view_1 && x_image_2 > x_view_2 && y_image_1 <= y_view_1 && y_image_2 <= y_view_2) { return 13; }
    if (x_image_1 > x_view_1 && x_image_2 > x_view_2 && y_image_1 <= y_view_1 && y_image_2 > y_view_2) { return 14; }
    if (x_image_1 > x_view_1 && x_image_2 > x_view_2 && y_image_1 > y_view_1 && y_image_2 <= y_view_2) { return 15; }
    if (x_image_1 > x_view_1 && x_image_2 > x_view_2 && y_image_1 > y_view_1 && y_image_2 > y_view_2) { return 16; }
};







