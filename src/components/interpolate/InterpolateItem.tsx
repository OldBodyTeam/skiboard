import React, { useImperativeHandle, useState } from 'react';
import { View, Text, LayoutRectangle, Pressable, Image } from 'react-native';
export type InterpolateItemRef = {
  getWidth: any;
};
const InterpolateItem = React.forwardRef<
  InterpolateItemRef,
  {
    item: { title: string; icon: any };
    onPress: () => void;
    selectedLed: boolean;
  }
>((props, ref) => {
  const { item, onPress, selectedLed } = props;
  const [domRef, setDomRef] = useState<LayoutRectangle>();
  useImperativeHandle(
    ref,
    () => {
      return {
        getWidth: domRef,
      };
    },
    [domRef],
  );
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          height: 64,
          borderRadius: 64,
          marginHorizontal: 11,
          borderWidth: selectedLed ? 1 : 0,
          borderColor: '#2D2F33',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          paddingVertical: 11 / 2,
          paddingRight: 16,
          paddingLeft: 11 / 2,
          backgroundColor: 'black',
        }}>
        <View
          {...props}
          onLayout={event => {
            setDomRef(event.nativeEvent.layout);
          }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 53,
              height: 53,
              borderRadius: 53,
              overflow: 'hidden',
              marginRight: 39 / 2,
            }}>
            <Image source={item.icon} style={{ width: 53, height: 53 }} />
          </View>
          <Text
            style={{
              fontSize: 16,
              color: selectedLed ? 'white' : 'rgba(255,255,255,0.6)',
              fontWeight: '400',
              flex: 1,
              textAlign: 'center',
            }}>
            {item.title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});
export default InterpolateItem;
