import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  ButtonGroup,
  Button,
  Slider,
  FormLabel,
  FormControl,
  Checkbox,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  DialogContent,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
} from "@mui/material";
import Helmet from "react-helmet";
import { makeStyles } from "@mui/styles";
import { useWeb3React } from "@web3-react/core";
import { NavLink, useNavigate } from "react-router-dom";

import LegionCard from "../../component/Cards/LegionCard";
import {
  useBeast,
  useWarrior,
  useLegion,
  useMarketplace,
  useFeeHandler,
  useBloodstone,
  useWeb3,
  useRewardPool,
} from "../../hooks/useContract";
import {
  getBeastBalance,
  getWarriorBalance,
  getLegionTokenIds,
  getLegionToken,
  addSupply,
  getBaseUrl,
  getLegionBloodstoneAllowance,
  setLegionBloodstoneApprove,
  getHuntStatus,
  setMarketplaceApprove,
  sellToken,
  getFee,
  getBloodstoneBalance,
  getUnclaimedBLST,
  getSupplyCost,
  getUSDAmountFromBLST,
  getAllLegions,
  isApprovedForAll,
  setApprovalForAll,
} from "../../hooks/contractFunction";
import { allConstants, meta_constant } from "../../config/meta.config";
import { getTranslation } from "../../utils/translation";
import CommonBtn from "../../component/Buttons/CommonBtn";
import { formatNumber } from "../../utils/common";
import { useDispatch } from "react-redux";
import { setReloadStatus } from "../../actions/contractActions";
import { FaTimes } from "react-icons/fa";
import { getMarketplaceAddress } from "../../utils/addressHelpers";

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

type LegionProps = {
  id: string;
  name: string;
  beasts: Array<string>;
  warriors: Array<string>;
  supplies: string;
  attackPower: number;
  image: string;
  huntStatus: string;
};

