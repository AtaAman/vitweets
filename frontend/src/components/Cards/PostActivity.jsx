import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faShare,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";


export default function PostActivity() {
  return (
    <div className="p-3 w-full flex gap-14 text-md md:text-lg">
    <FontAwesomeIcon  icon={faHeart} />
    <FontAwesomeIcon icon={faComment} />
    <FontAwesomeIcon icon={faShare} />
    <FontAwesomeIcon icon={faFloppyDisk} />
    </div>
  )
}