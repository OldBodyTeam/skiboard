import PickerModal, {
  PickerModalRef,
} from '@components/picker-modal/PickerModal';
import useBLE from '@hooks/useBLE';
import { TIME } from '@pages/music-screen/config';
import { getHex } from '@utils/hex';
import React, { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Pressable, Image } from 'react-native';
import Toast from 'react-native-root-toast';
export const sleep = async (timer = 400) => {
  return new Promise(resolve => {
    setTimeout(resolve, timer);
  });
};
export type PickTimeProps = {
  type: TIME;
  numType: number;
  onHandleTime: (a: any, b: any) => void;
  switchValue: boolean;
  // handleSelectedTime: (timeType: TIME) => void;
  // selectedTimeMode: TIME;
};
const PickTime: FC<PickTimeProps> = props => {
  const { type, numType, onHandleTime, switchValue } = props;
  const modalRef = useRef<PickerModalRef>(null);
  const [showTime, setShowTime] = useState({
    currentTime: [0, 0],
    time: TIME.AM,
  });
  const [pointer, setPointer] = useState<Map<string, [number, number]>>(
    new Map(),
  );
  const handleCurrentSelectedTime = async (chooseTime: {
    currentTime: [number, number];
    time: TIME;
    numType1: number;
  }) => {
    console.log('chooseTime', chooseTime, pointer.size);
    modalRef.current?.closeModal();
    setShowTime(chooseTime);
    const { time, currentTime, numType1 } = chooseTime;
    const key = `${time}-${numType1}`;
    setPointer(prev => {
      prev.set(key, currentTime);
      return new Map(prev);
    });
    onHandleTime(numType1, { type: time, currentTime });

    console.log(pointer);
    // await bleWrite('57ae020161');
    // await sleep();
    // if (numType1 === 1) {
    // } else {
    //   const am = time === TIME.AM ? currentTime : pointer.get(key) ?? [0, 0];
    // }
    // const pm = time === TIME.PM ? currentTime : pointer.get(key) ?? [0, 0];
    // await bleWrite(`57ae05${getHex(am[0])}${am[1]}00ff61`);
    // await sleep();
    // await bleWrite(`57ae05${getHex(pm[0])}${pm[1]}00ff61`);
    /**
     * 57 - 时间段 - 长度 - 小时 - 分钟 - 61
     * 上午 57ab03082461
     * 下午 57ac03144561
     */
    //57 ae 05 01 01 00 80 61
    // 57 ae 05 0E 0E 01 80 61
    // time === TIME.AM
    //   ? bleWrite(`57ae05${getHex(currentTime[0])}${currentTime[0]}00ff61`)
    //   : bleWrite(`57ae05${getHex(currentTime[0])}${currentTime[0]}01ff61`);
  };
  const { t } = useTranslation();
  console.log('time', `${type}-${numType}`);
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.6)',
          marginRight: 12,
        }}>
        {type === TIME.AM ? 'From' : 'To'}
      </Text>
      <Pressable
        onPress={() => {
          if (switchValue) {
            modalRef.current?.openModal();
          } else {
            Toast.show(t('open-swiutch'), { position: Toast.positions.CENTER });
          }
        }}>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 14,
            backgroundColor: 'rgba(118,118,188,0.19)',
            minWidth: 101,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
              marginRight: 13 / 2,
            }}>
            {showTime.currentTime
              .map(v => {
                return v < 10 ? '0' + v : v;
              })
              .join(':')}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.6)',
              marginRight: 12,
            }}>
            {showTime.time === TIME.AM ? t('am') : t('pm')}
          </Text>
          <Image
            source={require('../../assets/music/down-arrow.png')}
            style={{ width: 9, height: 5 }}
          />
        </View>
      </Pressable>
      <PickerModal
        a={pointer.get(`${showTime.time}-${numType}`) ?? [0, 0]}
        ref={modalRef}
        numType={numType}
        // type={selectedTimeMode}
        handleCurrentSelectedTime={handleCurrentSelectedTime}
      />
    </View>
  );
};
export default PickTime;
