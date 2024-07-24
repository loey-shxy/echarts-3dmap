import path from "path";
import fs from "fs";
import {fileURLToPath} from "url";

const target = "./src/map"
const rootCode = "100000"
let meta = {}
let metaFull = {}
let metaR = {}
let metaFullR = {}
let metaCoord = {}

function getRootDir() {
    return path.join(path.dirname(fileURLToPath(import.meta.url)), target)
}

function readChildArea(code) {
  if (code !== '100000_JD') {
      const file = path.join(getRootDir(), `${code}.json`);
      const content = fs.readFileSync(file).toString();
      const data = JSON.parse(content);
  
      let areas = []
      for (let i = 0; i < data.features.length; i++) {
          areas.push({code: data.features[i].properties.adcode, name: data.features[i].properties.name, center: data.features[i].properties.center})
      }
      return areas
  }
}


const areas = readChildArea(rootCode);

for (let area of areas) {
    if (area.code !== '100000_JD') {
      meta[area.code] = area.name
      metaR[area.name] = area.code

      metaFull[area.code] = area.name
      metaFullR[area.name] = area.code

      metaCoord[area.code] = area.center

      const childAreas = readChildArea(area.code);
      for(let c of childAreas) {
          metaFull[c.code] = c.name
          metaFullR[c.name] = c.code
          metaCoord[c.code] = c.center
      }
    }
}
fs.writeFileSync(path.join(getRootDir(), 'meta.json'), JSON.stringify(meta))
fs.writeFileSync(path.join(getRootDir(), 'meta_full.json'), JSON.stringify(metaFull))
fs.writeFileSync(path.join(getRootDir(), 'meta_r.json'), JSON.stringify(metaR))
fs.writeFileSync(path.join(getRootDir(), 'meta_full_r.json'), JSON.stringify(metaFullR))
fs.writeFileSync(path.join(getRootDir(), 'meta_coord.json'), JSON.stringify(metaCoord))
