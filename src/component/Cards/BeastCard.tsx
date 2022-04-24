import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { makeStyles } from "@mui/styles";
import "./card.css";
import classNames from "classnames";
import { Checkbox } from "@mui/material";

type CardProps = {
  id: string;
  image: string;
  type: string;
  capacity: string;
  strength?: string;
  isMobile?: boolean;
  handleOpenSupply: Function;
  handleExecute: Function;
  needButton?: boolean;
  executeStatus?: boolean;
  setExecuteStatus: Function;
};

export default function BeastCard(props: CardProps) {
  const {
    id,
    image,
    type,
    capacity,
    strength,
    handleOpenSupply,
    handleExecute,
    isMobile,
    needButton = true,
    executeStatus = false,
    setExecuteStatus,
  } = props;

  const [loaded, setLoaded] = React.useState(false);

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
      sx={
        needButton
          ? {
              position: "relative",
              width: "100%",
              fontSize: isMobile ? 10 : 14,
              "&:hover": {
                boxShadow:
                  "rgba(80, 60, 100, 0.4) 5px 5px, rgba(80, 60, 100, 0.3) 10px 10px, rgba(80, 60, 100, 0.2) 15px 15px, rgba(80, 60, 100, 0.1) 20px 20px !important",
              },
            }
          : {
              position: "relative",
              width: "100%",
              fontSize: isMobile ? 10 : 14,
            }
      }
      className={classNames({ executeitem: executeStatus }, "beastCard")}
      // onClick={() => setExecuteStatus(id)}
    >
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
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          position: "absolute",
          top: "2%",
          justifyContent: "space-between",
          width: "96%",
          paddingLeft: "2%",
        }}
      >
        <Typography
          sx={{
            fontSize: needButton ? 14 : 10,
            fontWeight: "bold",
          }}
        >
          {type}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          <img
            src="/assets/images/sword.png"
            style={{
              height: `${needButton ? "20px" : "15px"}`,
              marginRight: "10%",
            }}
            alt="Sword"
          />
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: needButton ? 20 : isMobile ? 10 : 16,
              textShadow:
                "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
            }}
          >
            {capacity}
          </Typography>
        </Box>
      </Box>
      {needButton && (
        <>
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              bottom: "2%",
              right: "5%",
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
          <Checkbox
            sx={
              executeStatus
                ? {
                    opacity: 1,
                  }
                : {}
            }
            className="executeCheckBox"
            checked={executeStatus}
            onClick={() => setExecuteStatus(id)}
          />
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
