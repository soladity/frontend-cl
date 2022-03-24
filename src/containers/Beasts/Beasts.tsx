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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Popover,
} from "@mui/material";
import HorizontalSplitIcon from "@mui/icons-material/HorizontalSplit";
import { makeStyles } from "@mui/styles";
import { useWeb3React } from "@web3-react/core";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";

import { allConstants, meta_constant } from "../../config/meta.config";
import { setReloadStatus } from "../../actions/contractActions";
import {
  getBeastBloodstoneAllowance,
  setBeastBloodstoneApprove,
  mintBeast,
  getBeastBalance,
  getBeastTokenIds,
  getBeastToken,
  getBaseUrl,
  setMarketplaceApprove,
  sellToken,
  execute,
  getSummoningPrice,
  getFee,
  getUSDAmountFromBLST
} from "../../hooks/contractFunction";
import {
  useBloodstone,
  useBeast,
  useMarketplace,
  useLegion,
  useFeeHandler,
  useWeb3,
} from "../../hooks/useContract";
import BeastCard from "../../component/Cards/BeastCard";
import CommonBtn from "../../component/Buttons/CommonBtn";
import { getTranslation } from "../../utils/translation";
import Image from "../../config/image.json";
import ApiService from "../../services/api.service";
import Navigation from '../../component/Navigation/Navigation';
import { FaTimes } from "react-icons/fa";
import { formatNumber } from "../../utils/common";

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

type BeastProps = {
  id: string;
  type: string;
  capacity: string;
  strength: string;
  gif: string;
  jpg: string;
};

