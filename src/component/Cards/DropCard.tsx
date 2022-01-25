import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';

interface DropCardProps {
    image: string,
    type: string,
    capacity: string,
    baseIndex: number,
    toLeft: (index: number) => void
};

export const DropCard: React.FC<DropCardProps> = function DropCard({ image, type, capacity, baseIndex, toLeft }) {
    // const {
    //     image,
    //     type,
    //     capacity
    // } = props;

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
                <Button onClick={() => toLeft(baseIndex)} sx={{ position: 'absolute', top: '15px', right: '5px', fontWeight: 'bold' }}>X</Button>
                <CardActions>
                    <Typography variant='h5' sx={{ textAlign: 'center', width: '100%', padding: 1, fontWeight: 'bold' }}>
                        {capacity} Warriors
                    </Typography>
                </CardActions>
            </Card>
        </Grid>
    );
}
