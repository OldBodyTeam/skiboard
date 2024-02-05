import { Dimensions, StyleSheet } from 'react-native';
const screenWidth = Dimensions.get('window').width;
const customTabBarStyle = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 14,
    width: 259,
    left: (screenWidth - 259) / 2,
    height: 65,
    borderRadius: 65,
    backgroundColor: 'rgba(52,53,54,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
  },
  itemContainer: {
    width: 57,
    height: 57,
    borderRadius: 57,
    backgroundColor: 'rgba(118,118,118,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  imageBlock: { width: 57, height: 57, borderRadius: 57 },
  arrow: {
    height: 12,
    width: 22,
    position: 'absolute',
    top: (65 - 22) / 2,
    right: -30,
    zIndex: 999,
  },
});
export { customTabBarStyle };
