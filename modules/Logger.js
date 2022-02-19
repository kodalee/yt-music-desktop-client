module.exports = {
    out(...args) {
        var now = new Date();
        console.log(`[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] ${args.join(" ")}`)
        return true
    }
}