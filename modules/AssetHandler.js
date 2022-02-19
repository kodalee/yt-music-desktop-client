const axios = require("axios").default;

module.exports = (artwork) => {
    return axios({
        url: "https://koda.life/uploadAsset.php",
        data: "url="+encodeURIComponent(artwork.split("=")[0]+"=w512-h512-l90-rj"),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    })
}