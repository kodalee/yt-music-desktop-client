const fs = require("fs"), target = "dist/";


console.log(`attempting to clean up the ${target} folder...`)

fs.rmdir(target, {recursive: true, force: true}, (err) => {
    if (err) {
        console.error(`failed to clean up ${target}... more details should be in the thrown stack trace`)
        throw err;
    };
    console.log(`succesfully cleaned up the ${target} folder. you may now build the app`)
})
