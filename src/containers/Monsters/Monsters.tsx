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
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { MonsterCard } from "../../component/Cards/MonsterCard";
import Helmet from "react-helmet";
import {
  meta_constant,
  createlegions,
  allConstants,
} from "../../config/meta.config";
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
} from "../../hooks/useContract";
import {
  getBeastBalance,
  getLegionTokenIds,
  getLegionToken,
  getWarriorBalance,
  getMonsterInfo,
  canHunt,
  hunt,
  getBeastToken,
  addSupply,
  getAllMonsters,
  getSupplyCost,
  getUnclaimedBLST,
  getBloodstoneBalance,
  massHunt,
} from "../../hooks/contractFunction";
import { getTranslation } from "../../utils/translation";
import CommonBtn from "../../component/Buttons/CommonBtn";
import RedBGMenuItem from "./RedMenuItem";
import GreenBGMenuItem from "./GreenMenuItem";
import OrgBGMenuItem from "./OrgMenuItem";
import { Spinner } from "../../component/Buttons/Spinner";
import { useDispatch } from "react-redux";
import { setReloadStatus } from "../../actions/contractActions";
import imageUrls from "../../constant/images";
import { useNavigate } from "react-router-dom";
import ScrollToButton from "../../component/Scroll/ScrollToButton";
import ScrollSection from "../../component/Scroll/Section";
import Slide, { SlideProps } from "@mui/material/Slide";
import { maxWidth } from "@mui/system";

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
    boxShadow: "rgb(0 0 0 / 37%) 0px 2px 4px 0px, rgb(14 30 37 / 85%) 0px 2px 16px 0px"
  },
  MassHuntItemWin: {
    boxShadow: "rgb(247 247 247 / 55%) 0px 2px 4px 0px, rgb(217 221 206 / 85%) 0px 2px 16px 0px",
    animation: `$Flash linear 2s infinite`,
  },
  "@keyframes Flash": {
    "0%": {
      boxShadow: "rgb(247 247 247 / 55%) 0px 2px 4px 0px, rgb(217 221 206 / 85%) 0px 2px 16px 0px",
    },
    "50%": {
      boxShadow: "rgb(247 247 247 / 30%) 0px 2px 4px 0px, rgb(217 221 206 / 40%) 0px 2px 16px 0px",
    },
    "100%": {
      boxShadow: "rgb(247 247 247 / 55%) 0px 2px 4px 0px, rgb(217 221 206 / 85%) 0px 2px 16px 0px",
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

  const [massHuntLoading, setMassHuntLoading] = React.useState(false)
  const [massHuntResult, setMassHuntResult] = React.useState<any>([])

  const scrollArea = useCallback((node) => {
    if (node != null) {
      setScrollMaxHeight(node.scrollHeight);
    }
  }, []);

  useEffect(() => {
    const huntEvent = legionContract.events.Hunted({
    }).on('connected', function (subscriptionId: any) {
      // console.log(subscriptionId)
    }).on('data', function (event: any) {
      console.log(event)
      var huntResult = event.returnValues
      var massHuntResultTemp = massHuntResult
      setMassHuntResult(massHuntResultTemp.push(huntResult))
    }).on('changed', function (event: any) {
      console.log(event)
    }).on('error', function (error: any, receipt: any) {
      console.log(error)
      console.log(receipt)
    })

    if (account) {
      initialize();
    }
    setShowAnimation(
      localStorage.getItem("showAnimation")
        ? localStorage.getItem("showAnimation")
        : "0"
    );
    return () => {
      huntEvent.unsubscribe((error: any, success: any) => {
        if (success) {
          console.log('Successfully unsubscribed!')
        }
        if (error) {
          console.log('There is an error')
        }
      })
    }
  }, []);

  const initMonster = async (legions: any) => {
    let monsterTmp;
    let monsterArrary = [];
    try {
      const monsterVal = await getAllMonsters(monsterContract);
      const monsterArraryTemp = monsterVal[0]
      const rewardArray = monsterVal[1]
      console.log(monsterArraryTemp)
      monsterArrary = monsterArraryTemp.map((item: any, index: number) => {
        return {
          name: item.name,
          base: item.percent,
          ap: item.attack_power / 100,
          reward: (rewardArray[index] / Math.pow(10, 18)).toFixed(2),
        };
      });
    } catch (error) {
      console.log(error);
    }
    console.log("monsterArrary", monsterArrary);

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

  const updateMonster = async () => {
    try {
      setBlstBalance(
        await getBloodstoneBalance(web3, bloodstoneContract, account)
      );
      setUnclaimedBlst(await getUnclaimedBLST(web3, rewardPoolContract, account));
      const legionIDS = await getLegionTokenIds(web3, legionContract, account);
      let legionTmp;
      let legionStatus = "";
      let legionArrayTmp = [];
      for (let i = 0; i < legionIDS.length; i++) {
        legionStatus = await canHunt(web3, legionContract, legionIDS[i]);
        legionTmp = await getLegionToken(web3, legionContract, legionIDS[i]);
        var warriorCapacity = 0;
        for (let j = 0; j < legionTmp.beasts.length; j++) {
          console.log(
            await getBeastToken(web3, beastContract, legionTmp.beasts[j])
          );
          warriorCapacity += parseInt(
            (await getBeastToken(web3, beastContract, legionTmp.beasts[j]))
              .capacity
          );
        }
        legionArrayTmp.push({
          ...legionTmp,
          id: legionIDS[i],
          status: legionStatus,
          warriorCapacity: warriorCapacity,
        });
      }
      setLegions(legionArrayTmp);
      setCurLegion(legionArrayTmp[parseInt(curComboLegionValue)]);
      if (legionArrayTmp[parseInt(curComboLegionValue)]) {
        for (let i = 0; i < monsters.length; i++) {
          const monster: any = monsters[i];
          if (
            parseInt(monster?.ap) <=
            legionArrayTmp[parseInt(curComboLegionValue)].attackPower
          ) {
            setStrongestMonsterToHunt(i);
          } else {
            break;
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  const initialize = async () => {
    try {
      setLoading(true);
      setBlstBalance(
        await getBloodstoneBalance(web3, bloodstoneContract, account)
      );
      setUnclaimedBlst(await getUnclaimedBLST(web3, rewardPoolContract, account));
      const legionIDS = await getLegionTokenIds(web3, legionContract, account);
      let legionTmp;
      let legionArrayTmp = [];
      let legionStatus = "";
      for (let i = 0; i < legionIDS.length; i++) {
        legionStatus = await canHunt(web3, legionContract, legionIDS[i]);
        legionTmp = await getLegionToken(web3, legionContract, legionIDS[i]);
        console.log(legionTmp, legionStatus);
        var warriorCapacity = 0;
        for (let j = 0; j < legionTmp.beasts.length; j++) {
          console.log(
            await getBeastToken(web3, beastContract, legionTmp.beasts[j])
          );
          warriorCapacity += parseInt(
            (await getBeastToken(web3, beastContract, legionTmp.beasts[j]))
              .capacity
          );
        }
        legionArrayTmp.push({
          ...legionTmp,
          id: legionIDS[i],
          status: legionStatus,
          warriorCapacity: warriorCapacity,
        });
      }
      await initMonster(legionArrayTmp);
      setLegionIDs(legionIDS);
      setLegions(legionArrayTmp);
      setCurLegion(legionArrayTmp[0]);
    } catch (error) {
      console.log(error)
    }
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
    setCurComboLegionValue(e.target.value as string);
    setCurLegion(curLegionTmp);
  };

  const handleHunt = async (monsterTokenID: number) => {
    setDialogVisible(true);
    setCurMonsterID(monsterTokenID);
    setCurMonster(monsters[monsterTokenID - 1] as MonsterInterface);
    try {
      let response = await hunt(
        web3,
        legionContract,
        account,
        curLegion?.id,
        monsterTokenID
      );
      console.log(response)
      const keys = Object.keys(response.events);
      console.log(keys);
      const result = response.events['Hunted'].returnValues;
      console.log(result);
      setHuntedRoll(result.roll);
      setHuntAvailablePercent(result.percent);
      setHuntedStatus(result.success ? 1 : 2);
      dispatch(
        setReloadStatus({
          reloadContractStatus: new Date(),
        })
      );
    } catch (e: any) {
      console.log("hunt result", e, "hunt result");
      setDialogVisible(false);
      if (e.code == 4001) {
      } else {
        setSnackBarMessage(getTranslation("huntTransactionFailed"));
        setOpenSnackBar(true);
      }
    }
  };

  const handleContinue = async () => {
    setContinueLoading(true);
    await updateMonster();
    setDialogVisible(false);
    setHuntedStatus(0);
    setContinueLoading(false);
    setOpenMassHunt(false)
    dispatch(
      setReloadStatus({
        reloadContractStatus: new Date(),
      })
    );
  };

  const handleSupplyClose = () => {
    setOpenSupply(false);
  };

  const handleSupplyClick = async (fromWallet: boolean) => {
    setLoadingText(getTranslation("buyingSupplies"));
    setSupplyLoading(true);
    setOpenSupply(false);
    try {
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
    } catch (e) {
      console.log(e);
    }
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
          if (parseInt(hours) == 0 && parseInt(mins) == 0 && parseInt(secs) == 0) {
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
    } catch (error) {
      console.log(error);
    }
    setSupplyCostLoading(false);
  };

  const massHunting = async () => {
    console.log('start mass hunt')
    setMassHuntResult([])
    setOpenMassHunt(true)
    setMassHuntLoading(true)
    try {
      await massHunt(legionContract, account)
    } catch (error) {
      console.log(error)
    }
    setMassHuntLoading(false)
    console.log('end mass hunt')
  }

  const handleMassHuntClose = () => {
    setOpenMassHunt(false)
  }

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
      {loading === false && legions.length > 0 && (
        <Box
          component="div"
          sx={{ position: "relative" }}
          ref={scrollArea}
          id="monsters"
        >
          <Card className={classes.Card}>
            <Grid
              container
              spacing={2}
              sx={{ justifyContent: "center" }}
              alignItems="center"
              columns={60}
            >
              <Grid item xs={60} sm={60} md={20}>
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
              <Grid item xs={30} sm={12} md={9}>
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
              <Grid item xs={30} sm={12} md={7}>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: 14, sm: 16, md: 20 },
                  }}
                >
                  W {curLegion?.warriors.length}/{curLegion?.warriorCapacity}
                </Typography>
              </Grid>
              <Grid item xs={30} sm={12} md={7}>
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
              <Grid item xs={30} sm={12} md={7}>
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
              <Grid item xs={30} sm={12} md={10} sx={{ marginRight: "auto" }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: 14, sm: 16, md: 20 },
                  }}
                >
                  {calcHuntTime(curLegion?.lastHuntTime)}
                </Typography>
              </Grid>
              <Grid item xs={30} sm={12} md={10} sx={{ marginRight: "auto" }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: 14, sm: 16, md: 20 },
                  }}
                >
                  <CommonBtn onClick={() => massHunting()}>
                    Mass Hunt
                  </CommonBtn>
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
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            className={classes.Grid}
          >
            {monsters.map((monster: any | MonsterInterface, index) => (
              // <Box component='div' sx={{ width: '100%', my: 1 }} key={index}> xs={32} sm={30} md={20} lg={15} xl={12}
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
                        ? `/assets/images/characters/jpg/monsters/m${index + 1
                        }.jpg`
                        : `/assets/images/characters/gif/monsters/m${index + 1
                        }.gif`
                    }
                    name={monster.name}
                    tokenID={index + 1}
                    base={monster.base}
                    minAP={monster.ap}
                    bonus={
                      index < 20 &&
                        curLegion &&
                        monster.ap < (curLegion as LegionInterface).attackPower
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
                      monster.ap <= (curLegion as LegionInterface).attackPower
                    }
                    handleHunt={handleHunt}
                  />
                </ScrollSection>
              </Grid>
              // </Box>
            ))}
          </Grid>
        </Box>
      )}
      {loading === false && legions.length === 0 && (
        <Grid container justifyContent="center" sx={{ paddingTop: "20%" }}>
          <Grid item>
            <Typography variant="h4">
              {getTranslation("noMintedLegion")}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center", marginTop: 2 }}>
            <CommonBtn>
              <NavLink to="/createlegions" className="non-style">
                {getTranslation("createLegion")}
              </NavLink>
            </CommonBtn>
          </Grid>
        </Grid>
      )}
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
              <Box component="p">{curMonster?.name.toUpperCase()}</Box>
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
        <DialogTitle sx={{ textAlign: "center" }}>
          {getTranslation("buySupply")}
        </DialogTitle>
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
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSupplyClose}
          >
            {getTranslation("cancel")}
          </Button>
          <CommonBtn
            onClick={() => handleSupplyClick(true)}
            sx={{ marginRight: 1, marginLeft: 1 }}
            disabled={
              parseFloat(blstBalance * Math.pow(10, 18) + "") <
              parseFloat(supplyValues[supplyOrder] + "") || supplyCostLoading
            }
          >
            Wallet
          </CommonBtn>
          <CommonBtn
            onClick={() => handleSupplyClick(false)}
            disabled={
              parseFloat(unclaimedBlst + "") <
              parseFloat(supplyValues[supplyOrder] + "") || supplyCostLoading
            }
          >
            Unclaimed
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
      <Dialog onClose={handleMassHuntClose} open={openMassHunt} sx={{ p: 1 }}>
        <DialogTitle sx={{ textAlign: "center" }}>
          Result of Mass Hunt
        </DialogTitle>
        {
          massHuntLoading && (
            <Box sx={{ p: 1 }}>
              <LinearProgress sx={{ width: "100%" }} color="success" />
            </Box>
          )
        }
        <Box sx={{ p: 1, display: 'flex', maxWidth: 1000, flexWrap: 'wrap', maxHight: 500, overflowY: 'auto', justifyContent: 'space-around' }}>
          {
            massHuntResult.map((result: any, index: any) => (
              <Box className={index % 2 == 0 ? classes.MassHuntItemWin : classes.MassHuntItemLose} sx={{ textAlign: 'center', margin: 1, width: 170, p: 1 }}>
                <img src={`/assets/images/characters/jpg/monsters_dying/m${1}.jpg`} style={{ width: '100%' }} />
                <Box sx={{ wordBreak: 'break-word' }}>
                  {/* {legions.filter((legion: any) => parseInt(legion.id) == parseInt(result.legionId))[0].name} */}
                </Box>
                <Box sx={{ p: 1, fontSize: 12 }}>
                  Chance: 90, Role: 50
                </Box>
              </Box>
            ))
          }
        </Box>
        <Box sx={{ display: 'flex', p: 1, justifyContent: 'space-between' }}>
          <Button variant='outlined' color="primary" onClick={() => setOpenMassHunt(false)}>
            {getTranslation('cancel')}
          </Button>
          <CommonBtn
            onClick={() => handleContinue()}
            disabled={continueLoading && massHuntLoading}
            sx={{ marginLeft: 'auto', fontWeight: "bold" }}
          >
            {continueLoading ? (
              <Spinner color="white" size={40} />
            ) : (
              getTranslation("continue")
            )}
          </CommonBtn>
        </Box>
      </Dialog >
    </Box >
  );
};

export default Monsters;
