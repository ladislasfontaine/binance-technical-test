# Binance Technical Test

## Prerequisites

- It must run on node.js (latest LTS version)
- A maximum of 2 external libraries are allowed (the less the better) (Sub-dependencies do not count here)
- No binance/crypto related libraries allowed
- SPOT testnet available at https://testnet.binance.vision
- SPOT mainnet available at https://www.binance.com
- SPOT documentation available at https://binance-docs.github.io/apidocs/spot/en/#change-log

## Tasks

- Log to console current non 0 asset balances available on the SPOT account (testnet)
- Open a single userData websocket (with all the requirement logic to keep the listenKey active)
- Keep your local asset balances state up to date based on the data coming from userData
- Log the asset balances again on every balance change
- Open 10 \*@trade websockets for the 10 pairs with the highest volume in the last 24h on the SPOT exchange (mainnet)
- Determinate the 10 pairs dynamically (no hard-coded pairs)
- Measure event time => client receive time latency and log (min/mean/max) to console every 1 minute

## Start program

- Add your `SPOT_TESTNET_API_KEY` and `SPOT_TESTNET_SECRET_KEY` in `src/app/utils/constants.js`
- `npm install`
- `npm run start`: will execute all the tasks

## Tests

`npm run test`

## Improvements

- add some more tests to check limits and wild cases
- run performance tests on some of the functions
- stop and clean connections/streams before exiting the program
- throw errors in some cases
- check function's parameters types
