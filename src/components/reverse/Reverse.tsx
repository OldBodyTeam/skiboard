import useBLE from '@hooks/useBLE';
import { BLEConfig } from '@utils/ble';
import React, { FC, useEffect, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View } from 'react-native-ui-lib';
const Reverse: FC<{ mode: 'glow' | 'led' }> = props => {
  const { mode } = props;
  const [reverse, setReverse] = useState(false);
  const { bleWrite } = useBLE();
  useEffect(() => {
    if (mode === 'led') {
      bleWrite(
        reverse ? BLEConfig.led.reverseRight : BLEConfig.led.reverseLeft,
      );
    } else if (mode === 'glow') {
      bleWrite(
        reverse ? BLEConfig.glow.reverseRight : BLEConfig.glow.reverseLeft,
      );
    }
  }, [bleWrite, mode, reverse]);
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
          backgroundColor: !reverse ? 'black' : 'rgba(233, 182, 233, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => setReverse(false)}>
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
          backgroundColor: reverse ? 'black' : 'rgba(233, 182, 233, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => setReverse(true)}>
        <Image
          source={require('../../assets/progress-number/right.png')}
          style={{ width: 24, height: 23 }}
        />
      </TouchableOpacity>
    </View>
  );
};
export default Reverse;
