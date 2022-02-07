import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ReadableByteStreamController } from 'stream/web';
import { Box, Container, fabClasses, Grid } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../wallet';

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

    const [loading, setLoading] = React.useState(false);
    const [failed, setFailed] = React.useState(false);

    const [mouseOver, setMouseOver] = React.useState(false)

    const [logoImage, setLogoImage] = React.useState(image.LOGO);

    const handleCloseClick = () => {
        setLoading(true);
        activate(injected);
    };

    React.useEffect(() => {
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
                    />
                </Box>
                <Grid container spacing={2}>
                    <Grid item md={2}>

                    </Grid>
                    <Grid item md={8}>
                        <Grid container spacing={2}>
                            <Grid
                                item
                                xs={12}
                                sm={8}
                                onMouseOver={() => {
                                    setMouseOver(true)
                                }}
                                onMouseLeave={() => {
                                    setMouseOver(false)
                                }}
                                onClick={handleCloseClick}
                            >
                                {
                                    loading || mouseOver ? (
                                        <img
                                            src={image.DRAGON_HOVER}
                                            style={{ width: '100%' }}
                                        />
                                    ) : (

                                        <img
                                            src={image.DRAGON_INIT}
                                            style={{ width: '100%' }}
                                        />
                                    )
                                }
                            </Grid>
                            <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    {
                                        !loading && failed ? (
                                            <>
                                                <img
                                                    src={image.METAMASK}
                                                    style={{ width: '40%' }}
                                                />
                                                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#f89c35' }}>
                                                    PLEASE RETRY!
                                                </p>
                                            </>
                                        ) :
                                            !loading && !mouseOver ? (
                                                <>
                                                    <img
                                                        src={image.METAMASK}
                                                        style={{ width: '40%' }}
                                                    />
                                                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#f89c35' }}>
                                                        LOGIN WITH METAMASK
                                                    </p>
                                                </>
                                            ) : (
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
                                            )
                                    }
                                </Box>

                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={2}>
                    </Grid>
                </Grid>
            </Container>
        </div >
    )
}

export default AskMetaLogin;


