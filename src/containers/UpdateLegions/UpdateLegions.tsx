import React from 'react';
import Helmet from 'react-helmet';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Box, Typography, Grid, Card, CardMedia, Input, Slider, MenuItem, Button, IconButton, FormControl, FormLabel, ButtonGroup } from '@mui/material';
import { ErrorOutline, ArrowBack } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';

import { meta_constant, createlegions } from '../../config/meta.config';
import { mintBeast, getBeastBalance, getBeastTokenIds, getBeastToken, getBeastUrl } from '../../hooks/contractFunction';
import { useBloodstone, useBeast, useWeb3 } from '../../hooks/useContract';
import { getTranslation } from '../../utils/translation';
import { formatNumber } from '../../utils/common'
import { DragBox } from './DragBox';
import { DropBox } from './DropBox'

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column'
	},
	card: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '180px',
		height: '100%',
		justifyContent: 'flex-start'
	},
	warning: {
		display: 'flex',
		minHeight: '80px',
	}
});

const UpdateLegions: React.FC = () => {
	const { account } = useWeb3React();

	const [apValue, setApValue] = React.useState<number[]>([20, 37]);
	const [warrior5beast, setWarrior5beat] = React.useState(false);
	const [warriorDropBoxList, setWarriorDropBoxList] = React.useState(Array);
	const [beastDropBoxList, setBeastDropBoxList] = React.useState(Array);
	const [warriorDragBoxList, setWarriorDragBoxList] = React.useState(Array);
	const [beastDragBoxList, setBeastDragBoxList] = React.useState(Array);
	const [beasts, setBeasts] = React.useState(Array);
	const [warriors, setWarriors] = React.useState(Array);
	const [balance, setBalance] = React.useState('0');
	const [baseUrl, setBaseUrl] = React.useState('');
	const [filter, setFilter] = React.useState('all');
	const [droppedID, setDroppedID] = React.useState(-1);
	const [w5bInDropList, setW5bInDropList] = React.useState(Boolean);
	const [indexForLeft, setIndexForLeft] = React.useState(Number);
	const [dropItemList, setDropItemList] = React.useState(Array);
	const [tempDroppedItem, setTempDroppedItem] = React.useState();
	const classes = useStyles();
	const beastContract = useBeast();
	const web3 = useWeb3();

	React.useEffect(() => {
		if (account) {
			getBalance();
		}
	}, []);

	React.useEffect(() => {
		if (beastDropBoxList.length < createlegions.main.maxAvailableDragCount && droppedID > -1) {
			let tempIndexS = (warrior5beast ? warriorDragBoxList : beastDragBoxList);
			let tmpArray = (warrior5beast ? warriorDropBoxList : beastDropBoxList);
			const droppedIDIndex = tempIndexS.indexOf(droppedID);
			if (droppedIDIndex <= -1) {
				return;
			}
			let droppedNum = tempIndexS.splice(droppedIDIndex, 1);
			tmpArray = [...tmpArray, droppedNum[0]];
			if (warrior5beast) {
				setWarriorDropBoxList(tmpArray);
				setWarriorDragBoxList(tempIndexS);
			} else {
				setBeastDropBoxList(tmpArray);
				setBeastDragBoxList(tempIndexS);
			}
			setDropItemList((prevState) => [...prevState, tempDroppedItem]);
			console.log(droppedID, dropItemList);
		}
		setDroppedID(-1);
	}, [droppedID]);

	React.useEffect(() => {
		if (indexForLeft === -1) {
			return;
		}
		let tempIndexS = (w5bInDropList ? warriorDragBoxList : beastDragBoxList);
		let tmpArray = (w5bInDropList ? warriorDropBoxList : beastDropBoxList);
		const droppedIDIndex = tmpArray.indexOf(indexForLeft);
		if (droppedIDIndex <= -1) {
			return;
		}
		let tmpInsertPos = -1;
		let droppedNum = tmpArray.splice(droppedIDIndex, 1);
		let tmpIndexValue = droppedNum[0] as number;
		if (tmpIndexValue === 0) {
			tmpInsertPos = 0;
		} else {
			for (; tmpIndexValue > 0; tmpIndexValue--) {
				tmpInsertPos = tempIndexS.findIndex((tmpIndex) => (tmpIndex === tmpIndexValue));
				if (tmpInsertPos !== -1) {
					break;
				}
			}
			if (tmpInsertPos === -1) {
				for (tmpIndexValue = droppedNum[0] as number; tmpIndexValue < beasts.length; tmpIndexValue++) {
					tmpInsertPos = tempIndexS.findIndex((tmpIndex) => (tmpIndex === tmpIndexValue));
					if (tmpInsertPos !== -1) {
						break;
					}
				}
			}
		}
		console.log(droppedNum[0], tmpInsertPos);
		tmpInsertPos = (tmpInsertPos === 0 ? 0 : tmpInsertPos + 1);
		tempIndexS.splice(tmpInsertPos, 0, droppedNum[0]);
		console.log(tempIndexS);
		tempIndexS = [...tempIndexS];

		if (warrior5beast) {
			setWarriorDropBoxList(tmpArray);
			setWarriorDragBoxList(tempIndexS);
		} else {
			setBeastDropBoxList(tmpArray);
			setBeastDragBoxList(tempIndexS);
		}
		let tmpDropItemList = dropItemList;
		const indexOfRight = tmpDropItemList.findIndex((item: any) => (item.w5b === w5bInDropList && item.id === indexForLeft));
		tmpDropItemList.splice(indexOfRight, 1);
		setDropItemList(tmpDropItemList);
		setIndexForLeft(-1);
	}, [indexForLeft, w5bInDropList]);

	const getBalance = async () => {
		setBaseUrl(await getBeastUrl(web3, beastContract));
		setBalance(await getBeastBalance(web3, beastContract, account));
		const ids = await getBeastTokenIds(web3, beastContract, account);
		let amount = 0;
		let beast;
		let tempBeasts = [];
		let tempIndexS = [];
		for (let i = 0; i < ids.length; i++) {
			beast = await getBeastToken(web3, beastContract, ids[i]);
			tempBeasts.push(beast);
			tempIndexS.push(i as number);
			amount += parseInt(beast.capacity);
		}
		setBeasts(tempBeasts);
		setBeastDragBoxList(tempIndexS);
	}

	const changeDroppedIndex = (index: number) => {
		setDroppedID(index);
	}

	const moveToRight = (item: any) => {
		setTempDroppedItem(item);
	}

	const moveToLeft = (index: number, w5b: boolean) => {
		console.log(index, w5b);
		setIndexForLeft(index);
		setW5bInDropList(w5b);
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
			<title>{meta_constant.createlegions.title}</title>
			<meta name="description" content={meta_constant.createlegions.description} />
			{meta_constant.createlegions.keywords && <meta name="keywords" content={meta_constant.createlegions.keywords.join(',')} />}
		</Helmet>
		<Grid container spacing={2} justifyContent="center" sx={{ my: 2 }}>
			<Grid item xs={12}>
				<Card>
					<Box className={classes.warning} sx={{ p: 4, justifyContent: 'start', alignItems: 'center' }}>
						<ErrorOutline color='error' fontSize='large' />
						<Box sx={{ display: 'flex', flexDirection: 'column', mx: 4 }}>
							<Typography variant='h3' sx={{ fontWeight: 'bold' }}>
								{getTranslation('updateLegion')}
							</Typography>
						</Box>
					</Box>
				</Card>
			</Grid>
			<Grid item xs={12}>
				<Button variant="contained" sx={{ fontWeight: 'bold', p: 2 }}>
					<IconButton aria-label="claim" component="span" sx={{ p: 0, mr: 1, color: 'black', bgcolor: 'smooth' }}>
						<ArrowBack />
					</IconButton>
					{getTranslation('btnBackToLegions')}
				</Button>
			</Grid>
			{
				beasts.length > 0 &&
				<DndProvider backend={HTML5Backend}>
					<Grid container spacing={2} justifyContent="center" wrap='wrap-reverse' sx={{ my: 2 }}>
						<Grid item xs={12} sm={12} md={6}>
							<Card>
								<Grid container spacing={2} sx={{ p: 4 }}>
									<Grid item xs={12}>
										<Grid container sx={{ justifyContent: 'space-between' }}>
											<Grid item>
												<FormControl component="fieldset">
													<ButtonGroup variant="outlined" color="primary">
														<Button variant={warrior5beast ? "contained" : "outlined"} onClick={() => { setWarrior5beat(!warrior5beast) }}>{getTranslation('warriors')}</Button>
														<Button variant={!warrior5beast ? "contained" : "outlined"} onClick={() => { setWarrior5beat(!warrior5beast) }}>{getTranslation('beasts')}</Button>
													</ButtonGroup>
												</FormControl>
											</Grid>
											{
												warrior5beast &&
												<Grid item>
													<FormControl component="fieldset" sx={{ width: '100%', minWidth: '250px' }}>
														<FormLabel component="legend">{getTranslation('filterAP')}:</FormLabel>
														<Slider
															getAriaLabel={() => "Custom marks"}
															// defaultValue={20}
															value={apValue}
															min={5}
															max={80}
															marks={[
																{ value: 5, label: '5' },
																{ value: 80, label: '80' },
															]}
															step={1}
															valueLabelDisplay="auto"
															onChange={handleChangeAp}
															disableSwap
														/>
													</FormControl>
												</Grid>
											}
											{
												!warrior5beast &&
												<Grid item>
													<FormControl component="fieldset">
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
											}
										</Grid>
									</Grid>
								</Grid>
								<Grid container spacing={2} sx={{ p: 4 }}>
									{warrior5beast && <Grid item>
										Warrior
									</Grid>
									}
									{!warrior5beast &&
										(beasts.filter((item: any, findex) => beastDragBoxList.includes(findex) && (filter === 'all' ? parseInt(item.strength) >= 0 : item.strength === filter)).map((item: any, index) => (
											<DragBox item={item} baseUrl={baseUrl} baseIndex={beastDragBoxList[index] as number} dropped={changeDroppedIndex} curIndex={index} w5b={warrior5beast} key={beastDragBoxList[index] as number} />
										)))
									}
								</Grid>
							</Card>
						</Grid>

						{/* Right Panel */}
						<Grid item xs={12} sm={12} md={6}>
							<Card sx={{ height: '100%' }}>
								<Grid item xs={12} sx={{ p: 4 }}>
									<Grid container sx={{ justifyContent: 'space-around' }}>
										<Grid item><Input placeholder={getTranslation('updateNamePlaceholder')} /></Grid>
										<Grid item><Button color='error' variant='contained'>{getTranslation('createLegionsBtn')}</Button></Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} sx={{ p: 4 }}>
									<Grid container sx={{ display: 'flex', justifyContent: 'space-around', pb: 2, borderBottom: '2px dashed grey' }}>
										<Grid item><Typography>{getTranslation('yourOldLegionAP')}: {formatNumber('000000')} AP</Typography></Grid>
										<Grid item><Typography>{getTranslation('beasts')}: {beastDropBoxList.length}/{createlegions.main.maxAvailableDragCount}</Typography></Grid>
										<Grid item><Typography>{getTranslation('warriors')}: {warriorDropBoxList.length}/{warriorDragBoxList.length}</Typography></Grid>
									</Grid>
								</Grid>
								<DropBox baseUrl={baseUrl} items={dropItemList} count={beastDropBoxList.length} toLeft={moveToLeft} itemMove={moveToRight} />
							</Card>
						</Grid>
					</Grid>
				</DndProvider>
			}
			{
				beasts.length === 0 && !warrior5beast &&
				<>
					<Grid item xs={12} sx={{ p: 4, textAlign: 'center' }}>
						<Typography variant='h4' >{getTranslation('loadingTitle')}</Typography>
					</Grid>
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
				</>
			}
		</Grid>
	</Box >
}

export default UpdateLegions