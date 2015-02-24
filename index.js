"use strict";
var inherits = require("util").inherits;
var fs = require("fs");
var PassThrough = require("stream").PassThrough;

var Coleccionista = function(filesOrStreams, options) {
	if(!filesOrStreams.length) {
		throw new Error("Files argument required");
	}

	PassThrough.call(this, options);

	this.files = filesOrStreams;
	this.fileIndex = 0;
	this.o = options;
	this.next();
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
