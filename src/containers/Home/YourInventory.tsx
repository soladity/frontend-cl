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
  getUSDAmountFromBLST,
  getAllMonsters,
} from "../../hooks/contractFunction";
import {
  useBloodstone,
  useBeast,
  useWarrior,
  useLegion,
  useRewardPool,
  useWeb3,
  useFeeHandler,
  useMonster,
} from "../../hooks/useContract";
import { useSelector } from "react-redux";
import { getTranslation } from "../../utils/translation";
import { gql, useLazyQuery } from "@apollo/client";

interface MonsterInterface {
  id: number;
  base: string;
  ap: number;
  reward: string;
  image: string;
  imageAlt: string;
  name: string;
  BUSDReward: number;
}

const YourInventory = () => {
  const { reloadContractStatus } = useSelector(
    (state: any) => state.contractReducer
  );

  const getTotalWinsQuery = gql`
    query Query($address: String) {
      user(id: $address) {
        id
        totalWins
      }
    }
  `;

  const [
    loadTotalWins,
    { loading: totalWinsLoaing, error: totalWinsError, data: totalWins },
  ] = useLazyQuery(getTotalWinsQuery);

  const totalWinHistory = totalWins?.user ? totalWins?.user.totalWins : [];

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
  const [BlstToUsd, setBlstToUsd] = React.useState(0);
  const [totalBlstToUsd, setTotalBlstToUsd] = React.useState(0);
  const [monsters, setMonsters] = React.useState<MonsterInterface[]>(Array);

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

  const monsterContract = useMonster();

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
      setBlstToUsd(
        await getUSDAmountFromBLST(
          feeHandlerContract,
          BigInt(1 * Math.pow(10, 18))
        )
      );
      setTotalBlstToUsd(
        await getUSDAmountFromBLST(
          feeHandlerContract,
          BigInt(BLSTBalance * Math.pow(10, 18))
        )
      );
    } catch (error) {}
  };

  const getLastHuntTimes = async (legionTokenIds: any) => {
    var remainTimes = [];
    for (let i = 0; i < legionTokenIds.length; i++) {
      let legion = await getLegionToken(
        web3,
        legionContract,
        legionTokenIds[i]
      );
      if (
        legion.attackPower >= 2000 &&
        legion.lastHuntTime != "0" &&
        legion.supplies > 0
      ) {
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
    const diff_in_secs = (Math.floor(diffSecs % 3600) % 60).toFixed(0);
    if (firstHuntTime !== 0) {
      if (diff / (1000 * 3600 * 24) >= 1) {
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
      getBalance();
    }
    return `${diff_in_hours}h ${diff_in_mins}m ${diff_in_secs}s`;
  };

  const getAllMonsterInfo = async () => {
    let monsterArrary = [];
    try {
      const monsterVal: any = await getAllMonsters(monsterContract);
      console.log("allMonster Val: ", monsterVal);
      const monsterArraryTemp = monsterVal[0];
      const rewardArray = monsterVal[1];
      monsterArrary = monsterArraryTemp.map((item: any, index: number) => {
        return {
          name: item.name,
          base: item.percent,
          ap: item.attack_power / 100,
          reward: (rewardArray[index] / Math.pow(10, 18)).toFixed(2),
          BUSDReward: item.reward / Math.pow(10, 4),
        };
      });
      console.log(monsterArrary);
    } catch (error) {}
    // console.log(monsterArrary);
    setMonsters(monsterArrary);
  };

  const getTotalBUSD = () => {
    let totalBUSD = 0;
    totalWinHistory
      .filter((item: any) => item != 25)
      .forEach((win: any) => {
        const BUSDReward =
          monsters.length > 0 ? monsters[win - 1].BUSDReward : 0;
        totalBUSD = totalBUSD + BUSDReward;
      });
    return totalBUSD;
  };

  React.useEffect(() => {
    setTimeout(() => {
      setCurrentTime(new Date());
    }, 1000);
  }, [currentTime]);

  React.useEffect(() => {
    if (account) {
      getBalance();
      getAllMonsterInfo();
      loadTotalWins({
        variables: {
          address: account.toLowerCase(),
        },
      });
    }
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
          <span className="legionOrangeColor"> {unclaimedBLST.toFixed(2)}</span>
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
            {formatNumber((totalBlstToUsd / Math.pow(10, 18)).toFixed(2))} USD )
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
            {(BlstToUsd / Math.pow(10, 18)).toFixed(2)} USD
          </span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          Your Total Won:{" "}
          <span className="legionOrangeColor">
            {formatNumber(getTotalBUSD().toFixed(0))} BUSD
          </span>
        </Typography>
      </Box>
    </Card>
  );
};

export default YourInventory;
