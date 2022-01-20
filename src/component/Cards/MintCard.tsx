import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type CardProps = {
    image: string;
    type: string;
    capacity: string;
};

export default function MintCard(props: CardProps) {
    const {
        image,
        type,
        capacity
    } = props;

    return (
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
            <CardActions>
                <Typography variant='h5' sx={{textAlign: 'center', width: '100%', padding: 1, fontWeight: 'bold'}}>
                    {capacity} Warriors
                </Typography>
            </CardActions>
        </Card>
    );
}
