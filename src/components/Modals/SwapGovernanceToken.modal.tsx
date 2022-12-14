import React, { useState, useEffect } from "react";
import { Box, Dialog, Input, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useDispatch } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { AppDispatch, AppSelector } from "../../store";
import constants from "../../constants";
import {
  convertInputNumberToStr,
  getDiffTime,
  getTranslation,
} from "../../utils/utils";
import {
  useCGA,
  useGameGovernanceToken,
  usePancakeSwapRouter,
  useWeb3,
} from "../../web3hooks/useContract";
import { useWeb3React } from "@web3-react/core";
import FireBtn from "../Buttons/FireBtn";
import GreyBtn from "../Buttons/GreyBtn";
import { goverTokenState } from "../../reducers/goverToken.reducer";
import GoverTokenService from "../../services/goverToken.service";

const { filterAndPage } = constants;
const { MinSwapAmount } = filterAndPage;

const Buy$GovernanceToken: React.FC<{ CGABalance: Number }> = ({
  CGABalance,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const web3 = useWeb3();
  const { account } = useWeb3React();
  const CGAContract = useCGA();
  const goverTokenContract = useGameGovernanceToken();
  const routerContract = usePancakeSwapRouter();

  const { buyGoverTokenLoading } = AppSelector(goverTokenState);

  const [swapAmount, setSwapAmount] = useState(MinSwapAmount);

  const handleSwapAmount = async (e: any) => {
    let inputVal = e.target.value;
    if (Number(inputVal) >= MinSwapAmount) {
      setSwapAmount(inputVal);
    } else {
      setSwapAmount(swapAmount);
    }
  };

  const handleBuyGoverTokenWithCGA = async () => {
    await GoverTokenService.buyGoverTokenWithCGA(
      dispatch,
      web3,
      account,
      CGAContract,
      goverTokenContract,
      routerContract,
      swapAmount,
      false
    );
    setSwapAmount(0);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {CGABalance === 0 ? (
        <Box>
          <Box>{getTranslation("toBuyGoverTokenYouNeedToBuy$CGAFirst")}</Box>
          <br />
          <Box sx={{ textAlign: "center" }}>
            <FireBtn sx={{ width: "100%" }}>
              {getTranslation("buy$CGA")}
            </FireBtn>
          </Box>
          <br />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <a
              href="#"
              target={"_blank"}
              className="td-none"
              style={{ width: "100%", marginRight: 16 }}
            >
              <GreyBtn sx={{ width: "100%" }}>
                {getTranslation("$CGAChart")}
              </GreyBtn>
            </a>
            <a
              href="#"
              target={"_blank"}
              className="td-none"
              style={{ width: "100%" }}
            >
              <GreyBtn sx={{ width: "100%" }}>
                {getTranslation("$GoverTokenChart")}
              </GreyBtn>
            </a>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {getTranslation("swap")}
            <Input
              value={convertInputNumberToStr(swapAmount)}
              onChange={handleSwapAmount}
              type="number"
              color={swapAmount <= CGABalance ? "primary" : "error"}
              sx={{
                color: swapAmount <= CGABalance ? "white" : "red",
                paddingLeft: 2,
                width: 100,
                marginX: 1,
              }}
            />
            {getTranslation("CGAToGover")}
          </Box>
          {swapAmount > CGABalance && (
            <Typography color={"error"} fontSize={12} textAlign="center">
              {getTranslation("uDoNotHaveEnoughCGAToSwap", {
                CL1: CGABalance.toFixed(2),
              })}
            </Typography>
          )}
          <Typography color={"darkGrey"} fontSize={12}>
            {getTranslation("buyGoverTokenWarning")}
          </Typography>
          <br />
          <Box sx={{ textAlign: "center" }}>
            <FireBtn
              sx={{ width: "100%" }}
              onClick={() => handleBuyGoverTokenWithCGA()}
              loading={buyGoverTokenLoading}
              disabled={swapAmount > CGABalance}
            >
              {getTranslation("buy$GoverToken")}
            </FireBtn>
          </Box>
          <br />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <a
              href="#"
              target={"_blank"}
              className="td-none"
              style={{ width: "100%", marginRight: 16 }}
            >
              <GreyBtn sx={{ width: "100%" }}>
                {getTranslation("$CGAChart")}
              </GreyBtn>
            </a>
            <a
              href="#"
              target={"_blank"}
              className="td-none"
              style={{ width: "100%" }}
            >
              <GreyBtn sx={{ width: "100%" }}>
                {getTranslation("$GoverTokenChart")}
              </GreyBtn>
            </a>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const Sell$GovernanceToken: React.FC<{ GoverTokenBalance: Number }> = ({
  GoverTokenBalance,
}) => {
  let clockTimer: any = 0;
  const dispatch: AppDispatch = useDispatch();
  const web3 = useWeb3();
  const { account } = useWeb3React();
  const CGAContract = useCGA();
  const goverTokenContract = useGameGovernanceToken();
  const routerContract = usePancakeSwapRouter();

  const { sellGoverTokenLoading } = AppSelector(goverTokenState);

  const [swapAmount, setSwapAmount] = useState(MinSwapAmount);
  const [nextWithdrawTime, setNextWithdrawTime] = useState(0);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    clockTimer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => {
      clearInterval(clockTimer);
    };
  }, []);

  useEffect(() => {
    console.log("current Time: ", currentTime);
  }, [currentTime]);

  useEffect(() => {
    checkNextkWithdrawTime();
  }, [GoverTokenBalance]);

  const checkNextkWithdrawTime = async () => {
    const { canWithdraw, nextWithdrawTime } =
      await GoverTokenService.checNextkWithdrawTime(
        account,
        goverTokenContract
      );
    setCanWithdraw(canWithdraw);
    setNextWithdrawTime(nextWithdrawTime);
  };

  const getLeftTime = () => {
    const { hours, mins, secs } = getDiffTime(
      nextWithdrawTime * 1000 - currentTime
    );
    return {
      hours,
      mins,
      secs,
    };
  };

  const handleSwapAmount = async (e: any) => {
    let inputVal = e.target.value;
    if (Number(inputVal) >= MinSwapAmount) {
      setSwapAmount(inputVal);
    } else {
      setSwapAmount(swapAmount);
    }
  };

  const handleSellGoverTokenToCGA = async () => {
    await GoverTokenService.sellGoverTokenToCGA(
      dispatch,
      web3,
      account,
      CGAContract,
      goverTokenContract,
      routerContract,
      swapAmount
    );
    setSwapAmount(0);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {GoverTokenBalance === 0 ? (
        <Box>
          <Box>{getTranslation("youDon'tHaveAnyGoverTokenToSell")}</Box>
          <br />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <a
              href="#"
              target={"_blank"}
              className="td-none"
              style={{ width: "100%", marginRight: 16 }}
            >
              <GreyBtn sx={{ width: "100%" }}>
                {getTranslation("$CGAChart")}
              </GreyBtn>
            </a>
            <a
              href="#"
              target={"_blank"}
              className="td-none"
              style={{ width: "100%" }}
            >
              <GreyBtn sx={{ width: "100%" }}>
                {getTranslation("$GoverTokenChart")}
              </GreyBtn>
            </a>
          </Box>
        </Box>
      ) : (
        <Box>
          {canWithdraw ? (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {getTranslation("swap")}
                <Input
                  value={convertInputNumberToStr(swapAmount)}
                  onChange={handleSwapAmount}
                  type="number"
                  color={swapAmount <= GoverTokenBalance ? "primary" : "error"}
                  sx={{
                    color: swapAmount <= GoverTokenBalance ? "white" : "red",
                    paddingLeft: 2,
                    width: 100,
                    marginX: 1,
                  }}
                />
                {getTranslation("GoverToCGA")}
              </Box>
              {swapAmount > GoverTokenBalance && (
                <Typography color={"error"} fontSize={12} textAlign="center">
                  {getTranslation("uDoNotHaveEnoughGoverTokenToSell", {
                    CL1: GoverTokenBalance.toFixed(2),
                  })}
                </Typography>
              )}
              <br />
              <Box sx={{ textAlign: "center" }}>
                <FireBtn
                  sx={{ width: "100%" }}
                  onClick={() => handleSellGoverTokenToCGA()}
                  loading={sellGoverTokenLoading}
                  disabled={swapAmount > GoverTokenBalance}
                >
                  {getTranslation("sell$GoverToken")}
                </FireBtn>
              </Box>
            </Box>
          ) : (
            <Box className="fc2">
              {getTranslation("leftTimeToSwapBackFromGoverTokenToCGA", {
                CL1: getLeftTime().hours,
                CL2: getLeftTime().mins,
                CL3: getLeftTime().secs,
              })}
            </Box>
          )}
          <br />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <a
              href="#"
              target={"_blank"}
              className="td-none"
              style={{ width: "100%", marginRight: 16 }}
            >
              <GreyBtn sx={{ width: "100%" }}>
                {getTranslation("$CGAChart")}
              </GreyBtn>
            </a>
            <a
              href="#"
              target={"_blank"}
              className="td-none"
              style={{ width: "100%" }}
            >
              <GreyBtn sx={{ width: "100%" }}>
                {getTranslation("$GoverTokenChart")}
              </GreyBtn>
            </a>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const SwapGovernanceTokenModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { swapGovernanceTokenModalOpen } = AppSelector(modalState);
  const { CGABalance, GoverTokenBalance } = AppSelector(goverTokenState);

  const { account } = useWeb3React();
  const web3 = useWeb3();
  const goverTokenContract = useGameGovernanceToken();
  const CGAContract = useCGA();
  const routerContract = usePancakeSwapRouter();

  const [value, setValue] = useState("1");

  useEffect(() => {
    getBalance();
  }, []);

  const getBalance = async () => {
    GoverTokenService.getCGAandGoverTokenBalance(
      dispatch,
      web3,
      account,
      CGAContract,
      goverTokenContract,
      routerContract
    );
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const handleClose = () => {
    dispatch(updateModalState({ swapGovernanceTokenModalOpen: false }));
  };
  return (
    <Dialog
      open={swapGovernanceTokenModalOpen}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: constants.color.popupBGColor,
        },
      }}
    >
      <Box sx={{ width: "100%", position: "relative" }}>
        <FaTimes
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            cursor: "pointer",
            zIndex: 1000,
          }}
          onClick={handleClose}
        />
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              variant="fullWidth"
              onChange={handleChange}
              aria-label="lab API tabs example"
            >
              <Tab label={getTranslation("buy$GoverToken")} value="1" />
              <Tab label={getTranslation("sell$GoverToken")} value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Buy$GovernanceToken CGABalance={CGABalance} />
          </TabPanel>
          <TabPanel value="2">
            <Sell$GovernanceToken GoverTokenBalance={GoverTokenBalance} />
          </TabPanel>
        </TabContext>
      </Box>
    </Dialog>
  );
};

export default SwapGovernanceTokenModal;
