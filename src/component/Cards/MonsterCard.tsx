import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid'

type CardProps = {
    image: string,
    minAP: string
    base: string
    bouns: string
    price: string
    isHuntable: boolean
};

export const MonsterCard: React.FC<CardProps> = function MonsterCard({ image, minAP, base, bouns, price, isHuntable }) {

    const [loaded, setLoaded] = React.useState(false);

    const handleImageLoaded = () => {
        setLoaded(true);
    }

    return (
        <Card sx={{ position: 'relative' }}>
            <CardMedia
                component="img"
                image={image}
                alt="Monster Image"
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
            <Grid container direction='column' spacing={2} sx={{ position: 'absolute', alignItems: 'center', top: '15px', left: '0px', fontWeight: 'bold' }}>
                <Grid item xs={12}><Typography variant='h6'>3 Name</Typography></Grid>
                <Grid container spacing={2} sx={{ justifyContent: 'space-around' }}>
                    <Grid item>
                        <Typography variant='subtitle2'>MIN AP</Typography>
                        <Typography variant='subtitle2'>{minAP}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='subtitle2'>Base %</Typography>
                        <Typography variant='subtitle2'>{base}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='subtitle2'>Bouns %</Typography>
                        <Typography variant='subtitle2'>{bouns}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container sx={{ position: 'absolute', bottom: '15px', left: '0px', color: 'darkgrey', justifyContent: 'space-around' }}>
                <Grid item><Typography variant="subtitle2">{base}% to win</Typography></Grid>
                <Grid item>{price} $BLST</Grid>
                <Grid item><Button variant='outlined' disabled={!isHuntable}>HUNT</Button></Grid>
            </Grid>
        </Card>
    );
}
