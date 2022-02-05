import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import Helmet from 'react-helmet'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Box, Typography, Grid, Card, CardMedia, Input, Slider, Button, IconButton, FormControl, FormLabel, ButtonGroup } from '@mui/material'
import { ErrorOutline, ArrowBack } from '@mui/icons-material'
import { makeStyles } from '@mui/styles'
import { useWeb3React } from '@web3-react/core'

import { meta_constant, createlegions } from '../../config/meta.config'
import { getLegionBloodstoneAllowance, setLegionBloodstoneApprove, getWarriorTokenIds, getWarriorToken } from '../../hooks/contractFunction'
import { mintLegion, getBeastBalance, getBeastTokenIds, getBeastToken, getBaseUrl } from '../../hooks/contractFunction'
import { useBloodstone, useBeast, useWarrior, useWeb3, useLegion } from '../../hooks/useContract'
import { getTranslation } from '../../utils/translation'
import { formatNumber } from '../../utils/common'
import { DragBox } from './DragBox'
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
})

const CreateLegions: React.FC = () => {
	const { account } = useWeb3React()

	const [loading, setLoading] = React.useState(true)
	const [apValue, setApValue] = React.useState<number[]>([500, 60000])
	const [warrior5beast, setWarrior5beat] = React.useState(true)
	const [warriorDropBoxList, setWarriorDropBoxList] = React.useState(Array)
	const [beastDropBoxList, setBeastDropBoxList] = React.useState(Array)
	const [warriorDragBoxList, setWarriorDragBoxList] = React.useState(Array)
	const [beastDragBoxList, setBeastDragBoxList] = React.useState(Array)
	const [beasts, setBeasts] = React.useState(Array)
	const [warriors, setWarriors] = React.useState(Array)
	const [baseUrl, setBaseUrl] = React.useState('')
	const [filter, setFilter] = React.useState('all')
	const [droppedID, setDroppedID] = React.useState(-1)
	const [w5bInDropList, setW5bInDropList] = React.useState(Boolean)
	const [indexForLeft, setIndexForLeft] = React.useState(Number)
	const [dropItemList, setDropItemList] = React.useState(Array)
	const [tempDroppedItem, setTempDroppedItem] = React.useState()
	const [showAnimation, setShowAnimation] = React.useState<string | null>('0')
	const [totalAP, setTotalAp] = React.useState(0)
	const [totalCP, setTotalCP] = React.useState(0)
	const [legionName, setLegionName] = React.useState('')
	const [isWDropable, setIsWDropable] = React.useState(false)

	const navigate = useNavigate()
	const classes = useStyles()
	const warriorContract = useWarrior()
	const beastContract = useBeast()
	const legionContract = useLegion()
	const bloodstoneContract = useBloodstone()
	const web3 = useWeb3()

	React.useEffect(() => {
		if (account) {
			getBalance()
		}
		setShowAnimation(localStorage.getItem('showAnimation') ? localStorage.getItem('showAnimation') : '0')
	}, [])

	React.useEffect(() => {
		if (beastDropBoxList.length < createlegions.main.maxAvailableDragCount && droppedID > -1) {
			let dragBoxList = (warrior5beast ? warriorDragBoxList : beastDragBoxList)
			let dropBoxList = (warrior5beast ? warriorDropBoxList : beastDropBoxList)
			const droppedIDIndex = dragBoxList.indexOf(droppedID)
			if (droppedIDIndex <= -1) {
				return
			}
			let droppedNum = dragBoxList.splice(droppedIDIndex, 1)[0]
			dropBoxList = [...dropBoxList, droppedNum]
			if (warrior5beast) {
				setWarriorDropBoxList(dropBoxList)
				setWarriorDragBoxList(dragBoxList)
			} else {
				setBeastDropBoxList(dropBoxList)
				setBeastDragBoxList(dragBoxList)
			}
			setDropItemList((prevState) => [...prevState, tempDroppedItem])
		}
		setDroppedID(-1)
		getTotalAP_CP()
	}, [droppedID])

	React.useEffect(() => {
		if (indexForLeft === -1) {
			return
		}
		let dragBoxList = (w5bInDropList ? warriorDragBoxList : beastDragBoxList)
		let dropBoxList = (w5bInDropList ? warriorDropBoxList : beastDropBoxList)
		const droppedIDIndex = dropBoxList.indexOf(indexForLeft)
		if (droppedIDIndex <= -1) {
			return
		}
		let tmpInsertPos = -1
		let droppedNum = dropBoxList.splice(droppedIDIndex, 1)[0]
		let tmpIndexValue = droppedNum as number
		if (tmpIndexValue === 0) {
			tmpInsertPos = 0
		} else {
			for (; tmpIndexValue > 0; tmpIndexValue--) {
				tmpInsertPos = dragBoxList.findIndex((tmpIndex) => (tmpIndex === tmpIndexValue))
				if (tmpInsertPos !== -1) {
					break
				}
			}
			if (tmpInsertPos === -1) {
				for (tmpIndexValue = droppedNum as number; tmpIndexValue < beasts.length; tmpIndexValue++) {
					tmpInsertPos = dragBoxList.findIndex((tmpIndex) => (tmpIndex === tmpIndexValue))
					if (tmpInsertPos !== -1) {
						break
					}
				}
			}
		}
		tmpInsertPos = (tmpInsertPos === 0 ? 0 : tmpInsertPos + 1)
		dragBoxList.splice(tmpInsertPos, 0, droppedNum)
		dragBoxList = [...dragBoxList]

		if (warrior5beast) {
			setWarriorDropBoxList(dropBoxList)
			setWarriorDragBoxList(dragBoxList)
		} else {
			setBeastDropBoxList(dropBoxList)
			setBeastDragBoxList(dragBoxList)
		}
		let tmpDropItemList = dropItemList
		const indexOfRight = tmpDropItemList.findIndex((item: any) => (item.w5b === w5bInDropList && item.id === indexForLeft))
		tmpDropItemList.splice(indexOfRight, 1)
		setDropItemList(tmpDropItemList)
		setIndexForLeft(-1)
		getTotalAP_CP()
	}, [indexForLeft, w5bInDropList])

	const getTotalAP_CP = () => {
		let sum = 0
		let cp = 0
		warriorDropBoxList.forEach((index: any) => {
			sum += parseInt((warriors[index] as any)['power'])
		})
		beastDropBoxList.forEach((index: any) => {
			cp += parseInt((beasts[index] as any)['capacity'])
		})
		setTotalCP(cp)
		setTotalAp(sum)
		setIsWDropable(cp > 0 && cp >= warriorDropBoxList.length && totalAP >= createlegions.main.minAvailableAP && legionName.length > 0)
	}

	const getBalance = async () => {
		setLoading(true)
		setBaseUrl(await getBaseUrl())
		const beastIds = await getBeastTokenIds(web3, beastContract, account)
		const warriorIds = await getWarriorTokenIds(web3, warriorContract, account)
		let amount = 0
		let beast
		let tempBeasts = []
		let tempBeastsIndexS = []
		for (let i = 0; i < beastIds.length; i++) {
			beast = await getBeastToken(web3, beastContract, beastIds[i])
			tempBeasts.push({ ...beast, id: beastIds[i] })
			tempBeastsIndexS.push(i as number)
			amount += parseInt(beast.capacity)
		}
		let warrior
		let tempWarriors = []
		let tempWarriorsIndexS = []
		for (let i = 0; i < warriorIds.length; i++) {
			warrior = await getWarriorToken(web3, warriorContract, warriorIds[i])
			tempWarriors.push({ ...warrior, id: warriorIds[i] })
			tempWarriorsIndexS.push(i as number)
			amount += parseInt(warrior.power)
		}
		setBeasts(tempBeasts)
		setWarriors(tempWarriors)
		setBeastDragBoxList(tempBeastsIndexS)
		setWarriorDragBoxList(tempWarriorsIndexS)
		setLoading(false)
	}

	const changeDroppedIndex = (index: number) => {
		setDroppedID(index)
	}

	const moveToRight = (item: any) => {
		setTempDroppedItem(item)
	}

	const moveToLeft = (index: number, w5b: boolean) => {
		setIndexForLeft(index)
		setW5bInDropList(w5b)
	}

	const handleChangeAp = (
		event: Event,
		newValue: number | number[],
		activeThumb: number,
	) => {
		if (!Array.isArray(newValue)) {
			return
		}

		if (activeThumb === 0) {
			setApValue([Math.min(newValue[0], apValue[1] - 1), apValue[1]])
		} else {
			setApValue([apValue[0], Math.max(newValue[1], apValue[0] + 1)])
		}
	}

	const handleMint = async () => {
		const allowance = await getLegionBloodstoneAllowance(web3, bloodstoneContract, account)
		if (allowance === '0') {
			await setLegionBloodstoneApprove(web3, bloodstoneContract, account)
		}
		await mintLegion(web3, legionContract, account, legionName,
			beasts.filter((b, index) => beastDropBoxList.includes(index)).map((beast: any) => { return parseInt(beast['id']) }),
			warriors.filter((w, index) => warriorDropBoxList.includes(index)).map((warrior: any) => { return parseInt(warrior['id']) }))
		navigate("/legions")
	}

	const handleChangedName = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLegionName(e.target.value);
		setIsWDropable(totalCP > 0 && totalCP >= warriorDropBoxList.length && totalAP >= createlegions.main.minAvailableAP && legionName.length > 0)
	}

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
								{getTranslation('createLegion')}
							</Typography>
						</Box>
					</Box>
				</Card>
			</Grid>
			<Grid item xs={12}>
				<Button variant="contained" sx={{ fontWeight: 'bold', p: 2 }}>
					<NavLink to='/legions' className='non-style'>
						<IconButton aria-label="claim" component="span" sx={{ p: 0, mr: 1, color: 'black', bgcolor: 'smooth' }}>
							<ArrowBack />
						</IconButton>
						{getTranslation('btnBackToLegions')}
					</NavLink>
				</Button>
			</Grid>
			{
				!loading &&
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
														<Button variant={!warrior5beast ? "contained" : "outlined"} onClick={() => { setWarrior5beat(!warrior5beast) }}>{getTranslation('beasts')}</Button>
														<Button variant={warrior5beast ? "contained" : "outlined"} onClick={() => { setWarrior5beat(!warrior5beast) }}>{getTranslation('warriors')}</Button>
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
									{
										warrior5beast &&
										warriors.filter((fitem: any, findex) => warriorDragBoxList.includes(findex) && (apValue[0] < parseInt(fitem.power) && apValue[1] > parseInt(fitem.power))).map((item: any, index) => (
											<DragBox item={item} showAnimation={showAnimation} baseUrl={baseUrl} baseIndex={warriorDragBoxList[index] as number} dropped={changeDroppedIndex} curIndex={index} w5b={warrior5beast} key={warriorDragBoxList[index] as number} />
										))
									}
									{
										!warrior5beast &&
										beasts.filter((fitem: any, findex) => beastDragBoxList.includes(findex) && (filter === 'all' ? parseInt(fitem.capacity) >= 0 : fitem.capacity === filter)).map((item: any, index) => (
											<DragBox item={item} showAnimation={showAnimation} baseUrl={baseUrl} baseIndex={beastDragBoxList[index] as number} dropped={changeDroppedIndex} curIndex={index} w5b={warrior5beast} key={beastDragBoxList[index] as number} />
										))
									}
								</Grid>
							</Card>
						</Grid>

						{/* Right Panel */}
						<Grid item xs={12} sm={12} md={6}>
							<Card sx={{ height: '100%' }}>
								<Grid item xs={12} sx={{ p: 4 }}>
									<Grid container sx={{ justifyContent: 'space-around' }}>
										<Grid item>
											<Input placeholder={getTranslation('nameLegion')} value={legionName} onChange={handleChangedName} />
										</Grid>
										<Grid item>
											<Button color='error' variant='contained' onClick={() => handleMint()} disabled={!isWDropable}>
												{getTranslation('createLegionsBtn')} {totalAP < createlegions.main.minAvailableAP ? ('Minimum' + createlegions.main.minAvailableAP) : totalAP} AP
											</Button>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} sx={{ p: 4 }}>
									<Grid container sx={{ display: 'flex', justifyContent: 'space-around', pb: 2, borderBottom: '2px dashed grey' }}>
										<Grid item><Typography>{getTranslation('beasts')}: {beastDropBoxList.length}/{createlegions.main.maxAvailableDragCount}</Typography></Grid>
										<Grid item><Typography>{getTranslation('warriors')}: {totalAP}/{formatNumber(createlegions.main.maxAvailableAP)}</Typography></Grid>
									</Grid>
								</Grid>
								<DropBox baseUrl={baseUrl} items={dropItemList} toLeft={moveToLeft} moveToRight={moveToRight} />
							</Card>
						</Grid>
					</Grid>
				</DndProvider>
			}
			{
				loading &&
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

export default CreateLegions