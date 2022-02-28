const SettingsManager = require("./SettingsManager.js")
const { ElectronBlocker } = require("@cliqz/adblocker-electron")
const fetch = require("node-fetch")

module.exports = async (sesh) => {
    if(SettingsManager.get().AdBlocker.enabled == true) {
        await ElectronBlocker.fromLists(fetch, [
            'https://easylist.to/easylist/easylist.txt'
        ]).then(blocker => blocker.enableBlockingInSession(sesh))
    }else {
        await ElectronBlocker.fromLists(fetch, [
            'https://easylist.to/easylist/easylist.txt'
        ]).then(blocker => blocker.disableBlockingInSession(sesh))
    }
}
