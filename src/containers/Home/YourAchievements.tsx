import * as React from 'react'
import { Grid, Card, Box, Button, Popover, Checkbox, Dialog, DialogTitle } from '@mui/material';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { getTranslation } from '../../utils/translation';

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
const YourAchievements = () => {

    const classes = useStyles();

    const [anchorElYourAchievement, setAnchorElYourAchievement] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpenYourAchievement = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElYourAchievement(event.currentTarget);
    };

    const handlePopoverCloseYourAchievement = () => {
        setAnchorElYourAchievement(null);
    };

    const openYourAchievement = Boolean(anchorElYourAchievement);

    return (
        <Box sx={{ position: 'fixed', bottom: 20, right: 20 }}>
            <Typography
                className={classes.achievementBtn}
                aria-owns={openYourAchievement ? 'your-achievement-popover' : undefined}
                aria-haspopup="true"
                onClick={handlePopoverOpenYourAchievement}
                sx={{ fontWeight: 'bold', fontSize: 12 }}
            >
                {getTranslation('yourAchievements')}
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
    )
}

export default YourAchievements