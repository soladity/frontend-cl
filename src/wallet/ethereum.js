export const ethereumConnect = () =>
  window.ethereum.request({ method: "eth_requestAccounts" });
export const isEthereumConnected = window.ethereum
  ? window.ethereum.isConnected()
  : false;
export const isEthereumMetaMask = window.ethereum
  ? window.ethereum.isMetaMask
  : null;
export const ethereumSendTransaction = (params) =>
  window.ethereum.request({
    method: "eth_sendTransaction",
    params,
  });
export const switchNetwork = () =>
  window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: process.env.REACT_APP_CHAIN_ID_HEX }], // testnet // mainnet
  });

// export const addNetwork = () =>
//   window.ethereum
//     .request({
//       method: "wallet_addEthereumChain",
//       params: [
//         {
//           chainId: process.env.REACT_APP_MAIN_CHAIN_ID_HEX,
//           chainName: "Binance Smart Chain",
//           nativeCurrency: {
//             name: "Binance Coin",
//             symbol: "BNB",
//             decimals: 18,
//           },
//           rpcUrls: [rpcUrls.getRpcUrl()],
//           blockExplorerUrls: ["https://bscscan.com"],
//         },
//       ],
//     })
//     .catch((error) => {
//       console.log(error);
//     });

export const addNetwork = () =>
  window.ethereum
    .request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: process.env.REACT_APP_CHAIN_ID_HEX,
          chainName: "Binance Smart Chain Testnet",
          nativeCurrency: {
            name: "Binance Coin",
            symbol: "BNB",
            decimals: 18,
          },
          rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
          blockExplorerUrls: ["https://testnet.bscscan.com/"],
        },
      ],
    })
    .catch((error) => {});
