const path = require('path');
const fs = require('fs');

let dir = process.argv[2];

let script =    "const path = require('path'); \n" +
    "const fs = require('fs'); \n" +
    "const d = __dirname; \n" +
    "(function showAllFiles (dirPath) { \n" +
    "fs.readdir(dirPath, (err, files) => { \n" +
    "for(let file in files) { \n" +
    "let currentDir = dirPath + path.sep + files[file]; \n" +
    "fs.stat(currentDir, (err, stats) => { \n" +
    "if(stats.isDirectory()) { \n" +
    "showAllFiles(currentDir); \n" +
    "} else { \n" +
    "let relPath = currentDir.substring(d.length + 1); \n" +
    "console.log(relPath); \n" +
    "} \n" +
    "}); \n" +
    "} \n" +
    "}) \n" +
    "})(__dirname); \n";

let copyright;
(() => {
    if (dir != undefined) {
        fs.access(dir, (err) => {
            if(err) {
                console.log('error in path');
            } else {
                createFile();
                let insDir = createDir(dir);
                getCopyright();
                copyTXT(dir, insDir);
                console.log('insDir = ' + insDir);
                watchingFiles(insDir);
            }
        })
    } else {
        console.log("Type the path");
    }

})();

function createFile() {
    fs.writeFile(dir + path.sep + 'summary.js', script, (err) => {
        if(err) throw err;
        console.log('file summary.js is created succesfully!');
    });
}

function getCopyright() {

    fs.readFile("config.json", (err, data) => {
        if (err) {
            console.log("error in config.json")
            copyright = 'null';
        }
        else {
            let extraData = JSON.parse(data);
            copyright = extraData['copyright'];
        }
    });
}

function addCopyright(path, data) {
    let text = copyright + data + copyright;
    fs.writeFile(path, text, (err) => {
        if (err) throw err;
    });
}

function createDir(dir) {
    let insDir = dir + path.sep + path.basename(dir);
    fs.mkdir(insDir, (err) => {
        if (err) throw err;
        console.log('created directory');
    });
    return insDir;
}

function watchingFiles(path) {
    fs.watch(path, (eventType, filename) => {
        if (filename) {
            console.log(filename.toString());
        }
    })
}

function copyTXT(dir, newDir) {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;
        for (let file in files) {
            let currentFile = dir + path.sep + files[file];
            fs.stat(currentFile, (err, stats) => {
                if(err) throw err;
                if(stats.isDirectory()) {
                    copyTXT(currentFile, newDir);
                } else {
                    if(path.extname(currentFile) === '.txt') {
                        fs.readFile(currentFile, (err, data) => {
                            if(err) throw err;
                            addCopyright(newDir + path.sep + files[file], data);
                        });
                    }
                }
            })
        }
    })
}