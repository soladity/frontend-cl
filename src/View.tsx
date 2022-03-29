import * as React from "react";
import { useRoutes } from "react-router";
import Box from "@mui/material/Box";
import Navigation from "./component/Nav/Navigation";
import AppBarComponent from "./component/AppBar/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { makeStyles } from "@mui/styles";

import { navConfig } from "./config";
import { useLegion, useRewardPool, useRewardPoolEvent, useWeb3 } from "./hooks/useContract";
import { useWeb3React } from "@web3-react/core";
import { getTaxStartDay, getUnclaimedUSD } from "./hooks/contractFunction";

const useStyle = makeStyles({
  mainBox: {
    background: "url('./assets/images/nicah_background.jpg')",
    backgroundAttachment: "fixed",
    backgroundSize: "100% 100%",
    height: "100%",
    overflowY: "auto",
    "@media(min-width: 0px)": {
      backgroundPosition: "20%",
      backgroundSize: "auto 100%",
    },
    "@media(min-width: 1600px)": {
      backgroundSize: "100% 100%",
    },
  },
});

const View = () => {
  const routing = useRoutes(navConfig.routes());

  React.useEffect(() => {
  }, [])

  return (
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}
    >
      <Box
        component="header"
        sx={{
          position: "relative",
          zIndex: 100,
        }}
      >
        <AppBarComponent />
      </Box>
      <Box
        component="nav"
        sx={{
          width: { md: navConfig.drawerWidth },
          flexShrink: { md: 0 },
          position: "relative",
          zIndex: 99,
        }}
        aria-label="mailbox folders"
        id="navbar"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Navigation />
      </Box>
      <Box
        component="main"
        id="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${navConfig.drawerWidth}px)` },
          paddingTop: { xs: 8, md: 4, lg: 4 },
        }}
      >
        <Toolbar />
        <React.Suspense fallback={<h3>Loading</h3>}>{routing}</React.Suspense>
      </Box>
    </Box>
  );
};

export default View;
