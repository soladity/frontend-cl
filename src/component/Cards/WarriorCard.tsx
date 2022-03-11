import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

import { formatNumber } from "../../utils/common";

type CardProps = {
  id: string;
  image: string;
  type: string;
  power: string;
  strength?: string;
  isMobile?: boolean;
  handleOpenSupply: Function;
  handleExecute: Function;
  needButton?: boolean;
};

export default function WarriorCard(props: CardProps) {
  const {
    id,
    image,
    type,
    power,
    strength,
    isMobile,
    handleOpenSupply,
    handleExecute,
    needButton = true,
  } = props;

  const [loaded, setLoaded] = React.useState(false);

  let itemList = [];
  for (let i = 0; i < parseInt(strength !== undefined ? strength : "0"); i++) {
    itemList.push(
      <img
        key={i}
        src="/assets/images/bloodstoneGrey.png"
        style={{ height: needButton ? "30px" : "10px" }}
        alt="icon"
      />
    );
  }

  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const open = (id: string) => {
    handleOpenSupply(parseInt(id));
  };

  const execute = (id: string) => {
    handleExecute(parseInt(id));
  };

  return (
    <Card
      sx={{
        position: "relative",
        width: "100%",
        fontSize: isMobile ? 10 : 14,
      }}
    >
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
        sx={{
          fontSize: needButton ? 14 : 10,
          position: "absolute",
          top: "2%",
          left: "2%",
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
          top: "2%",
          right: "2%",
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
          bottom: "2%",
          width: "100%",
          justifyContent: "center",
          fontWeight: "bold",
        }}
      >
        <Typography
          sx={{
            fontSize: needButton ? 20 : isMobile ? 10 : 14,
            fontWeight: "bold",
            textShadow:
              "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
          }}
        >
          {formatNumber(power)}
        </Typography>
      </Box>
      {needButton && (
        <>
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              bottom: "2%",
              right: "2%",
              cursor: "pointer",
            }}
            onClick={() => open(id)}
          >
            <img
              src="/assets/images/shopping.png"
              style={{ height: "20px" }}
              alt="Shopping"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              bottom: "calc(2% + 20px)",
              left: "2%",
              cursor: "pointer",
            }}
            onClick={() => execute(id)}
          >
            <img
              src="/assets/images/execute.png"
              style={{ height: "20px" }}
              alt="Execute"
            />
          </Box>
        </>
      )}
      <Typography
        sx={{
          fontSize: isMobile ? 8 : 10,
          position: "absolute",
          bottom: "2%",
          left: "2%",
          color: "darkgrey",
        }}
      >
        #{id}
      </Typography>
    </Card>
  );
}
