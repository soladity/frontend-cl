import * as React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, ButtonGroup, Button, IconButton, Skeleton } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { useBloodstone, useBeast, useWarrior, useWeb3 } from '../../hooks/useContract';
import { getBeastToken, getWarriorToken } from '../../hooks/contractFunction';
import { formatNumber } from '../../utils/common';
import { getTranslation } from '../../utils/translation';

type CardProps = {
	id: string;
	image: string;
	name: string;
	beasts: Array<number>;
	warriors: Array<number>;
	supplies: string;
	attackPower: number;
	huntStatus: string;
	handleOpenSupply: Function;
};

export default function LegionCard(props: CardProps) {
	const {
		id,
		image,
		name,
		beasts,
		warriors,
		supplies,
		attackPower,
		huntStatus,
		handleOpenSupply
	} = props;

	const [loaded, setLoaded] = React.useState(false);
	const [show, setShow] = React.useState(false);
	const [showWarrior, setShowWarrior] = React.useState(true);
	const [beastList, setBeastList] = React.useState(Array);
	const [warriorList, setWarriorList] = React.useState(Array);

	const beastContract = useBeast();
	const warriorContract = useWarrior();
	const web3 = useWeb3();

	React.useEffect(() => {
		getBalance();
	}, []);

	const getBalance = async () => {
		let beast;
		let tempBeasts = [];
		for (let i = 0; i < beasts.length; i++) {
			beast = await getBeastToken(web3, beastContract, beasts[i]);
			tempBeasts.push({ ...beast, id: beasts[i] });
		}
		setBeastList(tempBeasts);
		let warrior;
		let tempWarriors = [];
		let itemList = [];
		for (let i = 0; i < warriors.length; i++) {
			itemList = [];
			warrior = await getWarriorToken(web3, warriorContract, warriors[i]);
			for (let j = 0; j < parseInt(warrior.strength); j++) {
				itemList.push(<img key={j} src='/assets/images/bloodstoneGrey.png' style={{ height: '15px' }} alt='icon' />)
			}
			tempWarriors.push({ ...warrior, id: warriors[i], item: itemList });
		}
		setWarriorList(tempWarriors);
	}

	const handleImageLoaded = () => {
		setLoaded(true);
	}

	const open = (id: string) => {
		handleOpenSupply(parseInt(id));
	}

	return (
		<Card sx={{ position: 'relative', height: '100%' }}>
			{
				show === false &&
				<CardMedia
					component="img"
					image={image}
					alt="Legion Image"
					loading="lazy"
					onLoad={handleImageLoaded}
				/>
			}
			{
				loaded === false &&
				<React.Fragment>
					<Skeleton variant="rectangular" width='100%' height='200px' />
					<Skeleton />
					<Skeleton width="60%" />
				</React.Fragment>
			}
			{
				show === true &&
				<CardContent sx={{ pt: 6, pb: 12 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={12}>
							<ButtonGroup variant="outlined" color="primary" sx={{ pt: 1 }}>
								<Button variant={showWarrior ? "contained" : "outlined"} onClick={() => { setShowWarrior(!showWarrior) }}>{getTranslation('warriors')}</Button>
								<Button variant={!showWarrior ? "contained" : "outlined"} onClick={() => { setShowWarrior(!showWarrior) }}>{getTranslation('beasts')}</Button>
							</ButtonGroup>
						</Grid>
					</Grid>
					<Grid container spacing={1} sx={{ pt: 2 }}>
						{
							showWarrior ? (
								warriorList.map((item: any, index) => (
									<Grid item xs={12} md={6} key={index}>
										<Box sx={{ backgroundColor: 'black', padding: 1, borderRadius: 1 }}>
											<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
												<Typography variant='subtitle2'>
													{item.type}
												</Typography>
												<Typography variant='subtitle2'>
													#{item.id}
												</Typography>
											</Box>
											<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
												<Typography variant='subtitle2'>
													{formatNumber(item.power)} AP
												</Typography>
												<Box>
													{item.item}
												</Box>
											</Box>
										</Box>
									</Grid>
								))
							) : (
								beastList.map((item: any, index) => (
									<Grid item xs={12} md={6} key={index}>
										<Box sx={{ backgroundColor: 'black', padding: 1, borderRadius: 1 }}>
											<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
												<Typography variant='subtitle2'>
													{item.type}
												</Typography>
												<Typography variant='subtitle2'>
													#{item.id}
												</Typography>
											</Box>
											<Box sx={{ display: 'flex', alignItems: 'center' }}>
												<Typography variant='subtitle2'>
													{item.capacity}
												</Typography>
												<img src='/assets/images/sword.png' style={{ height: '15px', marginLeft: '5px' }} alt='Sword' />
											</Box>
										</Box>
									</Grid>
								))
							)
						}
					</Grid>
				</CardContent>
			}
			<Typography variant='h6' sx={{ position: 'absolute', top: '15px', left: '20px', fontWeight: 'bold' }}>
				{name}
			</Typography>
			<Box sx={{ display: 'flex', position: 'absolute', alignItems: 'center', top: '15px', right: '10px', fontWeight: 'bold', cursor: 'pointer', color: huntStatus === 'green' ? 'green' : huntStatus === 'orange' ? 'orange' : 'red' }} onClick={() => open(id)}>
				{supplies} D
			</Box>
			<Box sx={{ display: 'flex', position: 'absolute', alignItems: 'center', bottom: '40px', left: 'calc(50% - 40px)', fontWeight: 'bold' }}>
				<Typography variant='h6' sx={{ fontWeight: 'bold', fontSize: '1.2rem', textShadow: '-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,2px 2px 0 #000' }}>W/{warriors.length} B/{beasts.length}</Typography>
			</Box>
			<Box sx={{ display: 'flex', position: 'absolute', alignItems: 'center', bottom: '10px', left: 'calc(50% - 50px)', fontWeight: 'bold' }}>
				<Typography variant='h6' sx={{ fontWeight: 'bold', fontSize: '1.4rem', textShadow: '-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,2px 2px 0 #000' }}>{formatNumber(attackPower)} AP</Typography>
			</Box>
			<Box sx={{ display: 'flex', position: 'absolute', bottom: '10px', right: '20px', cursor: 'pointer' }}>
				<img src='/assets/images/shopping.png' style={{ height: '20px' }} alt='Shopping' />
			</Box>
			<Box sx={{ display: 'flex', position: 'absolute', bottom: '55px', left: '20px', cursor: 'pointer' }}>
				{
					show === false ? (
						<IconButton aria-label="claim" component="span" sx={{ padding: 0 }} onClick={() => { setShow(!show) }}>
							<VisibilityIcon />
						</IconButton>
					) : (
						<IconButton aria-label="claim" component="span" sx={{ padding: 0 }} onClick={() => { setShow(!show) }}>
							<VisibilityOffIcon />
						</IconButton>
					)
				}
			</Box>
			<Box sx={{ display: 'flex', position: 'absolute', bottom: '30px', left: '20px', cursor: 'pointer' }}>
				<IconButton aria-label="claim" component="span" sx={{ padding: 0 }}>
					<CachedIcon />
				</IconButton>
			</Box>
			<Typography variant="subtitle2" sx={{ position: 'absolute', bottom: '8px', left: '20px', color: 'darkgrey' }}>
				#{id}
			</Typography>
		</Card>
	);
}