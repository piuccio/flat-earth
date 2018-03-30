import { geohash } from '../index';

describe('geohash', () => {
  it('returns a hash with precision', () => {
    expect(geohash(35.6896491, 139.7001494)).toBe('xn774cne32v3');
    expect(geohash(35.6896491, 139.7001494, 7)).toBe('xn774cn');
  });
});
