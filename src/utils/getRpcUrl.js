const getRpcUrl = () => {
  // return "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
  return "https://data-seed-prebsc-1-s1.binance.org:8545/";
};

const getRpcWsUrl = () => {
  return "wss://speedy-nodes-nyc.moralis.io/6a447a818bd3304f39a41940/bsc/testnet/ws";
};

export default {
  getRpcUrl,
  getRpcWsUrl,
};
