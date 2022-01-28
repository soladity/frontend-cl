import React from 'react';
import Helmet from 'react-helmet';
import { Box, Typography, Grid, Card, CardMedia, ButtonGroup, Button, IconButton, FormLabel, FormControl, Slider } from '@mui/material';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';

import { meta_constant } from '../../config/meta.config';
import { getWarriorBloodstoneAllowance, setWarriorBloodstoneApprove, mintWarrior, getWarriorBalance, getWarriorTokenIds, getWarriorToken, getWarriorUrl } from '../../hooks/contractFunction';
import { useBloodstone, useWarrior, useWeb3 } from '../../hooks/useContract';
import WarriorCard from '../../component/Cards/WarriorCard';
import { getTranslation } from '../../utils/translation';
import { formatNumber } from '../../utils/common';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column'
	},
	card: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '180px'
	}
});

const Warriors = () => {
	const {
		account,
	} = useWeb3React();

	const [showMint, setShowMint] = React.useState(false);
	const [balance, setBalance] = React.useState('0');
	const [maxPower, setMaxPower] = React.useState(0);
	const [baseUrl, setBaseUrl] = React.useState('');
	const [warriors, setWarriors] = React.useState(Array);
	const [filter, setFilter] = React.useState('all');
	const [showAnimation, setShowAnimation] = React.useState<string | null>('0');
	const [loading, setLoading] = React.useState(false);
	const [apValue, setApValue] = React.useState<number[]>([500, 60000]);

	const classes = useStyles();
	const warriorContract = useWarrior();
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
		const allowance = await getWarriorBloodstoneAllowance(web3, bloodstoneContract, account);
		if (allowance === '0') {
			await setWarriorBloodstoneApprove(web3, bloodstoneContract, account);
		}
		await mintWarrior(web3, warriorContract, account, amount);
		getBalance();
	}

	const getBalance = async () => {
		setLoading(true);
		setBaseUrl(await getWarriorUrl(web3, warriorContract));
		setBalance(await getWarriorBalance(web3, warriorContract, account));
		const ids = await getWarriorTokenIds(web3, warriorContract, account);
		let amount = 0;
		let warrior;
		let tempWarriors = [];
		for (let i = 0; i < ids.length; i++) {
			warrior = await getWarriorToken(web3, warriorContract, ids[i]);
			tempWarriors.push({ ...warrior, id: ids[i] });
			amount += parseInt(warrior.power);
		}
		setMaxPower(amount);
		setWarriors(tempWarriors);
		setLoading(false);
	}

	const handleChangeAp = (
		event: Event,
		newValue: number | number[],
		activeThumb: number,
	) => {
		if (!Array.isArray(newValue)) {
			return;
		}

		if (activeThumb === 0) {
			setApValue([Math.min(newValue[0], apValue[1] - 1), apValue[1]]);
		} else {
			setApValue([apValue[0], Math.max(newValue[1], apValue[0] + 1)]);
		}
	};

	return <Box>
		<Helmet>
			<meta charSet="utf-8" />
			<title>{meta_constant.warriors.title}</title>
			<meta name="description" content={meta_constant.warriors.description} />
			{meta_constant.warriors.keywords && <meta name="keywords" content={meta_constant.warriors.keywords.join(',')} />}
		</Helmet>
		<Grid container spacing={2} sx={{ my: 4 }}>
			<Grid item xs={12} md={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							{getTranslation('summonWarrior')}
						</Typography>
						<Box onMouseOver={handleOpenMint} onMouseLeave={handleCloseMint} sx={{ pt: 1 }}>
							<Button variant="contained" sx={{ fontWeight: 'bold' }}>
								<IconButton aria-label="claim" component="span" sx={{ p: 0, mr: 1, color: 'black' }}>
									<HorizontalSplitIcon />
								</IconButton>
								{getTranslation('summonQuantity')}
							</Button>
							{
								showMint &&
								<Box className={classes.root} sx={{ pt: 2, '& button': { fontWeight: 'bold', mb: 1 } }}>
									<Button variant="contained" onClick={() => handleMint(1)}>
										1
									</Button>
									<Button variant="contained" onClick={() => handleMint(5)}>
										5
									</Button>
									<Button variant="contained" onClick={() => handleMint(10)}>
										10
									</Button>
									<Button variant="contained" onClick={() => handleMint(20)}>
										20
									</Button>
									<Button variant="contained" onClick={() => handleMint(100)}>
										100
									</Button>
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
							{getTranslation('currentWarriors')}
						</Typography>
						<Typography variant='h4' color='secondary' sx={{ fontWeight: 'bold' }}>
							{balance}
						</Typography>
						<Button variant="contained" sx={{ fontWeight: 'bold' }}>
							{getTranslation('createLegion')}
						</Button>
					</Box>
				</Card>
			</Grid>
			<Grid item xs={12} md={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							{getTranslation('attackPower')}
						</Typography>
						<Typography variant='h4' color='primary' sx={{ fontWeight: 'bold' }}>
							{formatNumber(maxPower)}
						</Typography>
					</Box>
				</Card>
			</Grid>
		</Grid>
		{
			loading === false &&
			<React.Fragment>
				<Grid container spacing={2} sx={{ my: 3 }}>
					<Grid item md={4} xs={12}>
						<FormControl component="fieldset">
							<FormLabel component="legend" style={{ marginBottom: 12 }}>{getTranslation('filterLevel')}:</FormLabel>
							<ButtonGroup variant="outlined" color="primary" aria-label="outlined button group">
								<Button variant={`${filter === 'all' ? 'contained' : 'outlined'}`} onClick={() => setFilter('all')}>{getTranslation('all')}</Button>
								<Button variant={`${filter === '1' ? 'contained' : 'outlined'}`} onClick={() => setFilter('1')}>1</Button>
								<Button variant={`${filter === '2' ? 'contained' : 'outlined'}`} onClick={() => setFilter('2')}>2</Button>
								<Button variant={`${filter === '3' ? 'contained' : 'outlined'}`} onClick={() => setFilter('3')}>3</Button>
								<Button variant={`${filter === '4' ? 'contained' : 'outlined'}`} onClick={() => setFilter('4')}>4</Button>
								<Button variant={`${filter === '5' ? 'contained' : 'outlined'}`} onClick={() => setFilter('5')}>5</Button>
								<Button variant={`${filter === '6' ? 'contained' : 'outlined'}`} onClick={() => setFilter('6')}>6</Button>
							</ButtonGroup>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={4}>
						<FormControl component="fieldset" sx={{ width: '90%' }}>
							<FormLabel component="legend">Filter by AP:</FormLabel>
							<Slider
								getAriaLabel={() => "Custom marks"}
								// defaultValue={20}
								value={apValue}
								min={500}
								max={60000}
								marks={[
									{ value: 500, label: '500' },
									{ value: 60000, label: formatNumber('60000') },
								]}
								step={1}
								valueLabelDisplay="auto"
								onChange={handleChangeAp}
								disableSwap
							/>
						</FormControl>
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ mb: 4 }}>
					{
						warriors.filter((item: any) => filter === 'all' ? parseInt(item.strength) >= 0 : item.strength === filter).filter((item: any) => apValue[0] < parseInt(item.power) && apValue[1] > parseInt(item.power)).map((item: any, index) => (
							<Grid item xs={12} sm={6} md={3} key={index}>
								<WarriorCard image={baseUrl + (showAnimation === '0' ? item['imageAlt'] : item['image'])} type={item['type']} power={item['power']} strength={item['strength']} id={item['id']} />
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
					<Typography variant='h4' >{getTranslation('loadingWarriors')}</Typography>
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

export default Warriors
