import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    Typography,
    Card,
    CardMedia,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { MonsterCard } from "../../component/Cards/MonsterCard";
import Helmet from "react-helmet";
import {
    meta_constant,
    createlegions,
    allConstants,
} from "../../config/meta.config";
import { useWeb3React } from "@web3-react/core";
import {
    useBeast,
    useLegion,
    useWarrior,
    useMonster,
    useWeb3,
} from "../../hooks/useContract";
import {
    getBeastBalance,
    getLegionTokenIds,
    getLegionToken,
    getWarriorBalance,
    getMonsterInfo,
    getBaseJpgURL,
    getBaseGifURL,
    canHunt,
    hunt,
} from "../../hooks/contractFunction";
import { getTranslation } from "../../utils/translation";
import CommonBtn from "../../component/Buttons/CommonBtn";
import RedBGMenuItem from "./RedMenuItem";
import GreenBGMenuItem from "./GreenMenuItem";
import OrgBGMenuItem from "./OrgMenuItem";
import { Spinner } from "../../component/Buttons/Spinner";
import { useDispatch } from "react-redux";
import { setReloadStatus } from "../../actions/contractActions";
import imageUrls from "../../constant/images";
import { useNavigate } from "react-router-dom";
import ScrollToButton from "../../component/Scroll/ScrollToButton";
import ScrollSection from "../../component/Scroll/Section";

const useStyles = makeStyles(() => ({
    Card: {
        position: "sticky",
        zIndex: 99,
        marginTop: "24px",
        marginBottom: "4px",
        padding: 10,
        paddingTop: "20px",
        "@media(min-width: 0px)": {
            top: "115px",
        },
        "@media(min-width: 358px)": {
            top: "66px",
        },
        "@media(min-width: 813px)": {
            top: "15px",
        },
        "@media(min-width: 900px)": {
            top: "49px",
        },
    },
    Grid: {
        paddingTop: "2%",
        // "@media(min-width: 0px)": {
        //   paddingTop: "14%",
        // },
        // "@media(min-width: 600px)": {
        //   paddingTop: "20%",
        // },
        // "@media(min-width: 763px)": {
        //   paddingTop: "6%",
        // },
        // "@media(min-width: 900px)": {
        //   paddingTop: "2%",
        // },
    },
}));

interface MonsterInterface {
    id: number;
    base: string;
    ap: number;
    reward: string;
    image: string;
    imageAlt: string;
    name: string;
}

interface LegionInterface {
    name: string;
    beasts: string;
    warriors: string;
    supplies: string;
    attackPower: number;
    id: number;
    status: string;
    lastHuntTime: any;
}

