const constants = require("./utils/constants");
const { printMessage } = require("./utils/print");
const { makeRequest } = require("./utils/request");
const { openSocket } = require("./utils/socket");

let lastMinuteEventLatencies = [];
let lastMinuteEventsCount = 0;

const ge24hrTickerPriceChangeStatistics = async () => {
  try {
    const options = {
      hostname: constants.SPOT_MAINNET_URL,
      port: 443,
      path: "/api/v3/ticker/24hr",
      method: "GET",
    };
    const data = await makeRequest(options);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error on const getTicket24hrData: ${error}`);
  }
};

const getHighestVolumePairs = (statistics, quantity) => {
  try {
    const pairs = statistics
      .sort(sortByHighestVolume)
      .map((pair) => pair.symbol);
    pairs.splice(quantity, pairs.length - quantity);

    return pairs;
  } catch (error) {
    console.error(`Error on getHighestVolumePairs: ${error}`);
  }
};

const sortByHighestVolume = (a, b) => {
  return parseFloat(a.volume) > parseFloat(b.volume) ? -1 : 1;
};

const handleTradeEvent = (e) => {
  try {
    const event = JSON.parse(e);
    const eventTime = event.data.E;
    const tradeTime = event.data.T;

    lastMinuteEventsCount += 1;
    lastMinuteEventLatencies.push(eventTime - tradeTime);
  } catch (error) {
    console.error(`Error on handleTradeEvent: ${error}`);
  }
};

const calculateEventsLatency = () => {
  try {
    setInterval(() => {
      const min = Math.min(...lastMinuteEventLatencies);
      const max = Math.max(...lastMinuteEventLatencies);
      const mean =
        lastMinuteEventLatencies.reduce((a, b) => a + b, 0) /
        lastMinuteEventLatencies.length;

      lastMinuteEventLatencies = [];
      printMessage(
        `EVENT TIME LATENCY (ms) | min ${min.toString().padEnd(3)} | max ${max
          .toString()
          .padEnd(3)} | mean ${mean} | trades count ${lastMinuteEventsCount}`
      );
      lastMinuteEventsCount = 0;
    }, 60000);
  } catch (error) {
    console.error(`Error on calculateEventsLatency: ${error}`);
  }
};

const followEventTimeMetricsOnTrades = async () => {
  try {
    const statistics = await ge24hrTickerPriceChangeStatistics();
    const pairs = getHighestVolumePairs(statistics, 10);
    const joinedPairs = pairs
      .map((pair) => pair + "@trade")
      .join("/")
      .toLowerCase();
    const baseUrl = constants.BINANCE_WEBSOCKET_URL;
    const path = `/stream?streams=${joinedPairs}`;

    calculateEventsLatency();
    openSocket(baseUrl + path, handleTradeEvent);
  } catch (error) {
    console.error(`Error on followEventTimeMetricsOnTrades: ${error}`);
  }
};

module.exports = {
  getHighestVolumePairs,
  followEventTimeMetricsOnTrades,
};
