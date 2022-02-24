// Section.jsx

import React from "react";

const ScrollToButton = React.forwardRef(
    ({ id, children }: { id: any; children: any }, ref: any) => (
        <section ref={ref} id={id}>
            {children}
        </section>
    )
);

export default ScrollToButton;
