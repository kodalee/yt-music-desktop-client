const { BrowserWindow } = require("electron")
const fsys = require("./FileSystem")

module.exports = {
    setup() {
        fsys.write_json(fsys.LOGS_LOCATION, ["debug log start"])
        return this
    },
    getLogs() { return fsys.get_json(fsys.LOGS_LOCATION) },
    out(...args) {
        var now = new Date()
        var seconds = now.getSeconds()
        if(seconds < 10) {
            seconds = "0"+seconds
        }

        var constructedMessage = `[${now.getHours()}:${now.getMinutes()}:${seconds}] ${args.join(" ")}`

        var array_log = fsys.get_json(fsys.LOGS_LOCATION)

        if(array_log.length > 10) {
            array_log.shift()
        }

        array_log.push(constructedMessage)
        fsys.write_json(fsys.LOGS_LOCATION, array_log)


        if(typeof BrowserWindow !== 'undefined') {
            if(typeof BrowserWindow.getAllWindows !== 'undefined') {
                if(BrowserWindow.getAllWindows().length != 0) {
                    var window = BrowserWindow.getAllWindows().at(0)

                    if(window != null) {
                        window.webContents.send("logger-out", 0)
                    }        
                }
            }
        }

        console.log(constructedMessage)
        return true
    }
}