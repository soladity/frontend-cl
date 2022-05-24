import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import {
  getBloodstoneAddress,
  getBeastAddress,
  getWarriorAddress,
  getLegionAddress,
  getRewardPoolAddress,
  getMonsterAddress,
  getMarketplaceAddress,
  getFeeHandlerAddress,
  getBUSDAddress,
  getVRFAddress,
} from "../utils/addressHelpers";
import bloodstone from "../config/abis/bloodstone.json";
import beast from "../config/abis/beast.json";
import warrior from "../config/abis/warrior.json";
import legion from "../config/abis/legion.json";
import monster from "../config/abis/monster.json";
import rewardpool from "../config/abis/rewardpool.json";
import marketplace from "../config/abis/marketplace.json";
import getRpcUrls from "../utils/getRpcUrl";
import feehandler from "../config/abis/feehandler.json";
import busd from "../config/abis/busd.json";
import vrf from "../config/abis/vrf.json";

const RPC_URL = getRpcUrls.getRpcUrl();
const RPC_WS_URL = getRpcUrls.getRpcWsUrl();

const httpProvider = new Web3.providers.HttpProvider(RPC_URL, {
  timeout: 10000,
});

const eventProvider = new Web3.providers.WebsocketProvider(RPC_WS_URL, {
  timeout: 10000,
});

export const useWeb3 = () => {
  const { library } = useWeb3React();
  return new Web3(library.currentProvider || httpProvider);
};

const useContract = (abi, address) => {
  const { library } = useWeb3React();
  const web3 = new Web3(library.currentProvider || httpProvider);
  // const web3 = new Web3(httpProvider);
  return new web3.eth.Contract(abi, address);
};

const useContractForEvent = (abi, address) => {
  const web3 = new Web3(eventProvider);
  return new web3.eth.Contract(abi, address);
};

export const useBloodstone = () => {
  const abi = bloodstone.abi;
  return useContract(abi, getBloodstoneAddress());
};

export const useBeast = () => {
  const abi = beast.abi;
  return useContract(abi, getBeastAddress());
};

export const useWarrior = () => {
  const abi = warrior.abi;
  return useContract(abi, getWarriorAddress());
};

export const useLegion = () => {
  const abi = legion.abi;
  return useContract(abi, getLegionAddress());
};

export const useMonster = () => {
  const abi = monster.abi;
  return useContract(abi, getMonsterAddress());
};

export const useRewardPool = () => {
  const abi = rewardpool.abi;
  return useContract(abi, getRewardPoolAddress());
};

export const useMarketplace = () => {
  const abi = marketplace.abi;
  return useContract(abi, getMarketplaceAddress());
};

export const useFeeHandler = () => {
  const abi = feehandler.abi;
  return useContract(abi, getFeeHandlerAddress());
};

export const useBUSD = () => {
  const abi = busd.abi;
  return useContract(abi, getBUSDAddress());
};

export const useVRF = () => {
  const abi = vrf.abi;
  return useContract(abi, getVRFAddress());
};

export const useLegionEvent = () => {
  const abi = legion.abi;
  return useContractForEvent(abi, getLegionAddress());
};

export const useMarketplaceEvent = () => {
  const abi = marketplace.abi;
  return useContractForEvent(abi, getMarketplaceAddress());
};

export const useRewardPoolEvent = () => {
  const abi = rewardpool.abi;
  return useContractForEvent(abi, getRewardPoolAddress());
};
