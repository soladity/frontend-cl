import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import gameVersion from "../utils/manageVersion";

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

import beast from "../config/abis/beastnft.json";
import bloodstone from "../config/abis/bloodstone.json";
import busd from "../config/abis/busd.json";
import feehandler from "../config/abis/feehandler.json";
import legion from "../config/abis/legionnft.json";
import marketplace from "../config/abis/marketplace.json";
import monster from "../config/abis/monster.json";
import vrfv2consumer from "../config/abis/vrfv2consumer.json";
import warrior from "../config/abis/warriornft.json";
import rewardpool from "../config/abis/rewardpool.json";

const RPC_URL = gameVersion.rpcUrl;
const RPC_WS_URL = gameVersion.rpcWsUrl;

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
  return new web3.eth.Contract(abi, address);
};

const useContractForEvent = (abi, address) => {
  const web3 = new Web3(eventProvider);
  return new web3.eth.Contract(abi, address);
};

export const useBloodstone = () => {
  const abi = bloodstone;
  return useContract(abi, getBloodstoneAddress());
};

export const useBeast = () => {
  const abi = beast;
  return useContract(abi, getBeastAddress());
};

export const useWarrior = () => {
  const abi = warrior;
  return useContract(abi, getWarriorAddress());
};

export const useLegion = () => {
  const abi = legion;
  return useContract(abi, getLegionAddress());
};

export const useMonster = () => {
  const abi = monster;
  return useContract(abi, getMonsterAddress());
};

export const useRewardPool = () => {
  const abi = rewardpool;
  return useContract(abi, getRewardPoolAddress());
};

export const useMarketplace = () => {
  const abi = marketplace;
  return useContract(abi, getMarketplaceAddress());
};

export const useFeeHandler = () => {
  const abi = feehandler;
  return useContract(abi, getFeeHandlerAddress());
};

export const useBUSD = () => {
  const abi = busd;
  return useContract(abi, getBUSDAddress());
};

export const useVRF = () => {
  const abi = vrfv2consumer;
  return useContract(abi, getVRFAddress());
};

export const useLegionEvent = () => {
  const abi = legion;
  return useContractForEvent(abi, getLegionAddress());
};

export const useMarketplaceEvent = () => {
  const abi = marketplace;
  return useContractForEvent(abi, getMarketplaceAddress());
};

export const useRewardPoolEvent = () => {
  const abi = rewardpool;
  return useContractForEvent(abi, getRewardPoolAddress());
};
