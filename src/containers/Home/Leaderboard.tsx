import {
  Alert,
  AlertColor,
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
  Slide,
  SlideProps,
  Snackbar,
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
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { apiConfig } from "../../config";

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

type TransitionProps = Omit<SlideProps, "direction">;

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const Leaderboard: React.FC = () => {
  const { account } = useWeb3React();

  const classes = useStyles();

  const [isUpdateTGDialogOpen, setIsUpdateTGDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const [userList, setUserList] = useState<IUser[]>([]);
  const [telegram, setTelegram] = useState("");

  const [alertType, setAlertType] = useState<AlertColor | undefined>("success");
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const [openSnackBar, setOpenSnackBar] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(60);

  const onChangeCheck = (e: any) => {
    if (!isChecked) {
      handleAddUser();
    } else {
      setIsRemoveDialogOpen(true);
    }
  };

  const handleRemoveUser = async () => {
    setIsRemoving(true);
    try {
      let res = await Axios.post(
        `${apiConfig.leaderboard}api/v1/leaderboard/remove`,
        {
          wallet: account?.toLowerCase(),
        }
      );
      const { success, message } = res.data;
      setOpenSnackBar(true);
      setSnackBarMessage(message);
      if (!success) {
        setAlertType("error");
      } else {
        setAlertType("success");
      }
      await getBalance("init");
      setIsRemoveDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
    setIsRemoving(false);
  };

  const handleUpdateTGname = async () => {
    setIsSigning(true);
    try {
      let res = await Axios.post(
        `${apiConfig.leaderboard}api/v1/leaderboard/updateTGname`,
        {
          wallet: account?.toLowerCase(),
          telegram: telegram,
        }
      );
      let { message, success } = res.data;
      setOpenSnackBar(true);
      setSnackBarMessage(message);
      if (!success) {
        setAlertType("error");
      } else {
        setAlertType("success");
      }
      await getBalance("init");
      setIsUpdateTGDialogOpen(false);
    } catch (error) {}
    setIsSigning(false);
  };

  const handleAddUser = async () => {
    setIsAdding(true);
    try {
      let res = await Axios.post(
        `${apiConfig.leaderboard}api/v1/leaderboard/add`,
        {
          wallet: account?.toLowerCase(),
          telegram: telegram,
        }
      );
      let { message, success } = res.data;
      if (!success) {
        setAlertType("error");
      } else {
        setAlertType("success");
      }
      await getBalance("all");
      setOpenSnackBar(true);
      setSnackBarMessage(message);
      setIsUpdateTGDialogOpen(true);
    } catch (error) {
      console.log(error);
    }
    setIsAdding(false);
  };

  const handleRemoveDialogClose = () => {
    setIsRemoveDialogOpen(false);
  };

  const handleDialogClose = () => {
    setIsUpdateTGDialogOpen(false);
  };

  const getBalance = async (type: string) => {
    setIsLoading(true);
    try {
      if (type !== "init") {
        await Axios.post(`${apiConfig.leaderboard}api/v1/leaderboard/set`);
      }
      const res = await Axios.post(
        `${apiConfig.leaderboard}api/v1/leaderboard/get`,
        {
          pageSize: 20,
          currentPage: 0,
          wallet: account?.toLowerCase(),
          retrieveType: "page",
          deleted: false,
        }
      );
      const { data, checked, telegram } = res.data;
      setTelegram(telegram);
      setIsChecked(checked);
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
    setIsLoading(false);
  };

  const onCompleteCounterDown = () => {
    getBalance("init");
    return {
      shouldRepeat: true,
      delay: 0,
    };
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
            <Box className={classes.learderBoard} sx={{ position: "relative" }}>
              <Box sx={{ position: "absolute", right: 15, top: 15 }}>
                {isLoading ? (
                  <Spinner color="white" size={24} />
                ) : (
                  <CountdownCircleTimer
                    isPlaying
                    duration={duration}
                    colors={["#f66810", "#e89f38", "#f66810", "#a44916"]}
                    colorsTime={[7, 5, 2, 0]}
                    onComplete={() => onCompleteCounterDown()}
                    strokeWidth={3}
                    size={24}
                  ></CountdownCircleTimer>
                )}
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  borderBottom: "1px solid #fff",
                  marginBottom: 3,
                }}
              >
                LEADERBOARD
              </Typography>

              <Box>
                <Grid
                  spacing={2}
                  container
                  className=""
                  style={{ fontWeight: "bold" }}
                >
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
                      {user["wallet"]?.substr(0, 2) +
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
                <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => onChangeCheck(e)}
                    className="mr-2"
                  />
                  {isChecked ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      You are participating in the Leaderboard.{" "}
                      <Button
                        className="updateTGnameBtn"
                        variant="outlined"
                        size="small"
                        sx={{
                          marginLeft: 2,
                          borderColor: "gray",
                        }}
                        onClick={() => setIsUpdateTGDialogOpen(true)}
                      >
                        Update TG Name
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography sx={{ marginRight: 2 }}>
                        Check this box to participate in the Leaderboard and win
                        big prizes.
                      </Typography>
                      {isAdding && <Spinner color="white" size={24} />}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item md={3} sm={0} xs={0}></Grid>
        </Grid>
      </Box>
      <Dialog open={isRemoveDialogOpen}>
        <DialogContent>
          Are you sure you want to remove your wallet from Leaderboard?
          <br />
          Once your wallet is removed, you will not be eligible for the
          Leaderboard prizes anymore.
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
            {isRemoving ? (
              <Spinner color="white" size={24} />
            ) : (
              "Yes, remove me"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isUpdateTGDialogOpen}>
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
            <Typography sx={{ fontWeight: "bold" }}>
              Your wallet has been added to the Leaderboard competition.
            </Typography>
            <br />
            Every two weeks, several wallets listed on the Leaderboard win
            various legions with a value between 250 - 750 USD each. Please
            consult our Whitepaper for the prizes for the current round.
            <br />
            {/* These are the prizes for the current round:
            <br />
            <ul>
              <li>Top #1 wins a 20,000 AP legion</li>
              <li>Top #2 wins a 15,000 AP legion</li>
              <li>
                A random wallet who accepted to be listed on the leaderboard
                wins a 10,000 AP legion
              </li>
            </ul>
            <br /> */}
            <Typography sx={{ fontWeight: "bold" }}>
              Enter your Telegram name so we can keep you posted if you win one
              of the prizes:
            </Typography>
            <Input
              placeholder="TG Name"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
            />
            <br />
            <br />
            <Button
              variant="contained"
              disabled={isSigning}
              onClick={() => handleUpdateTGname()}
            >
              I want to win, sign me up.{" "}
              {isSigning && <Spinner color="white" size={20} />}
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

      <Snackbar
        open={openSnackBar}
        TransitionComponent={TransitionUp}
        autoHideDuration={6000}
        onClose={() => setOpenSnackBar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        key={TransitionUp ? TransitionUp.name : ""}
      >
        <Alert
          onClose={() => setOpenSnackBar(false)}
          variant="filled"
          severity={alertType}
          sx={{ width: "100%" }}
        >
          <Box sx={{ cursor: "pointer" }}>{snackBarMessage}</Box>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Leaderboard;
