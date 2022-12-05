import React, { useState, useEffect } from "react";
import { Box, Dialog, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { AppDispatch, AppSelector } from "../../store";
import { goverTokenState } from "../../reducers/goverToken.reducer";
import constants from "../../constants";
import GoverTokenService from "../../services/goverToken.service";
import gameConfig from "../../config/game.config";
import {
  useCGA,
  useGameGovernanceToken,
  usePancakeSwapRouter,
  useWeb3,
} from "../../web3hooks/useContract";
import { getTranslation } from "../../utils/utils";
import FireBtn from "../Buttons/FireBtn";
import { useWeb3React } from "@web3-react/core";

const BuyGoverTokenToPlayModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { buyGoverTokenToPlayModalOpen } = AppSelector(modalState);
  const { CGABalance, GoverTokenBalance, buyGoverTokenLoading } =
    AppSelector(goverTokenState);

  const web3 = useWeb3();
  const { account } = useWeb3React();
  const CGAContract = useCGA();
  const goverTokenContract = useGameGovernanceToken();
  const routerContract = usePancakeSwapRouter();

  const [goverTokenToPlay, setGoverTokenToPlay] = useState(0);

  const needGoverTokenAmount =
    Number(goverTokenToPlay) - Number(GoverTokenBalance);
  let buyCGAAmount = 0;
  if (CGABalance < needGoverTokenAmount) {
    buyCGAAmount = needGoverTokenAmount - Number(CGABalance);
  }

  useEffect(() => {
    getBalance();
  }, []);

  const getBalance = async () => {
    const goverTokenToPlay = await GoverTokenService.getCGAAmountForBUSD(
      routerContract,
      gameConfig.BUSDForPlay
    );
    setGoverTokenToPlay(goverTokenToPlay);
  };

  const handleSwap = async () => {
    GoverTokenService.buyGoverTokenWithCGA(
      dispatch,
      web3,
      account,
      CGAContract,
      goverTokenContract,
      routerContract,
      needGoverTokenAmount
    );
  };

  const handleClose = () => {
    dispatch(updateModalState({ buyGoverTokenToPlayModalOpen: false }));
  };

  return (
    <Dialog
      open={buyGoverTokenToPlayModalOpen}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: constants.color.popupBGColor,
        },
      }}
    >
      <Box sx={{ padding: 4 }}>
        <Typography>
          {getTranslation("youNeedAtLeastGoverTokenToPlayGame", {
            CL1: needGoverTokenAmount.toFixed(2),
          })}
        </Typography>
        {buyCGAAmount > 0 && (
          <Typography>
            {getTranslation("toObtainGoverTokenYouNeedToBuyCGA", {
              Cl1: buyCGAAmount.toFixed(2),
            })}
          </Typography>
        )}
        <br />
        {buyCGAAmount > 0 ? (
          <Box sx={{ textAlign: "center" }}>
            <FireBtn>{getTranslation("buy$CGA")}</FireBtn>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <FireBtn
              onClick={() => handleSwap()}
              loading={buyGoverTokenLoading}
            >
              {getTranslation("swapCGAToGoverToken", {
                CL1: needGoverTokenAmount.toFixed(2),
              })}
            </FireBtn>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default BuyGoverTokenToPlayModal;
