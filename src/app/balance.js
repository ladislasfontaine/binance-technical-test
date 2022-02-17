const constants = require("./utils/constants");
const { printMessage } = require("./utils/print");
const { makeRequest } = require("./utils/request");
const { createSignature } = require("./utils/sign");
const { openStream, openSocket, pingStream } = require("./utils/socket");

let localBalances = {};

const getInitialBalances = async () => {
  try {
    const ts = Date.now();
    const queryString = `timestamp=${ts}`;
    const signature = createSignature(queryString);
    const fullQueryString = `${queryString}&signature=${signature}`;

    const options = {
      hostname: constants.SPOT_TESTNET_URL,
      port: 443,
      path: `/api/v3/account?${fullQueryString}`,
      method: "GET",
      headers: {
        "X-MBX-APIKEY": constants.SPOT_TESTNET_API_KEY,
      },
    };

    const data = await makeRequest(options);
    const accountInformation = JSON.parse(data);
    for (const balance of accountInformation.balances) {
      localBalances[balance.asset] = {
        free: balance.free,
        locked: balance.locked,
      };
    }
    printMessage("INITIAL ASSET BALANCES");
    printAssetBalances();
  } catch (error) {
    console.error(`Error on getInitialBalances: ${error}`);
  }
};

const printAssetBalances = () => {
  for (const asset in localBalances) {
    const balance = localBalances[asset];
    if (parseFloat(balance.free) !== 0 || parseFloat(balance.locked) !== 0) {
      console.log(
        `${asset.padEnd(6)} free ${balance.free.padEnd(
          20
        )} locked ${balance.locked.padEnd(20)}`
      );
    }
  }
};

const updateLocalBalances = (currentBalances, changedBalances) => {
  try {
    let temporaryBalances = currentBalances;
    for (const balance of changedBalances) {
      temporaryBalances = {
        ...temporaryBalances,
        [balance.a]: {
          free: balance.f,
          locked: balance.l,
        },
      };
    }
    return temporaryBalances;
  } catch (error) {
    console.error(`Error on updateLocalBalances: ${error}`);
  }
};

const handleUserDataEvent = (e) => {
  try {
    const event = JSON.parse(e);

    if (event.e === "outboundAccountPosition") {
      localBalances = updateLocalBalances(localBalances, event.B);
      printMessage("UPDATE OF ASSET BALANCES");
      printAssetBalances();
    }
  } catch (error) {
    console.error(`Error on handleUserDataEvent: ${error}`);
  }
};

const getUpdatedBalances = async () => {
  try {
    const data = await openStream();
    const listenKey = JSON.parse(data).listenKey;
    if (!listenKey) {
      throw new Error("listenKey is undefined");
    }
    const baseUrl = constants.BINANCE_WEBSOCKET_TESTNET_URL;
    const path = `/ws/${listenKey}`;
    openSocket(baseUrl + path, handleUserDataEvent);

    setInterval(() => {
      pingStream(listenKey);
    }, 1000 * 60 * 30);
  } catch (error) {
    console.error(`Error on getUpdatedBalances: ${error}`);
  }
};

const followAssetBalances = async () => {
  await getInitialBalances();
  await getUpdatedBalances();
};

module.exports = {
  followAssetBalances,
  updateLocalBalances,
};
