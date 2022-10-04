let store = Immutable.Map({
    user: { name: "Student" },
    apod: { image: '' },
    rovers: [],

})

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

document.body.addEventListener( 'click', async function ( event ) {
    let roverName;
    if ( event.target.id === 'box-Curiosity' ) {
        console.log("Curiosity clicked!");
        roverName = "curiosity";
      }
    else if ( event.target.id === 'box-Spirit' ) {
        console.log("Spirit clicked!");
        roverName = "spirit";
      }
    else if ( event.target.id === 'box-Opportunity' ) {
        console.log("Opportunity clicked!");
        roverName = "opportunity";
      }
    else if ( event.target.id === 'box-Perseverance' ) {
        console.log("Perseverance clicked!");
        roverName = "perseverance";
      }

    const result = await RoverDetail(roverName);
    // Delete the element's text before filling it again with text
    document.getElementById("detail-container").innerHTML = "";
    document.getElementById("detail-container").insertAdjacentHTML('beforeend', result)

} );

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (state, newState) => {
    return state.merge(newState)
}

const render = async (root) => {
    root.innerHTML = await App()
}


// create content
const App = async () => {
    return `${await Rovers()}`
}


// UTILS
const BoxElementForRoverName =  (roverName, index) => {
    return `<div><a id="box-${roverName}">${roverName}</a></div>`
}

// ${await RoverDetail("curiosity")}
// ${await RoverDetail("opportunity")}
// ${await RoverDetail("spirit")}
// ${await RoverDetail("perseverance")}
// ${await RoverPhotos("opportunity", "2018-06-11")}


// COMPONENTS
const Rovers = async () => {

    const immutableData = await getRoversNames();
    const updatedData = immutableData.toJS()

    // TODO: make from for loop a recursive function
    let options = "";
    for (let i=0; i< updatedData.length; i++ ) {
        const option = BoxElementForRoverName(updatedData[i], i)
        options = options + option
    }

    return `
    <div id="grid-container">
        <div id="box-0"><a class="active" href="#home">Home</a></div>
        ${options}
    </div>
    <div id="detail-container"></div>
    `
}

const RoverDetail = async (roverName) => {
    // TODO: make sure that roverName is lowerCase
    const fetchedRoverDetail = await getRoverDetail(roverName)
    const fetchedRoverName = fetchedRoverDetail.get("name")
    const fetchedRoverStatus = fetchedRoverDetail.get("status")
    const fetchedRoverLaunchDate = fetchedRoverDetail.get("launch_date")
    const fetchedRoverLandingDate = fetchedRoverDetail.get("landing_date")
    const fetchedRoverDateLastPhotos = fetchedRoverDetail.get("max_date")

    // Return Immutable.Map object
    return `<div id="fetchedRover">
        <h1>Mars Rover ${fetchedRoverName}</h1>
        <p>Rover Status is ${fetchedRoverStatus}</p>
        <p>The Rover launched on ${fetchedRoverLaunchDate}</p>
        <p>The Rover landed on ${fetchedRoverLandingDate}</p>
        <p>The Rover did last photos on ${fetchedRoverDateLastPhotos}</p>
        </div>`
    // return fetchedRoverDetail

}

const RoverPhotos = async(roverName, earthDate) => {
    const fetchedPhotos = await getRoverPhotosByEarthDate(roverName, earthDate)
    return fetchedPhotos.toJS()
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
        return Immutable.List(response.photos)
    } catch (err) {
        console.log('error', err)
    }
}
