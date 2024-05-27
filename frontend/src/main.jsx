// main file (e.g., index.js or App.js)
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
import Explore from './components/pages/Explore';
import Upload from './components/pages/Upload';
import Notification from './components/pages/Notification';
import Profile from './components/pages/Profile';
import Signup from './components/auth/Signup';
import VerifyOtp from './components/auth/verifyOtp';
import Login from './components/auth/login';
import PrivateRoute from './components/auth/PrivateRoutes';
import RequestPasswordReset from './components/auth/RequestPasswordReset';
import ResetPassword from './components/auth/ResetPassword';
import './index.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="register" element={<Signup />} />
      <Route path="verifyOtp" element={<VerifyOtp />} />
      <Route path="login" element={<Login />} />
      <Route path="requestPasswordReset" element={<RequestPasswordReset />} />
      <Route path="resetPassword" element={<ResetPassword />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/explore"
        element={
          <PrivateRoute>
            <Explore />
          </PrivateRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <Upload />
          </PrivateRoute>
        }
      />
      <Route
        path="/notification"
        element={
          <PrivateRoute>
            <Notification />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
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
