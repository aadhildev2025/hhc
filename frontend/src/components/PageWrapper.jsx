import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageWrapper = ({ children }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div key={pathname} className="animate-page-in min-h-screen">
            {children}
        </div>
    );
};

export default PageWrapper;
