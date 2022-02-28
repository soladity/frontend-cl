import React from "react";
import {
	Box,
	Typography,
	Grid,
	Card,
	CardMedia,
	ButtonGroup,
	Button,
	Slider,
	FormLabel,
	FormControl,
	Checkbox,
	Dialog,
	DialogTitle,
	List,
	ListItem,
	ListItemText,
	DialogContent,
	TextField
} from "@mui/material";
import Helmet from "react-helmet";
import { makeStyles } from "@mui/styles";
import { useWeb3React } from "@web3-react/core";
import { NavLink, useNavigate } from "react-router-dom";

import LegionCard from "../../component/Cards/LegionCard";
import {
	useBeast,
	useWarrior,
	useLegion,
	useMarketplace,
	useFeeHandler,
	useWeb3,
} from "../../hooks/useContract";
import {
	getBeastBalance,
	getWarriorBalance,
	getLegionTokenIds,
	getLegionToken,
	addSupply,
	getBaseUrl,
	getLegionImage,
	getHuntStatus,
	setMarketplaceApprove,
	sellToken,
	getFee
} from "../../hooks/contractFunction";
import { meta_constant } from "../../config/meta.config";
import { getTranslation } from "../../utils/translation";
import CommonBtn from "../../component/Buttons/CommonBtn";
import { formatNumber } from "../../utils/common";

const useStyles = makeStyles({
	root: {
		display: "flex",
		flexDirection: "column",
	},
	card: {
		display: "flex",
		flexDirection: "column",
		minHeight: "180px",
	},
	warning: {
		display: "flex",
		minHeight: "80px",
	},
});

type LegionProps = {
	id: string;
	name: string;
	beasts: Array<string>;
	warriors: Array<string>;
	supplies: string;
	attackPower: number;
	image: string;
	huntStatus: string;
};

