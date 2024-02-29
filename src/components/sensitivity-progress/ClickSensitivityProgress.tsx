import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
const ClickSensitivityProgress = () => {
  const { width } = useWindowDimensions();
  const canUseWidth = useMemo(() => {
    return (width - 6 * 2 - 10 * 2 - 8 * 2 - 20 * 2) / 5;
  }, [width]);
  const [selectedIndex, setSelectedIndex] = useState(1);
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
          //   marginRight: 21,
          //   position: 'absolute',
          //   left: 8,
          //   top: 11,
          //   zIndex: 1,
        }}
      />
      {[1, 2, 3, 4, 5].map(v => {
        return (
          <Pressable
            key={v}
            onPress={() => setSelectedIndex(v)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              paddingHorizontal: 8,
              //   backgroundColor: v % 2 === 1 ? 'red' : 'green',
              flexGrow: 1,
              flexShrink: 0,
            }}>
            {/* <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                paddingHorizontal: 8,
                backgroundColor: v % 2 === 1 ? 'red' : 'green',
                flexGrow: 1,
                flexShrink: 0,
              }}
              onLayout={e => console.log(e.nativeEvent.layout.width)}> */}
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
                  // color: '#1D2122',
                  color: '#494D4E',
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
            {/* </View> */}
          </Pressable>
        );
      })}

      <View
        style={{
          position: 'absolute',
          zIndex: -1,
          width: 20 + 8 + canUseWidth * selectedIndex,
          backgroundColor: 'rgba(250, 237, 69, 1)',
          left: 0,
          top: 0,
          height: 44,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          borderRadius: 44,
          overflow: 'hidden',
        }}>
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

      <Image
        source={require('../../assets/sound-effects/right.png')}
        style={{
          width: 20,
          height: 20,
          //   position: 'absolute',
          //   right: 8,
          //   top: 11,
          //   zIndex: 1,
          // marginRight
        }}
      />
    </View>
  );
};
export default ClickSensitivityProgress;
