// import { bleState } from '@stores/ble/ble.atom';
import { glowModes } from '@pages/light-glow-modes/utils';
import { useDebounceFn, useMount } from 'ahooks';
import React, { FC, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Image, Text } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
export type ScrollSelectedProps = {
  // scrollData: string[];
  title: string;
  handleSelectedTitle: (a: string, poi: string) => void;
  value: string;
};
const ScrollSelected: FC<ScrollSelectedProps> = props => {
  const { title, handleSelectedTitle } = props;
  console.log('title &&&&&& ->', title);
  const r = useRef<ICarouselInstance>(null);
  const { t } = useTranslation();
  const scrollData = useMemo(() => {
    return glowModes[title as keyof typeof glowModes];
  }, [title]);
  const { run } = useDebounceFn(
    (a, b: number) => {
      handleSelectedTitle(title, scrollData[b]);
    },
    { wait: 100 },
  );
  useMount(() => {
    const index = scrollData.findIndex(v => v === title);
    setTimeout(() => {
      r.current?.scrollTo({ index: index === -1 ? 0 : index });
    }, 300);
  });
  console.log('**********', scrollData);
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
        onProgressChange={run}
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
              key={item}>
              <Text style={{ fontSize: 28, color: 'white' }}>{t(item)}</Text>
            </View>
          );
        }}
        autoPlay={false}
      />
    </View>
  );
};
export default ScrollSelected;
