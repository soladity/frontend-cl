import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import BadgeIcon from '@mui/icons-material/Badge';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { NavLink } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

import { getBloodstoneBalance } from '../../hooks/contractFunction';
import { useBloodstone, useWeb3 } from '../../hooks/useContract';
import { navConfig } from '../../config';
import { injected } from '../../wallet';

declare const window: any;

const pages = ['Products', 'Pricing', 'Blog'];

const AppBarComponent = () => {
  const {
    activate,
    account,
    deactivate,
    connector,
  } = useWeb3React();

  async function connect() {
    try {
      await activate(injected);
    } catch (e) {
      console.log(e)
    }
  }

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isActive, setIsActive] = React.useState(false);
  const [balance, setBalance] = React.useState('0');

  const bloodstoneContract = useBloodstone();
  const web3 = useWeb3();

  React.useEffect(() => {
    setIsActive(window.ethereum.selectedAddress);
    if (account) {
      getBalance();
    }
  }, []);

  const getBalance = async () => {
    setBalance(await getBloodstoneBalance(web3, bloodstoneContract, account));
  }

  const handleOpenNavMenu = (event: any) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: any) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const showProfile = () => {
    console.log(account);
  };

  const logout = () => {
    deactivate();
  };

  return (
    <AppBar position="fixed"
      sx={{
        background: 'linear-gradient(0deg, hsl(0deg 0% 12%) 0%, hsl(0deg 0% 7%) 100%)',
        maxWidth: `100%`,
        ml: { sm: `${navConfig.drawerWidth}px` },
        py: 1
      }}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <NavLink to='/' className='non-style' style={{ color: 'inherit', textDecoration: 'none' }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' }
              }}
            >
              CryptoLegions
            </Typography>
          </NavLink>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            {/* <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu> */}
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))} */}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button variant="contained" sx={{ fontWeight: 'bold', mr: 5 }}>
                  <IconButton aria-label="claim" component="span" sx={{ p: 0, mr: 1, color: 'black' }}>
                    <AssistantDirectionIcon />
                  </IconButton>
                  Claim 0 $Bloodstone
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img src='/assets/images/bloodstone.png' />
                  <Box sx={{ ml: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='h6'>{balance}</Typography>
                      <Typography variant='h6'>$BLS</Typography>
                    </Box>
                    <Button variant="contained" color='info' sx={{ fontWeight: 'bold', color: 'white' }}>
                      <IconButton aria-label="claim" component="span" sx={{ p: 0, mr: 1 }}>
                        <BadgeIcon />
                      </IconButton>
                      <NavLink to='/profile' className='non-style' style={{ color: 'inherit', textDecoration: 'none' }}>
                        <Typography variant='subtitle1'>
                          {account === undefined || account === null ? '...' : account.substr(0, 6) + '...' + account.substr(account.length - 4, 4)}</Typography>
                      </NavLink>
                    </Button>
                  </Box>
                </Box>
                {/* <React.Fragment>
                  <Tooltip title="Open settings" style={{ opacity: active ? '1' : '0' }}>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem component={NavLink} to={'/profile'}>
                      <Typography textAlign="center">Account</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => logout()}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </React.Fragment> */}
              </Box>
            }

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default AppBarComponent;
