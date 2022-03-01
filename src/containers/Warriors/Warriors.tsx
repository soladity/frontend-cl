import React from 'react';
import Helmet from 'react-helmet';
import { Box, Typography, Grid, Card, CardMedia, ButtonGroup, Button, IconButton, FormLabel, FormControl, Slider, Dialog, DialogTitle, DialogContent, TextField, Popover } from '@mui/material';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { meta_constant } from '../../config/meta.config';
import { setReloadStatus } from '../../actions/contractActions';
import { getWarriorBloodstoneAllowance, setWarriorBloodstoneApprove, mintWarrior, getWarriorBalance, getWarriorTokenIds, getWarriorToken, sellToken, setMarketplaceApprove, getBaseUrl, execute, getBloodstoneAmountToMintWarrior, getFee } from '../../hooks/contractFunction';
import { useBloodstone, useWarrior, useMarketplace, useLegion, useFeeHandler, useWeb3 } from '../../hooks/useContract';
import WarriorCard from '../../component/Cards/WarriorCard';
import CommonBtn from '../../component/Buttons/CommonBtn';
import { getTranslation } from '../../utils/translation';
import { formatNumber } from '../../utils/common';
import Image from '../../config/image.json';
import { FaTimes } from "react-icons/fa";

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
};

const Warriors = () => {
	const {
		account,
	} = useWeb3React();

	const [baseUrl, setBaseUrl] = React.useState('');
	const [showMint, setShowMint] = React.useState(false);
	const [balance, setBalance] = React.useState(0);
	const [maxPower, setMaxPower] = React.useState(0);
	const [warriors, setWarriors] = React.useState<WarriorProps[]>(Array);
	const [filter, setFilter] = React.useState('all');
	const [openSupply, setOpenSupply] = React.useState(false);
	const [selectedWarrior, setSelectedWarrior] = React.useState(0);
	const [price, setPrice] = React.useState(0);
	const [marketplaceTax, setMarketplaceTax] = React.useState('0');
	const [showAnimation, setShowAnimation] = React.useState<string | null>('0');
	const [loading, setLoading] = React.useState(false);
	const [apValue, setApValue] = React.useState<number[]>([500, 6000]);
	const [mintLoading, setMintLoading] = React.useState(false);
	const [actionLoading, setActionLoading] = React.useState(false);

	const [warriorBlstAmountPer, setWarriorBlstAmountPer] = React.useState({
		b1: {
			amount: 0,
			per: "0",
		},
		b10: {
			amount: 0,
			per: "0",
		},
		b50: {
			amount: 0,
			per: "0",
		},
		b200: {
			amount: 0,
			per: "0",
		},
		b500: {
			amount: 0,
			per: "0",
		},
	});

	const classes = useStyles();
	const warriorContract = useWarrior();
	const legionContract = useLegion();
	const bloodstoneContract = useBloodstone();
	const marketplaceContract = useMarketplace();
	const feeHandlerContract = useFeeHandler();
	const web3 = useWeb3();
	const dispatch = useDispatch();

	//Popover for Summon Warrior
	const [anchorElSummonWarrior, setAnchorElSummonWarrior] =
		React.useState<HTMLElement | null>(null);
	const handlePopoverOpenSummonWarrior = (
		event: React.MouseEvent<HTMLElement>
	) => {
		setAnchorElSummonWarrior(event.currentTarget);
	};
	const handlePopoverCloseSummonWarrior = () => {
		setAnchorElSummonWarrior(null);
	};
	const openSummonWarrior = Boolean(anchorElSummonWarrior);

	const getBlstAmountToMintWarrior = async () => {
		var BLST_amount_1 = 0;
		var BLST_amount_10 = 0;
		var BLST_amount_50 = 0;
		var BLST_amount_200 = 0;
		var BLST_amount_500 = 0;

		var BLST_per_1 = "0";
		var BLST_per_10 = "0";
		var BLST_per_50 = "0";
		var BLST_per_200 = "0";
		var BLST_per_500 = "0";

		try {
			BLST_amount_1 = await getBloodstoneAmountToMintWarrior(
				web3,
				warriorContract,
				1
			);
			BLST_amount_10 = await getBloodstoneAmountToMintWarrior(
				web3,
				warriorContract,
				10
			);
			BLST_amount_50 = await getBloodstoneAmountToMintWarrior(
				web3,
				warriorContract,
				50
			);
			BLST_amount_200 = await getBloodstoneAmountToMintWarrior(
				web3,
				warriorContract,
				200
			);
			BLST_amount_500 = await getBloodstoneAmountToMintWarrior(
				web3,
				warriorContract,
				500
			);
			BLST_per_1 = ((1 - BLST_amount_1 / BLST_amount_1) * 100).toFixed(0);
			BLST_per_10 = (
				(1 - BLST_amount_10 / (BLST_amount_1 * 10)) *
				100
			).toFixed(0);
			BLST_per_50 = (
				(1 - BLST_amount_50 / (BLST_amount_1 * 50)) *
				100
			).toFixed(0);
			BLST_per_200 = (
				(1 - BLST_amount_200 / (BLST_amount_1 * 200)) *
				100
			).toFixed(0);
			BLST_per_500 = (
				(1 - BLST_amount_500 / (BLST_amount_1 * 500)) *
				100
			).toFixed(0);
			var amount_per = {
				b1: {
					amount: BLST_amount_1,
					per: BLST_per_1,
				},
				b10: {
					amount: BLST_amount_10,
					per: BLST_per_10,
				},
				b50: {
					amount: BLST_amount_50,
					per: BLST_per_50,
				},
				b200: {
					amount: BLST_amount_200,
					per: BLST_per_200,
				},
				b500: {
					amount: BLST_amount_500,
					per: BLST_per_500,
				},
			};
			setWarriorBlstAmountPer(amount_per);
		} catch (error) {
			console.log(error);
		}

		return BLST_amount_1;
	};

	React.useEffect(() => {
		if (account) {
			getBalance();
			getBlstAmountToMintWarrior()
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
		handlePopoverCloseSummonWarrior()
		setMintLoading(true);
		setLoading(false);
		const allowance = await getWarriorBloodstoneAllowance(web3, bloodstoneContract, account);
		try {
			if (allowance === '0') {
				await setWarriorBloodstoneApprove(web3, bloodstoneContract, account);
			}
			await mintWarrior(web3, warriorContract, account, amount);
			dispatch(setReloadStatus({
				reloadContractStatus: new Date()
			}));
		} catch (e) {
			console.log(e);
		}
		getBalance();
		setMintLoading(false);
	}

	const getBalance = async () => {
		setLoading(true);
		setMarketplaceTax(((await getFee(feeHandlerContract, 0)) / 100).toFixed(0));
		setBaseUrl(await getBaseUrl());
		setBalance(parseInt(await getWarriorBalance(web3, warriorContract, account)));
		const ids = await getWarriorTokenIds(web3, warriorContract, account);
		let amount = 0;
		let warrior;
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
			tempWarriors.push({ ...warrior, id: ids[i], gif: gif, jpg: jpg });
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

	const handleSupplyClose = () => {
		setOpenSupply(false);
	};

	const handleOpenSupply = (id: number) => {
		setSelectedWarrior(id);
		setOpenSupply(true);
	}

	const handlePrice = (e: any) => {
		setPrice(e.target.value);
	}

	const handleSendToMarketplace = async () => {
		setActionLoading(true);
		setOpenSupply(false);
		try {
			await setMarketplaceApprove(web3, warriorContract, account, selectedWarrior);
			await sellToken(web3, marketplaceContract, account, '2', selectedWarrior, price);
			let power = 0;
			let temp = warriors;
			for (let i = 0; i < temp.length; i++) {
				if (parseInt(temp[i]['id']) === selectedWarrior)
					power = parseInt(temp[i]['power']);
			}
			setMaxPower(maxPower - power);
			setBalance(balance - 1);
			setWarriors(warriors.filter((item: any) => parseInt(item.id) !== selectedWarrior));
		} catch (e) {
			console.log(e)
		}
		setActionLoading(false);
	}

	const handleExecute = async (id: number) => {
		setActionLoading(true);
		try {
			await execute(web3, legionContract, account, false, id);
			setWarriors(warriors.filter((item: any) => parseInt(item.id) !== id));
			dispatch(setReloadStatus({
				reloadContractStatus: new Date()
			}));
		} catch (e) {
			console.log(e);
		}
		setActionLoading(false);
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
								{getTranslation('warriors')}
							</Typography>
						</Box>
					</Box>
				</Card>
			</Grid>
			<Grid item xs={12} md={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							{getTranslation('summonWarrior')}
						</Typography>
						<Box onMouseOver={handleOpenMint} onMouseLeave={handleCloseMint} sx={{ pt: 1 }}>
							<CommonBtn
								aria-describedby={"summon-warrior-id"}
								onClick={handlePopoverOpenSummonWarrior}
								sx={{ fontWeight: 'bold' }}
							>
								<IconButton aria-label="claim" component="span" sx={{ p: 0, mr: 1, color: 'black' }}>
									<HorizontalSplitIcon />
								</IconButton>
								{getTranslation('summonQuantity')}
							</CommonBtn>
							<Popover
								id={"summon-warrior-id"}
								open={openSummonWarrior}
								anchorEl={anchorElSummonWarrior}
								onClose={
									handlePopoverCloseSummonWarrior
								}
								anchorOrigin={{
									vertical: "center",
									horizontal: "right",
								}}
								transformOrigin={{
									vertical: "center",
									horizontal: "left",
								}}
							>
								<Box sx={{ display: "flex" }}>
									<Box
										sx={{
											marginLeft: "auto",
											cursor: "pointer",
											marginRight: 1,
											marginTop: 1,
										}}
									>
										<FaTimes
											onClick={
												handlePopoverCloseSummonWarrior
											}
										/>
									</Box>
								</Box>
								<DialogTitle>
									{getTranslation(
										"takeActionSummonWarriorQuantity"
									)}
								</DialogTitle>
								<Box
									sx={{
										padding: 3,
										display: "flex",
										flexDirection: "column",
									}}
								>
									<CommonBtn
										onClick={() =>
											handleMint(
												1,
											)
										}
										sx={{
											fontSize: 14,
											fontWeight: "bold",
											marginBottom: 1,
										}}
									>
										1 (
										{warriorBlstAmountPer.b1?.amount}{" "}
										$BLST)
									</CommonBtn>
									<CommonBtn
										onClick={() =>
											handleMint(
												10,
											)
										}
										sx={{
											fontSize: 14,
											fontWeight: "bold",
											marginBottom: 1,
										}}
									>
										10 (
										{"-" +
											warriorBlstAmountPer.b10.per +
											"%" +
											" | " +
											warriorBlstAmountPer.b10
												?.amount}{" "}
										$BLST)
									</CommonBtn>
									<CommonBtn
										onClick={() =>
											handleMint(
												50,
											)
										}
										sx={{
											fontSize: 14,
											fontWeight: "bold",
											marginBottom: 1,
										}}
									>
										50 (
										{"-" +
											warriorBlstAmountPer.b50.per +
											"%" +
											" | " +
											warriorBlstAmountPer.b50
												?.amount}{" "}
										$BLST)
									</CommonBtn>
									<CommonBtn
										onClick={() =>
											handleMint(
												200,
											)
										}
										sx={{
											fontSize: 14,
											fontWeight: "bold",
											marginBottom: 1,
										}}
									>
										200 (
										{"-" +
											warriorBlstAmountPer.b200.per +
											"%" +
											" | " +
											warriorBlstAmountPer.b200
												?.amount}{" "}
										$BLST)
									</CommonBtn>
									<CommonBtn
										onClick={() =>
											handleMint(
												500,
											)
										}
										sx={{
											fontSize: 14,
											fontWeight: "bold",
											marginBottom: 1,
										}}
									>
										500 (
										{"-" +
											warriorBlstAmountPer.b500
												.per +
											"%" +
											" | " +
											warriorBlstAmountPer.b500
												?.amount}{" "}
										$BLST)
									</CommonBtn>
								</Box>
							</Popover>
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
						<CommonBtn sx={{ fontWeight: 'bold', mt: 1 }}>
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
			(loading === false && mintLoading === false && actionLoading === false) &&
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
								max={6000}
								marks={[
									{ value: 500, label: '500' },
									{ value: 6000, label: formatNumber('6000+') },
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
						warriors.filter((item: any) => filter === 'all' ? parseInt(item.strength) >= 0 : item.strength === filter).filter((item: any) => apValue[0] <= parseInt(item.power) && (apValue[1] === 6000 ? true : apValue[1] >= parseInt(item.power))).map((item: any, index) => (
							<Grid item xs={12} sm={6} md={4} lg={3} key={index}>
								<WarriorCard image={(showAnimation === '0' ? baseUrl + item['jpg'] : baseUrl + item['gif'])} type={item['type']} power={item['power']} strength={item['strength']} id={item['id']} isMobile={false} needButton={true} handleOpenSupply={handleOpenSupply} handleExecute={handleExecute} />
							</Grid>
						))
					}
					{
						(warriors.length > 0 && warriors.filter((item: any) => filter === 'all' ? parseInt(item.strength) >= 0 : item.strength === filter).filter((item: any) => apValue[0] <= parseInt(item.power) && (apValue[1] === 6000 ? true : apValue[1] >= parseInt(item.power))).length === 0) &&
						<Grid item xs={12}>
							<Card>
								<Box className={classes.warning} sx={{ p: 4, justifyContent: 'start', alignItems: 'center' }}>
									<Box sx={{ display: 'flex', flexDirection: 'column', mx: 4 }}>
										<Typography variant='h6'>
											{getTranslation('noWarriorFilter')}
										</Typography>
									</Box>
								</Box>
							</Card>
						</Grid>
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
		<Dialog onClose={handleSupplyClose} open={openSupply}>
			<DialogTitle>{getTranslation('listOnMarketplace')}</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="price"
					label="Price in $BLST"
					type="number"
					fullWidth
					variant="standard"
					value={price}
					onChange={handlePrice}
				/>
				<Typography variant='subtitle1'>
					(= XXX USD)
				</Typography>
				<Typography variant='subtitle1'>
					If sold, you will pay {marketplaceTax}% marketplace tax.
				</Typography>
			</DialogContent>
			<CommonBtn sx={{ fontWeight: 'bold' }} onClick={handleSendToMarketplace}>
				{getTranslation('sell')}
			</CommonBtn>
		</Dialog>
	</Box>
}

export default Warriors
