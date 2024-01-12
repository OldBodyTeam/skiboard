import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  FlatList,
  Image,
} from 'react-native';
import DeviceListItem from './DeviceListItem';
const DeviceList = () => {
  return (
    <SafeAreaView style={{ backgroundColor: '#000000', flex: 1 }}>
      <StatusBar />
      <View
        style={{
          height: 74,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 41,
            height: 41,
            borderRadius: 41,
            backgroundColor: 'rgba(255,255,255,0.15)',
            position: 'absolute',
            left: 16,
            top: 16.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // rgba(255,255,255,0.15)
          }}>
          <Image
            source={require('../../assets/header-back.png')}
            style={{ width: 16, height: 16 }}
          />
        </View>
        <Text style={{ color: 'white', fontWeight: '600', fontSize: 20 }}>
          Devices
        </Text>
      </View>
      <FlatList
        style={{ paddingTop: 4 }}
        data={Array(30)
          .fill(1)
          .map(() => {
            return { index: Math.random() };
          })}
        renderItem={item => (
          <DeviceListItem key={item.index} device={item.index} />
        )}
        keyExtractor={item => item.index + ''}
      />
    </SafeAreaView>
  );
};
export default DeviceList;
