import { StyleSheet } from 'react-native';

const CustomTabBar = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabbarItem:{
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
});

export default CustomTabBar;