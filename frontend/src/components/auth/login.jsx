import React, { useState } from "react";
import { Button } from "../Button.jsx";
import { Logo } from "../Logo.jsx";
import { Input } from "../Input.jsx";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../store/Slices/authSlice.js";
import { Link } from "react-router-dom";
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
    const [loginError, setLoginError] = useState(null);

    const submit = async (data) => {
        try {
            const isEmail = data.username.includes("@");
            const loginData = isEmail
                ? { email: data.username, password: data.password }
                : data;

            const response = await dispatch(userLogin(loginData));

            // Check if user is logged in successfully
            if (response?.payload && !response.error) {
                // Store authentication token in local storage
                localStorage.setItem("accessToken", response.payload.accessToken);
                navigate("/home");
            } else {
                // Handle login failure here, maybe show an error message
                setLoginError("Invalid username or password");
                console.error("Login failed:", response?.error);
            }
        } catch (error) {
            // Handle any errors that occurred during the login process
            setLoginError("An unexpected error occurred. Please try again.");
            console.error("Login failed:", error);
        }
    };

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
        <div className="w-full h-screen text-white p-3 flex justify-center items-start">
            <div className="flex w-full h-screen flex-col space-y-5 justify-center items-center">
            <p className="text-xl md:text-2xl font-bold">Register in <span className="text-red-500">Vitweets</span></p>
                <form
                    onSubmit={handleSubmit(submit)}
                    className="space-y-4 md:w-[40%] lg:w-[30%] w-[60%] flex flex-col items-center justify-center"
                >
                    <Input
                        className="h-12 rounded-lg"
                        label=""
                        type="text"
                        placeholder="Username or email"
                        {...register("username", {
                            required: "Username is required",
                        })}
                    />
                    {errors.username && (
                        <span className="text-red-500">
                            {errors.username.message}
                        </span>
                    )}
                    <Input
                        className="h-12 rounded-lg"
                        label=""
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                            required: "Password is required",
                        })}
                    />
                    {errors.password && (
                        <span className="text-red-500">
                            {errors.password.message}
                        </span>
                    )}
                    {loginError && (
                        <span className="text-red-500">
                            {loginError}
                        </span>
                    )}
                    <Button
                        type="submit"
                        bgColor="bg-red-800"
                            className="w-full sm:py-3 py-2 rounded-lg hover:bg-red-700 text-lg"
                    >
                        Login
                    </Button>
                    <Link to="/requestPasswordReset" className="hover:text-red-400 text-md">
                            Forgot password?
                        </Link>
                    <p className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link
                            to={"/register"}
                            className="text-red-600 text-[17px] font-bold cursor-pointer hover:opacity-70"
                        >
                            SignUp
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
