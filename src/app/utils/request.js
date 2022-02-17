const https = require("https");

const makeRequest = async (options) => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.on("data", (chunk) => {
        chunks.push(Buffer.from(chunk));
      });

      res.on("end", () => {
        resolve(Buffer.concat(chunks).toString("utf8"));
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
};

module.exports = {
  makeRequest,
};
