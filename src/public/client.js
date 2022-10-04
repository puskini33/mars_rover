let store = Immutable.Map({
    user: { name: "Student" },
    apod: { image: '' },
    rovers: [],

})

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (state, newState) => {
    return state.merge(newState)
}

const render = async (root, state) => {
    root.innerHTML = await App(state)
}


// create content
const App = async (state) => {
    const apod = state.get("apod")
    const rovers = state.get("rovers")
    const user = state.get("user").name

    return `
        <header></header>
        <main>
            <section>
                ${await Rovers(rovers)}
                ${await RoverDetail("curiosity")}
                ${await RoverDetail("opportunity")}
                ${await RoverDetail("spirit")}
                ${await RoverDetail("perseverance")}
                ${await RoverPhotos("opportunity", "2018-06-11")}
                
            </section>
        </main>
        <footer></footer>
    `
}


// UTILS
const SelectionItemForRoverName =  (roverName, roverId) => {
    return `<option value=${roverId}>${roverName}</option>`
}


// COMPONENTS
const RoverPhotos = async(roverName, earthDate) => {
    const fetchedPhotos = await getRoverPhotosByEarthDate(roverName, earthDate)
    return fetchedPhotos.toJS()
}
const RoverDetail = async (roverName) => {
    const fetchedRoverDetail = await getRoverDetail(roverName)
    // Return Immutable.Map object
    return fetchedRoverDetail

}
const Rovers = async (roversNames) => {
    let updatedData = roversNames;

    // if there are no rovers_names, fetch them
    if (updatedData.length === 0) {
        const immutableData = await getRoversNames();
        updatedData = immutableData.toJS()
    }

    // TODO: make from for loop a recursive function
    let options = "";
    for (let i=0; i< updatedData.length; i++ ) {
        const option = SelectionItemForRoverName(updatedData[i], i)
        options = options + option
    }

    return `
    <div>
     <select>
       <option value="0">Select Mars Rover:</option>
       ${options}  
     </select>
    </div>
    `
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
