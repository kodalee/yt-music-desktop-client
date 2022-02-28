const Logger = require("./Logger.js")

module.exports = app => {
    if(require('electron-squirrel-startup')) {
        Logger.out("closing for squirrel patch detection")
        app.quit();
    }
}