import React, { useEffect, useState } from 'react';
import { BlurView } from '@react-native-community/blur';
import { Modal, StyleSheet, Text, View } from 'react-native';

const PickerModal = () => {
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <BlurView
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
        blurAmount={10}
      />
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: 350,
          borderRadius: 10,
          overflow: 'hidden',
          left: 0,
          bottom: 0,
        }}>
        <BlurView
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
          }}
          blurAmount={32}
          blurRadius={10}
        />
      </View>
    </Modal>
  );
};
export default PickerModal;
