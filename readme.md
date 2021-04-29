# Policy-based Blockchain selection Framework

This is a node.js based web application that allows to define policies for automated blockchain selection. This is an extended version of the framework developed in [[1]](#1), which allows it to be used with the ML-based BC selection solution found [here](https://github.com/Raybook90/ml_blockchain_selection).

## Development

### Set up with Docker

This project can either be set up and developed with docker or set up locally. Prerequisites for docker are a working
[docker](https://docs.docker.com/) installation and 
[docker-compose](https://docs.docker.com/compose/install/#install-compose). 
To develop it with docker, simply execute the `Configuration` portion of this readme and execute `docker-compose up`.

### Local installation (Alternative to Docker)

To start developing, please install [node.js](https://nodejs.org/en/) 
version > 10.x.x (LTS) and [mongodb](https://www.mongodb.com/).  
If you want to use hot re-loading, install nodemon globally: `npm install -g nodemon`
To get the static blockchain data that is stored in the db, 
import the data in the folder `/db-dump` into your mongodb instance. To do that execute 
`mongorestore --nsInclude policy-framework.*`

### Configuration

Before this application can be used, the following parameters have to be set as environment variables  
* `COINMARKETCAP_API_KEY`: Credentials used for making API calls to [Coinmarketcap](https://coinmarketcap.com/) 
* `DB_URL`: URL to the mongodb database (in case the provided docker configuration is used this would be 
`mongodb://mongo:27017/policy-framework`)
* `IP_address`: IPv4 address used for making API calls to the ML-based BC selection endpoint 

For local or docker usage, simply use the `.env.example` file, copy it and rename it to `.env`. 
Then set the corresponding values. As long as the application is started in dev mode, the application is going to search 
for values set in this file. For production usage the env variables have to be in the environment.  

```
    COINMARKETCAP_API_KEY= ""
    DB_URL= ""
    IP_address= ""
```

### Testing

* `npm test`: Runs test-cases which create some transactions via the API. Needs predefined user and policy

### Run server

* `npm run devstart`: Start application in debug mode with nodemon (port: 3000, remote debug port: 3001)
* `npm start`: Start application in production mode

## Usage

In order to use the framework with the ML-based BC Selection solution, make sure the [Flask application](https://github.com/Raybook90/ml_blockchain_selection) is installed and running.

The policy-based BC selection framework consists of two different components. Entering http://localhost:3000 into your browser leads to a 
web application which allows the creation of user policies. As soon as policies have been defined, data can be passed to 
the `/api/create-transactions` endpoint via a HTTP POST-request. The resulting response consists of an array of objects 
which include the data to be sent to the blockchain, including the corresponding blockchain the data should be sent to 
according to the defined policies. 

## References
<a id="1">[1]</a> 
Lakic, D. (2019). 
Design and Implementation of a Policy-based Blockchain Selection Framework. 
Master's thesis, Zürich, Switzerland.
