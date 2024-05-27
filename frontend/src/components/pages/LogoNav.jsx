import React from "react";
import { useDispatch } from "react-redux";
import { userLogout } from "../../store/Slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";


function logoNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(userLogout());
    navigate("/login");
  };
  return (
    <section className="sticky top-0 z-50 flex-between backdrop-blur-sm bg-black/20 bg-[#101012] border-b-2 border-gray-900 w-full text-white py-4 md:hidden">
        <div className="flex flex-row px-10 justify-between">
        <p className='text-2xl font-semibold text-red-600'>Vitweets</p>
            <Button
        className='flex flex-row gap-2 hover:text-red-500'
        onClick={handleLogout}
      >
         <FontAwesomeIcon className="text-xl pt-1" icon={faRightFromBracket} />
         <p className='font-bold'>Logout</p>
      </Button>
        </div>
      
    </section>
  );
}

export default logoNav;
