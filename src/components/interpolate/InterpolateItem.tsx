import React, { useImperativeHandle, useState } from 'react';
import { View, Text, LayoutRectangle, Pressable } from 'react-native';
export type InterpolateItemRef = {
  getWidth: any;
};
const InterpolateItem = React.forwardRef<
  InterpolateItemRef,
  { item: { title: string }; onPress: () => void }
>((props, ref) => {
  const { item, onPress } = props;
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
          borderWidth: 1,
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
              width: 60,
              height: 60,
              borderRadius: 60,
              overflow: 'hidden',
              backgroundColor: 'red',
              marginRight: 39 / 2,
            }}
          />
          <Text style={{ fontSize: 16, color: 'white', fontWeight: '400' }}>
            {item.title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});
export default InterpolateItem;
