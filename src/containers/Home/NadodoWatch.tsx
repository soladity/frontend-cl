import * as React from 'react'
import { Grid, Card, Box, Button, Popover, Checkbox, Dialog, DialogTitle } from '@mui/material';
import Typography from '@mui/material/Typography';

const NadodoWatch = () => {
    return (
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '180px',
            height: '100%'
        }}>
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
    )
}

export default NadodoWatch