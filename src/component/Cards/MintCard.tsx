import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

type CardProps = {
    image: string;
    type: string;
    capacity: string;
    strength: string;
};

export default function MintCard(props: CardProps) {
    const {
        image,
        type,
        capacity,
        strength
    } = props;
    
    const [loaded, setLoaded] = React.useState(false);

    const handleImageLoaded = () => {
        setLoaded(true);
    }

    return (
        <Card sx={{ position: 'relative' }}>
            <CardMedia
                component="img"
                image={image}
                alt="Beast Image"
                loading="lazy"
                onLoad={handleImageLoaded}
            />
            {
                loaded === false &&
                <React.Fragment>
                    <Skeleton variant="rectangular" width='100%' height='200px' />
                    <Skeleton />
                    <Skeleton width="60%" />
                </React.Fragment>
            }
            <Typography variant='h6' sx={{ position: 'absolute', top: '15px', left: '20px', fontWeight: 'bold' }}>
                {type}
            </Typography>
            <Box sx={{ display: 'flex', position: 'absolute', top: '15px', right: '20px', fontWeight: 'bold' }}>
                <img src='/assets/images/sword.jpeg' style={{height: '25px', marginRight: '10px'}} alt='Sword' />
                <Typography variant='h6' sx={{fontWeight: 'bold'}}>{capacity}</Typography>
            </Box>
            <Box sx={{ display: 'flex', position: 'absolute', bottom: '15px', right: '20px', cursor: 'pointer' }}>
                <img src='/assets/images/shopping.png' style={{height: '25px'}} alt='Sword' />
            </Box>
        </Card>
    );
}
