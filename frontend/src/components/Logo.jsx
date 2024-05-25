import React from "react";
import { IoLogoInstagram, IoLogoTwitter } from "react-icons/io";
import { Link } from "react-router-dom";

function Logo({ size = "30" }) {
    return (
        <>
            <Link to={'/'} className="flex gap-2 items-center">
                <IoLogoTwitter
                    size={size}
                    color="red"
                />
                <span className="font-bold text-white">vitweets</span>
            </Link>
        </>
    );
}

export {Logo};