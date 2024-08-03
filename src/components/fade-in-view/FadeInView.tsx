import React, { FC, PropsWithChildren } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
const FadeInView: FC<PropsWithChildren> = ({ children }) => {
  const opacity = useSharedValue(0);
  useFocusEffect(() => {
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });

    return () => {
      opacity.value = withTiming(0, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.appContainer, animatedStyle]}>
      {children}
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: Dimensions.get('window').width,
  },
});
const SpringInView: FC<PropsWithChildren<{ height: number }>> = ({
  children,
  height,
}) => {
  const translateY = useSharedValue(height);

  useFocusEffect(() => {
    // Animate the component into view
    translateY.value = withTiming(0, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });

    return () => {
      // Animate the component out of view
      translateY.value = withTiming(height, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      });
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
};
const SpringInViewX: FC<PropsWithChildren<{ width: number }>> = ({
  children,
  width,
}) => {
  const translateX = useSharedValue(width);

  useFocusEffect(() => {
    // Animate the component into view
    translateX.value = withTiming(0, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });

    return () => {
      // Animate the component out of view
      translateX.value = withTiming(width, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      });
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
};
const SpringInViewXY: FC<
  PropsWithChildren<{ width: number; height: number }>
> = ({ children, width, height }) => {
  const translateX = useSharedValue(width);
  const translateY = useSharedValue(height);

  useFocusEffect(() => {
    // Animate the component into view
    translateX.value = withTiming(0, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });
    translateY.value = withTiming(0, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });

    return () => {
      translateX.value = withTiming(width, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      });
      translateY.value = withTiming(width, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      });
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
};
export { FadeInView, SpringInView, SpringInViewX, SpringInViewXY };
