import React, { useState, useEffect } from "react";
import { Box, Dialog, Input, Tab, TextField, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useDispatch } from "react-redux";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { AppDispatch, AppSelector } from "../../store";
import constants from "../../constants";
import { convertInputNumber, getTranslation } from "../../utils/utils";
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

  const [swapAmount, setSwapAmount] = useState(0);

  const handleSwapAmount = async (e: any) => {
    let inputVal = e.target.value;
    setSwapAmount(convertInputNumber(inputVal));
  };

  const handleBuyGoverTokenWithCGA = async () => {
    await GoverTokenService.buyGoverTokenWithCGA(
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
            <GreyBtn sx={{ width: "100%", marginRight: 2 }}>
              {getTranslation("$CGAChart")}
            </GreyBtn>
            <GreyBtn sx={{ width: "100%" }}>
              {getTranslation("$GoverTokenChart")}
            </GreyBtn>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {getTranslation("swap")}
            <Input
              value={swapAmount}
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
              {getTranslation("uDoNotHaveEnoughCGAToSwap")}
            </Typography>
          )}
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
            <GreyBtn sx={{ width: "100%", marginRight: 2 }}>
              {getTranslation("$CGAChart")}
            </GreyBtn>
            <GreyBtn sx={{ width: "100%" }}>
              {getTranslation("$GoverTokenChart")}
            </GreyBtn>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const Sell$GovernanceToken: React.FC<{ GoverTokenBalance: Number }> = ({
  GoverTokenBalance,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const web3 = useWeb3();
  const { account } = useWeb3React();
  const CGAContract = useCGA();
  const goverTokenContract = useGameGovernanceToken();
  const routerContract = usePancakeSwapRouter();

  const { sellGoverTokenLoading } = AppSelector(goverTokenState);

  const [swapAmount, setSwapAmount] = useState(0);

  const handleSwapAmount = async (e: any) => {
    let inputVal = e.target.value;
    setSwapAmount(convertInputNumber(inputVal));
  };

  const handleSellGoverTokenToCGA = async () => {
    GoverTokenService.sellGoverTokenToCGA(
      dispatch,
      web3,
      account,
      CGAContract,
      goverTokenContract,
      routerContract,
      swapAmount
    );
  };

  return (
    <Box sx={{ padding: 2 }}>
      {GoverTokenBalance === 0 ? (
        <Box>
          <Box>{getTranslation("youDon'tHaveAnyGoverTokenToSell")}</Box>
          <br />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <GreyBtn sx={{ width: "100%", marginRight: 2 }}>
              {getTranslation("$CGAChart")}
            </GreyBtn>
            <GreyBtn sx={{ width: "100%" }}>
              {getTranslation("$GoverTokenChart")}
            </GreyBtn>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {getTranslation("swap")}
            <Input
              value={swapAmount}
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
              {getTranslation("uDoNotHaveEnoughGoverTokenToSell")}
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
          <br />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <GreyBtn sx={{ width: "100%", marginRight: 2 }}>
              {getTranslation("$CGAChart")}
            </GreyBtn>
            <GreyBtn sx={{ width: "100%" }}>
              {getTranslation("$GoverTokenChart")}
            </GreyBtn>
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
      <Box sx={{ width: "100%" }}>
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
