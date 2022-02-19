module.exports = {
    out(...args) {
        var now = new Date()
        var seconds = now.getSeconds()
        if(seconds < 10) {
            seconds = "0"+seconds
        }
        console.log(`[${now.getHours()}:${now.getMinutes()}:${seconds}] ${args.join(" ")}`)
        return true
    }
}