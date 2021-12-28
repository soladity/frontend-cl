import React from 'react'
import CardsComponent from '../../component/Cards/Cards'
import { Grid, Typography } from '@mui/material'
import { meta_constant } from '../../config/meta.config';
import Helmet from 'react-helmet';

const Profile = () => {
    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{meta_constant.profile.title}</title>
                <meta name="description" content={meta_constant.profile.description} />
                { meta_constant.profile.keywords && <meta name="keywords" content={meta_constant.profile.keywords.join(',')} /> }
            </Helmet>
            <Typography variant="h3">Profile</Typography>
            <Typography variant="body1">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum nihil fugit numquam expedita et veritatis quae temporibus nobis hic ea. Quasi aliquid ad quia repudiandae. Molestiae facere omnis sint nesciunt.</Typography>
          

        </div>
    )
}

export default Profile
