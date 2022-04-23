const getRpcUrl = () => {
  // return "https://bsc-dataseed.binance.org/";
  // return "http://data-seed-pre-0-s1.binance.org:80";
  return "https://speedy-nodes-nyc.moralis.io/6a447a818bd3304f39a41940/bsc/testnet";
};

const getRpcWsUrl = () => {
  return "wss://speedy-nodes-nyc.moralis.io/6a447a818bd3304f39a41940/bsc/testnet/ws";
  // return "wss://bsc-ws-node.nariox.org:443";
};

export default {
  getRpcUrl,
  getRpcWsUrl,
};
