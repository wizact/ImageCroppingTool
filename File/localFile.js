var imagePreview = (function() {

	var elementCollection = [];

	function getPreviewElementByFileTarget(targetId) {
		var previewElementId = '';
		elementCollection.forEach(function(item) {
			if (item.fileElement === targetId) {
				previewElementId = item.previewElement;
			}
		});
		
		return previewElementId;
	}
	
	function getDropElementByFileTarget(targetId) {
		var previewElementId = '';
		elementCollection.forEach(function(item) {
			if (item.dropElement === targetId) {
				previewElementId = item.previewElement;
			}
		});
		
		return previewElementId;
	}
	
	function loadFile(file, previewElementId) {
		var previewContainer = document.getElementById(previewElementId);
		
		if(!file.type.match('image.*')) {
			throw "File type not supported"
			return;
		}
		
		var reader = new FileReader();
		
		reader.onload = (function (theFile) {
			return function(e) {
				var previewItem = previewContainer.getElementsByTagName("span");
				if (previewItem != undefined && 
					previewItem.length > 0) {
					previewItem[0].remove();
				}
				
				previewItem = document.createElement('span');
				previewItem.innerHTML = '<img src="' + e.target.result + '" /><br>';
				previewContainer.insertBefore(previewItem, null);
			}
		})(file);
		
		reader.readAsDataURL(file);
	}
	
	function handleFileChange(evt) {
	
		var previewElementId = getPreviewElementByFileTarget(evt.target.id);
		
		if (!previewElementId || previewElementId === ""){
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
		
		var previewElementId = getDropElementByFileTarget(evt.target.id);
		
		if (!previewElementId || previewElementId === ""){
			return;
		}
		
		var previewContainer = document.getElementById(previewElementId);
		
		if (evt.dataTransfer.files.length < 1) {
			console.log('no file has been selected');
			return;
		}
		
		var file = evt.dataTransfer.files[0];
		
		loadFile(file, previewElementId);
	}

	function registerPreviewContainer(fileElement, dropElement, previewElement) {
		elementCollection.push({ "fileElement": fileElement, "dropElement": dropElement, "previewElement": previewElement});
		document.getElementById(fileElement).addEventListener('change', handleFileChange, false);
		
		if (dropElement !== "") {
			var dropZone = document.getElementById(dropElement);
			dropZone.addEventListener('dragover', handleDragOver, false);
			dropZone.addEventListener('drop', handleDropFile, false);
		}
		
	}
	
	function handleDragOver(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy';
	}
	
	function isSupported() {
		if (window.File && window.FileReader && window.FileList && window.Blob) { 
			return true; 
		} else { 
			return false; 
		}
	}
	
	return {
		supported: isSupported,
		register: registerPreviewContainer
	};
	
})();




