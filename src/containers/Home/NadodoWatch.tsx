import * as React from 'react'
import { Grid, Card, Box, Button, Popover, Checkbox, Dialog, DialogTitle } from '@mui/material';
import Typography from '@mui/material/Typography';
import { getTranslation } from '../../utils/translation';
import { FaGrinBeam } from 'react-icons/fa'

const NadodoWatch = () => {
    return (
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '180px',
            height: '100%',
            background: '#16161699'
        }}>
            <Box sx={{ p: 4, justifyContent: 'center' }}>
                <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #fff', marginBottom: 3 }}>
                    {getTranslation('nadodoWatching')}
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    {getTranslation('marketplaceTax')}: 15%
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    {getTranslation('huntTax')}: 2%
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    {getTranslation('buyTax')}: 2%
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    {getTranslation('sellTax')}: 8%
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    {getTranslation('legionDamagePerHunt')}: 2%
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    {getTranslation('summoningFee')}: 20$
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    {getTranslation('SuppliesFee14Hunts')}: 12$
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    {getTranslation('SuppliesFee28Hunts')}: 16$
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <span>{getTranslation('RewardPool')}:&nbsp;</span><FaGrinBeam style={{ color: 'lime' }} /> <span>&nbsp;Healthy</span>
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <span>{getTranslation('ReservePool')}:&nbsp;</span><FaGrinBeam style={{ color: 'lime' }} /> <span>&nbsp;Healthy</span>
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <span>{getTranslation('LiquidityPool')}:&nbsp;</span><FaGrinBeam style={{ color: 'lime' }} /> <span>&nbsp;Healthy</span>
                </Typography>
            </Box>
        </Card>
    )
}

export default NadodoWatch