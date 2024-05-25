import React from "react";

function Button({
    children,
    type = "button",
    bgColor = "",
    textColor = "",
    className = "",
    ...props
}) {
    return (
        <button
            className={`${className} ${type} ${bgColor} ${textColor} hover:scale-105 duration-200 ease-in`}
            {...props}
        >
            {children}
        </button>
    );
}

export {Button};