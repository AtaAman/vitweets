import React, { useState } from "react";
import { Button } from "../Button.jsx";
import { Logo } from "../Logo.jsx";
import { Input } from "../Input.jsx";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { verifyOtp } from "../../store/Slices/authSlice.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function VerifyOtp() {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const submit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await dispatch(verifyOtp(data)).unwrap();
            console.log(response); // log the response for debugging
            alert("Email verified successfully! Please Login");
            navigate("/login");
        } catch (error) {
            setError(error.message); // set the error state if request fails
            toast.error(error?.response?.data?.error || "Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className="w-full h-screen text-white p-3 flex justify-center items-start">
                <div className="flex w-full h-screen flex-col space-y-5 justify-center items-center">
                    <p className="text-xl md:text-2xl font-bold">Verify your email</p>
                    <form onSubmit={handleSubmit(submit)} className="space-y-5 md:w-[40%] lg:w-[30%] w-[60%] flex flex-col items-center justify-center">
                        {error && <span className="text-red-500">{error}</span>}
                        <Input
                            className="h-12 rounded-lg"
                            label=""
                            type="email"
                            placeholder="Email"
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
                            className="h-12 rounded-lg"
                            label=""
                            type="text"
                            placeholder="OTP"
                            {...register("otp", {
                                required: "OTP is required",
                            })}
                        />
                        {errors.otp && (
                            <span className="text-red-500">{errors.otp.message}</span>
                        )}

                        <Button
                            type="submit"
                            bgColor="bg-red-800"
                            className="w-full rounded-lg sm:py-3 py-2 hover:bg-red-700 text-lg"
                            disabled={loading} // Disable button when loading
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default VerifyOtp;
