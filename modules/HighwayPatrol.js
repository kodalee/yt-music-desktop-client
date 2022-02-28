const { session } = require("electron")
const Logger = require("./Logger")

module.exports = () => {
    const filter = {
        urls: ['*://*/*']
      }
      
      session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
        callback({ requestHeaders: details.requestHeaders })

        var reqURL = details.url.replace("https://", "external://").split("?").at(0)
        Logger.out(`[HighwayPatrol] ${details.resourceType} (${reqURL.replace(/(.{99})..+/, "$1&hellip;")})`)
      })
}