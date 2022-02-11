import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import { toCapitalize } from "../../utils/common";
import { getTranslation } from "../../utils/translation";
import CommonBtn from "../../component/Buttons/CommonBtn";

type CardProps = {
  name: string;
  image: string;
  minAP: string;
  base: string;
  bouns: string;
  price: string;
  tokenID: number;
  isHuntable: boolean;
  handleHunt: (monsterID: number) => void;
};

export const MonsterCard: React.FC<CardProps> = function MonsterCard({
  name,
  image,
  minAP,
  base,
  bouns,
  price,
  tokenID,
  isHuntable,
  handleHunt,
}) {
  const [loaded, setLoaded] = React.useState(false);

  const handleImageLoaded = () => {
    setLoaded(true);
  };

  console.log(isHuntable);

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
          <Typography variant="h4" sx={{ fontWeight: "1200", color: "white" }}>
            #{tokenID} {toCapitalize(name)}
          </Typography>
        </Grid>
        <Grid container spacing={2} sx={{ justifyContent: "space-around" }}>
          <Grid item>
            <Typography variant="h6">MIN AP</Typography>
            <Typography variant="h6">{minAP}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">Base %</Typography>
            <Typography variant="h6">{base}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">Bonus %</Typography>
            <Typography variant="h6">{parseInt(bouns).toFixed(1)}</Typography>
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
        sx={{
          position: "absolute",
          bottom: "15px",
          color: "white",
          fontWeight: "bold",
          justifyContent: "space-around",
        }}
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h5" sx={{ fontWeight: "1200" }}>
            {Math.round(parseInt(base) + parseFloat(bouns))}% to win
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" sx={{ fontWeight: "1200" }}>
            {price} $BLST
          </Typography>
        </Grid>
        <Grid item>
          <CommonBtn
            variant="outlined"
            disabled={!isHuntable}
            onClick={() => handleHunt(tokenID)}
          >
            {getTranslation("hunt")}
          </CommonBtn>
        </Grid>
      </Grid>
    </Card>
  );
};