const Legions = () => {
  const { account } = useWeb3React();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [beastBalance, setBeastBalance] = React.useState("0");
  const [warriorBalance, setWarriorBalance] = React.useState("0");
  const [baseUrl, setBaseUrl] = React.useState("");
  const [totalPower, setTotalPower] = React.useState(0);
  const [legions, setLegions] = React.useState<LegionProps[]>(Array);
  const [top3Legions, setTop3Lgions] = React.useState<LegionProps[]>(Array);
  const [highest, setHighest] = React.useState(true);
  const [huntStatus, setHuntStatus] = React.useState("all");
  const [hideWeak, setHideWeak] = React.useState(false);
  const [openSupply, setOpenSupply] = React.useState(false);
  const [selectedLegion, setSelectedLegion] = React.useState(-1);
  const [openShopping, setOpenShopping] = React.useState(false);
  const [price, setPrice] = React.useState(0);
  const [marketplaceTax, setMarketplaceTax] = React.useState("0");
  const [loading, setLoading] = React.useState(false);
  const [supplyLoading, setSupplyLoading] = React.useState(false);
  const [apValue, setApValue] = React.useState<number[]>([0, 100000]);
  const [actionLoading, setActionLoading] = React.useState(false);

  const [supplyValues, setSupplyValues] = React.useState([0, 0, 0]);
  const [supplyOrder, setSupplyOrder] = React.useState(0);
  const [supplyCostLoading, setSupplyCostLoading] = React.useState(false);

  const [blstBalance, setBlstBalance] = React.useState(0);
  const [unclaimedBlst, setUnclaimedBlst] = React.useState(0);
  const [BlstToUsd, setBlstToUsd] = React.useState(0);

  const maxSellPrice = allConstants.maxSellPrice;

  const classes = useStyles();
  const legionContract = useLegion();
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const marketplaceContract = useMarketplace();
  const bloodstoneContract = useBloodstone();
  const feeHandlerContract = useFeeHandler();
  const rewardPoolContract = useRewardPool();
  const web3 = useWeb3();

  React.useEffect(() => {
    if (account) {
      getBalance();
    }
  }, []);

  const getLegionImageUrl = (ap: number) => {
    const showAnimation = localStorage.getItem("showAnimation")
      ? localStorage.getItem("showAnimation")
      : "0";
    if (ap <= 150000)
      return showAnimation === "0"
        ? "/assets/images/characters/jpg/legions/legion0.jpg"
        : "/assets/images/characters/gif/legions/legion0.gif";
    else if (ap > 150000 && ap <= 300000)
      return showAnimation === "0"
        ? "/assets/images/characters/jpg/legions/legion15.jpg"
        : "/assets/images/characters/gif/legions/legion15.gif";
    else if (ap > 300000 && ap <= 450000)
      return showAnimation === "0"
        ? "/assets/images/characters/jpg/legions/legion30.jpg"
        : "/assets/images/characters/gif/legions/legion30.gif";
    else if (ap > 450000 && ap <= 600000)
      return showAnimation === "0"
        ? "/assets/images/characters/jpg/legions/legion45.jpg"
        : "/assets/images/characters/gif/legions/legion45.gif";
    else if (ap > 600000 && ap <= 2500000)
      return showAnimation === "0"
        ? "/assets/images/characters/jpg/legions/legion60.jpg"
        : "/assets/images/characters/gif/legions/legion60.gif";
    else
      return showAnimation === "0"
        ? "/assets/images/characters/jpg/legions/legion250.jpg"
        : "/assets/images/characters/gif/legions/legion250.gif";
  };

  const getBalance = async () => {
    console.log(await getAllLegions(legionContract, account));
    setLoading(true);

    setBlstBalance(
      await getBloodstoneBalance(web3, bloodstoneContract, account)
    );
    setUnclaimedBlst(await getUnclaimedBLST(web3, rewardPoolContract, account));
    setMarketplaceTax(((await getFee(feeHandlerContract, 0)) / 100).toFixed(0));
    setBaseUrl(await getBaseUrl());
    setBeastBalance(await getBeastBalance(web3, beastContract, account));
    setWarriorBalance(await getWarriorBalance(web3, warriorContract, account));
    const allLegions = await getAllLegions(legionContract, account);
    let amount = 0;
    const tempAllLegions = allLegions[0].map((legion: any, index: number) => {
      amount += parseInt(legion.attack_power) / 100;
      return {
        name: legion.name,
        beasts: legion.beast_ids,
        warriors: legion.warrior_ids,
        attackPower: (parseInt(legion.attack_power) / 100).toFixed(0),
        image: getLegionImageUrl(parseInt(legion.attack_power) / 100),
        supplies: legion.supplies,
        realPower: legion.attack_power,
        id: allLegions[1][index],
        huntStatus: allLegions[2][index]
          ? "green"
          : legion.supplies == "0"
          ? "red"
          : "orange",
      };
    });
    setTotalPower(parseInt(amount.toFixed(0)));
    let sortedArray = tempAllLegions.sort((a: any, b: any) => {
      if (a.attackPower > b.attackPower) {
        return -1;
      }
      if (a.attackPower < b.attackPower) {
        return 1;
      }
      return 0;
    });
    setLegions(sortedArray);
    setTop3Lgions(sortedArray.slice(0, 3));
    setLoading(false);
  };

  const checkApprovalForAll = async () => {
    console.log(
      await isApprovedForAll(legionContract, account, getMarketplaceAddress())
    );
    if (
      (await isApprovedForAll(
        legionContract,
        account,
        getMarketplaceAddress()
      )) === false
    ) {
      console.log("set");
      await setApprovalForAll(
        account,
        legionContract,
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
  };

  const handleSupplyClose = () => {
    setOpenSupply(false);
  };

  const handleSupplyClick = async (fromWallet: boolean) => {
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
        selectedLegion,
        supplyOrder == 0 ? 7 : supplyOrder == 1 ? 14 : 28,
        fromWallet
      );
      dispatch(
        setReloadStatus({
          reloadContractStatus: new Date(),
        })
      );
    } catch (e) {}
    setSupplyLoading(false);
    getBalance();
  };

  const handleOpenSupply = async (id: number, warriorCnt: any) => {
    setSelectedLegion(id);
    setSupplyCostLoading(true);
    try {
      setOpenSupply(true);
      var tempArr = [];
      tempArr.push(await getSupplyCost(feeHandlerContract, warriorCnt, 7));
      tempArr.push(await getSupplyCost(feeHandlerContract, warriorCnt, 14));
      tempArr.push(await getSupplyCost(feeHandlerContract, warriorCnt, 28));
      setSupplyValues(tempArr);
    } catch (error) {}
    setSupplyCostLoading(false);
  };

  const handleUpdateLegoin = (id: number) => {
    navigate("/updatelegions/" + id);
  };

  const handleShoppingClose = () => {
    setOpenShopping(false);
  };

  const handleOpenShopping = (id: number) => {
    setSelectedLegion(id);
    setOpenShopping(true);
  };

  const handlePrice = async (e: any) => {
    var price = e.target.value;
    if (price >= 1) {
      if (price[0] == "0") {
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
      if (price == "") {
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
    setActionLoading(true);
    setOpenShopping(false);
    try {
      // await setMarketplaceApprove(
      //   web3,
      //   legionContract,
      //   account,
      //   selectedLegion
      // );
      await checkApprovalForAll();
      await sellToken(
        web3,
        marketplaceContract,
        account,
        "3",
        selectedLegion,
        BigInt(price * Math.pow(10, 18))
      );
      let power = 0;
      let temp = legions;
      for (let i = 0; i < temp.length; i++) {
        if (parseInt(temp[i]["id"]) === selectedLegion)
          power = temp[i]["attackPower"];
      }
      setTotalPower(totalPower - power);
      setSelectedLegion(-1);
      setLegions(
        legions.filter((item: any) => parseInt(item.id) !== selectedLegion)
      );
    } catch (e) {}
    setActionLoading(false);
  };

  const handleSort = (value: boolean) => {
    setHighest(value);
    handleSortValue();
  };

  const handleSortValue = () => {
    let temp = legions;
    temp.sort((a: any, b: any) => {
      if (highest === true) {
        if (parseInt(a.attackPower) > parseInt(b.attackPower)) {
          return 1;
        }
        if (parseInt(a.attackPower) < parseInt(b.attackPower)) {
          return -1;
        }
      } else {
        if (parseInt(a.attackPower) > parseInt(b.attackPower)) {
          return -1;
        }
        if (parseInt(a.attackPower) < parseInt(b.attackPower)) {
          return 1;
        }
      }
      return 0;
    });
    setLegions(temp);
  };

  return (
    <Box>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta_constant.legions.title}</title>
        <meta name="description" content={meta_constant.legions.description} />
        {meta_constant.legions.keywords && (
          <meta
            name="keywords"
            content={meta_constant.legions.keywords.join(",")}
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
                  {getTranslation("legions")}
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
              <CommonBtn sx={{ fontWeight: "bold" }}>
                <NavLink to="/createlegions" className="non-style">
                  {getTranslation("createLegion")}
                </NavLink>
              </CommonBtn>
              <Box sx={{ display: "flex", mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {getTranslation("availableWarrior")}
                </Typography>
                <Typography
                  variant="h6"
                  color="secondary"
                  sx={{ fontWeight: "bold", ml: 2 }}
                >
                  {warriorBalance}
                </Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {getTranslation("availableBeast")}
                </Typography>
                <Typography
                  variant="h6"
                  color="secondary"
                  sx={{ fontWeight: "bold", ml: 2 }}
                >
                  {beastBalance}
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
                {getTranslation("currentLegion")}
              </Typography>
              <Typography
                variant="h4"
                color="secondary"
                sx={{ fontWeight: "bold" }}
              >
                {legions.length}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {getTranslation("totalAp")}
              </Typography>
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {formatNumber(totalPower)}
              </Typography>
              <CommonBtn sx={{ fontWeight: "bold", mt: 1 }}>
                <NavLink to="/hunt" className="non-style">
                  {getTranslation("hunt")}
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
                {getTranslation("top3Legions")}
              </Typography>
              {top3Legions
                .filter((item: any, index) => index < 3)
                .map((item: any, index) => (
                  <Box sx={{ display: "flex" }} key={index}>
                    <Typography variant="subtitle1">{item.name}</Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        ml: 2,
                        color:
                          item.huntStatus === "green"
                            ? "green"
                            : item.huntStatus === "orange"
                            ? "orange"
                            : "red",
                      }}
                    >
                      {formatNumber(item.attackPower)} AP
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
      {loading === false && supplyLoading === false && actionLoading === false && (
        <div>
          <Grid container spacing={2} sx={{ my: 3 }}>
            <Grid item xs={12} md={6} lg={3}>
              <FormControl component="fieldset" sx={{ width: "90%" }}>
                <FormLabel component="legend">
                  {getTranslation("filterByAp")}:
                </FormLabel>
                <Slider
                  getAriaLabel={() => "Custom marks"}
                  // defaultValue={20}
                  value={apValue}
                  min={0}
                  max={100000}
                  marks={[
                    { value: 2000, label: "0" },
                    { value: 100000, label: formatNumber("100K+") },
                  ]}
                  step={1}
                  valueLabelDisplay="auto"
                  onChange={handleChangeAp}
                  disableSwap
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <FormControl component="fieldset" sx={{ width: "90%" }}>
                <FormLabel component="legend">
                  {getTranslation("sortByAp")}:
                </FormLabel>
                <ButtonGroup variant="outlined" color="primary" sx={{ pt: 1 }}>
                  <Button
                    variant={!highest ? "contained" : "outlined"}
                    onClick={() => {
                      handleSort(!highest);
                    }}
                  >
                    {getTranslation("lowest")}
                  </Button>
                  <Button
                    variant={highest ? "contained" : "outlined"}
                    onClick={() => {
                      handleSort(!highest);
                    }}
                  >
                    {getTranslation("highest")}
                  </Button>
                </ButtonGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <FormControl component="fieldset" sx={{ width: "90%" }}>
                <FormLabel component="legend">
                  {getTranslation("huntStatus")}:
                </FormLabel>
                <ButtonGroup variant="outlined" color="primary" sx={{ pt: 1 }}>
                  <Button
                    variant={huntStatus === "all" ? "contained" : "outlined"}
                    onClick={() => {
                      setHuntStatus("all");
                    }}
                  >
                    {getTranslation("all")}
                  </Button>
                  <Button
                    variant={huntStatus === "green" ? "contained" : "outlined"}
                    onClick={() => {
                      setHuntStatus("green");
                    }}
                  >
                    {getTranslation("green")}
                  </Button>
                  <Button
                    variant={huntStatus === "orange" ? "contained" : "outlined"}
                    onClick={() => {
                      setHuntStatus("orange");
                    }}
                  >
                    {getTranslation("orange")}
                  </Button>
                  <Button
                    variant={huntStatus === "red" ? "contained" : "outlined"}
                    onClick={() => {
                      setHuntStatus("red");
                    }}
                  >
                    {getTranslation("red")}
                  </Button>
                </ButtonGroup>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <FormControl component="fieldset" sx={{ width: "90%" }}>
                <FormLabel component="legend">
                  {getTranslation("hideWeakLegions")}:
                </FormLabel>
              </FormControl>
              <Checkbox
                checked={hideWeak}
                onChange={() => {
                  setHideWeak(!hideWeak);
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={4}
            sx={{
              mb: 4,
            }}
          >
            {legions
              .filter(
                (item: any) =>
                  apValue[0] <= parseInt(item.attackPower) &&
                  (apValue[1] === 100000
                    ? true
                    : apValue[1] >= parseInt(item.attackPower))
              )
              .filter((item: any) =>
                hideWeak === true ? item.attackPower >= 2000 : true
              )
              .filter(
                (item: any) =>
                  huntStatus === item.huntStatus || huntStatus === "all"
              )
              .map((item: any, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <LegionCard
                    id={item["id"]}
                    image={item.image}
                    name={item["name"]}
                    beasts={item["beasts"]}
                    warriors={item["warriors"]}
                    supplies={item["supplies"]}
                    attackPower={item["attackPower"]}
                    huntStatus={item["huntStatus"]}
                    handleOpenSupply={handleOpenSupply}
                    handleUpdate={handleUpdateLegoin}
                    handleOpenShopping={handleOpenShopping}
                  />
                </Grid>
              ))}
          </Grid>
        </div>
      )}
      {loading === true && (
        <>
          <Grid item xs={12} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4">
              {getTranslation("loadingLegions")}
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
      {supplyLoading === true && (
        <>
          <Grid item xs={12} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4">
              {getTranslation("buyingSupplies")}
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
      {actionLoading === true && (
        <>
          <Grid item xs={12} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4">{getTranslation("pleaseWait")}</Typography>
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
      <Dialog onClose={handleShoppingClose} open={openShopping}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          {getTranslation("listOnMarketplace")}
          <span className="close-button" onClick={handleShoppingClose}>
            x
          </span>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="price"
            type="number"
            label={`${getTranslation("priceIn")} $BLST`}
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
          {/* <Button
            variant="outlined"
            color="primary"
            onClick={handleSupplyClose}
          >
            {getTranslation("cancel")}
          </Button> */}
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
    </Box>
  );
};

export default Legions;
