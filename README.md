Modern set of functions for handling coordinates in Node.js or the browser

# Installation

`npm install --save flat-earth`

That'll work for node.js and most likely for the browser as well if you're using Webpack, rollup or similar bundlers.

# Functions

## geohash

Compute the [Geohash](https://en.wikipedia.org/wiki/Geohash) of a point.

```
import { geohash } from 'flat-earth';

console.log(geohash(35.6896491, 139.7001494)); // xn774cne32v3
console.log(geohash(35.6896491, 139.7001494, 7)); // xn774cn
```

The function is a simple wrapper around [latlon-geohash](https://github.com/chrisveness/latlon-geohash) `geohash.encode()`
