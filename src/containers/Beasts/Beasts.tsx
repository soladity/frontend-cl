import React from 'react';
import Helmet from 'react-helmet';
import { Box, Typography, Grid, Card, Menu, MenuItem, Button, IconButton } from '@mui/material';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';

import { meta_constant } from '../../config/meta.config';
import { getBloodstoneAllowance, setBloodstoneApprove, mintBeast } from '../../hooks/contractFunction';
import { useBloodstone, useBeast, useWeb3 } from '../../hooks/useContract';

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

const Beasts = () => {
	const {
		account,
	} = useWeb3React();

	const [showMint, setShowMint] = React.useState(false);

	const classes = useStyles();
	const beastContract = useBeast();
	const bloodstoneContract = useBloodstone();
	const web3 = useWeb3();

	const handleOpenMint = () => {
		setShowMint(true);
	};

	const handleCloseMint = () => {
		setShowMint(false);
	};

	const handleMint = async (amount: Number) => {
		const allowance = await getBloodstoneAllowance(web3, bloodstoneContract, account);
		if (allowance === '0'){
			await setBloodstoneApprove(web3, bloodstoneContract, account);
		}
		const response = await mintBeast(web3, beastContract, account, amount);
		console.log(response)
	}

	return <Box>
		<Helmet>
			<meta charSet="utf-8" />
			<title>{meta_constant.beasts.title}</title>
			<meta name="description" content={meta_constant.beasts.description} />
			{meta_constant.beasts.keywords && <meta name="keywords" content={meta_constant.beasts.keywords.join(',')} />}
		</Helmet>
		<Grid container spacing={2} sx={{ my: 4 }}>
			<Grid item xs={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							Summon Beasts
						</Typography>
						<Box onMouseOver={handleOpenMint} onMouseLeave={handleCloseMint} sx={{ pt: 1 }}>
							<Button variant="contained" sx={{ fontWeight: 'bold' }}>
								<IconButton aria-label="claim" component="span" sx={{ p: 0, mr: 1, color: 'black' }}>
									<HorizontalSplitIcon />
								</IconButton>
								MINT QUANTITY
							</Button>
							{
								showMint &&
								<Box className={classes.root} sx={{ pt: 2, '& button': { fontWeight: 'bold', mb: 1 } }}>
									<Button variant="contained" onClick={() => handleMint(1)}>
										1
									</Button>
									<Button variant="contained" onClick={() => handleMint(5)}>
										5
									</Button>
									<Button variant="contained" onClick={() => handleMint(10)}>
										10
									</Button>
									<Button variant="contained" onClick={() => handleMint(20)}>
										20
									</Button>
									<Button variant="contained" onClick={() => handleMint(100)}>
										100
									</Button>
								</Box>
							}
						</Box>
					</Box>
				</Card>
			</Grid>
			<Grid item xs={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							Current Beasts
						</Typography>
					</Box>
				</Card>
			</Grid>
			<Grid item xs={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							Total Maximum Warriors Capacity
						</Typography>
					</Box>
				</Card>
			</Grid>
		</Grid>
	</Box>
}

export default Beasts
