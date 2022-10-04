
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


// TODO: why is render async ? It works without async.
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
                ${await Rovers(state, rovers)}
                ${await RoverDetail(state, "curiosity")}
                ${await RoverDetail(state, "opportunity")}
                ${await RoverPhotos(state, "opportunity", "2018-06-11")}
                
            </section>
        </main>
        <footer></footer>
    `
}

// ${await RoverDetail(state, "persistence")} // TODO: this one throws an error!

// UTILS
const SelectionItemForRoverName =  (roverName, roverId) => {
    return `<option value=${roverId}>${roverName}</option>`
}


// COMPONENTS
const RoverPhotos = async(state, rover_name, earth_day) => {
    const fetchedPhotos = await getRoverRecentPhotos(rover_name, earth_day)
    return Immutable.Map(fetchedPhotos).get("photos")
}


const RoverDetail = async (state, rover) => {
    const fetchedRoverDetail = await getRoverDetail(rover)
    const oldRoverDetail = Immutable.Map({
        name: fetchedRoverDetail["photo_manifest"]["name"],
        status: fetchedRoverDetail["photo_manifest"]["status"],
        landing_date: fetchedRoverDetail["photo_manifest"]["landing_date"],
        launch_date: fetchedRoverDetail["photo_manifest"]["launch_date"],
        max_date: fetchedRoverDetail["photo_manifest"]["max_date"],
    })
    const roverDetail = Immutable.Map({
        name: "",
        status: "",
        landing_date: "",
        launch_date: "",
        max_date: ""
    })
    return roverDetail.merge(oldRoverDetail)

}
const Rovers = async (state, rovers) => {
    let updatedData = rovers;

    // if there are no rovers in the state, fetch them and update store
    if (updatedData.length === 0) {
        const data = await getRoversNames(state);
        const roversNames = data.rovers.rovers.map(rover => rover.name)
        updatedData =  updateStore(state, {rovers: roversNames}).get("rovers")
    }
    console.log("UpdatedData is: ", updatedData)
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

    // return updatedData

}

// Example of a pure function that renders information requested from the backend

const ImageOfTheDay = async (state, apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    let apodImage = apod.image
    // TODO: is it best practice to have Invalid Date here?

    if (!apodImage || apodImage.date === today.getDate() ) {
        apod = await getImageOfTheDay()
        // TODO: Do I still need to update this state ?
        apodImage = updateStore(state, {apod} ).get("apod").image
    }

    // TODO: check that the attribute media_type on apod is set correctly
    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apodImage.url}" height="350px" width="100%" />
            <p>${apodImage.explanation}</p>
        `)
    }
}


// API CALLS
async function getRoversNames (state) {
    try {
     const response = await fetch('http://localhost:3000/rovers')
     return response.json()
    } catch (err) {
        console.log('error', err)
    }
}

async function getRoverDetail (rover) {
    try {
        const response = await fetch(`http://localhost:3000/rovers/${rover}`)
        return response.json()
    } catch (err) {
        console.log('error', err)
    }
}

async function getRoverRecentPhotos(rover_name, earthDate) {
    try {
        const response = await fetch(`http://localhost:3000/rovers/${rover_name}/photos/${earthDate}`)
        return response.json()
    } catch (err) {
        console.log('error', err)
    }
}

// Example API call
const getImageOfTheDay = async () => {
    console.log("Getting Image of the Day.")
    try {
        const response = await fetch(`http://localhost:3000/apod`)
        return response.json()
    } catch(err) {
        console.log('error',err);
    }

    // TODO: what is with this undefined var data ?
    //return data
}
