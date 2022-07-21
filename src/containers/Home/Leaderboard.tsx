import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
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

const Leaderboard: React.FC = () => {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const onChangeCheck = (e: any) => {
    if (!isChecked) {
      setIsOpen(true);
    }
    setIsChecked(e.target.checked);
  };

  const handleDialogClose = () => {
    setIsChecked(false);
    setIsOpen(false);
  };

  const getBalance = async () => {};

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <Box>
      <Box sx={{ width: "100%" }}>
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
                <Box>
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
      <Dialog open={isOpen}>
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
            <Input placeholder="TG Name" />
            <br />
            <br />
            <Button variant="contained">I want to win, sign me up.</Button>
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
