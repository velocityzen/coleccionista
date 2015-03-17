"use strict";
let fs = require("fs");
let path = require("path");
let Coleccionista = require("../index");

let input = new Coleccionista({
			files: "*.txt",
			path: "./src"
		})
		.on("ready", function(files) {
			console.log("Found files:", files);
		})
		.on("error", function(err) {
			console.log("Input", err);
		});


let output;

input
	.on("itemstart", function(file) {
		file = path.basename(file);
		output = fs.createWriteStream("./dst/" + file)
			.on("error", function(err) {
				console.log("Output", err);
			});

		input.pipe(output);
	})
	.on("itemend", function() {
		console.log(path.resolve(output.path));
		input.unpipe(output);
		output.end();
	});
