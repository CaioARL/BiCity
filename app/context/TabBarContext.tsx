import React, { createContext, useContext } from 'react';
import { useSharedValue } from 'react-native-reanimated';

const TabBarContext = createContext({ tabBarOffset: useSharedValue(0) });

export const TabBarProvider = ({ children }: { children: React.ReactNode }) => {
  const tabBarOffset = useSharedValue(0);
  return (
    <TabBarContext.Provider value={{ tabBarOffset }}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBar = () => useContext(TabBarContext);