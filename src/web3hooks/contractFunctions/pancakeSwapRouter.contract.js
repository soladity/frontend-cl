import { fromWeiNum, toWeiStr } from "../../utils/utils";

export const getAmountsIn = async (contract, amount, path) => {
  if (amount == 0 || amount == "0") return 0;
  let response = await contract.methods
    .getAmountsOut(toWeiStr(amount), path)
    .call();
  return fromWeiNum(response[0]);
};

export const getAmountsOut = async (contract, amount, path) => {
  if (amount == 0 || amount == "0") return 0;
  let response = await contract.methods
    .getAmountsOut(toWeiStr(amount), path)
    .call();
  return fromWeiNum(response[1]);
};
