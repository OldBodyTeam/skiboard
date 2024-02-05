import { TabConfig } from '@pages/home/tab-config';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { customTabBarStyle } from './style';
const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  return (
    <View style={customTabBarStyle.tabBarContainer}>
      {state.routes.map((route, index: number) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const tab = TabConfig.find(item => item.name === route.name);

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={customTabBarStyle.itemContainer}>
            {route.name === 'DesignScreen' || route.name === 'LightScreen' ? (
              <Image
                source={require('../../assets/arrow-tab.png')}
                style={customTabBarStyle.arrow}
              />
            ) : null}
            <View>
              <Image
                source={isFocused ? tab?.selectedIcon : tab?.icon}
                style={customTabBarStyle.imageBlock}
              />

              {/* {route.key === 'DesignScreen' || route.key === 'LightScreen' ? (
                <Image
                  source={require('../../assets/arrow-tab.png')}
                  style={style.arrow}
                />
              ) : null} */}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
