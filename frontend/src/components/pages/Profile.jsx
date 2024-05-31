import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUser,
  updateUserDetails,
} from "../../store/Slices/authSlice";
import { Button } from "../Button";

function Profile() {
  const dispatch = useDispatch();
  const {
    loading: userLoading,
    user,
    error,
  } = useSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
  });

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserDetails(formData));
    setEditMode(false);
  };

  const getInitial = (username) => {
    if (!username) return "";
    return username.charAt(0).toUpperCase();
  };

  return (
    <div className="text-white flex justify-center w-full">
      {userLoading ? (
        <p>Loading user details...</p>
      ) : (
        user && (
          <div className="flex w-full flex-col items-center">
            <p className="text-sm text-gray-400">Profile</p>
            <div className="w-[80%] rounded-2xl bg-black md:w-[50%] lg:w-[55%]">
              <div className="flex justify-between px-2 flex-row">
                <div className="p-5">
                  <p className="text-2xl md:text-3xl font-semibold">
                    {user.fullName}
                  </p>
                  <p className="text-sm text-gray-300">{user.username}</p>
                  <div className="mt-5">
                    <p className="text-[13px]">
                      {user.followers.length} Followers
                    </p>
                    <p className="text-[13px]">
                      {user.following.length} Following
                    </p>
                  </div>
                  <div>

                  </div>
                </div>
                <div className="h-20 w-20 rounded-full border-2 border-gray-900 m-5">
                      {user && user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-20 h-20 rounded-full"
                        />
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                          {user && user.username ? (
                            <p className="text-3xl text-gray-300">
                              {getInitial(user.username)}
                            </p>
                          ) : (
                            <></>
                          )}
                        </div>
                      )}
                    </div>
              </div>

              <div className="my-3 mx-5">
                <Button
                  bgColor=""
                  className="w-full rounded-lg border py-2 border-gray-700 text-[12px]"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
              {editMode && (
                <form onSubmit={handleSubmit} className="mx-5 my-3">
                  <div className="mb-4">
                    <label
                      className="block text-gray-300 text-sm mb-2"
                      htmlFor="fullName"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-black rounded"
                    />
                  </div>
                  <Button
                    bgColor=""
                    className="w-full rounded-lg border py-2 border-gray-700 text-[12px]"
                    type="submit"
                  >
                    Save Changes
                  </Button>
                </form>
              )}
            </div>
          </div>
        )
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Profile;
