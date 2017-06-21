# Leonidas SMS gateway

Counts messages per customer.

## Getting Started

### Docker Compose

    docker-compose up
    docker-compose -f docker-compose.test.yml up --exit-code-from=test

### Manually

Have a Redis running on port 6379. All your base are belong to us.

    yarn install
    yarn start
    yarn test

## TODO

### Untyped packages

Write type wrappers or get rid of.

* [ ] `winston-console-formatter`
* [ ] `koa-request-logger`
* [ ] `fluent-logger`