const Beasts = () => {
  const { account } = useWeb3React();

  const [baseUrl, setBaseUrl] = React.useState("");
  const [showMint, setShowMint] = React.useState(false);
  const [balance, setBalance] = React.useState(0);
  const [maxWarrior, setMaxWarrior] = React.useState(0);
  const [beasts, setBeasts] = React.useState<BeastProps[]>(Array);
  const [openSupply, setOpenSupply] = React.useState(false);
  const [selectedBeast, setSelectedBeast] = React.useState(0);
  const [price, setPrice] = React.useState(0);
  const [filter, setFilter] = React.useState("all");
  const [marketplaceTax, setMarketplaceTax] = React.useState("0");
  const [showAnimation, setShowAnimation] = React.useState<string | null>("0");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [mintLoading, setMintLoading] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [BlstToUsd, setBlstToUsd] = React.useState(0)

  const maxSellPrice = allConstants.maxSellPrice;

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

  const classes = useStyles();
  const beastContract = useBeast();
  const legionContract = useLegion();
  const marketplaceContract = useMarketplace();
  const feeHandlerContract = useFeeHandler();
  const bloodstoneContract = useBloodstone();
  const web3 = useWeb3();
  const dispatch = useDispatch();

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
      BLST_amount_1 = (await getSummoningPrice(
        feeHandlerContract,
        1
      ) / Math.pow(10, 18)).toFixed(2);
      BLST_amount_10 = (await getSummoningPrice(
        feeHandlerContract,
        10
      ) / Math.pow(10, 18)).toFixed(2);
      BLST_amount_50 = (await getSummoningPrice(
        feeHandlerContract,
        50
      ) / Math.pow(10, 18)).toFixed(2);
      BLST_amount_100 = (await getSummoningPrice(
        feeHandlerContract,
        100
      ) / Math.pow(10, 18)).toFixed(2);
      BLST_amount_150 = (await getSummoningPrice(
        feeHandlerContract,
        150
      ) / Math.pow(10, 18)).toFixed(2);

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
    } catch (error) {
      console.log(error);
    }

    return BLST_amount_1;
  };

  React.useEffect(() => {
    if (account) {
      getBalance();
      getBlstAmountToMintBeast();
    }
    setShowAnimation(
      localStorage.getItem("showAnimation")
        ? localStorage.getItem("showAnimation")
        : "0"
    );
  }, []);

  const handleOpenMint = () => {
    setShowMint(true);
  };

  const handleCloseMint = () => {
    setShowMint(false);
  };

  const handleMint = async (amount: Number) => {
		handlePopoverCloseSummonBeast();
		setMintLoading(true);
		setLoading(false);
		const allowance = await getBeastBloodstoneAllowance(web3, bloodstoneContract, account);
		try {
			if (allowance === '0') {
				await setBeastBloodstoneApprove(web3, bloodstoneContract, account);
			}
			await mintBeast(web3, beastContract, account, amount);
			dispatch(setReloadStatus({
				reloadContractStatus: new Date()
			}));
			ApiService.updateBeast(account).then(
				response => {
					if (response.data.status === 'success') {
						setMintLoading(false);
						getBalance();
					}
				},
				error => {
					console.log('Error!');
					setMintLoading(false);
				}
			);
		} catch (e) {
			console.log(e);
		}
	}

  const getBalance = async () => {
		setLoading(true);
		setMarketplaceTax(((await getFee(feeHandlerContract, 0)) / 100).toFixed(0));
		setBaseUrl(await getBaseUrl());
		ApiService.getBeasts(account).then(
			response => {
				if (response.data.status === 'success') {
					let amount = 0;
					let tempBeasts = [];
					let gif = '';
					let jpg = '';
					for (let i = 0; i < response.data.data.length; i++) {
						for (let j = 0; j < Image.beasts.length; j++) {
							if (Image.beasts[j].name === response.data.data[i].type) {
								gif = Image.beasts[j].gif;
								jpg = Image.beasts[j].jpg;
							}
						}
						tempBeasts.push({ id: response.data.data[i].mintId, type: response.data.data[i].type, strength: response.data.data[i].strength, capacity: response.data.data[i].capacity, gif: gif, jpg: jpg });
						amount += parseInt(response.data.data[i].capacity);
					}
					setMaxWarrior(amount);
					setBeasts(tempBeasts);
					setBalance(tempBeasts.length);
				}
				setLoading(false);
			},
			error => {
				console.log('Error!');
				setLoading(false);
			}
		);
	}

  const handleSupplyClose = () => {
    setOpenSupply(false);
  };

  const handleOpenSupply = (id: number) => {
    setSelectedBeast(id);
    setOpenSupply(true);
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

  const handleSendToMarketplace = async () => {
    setActionLoading(true);
    setOpenSupply(false);
    try {
      await setMarketplaceApprove(web3, beastContract, account, selectedBeast);
      await sellToken(
        web3,
        marketplaceContract,
        account,
        "1",
        selectedBeast,
        BigInt(price * Math.pow(10, 18))
      );
      let capacity = 0;
      let temp = beasts;
      for (let i = 0; i < temp.length; i++) {
        if (parseInt(temp[i]["id"]) === selectedBeast)
          capacity = parseInt(temp[i]["capacity"]);
      }
      setMaxWarrior(maxWarrior - capacity);
      setBalance(balance - 1);
      setBeasts(
        beasts.filter((item: any) => parseInt(item.id) !== selectedBeast)
      );
    } catch (e) {
      console.log(e);
    }
    setActionLoading(false);
  };

  const handleExecute = async (id: number) => {
    setActionLoading(true);
    try {
      await execute(web3, legionContract, account, true, id);
      setBeasts(beasts.filter((item: any) => parseInt(item.id) !== id));
      dispatch(
        setReloadStatus({
          reloadContractStatus: new Date(),
        })
      );
    } catch (e) {
      console.log(e);
    }
    setActionLoading(false);
  };

  const handlePage = (value: any) => {
		setCurrentPage(value);
	}

  return (
    <Box>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta_constant.beasts.title}</title>
        <meta name="description" content={meta_constant.beasts.description} />
        {meta_constant.beasts.keywords && (
          <meta
            name="keywords"
            content={meta_constant.beasts.keywords.join(",")}
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
                  {getTranslation("beasts")}
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
                {getTranslation("summonBeast")}
              </Typography>
              <Box
                onMouseOver={handleOpenMint}
                onMouseLeave={handleCloseMint}
                sx={{ pt: 1 }}
              >
                <CommonBtn
                  sx={{ fontWeight: "bold" }}
                  onClick={handlePopoverOpenSummonBeast}
                  aria-describedby={"summon-beast-id"}
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
                <Popover
                  id={"summon-beast-id"}
                  open={openSummonBeast}
                  anchorEl={anchorElSummonBeast}
                  onClose={handlePopoverCloseSummonBeast}
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
                      onClick={() => handleMint(1)}
                      sx={{
                        fontSize: 14,
                        fontWeight: "bold",
                        marginBottom: 1,
                      }}
                    >
                      1 ({beastBlstAmountPer.b1?.amount} $BLST)
                    </CommonBtn>
                    <CommonBtn
                      onClick={() => handleMint(10)}
                      sx={{
                        fontSize: 14,
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
                      onClick={() => handleMint(50)}
                      sx={{
                        fontSize: 14,
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
                      onClick={() => handleMint(100)}
                      sx={{
                        fontSize: 14,
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
                      onClick={() => handleMint(150)}
                      sx={{
                        fontSize: 14,
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
                {getTranslation("currentBeasts")}
              </Typography>
              <Typography
                variant="h4"
                color="secondary"
                sx={{ fontWeight: "bold" }}
              >
                {balance}
              </Typography>
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
                {getTranslation("warriorCapacity")}
              </Typography>
              <Typography
                variant="h4"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {maxWarrior}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
      {loading === false && mintLoading === false && actionLoading === false && (
        <React.Fragment>
          <Grid container spacing={2} sx={{ my: 3 }}>
            <Grid item md={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend" style={{ marginBottom: 12 }}>
                  {getTranslation("filterCapacity")}:
                </FormLabel>
                <ButtonGroup
                  variant="outlined"
                  color="primary"
                  aria-label="outlined button group"
                >
                  <Button
                    variant={`${filter === "all" ? "contained" : "outlined"}`}
                    onClick={() => setFilter("all")}
                  >
                    {getTranslation("all")}
                  </Button>
                  <Button
                    variant={`${filter === "1" ? "contained" : "outlined"}`}
                    onClick={() => setFilter("1")}
                  >
                    1
                  </Button>
                  <Button
                    variant={`${filter === "2" ? "contained" : "outlined"}`}
                    onClick={() => setFilter("2")}
                  >
                    2
                  </Button>
                  <Button
                    variant={`${filter === "3" ? "contained" : "outlined"}`}
                    onClick={() => setFilter("3")}
                  >
                    3
                  </Button>
                  <Button
                    variant={`${filter === "4" ? "contained" : "outlined"}`}
                    onClick={() => setFilter("4")}
                  >
                    4
                  </Button>
                  <Button
                    variant={`${filter === "5" ? "contained" : "outlined"}`}
                    onClick={() => setFilter("5")}
                  >
                    5
                  </Button>
                  <Button
                    variant={`${filter === "20" ? "contained" : "outlined"}`}
                    onClick={() => setFilter("20")}
                  >
                    20
                  </Button>
                </ButtonGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {beasts
              .filter((item: any) =>
                filter === "all"
                  ? parseInt(item.capacity) >= 0
                  : item.capacity === filter
              )
              .map((item: any, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <BeastCard
                    image={
                      showAnimation === "0"
                        ? "/assets/images/characters/jpg/beasts/" +
                        item["type"] +
                        ".jpg"
                        : "/assets/images/characters/gif/beasts/" +
                        item["type"] +
                        ".gif"
                    }
                    type={item["type"]}
                    capacity={item["capacity"]}
                    strength={item["strength"]}
                    id={item["id"]}
                    isMobile={false}
                    needButton={true}
                    handleOpenSupply={handleOpenSupply}
                    handleExecute={handleExecute}
                  />
                </Grid>
              ))}
            {beasts.length > 0 &&
              beasts.filter((item: any) =>
                filter === "all"
                  ? parseInt(item.capacity) >= 0
                  : item.capacity === filter
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
                          {getTranslation("noBeastFilter")}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              )}
          </Grid>
          {
            beasts.length > 0 &&
            <Navigation totalCount={beasts.length} cPage={currentPage} handlePage={handlePage} perPage={20} />
          }
        </React.Fragment>
      )}
      {loading === true && (
        <>
          <Grid item xs={12} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4">
              {getTranslation("loadingBeasts")}
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
      {mintLoading === true && (
        <>
          <Grid item xs={12} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4">
              {getTranslation("summoningBeasts")}
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
            onKeyDown={(evt) => { (evt.key === 'e' || evt.key === 'E') && evt.preventDefault() }}
            color={price < maxSellPrice ? "primary" : "error"}
            inputProps={{ step: "0.1" }}
            sx={{
              input: {
                color: price < maxSellPrice ? "white" : "#f44336",
              },
            }}
          />
          <Typography variant="subtitle1">(= {(BlstToUsd / Math.pow(10, 6)).toFixed(2)} USD)</Typography>
          <Typography variant="subtitle1">
            If sold, you will pay {marketplaceTax}% marketplace tax.
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
    </Box>
  );
};

export default Beasts;