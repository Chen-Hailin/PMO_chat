# NESIMS-PMO

A PMO subsystem that enables real-time communication between CMO and PMO.

## Use Guide

### Prerequisite

ubuntu 16+
nodejs version 8.8.1+
npm version 5.4.2+
mongodb

### Install node dependencies
* cd to root directory `PMO_chat`
* run `npm install`

### Setting up MongoDB

Note: MongoDB need to be set up and running. [Installation instructions](https://docs.mongodb.org/manual/installation/)

Once you've installed MongoDB start up the MongoDB server in a new terminal with the following commands:

```
mkdir db
mongod --dbpath=./db --smallfiles
```

To manage the database, open a new terminal and type in `mongo` and type in `use chat_dev`

### Run Locally

```
npm run dev
```
And then point browser to `localhost:3000` (`127.0.0.1:3000`)

The online version is temporarily available on 13.228.200.19

