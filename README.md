### Feedback
If you would like to provide feedback to this project, please do so as concrete as possible by pointing out exactly what is wrong along with the component name or code line. Ideas of what and how the code could be changed are encouraged.
I have decided to delete and not build my code based on ```store``` and use function ```updateStore``` because this would have forced me to change global state, thus not having only pure functions anymore.


# Functional Programming with Javascript 

## Mars Rover Project

### Big Picture
This Project is part of the Udacity Project Assignment for the Nanodegree Intermediate Javascript.
The project is a Mars rover dashboard that consumes the NASA API. User can select from the sidebar navigation menu,
which rover's information they want to view. Once they have selected a rover, they will be able to see the most recent 
images taken by that rover, as well as important information about the rover and its mission. Because the information is fetched live, it might take a while to see a response on the UI.

### Getting Started

1. Clone Repository
```git clone <repo-name>```

2. Install dependencies:
```yarn install```
**If you don’t have yarn installed globally, follow their installation documentation here according to your operating system: https://yarnpkg.com/lang/en/docs/install
3. Install javascript library ImmutableJS
Install immutable from the script tag in ```index.html```.
4. If you want to simply test the dashboard, just copy ```.env-sample``` to ```.env```.
5. If you want to get your own API_KEY:
   * You'll need a NASA developer API key in order to access the API endpoints. To do that, go here: https://api.nasa.gov/.
   * Copy the file ```.env-sample``` to one called `.env` and enter in your key.

6. To start the backend server run `yarn start` in your terminal and go to `http:localhost:3000` to check the app. When interacting with the app, please allow some time before display of information that the rover data is fetched from NASA Server.

### Project Requirements

To complete this project, your frontend code must:

- [ ] Use only pure functions
- [ ] Use at least 2 Higher Order Function
- [ X ] Use the array method `map`
- [ ] Use the ImmutableJS library

To complete this project, your backend code must:

- [ X ] Be built with Node/Express
- [ X ] Make successful calls to the NASA API
- [ ] Use pure functions to do any logic necessary
- [X] Hide any sensitive information from public view (In other words, use your dotenv file)
