const fsys = require('./FileSystem.js');
const Logger = require('./Logger.js');

module.exports = {
    DEFAULT_SETTINGS: {
        releaseOfLiabilityAccepted: false,
        discordRpc: {
            enabled: true,
            albumArtwork: true,
            look: {
                first: "{song}",
                second: "{artist}"
            }
        },
        AdBlocker: {
            enabled: true
        },
        personalization: {
            font: {
                enabled: false,
                family: ""
            }
        }
    },
    /**
     * Get the settings of the app
     * @property {boolean} releaseOfLiabilityAccepted - The status of the acceptance of the ROL
     * @returns {Object[]}
     */
    get() {
        Logger.out(`[SettingsManager] returning get() call with SETTINGS`)
        return fsys.get_json(fsys.SETTINGS_LOCATION)
    },
    apply() {
        if(!fsys.exists(fsys.SETTINGS_LOCATION)) {
            fsys.write_json(fsys.SETTINGS_LOCATION, this.DEFAULT_SETTINGS)
        }
        else {
            var __TEMP_SETTINGS = fsys.get_json(fsys.SETTINGS_LOCATION);
            fsys.write_json(fsys.SETTINGS_LOCATION, Object.assign(this.DEFAULT_SETTINGS,__TEMP_SETTINGS))
        }
        return 1;    
    },
    save(event, settings) {
        fsys.write_json(fsys.SETTINGS_LOCATION, settings)
        Logger.out(`[SettingsManager] saving data; returning save(...) with NEW_SETTINGS`)
        event.sender.send("saveSettings", true);
    }
}