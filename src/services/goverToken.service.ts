import Web3 from "web3";
import { toast } from "react-toastify";
import { Contract } from "web3-eth-contract";
import { updateGoverTokenState } from "../reducers/goverToken.reducer";
import { AppDispatch } from "../store";
import {
  getCGAAllowance,
  getCGABalance,
  setCGAApprove,
} from "../web3hooks/contractFunctions/cga.contract";
import {
  depositGoverToken,
  getGoverTokenAllowance,
  getGoverTokenBalance,
  getNextWithdrawTime,
  setGoverTokenApprove,
  withdrawGoverToken,
} from "../web3hooks/contractFunctions/govertoken.contract";
import {
  getBUSDAddress,
  getCGAAddress,
  getGameGovernanceTokenAddress,
} from "../web3hooks/getAddress";
import { getTranslation } from "../utils/utils";
import { getAmountsOut } from "../web3hooks/contractFunctions/pancakeSwapRouter.contract";
import { updateModalState } from "../reducers/modal.reducer";

const getCGAandGoverTokenBalance = async (
  dispatch: AppDispatch,
  web3: Web3,
  account: any,
  CGAContract: Contract,
  goverTokenContract: Contract,
  routerContract: Contract
) => {
  try {
    const CGABalance = Number(await getCGABalance(web3, CGAContract, account));
    const GoverTokenBalance = Number(
      await getGoverTokenBalance(web3, goverTokenContract, account)
    );
    const CGABalanceInBUSD = await getAmountsOut(routerContract, CGABalance, [
      getCGAAddress(),
      getBUSDAddress(),
    ]);
    const GoverTokenBalanceInBUSD = await getAmountsOut(
      routerContract,
      GoverTokenBalance,
      [getCGAAddress(), getBUSDAddress()]
    );
    dispatch(
      updateGoverTokenState({
        CGABalance,
        GoverTokenBalance,
        CGABalanceInBUSD,
        GoverTokenBalanceInBUSD,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

const buyGoverTokenWithCGA = async (
  dispatch: AppDispatch,
  web3: Web3,
  account: any,
  CGAContract: Contract,
  goverTokenContract: Contract,
  routerContract: Contract,
  swapAmount: Number,
  toPlay: boolean
) => {
  dispatch(updateGoverTokenState({ buyGoverTokenLoading: true }));
  try {
    let allowance = await getCGAAllowance(
      web3,
      CGAContract,
      getGameGovernanceTokenAddress(),
      account
    );
    console.log("CGA allowance: ", allowance);
    console.log("swap Amount: ", swapAmount);
    while (Number(allowance) < Number(swapAmount)) {
      await setCGAApprove(
        web3,
        CGAContract,
        getGameGovernanceTokenAddress(),
        account
      );
      allowance = await getCGAAllowance(
        web3,
        CGAContract,
        getGameGovernanceTokenAddress(),
        account
      );
    }
    await depositGoverToken(web3, account, goverTokenContract, swapAmount);
    await getCGAandGoverTokenBalance(
      dispatch,
      web3,
      account,
      CGAContract,
      goverTokenContract,
      routerContract
    );
    if (toPlay) {
      toast.success(getTranslation("canPlayGame"));
    } else {
      toast.success(getTranslation("swapSuccessfully"));
    }
    dispatch(updateModalState({ buyGoverTokenToPlayModalOpen: false }));
  } catch (error: any) {
    toast.error(error);
    console.log(error);
  }
  dispatch(updateGoverTokenState({ buyGoverTokenLoading: false }));
};

const sellGoverTokenToCGA = async (
  dispatch: AppDispatch,
  web3: Web3,
  account: any,
  CGAContract: Contract,
  goverTokenContract: Contract,
  routerContract: Contract,
  swapAmount: Number
) => {
  console.log("gover token contract: ", goverTokenContract);
  dispatch(updateGoverTokenState({ sellGoverTokenLoading: true }));
  try {
    await withdrawGoverToken(web3, account, goverTokenContract, swapAmount);
    await getCGAandGoverTokenBalance(
      dispatch,
      web3,
      account,
      CGAContract,
      goverTokenContract,
      routerContract
    );
    toast.success(getTranslation("swapSuccessfully"));
  } catch (error: any) {
    toast.error(error);
    console.log(error);
  }
  dispatch(updateGoverTokenState({ sellGoverTokenLoading: false }));
};

const getCGAAmountForBUSD = async (
  routerContract: Contract,
  amount: Number
) => {
  let CGAAmount = 0;
  try {
    CGAAmount = await getAmountsOut(routerContract, amount, [
      getBUSDAddress(),
      getCGAAddress(),
    ]);
  } catch (error) {
    console.log(error);
  }
  return CGAAmount;
};

const checNextkWithdrawTime = async (
  account: any,
  goverTokenContract: Contract
) => {
  let canWithdraw = true;
  let nextWithdrawTime = 0;
  try {
    let time = await getNextWithdrawTime(account, goverTokenContract);
    if (time == 0) {
      canWithdraw = true;
    } else {
      nextWithdrawTime = time;
      console.log("nextWithTime: ", time);
      console.log("now: ", Date.now());
      if (nextWithdrawTime * 1000 >= Date.now()) {
        canWithdraw = false;
      }
    }
  } catch (error) {
    console.log("error in check next withdrawtime: ", error);
  }
  return { canWithdraw, nextWithdrawTime };
};

const GoverTokenService = {
  getCGAandGoverTokenBalance,
  buyGoverTokenWithCGA,
  sellGoverTokenToCGA,
  getCGAAmountForBUSD,
  checNextkWithdrawTime,
};

export default GoverTokenService;
