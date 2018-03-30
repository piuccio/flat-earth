import {
  equirectangularDistance,
  geohash,
} from '../index';

describe('geohash', () => {
  it('returns a hash with precision', () => {
    // Shinjuku
    expect(geohash(35.6896491, 139.7001494)).toBe('xn774cne32v3');
    expect(geohash(35.6896491, 139.7001494, 7)).toBe('xn774cn');
  });
});

describe('equirectangularDistance', () => {
  it('returns the distance between two coordinates', () => {
    // Shinjuku -> Shibuya
    // https://www.movable-type.co.uk/scripts/latlong.html
    const point1 = { lat: 35.6896491, lon: 139.7001494 };
    const point2 = { lat: 35.6579909, lon: 139.7014112 };
    expect(equirectangularDistance(point1, point2)).toEqual(3522);
  });
});
