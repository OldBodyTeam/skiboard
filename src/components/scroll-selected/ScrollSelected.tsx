import React, { FC, useEffect, useRef } from 'react';
import { View, Image, Text } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
export type ScrollSelectedProps = {
  scrollData: { title: string }[];
  title: string;
};
const ScrollSelected: FC<ScrollSelectedProps> = props => {
  const { scrollData, title } = props;
  const r = useRef<ICarouselInstance>(null);
  useEffect(() => {
    const index = scrollData.findIndex(v => v.title === title);
    r.current?.scrollTo({ index });
  }, [scrollData, title]);

  return (
    <View
      style={{
        marginHorizontal: 33,
        height: (86 * 3) / 2,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 0, 0, 1)',
        overflow: 'hidden',
        position: 'relative',
      }}>
      <View
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          width: '100%',
          height: 40,
        }}>
        <Image
          source={require('../../assets/light-glow-modes/top.png')}
          style={{
            width: '100%',
            height: 40,
          }}
        />
      </View>
      <View
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          bottom: 0,
          left: 0,
          zIndex: 1,
          width: '100%',
          height: 40,
        }}>
        <Image
          source={require('../../assets/light-glow-modes/bottom.png')}
          style={{
            width: '100%',
            height: 40,
          }}
        />
      </View>
      <Carousel
        ref={r}
        loop={false}
        autoPlayInterval={0}
        style={{
          height: 43 * 3,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        data={scrollData}
        height={43}
        vertical
        renderItem={({ item }) => {
          return (
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              key={item.title}>
              <Text style={{ fontSize: 28, color: 'white' }}>{item.title}</Text>
            </View>
          );
        }}
        autoPlay={false}
      />
    </View>
  );
};
export default ScrollSelected;
