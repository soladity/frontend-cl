import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Typography,
  Card,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Snackbar,
  Alert,
  LinearProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { MonsterCard } from "../../component/Cards/MonsterCard";
import Helmet from "react-helmet";
import { meta_constant, createlegions } from "../../config/meta.config";
import { useWeb3React } from "@web3-react/core";
import {
  useBeast,
  useLegion,
  useWarrior,
  useMonster,
  useWeb3,
  useFeeHandler,
  useBloodstone,
  useRewardPool,
  useBUSD,
  useLegionEvent,
  useVRF,
} from "../../hooks/useContract";
import {
  getLegionTokenIds,
  getLegionToken,
  canHunt,
  hunt,
  getBeastToken,
  addSupply,
  getAllMonsters,
  getSupplyCost,
  getUnclaimedBLST,
  getBloodstoneBalance,
  massHunt,
  setLegionBUSDApprove,
  getLegionBUSDAllowance,
  getBUSDBalance,
  getMonsterToHunt,
  getFee,
  getLegionBloodstoneAllowance,
  setLegionBloodstoneApprove,
  initiateHunt,
  getWalletMassHuntPending,
  getWalletHuntPending,
  initiateMassHunt,
  getMassHuntRequestId,
  getHuntRequestId,
  getVRFResult,
} from "../../hooks/contractFunction";
import { getTranslation } from "../../utils/translation";
import CommonBtn from "../../component/Buttons/CommonBtn";
import RedBGMenuItem from "./RedMenuItem";
import GreenBGMenuItem from "./GreenMenuItem";
import OrgBGMenuItem from "./OrgMenuItem";
import { Spinner } from "../../component/Buttons/Spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  initMassHuntResult,
  setMassHuntResult,
  setReloadStatus,
} from "../../actions/contractActions";
import ScrollToButton from "../../component/Scroll/ScrollToButton";
import ScrollSection from "../../component/Scroll/Section";
import Slide, { SlideProps } from "@mui/material/Slide";
import { FaTimes } from "react-icons/fa";
import { toCapitalize } from "../../utils/common";
import monstersInfo from "../../constant/monsters";

import CircularProgress from "@mui/material/CircularProgress";
import { green, yellow, red } from "@mui/material/colors";
import gameVersion from "../../utils/manageVersion";

type TransitionProps = Omit<SlideProps, "direction">;

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const useStyles = makeStyles(() => ({
  Card: {
    position: "sticky",
    zIndex: 99,
    marginTop: "24px",
    marginBottom: "4px",
    padding: 10,
    paddingTop: "20px",
    "@media(min-width: 0px)": {
      top: "115px",
    },
    "@media(min-width: 358px)": {
      top: "66px",
    },
    "@media(min-width: 813px)": {
      top: "15px",
    },
    "@media(min-width: 900px)": {
      top: "49px",
    },
  },
  Grid: {
    paddingTop: "2%",
  },
  MassHuntItemLose: {
    boxShadow:
      "rgb(0 0 0 / 37%) 0px 2px 4px 0px, rgb(14 30 37 / 85%) 0px 2px 16px 0px",
    borderRadius: 5,
  },
  MassHuntItemWin: {
    boxShadow:
      "rgb(247 247 247 / 55%) 0px 2px 4px 0px, rgb(217 221 206 / 85%) 0px 2px 16px 0px",
    animation: `$Flash linear 2s infinite`,
    borderRadius: 5,
  },
  "@keyframes Flash": {
    "0%": {
      boxShadow:
        "rgb(247 247 247 / 55%) 0px 2px 4px 0px, rgb(217 221 206 / 85%) 0px 2px 16px 0px",
    },
    "50%": {
      boxShadow:
        "rgb(247 247 247 / 30%) 0px 2px 4px 0px, rgb(217 221 206 / 40%) 0px 2px 16px 0px",
    },
    "100%": {
      boxShadow:
        "rgb(247 247 247 / 55%) 0px 2px 4px 0px, rgb(217 221 206 / 85%) 0px 2px 16px 0px",
    },
  },
}));

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

interface LegionInterface {
  name: string;
  beasts: string;
  warriors: string;
  supplies: string;
  attackPower: number;
  id: number;
  status: string;
  lastHuntTime: any;
  warriorCapacity: number;
  realPower: number;
}

