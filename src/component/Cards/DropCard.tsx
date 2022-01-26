import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

interface DropCardProps {
    image: string,
    type: string,
    capacity: string,
    baseIndex: number,
    w5b: boolean,
    toLeft: (index: number, w5b: boolean) => void
};

export const DropCard: React.FC<DropCardProps> = function DropCard({ image, type, capacity, baseIndex, w5b, toLeft }) {
    return (
        <Grid item xs={3}>
            <Card sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    image={image}
                    alt="Beast Image"
                    loading="lazy"
                />
                <Typography variant='h6' sx={{ position: 'absolute', top: '15px', left: '20px', fontWeight: 'bold' }}>
                    {type}
                </Typography>
                <Box sx={{ display: 'flex', position: 'absolute', top: '15px', right: '20px', fontWeight: 'bold' }}>
                    <img src='/assets/images/sword.jpeg' style={{ height: '25px', marginRight: '10px' }} alt='Sword' />
                    <Typography variant='h6' sx={{ fontWeight: 'bold' }}>{capacity}</Typography>
                </Box>
                <Box sx={{ display: 'flex', position: 'absolute', bottom: '15px', right: '20px', cursor: 'pointer' }}>
                    <Button color="error" onClick={() => toLeft(baseIndex, w5b)}>X</Button>
                </Box>
            </Card>
        </Grid>
    );
}
