const fs = require("fs")
const path = require("path")
const appInfo = require("./AppInfo.js")
const datafolder = path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share"), appInfo.name);

module.exports = {
    SETTINGS_LOCATION: path.join(datafolder, "Settings.json"),
    LOGS_LOCATION: path.join(datafolder, "LOG_HOLDER.json"),
    get_json (file) {
        try {
            return JSON.parse(fs.readFileSync(file, {encoding:'utf8', flag:'r'}))
        }
        catch (ex) {
            throw new Error(`A fatal error occurred whilst a file was being loaded. Please create an issue with the log created.\n\n${ex.name}->${ex.message}`);
        }
    },
    /**
     * 
     * @param {path} path C:\Path\To\File
     * @param {object|array} data {"data": "in an object style"}
     * @param {array} data ["array"]
     * @returns void
     */
    write_json (path, data) {
        return fs.writeFileSync(path, JSON.stringify(data, null, 2))
    },
    exists: fs.existsSync,

}