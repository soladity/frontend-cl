import { fromWeiNum, toWeiStr } from "../../utils/utils";

export const getAmountsOut = async (contract, amount, path) => {
  let response = await contract.methods
    .getAmountsOut(toWeiStr(amount), path)
    .call();
  console.log(response);
  return fromWeiNum(response[1]);
};
