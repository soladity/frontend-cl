import blst from "../constants/abis/BLST.json";
import busd from "../constants/abis/busd.json";
import cga from "../constants/abis/CGA.json";
import gamegovernancetoken from "../constants/abis/GameGovernanceToken.json";
import pancakeswaprouter from "../constants/abis/PancakeSwapRouter.json";

import beast from "../constants/abis/BeastNFT.json";
import feehandler from "../constants/abis/FeeHandler.json";
import legion from "../constants/abis/LegionNFT.json";
import marketplace from "../constants/abis/Marketplace.json";
import monster from "../constants/abis/Monster.json";
import vrfv2consumer from "../constants/abis/VRFv2Consumer.json";
import warrior from "../constants/abis/WarriorNFT.json";
import rewardpool from "../constants/abis/RewardPool.json";
import referralsystem from "../constants/abis/ReferralSystem.json";
import duelsystem from "../constants/abis/DuelSystem.json";
import gameaccess from "../constants/abis/GameAccess.json";

export const getBloodstoneAbi = () => {
  return blst;
};

export const getBUSDAbi = () => {
  return busd;
};

export const getCGAAbi = () => {
  return cga;
};

export const getGameGovernanceTokenAbi = () => {
  return gamegovernancetoken;
};

export const getPancakeSwapRouterAbi = () => {
  return pancakeswaprouter;
};

export const getBeastAbi = () => {
  return beast;
};

export const getWarriorAbi = () => {
  return warrior;
};

export const getLegionAbi = () => {
  return legion;
};

export const getMonsterAbi = () => {
  return monster;
};

export const getRewardPoolAbi = () => {
  return rewardpool;
};

export const getMarketplaceAbi = () => {
  return marketplace;
};

export const getFeeHandlerAbi = () => {
  return feehandler;
};

export const getVRFAbi = () => {
  return vrfv2consumer;
};

export const getReferralSystemAbi = () => {
  return referralsystem;
};

export const getDuelSystemAbi = () => {
  return duelsystem;
};

export const getGameAccessAbi = () => {
  return gameaccess;
};
