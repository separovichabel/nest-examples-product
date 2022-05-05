# Product API

## Pre-req
Docker and Docker Compose should be installed.

## Runnig the APP

```
docker-compose up 
```
## Swagger

[http://localhost:3000/swagger](http://localhost:3000/swagger)


## Dependencies installation to develop

```bash
$ yarn
```
## Setting up database to develop

```bash
# development
$ yarn db:setup
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```