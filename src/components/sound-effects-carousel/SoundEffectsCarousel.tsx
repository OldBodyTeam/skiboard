import { useScreenSize } from '@hooks/useScreenSize';
import React, { FC } from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { Easing } from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
export type SoundEffectsCarouselProps = {
  autoPlayReverse?: boolean;
  style?: StyleProp<ImageStyle>;
  carouselData: { title: ImageSourcePropType }[];
  autoPlay: boolean;
  handleSelected: () => void;
  currentSelected: boolean;
};
const SoundEffectsCarousel: FC<SoundEffectsCarouselProps> = props => {
  const {
    autoPlayReverse,
    carouselData,
    autoPlay,
    handleSelected,
    currentSelected,
    style,
  } = props;
  const r = React.useRef<ICarouselInstance>(null);
  const { width } = useScreenSize();
  return (
    <Carousel
      ref={r}
      loop={true}
      autoPlayInterval={0}
      style={{
        width,
        height: 132 / 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      data={carouselData}
      width={width}
      renderItem={({ item }) => {
        return (
          <TouchableNativeFeedback onPress={handleSelected}>
            <View
              style={{
                width,
                height: 66,
                opacity: currentSelected ? 1 : 0.4,
              }}>
              <Image source={item.title} style={style} />
            </View>
          </TouchableNativeFeedback>
        );
      }}
      autoPlay={autoPlay}
      withAnimation={{
        type: 'timing',
        config: { duration: 15000, easing: Easing.linear },
      }}
      autoPlayReverse={autoPlayReverse}
    />
  );
};
export default SoundEffectsCarousel;
