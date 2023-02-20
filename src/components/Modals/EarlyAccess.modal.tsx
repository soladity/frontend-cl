import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Dialog, Input, Typography } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { AppDispatch, AppSelector } from "../../store";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import constants from "../../constants";
import {
  convertInputNumberToStr,
  fromWeiNum,
  getTranslation,
} from "../../utils/utils";
import FireBtn from "../Buttons/FireBtn";
import { gameAccessState } from "../../reducers/gameAccess.reducer";
import GoverTokenService from "../../services/goverToken.service";
import {
  useCGA,
  useGameAccess,
  useLegion,
  usePancakeSwapRouter,
  useWeb3,
} from "../../web3hooks/useContract";
import GameAccessService from "../../services/gameAccess.service";
import { useWeb3React } from "@web3-react/core";
import { goverTokenState } from "../../reducers/goverToken.reducer";
import GreyBtn from "../Buttons/GreyBtn";

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
  const { CGABalance } = AppSelector(goverTokenState);

  const web3 = useWeb3();
  const { account } = useWeb3React();
  const gameAccessContract = useGameAccess();
  const routerContract = usePancakeSwapRouter();
  const CGAContract = useCGA();
  const legionContract = useLegion();

  const [CGAAmount, setCGAAmount] = useState(0);
  useEffect(()=> {
    console.log(currentLeftEarlyAccessCGA, "CGABalance");
    console.log(CGAAmount, "CGABalance");
  }, [])
  const [warriorCnt, setWarriorCnt] = useState(
    constants.filterAndPage.EABuyMin
  );
  const [currentLeftEarlyAccessCGA, setCurrentLeftEarlyAccessCGA] = useState(0);
  const [totalPeriodEarlyAccessCGA, setTotalPeriodEarlyAccessCGA] = useState(0);
  const [leftTime, setLeftTime] = useState({ hours: 0, mins: 0, secs: 0 });
  const [newPeriod, setNewPeriod] = useState(false);

  useEffect(() => {
    GameAccessService.checkEarlyAccessModal(
      dispatch,
      account,
      gameAccessContract
    );
    timer = setInterval(() => {
      handleLeftTime();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    getBalance();
  }, [earlyAccessModalOpen]);

  useEffect(() => {
    handleCGAAmount(warriorCnt * fromWeiNum(earlyAccessFeePerWarrior));
  }, [warriorCnt, earlyAccessFeePerWarrior]);

  useEffect(() => {
    handleLeftAndPeriodCGAAmount();
  }, [
    busdLimitPer6Hours,
    earlyAccessFeePerWarrior,
    firstPurchaseTime,
    purchasedBusdInPeriod,
  ]);

  const getBalance = async () => {
    GameAccessService.getEarlyAccessInfo(
      dispatch,
      account,
      gameAccessContract,
      legionContract
    );
  };

  const handleLeftTime = async () => {
    let { time, newPeriod, busdLimitPer6Hours } =
      GameAccessService.getLeftTime();
    setLeftTime(time);
    setNewPeriod(newPeriod);
  };

  const handleWarriorCnt = async (e: any) => {
    let inputVal = e.target.value;
    setWarriorCnt(Math.floor(inputVal));
  };

  const handleCGAAmount = async (busdAmount: Number) => {
    let CGAAmount = await GoverTokenService.getCGAOutAmountForBUSD(
      routerContract,
      busdAmount
    );
    setCGAAmount(CGAAmount);
  };

  const handleLeftAndPeriodCGAAmount = async () => {
    const leftBUSD = fromWeiNum(
      Number(busdLimitPer6Hours) - Number(purchasedBusdInPeriod)
    );
    let leftCGA = await GoverTokenService.getCGAOutAmountForBUSD(
      routerContract,
      leftBUSD
    );
    setCurrentLeftEarlyAccessCGA(leftCGA);
    let totalPeriodEarlyAccessCGA =
      await GoverTokenService.getCGAOutAmountForBUSD(
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
      routerContract,
      legionContract
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
      <Box sx={{ padding: 4, position: "relative" }}>
        <FaTimes
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            cursor: "pointer",
          }}
          onClick={handleClose}
        />
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
            CL1: newPeriod
              ? totalPeriodEarlyAccessCGA.toFixed(2)
              : currentLeftEarlyAccessCGA.toFixed(2),
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
            value={convertInputNumberToStr(warriorCnt)}
            onChange={handleWarriorCnt}
          />
          {getTranslation("warriors")} (
          {getTranslation("costIsXXX$CGA", { CL1: CGAAmount.toFixed(2) })})
        </Box>
        {constants.filterAndPage.EABuyMin > warriorCnt && (
          <Typography color={"error"} fontSize={12}>
            {getTranslation("buyMinEarlyAccessError", {
              CL1: constants.filterAndPage.EABuyMin,
            })}
          </Typography>
        )}
        {constants.filterAndPage.EABuyMax < warriorCnt && (
          <Typography color={"error"} fontSize={12}>
            {getTranslation("buyMaxEarlyAccessError", {
              CL1: constants.filterAndPage.EABuyMax,
            })}
          </Typography>
        )}
        <br />
        <Box>
          <FireBtn
            loading={buyEarlyAccessLoading}
            onClick={() => handleBuyEarlyAccess()}
            disabled={
              constants.filterAndPage.EABuyMin > warriorCnt ||
              warriorCnt > constants.filterAndPage.EABuyMax ||
              CGABalance < CGAAmount
            }
          >
            {getTranslation("buyEarlyAccess")}
          </FireBtn>
          <a href={"#"} target="_blank" className="td-none">
            <GreyBtn
              sx={{
                wordBreak: "break-word",
                fontSize: 14,
                ml: 1,
              }}
            >
              {getTranslation("buy$CGA")}
            </GreyBtn>
          </a>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EarlyAccessModal;
