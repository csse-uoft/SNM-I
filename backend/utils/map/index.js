const GeoJsonGeometriesLookup = require('geojson-geometries-lookup');
const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

const metadata = require('canada-neighbourhood/data/metadata.json');

// GeoJsonGeometriesLookup Cache
const lookupCache = {};

/**
 *
 * @param province
 * @param region
 * @return {Promise.<{type:{}, features: []}|undefined>}
 */
async function getRegionGeoJson(province, region) {
  if (Object.keys(metadata).includes(province) && metadata[province].includes(region)) {
    const fileBuffer = await readFileAsync(`${__dirname}/../../node_modules/canada-neighbourhood/data/original/${province}/${region}.geojson`);
    return JSON.parse(fileBuffer);
  } else {
    throw new Error(`The Provided ${region}, ${province} does not exist.`);
  }
}

async function getGeoJsonGeometriesLookup(province, region) {
  // Use memory cache if possible
  if (lookupCache[province] && lookupCache[province][region]) {
    return lookupCache[province][region];
  } else {
    const geojson = await getRegionGeoJson(province, region);
    const glookup = new GeoJsonGeometriesLookup(geojson);
    if (!lookupCache[province]) lookupCache[province] = {};
    lookupCache[province][region] = glookup;
    return glookup;
  }
}

/**
 * Test if a point (lat, lng) lays in one of the given neighbourhoods (province, region, neighbourhoods).
 * @param {string} province, e.g. "ON"
 * @param {string} region, e.g. "York Region"
 * @param {string[]} neighbourhoods
 * @param {number} lat
 * @param {number} lng
 * @return {Promise<boolean>}
 */
async function testPoint(province, region, neighbourhoods, lat, lng) {
  const glookup = await getGeoJsonGeometriesLookup(province, region);

  const point = {type: "Point", coordinates: [lng, lat]};
  const containers = glookup.getContainers(point);

  const inNeighbourhoods = containers.features.map(({properties}) => properties.name);

  // Test with neighbourhood names
  let contains = false;
  for (const inNeighbourhood of inNeighbourhoods) {
    if (neighbourhoods.includes(inNeighbourhood)) {
      contains = true;
      break;
    }
  }

  return contains;
}

module.exports = {testPoint}
