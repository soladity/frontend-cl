import React from "react";
import Typography from "@mui/material/Typography";
import { Grid, Box } from "@mui/material";
import { meta_constant } from "../../config/meta.config";
import Helmet from "react-helmet";
import { getTranslation } from "../../utils/translation";
import YourInventory from "./YourInventory";
import NadodoWatch from "./NadodoWatch";
import TakeAction from "./TakeAction";
import ToSocial from "./ToSocial";
import YourAchievements from "./YourAchievements";
import ReactPlayer from "react-player/youtube";
import Quotes from "../../constant/Quotes";
import Sparkles from "../../component/UI/Sparkless/Sparkles";

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

const Home = () => {
  const language = localStorage.getItem("lang");
  const quoteIndex =
    Math.floor(new Date().getTime() / 1000 / 3600 / 24) % Quotes.length;

  return (
    <Box>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta_constant.home.title}</title>
        <meta name="description" content={meta_constant.home.description} />
        {/* <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta> */}
        {meta_constant.home.keywords && (
          <meta
            name="keywords"
            content={meta_constant.home.keywords.join(",")}
          />
        )}
      </Helmet>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12} md={4}>
          <YourInventory />
        </Grid>
        <Grid item xs={12} md={4}>
          <TakeAction />
        </Grid>
        <Grid item xs={12} md={4}>
          <NadodoWatch />
        </Grid>
      </Grid>
      <ToSocial />
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          px: 10,
          fontSize: "18px",
          fontWeight: "bold",
        }}
        className="legionFontColor"
      >
        <Sparkles minDelay={6000} maxDelay={10000}>
          {Quotes[quoteIndex]}
        </Sparkles>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Box sx={{ width: "100%" }}>
          <Grid spacing={2} container>
            <Grid item md={3} sm={2} xs={1}></Grid>
            <Grid item md={6} sm={8} xs={10}>
              <Box
                sx={{
                  width: "100%",
                  paddingTop: "56.25%",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ReactPlayer
                    url="https://youtu.be/Ujn7WhSymXE"
                    width="100%"
                    height="100%"
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item md={3} sm={2} xs={1}></Grid>
          </Grid>
          <a
            href={
              language === "es"
                ? "https://docs-es.cryptolegions.app/"
                : "https://docs.cryptolegions.app/"
            }
            target="_blank"
            style={{ color: "white", border: "none" }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 2,
                "&:hover": {
                  color: "#f66810",
                  transition: ".4s all",
                },
              }}
            >
              {getTranslation("readInstructionsInWhitePaper")}
            </Typography>
          </a>
          <Grid container spacing={2} sx={{ my: 2, marginBottom: 4 }}>
            <Grid item xs={12} md={1} lg={3}></Grid>
            <Grid item xs={12} md={10} lg={6}>
              <YourAchievements />
            </Grid>
            <Grid item xs={12} md={1} lg={3}></Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
