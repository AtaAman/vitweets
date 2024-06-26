import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatDuration, timeAgo } from "../../helpers/timeAgo";
import { Link, useNavigate } from "react-router-dom";

import { getNotifications } from "../../store/Slices/authSlice";
 // Import the getInitial function

const Notification = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user); // Retrieve user from the Redux store
  const navigate = useNavigate();
  
  const getInitial = (username) => {
    if (!username) return "";
    return username.charAt(0).toUpperCase();
  };

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const truncateContent = (content, maxWords) => {
    const words = content.split(" ");
    if (words.length > 1) {
      return words.slice(0, 1).join(" ") + "...";
    }
    return content;
  };

  return (
    <div className="flex w-full justify-center">
      <div className="w-full md:w-[60%] text-white">
        {loading && <p>Loading notifications...</p>}
        {error && <p>Error: {error.message}</p>}
        {!loading && notifications.length === 0 && (
          <p className="p-5 text-gray-300 text-lg">No notifications found.</p>
        )}
        {!loading && notifications.length > 0 && (
          <ul className="p-5 flex flex-col justify-center">
            {notifications.map((notification) => (
              <li
                className="flex border-b border-gray-600 py-3 items-center gap-2"
                key={notification._id}
              >
                <div className="w-10 h-10 rounded-full">
                {notification.creator.avatar ? (
              <img src={notification.creator.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                {getInitial(notification.creator.username)} {/* Fixed: use user.username */}
              </div>
            )}
                </div>
                <div>
                  <p className="text-gray-300 text-sm">
                    {notification.title}{" "}
                    {notification.content && (
                      <>"{truncateContent(notification.content, 1)}" on </>
                    )}
                    {notification.type === "Like" || notification.type === "Comment" ? (
                      <Link
                        to={`/post/${notification.post}`}
                        className="text-blue-400 text-sm hover:text-blue-600"
                      >
                        Post
                      </Link>
                    ) : (
                      <Link
                        to={`/user/${notification.creator._id}`}
                        className="text-blue-400 text-sm hover:text-blue-600"
                      >
                        Profile
                      </Link>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-end">{timeAgo(notification.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notification;
