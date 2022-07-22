import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Input,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState, useEffect, ChangeEvent } from "react";
import { MdClose } from "react-icons/md";
import { getTranslation } from "../../utils/translation";
import Axios from "axios";
import { formatNumber } from "../../utils/common";
import { useWeb3React } from "@web3-react/core";
import { Spinner } from "../../component/Buttons/Spinner";

const useStyles = makeStyles({
  learderBoard: {
    border: "3px solid #f66810",
    borderRadius: 5,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#16161699",
  },
});

type IUser = {
  wallet: String;
  totalAP: number;
  totalWonBUSD: number;
};

const Leaderboard: React.FC = () => {
  const { account } = useWeb3React();

  const classes = useStyles();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [userList, setUserList] = useState<IUser[]>([]);
  const [telegram, setTelegram] = useState("");

  const onChangeCheck = (e: any) => {
    if (!isChecked) {
      setIsAddDialogOpen(true);
      setIsChecked(e.target.checked);
    } else {
      setIsRemoveDialogOpen(true);
    }
  };

  const handleRemoveUser = async () => {
    setIsRemoving(true);
    try {
      await Axios.post("http://localhost:8080/api/v1/leaderboard/remove", {
        wallet: account?.toLowerCase(),
      });
      await getBalance("all");
      setIsRemoveDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
    setIsRemoving(false);
  };

  const handleAddUser = async () => {
    setIsAdding(true);
    try {
      await Axios.post("http://localhost:8080/api/v1/leaderboard/create", {
        wallet: account?.toLowerCase(),
        telegram: telegram,
      });
      await getBalance("all");
      setIsAddDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
    setIsAdding(false);
  };

  const handleRemoveDialogClose = () => {
    setIsRemoveDialogOpen(false);
  };

  const handleDialogClose = () => {
    setIsChecked(false);
    setIsAddDialogOpen(false);
  };

  const getBalance = async (type: string) => {
    try {
      if (type !== "init") {
        await Axios.post("http://localhost:8080/api/v1/leaderboard/setLeaders");
      }
      const res = await Axios.post(
        "http://localhost:8080/api/v1/leaderboard/getLeaders",
        {
          pageSize: 3,
          currentPage: 0,
        }
      );
      const { data } = res.data;
      if (
        data.filter((item: any) => item.wallet === account?.toLowerCase())
          .length > 0
      ) {
        setIsChecked(true);
      } else {
        setIsChecked(false);
      }
      setUserList(
        data.map((item: any) => {
          return {
            wallet: item.wallet,
            totalAP: item.totalAP,
            totalWonBUSD: item.totalWonBUSD,
          };
        })
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBalance("init");
  }, []);

  return (
    <Box>
      <Box sx={{ width: "100%", mb: 4, position: "relative" }}>
        <Box sx={{ position: "absolute" }}></Box>
        <Grid spacing={2} container>
          <Grid item md={3} sm={0} xs={0}></Grid>
          <Grid item md={6} sm={12} xs={12}>
            <Box className={classes.learderBoard}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  borderBottom: "1px solid #fff",
                  marginBottom: 3,
                }}
              >
                {getTranslation("leaderboard")}
              </Typography>

              <Box>
                <Grid spacing={2} container className="">
                  <Grid item xs={3}>
                    Rank
                  </Grid>
                  <Grid item xs={3}>
                    Wallet
                  </Grid>
                  <Grid item xs={3}>
                    Total AP
                  </Grid>
                  <Grid item xs={3}>
                    Total Won
                  </Grid>
                </Grid>
                {userList.map((user, index) => (
                  <Grid
                    spacing={2}
                    container
                    className="legionFontColor"
                    key={index}
                  >
                    <Grid item xs={3}>
                      #{index + 1}
                    </Grid>
                    <Grid item xs={3}>
                      {user["wallet"]?.substr(0, 3) +
                        "..." +
                        user["wallet"]?.substr(user["wallet"]?.length - 1, 1)}
                    </Grid>
                    <Grid item xs={3}>
                      {formatNumber(Math.floor(user.totalAP))}
                    </Grid>
                    <Grid item xs={3}>
                      ${formatNumber(Math.floor(user.totalWonBUSD))}
                    </Grid>
                  </Grid>
                ))}
                <Box sx={{ mt: 2 }}>
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => onChangeCheck(e)}
                  />{" "}
                  Click here to participate in the Leaderboard and win big
                  prizes
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item md={3} sm={0} xs={0}></Grid>
        </Grid>
      </Box>
      <Dialog open={isRemoveDialogOpen}>
        <DialogContent>
          Do you want to remove your info from LeaderBoard?
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => handleRemoveDialogClose()}
            variant="contained"
            sx={{ color: "white", fontWeight: "bold" }}
            disabled={isRemoving}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleRemoveUser()}
            variant="outlined"
            sx={{ fontWeight: "bold" }}
            disabled={isRemoving}
          >
            {isRemoving ? <Spinner color="white" size={24} /> : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isAddDialogOpen}>
        <DialogTitle>
          <MdClose
            style={{
              position: "absolute",
              right: 8,
              top: 8,
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => handleDialogClose()}
          ></MdClose>
        </DialogTitle>
        <DialogContent>
          <Box>
            Your wallet has been added to the Leaderboard competition.
            <br />
            Every two weeks, the top 3 wallets win a 20,000 AP legion, and any
            random wallet who accepter to be listed on the Leaderboard wins a
            10,000 AP legion.
            <br />
            Enter your Telegram name so we can keep you posted if you win the
            random draw or one of the top 3 prizes:
            <br />
            <br />
            <Input
              placeholder="TG Name"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
            />
            <br />
            <br />
            <Button
              variant="contained"
              disabled={isAdding}
              onClick={() => handleAddUser()}
            >
              I want to win, sign me up.{" "}
              {isAdding && <Spinner color="white" size={20} />}
            </Button>
            <br />
            <br />
            <br />
            <span style={{ fontSize: 12 }}>
              Your Telegram name will stay private and secure, will never be
              shared, and you will only be potentially contacted by the
              founder/dev Danny from @ItsDannyH.
            </span>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Leaderboard;
