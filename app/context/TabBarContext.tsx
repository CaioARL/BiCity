import React, { createContext, useContext } from 'react';
import { useSharedValue } from 'react-native-reanimated';

type TabBarContextType = {
  tabBarOffset: any; 
};

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export const TabBarProvider = ({ children }: { children: React.ReactNode }) => {
  // Move the hook inside the component
  const tabBarOffset = useSharedValue(0);
  
  return (
    <TabBarContext.Provider value={{ tabBarOffset }}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBar = () => {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error('useTabBar must be used within a TabBarProvider');
  }
  return context;
};

export default TabBarProvider;