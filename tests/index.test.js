import {
  boundingArea,
  equirectangularDistance,
  geohash,
  getZoom,
} from '../index';

const SHINJUKU = { lat: 35.6896491, lon: 139.7001494 };
const SHIBUYA = { lat: 35.6579909, lon: 139.7014112 };
const TOKYO = { lat: 35.6812916, lon: 139.7666099 };

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

describe('boundingArea', () => {
  it('returns the middle point of two places', () => {
    // I'm using this to validate midpoints http://www.geomidpoint.com/meet/
    const middle = boundingArea([SHINJUKU, SHIBUYA]);
    expect(equirectangularDistance(middle.center, {
      lat: 35.6738132,
      lon: 139.7010246,
    })).toBeLessThan(30);
    expect(middle.ne).toEqual({ lat: SHINJUKU.lat, lon: SHIBUYA.lon });
    expect(middle.sw).toEqual({ lat: SHIBUYA.lat, lon: SHINJUKU.lon });
    expect(getZoom(middle, { width: 700, height: 700 })).toBe(14);
    expect(getZoom(middle, { width: 700, height: 700 }, 2)).toBeCloseTo(14.6, 1);
  });

  it('returns the middle point of more places', () => {
    // I'm using this to validate midpoints http://www.geomidpoint.com/meet/
    const middle = boundingArea([SHINJUKU, SHIBUYA, TOKYO]);
    expect(equirectangularDistance(middle.center, {
      lat: 35.6762685,
      lon: 139.7230322,
    })).toBeLessThan(30);
    expect(middle.ne).toEqual({ lat: SHINJUKU.lat, lon: TOKYO.lon });
    expect(middle.sw).toEqual({ lat: SHIBUYA.lat, lon: SHINJUKU.lon });
    expect(getZoom(middle, { width: 700, height: 700 })).toBe(13);
    expect(getZoom(middle, { width: 700, height: 700 }, 2)).toBeCloseTo(13.8, 1);
    // The zoom depends on the screen size
    expect(getZoom(middle, { width: 1024, height: 768 })).toBe(14);
  });
});
