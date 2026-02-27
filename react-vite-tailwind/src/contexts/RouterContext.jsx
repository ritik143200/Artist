import React, { createContext, useContext, useState } from 'react';

const RouterContext = createContext();

export const RouterProvider = ({ children }) => {
  const getInitialPath = () => {
    const path = window.location.pathname.substring(1);
    return path || 'home';
  };

  // Extract query params from URL
  const getInitialParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const paramsObj = {};
    for (const [key, value] of searchParams.entries()) {
      paramsObj[key] = value;
    }
    return paramsObj;
  };

  const [currentPath, setCurrentPath] = useState(getInitialPath());
  const [params, setParams] = useState(getInitialParams());

  const navigate = (path, navParams = {}) => {
    setCurrentPath(path);
    setParams(navParams);

    // Update URL without reloading
    const url = new URL(window.location);
    url.pathname = `/${path}`;
    // Clear search params on normal navigation unless specified
    url.search = '';
    window.history.pushState({}, '', url);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ currentPath, params, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
