import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';

// Import reducers (to be created as needed)
// import userReducer from '../reducers/userReducer';
// import dataReducer from '../reducers/dataReducer';

// Initial state
const initialState = {
  app: {
    loading: false,
    error: null,
    success: null,
  },
  user: {
    isAuthenticated: false,
    userData: null,
  },
  data: {
    items: [],
    pagination: {
      page: 0,
      rowsPerPage: 10,
      total: 0,
    },
  },
};

// Basic app reducer
const appReducer = (state = initialState.app, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'SET_SUCCESS':
      return {
        ...state,
        success: action.payload,
        loading: false,
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        error: null,
        success: null,
      };
    default:
      return state;
  }
};

// Basic user reducer
const userReducer = (state = initialState.user, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        userData: action.payload,
        isAuthenticated: !!action.payload,
      };
    case 'LOGOUT_USER':
      return {
        ...state,
        userData: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

// Basic data reducer
const dataReducer = (state = initialState.data, action) => {
  switch (action.type) {
    case 'SET_DATA_ITEMS':
      return {
        ...state,
        items: action.payload,
      };
    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  app: appReducer,
  user: userReducer,
  data: dataReducer,
});

// Configure middleware
const middleware = [thunk];

// Add logger only in development
if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

// Create store
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;