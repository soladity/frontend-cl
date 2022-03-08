import address from "./constants";
export const getBloodstoneAddress = () => {
  return address.blood[process.env.REACT_APP_CHAIN_ID];
};

export const getBeastAddress = () => {
  return address.beast[process.env.REACT_APP_CHAIN_ID];
};

export const getWarriorAddress = () => {
  return address.warrior[process.env.REACT_APP_CHAIN_ID];
};

export const getLegionAddress = () => {
  return address.legion[process.env.REACT_APP_CHAIN_ID];
};

export const getMonsterAddress = () => {
  return address.legion[process.env.REACT_APP_CHAIN_ID];
};

export const getRewardPoolAddress = () => {
  return address.rewardPool[process.env.REACT_APP_CHAIN_ID];
};

export const getMarketplaceAddress = () => {
  return address.marketplace[process.env.REACT_APP_CHAIN_ID];
};

export const getFeeHandlerAddress = () => {
  return address.feeHandler[process.env.REACT_APP_CHAIN_ID];
};
