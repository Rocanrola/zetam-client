var path = require('path'),
    fs = require('fs'),
    uglifyJs = require("uglify-js");

var rootDir = path.resolve(path.dirname(require.main.filename));
var libsDir = path.resolve(rootDir,'libs');
var zetamFile = path.resolve(libsDir,'zetam.js');

exports.build = function (argument) {
	
	if(!fs.existsSync(libsDir)){
		fs.mkdirSync(libsDir);	
	}

	if(!fs.existsSync(zetamFile)){
		
		var code = uglifyJs.minify([ __dirname + "/polyfills.js", __dirname + "/client.js"]).code;

		fs.writeFileSync(zetamFile, code);
	}
	
}
