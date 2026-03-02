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
    console.log('🧭 Navigate called with:', { path, navParams });
    
    // Handle MongoDB ID in path (like "/artist/69a2866ba0c5ffd08f8ca0ce")
    if (path.includes('/artist/') && path !== '/artist') {
      const pathParts = path.split('/');
      const artistId = pathParts[pathParts.length - 1];
      console.log('🆔 Extracted artistId from path:', artistId);
      
      // Set path to 'artist' and artistId in params
      path = 'artist';
      navParams = { ...navParams, artistId };
    }
    
    setCurrentPath(path);
    setParams(navParams);

    // Update URL without reloading
    const url = new URL(window.location);
    url.pathname = `/${path}`;
    
    // Add search params if provided (for artist ID, etc.)
    if (Object.keys(navParams).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(navParams).forEach(([key, value]) => {
        if (key === 'artistId') {
          searchParams.set('artistId', value);
          console.log('🔗 Setting artistId in URL:', value);
        } else if (key === 'artist' && value && value.id) {
          searchParams.set('artistId', value.id);
          console.log('🔗 Setting artistId in URL:', value.id);
        } else if (value && typeof value === 'object' && value.id) {
          searchParams.set('artistId', value.id);
          console.log('🔗 Setting artistId in URL (object):', value.id);
        }
      });
      url.search = searchParams.toString();
      console.log('🌐 Final URL:', url.toString());
    } else {
      url.search = '';
    }
    
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
