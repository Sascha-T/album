// Picture Structure as follows
// WP_YYYYMMDD_HH_MM_SS_(RICH||PRO).jpg

// What I aim to do is:
// Move Pictures
// Create Files
// Create an JSON containing information


// 304e045c BEEING "PICTURE(16-02-2018)" HASHED USING ADLER32
// (STORED AS HEX)

// Example JSON
/*
{
 "pictures": {
    "2017": {},
    "2018": {
        "january": {},
        "february": {
            "16": {
                "304e045c": {
                	"originalName": "NOT SET",
                	"filename": "/2018/FEBRUARY/16/304e045c.png",
                	"ext": ".png"
		        }
            }
        },
        "march": {},
        "april": {},
        "may": {},
        "june": {},
        "july": {},
        "august": {},
        "september": {},
        "october": {},
        "november": {},
        "december": {}
    }
 }
}
*/

// Windows Phone prefixes Pictures with WP
// Apple with img_

// Supress warnings.
console.warn = null;

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const colors = require('colors');
const path = require('path');
const fs = require('fs');
var albumJSON = {};
function dayT () { return (new Date()).getDate() < 10 ? "0" + (new Date()).getDate() : (new Date()).getDate(); }
function monthT () { return ((new Date()).getMonth() + 1) < 10 ? "0" + ((new Date()).getMonth() + 1) : (new Date()).getMonth() + 1; }
function yearT () { return (new Date()).getFullYear(); }
var defaultAlbumJSON = {"pictures":{}};
defaultAlbumJSON["pictures"][yearT()] = {"january":{},"february":{},"march":{},"april":{},"may":{},"june":{},"july":{},"august":{},"september":{},"october":{},"november":{},"december":{}};
let oldX = console.log;
console.log = undefined;
function log(symbol, text) {
    var colorX;
    switch(symbol) {
        case "--":
        oldX("--".yellow + " " + text.blue)
        break;
        case "-":
        oldX("  -".magenta + "  " + text.blue)
        break;
        case "!":
        oldX("  !".red + "  " + text.yellow)
        break;
        case "x":
        oldX("  x".gray + "  "  + text.blue)
        break;
    }
    
}
function saveAlbumJSON() {
    fs.writeFileSync(path.join(__dirname, 'album.json'), JSON.stringify(albumJSON, null, 4), "UTF-8")
}
function nameGen(day, month, year, fileSize) {
    Adler32 = require('adler32-js');
    hash = new Adler32();
    hash.update(`PICTURE(${day}-${month}-${year}),(${fileSize})`);
    return hash.digest('hex');
}
log("!", "Made by https://github.com/Sascha-T/")
log("!", "Licensed under Apache-2.0")
setTimeout(main, 1000)
function main() {
log("--", "Date Today in DD, MM, YYYY format: "+ dayT() + ", " + monthT() + ", " + yearT())
log("--", "INTEGRITY CHECK")
log("-", "Testing Adler32...")
if(nameGen("16", "02", "2018", "3746808") === "666e064d") {
    log("!", "Working.")
} else {
    log("!", "Failed.")
    log("x", "To prevent any further damage, the program will shut down.")
    process.exitCode = 1;
}
function mkFile(pathX) {
    fs.writeFileSync(pathX, "", "UTF-8")
}
function mkDir(pathX) {
    fs.mkdirSync(pathX)
}
function rmDir(pathX) {
    fs.rmdirSync(pathX)
}
function exists(pathX) {
    return fs.existsSync(pathX);
}
log("--", "Time to create/check the file structure.")
log("-", "Album")

if(!exists(path.join(__dirname, 'Album'))) {
    mkDir(path.join(__dirname, 'Album'))
}
if(!exists(path.join(__dirname, 'album.json'))) {
    mkFile(path.join(__dirname, 'album.json'))
    fs.writeFileSync(path.join(__dirname, 'album.json'), JSON.stringify(defaultAlbumJSON, null, 4), "UTF-8")
}
log("-", "Create/Check Folder for current year")
if(!exists(path.join(__dirname, 'Album', yearT().toString()))) {
    mkDir(path.join(__dirname, 'Album', yearT().toString()))
}
log("-", "Create/Check Month Folders for current year")
for(var month in months) {
    if(!exists(path.join(__dirname, 'Album', yearT().toString(), months[month]))) {
        mkDir(path.join(__dirname, 'Album', yearT().toString(), months[month]))
    }
}
log("-", "Input")
if(!exists(path.join(__dirname, 'Input'))) {
    log("!", "Special Info.")
    log("x", "Since file structure is now fully set up, but you didn't have any images in the input folder yet, the program will close. Put the images in the input folder, and rerun.")
    mkDir(path.join(__dirname, 'Input'))
    process.exitCode = 1;
}
log("-", "Creating local instance of album.json")
albumJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'album.json'), "UTF-8"))
if(!albumJSON["pictures"][yearT()]) {
    albumJSON["pictures"][yearT()] = {};
}
if(!albumJSON["pictures"][yearT()][dayT()]) {
    albumJSON["pictures"][yearT()][dayT()] = {};
}
log("--", "Reading Input")
var files = fs.readdirSync(path.join(__dirname, 'Input'));
for(var file in files) {
    var stats = fs.statSync(path.join(__dirname, 'Input', files[file]))
    var creationDate = new Date(stats.mtimeMs);
    log("-", files[file])
    log("x", "Day: " + creationDate.getDate());
    log("x", "Month: " + creationDate.getMonth() + 1);
    log("x", "Year: " + creationDate.getFullYear());  
    log("x", "Hour: " + creationDate.getHours());
    log("x", "Minute: " + creationDate.getMinutes());    
    log("x", JSON.stringify(stats));
    var nName = nameGen(creationDate.getDate(), creationDate.getMonth() + 1, creationDate.getFullYear(), stats.size);
    log("x", "New Name: " + nName);
    albumJSON["pictures"][yearT()][dayT()][nName] = {};
    albumJSON["pictures"][yearT()][dayT()][nName]["originalname"] = files[file];
    albumJSON["pictures"][yearT()][dayT()][nName]["filename"] = (require('os').platform() == "win32" ? ".\\" : "/") + path.join('Album', creationDate.getFullYear().toString(), months[creationDate.getMonth()], dayT().toString(), nName + path.extname(files[file]))
    albumJSON["pictures"][yearT()][dayT()][nName]["ext"] = path.extname(files[file])
    if(!exists(path.join(__dirname, 'Album', creationDate.getFullYear().toString(), months[creationDate.getMonth()], dayT().toString()))) {
        mkDir(path.join(__dirname, 'Album', creationDate.getFullYear().toString(), months[creationDate.getMonth()], dayT().toString()))
    }
    fs.renameSync(path.join(__dirname, 'Input', files[file]), path.join(__dirname, 'Album', creationDate.getFullYear().toString(), months[creationDate.getMonth()], dayT().toString(), nName + path.extname(files[file])))
}

saveAlbumJSON()
}