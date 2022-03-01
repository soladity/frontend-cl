import * as React from "react";
import {
    Card,
    Box,
    useMediaQuery,
    useTheme,
    Checkbox,
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
    getLegionTokenIds,
    getLegionToken,
} from "../../hooks/contractFunction";
import {
    useBeast,
    useWarrior,
    useWeb3,
    useLegion
} from "../../hooks/useContract";
import Axios from 'axios'

import { useSelector } from "react-redux";
import classnames from 'classnames'

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
    const legionContract = useLegion();
    const web3 = useWeb3();

    const [beastMaster, setBeastMaster] = React.useState(false);
    const [warriorMaster, setWarriorMaster] = React.useState(false);
    const [legionMaster, setLegionMaster] = React.useState(false);
    const [monsterConqueror, setMonsterConqueror] = React.useState(false);
    const [kingOfNicah, setKingOfNicah] = React.useState(false);

    const theme = useTheme();
    const isSmallThanSM = useMediaQuery(theme.breakpoints.down("sm"));

    const getWarriorStatus = async () => {
        try {
            const ids = await getWarriorTokenIds(web3, warriorContract, account);
            for (let i = 0; i < ids.length; i++) {
                const warrior = await getWarriorToken(
                    web3,
                    warriorContract,
                    ids[i]
                );
                if (warrior.strength === "6") {
                    setWarriorMaster(true);
                    return;
                }
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getBeastStatus = async () => {
        try {
            const ids = await getBeastTokenIds(web3, beastContract, account);
            for (let i = 0; i < ids.length; i++) {
                const beast = await getBeastToken(web3, beastContract, ids[i]);
                if (beast.capacity === "20") {
                    setBeastMaster(true);
                    return;
                }
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getLegionStatus = async () => {
        try {
            const ids = await getLegionTokenIds(web3, legionContract, account);
            var legionCount = 0
            for (let i = 0; i < ids.length; i++) {
                const legion = await getLegionToken(web3, legionContract, ids[i]);
                if (legion.attackPower > 30000) {
                    legionCount++;
                    if (legionCount == 10) {
                        setLegionMaster(true);
                        return;
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getMonsterStatus = async () => {
        try {

        } catch (error) {
            console.log(error)
        }
    }

    const getKingStatus = async () => {
        try {

        } catch (error) {
            console.log(error)
        }
    }

    const getInvitationLink = (role: string, status: boolean) => {
        if (status) {
            const baseInviteUrl = "https://www.cryptolegions.link/users/invite/"
            Axios.get(`https://www.cryptolegions.link/api/get-roles/check/${role}/${account}`).then(res => {
                if (res.data.hasAlready) {
                    console.log('already-----', res)
                    window.open(baseInviteUrl + res.data.hasAlready.random_string, '_blank')
                } else {
                    Axios.get(`https://www.cryptolegions.link/api/get-roles/${role}/12/${account}`).then(res => {
                        console.log('new-----', res)
                        window.open(res.data.link, '_blank')
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }

    React.useEffect(() => {
        getBeastStatus();
        getWarriorStatus();
        getLegionStatus();
        getMonsterStatus();
        getKingStatus();
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
                <Typography sx={{ p: 1 }} className={classnames({ 'achievementColor': warriorMaster })} onClick={() => getInvitationLink('warrior_master', warriorMaster)}>
                    <Checkbox checked={warriorMaster} />
                    <span style={{ fontWeight: "bold", fontSize: 16 }}>
                        {getTranslation("warriorMaster")}
                    </span>{" "}
                    {isSmallThanSM && (<br />)}
                    <span style={{ fontSize: 12 }}>
                        ({getTranslation("warriorMasterEx")})
                    </span>
                </Typography>
                <Typography sx={{ p: 1 }} className={classnames({ 'achievementColor': beastMaster })} onClick={() => getInvitationLink('beast_master', beastMaster)}>
                    <Checkbox checked={beastMaster} />{" "}
                    <span style={{ fontWeight: "bold", fontSize: 16 }}>
                        {getTranslation("beastMaster")}
                    </span>{" "}
                    {isSmallThanSM && (<br />)}
                    <span style={{ fontSize: 12 }}>
                        ({getTranslation("beastMasterEx")})
                    </span>
                </Typography>
                <Typography sx={{ p: 1 }} className={classnames({ 'achievementColor': legionMaster })} onClick={() => getInvitationLink('legion_master', legionMaster)}>
                    <Checkbox checked={legionMaster} />
                    <span style={{ fontWeight: "bold", fontSize: 16 }}>
                        {getTranslation("legionMaster")}
                    </span>{" "}
                    {isSmallThanSM && (<br />)}
                    <span style={{ fontSize: 12 }}>
                        ({getTranslation("legionMasterEx")})
                    </span>
                </Typography>
                <Typography sx={{ p: 1 }} className={classnames({ 'achievementColor': monsterConqueror })} onClick={() => getInvitationLink('monster_conqueror', monsterConqueror)}>
                    <Checkbox checked={monsterConqueror} />
                    <span style={{ fontWeight: "bold", fontSize: 16 }}>
                        {getTranslation("monsterConqueror")}
                    </span>{" "}
                    {isSmallThanSM && (<br />)}
                    <span style={{ fontSize: 12 }}>
                        ({getTranslation("monsterConquerorEx")})
                    </span>
                </Typography>
                <Typography sx={{ p: 1 }} className={classnames({ 'achievementColor': kingOfNicah })} onClick={() => getInvitationLink('king_of_nicah', kingOfNicah)}>
                    <Checkbox checked={kingOfNicah} />
                    <span style={{ fontWeight: "bold", fontSize: 16 }}>
                        {getTranslation("King/Queen")}
                    </span>{" "}
                    {isSmallThanSM && (<br />)}
                    <span style={{ fontSize: 12 }}>
                        ({getTranslation("King/QueenEx")})
                    </span>
                </Typography>
            </Box>
        </Card >
    );
};

export default YourAchievements;
