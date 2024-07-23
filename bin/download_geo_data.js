import http from "https"
import fs from "fs"
import path from "path"
import {fileURLToPath} from 'url'

const target = "../src/map"
const rootCode = "810000"

function getRootDir() {
    return path.join(path.dirname(fileURLToPath(import.meta.url)), target)
}

function download(code, cb) {
    const url = code === '810000' ? `https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json`
    : `https://geo.datav.aliyun.com/areas_v3/bound/${code}.json`

    const file = fs.createWriteStream(path.join(getRootDir(), `${code}.json`));
    const request = http.get(url, function (response) {
        response.pipe(file);
        file.on("finish", () => {
            file.close();
            console.log(`Download Completed ${code}`);
            cb(code)
        });
    });
}

function readChildArea(code) {
    const file = path.join(getRootDir(), `${code}.json`);
    const content = fs.readFileSync(file).toString();
    const data = JSON.parse(content);

    let areas = []
    for (let i = 0; i < data.features.length; i++) {
        areas.push(data.features[i].properties.adcode)
    }
    return areas
}



download(rootCode, (code) => {
    const codes = readChildArea(code)
    console.log(`output->codes`,codes)
    for (let c of codes) {
        download(c, () => {
        })
    }
});
