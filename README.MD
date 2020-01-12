# coinminer

Coinminer is miner client for [coingame](https://github.com/TeskaLabs/coingame)

### Requirements

* `yarn --version` (it should be equal or greater than `0.24.6`)
* `node -v` (it should be equal or greater than `v10.0.0`)

### App setup

* `yarn install`
* `yarn start`

For tests you should run

* `yarn install`
* `yarn test`

### Environment variables

| Evironment variable       | Description                                                                         |
|---------------------------|-------------------------------------------------------------------------------------|
| SERVER_HOST               | Server host - example 'http://localhost'                                            |
| SERVER_PORT               | Server Port - example '8080'                                                        |
| MINER_NAME                | Miner name visible in score - example 'Peter'                                       |

### Run application in docker
```
docker build -t coinminer .

```