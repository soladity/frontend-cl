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
import { useBloodstone, useFeeHandler } from "../../hooks/useContract";
import {
  getFee,
  feeDenominator,
  buyTaxLiquidity,
  buyTaxReward,
  sellTaxDev,
  sellTaxLiquidity,
  sellTaxReward,
  getSummoningPrice,
  getSupplyCost
} from "../../hooks/contractFunction";

const NadodoWatch = () => {
  const [marketplaceTax, setMarketplaceTax] = React.useState("0");
  const [huntTax, setHuntTax] = React.useState("0");
  const [buyTax, setBuyTax] = React.useState(0);
  const [sellTax, setSellTax] = React.useState(0);
  const [damageReduction, setDamageReduction] = React.useState("0");
  const [summonFee, setSummonFee] = React.useState(0);
  const [suppliesFee14, setSuppliesFee14] = React.useState(0);
  const [suppliesFee28, setSuppliesFee28] = React.useState(0);
  const feeHandlerContract = useFeeHandler();
  const bloodstoneContract = useBloodstone()

  const getFeeValues = async () => {
    try {
      setMarketplaceTax(
        ((await getFee(feeHandlerContract, 0)) / 100).toFixed(0)
      );
      setHuntTax(((await getFee(feeHandlerContract, 1)) / 100).toFixed(1));


      const feeDenominatorVal = await feeDenominator(bloodstoneContract);
      const buyTaxLiquidityVal = await buyTaxLiquidity(bloodstoneContract);
      const buyTaxRewardVal = await buyTaxReward(bloodstoneContract);
      const sellTaxDevVal = await sellTaxDev(bloodstoneContract);
      const sellTaxLiquidityVal = await sellTaxLiquidity(bloodstoneContract);
      const sellTaxRewardVal = await sellTaxReward(bloodstoneContract);

      setBuyTax((parseInt(buyTaxLiquidityVal) + parseInt(buyTaxRewardVal)) / parseInt(feeDenominatorVal) * 100);
      setSellTax((parseInt(sellTaxLiquidityVal) + parseInt(sellTaxRewardVal) + parseInt(sellTaxDevVal)) / parseInt(feeDenominatorVal) * 100);

      setDamageReduction(
        ((await getFee(feeHandlerContract, 2)) / 100).toFixed(0)
      );
      setSummonFee(await getSummoningPrice(feeHandlerContract, 1));
      setSuppliesFee14(await getSupplyCost(feeHandlerContract, 1, 14));
      setSuppliesFee28(await getSupplyCost(feeHandlerContract, 1, 28));
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
          {getTranslation("marketplaceTax")}:
          <span className="legionOrangeColor"> {marketplaceTax}%</span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {getTranslation("huntTax")}:
          <span className="legionOrangeColor"> {huntTax}%</span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {getTranslation("buyTax")}:
          <span className="legionOrangeColor"> {buyTax}%</span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {getTranslation("sellTax")}:
          <span className="legionOrangeColor"> {sellTax}%</span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {getTranslation("legionDamagePerHunt")}:
          <span className="legionOrangeColor"> {damageReduction}%</span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {getTranslation("summoningFee")}:
          <span className="legionOrangeColor"> {(summonFee / Math.pow(10, 18)).toFixed(2)} $BLST</span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {getTranslation("SuppliesFee14Hunts")}:
          <span className="legionOrangeColor"> {(suppliesFee14 / Math.pow(10, 18)).toFixed(2)} $BLST</span>
        </Typography>
        <Typography
          className="legionFontColor"
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {getTranslation("SuppliesFee28Hunts")}:
          <span className="legionOrangeColor"> {(suppliesFee28 / Math.pow(10, 18)).toFixed(2)} $BLST</span>
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
          <CircleIcon style={{ color: "lime", fontSize: 16 }} /> &nbsp;
          <span className="legionOrangeColor">{getTranslation("healthy")}</span>
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
          <CircleIcon style={{ color: "lime", fontSize: 16 }} /> &nbsp;
          <span className="legionOrangeColor">{getTranslation("healthy")}</span>
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
          <CircleIcon style={{ color: "lime", fontSize: 16 }} /> &nbsp;
          <span className="legionOrangeColor">{getTranslation("healthy")}</span>
        </Typography>
      </Box>
    </Card>
  );
};

export default NadodoWatch;
