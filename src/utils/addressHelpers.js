import address from "./contractAddresses";

import gameVersion from "./manageVersion";
console.log(gameVersion);

export const getBloodstoneAddress = () => {
  return address.blood[gameVersion.chainID];
};

export const getBeastAddress = () => {
  return address.beast[gameVersion.chainID];
};

export const getWarriorAddress = () => {
  return address.warrior[gameVersion.chainID];
};

export const getLegionAddress = () => {
  return address.legion[gameVersion.chainID];
};

export const getMonsterAddress = () => {
  return address.monster[gameVersion.chainID];
};

export const getRewardPoolAddress = () => {
  return address.rewardPool[gameVersion.chainID];
};

export const getMarketplaceAddress = () => {
  return address.marketplace[gameVersion.chainID];
};

export const getFeeHandlerAddress = () => {
  return address.feeHandler[gameVersion.chainID];
};

export const getBUSDAddress = () => {
  return address.busd[gameVersion.chainID];
};

export const getVRFAddress = () => {
  return address.vrf[gameVersion.chainID];
};
