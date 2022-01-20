import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { Box, Typography, Grid, Card, Input, Menu, MenuItem, Button, IconButton, FormControl, FormLabel, ButtonGroup } from '@mui/material';
import { ErrorOutline, ArrowBack } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';

import { meta_constant, createlegions } from '../../config/meta.config';
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
	},
	warning: {
		display: 'flex',
		minHeight: '80px',
	}
});

const CreateLegions = () => {
	const {
		account,
	} = useWeb3React();

	const [warrior5beat, setWarrior5beat] = useState(true);
	const classes = useStyles();
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
							<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
								{createlegions.warning.title}
							</Typography>
							<Typography variant='h6'>
								{createlegions.warning.subtitle1}<br />
								{createlegions.warning.subtitle2}
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
			<Grid item xs={8}>
				<Card>
					<Grid container spacing={2} sx={{ p: 4 }}>
						<Grid item xs={12}>
							<Box sx={{ display: 'flex', justifyContent: 'space-around', pb: 2, borderBottom: '2px dashed grey' }}>
								<Input placeholder="Name your legion" />
								<Button color='error' variant='contained'>{createlegions.main.createBtnTitle}</Button>
							</Box>
						</Grid>
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
											<Button variant={warrior5beat ? "contained" : "text"} onClick={() => { setWarrior5beat(!warrior5beat) }}>Warriors</Button>
											<Button variant={!warrior5beat ? "contained" : "text"} onClick={() => { setWarrior5beat(!warrior5beat) }}>Beasts</Button>
										</ButtonGroup>
									</FormControl>
								</Grid>
								<Grid item>
									<FormControl component="fieldset">
										<ButtonGroup variant="outlined" color="primary" aria-label="outlined button group">
											<Button variant="contained">All</Button>
											<Button>1</Button>
											<Button>2</Button>
											<Button>3</Button>
											<Button>4</Button>
											<Button>5</Button>
										</ButtonGroup>
									</FormControl>
								</Grid>
							</Grid>
						</Grid>
					</Grid>

					<Grid container spacing={2} sx={{ p: 4 }}>
						{warrior5beat && <Grid item>
							Warrior
						</Grid>
						}
						{!warrior5beat && <Grid item>
							Beat
						</Grid>
						}
					</Grid>
				</Card>
			</Grid>

			{/* Right Panel */}
			<Grid item xs={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							Right Panel
						</Typography>
					</Box>
				</Card>
			</Grid>
		</Grid>
	</Box>
}

export default CreateLegions