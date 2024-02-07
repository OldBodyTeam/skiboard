import CoverCard from '@components/cover-card/CoverCard';
import Header from '@components/header/Header';
import Interpolate from '@components/interpolate/Interpolate';
import {
  CarouselOneData,
  CarouselTwoData,
  CarouselThreeData,
} from '@pages/light-glow-modes/utils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { View, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { RootStackParamList } from 'route.config';
enum LINE {
  ONE = 'one',
  TWO = 'two',
  THREE = 'three',
}
type LEDStripsEffectsProps = NativeStackScreenProps<
  RootStackParamList,
  'LEDStripsEffects'
> &
  PropsWithChildren<{ name?: string }>;
const LEDStripsEffects = (props: LEDStripsEffectsProps) => {
  const { navigation } = props;

  const back = () => {
    navigation.goBack();
  };

  const ScrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    ScrollViewRef.current?.scrollTo({ y: -43, animated: true });
  }, []);
  const [selectedInterpolate, setSelectedInterpolate] = useState({
    one: true,
    two: true,
    three: true,
  });
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedLine, setSelectedLine] = useState<undefined | LINE>();
  const [selectedLinePosition, setSelectedLinePosition] = useState(-1);
  const handleAutoPlay = (id: LINE, title: string, index?: number) => {
    console.log(id, index);
    setSelectedInterpolate(() => {
      return {
        one: true,
        two: true,
        three: true,
        [id]: false,
      };
    });
    setSelectedTitle(title);
    setSelectedLine(id);
    setSelectedLinePosition(index!);
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(19, 20, 22, 1)',
        flexDirection: 'row',
      }}>
      <StatusBar />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="LED Strips Effects" handlePress={back} />
          <Interpolate
            style={{ marginTop: 20 }}
            carouselData={CarouselOneData}
            autoPlay={selectedInterpolate.one}
            handleAutoPlay={(title, index) =>
              handleAutoPlay(LINE.ONE, title, index)
            }
            selectedLine={LINE.ONE === selectedLine}
            selectedLinePosition={selectedLinePosition}
          />
          <Interpolate
            autoPlayReverse
            style={{ marginVertical: 20 }}
            carouselData={CarouselTwoData}
            autoPlay={selectedInterpolate.two}
            handleAutoPlay={(title, index) =>
              handleAutoPlay(LINE.TWO, title, index)
            }
            selectedLine={LINE.TWO === selectedLine}
            selectedLinePosition={selectedLinePosition}
          />
          <Interpolate
            carouselData={CarouselThreeData}
            autoPlay={selectedInterpolate.three}
            handleAutoPlay={(title, index) =>
              handleAutoPlay(LINE.THREE, title, index)
            }
            selectedLine={LINE.THREE === selectedLine}
            selectedLinePosition={selectedLinePosition}
          />
          <ScrollView
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1, paddingBottom: 40, marginTop: 30 }}>
            <CoverCard selectedTitle={selectedTitle} />
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default LEDStripsEffects;
