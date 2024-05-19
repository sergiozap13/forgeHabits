import React, { useEffect, useRef } from 'react';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import './styles.css'

const Tooltip = ({ children, content, placement = 'top', theme='orange-theme' }) => {
    const ref = useRef();

    useEffect(() => {
        if (ref.current) {
            tippy(ref.current, {
                content,
                placement,
                theme,
            });
        }
    }, [content, placement, theme]);

    return <span ref={ref}>{children}</span>;
};

export default Tooltip;
