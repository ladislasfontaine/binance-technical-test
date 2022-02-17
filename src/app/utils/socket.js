const { WebSocket } = require("ws");

const constants = require("./constants");
const { printMessage } = require("./print");
const { makeRequest } = require("./request");

const options = {
  hostname: constants.SPOT_TESTNET_URL,
  port: 443,
  path: "/api/v3/userDataStream",
  method: "GET",
  headers: {
    "X-MBX-APIKEY": constants.SPOT_TESTNET_API_KEY,
  },
};
let retry = false;

const openSocket = (url, callback) => {
  try {
    const connection = new WebSocket(url);

    connection.on("open", () => {
      printMessage(`SOCKET OPEN (${url})`);
      retry = false;
    });

    connection.on("message", (event) => {
      callback(event);
    });

    connection.on("close", () => {
      printMessage(`SOCKET CLOSED (${url})`);
      if (!retry) {
        retry = true;
        setTimeout(() => {
          openSocket(url, callback);
        }, 1000);
      }
    });

    connection.on("error", (error) => {
      printMessage(`SOCKET ERROR (${url}): ${error}`);
    });

    connection.on("ping", () => {
      connection.pong();
    });
  } catch (error) {
    console.error(`Error on openSocket: ${error}`);
  }
};

const openStream = async () => {
  try {
    const listenKey = await makeRequest({
      ...options,
      method: "POST",
    });
    return listenKey;
  } catch (error) {
    console.error(`Error on openStream: ${error}`);
  }
};

const pingStream = async (listenKey) => {
  try {
    await makeRequest({
      ...options,
      method: "PUT",
      path: `${options.path}?listenKey=${listenKey}`,
    });
  } catch (error) {
    console.error(`Error on pingStream: ${error}`);
  }
};

const closeStream = async (listenKey) => {
  try {
    await makeRequest({
      ...options,
      method: "DELETE",
      path: `${options.path}?listenKey=${listenKey}`,
    });
  } catch (error) {
    console.error(`Error on closeStream: ${error}`);
  }
};

module.exports = {
  openSocket,
  openStream,
  pingStream,
  closeStream,
};
