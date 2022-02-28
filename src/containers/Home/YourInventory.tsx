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
import { formatNumber } from "../../utils/common";

import { useWeb3React } from "@web3-react/core";
import {
    getBloodstoneBalance,
    getBeastBalance,
    getWarriorBalance,
    getUnclaimedUSD,
    getAvailableLegionsCount,
    getTaxLeftDays,
    getMaxAttackPower,
    getLegionTokenIds,
    getLegionToken,
    getLegionLastHuntTime,
} from "../../hooks/contractFunction";
import {
    useBloodstone,
    useBeast,
    useWarrior,
    useLegion,
    useRewardPool,
    useWeb3,
} from "../../hooks/useContract";
import { useSelector } from "react-redux";
import { getTranslation } from "../../utils/translation";

const YourInventory = () => {
    const { reloadContractStatus } = useSelector(
        (state: any) => state.contractReducer
    );

    const [beastBalance, setBeastBalance] = React.useState(0);
    const [warriorBalance, setWarriorBalance] = React.useState(0);
    const [unclaimedBalance, setUnclaimedBalance] = React.useState("0");
    const [availableLegionCount, setAvailableLegionCount] = React.useState(0);
    const [legionTokenIds, setLegionTokenIds] = React.useState([]);
    const [taxLeftDays, setTaxLeftDays] = React.useState(0);
    const [maxAttackPower, setMaxAttackPower] = React.useState("0");
    const [BLSTBalance, setBLSTBalance] = React.useState("0");
    const [firstHuntTime, setFirstHuntTime] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(new Date());

    //account
    const { account } = useWeb3React();
    const web3 = useWeb3();

    //Legion Contract
    const legionContract = useLegion();

    //Beast Contract
    const beastContract = useBeast();

    //Warrior Contract
    const warriorContract = useWarrior();

    //RewardPool Contract
    const rewardPoolContract = useRewardPool();

    //Bloodstone Contract
    const bloodstoneContract = useBloodstone();

    //get all balances of your inventory
    const getBalance = async () => {
        const beastBalance = await getBeastBalance(
            web3,
            beastContract,
            account
        );
        setBeastBalance(beastBalance);

        const warriorBalance = await getWarriorBalance(
            web3,
            warriorContract,
            account
        );
        setWarriorBalance(warriorBalance);

        const unclaimedBalance = await getUnclaimedUSD(
            web3,
            rewardPoolContract,
            account
        );
        setUnclaimedBalance(
            (parseFloat(unclaimedBalance) / Math.pow(10, 18)).toFixed(2)
        );

        const availableLegionCount = await getAvailableLegionsCount(
            web3,
            legionContract,
            account
        );
        setAvailableLegionCount(availableLegionCount);

        const legionTokenIds = await getLegionTokenIds(
            web3,
            legionContract,
            account
        );
        setLegionTokenIds(legionTokenIds);
        getLastHuntTimes(legionTokenIds);

        const taxLeftDays = await getTaxLeftDays(web3, legionContract, account);
        setTaxLeftDays(parseInt(taxLeftDays));

        const maxAttackPower = await getMaxAttackPower(
            web3,
            legionContract,
            account
        );
        setMaxAttackPower(maxAttackPower);

        const BLSTBalance = await getBloodstoneBalance(
            web3,
            bloodstoneContract,
            account
        );
        setBLSTBalance(BLSTBalance);
    };

    const getLastHuntTimes = async (legionTokenIds: any) => {
        var remainTimes = [];
        for (let i = 0; i < legionTokenIds.length; i++) {
            let legion = await getLegionToken(
                web3,
                legionContract,
                legionTokenIds[i]
            );
            if (legion.lastHuntTime != "0" && legion.supplies > 0) {
                remainTimes.push(parseInt(legion.lastHuntTime));
            }
        }
        if (remainTimes.length > 0) {
            var first = Math.min(...remainTimes);
            setFirstHuntTime(first);
        } else {
            setFirstHuntTime(0);
        }
    };

    const calcHuntTime = (firstHuntTime: any) => {
        var time = "~";
        if (firstHuntTime != 0) {
            var diff = currentTime.getTime() - firstHuntTime * 1000;
            if (diff / 1000 / 3600 >= 24) {
                time = "00s";
            } else {
                var totalSecs = parseInt(
                    ((24 * 1000 * 3600 - diff) / 1000).toFixed(2)
                );
                var hours = Math.floor(totalSecs / 3660).toFixed(0);
                var mins = ((totalSecs % 3600) / 60).toFixed(0);
                var secs = (totalSecs % 3600) % 60;
                if (parseInt(hours) > 0) {
                    time = `${hours}h ${mins}m ${secs}s`;
                } else if (parseInt(mins) > 0) {
                    time = `${mins}m ${secs}s`;
                } else {
                    time = `${secs}s`;
                }
            }
        }
        return time;
    };

    React.useEffect(() => {
        setTimeout(() => {
            setCurrentTime(new Date());
        }, 1000);
    }, [currentTime]);

    React.useEffect(() => {
        getBalance();
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
                    {getTranslation("yourInventory")}
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("warriors")}: <span className="legionOrangeColor">{warriorBalance}</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("beasts")}: <span className="legionOrangeColor">{beastBalance}</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("availableLegions")}: <span className="legionOrangeColor">{availableLegionCount}{" "}
                        / {legionTokenIds.length}</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("waitingTimeToHunt")}:<span className="legionOrangeColor">{" "}
                        {calcHuntTime(firstHuntTime)}</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("yourMaxAp")}:<span className="legionOrangeColor">{" "}
                        {formatNumber(
                            (parseFloat(maxAttackPower) / 100).toFixed(0)
                        )}</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("unClaimed")}:<span className="legionOrangeColor"> {unclaimedBalance}</span>
                </Typography>
                {parseInt(unclaimedBalance) > 0 && (
                    <Typography
                        className="legionFontColor"
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                    >
                        {getTranslation("claimTax")}:<span className="legionOrangeColor">{" "}
                            {(
                                (taxLeftDays * 2 * parseInt(unclaimedBalance)) /
                                100
                            ).toFixed(2)}{" "}
                            {getTranslation("claimTaxVal")}</span>
                    </Typography>
                )}
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("taxDaysLeft")}:<span className="legionOrangeColor"> {taxLeftDays}</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("BLSTInYourWallet")}:<span className="legionOrangeColor">{" "}
                        {formatNumber(parseFloat(BLSTBalance).toFixed(2))} ( = xx USD )</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    1 USD = <span className="legionOrangeColor">xx $BLST</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    1 BLST = <span className="legionOrangeColor">xx USD</span>
                </Typography>
            </Box>
        </Card>
    );
};

export default YourInventory;
