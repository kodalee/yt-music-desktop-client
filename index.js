const { app, BrowserWindow, ipcMain, BrowserView, Menu } = require('electron')
const client = require('discord-rich-presence')('942173523718324245')
const axios = require('axios').default
const path = require("path")
const fs = require("fs")
const { shell } = require('electron/common')
const datafolder = path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share"), "YouTubeMusic");
var PathTo = {
    Settings: path.join(datafolder, "Settings.json")
}
var getFileObject = (file) => {
    return JSON.parse(fs.readFileSync(file, {encoding:'utf8', flag:'r'}))
}

if(!fs.existsSync(PathTo.Settings)) {
    fs.writeFileSync(PathTo.Settings, JSON.stringify({
        discordRpc: {
            enabled: true,
            albumArtwork: true
        }
    }, null, 2))
}
else {
    
}
var Logger = {
    out(...args) {
        var now = new Date();
        console.log(`[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] ${args.join(" ")}`)
        return true
    }
}

var Settings = getFileObject(PathTo.Settings);

function setPresence(e) {
    if(Settings.discordRpc.enabled == false) {
        return false;
    }
    if(Settings.discordRpc.enabled == false) {
        e["largeImageKey"] = "icon_512";
    }
    client.updatePresence(e);
    return true
}

if(require('electron-squirrel-startup')) app.quit();
setPresence({
    state: "🔃 Starting app...",
    largeImageKey: 'icon_512',
    instance: true,
});


const createWindow = () => {
    Logger.out("You launching this thru a terminal?? Damn well okay!")
    Logger.out("Lets get started shall we?")
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        show: false,
        webPreferences: {
            autoplayPolicy: false,
            webSecurity: false,
            nodeIntegration: true,
            preload: path.join(app.getAppPath(), "src", "js", "preload.js"),
        }
    })

    
    // win.setIcon("yt.png")
    var currentData = null
    win.setTitle("Initializing... - YouTube Music")
    Logger.out("INIT life.koda.ytmusic");
    win.setMenuBarVisibility(false);
    win.webContents.on("did-navigate", e => {
        var Url = e.sender.getURL()
        Logger.out(`URL Changed to ${Url}`)
    })
    win.webContents.on("media-started-playing", e => {
        Logger.out("Media state changed to playing, ordering discord rpc update")
        win.webContents.send("discordRpcNow", true);
    })
    win.webContents.on("media-paused", e => {
        Logger.out("Media state changed to paused, ordering discord rpc update")
        win.webContents.send("discordRpcNow", true);
    })
    win.once("ready-to-show", () => {
        win.show();
        Logger.out("Opening window as page is ready to show")
        ipcMain.on("injectReady", () => {
            win.webContents.send("inject", {settings: `file://${__dirname}/src/settings.html`});
        });

        ipcMain.on("loadSettings", () => {
            win.webContents.send("loadSettings", Settings);
        });

        ipcMain.on("saveSettings", (event, settings) => {
            fs.writeFileSync(PathTo.Settings, JSON.stringify(settings, null, 2))
            Settings = getFileObject(PathTo.Settings)
            win.webContents.send("saveSettings", true);
        });

        setPresence({
            state: "🔃 Connecting to YT Music...",
            largeImageKey: 'icon_512',
            instance: true,
        });
        
        ipcMain.on("asynchronous-message", (event, playback) => {
            if(playback.metadata == null) {
                setPresence({
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
                        setPresence({
                            state: `${playback.metadata.artist}`,
                            details: `${playback.metadata.title}`,
                            largeImageKey: e.data.name,
                            smallImageKey: 'play',
                            endTimestamp: playback.duration,
                            instance: true,
                        })                            
                    })
                    .catch(ex => {
                        setPresence({
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
                        
                        setPresence({
                            state: `${playback.metadata.artist}`,
                            details: `${playback.metadata.title}`,
                            largeImageKey: "icon_512",
                            smallImageKey: 'pause',
                            instance: true,
                        })                            
                    })
                    .catch(ex => {
                        setPresence({
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

    win.loadURL(`file://${__dirname}/src/splash.html`)

    win.once("close", e => {
        win.webContents.send("signal-quit", {});
        e.preventDefault(true)
    })
}


app.whenReady().then(() => {
    createWindow()
})













