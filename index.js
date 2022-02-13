const client = require('discord-rich-presence')('942173523718324245');
const axios = require('axios').default;
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require("path");


if(require('electron-squirrel-startup')) app.quit();
client.updatePresence({
    state: "🔃 Starting app...",
    largeImageKey: 'icon_512',
    instance: true,
});


const createWindow = () => {
    console.log("You launching this thru a terminal?? Damn well okay!")
    console.log("Lets get started shall we?")
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        show: false,
        webPreferences: {
            autoplayPolicy: false,
            webSecurity: false,
            nodeIntegration: true,
            preload: path.join(app.getAppPath(), "preload.js"),
        }
    })

    // win.setIcon("yt.png")
    var currentData = null
    win.setTitle("Initializing... - YouTube Music")
    win.setMenuBarVisibility(false);
    console.log("Loading... | "+`file://${__dirname}/src/index.html`)
    win.once("ready-to-show", () => {
        win.show();
        console.log("Done! No more normal outputs. Only verbose and errors")
        ipcMain.on("injectReady", () => {
            win.webContents.send("inject", {settings: `file://${__dirname}/src/settings.html`});
        });

        client.updatePresence({
            state: "🔃 Connecting to YT Music...",
            largeImageKey: 'icon_512',
            instance: true,
        });
        
        ipcMain.on("asynchronous-message", (event, playback) => {
            if(playback.metadata == null) {
                client.updatePresence({
                    // details: '',
                    state: '🔇 Currently idle...',
                    largeImageKey: 'icon_512',
                    instance: true,
                });
            } else {
                if(playback.playing == true) {

                    axios({
                        url: "https://koda.life/uploadAsset.php",
                        data: "url="+encodeURIComponent(playback.metadata.artwork.split("=")[0]+"=w512-h512-l90-rj"),
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: "POST"
                    }).then(e => {
                        client.updatePresence({
                            state: `${playback.metadata.artist}`,
                            details: `${playback.metadata.title}`,
                            largeImageKey: e.data.name,
                            smallImageKey: 'play',
                            endTimestamp: playback.duration,
                            instance: true,
                        })                            
                    })
                    .catch(ex => {
                        client.updatePresence({
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
                    axios({
                        url: "https://koda.life/uploadAsset.php",
                        data: "url="+encodeURIComponent(playback.metadata.artwork.split("=")[0]+"=w512-h512-l90-rj"),
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: "POST"
                    }).then(e => {
                        
                        client.updatePresence({
                            state: `${playback.metadata.artist}`,
                            details: `${playback.metadata.title}`,
                            largeImageKey: "icon_512",
                            smallImageKey: 'pause',
                            instance: true,
                        })                            
                    })
                    .catch(ex => {
                        client.updatePresence({
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
        });
    })

    win.loadURL(`file://${__dirname}/src/index.html`)

    win.once("close", e => {
        win.webContents.send("signal-quit", {});
        e.preventDefault(true)
    })
}


app.whenReady().then(() => {
    createWindow()
})













