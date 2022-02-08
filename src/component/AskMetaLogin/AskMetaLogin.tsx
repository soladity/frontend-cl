import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ReadableByteStreamController } from 'stream/web';
import { Box, Container, Snackbar, Grid, Alert } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../wallet';
import Slide, { SlideProps } from '@mui/material/Slide';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    loginToWhitePaperBtn: {
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#565656',
        textDecoration: 'none',
        transition: '.4s all',
        '&:hover': {
            transition: '.4s all',
            color: '#f89c35'
        },
    },
    logo: {
        animation: `$LogoBang cubic-bezier(0.4, 0, 1, 1) 3s`,
    },
    fadeAnimation: {
        animation: `$fadeIn cubic-bezier(0.4, 0, 1, 1) 3s`,
    },
    "@keyframes LogoBang": {
        "0%": {
            transform: "scale(5)"
        },
        "20%": {
            transform: "scale(0.1)"
        },
        "30%": {
            transform: "scale(3)"
        },
        "40%": {
            transform: "scale(0.6)"
        },
        "50%": {
            transform: "scale(1)"
        },
        "60%": {
            transform: "translate(5px, 0px)"
        },
        "65%": {
            transform: "translate(-5px, 0px)"
        },
        "70%": {
            transform: "translate(5px, 0px)"
        },
        "75%": {
            transform: "translate(-5px, 0px)"
        },
        "80%": {
            transform: "translate(5px, 0px)"
        },
        "85%": {
            transform: "translate(-5px, 0px)"
        },
        "90%": {
            transform: "translate(0px, 0px)"
        },
        "95%": {
            transform: "translate(0x, 0px)"
        },
        "100%": {
            transform: "translate(0px, 0px)"
        }
    },
    "@keyframes fadeIn": {
        "0%": {
            opacity: '0'
        },
        "100%": {
            opacity: '1'
        }
    }

})

const image = {
    METAMASK: '/assets/images/metamask.jpg',
    METAMASK_WINK: '/assets/images/metamask2.jpg',
    FOX_FAILED: '/assets/images/metamask-logo-bw.png',
    FOX_LOADING: '/assets/images/metamask-front.png',
    FOX_INIT: '/assets/images/metamask-logo.png',
    DRAGON_INIT: '/assets/images/dragon1.jpg',
    DRAGON_HOVER: '/assets/images/dragon2.jpg',
    LOGO: '/assets/images/logo.png'
};

const content = {
    FAILED: 'Ahh! Seems like connection failed',
    INIT: 'No Wallet found',
    LOADING: 'Trying to connect!'
}

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionUp(props: TransitionProps) {
    return <Slide {...props} direction="up" />;
}

const AskMetaLogin = () => {
    const {
        activate,
        account,
        active,
        deactivate,
        connector,
        library,
        setError,
        error,
        chainId
    } = useWeb3React();

    const classes = useStyles()

    const [loading, setLoading] = React.useState(false);
    const [failed, setFailed] = React.useState(false);
    const [openSnackBar, setOpenSnackBar] = React.useState(false)

    const [mouseOver, setMouseOver] = React.useState(false)

    const [logoImage, setLogoImage] = React.useState(image.LOGO);

    const handleCloseClick = () => {
        setLoading(true);
        activate(injected);
    };

    React.useEffect(() => {
        if (error) {
            if (error.toString().indexOf('NoEthereumProviderError') > -1) {
                setOpenSnackBar(true)
            }
        }
        setLoading(false);
        if (active) {
        }
        if (error) {
            setFailed(true);
        }
    }, [active, error])

    return (
        <div style={{ background: 'black', position: 'fixed', top: '0', left: '0', bottom: '0', right: '0' }}>
            <Container sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', cursor: 'pointer' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <img
                        src={logoImage}
                        style={{ width: '60%' }}
                        className={classes.logo}
                    />
                </Box>
                <Grid container spacing={2}>
                    <Grid item md={2}>

                    </Grid>
                    <Grid item md={8} className={classes.fadeAnimation}>
                        <Grid
                            container
                            spacing={2}
                            onMouseOver={() => {
                                setMouseOver(true)
                            }}
                            onMouseLeave={() => {
                                setMouseOver(false)
                            }}
                            onClick={handleCloseClick}
                        >
                            <Grid
                                item
                                xs={12}
                                sm={8}
                            >
                                {
                                    <>
                                        <img
                                            src={image.DRAGON_HOVER}
                                            style={{ width: '100%' }}
                                            hidden={!(loading || mouseOver)}
                                        />

                                        <img
                                            src={image.DRAGON_INIT}
                                            style={{ width: '100%' }}
                                            hidden={loading || mouseOver}
                                        />
                                    </>
                                }
                            </Grid>
                            <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Box
                                    sx={{ textAlign: 'center' }}
                                >
                                    {
                                        mouseOver || loading ? (
                                            <>
                                                <img
                                                    src={image.METAMASK_WINK}
                                                    style={{ width: '40%' }}
                                                />
                                                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#f89c35', marginTop: 4, marginBottom: 4 }}>
                                                    CLICK TO FLY
                                                </p>
                                                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#f89c35', marginTop: 4, marginBottom: 4 }}>
                                                    TO NICAH
                                                </p>
                                            </>
                                        ) : failed ? (

                                            <>
                                                <img
                                                    src={image.METAMASK}
                                                    style={{ width: '40%' }}
                                                />
                                                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#f89c35' }}>
                                                    PLEASE RETRY!
                                                </p>
                                            </>
                                        ) : (

                                            <>
                                                <img
                                                    src={image.METAMASK}
                                                    style={{ width: '40%' }}
                                                />
                                                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#f89c35' }}>
                                                    LOGIN WITH METAMASK
                                                </p>
                                            </>
                                        )
                                    }
                                </Box>

                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={2}>
                    </Grid>
                </Grid>
                <Box sx={{ marginTop: 2, textAlign: 'center' }} className={classes.fadeAnimation}>
                    <a href="https://docs.cryptolegions.app/" className={classes.loginToWhitePaperBtn} target={'blank'}>
                        Need instructions? Read our Whitepaper
                    </a>
                    <br></br>
                    {/* <a href="https://cryptolegions.app/" className={classes.loginToWhitePaperBtn} target={'blank'}>
                        Visit our homepage
                    </a> */}
                </Box>
            </Container>
            <Snackbar
                open={openSnackBar}
                TransitionComponent={TransitionUp}
                autoHideDuration={6000}
                onClose={() => setOpenSnackBar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                key={TransitionUp.name}
            >
                <Alert onClose={() => setOpenSnackBar(false)} variant='filled' severity="error" sx={{ width: '100%' }}>
                    <Box sx={{ cursor: 'pointer' }}>
                        Please Install MetaMask
                    </Box>
                </Alert>
            </Snackbar>
        </div >
    )
}

export default AskMetaLogin;


