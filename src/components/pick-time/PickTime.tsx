import PickerModal, {
  PickerModalRef,
} from '@components/picker-modal/PickerModal';
import useBLE from '@hooks/useBLE';
import { TIME } from '@pages/music-screen/config';
import React, { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Pressable, Image } from 'react-native';

export type PickTimeProps = {
  type: TIME;
  // handleSelectedTime: (timeType: TIME) => void;
  // selectedTimeMode: TIME;
};
const PickTime: FC<PickTimeProps> = props => {
  const { type } = props;
  const { bleWrite } = useBLE();
  const modalRef = useRef<PickerModalRef>(null);
  const [showTime, setShowTime] = useState({
    currentTime: [0, '00'],
    time: TIME.AM,
  });
  const handleCurrentSelectedTime = (chooseTime: {
    currentTime: [number, string];
    time: TIME;
  }) => {
    modalRef.current?.closeModal();
    setShowTime(chooseTime);
    const { time, currentTime } = chooseTime;
    /**
     * 57 - 时间段 - 长度 - 小时 - 分钟 - 61
     * 上午 57ab03082461
     * 下午 57ac03144561
     */
    bleWrite(
      `57${time === TIME.AM ? 'ab' : 'ac'}03${
        currentTime[0] < 10 ? '0' + currentTime[0] : currentTime[0]
      }${currentTime[1]}61`,
    );
  };
  const { t } = useTranslation();
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
      <Pressable onPress={() => modalRef.current?.openModal()}>
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
            {showTime.currentTime.join(':')}
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
        ref={modalRef}
        // type={selectedTimeMode}
        handleCurrentSelectedTime={handleCurrentSelectedTime}
      />
    </View>
  );
};
export default PickTime;
