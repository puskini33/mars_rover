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

// process is a global var in node.js that provides access to node.js process; since it is not a global variable,
// it does not need to be imported.

// API CALLS to NASA API SERVER

// Get list of rovers'names
app.get('/rovers', async (req, res) => {
    try {
        const rovers = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send( {rovers} )
    } catch (err) {
        console.log('error: ', err);
    }

})

// Get Information about specific rover
app.get(`/rovers/:rover_name`, async (req, res) => {
    try {
        const manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${req.params.rover_name}?API_KEY=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send( manifest )
    } catch (err) {
        console.log('error: ', err);
    }

})

// Get the list of photos from a rover based on Earth Date
app.get(`/rovers/:roverName/photos/:earthDate`, async (req, res) => {
    try {
        const photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.roverName}/photos?earth_date=${req.params.earthDate}&API_KEY=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send( photos )
    } catch (err) {
        console.log('error: ', err);
    }

})

// Start server and listen on port
app.listen(port, () => console.log(`App listening on port ${port}!`))