import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import { usePanGestureHandler } from 'react-native-redash';

import { ITEM_HEIGHT } from './Constants';

interface GestureHandlerProps {
  value: SharedValue<number>;
  max: number;
  defaultValue: number;
}
const END_POSITION = 20;
const GestureHandler = ({ value, max, defaultValue }: GestureHandlerProps) => {
  const onLeft = useSharedValue(true);
  const position = useSharedValue(0);
  const pan = Gesture.Pan()
    .onUpdate(e => {
      if (onLeft.value) {
        position.value = e.translationY;
      } else {
        position.value = END_POSITION + e.translationY;
      }
    })
    .onEnd(e => {
      if (position.value > END_POSITION / 2) {
        position.value = withTiming(END_POSITION, { duration: 100 });
        onLeft.value = false;
      } else {
        position.value = withTiming(0, { duration: 100 });
        onLeft.value = true;
      }
    });
  useEffect(() => {
    console.log(position.value);
  }, [position.value]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: position.value }],
  }));
  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.box, animatedStyle]}
      />
    </GestureDetector>
  );
};
const styles = StyleSheet.create({
  box: {
    height: 120,
    width: 120,
    backgroundColor: '#b58df1',
    borderRadius: 20,
    marginBottom: 30,
  },
});

export default GestureHandler;
