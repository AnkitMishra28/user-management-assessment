import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { authAPI } from '../services/api';

/**
 * Auth Context
 * Manages authentication state globally
 */

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...initialState,
        isAuthenticated: false,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login
  const login = useCallback(async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.login(email, password);
      const { user, accessToken, refreshToken } = response.data;

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, accessToken, refreshToken },
      });

      return { success: true };
    } catch (error) {
      const status = error.response?.status;
      const apiMessage = error.response?.data?.message;
      const hasNoResponse = !error.response;

      const errorMessage =
        hasNoResponse
          ? 'Cannot reach the server right now. Please ensure backend is running on port 5000 and try again.'
          : status === 401
          ? 'The credentials you entered are no longer valid. If you recently changed your email or password, sign in with the updated details.'
          : apiMessage || 'Login failed';

      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  // Update user
  const updateUser = useCallback((userData) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...userData };

    localStorage.setItem('user', JSON.stringify(updatedUser));

    dispatch({ type: 'UPDATE_USER', payload: userData });
  }, []);

  // Verify stored tokens on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !state.isAuthenticated) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user,
          accessToken: token,
          refreshToken: localStorage.getItem('refreshToken'),
        },
      });
    }
  }, []);

  const value = {
    ...state,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
