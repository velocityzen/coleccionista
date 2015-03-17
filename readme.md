# Coleccionista #

Streams files or other streams one by one in one stream.

### Usage ###
```js
let Coleccionista = require('coleccionista');

let stream = new Coleccionista(options);

// now we can use it like usual stream
stream.pipe(otherStream);

```

### options
* **files** — array of streams, array of files or wildcard string. For more info look [minimatch documentation](https://github.com/isaacs/minimatch)
* **path** — optional, path to look for a files
* **stream** — optional, read files stream options

### Additional events ###
* __ready__ — triggered when file list ready, returns list of files or streams
* __itemstart__ — triggered when new file begins
* __itemend__ — triggered when file stream ended
* __error__ — triggered on errors
