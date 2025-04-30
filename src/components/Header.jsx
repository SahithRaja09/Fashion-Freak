import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, TextField } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import fashionLogo from './fashion.avif'; 
import { useNavigate } from 'react-router-dom';

import Badge from '@mui/material/Badge';

export default function Header({
  showSearch = false,
  searchTerm = '',
  setSearchTerm = () => {},
  onMenuClick = () => {},
  cartCount = 0, 
}) {
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#fff' }} elevation={1}>
      <Toolbar disableGutters>
        <Box sx={{ display: {xs:'flex',sx:'flex'}, alignItems: 'center', gap:0, width: '100%', px: 2, justifyContent:{xs:'center'}}}>
          <img src={fashionLogo} alt="Logo" style={{ width: 100 }} />
          <Typography variant="h6" sx={{ color: '#191b43', flexGrow: 1 }}>
            Fashion Clothing
          </Typography>

          {showSearch && (
            <TextField
              placeholder="Search..."
              size="small"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              sx={{ bgcolor: '#f5f5f5', borderRadius: 1, minWidth: 200,fontSize:{sm:'10'} }}
            />
          )}

          <IconButton onClick={() => navigate('/cart')} sx={{ color: '#191b43' }}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon sx={{ fontSize:{sx:'30',xs:'10'}}} />
            </Badge>
          </IconButton>

          {/* <IconButton onClick={onMenuClick}>
            <MenuIcon />
          </IconButton> */}

          <IconButton edge="end">
            <PeopleAltIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
