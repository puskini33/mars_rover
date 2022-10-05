// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root)
})

// listening for clicks event and checked if it happens on one of the Rover's Name
document.body.addEventListener( 'click', async function ( event ) {
    let roverName;
    if ( event.target.id === 'box-Curiosity' ) {
        roverName = "curiosity";
      }
    else if ( event.target.id === 'box-Spirit' ) {
        roverName = "spirit";
      }
    else if ( event.target.id === 'box-Opportunity' ) {
        roverName = "opportunity";
      }
    else if ( event.target.id === 'box-Perseverance' ) {
        roverName = "perseverance";
      }

    const result = await RoverDetail(roverName);

    // Delete the element's text before filling it again with text
    document.getElementById("detail-container").innerHTML = "";
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
    document.getElementById("detail-container").insertAdjacentHTML('beforeend', result)

} );

// get root node
const root = document.getElementById('root')

const render = async (root) => {
    root.innerHTML = await App()
}

// create first-page content
const App = async () => {
    return `${await Rovers(AnchorElementForRoverName)}`
}


// UTILS
const AnchorElementForRoverName =  (roverName, index) => {
    return `<div><a id="box-${roverName}" href="#${roverName}">${roverName}</a></div>`
}

const ImgElementForRoverPhoto =  (imageSrc, roverName, index) => {
    return `<img src="${imageSrc}" alt="${roverName}${index}">`
}

// COMPONENTS

// higher-order function I that is reusable UI elements because it takes as parameter html_builder function and calls it inside
const Rovers = async (html_builder) => {

    const roverNames = await getRoversNames();
    const JSRoverNames = roverNames.toJS()

    let options = "";
    for (let i=0; i< JSRoverNames.length; i++ ) {
        const option = html_builder(JSRoverNames[i], i)
        options = options + option
    }
    // A selection bar for the user to choose which rover's information they want to see
    return `
    <div id="grid-container">
        ${options}
    </div>
    <div id="detail-container"></div>
    `
}

const RoverDetail = async (roverName) => {
    // At least one dynamic component on their page (for instance, one that uses an if statement to behave differently based on the presence or absence of a value).
    // This if block will be necessary in case the information from API about roverName and earthDate were not given because the API changed how it returns responses and the values it contains.
    if (!roverName ) {
        alert("The rover name was not correctly set.")
        return
    }

    const fetchedRoverDetail = await getRoverDetail(roverName)
    // The launch date, landing date, name and status along with any other information about the rover
    const fetchedRoverName = fetchedRoverDetail.get("name")
    const fetchedRoverStatus = fetchedRoverDetail.get("status")
    const fetchedRoverLaunchDate = fetchedRoverDetail.get("launch_date")
    const fetchedRoverLandingDate = fetchedRoverDetail.get("landing_date")
    const fetchedRoverDateLastPhotos = fetchedRoverDetail.get("max_date")

    // A gallery of the most recent images sent from each Mars rover
    const fetchedRoverPhotos = await RoverPhotos(fetchedRoverName, fetchedRoverDateLastPhotos, ImgElementForRoverPhoto)

    return `<div id="fetchedRover">
        <h1>Mars Rover ${fetchedRoverName}</h1>
        <p>Rover Status is ${fetchedRoverStatus}</p>
        <p>The Rover launched on ${fetchedRoverLaunchDate}</p>
        <p>The Rover landed on ${fetchedRoverLandingDate}</p>
        <p>The Rover did last photos on ${fetchedRoverDateLastPhotos}</p>
        ${fetchedRoverPhotos}
        </div>`

}

// higher-order function II that is reusable UI elements because it takes as parameter html_builder function and calls it inside
const RoverPhotos = async(roverName, earthDate, html_builder) => {
    // At least one dynamic component on their page (for instance, one that uses an if statement to behave differently based on the presence or absence of a value).
    // This if block will be necessary in case the information from API about roverName and earthDate were not given because the API changed how it returns responses and the values it contains.
    if (!earthDate ) {
        alert("The earth day was not correctly set.")
        return
    } else if (!roverName) {
        alert("The rover name was not correctly set.")
        return
    }
    const fetchedPhotos = await getRoverPhotosByEarthDate(roverName, earthDate)
    const JSFetchedPhotos = fetchedPhotos.toJS()

    let htmlPhotos = "";
    for (let i=0; i < JSFetchedPhotos.length; i++) {
        htmlPhotos = htmlPhotos + html_builder(JSFetchedPhotos[i], roverName, i)
    }
    return htmlPhotos

}

// Service API CALLS
async function getRoversNames () {
    try {
        const response = await fetch('http://localhost:3000/rovers')
            .then(res => res.json())
        return Immutable.List(response.rovers.rovers.map(rover => rover.name))
    } catch (err) {
        console.log('error', err)
    }
}

async function getRoverDetail (roverName) {
    try {
        const response = await fetch(`http://localhost:3000/rovers/${roverName}`)
            .then(res => res.json())
        // Get from the response only the details that are relevant for rover Detail
        return Immutable.Map(
            {
                name: response["photo_manifest"]["name"],
                status: response["photo_manifest"]["status"],
                landing_date: response["photo_manifest"]["landing_date"],
                launch_date: response["photo_manifest"]["launch_date"],
                max_date: response["photo_manifest"]["max_date"],
            })

    } catch (err) {
        console.log('error', err)
    }
}

async function getRoverPhotosByEarthDate(roverName, earthDate) {
    try {
        const response = await fetch(`http://localhost:3000/rovers/${roverName}/photos/${earthDate}`)
            .then(res => res.json())
        const photos = response.photos.map(photoLink => photoLink.img_src)
        return Immutable.List(photos)
    } catch (err) {
        console.log('error', err)
    }
}
