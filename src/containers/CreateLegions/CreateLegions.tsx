import React from 'react';
import Helmet from 'react-helmet';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Box, Typography, Grid, Card, CardMedia, Input, Menu, MenuItem, Button, IconButton, FormControl, FormLabel, ButtonGroup } from '@mui/material';
import { ErrorOutline, ArrowBack } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';

import { meta_constant, createlegions } from '../../config/meta.config';
import { getBloodstoneAllowance, setBloodstoneApprove, mintBeast, getBeastBalance, getBeastTokenIds, getBeastToken, getBeastUrl } from '../../hooks/contractFunction';
import { useBloodstone, useBeast, useWeb3 } from '../../hooks/useContract';
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

const CreateLegions: React.FC = () => {
	const { account } = useWeb3React();

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
	const [droppedID, setDroppedID] = React.useState(Number);
	const classes = useStyles();
	const beastContract = useBeast();
	const web3 = useWeb3();

	React.useEffect(() => {
		if (account) {
			getBalance();
		}
	}, []);

	React.useEffect(() => {
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
	}, [droppedID]);

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

	const dropped = (index: number) => {
		setDroppedID(index);
	}

	const moveToLeft = (index: number) => {
		console.log(index);
	}

	return <Box>
		<Helmet>
			<meta charSet="utf-8" />
			<title>{meta_constant.createlegions.title}</title>
			<meta name="description" content={meta_constant.createlegions.description} />
			{meta_constant.createlegions.keywords && <meta name="keywords" content={meta_constant.createlegions.keywords.join(',')} />}
		</Helmet>
		<Grid container spacing={2} sx={{ my: 2 }}>
			<Grid item xs={12}>
				<Card>
					<Box className={classes.warning} sx={{ p: 4, justifyContent: 'start', alignItems: 'center' }}>
						<ErrorOutline color='error' fontSize='large' />
						<Box sx={{ display: 'flex', flexDirection: 'column', mx: 4 }}>
							<Typography variant='h3' sx={{ fontWeight: 'bold' }}>
								{createlegions.warning.title}
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
					{createlegions.main.backBtnTitle}
				</Button>
			</Grid>
			{
				beasts.length > 0 &&
				<DndProvider backend={HTML5Backend}>
					<Grid item xs={6}>
						<Card>
							<Grid container spacing={2} sx={{ p: 4 }}>
								<Grid item xs={12}>
									<FormControl component="fieldset">
										<ButtonGroup variant='outlined' color='primary' aria-label="outlined button group">
											<Button>Rank</Button>
											<Button>Rank</Button>
											<Button>Rank</Button>
										</ButtonGroup>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<Grid container sx={{ justifyContent: 'space-between' }}>
										<Grid item>
											<FormControl component="fieldset">
												<ButtonGroup variant="outlined" color="primary">
													<Button variant={warrior5beast ? "contained" : "outlined"} onClick={() => { setWarrior5beat(!warrior5beast) }}>Warriors</Button>
													<Button variant={!warrior5beast ? "contained" : "outlined"} onClick={() => { setWarrior5beat(!warrior5beast) }}>Beasts</Button>
												</ButtonGroup>
											</FormControl>
										</Grid>
										<Grid item>
											<FormControl component="fieldset">
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
								</Grid>
							</Grid>
							<Grid container spacing={2} sx={{ p: 4 }}>
								{warrior5beast && <Grid item>
									Warrior
								</Grid>
								}
								{!warrior5beast &&
									(beasts.filter((item: any, findex) => beastDragBoxList.includes(findex) && (filter === 'all' ? parseInt(item.strength) >= 0 : item.strength === filter)).map((item: any, index) => (
										<DragBox item={item} baseUrl={baseUrl} baseIndex={beastDragBoxList[index] as number} dropped={dropped} curIndex={index} key={beastDragBoxList[index] as number} />
									)))
								}
							</Grid>
						</Card>
					</Grid>

					{/* Right Panel */}
					<Grid item xs={6}>
						<Card sx={{ height: '100%' }}>
							<Grid item xs={12} sx={{ p: 4 }}>
								<Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
									<Input placeholder="Name your legion" />
									<Button color='error' variant='contained'>{createlegions.main.createBtnTitle}</Button>
								</Box>
							</Grid>
							<Grid item xs={12} sx={{ p: 4 }}>
								<Box sx={{ display: 'flex', justifyContent: 'space-around', pb: 2, borderBottom: '2px dashed grey' }}>
									<Typography>Beasts: {beastDropBoxList.length}/{beastDragBoxList.length}</Typography>
									<Typography>Warriors: {warriorDropBoxList.length}/{warriorDragBoxList.length}</Typography>
									{/* <Button color='error' variant='contained'>{createlegions.main.createBtnTitle}</Button> */}
								</Box>
							</Grid>
							<DropBox baseUrl={baseUrl} toLeft={moveToLeft} />
						</Card>
					</Grid>
				</DndProvider>
			}
			{
				beasts.length == 0 &&
				<Grid item xs={12}>
					<Card>
						<CardMedia
							component="img"
							image="/assets/images/loading.gif"
							alt="Loading"
							loading="lazy"
						/>
					</Card>
				</Grid>
			}
		</Grid>
	</Box>
}

export default CreateLegions