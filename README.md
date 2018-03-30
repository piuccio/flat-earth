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

## equirectangularDistance

Compute the distance in meters between two coordinates using the fast [Equirectangular approximation](https://www.movable-type.co.uk/scripts/latlong.html#equirectangular)

```
import { equirectangularDistance } from 'flat-earth';

console.log(equirectangularDistance(
  { lat: 35.6896491, lon: 139.7001494 },
  { lat: 35.6579909, lon: 139.7014112 },
)); // 3522
```

The Equirectangular approximation is much faster and a good enough approximation on small distances.
For instance in the bounding box containing greater Tokyo the error compared to the Harvesine formual is < 10m. In the box containing the whole Japan the error is 16km (0.6%).
Accuracy varies depending on the latitude.
