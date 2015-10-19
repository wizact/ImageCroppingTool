
[![Build Status](https://travis-ci.org/wizact/htmllibs.svg?branch=master)](https://travis-ci.org/wizact/htmllibs)

# htmllibs
Using HTML5 and JavaScript to build widgets.

##File
Using FileReader API and Canvas API to create a simple image editing tool with resize and crop functionality.

###Image Loader
Image loader is using window file API as well as traditional html File input to import an image.

Usage:

Add the script tag to your html page:

```html
<script type="text/javascript" src="../assets/js/imageLoader.js"></script>
```

Create an instance of ImageLoader object, check if the browser supports the File API, and initialize the object:

```js
var loader = new ImageLoader('file zone Id', 'drop zone Id', loadcallback, { "height": "200", "width": "480" });
if (loader.isSupported()) {
    loader.init();
}
```

####Arguments
- file input Id: The Id of Html input with type set to File                      
- drop zone Id : The Id of Div acts as drop zone (Drag and Drop file here)     
- loadcallback     : Callback to be called after the file reader loads image data. This can be set to load method of image preview object:
```js
  var loadcallback = function(result) {
    preview.load(result);
  };
```
See Image Preview for more information.
- height       : The height of Drop zone                                         
- width        : The width of Drop zone & file input                          



###Image Preview
Preview the image data and adds crop and resize functionality.

Usage:

Add the script tag to your html page:

```html
<script type="text/javascript" src="../assets/js/imagePreview.js"></script>
```

Load the preview object:

```js
var options = { 
                "width": "480" , 
                "height": "200", 
                "previewWidth": "240" , 
                "previewHeight": "100", 
                "viewFinderWidth": "200", 
                "viewFinderHeight": "100" 
              };    

var preview = new ImagePreview('preview zone Id', 'crop buttun Id', 'background color input Id', options);
```
####Arguments
- preview zone Id: The Id of div to be used as preview zone. It can be the same as drop zone in Id of Image Loader
- width, height: The dimension for the preview zone Id. Default (300x30) 
- previewWidth, previewHeight: Resizing the image to this dimension for initial preview. Default (300x30)
- viewFinderWidth, viewFinderHeight: The dimension of view finder element works as the guide for the user. Default is half of width and height.
- crop buttun Id: The Id of the button that triggers the crop functionality
- background color input Id: The Id of the input for the background color or cropped image
