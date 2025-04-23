import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Initial state
const initialState = {
  users: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  searchQuery: ''
};

// Create context
export const UserContext = createContext(initialState);

// Reducer function
const userReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_USERS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_USERS_SUCCESS':
      return {
        ...state,
        loading: false,
        users: action.payload.users,
        totalPages: action.payload.totalPages
      };
    case 'FETCH_USERS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload]
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        )
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      };
    default:
      return state;
  }
};

// Provider component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Fetch users when the page changes
  useEffect(() => {
    const fetchUsers = async () => {
      dispatch({ type: 'FETCH_USERS_REQUEST' }); //begin fetching users from the API 
      try {
        const response = await axios.get(`https://reqres.in/api/users?page=${state.currentPage}`);
        dispatch({ 
          type: 'FETCH_USERS_SUCCESS', 
          payload: {
            users: response.data.data,
            totalPages: response.data.total_pages
          }
        });//successfully received the data
      } catch (error) {
        dispatch({ type: 'FETCH_USERS_FAILURE', payload: error.message });
      }
    };//api request failed to fetch

    fetchUsers();
  }, [state.currentPage]);

  // Actions

  //1. New user is successfully created
  const addUser = async (userData) => {
    try {
      const response = await axios.post('https://reqres.in/api/users', userData);
      dispatch({
        type: 'ADD_USER',
        payload: { ...response.data, id: Date.now() } // Using timestamp as ID since reqres doesn't return real IDs for new items
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  //2. User Info updated successfully
  const updateUser = async (id, userData) => {
    try {
      const response = await axios.put(`https://reqres.in/api/users/${id}`, userData);
      dispatch({
        type: 'UPDATE_USER',
        payload: { ...userData, id: parseInt(id) }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  //3. User Deleted Successfully
  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      dispatch({
        type: 'DELETE_USER',
        payload: id
      });
    } catch (error) {
      throw error;
    }
  };


  //to set the current page number
  const setCurrentPage = (page) => {
    dispatch({
      type: 'SET_CURRENT_PAGE',
      payload: page
    });
  };

  //when searching for the user
  const setSearchQuery = (query) => {
    dispatch({
      type: 'SET_SEARCH_QUERY',
      payload: query
    });
  };

  return (
    <UserContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        error: state.error,
        currentPage: state.currentPage,
        totalPages: state.totalPages,
        searchQuery: state.searchQuery,
        addUser,
        updateUser,
        deleteUser,
        setCurrentPage,
        setSearchQuery
      }}
    >
      {children}
    </UserContext.Provider>
  );
};