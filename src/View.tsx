import * as React from 'react';
import { useRoutes } from 'react-router';
import Box from '@mui/material/Box';
import Navigation from './component/Nav/Navigation';
import AppBarComponent from './component/AppBar/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { makeStyles } from '@mui/styles';

import { navConfig } from './config';

const useStyle = makeStyles({
    mainBox: {
        background: "url('./assets/images/nicah_background.jpg')",
        backgroundAttachment: 'fixed',
        backgroundSize: '100% 100%',
        height: '100%'
    }
})

const View = () => {
    const routing = useRoutes(navConfig.routes());

    const classes = useStyle()

    return (
        <Box sx={{ display: 'flex' }}>
            <Box
                component="header"
                sx={{
                    position: 'relative',
                    zIndex: 100
                }}
            >
                <AppBarComponent />
            </Box>
            <Box
                component="nav"
                sx={{
                    width: { sm: navConfig.drawerWidth },
                    flexShrink: { sm: 0 },
                    position: 'relative',
                    zIndex: 99
                }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Navigation />
            </Box>
            <Box
                component="main"
                className={classes.mainBox}
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${navConfig.drawerWidth}px)` } }}
            >
                <Toolbar />
                <React.Suspense fallback={<h3>Loading</h3>}>
                    {routing}
                </React.Suspense>
            </Box>
        </Box>
    )
}

export default View
