import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CardsComponent from '../../component/Cards/Cards';
import { Grid, Card, Box, Button, Popover } from '@mui/material';
import { meta_constant } from '../../config/meta.config';
import Helmet from 'react-helmet';
import { makeStyles } from '@mui/styles';
import { getTranslation } from '../../utils/translation';
import ToSocialBtn from '../../component/Buttons/ToSocialBtn';
import YouTube from 'react-youtube';

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
});

const Home = () => {

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClickCreateLegion = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseCreateLegion = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'create-legion-popover' : undefined;

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
                                YOUR LEGIONS:
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
                            <Box sx={{ textAlign: 'center', marginBottom: 1 }}>
                                <Button variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%' }}>
                                    SUMMON BEAST
                                </Button>
                            </Box>
                            <Box sx={{ textAlign: 'center', marginBottom: 1 }}>
                                <Button variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%' }}>
                                    SUMMON WARROIR
                                </Button>
                            </Box>
                            <Box sx={{ textAlign: 'center', marginBottom: 1 }}>

                                <Button aria-describedby={id} variant="contained" onClick={handleClickCreateLegion} sx={{ fontWeight: 'bold', fontSize: 12, width: '100%' }}>
                                    CREATE LEGION
                                </Button>
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleCloseCreateLegion}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    style={{ marginTop: 6, padding: 10 }}
                                >
                                    <Box sx={{ p: 2 }}>
                                        <Box sx={{ textAlign: 'center', marginBottom: 1 }}>
                                            <Button variant="contained" color="primary" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%' }}>
                                                BUY BEASTS
                                            </Button>
                                        </Box>
                                        <Box sx={{ textAlign: 'center', marginBottom: 1 }}>
                                            <Button variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%' }}>
                                                BUY WARRIORS
                                            </Button>
                                        </Box>
                                        <Box sx={{ textAlign: 'center', marginBottom: 1 }}>
                                            <Button variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%' }}>
                                                BUY LEGIONS
                                            </Button>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Button variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%' }}>
                                                BUY $BLST
                                            </Button>
                                        </Box>
                                    </Box>
                                </Popover>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Button variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%' }}>
                                    HUNT
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 32, marginBottom: 4 }}>
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
            </Box>
            <Box sx={{ display: 'flex' }}>
                <Box>
                    <Card className={classes.card}>
                        <Box sx={{ p: 4, justifyContent: 'center' }}>
                            <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #fff', marginBottom: 3 }}>
                                YOUR ACHIEVEMENTS
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
                </Box>
                <Box>
                    <YouTube
                        videoId="j942wKiXFu8"
                        onReady={(e) => e.target.pauseVideo()}
                    />
                </Box>
                <Box>

                </Box>
            </Box>
        </Box >
    )
}

export default Home
