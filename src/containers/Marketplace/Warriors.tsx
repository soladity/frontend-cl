import React from 'react';
import Helmet from 'react-helmet';
import { Box, Typography, Grid, Card, CardMedia, ButtonGroup, Button, Checkbox, FormLabel, FormControl, Slider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';

import { meta_constant } from '../../config/meta.config';
import { setReloadStatus } from '../../actions/contractActions';
import Navigation from '../../component/Navigation/Navigation';
import { getOnMarketplace, getWarriorToken, getBaseUrl, getMarketplaceBloodstoneAllowance, setMarketplaceBloodstoneApprove, cancelMarketplace, buyToken, getMarketItem } from '../../hooks/contractFunction';
import { useWarrior, useMarketplace, useBloodstone, useWeb3 } from '../../hooks/useContract';
import WarriorMarketCard from '../../component/Cards/WarriorMarketCard';
import { getTranslation } from '../../utils/translation';
import { formatNumber } from '../../utils/common';
import Image from '../../config/image.json';

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

	const [baseUrl, setBaseUrl] = React.useState('');
	const [sort, setSort] = React.useState('0');
	const [warriors, setWarriors] = React.useState(Array);
	const [filter, setFilter] = React.useState('all');
	const [onlyMyWarrior, setOnlyMyWarrior] = React.useState(false);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [showAnimation, setShowAnimation] = React.useState<string | null>('0');
	const [loading, setLoading] = React.useState(false);
	const [actionLoading, setActionLoading] = React.useState(false);
	const [apValue, setApValue] = React.useState<number[]>([500, 6000]);

	const classes = useStyles();
	const warriorContract = useWarrior();
	const marketplaceContract = useMarketplace();
	const bloodstoneContract = useBloodstone();
	const web3 = useWeb3();
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (account) {
			getBalance();
		}
		setShowAnimation(localStorage.getItem('showAnimation') ? localStorage.getItem('showAnimation') : '0');
	}, []);

	const getBalance = async () => {
		setLoading(true);
		setBaseUrl(await getBaseUrl());

		const ids = await getOnMarketplace(web3, warriorContract);
		let warrior;
		let marketItem;
		let tempWarriors = [];
		let gif = '';
		let jpg = '';
		for (let i = 0; i < ids.length; i++) {
			warrior = await getWarriorToken(web3, warriorContract, ids[i]);
			for (let j = 0; j < Image.warriors.length; j++) {
				if (Image.warriors[j].name === warrior.type) {
					gif = Image.warriors[j].gif;
					jpg = Image.warriors[j].jpg;
				}
			}
			marketItem = await getMarketItem(web3, marketplaceContract, '2', ids[i]);
			tempWarriors.push({ ...warrior, id: ids[i], owner: marketItem.owner === account ? true : false, price: marketItem.price, gif: gif, jpg: jpg });
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
		setActionLoading(true);
		try {
			await cancelMarketplace(web3, marketplaceContract, account, '2', id);
			setWarriors(warriors.filter((item: any) => parseInt(item.id) !== id));
		} catch (e){
			console.log(e);
		}
		setActionLoading(false);
	}

	const handleBuy = async (id: number) => {
		setActionLoading(true);
		const allowance = await getMarketplaceBloodstoneAllowance(web3, bloodstoneContract, account);
		try {
			if (allowance === '0') {
				await setMarketplaceBloodstoneApprove(web3, bloodstoneContract, account);
			}
			await buyToken(web3, marketplaceContract, account, '2', id);
			dispatch(setReloadStatus({
				reloadContractStatus: new Date()
			}))
			setWarriors(warriors.filter((item: any) => parseInt(item.id) !== id));
		} catch (e){
			console.log(e);
		}
		setActionLoading(false);
	}

	const handleSort = (value: string) => {
		setSort(value);
		handleSortValue(value);
	}

	const handleSortValue = (value: string) => {
		let temp = warriors;
		temp.sort((a: any, b: any) => {
			if (value === '1' || value === '2') {
				if (value === '2') {
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
				if (value === '4') {
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

	const handlePage = (value: any) => {
		setCurrentPage(value);
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
					<Box className={classes.warning} sx={{ p: { xs: 1, md: 4 }, justifyContent: 'start', alignItems: 'center' }}>
						<Box sx={{ display: 'flex', flexDirection: 'column', mx: { xs: 1, md: 4 } }}>
							<Typography variant='h3' sx={{ fontWeight: 'bold' }}>
								{getTranslation('warriors')} {getTranslation('marketplace')}
							</Typography>
						</Box>
					</Box>
				</Card>
			</Grid>
		</Grid>
		{
			(loading === false && actionLoading === false) &&
			<div>
				<Grid container spacing={2} sx={{ my: 3 }}>
					<Grid item xs={12} md={6} lg={6} xl={3}>
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
					<Grid item xs={12} md={6} lg={6} xl={3}>
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
					<Grid item xs={12} md={6} lg={4} xl={4}>
						<FormControl component="fieldset" sx={{ width: '90%' }}>
							<FormLabel component="legend">{getTranslation('sortBy')}:</FormLabel>
							<ButtonGroup variant="outlined" color="primary" sx={{ pt: 1 }}>
								<Button variant={sort === '1' ? "contained" : "outlined"} onClick={() => { handleSort('1') }}>{getTranslation('lowest')} AP</Button>
								<Button variant={sort === '2' ? "contained" : "outlined"} onClick={() => { handleSort('2') }}>{getTranslation('highest')} AP</Button>
								<Button variant={sort === '3' ? "contained" : "outlined"} onClick={() => { handleSort('3') }}>{getTranslation('lowest')} $</Button>
								<Button variant={sort === '4' ? "contained" : "outlined"} onClick={() => { handleSort('4') }}>{getTranslation('highest')} $</Button>
							</ButtonGroup>
						</FormControl>
					</Grid>
					<Grid
						item
						xs={12}
						md={6}
						lg={4}
						xl={2}
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
						}}
					>
						<FormControl component="fieldset" sx={{ width: "90%" }}>
							<FormLabel component="legend">
								{getTranslation("showMyWarrior")}:
							</FormLabel>
						</FormControl>
						<Checkbox
							checked={onlyMyWarrior}
							onChange={() => {
								setOnlyMyWarrior(!onlyMyWarrior);
							}}
							inputProps={{ "aria-label": "controlled" }}
						/>
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ mb: 4 }}>
					{
						warriors.length > 0 &&	warriors.filter((item: any) => filter === 'all' ? parseInt(item.strength) >= 0 : item.strength === filter).filter((item: any) => apValue[0] <= parseInt(item.power) && (apValue[1] === 6000 ? true : apValue[1] >= parseInt(item.power))).filter((item: any) => onlyMyWarrior === true ? item.owner === true : true).slice((currentPage - 1) * 20, (currentPage - 1) * 20 + 20).map((item: any, index) => (
							<Grid item xs={12} sm={6} md={3} key={index}>
								<WarriorMarketCard image={(showAnimation === '0' ? baseUrl + item['jpg'] : baseUrl + item['gif'])} type={item['type']} power={item['power']} strength={item['strength']} id={item['id']} owner={item['owner']} price={item['price']} handleCancel={handleCancel} handleBuy={handleBuy} />
							</Grid>
						))
					}
				</Grid>
				{
					warriors.length > 0 &&
					<Navigation totalCount={warriors.length} cPage={currentPage} handlePage={handlePage} perPage={20} />
				}
			</div>
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
			actionLoading === true && (
				<>
					<Grid item xs={12} sx={{ p: 4, textAlign: "center" }}>
						<Typography variant="h4">
							{getTranslation("pleaseWait")}
						</Typography>
					</Grid>
					<Grid container sx={{ justifyContent: "center" }}>
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
			)}
	</Box>
}

export default Warriors
