import React from 'react';
import Helmet from 'react-helmet';
import { Box, Typography, Grid, Card, ButtonGroup, Button, IconButton, FormLabel, FormControl } from '@mui/material';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';

import { meta_constant } from '../../config/meta.config';
import { getBloodstoneAllowance, setBloodstoneApprove, mintBeast, getBeastBalance, getBeastTokenIds, getBeastToken, getBeastUrl } from '../../hooks/contractFunction';
import { useBloodstone, useBeast, useWeb3 } from '../../hooks/useContract';
import MintCard from '../../component/Cards/MintCard';

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

const Beasts = () => {
	const {
		account,
	} = useWeb3React();

	const [showMint, setShowMint] = React.useState(false);
	const [balance, setBalance] = React.useState('0');
	const [maxWarrior, setMaxWarrior] = React.useState(0);
	const [baseUrl, setBaseUrl] = React.useState('');
	const [beasts, setBeasts] = React.useState(Array);
	const [filter, setFilter] = React.useState('all');

	const classes = useStyles();
	const beastContract = useBeast();
	const bloodstoneContract = useBloodstone();
	const web3 = useWeb3();

	React.useEffect(() => {
		if (account) {
			getBalance();
		}
	}, []);

	const handleOpenMint = () => {
		setShowMint(true);
	};

	const handleCloseMint = () => {
		setShowMint(false);
	};

	const handleMint = async (amount: Number) => {
		const allowance = await getBloodstoneAllowance(web3, bloodstoneContract, account);
		if (allowance === '0') {
			await setBloodstoneApprove(web3, bloodstoneContract, account);
		}
		await mintBeast(web3, beastContract, account, amount);
		getBalance();
	}

	const getBalance = async () => {
		setBaseUrl(await getBeastUrl(web3, beastContract));
		setBalance(await getBeastBalance(web3, beastContract, account));
		const ids = await getBeastTokenIds(web3, beastContract, account);
		let amount = 0;
		let beast;
		let tempBeasts = [];
		for (let i = 0; i < ids.length; i++) {
			beast = await getBeastToken(web3, beastContract, ids[i]);
			tempBeasts.push(beast);
			amount += parseInt(beast.capacity);
		}
		setMaxWarrior(amount);
		setBeasts(tempBeasts);
	}

	return <Box>
		<Helmet>
			<meta charSet="utf-8" />
			<title>{meta_constant.beasts.title}</title>
			<meta name="description" content={meta_constant.beasts.description} />
			{meta_constant.beasts.keywords && <meta name="keywords" content={meta_constant.beasts.keywords.join(',')} />}
		</Helmet>
		<Grid container spacing={2} sx={{ my: 4 }}>
			<Grid item xs={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							Summon Beasts
						</Typography>
						<Box onMouseOver={handleOpenMint} onMouseLeave={handleCloseMint} sx={{ pt: 1 }}>
							<Button variant="contained" sx={{ fontWeight: 'bold' }}>
								<IconButton aria-label="claim" component="span" sx={{ p: 0, mr: 1, color: 'black' }}>
									<HorizontalSplitIcon />
								</IconButton>
								MINT QUANTITY
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
			<Grid item xs={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							Current Beasts
						</Typography>
						<Typography variant='h4' color='secondary' sx={{ fontWeight: 'bold' }}>
							{balance}
						</Typography>
					</Box>
				</Card>
			</Grid>
			<Grid item xs={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							Total Maximum Warriors Capacity
						</Typography>
						<Typography variant='h4' color='primary' sx={{ fontWeight: 'bold' }}>
							{maxWarrior}
						</Typography>
					</Box>
				</Card>
			</Grid>
		</Grid>
		<Grid container spacing={2} sx={{ my: 3 }}>
			<Grid item md={12}>
				<FormControl component="fieldset">
					<FormLabel component="legend" style={{ marginBottom: 12 }}>Filter by Beast Rarity:</FormLabel>
					<ButtonGroup variant="outlined" color="primary" aria-label="outlined button group">
						<Button variant={`${filter === 'all' ? 'contained' : 'outlined'}`} onClick={() => setFilter('all')}>All</Button>
						<Button variant={`${filter === '1' ? 'contained' : 'outlined'}`} onClick={() => setFilter('1')}>1</Button>
						<Button variant={`${filter === '2' ? 'contained' : 'outlined'}`} onClick={() => setFilter('2')}>2</Button>
						<Button variant={`${filter === '3' ? 'contained' : 'outlined'}`} onClick={() => setFilter('3')}>3</Button>
						<Button variant={`${filter === '4' ? 'contained' : 'outlined'}`} onClick={() => setFilter('4')}>4</Button>
						<Button variant={`${filter === '5' ? 'contained' : 'outlined'}`} onClick={() => setFilter('5')}>5</Button>
						<Button variant={`${filter === '6' ? 'contained' : 'outlined'}`} onClick={() => setFilter('6')}>6</Button>
					</ButtonGroup>
				</FormControl>
			</Grid>
		</Grid>
		<Grid container spacing={2} sx={{ mb: 4 }}>
			{
				beasts.filter((item: any) => filter === 'all' ? parseInt(item.strength) >= 0 : item.strength === filter).map((item: any, index) => (
					<Grid item xs={3} key={index}>
						<MintCard image={baseUrl + item['imageAlt']} type={item['type']} capacity={item['capacity']} />
					</Grid>
				))
			}
		</Grid>
	</Box>
}

export default Beasts
