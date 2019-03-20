# Senz Test

### Getting Started
Start by cloning the repository using: `git clone https://github.com/ImRaviTejaG/Senz-Test.git` followed by `cd Senz-Test`.

Install all the dependencies using the `npm install` or `npm i` command. Optionally, use the `--only=dev` flag to install developer dependencies only. Once the dependencies are installed, use `npm start` to start the server.

### Dependencies & Packages
- `body-parser`
- `cors`
- `express`
- `morgan`
- `openpgp`

Developer dependencies:
- `@babel/cli`
- `@babel/core` (Transpiling ES6 code for use with NodeJS)
- `@babel/present-env`
- `@babel/register`
- `chai` (Assertion)
- `mocha` (Testing)
- `nyc` (Test coverage)
- `request`
- `request-promise`
- `rimraf` (The UNIX rm -rf command for Node)
- `standard` (Linting)

### Running locally
#### The `.env` file
The `.env` file holds the important variables for the whole application which include the database URL, database port, application port, JWT Secret, etc.

**NOTE**: When running tests, make sure to point the `MONGO_DB_URL` at the test database in order to avoid garbage collection in the main database.

#### npm scripts
The `package.json` file contains five scripts for running locally: `linter`, `test`, `coverage`, `build`, `start`, and two for running on docker: `start-docker` and `stop-docker`.

- `"linter": "standard --fix"`

Runs the StandardJS linter along with the `--fix` flag, which lints code to a great extent. The traceback (if one shows up) is the list of errors that need to be fixed manually.

- `"test": "mocha --require @babel/register --timeout 5000 --exit"`

Runs **only** the tests.

- `"coverage": "nyc --reporter=text mocha --require @babel/register --timeout 5000 --exit"`

Runs the test coverage & shows up detailed report.

- `"build": "rimraf dist/ && babel ./ --out-dir dist/ --ignore ./node_modules,./.babelrc,./package.json,./npm-debug.log --copy-files"`

Builds the project.

- `"start": "npm run build && node dist/index.js --no-deprecation"`

First builds and then starts the server.

#### Running using Docker
To run using docker, use the `npm run start-docker` command. Stop using the `npm run stop-docker` command.

Running the `start-docker` npm script in turn runs the `scripts/dockerize.sh` script which creates a docker image using the `Dockerfile` and `docker-compose.yml`.

### API endpoints
#### 1. `/login`
```
Request type: POST
Data parameters: username, password
```

#### 2. `/signup`
```
Request type: POST
Data parameters: username, password
```

#### 3. `/jsonpatch`
```
Request type: PATCH
Data parameters: Body & Patch Object (as per JSON Patch specs)
Headers: x-jwt-token
```

#### 4. `/thumbnail`
```
Request type: POST
Data parameters: url
Headers: x-jwt-token
```