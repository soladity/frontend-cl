import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, Menu, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';
import { NavLink } from 'react-router-dom';
import { CardContent, Tooltip, Typography } from '@mui/material';
import { Card } from '@mui/material';

import { navConfig } from '../../config';
import { getTranslation } from '../../utils/translation';

const useStyles = makeStyles({
	root: {
		color: '#5f65f1'
	},
	green: {
		color: '#1ee99f'
	}
});

const NavList = (props: any) => {
	const classes = useStyles();

	const [anchorEl, setAnchorEl] = React.useState(null);
	const [language, setLanguage] = React.useState<string | null>('en');
	const open = Boolean(anchorEl);

	React.useEffect(() => {
		setLanguage(localStorage.getItem('lang') !== null ? localStorage.getItem('lang') : 'en');
	}, []);

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLanguage = (value: any) => {
		setAnchorEl(null);
		setLanguage(value);
		localStorage.setItem('lang', value);
	};

	return <div>
		<Toolbar />
		<Divider />
		<List sx={{
			pb: 8
		}}>
			<Card sx={{ m: 2, p: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<img
						src='/assets/images/welcome.svg'
						style={{ height: '25px', margin: '0 15px 0 0' }}
						alt={'welcome'}
						loading="lazy"
					/>
					<Typography variant="subtitle1" sx={{ fontWeight: 'bolder' }} className={classes.green}>
						{getTranslation('welcome')}
					</Typography>
				</Box>
			</Card>
			{navConfig.navBar.left.map((navItem, index) => (
				<React.Fragment key={'nav_item_' + index} >
					{navItem.type === "link" && <a target="_blank" className="nav-bar-item" href={navItem.path || ''}>
						<Tooltip title={navItem.title || ""} placement="right">
							<ListItemButton>
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary={getTranslation(navItem.title)} />
							</ListItemButton>
						</Tooltip>
					</a>
					}
					{navItem.type === "navlink" &&
						<NavLink to={navItem.path || ''} className={({ isActive }) => 'nav-bar-item ' + (isActive ? 'active' : '')}>
							<Tooltip title={navItem.title || ""} placement="right">
								<ListItemButton>
									<ListItemIcon>
										<InboxIcon />
									</ListItemIcon>
									<ListItemText primary={getTranslation(navItem.title)} />
								</ListItemButton>
							</Tooltip>
						</NavLink>
					}
					{navItem.type === "divider" && <Divider />}
					{navItem.type === "head" && <Card sx={{ m: 2, p: 2 }}>
						<Typography variant="subtitle1" sx={{ fontWeight: 'bolder' }} className={classes.root}>{getTranslation(navItem.title)}</Typography>
					</Card>}
				</React.Fragment>
			))}
			<Box sx={{ p: 1 }}>
				<Button
					id="language-button"
					aria-controls={open ? 'language-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={handleClick}
					sx={{color: 'white'}}
				>
					<img src={`/assets/images/${language}.svg`} style={{ width: '30px' }} />
					<ArrowDropDownIcon />
				</Button>
				<Menu
					id="language-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					MenuListProps={{
						'aria-labelledby': 'language-button',
					}}
				>
					<MenuItem onClick={() => handleLanguage('en')}>
						<img src='/assets/images/en.svg' style={{ width: '30px', marginRight: '10px' }} /> English
					</MenuItem>
					<MenuItem onClick={() => handleLanguage('es')}>
						<img src='/assets/images/es.svg' style={{ width: '30px', marginRight: '10px' }} /> Espanic
					</MenuItem>
				</Menu>
			</Box>
		</List>
	</div>
};

export default NavList;