const Logger = require("./Logger")
const appInfo = require("./AppInfo")

module.exports = {
    /**
     * @param {import("electron").BrowserWindow} win
     * @param {import("electron").App} app
     */
    register_wc(app, win) {
        Logger.out("[AppHost] Created window specimen")

        Logger.out("[AppHost] APP_START")
        win.setTitle("YouTube Music")

        Logger.out("[AppHost] APP_SET_MODEL_ID life.koda.ytmusic")
        app.setAppUserModelId("life.koda.ytmusic");
    
        Logger.out(`[AppHost] YouTube Music version ${appInfo.version} starting...`)
        Logger.out("[AppHost] Hello fellow developer!")

        win.webContents.on("did-navigate", e => {
            var Url = e.sender.getURL()
            Url = Url.split("?")[0].replace("https://", "external://")
            if(Url.includes("file:///")) {
                Url = `internal:/`+Url.split("/src")[1]
            }
            Logger.out(`[AppHost] DID_NAVIGATE (${Url})`)
        })
        win.webContents.on("media-started-playing", e => {
            win.webContents.send("discordRpcNow", true);
        })
        win.webContents.on("media-paused", e => {
            win.webContents.send("discordRpcNow", true);
        })
        win.webContents.on("preload-error", () => {
            Logger.out(`[AppHost] PRELOAD_ERROR | sent to error.html`)
            win.loadURL(`file://${__dirname.replace("/modules")}/src/error.html`)
        })
    }
}