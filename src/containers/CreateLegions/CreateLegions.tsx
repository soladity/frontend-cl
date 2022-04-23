import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Helmet from "react-helmet";
import {
  useTheme,
  useMediaQuery,
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
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
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
  getTrainingCost,
  mintLegion,
  getBeastTokenIds,
  getBeastToken,
  getBaseUrl,
  getAllWarriors,
  getAllBeasts,
  setApprovalForAll,
  isApprovedForAll,
} from "../../hooks/contractFunction";

import {
  useBloodstone,
  useBeast,
  useWarrior,
  useWeb3,
  useLegion,
  useFeeHandler,
} from "../../hooks/useContract";

import { getTranslation } from "../../utils/translation";
import { getWarriorStrength, toCapitalize } from "../../utils/common";
import { formatNumber } from "../../utils/common";
import { DropBox } from "../../component/Cards/DropBox";
import CommonBtn from "../../component/Buttons/CommonBtn";
import { Spinner } from "../../component/Buttons/Spinner";
import DraggableCard from "../../component/Cards/DraggableCard";
import Image from "../../config/image.json";
import warriorInfo from "../../constant/warriors";
import beastsTypeInfo from "../../constant/beasts";
import { getLegionAddress } from "../../utils/addressHelpers";

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

const capFilterConfigList = [
  { id: 0, name: getTranslation("all"), onClick: Function },
  { id: 1, name: "1", onClick: Function },
  { id: 2, name: "2", onClick: Function },
  { id: 3, name: "3", onClick: Function },
  { id: 4, name: "4", onClick: Function },
  { id: 5, name: "5", onClick: Function },
  { id: 6, name: "20", onClick: Function },
];

const powerFilterConfigList = [
  { id: 0, name: getTranslation("all"), min: 0, max: 10000, onClick: Function },
  { id: 1, name: "AP < 1K", min: 0, max: 1000, onClick: Function },
  { id: 2, name: "1K < AP < 2K", min: 999, max: 2000, onClick: Function },
  { id: 3, name: "2K < AP < 3K", min: 1999, max: 3000, onClick: Function },
  { id: 4, name: "3K < AP < 4K", min: 2999, max: 4000, onClick: Function },
  { id: 5, name: "4K < AP < 5K", min: 3999, max: 5000, onClick: Function },
  { id: 6, name: "5K < AP < 6K", min: 4999, max: 6000, onClick: Function },
  { id: 7, name: "6K < AP", min: 5999, max: 10000, onClick: Function },
];

interface IItem {
  w5b: boolean;
  type: string;
  strength: string;
  capacity: string;
  power: string;
  jpg: string;
  gif: string;
  id: string;
}

interface IMoveResult {
  left: IItem[];
  right: IItem[];
}

interface IBFilterItem {
  id: number;
  name: string;
  onClick: Function;
}

interface IWFilterItem {
  id: number;
  name: string;
  min: number;
  max: number;
  onClick: Function;
}

interface IClickedItem {
  index: number;
  clickedItem: string;
}

