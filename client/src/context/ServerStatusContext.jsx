import React, { createContext, useContext, useState, useEffect } from 'react';

const ServerStatusContext = createContext();

export const useServerStatus = () => {
    const context = useContext(ServerStatusContext);
    if (!context) {
        throw new Error('useServerStatus must be used within ServerStatusProvider');
    }
    return context;
};

export const ServerStatusProvider = ({ children }) => {
    const [isServerDown, setIsServerDown] = useState(false);

    const markServerDown = () => {
        setIsServerDown(true);
    };

    const markServerUp = () => {
        setIsServerDown(false);
    };

    const value = {
        isServerDown,
        markServerDown,
        markServerUp,
    };

    return (
        <ServerStatusContext.Provider value={value}>
            {children}
        </ServerStatusContext.Provider>
    );
};
