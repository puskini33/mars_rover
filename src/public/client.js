
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
            </section>
        </main>
        <footer></footer>
    `
}

// ${await ImageOfTheDay(state, apod)}
// UTILS
const SelectionItemForRoverName =  (roverName, roverId) => {
    return `<option value=${roverId}>${roverName}</option>`
}


// COMPONENTS
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
