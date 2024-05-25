import React, { useState } from "react";
import { Button } from "../Button.jsx";
import { Logo } from "../Logo.jsx";
import { Input } from "../Input.jsx";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { verifyOtp } from "../../store/Slices/authSlice.js";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function VerifyOtp() {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [error, setError] = useState(null);
    

    const submit = async (data) => {
        try {
            const response = await dispatch(verifyOtp(data));
            console.log(response); // log the response for debugging
            alert("email verified successfully! Please Login");
            navigate("/login")
        } catch (error) {
            setError(error.message); // set the error state if request fails
            toast.error(error?.response?.data?.error);
        }
    };

    return (
        <>
            <div className="w-full h-screen text-white p-3 flex justify-center items-start">
                <div className="flex max-w-5xl flex-col space-y-5 justify-center items-center border border-slate-600 p-3 mt-20">
                   <div className="flex items-center gap-2 mt-5">
                        <Logo />
                    </div>
                    <h1 className="text-red-500 text-xl">verify your email</h1>
                    <form onSubmit={handleSubmit(submit)} className="space-y-5 p-2">
                        {error && <span className="text-red-500">{error}</span>}
                        <Input
                            label="Email: "
                            type="email"
                            placeholder="Enter your email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address",
                                },
                            })}
                        />
                        {errors.email && (
                            <span className="text-red-500">{errors.email.message}</span>
                        )}

                        <Input
                            label="OTP: "
                            type="text"
                            placeholder="Enter OTP"
                            {...register("otp", {
                                required: "OTP is required",
                            })}
                        />
                        {errors.otp && (
                            <span className="text-red-500">{errors.otp.message}</span>
                        )}

                        <Button
                            type="submit"
                            bgColor="bg-red-500"
                            className="w-full sm:py-3 py-2 hover:bg-red-700 text-lg"
                        >
                            Verify OTP
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default VerifyOtp;
