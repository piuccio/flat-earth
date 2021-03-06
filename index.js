/* eslint-disable no-restricted-properties */
import GeohashLib from 'latlon-geohash';

const MAX_ZOOM = 19;

function ObjectValues(object) {
  return Object.values ? Object.values(object) : Object.keys(object).map((key) => object[key]);
}

/**
 * The precision determines the size of the bounding box (diagonal), max 12
 *
 * 10 ->   1 meter
 * 9  ->   6 meters
 * 8  ->  36 meters
 * 7  -> 197 meters
 */
export function geohash(lat, lon, precision) {
  return GeohashLib.encode(lat, lon, precision);
}

/**
 * Compute the distance in meters between two points
 * http://www.movable-type.co.uk/scripts/latlong.html
 *
 * Uses the equirectangular approximation which is a good enough approximation
 * on small distances, for instance in the bounding box containing greater Tokyo
 * the error is < 10m
 * In the box containing the whole Japan the error is 16km (0.6%)
 */
const R = 6371e3; // meters
const C = 2 * Math.PI * R;
export function equirectangularDistance(p1, p2) {
  const λ1 = toRadians(p1.lon);
  const λ2 = toRadians(p2.lon);
  const φ1 = toRadians(p1.lat);
  const φ2 = toRadians(p2.lat);

  const x = (λ2 - λ1) * Math.cos((φ1 + φ2) / 2);
  const y = (φ2 - φ1);
  return Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) * R);
}

function toRadians(number) {
  return (Number(number) * Math.PI) / 180;
}

function fromRadians(number) {
  return (number * 180) / Math.PI;
}

/**
 * Given an array of points with lat and lon compute the area containing all of them.
 *
 * The result contains the center point, and the area that would contain all points
 * https://wiki.openstreetmap.org/wiki/Zoom_levels
 */
export function boundingArea(points) {
  let x = 0;
  let y = 0;
  let z = 0;
  const n = points.length;
  let west = 180;
  let east = -180;
  let north = -90;
  let south = 90;

  points.forEach((p) => {
    const λ = toRadians(p.lon);
    const φ = toRadians(p.lat);
    x += Math.cos(φ) * Math.cos(λ);
    y += Math.cos(φ) * Math.sin(λ);
    z += Math.sin(φ);

    if (p.lat > north) north = p.lat;
    if (p.lat < south) south = p.lat;
    if (p.lon < west) west = p.lon;
    if (p.lon > east) east = p.lon;
  });

  const lon = Math.atan2(y / n, x / n);
  const hyp = Math.sqrt(Math.pow(x / n, 2) + Math.pow(y / n, 2));
  const lat = Math.atan2(z / n, hyp);
  const center = {
    lat: fromRadians(lat),
    lon: fromRadians(lon),
  };

  return {
    center,
    ne: {
      lat: north,
      lon: east,
    },
    sw: {
      lat: south,
      lon: west,
    },
  };
}

/**
 * Compute the zoom level that would allow to fully display the bounding area on a map
 *
 * Openstreetmap seems to only have an integer zoom, while google maps accepts decimal.
 * https://wiki.openstreetmap.org/wiki/Zoom_levels
 *
 * Returns an integer if the precision is not given
 */
export function getZoom(area, mapSize, precision) {
  const { ne, sw, center } = area;
  const distanceHeight = equirectangularDistance(ne, { lat: sw.lat, lon: ne.lon });
  const distanceWidth = equirectangularDistance(ne, { lat: ne.lat, lon: sw.lon });
  const zoomNorth = zoomByPixels(center.lat, distanceHeight, mapSize.height, precision);
  const zoomWest = zoomByPixels(center.lat, distanceWidth, mapSize.width, precision);
  return Math.min(zoomNorth, zoomWest);
}

function zoomByPixels(referenceLatitude, distanceToCover, pixelAvailable, precision) {
  // https://wiki.openstreetmap.org/wiki/Zoom_levels
  const expectedPixelSize = distanceToCover / Math.floor(pixelAvailable);
  const adjustedCirconference = C * Math.cos(toRadians(referenceLatitude));
  const zoom = Math.min(MAX_ZOOM, (Math.log2(adjustedCirconference / expectedPixelSize) - 8));
  // openstreetmap seems to only have an integer zoom, while google maps accepts decimal
  if (precision) {
    const factor = Math.pow(10, precision);
    return Math.floor(zoom * factor) / factor;
  }
  return Math.floor(zoom);
}

/**
 * Compute the smallest set of geohash codes that contain all points
 * within a distance from the center
 *
 * Distance is expressed in meters
 */
export function containingGeohashes(point, distance) {
  const PRECISIONS = [];
  for (let i = 4; i < 12; i += 1) {
    // the precisions could vary depending on the desired point
    const bounds = GeohashLib.bounds(GeohashLib.encode(point.lat, point.lon, i));
    PRECISIONS[i] = equirectangularDistance(bounds.sw, bounds.ne);
  }
  const precision = PRECISIONS.findIndex(
    (error = Infinity, i, array) => (distance < error) && (distance > (array[i + 1] || Infinity))
  );
  const pointHash = GeohashLib.encode(point.lat, point.lon);
  const neighbours = GeohashLib.neighbours(pointHash.slice(0, precision));
  return {
    precision,
    hashes: ObjectValues(neighbours).concat(pointHash.slice(0, precision)),
  };
}

/**
 * Compute the distance in meters that an average person covers in a given time (minutes)
 *
 * https://en.wikipedia.org/wiki/Walking
 */
export function distanceOnFoot(minutes) {
  // Average of 5 km per hour equivalent to 83.3 meters per minute
  return Math.ceil(83.33 * minutes);
}

/**
 * Compute the time (in minutes) it takes an average person to cover the given distance in meters
 */
export function minutesOnFoot(distance) {
  return Math.ceil(distance / 83.33);
}
