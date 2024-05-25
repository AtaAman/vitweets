import React from 'react';
import { useDispatch } from 'react-redux';
import { userLogout } from '../../store/Slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(userLogout());
        navigate('/login');
    };

    return (
        <div>
            <h1 className='text-white text-center mt-5'>Welcome to the Home Page</h1>
            <button className='bg-white item-center' onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;
