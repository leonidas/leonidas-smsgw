# Leonidas SMS gateway

## Features

* Provides a single integration point for whatever SMS service we will be using in the future
* Counts messages by customer (hierarchically, customers-of-customers supported to an arbitrary depth)

## Supported backends

Please submit further backends via pull requests.

* **Labyrintti/LINK Mobility**: Untested. Should become usable in early July 2017.
* **Mock**: Useful for testing.

## Getting Started

### Docker Compose

    docker-compose up

    alias dc-test="docker-compose -f docker-compose.test.yml up --exit-code-from=test"
    dc-test

### Manually

Have a Redis running on port 6379. All your base are belong to us.

    yarn install
    yarn start
    yarn test

## Configuration

Via environment variables. See [Config.ts](https://github.com/leonidas/leonidas-smsgw/blob/master/src/Config.ts).

## API

### POST `/api/v1/messages`

Body:

```json
{
    "customer": "leonidas.platform",
    "message": "Hello, World!",
    "recipients": ["+3585551235"],
    "sender": "+3585551234"
}
```

Successful response (`201 Created`):

```json
{
    "success": true,
    "recipients": [{
        "recipient": "+3585551235",
        "success": "true",
        "statusMessage": "1 message succesfully queued for sending"
    }]
}
```

### `/api/v1/users`

CRUD user management. See [users.test.ts](https://github.com/leonidas/leonidas-smsgw/blob/master/src/controllers/users.test.ts) until properly documented.

### GET `/metrics`

Response:

```
# HELP smsgw_messages Sent SMS messages by customer
# TYPE smsgw_messages counter
smsgw_messages{customer0="leonidas"} 0
```

## TODO

### Untyped packages

Write type wrappers or get rid of.

* [ ] `winston-console-formatter`
* [ ] `koa-request-logger`
* [ ] `fluent-logger`
