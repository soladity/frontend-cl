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
import { getTranslation } from "../../utils/translation";
import { FaGrinBeam } from "react-icons/fa";
import CircleIcon from "@mui/icons-material/Circle";
import { useFeeHandler } from "../../hooks/useContract";
import { getFee } from "../../hooks/contractFunction";

const NadodoWatch = () => {
    const [marketplaceTax, setMarketplaceTax] = React.useState("0");
    const [huntTax, setHuntTax] = React.useState("0");
    const [buyTax, setBuyTax] = React.useState("0");
    const [sellTax, setSellTax] = React.useState("0");
    const [damageReduction, setDamageReduction] = React.useState("0");
    const [summonFee, setSummonFee] = React.useState("0");
    const [suppliesFee14, setSuppliesFee14] = React.useState("0");
    const [suppliesFee28, setSuppliesFee28] = React.useState("0");
    const feeHandlerContract = useFeeHandler();

    const getFeeValues = async () => {
        try {
            setMarketplaceTax(
                ((await getFee(feeHandlerContract, 0)) / 100).toFixed(0)
            );
            setHuntTax(
                ((await getFee(feeHandlerContract, 1)) / 100).toFixed(0)
            );
            setBuyTax(((await getFee(feeHandlerContract, 2)) / 100).toFixed(0));
            setSellTax(
                ((await getFee(feeHandlerContract, 3)) / 100).toFixed(0)
            );
            setDamageReduction(
                ((await getFee(feeHandlerContract, 4)) / 100).toFixed(0)
            );
            setSummonFee(await getFee(feeHandlerContract, 5));
            setSuppliesFee14(await getFee(feeHandlerContract, 6));
            setSuppliesFee28(await getFee(feeHandlerContract, 7));
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        getFeeValues();
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
                    {getTranslation("nadodoWatching")}
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("marketplaceTax")}: {marketplaceTax}%
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("huntTax")}: {huntTax}%
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("buyTax")}: {buyTax}%
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("sellTax")}: {sellTax}%
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("legionDamagePerHunt")}: {damageReduction}%
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("summoningFee")}: {summonFee}$
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("SuppliesFee14Hunts")}: {suppliesFee14}$
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("SuppliesFee28Hunts")}: {suppliesFee28}$
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <span>{getTranslation("RewardPool")}:&nbsp;</span>
                    <CircleIcon style={{ color: "lime", fontSize: 16 }} />{" "}
                    <span>&nbsp;Healthy</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <span>{getTranslation("ReservePool")}:&nbsp;</span>
                    <CircleIcon style={{ color: "lime", fontSize: 16 }} />{" "}
                    <span>&nbsp;Healthy</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <span>{getTranslation("LiquidityPool")}:&nbsp;</span>
                    <CircleIcon style={{ color: "lime", fontSize: 16 }} />{" "}
                    <span>&nbsp;Healthy</span>
                </Typography>
            </Box>
        </Card>
    );
};

export default NadodoWatch;
