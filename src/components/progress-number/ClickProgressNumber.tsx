import React, { useState } from 'react';
import { ImageBackground, Pressable, View } from 'react-native';
import ItemText from './ItemText';
import { useSharedValue } from 'react-native-reanimated';
const ClickProgressNumber = () => {
  const positionValue = useSharedValue(0);
  const [showIndex, setShowIndex] = useState(0);
  return (
    <View
      //   source={require('../../assets/progress-number/bg.png')}
      style={{
        // flex: 1,
        height: 84 / 2,
        position: 'relative',
        paddingHorizontal: 36 / 2,
        borderRadius: 42,
        borderColor: '#BFBFBF',
        borderWidth: 1,
        width: '100%',
      }}>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 18,
          flex: 1,
        }}>
        {[0, 1, 2, 3, 4].map(v => {
          return (
            <Pressable
              key={v}
              onPress={() => {
                positionValue.value = v;
                setShowIndex(v);
              }}
              style={{
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: 53,
                  height: 42,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ItemText position={v} positionValue={positionValue} />
              </View>
              {showIndex === v ? (
                <View
                  style={{
                    position: 'absolute',
                    zIndex: -1,
                  }}>
                  <ImageBackground
                    source={require('../../assets/progress-number/slider.png')}
                    style={{ width: 106 / 2, height: 110 / 2 }}
                  />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
export default ClickProgressNumber;
