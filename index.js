"use strict";
var fs = require("fs");
let path = require("path");
var PassThrough = require("stream").PassThrough;
var inherits = require("util").inherits;
var glob = require("glob");
var isArray = Array.isArray;

var mapFiles = function (srcPath, files) {
	return files.map(function(filePath){
		return path.join(srcPath, filePath);
	});
};

var Coleccionista = function(options, cb) {
	let self = this;

	PassThrough.call(this, options);

	this.fileIndex = 0;
	this.o = options.stream;

	if(typeof options.files === "string") {
		glob(options.files, {cwd: options.path}, function(err, files) {
			if(err) {
				cb(err);
			} if(!files.length) {
				cb(new Error(options.path ? ("No files found in path " + options.path) : "No files found"));
			} else {
				self.files = files;
				cb(null, files);
				self.next();
			}
		});
	} else if(isArray(options.files)) {
		this.files = options.path ? mapFiles(options.path, options.files) : options.files;
		cb(null, this.files);
		self.next();
	} else {
		throw new Error("Files option required");
	}
};
inherits(Coleccionista, PassThrough);

Coleccionista.prototype.next = function() {
	var self = this,
		end = (this.fileIndex === this.files.length - 1),
		f = this.files[this.fileIndex++],
		file = typeof f === "string" ? fs.createReadStream(f, this.o) : f;

	file
		.on("error", function(err) {
			self.emit("error", err);
		})
		.on("open", function() {
			self.emit("itemstart");
		})
		.on("end", function(){
			self.emit("itemend");
			if(!end) {
				self.next();
			}
		})
		.pipe(this, {end: end});
};


module.exports = Coleccionista;
