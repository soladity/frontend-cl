export const getEaWarriorCnt = async (account, contract) => {
  let response = await contract.methods.getEaWarriorCnt(account).call();
  return response;
};

export const buyEA = async (account, count, contract) => {
  await contract.methods.buyEA(count).send({ from: account });
};

export const getBonusChance = async (account, attackPower, contract) => {
  let response = await contract.methods
    .getBonusChance(account, attackPower)
    .call();
  return Number(response);
};

export const checkEntryTicket = async (account, contract) => {
  let response = await contract.methods.checkEntryTicket(account).call();
  return response;
};

export const getBusdLimitPer6Hours = async (contract) => {
  let response = await contract.methods.busdLimitPer6Hours().call();
  return Number(response);
};

export const getEarlyAccessFeePerWarrior = async (contract) => {
  let response = await contract.methods.earlyAccessFeePerWarrior().call();
  return Number(response);
};

export const getPurchasedBusdInPeriod = async (contract) => {
  let response = await contract.methods.purchasedBusdInPeriod().call();
  return Number(response);
};

export const getFirstPurchaseTime = async (contract) => {
  let response = await contract.methods.firstPurchaseTime().call();
  return Number(response);
};

export const getEATurnOff = async (contract) => {
  let response = await contract.methods.eaTurnOff().call();
  return response;
};

export const getWalletToEAPurchased = async (contract, account) => {
  let response = await contract.methods.getWalletToEAPurchased(account).call();
  return response;
};

export const getEntryTicketUsdAmount = async (contract) => {
  let response = await contract.methods.entryTicketUsdAmount().call();
  return response;
};
