const EventHooker = require("./modules/EventHooker")

// IMPORT SETTINGS MANAGER AND APPLY SETTINGS WITH DEFAULT SETTINGS
const SettingsManager = require('./modules/SettingsManager')
SettingsManager.apply()

// IMPORT CHERRY PICKED CONSTANTS FROM LIBRARIES
const { app, BrowserWindow, ipcMain, BrowserView, Menu, dialog, Notification, session } = require('electron')
const { ElectronBlocker } = require('@cliqz/adblocker-electron')
const { shell } = require('electron/common')

// IMPORT WHOLE REQUIRED LIBRARIES
const fsys = require('./modules/FileSystem')
const axios = require('axios').default
const path = require("path")
const fs = require("fs")
const fetch = require("node-fetch")
const appInfo = require("./modules/AppInfo")
const discordRpc = require('./modules/DiscordRichPresence').initalize()

require("./modules/SquirrelPatch")(app)

var error_counts=0



app.whenReady().then(() => {
    (async () => {
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

        require("./modules/EventHooker").register_wc(app, win)

        if (process.argv.includes("devtools")) {
            win.webContents.openDevTools()
        }

        const Logger = require("./modules/Logger").setup();
        ipcMain.on("loadSettings", () => {
            win.webContents.send("loadSettings", SettingsManager.get());
        });

        win.once("ready-to-show", () => {
            win.show();
            require("./modules/HighwayPatrol")()
            require("./modules/AdBlocker")(session.defaultSession)

            app.setAppUserModelId("life.koda.ytmusic");
            Logger.out("User model id set: life.koda.ytmusic");
            Logger.out("Successfully initiailized!")
            ipcMain.on("injectReady", () => {
                win.webContents.send("inject", {settings: `file://${__dirname}/src/settings.html`, error: `file://${__dirname}/src/error.html`});
            });

            ipcMain.on("saveSettings", SettingsManager.save);

            discordRpc.set_presence({
                state: "🔃 Connecting to YT Music...",
                largeImageKey: 'icon_512',
                instance: true,
            });

            require("./modules/UpdateChecker")(win)

            ipcMain.on("asynchronous-message", discordRpc.event_route);
        })

        win.loadURL(`file://${__dirname}/src/splash.html`)

        win.once("close", e => {
            win.webContents.send("signal-quit", {});
            e.preventDefault(false)
        })
    })()
})













