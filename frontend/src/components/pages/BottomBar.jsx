import React from 'react'
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUpload,
  faHeart,
  faUser,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";


function BottomBar() {
  return (
    <section className="z-50 flex-between backdrop-blur-sm bg-black/20 bg-[#101012] border-t-2 border-gray-900 w-screen text-white sticky bottom-0 py-4 md:hidden">
                <ul className="flex text-xl flex-row justify-around">
            <li className="rounded-lg flex base-medium transition">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `block py-2 pr-4 pl-3 duration-200 ${
                    isActive ? "text-gray-600" : "text-white"
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
                    isActive ? "text-gray-600" : "text-white"
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
                    isActive ? "text-gray-600" : "text-white"
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
                    isActive ? "text-gray-600" : "text-white"
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
                    isActive ? "text-gray-600" : "text-white"
                  }`
                }
              >
               <FontAwesomeIcon icon={faUser} />
              </NavLink>
            </li>
          </ul>
    </section>
  )
}

export default BottomBar