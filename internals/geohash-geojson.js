const fs = require('fs');
const path = require('path');
const GeohashLib = require('latlon-geohash');

const SHINJUKU = GeohashLib.encode(35.6896491, 139.7001494);

for (let i = 0; i < SHINJUKU.length; i += 1) {
  const rootHash = SHINJUKU.slice(0, i);
  const geojson = {
    type: 'FeatureCollection',
    features: [],
  };

  GeohashLib.base32.split('').forEach((base) => {
    const { ne, sw } = GeohashLib.bounds(rootHash + base);
    geojson.features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [sw.lon, sw.lat],
            [sw.lon, ne.lat],
            [ne.lon, ne.lat],
            [ne.lon, sw.lat],
            [sw.lon, sw.lat],
          ],
        ],
      },
      properties: {
        code: rootHash + base,
      },
    });
  });

  fs.writeFileSync(path.join(process.cwd(), `tmp/geohash_${i}.json`), JSON.stringify(geojson, null, '  '));
}
