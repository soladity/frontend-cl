import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ReadableByteStreamController } from 'stream/web';
import { Box } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../wallet';

const image = {
    FOX_FAILED: '/assets/images/metamask-logo-bw.png',
    FOX_LOADING: '/assets/images/metamask-front.png',
    FOX_INIT: '/assets/images/metamask-logo.png',
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

    const [open, setOpen] = React.useState(!active);
    const [loading, setLoading] = React.useState(false);
    const [failed, setFailed] = React.useState(false);

    const [foxImage, setFoxImage] = React.useState(image.FOX_INIT);
    const [viewContent, setViewContent] = React.useState(content.INIT);

    const handleCloseClick = (event: any) => {
        setLoading(true);
        activate(injected);
    };

    React.useEffect(() => {
        if(loading) {
            setFoxImage(image.FOX_LOADING);
            setViewContent(content.LOADING);
        } else if(failed) {
            setFoxImage(image.FOX_FAILED);
            setViewContent(content.FAILED);
        } else {
            setFoxImage(image.FOX_INIT);
            setViewContent(content.INIT);
        }
    }, [loading, failed])

    React.useEffect(() => {
        setLoading(false);
        console.log(active, '123123')
        if(active) {
            setOpen(false);
        } 
        if(error) {
            setFailed(true);
        }
    }, [active, error])

    return (
        <div>
            <Dialog
                open={open}
                disableEscapeKeyDown
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {viewContent}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    Seems like you are not connected to MetaMask (Ethereum Wallet).
                    </DialogContentText>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={foxImage}
                            style={{height: '200px', margin: '1rem auto'}}
                            alt={'metamask'}
                            loading="lazy"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button disabled={loading} onClick={handleCloseClick} autoFocus>
                        {loading && 'Please wait'}
                        {!loading && !failed && 'Connect to Metamask'}
                        {!loading && failed && 'Retry now'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AskMetaLogin;


