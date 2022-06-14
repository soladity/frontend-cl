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

export default function Tutorial({ children, ...rest }: any) {
  const { curStep, placement } = rest;
  console.log("currentstep: ", curStep);

  const dispatch = useDispatch();

  const { tutorialStep, tutorialForPopover, stepInfo, tutorialOn } =
    useSelector((state: any) => state.contractReducer);
  console.log(tutorialStep, tutorialForPopover);

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
    dispatch(updateStore({ tutorialStep: curStep + 1 }));
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
    console.log(tutorialSelector.current);
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
                    Tutorial {curStep}
                  </Typography>
                  <Typography variant="body2">
                    {stepInfo[curStep]?.desc}
                  </Typography>
                </CardContent>
                {/* <CardActions>
                  <Button size="small">Skip</Button>
                  <Button size="small" onClick={() => handleTutorialNext()}>
                    Next
                  </Button>
                </CardActions> */}
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
