import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
const DeviceListItem = () => {
  return (
    <TouchableHighlight>
      <View
        style={{
          margin: 8,
          height: 80.5,
          borderRadius: 10,
          backgroundColor: '#262626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
          flexDirection: 'row',
        }}>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text>111</Text>
          <View style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '700', color: '#ffffff', fontSize: 15 }}>
              111
            </Text>
            <Text>222</Text>
          </View>
        </View>
        <View style={{ display: 'flex', alignItems: 'center' }}>
          <Text>111</Text>
          <Text>222</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};
export default DeviceListItem;
