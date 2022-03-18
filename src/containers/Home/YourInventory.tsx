import * as React from "react";
import {
  Grid,
  Card,
  Box,
  Button,
  Popover,
  Checkbox,
  Dialog,
  DialogTitle,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { formatNumber } from "../../utils/common";

import { useWeb3React } from "@web3-react/core";
import {
  getBloodstoneBalance,
  getBeastBalance,
  getWarriorBalance,
  getUnclaimedBLST,
  getAvailableLegionsCount,
  getTaxLeftDays,
  getMaxAttackPower,
  getLegionTokenIds,
  getLegionToken,
  getLegionLastHuntTime,
  getBLSTAmountFromUSD,
} from "../../hooks/contractFunction";
import {
  useBloodstone,
  useBeast,
  useWarrior,
  useLegion,
  useRewardPool,
  useWeb3,
  useFeeHandler,
} from "../../hooks/useContract";
import { useSelector } from "react-redux";
import { getTranslation } from "../../utils/translation";

const YourInventory = () => {
  const { reloadContractStatus } = useSelector(
    (state: any) => state.contractReducer
  );

  const [beastBalance, setBeastBalance] = React.useState(0);
  const [warriorBalance, setWarriorBalance] = React.useState(0);
  const [unclaimedBLST, setUnclaimedBLST] = React.useState(0);
  const [availableLegionCount, setAvailableLegionCount] = React.useState(0);
  const [legionTokenIds, setLegionTokenIds] = React.useState([]);
  const [taxLeftDays, setTaxLeftDays] = React.useState(0);
  const [maxAttackPower, setMaxAttackPower] = React.useState("0");
  const [BLSTBalance, setBLSTBalance] = React.useState("0");
  const [firstHuntTime, setFirstHuntTime] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [usdToBlst, setUsdToBlst] = React.useState(0);

  //account
  const { account } = useWeb3React();
  const web3 = useWeb3();

  //Legion Contract
  const legionContract = useLegion();

  //Beast Contract
  const beastContract = useBeast();

  //Warrior Contract
  const warriorContract = useWarrior();

  //RewardPool Contract
  const rewardPoolContract = useRewardPool();

  //Bloodstone Contract
  const bloodstoneContract = useBloodstone();

  //FeeHandler Contract
  const feeHandlerContract = useFeeHandler();

  //get all balances of your inventory
  const getBalance = async () => {
    try {
      const beastBalance = await getBeastBalance(web3, beastContract, account);
      setBeastBalance(beastBalance);

      const warriorBalance = await getWarriorBalance(
        web3,
        warriorContract,
        account
      );
      setWarriorBalance(warriorBalance);

      const unclaimedBLST = await getUnclaimedBLST(
        web3,
        rewardPoolContract,
        account
      );
      setUnclaimedBLST(parseFloat(unclaimedBLST) / Math.pow(10, 18));

      const availableLegionCount = await getAvailableLegionsCount(
        web3,
        legionContract,
        account
      );
      setAvailableLegionCount(availableLegionCount);

      const legionTokenIds = await getLegionTokenIds(
        web3,
        legionContract,
        account
      );

      const taxLeftDays = await getTaxLeftDays(web3, legionContract, account);
      setTaxLeftDays(parseInt(taxLeftDays));

      const maxAttackPower = await getMaxAttackPower(
        web3,
        legionContract,
        account
      );
      setMaxAttackPower(maxAttackPower);

      const BLSTBalance = await getBloodstoneBalance(
        web3,
        bloodstoneContract,
        account
      );
      setBLSTBalance(BLSTBalance);
      setLegionTokenIds(legionTokenIds);
      getLastHuntTimes(legionTokenIds);
      setUsdToBlst(await getBLSTAmountFromUSD(feeHandlerContract, 1));
    } catch (error) {
      console.log(error);
    }
  };

  const getLastHuntTimes = async (legionTokenIds: any) => {
    var remainTimes = [];
    for (let i = 0; i < legionTokenIds.length; i++) {
      let legion = await getLegionToken(
        web3,
        legionContract,
        legionTokenIds[i]
      );
      if (legion.lastHuntTime != "0" && legion.supplies > 0) {
        remainTimes.push(parseInt(legion.lastHuntTime));
      }
    }
    if (remainTimes.length > 0) {
      var first = Math.min(...remainTimes);
      setFirstHuntTime(first);
    } else {
      setFirstHuntTime(0);
    }
  };

  const calcHuntTime = (firstHuntTime: number) => {
    const date = new Date(firstHuntTime * 1000);
    const diff = currentTime.getTime() - date.getTime();
    const diffSecs = (24 * 3600 * 1000 - diff) / 1000;
    const diff_in_hours = Math.floor(diffSecs / 3600).toFixed(0);
    const diff_in_mins = Math.floor((diffSecs % 3600) / 60).toFixed(0);
    const diff_in_secs = Math.floor(diffSecs % 3600) % 60;
    if (firstHuntTime !== 0) {
      if (diff / (1000 * 3600 * 24) >= 1) {
        return "00h 00m 00s";
      }
    } else if (firstHuntTime === 0) {
      return "00h 00m 00s";
    }
    return `${diff_in_hours}h ${diff_in_mins}m ${diff_in_secs}s`;
  };

  React.useEffect(() => {
    setTimeout(() => {
      setCurrentTime(new Date());
    }, 1000);
  }, [currentTime]);

  React.useEffect(() => {
    getBalance();
  }, [reloadContractStatus]);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "180px",
        height: "100%",
        background: "#16161699",
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
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {getTranslation("warriors")}:{" "}
          <span className="legionOrangeColor">{warriorBalance}</span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {getTranslation("beasts")}:{" "}
          <span className="legionOrangeColor">{beastBalance}</span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {getTranslation("availableLegions")}:{" "}
          <span className="legionOrangeColor">
            {availableLegionCount} / {legionTokenIds.length}
          </span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {getTranslation("waitingTimeToHunt")}:
          <span className="legionOrangeColor">
            {" "}
            {calcHuntTime(firstHuntTime)}
          </span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {getTranslation("yourMaxAp")}:
          <span className="legionOrangeColor">
            {" "}
            {formatNumber(Math.floor(parseInt(maxAttackPower) / 100))}
          </span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {getTranslation("unClaimed")}:
          <span className="legionOrangeColor"> {unclaimedBLST}</span>
        </Typography>
        {unclaimedBLST > 0 && (
          <Typography
            className="legionFontColor"
            variant="subtitle1"
            sx={{ fontWeight: "bold" }}
          >
            {getTranslation("claimTax")}:
            <span className="legionOrangeColor">
              {" "}
              {((taxLeftDays * 2 * unclaimedBLST) / 100).toFixed(2)}{" "}
              {getTranslation("claimTaxVal")}
            </span>
          </Typography>
        )}
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {getTranslation("taxDaysLeft")}:
          <span className="legionOrangeColor"> {taxLeftDays}</span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {getTranslation("BLSTInYourWallet")}:
          <span className="legionOrangeColor">
            {" "}
            {formatNumber(parseFloat(BLSTBalance).toFixed(2))} ( ={" "}
            {formatNumber(
              (
                parseFloat(BLSTBalance) /
                (usdToBlst / Math.pow(10, 18))
              ).toFixed(2)
            )}{" "}
            USD )
          </span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          1 USD ={" "}
          <span className="legionOrangeColor">
            {(usdToBlst / Math.pow(10, 18)).toFixed(2)} $BLST
          </span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          1 BLST ={" "}
          <span className="legionOrangeColor">
            {(1 / (usdToBlst / Math.pow(10, 18))).toFixed(2)} USD
          </span>
        </Typography>
      </Box>
    </Card>
  );
};

export default YourInventory;
