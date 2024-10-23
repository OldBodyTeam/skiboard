import React, { FC } from 'react';
import { View } from 'react-native';

export type DrawItemProps = FC<{
  x: number;
  y: number;
  handleSelected?: (x: number, y: number) => void;
  selectStatus: boolean;
  style?: any;
  selectedColor?: string;
  color?: string;
}>;
const DrawItem: DrawItemProps = props => {
  const {
    selectStatus,
    style,
    selectedColor = 'rgba(251,228,0,1)',
    color = 'rgba(255,255,255,0.1)',
  } = props;
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: selectStatus ? selectedColor : color,
        ...style,
      }}
    />
  );
};
export default DrawItem;
