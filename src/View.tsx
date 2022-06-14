import * as React from "react";
import { useRoutes } from "react-router";
import Box from "@mui/material/Box";
import Navigation from "./component/Nav/Navigation";
import AppBarComponent from "./component/AppBar/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { makeStyles } from "@mui/styles";

import { navConfig } from "./config";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { useSelector, useDispatch } from "react-redux";
import { updateStore } from "./actions/contractActions";
import { useTheme, useMediaQuery } from "@mui/material";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const theme = useTheme();
  const isSmallerThanMD = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();
  const { tutorialOn, isSmallerThanMD: isSmallerThanMiddle } = useSelector(
    (state: any) => state.contractReducer
  );
  const [tutorialDialogOpen, setTutorialDialogOpen] = React.useState(
    localStorage.getItem("tutorial") == "true" ? false : true
  );

  const handleTutorialDialogClose = (reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    setTutorialDialogOpen(false);
  };
  const setTutorialHelp = (type: any) => {
    if (type == "yes") {
      if (isSmallerThanMD) {
        if (
          location.pathname == "/warriors" ||
          location.pathname == "/beasts"
        ) {
          dispatch(
            updateStore({
              tutorialOn: true,
              isSideBarOpen: false,
            })
          );
        } else {
          dispatch(
            updateStore({
              tutorialOn: true,
              tutorialStep: [1],
              isSideBarOpen: true,
            })
          );
        }
      } else {
        dispatch(updateStore({ tutorialOn: true, tutorialStep: [1] }));
      }
    } else if (type == "no") {
      dispatch(updateStore({ tutorialOn: false }));
    }
    setTutorialDialogOpen(false);
    localStorage.setItem("tutorial", "true");
  };

  React.useEffect(() => {
    console.log(isSmallerThanMD);
    if (isSmallerThanMD) {
      dispatch(updateStore({ isSmallerThanMD: isSmallerThanMD }));
    }
  }, [isSmallerThanMD]);

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
      {!isSmallerThanMD && (
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
      )}
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

      <Dialog
        open={tutorialDialogOpen}
        keepMounted
        disableEscapeKeyDown
        onClose={(_, reason) => handleTutorialDialogClose(reason)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Welcome to your first time in Crypto Legions!</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            Do you need some help to get started?
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => {
              setTutorialHelp("no");
              // handleTutorialDialogClose("cancel");
            }}
            variant="contained"
            sx={{ color: "white", fontWeight: "bold" }}
          >
            No, I am an expert.
          </Button>
          <Button
            onClick={() => {
              setTutorialHelp("yes");
              // handleTutorialDialogClose("cancel");
            }}
            variant="outlined"
            sx={{ fontWeight: "bold" }}
          >
            Yes, help me play.
          </Button>
        </DialogActions>
      </Dialog>
      {tutorialOn && (
        <Box sx={{ position: "fixed", bottom: 5, right: 10 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => dispatch(updateStore({ tutorialOn: false }))}
          >
            Cancel Tutorial
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default View;
