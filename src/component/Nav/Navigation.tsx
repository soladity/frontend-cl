import React from 'react'
import PropTypes from 'prop-types';

import Drawer from '@mui/material/Drawer';

import { navConfig } from '../../config';
import NavList from './NavList';

const Navigation = (props: any) => {
    const { window } = props;

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <React.Fragment>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: navConfig.drawerWidth },
                }}
                open
            >
                <NavList />
            </Drawer>
        </React.Fragment>
    )
}

Navigation.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default Navigation
