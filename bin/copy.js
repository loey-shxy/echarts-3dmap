import fs from "fs";

const copy = function (srcDir, dstDir) {
    var results = [];
    var list = fs.readdirSync(srcDir);
    var src, dst;
    list.forEach(function (file) {
        src = srcDir + '/' + file;
        dst = dstDir + '/' + file;
        var stat = fs.statSync(src);
        if (stat && stat.isDirectory()) {
            try {
                console.log('creating dir: ' + dst);
                fs.mkdirSync(dst);
            } catch (e) {
                console.log('directory already exists: ' + dst);
            }
            results = results.concat(copy(src, dst));
        } else {
            try {
                console.log('copying file: ' + dst);
                //fs.createReadStream(src).pipe(fs.createWriteStream(dst));
                fs.writeFileSync(dst, fs.readFileSync(src));
            } catch (e) {
                console.log('could\'t copy file: ' + dst);
            }
            results.push(src);
        }
    });
    return results;
}

copy("../public", "../../acirt-datav/public")
copy("../src", "../../acirt-datav/src")

const files = [".gitignore", "index.html", "package.json", "package-lock.json", "vite.config.js"];
for (let file of files) {
    fs.createReadStream(`../${file}`).pipe(fs.createWriteStream(`../../acirt-datav/${file}`));
}
