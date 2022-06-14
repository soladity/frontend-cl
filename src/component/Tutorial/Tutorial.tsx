import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Fade,
  Popper,
  Box,
} from "@mui/material";

import { useSelector, useDispatch } from "react-redux";
import { updateStore } from "../../actions/contractActions";
import "./Tutorial.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export default function Tutorial({ children, ...rest }: any) {
  const { curStep, placement } = rest;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let locationVal = useLocation();
  console.log(locationVal);

  const { tutorialStep, tutorialForPopover, stepInfo, tutorialOn } =
    useSelector((state: any) => state.contractReducer);

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const tutorialSelector = useRef(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? "tutorial-popper" : undefined;

  let show =
    tutorialOn &&
    tutorialStep.filter((item: any) => item == curStep).length > 0;

  const handleTutorialNext = () => {
    let summonWarriorQuantityBtn = document.getElementById(
      "summon-warrior-quantity"
    );
    switch (curStep) {
      case 1:
        navigate("/warriors");
        break;
      case 2:
        summonWarriorQuantityBtn?.click();
        dispatch(updateStore({ tutorialStep: [3], isSideBarOpen: false }));
        break;
      case 3:
        const summonWarrior1Btn = document.getElementById("summon-warrior-1");
        summonWarrior1Btn?.click();
        dispatch(updateStore({ isSideBarOpen: false }));
        break;
      case 4:
        dispatch(updateStore({ tutorialStep: [5], isSideBarOpen: false }));
        break;
      case 5:
        summonWarriorQuantityBtn?.click();
        break;
      case 6:
        dispatch(updateStore({ tutorialStep: [7], isSideBarOpen: true }));
        break;
      default:
        break;
    }
  };

  const handleTutorialCancel = () => {
    dispatch(updateStore({ tutorialOn: false }));
  };

  const setTutorialClassName = () => {
    let className = "";
    switch (placement) {
      case "top":
        className = "tutorial-top";
        break;
      case "bottom":
        className = "tutorial-bottom";
        break;
      case "left":
        className = "tutorial-left";
        break;
      case "right":
        className = "tutorial-right";
        break;
      default:
        break;
    }
    return className;
  };

  useEffect(() => {
    setAnchorEl(tutorialSelector.current);
    setOpen(true);
  }, []);

  return (
    <>
      <div aria-describedby={id + "-" + curStep} ref={tutorialSelector}>
        {children}
      </div>
      <Popper
        id={id + "-" + curStep}
        open={open}
        anchorEl={anchorEl}
        transition
        placement={placement}
        disablePortal={false}
        modifiers={[
          {
            name: "flip",
            enabled: false,
            options: {
              altBoundary: true,
              rootBoundary: "document",
              padding: 8,
            },
          },
          {
            name: "preventOverflow",
            enabled: true,
            options: {
              altAxis: false,
              altBoundary: true,
              tether: true,
              rootBoundary: "document",
              padding: 8,
            },
          },
        ]}
      >
        {show ? (
          ({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Card
                sx={{
                  p: 1,
                  background: "white",
                  color: "black",
                  width: 300,
                }}
                className={setTutorialClassName()}
              >
                {/* <CardMedia
                          component="img"
                          height="140"
                          image="/static/images/cards/contemplative-reptile.jpg"
                          alt="green iguana"
                        /> */}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Step {curStep}
                  </Typography>
                  <Typography variant="body2">
                    {stepInfo[curStep]?.desc}
                  </Typography>
                </CardContent>
                <CardActions sx={{ display: "flex" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ ml: "auto" }}
                    onClick={() => handleTutorialCancel()}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleTutorialNext()}
                  >
                    Next
                  </Button>
                </CardActions>
                {placement == "top" && (
                  <div className="tutorial-bottom-arrow"></div>
                )}
                {placement == "bottom" && (
                  <div className="tutorial-top-arrow"></div>
                )}
                {placement == "left" && (
                  <div className="tutorial-right-arrow"></div>
                )}
                {placement == "right" && (
                  <div className="tutorial-left-arrow"></div>
                )}
              </Card>
            </Fade>
          )
        ) : (
          <></>
        )}
      </Popper>
    </>
  );
}
