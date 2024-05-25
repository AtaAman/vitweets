import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth?.status);
    const token = localStorage.getItem('accessToken');

    if (isAuthenticated || token) {
        return children;
    } else {
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;
