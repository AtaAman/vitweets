import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../store/Slices/authSlice.js";
import { Button } from "../Button.jsx";
import { Input } from "../Input.jsx";

function ResetPassword() {
    const { handleSubmit, register, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data) => {
        try {
            await dispatch(resetPassword(data));
            // Reset password successful, navigate to login page
            navigate("/login");
        } catch (error) {
            // Reset password failed, set error message
            setErrorMessage(error?.response?.data?.error || "Failed to reset password");
        }
    };

    return (
        <div className="w-full h-screen text-white p-3 flex justify-center items-start">
            <div className="flex w-full h-screen flex-col space-y-5 justify-center items-center">
                <p className="text-xl md:text-2xl font-bold">Reset Password</p>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5 md:space-y-7 md:w-[40%] lg:w-[30%] w-[60%] flex flex-col items-center justify-center"
                >
                    {errorMessage && (
                        <span className="text-red-500">{errorMessage}</span>
                    )}
                    <Input
                        className="h-12 rounded-lg"
                        label=""
                        type="email"
                        placeholder="Email"
                        {...register("email", {
                            required: "Email is required",
                        })}
                    />
                    {errors.email && (
                        <span className="text-red-500">
                            {errors.email.message}
                        </span>
                    )}
                    <Input
                        className="h-12 rounded-lg"
                        label=""
                        type="text"
                        placeholder="OTP"
                        {...register("otp", {
                            required: "OTP is required",
                        })}
                    />
                    {errors.otp && (
                        <span className="text-red-500">
                            {errors.otp.message}
                        </span>
                    )}
                    <Input
                        className="h-12 rounded-lg"
                        label=""
                        type="password"
                        placeholder="New Password"
                        {...register("newPassword", {
                            required: "New Password is required",
                        })}
                    />
                    {errors.newPassword && (
                        <span className="text-red-500">
                            {errors.newPassword.message}
                        </span>
                    )}
                    <Button
                        type="submit"
                        bgColor="bg-red-800"
                        className="w-full sm:py-3 py-2 rounded-lg hover:bg-red-700 text-lg"
                    >
                        Reset Password
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
