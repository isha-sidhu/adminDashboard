import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Box, 
  CircularProgress,
  Alert,
  Avatar
} from '@mui/material';

const EditUser = () => {
  const { id } = useParams();
  const { users, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  // First check if user exists in context
  useEffect(() => {
    const existingUser = users.find(u => u.id === parseInt(id));
    
    if (existingUser) {
      setUser(existingUser);
      setValue('firstName', existingUser.first_name);
      setValue('lastName', existingUser.last_name);
      setValue('email', existingUser.email);
      setFetchLoading(false);
    } else {
      // If not in context, fetch from API
      const fetchUser = async () => {
        try {
          const response = await axios.get(`https://reqres.in/api/users/${id}`);
          const userData = response.data.data;
          setUser(userData);
          setValue('firstName', userData.first_name);
          setValue('lastName', userData.last_name);
          setValue('email', userData.email);
        } catch (err) {
          setError('Failed to fetch user data');
        } finally {
          setFetchLoading(false);
        }
      };
      
      fetchUser();
    }
  }, [id, users, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      await updateUser(id, {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        avatar: user.avatar
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !user) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <Button variant="contained" onClick={() => navigate('/')}>
            Back to Users
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Edit User
      </Typography>
      
      {user && (
        <Box display="flex" justifyContent="center" mb={3}>
          <Avatar
            alt={`${user.first_name} ${user.last_name}`}
            src={user.avatar}
            sx={{ width: 100, height: 100 }}
          />
        </Box>
      )}
      
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
            {loading ? <CircularProgress size={24} /> : 'Update User'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default EditUser;