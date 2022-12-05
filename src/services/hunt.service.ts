import { Contract } from "web3-eth-contract";
import constants from "../constants";
import { updateLegionState } from "../reducers/legion.reducer";
import { updateModalState } from "../reducers/modal.reducer";
import { updateMonsterState } from "../reducers/monster.reducer";
import { AppDispatch } from "../store";
import { IMonster } from "../types";
import { IMonsterId } from "../types/monster.type";
import {
  getHuntRequestId,
  getMassHuntRequestId,
  getWalletHuntPending,
  getWalletMassHuntPending,
} from "../web3hooks/contractFunctions/common.contract";
import { checkEntryTicket } from "../web3hooks/contractFunctions/gameAccess.contract";
import {
  getWalletHuntPendingLegionId,
  getWalletHuntPendingMonsterId,
  initiateHunt,
  initiateMassHunt,
} from "../web3hooks/contractFunctions/legion.contract";
import { getAllMonsters } from "../web3hooks/contractFunctions/monster.contract";
import { getVRFResult } from "../web3hooks/contractFunctions/vrf.contract";

const getAllMonstersAct = async (
  dispatch: AppDispatch,
  monsterContract: Contract
) => {
  dispatch(updateMonsterState({ getAllMonsterLoading: true }));
  try {
    const allMonstersRes = await getAllMonsters(monsterContract);
    console.log("all monsters res: ", allMonstersRes);
    const monsterInfos = allMonstersRes[0];
    const blstRewards = allMonstersRes[1];
    let allMonsters: IMonster[] = [];
    monsterInfos.forEach((item: any, index: number) => {
      let temp: IMonster = {
        id: (index + 1) as IMonsterId,
        name: constants.itemNames.monsters[(index + 1) as IMonsterId],
        percent: parseInt(item.percent),
        BUSDReward: item.reward / Math.pow(10, 18),
        BLSTReward: blstRewards[index] / Math.pow(10, 18),
        attackPower: parseInt(item.attack_power),
      };
      allMonsters.push(temp);
    });
    console.log("all monsters --- ", allMonsters);
    dispatch(updateMonsterState({ allMonsters }));
  } catch (error) {
    console.log("get all monster error: ", error);
  }
  dispatch(updateMonsterState({ getAllMonsterLoading: false }));
};

const checkHuntRevealStatus = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract,
  vrfContract: Contract
) => {
  try {
    dispatch(updateLegionState({ huntVRFPending: true }));
    const revealChecker = setInterval(async () => {
      const requestId = await getHuntRequestId(legionContract, account);
      const returnVal = await getVRFResult(vrfContract, requestId);
      if (returnVal != 0) {
        dispatch(updateLegionState({ huntVRFPending: false }));
        clearInterval(revealChecker);
      }
    }, 1000);
  } catch (error) {}
};

const checkHuntPending = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract
) => {
  try {
    const huntPending = await getWalletHuntPending(legionContract, account);
    dispatch(updateLegionState({ huntPending }));
  } catch (error) {}
};

const checkMassHuntRevealStatus = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract,
  vrfContract: Contract
) => {
  try {
    dispatch(updateLegionState({ massHuntVRFPending: true }));
    const revealChecker = setInterval(async () => {
      const requestId = await getMassHuntRequestId(legionContract, account);
      const returnVal = await getVRFResult(vrfContract, requestId);
      if (returnVal != 0) {
        dispatch(updateLegionState({ massHuntVRFPending: false }));
        clearInterval(revealChecker);
      }
    }, 1000);
  } catch (error) {}
};

const checkMassHuntPending = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract
) => {
  try {
    const massHuntPending = await getWalletMassHuntPending(
      legionContract,
      account
    );
    dispatch(updateLegionState({ massHuntPending }));
  } catch (error) {}
};

const handleInitialHunt = async (
  dispatch: AppDispatch,
  account: any,
  legionID: any,
  monsterID: any,
  huntingSuccessPercent: Number,
  legionContract: Contract,
  vrfContract: Contract,
  gameAccessContract: Contract
) => {
  console.log("initial hunt: ");
  const toPlay = await checkEntryTicketToPlay(
    dispatch,
    account,
    gameAccessContract
  );
  console.log("to play: ", toPlay);
  if (toPlay) {
    try {
      let huntPending = await getWalletHuntPending(legionContract, account);
      dispatch(
        updateLegionState({
          huntPending,
          huntingLegionId: parseInt(legionID),
          huntingMonsterId: monsterID,
        })
      );
      if (!huntPending) {
        dispatch(
          updateLegionState({
            initialHuntLoading: true,
          })
        );
        await initiateHunt(legionContract, account, legionID, monsterID);
        let huntPending = await getWalletHuntPending(legionContract, account);

        const huntingMonsterId = await getWalletHuntPendingMonsterId(
          legionContract,
          account
        );
        const huntingLegionId = await getWalletHuntPendingLegionId(
          legionContract,
          account
        );
        dispatch(
          updateLegionState({
            huntPending,
            initialHuntLoading: false,
            huntingLegionId,
            huntingMonsterId,
            huntingSuccessPercent: huntingSuccessPercent,
          })
        );
        HuntService.checkHuntRevealStatus(
          dispatch,
          account,
          legionContract,
          vrfContract
        );
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(
      updateLegionState({
        initialHuntLoading: false,
      })
    );
  }
};

const handleInitialMassHunt = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract,
  vrfContract: Contract,
  gameAccessContract: Contract
) => {
  const toPlay = await checkEntryTicketToPlay(
    dispatch,
    account,
    gameAccessContract
  );
  if (toPlay) {
    try {
      let massHuntPending = await getWalletMassHuntPending(
        legionContract,
        account
      );
      dispatch(updateLegionState({ massHuntPending }));
      if (!massHuntPending) {
        dispatch(updateLegionState({ initialMassHuntLoading: true }));
        await initiateMassHunt(legionContract, account);
        let massHuntPending = await getWalletMassHuntPending(
          legionContract,
          account
        );
        dispatch(updateLegionState({ massHuntPending }));
        HuntService.checkMassHuntRevealStatus(
          dispatch,
          account,
          legionContract,
          vrfContract
        );
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(updateLegionState({ initialMassHuntLoading: false }));
  }
};

const checkEntryTicketToPlay = async (
  dispatch: AppDispatch,
  account: any,
  gameAccessContract: Contract
) => {
  let playStatus = false;
  try {
    playStatus = await checkEntryTicket(account, gameAccessContract);
    if (!playStatus) {
      dispatch(updateModalState({ buyGoverTokenToPlayModalOpen: true }));
    }
  } catch (error) {
    console.log(error);
  }
  return playStatus;
};

const HuntService = {
  getAllMonstersAct,
  checkHuntRevealStatus,
  checkHuntPending,
  checkMassHuntRevealStatus,
  checkMassHuntPending,
  checkEntryTicketToPlay,
  handleInitialHunt,
  handleInitialMassHunt,
};

export default HuntService;
