import ClickProgressNumber from '@components/progress-number/ClickProgressNumber';
import Reverse from '@components/reverse/Reverse';
import ScrollSelected from '@components/scroll-selected/ScrollSelected';
import SVGNum from '@components/svg-num/SVGNum';
import { useScreenSize } from '@hooks/useScreenSize';
import { scrollData } from '@pages/light-glow-modes/utils';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
export type CoverCardProps = { selectedTitle: string };
const CoverCard: FC<CoverCardProps> = props => {
  const { selectedTitle } = props;
  const { width } = useScreenSize();
  const height = 720 / 2;
  return (
    <>
      <View
        style={{
          position: 'absolute',
          left: 17,
          top: 36,
          transform: [{ rotateZ: '6deg' }],
          backgroundColor: 'rgba(179, 180, 180, 1)',
          width: width - 34,
          height,
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
          height,
          borderRadius: 33,
          zIndex: -20,
        }}
      />
      <View
        style={{
          width: width - 34,
          height,
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
            marginTop: 16,
          }}>
          <View
            style={{
              marginBottom: 29 / 2,
            }}>
            <Text
              style={{
                color: '#333333',
                fontWeight: 'bold',
                height: 14,
                lineHeight: 17,
              }}>
              Reverse
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Reverse />

            <View
              style={{
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 44,
                  height: 44,
                }}>
                <SVGNum num={1} />
              </View>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 11,
                  color: 'rgba(51, 51, 51, 0.3)',
                }}>
                1 <Text style={{ color: 'rgba(51, 51, 51, 1)' }}>of 7</Text>
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                color: '#333333',
                fontWeight: 'bold',
                height: 14,
                lineHeight: 17,
                marginBottom: 20,
                marginTop: 31 / 2,
              }}>
              Speed
            </Text>
          </View>
          {/* <ProgressNumber /> */}
          <ClickProgressNumber />
        </View>
      </View>
    </>
  );
};
export default CoverCard;
