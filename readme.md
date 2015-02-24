# Coleccionista #

Helper stream class that streams files or other streams one by one in one stream.

### Usage ###
```js
var Coleccionista = require('coleccionista');

var stream = new Coleccionista(filesOrStreams, options);
//filesOrStreams — array of pathes to files or array of streams
//options — options for file streams 

// now we can use it like usual stream
stream.pipe(otherStream);

```

### Additional events ###
* __itemstart__ — triggers when new file open
* __itemend__ — triggers when file stream end
* __error__ — triggers on file errors
