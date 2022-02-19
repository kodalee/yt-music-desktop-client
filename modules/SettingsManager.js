const fsys = require('./FileSystem.js');

module.exports = {
    DEFAULT_SETTINGS: {
        releaseOfLiabilityAccepted: false,
        discordRpc: {
            enabled: true,
            albumArtwork: true
        },
        AdBlocker: {
            enabled: true
        }
    },
    get() {
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
        event.sender.send("saveSettings", true);
    }
}