const CreateLegions: React.FC = () => {
  const { account } = useWeb3React();

  const [loading, setLoading] = React.useState(true);
  const [baseUrl, setBaseUrl] = React.useState("");
  const [apValue, setApValue] = React.useState<number[]>([500, 60000]);
  const [warrior5beast, setWarrior5beat] = React.useState(false);
  const [beasts, setBeasts] = React.useState<IItem[]>(Array);
  const [warriors, setWarriors] = React.useState<IItem[]>(Array);
  const [filter, setFilter] = React.useState("all");
  const [dropItemList, setDropItemList] = React.useState<IItem[]>(Array);
  const [showAnimation, setShowAnimation] = React.useState<string | null>("0");
  const [totalAP, setTotalAP] = React.useState(0);
  const [totalCP, setTotalCP] = React.useState(0);
  const [legionName, setLegionName] = React.useState("");
  const [isWDropable, setIsWDropable] = React.useState(false);
  const [mintLoading, setMintLoading] = React.useState(false);
  const [mintFee, setMintFee] = React.useState("0");
  const [comboFilterValue, setComboFilterValue] = React.useState("");
  const [comboFilterList, setComboFilterList] = React.useState<IBFilterItem[]>(
    []
  );
  const [comboWFilterValue, setComboWFilterValue] = React.useState("");
  const [comboWFilterList, setComboWFilterList] = React.useState<
    IWFilterItem[]
  >([]);

  const [approvalForBeast, setApprovalForBeast] = React.useState(false);
  const [approvalForWarrior, setApprovalForWarrior] = React.useState(false);

  const navigate = useNavigate();
  const classes = useStyles();
  const warriorContract = useWarrior();
  const beastContract = useBeast();
  const legionContract = useLegion();
  const bloodstoneContract = useBloodstone();
  const feeHandlerContract = useFeeHandler();
  const web3 = useWeb3();

  const theme = useTheme();
  const isSmallThanSM = useMediaQuery(theme.breakpoints.down("sm"));

  React.useEffect(() => {
    if (account) {
      getBalance();
    }
    setShowAnimation(
      localStorage.getItem("showAnimation")
        ? localStorage.getItem("showAnimation")
        : "0"
    );
    let tmpFilterItem: IBFilterItem;
    let tmpFilterArray: IBFilterItem[] = [];
    capFilterConfigList.forEach((filterConfig: IBFilterItem) => {
      tmpFilterItem = {
        id: filterConfig.id,
        name: filterConfig.name,
        onClick: () => setFilter(filterConfig.name),
      };
      tmpFilterArray.push(tmpFilterItem);
    });
    let tmpWFilterItem: IWFilterItem;
    let tmpWFilterArray: IWFilterItem[] = [];
    powerFilterConfigList.forEach(
      (filterConfig: IWFilterItem, index: number) => {
        tmpWFilterItem = {
          id: index,
          name: filterConfig.name,
          min: filterConfig.min,
          max: filterConfig.max,
          onClick: () => setApValue([filterConfig.min, filterConfig.max]),
        };
        tmpWFilterArray.push(tmpWFilterItem);
      }
    );
    setComboFilterList(tmpFilterArray);
    setComboWFilterList(tmpWFilterArray);
  }, []);

  React.useEffect(() => {
    let sum = 0;
    let cp = 0;
    dropItemList.forEach((item: IItem) => {
      if (item.w5b) {
        sum += parseInt(item.power);
      } else {
        cp += parseInt(item.capacity);
      }
    });
    setTotalCP(cp);
    setTotalAP(sum);
    setIsWDropable(
      cp > 0 &&
        createlegions.main.maxAvailableDragCount >=
          dropItemList.filter((item) => !item.w5b).length &&
        cp >= dropItemList.filter((item) => item.w5b).length &&
        sum >= createlegions.main.minAvailableAP &&
        legionName.length > 0
    );
    setFee();
  }, [beasts, warriors, dropItemList, legionName]);

  const setFee = async () => {
    setMintFee(
      (
        (await getTrainingCost(feeHandlerContract, dropItemList.length)) /
        Math.pow(10, 18)
      ).toFixed(3)
    );
  };

  const getBalance = async () => {
    setLoading(true);
    try {
      if (
        !(await isApprovedForAll(beastContract, account, getLegionAddress()))
      ) {
        await setApprovalForAll(
          account,
          beastContract,
          getLegionAddress(),
          true
        );
        setApprovalForBeast(true);
      }
      if (
        !(await isApprovedForAll(warriorContract, account, getLegionAddress()))
      ) {
        await setApprovalForAll(
          account,
          warriorContract,
          getLegionAddress(),
          true
        );
        setApprovalForWarrior(true);
      }
      await getWarriors();
      await getBeasts();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(true);
    }
  };

  const getWarriors = async () => {
    var tempWarriors: any[] = [];
    try {
      const warriorsInfo = await getAllWarriors(warriorContract, account);

      let ids = warriorsInfo[0];
      let powers = warriorsInfo[1];
      ids.forEach((id: any, index: number) => {
        var temp = {
          id: id,
          type: warriorInfo[getWarriorStrength(parseInt(powers[index])) - 1],
          strength: getWarriorStrength(powers[index]),
          capacity: "",
          power: powers[index],
          w5b: true,
          jpg: "",
          gif: "",
        };
        tempWarriors.push(temp);
      });
    } catch (error) {}
    setWarriors(tempWarriors);
  };

  const getBeasts = async () => {
    var tempBeasts: any[] = [];
    try {
      const beastsInfo = await getAllBeasts(beastContract, account);
      let ids = beastsInfo[0];
      let capacities = beastsInfo[1];
      ids.forEach((id: any, index: number) => {
        var temp = {
          id: id,
          type: beastsTypeInfo[
            capacities[index] == 20 ? 5 : capacities[index] - 1
          ],
          strength: capacities[index],
          capacity: capacities[index],
          power: "",
          w5b: false,
          jpg: "",
          gif: "",
        };
        tempBeasts.push(temp);
      });
    } catch (error) {}
    setBeasts(tempBeasts);
  };

  const moveToLeft = (index: number, w5b: boolean) => {
    const dropItemClone = [...dropItemList];
    const srcClone = w5b ? [...warriors] : [...beasts];
    const [removed] = dropItemClone.splice(index, 1);
    srcClone.splice(srcClone.length, 0, removed);
    setDropItemList(dropItemClone);
    if (w5b) {
      setWarriors(srcClone);
    } else {
      setBeasts(srcClone);
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
  };

  const handleMint = async () => {
    setMintLoading(true);
    const allowance = await getLegionBloodstoneAllowance(
      web3,
      bloodstoneContract,
      account
    );
    try {
      if (allowance === "0") {
        await setLegionBloodstoneApprove(web3, bloodstoneContract, account);
      }
      console.log(getLegionAddress());
      await mintLegion(
        web3,
        legionContract,
        account,
        legionName,
        dropItemList
          .filter((item) => item.w5b === false)
          .map((fitem: any) => {
            return parseInt(fitem["id"]);
          }),
        dropItemList
          .filter((item) => item.w5b === true)
          .map((fitem: any) => {
            return parseInt(fitem["id"]);
          })
      );
    } catch (e) {
      console.log(e);
      setMintLoading(false);
      return;
    }
    setMintLoading(false);
    navigate("/legions");
  };

  const handleChangedName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 25) {
      return;
    }
    setLegionName(e.target.value);
  };

  const move = (
    src: IItem[],
    des: IItem[],
    droppableSrc: IClickedItem,
    droppableDes: IClickedItem
  ): IMoveResult | any => {
    const srcClone = [...src];
    const desClone = [...des];
    const [removed] = srcClone.splice(droppableSrc.index, 1);
    desClone.splice(droppableDes.index, 0, removed);

    const result = {} as { [index: string]: any };
    result[droppableSrc.clickedItem] = srcClone;
    result[droppableDes.clickedItem] = desClone;
    return result;
  };

  const handleMoveEvent = (from: IClickedItem, to: IClickedItem) => {
    if (!from || !to) {
      return;
    }

    const src = warrior5beast ? warriors : beasts;
    const resultFromMove: IMoveResult = move(src, dropItemList, from, to);
    if (warrior5beast) {
      setWarriors(resultFromMove.left);
    } else {
      setBeasts(resultFromMove.left);
    }
    setDropItemList(resultFromMove.right);
  };

  const handleComboFilter = (e: SelectChangeEvent) => {
    setComboFilterValue(e.target.value);
    const curFilterIndex = comboFilterList.findIndex(
      (filterItem) => filterItem.id === +e.target.value
    );
    comboFilterList[curFilterIndex].onClick();
  };

  const handleWComboFilter = (e: SelectChangeEvent) => {
    const curFilterIndex = comboWFilterList.findIndex(
      (filterItem) => filterItem.id === +e.target.value
    );
    setComboWFilterValue(e.target.value);
    comboWFilterList[curFilterIndex].onClick();
  };

  const tokenID2Index = (w5b: boolean, tokenID: number): number => {
    const tmpSrc = w5b ? warriors : beasts;
    return tmpSrc.findIndex((item) => +item.id === tokenID);
  };

  const handleCardClick = (from: number, to: number, where: boolean) => {
    const fromItem: IClickedItem = {
      index: tokenID2Index(warrior5beast, from),
      clickedItem: where ? "left" : "right",
    };
    const toItem: IClickedItem = {
      index: to,
      clickedItem: where ? "right" : "left",
    };
    handleMoveEvent(fromItem, toItem);
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
        {isSmallThanSM === false && (
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
        )}
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
              {isSmallThanSM
                ? getTranslation("back")
                : getTranslation("btnBackToLegions")}
            </NavLink>
          </CommonBtn>
        </Grid>
        {!loading && (
          <Grid
            container
            spacing={2}
            justifyContent="center"
            wrap="wrap-reverse"
            sx={{ my: 2 }}
          >
            <Grid item xs={6}>
              <Card>
                <Grid
                  container
                  spacing={2}
                  sx={isSmallThanSM ? { pt: 2, px: 2 } : { pt: 4, px: 4 }}
                >
                  <Grid item xs={12}>
                    <Grid container sx={{ justifyContent: "space-between" }}>
                      <Grid
                        item
                        sx={isSmallThanSM ? { mb: 2 } : { mb: 4 }}
                        xs={12}
                        lg={6}
                      >
                        <FormControl component="fieldset">
                          <ButtonGroup variant="outlined" color="primary">
                            <Button
                              variant={warrior5beast ? "contained" : "outlined"}
                              onClick={() => {
                                setWarrior5beat(!warrior5beast);
                              }}
                            >
                              {isSmallThanSM ? "W" : getTranslation("warriors")}
                            </Button>
                            <Button
                              variant={
                                !warrior5beast ? "contained" : "outlined"
                              }
                              onClick={() => {
                                setWarrior5beat(!warrior5beast);
                              }}
                            >
                              {isSmallThanSM ? "B" : getTranslation("beasts")}
                            </Button>
                          </ButtonGroup>
                        </FormControl>
                      </Grid>
                      {warrior5beast &&
                        (isSmallThanSM ? (
                          <Grid
                            item
                            sx={isSmallThanSM ? { mb: 2 } : { mb: 4 }}
                            xs={12}
                            lg={6}
                          >
                            <FormControl fullWidth>
                              <InputLabel
                                id="demo-simple-select-label"
                                style={{ fontSize: isSmallThanSM ? 10 : 14 }}
                              >
                                {getTranslation("filterByAp")}
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={comboWFilterValue}
                                label={getTranslation("filterByAp")}
                                onChange={handleWComboFilter}
                              >
                                {comboWFilterList.map(
                                  (comboFilterItem: IWFilterItem, index) => (
                                    <MenuItem
                                      value={comboFilterItem.id}
                                      key={index}
                                    >
                                      {comboFilterItem.name}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                            </FormControl>
                          </Grid>
                        ) : (
                          <Grid
                            item
                            sx={isSmallThanSM ? { mb: 2 } : { mb: 4 }}
                            xs={12}
                            lg={6}
                          >
                            <FormControl
                              component="fieldset"
                              sx={{ width: "100%" }}
                            >
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
                                  {
                                    value: 6000,
                                    label: formatNumber("6000+"),
                                  },
                                ]}
                                step={1}
                                valueLabelDisplay="auto"
                                onChange={handleChangeAp}
                                disableSwap
                              />
                            </FormControl>
                          </Grid>
                        ))}
                      {!warrior5beast &&
                        (isSmallThanSM ? (
                          <Grid
                            item
                            sx={isSmallThanSM ? { mb: 2 } : { mb: 4 }}
                            xs={12}
                            lg={6}
                          >
                            <FormControl fullWidth>
                              <InputLabel
                                id="demo-simple-select-label"
                                style={{ fontSize: isSmallThanSM ? 10 : 14 }}
                              >
                                {getTranslation("filterCapacity")}
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={comboFilterValue}
                                label={getTranslation("filterCapacity")}
                                onChange={handleComboFilter}
                              >
                                {comboFilterList.map(
                                  (comboFilterItem: IBFilterItem, index) => (
                                    <MenuItem
                                      value={comboFilterItem.id}
                                      key={index}
                                    >
                                      {toCapitalize(comboFilterItem.name)}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                            </FormControl>
                          </Grid>
                        ) : (
                          <Grid item sx={isSmallThanSM ? { mb: 2 } : { mb: 4 }}>
                            <FormControl component="fieldset">
                              <ButtonGroup
                                variant="outlined"
                                color="primary"
                                aria-label="outlined button group"
                                sx={{ flexWrap: "wrap" }}
                                size={isSmallThanSM ? "small" : "medium"}
                              >
                                <Button
                                  variant={`${
                                    filter === "all" ? "contained" : "outlined"
                                  }`}
                                  sx={{
                                    borderRightColor: "#f66810 !important",
                                  }}
                                  onClick={() => setFilter("all")}
                                >
                                  {getTranslation("all")}
                                </Button>
                                <Button
                                  variant={`${
                                    filter === "1" ? "contained" : "outlined"
                                  }`}
                                  sx={{
                                    borderRightColor: "#f66810 !important",
                                  }}
                                  onClick={() => setFilter("1")}
                                >
                                  1
                                </Button>
                                <Button
                                  variant={`${
                                    filter === "2" ? "contained" : "outlined"
                                  }`}
                                  sx={{
                                    borderRightColor: "#f66810 !important",
                                  }}
                                  onClick={() => setFilter("2")}
                                >
                                  2
                                </Button>
                                <Button
                                  variant={`${
                                    filter === "3" ? "contained" : "outlined"
                                  }`}
                                  sx={{
                                    borderRightColor: "#f66810 !important",
                                  }}
                                  onClick={() => setFilter("3")}
                                >
                                  3
                                </Button>
                                <Button
                                  variant={`${
                                    filter === "4" ? "contained" : "outlined"
                                  }`}
                                  sx={{
                                    borderRightColor: "#f66810 !important",
                                  }}
                                  onClick={() => setFilter("4")}
                                >
                                  4
                                </Button>
                                <Button
                                  variant={`${
                                    filter === "5" ? "contained" : "outlined"
                                  }`}
                                  sx={{
                                    borderRightColor: "#f66810 !important",
                                  }}
                                  onClick={() => setFilter("5")}
                                >
                                  5
                                </Button>
                                <Button
                                  variant={`${
                                    filter === "20" ? "contained" : "outlined"
                                  }`}
                                  sx={{
                                    borderRightColor: "#f66810 !important",
                                  }}
                                  onClick={() => setFilter("20")}
                                >
                                  20
                                </Button>
                              </ButtonGroup>
                            </FormControl>
                          </Grid>
                        ))}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  sx={isSmallThanSM ? { p: 2 } : { p: 4 }}
                >
                  {warrior5beast &&
                    warriors
                      .filter(
                        (item: any) =>
                          apValue[0] <= parseInt(item.power) &&
                          (apValue[1] === 6000
                            ? true
                            : apValue[1] >= parseInt(item.power))
                      )
                      .map((item: any, index) => (
                        <DraggableCard
                          w5b={true}
                          image={
                            showAnimation === "0"
                              ? "/assets/images/characters/jpg/warriors/" +
                                item["type"] +
                                ".jpg"
                              : "/assets/images/characters/gif/warriors/" +
                                item["type"] +
                                ".gif"
                          }
                          item={item}
                          key={10000 + item.id}
                          index={+item.id}
                          handleClick={handleCardClick}
                        />
                      ))}
                  {!warrior5beast &&
                    beasts
                      .filter((fitem: any) =>
                        filter === "all"
                          ? parseInt(fitem.capacity) >= 0
                          : fitem.capacity === filter
                      )
                      .map((item: any, index) => (
                        <DraggableCard
                          w5b={false}
                          image={
                            showAnimation === "0"
                              ? "/assets/images/characters/jpg/beasts/" +
                                item["type"] +
                                ".jpg"
                              : "/assets/images/characters/gif/beasts/" +
                                item["type"] +
                                ".gif"
                          }
                          item={item}
                          key={item.id}
                          index={+item.id}
                          handleClick={handleCardClick}
                        />
                      ))}
                </Grid>
              </Card>
            </Grid>

            {/* Right Panel */}
            <Grid item xs={6}>
              <Card
                sx={{
                  height: "100%",
                  fontSize: isSmallThanSM ? 10 : 14,
                }}
              >
                <Grid item xs={12} sx={{ pt: 2, px: 2 }}>
                  <Grid container sx={{ justifyContent: "space-around" }}>
                    <Grid item sx={{ mb: 2 }}>
                      <Input
                        style={{
                          fontSize: isSmallThanSM ? 10 : 14,
                        }}
                        placeholder={
                          isSmallThanSM
                            ? getTranslation("name")
                            : getTranslation("nameLegion")
                        }
                        value={legionName}
                        onChange={handleChangedName}
                      />
                    </Grid>
                    <Grid item>
                      <CommonBtn
                        variant="contained"
                        sx={{
                          fontSize: isSmallThanSM ? 10 : 14,
                          fontWeight: "bold",
                          width: "100%",
                          marginBottom: 1,
                        }}
                        onClick={() => handleMint()}
                        disabled={!isWDropable || mintLoading}
                      >
                        {isSmallThanSM ? (
                          getTranslation("create") +
                          " (" +
                          formatNumber(totalAP) +
                          "AP)"
                        ) : mintLoading ? (
                          <Spinner color="white" size={40} />
                        ) : totalCP <
                          dropItemList.filter((item) => item.w5b).length ? (
                          getTranslation("createLegion") +
                          " " +
                          formatNumber(totalAP) +
                          " AP" +
                          " (" +
                          getTranslation("notEnoughBeasts") +
                          ")"
                        ) : (
                          getTranslation("createLegion") +
                          (totalAP < createlegions.main.minAvailableAP
                            ? " (" +
                              getTranslation("min") +
                              " 2000 AP " +
                              getTranslation("needed") +
                              ")"
                            : " " + formatNumber(totalAP) + " AP")
                        )}
                      </CommonBtn>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    px: 2,
                    pt: 2,
                    textAlign: "center",
                  }}
                >
                  {isSmallThanSM
                    ? getTranslation("ShortFeeToolTip") + mintFee + " $BLST"
                    : getTranslation("LongFeeToolTip") + mintFee + " $BLST"}
                </Grid>
                <Grid item xs={12} sx={{ p: 2 }}>
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      pb: 2,
                      borderBottom: "2px dashed grey",
                    }}
                  >
                    <Grid
                      item
                      sx={{
                        color:
                          totalCP <
                          dropItemList.filter((item) => item.w5b).length
                            ? "red"
                            : "white",
                        fontWeight:
                          totalCP <
                          dropItemList.filter((item) => item.w5b).length
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {isSmallThanSM ? "W" : getTranslation("warriors")}:{" "}
                      {dropItemList.filter((item) => item.w5b === true).length}/
                      {formatNumber(totalCP)}
                    </Grid>
                    <Grid
                      item
                      sx={{
                        color:
                          createlegions.main.maxAvailableDragCount <
                          dropItemList.filter((item) => !item.w5b).length
                            ? "red"
                            : "white",
                        fontWeight:
                          createlegions.main.maxAvailableDragCount <
                          dropItemList.filter((item) => !item.w5b).length
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {isSmallThanSM ? "B" : getTranslation("beasts")}:{" "}
                      {dropItemList.filter((item) => item.w5b === false).length}
                      /{createlegions.main.maxAvailableDragCount}
                    </Grid>
                  </Grid>
                </Grid>
                <DropBox
                  showAnim={showAnimation}
                  baseUrl={baseUrl}
                  items={dropItemList}
                  moveToLeft={moveToLeft}
                />
              </Card>
            </Grid>
          </Grid>
        )}
        {loading && (
          <>
            <Grid item xs={12} sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h4">
                {!approvalForBeast && !approvalForWarrior
                  ? getTranslation("approvalAllBeastsAndWarriors")
                  : !approvalForBeast
                  ? getTranslation("approvalAllWarriors")
                  : !approvalForWarrior
                  ? getTranslation("approvalAllBeasts")
                  : getTranslation("loadingTitle")}
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
