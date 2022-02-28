const client = require('discord-rich-presence')('942173523718324245')
const uploadAsset = require("./AssetHandler.js");
const Logger = require('./Logger.js');
const config = require("./SettingsManager.js").get();

function set_presence(e) {
    if(config.discordRpc.enabled == false) {
        return false;
    }
    if(config.discordRpc.albumArtwork == false) {
        e["largeImageKey"] = "icon_512";
    }

    if(config.discordRpc.duration == false) {
        delete e["endTimestamp"]
    }


    var status = e;
    e["state"]
    Logger.out(`[DiscordRP] UPDATE_CUSTOM_STATUS ${JSON.stringify(e)}`)

    client.updatePresence(e);
    return true
}

/**
 * 
 * @param {object} playback The playback object to extract metadata and player data from
 * @param {string} input The string of text to have the placeholders applied to.
 * @returns {string} The newly formatted string
 */
function ytm_placeholders(playback, input = "") {
    if (input == "") {
        input = "null"
    }

    input = input
    .split("{artist}").join(playback.metadata.artist)
    .split("{song}").join(playback.metadata.title)
    .split("{at}").join(playback.rawDuration.at)
    .split("{duration}").join(playback.rawDuration.len)

    return input
}

module.exports = {
    set_presence: set_presence,
    ytm_placeholders: ytm_placeholders,
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
                        state: ytm_placeholders(playback, config.discordRpc.look.second),
                        details: ytm_placeholders(playback, config.discordRpc.look.first),
                        largeImageKey: e.data.name,
                        smallImageKey: 'play',
                        endTimestamp: playback.duration,
                        instance: true,
                    })                            
                })
                .catch(ex => {
                    set_presence({
                        state: ytm_placeholders(playback, config.discordRpc.look.second),
                        details: ytm_placeholders(playback, config.discordRpc.look.first),
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
                        state: ytm_placeholders(playback, config.discordRpc.look.second),
                        details: ytm_placeholders(playback, config.discordRpc.look.first),
                        largeImageKey: "icon_512",
                        smallImageKey: 'pause',
                        instance: true,
                    })                            
                })
                .catch(ex => {
                    set_presence({
                        state: ytm_placeholders(playback, config.discordRpc.look.second),
                        details: ytm_placeholders(playback, config.discordRpc.look.first),
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