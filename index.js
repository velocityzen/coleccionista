"use strict";
var inherits = require('util').inherits;
var fs = require('fs');
var EventEmitter = require("events").EventEmitter;
var PassThrough = require('stream').PassThrough;

var Coleccionista = function(files, options) {
	if(!files.length) {
		throw new Error('Files argument required');
	}

	PassThrough.call(this, options);

	this.files = files;
	this.fileIndex = 0;
	this.o = options;
	this.next();
};
inherits(Coleccionista, PassThrough);

Coleccionista.prototype.next = function() {
	var self = this,
		end = (this.fileIndex === this.files.length-1),
		file = fs.createReadStream(this.files[this.fileIndex++], this.o);

	file
		.on('open', function() {
			self.emit('itemstart');
		})
		.on('end', function(){
			self.emit('itemend');
			if(!end) {
				self.next();
			}
		})
		.pipe(this, {end: end});
};


module.exports = Coleccionista;
