import React from 'react';
import { Image, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slider } from 'react-native-ui-lib';

const Progress = () => {
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
            source={require('../../assets/light/2.png')}
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
            source={require('../../assets/light/1.png')}
            style={{ width: 16, height: 16 }}
          />
        </View>

        <Slider
          containerStyle={{ height: 50 }}
          trackStyle={{
            height: 50,
            borderRadius: 0,
            backgroundColor: 'yellow',
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
        />
      </View>
    </GestureHandlerRootView>
  );
};
export default Progress;
