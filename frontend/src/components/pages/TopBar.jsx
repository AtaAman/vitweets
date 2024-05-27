import React from 'react';
import { useDispatch } from "react-redux";
import { userLogout } from "../../store/Slices/authSlice";
import { useNavigate, NavLink } from "react-router-dom";
import { Button } from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUpload,
  faHeart,
  faRightFromBracket,
  faUser,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";

function TopBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(userLogout());
    navigate("/login");
  };

  return (
    <section className="sticky top-0 z-50 backdrop-blur-sm bg-black/20  bg-[#101012] border-b-2 border-gray-900 flex-between w-full text-white hidden md:block py-4">
      <div className="flex flex-row justify-around gap-10">
        <p className='text-2xl mt-2 font-bold text-red-600'>Vitweets</p>

        <div>
          <ul className="flex gap-10 text-2xl text-gray-500 flex-row justify-between">
            <li className="rounded-lg flex base-medium transition">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `block py-2 pr-4 pl-3 duration-200 ${
                    isActive ? "text-red-700" : "text-gray-600"
                  }`
                }
              >
                <FontAwesomeIcon icon={faHouse} />
              </NavLink>
            </li>
            <li className="rounded-lg flex base-medium transition">
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  `block py-2 pr-4 pl-3 duration-200 ${
                    isActive ? "text-red-700" : "text-gray-500"
                  }`
                }
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </NavLink>
            </li>
            <li className="rounded-lg relative flex base-medium transition">
              <NavLink
                to="/upload"
                className={({ isActive }) =>
                  `block py-2 pr-4 pl-3 duration-200 ${
                    isActive ? "text-red-700" : "text-gray-500"
                  }`
                }
              >
                <FontAwesomeIcon icon={faUpload} />
              </NavLink>
            </li>
            <li className="rounded-lg flex base-medium transition">
              <NavLink
                to="/notification"
                className={({ isActive }) =>
                  `block py-2 pr-4 pl-3 duration-200 ${
                    isActive ? "text-red-700" : "text-gray-500"
                  }`
                }
              >
                <FontAwesomeIcon icon={faHeart} />
              </NavLink>
            </li>
            <li className="rounded-lg flex base-medium transition">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `block py-2 pr-4 pl-3 duration-200 ${
                    isActive ? "text-red-700" : "text-gray-500"
                  }`
                }
              >
                <FontAwesomeIcon icon={faUser} />
              </NavLink>
            </li>
          </ul>
        </div>

        <Button
          className='flex flex-row bg-black p-3 rounded-full gap-2 hover:text-red-500'
          onClick={handleLogout}
        >
          <FontAwesomeIcon className="text-xl pt-1" icon={faRightFromBracket} />
          <p className='font-bold'>Logout</p>
        </Button>
      </div>
    </section>
  );
}

export default TopBar;
