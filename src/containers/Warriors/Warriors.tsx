import React from "react";
import Helmet from "react-helmet";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  ButtonGroup,
  Button,
  IconButton,
  FormLabel,
  FormControl,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Popover,
  DialogActions,
} from "@mui/material";
import HorizontalSplitIcon from "@mui/icons-material/HorizontalSplit";
import { makeStyles } from "@mui/styles";
import { useWeb3React } from "@web3-react/core";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { allConstants, meta_constant } from "../../config/meta.config";
import { setReloadStatus, updateStore } from "../../actions/contractActions";
import {
  getWarriorBloodstoneAllowance,
  setWarriorBloodstoneApprove,
  mintWarrior,
  getWarriorBalance,
  sellToken,
  setMarketplaceApprove,
  execute,
  getSummoningPrice,
  getFee,
  getUSDAmountFromBLST,
  getAllWarriors,
  isApprovedForAll,
  setApprovalForAll,
  revealBeastsAndWarrior,
  getWalletMintPending,
  getWarriorRequestId,
  getVRFResult,
} from "../../hooks/contractFunction";
import {
  useBloodstone,
  useWarrior,
  useMarketplace,
  useLegion,
  useFeeHandler,
  useWeb3,
  useVRF,
} from "../../hooks/useContract";
import WarriorCard from "../../component/Cards/WarriorCard";
import CommonBtn from "../../component/Buttons/CommonBtn";
import Navigation from "../../component/Navigation/Navigation";
import { getTranslation } from "../../utils/translation";
import {
  formatNumber,
  getWarriorGif,
  getWarriorStrength,
} from "../../utils/common";
import { FaTimes } from "react-icons/fa";
import warriorInfo from "../../constant/warriors";
import { getMarketplaceAddress } from "../../utils/addressHelpers";

import CircularProgress from "@mui/material/CircularProgress";
import { green, yellow, red } from "@mui/material/colors";
import Tutorial from "../../component/Tutorial/Tutorial";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    minHeight: "180px",
  },
  warning: {
    display: "flex",
    minHeight: "80px",
  },
});

type WarriorProps = {
  id: string;
  type: string;
  power: string;
  strength: string;
  executeStatus: {
    type: boolean;
    default: false;
  };
};

