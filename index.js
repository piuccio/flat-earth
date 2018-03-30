import GeohashLib from 'latlon-geohash';

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
export function equirectangularDistance(p1, p2) {
  const λ1 = toRadians(p1.lon);
  const λ2 = toRadians(p2.lon);
  const φ1 = toRadians(p1.lat);
  const φ2 = toRadians(p2.lat);

  const x = (λ2-λ1) * Math.cos((φ1+φ2)/2);
  const y = (φ2-φ1);
  return Math.round(Math.sqrt(x*x + y*y) * R);
}

function toRadians(number) {
  return Number(number) * Math.PI / 180;
}
