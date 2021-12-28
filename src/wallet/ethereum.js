export const ethereumConnect = () => window.ethereum.request({ method: 'eth_requestAccounts' });
export const isEthereumConnected = window.ethereum.isConnected();
export const isEthereumMetaMask = window.ethereum.isMetaMask;
export const ethereumSendTransaction = (params) => window.ethereum.request({
    method: 'eth_sendTransaction',
    params
});