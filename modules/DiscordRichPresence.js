const client = require('discord-rich-presence')('942173523718324245')
const uploadAsset = require("./AssetHandler.js");
const SettingsManager = require("./SettingsManager.js");

function set_presence(e) {
    if(SettingsManager.get().discordRpc.enabled == false) {
        return false;
    }
    if(SettingsManager.get().discordRpc.albumArtwork == false) {
        e["largeImageKey"] = "icon_512";
    }
    client.updatePresence(e);
    return true
}
module.exports = {
    set_presence: set_presence,
    initalize() {
        set_presence({
            state: "🔃 Starting app...",
            largeImageKey: 'icon_512',
            instance: true,
        });        
        return this;
    },
    event_route(event, playback) {
        if(playback.metadata == null) {
            set_presence({
                // details: '',
                state: '🔇 Currently idle...',
                largeImageKey: 'icon_512',
                instance: true,
            });
        } else {
            if(playback.playing == true) {
                uploadAsset(playback.metadata.artwork).then(e => {
                    set_presence({
                        state: `${playback.metadata.artist}`,
                        details: `${playback.metadata.title}`,
                        largeImageKey: e.data.name,
                        smallImageKey: 'play',
                        endTimestamp: playback.duration,
                        instance: true,
                    })                            
                })
                .catch(ex => {
                    set_presence({
                        state: `${playback.metadata.artist}`,
                        details: `${playback.metadata.title}`,
                        largeImageKey: 'icon_512',
                        smallImageKey: 'play',
                        endTimestamp: playback.duration,
                        instance: true,
                    });
                });
        }
            else {
                uploadAsset(playback.metadata.artwork).then(e => {
                    set_presence({
                        state: `${playback.metadata.artist}`,
                        details: `${playback.metadata.title}`,
                        largeImageKey: "icon_512",
                        smallImageKey: 'pause',
                        instance: true,
                    })                            
                })
                .catch(ex => {
                    set_presence({
                        state: `${playback.metadata.artist}`,
                        details: `${playback.metadata.title}`,
                        largeImageKey: "icon_512",
                        smallImageKey: 'pause',
                        instance: true,
                    });
                });
            }
        }

        event.sender.send('asynchronous-reply', 'okay')
    }
}