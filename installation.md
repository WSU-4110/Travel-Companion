## Installation/Development Instructions
These are some instructions to explain how to set up the repository for development.

### Prerequisite
- Verify that `node` is installed
  - Run `node --version` and verify that there is output. If not, install node for your system: https://nodejs.org/en

### Running the Web Server
- After installing node and cloning the repository, `cd` to the root of the project (where files such as `package.json` are located)
- Run `npm install`
- After successfully installing dependencies, run `npm run dev` to start the server
  - When running, there will be an output similar to `Local: http://localhost:5173`. If you go to the outputted link in a web browser, you will be able to see the website. Any changes made to the code will be automatically recompiled, so the website will update in real time.
