import React, { FC } from 'react';
import { Dimensions, StyleProp, ViewStyle } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { View } from 'react-native-ui-lib';
import MusicCarouselItem from './MusicCarouselItem';
import { Easing } from 'react-native-reanimated';
export type MusicCarouselProps = {
  autoPlayReverse?: boolean;
  style?: StyleProp<ViewStyle>;
  carouselData: { title: string; artwork: string }[];
  autoPlay: boolean;
  handleAutoPlay: (title: string, index?: number) => void;
  selectedIndex: number;
  currentSelectedLine: boolean;
};
const MusicCarousel: FC<MusicCarouselProps> = props => {
  const {
    autoPlayReverse,
    selectedIndex,
    carouselData,
    autoPlay,
    handleAutoPlay,
    currentSelectedLine,
  } = props;
  const r = React.useRef<ICarouselInstance>(null);
  return (
    <View>
      <Carousel
        ref={r}
        loop={true}
        autoPlayInterval={0}
        style={{
          width: Dimensions.get('screen').width,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        data={carouselData}
        width={200}
        renderItem={({ item, index: order }) => {
          return (
            <MusicCarouselItem
              selected={currentSelectedLine && order === selectedIndex}
              item={item}
              onPress={() => {
                const index = r.current?.getCurrentIndex();
                if (index) {
                  handleAutoPlay(item.title, index);
                  r.current?.scrollTo({ index, animated: false });
                }
              }}
            />
          );
        }}
        autoPlay={autoPlay}
        withAnimation={{
          type: 'timing',
          config: { duration: 15000, easing: Easing.linear },
        }}
        autoPlayReverse={autoPlayReverse}
      />
    </View>
  );
};
export default MusicCarousel;
