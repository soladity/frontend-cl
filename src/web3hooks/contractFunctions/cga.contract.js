import gameConfig from "../../config/game.config";

const { approveGoverToken } = gameConfig;

export const getCGABalance = async (web3, contract, account) => {
  const res = await contract.methods.balanceOf(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const setCGAApprove = async (
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

export const getCGAAllowance = async (
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
