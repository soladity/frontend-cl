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
  Snackbar,
  Alert,
  LinearProgress,
  AlertColor,
  DialogContent,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { FaTimes } from "react-icons/fa";
import {
  getBeastBloodstoneAllowance,
  setBeastBloodstoneApprove,
  getWarriorBloodstoneAllowance,
  setWarriorBloodstoneApprove,
  mintBeast,
  mintWarrior,
  getAvailableLegionsCount,
  getSummoningPrice,
  massHunt,
  getAllMonsters,
  getLegionTokenIds,
  canHunt,
  getLegionToken,
  getMonsterToHunt,
  getBUSDBalance,
  getFee,
  getLegionBUSDAllowance,
  setLegionBUSDApprove,
  getWalletMintPending,
  revealBeastsAndWarrior,
  getWalletMassHuntPending,
  initiateMassHunt,
} from "../../hooks/contractFunction";
import { useWeb3React } from "@web3-react/core";
import {
  useBloodstone,
  useBeast,
  useWarrior,
  useWeb3,
  useFeeHandler,
  useLegion,
  useMonster,
  useBUSD,
  useLegionEvent,
} from "../../hooks/useContract";
import { useNavigate } from "react-router-dom";
import Slide, { SlideProps } from "@mui/material/Slide";
import { useDispatch, useSelector } from "react-redux";
import {
  initMassHuntResult,
  setMassHuntResult,
  setReloadStatus,
} from "../../actions/contractActions";
import { getTranslation } from "../../utils/translation";
import { makeStyles } from "@mui/styles";
import { NavLink } from "react-router-dom";

import CommonBtn from "../../component/Buttons/CommonBtn";
import { toCapitalize } from "../../utils/common";
import monstersInfo from "../../constant/monsters";
import { Spinner } from "../../component/Buttons/Spinner";

