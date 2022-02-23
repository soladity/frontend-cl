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
    getUnclaimedUSD,
    claimReward,
    getTaxLeftDays,
} from "../../hooks/contractFunction";
import {
    useBloodstone,
    useWeb3,
    useRewardPool,
    useLegion,
} from "../../hooks/useContract";
import { navConfig } from "../../config";
import { getTranslation } from "../../utils/translation";
import { formatNumber } from "../../utils/common";
import NavList from "../Nav/NavList";
import { useSelector, useDispatch } from "react-redux";
import CommonBtn from "../../component/Buttons/CommonBtn";
import { setReloadStatus } from "../../actions/contractActions";

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

    const { account } = useWeb3React();

    const { reloadContractStatus } = useSelector(
        (state: any) => state.contractReducer
    );

    const [balance, setBalance] = React.useState("0");
    const [showMenu, setShowMenu] = React.useState<boolean>(false);
    const [unClaimedUSD, setUnclaimedUSD] = React.useState(0);
    const [taxLeftDays, setTaxLeftDays] = React.useState("0");
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const bloodstoneContract = useBloodstone();
    const rewardPoolContract = useRewardPool();
    const legionContract = useLegion();

    const web3 = useWeb3();

    React.useEffect(() => {
        if (account) {
            getBalance();
        }
    }, [reloadContractStatus]);

    const getBalance = async () => {
        setBalance(
            await getBloodstoneBalance(web3, bloodstoneContract, account)
        );
        const unClaimedUSD = await getUnclaimedUSD(
            web3,
            rewardPoolContract,
            account
        );
        setUnclaimedUSD(parseFloat(unClaimedUSD) / Math.pow(10, 18));
        const taxLeftDays = await getTaxLeftDays(web3, legionContract, account);
        setTaxLeftDays(taxLeftDays);
    };

    const toggleDrawer = (open: boolean) => (event: any) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setShowMenu(open);
    };

    const handleDialogClose = (reason: string) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
        }
        setDialogOpen(false);
    };

    const handleClaimReward = async () => {
        setLoading(true);
        try {
            await claimReward(web3, legionContract, account);
            dispatch(
                setReloadStatus({
                    reloadContractStatus: new Date(),
                })
            );
        } catch (error) {}
        setLoading(false);
        setDialogOpen(false);
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
                            open={showMenu}
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
                            <CommonBtn
                                sx={{
                                    fontWeight: "bold",
                                    mr: { xs: 0, md: 5 },
                                    fontSize: { xs: "0.7rem", md: "1rem" },
                                }}
                                onClick={() => setDialogOpen(true)}
                            >
                                <IconButton
                                    aria-label="claim"
                                    component="span"
                                    sx={{ p: 0, mr: 1, color: "black" }}
                                >
                                    <AssistantDirectionIcon />
                                </IconButton>
                                {getTranslation("claim")}{" "}
                                {formatNumber(unClaimedUSD.toFixed(2))} $
                                {getTranslation("bloodstone")}
                            </CommonBtn>
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
																		alt='bloodstone'
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
                                            {formatNumber(
                                                parseFloat(balance).toFixed(2)
                                            )}
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
                                                {account === undefined ||
                                                account === null
                                                    ? "..."
                                                    : account.substr(0, 6) +
                                                      "..." +
                                                      account.substr(
                                                          account.length - 4,
                                                          4
                                                      )}
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
                        ? `You will pay ${parseInt(taxLeftDays) * 2}% tax.`
                        : `Claim ${unClaimedUSD.toFixed(2)} $BLST`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {unClaimedUSD === 0 ? (
                            <>
                                There is no $BLST to claim.
                                <br />
                                Please hunt monsters to get $BLST.
                            </>
                        ) : taxLeftDays === "0" ? (
                            <>
                                You are about to claim {unClaimedUSD.toFixed(2)}{" "}
                                $BLST tax-free.
                                <br />
                                You will receive {unClaimedUSD.toFixed(2)} $BLST
                                in your wallet.
                                <br />
                                Do you want to go ahead?
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
                                You are about to claim {unClaimedUSD.toFixed(2)}{" "}
                                $BLST with {2 * parseInt(taxLeftDays)}% tax.
                                <br />
                                You will pay{" "}
                                {(
                                    (2 * parseInt(taxLeftDays) * unClaimedUSD) /
                                    100
                                ).toFixed(2)}{" "}
                                $BLST, and receive only{" "}
                                {(
                                    ((100 - 2 * parseInt(taxLeftDays)) *
                                        unClaimedUSD) /
                                    100
                                ).toFixed(2)}{" "}
                                $BLST in your wallet.
                                <br />
                                If you wait {taxLeftDays} days, then you will be
                                able to claim tax-free.
                                <br />
                                Are you sure you want to go ahead now?
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
                        Cancel
                    </Button>
                    <Button
                        onClick={handleClaimReward}
                        disabled={unClaimedUSD === 0 || loading === true}
                        variant="outlined"
                        sx={{ fontWeight: "bold" }}
                    >
                        {taxLeftDays === "0"
                            ? "Claim tax-free"
                            : "Claim and pay tax"}
                    </Button>
                </DialogActions>
            </Dialog>
        </AppBar>
    );
};
export default AppBarComponent;
