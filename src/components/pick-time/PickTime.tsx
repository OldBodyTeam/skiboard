import PickerModal, {
  PickerModalRef,
} from '@components/picker-modal/PickerModal';
import { TIME } from '@pages/music-screen/config';
import React, { FC, useRef, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';

export type PickTimeProps = {
  type: TIME;
  handleSelectedTime: (timeType: TIME) => void;
  selectedTimeMode: TIME;
};
const PickTime: FC<PickTimeProps> = props => {
  const { type, selectedTimeMode, handleSelectedTime } = props;
  const modalRef = useRef<PickerModalRef>(null);
  const handleCurrentSelectedTime = () => {
    modalRef.current?.closeModal();
  };

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
            6:00
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.6)',
              marginRight: 12,
            }}>
            {type}
          </Text>
          <Image
            source={require('../../assets/music/down-arrow.png')}
            style={{ width: 9, height: 5 }}
          />
        </View>
      </Pressable>
      <PickerModal
        ref={modalRef}
        type={selectedTimeMode}
        handleCurrentSelectedTime={handleCurrentSelectedTime}
        handleMode={handleSelectedTime}
        selectedTimeMode={selectedTimeMode}
      />
    </View>
  );
};
export default PickTime;
