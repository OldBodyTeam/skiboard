import Header from '@components/header/Header';
import Interpolate from '@components/interpolate/Interpolate';
import ScrollSelected from '@components/scroll-selected/ScrollSelected';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, Text } from 'react-native';
import { RootStackParamList } from 'route.config';
import {
  CarouselOneData,
  CarouselThreeData,
  CarouselTwoData,
  scrollData,
} from './utils';
import { useScreenSize } from '@hooks/useScreenSize';
import ProgressNumber from '@components/progress-number/ProgressNumber';
import Reverse from '@components/reverse/Reverse';

type LightGlowModesProps = NativeStackScreenProps<
  RootStackParamList,
  'LightGlowModes'
> &
  PropsWithChildren<{ name?: string }>;
const LightGlowModes = (props: LightGlowModesProps) => {
  const { navigation } = props;

  const back = () => {
    navigation.goBack();
  };

  const ScrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    ScrollViewRef.current?.scrollTo({ y: -43, animated: true });
  }, []);
  const { width } = useScreenSize();
  const [selectedInterpolate, setSelectedInterpolate] = useState({
    one: true,
    two: true,
    three: true,
  });
  const [selectedTitle, setSelectedTitle] = useState('');
  const handleAutoPlay = (id: string, title: string, index?: number) => {
    setSelectedInterpolate(() => {
      return {
        one: true,
        two: true,
        three: true,
        [id]: false,
      };
    });
    setSelectedTitle(title);
    console.log('xxxx', index);
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
          <Header title="LightGlow Modes" handlePress={back} />
          <Interpolate
            style={{ marginTop: 20 }}
            carouselData={CarouselOneData}
            autoPlay={selectedInterpolate.one}
            handleAutoPlay={(title, index) =>
              handleAutoPlay('one', title, index)
            }
          />
          <Interpolate
            autoPlayReverse
            style={{ marginVertical: 20 }}
            carouselData={CarouselTwoData}
            autoPlay={selectedInterpolate.two}
            handleAutoPlay={(title, index) =>
              handleAutoPlay('two', title, index)
            }
          />
          <Interpolate
            carouselData={CarouselThreeData}
            autoPlay={selectedInterpolate.three}
            handleAutoPlay={(title, index) =>
              handleAutoPlay('three', title, index)
            }
          />
          <ScrollView
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1, paddingBottom: 40, marginTop: 30 }}>
            <View
              style={{
                position: 'absolute',
                left: 17,
                top: 36,
                transform: [{ rotateZ: '6deg' }],
                backgroundColor: 'rgba(179, 180, 180, 1)',
                width: width - 34,
                height: 597 / 2,
                borderRadius: 33,
                zIndex: -10,
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: 17,
                top: 36,
                transform: [{ rotateZ: '12deg' }],
                backgroundColor: 'rgba(65, 66, 66, 1)',
                width: width - 34,
                height: 597 / 2,
                borderRadius: 33,
                zIndex: -20,
              }}
            />
            <View
              style={{
                width: width - 34,
                height: 597 / 2,
                borderRadius: 33,
                backgroundColor: 'white',
                paddingHorizontal: 20,
                paddingTop: 24,
                paddingBottom: 26,
                marginHorizontal: 17,
                position: 'relative',
                marginTop: 36,
                zIndex: 1,
              }}>
              <ScrollSelected scrollData={scrollData} title={selectedTitle} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 46,
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text
                    style={{
                      color: '#333333',
                      fontWeight: 'bold',
                      height: 14,
                      lineHeight: 17,
                      marginBottom: 16,
                    }}>
                    Reverse
                  </Text>
                  <Reverse />
                </View>
                <View>
                  <Text
                    style={{
                      color: '#333333',
                      fontWeight: 'bold',
                      height: 14,
                      lineHeight: 17,
                      marginBottom: 16,
                    }}>
                    Speed
                  </Text>
                  <ProgressNumber />
                </View>
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default LightGlowModes;
