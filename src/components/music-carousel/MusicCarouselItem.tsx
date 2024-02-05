import React, { FC } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
export type MusicCarouselItemProps = {
  onPress: () => void;
  item: { title: string; artwork: string; bg: string };
  selected: boolean;
};
const MusicCarouselItem: FC<MusicCarouselItemProps> = props => {
  const { onPress, item, selected } = props;
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          backgroundColor: selected ? 'white' : 'rgba(52, 53, 54, 0.5)',
          height: 50,
          borderRadius: 50,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          paddingLeft: 5,
          paddingRight: 16,
          marginHorizontal: 8,
        }}>
        <View
          style={{
            borderRadius: 41,
            overflow: 'hidden',
            marginRight: 16,
            width: 41,
            height: 41,
          }}>
          <Image
            source={{
              uri: item.artwork,
            }}
            style={{
              width: 41,
              height: 41,
              backgroundColor: item.bg ?? 'green',
            }}
          />
        </View>
        <Text
          style={{
            fontWeight: 'bold',
            color: selected ? 'black' : 'white',
            fontSize: 15,
            lineHeight: 18,
            flex: 1,
          }}
          numberOfLines={2}>
          {item.title.slice(0, -4)}
        </Text>
      </View>
    </Pressable>
  );
};
export default MusicCarouselItem;
