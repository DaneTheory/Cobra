// MODULES
var path = require('path');
var remote = require('remote');
var ipc = require('ipc');
var fs = require('fs');
var dialog = remote.require('dialog');
var swal = require('sweetalert');

// GLOBALS
var closeCobra = document.querySelector('.powerButton');
var fileZone = document.querySelector('#fileZone');
var fileDisplay = document.querySelector('#fileDisplay');
var fileType = fileZone.type;

/////////////////////////////////////////////////////////////////
// COBRA LOGIC BEGIN!!!
/////////////////////////////////////////////////////////////////

// NOTIFICATIONS SETUP
var alertOptions = {
	title: "Cobra Alert!",
	body: "Cobra, up and running. Cheers!",
	icon: path.join(__dirname, 'assets', 'beer.png')
};

function doNotify() {
	new Notification(alertOptions.title, alertOptions);
};

document.addEventListener('DOMContentLoaded', doNotify);


function swalTest() {
	swal({
		title: "An input!",
		text: "Write something interesting:",
		type: "input",
		showCancelButton: true,
		closeOnConfirm: false,
		animation: "slide-from-top",
		inputPlaceholder: "Write something"
	}, function(inputValue) {
		if (inputValue === false) return false;
		if (inputValue === "") {
			swal.showInputError("You need to write something!");
			return false
		}
		swal("Nice!", "You wrote: " + inputValue, "success");
	});
}
document.addEventListener('DOMContentLoaded', swalTest);

// CLOSE APP SETUP
closeCobra.addEventListener('click', function() {
	ipc.send('close-main-window');
});

// DRAG AND DROP FILES SETUP
fileZone.ondragover = function() {
	return false;
};

fileZone.ondragleave = fileZone.ondragend = function() {
	return false;
};

fileZone.ondrop = function(e) {
	e.preventDefault();
	var dt = e.dataTransfer,
		files = dt.files,
		supportedFormats = ['image/jpeg', 'image/pjpeg', 'image/png',
			'application/x-javascript', 'application/javascript',
			'application/ecmascript', 'text/javascript', 'text/ecmascript',
			'application/x-pointplus', 'text/css'
		];

	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		console.log('File Paths:', file.path + ' ' + file.type);
	}
	return false;
};

// CLICK FILES SETUP
function openFile(e) {

	fileZone.value = null;
	console.log('click' + ' ' + fileZone.value);
	dialog.showOpenDialog({
		properties: ['openFile', 'openDirectory', 'multiSelections'],
		filters: [{
			name: 'Images',
			extensions: ['jpg', 'png', 'JPG', 'PNG']
		}, {
			name: 'Custom File Type',
			extensions: ['js', 'css']
		}]
	});
}

function oFile(fileNames) {
	if (fileNames === undefined) return;

	for (var i = 0; i < fileNames.length; i++) {
		var fileName = fileNames[i];
		var origPath = path.resolve(fileName);
		console.log(origPath);
		var origName = path.basename(fileName);
		console.log(origName);
		var origExt = path.extname(fileName);
		console.log(origExt);

		var origStats = fs.statSync(origPath);
		var origSize = origStats["size"] + ' ' + 'Bytes';
		var origDate = origStats["ctime"];
		console.log(origSize);
		console.log(origDate);
		return {
			'origPath': origPath,
			'origName': origName,
			'origExt': origExt,
			'origSize': origSize,
			'origDate': origDate
		};
		fs.readFile(fileName, 'utf-8', function(err, data) {
			fileZone.value = data;
			console.log('click' + ' ' + fileZone.value);
		});
	}
});


fileZone.addEventListener('click', openFile);
fileZone.addEventListener('onchange', oFile);

// input.onclick = function () {
//     this.value = null;
// };
//
// input.onchange = function () {
//     alert(this.value);
// };​

