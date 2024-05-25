import React from "react";
import { Logo }  from "../Logo.jsx";
import { Button } from "../Button.jsx";
import { Input } from "../Input.jsx";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createAccount, userLogin } from "../../store/Slices/authSlice.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginSkeleton from "../LoginSkeleton.jsx";

function SignUp() {
    const { handleSubmit, register, control, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.auth?.loading);

    const submit = async (data) => {
        try {
            // Simplified response log for debugging
            const response = await dispatch(createAccount(data));
            console.log("Create account response:", response);

            if (response?.payload?.success) {
                const username = data?.username;
                const password = data?.password;
                const loginResult = await dispatch(userLogin({ username, password }));
                console.log("Login result:", loginResult);

                if (loginResult?.type === "login/fulfilled") {
                    navigate("/login");
                } else {
                    alert("register successful verify your email!");
                    navigate("/verifyOtp");
                }
            }
            else{
                alert("username or email is already exist");
            }
        } catch (error) {
            console.error("Error during submission:", error); // Log any errors
        }
    };

    const handleClick = () => {
        console.log("Button clicked");
        handleSubmit(submit)();
    };
    

    if (loading) {
        return <LoginSkeleton />;
    }

    return (
        <>
            <div className="w-full h-screen text-white p-3 flex justify-center items-start sm:mt-8">
                <div className="flex flex-col space-y-2 justify-center items-center border border-slate-600 p-3">
                    <div className="flex items-center gap-2">
                        <Logo />
                    </div>
                    <form className="space-y-4 p-2 text-sm sm:w-96 w-full">
                        <Input
                            label="Username: "
                            type="text"
                            placeholder="Enter username"
                            {...register("username", { required: "username is required" })}
                            className="h-8"
                        />
                        {errors.username && (
                            <span className="text-red-500">
                                {errors.username.message}
                            </span>
                        )}
                        <Input
                            label="Email: "
                            type="email"
                            placeholder="Enter email"
                            {...register("email", { required: "email is required" })}
                            className="h-8"
                        />
                        {errors.email && (
                            <span className="text-red-500">
                                {errors.email.message}
                            </span>
                        )}
                        <Input
                            label="Fullname: "
                            type="text"
                            placeholder="Enter fullname"
                            {...register("fullName", { required: "fullName is required" })}
                            className="h-8"
                        />
                        {errors.fullName && (
                            <span className="text-red-500">
                                {errors.fullName.message}
                            </span>
                        )}
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter password"
                            {...register("password", { required: "password is required" })}
                            className="h-8"
                        />
                        {errors.password && (
                            <span className="text-red-500">
                                {errors.password.message}
                            </span>
                        )}
                        <Button
                            onClick={handleClick}
                            bgColor="bg-red-500"
                            className="w-full sm:py-3 py-2 hover:bg-red-700 text-lg"
                        >
                            Signup
                        </Button>
                        <p className="text-center text-sm">
                            Already have an account?{" "}
                            <Link to={"/login"} className="text-red-600 cursor-pointer hover:opacity-70">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignUp;