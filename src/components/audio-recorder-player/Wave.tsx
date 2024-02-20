import React, { FC, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { WavePath } from './worklets';
import * as d3 from 'd3';
export interface WaveProps {
  placement?: string;
  speed?: number;
  maxPoints?: number;
  width: number;
  height: number;
  delta?: number;
  color?: string;
  gap?: number;
  flip?: boolean;
  points: { x: number; y: number }[];
}
const AnimatedPath = Animated.createAnimatedComponent(Path);
const Wave: FC<WaveProps> = props => {
  const { placement = 'bottom', width, height, points, color, gap } = props;
  const styles = StyleSheet.create({
    top: {
      transform: [{ rotateX: '180deg' }],
    },
    bottom: {
      transform: [{ rotateY: '0deg' }],
    },
  });

  const loop = useSharedValue(0);
  const path = useSharedValue('');

  const animatedProps = useAnimatedProps(() => {
    return { d: path.value };
  }, [path.value]);
  // console.log('******** points *********');
  // console.log(points);
  const line = d3
    .line()
    .x(function (d, i) {
      return i;
    })
    .y(function (d, i) {
      return 50 * Math.sin(i / 50) + d[1];
    });
  const a = line(points.map(v => [v.x, v.y]))!;
  useEffect(() => {
    if (points.length > 2) {
      const pathSVG = WavePath(points).getPoints().build(width, height);
      loop.value = withTiming(0, { duration: 1000 }, () => {
        path.value = a;
      });
    }
    return () => cancelAnimation(loop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, loop, path, points, width]);

  return (
    <View style={placement === 'top' ? styles.top : styles.bottom}>
      <Svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
        <AnimatedPath
          animatedProps={animatedProps}
          fill={color}
          translateY={gap}
        />
      </Svg>
    </View>
  );
};

export default Wave;
