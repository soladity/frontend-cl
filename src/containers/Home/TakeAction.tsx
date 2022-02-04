import * as React from 'react'
import { Grid, Card, Box, Button, Popover, Checkbox, Dialog, DialogTitle } from '@mui/material';
import Typography from '@mui/material/Typography';
import { FaTimes } from 'react-icons/fa'

const TakeAction = () => {

    const [anchorElSummonBeast, setAnchorElSummonBeast] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpenSummonBeast = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElSummonBeast(event.currentTarget);
    };

    const handlePopoverCloseSummonBeast = () => {
        setAnchorElSummonBeast(null);
    };

    const openSummonBeast = Boolean(anchorElSummonBeast);

    const [anchorElSummonWarrior, setAnchorElSummonWarrior] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpenSummonWarrior = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElSummonWarrior(event.currentTarget);
    };

    const handlePopoverCloseSummonWarrior = () => {
        setAnchorElSummonWarrior(null);
    };

    const openSummonWarrior = Boolean(anchorElSummonWarrior);

    return (
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '180px',
            height: '100%'
        }}>
            <Box sx={{ p: 4, justifyContent: 'center' }}>
                <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #fff', marginBottom: 3 }}>
                    TAKE ACTION
                </Typography>
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
                                <Box sx={{ textAlign: 'center', width: '100%' }}>
                                    <Button variant="contained" aria-describedby={'summon-beast-id'} onClick={handlePopoverOpenSummonBeast} sx={{ fontWeight: 'bold', fontSize: 12, width: '100%', marginBottom: 1 }}>
                                        SUMMON BEAST
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
                                        <DialogTitle>SUMMON BEAST</DialogTitle>
                                        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column' }}>
                                            <Button variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }}>1</Button>
                                            <Button variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }}>5</Button>
                                            <Button variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }}>10</Button>
                                            <Button variant='contained' sx={{ marginBottom: 1, fontWeight: 'bold' }}>20</Button>
                                            <Button variant='contained' sx={{ fontWeight: 'bold' }}>100</Button>
                                        </Box>
                                    </Popover>
                                    <Button aria-describedby={'summon-warrior-id'} onClick={handlePopoverOpenSummonWarrior} variant="contained" sx={{ fontWeight: 'bold', fontSize: 12, width: '100%', marginBottom: 1 }}>
                                        SUMMON WARROIR
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
    )
}

export default TakeAction