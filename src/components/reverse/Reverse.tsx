import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View } from 'react-native-ui-lib';
const Reverse = () => {
  return (
    <View
      style={{
        width: 110,
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
      <TouchableOpacity
        style={{
          width: 39,
          height: 39,
          borderRadius: 39,
          backgroundColor: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../assets/progress-number/left.png')}
          style={{ width: 24, height: 23 }}
        />
      </TouchableOpacity>
      <Image
        source={require('../../assets/progress-number/arrow.png')}
        style={{
          width: 45 / 2,
          height: 29 / 2,
        }}
      />

      <TouchableOpacity
        style={{
          width: 39,
          height: 39,
          borderRadius: 39,
          backgroundColor: 'rgba(233, 182, 233, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../assets/progress-number/right.png')}
          style={{ width: 24, height: 23 }}
        />
      </TouchableOpacity>
    </View>
  );
};
export default Reverse;
