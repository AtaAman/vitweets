import React from "react";

function LoginSkeleton() {
    const loadingSkeletonStyle =
        "animate-pulse bg-slate-500 h-10 w-full rounded mb-2";
    return (
        <>
            <div className="flex justify-center items-center  h-screen w-full">
                <div className="w-full h-screen flex items-center justify-center text-center text-white font-bold text-xl p-5 space-y-8">
                    <h1>please wait...</h1>
                </div>
            </div>
        </>
    );
}

export default LoginSkeleton;