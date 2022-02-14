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
                linkUrl="https://discord.gg/V4Z4JykfdH"
            />
            <ToSocialBtn
                type="Twitter"
                linkUrl="https://twitter.com/LegionsCrypto"
            />
            <ToSocialBtn
                type="Telegram"
                linkUrl="https://t.me/CryptoLegionsCommunity"
            />
            <ToSocialBtn
                type="Youtube"
                linkUrl="https://www.youtube.com/channel/UCc7HHfUUKV-DyB6xysp54EA"
            />
            <ToSocialBtn
                type="Medium"
                linkUrl="Http://cryptolegions.medium.com"
            />
            <SwitchNFTtype />
        </Grid>
    )
}

export default ToSocial