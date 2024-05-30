import React, { useState } from "react";
import { formatDuration, timeAgo } from "../../helpers/timeAgo";
import PostActivity from "./PostActivity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan
} from "@fortawesome/free-solid-svg-icons";

function PostList({
  image,
  video,
  content,
  title,
  avatar,
  username,
  accountName,
  createdAt,
  postId,
}) {
  const getInitial = (username) => {
    if (!username) return "";
    return username.charAt(0).toUpperCase();
  };
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const renderContent = () => {
    const words = content.split(" ");
    if (words.length <= 50) {
      return content;
    }
    if (isExpanded) {
      return content;
    }
    const truncatedContent = words.slice(0, 50).join(" ");
    return `${truncatedContent}...`;
  };

  return (
    <div
     className="flex flex-col bg-[#16151518] p-5 items-start border-[#000000] border-t-[1px]">
      <div className="flex w-full justify-between flex-row gap-3 items-start">
        <div className="flex flex-row">
          <div className="w-[46px] h-[46px] rounded-full">
          {avatar ? (
            <img src={avatar} alt={username} className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
              {getInitial(username)}
            </div>
          )}
          </div>
          <div className="flex flex-col justify-center flex-1 pl-3 gap-y-1">
            <p className="text-sm text-gray-100 font-pregular">{accountName}</p>
            <p className="text-[10px]">{timeAgo(createdAt)}</p>
          </div>
        </div>
        <div className="hover:text-red-600 font-bold">
        <FontAwesomeIcon icon={faTrashCan} />
        </div>
      </div>
      <div className="px-3 pt-5 w-full">
        <p className="text-xl font-bold text-gray-500">{title}</p>
      </div>
      <div className="w-full h-auto">
        <p className="text-sm md:text-md p-2 lg:text-lg text-white">
          {renderContent()}
          {content.split(" ").length > 25 && (
            <span
              onClick={toggleContent}
              className="text-gray-400 font-semibold cursor-pointer"
            >
              {isExpanded ? " show less" : " more"}
            </span>
          )}
        </p>
      </div>
      {image && (
        <img
          src={image}
          className="w-full object-cover max-h-[280px] md:max-h-[350px] rounded-xl mt-3"
          alt=""
        />
      )}
      {video && (
        <video
          src={video}
          className="w-full object-cover max-h-[250px] rounded-xl mt-3"
          autoPlay
          controls
        />
      )}
      <PostActivity postId={postId}/>
    </div>
  );
}

export default PostList;
