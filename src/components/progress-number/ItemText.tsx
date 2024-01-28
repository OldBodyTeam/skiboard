import React, { FC } from 'react';
import Animated from 'react-native-reanimated';
import {
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
export type ItemTextProps = {
  position: number;
  positionValue: SharedValue<number>;
};
const ItemText: FC<ItemTextProps> = props => {
  const { positionValue, position } = props;
  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      positionValue.value,
      [position - 1, position, position + 1],
      ['black', 'white', 'black'],
    ),
  }));
  return (
    <Animated.Text
      style={[{ fontSize: 14, color: 'black' }, animatedTextStyle]}>
      {position}
    </Animated.Text>
  );
};
export default ItemText;
