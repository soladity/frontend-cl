
import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, ButtonGroup, Button, IconButton, FormLabel, FormControl } from '@mui/material';
import Helmet from 'react-helmet';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';
import { NavLink } from 'react-router-dom';

import { meta_constant } from '../../config/meta.config';
import { getTranslation } from '../../utils/translation';

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

	const classes = useStyles();

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
							<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
								{getTranslation('currentBeasts')}
							</Typography>
							<Typography variant='h4' color='secondary' sx={{ fontWeight: 'bold' }}>
								11
							</Typography>
							<Button variant="contained" sx={{ fontWeight: 'bold' }}>
								<NavLink to='/createlegions' className='non-style'>
									{getTranslation('createLegion')}
								</NavLink>
							</Button>
						</Box>
					</Card>
				</Grid>
				<Grid item xs={12} md={4}>
					<Card>
						<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
							<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
								{getTranslation('warriorCapacity')}
							</Typography>
							<Typography variant='h4' color='primary' sx={{ fontWeight: 'bold' }}>
								11
							</Typography>
						</Box>
					</Card>
				</Grid>
			</Grid>
		</Box>
	)
}

export default Legions
