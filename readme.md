# Coleccionista #

Streams files or other streams one by one in one stream.

### Usage ###
```js
let Coleccionista = require('coleccionista');

let stream = new Coleccionista(options, function(err, files) {
    //err — if no files found or some other fs error
    //files — array of full file pathes
});

// now we can use it like usual stream
stream.pipe(otherStream);

```

### options
* **files** — array of files or wildcard string. For more info look [minimatch documentation](https://github.com/isaacs/minimatch)
* **path** — optional, path to look for a files
* **stream** — optional, read files stream options

### Additional events ###
* __itemstart__ — triggers when new file begins
* __itemend__ — triggers when file stream ended
* __error__ — triggers on file errors
