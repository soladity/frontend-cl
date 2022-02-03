import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CardsComponent from '../../component/Cards/Cards';
import { Grid, Card, Box, Button, Popover, Checkbox, Dialog, DialogTitle } from '@mui/material';
import { meta_constant } from '../../config/meta.config';
import Helmet from 'react-helmet';
import { makeStyles } from '@mui/styles';
import { getTranslation } from '../../utils/translation';
import ToSocialBtn from '../../component/Buttons/ToSocialBtn';
import YouTube from 'react-youtube';
import { Link } from 'react-router-dom'

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column'
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '180px',
        height: '100%'
    },
    achievementBtn: {
        background: 'red',
        padding: 10,
        borderRadius: 5,
        cursor: 'pointer',
        color: 'black',
        animation: `$Flash linear 1s infinite`
    },
    "@keyframes Flash": {
        "0%": {
            background: '#19aa6f',
            boxShadow: '0 0 1px 1px #a7a2a2, 0px 0px 1px 2px #a7a2a2 inset'
        },
        "50%": {
            background: '#24f39f',
            boxShadow: '0 0 4px 4px #a7a2a2, 0px 0px 1px 2px #a7a2a2 inset'
        },
        "100%": {
            background: '#19aa6f',
            boxShadow: '0 0 1px 1px #a7a2a2, 0px 0px 1px 2px #a7a2a2 inset'
        }
    }
});

export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
}

function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, open } = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ marginLeft: 'auto', fontWeight: 'bold', paddingRight: 1, paddingTop: 1, cursor: 'pointer' }} onClick={handleClose}>
                    x
                </Box>
            </Box>
            <DialogTitle>SUMMON BEAST</DialogTitle>
            <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column' }}>
                <Button variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }}>1</Button>
                <Button variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }}>5</Button>
                <Button variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }}>10</Button>
                <Button variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }}>20</Button>
                <Button variant='contained' sx={{ fontWeight: 'bold' }}>100</Button>
            </Box>
        </Dialog >
    );
}

