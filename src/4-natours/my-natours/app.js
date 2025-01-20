const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json()); // to be able to access the req.body

// app.get('/', (req, res) => {
//     res.status(200).json({ "message": "Hello" });
// })

// app.post('/', (req, res) => {
//     console.log(req)
//     res.send("You can post right here!");
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours: tours
        }
    })
})

app.post('/api/v1/tours', (req, res) => {
    // console.log(req.body)
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        if (err) {
            console.log(err)
        }
    })
    res.status(201).json({
        message: "success",
        data: {
            tour: newTour
        }
    })
})

const PORT = 5000;
app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server is listening on port ${PORT}`)
})