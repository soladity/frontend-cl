import React from 'react';
import Helmet from 'react-helmet';
import { Box, Typography, Grid, Card, CardMedia, ButtonGroup, Button, Checkbox, FormLabel, FormControl } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';

import { meta_constant } from '../../config/meta.config';
import { setReloadStatus } from '../../actions/contractActions';
import Navigation from '../../component/Navigation/Navigation';
import { getOnMarketplace, getBeastToken, getBaseUrl, getMarketplaceBloodstoneAllowance, setMarketplaceBloodstoneApprove, cancelMarketplace, buyToken, getMarketItem } from '../../hooks/contractFunction';
import { useBeast, useMarketplace, useBloodstone, useWeb3 } from '../../hooks/useContract';
import BeastMarketCard from '../../component/Cards/BeastMarketCard';
import { getTranslation } from '../../utils/translation';
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

type BeastProps = {
	id: string;
	type: string;
	capacity: string;
	strength: string;
	owner: boolean;
	price: string;
};

const Beasts = () => {
	const {
		account,
	} = useWeb3React();

	const [baseUrl, setBaseUrl] = React.useState('');
	const [sortBlst, setSortBlst] = React.useState(false);
	const [beasts, setBeasts] = React.useState(Array);
	const [filter, setFilter] = React.useState('all');
	const [onlyMyBeast, setOnlyMyBeast] = React.useState(false);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [showAnimation, setShowAnimation] = React.useState<string | null>('0');
	const [loading, setLoading] = React.useState(false);
	const [actionLoading, setActionLoading] = React.useState(false);

	const classes = useStyles();
	const beastContract = useBeast();
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

		const ids = await getOnMarketplace(web3, beastContract);
		let beast;
		let marketItem;
		let tempBeasts = [];
		let gif = '';
		let jpg = '';
		for (let i = 0; i < ids.length; i++) {
			beast = await getBeastToken(web3, beastContract, ids[i]);
			for (let j = 0; j < Image.beasts.length; j++) {
				if (Image.beasts[j].name === beast.type) {
					gif = Image.beasts[j].gif;
					jpg = Image.beasts[j].jpg;
				}
			}
			marketItem = await getMarketItem(web3, marketplaceContract, '1', ids[i]);
			tempBeasts.push({ ...beast, id: ids[i], owner: marketItem.owner === account ? true : false, price: marketItem.price, gif: gif, jpg: jpg });
		}
		setBeasts(tempBeasts);
		setLoading(false);
	}

	const handleCancel = async (id: number) => {
		setActionLoading(true);
		try {
			await cancelMarketplace(web3, marketplaceContract, account, '1', id);
			setBeasts(beasts.filter((item: any) => parseInt(item.id) !== id));
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
			await buyToken(web3, marketplaceContract, account, '1', id);
			dispatch(setReloadStatus({
				reloadContractStatus: new Date()
			}))
			setBeasts(beasts.filter((item: any) => parseInt(item.id) !== id));
		} catch (e){
			console.log(e);
		}
		setActionLoading(false);
	}

	const handleSortBlst = (value: boolean) => {
		setSortBlst(value);
		handleSort('blst');
	}

	const handleSort = (type: string) => {
		let temp = beasts;
		temp.sort((a: any, b: any) => {
			if (parseInt(a.price) > parseInt(b.price)) {
				return 1;
			}
			if (parseInt(a.price) < parseInt(b.price)) {
				return -1;
			}
			return 0;
		});
		setBeasts(temp);
	}

	const handlePage = (value: any) => {
		setCurrentPage(value);
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
					<Box className={classes.warning} sx={{ p: { xs: 1, md: 4 }, justifyContent: 'start', alignItems: 'center' }}>
						<Box sx={{ display: 'flex', flexDirection: 'column', mx: { xs: 1, md: 4 } }}>
							<Typography variant='h3' sx={{ fontWeight: 'bold' }}>
								{getTranslation('beasts')} {getTranslation('marketplace')}
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
					<Grid item xs={12} md={6} xl={4}>
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
					<Grid item xs={12} md={6} xl={4}>
						<FormControl component="fieldset" sx={{ width: '90%' }}>
							<FormLabel component="legend">{getTranslation('sortBy')} $:</FormLabel>
							<ButtonGroup variant="outlined" color="primary" sx={{ pt: 1 }}>
								<Button variant={!sortBlst ? "contained" : "outlined"} onClick={() => { handleSortBlst(!sortBlst) }}>{getTranslation('lowest')}</Button>
								<Button variant={sortBlst ? "contained" : "outlined"} onClick={() => { handleSortBlst(!sortBlst) }}>{getTranslation('highest')}</Button>
							</ButtonGroup>
						</FormControl>
					</Grid>
					<Grid
						item
						xs={12}
						md={6}
						xl={4}
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
						}}
					>
						<FormControl component="fieldset" sx={{ width: "90%" }}>
							<FormLabel component="legend">
								{getTranslation("showMyBeast")}:
							</FormLabel>
						</FormControl>
						<Checkbox
							checked={onlyMyBeast}
							onChange={() => {
								setOnlyMyBeast(!onlyMyBeast);
							}}
							inputProps={{ "aria-label": "controlled" }}
						/>
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ mb: 4 }}>
					{
						beasts.length > 0 && beasts.filter((item: any) => filter === 'all' ? parseInt(item.capacity) >= 0 : item.capacity === filter).filter((item: any) => onlyMyBeast === true ? item.owner === true : true).slice((currentPage - 1) * 20, (currentPage - 1) * 20 + 20).map((item: any, index) => (
							<Grid item xs={12} sm={6} md={3} key={index}>
								<BeastMarketCard image={(showAnimation === '0' ? baseUrl + item['jpg'] : baseUrl + item['gif'])} type={item['type']} capacity={item['capacity']} strength={item['strength']} id={item['id']} owner={item['owner']} price={item['price']} handleCancel={handleCancel} handleBuy={handleBuy} />
							</Grid>
						))
					}
				</Grid>
				{
					beasts.length > 0 &&
					<Navigation totalCount={beasts.length} cPage={currentPage} handlePage={handlePage} perPage={20} />
				}
			</div>
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

export default Beasts
