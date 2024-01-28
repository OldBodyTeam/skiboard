import React from 'react';
import { View } from 'react-native-ui-lib';
const Reverse = () => {
  return (
    <View
      style={{
        height: 42,
        borderRadius: 24,
        backgroundColor: 'rgba(233, 202, 244, 1)',
        borderWidth: 1,
        borderColor: '#E9CAF4',
        padding: 3 / 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: 39,
          height: 39,
          borderRadius: 39,
          backgroundColor: 'black',
        }}
      />
      <View />
      <View
        style={{
          width: 39,
          height: 39,
          borderRadius: 39,
          backgroundColor: 'rgba(233, 182, 233, 1)',
        }}
      />
    </View>
  );
};
export default Reverse;
