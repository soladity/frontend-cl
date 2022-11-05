import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  Checkbox,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaTimes } from "react-icons/fa";
import { AppDispatch, AppSelector } from "../../store";
import { getClaimedBUSDAlertAmount, inventoryState } from "../../reducers/inventory.reducer";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { formatNumber, getTranslation } from "../../utils/utils";
import {
  useFeeHandler,
  useRewardPool,
  useWeb3,
} from "../../web3hooks/useContract";
import { getBLSTAmount, getUSDAmount } from "../../web3hooks/contractFunctions/feehandler.contract";
import { claimToWallet, lastClaimedTime } from "../../web3hooks/contractFunctions/rewardpool.contract";
import { useWeb3React } from "@web3-react/core";
import FireBtn from "../Buttons/FireBtn";
import { toast } from "react-toastify";

const ClaimToWalletTextField = styled(TextField)({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },

  "& input.MuiInput-input": {
    paddingTop: "0px",
    paddingBottom: "0px",
    textAlign: "center",
    MozAppearance: "TextField",
    maxWidth: "5em",
  },
});

const MaxCheckBox = styled(Checkbox)({
  paddingTop: "0px",
  paddingBottom: "0px",
});

const ClaimToWalletModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { claimedUSD, claimedBLST } = AppSelector(inventoryState);
  const { claimToWalletModalOpen } = AppSelector(modalState);

  const { account } = useWeb3React();
  const web3 = useWeb3();
  const feehandlerContract = useFeeHandler();
  const rewardpoolContract = useRewardPool();
  const [claimToWalletAmount, setClaimToWalletAmount] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [isMax, setIsMax] = useState<boolean>(false);
  const [lastClaimTime, setLastClaimTime] = useState<string>("2022-11-04");
  const [leftTime, setLeftTime] = useState<string>("");

  const handleChangeClaimToWalletAmount = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const amount = parseFloat(e.target.value);
    if (
      amount > maxAmount ||
      amount * 100 - Math.floor(amount * 100) > 0 ||
      amount < 0
    ) {
      setClaimToWalletAmount(claimToWalletAmount);
      return;
    }
    setClaimToWalletAmount(amount);
  };

  const handleIsMax = () => {
    setIsMax(!isMax);
  };

  const setMaxBlstAmount = async () => {
    let blstAmount = 0;
    if (claimedUSD < 250) {
      blstAmount = Number(claimedBLST);
    } else if (claimedUSD >= 250 && claimedUSD < 1000) {
      blstAmount = await getBLSTAmount(web3, feehandlerContract, 250);
    } else if (claimedUSD >= 1000 && claimedUSD < 20000) {
      blstAmount = await getBLSTAmount(
        web3,
        feehandlerContract,
        Number(claimedUSD) / 4
      );
    } else {
      blstAmount = await getBLSTAmount(web3, feehandlerContract, 5000);
    }
    setMaxAmount(Number(blstAmount));
  };

  useEffect(() => {
    if (isMax) {
      setClaimToWalletAmount(maxAmount);
    }
  }, [isMax]);

  const getLastClaimedTime = async () => {
    const lastTime = await lastClaimedTime(rewardpoolContract, account);
    setLastClaimTime(lastTime);
  };

  useEffect(() => {
    if (claimToWalletModalOpen == true) {
      getLastClaimedTime();
      setMaxBlstAmount();
    }
  }, [claimToWalletModalOpen]);

  const handleClose = () => {
    dispatch(
      updateModalState({
        claimToWalletModalOpen: false,
      })
    );
  };

  const leftHour = Math.round(
    (new Date(lastClaimTime).getTime() +
      24 * 60 * 60 * 1000 -
      new Date().getTime()) /
      (60 * 60 * 1000)
  );
  const leftMin = Math.round(
    ((new Date(lastClaimTime).getTime() +
      24 * 60 * 60 * 1000 -
      new Date().getTime()) %
      (60 * 60 * 1000)) /
      (60 * 1000)
  );
  const leftSec = Math.round(
    ((new Date(lastClaimTime).getTime() +
      24 * 60 * 60 * 1000 -
      new Date().getTime()) %
      (60 * 1000)) /
      1000
  );

  useEffect(() => {
    const leftTimer = setInterval(() => {
      const left_time =
        new Date(lastClaimTime).getTime() +
        24 * 60 * 60 * 1000 -
        new Date().getTime();
      setLeftTime(
        "" +
          Math.floor(left_time / (60 * 60 * 1000)) +
          "h " +
          Math.floor((left_time % (60 * 60 * 1000)) / (60 * 1000)) +
          "m " +
          Math.floor((left_time % (60 * 1000)) / 1000) +
          "s"
      );
    }, 1000);
    return () => clearInterval(leftTimer);
  }, [leftTime, lastClaimTime]);

  const handleTransferToWallet = async () => {
    if (claimToWalletAmount == 0) {
      toast.error("Please input valid amount.");
    }
    try {
      const busdAmount = await getUSDAmount(web3, feehandlerContract, claimToWalletAmount);
      const res = await claimToWallet(rewardpoolContract, account, busdAmount);
      toast.success("Successfully transfered");
      handleClose();
    } catch (e) {
      console.log(e);
    }

  };
  //
  return (
    <Dialog open={claimToWalletModalOpen} onClose={handleClose}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography></Typography>
        <FaTimes
          style={{
            cursor: "pointer",
            fontSize: "1.2em",
            marginLeft: "1em",
          }}
          onClick={handleClose}
        />
      </DialogTitle>
      {new Date().getTime() >=
        new Date(lastClaimTime).getTime() + 24 * 60 * 60 * 1000 && (
        <DialogContent>
          <Typography mb={1}>
            You have{" "}
            {formatNumber(Number(Number(claimedBLST) / 10 ** 18).toFixed(2))} $
            {getTranslation("blst")} (={" "}
            {formatNumber(Number(Number(claimedUSD) / 10 ** 18).toFixed(2))}{" "}
            BUSD) in your Claim Wallet.
          </Typography>
          <Typography mb={1}>
            How much do you want to transfer to your MetaMask wallet?
          </Typography>
          <Stack flexDirection="row" mb={1} sx={{ flexWrap: "wrap" }}>
            <ClaimToWalletTextField
              id="outlined-number"
              variant="standard"
              type="number"
              value={claimToWalletAmount}
              onChange={handleChangeClaimToWalletAmount}
              sx={{ padding: "0 !important" }}
            />
            <Typography sx={{ fontWeight: "bold" }}>
              ${getTranslation("blst")}{" "}
            </Typography>
            <MaxCheckBox checked={isMax} onChange={handleIsMax} />
            <Typography>
              Max{" "}
              {formatNumber(Number(Number(claimedBLST) / 10 ** 18).toFixed(2))}{" "}
              ${getTranslation("blst")}{" "}
            </Typography>
            <Typography>
              {" "}
              (={" "}
              {formatNumber(
                Number(Number(claimedUSD) / 10 ** 18).toFixed(2)
              )}{" "}
              BUSD)
            </Typography>
          </Stack>
          <Box sx={{ textAlign: "center" }}>
            <FireBtn onClick={handleTransferToWallet}>Transfer</FireBtn>
          </Box>
        </DialogContent>
      )}

      {new Date().getTime() <
        new Date(lastClaimTime).getTime() + 24 * 60 * 60 * 1000 && (
        <DialogContent>
          <Typography>
            You need to wait {leftTime} to be able to transfer more into your
            MetaMask wallet.
          </Typography>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ClaimToWalletModal;
