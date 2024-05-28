import React from "react";

function Container({ children }) {
    return <div className="md:max-w-[540px] lg:max-w-[720px] sm:px-2">{children}</div>;
}

export default Container;