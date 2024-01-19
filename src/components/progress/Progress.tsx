import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slider } from 'react-native-ui-lib';

const Progress = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ height: 50, borderRadius: 50, overflow: 'hidden' }}>
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
