import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';

import { navConfig } from '../../config';
import { NavLink } from 'react-router-dom';
import { CardContent, Tooltip, Typography } from '@mui/material';
import { Card } from '@mui/material';

const NavList = (props: any) => (
    <div>
        <Toolbar />
        <Divider />
        <List sx={{
            // backgroundImage: 'url(https://dummyimage.com/300x1000/1c0f8c/0011ff)',
            // backgroundAttachment: 'fixed'
            // backgroundColor: '#555'
        }}>
            {navConfig.navBar.left.map((navItem, index) => (
                <React.Fragment key={'nav_item_' + index} >
                    { navItem.type === "link" &&  <a target="_blank" className="nav-bar-item" href={navItem.path || ''}>
                            <Tooltip title={navItem.title||""} placement="right">
                                <ListItemButton>
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={navItem.title} />
                                </ListItemButton>
                            </Tooltip>
                        </a> 
                    }
                    { navItem.type === "navlink" && 
                        <NavLink to={navItem.path || ''} className={({ isActive }) => 'nav-bar-item ' + (isActive ? 'active' : '')}>
                            <Tooltip title={navItem.title||""} placement="right">
                                <ListItemButton>
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={navItem.title} />
                                </ListItemButton>
                            </Tooltip>
                        </NavLink> 
                    }
                    { navItem.type === "divider" && <Divider /> }
                    { navItem.type === "head" && <Card sx={{m: 2, p: 2}}>
                        <Typography variant="subtitle1" sx={{fontWeight: 'bolder'}}>{navItem.title}</Typography>
                        <Typography variant="subtitle2">{navItem.subTitle}</Typography>
                    </Card> }
                </React.Fragment>
            ))}
        </List>
    </div>
);

export default NavList;