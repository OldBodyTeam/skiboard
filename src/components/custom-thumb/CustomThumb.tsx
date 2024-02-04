import React from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { RenderThumbProps } from 'reanimated-color-picker';

function CustomThumb({
  width,
  height,
  positionStyle,
  currentColor,
}: RenderThumbProps) {
  console.log(positionStyle);
  const animatedStyle = useAnimatedStyle(() => ({
    // borderColor: adaptiveColor.value,
    backgroundColor: currentColor.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderWidth: 6,
          borderRadius: width / 2,
          overflow: 'hidden',
          borderColor: '#ffffff',
        },
        animatedStyle,
        positionStyle,
      ]}>
      {/* <View style={{ backgroundColor: initialColor, width: '50%', height, alignSelf: 'flex-end' }} /> */}
    </Animated.View>
  );
}
export default CustomThumb;
