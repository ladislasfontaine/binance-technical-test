const { followAssetBalances } = require("./app/balance");
const { followEventTimeMetricsOnTrades } = require("./app/trade");

const runTasks = async () => {
  await followAssetBalances();
  await followEventTimeMetricsOnTrades();
};

runTasks();
