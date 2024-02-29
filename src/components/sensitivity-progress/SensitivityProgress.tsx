import React from 'react';
import { Image, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { View } from 'react-native-ui-lib';
const END_POSITION = 89 / 2;
const blockNum = 4;
const leftDistance = 105;
const SensitivityProgress = () => {
  const oldValue = useSharedValue(leftDistance);
  const position = useSharedValue(leftDistance);
  const positionValue = useSharedValue(0);
  const handleSelected = (_index: number) => {};
  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      if (
        position.value >= leftDistance &&
        position.value <=
          END_POSITION * blockNum + leftDistance + positionValue.value * 1
      ) {
        position.value = oldValue.value + e.translationX;
        const index = Math.round(
          (position.value - leftDistance) / END_POSITION,
        );
        positionValue.value = index;
      }
    })
    .onEnd(e => {
      const index = Math.round(
        (position.value - leftDistance - positionValue.value * 1) /
          END_POSITION,
      );
      if (index < 0) {
        position.value = withTiming(leftDistance, { duration: 100 });
        oldValue.value = withTiming(leftDistance);
        positionValue.value = 0;
        runOnJS(handleSelected)(0);
        return;
      }
      if (index > blockNum) {
        position.value = withTiming(END_POSITION * blockNum, { duration: 100 });
        oldValue.value = withTiming(END_POSITION * blockNum);
        positionValue.value = blockNum;
        runOnJS(handleSelected)(blockNum);
        return;
      }
      positionValue.value = index;
      runOnJS(handleSelected)(index);
      if (e.translationX > 0) {
        const distance = END_POSITION * index + leftDistance + index * 1;
        position.value = withTiming(distance, { duration: 100 });
        oldValue.value = withTiming(distance);
      } else {
        const distance = END_POSITION * index + leftDistance + index * 1;
        position.value = withTiming(distance, {
          duration: 100,
        });
        oldValue.value = withTiming(distance);
      }
    });
  const animatedStyle = useAnimatedStyle(() => ({
    width: position.value,
  }));

  return (
    <View
      style={{
        marginHorizontal: 10,
        marginTop: 16,
        flexDirection: 'row',
        height: 44,
        backgroundColor: 'rgba(29, 33, 34, 1)',
        borderRadius: 44,
      }}>
      <Image
        source={require('../../assets/sound-effects/left.png')}
        style={{
          width: 20,
          height: 20,
          marginRight: 21,
          position: 'absolute',
          left: 8,
          top: 11,
          zIndex: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          top: 0,
          left: leftDistance / 2,
          zIndex: 20,
          height: 44,
        }}>
        <View style={{ width: 1, height: 6, backgroundColor: 'white' }} />
        {[0, 1, 2, 3, 4].map(v => {
          return (
            <View
              key={v}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 89 / 2,
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    lineHeight: 18,
                    // color: '#1D2122',
                    color: 'red',
                    fontWeight: 'bold',
                  }}>
                  {v + 1}
                </Text>
              </View>
              <View style={{ width: 1, height: 6, backgroundColor: 'white' }} />
            </View>
          );
        })}
      </View>
      <Image
        source={require('../../assets/sound-effects/right.png')}
        style={{
          width: 20,
          height: 20,
          position: 'absolute',
          right: 8,
          top: 11,
          zIndex: 1,
        }}
      />
      <Animated.View
        style={[
          {
            backgroundColor: 'rgba(250, 237, 69, 1)',
            height: 44,
            borderRadius: 44,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingRight: 2,
          },
          animatedStyle,
        ]}>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                backgroundColor: '#1D2122',
                height: 40,
                width: 54,
                borderRadius: 22,
              },
              // animatedSliderStyle,
            ]}
          />
        </GestureDetector>
      </Animated.View>
    </View>
  );
};
export default SensitivityProgress;