type TransitionProps = Omit<SlideProps, "direction">;

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const useStyles = makeStyles({
  legionBtn: {
    background:
      "linear-gradient(360deg, #973b04, #ffffff29), radial-gradient(#db5300, #ecff0e)",
    transition: ".4s all",
    color: "white !important",
    textShadow:
      "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
  },
  root: {
    display: "flex",
    flexDirection: "column",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    minHeight: "180px",
    height: "100%",
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
});

const TakeAction = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const classes = useStyles();

  const [warriorBlstAmountPer, setWarriorBlstAmountPer] = React.useState({
    b1: {
      amount: "0",
      per: "0",
    },
    b10: {
      amount: "0",
      per: "0",
    },
    b50: {
      amount: "0",
      per: "0",
    },
    b100: {
      amount: "0",
      per: "0",
    },
    b150: {
      amount: "0",
      per: "0",
    },
  });

  const [beastBlstAmountPer, setBeastBlstAmountPer] = React.useState({
    b1: {
      amount: "0",
      per: "0",
    },
    b10: {
      amount: "0",
      per: "0",
    },
    b50: {
      amount: "0",
      per: "0",
    },
    b100: {
      amount: "0",
      per: "0",
    },
    b150: {
      amount: "0",
      per: "0",
    },
  });

  const [showAnimation, setShowAnimation] = React.useState<string | null>("0");

  const [openMassHunt, setOpenMassHunt] = React.useState(false);

  const [massHuntLoading, setMassHuntLoading] = React.useState(false);

  const { massHuntResult } = useSelector((state: any) => state.contractReducer);

  const [availableLegionCount, setAvailableLegionCount] = React.useState(0);

  const [checkingMassHuntBUSD, setCheckingMassHuntBUSD] = React.useState(false);

  const [warriorRevealStatus, setWarriorRevealStatus] = React.useState(false);

  const [beastRevealStatus, setBeastRevealStatus] = React.useState(false);

  const [massHuntPending, setMassHuntPending] = React.useState(false);

  const [aletType, setAlertType] = React.useState<AlertColor | undefined>(
    "success"
  );

  const [huntTax, setHuntTax] = React.useState(0);

  //Popover for Summon Beast
  const [anchorElSummonBeast, setAnchorElSummonBeast] =
    React.useState<HTMLElement | null>(null);
  const handlePopoverOpenSummonBeast = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorElSummonBeast(event.currentTarget);
  };
  const handlePopoverCloseSummonBeast = () => {
    setAnchorElSummonBeast(null);
  };
  const openSummonBeast = Boolean(anchorElSummonBeast);

  //Popover for Summon Warrior
  const [anchorElSummonWarrior, setAnchorElSummonWarrior] =
    React.useState<HTMLElement | null>(null);
  const handlePopoverOpenSummonWarrior = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorElSummonWarrior(event.currentTarget);
  };
  const handlePopoverCloseSummonWarrior = () => {
    setAnchorElSummonWarrior(null);
  };
  const openSummonWarrior = Boolean(anchorElSummonWarrior);

  //Account
  const { account } = useWeb3React();

  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const bloodstoneContract = useBloodstone();
  const feeHandlerContract = useFeeHandler();
  const legionContract = useLegion();
  const monsterContract = useMonster();
  const busdContract = useBUSD();
  const legionEventContract = useLegionEvent();

  const web3 = useWeb3();

  //Mint Beast with quantity
  const handleBeastMint = async (
    amount: Number,
    Transition: React.ComponentType<TransitionProps>
  ) => {
    handlePopoverCloseSummonBeast();
    const allowance = await getBeastBloodstoneAllowance(
      web3,
      bloodstoneContract,
      account
    );
    if (allowance === "0") {
      await setBeastBloodstoneApprove(web3, bloodstoneContract, account);
    }
    const mintBeastPending = await getWalletMintPending(beastContract, account);
    setBeastRevealStatus(mintBeastPending);
    if (!mintBeastPending) {
      await mintWarrior(web3, beastContract, account, amount);
      const mintBeastPending = await getWalletMintPending(
        beastContract,
        account
      );
      setTransition(() => Transition);
      setAlertType("success");
      setSnackBarMessage(getTranslation("plzReveal"));
      setSnackBarNavigation("/beasts");
      setOpenSnackBar(true);
      setBeastRevealStatus(mintBeastPending);
    }
  };
  ///
  const handleBeastReveal = async (
    Transition: React.ComponentType<TransitionProps>
  ) => {
    try {
      await revealBeastsAndWarrior(beastContract, account);
      setTransition(() => Transition);
      setAlertType("success");
      setSnackBarMessage(getTranslation("summonBeastSuccessful"));
      setSnackBarNavigation("/beasts");
      setOpenSnackBar(true);
      const mintBeastPending = await getWalletMintPending(
        beastContract,
        account
      );
      setBeastRevealStatus(mintBeastPending);
      dispatch(
        setReloadStatus({
          reloadContractStatus: new Date(),
        })
      );
    } catch (error) {}
  };

  //Mint Warriors with quantity
  const handleWarriorMint = async (
    amount: Number,
    Transition: React.ComponentType<TransitionProps>
  ) => {
    handlePopoverCloseSummonWarrior();
    try {
      const allowance = await getWarriorBloodstoneAllowance(
        web3,
        bloodstoneContract,
        account
      );
      if (allowance === "0") {
        await setWarriorBloodstoneApprove(web3, bloodstoneContract, account);
      }
      const mintWarriorPending = await getWalletMintPending(
        warriorContract,
        account
      );
      setWarriorRevealStatus(mintWarriorPending);
      if (!mintWarriorPending) {
        await mintWarrior(web3, warriorContract, account, amount);
        setTransition(() => Transition);
        setAlertType("success");
        setSnackBarMessage(getTranslation("plzReveal"));
        setSnackBarNavigation("/warriors");
        setOpenSnackBar(true);
        const mintWarriorPending = await getWalletMintPending(
          warriorContract,
          account
        );
        setWarriorRevealStatus(mintWarriorPending);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleWarriorReveal = async (
    Transition: React.ComponentType<TransitionProps>
  ) => {
    try {
      await revealBeastsAndWarrior(warriorContract, account);
      setTransition(() => Transition);
      setAlertType("success");
      setSnackBarMessage(getTranslation("summonWarriorSuccessful"));
      setSnackBarNavigation("/warriors");
      setOpenSnackBar(true);
      const mintWarriorPending = await getWalletMintPending(
        warriorContract,
        account
      );
      setWarriorRevealStatus(mintWarriorPending);
      dispatch(
        setReloadStatus({
          reloadContractStatus: new Date(),
        })
      );
    } catch (error) {}
  };

  //SnackBar
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState("");
  const [snackBarNavigation, setSnackBarNavigation] = React.useState("");
  const [transition, setTransition] = React.useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);

  const getBlstAmountToMintWarrior = async () => {
    var BLST_amount_1 = "0";
    var BLST_amount_10 = "0";
    var BLST_amount_50 = "0";
    var BLST_amount_100 = "0";
    var BLST_amount_150 = "0";

    var BLST_per_1 = "0";
    var BLST_per_10 = "1";
    var BLST_per_50 = "2";
    var BLST_per_100 = "3";
    var BLST_per_150 = "5";

    try {
      BLST_amount_1 = (
        (await getSummoningPrice(feeHandlerContract, 1)) / Math.pow(10, 18)
      ).toFixed(2);
      BLST_amount_10 = (
        (await getSummoningPrice(feeHandlerContract, 10)) / Math.pow(10, 18)
      ).toFixed(2);
      BLST_amount_50 = (
        (await getSummoningPrice(feeHandlerContract, 50)) / Math.pow(10, 18)
      ).toFixed(2);
      BLST_amount_100 = (
        (await getSummoningPrice(feeHandlerContract, 100)) / Math.pow(10, 18)
      ).toFixed(2);
      BLST_amount_150 = (
        (await getSummoningPrice(feeHandlerContract, 150)) / Math.pow(10, 18)
      ).toFixed(2);
      var amount_per = {
        b1: {
          amount: BLST_amount_1,
          per: BLST_per_1,
        },
        b10: {
          amount: BLST_amount_10,
          per: BLST_per_10,
        },
        b50: {
          amount: BLST_amount_50,
          per: BLST_per_50,
        },
        b100: {
          amount: BLST_amount_100,
          per: BLST_per_100,
        },
        b150: {
          amount: BLST_amount_150,
          per: BLST_per_150,
        },
      };
      setWarriorBlstAmountPer(amount_per);
    } catch (error) {}

    return BLST_amount_1;
  };

  const getBlstAmountToMintBeast = async () => {
    var BLST_amount_1 = "0";
    var BLST_amount_10 = "0";
    var BLST_amount_50 = "0";
    var BLST_amount_100 = "0";
    var BLST_amount_150 = "0";

    var BLST_per_1 = "0";
    var BLST_per_10 = "1";
    var BLST_per_50 = "2";
    var BLST_per_100 = "3";
    var BLST_per_150 = "5";

    try {
      BLST_amount_1 = (
        (await getSummoningPrice(feeHandlerContract, 1)) / Math.pow(10, 18)
      ).toFixed(2);
      BLST_amount_10 = (
        (await getSummoningPrice(feeHandlerContract, 10)) / Math.pow(10, 18)
      ).toFixed(2);
      BLST_amount_50 = (
        (await getSummoningPrice(feeHandlerContract, 50)) / Math.pow(10, 18)
      ).toFixed(2);
      BLST_amount_100 = (
        (await getSummoningPrice(feeHandlerContract, 100)) / Math.pow(10, 18)
      ).toFixed(2);
      BLST_amount_150 = (
        (await getSummoningPrice(feeHandlerContract, 150)) / Math.pow(10, 18)
      ).toFixed(2);

      var amount_per = {
        b1: {
          amount: BLST_amount_1,
          per: BLST_per_1,
        },
        b10: {
          amount: BLST_amount_10,
          per: BLST_per_10,
        },
        b50: {
          amount: BLST_amount_50,
          per: BLST_per_50,
        },
        b100: {
          amount: BLST_amount_100,
          per: BLST_per_100,
        },
        b150: {
          amount: BLST_amount_150,
          per: BLST_per_150,
        },
      };
      setBeastBlstAmountPer(amount_per);
    } catch (error) {}

    return BLST_amount_1;
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

  const updateState = async () => {
    setOpenMassHunt(false);
    dispatch(
      setReloadStatus({
        reloadContractStatus: new Date(),
      })
    );
    const availableLegionCount = await getAvailableLegionsCount(
      web3,
      legionContract,
      account
    );
    if (availableLegionCount == 0) {
      setMassHuntResult([]);
    }
    setAvailableLegionCount(availableLegionCount);
    dispatch(initMassHuntResult());
  };

  const handleMassHuntClose = (reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    setOpenMassHunt(false);
  };

  const getInitInfo = async () => {
    try {
      const mintWarriorPending = await getWalletMintPending(
        warriorContract,
        account
      );
      setWarriorRevealStatus(mintWarriorPending);
      setHuntTax((await getFee(feeHandlerContract, 1)) / 10000);

      getBlstAmountToMintWarrior();
      getBlstAmountToMintBeast();
      setShowAnimation(
        localStorage.getItem("showAnimation")
          ? localStorage.getItem("showAnimation")
          : "0"
      );
      const availableLegionCount = await getAvailableLegionsCount(
        web3,
        legionContract,
        account
      );
      if (availableLegionCount == 0) {
        setMassHuntResult([]);
      }
      setAvailableLegionCount(availableLegionCount);
    } catch (error) {
      console.log(error);
    }
  };

  const checkMassHuntBUSD = async () => {
    const monsterVal = await getAllMonsters(monsterContract);
    const monsterArraryTemp = monsterVal[0];
    const rewardArray = monsterVal[1];
    let monsterArrary = monsterArraryTemp.map((item: any, index: number) => {
      return {
        name: item.name,
        base: item.percent,
        ap: item.attack_power / 100,
        reward: (rewardArray[index] / Math.pow(10, 18)).toFixed(2),
        BUSDReward: item.reward / Math.pow(10, 4),
      };
    });
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
        totalBUSD += monsterArrary[parseInt(monsterId) - 1].BUSDReward;
      }
    }
    return totalBUSD;
  };

  React.useEffect(() => {
    getInitInfo();

    const huntEvent = legionContract.events
      .Hunted({})
      .on("connected", function (subscriptionId: any) {})
      .on("data", async function (event: any) {
        console.log(event);
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
        console.log(event);
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

  React.useEffect(() => {}, [massHuntResult]);

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
      <Snackbar
        open={openSnackBar}
        TransitionComponent={transition}
        autoHideDuration={6000}
        onClose={() => setOpenSnackBar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        key={transition ? transition.name : ""}
      >
        <Alert
          onClose={() => setOpenSnackBar(false)}
          variant="filled"
          severity={aletType}
          sx={{ width: "100%" }}
        >
          <Box
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(snackBarNavigation)}
          >
            {snackBarMessage}
          </Box>
        </Alert>
      </Snackbar>
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
          {getTranslation("takeAction")}
        </Typography>
        <Box>
          <Grid container spacing={{ xs: 2, sm: 2, md: 1, lg: 2 }}>
            <Grid item xs={6} md={12} lg={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Box sx={{ textAlign: "center", width: "100%" }}>
                  {warriorRevealStatus ? (
                    <CommonBtn
                      onClick={() => handleWarriorReveal(TransitionUp)}
                      sx={{
                        fontWeight: "bold",
                        wordBreak: "break-word",
                        fontSize: 14,
                        width: "100%",
                        marginBottom: 1,
                      }}
                    >
                      <img
                        src={`/assets/images/warrior.png`}
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                        alt="icon"
                      />
                      {getTranslation("revealWarriors")}
                    </CommonBtn>
                  ) : (
                    <CommonBtn
                      aria-describedby={"summon-warrior-id"}
                      onClick={handlePopoverOpenSummonWarrior}
                      sx={{
                        fontWeight: "bold",
                        wordBreak: "break-word",
                        fontSize: 14,
                        width: "100%",
                        marginBottom: 1,
                      }}
                    >
                      <img
                        src={`/assets/images/warrior.png`}
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                        alt="icon"
                      />
                      {getTranslation("summonWarrior")}
                    </CommonBtn>
                  )}
                  <Popover
                    id={"summon-warrior-id"}
                    open={openSummonWarrior}
                    anchorEl={anchorElSummonWarrior}
                    onClose={handlePopoverCloseSummonWarrior}
                    anchorOrigin={{
                      vertical: "center",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "center",
                      horizontal: "right",
                    }}
                  >
                    <Box sx={{ display: "flex" }}>
                      <Box
                        sx={{
                          marginLeft: "auto",
                          wordBreak: "break-word",
                          cursor: "pointer",
                          marginRight: 1,
                          marginTop: 1,
                        }}
                      >
                        <FaTimes onClick={handlePopoverCloseSummonWarrior} />
                      </Box>
                    </Box>
                    <DialogTitle>
                      {getTranslation("takeActionSummonWarriorQuantity")}
                    </DialogTitle>
                    <Box
                      sx={{
                        padding: 3,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CommonBtn
                        onClick={() => handleWarriorMint(1, TransitionUp)}
                        sx={{
                          fontSize: 14,
                          wordBreak: "break-word",
                          fontWeight: "bold",
                          marginBottom: 1,
                        }}
                      >
                        1 ({warriorBlstAmountPer.b1?.amount} $BLST)
                      </CommonBtn>
                      <CommonBtn
                        onClick={() => handleWarriorMint(10, TransitionUp)}
                        sx={{
                          fontSize: 14,
                          wordBreak: "break-word",
                          fontWeight: "bold",
                          marginBottom: 1,
                        }}
                      >
                        10 (
                        {"-" +
                          warriorBlstAmountPer.b10.per +
                          "%" +
                          " | " +
                          warriorBlstAmountPer.b10?.amount}{" "}
                        $BLST)
                      </CommonBtn>
                      <CommonBtn
                        onClick={() => handleWarriorMint(50, TransitionUp)}
                        sx={{
                          fontSize: 14,
                          wordBreak: "break-word",
                          fontWeight: "bold",
                          marginBottom: 1,
                        }}
                      >
                        50 (
                        {"-" +
                          warriorBlstAmountPer.b50.per +
                          "%" +
                          " | " +
                          warriorBlstAmountPer.b50?.amount}{" "}
                        $BLST)
                      </CommonBtn>
                      <CommonBtn
                        onClick={() => handleWarriorMint(100, TransitionUp)}
                        sx={{
                          fontSize: 14,
                          wordBreak: "break-word",
                          fontWeight: "bold",
                          marginBottom: 1,
                        }}
                      >
                        100 (
                        {"-" +
                          warriorBlstAmountPer.b100.per +
                          "%" +
                          " | " +
                          warriorBlstAmountPer.b100?.amount}{" "}
                        $BLST)
                      </CommonBtn>
                      <CommonBtn
                        onClick={() => handleWarriorMint(150, TransitionUp)}
                        sx={{
                          fontSize: 14,
                          wordBreak: "break-word",
                          fontWeight: "bold",
                          marginBottom: 1,
                        }}
                      >
                        150 (
                        {"-" +
                          warriorBlstAmountPer.b150.per +
                          "%" +
                          " | " +
                          warriorBlstAmountPer.b150?.amount}{" "}
                        $BLST)
                      </CommonBtn>
                    </Box>
                  </Popover>
                  {beastRevealStatus ? (
                    <CommonBtn
                      onClick={() => handleBeastReveal(TransitionUp)}
                      sx={{
                        fontWeight: "bold",
                        wordBreak: "break-word",
                        fontSize: 14,
                        width: "100%",
                        marginBottom: 1,
                      }}
                    >
                      <img
                        src={`/assets/images/beast.png`}
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                        alt="icon"
                      />
                      {getTranslation("revealBeasts")}
                    </CommonBtn>
                  ) : (
                    <CommonBtn
                      onClick={handlePopoverOpenSummonBeast}
                      aria-describedby={"summon-beast-id"}
                      sx={{
                        fontSize: 14,
                        fontWeight: "bold",
                        wordBreak: "break-word",
                        width: "100%",
                        marginBottom: 1,
                      }}
                    >
                      <img
                        src={`/assets/images/beast.png`}
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                        alt="icon"
                      />
                      {getTranslation("summonBeast")}
                    </CommonBtn>
                  )}
                  <Popover
                    id={"summon-beast-id"}
                    open={openSummonBeast}
                    anchorEl={anchorElSummonBeast}
                    onClose={handlePopoverCloseSummonBeast}
                    anchorOrigin={{
                      vertical: "center",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "center",
                      horizontal: "right",
                    }}
                  >
                    <Box sx={{ display: "flex" }}>
                      <Box
                        sx={{
                          marginLeft: "auto",
                          cursor: "pointer",
                          marginRight: 1,
                          marginTop: 1,
                        }}
                      >
                        <FaTimes onClick={handlePopoverCloseSummonBeast} />
                      </Box>
                    </Box>
                    <DialogTitle>
                      {getTranslation("takeActionSummonBeastQuantity")}
                    </DialogTitle>
                    <Box
                      sx={{
                        padding: 3,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CommonBtn
                        onClick={() => handleBeastMint(1, TransitionUp)}
                        sx={{
                          fontSize: 14,
                          fontWeight: "bold",
                          marginBottom: 1,
                        }}
                      >
                        1 ({beastBlstAmountPer.b1?.amount} $BLST)
                      </CommonBtn>
                      <CommonBtn
                        onClick={() => handleBeastMint(10, TransitionUp)}
                        sx={{
                          fontSize: 14,
                          wordBreak: "break-word",
                          fontWeight: "bold",
                          marginBottom: 1,
                        }}
                      >
                        10 (
                        {"-" +
                          beastBlstAmountPer.b10.per +
                          "%" +
                          " | " +
                          beastBlstAmountPer.b10?.amount}{" "}
                        $BLST)
                      </CommonBtn>
                      <CommonBtn
                        onClick={() => handleBeastMint(50, TransitionUp)}
                        sx={{
                          fontSize: 14,
                          wordBreak: "break-word",
                          fontWeight: "bold",
                          marginBottom: 1,
                        }}
                      >
                        50 (
                        {"-" +
                          beastBlstAmountPer.b50.per +
                          "%" +
                          " | " +
                          beastBlstAmountPer.b50?.amount}{" "}
                        $BLST)
                      </CommonBtn>
                      <CommonBtn
                        onClick={() => handleBeastMint(100, TransitionUp)}
                        sx={{
                          fontSize: 14,
                          wordBreak: "break-word",
                          fontWeight: "bold",
                          marginBottom: 1,
                        }}
                      >
                        100 (
                        {"-" +
                          beastBlstAmountPer.b100.per +
                          "%" +
                          " | " +
                          beastBlstAmountPer.b100?.amount}{" "}
                        $BLST)
                      </CommonBtn>
                      <CommonBtn
                        onClick={() => handleBeastMint(150, TransitionUp)}
                        sx={{
                          fontSize: 14,
                          wordBreak: "break-word",
                          fontWeight: "bold",
                          marginBottom: 1,
                        }}
                      >
                        150 (
                        {"-" +
                          beastBlstAmountPer.b150.per +
                          "%" +
                          " | " +
                          beastBlstAmountPer.b150?.amount}{" "}
                        $BLST)
                      </CommonBtn>
                    </Box>
                  </Popover>
                  <CommonBtn
                    sx={{
                      fontWeight: "bold",
                      wordBreak: "break-word",
                      fontSize: 14,
                      width: "100%",
                      marginBottom: 1,
                    }}
                  >
                    <img
                      src={`/assets/images/legion.png`}
                      style={{
                        width: "15px",
                        height: "15px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    />
                    <NavLink to="/createlegions" className="non-style">
                      {getTranslation("takeActionCreateLegion")}
                    </NavLink>
                  </CommonBtn>
                  <NavLink to="/hunt" className="non-style">
                    <CommonBtn
                      sx={{
                        fontWeight: "bold",
                        wordBreak: "break-word",
                        fontSize: 14,
                        width: "100%",
                        marginBottom: 1,
                      }}
                    >
                      <img
                        src={`/assets/images/hunt.png`}
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                        alt="icon"
                      />
                      {getTranslation("hunt")}
                    </CommonBtn>
                  </NavLink>
                  {checkingMassHuntBUSD ? (
                    <CommonBtn
                      onClick={() => handleInitiateMassHunt()}
                      sx={{ fontWeight: "bold", width: "100%" }}
                      disabled
                    >
                      <Spinner color="white" size={40} />
                      &nbsp;
                      <img
                        src={`/assets/images/massHunt.png`}
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                        alt="icon"
                      />
                      {getTranslation("takeActionMassHunt")}
                    </CommonBtn>
                  ) : (
                    <CommonBtn
                      onClick={() => handleInitiateMassHunt()}
                      sx={{ fontWeight: "bold", width: "100%" }}
                      disabled={availableLegionCount == 0}
                    >
                      <img
                        src={`/assets/images/massHunt.png`}
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                        alt="icon"
                      />
                      {getTranslation("takeActionMassHunt")}
                    </CommonBtn>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} md={12} lg={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Box sx={{ textAlign: "center", width: "100%" }}>
                  <NavLink to="/warriorsMarketplace" className="non-style">
                    <CommonBtn
                      sx={{
                        fontWeight: "bold",
                        wordBreak: "break-word",
                        fontSize: 14,
                        width: "100%",
                        marginBottom: 1,
                      }}
                    >
                      <img
                        src={`/assets/images/marketWarrior.png`}
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                        alt="icon"
                      />
                      {getTranslation("takeActionBuyWarriors")}
                    </CommonBtn>
                  </NavLink>
                  <NavLink to="/beastsMarketplace" className="non-style">
                    <CommonBtn
                      sx={{
                        fontWeight: "bold",
                        wordBreak: "break-word",
                        fontSize: 14,
                        width: "100%",
                        marginBottom: 1,
                      }}
                    >
                      <img
                        src={`/assets/images/marketBeast.png`}
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                        alt="icon"
                      />
                      {getTranslation("takeActionBuyBeasts")}
                    </CommonBtn>
                  </NavLink>
                  <NavLink to="/legionsMarketplace" className="non-style">
                    <CommonBtn
                      sx={{
                        fontWeight: "bold",
                        wordBreak: "break-word",
                        fontSize: 14,
                        width: "100%",
                        marginBottom: 1,
                      }}
                    >
                      <img
                        src={`/assets/images/marketLegion.png`}
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                        alt="icon"
                      />
                      {getTranslation("takeActionBuyLegions")}
                    </CommonBtn>
                  </NavLink>
                  <a
                    href="https://www.dextools.io/app/bsc/pair-explorer/0xc60fefaa2bfa581ce86dbfc08ee7144bae43b981"
                    target="_blank"
                  >
                    <CommonBtn
                      sx={{
                        fontWeight: "bold",
                        wordBreak: "break-word",
                        fontSize: 14,
                        width: "100%",
                        marginBottom: 1,
                      }}
                    >
                      <img
                        src={`/assets/images/chart.png`}
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                        alt="icon"
                      />
                      {getTranslation("takeActionDextools")}
                    </CommonBtn>
                  </a>
                  <a
                    href="https://pancakeswap.finance/swap?outputCurrency=0x340516B933597F131E827aBdf0E3f700E24e84Ff"
                    target="_blank"
                  >
                    <CommonBtn
                      sx={{
                        fontWeight: "bold",
                        wordBreak: "break-word",
                        fontSize: 14,
                        width: "100%",
                      }}
                    >
                      <img
                        src={`/assets/images/pancake.png`}
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                        alt="icon"
                      />
                      {getTranslation("takeActionBuyBlst")}
                    </CommonBtn>
                  </a>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Dialog
        disableEscapeKeyDown
        onClose={(_, reason) => handleMassHuntClose(reason)}
        open={openMassHunt}
        sx={{ p: 1 }}
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          {getTranslation("massHuntResult")}
        </DialogTitle>
        {massHuntLoading && availableLegionCount > 0 ? (
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
                  disabled
                >
                  <Spinner color="white" size={40} />
                  &nbsp;
                  {getTranslation("revealResult")}
                </CommonBtn>
              ) : (
                <CommonBtn
                  onClick={() => handleMassHunting()}
                  sx={{ fontWeight: "bold" }}
                  disabled={availableLegionCount == 0}
                >
                  {getTranslation("revealResult")}
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
          {availableLegionCount == 0 && (
            <span style={{ padding: "8px" }}>
              {getTranslation("noLegionToHunt")}
            </span>
          )}
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
              disabled={massHuntLoading}
              sx={{ marginLeft: "auto", fontWeight: "bold" }}
              onClick={() => updateState()}
            >
              {getTranslation("continue")}
            </CommonBtn>
          )}
        </Box>
      </Dialog>
      {/* <Dialog open={warriorRevealStatus}>
        <DialogContent>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <CommonBtn
              style={{ fontWeight: "bold" }}
              onClick={() => handleWarriorReveal(TransitionUp)}
            >
              {getTranslation("revealWarriors")}
            </CommonBtn>
          </Box>
          <img style={{ width: "100%" }} src={"/assets/images/reveal.gif"} />
        </DialogContent>
      </Dialog> */}
    </Card>
  );
};

export default TakeAction;
