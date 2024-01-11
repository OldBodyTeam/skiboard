import React from 'react';
import { SafeAreaView, StatusBar, Text, View, FlatList } from 'react-native';
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
            backgroundColor: 'red',
            position: 'absolute',
            left: 16,
            top: 16.5,
            // rgba(255,255,255,0.15)
          }}>
          <Text>返回</Text>
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
        renderItem={item => <DeviceListItem key={item.index} />}
        keyExtractor={item => item.index + ''}
      />
    </SafeAreaView>
  );
};
export default DeviceList;
