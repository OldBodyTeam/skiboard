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
    backgroundColor: '#343536',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
  },
  itemContainer: {
    width: 57,
    height: 57,
    borderRadius: 57,
    backgroundColor: '#767676',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBlock: { width: 57, height: 57, borderRadius: 57 },
});
export { customTabBarStyle };
