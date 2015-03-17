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

var Coleccionista = function(options) {
	let self = this;

	PassThrough.call(this, options);

	this.fileIndex = 0;
	this.o = options.stream;
	this.path = options.path ? path.resolve(options.path) : undefined;

	if(typeof options.files === "string") {
		glob(options.files, {cwd: self.path}, function(err, files) {
			if(err) {
				self.emit("error", err);
			} if(!files.length) {
				self.emit("error", new Error(self.path ? ("No files found in path " + self.path) : "No files found"));
			} else {
				self.ready(files);
			}
		});
	} else if(isArray(options.files)) {
		self.ready(options.files);
	} else {
		throw new Error("Files option required");
	}
};
inherits(Coleccionista, PassThrough);

Coleccionista.prototype.ready = function(files) {
	this.files = this.path ? mapFiles(this.path, files) : files;
	this.emit("ready", this.files);
	this.next();
};

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
			self.emit("itemstart", f);
		})
		.on("end", function(){
			self.emit("itemend", f);
			if(!end) {
				self.next();
			}
		})
		.pipe(this, {end: end});
};


module.exports = Coleccionista;
