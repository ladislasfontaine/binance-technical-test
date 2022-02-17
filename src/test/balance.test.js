const assert = require("assert/strict");
const { updateLocalBalances } = require("../app/balance");

let localBalances = {};

describe("updateLocalBalances", () => {
  it("should add a new asset to the balance", () => {
    const balances = [
      {
        a: "ETH",
        f: "10000.000000",
        l: "1.000000",
      },
    ];
    localBalances = updateLocalBalances(localBalances, balances);
    assert.deepEqual(localBalances, {
      ETH: { free: "10000.000000", locked: "1.000000" },
    });
  });

  it("should update an asset in the balance", () => {
    const balances = [
      {
        a: "ETH",
        f: "0.000000",
        l: "112.000000",
      },
    ];
    localBalances = updateLocalBalances(localBalances, balances);
    assert.deepEqual(localBalances, {
      ETH: { free: "0.000000", locked: "112.000000" },
    });
  });

  it("should add multiple assets to the balance", () => {
    const balances = [
      {
        a: "BTC",
        f: "42.000000",
        l: "0.000000",
      },
      {
        a: "USDC",
        f: "123.000000",
        l: "3.000000",
      },
    ];
    localBalances = updateLocalBalances(localBalances, balances);
    assert.deepEqual(localBalances, {
      BTC: {
        free: "42.000000",
        locked: "0.000000",
      },
      USDC: {
        free: "123.000000",
        locked: "3.000000",
      },
      ETH: {
        free: "0.000000",
        locked: "112.000000",
      },
    });
  });
});
