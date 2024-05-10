const fs = require('fs');
const http = require('http')
const url = require('node:url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

// FILES THINGS

// // Sync
// const textInput = fs.readFileSync('./txt/input.txt', "utf-8")
// console.log(textInput)

// const textOut = `This is what I know about avocado: ${textInput}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log("File written.")

// // Async

// fs.readFile('./txt/start.xt', 'utf-8', (error, data1) => {
//     if (error) {
//         return console.log("FIRST FILE ERR")
//     }
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (error, data2) => {
//         fs.readFile(`./txt/append.txt`, 'utf-8', (error, data3) => {
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (error) => {
//                 console.log("Your file has been written.")
//             })
//         })
//     })
// })
// console.log("Will read before")


// SIMPLE WEB SERVER



const productData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
const templateProductCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const slugs = JSON.parse(productData).map(product => slugify(product.productName, { lower: true }))
console.log(slugs)
const server = http.createServer((req, res) => {
    const path = req.url;
    const { query, pathname } = url.parse(req.url, true)



    if (path === "/" || path === "/overview") {
        const cardsHTML = JSON.parse(productData).map((product) => {
            return replaceTemplate(templateProductCard, product)
        }).join();

        const tempOverview = templateOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHTML)

        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        res.end(tempOverview)
    }
    else if (pathname === "/product") {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        console.log(query)
        const productId = Number(query.id);

        const productJSON = JSON.parse(productData).filter(product => product.id === productId)
        console.log(productJSON)
        const productHTML = replaceTemplate(templateProduct, productJSON[0]);

        res.end(productHTML)
    } else if (path === "/api") {
        res.writeHead(200, {
            'Content-type': 'application/json'
        })
        res.end(productData)
    }
    else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end("<h1>Page not found</h1>")
    }
})
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})