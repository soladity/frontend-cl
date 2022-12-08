import Web3 from "web3";
import { toast } from "react-toastify";
import { Contract } from "web3-eth-contract";
import {
  buyEA,
  getBusdLimitPer6Hours,
  getEarlyAccessFeePerWarrior,
  getEaWarriorCnt,
  getFirstPurchaseTime,
  getPurchasedBusdInPeriod,
} from "../web3hooks/contractFunctions/gameAccess.contract";
import { AppDispatch, store } from "../store";
import { updateGameAccessState } from "../reducers/gameAccess.reducer";
import gameConfig from "../config/game.config";
import { getTranslation } from "../utils/utils";
import {
  getCGAAllowance,
  setCGAApprove,
} from "../web3hooks/contractFunctions/cga.contract";
import { getGameAccessAddress } from "../web3hooks/getAddress";
import GoverTokenService from "./goverToken.service";

const getEarlyAccessInfo = async (
  dispatch: AppDispatch,
  account: any,
  gameAccessContract: Contract
) => {
  try {
    let accessedWarriorCnt = Number(
      (await getEaWarriorCnt(account, gameAccessContract))[1]
    );
    let busdLimitPer6Hours = await getBusdLimitPer6Hours(gameAccessContract);
    let earlyAccessFeePerWarrior = await getEarlyAccessFeePerWarrior(
      gameAccessContract
    );
    let purchasedBusdInPeriod = await getPurchasedBusdInPeriod(
      gameAccessContract
    );
    let firstPurchaseTime = await getFirstPurchaseTime(gameAccessContract);
    console.log({
      accessedWarriorCnt,
      busdLimitPer6Hours,
      earlyAccessFeePerWarrior,
      purchasedBusdInPeriod,
      firstPurchaseTime,
    });
    dispatch(
      updateGameAccessState({
        accessedWarriorCnt,
        busdLimitPer6Hours,
        earlyAccessFeePerWarrior,
        purchasedBusdInPeriod,
        firstPurchaseTime,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

const getLeftTime = () => {
  const { firstPurchaseTime, busdLimitPer6Hours } = store.getState().gameAccess;
  let time = {
    hours: 6,
    mins: 0,
    secs: 0,
  };
  if (firstPurchaseTime !== 0) {
    const { earlyAccessPeriod } = gameConfig.version;
    const finishTime = Number(firstPurchaseTime) * 1000 + earlyAccessPeriod;
    const diffSecs = (finishTime - new Date().getTime()) / 1000;
    if (diffSecs <= 0) {
      return { newPeriod: true, time, busdLimitPer6Hours };
    }
    time.hours = Number(Math.floor(diffSecs / 3600).toFixed(0));
    time.mins = Number(Math.floor((diffSecs % 3600) / 60).toFixed(0));
    time.secs = Number((Math.floor(diffSecs % 3600) % 60).toFixed(0));
    return { newPeriod: false, time, busdLimitPer6Hours };
  }
  return { newPeriod: false, time, busdLimitPer6Hours };
};

const buyEarlyAccess = async (
  dispatch: AppDispatch,
  web3: Web3,
  account: any,
  count: Number,
  busdAmount: Number,
  CGAContract: Contract,
  gameAccessContract: Contract,
  routerContract: Contract
) => {
  dispatch(updateGameAccessState({ buyEarlyAccessLoading: true }));
  try {
    let allowance = await getCGAAllowance(
      web3,
      CGAContract,
      getGameAccessAddress(),
      account
    );
    const CGAAmount = await GoverTokenService.getCGAAmountForBUSD(
      routerContract,
      busdAmount
    );
    while (Number(allowance) < Number(CGAAmount)) {
      await setCGAApprove(web3, CGAContract, getGameAccessAddress(), account);
      allowance = await getCGAAllowance(
        web3,
        CGAContract,
        getGameAccessAddress(),
        account
      );
    }
    await buyEA(account, count, gameAccessContract);
    toast.success(getTranslation("buyEarlyAccessSuccessfully"));
  } catch (error: any) {
    console.log(error);
    toast.error(error);
  }
  getEarlyAccessInfo(dispatch, account, gameAccessContract);
  dispatch(updateGameAccessState({ buyEarlyAccessLoading: false }));
};

const GameAccessService = {
  getEarlyAccessInfo,
  buyEarlyAccess,
  getLeftTime,
};

export default GameAccessService;
