import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button, Menu, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import { NavLink } from "react-router-dom";
import { Tooltip, Typography } from "@mui/material";
import { Card } from "@mui/material";

import { navConfig } from "../../config";
import { getTranslation } from "../../utils/translation";
import { useSelector, useDispatch } from "react-redux";
import { setReloadStatus, updateStore } from "../../actions/contractActions";
import Tutorial from "../Tutorial/Tutorial";
import { useNavigate, useLocation } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    color: "#5f65f1",
  },
  green: {
    color: "#1ee99f",
  },
});

const NavList = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { tutorialOn, isSmallerThanMD } = useSelector(
    (state: any) => state.contractReducer
  );

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [language, setLanguage] = React.useState<string | null>("en");
  const open = Boolean(anchorEl);

  const languages = [
    {
      title: "en",
      name: "English",
    },
    {
      title: "es",
      name: "Spanish",
    },
    {
      title: "cn",
      name: "Chinese",
    },
    {
      title: "pt",
      name: "Portuguese",
    },
    {
      title: "tr",
      name: "Turkish",
    },
    {
      title: "ru",
      name: "Russian",
    },
    {
      title: "fr",
      name: "French",
    },
    {
      title: "de",
      name: "Dutch",
    },
    {
      title: "pl",
      name: "Polish",
    },
    {
      title: "ph",
      name: "Filipino",
    },
  ];

  React.useEffect(() => {
    setLanguage(
      localStorage.getItem("lang") !== null
        ? localStorage.getItem("lang")
        : "en"
    );
  }, []);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguage = (value: any) => {
    setAnchorEl(null);
    setLanguage(value);
    localStorage.setItem("lang", value);
    dispatch(
      setReloadStatus({
        reloadContractStatus: new Date(),
      })
    );
  };

  const getTutorialStep = (title: string) => {
    let step = -1;
    switch (title) {
      case "/warriors":
        step = 1;
        break;
      case "/beasts":
        step = 7;
        break;
      case "/hunt":
        step = 17;
        break;
      case "whitepaper":
        step = 20;
        break;
      default:
        break;
    }
    return step;
  };

  const setTutorialOn = () => {
    // if (isSmallerThanMD) {

    //// Plan A
    if (
      location.pathname == "/warriors" ||
      location.pathname == "/beasts" ||
      location.pathname == "/createlegions" ||
      location.pathname == "/legions" ||
      location.pathname == "/hunt"
    ) {
      dispatch(
        updateStore({
          tutorialOn: !tutorialOn,
          isSideBarOpen: false,
        })
      );
    } else {
      dispatch(
        updateStore({
          tutorialOn: !tutorialOn,
          tutorialStep: [1],
          isSideBarOpen: true,
        })
      );
    }

    //// plan B
    // navigate("/");
    // dispatch(
    //   updateStore({
    //     tutorialOn: !tutorialOn,
    //     tutorialStep: [1],
    //     isSideBarOpen: true,
    //   })
    // );

    // } else {
    //   dispatch(updateStore({ tutorialOn: !tutorialOn, tutorialStep: [1] }));
    // }
  };

  return (
    <div>
      <Toolbar sx={{ display: { xs: "none", md: "flex" } }} />
      <Divider sx={{ display: { xs: "none", md: "block" } }} />
      <List
        sx={{
          pb: 8,
        }}
      >
        {navConfig.navBar.left.map((navItem, index) => (
          <React.Fragment key={"nav_item_" + index}>
            {navItem.type === "link" && (
              <Tutorial
                placement="bottom"
                curStep={getTutorialStep(navItem.title ? navItem.title : "")}
              >
                <a
                  target="_blank"
                  className="nav-bar-item"
                  href={
                    navItem.title === "whitepaper" && language === "es"
                      ? navItem.esPath
                      : navItem.path || ""
                  }
                >
                  <Tooltip title={navItem.title || ""} placement="right">
                    <ListItemButton>
                      <img
                        src={`/assets/images/${navItem.icon}`}
                        style={{
                          width: "22px",
                          height: "22px",
                          marginRight: "34px",
                        }}
                        alt="icon"
                      />
                      <ListItemText primary={getTranslation(navItem.title)} />
                    </ListItemButton>
                  </Tooltip>
                </a>
              </Tutorial>
            )}
            {navItem.type === "navlink" && (
              <Tutorial
                placement="bottom"
                curStep={getTutorialStep(navItem.path ? navItem.path : "")}
              >
                <NavLink
                  to={navItem.path || ""}
                  className={({ isActive }) =>
                    "nav-bar-item " + (isActive ? "active" : "")
                  }
                  onClick={() =>
                    dispatch(updateStore({ isSideBarOpen: false }))
                  }
                >
                  <Tooltip title={navItem.title || ""} placement="right">
                    <ListItemButton>
                      <img
                        src={`/assets/images/${navItem.icon}`}
                        style={{
                          width: "22px",
                          height: "22px",
                          marginRight: "34px",
                        }}
                        alt="icon"
                      />
                      <ListItemText primary={getTranslation(navItem.title)} />
                    </ListItemButton>
                  </Tooltip>
                </NavLink>
              </Tutorial>
            )}
            {navItem.type === "divider" && <Divider />}
            {navItem.type === "head" && (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bolder",
                  color: "#a44916",
                  textTransform: "uppercase",
                  textAlign: "center",
                  paddingTop: "15px",
                  paddingBottom: "10px",
                }}
                className={classes.root}
              >
                {getTranslation(navItem.title)}
              </Typography>
            )}
            {localStorage.getItem("tutorial") == "true" &&
              navItem.type === "tutorial" && (
                <Box onClick={() => setTutorialOn()}>
                  <Tooltip
                    title={
                      "You can always restart the tutorial by clicking here"
                    }
                    placement="right"
                  >
                    <ListItemButton>
                      <img
                        src={`/assets/images/${navItem.icon}`}
                        style={{
                          width: "22px",
                          height: "22px",
                          marginRight: "34px",
                        }}
                        alt="icon"
                      />
                      <ListItemText
                        primary={tutorialOn ? "Tutorial Off" : "Tutorial On"}
                      />
                    </ListItemButton>
                  </Tooltip>
                </Box>
              )}
          </React.Fragment>
        ))}
        <Box sx={{ display: "flex", px: 2, pt: 2 }}>
          {navConfig.navBar.left.map(
            (navItem, index) =>
              navItem.type === "social" && (
                <a target="_blank" href={navItem.path || ""} key={index}>
                  <img
                    src={navItem.icon}
                    style={{ height: "32px", marginRight: "7px" }}
                    alt="social icon"
                  />
                </a>
              )
          )}
        </Box>
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            id="language-button"
            aria-controls={open ? "language-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ color: "white" }}
          >
            <img
              src={`/assets/images/flags/${language}.svg`}
              style={{ width: "30px" }}
            />
            <ArrowDropDownIcon />
          </Button>
          <Menu
            id="language-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "language-button",
            }}
          >
            {languages.map((item, index) => (
              <MenuItem key={index} onClick={() => handleLanguage(item.title)}>
                <img
                  src={`/assets/images/flags/${item.title}.svg`}
                  style={{ width: "30px", marginRight: "10px" }}
                />{" "}
                {item.name}
              </MenuItem>
            ))}
          </Menu>
          {navConfig.navBar.left.map(
            (navItem, index) =>
              navItem.type === "privacy" && (
                <NavLink
                  key={index}
                  to={navItem.path || ""}
                  style={{ color: "gray" }}
                  className={({ isActive }) =>
                    "nav-bar-item " + (isActive ? "active" : "")
                  }
                >
                  <Tooltip title={navItem.title || ""} placement="right">
                    <ListItemButton>
                      <ListItemText
                        primary={getTranslation(navItem.title)}
                        sx={{ fontSize: "0.7rem" }}
                      />
                    </ListItemButton>
                  </Tooltip>
                </NavLink>
              )
          )}
        </Box>
        {navConfig.navBar.left.map(
          (navItem, index) =>
            navItem.type === "footer" && (
              <a
                href="https://cryptogames.agency"
                target="_blank"
                className="hover-style gray"
                key={index}
              >
                <Card key={index} sx={{ m: 2, p: 2, color: "inherit" }}>
                  <Typography
                    variant="subtitle2"
                    color="inherit"
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    {getTranslation(navItem.title1)}
                    <img
                      src="/assets/images/heart.png"
                      alt="favorite"
                      style={{
                        width: "14px",
                        height: "14px",
                        margin: "0 10px",
                      }}
                    />
                    {getTranslation(navItem.title2)}
                  </Typography>
                </Card>
              </a>
            )
        )}
      </List>
    </div>
  );
};

export default NavList;
