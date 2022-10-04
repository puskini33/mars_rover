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

// process is a global var in node.js that provides access to node.js process; since it is not a global variable, it does not need to be imported.
// your API calls
// Get list of rovers' names
app.get('/rovers', async (req, res) => {
    try {
        // TODO: try for the other fetch to put the whole thing in a const like here const rovers
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

// TODO: perhaps set earth day a query param
app.get(`/rovers/:roverName/photos/:earthDate`, async (req, res) => {
    console.log("EarthDate is: ", req.params.earthDate)
    try {
        const photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.roverName}/photos?earth_date=${req.params.earthDate}&API_KEY=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send( photos )
    } catch (err) {
        console.log('error: ', err);
    }

})

// Get the list of photos from a rover
// https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?API_KEY=DEMO_KEY (.photos)

// https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?earth_date=2010-03-21&api_key=DEMO_KEY




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