import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faShare,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

export default function PostActivity({postId}) {
  const navigate = useNavigate();
  return (

    <div className="p-3 text-gray-400 w-full flex gap-14 text-md md:text-lg">
    <FontAwesomeIcon  icon={faHeart} />
    <FontAwesomeIcon
    onClick={() => {
      navigate(`/post/${postId}`);
    }} 
    icon={faComment} />
    <FontAwesomeIcon icon={faShare} />
    <FontAwesomeIcon icon={faFloppyDisk} />
    </div>
  )
}