import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import { formatNumber, toCapitalize } from "../../utils/common";
import { getTranslation } from "../../utils/translation";
import {
  getCanAttackMonster25,
  getWarriorCountForMonster25,
} from "../../hooks/contractFunction";
import { useLegion } from "../../hooks/useContract";
import { useWeb3React } from "@web3-react/core";

type CardProps = {
  name: string;
  image: string;
  minAP: string;
  base: string;
  bonus: string;
  price: string;
  tokenID: number;
  isHuntable: boolean;
  BUSDReward: number;
  handleHunt: (monsterID: number) => void;
};

export const MonsterCard: React.FC<CardProps> = function MonsterCard({
  name,
  image,
  minAP,
  base,
  bonus,
  price,
  tokenID,
  isHuntable,
  BUSDReward,
  handleHunt,
}) {
  const [loaded, setLoaded] = React.useState(false);

  const [canHuntMonster25, setCanHuntMonster25] = React.useState(false);
  const [warriorCnt, setWarriorCnt] = React.useState(0);
  const [warriorBaseCnt, setWarriorBaseCnt] = React.useState(0);

  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const legionContract = useLegion();
  const { account } = useWeb3React();

  const getBalance = async () => {
    setCanHuntMonster25(
      (await getCanAttackMonster25(legionContract, account)).status
    );
    setWarriorCnt((await getCanAttackMonster25(legionContract, account)).count);
    setWarriorBaseCnt(await getWarriorCountForMonster25(legionContract));
  };

  React.useEffect(() => {
    if (tokenID === 25) {
      getBalance();
    }
  }, []);

  return (
    <Card sx={{ position: "relative", textAlign: "center" }}>
      <Grid
        container
        direction="column"
        spacing={2}
        sx={{ fontWeight: "800", color: "darkgrey" }}
        alignItems="center"
      >
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "white" }}>
            #{tokenID} {toCapitalize(name)}
          </Typography>
        </Grid>
        <Grid container spacing={2} sx={{ justifyContent: "space-around" }}>
          <Grid item>
            <Typography variant="h6" sx={{ textTransform: "uppercase" }}>
              {getTranslation("min")} AP
            </Typography>
            <Typography variant="h6">{minAP}</Typography>
          </Grid>
          {tokenID !== 25 && (
            <Grid item>
              <Typography variant="h6">{getTranslation("base")} %</Typography>
              <Typography variant="h6">{base}</Typography>
            </Grid>
          )}
          <Grid item>
            <Typography variant="h6">
              {tokenID === 25
                ? getTranslation("unlockStatus")
                : getTranslation("bonus") + "%"}
            </Typography>
            <Typography variant="h6">
              {tokenID === 25
                ? `${warriorCnt}/${warriorBaseCnt} ${getTranslation(
                    "warriorsUsed"
                  )}`
                : parseInt(bonus)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <CardMedia
        component="img"
        image={image}
        alt="Monster Image"
        loading="lazy"
        onLoad={handleImageLoaded}
      />
      {loaded === false && (
        <React.Fragment>
          <Skeleton variant="rectangular" width="100%" height="350px" />
          <Skeleton />
          <Skeleton width="80%" />
          <Skeleton width="60%" />
        </React.Fragment>
      )}
      <Grid
        container
        sx={
          tokenID === 25
            ? {
                position: "absolute",
                bottom: "0px",
                color: "white",
                fontWeight: "bold",
                justifyContent: "space-around",
                background: "#333",
                paddingTop: 1,
                paddingBottom: 1,
              }
            : {
                position: "absolute",
                bottom: "15px",
                color: "white",
                fontWeight: "bold",
                justifyContent: "space-around",
              }
        }
        alignItems="unset"
      >
        <Grid item>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {Math.round(parseInt(base) + parseInt(bonus)) > 89
              ? 89
              : (parseInt(base) + parseInt(bonus)).toFixed(0)}
            % {getTranslation("toWin")}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {formatNumber(price)} $BLST
          </Typography>
          <Typography
            sx={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}
          >
            (= {formatNumber(BUSDReward)} USD)
          </Typography>
        </Grid>
        <Grid item>
          {/* c94f19 */}
          <Button
            variant="outlined"
            disabled={
              tokenID === 25 ? !isHuntable || !canHuntMonster25 : !isHuntable
            }
            onClick={() => handleHunt(tokenID)}
          >
            {getTranslation("hunt")}
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};
