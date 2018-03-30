import GeohashLib from 'latlon-geohash';

export function geohash(lat, lon, precision) {
  return GeohashLib.encode(lat, lon, precision);
}
