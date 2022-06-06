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
  Checkbox,
  FormLabel,
  FormControl,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { allConstants, meta_constant } from "../../config/meta.config";
import { setReloadStatus } from "../../actions/contractActions";
import Navigation from "../../component/Navigation/Navigation";
import {
  getOnMarketplace,
  getWarriorToken,
  getBaseUrl,
  getMarketplaceBloodstoneAllowance,
  setMarketplaceBloodstoneApprove,
  cancelMarketplace,
  buyToken,
  getMarketItem,
  updatePrice,
  getUSDAmountFromBLST,
  getAllWarriorMarketItems,
} from "../../hooks/contractFunction";
import {
  useWarrior,
  useMarketplace,
  useBloodstone,
  useWeb3,
  useFeeHandler,
  useMarketplaceEvent,
} from "../../hooks/useContract";
import WarriorMarketCard from "../../component/Cards/WarriorMarketCard";
import CommonBtn from "../../component/Buttons/CommonBtn";
import { getTranslation } from "../../utils/translation";
import {
  formatNumber,
  getWarriorGif,
  getWarriorStrength,
} from "../../utils/common";
import Image from "../../config/image.json";
import warriorInfo from "../../constant/warriors";

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
  power: number;
  strength: number;
  owner: boolean;
  price: string;
  badge: boolean;
};

