import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Avatar, 
  Typography, 
  CircularProgress, 
  Pagination, 
  Box,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const UsersList = () => {
  const { 
    users, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    searchQuery,
    deleteUser, 
    setCurrentPage 
  } = useContext(UserContext);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">Error: {error}</Alert>
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Users List
      </Typography>
      
      {filteredUsers.length === 0 ? (
        <Typography variant="body1">No users found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Avatar alt={`${user.first_name} ${user.last_name}`} src={user.avatar} />
                  </TableCell>
                  <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="right">
                    <Button
                      component={Link}
                      to={`/edit-user/${user.id}`}
                      size="small"
                      startIcon={<EditIcon />}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </div>
  );
};

export default UsersList;