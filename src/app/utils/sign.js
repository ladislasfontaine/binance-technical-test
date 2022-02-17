const crypto = require("crypto");

const constants = require("./constants");

const createSignature = (queryString) => {
  const signature = crypto
    .createHmac("sha256", constants.SPOT_TESTNET_SECRET_KEY)
    .update(queryString)
    .digest("hex");

  return signature;
};

module.exports = {
  createSignature,
};
