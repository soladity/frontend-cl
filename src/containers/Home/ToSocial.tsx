import * as React from "react";
import { Grid } from "@mui/material";
import ToSocialBtn from "../../component/Buttons/ToSocialBtn";
import SwitchNFTtype from "../../component/Buttons/SwitchNFTtype";

const ToSocial = () => {
  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <ToSocialBtn type="Discord" linkUrl="https://cryptolegions.app/d" />
      <ToSocialBtn type="Telegram" linkUrl="https://cryptolegions.app/t" />
      <ToSocialBtn type="Twitter" linkUrl="https://cryptolegions.app/tw" />
      <ToSocialBtn type="Youtube" linkUrl="https://cryptolegions.app/y" />
      <ToSocialBtn type="Medium" linkUrl="https://cryptolegions.app/m" />
      <SwitchNFTtype />
    </Grid>
  );
};

export default ToSocial;
