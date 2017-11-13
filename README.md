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

At root directory,
```
npm run dev
```
And then point browser to `localhost:3000` (`127.0.0.1:3000`)

The online version is temporarily available on 13.228.200.19

## User Manual for Local Testing

* Once in the login page, click on the <!> sign next to username field to sign up an account
* Sign up two accounts with username 'cmo' and 'pmo' and login respectively in different browser windows to enable full functionality
* The main page has case list on the left, case report on the upper right with chat interface on the bottom right. Input the message to the text bar at the bottom then press 'Enter' to send a message.
* Login as CMO:
** In main page, click on the '+' on the left to create a new case.
** Enter the case id provided by CMO then click 'Retrieve Case' to pull the case from CMO server.
** Click 'create case' to create the case.
** Click 'UPDATE' if case need to be updated (new information available on CMO server).
** Note: the retrieve case and update case would not work if there is no case with the specified case id in CMO server
* Login as PMO:
** Newly created case shall be available.
** Click 'APPROVE' to approve the case. The approval would be withdrawn if case is updated.
** The CMO system would be notified upon approval.




