import React, { FC, useEffect, useState } from 'react';
import { Dimensions, StyleProp, ViewStyle } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { View } from 'react-native-ui-lib';
import MusicCarouselItem from './MusicCarouselItem';
import { Easing } from 'react-native-reanimated';
import TrackPlayer, {
  State,
  Track,
  useProgress,
} from 'react-native-track-player';
import { playlistData } from '@components/music-player/assets/playlist';
import useBLE from '@hooks/useBLE';
import { useThrottleFn } from 'ahooks';
import { getHex } from '@utils/hex';
import { wave } from '@components/music-player/assets/wave';
import { get } from 'lodash';
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
  const progress = useProgress();

  const { bleWrite } = useBLE();
  const { run } = useThrottleFn(
    async volume => {
      await bleWrite(`57e204${volume}61`);
    },
    { wait: 2000 },
  );
  const [title, setTitle] = useState('');
  useEffect(() => {
    const j = async () => {
      const state = (await TrackPlayer.getPlaybackState()).state;
      if (state === State.Playing && title) {
        const num = get(
          wave,
          `${title}.${Math.floor(progress.position)}`,
          undefined,
        );
        if (typeof num === 'number') {
          run((num + 0.1).toFixed(6).split('.')[1]);
        }
      }
    };
    j();
  }, [progress, run, title]);
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
                setTitle(item.title.slice(0, -4));
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
