import Web3 from "web3";
import { toast } from "react-toastify";
import { Contract } from "web3-eth-contract";
import {
  buyEA,
  getBonusChance,
  getBusdLimitPer6Hours,
  getEarlyAccessFeePerWarrior,
  getEATurnOff,
  getEaWarriorCnt,
  getFirstPurchaseTime,
  getPurchasedBusdInPeriod,
  getWalletToEAPurchased,
} from "../web3hooks/contractFunctions/gameAccess.contract";
import { AppDispatch, store } from "../store";
import { updateGameAccessState } from "../reducers/gameAccess.reducer";
import gameConfig from "../config/game.config";
import { getDiffTime, getTranslation } from "../utils/utils";
import {
  getCGAAllowance,
  setCGAApprove,
} from "../web3hooks/contractFunctions/cga.contract";
import { getGameAccessAddress } from "../web3hooks/getAddress";
import GoverTokenService from "./goverToken.service";
import { updateModalState } from "../reducers/modal.reducer";
import { getMaxAttackPower } from "../web3hooks/contractFunctions/legion.contract";

const getEarlyAccessInfo = async (
  dispatch: AppDispatch,
  account: any,
  gameAccessContract: Contract,
  legionContract: Contract
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
    let EATurnOffAndPurchased = await getWalletToEAPurchased(
      gameAccessContract,
      account
    );
    let earlyAccessTurnOff = EATurnOffAndPurchased[0];
    let EAPurchasedStatus = EATurnOffAndPurchased[1];
    let totalAttackPower = (
      await getMaxAttackPower(legionContract, account)
    )[1];
    console.log("totalAttackPower: ", totalAttackPower);
    let bonusChance = await getBonusChance(
      account,
      totalAttackPower,
      gameAccessContract
    );
    console.log("first purchase time: ", firstPurchaseTime);
    dispatch(
      updateGameAccessState({
        accessedWarriorCnt,
        busdLimitPer6Hours,
        earlyAccessFeePerWarrior,
        purchasedBusdInPeriod,
        firstPurchaseTime,
        earlyAccessTurnOff,
        EAPurchasedStatus,
        bonusChance,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

const checkEarlyAccessModal = async (
  dispatch: AppDispatch,
  account: any,
  gameAccessContract: Contract
) => {
  try {
    let EATurnOffAndPurchased = await getWalletToEAPurchased(
      gameAccessContract,
      account
    );
    let earlyAccessTurnOff = EATurnOffAndPurchased[0];
    if (!earlyAccessTurnOff) {
      dispatch(updateModalState({ earlyAccessModalOpen: true }));
    }
  } catch (error) {}
};

const getLeftTime = () => {
  const { firstPurchaseTime, busdLimitPer6Hours } = store.getState().gameAccess;
  const { earlyAccessPeriod } = gameConfig.version;
  const getDiffSecsInPeriod = () => {
    return earlyAccessPeriod - (Date.now() % earlyAccessPeriod);
  };
  let time = {
    hours: 6,
    mins: 0,
    secs: 0,
  };
  let newPeriod = false;
  const finishTime = Number(firstPurchaseTime) * 1000 + earlyAccessPeriod;
  const diffMilliSecs = finishTime - new Date().getTime();
  if (diffMilliSecs <= 0) {
    newPeriod = true;
    console.log("new period: ", newPeriod);
  }
  let diffMilliSec = getDiffSecsInPeriod();
  time = getDiffTime(diffMilliSec);
  return { newPeriod, time, busdLimitPer6Hours };
};

const buyEarlyAccess = async (
  dispatch: AppDispatch,
  web3: Web3,
  account: any,
  count: Number,
  busdAmount: Number,
  CGAContract: Contract,
  gameAccessContract: Contract,
  routerContract: Contract,
  legionContract: Contract
) => {
  dispatch(updateGameAccessState({ buyEarlyAccessLoading: true }));
  try {
    let allowance = await getCGAAllowance(
      web3,
      CGAContract,
      getGameAccessAddress(),
      account
    );
    const CGAAmount = await GoverTokenService.getCGAOutAmountForBUSD(
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
  getEarlyAccessInfo(dispatch, account, gameAccessContract, legionContract);
  dispatch(updateGameAccessState({ buyEarlyAccessLoading: false }));
};

const GameAccessService = {
  getEarlyAccessInfo,
  buyEarlyAccess,
  getLeftTime,
  checkEarlyAccessModal,
};

export default GameAccessService;
