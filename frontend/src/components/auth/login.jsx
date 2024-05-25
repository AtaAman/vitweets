import React from "react";
import { Button } from "../Button.jsx";
import {Logo} from "../Logo.jsx"
import {Input} from "../Input.jsx"
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, userLogin } from "../../store/Slices/authSlice.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginSkeleton from "../LoginSkeleton.jsx";
import { useEffect } from "react";

function Login() {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.auth?.loading);

// Login component
const submit = async (data) => {
    try {
        const isEmail = data.username.includes("@");
        const loginData = isEmail
            ? { email: data.username, password: data.password }
            : data;

        const response = await dispatch(userLogin(loginData));

        // Check if user is logged in successfully
        if (response?.payload) {
            // Store authentication token in local storage
            localStorage.setItem("accessToken", response.accessToken);
            navigate("/home");
        } else {
            // Handle login failure here, maybe show an error message
            console.error("Login failed:", response?.error);
        }
    } catch (error) {
        // Handle any errors that occurred during the login process
        console.error("Login failed:", error);
    }
};

// App component
useEffect(() => {
    // Check if there's a token in local storage
    const token = localStorage.getItem("accessToken");
    if (token) {
        // Set the authentication state accordingly
        // You may need to dispatch an action to set the user as authenticated in your Redux store
    }
}, []);


    if (loading) {
        return <LoginSkeleton />;
    }

    return (
        <>
            <div className="w-full h-screen text-white p-3 flex justify-center items-start">
                <div className="flex max-w-5xl flex-col space-y-5 justify-center items-center border border-slate-600 p-3 mt-20">
                    <div className="flex items-center gap-2 mt-5">
                        <Logo />
                    </div>

                    <form
                        onSubmit={handleSubmit(submit)}
                        className="space-y-5 p-2"
                    >
                        <Input
                            label="Username / email : "
                            type="text"
                            placeholder="example@gmail.com"
                            {...register("username", {
                                required: "username is required",
                            })}
                        />
                        {errors.username && (
                            <span className="text-red-500">
                                {errors.username.message}
                            </span>
                        )}
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="1kd074fjw0"
                            {...register("password", {
                                required: "password is required",
                            })}
                        />
                        {errors.password && (
                            <span>{errors.password.message}</span>
                        )}

                        <Button
                            type="submit"
                            bgColor="bg-red-500"
                            className="w-full sm:py-3 py-2 hover:bg-red-700 text-lg"
                        >
                            Login
                        </Button>

                        <p className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link
                                to={"/register"}
                                className="text-red-600 cursor-pointer hover:opacity-70"
                            >
                                SignUp
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;