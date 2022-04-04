import { InjectedConnector } from "@web3-react/injected-connector";
import Web3 from "web3";

export const injected = new InjectedConnector({
  supportedChainIds: [parseInt(process.env.REACT_APP_CHAIN_ID)],
});

export const getLibrary = (provider) => new Web3(provider);
