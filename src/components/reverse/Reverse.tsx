import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View } from 'react-native-ui-lib';
const Reverse = () => {
  return (
    <View
      style={{
        width: 82,
        height: 31,
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
          width: 29,
          height: 29,
          borderRadius: 29,
          backgroundColor: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../assets/progress-number/left.png')}
          style={{ width: 18, height: 17 }}
        />
      </TouchableOpacity>
      <View
        style={{
          position: 'relative',
          marginHorizontal: 3,
          width: 15,
          height: 9,
        }}>
        <Image
          source={require('../../assets/progress-number/arrow-left.png')}
          style={{
            width: 9,
            height: 9,
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 2,
          }}
        />
        <Image
          source={require('../../assets/progress-number/arrow-right.png')}
          style={{
            width: 9,
            height: 9,
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 1,
          }}
        />
      </View>
      <TouchableOpacity
        style={{
          width: 29,
          height: 29,
          borderRadius: 29,
          backgroundColor: 'rgba(233, 182, 233, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../assets/progress-number/right.png')}
          style={{ width: 18, height: 17 }}
        />
      </TouchableOpacity>
    </View>
  );
};
export default Reverse;
