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
  getLegionToken,
  getBaseUrl,
  getMarketplaceBloodstoneAllowance,
  setMarketplaceBloodstoneApprove,
  cancelMarketplace,
  buyToken,
  getMarketItem,
  getLegionImage,
  getHuntStatus,
  updatePrice,
  getUSDAmountFromBLST,
  getAllLegionMarketItems
} from "../../hooks/contractFunction";
import {
  useLegion,
  useMarketplace,
  useBloodstone,
  useWeb3,
  useFeeHandler,
  useMarketplaceEvent
} from "../../hooks/useContract";
import LegionMarketCard from "../../component/Cards/LegionMarketCard";
import CommonBtn from "../../component/Buttons/CommonBtn";
import { getTranslation } from "../../utils/translation";
import { formatNumber } from "../../utils/common";
import Image from "../../config/image.json";

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
  lastHuntTime: string;
  owner: boolean;
  price: string;
  huntStatus: String;
  image: string;
  // animationImage: string;
};

const Legions = () => {
  const { account } = useWeb3React();

  const [sort, setSort] = React.useState("0");
  const [legions, setLegions] = React.useState<LegionProps[]>(Array);
  const [onlyMyLegion, setOnlyMyLegion] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [price, setPrice] = React.useState(0);
  const [selectedLegion, setSelectedLegion] = React.useState(0);
  const [showAnimation, setShowAnimation] = React.useState<string | null>("0");
  const [loading, setLoading] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [apValue, setApValue] = React.useState<number[]>([2000, 100000]);
  const [huntsValue, setHuntsValue] = React.useState<number[]>([0, 14]);
  const [BlstToUsd, setBlstToUsd] = React.useState(0)

  const maxSellPrice = allConstants.maxSellPrice;

  const classes = useStyles();
  const legionContract = useLegion();
  const marketplaceContract = useMarketplace();
  const marketplaceEventContract = useMarketplaceEvent();
  const bloodstoneContract = useBloodstone();
  const feeHandlerContract = useFeeHandler()
  const web3 = useWeb3();
  const dispatch = useDispatch();

  React.useEffect(() => {

    const buyEvent = marketplaceEventContract.events.BuyToken({
    }).on('connected', function (subscriptionId: any) {
    }).on('data', async function (event: any) {
      if (legions.filter(item => item.id == event.returnValues._tokenId).length > 0) {
        setLegions(legions.filter(legion => legion.id != event.returnValues._tokenId))
        dispatch(
          setReloadStatus({
            reloadContractStatus: new Date(),
          })
        );
      }
    })

    const cancelEvent = marketplaceEventContract.events.CancelSelling({
    }).on('connected', function (subscriptionId: any) {
    }).on('data', async function (event: any) {
      if (legions.filter(item => item.id == event.returnValues._tokenId).length > 0) {
        setLegions(legions.filter(legion => legion.id != event.returnValues._tokenId))
        dispatch(
          setReloadStatus({
            reloadContractStatus: new Date(),
          })
        );
      }
    })

    const sellEvent = marketplaceEventContract.events.SellToken({
    }).on('connected', function (subscriptionId: any) {
    }).on('data', async function (event: any) {
      if (legions.filter(item => item.id == event.returnValues._tokenId).length == 0) {
        const legion = await getLegionToken(web3, legionContract, event.returnValues._tokenId);
        const marketItem = await getMarketItem(web3, marketplaceEventContract, "3", event.returnValues._tokenId);
        const image = getLegionImageUrl(legion.attackPower);
        const huntStatus = await getHuntStatus(web3, legionContract, event.returnValues._tokenId);
        const newItem = {
          ...legion,
          id: event.returnValues._tokenId,
          image: image,
          owner: marketItem.owner === account ? true : false,
          price: marketItem.price,
          huntStatus: huntStatus,
        }
        setLegions([...legions, newItem])
        dispatch(
          setReloadStatus({
            reloadContractStatus: new Date(),
          })
        );
      }
    })

    const updateEvent = marketplaceEventContract.events.PriceUpdated({
    }).on('connected', function (subscriptionId: any) {
    }).on('data', async function (event: any) {
      if (legions.filter(item => item.id == event.returnValues._tokenId).length > 0) {
        var temp = legions.map(item => {
          if (item.id == event.returnValues._tokenId) {
            return {
              ...item,
              price: event.returnValues._price
            }
          } else {
            return item
          }
        })
        setLegions(temp)
        dispatch(
          setReloadStatus({
            reloadContractStatus: new Date(),
          })
        );
      }
    })
    return () => {
      buyEvent.unsubscribe((error: any, success: any) => {
        if (success) {
        }
        if (error) {
        }
      })
      cancelEvent.unsubscribe((error: any, success: any) => {
        if (success) {
        }
        if (error) {
        }
      })
      sellEvent.unsubscribe((error: any, success: any) => {
        if (success) {
        }
        if (error) {
        }
      })
      updateEvent.unsubscribe((error: any, success: any) => {
        if (success) {
        }
        if (error) {
        }
      })
    }
  }, [legions])

  React.useEffect(() => {
    setShowAnimation(
      localStorage.getItem("showAnimation")
        ? localStorage.getItem("showAnimation")
        : "0"
    );
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
    setLoading(true);
    console.log(await getAllLegionMarketItems(marketplaceContract))

    const allLegions = await getAllLegionMarketItems(marketplaceContract)
    let amount = 0;
    const tempAllLegions = allLegions[0].map((legion: any, index: number) => {
      amount += parseInt(legion.attack_power) / 100
      return {
        name: legion.name,
        beasts: legion.beast_ids,
        warriors: legion.warrior_ids,
        attackPower: parseInt((parseInt(legion.attack_power) / 100).toFixed(0)),
        image: getLegionImageUrl(parseInt(legion.attack_power) / 100),
        supplies: legion.supplies,
        realPower: parseFloat(legion.attack_power),
        id: allLegions[1][index],
        huntStatus: allLegions[2][index] ? 'green' : legion.supplies == "0" ? "red" : "orange",
        owner: allLegions[4][index] === account ? true : false,
        price: allLegions[3][index]
      }
    })
    console.log(tempAllLegions)

    // const ids = await getOnMarketplace(web3, legionContract);
    // let legion;
    // let marketItem;
    // let image;
    // let huntStatus;
    // var tempLegions = [];
    // for (let i = 0; i < ids.length; i++) {
    //   legion = await getLegionToken(web3, legionContract, ids[i]);
    //   marketItem = await getMarketItem(web3, marketplaceContract, "3", ids[i]);
    //   image = getLegionImageUrl(legion.attackPower);
    //   huntStatus = await getHuntStatus(web3, legionContract, ids[i]);
    //   tempLegions.push({
    //     ...legion,
    //     id: ids[i],
    //     image: image,
    //     owner: marketItem.owner === account ? true : false,
    //     price: marketItem.price,
    //     huntStatus: huntStatus,
    //   });
    // }
    // console.log(tempLegions)
    setLegions(tempAllLegions);
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

  const handleChangeHunts = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setHuntsValue([Math.min(newValue[0], huntsValue[1] - 1), huntsValue[1]]);
    } else {
      setHuntsValue([huntsValue[0], Math.max(newValue[1], huntsValue[0] + 1)]);
    }
    setCurrentPage(1);
  };

  const handleCancel = async (id: number) => {
    setActionLoading(true);
    try {
      await cancelMarketplace(web3, marketplaceContract, account, "3", id);
      setLegions(legions.filter((item: any) => parseInt(item.id) !== id));
    } catch (e) {
    }
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
      await buyToken(web3, marketplaceContract, account, "3", id, BigInt(price));
      dispatch(
        setReloadStatus({
          reloadContractStatus: new Date(),
        })
      );
      setLegions(legions.filter((item: any) => parseInt(item.id) !== id));
    } catch (e) {
    }
    setActionLoading(false);
  };

  const handleSort = (value: string) => {
    setSort(value);
    handleSortValue(value);
  };

  const handleSortValue = (value: string) => {
    let temp = legions;
    temp.sort((a: any, b: any) => {
      if (value === "1" || value === "2") {
        if (value === "1") {
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
    setLegions(temp);
  };

  const handlePage = (value: any) => {
    setCurrentPage(value);
  };

  const handleUpdate = async (id: number) => {
    setSelectedLegion(id);
    setPrice(
      parseInt(legions.filter((item: any) => parseInt(item.id) === id)[0].price) / Math.pow(10, 18)
    );
    setBlstToUsd(await getUSDAmountFromBLST(feeHandlerContract, BigInt(parseInt(legions.filter((item: any) => parseInt(item.id) === id)[0].price))))
    setOpenUpdate(true);
  };

  const handleUpdateClose = () => {
    setOpenUpdate(false);
  };

  const handlePrice = async (e: any) => {
    var price = e.target.value
    if (price >= 1) {
      if (price[0] == '0') {
        price = price.slice(1)
      }
      setPrice(price);
      setBlstToUsd(await getUSDAmountFromBLST(feeHandlerContract, BigInt(parseFloat(price) * Math.pow(10, 18))))
    } else if (price >= 0) {
      setPrice(price);
      if (price == '') {
        price = '0'
      }
      setBlstToUsd(await getUSDAmountFromBLST(feeHandlerContract, BigInt(parseFloat(price) * Math.pow(10, 18))))
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
        "3",
        selectedLegion,
        BigInt(price * Math.pow(10, 18))
      );
      let temp = [];
      for (let i = 0; i < legions.length; i++) {
        if (parseInt(legions[i].id) === selectedLegion)
          temp.push({ ...legions[i], price: (price * Math.pow(10, 18)).toString() });
        else temp.push({ ...legions[i] });
      }
      setLegions([...temp]);
    } catch (e) {
    }
    setActionLoading(false);
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
                  {getTranslation("legions")} {getTranslation("marketplace")}
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
              <FormControl component="fieldset" sx={{ width: "90%" }}>
                <FormLabel component="legend">
                  {getTranslation("filterByAp")}
                </FormLabel>
                <Slider
                  getAriaLabel={() => "Custom marks"}
                  // defaultValue={20}
                  value={apValue}
                  min={2000}
                  max={100000}
                  marks={[
                    { value: 2000, label: "2K" },
                    { value: 100000, label: "100K+" },
                  ]}
                  step={1}
                  valueLabelDisplay="auto"
                  onChange={handleChangeAp}
                  disableSwap
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={6} xl={4}>
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
            <Grid item xs={12} md={6} lg={6} xl={3}>
              <FormControl component="fieldset" sx={{ width: "90%" }}>
                <FormLabel component="legend">
                  {getTranslation("filterByHunts")}
                </FormLabel>
                <Slider
                  getAriaLabel={() => "Custom marks"}
                  // defaultValue={20}
                  value={huntsValue}
                  min={0}
                  max={14}
                  marks={[
                    { value: 0, label: "0" },
                    { value: 14, label: formatNumber("14+") },
                  ]}
                  step={1}
                  valueLabelDisplay="auto"
                  onChange={handleChangeHunts}
                  disableSwap
                />
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
                  {getTranslation("showMyLegion")}:
                </FormLabel>
              </FormControl>
              <Checkbox
                checked={onlyMyLegion}
                onChange={() => {
                  setOnlyMyLegion(!onlyMyLegion);
                  setCurrentPage(1);
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {legions.length > 0 &&
              legions
                .filter(
                  (item: any) =>
                    apValue[0] <= parseInt(item.attackPower) &&
                    (apValue[1] === 100000
                      ? true
                      : apValue[1] >= parseInt(item.attackPower))
                )
                .filter(
                  (item: any) =>
                    huntsValue[0] <= parseInt(item.supplies) &&
                    (huntsValue[1] === 14
                      ? true
                      : huntsValue[1] >= parseInt(item.supplies))
                )
                .filter((item: any) =>
                  onlyMyLegion === true ? item.owner === true : true
                )
                .slice((currentPage - 1) * 20, (currentPage - 1) * 20 + 20)
                .map((item: any, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <LegionMarketCard
                      image={item["image"]}
                      name={item["name"]}
                      beasts={item["beasts"]}
                      warriors={item["warriors"]}
                      id={item["id"]}
                      supplies={item["supplies"]}
                      attackPower={item["attackPower"]}
                      huntStatus={item["huntStatus"]}
                      owner={item["owner"]}
                      price={item["price"]}
                      handleCancel={handleCancel}
                      handleBuy={handleBuy}
                      handleUpdate={handleUpdate}
                    />
                  </Grid>
                ))}
          </Grid>
          {legions.length > 0 && (
            <Navigation
              totalCount={legions.filter(
                (item: any) =>
                  apValue[0] <= parseInt(item.attackPower) &&
                  (apValue[1] === 100000
                    ? true
                    : apValue[1] >= parseInt(item.attackPower))
              )
              .filter(
                (item: any) =>
                  huntsValue[0] <= parseInt(item.supplies) &&
                  (huntsValue[1] === 14
                    ? true
                    : huntsValue[1] >= parseInt(item.supplies))
              )
              .filter((item: any) =>
                onlyMyLegion === true ? item.owner === true : true
              ).length}
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
            onKeyDown={(evt) => { (evt.key === 'e' || evt.key === 'E' || evt.key === '+' || evt.key === '-') && evt.preventDefault() }}
          />
          <Typography variant="subtitle1">(= {(BlstToUsd / Math.pow(10, 18)).toFixed(2)} USD)</Typography>
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

export default Legions;