const Monsters = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { account } = useWeb3React();
    const web3 = useWeb3();

    const monsterRef = React.useRef(null);

    const legionContract = useLegion();
    const beastContract = useBeast();
    const warriorContract = useWarrior();
    const monsterContract = useMonster();

    const [loading, setLoading] = useState(true);
    const [showAnimation, setShowAnimation] = useState<string | null>("0");
    const [baseJpgUrl, setBaseJpgUrl] = useState("");
    const [baseGifUrl, setBaseGifUrl] = useState("");
    const [curComboLegionValue, setCurComboLegionValue] = useState("0");
    const [legions, setLegions] = useState(Array);
    const [legionIDs, setLegionIDs] = useState(Array);
    const [beasts, setBeasts] = useState(Array);
    const [warriors, setWarriors] = useState(Array);
    const [mintedWarriorCnt, setMintedWarriorCnt] = useState(0);
    const [curLegion, setCurLegion] = useState<LegionInterface | null>();
    const [monsters, setMonsters] = useState(Array);
    const [curMonster, setCurMonster] = useState<MonsterInterface | null>();
    const [curMonsterID, setCurMonsterID] = useState(0);
    const [scrollMaxHeight, setScrollMaxHeight] = useState(0);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [huntedStatus, setHuntedStatus] = useState(0);
    const [continueLoading, setContinueLoading] = useState(false);
    const [huntedRoll, setHuntedRoll] = useState(0);
    const [currentTime, setCurrentTime] = React.useState(new Date());
    const [strongestMonsterToHunt, setStrongestMonsterToHunt] =
        React.useState(0);

    const scrollArea = useCallback((node) => {
        if (node != null) {
            setScrollMaxHeight(node.scrollHeight);
        }
    }, []);

    useEffect(() => {
        if (account) {
            initialize();
        }
        setShowAnimation(
            localStorage.getItem("showAnimation")
                ? localStorage.getItem("showAnimation")
                : "0"
        );
    }, []);

    let options = {
        address: ["0xc960D5645BD7Be251D3679C6e43993BAeEf99239"],
        topics: [],
    };

    let subscription = web3.eth.subscribe("logs", options, (err, event) => {
        if (!err) {
            console.log("event", event);
        }
    });

    const initMonster = async () => {
        let monsterTmp;
        let monsterArraryTmp = [];
        for (let i = 1; i < 23; i++) {
            monsterTmp = await getMonsterInfo(web3, monsterContract, i);
            monsterArraryTmp.push({ ...monsterTmp, id: i });
        }
        console.log("monsterArraryTmp", monsterArraryTmp);
        setMonsters(monsterArraryTmp);
    };

    const updateMonster = async () => {
        const legionIDS = await getLegionTokenIds(
            web3,
            legionContract,
            account
        );
        let legionTmp;
        let legionStatus = "";
        let legionArrayTmp = [];
        for (let i = 0; i < legionIDS.length; i++) {
            legionStatus = await canHunt(web3, legionContract, legionIDS[i]);
            legionTmp = await getLegionToken(
                web3,
                legionContract,
                legionIDS[i]
            );
            legionArrayTmp.push({
                ...legionTmp,
                id: legionIDS[i],
                status: legionStatus,
            });
        }
        setLegions(legionArrayTmp);
        const tempLegionValue =
            parseInt(curComboLegionValue) - 1 < 0
                ? 0
                : parseInt(curComboLegionValue) - 1;
        setCurComboLegionValue(tempLegionValue + "");
        setCurLegion(legionArrayTmp[tempLegionValue]);
        setCurComboLegionValue(tempLegionValue + 1 + "");
        setCurLegion(legionArrayTmp[tempLegionValue + 1]);
    };

    const initialize = async () => {
        setLoading(true);
        const legionIDS = await getLegionTokenIds(
            web3,
            legionContract,
            account
        );
        let legionTmp;
        let legionArrayTmp = [];
        let legionStatus = "";
        let warriorCnt = 0;
        for (let i = 0; i < legionIDS.length; i++) {
            // if (legionIDS[i] != 1) {
            legionStatus = await canHunt(web3, legionContract, legionIDS[i]);
            legionTmp = await getLegionToken(
                web3,
                legionContract,
                legionIDS[i]
            );
            console.log(legionTmp, legionStatus);
            legionArrayTmp.push({
                ...legionTmp,
                id: legionIDS[i],
                status: legionStatus,
            });
            warriorCnt += legionTmp.warriors.length;
            // }
        }
        await initMonster();
        setBaseJpgUrl(await getBaseJpgURL(web3, monsterContract));
        setBaseGifUrl(await getBaseGifURL(web3, monsterContract));
        setBeasts(await getBeastBalance(web3, beastContract, account));
        setWarriors(await getWarriorBalance(web3, warriorContract, account));
        console.log(await getWarriorBalance(web3, warriorContract, account));
        setLegionIDs(legionIDS);
        console.log(legionArrayTmp);
        setLegions(legionArrayTmp);
        setMintedWarriorCnt(warriorCnt);
        setCurLegion(legionArrayTmp[0]);
        setLoading(false);
    };

    const handleDialogClose = (reason: string) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
        }
        setDialogVisible(false);
    };

    const handleCurLegionValue = (e: SelectChangeEvent) => {
        const selectedIndex = parseInt(e.target.value);
        const curLegionTmp = (legions as any)[selectedIndex] as LegionInterface;
        var strongestMonsterToHuntId: number;
        for (let i = 0; i < monsters.length; i++) {
            const monster: any = monsters[i];
            if (parseInt(monster?.ap) <= curLegionTmp.attackPower) {
                setStrongestMonsterToHunt(i);
                // strongestMonsterToHuntId = i;
            } else {
                break;
            }
        }
        setCurComboLegionValue(e.target.value as string);
        setCurLegion(curLegionTmp);
        // setStrongestMonsterToHunt(strongestMonsterToHuntId);
    };

    const handleHunt = async (monsterTokenID: number) => {
        setDialogVisible(true);
        setCurMonsterID(monsterTokenID);
        setCurMonster(monsters[monsterTokenID - 1] as MonsterInterface);
        try {
            let response = await hunt(
                web3,
                legionContract,
                account,
                curLegion?.id,
                monsterTokenID
            );
            const result = response.events.Hunted.returnValues;
            setHuntedRoll(result.roll);
            setHuntedStatus(result.success ? 1 : 2);
            dispatch(
                setReloadStatus({
                    reloadContractStatus: new Date(),
                })
            );
        } catch (e: any) {
            console.log(e);
            setDialogVisible(false);
        }
    };

    const handleContinue = async () => {
        setContinueLoading(true);
        await updateMonster();
        setDialogVisible(false);
        setHuntedStatus(0);
        setContinueLoading(false);
        dispatch(
            setReloadStatus({
                reloadContractStatus: new Date(),
            })
        );
    };

    const calcHuntTime = (huntTime: any) => {
        var time = "~";
        if (huntTime != 0) {
            var diff = currentTime.getTime() - huntTime * 1000;
            if (diff / 1000 / 3600 >= 24) {
                time = "00s";
            } else {
                var totalSecs = parseInt(
                    ((24 * 1000 * 3600 - diff) / 1000).toFixed(2)
                );
                var hours = Math.floor(totalSecs / 3600).toFixed(0);
                var mins = Math.floor((totalSecs % 3600) / 60).toFixed(0);
                var secs = Math.floor(totalSecs % 3600) % 60;
                if (parseInt(hours) > 0) {
                    time = `${hours}h ${mins}m ${secs}s`;
                } else if (parseInt(mins) > 0) {
                    time = `${mins}m ${secs}s`;
                } else {
                    time = `${secs}s`;
                }
            }
        } else if (curLegion?.supplies != "0") {
            var time = "00s";
        }
        return time;
    };
    const navigate = useNavigate();

    const toHighestMonster = (legionAP: any) => { };

    React.useEffect(() => {
        setTimeout(() => {
            setCurrentTime(new Date());
        }, 1000);
    }, [currentTime]);

    return (
        <Box>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{meta_constant.monster.title}</title>
                <meta
                    name="description"
                    content={meta_constant.monster.description}
                />
                {meta_constant.monster.keywords && (
                    <meta
                        name="keywords"
                        content={meta_constant.monster.keywords.join(",")}
                    />
                )}
            </Helmet>
            {loading === false && legions.length > 0 && (
                <Box
                    component="div"
                    sx={{ position: "relative" }}
                    ref={scrollArea}
                    id="monsters"
                >
                    <Card className={classes.Card}>
                        <Grid
                            container
                            spacing={2}
                            sx={{ justifyContent: "center" }}
                            alignItems="center"
                            columns={60}
                        >
                            <Grid item xs={60} sm={60} md={20}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                        {getTranslation("legions")}
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={curComboLegionValue}
                                        label="Current Legion"
                                        onChange={handleCurLegionValue}
                                    >
                                        {legions.map((legion: any, index) =>
                                            legion.status === "1" ? (
                                                <GreenBGMenuItem
                                                    value={index}
                                                    key={index}
                                                >
                                                    #{legion.id} {legion.name}
                                                </GreenBGMenuItem>
                                            ) : legion.status === "2" ? (
                                                <OrgBGMenuItem
                                                    value={index}
                                                    key={index}
                                                >
                                                    #{legion.id} {legion.name}
                                                </OrgBGMenuItem>
                                            ) : (
                                                <RedBGMenuItem
                                                    value={index}
                                                    key={index}
                                                >
                                                    #{legion.id} {legion.name} ({legion.attackPower} AP)
                                                </RedBGMenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={30} sm={12} md={9}>
                                <ScrollToButton
                                    toId={"monster" + strongestMonsterToHunt}
                                    duration={1000}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: {
                                                xs: 14,
                                                sm: 16,
                                                md: 20,
                                            },
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                        }}
                                    // onClick={ () =>
                                    //     toHighestMonster(curLegion?.attackPower)
                                    // }
                                    >
                                        {curLegion?.attackPower.toFixed(0)} AP
                                    </Typography>
                                </ScrollToButton>
                            </Grid>
                            <Grid item xs={30} sm={12} md={7}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontSize: { xs: 14, sm: 16, md: 20 },
                                    }}
                                >
                                    W {curLegion?.warriors.length}/
                                    {warriors.length + mintedWarriorCnt}
                                </Typography>
                            </Grid>
                            <Grid item xs={30} sm={12} md={7}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontSize: { xs: 14, sm: 16, md: 20 },
                                    }}
                                >
                                    B {curLegion?.beasts.length}/
                                    {createlegions.main.maxAvailableDragCount}
                                </Typography>
                            </Grid>
                            <Grid item xs={30} sm={12} md={7}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color:
                                            curLegion?.status === "1"
                                                ? "#18e001"
                                                : curLegion?.status === "2"
                                                    ? "#ae7c00"
                                                    : "#fd3742",
                                        fontWeight: 1000,
                                        fontSize: { xs: 14, sm: 16, md: 20 },
                                    }}
                                >
                                    {curLegion?.supplies}H
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={30}
                                sm={12}
                                md={10}
                                sx={{ marginRight: "auto" }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontSize: { xs: 14, sm: 16, md: 20 },
                                    }}
                                >
                                    {calcHuntTime(curLegion?.lastHuntTime)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        className={classes.Grid}
                    >
                        {monsters.map(
                            (monster: any | MonsterInterface, index) => (
                                // <Box component='div' sx={{ width: '100%', my: 1 }} key={index}> xs={32} sm={30} md={20} lg={15} xl={12}
                                <Grid
                                    item
                                    sx={{
                                        width: "700px",
                                        height: "500px",
                                        maxWidth: "500px",
                                        maxHeight: "700px",
                                        margin: "auto",
                                        marginBottom: "200px",
                                    }}
                                    key={index}
                                >
                                    <ScrollSection id={"monster" + index}>
                                        <MonsterCard
                                            image={
                                                showAnimation === "0"
                                                    ? imageUrls.baseUrl +
                                                    imageUrls.monsters[index]
                                                        .jpg
                                                    : imageUrls.baseUrl +
                                                    imageUrls.monsters[index]
                                                        .gif
                                            }
                                            name={monster.name}
                                            tokenID={index + 1}
                                            base={monster.base}
                                            minAP={monster.ap}
                                            bouns={
                                                curLegion &&
                                                    monster.ap <
                                                    (
                                                        curLegion as LegionInterface
                                                    ).attackPower
                                                    ? "" +
                                                    ((
                                                        curLegion as LegionInterface
                                                    ).attackPower -
                                                        monster.ap) /
                                                    2000
                                                    : "0"
                                            }
                                            price={monster.reward}
                                            isHuntable={
                                                curLegion?.status === "1" &&
                                                monster.ap <=
                                                (
                                                    curLegion as LegionInterface
                                                ).attackPower
                                            }
                                            handleHunt={handleHunt}
                                        />
                                    </ScrollSection>
                                </Grid>
                                // </Box>
                            )
                        )}
                    </Grid>
                </Box>
            )}
            {loading === false && legions.length === 0 && (
                <Grid
                    container
                    justifyContent="center"
                    sx={{ paddingTop: "20%" }}
                >
                    <Grid item>
                        <Typography variant="h4">
                            {getTranslation("noMintedLegion")}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sx={{ textAlign: "center", marginTop: 2 }}
                    >
                        <CommonBtn>
                            <NavLink to="/createlegions" className="non-style">
                                {getTranslation("createLegion")}
                            </NavLink>
                        </CommonBtn>
                    </Grid>
                </Grid>
            )}
            {loading === true && (
                <>
                    <Grid
                        item
                        xs={12}
                        sx={{ p: 4, textAlign: "center", paddingTop: "20%" }}
                        className={classes.Grid}
                    >
                        <Typography variant="h4">
                            {getTranslation("loadingMonsters")}
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
            <Dialog
                disableEscapeKeyDown
                onClose={(_, reason) => handleDialogClose(reason)}
                open={dialogVisible}
            >
                {huntedStatus === 0 && (
                    <>
                        <DialogTitle sx={{ textAlign: "center" }}>
                            <Box component="p">
                                {getTranslation("huntTime")}
                            </Box>
                            {getTranslation("huntTimeSubtitle1")}
                            <Box component="p">
                                {curMonster?.name.toUpperCase()}
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <CardMedia
                                component="img"
                                image="/assets/images/waiting.gif"
                                alt="Monster Image"
                                loading="lazy"
                            />
                        </DialogContent>
                    </>
                )}
                {huntedStatus === 1 && (
                    <>
                        <DialogTitle sx={{ textAlign: "center" }}>
                            <>
                                <Box component="p">
                                    {getTranslation("congratulation")}
                                </Box>
                                <Typography>
                                    {getTranslation("congSubtitle1")}
                                </Typography>
                                <Box component="p">
                                    {getTranslation(
                                        "congSubtitle2"
                                    ).toUpperCase()}{" "}
                                    {curMonster?.reward} $BLST
                                </Box>
                            </>
                        </DialogTitle>
                        <DialogContent>
                            <Box component="div" sx={{ position: "relative" }}>
                                <CardMedia
                                    component="img"
                                    image={
                                        "/assets/images/defeat/m" +
                                        curMonsterID +
                                        ".gif"
                                    }
                                    alt="Monster Image"
                                    loading="lazy"
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                px: 3,
                            }}
                        >
                            {continueLoading ? (
                                <Typography>
                                    {" "}
                                    Wait a moment, loading...
                                </Typography>
                            ) : (
                                <Box component="div" sx={{ marginRight: 1 }}>
                                    <Typography>
                                        {getTranslation("yourRollTitle")}{" "}
                                        {huntedRoll}
                                    </Typography>
                                    <Typography>
                                        {getTranslation("congSubtitle3")}{" "}
                                        {parseInt(curMonster?.base as string) +
                                            ((curMonster?.ap as number) <
                                                (curLegion?.attackPower as number)
                                                ? parseFloat(
                                                    (
                                                        ((curLegion?.attackPower as number) -
                                                            (curMonster?.ap as number)) /
                                                        2000
                                                    ).toFixed(2)
                                                )
                                                : 0)}
                                    </Typography>
                                </Box>
                            )}
                            <CommonBtn
                                onClick={() => handleContinue()}
                                disabled={continueLoading}
                                sx={{ paddingX: 3 }}
                            >
                                {continueLoading ? (
                                    <Spinner color="white" size={40} />
                                ) : (
                                    getTranslation("continue")
                                )}
                            </CommonBtn>
                        </DialogActions>
                    </>
                )}
                {huntedStatus === 2 && (
                    <>
                        <DialogTitle sx={{ textAlign: "center" }}>
                            <>
                                <Box component="p">
                                    {getTranslation("defeatTitle")}
                                </Box>
                                {getTranslation("defeatSubtitle1")}
                            </>
                        </DialogTitle>
                        <DialogContent>
                            <Box component="div" sx={{ position: "relative" }}>
                                <CardMedia
                                    component="img"
                                    image="/assets/images/loosing.gif"
                                    alt="Monster Image"
                                    loading="lazy"
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                px: 3,
                            }}
                        >
                            {continueLoading ? (
                                <Typography>
                                    {" "}
                                    Wait a moment, loading...
                                </Typography>
                            ) : (
                                <Box component="div" sx={{ marginRight: 1 }}>
                                    <Typography>
                                        {getTranslation("yourRollTitle")}{" "}
                                        {huntedRoll}
                                    </Typography>
                                    <Typography>
                                        {getTranslation("defeatSubtitle2")}{" "}
                                        {parseInt(curMonster?.base as string) +
                                            ((curMonster?.ap as number) <
                                                (curLegion?.attackPower as number)
                                                ? parseFloat(
                                                    (
                                                        ((curLegion?.attackPower as number) -
                                                            (curMonster?.ap as number)) /
                                                        2000
                                                    ).toFixed(2)
                                                )
                                                : 0)}
                                    </Typography>
                                </Box>
                            )}
                            <CommonBtn
                                onClick={() => handleContinue()}
                                disabled={continueLoading}
                                sx={{ paddingX: 3 }}
                            >
                                {continueLoading ? (
                                    <Spinner color="white" size={40} />
                                ) : (
                                    getTranslation("continue")
                                )}
                            </CommonBtn>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default Monsters;
