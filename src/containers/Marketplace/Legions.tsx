import React from 'react';
import Helmet from 'react-helmet';
import { Box, Typography, Grid, Card, CardMedia, ButtonGroup, Button, Checkbox, FormLabel, FormControl, Slider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';

import { meta_constant } from '../../config/meta.config';
import { setReloadStatus } from '../../actions/contractActions';
import Navigation from '../../component/Navigation/Navigation';
import { getOnMarketplace, getLegionToken, getBaseUrl, getMarketplaceBloodstoneAllowance, setMarketplaceBloodstoneApprove, cancelMarketplace, buyToken, getMarketItem, getLegionImage, getHuntStatus } from '../../hooks/contractFunction';
import { useLegion, useMarketplace, useBloodstone, useWeb3 } from '../../hooks/useContract';
import LegionMarketCard from '../../component/Cards/LegionMarketCard';
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

const Legions = () => {
	const {
		account,
	} = useWeb3React();

	const [baseUrl, setBaseUrl] = React.useState("");
	const [sort, setSort] = React.useState('0');
	const [legions, setLegions] = React.useState(Array);
	const [onlyMyLegion, setOnlyMyLegion] = React.useState(false);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [showAnimation, setShowAnimation] = React.useState<string | null>('0');
	const [loading, setLoading] = React.useState(false);
	const [actionLoading, setActionLoading] = React.useState(false);
	const [apValue, setApValue] = React.useState<number[]>([2000, 250000]);
	const [huntsValue, setHuntsValue] = React.useState<number[]>([0, 28]);

	const classes = useStyles();
	const legionContract = useLegion();
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

		const ids = await getOnMarketplace(web3, legionContract);
		let legion;
		let marketItem;
		let image;
		let huntStatus;
		let tempLegions = [];
		for (let i = 0; i < ids.length; i++) {
			legion = await getLegionToken(web3, legionContract, ids[i]);
			marketItem = await getMarketItem(web3, marketplaceContract, '3', ids[i]);
			image = await getLegionImage(web3, legionContract, legion.attackPower);
			huntStatus = await getHuntStatus(web3, legionContract, ids[i]);
			tempLegions.push({ ...legion, id: ids[i], ...image, owner: marketItem.owner === account ? true : false, price: marketItem.price, huntStatus: huntStatus });
		}
		setLegions(tempLegions);
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

	const handleChangeHunts = (
		event: Event,
		newValue: number | number[],
		activeThumb: number,
	) => {
		if (!Array.isArray(newValue)) {
			return;
		}

		if (activeThumb === 0) {
			setHuntsValue([Math.min(newValue[0], huntsValue[1] - 1), huntsValue[1]]);
		} else {
			setHuntsValue([huntsValue[0], Math.max(newValue[1], huntsValue[0] + 1)]);
		}
	};

	const handleCancel = async (id: number) => {
		setActionLoading(true);
		try {
			await cancelMarketplace(web3, marketplaceContract, account, '3', id);
			setLegions(legions.filter((item: any) => parseInt(item.id) !== id));
		} catch (e) {
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
			await buyToken(web3, marketplaceContract, account, '3', id);
			dispatch(setReloadStatus({
				reloadContractStatus: new Date()
			}))
			setLegions(legions.filter((item: any) => parseInt(item.id) !== id));
		} catch (e) {
			console.log(e);
		}
		setActionLoading(false);
	}

	const handleSort = (value: string) => {
		setSort(value);
		handleSortValue(value);
	}

	const handleSortValue = (value: string) => {
		let temp = legions;
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
		setLegions(temp);
	}

	const handlePage = (value: any) => {
		setCurrentPage(value);
	}

	return <Box>
		<Helmet>
			<meta charSet="utf-8" />
			<title>{meta_constant.legions.title}</title>
			<meta name="description" content={meta_constant.legions.description} />
			{meta_constant.legions.keywords && <meta name="keywords" content={meta_constant.legions.keywords.join(',')} />}
		</Helmet>
		<Grid container spacing={2} sx={{ my: 4 }}>
			<Grid item xs={12}>
				<Card>
					<Box className={classes.warning} sx={{ p: { xs: 1, md: 4 }, justifyContent: 'start', alignItems: 'center' }}>
						<Box sx={{ display: 'flex', flexDirection: 'column', mx: { xs: 1, md: 4 } }}>
							<Typography variant='h3' sx={{ fontWeight: 'bold' }}>
								{getTranslation('legions')} {getTranslation('marketplace')}
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
						<FormControl component="fieldset" sx={{ width: '90%' }}>
							<FormLabel component="legend">{getTranslation('filterByAp')}</FormLabel>
							<Slider
								getAriaLabel={() => "Custom marks"}
								// defaultValue={20}
								value={apValue}
								min={2000}
								max={250000}
								marks={[
									{ value: 2000, label: '2,000' },
									{ value: 250000, label: formatNumber('250K+') },
								]}
								step={1}
								valueLabelDisplay="auto"
								onChange={handleChangeAp}
								disableSwap
							/>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={6} lg={6} xl={4}>
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
					<Grid item xs={12} md={6} lg={6} xl={3}>
						<FormControl component="fieldset" sx={{ width: '90%' }}>
							<FormLabel component="legend">{getTranslation('filterByHunts')}</FormLabel>
							<Slider
								getAriaLabel={() => "Custom marks"}
								// defaultValue={20}
								value={huntsValue}
								min={0}
								max={28}
								marks={[
									{ value: 0, label: '0' },
									{ value: 28, label: formatNumber('28+') },
								]}
								step={1}
								valueLabelDisplay="auto"
								onChange={handleChangeHunts}
								disableSwap
							/>
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
								{getTranslation("showMyLegion")}:
							</FormLabel>
						</FormControl>
						<Checkbox
							checked={onlyMyLegion}
							onChange={() => {
								setOnlyMyLegion(!onlyMyLegion);
							}}
							inputProps={{ "aria-label": "controlled" }}
						/>
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ mb: 4 }}>
					{
						legions.length > 0 && legions.filter(
							(item: any) =>
								apValue[0] <= parseInt(item.attackPower) &&
								(apValue[1] === 250000
									? true
									: apValue[1] >= parseInt(item.attackPower))
						).filter((item: any) => huntsValue[0] <= parseInt(item.supplies) && (huntsValue[1] === 28 ? true : huntsValue[1] >= parseInt(item.supplies))).filter((item: any) => onlyMyLegion === true ? item.owner === true : true).slice((currentPage - 1) * 20, (currentPage - 1) * 20 + 20).map((item: any, index) => (
							<Grid item xs={12} sm={6} md={3} key={index}>
								<LegionMarketCard image={baseUrl + item['image']} name={item['name']} beasts={item['beasts']} warriors={item['warriors']} id={item['id']} supplies={item['supplies']} attackPower={item['attackPower']} huntStatus={item['huntStatus']} owner={item['owner']} price={item['price']} handleCancel={handleCancel} handleBuy={handleBuy} />
							</Grid>
						))
					}
				</Grid>
				{
					legions.length > 0 &&
					<Navigation totalCount={legions.length} cPage={currentPage} handlePage={handlePage} perPage={20} />
				}
			</div>
		}
		{
			loading === true &&
			<>
				<Grid item xs={12} sx={{ p: 4, textAlign: 'center' }}>
					<Typography variant='h4' >{getTranslation('loadingLegions')}</Typography>
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

export default Legions
