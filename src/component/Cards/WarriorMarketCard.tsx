import * as React from "react";
import { Box, Typography, Card, CardMedia, IconButton, Skeleton } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";

import CommonBtn from "../../component/Buttons/CommonBtn";
import { formatNumber } from "../../utils/common";

type CardProps = {
  id: string;
  image: string;
  type: string;
  power: string;
  strength?: string;
  owner: boolean;
  price: string;
  handleCancel: Function;
  handleBuy: Function;
  handleUpdate: Function;
};

export default function WarriorMarketCard(props: CardProps) {
  const {
    id,
    image,
    type,
    power,
    strength,
    owner,
    price,
    handleCancel,
    handleBuy,
    handleUpdate
  } = props;

  const [loaded, setLoaded] = React.useState(false);

  let itemList = [];
  for (let i = 0; i < parseInt(strength !== undefined ? strength : "0"); i++) {
    itemList.push(
      <img
        key={i}
        src="/assets/images/bloodstoneGrey.png"
        style={{ height: "30px" }}
        alt="icon"
      />
    );
  }

  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const cancel = (id: string) => {
    handleCancel(parseInt(id));
  };

  const buy = (id: string) => {
    handleBuy(parseInt(id));
  };

  const update = (id: string) => {
    handleUpdate(parseInt(id));
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Card sx={{ position: "relative", width: "100%" }}>
        <CardMedia
          component="img"
          image={image}
          alt="Warrior Image"
          loading="lazy"
          onLoad={handleImageLoaded}
        />
        {loaded === false && (
          <React.Fragment>
            <Skeleton variant="rectangular" width="100%" height="200px" />
            <Skeleton />
            <Skeleton width="60%" />
          </React.Fragment>
        )}
        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            top: "15px",
            left: "20px",
            fontWeight: "bold",
          }}
        >
          {type}
        </Typography>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            alignItems: "center",
            top: "15px",
            right: "10px",
            fontWeight: "bold",
          }}
        >
          {itemList}
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            alignItems: "center",
            bottom: "10px",
            left: "calc(50% - 40px)",
            fontWeight: "bold",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontSize: "1.4rem",
              textShadow:
                "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
            }}
          >
            {formatNumber(power)} AP
          </Typography>
        </Box>
        {owner === true && (
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              bottom: "15px",
              right: "20px",
              cursor: "pointer",
            }}
            onClick={() => cancel(id)}
          >
            <img
              src="/assets/images/execute.png"
              style={{ height: "20px" }}
              alt="Cancel"
            />
          </Box>
        )}
        <Typography
          variant="subtitle2"
          sx={{
            position: "absolute",
            bottom: "15px",
            left: "20px",
            color: "darkgrey",
          }}
        >
          #{id}
        </Typography>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            bottom: "35px",
            left: "20px",
            cursor: "pointer",
          }}
        >
          <IconButton
            aria-label="claim"
            component="span"
            sx={{ padding: 0 }}
            onClick={() => update(id)}
          >
            <CachedIcon />
          </IconButton>
        </Box>
      </Card>
      {owner === false && (
        <CommonBtn
          sx={{ fontWeight: "bold", marginTop: "10px", fontSize: "1rem" }}
          onClick={() => buy(id)}
        >
          {price} $BLST
        </CommonBtn>
      )}
    </Box>
  );
}
