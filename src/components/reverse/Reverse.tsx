/* eslint-disable react-hooks/exhaustive-deps */
import { reverseMode } from '@config/mode';
import useBLE from '@hooks/useBLE';
import { glowAtom, ledAtom } from '@stores/led/led';
import { BLEConfig } from '@utils/ble';
import { useSend } from '@utils/send';
import { useMemoizedFn } from 'ahooks';
import { useAtom } from 'jotai';
import { get } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity } from 'react-native';
import Toast from 'react-native-root-toast';
import { View } from 'react-native-ui-lib';
const Reverse: FC<{
  mode: 'glow' | 'led';
  title: string;
  keyPoi: string;
}> = props => {
  const { title, keyPoi, mode } = props;
  const [reverse, setReverse] = useState(false);
  const { bleWrite } = useBLE();
  useEffect(() => {
    setReverse(false);
    setLedValue(prev => {
      return {
        ...prev,
        reverse: '',
      };
    });
  }, [title, keyPoi]);
  // console.log('&&&&&&', get(reverseMode, `${title}.${keyPoi}`));
  // useEffect(() => {
  //   const code = get(reverseMode, `${title}.${keyPoi}`);
  //   if (reverse && code) {
  //     const reverseCodeArr = (code as string).split('');
  //     reverseCodeArr[5] = '3';
  //     const reverseNewCode = reverseCodeArr.splice(7, 0, '00').join('');
  //     bleWrite(reverseNewCode);
  //   } else if (!reverse) {
  //     bleWrite(get(BLEConfig, `mode.${title}.${keyPoi}`) ?? '');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [bleWrite, mode, reverse]);
  const { t } = useTranslation();
  const [ledValue, setLedValue] = useAtom(ledAtom);
  const [glowValue, setGlowValue] = useAtom(glowAtom);
  const { queue, consumer } = useSend();
  const getCode = useMemoizedFn((code: string) => {
    if (mode === 'led') {
      // bleWrite(code);
      queue.enqueue(ledValue.speed);
      queue.enqueue(ledValue.title);
      queue.enqueue(code);
      setLedValue(prev => {
        return {
          ...prev,
          reverse: code,
        };
      });
    } else if (mode === 'glow') {
      queue.enqueue(glowValue.speed);
      queue.enqueue(ledValue.title);
      queue.enqueue(code);
      // bleWrite(code);
      setGlowValue(prev => {
        return {
          ...prev,
          reverse: code,
        };
      });
    }
    consumer.startConsuming(bleWrite);
  });
  const handleBtnRevise = useMemoizedFn(async () => {
    const code = get(reverseMode, `${title}.${keyPoi}`);
    if (code) {
      setReverse(true);
      getCode(code);
    } else {
      Toast.show(t('not-reverse'), { position: Toast.positions.CENTER });
    }
  });

  const handleCancelBtnRevise = useMemoizedFn(async () => {
    setReverse(false);
    getCode(get(BLEConfig, `mode.${title}.${keyPoi}`) ?? '');
  });

  return (
    <View
      style={{
        width: 110,
        height: 42,
        borderRadius: 24,
        backgroundColor: 'rgba(233, 202, 244, 1)',
        borderWidth: 1,
        borderColor: '#E9CAF4',
        padding: 3 / 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{
          width: 39,
          height: 39,
          borderRadius: 39,
          backgroundColor: !reverse ? 'black' : 'rgba(233, 182, 233, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={handleCancelBtnRevise}>
        <Image
          source={require('../../assets/progress-number/left.png')}
          style={{ width: 24, height: 23 }}
        />
      </TouchableOpacity>
      <Image
        source={require('../../assets/progress-number/arrow.png')}
        style={{
          width: 45 / 2,
          height: 29 / 2,
        }}
      />

      <TouchableOpacity
        style={{
          width: 39,
          height: 39,
          borderRadius: 39,
          backgroundColor: reverse ? 'black' : 'rgba(233, 182, 233, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: reverse ? 1 : 0.6,
        }}
        onPress={handleBtnRevise}>
        <Image
          source={require('../../assets/progress-number/right.png')}
          style={{ width: 24, height: 23 }}
        />
      </TouchableOpacity>
    </View>
  );
};
export default Reverse;
