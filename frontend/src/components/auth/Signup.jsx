import React, { useState } from "react";
import { Button } from "../Button.jsx";
import { Input } from "../Input.jsx";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createAccount} from "../../store/Slices/authSlice.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginSkeleton from "../LoginSkeleton.jsx";

function SignUp() {
    const { handleSubmit, register, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const loading = useSelector((state) => state.auth?.loading);

    const submit = async (data) => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await dispatch(createAccount(data));
            if (response?.payload?.success) {
                alert("Register successful! Please verify your email.");
                navigate("/verifyOtp");
            } else {
                alert("Username or email is already taken.");
            }
        } catch (error) {
            console.error("Error during submission:", error);
        }
        setIsLoading(false);
    };

    const handleClick = () => {
        handleSubmit(submit)();
    };

    if (loading || isLoading) {
        return <LoginSkeleton />;
    }

    return (
        <div className="w-full h-screen text-white p-3 flex justify-center items-start">
            <div className="flex w-full h-screen flex-col space-y-5 justify-center items-center">
                <p className="text-xl md:text-2xl font-bold">Register in <span className="text-red-500">Vitweets</span></p>
                <form className="space-y-4 md:w-[40%] lg:w-[30%] w-[60%] flex flex-col items-center justify-center">
                    <Input
                        className="h-12 rounded-lg"
                        label=""
                        type="text"
                        placeholder="Username"
                        {...register("username", { required: "Username is required" })}
                    />
                    {errors.username && (
                        <span className="text-red-500">
                            {errors.username.message}
                        </span>
                    )}
                    <Input
                        label=""
                        type="email"
                        placeholder="Email"
                        {...register("email", { required: "Email is required" })}
                        className="h-12 rounded-lg"
                    />
                    {errors.email && (
                        <span className="text-red-500">
                            {errors.email.message}
                        </span>
                    )}
                    <Input
                        label=""
                        type="text"
                        placeholder="Fullname"
                        {...register("fullName", { required: "Fullname is required" })}
                        className="h-12 rounded-lg"
                    />
                    {errors.fullName && (
                        <span className="text-red-500">
                            {errors.fullName.message}
                        </span>
                    )}
                    <Input
                        label=""
                        type="password"
                        placeholder="Password"
                        {...register("password", { required: "Password is required" })}
                        className="h-12 rounded-lg"
                    />
                    {errors.password && (
                        <span className="text-red-500">
                            {errors.password.message}
                        </span>
                    )}
                    <Button
                        onClick={handleClick}
                        bgColor="bg-red-800"
                        className="w-full sm:py-3 py-2 rounded-lg hover:bg-red-700 text-lg"
                    >
                        Signup
                    </Button>
                    <p className="text-center text-sm">
                        Already have an account?{" "}
                        <Link to={"/login"} className="text-red-600 text-[17px] font-bold cursor-pointer hover:opacity-70">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
