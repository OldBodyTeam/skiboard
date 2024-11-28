import React, { FC } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
const windowWidth = Dimensions.get('window').width;
const singleWidth = (windowWidth - 48 - 67 - 9 - 32) / 5;
const maxWidth = windowWidth - 48 - 67 - 9 - 32 - singleWidth;
export type SliderDrawProps = {
  onChange: (speed: number) => void;
  speed: number;
};
const SliderDraw: FC<SliderDrawProps> = props => {
  const { onChange, speed } = props;
  const translationX = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }));
  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
    })
    .onUpdate(event => {
      const maxTranslateX = maxWidth;
      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        0,
        maxTranslateX,
      );
    })
    .onEnd(event => {
      const maxTranslateX = maxWidth;
      const d = event.translationX > 0 ? 1 : -1; // 方向
      const x = translationX.value; // 移动的距离
      const index = Math.floor(x / singleWidth); // 几个点
      //   const reset = maxWidth - x;
      const reset = x - index * singleWidth;
      const i = Number(reset > singleWidth / 2);
      const a = (index + i * d) * singleWidth;
      onChange(index + i * d);
      translationX.value = clamp(a, 0, maxTranslateX);
    })
    .runOnJS(true);
  // const animatedTextStyle = useAnimatedStyle(() => ({
  //   color: interpolateColor(
  //     speed,
  //     [speed - 1, speed, speed + 1],
  //     ['black', 'white', 'black'],
  //   ),
  // }));
  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {[0, 1, 2, 3, 4].map(item => {
          return (
            <View style={styles.item} key={item}>
              <Animated.Text
                key={item}
                style={[
                  styles.text,
                  { color: speed === item ? 'white' : 'black' },
                  // animatedTextStyle,
                ]}>
                {item}
              </Animated.Text>
            </View>
          );
        })}
      </View>
      <GestureDetector gesture={pan}>
        <Animated.Image
          source={require('../../assets/draw/slider-item.png')}
          style={[animatedStyles, styles.slider]}
        />
      </GestureDetector>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: windowWidth - 48 - 67 - 9,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 48,
    borderColor: '#BFBFBF',
    borderWidth: 1,
  },
  item: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    pointerEvents: 'none',
    position: 'absolute',
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    width: windowWidth - 48 - 67 - 9,
    zIndex: 10,
  },
  text: {
    color: 'black',
    fontSize: 14,
    fontWeight: '400',
  },
  slider: {
    width: (windowWidth - 48 - 67 - 9 - 32) / 5,
    minWidth: 54.5,
    height: 68,
    position: 'absolute',
    left: 16,
    top: -10,
    zIndex: 5,
  },
});
export default SliderDraw;
