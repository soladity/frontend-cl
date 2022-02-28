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
            // setBuyTax(((await getFee(feeHandlerContract, 2)) / 100).toFixed(0));
            // setSellTax(
            //     ((await getFee(feeHandlerContract, 3)) / 100).toFixed(0)
            // );
            setBuyTax('2')
            setSellTax('8')
            setDamageReduction(
                ((await getFee(feeHandlerContract, 2)) / 100).toFixed(0)
            );
            setSummonFee(await getFee(feeHandlerContract, 3));
            setSuppliesFee14(await getFee(feeHandlerContract, 4));
            setSuppliesFee28(await getFee(feeHandlerContract, 5));
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
                    {getTranslation("marketplaceTax")}:<span className="legionOrangeColor"> {marketplaceTax}%</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("huntTax")}:<span className="legionOrangeColor"> {huntTax}%</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("buyTax")}:<span className="legionOrangeColor"> {buyTax}%</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("sellTax")}:<span className="legionOrangeColor"> {sellTax}%</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("legionDamagePerHunt")}:<span className="legionOrangeColor"> {damageReduction}%</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("summoningFee")}:<span className="legionOrangeColor"> {summonFee}$</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("SuppliesFee14Hunts")}:<span className="legionOrangeColor"> {suppliesFee14}$</span>
                </Typography>
                <Typography
                    className="legionFontColor"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                >
                    {getTranslation("SuppliesFee28Hunts")}:<span className="legionOrangeColor"> {suppliesFee28}$</span>
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
                    {getTranslation("RewardPool")}:&nbsp;
                    <CircleIcon style={{ color: "lime", fontSize: 16 }} />{" "}
                    &nbsp;<span className="legionOrangeColor">Healthy</span>
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
                    {getTranslation("ReservePool")}:&nbsp;
                    <CircleIcon style={{ color: "lime", fontSize: 16 }} />{" "}
                    &nbsp;<span className="legionOrangeColor">Healthy</span>
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
                    {getTranslation("LiquidityPool")}:&nbsp;
                    <CircleIcon style={{ color: "lime", fontSize: 16 }} />{" "}
                    &nbsp;<span className="legionOrangeColor">Healthy</span>
                </Typography>
            </Box>
        </Card>
    );
};

export default NadodoWatch;
