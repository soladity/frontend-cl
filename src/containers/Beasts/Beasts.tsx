import React from 'react';
import Helmet from 'react-helmet';
import { Box, Typography, Grid, Card, CardMedia, ButtonGroup, Button, IconButton, FormLabel, FormControl } from '@mui/material';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';
import { NavLink } from 'react-router-dom';

import { meta_constant } from '../../config/meta.config';
import { getBeastBloodstoneAllowance, setBeastBloodstoneApprove, mintBeast, getBeastBalance, getBeastTokenIds, getBeastToken, getBaseJpgURL, getBaseGifURL } from '../../hooks/contractFunction';
import { useBloodstone, useBeast, useWeb3 } from '../../hooks/useContract';
import BeastCard from '../../component/Cards/BeastCard';
import CommonBtn from '../../component/Buttons/CommonBtn';
import { getTranslation } from '../../utils/translation';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column'
	},
	card: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '180px'
	},
	warning: {
		display: 'flex',
		minHeight: '80px',
	}
});

const Beasts = () => {
	const {
		account,
	} = useWeb3React();

	const [baseJpgUrl, setBaseJpgUrl] = React.useState('');
	const [baseGifUrl, setBaseGifUrl] = React.useState('');
	const [showMint, setShowMint] = React.useState(false);
	const [balance, setBalance] = React.useState('0');
	const [maxWarrior, setMaxWarrior] = React.useState(0);
	const [beasts, setBeasts] = React.useState(Array);
	const [filter, setFilter] = React.useState('all');
	const [showAnimation, setShowAnimation] = React.useState<string | null>('0');
	const [loading, setLoading] = React.useState(false);
	const [mintLoading, setMintLoading] = React.useState(false);

	const classes = useStyles();
	const beastContract = useBeast();
	const bloodstoneContract = useBloodstone();
	const web3 = useWeb3();


	React.useEffect(() => {
		if (account) {
			getBalance();
		}
		setShowAnimation(localStorage.getItem('showAnimation') ? localStorage.getItem('showAnimation') : '0');
	}, []);


	const handleOpenMint = () => {
		setShowMint(true);
	};

	const handleCloseMint = () => {
		setShowMint(false);
	};

	const handleMint = async (amount: Number) => {
		setMintLoading(true);
		const allowance = await getBeastBloodstoneAllowance(web3, bloodstoneContract, account);
		if (allowance === '0') {
			await setBeastBloodstoneApprove(web3, bloodstoneContract, account);
		}
		await mintBeast(web3, beastContract, account, amount);
		getBalance();
		setMintLoading(false);
	}

	const getBalance = async () => {
		setLoading(true);
		setBaseJpgUrl(await getBaseJpgURL(web3, beastContract));
		setBaseGifUrl(await getBaseGifURL(web3, beastContract));
		setBalance(await getBeastBalance(web3, beastContract, account));
		const ids = await getBeastTokenIds(web3, beastContract, account);
		let amount = 0;
		let beast;
		let tempBeasts = [];
		for (let i = 0; i < ids.length; i++) {
			beast = await getBeastToken(web3, beastContract, ids[i]);
			tempBeasts.push({ ...beast, id: ids[i] });
			amount += parseInt(beast.capacity);
		}
		setMaxWarrior(amount);
		setBeasts(tempBeasts);
		setLoading(false);
	}

	return <Box>
		<Helmet>
			<meta charSet="utf-8" />
			<title>{meta_constant.beasts.title}</title>
			<meta name="description" content={meta_constant.beasts.description} />
			{meta_constant.beasts.keywords && <meta name="keywords" content={meta_constant.beasts.keywords.join(',')} />}
		</Helmet>
		<Grid container spacing={2} sx={{ my: 4 }}>
			<Grid item xs={12}>
				<Card>
					<Box className={classes.warning} sx={{ p: 4, justifyContent: 'start', alignItems: 'center' }}>
						<Box sx={{ display: 'flex', flexDirection: 'column', mx: 4 }}>
							<Typography variant='h3' sx={{ fontWeight: 'bold' }}>
								{getTranslation('beasts')}
							</Typography>
						</Box>
					</Box>
				</Card>
			</Grid>
			<Grid item xs={12} md={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							{getTranslation('summonBeast')}
						</Typography>
						<Box onMouseOver={handleOpenMint} onMouseLeave={handleCloseMint} sx={{ pt: 1 }}>
							<CommonBtn sx={{ fontWeight: 'bold' }}>
								<IconButton aria-label="claim" component="span" sx={{ p: 0, mr: 1, color: 'black' }}>
									<HorizontalSplitIcon />
								</IconButton>
								{getTranslation('summonQuantity')}
							</CommonBtn>
							{
								showMint &&
								<Box className={classes.root} sx={{ pt: 2, '& button': { fontWeight: 'bold', mb: 1 } }}>
									<CommonBtn onClick={() => handleMint(1)}>
										1
									</CommonBtn>
									<CommonBtn onClick={() => handleMint(5)}>
										5
									</CommonBtn>
									<CommonBtn onClick={() => handleMint(10)}>
										10
									</CommonBtn>
									<CommonBtn onClick={() => handleMint(20)}>
										20
									</CommonBtn>
									<CommonBtn onClick={() => handleMint(100)}>
										100
									</CommonBtn>
								</Box>
							}
						</Box>
					</Box>
				</Card>
			</Grid>
			<Grid item xs={12} md={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							{getTranslation('currentBeasts')}
						</Typography>
						<Typography variant='h4' color='secondary' sx={{ fontWeight: 'bold' }}>
							{balance}
						</Typography>
						<CommonBtn sx={{ fontWeight: 'bold' }}>
							<NavLink to='/createlegions' className='non-style'>
								{getTranslation('createLegion')}
							</NavLink>
						</CommonBtn>
					</Box>
				</Card>
			</Grid>
			<Grid item xs={12} md={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							{getTranslation('warriorCapacity')}
						</Typography>
						<Typography variant='h4' color='primary' sx={{ fontWeight: 'bold' }}>
							{maxWarrior}
						</Typography>
					</Box>
				</Card>
			</Grid>
		</Grid>
		{
			(loading === false && mintLoading === false) &&
			<React.Fragment>
				<Grid container spacing={2} sx={{ my: 3 }}>
					<Grid item md={12}>
						<FormControl component="fieldset">
							<FormLabel component="legend" style={{ marginBottom: 12 }}>{getTranslation('filterCapacity')}:</FormLabel>
							<ButtonGroup variant="outlined" color="primary" aria-label="outlined button group">
								<Button variant={`${filter === 'all' ? 'contained' : 'outlined'}`} onClick={() => setFilter('all')}>{getTranslation('all')}</Button>
								<Button variant={`${filter === '1' ? 'contained' : 'outlined'}`} onClick={() => setFilter('1')}>1</Button>
								<Button variant={`${filter === '2' ? 'contained' : 'outlined'}`} onClick={() => setFilter('2')}>2</Button>
								<Button variant={`${filter === '3' ? 'contained' : 'outlined'}`} onClick={() => setFilter('3')}>3</Button>
								<Button variant={`${filter === '4' ? 'contained' : 'outlined'}`} onClick={() => setFilter('4')}>4</Button>
								<Button variant={`${filter === '5' ? 'contained' : 'outlined'}`} onClick={() => setFilter('5')}>5</Button>
								<Button variant={`${filter === '20' ? 'contained' : 'outlined'}`} onClick={() => setFilter('20')}>20</Button>
							</ButtonGroup>
						</FormControl>
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ mb: 4 }}>
					{
						beasts.filter((item: any) => filter === 'all' ? parseInt(item.capacity) >= 0 : item.capacity === filter).map((item: any, index) => (
							<Grid item xs={12} sm={6} md={3} key={index}>
								<BeastCard image={(showAnimation === '0' ? baseJpgUrl + '/' + item['strength'] + '.jpg' : baseGifUrl + '/' + item['strength'] + '.gif')} type={item['type']} capacity={item['capacity']} strength={item['strength']} id={item['id']} />
							</Grid>
						))
					}
				</Grid>
			</React.Fragment>
		}
		{
			loading === true &&
			<>
				<Grid item xs={12} sx={{ p: 4, textAlign: 'center' }}>
					<Typography variant='h4' >{getTranslation('loadingBeasts')}</Typography>
				</Grid>
				<Grid container sx={{ justifyContent: 'center' }}>
					<Grid item xs={1}>
						<Card>
							<CardMedia
								component="img"
								image="/assets/images/loading.gif"
								alt="Loading"
								loading="lazy"
							/>
						</Card>
					</Grid>
				</Grid>
			</>
		}
		{
			mintLoading === true &&
			<>
				<Grid item xs={12} sx={{ p: 4, textAlign: 'center' }}>
					<Typography variant='h4' >{getTranslation('summoningBeasts')}</Typography>
				</Grid>
				<Grid container sx={{ justifyContent: 'center' }}>
					<Grid item xs={1}>
						<Card>
							<CardMedia
								component="img"
								image="/assets/images/loading.gif"
								alt="Loading"
								loading="lazy"
							/>
						</Card>
					</Grid>
				</Grid>
			</>
		}
	</Box>
}

export default Beasts