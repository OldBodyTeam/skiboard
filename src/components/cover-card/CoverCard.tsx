import ClickProgressNumber from '@components/progress-number/ClickProgressNumber';
import Reverse from '@components/reverse/Reverse';
import ScrollSelected from '@components/scroll-selected/ScrollSelected';
import SVGNum from '@components/svg-num/SVGNum';
import useBLE from '@hooks/useBLE';
// import { glow } from '@config/glow';
// import { led } from '@config/led';
// import useBLE from '@hooks/useBLE';
import { useScreenSize } from '@hooks/useScreenSize';
// import { poi } from '@pages/draw/config';
import { glowModes, scrollData } from '@pages/light-glow-modes/utils';
import { defaultDataAtom, glowAtom, ledAtom } from '@stores/led/led';
import { BLEConfig } from '@utils/ble';
import { useSend } from '@utils/send';
import { useMemoizedFn, useMount } from 'ahooks';
import { useAtom } from 'jotai';
// import { BLEConfig } from '@utils/ble';
import { findIndex, get } from 'lodash';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
export type CoverCardProps = {
  selectedTitle: string;
  mode: 'glow' | 'led';
  scrollDataItem: string;
};
const CoverCard: FC<CoverCardProps> = props => {
  const { selectedTitle, mode, scrollDataItem } = props;
  console.log('***>', selectedTitle, scrollDataItem);
  const [a, setA] = useState(selectedTitle);
  const [keyPoi, setKeyPoi] = useState(scrollDataItem);
  const { bleWrite } = useBLE();
  const [ledValue, setLedValue] = useAtom(ledAtom);
  const [glowValue, setGlowValue] = useAtom(glowAtom);
  const { queue, consumer } = useSend();
  const getCode = useMemoizedFn((code: string) => {
    if (mode === 'led') {
      // bleWrite(code);
      queue.enqueue(ledValue.speed);
      ledValue.reverse ? queue.enqueue(ledValue.reverse) : null;
      queue.enqueue(code);
      setLedValue(() => {
        return {
          ...defaultDataAtom,
          title: code,
          reverse: '',
        };
      });
    } else if (mode === 'glow') {
      queue.enqueue(glowValue.speed);
      glowValue.reverse ? queue.enqueue(glowValue.reverse) : null;
      queue.enqueue(code);
      // bleWrite(code);
      setGlowValue(prev => {
        return {
          ...prev,
          title: code,
          reverse: '',
        };
      });
    }
    consumer.startConsuming(bleWrite);
  });
  const handleSelectedTitle = useMemoizedFn(async (m: string, poi: string) => {
    setA(m);
    setKeyPoi(poi);
    console.info('***>', get(BLEConfig, `mode.${m}.${poi}`));
    getCode(get(BLEConfig, `mode.${m}.${poi}`) ?? '');
  });
  useMount(async () => {
    getCode(get(BLEConfig, `mode.${selectedTitle}.${scrollDataItem}`) ?? '');
  });
  useEffect(() => {
    setA(selectedTitle);
  }, [selectedTitle]);
  useEffect(() => {
    setKeyPoi(scrollDataItem);
  }, [scrollDataItem]);
  const { width } = useScreenSize();
  const height = 720 / 2;
  const index =
    findIndex(scrollData, v => v.key === selectedTitle) === -1
      ? 1
      : findIndex(scrollData, v => v.key === selectedTitle) + 1;
  const { t } = useTranslation();

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
        <ScrollSelected
          title={a}
          handleSelectedTitle={handleSelectedTitle}
          value={keyPoi}
          key={selectedTitle}
        />

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
              {t('Reverse')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Reverse
              mode={mode}
              title={a}
              keyPoi={keyPoi}
              key={selectedTitle + '' + scrollDataItem}
            />

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
                <SVGNum num={index} />
              </View>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 11,
                  color: 'rgba(51, 51, 51, 0.3)',
                }}>
                {index}
                <Text style={{ color: 'rgba(51, 51, 51, 1)' }}>of 7</Text>
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
              {t('Speed')}
            </Text>
          </View>
          {/* <ProgressNumber /> */}
          <ClickProgressNumber mode={mode} />
        </View>
      </View>
    </>
  );
};
export default CoverCard;
