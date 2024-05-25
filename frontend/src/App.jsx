import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/Slices/authSlice';

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth?.status);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            dispatch(getCurrentUser()).unwrap().then(() => {
                navigate('/home');
            }).catch(() => {
                navigate('/login');
            });
        } else {
            navigate('/login');
        }
    }, [dispatch, navigate]);

    return (
        <div>
            <Outlet />
        </div>
    );
}

export default App;
