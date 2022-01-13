import React from 'react'
import { Box, Typography } from '@mui/material'
import FilterCards from '../../component/UI/FilterCards/FilterCards'
import { meta_constant } from '../../config/meta.config';
import Helmet from 'react-helmet';

const Beasts = () => {
    return <Box>
        <Helmet>
            <meta charSet="utf-8" />
            <title>{meta_constant.beasts.title}</title>
            <meta name="description" content={meta_constant.beasts.description} />
            { meta_constant.beasts.keywords && <meta name="keywords" content={meta_constant.beasts.keywords.join(',')} /> }
        </Helmet>
        <Typography variant="h3">Beasts</Typography>
        <Typography variant="body1">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum nihil fugit numquam expedita et veritatis quae temporibus nobis hic ea. Quasi aliquid ad quia repudiandae. Molestiae facere omnis sint nesciunt.</Typography>
        <br />
        <FilterCards />
    </Box>
}

export default Beasts
