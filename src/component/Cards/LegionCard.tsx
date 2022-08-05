import * as React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  ButtonGroup,
  Button,
  IconButton,
  Skeleton,
  Tooltip,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useWeb3React } from "@web3-react/core";

import {
  useBeast,
  useLegion,
  useWarrior,
  useWeb3,
} from "../../hooks/useContract";
import {
  getBeastToken,
  getLegionLastHuntTime,
  getWarriorToken,
} from "../../hooks/contractFunction";
import { formatNumber } from "../../utils/common";
import { getTranslation } from "../../utils/translation";
import Tutorial from "../Tutorial/Tutorial";

type CardProps = {
  id: string;
  image: string;
  name: string;
  beasts: Array<number>;
  warriors: Array<number>;
  supplies: string;
  attackPower: number;
  huntStatus: string;
  handleOpenSupply: Function;
  handleUpdate: Function;
  handleOpenShopping: Function;
  index: number;
};

export default function LegionCard(props: CardProps) {
  const {
    id,
    image,
    name,
    beasts,
    warriors,
    supplies,
    attackPower,
    huntStatus,
    handleOpenSupply,
    handleUpdate,
    handleOpenShopping,
    index,
  } = props;
  const { account } = useWeb3React();

  const [loaded, setLoaded] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [showWarrior, setShowWarrior] = React.useState(true);
  const [beastList, setBeastList] = React.useState(Array);
  const [warriorList, setWarriorList] = React.useState(Array);
  const [totalWarrior, setTotalWarrior] = React.useState(0);
  const [lastHuntTime, setLastHuntTime] = React.useState(0);

  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const legionContract = useLegion();
  const web3 = useWeb3();

  React.useEffect(() => {
    getBalance();
  }, [beasts, warriors]);

  const getBalance = async () => {
    try {
      const lastHuntTime = await getLegionLastHuntTime(
        web3,
        legionContract,
        id
      );
      console.log("lastHuntTime -------- ", lastHuntTime);
      setLastHuntTime(lastHuntTime);
      let beast;
      let tempBeasts = [];
      let capacity = 0;
      for (let i = 0; i < beasts.length; i++) {
        beast = await getBeastToken(web3, beastContract, beasts[i]);
        tempBeasts.push({ ...beast, id: beasts[i] });
        capacity = capacity + parseInt(beast.capacity);
      }
      setTotalWarrior(capacity);
      setBeastList(tempBeasts);
      let warrior;
      let tempWarriors = [];
      let itemList = [];
      for (let i = 0; i < warriors.length; i++) {
        itemList = [];
        warrior = await getWarriorToken(web3, warriorContract, warriors[i]);
        for (let j = 0; j < warrior.strength; j++) {
          itemList.push(
            <img
              key={j}
              src="/assets/images/bloodstoneGrey.png"
              style={{ height: "15px" }}
              alt="icon"
            />
          );
        }
        tempWarriors.push({ ...warrior, id: warriors[i], item: itemList });
      }
      setWarriorList(tempWarriors);
    } catch (error) {}
  };

  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const open = (id: string, warriorCnt: number) => {
    handleOpenSupply(parseInt(id), warriorCnt);
  };

  const openShopping = (id: string) => {
    handleOpenShopping(parseInt(id));
  };

  const is24Hour = () => {
    if (new Date().getTime() - lastHuntTime * 1000 <= 24 * 3600 * 1000) {
      return false;
    }
    return true;
  };

  return (
    <Card sx={{ position: "relative", height: "100%" }}>
      {show === false && (
        <CardMedia
          component="img"
          image={image}
          alt="Legion Image"
          loading="lazy"
          onLoad={handleImageLoaded}
        />
      )}
      {loaded === false && (
        <React.Fragment>
          <Skeleton variant="rectangular" width="100%" height="200px" />
          <Skeleton />
          <Skeleton width="60%" />
        </React.Fragment>
      )}
      {show === true && (
        <CardContent sx={{ pt: 6, pb: 12 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <ButtonGroup variant="outlined" color="primary" sx={{ pt: 1 }}>
                <Button
                  variant={showWarrior ? "contained" : "outlined"}
                  onClick={() => {
                    setShowWarrior(!showWarrior);
                  }}
                >
                  {getTranslation("warriors")}
                </Button>
                <Button
                  variant={!showWarrior ? "contained" : "outlined"}
                  onClick={() => {
                    setShowWarrior(!showWarrior);
                  }}
                >
                  {getTranslation("beasts")}
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
          <Grid container spacing={1} sx={{ pt: 2 }}>
            {showWarrior
              ? warriorList.map((item: any, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Box
                      sx={{
                        backgroundColor: "black",
                        padding: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle2">{item.type}</Typography>
                        <Typography variant="subtitle2">#{item.id}</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle2">
                          {formatNumber(item.power)} AP
                        </Typography>
                        <Box>{item.item}</Box>
                      </Box>
                    </Box>
                  </Grid>
                ))
              : beastList.map((item: any, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Box
                      sx={{
                        backgroundColor: "black",
                        padding: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle2">{item.type}</Typography>
                        <Typography variant="subtitle2">#{item.id}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle2">
                          {item.capacity}
                        </Typography>
                        <img
                          src="/assets/images/sword.png"
                          style={{ height: "15px", marginLeft: "5px" }}
                          alt="Sword"
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
          </Grid>
        </CardContent>
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
        {name}
      </Typography>
      {index == 0 ? (
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            alignItems: "center",
            top: "15px",
            right: "10px",
            fontWeight: "bold",
            cursor: "pointer",
            color:
              huntStatus === "green"
                ? "green"
                : huntStatus === "orange"
                ? "orange"
                : "red",
          }}
          onClick={() => open(id, warriors.length)}
          id="first-legion-add-supply"
        >
          <Tutorial curStep={15} placement="top-end">
            <div>
              {supplies} {getTranslation("hSymbol")}
            </div>
          </Tutorial>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            alignItems: "center",
            top: "15px",
            right: "10px",
            fontWeight: "bold",
            cursor: "pointer",
            color:
              huntStatus === "green"
                ? "green"
                : huntStatus === "orange"
                ? "orange"
                : "red",
          }}
          onClick={() => open(id, warriors.length)}
        >
          {supplies} {getTranslation("hSymbol")}
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          alignItems: "center",
          bottom: "40px",
          left: "calc(50% - 55px)",
          fontWeight: "bold",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: "0.8rem",
            fontWeight: "600",
            textShadow:
              "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
          }}
        >
          W {warriors.length} / {totalWarrior}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B{" "}
          {beasts.length}
        </Typography>
        <Box
          sx={{
            display: "flex",
            cursor: "pointer",
            ml: 2,
          }}
        >
          {show === false ? (
            <IconButton
              aria-label="claim"
              component="span"
              sx={{ padding: 0 }}
              onClick={() => {
                setShow(!show);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          ) : (
            <IconButton
              aria-label="claim"
              component="span"
              sx={{ padding: 0 }}
              onClick={() => {
                setShow(!show);
              }}
            >
              <VisibilityOffIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          alignItems: "center",
          bottom: "10px",
          left: "calc(50% - 50px)",
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
          {formatNumber(attackPower)} AP
        </Typography>
      </Box>
      {attackPower >= 2000 && (
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            bottom: "10px",
            right: "20px",
            cursor: "pointer",
          }}
          onClick={() => huntStatus !== "orange" && openShopping(id)}
        >
          {huntStatus !== "orange" && is24Hour() ? (
            <img
              src="/assets/images/shopping.png"
              style={{ height: "20px" }}
              alt="Shopping"
            />
          ) : (
            <Tooltip
              title="Wait 24 hours after hunting to sell your legion"
              placement="left"
            >
              <img
                src="/assets/images/shoppingRed.png"
                style={{ height: "20px" }}
                alt="Shopping"
              />
            </Tooltip>
          )}
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          bottom: "30px",
          left: "20px",
          cursor: "pointer",
        }}
      >
        <IconButton
          aria-label="claim"
          component="span"
          sx={{ padding: 0 }}
          onClick={() => handleUpdate(id)}
        >
          <CachedIcon />
        </IconButton>
      </Box>
      <Typography
        variant="subtitle2"
        sx={{
          position: "absolute",
          bottom: "8px",
          left: "20px",
          color: "darkgrey",
        }}
      >
        #{id}
      </Typography>
    </Card>
  );
}
