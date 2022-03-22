import * as React from "react";
import {
    Grid,
    Card,
    Box,
    Button,
    Popover,
    Checkbox,
    Dialog,
    DialogTitle,
    Snackbar,
    Alert,
    LinearProgress,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { FaTimes } from "react-icons/fa";
import {
    getBeastBloodstoneAllowance,
    setBeastBloodstoneApprove,
    getWarriorBloodstoneAllowance,
    setWarriorBloodstoneApprove,
    mintBeast,
    mintWarrior,
    getAvailableLegionsCount,
    getSummoningPrice,
    massHunt,
    getAllMonsters
} from "../../hooks/contractFunction";
import { useWeb3React } from "@web3-react/core";
import {
    useBloodstone,
    useBeast,
    useWarrior,
    useWeb3,
    useFeeHandler,
    useLegion,
    useMonster
} from "../../hooks/useContract";
import { useNavigate } from "react-router-dom";
import Slide, { SlideProps } from "@mui/material/Slide";
import { useDispatch } from "react-redux";
import { setReloadStatus } from "../../actions/contractActions";
import { getTranslation } from "../../utils/translation";
import { makeStyles } from "@mui/styles";
import { NavLink } from "react-router-dom";

import CommonBtn from "../../component/Buttons/CommonBtn";

type TransitionProps = Omit<SlideProps, "direction">;

function TransitionUp(props: TransitionProps) {
    return <Slide {...props} direction="up" />;
}

const useStyles = makeStyles({
    legionBtn: {
        background:
            "linear-gradient(360deg, #973b04, #ffffff29), radial-gradient(#db5300, #ecff0e)",
        transition: ".4s all",
        // '&:hover': {
        //     background: 'linear-gradient(360deg, #8d4405, #ffffff29), radial-gradient(#702c02, #98a500)',
        //     transition: '.4s all',
        // },
        color: "white !important",
        textShadow:
            "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
    },
    root: {
        display: "flex",
        flexDirection: "column",
    },
    card: {
        display: "flex",
        flexDirection: "column",
        minHeight: "180px",
        height: "100%",
    },
    MassHuntItemLose: {
        boxShadow: "rgb(0 0 0 / 37%) 0px 2px 4px 0px, rgb(14 30 37 / 85%) 0px 2px 16px 0px",
        borderRadius: 5
    },
    MassHuntItemWin: {
        boxShadow: "rgb(247 247 247 / 55%) 0px 2px 4px 0px, rgb(217 221 206 / 85%) 0px 2px 16px 0px",
        animation: `$Flash linear 2s infinite`,
        borderRadius: 5
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
});

const TakeAction = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const classes = useStyles();

    const [warriorBlstAmountPer, setWarriorBlstAmountPer] = React.useState({
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

    const [showAnimation, setShowAnimation] = React.useState<string | null>("0");

    const [openMassHunt, setOpenMassHunt] = React.useState(false);

    const [massHuntLoading, setMassHuntLoading] = React.useState(false)
    const [massHuntResult, setMassHuntResult] = React.useState<any>([])

    const [availableLegionCount, setAvailableLegionCount] = React.useState(0);

    var massHuntResutTemp: any = []

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

    //Popover for Summon Warrior
    const [anchorElSummonWarrior, setAnchorElSummonWarrior] =
        React.useState<HTMLElement | null>(null);
    const handlePopoverOpenSummonWarrior = (
        event: React.MouseEvent<HTMLElement>
    ) => {
        setAnchorElSummonWarrior(event.currentTarget);
    };
    const handlePopoverCloseSummonWarrior = () => {
        setAnchorElSummonWarrior(null);
    };
    const openSummonWarrior = Boolean(anchorElSummonWarrior);

    //Account
    const { account } = useWeb3React();

    const beastContract = useBeast();
    const warriorContract = useWarrior();
    const bloodstoneContract = useBloodstone();
    const feeHandlerContract = useFeeHandler()
    const legionContract = useLegion();
    const monsterContract = useMonster()

    const web3 = useWeb3();

    //Mint Beast with quantity
    const handleBeastMint = async (
        amount: Number,
        Transition: React.ComponentType<TransitionProps>
    ) => {
        handlePopoverCloseSummonBeast();
        const allowance = await getBeastBloodstoneAllowance(
            web3,
            bloodstoneContract,
            account
        );
        if (allowance === "0") {
            await setBeastBloodstoneApprove(web3, bloodstoneContract, account);
        }
        await mintBeast(web3, beastContract, account, amount);

        setTransition(() => Transition);
        setSnackBarMessage(getTranslation("summonBeastSuccessful"));
        setSnackBarNavigation("/beasts");
        setOpenSnackBar(true);
        dispatch(
            setReloadStatus({
                reloadContractStatus: new Date(),
            })
        );
    };

    //Mint Warriors with quantity
    const handleWarriorMint = async (
        amount: Number,
        Transition: React.ComponentType<TransitionProps>
    ) => {
        handlePopoverCloseSummonWarrior();
        const allowance = await getWarriorBloodstoneAllowance(
            web3,
            bloodstoneContract,
            account
        );
        if (allowance === "0") {
            await setWarriorBloodstoneApprove(web3, bloodstoneContract, account);
        }
        await mintWarrior(web3, warriorContract, account, amount);

        setTransition(() => Transition);
        setSnackBarMessage(getTranslation("summonWarriorSuccessful"));
        setSnackBarNavigation("/warriors");
        setOpenSnackBar(true);
        dispatch(
            setReloadStatus({
                reloadContractStatus: new Date(),
            })
        );
    };

    //SnackBar
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState("");
    const [snackBarNavigation, setSnackBarNavigation] = React.useState("");
    const [transition, setTransition] = React.useState<
        React.ComponentType<TransitionProps> | undefined
    >(undefined);

    const getBlstAmountToMintWarrior = async () => {
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
            console.log(amount_per)
            setWarriorBlstAmountPer(amount_per);
        } catch (error) {
            console.log(error);
        }

        return BLST_amount_1;
    };

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


    const massHunting = async () => {
        console.log('start mass hunt')
        setMassHuntResult([])
        massHuntResutTemp = []
        setOpenMassHunt(true)
        if (availableLegionCount > 0) {
            setMassHuntLoading(true)
            try {
                await massHunt(legionContract, account)
            } catch (error) {
                setOpenMassHunt(false)
                console.log(error)
            }
            setMassHuntLoading(false)
        }
        console.log('end mass hunt')
    }

    const updateState = () => {
        setOpenMassHunt(false)
        dispatch(
            setReloadStatus({
                reloadContractStatus: new Date(),
            })
        );
    }

    const handleMassHuntClose = (reason: string) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
        }
        setOpenMassHunt(false)
    }

    const getInitInfo = async () => {
        getBlstAmountToMintWarrior();
        getBlstAmountToMintBeast();
        setShowAnimation(
            localStorage.getItem("showAnimation")
                ? localStorage.getItem("showAnimation")
                : "0"
        );
        const availableLegionCount = await getAvailableLegionsCount(
            web3,
            legionContract,
            account
        );
        if (availableLegionCount == 0) {
            setMassHuntResult([])
        }
        setAvailableLegionCount(availableLegionCount);
    }


    React.useEffect(() => {
        getInitInfo()

        const huntEvent = legionContract.events.Hunted({
        }).on('connected', function (subscriptionId: any) {
        }).on('data', async function (event: any) {
            console.log(event)
            if (account == event.returnValues._addr && massHuntResutTemp.filter((item: any) => item.legionId == event.returnValues.legionId).length == 0) {
                const monsterVal = await getAllMonsters(monsterContract);
                const rewards = monsterVal[1]
                var huntResult = {
                    legionId: event.returnValues.legionId,
                    monsterId: event.returnValues.monsterId,
                    percent: event.returnValues.percent,
                    roll: event.returnValues.roll,
                    success: event.returnValues.success,
                    legionName: event.returnValues.name,
                    reward: (rewards[event.returnValues.monsterId - 1] / Math.pow(10, 18)).toFixed(2)
                }
                massHuntResutTemp.push(huntResult)
                console.log(huntResult)
                setMassHuntResult(massHuntResutTemp)
            }
        })

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

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "180px",
                height: "100%",
                background: "#16161699",
            }}
        >
            <Snackbar
                open={openSnackBar}
                TransitionComponent={transition}
                autoHideDuration={6000}
                onClose={() => setOpenSnackBar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                key={transition ? transition.name : ""}
            >
                <Alert
                    onClose={() => setOpenSnackBar(false)}
                    variant="filled"
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    <Box
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(snackBarNavigation)}
                    >
                        {snackBarMessage}
                    </Box>
                </Alert>
            </Snackbar>
            <Box sx={{ p: 4, justifyContent: "center" }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        borderBottom: "1px solid #fff",
                        marginBottom: 3,
                    }}
                >
                    {getTranslation("takeAction")}
                </Typography>
                <Box>
                    <Grid container spacing={{ xs: 2, sm: 2, md: 1, lg: 2 }}>
                        <Grid item xs={6} md={12} lg={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                <Box sx={{ textAlign: "center", width: "100%" }}>
                                    <CommonBtn
                                        aria-describedby={"summon-warrior-id"}
                                        onClick={handlePopoverOpenSummonWarrior}
                                        sx={{
                                            fontWeight: "bold",
                                            wordBreak: "break-word",
                                            fontSize: 14,
                                            width: "100%",
                                            marginBottom: 1,
                                        }}
                                    >
                                        {getTranslation("summonWarrior")}
                                    </CommonBtn>
                                    <Popover
                                        id={"summon-warrior-id"}
                                        open={openSummonWarrior}
                                        anchorEl={anchorElSummonWarrior}
                                        onClose={handlePopoverCloseSummonWarrior}
                                        anchorOrigin={{
                                            vertical: "center",
                                            horizontal: "left",
                                        }}
                                        transformOrigin={{
                                            vertical: "center",
                                            horizontal: "right",
                                        }}
                                    >
                                        <Box sx={{ display: "flex" }}>
                                            <Box
                                                sx={{
                                                    marginLeft: "auto",
                                                    wordBreak: "break-word",
                                                    cursor: "pointer",
                                                    marginRight: 1,
                                                    marginTop: 1,
                                                }}
                                            >
                                                <FaTimes onClick={handlePopoverCloseSummonWarrior} />
                                            </Box>
                                        </Box>
                                        <DialogTitle>
                                            {getTranslation("takeActionSummonWarriorQuantity")}
                                        </DialogTitle>
                                        <Box
                                            sx={{
                                                padding: 3,
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <CommonBtn
                                                onClick={() => handleWarriorMint(1, TransitionUp)}
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: "break-word",
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                1 ({warriorBlstAmountPer.b1?.amount} $BLST)
                                            </CommonBtn>
                                            <CommonBtn
                                                onClick={() => handleWarriorMint(10, TransitionUp)}
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: "break-word",
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                10 (
                                                {"-" +
                                                    warriorBlstAmountPer.b10.per +
                                                    "%" +
                                                    " | " +
                                                    warriorBlstAmountPer.b10?.amount}{" "}
                                                $BLST)
                                            </CommonBtn>
                                            <CommonBtn
                                                onClick={() => handleWarriorMint(50, TransitionUp)}
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: "break-word",
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                50 (
                                                {"-" +
                                                    warriorBlstAmountPer.b50.per +
                                                    "%" +
                                                    " | " +
                                                    warriorBlstAmountPer.b50?.amount}{" "}
                                                $BLST)
                                            </CommonBtn>
                                            <CommonBtn
                                                onClick={() => handleWarriorMint(100, TransitionUp)}
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: "break-word",
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                100 (
                                                {"-" +
                                                    warriorBlstAmountPer.b100.per +
                                                    "%" +
                                                    " | " +
                                                    warriorBlstAmountPer.b100?.amount}{" "}
                                                $BLST)
                                            </CommonBtn>
                                            <CommonBtn
                                                onClick={() => handleWarriorMint(150, TransitionUp)}
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: "break-word",
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                150 (
                                                {"-" +
                                                    warriorBlstAmountPer.b150.per +
                                                    "%" +
                                                    " | " +
                                                    warriorBlstAmountPer.b150?.amount}{" "}
                                                $BLST)
                                            </CommonBtn>
                                        </Box>
                                    </Popover>
                                    <CommonBtn
                                        onClick={handlePopoverOpenSummonBeast}
                                        aria-describedby={"summon-beast-id"}
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: "bold",
                                            wordBreak: "break-word",
                                            width: "100%",
                                            marginBottom: 1,
                                        }}
                                    >
                                        {getTranslation("summonBeast")}
                                    </CommonBtn>
                                    <Popover
                                        id={"summon-beast-id"}
                                        open={openSummonBeast}
                                        anchorEl={anchorElSummonBeast}
                                        onClose={handlePopoverCloseSummonBeast}
                                        anchorOrigin={{
                                            vertical: "center",
                                            horizontal: "left",
                                        }}
                                        transformOrigin={{
                                            vertical: "center",
                                            horizontal: "right",
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
                                                onClick={() => handleBeastMint(1, TransitionUp)}
                                                sx={{
                                                    fontSize: 14,
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                1 ({beastBlstAmountPer.b1?.amount} $BLST)
                                            </CommonBtn>
                                            <CommonBtn
                                                onClick={() => handleBeastMint(10, TransitionUp)}
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: "break-word",
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
                                                onClick={() => handleBeastMint(50, TransitionUp)}
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: "break-word",
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
                                                onClick={() => handleBeastMint(100, TransitionUp)}
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: "break-word",
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
                                                onClick={() => handleBeastMint(150, TransitionUp)}
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: "break-word",
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
                                    <CommonBtn
                                        sx={{
                                            fontWeight: "bold",
                                            wordBreak: "break-word",
                                            fontSize: 14,
                                            width: "100%",
                                            marginBottom: 1,
                                        }}
                                    >
                                        <NavLink to="/createlegions" className="non-style">
                                            {getTranslation("takeActionCreateLegion")}
                                        </NavLink>
                                    </CommonBtn>
                                    <NavLink to="/hunt" className="non-style">
                                        <CommonBtn
                                            sx={{
                                                fontWeight: "bold",
                                                wordBreak: "break-word",
                                                fontSize: 14,
                                                width: "100%",
                                                marginBottom: 1,
                                            }}
                                        >
                                            {getTranslation("hunt")}
                                        </CommonBtn>
                                    </NavLink>
                                    {/* <NavLink to="/hunt" className="non-style"> */}
                                    <CommonBtn
                                        sx={{
                                            fontWeight: "bold",
                                            wordBreak: "break-word",
                                            fontSize: 14,
                                            width: "100%",
                                        }}
                                        onClick={() => massHunting()}
                                    >
                                        {getTranslation("takeActionMassHunt")}
                                    </CommonBtn>
                                    {/* </NavLink> */}
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={12} lg={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                <Box sx={{ textAlign: "center", width: "100%" }}>
                                    <NavLink to="/warriorsMarketplace" className="non-style">
                                        <CommonBtn
                                            sx={{
                                                fontWeight: "bold",
                                                wordBreak: "break-word",
                                                fontSize: 14,
                                                width: "100%",
                                                marginBottom: 1,
                                            }}
                                        >
                                            {getTranslation("takeActionBuyWarriors")}
                                        </CommonBtn>
                                    </NavLink>
                                    <NavLink to="/beastsMarketplace" className="non-style">
                                        <CommonBtn
                                            sx={{
                                                fontWeight: "bold",
                                                wordBreak: "break-word",
                                                fontSize: 14,
                                                width: "100%",
                                                marginBottom: 1,
                                            }}
                                        >
                                            {getTranslation("takeActionBuyBeasts")}
                                        </CommonBtn>
                                    </NavLink>
                                    <NavLink to="/legionsMarketplace" className="non-style">
                                        <CommonBtn
                                            sx={{
                                                fontWeight: "bold",
                                                wordBreak: "break-word",
                                                fontSize: 14,
                                                width: "100%",
                                                marginBottom: 1,
                                            }}
                                        >
                                            {getTranslation("takeActionBuyLegions")}
                                        </CommonBtn>
                                    </NavLink>
                                    <a href="https://poocoin.app" target="_blank">
                                        <CommonBtn
                                            sx={{
                                                fontWeight: "bold",
                                                wordBreak: "break-word",
                                                fontSize: 14,
                                                width: "100%",
                                                marginBottom: 1,
                                            }}
                                        >
                                            {getTranslation("takeActionDextools")}
                                        </CommonBtn>
                                    </a>
                                    <a href="https://pancakeswap.com" target="_blank">
                                        <CommonBtn
                                            sx={{
                                                fontWeight: "bold",
                                                wordBreak: "break-word",
                                                fontSize: 14,
                                                width: "100%",
                                            }}
                                        >
                                            {getTranslation("takeActionBuyBlst")}
                                        </CommonBtn>
                                    </a>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            <Dialog
                disableEscapeKeyDown
                onClose={(_, reason) => handleMassHuntClose(reason)}
                open={openMassHunt} sx={{ p: 1 }}
            >
                <DialogTitle sx={{ textAlign: "center" }}>
                    {getTranslation('takeActionMassHunt')}
                </DialogTitle>
                {
                    massHuntLoading && availableLegionCount > 0 && (
                        <Box sx={{ p: 1 }}>
                            <LinearProgress sx={{ width: "100%" }} color="success" />
                        </Box>
                    )
                }
                <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', maxHeight: 500, overflowY: 'auto', justifyContent: 'space-around' }}>

                    {
                        availableLegionCount == 0 && (
                            "There is no legion to hunt!"
                        )
                    }
                    {
                        massHuntResult.map((item: any, index: any) => (
                            <Box key={index} className={item.success ? classes.MassHuntItemWin : classes.MassHuntItemLose} sx={{ textAlign: 'center', margin: 1, width: 170, p: 1 }}>
                                {
                                    item.success
                                        ? (<img src={
                                            showAnimation === "0"
                                                ? `/assets/images/characters/jpg/monsters/m${item['monsterId']}.jpg`
                                                : `/assets/images/characters/gif/monsters/m${item['monsterId']}.gif`
                                        } style={{ width: '100%' }} />)
                                        : (<img src={`/assets/images/loosing.gif`} style={{ width: '100%' }} />)
                                }
                                <Box sx={{ wordBreak: 'break-word' }}>
                                    {item.legionName}
                                </Box>
                                <Box sx={{ p: 1, fontSize: 12 }}>
                                    <span>{getTranslation('maxRoll')}: {item.percent}</span>
                                </Box>
                                <Box sx={{ p: 1, fontSize: 12 }}>
                                    <span>{getTranslation('yourRoll')}: {item.roll}</span>
                                </Box>
                                <Box sx={{ p: 1, fontSize: 12 }}>
                                    {
                                        item.success ? (
                                            <span>{getTranslation('won')} {item.reward} $BLST</span>
                                        ) : (
                                            <span>{getTranslation('lost')}</span>
                                        )
                                    }
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
                <Box sx={{ display: 'flex', p: 1, justifyContent: 'space-between' }}>
                    <CommonBtn
                        disabled={massHuntLoading}
                        sx={{ marginLeft: 'auto', fontWeight: "bold" }}
                        onClick={() => updateState()}
                    >
                        {getTranslation("continue")}
                    </CommonBtn>
                </Box>
            </Dialog >
        </Card>
    );
};

export default TakeAction;
