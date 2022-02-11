import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CardsComponent from '../../component/Cards/Cards';
import { Grid, Card, Box, Button, Popover, Checkbox, Dialog, DialogTitle } from '@mui/material';
import { meta_constant } from '../../config/meta.config';
import Helmet from 'react-helmet';
import { makeStyles } from '@mui/styles';
import { getTranslation } from '../../utils/translation';
import YouTube from 'react-youtube';
import { Link } from 'react-router-dom'
import YourInventory from './YourInventory';
import NadodoWatch from './NadodoWatch';
import TakeAction from './TakeAction';
import ToSocial from './ToSocial';
import YourAchievements from './YourAchievements';
import nicahBackground from '../../assets/images/nicah_background.jpg'

export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
}

const Home = () => {

    const [anchorElYourAchievement, setAnchorElYourAchievement] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpenYourAchievement = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElYourAchievement(event.currentTarget);
    };

    const handlePopoverCloseYourAchievement = () => {
        setAnchorElYourAchievement(null);
    };

    const openYourAchievement = Boolean(anchorElYourAchievement);

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
                    <NadodoWatch />
                </Grid>
                <Grid item xs={12} md={4}>
                    <YourInventory />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TakeAction />
                </Grid>
            </Grid>
            <ToSocial />
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                <Box sx={{ width: '100%' }}>
                    <Grid spacing={2} container>
                        <Grid item md={3} sm={2} xs={1}>
                        </Grid>
                        <Grid item md={6} sm={8} xs={10}>
                            <YouTube
                                videoId="SA-PmNW7syw"
                                opts={{ width: '100%', height: '100%' }}
                            />
                        </Grid>
                        <Grid item md={3} sm={2} xs={1}>
                        </Grid>
                    </Grid>
                    <a href="https://docs.cryptolegions.app/" target={'blank'} style={{ color: 'white', border: 'none' }}>
                        <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: 2 }}>
                            READ INSTRUCTIONS IN WHITEPAPER
                        </Typography>
                    </a>
                </Box>
            </Box>
            <YourAchievements />
        </Box >
    )
}

export default Home
