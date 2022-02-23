// ScrollToButton.jsx

import React from "react";

import { scrollTo } from "../../utils";

const ScrollToButton = ({
    toId,
    duration,
    children,
}: {
    toId: any;
    duration: any;
    children: any;
}) => {
    const handleClick = () => scrollTo({ id: toId, duration });

    return <span onClick={handleClick}>{children}</span>;
};

export default ScrollToButton;
