const SettingsManager = require("./SettingsManager.js")
const { ElectronBlocker } = require("@cliqz/adblocker-electron")
const fetch = require("node-fetch")

module.exports = async (sesh) => {
    if(SettingsManager.get().AdBlocker.enabled) {
        ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
            blocker.enableBlockingInSession(sesh);
        });
    }    
}
