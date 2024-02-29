import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import ItemText from './ItemText';
const END_POSITION = 53;
const ProgressNumber = () => {
  const oldValue = useSharedValue(0);
  const position = useSharedValue(0);
  const positionValue = useSharedValue(0);
  const handleSelected = (_index: number) => {};
  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      if (position.value >= 0 && position.value <= END_POSITION * 4) {
        position.value = oldValue.value + e.translationX;
        const index = Math.round(position.value / 44);
        positionValue.value = index;
      }
    })
    .onEnd(e => {
      const index = Math.round(position.value / END_POSITION);
      if (index < 0) {
        position.value = withTiming(0, { duration: 100 });
        oldValue.value = withTiming(0);
        positionValue.value = 0;
        runOnJS(handleSelected)(0);
        return;
      }
      if (index > 4) {
        position.value = withTiming(END_POSITION * 4, { duration: 100 });
        oldValue.value = withTiming(END_POSITION * 4);
        positionValue.value = 4;
        runOnJS(handleSelected)(4);
        return;
      }
      positionValue.value = index;
      runOnJS(handleSelected)(index);
      if (e.translationX > 0) {
        const distance = END_POSITION * index;
        position.value = withTiming(distance, { duration: 100 });
        oldValue.value = withTiming(distance);
      } else {
        const distance = END_POSITION * index;
        position.value = withTiming(distance, {
          duration: 100,
        });
        oldValue.value = withTiming(distance);
      }
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  return (
    <ImageBackground
      source={require('../../assets/progress-number/bg.png')}
      style={{
        width: 602 / 2,
        height: 84 / 2,
        position: 'relative',
        paddingHorizontal: 36 / 2,
      }}>
      <View
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          top: 0,
          left: 0,
          zIndex: 2,
          paddingHorizontal: 18,
        }}>
        {[0, 1, 2, 3, 4].map(v => {
          return (
            <View
              key={v}
              style={{
                width: 53,
                height: 42,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ItemText position={v} positionValue={positionValue} />
            </View>
          );
        })}
      </View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <ImageBackground
            source={require('../../assets/progress-number/slider.png')}
            style={{ width: 106 / 2, height: 110 / 2 }}
          />
        </Animated.View>
      </GestureDetector>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 18,
    zIndex: 1,
    top: -6,
  },
});
export default ProgressNumber;
