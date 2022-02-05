
import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, ButtonGroup, Button, Slider, FormLabel, FormControl, Checkbox, Dialog, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
import Helmet from 'react-helmet';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';
import { NavLink } from 'react-router-dom';

import LegionCard from '../../component/Cards/LegionCard';
import { useBeast, useWarrior, useLegion, useWeb3 } from '../../hooks/useContract';
import { getBeastBalance, getWarriorBalance, getLegionTokenIds, getLegionToken, addSupply, getBaseUrl } from '../../hooks/contractFunction';
import { meta_constant } from '../../config/meta.config';
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

const Legions = () => {
	const {
		account,
	} = useWeb3React();

	const [beastBalance, setBeastBalance] = React.useState('0');
	const [warriorBalance, setWarriorBalance] = React.useState('0');
	const [baseUrl, setBaseUrl] = React.useState('');
	const [totalPower, setTotalPower] = React.useState(0);
	const [legions, setLegions] = React.useState(Array);
	const [highest, setHighest] = React.useState(true);
	const [huntStatus, setHuntStatus] = React.useState('');
	const [hideWeak, setHideWeak] = React.useState(false);
	const [openSupply, setOpenSupply] = React.useState(false);
	const [selectedLegion, setSelectedLegion] = React.useState(0);
	const [loading, setLoading] = React.useState(false);
	const [apValue, setApValue] = React.useState<number[]>([2000, 250000]);

	const classes = useStyles();
	const legionContract = useLegion();
	const beastContract = useBeast();
	const warriorContract = useWarrior();
	const web3 = useWeb3();

	React.useEffect(() => {
		if (account) {
			getBalance();
		}
	}, []);

	const getBalance = async () => {
		setLoading(true);
		setBaseUrl(await getBaseUrl());
		setBeastBalance(await getBeastBalance(web3, beastContract, account));
		setWarriorBalance(await getWarriorBalance(web3, warriorContract, account));
		const ids = await getLegionTokenIds(web3, legionContract, account);
		let amount = 0;
		let legion;
		let tempLegions = [];
		for (let i = 0; i < ids.length; i++) {
			legion = await getLegionToken(web3, legionContract, ids[i]);
			tempLegions.push({ ...legion, id: ids[i] });
			amount += legion.attackPower;
		}
		setTotalPower(amount);
		let sortedArray: { attackPower: number; }[] = tempLegions.sort((a, b) => {
			if (a.attackPower > b.attackPower) {
				return -1;
			}
			if (a.attackPower < b.attackPower) {
				return 1;
			}
			return 0;
		});
		setLegions(sortedArray);
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

	const handleSupplyClick = async (value: string) => {
		setOpenSupply(false);
		await addSupply(web3, legionContract, account, selectedLegion, parseInt(value));
	};

	const handleOpenSupply = (id: number) => {
		setSelectedLegion(id);
		setOpenSupply(true);
	}

	return (
		<Box>
			<Helmet>
				<meta charSet="utf-8" />
				<title>{meta_constant.legions.title}</title>
				<meta name="description" content={meta_constant.legions.description} />
				{meta_constant.legions.keywords && <meta name="keywords" content={meta_constant.legions.keywords.join(',')} />}
			</Helmet>
			<Grid container spacing={2} sx={{ my: 4 }}>
				<Grid item xs={12} md={4}>
					<Card>
						<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
							<Button variant="contained" sx={{ fontWeight: 'bold' }}>
								<NavLink to='/createlegions' className='non-style'>
									{getTranslation('createLegion')}
								</NavLink>
							</Button>
							<Box sx={{ display: 'flex', mt: 2 }}>
								<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
									{getTranslation('availableWarrior')}
								</Typography>
								<Typography variant='h6' color='secondary' sx={{ fontWeight: 'bold', ml: 2 }}>
									{beastBalance}
								</Typography>
							</Box>
							<Box sx={{ display: 'flex' }}>
								<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
									{getTranslation('availableBeast')}
								</Typography>
								<Typography variant='h6' color='secondary' sx={{ fontWeight: 'bold', ml: 2 }}>
									{warriorBalance}
								</Typography>
							</Box>
						</Box>
					</Card>
				</Grid>
				<Grid item xs={12} md={4}>
					<Card>
						<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
							<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
								{getTranslation('currentLegion')}
							</Typography>
							<Typography variant='h4' color='secondary' sx={{ fontWeight: 'bold' }}>
								{legions.length}
							</Typography>
							<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
								{getTranslation('totalAp')}
							</Typography>
							<Typography variant='h6' color='primary' sx={{ fontWeight: 'bold' }}>
								{formatNumber(totalPower)}
							</Typography>
						</Box>
					</Card>
				</Grid>
				<Grid item xs={12} md={4}>
					<Card>
						<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
							<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
								{getTranslation('top3Legions')}
							</Typography>
							{
								legions.filter((item: any, index) => index < 3).map((item: any, index) => (
									<Box sx={{ display: 'flex' }} key={index}>
										<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
											{item.name}
										</Typography>
										<Typography variant='h6' color='secondary' sx={{ fontWeight: 'bold', ml: 2 }}>
											{formatNumber(item.attackPower)} AP
										</Typography>
									</Box>
								))
							}
						</Box>
					</Card>
				</Grid>
			</Grid>
			{
				loading === false &&
				<React.Fragment>
					<Grid container spacing={2} sx={{ my: 3 }}>
						<Grid item xs={12} md={3}>
							<FormControl component="fieldset" sx={{ width: '90%' }}>
								<FormLabel component="legend">{getTranslation('filterByAp')}:</FormLabel>
								<Slider
									getAriaLabel={() => "Custom marks"}
									// defaultValue={20}
									value={apValue}
									min={2000}
									max={250000}
									marks={[
										{ value: 2000, label: '2000' },
										{ value: 250000, label: formatNumber('250K+') },
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
									<Button variant={!highest ? "contained" : "outlined"} onClick={() => { setHighest(!highest) }}>{getTranslation('lowest')}</Button>
									<Button variant={highest ? "contained" : "outlined"} onClick={() => { setHighest(!highest) }}>{getTranslation('highest')}</Button>
								</ButtonGroup>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3}>
							<FormControl component="fieldset" sx={{ width: '90%' }}>
								<FormLabel component="legend">{getTranslation('huntStatus')}:</FormLabel>
								<ButtonGroup variant="outlined" color="primary" sx={{ pt: 1 }}>
									<Button variant={huntStatus === 'green' ? "contained" : "outlined"} onClick={() => { setHuntStatus('green') }}>{getTranslation('green')}</Button>
									<Button variant={huntStatus === 'orange' ? "contained" : "outlined"} onClick={() => { setHuntStatus('orange') }}>{getTranslation('orange')}</Button>
									<Button variant={huntStatus === 'red' ? "contained" : "outlined"} onClick={() => { setHuntStatus('red') }}>{getTranslation('red')}</Button>
								</ButtonGroup>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3}>
							<FormControl component="fieldset" sx={{ width: '90%' }}>
								<FormLabel component="legend">{getTranslation('hideWeakLegions')}:</FormLabel>
							</FormControl>
							<Checkbox
								checked={hideWeak}
								onChange={() => { setHideWeak(!hideWeak) }}
								inputProps={{ 'aria-label': 'controlled' }}
							/>
						</Grid>
					</Grid>
					<Grid container spacing={4} sx={{ mb: 4, flexDirection: highest ? 'row' : 'row-reverse', justifyContent: highest ? 'flex-start' : 'flex-end' }}>
						{
							legions.filter((item: any) => apValue[0] < parseInt(item.attackPower) && (apValue[1] === 250000 ? true : apValue[1] > parseInt(item.attackPower))).filter((item: any) => hideWeak === true ? item.attackPower >= 2000 : true).map((item: any, index) => (
								<Grid item xs={12} sm={6} md={4} key={index}>
									<LegionCard id={item['id']} image={baseUrl + 'QmdnZYpBhNuxjieUZrnR14weZtiXRdz75SRAfhEAkissMm'} name={item['name']} beasts={item['beasts']} warriors={item['warriors']} supplies={item['supplies']} attackPower={item['attackPower']} handleOpenSupply={handleOpenSupply} />
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
			<Dialog onClose={handleSupplyClose} open={openSupply}>
				<DialogTitle>{getTranslation('buyMoreSupply')}</DialogTitle>
				<List sx={{ pt: 0 }}>
					<ListItem button sx={{ textAlign: 'center' }} onClick={() => handleSupplyClick('7')}>
						<ListItemText primary='7' />
					</ListItem>
					<ListItem button sx={{ textAlign: 'center' }} onClick={() => handleSupplyClick('14')}>
						<ListItemText primary='14' />
					</ListItem>
					<ListItem button sx={{ textAlign: 'center' }} onClick={() => handleSupplyClick('28')}>
						<ListItemText primary='28' />
					</ListItem>
				</List>
			</Dialog>
		</Box>
	)
}

export default Legions
