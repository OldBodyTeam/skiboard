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
const END_POSITION = 65 / 2;
const ProgressNumber = () => {
  const oldValue = useSharedValue(0);
  const position = useSharedValue(0);
  const positionValue = useSharedValue(0);
  const handleSelected = (index: number) => {
    console.log(index);
  };
  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      if (position.value >= 0 && position.value <= END_POSITION * 4) {
        position.value = oldValue.value + e.translationX;
        const index = Math.round(position.value / END_POSITION);
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
  // const animatedTextStyle = useAnimatedStyle(() => ({
  //   color: interpolateColor(
  //     positionValue.value,
  //     [0, 1],
  //     ['white', 'black', 'white'],
  //   ),
  // }));

  return (
    <ImageBackground
      source={require('../../assets/progress-number/bg.png')}
      style={{
        width: 368 / 2,
        height: 62 / 2,
        position: 'relative',
        paddingHorizontal: 16,
      }}>
      <View
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          top: 0,
          left: 12,
          zIndex: 2,
        }}>
        {[0, 1, 2, 3, 4].map(v => {
          return (
            <View
              key={v}
              style={{
                width: 65 / 2,
                height: 65 / 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ItemText position={v} positionValue={positionValue} />
              {/* <Animated.Text
                style={[
                  { fontSize: 14, color: 'white' },
                  v === positionValue.value ? animatedTextStyle : {},
                ]}>
                {v}
              </Animated.Text> */}
            </View>
          );
        })}
      </View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <ImageBackground
            source={require('../../assets/progress-number/slider.png')}
            style={{ width: 65 / 2, height: 40 }}
          />
        </Animated.View>
      </GestureDetector>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    top: -4.5,
  },
});
export default ProgressNumber;
