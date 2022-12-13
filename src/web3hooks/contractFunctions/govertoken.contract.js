import gameConfig from "../../config/game.config";

const { approveGoverToken } = gameConfig;

export const getGoverTokenBalance = async (web3, contract, account) => {
  const res = await contract.methods.balanceOf(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const setGoverTokenApprove = async (
  web3,
  contract,
  approvalContract,
  account
) => {
  const res = await contract.methods
    .approve(
      approvalContract,
      web3.utils.toWei(approveGoverToken, "ether").toString()
    )
    .send({ from: account });
  return res;
};

export const getGoverTokenAllowance = async (
  web3,
  contract,
  approvalContract,
  account
) => {
  const response = await contract.methods
    .allowance(account, approvalContract)
    .call();
  return web3.utils.fromWei(response, "ether").toString();
};

export const depositGoverToken = async (web3, account, contract, amount) => {
  await contract.methods
    .deposit(web3.utils.toWei(amount.toString(), "ether").toString())
    .send({ from: account });
  return true;
};

export const withdrawGoverToken = async (web3, account, contract, amount) => {
  await contract.methods
    .withdraw(web3.utils.toWei(amount.toString(), "ether").toString())
    .send({ from: account });
  return true;
};

export const getNextWithdrawTime = async (account, contract) => {
  let response = await contract.methods.nextWithdrawTime(account).call();
  return response;
};
