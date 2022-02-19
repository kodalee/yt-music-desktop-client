const { app, BrowserWindow, ipcMain, BrowserView, Menu, dialog, Notification, session } = require('electron')
const fsys = require('./modules/FileSystem.js')
const SettingsManager = require('./modules/SettingsManager.js')
const axios = require('axios').default
const path = require("path")
const fs = require("fs")
const { ElectronBlocker } = require('@cliqz/adblocker-electron')
const fetch = require("node-fetch")
const { shell } = require('electron/common')
const appInfo = require("./modules/AppInfo.js")



SettingsManager.apply()

const discordRpc = require('./modules/DiscordRichPresence.js').initalize()

const Logger = require("./modules/Logger.js");
Logger.out(`ytmusic version ${appInfo.version} starting...`)

if(require('electron-squirrel-startup')) {
    Logger.out("closing for squirrel patch detection")
    app.quit();
}

const createWindow = async () => {
    Logger.out("Hello fellow developer!")

    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        show: false,
        webPreferences: {
            autoplayPolicy: false,
            webSecurity: false,
            nodeIntegration: true,
            preload: path.join(app.getAppPath(), "src", "js", "preload.js"),
        },
        autoHideMenuBar: true
    })
    
    require("./modules/AdBlocker.js")(session.defaultSession)

    app.setAppUserModelId("life.koda.ytmusic");
    Logger.out("User model id set: life.koda.ytmusic");

    win.webContents.on("did-navigate", e => {
        // URL log cleansing lol

        var Url = e.sender.getURL()
        Url = Url.split("?")[0].replace("https://", "external://")
        if(Url.includes("file:///")) {
            Url = `internal:/`+Url.split("/src")[1]
        }
        Logger.out(`Brushed past URL: ${Url}`)
    })
    win.webContents.on("media-started-playing", e => {
        win.webContents.send("discordRpcNow", true);
    })
    win.webContents.on("media-paused", e => {
        win.webContents.send("discordRpcNow", true);
    })
    win.webContents.on("preload-error", () => {
        win.loadURL(`file://${__dirname}/src/settings.html`)
    })
    Logger.out("Initializing app...")
    win.setTitle("Initializing... - YouTube Music")
    win.once("ready-to-show", () => {
        win.show();
        Logger.out("Successfully initiailized!")
        ipcMain.on("injectReady", () => {
            win.webContents.send("inject", {settings: `file://${__dirname}/src/settings.html`, error: `file://${__dirname}/src/error.html`});
        });

        ipcMain.on("loadSettings", () => {
            win.webContents.send("loadSettings", SettingsManager.get());
        });

        ipcMain.on("saveSettings", SettingsManager.save);

        discordRpc.set_presence({
            state: "🔃 Connecting to YT Music...",
            largeImageKey: 'icon_512',
            instance: true,
        });

        Logger.out("Checking for updates.")
        axios({
            url: `https://raw.githubusercontent.com/hellokoda/yt-music-desktop-client/main/UPDATE`,
            method: "GET"
        }).then(response => response.data).then(data => {
            if(data.includes(`version=${appInfo.version}`)) {
                Logger.out("Up to date!")
            }
            else {
                Logger.out("Out of date, alerting user.")
                var result = dialog.showMessageBoxSync(win, {
                    type: "info",
                    message: `There is a new version (${data.split("=")[1].replace("\n", "")}) of YouTube Music available for download!`,
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

        var sample = {};
        ipcMain.on("asynchronous-message", discordRpc.event_route);
    })

    win.loadURL(`file://${__dirname}/src/splash.html`)

    win.once("close", e => {
        win.webContents.send("signal-quit", {});
        e.preventDefault(false)
    })

}


app.whenReady().then(() => {
    createWindow()
})