const Monsters = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const web3 = useWeb3();

  //SnackBar
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState("");
  const monsterRef = React.useRef(null);

  const legionContract = useLegion();
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const monsterContract = useMonster();
  const feeHandlerContract = useFeeHandler();
  const bloodstoneContract = useBloodstone();
  const rewardPoolContract = useRewardPool();
  const busdContract = useBUSD();
  const vrfContract = useVRF();
  const legionEventContract = useLegionEvent();

  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState<string | null>("0");
  const [curComboLegionValue, setCurComboLegionValue] = useState("0");
  const [legions, setLegions] = useState(Array);
  const [legionIDs, setLegionIDs] = useState(Array);
  const [curLegion, setCurLegion] = useState<LegionInterface | null>();
  const [monsters, setMonsters] = useState(Array);
  const [curMonster, setCurMonster] = useState<MonsterInterface | null>();
  const [curMonsterID, setCurMonsterID] = useState(0);
  const [scrollMaxHeight, setScrollMaxHeight] = useState(0);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [huntedStatus, setHuntedStatus] = useState(0);
  const [continueLoading, setContinueLoading] = useState(false);
  const [huntedRoll, setHuntedRoll] = useState(0);
  const [huntAvailablePercent, setHuntAvailablePercent] = useState(0);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  const [openSupply, setOpenSupply] = React.useState(false);
  const [supplyLoading, setSupplyLoading] = React.useState(false);

  const [loadingText, setLoadingText] = React.useState("");

  const [strongestMonsterToHunt, setStrongestMonsterToHunt] = React.useState(0);

  const [supplyValues, setSupplyValues] = React.useState([0, 0, 0]);
  const [supplyOrder, setSupplyOrder] = React.useState(0);
  const [supplyCostLoading, setSupplyCostLoading] = React.useState(false);

  const [blstBalance, setBlstBalance] = React.useState(0);
  const [unclaimedBlst, setUnclaimedBlst] = React.useState(0);
  const [openMassHunt, setOpenMassHunt] = React.useState(false);

  const [massHuntLoading, setMassHuntLoading] = React.useState(false);
  const { massHuntResult } = useSelector((state: any) => state.contractReducer);
  const [massBtnEnable, setMassBtnEnable] = React.useState(false);

  const [warriorCapacity, setWarriorCapacity] = React.useState(0);
  const [checkingMassHuntBUSD, setCheckingMassHuntBUSD] = React.useState(false);

  const [huntTax, setHuntTax] = React.useState(0);

  const [huntPending, setHuntPending] = React.useState(false);
  const [massHuntPending, setMassHuntPending] = React.useState(false);

  const [revealBtnDisabled, setRevealBtnDisabled] = React.useState(false);

  const [checkHuntVRF, setCheckHuntVRF] = React.useState(false);
  const [checkMassHuntVRF, setCheckMassHuntVRF] = React.useState(false);

  const scrollArea = useCallback((node) => {
    if (node != null) {
      setScrollMaxHeight(node.scrollHeight);
    }
  }, []);

  useEffect(() => {
    if (account) {
      initialize();
    }
    setShowAnimation(
      localStorage.getItem("showAnimation")
        ? localStorage.getItem("showAnimation")
        : "0"
    );
    const huntEvent = legionContract.events
      .Hunted({})
      .on("connected", function (subscriptionId: any) {})
      .on("data", async function (event: any) {
        if (
          account == event.returnValues._addr &&
          massHuntResult.filter(
            (item: any) => item.legionId == event.returnValues.legionId
          ).length == 0
        ) {
          var huntResult = {
            legionId: event.returnValues.legionId,
            monsterId: event.returnValues.monsterId,
            percent: event.returnValues.percent,
            roll: event.returnValues.roll,
            success: event.returnValues.success,
            legionName: event.returnValues.name,
            reward: (event.returnValues.reward / Math.pow(10, 18)).toFixed(2),
          };
          dispatch(setMassHuntResult(huntResult));
        }
      });
    const huntEvent1 = legionEventContract.events
      .Hunted({})
      .on("connected", function (subscriptionId: any) {})
      .on("data", async function (event: any) {
        if (
          account == event.returnValues._addr &&
          massHuntResult.filter(
            (item: any) => item.legionId == event.returnValues.legionId
          ).length == 0
        ) {
          var huntResult = {
            legionId: event.returnValues.legionId,
            monsterId: event.returnValues.monsterId,
            percent: event.returnValues.percent,
            roll: event.returnValues.roll,
            success: event.returnValues.success,
            legionName: event.returnValues.name,
            reward: (event.returnValues.reward / Math.pow(10, 18)).toFixed(2),
          };
          dispatch(setMassHuntResult(huntResult));
        }
      });

    return () => {
      huntEvent.unsubscribe((error: any, success: any) => {
        if (success) {
        }
        if (error) {
        }
      });
      huntEvent1.unsubscribe((error: any, success: any) => {
        if (success) {
        }
        if (error) {
        }
      });
    };
  }, []);

  const initMonster = async (legions: any) => {
    let monsterTmp;
    let monsterArrary = [];
    try {
      const monsterVal = await getAllMonsters(monsterContract);
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
    } catch (error) {}
    setMonsters(monsterArrary);

    if (legions[0]) {
      for (let i = 0; i < monsterArrary.length; i++) {
        const monster: any = monsterArrary[i];
        if (parseInt(monster?.ap) <= legions[0].attackPower) {
          setStrongestMonsterToHunt(i);
        } else {
          break;
        }
      }
    }
  };

  const calcWarriorCapacity = async (legionId: any) => {
    try {
      let legionTmp = await getLegionToken(web3, legionContract, legionId);
      var warriorCapacity = 0;
      for (let j = 0; j < legionTmp.beasts.length; j++) {
        warriorCapacity += parseInt(
          (await getBeastToken(web3, beastContract, legionTmp.beasts[j]))
            .capacity
        );
      }
      setWarriorCapacity(warriorCapacity);
    } catch (error) {}
  };

  const updateMonster = async () => {
    try {
      setBlstBalance(
        await getBloodstoneBalance(web3, bloodstoneContract, account)
      );
      setUnclaimedBlst(
        await getUnclaimedBLST(web3, rewardPoolContract, account)
      );
      const legionIDS = await getLegionTokenIds(web3, legionContract, account);
      let legionTmp;
      let legionStatus = "";
      let legionArrayTmp = [];
      setMassBtnEnable(false);
      for (let i = 0; i < legionIDS.length; i++) {
        legionStatus = await canHunt(web3, legionContract, legionIDS[i]);
        legionTmp = await getLegionToken(web3, legionContract, legionIDS[i]);
        if (legionStatus === "1") {
          setMassBtnEnable(true);
        }
        legionArrayTmp.push({
          ...legionTmp,
          id: legionIDS[i],
          status: legionStatus,
          warriorCapacity: warriorCapacity,
        });
      }
      const huntableLegions = legionArrayTmp.filter(
        (item: any) => item.attackPower >= 2000
      );
      setLegions(huntableLegions);
      if (huntableLegions.length > 0) {
        const legionIndex =
          huntableLegions.length - 1 >= parseInt(curComboLegionValue)
            ? parseInt(curComboLegionValue)
            : parseInt(curComboLegionValue) - 1;
        setCurLegion(huntableLegions[legionIndex]);
        calcWarriorCapacity(huntableLegions[legionIndex].id);
        if (huntableLegions[legionIndex]) {
          for (let i = 0; i < monsters.length; i++) {
            const monster: any = monsters[i];
            if (
              parseInt(monster?.ap) <= huntableLegions[legionIndex].attackPower
            ) {
              setStrongestMonsterToHunt(i);
            } else {
              break;
            }
          }
        }
      }
    } catch (error) {}
  };

  const initialize = async () => {
    try {
      setLoading(true);
      setHuntTax((await getFee(feeHandlerContract, 1)) / 10000);
      setBlstBalance(
        await getBloodstoneBalance(web3, bloodstoneContract, account)
      );
      setUnclaimedBlst(
        await getUnclaimedBLST(web3, rewardPoolContract, account)
      );
      const legionIDS = await getLegionTokenIds(web3, legionContract, account);
      let legionTmp;
      let legionArrayTmp = [];
      let legionStatus = "";
      setMassBtnEnable(false);
      for (let i = 0; i < legionIDS.length; i++) {
        legionStatus = await canHunt(web3, legionContract, legionIDS[i]);
        legionTmp = await getLegionToken(web3, legionContract, legionIDS[i]);
        if (legionStatus === "1") {
          setMassBtnEnable(true);
        }
        legionArrayTmp.push({
          ...legionTmp,
          id: legionIDS[i],
          status: legionStatus,
          warriorCapacity: warriorCapacity,
        });
        calcWarriorCapacity(legionIDS[0]);
      }
      const huntableLegions = legionArrayTmp.filter(
        (item: any) => item.attackPower >= 2000
      );
      let huntPending;
      huntPending = await getWalletHuntPending(legionContract, account);
      setHuntPending(huntPending);

      let massHuntPending;
      massHuntPending = await getWalletMassHuntPending(legionContract, account);
      setMassHuntPending(massHuntPending);

      await initMonster(huntableLegions);
      setLegionIDs(legionIDS);
      setLegions(huntableLegions);
      setCurLegion(huntableLegions[0]);
    } catch (error) {}
    setLoading(false);
  };

  const handleDialogClose = (reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    setDialogVisible(false);
  };

  const handleCurLegionValue = (e: SelectChangeEvent) => {
    const selectedIndex = parseInt(e.target.value);
    const curLegionTmp = (legions as any)[selectedIndex] as LegionInterface;
    for (let i = 0; i < monsters.length; i++) {
      const monster: any = monsters[i];
      if (parseInt(monster?.ap) <= curLegionTmp.attackPower) {
        setStrongestMonsterToHunt(i);
      } else {
        break;
      }
    }
    calcWarriorCapacity(curLegionTmp.id);
    setCurComboLegionValue(e.target.value as string);
    setCurLegion(curLegionTmp);
  };

  const checkRevealHuntStatus = () => {
    const revealChecker = setInterval(async () => {
      const requestId = await getHuntRequestId(legionContract, account);
      const returnVal = await getVRFResult(vrfContract, requestId);
      if (returnVal != 0) {
        setCheckHuntVRF(false);
        clearInterval(revealChecker);
      }
    }, 1000);
  };

  const handleInitiateHunt = async (monsterTokenID: number) => {
    setDialogVisible(true);
    setCurMonsterID(monsterTokenID);
    setCurMonster(monsters[monsterTokenID - 1] as MonsterInterface);
    try {
      let huntPending;
      huntPending = await getWalletHuntPending(legionContract, account);
      setHuntPending(huntPending);
      if (!huntPending) {
        await initiateHunt(legionContract, account);
        huntPending = await getWalletHuntPending(legionContract, account);
        checkRevealHuntStatus();
        setCheckHuntVRF(true);
        setHuntPending(huntPending);
      }
    } catch (error) {
      setDialogVisible(false);
    }
  };

  const handleHunt = async () => {
    setDialogVisible(true);
    setCurMonster(monsters[curMonsterID - 1] as MonsterInterface);
    try {
      setRevealBtnDisabled(true);
      const BUSD =
        (await getBUSDBalance(busdContract, account)) / Math.pow(10, 18);
      if (
        BUSD >=
        (monsters[curMonsterID - 1] as MonsterInterface).BUSDReward * huntTax
      ) {
        try {
          setRevealBtnDisabled(true);
          const allowance = await getLegionBUSDAllowance(
            web3,
            busdContract,
            account
          );
          if (allowance == 0) {
            await setLegionBUSDApprove(web3, busdContract, account);
          }
          let response = await hunt(
            web3,
            legionContract,
            account,
            curLegion?.id,
            curMonsterID
          );
          const keys = Object.keys(response.events);
          const result = response.events["Hunted"].returnValues;
          setHuntedRoll(result.roll);
          setHuntAvailablePercent(result.percent);
          setHuntedStatus(result.success ? 1 : 2);
          dispatch(
            setReloadStatus({
              reloadContractStatus: new Date(),
            })
          );
          setRevealBtnDisabled(false);
        } catch (error: any) {
          setDialogVisible(false);
          if (error.code == 4001) {
          } else {
            setSnackBarMessage(getTranslation("huntTransactionFailed"));
            setOpenSnackBar(true);
          }
        }
      } else {
        setSnackBarMessage(getTranslation("addBUSD"));
        setOpenSnackBar(true);
      }
    } catch (err) {
      setDialogVisible(false);
    }
    setRevealBtnDisabled(false);
  };

  const handleContinue = async () => {
    setContinueLoading(true);
    await updateMonster();
    setDialogVisible(false);
    setHuntedStatus(0);
    setContinueLoading(false);
    setOpenMassHunt(false);
    dispatch(
      setReloadStatus({
        reloadContractStatus: new Date(),
      })
    );
    dispatch(initMassHuntResult());
  };

  const handleSupplyClose = () => {
    setOpenSupply(false);
  };

  const handleSupplyClick = async (fromWallet: boolean) => {
    setLoadingText(getTranslation("buyingSupplies"));
    setSupplyLoading(true);
    setOpenSupply(false);
    const allowance = await getLegionBloodstoneAllowance(
      web3,
      bloodstoneContract,
      account
    );
    try {
      if (allowance === "0") {
        await setLegionBloodstoneApprove(web3, bloodstoneContract, account);
      }
      await addSupply(
        web3,
        legionContract,
        account,
        curLegion?.id,
        supplyOrder == 0 ? 7 : supplyOrder == 1 ? 14 : 28,
        fromWallet
      );
      setLoadingText(getTranslation("loadingLegions"));
      dispatch(
        setReloadStatus({
          reloadContractStatus: new Date(),
        })
      );
      await updateMonster();
    } catch (e) {}
    setSupplyLoading(false);
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

  const checkHuntTime = () => {
    var lastHuntedTime = Math.max(
      ...legions.map((item: any) => parseInt(item.lastHuntTime))
    );
    if (lastHuntedTime != -Infinity) {
      if (lastHuntedTime != 0) {
        var diff = currentTime.getTime() - lastHuntedTime * 1000;
        if (diff / 1000 / 3600 >= 24) {
        } else {
          var totalSecs = parseInt(
            ((24 * 1000 * 3600 - diff) / 1000).toFixed(2)
          );
          var hours = Math.floor(totalSecs / 3600).toFixed(0);
          var mins = Math.floor((totalSecs % 3600) / 60).toFixed(0);
          var secs = (Math.floor(totalSecs % 3600) % 60).toFixed(0);
          if (
            parseInt(hours) == 0 &&
            parseInt(mins) == 0 &&
            parseInt(secs) == 0
          ) {
            updateMonster();
          }
        }
      }
    }
  };

  const getSupplyValues = async () => {
    setSupplyCostLoading(true);
    try {
      setOpenSupply(true);
      var tempArr = [];
      tempArr.push(
        await getSupplyCost(feeHandlerContract, curLegion?.warriors.length, 7)
      );
      tempArr.push(
        await getSupplyCost(feeHandlerContract, curLegion?.warriors.length, 14)
      );
      tempArr.push(
        await getSupplyCost(feeHandlerContract, curLegion?.warriors.length, 28)
      );
      setSupplyValues(tempArr);
    } catch (error) {}
    setSupplyCostLoading(false);
  };

  const checkRevealMassHuntStatus = () => {
    const revealChecker = setInterval(async () => {
      const requestId = await getMassHuntRequestId(legionContract, account);
      const returnVal = await getVRFResult(vrfContract, requestId);
      if (returnVal != 0) {
        setCheckMassHuntVRF(false);
        clearInterval(revealChecker);
      }
    }, 1000);
  };

  const handleInitiateMassHunt = async () => {
    setOpenMassHunt(true);
    try {
      let massHuntPending;
      massHuntPending = await getWalletMassHuntPending(legionContract, account);
      setMassHuntPending(massHuntPending);
      if (!massHuntPending) {
        setMassHuntLoading(true);
        await initiateMassHunt(legionContract, account);
        setMassHuntLoading(false);
        setCheckMassHuntVRF(true);
        checkRevealMassHuntStatus();
        massHuntPending = await getWalletMassHuntPending(
          legionContract,
          account
        );
        setMassHuntPending(massHuntPending);
      }
    } catch (error) {
      setOpenMassHunt(false);
      setMassHuntLoading(false);
    }
  };

  const handleMassHunting = async () => {
    setCheckingMassHuntBUSD(true);
    const BUSD =
      (await getBUSDBalance(busdContract, account)) / Math.pow(10, 18);
    const totalBUSD = await checkMassHuntBUSD();
    if (BUSD >= totalBUSD * huntTax) {
      dispatch(initMassHuntResult());
      setOpenMassHunt(true);
      setMassHuntLoading(true);
      try {
        const allowance = await getLegionBUSDAllowance(
          web3,
          busdContract,
          account
        );
        if (allowance == 0) {
          await setLegionBUSDApprove(web3, busdContract, account);
        }
        await massHunt(legionContract, account);
        let massHuntPending;
        massHuntPending = await getWalletMassHuntPending(
          legionContract,
          account
        );
        setMassHuntPending(massHuntPending);
      } catch (error) {
        setOpenMassHunt(false);
      }
      setMassHuntLoading(false);
    } else {
      setSnackBarMessage(getTranslation("addBUSD"));
      setOpenSnackBar(true);
    }
    setCheckingMassHuntBUSD(false);
  };

  const handleMassHuntClose = (reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    setOpenMassHunt(false);
  };

  const checkMassHuntBUSD = async () => {
    let totalBUSD = 0;
    const legionIDS = await getLegionTokenIds(web3, legionContract, account);
    for (let i = 0; i < legionIDS.length; i++) {
      const huntStatus = await canHunt(web3, legionContract, legionIDS[i]);
      if (huntStatus == "1") {
        const legion = await getLegionToken(web3, legionContract, legionIDS[i]);

        const monsterId = await getMonsterToHunt(
          monsterContract,
          legion.realPower
        );

        totalBUSD += (monsters[parseInt(monsterId) - 1] as MonsterInterface)
          .BUSDReward;
      }
    }
    return totalBUSD;
  };

  React.useEffect(() => {
    setTimeout(() => {
      setCurrentTime(new Date());
    }, 1000);
    checkHuntTime();
  }, [currentTime]);

  return (
    <Box>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta_constant.monster.title}</title>
        <meta name="description" content={meta_constant.monster.description} />
        {meta_constant.monster.keywords && (
          <meta
            name="keywords"
            content={meta_constant.monster.keywords.join(",")}
          />
        )}
      </Helmet>
      {loading === false && (
        <Box
          component="div"
          sx={{ position: "relative" }}
          ref={scrollArea}
          id="monsters"
        >
          {legions.length === 0 ? (
            <Card className={classes.Card}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: "10px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                }}
              >
                <Box
                  sx={{
                    fontWeight: "bold",
                    fontSize: "calc(17px + 5 * (100vw - 320px) / 1080)",
                  }}
                >
                  {getTranslation("noMintedLegion")}
                </Box>
                <CommonBtn sx={{ fontWeight: "bold", ml: 2 }}>
                  <NavLink to="/createlegions" className="non-style">
                    {getTranslation("createLegion")}
                  </NavLink>
                </CommonBtn>
              </Box>
            </Card>
          ) : (
            <Card className={classes.Card}>
              <Grid
                container
                spacing={2}
                sx={{ justifyContent: "center" }}
                alignItems="center"
                columns={70}
              >
                <Grid item xs={70} sm={70} md={20}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      {getTranslation("legions")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={curComboLegionValue}
                      label="Current Legion"
                      onChange={handleCurLegionValue}
                    >
                      {legions.map((legion: any, index) =>
                        legion.status === "1" ? (
                          <GreenBGMenuItem value={index} key={index}>
                            #{legion.id} {legion.name} ({legion.attackPower} AP)
                          </GreenBGMenuItem>
                        ) : legion.status === "2" ? (
                          <OrgBGMenuItem value={index} key={index}>
                            #{legion.id} {legion.name} ({legion.attackPower} AP)
                          </OrgBGMenuItem>
                        ) : (
                          <RedBGMenuItem value={index} key={index}>
                            #{legion.id} {legion.name} ({legion.attackPower} AP)
                          </RedBGMenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={35} sm={35} md={9}>
                  <ScrollToButton
                    toId={"monster" + strongestMonsterToHunt}
                    duration={1000}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: {
                          xs: 14,
                          sm: 16,
                          md: 20,
                        },
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      {curLegion?.attackPower.toFixed(0)} AP
                    </Typography>
                  </ScrollToButton>
                </Grid>
                <Grid item xs={35} sm={35} md={7}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: 14, sm: 16, md: 20 },
                    }}
                  >
                    W {curLegion?.warriors.length}/{warriorCapacity}
                  </Typography>
                </Grid>
                <Grid item xs={35} sm={35} md={7}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: 14, sm: 16, md: 20 },
                    }}
                  >
                    B {curLegion?.beasts.length}/
                    {createlegions.main.maxAvailableDragCount}
                  </Typography>
                </Grid>
                <Grid item xs={35} sm={35} md={7}>
                  <Typography
                    variant="h5"
                    sx={{
                      color:
                        curLegion?.status === "1"
                          ? "#18e001"
                          : curLegion?.status === "2"
                          ? "#ae7c00"
                          : "#fd3742",
                      fontWeight: 1000,
                      fontSize: { xs: 14, sm: 16, md: 20 },
                      cursor: "pointer",
                    }}
                    onClick={() => getSupplyValues()}
                  >
                    {curLegion?.supplies}
                    {getTranslation("hSymbol")}{" "}
                    {curLegion?.supplies == "0" &&
                      "(" + getTranslation("suppliesNeeded") + ")"}
                  </Typography>
                </Grid>
                <Grid item xs={35} sm={35} md={10}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: 14, sm: 16, md: 20 },
                    }}
                  >
                    {calcHuntTime(curLegion?.lastHuntTime)}
                  </Typography>
                </Grid>
                <Grid item xs={35} sm={35} md={10} sx={{ marginRight: "auto" }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: 14, sm: 16, md: 20 },
                    }}
                  >
                    {checkingMassHuntBUSD ? (
                      <CommonBtn
                        onClick={() => handleInitiateMassHunt()}
                        sx={{ fontWeight: "bold" }}
                        disabled
                      >
                        <Spinner color="white" size={40} />
                        &nbsp;
                        {getTranslation("takeActionMassHunt")}
                      </CommonBtn>
                    ) : (
                      <CommonBtn
                        onClick={() => handleInitiateMassHunt()}
                        sx={{ fontWeight: "bold" }}
                        disabled={!massBtnEnable}
                      >
                        {getTranslation("takeActionMassHunt")}
                      </CommonBtn>
                    )}
                  </Typography>
                </Grid>
              </Grid>
              {supplyLoading && (
                <Box
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingLeft: 10,
                    paddingRight: 10,
                    display: "flex",
                    alignItems: "center",
                    background: "#222222ee",
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ textAlign: "center", marginBottom: 1 }}>
                      {loadingText}
                    </Box>
                    <LinearProgress sx={{ width: "100%" }} color="success" />
                  </Box>
                </Box>
              )}
            </Card>
          )}
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            className={classes.Grid}
          >
            {monsters.map(
              (monster: any | MonsterInterface, index) =>
                // <Box component='div' sx={{ width: '100%', my: 1 }} key={index}> xs={32} sm={30} md={20} lg={15} xl={12}

                (index !== 24 ||
                  new Date() > gameVersion.baseTimeToShowMonster25) && (
                  <Grid
                    item
                    sx={{
                      width: "700px",
                      height: "500px",
                      maxWidth: "500px",
                      maxHeight: "700px",
                      margin: "auto",
                      marginBottom: "200px",
                    }}
                    key={index}
                  >
                    <ScrollSection id={"monster" + index}>
                      <MonsterCard
                        image={
                          showAnimation === "0"
                            ? `/assets/images/characters/jpg/monsters/m${
                                index + 1
                              }.jpg`
                            : `/assets/images/characters/gif/monsters/m${
                                index + 1
                              }.gif`
                        }
                        name={monster.name}
                        tokenID={index + 1}
                        base={monster.base}
                        minAP={monster.ap}
                        bonus={
                          index < 20 &&
                          curLegion &&
                          monster.ap <
                            (curLegion as LegionInterface).attackPower
                            ? parseInt(monster.base) +
                                ((curLegion as LegionInterface).attackPower -
                                  monster.ap) /
                                  2000 >
                              89
                              ? 89 - parseInt(monster.base) + ""
                              : Math.floor(
                                  ((curLegion as LegionInterface).attackPower -
                                    monster.ap) /
                                    2000
                                ) + ""
                            : "0"
                        }
                        price={monster.reward}
                        isHuntable={
                          curLegion?.status === "1" &&
                          monster.ap <=
                            (curLegion as LegionInterface).attackPower
                        }
                        handleHunt={handleInitiateHunt}
                      />
                    </ScrollSection>
                  </Grid>
                )
              // </Box>
            )}
          </Grid>
        </Box>
      )}
      {/* {loading === false && legions.length === 0 && (
        <Grid container justifyContent="center" sx={{ paddingTop: "20%" }}>
          <Grid item>
            <Typography variant="h4">
              {getTranslation("noMintedLegion")}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center", marginTop: 2 }}>
            <CommonBtn sx={{ fontWeight: "bold" }}>
              <NavLink to="/createlegions" className="non-style">
                {getTranslation("createLegion")}
              </NavLink>
            </CommonBtn>
          </Grid>
        </Grid>
      )} */}
      {loading === true && (
        <>
          <Grid
            item
            xs={12}
            sx={{ p: 4, textAlign: "center", paddingTop: "20%" }}
            className={classes.Grid}
          >
            <Typography variant="h4">
              {getTranslation("loadingMonsters")}
            </Typography>
          </Grid>
          <Grid container sx={{ justifyContent: "center" }}>
            <Grid item xs={1}>
              <Card>
                <CardMedia
                  component="img"
                  image="/assets/images/loading.gif"
                  alt="Loading"
                  loading="lazy"
                />
              </Card>
            </Grid>
          </Grid>
        </>
      )}
      <Dialog
        disableEscapeKeyDown
        onClose={(_, reason) => handleDialogClose(reason)}
        open={dialogVisible}
      >
        {huntedStatus === 0 && (
          <>
            <DialogTitle sx={{ textAlign: "center" }}>
              <Box component="p">{getTranslation("huntTime")}</Box>
              {getTranslation("huntTimeSubtitle1")}
              <Box component="p">
                #{curMonsterID} {curMonster?.name.toUpperCase()}
              </Box>
              {huntPending && (
                <CommonBtn
                  style={{ fontWeight: "bold" }}
                  onClick={() => {
                    setTimeout(() => {
                      handleHunt();
                    }, 1500);
                  }}
                  disabled={revealBtnDisabled || checkHuntVRF}
                >
                  {revealBtnDisabled ? (
                    <Spinner color="white" size={40} />
                  ) : (
                    <Box>
                      {getTranslation("revealResult")}
                      {checkHuntVRF && (
                        <CircularProgress
                          size={24}
                          sx={{
                            color: yellow[500],
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            marginTop: "-12px",
                            marginLeft: "-12px",
                          }}
                        />
                      )}
                    </Box>
                  )}
                </CommonBtn>
              )}
            </DialogTitle>
            <DialogContent>
              <CardMedia
                component="img"
                image="/assets/images/waiting.gif"
                alt="Monster Image"
                loading="lazy"
              />
            </DialogContent>
          </>
        )}
        {huntedStatus === 1 && (
          <>
            <DialogTitle sx={{ textAlign: "center" }}>
              <>
                <Box component="p">{getTranslation("congratulation")}</Box>
                <Typography>{getTranslation("congSubtitle1")}</Typography>
                <Box component="p">
                  {getTranslation("congSubtitle2").toUpperCase()}{" "}
                  {curMonster?.reward} $BLST
                </Box>
              </>
            </DialogTitle>
            <DialogContent>
              <Box component="div" sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={
                    showAnimation === "0"
                      ? `/assets/images/characters/jpg/monsters_dying/m${curMonsterID}.jpg`
                      : `/assets/images/characters/gif/monsters_dying/m${curMonsterID}.gif`
                  }
                  alt="Monster Image"
                  loading="lazy"
                />
              </Box>
            </DialogContent>
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
              }}
            >
              {continueLoading ? (
                <Typography> {getTranslation("waitLoading")}</Typography>
              ) : (
                <Box component="div" sx={{ marginRight: 1 }}>
                  <Typography>
                    {getTranslation("yourRollTitle")} {huntedRoll}
                  </Typography>
                  <Typography>
                    {getTranslation("congSubtitle3")} {huntAvailablePercent}
                  </Typography>
                </Box>
              )}
              <CommonBtn
                onClick={() => handleContinue()}
                disabled={continueLoading}
                sx={{ paddingX: 3, fontWeight: "bold" }}
              >
                {continueLoading ? (
                  <Spinner color="white" size={40} />
                ) : (
                  getTranslation("continue")
                )}
              </CommonBtn>
            </DialogActions>
          </>
        )}
        {huntedStatus === 2 && (
          <>
            <DialogTitle sx={{ textAlign: "center" }}>
              <>
                <Box component="p">{getTranslation("defeatTitle")}</Box>
                {getTranslation("defeatSubtitle1")}
              </>
            </DialogTitle>
            <DialogContent>
              <Box component="div" sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image="/assets/images/loosing.gif"
                  alt="Monster Image"
                  loading="lazy"
                />
              </Box>
            </DialogContent>
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
              }}
            >
              {continueLoading ? (
                <Typography> {getTranslation("waitLoading")}</Typography>
              ) : (
                <Box component="div" sx={{ marginRight: 1 }}>
                  <Typography>
                    {getTranslation("yourRollTitle")} {huntedRoll}
                  </Typography>
                  <Typography>
                    {getTranslation("defeatSubtitle2")} {huntAvailablePercent}
                  </Typography>
                </Box>
              )}
              <CommonBtn
                onClick={() => handleContinue()}
                disabled={continueLoading}
                sx={{ paddingX: 3, fontWeight: "bold" }}
              >
                {continueLoading ? (
                  <Spinner color="white" size={40} />
                ) : (
                  getTranslation("continue")
                )}
              </CommonBtn>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Snackbar
        open={openSnackBar}
        TransitionComponent={TransitionUp}
        autoHideDuration={6000}
        onClose={() => setOpenSnackBar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        key={TransitionUp ? TransitionUp.name : ""}
      >
        <Alert
          onClose={() => setOpenSnackBar(false)}
          variant="filled"
          severity="error"
          sx={{ width: "100%" }}
        >
          <Box sx={{ cursor: "pointer" }}>{snackBarMessage}</Box>
        </Alert>
      </Snackbar>

      <Dialog onClose={handleSupplyClose} open={openSupply}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ p: 1, visibility: "hidden" }}>
            <FaTimes />
          </Box>
          <DialogTitle sx={{ textAlign: "center" }}>
            {getTranslation("buySupply")}
          </DialogTitle>
          <Box sx={{ p: 1, cursor: "pointer" }} onClick={handleSupplyClose}>
            <FaTimes />
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
          <RadioGroup
            sx={{ margin: "0 auto" }}
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(e) => setSupplyOrder(parseInt(e.target.value))}
            value={supplyOrder}
          >
            <FormControlLabel
              value={0}
              control={<Radio />}
              label={`7 ${getTranslation("hunts")} (${(
                supplyValues[0] / Math.pow(10, 18)
              ).toFixed(2)} $BLST)`}
            />
            <FormControlLabel
              value={1}
              control={<Radio />}
              label={`14 ${getTranslation("hunts")} (${(
                supplyValues[1] / Math.pow(10, 18)
              ).toFixed(2)} $BLST)`}
            />
            <FormControlLabel
              value={2}
              control={<Radio />}
              label={`28 ${getTranslation("hunts")} (${(
                supplyValues[2] / Math.pow(10, 18)
              ).toFixed(2)} $BLST)`}
            />
          </RadioGroup>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            p: 1,
          }}
        >
          <CommonBtn
            onClick={() => handleSupplyClick(true)}
            sx={{ marginRight: 1, marginLeft: 1 }}
            disabled={
              parseFloat(blstBalance * Math.pow(10, 18) + "") <
                parseFloat(supplyValues[supplyOrder] + "") || supplyCostLoading
            }
          >
            {getTranslation("wallet")}
          </CommonBtn>
          <CommonBtn
            onClick={() => handleSupplyClick(false)}
            disabled={
              parseFloat(unclaimedBlst + "") <
                parseFloat(supplyValues[supplyOrder] + "") || supplyCostLoading
            }
          >
            {getTranslation("unclaimed")}
          </CommonBtn>
        </Box>
        {supplyCostLoading && (
          <Box
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              paddingLeft: 10,
              paddingRight: 10,
              display: "flex",
              alignItems: "center",
              background: "#222222ee",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Box sx={{ textAlign: "center", marginBottom: 1 }}>
                {getTranslation("supplyCostLoading")}
              </Box>
              <LinearProgress sx={{ width: "100%" }} color="success" />
            </Box>
          </Box>
        )}
      </Dialog>
      <Dialog
        disableEscapeKeyDown
        onClose={(_, reason) => handleMassHuntClose(reason)}
        open={openMassHunt}
        sx={{ p: 1 }}
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          {getTranslation("massHuntResult")}
        </DialogTitle>
        {/* {massHuntPending && (
          <CommonBtn
            style={{ fontWeight: "bold" }}
            onClick={() => initiateHunt()}
          >
            {getTranslation("revealResult")}
          </CommonBtn>
        )} */}
        {massHuntLoading ? (
          <Box sx={{ p: 1 }}>
            <LinearProgress sx={{ width: "100%" }} color="success" />
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {massHuntPending &&
              (checkingMassHuntBUSD ? (
                <CommonBtn
                  onClick={() => handleMassHunting()}
                  sx={{ fontWeight: "bold" }}
                  disabled={checkMassHuntVRF}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Spinner color="white" size={40} />
                    &nbsp;
                    {getTranslation("revealResult")}
                    {checkMassHuntVRF && (
                      <CircularProgress
                        size={24}
                        sx={{
                          color: yellow[500],
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          marginTop: "-12px",
                          marginLeft: "-12px",
                        }}
                      />
                    )}
                  </Box>
                </CommonBtn>
              ) : (
                <CommonBtn
                  onClick={() => handleMassHunting()}
                  sx={{ fontWeight: "bold" }}
                  disabled={!massBtnEnable || checkMassHuntVRF}
                >
                  <Box>
                    {getTranslation("revealResult")}
                    {checkMassHuntVRF && (
                      <CircularProgress
                        size={24}
                        sx={{
                          color: yellow[500],
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          marginTop: "-12px",
                          marginLeft: "-12px",
                        }}
                      />
                    )}
                  </Box>
                </CommonBtn>
              ))}
          </Box>
        )}
        <Box
          sx={{
            p: 1,
            display: "flex",
            flexWrap: "wrap",
            maxHeight: 500,
            overflowY: "auto",
            justifyContent: "space-around",
          }}
        >
          {massHuntResult.map((item: any, index: any) => (
            <Box
              key={index}
              className={
                item.success
                  ? classes.MassHuntItemWin
                  : classes.MassHuntItemLose
              }
              sx={{ textAlign: "center", margin: 1, width: 170, p: 1 }}
            >
              {item.success ? (
                <img
                  src={
                    showAnimation === "0"
                      ? `/assets/images/characters/jpg/monsters_dying/m${item["monsterId"]}.jpg`
                      : `/assets/images/characters/gif/monsters_dying/m${item["monsterId"]}.gif`
                  }
                  style={{ width: "100%" }}
                />
              ) : (
                <img
                  src={
                    showAnimation === "0"
                      ? `/assets/images/characters/jpg/monsters/m${item["monsterId"]}.jpg`
                      : `/assets/images/characters/gif/monsters/m${item["monsterId"]}.gif`
                  }
                  style={{ width: "100%" }}
                />
              )}
              <Box sx={{ p: 1, wordBreak: "break-word" }}>
                {item.legionName}
              </Box>
              <Box sx={{ fontSize: 12 }}>
                <span style={{ fontWeight: "bold" }}>
                  #{item.monsterId}{" "}
                  {toCapitalize(
                    monstersInfo[parseInt(item.monsterId) - 1].name
                  )}
                </span>
              </Box>
              <Box sx={{ fontSize: 12 }}>
                <span>
                  {getTranslation("maxRoll")}: {item.percent}
                </span>
              </Box>
              <Box sx={{ fontSize: 12 }}>
                <span>
                  {getTranslation("yourRoll")}: {item.roll}
                </span>
              </Box>
              <Box sx={{ p: 1, fontSize: 12, fontWeight: "bold" }}>
                {item.success ? (
                  <span>
                    {getTranslation("won")} {item.reward} $BLST
                  </span>
                ) : (
                  <span>{getTranslation("lost")}</span>
                )}
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", p: 1, justifyContent: "space-between" }}>
          {!massHuntPending && (
            <CommonBtn
              onClick={() => handleContinue()}
              disabled={continueLoading || massHuntLoading || massHuntPending}
              sx={{ marginLeft: "auto", fontWeight: "bold" }}
            >
              {continueLoading || massHuntPending ? (
                <Spinner color="white" size={40} />
              ) : (
                getTranslation("continue")
              )}
            </CommonBtn>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default Monsters;