// FILE UPLOAD SETUP
// fs.readDir(orgDir, function(dir) {
// 	for (var i = 0, l = dir.length; i < l; i++) {
// 		var filePath = dir[i];
// 		console.log(filePath);
// 	};
// 	console.log(orgDir);
// });
// fs.ensureDir(origDir, function(err) {
//	console.log(err)
// dir has now been created, including the directory it is to be placed in
// });

// (function(window, document) {
//
// 	'use strict';
//
// 	var all_files = [];
// 	var current_file_id = 0;
// 	var locked = false;
// 	var prev_count_files = 0;
// 	var waiting = 0;
//
// 	var noopHandler = function(evt) {
// 		evt.stopPropagation();
// 		evt.preventDefault();
// 	};
//
// 	var drop = function(evt) {
// 		noopHandler(evt);
// 		handleFiles(evt.dataTransfer.files);
// 	};
//
// 	var handleFileDialog = function(evt) {
// 		noopHandler(evt);
// 		var element = evt.srcElement || evt.target;
// 		handleFiles(element.files);
// 	};
//
// 	var handleFiles = function(files) {
// 		var count = files.length;
// 		var i, j;
//
// 		if (count > 0) {
//
// 			prev_count_files = all_files.length;
//
// 			document.getElementById('dropzone').className = 'queue';
//
// 			for (i = prev_count_files + waiting, j = 0; i < prev_count_files +
// 				files.length + waiting; i++, j++) {
// 				document.getElementById('dropzone').innerHTML +=
// 					'<div class="file" id="file-' + i + '"><div class="name">' +
// 					files[j].name +
// 					'</div><div class="progress">Waiting...</div><div class="clear"></div></div>';
// 			}
//
// 			waiting += count;
//
// 			if (!locked) {
// 				waiting -= count;
// 				all_files.push.apply(all_files, files);
// 				handleNextFile();
// 			}
// 		}
// 	};
//
// 	var handleReaderLoad = function(evt) {
//
// 		var current_file = {
// 			name: all_files[current_file_id].name,
// 			type: all_files[current_file_id].type,
// 			contents: evt.target.result
// 		};
//
// 		var xhr = new XMLHttpRequest();
// 		xhr.open('POST', '/upload/original', true);
// 		xhr.onreadystatechange = function() {
// 			if (xhr.readyState == 4) {
// 				if (document.getElementById('file-' + current_file_id)) {
// 					if (xhr.status === 200) {
// 						document.getElementById('file-' + current_file_id).querySelector(
// 							'.progress').innerHTML = 'Uploaded';
// 					} else {
// 						document.getElementById('file-' + current_file_id).querySelector(
// 							'.progress').innerHTML = 'Failed';
// 					}
// 				}
// 				all_files[current_file_id] = 1;
// 				current_file_id++;
// 				handleNextFile();
// 			}
// 		};
// 		xhr.send(JSON.stringify(current_file));
// 	};
//
// 	var handleNextFile = function() {
//
// 		if (current_file_id < all_files.length) {
//
// 			locked = true;
//
// 			document.getElementById('file-' + current_file_id).querySelector(
// 				'.progress').innerHTML = 'Uploading...';
//
// 			var current_file = all_files[current_file_id];
//
// 			var reader = new FileReader();
// 			reader.onload = handleReaderLoad;
// 			reader.readAsDataURL(current_file);
//
// 		} else {
// 			locked = false;
// 		}
// 	};
//
// 	var openFileDialog = function() {
// 		var evt = new MouseEvent('click');
// 		document.getElementById('addFile').dispatchEvent(evt);
// 	};
//
// 	var dropzone = document.getElementById('dropzone');
// 	dropzone.addEventListener('click', openFileDialog, false);
// 	dropzone.addEventListener('dragenter', noopHandler, false);
// 	dropzone.addEventListener('dragexit', noopHandler, false);
// 	dropzone.addEventListener('dragover', noopHandler, false);
// 	dropzone.addEventListener('drop', drop, false);
//
// 	var addFile = document.getElementById('addFile');
// 	addFile.addEventListener('change', handleFileDialog);
//
// }(window, window.document));
