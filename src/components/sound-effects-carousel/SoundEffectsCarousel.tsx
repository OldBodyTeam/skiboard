import { useScreenSize } from '@hooks/useScreenSize';
import React, { FC } from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableNativeFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { Easing } from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
export type SoundEffectsCarouselProps = {
  autoPlayReverse?: boolean;
  style?: StyleProp<ImageStyle | ViewStyle>;
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
        ...StyleSheet.flatten(style),
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
                opacity: currentSelected ? 1 : 0.4,
                marginHorizontal: 5,
                ...StyleSheet.flatten(style),
              }}>
              <Image source={item.title} style={style as ImageStyle} />
            </View>
          </TouchableNativeFeedback>
        );
      }}
      autoPlay={autoPlay}
      withAnimation={{
        type: 'timing',
        config: { duration: 20000, easing: Easing.linear },
      }}
      autoPlayReverse={autoPlayReverse}
    />
  );
};
export default SoundEffectsCarousel;
