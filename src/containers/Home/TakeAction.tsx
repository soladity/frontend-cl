import * as React from 'react'
import { Grid, Card, Box, Button, Popover, Checkbox, Dialog, DialogTitle, Snackbar, Alert } from '@mui/material';
import Typography from '@mui/material/Typography';
import { FaTimes } from 'react-icons/fa'
import { getBeastBloodstoneAllowance, setBeastBloodstoneApprove, getWarriorBloodstoneAllowance, setWarriorBloodstoneApprove, mintBeast, mintWarrior } from '../../hooks/contractFunction';
import { useWeb3React } from '@web3-react/core';
import { useBloodstone, useBeast, useWarrior, useWeb3 } from '../../hooks/useContract';
import { useNavigate } from 'react-router-dom'
import Slide, { SlideProps } from '@mui/material/Slide';
import { useDispatch } from 'react-redux'
import { setReloadStatus } from '../../actions/contractActions'
import { getTranslation } from '../../utils/translation';
import { makeStyles } from '@mui/styles';

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionUp(props: TransitionProps) {
    return <Slide {...props} direction="up" />;
}

const useStyles = makeStyles({
    legionBtn: {
        background: 'linear-gradient(360deg, #973b04, #ffffff29), radial-gradient(#db5300, #ecff0e)',
        transition: '.4s all',
        '&:hover': {
            background: 'linear-gradient(360deg, #8d4405, #ffffff29), radial-gradient(#702c02, #98a500)',
            transition: '.4s all',
        },
        color: 'white !important',
        '-webkit-text-stroke': '1px #e89f30'
    },
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


const TakeAction = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const classes = useStyles();

    //Popover for Summon Beast
    const [anchorElSummonBeast, setAnchorElSummonBeast] = React.useState<HTMLElement | null>(null);
    const handlePopoverOpenSummonBeast = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElSummonBeast(event.currentTarget);
    };
    const handlePopoverCloseSummonBeast = () => {
        setAnchorElSummonBeast(null);
    };
    const openSummonBeast = Boolean(anchorElSummonBeast);

    //Popover for Summon Warrior
    const [anchorElSummonWarrior, setAnchorElSummonWarrior] = React.useState<HTMLElement | null>(null);
    const handlePopoverOpenSummonWarrior = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElSummonWarrior(event.currentTarget);
    };
    const handlePopoverCloseSummonWarrior = () => {
        setAnchorElSummonWarrior(null);
    };
    const openSummonWarrior = Boolean(anchorElSummonWarrior);

    //Account
    const {
        account,
    } = useWeb3React();

    const beastContract = useBeast();
    const warriorContract = useWarrior()
    const bloodstoneContract = useBloodstone();
    const web3 = useWeb3();

    //Mint Beast with quantity
    const handleBeastMint = async (amount: Number, Transition: React.ComponentType<TransitionProps>) => {
        handlePopoverCloseSummonBeast()
        const allowance = await getBeastBloodstoneAllowance(web3, bloodstoneContract, account);
        console.log('allowance --- ', allowance)
        if (allowance === '0') {
            await setBeastBloodstoneApprove(web3, bloodstoneContract, account);
        }
        await mintBeast(web3, beastContract, account, amount);

        setTransition(() => Transition);
        setSnackBarMessage(getTranslation('summonBeastSuccessful'))
        setSnackBarNavigation('/beasts')
        setOpenSnackBar(true)
        dispatch(setReloadStatus({
            reloadContractStatus: new Date()
        }))
    }

    //Mint Warriors with quantity
    const handleWarriorMint = async (amount: Number, Transition: React.ComponentType<TransitionProps>) => {
        handlePopoverCloseSummonWarrior()
        const allowance = await getWarriorBloodstoneAllowance(web3, bloodstoneContract, account);
        if (allowance === '0') {
            await setWarriorBloodstoneApprove(web3, bloodstoneContract, account);
        }
        await mintWarrior(web3, warriorContract, account, amount);

        setTransition(() => Transition);
        setSnackBarMessage(getTranslation('summonWarriorSuccessful'))
        setSnackBarNavigation('/warriors')
        setOpenSnackBar(true)
        dispatch(setReloadStatus({
            reloadContractStatus: new Date()
        }))
    }

    //SnackBar
    const [openSnackBar, setOpenSnackBar] = React.useState(false)
    const [snackBarMessage, setSnackBarMessage] = React.useState('')
    const [snackBarNavigation, setSnackBarNavigation] = React.useState('')
    const [transition, setTransition] = React.useState<
        React.ComponentType<TransitionProps> | undefined
    >(undefined);

    return (
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '180px',
            height: '100%',
            background: '#16161699'
        }}>
            <Snackbar
                open={openSnackBar}
                TransitionComponent={transition}
                autoHideDuration={6000}
                onClose={() => setOpenSnackBar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                key={transition ? transition.name : ''}
            >
                <Alert onClose={() => setOpenSnackBar(false)} variant='filled' severity="success" sx={{ width: '100%' }}>
                    <Box sx={{ cursor: 'pointer' }} onClick={() => navigate(snackBarNavigation)}>
                        {snackBarMessage}
                    </Box>
                </Alert>
            </Snackbar>
            <Box sx={{ p: 4, justifyContent: 'center' }}>
                <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #fff', marginBottom: 3 }}>
                    TAKE ACTION
                </Typography>
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
                                <Box sx={{ textAlign: 'center', width: '100%' }}>
                                    <Button variant="contained" className={classes.legionBtn} aria-describedby={'summon-beast-id'} onClick={handlePopoverOpenSummonBeast} sx={{ fontWeight: 'bold', fontSize: 12, width: '100%', marginBottom: 1 }}>
                                        {getTranslation('takeActionSummonBeast')}
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
                                        <Box sx={{ display: 'flex' }}>
                                            <Box sx={{ marginLeft: 'auto', cursor: 'pointer', marginRight: 1, marginTop: 1 }}><FaTimes onClick={handlePopoverCloseSummonBeast} /></Box>
                                        </Box>
                                        <DialogTitle>{getTranslation('takeActionSummonBeastQuantity')}</DialogTitle>
                                        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column' }}>
                                            <Button className={classes.legionBtn} variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }} onClick={() => handleBeastMint(1, TransitionUp)}>1</Button>
                                            <Button className={classes.legionBtn} variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }} onClick={() => handleBeastMint(5, TransitionUp)}>5</Button>
                                            <Button className={classes.legionBtn} variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }} onClick={() => handleBeastMint(10, TransitionUp)}>10</Button>
                                            <Button className={classes.legionBtn} variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }} onClick={() => handleBeastMint(20, TransitionUp)}>20</Button>
                                            <Button className={classes.legionBtn} variant='contained' sx={{ fontWeight: 'bold' }}>100</Button>
                                        </Box>
                                    </Popover>
                                    <Button className={classes.legionBtn} aria-describedby={'summon-warrior-id'} onClick={handlePopoverOpenSummonWarrior} variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%', marginBottom: 1 }}>
                                        {getTranslation('takeActionSummonWarrior')}
                                    </Button>
                                    <Popover
                                        id={'summon-warrior-id'}
                                        open={openSummonWarrior}
                                        anchorEl={anchorElSummonWarrior}
                                        onClose={handlePopoverCloseSummonWarrior}
                                        anchorOrigin={{
                                            vertical: 'center',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'center',
                                            horizontal: 'right',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex' }}>
                                            <Box sx={{ marginLeft: 'auto', cursor: 'pointer', marginRight: 1, marginTop: 1 }}><FaTimes onClick={handlePopoverCloseSummonWarrior} /></Box>
                                        </Box>
                                        <DialogTitle>{getTranslation('takeActionSummonWarriorQuantity')}</DialogTitle>
                                        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column' }}>
                                            <Button className={classes.legionBtn} variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }} onClick={() => handleWarriorMint(1, TransitionUp)}>1</Button>
                                            <Button className={classes.legionBtn} variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }} onClick={() => handleWarriorMint(5, TransitionUp)}>5</Button>
                                            <Button className={classes.legionBtn} variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }} onClick={() => handleWarriorMint(10, TransitionUp)}>10</Button>
                                            <Button className={classes.legionBtn} variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }} onClick={() => handleWarriorMint(20, TransitionUp)}>20</Button>
                                            <Button className={classes.legionBtn} variant='contained' sx={{ fontWeight: 'bold' }}>100</Button>
                                        </Box>
                                    </Popover>
                                    <Button className={classes.legionBtn} variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%', marginBottom: 1 }}>
                                        {getTranslation('takeActionCreateLegion')}
                                    </Button>
                                    <Button className={classes.legionBtn} variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%' }}>
                                        {getTranslation('takeActionHunt')}
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6} >
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
                                <Box sx={{ textAlign: 'center', width: '100%' }}>
                                    <Button className={classes.legionBtn} variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%', marginBottom: 1 }}>
                                        {getTranslation('takeActionBuyBeasts')}
                                    </Button>
                                    <Button className={classes.legionBtn} variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%', marginBottom: 1 }}>
                                        {getTranslation('takeActionBuyWarriors')}
                                    </Button>
                                    <Button className={classes.legionBtn} variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%', marginBottom: 1 }}>
                                        {getTranslation('takeActionBuyLegions')}
                                    </Button>
                                    <Button className={classes.legionBtn} variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%' }}>
                                        {getTranslation('takeActionBuyBlst')}
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Card>
    )
}

export default TakeAction