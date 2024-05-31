import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsersBySearch } from '../../store/Slices/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Explore() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const { users = [], loading } = useSelector((state) => state.auth);

  const getInitial = (username) => {
    if (!username) return "";
    return username.charAt(0).toUpperCase();
  };

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value); // Update search term as user types
    if (e.target.value.trim() !== '') {
      dispatch(getAllUsersBySearch(e.target.value)); // Dispatch search action
    }
  };

  return (
    <div className='flex flex-col items-center h-screen flex-1 py-10 px-5 md:p-14'>
      <h1 className="text-gray-500 text-center mb-5">Explore and make new Friends</h1>
      <form className="w-full max-w-md mb-5">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch} // Call handleSearch on input change
            className="w-full p-2 pr-10 text-white rounded border bg-gray-950 border-gray-800"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-3 text-gray-500" />
        </div>
      </form>
      <div className="w-full max-w-md">
        {users.map((user) => (
          <div key={user._id} className="flex w-full items-center mb-4 p-4 bg-gray-800 rounded">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full" />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                {getInitial(user.username)} {/* Fixed: use user.username */}
              </div>
            )}
            <div className='flex justify-between items-center w-[80%] px-2'>
              <div>
              <p className="text-white">{user.username}</p>
              <p className="text-gray-300">{user.fullName}</p>
              </div>
              <div>
                <p className='text-[#36a3ce]'>Followers: {user.followers.length}</p>
                <p className='text-[#36a3ce]'>Following: {user.following.length}</p>
              </div>
            </div>
          </div>
        ))}
        {/* Show loading or no users found message */}
        {loading && <p className="text-gray-500 text-center">Searching...</p>}
        {!loading && users.length === 0 && <p className="text-gray-500 text-center">No users found</p>}
      </div>
    </div>
  );
}

export default Explore;
