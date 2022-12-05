import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Dialog, Input, Typography } from "@mui/material";
import { AppDispatch, AppSelector } from "../../store";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import constants from "../../constants";
import {
  convertInputNumber,
  fromWeiNum,
  getTranslation,
} from "../../utils/utils";
import FireBtn from "../Buttons/FireBtn";
import { gameAccessState } from "../../reducers/gameAccess.reducer";
import GoverTokenService from "../../services/goverToken.service";
import {
  useCGA,
  useGameAccess,
  usePancakeSwapRouter,
  useWeb3,
} from "../../web3hooks/useContract";
import GameAccessService from "../../services/gameAccess.service";
import { useWeb3React } from "@web3-react/core";

const EarlyAccessModal: React.FC = () => {
  let timer: any = 0;

  const dispatch: AppDispatch = useDispatch();
  const { earlyAccessModalOpen } = AppSelector(modalState);
  const {
    accessedWarriorCnt,
    busdLimitPer6Hours,
    earlyAccessFeePerWarrior,
    firstPurchaseTime,
    purchasedBusdInPeriod,
    buyEarlyAccessLoading,
  } = AppSelector(gameAccessState);

  const web3 = useWeb3();
  const { account } = useWeb3React();
  const gameAccessContract = useGameAccess();
  const routerContract = usePancakeSwapRouter();
  const CGAContract = useCGA();

  const [CGAAmount, setCGAAmount] = useState(0);
  const [warriorCnt, setWarriorCnt] = useState(0);
  const [currentLeftEarlyAccessCGA, setCurrentLeftEarlyAccessCGA] = useState(0);
  const [totalPeriodEarlyAccessCGA, setTotalPeriodEarlyAccessCGA] = useState(0);
  const [leftTime, setLeftTime] = useState({ hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    getBalance();
    timer = setInterval(() => {
      handleLeftTime();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    handleCGAAmount(warriorCnt * fromWeiNum(earlyAccessFeePerWarrior));
  }, [warriorCnt]);

  useEffect(() => {
    handleLeftAndPeriodCGAAmount();
  }, [
    busdLimitPer6Hours,
    earlyAccessFeePerWarrior,
    firstPurchaseTime,
    purchasedBusdInPeriod,
  ]);

  const getBalance = async () => {
    GameAccessService.getEarlyAccessInfo(dispatch, account, gameAccessContract);
  };

  const handleLeftTime = async () => {
    let leftTime = GameAccessService.getLeftTime();
    setLeftTime(leftTime);
  };

  const handleWarriorCnt = async (e: any) => {
    let inputVal = e.target.value;
    setWarriorCnt(convertInputNumber(inputVal));
  };

  const handleCGAAmount = async (busdAmount: Number) => {
    let CGAAmount = await GoverTokenService.getCGAAmountForBUSD(
      routerContract,
      busdAmount
    );
    setCGAAmount(CGAAmount);
  };

  const handleLeftAndPeriodCGAAmount = async () => {
    const leftBUSD = fromWeiNum(
      Number(busdLimitPer6Hours) - Number(purchasedBusdInPeriod)
    );
    let leftCGA = await GoverTokenService.getCGAAmountForBUSD(
      routerContract,
      leftBUSD
    );
    setCurrentLeftEarlyAccessCGA(leftCGA);
    let totalPeriodEarlyAccessCGA = await GoverTokenService.getCGAAmountForBUSD(
      routerContract,
      fromWeiNum(busdLimitPer6Hours)
    );
    setTotalPeriodEarlyAccessCGA(totalPeriodEarlyAccessCGA);
  };

  const handleBuyEarlyAccess = async () => {
    await GameAccessService.buyEarlyAccess(
      dispatch,
      web3,
      account,
      warriorCnt,
      warriorCnt * fromWeiNum(earlyAccessFeePerWarrior),
      CGAContract,
      gameAccessContract,
      routerContract
    );
  };

  const handleClose = () => {
    dispatch(updateModalState({ earlyAccessModalOpen: false }));
  };

  return (
    <Dialog
      open={earlyAccessModalOpen}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: constants.color.popupBGColor,
        },
      }}
    >
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4">{getTranslation("buyEarlyAccess")}</Typography>
        <br />
        <Typography>{getTranslation("earlyAccessDescription")}</Typography>
        <br />
        <Typography>
          {getTranslation("earlyAccessCreditsLeft", {
            CL1: accessedWarriorCnt,
          })}
        </Typography>
        <Typography>
          {getTranslation("currentTotalAmountLeftToBuyEarlyAccess", {
            CL1: currentLeftEarlyAccessCGA.toFixed(2),
          })}
        </Typography>
        <Typography>
          {getTranslation("totalAvailableAmountWillResetToXXX$CGAInXXXTime", {
            CL1: totalPeriodEarlyAccessCGA.toFixed(2),
            CL2: leftTime.hours,
            CL3: leftTime.mins,
            CL4: leftTime.secs,
          })}
        </Typography>
        <br />
        <Typography>
          {getTranslation("howManyWarriorsDoUWantToBuyEarlyAccess")}
        </Typography>
        <br />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Input
            type="number"
            sx={{ marginRight: 1, paddingLeft: 2, width: 100 }}
            value={warriorCnt}
            onChange={handleWarriorCnt}
          />
          {getTranslation("warriors")} (
          {getTranslation("costIsXXX$CGA", { CL1: CGAAmount.toFixed(2) })})
        </Box>
        <br />
        <FireBtn
          loading={buyEarlyAccessLoading}
          onClick={() => handleBuyEarlyAccess()}
          disabled={currentLeftEarlyAccessCGA < CGAAmount}
        >
          {getTranslation("buyEarlyAccess")}
        </FireBtn>
      </Box>
    </Dialog>
  );
};

export default EarlyAccessModal;
