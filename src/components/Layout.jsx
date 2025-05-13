import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const DRAWER_WIDTH = 240;

const Layout = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: '#1a237e', 
          boxShadow: 1,
          zIndex: theme.zIndex.drawer + 1,
          width: '100%'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component={Link}
            to="/"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold', 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            GEEK<Typography component="sup" sx={{ fontSize: '0.6rem', ml: '2px' }}>UP</Typography>
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: open ? DRAWER_WIDTH : 72,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? DRAWER_WIDTH : 72,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            backgroundColor: '#fff',
            border: 'none',
            boxShadow: '0 0 10px rgba(0,0,0,0.05)'
          },
        }}
      >
        <Toolbar />

        {!isMobile && (
          <Box 
            display="flex" 
            justifyContent="flex-end" 
            alignItems="center" 
            p={1}
            onClick={handleDrawerToggle}
            sx={{ cursor: 'pointer' }}
          >
            {open && <ChevronLeftIcon color="action" />}
          </Box>
        )}

        <Divider />

        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/"
              selected={isActive('/')}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                borderLeft: isActive('/') ? '4px solid #1a237e' : '4px solid transparent',
                backgroundColor: isActive('/') ? 'rgba(26, 35, 126, 0.04)' : 'transparent',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: isActive('/') ? '#1a237e' : 'inherit',
                }}
              >
                <HomeIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Home" 
                sx={{ 
                  opacity: open ? 1 : 0,
                  '& .MuiTypography-root': {
                    fontWeight: isActive('/') ? 500 : 400,
                  }
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/albums"
              selected={isActive('/albums')}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                borderLeft: isActive('/albums') ? '4px solid #1a237e' : '4px solid transparent',
                backgroundColor: isActive('/albums') ? 'rgba(26, 35, 126, 0.04)' : 'transparent',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: isActive('/albums') ? '#1a237e' : 'inherit',
                }}
              >
                <PhotoAlbumIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Albums" 
                sx={{ 
                  opacity: open ? 1 : 0,
                  '& .MuiTypography-root': {
                    fontWeight: isActive('/albums') ? 500 : 400,
                  }
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/users"
              selected={isActive('/users')}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                borderLeft: isActive('/users') ? '4px solid #1a237e' : '4px solid transparent',
                backgroundColor: isActive('/users') ? 'rgba(26, 35, 126, 0.04)' : 'transparent',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: isActive('/users') ? '#1a237e' : 'inherit',
                }}
              >
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Users" 
                sx={{ 
                  opacity: open ? 1 : 0,
                  '& .MuiTypography-root': {
                    fontWeight: isActive('/users') ? 500 : 400,
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open ? DRAWER_WIDTH : 72}px)` },
          ml: { sm: `${open ? DRAWER_WIDTH : 72}px` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundColor: '#f6f8fc',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 2, pb: 4 }}>
          <Box sx={{ minHeight: 'calc(100vh - 160px)', backgroundColor: 'white', p: 3, borderRadius: 1 }}>
            <Outlet />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 