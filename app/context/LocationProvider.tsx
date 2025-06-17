import React, { createContext, useState, useContext } from 'react';

interface LocationContextType {
  userLocation: { latitude: number; longitude: number; heading?: number | null } | null;
  setUserLocation: React.Dispatch<React.SetStateAction<any>>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export default function ({ children } : any) {
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number, heading?: number | null } | null>(null)

  return (
    <LocationContext.Provider value={{ userLocation, setUserLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}