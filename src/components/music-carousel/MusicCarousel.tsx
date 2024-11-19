import React, { FC, useEffect } from 'react';
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
    async volumn => {
      let size = -volumn;
      let data = getHex(size);
      if (size >= 40 && size < 50) {
        data = `0000${getHex(size)}`;
      } else if (size >= 50 && size < 60) {
        data = `00${getHex(size)}00`;
      } else {
        data = `${getHex(size)}0000`;
      }
      await bleWrite(`57e204${data}61`);
    },
    { wait: 300 },
  );
  useEffect(() => {
    const j = async () => {
      const state = (await TrackPlayer.getPlaybackState()).state;
      if (state === State.Playing) {
        const value = Math.random() * (70 - 40) + 40;
        run(value);
      }
    };
    j();
  }, [progress, run]);
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
