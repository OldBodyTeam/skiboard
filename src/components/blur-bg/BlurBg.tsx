import { useScreenSize } from '@hooks/useScreenSize';
import { BlurView } from '@react-native-community/blur';
import React, { FC, PropsWithChildren } from 'react';
import {
  StyleSheet,
  View,
  DimensionValue,
  AnimatableNumericValue,
  Text,
} from 'react-native';
export type BlurBgProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: AnimatableNumericValue;
  padding?: DimensionValue;
};
const BlurBg: FC<PropsWithChildren<BlurBgProps>> = props => {
  const { children, height, borderRadius, padding, width } = props;

  return (
    <View
      style={{
        position: 'relative',
        width,
        height,
        borderRadius,
        overflow: 'hidden',
        padding,
      }}>
      <BlurView
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
        }}
      />
      {children}
    </View>
  );
};
export default BlurBg;
