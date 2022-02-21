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
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import { getTranslation } from "../../utils/translation";
import { useWeb3React } from "@web3-react/core";

import {
    getBeastTokenIds,
    getBeastToken,
    getWarriorTokenIds,
    getWarriorToken,
} from "../../hooks/contractFunction";
import { useBeast, useWarrior, useWeb3 } from "../../hooks/useContract";

import { useSelector } from "react-redux";

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
    },
    achievementBtn: {
        padding: 10,
        borderRadius: 5,
        cursor: "pointer",
        animation: `$Flash linear 1s infinite`,
        background:
            "linear-gradient(360deg, #a54e00, #ffffff29), radial-gradient(#ecff0e, #a54e00)",
        "&:hover": {
            background: "radial-gradient(#ab973c, #743700)",
        },
        border: "1px solid white !important",
        color: "white !important",
        textShadow:
            "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
    },
    "@keyframes Flash": {
        "0%": {
            background:
                "linear-gradient(360deg, #8d4405, #ffffff29), radial-gradient(#702c02, #98a500)",
            boxShadow: "0 0 1px 1px #a7a2a2, 0px 0px 1px 2px #a7a2a2 inset",
        },
        "50%": {
            background:
                "linear-gradient(360deg, #973b04, #ffffff29), radial-gradient(#db5300, #ecff0e)",
            boxShadow: "0 0 4px 4px #a7a2a2, 0px 0px 1px 2px #a7a2a2 inset",
        },
        "100%": {
            background:
                "linear-gradient(360deg, #8d4405, #ffffff29), radial-gradient(#702c02, #98a500)",
            boxShadow: "0 0 1px 1px #a7a2a2, 0px 0px 1px 2px #a7a2a2 inset",
        },
    },
});

const YourAchievements = () => {
    const { reloadContractStatus } = useSelector(
        (state: any) => state.contractReducer
    );

    const { account } = useWeb3React();

    const classes = useStyles();

    const [anchorElYourAchievement, setAnchorElYourAchievement] =
        React.useState<HTMLElement | null>(null);

    const handlePopoverOpenYourAchievement = (
        event: React.MouseEvent<HTMLElement>
    ) => {
        setAnchorElYourAchievement(event.currentTarget);
    };

    const handlePopoverCloseYourAchievement = () => {
        setAnchorElYourAchievement(null);
    };

    const openYourAchievement = Boolean(anchorElYourAchievement);

    //Beast Contract
    const beastContract = useBeast();
    const warriorContract = useWarrior();
    const web3 = useWeb3();

    const [ownBeastWith20, setOwnBeastWith20] = React.useState(false);
    const [ownWarriorWith6, setOwnWarriorWith6] = React.useState(false);

    const getBeastStatus = async () => {
        const ids = await getBeastTokenIds(web3, beastContract, account);
        console.log(ids);
        for (let i = 0; i < ids.length; i++) {
            const beast = await getBeastToken(web3, beastContract, ids[i]);
            if (beast.capacity === "4") {
                setOwnBeastWith20(true);
                return;
            }
        }
    };

    const getWarriorStatus = async () => {
        const ids = await getWarriorTokenIds(web3, warriorContract, account);
        for (let i = 0; i < ids.length; i++) {
            const warrior = await getWarriorToken(
                web3,
                warriorContract,
                ids[i]
            );
            if (warrior.strength === "6") {
                setOwnWarriorWith6(true);
                return;
            }
        }
    };

    React.useEffect(() => {
        getBeastStatus();
        getWarriorStatus();
    }, [reloadContractStatus]);

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
            <Box
                sx={{ p: 4, justifyContent: "center" }}
                className="legionFontColor"
            >
                <Typography
                    sx={{
                        p: 1,
                        fontSize: 18,
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    {getTranslation("yourAchievements")}
                </Typography>
                <Typography sx={{ p: 1 }}>
                    <Checkbox checked={false} />
                    <span style={{ fontWeight: "bold", fontSize: 16 }}>
                        {getTranslation("warriorMaster")}
                    </span>{" "}
                    ({getTranslation("warriorMasterEx")})
                </Typography>
                <Typography sx={{ p: 1 }}>
                    <Checkbox checked={ownBeastWith20} />{" "}
                    <span style={{ fontWeight: "bold", fontSize: 16 }}>
                        {getTranslation("beastMaster")}
                    </span>{" "}
                    ({getTranslation("beastMasterEx")})
                </Typography>
                <Typography sx={{ p: 1 }}>
                    <Checkbox checked={false} />
                    <span style={{ fontWeight: "bold", fontSize: 16 }}>
                        {getTranslation("legionMaster")}
                    </span>{" "}
                    ({getTranslation("legionMasterEx")})
                </Typography>
                <Typography sx={{ p: 1 }}>
                    <Checkbox checked={false} />
                    <span style={{ fontWeight: "bold", fontSize: 16 }}>
                        {getTranslation("monsterConqueror")}
                    </span>{" "}
                    ({getTranslation("monsterConquerorEx")})
                </Typography>
                <Typography sx={{ p: 1 }}>
                    <Checkbox checked={false} />
                    <span style={{ fontWeight: "bold", fontSize: 16 }}>
                        {getTranslation("King/Queen")}
                    </span>{" "}
                    ({getTranslation("King/QueenEx")})
                </Typography>
            </Box>
        </Card>
    );
};

export default YourAchievements;
