import * as React from 'react'
import { Grid } from '@mui/material'
import ToSocialBtn from '../../component/Buttons/ToSocialBtn';
import SwitchNFTtype from '../../component/Buttons/SwitchNFTtype';

const ToSocial = () => {
    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <ToSocialBtn
                type="Discord"
                linkUrl="Discord"
            />
            <ToSocialBtn
                type="Twitter"
                linkUrl="Discord"
            />
            <ToSocialBtn
                type="Telegram"
                linkUrl="Discord"
            />
            <ToSocialBtn
                type="Youtube"
                linkUrl="Discord"
            />
            <ToSocialBtn
                type="Medium"
                linkUrl="Discord"
            />
            <SwitchNFTtype />
        </Grid>
    )
}

export default ToSocial