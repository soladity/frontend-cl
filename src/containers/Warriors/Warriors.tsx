import React from 'react'
import { Box, Typography } from '@mui/material'
import FilterCards from '../../component/UI/FilterCards/FilterCards'
import { meta_constant } from '../../config/meta.config';
import Helmet from 'react-helmet';

const Warriors = () => {
    return
    <Box>
        <Helmet>
            <meta charSet="utf-8" />
            <title>{meta_constant.warriors.title}</title>
            <meta name="description" content={meta_constant.warriors.description} />
            {meta_constant.warriors.keywords && <meta name="keywords" content={meta_constant.warriors.keywords.join(',')} />}
        </Helmet>
        <Typography variant="h3">Warriors</Typography>
        <Typography variant="body1">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum nihil fugit numquam expedita et veritatis quae temporibus nobis hic ea. Quasi aliquid ad quia repudiandae. Molestiae facere omnis sint nesciunt.</Typography>
        <br />
        <FilterCards />
    </Box>
}

export default Warriors
