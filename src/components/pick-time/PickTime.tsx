import PickerModal, {
  PickerModalRef,
} from '@components/picker-modal/PickerModal';
import React, { FC, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
export type PickTimeProps = {
  type: 'AM' | 'PM';
};
const PickTime: FC<PickTimeProps> = props => {
  const { type } = props;
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
        To
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
            backgroundColor: '#767676',
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
        </View>
      </Pressable>
      <PickerModal
        ref={modalRef}
        type={type}
        handleCurrentSelectedTime={handleCurrentSelectedTime}
      />
    </View>
  );
};
export default PickTime;
