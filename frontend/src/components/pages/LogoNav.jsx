import React from "react";
import { useDispatch } from "react-redux";
import { userLogout } from "../../store/Slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button";

function logoNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(userLogout());
    navigate("/login");
  };
  return (
    <section className="z-50 flex-between bg-transparent  w-screen text-white sticky bottom-0 bg-[#1010ac] py-4 md:hidden">
        <div className="flex flex-row justify-around">
            <p>vitweets</p>
            <Button
        bgColor="bg-red-800"
        className="sm:py-3 py-2 rounded-lg hover:bg-red-700 text-lg"
        onClick={handleLogout}
      >
        Logout
      </Button>
        </div>
      
    </section>
  );
}

export default logoNav;
