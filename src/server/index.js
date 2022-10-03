require('dotenv').config()
const express = require('express')
// body-parser parses request bodies before handlers
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

// express = minimalistic web application framework
const app = express()
const port = 3000
// only parses requests whose Content-Type header is urlencoded and transforms them into variables
// extended: false -- the body will contain only strings
app.use(bodyParser.urlencoded({ extended: false }))
// only parses requests whose Content-Type header is json and transforms them into variables
app.use(bodyParser.json())

// Serve static files with express mounted to a specific url
app.use("/", express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

// Start server and listen on port
app.listen(port, () => console.log(`Example app listening on port ${port}!`))