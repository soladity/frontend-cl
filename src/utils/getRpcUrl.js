const getRpcUrl = () => {
  return "https://bsc-dataseed.binance.org/";
  // return "https://data-seed-prebsc-1-s1.binance.org:8545/";
};

const getRpcWsUrl = () => {
  return "wss://speedy-nodes-nyc.moralis.io/6a447a818bd3304f39a41940/bsc/mainnet/ws";
  // return "wss://bsc-ws-node.nariox.org:443";
  // return "wss://speedy-nodes-nyc.moralis.io/6a447a818bd3304f39a41940/bsc/testnet/ws";
};

export default {
  getRpcUrl,
  getRpcWsUrl,
};
