import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import BadgeIcon from '@mui/icons-material/Badge';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Menu, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

import { getBloodstoneBalance, getUnclaimedUSD } from '../../hooks/contractFunction';
import { useBloodstone, useWeb3, useRewardPool } from '../../hooks/useContract';
import { navConfig } from '../../config';
import { injected } from '../../wallet';
import { getTranslation } from '../../utils/translation';
import { formatNumber } from '../../utils/common';
import { AnyAaaaRecord } from 'dns';
import NavList from '../Nav/NavList';
import { useSelector } from 'react-redux'
import CommonBtn from '../../component/Buttons/CommonBtn'

declare const window: any;

const pages = ['Products', 'Pricing', 'Blog'];

const AppBarComponent = () => {
  const {
    activate,
    account,
    deactivate,
    connector,
  } = useWeb3React();

  const { reloadContractStatus } = useSelector((state: any) => state.contractReducer)

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
  const [showAnimation, setShowAnimation] = React.useState<string | null>('0');
  const [showMenu, setShowMenu] = React.useState<boolean>(false);
  const [unClaimedUSD, setUnclaimedUSD] = React.useState(0)

  const bloodstoneContract = useBloodstone();
  const rewardPoolContract = useRewardPool();

  const web3 = useWeb3();

  React.useEffect(() => {
    setIsActive(window.ethereum.selectedAddress);
    if (account) {
      getBalance();
    }
    setShowAnimation(localStorage.getItem('showAnimation') ? localStorage.getItem('showAnimation') : '0');
  }, [reloadContractStatus]);

  const getBalance = async () => {
    setBalance(await getBloodstoneBalance(web3, bloodstoneContract, account));
    setUnclaimedUSD(await getUnclaimedUSD(web3, rewardPoolContract, account));
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

  const toggleDrawer = (open: boolean) => (event: any) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setShowMenu(open);
  };

  const handleShowAnimation = () => {
    if (showAnimation === '0') {
      setShowAnimation('1');
      localStorage.setItem('showAnimation', '1');
    } else {
      setShowAnimation('0');
      localStorage.setItem('showAnimation', '0');
    }
  }

  return (
    <AppBar position="fixed"
      sx={{
        background: 'linear-gradient(0deg, hsl(0deg 0% 12%) 0%, hsl(0deg 0% 7%) 100%)',
        maxWidth: `100%`,
        ml: { sm: `${navConfig.drawerWidth}px` },
        py: 1
      }}>
      <Container maxWidth={false}>
        <Toolbar disableGutters sx={{ flexFlow: 'wrap' }}>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <SwipeableDrawer
              anchor='left'
              open={showMenu}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onKeyDown={toggleDrawer(false)}
              >
                <NavList />
              </Box>
            </SwipeableDrawer>
          </Box>
          <NavLink to='/' className='non-style' style={{ color: 'inherit', textDecoration: 'none', minWidth: '250px' }}>
            <img src='/assets/images/logo.png' style={{ height: '55px' }} alt='logo' />
          </NavLink>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* <Button variant="contained" color='info' sx={{ fontWeight: 'bold', mr: 5, minWidth: '0px', padding: 1 }} onClick={handleShowAnimation}>
              <IconButton aria-label="claim" component="span" sx={{ p: 0, mr: 1, color: 'white', marginRight: 0 }}>
                {
                  showAnimation === '0' ? (
                    <PlayCircleIcon />
                  ) : (
                    <StopCircleIcon />
                  )
                }
              </IconButton>
            </Button> */}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'inherit' } }}>
                <CommonBtn sx={{ fontWeight: 'bold', mr: { xs: 0, md: 5 }, fontSize: { xs: '0.7rem', md: '1rem' } }}>
                  <IconButton aria-label="claim" component="span" sx={{ p: 0, mr: 1, color: 'black' }}>
                    <AssistantDirectionIcon />
                  </IconButton>
                  {getTranslation('claim')} {unClaimedUSD} ${getTranslation('bloodstone')}
                </CommonBtn>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 2, md: 0 } }}>
                  <img src='/assets/images/bloodstone.png' style={{ height: '55px' }} />
                  <Box sx={{ ml: { xs: 1, md: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='h6' sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>{formatNumber(balance)}</Typography>
                      <Typography variant='h6' sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>$BLST</Typography>
                    </Box>
                    <Button variant="contained" color='info' sx={{ fontWeight: 'bold', color: 'white' }}>
                      <IconButton aria-label="claim" component="span" sx={{ p: 0, mr: 1 }}>
                        <BadgeIcon />
                      </IconButton>
                      <NavLink to='/profile' className='non-style' style={{ color: 'inherit', textDecoration: 'none' }}>
                        <Typography variant='subtitle1' sx={{ fontSize: { xs: '0.7rem', md: '1rem' } }}>
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
