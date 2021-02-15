# Exercise Tracker

This project is my solution for [APIs and Microservices Projects - Exercise
Tracker] and it's a part of APIs and Microservices Certification by
[freeCodeCamp].

## Requirements

✅ You can `POST` to `/api/exercise/new-user` with form data `username` to
create a new user. The returned response will be an object with `username` and
`_id` properties.

✅ You can make a `GET` request to `api/exercise/users` to get an array of all
users. Each element in the array is an object containing a user's `username` and
`_id`.

✅ You can `POST` to `/api/exercise/add` with form data `userId=_id`,
`description`, `duration`, and optionally `date`. If no date is supplied, the
current date will be used. The response returned will be the user object with
the exercise fields added.

✅ You can make a `GET` request to `/api/exercise/log` with a parameter of
`userId=_id` to retrieve a full exercise log of any user. The returned response
will be the user object with a `log` array of all the exercises added. Each log
item has the `description`, `duration`, and `date` properties.

✅ A request to a user's log (`/api/exercise/log`) returns an object with a
`count` property representing the number of exercises returned.

✅ You can add `from`, `to` and `limit` parameters to a `/api/exercise/log`
request to retrieve part of the log of any user. `from` and `to` are dates in
`yyyy-mm-dd` format. `limit` is an integer of how many logs to send back.

[apis and microservices projects - exercise tracker]:
  https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker
[freecodecamp]: https://www.freecodecamp.org/

## Installation

### Install dependencies

```bash
$ npm install
```

### Start the server

```bash
$ npm run dev
```
