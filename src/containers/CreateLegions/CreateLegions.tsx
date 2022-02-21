import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Helmet from "react-helmet";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Input,
  Slider,
  IconButton,
  FormControl,
  FormLabel,
  ButtonGroup,
  Button,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { useWeb3React } from "@web3-react/core";

import { meta_constant, createlegions } from "../../config/meta.config";
import {
  getLegionBloodstoneAllowance,
  setLegionBloodstoneApprove,
  getWarriorTokenIds,
  getWarriorToken,
} from "../../hooks/contractFunction";
import {
  mintLegion,
  getBeastTokenIds,
  getBeastToken,
  getBaseJpgURL,
  getBaseGifURL,
} from "../../hooks/contractFunction";
import {
  useBloodstone,
  useBeast,
  useWarrior,
  useWeb3,
  useLegion,
} from "../../hooks/useContract";
import { getTranslation } from "../../utils/translation";
import { formatNumber } from "../../utils/common";
import { WarriorsDragBox } from "./WarriorsDragBox";
import { BeastsDragBox } from "./BeastsDragBox";
import { DropBox } from "./DropBox";
import CommonBtn from "../../component/Buttons/CommonBtn";
import { Spinner } from "../../component/Buttons/Spinner";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    minHeight: "180px",
    height: "100%",
    justifyContent: "flex-start",
  },
  warning: {
    display: "flex",
    minHeight: "80px",
  },
});

