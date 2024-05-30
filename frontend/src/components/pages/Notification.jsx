import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatDuration, timeAgo } from "../../helpers/timeAgo";
import { Link, useNavigate } from "react-router-dom";

import { getNotifications } from "../../store/Slices/authSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
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
              <div className="h-10 w-10 rounded-full">
                <img
                  src={notification.creator.avatar || " "}
                  alt=""
                  className="h-10 w-10 cursor-pointer rounded-full"
                  // Navigate to user profile page when clicking on the avatar
                  onClick={() => {
                    navigate(`/user/${notification.creator._id}`);
                  }}
                />
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
