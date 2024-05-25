import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';
import Home from './components/pages/Home';
import Signup from './components/auth/Signup';
import VerifyOtp from './components/auth/verifyOtp';
import Login from './components/auth/login';
import PrivateRoute from './components/auth/PrivateRoutes';
import './index.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="register" element={<Signup />} />
      <Route path="verifyOtp" element={<VerifyOtp />} />
      <Route path="login" element={<Login />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
