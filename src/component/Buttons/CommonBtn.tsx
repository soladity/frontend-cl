import * as React from "react";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";

const useStyles = makeStyles({
  legionBtn: {
    background:
      "linear-gradient(360deg, #973b04, #ffffff29), radial-gradient(#db5300, #ecff0e)",
    transition: ".4s all",
    "&:hover": {
      background:
        "linear-gradient(360deg, #8d4405, #ffffff29), radial-gradient(#702c02, #98a500)",
      transition: ".4s all",
    },
    color: "white !important",
    textShadow:
      "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
    "&[disabled]": {
      background: "grey",
      transition: ".4s all",
      cursor: "default",
    },
  },
});

const CommonBtn = ({ children, ...rest }: any) => {
  const classes = useStyles();

  return (
    <Button className={classes.legionBtn} variant="contained" {...rest}>
      {children}
    </Button>
  );
};

export default CommonBtn;
