import gameConfig from "../config/game.config";
import gameAddress from "../constants/contractAddresses";

const gameVersion = gameConfig.version;

export const getBloodstoneAddress = () => {
  return gameAddress[gameVersion.version].blst;
};

export const getBUSDAddress = () => {
  return gameAddress[gameVersion.version].busd;
};

export const getCGAAddress = () => {
  return gameAddress[gameVersion.version].cga;
};

export const getGameGovernanceTokenAddress = () => {
  return gameAddress[gameVersion.version].gamegovernacetoken;
};

export const getPancakeSwapRouterAddress = () => {
  return gameAddress[gameVersion.version].pancakeswaprouter;
};

export const getBeastAddress = () => {
  return gameAddress[gameVersion.version].beast;
};

export const getWarriorAddress = () => {
  return gameAddress[gameVersion.version].warrior;
};

export const getLegionAddress = () => {
  return gameAddress[gameVersion.version].legion;
};

export const getMonsterAddress = () => {
  return gameAddress[gameVersion.version].monster;
};

export const getRewardPoolAddress = () => {
  return gameAddress[gameVersion.version].rewardpool;
};

export const getMarketplaceAddress = () => {
  return gameAddress[gameVersion.version].marketplace;
};

export const getFeeHandlerAddress = () => {
  return gameAddress[gameVersion.version].feehandler;
};

export const getVRFAddress = () => {
  return gameAddress[gameVersion.version].vrf;
};

export const getReferralSystemAddress = () => {
  return gameAddress[gameVersion.version].referralsystem;
};

export const getLiquidityPoolAddress = () => {
  return gameAddress[gameVersion.version].liquiditypool;
};

export const getDuelSystemAddress = () => {
  return gameAddress[gameVersion.version].duelsystem;
};

export const getGameAccessAddress = () => {
  return gameAddress[gameVersion.version].gameaccess;
};
