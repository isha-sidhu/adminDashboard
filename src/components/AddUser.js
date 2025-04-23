import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserContext } from '../context/UserContext';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Box, 
  CircularProgress,
  Alert
} from '@mui/material';

const AddUser = () => {
  const { addUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      await addUser({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        avatar: 'https://reqres.in/img/faces/7-image.jpg' // Default avatar
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Add New User
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="First Name"
            {...register('firstName', { 
              required: 'First name is required',
              minLength: {
                value: 2,
                message: 'First name must be at least 2 characters'
              }
            })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Box>
        
        <Box mb={2}>
          <TextField
            fullWidth
            label="Last Name"
            {...register('lastName', { 
              required: 'Last name is required',
              minLength: {
                value: 2,
                message: 'Last name must be at least 2 characters'
              }
            })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Box>
        
        <Box mb={3}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Box>
        
        <Box display="flex" justifyContent="space-between">
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add User'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AddUser;