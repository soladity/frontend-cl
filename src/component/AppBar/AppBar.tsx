import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";
import BadgeIcon from "@mui/icons-material/Badge";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Spinner } from "../Buttons/Spinner";

import {
  getBloodstoneBalance,
  getUnclaimedBLST,
  claimReward,
  getTaxLeftDays,
  getUSDAmountFromBLST,
} from "../../hooks/contractFunction";
import {
  useBloodstone,
  useWeb3,
  useRewardPool,
  useLegion,
  useFeeHandler,
} from "../../hooks/useContract";
import { navConfig } from "../../config";
import { getTranslation } from "../../utils/translation";
import { formatNumber } from "../../utils/common";
import NavList from "../Nav/NavList";
import { useSelector, useDispatch } from "react-redux";
import CommonBtn from "../../component/Buttons/CommonBtn";
import { setReloadStatus, updateStore } from "../../actions/contractActions";

import { MdClose } from "react-icons/md";
import Tutorial from "../Tutorial/Tutorial";
import { useTheme, useMediaQuery } from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AppBarComponent = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const isSmallerThanMD = useMediaQuery(theme.breakpoints.down("md"));
  const { account } = useWeb3React();

  const { reloadContractStatus, isSideBarOpen, claimInfo } = useSelector(
    (state: any) => state.contractReducer
  );

  const [balance, setBalance] = React.useState("0");
  const [showMenu, setShowMenu] = React.useState<boolean>(true);
  const [unClaimedBLST, setUnclaimedBLST] = React.useState(0);
  const [taxLeftDays, setTaxLeftDays] = React.useState("0");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [BUSDReward, setBUSDReward] = React.useState(0);
  const [BLSTReward, setBLSTReward] = React.useState(0);
  const [BUSDTax, setBUSDTax] = React.useState(0);
  const [BLSTTax, setBLSTTax] = React.useState(0);

  const bloodstoneContract = useBloodstone();
  const rewardPoolContract = useRewardPool();
  const legionContract = useLegion();
  const feehandlerContract = useFeeHandler();

  const web3 = useWeb3();

  React.useEffect(() => {
    if (account) {
      getBalance();
    }
  }, [reloadContractStatus]);

  React.useEffect(() => {
    if (account) {
      realTimeUpdate();
    }
  }, []);

  const realTimeUpdate = () => {
    setTimeout(() => {
      getBalance();
      realTimeUpdate();
    }, 5000);
  };

  const getBalance = async () => {
    try {
      setBalance(await getBloodstoneBalance(web3, bloodstoneContract, account));
      const unClaimedBLST = await getUnclaimedBLST(
        web3,
        rewardPoolContract,
        account
      );
      setUnclaimedBLST(parseFloat(unClaimedBLST) / Math.pow(10, 18));
      const taxLeftDays = await getTaxLeftDays(web3, legionContract, account);
      setTaxLeftDays(taxLeftDays);

      const BLSTTax =
        (2 * parseInt(taxLeftDays) * unClaimedBLST) / 100 / Math.pow(10, 18);

      setBLSTTax(BLSTTax);

      const BUSDTax = await getUSDAmountFromBLST(
        feehandlerContract,
        BigInt(BLSTTax * Math.pow(10, 18))
      );

      setBUSDTax(BUSDTax / Math.pow(10, 18));

      const BLSTReward =
        ((100 - 2 * parseInt(taxLeftDays)) * unClaimedBLST) /
        100 /
        Math.pow(10, 18);

      setBLSTReward(BLSTReward);

      const BUSDReward = await getUSDAmountFromBLST(
        feehandlerContract,
        BigInt(BLSTReward * Math.pow(10, 18))
      );

      setBUSDReward(BUSDReward / Math.pow(10, 18));
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDrawer = (open: boolean) => (event: any) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    dispatch(updateStore({ isSideBarOpen: open }));
  };

  const handleDialogClose = (reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    setDialogOpen(false);
  };

  const handleShareDialogClose = (reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    setShareDialogOpen(false);
  };

  const handleClaimReward = async () => {
    setLoading(true);

    dispatch(
      updateStore({
        claimInfo: {
          BUSDReward: BUSDReward,
          BLSTReward: BLSTReward,
        },
      })
    );
    try {
      await claimReward(web3, legionContract, account);
      setShareDialogOpen(true);
      dispatch(
        setReloadStatus({
          reloadContractStatus: new Date(),
        })
      );
    } catch (error) {}
    setLoading(false);
    setDialogOpen(false);
  };

  const getShareLink = (social: string) => {
    const serverLink = "https://play.cryptolegions.app";
    const shareImgUrl = `${serverLink}/winning.jpg`;
    const text = `I just earned and got in my wallet ${claimInfo.BLSTReward} $BLST (= ${claimInfo.BUSDReward} USD). Thank you Crypto Legions! You can join the #CryptoLegions play to earn game here: https://cryptolegions.app`;
    const mainLink = `url=${encodeURI(shareImgUrl)}&text=${encodeURI(text)}`;
    const telegramShareLink = `https://xn--r1a.link/share/url?${mainLink}`;
    const twitterShareLink = `https://twitter.com/intent/tweet?${mainLink}`;
    return social == "telegram"
      ? telegramShareLink.replace("#", "%23")
      : twitterShareLink.replace("#", "%23");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background:
          "linear-gradient(0deg, hsl(0deg 0% 12%) 0%, hsl(0deg 0% 7%) 100%)",
        maxWidth: `100%`,
        ml: { sm: `${navConfig.drawerWidth}px` },
        py: 1,
      }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters sx={{ flexFlow: "wrap" }}>
          {isSmallerThanMD && (
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleDrawer(true)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <SwipeableDrawer
                anchor="left"
                open={isSideBarOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
              >
                <Box
                  sx={{ width: 250 }}
                  role="presentation"
                  onKeyDown={toggleDrawer(false)}
                >
                  <NavList />
                </Box>
              </SwipeableDrawer>
            </Box>
          )}
          <Box sx={{ marginLeft: { md: 0, xs: "auto" } }}></Box>
          <NavLink
            to="/"
            className="non-style"
            style={{
              color: "inherit",
              textDecoration: "none",
              minWidth: "250px",
            }}
          >
            <img
              src="/assets/images/logo_dashboard.png"
              style={{ height: "55px" }}
              alt="logo"
            />
          </NavLink>

          <Box sx={{ flexGrow: 0, marginLeft: { xs: "auto" } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "inherit" },
              }}
            >
              <Tutorial curStep={19} placement="bottom">
                <CommonBtn
                  sx={{
                    fontWeight: "bold",
                    mr: { xs: 0, md: 5 },
                    fontSize: { xs: "0.7rem", md: "1rem" },
                  }}
                  onClick={() => setDialogOpen(true)}
                >
                  <img
                    src={`/assets/images/claimExit.png`}
                    style={{
                      width: "15px",
                      height: "15px",
                      marginRight: "10px",
                    }}
                    alt="icon"
                  />
                  {getTranslation("claim")}{" "}
                  {formatNumber(unClaimedBLST.toFixed(2))} $
                  {getTranslation("bloodstone")}
                </CommonBtn>
              </Tutorial>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: { xs: 2, md: 0 },
                }}
              >
                <img
                  src="/assets/images/bloodstone.png"
                  style={{ height: "55px" }}
                  alt="bloodstone"
                />
                <Box sx={{ ml: { xs: 1, md: 2 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: {
                          xs: "0.8rem",
                          md: "1rem",
                        },
                      }}
                    >
                      {formatNumber(parseFloat(balance).toFixed(2))}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: {
                          xs: "0.8rem",
                          md: "1rem",
                        },
                      }}
                    >
                      $BLST
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      background: "#622f11",
                    }}
                  >
                    <IconButton
                      aria-label="claim"
                      component="span"
                      sx={{ p: 0, mr: 1 }}
                    >
                      <BadgeIcon />
                    </IconButton>
                    <NavLink
                      to="/"
                      className="non-style"
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontSize: {
                            xs: "0.7rem",
                            md: "1rem",
                          },
                        }}
                      >
                        {account === undefined || account === null
                          ? "..."
                          : account.substr(0, 6) +
                            "..." +
                            account.substr(account.length - 4, 4)}
                      </Typography>
                    </NavLink>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </Container>
      <Dialog
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        disableEscapeKeyDown
        onClose={(_, reason) => handleDialogClose(reason)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {taxLeftDays !== "0"
            ? `${getTranslation("willPay")} ${
                parseInt(taxLeftDays) * 2
              }% ${getTranslation("tax")}.`
            : `${getTranslation("claim")} ${unClaimedBLST.toFixed(2)} $BLST`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {unClaimedBLST === 0 ? (
              <>
                {getTranslation("noToClaim")}
                <br />
                {getTranslation("huntMonsters")}
              </>
            ) : taxLeftDays === "0" ? (
              <>
                {getTranslation("aboutToClaim")} {unClaimedBLST.toFixed(2)}{" "}
                $BLST (= {(BUSDReward + BUSDTax).toFixed(2)} USD){" "}
                {getTranslation("taxFree")}.
                <br />
                {getTranslation("willReceive")} {unClaimedBLST.toFixed(2)} $BLST
                (= {(BUSDReward + BUSDTax).toFixed(2)} USD){" "}
                {getTranslation("inYourWallet")}.
                <br />
                {getTranslation("goAhead")}
                <br />
                {loading && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 4,
                    }}
                  >
                    <Spinner color="white" size={40} />
                  </div>
                )}
              </>
            ) : (
              <>
                {getTranslation("aboutToClaim")} {unClaimedBLST.toFixed(2)}{" "}
                $BLST (= {(BUSDTax + BUSDReward).toFixed(2)} USD){" "}
                {getTranslation("with")} {2 * parseInt(taxLeftDays)}%{" "}
                {getTranslation("tax")}.
                <br />
                {getTranslation("willPay")} {BLSTTax.toFixed(2)} $BLST (={" "}
                {BUSDTax.toFixed(2)} USD), {getTranslation("receiveOnly")}{" "}
                {BLSTReward.toFixed(2)} $BLST (= {BUSDReward.toFixed(2)} USD){" "}
                {getTranslation("inYourWallet")}.
                <br />
                {getTranslation("youWait")} {taxLeftDays}{" "}
                {getTranslation("willToClaim")}
                <br />
                {getTranslation("sureGoAhead")}
                <br />
                {loading && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 4,
                    }}
                  >
                    <Spinner color="white" size={40} />
                  </div>
                )}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => handleDialogClose("cancel")}
            disabled={loading}
            variant="contained"
            sx={{ color: "white", fontWeight: "bold" }}
          >
            {getTranslation("cancel")}
          </Button>
          <Button
            onClick={handleClaimReward}
            disabled={unClaimedBLST === 0 || loading === true}
            variant="outlined"
            sx={{ fontWeight: "bold" }}
          >
            {taxLeftDays === "0"
              ? getTranslation("claimTaxFree")
              : getTranslation("claimPayTax")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={shareDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        disableEscapeKeyDown
        onClose={(_, reason) => handleShareDialogClose(reason)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <MdClose
            style={{
              position: "absolute",
              right: 8,
              top: 8,
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => handleShareDialogClose("cancel")}
          ></MdClose>
          {getTranslation(
            "gotUnclaimedReward",
            claimInfo.BLSTReward.toFixed(2),
            claimInfo.BUSDReward.toFixed(2)
          )}
          <Box sx={{ fontWeight: "bold", textAlign: "center", mt: 1 }}>
            {getTranslation("shareYourHappiness")}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <a href={getShareLink("telegram")} target={"_blank"}>
              <img
                src={`/assets/images/telegram.png`}
                style={{
                  width: "40px",
                  height: "40px",
                  marginRight: "30px",
                }}
                alt="icon"
              />
            </a>
            <a href={getShareLink("twitter")} target={"_blank"}>
              <img
                src={`/assets/images/twitter.png`}
                style={{
                  width: "40px",
                  height: "40px",
                  marginLeft: "30px",
                }}
                alt="icon"
              />
            </a>
          </Box>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};
export default AppBarComponent;
