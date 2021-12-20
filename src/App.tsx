import * as React from 'react';
import { useRoutes } from 'react-router';
import Box from '@mui/material/Box';
import Navigation from './component/Nav/Navigation';
import { navConfig } from './config';
import AppBarComponent from './component/AppBar/AppBar';


function ResponsiveDrawer(props: any) {
  const routing = useRoutes(navConfig.routes());

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBarComponent />
      <Box
        component="nav"
        sx={{ width: { sm: navConfig.drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Navigation />
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${navConfig.drawerWidth}px)` } }}
      >
        <React.Suspense fallback={<h3>Loading</h3>}>
          {routing}
        </React.Suspense>
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
