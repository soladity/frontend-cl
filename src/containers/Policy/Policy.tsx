import React from 'react'
import Helmet from 'react-helmet';
import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { policyConstant } from '../../constant';
import { meta_constant } from '../../config/meta.config';

const Policy = () => {
	return (
		<Box>
			<Helmet>
				<meta charSet="utf-8" />
				<title>{meta_constant.profile.title}</title>
				<meta name="description" content={meta_constant.profile.description} />
				{meta_constant.profile.keywords && <meta name="keywords" content={meta_constant.profile.keywords.join(',')} />}
			</Helmet>

			<Grid container spacing={2}>
				<Grid item xs={12} md={11} lg={10} sx={{margin: 'auto'}}>
					<Typography variant="h3" sx={{ marginBottom: 2 }}>Policy</Typography>
					<Paper sx={{ padding: [3, 4] }} elevation={3}>
						{
							policyConstant.content.map((content: any, index: number) => {
								let view = <Typography variant={content.type || 'body1'} sx={{fontWeight: content.type !== 'body1' ? 'bold' : '500'}} dangerouslySetInnerHTML={{ __html: content.text }}></Typography>
								if (content.type === 'divider') {
									view = <Divider sx={{ marginBottom: 2, marginTop: 2 }} />
								} else if (content.type === 'space') {
									view = <br />
								} else if (content.type === 'table') {
									view = <Box dangerouslySetInnerHTML={{ __html: content.text }}></Box>
								}
								return <Box key={'INDEX_CONTENT_POLICY_' + index}>{view}</Box>
							})
						}
					</Paper>
				</Grid>
			</Grid>
		</Box>
	)
}

export default Policy
