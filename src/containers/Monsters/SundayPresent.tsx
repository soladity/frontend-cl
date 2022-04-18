import React, { useState, useEffect } from 'react'
import { Box, Dialog } from '@mui/material'
import { makeStyles } from "@mui/styles";
import './Present.css'
import Sparkles from '../../component/UI/Sparkless/Sparkles';

const useStyles = makeStyles(() => ({
  magicBorder: {
    "--x": '50%',
    "--y": '50%',
    position: 'relative',
    appearance: 'none',
    padding: '100px',
    color: 'white',
    cursor: 'pointer',
    outline: 'none',
    borderRadius: '50%',
    // The magic
    border: '2px solid transparent',
    background: 'linear-gradient(#000, #000) padding-box, radial-gradient(farthest-corner at var(--x) var(--y), #00C9A7, #845EC2) border-box',
    // animation: `$round linear 2s infinite`,
  },
  dialog: {
    backgroundColor: 'transparent !important',
    backgroundImage: 'none !important',
    boxShadow: 'none !important',
    borderRadius: 100
  },
  "@keyframes round": {
    "0%": {
      "--x": '0%',
      "--y": '0%',
    },
    "50%": {
      "--x": '50%',
      "--y": '50%',
    },
    "100%": {
      "--x": '0%',
      "--y": '0%',
    },
  }
}));

const Present = (props: any) => {
  const classes = useStyles()
  const handleDialogClose = (reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    props.setPresentDialogOpen(false);
  };
  return (
    <Dialog
      disableEscapeKeyDown
      onClose={(_, reason) => handleDialogClose(reason)}
      open={props.presentDialogOpen}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          boxShadow: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }
      }}
      fullScreen
    >
      <Sparkles minDelay={500} maxDelay={3000}>
        <div className="container" onClick={() => props.setPresentDialogOpen(false)}>
          <div className="background-img">
            <div className="box">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <div className="content">
                <h2>Sunday Present</h2>
                <p><a>You reached out to our standard level.</a></p>
                <p><a>So you can hunt the Monster 25 as Present, this Sunday.</a></p>
              </div>
            </div>
          </div>
        </div>
      </Sparkles>
    </Dialog>
  )
}

export default Present;