const Warriors = () => {
  const { account } = useWeb3React();

  const [balance, setBalance] = React.useState(0);
  const [maxPower, setMaxPower] = React.useState(0);
  const [warriors, setWarriors] = React.useState<WarriorProps[]>(Array);
  const [filter, setFilter] = React.useState("all");
  const [openSupply, setOpenSupply] = React.useState(false);
  const [selectedWarrior, setSelectedWarrior] = React.useState(0);
  const [price, setPrice] = React.useState(0);
  const [marketplaceTax, setMarketplaceTax] = React.useState("0");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showAnimation, setShowAnimation] = React.useState<string | null>("0");
  const [apValue, setApValue] = React.useState<number[]>([500, 6000]);
  const [BlstToUsd, setBlstToUsd] = React.useState(0);

  const [revealStatus, setRevealStatus] = React.useState(false);
  const [textLoading, setTextLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState("");
  const [checkWarriorVRF, setCheckWarriorVRF] = React.useState(false);

  const maxSellPrice = allConstants.maxSellPrice;
  const [executeDialogOpen, setExecuteDialogOpen] = React.useState(false);

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

  const [summonWarriorTutorialStep, setSummonWarriorTutorialStep] =
    React.useState(2);

  const classes = useStyles();
  const warriorContract = useWarrior();
  const legionContract = useLegion();
  const bloodstoneContract = useBloodstone();
  const marketplaceContract = useMarketplace();
  const feeHandlerContract = useFeeHandler();
  const vrfContract = useVRF();
  const web3 = useWeb3();
  const dispatch = useDispatch();

  //Popover for Summon Warrior
  const [anchorElSummonWarrior, setAnchorElSummonWarrior] =
    React.useState<HTMLElement | null>(null);
  const handlePopoverOpenSummonWarrior = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorElSummonWarrior(event.currentTarget);
    if (warriors.length == 0) {
      dispatch(updateStore({ tutorialStep: [3] }));
    } else {
      dispatch(updateStore({ tutorialStep: [] }));
    }
  };
  const handlePopoverCloseSummonWarrior = () => {
    setAnchorElSummonWarrior(null);
    handleCheckTutorialStep(maxPower, warriors.length);
  };
  const openSummonWarrior = Boolean(anchorElSummonWarrior);

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

  React.useEffect(() => {
    if (account) {
      dispatch(updateStore({ isSideBarOpen: false }));
      getBalance();
      getBlstAmountToMintWarrior();
    }
    setShowAnimation(
      localStorage.getItem("showAnimation")
        ? localStorage.getItem("showAnimation")
        : "0"
    );
  }, []);

  const checkRevealWarriorStatus = () => {
    const revealChecker = setInterval(async () => {
      const requestId = await getWarriorRequestId(warriorContract, account);
      const returnVal = await getVRFResult(vrfContract, requestId);
      if (returnVal != 0) {
        setCheckWarriorVRF(false);
        clearInterval(revealChecker);
      }
    }, 1000);
  };

  const handleMint = async (amount: Number) => {
    handlePopoverCloseSummonWarrior();
    setTextLoading(true);
    setLoadingText(getTranslation("summoningWarriors"));
    const allowance = await getWarriorBloodstoneAllowance(
      web3,
      bloodstoneContract,
      account
    );
    try {
      if (allowance === "0") {
        await setWarriorBloodstoneApprove(web3, bloodstoneContract, account);
      }
      await mintWarrior(web3, warriorContract, account, amount);
      setRevealStatus(await getWalletMintPending(warriorContract, account));
      setCheckWarriorVRF(true);
      checkRevealWarriorStatus();
      setTextLoading(true);
      if (await getWalletMintPending(warriorContract, account)) {
        setLoadingText(getTranslation("revealTextWarriors"));
      }
      dispatch(
        setReloadStatus({
          reloadContractStatus: new Date(),
        })
      );
    } catch (e) {
      setTextLoading(false);
      handleCheckTutorialStep(maxPower, warriors.length);
    }
  };

  const handleReveal = async () => {
    setRevealStatus(false);
    try {
      setTextLoading(true);
      setLoadingText(getTranslation("revealingWarriors"));
      await revealBeastsAndWarrior(warriorContract, account);
      setRevealStatus(false);
      setRevealStatus(await getWalletMintPending(warriorContract, account));
      await getBalance();
    } catch (error) {
      setRevealStatus(true);
      setTextLoading(true);
      setLoadingText(getTranslation("revealTextWarriors"));
    }
  };

  const getBalance = async () => {
    setTextLoading(true);
    var tempWarriors: any[] = [];
    var amount = 0;
    let revealStatusVal;
    try {
      setLoadingText(getTranslation("loadingWarriors"));
      revealStatusVal = await getWalletMintPending(warriorContract, account);
      setRevealStatus(revealStatusVal);
      if (revealStatusVal) {
        setCheckWarriorVRF(true);
        checkRevealWarriorStatus();
      }
      setMarketplaceTax(
        ((await getFee(feeHandlerContract, 0)) / 100).toFixed(0)
      );
      setBalance(
        parseInt(await getWarriorBalance(web3, warriorContract, account))
      );
      const warriorsInfo = await getAllWarriors(warriorContract, account);

      let ids = warriorsInfo[0];
      let powers = warriorsInfo[1];
      ids.forEach((id: any, index: number) => {
        var temp = {
          id: id,
          type: warriorInfo[getWarriorStrength(parseInt(powers[index])) - 1],
          strength: getWarriorStrength(powers[index]),
          power: powers[index],
          gif: getWarriorGif(
            warriorInfo[getWarriorStrength(parseInt(powers[index])) - 1],
            parseInt(powers[index])
          ),
          executeStatus: false,
        };
        tempWarriors.push(temp);
        amount += parseInt(powers[index]);
      });
    } catch (error) {}
    handleCheckTutorialStep(amount, tempWarriors.length);
    setMaxPower(amount);
    setWarriors(tempWarriors);
    if (revealStatusVal) {
      setLoadingText(getTranslation("revealTextWarriors"));
    }
    if (!revealStatusVal) {
      setTextLoading(false);
    }
  };

  const checkApprovalForAll = async () => {
    if (
      (await isApprovedForAll(
        warriorContract,
        account,
        getMarketplaceAddress()
      )) === false
    ) {
      await setApprovalForAll(
        account,
        warriorContract,
        getMarketplaceAddress(),
        true
      );
    }
  };

  const handleChangeAp = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setApValue([Math.min(newValue[0], apValue[1] - 1), apValue[1]]);
    } else {
      setApValue([apValue[0], Math.max(newValue[1], apValue[0] + 1)]);
    }
    setCurrentPage(1);
  };

  const handleSupplyClose = () => {
    setOpenSupply(false);
  };

  const handleOpenSupply = (id: number) => {
    setSelectedWarrior(id);
    setOpenSupply(true);
  };

  const handlePrice = async (e: any) => {
    var price = e.target.value;
    if (price >= 1) {
      if (price[0] === "0") {
        price = price.slice(1);
      }
      setPrice(price);
      setBlstToUsd(
        await getUSDAmountFromBLST(
          feeHandlerContract,
          BigInt(parseFloat(price) * Math.pow(10, 18))
        )
      );
    } else if (price >= 0) {
      setPrice(price);
      if (price === "") {
        price = "0";
      }
      setBlstToUsd(
        await getUSDAmountFromBLST(
          feeHandlerContract,
          BigInt(parseFloat(price) * Math.pow(10, 18))
        )
      );
    }
  };

  const handleSendToMarketplace = async () => {
    setTextLoading(true);
    setLoadingText(getTranslation("pleaseWait"));
    setOpenSupply(false);
    try {
      // await setMarketplaceApprove(
      //   web3,
      //   warriorContract,
      //   account,
      //   selectedWarrior
      // );
      await checkApprovalForAll();
      await sellToken(
        web3,
        marketplaceContract,
        account,
        "2",
        selectedWarrior,
        BigInt(price * Math.pow(10, 18))
      );
      let power = 0;
      let temp = warriors;
      for (let i = 0; i < temp.length; i++) {
        if (parseInt(temp[i]["id"]) === selectedWarrior)
          power = parseInt(temp[i]["power"]);
      }
      setMaxPower(maxPower - power);
      setBalance(balance - 1);
      setWarriors(
        warriors.filter((item: any) => parseInt(item.id) !== selectedWarrior)
      );
    } catch (e) {}
    setTextLoading(false);
  };

  const handleExecute = async (id: number) => {
    setTextLoading(true);
    setLoadingText(getTranslation("pleaseWait"));
    try {
      await execute(web3, warriorContract, account, [id]);
      let power = 0;
      let temp = warriors;
      for (let i = 0; i < temp.length; i++) {
        if (parseInt(temp[i]["id"]) === id) power = parseInt(temp[i]["power"]);
      }
      setMaxPower(maxPower - power);
      setBalance(balance - 1);
      setWarriors(warriors.filter((item: any) => parseInt(item.id) !== id));
      dispatch(
        setReloadStatus({
          reloadContractStatus: new Date(),
        })
      );
    } catch (e) {}
    setTextLoading(false);
  };

  const handleMassExecute = async (over3: boolean) => {
    if (
      warriors.filter(
        (warrior: any) => warrior.executeStatus === true && warrior.strength > 2
      ).length > 0 &&
      !over3
    ) {
      setExecuteDialogOpen(true);
    } else {
      setTextLoading(true);
      setExecuteDialogOpen(false);
      setLoadingText(getTranslation("pleaseWait"));
      try {
        const ids = warriors
          .filter((warrior: any) => warrior.executeStatus === true)
          .map((warrior: any) => warrior.id);
        await execute(web3, warriorContract, account, ids);
        getBalance();
        dispatch(
          setReloadStatus({
            reloadContractStatus: new Date(),
          })
        );
      } catch (error) {}
      setTextLoading(false);
    }
  };

  const handleExecuteDialogClose = (reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    setExecuteDialogOpen(false);
  };

  const handleSelectAll = () => {
    if (
      warriors.filter((beast: any) => beast.executeStatus === true).length > 0
    ) {
      const data = warriors.map((warrior: any) => ({
        ...warrior,
        executeStatus: false,
      }));
      setWarriors(data);
    } else {
      const data = warriors
        .filter((item: any) =>
          filter === "all"
            ? parseInt(item.strength) >= 0
            : item.strength === parseInt(filter)
        )
        .filter(
          (item: any) =>
            apValue[0] <= parseInt(item.power) &&
            (apValue[1] === 6000 ? true : apValue[1] >= parseInt(item.power))
        );
      const result = warriors.map((warrior: any) => {
        if (data.filter((item: any) => item.id === warrior.id).length > 0) {
          return {
            ...warrior,
            executeStatus: true,
          };
        } else {
          return warrior;
        }
      });
      // .map((beast: any) => ({ ...beast, executeStatus: true }));
      setWarriors(result);
    }
  };
  const handlePage = (value: any) => {
    setCurrentPage(value);
  };

  const handleFilter = (value: string) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const setExecuteStatus = (id: String) => {
    setWarriors(
      warriors.map((warrior: any, index: any) => {
        if (warrior.id == id) {
          return {
            ...warrior,
            executeStatus: !warrior.executeStatus,
          };
        }
        return warrior;
      })
    );
  };

  const handleCheckTutorialStep = (
    totalAttackPower: any,
    warriorsLength: any
  ) => {
    if (totalAttackPower == 0 && warriorsLength == 0) {
      dispatch(updateStore({ tutorialStep: [2] }));
    } else if (totalAttackPower > 0 && totalAttackPower < 2200) {
      dispatch(updateStore({ tutorialStep: [4, 5] }));
      setSummonWarriorTutorialStep(5);
    }
    if (totalAttackPower >= 2200) {
      dispatch(updateStore({ tutorialStep: [6], isSideBarOpen: false }));
    }
  };

  return (
    <Box>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta_constant.warriors.title}</title>
        <meta name="description" content={meta_constant.warriors.description} />
        {meta_constant.warriors.keywords && (
          <meta
            name="keywords"
            content={meta_constant.warriors.keywords.join(",")}
          />
        )}
      </Helmet>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Card>
            <Box
              className={classes.warning}
              sx={{ p: 4, justifyContent: "start", alignItems: "center" }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", mx: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                  {getTranslation("warriors")}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <Box
              className={classes.card}
              sx={{ p: 4, justifyContent: "center", alignItems: "center" }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {getTranslation("summonWarrior")}
              </Typography>
              <Box sx={{ pt: 1 }}>
                <Tutorial
                  curStep={summonWarriorTutorialStep}
                  placement={"bottom"}
                >
                  <CommonBtn
                    aria-describedby={"summon-warrior-id"}
                    onClick={handlePopoverOpenSummonWarrior}
                    sx={{ fontWeight: "bold" }}
                    id="summon-warrior-quantity"
                  >
                    <IconButton
                      aria-label="claim"
                      component="span"
                      sx={{ p: 0, mr: 1, color: "black" }}
                    >
                      <HorizontalSplitIcon />
                    </IconButton>
                    {getTranslation("summonQuantity")}
                  </CommonBtn>
                </Tutorial>
                <Popover
                  id={"summon-warrior-id"}
                  open={openSummonWarrior}
                  anchorEl={anchorElSummonWarrior}
                  onClose={handlePopoverCloseSummonWarrior}
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "left",
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
                    <Tutorial curStep={3} placement={"bottom"}>
                      <CommonBtn
                        onClick={() => handleMint(1)}
                        sx={{
                          fontSize: 14,
                          fontWeight: "bold",
                          marginBottom: 1,
                          width: "100%",
                        }}
                        id="summon-warrior-1"
                      >
                        1 ({warriorBlstAmountPer.b1?.amount} $BLST)
                      </CommonBtn>
                    </Tutorial>
                    <CommonBtn
                      onClick={() => handleMint(10)}
                      sx={{
                        fontSize: 14,
                        fontWeight: "bold",
                        marginBottom: 1,
                      }}
                      id="summon-warrior-10"
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
                      onClick={() => handleMint(50)}
                      sx={{
                        fontSize: 14,
                        fontWeight: "bold",
                        marginBottom: 1,
                      }}
                      id="summon-warrior-50"
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
                      onClick={() => handleMint(100)}
                      sx={{
                        fontSize: 14,
                        fontWeight: "bold",
                        marginBottom: 1,
                      }}
                      id="summon-warrior-100"
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
                      onClick={() => handleMint(150)}
                      sx={{
                        fontSize: 14,
                        fontWeight: "bold",
                        marginBottom: 1,
                      }}
                      id="summon-warrior-150"
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
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <Box
              className={classes.card}
              sx={{ p: 4, justifyContent: "center", alignItems: "center" }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {getTranslation("currentWarriors")}
              </Typography>
              <Tutorial curStep={6} placement="bottom">
                <Typography
                  variant="h4"
                  color="secondary"
                  sx={{ fontWeight: "bold" }}
                >
                  {balance}
                </Typography>
              </Tutorial>
              <CommonBtn sx={{ fontWeight: "bold", mt: 1 }}>
                <NavLink to="/createlegions" className="non-style">
                  {getTranslation("createLegion")}
                </NavLink>
              </CommonBtn>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <Box
              className={classes.card}
              sx={{ p: 4, justifyContent: "center", alignItems: "center" }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {getTranslation("attackPower")}
              </Typography>
              <Tutorial curStep={4} placement={"bottom"}>
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  {formatNumber(maxPower)}
                </Typography>
              </Tutorial>
              <CommonBtn
                sx={{ fontWeight: "bold", mt: 1 }}
                onClick={() => handleSelectAll()}
              >
                {warriors.filter((beast: any) => beast.executeStatus === true)
                  .length > 0
                  ? getTranslation("deSelectAll")
                  : getTranslation("selectAll")}
              </CommonBtn>
              <CommonBtn
                sx={{ fontWeight: "bold", mt: 1 }}
                disabled={
                  warriors.filter(
                    (warrior: any) => warrior.executeStatus === true
                  ).length === 0 || textLoading
                }
                onClick={() => handleMassExecute(false)}
              >
                {getTranslation("massExecute")}
              </CommonBtn>
            </Box>
          </Card>
        </Grid>
      </Grid>
      {textLoading === false && (
        <React.Fragment>
          <Grid container spacing={2} sx={{ my: 3 }}>
            <Grid item md={4} xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend" style={{ marginBottom: 12 }}>
                  {getTranslation("filterLevel")}:
                </FormLabel>
                <ButtonGroup
                  variant="outlined"
                  color="primary"
                  aria-label="outlined button group"
                >
                  <Button
                    variant={`${filter === "all" ? "contained" : "outlined"}`}
                    onClick={() => handleFilter("all")}
                  >
                    {getTranslation("all")}
                  </Button>
                  <Button
                    variant={`${filter === "1" ? "contained" : "outlined"}`}
                    onClick={() => handleFilter("1")}
                  >
                    1
                  </Button>
                  <Button
                    variant={`${filter === "2" ? "contained" : "outlined"}`}
                    onClick={() => handleFilter("2")}
                  >
                    2
                  </Button>
                  <Button
                    variant={`${filter === "3" ? "contained" : "outlined"}`}
                    onClick={() => handleFilter("3")}
                  >
                    3
                  </Button>
                  <Button
                    variant={`${filter === "4" ? "contained" : "outlined"}`}
                    onClick={() => handleFilter("4")}
                  >
                    4
                  </Button>
                  <Button
                    variant={`${filter === "5" ? "contained" : "outlined"}`}
                    onClick={() => handleFilter("5")}
                  >
                    5
                  </Button>
                  <Button
                    variant={`${filter === "6" ? "contained" : "outlined"}`}
                    onClick={() => handleFilter("6")}
                  >
                    6
                  </Button>
                </ButtonGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl component="fieldset" sx={{ width: "90%" }}>
                <FormLabel component="legend">
                  {getTranslation("filterByAp")}:
                </FormLabel>
                <Slider
                  getAriaLabel={() => "Custom marks"}
                  // defaultValue={20}
                  value={apValue}
                  min={500}
                  max={6000}
                  marks={[
                    { value: 500, label: "500" },
                    { value: 6000, label: formatNumber("6000+") },
                  ]}
                  step={1}
                  valueLabelDisplay="auto"
                  onChange={handleChangeAp}
                  disableSwap
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {warriors
              .filter((item: any) =>
                filter === "all"
                  ? parseInt(item.strength) >= 0
                  : item.strength === parseInt(filter)
              )
              .filter(
                (item: any) =>
                  apValue[0] <= parseInt(item.power) &&
                  (apValue[1] === 6000
                    ? true
                    : apValue[1] >= parseInt(item.power))
              )
              .slice((currentPage - 1) * 20, (currentPage - 1) * 20 + 20)
              .map((item: any, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <WarriorCard
                    image={
                      showAnimation === "0"
                        ? "/assets/images/characters/jpg/warriors/" +
                          item["type"] +
                          ".jpg"
                        : "/assets/images/characters/gif/warriors/" +
                          item["gif"]
                    }
                    type={item["type"]}
                    power={item["power"]}
                    strength={item["strength"]}
                    id={item["id"]}
                    isMobile={false}
                    needButton={true}
                    handleOpenSupply={handleOpenSupply}
                    handleExecute={handleExecute}
                    executeStatus={item["executeStatus"]}
                    setExecuteStatus={setExecuteStatus}
                  />
                </Grid>
              ))}
            {warriors.length > 0 &&
              warriors
                .filter((item: any) =>
                  filter === "all"
                    ? parseInt(item.strength) >= 0
                    : item.strength === parseInt(filter)
                )
                .filter(
                  (item: any) =>
                    apValue[0] <= parseInt(item.power) &&
                    (apValue[1] === 6000
                      ? true
                      : apValue[1] >= parseInt(item.power))
                ).length === 0 && (
                <Grid item xs={12}>
                  <Card>
                    <Box
                      className={classes.warning}
                      sx={{
                        p: 4,
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", flexDirection: "column", mx: 4 }}
                      >
                        <Typography variant="h6">
                          {getTranslation("noWarriorFilter")}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              )}
          </Grid>
          {warriors
            .filter((item: any) =>
              filter === "all"
                ? parseInt(item.strength) >= 0
                : item.strength === filter
            )
            .filter(
              (item: any) =>
                apValue[0] <= parseInt(item.power) &&
                (apValue[1] === 6000
                  ? true
                  : apValue[1] >= parseInt(item.power))
            ).length > 0 && (
            <Navigation
              totalCount={
                warriors
                  .filter((item: any) =>
                    filter === "all"
                      ? parseInt(item.strength) >= 0
                      : item.strength === filter
                  )
                  .filter(
                    (item: any) =>
                      apValue[0] <= parseInt(item.power) &&
                      (apValue[1] === 6000
                        ? true
                        : apValue[1] >= parseInt(item.power))
                  ).length
              }
              cPage={currentPage}
              handlePage={handlePage}
              perPage={20}
            />
          )}
        </React.Fragment>
      )}
      {textLoading === true && (
        <>
          <Grid item xs={12} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4">{loadingText}</Typography>
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
      <Dialog onClose={handleSupplyClose} open={openSupply}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          {getTranslation("listOnMarketplace")}
          <span className="close-button" onClick={handleSupplyClose}>
            x
          </span>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="price"
            label={`${getTranslation("priceIn")} $BLST`}
            type="number"
            fullWidth
            variant="standard"
            value={price}
            onChange={handlePrice}
            onKeyDown={(evt) => {
              (evt.key === "e" ||
                evt.key === "E" ||
                evt.key === "+" ||
                evt.key === "-") &&
                evt.preventDefault();
            }}
            color={price < maxSellPrice ? "primary" : "error"}
            inputProps={{ step: "0.1" }}
            sx={{
              input: {
                color: price < maxSellPrice ? "white" : "#f44336",
              },
            }}
          />
          <Typography variant="subtitle1">
            (= {(BlstToUsd / Math.pow(10, 18)).toFixed(2)} USD)
          </Typography>
          <Typography variant="subtitle1">
            {getTranslation("payMarketplaceTax")} {marketplaceTax}%
          </Typography>
        </DialogContent>
        {+price >= 0 && price < maxSellPrice ? (
          <CommonBtn
            sx={{ fontWeight: "bold" }}
            onClick={handleSendToMarketplace}
          >
            {getTranslation("sell")}
          </CommonBtn>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              padding: 2,
              color: "#f44336",
              wordBreak: "break-word",
            }}
          >
            {getTranslation("maxSellPrice")}
          </Box>
        )}
      </Dialog>
      <Dialog open={revealStatus}>
        <DialogContent>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <CommonBtn
              style={{ fontWeight: "bold" }}
              onClick={() => handleReveal()}
              disabled={checkWarriorVRF}
            >
              <Box>
                {getTranslation("revealWarriors")}
                {checkWarriorVRF && (
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
          </Box>
          <img style={{ width: "100%" }} src={"/assets/images/reveal.gif"} />
        </DialogContent>
      </Dialog>
      <Dialog open={executeDialogOpen}>
        <DialogTitle sx={{ textAlign: "center" }}>
          {getTranslation("warning")}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center" }}>
            {getTranslation("executeItem")}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => handleExecuteDialogClose("cancel")}
            variant="contained"
            sx={{ color: "white", fontWeight: "bold" }}
          >
            {getTranslation("cancel")}
          </Button>
          <Button
            onClick={() => handleMassExecute(true)}
            variant="outlined"
            sx={{ fontWeight: "bold" }}
          >
            {getTranslation("execute")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Warriors;
