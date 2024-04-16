# Travel-Companion
<img src="logo.png" alt="Travel Companion Logo" width="200"/>

A travel companion providing several tools designed to make traveling anywhere foreign and domestic easy for anyone.

### Translator
Travel-Companion features an on board translator utilizing DeepL's Translation API providing Accurate Text-to-Text translation for 20+ Languages.

### Itenerary Generator
Our Itenereary generator will be able to take a provided location (City,Country) and utilize AI to generate a Itenerary at a specified length for 
users to experience during their travels

### Currency Exchange
Travel-Companion has a currency exchange tool to quickly provide accurate exchange rates for 10+ Currencies

### Trip-Manager
Save plans, locations, translations, and more with our Trip-Manager feature. This allows for the encapsulation of all information associated
with any particular trip, future, past, or present. Access all your trip information quickly by simply selecting your trip from our Trip-Manager navigation bar.

### Maps Feature
Travel-Companion utilizes Google Maps API to provide accurate location data to the user at the press of a button.

### Weather Forecasting
Travel-Compaion utilizes OpenWeatherMap's API to generate a weather forecast for a specified location, Providing all information typically seen in a standard
weather forecast. 

# Development
## Development Instructions
These are some instructions to explain how to set up the repository for development.

### Prerequisite
- Verify that `node` is installed
  - Run `node --version` and verify that there is output. If not, install node for your system: https://nodejs.org/en

### Running the Web Server
- After installing node and cloning the repository, `cd` to the root of the project (where files such as `package.json` are located)
- Run `npm install`
- After successfully installing dependencies, run `npm run dev` to start the server
  - When running, there will be an output similar to `Local: http://localhost:5173`. If you go to the outputted link in a web browser, you will be able to see the website. Any changes made to the code will be automatically recompiled, so the website will update in real time.

### Running Tests
- After doing all of the installation instructions, run `npm run test` to run all test suites

### Framework
This project was developed using Vue.js
