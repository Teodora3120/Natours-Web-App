const { error } = require("console")
const fs = require("fs")
const server = require("http").createServer()

server.on("request", (req, res) => {
    // Sol 1
    // fs.readFile("test-file.txt", (err, data) => {
    //     if (err) {
    //         console.log(err)
    //     }
    //     res.end(data)
    // })

    // Sol 2: Streams

    // const readable = fs.createReadStream("tesssst-file.txt")
    // readable.on('data', (chuck) => {
    //     res.write(chuck)
    // })
    // readable.on("end", (req, res) => {
    //     res.end()
    // })

    // readable.on("error", (err) => {
    //     console.log(err)
    //     res.statusCode = 500;
    //     res.end("File Not Found!")
    // })


    // Sol 2: Streams with pipe
    const readable = fs.createReadStream("test-file.txt")
    readable.pipe(res)

})


server.listen(5000, "127.0.0.1", () => {
    console.log(`Server is running on port 5000.`)
})