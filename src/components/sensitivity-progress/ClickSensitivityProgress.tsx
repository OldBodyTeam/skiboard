import { sensitivity } from '@config/sensitivity';
import useBLE from '@hooks/useBLE';
import { BLEConfig } from '@utils/ble';
import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
const maxWidth =
  Dimensions.get('window').width - 6 * 2 - 10 * 2 - 8 * 2 - 20 * 2;
const singleWidth =
  (Dimensions.get('window').width - 6 * 2 - 10 * 2 - 8 * 2 - 20 * 2) / 5;
const ClickSensitivityProgress: FC<{
  onChange: (num: number) => void;
}> = props => {
  const { onChange } = props;
  const { width } = useWindowDimensions();
  const canUseWidth = useMemo(() => {
    return (width - 6 * 2 - 10 * 2 - 8 * 2 - 20 * 2) / 5;
  }, [width]);
  const { bleWrite } = useBLE();
  const [selectedIndex, setSelectedIndex] = useState(1);
  useEffect(() => {
    onChange(selectedIndex);
    bleWrite(
      BLEConfig.sensitivity[String(selectedIndex) as keyof typeof sensitivity],
    );
  }, [bleWrite, selectedIndex, onChange]);
  const translationX = useSharedValue(20 + 8 + singleWidth);
  const prevTranslationX = useSharedValue(20 + 8 + singleWidth);

  const animatedStyles = useAnimatedStyle(() => ({
    width: translationX.value,
  }));
  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
    })
    .onUpdate(event => {
      const maxTranslateX = maxWidth + 20 + 8;
      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        20 + 8 + singleWidth,
        maxTranslateX,
      );
    })
    .onEnd(event => {
      const maxTranslateX = maxWidth + 20 + 8;
      const d = event.translationX > 0 ? 1 : -1; // 方向
      const x = translationX.value - 20 - 8; // 移动的距离
      const index = Math.floor(x / singleWidth); // 几个点
      //   const reset = maxWidth - x;
      const reset = x - index * singleWidth;
      const i = Number(reset > singleWidth / 2);
      const a = (index + i * d) * singleWidth + 20 + 8;
      setSelectedIndex(index + i * d);
      translationX.value = clamp(a, 20 + 8 + singleWidth, maxTranslateX);
    })
    .runOnJS(true);
  return (
    <View
      style={{
        marginHorizontal: 10,
        marginTop: 16,
        flexDirection: 'row',
        height: 44,
        backgroundColor: 'rgba(29, 33, 34, 1)',
        borderRadius: 44,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        // borderColor: '#BFBFBF',
        // borderWidth: 1,
      }}>
      <Image
        source={require('../../assets/sound-effects/left.png')}
        style={{
          width: 20,
          height: 20,
          position: 'relative',
          zIndex: 5,
        }}
      />

      {[1, 2, 3, 4, 5].map(v => {
        return (
          <View
            key={v}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              paddingHorizontal: 8,
              flexGrow: 1,
              flexShrink: 0,
              position: 'relative',
              pointerEvents: 'none',
              zIndex: 5,
            }}>
            <View
              style={{
                width: 1,
                height: 6,
                backgroundColor: selectedIndex > v ? '#1D2122' : 'white',
              }}
            />
            <View
              style={{
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}>
              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 18,
                  color: selectedIndex === v ? 'white' : '#494D4E',
                  fontWeight: 'bold',
                  opacity: selectedIndex === v ? 0 : 1,
                }}>
                {v}
              </Text>
            </View>

            <View
              style={{
                width: 1,
                height: 6,
                backgroundColor: selectedIndex > v ? '#1D2122' : 'white',
              }}
            />
          </View>
        );
      })}
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            animatedStyles,
            {
              // width: 20 + 8 + canUseWidth * selectedIndex,
              position: 'absolute',
              zIndex: 0,
              backgroundColor: 'rgba(250, 237, 69, 1)',
              left: 0,
              top: 0,
              height: 44,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              borderRadius: 44,
              overflow: 'hidden',
            },
          ]}>
          <View
            style={
              {
                // position: 'absolute',
                // zIndex: -1,
                // backgroundColor: 'rgba(250, 237, 69, 1)',
                // left: 0,
                // top: 0,
                // height: 44,
                // flexDirection: 'row',
                // justifyContent: 'flex-end',
                // alignItems: 'center',
                // borderRadius: 44,
                // overflow: 'hidden',
              }
            }>
            <View
              style={{
                width: canUseWidth - 4,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1C2122',
                borderRadius: 40,
                marginHorizontal: 2,
              }}>
              <View style={{ width: 1, height: 6, backgroundColor: 'white' }} />
              <View
                style={{
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    lineHeight: 18,
                    // color: '#1D2122',
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  {selectedIndex}
                </Text>
              </View>

              <View style={{ width: 1, height: 6, backgroundColor: 'white' }} />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
      <Image
        source={require('../../assets/sound-effects/right.png')}
        style={{
          width: 20,
          height: 20,
        }}
      />
    </View>
  );
};
export default ClickSensitivityProgress;