const Home = () => {

    const classes = useStyles();

    const [anchorElYourAchievement, setAnchorElYourAchievement] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpenYourAchievement = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElYourAchievement(event.currentTarget);
    };

    const handlePopoverCloseYourAchievement = () => {
        setAnchorElYourAchievement(null);
    };

    const openYourAchievement = Boolean(anchorElYourAchievement);

    const [anchorElSummonBeast, setAnchorElSummonBeast] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpenSummonBeast = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElSummonBeast(event.currentTarget);
    };

    const handlePopoverCloseSummonBeast = () => {
        setAnchorElSummonBeast(null);
    };

    const openSummonBeast = Boolean(anchorElSummonBeast);


    const [openBeastDialog, setOpenBeastDialog] = React.useState(false);

    const handleClickOpenBeastDialog = () => {
        setOpenBeastDialog(true);
    };

    const handleCloseBeastDialog = () => {
        setOpenBeastDialog(false);
    };

    return (
        <Box>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{meta_constant.beasts.title}</title>
                <meta name="description" content={meta_constant.beasts.description} />
                {meta_constant.beasts.keywords && <meta name="keywords" content={meta_constant.beasts.keywords.join(',')} />}
            </Helmet>
            <Grid container spacing={2} sx={{ my: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card className={classes.card}>
                        <Box sx={{ p: 4, justifyContent: 'center' }}>
                            <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #fff', marginBottom: 3 }}>
                                NADODO IS WATCHING
                            </Typography>
                            <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                                MARKETPLACE TAX : 15%
                            </Typography>
                            <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                                HUNT TAX : 2%
                            </Typography>
                            <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                                # LEGIONS : 8 / 12
                            </Typography>
                            <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                                YOUR MAX: 60000
                            </Typography>
                            <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                                UNCALIMED $ : 558
                            </Typography>
                            <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                                TAX DAYS LEFT : 3
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card className={classes.card}>
                        <Box sx={{ p: 4, justifyContent: 'center' }}>
                            <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #fff', marginBottom: 3 }}>
                                YOUR INVENTORIY
                            </Typography>
                            <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                                # BEASTS : 3
                            </Typography>
                            <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                                # WARRORS : 5
                            </Typography>
                            <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                                # LEGIONS : 8 / 12
                            </Typography>
                            <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                                YOUR MAX: 60000
                            </Typography>
                            <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                                UNCALIMED $ : 558
                            </Typography>
                            <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                                TAX DAYS LEFT : 3
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card className={classes.card}>
                        <Box sx={{ p: 4, justifyContent: 'center' }}>
                            <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #fff', marginBottom: 3 }}>
                                TAKE ACTION
                            </Typography>
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
                                            <Box sx={{ textAlign: 'center', width: '100%' }}>
                                                <Button variant="contained" onClick={() => handleClickOpenBeastDialog()} sx={{ fontWeight: 'bold', fontSize: 12, width: '100%', marginBottom: 1 }}>
                                                    SUMMON BEAST
                                                </Button>
                                                <Button aria-describedby={'summon-beast-id'} onClick={handlePopoverOpenSummonBeast} variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%', marginBottom: 1 }}>
                                                    SUMMON WARROIR
                                                </Button>
                                                <Popover
                                                    id={'summon-beast-id'}
                                                    open={openSummonBeast}
                                                    anchorEl={anchorElSummonBeast}
                                                    onClose={handlePopoverCloseSummonBeast}
                                                    anchorOrigin={{
                                                        vertical: 'center',
                                                        horizontal: 'left',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'center',
                                                        horizontal: 'right',
                                                    }}
                                                >

                                                    <DialogTitle>SUMMON WARRIORS</DialogTitle>
                                                    <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column' }}>
                                                        <Button variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }}>1</Button>
                                                        <Button variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }}>5</Button>
                                                        <Button variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }}>10</Button>
                                                        <Button variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }}>20</Button>
                                                        <Button variant='contained' sx={{ fontWeight: 'bold' }}>100</Button>
                                                    </Box>
                                                </Popover>
                                                <Button variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%', marginBottom: 1 }}>
                                                    CREATE LEGION
                                                </Button>
                                                <Button variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%' }}>
                                                    HUNT
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} >
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
                                            <Box sx={{ textAlign: 'center', width: '100%' }}>
                                                <Button variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%', marginBottom: 1 }}>
                                                    BUY BEASTS
                                                </Button>
                                                <Button variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%', marginBottom: 1 }}>
                                                    BUY WARRIORS
                                                </Button>
                                                <Button variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%', marginBottom: 1 }}>
                                                    BUY LEGIONS
                                                </Button>
                                                <Button variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%' }}>
                                                    BUY $BLST
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <ToSocialBtn
                    type="Discord"
                    linkUrl="Discord"
                />
                <ToSocialBtn
                    type="Twitter"
                    linkUrl="Discord"
                />
                <ToSocialBtn
                    type="Telegram"
                    linkUrl="Discord"
                />
                <ToSocialBtn
                    type="Youtube"
                    linkUrl="Discord"
                />
                <ToSocialBtn
                    type="Medium"
                    linkUrl="Discord"
                />
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box>
                    <Box>
                        <YouTube
                            videoId="j942wKiXFu8"
                            onReady={(e) => e.target.playVideo()}
                        />
                    </Box>
                    <a href="https://docs.google.com/document/d/1g90TDsCn4a8K3JcqCRkvAp72ux5RJu_6jMxcdFEE9SE/edit#" target={'blank'} style={{ color: 'white', border: 'none' }}>
                        <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: 2 }}>
                            READ INSTRUCTIONS IN WHITEPAPER
                        </Typography>
                    </a>
                </Box>
            </Box>
            <Box sx={{ position: 'fixed', bottom: 20, right: 20 }}>
                <Typography
                    className={classes.achievementBtn}
                    aria-owns={openYourAchievement ? 'your-achievement-popover' : undefined}
                    aria-haspopup="true"
                    onClick={handlePopoverOpenYourAchievement}
                    sx={{ fontWeight: 'bold', fontSize: 12 }}
                >
                    Your Achievements
                </Typography>
                <Popover
                    id="your-achievement-popover"
                    open={openYourAchievement}
                    anchorEl={anchorElYourAchievement}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    onClose={handlePopoverCloseYourAchievement}
                    disableRestoreFocus
                >
                    <Typography sx={{ p: 1 }}><Checkbox checked={true} /> Own a beast with 20 capacity.</Typography>
                    <Typography sx={{ p: 1 }}><Checkbox checked={false} /> Own a level 6 warrior.</Typography>
                    <Typography sx={{ p: 1 }}><Checkbox checked={true} /> Own 10 legions of 30K+ AP.</Typography>
                    <Typography sx={{ p: 1 }}><Checkbox checked={true} /> Hunt monster 22 successfully.</Typography>
                </Popover>
            </Box>
            <SimpleDialog
                open={openBeastDialog}
                onClose={handleCloseBeastDialog}
            />
        </Box >
    )
}

export default Home
