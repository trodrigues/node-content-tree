# node-content-tree

Generate a json representation of a file tree with file information

## Installation

npm install content-tree

## Usage

```javascript
var tree = require('content-tree')('/path/to/directory');
tree.generate(function(tree){
  console.log(tree);
});
```

Or if you want a promise based interface

```javascript
var tree = require('content-tree')('/path/to/directory');
tree.generate().then(function(tree){
  console.log(tree);
});
```

Then it's probably useful to use something like [traverse](https://github.com/substack/js-traverse).

## File object information

Each file object will have not only the file path but the [stat](http://nodejs.org/api/fs.html#fs_class_fs_stats) 
file object as well as mime type and charset information:

```javascript
{
  path: 'file path',
  basename: 'file basename',
  stat: [Stat object],
  mimeType: 'file mimetype',
  charset: 'file charset'
}
```

If you wish to enhance the information for each object, you can use the
`file` event as such:

```javascript
var somePath = '/path/to/directory';
var tree = require('content-tree')(somePath);
tree.on('file', function(file){
  file.relativePath = file.path.replace(somePath +'/', '');
})
tree.generate();

```

# API

  TODO: finish this section

## generate

## getRelativePath

## getRelativeFilePath

# Events

## file

# TODO

* finish documentation
* tests
