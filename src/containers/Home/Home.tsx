import React from 'react'
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CardsComponent from '../../component/Cards/Cards';
import { Grid } from '@mui/material';
import CardSm from '../../component/Cards/CardSm';
import { meta_constant } from '../../config/meta.config';
import Helmet from 'react-helmet';

const Home = () => {
    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{meta_constant.home.title}</title>
                <meta name="description" content={meta_constant.home.description} />
                { meta_constant.home.keywords && <meta name="keywords" content={meta_constant.home.keywords.join(',')} /> }
            </Helmet>
            <Typography variant="h3">CryptoLegions Home</Typography>
            <Typography variant="h5">Game of Crypto</Typography>
            <Typography variant="body1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
                imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
                Convallis convallis tellus id interdum velit laoreet id donec ultrices.
                Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
                nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
                leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
                feugiat vivamus at augue. At augue eget arcu dictum varius duis at
                consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                sapien faucibus et molestie ac.
            </Typography>
            <br />

            <Grid container spacing={2} sx={{mb: 4}}>
                <Grid item xs={3}>
                    <CardSm image={"https://uc73451e395a40e1bbf333aa1dce.previews.dropboxusercontent.com/p/thumb/ABbcaRgSyKClSK8DTWg77StVIlUtauzezyQumBVvchP60a-XaXMq9CU1J2DjuIcCt3DHAERYdXOA7SY_QRrj1BqVtQaUwnDYfFfCPyLbDYxVvS0dcRSgwQ8Uj9TIFYd2Cb_OUh61HGQpWLcgExNfZXXmotJvqRsFLxywkiUYtCVRoAZoPh8meIlIMVKijqssGdh_5JNN_iyNUipqpSVChO2G8836-C8yve1l1fQKbM0Z3MJ7ePAOJS-CzZYfa-GigEEaWDZFUmvLT4bi8vx-zBjhLsb3qhomXv0Tb6VAqqdvndowaEI6-W7L_r1RXv8Nlh2yK27Z1dmki18lO0LQ2QhPgGgEivaX8OjUFRj00P_1nWFtvK67oB8J2kmxZOQkg8U/p.gif"} />
                </Grid>
                <Grid item xs={3}>
                    <CardSm image={"https://ucb2b30381f664573476b8d8e685.previews.dropboxusercontent.com/p/thumb/ABYJSojYwEXlllWqDPOZvsFb4F2ENjt-1ecROewf1hYrWZ8G8RviWzVVEZD0P5sQTtBHeQ4yF9MzaKqxxD5iECkOOYVcig6hy3atskB4GoZdoQzpXtm7JsUYllJuqnv_pQe1p0P7PtnJGOgiWMRWrRj0sYCRVV0S-0htBep-x3P9DDFc32Pip8520vrmacEJiqk_Py7wJZbrJ6IJlwqwItr1epmsyW1fUcA83XHTeBVhxA7qzG8bTqRv6WZtwBZUlWE-IqNByg6f295Jus7SmQzboX8o91ljwwtyahjFmHj61DdJn1r6fGuN81dthdTJWMRLxKaZHPl9VoIwxFOCoIKduYyhWlG33B6fp7LFKqM27LNk98yH_IDpv89wkIo99k4/p.gif"} />
                </Grid>
                <Grid item xs={3}>
                    <CardSm image={"https://uc84480d507953c4b2bf27c4182e.previews.dropboxusercontent.com/p/thumb/ABbWehB6_2oyMu23daGpRMBnJPv6yQk7QKLEQJwq5w62RpBKy3wJTQJzFpvtcaGGFG-rr0YfJKAO_fmho3ne2eDH610thfynmcQOaH9cOF51I8TSumUD2umqAcsTBNwgSTW556m6M4cQBo1Ha4fObqrlsoeaNdLRDzCU6x--73OSNehddTugv2_MPG9SJy_lRtL3sHq1MOReaRTI86SWXedI0gl09AiL_LeDnJei8cq49FHBwc3qeG1GfWH3CKZFsvNeC5gRr1JsGiLLaBEWCHsDbiSDI48YWVxcBwD-IYWA27OtqOzdon5mJv-vTbls_vYchphdExHfTtCHcqRjgvUq73eR3Z9YmlvYV0g_YPsGKBxzakaO4g3lBf1jQsgeWaCKJ4c7lWDNZ0gMzKP7R5yM7KGSerkW2HfshaYz7Wp1hgGD9EfxOk840utFTun-hdU/p.gif"} />
                </Grid>
                <Grid item xs={3}>
                    <CardSm image={"https://uc451be996496db762bb7322ab38.previews.dropboxusercontent.com/p/thumb/ABZL5FFsGyRtlEoXhuk1f8Fr8Dy1Oc6q3bCdGcsr57hx6SiL_oM_WNIPltDzgmPuIfDGMyKLoYPEMQDSww9sRhxhodccli1KnUODSpx8hK-zM8cxoPWN-zx7RYhGVj3KReqQdbYiaTnTZGYzP0MIGyO7YsFBkbg1Spun-_0pF5xwGGaxjapXsfQCe7Y4EEdpCoRQIF6uztXRistOpwNmO7fin1M7nbHfB3Ji9jOruc3r8fQ7TgeMiljy6GfXxy6EUf-2xHZHUOPrYOZhpyIMiuIknowzHgoWq_yHo3jUZcwA4f-4hueXVgy3mOAKyGdVUh98tN3zKFoU6F63spHdeqkx2gr5LWRYnIOKujLPbQO38LqYSXl-YZuDjuOKQ7fTValMNXEPrwSa4xczK-vemGDfbOU8ar28FsldyX8yguNLj0Z5CCj7bo7z53ntG5Qfi7jS1wUDr7XpqazTYSmvJv5l1L2guk2L1OOY8Ru0sH3xbDNyUi78ghLyeQJ2-kUJVV8/p.gif"} />
                </Grid>
            </Grid>
        </div>
    )
}

export default Home
