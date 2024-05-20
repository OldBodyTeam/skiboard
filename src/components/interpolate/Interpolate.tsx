import InterpolateItem from '@components/interpolate/InterpolateItem';
import * as React from 'react';
import { FC } from 'react';
import { View, Dimensions, StyleProp, ViewStyle } from 'react-native';
import { Easing } from 'react-native-reanimated';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';

export type InterpolateProps = {
  autoPlayReverse?: boolean;
  style?: StyleProp<ViewStyle>;
  carouselData: { title: string; icon: any; key: string }[];
  autoPlay: boolean;
  handleAutoPlay: (title: string, index?: number) => void;
  selectedLinePosition: number;
  selectedLine: boolean;
};
const Interpolate: FC<InterpolateProps> = props => {
  const {
    autoPlayReverse,
    style,
    carouselData,
    handleAutoPlay,
    selectedLine,
    selectedLinePosition,
  } = props;
  const r = React.useRef<ICarouselInstance>(null);
  return (
    <View style={style}>
      <Carousel
        ref={r}
        loop={true}
        autoPlayInterval={0}
        style={{
          width: Dimensions.get('screen').width,
          height: 64,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        data={carouselData}
        width={230}
        renderItem={({ item, index }) => {
          return (
            <InterpolateItem
              item={item}
              onPress={() => {
                handleAutoPlay(item.key, index);
                // r.current?.scrollTo({ index, animated: false });
              }}
              selectedLed={selectedLine && selectedLinePosition === index}
            />
          );
        }}
        autoPlay={true}
        withAnimation={{
          type: 'timing',
          config: { duration: 15000, easing: Easing.linear },
        }}
        autoPlayReverse={autoPlayReverse}
      />
    </View>
  );
};

export default Interpolate;
