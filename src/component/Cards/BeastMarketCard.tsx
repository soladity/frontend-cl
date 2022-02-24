import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

import CommonBtn from '../../component/Buttons/CommonBtn';

type CardProps = {
	id: string;
	image: string;
	type: string;
	capacity: string;
	strength?: string;
	owner: boolean;
	price: string;
	handleCancel: Function;
	handleBuy: Function;
};

export default function BeastMarketCard(props: CardProps) {
	const {
		id,
		image,
		type,
		capacity,
		owner,
		price,
		handleCancel,
		handleBuy
	} = props;

	const [loaded, setLoaded] = React.useState(false);

	const handleImageLoaded = () => {
		setLoaded(true);
	}

	const cancel = (id: string) => {
		handleCancel(parseInt(id));
	}

	const buy = (id: string) => {
		handleBuy(parseInt(id));
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<Card sx={{ position: 'relative', width: '100%' }}>
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
				{
					owner === true &&
					<Box sx={{ display: 'flex', position: 'absolute', bottom: '15px', right: '20px', cursor: 'pointer' }} onClick={() => cancel(id)}>
						<img src='/assets/images/execute.png' style={{ height: '20px' }} alt='Cancel' />
					</Box>
				}
				<Typography variant="subtitle2" sx={{ position: 'absolute', bottom: '15px', left: '20px', color: 'darkgrey' }}>
					#{id}
				</Typography>
			</Card>
			{
				owner === false &&
				<CommonBtn sx={{ fontWeight: 'bold', marginTop: '10px', fontSize: '1rem' }} onClick={() => buy(id)}>
					{price} $BLST
				</CommonBtn>
			}
		</Box>
	);
}
