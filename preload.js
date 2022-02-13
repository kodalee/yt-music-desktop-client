const { default: axios } = require("axios");
const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
    if(window.location.href.includes("settings.html")) {
    } else {
        ipcRenderer.on("signal-quit", () => {
            if(confirm("You are closing YT Music, are you sure? Clicking Cancel will prevent you from closing YT Music while something is playing until the next time YT Music starts.") == true) {
                document.getElementsByTagName("video")[0].pause();
                document.body.style.transition = "1s";
                document.body.style.opacity = 0;
                setTimeout(() => {
                    window.close();
                }, 1000)    
            }
        })

        ipcRenderer.send("injectReady", {})
        ipcRenderer.on("inject", (e, d) => {
            const para = document.createElement("ytmusic-pivot-bar-item-renderer");
            para.classList.add("ytmusic-koda-settings")
            para.innerHTML = `&nbsp;Settings&nbsp;`;
            var settingsBtn = document.getElementsByTagName("ytmusic-pivot-bar-renderer")[0].appendChild(para)
    
            settingsBtn.onclick = () => {
                if(confirm("WARNING: Your music will be stopped when you open settings. Press OK to continue") == true) {
                    document.getElementsByTagName("video")[0].pause();
                    document.body.style.transition = "0.3s";
                    document.body.style.opacity = 0;
                    setTimeout(() => {
                        window.location = d.settings
                    }, 1000)    
                }
            } 
        })
    
        setInterval(() => {
            var data = {}, lastSend = {}
            if(navigator.mediaSession.metadata == null) {
                data = {
                    playing: false,
                    metadata: null
                };
                if(lastSend != data) {
                    ipcRenderer.send("asynchronous-message", data);
                }
                lastSend = data;
            }
            else {
                data = {
                    playing: (navigator.mediaSession.playbackState == "playing"),
                    duration: Math.floor(Date.now()) + Math.floor((document.getElementsByTagName("video")[0].duration - document.getElementsByTagName("video")[0].currentTime)*1000),
                    metadata: {
                        title: navigator.mediaSession.metadata.title,
                        artist: navigator.mediaSession.metadata.artist,
                        artwork: navigator.mediaSession.metadata.artwork.at(-1).src
                    }
                };
                if(lastSend != data) {
                    ipcRenderer.send("asynchronous-message", data);
                }
                lastSend = data;
            }
        }, 5000)
    }
})