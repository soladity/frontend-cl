import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { Box, Card, Typography } from "@mui/material";
import Axios from "axios";

import { AppSelector } from "../../../store";
import { formatNumber, getTranslation } from "../../../utils/utils";
import {
  useBeast,
  useFeeHandler,
  useGameAccess,
  useLegion,
  useWarrior,
  useWeb3,
} from "../../../web3hooks/useContract";
import HomeTypo from "../../../components/UI/HomeTypo";
import { inventoryState } from "../../../reducers/inventory.reducer";
import { commonState } from "../../../reducers/common.reduer";
import { legionState } from "../../../reducers/legion.reducer";
import InventoryService from "../../../services/inventory.service";
import LegionService from "../../../services/legion.service";
import { apiConfig } from "../../../config/api.config";
import { getLegionLastHuntTime } from "../../../web3hooks/contractFunctions/legion.contract";
import gameConfig from "../../../config/game.config";
import { goverTokenState } from "../../../reducers/goverToken.reducer";
import FireBtn from "../../../components/Buttons/FireBtn";
import { gameAccessState } from "../../../reducers/gameAccess.reducer";
import ModalService from "../../../services/modal.service";
import GameAccessService from "../../../services/gameAccess.service";
import { updateModalState } from "../../../reducers/modal.reducer";

