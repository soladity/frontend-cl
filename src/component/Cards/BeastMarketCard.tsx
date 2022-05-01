import * as React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Button,
  Skeleton,
} from "@mui/material";

import CommonBtn from "../../component/Buttons/CommonBtn";
import { formatNumber } from "../../utils/common";

type CardProps = {
  id: string;
  image: string;
  type: string;
  capacity: string;
  strength?: string;
  owner: boolean;
  price: string;
  badge: boolean;
  handleCancel: Function;
  handleBuy: Function;
  handleUpdate: Function;
};

export default function BeastMarketCard(props: CardProps) {
  const {
    id,
    image,
    type,
    capacity,
    owner,
    price,
    badge,
    handleCancel,
    handleBuy,
    handleUpdate,
  } = props;

  const [loaded, setLoaded] = React.useState(false);

  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const cancel = (id: string) => {
    handleCancel(parseInt(id));
  };

  const buy = (id: string, price: string) => {
    handleBuy(parseInt(id), parseInt(price));
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
          alt="Beast Image"
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
            right: "20px",
            fontWeight: "bold",
          }}
        >
          <img
            src="/assets/images/sword.png"
            style={{ height: "20px", marginRight: "10px" }}
            alt="Sword"
          />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {capacity}
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
        {
          badge === true &&
          <img 
            src="/assets/images/badge.png"
            style={{
              position: "absolute",
              bottom: "40px",
              left: "15px",
              height: '20px'
             }}
            alt="New Item"
          />
        }
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
      </Card>
      {owner === false ? (
        <CommonBtn
          sx={{ fontWeight: "bold", marginTop: "10px", fontSize: "1rem" }}
          onClick={() => buy(id, price)}
        >
          {formatNumber((parseFloat(price) / Math.pow(10, 18)).toFixed(2))} $BLST
        </CommonBtn>
      ) : (
        <Button
          variant="outlined"
          sx={{
            display: "flex",
            whiteSpace: "nowrap",
            mt: "10px",
            padding: "5px 16px",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
          onClick={() => update(id)}
        >
          {formatNumber((parseFloat(price) / Math.pow(10, 18)).toFixed(2))} $BLST
          <img
            src="/assets/images/updatePrice.png"
            style={{ height: "20px", marginLeft: "10px" }}
            alt="Update Price"
          />
        </Button>
      )}
    </Box>
  );
}
