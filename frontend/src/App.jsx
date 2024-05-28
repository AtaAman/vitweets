import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/Slices/authSlice';
import TopBar from './components/pages/TopBar';
import BottomBar from './components/pages/BottomBar';
import LogoNav from './components/pages/LogoNav';

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            dispatch(getCurrentUser()).unwrap().then(() => {
                navigate('/');
            }).catch(() => {
                navigate('/login');
            });
        } else {
            navigate('/login');
        }
    }, [dispatch, navigate]);

    return (
        <div className="w-full">
            {!(token===null) && (
                <>
                    <TopBar />
                    <LogoNav />
                </>
            )}
            <section className="flex h-screen">
                <Outlet />
            </section>
            {!(token===null) && (
                <>
                    <BottomBar />
                </>
            )}
            
        </div>
    );
}

export default App;
