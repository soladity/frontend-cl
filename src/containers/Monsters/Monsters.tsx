import React from 'react'
import { Box, Typography } from '@mui/material'
import FilterCards from '../../component/UI/FilterCards/FilterCards'
import Helmet from 'react-helmet';
import { meta_constant } from '../../config/meta.config';

const Monsters = () => {
    return (
        <Box>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{meta_constant.monster.title}</title>
                <meta name="description" content={meta_constant.monster.description} />
                { meta_constant.monster.keywords && <meta name="keywords" content={meta_constant.monster.keywords.join(',')} /> }
            </Helmet>
            <Typography variant="h3">Monsters</Typography>
            <Typography variant="body1">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum nihil fugit numquam expedita et veritatis quae temporibus nobis hic ea. Quasi aliquid ad quia repudiandae. Molestiae facere omnis sint nesciunt.</Typography>
            <br />
            <FilterCards />
        </Box>
    )
}

export default Monsters
