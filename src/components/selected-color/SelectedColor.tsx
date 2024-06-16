import { useScreenSize } from '@hooks/useScreenSize';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
const data = [
  '#D96A6D',
  '#E6B46A',
  '#A2E770',
  '#82E3E0',
  '#6371E3',
  '#9965EA',
  '#CA61E8',
];
const SelectedColor: FC<{ handleSelected: (data: string) => void }> = props => {
  const { width } = useScreenSize();
  const distanceMove = width - 5 * 2 - 16 * 2 - 10 * 2 - 30;
  const position = useSharedValue(0);
  const oldValue = useSharedValue(0);
  const handleSelected = (index: number) => {
    let num = index <= 0 ? 1 : index > 100 ? 100 : index;
    if (num >= 1 && num <= 100) {
      const currentIndex = Math.floor(100 / data.length / Math.abs(num));
      let pos =
        currentIndex >= data.length - 1
          ? data.length - 1
          : currentIndex <= 0
          ? 0
          : currentIndex;
      props.handleSelected(data[pos]?.slice(1));
    }
  };
  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      if (position.value >= 0 && position.value <= distanceMove) {
        position.value = oldValue.value + e.translationX;
      }
    })
    .onEnd(e => {
      const index = Math.round((position.value / distanceMove) * 100);
      runOnJS(handleSelected)(index);
      if (e.translationX > 0 && position.value > distanceMove) {
        position.value = distanceMove;
        oldValue.value = distanceMove;
      } else if (e.translationX < 0 && position.value < 0) {
        position.value = 0;
        oldValue.value = 0;
      }
      oldValue.value = position.value;
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));
  return (
    <View style={{ flex: 1, height: 60, marginBottom: 12 }}>
      <LinearGradient
        colors={data}
        style={{
          flex: 1,
          borderRadius: 60,
          justifyContent: 'center',
          paddingHorizontal: 10,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.content, animatedStyle]}>
            <View style={styles.container} />
          </Animated.View>
        </GestureDetector>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    width: 30,
    height: 30,
    borderWidth: 6,
    borderColor: 'white',
    borderRadius: 30,
  },
  content: {
    backgroundColor: 'transparent',
    height: 60,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default SelectedColor;
