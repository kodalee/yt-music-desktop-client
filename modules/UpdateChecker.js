const { default: axios } = require("axios")
const { dialog } = require("electron")
const Logger = require("./Logger")
const appInfo = require("./AppInfo")
module.exports = (win) => {
    Logger.out("Checking for updates.")
    axios({
        url: `https://raw.githubusercontent.com/hellokoda/yt-music-desktop-client/main/VERSION.json`,
        method: "GET"
    }).then(response => {
        var data = response.data
        Logger.out(data)

        if(data.build_number <= appInfo.build_number) {
            Logger.out("Up to date build number!")
        }
        else {
            Logger.out("Out of date build number, alerting user.")
            var result = dialog.showMessageBoxSync(win, {
                type: "info",
                message: `There is a new version (${data.display_version}_${data.build_number}) of YouTube Music available for download! You are on the outdated ${appInfo.version}_${appInfo.build_number} version`,
                title: "New Update!",
                buttons: ["Remind me later", "Close and update now"]
            })
            switch (result) {
                case 0: {
                    return
                }
                case 1: {
                    const { shell } = require("electron");
                    shell.openExternal(`${appInfo.repo}/releases`);
                    process.exit();
                    break
                }
            }
        }
    })    
}