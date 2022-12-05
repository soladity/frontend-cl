import { Contract } from "web3-eth-contract";
import { updateLegionState } from "../reducers/legion.reducer";
import { updateInventoryState } from "../reducers/inventory.reducer";
import { AppDispatch } from "../store";
import { ILegion } from "../types";
import { getLegionJpgImageUrl, getLegionMp4ImageUrl } from "../utils/utils";
import {
  execute,
  isApprovedForAll,
  setApprovalForAll,
} from "../web3hooks/contractFunctions/common.contract";
import {
  getAllLegions,
  getLegionBalance,
} from "../web3hooks/contractFunctions/legion.contract";
import { getLegionAddress } from "../web3hooks/getAddress";
import { getBonusChance } from "../web3hooks/contractFunctions/gameAccess.contract";

const getAllLegionsAct = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract,
  gameAccessContract: Contract
) => {
  dispatch(updateLegionState({ getAllLegionsLoading: true }));
  try {
    const legionBalance = await getLegionBalance(legionContract, account);
    const allLegionsRes = await getAllLegions(
      legionContract,
      account,
      0,
      Number(legionBalance)
    );
    const legionInfos = allLegionsRes[0];
    const ids = allLegionsRes[1];
    const huntStatus = allLegionsRes[2];
    let allLegions: ILegion[] = [];
    for (let index = 0; index < ids.length; index++) {
      const bonusChance = await getBonusChance(
        account,
        legionInfos[index].attack_power,
        gameAccessContract
      );
      console.log("bonus chance: ", bonusChance);
      var temp: ILegion = {
        id: ids[index],
        name: legionInfos[index].name,
        beastIds: legionInfos[index].beast_ids,
        warriorIds: legionInfos[index].warrior_ids,
        attackPower: parseFloat(legionInfos[index].attack_power),
        jpg: getLegionJpgImageUrl(parseFloat(legionInfos[index].attack_power)),
        mp4: getLegionMp4ImageUrl(parseFloat(legionInfos[index].attack_power)),
        supplies: parseFloat(legionInfos[index].supplies),
        huntStatus: huntStatus[index],
        executeStatus: false,
        bonusChance: bonusChance,
      };
      console.log("legion: ", temp);
      allLegions.push(temp);
      console.log(allLegions);
    }
    dispatch(updateLegionState({ allLegions }));
    dispatch(updateInventoryState({ legionBalance }));
  } catch (error) {}
  dispatch(updateLegionState({ getAllLegionsLoading: false }));
};

const checkAndApproveBeastForLegion = async (
  dispatch: AppDispatch,
  account: any,
  beastContract: Contract
) => {
  try {
    let isApproved = await isApprovedForAll(
      beastContract,
      account,
      getLegionAddress()
    );
    dispatch(updateLegionState({ isApprovedBeastForLegion: isApproved }));
    if (!isApproved) {
      await setApprovalForAll(account, beastContract, getLegionAddress(), true);
    }
    isApproved = await isApprovedForAll(
      beastContract,
      account,
      getLegionAddress()
    );
    dispatch(updateLegionState({ isApprovedBeastForLegion: isApproved }));
  } catch (error) {}
};

const checkAndApproveWarriorForLegion = async (
  dispatch: AppDispatch,
  account: any,
  warriorContract: Contract
) => {
  try {
    let isApproved = await isApprovedForAll(
      warriorContract,
      account,
      getLegionAddress()
    );
    dispatch(updateLegionState({ isApprovedWarriorForLegion: isApproved }));
    if (!isApproved) {
      await setApprovalForAll(
        account,
        warriorContract,
        getLegionAddress(),
        true
      );
    }
    isApproved = await isApprovedForAll(
      warriorContract,
      account,
      getLegionAddress()
    );
    dispatch(updateLegionState({ isApprovedWarriorForLegion: isApproved }));
  } catch (error) {}
};

const handleExecuteLegions = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract,
  ids: String[],
  gameAccessContract: Contract
) => {
  dispatch(updateLegionState({ executeLegionsLoading: true }));
  try {
    await execute(legionContract, account, ids);
    getAllLegionsAct(dispatch, account, legionContract, gameAccessContract);
  } catch (error) {}
  dispatch(updateLegionState({ executeLegionsLoading: false }));
};

const LegionService = {
  getAllLegionsAct,
  checkAndApproveBeastForLegion,
  checkAndApproveWarriorForLegion,
  handleExecuteLegions,
};

export default LegionService;
