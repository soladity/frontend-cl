import React from 'react';
import Helmet from 'react-helmet';
import { Box, Typography, Grid, Card, CardMedia, ButtonGroup, Button, IconButton, FormLabel, FormControl, Slider } from '@mui/material';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';
import { NavLink } from 'react-router-dom';

import { meta_constant } from '../../config/meta.config';
import { getWarriorBloodstoneAllowance, setWarriorBloodstoneApprove, mintWarrior, getOnMarketplace, getWarriorTokenIds, getWarriorToken, getBaseJpgURL, getBaseGifURL, getOwner, cancelMarketplace, buyToken, getPrice } from '../../hooks/contractFunction';
import { useBloodstone, useWarrior, useWeb3 } from '../../hooks/useContract';
import WarriorMarketCard from '../../component/Cards/WarriorMarketCard';
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
	},
	warning: {
		display: 'flex',
		minHeight: '80px',
	}
});

type WarriorProps = {
	id: string;
	type: string;
	power: string;
	strength: string;
	owner: boolean;
	price: string;
};

const Warriors = () => {
	const {
		account,
	} = useWeb3React();

	const [baseJpgUrl, setBaseJpgUrl] = React.useState('');
	const [baseGifUrl, setBaseGifUrl] = React.useState('');
	const [sortAp, setSortAp] = React.useState(false);
	const [sortBlst, setSortBlst] = React.useState(false);
	const [warriors, setWarriors] = React.useState(Array);
	const [filter, setFilter] = React.useState('all');
	const [showAnimation, setShowAnimation] = React.useState<string | null>('0');
	const [loading, setLoading] = React.useState(false);
	const [apValue, setApValue] = React.useState<number[]>([500, 6000]);
	const [mintLoading, setMintLoading] = React.useState(false);

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

	const handleMint = async (amount: Number) => {
		setMintLoading(true);
		const allowance = await getWarriorBloodstoneAllowance(web3, bloodstoneContract, account);
		if (allowance === '0') {
			await setWarriorBloodstoneApprove(web3, bloodstoneContract, account);
		}
		await mintWarrior(web3, warriorContract, account, amount);
		getBalance();
		setMintLoading(false);
	}

	const getBalance = async () => {
		setLoading(true);
		setBaseJpgUrl(await getBaseJpgURL(web3, warriorContract));
		setBaseGifUrl(await getBaseGifURL(web3, warriorContract));

		const ids = await getOnMarketplace(web3, warriorContract);
		let warrior;
		let owner;
		let price;
		let tempWarriors = [];
		for (let i = 0; i < ids.length; i++) {
			warrior = await getWarriorToken(web3, warriorContract, ids[i]);
			owner = await getOwner(web3, warriorContract, ids[i]);
			price = await getPrice(web3, warriorContract, ids[i]);
			tempWarriors.push({ ...warrior, id: ids[i], owner: owner === account ? true : false, price: price });
		}
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

	const handleCancel = async (id: number) => {
		await cancelMarketplace(web3, warriorContract, account, id);
		setWarriors(warriors.filter((item: any) => parseInt(item.id) !== id));
	}

	const handleBuy = async (id: number) => {
		await buyToken(web3, warriorContract, account, id);
		getBalance();
	}

	const handleSortAp = (value: boolean) => {
		setSortAp(value);
		handleSort('ap');
	}

	const handleSortBlst = (value: boolean) => {
		setSortBlst(value);
		handleSort('blst');
	}

	const handleSort = (type: string) => {
		let temp = warriors;
		temp.sort((a: any, b: any) => {
			if (type === 'ap') {
				if (sortAp === true) {
					if (parseInt(a.power) > parseInt(b.power)) {
						return 1;
					}
					if (parseInt(a.power) < parseInt(b.power)) {
						return -1;
					}
				} else {
					if (parseInt(a.power) > parseInt(b.power)) {
						return -1;
					}
					if (parseInt(a.power) < parseInt(b.power)) {
						return 1;
					}
				}
			} else {
				if (sortBlst === true) {
					if (parseInt(a.price) > parseInt(b.price)) {
						return 1;
					}
					if (parseInt(a.price) < parseInt(b.price)) {
						return -1;
					}
				} else {
					if (parseInt(a.price) > parseInt(b.price)) {
						return -1;
					}
					if (parseInt(a.price) < parseInt(b.price)) {
						return 1;
					}
				}
			}
			return 0;
		});
		setWarriors(temp);
	}

	return <Box>
		<Helmet>
			<meta charSet="utf-8" />
			<title>{meta_constant.warriors.title}</title>
			<meta name="description" content={meta_constant.warriors.description} />
			{meta_constant.warriors.keywords && <meta name="keywords" content={meta_constant.warriors.keywords.join(',')} />}
		</Helmet>
		<Grid container spacing={2} sx={{ my: 4 }}>
			<Grid item xs={12}>
				<Card>
					<Box className={classes.warning} sx={{ p: 4, justifyContent: 'start', alignItems: 'center' }}>
						<Box sx={{ display: 'flex', flexDirection: 'column', mx: 4 }}>
							<Typography variant='h3' sx={{ fontWeight: 'bold' }}>
								{getTranslation('warriors')} {getTranslation('marketplace')}
							</Typography>
						</Box>
					</Box>
				</Card>
			</Grid>
		</Grid>
		{
			(loading === false && mintLoading === false) &&
			<React.Fragment>
				<Grid container spacing={2} sx={{ my: 3 }}>
					<Grid item md={3} xs={12}>
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
					<Grid item xs={12} md={3}>
						<FormControl component="fieldset" sx={{ width: '90%' }}>
							<FormLabel component="legend">Filter by AP:</FormLabel>
							<Slider
								getAriaLabel={() => "Custom marks"}
								// defaultValue={20}
								value={apValue}
								min={500}
								max={6000}
								marks={[
									{ value: 500, label: '500' },
									{ value: 6000, label: formatNumber('6K+') },
								]}
								step={1}
								valueLabelDisplay="auto"
								onChange={handleChangeAp}
								disableSwap
							/>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={3}>
						<FormControl component="fieldset" sx={{ width: '90%' }}>
							<FormLabel component="legend">{getTranslation('sortByAp')}:</FormLabel>
							<ButtonGroup variant="outlined" color="primary" sx={{ pt: 1 }}>
								<Button variant={!sortAp ? "contained" : "outlined"} onClick={() => { handleSortAp(!sortAp) }}>{getTranslation('lowest')}</Button>
								<Button variant={sortAp ? "contained" : "outlined"} onClick={() => { handleSortAp(!sortAp) }}>{getTranslation('highest')}</Button>
							</ButtonGroup>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={3}>
						<FormControl component="fieldset" sx={{ width: '90%' }}>
							<FormLabel component="legend">{getTranslation('sortBy')} $:</FormLabel>
							<ButtonGroup variant="outlined" color="primary" sx={{ pt: 1 }}>
								<Button variant={!sortBlst ? "contained" : "outlined"} onClick={() => { handleSortBlst(!sortBlst) }}>{getTranslation('lowest')}</Button>
								<Button variant={sortBlst ? "contained" : "outlined"} onClick={() => { handleSortBlst(!sortBlst) }}>{getTranslation('highest')}</Button>
							</ButtonGroup>
						</FormControl>
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ mb: 4 }}>
					{
						warriors.filter((item: any) => filter === 'all' ? parseInt(item.strength) >= 0 : item.strength === filter).filter((item: any) => apValue[0] < parseInt(item.power) && (apValue[1] === 6000 ? true : apValue[1] > parseInt(item.power))).map((item: any, index) => (
							<Grid item xs={12} sm={6} md={3} key={index}>
								<WarriorMarketCard image={(showAnimation === '0' ? baseJpgUrl + '/' + item['strength'] + '.jpg' : baseGifUrl + '/' + item['strength'] + '.gif')} type={item['type']} power={item['power']} strength={item['strength']} id={item['id']} owner={item['owner']} price={item['price']} handleCancel={handleCancel} handleBuy={handleBuy} />
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
		{
			mintLoading === true &&
			<>
				<Grid item xs={12} sx={{ p: 4, textAlign: 'center' }}>
					<Typography variant='h4' >{getTranslation('summoningWarriors')}</Typography>
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
