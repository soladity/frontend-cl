const testVersion = {
  chain: "testnet",
  chainID: process.env.REACT_APP_CHAIN_ID,
  chainIDHex: process.env.REACT_APP_CHAIN_ID_HEX,
  rpcUrl:
    "https://speedy-nodes-nyc.moralis.io/e205f98725c0bea218c8fdee/bsc/testnet",
  rpcWsUrl:
    "wss://speedy-nodes-nyc.moralis.io/e205f98725c0bea218c8fdee/bsc/testnet/ws",
  walletAddRpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
  blockExplorerUrls: ["https://testnet.bscscan.com/"],
  baseTimeToShowMonster25: new Date(2022, 5, 30),
  moralisServerUrl: "https://netrbr55ux1z.usemoralis.com:2053/server",
  moralisAppId: "CSvXskeOprb53MtwsP8BSWjCuxgY3PtFm3mYPCxk",
};

const mainVersion = {
  chain: "mainnet",
  chainID: process.env.REACT_APP_MAIN_CHAIN_ID,
  chainIDHex: process.env.REACT_APP_MAIN_CHAIN_ID_HEX,
  rpcUrl:
    "https://speedy-nodes-nyc.moralis.io/e205f98725c0bea218c8fdee/bsc/mainnet",
  rpcWsUrl:
    "wss://speedy-nodes-nyc.moralis.io/e205f98725c0bea218c8fdee/bsc/mainnet/ws",
  walletAddRpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com"],
  baseTimeToShowMonster25: new Date(2022, 5, 30),
  moralisServerUrl: "https://asnelzc98l6r.usemoralis.com:2053/server",
  moralisAppId: "B3QZWGHlngeYCi1tNJe5l6Kl0UnAx6E3hRCfVPL2",
};

// const gameVersion = testVersion;
const gameVersion = mainVersion;

export default gameVersion;
