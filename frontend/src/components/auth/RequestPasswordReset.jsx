import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { requestPasswordReset } from '../../store/Slices/authSlice';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import { Button } from '../Button';
import { Input } from '../Input';

function RequestPasswordReset() {
    const { handleSubmit, register, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Access the navigate function for navigation

    const onSubmit = async (data) => {
        await dispatch(requestPasswordReset(data.email)).unwrap();
        navigate('/ResetPassword'); // Navigate to reset password route
    };

    return (
        <div className="w-full h-screen text-white p-3 flex justify-center items-start">
            <div className="flex w-full h-screen flex-col space-y-5 justify-center items-center">
                <p className="text-xl md:text-2xl font-bold">Reset Password</p>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5 md:space-y-7 md:w-[40%] lg:w-[30%] w-[60%] flex flex-col items-center justify-center"
                >
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
                    <Button
                        type="submit"
                        bgColor="bg-red-800"
                        className="w-full sm:py-3 py-2 rounded-lg hover:bg-red-700 text-lg"
                    >
                        Request OTP
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default RequestPasswordReset;
