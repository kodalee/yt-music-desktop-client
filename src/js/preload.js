if(window.location.href.includes("error.html")) return

const { default: axios } = require("axios");
const { ipcRenderer } = require("electron");
const AppInfo = require("../../modules/AppInfo.js");
const Logger = require("../../modules/Logger.js");
const SettingsManager = require("../../modules/SettingsManager.js")


window.addEventListener("DOMContentLoaded", () => {
    ipcRenderer.on("logger-out", (e, a) => {
        if(document.querySelector("verbose")) {
            var verboses = document.querySelector("verbose")
            verboses.innerHTML = "<br>"+Logger.getLogs().join("<br>")
        }
        else {
            var VERBOSE_STYL = document.createElement("style")
            VERBOSE_STYL.innerHTML = `
                v-alert{transition: 1s;color: white;}
                verbose,v-alert{position: fixed;font-family: monospace!important;color: rgba(255, 255, 255, 0.6);font-size: 10px;pointer-events: none;z-index: 999;background-color: rgba(0, 0, 0, 0.6);text-overflow: }
                verbose::before {content: "ELECTRON LOGS | The purpose of this is to disect any errors in the binary build of YTMusic";color: white;}
            `
            document.body.appendChild(VERBOSE_STYL)

            var ALERT_ELEM = document.createElement("v-alert")
            ALERT_ELEM.innerHTML = "To toggle the Electron Logs, press GRAVE on your keyboard."
            setTimeout(() => {ALERT_ELEM.style.opacity = 0; ALERT_ELEM.style.color = "black"}, 5000)
            setTimeout(() => {ALERT_ELEM.remove();}, 6000)
            document.body.prepend(ALERT_ELEM);


            var VERBOSE_ELEM = document.createElement("verbose")
            document.body.prepend(VERBOSE_ELEM)

            VERBOSE_ELEM.style.opacity = 0;

            window.addEventListener("keydown", (ev) => {
                if(ev.key == "`") {
                    if(VERBOSE_ELEM.style.opacity == 0) {
                        return VERBOSE_ELEM.style.opacity = 1
                    }
                    else {
                        return VERBOSE_ELEM.style.opacity = 0
                    }
                }
            })
        }
    })
    if(window.location.href.includes("release_of_liability.html")) {
        ipcRenderer.on("loadSettings", (event, settings) => {
            document.querySelector("#openSource").onclick = function() { require("electron").shell.openExternal("https://github.com/hellokoda/yt-music-desktop-client/")}
            document.querySelector("#acceptBtn").onclick = function() {
                settings["releaseOfLiabilityAccepted"] = true;
                ipcRenderer.send("saveSettings", settings)
                ipcRenderer.on("saveSettings", () => {
                    window.location = "splash.html"
                })
            }
            document.querySelector("#declineBtn").onclick = function() {
                window.close()
            }
        })
        ipcRenderer.send("loadSettings", 0)
    }
    else if(window.location.href.includes("settings.html")) {
        function draw_update() {
            inject__f.href = "https://fonts.googleapis.com/css2?family="+document.getElementById("personalization:font:family").value.split(' ').join('+')
            inject__s.innerHTML = `#font-preview-text{font-family:"${document.getElementById("personalization:font:family").value}"!important} /* Injected by yt-music-client. */`

            document.querySelector("[first_line]").innerHTML = ytm_placeholders(document.getElementById("discordRpc:look:first").value)
            document.querySelector("[second_line]").innerHTML = ytm_placeholders(document.getElementById("discordRpc:look:second").value)

            if(document.getElementById("discordRichPresence_AlbumArtwork").checked == true) {
                document.querySelector("[artwork]").src = "https://linkstorage.linkfire.com/medialinks/images/0fc4618f-6b21-44e4-aab4-0846d5f1246f/artwork-440x440.jpg"
            }
            else {
                document.querySelector("[artwork]").src = "img/icon@512.png"
            }

            var inv = document.createAttribute("invisible")
            if(document.getElementById("discordRpc:duration").checked == true) {
                if(document.querySelector("[duration]").attributes.getNamedItem("invisible") != null) {
                    document.querySelector("[duration]").attributes.removeNamedItem("invisible")
                }
            }
            else {
                document.querySelector("[duration]").attributes.setNamedItem(inv)
            }

        }

        function ytm_placeholders(input = "") {
            if (input == "") {
                input = "null"
            }

            input = input
            .split("{artist}").join("Fiko")
            .split("{song}").join("Waiting for You")
            .split("{at}").join("0:24")
            .split("{duration}").join("2:45")

            return input
        }

        var inject__f = document.createElement("link")
        var inject__s = document.createElement("style")
        document.body.appendChild(inject__f)
        document.body.appendChild(inject__s)


    
        if(SettingsManager.get().personalization.font.enabled == true) {
            inject__f.dataset["injectedby"] = "yt-music-client"
            inject__f.rel = "stylesheet"
            inject__f.href = "https://fonts.googleapis.com/css2?family="+SettingsManager.get().personalization.font.family.split(' ').join('+')
            inject__s.innerHTML = `#font-preview-text{font-family:"${SettingsManager.get().personalization.font.family}"!important} /* Injected by yt-music-client. */`
        }

        ipcRenderer.on("loadSettings", (event, settings) => {
            document.getElementById("personalization:font:enabled").onclick = function(){
                document.getElementById("personalization:font:family").disabled = !document.getElementById("personalization:font:enabled").checked
            }

            document.querySelectorAll("input").forEach((e) => {
                e.onchange = draw_update
                e.oninput = draw_update
            })

            document.getElementById("AdBlocker").checked = settings.AdBlocker.enabled
            document.getElementById("discordRichPresence").checked = settings.discordRpc.enabled
            document.getElementById("discordRichPresence_AlbumArtwork").checked = settings.discordRpc.albumArtwork

            document.getElementById("discordRpc:look:first").value = settings.discordRpc.look.first
            document.getElementById("discordRpc:look:second").value = settings.discordRpc.look.second
            document.getElementById("discordRpc:duration").checked = settings.discordRpc.duration

            document.getElementById("personalization:font:enabled").checked = settings.personalization.font.enabled
            document.getElementById("personalization:font:family").disabled = !settings.personalization.font.enabled
            document.getElementById("personalization:font:family").value = settings.personalization.font.family

            draw_update()

            document.getElementById("saveButton").onclick = () => {
                var structure = {
                    releaseOfLiabilityAccepted: true,
                    discordRpc: {
                        enabled: document.getElementById("discordRichPresence").checked,
                        albumArtwork: document.getElementById("discordRichPresence_AlbumArtwork").checked,
                        duration: document.getElementById("discordRpc:duration").checked,
                        look: {
                            first: document.getElementById("discordRpc:look:first").value,
                            second: document.getElementById("discordRpc:look:second").value
                        }
                    },
                    AdBlocker: {
                        enabled: document.getElementById("AdBlocker").checked
                    },
                    personalization: {
                        font: {
                            enabled: document.getElementById("personalization:font:enabled").checked,
                            family: document.getElementById("personalization:font:family").value
                        }
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
        ipcRenderer.on("loadSettings", (event, settings) => {
            if(settings.releaseOfLiabilityAccepted == false) {
                setInterval(() => {window.location = "release_of_liability.html";}, 3500);
            } else {
                setInterval(() => {window.location = "https://music.youtube.com/?desktop=true&chromeless=0&dark=1&utm_medium=github";}, 3500);
            }
        })
        ipcRenderer.send("loadSettings", 0)

        // function appOpen() {
        //     if(document.getElementsByClassName("content-wrapper")[0].classList.contains("show-message")) {
        //         document.getElementsByClassName("content-wrapper")[0].classList.remove("show-message");
        //     }
        //     document.getElementsByTagName("h4")[0].innerHTML = "";
        //     document.getElementsByTagName("p").innerHTML = "";
        //     document.getElementsByClassName("content-wrapper")[0].classList.add("fadeOut")
        //     setInterval(() => {window.location = "https://music.youtube.com/";}, 1000);
        // }

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
        // setInterval(() => {
        //     checkConnection(Math.floor(Math.random() * 120309992), true);
        // }, 7500)
        // setTimeout(() => {
        //     checkConnection(Math.floor(Math.random() * 120309992), false);                
        // }, 2000);

    } else if(window.location.href.startsWith("https://music.youtube")){
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

        document.body.style.opacity = 0;

        ipcRenderer.send("injectReady", {})
        ipcRenderer.on("inject", (e, d) => {
            function gather_app_info() {
                var app_info = `YouTube Music Desktop Client
                Created by Koda Lee
                Version: ${AppInfo.version}
                ${AppInfo.repo}\n\n`

                if(SettingsManager.get().personalization.font.enabled == true) {
                    app_info = app_info + `Font: Custom ("${SettingsManager.get().personalization.font.family}")\n`
                }
                else {
                    app_info = app_info + `Font: Default`
                }

                app_info = app_info + `DiscordRichPresence Enabled: ${SettingsManager.get().discordRpc.enabled}\n`
                
                return app_info
            }

            document.body.style.transition = "0.5s";
            var navs = document.getElementsByTagName("ytmusic-pivot-bar-item-renderer");

            for(let i=0;i<navs.length;i++) {
                var navt = navs[i]
                navt.onclick = () => {
                    document.getElementById("contents").style.transition = ".2s";
                    document.getElementById("contents").style.transform = "translateY(500px)";
                    document.getElementById("contents").style.opacity = 0;
                    setTimeout(() => {
                        document.getElementById("contents").style.transition = ".5s";
                        document.getElementById("contents").style.transform = "translateY(0px)";
                        document.getElementById("contents").style.opacity = 1;}, 1000)
                }
            }

            var settingsBarInjected = false
            document.querySelector("ytmusic-settings-button").onclick = function() {
                if(settingsBarInjected==true) return;
                setTimeout(() => {document.querySelector("ytd-multi-page-menu-renderer").appendChild(document.createRange().createContextualFragment(`
                    <div style="padding: 10px;text-align:center;background-color:#f00000;">
                        <h3>YT Music Desktop Client</h3><br>
                        <a style="color:white!important;cursor:pointer;" settings_lnk>Settings</a> | <a style="color:white!important;cursor:pointer;" nerds_lnk>Nerd Info</a>
                    </div>
                `));settingsBarInjected=true
                document.querySelector("[settings_lnk]").onclick = () => {
                    if(confirm("WARNING: Your music will be stopped when you open settings. Press OK to continue") == true) {
                        document.getElementsByTagName("video")[0].pause();
                        document.body.style.transition = "0.3s";
                        document.body.style.opacity = 0;
                        setTimeout(() => {
                            window.location = d.settings
                        }, 1000)    
                    }    
                }
                document.querySelector("[nerds_lnk]").onclick = () => {
                    alert(gather_app_info())
                }
            }, 100) 
            }

            // const para = document.createElement("ytmusic-pivot-bar-item-renderer");
            // para.classList.add("ytmusic-koda-settings", "ytmusic-pivot-bar-renderer", "style-scope")
            // para.innerHTML = `Settings`;
            // var settingsBtn = document.getElementsByTagName("ytmusic-pivot-bar-renderer")[0].appendChild(para)
    
            // settingsBtn.onclick = () => {
            // } 

            var requested_font = SettingsManager.get().personalization.font.family
            
            if(SettingsManager.get().personalization.font.enabled == true) {
                var inject__f = document.createElement("link")
                inject__f.dataset["injectedby"] = "yt-music-client"
                inject__f.rel = "stylesheet"
                inject__f.href = "https://fonts.googleapis.com/css2?family="+requested_font.split(' ').join('+')
                document.body.appendChild(inject__f)
                var inject__s = document.createElement("style")
                inject__s.innerHTML = `*{font-family:"${requested_font}"!important} /* Injected by yt-music-client. */`
                document.body.appendChild(inject__s)
            }

            document.body.style.opacity = 1;


            //WEBSOCKET FOR LISTENING PARTY CLIENT COMING SOON TM
            // var ws = new WebSocket("ws://localhost:8080/test");
            
            // ws.onmessage = event => {
            //     var data =JSON.parse(event.data)
            //     document.querySelector("video").pause()
            //     setTimeout(() => {
            //         if(event.)
            //         // anonymous function
            //         (function(){window.location = data.params[0]})()
            //     }, 200)}
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
        function get_video_duration() {
            var dirty = document.querySelector(".time-info").innerText.split(" / ")
            return {
                len: dirty[1],
                at: dirty[0]
            }
        }
        function duration_to_seconds(dur) {
            var split = dur.split(":")
            var minutes = split[0]
            var seconds = split[1]
        
            var duration = parseInt(seconds)
            for (let i = 0; i<minutes; i++) {
                duration = duration + 60
            }
        
            return duration
        }

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
                var duration = get_video_duration()
                data = {
                    playing: (navigator.mediaSession.playbackState == "playing"),
                    duration: Math.floor(
                        Date.now()) + Math.floor(
                                (duration_to_seconds(duration.len) - duration_to_seconds(duration.at)
                            )*1000
                        ),
                    rawDuration: get_video_duration(),
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
        // setInterval(send_discord_rpc, 1000)
    }
    else if(window.location.href.includes("error.html")) {
    }
    else if(window.location.href.includes("accounts.google.com")) {
        return
    }
    else {
        ipcRenderer.send("injectReady", {})
        ipcRenderer.on("inject", (e,d) => {
            window.location = d.error
        })
    }
})