const YourInventory: React.FC = () => {
  // Hook Info
  const dispatch = useDispatch();
  const { reloadStatusTime } = AppSelector(commonState);
  const { allLegions } = AppSelector(legionState);
  const {
    CGABalance,
    GoverTokenBalance,
    CGABalanceInBUSD,
    GoverTokenBalanceInBUSD,
  } = AppSelector(goverTokenState);
  const {
    BLSTBalance,
    beastBalance,
    warriorBalance,
    legionBalance,
    availableLegionsCount,
    unclaimedBLST,
    taxLeftDaysForClaim,
    maxAttackPower,
    BUSDForTotalBLST,
    USDToBLST,
    BLSTToUSD,
    startupInvestment,
    reinvestedTotalUSD,
    totalClaimedUSD,
    currentSamaritanStars,
    remainUnclaimedUSDWhenClaim,
    remainUnclaimedUSDWhenReinvest,
    currentReinvestPercent,
    futureReinvestPercentWhenClaim,
    futureReinvestPercentWhenReinvest,
    futureSamaritanStarsWhenClaim,
    futureSamaritanStarsWhenReinvest,
    reinvestingUSDWithoutTax,
    claimingUSDWithoutTax,
    additionalInvestment,
    daysLeftUntilAbove3Stars,
    claimMinTaxPercent,
    taxLeftDaysForReinvest,
  } = AppSelector(inventoryState);
  const { accessedWarriorCnt, earlyAccessTurnOff, bonusChance } =
    AppSelector(gameAccessState);

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contract
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const legionContract = useLegion();
  const feehandlerContract = useFeeHandler();
  const gameAccessContract = useGameAccess();

  // State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [firstHuntTime, setFirstHuntTime] = useState(0);

  const totalAP = allLegions.reduce((a, b) => a + Number(b.attackPower), 0);

  const claimTaxAmount =
    ((Number(claimMinTaxPercent) + 2 * Number(taxLeftDaysForClaim)) *
      Number(unclaimedBLST)) /
    100 /
    10 ** 18;

  // UseEffect
  useEffect(() => {
    setTimeout(() => {
      setCurrentTime(new Date());
    }, 1000);
    checkHuntTime();
  }, [currentTime]);

  useEffect(() => {
    getBalance();
  }, [reloadStatusTime, account]);

  useEffect(() => {
    getLastHuntTimes();
  }, [allLegions]);

  // Functions
  const getBalance = async () => {
    try {
      InventoryService.getInventory(
        dispatch,
        web3,
        account,
        beastContract,
        warriorContract,
        legionContract,
        feehandlerContract
      );
      LegionService.getAllLegionsAct(
        dispatch,
        account,
        legionContract,
        gameAccessContract
      );
      GameAccessService.getHuntBonusChance(
        dispatch,
        account,
        legionContract,
        gameAccessContract
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getLastHuntTimes = async () => {
    let availableLegionIds = allLegions
      .filter((legion) => legion.supplies > 0 && legion.attackPower >= 2000)
      .map((item) => item.id);
    let remainTimes = [];
    for (let i = 0; i < availableLegionIds.length; i++) {
      const legionId = availableLegionIds[i];
      const lastHuntTime = await getLegionLastHuntTime(
        legionContract,
        legionId
      );
      remainTimes.push(lastHuntTime);
    }
    if (remainTimes.length > 0) {
      var first = Math.min(...remainTimes);
      setFirstHuntTime(first);
    } else {
      setFirstHuntTime(0);
    }
  };

  const calcHuntTime = (firstHuntTime: number) => {
    const { oneDay } = gameConfig.version;
    const date = new Date(firstHuntTime * 1000);
    const diff = currentTime.getTime() - date.getTime();
    const diffSecs = (oneDay - diff) / 1000;
    const diff_in_hours = Math.floor(diffSecs / 3600).toFixed(0);
    const diff_in_mins = Math.floor((diffSecs % 3600) / 60).toFixed(0);
    const diff_in_secs = (Math.floor(diffSecs % 3600) % 60).toFixed(0);
    if (firstHuntTime !== 0) {
      if (diff / oneDay >= 1) {
        return "00h 00m 00s";
      }
    } else if (firstHuntTime === 0) {
      return "00h 00m 00s";
    }
    if (
      parseInt(diff_in_hours) == 0 &&
      parseInt(diff_in_mins) == 0 &&
      parseInt(diff_in_secs) == 0
    ) {
      return "00h 00m 00s";
    }
    return `${diff_in_hours}h ${diff_in_mins}m ${diff_in_secs}s`;
  };

  const checkHuntTime = () => {
    const { oneDay } = gameConfig.version;
    const date = new Date(firstHuntTime * 1000);
    const diff = currentTime.getTime() - date.getTime();
    const diffSecs = (oneDay - diff) / 1000;
    const diff_in_hours = Math.floor(diffSecs / 3600).toFixed(0);
    const diff_in_mins = Math.floor((diffSecs % 3600) / 60).toFixed(0);
    const diff_in_secs = (Math.floor(diffSecs % 3600) % 60).toFixed(0);
    if (
      parseInt(diff_in_hours) == 0 &&
      parseInt(diff_in_mins) == 0 &&
      parseInt(diff_in_secs) == 0
    ) {
      console.log("refresh");
      getBalance();
    }
  };

  const handleOpenSwapGovernanceTokenModal = () => {
    dispatch(updateModalState({ swapGovernanceTokenModalOpen: true }));
  };

  return (
    <Card
      className="bg-c4"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ p: 4, justifyContent: "center" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            borderBottom: "1px solid #fff",
            marginBottom: 3,
          }}
        >
          {getTranslation("yourInventory")}
        </Typography>
        <Box>
          <HomeTypo
            title={getTranslation("warriors") + ":"}
            info={warriorBalance}
          />
          <HomeTypo
            title={getTranslation("beasts") + ":"}
            info={beastBalance}
          />
          <HomeTypo
            title={getTranslation("availableLegions") + ":"}
            info={availableLegionsCount + " / " + legionBalance}
          />
          <HomeTypo
            title={getTranslation("waitingTimeToHunt") + ":"}
            info={calcHuntTime(firstHuntTime)}
          />
          {/* <HomeTypo
            title={getTranslation("yourMaxAp") + ":"}
            info={maxAttackPower}
          /> */}
          <HomeTypo
            title={getTranslation("totalAp") + ":"}
            info={totalAP.toFixed(2)}
          />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <HomeTypo
              title={getTranslation("totalExtraBonus") + ":"}
              info={bonusChance + "%"}
            />
            {totalAP / 4000 > GoverTokenBalance && (
              <FireBtn
                sx={{ ml: 1, px: 2 }}
                size="small"
                onClick={() => handleOpenSwapGovernanceTokenModal()}
              >
                {getTranslation("increase")}
              </FireBtn>
            )}
          </Box>
          <br />
          <Typography variant="subtitle1" className="fc1" fontWeight={"bold"}>
            <span className="fc2">{Number(BLSTBalance).toFixed(2)}</span>{" "}
            {getTranslation("BLSTInYourWallet")} ( ={" "}
            <span className="fc2">{Number(BUSDForTotalBLST).toFixed(2)}</span>{" "}
            USD)
          </Typography>
          <Typography variant="subtitle1" className="fc1" fontWeight={"bold"}>
            <span className="fc2">{Number(CGABalance).toFixed(2)}</span>{" "}
            {getTranslation("CGAInYourWallet")} ( ={" "}
            <span className="fc2">{Number(CGABalanceInBUSD).toFixed(2)}</span>{" "}
            USD)
          </Typography>
          <Typography variant="subtitle1" className="fc1" fontWeight={"bold"}>
            <span className="fc2">{Number(GoverTokenBalance).toFixed(2)}</span>{" "}
            {getTranslation("GoverTokenInYourWallet")} ( ={" "}
            <span className="fc2">
              {Number(GoverTokenBalanceInBUSD).toFixed(2)}
            </span>{" "}
            USD)
          </Typography>
          <Typography variant="subtitle1" className="fc1" fontWeight={"bold"}>
            1 USD = {Number(USDToBLST).toFixed(2)} ${getTranslation("blst")} ||
            1 ${getTranslation("blst")} = {Number(BLSTToUSD).toFixed(2)} USD
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default YourInventory;
