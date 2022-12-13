import React, { useState, useEffect } from "react";
import { Box, Dialog, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { FaTimes } from "react-icons/fa";
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
import { toast } from "react-toastify";
import { gameAccessState } from "../../reducers/gameAccess.reducer";

const BuyGoverTokenToPlayModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { buyGoverTokenToPlayModalOpen } = AppSelector(modalState);
  const { CGABalance, GoverTokenBalance, buyGoverTokenLoading } =
    AppSelector(goverTokenState);
  const { entryTicketUsdAmount } = AppSelector(gameAccessState);

  const web3 = useWeb3();
  const { account } = useWeb3React();
  const CGAContract = useCGA();
  const goverTokenContract = useGameGovernanceToken();
  const routerContract = usePancakeSwapRouter();

  const [goverTokenToPlay, setGoverTokenToPlay] = useState(0);

  const needGoverTokenAmount =
    Number(goverTokenToPlay) - Number(GoverTokenBalance) + 1;
  let buyCGAAmount = 0;
  if (CGABalance < needGoverTokenAmount) {
    buyCGAAmount = needGoverTokenAmount - Number(CGABalance);
  }

  useEffect(() => {
    getBalance();
  }, []);

  const getBalance = async () => {
    const goverTokenToPlay = await GoverTokenService.getCGAInAmountForBUSD(
      routerContract,
      entryTicketUsdAmount
    );
    console.log("goverTokenToPlay: ", goverTokenToPlay);
    setGoverTokenToPlay(goverTokenToPlay);
  };

  const handleSwap = async () => {
    await GoverTokenService.buyGoverTokenWithCGA(
      dispatch,
      web3,
      account,
      CGAContract,
      goverTokenContract,
      routerContract,
      needGoverTokenAmount,
      true
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
        <Typography>
          {getTranslation("youNeedAtLeastGoverTokenToPlayGame", {
            CL1: goverTokenToPlay.toFixed(2),
          })}
        </Typography>
        {buyCGAAmount > 0 && (
          <Typography>
            {getTranslation("toObtainGoverTokenYouNeedToBuyCGA", {
              CL1: buyCGAAmount.toFixed(2),
            })}
          </Typography>
        )}
        <br />
        {buyCGAAmount > 0 ? (
          <a href="#" target={"_blank"} className="td-none">
            <Box sx={{ textAlign: "center" }}>
              <FireBtn>{getTranslation("buy$CGA")}</FireBtn>
            </Box>
          </a>
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
