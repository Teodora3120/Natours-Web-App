const fs = require('fs')
const crypto = require('crypto')

setTimeout(() => { console.log("Timer 1 finished!") }, 0);
setImmediate(() => { console.log("Immediate called and finished!") })

const start = Date.now()
process.env.UV_THREADPOOL_SIZE = 1;

fs.readFile("test-file.txt", () => {
    console.log("I/O finished!")
    console.log("--------------------------")
    setTimeout(() => { console.log("Timer 2 finished!") }, 0);
    setTimeout(() => { console.log("Timer 3 finished!") }, 3000);
    setImmediate(() => { console.log("Immediate 2 called and finished!") })
    process.nextTick(() => {
        console.log("Next tick finished!")
    })
    crypto.pbkdf2("Teodorapass", 'salt', 100000, 1024, 'sha512', () => {
        console.log(
            Date.now() - start, "1: Password encrypted!"
        )
    })
    crypto.pbkdf2("Teodorapass!!!!", 'salt', 100000, 1024, 'sha512', () => {
        console.log(
            Date.now() - start, "2: Password encrypted!"
        )
    })
    crypto.pbkdf2("Teodorapass!!!!!!!!!!!!", 'salt', 100000, 1024, 'sha512', () => {
        console.log(
            Date.now() - start, "3: Password encrypted!"
        )
    })
    crypto.pbkdf2("Teodorapass!!!", 'salt', 100000, 1024, 'sha512', () => {
        console.log(
            Date.now() - start, "4: Password encrypted!"
        )
    })
})

console.log("Hello from the top-level code!")