const CreateLegions: React.FC = () => {
  const { account } = useWeb3React();

  const [loading, setLoading] = React.useState(true);
  const [baseBeastJpgUrl, setBaseBeastJpgUrl] = React.useState("");
  const [baseBeastGifUrl, setBaseBeastGifUrl] = React.useState("");
  const [baseWarriorJpgUrl, setBaseWarriorJpgUrl] = React.useState("");
  const [baseWarriorGifUrl, setBaseWarriorGifUrl] = React.useState("");
  const [apValue, setApValue] = React.useState<number[]>([500, 60000]);
  const [warrior5beast, setWarrior5beat] = React.useState(false);
  const [warriorDropBoxList, setWarriorDropBoxList] = React.useState(Array);
  const [beastDropBoxList, setBeastDropBoxList] = React.useState(Array);
  const [warriorDragBoxList, setWarriorDragBoxList] = React.useState(Array);
  const [beastDragBoxList, setBeastDragBoxList] = React.useState(Array);
  const [beasts, setBeasts] = React.useState(Array);
  const [warriors, setWarriors] = React.useState(Array);
  const [filter, setFilter] = React.useState("all");
  const [droppedID, setDroppedID] = React.useState(-1);
  const [w5bInDropList, setW5bInDropList] = React.useState(Boolean);
  const [indexForLeft, setIndexForLeft] = React.useState<Number>(-1);
  const [dropItemList, setDropItemList] = React.useState(Array);
  const [tempDroppedItem, setTempDroppedItem] = React.useState();
  const [showAnimation, setShowAnimation] = React.useState<string | null>("0");
  const [totalAP, setTotalAP] = React.useState(0);
  const [totalCP, setTotalCP] = React.useState(0);
  const [legionName, setLegionName] = React.useState("");
  const [isWDropable, setIsWDropable] = React.useState(false);
  const [mintLoading, setMintLoading] = React.useState(false);

  const navigate = useNavigate();
  const classes = useStyles();
  const warriorContract = useWarrior();
  const beastContract = useBeast();
  const legionContract = useLegion();
  const bloodstoneContract = useBloodstone();
  const web3 = useWeb3();

  React.useEffect(() => {
    if (account) {
      getBalance();
    }
    setShowAnimation(
      localStorage.getItem("showAnimation")
        ? localStorage.getItem("showAnimation")
        : "0"
    );
  }, []);

  React.useEffect(() => {
    if (
      beastDropBoxList.length < createlegions.main.maxAvailableDragCount &&
      droppedID > -1
    ) {
      let dragBoxList = warrior5beast ? warriorDragBoxList : beastDragBoxList;
      let dropBoxList = warrior5beast ? warriorDropBoxList : beastDropBoxList;
      const droppedIDIndex = dragBoxList.indexOf(droppedID);
      if (droppedIDIndex <= -1) {
        return;
      }
      let droppedNum = dragBoxList.splice(droppedIDIndex, 1)[0];
      dropBoxList = [...dropBoxList, droppedNum];
      if (warrior5beast) {
        setWarriorDropBoxList(dropBoxList);
        setWarriorDragBoxList(dragBoxList);
      } else {
        setBeastDropBoxList(dropBoxList);
        setBeastDragBoxList(dragBoxList);
      }
      setDropItemList((prevState) => [...prevState, tempDroppedItem]);
    }
    // getTotalAP_CP();
    setDroppedID(-1);
  }, [droppedID]);

  React.useEffect(() => {
    if (indexForLeft === -1) {
      return;
    }
    let dragBoxList = w5bInDropList ? warriorDragBoxList : beastDragBoxList;
    let dropBoxList = w5bInDropList ? warriorDropBoxList : beastDropBoxList;
    const droppedIDIndex = dropBoxList.indexOf(indexForLeft);
    if (droppedIDIndex <= -1) {
      return;
    }
    let tmpInsertPos = -1;
    let droppedNum = dropBoxList.splice(droppedIDIndex, 1)[0];
    let tmpIndexValue = droppedNum as number;
    if (tmpIndexValue === 0) {
      tmpInsertPos = 0;
    } else {
      let tmpDragBoxItem, tmpDragBoxItem1;
      for (let i = 0; i < dragBoxList.length; i++) {
        tmpDragBoxItem = dragBoxList[i] as number;
        tmpDragBoxItem1 = dragBoxList[i + 1] as number;
        if (tmpIndexValue < tmpDragBoxItem) {
          tmpInsertPos = 0;
          break;
        } else if (
          tmpDragBoxItem < tmpIndexValue &&
          tmpIndexValue < tmpDragBoxItem1
        ) {
          tmpInsertPos = i + 1;
          break;
        } else if (
          tmpIndexValue > (dragBoxList[dragBoxList.length - 1] as number)
        ) {
          tmpInsertPos = dragBoxList.length;
          break;
        }
      }
    }
    dragBoxList.splice(tmpInsertPos, 0, droppedNum);
    dragBoxList = [...dragBoxList];

    if (warrior5beast) {
      setWarriorDropBoxList(dropBoxList);
      setWarriorDragBoxList(dragBoxList);
    } else {
      setBeastDropBoxList(dropBoxList);
      setBeastDragBoxList(dragBoxList);
    }
    let tmpDropItemList = dropItemList;
    const indexOfRight = tmpDropItemList.findIndex(
      (item: any) => item.w5b === w5bInDropList && item.id === indexForLeft
    );
    tmpDropItemList.splice(indexOfRight, 1);
    setDropItemList(tmpDropItemList);
    setIndexForLeft(-1);
    // getTotalAP_CP();
  }, [indexForLeft, w5bInDropList]);

  React.useEffect(() => {
    let sum = 0;
    let cp = 0;
    warriorDropBoxList.forEach((index: any) => {
      sum += parseInt((warriors[index] as any)["power"]);
    });
    beastDropBoxList.forEach((index: any) => {
      cp += parseInt((beasts[index] as any)["capacity"]);
    });
    setTotalCP(cp);
    setTotalAP(sum);
    setIsWDropable(
      cp > 0 &&
        cp >= warriorDropBoxList.length &&
        sum >= createlegions.main.minAvailableAP &&
        legionName.length > 0
    );
  }, [
    warriorDragBoxList,
    beastDragBoxList,
    warriorDropBoxList,
    beastDropBoxList,
    legionName,
  ]);

  const getBalance = async () => {
    setLoading(true);
    setBaseBeastJpgUrl(await getBaseJpgURL(web3, beastContract));
    setBaseBeastGifUrl(await getBaseGifURL(web3, beastContract));
    setBaseWarriorJpgUrl(await getBaseJpgURL(web3, warriorContract));
    setBaseWarriorGifUrl(await getBaseGifURL(web3, warriorContract));
    const beastIds = await getBeastTokenIds(web3, beastContract, account);
    const warriorIds = await getWarriorTokenIds(web3, warriorContract, account);
    let amount = 0;
    let beast;
    let tempBeasts = [];
    let tempBeastsIndexS = [];
    for (let i = 0; i < beastIds.length; i++) {
      beast = await getBeastToken(web3, beastContract, beastIds[i]);
      tempBeasts.push({ ...beast, id: beastIds[i] });
      tempBeastsIndexS.push(i as number);
      amount += parseInt(beast.capacity);
    }
    let warrior;
    let tempWarriors = [];
    let tempWarriorsIndexS = [];
    for (let i = 0; i < warriorIds.length; i++) {
      warrior = await getWarriorToken(web3, warriorContract, warriorIds[i]);
      tempWarriors.push({ ...warrior, id: warriorIds[i] });
      tempWarriorsIndexS.push(i as number);
      amount += parseInt(warrior.power);
    }
    setBeasts(tempBeasts);
    setWarriors(tempWarriors);
    setBeastDragBoxList(tempBeastsIndexS);
    setWarriorDragBoxList(tempWarriorsIndexS);
    setLoading(false);
  };

  const changeDroppedIndex = (index: number) => {
    setDroppedID(index);
  };

  const moveToRight = (item: any) => {
    setTempDroppedItem(item);
  };
  const moveToLeft = (index: number, w5b: boolean) => {
    setIndexForLeft(index);
    setW5bInDropList(w5b);
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
  };

  const handleMint = async () => {
    setMintLoading(true);
    const allowance = await getLegionBloodstoneAllowance(
      web3,
      bloodstoneContract,
      account
    );
    if (allowance === "0") {
      await setLegionBloodstoneApprove(web3, bloodstoneContract, account);
    }
    await mintLegion(
      web3,
      legionContract,
      account,
      legionName,
      beasts
        .filter((b, index) => beastDropBoxList.includes(index))
        .map((beast: any) => {
          return parseInt(beast["id"]);
        }),
      warriors
        .filter((w, index) => warriorDropBoxList.includes(index))
        .map((warrior: any) => {
          return parseInt(warrior["id"]);
        })
    );
    setMintLoading(false);
    navigate("/legions");
  };

  const handleChangedName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 25) {
      return;
    }
    setLegionName(e.target.value);
    setIsWDropable(
      totalCP > 0 &&
        totalCP >= warriorDropBoxList.length &&
        totalAP >= createlegions.main.minAvailableAP &&
        legionName.length > 0
    );
  };

  return (
    <Box>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta_constant.createlegions.title}</title>
        <meta
          name="description"
          content={meta_constant.createlegions.description}
        />
        {meta_constant.createlegions.keywords && (
          <meta
            name="keywords"
            content={meta_constant.createlegions.keywords.join(",")}
          />
        )}
      </Helmet>
      <Grid container spacing={2} justifyContent="center" sx={{ my: 2 }}>
        <Grid item xs={12}>
          <Card>
            <Box
              className={classes.warning}
              sx={{ p: 4, justifyContent: "start", alignItems: "center" }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", mx: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                  {getTranslation("createLegion")}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <CommonBtn variant="contained" sx={{ fontWeight: "bold", p: 2 }}>
            <NavLink to="/legions" className="non-style">
              <IconButton
                aria-label="claim"
                component="span"
                sx={{ p: 0, mr: 1, color: "black", bgcolor: "smooth" }}
              >
                <ArrowBack />
              </IconButton>
              {getTranslation("btnBackToLegions")}
            </NavLink>
          </CommonBtn>
        </Grid>
        {!loading && (
          <DndProvider backend={HTML5Backend}>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              wrap="wrap-reverse"
              sx={{ my: 2 }}
            >
              <Grid item xs={12} sm={12} md={6}>
                <Card>
                  <Grid container spacing={2} sx={{ p: 4 }}>
                    <Grid item xs={12}>
                      <Grid container sx={{ justifyContent: "space-between" }}>
                        <Grid item>
                          <FormControl component="fieldset">
                            <ButtonGroup variant="outlined" color="primary">
                              <Button
                                variant={
                                  warrior5beast ? "contained" : "outlined"
                                }
                                onClick={() => {
                                  setWarrior5beat(!warrior5beast);
                                }}
                              >
                                {getTranslation("warriors")}
                              </Button>
                              <Button
                                variant={
                                  !warrior5beast ? "contained" : "outlined"
                                }
                                onClick={() => {
                                  setWarrior5beat(!warrior5beast);
                                }}
                              >
                                {getTranslation("beasts")}
                              </Button>
                            </ButtonGroup>
                          </FormControl>
                        </Grid>
                        {warrior5beast && (
                          <Grid item>
                            <FormControl
                              component="fieldset"
                              sx={{ width: "100%", minWidth: "250px" }}
                            >
                              <FormLabel component="legend">
                                {getTranslation("filterByAp")}:
                              </FormLabel>
                              <Slider
                                getAriaLabel={() => "Custom marks"}
                                // defaultValue={20}
                                value={apValue}
                                min={500}
                                max={60000}
                                marks={[
                                  { value: 500, label: "500" },
                                  {
                                    value: 60000,
                                    label: formatNumber("60000"),
                                  },
                                ]}
                                step={1}
                                valueLabelDisplay="auto"
                                onChange={handleChangeAp}
                                disableSwap
                              />
                            </FormControl>
                          </Grid>
                        )}
                        {!warrior5beast && (
                          <Grid item>
                            <FormControl component="fieldset">
                              <ButtonGroup
                                variant="outlined"
                                color="primary"
                                aria-label="outlined button group"
                              >
                                <Button
                                  variant={`${
                                    filter === "all" ? "contained" : "outlined"
                                  }`}
                                  onClick={() => setFilter("all")}
                                >
                                  {getTranslation("all")}
                                </Button>
                                <Button
                                  variant={`${
                                    filter === "1" ? "contained" : "outlined"
                                  }`}
                                  onClick={() => setFilter("1")}
                                >
                                  1
                                </Button>
                                <Button
                                  variant={`${
                                    filter === "2" ? "contained" : "outlined"
                                  }`}
                                  onClick={() => setFilter("2")}
                                >
                                  2
                                </Button>
                                <Button
                                  variant={`${
                                    filter === "3" ? "contained" : "outlined"
                                  }`}
                                  onClick={() => setFilter("3")}
                                >
                                  3
                                </Button>
                                <Button
                                  variant={`${
                                    filter === "4" ? "contained" : "outlined"
                                  }`}
                                  onClick={() => setFilter("4")}
                                >
                                  4
                                </Button>
                                <Button
                                  variant={`${
                                    filter === "5" ? "contained" : "outlined"
                                  }`}
                                  onClick={() => setFilter("5")}
                                >
                                  5
                                </Button>
                                <Button
                                  variant={`${
                                    filter === "20" ? "contained" : "outlined"
                                  }`}
                                  onClick={() => setFilter("20")}
                                >
                                  20
                                </Button>
                              </ButtonGroup>
                            </FormControl>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} sx={{ p: 4 }}>
                    {warrior5beast &&
                      warriors
                        .filter(
                          (fitem: any, findex) =>
                            warriorDragBoxList.includes(findex) &&
                            apValue[0] < parseInt(fitem.power) &&
                            apValue[1] > parseInt(fitem.power)
                        )
                        .map((item: any, index) => (
                          <WarriorsDragBox
                            item={item}
                            showAnimation={showAnimation}
                            baseJpgUrl={baseWarriorJpgUrl}
                            baseGifUrl={baseWarriorGifUrl}
                            baseIndex={warriorDragBoxList[index] as number}
                            dropped={changeDroppedIndex}
                            curIndex={index}
                            key={warriorDragBoxList[index] as number}
                          />
                        ))}
                    {!warrior5beast &&
                      beasts
                        .filter(
                          (fitem: any, findex) =>
                            beastDragBoxList.includes(findex) &&
                            (filter === "all"
                              ? parseInt(fitem.capacity) >= 0
                              : fitem.capacity === filter)
                        )
                        .map((item: any, index) => (
                          <BeastsDragBox
                            item={item}
                            showAnimation={showAnimation}
                            baseJpgUrl={baseBeastJpgUrl}
                            baseGifUrl={baseBeastGifUrl}
                            baseIndex={beastDragBoxList[index] as number}
                            dropped={changeDroppedIndex}
                            curIndex={index}
                            key={beastDragBoxList[index] as number}
                          />
                        ))}
                  </Grid>
                </Card>
              </Grid>

              {/* Right Panel */}
              <Grid item xs={12} sm={12} md={6}>
                <Card sx={{ height: "100%" }}>
                  <Grid item xs={12} sx={{ p: 4 }}>
                    <Grid container sx={{ justifyContent: "space-around" }}>
                      <Grid item>
                        <Input
                          placeholder={getTranslation("nameLegion")}
                          value={legionName}
                          onChange={handleChangedName}
                        />
                      </Grid>
                      <Grid item>
                        <CommonBtn
                          variant="contained"
                          sx={{
                            fontSize: 14,
                            fontWeight: "bold",
                            width: "100%",
                            marginBottom: 1,
                          }}
                          onClick={() => handleMint()}
                          disabled={!isWDropable || mintLoading}
                        >
                          {mintLoading ? (
                            <Spinner color="white" size={40} />
                          ) : (
                            getTranslation("createLegion") +
                            (totalAP < createlegions.main.minAvailableAP
                              ? " (min 2000 AP needed)"
                              : " " + totalAP + " AP")
                          )}
                        </CommonBtn>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sx={{ p: 4 }}>
                    <Grid
                      container
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        pb: 2,
                        borderBottom: "2px dashed grey",
                      }}
                    >
                      <Grid item>
                        <Typography>
                          {getTranslation("beasts")}: {beastDropBoxList.length}/
                          {createlegions.main.maxAvailableDragCount}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>
                          {getTranslation("warriors")}:{" "}
                          {warriorDropBoxList.length}/{formatNumber(totalCP)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <DropBox
                    showAnim={showAnimation}
                    baseBeastJpgUrl={baseBeastJpgUrl}
                    baseBeastGifUrl={baseBeastGifUrl}
                    baseWarriorJpgUrl={baseWarriorJpgUrl}
                    baseWarriorGifUrl={baseWarriorGifUrl}
                    items={dropItemList}
                    toLeft={moveToLeft}
                    moveToRight={moveToRight}
                  />
                </Card>
              </Grid>
            </Grid>
          </DndProvider>
        )}
        {loading && (
          <>
            <Grid item xs={12} sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h4">
                {getTranslation("loadingTitle")}
              </Typography>
            </Grid>
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
          </>
        )}
      </Grid>
    </Box>
  );
};

export default CreateLegions;
