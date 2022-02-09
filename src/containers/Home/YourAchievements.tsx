import * as React from 'react'
import { Grid, Card, Box, Button, Popover, Checkbox, Dialog, DialogTitle } from '@mui/material';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { getTranslation } from '../../utils/translation';
import { useWeb3React } from '@web3-react/core';

import { getBeastTokenIds, getBeastToken } from '../../hooks/contractFunction';
import { useBeast, useWarrior, useWeb3 } from '../../hooks/useContract';

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
        padding: 10,
        borderRadius: 5,
        cursor: 'pointer',
        animation: `$Flash linear 1s infinite`,
        background: 'linear-gradient(360deg, #a54e00, #ffffff29), radial-gradient(#ecff0e, #a54e00)',
        '&:hover': {
            background: 'radial-gradient(#ab973c, #743700)'
        },
        border: '1px solid white !important',
        color: 'white !important',
        textShadow: "3px 3px 0 #00000085"
    },
    "@keyframes Flash": {
        "0%": {
            background: 'linear-gradient(360deg, #8d4405, #ffffff29), radial-gradient(#702c02, #98a500)',
            boxShadow: '0 0 1px 1px #a7a2a2, 0px 0px 1px 2px #a7a2a2 inset'
        },
        "50%": {
            background: 'linear-gradient(360deg, #973b04, #ffffff29), radial-gradient(#db5300, #ecff0e)',
            boxShadow: '0 0 4px 4px #a7a2a2, 0px 0px 1px 2px #a7a2a2 inset'
        },
        "100%": {
            background: 'linear-gradient(360deg, #8d4405, #ffffff29), radial-gradient(#702c02, #98a500)',
            boxShadow: '0 0 1px 1px #a7a2a2, 0px 0px 1px 2px #a7a2a2 inset'
        }
    }
});

const YourAchievements = () => {

    const {
        account,
    } = useWeb3React();

    const classes = useStyles();

    const [anchorElYourAchievement, setAnchorElYourAchievement] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpenYourAchievement = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElYourAchievement(event.currentTarget);
    };

    const handlePopoverCloseYourAchievement = () => {
        setAnchorElYourAchievement(null);
    };

    const openYourAchievement = Boolean(anchorElYourAchievement);

    //Beast Contract
    const beastContract = useBeast()
    const web3 = useWeb3()

    const [ownBeastWith20, setOwnBeastWith20] = React.useState(false)

    const getStatus = async () => {
        const ids = await getBeastTokenIds(web3, beastContract, account);
        console.log(ids)
        for (let i = 0; i < ids.length; i++) {
            const beast = await getBeastToken(web3, beastContract, ids[i]);
            console.log(beast)
        }
    }

    React.useEffect(() => {
        getStatus()
    }, [])

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
                <Typography sx={{ p: 1 }}><Checkbox checked={false} /> Own a beast with 20 capacity.</Typography>
                <Typography sx={{ p: 1 }}><Checkbox checked={false} /> Own a level 6 warrior.</Typography>
                <Typography sx={{ p: 1 }}><Checkbox checked={false} /> Own 10 legions of 30K+ AP.</Typography>
                <Typography sx={{ p: 1 }}><Checkbox checked={false} /> Hunt monster 22 successfully.</Typography>
            </Popover>
        </Box>
    )
}

export default YourAchievements