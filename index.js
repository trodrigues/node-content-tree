var path = require('path'),
    EventEmitter = require('events').EventEmitter,
    util = require('util'),
    Q = require('q'),
    mime = require('mime'),
    findit = require('findit');


//TODO split this guy into it's own module
var ContentTree = function(contentsPath) {
  this.tree = {};
  this.contentsPath = contentsPath;
};
util.inherits(ContentTree, EventEmitter);

ContentTree.prototype.generate = function(callback) {
  var dfr = Q.defer();
  this.finder = findit.find(this.contentsPath);
  this.finder.on('path', this.fileHandler.bind(this));
  this.finder.on('end', function() {
    dfr.resolve(this.tree);
    if(callback){
      callback(this.tree)
    }
  }.bind(this));
  return dfr.promise;
};


ContentTree.prototype.makeTree = function(tree, dirPath, file, stat) {
  var currentDir = dirPath.shift();
  if(currentDir in tree){
    this.makeTree(tree[currentDir], dirPath, file, stat);
  } else {
    tree[currentDir] = stat.isFile() ? this.getFileInfo(file, stat) : {};
  }
};


ContentTree.prototype.fileHandler = function(file, stat) {
  var dirPath = this.getRelativePath(file).split('/');
  this.makeTree(this.tree, dirPath, file, stat);
};


ContentTree.prototype.getRelativeFilePath = function(file) {
  return this.getRelativePath(file).replace(path.basename(file), '');
};


ContentTree.prototype.getRelativePath = function(file) {
  return file.replace(this.contentsPath+'/', '');
};


ContentTree.prototype.getFileInfo = function(file, stat) {
  var mimeType = mime.lookup(file),
      basename = path.basename(file, path.extname(file));
  var file = {
    path: file,
    basename: basename,
    stat: stat,
    mimeType: mimeType,
    charset: mime.charsets.lookup(mimeType)
  };
  this.emit('file', file);
  return file;
};


module.exports = function(params) {
  return new ContentTree(params);
};