const Warriors = () => {
  const { account } = useWeb3React();

  const [sort, setSort] = React.useState("0");
  const [warriors, setWarriors] = React.useState<WarriorProps[]>(Array);
  const [filter, setFilter] = React.useState("all");
  const [onlyMyWarrior, setOnlyMyWarrior] = React.useState(false);
  const [onlyNew, setOnlyNew] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [price, setPrice] = React.useState(0);
  const [selectedWarrior, setSelectedWarrior] = React.useState(0);
  const [showAnimation, setShowAnimation] = React.useState<string | null>("0");
  const [loading, setLoading] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [apValue, setApValue] = React.useState<number[]>([500, 6000]);
  const [BlstToUsd, setBlstToUsd] = React.useState(0);

  const maxSellPrice = allConstants.maxSellPrice;

  const classes = useStyles();
  const warriorContract = useWarrior();
  const marketplaceContract = useMarketplace();
  const marketplaceEventContract = useMarketplaceEvent();
  const bloodstoneContract = useBloodstone();
  const feeHandlerContract = useFeeHandler();
  const web3 = useWeb3();
  const dispatch = useDispatch();

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
    const buyEvent = marketplaceEventContract.events
      .BuyToken({})
      .on("connected", function (subscriptionId: any) {})
      .on("data", async function (event: any) {
        if (
          warriors.filter((item) => item.id == event.returnValues.tokenId)
            .length > 0
        ) {
          setWarriors(
            warriors.filter(
              (warrior) => warrior.id != event.returnValues.tokenId
            )
          );
          dispatch(
            setReloadStatus({
              reloadContractStatus: new Date(),
            })
          );
        }
      });

    const cancelEvent = marketplaceEventContract.events
      .CancelSelling({})
      .on("connected", function (subscriptionId: any) {})
      .on("data", async function (event: any) {
        if (
          warriors.filter((item) => item.id == event.returnValues.tokenId)
            .length > 0
        ) {
          setWarriors(
            warriors.filter(
              (warrior) => warrior.id != event.returnValues.tokenId
            )
          );
          dispatch(
            setReloadStatus({
              reloadContractStatus: new Date(),
            })
          );
        }
      });

    const sellEvent = marketplaceEventContract.events
      .SellToken({})
      .on("connected", function (subscriptionId: any) {})
      .on("data", async function (event: any) {
        if (
          warriors.filter((item) => item.id == event.returnValues.tokenId)
            .length == 0
        ) {
          const warrior = await getWarriorToken(
            web3,
            warriorContract,
            event.returnValues.tokenId
          );
          const marketItem = await getMarketItem(
            web3,
            marketplaceEventContract,
            "2",
            event.returnValues.tokenId
          );
          const newItem = {
            ...warrior,
            id: event.returnValues.tokenId,
            owner: marketItem.owner === account ? true : false,
            price: marketItem.price,
            badge: true,
          };
          setWarriors([...warriors, newItem]);
          dispatch(
            setReloadStatus({
              reloadContractStatus: new Date(),
            })
          );
        }
      });

    const updateEvent = marketplaceEventContract.events
      .PriceUpdated({})
      .on("connected", function (subscriptionId: any) {})
      .on("data", async function (event: any) {
        if (
          warriors.filter((item) => item.id == event.returnValues.tokenId)
            .length > 0
        ) {
          var temp = warriors.map((item) => {
            if (item.id == event.returnValues.tokenId) {
              return {
                ...item,
                price: event.returnValues.price,
              };
            } else {
              return item;
            }
          });
          setWarriors(temp);
          dispatch(
            setReloadStatus({
              reloadContractStatus: new Date(),
            })
          );
        }
      });
    return () => {
      buyEvent.unsubscribe((error: any, success: any) => {
        if (success) {
        }
        if (error) {
        }
      });
      cancelEvent.unsubscribe((error: any, success: any) => {
        if (success) {
        }
        if (error) {
        }
      });
      sellEvent.unsubscribe((error: any, success: any) => {
        if (success) {
        }
        if (error) {
        }
      });
      updateEvent.unsubscribe((error: any, success: any) => {
        if (success) {
        }
        if (error) {
        }
      });
    };
  }, [warriors]);

  const getBalance = async () => {
    setLoading(true);
    let allWarriors;
    let tempAllWarriors: any[] = [];

    try {
      allWarriors = await getAllWarriorMarketItems(marketplaceContract);

      let ids = allWarriors[0];
      let aps = allWarriors[1];
      let prices = allWarriors[2];
      let sellers = allWarriors[3];
      let badges = allWarriors[4];

      ids.forEach((id: any, index: number) => {
        tempAllWarriors.push({
          id: id,
          strength: getWarriorStrength(aps[index]),
          power: aps[index],
          price: prices[index],
          owner: sellers[index] === account ? true : false,
          type: warriorInfo[getWarriorStrength(aps[index]) - 1],
          badge: badges[index],
          gif: getWarriorGif(
            warriorInfo[getWarriorStrength(aps[index]) - 1],
            parseInt(aps[index])
          ),
        });
      });
    } catch (error) {}

    // const ids = await getOnMarketplace(web3, warriorContract);
    // let warrior;
    // let marketItem;
    // let tempWarriors = [];
    // for (let i = 0; i < ids.length; i++) {
    //   warrior = await getWarriorToken(web3, warriorContract, ids[i]);
    //   marketItem = await getMarketItem(web3, marketplaceContract, "2", ids[i]);
    //   tempWarriors.push({
    //     ...warrior,
    //     id: ids[i],
    //     owner: marketItem.owner === account ? true : false,
    //     price: marketItem.price,
    //   });
    // }
    setWarriors(tempAllWarriors);
    setLoading(false);
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

  const handleCancel = async (id: number) => {
    setActionLoading(true);
    try {
      await cancelMarketplace(web3, marketplaceContract, account, "2", id);
      setWarriors(warriors.filter((item: any) => parseInt(item.id) !== id));
    } catch (e) {}
    setActionLoading(false);
  };

  const handleBuy = async (id: number, price: number) => {
    setActionLoading(true);
    const allowance = await getMarketplaceBloodstoneAllowance(
      web3,
      bloodstoneContract,
      account
    );
    try {
      if (allowance === "0") {
        await setMarketplaceBloodstoneApprove(
          web3,
          bloodstoneContract,
          account
        );
      }
      await buyToken(
        web3,
        marketplaceContract,
        account,
        "2",
        id,
        BigInt(price)
      );
      dispatch(
        setReloadStatus({
          reloadContractStatus: new Date(),
        })
      );
      setWarriors(warriors.filter((item: any) => parseInt(item.id) !== id));
    } catch (e) {}
    setActionLoading(false);
  };

  const handleSort = (value: string) => {
    setSort(value);
    handleSortValue(value);
  };

  const handleSortValue = (value: string) => {
    let temp = warriors;
    temp.sort((a: any, b: any) => {
      if (value === "1" || value === "2") {
        if (value === "1") {
          if (parseInt(a.power) > parseInt(b.power)) {
            return 1;
          }
          if (parseInt(a.power) < parseInt(b.power)) {
            return -1;
          }
        } else {
          if (parseInt(a.power) > parseInt(b.power)) {
            return -1;
          }
          if (parseInt(a.power) < parseInt(b.power)) {
            return 1;
          }
        }
      } else {
        if (value === "3") {
          if (parseInt(a.price) > parseInt(b.price)) {
            return 1;
          }
          if (parseInt(a.price) < parseInt(b.price)) {
            return -1;
          }
        } else {
          if (parseInt(a.price) > parseInt(b.price)) {
            return -1;
          }
          if (parseInt(a.price) < parseInt(b.price)) {
            return 1;
          }
        }
      }
      return 0;
    });
    setWarriors(temp);
  };

  const handlePage = (value: any) => {
    setCurrentPage(value);
  };

  const handleUpdate = async (id: number) => {
    setSelectedWarrior(id);
    setPrice(
      parseInt(
        warriors.filter((item: any) => parseInt(item.id) === id)[0].price
      ) / Math.pow(10, 18)
    );
    setBlstToUsd(
      await getUSDAmountFromBLST(
        feeHandlerContract,
        BigInt(
          parseInt(
            warriors.filter((item: any) => parseInt(item.id) === id)[0].price
          )
        )
      )
    );
    setOpenUpdate(true);
  };

  const handleUpdateClose = () => {
    setOpenUpdate(false);
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

  const handleUpdatePrice = async () => {
    setActionLoading(true);
    try {
      setOpenUpdate(false);
      await updatePrice(
        web3,
        marketplaceContract,
        account,
        "2",
        selectedWarrior,
        BigInt(price * Math.pow(10, 18))
      );
      let temp = [];
      for (let i = 0; i < warriors.length; i++) {
        if (parseInt(warriors[i].id) === selectedWarrior)
          temp.push({
            ...warriors[i],
            price: (price * Math.pow(10, 18)).toString(),
          });
        else temp.push({ ...warriors[i] });
      }
      setWarriors([...temp]);
    } catch (e) {}
    setActionLoading(false);
  };

  const handleFilter = (value: string) => {
    setFilter(value);
    setCurrentPage(1);
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
              sx={{
                p: { xs: 1, md: 4 },
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  mx: { xs: 1, md: 4 },
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                  {getTranslation("warriors")} {getTranslation("marketplace")}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
      {loading === false && actionLoading === false && (
        <div>
          <Grid container spacing={2} sx={{ my: 3 }}>
            <Grid item xs={12} md={6} lg={6} xl={3}>
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
            <Grid item xs={12} md={6} lg={6} xl={3}>
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
                    { value: 6000, label: formatNumber("6K+") },
                  ]}
                  step={1}
                  valueLabelDisplay="auto"
                  onChange={handleChangeAp}
                  disableSwap
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={4}>
              <FormControl component="fieldset" sx={{ width: "90%" }}>
                <FormLabel component="legend">
                  {getTranslation("sortBy")}:
                </FormLabel>
                <ButtonGroup variant="outlined" color="primary" sx={{ pt: 1 }}>
                  <Button
                    variant={sort === "1" ? "contained" : "outlined"}
                    onClick={() => {
                      handleSort("1");
                    }}
                  >
                    {getTranslation("lowest")} AP
                  </Button>
                  <Button
                    variant={sort === "2" ? "contained" : "outlined"}
                    onClick={() => {
                      handleSort("2");
                    }}
                  >
                    {getTranslation("highest")} AP
                  </Button>
                  <Button
                    variant={sort === "3" ? "contained" : "outlined"}
                    onClick={() => {
                      handleSort("3");
                    }}
                  >
                    {getTranslation("lowest")} $
                  </Button>
                  <Button
                    variant={sort === "4" ? "contained" : "outlined"}
                    onClick={() => {
                      handleSort("4");
                    }}
                  >
                    {getTranslation("highest")} $
                  </Button>
                </ButtonGroup>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              xl={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <FormControl component="fieldset" sx={{ width: "90%" }}>
                <FormLabel component="legend">
                  {getTranslation("showNew")}:
                </FormLabel>
              </FormControl>
              <Checkbox
                checked={onlyNew}
                onChange={() => {
                  setOnlyNew(!onlyNew);
                  setCurrentPage(1);
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              xl={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <FormControl component="fieldset" sx={{ width: "90%" }}>
                <FormLabel component="legend">
                  {getTranslation("showMyWarrior")}:
                </FormLabel>
              </FormControl>
              <Checkbox
                checked={onlyMyWarrior}
                onChange={() => {
                  setOnlyMyWarrior(!onlyMyWarrior);
                  setCurrentPage(1);
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {warriors.length > 0 &&
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
                )
                .filter((item: any) =>
                  onlyMyWarrior === true ? item.owner === true : true
                )
                .filter((item: any) =>
                  onlyNew === true ? item.badge === true : true
                )
                .slice((currentPage - 1) * 20, (currentPage - 1) * 20 + 20)
                .map((item: any, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <WarriorMarketCard
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
                      owner={item["owner"]}
                      price={item["price"]}
                      badge={item["badge"]}
                      handleCancel={handleCancel}
                      handleBuy={handleBuy}
                      handleUpdate={handleUpdate}
                    />
                  </Grid>
                ))}
          </Grid>
          {warriors.length > 0 && (
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
                  )
                  .filter((item: any) =>
                    onlyMyWarrior === true ? item.owner === true : true
                  )
                  .filter((item: any) =>
                    onlyNew === true ? item.badge === true : true
                  ).length
              }
              cPage={currentPage}
              handlePage={handlePage}
              perPage={20}
            />
          )}
        </div>
      )}
      {loading === true && (
        <>
          <Grid item xs={12} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4">
              {getTranslation("loadingWarriors")}
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
      <Dialog onClose={handleUpdateClose} open={openUpdate}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          {getTranslation("updatePrice")}
          <span className="close-button" onClick={handleUpdateClose}>
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
            inputProps={{ step: "0.1" }}
            onChange={handlePrice}
            onKeyDown={(evt) => {
              (evt.key === "e" ||
                evt.key === "E" ||
                evt.key === "+" ||
                evt.key === "-") &&
                evt.preventDefault();
            }}
          />
          <Typography variant="subtitle1">
            (= {(BlstToUsd / Math.pow(10, 18)).toFixed(2)} USD)
          </Typography>
        </DialogContent>
        {+price >= 0 && price < maxSellPrice ? (
          <CommonBtn sx={{ fontWeight: "bold" }} onClick={handleUpdatePrice}>
            {getTranslation("confirm")}
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
    </Box>
  );
};

export default Warriors;
