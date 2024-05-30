import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser } from '../../store/Slices/authSlice'; // Adjust the path as per your project structure

function Profile({ userId }) {
  const dispatch = useDispatch();
  const userDetails = useSelector(state => state.auth);
  console.log(userDetails);
  useEffect(() => {
    // Dispatch getUserById action when component mounts
    dispatch(getCurrentUser(userId));
  }, [dispatch, userId]);

  return (
    <div className='text-white text-center'>
      {userDetails ? (
        <div>
          <h2>User Details</h2>
          <p>Username: {userDetails.userData.username}</p>
          <p>Email: {userDetails.userData.email}</p>
          {/* Render other user details here */}
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
}

export default Profile;
