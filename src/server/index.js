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
        const rovers = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send( {rovers} )
    } catch (err) {
        console.log('error: ', err);
    }

})

// https://api.nasa.gov/mars-photos/api/v1/rovers/?earth_date=2022-09-30&api_key=DEMO_KEY
// Get Information about rover
// https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?API_KEY=DEMO_KEY
// Get the list of photos from a rover
// https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?API_KEY=DEMO_KEY (.photos)
// Get specific photos by earth_day
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