const Legions = () => {
	const { account } = useWeb3React();
	const navigate = useNavigate();

	const [beastBalance, setBeastBalance] = React.useState("0");
	const [warriorBalance, setWarriorBalance] = React.useState("0");
	const [baseUrl, setBaseUrl] = React.useState("");
	const [totalPower, setTotalPower] = React.useState(0);
	const [legions, setLegions] = React.useState<LegionProps[]>(Array);
	const [highest, setHighest] = React.useState(true);
	const [huntStatus, setHuntStatus] = React.useState("");
	const [hideWeak, setHideWeak] = React.useState(false);
	const [openSupply, setOpenSupply] = React.useState(false);
	const [selectedLegion, setSelectedLegion] = React.useState(-1);
	const [openShopping, setOpenShopping] = React.useState(false);
	const [price, setPrice] = React.useState(0);
	const [marketplaceTax, setMarketplaceTax] = React.useState('0');
	const [loading, setLoading] = React.useState(false);
	const [supplyLoading, setSupplyLoading] = React.useState(false);
	const [apValue, setApValue] = React.useState<number[]>([0, 250000]);
	const [actionLoading, setActionLoading] = React.useState(false);

	const classes = useStyles();
	const legionContract = useLegion();
	const beastContract = useBeast();
	const warriorContract = useWarrior();
	const marketplaceContract = useMarketplace();
	const feeHandlerContract = useFeeHandler();
	const web3 = useWeb3();

	React.useEffect(() => {
		if (account) {
			getBalance();
		}
	}, []);

	const getBalance = async () => {
		setLoading(true);
		setMarketplaceTax(((await getFee(feeHandlerContract, 0)) / 100).toFixed(0));
		setBaseUrl(await getBaseUrl());
		setBeastBalance(await getBeastBalance(web3, beastContract, account));
		setWarriorBalance(await getWarriorBalance(web3, warriorContract, account));
		const ids = await getLegionTokenIds(web3, legionContract, account);
		let amount = 0;
		let legion;
		let image;
		let huntStatus;
		let tempLegions = [];
		for (let i = 0; i < ids.length; i++) {
			legion = await getLegionToken(web3, legionContract, ids[i]);
			image = await getLegionImage(web3, legionContract, legion.attackPower);
			huntStatus = await getHuntStatus(web3, legionContract, ids[i]);
			tempLegions.push({
				...legion,
				id: ids[i],
				...image,
				huntStatus: huntStatus,
			});
			amount += legion.attackPower;
		}
		setTotalPower(amount);
		let sortedArray = tempLegions.sort((a, b) => {
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
	};

	const handleChangeAp = (
		event: Event,
		newValue: number | number[],
		activeThumb: number
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
		setSupplyLoading(true);
		setOpenSupply(false);
		try {
			await addSupply(
				web3,
				legionContract,
				account,
				selectedLegion,
				parseInt(value)
			);
		} catch (e) {
			console.log(e);
		}
		setSupplyLoading(false);
		getBalance();
	};

	const handleOpenSupply = (id: number) => {
		setSelectedLegion(id);
		setOpenSupply(true);
	};

	const handleUpdateLegoin = (id: number) => {
		navigate("/updatelegions/" + id);
	};

	const handleShoppingClose = () => {
		setOpenShopping(false);
	};

	const handleOpenShopping = (id: number) => {
		setSelectedLegion(id);
		setOpenShopping(true);
	}

	const handlePrice = (e: any) => {
		setPrice(e.target.value);
	}

	const handleSendToMarketplace = async () => {
		setActionLoading(true);
		setOpenShopping(false);
		try {
			await setMarketplaceApprove(web3, legionContract, account, selectedLegion);
			await sellToken(web3, marketplaceContract, account, '3', selectedLegion, price);
			let power = 0;
			let temp = legions;
			for (let i = 0; i < temp.length; i++) {
				if (parseInt(temp[i]['id']) === selectedLegion)
					power = temp[i]['attackPower'];
			}
			setTotalPower(totalPower - power);
			setLegions(legions.filter((item: any) => parseInt(item.id) !== selectedLegion));
		} catch (e) {
			console.log(e);
		}
		setActionLoading(false);
	}

	return (
		<Box>
			<Helmet>
				<meta charSet="utf-8" />
				<title>{meta_constant.legions.title}</title>
				<meta name="description" content={meta_constant.legions.description} />
				{meta_constant.legions.keywords && (
					<meta
						name="keywords"
						content={meta_constant.legions.keywords.join(",")}
					/>
				)}
			</Helmet>
			<Grid container spacing={2} sx={{ my: 4 }}>
				<Grid item xs={12}>
					<Card>
						<Box
							className={classes.warning}
							sx={{ p: 4, justifyContent: "start", alignItems: "center" }}
						>
							<Box sx={{ display: "flex", flexDirection: "column", mx: 4 }}>
								<Typography variant="h3" sx={{ fontWeight: "bold" }}>
									{getTranslation("legions")}
								</Typography>
							</Box>
						</Box>
					</Card>
				</Grid>
				<Grid item xs={12} md={4}>
					<Card>
						<Box
							className={classes.card}
							sx={{ p: 4, justifyContent: "center", alignItems: "center" }}
						>
							<CommonBtn sx={{ fontWeight: "bold" }}>
								<NavLink to="/createlegions" className="non-style">
									{getTranslation("createLegion")}
								</NavLink>
							</CommonBtn>
							<Box sx={{ display: "flex", mt: 2 }}>
								<Typography variant="h6" sx={{ fontWeight: "bold" }}>
									{getTranslation("availableWarrior")}
								</Typography>
								<Typography
									variant="h6"
									color="secondary"
									sx={{ fontWeight: "bold", ml: 2 }}
								>
									{warriorBalance}
								</Typography>
							</Box>
							<Box sx={{ display: "flex" }}>
								<Typography variant="h6" sx={{ fontWeight: "bold" }}>
									{getTranslation("availableBeast")}
								</Typography>
								<Typography
									variant="h6"
									color="secondary"
									sx={{ fontWeight: "bold", ml: 2 }}
								>
									{beastBalance}
								</Typography>
							</Box>
						</Box>
					</Card>
				</Grid>
				<Grid item xs={12} md={4}>
					<Card>
						<Box
							className={classes.card}
							sx={{ p: 4, justifyContent: "center", alignItems: "center" }}
						>
							<Typography variant="h6" sx={{ fontWeight: "bold" }}>
								{getTranslation("currentLegion")}
							</Typography>
							<Typography
								variant="h4"
								color="secondary"
								sx={{ fontWeight: "bold" }}
							>
								{legions.length}
							</Typography>
							<Typography variant="h6" sx={{ fontWeight: "bold" }}>
								{getTranslation("totalAp")}
							</Typography>
							<Typography
								variant="h6"
								color="primary"
								sx={{ fontWeight: "bold" }}
							>
								{formatNumber(totalPower)}
							</Typography>
							<CommonBtn sx={{ fontWeight: "bold", mt: 1 }}>
								<NavLink to="/hunt" className="non-style">
									{getTranslation("hunt")}
								</NavLink>
							</CommonBtn>
						</Box>
					</Card>
				</Grid>
				<Grid item xs={12} md={4}>
					<Card>
						<Box
							className={classes.card}
							sx={{ p: 4, justifyContent: "center", alignItems: "center" }}
						>
							<Typography variant="h6" sx={{ fontWeight: "bold" }}>
								{getTranslation("top3Legions")}
							</Typography>
							{legions
								.filter((item: any, index) => index < 3)
								.map((item: any, index) => (
									<Box sx={{ display: "flex" }} key={index}>
										<Typography variant="subtitle1">{item.name}</Typography>
										<Typography
											variant="subtitle1"
											sx={{
												ml: 2,
												color:
													item.huntStatus === "green"
														? "green"
														: item.huntStatus === "orange"
															? "orange"
															: "red",
											}}
										>
											{formatNumber(item.attackPower)} AP
										</Typography>
									</Box>
								))}
						</Box>
					</Card>
				</Grid>
			</Grid>
			{loading === false && supplyLoading === false && actionLoading === false && (
				<div>
					<Grid container spacing={2} sx={{ my: 3 }}>
						<Grid item xs={12} md={6} lg={3}>
							<FormControl component="fieldset" sx={{ width: "90%" }}>
								<FormLabel component="legend">
									{getTranslation("filterByAp")}:
								</FormLabel>
								<Slider
									getAriaLabel={() => "Custom marks"}
									// defaultValue={20}
									value={apValue}
									min={0}
									max={250000}
									marks={[
										{ value: 2000, label: "0" },
										{ value: 250000, label: formatNumber("250K+") },
									]}
									step={1}
									valueLabelDisplay="auto"
									onChange={handleChangeAp}
									disableSwap
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={6} lg={3}>
							<FormControl component="fieldset" sx={{ width: "90%" }}>
								<FormLabel component="legend">
									{getTranslation("sortByAp")}:
								</FormLabel>
								<ButtonGroup variant="outlined" color="primary" sx={{ pt: 1 }}>
									<Button
										variant={!highest ? "contained" : "outlined"}
										onClick={() => {
											setHighest(!highest);
										}}
									>
										{getTranslation("lowest")}
									</Button>
									<Button
										variant={highest ? "contained" : "outlined"}
										onClick={() => {
											setHighest(!highest);
										}}
									>
										{getTranslation("highest")}
									</Button>
								</ButtonGroup>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={6} lg={3}>
							<FormControl component="fieldset" sx={{ width: "90%" }}>
								<FormLabel component="legend">
									{getTranslation("huntStatus")}:
								</FormLabel>
								<ButtonGroup variant="outlined" color="primary" sx={{ pt: 1 }}>
									<Button
										variant={huntStatus === "green" ? "contained" : "outlined"}
										onClick={() => {
											setHuntStatus("green");
										}}
									>
										{getTranslation("green")}
									</Button>
									<Button
										variant={huntStatus === "orange" ? "contained" : "outlined"}
										onClick={() => {
											setHuntStatus("orange");
										}}
									>
										{getTranslation("orange")}
									</Button>
									<Button
										variant={huntStatus === "red" ? "contained" : "outlined"}
										onClick={() => {
											setHuntStatus("red");
										}}
									>
										{getTranslation("red")}
									</Button>
								</ButtonGroup>
							</FormControl>
						</Grid>
						<Grid
							item
							xs={12}
							md={6} lg={3}
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "flex-start",
							}}
						>
							<FormControl component="fieldset" sx={{ width: "90%" }}>
								<FormLabel component="legend">
									{getTranslation("hideWeakLegions")}:
								</FormLabel>
							</FormControl>
							<Checkbox
								checked={hideWeak}
								onChange={() => {
									setHideWeak(!hideWeak);
								}}
								inputProps={{ "aria-label": "controlled" }}
							/>
						</Grid>
					</Grid>
					<Grid
						container
						spacing={4}
						sx={{
							mb: 4,
							flexDirection: highest ? "row" : "row-reverse",
							justifyContent: highest ? "flex-start" : "flex-end",
						}}
					>
						{legions
							.filter(
								(item: any) =>
									apValue[0] <= parseInt(item.attackPower) &&
									(apValue[1] === 250000
										? true
										: apValue[1] >= parseInt(item.attackPower))
							)
							.filter((item: any) =>
								hideWeak === true ? item.attackPower >= 2000 : true
							)
							.filter(
								(item: any) =>
									huntStatus === item.huntStatus || huntStatus === ""
							)
							.map((item: any, index) => (
								<Grid item xs={12} sm={6} md={4} lg={3} key={index}>
									<LegionCard
										id={item["id"]}
										image={baseUrl + item.image}
										name={item["name"]}
										beasts={item["beasts"]}
										warriors={item["warriors"]}
										supplies={item["supplies"]}
										attackPower={item["attackPower"]}
										huntStatus={item["huntStatus"]}
										handleOpenSupply={handleOpenSupply}
										handleUpdate={handleUpdateLegoin}
										handleOpenShopping={handleOpenShopping}
									/>
								</Grid>
							))}
					</Grid>
				</div>
			)}
			{loading === true && (
				<>
					<Grid item xs={12} sx={{ p: 4, textAlign: "center" }}>
						<Typography variant="h4">
							{getTranslation("loadingLegions")}
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
			{supplyLoading === true && (
				<>
					<Grid item xs={12} sx={{ p: 4, textAlign: "center" }}>
						<Typography variant="h4">
							{getTranslation("buyingSupplies")}
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
				<DialogTitle>{getTranslation("buySupply")}</DialogTitle>
				<List sx={{ pt: 0 }}>
					<ListItem
						button
						sx={{ textAlign: "center" }}
						onClick={() => handleSupplyClick("7")}
					>
						<ListItemText primary={`7 Hunts (${selectedLegion === -1 ? 0 : legions.filter((item) => parseInt(item.id) === selectedLegion)[0]['warriors'].length * 7} $BLST)`} />
					</ListItem>
					<ListItem
						button
						sx={{ textAlign: "center" }}
						onClick={() => handleSupplyClick("14")}
					>
						<ListItemText primary={`14 Hunts (${selectedLegion === -1 ? 0 : legions.filter((item) => parseInt(item.id) === selectedLegion)[0]['warriors'].length * 13} $BLST)`} />
					</ListItem>
					<ListItem
						button
						sx={{ textAlign: "center" }}
						onClick={() => handleSupplyClick("28")}
					>
						<ListItemText primary={`28 Hunts (${selectedLegion === -1 ? 0 : legions.filter((item) => parseInt(item.id) === selectedLegion)[0]['warriors'].length * 24} $BLST)`} />
					</ListItem>
				</List>
			</Dialog>
			<Dialog onClose={handleShoppingClose} open={openShopping}>
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
	);
};

export default Legions;
