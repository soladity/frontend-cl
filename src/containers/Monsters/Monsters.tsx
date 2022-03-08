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
} from "../../hooks/useContract";
import {
  getBeastBalance,
  getLegionTokenIds,
  getLegionToken,
  getWarriorBalance,
  getMonsterInfo,
  getBaseJpgURL,
  getBaseGifURL,
  canHunt,
  hunt,
  getBeastToken,
  addSupply,
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
  beasts: Array<any>;
  warriors: Array<any>;
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

  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState<string | null>("0");
  const [baseJpgUrl, setBaseJpgUrl] = useState("");
  const [baseGifUrl, setBaseGifUrl] = useState("");
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

  const [strongestMonsterToHunt, setStrongestMonsterToHunt] = React.useState(0);

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
  }, []);

  let options = {
    address: ["0xc960D5645BD7Be251D3679C6e43993BAeEf99239"],
    topics: [],
  };

  const initMonster = async (legions: any) => {
    let monsterTmp;
    let monsterArraryTmp = [];
    for (let i = 1; i < 25; i++) {
      monsterTmp = await getMonsterInfo(web3, monsterContract, i);
      monsterArraryTmp.push({ ...monsterTmp, id: i });
    }
    console.log("monsterArraryTmp", monsterArraryTmp);
    setMonsters(monsterArraryTmp);

    if (legions[0]) {
      for (let i = 0; i < monsterArraryTmp.length; i++) {
        const monster: any = monsterArraryTmp[i];
        if (parseInt(monster?.ap) <= legions[0].attackPower) {
          setStrongestMonsterToHunt(i);
        } else {
          break;
        }
      }
    }
  };

  const updateMonster = async () => {
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
  };

  const initialize = async () => {
    setLoading(true);
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
    setBaseJpgUrl(await getBaseJpgURL(web3, monsterContract));
    setBaseGifUrl(await getBaseGifURL(web3, monsterContract));
    setLegionIDs(legionIDS);
    setLegions(legionArrayTmp);
    setCurLegion(legionArrayTmp[0]);
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
      const keys = Object.keys(response.events);
      console.log(keys);
      const result = response.events[keys[0]].returnValues;
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
    dispatch(
      setReloadStatus({
        reloadContractStatus: new Date(),
      })
    );
  };

  const handleSupplyClose = () => {
    setOpenSupply(false);
  };

  const handleSupplyClick = async (value: string) => {
    setSupplyLoading(true);
    setOpenSupply(false);
    try {
      await addSupply(
        web3,
        legionContract,
        account,
        curLegion?.id,
        parseInt(value)
      );
      await updateMonster();
    } catch (e) {
      console.log(e);
    }
    setSupplyLoading(false);
    // getBalance();
  };

  const calcHuntTime = (huntTime: any) => {
    var time = "~";
    if (huntTime != 0) {
      var diff = currentTime.getTime() - huntTime * 1000;
      if (diff / 1000 / 3600 >= 24) {
        time = "00s";
      } else {
        var totalSecs = parseInt(((24 * 1000 * 3600 - diff) / 1000).toFixed(2));
        var hours = Math.floor(totalSecs / 3600).toFixed(0);
        var mins = Math.floor((totalSecs % 3600) / 60).toFixed(0);
        var secs = Math.floor(totalSecs % 3600) % 60;
        if (parseInt(hours) > 0) {
          time = `${hours}h ${mins}m ${secs}s`;
        } else if (parseInt(mins) > 0) {
          time = `${mins}m ${secs}s`;
        } else {
          time = `${secs}s`;
        }
      }
    } else if (curLegion?.supplies != "0") {
      var time = "00s";
    }
    return time;
  };

  React.useEffect(() => {
    setTimeout(() => {
      setCurrentTime(new Date());
    }, 1000);
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
                  onClick={() => setOpenSupply(true)}
                >
                  {curLegion?.supplies}H {curLegion?.supplies == '0' && 'supplies needed'}
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
                    {getTranslation("buyingSupplies")}
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
                <Typography> Wait a moment, loading...</Typography>
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
                <Typography> Wait a moment, loading...</Typography>
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
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          {getTranslation("buySupply")}
          <span className="close-button" onClick={handleSupplyClose}>
            x
          </span>
        </DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem
            button
            sx={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => handleSupplyClick("7")}
          >
            <ListItemText
              primary={`7 Hunts (${curLegion && curLegion?.warriors.length * 7
                } $BLST)`}
            />
          </ListItem>
          <ListItem
            button
            sx={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => handleSupplyClick("14")}
          >
            <ListItemText
              primary={`14 Hunts (${curLegion && curLegion?.warriors.length * 13
                } $BLST)`}
            />
          </ListItem>
          <ListItem
            button
            sx={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => handleSupplyClick("28")}
          >
            <ListItemText
              primary={`28 Hunts (${curLegion && curLegion?.warriors.length * 24
                } $BLST)`}
            />
          </ListItem>
        </List>
      </Dialog>
    </Box>
  );
};

export default Monsters;
