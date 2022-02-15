const { default: axios } = require("axios");
const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
    if(window.location.href.includes("settings.html")) {
        ipcRenderer.on("loadSettings", (event, settings) => {
            document.getElementById("discordRichPresence").checked = settings.discordRpc.enabled
            document.getElementById("discordRichPresence_AlbumArtwork").checked = settings.discordRpc.albumArtwork
            document.getElementById("saveButton").onclick = () => {
                var structure = {
                    "discordRpc": {
                        enabled: document.getElementById("discordRichPresence").checked,
                        albumArtwork: document.getElementById("discordRichPresence_AlbumArtwork").checked
                    }
                }
                ipcRenderer.send("saveSettings", structure)
                ipcRenderer.on("saveSettings", () => {
                    document.body.style.opacity = 0;
                    setTimeout(() => {window.location = "splash.html"}, 1000)
                })
            }    
        })
        ipcRenderer.send("loadSettings", 0)
    }
    else if(window.location.href.includes("splash.html")){
        function appOpen() {
            if(document.getElementsByClassName("content-wrapper")[0].classList.contains("show-message")) {
                document.getElementsByClassName("content-wrapper")[0].classList.remove("show-message");
            }
            document.getElementsByTagName("h4")[0].innerHTML = "";
            document.getElementsByTagName("p").innerHTML = "";
            document.getElementsByClassName("content-wrapper")[0].classList.add("fadeOut")
            setInterval(() => {window.location = "https://music.youtube.com/";}, 1000);
        }

        var notices = [
            {a: "Connecting", b: "Please wait..."},
            {a: "Connecting", b: "We are having some troubles..."},
            {a: "Retrying", b: "Trying to connect..."},
            {a: "Retrying", b: "Checking again..."},
            {a: "Connection Issues", b: "Please make sure you are <br>connected to the internet before using YouTube Music"},
        ], tries = 0;

        function checkConnection(i, s) {
            axios({
                url: "https://koda.life/ping.php?i="+i,
                method: "GET"
            }).then(response => {
                var data = response.data;
                if(data.message == "pong" && data.integ == i) {
                    appOpen();
                }
                else {
                    if(s == true) {
                        document.getElementsByClassName("content-wrapper")[0].classList.add("show-message");
                        document.getElementsByTagName("h4")[0].innerHTML = notices[tries].a;
                        document.getElementsByTagName("p")[0].innerHTML = notices[tries].b;
                    }
                    tries++
                }
            }).catch(ex => {
                if(s == true) {
                    document.getElementsByClassName("content-wrapper")[0].classList.add("show-message");
                    document.getElementsByTagName("h4")[0].innerHTML = notices[tries].a;
                    document.getElementsByTagName("p")[0].innerHTML = notices[tries].b;
                }
                tries++
            })
        }
        setInterval(() => {
            checkConnection(Math.floor(Math.random() * 120309992), true);
        }, 7500)
        setTimeout(() => {
            checkConnection(Math.floor(Math.random() * 120309992), false);                
        }, 2000);

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
    
        ipcRenderer.on("action", (e, d) => {
            console.log(d)
            switch (d) {
                case 0:
                    document.getElementsByTagName("video")[0].play();
                    break;
                case 1:
                    document.getElementsByTagName("video")[0].pause();
                    break;
                default:
                    break;
            }
        })

        ipcRenderer.on("discordRpcNow", send_discord_rpc);
        function send_discord_rpc() {
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
        }
        setInterval(send_discord_rpc, 5000)
    }
})