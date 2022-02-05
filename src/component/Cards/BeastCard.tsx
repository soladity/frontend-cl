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
    id: string;
    image: string;
    type: string;
    capacity: string;
    strength?: string;
};

export default function BeastCard(props: CardProps) {
    const {
        id,
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
            <Box sx={{ display: 'flex', position: 'absolute', alignItems: 'center', top: '15px', right: '20px', fontWeight: 'bold' }}>
                <img src='/assets/images/sword.png' style={{ height: '20px', marginRight: '10px' }} alt='Sword' />
                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>{capacity}</Typography>
            </Box>
            <Box sx={{ display: 'flex', position: 'absolute', bottom: '15px', right: '20px', cursor: 'pointer' }}>
                <img src='/assets/images/shopping.png' style={{ height: '20px' }} alt='Shopping' />
            </Box>
            <Box sx={{ display: 'flex', position: 'absolute', bottom: '40px', left: '20px', cursor: 'pointer' }}>
                <img src='/assets/images/execute.png' style={{ height: '20px' }} alt='Execute' />
            </Box>
            <Typography variant="subtitle2" sx={{ position: 'absolute', bottom: '15px', left: '20px', color: 'darkgrey' }}>
                #{id}
            </Typography>
        </Card>
    );
}