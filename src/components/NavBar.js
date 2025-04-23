import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { AppBar, Toolbar, Typography, Button, TextField, InputAdornment, IconButton, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { ThemeContext } from '../context/ThemeContext';
import  Brightness7Icon from '@mui/icons-material/Brightness7';
import  Brightness4Icon from '@mui/icons-material/Brightness4';

const Navbar = () => {
  const { setSearchQuery } = useContext(UserContext);
  const { mode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  console.log('Current theme mode:', mode)// for debugging log

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ color: 'white', textDecoration: 'none', flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        
        <TextField
          size="small"
          placeholder="Search users..."
          onChange={handleSearchChange}
          sx={{ 
            marginRight: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 1,
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
          }}
        />
        
        <Button 
          variant="contained" 
          color="secondary" 
          component={Link} 
          to="/add-user"
          startIcon={<AddIcon />}
        >
          Add User
        </Button>

        <IconButton
        //icon button for toggle
        onClick={toggleTheme}
        color="inherit"
        aria-label="toggle dark/light mode">
          {mode==='dark' ? <Brightness7Icon />: <Brightness4Icon />}
        </IconButton>
        
        
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;