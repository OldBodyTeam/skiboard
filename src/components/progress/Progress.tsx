import React, { FC, useState } from 'react';
import { Image, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slider } from 'react-native-ui-lib';
export type ProgressProps = {
  onProgressChange: (value: number) => void;
};
const Progress: FC<ProgressProps> = props => {
  const { onProgressChange } = props;
  const [leftStatus, setLeftStatus] = useState(false);
  const [rightStatus, setRightStatus] = useState(false);
  const handleValueChange = (value: number) => {
    const currentProgress = Math.round(value * 100);
    onProgressChange(currentProgress);
    setLeftStatus(currentProgress > 15);
    setRightStatus(currentProgress > 92);
  };
  return (
    <GestureHandlerRootView style={{ flex: 1, marginRight: 4 }}>
      <View
        style={{
          height: 50,
          borderRadius: 50,
          overflow: 'hidden',
          position: 'relative',
        }}>
        <View
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            left: 14,
            top: (50 - 16) / 2,
            zIndex: 90,
          }}>
          <Image
            source={
              leftStatus
                ? require('../../assets/light/2.png')
                : require('../../assets/light/left-selected.png')
            }
            style={{ width: 16, height: 16 }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            right: 14,
            top: (50 - 16) / 2,
            zIndex: 90,
            // backgroundColor: 'green',
          }}>
          <Image
            source={
              rightStatus
                ? require('../../assets/light/right-elected.png')
                : require('../../assets/light/1.png')
            }
            style={{ width: 16, height: 16 }}
          />
        </View>

        <Slider
          containerStyle={{
            height: 50,
            position: 'relative',
            zIndex: 0,
          }}
          trackStyle={{
            height: 50,
            borderRadius: 0,
          }}
          thumbStyle={{
            backgroundColor: 'transparent',
            width: 0,
            height: 0,
            borderWidth: 0,
          }}
          activeThumbStyle={{
            width: 0,
            height: 0,
            borderWidth: 0,
            overflow: 'hidden',
          }}
          minimumTrackTintColor="yellow"
          maximumTrackTintColor="rgba(118, 118, 118, 0.1)"
          onValueChange={handleValueChange}
        />
      </View>
    </GestureHandlerRootView>
  );
};
export default Progress;
