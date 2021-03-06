Modern set of functions for handling coordinates in Node.js or the browser

# Installation

`npm install --save @piuccio/flat-earth`

That'll work for node.js and most likely for the browser as well if you're using Webpack, rollup or similar bundlers.

# Disclaimer

This project only exposes simple utility functions that would be useful in map projects, it doesn't try to be extremely accurate.
If you need high precision you're better off using other modules like [geodesy](https://github.com/chrisveness/geodesy), [haversine](https://github.com/njj/haversine) or if available on your environment [Google Maps API](https://developers.google.com/maps/documentation/javascript/reference/3.exp/) or similar.


# Functions

## geohash

Compute the [Geohash](https://en.wikipedia.org/wiki/Geohash) of a point.

```js
import { geohash } from '@piuccio/flat-earth';

console.log(geohash(35.6896491, 139.7001494)); // xn774cne32v3
console.log(geohash(35.6896491, 139.7001494, 7)); // xn774cn
```

The function is a simple wrapper around [latlon-geohash](https://github.com/chrisveness/latlon-geohash) `geohash.encode()`

## equirectangularDistance

Compute the distance in meters between two coordinates using the fast [Equirectangular approximation](https://www.movable-type.co.uk/scripts/latlong.html#equirectangular)

```js
import { equirectangularDistance } from '@piuccio/flat-earth';

console.log(equirectangularDistance(
  { lat: 35.6896491, lon: 139.7001494 },
  { lat: 35.6579909, lon: 139.7014112 },
)); // 3522
```

The Equirectangular approximation is much faster and a good enough approximation on small distances.
For instance in the bounding box containing greater Tokyo the error compared to the Harvesine formual is < 10m. In the box containing the whole Japan the error is 16km (0.6%).
Accuracy varies depending on the latitude.


## boundingArea

Given a list of coordinates, compute the area containing all points.
The area is described by the center point (lat, lon), the North-East and South-West edges.

```js
import { boundingArea } from '@piuccio/flat-earth';

const area = boundingArea([
  { lat: 35.6896491, lon: 139.7001494 },
  { lat: 35.6579909, lon: 139.7014112 },
  { lat: 35.6812916, lon: 139.7666099 },
]);

/*
area = {
  center: {
    lat: 35.6762685,
    lon: 139.7230322,
  },
  ne: { lat: SHINJUKU.lat, lon: TOKYO.lon },
  sw: { lat: SHIBUYA.lat, lon: SHINJUKU.lon },
};
*/
```

The center or midpoint is computed as an average of the latitude and longitude mostly because it's expected to be used to center a Mercator map.
When using only two points, you'd be better off computing the midpoint along a great circle path rather than the average.


## getZoom

Given a bounding area, return the zoom level that would allow to fully display the bounding area on a map given a map size in pixels.

Openstreetmap seems to only have an integer zoom, while google maps on large screens also accepts decimal units. Use the precision to control the value. If no precision is specified it returns an integer.

```js
import { boundingArea, getZoom } from '@piuccio/flat-earth';

const area = boundingArea([
  { lat: 35.6896491, lon: 139.7001494 },
  { lat: 35.6579909, lon: 139.7014112 },
  { lat: 35.6812916, lon: 139.7666099 },
]);
const zoom = getZoom(area, { width: 700, height: 700 });  // screen size in pixel
// 13
```

## containingGeohashes

Given a location, computes the minimal list of Geohashes that need to be checked to find all points within a certain distance

```js
import { containingGeohashes } from '@piuccio/flat-earth';

const containing = containingGeohashes({ lat: 35.6896491, lon: 139.7001494 }, 100);
/*
containing = {
  precision: 7,
  hashes: [
    'xn774cq',
    'xn774cr',
    'xn774cp',
    'xn774bz',
    'xn774by',
    'xn774bv',
    'xn774cj',
    'xn774cm',
    'xn774cn'
  ]
}
 */
```

The distance is measured in meters

## distanceOnFoot

Computes the distance in meters that an average person covers in a given time (minutes)

```js
import { distanceOnFoot } from '@piuccio/flat-earth';
console.log(distanceOnFoot(10)); // 834
```

Very simple computation from the [assumption](https://en.wikipedia.org/wiki/Walking) of 5 km/h


## minutesOnFoot

Computes the time it takes an average person to cover the given distance (meters)

```js
import { minutesOnFoot } from '@piuccio/flat-earth';
console.log(minutesOnFoot(100)); // 2
```

Very simple computation from the [assumption](https://en.wikipedia.org/wiki/Walking) of 5 km/h


# Usage in node.js

All the example above use the ES modules syntax

```js
import { distanceOnFoot } from '@piuccio/flat-earth';
```

On Node.js, if you're not using babel you can use instead

```js
const { distanceOnFoot } = require('@piuccio/flat-earth');
```
