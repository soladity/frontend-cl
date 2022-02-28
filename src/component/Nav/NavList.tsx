import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, Menu, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';
import { NavLink } from 'react-router-dom';
import { Tooltip, Typography } from '@mui/material';
import { Card } from '@mui/material';

import { navConfig } from '../../config';
import { getTranslation } from '../../utils/translation';
import { useDispatch } from "react-redux";
import { setReloadStatus } from "../../actions/contractActions";

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
	const dispatch = useDispatch();

	const [anchorEl, setAnchorEl] = React.useState(null);
	const [language, setLanguage] = React.useState<string | null>('en');
	const open = Boolean(anchorEl);

	const languages = [
		{
			title: 'en',
			name: 'English'
		},
		{
			title: 'es',
			name: 'Spanish'
		},
		{
			title: 'cn',
			name: 'Chinese'
		},
		{
			title: 'pt',
			name: 'Portuguese'
		},
		{
			title: 'tr',
			name: 'Turkish'
		},
		{
			title: 'ru',
			name: 'Russian'
		},
		{
			title: 'fr',
			name: 'French'
		},
		{
			title: 'de',
			name: 'Dutch'
		},
		{
			title: 'pl',
			name: 'Polish'
		},
		{
			title: 'ph',
			name: 'Filipino'
		}
	];

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
		dispatch(
			setReloadStatus({
				reloadContractStatus: new Date(),
			})
		);
	};

	return <div>
		<Toolbar />
		<Divider />
		<List sx={{
			pb: 8
		}}>
			{navConfig.navBar.left.map((navItem, index) => (
				<React.Fragment key={'nav_item_' + index} >
					{
						navItem.type === "link" &&
						<a target="_blank" className="nav-bar-item" href={navItem.path || ''}>
							<Tooltip title={navItem.title || ""} placement="right">
								<ListItemButton>
									<img src={`/assets/images/${navItem.icon}`} style={{ width: '22px', height: '22px', marginRight: '34px' }} alt='icon' />
									<ListItemText primary={getTranslation(navItem.title)} />
								</ListItemButton>
							</Tooltip>
						</a>
					}
					{navItem.type === "navlink" &&
						<NavLink to={navItem.path || ''} className={({ isActive }) => 'nav-bar-item ' + (isActive ? 'active' : '')}>
							<Tooltip title={navItem.title || ""} placement="right">
								<ListItemButton>
									<img src={`/assets/images/${navItem.icon}`} style={{ width: '22px', height: '22px', marginRight: '34px' }} alt='icon' />
									<ListItemText primary={getTranslation(navItem.title)} />
								</ListItemButton>
							</Tooltip>
						</NavLink>
					}
					{navItem.type === "divider" && <Divider />}
					{navItem.type === "head" &&
						<Typography variant="h6" sx={{ fontWeight: 'bolder', color: '#a44916', textTransform: 'uppercase', textAlign: 'center', paddingTop: '15px', paddingBottom: '10px' }} className={classes.root}>{getTranslation(navItem.title)}</Typography>
					}
				</React.Fragment>
			))}
			<Box sx={{ display: 'flex', px: 2, pt: 2 }}>
				{navConfig.navBar.left.map((navItem, index) => (
					navItem.type === "social" &&
					<a target='_blank' href={navItem.path || ''} key={index}>
						<img src={navItem.icon} style={{ height: '32px', marginRight: '7px' }} alt='social icon' />
					</a>
				))}
			</Box>
			<Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between' }}>
				<Button
					id="language-button"
					aria-controls={open ? 'language-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={handleClick}
					sx={{ color: 'white' }}
				>
					<img src={`/assets/images/flags/${language}.svg`} style={{ width: '30px' }} />
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
					{
						languages.map((item, index) => (
							<MenuItem key={index} onClick={() => handleLanguage(item.title)}>
								<img src={`/assets/images/flags/${item.title}.svg`} style={{ width: '30px', marginRight: '10px' }} /> {item.name}
							</MenuItem>
						))
					}
				</Menu>
				{navConfig.navBar.left.map((navItem, index) => (
					navItem.type === "privacy" &&
					<NavLink key={index} to={navItem.path || ''} style={{ color: 'gray' }} className={({ isActive }) => 'nav-bar-item ' + (isActive ? 'active' : '')}>
						<Tooltip title={navItem.title || ""} placement="right">
							<ListItemButton>
								<ListItemText primary={getTranslation(navItem.title)} sx={{ fontSize: '0.7rem' }} />
							</ListItemButton>
						</Tooltip>
					</NavLink>
				))}
			</Box>
			{navConfig.navBar.left.map((navItem, index) => (
				navItem.type === "footer" &&
				<a href='https://cryptogames.agency' target='_blank' className='hover-style gray' key={index}>
					<Card key={index} sx={{ m: 2, p: 2, color: 'inherit' }}>
						<Typography variant="subtitle2" color='inherit' sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
							{getTranslation(navItem.title1)}
							<img src='/assets/images/heart.png' alt='favorite' style={{ width: '14px', height: '14px', margin: '0 10px' }} />
							{getTranslation(navItem.title2)}
						</Typography>
					</Card>
				</a>
			))}
		</List>
	</div>
};

export default NavList;