import React, { FC, useEffect } from 'react';
import { Dimensions, StyleProp, ViewStyle } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { View } from 'react-native-ui-lib';
import MusicCarouselItem from './MusicCarouselItem';
import { Easing } from 'react-native-reanimated';
import TrackPlayer, { Track } from 'react-native-track-player';
import { playlistData } from '@components/music-player/assets/playlist';
export type MusicCarouselProps = {
  autoPlayReverse?: boolean;
  style?: StyleProp<ViewStyle>;
  carouselData: typeof playlistData;
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
  useEffect(() => {
    const getStatus = async () => {
      await TrackPlayer.getPlaybackState();
      TrackPlayer.pause();
    };
    return () => {
      getStatus();
    };
  }, []);
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
                handleAutoPlay(item.title, order);
                TrackPlayer.setQueue([item] as Track[]);
                TrackPlayer.play();
                // r.current?.scrollTo({
                //   index: order,
                //   animated: false,
                // });
              }}
            />
          );
        }}
        autoPlay={autoPlay}
        withAnimation={{
          type: 'timing',
          config: { duration: 25000, easing: Easing.linear },
        }}
        autoPlayReverse={autoPlayReverse}
      />
    </View>
  );
};
export default MusicCarousel;
