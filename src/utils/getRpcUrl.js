const getRpcUrl = () => {
  // return "https://bsc-dataseed.binance.org/";
  // return "http://data-seed-pre-0-s1.binance.org:80";
  return "https://speedy-nodes-nyc.moralis.io/e205f98725c0bea218c8fdee/bsc/testnet";
};

const getRpcWsUrl = () => {
  return "wss://speedy-nodes-nyc.moralis.io/e205f98725c0bea218c8fdee/bsc/testnet/ws";
  // return "wss://bsc-ws-node.nariox.org:443";
};

export default {
  getRpcUrl,
  getRpcWsUrl,
};
